# @corsair-dev/inkbox

Inkbox plugin for Corsair: give AI agents their own identities with email inboxes, phone numbers, SMS, calls, iMessage, WhatsApp and Slack, plus contacts, notes, an encrypted credential vault, tunnels, hosted agents and webhook events.

## Install

```bash
pnpm add @corsair-dev/inkbox
```

## Options

- `key`: an Inkbox API key, from inkbox.ai/console → API keys. An
  organization admin key reaches every identity, mailbox and number in the
  organization. A key scoped to one agent identity (made with
  `apiKeys.create` and `scoped_identity_id`) reaches only what that identity
  can see. Hub stores it as the account's API key.

  A `key` passed in options wins over the key each tenant stores, so every
  tenant then calls Inkbox as that one organization. Leave `key` out when each
  tenant connects its own Inkbox organization.

- `webhookSecret`: the signing key of the agent identity whose events this
  account receives (`whsec_…`). `identities.signingKey.createOrRotate` returns
  it once, and so does the first `webhooks.subscriptions.create` for an
  identity without one. Hub can store it instead as the account's webhook
  signature.

## Webhook events

Subscribe a URL with `webhooks.subscriptions.create` (pick `event_types` from
`webhooks.getCatalog`). Each delivery is checked against the identity's
signing key: an HMAC-SHA256 of `{X-Inkbox-Request-ID}.{X-Inkbox-Timestamp}.{raw body}`
in `X-Inkbox-Signature`, and a timestamp no more than 300 seconds away, as
Inkbox's docs ask. An unsigned or wrongly signed delivery gets a 401.

| Webhook | Event types |
| :- | :- |
| `mail.messageEvent` | `message.received`, `message.sent`, `message.delivered`, `message.bounced`, `message.failed`, `message.forwarded` |
| `phone.textEvent` | `text.received`, `text.sent`, `text.delivered`, `text.delivery_failed`, `text.delivery_unconfirmed` |
| `phone.callEnded` | `call.ended` |
| `imessage.messageEvent` | `imessage.received`, `imessage.reaction_received`, `imessage.sent`, `imessage.delivered`, `imessage.delivery_failed` |
| `whatsapp.messageEvent` | `whatsapp.received`, `whatsapp.reaction_received`, `whatsapp.sent`, `whatsapp.delivered`, `whatsapp.delivery_failed`, `whatsapp.delivery_unconfirmed` |
| `slack.event` | the 23 `slack.*` event types (DMs, mentions, channel messages, reactions, pins, files, connection changes, send outcomes) |
| `a2a.taskEvent` | `a2a.task.created`, `a2a.task.message`, `a2a.task.canceled`, `a2a.sent_task.updated` |
| `transcriptions.finished` | `message.transcription_finished` |

Inkbox delivers at least once and keeps the envelope's `id` across retries and
replays, so use it to skip an event you already handled.

The synchronous incoming-call callback (`incoming_call_webhook_url` on a phone
number) is not one of these: its response body tells Inkbox whether to answer
the call, which a Corsair webhook handler can't do.

## How it is built

The 454 operations come from Inkbox's published OpenAPI spec
(https://inkbox.ai/api/openapi.json, fetched 2026-11-23). Its operation ids
are the ones FastAPI generates (`list_mailboxes_mail_mailboxes_get`), so each
route is named after Inkbox's TypeScript SDK instead (`mail.messages.send`,
`phone.texts.list`, `identities.signingKey.createOrRotate`, …):

- `inkbox-manifest.json` holds each operation's route, a flat input schema
  (path, query, header and body fields in one object) and its response
  schema, plus the eight webhook payload schemas.
- `endpoints/operation-types.ts` and `endpoints/catalog.ts` are generated
  from the same spec: input and output types, the endpoint tree, risk levels
  and a description for each operation.
- Zod schemas are built from the manifest on first use, one operation at a
  time (`endpoints/openapi-schema.ts`). Inputs keep the published contract,
  closed bodies (`additionalProperties: false`) included. Responses keep the
  documented types but let any field be missing or `null`.

Left out of the spec's 496 routes:

- 21 deprecated routes, each replaced by one the plugin has: the org-level
  `/signing-keys` (now `identities.signingKey.*`), contact and identity access
  grants (now `identities.contactAccess.*` and `identities.contactPermissions.*`),
  and the mailbox and phone-number contact rules and call reads (now the
  per-identity `identities.mailContactRules.*`, `identities.phoneContactRules.*`
  and `phone.calls.*`).
- 15 routes the spec accepts only from a signed-in console session: listing,
  editing and revoking API keys by id, agent-signup approvals, deleting the
  vault, a vault key or a vault secret, the iMessage router avatar upload,
  account deletion, and a few console helpers. An API key gets a 401 on them.
- `GET /health`, the spec itself, Inkbox's own receivers for The Campaign
  Registry's callbacks, and the hosted-chat server-sent event stream
  (`hostedChat.conversations.listMessages` and `hostedChat.turns.get` read the
  same turns).
- `POST /agent-signup/`, Inkbox's keyless self-signup. It creates a new
  organization and returns that organization's first API key, so it runs
  before there is anything to connect, and every plugin call carries the
  connected account's key. Run it with Inkbox's CLI or SDK, then connect the
  key it returns; `agentSignup.verify`, `resendVerification` and `getStatus`
  are in the plugin.

Billing, Slack, compliance (10DLC) and hosted-agent routes are all in.
Operations that send a message, buy something, change the plan, provision or
release a number, rotate a key or can't be undone are `destructive`, so a
permission mode can ask before they run. Risk is set per operation, so an
update with one input that deletes or provisions is `destructive` as a whole:
`identities.create` and `identities.update` (a phone number or a dedicated
iMessage line), `phone.texts.update` (`status: "deleted"`), `hosting.set`
(`enabled: false` deletes the hosted computer and its files) and
`slack.archive.updateSettings` (a shorter `retention_days` deletes older
archived messages).

## Found by the live tests

The spec says otherwise, or nothing:

- `POST /contacts/import` takes the vCard as a raw `text/vcard` body, which
  the spec leaves out. The plugin takes it as `vcard` and sends it raw.
- `GET .../messages/{message_id}/attachments/{filename}` answers a 302 to a
  storage URL. Following it would send the `X-API-Key` header to that host, so
  the plugin always asks for the URL as JSON (`redirect=false`).
- Ten routes answer bytes although the spec writes `{}` JSON or nothing: an
  identity avatar (JPEG), a contact's vCard, audio playback for SMS, iMessage
  and WhatsApp media, Slack file downloads, previews and cached images, and a
  draft attachment. They come back as a file output.
- Avatars (`identities.avatar.*`) refuse an organization admin key with 403.
  Read and set them with the identity's own key.
- An admin key can only mint identity-scoped keys. An identity-scoped key's
  `apiKeys.revokeCurrent` answered 404 "API key not found" on 2026-11-23.
  Deleting the identity revokes its keys.
- Organization-wide keys must pass `identity_id` (or `agent_identity_id`) to
  contact correspondence and communication policy, phone calls, the incoming
  call action, Voice AI settings and WhatsApp limits.
- Drafts use optimistic locking: every change takes the draft's current
  `generation` and returns the next one.
- Inbound webhook sources answer 409 unless the identity is an Inkbox-hosted
  agent.
- Errors come as FastAPI's `{ detail }`, a string or a list of field issues,
  plus a long `agent_support` note. The plugin's error message keeps the
  detail and drops the note and any value the request sent.

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `a2a.contactRules.create` | `inkbox.api.a2a.contactRules.create` | `write` | Creates an allow or block rule (`action`) controlling which agent (`match_target`) can exchange A2A tasks with this identity, optionally per `direction`. Requires an admin API key. |
| `a2a.contactRules.delete` | `inkbox.api.a2a.contactRules.delete` | `destructive` | Deletes one A2A contact rule (`rule_id`) from an identity. Requires an admin API key. |
| `a2a.contactRules.list` | `inkbox.api.a2a.contactRules.list` | `read` | Lists the A2A allow and block rules for one identity (`agent_handle`). |
| `a2a.contactRules.listForOrg` | `inkbox.api.a2a.contactRules.listForOrg` | `read` | Lists active A2A contact rules across every identity in the organization, filterable by `agent_identity_id`, `action` and `direction`. Requires an admin API key. |
| `a2a.contactRules.update` | `inkbox.api.a2a.contactRules.update` | `write` | Changes an A2A contact rule's `action` and/or `direction`; to change the match target, delete and recreate the rule. Requires an admin API key. |
| `a2a.contexts.get` | `inkbox.api.a2a.contexts.get` | `read` | Returns one A2A context (a conversation session) that another agent opened toward this identity, with its tasks in both directions. |
| `a2a.contexts.list` | `inkbox.api.a2a.contexts.list` | `read` | Lists A2A contexts visible to an identity, most recently active first, optionally filtered by `direction`. |
| `a2a.contexts.update` | `inkbox.api.a2a.contexts.update` | `write` | Renames an A2A context (`name`). Either participant can rename it, whoever opened it. |
| `a2a.invitations.accept` | `inkbox.api.a2a.invitations.accept` | `write` | Accepts an A2A invitation (`invitation_token`) as the agent that owns the calling agent-scoped API key, connecting it to the invitation's peer agents. |
| `a2a.invitations.create` | `inkbox.api.a2a.invitations.create` | `destructive` | Creates an A2A invitation that lets an outside agent connect to `peer_agent_handles`; Inkbox emails `recipient_email` if set, otherwise returns a link to hand off. Requires an admin API key. |
| `a2a.invitations.decline` | `inkbox.api.a2a.invitations.decline` | `write` | Declines an A2A invitation by its `invitation_token`. Connections already accepted are not affected. Inkbox needs no API key for this route; the plugin still sends the connected one. |
| `a2a.invitations.get` | `inkbox.api.a2a.invitations.get` | `read` | Returns one A2A invitation issued by your organization, with its status, peer agents and email delivery state. |
| `a2a.invitations.list` | `inkbox.api.a2a.invitations.list` | `read` | Lists A2A invitations issued by your organization, newest first, optionally filtered by `status`. |
| `a2a.invitations.preview` | `inkbox.api.a2a.invitations.preview` | `read` | Shows an A2A invitation's inviter, peer agents and expiry from the raw `invitation_token` without accepting it. Inkbox needs no API key for this route; the plugin still sends the connected one. |
| `a2a.invitations.revoke` | `inkbox.api.a2a.invitations.revoke` | `destructive` | Revokes a pending or awaiting-verification A2A invitation so it can no longer be accepted. Accepted, declined or expired invitations cannot be revoked. |
| `a2a.listDirectory` | `inkbox.api.a2a.listDirectory` | `read` | Searches the organization's directory of A2A-enabled agent identities, including non-public cards, by text `q` or `verified_domain`. |
| `a2a.messages.list` | `inkbox.api.a2a.messages.list` | `read` | Lists A2A task messages for an identity, newest first, filterable by `direction`, `task_id`, `context_id`, `role`, peer handles, `since` or full-text `q`. |
| `a2a.previewCard` | `inkbox.api.a2a.previewCard` | `read` | Returns the Agent Card Inkbox would publish for one of your identities, even while A2A is disabled, to review its description and skills. |
| `a2a.sentContexts.get` | `inkbox.api.a2a.sentContexts.get` | `read` | Returns one A2A context this identity opened toward another agent, with its tasks in both directions. Returns 404 for contexts opened toward it. |
| `a2a.sentContexts.list` | `inkbox.api.a2a.sentContexts.list` | `read` | Lists A2A contexts this identity opened toward other agents. |
| `a2a.sentTasks.get` | `inkbox.api.a2a.sentTasks.get` | `read` | Returns one A2A task this identity sent to another agent, with its message history. |
| `a2a.sentTasks.list` | `inkbox.api.a2a.sentTasks.list` | `read` | Lists A2A tasks this identity sent to other agents, newest first, filterable by `state`, `context_id`, peer handles, `since` or full-text `q`. |
| `a2a.settings.get` | `inkbox.api.a2a.settings.get` | `read` | Returns an identity's A2A settings (enabled, public discoverability, filter mode, skills, card URL) and lifetime inbound and outbound task counts. |
| `a2a.settings.listForOrg` | `inkbox.api.a2a.settings.listForOrg` | `read` | Lists every identity's effective A2A settings across the organization, optionally filtered by `enabled`. Requires an admin API key. |
| `a2a.settings.update` | `inkbox.api.a2a.settings.update` | `write` | Updates an identity's A2A settings: `enabled`, `skills`, `allow_public_egress`, and (admin key only) `publicly_discoverable` and `filter_mode`. Omitted fields are kept. |
| `a2a.tasks.get` | `inkbox.api.a2a.tasks.get` | `read` | Returns one A2A task this identity received as the worker, with its message history. Use `a2a.sentTasks.get` for tasks it sent. |
| `a2a.tasks.list` | `inkbox.api.a2a.tasks.list` | `read` | Lists A2A tasks visible to an identity, newest first; received tasks by default, or set `direction`. Filterable by `state`, `context_id`, peer handles and `q`. |
| `a2a.tasks.reply` | `inkbox.api.a2a.tasks.reply` | `destructive` | Replies to a task this identity received, sending message `parts` to the requesting agent and moving the task by `intent`: progress, ask_caller, complete or fail. |
| `account.whoami` | `inkbox.api.account.whoami` | `read` | Returns the authenticated caller's identity and auth type, to check which organization, identity or key a request runs as. |
| `agentSignup.getStatus` | `inkbox.api.agentSignup.getStatus` | `read` | Returns the calling agent's claim status, its human owner's account state and email, and the restrictions that still apply to it. |
| `agentSignup.resendVerification` | `inkbox.api.agentSignup.resendVerification` | `destructive` | Emails the agent's human owner a new 6-digit verification code, invalidating the previous one. Limited to once every 5 minutes. |
| `agentSignup.verify` | `inkbox.api.agentSignup.verify` | `write` | Submits the 6-digit `verification_code` the human received by email to claim the agent and unlock full sending. |
| `apiKeys.create` | `inkbox.api.apiKeys.create` | `destructive` | Creates an API key (`label`): set `scoped_identity_id` for an agent-scoped key, or omit it for an admin key with full organization access. The key value is returned only once. |
| `apiKeys.getCurrent` | `inkbox.api.apiKeys.getCurrent` | `read` | Returns metadata for the API key making the call (scope, label, status, last four characters, expiry). The key value itself is never returned. |
| `apiKeys.revokeCurrent` | `inkbox.api.apiKeys.revokeCurrent` | `destructive` | Revokes the API key making the call, permanently, so later requests with it fail. Create a replacement key before revoking. |
| `billing.callingCountries.buy` | `inkbox.api.billing.callingCountries.buy` | `destructive` | Buys outbound calling access to countries (`country_code` or `country_codes`) with an accepted `quote` and a new `request_key`, charging the organization. Reuse the key on retry; admin key only. |
| `billing.callingCountries.cancel` | `inkbox.api.billing.callingCountries.cancel` | `destructive` | Cancels renewal of a calling-country agreement (`agreement_id`). Access lasts through the paid period; no prorated refund. |
| `billing.callingCountries.list` | `inkbox.api.billing.callingCountries.list` | `read` | Lists calling destinations with monthly prices, the organization's calling-country agreements, and the countries already included. |
| `billing.callingCountries.quote` | `inkbox.api.billing.callingCountries.quote` | `read` | Quotes the prorated charge for adding calling countries (`country_code` or `country_codes`) and returns a `quote` token to confirm the purchase. Does not charge. |
| `billing.callingCountries.resume` | `inkbox.api.billing.callingCountries.resume` | `destructive` | Resumes renewal of a canceled calling-country agreement (`agreement_id`) before its coverage ends, at the existing price. |
| `billing.changePlan` | `inkbox.api.billing.changePlan` | `destructive` | Changes the organization's subscription `plan` (`free` cancels) and optionally its billing `interval`; requires an admin key. Upgrades and moves to yearly are charged and prorated immediately. |
| `billing.createCheckoutSession` | `inkbox.api.billing.createCheckoutSession` | `write` | Creates a Stripe Checkout URL for subscribing to a `plan`, returning to `success_url` or `cancel_url`. The user pays in the browser. |
| `billing.createPortalSession` | `inkbox.api.billing.createPortalSession` | `write` | Creates a Stripe billing portal URL where a person manages the organization's billing, returning to `return_url` afterwards. |
| `billing.getPricing` | `inkbox.api.billing.getPricing` | `read` | Returns usage rates and recurring add-on prices, with the organization's contracted price where one applies. |
| `billing.getSubscription` | `inkbox.api.billing.getSubscription` | `read` | Returns the organization's plan, status, billing interval, pending changes and entitlements, including whether custom email signatures are available. |
| `billing.getUsage` | `inkbox.api.billing.getUsage` | `read` | Returns organization usage for the current billing cycle (SMS/MMS, call seconds, iMessage, storage, identities) by channel and identity, with remaining allowances and overage. |
| `billing.identityPacks.buy` | `inkbox.api.billing.identityPacks.buy` | `destructive` | Buys an identity pack (extra agent identity slots) with an accepted `quote` and a new `request_key`, charging the organization; may return a `payment_url`. Requires an admin API key. |
| `billing.identityPacks.change` | `inkbox.api.billing.identityPacks.change` | `destructive` | Cancels or resumes renewal of an identity-pack agreement (`action`: cancel or resume), with a unique `request_key`. |
| `billing.identityPacks.list` | `inkbox.api.billing.identityPacks.list` | `read` | Lists the identity-pack offer, the organization's identity-pack agreements, identity capacity and whether it is eligible to buy. |
| `billing.identityPacks.quote` | `inkbox.api.billing.identityPacks.quote` | `read` | Quotes the price of an identity pack (extra identity slots) and returns a `quote` token for buying it. Does not charge. |
| `billing.lineBundles.buy` | `inkbox.api.billing.lineBundles.buy` | `destructive` | Buys a line bundle (`code`: a VoIP or personal iMessage line slot plus voice and SMS credits) with an accepted `quote` and `request_key`, charging the organization. Assigns no number; admin key only. |
| `billing.lineBundles.change` | `inkbox.api.billing.lineBundles.change` | `destructive` | Cancels or resumes a line-bundle agreement (`action`). Canceling removes an unused line slot immediately with no refund. |
| `billing.lineBundles.list` | `inkbox.api.billing.lineBundles.list` | `read` | Lists line-bundle offers, the organization's bundle agreements, and remaining bundle voice seconds and messages. |
| `billing.lineBundles.quote` | `inkbox.api.billing.lineBundles.quote` | `read` | Quotes the prorated price and credits of a line bundle (`code`) and returns a `quote` token for buying it. Does not charge. |
| `billing.settings.get` | `inkbox.api.billing.settings.get` | `read` | Returns the organization's monthly SMS and voice overage spending cap and whether the 'Sent via Inkbox' email footer is removed. |
| `billing.settings.update` | `inkbox.api.billing.settings.update` | `write` | Sets the monthly SMS/voice overage cap (`overage_cap_cents`; null clears it, 0 blocks overage) and/or `remove_branding_footer` (paid plans only). |
| `billing.setVoicePacks` | `inkbox.api.billing.setVoicePacks` | `destructive` | Sets how many call-minute packs of one size the organization holds (`pack`, `quantity`; 0 removes them); increases are invoiced immediately. Paid plans and admin key only. |
| `billing.usageAlerts.delete` | `inkbox.api.billing.usageAlerts.delete` | `destructive` | Deletes a usage alert override (`rule_id`), restoring the default 90% alert for that quota when no other overrides remain. |
| `billing.usageAlerts.list` | `inkbox.api.billing.usageAlerts.list` | `read` | Lists the organization's usage email alerts (identities, storage, SMS, voice, overage) with thresholds and whether each is a default. |
| `billing.usageAlerts.save` | `inkbox.api.billing.usageAlerts.save` | `write` | Creates or updates a usage email alert (`rule_id`; a new UUID adds one) for a `metric` at a percentage `threshold`, optionally for one `mailbox_id` (storage). |
| `compliance.brand.delete` | `inkbox.api.compliance.brand.delete` | `destructive` | Deletes the organization's 10DLC brand registration. Requires an admin API key. |
| `compliance.brand.get` | `inkbox.api.compliance.brand.get` | `read` | Returns the organization's 10DLC brand registration and its current verification status. |
| `compliance.brand.register` | `inkbox.api.compliance.brand.register` | `destructive` | Registers the organization's 10DLC brand (business details for US SMS) for verification. One brand per organization; asynchronous, so check its status afterwards. |
| `compliance.brand.resendTwoFactorEmail` | `inkbox.api.compliance.brand.resendTwoFactorEmail` | `destructive` | Resends the verification (2FA) email for the organization's 10DLC brand. |
| `compliance.brand.sendSmsOtp` | `inkbox.api.compliance.brand.sendSmsOtp` | `destructive` | Texts a one-time PIN to the brand's phone to verify a sole-proprietor 10DLC brand; confirm it with `compliance.brand.verifySmsOtp`. |
| `compliance.brand.update` | `inkbox.api.compliance.brand.update` | `write` | Replaces the organization's 10DLC brand details; all required business fields must be sent again. Requires an admin API key. |
| `compliance.brand.verifySmsOtp` | `inkbox.api.compliance.brand.verifySmsOtp` | `write` | Verifies the 10DLC brand with the one-time PIN (`otp_pin`) received by SMS. |
| `compliance.campaign.delete` | `inkbox.api.compliance.campaign.delete` | `destructive` | Deletes the organization's 10DLC campaign, which also stops its monthly fee. Requires an admin API key. |
| `compliance.campaign.get` | `inkbox.api.compliance.campaign.get` | `read` | Returns the organization's 10DLC campaign and its carrier review status (`campaignStatus`). |
| `compliance.campaign.getActive` | `inkbox.api.compliance.campaign.getActive` | `read` | Returns whether the organization has selected its own 10DLC campaign (`active: true`) or Inkbox's default campaign. |
| `compliance.campaign.register` | `inkbox.api.compliance.campaign.register` | `destructive` | Submits the organization's 10DLC campaign (use case, sample messages, opt-in/opt-out keywords, policy links) for carrier review. Costs $20/month once approved. |
| `compliance.campaign.resubmit` | `inkbox.api.compliance.campaign.resubmit` | `destructive` | Replaces the 10DLC campaign with a complete new registration and a new campaign ID; local numbers return to Inkbox's default campaign during review. |
| `compliance.campaign.setActive` | `inkbox.api.compliance.campaign.setActive` | `destructive` | Switches the organization's local US numbers to its own approved 10DLC campaign (`active: true`) or back to Inkbox's default. Runs asynchronously. |
| `compliance.campaign.update` | `inkbox.api.compliance.campaign.update` | `write` | Updates the 10DLC campaign's `help_message`, `message_flow` and sample messages. Requires an admin API key. |
| `compliance.uploadOptInEvidence` | `inkbox.api.compliance.uploadOptInEvidence` | `write` | Uploads an image (`file`, max 5 MiB) of your SMS opt-in flow and returns a public URL to cite in the campaign's `message_flow`. |
| `contacts.bulkDelete` | `inkbox.api.contacts.bulkDelete` | `destructive` | Deletes 1 to 1,000 contacts by `contact_ids` and returns a result for each. |
| `contacts.communicationPolicy.get` | `inkbox.api.contacts.communicationPolicy.get` | `read` | Returns a contact's communication policy for an agent identity (`identity_id`): per-address inbound/outbound allow or block and field visibility. |
| `contacts.communicationPolicy.preview` | `inkbox.api.contacts.communicationPolicy.preview` | `read` | Previews what one agent identity (`identity_id`) can see of a contact and whether it may email or phone it in each direction. Requires an admin API key. |
| `contacts.communicationPolicy.set` | `inkbox.api.contacts.communicationPolicy.set` | `write` | Sets which of a contact's `addresses` an agent identity (`identity_id`) may use inbound and outbound, and its `visibility`, given the current `expected_revision`. Requires an admin API key. |
| `contacts.create` | `inkbox.api.contacts.create` | `write` | Creates a contact with names, company, emails, phones, addresses and custom fields. At least one name field or `company_name` is required. |
| `contacts.createWithPermissions` | `inkbox.api.contacts.createWithPermissions` | `write` | Creates a contact and sets one agent's access `permissions` in a single transaction. Requires an admin API key. |
| `contacts.delete` | `inkbox.api.contacts.delete` | `destructive` | Deletes one contact by `contact_id`. Use `contacts.bulkDelete` to delete up to 1,000 at once. |
| `contacts.exportVcard` | `inkbox.api.contacts.exportVcard` | `read` | Downloads one contact (`contact_id`) as a vCard (.vcf) file. |
| `contacts.exportVcards` | `inkbox.api.contacts.exportVcards` | `read` | Exports 1 to 25 contacts (`contact_ids`) as a single vCard document. |
| `contacts.facts.create` | `inkbox.api.contacts.facts.create` | `write` | Adds a memory (`content`, `kind`) to a contact. Requires an admin API key; agent-scoped keys cannot write memories. |
| `contacts.facts.delete` | `inkbox.api.contacts.facts.delete` | `destructive` | Deletes one memory from a contact. Requires an admin API key. |
| `contacts.facts.get` | `inkbox.api.contacts.facts.get` | `read` | Returns one contact memory with its citations, including a memory whose deadline has passed. |
| `contacts.facts.list` | `inkbox.api.contacts.facts.list` | `read` | Lists a contact's memories, most recently updated first. Set `include_expired` to include memories past their deadline. |
| `contacts.facts.resolveCitation` | `inkbox.api.contacts.facts.resolveCitation` | `read` | Resolves a memory's citation to its source ID, locator and URL, after rechecking that the caller can still access that correspondence. |
| `contacts.facts.update` | `inkbox.api.contacts.facts.update` | `write` | Edits a contact memory's `content` or moves it to another `kind`. Requires an admin API key. |
| `contacts.get` | `inkbox.api.contacts.get` | `read` | Returns one contact by `contact_id`, limited to the fields the caller is permitted to see. |
| `contacts.getCorrespondence` | `inkbox.api.contacts.getCorrespondence` | `read` | Returns email, SMS, iMessage, WhatsApp and call history between one contact and an agent identity, filterable by `channels`, `after`/`before` and per-channel limits. |
| `contacts.import` | `inkbox.api.contacts.import` | `write` | Imports up to 2,500 contacts from a vCard body (max 10 MiB). Pass `X-VCard-Preview-Hash` from a preview to fail if the data or conflicts changed. |
| `contacts.list` | `inkbox.api.contacts.list` | `read` | Lists contacts visible to the caller, with name search `q`, `order` and `review_status` filters. |
| `contacts.lookup` | `inkbox.api.contacts.lookup` | `read` | Finds contacts by one field: exact `email` or `phone`, or partial match with `email_contains`, `email_domain` or `phone_contains`. |
| `contacts.merge` | `inkbox.api.contacts.merge` | `destructive` | Merges duplicate contacts (`losing_contact_ids`) into this contact, combining identifiers, correspondence and memories. Requires an admin API key. |
| `contacts.previewImport` | `inkbox.api.contacts.previewImport` | `read` | Validates a vCard batch (`vcard`) and reports conflicts with existing contacts, without creating any. Returns a `preview_hash` for the import. |
| `contacts.update` | `inkbox.api.contacts.update` | `write` | Updates a contact with JSON merge-patch: sent fields replace, null clears, omitted fields are kept. |
| `domains.create` | `inkbox.api.domains.create` | `write` | Registers a custom email sending domain (`domain`) and returns the DNS records to publish. An apex with existing MX records needs `apex_mx_acknowledged` to displace that mail provider. |
| `domains.delete` | `inkbox.api.domains.delete` | `destructive` | Deletes a custom sending domain: sending and receiving stop at once, and it can be restored for 24 hours before deletion is permanent. Fails while mailboxes still use it. |
| `domains.forceDelete` | `inkbox.api.domains.forceDelete` | `destructive` | Deletes a custom sending domain (`domain_id`) by force, bypassing the normal delete flow and its restore window; treat it as permanent. |
| `domains.get` | `inkbox.api.domains.get` | `read` | Returns one custom sending domain with its status and required DNS records. |
| `domains.getDnsRecords` | `inkbox.api.domains.getDnsRecords` | `read` | Returns the DNS records (ownership TXT, mail routing, DKIM and others) to publish at the registrar for a custom sending domain. |
| `domains.getHealth` | `inkbox.api.domains.getHealth` | `read` | Returns a custom sending domain's health: its status and the current check result for each required DNS record. |
| `domains.list` | `inkbox.api.domains.list` | `read` | Lists the organization's custom email sending domains, optionally filtered by lifecycle `status`. |
| `domains.restore` | `inkbox.api.domains.restore` | `write` | Restores a custom sending domain that is still in its 24-hour deletion grace period. |
| `domains.rotateDkim` | `inkbox.api.domains.rotateDkim` | `destructive` | Starts a DKIM key rotation for a custom sending domain and returns the new selector and TXT value to publish; the old key stays active until the new one verifies. |
| `domains.setDefault` | `inkbox.api.domains.setDefault` | `write` | Makes a verified custom domain (`domain_name`) the organization's default for new mailboxes; pass `inkboxmail.com` to revert. Requires an admin API key. |
| `domains.verify` | `inkbox.api.domains.verify` | `write` | Re-checks a custom sending domain's DNS records now and returns its updated status. |
| `hostedChat.answerInteraction` | `inkbox.api.hostedChat.answerInteraction` | `write` | Answers a pending tool approval or question in a hosted-agent conversation with `response` (for example approve_once or deny) at `expected_version`; only the first valid answer counts. |
| `hostedChat.conversations.create` | `inkbox.api.hostedChat.conversations.create` | `write` | Starts a new chat conversation with an identity's hosted agent, with an optional `title`. |
| `hostedChat.conversations.get` | `inkbox.api.hostedChat.conversations.get` | `read` | Returns a snapshot of a hosted-agent conversation: recent items, pending approvals, the current turn, and cursors for paging and events. |
| `hostedChat.conversations.list` | `inkbox.api.hostedChat.conversations.list` | `read` | Lists chat conversations with an identity's hosted agent, optionally filtered by `origin` (`chat`, `communication` or `schedule`). |
| `hostedChat.conversations.listMessages` | `inkbox.api.hostedChat.conversations.listMessages` | `read` | Lists older items of a hosted-agent conversation, paging with `after` and a `snapshot` token from the conversation snapshot. |
| `hostedChat.conversations.rename` | `inkbox.api.hostedChat.conversations.rename` | `write` | Updates a hosted-agent conversation's `title` and/or tool `permission_mode` (ask or yolo, which auto-approves tool requests in future turns). |
| `hostedChat.files.download` | `inkbox.api.hostedChat.files.download` | `read` | Downloads a hosted-agent chat file (uploaded or produced by the agent) as base64 (`data_base64`). |
| `hostedChat.files.get` | `inkbox.api.hostedChat.files.get` | `read` | Returns metadata for a hosted-agent chat file: name, media type, size and availability. |
| `hostedChat.files.upload` | `inkbox.api.hostedChat.files.upload` | `write` | Uploads a file (`name`, `data_base64`, max 5 MB) for use as an attachment in a hosted-agent chat turn. |
| `hostedChat.getStatus` | `inkbox.api.hostedChat.getStatus` | `read` | Returns the hosted agent's workspace status for chat: computer state, agent readiness, capabilities, funding and allowed actions. |
| `hostedChat.turns.cancel` | `inkbox.api.hostedChat.turns.cancel` | `write` | Requests cancellation of a running turn in a hosted-agent conversation. |
| `hostedChat.turns.create` | `inkbox.api.hostedChat.turns.create` | `destructive` | Sends a message (`content`: text and file parts) to an identity's hosted agent, starting a turn with an optional `model`; wakes a stopped computer, one turn at a time. Admin API key only. |
| `hostedChat.turns.get` | `inkbox.api.hostedChat.turns.get` | `read` | Returns the status of one turn in a hosted-agent conversation (queued, running, waiting_for_input, completed, failed and so on) and any blocker. |
| `hostedWorkspace.environment.get` | `inkbox.api.hostedWorkspace.environment.get` | `read` | Lists environment variables set on the hosted agent's computer; secret values are masked. |
| `hostedWorkspace.environment.update` | `inkbox.api.hostedWorkspace.environment.update` | `write` | Sets (`set`) or removes (`remove`) environment variables on the hosted agent's computer at `expected_version`. Changes apply to new processes. |
| `hostedWorkspace.get` | `inkbox.api.hostedWorkspace.get` | `read` | Returns the hosted agent's computer state, agent readiness, capabilities, funding and allowed actions. |
| `hostedWorkspace.getOperation` | `inkbox.api.hostedWorkspace.getOperation` | `read` | Returns the progress and result of a workspace operation (start, stop, pause, resume, resize, terminal) by `operation_id`. |
| `hostedWorkspace.getUsage` | `inkbox.api.hostedWorkspace.getUsage` | `read` | Returns current CPU, memory and disk usage of the hosted agent's computer. |
| `hostedWorkspace.getUsageHistory` | `inkbox.api.hostedWorkspace.getUsageHistory` | `read` | Returns CPU, memory and disk usage history of the hosted agent's computer over a `window` (1h, 24h, 7d or 30d). |
| `hostedWorkspace.ports.get` | `inkbox.api.hostedWorkspace.ports.get` | `read` | Returns the hosted agent's public URL, default port and exposed ports. |
| `hostedWorkspace.ports.rotateToken` | `inkbox.api.hostedWorkspace.ports.rotateToken` | `destructive` | Issues a new access token URL for an exposed port on the hosted agent; the old token stops working immediately. Requires an admin API key. |
| `hostedWorkspace.ports.update` | `inkbox.api.hostedWorkspace.ports.update` | `write` | Sets which ports the hosted agent exposes (`ports`, public or token-protected) and the `default_port`, given the current `version`. Removing a port deletes its token. |
| `hostedWorkspace.resize` | `inkbox.api.hostedWorkspace.resize` | `destructive` | Changes a stopped hosted computer's CPU and memory (`shape_id`) and optionally `disk_bytes`, given `expected_version`. Runs asynchronously; larger shapes need a paid plan. |
| `hostedWorkspace.runAction` | `inkbox.api.hostedWorkspace.runAction` | `destructive` | Starts, stops, pauses or resumes the hosted agent's computer (`action`) and returns an `operation_id` to poll; stop ends running programs but keeps files. Requires an admin API key. |
| `hostedWorkspace.schedules.create` | `inkbox.api.hostedWorkspace.schedules.create` | `write` | Creates a scheduled run for the hosted agent (cron, interval or once, in `fields`) with `expected_revision` 0. Needs a running agent; scheduled runs auto-approve tool requests. |
| `hostedWorkspace.schedules.delete` | `inkbox.api.hostedWorkspace.schedules.delete` | `destructive` | Deletes a hosted-agent schedule, given its current `expected_revision`. |
| `hostedWorkspace.schedules.list` | `inkbox.api.hostedWorkspace.schedules.list` | `read` | Lists the hosted agent's schedules with their registration status. |
| `hostedWorkspace.schedules.listOccurrences` | `inkbox.api.hostedWorkspace.schedules.listOccurrences` | `read` | Lists past runs of one hosted-agent schedule and the conversation that holds their output. |
| `hostedWorkspace.schedules.preview` | `inkbox.api.hostedWorkspace.schedules.preview` | `read` | Previews the next run times for a schedule `timing` (cron, interval or once) without saving anything. |
| `hostedWorkspace.schedules.update` | `inkbox.api.hostedWorkspace.schedules.update` | `write` | Edits, pauses (`enabled: false`) or resumes a hosted-agent schedule via `fields`, given its current `expected_revision`. |
| `hostedWorkspace.terminals.close` | `inkbox.api.hostedWorkspace.terminals.close` | `write` | Closes a terminal session on the hosted agent's computer. |
| `hostedWorkspace.terminals.create` | `inkbox.api.hostedWorkspace.terminals.create` | `write` | Opens a terminal or runs a command (`argv`, `cwd`, `env`, optional `pty`, `timeout_ms`) on the hosted agent's computer, which must be started. Requires an admin API key. |
| `hostedWorkspace.terminals.createTicket` | `inkbox.api.hostedWorkspace.terminals.createTicket` | `write` | Returns a short-lived ticket and URL to attach to a terminal session on the hosted agent's computer. |
| `hostedWorkspace.terminals.list` | `inkbox.api.hostedWorkspace.terminals.list` | `read` | Lists terminal sessions on the hosted agent's computer. |
| `hosting.callTool` | `inkbox.api.hosting.callTool` | `destructive` | Sends a JSON-RPC MCP request (`method`, `params`) to the identity's hosted tools endpoint, for example to list or call the tools its hosted agent uses. |
| `hosting.deliveries.list` | `inkbox.api.hosting.deliveries.list` | `read` | Lists up to 100 incoming-event deliveries to an identity's hosted agent, with state, attempts and last error. Page back with `before`. |
| `hosting.deliveries.retry` | `inkbox.api.hosting.deliveries.retry` | `write` | Re-queues a failed event delivery to the identity's hosted agent. Requires an admin API key. |
| `hosting.get` | `inkbox.api.hosting.get` | `read` | Returns an identity's hosted-agent configuration: harness, compute shape, state, default model, instructions, trigger events and current `generation`. |
| `hosting.set` | `inkbox.api.hosting.set` | `destructive` | Configures an identity's hosted agent (harness, `shape_id`, `default_model`, `instructions`, `trigger_events`) at `expected_generation`; admin key only. `enabled: false` deletes the computer and its files. |
| `identities.avatar.delete` | `inkbox.api.identities.avatar.delete` | `destructive` | Removes an identity's avatar so future contact cards go out without a photo. Succeeds even when no avatar is set. |
| `identities.avatar.get` | `inkbox.api.identities.avatar.get` | `read` | Downloads an identity's avatar as a 600x600 JPEG image. |
| `identities.avatar.getMetadata` | `inkbox.api.identities.avatar.getMetadata` | `read` | Returns whether an identity has an avatar, its content type, and a temporary authorized URL to fetch it. |
| `identities.avatar.setFromStagedMedia` | `inkbox.api.identities.avatar.setFromStagedMedia` | `write` | Sets an identity's avatar from a previously uploaded staged media file (`staged_media_handle`) instead of a direct upload. |
| `identities.avatar.upload` | `inkbox.api.identities.avatar.upload` | `write` | Uploads or replaces an identity's avatar image (`file`, multipart), used as the photo on the contact cards it shares. |
| `identities.companion.get` | `inkbox.api.identities.companion.get` | `read` | Returns an identity's Companion mode setting (whether it can join group conversations when an allowed sender brings it in) and per-channel readiness. |
| `identities.companion.getHistory` | `inkbox.api.identities.companion.getHistory` | `read` | Returns the authorized message history for one Companion mode activation (`activation_id`), including the sponsor's triggering message, page by page. |
| `identities.companion.listConversations` | `inkbox.api.identities.companion.listConversations` | `read` | Lists an identity's Companion mode conversation scopes (pending or active sponsorship), optionally filtered by `channel`. |
| `identities.companion.update` | `inkbox.api.identities.companion.update` | `write` | Turns Companion mode on or off (`enabled`) for an identity. Requires an admin API key; it never creates contact rules or channels. |
| `identities.connectImessageNumber` | `inkbox.api.identities.connectImessageNumber` | `write` | Attaches an existing dedicated iMessage number (`imessage_number_id`) to an identity. |
| `identities.contactAccess.get` | `inkbox.api.identities.contactAccess.get` | `read` | Returns what an identity can see and contact for one contact: email and phone visibility, addresses it may send to or receive from, profile and memories. Requires an admin API key. |
| `identities.contactAccess.update` | `inkbox.api.identities.contactAccess.update` | `write` | Sets an identity's access to one contact by group: `email` and `phone` visibility and inbound/outbound contactable lists (replacing that side), `profile` and `memories`. Admin API key only. |
| `identities.contactPermissions.get` | `inkbox.api.identities.contactPermissions.get` | `read` | Returns an identity's legacy per-address email and phone permissions (inbound and outbound) for one contact, plus profile and memories access. Requires an admin API key. |
| `identities.contactPermissions.list` | `inkbox.api.identities.contactPermissions.list` | `read` | Lists every contact in the organization with an identity's permissions, including contacts hidden from that identity. Requires an admin API key. |
| `identities.contactPermissions.update` | `inkbox.api.identities.contactPermissions.update` | `write` | Updates an identity's legacy permissions for one contact: `emails`/`phones` maps set both directions, `inbound_*`/`outbound_*` maps set one. Requires an admin API key. |
| `identities.create` | `inkbox.api.identities.create` | `destructive` | Creates an agent identity (`agent_handle`) with its mailbox and tunnel, optionally provisioning a phone number, claiming an iMessage line or attaching vault secrets. |
| `identities.createTunnel` | `inkbox.api.identities.createTunnel` | `write` | Creates the tunnel for an identity that has none (for example one created with `hosted: true`), named after its handle. Requires an admin API key. |
| `identities.delete` | `inkbox.api.identities.delete` | `destructive` | Deletes an identity with its mailbox and tunnel, revokes its scoped API keys and releases its phone number to the carrier. Cannot be undone; the handle stays reserved. |
| `identities.disconnectImessageNumber` | `inkbox.api.identities.disconnectImessageNumber` | `destructive` | Detaches the dedicated iMessage number from an identity. |
| `identities.domainAffiliation.get` | `inkbox.api.identities.domainAffiliation.get` | `read` | Returns the verified organization domain an identity is affiliated with, as shown to A2A peers, and the affiliation's validity. |
| `identities.domainAffiliation.remove` | `inkbox.api.identities.domainAffiliation.remove` | `destructive` | Removes an identity's affiliation with a verified organization domain. |
| `identities.domainAffiliation.set` | `inkbox.api.identities.domainAffiliation.set` | `write` | Affiliates an identity with a verified organization domain claim (`domain_claim_id`) so A2A peers see it belongs to that domain's owner. |
| `identities.get` | `inkbox.api.identities.get` | `read` | Returns one identity with its linked mailbox, tunnel, phone number and iMessage line, plus its channel and filter settings. |
| `identities.getChannelStatus` | `inkbox.api.identities.getChannelStatus` | `read` | Returns which channels an identity can use right now: email and sending domain, phone, SMS and calling availability, iMessage and WhatsApp status. |
| `identities.getCurrent` | `inkbox.api.identities.getCurrent` | `read` | Returns the identity the calling agent-scoped API key belongs to. |
| `identities.list` | `inkbox.api.identities.list` | `read` | Lists all identities in the organization, newest first, each with its mailbox, tunnel, phone number and iMessage line. |
| `identities.listContactCommunicationPolicies` | `inkbox.api.identities.listContactCommunicationPolicies` | `read` | Lists an identity's per-contact communication policies (which contact addresses it may use) with paging. |
| `identities.mailContactRules.create` | `inkbox.api.identities.mailContactRules.create` | `write` | Creates an email allow or block rule (`action`) for an identity matching an exact address or domain (`match_type`, `match_target`), optionally per `direction`. Admin API key only. |
| `identities.mailContactRules.delete` | `inkbox.api.identities.mailContactRules.delete` | `destructive` | Deletes an email contact rule from an identity. Requires an admin API key. |
| `identities.mailContactRules.get` | `inkbox.api.identities.mailContactRules.get` | `read` | Returns one email allow or block rule of an identity by `rule_id`. |
| `identities.mailContactRules.list` | `inkbox.api.identities.mailContactRules.list` | `read` | Lists an identity's email allow and block rules, newest first, filterable by `action`, `match_type` and `direction`. |
| `identities.mailContactRules.update` | `inkbox.api.identities.mailContactRules.update` | `write` | Changes an email contact rule's `action` or `direction`, or edits one side with `apply_to`. Requires an admin API key. |
| `identities.phoneContactRules.create` | `inkbox.api.identities.phoneContactRules.create` | `write` | Creates a phone allow or block rule for an E.164 number (`match_target`) covering an identity's SMS, calls, iMessage and WhatsApp, optionally per `direction`. Admin API key only. |
| `identities.phoneContactRules.delete` | `inkbox.api.identities.phoneContactRules.delete` | `destructive` | Deletes a phone contact rule from an identity. Requires an admin API key. |
| `identities.phoneContactRules.get` | `inkbox.api.identities.phoneContactRules.get` | `read` | Returns one phone allow or block rule of an identity by `rule_id`. |
| `identities.phoneContactRules.list` | `inkbox.api.identities.phoneContactRules.list` | `read` | Lists an identity's phone allow and block rules, newest first, filterable by `action`, `match_type` and `direction`. |
| `identities.phoneContactRules.update` | `inkbox.api.identities.phoneContactRules.update` | `write` | Changes a phone contact rule's `action` or `direction`, or edits one side with `apply_to`; the number cannot change. Requires an admin API key. |
| `identities.releasePhoneNumber` | `inkbox.api.identities.releasePhoneNumber` | `destructive` | Releases an identity's phone number back to the carrier; it is removed from your account and cannot be reassigned. The identity stays active. |
| `identities.signingKey.createOrRotate` | `inkbox.api.identities.signingKey.createOrRotate` | `destructive` | Creates the identity's webhook signing key, or replaces the existing one so payloads are signed with the new key. The key is returned only once. |
| `identities.signingKey.getStatus` | `inkbox.api.identities.signingKey.getStatus` | `read` | Reports whether an identity has a webhook signing key configured and when it was created, without returning the secret. |
| `identities.slackContactRules.create` | `inkbox.api.identities.slackContactRules.create` | `write` | Creates a Slack allow or block rule for an identity matching one Slack user or a whole workspace (`match_type`, `match_target`), optionally per `direction`. Admin API key only. |
| `identities.slackContactRules.delete` | `inkbox.api.identities.slackContactRules.delete` | `destructive` | Deletes a Slack contact rule from an identity. Requires an admin API key. |
| `identities.slackContactRules.get` | `inkbox.api.identities.slackContactRules.get` | `read` | Returns one Slack allow or block rule of an identity by `rule_id`. |
| `identities.slackContactRules.list` | `inkbox.api.identities.slackContactRules.list` | `read` | Lists an identity's Slack allow and block rules, filterable by `action`, `match_type` (exact_user or workspace) and `direction`. |
| `identities.slackContactRules.update` | `inkbox.api.identities.slackContactRules.update` | `write` | Changes a Slack contact rule's `action` or `direction`, or edits one side with `apply_to`. Requires an admin API key. |
| `identities.update` | `inkbox.api.identities.update` | `destructive` | Updates an identity's display name, description, iMessage and WhatsApp reachability, attached iMessage line, and whitelist/blacklist filter modes per channel. |
| `imessage.assignments.list` | `inkbox.api.imessage.assignments.list` | `read` | Lists active iMessage connections (one per recipient connected to an agent through the router or connect call), newest first, optionally for one `agent_identity_id`. |
| `imessage.assignments.release` | `inkbox.api.imessage.assignments.release` | `destructive` | Disconnects a recipient from an agent (`assignment_id`): their messages stop reaching the agent and sends into that conversation fail. Requires an admin API key. |
| `imessage.checkCapability` | `inkbox.api.imessage.checkCapability` | `read` | Checks which messaging service (`iMessage`, `SMS` or `RCS`) is currently available for an E.164 phone `number`. Read-only; sends nothing. |
| `imessage.connect` | `inkbox.api.imessage.connect` | `destructive` | Connects a recipient (`recipient_number`) to an agent identity over a shared iMessage line, and texts them `first_message` if given. Phone contact rules must allow them. |
| `imessage.contactRules.create` | `inkbox.api.imessage.contactRules.create` | `write` | Creates an allow or block rule for an E.164 number (`match_target`) on an identity's shared phone list (iMessage, SMS, calls, WhatsApp), optionally per `direction`. Admin API key only. |
| `imessage.contactRules.delete` | `inkbox.api.imessage.contactRules.delete` | `destructive` | Deletes a phone-list contact rule (used for iMessage, SMS, calls and WhatsApp) from an identity. Requires an admin API key. |
| `imessage.contactRules.get` | `inkbox.api.imessage.contactRules.get` | `read` | Returns one iMessage/phone-list contact rule of an identity. |
| `imessage.contactRules.list` | `inkbox.api.imessage.contactRules.list` | `read` | Lists an identity's iMessage/phone-list allow and block rules, newest first, filterable by `action`, `match_type` and `direction`. |
| `imessage.contactRules.listForOrg` | `inkbox.api.imessage.contactRules.listForOrg` | `read` | Lists iMessage/phone-list contact rules across every identity the key can see, optionally narrowed to one `agent_identity_id`. Requires an admin API key. |
| `imessage.contactRules.update` | `inkbox.api.imessage.contactRules.update` | `write` | Changes an iMessage/phone-list contact rule's `action` or `direction`, or edits one side with `apply_to`; the number cannot change. Requires an admin API key. |
| `imessage.conversations.get` | `inkbox.api.imessage.conversations.get` | `read` | Returns one iMessage 1:1 or group conversation by `conversation_id`, with participants and connection status. Read its messages with `imessage.messages.list`. |
| `imessage.conversations.getThread` | `inkbox.api.imessage.conversations.getThread` | `read` | Returns the messages of one reply thread (`thread_id`) inside an iMessage conversation, paged with `cursor`. |
| `imessage.conversations.list` | `inkbox.api.imessage.conversations.list` | `read` | Lists iMessage conversations by most recent message, with latest-message preview and unread count, filterable by identity, participants, contact, date range and groups. |
| `imessage.disconnect` | `inkbox.api.imessage.disconnect` | `write` | Disconnects the active iMessage connection between an agent identity (`agent_identity_id`) and a recipient (`recipient_number`). |
| `imessage.getMediaPlayback` | `inkbox.api.imessage.getMediaPlayback` | `read` | Returns an iMessage audio attachment (`media_id`) converted to WAV for browser playback. |
| `imessage.getOnboarding` | `inkbox.api.imessage.getOnboarding` | `read` | Returns instructions a person follows to connect to an agent over iMessage through the router (the `connect @handle` message and links). Sends nothing. |
| `imessage.getTriageNumber` | `inkbox.api.imessage.getTriageNumber` | `read` | Returns the iMessage router number and the `connect @handle` command, with a tap-to-text link and QR code, for people to reach an agent. |
| `imessage.markRead` | `inkbox.api.imessage.markRead` | `write` | Marks a conversation's inbound iMessages as read and sends a read receipt the person sees under their latest message. |
| `imessage.messages.get` | `inkbox.api.imessage.messages.get` | `read` | Returns one iMessage message by `message_id`, with its content, sender, direction, service and thread. |
| `imessage.messages.getThread` | `inkbox.api.imessage.messages.getThread` | `read` | Returns the reply thread containing a message (root and replies), using any message in the thread. |
| `imessage.messages.list` | `inkbox.api.imessage.messages.list` | `read` | Lists iMessage messages, filterable by identity, `conversation_id`, `thread_id`, read and blocked state, groups and date range. |
| `imessage.messages.send` | `inkbox.api.imessage.messages.send` | `destructive` | Sends an iMessage from an identity to `to` (1 to 8 E.164 numbers; 2 or more is a group) or into `conversation_id`, with `text`, media, optional reply target, send style or voice note. |
| `imessage.numbers.claim` | `inkbox.api.imessage.numbers.claim` | `destructive` | Claims one unattached dedicated iMessage line for the organization. Requires an admin API key; the plugin sends a fresh `idempotencyKey` unless you pass one. |
| `imessage.numbers.list` | `inkbox.api.imessage.numbers.list` | `read` | Lists the organization's dedicated iMessage lines, attached or not, with the identity each is attached to. |
| `imessage.reactions.remove` | `inkbox.api.imessage.reactions.remove` | `destructive` | Removes a tapback the agent sent (`reaction_id`) from the person's message. |
| `imessage.reactions.send` | `inkbox.api.imessage.reactions.send` | `destructive` | Sends a tapback (`reaction`) on a message a person sent the agent (`message_id`). The agent cannot react to its own messages. |
| `imessage.router.get` | `inkbox.api.imessage.router.get` | `read` | Returns the organization's own iMessage router line and its settings. Returns 404 when the organization has no router line. |
| `imessage.router.getAvatar` | `inkbox.api.imessage.router.getAvatar` | `read` | Downloads the avatar image of the organization's iMessage router. |
| `imessage.router.getConversation` | `inkbox.api.imessage.router.getConversation` | `read` | Returns one conversation on the organization's iMessage router line. |
| `imessage.router.listConversations` | `inkbox.api.imessage.router.listConversations` | `read` | Lists conversations people have had with the organization's iMessage router line. |
| `imessage.router.listMessages` | `inkbox.api.imessage.router.listMessages` | `read` | Lists the messages of one conversation on the organization's iMessage router line. |
| `imessage.router.update` | `inkbox.api.imessage.router.update` | `write` | Updates the organization's iMessage router settings: contact card fields, `contact_sharing_enabled`, welcome and help messages, and connect/reconnect reply templates. |
| `imessage.router.updateConnectOnboarding` | `inkbox.api.imessage.router.updateConnectOnboarding` | `write` | Sets whether the organization's iMessage router sends first-contact onboarding when someone connects (`send_first_contact_onboarding_on_connect`). |
| `imessage.sendTyping` | `inkbox.api.imessage.sendTyping` | `write` | Shows a typing indicator to the person in a 1:1 iMessage conversation (`conversation_id`). Groups are not supported. |
| `imessage.uploadMedia` | `inkbox.api.imessage.uploadMedia` | `write` | Uploads a file (`file`, multipart) and returns a `media_url` to pass in `media_urls` when sending an iMessage. |
| `inbound.checkSignature` | `inkbox.api.inbound.checkSignature` | `read` | Tests whether a sample request (`headers`, `body`) passes signature settings (`signature`) or a saved source's settings (`source_id`). Stores nothing. |
| `inbound.events.get` | `inkbox.api.inbound.events.get` | `read` | Returns one inbound event received by a source, with delivery status, attempts, signature result and the request as received. |
| `inbound.events.list` | `inkbox.api.inbound.events.list` | `read` | Lists events received by one inbound source, newest first, with delivery status. |
| `inbound.events.replay` | `inkbox.api.inbound.events.replay` | `write` | Delivers an inbound event to the hosted agent again with a new delivery ID and resets its status to pending. |
| `inbound.events.reportResult` | `inkbox.api.inbound.events.reportResult` | `write` | Reports that the agent could not handle an inbound event delivery (`status` failed, `error`, `delivery_id`) so it can be found and replayed. Needs the identity's own key. |
| `inbound.sources.create` | `inkbox.api.inbound.sources.create` | `write` | Creates an inbound webhook source (`name`) for a hosted agent and returns the URL third parties post events to, with optional `signature` checking and `handler` (agent or script). |
| `inbound.sources.delete` | `inkbox.api.inbound.sources.delete` | `destructive` | Deletes an inbound source and all its events; its URL stops working. |
| `inbound.sources.get` | `inkbox.api.inbound.sources.get` | `read` | Returns one inbound source with its URL, signature settings (without the secret) and handler. |
| `inbound.sources.list` | `inkbox.api.inbound.sources.list` | `read` | Lists an identity's inbound webhook sources, oldest first. |
| `inbound.sources.rotate` | `inkbox.api.inbound.sources.rotate` | `destructive` | Issues a new URL for an inbound source; the old URL stops working immediately, so senders must be updated. |
| `inbound.sources.update` | `inkbox.api.inbound.sources.update` | `write` | Updates an inbound source's `name`, `signature` settings (null removes verification) or `handler`. The URL does not change. |
| `mail.drafts.addAttachments` | `inkbox.api.mail.drafts.addAttachments` | `write` | Adds `attachments` to a draft in a mailbox at its current `generation`, returning the updated draft and a new generation. |
| `mail.drafts.create` | `inkbox.api.mail.drafts.create` | `write` | Creates an email draft in a mailbox (`email_address`) with optional `recipients`, subject, text/HTML body, attachments, or reply/forward fields. Does not send. |
| `mail.drafts.delete` | `inkbox.api.mail.drafts.delete` | `destructive` | Deletes a draft at the given `generation` permanently and frees its storage. A draft that is being sent cannot be deleted. |
| `mail.drafts.duplicate` | `inkbox.api.mail.drafts.duplicate` | `write` | Copies a draft revision (`generation`) into a new editable draft with a new ID and Message-ID. |
| `mail.drafts.get` | `inkbox.api.mail.drafts.get` | `read` | Returns one draft with its recipients, bodies, attachment descriptors, `generation` and send state. |
| `mail.drafts.getAttachment` | `inkbox.api.mail.drafts.getAttachment` | `read` | Downloads one attachment of a draft by `part_index` at a given `generation`. |
| `mail.drafts.list` | `inkbox.api.mail.drafts.list` | `read` | Lists a mailbox's drafts, most recently updated first. |
| `mail.drafts.removeAttachment` | `inkbox.api.mail.drafts.removeAttachment` | `destructive` | Removes one attachment (`part_index`) from a draft at the given `generation`, returning the updated draft. |
| `mail.drafts.send` | `inkbox.api.mail.drafts.send` | `destructive` | Sends a draft revision (`generation`) as an email to its recipients, applying the mailbox signature at send time. Delivers to outside recipients and cannot be undone. |
| `mail.drafts.update` | `inkbox.api.mail.drafts.update` | `write` | Updates fields of a draft at its current `generation` (recipients, subject, bodies, reply fields); omitted fields are kept and null clears one. |
| `mail.imports.cancel` | `inkbox.api.mail.imports.cancel` | `write` | Cancels a pending, queued or running mail import job; messages already imported stay in the mailbox. |
| `mail.imports.create` | `inkbox.api.mail.imports.create` | `write` | Creates an email import job for a mailbox (MBOX, EML or ZIP via `source_format`) and returns an upload target for the file. |
| `mail.imports.get` | `inkbox.api.mail.imports.get` | `read` | Returns a mail import job's status and counters (processed, imported, duplicates, failed). |
| `mail.imports.list` | `inkbox.api.mail.imports.list` | `read` | Lists a mailbox's email import jobs, newest first. |
| `mail.imports.reissueUploadUrl` | `inkbox.api.mail.imports.reissueUploadUrl` | `write` | Issues a fresh upload target for a mail import job whose previous upload URL expired before the file was uploaded. |
| `mail.imports.start` | `inkbox.api.mail.imports.start` | `write` | Validates the uploaded file and queues a mail import job to run. |
| `mail.listOrgContactRules` | `inkbox.api.mail.listOrgContactRules` | `read` | Lists email contact rules across every identity in the organization, optionally for one `agent_identity_id`, filterable by `action`, `match_type` and `direction`. Admin API key only. |
| `mail.mailboxes.get` | `inkbox.api.mail.mailboxes.get` | `read` | Returns one mailbox by `email_address`: status, sending domain, filter modes, storage use and signature, optionally with its unread count. |
| `mail.mailboxes.getById` | `inkbox.api.mail.mailboxes.getById` | `read` | Returns one mailbox by its UUID (`mailbox_id`), optionally with its unread count. |
| `mail.mailboxes.list` | `inkbox.api.mail.mailboxes.list` | `read` | Lists the organization's active mailboxes, newest first, optionally with unread counts. |
| `mail.mailboxes.update` | `inkbox.api.mail.mailboxes.update` | `write` | Updates a mailbox's contact-rule `filter_mode` and email signature (`signature_html`, `signature_text`, `signature_enabled`). The address cannot change. |
| `mail.messages.delete` | `inkbox.api.mail.messages.delete` | `destructive` | Deletes one message from a mailbox (`email_address`). |
| `mail.messages.forward` | `inkbox.api.mail.messages.forward` | `destructive` | Forwards a stored message from a mailbox to `recipients` as a new thread, with optional note, extra attachments and original attachments. Sends real email. |
| `mail.messages.get` | `inkbox.api.mail.messages.get` | `read` | Returns one message from a mailbox (`email_address`) with its full plain-text and HTML body. |
| `mail.messages.getAttachment` | `inkbox.api.mail.messages.getAttachment` | `read` | Returns JSON with a temporary download URL for a message attachment (`filename` as in `attachment_metadata`). Fetch the file from that URL; the plugin never follows Inkbox's redirect, so the API key stays on inkbox.ai. |
| `mail.messages.list` | `inkbox.api.mail.messages.list` | `read` | Lists messages in one mailbox (`email_address`), newest first, filterable by `direction`, `folder` and date range. |
| `mail.messages.replyAll` | `inkbox.api.mail.messages.replyAll` | `destructive` | Replies to every participant of a stored message from a mailbox; recipients are resolved server-side and the reply stays in the thread. Sends real email. |
| `mail.messages.search` | `inkbox.api.mail.messages.search` | `read` | Searches messages in one mailbox (`email_address`) with full-text query `q`, ranked by relevance then recency. |
| `mail.messages.send` | `inkbox.api.mail.messages.send` | `destructive` | Sends an email from a mailbox (`email_address`) to `recipients` (to/cc/bcc) with `subject`, text or HTML body, optional attachments, `reply_to` and threading. Delivers real mail. |
| `mail.messages.updateFlags` | `inkbox.api.mail.messages.updateFlags` | `write` | Marks a message in a mailbox as read/unread (`is_read`) or starred (`is_starred`). |
| `mail.threads.delete` | `inkbox.api.mail.threads.delete` | `destructive` | Deletes an email thread and its messages from a mailbox (`email_address`). |
| `mail.threads.get` | `inkbox.api.mail.threads.get` | `read` | Returns one email thread from a mailbox with its messages' metadata (no bodies). |
| `mail.threads.list` | `inkbox.api.mail.threads.list` | `read` | Lists email threads in one mailbox (`email_address`) by latest activity, filterable by `folder`, `participants` or `contact_id`. |
| `mail.threads.listFolders` | `inkbox.api.mail.threads.listFolders` | `read` | Lists the folder names that contain at least one thread in a mailbox. |
| `mail.threads.update` | `inkbox.api.mail.threads.update` | `write` | Moves an email thread in a mailbox to the `inbox`, `spam` or `archive` `folder`. |
| `mail.visibleMessages.delete` | `inkbox.api.mail.visibleMessages.delete` | `destructive` | Deletes a message by UUID from whichever mailbox visible to the API key holds it. |
| `mail.visibleMessages.get` | `inkbox.api.mail.visibleMessages.get` | `read` | Returns a message by UUID from any mailbox the API key can see, with its delivery status; `max_body_chars` limits body length. |
| `mail.visibleMessages.getAttachment` | `inkbox.api.mail.visibleMessages.getAttachment` | `read` | Returns a temporary download URL and metadata for a message attachment (`attachment_ref`), across every mailbox the API key can see. |
| `mail.visibleMessages.list` | `inkbox.api.mail.visibleMessages.list` | `read` | Lists email messages across every mailbox the API key can see, newest first, filterable by `mailbox_id`, `direction`, `folder` and `unread_only`. |
| `mail.visibleMessages.search` | `inkbox.api.mail.visibleMessages.search` | `read` | Searches messages across every mailbox the API key can see with full-text query `q`, optionally narrowed to one `mailbox_id`. |
| `mail.visibleMessages.updateFlags` | `inkbox.api.mail.visibleMessages.updateFlags` | `write` | Marks a message read/unread or starred by UUID, across every mailbox the API key can see. |
| `mail.visibleThreads.delete` | `inkbox.api.mail.visibleThreads.delete` | `destructive` | Deletes an email thread by UUID from whichever mailbox visible to the API key holds it. |
| `mail.visibleThreads.get` | `inkbox.api.mail.visibleThreads.get` | `read` | Returns an email thread by UUID from any mailbox the API key can see, with its messages. |
| `mail.visibleThreads.list` | `inkbox.api.mail.visibleThreads.list` | `read` | Lists email threads across every mailbox the API key can see, filterable by `mailbox_id`, `folder`, `participants` or `contact_id`. |
| `mail.visibleThreads.update` | `inkbox.api.mail.visibleThreads.update` | `write` | Moves an email thread (by UUID, in any mailbox the key can see) to another `folder`. |
| `messageSends.lookup` | `inkbox.api.messageSends.lookup` | `read` | Recovers the message ID of an earlier send (email, SMS, iMessage or WhatsApp) from its idempotency key, `sender_kind`, `sender_id` and `operation`. Read-only; sends nothing. |
| `notes.access.grant` | `inkbox.api.notes.access.grant` | `write` | Grants an agent identity (`identity_id`) read and edit access to a note. |
| `notes.access.list` | `inkbox.api.notes.access.list` | `read` | Lists the agent identities that have been granted access to a note. |
| `notes.access.revoke` | `inkbox.api.notes.access.revoke` | `destructive` | Revokes an agent identity's access to a note. |
| `notes.create` | `inkbox.api.notes.create` | `write` | Creates a note with a `body` and optional `title`; the creator is recorded from the API key. |
| `notes.delete` | `inkbox.api.notes.delete` | `destructive` | Deletes a note. Any caller who can see the note can delete it. |
| `notes.get` | `inkbox.api.notes.get` | `read` | Returns one note by `note_id`, with its body and access grants. |
| `notes.list` | `inkbox.api.notes.list` | `read` | Lists notes visible to the caller, with full-text search `q` over title and body, an `identity_id` filter and ordering. |
| `notes.update` | `inkbox.api.notes.update` | `write` | Updates a note's `title` and/or `body`. Any caller who can see the note can edit it. |
| `organizationDomains.create` | `inkbox.api.organizationDomains.create` | `write` | Starts a DNS ownership claim for a `domain` your organization controls (separate from email sending domains) and returns the TXT record to publish. Requires an admin API key. |
| `organizationDomains.delete` | `inkbox.api.organizationDomains.delete` | `destructive` | Releases an organization domain claim (`claim_id`), freeing a slot in the 10-domain limit. Requires an admin API key. |
| `organizationDomains.get` | `inkbox.api.organizationDomains.get` | `read` | Returns one organization domain claim with its verification state, DNS record and validity dates. |
| `organizationDomains.list` | `inkbox.api.organizationDomains.list` | `read` | Lists the organization's domain ownership claims (verified domains shown to A2A peers). Requires an admin API key. |
| `organizationDomains.verify` | `inkbox.api.organizationDomains.verify` | `write` | Checks the DNS record for an organization domain claim now and returns the resulting state, which may still be pending. |
| `phone.calls.get` | `inkbox.api.phone.calls.get` | `read` | Returns one phone call by `call_id` (dedicated number or iMessage line), with status, direction, mode, voicemail handling and post-call action items. |
| `phone.calls.getSettings` | `inkbox.api.phone.calls.getSettings` | `read` | Returns an identity's effective call settings: incoming call action, whether a WebSocket or webhook is configured, forwarding target and Voice AI setup. |
| `phone.calls.hangup` | `inkbox.api.phone.calls.hangup` | `destructive` | Ends a live phone call by `call_id` from outside the call, including Inkbox Voice AI calls. |
| `phone.calls.list` | `inkbox.api.phone.calls.list` | `read` | Lists phone calls for an agent identity, newest first, across its dedicated number and iMessage lines, filterable by blocked state and date range. |
| `phone.calls.listMcpActivity` | `inkbox.api.phone.calls.listMcpActivity` | `read` | Lists the remote MCP tool calls an Inkbox Voice AI agent made during a call. `phone.calls.listToolInvocations` also covers built-in tools. |
| `phone.calls.listToolInvocations` | `inkbox.api.phone.calls.listToolInvocations` | `read` | Lists a call's built-in and remote MCP tool activity by the Inkbox Voice AI agent, in execution order. |
| `phone.calls.listTranscripts` | `inkbox.api.phone.calls.listTranscripts` | `read` | Lists the transcript segments of a call in order, with speaker (`party`) and timestamps. |
| `phone.calls.place` | `inkbox.api.phone.calls.place` | `destructive` | Places an outbound phone call to `to_number`, bridged to your `client_websocket_url` or run by Inkbox Voice AI (`mode`). Rings a real phone and uses call minutes. |
| `phone.incomingCallAction.get` | `inkbox.api.phone.incomingCallAction.get` | `read` | Returns how an identity handles incoming calls (auto-accept to a WebSocket, reject, webhook, Voice AI or forward) and the related URLs or forwarding target. |
| `phone.incomingCallAction.set` | `inkbox.api.phone.incomingCallAction.set` | `write` | Sets how an identity handles incoming calls (`incoming_call_action`) with its `client_websocket_url`, `incoming_call_webhook_url` or forwarding target. |
| `phone.listOrgContactRules` | `inkbox.api.phone.listOrgContactRules` | `read` | Lists phone contact rules across every identity in the organization, optionally for one `agent_identity_id`, filterable by `action` and `direction`. Requires an admin API key. |
| `phone.media.getPlayback` | `inkbox.api.phone.media.getPlayback` | `read` | Returns an audio attachment from a text message (`media_id`) converted for browser playback. |
| `phone.numbers.get` | `inkbox.api.phone.numbers.get` | `read` | Returns one phone number with its SMS readiness (`sms_status`) and incoming-call configuration. |
| `phone.numbers.list` | `inkbox.api.phone.numbers.list` | `read` | Lists the organization's phone numbers with SMS readiness and incoming-call settings. |
| `phone.numbers.provision` | `inkbox.api.phone.numbers.provision` | `destructive` | Provisions a new local phone number from carrier inventory (optional US `state`) and assigns it to an identity (`agent_handle`). Returns 429 once the organization reaches its active-number cap. |
| `phone.numbers.release` | `inkbox.api.phone.numbers.release` | `destructive` | Releases a phone number back to the carrier and removes it from your organization. It cannot be recovered. |
| `phone.numbers.searchTranscripts` | `inkbox.api.phone.numbers.searchTranscripts` | `read` | Searches call transcript segments for one phone number with full-text query `q`, optionally by `party` (local or remote). |
| `phone.numbers.update` | `inkbox.api.phone.numbers.update` | `write` | Updates a phone number's incoming-call handling (`incoming_call_action`, WebSocket, webhook or forwarding target) and contact-rule `filter_mode`. |
| `phone.smsOptIns.get` | `inkbox.api.phone.smsOptIns.get` | `read` | Returns the SMS consent state (opted in or out, and source) for one recipient number in your organization. |
| `phone.smsOptIns.list` | `inkbox.api.phone.smsOptIns.list` | `read` | Lists SMS consent records for your organization, most recently updated first, optionally by `status`. |
| `phone.smsOptIns.optIn` | `inkbox.api.phone.smsOptIns.optIn` | `write` | Marks a recipient number as opted in to SMS from your organization, after you collected consent yourself. This overrides an earlier STOP. |
| `phone.smsOptIns.optOut` | `inkbox.api.phone.smsOptIns.optOut` | `write` | Marks a recipient number as opted out, so further texts to it from your organization are refused. |
| `phone.textConversations.get` | `inkbox.api.phone.textConversations.get` | `read` | Returns the messages of one SMS/MMS conversation on a phone number, newest first; `key` is the conversation UUID or, for 1:1, the remote number. |
| `phone.textConversations.list` | `inkbox.api.phone.textConversations.list` | `read` | Lists SMS/MMS conversations on a phone number by most recent message, with previews and unread counts; groups only with `include_groups`. |
| `phone.textConversations.update` | `inkbox.api.phone.textConversations.update` | `write` | Marks all messages in an SMS/MMS conversation on a phone number as read or unread (`is_read`). |
| `phone.textConversations.updateById` | `inkbox.api.phone.textConversations.updateById` | `write` | Marks all messages in an SMS/MMS conversation (by `conversation_id`) as read or unread (`is_read`). |
| `phone.texts.delete` | `inkbox.api.phone.texts.delete` | `destructive` | Deletes one SMS/MMS message by `message_id`. |
| `phone.texts.get` | `inkbox.api.phone.texts.get` | `read` | Returns one SMS/MMS message on a phone number, with delivery status and media. |
| `phone.texts.list` | `inkbox.api.phone.texts.list` | `read` | Lists SMS/MMS messages on a phone number, newest first, filterable by read and blocked state and date range. |
| `phone.texts.search` | `inkbox.api.phone.texts.search` | `read` | Searches SMS/MMS message bodies on a phone number with full-text query `q`, ranked by relevance. |
| `phone.texts.send` | `inkbox.api.phone.texts.send` | `destructive` | Sends an SMS, or MMS with `media_urls`, from a phone number to `to` (1 to 8 numbers; 2 or more is a group) or into `conversation_id`. Texts real phones and uses SMS allowance. |
| `phone.texts.update` | `inkbox.api.phone.texts.update` | `destructive` | Marks an SMS/MMS message read or unread (`is_read`), or deletes it (`status: deleted`). |
| `slack.actions.get` | `inkbox.api.slack.actions.get` | `read` | Returns the recorded result of a Slack message send (`action_id`): status, conversation, message timestamp or error. Does not contact Slack. |
| `slack.actions.getByKey` | `inkbox.api.slack.actions.getByKey` | `read` | Looks up a Slack message send by the idempotency key it was sent with, to check whether a timed-out send went through without sending again. |
| `slack.applications.getRemoval` | `inkbox.api.slack.applications.getRemoval` | `read` | Returns the progress of a Slack app removal (`operation_id`), including whether the app was deleted from Slack. |
| `slack.applications.prepare` | `inkbox.api.slack.applications.prepare` | `write` | Starts creating the identity's dedicated Slack app in a saved provisioning workspace (`identity_id`, `provisioning_workspace_id`). Runs in the background; repeat calls reuse it. |
| `slack.applications.remove` | `inkbox.api.slack.applications.remove` | `destructive` | Removes an identity's Slack app from Inkbox and tries to delete it from Slack (`expected_application_generation`, `request_id`); its connection and history become inaccessible. Admin key. |
| `slack.archive.backfill` | `inkbox.api.slack.archive.backfill` | `write` | Imports accessible past Slack history for one conversation (`conversation_id`) or thread (`thread_ts`) into a connection's retained archive. |
| `slack.archive.getCoverage` | `inkbox.api.slack.archive.getCoverage` | `read` | Shows which Slack conversations and threads a connection's archive has imported history for, and how far back. |
| `slack.archive.getSettings` | `inkbox.api.slack.archive.getSettings` | `read` | Returns the retention period (`retention_days`; null means no age limit) for a Slack connection's retained message archive. |
| `slack.archive.listMessages` | `inkbox.api.slack.archive.listMessages` | `read` | Lists retained Slack messages from a connection's archive, newest first, by conversation, thread or timestamp range, with optional cached sender, reaction and file details. |
| `slack.archive.purge` | `inkbox.api.slack.archive.purge` | `destructive` | Deletes all retained Slack messages in a connection's archive and cannot be undone; new messages keep being captured. Requires an admin API key. |
| `slack.archive.search` | `inkbox.api.slack.archive.search` | `read` | Searches retained Slack messages in one connection's archive by keyword (`q`), optionally by conversation, user or time range. Not semantic search. |
| `slack.archive.updateSettings` | `inkbox.api.slack.archive.updateSettings` | `destructive` | Sets how many days a Slack connection keeps retained messages (`retention_days`; null for no limit); shortening it schedules older messages for deletion. Admin API key only. |
| `slack.connections.disconnect` | `inkbox.api.slack.connections.disconnect` | `destructive` | Disconnects a Slack workspace connection from its identity; live Slack operations stop. Requires an admin API key. |
| `slack.connections.getCapabilities` | `inkbox.api.slack.connections.getCapabilities` | `read` | Returns a Slack connection's granted and missing scopes, the features they enable, native status and task-streaming support, and the upload size limit. |
| `slack.connections.importContacts` | `inkbox.api.slack.connections.importContacts` | `write` | Imports Slack users the connection can see (workspace directory, DMs, shared channels, or one `conversation_id`) as Inkbox contacts, one page per call. Requires an admin API key. |
| `slack.connections.list` | `inkbox.api.slack.connections.list` | `read` | Lists an identity's Slack workspace connections (`identity_id`) with status, scopes, and app setup and installation state. |
| `slack.connections.listAvailable` | `inkbox.api.slack.connections.listAvailable` | `read` | Lists connected Slack workspaces across the organization, optionally for one `identity_id`, from saved metadata. Requires an admin API key. |
| `slack.conversations.get` | `inkbox.api.slack.conversations.get` | `read` | Returns one Slack channel, DM or group DM (`conversation_id`) visible to the connection. |
| `slack.conversations.join` | `inkbox.api.slack.conversations.join` | `write` | Makes the identity's Slack bot join a public channel (`conversation_id`). |
| `slack.conversations.leave` | `inkbox.api.slack.conversations.leave` | `write` | Makes the identity's Slack bot leave a channel (`conversation_id`). |
| `slack.conversations.list` | `inkbox.api.slack.conversations.list` | `read` | Lists Slack conversations the bot is a member of through a connection, including Slack Connect channels; `include_unjoined` adds channels it has not joined. |
| `slack.conversations.listMembers` | `inkbox.api.slack.conversations.listMembers` | `read` | Lists the member user IDs of a Slack conversation. |
| `slack.conversations.open` | `inkbox.api.slack.conversations.open` | `write` | Opens or resumes a Slack DM or group DM with `user_ids` and returns the conversation. Sends no message. |
| `slack.conversations.setProcessingStatus` | `inkbox.api.slack.conversations.setProcessingStatus` | `write` | Sets Slack's native agent status (`status`: active, processing, suspended or closed) on a thread (`thread_ts`). Not a message; fails where unsupported. |
| `slack.files.download` | `inkbox.api.slack.files.download` | `read` | Downloads the bytes of a Slack file (`file_id`) through a connection. |
| `slack.files.get` | `inkbox.api.slack.files.get` | `read` | Returns metadata for a Slack file (`file_id`): name, title, MIME type, size and whether it can be downloaded. |
| `slack.files.getPreview` | `inkbox.api.slack.files.getPreview` | `read` | Downloads a cached preview image of a Slack file, when one has been captured. |
| `slack.files.upload` | `inkbox.api.slack.files.upload` | `destructive` | Uploads a file (`filename`, `content_base64`) to a Slack conversation, optionally in a thread with an `initial_comment`. Posts to Slack. |
| `slack.getCachedMedia` | `inkbox.api.slack.getCachedMedia` | `read` | Downloads a cached Slack display image: a user or bot avatar or a custom emoji (`kind`, `resource_id`). |
| `slack.installations.start` | `inkbox.api.slack.installations.start` | `write` | Returns a Slack `authorization_url` to open in a browser to install or reconnect the identity's Slack app in a workspace. |
| `slack.listEmoji` | `inkbox.api.slack.listEmoji` | `read` | Lists a Slack workspace's cached custom emoji, optionally filtered by name `q`. |
| `slack.listOrgContactRules` | `inkbox.api.slack.listOrgContactRules` | `read` | Lists Slack contact rules across every identity in the organization, optionally for one `agent_identity_id`, filterable by `action`, `match_type` and `direction`. |
| `slack.messages.delete` | `inkbox.api.slack.messages.delete` | `destructive` | Deletes a bot message (`message_ts`) from a Slack conversation; other users' messages cannot be deleted. |
| `slack.messages.get` | `inkbox.api.slack.messages.get` | `read` | Returns one Slack message (`message_ts`) from a conversation, under the same permission and retained-history rules as `slack.messages.list`; pass `thread_ts` for a reply. |
| `slack.messages.getContext` | `inkbox.api.slack.messages.getContext` | `read` | Returns the Slack messages around one message (`message_ts`), in its conversation or thread, up to 15 per side. |
| `slack.messages.getPermalink` | `inkbox.api.slack.messages.getPermalink` | `read` | Returns a Slack permalink URL for a message. The link does not grant its recipient access to the conversation. |
| `slack.messages.list` | `inkbox.api.slack.messages.list` | `read` | Reads a Slack conversation's history, or a thread's replies with `thread_ts`: live from Slack with current read permission, otherwise only previously retained messages. |
| `slack.messages.send` | `inkbox.api.slack.messages.send` | `destructive` | Posts a message (`text`) as the identity's Slack bot to a conversation, optionally in a thread (`thread_ts`) or as a voice note. Pass `idempotencyKey` to make a retry safe; otherwise the plugin sends a fresh one. |
| `slack.messages.update` | `inkbox.api.slack.messages.update` | `write` | Edits the `text` of a bot message in a Slack conversation; other users' messages cannot be edited. |
| `slack.operations.get` | `inkbox.api.slack.operations.get` | `read` | Returns the result of a Slack operation (edit, delete, reaction, pin, join, file upload, task stream) by `operation_id`. |
| `slack.operations.getByKey` | `inkbox.api.slack.operations.getByKey` | `read` | Looks up a Slack operation (edit, reaction, pin, file upload, task stream) by its idempotency key, to check a timed-out request without repeating it. |
| `slack.pins.add` | `inkbox.api.slack.pins.add` | `write` | Pins a message (`message_ts`) in a Slack conversation. |
| `slack.pins.list` | `inkbox.api.slack.pins.list` | `read` | Lists the pinned items in a Slack conversation. |
| `slack.pins.remove` | `inkbox.api.slack.pins.remove` | `destructive` | Unpins a message (`message_ts`) in a Slack conversation. |
| `slack.provisioningWorkspaces.list` | `inkbox.api.slack.provisioningWorkspaces.list` | `read` | Lists the Slack workspaces saved for creating identity apps, with their saved-record `id` (not the Slack workspace ID). |
| `slack.provisioningWorkspaces.save` | `inkbox.api.slack.provisioningWorkspaces.save` | `write` | Saves a Slack workspace's app-configuration tokens (`access_token`, `refresh_token`) so Inkbox can create identity apps there. Tokens are never returned. |
| `slack.reactions.add` | `inkbox.api.slack.reactions.add` | `write` | Adds an emoji reaction (`name`) from the bot to a Slack message. |
| `slack.reactions.list` | `inkbox.api.slack.reactions.list` | `read` | Lists the emoji reactions on a Slack message, with counts and reacting users. |
| `slack.reactions.remove` | `inkbox.api.slack.reactions.remove` | `destructive` | Removes the bot's emoji reaction (`name`) from a Slack message. |
| `slack.search` | `inkbox.api.slack.search` | `read` | Searches retained Slack messages by keyword (`q`) across all workspace connections of one identity, optionally narrowed by connection, conversation, user or time. |
| `slack.streams.append` | `inkbox.api.slack.streams.append` | `destructive` | Adds task-update `chunks` to an open Slack task stream (`stream_id`) to show progress in a thread. |
| `slack.streams.start` | `inkbox.api.slack.streams.start` | `destructive` | Starts a native Slack task stream in a thread (`thread_ts`) for a recipient user, with initial task-update `chunks`, to show work progress. Does not start any work. |
| `slack.streams.stop` | `inkbox.api.slack.streams.stop` | `write` | Closes a Slack task stream (`stream_id`), optionally with final task-update `chunks`. |
| `slack.users.get` | `inkbox.api.slack.users.get` | `read` | Returns one Slack user's profile (`user_id`) through a connection. |
| `slack.users.list` | `inkbox.api.slack.users.list` | `read` | Lists users in the connected Slack workspace, paged with `cursor`. |
| `tunnels.get` | `inkbox.api.tunnels.get` | `read` | Returns one tunnel by `tunnel_id`, with its public host, TLS mode, certificate details and whether it is connected right now. |
| `tunnels.list` | `inkbox.api.tunnels.list` | `read` | Lists all tunnels in the organization, each with its public host and whether it is connected right now. |
| `tunnels.signCsr` | `inkbox.api.tunnels.signCsr` | `write` | Signs a certificate signing request (`csr_pem`, CN = tunnel hostname) for a passthrough-TLS tunnel and returns the certificate and chain. |
| `tunnels.update` | `inkbox.api.tunnels.update` | `write` | Updates a tunnel's free-form `metadata` (null or {} clears it). The tunnel name and TLS mode cannot change. |
| `vault.getInfo` | `inkbox.api.vault.getInfo` | `read` | Returns metadata about the organization's vault: ID, key count, secret count and recovery key count. No secret material. |
| `vault.getUnlockBundle` | `inkbox.api.vault.getUnlockBundle` | `read` | Returns the vault's wrapped encryption keys and all encrypted secrets for client-side decryption. Inkbox only stores ciphertext; decrypt locally with the SDK or CLI. |
| `vault.initialize` | `inkbox.api.vault.initialize` | `destructive` | Creates the organization's zero-knowledge vault from client-generated key material (`vault_key`, exactly four `recovery_keys`). Use the SDK or CLI to generate it. |
| `vault.keys.list` | `inkbox.api.vault.keys.list` | `read` | Lists the vault's keys (primary and recovery) as metadata only, optionally filtered by `type`. No wrapped key material. |
| `vault.keys.updatePrimary` | `inkbox.api.vault.keys.updatePrimary` | `destructive` | Replaces the vault's primary key with a new wrapped key (`wrapped_org_encryption_key`, `auth_hash`), proven by the current key or a recovery code, which is then used up. |
| `vault.secrets.create` | `inkbox.api.vault.secrets.create` | `write` | Stores a new vault secret: plaintext `name`, `description` and `secret_type`, plus an `encrypted_payload` encrypted client-side. Inkbox cannot read the payload. |
| `vault.secrets.get` | `inkbox.api.vault.secrets.get` | `read` | Returns one vault secret with its access rules and client-side encrypted `encrypted_payload` (ciphertext); decrypt it locally with the vault key. |
| `vault.secrets.grantAccess` | `inkbox.api.vault.secrets.grantAccess` | `write` | Grants an agent identity (`identity_id`) access to one vault secret. Requires an admin API key. |
| `vault.secrets.list` | `inkbox.api.vault.secrets.list` | `read` | Lists vault secrets (names, types, descriptions, access) without their encrypted payloads, optionally filtered by `secret_type`. |
| `vault.secrets.listAccess` | `inkbox.api.vault.secrets.listAccess` | `read` | Lists the agent identities that have access to one vault secret. |
| `vault.secrets.revokeAccess` | `inkbox.api.vault.secrets.revokeAccess` | `destructive` | Revokes an agent identity's access to one vault secret. |
| `vault.secrets.update` | `inkbox.api.vault.secrets.update` | `write` | Updates a vault secret's `name`, `description` or `encrypted_payload` (new ciphertext encrypted client-side). Only supplied fields change. |
| `voiceAgent.getConfig` | `inkbox.api.voiceAgent.getConfig` | `read` | Returns an identity's Inkbox Voice AI settings: voice, instructions, effective voice and model, and authority mode. |
| `voiceAgent.listVoices` | `inkbox.api.voiceAgent.listVoices` | `read` | Lists the voices available for Inkbox Voice AI calls and the default voice. |
| `voiceAgent.mcpServers.cancelAuthorization` | `inkbox.api.voiceAgent.mcpServers.cancelAuthorization` | `destructive` | Cancels an unfinished OAuth approval (`transaction_id`) for a Voice AI MCP server connection. |
| `voiceAgent.mcpServers.create` | `inkbox.api.voiceAgent.mcpServers.create` | `write` | Adds a remote MCP server (`label`, `url`, `transport`, `auth`) whose tools an identity's Voice AI agent can use on calls, optionally limited to `allowed_tools`. |
| `voiceAgent.mcpServers.delete` | `inkbox.api.voiceAgent.mcpServers.delete` | `destructive` | Deletes a Voice AI MCP server connection; new calls can no longer use its tools. |
| `voiceAgent.mcpServers.disconnect` | `inkbox.api.voiceAgent.mcpServers.disconnect` | `write` | Disconnects the OAuth account from a Voice AI MCP server connection (`expected_version`), keeping its other settings. |
| `voiceAgent.mcpServers.get` | `inkbox.api.voiceAgent.mcpServers.get` | `read` | Returns one Voice AI MCP server connection with its settings, auth state, preparation status and health. |
| `voiceAgent.mcpServers.getAuthorization` | `inkbox.api.voiceAgent.mcpServers.getAuthorization` | `read` | Returns the status of an OAuth approval for a Voice AI MCP server connection, with its `connect_url` and requested scopes. |
| `voiceAgent.mcpServers.getCatalog` | `inkbox.api.voiceAgent.mcpServers.getCatalog` | `read` | Lists the tools, prompts, resources and skills a Voice AI MCP server connection exposes. |
| `voiceAgent.mcpServers.list` | `inkbox.api.voiceAgent.mcpServers.list` | `read` | Lists the remote MCP server connections of an identity's Voice AI agent. |
| `voiceAgent.mcpServers.refresh` | `inkbox.api.voiceAgent.mcpServers.refresh` | `write` | Queues a refresh of a Voice AI MCP server connection's tool catalog. |
| `voiceAgent.mcpServers.startAuthorization` | `inkbox.api.voiceAgent.mcpServers.startAuthorization` | `write` | Starts OAuth for a Voice AI MCP server connection (`expected_version`) and returns a `connect_url` a person must open to approve access. |
| `voiceAgent.mcpServers.test` | `inkbox.api.voiceAgent.mcpServers.test` | `read` | Tests that a Voice AI MCP server connection can be reached and its tools discovered, without running any tool. |
| `voiceAgent.mcpServers.update` | `inkbox.api.voiceAgent.mcpServers.update` | `write` | Updates a Voice AI MCP server connection (`label`, `url`, `auth`, `enabled`, `allowed_tools`, `context`), given its `expected_version`. |
| `voiceAgent.setAuthorityMode` | `inkbox.api.voiceAgent.setAuthorityMode` | `write` | Sets what an identity's Voice AI agent can access on calls (`authority_mode`): `contact_scoped` (the caller only) or `yolo` (all the identity's contacts and messages). |
| `voiceAgent.setConfig` | `inkbox.api.voiceAgent.setConfig` | `write` | Replaces an identity's Voice AI `voice` and `instructions`; omitted fields reset to platform defaults. The authority mode is unchanged. |
| `webhooks.deliveries.list` | `inkbox.api.webhooks.deliveries.list` | `read` | Lists logged webhook delivery attempts, newest first, filterable by identity, subscription, phone number, `event_type` and `success`. |
| `webhooks.deliveries.replay` | `inkbox.api.webhooks.deliveries.replay` | `write` | Re-sends a logged webhook event to its subscription's current URL and auth token, recording a new delivery. |
| `webhooks.getCatalog` | `inkbox.api.webhooks.getCatalog` | `read` | Lists the webhook event types you can subscribe to, with example signature headers. |
| `webhooks.subscriptions.create` | `inkbox.api.webhooks.subscriptions.create` | `write` | Subscribes a `url` to webhook `event_types` (mail, SMS, calls, iMessage and more) for an identity, mailbox or phone number. Returns the identity's signing key once if new. |
| `webhooks.subscriptions.delete` | `inkbox.api.webhooks.subscriptions.delete` | `destructive` | Deletes a webhook subscription, stopping all its event notifications. |
| `webhooks.subscriptions.get` | `inkbox.api.webhooks.subscriptions.get` | `read` | Returns one webhook subscription with its URL, event types and status. |
| `webhooks.subscriptions.list` | `inkbox.api.webhooks.subscriptions.list` | `read` | Lists active webhook subscriptions, newest first, filterable by identity, mailbox, phone number, `url` or `event_type`. |
| `webhooks.subscriptions.update` | `inkbox.api.webhooks.subscriptions.update` | `write` | Updates a webhook subscription's `url`, `event_types` (replaces the whole selection), `context_config` or `auth_token`. |
| `whatsapp.assignments.list` | `inkbox.api.whatsapp.assignments.list` | `read` | Lists active WhatsApp connections (one per recipient connected to an agent through a shared number or the router), newest first, optionally for one `agent_identity_id`. |
| `whatsapp.assignments.release` | `inkbox.api.whatsapp.assignments.release` | `destructive` | Disconnects a recipient from an agent over WhatsApp (`assignment_id`): their messages stop reaching the agent and sends fail. Requires an admin API key. |
| `whatsapp.connect` | `inkbox.api.whatsapp.connect` | `destructive` | Reserves a shared WhatsApp number linking a recipient (`recipient_number`) to an agent identity without sending anything; the agent can reply once they message it. Admin API key only. |
| `whatsapp.conversations.get` | `inkbox.api.whatsapp.conversations.get` | `read` | Returns one WhatsApp 1:1 or group conversation by `conversation_id`, with participants and connection status. |
| `whatsapp.conversations.getThread` | `inkbox.api.whatsapp.conversations.getThread` | `read` | Returns the messages of one reply thread (`thread_id`) inside a WhatsApp conversation, paged with `cursor`. |
| `whatsapp.conversations.list` | `inkbox.api.whatsapp.conversations.list` | `read` | Lists WhatsApp conversations by most recent message, filterable by identity, participants, contact, blocked state, groups and date range. |
| `whatsapp.disconnect` | `inkbox.api.whatsapp.disconnect` | `write` | Disconnects the active WhatsApp connection between an agent identity (`agent_identity_id`) and a recipient (`recipient_number`). Requires an admin API key. |
| `whatsapp.getLimits` | `inkbox.api.whatsapp.getLimits` | `read` | Returns an agent's effective WhatsApp limits (such as media size and opening-message rules) and usage counters for the rolling 24 hours. |
| `whatsapp.getOnboarding` | `inkbox.api.whatsapp.getOnboarding` | `read` | Returns instructions a person follows to reach an agent on WhatsApp (connect command, links and QR codes) and whether the channel is ready. Sends nothing. |
| `whatsapp.getTriageNumber` | `inkbox.api.whatsapp.getTriageNumber` | `read` | Returns the WhatsApp router number and the `connect @handle` command, with a tap link and QR code, for people to reach an agent. |
| `whatsapp.markRead` | `inkbox.api.whatsapp.markRead` | `write` | Marks a WhatsApp conversation's inbound messages as read, optionally only up to `through_message_id`, and sends read receipts the person can see. |
| `whatsapp.media.get` | `inkbox.api.whatsapp.media.get` | `read` | Returns metadata and a fresh temporary download URL for a WhatsApp media item (`media_id`), including any audio transcription. |
| `whatsapp.media.getPlayback` | `inkbox.api.whatsapp.media.getPlayback` | `read` | Returns a WhatsApp audio attachment (`media_id`) converted for browser playback. |
| `whatsapp.media.upload` | `inkbox.api.whatsapp.media.upload` | `write` | Uploads a file (`file`, multipart) for an agent and returns a media ID to send in `media_ids`; pass `recipient_number` when replying through a shared number. |
| `whatsapp.messages.get` | `inkbox.api.whatsapp.messages.get` | `read` | Returns one WhatsApp message by `message_id`, with sender, direction, participants and mentions. |
| `whatsapp.messages.getThread` | `inkbox.api.whatsapp.messages.getThread` | `read` | Returns the reply thread containing a WhatsApp message (root and replies), using any message in the thread. |
| `whatsapp.messages.list` | `inkbox.api.whatsapp.messages.list` | `read` | Lists WhatsApp messages, filterable by identity, `conversation_id`, `thread_id`, read and blocked state, groups and date range. |
| `whatsapp.messages.send` | `inkbox.api.whatsapp.messages.send` | `destructive` | Sends a WhatsApp message from an identity to one E.164 number (`to`) or into `conversation_id`, with `text`, media, a reply target or a voice note. Usually allowed only after the person messaged first. |
| `whatsapp.numbers.assign` | `inkbox.api.whatsapp.numbers.assign` | `write` | Attaches a dedicated WhatsApp number (`account_id`) to an agent (`agent_identity_id`), or detaches it with null, given `expected_revision`. Requires an admin API key. |
| `whatsapp.numbers.list` | `inkbox.api.whatsapp.numbers.list` | `read` | Lists the organization's dedicated WhatsApp numbers with the agent each is assigned to, 100 per page. Requires an admin API key. |
| `whatsapp.reactions.delete` | `inkbox.api.whatsapp.reactions.delete` | `destructive` | Removes a WhatsApp reaction the agent sent (`reaction_id`). |
| `whatsapp.reactions.get` | `inkbox.api.whatsapp.reactions.get` | `read` | Returns one WhatsApp reaction by `reaction_id`. |
| `whatsapp.reactions.send` | `inkbox.api.whatsapp.reactions.send` | `destructive` | Sends an emoji reaction (`reaction` or `custom_emoji`) on a WhatsApp message a person sent (`message_id`). |
| `whatsapp.router.get` | `inkbox.api.whatsapp.router.get` | `read` | Returns the organization's own WhatsApp router (number, revision, profile name, whether it accepts new connections), or null if it has none. Requires an admin API key. |
| `whatsapp.router.listConversations` | `inkbox.api.whatsapp.router.listConversations` | `read` | Lists conversations on the organization's own WhatsApp router, newest first. Requires an admin API key. |
| `whatsapp.router.listMessages` | `inkbox.api.whatsapp.router.listMessages` | `read` | Lists messages exchanged with one person (`remote_number`) on the organization's WhatsApp router, newest first. Requires an admin API key. |
| `whatsapp.router.update` | `inkbox.api.whatsapp.router.update` | `write` | Updates the organization's WhatsApp router `profile_display_name` or `accepting_new_connections`, given `expected_router_id` and `expected_revision`. Admin API key only. |
| `whatsapp.sendTyping` | `inkbox.api.whatsapp.sendTyping` | `write` | Shows a typing indicator to the person in a WhatsApp conversation (`conversation_id`); returns 409 where unsupported. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 8 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/inkbox

## License

Apache-2.0
