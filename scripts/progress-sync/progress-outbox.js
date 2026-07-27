const AREA='progress-sync';
const fresh=()=>({eventIds:[],lastAttemptAt:null,attemptCount:0,lastError:null,lastPulledServerSeq:0,lastSuccessfulSyncAt:null,initialized:false,quarantine:[]});
export class ProgressOutbox{
 constructor(workspace){this.workspace=workspace}
 read(){const value=this.workspace.read(AREA,{});return{...fresh(),...value,eventIds:[...new Set(value.eventIds||[])]}}
 write(value){return this.workspace.write(AREA,{...fresh(),...value,eventIds:[...new Set(value.eventIds||[])]})}
 enqueue(ids){const state=this.read();state.eventIds=[...new Set([...state.eventIds,...ids.filter(Boolean)])];return this.write(state)}
 initialize(events){const state=this.read();if(!state.initialized){state.eventIds=[...new Set([...state.eventIds,...events.map(e=>e.id)])];state.initialized=true}return this.write(state)}
 attempted(error=null){const state=this.read();state.lastAttemptAt=new Date().toISOString();state.attemptCount++;state.lastError=error;return this.write(state)}
 confirm(ids){const confirmed=new Set(ids),state=this.read();state.eventIds=state.eventIds.filter(id=>!confirmed.has(id));return this.write(state)}
 quarantine(row,reason){const state=this.read();if(!state.quarantine.some(x=>x.event_id===row.event_id&&x.server_seq===row.server_seq))state.quarantine.push({event_id:row.event_id,server_seq:row.server_seq,reason,rejectedAt:new Date().toISOString()});return this.write(state)}
}

