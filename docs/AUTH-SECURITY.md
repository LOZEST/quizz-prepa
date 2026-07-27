# Sécurité des comptes

Le rôle vient exclusivement de `public.profiles`. Le navigateur ne reçoit aucun droit `UPDATE`; les helpers `security definer` sont dans le schéma non exposé `private`, utilisent `auth.uid()` et fixent leur `search_path`. Les actions administratives distantes sont volontairement absentes de cette fondation et doivent être refusées hors connexion.

## Recette RLS (deux JWT utilisateurs)
- Avec A : `select * from profiles` retourne seulement A.
- Avec A : filtrer l’UUID de B ne retourne aucune ligne.
- Avec A : `update profiles set role='admin'` échoue faute de privilège.
- Sans JWT : aucune lecture n’est autorisée.
- Avec admin : la lecture de tous les profils réussit, mais toute écriture (dont `owner`) échoue.
- Avec owner : la lecture de tous les profils réussit, mais toute écriture directe échoue également.

Les diagnostics ne doivent contenir ni session, ni jeton, ni mot de passe. La clé publishable est publique par conception; toutes les autres familles de secrets sont interdites par l’audit statique.

## Confidentialité de la progression

Les événements sont rattachés exclusivement à `auth.uid()`. Les rôles applicatifs admin/owner ne contournent pas la RLS privée de `progress_events`. Le client n'enregistre ni session, ni jeton, ni en-tête Authorization dans l'outbox ou les diagnostics; les erreurs sont expurgées et bornées.

## Confidentialité des banques de questions

RLS interdit tout accès `anon`. Un utilisateur authentifié ne voit que les communes publiées et ses propres privées. Admin et owner voient tous les états communs sans obtenir de droit sur les privées d'autrui. `author_id`, `scope` et `created_at` sont immuables; `DELETE` n'est pas accordé. Le navigateur archive et utilise une version optimiste. Les textes distants sont rendus par création DOM/textContent et segments mathématiques validés, jamais comme HTML.
