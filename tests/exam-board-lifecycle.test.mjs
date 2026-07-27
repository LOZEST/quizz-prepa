import test from'node:test';
import assert from'node:assert/strict';
import{ExamBoardLifecycle}from'../scripts/tests/ui/exam-board-lifecycle.js';

const scene=id=>({version:1,space:{width:100,height:100},strokes:[{id}]});
function fakeBoard(){return{current:scene('quiz'),readOnly:true,capture(){return structuredClone(this.current)},restore(value){this.current=value?structuredClone(value):{version:1,space:{width:100,height:100},strokes:[]}},setReadOnly(value){this.readOnly=value}}}

test('ouvrir et démarrer un test réactivent immédiatement le tableau',()=>{const board=fakeBoard(),lifecycle=new ExamBoardLifecycle(board);lifecycle.open();assert.equal(board.readOnly,false);lifecycle.start();assert.equal(board.readOnly,false);assert.equal(board.current.strokes.length,0)});
test('finaliser ou abandonner réactive immédiatement l’écriture',()=>{const board=fakeBoard(),lifecycle=new ExamBoardLifecycle(board);lifecycle.lock();assert.equal(board.readOnly,true);lifecycle.finish();assert.equal(board.readOnly,false);lifecycle.lock();lifecycle.finish();assert.equal(board.readOnly,false)});
test('quitter le test restaure le dessin normal sans perdre le brouillon capturé',()=>{const board=fakeBoard(),lifecycle=new ExamBoardLifecycle(board);lifecycle.open();const saved=structuredClone(lifecycle.normalDraft);lifecycle.start();board.current=scene('test-draft');const testDraft=board.capture();lifecycle.lock();lifecycle.exit();assert.equal(board.readOnly,false);assert.deepEqual(board.current,scene('quiz'));assert.deepEqual(saved,scene('quiz'));assert.deepEqual(testDraft,scene('test-draft'))});
