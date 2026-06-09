/**
 * Unknown Armies 3E Item Document
 * Extends the base Item class with UA3E-specific functionality
 */

export class UA3EItem extends Item {

  /**
   * Prepare derived data for the item
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    // Add any item-specific derived calculations here
    if (this.type === 'identity') {
      this._prepareIdentity();
    } else if (this.type === 'equipment') {
      this._prepareEquipment();
    } else if (this.type === 'trauma') {
      this._prepareTrauma();
    }
  }

  /**
   * Prepare identity-specific data
   * @private
   */
  _prepareIdentity() {
    const system = this.system;

    // Calculate if this identity can substitute for an ability
    if (system.substitutesFor) {
      system.substitutionTarget = game.i18n.localize(`UA3E.Ability${system.substitutesFor.charAt(0).toUpperCase() + system.substitutesFor.slice(1)}`);
    }

    // Obsession bonus: if this is the obsession identity, rolls get special highlighting
    system.isObsessionDisplay = system.isObsession ? 
      game.i18n.localize('UA3E.ObsessionYes') : 
      game.i18n.localize('UA3E.ObsessionNo');
  }

  /**
   * Prepare equipment-specific data
   * @private
   */
  _prepareEquipment() {
    const system = this.system;

    // Parse damage formula if present
    if (system.damage) {
      system.hasDamage = true;
    }

    // Armor value
    if (system.armor > 0) {
      system.hasArmor = true;
    }
  }

  /**
   * Prepare trauma-specific data
   * @private
   */
  _prepareTrauma() {
    const system = this.system;

    // Gauge label
    system.gaugeLabel = game.i18n.localize(`UA3E.Gauge${system.gauge.charAt(0).toUpperCase() + system.gauge.slice(1)}`);

    // Severity label
    const severityLabels = {
      1: 'UA3E.TraumaMinor',
      2: 'UA3E.TraumaModerate',
      3: 'UA3E.TraumaSevere'
    };
    system.severityLabel = game.i18n.localize(severityLabels[system.severity] || 'UA3E.TraumaMinor');

    // Permanent status
    system.isPermanentDisplay = system.isPermanent ?
      game.i18n.localize('UA3E.TraumaPermanent') :
      game.i18n.localize('UA3E.TraumaTemporary');
  }

  /**
   * Roll this identity
   * @returns {Promise<PercentileRoll>}
   */
  async roll() {
    if (this.type !== 'identity') {
      ui.notifications.warn(game.i18n.localize('UA3E.ErrorNotIdentity'));
      return null;
    }

    const actor = this.actor;
    if (!actor) {
      ui.notifications.warn(game.i18n.localize('UA3E.ErrorNoActor'));
      return null;
    }

    return await actor.rollIdentity(this.id);
  }

  /**
   * Get the effective score for this identity
   * Includes any bonuses from obsession or other factors
   * @returns {number}
   */
  get effectiveScore() {
    let score = this.system.score || 15;

    // Obsession identity gets special handling
    if (this.system.isObsession) {
      // In UA3E, obsession identities can flip-flop (swap digits)
      // This is handled in the roll, not the score
    }

    return score;
  }

  /**
   * Check if this item is an obsession identity
   * @returns {boolean}
   */
  get isObsession() {
    return this.type === 'identity' && this.system.isObsession;
  }

  /**
   * Get item type label
   * @returns {string}
   */
  get typeLabel() {
    return game.i18n.localize(`UA3E.Item${this.type.charAt(0).toUpperCase() + this.type.slice(1)}`);
  }
}