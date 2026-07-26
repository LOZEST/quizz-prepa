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
- Google Apps Script héberge ou sert d’API au quiz.
- `progression.json` contient l’état consolidé.
- Google Sheets reçoit un journal lisible des tentatives.
- Synchronisation locale d’abord, Drive ensuite, avec file d’attente hors connexion.

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
