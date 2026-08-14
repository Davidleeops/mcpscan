# MCPScan Swarm Throughput Operating Model

Date: August 14, 2026

Status: ready before founder clicks. This is the operating model for agentized work after the domain, mailbox, and Stripe gates are live.

## Purpose

The goal is not for the founder to manually do delivery work. The founder should approve account-side actions, exact public claims, exact outbound messages, and customer handoff boundaries. Agents should prepare, verify, stage, and package everything else.

## Core Rule

Every lane produces a reusable artifact, a verification command, and a next approval gate. No lane sends, charges, publishes, accepts customer secrets, or starts private delivery without the required approval packet.

## Swarm Lanes

| Lane | Agent Job | Inputs | Outputs | Verification |
| --- | --- | --- | --- | --- |
| Market Pulse | Keep the opportunity, buyer pain, and source pack current | Public sources, market docs | Refreshed market notes and claim constraints | `npm run market:verify` |
| Domain And Mailbox | Keep the purchase path ready and aligned to the approved lane | Spaceship cart values returned by founder | DNS packet, mailbox DNS records, status updates | `npm run launch:verify-dns` |
| Stripe And Checkout | Convert offer into live, QA-checked payment links | Founder-created Stripe Payment Links | QA JSON, return packet, verified link manifest | `npm run launch:verify-stripe`, `npm run launch:verify-stripe-qa` |
| Public Launch | Apply public-safe values and verify the site | Approved return packet, QA evidence | Updated landing, CNAME, contact references, status JSON | `npm run launch:post-click-verify`, `npm run launch:verify` |
| Outbound Prep | Prepare first revenue messages without sending | Approved channel, account, recipient, and offer | Route packets, named-recipient packets, staged drafts | `npm run outbound:send-gates` |
| Reply To Close | Turn inbound replies into approved next steps | Prospect reply, approved scope, public offer | Reply packet, discovery call script, payment link route | `npm run outbound:open-reply-close` |
| Paid Delivery | Create private workspace and delivery packet after payment | Payment evidence, approved handoff | Private workspace, work order, report shell, pipeline status | `npm run delivery:verify`, `npm run delivery:dry-run` |
| Quality And Safety | Check claims, writing rules, launch readiness, and proof trail | Repo artifacts and public pages | Proof comments, status output, blocked-gate list | `npm run launch:full-proof` |

## Throughput Rules

1. Keep the first offer focused on MCP Launch Audit at `$1,500`.
2. Work in batches of 10 outbound approvals, not open-ended outreach.
3. Stage outbound outside the public repo after approval. Do not send automatically.
4. Use route-based approvals when named recipients are uncertain.
5. Convert one paid audit at a time until the delivery dry run and first real delivery both pass.
6. Use the private customer workspace path for all customer materials.
7. Keep public repo artifacts limited to templates, docs, proof, and non-secret launch surfaces.
8. Keep each agent lane accountable to one command that proves readiness.

## Daily Operating Loop

1. Run `npm run launch:status`.
2. If founder-click gates are still waiting, open `npm run launch:day`.
3. If live gates are ready, open `npm run launch:open-first-revenue`.
4. Approve one outbound batch or one reply action at a time.
5. After payment, use `npm run delivery:open-handoff`.
6. Before starting work, run `npm run delivery:verify`.
7. After delivery, log the follow-up and next proof artifact outside the public repo.

## Founder Approval Boundaries

The founder must approve:

- domain purchase and mailbox plan
- live Stripe Payment Links
- returned public values
- exact outbound recipients and exact final content
- public launch posts
- private paid-audit handoff
- commit and push after post-click live verification

Agents may prepare:

- domain packets
- DNS packets
- Stripe product packets
- return packet parsing
- public-safe status JSON
- outbound approval packets
- reply packets
- private workspace templates
- dry-run delivery proof
- verification summaries

## Capacity Target

Before first revenue, keep the system optimized for:

- one active launch gate
- one first-10 outbound batch
- one active reply-to-close path
- one paid audit delivery at a time

After the first paid delivery is complete, increase to:

- two active outbound batches per week
- two concurrent paid audit workspaces
- one market refresh per week
- one delivery retrospective per customer

## Stop Conditions

- Stop outbound if domain, mailbox authentication, Stripe links, or security contact are not live.
- Stop delivery if payment evidence is missing or the customer tries to send secrets through public channels.
- Stop public claims if `npm run gtm:verify` or `npm run writing:check` fails.
- Stop launch completion claims until `npm run launch:verify -- --domain {{chosen_domain}}` has no checkout, domain, or security-contact warnings.
