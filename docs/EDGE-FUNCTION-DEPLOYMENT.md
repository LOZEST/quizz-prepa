# Déployer `team-admin`

Le dépôt contient le code et la migration, mais **aucun déploiement n’est automatique**. Utiliser Supabase CLI depuis un poste de confiance :

```bash
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
supabase secrets set APP_BASE_URL=https://lozest.github.io/quizz-prepa/
supabase functions deploy team-admin
```

1. Installer Supabase CLI puis se connecter avec `supabase login` (ne jamais copier ce token dans GitHub).
2. Lier le bon projet avec sa référence publique.
3. Appliquer `20260728090000_team_administration.sql` avec `supabase db push`.
4. Définir `APP_BASE_URL`. Les secrets Supabase système sont fournis par la plateforme à la fonction, jamais au navigateur.
5. Déployer `team-admin`. La passerelle vérifie le JWT et la fonction appelle également `auth.getUser` avant de relire `profiles.role`.
6. Dans **Authentication → URL Configuration**, garder la Site URL `https://lozest.github.io/quizz-prepa/` et ajouter exactement `https://lozest.github.io/quizz-prepa/accept-invite.html` aux Redirect URLs.
7. Vérifier avec un owner, puis vérifier qu’un admin reçoit `FORBIDDEN`.
8. Configurer un fournisseur e-mail fonctionnel : sans livraison e-mail, l’invitation ne peut pas aboutir.

Les origines locales se règlent, si nécessaire, via `DEV_ALLOWED_ORIGINS`. `INVITE_RATE_LIMIT` et `INVITE_RATE_WINDOW_MINUTES` règlent la limite (5 invitations sur 10 minutes par défaut). Ne placer ni clé serveur, ni token CLI, ni secret de déploiement dans le dépôt ou dans GitHub Pages.
