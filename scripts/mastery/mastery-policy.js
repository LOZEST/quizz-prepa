export const MASTERY_POLICY=Object.freeze({
 outcomes:{success:{value:1,initialDays:4,multiplier:2.2,difficulty:-.35},partial:{value:.68,initialDays:1.25,multiplier:1.2,difficulty:.2},failed:{value:0,initialDays:.25,multiplier:.35,difficulty:.7},easy:{value:1,initialDays:4,multiplier:2.2,difficulty:-.35},hard:{value:.68,initialDays:1.25,multiplier:1.2,difficulty:.2},fragile:{value:.42,initialDays:1,multiplier:.75,difficulty:.35}},
 sourceWeight:{'course-question':1,'generated-exercise':1,'trap':.8,'chapter-test':1.15,'legacy-summary':.45},
 gradingWeight:{self:1,teacher:1.2,other:1.1},levelWeight:{1:1,2:1.05,3:1.12,4:.78},
 minStabilityDays:.08,maxStabilityDays:180,decayHalfLifeDays:90,maxSingleEvidenceWeight:1.8
});
export const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
