// Import document classes.
import { AntikaV2Actor } from './documents/actor.mjs';
import { AntikaV2Item } from './documents/item.mjs';
// Import sheet classes.
import { AntikaV2ActorSheet } from './sheets/actor-sheet.mjs';
import { AntikaV2ItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
import { ANTIKA_V2 } from './helpers/config.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';

console.log("🔍 Vérification de ANTIKA_V2 : ", ANTIKA_V2);
console.log("🔍 LOCALIZATION_PREFIXES : ", ANTIKA_V2.LOCALIZATION_PREFIXES);

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.antikav2 = {
    AntikaV2Actor,
    AntikaV2Item,
    rollItemMacro,
  };

  // Add custom constants for configuration.
  CONFIG.ANTIKA_V2 = ANTIKA_V2;


  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: "@competences.strategie.value}d10 + @abilities.sophos.value",
    decimals: 0,
  };



  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = AntikaV2Actor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.AntikaV2Character,
    npc: models.AntikaV2NPC
  }
  CONFIG.Item.documentClass = AntikaV2Item;
  CONFIG.Item.dataModels = {
    arme: models.AntikaV2Arme,
    armure: models.AntikaV2Armure,
    bouclier: models.AntikaV2Bouclier,
    pouvoir: models.AntikaV2Pouvoir,
    aptitude: models.AntikaV2Aptitude,
    objet: models.AntikaV2Objet
  }

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('antika-v2', AntikaV2ActorSheet, {
    makeDefault: true,
    label: 'ANTIKA_V2.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('antika-v2', AntikaV2ItemSheet, {
    makeDefault: true,
    label: 'ANTIKA_V2.SheetLabels.Item',
  });
  // 🎲 Enregistrement du mode de gain de Némésis
  game.settings.register("antika-v2", "nemesisRule", {
    name: game.i18n.localize("ANTIKA_V2.Settings.nemesisRule.name"),
    hint: game.i18n.localize("ANTIKA_V2.Settings.nemesisRule.hint"),
    scope: "world",
    config: true,
    type: String,
    default: "perDie",
    choices: {
      perDie: game.i18n.localize("ANTIKA_V2.Settings.nemesisRule.perDie"),
      perRoll: game.i18n.localize("ANTIKA_V2.Settings.nemesisRule.perRoll"),
    },
    onChange: value => {
      CONFIG.ANTIKA_V2.NEMESIS_RULE = value;
      console.log(`🎲 Mode Némésis mis à jour : ${value}`);
    }
  });


  // Ensuite, on charge la valeur et on l’injecte dans la config
  CONFIG.ANTIKA_V2.NEMESIS_RULE = game.settings.get("antika-v2", "nemesisRule");



  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('toLowerCase', function (str) {
  return str.toLowerCase();
});

/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.antikav2.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'antika-v2.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
