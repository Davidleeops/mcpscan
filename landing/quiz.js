'use strict';
const questions = [
 {id:'objective',title:'What do you need to move forward?',help:'Choose the outcome that matters most right now.',options:['Prepare for a customer security review','Decide whether we are ready to launch','Review a workflow before client handoff','Understand my setup with a local scan','I’m not sure yet']},
 {id:'stage',title:'Where is your MCP setup today?',help:'Think about the setup you want to review.',options:['Exploring with a local setup','Testing a pilot','Preparing a rollout','Already live']},
 {id:'access',title:'What is the most sensitive access available?',help:'If several apply, choose the most sensitive.',options:['Sample or public data','Internal information','Customer data or production systems','I’m not sure']},
 {id:'actions',title:'Can any connected tool make changes?',help:'For example, update a record, send a message, or run a command.',options:['No, the tools are read only','Yes, but changes require approval','Yes, without approval for each change','I’m not sure']},
 {id:'timing',title:'When do you need the next decision?',help:'This helps put the first useful check in order.',options:['This week','Within 30 days','Later than 30 days','No deadline yet']}
];
const $=id=>document.getElementById(id);
const config=window.MCPScanQuizConfig||{};
const historyKey='mcpscan-funnel-v3';
const privacyVersion='2026-09-25-quiz-v1';
let answers=Array(5).fill(null),view='intro',current=0,leadReceipt=null,plan=null,submissionId=crypto.randomUUID(),previewVersion=0,requestSaved=false;
const initialSubmitLabel='Get my review plan →';
function state(){return {quiz:historyKey,view,current,answers:[...answers]};}
const analyticsSession=crypto.randomUUID();
function track(event,details={}){
 document.dispatchEvent(new CustomEvent('mcpscan:quiz',{detail:{event,...details}}));
 // Anonymous funnel measurement. Never send email, company, or answers text.
 if(!config.endpoint)return;
 const body={action:'event',event,sessionId:analyticsSession};
 if(details.path)body.path=details.path;if(Number.isInteger(details.step))body.step=details.step;
 try{fetch(config.endpoint,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json',...(config.headers||{})},body:JSON.stringify(body)}).catch(()=>{});}catch{}
}
function navigate(next,index=0){view=next;current=index;history.pushState(state(),'');render();}
async function api(payload){
 if(!config.endpoint)throw Error('The plan service is unavailable right now. Please try again later.');
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
 try{const response=await fetch(config.endpoint,{method:'POST',headers:{'Content-Type':'application/json',...config.headers},body:JSON.stringify(payload),signal:controller.signal,credentials:'omit',cache:'no-store'});let result;try{result=await response.json();}catch{throw Error('We could not save your request. Please try again.');}if(!response.ok)throw Error(result.error||'We could not save your request. Please try again.');return result;}catch(error){if(error.name==='AbortError')throw Error('The connection timed out. Your answers are still here. Please try again.');throw error;}finally{clearTimeout(timeout);}
}
function item(text,tag='li'){const node=document.createElement(tag);node.textContent=text;return node;}
function resetLead(){leadReceipt=null;plan=null;requestSaved=false;submissionId=crypto.randomUUID();}
async function showPreview(){
 const version=++previewVersion;$('capture-title').textContent='Your personalized review plan';$('capture-summary').textContent='Your priorities, the evidence to gather, and a practical next step.';$('preview-priority').textContent='Confirm what the connected tools can access before choosing your review scope.';$('preview-contents').replaceChildren(...['Your first three priorities','Checks for your next decision','Where a reviewed report adds value'].map(t=>item(t)));$('capture-error').textContent='';$('capture-submit').disabled=true;
 try{const response=await api({action:'preview',answers});if(version!==previewVersion||view!=='capture')return;const p=response.preview;if(!p?.title||!Array.isArray(p.contents))throw Error('The plan service returned an incomplete response. Please try again.');$('capture-title').textContent=p.title;$('capture-summary').textContent=p.summary;$('preview-priority').textContent=p.priority;$('preview-contents').replaceChildren(...p.contents.map(t=>item(t)));$('capture-submit').disabled=false;track('lead_gate_viewed',{path:p.key});}catch(error){if(version===previewVersion){$('capture-error').textContent=error.message;$('capture-submit').textContent='Try opening my plan again';$('capture-submit').disabled=false;}}
}
function render(focus=true){
 if(view==='result'&&!plan){view='capture';history.replaceState(state(),'');}
 const active={intro:'intro',question:'question-screen',capture:'capture-screen',result:'result-screen'}[view];
 ['intro','question-screen','capture-screen','result-screen'].forEach(id=>$(id).hidden=id!==active);
 if(view==='intro'){if(focus)$('intro-title').focus();return;}
 if(view==='question'){
  const q=questions[current];$('step-label').textContent=`Question ${current+1} of 5`;$('question-title').textContent=q.title;$('question-help').textContent=q.help;$('progress').setAttribute('aria-valuenow',current);$('progress').setAttribute('aria-valuetext',`${current} of 5 questions completed`);$('progress-fill').style.width=`${current/5*100}%`;
  $('options').replaceChildren(...q.options.map((text,index)=>{const label=document.createElement('label');label.className='option';const input=document.createElement('input');input.type='radio';input.name=q.id;input.value=index;input.checked=answers[current]===index;input.addEventListener('change',()=>{if(answers[current]!==index)resetLead();answers[current]=index;history.replaceState(state(),'');$('continue').disabled=false;});label.append(input,item(text,'span'));return label;}));
  $('continue').disabled=answers[current]===null;$('continue').textContent=current===4?'Preview my plan →':'Continue →';$('announcement').textContent=`Question ${current+1} of 5`;if(focus)$('question-title').focus();return;
 }
 if(view==='capture'){showPreview();if(focus)$('capture-title').focus();return;}
 $('result-label').textContent=plan.label;$('result-title').textContent=plan.name;$('result-reason').textContent=plan.reason;$('checklist').replaceChildren(...plan.checks.map(t=>item(t)));
 $('plan-sections').replaceChildren(...plan.sections.map(s=>{const section=document.createElement('section');section.className='plan-section';const ul=document.createElement('ul');ul.append(...s.items.map(t=>item(t)));section.append(item(s.title,'h3'),item(s.body,'p'),ul);return section;}));
 $('plan-boundary').textContent=plan.boundary;$('plan-disclaimer').textContent=plan.disclaimer;$('offer-title').textContent=plan.offer;$('offer-value').textContent=plan.value;$('request-review').textContent=requestSaved?'Review requested':plan.cta;$('request-review').disabled=requestSaved;$('review-status').textContent=requestSaved?'Your review request is saved. MCP Signoff can use your answers to confirm scope and next steps.':'';$('review-error').textContent='';$('status').textContent='';if(focus)$('result-title').focus();
}
$('start').addEventListener('click',()=>{track('quiz_started');navigate('question',0);});
$('question-form').addEventListener('submit',e=>{e.preventDefault();if(answers[current]===null)return;track('question_completed',{question:questions[current].id,step:current});if(current<4)navigate('question',current+1);else navigate(plan?'result':'capture',4);});
$('back').addEventListener('click',()=>navigate(current===0?'intro':'question',Math.max(0,current-1)));
$('capture-back').addEventListener('click',()=>navigate('question',4));$('edit').addEventListener('click',()=>navigate('question',0));
$('restart').addEventListener('click',()=>{answers=Array(5).fill(null);resetLead();$('lead-email').value='';navigate('intro');});
$('capture-form').addEventListener('submit',async e=>{
 e.preventDefault();if(!$('capture-form').reportValidity())return;$('capture-submit').disabled=true;$('capture-submit').textContent='Opening your plan…';$('capture-error').textContent='';const submittedAnswers=JSON.stringify(answers);track('lead_submit_started');
 try{const response=await api({action:'capture',email:$('lead-email').value.trim(),answers,privacyVersion,submissionId,website:$('website').value});if(!response.accepted||!response.receipt||!response.plan)throw Error('We could not confirm your request. Please try again.');if(submittedAnswers!==JSON.stringify(answers))return;leadReceipt=response.receipt;plan=response.plan;track('lead_captured',{path:plan.key});if(view==='capture'){navigate('result',4);track('artifact_viewed',{path:plan.key});}}catch(error){$('capture-error').textContent=error.message;track('lead_capture_failed',{path:plan?.key});}finally{$('capture-submit').disabled=false;$('capture-submit').textContent=initialSubmitLabel;}
});
$('request-review').addEventListener('click',async()=>{
 if(!leadReceipt||requestSaved)return;$('request-review').disabled=true;$('request-review').textContent='Saving your request…';$('review-error').textContent='';
 try{const response=await api({action:'request_review',receipt:leadReceipt});if(!response.accepted)throw Error('We could not confirm your request. Please try again.');requestSaved=true;$('request-review').textContent='Review requested';$('review-status').textContent='Your review request is saved. MCP Signoff can use your answers to confirm scope and next steps.';track('review_requested',{path:plan.key});}catch(error){$('review-error').textContent=error.message;track('review_request_failed',{path:plan?.key});$('request-review').disabled=false;$('request-review').textContent=plan.cta;}
});
function planText(){return ['MCP Signoff',plan.name,'',plan.reason,'','YOUR FIRST THREE PRIORITIES',...plan.checks.map((s,i)=>`${i+1}. ${s}`),'',...plan.sections.flatMap(s=>[s.title,s.body,...s.items.map(t=>'- '+t),'']),'WHERE THIS PLAN STOPS',plan.boundary,'',plan.offer,plan.value,'Next step: Return to your open plan and select "'+plan.cta+'" to request a scoped review.','',plan.disclaimer].join('\n');}
$('download').addEventListener('click',()=>{if(!plan||!leadReceipt)return;const url=URL.createObjectURL(new Blob([planText()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=plan.name.replace(/[^a-zA-Z0-9]+/g,'-')+'.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);$('status').textContent='Your full plan download has started.';track('artifact_downloaded',{path:plan.key});});
$('print-plan').addEventListener('click',()=>{if(plan){track('artifact_printed',{path:plan.key});window.print();}});
window.addEventListener('popstate',e=>{const s=e.state;if(s?.quiz!==historyKey)return;if(JSON.stringify(answers)!==JSON.stringify(s.answers))resetLead();({view,current,answers}=s);render();});
if(history.state?.quiz===historyKey)({view,current,answers}=history.state);else history.replaceState(state(),'');render(false);track('page_viewed');
