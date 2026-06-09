/**
 * Unknown Armies 3E Template Preloading
 * Preloads all Handlebars templates for the system
 */

export const preloadHandlebarsTemplates = async function() {
  const templatePaths = [
    // Actor sheets
    'systems/unknown-armies-3e/templates/actor/character-sheet.html',
    'systems/unknown-armies-3e/templates/actor/npc-sheet.html',

    // Actor parts
    'systems/unknown-armies-3e/templates/actor/parts/identity-tab.html',
    'systems/unknown-armies-3e/templates/actor/parts/abilities-tab.html',
    'systems/unknown-armies-3e/templates/actor/parts/stress-tab.html',
    'systems/unknown-armies-3e/templates/actor/parts/equipment-tab.html',
    'systems/unknown-armies-3e/templates/actor/parts/biography-tab.html',

    // Item sheets
    'systems/unknown-armies-3e/templates/item/identity-sheet.html',
    'systems/unknown-armies-3e/templates/item/equipment-sheet.html',
    'systems/unknown-armies-3e/templates/item/trauma-sheet.html',
    'systems/unknown-armies-3e/templates/item/relationship-sheet.html',
    'systems/unknown-armies-3e/templates/item/power-sheet.html',

    // Apps
    'systems/unknown-armies-3e/templates/apps/roll-result.html',
    'systems/unknown-armies-3e/templates/apps/stress-result.html',
    'systems/unknown-armies-3e/templates/apps/stress-dialog.html',
    'systems/unknown-armies-3e/templates/apps/create-compendium.html'
  ];

  return loadTemplates(templatePaths);
};