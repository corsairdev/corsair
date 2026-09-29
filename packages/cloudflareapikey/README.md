# @corsair-dev/cloudflareapikey

Cloudflare API token plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cloudflareapikey
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `cache.getRegionalTieredCache` | `cloudflareapikey.api.cache.getRegionalTieredCache` | `read` | Get the regional tiered cache setting for a zone |
| `dns.create` | `cloudflareapikey.api.dns.create` | `write` | Create a DNS record in a zone |
| `dns.delete` | `cloudflareapikey.api.dns.delete` | `destructive` | Delete a DNS record [DESTRUCTIVE] |
| `dns.list` | `cloudflareapikey.api.dns.list` | `read` | List, search, sort, and filter DNS records for a zone |
| `dns.overwrite` | `cloudflareapikey.api.dns.overwrite` | `write` | Completely overwrite a DNS record |
| `dnssec.delete` | `cloudflareapikey.api.dnssec.delete` | `destructive` | Delete DNSSEC configuration for a zone [DESTRUCTIVE] |
| `dnssec.update` | `cloudflareapikey.api.dnssec.update` | `write` | Enable or disable DNSSEC for a zone |
| `ips.get` | `cloudflareapikey.api.ips.get` | `read` | Retrieve Cloudflare or JD Cloud IP CIDR blocks |
| `lockdowns.create` | `cloudflareapikey.api.lockdowns.create` | `write` | Create a Zone Lockdown rule |
| `lockdowns.get` | `cloudflareapikey.api.lockdowns.get` | `read` | Get a Zone Lockdown rule by ID |
| `lockdowns.update` | `cloudflareapikey.api.lockdowns.update` | `write` | Update a Zone Lockdown rule |
| `rulesets.create` | `cloudflareapikey.api.rulesets.create` | `write` | Create a ruleset at account or zone scope |
| `rulesets.createRule` | `cloudflareapikey.api.rulesets.createRule` | `write` | Add a rule to an existing ruleset |
| `rulesets.delete` | `cloudflareapikey.api.rulesets.delete` | `destructive` | Delete all versions of a ruleset [DESTRUCTIVE] |
| `rulesets.deleteRule` | `cloudflareapikey.api.rulesets.deleteRule` | `destructive` | Delete a rule from a ruleset [DESTRUCTIVE] |
| `rulesets.get` | `cloudflareapikey.api.rulesets.get` | `read` | Fetch the latest version of a ruleset by ID |
| `rulesets.getEntrypointVersion` | `cloudflareapikey.api.rulesets.getEntrypointVersion` | `read` | Get a historical entrypoint ruleset version |
| `rulesets.update` | `cloudflareapikey.api.rulesets.update` | `write` | Update a ruleset (include every rule you want to keep) |
| `rulesets.updateRule` | `cloudflareapikey.api.rulesets.updateRule` | `write` | Update a specific rule in a ruleset |
| `s3.upload` | `cloudflareapikey.api.s3.upload` | `write` | Upload file content to an R2 bucket (S3-compatible object storage) |
| `zones.delete` | `cloudflareapikey.api.zones.delete` | `destructive` | Delete an existing zone [DESTRUCTIVE] |
| `zones.get` | `cloudflareapikey.api.zones.get` | `read` | Get details for a specific zone |
| `zones.list` | `cloudflareapikey.api.zones.list` | `read` | List, search, sort, and filter Cloudflare zones |
| `zones.rerunActivationCheck` | `cloudflareapikey.api.zones.rerunActivationCheck` | `write` | Trigger a new activation check for a pending zone |
| `zones.update` | `cloudflareapikey.api.zones.update` | `write` | Edit a Cloudflare zone (one of paused, type, or vanity_name_servers) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cloudflareapikey

## License

Apache-2.0
