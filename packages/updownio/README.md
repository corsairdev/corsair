# @corsair-dev/updownio

Updown.io plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/updownio
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `checks.list` | `updownio.api.checks.list` | `read` | List all monitoring checks on the account |
| `nodes.list` | `updownio.api.nodes.list` | `read` | List all Updown.io monitoring and webhook nodes |
| `nodes.listIps` | `updownio.api.nodes.listIps` | `read` | List all Updown.io node IP addresses |
| `nodes.listIpv4` | `updownio.api.nodes.listIpv4` | `read` | List all Updown.io node IPv4 addresses |
| `nodes.listIpv6` | `updownio.api.nodes.listIpv6` | `read` | List all Updown.io node IPv6 addresses |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/updownio

## License

Apache-2.0
