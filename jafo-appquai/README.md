# AppQUAI (store Jafo)

Nœud QUAI (mainnet Colosseum, slice [0 0]) + serveur Stratum intégré + dashboard. Installable depuis le store **Jafo** sur UmbrelOS.

- **Connexion mineur** : `stratum+tcp://<ip-umbrel>:3333` (username = adresse Quai/Qi, password = `x`).
- **Réglages** : adresses et préférences dans l’onglet Réglages du dashboard ; redémarrer le nœud pour appliquer.
- **Espace disque** : au moins 700 Go pour le datadir. Ne connecter le mineur qu’après **synchronisation complète** du nœud.

## Images Docker (1.0.0)

- `glenncoche/appquai-init:1.0.0`
- `glenncoche/appquai-go-quai:1.0.0`
- `glenncoche/appquai-server:1.0.0`

## Mise à jour des images (mainteneur)

```bash
cd jafo-appquai
chmod +x build-and-push.sh
./build-and-push.sh 1.0.1
```

Puis mettre à jour `docker-compose.yml` (tag des images) et `umbrel-app.yml` (version), commit + push GitHub.
