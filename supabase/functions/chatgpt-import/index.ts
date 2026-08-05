import{createClient,type SupabaseClient}from'npm:@supabase/supabase-js@2';

const MAX_BODY=262_144;
const MAX_ITEMS=30;
const MAX_SEGMENTS=40;
const MAX_STEPS=30;
const ALLOWED_TYPES=new Set(['course','formula','calculation','reflex']);
const HTML_PATTERN=/<[a-z!/]/i;

class ImportError extends Error{
 constructor(public code:string,public status=400){super(code)}
}

type QuestionRow={
 author_id:string;scope:'private';status:'draft';question_type:string;title:string;
 part_id:string;chapter_id:string;notion_id:string;difficulty:number|null;category:string|null;
 prompt_content:{segments:Segment[]};hint_content:{segments:Segment[]}|null;
 correction_content:{steps:{segments:Segment[]}[]};hidden_concept_content:{segments:Segment[]}|null;
 oral_formulation_content:{segments:Segment[]}|null;variable_spec:null;tags:string[];
};
type Segment={type:'text'|'math';value:string;display?:boolean};

type Dependencies={client?:SupabaseClient;expectedClientId?:string;appBaseUrl?:string};

const response=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','access-control-allow-origin':'*','access-control-allow-headers':'authorization, apikey, content-type, x-client-info','access-control-allow-methods':'POST, OPTIONS'}});
const ok=(body:Record<string,unknown>)=>response(200,{ok:true,...body});
const text=(value:unknown,name:string,max:number,required=true)=>{const result=typeof value==='string'?value.trim():'';if((required&&!result)||result.length>max)throw new ImportError(`INVALID_${name.toUpperCase()}`);return result};
const optionalText=(value:unknown,name:string,max:number)=>value==null||value===''?null:text(value,name,max,false);
const plainObject=(value:unknown)=>Boolean(value&&typeof value==='object'&&!Array.isArray(value));

function decodeClaims(token:string){
 try{const payload=token.split('.')[1];if(!payload)throw 0;const normalized=payload.replace(/-/g,'+').replace(/_/g,'/').padEnd(Math.ceil(payload.length/4)*4,'=');return JSON.parse(atob(normalized))}catch{throw new ImportError('INVALID_TOKEN',401)}
}

function cleanSegments(value:unknown,name:string,required=false):{segments:Segment[]}|null{
 if(value==null&&!required)return null;
 if(!plainObject(value)||!Array.isArray((value as any).segments)||(value as any).segments.length>MAX_SEGMENTS)throw new ImportError(`INVALID_${name}`);
 const segments=(value as any).segments.map((segment:unknown)=>{
  if(!plainObject(segment)||!['text','math'].includes((segment as any).type))throw new ImportError(`INVALID_${name}`);
  const segmentValue=text((segment as any).value,`${name}_segment`,4000,false);
  if(HTML_PATTERN.test(segmentValue))throw new ImportError(`INVALID_${name}`);
  return{type:(segment as any).type,value:segmentValue,...((segment as any).type==='math'?{display:Boolean((segment as any).display)}:{})}as Segment;
 });
 if(required&&!segments.some(segment=>segment.value))throw new ImportError(`EMPTY_${name}`);
 return{segments};
}

function cleanCorrection(value:unknown){
 if(!plainObject(value)||!Array.isArray((value as any).steps)||(value as any).steps.length<1||(value as any).steps.length>MAX_STEPS)throw new ImportError('INVALID_CORRECTION');
 return{steps:(value as any).steps.map((step:unknown)=>cleanSegments(step,'CORRECTION_STEP',true) as{segments:Segment[]})};
}

function cleanTags(value:unknown,reserved:string[]){
 const input=Array.isArray(value)?value:[];const tags:string[]=[];
 for(const tag of input){const cleaned=text(tag,'tag',60,false);if(cleaned&&!tags.includes(cleaned)&&!cleaned.startsWith('chatgpt-'))tags.push(cleaned);if(tags.length>=18)break}
 return[...reserved,...tags];
}

function normalizeItem(value:unknown,index:number,userId:string,importId:string):QuestionRow{
 if(!plainObject(value))throw new ImportError(`INVALID_ITEM_${index}`);
 const item=value as any;const questionType=text(item.question_type,'question_type',32);
 if(!ALLOWED_TYPES.has(questionType))throw new ImportError(`INVALID_QUESTION_TYPE_${index}`);
 const difficulty=item.difficulty==null?null:Number(item.difficulty);
 if(questionType==='reflex'){if(difficulty!==null)throw new ImportError(`INVALID_DIFFICULTY_${index}`)}else if(![1,2,4].includes(difficulty as number))throw new ImportError(`INVALID_DIFFICULTY_${index}`);
 const batchTag=`chatgpt-import:${importId}`,itemTag=`chatgpt-item:${index}`;
 return{
  author_id:userId,scope:'private',status:'draft',question_type:questionType,
  title:text(item.title,'title',160),part_id:text(item.part_id,'part_id',80),chapter_id:text(item.chapter_id,'chapter_id',80),notion_id:text(item.notion_id,'notion_id',80),difficulty,
  category:optionalText(item.category,'category',120),prompt_content:cleanSegments(item.prompt_content,'PROMPT',true) as{segments:Segment[]},
  hint_content:cleanSegments(item.hint_content,'HINT'),correction_content:cleanCorrection(item.correction_content),
  hidden_concept_content:cleanSegments(item.hidden_concept_content,'HIDDEN_CONCEPT'),oral_formulation_content:cleanSegments(item.oral_formulation_content,'ORAL_FORMULATION'),
  variable_spec:null,tags:cleanTags(item.tags,[batchTag,itemTag])
 };
}

function itemIndex(tags:unknown){
 if(!Array.isArray(tags))return Number.MAX_SAFE_INTEGER;
 const tag=tags.find(value=>typeof value==='string'&&value.startsWith('chatgpt-item:'));
 const parsed=Number(String(tag||'').split(':')[1]);return Number.isInteger(parsed)?parsed:Number.MAX_SAFE_INTEGER;
}

function verifyClient(token:string,expectedClientId:string){
 const claims=decodeClaims(token);if(claims.client_id!==expectedClientId)throw new ImportError('OAUTH_CLIENT_NOT_ALLOWED',403);
}

export async function handle(req:Request,deps:Dependencies={}){
 if(req.method==='OPTIONS')return response(204,{});
 try{
  if(req.method!=='POST')throw new ImportError('METHOD_NOT_ALLOWED',405);
  if(!(req.headers.get('content-type')||'').toLowerCase().startsWith('application/json'))throw new ImportError('JSON_REQUIRED',415);
  const declaredLength=Number(req.headers.get('content-length')||0);if(declaredLength>MAX_BODY)throw new ImportError('PAYLOAD_TOO_LARGE',413);
  const authorization=req.headers.get('authorization')||'';const token=authorization.match(/^Bearer\s+(.+)$/i)?.[1];if(!token)throw new ImportError('UNAUTHENTICATED',401);
  const url=Deno.env.get('SUPABASE_URL');const publishable=Deno.env.get('SUPABASE_ANON_KEY');
  const expectedClientId=deps.expectedClientId||Deno.env.get('CHATGPT_OAUTH_CLIENT_ID');const appBaseUrl=deps.appBaseUrl||Deno.env.get('APP_BASE_URL');
  if(!url||!publishable||!expectedClientId||!appBaseUrl)throw new ImportError('SERVICE_NOT_CONFIGURED',503);
  verifyClient(token,expectedClientId);
  const client=deps.client||createClient(url,publishable,{global:{headers:{Authorization:`Bearer ${token}`}},auth:{persistSession:false,autoRefreshToken:false}});
  const verified=await client.auth.getUser(token);if(verified.error||!verified.data.user)throw new ImportError('UNAUTHENTICATED',401);
  const raw=await req.text();if(raw.length>MAX_BODY)throw new ImportError('PAYLOAD_TOO_LARGE',413);
  let body:any;try{body=JSON.parse(raw)}catch{throw new ImportError('INVALID_JSON')}
  if(!plainObject(body))throw new ImportError('INVALID_REQUEST');
  const importId=text(body.import_id,'import_id',80);if(!/^[A-Za-z0-9_-]{8,80}$/.test(importId))throw new ImportError('INVALID_IMPORT_ID');
  if(!Array.isArray(body.items)||body.items.length<1||body.items.length>MAX_ITEMS)throw new ImportError('INVALID_ITEMS');
  const rows=body.items.map((item:unknown,index:number)=>normalizeItem(item,index,verified.data.user.id,importId));
  const batchTag=`chatgpt-import:${importId}`;
  const existingResult=await client.from('questions').select('id,title,tags').eq('author_id',verified.data.user.id).eq('scope','private').contains('tags',[batchTag]);
  if(existingResult.error)throw new ImportError('DATABASE_READ_FAILED',502);
  const existing=existingResult.data||[];const existingIndexes=new Set(existing.map(row=>itemIndex(row.tags)));
  const missingRows=rows.filter((_,index)=>!existingIndexes.has(index));
  let created:any[]=[];
  if(missingRows.length){const inserted=await client.from('questions').insert(missingRows).select('id,title,tags');if(inserted.error)throw new ImportError('DATABASE_WRITE_FAILED',502);created=inserted.data||[]}
  const drafts=[...existing,...created].sort((a,b)=>itemIndex(a.tags)-itemIndex(b.tags)).map(row=>({id:row.id,title:row.title}));
  const review=new URL('questions.html',appBaseUrl.endsWith('/')?appBaseUrl:`${appBaseUrl}/`);review.searchParams.set('source','chatgpt');review.searchParams.set('import',importId);
  return ok({import_id:importId,created_count:created.length,existing_count:existing.length,total_count:drafts.length,drafts,review_url:review.href});
 }catch(error){const known=error instanceof ImportError?error:new ImportError('INTERNAL_ERROR',500);return response(known.status,{ok:false,error:known.code})}
}

if(import.meta.main)Deno.serve(handle);
