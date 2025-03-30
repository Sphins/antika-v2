import AntikaV2DataModel from "./base-model.mjs";

export default class AntikaV2ActorBase extends AntikaV2DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };

    const schema = {};

    // 🎭 Caractéristiques Principales
    schema.attributes = new fields.SchemaField({
      soma: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 })
      }),
      sophos: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 })
      }),
      symbiose: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 })
      })
    });

    // ❤️ Points de Vie (PV)
    schema.pv = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 10 })
    });

    // 🔥 Points de Miracle (PM)
    schema.pm = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 5 })
    });

    // ⚔️ Ressources Spéciales
    schema.resources = new fields.SchemaField({
      aristeia: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 })
      }),
      hubris: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 })
      }),
      nemesis: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 })
      })
    });


    // 🧬 Données de Bandeau (identité)
    schema.identity = new fields.SchemaField({
      age: new fields.NumberField({ required: true, nullable: false, initial: 30, min: 0 }),
      sex: new fields.StringField({ required: true, initial: "M" }),
      size: new fields.StringField({ required: true, initial: "1,75m" }),
      weight: new fields.StringField({ required: true, initial: "80kg" }),
      race: new fields.StringField({ required: true, initial: "Humain" }),
      carriere: new fields.StringField({ required: true, initial: "" }),
      metier: new fields.StringField({ required: true, initial: "" }),
      divinite: new fields.StringField({ required: true, initial: "" }),
      origine: new fields.StringField({ required: true, initial: "" }),
      main: new fields.StringField({ required: true, initial: "" }),
      descriptionCourte: new fields.StringField({ required: false, blank: true })
    });

    // 📜 Biographie (longue)
    schema.biography = new fields.StringField({ required: true, blank: true });

    return schema;
  }
}
