import http from 'node:http';
import {readFile, mkdir, appendFile, chmod} from 'node:fs/promises';
import {resolve, extname, sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomBytes} from 'node:crypto';
import {handleQuiz} from './quiz-api.mjs';
const root=fileURLToPath(new URL('../landing/',import.meta.url));
const dataRoot=process.env.MCPSCAN_PREVIEW_DATA_DIR;
if(!dataRoot)throw Error('Set MCPSCAN_PREVIEW_DATA_DIR to a private directory outside the public repository.');
const dataFile=resolve(dataRoot,'quiz-leads.jsonl');
if(dataFile.startsWith(resolve(root,'..')+sep))throw Error('Lead storage must be outside the repository.');
await mkdir(dataRoot,{recursive:true,mode:0o700});
const records=new Map();
try{for(const line of (await readFile(dataFile,'utf8')).trim().split('\n').filter(Boolean)){const r=JSON.parse(line);records.set(r.submissionId,r);}}catch(e){if(e.code!=='ENOENT')throw e;}
let pending=Promise.resolve();
async function persist(record){await appendFile(dataFile,JSON.stringify(record)+'\n',{mode:0o600});await chmod(dataFile,0o600);records.set(record.submissionId,record);}
function serial(fn){const result=pending.then(fn);pending=result.catch(()=>{});return result;}
const store={capture:r=>serial(async()=>{const existing=records.get(r.submissionId);if(existing){if(existing.email!==r.email||JSON.stringify(existing.answers)!==JSON.stringify(r.answers))throw Error('Submission changed');return existing.receipt;}const record={...r,receipt:randomBytes(32).toString('hex'),createdAt:new Date().toISOString(),reviewRequestedAt:null};await persist(record);return record.receipt;}),requestReview:receipt=>serial(async()=>{const record=[...records.values()].find(r=>r.receipt===receipt);if(!record)return false;if(!record.reviewRequestedAt)await persist({...record,reviewRequestedAt:new Date().toISOString()});return true;})};
const buckets=new Map();
const port=Number(process.env.PORT||8767);
const server=http.createServer(async(req,res)=>{
 try{
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  const path=new URL(req.url,'http://localhost').pathname;
  if(path==='/api/quiz'){
   res.setHeader('Content-Type','application/json');res.setHeader('Cache-Control','no-store');
   if(req.method!=='POST'){res.writeHead(405);return res.end(JSON.stringify({error:'POST required.'}));}
   if(req.headers.origin&&!['http://127.0.0.1:'+port,'http://localhost:'+port].includes(req.headers.origin)){res.writeHead(403);return res.end(JSON.stringify({error:'Origin not allowed.'}));}
   if(!req.headers['content-type']?.startsWith('application/json')){res.writeHead(415);return res.end(JSON.stringify({error:'JSON required.'}));}
   const now=Date.now(),ip=req.socket.remoteAddress;let bucket=buckets.get(ip);if(!bucket||now-bucket.start>60000){bucket={start:now,count:0};buckets.set(ip,bucket);}if(++bucket.count>60){res.writeHead(429);return res.end(JSON.stringify({error:'Please wait a minute and try again.'}));}
   let body='';for await(const chunk of req){body+=chunk;if(Buffer.byteLength(body)>8192){res.writeHead(413);return res.end(JSON.stringify({error:'Request too large.'}));}}
   let payload;try{payload=JSON.parse(body);}catch{res.writeHead(400);return res.end(JSON.stringify({error:'Invalid JSON.'}));}
   const result=await handleQuiz(payload,store);res.writeHead(result.status);return res.end(JSON.stringify(result.body));
  }
  if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405);return res.end();}
  const file=resolve(root,'.'+decodeURIComponent(path==='/'?'/quiz.html':path));
  if(!file.startsWith(root)){res.writeHead(403);return res.end();}
  const data=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8'})[extname(file)]||'application/octet-stream');res.setHeader('Cache-Control','no-store');res.end(req.method==='HEAD'?undefined:data);
 }catch(e){res.writeHead(e.code==='ENOENT'?404:503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'We could not save your request. Please try again.'}));}
});
server.listen(port,'127.0.0.1',()=>console.log(`MCP Signoff preview: http://127.0.0.1:${port}/quiz.html (local storage only)`));
