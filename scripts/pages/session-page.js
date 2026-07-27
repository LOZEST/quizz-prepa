import{COURSE_MAP}from'../course-map.js';
const MODES=[
 ['smart','Révision intelligente','Un mélange adapté à ta progression.'],
 ['course-short','Cours express','Des définitions, propriétés et résultats essentiels, sans exercice long.'],
 ['formula','Formules essentielles','Uniquement les formules, égalités et calculs à connaître.'],
 ['daily','Révisions du jour','Traiter en priorité ce qui doit être revu aujourd’hui.'],
 ['weak','Consolider mes points faibles','Reprendre les notions les plus fragiles.'],
 ['new','Découvrir de nouvelles notions','Explorer progressivement le programme.'],
 ['free','Révision libre','Choisir précisément le contenu et le niveau.'],
 ['chapter-test','Test de chapitre','Préparer un test de 20 ou 40 questions.']
];
export function init({workspace}){
 const modes=document.querySelector('[data-session-modes]'),form=document.querySelector('[data-session-form]');let selected='';
 for(const[m,t,d]of MODES){const b=document.createElement('button');b.type='button';b.className='card action-card';b.dataset.mode=m;const s=document.createElement('strong'),p=document.createElement('span');s.textContent=t;p.textContent=d;b.append(s,p);b.onclick=()=>choose(m,b);modes.append(b)}
 const part=form.elements.part,chapter=form.elements.chapter,notion=form.elements.notion,testChapter=form.elements.testChapter;
 fill(part,COURSE_MAP);fill(testChapter,COURSE_MAP.flatMap(p=>p.chapters));
 part.onchange=()=>{const p=COURSE_MAP.find(x=>x.id===part.value);fill(chapter,p?.chapters||[]);chapter.dispatchEvent(new Event('change'))};
 chapter.onchange=()=>{const c=COURSE_MAP.flatMap(x=>x.chapters).find(x=>x.id===chapter.value);fill(notion,c?.notions||[])};
 part.dispatchEvent(new Event('change'));
 function choose(mode,button){selected=mode;modes.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));form.hidden=false;form.querySelector('[data-free-fields]').hidden=mode!=='free';form.querySelector('[data-test-fields]').hidden=mode!=='chapter-test';form.querySelector('[data-start]').textContent=mode==='chapter-test'?'Commencer le test':'Commencer la séance';form.scrollIntoView({behavior:'smooth',block:'nearest'})}
 form.onsubmit=e=>{e.preventDefault();if(!selected)return;const config={mode:selected,difficulty:'adaptive',createdAt:new Date().toISOString()};if(selected==='free')Object.assign(config,{partId:part.value,chapterId:chapter.value,notionId:notion.value,difficulty:form.elements.difficulty.value});if(selected==='chapter-test')Object.assign(config,{chapterId:testChapter.value,count:Number(new FormData(form).get('count'))});workspace.write('active-session',config);location.href='./quiz.html'};
 const requested=new URLSearchParams(location.search).get('mode');if(requested&&MODES.some(([id])=>id===requested)){const button=modes.querySelector(`[data-mode="${requested}"]`);choose(requested,button)}
}
function fill(select,rows){select.replaceChildren(...rows.map(x=>{const o=document.createElement('option');o.value=x.id;o.textContent=x.label;return o}))}
