/**
 * Unknown Armies 3E System Configuration
 */

export const UA3E = {};

/**
 * Ability scores in UA3E
 */
UA3E.abilities = {
  connect: 'UA3E.AbilityConnect',
  knowledge: 'UA3E.AbilityKnowledge',
  lie: 'UA3E.AbilityLie',
  notice: 'UA3E.AbilityNotice',
  pursuit: 'UA3E.AbilityPursuit',
  struggle: 'UA3E.AbilityStruggle'
};

/**
 * Ability score abbreviations
 */
UA3E.abilityAbbreviations = {
  connect: 'UA3E.AbilityConnectAbbr',
  knowledge: 'UA3E.AbilityKnowledgeAbbr',
  lie: 'UA3E.AbilityLieAbbr',
  notice: 'UA3E.AbilityNoticeAbbr',
  pursuit: 'UA3E.AbilityPursuitAbbr',
  struggle: 'UA3E.AbilityStruggleAbbr'
};

/**
 * Core attributes (Body, Speed, Mind, Soul)
 */
UA3E.attributes = {
  body: 'UA3E.AttributeBody',
  speed: 'UA3E.AttributeSpeed',
  mind: 'UA3E.AttributeMind',
  soul: 'UA3E.AttributeSoul'
};

/**
 * Stress gauges
 */
UA3E.stressGauges = {
  violence: 'UA3E.GaugeViolence',
  helplessness: 'UA3E.GaugeHelplessness',
  theUnnatural: 'UA3E.GaugeUnnatural',
  isolation: 'UA3E.GaugeIsolation',
  self: 'UA3E.GaugeSelf'
};

/**
 * Stress check results
 */
UA3E.stressResults = {
  success: 'UA3E.StressSuccess',
  failure: 'UA3E.StressFailure',
  matchedSuccess: 'UA3E.StressMatchedSuccess',
  matchedFailure: 'UA3E.StressMatchedFailure',
  criticalSuccess: 'UA3E.StressCriticalSuccess',
  criticalFailure: 'UA3E.StressCriticalFailure'
};

/**
 * Passions
 */
UA3E.passions = {
  fear: 'UA3E.PassionFear',
  rage: 'UA3E.PassionRage',
  noble: 'UA3E.PassionNoble',
  obsession: 'UA3E.PassionObsession'
};

/**
 * Threat levels for NPCs
 */
UA3E.threatLevels = {
  low: 'UA3E.ThreatLow',
  medium: 'UA3E.ThreatMedium',
  mediumHigh: 'UA3E.ThreatMediumHigh',
  high: 'UA3E.ThreatHigh',
  veryHigh: 'UA3E.ThreatVeryHigh',
  extreme: 'UA3E.ThreatExtreme'
};

/**
 * Item types
 */
UA3E.itemTypes = {
  identity: 'UA3E.ItemIdentity',
  equipment: 'UA3E.ItemEquipment',
  trauma: 'UA3E.ItemTrauma',
  relationship: 'UA3E.ItemRelationship',
  power: 'UA3E.ItemPower'
};

/**
 * Die types for the system (d% based)
 */
UA3E.dice = {
  percentile: 'd%',
  stress: 'd%'
};

/**
 * Default ability values
 */
UA3E.defaultAbilities = {
  connect: 15,
  knowledge: 15,
  lie: 15,
  notice: 15,
  pursuit: 15,
  struggle: 15
};

/**
 * Default attribute values
 */
UA3E.defaultAttributes = {
  body: 50,
  speed: 50,
  mind: 50,
  soul: 50
};

/**
 * Wound thresholds by body score
 */
UA3E.woundThresholds = {
  body20: 5,
  body30: 6,
  body40: 7,
  body50: 8,
  body60: 10,
  body70: 12,
  body80: 14,
  body90: 16,
  body100: 20
};

/**
 * Hardened notch effects
 */
UA3E.hardenedEffects = {
  0: 'UA3E.Hardened0',
  1: 'UA3E.Hardened1',
  2: 'UA3E.Hardened2',
  3: 'UA3E.Hardened3',
  4: 'UA3E.Hardened4',
  5: 'UA3E.Hardened5',
  6: 'UA3E.Hardened6',
  7: 'UA3E.Hardened7',
  8: 'UA3E.Hardened8',
  9: 'UA3E.Hardened9'
};