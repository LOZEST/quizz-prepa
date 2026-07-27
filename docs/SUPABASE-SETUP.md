# Configuration Supabase

L’application statique utilise `@supabase/supabase-js` v2 et seulement l’URL du projet et la clé **publishable** dans `scripts/cloud/supabase-config.js`. Remplacer les valeurs de démonstration avant le déploiement. Ne jamais y placer une clé `sb_secret_`, `service_role`, un secret JWT ou un mot de passe.

## Checklist manuelle
1. Appliquer la migration de `supabase/migrations/` avec la CLI ou l’éditeur SQL.
2. Créer ou inviter le compte propriétaire depuis Supabase Auth (l’inscription publique de l’application est absente).
3. Attribuer `owner` uniquement depuis l’éditeur SQL sécurisé : `update public.profiles set role='owner' where id='<uuid vérifié>';`.
4. Créer un utilisateur normal et vérifier que son rôle initial est `user`.
5. Tester l’isolation des deux comptes et les recettes RLS de `AUTH-SECURITY.md`.
6. Tester la déconnexion et le changement de compte.
7. Installer la PWA sur iPad, se connecter une fois, passer en mode avion et vérifier le bandeau hors connexion.

Désactiver les inscriptions publiques dans les réglages Auth du projet. Les invitations et créations restent réservées au propriétaire via le tableau de bord.

## Progression personnelle

Appliquer ensuite `supabase/migrations/20260727210000_progress_events.sql` depuis **SQL Editor**. Cette migration append-only est détaillée dans [`SUPABASE-PROGRESS-SYNC.md`](SUPABASE-PROGRESS-SYNC.md). Elle ne requiert ni nouvelle dépendance npm ni clé autre que la publishable key déjà configurée.
