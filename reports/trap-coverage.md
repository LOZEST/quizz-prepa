# Couverture générée de la banque de pièges

> Généré par `npm run traps:coverage`. Un fallback générique ne compte jamais comme couverture.

- Modèles activés : **25**
- Modèles désactivés : **0**
- Concepts de piège distincts (identifiants de modèles) : **25**
- Catégories de taxonomie distinctes : **22**
- Niveaux disponibles globalement : **1, 2, 3, 4**

| Partie | Chapitre | Notion | Templates | Concepts | Taxonomies | Types | Générateur spécifique | Fallback encore possible |
|---|---|---|---:|---:|---|---|---|---|
| A | Puissances | Produit et quotient de puissances | 2 | 2 | false-distributivity, exponent-rule-confusion | true-false, find-error | oui | non |
| A | Puissances | Puissance d’une puissance | 1 | 1 | exponent-rule-confusion | compare-reasoning | oui | non |
| A | Puissances | Exposants négatifs et conditions | 0 | 0 | — | — | oui | non |
| A | Puissances | Expressions à plusieurs variables | 0 | 0 | — | — | non | oui |
| B | Factorisation | Facteur commun | 0 | 0 | — | — | oui | non |
| B | Factorisation | Identités remarquables | 0 | 0 | — | — | oui | non |
| B | Factorisation | Trinômes et racines évidentes | 0 | 0 | — | — | oui | non |
| B | Fractions rationnelles | Ensemble de définition | 1 | 1 | missing-domain-condition | compare-reasoning | non | non |
| B | Fractions rationnelles | Factoriser puis simplifier | 2 | 2 | wrong-reciprocal, illegal-cancellation | true-false, find-error | oui | non |
| B | Fractions rationnelles | Signe d’un quotient | 0 | 0 | — | — | non | oui |
| B | Équations et inéquations | Résolution du second degré | 4 | 4 | product-zero-condition, lost-solution, parameter-degenerate-case, extraneous-solution | true-false, find-error, compare-reasoning | oui | non |
| B | Équations et inéquations | Signe d’un trinôme | 0 | 0 | — | — | non | oui |
| B | Équations et inéquations | Inéquations et systèmes | 0 | 0 | — | — | non | oui |
| C | Suites | Reconnaître une suite | 0 | 0 | — | — | non | oui |
| C | Suites | Sens de variation | 2 | 2 | ratio-sign-condition, monotonicity-confusion | compare-reasoning, true-false | non | non |
| C | Suites | Suites arithmétiques | 0 | 0 | — | — | oui | non |
| C | Suites | Suites géométriques | 0 | 0 | — | — | oui | non |
| C | Suites | Sommes et nombre de termes | 1 | 1 | index-shift | find-error | non | oui |
| D | Domaines de définition | Quotients | 0 | 0 | — | — | non | oui |
| D | Domaines de définition | Logarithmes | 0 | 0 | — | — | non | oui |
| D | Domaines de définition | Fonctions composées | 0 | 0 | — | — | non | oui |
| D | Dérivation | Formules de base | 0 | 0 | — | — | oui | non |
| D | Dérivation | Produit et quotient | 1 | 1 | quotient-derivative-error | compare-reasoning | non | oui |
| D | Dérivation | Composition | 1 | 1 | missing-inner-derivative | find-error | oui | non |
| D | Dérivation | Tangentes et approximation | 0 | 0 | — | — | oui | non |
| D | Dérivation | Variations et extrema | 1 | 1 | derivative-zero-extremum | true-false | non | non |
| D | Primitives | Primitives usuelles | 1 | 1 | primitive-product-error | find-error | oui | non |
| D | Primitives | Reconnaissance u′uⁿ | 1 | 1 | missing-inner-derivative | true-false | oui | non |
| D | Primitives | Reconnaissance u′/u | 1 | 1 | missing-absolute-value | compare-reasoning | non | non |
| D | Primitives | Condition initiale | 0 | 0 | — | — | non | oui |
| D | Limites et variations | Polynômes et terme dominant | 0 | 0 | — | — | non | oui |
| D | Limites et variations | Quotients et formes indéterminées | 0 | 0 | — | — | non | non |
| D | Limites et variations | Logarithme et exponentielle | 0 | 0 | — | — | non | oui |
| D | Limites et variations | Tableaux de variations complets | 0 | 0 | — | — | non | oui |
| D | Équations différentielles | Équation y′ = ay + b | 2 | 2 | missing-particular-solution, parameter-degenerate-case | find-error, true-false | oui | non |
| D | Équations différentielles | Condition initiale | 1 | 1 | missing-integration-constant | compare-reasoning | non | oui |
| D | Équations différentielles | Équations avec dérivée seconde simple | 0 | 0 | — | — | non | oui |
| E | Trigonométrie | Cercle trigonométrique | 0 | 0 | — | — | non | oui |
| E | Trigonométrie | Valeurs remarquables | 0 | 0 | — | — | non | oui |
| E | Trigonométrie | Symétries et périodicité | 1 | 1 | sign-error | compare-reasoning | oui | non |
| E | Trigonométrie | Équations trigonométriques | 2 | 2 | periodic-solutions, divide-by-expression | find-error, true-false | non | non |
| E | Trigonométrie | Courbes sinus et cosinus | 0 | 0 | — | — | non | oui |

## Lacunes restantes

- Notions sans modèle de piège validé : **25**.
- Le niveau 4 retourne un état explicite pour ces notions ; aucun fallback générique n’est utilisé.
- Les niveaux 1 à 3 conservent la banque historique ; les notions indiquées « fallback encore possible » n’ont ni générateur spécifique ni question fixe.

## Modèles désactivés

Aucun modèle désactivé.
