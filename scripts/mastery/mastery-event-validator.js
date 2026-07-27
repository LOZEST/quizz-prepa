const TYPES=new Set(['review-evaluation','test-question-graded','test-result-finalized','mastery-migration','manual-reset','correction-reopened','event-superseded']);
const RESULTS=new Set(['easy','hard','fragile','failed']);
const finite=v=>v===null||v===undefined||Number.isFinite(v);
export function validateMasteryEvent(event,{notionIds,now=Date.now(),futureToleranceMs=300000}={}){
 const errors=[];if(!event||typeof event!=='object')return{valid:false,errors:['Événement absent']};
 if(typeof event.id!=='string'||!event.id.trim())errors.push('id invalide');if(event.version!==1)errors.push('version invalide');if(!TYPES.has(event.eventType))errors.push('type invalide');
 for(const key of ['occurredAt','recordedAt']){const time=Date.parse(event[key]);if(!Number.isFinite(time)||time>now+futureToleranceMs)errors.push(`${key} invalide`)}
 if(event.notionId&&notionIds&&!notionIds.has(event.notionId))errors.push('notion inconnue');const e=event.evidence||{};
 if(e.level!==undefined&&(!Number.isInteger(e.level)||e.level<1||e.level>4))errors.push('niveau invalide');if(e.selfEvaluation!==undefined&&!RESULTS.has(e.selfEvaluation))errors.push('résultat invalide');
 if(e.selfEvaluation==='easy'&&e.hintUsed)errors.push('easy interdit avec indice');if(!finite(e.scoreRatio)||e.scoreRatio<0||e.scoreRatio>1)errors.push('scoreRatio invalide');if(!finite(e.pointsObtained)||!finite(e.pointsMaximum))errors.push('points invalides');if(e.gradingMode!=null&&!['self','teacher','other'].includes(e.gradingMode))errors.push('correction invalide');
 return{valid:errors.length===0,errors};
}
export function activeEvents(events){const unique=new Map();for(const event of events||[])if(event?.id&&!unique.has(event.id))unique.set(event.id,event);const superseded=new Set([...unique.values()].map(e=>e.supersedesEventId).filter(Boolean));for(const e of unique.values())if(e.eventType==='event-superseded'&&e.supersedesEventId)superseded.add(e.supersedesEventId);return[...unique.values()].filter(e=>!e.deletedAt&&!superseded.has(e.id));}
