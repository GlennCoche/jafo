# NerdOctaxe Dashboard — App Umbrel (Jafo Store)

Cette app affiche le **dashboard Next.js** (tableau de bord complet) sur Umbrel OS.  
L’**image Docker** est construite depuis le projet **`dashboard-next/`** (à la racine du dépôt), puis poussée sur Docker Hub. Umbrel ne build pas les apps du Community Store : il utilise l’image pré-construite.

## Installation sur Umbrel

1. **Ajouter le store Jafo** (si ce n’est pas déjà fait)  
   Umbrel → Paramètres → App Store → Community App Store → Add custom store →  
   URL : `https://github.com/GlennCoche/jafo`

2. **Installer l’app**  
   Dans le store Jafo, installer **NerdOctaxe Dashboard**.

3. **Configurer les variables** (après installation)  
   - **MINER_IP** : IP ou hostname de votre NerdOctaxe (ex. `192.168.1.37`).  
   - **APP_BITCOIN_NODE_IP** (optionnel) : URL complète du nœud Bitcoin (REST), ex. `http://192.168.1.35:2100` pour le Public REST API d’Umbrel.  

   Pour modifier les variables : accès SSH à Umbrel, puis éditer  
   `~/umbrel/app-data/jafo-nerdoctaxe-dashboard/docker-compose.yml`  
   (section `environment` du service `server`). Redémarrer l’app après modification.

## Publication d’une nouvelle version (mainteneur)

1. Depuis **`dashboard-next/`** à la racine du dépôt :
   ```bash
   cd dashboard-next
   chmod +x build-and-push.sh
   ./build-and-push.sh 2.0.0
   ```
2. Mettre à jour le tag dans **`jafo-nerdoctaxe-dashboard/docker-compose.yml`** (`image: glenncoche/nerdoctaxe-dashboard:2.0.0`) et la **version** dans **`umbrel-app.yml`**.
3. Pousser le dépôt **Jafo** sur GitHub. Les utilisateurs qui ont déjà ajouté le store pourront mettre à jour l’app depuis Umbrel.
