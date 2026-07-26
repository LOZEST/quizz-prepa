import{choice,createQuestion}from'../generator-utils.js';
const cases=[
 {angle:'π − x',cos:'−cos x',sin:'sin x',sym:'symétrie par rapport à l’axe des ordonnées'},
 {angle:'π + x',cos:'−cos x',sin:'−sin x',sym:'symétrie centrale par rapport à l’origine'},
 {angle:'π/2 − x',cos:'sin x',sin:'cos x',sym:'échange des coordonnées dans le premier quadrant'},
 {angle:'−x',cos:'cos x',sin:'−sin x',sym:'symétrie par rapport à l’axe des abscisses'}
];
export function generateTrigSymmetry(difficulty=1){const c=choice(cases);return createQuestion({id:`trig-${c.angle}`,partId:'E',chapterId:'trigonometry',notionId:'trig-symmetry',difficulty,questionHtml:`À l’aide du cercle trigonométrique, exprimer <span class="math">cos(${c.angle})</span> et <span class="math">sin(${c.angle})</span>.`,hint:`Utiliser la ${c.sym}.`,correctionHtml:`<span class="math">cos(${c.angle}) = ${c.cos}</span> et <span class="math">sin(${c.angle}) = ${c.sin}</span>.`,hiddenConcept:'Les relations se reconstruisent plus sûrement sur le cercle qu’en mémorisant une longue liste.',oralFormulation:'« Je décris la symétrie géométrique, puis j’en déduis les signes des coordonnées. »',generator:'trigonometry.symmetry'});}
export const trigonometryGenerators=[generateTrigSymmetry];
