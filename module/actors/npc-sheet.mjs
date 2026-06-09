/**
 * Unknown Armies 3E NPC Sheet
 * Simplified sheet for antagonists and threats
 */

export class UA3ENPCSheet extends ActorSheet {

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['ua3e', 'sheet', 'actor', 'npc'],
      template: 'systems/unknown-armies-3e/templates/actor/npc-sheet.html',
      width: 700,
      height: 800,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'stats'
        }
      ]
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

    // Prepare abilities
    context.abilities = {};
    for (const [key, ability] of Object.entries(system.abilities || {})) {
      context.abilities[key] = {
        ...ability,
        label: game.i18n.localize(`UA3E.Ability${key.charAt(0).toUpperCase() + key.slice(1)}`)
      };
    }

    // Prepare attributes
    context.attributes = {};
    for (const [key, attr] of Object.entries(system.attributes || {})) {
      context.attributes[key] = {
        ...attr,
        label: game.i18n.localize(`UA3E.Attribute${key.charAt(0).toUpperCase() + key.slice(1)}`)
      };
    }

    // Threat level
    context.threatLevel = system.identity?.threatLevel || 'Medium';
    context.threatLevels = {
      low: 'UA3E.ThreatLow',
      medium: 'UA3E.ThreatMedium',
      mediumHigh: 'UA3E.ThreatMediumHigh',
      high: 'UA3E.ThreatHigh',
      veryHigh: 'UA3E.ThreatVeryHigh',
      extreme: 'UA3E.ThreatExtreme'
    };

    // Special powers and weaknesses
    context.specialPowers = system.specialPowers || [];
    context.weaknesses = system.weaknesses || [];
    context.motivation = system.motivation || '';
    context.tactics = system.tactics || '';
    context.woundThreshold = system.woundThreshold || 15;

    // Health and stability
    context.health = system.health;
    context.stability = system.stability;

    // Hardened notches
    context.hardenedNotches = system.hardenedNotches || {};

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

    // Health adjustments
    html.find('.health-adjust').click(this._onHealthAdjust.bind(this));
    html.find('.stability-adjust').click(this._onStabilityAdjust.bind(this));

    // Add/remove special powers
    html.find('.power-add').click(this._onPowerAdd.bind(this));
    html.find('.power-delete').click(this._onPowerDelete.bind(this));

    // Add/remove weaknesses
    html.find('.weakness-add').click(this._onWeaknessAdd.bind(this));
    html.find('.weakness-delete').click(this._onWeaknessDelete.bind(this));

    // Inline editing
    html.find('.inline-edit').change(this._onInlineEdit.bind(this));
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
   * Handle adding special power
   * @private
   */
  async _onPowerAdd(event) {
    event.preventDefault();
    const powers = this.actor.system.specialPowers || [];
    powers.push({ name: game.i18n.localize('UA3E.NewPower'), description: '' });
    await this.actor.update({ 'system.specialPowers': powers });
  }

  /**
   * Handle deleting special power
   * @private
   */
  async _onPowerDelete(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index);
    const powers = this.actor.system.specialPowers || [];
    powers.splice(index, 1);
    await this.actor.update({ 'system.specialPowers': powers });
  }

  /**
   * Handle adding weakness
   * @private
   */
  async _onWeaknessAdd(event) {
    event.preventDefault();
    const weaknesses = this.actor.system.weaknesses || [];
    weaknesses.push(game.i18n.localize('UA3E.NewWeakness'));
    await this.actor.update({ 'system.weaknesses': weaknesses });
  }

  /**
   * Handle deleting weakness
   * @private
   */
  async _onWeaknessDelete(event) {
    event.preventDefault();
    const index = parseInt(event.currentTarget.dataset.index);
    const weaknesses = this.actor.system.weaknesses || [];
    weaknesses.splice(index, 1);
    await this.actor.update({ 'system.weaknesses': weaknesses });
  }

  /**
   * Handle inline editing
   * @private
   */
  async _onInlineEdit(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const field = element.dataset.field;
    const value = element.value;

    await this.actor.update({ [field]: value });
  }
}