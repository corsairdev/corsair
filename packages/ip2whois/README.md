# @corsair-dev/ip2whois

IP2WHOIS plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ip2whois
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `domain.lookup` | `ip2whois.api.domain.lookup` | `destructive` | Look up WHOIS registration data for a domain. |
| `hosted.lookup` | `ip2whois.api.hosted.lookup` | `destructive` | List domains hosted on an IP address. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ip2whois

## License

Apache-2.0
