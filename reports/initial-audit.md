# Audit initial — PR 3

- Le sélecteur proposait déjà quatre nombres et l’adaptatif utilisait les seuils de maîtrise 30, 55 et 78, mais les générateurs recopiaient le niveau sans politique vérifiable.
- Les 16 générateurs historiques couvraient directement environ 15 des 35 notions : puissances (2), factorisation (3), fractions (1), second degré (1), suites (2), dérivation (3), primitives (2), trigonométrie (1), équations différentielles (1).
- Les autres sélections pouvaient aboutir à sept questions fixes ou à un fallback générique non signalé comme lacune.
- Tous les générateurs ordinaires pouvaient être affichés au niveau 4. Aucune métadonnée de misconception ni aucun oracle n’était exigé.
- Six intentions de pièges existaient dans les questions fixes : carré d’une somme, domaine perdu, signe du quotient de suites, dérivée nulle et extremum, valeur absolue logarithmique, solutions trigonométriques périodiques.
- `QuizEngine.generate` masquait silencieusement toute exception de générateur.
- `package.json` contenait des marqueurs de conflit déjà commités, ce qui rendait le test initial impossible (`EJSONPARSE`). Après réparation minimale, les 49 tests préexistants passaient.
- La récupération réseau de `origin/main` a échoué avec un tunnel HTTP 403; la branche a été créée depuis le dernier état local disponible, descendant direct du dernier merge local de `main`.
