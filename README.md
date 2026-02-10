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

### 3. Configurer l’IP du miner

Par défaut l’app contacte le miner à **192.168.1.37**. Pour changer l’IP :

- **Option A — Depuis l’app :** dans le dashboard, modifiez l’adresse dans la barre du haut et cliquez sur **Enregistrer**. L’IP est enregistrée côté serveur (fichier `data/config.json`).
- **Option B — Variable d’environnement :** si Umbrel permet de définir des variables pour l’app, ajoutez `MINER_IP=192.168.1.XX` (remplacez par l’IP réelle de votre NerdOctaxe).

Votre miner et votre nœud Umbrel doivent être sur le **même réseau local** (même box / même LAN).

---

## Structure du dépôt

Conforme au [template Community App Store](https://github.com/getumbrel/umbrel-community-app-store) Umbrel :

```text
jafo/
├── README.md
├── umbrel-app-store.yml    # id: jafo, name: Jafo
└── jafo-nerdoctaxe-dashboard/
    ├── umbrel-app.yml      # manifeste de l’app
    ├── docker-compose.yml
    ├── Dockerfile
    ├── package.json
    ├── server.js           # proxy + dashboard
    └── public/
        └── index.html      # interface du dashboard
```

- **umbrel-app-store.yml** : définit le store (id et nom).
- **jafo-nerdoctaxe-dashboard/** : une seule app pour l’instant, le dashboard NerdOctaxe. Son `id` doit commencer par `jafo-` (`jafo-nerdoctaxe-dashboard`).

---

## Publication de l’image Docker (mainteneur)

Umbrel **ne build pas** les apps du Community Store : il ne fait que cloner le dépôt et lancer `docker-compose up`. L’app utilise donc une **image pré-construite** sur Docker Hub. Sans cette image, le bouton **Installer** échoue sans message clair.

Pour publier (ou mettre à jour) l’image une fois :

1. Avoir un compte [Docker Hub](https://hub.docker.com/) (ex. utilisateur `glenncoche`).
2. Se connecter : `docker login`
3. Depuis le dossier `jafo-nerdoctaxe-dashboard/` :
   ```bash
   chmod +x build-and-push.sh
   ./build-and-push.sh          # pousse glenncoche/nerdoctaxe-dashboard:1.0.0
   # ou pour une autre version :
   ./build-and-push.sh 1.0.1
   ```
4. Si vous avez changé la version, mettre à jour le tag dans `jafo-nerdoctaxe-dashboard/docker-compose.yml` (`image: glenncoche/nerdoctaxe-dashboard:1.0.1`) et la version dans `umbrel-app.yml`, puis pousser le dépôt sur GitHub.

Après cela, les utilisateurs qui cliquent sur **Installer** dans le store Jafo pourront installer l’app correctement.

---

## Ajouter d’autres apps plus tard

1. Créer un nouveau dossier dont le nom commence par `jafo-` (ex. `jafo-une-autre-app`).
2. Y mettre un `umbrel-app.yml` avec `id: jafo-une-autre-app` et un `docker-compose.yml` (avec `APP_HOST: jafo-une-autre-app_server_1` pour le proxy Umbrel).
3. Pousser les changements sur GitHub ; le store **Jafo** affichera la nouvelle app après rafraîchissement dans Umbrel.

---

## Références

- [Umbrel Community App Store (template)](https://github.com/getumbrel/umbrel-community-app-store)
- [NerdOctaxe / Bitronics](https://bitronics.store/nerdoctaxe/)
- [API Bitaxe / AxeOS](https://osmu.wiki/bitaxe/api/)
