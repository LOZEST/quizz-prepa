# Ajouter un modèle de piège

1. **Choisir l’emplacement et l’identifiant.** Ajouter le scénario à `scripts/traps/templates/catalog.js` (ou à un sous-module du même registre si la famille grandit). Employer un identifiant stable `chapitre.concept`, une version entière et ne jamais recycler un identifiant pour une autre misconception.
2. **Choisir la taxonomie.** Réutiliser un identifiant de `data/trap-taxonomy.json`. N’ajouter une catégorie que si aucune entrée ne décrit la même erreur. Renseigner concept attendu, erreur tentante, conditions, raison tentante, raison fausse et réflexe.
3. **Référencer le cours.** Copier exactement `partId`, `chapterId` et `notionId` depuis `scripts/course-map.js`; le validateur refuse une notion inconnue.
4. **Construire les paramètres.** Partir d’un résultat contrôlé, accepter une graine, utiliser les entiers ou `fraction()` et rejeter explicitement zéro au dénominateur, coefficient dégénéré, solution perdue ou réponse ambiguë.
5. **Écrire l’oracle.** Produire une réponse exacte indépendante de l’affichage. `finalAnswer.value`, `oracle()` et la dernière conclusion de la correction doivent coïncider.
6. **Produire le contenu.** Séparer `{type:'text'}` et `{type:'math'}`; employer `\dfrac`, exposants, indices et blocs KaTeX locaux. L’énoncé ne révèle ni la taxonomie ni l’erreur.
7. **Écrire la correction.** Fournir la méthode, les étapes, la réponse, puis `trapExplanation` avec « Erreur classique », « Pourquoi c’est tentant », « Pourquoi c’est faux », condition et réflexe. Ajouter un contre-exemple lorsqu’il éclaire réellement.
8. **Valider et tester.** Faire passer le schéma, générer 200 variantes déterministes, vérifier oracle/correction, absence de valeurs non finies et au moins vingt signatures qui ne diffèrent pas seulement par une lettre.
9. **Tracer la provenance.** Ajouter toute source réellement consultée à `data/trap-sources.json`, avec URL, date, licence connue et confirmation de réécriture. Aucune extraction ne peut être publiée sans validation humaine.
10. **Contrôler la couverture.** Exécuter `npm test` puis `npm run traps:coverage` et relire `reports/trap-coverage.md`. Un fallback n’est jamais une couverture.
