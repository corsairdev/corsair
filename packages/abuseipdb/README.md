# @corsair-dev/abuseipdb

AbuseIPDB plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/abuseipdb
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `address.clear` | `abuseipdb.api.address.clear` | `destructive` | Remove all reports for an IP address from your account and return the number deleted |
| `blacklist.get` | `abuseipdb.api.blacklist.get` | `read` | Download the blacklist of most-reported IPs, optionally filtered by confidence minimum, country, and IP version |
| `block.check` | `abuseipdb.api.block.check` | `read` | Check a CIDR network block and list the reported addresses within it |
| `check.ip` | `abuseipdb.api.check.ip` | `read` | Look up an IP address and get its abuse confidence score, country, ISP, usage type, and optionally recent reports |
| `report.ip` | `abuseipdb.api.report.ip` | `write` | Submit an abuse report for an IP address with one or more abuse category IDs |
| `reports.list` | `abuseipdb.api.reports.list` | `read` | Get a paginated list of abuse reports filed against a single IP address |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/abuseipdb

## License

Apache-2.0
