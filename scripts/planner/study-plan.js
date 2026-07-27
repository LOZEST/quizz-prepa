import{allNotions,COURSE_MAP}from'../course-map.js';
const DAY=86_400_000;
const PRIORITY={exam:0,review:1,weak:2,explore:3};
const dateOnly=value=>{const d=new Date(value);return Number.isNaN(d.getTime())?null:new Date(d.getFullYear(),d.getMonth(),d.getDate())};
export const dayKey=value=>{const d=dateOnly(value);if(!d)return'';return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
const masteryFor=(state,id)=>state.masteryStates?.[id]||null;
export function notionStatus(state,notion,now=Date.now()){
 const mastery=masteryFor(state,notion.id),score=Math.round(mastery?.masteryScore||0),evidence=mastery?.evidenceCount||0,due=mastery?.nextReviewAt&&Date.parse(mastery.nextReviewAt)<=now;
 if(!evidence)return{key:'unseen',label:'À explorer',score:0,evidence:0,due:false};
 if(due)return{key:'due',label:'À revoir',score,evidence,due:true};
 if(score<45)return{key:'weak',label:'Fragile',score,evidence,due:false};
 if(score<70)return{key:'learning',label:'En cours',score,evidence,due:false};
 return{key:'solid',label:'Solide',score,evidence,due:false};
}
export function accountOverview(state,now=Date.now()){
 const notions=allNotions().map(n=>({...n,status:notionStatus(state,n,now)})),seen=notions.filter(n=>n.status.evidence),average=seen.length?Math.round(seen.reduce((sum,n)=>sum+n.status.score,0)/seen.length):0;
 return{notions,average,coverage:Math.round(100*seen.length/Math.max(notions.length,1)),due:notions.filter(n=>n.status.due),weak:notions.filter(n=>['weak','learning'].includes(n.status.key)).sort((a,b)=>a.status.score-b.status.score),unseen:notions.filter(n=>n.status.key==='unseen')};
}
export function chapterOptions(){return COURSE_MAP.flatMap(part=>part.chapters.map(chapter=>({id:chapter.id,label:`${part.label} · ${chapter.label}`,notionIds:chapter.notions.map(n=>n.id)})))}
export function normalizeEvents(events=[]){return events.filter(Boolean).map(event=>({id:String(event.id||crypto.randomUUID()),title:String(event.title||'Échéance').trim().slice(0,120),type:['exam','revision','chapter'].includes(event.type)?event.type:'revision',date:dayKey(event.date),chapterId:String(event.chapterId||''),createdAt:event.createdAt||new Date().toISOString()})).filter(event=>event.date).sort((a,b)=>a.date.localeCompare(b.date))}
const taskKey=task=>`${task.notionId}:${task.type}`;
const task=(notion,type,reason,minutes=15,eventId=null)=>({id:`${type}:${notion.id}:${eventId||''}`,notionId:notion.id,chapterId:notion.chapterId,title:notion.label,type,reason,minutes,eventId});
export function buildAdaptivePlan({state,events=[],now=new Date(),days=14,maxPerDay=4}={}){
 const today=dateOnly(now),overview=accountOverview(state,today.getTime()),notions=new Map(overview.notions.map(n=>[n.id,n])),chapters=new Map(chapterOptions().map(c=>[c.id,c])),normalized=normalizeEvents(events),slots=Array.from({length:days},(_,index)=>({date:dayKey(new Date(today.getTime()+index*DAY)),tasks:[]}));
 const add=(index,item)=>{if(index<0||index>=slots.length||slots[index].tasks.length>=maxPerDay)return false;if(slots[index].tasks.some(existing=>taskKey(existing)===taskKey(item)))return false;slots[index].tasks.push(item);return true};
 for(const notion of overview.due){const dueAt=dateOnly(masteryFor(state,notion.id)?.nextReviewAt)||today;const index=Math.max(0,Math.min(days-1,Math.floor((dueAt-today)/DAY)));add(index,task(notion,'review','Révision espacée prévue',15))}
 for(const event of normalized){const exam=dateOnly(event.date),remaining=Math.ceil((exam-today)/DAY);if(remaining<0||remaining>45)continue;const targets=(chapters.get(event.chapterId)?.notionIds||[]).map(id=>notions.get(id)).filter(Boolean).sort((a,b)=>a.status.score-b.status.score);const available=Math.max(1,Math.min(days,remaining||1));targets.forEach((notion,index)=>{const slot=Math.min(available-1,Math.floor(index*available/Math.max(targets.length,1)));add(slot,task(notion,'exam',`${event.title} · ${remaining<=1?'échéance imminente':`dans ${remaining} jours`}`,20,event.id))})}
 let cursor=0;for(const notion of overview.weak){for(let attempt=0;attempt<slots.length;attempt++){const index=(cursor+attempt)%Math.min(7,slots.length);if(add(index,task(notion,'weak','Consolider un point faible',20))){cursor=index+1;break}}}
 let exploration=0;for(const notion of overview.unseen){if(exploration>=Math.min(5,slots.length))break;const index=Math.min(slots.length-1,exploration*2+1);if(add(index,task(notion,'explore','Découvrir une nouvelle notion',15)))exploration++}
 for(const slot of slots)slot.tasks.sort((a,b)=>(PRIORITY[a.type]??9)-(PRIORITY[b.type]??9));
 return{generatedAt:new Date(now).toISOString(),overview,events:normalized,days:slots};
}
