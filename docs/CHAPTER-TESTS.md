# Moteur de tests de chapitre

## Format binaire

Les nouveaux blueprints, de version 2, contiennent exactement **20 questions sur 20** ou **40 questions sur 40**. Chaque question vaut exactement un point : **Réussie** vaut 1 et **Ratée** vaut 0. Aucun demi-point, champ numérique ou barème intermédiaire n'est proposé. Le format 40 affiche aussi l'équivalent sur 20 (`réussites / 2`).

Le constructeur filtre strictement le périmètre, le niveau maximal et l'activation des pièges. Il équilibre autant que possible catégories et notions, puis refuse une banque insuffisante. Une instance, une signature de variante ou un template ne peut apparaître deux fois ; aucun fallback générique n'est utilisé.

## Session, Apple Pencil et correction

Chaque question conserve sa scène vectorielle par `instanceId` dans IndexedDB. Le chrono repose sur une échéance absolue et résiste aux suspensions. La remise fige la copie, sans reconnaissance automatique de l'écriture. Pendant la correction, l'énoncé, le corrigé et le raisonnement restent visibles. Les deux gros boutons binaires peuvent être changés jusqu'à la finalisation ; la progression indique le nombre de questions corrigées et la finalisation reste désactivée tant qu'il en manque une.

Les brouillons, traits Apple Pencil, exports/imports JSON et la synchronisation Drive conservent leurs formats locaux existants et leur fonctionnement hors connexion.

## Compatibilité et maîtrise

Les blueprints historiques de version 1 et leurs notes partielles restent validés, importables et consultables avec leur ancien barème. Ils ne sont pas convertis silencieusement. Seuls les nouveaux blueprints sont binaires.

Après finalisation, chaque réponse crée un événement stable `test-question-graded`, associé à sa notion, sa source et son `instanceId`. Une réussite porte un ratio 1, un échec un ratio 0. Les IDs déterministes empêchent une nouvelle synchronisation de recréer les mêmes événements. Aucun événement global du test n'est utilisé comme preuve de maîtrise.

## Ajouter des questions

Une question éligible doit avoir une source validée, une notion, un niveau, un `templateId`, une signature de variante, un énoncé et une correction complets. Une nouvelle famille générative doit réussir 200 générations et les contrôles du dépôt. Exécuter `npm run verify` après toute évolution.
