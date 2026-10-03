# @corsair-dev/callingly

Callingly plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/callingly
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `agents.create` | `callingly.api.agents.create` | `write` | Register a new agent in Callingly |
| `agents.delete` | `callingly.api.agents.delete` | `destructive` | Permanently delete an agent from a Callingly account |
| `agents.getSchedule` | `callingly.api.agents.getSchedule` | `read` | Retrieve the availability schedule for a specific agent |
| `agents.list` | `callingly.api.agents.list` | `read` | List all agents and users under the account |
| `agents.update` | `callingly.api.agents.update` | `write` | Update agent information |
| `agents.updateSchedule` | `callingly.api.agents.updateSchedule` | `write` | Update an agent availability schedule |
| `calls.create` | `callingly.api.calls.create` | `write` | Initiate or trigger a new call to a lead |
| `calls.get` | `callingly.api.calls.get` | `read` | Retrieve call details, duration, and recording by ID |
| `calls.list` | `callingly.api.calls.list` | `read` | List call history and logs with optional team, user, and status filters |
| `clients.activateDeactivate` | `callingly.api.clients.activateDeactivate` | `write` | Activate or deactivate a client account |
| `clients.create` | `callingly.api.clients.create` | `write` | Create a new agency client account |
| `clients.delete` | `callingly.api.clients.delete` | `destructive` | Delete an agency client account by ID |
| `clients.list` | `callingly.api.clients.list` | `read` | List agency client accounts |
| `leads.delete` | `callingly.api.leads.delete` | `destructive` | Delete a lead by ID |
| `leads.get` | `callingly.api.leads.get` | `read` | Retrieve lead details by ID |
| `leads.list` | `callingly.api.leads.list` | `read` | List leads with optional date, phone number, and pagination filters |
| `leads.update` | `callingly.api.leads.update` | `write` | Update lead contact details and assignments |
| `teams.create` | `callingly.api.teams.create` | `write` | Create a new team in Callingly |
| `teams.get` | `callingly.api.teams.get` | `read` | Retrieve team details by ID |
| `teams.list` | `callingly.api.teams.list` | `read` | List teams in the Callingly account |
| `teams.listUsers` | `callingly.api.teams.listUsers` | `read` | Retrieve all agents assigned to a specific team |
| `teams.removeAgent` | `callingly.api.teams.removeAgent` | `destructive` | Remove a specific agent from a team |
| `teams.updateAgentSettings` | `callingly.api.teams.updateAgentSettings` | `write` | Update priority and capacity settings for a team agent |
| `teams.updateUsers` | `callingly.api.teams.updateUsers` | `write` | Update the list of agents assigned to a team |
| `webhooks.create` | `callingly.api.webhooks.create` | `write` | Create a new webhook for call or lead events |
| `webhooks.delete` | `callingly.api.webhooks.delete` | `destructive` | Delete a webhook by ID |
| `webhooks.get` | `callingly.api.webhooks.get` | `read` | Retrieve details of a specific webhook by ID |
| `webhooks.list` | `callingly.api.webhooks.list` | `read` | List configured webhooks |
| `webhooks.update` | `callingly.api.webhooks.update` | `write` | Update an existing webhook configuration by ID |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/callingly

## License

Apache-2.0
