# @corsair-dev/linguapop

Linguapop placement test plugin for Corsair: list test languages and create candidate invitations. Result callbacks are not handled.

## Install

```bash
pnpm add @corsair-dev/linguapop
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `invitations.create` | `linguapop.api.invitations.create` | `write` | Create a placement test invitation for a candidate and return the test link; with sendEmail true, Linguapop emails the invitation to the candidate. Needs a paid Linguapop subscription, the invitation cannot be cancelled through the API, and completed tests are billed |
| `languages.list` | `linguapop.api.languages.list` | `read` | List the languages Linguapop can test, each with the code to pass as languageCode when creating an invitation |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/linguapop

## License

Apache-2.0
