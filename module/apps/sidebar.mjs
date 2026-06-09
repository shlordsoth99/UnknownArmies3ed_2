/**
 * Unknown Armies 3E Sidebar Enhancements
 * Foundry VTT 13 compatible implementation
 * Uses native DocumentDirectory API and DOM mutation observers
 */

export function registerSidebarHooks() {

  // Wait for UI to be fully ready, then inject buttons
  Hooks.once('ready', () => {
    injectSidebarButtons();
    setupMutationObserver();
  });

  // Also hook into render events as backup
  Hooks.on('renderActorDirectory', injectActorButtons);
  Hooks.on('renderItemDirectory', injectItemButtons);
  Hooks.on('renderSceneDirectory', injectSceneButtons);
  Hooks.on('renderJournalDirectory', injectJournalButtons);
  Hooks.on('renderRollTableDirectory', injectRollTableButtons);
  Hooks.on('renderCardsDirectory', injectCardsButtons);
  Hooks.on('renderPlaylistDirectory', injectPlaylistButtons);
  Hooks.on('renderCompendiumDirectory', injectCompendiumButtons);
  Hooks.on('renderMacroDirectory', injectMacroButtons);
}

/**
 * Setup mutation observer to catch dynamically rendered directories
 */
function setupMutationObserver() {
  const sidebar = document.querySelector('#sidebar');
  if (!sidebar) return;

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if added node is a directory tab
          if (node.matches?.('[data-tab]')) {
            const tab = node.getAttribute('data-tab');
            if (tab === 'actors') setTimeout(injectActorButtons, 50);
            if (tab === 'items') setTimeout(injectItemButtons, 50);
            if (tab === 'scenes') setTimeout(injectSceneButtons, 50);
            if (tab === 'journal') setTimeout(injectJournalButtons, 50);
            if (tab === 'tables') setTimeout(injectRollTableButtons, 50);
            if (tab === 'cards') setTimeout(injectCardsButtons, 50);
            if (tab === 'playlists') setTimeout(injectPlaylistButtons, 50);
            if (tab === 'compendium') setTimeout(injectCompendiumButtons, 50);
            if (tab === 'macros') setTimeout(injectMacroButtons, 50);
          }

          // Check nested elements
          const directories = node.querySelectorAll?.('.directory');
          if (directories) {
            directories.forEach(dir => {
              const tabId = dir.closest('[data-tab]')?.getAttribute('data-tab');
              if (tabId === 'actors') injectActorButtons();
              if (tabId === 'items') injectItemButtons();
              if (tabId === 'scenes') injectSceneButtons();
              if (tabId === 'journal') injectJournalButtons();
              if (tabId === 'tables') injectRollTableButtons();
              if (tabId === 'cards') injectCardsButtons();
              if (tabId === 'playlists') injectPlaylistButtons();
              if (tabId === 'compendium') injectCompendiumButtons();
              if (tabId === 'macros') injectMacroButtons();
            });
          }
        }
      }
    }
  });

  observer.observe(sidebar, { childList: true, subtree: true });
}

/**
 * Inject all sidebar buttons at once (for initial load)
 */
function injectSidebarButtons() {
  setTimeout(() => {
    injectActorButtons();
    injectItemButtons();
    injectSceneButtons();
    injectJournalButtons();
    injectRollTableButtons();
    injectCardsButtons();
    injectPlaylistButtons();
    injectCompendiumButtons();
    injectMacroButtons();
  }, 100);
}

/* ============================================ */
/*  ACTOR DIRECTORY                             */
/* ============================================ */

function injectActorButtons() {
  const directory = document.querySelector('#actors .directory');
  if (!directory) return;

  // Remove existing UA3E buttons to avoid duplicates
  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-character" data-action="create-character">
      <i class="fas fa-user"></i>
      <span>${game.i18n.localize('UA3E.CreateCharacter')}</span>
    </button>
    <button type="button" class="ua3e-btn ua3e-btn-npc" data-action="create-npc">
      <i class="fas fa-skull"></i>
      <span>${game.i18n.localize('UA3E.CreateNPC')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-character"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3EActor('character');
  });

  buttonsContainer.querySelector('[data-action="create-npc"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3EActor('npc');
  });
}

/* ============================================ */
/*  ITEM DIRECTORY                                */
/* ============================================ */

function injectItemButtons() {
  const directory = document.querySelector('#items .directory');
  if (!directory) return;

  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-identity" data-action="create-identity">
      <i class="fas fa-id-card"></i>
      <span>${game.i18n.localize('UA3E.CreateIdentity')}</span>
    </button>
    <button type="button" class="ua3e-btn ua3e-btn-equipment" data-action="create-equipment">
      <i class="fas fa-toolbox"></i>
      <span>${game.i18n.localize('UA3E.CreateEquipment')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-identity"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3EItem('identity');
  });

  buttonsContainer.querySelector('[data-action="create-equipment"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3EItem('equipment');
  });
}

/* ============================================ */
/*  SCENE DIRECTORY                               */
/* ============================================ */

function injectSceneButtons() {
  const directory = document.querySelector('#scenes .directory');
  if (!directory) return;

  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-scene" data-action="create-scene">
      <i class="fas fa-map"></i>
      <span>${game.i18n.localize('UA3E.CreateScene')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-scene"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3EScene();
  });
}

/* ============================================ */
/*  JOURNAL DIRECTORY                             */
/* ============================================ */

function injectJournalButtons() {
  const directory = document.querySelector('#journal .directory');
  if (!directory) return;

  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-journal" data-action="create-journal">
      <i class="fas fa-book-open"></i>
      <span>${game.i18n.localize('UA3E.CreateJournal')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-journal"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3EJournal();
  });
}

/* ============================================ */
/*  ROLL TABLE DIRECTORY                          */
/* ============================================ */

function injectRollTableButtons() {
  const directory = document.querySelector('#tables .directory');
  if (!directory) return;

  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-table" data-action="create-table">
      <i class="fas fa-dice"></i>
      <span>${game.i18n.localize('UA3E.CreateRollTable')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-table"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3ERollTable();
  });
}

/* ============================================ */
/*  CARDS DIRECTORY                               */
/* ============================================ */

function injectCardsButtons() {
  const directory = document.querySelector('#cards .directory');
  if (!directory) return;

  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-cards" data-action="create-cards">
      <i class="fas fa-cards-blank"></i>
      <span>${game.i18n.localize('UA3E.CreateCards')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-cards"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3ECards();
  });
}

/* ============================================ */
/*  PLAYLIST DIRECTORY                            */
/* ============================================ */

function injectPlaylistButtons() {
  const directory = document.querySelector('#playlists .directory');
  if (!directory) return;

  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-playlist" data-action="create-playlist">
      <i class="fas fa-music"></i>
      <span>${game.i18n.localize('UA3E.CreatePlaylist')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-playlist"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3EPlaylist();
  });
}

/* ============================================ */
/*  COMPENDIUM DIRECTORY                          */
/* ============================================ */

function injectCompendiumButtons() {
  const directory = document.querySelector('#compendium .directory');
  if (!directory) return;

  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-compendium" data-action="create-compendium">
      <i class="fas fa-atlas"></i>
      <span>${game.i18n.localize('UA3E.CreateCompendium')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-compendium"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3ECompendium();
  });
}

/* ============================================ */
/*  MACRO DIRECTORY                               */
/* ============================================ */

function injectMacroButtons() {
  const directory = document.querySelector('#macros .directory');
  if (!directory) return;

  directory.querySelectorAll('.ua3e-directory-buttons').forEach(el => el.remove());

  const header = directory.querySelector('.directory-header');
  if (!header) return;

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'ua3e-directory-buttons';
  buttonsContainer.innerHTML = `
    <button type="button" class="ua3e-btn ua3e-btn-macro" data-action="create-macro">
      <i class="fas fa-terminal"></i>
      <span>${game.i18n.localize('UA3E.CreateMacro')}</span>
    </button>
  `;

  header.appendChild(buttonsContainer);

  buttonsContainer.querySelector('[data-action="create-macro"]').addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    createUA3EMacro();
  });
}

/* ============================================ */
/*  CREATION FUNCTIONS                            */
/* ============================================ */

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

async function createUA3EScene() {
  const sceneData = {
    name: game.i18n.localize('UA3E.NewScene'),
    width: 3000,
    height: 2000,
    grid: { type: 1, size: 100, color: '#000000', alpha: 0.2 }
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

async function createUA3EJournal() {
  const journalData = {
    name: game.i18n.localize('UA3E.NewJournal'),
    pages: [{ name: game.i18n.localize('UA3E.NewPage'), type: 'text', text: { content: '' } }]
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

async function createUA3ERollTable() {
  const tableData = { name: game.i18n.localize('UA3E.NewRollTable'), formula: '1d6', results: [] };

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

async function createUA3ECards() {
  const cardsData = { name: game.i18n.localize('UA3E.NewCards'), type: 'deck' };

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

async function createUA3EPlaylist() {
  const playlistData = { name: game.i18n.localize('UA3E.NewPlaylist'), mode: 'sequential', sounds: [] };

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

async function createUA3EMacro() {
  const macroData = { name: game.i18n.localize('UA3E.NewMacro'), type: 'script', command: '' };

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