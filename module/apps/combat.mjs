/**
 * Unknown Armies 3E Combat Integration
 * Custom combat tracker with UA3E-specific features
 */

export function registerCombatHooks() {

  /**
   * Render custom combat tracker
   */
  Hooks.on('renderCombatTracker', (app, html, data) => {
    const combat = app.viewed;
    if (!combat) return;

    // Add UA3E-specific columns to combatants
    combat.combatants.forEach(combatant => {
      const row = html.find(`.combatant[data-combatant-id="${combatant.id}"]`);
      if (!row.length) return;

      const actor = combatant.actor;
      if (!actor) return;

      // Add health/stability display
      const health = actor.system.health?.value || 0;
      const healthMax = actor.system.health?.max || 100;
      const stability = actor.system.stability?.value || 0;
      const stabilityMax = actor.system.stability?.max || 100;

      const resourceDisplay = $(`
        <div class="ua3e-combat-resources">
          <div class="combat-health" title="${game.i18n.localize('UA3E.Health')}">
            <i class="fas fa-heart"></i>
            <span class="health-value ${health <= healthMax * 0.25 ? 'critical' : ''}">${health}</span>
          </div>
          <div class="combat-stability" title="${game.i18n.localize('UA3E.Stability')}">
            <i class="fas fa-brain"></i>
            <span class="stability-value ${stability <= stabilityMax * 0.25 ? 'critical' : ''}">${stability}</span>
          </div>
        </div>
      `);

      row.find('.token-initiative').after(resourceDisplay);

      // Add stress check button for GM
      if (game.user.isGM) {
        const stressBtn = $(`
          <button class="combat-stress-btn" title="${game.i18n.localize('UA3E.StressCheck')}">
            <i class="fas fa-brain"></i>
          </button>
        `);

        stressBtn.click(() => {
          openCombatStressDialog(actor);
        });

        row.find('.combatant-controls').append(stressBtn);
      }
    });

    // Add round info with UA3E flavor
    const roundInfo = html.find('#combat-round');
    if (roundInfo.length && combat.round > 0) {
      const roundFlavor = getRoundFlavor(combat.round);
      roundInfo.append(`<span class="ua3e-round-flavor">${roundFlavor}</span>`);
    }
  });

  /**
   * Custom initiative roll message
   */
  Hooks.on('preCreateChatMessage', (message, data, options, userId) => {
    if (message.type === CONST.CHAT_MESSAGE_TYPES.ROLL && message.flavor?.includes('Initiative')) {
      // Enhance initiative roll messages
      const actor = game.actors.get(message.speaker?.actor);
      if (actor && actor.type === 'character') {
        const speed = actor.system.attributes?.speed?.value || 50;
        message.flavor = `${actor.name} — ${game.i18n.localize('UA3E.Initiative')} (SPD ${speed})`;
      }
    }
  });

  /**
   * Add combat settings
   */
  Hooks.on('renderCombatTrackerConfig', (app, html, data) => {
    const form = html.find('form');

    const ua3eSettings = $(`
      <fieldset class="ua3e-combat-settings">
        <legend>${game.i18n.localize('UA3E.CombatSettings')}</legend>

        <div class="form-group">
          <label>${game.i18n.localize('UA3E.AutoStressOnDamage')}</label>
          <input type="checkbox" name="autoStressOnDamage" ${game.settings.get('unknown-armies-3e', 'autoStressOnDamage') ? 'checked' : ''} />
          <p class="hint">${game.i18n.localize('UA3E.AutoStressOnDamageHint')}</p>
        </div>

        <div class="form-group">
          <label>${game.i18n.localize('UA3E.StressGaugeForDamage')}</label>
          <select name="stressGaugeForDamage">
            <option value="violence">${game.i18n.localize('UA3E.GaugeViolence')}</option>
            <option value="helplessness">${game.i18n.localize('UA3E.GaugeHelplessness')}</option>
          </select>
        </div>

        <div class="form-group">
          <label>${game.i18n.localize('UA3E.ShowStabilityInCombat')}</label>
          <input type="checkbox" name="showStabilityInCombat" ${game.settings.get('unknown-armies-3e', 'showStabilityInCombat') ? 'checked' : ''} />
        </div>
      </fieldset>
    `);

    form.append(ua3eSettings);
  });
}

/**
 * Get flavor text for combat round
 */
function getRoundFlavor(round) {
  const flavors = [
    '', // Round 0
    game.i18n.localize('UA3E.RoundFlavor1'),
    game.i18n.localize('UA3E.RoundFlavor2'),
    game.i18n.localize('UA3E.RoundFlavor3'),
    game.i18n.localize('UA3E.RoundFlavor4'),
    game.i18n.localize('UA3E.RoundFlavor5')
  ];

  return flavors[round] || game.i18n.localize('UA3E.RoundFlavorDefault');
}

/**
 * Open stress dialog for combatant
 */
function openCombatStressDialog(actor) {
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
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.Reason')}</label>
        <input type="text" name="reason" placeholder="${game.i18n.localize('UA3E.StressReasonPlaceholder')}" />
      </div>
    </form>
  `;

  const dialog = new Dialog({
    title: `${actor.name} — ${game.i18n.localize('UA3E.CombatStressCheck')}`,
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
        await actor.rollStressCheck(gauge);
      });
    }
  });

  dialog.render(true);
}

/**
 * Register combat settings
 */
export function registerCombatSettings() {
  game.settings.register('unknown-armies-3e', 'autoStressOnDamage', {
    name: 'UA3E.AutoStressOnDamageName',
    hint: 'UA3E.AutoStressOnDamageHint',
    scope: 'world',
    config: false,
    type: Boolean,
    default: false
  });

  game.settings.register('unknown-armies-3e', 'stressGaugeForDamage', {
    name: 'UA3E.StressGaugeForDamageName',
    hint: 'UA3E.StressGaugeForDamageHint',
    scope: 'world',
    config: false,
    type: String,
    default: 'violence',
    choices: {
      'violence': 'UA3E.GaugeViolence',
      'helplessness': 'UA3E.GaugeHelplessness'
    }
  });

  game.settings.register('unknown-armies-3e', 'showStabilityInCombat', {
    name: 'UA3E.ShowStabilityInCombatName',
    hint: 'UA3E.ShowStabilityInCombatHint',
    scope: 'world',
    config: false,
    type: Boolean,
    default: true
  });
}