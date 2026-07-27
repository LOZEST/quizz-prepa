export class ProgressSyncClient{
 constructor(supabase,userId,{pageSize=100}={}){this.supabase=supabase;this.userId=userId;this.pageSize=pageSize}
 row(event){return{user_id:this.userId,event_id:event.id,event_version:event.version,event_type:event.eventType,notion_id:event.notionId||null,occurred_at:event.occurredAt,recorded_at:event.recordedAt,source_device_id:event.source?.deviceId||null,event_payload:event}}
 async push(events){if(!events.length)return[];const rows=events.map(e=>this.row(e));const{error}=await this.supabase.from('progress_events').upsert(rows,{onConflict:'user_id,event_id',ignoreDuplicates:true});if(error)throw error;return events.map(e=>e.id)}
 async pull(after){const{data,error}=await this.supabase.from('progress_events').select('event_id,event_version,event_type,notion_id,occurred_at,recorded_at,source_device_id,event_payload,server_seq').gt('server_seq',after).order('server_seq',{ascending:true}).limit(this.pageSize);if(error)throw error;return data||[]}
}

