/**
 * Unknown Armies 3E Item Sheet
 * Sheet for all item types
 */

export class UA3EItemSheet extends ItemSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['ua3e', 'sheet', 'item'],
      width: 520,
      height: 480,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description'
        }
      ]
    });
  }

  /**
   * Get template path based on item type
   */
  get template() {
    const path = 'systems/unknown-armies-3e/templates/item';
    return `${path}/${this.item.type}-sheet.html`;
  }

  /**
   * Prepare data for rendering
   */
  async getData(options = {}) {
    const context = await super.getData(options);
    const item = this.item;
    const system = item.system;

    // Add config
    context.config = CONFIG.UA3E || game.ua3e?.config;

    // Type-specific data
    switch (item.type) {
      case 'identity':
        context.abilities = {
          connect: 'UA3E.AbilityConnect',
          knowledge: 'UA3E.AbilityKnowledge',
          lie: 'UA3E.AbilityLie',
          notice: 'UA3E.AbilityNotice',
          pursuit: 'UA3E.AbilityPursuit',
          struggle: 'UA3E.AbilityStruggle'
        };
        context.substitutesFor = system.substitutesFor || '';
        context.isObsession = system.isObsession || false;
        break;

      case 'equipment':
        context.equipped = system.equipped || false;
        context.quantity = system.quantity || 1;
        context.damage = system.damage || '';
        context.armor = system.armor || 0;
        break;

      case 'trauma':
        context.gauges = {
          violence: 'UA3E.GaugeViolence',
          helplessness: 'UA3E.GaugeHelplessness',
          theUnnatural: 'UA3E.GaugeUnnatural',
          isolation: 'UA3E.GaugeIsolation',
          self: 'UA3E.GaugeSelf'
        };
        context.gauge = system.gauge || 'violence';
        context.severity = system.severity || 1;
        context.isPermanent = system.isPermanent || false;
        break;

      case 'relationship':
        context.score = system.score || 15;
        context.isPositive = system.isPositive !== false;
        break;

      case 'power':
        context.cost = system.cost || '';
        context.range = system.range || '';
        context.duration = system.duration || '';
        break;
    }

    // Dark mode
    context.darkMode = game.settings.get('unknown-armies-3e', 'darkMode');

    return context;
  }

  /**
   * Activate event listeners
   */
  activateListeners(html) {
    super.activateListeners(html);

    // Roll identity from sheet
    html.find('.roll-identity').click(this._onRollIdentity.bind(this));
  }

  /**
   * Handle rolling identity from item sheet
   * @private
   */
  async _onRollIdentity(event) {
    event.preventDefault();
    if (this.item.type === 'identity') {
      await this.item.roll();
    }
  }
}