# @corsair-dev/genderapi

Gender API plugin for Corsair: look up the gender behind a first name, a batch of up to 100 names, an email address or a full name, with the sample count and accuracy behind each answer.

## Install

```bash
pnpm add @corsair-dev/genderapi
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.stats` | `genderapi.api.account.stats` | `read` | Read the remaining request count and whether the monthly limit is used up |
| `countryOfOrigin.get` | `genderapi.api.countryOfOrigin.get` | `read` | Find the countries a first name most likely comes from, each with a probability score |
| `email.lookup` | `genderapi.api.email.lookup` | `read` | Extract the first and last name from an email address and look up the gender behind the first name |
| `fullName.split` | `genderapi.api.fullName.split` | `read` | Split a full name into first and last name, then look up the gender behind the first name |
| `lookup.multi` | `genderapi.api.lookup.multi` | `read` | Look up up to 100 names in one request, answered in the same order, with an optional country per name |
| `lookup.name` | `genderapi.api.lookup.name` | `read` | Look up the gender behind one first name, with the sample count and the accuracy behind the answer. A country, locale or IP localizes it, which changes the answer for names such as Andrea |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/genderapi

## License

Apache-2.0
