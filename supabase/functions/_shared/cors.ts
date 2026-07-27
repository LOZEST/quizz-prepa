import{AdminError}from'./admin-errors.ts';
const PROD='https://lozest.github.io';
export function corsHeaders(req:Request){const origin=req.headers.get('origin')||'';const referer=req.headers.get('referer')||'';const configured=(Deno.env.get('DEV_ALLOWED_ORIGINS')||'http://localhost,http://127.0.0.1').split(',').map(x=>x.trim());const local=configured.includes(origin);const prod=origin===PROD&&referer.startsWith(`${PROD}/quizz-prepa/`);if(!local&&!prod)throw new AdminError('FORBIDDEN',403);return{'access-control-allow-origin':origin,'access-control-allow-methods':'POST, OPTIONS','access-control-allow-headers':'authorization, apikey, content-type, x-client-info','access-control-max-age':'600','vary':'Origin'}}

