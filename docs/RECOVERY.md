# Procédure de restauration

Cette procédure permet de revenir à une version stable sans supprimer l’historique Git.

## Point stable actuel

- Branche immuable : `backup/stable-2026-07-27-before-study-planner`
- Commit : `005a14b15786d5e559fb0f753e4125057c3203b9`
- Ce point contient l’administration d’équipe ainsi que les correctifs du shell et de la PWA, avant les améliorations pédagogiques et le plan de travail.
- Cette branche ne doit recevoir aucun nouveau commit fonctionnel.

## Règles de sécurité

1. Toute évolution importante part de `main` dans une branche dédiée.
2. Une PR ne contient qu’un ensemble cohérent de changements.
3. Les migrations Supabase, les Edge Functions et les changements d’authentification ne sont jamais fusionnés automatiquement.
4. Une PR fonctionnelle ne modifie ni ne supprime de données distantes sans plan de retour arrière documenté.
5. Le service worker change de version à chaque modification de ressources précachées.
6. Les sauvegardes locales et les espaces utilisateurs ne sont jamais renommés sans migration explicite.

## Annuler une PR fusionnée

La méthode normale est un **revert**. Elle ajoute un commit qui annule proprement la PR et conserve l’historique.

1. Ouvrir la PR fusionnée sur GitHub.
2. Cliquer sur **Revert**.
3. Créer la PR de retour arrière.
4. Vérifier les tests.
5. Fusionner la PR de retour arrière.
6. Incrémenter la version du cache PWA si des ressources publiques ont changé.

## Restauration d’urgence complète

À utiliser seulement si plusieurs PR ont rendu le site inutilisable.

1. Créer une branche depuis `backup/stable-2026-07-27-before-study-planner`.
2. Ouvrir une PR vers `main` qui restaure les fichiers de cette version.
3. Ne pas forcer ni réécrire l’historique de `main`.
4. Incrémenter la version du cache PWA afin que Safari et la PWA récupèrent réellement les fichiers restaurés.
5. Vérifier la connexion, une séance, le tableau Apple Pencil, la banque de questions, l’équipe et la navigation entre pages.

## Supabase

Un retour arrière Git ne modifie pas Supabase. Avant toute migration à risque :

- conserver le SQL exact appliqué ;
- créer une sauvegarde ou un export ;
- privilégier les colonnes et tables additives ;
- préparer un script inverse ;
- ne jamais supprimer de données sans accord explicite.

## Contrôle minimal avant fusion

- `npm ci`
- `npm run verify`
- test de navigation GitHub Pages sous `/quizz-prepa/`
- test Safari/iPad lorsque le tableau, la PWA ou le cache changent
- aucune clé secrète dans Git
- aucune régression d’isolation entre comptes
