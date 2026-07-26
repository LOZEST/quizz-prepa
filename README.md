# Quiz TSI au stylet — V0.1

Première base GitHub-ready du projet défini dans la conversation.

## Fonctionnel dans cette version
- Interface iPad fixe et installable comme PWA.
- Tableau Apple Pencil avec gomme, annulation et quadrillage.
- Sélection partie / chapitre / notion / niveau.
- Questions conceptuelles validées.
- Générateurs contraints : puissances, factorisation, fractions, second degré, suites, dérivées, primitives, trigonométrie et équations différentielles.
- Correction avant autoévaluation.
- Réussi sans indice = facile ; réussi avec indice = difficile.
- Répétition espacée initiale.
- Sauvegarde locale et export/import JSON.

## Installation sur GitHub Pages
1. Copier tous les fichiers à la racine du dépôt.
2. Commit et push.
3. Dans GitHub : **Settings → Pages → Deploy from a branch → main / root**.
4. Ouvrir l’URL dans Safari sur l’iPad.
5. **Partager → Sur l’écran d’accueil**.

## Tests
Avec Node.js 20 ou plus récent :

```bash
npm test
```

## Limites actuelles
- La page ne lit pas automatiquement l’écriture manuscrite.
- La synchronisation Drive est préparée mais pas encore branchée à l’interface.
- Le contenu extrait du PDF doit être validé manuellement avant publication.
- Certains formats mathématiques utilisent du HTML simple plutôt que KaTeX.

## Prochaine étape recommandée
Tester cette V0.1 sur l’iPad, puis corriger l’ergonomie avant d’ajouter la synchronisation Drive et d’élargir les générateurs.
