# Moteur de tests de chapitre

## Architecture et intégrité

`test-question-adapter.js` adapte les questions fixes, générateurs et pièges validés sans créer un second moteur mathématique. `test-builder.js` filtre le périmètre et le niveau, élimine les templates répétés, distribue exactement 20 ou 40 points, puis fige énoncé, correction, réponse attendue, métadonnées et barème dans un blueprint versionné. La graine alimente un PRNG local et la signature identifie la sélection ordonnée.

Le validateur refuse un total inexact, une source ou un snapshot absent, un ordre/identifiant dupliqué et un barème incohérent. Les points sont représentés en demi-unités entières pour éviter les erreurs flottantes.

## Session, brouillons et chrono

Une session conserve le blueprint, l'index courant, les états accessibles, un brouillon vectoriel par `instanceId`, les dates et l'échéance. Le chrono continue en arrière-plan : l'affichage recalcule la différence avec `deadlineAt`; un rechargement ne le remet donc pas à zéro. Le canvas existant fournit `capture()`/`restore()` et conserve Pointer Events, pression, gomme et historique. La sauvegarde s'effectue après navigation, statut, remise et notation; la fin de trait demeure sauvegardée par le tableau.

Les sessions/snapshots/brouillons utilisent IndexedDB `quiz-tsi-tests` version 1. La progression et les préférences légères restent dans leur `localStorage` historique : aucune migration destructive n'est faite. Les erreurs IndexedDB remontent dans l'interface.

## Remise et correction

Indices, correction, autoévaluation et filtres ordinaires sont masqués dans le runner. La remise confirmée fige le canvas. L'application ne lit jamais l'écriture : l'élève ou un correcteur compare le brouillon au corrigé et attribue des points manuellement, par demi-point. Un résultat sur 40 expose l'équivalent exact sur 20. La réouverture de correction conserve l'ancien total et ses dates.

## Export, import et hors connexion

`test-export.js` produit un JSON complet ou léger sans traits. L'import borne la taille, vérifie version, statut, blueprint, nombres et résultat; les segments sont ensuite rendus comme texte/KaTeX local et jamais comme HTML arbitraire. Tous les modules sont pré-cachés par le service worker `quiz-tsi-chapter-tests-v5`.

## Rendre une question éligible

1. Ajouter la question au registre existant avec `id`, version, partie, chapitre, notion, niveau et contenu structuré.
2. Fournir une correction complète, un type `course`, `exercise` ou `trap`, des points conseillés entiers/demi-entiers et un temps estimé.
3. Pour un piège, passer impérativement le validateur de pièges existant.
4. Donner un `templateId` stable et une signature de variante afin d'empêcher doublons et variantes sœurs.
5. Définir un barème dont la somme égale les points; tester 200 variantes pour une nouvelle famille générative.
6. Exécuter `npm test` et `npm run tests:coverage-report`.

Pour ajouter un format, compléter `TEST_FORMATS`, adapter la distribution entière des points et ajouter les cas de validation/composition correspondants.

## Limites connues

- Aucun diagnostic ni notation automatique du manuscrit.
- L'historique et l'import/export sont disponibles dans la couche de données; l'écran dédié expose le parcours principal mais pas encore toutes les actions avancées de gestion en lot.
- Une notion pauvre est refusée plutôt que complétée hors sujet; le rapport de couverture liste ces lacunes.
- Les essais matériels iPad et mode avion restent manuels.
