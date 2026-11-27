# @corsair-dev/vpndetection

VPNDetection plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/vpndetection
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `ip.lookup` | `vpndetection.api.ip.lookup` | `read` | Check whether an IP address is a VPN, a Tor node or a privacy relay, with its country and ASN. |

## Auth

Auth: API key, optional. The API answers without one, so lookups work with no key stored; a key adds the fields its plan includes.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/vpndetection

## License

Apache-2.0
