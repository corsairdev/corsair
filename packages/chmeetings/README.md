# @corsair-dev/chmeetings

ChMeetings plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/chmeetings
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attendance.list` | `chmeetings.api.attendance.list` | `read` | List attendance for an occurrence |
| `events.get` | `chmeetings.api.events.get` | `read` | Get an event by ID |
| `events.list` | `chmeetings.api.events.list` | `read` | List events in a date range (max 366 days) |
| `events.listOccurrences` | `chmeetings.api.events.listOccurrences` | `read` | List occurrences for an event in a date range |
| `families.create` | `chmeetings.api.families.create` | `write` | Create a family with members |
| `families.delete` | `chmeetings.api.families.delete` | `destructive` | Delete a family |
| `families.get` | `chmeetings.api.families.get` | `read` | Get a family by ID |
| `families.list` | `chmeetings.api.families.list` | `read` | List families |
| `groups.addMember` | `chmeetings.api.groups.addMember` | `write` | Add a person to a group |
| `groups.create` | `chmeetings.api.groups.create` | `write` | Create a group |
| `groups.delete` | `chmeetings.api.groups.delete` | `destructive` | Delete a group |
| `groups.get` | `chmeetings.api.groups.get` | `read` | Get a group by ID |
| `groups.list` | `chmeetings.api.groups.list` | `read` | List groups |
| `groups.removeMember` | `chmeetings.api.groups.removeMember` | `destructive` | Remove a person from a group |
| `groups.update` | `chmeetings.api.groups.update` | `write` | Update a group |
| `notes.list` | `chmeetings.api.notes.list` | `read` | List notes for a person |
| `organizations.addPerson` | `chmeetings.api.organizations.addPerson` | `write` | Add a person to an organization |
| `organizations.get` | `chmeetings.api.organizations.get` | `read` | Get an organization by ID |
| `organizations.list` | `chmeetings.api.organizations.list` | `read` | List organizations from GET /api/v1/organizations |
| `organizations.listPeople` | `chmeetings.api.organizations.listPeople` | `read` | List people in an organization |
| `organizations.removePerson` | `chmeetings.api.organizations.removePerson` | `destructive` | Remove a person from an organization |
| `people.create` | `chmeetings.api.people.create` | `write` | Create a person via POST /api/v1/people |
| `people.delete` | `chmeetings.api.people.delete` | `destructive` | Delete a person via DELETE /api/v1/people/{id} |
| `people.get` | `chmeetings.api.people.get` | `read` | Get a person by ID from GET /api/v1/people/{id} |
| `people.list` | `chmeetings.api.people.list` | `read` | List people from GET /api/v1/people |
| `people.listOrganizations` | `chmeetings.api.people.listOrganizations` | `read` | List a person organizations |
| `people.update` | `chmeetings.api.people.update` | `write` | Update a person via PUT /api/v1/people/{id} |
| `settings.get` | `chmeetings.api.settings.get` | `read` | Get genders, social statuses, grade values, family roles, and member fields |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/chmeetings

## License

Apache-2.0
