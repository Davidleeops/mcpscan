# MCPScan DNS Packet For getmcpscan.xyz

Generated: 2026-08-14

## Rule

Apply only these records unless the founder separately approves a change. Do not add hosting, forwarding, site-builder, parking, or paid SSL products from the registrar cart.

## GitHub Pages Records

| Type | Host | Value |
| --- | --- | --- |
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | davidleeops.github.io |

## Spacemail Records

| Type | Host | Value | Priority |
| --- | --- | --- | --- |
| MX | @ | mx1.spacemail.com | 0 |
| MX | @ | mx2.spacemail.com | 0 |
| TXT | @ | v=spf1 include:spf.spacemail.com ~all |  |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:security@getmcpscan.xyz |  |
| TXT | {{spacemail_dkim_selector}}._domainkey | {{spacemail_dkim_value}} |  |

DKIM note:

Spacemail shows the DKIM record after mailbox creation. Spaceship docs name spacemail._domainkey as the common host, but use the exact host and value shown in the account.

Provider sources:

- https://www.spaceship.com/knowledgebase/spacemail-dns-records-third-party-domain/
- https://www.spaceship.com/blog/spf-dkim-dmarc-explained/

## GitHub Pages Setting

```text
getmcpscan.xyz
```

## Verify After Propagation

```text
npm run launch:verify-dns -- --domain getmcpscan.xyz --mail-provider spacemail --update-status
```

## Approval Text

```text
I approve applying this exact MCPScan DNS packet.

Domain: getmcpscan.xyz
Primary mailbox: security@getmcpscan.xyz
Mail provider: Spacemail
DKIM selector: {{spacemail_dkim_selector}}

Approved action:
Apply only the GitHub Pages, Spacemail MX, SPF, DKIM, and DMARC records shown in this packet. Do not add hosting, forwarding, paid SSL, parking, extra mailboxes, or site-builder products without separate approval.
```
