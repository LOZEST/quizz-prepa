import test from'node:test';
import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';

const read=path=>readFile(new URL(`../${path}`,import.meta.url),'utf8');

test('the ChatGPT endpoint forces private drafts and OAuth client binding',async()=>{
 const source=await read('supabase/functions/chatgpt-import/index.ts');
 assert.match(source,/scope:'private',status:'draft'/);
 assert.match(source,/author_id:userId/);
 assert.match(source,/claims\.client_id!==expectedClientId/);
 assert.doesNotMatch(source,/service_role|SUPABASE_SERVICE_ROLE_KEY/i);
 assert.match(source,/chatgpt-import:\$\{importId\}/);
});

test('the consent screen uses the Supabase OAuth server API',async()=>{
 const source=await read('scripts/auth/oauth-consent-page.js');
 assert.match(source,/getAuthorizationDetails/);
 assert.match(source,/approveAuthorization/);
 assert.match(source,/denyAuthorization/);
 const html=await read('oauth-consent.html');
 assert.match(html,/brouillons privés/);
 assert.match(html,/privacy-chatgpt-import\.html/);
});

test('the GPT action is consequential and uses the project OAuth endpoints',async()=>{
 const schema=await read('docs/chatgpt-action-openapi.yaml');
 assert.match(schema,/x-openai-isConsequential: true/);
 assert.match(schema,/ntmuioktawzlxuuccrgi\.supabase\.co\/auth\/v1\/oauth\/authorize/);
 assert.match(schema,/ntmuioktawzlxuuccrgi\.supabase\.co\/auth\/v1\/oauth\/token/);
 assert.match(schema,/operationId: importQuizTsiDrafts/);
});
