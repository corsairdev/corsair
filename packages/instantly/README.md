# @corsair-dev/instantly

Instantly plugin for Corsair: cold email campaigns, leads, the unified inbox, sending accounts and webhooks.

## Install

```bash
pnpm add @corsair-dev/instantly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.disableWarmup` | `instantly.api.accounts.disableWarmup` | `write` | Turn warmup off for up to 100 sending accounts (runs as a background job; returns the job) |
| `accounts.enableWarmup` | `instantly.api.accounts.enableWarmup` | `write` | Turn warmup on for up to 100 sending accounts (runs as a background job; returns the job) |
| `accounts.get` | `instantly.api.accounts.get` | `read` | Get one sending account by email address |
| `accounts.getWarmupAnalytics` | `instantly.api.accounts.getWarmupAnalytics` | `read` | Get warmup results for up to 100 sending accounts: daily sent, received and landed-in-inbox counts and a 0-100 health score |
| `accounts.list` | `instantly.api.accounts.list` | `read` | List sending accounts (mailboxes) with status, warmup status, daily limit and warmup score; filter by status, provider, tag or search |
| `accounts.pause` | `instantly.api.accounts.pause` | `write` | Pause a sending account: it stops sending campaign emails until resumed |
| `accounts.resume` | `instantly.api.accounts.resume` | `write` | Resume a paused sending account so it sends campaign emails again |
| `blocklist.add` | `instantly.api.blocklist.add` | `write` | Block an email (jane@acme.com) or a whole domain (acme.com) from every campaign |
| `blocklist.list` | `instantly.api.blocklist.list` | `read` | List blocked emails and domains |
| `blocklist.remove` | `instantly.api.blocklist.remove` | `destructive` | Remove a blocklist entry, so campaigns can email that address or domain again |
| `campaigns.activate` | `instantly.api.campaigns.activate` | `write` | Start or resume a campaign. This SENDS REAL EMAIL to the campaign's leads from the connected accounts, on its schedule |
| `campaigns.create` | `instantly.api.campaigns.create` | `write` | Create a campaign as a draft: schedule, one sequence of email steps with A/B variants, sending accounts, daily limit and stop rules (stop_on_reply, stop_for_company). Sends nothing until campaigns.activate |
| `campaigns.get` | `instantly.api.campaigns.get` | `read` | Get one campaign with its schedule, sequence steps and settings |
| `campaigns.getAnalytics` | `instantly.api.campaigns.getAnalytics` | `read` | Per-campaign totals: leads, contacted, sent, opens, replies, clicks, bounces, unsubscribes, completed and opportunities, for all campaigns or chosen ones, optionally in a date range |
| `campaigns.getAnalyticsOverview` | `instantly.api.campaigns.getAnalyticsOverview` | `read` | Combined totals across one, several or all campaigns: sent, opens, replies, clicks, bounces, interested, meetings booked and closed |
| `campaigns.getStepAnalytics` | `instantly.api.campaigns.getStepAnalytics` | `read` | Sent, opens, replies and clicks per sequence step and A/B variant, for one campaign or all |
| `campaigns.list` | `instantly.api.campaigns.list` | `read` | List campaigns with status, schedule, sending accounts and daily limit; filter by name, status or tag |
| `campaigns.pause` | `instantly.api.campaigns.pause` | `write` | Pause a campaign: it stops sending until activated again |
| `campaigns.update` | `instantly.api.campaigns.update` | `write` | Change a campaign's name, schedule, sequence steps, sending accounts, daily limit or stop rules; only the fields passed change |
| `emails.countUnread` | `instantly.api.emails.countUnread` | `read` | Count unread emails in the Unibox |
| `emails.get` | `instantly.api.emails.get` | `read` | Get one email with its full body and thread_id |
| `emails.list` | `instantly.api.emails.list` | `read` | List Unibox emails; email_type received lists replies from leads, the way to read replies on plans without webhooks. Filter by lead, campaign, sending account, unread or date. Limited to 20 requests a minute |
| `emails.markThreadRead` | `instantly.api.emails.markThreadRead` | `write` | Mark every email in a thread as read |
| `emails.reply` | `instantly.api.emails.reply` | `write` | Reply to an email in its thread. This SENDS A REAL EMAIL from the chosen sending account to the lead, and is never retried automatically |
| `leadLists.create` | `instantly.api.leadLists.create` | `write` | Create a lead list to hold leads outside any campaign (add to it with leads.addBulk list_id) |
| `leadLists.list` | `instantly.api.leadLists.list` | `read` | List lead lists (leads stored outside any campaign) |
| `leads.addBulk` | `instantly.api.leads.addBulk` | `write` | Add up to 1,000 leads to one campaign or list, with custom variables. Skips leads already in the workspace unless skip_if_in_workspace is false, and is never retried automatically. Every lead uploaded counts toward the plan's lifetime contact limit, including re-uploads and the same person in a second campaign; re-adding or moving a lead who already replied restarts their sequence at step 1 |
| `leads.create` | `instantly.api.leads.create` | `write` | Add one lead to a campaign or list. Skips leads already in the workspace unless skip_if_in_workspace is false. Every lead uploaded counts toward the plan's lifetime contact limit, including re-uploads and the same person in a second campaign; re-adding or moving a lead who already replied restarts their sequence at step 1 |
| `leads.delete` | `instantly.api.leads.delete` | `destructive` | Delete a lead from the workspace. Its upload still counts toward the lifetime contact limit |
| `leads.get` | `instantly.api.leads.get` | `read` | Get one lead with status, interest status, open/reply/click counts and custom variables |
| `leads.list` | `instantly.api.leads.list` | `read` | List leads in a campaign or list, or across the workspace; filter by email, status (replied, interested, bounced and more) or search |
| `leads.update` | `instantly.api.leads.update` | `write` | Update a lead's name, company, job title, phone, website, personalization or custom variables. Its status is read-only: to stop follow-ups use leads.updateInterestStatus |
| `leads.updateInterestStatus` | `instantly.api.leads.updateInterestStatus` | `write` | Set a lead's interest status by email (Interested, Meeting booked, Not interested, Wrong person and so on, or null to reset). In a campaign this completes the lead, which stops its follow-ups: use it when a lead answered on another channel. Applied in the background |
| `webhooks.create` | `instantly.api.webhooks.create` | `write` | Subscribe a URL to an event (reply_received, email_bounced, lead_interested...) or all_events, for one campaign or all. Attaches the plugin's webhook secret so Corsair can verify deliveries. Webhooks need the Hypergrowth plan or higher; on Growth, poll emails.list with email_type received instead |
| `webhooks.delete` | `instantly.api.webhooks.delete` | `destructive` | Delete a webhook subscription; Instantly stops sending its events |
| `webhooks.list` | `instantly.api.webhooks.list` | `read` | List webhook subscriptions with their URL, event type, campaign and status (header values redacted) |
| `webhooks.listEventTypes` | `instantly.api.webhooks.listEventTypes` | `read` | List the event types a webhook can subscribe to, including the workspace's custom labels |
| `workspace.get` | `instantly.api.workspace.get` | `read` | Get the workspace this API key belongs to: ID, name and plan |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 19 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/instantly

## License

Apache-2.0
