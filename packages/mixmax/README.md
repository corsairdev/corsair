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
