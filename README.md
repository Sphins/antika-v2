# Antika V2 – Foundry VTT System

Ce dépôt propose un **système de jeu “Antika V2”** pour Foundry VTT, librement adapté à partir du boilerplate “Simple System” (et de ses dérivés). Il a pour objectif de reproduire et d’automatiser au mieux les règles d’Antika V2, un jeu de rôle épique se déroulant dans la Grèce mycénienne, tout en bénéficiant des dernières fonctionnalités de Foundry (DataModel, etc.).

## Sommaire
- [Antika V2 – Foundry VTT System](#antika-v2--foundry-vtt-system)
  - [Sommaire](#sommaire)
  - [Présentation du système](#présentation-du-système)
  - [Installation](#installation)
  - [Démarche de développement](#démarche-de-développement)
    - [Architecture principale](#architecture-principale)
    - [Compilation SCSS](#compilation-scss)

---

## Présentation du système

Antika est un jeu de rôle se déroulant dans l’univers de la Grèce antique et mythique, combinant épopée, tragédie et actes héroïques. Les personnages y sont des héros, descendants d’humains ou de divinités, parcourant l’Oikouménè mycénienne autour de 1300 avant notre ère.  
Ce **système Foundry VTT** intègre :

- **Caractéristiques** (Soma, Sophos, Symbiose)  
- **Mécaniques spécifiques** (Aristéia, Hubris, Némésis)  
- **Système de compétences**  
- **Gestion du combat**  
- **Feuilles d’Acteurs** (PJ, PNJ)  
- **Feuilles d’Objets** (Armes, Équipements, etc.)  
- Etc.

Le système est construit sur la base du **boilerplate “Simple System”** mis à disposition par la communauté Foundry, et utilise les dernières possibilités (DataModel) offertes par Foundry **v12**.

---

## Installation

1. **Copier** ce dossier dans le répertoire `Data/systems/` de Foundry VTT.  
   - Le dossier **doit** s’appeler `antika-v2` si le champ `"name"` dans `system.json` est `antika-v2`.
2. **Redémarrer** Foundry.  
3. Dans la configuration de votre Monde, **choisir “Antika V2”** comme système.  

*(Optionnel)* : Si tu préfères cloner ce dépôt dans un répertoire séparé, tu peux créer un **lien symbolique** (symlink) vers `Data/systems/antika-v2`.

---

## Démarche de développement

Ce système a été créé via le **boilerplate** contenant un script `generate`, puis adapté pour correspondre aux règles Antika V2 (notamment l’utilisation de l’**Aristéia**, de l’**Hubris**, et les spécificités de l’univers mycénien).  

### Architecture principale
- **`system.json`** : Manifest Foundry (nom du système, version, compatibilité).  
- **`module/*`** : Scripts JavaScript/TypeScript, gestion du DataModel, définition des classes (Actors, Items…).  
- **`templates/*`** : Templates HTML pour les fiches de personnages, d’objets, etc.  
- **`styles/*`** : Feuilles CSS/SCSS.  

### Compilation SCSS
Si tu souhaites personnaliser le thème (couleurs, layout, etc.) :  
```bash
npm install
npm run build
