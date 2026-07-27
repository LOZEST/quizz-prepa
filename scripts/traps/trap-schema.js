export const TRAP_REQUIRED_FIELDS=Object.freeze(['id','version','partId','chapterId','notionId','level','questionType','trap','source','generate']);
export const TRAP_METADATA_FIELDS=Object.freeze(['taxonomyId','expectedConcept','temptingMistake','requiredConditions','whyTempting','whyWrong','reflexToRemember']);

export function validateTrapTemplateSchema(template,{taxonomyIds,notionIds}={}){
 const errors=[];for(const field of TRAP_REQUIRED_FIELDS)if(template?.[field]===undefined||template?.[field]===null)errors.push(`Champ obligatoire manquant : ${field}`);
 if(template?.level!==4)errors.push('Un modèle de piège doit être de niveau 4.');
 if(!/^[a-z0-9]+(?:[.-][a-z0-9]+)+$/.test(template?.id||''))errors.push('Identifiant de modèle instable ou invalide.');
 if(!Number.isInteger(template?.version)||template.version<1)errors.push('La version doit être un entier positif.');
 for(const field of TRAP_METADATA_FIELDS){const value=template?.trap?.[field];if(field==='requiredConditions'?!(Array.isArray(value)&&value.length):!value?.trim?.())errors.push(`Métadonnée obligatoire manquante : trap.${field}`)}
 if(taxonomyIds&&!taxonomyIds.has(template?.trap?.taxonomyId))errors.push(`Taxonomie inconnue : ${template?.trap?.taxonomyId}`);
 if(notionIds&&!notionIds.has(template?.notionId))errors.push(`Notion inconnue : ${template?.notionId}`);
 if(typeof template?.generate!=='function')errors.push('Le générateur de paramètres est absent.');
 return{valid:errors.length===0,errors};
}
