# Restauration et reprise

Avant import : télécharger un seul fichier choisi, vérifier checksum, schéma, taille et identifiants, afficher le résumé et produire une sauvegarde locale de sécurité. La fusion sans suppression est sélectionnée par défaut. Le remplacement local exige une seconde confirmation. Annuler ne modifie rien. Après import, reconstruire maîtrise/révisions/caches puis alimenter l'outbox; rapporter ajoutés, ignorés et rejetés. Les UUID rendent une reprise idempotente.

Ne pas confondre suppression de configuration, effacement local, remise à zéro statistique, tombstone distant et suppression d'une sauvegarde Drive.
