# Vérifications manuelles — PR 1 interface iPad

Ces contrôles nécessitent un iPad réel et un Apple Pencil. Ils restent à effectuer avant fusion.

## Écriture et conservation du dessin

- Écrire lentement puis rapidement au Pencil et vérifier la prise en compte visible de la pression.
- Vérifier que le doigt ne dessine pas et qu’aucun défilement ne se produit pendant l’écriture.
- Tester la gomme flottante, puis annuler et rétablir plusieurs traits.
- Tracer près des quatre bords, ouvrir et fermer le tiroir, puis réduire et agrandir la question : le dessin doit rester identique.
- Effectuer plusieurs rotations portrait/paysage avec un dessin présent : aucun trait ne doit être étiré, effacé ou déformé.
- Vérifier le quadrillage et « Tout effacer ».

## Ergonomie et accessibilité

- Contrôler que le tiroir se superpose au tableau dans les deux orientations sans modifier sa largeur.
- Tester les préférences droitier et gaucher, puis relancer la PWA pour confirmer leur persistance.
- Vérifier que le bouton stylo/gomme reste accessible en un geste sans masquer la zone de travail principale.
- Parcourir tous les contrôles au doigt et avec VoiceOver ; confirmer leurs libellés et une cible tactile d’au moins 44 × 44 px.
- Réduire la bulle de question, vérifier son résumé, puis la rouvrir et confirmer que l’énoncé complet est intact.

## Parcours pédagogique et hors connexion

- Afficher un indice, puis une correction et s’autoévaluer : le résultat doit rester « difficile » après indice.
- Afficher directement une correction et s’autoévaluer : la consultation de la correction ne doit pas compter comme un échec.
- Vérifier séparément l’évolution de la progression de séance et de la maîtrise de la notion.
- Installer la PWA en ligne, la fermer, activer le mode avion, puis la relancer et réaliser un parcours complet hors connexion.

## Gestes vectoriels

- Activer « Maintenir pour tracer une forme parfaite », puis tracer et maintenir une ligne horizontale, verticale et oblique ; après environ 500 ms, vérifier l'aimantation et régler l'angle avant de relever le Pencil.
- Tracer un cercle assez grand, presque fermé et régulier, puis maintenir le Pencil posé environ 500 ms : vérifier l’aperçu du cercle parfait avant de relever le stylet, puis Annuler/Rétablir et tourner l’iPad.
- Vérifier qu’une lettre, une boucle ouverte et un petit gribouillage restent manuscrits, et qu’un cercle aimanté ne déclenche pas l’effacement par griffonnage.
- Comparer un maintien trop court et un maintien suffisamment long.
- Écrire `1`, un signe moins, une petite barre de fraction, `x` et une racine carrée : ces petits symboles ne doivent pas devenir des droites.
- Griffonner rapidement sur un symbole puis sur une ligne entière : seuls les traits réellement recouverts doivent disparaître et une seule action Annuler doit tout restaurer.
- Griffonner dans le vide et sur une courbe de graphique : en cas d'ambiguïté, rien ne doit être supprimé et le geste doit rester écrit.
- Poser la paume pendant une écriture lente puis rapide ; vérifier le rejet du doigt, la pression et l'absence de défilement.
- Tester portrait vers paysage, paysage vers portrait, dix rotations successives et un redimensionnement Safari : proportions, positions relatives, épaisseurs, droites et historique doivent rester stables.
- Fermer puis rouvrir la PWA et confirmer la reconstruction vectorielle du dessin et la persistance des deux préférences.

## Choix de performance

- Les traits sont stockés sous forme de points simplifiés (écart minimal de 0,7 unité), et non comme quarante PNG Retina.
- Pendant l'écriture libre, seul le nouveau segment est rendu. La scène complète est reconstruite uniquement lors d'une rotation, d'un redimensionnement, d'une aimantation, d'une suppression ou d'une action d'historique.
- Les opérations d'historique contiennent uniquement les traits ajoutés ou supprimés ; un griffonnage constitue une opération atomique.

## PR 3 — niveaux et pièges (à effectuer sur iPad réel)

Ces contrôles matériels n’ont pas été exécutés dans l’environnement terminal :

- Sélectionner successivement les quatre niveaux et comparer 1/2 puis 2/3.
- Vérifier qu’un niveau 4 contient une erreur réellement tentante sans la révéler avant la correction.
- Ouvrir la correction et contrôler les quatre titres : « Erreur classique », « Pourquoi c’est tentant », « Pourquoi c’est faux », « Réflexe à retenir ».
- Générer plusieurs variantes d’un même modèle et vérifier nombres, formulation et ordre lorsque pertinent.
- Contrôler fractions verticales, exposants, indices, trigonométrie et corrections longues.
- Changer de chapitre, puis demander un niveau 4 indisponible et vérifier l’état explicite sans question hors sujet.
- Tester portrait, paysage, texte agrandi et VoiceOver.
- Installer puis relancer hors connexion et accomplir un parcours de piège complet.
- Vérifier que le tableau, la pression, la gomme, le griffonnage, la ligne maintenue, Annuler et Rétablir restent inchangés.

## Bibliothèque de formes mathématiques

- En portrait puis en paysage, insérer chacune des neuf formes depuis **Formes** et vérifier qu’elle apparaît au centre sans masquer toute la zone d’écriture.
- Vérifier la lisibilité des quatre angles du cercle trigonométrique, les axes orientés et l’origine O.
- Vérifier l’unité identique et les graduations régulières du repère orthonormé, puis écrire une courbe au Pencil par-dessus.
- Pour une forme : Annuler, Rétablir, toucher son contour avec la gomme, Tout effacer, recharger la PWA et refaire une rotation.
- Dans un test, insérer une forme sur deux questions, naviguer entre elles, rendre puis quitter : chaque brouillon doit rester isolé et le tableau normal doit être restauré.
- Exporter puis importer la sauvegarde et confirmer que traits et formes restent vectoriels et présents hors connexion.

## Placement de formes au Pencil

1. Ouvrir le menu compact avec le bouton `○`, vérifier les neuf aperçus et les tailles Petite, Moyenne et Grande en orientations portrait et paysage.
2. Choisir une forme : le statut VoiceOver doit annoncer « Placer : … ». Avant le contact du Pencil, Undo ne doit pas changer.
3. Poser le Pencil, le déplacer sans varier la taille malgré la pression, puis le relever : l’aperçu pointillé doit suivre la pointe, devenir une forme nette et l’outil Stylo doit revenir automatiquement.
4. Vérifier qu’un doigt ne pose ni ne déplace la forme et que le tableau ne fait pas défiler la page. Aucun Apple Pencil Hover ne doit être activé pour cette recette.
5. Annuler avant le contact avec le bouton Formes, l’option d’annulation, Échap, puis Stylo/Gomme ; vérifier qu’aucun dessin ni historique n’est modifié.
6. En test de chapitre, placer une forme dans deux brouillons, changer de question et revenir. Après remise, vérifier le mode lecture seule, puis quitter et confirmer que le tableau normal est intact.
