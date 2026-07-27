# Parcours d’invitation

L’owner envoie l’e-mail via l’Edge Function. Le serveur impose `accept-invite.html` comme retour et crée uniquement un profil `user` ou `admin`. Aucun mot de passe temporaire n’est créé.

La page accepte les deux retours Supabase : échange explicite du `code` PKCE, ou installation explicite des `access_token` et `refresh_token` du fragment pour les anciens flux implicites. Les paramètres sont retirés immédiatement de l’URL, ne sont ni affichés, ni journalisés, ni stockés par l’application. La personne choisit ensuite un mot de passe d’au moins dix caractères ; `updateUser` l’enregistre dans Supabase avant la redirection.

## Configuration Supabase à faire manuellement

- **Authentication → URL Configuration → Site URL** : `https://lozest.github.io/quizz-prepa/`
- **Authentication → URL Configuration → Redirect URLs** : `https://lozest.github.io/quizz-prepa/accept-invite.html`
- **Authentication → Email Templates → Invite user** : personnalisation facultative, par exemple :

```text
Bienvenue dans Quiz TSI.
Pour choisir votre mot de passe et activer votre compte, ouvrez ce lien :
{{ .ConfirmationURL }}
```

Ne jamais construire dans le dépôt un lien contenant un token. Un lien expiré affiche une aide neutre invitant à contacter le propriétaire.
