import{PROTOCOL_VERSION,SCHEMA_VERSION,SyncError}from'./constants.js';
const KEY='quiz-tsi-sync-config-v1';
export function defaultSyncConfig(){return{endpointUrl:'',autoSyncEnabled:false,deviceId:crypto.randomUUID(),protocolVersion:PROTOCOL_VERSION,schemaVersion:SCHEMA_VERSION,lastServerRevision:0,lastSuccessfulSyncAt:null,lastAttemptAt:null}}
export function loadSyncConfig(storage=localStorage){try{const raw=storage.getItem(KEY);return raw?{...defaultSyncConfig(),...JSON.parse(raw)}:defaultSyncConfig()}catch(error){throw new SyncError('LOCAL_STORAGE_ERROR','Configuration de synchronisation illisible',{cause:error.message})}}
export function saveSyncConfig(config,storage=localStorage){const next={...config,protocolVersion:PROTOCOL_VERSION,schemaVersion:SCHEMA_VERSION};try{storage.setItem(KEY,JSON.stringify(next));return next}catch(error){throw new SyncError('LOCAL_STORAGE_ERROR','Configuration de synchronisation non enregistrée',{cause:error.message})}}
