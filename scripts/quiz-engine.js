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
import{adaptQuestion,usableQuestions}from'./question-bank/question-adapter.js';
const GENERATORS=[...powerGenerators,...factorisationGenerators,...fractionGenerators,...quadraticGenerators,...sequenceGenerators,...derivativeGenerators,...primitiveGenerators,...trigonometryGenerators,...odeGenerators];
const matches=(q,f)=>['partId','chapterId','notionId'].every(k=>!f[k]||f[k]==='all'||q[k]===f[k]);
const textOf=q=>[q.kind,q.category,q.questionHtml,q.hint,q.correctionHtml,q.question?.segments?.map(s=>s.value).join(' '),q.correction?.steps?.flatMap(s=>s.segments||[]).map(s=>s.value).join(' ')].filter(Boolean).join(' ');
const hasFormula=q=>/\\frac|\\sqrt|\\sum|\\int|[=≤≥≠×÷^_]|[⁰¹²³⁴⁵⁶⁷⁸⁹]/.test(textOf(q));
const isCourse=q=>/cours|définition|propriété|théorème|formule/i.test(String(q.kind||''))||q.generator==='course-bank'||q.question_type==='course'||q.question_type==='formula';
const focusedMode=mode=>mode==='course-short'||mode==='formula';
export class QuizEngine{
 constructor({dynamicProvider=()=>[],userId=null,rng=Math.random}={}){this.recent=[];this.dynamicProvider=dynamicProvider;this.userId=userId;this.rng=rng;this.trapSession={templates:[],signatures:[],taxonomies:[]}}
 setDynamicProvider(provider,userId){this.dynamicProvider=provider||(()=>[]);this.userId=userId}
 generate(filters,progress){
  const mode=filters.mode||'smart',difficulty=filters.difficulty==='adaptive'?this.adaptiveDifficulty(filters.notionId,progress):Number(filters.difficulty);
  if(difficulty===4&&!focusedMode(mode)){const question=trapRegistry.generate(filters,this.trapSession,Date.now());if(question.status==='missing-coverage')return question;this.rememberTrap(question);return question}
  const candidates=[];
  if(!focusedMode(mode))for(const gen of GENERATORS){for(let i=0;i<4;i++){try{const q=gen(difficulty),validation=validateQuestionLevel(q);if(!validation.valid)throw new TypeError(validation.errors.join(' '));if(matches(q,filters))candidates.push(q)}catch(error){const testRuntime=typeof process!=='undefined'&&process.env?.NODE_ENV!=='production',localDevelopment=globalThis.location?.hostname==='localhost';if(testRuntime||localDevelopment)console.error('Générateur exclu',gen.name,error);if(testRuntime)throw error}}}
  for(const q of FIXED_QUESTIONS){
   if(!matches(q,filters))continue;
   if(mode==='course-short'&&!isCourse(q))continue;
   if(mode==='formula'&&!hasFormula(q))continue;
   if(difficulty===3&&!hasFormula(q))continue;
   if(q.difficulty<=Math.max(2,difficulty))candidates.push(q);
  }
  for(const row of usableQuestions(this.dynamicProvider()||[],this.userId)){
   if(!matches({partId:row.part_id,chapterId:row.chapter_id,notionId:row.notion_id},filters))continue;
   if(mode==='course-short'&&!['course','formula'].includes(row.question_type))continue;
   if(mode==='formula'&&row.question_type!=='formula')continue;
   if(difficulty===3&&row.question_type==='course')continue;
   if(row.difficulty<=Math.max(2,difficulty))try{candidates.push(adaptQuestion(row,{rng:this.rng}))}catch{}
  }
  const fresh=candidates.filter(q=>!this.recent.includes(q.fingerprint));
  const pool=fresh.length?fresh:candidates;
  if(!pool.length)return this.missingCoverage(filters,difficulty);
  const q=pool[Math.floor(this.rng()*pool.length)];
  this.recent.push(q.fingerprint);if(this.recent.length>20)this.recent.shift();return q;
 }
 rememberTrap(question){for(const [key,value,limit]of [['templates',question.templateId,8],['signatures',question.signature,24],['taxonomies',question.trap.taxonomyId,8]]){this.trapSession[key].push(value);if(this.trapSession[key].length>limit)this.trapSession[key].shift()}}
 adaptiveDifficulty(notionId,progress){const mastery=progress.masteryStates?.[notionId]?.masteryScore??progress.notions?.[notionId]?.mastery??0;if(mastery<30)return 1;if(mastery<55)return 2;if(mastery<78)return 3;return 4}
 missingCoverage(filters,difficulty){return{status:'missing-coverage',reason:'no-validated-question',partId:filters.partId,chapterId:filters.chapterId,notionId:filters.notionId,difficulty}}
}
