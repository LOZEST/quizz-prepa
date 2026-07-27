# Quiz TSI au stylet — V0.1

Première base GitHub-ready du projet défini dans la conversation.

## Fonctionnel dans cette version
- Interface iPad fixe et installable comme PWA.
- Tableau Apple Pencil avec gomme, annulation, quadrillage, reconnaissance ligne/cercle et bibliothèque de neuf formes mathématiques vectorielles (dont cercle trigonométrique et repère orthonormé).
- Sélection partie / chapitre / notion / niveau.
- Questions conceptuelles validées.
- Générateurs contraints : puissances, factorisation, fractions, second degré, suites, dérivées, primitives, trigonométrie et équations différentielles.
- Correction avant autoévaluation.
- Formules rendues par KaTeX 0.16.22, embarqué localement avec ses polices pour rester disponible hors connexion.
- Réussi sans indice = facile ; réussi avec indice = difficile.
- Répétition espacée initiale.
- Sauvegarde locale et export/import JSON.
- Synchronisation Drive facultative : configuration et test de connexion, déclenchement manuel/automatique regroupé, état, conflits, diagnostics expurgés et sauvegardes complètes ou légères.
- Mode d'évaluation séparé avec blueprints déterministes notés sur 20 ou 40, brouillon vectoriel par question, chrono résistant au rechargement et correction manuelle guidée.

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
npm run tests:coverage-report
```

## Synchronisation Drive

La PWA reste intégralement utilisable hors connexion et Google reste facultatif. Le menu propose configuration, test, synchronisation, conflits, sauvegardes et diagnostic. Commencer par [`docs/google-drive-sync.md`](docs/google-drive-sync.md), puis consulter le [protocole](docs/sync-protocol.md), le [déploiement](docs/apps-script-deployment.md), les [conflits](docs/sync-conflicts.md), les [sauvegardes](docs/sync-backups.md), la [reprise](docs/sync-recovery.md) et la [sécurité](docs/sync-security.md).

## Contenu mathématique
La carte commence désormais par **Bases indispensables** : calcul algébrique, identités remarquables, fractions, puissances/racines et équations/inéquations élémentaires. Chaque notion de la carte dispose d'au moins trois questions de cours et trois applications distinctes ; une lacune est signalée explicitement et n'est jamais remplacée par une question générique. La structure, les règles de rédaction, la provenance et la validation sont détaillées dans [`docs/COURSE-QUESTION-BANK.md`](docs/COURSE-QUESTION-BANK.md).

Les énoncés, indices et corrections acceptent des segments `{type: "text", value: "…"}` et `{type: "math", value: "…", display: true|false}`. Une correction peut fournir `{steps: [{segments: [...]}]}`. Les anciennes chaînes contenant des `<span class="math">…</span>` restent prises en charge temporairement, sans autoriser d’autre HTML. Si KaTeX refuse une formule, sa source est affichée et le quiz continue.

### Vérifications manuelles iPad restant à effectuer
- Formule courte, formule très longue, fraction imbriquée, exposants négatifs et valeur absolue.
- Correction multi-lignes, formule dans un indice, trigonométrie et équation différentielle.
- Portrait, paysage, bulle réduite puis agrandie, et taille de texte augmentée.
- Installation sur l’écran d’accueil puis mode avion après une première ouverture.
- Formule invalide et écriture Apple Pencil pendant l’ouverture d’une correction KaTeX.

## Limites actuelles
- La page ne lit pas automatiquement l’écriture manuscrite.
- Le déploiement Apps Script et la recette multi-appareils/iPad restent à valider réellement ; la PR doit rester en brouillon jusque-là.
- Le contenu extrait du PDF doit être validé manuellement avant publication.
- Le contenu historique est converti par une couche de compatibilité ; sa migration vers des segments LaTeX natifs reste progressive.
- Le mode test ne reconnaît et ne note jamais l'écriture manuscrite ; les points sont saisis par l'élève ou une autre personne après remise.

## Tests de chapitre

Choisir **Test de chapitre** ouvre une préparation distincte. Le test fige questions, nombres, ordre, corrections et barèmes dans un blueprint signé. Les sessions et brouillons volumineux sont conservés dans IndexedDB, tandis que les préférences existantes restent dans `localStorage`. La documentation technique, les règles d'éligibilité et les limites se trouvent dans `docs/CHAPTER-TESTS.md`; la recette matérielle dans `docs/CHAPTER-TESTS-IPAD-CHECKLIST.md`.

## Prochaine étape recommandée
Tester cette V0.1 sur l’iPad, puis corriger l’ergonomie avant d’ajouter la synchronisation Drive et d’élargir les générateurs.

## Niveaux pédagogiques et banque de pièges

Les niveaux sont désormais validés : **Fondamental** (application immédiate), **Standard** (procédure de cours en plusieurs étapes), **Réflexe prépa** (méthode à reconnaître) et **Piège** (misconception tentante identifiée). Le niveau 4 est exclusivement alimenté par le registre validé de 25 modèles génératifs; une notion sans modèle renvoie une lacune explicite, jamais une question générique.

Chaque piège possède une taxonomie, un oracle exact, une graine reproductible, une signature de variante et une correction qui n’affiche l’analyse de l’erreur qu’après la demande de correction. La banque reste entièrement locale et utilise les segments KaTeX existants.

```bash
npm test
npm run traps:coverage
```

Le rapport réel se trouve dans `reports/trap-coverage.md`. La procédure d’ajout et de validation est détaillée dans `docs/ADDING-A-TRAP.md`.

## Maîtrise adaptative et révisions

La progression de séance est désormais séparée de la **maîtrise estimée**, de la confiance et de l’échéance. Chaque autoévaluation après correction crée un événement local stable ; consulter la correction ou passer une question ne crée aucune preuve. Les réussites assistées sont normalisées en « difficile ». Le tableau de bord compact indique aussi les révisions dues, notions fragiles, solides actuellement et nouvelles.

Le modèle transparent, sa migration, l’intégration prudente des tests finalisés, l’import/export et les limites sont documentés dans [`docs/ADAPTIVE-MASTERY.md`](docs/ADAPTIVE-MASTERY.md). La couverture réelle se régénère avec `npm run mastery:coverage`.

## Formes mathématiques du tableau Apple Pencil

Le menu **Réglages du tableau → Formes** insère au centre de la zone visible un cercle, un cercle trigonométrique, un repère orthonormé, des axes, une droite, une flèche, un rectangle, un carré ou un triangle. Chaque forme est un objet vectoriel léger : une insertion s’annule et se rétablit en une action, la gomme la supprime comme un objet complet, et les traits manuscrits restent indépendants.

Les formes suivent la scène lors d’une rotation ou d’un redimensionnement. Elles sont incluses dans la sauvegarde locale, `capture()`/`restore()`, les brouillons de test et les exports JSON. Les scènes historiques de version 1 sont migrées en mémoire sans modifier ni perdre leurs traits. L’insertion se fait au toucher ; une fois le menu fermé, l’écriture sur le tableau reste réservée au stylet.
