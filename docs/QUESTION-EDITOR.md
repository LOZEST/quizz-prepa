# Éditeur de questions

L'entrée **Banque de questions** ouvre trois onglets tactiles : banque commune, questions privées et création. Partie, chapitre et notion sont issus exclusivement de `course-map.js`. Les contenus sont des segments `text`/`math` et des étapes; aucun HTML distant n'est injecté. Le brouillon local accepte un contenu incomplet, tandis qu'une publication exige énoncé, correction et taxonomie valides. Les questions `formula` utilisent le même format structuré que les questions de cours.

La validation limite notamment le titre à 160 caractères, 40 segments, 30 étapes, 12 variables, 20 contraintes et 100 ko de JSON. L'aperçu mathématique passe par le rendu KaTeX existant et son fallback textuel.
