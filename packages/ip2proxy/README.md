# @corsair-dev/ip2proxy

IP2Proxy plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/ip2proxy
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `proxy.checkProxy` | `ip2proxy.api.proxy.checkProxy` | `read` | Check whether an IP address is a proxy, VPN, Tor exit, or data-center address. |
| `account.getCredits` | `ip2proxy.api.account.getCredits` | `read` | Get the credits left on the API key. The balance lags by about 10 minutes. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/ip2proxy

## License

Apache-2.0
