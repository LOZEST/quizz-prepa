import test from'node:test';
import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';
import{createStroke,normalizeScene,serializeScene,deserializeScene}from'../scripts/board-model.js';
import{createBoardShape}from'../scripts/board-shapes.js';
import{DrawingBoard}from'../scripts/board.js';
import{TestPageLock}from'../scripts/tests/ui/test-page-lock.js';

const ink=createStroke({id:'ink',points:[{x:1,y:1},{x:8,y:9}],width:2});
const shape=createBoardShape({id:'shape',kind:'rectangle',x:30,y:30,width:30,height:30});
const scene=strokes=>({version:2,space:{width:100,height:80},strokes});

test('capture retourne toujours une scène complète pour traits, formes et dessin mixte',()=>{for(const strokes of[[],[ink],[shape],[ink,shape]]){const board=Object.assign(Object.create(DrawingBoard.prototype),{space:{width:100,height:80},history:{strokes}}),captured=board.capture();assert.equal(captured.version,2);assert.deepEqual(captured.space,{width:100,height:80});assert.ok(Array.isArray(captured.strokes));assert.equal(captured.strokes.length,strokes.length)}});

test('brouillons null, sans strokes et partiellement corrompus sont réparés sans perdre les objets valides',()=>{const empty=normalizeScene(null,{fallbackSpace:{width:200,height:100}});assert.deepEqual(empty.scene.strokes,[]);assert.deepEqual(empty.scene.space,{width:200,height:100});assert.ok(empty.issues.length);const missing=normalizeScene({version:1,space:{width:10,height:20}});assert.deepEqual(missing.scene.strokes,[]);const partial=normalizeScene({version:2,space:{width:100,height:80},objects:[ink,{bad:true},shape]});assert.deepEqual(partial.scene.strokes.map(x=>x.id),['ink','shape']);assert.match(partial.issues.join(' '),/endommagé/) });

test('ancienne scène v1 et scène v2 mixte migrent vers le format courant',()=>{const old=deserializeScene({version:1,space:{width:100,height:80},strokes:[ink]});assert.equal(old.strokes[0].id,'ink');const migrated=JSON.parse(serializeScene(old));assert.equal(migrated.version,2);assert.ok(Array.isArray(migrated.objects));assert.equal(deserializeScene(serializeScene(scene([ink,shape]))).strokes.length,2)});

class Target{constructor(){this.listeners=new Map();this.body={classList:{values:new Set(),add:x=>this.body.classList.values.add(x),remove:x=>this.body.classList.values.delete(x)}}}addEventListener(type,fn){this.listeners.set(type,fn)}removeEventListener(type){this.listeners.delete(type)}fire(type,event){this.listeners.get(type)?.(event)}}
const event=interactive=>{let prevented=false;return{touches:[],target:{closest:selector=>interactive&&selector.includes('button')?{}:selector==='#testApp'?{}:null},preventDefault(){prevented=true},get prevented(){return prevented}}};
test('verrou iPad bloque pinch et double-tap hors contrôles, mais jamais un bouton, puis se retire',()=>{const document=new Target(),times=[1000,1200,1400,1600],lock=new TestPageLock({document,now:()=>times.shift()});lock.enable();const gesture=event(false);document.fire('gesturestart',gesture);assert.equal(gesture.prevented,true);const first=event(false),second=event(false);document.fire('touchend',first);document.fire('touchend',second);assert.equal(second.prevented,true);const button1=event(true),button2=event(true);document.fire('touchend',button1);document.fire('touchend',button2);assert.equal(button2.prevented,false);lock.disable();assert.equal(document.listeners.size,0);assert.equal(document.body.classList.values.has('test-active'),false)});

test('le mode test utilise des dialogues internes, expose les erreurs et ne contient aucun confirm natif',async()=>{const[js,html,css]=await Promise.all(['../scripts/tests/ui/test-app.js','../index.html','../styles/app.css'].map(path=>readFile(new URL(path,import.meta.url),'utf8')));assert.doesNotMatch(js,/\bconfirm\s*\(/);assert.match(html,/data-test-dialog/);assert.match(html,/Continuer le test/);assert.match(js,/Rendre définitivement/);assert.match(js,/Test abandonné/);assert.match(html,/role="alert"/);assert.match(css,/body\.test-active\{position:fixed/);for(const action of["'prev'","'next'","'jump'","'submit'","'abandon'"])assert.ok(js.includes(action),`action absente ${action}`);assert.match(js,/automatic:true/)});
