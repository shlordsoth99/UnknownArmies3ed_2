/**
 * Unknown Armies 3E Sidebar Enhancements
 * Proper Foundry VTT 13 implementation using native APIs
 */

export function registerSidebarHooks() {

  /**
   * Hook into Actor Directory rendering to add custom buttons
   */
  Hooks.on('renderActorDirectory', (app, html, data) => {
    // Find the header actions area
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    // Create custom buttons container
    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-character" data-action="create-character" title="${game.i18n.localize('UA3E.CreateCharacter')}">
          <i class="fas fa-user"></i>
          <span>${game.i18n.localize('UA3E.CreateCharacter')}</span>
        </button>
        <button type="button" class="ua3e-btn ua3e-btn-npc" data-action="create-npc" title="${game.i18n.localize('UA3E.CreateNPC')}">
          <i class="fas fa-skull"></i>
          <span>${game.i18n.localize('UA3E.CreateNPC')}</span>
        </button>
      </div>
    `);

    // Insert after the create button
    const createBtn = headerActions.find('button.create-document');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    // Bind click handlers
    customButtons.find('[data-action="create-character"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3EActor('character');
    });

    customButtons.find('[data-action="create-npc"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3EActor('npc');
    });
  });

  /**
   * Hook into Item Directory rendering
   */
  Hooks.on('renderItemDirectory', (app, html, data) => {
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-identity" data-action="create-identity" title="${game.i18n.localize('UA3E.CreateIdentity')}">
          <i class="fas fa-id-card"></i>
          <span>${game.i18n.localize('UA3E.CreateIdentity')}</span>
        </button>
        <button type="button" class="ua3e-btn ua3e-btn-equipment" data-action="create-equipment" title="${game.i18n.localize('UA3E.CreateEquipment')}">
          <i class="fas fa-toolbox"></i>
          <span>${game.i18n.localize('UA3E.CreateEquipment')}</span>
        </button>
      </div>
    `);

    const createBtn = headerActions.find('button.create-document');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    customButtons.find('[data-action="create-identity"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3EItem('identity');
    });

    customButtons.find('[data-action="create-equipment"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3EItem('equipment');
    });
  });

  /**
   * Hook into Scene Directory rendering
   */
  Hooks.on('renderSceneDirectory', (app, html, data) => {
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-scene" data-action="create-scene" title="${game.i18n.localize('UA3E.CreateScene')}">
          <i class="fas fa-map"></i>
          <span>${game.i18n.localize('UA3E.CreateScene')}</span>
        </button>
      </div>
    `);

    const createBtn = headerActions.find('button.create-document');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    customButtons.find('[data-action="create-scene"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3EScene();
    });
  });

  /**
   * Hook into Journal Directory rendering
   */
  Hooks.on('renderJournalDirectory', (app, html, data) => {
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-journal" data-action="create-journal" title="${game.i18n.localize('UA3E.CreateJournal')}">
          <i class="fas fa-book-open"></i>
          <span>${game.i18n.localize('UA3E.CreateJournal')}</span>
        </button>
      </div>
    `);

    const createBtn = headerActions.find('button.create-document');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    customButtons.find('[data-action="create-journal"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3EJournal();
    });
  });

  /**
   * Hook into RollTable Directory rendering
   */
  Hooks.on('renderRollTableDirectory', (app, html, data) => {
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-table" data-action="create-table" title="${game.i18n.localize('UA3E.CreateRollTable')}">
          <i class="fas fa-dice"></i>
          <span>${game.i18n.localize('UA3E.CreateRollTable')}</span>
        </button>
      </div>
    `);

    const createBtn = headerActions.find('button.create-document');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    customButtons.find('[data-action="create-table"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3ERollTable();
    });
  });

  /**
   * Hook into Cards Directory rendering
   */
  Hooks.on('renderCardsDirectory', (app, html, data) => {
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-cards" data-action="create-cards" title="${game.i18n.localize('UA3E.CreateCards')}">
          <i class="fas fa-cards-blank"></i>
          <span>${game.i18n.localize('UA3E.CreateCards')}</span>
        </button>
      </div>
    `);

    const createBtn = headerActions.find('button.create-document');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    customButtons.find('[data-action="create-cards"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3ECards();
    });
  });

  /**
   * Hook into Playlist Directory rendering
   */
  Hooks.on('renderPlaylistDirectory', (app, html, data) => {
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-playlist" data-action="create-playlist" title="${game.i18n.localize('UA3E.CreatePlaylist')}">
          <i class="fas fa-music"></i>
          <span>${game.i18n.localize('UA3E.CreatePlaylist')}</span>
        </button>
      </div>
    `);

    const createBtn = headerActions.find('button.create-document');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    customButtons.find('[data-action="create-playlist"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3EPlaylist();
    });
  });

  /**
   * Hook into Compendium Directory rendering
   */
  Hooks.on('renderCompendiumDirectory', (app, html, data) => {
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-compendium" data-action="create-compendium" title="${game.i18n.localize('UA3E.CreateCompendium')}">
          <i class="fas fa-atlas"></i>
          <span>${game.i18n.localize('UA3E.CreateCompendium')}</span>
        </button>
      </div>
    `);

    const createBtn = headerActions.find('button.create-compendium');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    customButtons.find('[data-action="create-compendium"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3ECompendium();
    });
  });

  /**
   * Hook into Macro Directory rendering
   */
  Hooks.on('renderMacroDirectory', (app, html, data) => {
    const headerActions = html.find('.header-actions');
    if (!headerActions.length) return;

    const customButtons = $(`
      <div class="ua3e-directory-buttons">
        <button type="button" class="ua3e-btn ua3e-btn-macro" data-action="create-macro" title="${game.i18n.localize('UA3E.CreateMacro')}">
          <i class="fas fa-terminal"></i>
          <span>${game.i18n.localize('UA3E.CreateMacro')}</span>
        </button>
      </div>
    `);

    const createBtn = headerActions.find('button.create-document');
    if (createBtn.length) {
      createBtn.after(customButtons);
    } else {
      headerActions.append(customButtons);
    }

    customButtons.find('[data-action="create-macro"]').on('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      createUA3EMacro();
    });
  });
}

/* -------------------------------------------- */
/*  Creation Functions                            */
/* -------------------------------------------- */

/**
 * Create a new Actor with UA3E system
 * @param {string} type - 'character' or 'npc'
 */
async function createUA3EActor(type) {
  const actorData = {
    name: game.i18n.format('UA3E.NewActor', { type: game.i18n.localize(`UA3E.${type.charAt(0).toUpperCase() + type.slice(1)}`) }),
    type: type,
    system: {}
  };

  try {
    const actor = await Actor.create(actorData);
    if (actor) {
      actor.sheet.render(true);
      ui.notifications.info(game.i18n.format('UA3E.CreatedActor', { name: actor.name, type: type }));
    }
  } catch (err) {
    ui.notifications.error(game.i18n.localize('UA3E.ErrorCreateActor'));
    console.error('UA3E | Error creating actor:', err);
  }
}

/**
 * Create a new Item with UA3E system
 * @param {string} type - item type
 */
async function createUA3EItem(type) {
  const itemData = {
    name: game.i18n.format('UA3E.NewItem', { type: game.i18n.localize(`UA3E.Item${type.charAt(0).toUpperCase() + type.slice(1)}`) }),
    type: type,
    system: {}
  };

  try {
    const item = await Item.create(itemData);
    if (item) {
      item.sheet.render(true);
      ui.notifications.info(game.i18n.format('UA3E.CreatedItem', { name: item.name, type: type }));
    }
  } catch (err) {
    ui.notifications.error(game.i18n.localize('UA3E.ErrorCreateItem'));
    console.error('UA3E | Error creating item:', err);
  }
}

/**
 * Create a new Scene
 */
async function createUA3EScene() {
  const sceneData = {
    name: game.i18n.localize('UA3E.NewScene'),
    width: 3000,
    height: 2000,
    grid: {
      type: 1,
      size: 100,
      color: '#000000',
      alpha: 0.2
    }
  };

  try {
    const scene = await Scene.create(sceneData);
    if (scene) {
      scene.sheet.render(true);
      ui.notifications.info(game.i18n.format('UA3E.CreatedScene', { name: scene.name }));
    }
  } catch (err) {
    ui.notifications.error(game.i18n.localize('UA3E.ErrorCreateScene'));
    console.error('UA3E | Error creating scene:', err);
  }
}

/**
 * Create a new Journal Entry
 */
async function createUA3EJournal() {
  const journalData = {
    name: game.i18n.localize('UA3E.NewJournal'),
    pages: [{
      name: game.i18n.localize('UA3E.NewPage'),
      type: 'text',
      text: { content: '' }
    }]
  };

  try {
    const journal = await JournalEntry.create(journalData);
    if (journal) {
      journal.sheet.render(true);
      ui.notifications.info(game.i18n.format('UA3E.CreatedJournal', { name: journal.name }));
    }
  } catch (err) {
    ui.notifications.error(game.i18n.localize('UA3E.ErrorCreateJournal'));
    console.error('UA3E | Error creating journal:', err);
  }
}

/**
 * Create a new RollTable
 */
async function createUA3ERollTable() {
  const tableData = {
    name: game.i18n.localize('UA3E.NewRollTable'),
    formula: '1d6',
    results: []
  };

  try {
    const table = await RollTable.create(tableData);
    if (table) {
      table.sheet.render(true);
      ui.notifications.info(game.i18n.format('UA3E.CreatedRollTable', { name: table.name }));
    }
  } catch (err) {
    ui.notifications.error(game.i18n.localize('UA3E.ErrorCreateRollTable'));
    console.error('UA3E | Error creating roll table:', err);
  }
}

/**
 * Create a new Cards stack
 */
async function createUA3ECards() {
  const cardsData = {
    name: game.i18n.localize('UA3E.NewCards'),
    type: 'deck'
  };

  try {
    const cards = await Cards.create(cardsData);
    if (cards) {
      cards.sheet.render(true);
      ui.notifications.info(game.i18n.format('UA3E.CreatedCards', { name: cards.name }));
    }
  } catch (err) {
    ui.notifications.error(game.i18n.localize('UA3E.ErrorCreateCards'));
    console.error('UA3E | Error creating cards:', err);
  }
}

/**
 * Create a new Playlist
 */
async function createUA3EPlaylist() {
  const playlistData = {
    name: game.i18n.localize('UA3E.NewPlaylist'),
    mode: 'sequential',
    sounds: []
  };

  try {
    const playlist = await Playlist.create(playlistData);
    if (playlist) {
      playlist.sheet.render(true);
      ui.notifications.info(game.i18n.format('UA3E.CreatedPlaylist', { name: playlist.name }));
    }
  } catch (err) {
    ui.notifications.error(game.i18n.localize('UA3E.ErrorCreatePlaylist'));
    console.error('UA3E | Error creating playlist:', err);
  }
}

/**
 * Create a new Compendium
 */
async function createUA3ECompendium() {
  const types = ['Actor', 'Item', 'Scene', 'JournalEntry', 'RollTable', 'Macro', 'Cards'];

  const content = await renderTemplate('systems/unknown-armies-3e/templates/apps/create-compendium.html', { types });

  new Dialog({
    title: game.i18n.localize('UA3E.CreateCompendium'),
    content: content,
    buttons: {
      create: {
        icon: '<i class="fas fa-check"></i>',
        label: game.i18n.localize('UA3E.Create'),
        callback: async (html) => {
          const name = html.find('[name="name"]').val();
          const type = html.find('[name="type"]').val();
          const label = html.find('[name="label"]').val();

          if (!name) {
            ui.notifications.warn(game.i18n.localize('UA3E.CompendiumNameRequired'));
            return;
          }

          try {
            const pack = await CompendiumCollection.createCompendium({
              type: type,
              label: label || name,
              name: name.slugify(),
              system: 'unknown-armies-3e'
            });
            ui.notifications.info(game.i18n.format('UA3E.CreatedCompendium', { name: pack.metadata.label }));
          } catch (err) {
            ui.notifications.error(game.i18n.localize('UA3E.ErrorCreateCompendium'));
            console.error('UA3E | Error creating compendium:', err);
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
 * Create a new Macro
 */
async function createUA3EMacro() {
  const macroData = {
    name: game.i18n.localize('UA3E.NewMacro'),
    type: 'script',
    command: ''
  };

  try {
    const macro = await Macro.create(macroData);
    if (macro) {
      macro.sheet.render(true);
      ui.notifications.info(game.i18n.format('UA3E.CreatedMacro', { name: macro.name }));
    }
  } catch (err) {
    ui.notifications.error(game.i18n.localize('UA3E.ErrorCreateMacro'));
    console.error('UA3E | Error creating macro:', err);
  }
}