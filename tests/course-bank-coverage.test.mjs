import test from'node:test';
import assert from'node:assert/strict';
import katex from'katex';
import{allNotions}from'../scripts/course-map.js';
import{COURSE_QUESTION_BANK,COURSE_FACTS}from'../scripts/course-question-bank.js';
import{QuizEngine}from'../scripts/quiz-engine.js';

const GENERIC='Explique la méthode principale de cette notion';
test('chaque notion possède trois cours et trois applications sans contenu générique',()=>{for(const notion of allNotions()){const items=COURSE_QUESTION_BANK.filter(q=>q.notionId===notion.id),course=items.filter(q=>q.category!=='exercise'),exercises=items.filter(q=>q.category==='exercise');assert.ok(COURSE_FACTS[notion.id],`fiche absente: ${notion.id}`);assert.equal(course.length,3,`cours: ${notion.id}`);assert.equal(exercises.length,3,`applications: ${notion.id}`);assert.ok(items.some(q=>q.difficulty===1));assert.ok(items.some(q=>q.difficulty===2));for(const q of items){assert.ok(q.id&&q.question.segments.length&&q.correction.steps.length&&q.hintContent.segments.length&&q.oralFormulationContent.segments.length);assert.ok(!q.questionHtml.includes(GENERIC));}}});
test('IDs, empreintes sémantiques et références sont uniques',()=>{const notions=new Set(allNotions().map(n=>n.id)),ids=new Set(),fingerprints=new Set();for(const q of COURSE_QUESTION_BANK){assert.ok(notions.has(q.notionId));assert.ok(!ids.has(q.id),q.id);assert.ok(!fingerprints.has(q.fingerprint),q.fingerprint);ids.add(q.id);fingerprints.add(q.fingerprint)}});
test('toutes les sources mathématiques de la banque sont acceptées par KaTeX',()=>{for(const q of COURSE_QUESTION_BANK)for(const segment of [...q.question.segments,...q.hintContent.segments,...q.correction.steps.flatMap(s=>s.segments)])if(segment.type==='math')assert.doesNotThrow(()=>katex.renderToString(segment.value,{throwOnError:true}),`${q.id}: ${segment.value}`)});
test('les trois identités fondamentales et leurs conditions sont exactes',()=>{assert.match(COURSE_FACTS['fund-square-sum'][0],/2ab/);assert.match(COURSE_FACTS['fund-square-difference'][0],/−2ab/);assert.match(COURSE_FACTS['fund-conjugates'][0],/a²−b²/);assert.match(COURSE_FACTS['fund-root-square'][0],/\|a\|/)});
test('une lacune produit un état explicite et jamais un faux fallback',()=>{const q=new QuizEngine().generate({partId:'inconnu',chapterId:'inconnu',notionId:'inconnu',difficulty:1},{});assert.deepEqual(q,{status:'missing-coverage',reason:'no-validated-question',partId:'inconnu',chapterId:'inconnu',notionId:'inconnu',difficulty:1})});
