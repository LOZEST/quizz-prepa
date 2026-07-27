import test from'node:test';import assert from'node:assert/strict';
import{getLevelDefinition,LEVEL_POLICY,levelLabel}from'../scripts/pedagogy/level-policy.js';
import{validateQuestionLevel}from'../scripts/pedagogy/level-validator.js';

test('les quatre niveaux portent des objectifs pédagogiques distincts',()=>{assert.deepEqual(Object.keys(LEVEL_POLICY),['1','2','3','4']);assert.equal(levelLabel(1),'Fondamental');assert.equal(getLevelDefinition(1).maxSteps,2);assert.equal(getLevelDefinition(2).minSteps,2);assert.equal(getLevelDefinition(3).methodRecognition,true);assert.equal(getLevelDefinition(4).trapRequired,true);assert.throws(()=>getLevelDefinition(0),/invalide/)});
test('un niveau 4 incomplet est rejeté avec des erreurs explicites',()=>{const result=validateQuestionLevel({difficulty:4});assert.equal(result.valid,false);for(const expected of ['taxonomyId','oracle','explication'])assert.match(result.errors.join(' '),new RegExp(expected,'i'))});
test('une question ordinaire ne peut pas se déclarer piège',()=>assert.match(validateQuestionLevel({difficulty:2,trap:{taxonomyId:'sign-error'}}).errors.join(' '),/ordinaire/));
