import AntikaV2ItemBase from "./base-item.mjs";

export default class AntikaV2Objet extends AntikaV2ItemBase {
    static localizationPrefix = "ANTIKA_V2.Item.Objet";

    static defineSchema() {
        return super.defineSchema(); // hérite du schéma de base pour l'instant
    }
}
