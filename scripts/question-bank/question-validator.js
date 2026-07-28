import{findNotion}from'../course-map.js';
import{parseDomain}from'./domain-parser.js';
import{parseExpression}from'./expression-engine.js';
import{generateVariants}from'./parameterized-generator.js';
export const LIMITS={title:160,segments:40,segment:4000,steps:30,variables:12,constraints:20,tags:20,json:100000};
const segments=(content,errors,name)=>{if(content==null)return;if(!content||!Array.isArray(content.segments)||content.segments.length>LIMITS.segments)return errors.push(`${name} invalide`);for(const s of content.segments)if(!['text','math'].includes(s.type)||typeof s.value!=='string'||s.value.length>LIMITS.segment||/<[a-z!/]/i.test(s.value))errors.push(`${name} contient un segment interdit`)};
const contentText=q=>[...(q.prompt_content?.segments||[]),...(q.correction_content?.steps||[]).flatMap(step=>step.segments||[])].map(segment=>segment.value||'').join(' ');
const hasMath=q=>(q.prompt_content?.segments||[]).some(segment=>segment.type==='math')||(q.correction_content?.steps||[]).some(step=>(step.segments||[]).some(segment=>segment.type==='math'))||/\\\(|\\\[|[=≠≤≥<>×÷^_]|\\(?:frac|sqrt|sum|int|ln|exp)/.test(contentText(q));
const canonicalType=q=>Number(q.difficulty)===3&&q.question_type!=='course'?'reflex':q.question_type;
export function validateQuestion(q,{publishing=q.status==='published'}={}){
 const errors=[];
 if(!q||JSON.stringify(q).length>LIMITS.json)return{valid:false,errors:['Question absente ou trop volumineuse']};
 if(!q.title?.trim()||q.title.length>LIMITS.title)errors.push('Titre invalide');
 const notion=findNotion(q.notion_id);if(!notion||notion.partId!==q.part_id||notion.chapterId!==q.chapter_id)errors.push('Notion inconnue');
 const type=canonicalType(q),difficulty=q.difficulty==null?null:Number(q.difficulty);
 if(!['course','formula','calculation','reflex','parameterized'].includes(type))errors.push('Type invalide');
 if(type==='reflex'){if(difficulty!==null&&difficulty!==3)errors.push('Une question Réflexe ne possède pas de difficulté choisie.')}else if(![1,2,4].includes(difficulty))errors.push('Difficulté invalide');
 segments(q.prompt_content,errors,'Énoncé');
 if(publishing&&!q.prompt_content?.segments?.some(s=>s.value.trim()))errors.push('Énoncé vide');
 if(!q.correction_content||!Array.isArray(q.correction_content.steps)||q.correction_content.steps.length>LIMITS.steps)errors.push('Correction invalide');else q.correction_content.steps.forEach((x,i)=>segments(x,errors,`Correction ${i+1}`));
 if(publishing&&!q.correction_content?.steps?.some(x=>x.segments?.some(s=>s.value.trim())))errors.push('Correction vide');
 for(const[n,c]of[['Indice',q.hint_content],['Concept',q.hidden_concept_content],['Oral',q.oral_formulation_content]])segments(c,errors,n);
 if(publishing&&type==='formula'&&!hasMath(q))errors.push('Une question de formule doit contenir une expression mathématique.');
 if(publishing&&type==='reflex'&&!hasMath(q))errors.push('Une question Réflexe doit contenir un calcul ou une formule.');
 if(publishing&&type==='reflex'&&contentText(q).length>900)errors.push('Une question Réflexe doit rester courte et directement compréhensible.');
 if(type!=='parameterized'&&q.variable_spec!=null)errors.push('Variables réservées au calcul paramétré');
 if(type==='parameterized'){
  const spec=q.variable_spec,names=spec?.variables?.map(v=>v.name)||[];
  if(!spec||!names.length||names.length>LIMITS.variables||new Set(names).size!==names.length)errors.push('Variables invalides ou dupliquées');
  for(const v of spec?.variables||[])try{v.domainAst=parseDomain(v.domain);if(!v.sampling)throw 0}catch{errors.push(`Domaine ou échantillonnage invalide : ${v.name}`)}
  for(const c of spec?.constraints||[])try{parseExpression(c,names)}catch(e){errors.push(e.message)}
  for(const text of[spec?.promptTemplate,spec?.hintTemplate,...(spec?.correctionTemplates||[])])for(const match of String(text||'').matchAll(/{{([^{}]+)}}/g))try{parseExpression(match[1],names)}catch(e){errors.push(e.message)}
  if(publishing&&!errors.length)try{generateVariants(spec,5,{rng:seeded(17)})}catch(e){errors.push(e.message)}
 }
 return{valid:errors.length===0,errors};
}
export function seeded(seed){let x=seed>>>0;return()=>((x=(1664525*x+1013904223)>>>0)/4294967296)}
