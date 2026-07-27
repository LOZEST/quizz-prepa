
async function precache(){
 const cache=await caches.open(CACHE_NAME);
 await Promise.all(CORE_RESOURCES.map(async resource=>{
  try{await cache.add(resource)}catch(error){throw new Error(`Pré-cache impossible pour ${resource}: ${error.message}`)}
 }));
}
self.addEventListener('install',event=>event.waitUntil(precache().then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([
 caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('quiz-tsi-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))),
 self.clients.claim()
])));
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);
 if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
 const authenticationCallback=url.pathname.endsWith('/accept-invite.html')&&(url.search||url.hash);
 if(authenticationCallback){event.respondWith(caches.match('./accept-invite.html').then(cached=>cached||fetch('./accept-invite.html')));return;}
 event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).catch(error=>{
  if(event.request.mode==='navigate'){const page=`./${url.pathname.split('/').pop()||'index.html'}`;return caches.match(page).then(fallback=>fallback||new Response('<!doctype html><html lang="fr"><title>Page indisponible</title><p>Cette page n’est pas encore disponible hors connexion.</p></html>',{headers:{'Content-Type':'text/html; charset=utf-8'},status:503}));}
  throw new Error(`Ressource indisponible hors connexion : ${url.pathname} (${error.message})`);
 })));
});