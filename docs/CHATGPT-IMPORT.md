# Import de cours avec un compte ChatGPT

## Objectif du MVP

L’utilisateur envoie une photo ou un PDF à un GPT personnalisé. Le GPT lit le document, prépare un aperçu, demande confirmation, puis enregistre les éléments comme **brouillons privés** dans la banque de questions du compte Quiz TSI connecté.

La première version ne stocke pas la photo dans Quiz TSI et ne crée pas de document de cours autonome. Elle transforme le cours en fiches de cours, formules et questions révisables. La photo reste dans la conversation ChatGPT.

## Architecture

```text
Photo/PDF dans ChatGPT
  → instructions fixes + taxonomie Quiz TSI
  → aperçu et confirmation explicite
  → OAuth 2.1 Supabase
  → Edge Function chatgpt-import
  → RLS Supabase
  → questions privées en brouillon
```

L’Edge Function n’utilise aucune clé `service_role`. Elle vérifie le jeton OAuth, exige le `client_id` enregistré pour le GPT, force `scope = private`, `status = draft` et `author_id = utilisateur connecté`, puis écrit avec les politiques RLS existantes.

## 1. Déployer le code

```bash
supabase functions deploy chatgpt-import
supabase secrets set APP_BASE_URL=https://lozest.github.io/quizz-prepa/
```

Ne définir `CHATGPT_OAUTH_CLIENT_ID` qu’après la création du client OAuth à l’étape 4.

La migration `20260728170000_session_question_model.sql` doit déjà être appliquée, car l’import utilise les types `course`, `formula`, `calculation` et `reflex`.

## 2. Activer le serveur OAuth Supabase

Dans Supabase :

1. ouvrir **Authentication → OAuth Server** ;
2. activer OAuth 2.1 ;
3. configurer la page de consentement ;
4. vérifier que l’URL finale affichée est exactement :
   `https://lozest.github.io/quizz-prepa/oauth-consent.html`.

GitHub Pages utilise un sous-chemin. Ne poursuivre que lorsque l’URL complète générée par Supabase conserve bien `/quizz-prepa/`.

Utiliser de préférence une clé de signature JWT asymétrique, comme recommandé pour OAuth/OIDC.

## 3. Créer le GPT personnalisé

Dans l’éditeur de GPT :

1. créer « Import Quiz TSI » ;
2. coller le contenu de `docs/CHATGPT-GPT-INSTRUCTIONS.md` dans les instructions ;
3. ajouter `docs/chatgpt-taxonomy.json` dans les connaissances ;
4. activer l’analyse d’images et de fichiers ;
5. créer une Action et importer `docs/chatgpt-action-openapi.yaml` ;
6. choisir l’authentification OAuth.

L’éditeur ChatGPT affiche alors une URL de callback OAuth. La copier exactement.

## 4. Enregistrer ChatGPT comme client OAuth

Dans Supabase : **Authentication → OAuth Apps → Add client**.

- Nom : `ChatGPT — Import Quiz TSI`
- Type : `Confidential`
- Redirect URI : URL de callback fournie par l’éditeur GPT, sans modification
- Méthode du token endpoint : `client_secret_basic`

Conserver le Client ID et le Client Secret. Puis configurer l’Action GPT :

- Client ID : valeur Supabase
- Client Secret : valeur Supabase
- Authorization URL : `https://ntmuioktawzlxuuccrgi.supabase.co/auth/v1/oauth/authorize`
- Token URL : `https://ntmuioktawzlxuuccrgi.supabase.co/auth/v1/oauth/token`
- Scope : `email`
- Token exchange : Basic
- Privacy Policy : `https://lozest.github.io/quizz-prepa/privacy-chatgpt-import.html`

Enfin, limiter l’Edge Function à ce client :

```bash
supabase secrets set CHATGPT_OAUTH_CLIENT_ID=LE_CLIENT_ID_COPIE
supabase functions deploy chatgpt-import
```

## 5. Test de recette

1. ouvrir le GPT avec un compte ChatGPT distinct ;
2. envoyer une photo nette d’une page de cours ;
3. vérifier que le GPT montre l’aperçu sans appeler l’Action ;
4. refuser une première fois et vérifier qu’aucune question n’est créée ;
5. recommencer, confirmer et connecter le compte Quiz TSI ;
6. vérifier la page de consentement et accepter ;
7. ouvrir le `review_url` retourné ;
8. vérifier que les éléments sont privés, en brouillon et attribués au bon compte ;
9. rejouer le même appel avec le même `import_id` et vérifier l’absence de doublons ;
10. tester un autre compte et vérifier l’isolation complète.

## Limites volontaires du MVP

- 30 brouillons maximum par appel ;
- 256 Kio maximum ;
- pas de questions paramétrées ;
- aucune publication automatique ;
- aucune photo transférée à Quiz TSI ;
- classement selon la taxonomie actuellement présente dans le site ;
- validation humaine obligatoire pour les formules et passages incertains.
