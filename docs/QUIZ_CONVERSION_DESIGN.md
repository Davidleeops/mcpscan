# MCPScan conversion flow

## Commercial outcome

Primary outcome: a visitor submits a relevant scoped-review request.
Secondary outcome: a usable email and assessment are captured, and the visitor
consumes the decision artifact. Quiz completion alone is not success.

## Deliberate value exchange

1. The entry screen promises a personalized review plan and discloses the email step.
2. Five questions establish the visitor's objective, rollout state, access, action
   permissions, and timing. Questions serve the recommendation, not curiosity.
3. The preview names the specific artifact, gives one useful priority, and shows
   what the full artifact contains. No invented risk score or fabricated finding.
4. One email field opens the full plan after durable storage confirms capture.
   No company or phone requirement. The contact purpose is visible next to submit.
5. The plan delivers decision-specific evidence checks, practical boundaries, and
   a clear explanation of what a reviewed service adds.
6. A segment-specific CTA records review intent against the captured assessment.
   It requests scope confirmation rather than falsely treating an issue link as checkout.

## Evidence and limits

Nielsen Norman Group recommends giving useful value before requesting information:
https://www.nngroup.com/articles/reciprocity-principle/
This supports the real preview before capture. It does not justify hiding the email
requirement or claiming that recipients owe us a conversion.

Typeform describes assessments and tailored follow-up for lead qualification:
https://www.typeform.com/blog/qualify-leads-with-an-assessment
https://www.typeform.com/templates/lead-generation

Baymard research supports reducing unnecessary form fields in checkout:
https://baymard.com/research-articles/checkout-flow-average-form-fields
Applying that finding to this one-field B2B capture is a design hypothesis, not
proof of a conversion uplift for this product.

## Measure the whole journey

Track visitor -> start -> question completion -> preview -> captured lead ->
artifact consumed -> review requested -> qualified review -> paid review.
Compare qualified requests per visitor and per lead, not just captured addresses.
Keep capture failure rate visible. Email syntax validation is not ownership verification.
No external analytics service is currently connected.

## Delivery and production boundary

The artifact opens on the page and supports download and print. No delivery email
is sent or promised. Production capture uses dedicated MCPScan tables in the existing
Supabase project named cranegenius: `public.mcpscan_quiz_leads` and
`public.mcpscan_quiz_rate_limits`. These records are separated by table name,
source, and review path so they can be exported or split into a standalone project
later.

The local server is for review and testing only. It writes private records outside
the repository. Public static hosting cannot capture leads without the configured
backend; the frontend fails closed when it cannot confirm a save.

Production release checks: verified owned origin, configured backend, private storage
and RLS, real capture confirmation, duplicate/retry behavior, failed-save recovery,
artifact delivery, persisted request intent, privacy consistency, and mobile operation.
Existing branded-domain restrictions apply to any public deployment or outbound link.
