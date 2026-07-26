import{randInt,nonZero,createQuestion}from'../generator-utils.js';
export function generatePrimitivePolynomial(difficulty=1){
 const a=nonZero(-6,6),b=nonZero(-8,8),c=randInt(-8,8);
 return createQuestion({id:`prim-poly-${a}-${b}-${c}`,partId:'D',chapterId:'primitives',notionId:'primitive-basic',difficulty,questionHtml:`Déterminer les primitives de <span class="math">f(x) = ${a}x² ${b>=0?'+':'−'} ${Math.abs(b)}x ${c>=0?'+':'−'} ${Math.abs(c)}</span>.`,hint:'Une primitive de xⁿ est xⁿ⁺¹/(n+1), puis ajouter une constante.',correctionHtml:`<span class="math">F(x) = ${a}/3·x³ ${b>=0?'+':'−'} ${Math.abs(b)}/2·x² ${c>=0?'+':'−'} ${Math.abs(c)}x + C</span>, avec <span class="math">C ∈ ℝ</span>.`,hiddenConcept:'Une famille de primitives contient toujours une constante additive.',oralFormulation:'« Je primitive terme à terme et j’ajoute la constante d’intégration. »',generator:'primitives.polynomial'});
}
export function generatePrimitiveComposite(difficulty=2){
 const a=nonZero(1,5),b=randInt(-7,7),n=randInt(2,6);const coeff=2*a;
 return createQuestion({id:`prim-comp-${a}-${b}-${n}`,partId:'D',chapterId:'primitives',notionId:'primitive-composite',difficulty,questionHtml:`Déterminer une primitive de <span class="math">${coeff}x(${a}x² ${b>=0?'+':'−'} ${Math.abs(b)})${n}</span>.`,hint:'Poser u(x)=ax²+b : le facteur u′(x)=2ax est présent.',correctionHtml:`Avec <span class="math">u(x)=${a}x² ${b>=0?'+':'−'} ${Math.abs(b)}</span>, on a <span class="math">u′(x)=${coeff}x</span>. Une primitive est <span class="math">(${a}x² ${b>=0?'+':'−'} ${Math.abs(b)})${n+1}/(${n+1}) + C</span>.`,hiddenConcept:'Le générateur construit volontairement l’expression avec la dérivée intérieure exacte.',oralFormulation:'« Je reconnais la forme u′uⁿ. »',generator:'primitives.composite'});
}
export const primitiveGenerators=[generatePrimitivePolynomial,generatePrimitiveComposite];
