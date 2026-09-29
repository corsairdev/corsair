# @corsair-dev/apilabz

ApiLabz plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/apilabz
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `airtable.listTables` | `apilabz.api.airtable.listTables` | `read` | List Airtable tables for a base |
| `deals.integrate` | `apilabz.api.deals.integrate` | `write` | Integrate a deal into API Labz |
| `iban.validate` | `apilabz.api.iban.validate` | `read` | Validate an IBAN |
| `trello.aiSearchEngine` | `apilabz.api.trello.aiSearchEngine` | `read` | Run AI search across Trello data |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/apilabz

## License

Apache-2.0
