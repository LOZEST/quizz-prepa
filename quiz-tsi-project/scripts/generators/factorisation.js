import{randInt,choice,nonZero,createQuestion}from'../generator-utils.js';
export function generateDifferenceSquares(difficulty=1){
 const a=randInt(2,difficulty>2?12:8);const k=difficulty>2?choice([1,2,3]):1;
 const left=k===1?'x²':`${k*k}x²`;const f1=k===1?`x − ${a}`:`${k}x − ${a}`;const f2=k===1?`x + ${a}`:`${k}x + ${a}`;
 return createQuestion({id:`factor-diff-${k}-${a}`,partId:'B',chapterId:'factorisation',notionId:'factor-identities',difficulty,questionHtml:`Factoriser complètement <span class="math">${left} − ${a*a}</span>.`,hint:'Reconnaître une différence de deux carrés : A² − B².',correctionHtml:`<span class="math">${left} − ${a*a} = (${f1})(${f2})</span>.`,hiddenConcept:'Il faut identifier les deux carrés avant d’appliquer l’identité remarquable.',oralFormulation:'« Je reconnais A² − B² = (A − B)(A + B). »',generator:'factorisation.differenceSquares'});
}
export function generateCommonFactor(difficulty=1){
 const a=nonZero(2,7),b=nonZero(1,8),c=nonZero(1,8);const sign=choice([1,-1]);
 const expr=`${a}x(${b}x ${sign>0?'+':'−'} ${c}) ${sign>0?'+':'−'} ${a*(difficulty>2?2:1)}(${b}x ${sign>0?'+':'−'} ${c})`;
 const inner=difficulty>2?`x + ${sign>0?2:-2}`:`x ${sign>0?'+':'−'} 1`;
 const correction=difficulty>2?`${a}(${b}x ${sign>0?'+':'−'} ${c})(x ${sign>0?'+':'−'} 2)`:`${a}(${b}x ${sign>0?'+':'−'} ${c})(x ${sign>0?'+':'−'} 1)`;
 return createQuestion({id:`factor-common-${a}-${b}-${c}-${sign}-${difficulty}`,partId:'B',chapterId:'factorisation',notionId:'factor-common',difficulty,questionHtml:`Factoriser sans développer : <span class="math">${expr}</span>.`,hint:`Le facteur commun visible est <span class="math">${a}(${b}x ${sign>0?'+':'−'} ${c})</span>.`,correctionHtml:`<span class="math">${expr} = ${correction}</span>.`,hiddenConcept:'Développer trop tôt détruit la structure utile de l’expression.',oralFormulation:'« Je repère d’abord le facteur commun maximal. »',generator:'factorisation.commonFactor'});
}
export function generateTrinomialFactor(difficulty=2){
 let r1=nonZero(-7,7),r2=nonZero(-7,7);while(r2===r1)r2=nonZero(-7,7);const b=-(r1+r2),c=r1*r2;
 const btxt=b===0?'':`${b>0?'+':'−'} ${Math.abs(b)===1?'':Math.abs(b)}x`;
 const ctxt=c===0?'':`${c>0?'+':'−'} ${Math.abs(c)}`;
 const poly=`x² ${btxt} ${ctxt}`.replace(/\s+/g,' ').trim();
 const f=r=>r>=0?`(x − ${r})`:`(x + ${-r})`;
 return createQuestion({id:`factor-tri-${r1}-${r2}`,partId:'B',chapterId:'factorisation',notionId:'factor-trinomial',difficulty,questionHtml:`Factoriser puis résoudre <span class="math">${poly} = 0</span> sans utiliser systématiquement le discriminant.`,hint:`Chercher deux nombres dont la somme vaut ${-b} et le produit ${c}.`,correctionHtml:`<span class="math">${poly} = ${f(r1)}${f(r2)}</span>, donc <span class="math">x = ${r1}</span> ou <span class="math">x = ${r2}</span>.`,hiddenConcept:'La génération part des racines : le calcul reste propre et la factorisation est garantie.',oralFormulation:'« Je cherche d’abord une factorisation simple ou des racines évidentes. »',generator:'factorisation.trinomial'});
}
export const factorisationGenerators=[generateDifferenceSquares,generateCommonFactor,generateTrinomialFactor];
