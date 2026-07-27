import test from'node:test';
import assert from'node:assert/strict';
import{readFile}from'node:fs/promises';
import{accountOverview,buildAdaptivePlan,dayKey,normalizeEvents,notionStatus}from'../scripts/planner/study-plan.js';

test('notion status distinguishes unseen, weak, due and solid',()=>{
 const now=Date.parse('2026-08-01T10:00:00Z'),notion={id:'powers-product'};
 assert.equal(notionStatus({},notion,now).key,'unseen');
 assert.equal(notionStatus({masteryStates:{'powers-product':{masteryScore:35,evidenceCount:2,nextReviewAt:'2026-08-10T00:00:00Z'}}},notion,now).key,'weak');
 assert.equal(notionStatus({masteryStates:{'powers-product':{masteryScore:80,evidenceCount:4,nextReviewAt:'2026-07-31T00:00:00Z'}}},notion,now).key,'due');
 assert.equal(notionStatus({masteryStates:{'powers-product':{masteryScore:82,evidenceCount:4,nextReviewAt:'2026-08-10T00:00:00Z'}}},notion,now).key,'solid');
});

test('planner prioritizes due work and spreads an exam chapter',()=>{
 const now=new Date('2026-08-01T10:00:00'),state={masteryStates:{'powers-product':{masteryScore:30,evidenceCount:2,nextReviewAt:'2026-08-01T08:00:00'}}},events=[{id:'exam-1',title:'Contrôle puissances',type:'exam',date:'2026-08-05',chapterId:'powers'}];
 const plan=buildAdaptivePlan({state,events,now,days:7,maxPerDay:4});
 assert.equal(plan.days.length,7);
 assert.ok(plan.days[0].tasks.some(task=>task.type==='review'&&task.notionId==='powers-product'));
 assert.ok(plan.days.flatMap(day=>day.tasks).some(task=>task.type==='exam'));
 assert.ok(plan.days.every(day=>day.tasks.length<=4));
});

test('account overview reports coverage and gaps',()=>{const overview=accountOverview({masteryStates:{'powers-product':{masteryScore:75,evidenceCount:3,nextReviewAt:'2099-01-01T00:00:00Z'}}},Date.parse('2026-08-01'));assert.ok(overview.coverage>0);assert.ok(overview.unseen.length>0);assert.equal(overview.average,75)});
test('calendar normalization is deterministic and sorted',()=>{const events=normalizeEvents([{id:'b',title:' B ',type:'exam',date:'2026-09-02',chapterId:'powers'},{id:'a',title:'A',type:'revision',date:'2026-08-02',chapterId:'powers'}]);assert.deepEqual(events.map(x=>x.id),['a','b']);assert.equal(events[1].title,'B');assert.equal(dayKey('2026-08-02'),'2026-08-02')});
test('plan page stores only account-local calendar data',async()=>{const source=await readFile(new URL('../scripts/pages/plan-page.js',import.meta.url),'utf8');assert.match(source,/workspace\.write\('study-plan'/);assert.match(source,/workspace\.write\('active-session'/);assert.doesNotMatch(source,/localStorage|supabase|fetch\(/)});
