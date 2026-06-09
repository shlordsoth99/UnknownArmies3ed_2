/**
 * Unknown Armies 3E Hotbar Integration
 * Custom macro slots and quick actions
 */

export function registerHotbarHooks() {

  /**
   * Add custom context menu to hotbar slots
   */
  Hooks.on('renderHotbar', (app, html, data) => {
    // Add UA3E-specific quick actions to empty slots
    const slots = html.find('.macro');

    slots.each((index, slot) => {
      const $slot = $(slot);

      // Add right-click context menu for empty slots
      if (!$slot.find('.macro-icon').attr('src') || $slot.find('.macro-icon').attr('src').includes('null')) {
        $slot.addClass('ua3e-empty-slot');

        $slot.on('contextmenu', async (event) => {
          event.preventDefault();

          // Show quick action menu
          const menu = new ContextMenu($(event.currentTarget), '.ua3e-empty-slot', [
            {
              name: game.i18n.localize('UA3E.QuickStressCheck'),
              icon: '<i class="fas fa-brain"></i>',
              callback: () => {
                openStressCheckDialog();
              }
            },
            {
              name: game.i18n.localize('UA3E.QuickAbilityRoll'),
              icon: '<i class="fas fa-dice-d20"></i>',
              callback: () => {
                openAbilityRollDialog();
              }
            },
            {
              name: game.i18n.localize('UA3E.QuickInitiative'),
              icon: '<i class="fas fa-bolt"></i>',
              callback: () => {
                rollInitiativeForSelected();
              }
            },
            {
              name: game.i18n.localize('UA3E.QuickHeal'),
              icon: '<i class="fas fa-heart"></i>',
              callback: () => {
                openHealDialog();
              }
            }
          ]);

          menu.render(event);
        });
      }
    });
  });

  /**
   * Add UA3E controls to the bottom control bar
   */
  Hooks.on('getSceneControlButtons', (controls) => {
    // Add UA3E tools to the token controls
    const tokenTools = controls.find(c => c.name === 'token');
    if (tokenTools) {
      tokenTools.tools.push({
        name: 'ua3e-stress',
        title: 'UA3E.QuickStressCheck',
        icon: 'fas fa-brain',
        visible: game.user.isGM || game.user.isOwner,
        onClick: () => {
          openStressCheckDialog();
        },
        button: true
      });

      tokenTools.tools.push({
        name: 'ua3e-heal',
        title: 'UA3E.QuickHeal',
        icon: 'fas fa-heart',
        visible: game.user.isGM || game.user.isOwner,
        onClick: () => {
          openHealDialog();
        },
        button: true
      });

      tokenTools.tools.push({
        name: 'ua3e-damage',
        title: 'UA3E.QuickDamage',
        icon: 'fas fa-skull',
        visible: game.user.isGM || game.user.isOwner,
        onClick: () => {
          openDamageDialog();
        },
        button: true
      });
    }

    // Add UA3E-specific scene controls
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
          onClick: () => openStressCheckDialog(),
          toggle: false
        },
        {
          name: 'reality-anchor',
          title: 'UA3E.RealityAnchor',
          icon: 'fas fa-anchor',
          onClick: () => toggleRealityAnchor(),
          toggle: true
        },
        {
          name: 'obsession-mode',
          title: 'UA3E.ObsessionMode',
          icon: 'fas fa-fire',
          onClick: () => toggleObsessionMode(),
          toggle: true
        }
      ],
      activeTool: ''
    });
  });
}

/**
 * Open Stress Check dialog for selected tokens
 */
function openStressCheckDialog() {
  const controlled = canvas.tokens.controlled;
  if (controlled.length === 0) {
    ui.notifications.warn(game.i18n.localize('UA3E.NoTokensSelected'));
    return;
  }

  const gauges = [
    { key: 'violence', label: 'UA3E.GaugeViolence', color: '#8B0000' },
    { key: 'helplessness', label: 'UA3E.GaugeHelplessness', color: '#4B0082' },
    { key: 'theUnnatural', label: 'UA3E.GaugeUnnatural', color: '#006400' },
    { key: 'isolation', label: 'UA3E.GaugeIsolation', color: '#8B4513' },
    { key: 'self', label: 'UA3E.GaugeSelf', color: '#2F4F4F' }
  ];

  const content = `
    <form class="ua3e-dialog">
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.SelectGauge')}</label>
        <div class="gauge-buttons">
          ${gauges.map(g => `
            <button type="button" class="gauge-select" data-gauge="${g.key}" style="border-color: ${g.color}; color: ${g.color}">
              <i class="fas fa-circle"></i> ${game.i18n.localize(g.label)}
            </button>
          `).join('')}
        </div>
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.AffectedTokens')}</label>
        <div class="token-list">
          ${controlled.map(t => `
            <div class="token-item">
              <img src="${t.document.texture.src}" width="30" height="30" />
              <span>${t.name}</span>
            </div>
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

/**
 * Open Ability Roll dialog
 */
function openAbilityRollDialog() {
  const controlled = canvas.tokens.controlled;
  if (controlled.length === 0) {
    ui.notifications.warn(game.i18n.localize('UA3E.NoTokensSelected'));
    return;
  }

  const abilities = ['connect', 'knowledge', 'lie', 'notice', 'pursuit', 'struggle'];

  const content = `
    <form class="ua3e-dialog">
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.SelectAbility')}</label>
        <select name="ability">
          ${abilities.map(a => `<option value="${a}">${game.i18n.localize(`UA3E.Ability${a.charAt(0).toUpperCase() + a.slice(1)}`)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.AffectedTokens')}</label>
        <div class="token-list">
          ${controlled.map(t => `
            <div class="token-item">
              <img src="${t.document.texture.src}" width="30" height="30" />
              <span>${t.name}</span>
            </div>
          `).join('')}
        </div>
      </div>
    </form>
  `;

  new Dialog({
    title: game.i18n.localize('UA3E.AbilityCheck'),
    content: content,
    buttons: {
      roll: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: game.i18n.localize('UA3E.Roll'),
        callback: async (html) => {
          const ability = html.find('[name="ability"]').val();

          for (const token of controlled) {
            const actor = token.actor;
            if (actor) {
              await actor.rollAbility(ability);
            }
          }
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('UA3E.Cancel')
      }
    }
  }).render(true);
}

/**
 * Roll initiative for selected tokens
 */
async function rollInitiativeForSelected() {
  const controlled = canvas.tokens.controlled;
  if (controlled.length === 0) {
    ui.notifications.warn(game.i18n.localize('UA3E.NoTokensSelected'));
    return;
  }

  const combat = game.combat;
  if (!combat) {
    ui.notifications.warn(game.i18n.localize('UA3E.NoActiveCombat'));
    return;
  }

  for (const token of controlled) {
    const combatant = combat.combatants.find(c => c.tokenId === token.id);
    if (combatant) {
      await combatant.rollInitiative();
    }
  }
}

/**
 * Open heal dialog
 */
function openHealDialog() {
  const controlled = canvas.tokens.controlled;
  if (controlled.length === 0) {
    ui.notifications.warn(game.i18n.localize('UA3E.NoTokensSelected'));
    return;
  }

  const content = `
    <form class="ua3e-dialog">
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.HealAmount')}</label>
        <input type="number" name="amount" value="5" min="1" max="100" />
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.HealType')}</label>
        <select name="type">
          <option value="health">${game.i18n.localize('UA3E.Health')}</option>
          <option value="stability">${game.i18n.localize('UA3E.Stability')}</option>
        </select>
      </div>
    </form>
  `;

  new Dialog({
    title: game.i18n.localize('UA3E.Heal'),
    content: content,
    buttons: {
      heal: {
        icon: '<i class="fas fa-heart"></i>',
        label: game.i18n.localize('UA3E.Heal'),
        callback: async (html) => {
          const amount = parseInt(html.find('[name="amount"]').val());
          const type = html.find('[name="type"]').val();

          for (const token of controlled) {
            const actor = token.actor;
            if (!actor) continue;

            if (type === 'health') {
              await actor.healDamage(amount);
            } else {
              const current = actor.system.stability.value;
              const max = actor.system.stability.max;
              await actor.update({ 'system.stability.value': Math.min(max, current + amount) });
            }
          }
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('UA3E.Cancel')
      }
    }
  }).render(true);
}

/**
 * Open damage dialog
 */
function openDamageDialog() {
  const controlled = canvas.tokens.controlled;
  if (controlled.length === 0) {
    ui.notifications.warn(game.i18n.localize('UA3E.NoTokensSelected'));
    return;
  }

  const content = `
    <form class="ua3e-dialog">
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.DamageAmount')}</label>
        <input type="number" name="amount" value="5" min="1" max="100" />
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.DamageType')}</label>
        <select name="type">
          <option value="health">${game.i18n.localize('UA3E.Health')}</option>
          <option value="stability">${game.i18n.localize('UA3E.Stability')}</option>
        </select>
      </div>
    </form>
  `;

  new Dialog({
    title: game.i18n.localize('UA3E.Damage'),
    content: content,
    buttons: {
      damage: {
        icon: '<i class="fas fa-skull"></i>',
        label: game.i18n.localize('UA3E.ApplyDamage'),
        callback: async (html) => {
          const amount = parseInt(html.find('[name="amount"]').val());
          const type = html.find('[name="type"]').val();

          for (const token of controlled) {
            const actor = token.actor;
            if (!actor) continue;

            if (type === 'health') {
              await actor.takeDamage(amount);
            } else {
              const current = actor.system.stability.value;
              await actor.update({ 'system.stability.value': Math.max(0, current - amount) });
            }
          }
        }
      },
      cancel: {
        icon: '<i class="fas fa-times"></i>',
        label: game.i18n.localize('UA3E.Cancel')
      }
    }
  }).render(true);
}

/**
 * Toggle reality anchor visualization (GM only)
 */
function toggleRealityAnchor() {
  if (!game.user.isGM) return;

  const active = canvas.controls.getTool('reality-anchor')?.active;

  if (!active) {
    // Apply reality anchor effect to scene
    ui.notifications.info(game.i18n.localize('UA3E.RealityAnchorActive'));
  } else {
    ui.notifications.info(game.i18n.localize('UA3E.RealityAnchorInactive'));
  }
}

/**
 * Toggle obsession mode highlight
 */
function toggleObsessionMode() {
  const active = canvas.controls.getTool('obsession-mode')?.active;

  document.body.classList.toggle('ua3e-obsession-mode', !active);

  if (!active) {
    ui.notifications.info(game.i18n.localize('UA3E.ObsessionModeActive'));
  } else {
    ui.notifications.info(game.i18n.localize('UA3E.ObsessionModeInactive'));
  }
}