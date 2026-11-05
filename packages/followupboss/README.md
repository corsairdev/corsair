# @corsair-dev/followupboss

FollowUpBoss plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/followupboss
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.identity` | `followupboss.api.account.identity` | `read` | Get the account identity information behind the authenticated API key |
| `account.me` | `followupboss.api.account.me` | `read` | Get the authenticated user's profile and role |
| `appointments.create` | `followupboss.api.appointments.create` | `write` | Create an appointment with invitees, optionally sending them invitations |
| `appointments.delete` | `followupboss.api.appointments.delete` | `destructive` | Permanently delete an appointment |
| `appointments.get` | `followupboss.api.appointments.get` | `read` | Get one appointment by ID |
| `appointments.list` | `followupboss.api.appointments.list` | `read` | List appointments, filtered by person, user or date range, paged |
| `appointments.update` | `followupboss.api.appointments.update` | `write` | Update an appointment's time, place, type or invitees |
| `appointmentTypes.create` | `followupboss.api.appointmentTypes.create` | `write` | Create an appointment type with an optional sort order |
| `appointmentTypes.delete` | `followupboss.api.appointmentTypes.delete` | `destructive` | Delete an appointment type after reassigning its appointments to another type |
| `appointmentTypes.get` | `followupboss.api.appointmentTypes.get` | `read` | Get one appointment type by ID |
| `appointmentTypes.list` | `followupboss.api.appointmentTypes.list` | `read` | List the appointment types, sorted and paged |
| `appointmentTypes.update` | `followupboss.api.appointmentTypes.update` | `write` | Update an appointment type's name or sort order |
| `calls.create` | `followupboss.api.calls.create` | `write` | Log a call on a person with its direction, duration, outcome and note |
| `calls.get` | `followupboss.api.calls.get` | `read` | Get one logged call by ID |
| `calls.list` | `followupboss.api.calls.list` | `read` | List logged calls, filtered by person or phone number, paged |
| `calls.update` | `followupboss.api.calls.update` | `write` | Update a logged call's note, outcome or duration |
| `events.create` | `followupboss.api.events.create` | `write` | Push a lead event into Follow Up Boss's routing, which creates or matches the person and runs their action plans |
| `events.get` | `followupboss.api.events.get` | `read` | Get one lead event by ID |
| `events.list` | `followupboss.api.events.list` | `read` | List lead events, filtered by person, type or property, paged with the keyset cursor FUB enforces on deep pages |
| `notes.create` | `followupboss.api.notes.create` | `write` | Add a note to a person |
| `notes.delete` | `followupboss.api.notes.delete` | `destructive` | Permanently delete a note |
| `notes.get` | `followupboss.api.notes.get` | `read` | Get one note by ID, optionally with its threaded replies and reactions |
| `notes.update` | `followupboss.api.notes.update` | `write` | Update a note's subject, body or person |
| `people.checkDuplicate` | `followupboss.api.people.checkDuplicate` | `read` | Find existing people matching an email address or phone number before creating a new lead |
| `people.claim` | `followupboss.api.people.claim` | `write` | Claim an unclaimed lead so it becomes the user's contact |
| `people.create` | `followupboss.api.people.create` | `write` | Create a person, optionally merging into an existing duplicate instead of creating a new lead |
| `people.delete` | `followupboss.api.people.delete` | `destructive` | Permanently delete a person from the account |
| `people.get` | `followupboss.api.people.get` | `read` | Get one person by ID with their contact details, stage, source, tags and timeframes |
| `people.ignoreUnclaimed` | `followupboss.api.people.ignoreUnclaimed` | `write` | Ignore an unclaimed lead so it is no longer offered to the user; the lead answers 204 and is not deleted |
| `people.list` | `followupboss.api.people.list` | `read` | List people with filters such as name, email, phone, stage, source, tags or assignment, sorted and paged |
| `people.unclaimed` | `followupboss.api.people.unclaimed` | `read` | List the unclaimed leads currently offered to the user |
| `people.update` | `followupboss.api.people.update` | `write` | Update one person's contact details, stage, price, assignment, tags, timeframes or custom fields |
| `peopleRelationships.create` | `followupboss.api.peopleRelationships.create` | `write` | Create a partner relationship attached to a person |
| `peopleRelationships.delete` | `followupboss.api.peopleRelationships.delete` | `destructive` | Permanently delete a partner relationship |
| `peopleRelationships.get` | `followupboss.api.peopleRelationships.get` | `read` | Get one partner relationship by ID |
| `peopleRelationships.list` | `followupboss.api.peopleRelationships.list` | `read` | List the partner relationships of people, filtered by person or name |
| `peopleRelationships.update` | `followupboss.api.peopleRelationships.update` | `write` | Update the name, type or contact details of a relationship |
| `personAttachments.create` | `followupboss.api.personAttachments.create` | `write` | Attach an externally hosted file to a person |
| `personAttachments.delete` | `followupboss.api.personAttachments.delete` | `destructive` | Permanently delete a file attachment from a person |
| `personAttachments.get` | `followupboss.api.personAttachments.get` | `read` | Get one file attachment of a person by ID |
| `personAttachments.update` | `followupboss.api.personAttachments.update` | `write` | Update the file URI, name or size of a person attachment |
| `smartLists.get` | `followupboss.api.smartLists.get` | `read` | Get one smart list by ID |
| `smartLists.list` | `followupboss.api.smartLists.list` | `read` | List the account smart lists, paged |
| `tasks.create` | `followupboss.api.tasks.create` | `write` | Create a task such as a follow-up on a person |
| `tasks.delete` | `followupboss.api.tasks.delete` | `destructive` | Permanently delete a task |
| `tasks.get` | `followupboss.api.tasks.get` | `read` | Get one task by ID |
| `tasks.list` | `followupboss.api.tasks.list` | `read` | List tasks, filtered by person, assignee, type or due range, paged |
| `tasks.update` | `followupboss.api.tasks.update` | `write` | Update a task's name, type, due date or completion |
| `textMessages.create` | `followupboss.api.textMessages.create` | `write` | Log a text message on a person with its direction and byline details |
| `textMessages.get` | `followupboss.api.textMessages.get` | `read` | Get one text message by ID |
| `textMessages.list` | `followupboss.api.textMessages.list` | `read` | List text messages, filtered by person or phone number, paged |
| `timeframes.list` | `followupboss.api.timeframes.list` | `read` | List the named timeframes available for people |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/followupboss

## License

Apache-2.0
