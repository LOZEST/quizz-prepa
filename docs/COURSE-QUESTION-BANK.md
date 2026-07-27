# Banque de cours et d'exercices

## Périmètre et provenance

La banque suit la carte TSI du projet et lui ajoute les prérequis de calcul nécessaires à une entrée en CPGE. Le périmètre TSI doit rester aligné sur le programme officiel de mathématiques publié au Bulletin officiel ; les pages du [Bulletin officiel](https://www.education.gouv.fr/bo) et d'[Éduscol](https://eduscol.education.fr/) sont les seules sources externes admises pour décider si une notion appartient au programme.

Les deux documents de travail annoncés pour cette évolution sont `fiches_revision_maths_TSTI2D.docx` et `Travail_été_TSI1_2026.pdf`. Ils servent de liste de contrôle pédagogique lorsqu'ils sont disponibles dans l'espace de travail, mais aucune extraction automatique n'est publiée. Les formulations de `scripts/course-question-bank.js` sont originales et ont été structurées pour une validation humaine : résultat, conditions, application contrôlée et erreur classique. Aucun texte des documents ou du programme n'est recopié.

## Contrat d'une fiche

Chaque notion possède une fiche contenant :

- un résultat ou une propriété précise ;
- ses conditions de validité importantes ;
- une application courte avec résultat contrôlé ;
- une erreur classique pertinente.

La fiche produit trois questions de cours sémantiquement distinctes (rappel, vrai/faux justifié, conditions) et trois applications (calcul direct, diagnostic d'erreur, reconnaissance inverse). Les niveaux 1 et 2 sont toujours présents. L'indice oriente vers la structure ou l'hypothèse sans livrer le résultat de l'application. La correction donne la propriété et le raisonnement, et une formulation orale propre est fournie.

## Couverture et lacunes

`npm run tests:coverage-report` reconstruit la banque de test et le rapport `reports/test-bank-coverage.md`. Un contenu absent n'est jamais remplacé : le moteur retourne `missing-coverage` avec la raison `no-validated-question`. Les fallbacks ne font donc partie ni de la banque, ni des statistiques.

Le rapport distingue cours, exercices et pièges. Les pièges de niveau 4 restent soumis au registre et à son oracle spécialisé ; l'absence d'un piège n'est pas maquillée. La composabilité sur 40 exige douze modèles distincts dans le périmètre. À la date de ce rapport, tous les chapitres passent cette exigence ; aucune lacune ne bloque donc encore le /40. Une notion seule ne fournit volontairement que six modèles éditoriaux et peut rester non composable isolément sur 20 ou 40 : il faut alors sélectionner le chapitre, sans dupliquer artificiellement des questions.

## Ajouter ou modifier du contenu

1. Ajouter la notion dans `COURSE_MAP` sans changer son identifiant ensuite.
2. Ajouter une fiche mathématique relue dans `COURSE_FACTS`.
3. Contrôler exactement les domaines, signes, valeurs interdites et constantes.
4. Ajouter un générateur uniquement pour des variantes construites à partir d'un résultat contrôlé, avec 200 générations testées.
5. Exécuter `npm run verify` et relire le rapport généré.

Les contenus utilisent les segments mathématiques normalisés et KaTeX. Aucun HTML arbitraire n'est accepté. Toute extraction future d'un cours doit passer par une interface de validation humaine avant d'alimenter cette banque.
