# Migration et espaces locaux

Chaque compte utilise `UserWorkspace`, qui valide l’UUID puis préfixe chaque zone par `quiz-tsi:<userId>:`. Les objets personnels destinés à IndexedDB portent aussi un `userId` contrôlable avec `assertRecord`. Progression, maîtrise, tests, brouillons, dessins, événements, réglages et future outbox doivent employer cette abstraction.

L’ancien `quiz-tsi-state-v1` reste intact comme espace « legacy local ». À la première connexion, la boîte de dialogue propose importer, refuser ou décider plus tard. L’import crée d’abord `legacy-backup`, conserve les identifiants d’événements, déduplique ceux-ci, fusionne la maîtrise sans duplication et inscrit un marqueur idempotent propre au compte. Un refus ne supprime rien. Lors d’un changement de compte, l’application est rechargée après annulation du cycle courant; l’état mémoire et le tableau du compte précédent ne peuvent donc pas apparaître dans le nouvel espace.
