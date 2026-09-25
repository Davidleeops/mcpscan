import {buildPlan, preview, validAnswers} from './quiz-content.mjs';
export const PRIVACY_VERSION='2026-09-25-quiz-v1';
export const FUNNEL_EVENTS=['page_viewed','quiz_started','question_completed','lead_gate_viewed','lead_submit_started','lead_captured','lead_capture_failed','artifact_viewed','artifact_downloaded','artifact_printed','review_requested','review_request_failed','offer_clicked'];
const PATHS=['enterprise','launch','agency','selfServe','inventory'];
export async function handleQuiz(payload,store){
 if(!payload||typeof payload!=='object')return {status:400,body:{error:'Invalid request.'}};
 if(payload.action==='preview'){
  if(!validAnswers(payload.answers))return {status:400,body:{error:'Complete the five questions first.'}};
  return {status:200,body:{preview:preview(payload.answers)}};
 }
 if(payload.action==='capture'){
  const email=typeof payload.email==='string'?payload.email.trim().toLowerCase():'';
  if(email.length>254||! /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))return {status:400,body:{error:'Enter a valid email address.'}};
  if(!validAnswers(payload.answers))return {status:400,body:{error:'Complete the five questions first.'}};
  if(payload.privacyVersion!==PRIVACY_VERSION)return {status:400,body:{error:'Refresh the page to review the current privacy notice.'}};
  if(payload.website)return {status:400,body:{error:'Unable to process this request.'}};
  if(typeof payload.submissionId!=='string'||!/^[a-f0-9-]{36}$/.test(payload.submissionId))return {status:400,body:{error:'Refresh the page and try again.'}};
  const plan=buildPlan(payload.answers);
  const receipt=await store.capture({submissionId:payload.submissionId,email,answers:payload.answers,path:plan.key,privacyVersion:PRIVACY_VERSION,source:'mcpscan-quiz',emailVerified:false});
  return {status:200,body:{accepted:true,receipt,plan}};
 }
 if(payload.action==='request_review'){
  if(typeof payload.receipt!=='string'||!/^[a-f0-9]{64}$/.test(payload.receipt))return {status:400,body:{error:'Open your plan before requesting a review.'}};
  const saved=await store.requestReview(payload.receipt);
  return saved?{status:200,body:{accepted:true}}:{status:404,body:{error:'Your session has expired. Reopen your plan to request a review.'}};
 }
 if(payload.action==='event'){
  // Anonymous funnel measurement. No email, company, or free text is accepted.
  const name=payload.event, session=payload.sessionId;
  if(!FUNNEL_EVENTS.includes(name)||typeof session!=='string'||!/^[a-f0-9-]{36}$/.test(session))return {status:400,body:{error:'Invalid event.'}};
  const path=PATHS.includes(payload.path)?payload.path:null;
  const step=Number.isInteger(payload.step)&&payload.step>=0&&payload.step<10?payload.step:null;
  if(!store.event)return {status:202,body:{accepted:false}};
  await store.event({event:name,sessionId:session,path,step});
  return {status:202,body:{accepted:true}};
 }
 return {status:400,body:{error:'Unknown request.'}};
}
