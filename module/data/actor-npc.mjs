import AntikaV2ActorBase from "./base-actor.mjs";

export default class AntikaV2Character extends AntikaV2ActorBase {

  static localizationPrefix = "ANTIKA_V2";

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    // 🎭 Niveau du personnage (spécifique aux personnages)
    schema.level = new fields.SchemaField({
      value: new fields.NumberField({ ...requiredInteger, initial: 1, min: 1 })
    });

    return schema;
  }

  prepareDerivedData() {
    super.prepareDerivedData(); // On conserve la logique des valeurs dérivées de la base

    // Ici, on pourrait ajouter des calculs spécifiques aux Personnages Joueurs (exemple futur)
  }

  getRollData() {
    const data = super.getRollData();

    // 📊 Ajout du niveau pour les jets spécifiques aux personnages joueurs
    data.lvl = this.level.value;

    return data;
  }
}
