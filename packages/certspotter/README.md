# @corsair-dev/certspotter

SSLMate Cert Spotter plugin for Corsair: search Certificate Transparency logs for a domain's certificates and follow the issuance firehose.

## Install

```bash
pnpm add @corsair-dev/certspotter
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `firehose` | `certspotter.api.firehose` | `read` | Read the continuous stream of new issuances across every log; requires a Firehose subscription and a cursor to continue from |
| `issuances.list` | `certspotter.api.issuances.list` | `read` | List the unexpired certificate issuances for a domain, newest last, with an `after` cursor for paging |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/certspotter

## License

Apache-2.0
