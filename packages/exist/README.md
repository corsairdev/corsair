# @corsair-dev/exist

Exist plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/exist
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attributes.acquire` | `exist.api.attributes.acquire` | `write` | Take ownership of attributes so this client can write their values, creating templated attributes the user does not have yet |
| `attributes.increment` | `exist.api.attributes.increment` | `write` | Add a delta to owned attributes' values for a given day |
| `attributes.list` | `exist.api.attributes.list` | `read` | List the user's attributes without their values |
| `attributes.listOwned` | `exist.api.attributes.listOwned` | `read` | List the attributes currently owned by this client |
| `attributes.listTemplates` | `exist.api.attributes.listTemplates` | `read` | List the attribute templates Exist supports |
| `attributes.listWithValues` | `exist.api.attributes.listWithValues` | `read` | List the user's attributes along with recent day values |
| `attributes.release` | `exist.api.attributes.release` | `write` | Release ownership of attributes, passing them to another service or making them inactive |
| `attributes.update` | `exist.api.attributes.update` | `write` | Overwrite owned attributes' total values for a given day, in batches of up to 35 |
| `averages.list` | `exist.api.averages.list` | `read` | List weekly average values per attribute |
| `correlations.list` | `exist.api.correlations.list` | `read` | List correlations Exist computed between the user's attributes |
| `insights.list` | `exist.api.insights.list` | `read` | List insights Exist generated about the user's data |
| `oauth.authorize` | `exist.api.oauth.authorize` | `read` | Build the Exist OAuth2 authorisation URL a user visits to grant access, with a CSRF state value; makes no API call |
| `users.getProfile` | `exist.api.users.getProfile` | `read` | Get the authenticated Exist user profile and unit preferences |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/exist

## License

Apache-2.0
