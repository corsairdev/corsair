# @corsair-dev/googlecontacts

GoogleContacts plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/googlecontacts
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contactGroups.create` | `googlecontacts.api.contactGroups.create` | `write` | Create a contact group |
| `contactGroups.delete` | `googlecontacts.api.contactGroups.delete` | `destructive` | Delete a contact group, optionally with its contacts [DESTRUCTIVE · IRREVERSIBLE] |
| `contactGroups.get` | `googlecontacts.api.contactGroups.get` | `read` | Get a single contact group |
| `contactGroups.list` | `googlecontacts.api.contactGroups.list` | `read` | List contact groups |
| `contactGroups.modifyMembers` | `googlecontacts.api.contactGroups.modifyMembers` | `write` | Add or remove contacts from a group |
| `contactGroups.update` | `googlecontacts.api.contactGroups.update` | `write` | Rename a contact group |
| `contacts.create` | `googlecontacts.api.contacts.create` | `write` | Create a new contact |
| `contacts.delete` | `googlecontacts.api.contacts.delete` | `destructive` | Permanently delete a contact [DESTRUCTIVE · IRREVERSIBLE] |
| `contacts.deletePhoto` | `googlecontacts.api.contacts.deletePhoto` | `destructive` | Remove a contact's photo [DESTRUCTIVE] |
| `contacts.get` | `googlecontacts.api.contacts.get` | `read` | Get a single contact |
| `contacts.list` | `googlecontacts.api.contacts.list` | `read` | List the user's contacts |
| `contacts.search` | `googlecontacts.api.contacts.search` | `read` | Search contacts by name, email or phone |
| `contacts.update` | `googlecontacts.api.contacts.update` | `write` | Update an existing contact |
| `contacts.updatePhoto` | `googlecontacts.api.contacts.updatePhoto` | `write` | Set or replace a contact's photo |
| `otherContacts.copyToContacts` | `googlecontacts.api.otherContacts.copyToContacts` | `write` | Copy an auto-saved contact into the saved contacts |
| `otherContacts.list` | `googlecontacts.api.otherContacts.list` | `read` | List auto-saved contacts the user never filed |
| `otherContacts.search` | `googlecontacts.api.otherContacts.search` | `read` | Search auto-saved contacts |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/googlecontacts

## License

Apache-2.0
