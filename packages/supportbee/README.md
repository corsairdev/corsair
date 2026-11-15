# @corsair-dev/supportbee

Supportbee plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/supportbee
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attachments.create` | `supportbee.api.attachments.create` | `write` | Upload one file and get the id to attach to a reply, comment, draft or ticket |
| `comments.create` | `supportbee.api.comments.create` | `write` | Add an internal comment to a ticket. Only staff see it; the requester is not notified |
| `comments.list` | `supportbee.api.comments.list` | `read` | List the internal comments on one ticket |
| `drafts.create` | `supportbee.api.drafts.create` | `write` | Save a reply draft on a ticket |
| `drafts.delete` | `supportbee.api.drafts.delete` | `destructive` | Delete the reply draft on a ticket. The draft text is not returned anywhere afterwards |
| `drafts.get` | `supportbee.api.drafts.get` | `read` | Read the reply draft on a ticket, or a new one quoting the last message when none exists |
| `drafts.update` | `supportbee.api.drafts.update` | `write` | Replace the reply draft on a ticket |
| `emails.create` | `supportbee.api.emails.create` | `write` | Add a forwarding address. SupportBee generates the address that mail is forwarded to |
| `emails.list` | `supportbee.api.emails.list` | `read` | List the forwarding addresses that turn mail into tickets |
| `filters.create` | `supportbee.api.filters.create` | `write` | Link a rule to a consequence, which is what makes the filter act on matching tickets |
| `filters.createConsequence` | `supportbee.api.filters.createConsequence` | `write` | Create the action half of a filter: archive, spam, trash, label or assign |
| `filters.createRule` | `supportbee.api.filters.createRule` | `write` | Create the matching half of a filter. It does nothing until a filter links it to a consequence |
| `labels.list` | `supportbee.api.labels.list` | `read` | List the company label names and colours |
| `replies.create` | `supportbee.api.replies.create` | `write` | Send a reply to the requester. The mail leaves SupportBee, so this reaches the real customer |
| `replies.get` | `supportbee.api.replies.get` | `read` | Read one reply on one ticket |
| `replies.list` | `supportbee.api.replies.list` | `read` | List the replies on one ticket |
| `reports.avgFirstResponseTime` | `supportbee.api.reports.avgFirstResponseTime` | `read` | Daily average first-response time, as string data points with timestamps |
| `reports.repliesCount` | `supportbee.api.reports.repliesCount` | `read` | Daily reply count, as string data points with timestamps |
| `reports.ticketsCount` | `supportbee.api.reports.ticketsCount` | `read` | Daily ticket count, as string data points with timestamps |
| `snippets.create` | `supportbee.api.snippets.create` | `write` | Create a reply snippet with plain text or HTML |
| `snippets.delete` | `supportbee.api.snippets.delete` | `destructive` | Delete a reply snippet. The text is not returned anywhere afterwards |
| `snippets.list` | `supportbee.api.snippets.list` | `read` | List the reply snippets of the desk |
| `snippets.update` | `supportbee.api.snippets.update` | `write` | Change a snippet name, tags or content |
| `teams.list` | `supportbee.api.teams.list` | `read` | List the teams of the desk, optionally with their members |
| `tickets.addLabel` | `supportbee.api.tickets.addLabel` | `write` | Add a label to a ticket. The label has to exist on the company first |
| `tickets.archive` | `supportbee.api.tickets.archive` | `write` | Archive a ticket, which takes it out of the default list. The ticket stays readable |
| `tickets.assignTeam` | `supportbee.api.tickets.assignTeam` | `write` | Assign a ticket to a team. Reassigning to another team clears the user assignee |
| `tickets.assignUser` | `supportbee.api.tickets.assignUser` | `write` | Assign a ticket to a user. If the ticket is already assigned to a team, the user must be a member of it |
| `tickets.audit` | `supportbee.api.tickets.audit` | `read` | Read the audit trail of one ticket, oldest action first |
| `tickets.create` | `supportbee.api.tickets.create` | `write` | Open a ticket for a requester. Works without a token, and an unauthenticated call is capped at 5 tickets an hour per IP |
| `tickets.delete` | `supportbee.api.tickets.delete` | `destructive` | Delete a trashed ticket for good. Only an admin can delete, and only a ticket already in the trash |
| `tickets.get` | `supportbee.api.tickets.get` | `read` | Read one ticket with its requester, content and assignment |
| `tickets.list` | `supportbee.api.tickets.list` | `read` | List unarchived tickets in last-activity order, filtered by assignee, team, label, requester or date |
| `tickets.markAnswered` | `supportbee.api.tickets.markAnswered` | `write` | Mark a ticket answered without sending a reply, which is how an off-system answer is recorded |
| `tickets.markSpam` | `supportbee.api.tickets.markSpam` | `write` | Mark a ticket as spam |
| `tickets.markUnanswered` | `supportbee.api.tickets.markUnanswered` | `write` | Mark a ticket unanswered so it returns to the open queue |
| `tickets.removeLabel` | `supportbee.api.tickets.removeLabel` | `write` | Remove one label from a ticket |
| `tickets.search` | `supportbee.api.tickets.search` | `read` | Search tickets by text across subjects, bodies and requesters |
| `tickets.trash` | `supportbee.api.tickets.trash` | `write` | Move a ticket to the trash. It stays restorable until an admin deletes it |
| `tickets.unarchive` | `supportbee.api.tickets.unarchive` | `write` | Return an archived ticket to the default list |
| `tickets.unassignTeam` | `supportbee.api.tickets.unassignTeam` | `write` | Remove the ticket team assignee |
| `tickets.unassignUser` | `supportbee.api.tickets.unassignUser` | `write` | Remove the ticket assignee |
| `tickets.unmarkSpam` | `supportbee.api.tickets.unmarkSpam` | `write` | Clear the spam flag from a ticket |
| `tickets.untrash` | `supportbee.api.tickets.untrash` | `write` | Restore a trashed ticket |
| `users.addMember` | `supportbee.api.users.addMember` | `write` | Add a user to a customer group |
| `users.create` | `supportbee.api.users.create` | `write` | Create a user or a customer group. A group is a user with type customer_group |
| `users.get` | `supportbee.api.users.get` | `read` | Read one user or customer group |
| `users.list` | `supportbee.api.users.list` | `read` | List the users and customer groups of the desk, optionally with invited members or roles |
| `users.listMembers` | `supportbee.api.users.listMembers` | `read` | List the members of a customer group |
| `users.update` | `supportbee.api.users.update` | `write` | Change a user name, email, role, teams or group settings. The caller cannot update their own account here |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/supportbee

## License

Apache-2.0
