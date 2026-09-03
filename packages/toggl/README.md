# @corsair-dev/toggl

Toggl plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/toggl
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `clients.archive` | `toggl.api.clients.archive` | `write` | Archive a client |
| `clients.create` | `toggl.api.clients.create` | `write` | Create a client |
| `clients.delete` | `toggl.api.clients.delete` | `destructive` | Delete a client [DESTRUCTIVE] |
| `clients.get` | `toggl.api.clients.get` | `read` | Get a client by id |
| `clients.list` | `toggl.api.clients.list` | `read` | List clients in a workspace |
| `clients.update` | `toggl.api.clients.update` | `write` | Update or archive a client |
| `me.disableProductEmails` | `toggl.api.me.disableProductEmails` | `write` | Unsubscribe the account from Toggl product emails |
| `me.disableWeeklyReport` | `toggl.api.me.disableWeeklyReport` | `write` | Unsubscribe the account from the weekly report email |
| `me.get` | `toggl.api.me.get` | `read` | Get the authenticated Toggl user |
| `me.getClients` | `toggl.api.me.getClients` | `read` | List clients across all workspaces the user can access |
| `me.getLocation` | `toggl.api.me.getLocation` | `read` | Get the last known location of the authenticated user |
| `me.getLogged` | `toggl.api.me.getLogged` | `read` | Check that the API token is valid |
| `me.getPreferences` | `toggl.api.me.getPreferences` | `read` | Get the authenticated user preferences |
| `me.getProjects` | `toggl.api.me.getProjects` | `read` | List projects across all workspaces the user can access |
| `me.getQuota` | `toggl.api.me.getQuota` | `read` | Get remaining API request quota per organization |
| `me.getTags` | `toggl.api.me.getTags` | `read` | List tags across all workspaces the user can access |
| `me.getTasks` | `toggl.api.me.getTasks` | `read` | List tasks across all workspaces the user can access |
| `me.update` | `toggl.api.me.update` | `write` | Update the authenticated user profile |
| `me.updatePreferences` | `toggl.api.me.updatePreferences` | `write` | Update the authenticated user preferences |
| `organizations.create` | `toggl.api.organizations.create` | `write` | Create an organization and its first workspace |
| `organizations.createGroup` | `toggl.api.organizations.createGroup` | `write` | Create a group in an organization |
| `organizations.createInvitation` | `toggl.api.organizations.createInvitation` | `write` | Invite people to an organization by email |
| `organizations.deleteGroup` | `toggl.api.organizations.deleteGroup` | `destructive` | Delete an organization group [DESTRUCTIVE] |
| `organizations.get` | `toggl.api.organizations.get` | `read` | Get an organization by id |
| `organizations.getGroups` | `toggl.api.organizations.getGroups` | `read` | List groups in an organization |
| `organizations.getPlans` | `toggl.api.organizations.getPlans` | `read` | Get billing and plan details for an organization |
| `organizations.getSubscriptionPlans` | `toggl.api.organizations.getSubscriptionPlans` | `read` | List subscription plans available to an organization |
| `organizations.getUsers` | `toggl.api.organizations.getUsers` | `read` | List users in an organization |
| `organizations.getWorkspaces` | `toggl.api.organizations.getWorkspaces` | `read` | List workspaces in an organization |
| `organizations.update` | `toggl.api.organizations.update` | `write` | Rename an organization |
| `projects.addUser` | `toggl.api.projects.addUser` | `write` | Add a user to a project |
| `projects.create` | `toggl.api.projects.create` | `write` | Create a project |
| `projects.delete` | `toggl.api.projects.delete` | `destructive` | Delete a project and its time entries [DESTRUCTIVE] |
| `projects.deleteGroup` | `toggl.api.projects.deleteGroup` | `destructive` | Delete a project group [DESTRUCTIVE] |
| `projects.get` | `toggl.api.projects.get` | `read` | Get a project by id |
| `projects.list` | `toggl.api.projects.list` | `read` | List projects in a workspace |
| `projects.update` | `toggl.api.projects.update` | `write` | Update a project |
| `reference.getCountries` | `toggl.api.reference.getCountries` | `read` | List countries Toggl supports, with VAT settings |
| `reference.getCountrySubdivisions` | `toggl.api.reference.getCountrySubdivisions` | `read` | List states or provinces for a country id from getCountries |
| `reference.getCurrencies` | `toggl.api.reference.getCurrencies` | `read` | List currencies Toggl supports |
| `reference.getKeys` | `toggl.api.reference.getKeys` | `read` | Get the JWKS keyset used to verify Toggl JWTs |
| `reference.getTimezoneOffsets` | `toggl.api.reference.getTimezoneOffsets` | `read` | List timezones with their UTC offsets |
| `reference.getTimezones` | `toggl.api.reference.getTimezones` | `read` | List timezones Toggl supports |
| `smail.sendContact` | `toggl.api.smail.sendContact` | `write` | Send an email to a contact |
| `smail.sendDemo` | `toggl.api.smail.sendDemo` | `write` | Send a product demo request email |
| `smail.sendMeet` | `toggl.api.smail.sendMeet` | `write` | Send a meeting invitation email |
| `tags.create` | `toggl.api.tags.create` | `write` | Create a tag |
| `tags.delete` | `toggl.api.tags.delete` | `destructive` | Delete a tag [DESTRUCTIVE] |
| `tags.list` | `toggl.api.tags.list` | `read` | List tags in a workspace |
| `tags.update` | `toggl.api.tags.update` | `write` | Rename a tag |
| `tasks.create` | `toggl.api.tasks.create` | `write` | Create a task |
| `tasks.delete` | `toggl.api.tasks.delete` | `destructive` | Delete a task [DESTRUCTIVE] |
| `tasks.get` | `toggl.api.tasks.get` | `read` | Get a task by id |
| `tasks.list` | `toggl.api.tasks.list` | `read` | List tasks in a project |
| `tasks.update` | `toggl.api.tasks.update` | `write` | Update a task |
| `timeEntries.bulkEdit` | `toggl.api.timeEntries.bulkEdit` | `write` | Bulk edit up to 100 time entries with JSON Patch |
| `timeEntries.create` | `toggl.api.timeEntries.create` | `write` | Create or start a time entry |
| `timeEntries.delete` | `toggl.api.timeEntries.delete` | `destructive` | Delete a time entry [DESTRUCTIVE] |
| `timeEntries.get` | `toggl.api.timeEntries.get` | `read` | Get a time entry by id |
| `timeEntries.getCurrent` | `toggl.api.timeEntries.getCurrent` | `read` | Get the currently running time entry, if any |
| `timeEntries.list` | `toggl.api.timeEntries.list` | `read` | List the current user time entries |
| `timeEntries.stop` | `toggl.api.timeEntries.stop` | `write` | Stop a running time entry |
| `timeEntries.update` | `toggl.api.timeEntries.update` | `write` | Update a time entry |
| `webhooks.deleteSubscription` | `toggl.api.webhooks.deleteSubscription` | `destructive` | Delete a webhook subscription [DESTRUCTIVE] |
| `webhooks.getEventFilters` | `toggl.api.webhooks.getEventFilters` | `read` | List event types available for webhook subscriptions |
| `webhooks.getStatus` | `toggl.api.webhooks.getStatus` | `read` | Check the Toggl webhooks service status |
| `webhooks.listSubscriptions` | `toggl.api.webhooks.listSubscriptions` | `read` | List webhook subscriptions for a workspace |
| `workspaces.get` | `toggl.api.workspaces.get` | `read` | Get a workspace by id |
| `workspaces.getLogo` | `toggl.api.workspaces.getLogo` | `read` | Get the workspace logo URL |
| `workspaces.getPreferences` | `toggl.api.workspaces.getPreferences` | `read` | Get workspace preferences |
| `workspaces.getUsers` | `toggl.api.workspaces.getUsers` | `read` | List users in a workspace |
| `workspaces.list` | `toggl.api.workspaces.list` | `read` | List workspaces the user belongs to |
| `workspaces.update` | `toggl.api.workspaces.update` | `write` | Update workspace settings |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/toggl

## License

Apache-2.0
