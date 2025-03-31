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

    // ⚔️ Ressources Spéciales
    schema.resources = new fields.SchemaField({
      aristeia: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 })
      }),
      hubris: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 5 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0, max: 5 })
      }),
      nemesis: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0, max: 3 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 3, min: 0, max: 3 })
      }),

      // ❤️ Points de Vie (PV)
      pv: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 10 })
      }),

      // 🔥 Points de Miracle (PM)
      pm: new fields.SchemaField({
        value: new fields.NumberField({ ...requiredInteger, initial: 5, min: 0 }),
        max: new fields.NumberField({ ...requiredInteger, initial: 5 })
      })

    });


    // 🧬 Données de Bandeau (identité)
    schema.identity = new fields.SchemaField({
      age: new fields.NumberField({ required: true, nullable: false, initial: 30, min: 0 }),
      sex: new fields.StringField({ required: true, initial: "" }),
      size: new fields.StringField({ required: true, initial: "" }),
      weight: new fields.StringField({ required: true, initial: "" }),
      race: new fields.StringField({ required: true, initial: "" }),
      carriere: new fields.StringField({ required: true, initial: "" }),
      metier: new fields.StringField({ required: true, initial: "" }),
      divinite: new fields.StringField({ required: true, initial: "" }),
      origine: new fields.StringField({ required: true, initial: "" }),
      main: new fields.StringField({ required: true, initial: "" }),
      descriptionCourte: new fields.StringField({ required: false, blank: true })
    });

    schema.capacity = new fields.SchemaField({});

    // On accède à la liste des capacités depuis la localisation
    const capacities = foundry.utils.getProperty(game.i18n.translations, "ANTIKA_V2.capacity") ?? {};

    // Pour chaque groupe (soma, sophos, symbiose)
    for (const [groupKey, abilities] of Object.entries(capacities)) {
      const groupFields = {};

      for (const abilityKey of Object.keys(abilities)) {
        groupFields[abilityKey] = new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 });

        // Cas particulier : on ajoute un champ texte pour l'arme personnalisée
        if (groupKey === "soma" && abilityKey === "arme") {
          groupFields["armeLabel"] = new fields.StringField({ required: false, initial: "" });
        }
      }

      schema.capacity.fields[groupKey] = new fields.SchemaField(groupFields);
    }



    // 📜 Biographie (longue)
    schema.biography = new fields.StringField({ required: true, blank: true });

    return schema;
  }
}
