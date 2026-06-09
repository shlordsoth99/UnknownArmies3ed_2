/**
 * Unknown Armies 3E Actor Document
 * Extends the base Actor class with UA3E-specific functionality
 */

import { PercentileRoll, StressRoll } from '../dice/dice.mjs';

export class UA3EActor extends Actor {

  /**
   * Prepare base data for the actor
   */
  prepareBaseData() {
    super.prepareBaseData();

    // Set derived health from Body
    const body = this.system.attributes?.body?.value || 50;
    this.system.health.max = body;

    // Set derived stability from Soul
    const soul = this.system.attributes?.soul?.value || 50;
    this.system.stability.max = soul;

    // Calculate wound threshold based on Body
    this.system.woundThreshold = this._calculateWoundThreshold(body);
  }

  /**
   * Prepare derived data
   */
  prepareDerivedData() {
    super.prepareDerivedData();

    if (this.type === 'character') {
      this._prepareCharacterData();
    } else if (this.type === 'npc') {
      this._prepareNPCData();
    }
  }

  /**
   * Prepare character-specific derived data
   * @private
   */
  _prepareCharacterData() {
    const system = this.system;

    // Calculate total hardened notches
    system.totalHardened = Object.values(system.hardenedNotches || {}).reduce((a, b) => a + b, 0);

    // Calculate current shock gauges (max 9 each)
    system.shockGauges = {};
    for (const [gauge, notches] of Object.entries(system.hardenedNotches || {})) {
      system.shockGauges[gauge] = Math.min(9, notches);
    }

    // Determine if character is broken in any gauge
    system.brokenGauges = [];
    for (const [gauge, notches] of Object.entries(system.hardenedNotches || {})) {
      if (notches >= 9) {
        system.brokenGauges.push(gauge);
      }
    }

    // Calculate initiative bonus from Speed
    const speed = system.attributes?.speed?.value || 50;
    system.initiativeBonus = Math.floor(speed / 10);
  }

  /**
   * Prepare NPC-specific derived data
   * @private
   */
  _prepareNPCData() {
    const system = this.system;

    // NPCs use simplified wound threshold
    const body = system.attributes?.body?.value || 50;
    system.woundThreshold = system.woundThreshold || this._calculateWoundThreshold(body);

    // Calculate threat level display
    system.threatLevelDisplay = game.i18n.localize(`UA3E.Threat${system.identity?.threatLevel?.replace(/\s+/g, '') || 'Medium'}`);
  }

  /**
   * Calculate wound threshold from Body score
   * @param {number} body - Body attribute value
   * @returns {number}
   * @private
   */
  _calculateWoundThreshold(body) {
    if (body <= 20) return 5;
    if (body <= 30) return 6;
    if (body <= 40) return 7;
    if (body <= 50) return 8;
    if (body <= 60) return 10;
    if (body <= 70) return 12;
    if (body <= 80) return 14;
    if (body <= 90) return 16;
    return 20;
  }

  /* -------------------------------------------- */
  /*  Roll Methods                                */
  /* -------------------------------------------- */

  /**
   * Roll an ability check
   * @param {string} ability - Ability key (connect, knowledge, lie, notice, pursuit, struggle)
   * @param {Object} options - Roll options
   * @returns {Promise<PercentileRoll>}
   */
  async rollAbility(ability, options = {}) {
    const abilityData = this.system.abilities?.[ability];
    if (!abilityData) {
      ui.notifications.error(game.i18n.format('UA3E.ErrorNoAbility', { ability }));
      return null;
    }

    const target = abilityData.value;
    const roll = new PercentileRoll('d%', {}, {
      type: 'ability',
      ability: ability,
      target: target,
      actor: this.id
    });

    await roll.evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${game.i18n.localize(`UA3E.Ability${ability.charAt(0).toUpperCase() + ability.slice(1)}`)} ${game.i18n.localize('UA3E.Check')}`
    });

    return roll;
  }

  /**
   * Roll an identity skill check
   * @param {string} identityId - ID of the identity item
   * @param {Object} options - Roll options
   * @returns {Promise<PercentileRoll>}
   */
  async rollIdentity(identityId, options = {}) {
    const identity = this.items.get(identityId);
    if (!identity) {
      ui.notifications.error(game.i18n.localize('UA3E.ErrorNoIdentity'));
      return null;
    }

    const target = identity.system.score;
    const roll = new PercentileRoll('d%', {}, {
      type: 'identity',
      identity: identity.name,
      target: target,
      actor: this.id
    });

    await roll.evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${identity.name} ${game.i18n.localize('UA3E.IdentityCheck')}`
    });

    return roll;
  }

  /**
   * Roll a stress check
   * @param {string} gauge - Stress gauge (violence, helplessness, theUnnatural, isolation, self)
   * @param {Object} options - Roll options
   * @returns {Promise<StressRoll>}
   */
  async rollStressCheck(gauge, options = {}) {
    const hardened = this.system.hardenedNotches?.[gauge] || 0;
    const stability = this.system.stability?.value || 50;

    const roll = new StressRoll(gauge, hardened, {
      stability: stability,
      actor: this.id
    });

    await roll.evaluate();
    await roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this }),
      flavor: `${game.i18n.localize('UA3E.StressCheck')} — ${game.i18n.localize(`UA3E.Gauge${gauge.charAt(0).toUpperCase() + gauge.slice(1)}`)}`
    });

    // Auto-apply stress if enabled
    if (game.settings.get('unknown-armies-3e', 'autoStress')) {
      await this.applyStressResult(gauge, roll.stressResult);
    }

    return roll;
  }

  /**
   * Apply stress check result to actor
   * @param {string} gauge - Stress gauge
   * @param {Object} result - Stress roll result
   */
  async applyStressResult(gauge, result) {
    const updates = {};

    if (result.outcome === 'failure' || result.outcome === 'matchedFailure' || result.outcome === 'criticalFailure') {
      // Reduce stability
      const currentStability = this.system.stability.value;
      const reduction = result.outcome === 'criticalFailure' ? 10 : 5;
      updates['system.stability.value'] = Math.max(0, currentStability - reduction);

      // On matched failure, add trauma
      if (result.outcome === 'matchedFailure') {
        await this.addTrauma(gauge, 2);
      }

      // On critical failure, add severe trauma
      if (result.outcome === 'criticalFailure') {
        await this.addTrauma(gauge, 3);
      }
    }

    if (result.outcome === 'success' || result.outcome === 'matchedSuccess' || result.outcome === 'criticalSuccess') {
      // Add hardened notch on success
      const currentHardened = this.system.hardenedNotches?.[gauge] || 0;
      if (currentHardened < 9) {
        updates[`system.hardenedNotches.${gauge}`] = currentHardened + 1;
      }
    }

    if (Object.keys(updates).length > 0) {
      await this.update(updates);
    }
  }

  /**
   * Add trauma to the character
   * @param {string} gauge - Stress gauge
   * @param {number} severity - Trauma severity (1-3)
   */
  async addTrauma(gauge, severity = 1) {
    const traumaData = {
      name: game.i18n.format('UA3E.TraumaNew', { gauge: game.i18n.localize(`UA3E.Gauge${gauge.charAt(0).toUpperCase() + gauge.slice(1)}`) }),
      type: 'trauma',
      system: {
        gauge: gauge,
        severity: severity,
        description: '',
        isPermanent: severity >= 3
      }
    };

    await this.createEmbeddedDocuments('Item', [traumaData]);

    // Notify
    ui.notifications.warn(game.i18n.format('UA3E.TraumaAdded', { 
      name: this.name, 
      gauge: game.i18n.localize(`UA3E.Gauge${gauge.charAt(0).toUpperCase() + gauge.slice(1)}`) 
    }));
  }

  /**
   * Take damage
   * @param {number} damage - Amount of damage
   * @param {Object} options - Damage options
   */
  async takeDamage(damage, options = {}) {
    const currentHealth = this.system.health.value;
    const newHealth = Math.max(0, currentHealth - damage);
    const woundThreshold = this.system.woundThreshold;

    await this.update({ 'system.health.value': newHealth });

    // Check for wounds
    if (damage >= woundThreshold) {
      const severity = damage >= woundThreshold * 3 ? 'critical' : 
                      damage >= woundThreshold * 2 ? 'serious' : 'major';

      ui.notifications.warn(game.i18n.format('UA3E.WoundTaken', { 
        name: this.name, 
        severity: game.i18n.localize(`UA3E.Wound${severity.charAt(0).toUpperCase() + severity.slice(1)}`) 
      }));
    }

    if (newHealth <= 0) {
      ui.notifications.error(game.i18n.format('UA3E.ActorDefeated', { name: this.name }));
    }

    return newHealth;
  }

  /**
   * Heal damage
   * @param {number} healing - Amount of healing
   */
  async healDamage(healing) {
    const currentHealth = this.system.health.value;
    const maxHealth = this.system.health.max;
    const newHealth = Math.min(maxHealth, currentHealth + healing);

    await this.update({ 'system.health.value': newHealth });
    return newHealth;
  }

  /**
   * Get all identity items
   * @returns {Array}
   */
  get identities() {
    return this.items.filter(i => i.type === 'identity');
  }

  /**
   * Get all trauma items
   * @returns {Array}
   */
  get traumas() {
    return this.items.filter(i => i.type === 'trauma');
  }

  /**
   * Get all relationship items
   * @returns {Array}
   */
  get relationships() {
    return this.items.filter(i => i.type === 'relationship');
  }

  /**
   * Get obsession identity
   * @returns {Item|null}
   */
  get obsession() {
    return this.items.find(i => i.type === 'identity' && i.system.isObsession);
  }

  /**
   * Check if actor is broken (has 9+ hardened notches in any gauge)
   * @returns {boolean}
   */
  get isBroken() {
    return Object.values(this.system.hardenedNotches || {}).some(n => n >= 9);
  }

  /**
   * Get initiative roll
   * @returns {Roll}
   */
  getInitiativeRoll(formula) {
    const speed = this.system.attributes?.speed?.value || 50;
    const bonus = Math.floor(speed / 10);
    return new Roll(formula || '1d10 + @bonus', { bonus });
  }
}