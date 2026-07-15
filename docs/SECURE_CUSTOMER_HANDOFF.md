# Secure Customer Handoff

This is the operating rule for paid MCPScan audits until a dedicated secure upload portal exists.

## Principle

Start every audit with sanitized configuration. Do not request or accept production credentials, active tokens, customer data, private database exports, or broad source-code dumps unless there is a separately approved private handoff path and the material is required for the paid scope.

## Public Intake Is Only For Sanitized Material

The public intake page and GitHub issue workflow can collect:

- Sanitized MCP configuration files with secrets removed.
- MCP server inventory.
- Tool permission notes: read, write, delete, execute, network, filesystem, database, admin.
- Admin policy screenshots or exports that do not reveal sensitive secrets.
- Business context and launch deadlines.

The public intake path must not collect:

- API keys, bearer tokens, OAuth secrets, SSH keys, cookies, session tokens, or passwords.
- Customer data, regulated data, or production database contents.
- Private source code that is not necessary for the audit.
- Unredacted incident details or exploit paths.

## Private Handoff Options

Use one of these options after payment when sensitive context is unavoidable:

1. Customer-owned private repository with MCPScan granted time-limited read access.
2. Customer-owned shared folder with explicit file list and time-limited access.
3. Encrypted archive, with the archive delivered by email or shared folder and the password sent through a separate channel.

If none of those are available, request a sanitized replacement instead of accepting sensitive files.

## Handling Mistakes

If a customer sends secrets or sensitive data through a public channel:

1. Pause intake.
2. Tell the customer not to send more sensitive material through that channel.
3. Ask them to rotate exposed secrets if applicable.
4. Remove or request removal of the public material where possible.
5. Continue only from sanitized replacements or an approved private handoff path.

## First Audit Checklist

- Confirm payer, company, audit owner, and security owner.
- Confirm scope: tools, servers, repos/config sources, and explicit exclusions.
- Confirm safe handoff path.
- Confirm no production credentials are needed.
- Confirm delivery deadline.
- Save the final report outside the public repository unless the customer explicitly approves publication.

Public guidance page:

```text
https://davidleeops.github.io/mcpscan/secure-intake.html
```
