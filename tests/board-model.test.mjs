import test from'node:test';
import assert from'node:assert/strict';
import{circleCandidate,createStroke,deserializeScene,detectScribble,pathLength,sceneTransform,serializeScene,straightCandidate,strokeTouchesGesture,toCircleStroke,toStraightStroke,transformPoint,VectorHistory}from'../scripts/board-model.js';
const points=(values,step=10)=>values.map(([x,y],i)=>({x,y,pressure:.2+i/values.length*.7,time:i*step}));
const stroke=(values,extra={})=>createStroke({id:extra.id||`s-${Math.random()}`,points:points(values),width:extra.width||3,...extra});

test('création, pression, épaisseur et sérialisation restent vectorielles',()=>{const s=stroke([[1,2],[20,8]],{id:'one',width:7});assert.equal(s.tool,'pen');assert.equal(s.width,7);assert.equal(s.points[1].pressure,.55);assert.deepEqual(s.bounds,{x:1,y:2,width:19,height:6});const restored=deserializeScene(serializeScene({space:{width:100,height:80},strokes:[s]}));assert.deepEqual(restored.strokes[0],s);assert.equal(restored.space.width,100)});

test('coordonnées invalides, NaN et Infinity sont refusées',()=>{for(const value of [NaN,Infinity,-Infinity])assert.throws(()=>stroke([[0,0],[value,2]]),/invalides/)});

test('historique annule et rétablit ajout, suppression et effacement complet',()=>{const a=stroke([[0,0],[20,0]],{id:'a'}),b=stroke([[0,10],[20,10]],{id:'b'}),h=new VectorHistory();h.perform({added:[a],removed:[]});h.perform({added:[b],removed:[]});h.perform({added:[],removed:[a,b]});assert.equal(h.strokes.length,0);h.undo();assert.deepEqual(h.strokes.map(s=>s.id),['a','b']);h.undo();assert.deepEqual(h.strokes.map(s=>s.id),['a']);h.redo();assert.deepEqual(h.strokes.map(s=>s.id),['a','b'])});

test('trait presque droit admissible et refus des traits courts ou courbes',()=>{assert.equal(straightCandidate(points([[0,0],[30,1],[60,-1],[100,0]])),true);assert.equal(straightCandidate(points([[0,0],[10,0],[20,0]])),false);assert.equal(straightCandidate(points([[0,0],[30,40],[60,-30],[100,0]])),false)});

test('transformation en droite et déplacement de son extrémité',()=>{const free=stroke([[0,0],[50,1],[100,0]],{id:'line'}),line=toStraightStroke(free,{x:120,y:40,pressure:.8,time:600});assert.equal(line.type,'line');assert.equal(line.points.length,2);assert.deepEqual(line.points[1],{x:120,y:40,pressure:.8,time:600});assert.equal(pathLength(line.points),Math.hypot(120,40))});

const roundPoints=({cx=100,cy=100,r=60,wobble=0,start=0,end=Math.PI*2,steps=36}={})=>points(Array.from({length:steps+1},(_,i)=>{const angle=start+(end-start)*i/steps,rr=r+(i%3-1)*wobble;return[cx+Math.cos(angle)*rr,cy+Math.sin(angle)*rr]}));
test('cercle valide et cercle imparfait acceptable sont reconnus',()=>{assert.equal(circleCandidate(roundPoints()),true);assert.equal(circleCandidate(roundPoints({wobble:6})),true)});
test('geste ouvert et petit gribouillage ne sont pas reconnus comme cercles',()=>{assert.equal(circleCandidate(roundPoints({end:Math.PI*1.5})),false);assert.equal(circleCandidate(roundPoints({r:12,wobble:2})),false)});
test('cercle vectoriel se sérialise, se restaure, s’annule et se rétablit',()=>{const circle=toCircleStroke(createStroke({id:'circle',points:roundPoints({wobble:4}),width:4}));assert.equal(circle.type,'circle');assert.equal(circle.points.length,49);const restored=deserializeScene(serializeScene({space:{width:400,height:300},strokes:[circle]})).strokes[0];assert.deepEqual(restored,circle);const history=new VectorHistory();history.perform({added:[circle],removed:[]});assert.equal(history.strokes[0].type,'circle');history.undo();assert.equal(history.strokes.length,0);history.redo();assert.equal(history.strokes[0].type,'circle')});

test('redimensionnements et dix rotations conservent les proportions',()=>{const space={width:1000,height:700},a={x:100,y:200},b={x:500,y:400};for(let i=0;i<10;i++){const [w,h]=i%2?[700,1000]:[1000,700],t=sceneTransform(space,w,h),aa=transformPoint(a,t),bb=transformPoint(b,t);assert.ok(Math.abs(Math.hypot(bb.x-aa.x,bb.y-aa.y)-Math.hypot(400,200)*t.scale)<1e-9);assert.equal((bb.x-aa.x)/(bb.y-aa.y),2)}});

test('griffonnage dense supprime uniquement les traits réellement touchés et s’annule en une action',()=>{const target=stroke([[20,30],[80,30]],{id:'target'}),safe=stroke([[200,200],[260,200]],{id:'safe'});const zig=[];for(let i=0;i<18;i++)zig.push([15+i*4,i%2?48:15]);const gesture=stroke(zig,{id:'gesture'}),result=detectScribble(gesture,[target,safe]);assert.equal(result.isScribble,true);assert.deepEqual(result.touched.map(s=>s.id),['target']);const h=new VectorHistory([target,safe]);h.perform({added:[],removed:result.touched});assert.deepEqual(h.strokes.map(s=>s.id),['safe']);h.undo();assert.deepEqual(new Set(h.strokes.map(s=>s.id)),new Set(['target','safe']))});

test('lettre, cercle simple, courbe de graphique et geste dans le vide sont conservés',()=>{const writing=stroke([[20,30],[80,30]]);const letter=stroke([[0,40],[20,0],[40,40],[10,20],[30,20]]),circle=stroke([[20,0],[40,20],[20,40],[0,20],[20,0]]),curve=stroke([[0,40],[20,25],[40,15],[60,10],[80,8]]),empty=stroke([[200,200],[210,190],[220,205],[230,190],[240,205],[250,190]]);for(const gesture of [letter,circle,curve,empty])assert.equal(detectScribble(gesture,[writing]).isScribble,false)});

test('collision exige un recouvrement réel, pas seulement des boîtes proches',()=>{const target=stroke([[0,0],[100,0]]),far=stroke([[0,40],[100,40]]);assert.equal(strokeTouchesGesture(target,far,5),false)});
