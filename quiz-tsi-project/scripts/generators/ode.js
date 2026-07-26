import{nonZero,randInt,createQuestion}from'../generator-utils.js';
export function generateFirstOrderODE(difficulty=2){
 const a=nonZero(-5,5),b=nonZero(-9,9),c=nonZero(-5,5);const particular=-b/a;
 return createQuestion({id:`ode-${a}-${b}-${c}`,partId:'D',chapterId:'differential',notionId:'ode-first',difficulty,questionHtml:`Donner la solution générale de <span class="math">y′ = ${a}y ${b>=0?'+':'−'} ${Math.abs(b)}</span>.`,hint:'Résoudre l’équation homogène y′=ay et chercher une solution particulière constante.',correctionHtml:`Les solutions sont <span class="math">y(x)=Ce${a===1?'ˣ':`^(${a}x)`} ${particular>=0?'+':'−'} ${Math.abs(particular)}</span>, avec <span class="math">C∈ℝ</span>. Forme exacte de la constante particulière : <span class="math">−b/a = ${-b}/${a}</span>.`,hiddenConcept:'Le signe de la solution particulière constante −b/a est une source fréquente d’erreur.',oralFormulation:'« Je résous l’homogène puis j’ajoute une solution particulière constante. »',generator:'ode.firstOrder'});
}
export const odeGenerators=[generateFirstOrderODE];
