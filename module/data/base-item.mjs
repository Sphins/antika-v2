import AntikaV2DataModel from "./base-model.mjs";

export default class AntikaV2ItemBase extends AntikaV2DataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.StringField({ required: true, blank: true });

    return schema;
  }

}