import test from 'node:test';
import assert from 'node:assert/strict';
import {handleQuiz,PRIVACY_VERSION} from './quiz-api.mjs';
import {validAnswers,buildPlan} from './quiz-content.mjs';
const payload={action:'capture',email:'funnel-test@example.com',answers:[0,2,2,2,0],submissionId:'11111111-1111-4111-8111-111111111111',privacyVersion:PRIVACY_VERSION,website:''};
test('preview contains useful proof but not the full artifact or lead data',async()=>{
 const response=await handleQuiz({action:'preview',answers:payload.answers},{});
 assert.equal(response.status,200);assert.ok(response.body.preview.priority);assert.equal(response.body.plan,undefined);assert.equal(response.body.receipt,undefined);
});
test('artifact is returned only after durable capture succeeds',async()=>{
 let saved=false;
 const response=await handleQuiz(payload,{capture:async r=>{assert.equal(r.emailVerified,false);assert.equal(r.email,payload.email);assert.equal(r.privacyVersion,PRIVACY_VERSION);saved=true;return 'a'.repeat(64);}});
 assert.ok(saved);assert.ok(response.body.accepted);assert.equal(response.body.plan.key,'enterprise');assert.equal(response.body.plan.sections.length,2);
 await assert.rejects(()=>handleQuiz(payload,{capture:async()=>{throw Error('Storage unavailable');}}),/Storage unavailable/);
});
test('invalid inputs never reach storage',async()=>{
 const store={capture:()=>{throw Error('Must not write');}};
 for(const change of [{email:'invalid'},{answers:[0]},{answers:[0,0,0,0,99]},{privacyVersion:'old'},{website:'spam'},{submissionId:'bad'}])assert.equal((await handleQuiz({...payload,...change},store)).status,400);
});
test('review requests need a receipt and storage confirmation',async()=>{
 assert.equal((await handleQuiz({action:'request_review',receipt:'bad'},{})).status,400);
 assert.equal((await handleQuiz({action:'request_review',receipt:'a'.repeat(64)},{requestReview:async()=>false})).status,404);
 assert.equal((await handleQuiz({action:'request_review',receipt:'a'.repeat(64)},{requestReview:async()=>true})).body.accepted,true);
});
test('all answer combinations produce complete artifacts with honest boundaries',()=>{
 let count=0;
 for(let a=0;a<5;a++)for(let b=0;b<4;b++)for(let c=0;c<4;c++)for(let d=0;d<4;d++)for(let e=0;e<4;e++){
  const answers=[a,b,c,d,e];assert.ok(validAnswers(answers));const plan=buildPlan(answers);assert.ok(plan.name);assert.equal(plan.checks.length,3);assert.equal(plan.sections.length,2);assert.ok(plan.cta);assert.ok(plan.disclaimer);if(a===4||c===3||d===3)assert.equal(plan.key,'inventory');assert.ok(!JSON.stringify(plan).includes(String.fromCharCode(8212)));count++;
 }
 assert.equal(count,1280);
});

test('funnel events accept only anonymous whitelisted fields',async()=>{
 const seen=[];const store={event:async e=>seen.push(e)};const sid='22222222-2222-4222-8222-222222222222';
 assert.equal((await handleQuiz({action:'event',event:'quiz_started',sessionId:sid},store)).status,202);
 assert.equal((await handleQuiz({action:'event',event:'lead_captured',sessionId:sid,path:'agency',email:'x@y.com'},store)).status,202);
 assert.equal((await handleQuiz({action:'event',event:'made_up',sessionId:sid},store)).status,400);
 assert.equal((await handleQuiz({action:'event',event:'quiz_started',sessionId:'bad'},store)).status,400);
 assert.equal(seen.length,2);assert.ok(!JSON.stringify(seen).includes('@'));assert.equal(seen[1].path,'agency');
});
