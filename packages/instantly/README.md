# @corsair-dev/instantly

Instantly plugin for Corsair: cold email campaigns, leads, the unified inbox, sending accounts and webhooks.

## Install

```bash
pnpm add @corsair-dev/instantly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `accounts.create` | `instantly.api.accounts.create` | `write` | Connect a sending account with its IMAP and SMTP login (Google and Microsoft OAuth connections are not covered by this plugin). The passwords are sent to Instantly and never logged |
| `accounts.delete` | `instantly.api.accounts.delete` | `destructive` | Remove a sending account from the workspace; it stops sending and warming up |
| `accounts.disableWarmup` | `instantly.api.accounts.disableWarmup` | `write` | Turn warmup off for up to 100 sending accounts (runs as a background job; returns the job) |
| `accounts.enableWarmup` | `instantly.api.accounts.enableWarmup` | `write` | Turn warmup on for up to 100 sending accounts (runs as a background job; returns the job) |
| `accounts.get` | `instantly.api.accounts.get` | `read` | Get one sending account by email address |
| `accounts.getDailyAnalytics` | `instantly.api.accounts.getDailyAnalytics` | `read` | Emails sent per day by each sending account. Pass emails or a short date range: on a large workspace Instantly answers 413 otherwise |
| `accounts.getTrackingDomainStatus` | `instantly.api.accounts.getTrackingDomainStatus` | `read` | Check a custom tracking domain's DNS setup |
| `accounts.getWarmupAnalytics` | `instantly.api.accounts.getWarmupAnalytics` | `read` | Get warmup results for up to 100 sending accounts: daily sent, received and landed-in-inbox counts and a 0-100 health score |
| `accounts.list` | `instantly.api.accounts.list` | `read` | List sending accounts (mailboxes) with status, warmup status, daily limit and warmup score; filter by status, provider, tag or search |
| `accounts.listCampaigns` | `instantly.api.accounts.listCampaigns` | `read` | List the campaigns a sending account sends for |
| `accounts.markFixed` | `instantly.api.accounts.markFixed` | `write` | Set a sending account back to active and clear its error message, after fixing its connection |
| `accounts.moveToWorkspace` | `instantly.api.accounts.moveToWorkspace` | `write` | Move sending accounts to another workspace in the same workspace group. Needs the admin workspace's API key |
| `accounts.pause` | `instantly.api.accounts.pause` | `write` | Pause a sending account: it stops sending campaign emails until resumed |
| `accounts.pauseMany` | `instantly.api.accounts.pauseMany` | `write` | Pause up to 100 sending accounts at once; returns which were paused and which failed |
| `accounts.resume` | `instantly.api.accounts.resume` | `write` | Resume a paused sending account so it sends campaign emails again |
| `accounts.testVitals` | `instantly.api.accounts.testVitals` | `read` | Check the health ("vitals") of sending accounts' domains; changes nothing |
| `accounts.update` | `instantly.api.accounts.update` | `write` | Change a sending account's name, daily limit, sending gap, signature, reply-to, tracking domain or warmup settings |
| `apiKeys.create` | `instantly.api.apiKeys.create` | `write` | Create an API key with the given scopes. The response holds the key itself, the only time it is returned in full |
| `apiKeys.delete` | `instantly.api.apiKeys.delete` | `destructive` | Revoke an API key; anything using it stops working |
| `apiKeys.list` | `instantly.api.apiKeys.list` | `read` | List the workspace's API keys with their scopes (key values redacted) |
| `auditLogs.list` | `instantly.api.auditLogs.list` | `read` | List audit log records (who did what, when); filter by activity type, search or date |
| `backgroundJobs.get` | `instantly.api.backgroundJobs.get` | `read` | Get one background job, e.g. the one leads.move or accounts.enableWarmup returned |
| `backgroundJobs.list` | `instantly.api.backgroundJobs.list` | `read` | List background jobs (lead moves, imports, warmup changes) with status and progress |
| `billing.getPlanDetails` | `instantly.api.billing.getPlanDetails` | `read` | Get the workspace's plans and their limits |
| `billing.getSubscriptionDetails` | `instantly.api.billing.getSubscriptionDetails` | `read` | Get the workspace's subscriptions and billing state |
| `blocklist.add` | `instantly.api.blocklist.add` | `write` | Block an email (jane@acme.com) or a whole domain (acme.com) from every campaign |
| `blocklist.addMany` | `instantly.api.blocklist.addMany` | `write` | Block many emails and domains at once |
| `blocklist.deleteAll` | `instantly.api.blocklist.deleteAll` | `destructive` | Delete EVERY blocklist entry (or every domain entry, or every entry matching search). Campaigns can then email those addresses again |
| `blocklist.downloadCsv` | `instantly.api.blocklist.downloadCsv` | `read` | Download the blocklist as CSV text |
| `blocklist.get` | `instantly.api.blocklist.get` | `read` | Get one blocklist entry by ID |
| `blocklist.list` | `instantly.api.blocklist.list` | `read` | List blocked emails and domains |
| `blocklist.remove` | `instantly.api.blocklist.remove` | `destructive` | Remove a blocklist entry, so campaigns can email that address or domain again |
| `blocklist.removeMany` | `instantly.api.blocklist.removeMany` | `destructive` | Remove blocklist entries by ID, so campaigns can email those addresses again |
| `blocklist.update` | `instantly.api.blocklist.update` | `write` | Change the email or domain a blocklist entry blocks |
| `campaigns.activate` | `instantly.api.campaigns.activate` | `write` | Start or resume a campaign. This SENDS REAL EMAIL to the campaign's leads from the connected accounts, on its schedule |
| `campaigns.addVariables` | `instantly.api.campaigns.addVariables` | `write` | Add custom variable names to a campaign, for use as {{variable}} in its copy |
| `campaigns.countLaunched` | `instantly.api.campaigns.countLaunched` | `read` | Count the campaigns ever launched in the workspace |
| `campaigns.create` | `instantly.api.campaigns.create` | `write` | Create a campaign as a draft: schedule, one sequence of email steps with A/B variants, sending accounts, daily limit and stop rules (stop_on_reply, stop_for_company). Sends nothing until campaigns.activate |
| `campaigns.createFromShared` | `instantly.api.campaigns.createFromShared` | `write` | Create a campaign in this workspace from one shared with campaigns.share |
| `campaigns.delete` | `instantly.api.campaigns.delete` | `destructive` | Delete a campaign permanently |
| `campaigns.duplicate` | `instantly.api.campaigns.duplicate` | `write` | Copy a campaign into a new one, optionally with a new name |
| `campaigns.export` | `instantly.api.campaigns.export` | `read` | Export a campaign's settings and sequence as JSON; changes nothing |
| `campaigns.get` | `instantly.api.campaigns.get` | `read` | Get one campaign with its schedule, sequence steps and settings |
| `campaigns.getAnalytics` | `instantly.api.campaigns.getAnalytics` | `read` | Per-campaign totals: leads, contacted, sent, opens, replies, clicks, bounces, unsubscribes, completed and opportunities, for all campaigns or chosen ones, optionally in a date range |
| `campaigns.getAnalyticsOverview` | `instantly.api.campaigns.getAnalyticsOverview` | `read` | Combined totals across one, several or all campaigns: sent, opens, replies, clicks, bounces, interested, meetings booked and closed |
| `campaigns.getDailyAnalytics` | `instantly.api.campaigns.getDailyAnalytics` | `read` | Per-day sent, opens, replies and clicks for one campaign or all, optionally in a date range |
| `campaigns.getSendingStatus` | `instantly.api.campaigns.getSendingStatus` | `read` | Explain why a campaign is not sending, or sending slower than expected |
| `campaigns.getStepAnalytics` | `instantly.api.campaigns.getStepAnalytics` | `read` | Sent, opens, replies and clicks per sequence step and A/B variant, for one campaign or all |
| `campaigns.list` | `instantly.api.campaigns.list` | `read` | List campaigns with status, schedule, sending accounts and daily limit; filter by name, status or tag |
| `campaigns.pause` | `instantly.api.campaigns.pause` | `write` | Pause a campaign: it stops sending until activated again |
| `campaigns.searchByLead` | `instantly.api.campaigns.searchByLead` | `read` | Find the campaigns a lead is in, by their email address |
| `campaigns.share` | `instantly.api.campaigns.share` | `write` | Share a campaign for 7 days so other Instantly users can copy it with campaigns.createFromShared |
| `campaigns.update` | `instantly.api.campaigns.update` | `write` | Change a campaign's name, schedule, sequence steps, sending accounts, daily limit or stop rules; only the fields passed change |
| `crmActions.deletePhoneNumber` | `instantly.api.crmActions.deletePhoneNumber` | `destructive` | Release a phone number from the workspace and its provider |
| `crmActions.listPhoneNumbers` | `instantly.api.crmActions.listPhoneNumbers` | `read` | List the workspace's phone numbers |
| `customPromptTemplates.create` | `instantly.api.customPromptTemplates.create` | `write` | Create a custom AI prompt template; {{property}} placeholders take lead fields |
| `customPromptTemplates.delete` | `instantly.api.customPromptTemplates.delete` | `destructive` | Delete a custom AI prompt template |
| `customPromptTemplates.get` | `instantly.api.customPromptTemplates.get` | `read` | Get one custom AI prompt template |
| `customPromptTemplates.list` | `instantly.api.customPromptTemplates.list` | `read` | List custom AI prompt templates, including public ones |
| `customPromptTemplates.update` | `instantly.api.customPromptTemplates.update` | `write` | Change a custom AI prompt template |
| `customTagMappings.list` | `instantly.api.customTagMappings.list` | `read` | List which tags are assigned to which accounts and campaigns |
| `customTags.create` | `instantly.api.customTags.create` | `write` | Create a tag for organizing sending accounts and campaigns |
| `customTags.delete` | `instantly.api.customTags.delete` | `destructive` | Delete a tag; the accounts and campaigns that had it lose it |
| `customTags.get` | `instantly.api.customTags.get` | `read` | Get one tag by ID |
| `customTags.list` | `instantly.api.customTags.list` | `read` | List the workspace's tags |
| `customTags.toggleResource` | `instantly.api.customTags.toggleResource` | `write` | Assign tags to, or remove them from, sending accounts or campaigns (by IDs or all matching a filter) |
| `customTags.update` | `instantly.api.customTags.update` | `write` | Rename a tag or change its description |
| `domainForwarding.get` | `instantly.api.domainForwarding.get` | `read` | Get the web forwarding set on a domain ordered through Instantly |
| `domainForwarding.remove` | `instantly.api.domainForwarding.remove` | `destructive` | Remove a domain's web forwarding. Limited to 10 requests a minute |
| `domainForwarding.set` | `instantly.api.domainForwarding.set` | `write` | Forward web visits to a domain ordered through Instantly to another domain |
| `emails.countUnread` | `instantly.api.emails.countUnread` | `read` | Count unread emails in the Unibox |
| `emails.delete` | `instantly.api.emails.delete` | `destructive` | Delete an email from the Unibox |
| `emails.forward` | `instantly.api.emails.forward` | `write` | Forward an email from the Unibox to other recipients. This SENDS REAL EMAIL from the chosen sending account, and is never retried automatically |
| `emails.get` | `instantly.api.emails.get` | `read` | Get one email with its full body and thread_id |
| `emails.list` | `instantly.api.emails.list` | `read` | List Unibox emails; email_type received lists replies from leads, the way to read replies on plans without webhooks. Filter by lead, campaign, sending account, unread or date. Limited to 20 requests a minute |
| `emails.markThreadRead` | `instantly.api.emails.markThreadRead` | `write` | Mark every email in a thread as read |
| `emails.reply` | `instantly.api.emails.reply` | `write` | Reply to an email in its thread. This SENDS A REAL EMAIL from the chosen sending account to the lead, and is never retried automatically |
| `emails.sendTest` | `instantly.api.emails.sendTest` | `write` | Send a test email from a sending account. This SENDS REAL EMAIL to the given addresses (it does not appear in the Unibox). Limited to 10 a minute |
| `emails.update` | `instantly.api.emails.update` | `write` | Mark an email read or unread, or set a Unibox reminder on it |
| `emailTemplates.create` | `instantly.api.emailTemplates.create` | `write` | Save an email template (name and body) |
| `emailTemplates.delete` | `instantly.api.emailTemplates.delete` | `destructive` | Delete a saved email template |
| `emailTemplates.list` | `instantly.api.emailTemplates.list` | `read` | List saved email templates |
| `emailVerification.getStatus` | `instantly.api.emailVerification.getStatus` | `read` | Get the result of an email verification started with emailVerification.verify |
| `emailVerification.verify` | `instantly.api.emailVerification.verify` | `write` | Verify one email address. SPENDS Instantly email-verification credits (the response reports credits and credits_used) and is never retried automatically. A slow check answers pending; read the result with emailVerification.getStatus |
| `engageItems.deleteMany` | `instantly.api.engageItems.deleteMany` | `destructive` | Delete several Engage items (campaigns, agents, automations...) at once |
| `engageItems.list` | `instantly.api.engageItems.list` | `read` | List Engage items: campaigns, AI agents, automations, broadcasts and journeys in one list |
| `inboxPlacementAnalytics.get` | `instantly.api.inboxPlacementAnalytics.get` | `read` | Get one inbox placement result |
| `inboxPlacementAnalytics.getDeliverabilityInsights` | `instantly.api.inboxPlacementAnalytics.getDeliverabilityInsights` | `read` | Deliverability insights for one inbox placement test, optionally against an earlier period; changes nothing |
| `inboxPlacementAnalytics.getStatsByDate` | `instantly.api.inboxPlacementAnalytics.getStatsByDate` | `read` | Inbox, spam and category counts per day for a scheduled inbox placement test; changes nothing |
| `inboxPlacementAnalytics.getStatsByTest` | `instantly.api.inboxPlacementAnalytics.getStatsByTest` | `read` | Inbox, spam and category counts for inbox placement tests; changes nothing |
| `inboxPlacementAnalytics.list` | `instantly.api.inboxPlacementAnalytics.list` | `read` | Where each inbox placement test email landed, per recipient; filter by test, date, provider or sender |
| `inboxPlacementReports.get` | `instantly.api.inboxPlacementReports.get` | `read` | Get one blacklist and SpamAssassin report |
| `inboxPlacementReports.list` | `instantly.api.inboxPlacementReports.list` | `read` | List blacklist and SpamAssassin reports for inbox placement tests |
| `inboxPlacementTests.create` | `instantly.api.inboxPlacementTests.create` | `write` | Create an inbox placement test: a test email sent to seed inboxes to see where it lands (inbox, spam or a category tab). With sending_method 1 it This SENDS REAL EMAIL from the given accounts; with 2 you send it from outside Instantly |
| `inboxPlacementTests.delete` | `instantly.api.inboxPlacementTests.delete` | `destructive` | Delete an inbox placement test |
| `inboxPlacementTests.get` | `instantly.api.inboxPlacementTests.get` | `read` | Get one inbox placement test |
| `inboxPlacementTests.list` | `instantly.api.inboxPlacementTests.list` | `read` | List inbox placement tests |
| `inboxPlacementTests.listEspOptions` | `instantly.api.inboxPlacementTests.listEspOptions` | `read` | List the email providers an inbox placement test can send to (for recipients_labels) |
| `inboxPlacementTests.update` | `instantly.api.inboxPlacementTests.update` | `write` | Rename an inbox placement test, change its schedule or automations, or pause or resume it |
| `leadLabels.create` | `instantly.api.leadLabels.create` | `write` | Create a custom lead label (a status such as "Demo requested") marked positive, negative or neutral |
| `leadLabels.delete` | `instantly.api.leadLabels.delete` | `destructive` | Delete a custom lead label; its leads move to reassigned_status |
| `leadLabels.get` | `instantly.api.leadLabels.get` | `read` | Get one custom lead label by ID |
| `leadLabels.list` | `instantly.api.leadLabels.list` | `read` | List the workspace's custom lead labels |
| `leadLabels.testAiReplyLabel` | `instantly.api.leadLabels.testAiReplyLabel` | `read` | Ask which label Instantly's AI would give a reply text, to test custom labels. Changes nothing, but the workspace gets 500 of these tests per 30 days |
| `leadLabels.update` | `instantly.api.leadLabels.update` | `write` | Rename a custom lead label or change its description, sentiment or AI use |
| `leadLists.create` | `instantly.api.leadLists.create` | `write` | Create a lead list to hold leads outside any campaign (add to it with leads.addBulk list_id) |
| `leadLists.delete` | `instantly.api.leadLists.delete` | `destructive` | Delete a lead list permanently |
| `leadLists.get` | `instantly.api.leadLists.get` | `read` | Get one lead list by ID: name, owner and enrichment setting |
| `leadLists.getVerificationStats` | `instantly.api.leadLists.getVerificationStats` | `read` | Counts of a lead list's leads by email verification result |
| `leadLists.list` | `instantly.api.leadLists.list` | `read` | List lead lists (leads stored outside any campaign) |
| `leadLists.update` | `instantly.api.leadLists.update` | `write` | Rename a lead list, change its owner or turn enrichment of new leads on or off |
| `leads.addBulk` | `instantly.api.leads.addBulk` | `write` | Add up to 1,000 leads to one campaign or list, with custom variables. Skips leads already in the workspace unless skip_if_in_workspace is false, and is never retried automatically. Every lead uploaded counts toward the plan's lifetime contact limit, including re-uploads and the same person in a second campaign; re-adding or moving a lead who already replied restarts their sequence at step 1 |
| `leads.assign` | `instantly.api.leads.assign` | `write` | Assign leads (by IDs or filters) to workspace users. Runs in the background |
| `leads.create` | `instantly.api.leads.create` | `write` | Add one lead to a campaign or list. Skips leads already in the workspace unless skip_if_in_workspace is false. Every lead uploaded counts toward the plan's lifetime contact limit, including re-uploads and the same person in a second campaign; re-adding or moving a lead who already replied restarts their sequence at step 1 |
| `leads.delete` | `instantly.api.leads.delete` | `destructive` | Delete a lead from the workspace. Its upload still counts toward the lifetime contact limit |
| `leads.deleteMany` | `instantly.api.leads.deleteMany` | `destructive` | Delete leads from one campaign or list, optionally only some IDs or a status. Their uploads still count toward the lifetime contact limit |
| `leads.get` | `instantly.api.leads.get` | `read` | Get one lead with status, interest status, open/reply/click counts and custom variables |
| `leads.list` | `instantly.api.leads.list` | `read` | List leads in a campaign or list, or across the workspace; filter by email, status (replied, interested, bounced and more) or search |
| `leads.merge` | `instantly.api.leads.merge` | `destructive` | Merge one lead into another (destination_lead_id); the first lead is removed |
| `leads.move` | `instantly.api.leads.move` | `write` | Move or copy leads (by IDs or filters) to another campaign or list, as a background job; returns the job. Moving a lead who already replied restarts their sequence at step 1 |
| `leads.moveToSubsequence` | `instantly.api.leads.moveToSubsequence` | `write` | Put a lead into a subsequence. This SENDS REAL EMAIL: the subsequence starts emailing the lead |
| `leads.removeFromSubsequence` | `instantly.api.leads.removeFromSubsequence` | `destructive` | Take a lead out of the subsequence it is in; it stops getting that subsequence's emails |
| `leads.update` | `instantly.api.leads.update` | `write` | Update a lead's name, company, job title, phone, website, personalization or custom variables. Its status is read-only: to stop follow-ups use leads.updateInterestStatus |
| `leads.updateInterestStatus` | `instantly.api.leads.updateInterestStatus` | `write` | Set a lead's interest status by email (Interested, Meeting booked, Not interested, Wrong person and so on, or null to reset). In a campaign this completes the lead, which stops its follow-ups: use it when a lead answered on another channel. Applied in the background |
| `subsequences.create` | `instantly.api.subsequences.create` | `write` | Create a subsequence: follow-up emails for a campaign's leads who meet its conditions (a reply, a lead status, an email opened...). While the campaign runs, matching leads get its emails |
| `subsequences.delete` | `instantly.api.subsequences.delete` | `destructive` | Delete a subsequence; its leads stop getting its emails |
| `subsequences.duplicate` | `instantly.api.subsequences.duplicate` | `write` | Copy a subsequence, with the same trigger conditions, into a campaign |
| `subsequences.get` | `instantly.api.subsequences.get` | `read` | Get one subsequence with its conditions, schedule and steps |
| `subsequences.getAnalytics` | `instantly.api.subsequences.getAnalytics` | `read` | Emails sent, unique opens and unique replies for each of a campaign's subsequences |
| `subsequences.getSendingStatus` | `instantly.api.subsequences.getSendingStatus` | `read` | Explain why a subsequence is not sending, or sending slower than expected |
| `subsequences.getStepAnalytics` | `instantly.api.subsequences.getStepAnalytics` | `read` | Sent, opens, replies and clicks per step and A/B variant of one subsequence |
| `subsequences.list` | `instantly.api.subsequences.list` | `read` | List subsequences, by parent campaign or name |
| `subsequences.pause` | `instantly.api.subsequences.pause` | `write` | Pause a subsequence: it stops sending until resumed |
| `subsequences.resume` | `instantly.api.subsequences.resume` | `write` | Resume a paused subsequence. This SENDS REAL EMAIL to the leads that meet its conditions |
| `subsequences.update` | `instantly.api.subsequences.update` | `write` | Change a subsequence's name, conditions, schedule, steps or daily limit |
| `webhookEvents.get` | `instantly.api.webhookEvents.get` | `read` | Get one webhook delivery with its payload and response |
| `webhookEvents.getSummary` | `instantly.api.webhookEvents.getSummary` | `read` | Totals and success rate of webhook deliveries, optionally in a date range |
| `webhookEvents.getSummaryByDate` | `instantly.api.webhookEvents.getSummaryByDate` | `read` | Webhook delivery totals and success rate per day |
| `webhookEvents.list` | `instantly.api.webhookEvents.list` | `read` | List webhook deliveries with their payload, status code and retries; filter by success, date or search |
| `webhooks.create` | `instantly.api.webhooks.create` | `write` | Subscribe a URL to an event (reply_received, email_bounced, lead_interested...) or all_events, for one campaign or all. Attaches the plugin's webhook secret so Corsair can verify deliveries. Webhooks need the Hypergrowth plan or higher; on Growth, poll emails.list with email_type received instead |
| `webhooks.delete` | `instantly.api.webhooks.delete` | `destructive` | Delete a webhook subscription; Instantly stops sending its events |
| `webhooks.get` | `instantly.api.webhooks.get` | `read` | Get one webhook subscription (header values redacted) |
| `webhooks.list` | `instantly.api.webhooks.list` | `read` | List webhook subscriptions with their URL, event type, campaign and status (header values redacted) |
| `webhooks.listEventTypes` | `instantly.api.webhooks.listEventTypes` | `read` | List the event types a webhook can subscribe to, including the workspace's custom labels |
| `webhooks.resume` | `instantly.api.webhooks.resume` | `write` | Turn a webhook back on after Instantly disabled it for failed deliveries |
| `webhooks.test` | `instantly.api.webhooks.test` | `write` | Send a test payload to the webhook's URL |
| `webhooks.update` | `instantly.api.webhooks.update` | `write` | Change a webhook's URL, event type, campaign or headers. Passing headers replaces them all, including the x-corsair-webhook-secret Corsair verifies deliveries with |
| `workspace.cancelRemoval` | `instantly.api.workspace.cancelRemoval` | `write` | Cancel a scheduled workspace deletion |
| `workspace.changeOwner` | `instantly.api.workspace.changeOwner` | `destructive` | Make another user the owner of the workspace. The current owner loses ownership, so this cannot be undone from this API key |
| `workspace.deleteWhitelabelDomain` | `instantly.api.workspace.deleteWhitelabelDomain` | `destructive` | Remove the agency (white-label) domain |
| `workspace.get` | `instantly.api.workspace.get` | `read` | Get the workspace this API key belongs to: ID, name and plan |
| `workspace.getWhitelabelDomain` | `instantly.api.workspace.getWhitelabelDomain` | `read` | Get the agency (white-label) domain and its verification state |
| `workspace.scheduleRemoval` | `instantly.api.workspace.scheduleRemoval` | `destructive` | Schedule the WHOLE WORKSPACE for deletion in 24 hours. workspace.cancelRemoval stops it before then |
| `workspace.setWhitelabelDomain` | `instantly.api.workspace.setWhitelabelDomain` | `write` | Set the agency (white-label) domain clients see |
| `workspace.update` | `instantly.api.workspace.update` | `write` | Rename the workspace or change its logo |
| `workspaceGroupMembers.create` | `instantly.api.workspaceGroupMembers.create` | `write` | Invite another workspace into this admin workspace's group; it joins once its owner accepts |
| `workspaceGroupMembers.delete` | `instantly.api.workspaceGroupMembers.delete` | `destructive` | Remove a workspace from this admin workspace's group |
| `workspaceGroupMembers.get` | `instantly.api.workspaceGroupMembers.get` | `read` | Get one workspace group member |
| `workspaceGroupMembers.getAdmin` | `instantly.api.workspaceGroupMembers.getAdmin` | `read` | Get the admin workspace this workspace belongs to |
| `workspaceGroupMembers.list` | `instantly.api.workspaceGroupMembers.list` | `read` | List the workspaces in this admin workspace's group |
| `workspaceMembers.create` | `instantly.api.workspaceMembers.create` | `write` | Add a user to the workspace by email, with a role |
| `workspaceMembers.delete` | `instantly.api.workspaceMembers.delete` | `destructive` | Remove a member from the workspace |
| `workspaceMembers.get` | `instantly.api.workspaceMembers.get` | `read` | Get one workspace member by ID |
| `workspaceMembers.list` | `instantly.api.workspaceMembers.list` | `read` | List the workspace's members |
| `workspaceMembers.update` | `instantly.api.workspaceMembers.update` | `write` | Change a member's nickname or role |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 19 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/instantly

## License

Apache-2.0
