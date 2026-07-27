import{TRAP_TAXONOMY_IDS}from'./taxonomy-ids.js';
import{allNotions}from'../course-map.js';
import{validateQuestionLevel}from'../pedagogy/level-validator.js';
import{validateTrapTemplateSchema}from'./trap-schema.js';
const taxonomyIds=new Set(TRAP_TAXONOMY_IDS),notionIds=new Set(allNotions().map(item=>item.id));
export function validateTrapTemplate(template){return validateTrapTemplateSchema(template,{taxonomyIds,notionIds})}
export function validateGeneratedTrap(question,{throwOnError=false}={}){const errors=[...validateQuestionLevel(question).errors];if(!question?.signature)errors.push('Signature de variante manquante.');if(!question?.finalAnswer?.value)errors.push('Réponse exacte manquante.');if(question?.oracle?.()!==question?.finalAnswer?.value)errors.push('L’oracle et la réponse exacte divergent.');if(!question?.validation?.parametersValid)errors.push('Paramètres invalides.');if(!question?.validation?.correctionMatchesOracle)errors.push('La correction ne rejoint pas l’oracle.');const serialized=JSON.stringify(question);if(/NaN|Infinity/.test(serialized))errors.push('Valeur non finie détectée.');const result={valid:errors.length===0,errors};if(throwOnError&&!result.valid)throw new TypeError(errors.join(' '));return result}
