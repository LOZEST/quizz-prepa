# Éditeur de questions

L'entrée **Banque de questions** ouvre trois onglets tactiles : banque commune, questions privées et création. Partie, chapitre et notion sont issus exclusivement de `course-map.js`. Les contenus sont des segments `text`/`math` et des étapes; aucun HTML distant n'est injecté. Le brouillon local accepte un contenu incomplet, tandis qu'une publication exige énoncé, correction et taxonomie valides. Les questions `formula` utilisent le même format structuré que les questions de cours.

La validation limite notamment le titre à 160 caractères, 40 segments, 30 étapes, 12 variables, 20 contraintes et 100 ko de JSON. L'aperçu mathématique passe par le rendu KaTeX existant et son fallback textuel.

## Assistant multipage

`questions.html` remplace le petit dialogue comme parcours principal. L'assistant sépare le type, le classement issu exclusivement de `course-map.js`, le contenu structuré, puis l'aperçu/publication. Le mode variable simple masque le JSON avancé et doit produire dix variantes distinctes avant publication. Création, modification, duplication et archivage restent optimistes et passent par le cache et l'outbox ; l'archivage utilise toujours `status = archived`.
