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
    const system = this.system;

    // Attributs principaux (Soma, Sophos, Symbiose)
    system.attributes = system.attributes || {};
    system.attributes.soma = system.attributes.soma || { value: 0 };
    system.attributes.sophos = system.attributes.sophos || { value: 0 };
    system.attributes.symbiose = system.attributes.symbiose || { value: 0 };

    // Ressources principales
    system.resources = system.resources || {};

    // PV : seul le value est modifiable par l’utilisateur
    if (!system.resources.pv) system.resources.pv = {};
    if (system.resources.pv.value === undefined) {
      const soma = parseInt(system.attributes?.soma?.value) || 0;
      system.resources.pv.value = soma * 2 + 10; // valeur initiale = max
    }

    // PM : max est calculé, value initialisé uniquement
    system.resources.pm = system.resources.pm || {};
    if (system.resources.pm.value === undefined) system.resources.pm.value = 5;

    // Aristeia : max est calculé, value initialisé uniquement
    system.resources.aristeia = system.resources.aristeia || {};
    if (system.resources.aristeia.value === undefined) system.resources.aristeia.value = 0;

    // Hubris et Némésis : pas calculés, initialisés complets
    system.resources.hubris = system.resources.hubris || {};
    if (system.resources.hubris.value === undefined) system.resources.hubris.value = 0;
    if (system.resources.hubris.max === undefined) system.resources.hubris.max = 5;

    system.resources.nemesis = system.resources.nemesis || {};
    if (system.resources.nemesis.value === undefined) system.resources.nemesis.value = 0;
    if (system.resources.nemesis.max === undefined) system.resources.nemesis.max = 3;

    // ✅ Forcer les entiers (anti-erreurs de validation)
    system.resources.hubris.value = parseInt(system.resources.hubris.value) || 0;
    system.resources.aristeia.value = parseInt(system.resources.aristeia.value) || 0;
    system.resources.pm.value = parseInt(system.resources.pm.value) || 0;
    system.resources.pv.value = parseInt(system.resources.pv.value) || 0;
  }

  /** @override */
  prepareDerivedData() {
    const system = this.system;

    const soma = parseInt(system.attributes.soma.value) || 0;
    const sophos = parseInt(system.attributes.sophos.value) || 0;
    const symbiose = parseInt(system.attributes.symbiose.value) || 0;

    system.resources.pv.max = soma * 2 + 10;
    system.resources.pm.max = sophos + 5;
    system.resources.aristeia.max = Math.floor(symbiose / 2);
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
   * Intercepte les données modifiées juste avant l'enregistrement.
   * Permet de corriger des formats invalides (ex: "0" string => 0 number).
   */
  // async _preUpdate(changed, options, user) {
  //   console.warn("🧪 PRE-UPDATE DATA:", foundry.utils.deepClone(changed));

  //   return super._preUpdate(changed, options, user);
  // }

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
