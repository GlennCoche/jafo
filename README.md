# Jafo — Community App Store pour UmbrelOS

Ce dépôt est un **Community App Store** Umbrel. Il permet d’installer l’application **NerdOctaxe Dashboard** directement depuis UmbrelOS pour monitorer et optimiser votre mineur NerdOctaxe sur le réseau local.

- **Dépôt :** [https://github.com/GlennCoche/jafo](https://github.com/GlennCoche/jafo)
- **Store ID :** `jafo`
- **App fournie :** NerdOctaxe Dashboard (`jafo-nerdoctaxe-dashboard`)

---

## Installation sur UmbrelOS

### 1. Ajouter le store dans Umbrel

1. Sur votre **Umbrel** (ex. `https://umbrel.local`), allez dans **Paramètres** (engrenage).
2. Ouvrez **App Store**.
3. Dans la section **Community App Store**, cliquez sur les **trois points** (⋮) ou sur **Add custom store** / **Ajouter un store**.
4. Collez l’URL de ce dépôt :
   ```text
   https://github.com/GlennCoche/jafo
   ```
5. Validez. Le store **« Jafo »** apparaît dans la liste des stores communautaires.

### 2. Installer NerdOctaxe Dashboard

1. Ouvrez le **App Store** (ou l’onglet du store **Jafo**).
2. Trouvez **NerdOctaxe Dashboard**.
3. Cliquez sur **Install** / **Installer**.
4. Une fois l’app installée, ouvrez-la depuis le tableau de bord Umbrel.

### 3. Configurer l’app (miner + StratumX)

L’app est le **dashboard Next.js** (QUAI / StratumX). Par défaut elle contacte le miner à **192.168.1.37**. Umbrel ne propose en général pas d’interface pour les variables d’environnement ; il faut les éditer après installation :

1. Accédez à votre Umbrel en **SSH** (ou terminal intégré).
2. Éditez `~/umbrel/app-data/jafo-nerdoctaxe-dashboard/docker-compose.yml` (section `environment` du service `server`).
3. Définissez au minimum **MINER_IP** (IP de votre NerdOctaxe). Optionnel : **STRATUMX_PROFILE_PATH** (chemin vers un fichier JSON de profil StratumX dans le conteneur) ou **STRATUMX_PROFILE_URL** pour afficher la carte « StratumX / Profil minage ».
4. Redémarrez l’app depuis Umbrel ou : `docker compose down && docker compose up -d` dans ce dossier.

Votre miner et votre Umbrel doivent être sur le **même réseau local**.

---

## Structure du dépôt

Conforme au [template Community App Store](https://github.com/getumbrel/umbrel-community-app-store) Umbrel :

```text
jafo/
├── README.md
├── umbrel-app-store.yml    # id: jafo, name: Jafo
└── jafo-nerdoctaxe-dashboard/
    ├── umbrel-app.yml      # manifeste de l’app (version, port 3000)
    ├── docker-compose.yml  # image glenncoche/nerdoctaxe-dashboard:2.0.0
    └── README.md           # instructions installation / config
```

- **umbrel-app-store.yml** : définit le store (id et nom).
- **jafo-nerdoctaxe-dashboard/** : app NerdOctaxe Dashboard (Next.js). L’**image Docker** est construite depuis **dashboard-next/** à la racine du dépôt parent et poussée sur Docker Hub. Son `id` doit commencer par `jafo-`.

---

## Publication de l’image Docker (mainteneur)

Umbrel **ne build pas** les apps du Community Store : il utilise une **image pré-construite** sur Docker Hub. Sans image publiée, **Installer** échoue.

Pour publier (ou mettre à jour) l’image :

1. Compte [Docker Hub](https://hub.docker.com/) (ex. `glenncoche`) et `docker login`.
2. **Depuis le dossier `dashboard-next/`** (à la racine du dépôt parent, pas dans jafo) :
   ```bash
   cd dashboard-next
   chmod +x build-and-push.sh
   ./build-and-push.sh 2.0.0
   ```
   Cela build l’image **multi-arch** (arm64 + amd64) et la pousse sous `glenncoche/nerdoctaxe-dashboard:2.0.0` et `:latest`.
3. Mettre à jour le tag dans `jafo-nerdoctaxe-dashboard/docker-compose.yml` et la version dans `umbrel-app.yml`, puis pousser le dépôt Jafo sur GitHub.

Voir **DEPLOIEMENT-UMBREL.md** à la racine du dépôt pour le guide complet (installation, config MINER_IP / StratumX, dépannage).

---

## Ajouter d’autres apps plus tard

1. Créer un nouveau dossier dont le nom commence par `jafo-` (ex. `jafo-une-autre-app`).
2. Y mettre un `umbrel-app.yml` avec `id: jafo-une-autre-app` et un `docker-compose.yml` (avec `APP_HOST: jafo-une-autre-app_server_1` pour le proxy Umbrel).
3. Pousser les changements sur GitHub ; le store **Jafo** affichera la nouvelle app après rafraîchissement dans Umbrel.

---

## Dashboard Next.js (v2)

L’app installée depuis ce store est le **dashboard Next.js** (dépôt parent : **`dashboard-next/`**). Il inclut hashrate, températures, contrôle miner (modes 0–100 %), pool StratumX, coût électricité, blocs et difficulté QUAI (Quaiscan), profil StratumX, calculateur QUAI. Développement local : `cd dashboard-next && npm run dev` (voir `dashboard-next/README.md`).

---

## Références

- [Umbrel Community App Store (template)](https://github.com/getumbrel/umbrel-community-app-store)
- [NerdOctaxe / Bitronics](https://bitronics.store/nerdoctaxe/)
- [API Bitaxe / AxeOS](https://osmu.wiki/bitaxe/api/)
