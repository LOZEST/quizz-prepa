# Quiz TSI au stylet — V0.1

Première base GitHub-ready du projet défini dans la conversation.

## Fonctionnel dans cette version
- Interface iPad fixe et installable comme PWA.
- Tableau Apple Pencil avec gomme, annulation et quadrillage.
- Sélection partie / chapitre / notion / niveau.
- Questions conceptuelles validées.
- Générateurs contraints : puissances, factorisation, fractions, second degré, suites, dérivées, primitives, trigonométrie et équations différentielles.
- Correction avant autoévaluation.
- Formules rendues par KaTeX 0.16.22, embarqué localement avec ses polices pour rester disponible hors connexion.
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

## Contenu mathématique
Les énoncés, indices et corrections acceptent des segments `{type: "text", value: "…"}` et `{type: "math", value: "…", display: true|false}`. Une correction peut fournir `{steps: [{segments: [...]}]}`. Les anciennes chaînes contenant des `<span class="math">…</span>` restent prises en charge temporairement, sans autoriser d’autre HTML. Si KaTeX refuse une formule, sa source est affichée et le quiz continue.

### Vérifications manuelles iPad restant à effectuer
- Formule courte, formule très longue, fraction imbriquée, exposants négatifs et valeur absolue.
- Correction multi-lignes, formule dans un indice, trigonométrie et équation différentielle.
- Portrait, paysage, bulle réduite puis agrandie, et taille de texte augmentée.
- Installation sur l’écran d’accueil puis mode avion après une première ouverture.
- Formule invalide et écriture Apple Pencil pendant l’ouverture d’une correction KaTeX.

## Limites actuelles
- La page ne lit pas automatiquement l’écriture manuscrite.
- La synchronisation Drive est préparée mais pas encore branchée à l’interface.
- Le contenu extrait du PDF doit être validé manuellement avant publication.
- Le contenu historique est converti par une couche de compatibilité ; sa migration vers des segments LaTeX natifs reste progressive.

## Prochaine étape recommandée
Tester cette V0.1 sur l’iPad, puis corriger l’ergonomie avant d’ajouter la synchronisation Drive et d’élargir les générateurs.
