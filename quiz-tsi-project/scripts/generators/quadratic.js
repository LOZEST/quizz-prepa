import{nonZero,createQuestion,choice}from'../generator-utils.js';
export function generateQuadraticSolve(difficulty=2){
 let r1=nonZero(-8,8),r2=nonZero(-8,8);while(r2===r1)r2=nonZero(-8,8);const a=difficulty>=3?choice([1,1,2,3]):1;const b=-a*(r1+r2),c=a*r1*r2;
 const bt=b===0?'':`${b>0?'+':'−'} ${Math.abs(b)}x`;const ct=c===0?'':`${c>0?'+':'−'} ${Math.abs(c)}`;const poly=`${a===1?'':a}x² ${bt} ${ct}`.replace(/\s+/g,' ').trim();
 const f=r=>r>=0?`(x − ${r})`:`(x + ${-r})`;
 return createQuestion({id:`quad-${a}-${r1}-${r2}`,partId:'B',chapterId:'equations',notionId:'quadratic-solve',difficulty,questionHtml:`Résoudre dans ℝ : <span class="math">${poly} = 0</span>. Choisir la méthode la plus courte.`,hint:'Les coefficients ont été construits à partir de deux racines entières : chercher une factorisation avant le discriminant.',correctionHtml:`<span class="math">${poly} = ${a===1?'':a}${f(r1)}${f(r2)}</span>. Donc <span class="math">x = ${r1}</span> ou <span class="math">x = ${r2}</span>.`,hiddenConcept:'Le discriminant est général, mais une factorisation ou une racine évidente est souvent plus rapide.',oralFormulation:'« Je choisis la méthode adaptée à la structure, plutôt qu’une procédure automatique. »',generator:'quadratic.solve'});
}
export const quadraticGenerators=[generateQuadraticSolve];
