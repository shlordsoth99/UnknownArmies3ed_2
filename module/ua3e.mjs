/**
 * Unknown Armies 3rd Edition System for Foundry VTT
 * Based on the work of patrickbuck1988 and the UA community
 */

import { UA3E } from './config.mjs';
import { registerSystemSettings } from './settings.mjs';
import { UA3EActor } from './actors/actor.mjs';
import { UA3EItem } from './items/item.mjs';
import { UA3EActorSheet } from './actors/sheet.mjs';
import { UA3ENPCSheet } from './actors/npc-sheet.mjs';
import { UA3EItemSheet } from './items/sheet.mjs';
import { StressRoll, PercentileRoll } from './dice/dice.mjs';
import { preloadHandlebarsTemplates } from './apps/templates.mjs';
import { registerHandlebarsHelpers } from './apps/helpers.mjs';
import { registerSidebarHooks } from './apps/sidebar.mjs';
import { registerHotbarHooks } from './apps/hotbar.mjs';
import { registerTokenHUD } from './apps/token-hud.mjs';
import { registerCombatHooks, registerCombatSettings } from './apps/combat.mjs';

/* -------------------------------------------- */
/*  System Initialization                         */
/* -------------------------------------------- */

Hooks.once('init', async function() {
  console.log('%c Unknown Armies 3E %c | Initializing system...', 'background: #1a1a1a; color: #c9a84c; padding: 4px 8px; border-radius: 4px;', '');

  // Add UA3E namespace to global game object
  game.ua3e = {
    config: UA3E,
    dice: { StressRoll, PercentileRoll }
  };

  // Register System Settings
  registerSystemSettings();
  registerCombatSettings();

  // Define custom Document classes
  CONFIG.Actor.documentClass = UA3EActor;
  CONFIG.Item.documentClass = UA3EItem;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('unknown-armies-3e', UA3EActorSheet, {
    types: ['character'],
    makeDefault: true,
    label: 'UA3E.SheetCharacter'
  });
  Actors.registerSheet('unknown-armies-3e', UA3ENPCSheet, {
    types: ['npc'],
    makeDefault: true,
    label: 'UA3E.SheetNPC'
  });

  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('unknown-armies-3e', UA3EItemSheet, {
    makeDefault: true,
    label: 'UA3E.SheetItem'
  });

  // Register Handlebars helpers
  registerHandlebarsHelpers();

  // Preload templates
  await preloadHandlebarsTemplates();

  console.log('%c Unknown Armies 3E %c | System initialized', 'background: #1a1a1a; color: #c9a84c; padding: 4px 8px; border-radius: 4px;', '');
});

/* -------------------------------------------- */
/*  Ready Hook                                    */
/* -------------------------------------------- */

Hooks.once('ready', async function() {
  console.log('%c Unknown Armies 3E %c | Ready', 'background: #1a1a1a; color: #c9a84c; padding: 4px 8px; border-radius: 4px;', '');

  // Register UI hooks - MUST be after ready
  registerSidebarHooks();
  registerHotbarHooks();
  registerTokenHUD();
  registerCombatHooks();

  // Apply stress automation if enabled
  if (game.settings.get('unknown-armies-3e', 'autoStress')) {
    console.log('UA3E | Automatic stress tracking enabled');
  }

  // Welcome message for GM
  if (game.user.isGM) {
    console.log('UA3E | GM controls loaded');
  }
});

/* -------------------------------------------- */
/*  Chat Message Hooks                            */
/* -------------------------------------------- */

Hooks.on('renderChatMessage', (app, html, data) => {
  html.find('.ua3e-stress-result').click(async (event) => {
    const actorId = event.currentTarget.dataset.actorId;
    const gauge = event.currentTarget.dataset.gauge;
    const actor = game.actors.get(actorId);
    if (actor && actor.isOwner) {
      await actor.applyStressResult(gauge, event.currentTarget.dataset.result);
    }
  });
});

/* -------------------------------------------- */
/*  Scene Controls                                */
/* -------------------------------------------- */

Hooks.on('getSceneControlButtons', (controls) => {
  const tokenTools = controls.find(c => c.name === 'token');
  if (tokenTools) {
    tokenTools.tools.push({
      name: 'ua3e-stress',
      title: 'UA3E.QuickStressCheck',
      icon: 'fas fa-brain',
      visible: game.user.isGM || game.user.isOwner,
      onClick: () => {
        const controlled = canvas.tokens.controlled;
        if (controlled.length === 0) {
          ui.notifications.warn(game.i18n.localize('UA3E.NoTokensSelected'));
          return;
        }
        // Open stress dialog for selected tokens
        openQuickStressDialog();
      },
      button: true
    });
  }

  // Add UA3E-specific controls
  controls.push({
    name: 'ua3e',
    title: 'UA3E.UA3EControls',
    icon: 'fas fa-moon',
    layer: 'controls',
    tools: [
      {
        name: 'stress-check',
        title: 'UA3E.StressCheckTool',
        icon: 'fas fa-brain',
        onClick: () => openQuickStressDialog(),
        toggle: false
      }
    ],
    activeTool: ''
  });
});

/* -------------------------------------------- */
/*  Quick Dialog Helper                           */
/* -------------------------------------------- */

function openQuickStressDialog() {
  const controlled = canvas.tokens.controlled;
  if (controlled.length === 0) {
    ui.notifications.warn(game.i18n.localize('UA3E.NoTokensSelected'));
    return;
  }

  const gauges = [
    { key: 'violence', label: 'UA3E.GaugeViolence' },
    { key: 'helplessness', label: 'UA3E.GaugeHelplessness' },
    { key: 'theUnnatural', label: 'UA3E.GaugeUnnatural' },
    { key: 'isolation', label: 'UA3E.GaugeIsolation' },
    { key: 'self', label: 'UA3E.GaugeSelf' }
  ];

  const content = `
    <form class="ua3e-dialog">
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.SelectGauge')}</label>
        <div class="gauge-buttons">
          ${gauges.map(g => `
            <button type="button" class="gauge-select" data-gauge="${g.key}">
              ${game.i18n.localize(g.label)}
            </button>
          `).join('')}
        </div>
      </div>
    </form>
  `;

  const dialog = new Dialog({
    title: game.i18n.localize('UA3E.StressCheck'),
    content: content,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('UA3E.Cancel')
      }
    },
    render: (html) => {
      html.find('.gauge-select').click(async (event) => {
        const gauge = event.currentTarget.dataset.gauge;
        dialog.close();
        for (const token of controlled) {
          const actor = token.actor;
          if (actor && actor.type === 'character') {
            await actor.rollStressCheck(gauge);
          }
        }
      });
    }
  });

  dialog.render(true);
}

/* -------------------------------------------- */
/*  Utility Functions                             */
/* -------------------------------------------- */

export function getRollMode() {
  return game.settings.get('core', 'rollMode');
}

export async function rollPercentile(formula, data = {}, options = {}) {
  const roll = new PercentileRoll(formula, data, options);
  await roll.evaluate();
  return roll;
}

export async function rollStress(gauge, hardened = 0, options = {}) {
  const roll = new StressRoll(gauge, hardened, options);
  await roll.evaluate();
  return roll;
}