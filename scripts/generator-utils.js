export const randInt=(min,max)=>Math.floor(Math.random()*(max-min+1))+min;
export const choice=items=>items[randInt(0,items.length-1)];
export const nonZero=(min,max)=>{let n=0;while(n===0)n=randInt(min,max);return n};
export const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b)[a,b]=[b,a%b];return a||1};
export const signedTerm=(n,variable='x')=>{
  if(n===0)return '';
  const sign=n>0?'+':'−'; const a=Math.abs(n);
  return `${sign} ${a===1?'':a}${variable}`;
};
export const superscript=n=>String(n).split('').map(c=>({'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}[c]||c)).join('');
export const power=(base,exp)=>exp===1?base:`${base}^{${exp}}`;
export const normalizeSpaces=s=>s.replace(/\+ −/g,'− ').replace(/\+ \+/g,'+ ').replace(/\s+/g,' ').trim();
import{legacyHtmlToSegments,normalizeSegments,normalizeSteps}from'./math/math-segments.js';
const sourceName=data=>data.generator||(/^(?:course|exercise)-/.test(String(data.id||''))?'course-bank':'fixed');
const terminal=value=>/[.!?…»](?:<\/span>)?$/.test(String(value||'').trim());
const sentence=value=>{const text=String(value||'').trim();return!text||terminal(text)?text:`${text}.`};
export function polishCoursePrompt(value){let text=String(value||'').trim();const rules=[
 [/^Domaine de\s+(.+)$/i,'Déterminer le domaine de définition de $1'],
 [/^Signe de\s+(.+)$/i,'Déterminer le signe de $1'],
 [/^Variations? de\s+(.+)$/i,'Étudier les variations de $1'],
 [/^Tangente à\s+(.+)$/i,'Déterminer l’équation de la tangente à $1'],
 [/^Primitive de\s+(.+)$/i,'Déterminer une primitive de $1'],
 [/^Limite de\s+(.+)$/i,'Calculer la limite de $1'],
 [/^Coordonnées pour\s+(.+)$/i,'Donner les coordonnées du point associé à $1'],
 [/^Maximum de\s+(.+)$/i,'Déterminer le maximum de $1'],
 [/^Minimum de\s+(.+)$/i,'Déterminer le minimum de $1'],
 [/^Somme des\s+(.+)$/i,'Calculer la somme des $1']
 ];for(const[pattern,replacement]of rules)if(pattern.test(text)){text=text.replace(pattern,replacement);break}return sentence(text)}
export function polishCourseSentence(value){return sentence(String(value||'').replace(/»\s+(Repérer|Justifier|Expliquer)\b/g,'». $1').replace(/([^.?!:;])\s+(Condition importante|On obtient|La règle correcte|Il faut contrôler)\b/g,'$1. $2'))}
export const createQuestion=data=>{const generator=sourceName(data),course=generator==='course-bank',questionHtml=course?polishCoursePrompt(data.questionHtml):data.questionHtml,hint=course?polishCourseSentence(data.hint):data.hint,correctionHtml=course?polishCourseSentence(data.correctionHtml):data.correctionHtml,hiddenConcept=course?polishCourseSentence(data.hiddenConcept):data.hiddenConcept||'',oralFormulation=data.oralFormulation||'';return{
  id:data.id,
  fingerprint:data.fingerprint||data.id,
  partId:data.partId,
  chapterId:data.chapterId,
  notionId:data.notionId,
  difficulty:data.difficulty||1,
  kind:data.kind||'Exercice généré',
  category:data.category,
  questionHtml,
  question:{segments:normalizeSegments(data.question?.segments||legacyHtmlToSegments(questionHtml||''))},
  hint,
  hintContent:{segments:normalizeSegments(data.hintContent?.segments||legacyHtmlToSegments(hint||''))},
  correctionHtml,
  correction:{steps:normalizeSteps(data.correction?.steps||legacyHtmlToSegments(correctionHtml||''))},
  hiddenConcept,
  hiddenConceptContent:{segments:normalizeSegments(data.hiddenConceptContent?.segments||hiddenConcept||'')},
  oralFormulation,
  oralFormulationContent:{segments:normalizeSegments(data.oralFormulationContent?.segments||oralFormulation||'')},
  generator
 }};
