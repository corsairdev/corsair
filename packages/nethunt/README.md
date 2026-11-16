# @corsair-dev/nethunt

NetHunt CRM plugin for Corsair: list folders and their fields, find, page and audit records, and create, update, comment on, log calls against and delete them.

## Install

```bash
pnpm add @corsair-dev/nethunt
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.verify` | `nethunt.api.account.verify` | `read` | Confirm the email and key pair work and return the user behind them |
| `folders.fields` | `nethunt.api.folders.fields` | `read` | List a folder's field names, which are user-defined and are what a create or update must use |
| `folders.list` | `nethunt.api.folders.list` | `read` | List the folders this account can read, or only the ones it may create records in |
| `records.callLog` | `nethunt.api.records.callLog` | `write` | Log a call on a record’s timeline with its start time and duration in minutes |
| `records.changes` | `nethunt.api.records.changes` | `read` | Read the audit trail for a folder: who changed which field, when, with before and after values, including deletes |
| `records.comment` | `nethunt.api.records.comment` | `write` | Add a comment to a record’s timeline |
| `records.create` | `nethunt.api.records.create` | `write` | Create one record in a folder from a flat map of the folder’s field names, with the time zone NetHunt needs to read dates |
| `records.delete` | `nethunt.api.records.delete` | `destructive` | Delete a record permanently; NetHunt has no restore route and the audit trail keeps only the change entry |
| `records.find` | `nethunt.api.records.find` | `read` | Find records in a folder by id or by a text query such as Name:Doe |
| `records.linkThread` | `nethunt.api.records.linkThread` | `write` | Attach an existing Gmail thread to a record |
| `records.recent` | `nethunt.api.records.recent` | `read` | List records created in a folder after a timestamp; NetHunt defaults the window to 24 hours |
| `records.update` | `nethunt.api.records.update` | `write` | Update a record’s fields through per-field actions, each able to overwrite, remove or add values |
| `records.updated` | `nethunt.api.records.updated` | `read` | List records updated in a folder after a timestamp, optionally only when named fields changed |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/nethunt

## License

Apache-2.0
