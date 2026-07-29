1. Mission du produit

Quiz TSI est une application de travail pour élève de prépa TSI, utilisée principalement sur iPad avec un Apple Pencil.

L’application doit permettre de :

recevoir une question ;
écrire directement sur un tableau blanc ;
consulter un indice ou une correction ;
s’autoévaluer ;
suivre sa progression ;
réviser selon plusieurs parcours ;
gérer une banque de questions ;
travailler en ligne ou hors connexion.

L’interface doit rester plus simple que le moteur pédagogique sous-jacent.

Le produit ne doit jamais exposer toutes ses données et toutes ses capacités en même temps.

2. Principe central

Après authentification, l’utilisateur arrive directement sur le tableau blanc.

Le tableau blanc est :

la page d’accueil ;
l’espace de résolution ;
le point de départ des séances ;
le point central de la navigation.

La première impression attendue est :

Je peux commencer à travailler immédiatement.

La première impression ne doit pas être :

Je dois comprendre un tableau de bord avant de commencer.

3. Principes UX non négociables
3.1 Une page, une tâche principale

Chaque page doit avoir une responsabilité claire.

Page	Tâche principale
Tableau blanc	Répondre à une question
Mon parcours	Comprendre sa progression
Banque de questions	Rechercher et gérer des questions
Réglages	Configurer l’application
Compte	Gérer son identité et sa session
Connexion	S’authentifier
3.2 Divulgation progressive

Les informations secondaires sont fermées par défaut.

Exemple fermé :

Suites géométriques                         2/4

Exemple après ouverture :

Dernier test : 50 %
1 réussite partielle
Difficulté conseillée : Fondamental
Prochaine révision : demain

Cette règle s’applique à :

la progression ;
les chapitres ;
les notions ;
les points faibles ;
les réglages ;
la synchronisation ;
les détails du compte.
3.3 Aucun dashboard chargé

Ne pas afficher simultanément :

de nombreuses cartes ;
plusieurs graphiques ;
toutes les statistiques ;
des alertes permanentes ;
des indicateurs techniques ;
des informations de synchronisation détaillées ;
des boutons administratifs.
3.4 Aucun contrôle décoratif

Tout élément interactif visible doit être fonctionnel.

Il est interdit d’ajouter :

un bouton non relié à une action ;
un filtre factice ;
un élément invisible uniquement pour satisfaire un ancien script ;
une statistique simulée ;
un faux état de synchronisation.
4. Architecture finale des pages
4.1 Routes principales
quiz.html       Tableau blanc et séance active
plan.html       Mon parcours
questions.html  Banque de questions
settings.html   Réglages de l’application
account.html    Compte
login.html      Connexion
4.2 Routes héritées
index.html
session.html
stats.html
team.html

Plan de migration :

index.html doit finir par rediriger vers quiz.html après authentification ;
session.html doit disparaître de la navigation principale, car les parcours sont sélectionnés dans le menu du tableau ;
stats.html doit être absorbé par plan.html ;
team.html doit devenir une section administrative accessible depuis Réglages pour les rôles autorisés.

Ne pas supprimer une route héritée avant d’avoir ajouté une redirection compatible.

5. Navigation globale
5.1 Tableau blanc

Sur quiz.html, la navigation est cachée dans un tiroir superposé ouvert par le bouton à trois traits.

Aucune barre latérale permanente ne doit être visible.

5.2 Pages détaillées

Sur les pages détaillées, utiliser une navigation latérale sobre.

En paysage et sur grand écran :

barre latérale fixe ;
largeur comprise entre 232 et 264 px ;
fond légèrement différent du contenu ;
quatre destinations principales ;
compte en bas.

En portrait ou sur petit écran :

navigation masquée ;
bouton menu ;
tiroir superposé ;
aucune réduction du contenu principal.
5.3 Destinations principales

Ordre obligatoire :

Tableau blanc
Mon parcours
Banque de questions
Réglages

La carte du compte se trouve en bas de la navigation.

Les pages Statistiques, Tests, Synchronisation ou Administration ne doivent pas être des destinations principales séparées.

6. Tableau blanc
6.1 Éléments visibles par défaut

Lorsque le menu est fermé :

bouton menu en haut à gauche ;
question centrée en haut ;
tableau blanc plein écran ;
outils Pencil indispensables ;
Annuler et Rétablir ;
Indice ;
Voir la correction ;
Passer ou Suivante selon l’état ;
progression très compacte ;
chronomètre uniquement pour Réflexe.
6.2 Question

La carte doit être centrée horizontalement par rapport à l’écran entier.

Paysage :

top: calc(env(safe-area-inset-top, 0px) + 16px);
left: 50%;
transform: translateX(-50%);
width: min(720px, calc(100vw - 180px));

Portrait :

top: calc(env(safe-area-inset-top, 0px) + 64px);
left: 16px;
right: 16px;
width: auto;
transform: none;

L’ouverture du tiroir ne doit jamais modifier :

top ;
left ;
right ;
width ;
transform.
6.3 Métadonnées visibles

Afficher uniquement :

notion ou chapitre ;
type de question ;
numéro de question ;
énoncé ;
chronomètre si Réflexe.

Masquer par défaut :

maîtrise ;
confiance ;
prochaine révision ;
source technique ;
identifiant interne ;
version ;
difficulté si elle n’est pas utile à la compréhension immédiate.
6.4 Correction

Avant correction :

Indice
Voir la correction
Passer

Après correction :

Réussi
Raté
Question suivante

La réussite partielle est calculée automatiquement :

indice utilisé puis Réussi ;
temps Réflexe dépassé puis Réussi ;
indice utilisé et temps dépassé puis Réussi.

Ne jamais réintroduire un bouton « Presque réussi ».

7. Menu latéral du tableau blanc

Ordre obligatoire :

Type de parcours
Options dynamiques
Réglages du Pencil
Navigation
Compte
7.1 Type de parcours

Choix exacts :

Révision du jour
Consolidation des points faibles
Révision libre
Test de chapitres
7.2 Révision libre

Ordre exact :

Partie
Chapitre
Notion
Type de question
Difficulté

Types :

Formules
Cours
Calcul
Réflexe

Difficultés :

Fondamental
Standard
Piège

En Réflexe :

masquer Difficulté ;
afficher Difficulté automatique · 60 secondes ;
ne pas stocker Réflexe comme difficulté.
7.3 Révision du jour

Afficher réellement le plan :

Suites géométriques                         2/4
Dérivation d’un produit                     1/3
Équations différentielles                   0/2

Les détails repliés contiennent :

raison de la révision ;
chapitre ;
dernier test ;
réussites partielles ;
échecs ;
difficulté recommandée.
7.4 Consolidation

Afficher réellement :

1  Dérivée d’un quotient               Fondamental
2  Variations d’une suite              Standard

Les détails repliés contiennent :

maîtrise estimée ;
raison de la priorité ;
dernière activité ;
réussites ;
réussites partielles ;
échecs.
7.5 Test de chapitres

Afficher :

Chapitre
20 questions / 40 questions
Commencer le test

Le chapitre et le format sélectionnés doivent être réellement transmis au moteur.

8. Changement de parcours et de filtres
8.1 Tableau vide

Quand le tableau ne contient aucun trait et qu’aucun indice ou correction n’a été consulté :

appliquer immédiatement la nouvelle configuration ;
charger automatiquement la nouvelle question ;
ne pas demander de confirmation ;
ne pas attendre « Question suivante ».
8.2 Travail commencé

Quand le tableau contient des traits ou que la question a été commencée :

Changer de question effacera le travail en cours.

Changer maintenant
Annuler

Changer maintenant :

ouvre un dialogue interne ;
efface le brouillon après confirmation ;
charge immédiatement la nouvelle question.

Annuler :

conserve la question ;
conserve le brouillon ;
restaure visuellement les filtres actifs.

Ne pas créer un troisième état ambigu où une configuration invisible reste en attente sans indication claire.

9. Pencil

Réglages rapides :

épaisseur du trait ;
quadrillage ;
formes parfaites ;
griffonnage pour effacer ;
droitier ou gaucher ;
effacer le tableau.

Contraintes :

section fermée par défaut ;
application immédiate ;
persistance dans le workspace actif ;
isolation entre comptes ;
aucune modification de la géométrie du dessin lors de l’ouverture du menu.
10. Mon parcours

Première vue :

résumé de progression ;
travail du jour ;
progression par grandes parties ;
calendrier ;
points faibles prioritaires ;
activité récente.

Ne pas afficher toutes les notions en même temps.

Les détails sont accessibles par clic.

La page peut utiliser :

anneaux de progression ;
barres ;
calendrier ;
listes hiérarchiques.

Maximum recommandé sur la première vue :

un indicateur principal ;
trois indicateurs secondaires ;
un calendrier ;
une liste prioritaire.
11. Banque de questions

Fonctions :

recherche ;
filtres ;
liste ;
aperçu ;
création ;
modification ;
publication ;
archivage ;
banque commune ;
banque privée.

La page doit gérer :

chargement ;
absence de résultats ;
erreur réseau ;
mode hors connexion ;
brouillon local ;
conflit de synchronisation ;
droits selon le rôle.
12. Réglages

Sections :

Apparence
Apple Pencil
Données locales
Synchronisation
Sauvegardes
Hors connexion
Administration

Les sections sont repliables.

Export, import, configuration Supabase ou Drive et diagnostics ne doivent pas apparaître dans le menu du tableau blanc.

13. Compte

Afficher :

avatar ou initiale ;
nom ;
adresse électronique ;
rôle ;
état de connexion ;
état de synchronisation ;
déconnexion.

Le rôle doit être traduit :

user  → Élève
admin → Administrateur
owner → Propriétaire
14. Connexion

Page très simple :

logo ou nom Quiz TSI ;
phrase courte ;
e-mail ;
mot de passe ;
afficher le mot de passe ;
connexion ;
message d’erreur.

Aucun panneau marketing, graphique ou décoration excessive.

15. Design system
15.1 Palette
--qtsi-bg: #f7f7f5;
--qtsi-surface: #ffffff;
--qtsi-surface-muted: #f1f1ef;
--qtsi-surface-hover: #ececea;

--qtsi-text: #1d1d1f;
--qtsi-text-secondary: #6e6e73;
--qtsi-text-tertiary: #8e8e93;

--qtsi-border: rgba(60, 60, 67, 0.14);
--qtsi-border-strong: rgba(60, 60, 67, 0.24);

--qtsi-accent: #0a66d8;
--qtsi-accent-hover: #075bbf;
--qtsi-accent-soft: rgba(10, 102, 216, 0.10);

--qtsi-success: #248a3d;
--qtsi-danger: #c9342f;
--qtsi-warning: #9a6700;
15.2 Typographie
font-family:
  -apple-system,
  BlinkMacSystemFont,
  "SF Pro Text",
  "Segoe UI",
  sans-serif;

Échelle :

--qtsi-font-xs: 12px;
--qtsi-font-sm: 13px;
--qtsi-font-md: 15px;
--qtsi-font-lg: 17px;
--qtsi-font-xl: 22px;
--qtsi-font-2xl: 28px;
15.3 Espacements
--qtsi-space-1: 4px;
--qtsi-space-2: 8px;
--qtsi-space-3: 12px;
--qtsi-space-4: 16px;
--qtsi-space-5: 20px;
--qtsi-space-6: 24px;
--qtsi-space-8: 32px;
--qtsi-space-10: 40px;
--qtsi-space-12: 48px;
15.4 Rayons
--qtsi-radius-sm: 10px;
--qtsi-radius-md: 14px;
--qtsi-radius-lg: 18px;
--qtsi-radius-xl: 22px;
--qtsi-radius-round: 999px;
15.5 Ombres
--qtsi-shadow-floating:
  0 8px 30px rgba(0, 0, 0, 0.08),
  0 1px 3px rgba(0, 0, 0, 0.05);

--qtsi-shadow-subtle:
  0 2px 10px rgba(0, 0, 0, 0.05);
15.6 Animation
--qtsi-motion-fast: 160ms;
--qtsi-motion-normal: 220ms;
--qtsi-easing: cubic-bezier(0.2, 0, 0, 1);

Respecter prefers-reduced-motion.

16. Composants communs

Préfixer les classes par qtsi-.

Composants attendus :

qtsi-shell
qtsi-sidebar
qtsi-mobile-drawer
qtsi-page
qtsi-page-header
qtsi-section
qtsi-surface
qtsi-button
qtsi-icon-button
qtsi-field
qtsi-select
qtsi-checkbox
qtsi-radio
qtsi-segmented
qtsi-disclosure
qtsi-dialog
qtsi-toast
qtsi-empty-state
qtsi-status
qtsi-account-card

Ne pas créer de composant spécifique à une page dans le design system commun.

17. Accessibilité

Obligatoire :

cibles tactiles minimum 44 × 44 px ;
navigation clavier ;
focus visible ;
contraste AA ;
labels explicites ;
aria-expanded pour les éléments repliables ;
aria-current dans la navigation ;
aria-live pour les messages ;
retour du focus après fermeture d’un dialogue ;
fermeture par Échap ;
aucune interaction uniquement disponible au survol.
18. iPad et Apple Pencil

Obligatoire :

aucune sélection de texte pendant l’écriture ;
touch-action correctement configuré ;
ouverture du menu au doigt ;
écriture Pencil indépendante du menu ;
aucune animation continue ;
aucune modification du canvas lors de l’ouverture d’une interface ;
prise en compte des safe areas ;
portrait et paysage ;
contrôle droitier/gaucher.
19. Persistance

Toutes les préférences utilisateur doivent utiliser activeWorkspace().

Il est interdit d’utiliser une clé localStorage globale pour :

les filtres ;
les préférences Pencil ;
le brouillon ;
le parcours actif ;
les réglages d’interface liés au compte.

Les caches techniques pouvant être partagés doivent être explicitement justifiés.

20. PWA

Obligatoire :

aucune ressource distante requise au démarrage ;
polices système uniquement ;
KaTeX local ;
nouveaux modules précachés ;
version de cache incrémentée ;
navigation fonctionnelle hors connexion vers les pages déjà visitées ou précachées ;
aucune interception des requêtes Supabase par le service worker.
21. Architecture JavaScript

Principes :

modules ES ;
responsabilités séparées ;
aucune fonction géante ;
pas de code minifié ;
pas de HTML massif construit dans une seule chaîne ;
pas de dépendance circulaire ;
pas d’effet de bord lors d’un simple import ;
contrôleurs initialisés explicitement.
22. Interdictions générales

Il est interdit de :

utiliser alert(), confirm() ou prompt() ;
créer des contrôles cachés pour satisfaire un ancien script ;
supprimer une fonction existante sans remplacement ;
inventer une nouvelle fonctionnalité produit ;
ajouter une dépendance lourde sans justification ;
ajouter des dégradés décoratifs ;
multiplier les couleurs ;
créer une interface de type dashboard générique ;
considérer une page terminée sans test responsive ;
fusionner automatiquement une PR.
23. Découpage des PR
PR 1  Design system et coque commune
PR 2  Tableau blanc et menu de séance
PR 3  Mon parcours
PR 4  Banque de questions
PR 5  Réglages et compte
PR 6  Connexion, migrations de routes et finition globale

La PR #40 actuelle est exploratoire.

Elle ne doit pas être fusionnée.

Les fonctions utiles pourront être portées manuellement dans la PR 2, après validation de la PR 1.
