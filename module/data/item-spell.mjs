import AntikaV2ItemBase from "./base-item.mjs";

export default class AntikaV2Spell extends AntikaV2ItemBase {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.spellLevel = new fields.NumberField({ required: true, nullable: false, integer: true, initial: 1, min: 1, max: 9 });

    return schema;
  }
}