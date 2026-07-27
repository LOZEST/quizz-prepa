import test from'node:test';import assert from'node:assert/strict';import{AuthService}from'../scripts/auth/auth-service.js';import{UserWorkspace}from'../scripts/workspace/user-workspace.js';import{migrateLegacy}from'../scripts/workspace/legacy-migration.js';
const A='11111111-1111-4111-8111-111111111111',B='22222222-2222-4222-8222-222222222222';
class Memory{constructor(entries={}){this.values=new Map(Object.entries(entries))}getItem(k){return this.values.has(k)?this.values.get(k):null}setItem(k,v){this.values.set(k,String(v))}removeItem(k){this.values.delete(k)}}
function client({failure=false,session={user:{id:A,email:'a@example.test'}}}={}){
 let signedOut=false;
 return{
  auth:{async signInWithPassword(credentials){return failure?{error:new Error('bad')}:{data:{session,credentials},error:null}},async getSession(){return{data:{session},error:null}},async signOut(){signedOut=true;return{error:null}},onAuthStateChange(){return{data:{subscription:{unsubscribe(){}}}}}},
  from(){return{select(){return{eq(){return{single:async()=>({data:{display_name:'Ada',role:'admin'},error:null})}}}}}},
  get signedOut(){return signedOut}
 }
}

test('connexion réussie et profil admin déterminé côté données',async()=>{const api=client(),auth=new AuthService(api);assert.equal((await auth.signIn('a@example.test','correct')).user.id,A);assert.deepEqual(await auth.profile(),{display_name:'Ada',role:'admin'})});
test('mauvais mot de passe sans fuite du mot de passe',async()=>{const auth=new AuthService(client({failure:true}));await assert.rejects(auth.signIn('a@example.test','top-secret'),/incorrect/)});
test('session restaurée puis déconnexion',async()=>{const api=client(),auth=new AuthService(api);assert.equal((await auth.restore()).user.id,A);await auth.signOut();assert.equal(api.signedOut,true)});
test('espaces locaux distincts et objets IndexedDB vérifiables',()=>{const storage=new Memory(),a=new UserWorkspace(A,{storage}),b=new UserWorkspace(B,{storage});a.write('progress',{score:9});b.write('progress',{score:2});assert.equal(a.read('progress').score,9);assert.equal(b.read('progress').score,2);assert.notEqual(a.key('tests'),b.key('tests'));assert.equal(a.assertRecord(a.record('drawings',{id:'x'})).userId,A);assert.throws(()=>b.assertRecord(a.record('events',{id:'e'})),/autre compte/)});
test('migration legacy acceptée, sauvegardée et idempotente',()=>{const legacy={masteryEvents:[{id:'e1'},{id:'e1'}],masteryStates:{n:{score:4}}},storage=new Memory({'quiz-tsi-state-v1':JSON.stringify(legacy)}),workspace=new UserWorkspace(A,{storage});migrateLegacy(workspace,'import',{storage});migrateLegacy(workspace,'import',{storage});assert.equal(workspace.read('state').masteryEvents.length,1);assert.ok(workspace.read('legacy-backup').raw);assert.equal(workspace.read('legacy-migration').imported,true)});
test('migration refusée ou reportée ne touche pas au legacy',()=>{for(const decision of ['decline','later']){const storage=new Memory({'quiz-tsi-state-v1':'{"history":[]}'}),workspace=new UserWorkspace(decision==='later'?A:B,{storage});migrateLegacy(workspace,decision,{storage});assert.equal(storage.getItem('quiz-tsi-state-v1'),'{"history":[]}');assert.equal(workspace.read('state'),null)}});
