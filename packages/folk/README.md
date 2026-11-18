# @corsair-dev/folk

Folk plugin for Corsair - manage people, companies, groups, interactions, notes, users, and credits.

## Install

```bash
pnpm add @corsair-dev/folk
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `companies.create` | `folk.api.companies.create` | `write` | Create a new company in the workspace |
| `companies.delete` | `folk.api.companies.delete` | `destructive` | Delete an existing company in the workspace |
| `companies.get` | `folk.api.companies.get` | `read` | Retrieve an existing company by ID |
| `companies.list` | `folk.api.companies.list` | `read` | Retrieve a paginated list of companies in the workspace |
| `companies.update` | `folk.api.companies.update` | `write` | Update an existing company in the workspace |
| `credits.get` | `folk.api.credits.get` | `read` | Retrieve credit balance for metered workspace features |
| `groupMembers.add` | `folk.api.groupMembers.add` | `write` | Add a workspace member to a group |
| `groupMembers.list` | `folk.api.groupMembers.list` | `read` | Retrieve members of a specific group |
| `groupMembers.remove` | `folk.api.groupMembers.remove` | `destructive` | Remove a member from a group |
| `groupMembers.update` | `folk.api.groupMembers.update` | `write` | Update a member role within a group |
| `groups.create` | `folk.api.groups.create` | `write` | Create a new group in the workspace |
| `groups.list` | `folk.api.groups.list` | `read` | Retrieve a paginated list of groups in the workspace |
| `groups.update` | `folk.api.groups.update` | `write` | Update an existing group in the workspace |
| `interactions.create` | `folk.api.interactions.create` | `write` | Log an interaction connected to a person or company |
| `interactions.delete` | `folk.api.interactions.delete` | `destructive` | Delete an existing interaction |
| `interactions.get` | `folk.api.interactions.get` | `read` | Retrieve a specific past or upcoming interaction by ID |
| `interactions.list` | `folk.api.interactions.list` | `read` | Retrieve interactions linked to people or companies |
| `interactions.listPast` | `folk.api.interactions.listPast` | `read` | Retrieve past interactions in the workspace |
| `interactions.listUpcoming` | `folk.api.interactions.listUpcoming` | `read` | Retrieve upcoming interactions in the workspace |
| `interactions.update` | `folk.api.interactions.update` | `write` | Update an existing interaction |
| `notes.create` | `folk.api.notes.create` | `write` | Create a note linked to a person or company |
| `notes.delete` | `folk.api.notes.delete` | `destructive` | Delete an existing note |
| `notes.get` | `folk.api.notes.get` | `read` | Retrieve a specific note by ID |
| `notes.list` | `folk.api.notes.list` | `read` | Retrieve notes in the workspace |
| `notes.update` | `folk.api.notes.update` | `write` | Update an existing note |
| `people.create` | `folk.api.people.create` | `write` | Create a new person in the workspace |
| `people.delete` | `folk.api.people.delete` | `destructive` | Delete an existing person in the workspace |
| `people.get` | `folk.api.people.get` | `read` | Retrieve an existing person by ID |
| `people.list` | `folk.api.people.list` | `read` | Retrieve a paginated list of people in the workspace |
| `people.update` | `folk.api.people.update` | `write` | Update an existing person in the workspace |
| `users.get` | `folk.api.users.get` | `read` | Retrieve a specific user by ID |
| `users.getCurrentUser` | `folk.api.users.getCurrentUser` | `read` | Retrieve the current authenticated user |
| `users.list` | `folk.api.users.list` | `read` | Retrieve users in the workspace |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/folk

## License

Apache-2.0
