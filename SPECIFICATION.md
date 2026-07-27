# Spécification fonctionnelle — Quiz TSI au stylet

## 1. Objectif
Créer une application web progressive pour iPad qui transforme le cours et la feuille de révision TSI en entraînement actif : questions de cours, exercices générés, correction, autoévaluation et répétition espacée.

## 2. Principes non négociables
- Interface fixe sur iPad, sans défilement pendant l’écriture.
- Grand tableau `canvas` compatible Apple Pencil, avec pression, gomme, annuler, rétablir et quadrillage.
- La correction est une étape normale avant l’autoévaluation.
- **Réussi sans indice** = réussite facile.
- **Réussi après indice** = réussite difficile.
- Presque réussi et raté restent des résultats distincts.
- Les calculs générés doivent être construits à rebours depuis des résultats contrôlés, et non par coefficients arbitraires.
- Mélange de questions conceptuelles validées et d’exercices génératifs.
- Sauvegarde locale immédiate ; synchronisation Google Drive ajoutée par Apps Script.

## 3. Parcours d’une question
1. Sélection d’un mode, d’une partie, d’un chapitre, d’une notion et d’un niveau.
2. Génération d’une question validée.
3. Réponse manuscrite au stylet.
4. Indice facultatif, qui positionne `hintUsed=true`.
5. Affichage normal de la correction.
6. Autoévaluation : Réussi / Presque réussi / Raté.
7. Déduction automatique : facile ou difficile selon l’usage de l’indice.
8. Mise à jour de la maîtrise et de la date de révision.
9. Sauvegarde.

## 4. Organisation du cours
Matière → Partie → Chapitre → Notion → Type de question → Niveau.

Les parties suivent la feuille :
- A : Puissances.
- B : Polynômes et fractions rationnelles.
- C : Suites.
- D : Fonctions, primitives, limites et équations différentielles.
- E : Trigonométrie.

## 5. Génération sûre
Chaque générateur doit :
- choisir d’abord une structure ou un résultat propre ;
- construire l’énoncé à partir de cette structure ;
- fournir une correction déterministe ;
- rejeter les cas dégénérés ;
- produire un identifiant et une empreinte anti-répétition ;
- respecter les plages de coefficients par niveau ;
- inclure les conditions d’existence lorsque nécessaire.

## 6. Niveaux
1. Fondamental : une règle, nombres simples, une étape.
2. Standard : signes, deux étapes, condition simple.
3. Réflexe prépa : choix de méthode, composition, justification.
4. Piège : condition cachée, contre-exemple, erreur à repérer.

## 7. Répétition espacée initiale
- Facile : +8 maîtrise, retour approximatif sous 3 jours.
- Difficile : +3, retour sous 1 jour.
- Presque : 0, retour sous 4 heures.
- Raté : −5, retour sous 10 minutes.
- Passé : −1, retour sous 1 heure.

Ces valeurs seront recalibrées après usage réel.

## 8. Sauvegarde
### Version actuelle
- `localStorage` sur l’iPad.
- Export et import JSON manuels.

### Cible Drive
- Google Apps Script sert une API versionnée protégée par une clé personnelle hashée côté serveur.
- Une outbox IndexedDB enregistre chaque opération avant toute tentative réseau et conserve les échecs avec backoff.
- Drive contient un manifest à révision monotone, les événements, entités, préférences et un snapshot contrôlés par SHA-256.
- Les événements pédagogiques append-only restent la source de vérité ; brouillons divergents et UUID réutilisés avec un contenu différent produisent des conflits explicites.
- Le code, KaTeX, les banques, ressources statiques et caches reconstructibles ne sont jamais synchronisés.
- L'infrastructure n'est pas encore déclenchée automatiquement par l'interface et le fonctionnement hors connexion ne dépend d'aucun endpoint.

Le protocole détaillé, la sécurité et le déploiement sont documentés dans `docs/sync-protocol.md`, `docs/sync-security.md` et `docs/apps-script-deployment.md`.

## 9. Extraction du cours
L’extraction automatique propose des objets structurés : propriété, conditions, pièges, prérequis et types de questions. Toute donnée mathématique extraite du PDF doit être validée avant d’alimenter les questions. L’OCR du document n’est pas suffisamment fiable pour publier automatiquement les formules.

## 10. Critères d’acceptation V0.1
- Installation PWA sur iPad.
- Écriture stable au Pencil en portrait et paysage.
- Sélection hiérarchique du cours.
- Au moins six familles de générateurs.
- Workflow correction puis autoévaluation.
- Sauvegarde locale, export et import.
- Tests automatiques de génération.

## 11. Format mathématique
Les contenus affichables séparent le texte des mathématiques dans une liste `segments`. Un segment `text` est toujours inséré comme texte DOM ; un segment `math` contient uniquement une source LaTeX KaTeX et peut activer `display`. Les corrections utilisent une liste `steps`, chaque étape contenant ses propres segments. Le moteur commun rend questions, indices, corrections, notion cachée et formulation attendue. Une chaîne historique est normalisée sans interpréter de HTML arbitraire. Toute erreur KaTeX produit un fallback textuel repérable par `data-math-fallback="true"` sans interrompre le parcours.

## 12. Validation des niveaux et pièges génératifs

La politique exécutable de `scripts/pedagogy/level-policy.js` distingue application immédiate, exercice standard, reconnaissance de méthode et misconception. Une question de niveau 4 est invalide sans taxonomie, erreur tentante, conditions, explication, réflexe et oracle. Le registre désactive les modèles invalides et retourne `missing-coverage` si la sélection exacte n’est pas couverte.

La correction d’un piège est révélée selon le workflow existant, puis expose des rubriques textuelles accessibles. Les variantes sont reproductibles par graine et identifiées par une signature portant sur formulation et paramètres mathématiques. Les identifiants récents de modèle, signature et taxonomie sont évités pendant la séance et journalisés localement sans prétendre diagnostiquer l’erreur manuscrite réelle.

## 13. Tests notés sur 20 et sur 40

Le mode d'évaluation est séparé du parcours de révision. Sa configuration choisit format, composition, niveau maximal, pièges, durée, ordre et graine. Le démarrage exige un blueprint versionné et valide dont les snapshots figent énoncé, correction, réponse attendue, métadonnées et barème. Le total est exactement 20 ou 40, en demi-points représentés par des unités entières.

Pendant l'épreuve, indice, correction, explication du piège, autoévaluation et filtres pédagogiques sont indisponibles. Chaque question possède une scène vectorielle propre. Une échéance absolue rend le chrono résistant aux suspensions et rechargements. Remise et abandon sont explicites; une remise fige définitivement la copie.

La correction est humaine et guidée, jamais issue d'une reconnaissance manuscrite. Elle accepte une saisie par critères ou directe, borne chaque note au barème, calcule pour /40 un équivalent exact /20 et produit des formulations prudentes par notion. Les sessions volumineuses résident dans IndexedDB; l'export/import JSON est versionné, borné et validé. Aucun résultat de test ne modifie encore l'algorithme de maîtrise.

## 14. Maîtrise adaptative (schéma 2)

La section 7 décrivait la politique initiale désormais remplacée. La source de vérité est l’historique d’événements pédagogiques idempotents. Une autoévaluation produit `easy`, `hard`, `fragile` ou `failed`; `easy` avec indice est normalisé en `hard`. Correction seule, passage, séance abandonnée et test non finalisé sont neutres. L’état dérivé distingue score estimé, confiance, stabilité, difficulté personnelle, maîtrise par niveau et prochaine révision. Aucun libellé ne certifie une maîtrise définitive.

Les résultats des tests sont pris question par question uniquement après finalisation. Une nouvelle correction supersède la preuve antérieure. Les agrégations excluent les notions sans données au lieu de leur attribuer zéro. Les algorithmes et limites sont spécifiés dans `docs/ADAPTIVE-MASTERY.md`.
