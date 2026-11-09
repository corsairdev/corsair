# @corsair-dev/inboxkit

InboxKit plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/inboxkit
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.get` | `inboxkit.api.account.get` | `read` | The team's wallet balance, mailbox slots, current plan, auto top-up settings and price per mailbox. |
| `billing.addCredits` | `inboxkit.api.billing.addCredits` | `destructive` | SPENDS MONEY. Buy wallet credits. With direct_charge the saved card is charged at once; otherwise this returns a hosted checkout link. |
| `billing.cancelSubscription` | `inboxkit.api.billing.cancelSubscription` | `destructive` | Cancel the active subscription. |
| `billing.changeSubscription` | `inboxkit.api.billing.changeSubscription` | `destructive` | SPENDS MONEY. Switch to another plan or start one. May charge the saved card at once or return a payment link. |
| `billing.getPaymentStatus` | `inboxkit.api.billing.getPaymentStatus` | `read` | Whether a hosted-checkout or guest-mode payment has finished and its credits were applied. |
| `billing.getPortalLink` | `inboxkit.api.billing.getPortalLink` | `destructive` | A Stripe billing portal link for this team. Whoever holds the link can manage payment methods and invoices, so keep it private. |
| `billing.getPricingPlans` | `inboxkit.api.billing.getPricingPlans` | `read` | Available pricing plans, with upgrade and downgrade options from the current plan. |
| `billing.getSubscription` | `inboxkit.api.billing.getSubscription` | `read` | The current subscription and the available plans. |
| `billing.getWallet` | `inboxkit.api.billing.getWallet` | `read` | Wallet balance, credits used and auto top-up settings. |
| `billing.getWalletLogs` | `inboxkit.api.billing.getWalletLogs` | `read` | Wallet activity log, with filters by type, kind, status, workspace and date. |
| `billing.listTransactions` | `inboxkit.api.billing.listTransactions` | `read` | Wallet transactions, newest first, with the balance after each one. Send next_cursor back as cursor for the next page. |
| `billing.updateAutoTopup` | `inboxkit.api.billing.updateAutoTopup` | `destructive` | CAN SPEND MONEY. Turn automatic wallet top-ups on or off and set the threshold and amount. While on, InboxKit charges the saved card with no further call. |
| `clientIdRequests.getStatus` | `inboxkit.api.clientIdRequests.getStatus` | `read` | Current status of a client ID request. Microsoft stays processing for minutes, so poll. |
| `clientIdRequests.initiate` | `inboxkit.api.clientIdRequests.initiate` | `destructive` | Authorize an app's client ID on a domain, as a trusted app or with domain-wide delegation on Google, or tenant-wide consent on Microsoft. This can give the app access to every mailbox on the domain. The domain needs an admin mailbox. |
| `clientIdRequests.list` | `inboxkit.api.clientIdRequests.list` | `read` | Client ID requests, filtered by status or domain. |
| `cloudflare.connect` | `inboxkit.api.cloudflare.connect` | `write` | Connect domains from a Cloudflare account, using an API token or global API key. Limited to 10 requests per 5 minutes. |
| `cloudflare.disconnect` | `inboxkit.api.cloudflare.disconnect` | `destructive` | Disconnect Cloudflare domains from the workspace. |
| `cloudflare.get` | `inboxkit.api.cloudflare.get` | `read` | One Cloudflare-connected domain, by uid or name. |
| `cloudflare.list` | `inboxkit.api.cloudflare.list` | `read` | Domains connected through Cloudflare. |
| `cloudflare.listZones` | `inboxkit.api.cloudflare.listZones` | `read` | Zones in the connected Cloudflare account. |
| `consentRequests.getStatus` | `inboxkit.api.consentRequests.getStatus` | `read` | Current status of a consent request. |
| `consentRequests.initiate` | `inboxkit.api.consentRequests.initiate` | `destructive` | Process an OAuth consent URL for a mailbox, by uid or username and domain, which can give that app access to the mailbox. |
| `consentRequests.list` | `inboxkit.api.consentRequests.list` | `read` | Consent requests, filtered by mailbox or status. |
| `dns.add` | `inboxkit.api.dns.add` | `write` | Add DNS records to a domain. |
| `dns.deleteRecords` | `inboxkit.api.dns.deleteRecords` | `destructive` | Delete DNS records from a domain, by id or all of them. Removing MX, SPF, DKIM or DMARC records stops mail from working. |
| `dns.list` | `inboxkit.api.dns.list` | `read` | DNS records of one domain, by name or uid. |
| `dns.repair` | `inboxkit.api.dns.repair` | `destructive` | Fix missing or broken email DNS records on one or more domains. Run dns.verify first to see what would change. |
| `dns.update` | `inboxkit.api.dns.update` | `write` | Update DNS records on a domain. |
| `dns.verify` | `inboxkit.api.dns.verify` | `read` | Check the health of the email DNS records of one or more domains. Nothing changes. |
| `domains.checkAvailability` | `inboxkit.api.domains.checkAvailability` | `read` | Whether one domain can be registered, with its price and ban status. Takes no workspace. |
| `domains.checkBanned` | `inboxkit.api.domains.checkBanned` | `read` | Whether one domain is banned from registration. Takes no workspace. |
| `domains.checkPropagation` | `inboxkit.api.domains.checkPropagation` | `read` | Whether the nameservers of these domains have propagated. |
| `domains.checkWorkspaceAvailability` | `inboxkit.api.domains.checkWorkspaceAvailability` | `read` | Whether domains can be used with Google Workspace or Microsoft 365. |
| `domains.connect` | `inboxkit.api.domains.connect` | `write` | Connect domains you already own to the workspace and get the nameservers to set at your registrar. |
| `domains.getMoveStatus` | `inboxkit.api.domains.getMoveStatus` | `read` | Whether a move started with domains.moveWorkspace has finished. |
| `domains.getRenewalStatus` | `inboxkit.api.domains.getRenewalStatus` | `read` | Renewal status of purchased domains, filtered by name, uid or status. |
| `domains.getRotationStatus` | `inboxkit.api.domains.getRotationStatus` | `read` | Progress of a rotation. Poll every 30 to 60 seconds until completed, partially_completed or failed. |
| `domains.list` | `inboxkit.api.domains.list` | `read` | The workspace's domains with status, nameservers and DNS records. Paginated, with filters by keyword, status and uid. |
| `domains.listAssignable` | `inboxkit.api.domains.listAssignable` | `read` | Domains that can take more mailboxes. |
| `domains.moveWorkspace` | `inboxkit.api.domains.moveWorkspace` | `write` | Move domains to another workspace in the team, with their mailboxes and DNS records. Run domains.previewMove first. |
| `domains.previewMove` | `inboxkit.api.domains.previewMove` | `read` | What moving domains to another workspace would do, and why any cannot move. Nothing changes. |
| `domains.previewRotation` | `inboxkit.api.domains.previewRotation` | `read` | Whether a domain can rotate onto a replacement, which mailboxes would move and their new addresses. Nothing changes. |
| `domains.regenerateNameservers` | `inboxkit.api.domains.regenerateNameservers` | `destructive` | Create new Cloudflare zones and nameservers for domains that need reconfiguring. The registrar then has to be pointed at the new nameservers. |
| `domains.register` | `inboxkit.api.domains.register` | `destructive` | SPENDS MONEY. Register domains with contact details and configuration, paid from the wallet or a checkout. Never repeat after a timeout without checking domains.list first. |
| `domains.remove` | `inboxkit.api.domains.remove` | `destructive` | Remove domains from the workspace. |
| `domains.removeCatchAll` | `inboxkit.api.domains.removeCatchAll` | `write` | Remove the catch-all address from these domains. |
| `domains.removeDmarc` | `inboxkit.api.domains.removeDmarc` | `write` | Reset these domains to the default DMARC record. |
| `domains.requestRenewal` | `inboxkit.api.domains.requestRenewal` | `destructive` | SPENDS MONEY. Renew purchased domains from the wallet, up to 50 at once. If the wallet cannot cover the whole batch, none are queued. |
| `domains.rotate` | `inboxkit.api.domains.rotate` | `destructive` | Start moving every mailbox on a domain to a replacement domain in the same workspace. Mailbox addresses change. Run domains.previewRotation first. |
| `domains.search` | `inboxkit.api.domains.search` | `read` | Search for domains to register by keyword or name, with prices and Google or Microsoft availability. Limited to 50 requests a minute. |
| `domains.setCatchAll` | `inboxkit.api.domains.setCatchAll` | `destructive` | Send mail for unknown addresses on these domains to one email address. |
| `domains.setDmarc` | `inboxkit.api.domains.setDmarc` | `write` | Set a custom DMARC record on these domains. |
| `domains.setForwarding` | `inboxkit.api.domains.setForwarding` | `write` | Set or remove the website URL domains redirect to. An empty forwarding_url removes it. |
| `domains.updateContacts` | `inboxkit.api.domains.updateContacts` | `write` | Update the WHOIS contact details of a domain registered through InboxKit, for all four contact roles. |
| `domains.updatePrivacy` | `inboxkit.api.domains.updatePrivacy` | `write` | Turn WHOIS privacy on or off for a domain registered through InboxKit. |
| `emailInsights.getCampaignReplyRate` | `inboxkit.api.emailInsights.getCampaignReplyRate` | `read` | Reply rate for each campaign and sequence step. |
| `emailInsights.getDailyStats` | `inboxkit.api.emailInsights.getDailyStats` | `read` | Daily email volume across the workspace. |
| `emailInsights.getHighBounceMailboxes` | `inboxkit.api.emailInsights.getHighBounceMailboxes` | `read` | Mailboxes whose bounce rate is above a threshold. |
| `emailInsights.getMailboxActivity` | `inboxkit.api.emailInsights.getMailboxActivity` | `read` | Most recent email events for one mailbox, newest first. |
| `emailInsights.getMailboxAuthFailures` | `inboxkit.api.emailInsights.getMailboxAuthFailures` | `read` | Inbound messages to one mailbox that did not pass SPF, DKIM or DMARC. |
| `emailInsights.getMailboxBodyTemplates` | `inboxkit.api.emailInsights.getMailboxBodyTemplates` | `read` | Groups of outbound emails from one mailbox that share a body structure. |
| `emailInsights.getMailboxBounceEvents` | `inboxkit.api.emailInsights.getMailboxBounceEvents` | `read` | Delivery failures for one mailbox, with the reason the receiving server gave. |
| `emailInsights.getMailboxDeliverability` | `inboxkit.api.emailInsights.getMailboxDeliverability` | `read` | Bounce and authentication detail for one mailbox. |
| `emailInsights.getMailboxesHealth` | `inboxkit.api.emailInsights.getMailboxesHealth` | `read` | Seven-day activity summary for each mailbox in the workspace. |
| `emailInsights.getMailboxFirstTouchFunnel` | `inboxkit.api.emailInsights.getMailboxFirstTouchFunnel` | `read` | Recipients one mailbox contacted for the first time, by day. |
| `emailInsights.getMailboxHealth` | `inboxkit.api.emailInsights.getMailboxHealth` | `read` | Activity status for one mailbox. |
| `emailInsights.getMailboxMessageBreakdown` | `inboxkit.api.emailInsights.getMailboxMessageBreakdown` | `read` | Sent and received messages for one mailbox, by type and by day. |
| `emailInsights.getMailboxRecipientEspBreakdown` | `inboxkit.api.emailInsights.getMailboxRecipientEspBreakdown` | `read` | Sending volume and reply rate for one mailbox, by the recipient's email provider. |
| `emailInsights.getMailboxReplyRateByDomain` | `inboxkit.api.emailInsights.getMailboxReplyRateByDomain` | `read` | Emails sent and replies received for one mailbox, by recipient domain. |
| `emailInsights.getMailboxReplyTimeHeatmap` | `inboxkit.api.emailInsights.getMailboxReplyTimeHeatmap` | `read` | How quickly replies arrive at one mailbox, by day of week and hour. |
| `emailInsights.getMailboxSendingIpBreakdown` | `inboxkit.api.emailInsights.getMailboxSendingIpBreakdown` | `read` | Sending IPs one mailbox used, with Gmail placement and blacklist status. |
| `emailInsights.getMailboxStats` | `inboxkit.api.emailInsights.getMailboxStats` | `read` | Event totals and rates for one mailbox over a period. |
| `emailInsights.getMailboxSubjectAnalysis` | `inboxkit.api.emailInsights.getMailboxSubjectAnalysis` | `read` | Most common subject line keywords for one mailbox, with length statistics. |
| `emailInsights.getMailboxTopRecipientDomains` | `inboxkit.api.emailInsights.getMailboxTopRecipientDomains` | `read` | Domains one mailbox sent to most often. |
| `emailInsights.getMailboxTopRecipients` | `inboxkit.api.emailInsights.getMailboxTopRecipients` | `read` | Addresses one mailbox sent to most often. |
| `emailInsights.getMailboxTrends` | `inboxkit.api.emailInsights.getMailboxTrends` | `read` | Daily event counts for one mailbox, oldest first. |
| `emailInsights.getMailboxVelocityOverlay` | `inboxkit.api.emailInsights.getMailboxVelocityOverlay` | `read` | Hourly sending and reply volume for one mailbox. |
| `emailInsights.getMailboxWarmupStats` | `inboxkit.api.emailInsights.getMailboxWarmupStats` | `read` | Warmup volume for one mailbox compared with real sending, with SPF, DKIM and DMARC pass rates. |
| `emailInsights.getOverview` | `inboxkit.api.emailInsights.getOverview` | `read` | Totals and rates across every mailbox in the workspace for a period. |
| `emailInsights.getWorkspaceActivity` | `inboxkit.api.emailInsights.getWorkspaceActivity` | `read` | Most recent email events across the workspace, newest first. |
| `forwarding.deleteRule` | `inboxkit.api.forwarding.deleteRule` | `destructive` | Delete a rule. Its mailboxes stop forwarding. |
| `forwarding.getCapabilities` | `inboxkit.api.forwarding.getCapabilities` | `read` | What advanced forwarding can filter on for Google and Microsoft mailboxes, and the limits. |
| `forwarding.getRule` | `inboxkit.api.forwarding.getRule` | `read` | One advanced forwarding rule. |
| `forwarding.listJobs` | `inboxkit.api.forwarding.listJobs` | `read` | Status of forwarding jobs. |
| `forwarding.listRules` | `inboxkit.api.forwarding.listRules` | `read` | Advanced forwarding rules, newest first, with conditions, mailboxes and status. |
| `forwarding.remove` | `inboxkit.api.forwarding.remove` | `write` | Turn off forwarding for mailboxes. |
| `forwarding.setup` | `inboxkit.api.forwarding.setup` | `destructive` | Forward all mail from these mailboxes to one address. Setup takes a few minutes; follow it with forwarding.listJobs. |
| `forwarding.setupAdvanced` | `inboxkit.api.forwarding.setupAdvanced` | `destructive` | Forward only the messages that match your conditions. A rule is created per Google domain or Microsoft account, and replaces any forwarding the mailbox had. |
| `forwarding.update` | `inboxkit.api.forwarding.update` | `destructive` | Change the forwarding address of mailboxes that already forward. |
| `forwarding.updateRule` | `inboxkit.api.forwarding.updateRule` | `destructive` | Change a rule's conditions, match, forwarding address or mailboxes. |
| `inboxPlacement.createTest` | `inboxkit.api.inboxPlacement.createTest` | `destructive` | SPENDS MONEY. Run an inbox placement test from your mailboxes, once or on a schedule. |
| `inboxPlacement.deleteScheduled` | `inboxkit.api.inboxPlacement.deleteScheduled` | `destructive` | Delete a scheduled inbox placement test. |
| `inboxPlacement.getScheduled` | `inboxkit.api.inboxPlacement.getScheduled` | `read` | One scheduled inbox placement test. |
| `inboxPlacement.getTest` | `inboxkit.api.inboxPlacement.getTest` | `read` | Results of one inbox placement test. |
| `inboxPlacement.listScheduled` | `inboxkit.api.inboxPlacement.listScheduled` | `read` | Scheduled inbox placement tests. |
| `inboxPlacement.listTests` | `inboxkit.api.inboxPlacement.listTests` | `read` | Inbox placement tests. |
| `inboxPlacement.pauseScheduled` | `inboxkit.api.inboxPlacement.pauseScheduled` | `write` | Pause a scheduled inbox placement test. |
| `inboxPlacement.resumeScheduled` | `inboxkit.api.inboxPlacement.resumeScheduled` | `destructive` | CAN SPEND MONEY. Resume a scheduled inbox placement test, so its later runs are charged. |
| `infraGuard.acknowledgeAlert` | `inboxkit.api.infraGuard.acknowledgeAlert` | `write` | Mark an alert as acknowledged. |
| `infraGuard.cancel` | `inboxkit.api.infraGuard.cancel` | `destructive` | Stop InfraGuard monitoring and billing for domains. |
| `infraGuard.dismissActionItem` | `inboxkit.api.infraGuard.dismissActionItem` | `write` | Dismiss an action item. |
| `infraGuard.enable` | `inboxkit.api.infraGuard.enable` | `destructive` | SPENDS MONEY. Turn on InfraGuard monitoring for domains, billed per domain. |
| `infraGuard.get` | `inboxkit.api.infraGuard.get` | `read` | The InfraGuard subscription of one domain. |
| `infraGuard.getActionItemStats` | `inboxkit.api.infraGuard.getActionItemStats` | `read` | Action item counts for the workspace. |
| `infraGuard.getBlacklistHistory` | `inboxkit.api.infraGuard.getBlacklistHistory` | `read` | Blacklist checks of one domain over time. |
| `infraGuard.getBounceHistory` | `inboxkit.api.infraGuard.getBounceHistory` | `read` | Bounce checks of one domain over time. |
| `infraGuard.getBounceMetrics` | `inboxkit.api.infraGuard.getBounceMetrics` | `read` | Current bounce metrics of one domain. |
| `infraGuard.getDnsHistory` | `inboxkit.api.infraGuard.getDnsHistory` | `read` | DNS checks of one domain over time. |
| `infraGuard.getPricing` | `inboxkit.api.infraGuard.getPricing` | `read` | InfraGuard pricing. |
| `infraGuard.getStats` | `inboxkit.api.infraGuard.getStats` | `read` | InfraGuard statistics for the workspace. |
| `infraGuard.list` | `inboxkit.api.infraGuard.list` | `read` | Domains protected by InfraGuard, with their health. |
| `infraGuard.listActionItems` | `inboxkit.api.infraGuard.listActionItems` | `read` | InfraGuard action items, filtered by domain, category, severity or status. |
| `infraGuard.listAlerts` | `inboxkit.api.infraGuard.listAlerts` | `read` | InfraGuard alerts, filtered by domain, status, severity or type. |
| `infraGuard.resolveActionItem` | `inboxkit.api.infraGuard.resolveActionItem` | `write` | Mark an action item as resolved. |
| `infraGuard.resolveAlert` | `inboxkit.api.infraGuard.resolveAlert` | `write` | Mark an alert as resolved, with an optional note. |
| `infraGuard.triggerCheck` | `inboxkit.api.infraGuard.triggerCheck` | `write` | Run an InfraGuard check on a domain now. |
| `infraGuard.updateSettings` | `inboxkit.api.infraGuard.updateSettings` | `write` | Change a domain's alert preferences, bounce thresholds and scheduled placement tests. |
| `mailboxes.addSignature` | `inboxkit.api.mailboxes.addSignature` | `write` | Add or replace the signature on several mailboxes. |
| `mailboxes.buy` | `inboxkit.api.mailboxes.buy` | `destructive` | SPENDS MONEY. Buy mailboxes on domains already in the workspace, from subscription slots, the wallet, or (Azure) always the wallet. Never repeat after a timeout without checking mailboxes.list first. |
| `mailboxes.cancel` | `inboxkit.api.mailboxes.cancel` | `destructive` | Schedule mailboxes for cancellation. Billing stops at the next renewal. |
| `mailboxes.changePassword` | `inboxkit.api.mailboxes.changePassword` | `destructive` | Change a mailbox's password. Anything signed in with the old password, such as a sequencer, stops working. |
| `mailboxes.changeUsername` | `inboxkit.api.mailboxes.changeUsername` | `destructive` | Change a mailbox's username, which changes its email address. |
| `mailboxes.checkAvailability` | `inboxkit.api.mailboxes.checkAvailability` | `read` | Whether a username is free on a domain. Takes no workspace. |
| `mailboxes.deleteSignature` | `inboxkit.api.mailboxes.deleteSignature` | `write` | Delete the signature from several mailboxes. |
| `mailboxes.generateTotp` | `inboxkit.api.mailboxes.generateTotp` | `destructive` | A current two-factor code for a mailbox. Keep the result out of logs and shared chats. |
| `mailboxes.get` | `inboxkit.api.mailboxes.get` | `read` | One mailbox by uid. |
| `mailboxes.getFailureReason` | `inboxkit.api.mailboxes.getFailureReason` | `read` | Why a mailbox failed to set up. |
| `mailboxes.getResetupStatus` | `inboxkit.api.mailboxes.getResetupStatus` | `read` | The most recent resetup job for a domain. |
| `mailboxes.getStatus` | `inboxkit.api.mailboxes.getStatus` | `read` | Status of mailboxes by uid or domain. |
| `mailboxes.list` | `inboxkit.api.mailboxes.list` | `read` | The workspace's mailboxes. Paginated, with filters by keyword, domain, platform, status and uid. Never includes passwords. |
| `mailboxes.reactivate` | `inboxkit.api.mailboxes.reactivate` | `destructive` | CAN SPEND MONEY. Reactivate Microsoft 365 and Azure mailboxes scheduled for cancellation or whose renewal failed. With allow_charge a re-purchase may be charged to the wallet. |
| `mailboxes.reactivateRebuy` | `inboxkit.api.mailboxes.reactivateRebuy` | `destructive` | SPENDS MONEY. Approve the charge for Microsoft 365 and Azure mailboxes paused at needs_rebuy. |
| `mailboxes.resetup` | `inboxkit.api.mailboxes.resetup` | `destructive` | Schedule a renewal-resetup for Google Workspace mailboxes. Mail delivery on the domain is paused for up to 24 hours while it runs. |
| `mailboxes.showCredentials` | `inboxkit.api.mailboxes.showCredentials` | `destructive` | A mailbox's plaintext password, secret and app password, by uid or email. Keep the result out of logs and shared chats. |
| `mailboxes.uncancel` | `inboxkit.api.mailboxes.uncancel` | `destructive` | CAN SPEND MONEY. Undo a scheduled cancellation for Google Workspace mailboxes within the 10-day recovery window, so billing continues. |
| `mailboxes.update` | `inboxkit.api.mailboxes.update` | `write` | Update a mailbox's first or last name, profile picture or tags. To change its address, use mailboxes.changeUsername. |
| `mailboxes.updateProfilePicture` | `inboxkit.api.mailboxes.updateProfilePicture` | `write` | Set a mailbox's profile picture from a URL. |
| `orders.place` | `inboxkit.api.orders.place` | `destructive` | SPENDS MONEY. Order new domains and their mailboxes in one request, charged to the wallet. Never repeat after a timeout without checking domains.list first. |
| `prewarm.buy` | `inboxkit.api.prewarm.buy` | `destructive` | SPENDS MONEY. Buy prewarmed domains with every active mailbox on them, charged to the wallet when the order is placed. Never repeat after a timeout without checking first. |
| `prewarm.checkAvailability` | `inboxkit.api.prewarm.checkAvailability` | `read` | Whether prewarmed domains are still for sale. |
| `prewarm.getOrderStatus` | `inboxkit.api.prewarm.getOrderStatus` | `read` | Status of a prewarmed domain order. |
| `prewarm.searchDomains` | `inboxkit.api.prewarm.searchDomains` | `read` | Search prewarmed domains for sale. |
| `prewarm.searchMailboxes` | `inboxkit.api.prewarm.searchMailboxes` | `read` | Search prewarmed mailboxes for sale. |
| `sequencers.add` | `inboxkit.api.sequencers.add` | `write` | Connect a sequencer account such as Instantly, Smartlead or Lemlist, with the fields sequencers.listPlatforms names for that platform. Most take a login and password, and a few take only an API key. No mailboxes go to it until sequencers.exportMailboxes, unless Auto Export is on for it in the InboxKit dashboard. |
| `sequencers.delete` | `inboxkit.api.sequencers.delete` | `destructive` | Remove sequencers from the workspace. Mailboxes can no longer be exported to them. |
| `sequencers.exportMailboxes` | `inboxkit.api.sequencers.exportMailboxes` | `destructive` | Send mailboxes into a sequencer, which receives their credentials. Runs in the background; follow it with sequencers.getExportStatus. |
| `sequencers.getExportStatus` | `inboxkit.api.sequencers.getExportStatus` | `read` | Status of mailbox exports, with the error if a connection failed. |
| `sequencers.getTags` | `inboxkit.api.sequencers.getTags` | `read` | Tags on a sequencer account, using its platform and API key. Only Instantly has them today. |
| `sequencers.list` | `inboxkit.api.sequencers.list` | `read` | Sequencers connected to the workspace, filtered by platform, status, keyword or uid. |
| `sequencers.listPlatforms` | `inboxkit.api.sequencers.listPlatforms` | `read` | Every sequencer platform InboxKit supports, with the fields each one needs to connect. |
| `sequencers.update` | `inboxkit.api.sequencers.update` | `write` | Rename a sequencer, rotate its credentials or change its auto-reconnect setting. |
| `sequencers.verifyLemlistOtp` | `inboxkit.api.sequencers.verifyLemlistOtp` | `write` | Resume a Lemlist connection paused with verification_required, using the link and code from its email. |
| `tags.assign` | `inboxkit.api.tags.assign` | `write` | Add, remove or replace tags on domains or mailboxes in bulk. |
| `tags.create` | `inboxkit.api.tags.create` | `write` | Create a tag in the workspace. |
| `tags.delete` | `inboxkit.api.tags.delete` | `destructive` | Delete a tag and remove it from everything it is on. |
| `tags.list` | `inboxkit.api.tags.list` | `read` | All tags in the workspace. |
| `verifiedDomains.add` | `inboxkit.api.verifiedDomains.add` | `write` | Add a website to mask domains to. It must then be verified with a TXT record. |
| `verifiedDomains.list` | `inboxkit.api.verifiedDomains.list` | `read` | Websites the team has added for URL masking, with each one's status and TXT record. |
| `verifiedDomains.remove` | `inboxkit.api.verifiedDomains.remove` | `destructive` | Remove a website from the verified destinations. |
| `verifiedDomains.verify` | `inboxkit.api.verifiedDomains.verify` | `write` | Check whether the TXT record for a destination is published, and mark it verified if so. |
| `warmup.add` | `inboxkit.api.warmup.add` | `destructive` | SPENDS MONEY. Add warmup to mailboxes, billed monthly. Mailboxes that are not ready start once they are; activate_immediately charges the first month to the wallet now. |
| `warmup.addSmtpMailboxes` | `inboxkit.api.warmup.addSmtpMailboxes` | `destructive` | SPENDS MONEY. Connect up to 10 SMTP mailboxes you own and start their warmup. The first month is charged to the wallet for each one that signs in. |
| `warmup.cancel` | `inboxkit.api.warmup.cancel` | `destructive` | Stop warmup and its billing for mailboxes. The mailboxes stay connected. |
| `warmup.createConnectLink` | `inboxkit.api.warmup.createConnectLink` | `destructive` | CAN SPEND MONEY. A one-time sign-in link to connect a Google Workspace or Microsoft 365 mailbox you own. Anyone with the link can use it; with start_warmup the first month is charged when it connects. |
| `warmup.disconnectMailbox` | `inboxkit.api.warmup.disconnectMailbox` | `destructive` | Disconnect a mailbox you connected yourself and cancel its warmup. Connecting it again charges a new first month. |
| `warmup.get` | `inboxkit.api.warmup.get` | `read` | The warmup subscription of one mailbox, with its current settings. |
| `warmup.getConnectLink` | `inboxkit.api.warmup.getConnectLink` | `read` | What happened to a link from warmup.createConnectLink. |
| `warmup.getPricing` | `inboxkit.api.warmup.getPricing` | `read` | The monthly warmup price per mailbox. |
| `warmup.getStats` | `inboxkit.api.warmup.getStats` | `read` | Warmup counts for the workspace. |
| `warmup.list` | `inboxkit.api.warmup.list` | `read` | Warmup subscriptions in the workspace. |
| `warmup.listConnectedMailboxes` | `inboxkit.api.warmup.listConnectedMailboxes` | `read` | Mailboxes you connected yourself, newest first. |
| `warmup.pause` | `inboxkit.api.warmup.pause` | `write` | Pause warmup for mailboxes. |
| `warmup.resume` | `inboxkit.api.warmup.resume` | `write` | Resume warmup for mailboxes. |
| `warmup.updateSettings` | `inboxkit.api.warmup.updateSettings` | `write` | Change warmup settings for mailboxes. Only the settings you send change. |
| `workspaces.create` | `inboxkit.api.workspaces.create` | `write` | Create a workspace. All team members are copied into it unless admins_only is set. Set a webhook URL afterwards with workspaces.updateWebhook. |
| `workspaces.delete` | `inboxkit.api.workspaces.delete` | `destructive` | Delete a workspace permanently. |
| `workspaces.get` | `inboxkit.api.workspaces.get` | `read` | One workspace by uid. |
| `workspaces.inviteMember` | `inboxkit.api.workspaces.inviteMember` | `destructive` | Invite someone to a workspace, or resend an invite. Sends them an email and gives them access to its domains and mailboxes. |
| `workspaces.list` | `inboxkit.api.workspaces.list` | `read` | Every workspace in the team, with its uid. Pass a uid as workspaceId to the operations that act on one workspace. |
| `workspaces.update` | `inboxkit.api.workspaces.update` | `destructive` | Rename a workspace and set its webhook URL. That URL can receive mailbox passwords in plaintext, so only point it at an endpoint you control. |
| `workspaces.updateWebhook` | `inboxkit.api.workspaces.updateWebhook` | `destructive` | Set a workspace's webhook URL. That URL can receive mailbox passwords in plaintext, so only point it at an endpoint you control. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/inboxkit

## License

Apache-2.0
