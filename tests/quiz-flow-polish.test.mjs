import test from'node:test';
import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';
import{richTextToSegments,cleanFrenchText}from'../scripts/math/math-segments.js';
const read=file=>readFile(new URL(`../${file}`,import.meta.url),'utf8');

test('math delimiters are converted into safe structured segments',()=>{const segments=richTextToSegments('Calculer \\(\\frac{1}{x}\\).\nPuis écrire \\[x^2+1\\]');assert.deepEqual(segments.map(x=>x.type),['text','math','text','break','text','math']);assert.equal(segments[1].value,'\\frac{1}{x}');assert.equal(segments.at(-1).display,true)});
test('French copy cleanup repairs common spacing problems',()=>{assert.equal(cleanFrenchText('Une phrase  mal écrite ,avec un espace !'),'Une phrase mal écrite, avec un espace !')});

test('session page exposes exactly the four canonical sessions',async()=>{const source=await read('scripts/pages/session-page.js');for(const marker of['Révision du jour','Consolidation des points faibles','Révision libre','Test de chapitres'])assert.match(source,new RegExp(marker));for(const removed of['Cours express','Formules essentielles','Révision intelligente','Découvrir de nouvelles notions'])assert.doesNotMatch(source,new RegExp(removed))});

test('quiz engine separates focused question types from difficulty',async()=>{const source=await read('scripts/quiz-engine.js');assert.match(source,/QUESTION_TYPES\.REFLEX/);assert.match(source,/questionType/);assert.match(source,/generateReflex/);assert.match(source,/const levels=\[1,2,4\]/);assert.match(source,/typeOf\(q\)/);assert.doesNotMatch(source,/adaptiveDifficulty[^]*return 3/)});

test('Passer advances immediately and undo redo expose reliable state',async()=>{const source=await read('scripts/app.js');assert.match(source,/function skipQuestion\(\).*evaluate\(RESULT\.SKIPPED\);newQuestion\(\)/s);assert.match(source,/undoStack\.length===0/);assert.match(source,/redoStack\.length===0/);assert.match(source,/event\.shiftKey\?'redo':'undo'/)});

test('polished Pencil workspace is precached',async()=>{const[polish,sw]=await Promise.all([read('scripts/quiz-polish.js'),read('service-worker.js')]);assert.match(polish,/pointerType==='pen'/);assert.match(polish,/question-card\{top:50px/);assert.match(sw,/\.\/scripts\/quiz-polish\.js/);assert.match(sw,/CACHE_VERSION='v\d+'/)});
