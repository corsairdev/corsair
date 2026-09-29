# @corsair-dev/cloudflare

Cloudflare plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/cloudflare
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `dns.create` | `cloudflare.api.dns.create` | `write` | Create a DNS record in a zone |
| `dns.delete` | `cloudflare.api.dns.delete` | `destructive` | Delete a DNS record [DESTRUCTIVE] |
| `dns.edit` | `cloudflare.api.dns.edit` | `write` | Update a DNS record |
| `dns.get` | `cloudflare.api.dns.get` | `read` | Retrieve a DNS record by ID |
| `dns.list` | `cloudflare.api.dns.list` | `read` | List DNS records for a zone |
| `rulesets.create` | `cloudflare.api.rulesets.create` | `write` | Create a ruleset in a zone |
| `rulesets.delete` | `cloudflare.api.rulesets.delete` | `destructive` | Delete a ruleset [DESTRUCTIVE] |
| `rulesets.get` | `cloudflare.api.rulesets.get` | `read` | Retrieve a ruleset by ID |
| `rulesets.list` | `cloudflare.api.rulesets.list` | `read` | List rulesets for a zone |
| `rulesets.update` | `cloudflare.api.rulesets.update` | `write` | Update a ruleset |
| `workers.routes.create` | `cloudflare.api.workers.routes.create` | `write` | Create a Workers route |
| `workers.routes.delete` | `cloudflare.api.workers.routes.delete` | `destructive` | Delete a Workers route [DESTRUCTIVE] |
| `workers.routes.edit` | `cloudflare.api.workers.routes.edit` | `write` | Update a Workers route |
| `workers.routes.get` | `cloudflare.api.workers.routes.get` | `read` | Retrieve a Workers route by ID |
| `workers.routes.list` | `cloudflare.api.workers.routes.list` | `read` | List Workers routes for a zone |
| `workers.scripts.delete` | `cloudflare.api.workers.scripts.delete` | `destructive` | Delete a Workers script [DESTRUCTIVE] |
| `workers.scripts.get` | `cloudflare.api.workers.scripts.get` | `read` | Download Workers script source code by name |
| `workers.scripts.list` | `cloudflare.api.workers.scripts.list` | `read` | List Workers scripts for an account |
| `workers.scripts.upload` | `cloudflare.api.workers.scripts.upload` | `write` | Upload or overwrite a Workers script |
| `zones.create` | `cloudflare.api.zones.create` | `write` | Create a new Cloudflare zone |
| `zones.delete` | `cloudflare.api.zones.delete` | `destructive` | Delete a Cloudflare zone [DESTRUCTIVE] |
| `zones.edit` | `cloudflare.api.zones.edit` | `write` | Update a Cloudflare zone |
| `zones.get` | `cloudflare.api.zones.get` | `read` | Retrieve a Cloudflare zone by ID |
| `zones.list` | `cloudflare.api.zones.list` | `read` | List Cloudflare zones |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/cloudflare

## License

Apache-2.0
