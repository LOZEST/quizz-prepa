import{PROTOCOL_VERSION,SCHEMA_VERSION,SyncError}from'./constants.js';import{assertJsonSafe}from'./integrity.js';
const ACTIONS=['health','initialize','sync','pull','push','getManifest','createBackup','listBackups','getBackup','deleteBackup'];

function safeErrorMessage(error,{endpointUrl,key,requestBody}){
 let message=typeof error?.message==='string'?error.message:'Erreur réseau sans message';
 for(const secret of[requestBody,key,endpointUrl])if(secret)message=message.split(String(secret)).join('[masqué]');
 return message.replace(/https?:\/\/[^\s"']+/giu,'[URL masquée]');
}

export class SyncClient{
 constructor({endpointUrl,key,fetchImpl,timeoutMs=15000}){
  this.endpointUrl=endpointUrl;this.key=key;this.timeoutMs=timeoutMs;
  const normalizedFetch=fetchImpl??((...args)=>globalThis.fetch(...args));
  if(typeof normalizedFetch!=='function')throw new TypeError('fetchImpl doit être une fonction');
  this.fetch=(...args)=>normalizedFetch(...args);
 }
 async request(action,data={}){
  if(!ACTIONS.includes(action))throw new TypeError('Action non autorisée');
  let url;try{url=new URL(this.endpointUrl);if(url.protocol!=='https:')throw 0}catch{throw new SyncError('ENDPOINT_INVALID','Endpoint HTTPS invalide')}
  assertJsonSafe(data);
  const controller=new AbortController();
  const requestBody=JSON.stringify({action,key:this.key,protocolVersion:PROTOCOL_VERSION,schemaVersion:SCHEMA_VERSION,data});
  const timer=setTimeout(()=>controller.abort(),this.timeoutMs);
  try{
   const response=await this.fetch(url,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:requestBody,signal:controller.signal});
   if(response.status===403)throw new SyncError('AUTH_INVALID','Clé refusée');
   if(response.status===429)throw new SyncError('QUOTA_EXCEEDED','Quota atteint');
   if(!response.ok)throw new SyncError('APPS_SCRIPT_ERROR',`Erreur HTTP ${response.status}`);
   let result;try{result=await response.json()}catch{throw new SyncError('REMOTE_DATA_CORRUPTED','Réponse JSON invalide')}
   if(!result||typeof result!=='object'||result.ok===false)throw new SyncError(result?.error?.code||'APPS_SCRIPT_ERROR',result?.error?.message||'Réponse serveur invalide');
   if(result.protocolVersion!==undefined&&result.protocolVersion!==PROTOCOL_VERSION)throw new SyncError('PROTOCOL_MISMATCH','Protocole serveur incompatible');
   return result;
  }catch(error){
   if(error instanceof SyncError)throw error;
   const details={cause:safeErrorMessage(error,{endpointUrl:this.endpointUrl,key:this.key,requestBody})};
   if(error?.name==='AbortError')throw new SyncError('NETWORK_OFFLINE','Délai réseau dépassé',details);
   // Fetch rejette ses erreurs de transport avec TypeError. Les erreurs de code
   // inattendues doivent rester reconnaissables au lieu d'être déclarées hors ligne.
   if(error instanceof TypeError)throw new SyncError('NETWORK_OFFLINE','Réseau indisponible',details);
   throw error;
  }finally{clearTimeout(timer)}
 }
 health(){return this.request('health')}initialize(data){return this.request('initialize',data)}sync(data){return this.request('sync',data)}pull(data){return this.request('pull',data)}push(data){return this.request('push',data)}getManifest(){return this.request('getManifest')}
}
Object.assign(SyncClient.prototype,{createBackup(data){return this.request('createBackup',data)},listBackups(){return this.request('listBackups')},getBackup(backupId){return this.request('getBackup',{backupId})},deleteBackup(backupId){return this.request('deleteBackup',{backupId})}});
