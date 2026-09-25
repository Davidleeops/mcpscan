import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
const context={window:{},location:{hostname:'capexlayer.com'}};
runInNewContext(readFileSync(new URL('../landing/quiz-config.js',import.meta.url),'utf8'),context,{timeout:1000});
const config=context.window.MCPScanQuizConfig;
if(!config?.endpoint||!/^https:\/\//.test(config.endpoint)){
 console.error('Quiz release blocked: configure and verify production lead capture before publishing. Local preview storage is not production capture.');
 process.exit(1);
}
if(Object.values(config.headers||{}).some(value=>typeof value==='string'&&value.startsWith('sb_secret_')))throw Error('Secret key in public config');
for(const value of Object.values(config.headers||{})){
 const token=String(value).replace(/^Bearer /,'');
 if(token.split('.').length===3){try{const claims=JSON.parse(Buffer.from(token.split('.')[1],'base64url').toString());if(claims.role==='service_role')throw Error('Service key in public config');}catch(e){if(e.message==='Service key in public config')throw e;}}
}
console.log('Quiz endpoint configured. Live capture, private storage, and delivery verification remain required before release.');
