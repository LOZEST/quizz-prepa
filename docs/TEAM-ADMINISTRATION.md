# Administration de l’équipe

La page **Équipe et accès** est exclusivement réservée au compte `owner`. Le rôle est relu en base par l’Edge Function pour chaque demande : masquer la page dans le navigateur n’est qu’une aide d’interface.

## Parcours courant

1. Ouvrir **Équipe et accès**.
2. Cliquer sur **Inviter une personne**.
3. Renseigner son e-mail et, facultativement, son nom.
4. Choisir **Utilisateur** (révisions et questions privées) ou **Administrateur** (gestion supplémentaire de la banque commune).
5. Envoyer l’invitation et attendre que la personne choisisse son mot de passe.
6. Modifier plus tard ses droits avec l’action proposée sur son compte.
7. Suspendre temporairement un compte sans supprimer sa progression ni ses questions ; le réactiver avec son compte existant.

Les invitations en attente, comptes actifs et suspendus apparaissent dans la liste. Recherche, filtres, pagination et historique ne sont jamais conservés hors connexion. Un administrateur de contenu ne peut pas gérer les comptes.

## Recette manuelle

Préparer un owner, un admin, un user et une nouvelle adresse e-mail.

1. Vérifier que user puis admin ne voient pas le lien Équipe, sont redirigés s’ils saisissent son URL et ne peuvent pas appeler la fonction.
2. Vérifier que owner voit la page, invite la nouvelle adresse comme user et que l’e-mail est reçu.
3. Ouvrir le lien, choisir un mot de passe, se connecter, puis vérifier que le compte révise normalement.
4. Depuis owner, passer le compte admin ; après reconnexion, vérifier qu’il publie une question commune mais ne gère pas les comptes.
5. Retirer ses droits ; vérifier qu’il ne publie plus pour tous et que ses questions existantes restent.
6. Suspendre le compte ; vérifier que sa connexion est refusée et que ses données restent présentes.
7. Réactiver le compte et vérifier sa connexion.
8. Vérifier qu’aucune action n’est proposée sur owner et que le serveur refuse toute tentative de suspension.
9. Inspecter GitHub et l’onglet Réseau : aucune clé serveur, aucun mot de passe ni token ne doit être exposé.
