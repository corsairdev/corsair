# @corsair-dev/campayn

Campayn plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/campayn
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `contacts.createContact` | `campayn.api.contacts.createContact` | `write` | Create a new contact in a contact list. |
| `contacts.deleteContact` | `campayn.api.contacts.deleteContact` | `destructive` | Delete a contact by contact ID. |
| `contacts.getContact` | `campayn.api.contacts.getContact` | `read` | Get full contact details by contact ID. |
| `contacts.getContacts` | `campayn.api.contacts.getContacts` | `read` | List contacts for a contact list, with optional contact keyword filtering. |
| `contacts.unsubscribeContact` | `campayn.api.contacts.unsubscribeContact` | `write` | Unsubscribe contacts from a list by contact ID or by email address. |
| `lists.deleteList` | `campayn.api.lists.deleteList` | `destructive` | Delete a contact list by list ID. |
| `lists.getLists` | `campayn.api.lists.getLists` | `read` | List all contact lists visible to the authenticated user. |
| `lists.updateList` | `campayn.api.lists.updateList` | `write` | Update a contact list name or tags by list ID. |
| `messages.getMessages` | `campayn.api.messages.getMessages` | `read` | List messages visible to the authenticated user. |
| `messages.getMessageStatistics` | `campayn.api.messages.getMessageStatistics` | `read` | Get message statistics for a specific message ID. |
| `reports.getReports` | `campayn.api.reports.getReports` | `read` | Get report calendar entries for sent and scheduled emails, optionally filtered by Unix timestamp range. |
| `signup.signup` | `campayn.api.signup.signup` | `write` | Create a Campayn account via POST /signup on the site root (not /api/v1). |
| `webforms.deleteWebform` | `campayn.api.webforms.deleteWebform` | `destructive` | Delete a webform by list ID and webform ID. |
| `webforms.getWebform` | `campayn.api.webforms.getWebform` | `read` | Get a webform by list ID and webform ID. |
| `webforms.getWebforms` | `campayn.api.webforms.getWebforms` | `read` | List webforms for a contact list, with optional form type filter. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/campayn

## License

Apache-2.0
