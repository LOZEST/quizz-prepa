# Architecture multipage

Quiz TSI est une application statique sans routeur ni bundler. Les pages racine (`index.html`, `login.html`, `session.html`, `quiz.html`, `questions.html`, `stats.html`, `settings.html`, `team.html`) utilisent exclusivement des liens relatifs afin de fonctionner sous le sous-chemin GitHub Pages `/quizz-prepa/`.

## Socle commun

- `scripts/auth/protected-page.js` restaure la session, choisit le `UserWorkspace`, prend en charge le dernier compte hors connexion et contrôle les rôles avant d'afficher une page.
- `scripts/shell/` fournit la liste blanche de redirection, la navigation accessible, le shell et les notifications.
- `scripts/pages/page-bootstrap.js` charge uniquement le contrôleur de la page courante.
- `quiz.html` conserve le tableau Apple Pencil et son cycle correction/autoévaluation.

Le stockage existant n'est pas renommé. La configuration de séance est ajoutée dans l'aire `active-session` de l'espace utilisateur. Les caches, outboxes et données pédagogiques restent isolés par UUID.

## Hors connexion

Le service worker précache chaque page et ses modules statiques. Une navigation sert la page demandée depuis le cache. Les sessions Supabase, profils, tokens, questions privées, progression et configurations Drive ne sont jamais inscrits dans le Cache API.

## Pages sensibles

`team.html` utilise le shell commun mais exige `owner` avant son initialisation et appelle uniquement `team-admin`. Ses modules sont isolés dans `scripts/team/`. `accept-invite.html` est une page autonome : `scripts/auth/auth-callback.js` traite explicitement PKCE ou le fragment, nettoie l’URL puis `accept-invite-page.js` enregistre le mot de passe. Le service worker précache seulement ces fichiers statiques, jamais les réponses d’administration ni une URL de callback complète.
