# Rapport de stabilisation

- **Version du projet :** 0.1.0
- **Date :** 2026-07-27
- **Tests automatisés réussis :** 148
- **Commandes exécutées par cet audit :** `node --test tests/*.test.mjs`, `node tools/static-audit.mjs`

## Gravité

- **P0 restant :** 0 détecté automatiquement.
- **P1 restant :** 0 détecté automatiquement.
- **P2 restant :** recette ergonomique et matérielle iPad requise.
- **P3 restant :** couverture pédagogique incomplète, hors périmètre de cette stabilisation.

## Anomalies corrigées

- Le moteur, la feuille de style et les polices WOFF2 KaTeX sont précachés.
- L’échec de précache nomme désormais la ressource concernée.
- Le cache ignore explicitement les requêtes non GET et les origines distantes, dont Apps Script.
- Le chrono d’un test est arrêté à la fermeture et une erreur de sauvegarde explique comment préserver le brouillon.

## Vérifications réelles

- **Couverture PWA et ressources :** Audit statique réussi : 61 modules, 99 ressources PWA et 7 fichiers JSON validés.
- **Générateurs actifs validés :** 16 générateurs historiques × 200 générations et 25 pièges × 200 variantes dans la suite automatisée.
- **Pièges validés :** 25 ; notions sans piège : 25.
- **Tests sur 20 et 40 :** logique des deux formats réussie ; banque composable par chapitre sur 20 : 6/11 ; sur 40 : 0/11.
- **Maîtrise :** idempotence, bornes, neutralité correction/passage/abandon, répétition déterministe et migrations testées ; notions compatibles : 26.
- **Stockage :** IndexedDB de tests, exports/imports validés et migrations de maîtrise testés ; quotas réels Safari à recetter.
- **Synchronisation :** outbox, backoff, verrou, conflits, sauvegarde et restauration simulés uniquement ; aucun déploiement réel contacté.

## Anomalies restantes et tests matériels requis

- Apple Pencil (pression, gomme, droite, griffonnage), rotations, safe areas, clavier virtuel et reprise PWA sur iPad réel.
- Synchronisation iPad ↔ Mac, conflits et restaurations avec un déploiement Apps Script réel.
- Couverture de banque : les lacunes indiquées dans les rapports de pièges, tests et maîtrise ne sont pas inventées ni masquées.

## Décision

**Candidate à la recette.** Pas candidate à la publication avant validation Apple Pencil/iPad, synchronisation multi-appareils et restauration Drive réelles.
