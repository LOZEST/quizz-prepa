const KEY='quiz-tsi-state-v1';
export const emptyState=()=>({version:1,createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),notions:{},history:[],preferences:{}});
export function loadState(){try{const raw=localStorage.getItem(KEY);return raw?{...emptyState(),...JSON.parse(raw)}:emptyState()}catch{return emptyState()}}
export function saveState(state){const next={...state,updatedAt:new Date().toISOString()};localStorage.setItem(KEY,JSON.stringify(next));return next}
export function exportState(state){const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`quiz-tsi-sauvegarde-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(url)}
export async function importState(file){const data=JSON.parse(await file.text());if(!data||typeof data!=='object'||!data.version)throw new Error('Sauvegarde invalide');return saveState(data)}
