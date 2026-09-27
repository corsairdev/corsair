# @corsair-dev/nextdns

NextDNS plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/nextdns
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `allowlist.add` | `nextdns.api.allowlist.add` | `write` | Allow a domain |
| `allowlist.delete` | `nextdns.api.allowlist.delete` | `write` | Remove a domain from the allowlist |
| `allowlist.get` | `nextdns.api.allowlist.get` | `read` | List allowed domains |
| `allowlist.replace` | `nextdns.api.allowlist.replace` | `destructive` | Replace the entire allowlist |
| `allowlist.update` | `nextdns.api.allowlist.update` | `write` | Toggle an allowlist entry active/inactive |
| `analytics.destinations` | `nextdns.api.analytics.destinations` | `read` | Get query-destination analytics |
| `analytics.devices` | `nextdns.api.analytics.devices` | `read` | Get per-device analytics |
| `analytics.dnssec` | `nextdns.api.analytics.dnssec` | `read` | Get DNSSEC validation analytics |
| `analytics.domains` | `nextdns.api.analytics.domains` | `read` | Get per-domain analytics |
| `analytics.encryption` | `nextdns.api.analytics.encryption` | `read` | Get encrypted-vs-plain DNS analytics |
| `analytics.ips` | `nextdns.api.analytics.ips` | `read` | Get per-client-IP analytics |
| `analytics.ipVersions` | `nextdns.api.analytics.ipVersions` | `read` | Get IPv4/IPv6 distribution analytics |
| `analytics.protocols` | `nextdns.api.analytics.protocols` | `read` | Get DNS protocol distribution analytics |
| `analytics.queryTypes` | `nextdns.api.analytics.queryTypes` | `read` | Get DNS query-type analytics |
| `analytics.reasons` | `nextdns.api.analytics.reasons` | `read` | Get blocking-reason analytics |
| `analytics.status` | `nextdns.api.analytics.status` | `read` | Get query-status analytics |
| `auth.login` | `nextdns.api.auth.login` | `read` | Verify the API key is valid |
| `denylist.add` | `nextdns.api.denylist.add` | `write` | Block a domain |
| `denylist.list` | `nextdns.api.denylist.list` | `read` | List blocked domains |
| `denylist.remove` | `nextdns.api.denylist.remove` | `write` | Unblock a domain |
| `denylist.replace` | `nextdns.api.denylist.replace` | `destructive` | Replace the entire denylist |
| `denylist.update` | `nextdns.api.denylist.update` | `write` | Toggle a denylist entry active/inactive |
| `logs.clear` | `nextdns.api.logs.clear` | `destructive` | Clear all stored query logs - cannot be undone |
| `logs.download` | `nextdns.api.logs.download` | `read` | Download the CSV log export |
| `logs.get` | `nextdns.api.logs.get` | `read` | Get raw or filtered DNS query logs |
| `parentalControl.addCategory` | `nextdns.api.parentalControl.addCategory` | `write` | Block or allow a content category |
| `parentalControl.addService` | `nextdns.api.parentalControl.addService` | `write` | Block or allow a specific service |
| `parentalControl.deleteCategory` | `nextdns.api.parentalControl.deleteCategory` | `write` | Remove a content category restriction |
| `parentalControl.deleteService` | `nextdns.api.parentalControl.deleteService` | `write` | Remove a service restriction |
| `parentalControl.get` | `nextdns.api.parentalControl.get` | `read` | Get parental control settings |
| `parentalControl.getCategories` | `nextdns.api.parentalControl.getCategories` | `read` | Get blocked/allowed content categories |
| `parentalControl.getServices` | `nextdns.api.parentalControl.getServices` | `read` | Get blocked/allowed services |
| `parentalControl.replaceCategories` | `nextdns.api.parentalControl.replaceCategories` | `destructive` | Replace the entire set of category restrictions |
| `parentalControl.replaceServices` | `nextdns.api.parentalControl.replaceServices` | `destructive` | Replace the entire set of service restrictions |
| `parentalControl.update` | `nextdns.api.parentalControl.update` | `write` | Update safe search, YouTube restricted mode, or bypass blocking |
| `parentalControl.updateCategory` | `nextdns.api.parentalControl.updateCategory` | `write` | Toggle a content category restriction |
| `parentalControl.updateService` | `nextdns.api.parentalControl.updateService` | `write` | Toggle a service restriction |
| `privacy.addBlocklist` | `nextdns.api.privacy.addBlocklist` | `write` | Enable an additional privacy blocklist |
| `privacy.addNative` | `nextdns.api.privacy.addNative` | `write` | Block a native tracking service from a specific vendor |
| `privacy.deleteBlocklist` | `nextdns.api.privacy.deleteBlocklist` | `write` | Remove a privacy blocklist |
| `privacy.deleteNative` | `nextdns.api.privacy.deleteNative` | `write` | Unblock a native tracking service |
| `privacy.get` | `nextdns.api.privacy.get` | `read` | Get privacy settings |
| `privacy.replaceBlocklists` | `nextdns.api.privacy.replaceBlocklists` | `destructive` | Replace the entire set of enabled privacy blocklists |
| `privacy.replaceNatives` | `nextdns.api.privacy.replaceNatives` | `destructive` | Replace the entire set of blocked native trackers |
| `privacy.update` | `nextdns.api.privacy.update` | `write` | Update disguised-tracker and affiliate-link settings |
| `profiles.create` | `nextdns.api.profiles.create` | `write` | Create a new profile |
| `profiles.delete` | `nextdns.api.profiles.delete` | `destructive` | Delete a profile - cannot be undone |
| `profiles.get` | `nextdns.api.profiles.get` | `read` | Get full profile details including nested settings and lists |
| `profiles.list` | `nextdns.api.profiles.list` | `read` | List every profile the API key can see |
| `profiles.rename` | `nextdns.api.profiles.rename` | `write` | Rename a profile |
| `profiles.update` | `nextdns.api.profiles.update` | `write` | Partially update a profile |
| `rewrites.add` | `nextdns.api.rewrites.add` | `write` | Add a DNS rewrite rule |
| `rewrites.delete` | `nextdns.api.rewrites.delete` | `write` | Delete a DNS rewrite rule |
| `rewrites.get` | `nextdns.api.rewrites.get` | `read` | List DNS rewrite rules |
| `security.addBlockedTld` | `nextdns.api.security.addBlockedTld` | `write` | Add a top-level domain to the security blocklist |
| `security.get` | `nextdns.api.security.get` | `read` | Get security settings |
| `security.getTlds` | `nextdns.api.security.getTlds` | `read` | Get blocked top-level domains |
| `security.removeBlockedTld` | `nextdns.api.security.removeBlockedTld` | `write` | Remove a top-level domain from the security blocklist |
| `security.replaceTlds` | `nextdns.api.security.replaceTlds` | `destructive` | Replace the entire blocked-TLD list |
| `security.update` | `nextdns.api.security.update` | `write` | Update multiple security settings in one call |
| `settings.get` | `nextdns.api.settings.get` | `read` | Get all settings for a profile |
| `settings.getBlockPage` | `nextdns.api.settings.getBlockPage` | `read` | Get block page settings |
| `settings.getLogs` | `nextdns.api.settings.getLogs` | `read` | Get logging settings |
| `settings.getPerformance` | `nextdns.api.settings.getPerformance` | `read` | Get performance settings (ECS, cache boost, CNAME flattening) |
| `settings.logClientIps` | `nextdns.api.settings.logClientIps` | `write` | Enable or disable logging of client IPs |
| `settings.logDomains` | `nextdns.api.settings.logDomains` | `write` | Enable or disable logging of queried domains |
| `settings.update` | `nextdns.api.settings.update` | `write` | Update multiple settings categories in one call |
| `settings.updateBlockPage` | `nextdns.api.settings.updateBlockPage` | `write` | Enable or disable the branded block page |
| `settings.updateLogs` | `nextdns.api.settings.updateLogs` | `write` | Update log retention, storage location, and privacy options |
| `settings.updatePerformance` | `nextdns.api.settings.updatePerformance` | `write` | Update performance optimization settings |
| `setup.updateLinkedIp` | `nextdns.api.setup.updateLinkedIp` | `write` | Update the profile's Linked IP to the caller's current public IP |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/nextdns

## License

Apache-2.0
