# Protocole de synchronisation local-first

## Portée et versions

Le protocole courant est `protocolVersion: 1`, avec `schemaVersion: 3`. Une incompatibilité est refusée explicitement. Les événements pédagogiques demeurent la source de vérité de la maîtrise ; les agrégats reconstructibles ne sont pas synchronisés.

Sont préparés : événements de maîtrise et d'autoévaluation, historique utile, blueprints et sessions de tests, résultats finalisés/versionnés, brouillons divergents et préférences. Le code, KaTeX, les banques, le service worker, les ressources statiques et caches dérivés sont exclus.

## Opération

```json
{
  "operationId": "UUID",
  "protocolVersion": 1,
  "schemaVersion": 3,
  "deviceId": "UUID anonyme",
  "createdAt": "2026-01-01T12:00:00.000Z",
  "operationType": "append-event",
  "entityType": "mastery-event",
  "entityId": "UUID ou identifiant stable",
  "baseServerRevision": 0,
  "payload": {},
  "checksum": "SHA-256 hexadécimal"
}
```

Types autorisés : `append-event`, `upsert-entity`, `delete-entity`, `supersede-event`, `upload-test-draft`, `finalize-test-result`, `update-preference`. Le checksum porte sur la sérialisation canonique sans le champ `checksum`. Une opération dépasse au maximum 256 000 octets. UUID, dates, références, taille, schéma, checksum et finitude des nombres sont validés.

## Outbox et transport

Toute écriture à synchroniser est d'abord ajoutée à l'outbox IndexedDB `quiz-tsi-sync/outbox`. Une panne conserve le payload, incrémente `attemptCount`, mémorise une erreur expurgée et programme un backoff exponentiel borné. Seules les opérations confirmées peuvent être purgées.

Le client envoie un `POST HTTPS`, `Content-Type: text/plain;charset=utf-8`, avec un corps JSON. La clé est dans le corps, jamais dans l'URL. Aucun lancement automatique n'est connecté à l'interface dans cette PR.

Actions : `health`, `initialize`, `push`, `pull`, `sync`, `getManifest`, `createBackup`, `listBackups`, `getBackup`, `deleteBackup`. Les quatre dernières constituent l'extension 7B, sans modifier le format central des opérations. Une réponse de synchronisation contient `acceptedOperationIds`, `rejectedOperations`, `newServerRevision`, `remoteChanges`, `conflicts`, `protocolVersion`, `serverTime`.

## Fusion

- événements : union append-only par UUID ; contenu différent sous le même UUID devient un conflit ; `supersedesEventId` reste porté par l'événement ;
- préférences : `updatedAt` le plus récent, puis `deviceId` lexical pour départager ;
- tests finalisés : entités versionnées ou supersédées, sans modification silencieuse ;
- brouillons : deux contenus divergents sont conservés comme variantes et signalés en conflit ;
- états dérivés : reconstruits depuis événements/snapshot validés.

`serverRevision` est un entier monotone incrémenté sous `LockService`, jamais un timestamp.
