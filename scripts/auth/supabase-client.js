import{SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY}from'../cloud/supabase-config.js';
let singleton;
export async function getSupabaseClient(factory){if(singleton)return singleton;if(!factory){const module=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');factory=module.createClient}singleton=factory(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}});return singleton}
export function setSupabaseClientForTests(client){singleton=client}
