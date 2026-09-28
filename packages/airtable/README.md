# @corsair-dev/airtable

Airtable plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/airtable
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bases.getMany` | `airtable.api.bases.getMany` | `read` | List all accessible bases |
| `bases.getSchema` | `airtable.api.bases.getSchema` | `read` | Get the schema (tables, fields, views) of a base |
| `records.create` | `airtable.api.records.create` | `write` | Create a record in a table |
| `records.createOrUpdate` | `airtable.api.records.createOrUpdate` | `write` | Create or update a record using upsert |
| `records.delete` | `airtable.api.records.delete` | `destructive` | Delete a record from a table [DESTRUCTIVE] |
| `records.get` | `airtable.api.records.get` | `read` | Get a single record by ID |
| `records.search` | `airtable.api.records.search` | `read` | Search and list records with optional filters |
| `records.update` | `airtable.api.records.update` | `write` | Update fields on an existing record |
| `webhooks.getPayloads` | `airtable.api.webhooks.getPayloads` | `read` | Get webhook payloads |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 1 webhook event. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/airtable

## License

Apache-2.0
