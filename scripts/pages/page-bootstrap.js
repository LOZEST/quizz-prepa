import{protectPage}from'../auth/protected-page.js';
const moduleName=document.body.dataset.page;protectPage({roles:moduleName==='team'?['owner']:null,init:async context=>{const module=await import(`./${moduleName}-page.js`);await module.init?.(context)}});
if('serviceWorker'in navigator)navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
