/**
 * Unknown Armies 3E Dice System
 * Percentile-based rolls and Stress Checks
 */

/**
 * Standard Percentile Roll (d%)
 * Used for all ability checks, identity checks, and attribute checks
 */
export class PercentileRoll extends Roll {
  constructor(formula, data = {}, options = {}) {
    super(formula, data, options);
    this.options.type = options.type || 'ability';
    this.options.ability = options.ability || '';
    this.options.target = options.target || 50;
    this.options.matched = options.matched !== undefined ? options.matched : true;
  }

  /**
   * Determine success/failure and matched results
   */
  get result() {
    const total = this.total;
    const target = this.options.target;
    const isSuccess = total <= target;

    // Check for matched results (doubles: 11, 22, 33, etc.)
    const diceResult = this.dice[0]?.total || total;
    const isMatched = this.options.matched && (diceResult % 11 === 0) && diceResult !== 0;

    // Critical thresholds
    const isCriticalSuccess = isSuccess && total <= target * 0.1; // Top 10%
    const isCriticalFailure = !isSuccess && total >= 90; // 90-99

    return {
      total,
      target,
      isSuccess,
      isMatched,
      isCriticalSuccess,
      isCriticalFailure,
      type: this.options.type,
      ability: this.options.ability
    };
  }

  /**
   * Render the roll result with UA3E styling
   */
  async render(chatOptions = {}) {
    const result = this.result;
    let cssClass = 'ua3e-roll';

    if (result.isCriticalSuccess) cssClass += ' critical-success';
    else if (result.isCriticalFailure) cssClass += ' critical-failure';
    else if (result.isSuccess) cssClass += ' success';
    else cssClass += ' failure';

    if (result.isMatched) cssClass += ' matched';

    const template = 'systems/unknown-armies-3e/templates/apps/roll-result.html';
    const templateData = {
      roll: this,
      result: result,
      cssClass: cssClass,
      formula: this.formula,
      total: result.total,
      target: result.target,
      isSuccess: result.isSuccess,
      isMatched: result.isMatched,
      isCriticalSuccess: result.isCriticalSuccess,
      isCriticalFailure: result.isCriticalFailure,
      ability: result.ability ? game.i18n.localize(`UA3E.Ability${result.ability.charAt(0).toUpperCase() + result.ability.slice(1)}`) : ''
    };

    return renderTemplate(template, templateData);
  }

  /**
   * Create a chat message for this roll
   */
  async toMessage(messageData = {}, options = {}) {
    const content = await this.render();

    const chatData = foundry.utils.mergeObject({
      user: game.user.id,
      type: CONST.CHAT_MESSAGE_TYPES.ROLL,
      content: content,
      sound: CONFIG.sounds.dice,
      roll: this
    }, messageData);

    return ChatMessage.create(chatData, options);
  }
}

/**
 * Stress Check Roll
 * Specialized percentile roll for stress checks
 * Target = current Stability - (hardened notches * 10)
 */
export class StressRoll extends PercentileRoll {
  constructor(gauge, hardened = 0, options = {}) {
    const target = Math.max(0, (options.stability || 50) - (hardened * 10));
    super('d%', {}, {
      ...options,
      type: 'stress',
      target: target,
      gauge: gauge,
      hardened: hardened
    });
    this.options.gauge = gauge;
    this.options.hardened = hardened;
  }

  /**
   * Determine stress check result
   */
  get stressResult() {
    const result = this.result;
    const gauge = this.options.gauge;

    let outcome = '';
    let effect = '';

    if (result.isCriticalSuccess) {
      outcome = 'criticalSuccess';
      effect = game.i18n.localize('UA3E.StressCriticalSuccessDesc');
    } else if (result.isCriticalFailure) {
      outcome = 'criticalFailure';
      effect = game.i18n.localize('UA3E.StressCriticalFailureDesc');
    } else if (result.isMatched && result.isSuccess) {
      outcome = 'matchedSuccess';
      effect = game.i18n.localize('UA3E.StressMatchedSuccessDesc');
    } else if (result.isMatched && !result.isSuccess) {
      outcome = 'matchedFailure';
      effect = game.i18n.localize('UA3E.StressMatchedFailureDesc');
    } else if (result.isSuccess) {
      outcome = 'success';
      effect = game.i18n.localize('UA3E.StressSuccessDesc');
    } else {
      outcome = 'failure';
      effect = game.i18n.localize('UA3E.StressFailureDesc');
    }

    return {
      ...result,
      gauge: gauge,
      hardened: this.options.hardened,
      outcome: outcome,
      effect: effect,
      stability: this.options.stability,
      newStability: result.isSuccess ? this.options.stability : Math.max(0, this.options.stability - 5)
    };
  }

  /**
   * Render stress check result
   */
  async render(chatOptions = {}) {
    const stressResult = this.stressResult;
    let cssClass = 'ua3e-roll ua3e-stress-roll';

    switch (stressResult.outcome) {
      case 'criticalSuccess': cssClass += ' critical-success'; break;
      case 'criticalFailure': cssClass += ' critical-failure'; break;
      case 'matchedSuccess': cssClass += ' matched-success'; break;
      case 'matchedFailure': cssClass += ' matched-failure'; break;
      case 'success': cssClass += ' success'; break;
      case 'failure': cssClass += ' failure'; break;
    }

    const template = 'systems/unknown-armies-3e/templates/apps/stress-result.html';
    const templateData = {
      roll: this,
      result: stressResult,
      cssClass: cssClass,
      gauge: game.i18n.localize(`UA3E.Gauge${stressResult.gauge.charAt(0).toUpperCase() + stressResult.gauge.slice(1)}`),
      formula: `d% vs ${stressResult.target} (Stability ${stressResult.stability} - Hardened ${stressResult.hardened})`
    };

    return renderTemplate(template, templateData);
  }
}

/**
 * Initiative Roll
 * Standard d10 + Speed attribute
 */
export class InitiativeRoll extends Roll {
  constructor(actor, options = {}) {
    const speed = actor?.system?.attributes?.speed?.value || 50;
    super('1d10 + @speed', { speed: Math.floor(speed / 10) }, options);
  }

  get total() {
    return this._total;
  }
}

/**
 * Damage Roll
 * Based on weapon/equipment damage formula
 */
export class DamageRoll extends Roll {
  constructor(formula, data = {}, options = {}) {
    super(formula, data, options);
    this.options.type = 'damage';
  }

  /**
   * Calculate wound severity based on damage and wound threshold
   */
  getWoundSeverity(woundThreshold = 8) {
    const damage = this.total;
    if (damage >= woundThreshold * 3) return 'critical';
    if (damage >= woundThreshold * 2) return 'serious';
    if (damage >= woundThreshold) return 'major';
    return 'minor';
  }
}