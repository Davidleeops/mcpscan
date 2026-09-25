import re,glob,pathlib
OFFERS=[
 dict(id='agency',name='Agency Handoff Pack',price='$1,500',who='For agencies and consultancies handing an MCP server or agent workflow to a client.',items=['One MCP server or agent workflow','Client-ready evidence packet','Permission and approval map','5 business days after complete intake'],cls='secondary'),
 dict(id='readiness',name='Security Review Readiness Pack',price='$2,500',who='For software companies whose MCP server is facing an enterprise customer security review.',items=['Evidence packet mapped to OWASP MCP Top 10 and AIUC-1 MCP controls','Answers to the MCP questions reviewers ask','Shareable signoff letter','1 retest after fixes, 5 business days'],cls='primary',featured=True),
 dict(id='testing',name='Readiness Pack + Manual Testing',price='$5,000',who='For vendors with a named enterprise deal waiting on the security review.',items=['Everything in the Readiness Pack','Manual testing of the auth flow and tool injection paths','Findings call with your engineers','7 to 10 business days'],cls='secondary'),
]
def card(o,base):
  f=' featured' if o.get('featured') and 'price-card' in base else ''
  lis=''.join(f'<li>{i}</li>' for i in o['items'])
  return (f'<article class="{base}{f}" data-offer="{o["id"]}">\n              <h3>{o["name"]}</h3>\n              <p>{o["who"]}</p>\n              <div class="price"><strong>{o["price"]}</strong><span>fixed price</span></div>\n              <ul>{lis}</ul>\n'
          f'              <a class="button {o["cls"]}" data-checkout="{o["id"]}" href="quiz.html?pack={o["id"]}">Request the {o["name"]}</a>\n            </article>')
def swap_cards(s,base):
  pat=re.compile(r'<article class="card[^"]*">\s*<h3>MCP Quick Audit</h3>.*?<h3>Enterprise Readiness</h3>.*?</article>',re.S)
  new='\n            '.join(card(o,base) for o in OFFERS)
  s2,n=pat.subn(new,s); assert n==1,(base,n); return s2
p=pathlib.Path('landing/index.html'); s=p.read_text()
s=swap_cards(s,'card price-card')
s=s.replace('Know what your agents can reach before a buyer asks.','Pass the security review on your MCP server.')
s=re.sub(r'MCPScan combines a local-first CLI with fixed-scope audit reports\s*for teams connecting AI agents to internal tools, credentials,\s*code, customer data, and third-party APIs.',
 'MCP Signoff gives software teams a reviewer-ready evidence packet for their MCP server, mapped to the OWASP MCP Top 10 and AIUC-1 MCP controls, in five business days. Start with the free local scanner.',s)
s=s.replace('MCP production-readiness audits','MCP security review readiness')
s=s.replace('Fixed-scope MCP readiness audits.','Fixed-price packs for the review in front of you.')
s=re.sub(r'Start with the free local scan, then buy a focused manual review\s*when MCP servers touch sensitive systems, enterprise-facing demos,\s*pilots, or customer security questionnaires.',
 'Pick the pack that matches who is reviewing you: an enterprise customer, a client at handoff, or a deal that needs hands-on testing.',s)
s=s.replace('Book an MCP audit','See the packs').replace('Find your audit path','Find your review path')
s=s.replace('https://github.com/Davidleeops/mcpscan/issues/new?title=MCPScan%20Launch%20Audit%20request','quiz.html?pack=readiness')
s=s.replace('>Buy an audit<','>Get the Readiness Pack<')
s=s.replace('npx mcpscan','npx mcpsignoff')
p.write_text(s)
p=pathlib.Path('landing/mcp-security-audit.html'); s=p.read_text()
s=swap_cards(s,'card'); p.write_text(s)
# brand swap across landing and quiz content, visible text only; keep internal ids
files=glob.glob('landing/*.html')+['landing/quiz.js','landing/README.md','server/quiz-content.mjs','server/preview-server.mjs','supabase/functions/mcpscan-quiz/quiz-content.mjs']
for f in files:
  p=pathlib.Path(f); s=p.read_text(); o=s
  s=re.sub(r'(?<![\w/.@-])MCPScan(?![\w-]*\.(?:js|mjs|ts|json)|Quiz|:quiz)', 'MCP Signoff', s)
  s=s.replace('>MS<','>MS<')
  if s!=o: p.write_text(s); print('updated',f)
