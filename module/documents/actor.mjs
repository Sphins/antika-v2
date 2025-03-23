/**
 * Définition de la classe AntikaV2Actor pour gérer les Acteurs (Personnages et PNJ)
 * @extends {Actor}
 */
export class AntikaV2Actor extends Actor {
  /** @override */
  prepareData() {
    super.prepareData(); // Exécute la préparation standard de Foundry
  }

  /** @override */
  prepareBaseData() {
    // Initialisation des valeurs par défaut
    const system = this.system;

    // Attributs principaux (Soma, Sophos, Symbiose)
    system.attributes = system.attributes || {};
    system.attributes.soma = system.attributes.soma || { value: 0 };
    system.attributes.sophos = system.attributes.sophos || { value: 0 };
    system.attributes.symbiose = system.attributes.symbiose || { value: 0 };

    // Ressources principales (PV, PM, Aristéia, Hubris, Némésis)
    system.resources = system.resources || {};
    system.resources.pv = system.resources.pv || { value: 10, max: 10 };
    system.resources.pm = system.resources.pm || { value: 5, max: 5 };
    system.resources.aristeia = system.resources.aristeia || { value: 0, max: 3 };
    system.resources.hubris = system.resources.hubris || { value: 0, max: 5 };
    system.resources.nemesis = system.resources.nemesis || { value: 0, max: 3 };
  }

  /** @override */
  prepareDerivedData() {
    const system = this.system;

    // Calcul des valeurs dérivées
    system.resources.pv.max = system.attributes.soma.value * 2 + 10;  // Exemple : PV max = 2 * Soma + 10
    system.resources.pm.max = system.attributes.sophos.value + 5; // Exemple : PM max = Sophos + 5
    system.resources.aristeia.max = Math.floor(system.attributes.symbiose.value / 2); // Aristéia max = Symbiose / 2
  }

  /**
   * @override
   * Fournit les données nécessaires pour les jets de dés.
   */
  getRollData() {
    const system = this.system;

    return {
      ...super.getRollData(),
      soma: system.attributes.soma.value,
      sophos: system.attributes.sophos.value,
      symbiose: system.attributes.symbiose.value,
      pv: system.resources.pv.value,
      pm: system.resources.pm.value,
      aristeia: system.resources.aristeia.value,
      hubris: system.resources.hubris.value,
      nemesis: system.resources.nemesis.value
    };
  }

  /**
   * Convertit l'Actor en un objet simplifié.
   * Permet de récupérer les données pour les sauvegardes ou exports.
   */
  toPlainObject() {
    const result = { ...this };

    // Simplifie les données du système
    result.system = this.system.toPlainObject();

    // Ajoute les objets liés (Items et Effets)
    result.items = this.items?.size > 0 ? this.items.contents : [];
    result.effects = this.effects?.size > 0 ? this.effects.contents : [];

    return result;
  }
}
