# Refonte du système de séances

## Modèle pédagogique

L’application expose désormais quatre séances seulement :

1. **Révision du jour** : plan construit à partir des erreurs du dernier test de chapitre, avec repli sur les révisions arrivées à échéance lorsqu’aucun test exploitable n’existe.
2. **Consolidation des points faibles** : notions classées par maîtrise croissante, avec priorité et difficulté de travail recommandée.
3. **Révision libre** : choix explicite de la partie, du chapitre, de la notion, du type de question et de la difficulté.
4. **Test de chapitres** : test binaire de 20 ou 40 questions conservé.

Le type de séance, le type de question et la difficulté sont trois axes indépendants.

## Types de questions

- **Formules** : compléter une formule, expliquer son rôle, ses hypothèses ou une règle subtile.
- **Cours** : répondre à une définition, une propriété ou une conclusion attendue clairement formulée.
- **Calcul** : effectuer une application fondamentale, standard ou comportant un piège.
- **Réflexe** : calcul court et immédiatement compréhensible, avec 60 secondes par question.

Le sous-type technique `parameterized` reste conservé pour les calculs générant plusieurs variantes. Il est présenté à l’élève comme un calcul.

## Difficultés

Les seules difficultés choisissables sont :

- `1` — Fondamental ;
- `2` — Standard ;
- `4` — Piège.

L’ancien niveau `3 — Réflexe prépa` n’est plus une difficulté. Les anciennes questions de niveau 3 sont converties en mémoire vers le type Réflexe lorsque cela est possible.

## Résultats d’une question

Après ouverture de la correction, l’interface ne propose que :

- **Réussi** ;
- **Raté**.

Le moteur enregistre trois états :

| Action | Indice utilisé | Temps Réflexe dépassé | Résultat enregistré |
|---|---:|---:|---|
| Réussi | non | non | `success` |
| Réussi | oui | non ou oui | `partial` |
| Réussi | non | oui | `partial` |
| Raté | non ou oui | non ou oui | `failed` |

Le clic sur **Indice** est définitif pour la question courante. Une réussite après indice ne peut donc jamais redevenir une réussite complète.

## Menu de séance

Le panneau de gauche est séparé du menu technique. Il affiche :

- le type de séance ;
- la progression totale ;
- les notions prévues ;
- le score de réussites complètes par notion (`réussites / questions prévues`) ;
- le nombre de réussites partielles ;
- pour les points faibles, l’ordre de priorité et la difficulté recommandée.

Le panneau peut être replié afin de libérer de l’espace pour le tableau Apple Pencil.

## Mode Réflexe

Le chronomètre démarre lorsque la question est affichée. À 60 secondes :

- le chronomètre indique le dépassement ;
- le tableau reste actif ;
- la question et la correction ne s’ouvrent pas automatiquement ;
- l’élève peut terminer sans limite forcée ;
- une réussite est enregistrée comme partielle.

## Migration Supabase

Appliquer la migration :

```text
supabase/migrations/20260728170000_session_question_model.sql
```

Elle ajoute les types `calculation` et `reflex`, autorise une difficulté nulle pour Réflexe et retire le niveau 3 des difficultés persistées. Les calculs paramétrés historiques restent compatibles.

## Recette manuelle indispensable

Sur iPad et Apple Pencil :

1. préparer chaque type de séance ;
2. vérifier le panneau de gauche en portrait et en paysage ;
3. traiter plusieurs questions d’une même notion et vérifier le score ;
4. utiliser un indice puis cliquer sur Réussi et vérifier « Partiellement réussi » ;
5. laisser expirer une question Réflexe, continuer à écrire et vérifier que le tableau ne se bloque pas ;
6. terminer une question Réflexe avant 60 secondes ;
7. vérifier le fonctionnement hors connexion après une première ouverture ;
8. appliquer la migration Supabase avant de publier une nouvelle question Réflexe.
