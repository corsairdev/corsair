# @corsair-dev/mixmax

Mixmax plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/mixmax
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `appointmentLinks.getMe` | `mixmax.api.appointmentLinks.getMe` | `read` | Get the user’s default Mixmax appointment link. |
| `appointmentLinks.list` | `mixmax.api.appointmentLinks.list` | `read` | Search the user’s Mixmax appointment links by name. |
| `appointmentLinks.updateMe` | `mixmax.api.appointmentLinks.updateMe` | `write` | Rename the user’s default Mixmax appointment link. |
| `codeSnippets.create` | `mixmax.api.codeSnippets.create` | `write` | Create a Mixmax code snippet. |
| `codeSnippets.get` | `mixmax.api.codeSnippets.get` | `read` | Retrieve one Mixmax code snippet by id. |
| `codeSnippets.list` | `mixmax.api.codeSnippets.list` | `read` | List the user’s Mixmax code snippets. |
| `fileRequests.get` | `mixmax.api.fileRequests.get` | `read` | Retrieve one Mixmax file request by id. |
| `fileRequests.list` | `mixmax.api.fileRequests.list` | `read` | List the Mixmax file requests the user has access to. |
| `insightsReports.create` | `mixmax.api.insightsReports.create` | `write` | Create a saved Mixmax insights report from a query. |
| `insightsReports.delete` | `mixmax.api.insightsReports.delete` | `destructive` | Delete a saved Mixmax insights report permanently. |
| `insightsReports.list` | `mixmax.api.insightsReports.list` | `read` | List the user’s saved Mixmax insights reports. |
| `insightsReports.update` | `mixmax.api.insightsReports.update` | `write` | Update a saved Mixmax insights report. |
| `integrations.commands.create` | `mixmax.api.integrations.commands.create` | `write` | Create a Mixmax slash command integration. |
| `integrations.commands.delete` | `mixmax.api.integrations.commands.delete` | `destructive` | Delete a Mixmax slash command integration. |
| `integrations.commands.list` | `mixmax.api.integrations.commands.list` | `read` | List the user’s Mixmax slash command integrations. |
| `integrations.enhancements.create` | `mixmax.api.integrations.enhancements.create` | `write` | Create a Mixmax enhance-menu integration. |
| `integrations.enhancements.delete` | `mixmax.api.integrations.enhancements.delete` | `destructive` | Delete a Mixmax enhance-menu integration. |
| `integrations.enhancements.list` | `mixmax.api.integrations.enhancements.list` | `read` | List the user’s Mixmax enhance-menu integrations. |
| `integrations.linkResolvers.create` | `mixmax.api.integrations.linkResolvers.create` | `write` | Create a Mixmax link resolver integration. |
| `integrations.linkResolvers.delete` | `mixmax.api.integrations.linkResolvers.delete` | `destructive` | Delete a Mixmax link resolver integration. |
| `integrations.linkResolvers.list` | `mixmax.api.integrations.linkResolvers.list` | `read` | List the user’s Mixmax link resolver integrations. |
| `integrations.sidebars.create` | `mixmax.api.integrations.sidebars.create` | `write` | Create a Mixmax sidebar integration. |
| `integrations.sidebars.delete` | `mixmax.api.integrations.sidebars.delete` | `destructive` | Delete a Mixmax sidebar integration. |
| `integrations.sidebars.list` | `mixmax.api.integrations.sidebars.list` | `read` | List the user’s Mixmax sidebar integrations. |
| `livefeed.events` | `mixmax.api.livefeed.events` | `read` | List individual Mixmax live feed events such as opens, clicks, and replies. |
| `livefeed.list` | `mixmax.api.livefeed.list` | `read` | List the user’s Mixmax live feed of tracked email activity, with optional stats. |
| `meetingInvites.get` | `mixmax.api.meetingInvites.get` | `read` | Retrieve one Mixmax meeting invite by id. |
| `meetingInvites.list` | `mixmax.api.meetingInvites.list` | `read` | List the Mixmax meeting invites sent to the user. |
| `meetings.getTranscript` | `mixmax.api.meetings.getTranscript` | `read` | Retrieve the transcript of one Mixmax meeting. |
| `meetings.searchSummaries` | `mixmax.api.meetings.searchSummaries` | `read` | Search Mixmax meeting summaries by attendee, title, and date range. |
| `meetingTypes.create` | `mixmax.api.meetingTypes.create` | `write` | Create a Mixmax meeting template. |
| `meetingTypes.delete` | `mixmax.api.meetingTypes.delete` | `destructive` | Delete a Mixmax meeting template permanently. |
| `meetingTypes.get` | `mixmax.api.meetingTypes.get` | `read` | Retrieve one Mixmax meeting template by id. |
| `meetingTypes.list` | `mixmax.api.meetingTypes.list` | `read` | List the user’s Mixmax meeting templates. |
| `meetingTypes.update` | `mixmax.api.meetingTypes.update` | `write` | Update a Mixmax meeting template. |
| `messages.create` | `mixmax.api.messages.create` | `write` | Create a Mixmax draft message without sending it. |
| `messages.get` | `mixmax.api.messages.get` | `read` | Retrieve one Mixmax message by id. |
| `messages.list` | `mixmax.api.messages.list` | `read` | List Mixmax messages (drafts, scheduled, sent, or failed), newest first. |
| `messages.schedule` | `mixmax.api.messages.schedule` | `write` | Schedule a saved Mixmax draft to send at a Unix-millisecond timestamp. |
| `messages.send` | `mixmax.api.messages.send` | `destructive` | Send a saved Mixmax draft. Delivery is asynchronous and cannot be undone. |
| `messages.sendPlain` | `mixmax.api.messages.sendPlain` | `destructive` | Send a plain email from the user’s mailbox immediately, outside Mixmax tracking. |
| `messages.test` | `mixmax.api.messages.test` | `write` | Send a Mixmax test email to the calling user’s own account. |
| `messages.unschedule` | `mixmax.api.messages.unschedule` | `write` | Cancel a scheduled Mixmax send and return the message to draft. |
| `messages.update` | `mixmax.api.messages.update` | `write` | Update the fields of a sent Mixmax message; each included field replaces the stored value. |
| `polls.get` | `mixmax.api.polls.get` | `read` | Retrieve one Mixmax poll by id. |
| `polls.list` | `mixmax.api.polls.list` | `read` | List the user’s Mixmax polls with their response counts. |
| `qa.get` | `mixmax.api.qa.get` | `read` | Retrieve one Mixmax Q&A form by id. |
| `qa.list` | `mixmax.api.qa.list` | `read` | List the user’s Mixmax Q&A forms with their answers. |
| `reports.runDataTable` | `mixmax.api.reports.runDataTable` | `read` | Run a Mixmax reporting query and return the aggregated data table buckets. |
| `rules.actions.create` | `mixmax.api.rules.actions.create` | `write` | Add an action to a Mixmax rule. |
| `rules.actions.delete` | `mixmax.api.rules.actions.delete` | `destructive` | Remove one action from a Mixmax rule. |
| `rules.actions.list` | `mixmax.api.rules.actions.list` | `read` | List the actions of one Mixmax rule. |
| `rules.actions.update` | `mixmax.api.rules.actions.update` | `write` | Update one action of a Mixmax rule. |
| `rules.create` | `mixmax.api.rules.create` | `write` | Create a Mixmax rule with a trigger and actions. |
| `rules.delete` | `mixmax.api.rules.delete` | `destructive` | Delete a Mixmax rule permanently. |
| `rules.deleteBulk` | `mixmax.api.rules.deleteBulk` | `destructive` | Delete several Mixmax rules at once by their ids. |
| `rules.events.get` | `mixmax.api.rules.events.get` | `read` | Retrieve one Mixmax rule event by id. |
| `rules.events.list` | `mixmax.api.rules.events.list` | `read` | List Mixmax rule events with their status, filterable by rule and outcome. |
| `rules.get` | `mixmax.api.rules.get` | `read` | Retrieve one Mixmax rule by id. |
| `rules.list` | `mixmax.api.rules.list` | `read` | List the user’s Mixmax rules, optionally with their actions. |
| `rules.update` | `mixmax.api.rules.update` | `write` | Update the trigger or fields of a Mixmax rule. |
| `salesforce.createAccount` | `mixmax.api.salesforce.createAccount` | `write` | Create a Salesforce account through Mixmax. |
| `salesforce.createContact` | `mixmax.api.salesforce.createContact` | `write` | Create a Salesforce contact through Mixmax. |
| `salesforce.createLead` | `mixmax.api.salesforce.createLead` | `write` | Create a Salesforce lead through Mixmax. |
| `salesforce.createOpportunity` | `mixmax.api.salesforce.createOpportunity` | `write` | Create a Salesforce opportunity through Mixmax. |
| `salesforce.createTask` | `mixmax.api.salesforce.createTask` | `write` | Create a Salesforce task through Mixmax. |
| `salesforce.deleteOpportunity` | `mixmax.api.salesforce.deleteOpportunity` | `destructive` | Delete a Salesforce opportunity through Mixmax. |
| `salesforce.deleteTask` | `mixmax.api.salesforce.deleteTask` | `destructive` | Delete a Salesforce task through Mixmax. |
| `salesforce.getAccount` | `mixmax.api.salesforce.getAccount` | `read` | Retrieve one Salesforce account synced to Mixmax. |
| `salesforce.getAccountImplicit` | `mixmax.api.salesforce.getAccountImplicit` | `read` | Look up the Salesforce account matching an email domain. |
| `salesforce.getContact` | `mixmax.api.salesforce.getContact` | `read` | Retrieve one Salesforce contact synced to Mixmax. |
| `salesforce.getContactOrLead` | `mixmax.api.salesforce.getContactOrLead` | `read` | Look up the Salesforce contact or lead matching an email address. |
| `salesforce.getLead` | `mixmax.api.salesforce.getLead` | `read` | Retrieve one Salesforce lead synced to Mixmax. |
| `salesforce.getOpportunity` | `mixmax.api.salesforce.getOpportunity` | `read` | Retrieve one Salesforce opportunity synced to Mixmax. |
| `salesforce.getTask` | `mixmax.api.salesforce.getTask` | `read` | Retrieve one Salesforce task synced to Mixmax. |
| `salesforce.getWhat` | `mixmax.api.salesforce.getWhat` | `read` | Resolve any Salesforce record id to its related “what” object. |
| `salesforce.getWho` | `mixmax.api.salesforce.getWho` | `read` | Resolve any Salesforce record id to its related “who” object. |
| `salesforce.listAccounts` | `mixmax.api.salesforce.listAccounts` | `read` | List the Salesforce accounts synced to the user’s Mixmax. |
| `salesforce.listContactTasks` | `mixmax.api.salesforce.listContactTasks` | `read` | List the Salesforce tasks of one contact. |
| `salesforce.listLeadTasks` | `mixmax.api.salesforce.listLeadTasks` | `read` | List the Salesforce tasks of one lead. |
| `salesforce.search` | `mixmax.api.salesforce.search` | `read` | Search Salesforce records of one object type through Mixmax. |
| `salesforce.syncedFields` | `mixmax.api.salesforce.syncedFields` | `read` | List the Salesforce fields Mixmax syncs for each object type. |
| `salesforce.updateAccount` | `mixmax.api.salesforce.updateAccount` | `write` | Update a Salesforce account through Mixmax. |
| `salesforce.updateContact` | `mixmax.api.salesforce.updateContact` | `write` | Update a Salesforce contact through Mixmax. |
| `salesforce.updateLead` | `mixmax.api.salesforce.updateLead` | `write` | Update a Salesforce lead through Mixmax. |
| `salesforce.updateOpportunity` | `mixmax.api.salesforce.updateOpportunity` | `write` | Update a Salesforce opportunity through Mixmax. |
| `salesforce.updateTask` | `mixmax.api.salesforce.updateTask` | `write` | Update a Salesforce task through Mixmax. |
| `sequenceFolders.addSequences` | `mixmax.api.sequenceFolders.addSequences` | `write` | Move one or more Mixmax sequences into a sequence folder. |
| `sequenceFolders.create` | `mixmax.api.sequenceFolders.create` | `write` | Create a Mixmax sequence folder. |
| `sequenceFolders.delete` | `mixmax.api.sequenceFolders.delete` | `destructive` | Delete a Mixmax sequence folder; its sequences are kept but left without a folder. |
| `sequenceFolders.get` | `mixmax.api.sequenceFolders.get` | `read` | Retrieve one Mixmax sequence folder by id. |
| `sequenceFolders.list` | `mixmax.api.sequenceFolders.list` | `read` | List the Mixmax sequence folders the user can access. |
| `sequenceFolders.rename` | `mixmax.api.sequenceFolders.rename` | `write` | Rename a Mixmax sequence folder. |
| `sequences.cancel` | `mixmax.api.sequences.cancel` | `destructive` | Stop recipients of one Mixmax sequence; cancellation is one-way and deletes their open tasks. |
| `sequences.cancelAll` | `mixmax.api.sequences.cancelAll` | `destructive` | Stop the user’s recipients across every Mixmax sequence at once; cancelled recipients cannot be resumed. |
| `sequences.list` | `mixmax.api.sequences.list` | `read` | List the Mixmax sequences the user can access, including shared ones. |
| `sequences.recipients.add` | `mixmax.api.sequences.recipients.add` | `write` | Add recipients to a Mixmax sequence, starting their sequence emails unless kept as drafts. |
| `sequences.recipients.list` | `mixmax.api.sequences.recipients.list` | `read` | List the recipients of one Mixmax sequence with their per-stage activity. |
| `sequences.search` | `mixmax.api.sequences.search` | `read` | Search sequence recipients across every accessible Mixmax sequence with their status and activity. |
| `snippets.delete` | `mixmax.api.snippets.delete` | `destructive` | Move a Mixmax template to the trash, or archive it, removing it from its folders. |
| `snippets.get` | `mixmax.api.snippets.get` | `read` | Retrieve one Mixmax template by id. |
| `snippets.list` | `mixmax.api.snippets.list` | `read` | List the Mixmax templates (snippets) the user can access, including shared ones. |
| `snippets.send` | `mixmax.api.snippets.send` | `destructive` | Send an email built from a Mixmax template, immediately or at a scheduled time. |
| `snippets.update` | `mixmax.api.snippets.update` | `write` | Update the fields of a Mixmax template; only the fields sent change. |
| `snippetTags.addSnippets` | `mixmax.api.snippetTags.addSnippets` | `write` | Add a template to a Mixmax template folder. |
| `snippetTags.create` | `mixmax.api.snippetTags.create` | `write` | Create a Mixmax template folder. |
| `snippetTags.delete` | `mixmax.api.snippetTags.delete` | `destructive` | Delete a Mixmax template folder and move every template inside it to the trash. |
| `snippetTags.get` | `mixmax.api.snippetTags.get` | `read` | Retrieve one Mixmax template folder by id. |
| `snippetTags.list` | `mixmax.api.snippetTags.list` | `read` | List the Mixmax template folders (snippet tags) the user can access. |
| `snippetTags.listSnippets` | `mixmax.api.snippetTags.listSnippets` | `read` | List the templates contained in one Mixmax template folder. |
| `snippetTags.update` | `mixmax.api.snippetTags.update` | `write` | Rename a Mixmax template folder. |
| `tasks.list` | `mixmax.api.tasks.list` | `read` | List the user’s open Mixmax tasks. |
| `teams.create` | `mixmax.api.teams.create` | `write` | Create a Mixmax team. |
| `teams.delete` | `mixmax.api.teams.delete` | `destructive` | Delete a Mixmax team permanently. |
| `teams.get` | `mixmax.api.teams.get` | `read` | Retrieve one Mixmax team by id. |
| `teams.list` | `mixmax.api.teams.list` | `read` | List the user’s Mixmax teams. |
| `teams.members.add` | `mixmax.api.teams.members.add` | `write` | Invite members to a Mixmax team. |
| `teams.members.list` | `mixmax.api.teams.members.list` | `read` | List the members of one Mixmax team. |
| `teams.members.remove` | `mixmax.api.teams.members.remove` | `destructive` | Remove one member from a Mixmax team. |
| `teams.members.update` | `mixmax.api.teams.members.update` | `write` | Change a Mixmax team member’s role. |
| `teams.update` | `mixmax.api.teams.update` | `write` | Rename a Mixmax team. |
| `unsubscribes.create` | `mixmax.api.unsubscribes.create` | `write` | Add one or more email addresses to the Mixmax unsubscribe list. |
| `unsubscribes.list` | `mixmax.api.unsubscribes.list` | `read` | List the email addresses unsubscribed from the user’s Mixmax sends. |
| `unsubscribes.remove` | `mixmax.api.unsubscribes.remove` | `destructive` | Remove one email address from the Mixmax unsubscribe list. |
| `users.getMe` | `mixmax.api.users.getMe` | `read` | Get the current Mixmax user. |
| `users.preferences.autoBccExcludedEmails.add` | `mixmax.api.users.preferences.autoBccExcludedEmails.add` | `write` | Add email addresses to the user’s Mixmax auto BCC exclusion list. |
| `users.preferences.autoBccExcludedEmails.exists` | `mixmax.api.users.preferences.autoBccExcludedEmails.exists` | `read` | Check exactly which email addresses are excluded from the user’s Mixmax auto BCC list, including role exclusions. |
| `users.preferences.autoBccExcludedEmails.list` | `mixmax.api.users.preferences.autoBccExcludedEmails.list` | `read` | Check whether one email address is excluded from the user’s Mixmax auto BCC list. |
| `users.preferences.get` | `mixmax.api.users.preferences.get` | `read` | Get the calling user’s Mixmax preferences. |
| `users.preferences.update` | `mixmax.api.users.preferences.update` | `write` | Update the calling user’s Mixmax preferences. |
| `yesno.get` | `mixmax.api.yesno.get` | `read` | Retrieve one Mixmax yes/no question by id. |
| `yesno.list` | `mixmax.api.yesno.list` | `read` | List the user’s Mixmax yes/no questions with their answers. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/mixmax

## License

Apache-2.0
