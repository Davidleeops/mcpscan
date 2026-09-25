export const questions = [
 {id:'objective',title:'What do you need to move forward?',help:'Choose the outcome that matters most right now.',options:['Prepare for a customer security review','Decide whether we are ready to launch','Review a workflow before client handoff','Understand my setup with a local scan','I’m not sure yet']},
 {id:'stage',title:'Where is your MCP setup today?',help:'Think about the setup you want to review.',options:['Exploring with a local setup','Testing a pilot','Preparing a rollout','Already live']},
 {id:'access',title:'What is the most sensitive access available?',help:'If several apply, choose the most sensitive.',options:['Sample or public data','Internal information','Customer data or production systems','I’m not sure']},
 {id:'actions',title:'Can any connected tool make changes?',help:'For example, update a record, send a message, or run a command.',options:['No, the tools are read only','Yes, but changes require approval','Yes, without approval for each change','I’m not sure']},
 {id:'timing',title:'When do you need the next decision?',help:'This helps put the first useful check in order.',options:['This week','Within 30 days','Later than 30 days','No deadline yet']}
];
const paths = {
 enterprise:{label:'Customer security review',title:'Prepare evidence for your security review.',reason:'You’re preparing for customer review. Make the scope, access boundaries, and outstanding findings easy to inspect.',checks:['List the connected tools, systems, and people responsible for approving access.','Record permissions and approval boundaries with evidence your reviewer can inspect.','Give each finding an owner and a next step. State what remains outside the review.'],cta:'Review the audit scope',detailsTitle:'Define the review before sharing materials',detailsBody:'Start with the MCP servers, clients, environments, and connected systems that need review. Agree which access paths and tool actions should be examined.',detailsNext:'A useful report separates observed findings from assumptions and records remediation ownership. An MCP review is not a compliance certification.'},
 launch:{label:'Launch readiness',title:'Make your next rollout decision clearer.',reason:'You’re preparing a rollout decision. Establish what tools can reach and which findings need attention before access expands.',checks:['Inventory the MCP servers, environments, and connected tools in the rollout.','Confirm the permissions and approval requirements for actions that change systems.','Record the findings to resolve before launch, their owners, and how fixes will be checked.'],cta:'See the launch review',detailsTitle:'A practical launch review',detailsBody:'Review the proposed rollout scope, baseline findings, and permissions together. Separate issues that block rollout from improvements that can be scheduled.',detailsNext:'Agree who can approve the rollout and what evidence they need. Verify fixes before expanding access.'},
 agency:{label:'Client handoff',title:'Make the handoff easier to review.',reason:'You’re preparing a client workflow. Document the reviewed scope, permitted actions, and unresolved findings before handoff.',checks:['Confirm the client-authorized systems and the workflow included in the review.','Document permitted actions, approval steps, and who can revoke access.','Give the client a record of findings, remaining limits, and ownership after handoff.'],cta:'Open the handoff checklist',detailsTitle:'Before the client takes ownership',detailsBody:'Confirm who operates the workflow, who approves access changes, and who responds if an unexpected action occurs.',detailsNext:'Include the reviewed configuration version, unresolved findings, rollback steps, and the agreed handoff decision. Download the checklist below to keep this record.'},
 selfServe:{label:'Local baseline',title:'Start with a local baseline.',reason:'You want to inspect the setup yourself. Use a baseline scan to identify findings and decide what needs manual review.',checks:['Identify the MCP configuration you are authorized to inspect and keep a backup.','Review scanner findings against the actual tools, permissions, and environment.','Record anything the scan cannot verify and decide whether manual review is needed.'],cta:'View scanner setup',detailsTitle:'Prepare your first local scan',detailsBody:'Use the scanner setup instructions on the MCPScan home page. Run it only against a configuration you are authorized to inspect and review the output before sharing it.',detailsNext:'A static scan does not establish runtime behavior or prove that a setup is secure.'},
 inventory:{label:'Inventory first',title:'Start by making access visible.',reason:'A few details are still unclear. Establish what is connected and what it can do before choosing a review scope.',checks:['List the MCP servers, clients, and connected systems you know about.','Ask the system owners to confirm accessible data, permitted actions, and approval requirements.','Use the confirmed inventory to choose the next review and identify any gaps that remain.'],cta:'See the inventory checklist',detailsTitle:'Build a useful access inventory',detailsBody:'For each connection, record the system, environment, owner, accessible data, and allowed actions. Mark unknown permissions as unverified.',detailsNext:'Confirm the inventory with the people responsible for the systems before expanding access. Download this checklist as your starting point.'}
};

export function recommendation(answers){
 const uncertain=answers[0]===4 || answers[2]===3 || answers[3]===3;
 const key=uncertain?'inventory':['enterprise','launch','agency','selfServe'][answers[0]];
 const item=paths[key], checks=[...item.checks];
 if(!uncertain && answers[2]===2)checks[0]='Map access to customer data and production systems, including the owner and permission boundary for each connection.';
 if(!uncertain && answers[3]===2)checks[1]='Review tools that can make changes without approval. Confirm which actions need limits or an approval step.';
 let context=answers[1]===3?' Your setup is already live, so confirm the current access boundaries before expanding use.':answers[1]===0?' Start with the local setup before adding more connections.':'';
 context+=answers[4]===0?' With a decision due this week, identify the person who can confirm the review scope first.':answers[4]===1?' Use the next 30 days to gather evidence and resolve the findings that affect the decision.':'';
 return {...item,key,checks,reason:item.reason+context};
}

const artifacts = {
 enterprise: {
  name: 'Customer Security Review Brief',
  preview: 'Turn the access questions your reviewer will ask into a clear evidence request.',
  contents: ['Evidence to gather before review','Questions to resolve with system owners','A scope for a reviewed findings packet'],
  sections: [
   {title:'Prepare evidence a reviewer can inspect',body:'For each MCP server, connect the permission claim to a configuration, tool definition, or test record. Include the environment and review date. A list of tools alone does not demonstrate how access is controlled.',items:['Server and client inventory, with a named system owner.','Permitted reads and writes, including approval and revocation paths.','Open findings with evidence, remediation owner, and validation status.']},
   {title:'Make the acceptance decision explicit',body:'Ask the reviewer which evidence is needed to accept the proposed access. Separate verified controls from controls the team intends to implement.',items:['Which systems and environments are included in the decision?','What can the evidence establish, and what remains untested?','Who accepts the remaining risk and records the decision?']}
  ],
  boundary:'If customer review depends on claims that have not been checked, a checklist alone will not close that evidence gap.',
  offer:'Turn this outline into a reviewed evidence packet',
  value:'A scoped MCPScan review adds findings supported by the submitted materials, remediation priorities, and a report your reviewer can inspect.',
  cta:'Request my evidence review'
 },
 launch: {
  name:'MCP Launch Decision Plan',
  preview:'Identify which access questions could hold up your rollout and what to verify first.',
  contents:['Your first three review priorities','A practical launch decision checklist','The evidence a scoped review should produce'],
  sections:[
   {title:'Establish the rollout boundary',body:'Describe the exact version, environments, and connected tools included in the next rollout. Review against that boundary rather than a future architecture.',items:['Confirm the permissions actually granted to each connection.','Identify actions that change production state, and how approval works.','Assign an owner to stop the workflow or revoke access if behavior differs from expectations.']},
   {title:'Make a release decision from evidence',body:'A successful scan is one input. The person approving rollout also needs to understand unresolved findings and what the scan cannot verify.',items:['For each release-blocking finding, name the owner and required fix.','Recheck the changed configuration or control before rollout.','Record the remaining limitations and the person accepting them.']}
  ],
  boundary:'If tools can reach sensitive systems or make changes without understood approval boundaries, establish those boundaries before expanding access.',
  offer:'Get a reviewed launch decision packet',
  value:'A scoped MCPScan review adds prioritized findings, a remediation discussion, and agreed validation of fixes so your team has evidence for the rollout decision.',
  cta:'Request my launch review'
 },
 agency:{
  name:'Client Workflow Handoff Guide',
  preview:'Give your client a clear account of what was reviewed, what can change, and who owns it.',
  contents:['Client handoff evidence checklist','Access and operating ownership checks','A scope for independent workflow review'],
  sections:[
   {title:'Define what the client is accepting',body:'Describe the workflow, client-authorized systems, and version reviewed. Keep the evidence specific to this client implementation.',items:['Record allowed actions and the controls around write access.','Identify who grants, reviews, and revokes each connection.','Document known limitations and unresolved findings before handoff.']},
   {title:'Transfer operating responsibility clearly',body:'A handoff should make the next action obvious if access changes or the workflow behaves unexpectedly.',items:['Confirm the operating owner and the client decision owner.','Describe how to pause the workflow and revoke access.','Keep a record of fixes and the conditions that require a new review.']}
  ],
  boundary:'A reusable delivery checklist helps organize work. It does not establish that this client’s specific permissions or workflow have been reviewed.',
  offer:'Add an independent review before handoff',
  value:'MCPScan can review an agreed client workflow and produce findings, limitations, and remediation priorities that support a more defensible handoff.',
  cta:'Request a client workflow review'
 },
 selfServe:{
  name:'Local Scan and Escalation Guide',
  preview:'Get a local baseline, interpret the findings, and know when a manual review adds value.',
  contents:['First-scan preparation checklist','How to interpret and validate findings','When to move beyond a local baseline'],
  sections:[
   {title:'Make the first scan useful',body:'Start with a copy of an authorized MCP configuration. Follow the scanner setup instructions, inspect the output locally, and keep secrets out of any shared report.',items:['Record which configuration and version were scanned.','Compare each finding with the actual permissions and environment.','Record controls or behavior that a configuration scan cannot verify.']},
   {title:'Know when to escalate',body:'Use the baseline to decide what needs a person to review it. A scan result is not a runtime test or an approval to deploy.',items:['Escalate unexplained write access or sensitive system exposure.','Get reviewed evidence when a customer or launch owner needs an acceptance decision.','Recheck findings after changes rather than relying on an old report.']}
  ],
  boundary:'A local scan is a starting point. Manual review becomes useful when findings require context or another person needs evidence to approve access.',
  offer:'Need help interpreting the findings?',
  value:'Request a scoped review if your baseline leaves access questions unresolved or your team needs a reviewed report before rollout.',
  cta:'Request a findings review'
 },
 inventory:{
  name:'MCP Access Inventory Plan',
  preview:'Resolve unknown access before choosing an audit or expanding the rollout.',
  contents:['What to inventory first','Questions for system owners','A review scope built from confirmed facts'],
  sections:[
   {title:'Make the unknowns specific',body:'Build an inventory of the MCP clients, servers, and connected systems. Treat a permission as unverified until the responsible owner or inspectable evidence confirms it.',items:['For every connection, record the environment and system owner.','Separate data access from actions that can change system state.','Identify where approval, logging, or revocation behavior is unknown.']},
   {title:'Turn the inventory into a review scope',body:'Start with the systems that affect the next real decision. Keep missing evidence visible rather than treating absence of findings as proof of safety.',items:['Ask each owner to confirm the granted permissions and approval rules.','Record which systems or actions remain outside the review.','Choose the next review after the important access gaps are understood.']}
  ],
  boundary:'An unclear inventory makes it difficult to scope an audit. Resolving the most important unknowns first prevents a review from answering the wrong question.',
  offer:'Turn the unknowns into a practical review scope',
  value:'Request a scope review to identify the materials needed and whether MCPScan fits the systems and decision you need to assess.',
  cta:'Request help scoping my review'
 }
};
export function preview(answers){const r=recommendation(answers);const a=artifacts[r.key];return {key:r.key,label:r.label,title:a.name,summary:a.preview,priority:r.checks[0],contents:a.contents};}
export function buildPlan(answers){const r=recommendation(answers);return {...r,...artifacts[r.key],answers:questions.map((q,i)=>({question:q.title,answer:q.options[answers[i]]})),disclaimer:'Based on your answers, not a scan or verification of your setup. Review only systems you are authorized to assess.'};}
export function validAnswers(a){return Array.isArray(a)&&a.length===questions.length&&a.every((v,i)=>Number.isInteger(v)&&v>=0&&v<questions[i].options.length);}
