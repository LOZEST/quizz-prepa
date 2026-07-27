import test from'node:test';
import assert from'node:assert/strict';
import{COURSE_QUESTION_BANK}from'../scripts/course-question-bank.js';
import{polishCoursePrompt,polishCourseSentence}from'../scripts/generator-utils.js';

test('course prompt fragments become complete instructions',()=>{
 assert.equal(polishCoursePrompt('Domaine de 1/(x−4)'),'Déterminer le domaine de définition de 1/(x−4).');
 assert.equal(polishCoursePrompt('Primitive de 2x'),'Déterminer une primitive de 2x.');
 assert.equal(polishCoursePrompt('Limite de ln(x)/x en +∞'),'Calculer la limite de ln(x)/x en +∞.');
 assert.equal(polishCoursePrompt('Résoudre x²=1'),'Résoudre x²=1.');
});

test('generated correction clauses are separated and punctuated',()=>{
 assert.equal(polishCourseSentence('On applique la propriété On obtient 2'),'On applique la propriété. On obtient 2.');
 assert.equal(polishCourseSentence('« erreur » Repérer précisément'),'« erreur ». Repérer précisément.');
});

test('all generated course questions use complete visible sentences',()=>{
 assert.ok(COURSE_QUESTION_BANK.length>100);
 for(const question of COURSE_QUESTION_BANK){
  assert.match(question.questionHtml,/[.!?…»](?:<\/span>)?$/);
  assert.match(question.hint,/[.!?…»](?:<\/span>)?$/);
  assert.ok(question.question.segments.some(segment=>segment.value.trim()));
 }
});
