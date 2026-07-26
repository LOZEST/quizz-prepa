export const SEGMENT_TYPES=Object.freeze({TEXT:'text',MATH:'math',BREAK:'break'});

const text=value=>({type:SEGMENT_TYPES.TEXT,value:String(value??'')});
const decode=value=>String(value).replaceAll('&gt;','>').replaceAll('&lt;','<').replaceAll('&amp;','&');

export function legacyHtmlToSegments(value){
 const source=String(value??''),segments=[];
 const pattern=/<span\s+class=["']math["']\s*>([\s\S]*?)<\/span>/gi;
 let offset=0,match;
 while((match=pattern.exec(source))){if(match.index>offset)segments.push(text(decode(source.slice(offset,match.index))));segments.push({type:SEGMENT_TYPES.MATH,display:false,value:decode(match[1])});offset=pattern.lastIndex}
 if(offset<source.length)segments.push(text(decode(source.slice(offset))));
 return segments.length?segments:[text(decode(source))];
}

export function normalizeSegments(content){
 const input=typeof content==='string'?legacyHtmlToSegments(content):Array.isArray(content)?content:content?.segments;
 if(!Array.isArray(input))return[text(content==null?'':String(content))];
 const normalized=[];
 for(const segment of input){
  if(!segment||typeof segment!=='object')continue;
  if(segment.type===SEGMENT_TYPES.BREAK){normalized.push({type:SEGMENT_TYPES.BREAK});continue}
  if((segment.type===SEGMENT_TYPES.TEXT||segment.type===SEGMENT_TYPES.MATH)&&typeof segment.value==='string')normalized.push(segment.type===SEGMENT_TYPES.MATH?{type:SEGMENT_TYPES.MATH,value:segment.value,display:segment.display===true}:text(segment.value));
 }
 return normalized.length?normalized:[text('Contenu indisponible')];
}

export function normalizeSteps(content){
 const steps=Array.isArray(content?.steps)?content.steps:Array.isArray(content)&&content.every(step=>step?.segments)?content:[content];
 return steps.map(step=>({segments:normalizeSegments(step)}));
}
