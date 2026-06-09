/**
 * Unknown Armies 3E Character Sheet
 * Player character sheet with all UA3E-specific features
 */

export class UA3EActorSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['ua3e', 'sheet', 'actor', 'character'],
      template: 'systems/unknown-armies-3e/templates/actor/character-sheet.html',
      width: 800,
      height: 900,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'identity'
        }
      ],
      scrollY: ['.sheet-body']
    });
  }

  /**
   * Prepare data for rendering
   */
  async getData(options = {}) {
    const context = await super.getData(options);
    const actor = this.actor;
    const system = actor.system;

    // Add config
    context.config = CONFIG.UA3E || game.ua3e?.config;

    // Prepare abilities with labels
    context.abilities = {};
    for (const [key, ability] of Object.entries(system.abilities || {})) {
      context.abilities[key] = {
        ...ability,
        label: game.i18n.localize(`UA3E.Ability${key.charAt(0).toUpperCase() + key.slice(1)}`),
        abbr: game.i18n.localize(`UA3E.Ability${key.charAt(0).toUpperCase() + key.slice(1)}Abbr`)
      };
    }

    // Prepare attributes
    context.attributes = {};
    for (const [key, attr] of Object.entries(system.attributes || {})) {
      context.attributes[key] = {
        ...attr,
        label: game.i18n.localize(`UA3E.Attribute${key.charAt(0).toUpperCase() + key.slice(1)}`),
        abbr: game.i18n.localize(`UA3E.Attribute${key.charAt(0).toUpperCase() + key.slice(1)}Abbr`)
      };
    }

    // Prepare passions
    context.passions = {};
    for (const [key, passion] of Object.entries(system.passions || {})) {
      context.passions[key] = {
        ...passion,
        label: game.i18n.localize(`UA3E.Passion${key.charAt(0).toUpperCase() + key.slice(1)}`),
        hardenedLabel: game.i18n.localize('UA3E.Hardened')
      };
    }

    // Prepare hardened notches
    context.hardenedNotches = {};
    for (const [gauge, value] of Object.entries(system.hardenedNotches || {})) {
      context.hardenedNotches[gauge] = {
        value: value,
        label: game.i18n.localize(`UA3E.Gauge${gauge.charAt(0).toUpperCase() + gauge.slice(1)}`),
        isBroken: value >= 9,
        notches: Array.from({ length: 9 }, (_, i) => ({
          index: i + 1,
          filled: i < value,
          number: i + 1
        }))
      };
    }

    // Prepare items
    context.identities = actor.identities.map(i => ({
      ...i,
      isObsession: i.system.isObsession
    }));
    context.equipment = actor.items.filter(i => i.type === 'equipment');
    context.traumas = actor.traumas;
    context.relationships = actor.relationships;

    // Health and stability
    context.health = system.health;
    context.stability = system.stability;
    context.woundThreshold = system.woundThreshold;

    // Broken gauges
    context.brokenGauges = system.brokenGauges || [];
    context.isBroken = actor.isBroken;

    // Dark mode
    context.darkMode = game.settings.get('unknown-armies-3e', 'darkMode');

    return context;
  }

  /**
   * Activate event listeners
   */
  activateListeners(html) {
    super.activateListeners(html);

    // Ability rolls
    html.find('.ability-roll').click(this._onAbilityRoll.bind(this));

    // Identity rolls
    html.find('.identity-roll').click(this._onIdentityRoll.bind(this));

    // Stress check rolls
    html.find('.stress-roll').click(this._onStressRoll.bind(this));

    // Hardened notch clicks
    html.find('.hardened-notch').click(this._onHardenedNotchClick.bind(this));

    // Item management
    html.find('.item-create').click(this._onItemCreate.bind(this));
    html.find('.item-edit').click(this._onItemEdit.bind(this));
    html.find('.item-delete').click(this._onItemDelete.bind(this));

    // Health/Stability adjustments
    html.find('.health-adjust').click(this._onHealthAdjust.bind(this));
    html.find('.stability-adjust').click(this._onStabilityAdjust.bind(this));

    // Obsession toggle
    html.find('.obsession-toggle').click(this._onObsessionToggle.bind(this));

    // Rollables
    html.find('.rollable').click(this._onRollableClick.bind(this));
  }

  /**
   * Handle ability roll
   * @private
   */
  async _onAbilityRoll(event) {
    event.preventDefault();
    const ability = event.currentTarget.dataset.ability;
    await this.actor.rollAbility(ability);
  }

  /**
   * Handle identity roll
   * @private
   */
  async _onIdentityRoll(event) {
    event.preventDefault();
    const identityId = event.currentTarget.closest('.item').dataset.itemId;
    await this.actor.rollIdentity(identityId);
  }

  /**
   * Handle stress roll
   * @private
   */
  async _onStressRoll(event) {
    event.preventDefault();
    const gauge = event.currentTarget.dataset.gauge;

    // Show dialog if enabled
    if (game.settings.get('unknown-armies-3e', 'stressDialog')) {
      const dialog = new Dialog({
        title: game.i18n.localize('UA3E.StressCheck'),
        content: `
          <p>${game.i18n.format('UA3E.StressCheckConfirm', { 
            gauge: game.i18n.localize(`UA3E.Gauge${gauge.charAt(0).toUpperCase() + gauge.slice(1)}`),
            hardened: this.actor.system.hardenedNotches?.[gauge] || 0
          })}</p>
        `,
        buttons: {
          roll: {
            icon: '<i class="fas fa-dice-d20"></i>',
            label: game.i18n.localize('UA3E.Roll'),
            callback: async () => {
              await this.actor.rollStressCheck(gauge);
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize('UA3E.Cancel')
          }
        }
      });
      dialog.render(true);
    } else {
      await this.actor.rollStressCheck(gauge);
    }
  }

  /**
   * Handle hardened notch click
   * @private
   */
  async _onHardenedNotchClick(event) {
    event.preventDefault();
    const gauge = event.currentTarget.dataset.gauge;
    const notch = parseInt(event.currentTarget.dataset.notch);
    const current = this.actor.system.hardenedNotches?.[gauge] || 0;

    // Toggle: if clicking current level, decrease; if clicking higher, set to that
    let newValue;
    if (notch === current) {
      newValue = Math.max(0, current - 1);
    } else {
      newValue = Math.min(9, notch);
    }

    await this.actor.update({ [`system.hardenedNotches.${gauge}`]: newValue });
  }

  /**
   * Handle item creation
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const type = event.currentTarget.dataset.type;

    const itemData = {
      name: game.i18n.format('UA3E.NewItem', { type: game.i18n.localize(`UA3E.Item${type.charAt(0).toUpperCase() + type.slice(1)}`) }),
      type: type
    };

    await this.actor.createEmbeddedDocuments('Item', [itemData]);
  }

  /**
   * Handle item edit
   * @private
   */
  _onItemEdit(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    item.sheet.render(true);
  }

  /**
   * Handle item delete
   * @private
   */
  async _onItemDelete(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;

    await Dialog.confirm({
      title: game.i18n.localize('UA3E.ConfirmDelete'),
      content: game.i18n.localize('UA3E.ConfirmDeleteContent'),
      yes: async () => {
        await this.actor.deleteEmbeddedDocuments('Item', [itemId]);
      }
    });
  }

  /**
   * Handle health adjustment
   * @private
   */
  async _onHealthAdjust(event) {
    event.preventDefault();
    const adjustment = parseInt(event.currentTarget.dataset.adjust);
    const current = this.actor.system.health.value;
    const max = this.actor.system.health.max;
    const newValue = Math.max(0, Math.min(max, current + adjustment));

    await this.actor.update({ 'system.health.value': newValue });
  }

  /**
   * Handle stability adjustment
   * @private
   */
  async _onStabilityAdjust(event) {
    event.preventDefault();
    const adjustment = parseInt(event.currentTarget.dataset.adjust);
    const current = this.actor.system.stability.value;
    const max = this.actor.system.stability.max;
    const newValue = Math.max(0, Math.min(max, current + adjustment));

    await this.actor.update({ 'system.stability.value': newValue });
  }

  /**
   * Handle obsession toggle
   * @private
   */
  async _onObsessionToggle(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);

    // Unset all other obsessions
    const updates = this.actor.identities.map(i => ({
      _id: i.id,
      'system.isObsession': i.id === itemId ? !i.system.isObsession : false
    }));

    await this.actor.updateEmbeddedDocuments('Item', updates);
  }

  /**
   * Handle generic rollable click
   * @private
   */
  async _onRollableClick(event) {
    event.preventDefault();
    const rollType = event.currentTarget.dataset.rollType;

    switch (rollType) {
      case 'initiative':
        await this.actor.rollInitiative();
        break;
      case 'stress-random':
        const gauges = ['violence', 'helplessness', 'theUnnatural', 'isolation', 'self'];
        const randomGauge = gauges[Math.floor(Math.random() * gauges.length)];
        await this.actor.rollStressCheck(randomGauge);
        break;
    }
  }

  /**
   * Drag and drop support
   */
  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);

    if (data.type === 'Item') {
      // Handle item drop
      const item = await Item.implementation.fromDropData(data);
      if (item) {
        await this.actor.createEmbeddedDocuments('Item', [item.toObject()]);
      }
    }

    super._onDrop(event);
  }
}