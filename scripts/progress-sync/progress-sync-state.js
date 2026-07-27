import{activeEvents,validateMasteryEvent}from'../mastery/mastery-event-validator.js';
import{rebuildMastery}from'../mastery/mastery-engine.js';
import{buildReviewQueue}from'../repetition/review-queue.js';
export function validateRemoteRow(row,notionIds){if(!row||!Number.isSafeInteger(row.server_seq)||row.server_seq<1)return'curseur serveur invalide';const e=row.event_payload;if(row.event_id!==e?.id||row.event_type!==e?.eventType||row.event_version!==e?.version)return'colonnes et contenu incohérents';const result=validateMasteryEvent(e,{notionIds});return result.valid?null:result.errors.join(', ')}
export function mergeProgress(state,events,notions){const byId=new Map((state.masteryEvents||[]).map(e=>[e.id,e]));events.forEach(e=>{if(!byId.has(e.id))byId.set(e.id,e)});const masteryEvents=[...byId.values()],active=activeEvents(masteryEvents),masteryStates=rebuildMastery(active,notions.map(n=>n.id));return{...state,masteryEvents,masteryStates,reviewQueue:buildReviewQueue(masteryStates,notions).map(x=>x.notion.id)}}

