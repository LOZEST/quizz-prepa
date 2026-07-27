# Déployer le backend Google Apps Script

> Aucun déploiement réel n'est requis pour les tests locaux. La recette suivante doit être validée sur un compte Google avant de sortir la PR du mode brouillon.

1. Créer un projet Google Apps Script autonome.
2. Copier `apps-script/Code.gs` et le contenu de `apps-script/appsscript.json` dans le projet.
3. Exécuter `initializeSync_()` depuis l'éditeur afin de créer `Quiz TSI Sync/`, son manifest, `state/` et `snapshots/`.
4. Exécuter `generateSyncKey()` une seule fois et copier la valeur affichée vers un gestionnaire sûr sous le nom `VOTRE_CLE_DE_SYNCHRONISATION`.
5. Accepter l'autorisation Google Drive demandée. Vérifier qu'un seul dossier `Quiz TSI Sync` existe.
6. Choisir **Déployer → Nouveau déploiement → Application Web**, exécuter en tant que propriétaire et limiter l'accès selon le compte utilisé.
7. Copier l'URL du déploiement et la désigner uniquement par `VOTRE_URL_APPS_SCRIPT` dans les procédures.
8. Tester l'état public sans donnée personnelle : ouvrir `VOTRE_URL_APPS_SCRIPT`, puis envoyer un POST `health` avec la clé dans le corps :

```sh
curl -X POST 'VOTRE_URL_APPS_SCRIPT' \
  -H 'Content-Type: text/plain;charset=utf-8' \
  --data '{"action":"health","key":"VOTRE_CLE_DE_SYNCHRONISATION","protocolVersion":1,"schemaVersion":3,"data":{}}'
```

## Recette réelle restant à effectuer

- initialisation et autorisation Drive sur un compte dédié ;
- rotation/révocation d'une clé et vérification d'un refus après révocation ;
- deux clients concurrents pour vérifier `LockService`, mauvaise révision et conflits de brouillons ;
- inspection des checksums après modification/corruption volontaire d'un fichier ;
- comportement aux quotas Drive/Apps Script et à un verrou de plus de 30 secondes ;
- pull après plusieurs révisions et restauration manuelle contrôlée d'un snapshot (la future interface reste hors périmètre).
