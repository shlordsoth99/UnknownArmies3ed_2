/**
 * Unknown Armies 3E System Settings
 */

export function registerSystemSettings() {

  /**
   * Automatic Stress Tracking
   * Automatically apply stress results to character sheets
   */
  game.settings.register('unknown-armies-3e', 'autoStress', {
    name: 'UA3E.SettingsAutoStressName',
    hint: 'UA3E.SettingsAutoStressHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  /**
   * Show Stress Check Dialog
   * Show a dialog for stress checks instead of automatic rolls
   */
  game.settings.register('unknown-armies-3e', 'stressDialog', {
    name: 'UA3E.SettingsStressDialogName',
    hint: 'UA3E.SettingsStressDialogHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  /**
   * Initiative Formula
   * Custom initiative formula
   */
  game.settings.register('unknown-armies-3e', 'initiativeFormula', {
    name: 'UA3E.SettingsInitiativeName',
    hint: 'UA3E.SettingsInitiativeHint',
    scope: 'world',
    config: true,
    type: String,
    default: '1d10 + @speed',
    choices: {
      '1d10 + @speed': '1d10 + Speed',
      '1d10 + @mind': '1d10 + Mind',
      '1d10': '1d10 (Random)',
      'd%': 'd% (Percentile)'
    }
  });

  /**
   * Wound Threshold Display
   * Show wound threshold on tokens
   */
  game.settings.register('unknown-armies-3e', 'showWoundThreshold', {
    name: 'UA3E.SettingsWoundThresholdName',
    hint: 'UA3E.SettingsWoundThresholdHint',
    scope: 'world',
    config: true,
    type: Boolean,
    default: true
  });

  /**
   * Obsession Highlighting
   * Highlight obsession-related rolls
   */
  game.settings.register('unknown-armies-3e', 'obsessionHighlight', {
    name: 'UA3E.SettingsObsessionName',
    hint: 'UA3E.SettingsObsessionHint',
    scope: 'client',
    config: true,
    type: Boolean,
    default: true
  });

  /**
   * Dark Mode Character Sheet
   * Use dark theme for character sheets
   */
  game.settings.register('unknown-armies-3e', 'darkMode', {
    name: 'UA3E.SettingsDarkModeName',
    hint: 'UA3E.SettingsDarkModeHint',
    scope: 'client',
    config: true,
    type: Boolean,
    default: true
  });

  /**
   * Trauma Visibility
   * Who can see trauma details
   */
  game.settings.register('unknown-armies-3e', 'traumaVisibility', {
    name: 'UA3E.SettingsTraumaName',
    hint: 'UA3E.SettingsTraumaHint',
    scope: 'world',
    config: true,
    type: String,
    default: 'owner',
    choices: {
      'owner': 'UA3E.TraumaOwner',
      'gm': 'UA3E.TraumaGM',
      'all': 'UA3E.TraumaAll'
    }
  });

  /**
   * Roll Mode Default
   * Default roll mode for the system
   */
  game.settings.register('unknown-armies-3e', 'rollModeDefault', {
    name: 'UA3E.SettingsRollModeName',
    hint: 'UA3E.SettingsRollModeHint',
    scope: 'world',
    config: true,
    type: String,
    default: 'publicroll',
    choices: {
      'publicroll': 'Public Roll',
      'gmroll': 'GM Roll',
      'blindroll': 'Blind GM Roll',
      'selfroll': 'Self Roll'
    }
  });
}