import test from'node:test';
import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';
import{richTextToSegments,cleanFrenchText}from'../scripts/math/math-segments.js';
const read=file=>readFile(new URL(`../${file}`,import.meta.url),'utf8');

test('math delimiters are converted into safe structured segments',()=>{
 const segments=richTextToSegments('Calculer \\(\\frac{1}{x}\\).\nPuis écrire \\[x^2+1\\]');
 assert.deepEqual(segments.map(x=>x.type),['text','math','text','break','text','math']);
 assert.equal(segments[1].value,'\\frac{1}{x}');
 assert.equal(segments.at(-1).display,true);
});

test('French copy cleanup repairs common spacing problems',()=>{
 assert.equal(cleanFrenchText('Une phrase  mal écrite ,avec un espace !'),'Une phrase mal écrite, avec un espace !');
});

test('session page exposes short course and formula modes',async()=>{
 const source=await read('scripts/pages/session-page.js');
 assert.match(source,/course-short/);
 assert.match(source,/Cours express/);
 assert.match(source,/Formules essentielles/);
});

test('quiz engine keeps prose out of reflex level and supports focused modes',async()=>{
 const source=await read('scripts/quiz-engine.js');
 assert.match(source,/mode==='course-short'/);
 assert.match(source,/mode==='formula'/);
 assert.match(source,/difficulty===3&&!hasFormula/);
 assert.match(source,/row\.question_type==='course'/);
});

test('Passer advances immediately and undo redo expose reliable state',async()=>{
 const source=await read('scripts/app.js');
 assert.match(source,/function skipQuestion\(\).*evaluate\(RESULT\.SKIPPED\);newQuestion\(\)/s);
 assert.match(source,/undoStack\.length===0/);
 assert.match(source,/redoStack\.length===0/);
 assert.match(source,/event\.shiftKey\?'redo':'undo'/);
});

test('polished Pencil workspace is precached',async()=>{
 const[polish,sw]=await Promise.all([read('scripts/quiz-polish.js'),read('service-worker.js')]);
 assert.match(polish,/pointerType==='pen'/);
 assert.match(polish,/question-card\{top:50px/);
 assert.match(sw,/\.\/scripts\/quiz-polish\.js/);
 assert.match(sw,/CACHE_VERSION='v\d+'/);
});
