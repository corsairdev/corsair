# @corsair-dev/certifier

Certifier plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/certifier
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `attributes.list` | `certifier.api.attributes.list` | `read` | List attribute definitions available for credentials, with pagination. |
| `credentialInteractions.list` | `certifier.api.credentialInteractions.list` | `read` | List credential interaction events, optionally filtered by credential. |
| `credentials.createIssueSend` | `certifier.api.credentials.createIssueSend` | `write` | Create, issue, and send a credential in a single request. |
| `credentials.list` | `certifier.api.credentials.list` | `read` | List credentials with cursor pagination. |
| `credentials.search` | `certifier.api.credentials.search` | `read` | Search credentials with AND/OR/NOT filters, sort, and pagination. |
| `credentials.send` | `certifier.api.credentials.send` | `write` | Send an issued credential by email. |
| `designs.list` | `certifier.api.designs.list` | `read` | List certificate and badge design templates. |
| `emailTemplates.list` | `certifier.api.emailTemplates.list` | `read` | List email templates used for credential delivery. |
| `groups.list` | `certifier.api.groups.list` | `read` | List credential templates (groups) with pagination. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/certifier

## License

Apache-2.0
