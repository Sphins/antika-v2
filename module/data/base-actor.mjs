import AntikaV2DataModel from "./base-model.mjs";

export default class AntikaV2ActorBase extends AntikaV2DataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    const schema = {};

    // 🎭 **Caractéristiques Principales**
    schema.attributes = new fields.SchemaField({
      soma: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
      sophos: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
      symbiose: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 })
    });

    // ❤️ **Points de Vie (PV)**
    schema.pv = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 10 })
    });

    // 🔥 **Points de Miracle (PM)**
    schema.pm = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });

    // ⚔️ **Ressources Spéciales**
    schema.resources = new fields.SchemaField({
      aristeia: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 }),
      hubris: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
      nemesis: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 })
    });

    // 📜 **Biographie**
    schema.biography = new fields.StringField({ required: true, blank: true });

    return schema;
  }
}
