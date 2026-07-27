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
import{trapRegistry}from'./traps/trap-registry.js';
import{validateQuestionLevel}from'./pedagogy/level-validator.js';
const GENERATORS=[...powerGenerators,...factorisationGenerators,...fractionGenerators,...quadraticGenerators,...sequenceGenerators,...derivativeGenerators,...primitiveGenerators,...trigonometryGenerators,...odeGenerators];
const matches=(q,f)=>['partId','chapterId','notionId'].every(k=>!f[k]||f[k]==='all'||q[k]===f[k]);
export class QuizEngine{
 constructor(){this.recent=[];this.trapSession={templates:[],signatures:[],taxonomies:[]}}
 generate(filters,progress){
  const difficulty=filters.difficulty==='adaptive'?this.adaptiveDifficulty(filters.notionId,progress):Number(filters.difficulty);
  if(difficulty===4){const question=trapRegistry.generate(filters,this.trapSession,Date.now());if(question.status==='missing-coverage')return question;this.rememberTrap(question);return question}
  const candidates=[];
  for(const gen of GENERATORS){for(let i=0;i<4;i++){try{const q=gen(difficulty),validation=validateQuestionLevel(q);if(!validation.valid)throw new TypeError(validation.errors.join(' '));if(matches(q,filters))candidates.push(q)}catch(error){const testRuntime=typeof process!=='undefined'&&process.env?.NODE_ENV!=='production',localDevelopment=globalThis.location?.hostname==='localhost';if(testRuntime||localDevelopment)console.error('Générateur exclu',gen.name,error);if(testRuntime)throw error}}}
  for(const q of FIXED_QUESTIONS)if(matches(q,filters)&&q.difficulty<=Math.max(2,difficulty))candidates.push(q);
  const fresh=candidates.filter(q=>!this.recent.includes(q.fingerprint));
  const pool=fresh.length?fresh:candidates;
  if(!pool.length)return this.missingCoverage(filters,difficulty);
  const q=pool[Math.floor(Math.random()*pool.length)];
  this.recent.push(q.fingerprint);if(this.recent.length>20)this.recent.shift();return q;
 }
 rememberTrap(question){for(const [key,value,limit]of [['templates',question.templateId,8],['signatures',question.signature,24],['taxonomies',question.trap.taxonomyId,8]]){this.trapSession[key].push(value);if(this.trapSession[key].length>limit)this.trapSession[key].shift()}}
 adaptiveDifficulty(notionId,progress){const m=progress.notions?.[notionId]?.mastery??0;if(m<30)return 1;if(m<55)return 2;if(m<78)return 3;return 4}
 missingCoverage(filters,difficulty){return{status:'missing-coverage',reason:'no-validated-question',partId:filters.partId,chapterId:filters.chapterId,notionId:filters.notionId,difficulty}}
}
