const INTERACTIVE='button, input, select, textarea, a, [role="button"], dialog, [contenteditable="true"]';
export class TestPageLock{
 constructor({document=globalThis.document,now=()=>Date.now()}={}){this.document=document;this.now=now;this.active=false;this.lastTap=0;this.listeners=[]}
 listen(target,type,handler,options){target.addEventListener(type,handler,options);this.listeners.push(()=>target.removeEventListener(type,handler,options))}
 enable(){if(this.active||!this.document)return;this.active=true;this.document.body.classList.add('test-active');const stop=e=>e.preventDefault();for(const type of['gesturestart','gesturechange','gestureend'])this.listen(this.document,type,stop,{passive:false});this.listen(this.document,'touchend',e=>{if(!this.active||e.touches?.length||e.target?.closest?.(INTERACTIVE))return;const now=this.now();if(now-this.lastTap<350)e.preventDefault();this.lastTap=now},{passive:false});this.listen(this.document,'contextmenu',e=>{if(this.active&&e.target?.closest?.('#testApp')&&!e.target?.closest?.(INTERACTIVE))e.preventDefault()})}
 disable(){for(const remove of this.listeners.splice(0))remove();this.document?.body.classList.remove('test-active');this.active=false;this.lastTap=0}
}
