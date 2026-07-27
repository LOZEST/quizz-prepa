# Banques de questions Supabase

La banque distante complète, sans remplacer, les questions statiques. Un compte lit les questions communes publiées et toutes ses questions privées. Les rôles `admin` et `owner` gèrent en plus tous les états de la banque commune, mais jamais les questions privées d’un autre auteur.

Le cache local est partitionné par UUID de compte. Les brouillons et opérations hors ligne sont enregistrés dans une outbox; une mise à jour porte la version attendue et une absence de ligne modifiée devient un conflit, sans écrasement forcé. Archiver remplace toute suppression depuis le navigateur.

## Recette manuelle à trois comptes

1. Avec owner, créer une commune en brouillon; vérifier que A ne la voit pas.
2. La publier; vérifier que A et B la voient.
3. Avec A, créer et publier une privée; vérifier sa présence dans son quiz et son absence chez B et owner.
4. Hors ligne, modifier un brouillon de A puis recharger; vérifier sa persistance.
5. Reconnecter A et synchroniser; passer à B et vérifier qu'aucune donnée de A n'apparaît.
6. Créer une paramétrée, générer dix variantes et vérifier domaines, contraintes et signatures distinctes.
7. Provoquer une modification concurrente; vérifier les versions locale/distante et les choix « conserver la version distante » ou « dupliquer ma version comme nouveau brouillon ».

## Interface multipage et synchronisation

La banque dédiée conserve le modèle local-first : toute mutation est d'abord écrite dans `QuestionCache`, accompagnée d'une opération idempotente `QuestionOutbox`, puis envoyée par `QuestionSync` avec la version attendue. Un conflit ne remplace jamais silencieusement la version distante. Les rôles masquent les actions nécessairement refusées, sans remplacer les politiques RLS.
