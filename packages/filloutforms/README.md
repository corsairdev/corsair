# @corsair-dev/filloutforms

FilloutForms plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/filloutforms
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `databases.create` | `filloutforms.api.databases.create` | `write` | Create a Zite database with tables and fields |
| `databases.delete` | `filloutforms.api.databases.delete` | `destructive` | Permanently delete a Zite database [DESTRUCTIVE] |
| `databases.get` | `filloutforms.api.databases.get` | `read` | List Zite databases for the organization |
| `databases.getById` | `filloutforms.api.databases.getById` | `read` | Get a Zite database with tables, fields, and views |
| `fields.create` | `filloutforms.api.fields.create` | `write` | Add a field to a Zite table |
| `fields.delete` | `filloutforms.api.fields.delete` | `destructive` | Permanently delete a Zite field [DESTRUCTIVE] |
| `fields.update` | `filloutforms.api.fields.update` | `write` | Update a Zite field name or template |
| `forms.getFormMetadata` | `filloutforms.api.forms.getFormMetadata` | `read` | Get form metadata including questions and configuration |
| `forms.getForms` | `filloutforms.api.forms.getForms` | `read` | List all Fillout forms |
| `oauth.authorize` | `filloutforms.api.oauth.authorize` | `read` | Generate the Fillout OAuth authorization URL |
| `records.create` | `filloutforms.api.records.create` | `write` | Create a Zite record |
| `records.delete` | `filloutforms.api.records.delete` | `destructive` | Permanently delete a Zite record [DESTRUCTIVE] |
| `records.getById` | `filloutforms.api.records.getById` | `read` | Get a Zite record by UUID |
| `records.list` | `filloutforms.api.records.list` | `read` | List Zite records with filter, sort, and pagination |
| `records.update` | `filloutforms.api.records.update` | `write` | Update fields on a Zite record |
| `submissions.create` | `filloutforms.api.submissions.create` | `write` | Create new form submissions |
| `submissions.delete` | `filloutforms.api.submissions.delete` | `destructive` | Delete a form submission by ID [DESTRUCTIVE] |
| `submissions.getById` | `filloutforms.api.submissions.getById` | `read` | Get a single submission by ID |
| `submissions.list` | `filloutforms.api.submissions.list` | `read` | List form submissions with filtering and pagination |
| `tables.create` | `filloutforms.api.tables.create` | `write` | Create a table in a Zite database |
| `tables.delete` | `filloutforms.api.tables.delete` | `destructive` | Permanently delete a Zite table [DESTRUCTIVE] |
| `tables.update` | `filloutforms.api.tables.update` | `write` | Update Zite table properties such as name |
| `token.invalidate` | `filloutforms.api.token.invalidate` | `destructive` | Invalidate/revoke an OAuth access token [DESTRUCTIVE] |
| `webhooks.createDatabase` | `filloutforms.api.webhooks.createDatabase` | `write` | Create a Zite database webhook |
| `webhooks.createForm` | `filloutforms.api.webhooks.createForm` | `write` | Create a Fillout form submission webhook |
| `webhooks.deleteDatabase` | `filloutforms.api.webhooks.deleteDatabase` | `destructive` | Delete a Zite database webhook [DESTRUCTIVE] |
| `webhooks.listDatabase` | `filloutforms.api.webhooks.listDatabase` | `read` | List Zite database webhooks |
| `webhooks.removeForm` | `filloutforms.api.webhooks.removeForm` | `destructive` | Remove a Fillout form webhook [DESTRUCTIVE] |

## Auth

Auth: API key, OAuth 2.0 (default API key). Set `authType` on the plugin factory to pick one.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/filloutforms

## License

Apache-2.0
