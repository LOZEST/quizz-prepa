# Feuille de route

## V0.1 — Socle fonctionnel
- [x] Interface iPad.
- [x] Tableau au stylet.
- [x] Arborescence du cours.
- [x] Générateurs initiaux.
- [x] Autoévaluation et répétition espacée.
- [x] Sauvegarde locale.

## V0.2 — Qualité pédagogique
- [x] Ajouter une politique validée des niveaux et des oracles pour la banque générative de pièges.
- [ ] Étendre les validations mathématiques spécifiques à tous les générateurs historiques.
- [x] Étendre les questions de cours et les applications à toutes les notions, sans fallback générique.
- [x] Ajouter des variantes génératives « repérer l’erreur », « condition manquante » et « contre-exemple » pour les chapitres centraux.
- [ ] Étendre les pièges aux 25 notions encore non couvertes.
- [ ] Ajouter un tableau de bord par chapitre.
- [x] Ajouter des tests de chapitre sur 20 et sur 40, avec chrono facultatif, brouillons isolés, remise et correction guidée.
- [x] Rendre tous les chapitres actuels composables sur 20 et sur 40 selon le rapport reproductible.
- [x] Ajouter la partie « Bases indispensables » et couvrir chacune de ses notions.

## V0.3 — Google Drive
- [x] Préparer le moteur local-first, l'outbox, le protocole et le backend Apps Script/Drive.
- [ ] Déployer et valider réellement l’application Google Apps Script.
- [x] Connecter l'interface et afficher les conflits entre iPad et ordinateur.
- [x] Ajouter les sauvegardes/restaurations manuelles et leur interface.
- [x] Afficher l'état et la dernière synchronisation.

## V0.4 — Extraction du cours
- [ ] Importer un document de cours.
- [ ] Extraire titres, propriétés, conditions et pièges.
- [ ] Afficher une interface de validation humaine.
- [ ] Générer une banque de questions à partir des données validées.

## V1.0
- [ ] Couverture complète de la feuille.
- [ ] Générateurs testés statistiquement.
- [ ] Sauvegarde Drive robuste.
- [ ] Statistiques de maîtrise fiables.
- [ ] Mode hors connexion stabilisé.

## V0.2 — Maîtrise adaptative
- [x] Historique événementiel idempotent, migration versionnée et export/import validé.
- [x] Maîtrise estimée, confiance, niveaux, stabilité, rétention et échéances distinctes.
- [x] Priorités explicables, six modes de révision et constructeur de séance déterministe.
- [x] Intégration notion par notion des corrections de tests finalisées.
- [x] Rapport reproductible de couverture adaptative.
- [ ] Valider l’ergonomie complète du tableau de bord et des vues détaillées sur iPad réel.

## V0.5 — Progression Supabase
- [x] Synchroniser les événements pédagogiques append-only par compte.
- [x] Conserver une outbox hors connexion isolée et un curseur `server_seq`.
- [x] Recalculer localement maîtrise et file de révision après fusion multi-appareils.
- [ ] Valider la recette multi-appareils sur deux iPad réels.

## V0.6 — Banques Supabase
- [x] Questions communes et privées protégées par RLS.
- [x] Cache local isolé, outbox et conflits optimistes.
- [x] Questions de cours, formules et modèles paramétrés sans exécution de JavaScript.
- [x] Source dynamique additive dans le quiz et fonctionnement hors connexion.
- [ ] Valider la recette multi-compte et l'ergonomie complète sur iPad réel.

## V0.7 — Interface multipage
- [x] Séparer le tableau de bord, la préparation, le quiz, la banque, les statistiques et les réglages.
- [x] Ajouter une navigation commune compatible GitHub Pages et hors connexion.
- [x] Ajouter l'assistant guidé de questions en quatre étapes et ses actions local-first.
- [x] Préparer la page owner « Équipe et accès » sans clé secrète navigateur.
- [ ] Valider l'ergonomie multipage et le parcours éditeur sur iPad réel.

## V0.8 — Administration sécurisée
- [x] Interface owner pour les invitations, rôles, suspensions et historique.
- [x] Edge Function avec session vérifiée, rôle relu, CORS strict et limitation des invitations.
- [x] Parcours d’acceptation d’invitation et choix du mot de passe.
- [ ] Appliquer la migration et déployer l’Edge Function sur le projet Supabase.
- [ ] Valider la livraison réelle des e-mails et la recette multi-compte.
