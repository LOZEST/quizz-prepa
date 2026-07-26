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
export const power=(base,exp)=>exp===1?base:`${base}${superscript(exp)}`;
export const normalizeSpaces=s=>s.replace(/\+ −/g,'− ').replace(/\+ \+/g,'+ ').replace(/\s+/g,' ').trim();
import{legacyHtmlToSegments,normalizeSegments,normalizeSteps}from'./math/math-segments.js';
export const createQuestion=data=>({
  id:data.id,
  fingerprint:data.fingerprint||data.id,
  partId:data.partId,
  chapterId:data.chapterId,
  notionId:data.notionId,
  difficulty:data.difficulty||1,
  kind:data.kind||'Exercice généré',
  questionHtml:data.questionHtml,
  question:{segments:normalizeSegments(data.question?.segments||legacyHtmlToSegments(data.questionHtml||''))},
  hint:data.hint,
  hintContent:{segments:normalizeSegments(data.hintContent?.segments||legacyHtmlToSegments(data.hint||''))},
  correctionHtml:data.correctionHtml,
  correction:{steps:normalizeSteps(data.correction?.steps||legacyHtmlToSegments(data.correctionHtml||''))},
  hiddenConcept:data.hiddenConcept||'',
  hiddenConceptContent:{segments:normalizeSegments(data.hiddenConceptContent?.segments||data.hiddenConcept||'')},
  oralFormulation:data.oralFormulation||'',
  oralFormulationContent:{segments:normalizeSegments(data.oralFormulationContent?.segments||data.oralFormulation||'')},
  generator:data.generator||'fixed'
});
