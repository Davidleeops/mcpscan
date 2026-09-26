#!/usr/bin/env node
// MCP Signoff outside-in check. Non-intrusive: reads public metadata and makes one
// unauthenticated MCP initialize request, exactly what any MCP client does on connect.
// Usage: node outside-in-check.mjs https://mcp.example.com/mcp "Example Co"
const [,, target, company='the vendor'] = process.argv;
if (!target) { console.error('usage: outside-in-check.mjs <mcp url> [company]'); process.exit(1); }
const u = new URL(target); const origin = u.origin;
const out = []; const add = (id, status, title, detail) => out.push({id, status, title, detail});
async function get(url, opts={}) { try { const r = await fetch(url, {redirect:'manual', signal:AbortSignal.timeout(10000), ...opts}); let body=null; const t=await r.text(); try{body=JSON.parse(t)}catch{body=t.slice(0,400)} return {status:r.status, headers:r.headers, body}; } catch(e) { return {error:e.message}; } }
// 1. Transport
add('TLS', u.protocol==='https:'?'pass':'fail', 'Endpoint uses HTTPS', u.protocol);
// 2. Protected resource metadata (RFC 9728)
const prm = await get(origin + '/.well-known/oauth-protected-resource' + (u.pathname!=='/'?u.pathname:''));
const prm2 = prm.status===200?prm:await get(origin + '/.well-known/oauth-protected-resource');
const pr = prm2.status===200 && typeof prm2.body==='object' ? prm2.body : null;
add('PRM', pr?'pass':'review', 'Publishes OAuth protected resource metadata', pr?`authorization_servers: ${(pr.authorization_servers||[]).join(', ')}`:'Not found at the standard well-known path. Worth confirming clients can discover how to authenticate.');
// 3. Authorization server metadata
let as=null; const asUrl=(pr?.authorization_servers||[])[0]||origin;
for (const p of ['/.well-known/oauth-authorization-server','/.well-known/openid-configuration']) { const r=await get(new URL(asUrl).origin+p); if(r.status===200&&typeof r.body==='object'){as=r.body;break;} }
if (as) {
  const pk=(as.code_challenge_methods_supported||[]);
  add('PKCE', pk.includes('S256')?'pass':'fail', 'Authorization server advertises PKCE S256', pk.join(', ')||'not advertised');
  add('DCR', as.registration_endpoint?'review':'pass', 'Dynamic client registration', as.registration_endpoint?'Open registration endpoint is advertised. Reviewers will ask how registered clients are vetted, rate limited and revoked.':'No open registration endpoint advertised.');
  const auth=as.token_endpoint_auth_methods_supported||[];
  add('TOKEN-AUTH', auth.includes('none')?'review':'pass', 'Token endpoint client authentication', auth.join(', ')||'not advertised');
  const scopes=as.scopes_supported||pr?.scopes_supported||[];
  add('SCOPES', scopes.length>1?'pass':'review', 'Granular scopes advertised', scopes.length?scopes.slice(0,12).join(', '):'No scopes advertised. Reviewers will ask how least privilege is enforced per tool.');
} else add('ASM','warn','Authorization server metadata discoverable','Not found. Reviewers will ask how clients obtain and scope tokens.');
// 4. Unauthenticated initialize
const init = await get(target,{method:'POST',headers:{'content-type':'application/json',accept:'application/json, text/event-stream'},body:JSON.stringify({jsonrpc:'2.0',id:1,method:'initialize',params:{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'mcp-signoff-outside-in',version:'1.0'}}})});
if (init.error) add('UNAUTH','review','Unauthenticated initialize',`No response: ${init.error}`);
else if (init.status===401||init.status===403) { const w=init.headers.get('www-authenticate')||''; add('UNAUTH','pass','Rejects unauthenticated sessions', `HTTP ${init.status}${w?`, WWW-Authenticate: ${w.slice(0,120)}`:''}`); add('WWW-AUTH', /resource_metadata/i.test(w)?'pass':'review','401 points clients to resource metadata', w?w.slice(0,160):'No WWW-Authenticate header'); }
else add('UNAUTH', 'review','Unauthenticated initialize', `HTTP ${init.status}. ${init.status===200?'Session initialized without credentials. Common, but a reviewer will ask you to show that tools/list and every tool call require auth.':''}`);
// 5. CORS
const cors = await get(target,{method:'OPTIONS',headers:{Origin:'https://evil.example','Access-Control-Request-Method':'POST'}});
const acao = cors.headers?.get('access-control-allow-origin');
add('CORS', acao==='*'||acao==='https://evil.example'?'review':'pass','Cross origin policy', acao?`Allows origin: ${acao}`:'No permissive CORS for an arbitrary origin');
// 6. Security headers
const hs = init.headers; const hsts = hs?.get('strict-transport-security');
add('HSTS', hsts?'pass':'review','Strict-Transport-Security header', hsts||'not set on MCP endpoint');
// Report
const icon={pass:'PASS',fail:'FIX',warn:'GAP',review:'ASK'};
const lines=[`# Outside-in MCP check: ${company}`,'',`Endpoint: ${target}`,`Checked: ${new Date().toISOString().slice(0,10)} by MCP Signoff`,'',
'Scope: public metadata and one unauthenticated initialize request, the same thing any MCP client does on connect. No credentials, no tool calls, no fuzzing.','',
'| Check | Result | Detail |','| --- | --- | --- |',...out.map(o=>`| ${o.title} | ${icon[o.status]} | ${String(o.detail).replace(/\|/g,'/').replace(/\n/g,' ')} |`),'',
'## What an enterprise reviewer will still ask',
'These cannot be answered from outside and are what the Readiness Pack documents:','',
'1. Which tools can write, delete or send, and what approval step sits in front of them?',
'2. How are OAuth tokens scoped per tool, stored, rotated and revoked?',
'3. Is every tool invocation logged with user, client and arguments, and for how long?',
'4. What stops a poisoned tool description or tool result from redirecting the agent?',
'5. How are tenants isolated when one MCP session serves many customers?','',
'Legend: PASS looks good. ASK is a question a reviewer will raise. GAP is missing evidence. FIX is worth changing.'];
console.log(lines.join('\n'));
