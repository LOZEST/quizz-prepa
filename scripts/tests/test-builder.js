import{normalizeTestConfig,TEST_FORMATS}from'./test-config.js';
import{buildTestBank}from'./test-question-adapter.js';
import{seededRandom,hash}from'./test-utils.js';
import{validateBlueprint}from'./test-validator.js';
const inScope=(q,s)=>(!s.partIds.length||s.partIds.includes(q.partId))&&(!s.chapterIds.length||s.chapterIds.includes(q.chapterId))&&(!s.notionIds.length||s.notionIds.includes(q.notionId));
const categoryRank={course:0,exercise:1,method:2,trap:3};
export function buildTestBlueprint(input,bank){
 const config=normalizeTestConfig(input),random=seededRandom(config.seed),targetCount=TEST_FORMATS[config.scale].questionCount;
 const pool=(bank||buildTestBank(config.seed)).filter(q=>q.enabled&&q.validated&&q.level<=config.maximumLevel&&inScope(q,config.scope)&&(config.trapsMode!=='none'||q.category!=='trap')).map(q=>({q,key:random()})).sort((a,b)=>a.key-b.key).map(x=>x.q);
 if(!pool.length)throw new Error('Aucune question validée ne correspond à ce périmètre et à ce niveau. Élargissez la sélection.');
 const selected=[],seenTemplates=new Set(),seenVariants=new Set();
 while(selected.length<targetCount){
  const categoryCounts=new Map(),notionCounts=new Map();for(const q of selected){categoryCounts.set(q.category,(categoryCounts.get(q.category)||0)+1);notionCounts.set(q.notionId,(notionCounts.get(q.notionId)||0)+1)}
  const candidates=pool.filter(q=>!seenTemplates.has(q.templateId)&&!seenVariants.has(q.variantSignature)).sort((a,b)=>(categoryCounts.get(a.category)||0)-(categoryCounts.get(b.category)||0)||(notionCounts.get(a.notionId)||0)-(notionCounts.get(b.notionId)||0));
  if(!candidates.length)break;
  const q=candidates[0];selected.push(q);seenTemplates.add(q.templateId);seenVariants.add(q.variantSignature);
 }
 if(selected.length<targetCount)throw new Error(`Banque insuffisante : ${selected.length} questions distinctes disponibles sur les ${targetCount} nécessaires. Élargissez le périmètre ou enrichissez la banque.`);
 let questions=selected.map((q,i)=>({instanceId:`q-${i+1}-${hash(`${config.seed}:${q.variantSignature}`)}`,sourceType:q.sourceType,sourceId:q.sourceId,sourceVersion:q.sourceVersion,templateId:q.templateId,variantSignature:q.variantSignature,points:1,order:i+1,snapshot:q.snapshot,metadata:{partId:q.partId,chapterId:q.chapterId,notionId:q.notionId,level:q.level,category:q.category,estimatedMinutes:q.estimatedMinutes}}));
 if(config.orderMode==='difficulty')questions.sort((a,b)=>a.metadata.level-b.metadata.level);else if(config.orderMode==='progressive')questions.sort((a,b)=>(categoryRank[a.metadata.category]??1)-(categoryRank[b.metadata.category]??1)||a.metadata.level-b.metadata.level);
 questions=questions.map((q,i)=>({...q,order:i+1}));
 const signature=hash(JSON.stringify(questions.map(q=>[q.sourceId,q.variantSignature,q.order]))),blueprint={id:`test-${hash(`${config.seed}:${config.scale}:${signature}`)}`,version:2,gradingMode:'binary',bankVersion:1,seed:config.seed,signature,scale:config.scale,title:`Test TSI sur ${config.scale}`,scope:config.scope,settings:{durationMinutes:config.durationMinutes,orderMode:config.orderMode,trapsMode:config.trapsMode,compositionMode:config.compositionMode,maximumLevel:config.maximumLevel},questions,totals:{points:questions.length,questionCount:questions.length,estimatedMinutes:questions.reduce((n,q)=>n+q.metadata.estimatedMinutes,0)}};
 const result=validateBlueprint(blueprint);if(!result.valid)throw new Error(`Blueprint invalide : ${result.errors.join(', ')}`);return Object.freeze(blueprint);
}
