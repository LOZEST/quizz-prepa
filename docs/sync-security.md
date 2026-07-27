# Sécurité de la synchronisation

La clé personnelle protège l'accès pratique à l'endpoint. Elle **n'est pas un chiffrement de bout en bout** et n'empêche pas le propriétaire du Drive d'accéder aux fichiers. HTTPS protège le transport vers Apps Script.

Apps Script génère la clé avec `generateSyncKey()` et ne retourne sa valeur complète qu'à cet instant. Seul son hash SHA-256 réside dans Script Properties. `revokeSyncKey()` la révoque et `rotateSyncKey()` en crée une autre. Ne jamais copier la clé dans le dépôt, une URL, un export, un diagnostic, un test ou un journal.

L'API impose une liste blanche d'actions, n'utilise ni `eval`, ni chemin Drive client, ni `fileId` client. Les données, versions, tailles, checksums, UUID, dates et nombres sont validés avant écriture. Les identifiants Drive du manifest sont produits exclusivement par le serveur.

Codes structurés : `NETWORK_OFFLINE`, `AUTH_INVALID`, `ENDPOINT_INVALID`, `PROTOCOL_MISMATCH`, `SCHEMA_MISMATCH`, `PAYLOAD_TOO_LARGE`, `CHECKSUM_INVALID`, `SERVER_CONFLICT`, `DRIVE_UNAVAILABLE`, `QUOTA_EXCEEDED`, `APPS_SCRIPT_ERROR`, `LOCAL_STORAGE_ERROR`, `REMOTE_DATA_CORRUPTED`.


## Interface 7B

L'interface masque une clé enregistrée et exige l'action **Remplacer la clé** pour la modifier. Le diagnostic ne contient que `keyConfigured: true|false` et `endpointConfigured: true|false`; il exclut valeurs, URL, hash, tokens, réponses détaillées et traits. Supprimer la configuration locale ne touche jamais Drive.
