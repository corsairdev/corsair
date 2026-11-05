# @corsair-dev/amcards

AMcards plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/amcards
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cards.list` | `amcards.api.cards.list` | `read` | List cards for the authenticated account |
| `categories.get` | `amcards.api.categories.get` | `read` | Get a card template category by id |
| `categories.list` | `amcards.api.categories.list` | `read` | List card template categories ordered by priority |
| `contacts.list` | `amcards.api.contacts.list` | `read` | List contacts, optionally filtered by name or email |
| `gifts.get` | `amcards.api.gifts.get` | `read` | Get a gift by id |
| `gifts.list` | `amcards.api.gifts.list` | `read` | List available gifts |
| `schema.getApi` | `amcards.api.schema.getApi` | `read` | Retrieve the AMcards API v1 schema (resource map) |
| `schema.getCategory` | `amcards.api.schema.getCategory` | `read` | Retrieve the readonly Category resource schema |
| `templates.get` | `amcards.api.templates.get` | `read` | Get a public card template by id |
| `templates.list` | `amcards.api.templates.list` | `read` | List public card templates |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/amcards

## License

Apache-2.0
