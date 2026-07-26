import{randInt,choice,nonZero,power,createQuestion}from'../generator-utils.js';
const bases=['a','x','y','t'];
export function generatePowerProduct(difficulty=1){
 const base=choice(bases);let m,n;
 if(difficulty===1){m=randInt(1,6);n=randInt(1,6)}
 else if(difficulty===2){m=randInt(1,7);n=-randInt(1,5)}
 else{m=nonZero(-7,8);n=nonZero(-7,8);if(m+n===0)n+=1}
 const r=m+n;const condition=(m<0||n<0||r<0)?`${base} ≠ 0`:'aucune condition supplémentaire';
 return createQuestion({id:`pow-product-${base}-${m}-${n}`,fingerprint:`pow-product-${m}-${n}`,partId:'A',chapterId:'powers',notionId:r<0?'powers-negative':'powers-product',difficulty,questionHtml:`Simplifier <span class="math">${power(base,m)} × ${power(base,n)}</span>. Donner d’abord une écriture avec un seul exposant, puis sans exposant négatif. Préciser les conditions.`,hint:'Pour un produit de puissances de même base, on additionne les exposants.',correctionHtml:r>=0?`<span class="math">${power(base,m)} × ${power(base,n)} = ${power(base,r)}</span>. Condition : ${condition}.`:`<span class="math">${power(base,m)} × ${power(base,n)} = ${power(base,r)} = 1/${power(base,-r)}</span>. Condition : ${condition}.`,hiddenConcept:'Les règles sur les exposants ne dispensent pas de vérifier les valeurs interdites.',oralFormulation:'« Les puissances ont la même base, donc j’additionne les exposants. »',generator:'powers.product'});
}
export function generatePowerNested(difficulty=1){
 const base=choice(bases),m=nonZero(difficulty>2?-5:1,6),n=randInt(2,difficulty>2?5:4),r=m*n;
 return createQuestion({id:`pow-nested-${base}-${m}-${n}`,partId:'A',chapterId:'powers',notionId:m<0?'powers-negative':'powers-nested',difficulty,questionHtml:`Simplifier <span class="math">(${power(base,m)})${power('',n)}</span>.`,hint:'Pour une puissance d’une puissance, on multiplie les exposants.',correctionHtml:`<span class="math">(${power(base,m)})${power('',n)} = ${power(base,r)}</span>${r<0?` = <span class="math">1/${power(base,-r)}</span>, avec ${base} ≠ 0.`:'.'}`,hiddenConcept:'Ne pas additionner les exposants dans une puissance d’une puissance.',oralFormulation:'« Je multiplie les exposants car une puissance est elle-même élevée à une puissance. »',generator:'powers.nested'});
}
export const powerGenerators=[generatePowerProduct,generatePowerNested];
