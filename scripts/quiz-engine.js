import{FIXED_QUESTIONS}from'./fixed-questions.js';
import{powerGenerators}from'./generators/powers.js';
import{factorisationGenerators}from'./generators/factorisation.js';
import{fractionGenerators}from'./generators/fractions.js';
import{quadraticGenerators}from'./generators/quadratic.js';
import{sequenceGenerators}from'./generators/sequences.js';
import{derivativeGenerators}from'./generators/derivatives.js';
import{primitiveGenerators}from'./generators/primitives.js';
import{trigonometryGenerators}from'./generators/trigonometry.js';
import{odeGenerators}from'./generators/ode.js';
import{createQuestion}from'./generator-utils.js';
const GENERATORS=[...powerGenerators,...factorisationGenerators,...fractionGenerators,...quadraticGenerators,...sequenceGenerators,...derivativeGenerators,...primitiveGenerators,...trigonometryGenerators,...odeGenerators];
const matches=(q,f)=>['partId','chapterId','notionId'].every(k=>!f[k]||f[k]==='all'||q[k]===f[k]);
export class QuizEngine{
 constructor(){this.recent=[]}
 generate(filters,progress){
  const difficulty=filters.difficulty==='adaptive'?this.adaptiveDifficulty(filters.notionId,progress):Number(filters.difficulty);
  const candidates=[];
  for(const gen of GENERATORS){for(let i=0;i<4;i++){try{const q=gen(difficulty);if(matches(q,filters))candidates.push(q)}catch{}}}
  for(const q of FIXED_QUESTIONS)if(matches(q,filters)&&q.difficulty<=Math.max(2,difficulty))candidates.push(q);
  const fresh=candidates.filter(q=>!this.recent.includes(q.fingerprint));
  const pool=fresh.length?fresh:candidates;
  if(!pool.length)return this.fallback(filters,difficulty);
  const q=pool[Math.floor(Math.random()*pool.length)];
  this.recent.push(q.fingerprint);if(this.recent.length>20)this.recent.shift();return q;
 }
 adaptiveDifficulty(notionId,progress){const m=progress.notions?.[notionId]?.mastery??0;if(m<30)return 1;if(m<55)return 2;if(m<78)return 3;return 4}
 fallback(filters,difficulty){return createQuestion({id:`fallback-${Date.now()}`,fingerprint:'fallback',partId:filters.partId,chapterId:filters.chapterId,notionId:filters.notionId,difficulty,kind:'Question de méthode',questionHtml:'Explique la méthode principale de cette notion, ses conditions d’application et une erreur classique.',hint:'Structure la réponse en trois parties : méthode, conditions, piège.',correctionHtml:'Compare ta réponse au cours : elle doit contenir une méthode, les hypothèses nécessaires et au moins une erreur classique.',hiddenConcept:'Une notion est vraiment maîtrisée lorsqu’on sait dire quand et pourquoi une méthode fonctionne.',oralFormulation:'« J’énonce la méthode, puis ses hypothèses et ses limites. »',generator:'fallback'}) }
}
