export const LEVEL_POLICY=Object.freeze({
  1:Object.freeze({id:1,label:'Fondamental',objective:'Vérifier les bases indispensables.',methodGiven:true,maxSteps:2,methodRecognition:false,trapRequired:false}),
  2:Object.freeze({id:2,label:'Standard',objective:'Appliquer correctement le cours.',methodGiven:false,minSteps:2,methodRecognition:false,trapRequired:false}),
  3:Object.freeze({id:3,label:'Réflexe prépa',objective:'Choisir rapidement la bonne méthode.',methodGiven:false,minSteps:2,methodRecognition:true,trapRequired:false}),
  4:Object.freeze({id:4,label:'Piège',objective:'Identifier une erreur tentante et retenir la propriété correcte.',methodGiven:false,methodRecognition:true,trapRequired:true})
});

export function getLevelDefinition(level){const definition=LEVEL_POLICY[Number(level)];if(!definition)throw new RangeError(`Niveau pédagogique invalide : ${level}`);return definition}
export const levelLabel=level=>getLevelDefinition(level).label;
