const MIN=60_000,HOUR=60*MIN,DAY=24*HOUR;
export const RESULT={EASY:'easy',HARD:'hard',ALMOST:'almost',FAILED:'failed',SKIPPED:'skipped'};
export function updateProgress(state,question,result){
 const now=Date.now();const id=question.notionId;const old=state.notions[id]||{mastery:0,attempts:0,easy:0,hard:0,almost:0,failed:0,dueAt:now};
 const cfg={easy:{delta:8,delay:3*DAY},hard:{delta:3,delay:DAY},almost:{delta:0,delay:4*HOUR},failed:{delta:-5,delay:10*MIN},skipped:{delta:-1,delay:HOUR}}[result];
 const next={...old,attempts:old.attempts+1,mastery:Math.max(0,Math.min(100,old.mastery+cfg.delta)),dueAt:now+cfg.delay,lastResult:result,lastSeenAt:now,[result]:(old[result]||0)+1};
 const attempt={at:new Date(now).toISOString(),questionId:question.id,templateId:question.templateId,templateVersion:question.templateVersion,trapTaxonomyId:question.trap?.taxonomyId,partId:question.partId,notionId:id,chapterId:question.chapterId,difficulty:question.difficulty,questionType:question.questionType||question.kind,variantSignature:question.signature,hintUsed:question.hintUsed===true,result};
 return{...state,notions:{...state.notions,[id]:next},history:[...(state.history||[]),attempt].slice(-1000)};
}
export function dueNotions(state){const now=Date.now();return Object.entries(state.notions||{}).filter(([,v])=>!v.dueAt||v.dueAt<=now).sort((a,b)=>(a[1].mastery||0)-(b[1].mastery||0)).map(([id])=>id)}
export function weakNotions(state){return Object.entries(state.notions||{}).sort((a,b)=>(a[1].mastery||0)-(b[1].mastery||0)).slice(0,10).map(([id])=>id)}
