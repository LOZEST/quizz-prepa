import{getLevelDefinition}from'./level-policy.js';

export function validateQuestionLevel(question,{throwOnError=false}={}){
 const errors=[];let policy;
 try{policy=getLevelDefinition(question?.difficulty??question?.level)}catch(error){errors.push(error.message)}
 if(policy?.trapRequired){
  if(!question?.trap?.taxonomyId)errors.push('Un niveau 4 doit identifier une misconception (taxonomyId).');
  for(const field of ['expectedConcept','temptingMistake','whyTempting','whyWrong','reflexToRemember'])if(!question?.trap?.[field]?.trim?.())errors.push(`Métadonnée de piège manquante : trap.${field}.`);
  if(!question?.trap?.requiredConditions?.length)errors.push('Un niveau 4 doit préciser ses conditions nécessaires.');
  if(typeof question?.oracle!=='function')errors.push('Un niveau 4 doit fournir un oracle mathématique.');
  if(!question?.trapExplanation)errors.push('Un niveau 4 doit fournir une explication pédagogique structurée.');
 }
 if(policy&&!policy.trapRequired&&question?.trap)errors.push(`Une question ordinaire de niveau ${policy.id} ne peut pas être enregistrée comme piège.`);
 const result={valid:errors.length===0,errors,policy};if(throwOnError&&!result.valid)throw new TypeError(errors.join(' '));return result;
}
