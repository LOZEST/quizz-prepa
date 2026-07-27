# Utiliser la synchronisation Google Drive

La synchronisation est **facultative**, local-first et non temps réel. Quiz, tableau, tests et maîtrise restent utilisables sans Google. La clé locale n'est ni un coffre-fort ni un chiffrement de bout en bout.

## Mise en route pas à pas

1. Déployer Apps Script selon `apps-script-deployment.md` et initialiser le dossier Drive.
2. Exécuter `generateSyncKey()` et conserver `VOTRE_CLE_DE_SYNCHRONISATION` hors du dépôt.
3. Copier `VOTRE_URL_APPS_SCRIPT` depuis le déploiement.
4. Dans **Menu → Synchronisation Google Drive → Configurer**, saisir l'URL et la clé.
5. Choisir **Tester la connexion**, puis **Enregistrer** uniquement après « Connexion réussie ».
6. Pour une première synchronisation, comparer les compteurs local/Drive et garder le choix recommandé **Fusionner sans supprimer les données existantes**. « Envoyer » conserve explicitement Drive tant que l'utilisateur n'a pas confirmé; « récupérer » conserve explicitement le local tant que l'utilisateur n'a pas confirmé; Annuler ne change rien.
7. Sur un second appareil, répéter 3–6 : l'import validé et idempotent reconstruit les données dérivées.
8. Utiliser **Synchroniser maintenant**, ou activer l'automatisation (retour en ligne/premier plan et période calme, jamais pendant `pointermove`).
9. Ouvrir **Conflits**. Pour un brouillon divergent, prévisualiser les deux versions vectorielles puis conserver local, distant, les deux, ou décider plus tard. Aucune version n'est supprimée avant résolution.
10. Créer explicitement une sauvegarde complète (avec brouillons) ou légère. La liste charge seulement les métadonnées.
11. Pour restaurer, vérifier checksum/schéma/taille, créer la sauvegarde locale de sécurité, puis choisir la fusion recommandée. Le remplacement exige deux confirmations.
12. Pour changer la clé, utiliser **Remplacer la clé**, tester et enregistrer.
13. **Supprimer la configuration** efface seulement l'URL et la clé de cet appareil, jamais le dossier ou les sauvegardes Drive.

Les actions Drive hors ligne précisent que la connexion est nécessaire uniquement pour Google Drive et que le quiz reste disponible hors connexion. Le diagnostic indique seulement la présence de l'endpoint/de la clé, jamais leurs valeurs.

## États

Non configurée, Connexion à vérifier, Configurée, Synchronisation en cours, À jour, modifications en attente, Hors connexion, Erreur et conflits à résoudre. « À jour » exige une dernière réussite, une outbox vide, aucun conflit bloquant et aucun traitement en cours.
