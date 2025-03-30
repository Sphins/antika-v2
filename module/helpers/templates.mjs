export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/antika-v2/templates/actor/parts/actor-header.hbs',
    'systems/antika-v2/templates/actor/parts/actor-features.hbs',
    'systems/antika-v2/templates/actor/parts/actor-items.hbs',
    'systems/antika-v2/templates/actor/parts/actor-spells.hbs',
    'systems/antika-v2/templates/actor/parts/actor-effects.hbs',
    'systems/antika-v2/templates/actor/parts/actor-tabs.hbs',
    'systems/antika-v2/templates/actor/parts/actor-description.hbs',
    // Item partials
    'systems/antika-v2/templates/item/parts/item-effects.hbs',
  ]);
};
