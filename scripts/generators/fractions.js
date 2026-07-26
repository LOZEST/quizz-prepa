import{nonZero,randInt,createQuestion}from'../generator-utils.js';
const factor=r=>r>=0?`(x − ${r})`:`(x + ${-r})`;
export function generateFractionSimplify(difficulty=2){
 let shared=nonZero(-6,6),num=nonZero(-7,7),den=nonZero(-7,7);while(num===shared)num=nonZero(-7,7);while(den===shared||den===num)den=nonZero(-7,7);
 const n=`${factor(shared)}${factor(num)}`;const d=`${factor(shared)}${factor(den)}`;
 return createQuestion({id:`fraction-${shared}-${num}-${den}`,partId:'B',chapterId:'rational',notionId:'fraction-simplify',difficulty,questionHtml:`Déterminer l’ensemble de définition, puis simplifier <span class="math">\\dfrac{${n}}{${d}}</span>.`,hint:'Commencer par les zéros du dénominateur initial, puis simplifier les facteurs communs.',correctionHtml:`Domaine : <span class="math">\\mathbb{R} \\setminus \\{${shared}; ${den}\\}</span>. Pour <span class="math">x \\neq ${shared}</span>, la fraction se simplifie en <span class="math">\\dfrac{${factor(num)}}{${factor(den)}}</span>.`,hiddenConcept:'La valeur interdite issue du facteur simplifié reste interdite dans la fonction initiale.',oralFormulation:'« Je détermine le domaine avant toute simplification et je conserve les exclusions initiales. »',generator:'fractions.simplify'});
}
export const fractionGenerators=[generateFractionSimplify];
