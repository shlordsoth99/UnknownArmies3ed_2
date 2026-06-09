/**
 * Unknown Armies 3E Token HUD
 * Custom right-click menu for tokens
 */

export function registerTokenHUD() {

  Hooks.on('renderTokenHUD', (app, html, data) => {
    const actor = app.object.actor;
    if (!actor || actor.type !== 'character') return;

    // Add UA3E-specific status effects
    const statusEffects = [
      { id: 'wounded', label: 'UA3E.StatusWounded', icon: 'fas fa-droplet' },
      { id: 'traumatized', label: 'UA3E.StatusTraumatized', icon: 'fas fa-brain' },
      { id: 'obsessed', label: 'UA3E.StatusObsessed', icon: 'fas fa-fire' },
      { id: 'hardened', label: 'UA3E.StatusHardened', icon: 'fas fa-shield-halved' },
      { id: 'broken', label: 'UA3E.StatusBroken', icon: 'fas fa-heart-crack' },
      { id: 'pursued', label: 'UA3E.StatusPursued', icon: 'fas fa-eye' }
    ];

    const statusPanel = html.find('.status-effects');

    statusEffects.forEach(effect => {
      const existing = statusPanel.find(`[data-status-id="${effect.id}"]`);
      if (existing.length === 0) {
        const btn = $(`
          <div class="control-icon ua3e-status" data-status-id="${effect.id}" title="${game.i18n.localize(effect.label)}">
            <i class="${effect.icon}"></i>
          </div>
        `);
        statusPanel.append(btn);

        btn.click(async () => {
          const token = app.object;
          const hasEffect = token.document.hasStatusEffect(effect.id);

          if (hasEffect) {
            await token.document.toggleActiveEffect({ id: effect.id }, { active: false });
          } else {
            await token.document.toggleActiveEffect({ 
              id: effect.id,
              label: game.i18n.localize(effect.label),
              icon: effect.icon
            }, { active: true });
          }
        });
      }
    });

    // Add UA3E action bar
    const colRight = html.find('.col.right');

    const ua3eActions = $(`
      <div class="ua3e-token-actions">
        <div class="control-icon" data-action="stress-check" title="${game.i18n.localize('UA3E.QuickStressCheck')}">
          <i class="fas fa-brain"></i>
        </div>
        <div class="control-icon" data-action="ability-roll" title="${game.i18n.localize('UA3E.QuickAbilityRoll')}">
          <i class="fas fa-dice-d20"></i>
        </div>
        <div class="control-icon" data-action="heal" title="${game.i18n.localize('UA3E.QuickHeal')}">
          <i class="fas fa-heart"></i>
        </div>
        <div class="control-icon" data-action="damage" title="${game.i18n.localize('UA3E.QuickDamage')}">
          <i class="fas fa-skull"></i>
        </div>
      </div>
    `);

    colRight.append(ua3eActions);

    // Action handlers
    ua3eActions.find('[data-action="stress-check"]').click(() => {
      openTokenStressDialog(actor);
    });

    ua3eActions.find('[data-action="ability-roll"]').click(() => {
      openTokenAbilityDialog(actor);
    });

    ua3eActions.find('[data-action="heal"]').click(() => {
      openTokenHealDialog(actor);
    });

    ua3eActions.find('[data-action="damage"]').click(() => {
      openTokenDamageDialog(actor);
    });

    // Add health/stability bars to HUD
    const health = actor.system.health?.value || 0;
    const healthMax = actor.system.health?.max || 100;
    const stability = actor.system.stability?.value || 0;
    const stabilityMax = actor.system.stability?.max || 100;

    const resourceBar = $(`
      <div class="ua3e-token-resources">
        <div class="resource-bar health-bar-hud">
          <div class="resource-fill" style="width: ${(health / healthMax) * 100}%"></div>
          <span class="resource-label">${health}/${healthMax}</span>
        </div>
        <div class="resource-bar stability-bar-hud">
          <div class="resource-fill" style="width: ${(stability / stabilityMax) * 100}%"></div>
          <span class="resource-label">${stability}/${stabilityMax}</span>
        </div>
      </div>
    `);

    html.find('.col.middle').append(resourceBar);
  });
}

/**
 * Open stress check dialog for a specific token
 */
function openTokenStressDialog(actor) {
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
    title: `${actor.name} — ${game.i18n.localize('UA3E.StressCheck')}`,
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
 * Open ability roll dialog for a specific token
 */
function openTokenAbilityDialog(actor) {
  const abilities = ['connect', 'knowledge', 'lie', 'notice', 'pursuit', 'struggle'];

  const content = `
    <form class="ua3e-dialog">
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.SelectAbility')}</label>
        <select name="ability">
          ${abilities.map(a => `
            <option value="${a}">${game.i18n.localize(`UA3E.Ability${a.charAt(0).toUpperCase() + a.slice(1)}`)} (${actor.system.abilities[a]?.value || 15}%)</option>
          `).join('')}
        </select>
      </div>
    </form>
  `;

  new Dialog({
    title: `${actor.name} — ${game.i18n.localize('UA3E.AbilityCheck')}`,
    content: content,
    buttons: {
      roll: {
        icon: '<i class="fas fa-dice-d20"></i>',
        label: game.i18n.localize('UA3E.Roll'),
        callback: async (html) => {
          const ability = html.find('[name="ability"]').val();
          await actor.rollAbility(ability);
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
 * Open heal dialog for a specific token
 */
function openTokenHealDialog(actor) {
  const content = `
    <form class="ua3e-dialog">
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.HealAmount')}</label>
        <input type="number" name="amount" value="5" min="1" max="100" />
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.HealType')}</label>
        <select name="type">
          <option value="health">${game.i18n.localize('UA3E.Health')} (${actor.system.health?.value || 0}/${actor.system.health?.max || 100})</option>
          <option value="stability">${game.i18n.localize('UA3E.Stability')} (${actor.system.stability?.value || 0}/${actor.system.stability?.max || 100})</option>
        </select>
      </div>
    </form>
  `;

  new Dialog({
    title: `${actor.name} — ${game.i18n.localize('UA3E.Heal')}`,
    content: content,
    buttons: {
      heal: {
        icon: '<i class="fas fa-heart"></i>',
        label: game.i18n.localize('UA3E.Heal'),
        callback: async (html) => {
          const amount = parseInt(html.find('[name="amount"]').val());
          const type = html.find('[name="type"]').val();

          if (type === 'health') {
            await actor.healDamage(amount);
          } else {
            const current = actor.system.stability.value;
            const max = actor.system.stability.max;
            await actor.update({ 'system.stability.value': Math.min(max, current + amount) });
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
 * Open damage dialog for a specific token
 */
function openTokenDamageDialog(actor) {
  const content = `
    <form class="ua3e-dialog">
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.DamageAmount')}</label>
        <input type="number" name="amount" value="5" min="1" max="100" />
      </div>
      <div class="form-group">
        <label>${game.i18n.localize('UA3E.DamageType')}</label>
        <select name="type">
          <option value="health">${game.i18n.localize('UA3E.Health')} (${actor.system.health?.value || 0}/${actor.system.health?.max || 100})</option>
          <option value="stability">${game.i18n.localize('UA3E.Stability')} (${actor.system.stability?.value || 0}/${actor.system.stability?.max || 100})</option>
        </select>
      </div>
    </form>
  `;

  new Dialog({
    title: `${actor.name} — ${game.i18n.localize('UA3E.Damage')}`,
    content: content,
    buttons: {
      damage: {
        icon: '<i class="fas fa-skull"></i>',
        label: game.i18n.localize('UA3E.ApplyDamage'),
        callback: async (html) => {
          const amount = parseInt(html.find('[name="amount"]').val());
          const type = html.find('[name="type"]').val();

          if (type === 'health') {
            await actor.takeDamage(amount);
          } else {
            const current = actor.system.stability.value;
            await actor.update({ 'system.stability.value': Math.max(0, current - amount) });
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