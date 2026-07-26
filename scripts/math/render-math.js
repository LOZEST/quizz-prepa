import{normalizeSegments,normalizeSteps,SEGMENT_TYPES}from'./math-segments.js';

function appendMath(parent,segment,{document,katex,development}){
 const node=document.createElement(segment.display?'div':'span');
 node.className=segment.display?'math-segment math-display':'math-segment math-inline';
 if(segment.display)node.setAttribute('role','math');
 try{
  if(!katex?.render)throw new Error('KaTeX indisponible');
  katex.render(segment.value,node,{displayMode:segment.display,throwOnError:true,strict:'warn',trust:false,output:'htmlAndMathml'});
 }catch(error){node.textContent=segment.value||'Formule indisponible';node.classList.add('math-fallback');node.setAttribute('data-math-fallback','true');node.setAttribute('title','La formule est affichée en texte car son rendu a échoué.');if(development)console.warn('Échec du rendu KaTeX',segment.value,error)}
 parent.append(node);
}

export function renderSegments(target,content,options={}){
 const document=options.document||target?.ownerDocument||globalThis.document,katex=options.katex||globalThis.katex;
 if(!target||!document)throw new TypeError('Une cible DOM est requise');
 target.replaceChildren();
 for(const segment of normalizeSegments(content)){
  if(segment.type===SEGMENT_TYPES.BREAK){target.append(document.createElement('br'));continue}
  if(segment.type===SEGMENT_TYPES.TEXT){target.append(document.createTextNode(segment.value));continue}
  appendMath(target,segment,{document,katex,development:options.development??globalThis.location?.hostname==='localhost'});
 }
 if(!target.textContent?.trim()&&!target.children?.length)target.append(document.createTextNode('Contenu indisponible'));
 return target;
}

export function renderSteps(target,content,options={}){
 const document=options.document||target?.ownerDocument||globalThis.document;target.replaceChildren();
 for(const step of normalizeSteps(content)){const row=document.createElement('div');row.className='math-step';renderSegments(row,step,options);target.append(row)}
 return target;
}
