# Connecteur Google Drive — étape suivante

Ce dossier prépare la synchronisation, mais la V0.1 utilise encore la sauvegarde locale.

## Déploiement prévu
1. Créer un projet Google Apps Script.
2. Copier `Code.gs` et `appsscript.json`.
3. Déployer comme application web exécutée par l’utilisateur connecté.
4. Héberger ensuite l’interface dans Apps Script ou ajouter un canal de communication sécurisé.
5. Tester avec le compte Google Workspace de l’utilisateur : certaines politiques administrateur peuvent bloquer Drive ou Apps Script.

## Données prévues
- Dossier Drive : `Quiz_TSI`.
- Fichier : `progression.json`.
- Feuille : `Historique_Quiz_TSI`.

Ne pas mettre une URL Apps Script secrète ou un jeton dans le dépôt public.
