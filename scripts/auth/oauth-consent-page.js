import{getSupabaseClient}from'./supabase-client.js';

const authorizationId=new URLSearchParams(location.search).get('authorization_id');
const status=document.querySelector('#oauth-status');
const error=document.querySelector('#oauth-error');
const loginForm=document.querySelector('#oauth-login-form');
const consent=document.querySelector('#oauth-consent');
const approve=document.querySelector('#oauth-approve');
const deny=document.querySelector('#oauth-deny');
let client;

function showError(message){error.textContent=message;status.textContent='La connexion n’a pas pu être terminée.'}
function setBusy(busy){approve.disabled=busy;deny.disabled=busy;const submit=loginForm.querySelector('button[type=submit]');if(submit)submit.disabled=busy}
function scopeLabel(scope){return({email:'Identifier ton compte Quiz TSI',openid:'Confirmer ton identité',profile:'Lire ton nom de profil',phone:'Lire ton numéro de téléphone'})[scope]||scope}
function redirectResult(data){const target=data?.redirect_url;if(!target)throw new Error('Réponse OAuth incomplète.');location.replace(target)}

async function displayConsent(){
 error.textContent='';
 const{data:details,error:detailsError}=await client.auth.oauth.getAuthorizationDetails(authorizationId);
 if(detailsError||!details)throw new Error('Demande d’autorisation invalide ou expirée.');
 if(!('authorization_id'in details)){redirectResult(details);return}
 document.querySelector('#oauth-client-name').textContent=`Autoriser ${details.client?.name||'Import Quiz TSI'}`;
 document.querySelector('#oauth-client').textContent=details.client?.name||'Import Quiz TSI';
 document.querySelector('#oauth-redirect').textContent=details.redirect_uri||'Retour sécurisé vers ChatGPT';
 const scopes=document.querySelector('#oauth-scopes');scopes.replaceChildren();
 for(const value of String(details.scope||'email').split(/\s+/).filter(Boolean)){const item=document.createElement('li');item.textContent=scopeLabel(value);scopes.append(item)}
 loginForm.hidden=true;consent.hidden=false;status.textContent='Vérifie les autorisations, puis accepte ou refuse la connexion.';
}

async function start(){
 if(!authorizationId){showError('Identifiant d’autorisation absent. Relance la connexion depuis le GPT Quiz TSI.');return}
 try{
  client=await getSupabaseClient();
  const{data,error:sessionError}=await client.auth.getSession();
  if(sessionError)throw sessionError;
  if(!data.session){status.textContent='Connecte-toi pour continuer.';loginForm.hidden=false;return}
  await displayConsent();
 }catch{showError('Le service d’autorisation est momentanément indisponible.')}
}

loginForm.addEventListener('submit',async event=>{
 event.preventDefault();error.textContent='';setBusy(true);
 try{
  const email=loginForm.elements.email.value.trim();const password=loginForm.elements.password.value;
  const{error:signInError}=await client.auth.signInWithPassword({email,password});
  if(signInError)throw signInError;
  await displayConsent();
 }catch{showError('Connexion impossible. Vérifie ton adresse e-mail et ton mot de passe.')}finally{setBusy(false)}
});

approve.addEventListener('click',async()=>{
 error.textContent='';setBusy(true);
 try{const{data,error:approvalError}=await client.auth.oauth.approveAuthorization(authorizationId);if(approvalError)throw approvalError;redirectResult(data)}catch{showError('Impossible d’autoriser la connexion. Relance la procédure depuis ChatGPT.');setBusy(false)}
});

deny.addEventListener('click',async()=>{
 error.textContent='';setBusy(true);
 try{const{data,error:denialError}=await client.auth.oauth.denyAuthorization(authorizationId);if(denialError)throw denialError;redirectResult(data)}catch{showError('Impossible de refuser proprement la connexion. Ferme cette page puis relance ChatGPT.');setBusy(false)}
});

start();
