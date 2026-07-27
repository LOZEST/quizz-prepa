# Synchronisation Supabase de la progression

Les événements `masteryEvents` sont l'unique source de vérité. `masteryStates` et `reviewQueue` ne sont jamais envoyés : après chaque page distante validée et fusionnée, ils sont recalculés localement. La file `progress-sync` appartient au `UserWorkspace` (UUID Supabase), persiste dans `localStorage`, déduplique les identifiants et ne retire un événement qu'après confirmation du serveur.

## Déploiement

Dans le tableau de bord Supabase, ouvrir **SQL Editor**, copier puis exécuter dans l'ordre `supabase/migrations/20260727210000_progress_events.sql`. Ne jamais placer une clé `service_role` dans la PWA. La migration limite `authenticated` à `SELECT` et `INSERT` de ses propres lignes; aucun droit `UPDATE` ou `DELETE` n'est accordé.

## Recette RLS

Avec deux utilisateurs A et B, vérifier dans deux sessions authentifiées : A peut insérer une ligne dont `user_id=auth.uid()` et la relire; A ne voit pas les lignes de B et ne peut insérer pour B. `UPDATE` et `DELETE` échouent. Une session `anon` ne peut ni lire ni écrire. Un profil applicatif `admin` ou `owner` n'obtient aucun accès supplémentaire : les politiques ne consultent pas son rôle.

## Recette multi-appareils

1. Connecter le même compte dans deux navigateurs.
2. Couper Internet sur A, répondre à une question sur A, puis à une autre sur B.
3. Rétablir Internet sur A; utiliser **Synchroniser la progression** sur A puis B, puis de nouveau A.
4. Vérifier que les deux événements sont présents une seule fois sur les deux appareils et que maîtrise et révisions calculées sont identiques.

Le curseur est le `server_seq` croissant du serveur, jamais une date client. Une ligne incohérente est conservée en quarantaine locale; le curseur n'avance qu'après la sauvegarde locale de la page. Le Cache API ne contient aucune réponse Supabase privée.
