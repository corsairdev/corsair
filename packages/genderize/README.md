# @corsair-dev/genderize

Genderize plugin for Corsair: predict the gender behind a first or full name, one at a time or in a batch, with a confidence score and the number of records behind it.

## Install

```bash
pnpm add @corsair-dev/genderize
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `batch.names` | `genderize.api.batch.names` | `read` | Predict gender for several names at once, answered in the same order. A batch counts each name against the monthly quota, and `country_id` applies to every name in it |
| `name.predict` | `genderize.api.name.predict` | `read` | Predict the gender behind a first or full name, with a confidence score and the number of records behind it. Scoping by country changes the answer for names such as Kim or Andrea |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/genderize

## License

Apache-2.0
