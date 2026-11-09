# @corsair-dev/onedesk

OneDesk plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/onedesk
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `activities.filterDetails` | `onedesk.api.activities.filterDetails` | `read` | List activity log entries by filter |
| `attachments.attachToItem` | `onedesk.api.attachments.attachToItem` | `write` | Upload a file and attach it to a work item |
| `attachments.attachToOrganization` | `onedesk.api.attachments.attachToOrganization` | `write` | Upload a file and attach it to a customer organization |
| `attachments.attachToPortfolio` | `onedesk.api.attachments.attachToPortfolio` | `write` | Upload a file and attach it to a portfolio |
| `attachments.attachToProject` | `onedesk.api.attachments.attachToProject` | `write` | Upload a file and attach it to a project |
| `attachments.filter` | `onedesk.api.attachments.filter` | `read` | List attachment external ids by filter |
| `attachments.filterDetails` | `onedesk.api.attachments.filterDetails` | `read` | List attachments with their names |
| `attachments.get` | `onedesk.api.attachments.get` | `read` | Read one attachment record by external id |
| `attachments.upload` | `onedesk.api.attachments.upload` | `write` | Upload a file to the account and get its external id for attaching later |
| `conversations.create` | `onedesk.api.conversations.create` | `write` | Open a conversation on a work item or project, optionally with its first messages |
| `conversations.filter` | `onedesk.api.conversations.filter` | `read` | List conversation external ids by filter |
| `conversations.filterDetails` | `onedesk.api.conversations.filterDetails` | `read` | List conversations with their open and lock state |
| `conversations.get` | `onedesk.api.conversations.get` | `read` | Read one conversation by external id |
| `conversations.update` | `onedesk.api.conversations.update` | `write` | Close, reopen or lock a conversation |
| `customers.create` | `onedesk.api.customers.create` | `write` | Create a customer, optionally inside a customer organization |
| `customers.filter` | `onedesk.api.customers.filter` | `read` | List customer external ids by filter |
| `customers.filterDetails` | `onedesk.api.customers.filterDetails` | `read` | List customers with their contact details and organization |
| `customers.get` | `onedesk.api.customers.get` | `read` | Read one customer by external id or numeric id |
| `customers.update` | `onedesk.api.customers.update` | `write` | Change a customer, including deactivating them so they can no longer sign in |
| `invoices.filter` | `onedesk.api.invoices.filter` | `read` | List invoice external ids by filter |
| `invoices.filterDetails` | `onedesk.api.invoices.filterDetails` | `read` | List invoices with their status and totals |
| `invoices.get` | `onedesk.api.invoices.get` | `read` | Read one invoice by external id or numeric id |
| `invoices.update` | `onedesk.api.invoices.update` | `write` | Change an invoice: its status, due date and line items. A 'void' status cannot be undone |
| `items.create` | `onedesk.api.items.create` | `write` | Create a work item such as a ticket or task, optionally with requesters, followers, a project and custom fields |
| `items.filter` | `onedesk.api.items.filter` | `read` | List work item external ids by type and filter, with paging and a total count |
| `items.filterDetails` | `onedesk.api.items.filterDetails` | `read` | List work items with their details by type and filter, including assignees and lifecycle status |
| `items.get` | `onedesk.api.items.get` | `read` | Read one work item by external id or numeric id |
| `items.update` | `onedesk.api.items.update` | `write` | Change a work item: name, status, assignment, priority, dates, links and custom fields |
| `messages.create` | `onedesk.api.messages.create` | `write` | Post a message into a conversation |
| `messages.filter` | `onedesk.api.messages.filter` | `read` | List conversation message external ids by filter |
| `messages.filterDetails` | `onedesk.api.messages.filterDetails` | `read` | List conversation messages with their content and author |
| `messages.get` | `onedesk.api.messages.get` | `read` | Read one conversation message by external id |
| `messages.update` | `onedesk.api.messages.update` | `write` | Change a message body or its attachments |
| `organization.containerTypes` | `onedesk.api.organization.containerTypes` | `read` | List the organization container type names |
| `organization.itemTypes` | `onedesk.api.organization.itemTypes` | `read` | List the organization work item type names that create and filter calls require |
| `organization.lifecycleStatus` | `onedesk.api.organization.lifecycleStatus` | `read` | List the lifecycle status names an item or project can be moved to |
| `organization.profile` | `onedesk.api.organization.profile` | `read` | Read the organization profile and its policy settings |
| `organization.userTypes` | `onedesk.api.organization.userTypes` | `read` | List the organization user type names that user create calls accept |
| `organizations.create` | `onedesk.api.organizations.create` | `write` | Create a customer organization |
| `organizations.filter` | `onedesk.api.organizations.filter` | `read` | List customer organization external ids by filter |
| `organizations.filterDetails` | `onedesk.api.organizations.filterDetails` | `read` | List customer organizations with their domains and customers |
| `organizations.get` | `onedesk.api.organizations.get` | `read` | Read one customer organization by external id |
| `organizations.update` | `onedesk.api.organizations.update` | `write` | Change a customer organization, its domains or its customers |
| `portfolios.create` | `onedesk.api.portfolios.create` | `write` | Create a portfolio, optionally nested under others |
| `portfolios.filter` | `onedesk.api.portfolios.filter` | `read` | List portfolio external ids by filter |
| `portfolios.filterDetails` | `onedesk.api.portfolios.filterDetails` | `read` | List portfolios with their details |
| `portfolios.get` | `onedesk.api.portfolios.get` | `read` | Read one portfolio by external id |
| `portfolios.update` | `onedesk.api.portfolios.update` | `write` | Change a portfolio name, parents or attachments |
| `projects.create` | `onedesk.api.projects.create` | `write` | Create a project, optionally under portfolios |
| `projects.filter` | `onedesk.api.projects.filter` | `read` | List project external ids by filter |
| `projects.filterDetails` | `onedesk.api.projects.filterDetails` | `read` | List projects with their lifecycle status and invoice type |
| `projects.get` | `onedesk.api.projects.get` | `read` | Read one project by external id or numeric id |
| `projects.update` | `onedesk.api.projects.update` | `write` | Change a project: name, lifecycle status, portfolios and custom fields |
| `quotes.filter` | `onedesk.api.quotes.filter` | `read` | List quote external ids by filter |
| `quotes.filterDetails` | `onedesk.api.quotes.filterDetails` | `read` | List quotes with their status and totals |
| `quotes.get` | `onedesk.api.quotes.get` | `read` | Read one quote by external id or numeric id |
| `quotes.update` | `onedesk.api.quotes.update` | `write` | Change a quote: its status, expiration date and line items |
| `teams.create` | `onedesk.api.teams.create` | `write` | Create a team with an initial set of members |
| `teams.filter` | `onedesk.api.teams.filter` | `read` | List team external ids by filter |
| `teams.filterDetails` | `onedesk.api.teams.filterDetails` | `read` | List teams with their members |
| `teams.get` | `onedesk.api.teams.get` | `read` | Read one team by external id |
| `teams.update` | `onedesk.api.teams.update` | `write` | Rename a team or change its members |
| `timers.cancel` | `onedesk.api.timers.cancel` | `destructive` | Cancel a work timer, discarding the work recorded in that run |
| `timers.filter` | `onedesk.api.timers.filter` | `read` | List timer external ids by filter |
| `timers.filterDetails` | `onedesk.api.timers.filterDetails` | `read` | List timers with their status and accumulated work |
| `timers.get` | `onedesk.api.timers.get` | `read` | Read one timer by external id |
| `timers.pause` | `onedesk.api.timers.pause` | `write` | Pause a running work timer |
| `timers.resume` | `onedesk.api.timers.resume` | `write` | Resume a paused work timer |
| `timers.start` | `onedesk.api.timers.start` | `write` | Start a work timer on a work item |
| `timesheets.create` | `onedesk.api.timesheets.create` | `write` | Book work against a work item for a user |
| `timesheets.filter` | `onedesk.api.timesheets.filter` | `read` | List timesheet external ids by filter |
| `timesheets.filterDetails` | `onedesk.api.timesheets.filterDetails` | `read` | List timesheets with their hours, dates and approval status |
| `timesheets.get` | `onedesk.api.timesheets.get` | `read` | Read one timesheet by external id or numeric id |
| `timesheets.update` | `onedesk.api.timesheets.update` | `write` | Change a timesheet, including approving or declining it and marking it billable |
| `users.create` | `onedesk.api.users.create` | `write` | Create a user, which sends them an invitation to the account |
| `users.filter` | `onedesk.api.users.filter` | `read` | List user external ids by filter |
| `users.filterDetails` | `onedesk.api.users.filterDetails` | `read` | List users with their profile, address and teams |
| `users.get` | `onedesk.api.users.get` | `read` | Read one user by external id or numeric id |
| `users.update` | `onedesk.api.users.update` | `write` | Change a user profile, teams or custom fields |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/onedesk

## License

Apache-2.0
