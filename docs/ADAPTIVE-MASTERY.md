# Maîtrise estimée et répétition adaptative

## Modèle et événements

Le schéma 2 conserve des événements immuables (`review-evaluation`, `test-question-graded`, finalisation, migration, réinitialisation et supersession). L'identifiant, les deux dates, l'appareil anonyme et `supersedesEventId` préparent une future synchronisation sans l'implémenter. Les doublons sont éliminés par identifiant et seules les dernières preuves actives sont agrégées. Une correction consultée, une question passée ou une séance abandonnée ne produit aucune preuve.

`masteryScore` (0–100) est une estimation pondérée des résultats disponibles, jamais une certitude. `confidenceScore` (0–100) mesure quantité et diversité : signatures, types, niveaux et jours. Les répétitions identiques ont un rendement géométriquement décroissant. `levelMastery` conserve `null` pour un niveau non évalué. `difficultyScore` est borné entre 1 et 10. `stabilityDays` est une durée bornée entre 0,08 et 180 jours.

## Poids, oubli et intervalles

Les constantes sont centralisées dans `mastery-policy.js`. Une révision pèse 1 ; un test finalisé 1,15, modulé par le mode (`self` 1, `teacher` 1,2, `other` 1,1), les points (racine carrée plafonnée) et le niveau. Le niveau 4 est plafonné à 0,78 dans la maîtrise générale. L'ancienneté suit une demi-vie de 90 jours. Une preuve individuelle ne dépasse jamais 1,8.

Les stabilités initiales sont 4 jours (`easy`), 1,5 (`hard`), 1 (`fragile`) et 0,25 (`failed`). Ensuite elles sont multipliées respectivement par 2,2, 1,35, 0,75 et 0,35. Un échec réduit donc l'intervalle sans effacer l'historique. La rétention affichée est calculée à la demande par décroissance exponentielle à partir du score historique, de la stabilité et de la dernière activité ; aucune écriture périodique n'est nécessaire.

## Priorité et séances

La priorité bornée à 100 combine retard, score estimé, confiance, rechutes, dernier échec, importance fondamentale, diversité et contexte demandé. Elle produit `urgent`, `due`, `soon`, `consolidation`, `new` ou `not-priority`, avec une raison traduisible. Les modes Révisions du jour, Consolidation, Nouvelles notions, Réflexes prépa, Mix intelligent et Révision libre filtrent réellement des candidats différents. Le constructeur déterministe conserve graine, filtres, ordre et raisons ; une lacune rend `no-compatible-question`, jamais un fallback hors sujet.

## Tests notés

Seul un test remis, corrigé et finalisé crée des événements question par question. Le ratio exact, les points, le niveau, la notion, le type et le rôle du correcteur sont conservés. La note globale n'est jamais répartie. Une correction rouverte ne compte pas ; après nouvelle finalisation, chaque nouvelle preuve supersède l'ancienne.

## Migration, stockage et import/export

Au premier chargement, les résumés v1 sont sauvegardés avant conversion. Chaque notion avec un score fini produit une seule preuve `legacy-summary`, marquée `estimated`, de poids et confiance limités ; aucun détail de tentative n'est inventé. L'identifiant déterministe rend la migration idempotente. Une erreur de lecture est visible et n'écrase pas les données.

Les événements et le cache dérivé restent dans le stockage local léger existant ; les copies et brouillons de tests restent dans IndexedDB. Le cache peut être reconstruit depuis les événements. L'export v2 contient appareil, événements, états, file et préférences. L'import est borné à 5 Mo, valide versions, dates, références et nombres, déduplique, applique les supersessions puis produit un rapport. Aucun HTML ou code importé n'est exécuté.

## Ajouter une preuve

1. Ajouter le type au validateur et définir ses champs vérifiables.
2. Centraliser son poids, sans poids absolu.
3. Définir sa conversion en résultat borné et son comportement de supersession.
4. Ajouter des tests de validation, idempotence, diversité, ancienneté et reconstruction.
5. Ne jamais inférer le contenu de l'écriture manuscrite.

## Limites connues

L'interface principale expose les indicateurs et le résumé du tableau de bord ; les vues plein écran de fiche notion, historique filtrable et réinitialisation en lot restent à compléter avant de considérer la PR exhaustive. Les sessions adaptatives sont disponibles dans la couche métier mais l'écran ordinaire sélectionne encore une notion à la fois. Les 16 notions sans question planifiable sont signalées dans le rapport. Les essais iPad réels restent manuels.
