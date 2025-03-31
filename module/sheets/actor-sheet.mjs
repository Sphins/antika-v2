import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class AntikaV2ActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['antika-v2', 'sheet', 'actor'],
      width: 800,
      height: 1000,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'features',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/antika-v2/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toPlainObject();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.ANTIKA_V2
    context.config = CONFIG.ANTIKA_V2;

    // Prepare character data and items.
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );

    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Character-specific context modifications
   *
   * @param {object} context The context object to mutate
   */
  _prepareCharacterData(context) {
    // This is where you can enrich character-specific editor fields
    // or setup anything else that's specific to this type
  }

  /**
   * Organize and classify Items for Actor sheets.
   *
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const features = [];
    const spells = {
      0: [],
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
      7: [],
      8: [],
      9: [],
    };

    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      if (i.type === 'item') {
        gear.push(i);
      }
      // Append to features.
      else if (i.type === 'feature') {
        features.push(i);
      }
      // Append to spells.
      else if (i.type === 'spell') {
        if (i.system.spellLevel != undefined) {
          spells[i.system.spellLevel].push(i);
        }
      }
    }

    // Assign and return
    context.gear = gear;
    context.features = features;
    context.spells = spells;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  async _onRoll(event) {
    event.preventDefault();

    const element = event.currentTarget;
    const dataset = element.dataset;
    const nemesisMode = CONFIG.ANTIKA_V2?.NEMESIS_RULE ?? "perDie";

    if (!dataset.rollCapacity) return;

    const [groupRaw, key] = dataset.rollCapacity.split(".");
    const group = groupRaw.toLowerCase();

    const value = foundry.utils.getProperty(this.actor.system.capacity, `${groupRaw}.${key}`) ?? 0;
    const characteristic = foundry.utils.getProperty(this.actor.system.attributes, `${group}.value`) ?? 0;
    const label = game.i18n.localize(`ANTIKA_V2.capacity.${groupRaw}.${key}`);

    let allDice = [];
    let explosionCount = 0;

    if (value > 0) {
      for (let i = 0; i < value; i++) {
        let rolls = [];
        let total = 0;
        let rerolling = true;

        while (rerolling) {
          const roll = new Roll("1d10");
          await roll.evaluate();
          const result = roll.total;

          rolls.push(result);
          total += result;

          if (result === 10) explosionCount++;
          rerolling = (result === 10);
        }

        allDice.push({ total, rolls });
      }
    } else {
      if (group === "sophos") {
        ui.notifications.warn(game.i18n.localize("ANTIKA_V2.roll.sophosForbidden"));
        return;
      }

      const roll = new Roll("1d5");
      await roll.evaluate();
      allDice.push({ total: roll.total, rolls: [roll.total] });
    }

    // Némésis
    let nemesisGain = 0;
    if (nemesisMode === "perDie") {
      nemesisGain = explosionCount;
    } else if (nemesisMode === "perRoll" && explosionCount > 0) {
      nemesisGain = 1;
    }

    if (nemesisGain > 0) {
      const currentNemesis = foundry.utils.getProperty(this.actor.system.resources.nemesis, "value") ?? 0;
      await this.actor.update({ "system.resources.nemesis.value": currentNemesis + nemesisGain });
    }

    // Calcul final
    const best = allDice.reduce((a, b) => (a.total > b.total ? a : b));
    const finalResult = best.total + characteristic;

    // Affichage
    const diceText = allDice.map(d => d.rolls.length > 1 ? `(${d.rolls.join(" + ")})` : `${d.rolls[0]}`).join(", ");
    const bestText = best.rolls.length > 1 ? `(${best.rolls.join(" + ")})` : `${best.rolls[0]}`;

    const abilityLabel = game.i18n.localize(CONFIG.ANTIKA_V2.abilities[group]);
    let nemesisText = "";
    if (nemesisGain === 1) {
      nemesisText = `<p style="color: darkred;"><strong>+1</strong> ${game.i18n.localize("ANTIKA_V2.roll.nemesisGainOne")}</p>`;
    } else if (nemesisGain > 1) {
      nemesisText = `<p style="color: darkred;"><strong>+${nemesisGain}</strong> ${game.i18n.localize("ANTIKA_V2.roll.nemesisGainMany")}</p>`;
    }

    const html = `
    <p><strong>${game.i18n.localize("ANTIKA_V2.roll.diceRolled")} :</strong> ${diceText}</p>
    <p><strong>${game.i18n.format("ANTIKA_V2.roll.characteristic", { group: game.i18n.localize(`ANTIKA_V2.Ability.${groupRaw}.long`) })} :</strong> ${characteristic}</p>
    <p><strong>${game.i18n.localize("ANTIKA_V2.roll.finalResult")} :</strong> ${bestText} + ${characteristic} = <strong>${finalResult}</strong></p>
    ${nemesisText}
  `;

    ChatMessage.create({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${game.i18n.localize("ANTIKA_V2.roll.rollLabel")} ${label}`,
      content: html,
    });
  }
}