// Deploy with JWT verification enabled. Keep the service key server-side.
// Include quiz-api.mjs and quiz-content.mjs from server/ when packaging this function.
import {handleQuiz} from './quiz-api.mjs';
const url=Deno.env.get('SUPABASE_URL')!;
const legacyServiceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const secretKeys=Deno.env.get('SUPABASE_SECRET_KEYS');
const serviceKey=legacyServiceKey||(secretKeys?JSON.parse(secretKeys).default:undefined);
if(!serviceKey)throw Error('Missing Supabase server-side secret key.');
const allowedOrigins=(Deno.env.get('MCPSCAN_ALLOWED_ORIGINS')||'https://getmcpscan.xyz,http://127.0.0.1:8767,http://localhost:8767').split(',').filter(Boolean);
const encoder=new TextEncoder();
async function digest(value:string){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(value)))].map(v=>v.toString(16).padStart(2,'0')).join('');}
async function rest(path:string,init:RequestInit={}){
 const authHeaders:Record<string,string>={apikey:serviceKey,'Content-Type':'application/json'};
 if(!serviceKey.startsWith('sb_secret_'))authHeaders.Authorization='Bearer '+serviceKey;
 const response=await fetch(url+'/rest/v1/'+path,{...init,headers:{...authHeaders,...init.headers}});
 if(!response.ok)throw Error('Storage request failed: '+response.status+' '+await response.text());
 const text=await response.text();
 return text?JSON.parse(text):null;
}
async function receiptFor(id:string){const key=await crypto.subtle.importKey('raw',encoder.encode(serviceKey),{name:'HMAC',hash:'SHA-256'},false,['sign']);return [...new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode('mcpscan-quiz:'+id)))].map(v=>v.toString(16).padStart(2,'0')).join('');}
const store={
 async capture(r:any){
  const receipt=await receiptFor(r.submissionId);
  await rest('mcpscan_quiz_leads?on_conflict=submission_id',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({submission_id:r.submissionId,email:r.email,answers:r.answers,path:r.path,privacy_version:r.privacyVersion,source:r.source,email_verified:false,receipt_hash:await digest(receipt)})});
  const saved=await rest('mcpscan_quiz_leads?submission_id=eq.'+encodeURIComponent(r.submissionId)+'&select=email,answers');
  if(saved.length!==1||saved[0].email!==r.email||JSON.stringify(saved[0].answers)!==JSON.stringify(r.answers))throw Error('Submission mismatch');
  return receipt;
 },
 async event(e:any){
  await rest('mcpscan_quiz_events',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({event:e.event,session_id:e.sessionId,path:e.path,step:e.step})});
 },
 async requestReview(receipt:string){
  const saved=await rest('mcpscan_quiz_leads?receipt_hash=eq.'+await digest(receipt)+'&created_at=gte.'+encodeURIComponent(new Date(Date.now()-30*86400000).toISOString())+'&select=submission_id,review_requested_at');
  if(saved.length!==1)return false;
  if(!saved[0].review_requested_at)await rest('mcpscan_quiz_leads?submission_id=eq.'+saved[0].submission_id+'&review_requested_at=is.null',{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify({review_requested_at:new Date().toISOString()})});
  return true;
 }
};
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin','Access-Control-Allow-Origin':allowedOrigins.includes(origin)?origin:'null','Access-Control-Allow-Headers':'authorization, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
 const reply=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers});
 if(!allowedOrigins.includes(origin))return reply(403,{error:'Origin not allowed.'});
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply(405,{error:'POST required.'});
 if(!req.headers.get('content-type')?.startsWith('application/json'))return reply(415,{error:'JSON required.'});
 try{
  const reader=req.body?.getReader();if(!reader)return reply(400,{error:'Missing body.'});
  let size=0;const chunks:Uint8Array[]=[];
  while(true){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();return reply(413,{error:'Request too large.'});}chunks.push(value);}
  const merged=new Uint8Array(size);let offset=0;for(const chunk of chunks){merged.set(chunk,offset);offset+=chunk.length;}
  let payload;try{payload=JSON.parse(new TextDecoder().decode(merged));}catch{return reply(400,{error:'Invalid JSON.'});}
  const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  const bucket=await digest(serviceKey+':'+ip+':'+Math.floor(Date.now()/60000));
  const allowed=await rest('rpc/mcpscan_quiz_throttle',{method:'POST',body:JSON.stringify({bucket_key:bucket})});
  if(!allowed)return reply(429,{error:'Please wait a minute and try again.'});
  const result=await handleQuiz(payload,store);return reply(result.status,result.body);
 }catch{return reply(503,{error:'We could not save your request. Please try again.'});}
});
