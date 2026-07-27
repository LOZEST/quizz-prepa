export const SEGMENT_TYPES=Object.freeze({TEXT:'text',MATH:'math',BREAK:'break'});

const text=value=>({type:SEGMENT_TYPES.TEXT,value:String(value??'')});
const decode=value=>String(value).replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');

export function cleanFrenchText(value){
 return String(value??'')
  .replace(/\u00a0/g,' ')
  .replace(/[ \t]+/g,' ')
  .replace(/\s+([,.)\]])/g,'$1')
  .replace(/([([{])\s+/g,'$1')
  .replace(/\s*([;:?!])\s*/g,' $1 ')
  .replace(/([,.])(?=[A-Za-zÀ-ÿ])/g,'$1 ')
  .replace(/\s+([’'])/g,'$1')
  .trim();
}

export function richTextToSegments(value){
 const source=decode(value),segments=[];
 const pattern=/\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)|(\n)/g;
 let offset=0,match;
 const pushText=raw=>{const cleaned=cleanFrenchText(raw);if(cleaned)segments.push(text(cleaned))};
 while((match=pattern.exec(source))){
  if(match.index>offset)pushText(source.slice(offset,match.index));
  if(match[3])segments.push({type:SEGMENT_TYPES.BREAK});
  else segments.push({type:SEGMENT_TYPES.MATH,value:(match[1]??match[2]??'').trim(),display:match[1]!==undefined});
  offset=pattern.lastIndex;
 }
 if(offset<source.length)pushText(source.slice(offset));
 return segments.length?segments:[text(cleanFrenchText(source))];
}

export function legacyHtmlToSegments(value){
 const source=String(value??''),segments=[];
 const pattern=/<span\s+class=["']math["']\s*>([\s\S]*?)<\/span>/gi;
 let offset=0,match;
 while((match=pattern.exec(source))){
  if(match.index>offset)segments.push(...richTextToSegments(source.slice(offset,match.index)));
  segments.push({type:SEGMENT_TYPES.MATH,display:false,value:decode(match[1]).trim()});
  offset=pattern.lastIndex;
 }
 if(offset<source.length)segments.push(...richTextToSegments(source.slice(offset)));
 return segments.length?segments:richTextToSegments(source);
}

export function normalizeSegments(content){
 const input=typeof content==='string'?legacyHtmlToSegments(content):Array.isArray(content)?content:content?.segments;
 if(!Array.isArray(input))return richTextToSegments(content==null?'':String(content));
 const normalized=[];
 for(const segment of input){
  if(!segment||typeof segment!=='object')continue;
  if(segment.type===SEGMENT_TYPES.BREAK){normalized.push({type:SEGMENT_TYPES.BREAK});continue}
  if(segment.type===SEGMENT_TYPES.MATH&&typeof segment.value==='string'){
   normalized.push({type:SEGMENT_TYPES.MATH,value:segment.value.trim(),display:segment.display===true});
   continue;
  }
  if(segment.type===SEGMENT_TYPES.TEXT&&typeof segment.value==='string')normalized.push(...richTextToSegments(segment.value));
 }
 return normalized.length?normalized:[text('Contenu indisponible')];
}

export function normalizeSteps(content){
 const steps=Array.isArray(content?.steps)?content.steps:Array.isArray(content)&&content.every(step=>step?.segments)?content:[content];
 return steps.map(step=>({segments:normalizeSegments(step)}));
}
