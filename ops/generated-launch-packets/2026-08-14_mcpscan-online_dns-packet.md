# MCPScan DNS Packet For mcpscan.online

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

## Zoho Mail Records

| Type | Host | Value | Priority |
| --- | --- | --- | --- |
| MX | @ | mx.zoho.com | 10 |
| MX | @ | mx2.zoho.com | 20 |
| MX | @ | mx3.zoho.com | 50 |
| TXT | @ | v=spf1 include:zohomail.com ~all |  |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:security@mcpscan.online |  |
| TXT | {{zoho_dkim_selector}}._domainkey | {{zoho_dkim_value}} |  |

DKIM note:

Generate the DKIM selector and TXT value in Zoho Mail Admin Console, then paste the exact value here.

Provider sources:

- https://www.zoho.com/mail/help/adminconsole/configure-email-delivery.html
- https://www.zoho.com/mail/help/adminconsole/spf-configuration.html
- https://www.zoho.com/mail/help/adminconsole/dkim-configuration.html

## GitHub Pages Setting

```text
mcpscan.online
```

## Verify After Propagation

```text
npm run launch:verify-dns -- --domain mcpscan.online --mail-provider zoho --update-status
```

## Approval Text

```text
I approve applying this exact MCPScan DNS packet.

Domain: mcpscan.online
Primary mailbox: security@mcpscan.online
Mail provider: Zoho Mail
DKIM selector: {{zoho_dkim_selector}}

Approved action:
Apply only the GitHub Pages, Zoho Mail MX, SPF, DKIM, and DMARC records shown in this packet. Do not add hosting, forwarding, paid SSL, parking, extra mailboxes, or site-builder products without separate approval.
```
