# Questions paramétrées

Les modèles acceptent `{{a}}`, `{{a+b}}`, `{{gcd(a,b)}}` et `{{abs(a)}}`. Un tokenizer et un AST en liste blanche évaluent expressions et contraintes; aucune chaîne n'est exécutée comme JavaScript.

Chaque variable sépare son domaine mathématique (`N`, `R*`, intervalle français, ensemble fini, union, intersection ou différence) de son échantillonnage fini (`integer`, `rational`, `decimal`, `finite-set`). Toute valeur tirée est contrôlée par l'AST du domaine. Les rationnels sont réduits sous forme `{numerator, denominator}` et rendus en `\\frac`. Les contraintes sont bornées à 200 tentatives et une impossibilité produit une erreur éditoriale. Une publication demande au moins cinq variantes distinctes; l'aperçu en demande dix. La signature ordonnée des valeurs rend chaque variante reproductible avec un RNG injecté.
