# @corsair-dev/bunnycdn

Bunnycdn plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/bunnycdn
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apiKeys.list` | `bunnycdn.api.apiKeys.list` | `read` | List API keys on the account |
| `billing.summary` | `bunnycdn.api.billing.summary` | `read` | Retrieve the billing summary for the account |
| `containers.applicationsList` | `bunnycdn.api.containers.applicationsList` | `read` | List Magic Container applications |
| `containers.configSuggestions` | `bunnycdn.api.containers.configSuggestions` | `read` | Get deployment configuration suggestions for a container image |
| `containers.imageDigest` | `bunnycdn.api.containers.imageDigest` | `read` | Get the digest of a container image |
| `containers.imageTags` | `bunnycdn.api.containers.imageTags` | `read` | List tags for a container image |
| `containers.nodesList` | `bunnycdn.api.containers.nodesList` | `read` | List Magic Container nodes |
| `containers.optimalBaseRegion` | `bunnycdn.api.containers.optimalBaseRegion` | `read` | Get the optimal base region for Magic Containers |
| `containers.publicImagesSearch` | `bunnycdn.api.containers.publicImagesSearch` | `read` | Search public container images by prefix |
| `containers.regionsList` | `bunnycdn.api.containers.regionsList` | `read` | List Magic Container regions |
| `containers.registriesList` | `bunnycdn.api.containers.registriesList` | `read` | List container registries |
| `containers.registryDelete` | `bunnycdn.api.containers.registryDelete` | `destructive` | Delete a container registry |
| `containers.userLimits` | `bunnycdn.api.containers.userLimits` | `read` | Get Magic Container limits for the account |
| `containers.volumesList` | `bunnycdn.api.containers.volumesList` | `read` | List volumes for a Magic Container application |
| `dnsZone.checkAvailability` | `bunnycdn.api.dnsZone.checkAvailability` | `read` | Check whether a DNS zone name is available |
| `dnsZone.createRecord` | `bunnycdn.api.dnsZone.createRecord` | `write` | Create a new DNS record in a DNS zone |
| `dnsZone.deleteRecord` | `bunnycdn.api.dnsZone.deleteRecord` | `destructive` | Delete a DNS record |
| `dnsZone.get` | `bunnycdn.api.dnsZone.get` | `read` | Get details of a specific DNS zone |
| `dnsZone.list` | `bunnycdn.api.dnsZone.list` | `read` | List all DNS zones |
| `dnsZone.updateRecord` | `bunnycdn.api.dnsZone.updateRecord` | `write` | Update an existing DNS record |
| `edgeScripts.list` | `bunnycdn.api.edgeScripts.list` | `read` | List all edge scripts |
| `pullZone.addAllowedReferrer` | `bunnycdn.api.pullZone.addAllowedReferrer` | `write` | Add a hostname to the allowed referer list |
| `pullZone.addBlockedIp` | `bunnycdn.api.pullZone.addBlockedIp` | `write` | Add an IP address to the blocked list |
| `pullZone.addBlockedReferrer` | `bunnycdn.api.pullZone.addBlockedReferrer` | `write` | Add a blocked referer to a pull zone |
| `pullZone.checkAvailability` | `bunnycdn.api.pullZone.checkAvailability` | `read` | Check whether a pull zone name is available |
| `pullZone.create` | `bunnycdn.api.pullZone.create` | `write` | Create a new pull zone |
| `pullZone.edgeRuleDelete` | `bunnycdn.api.pullZone.edgeRuleDelete` | `destructive` | Delete an edge rule from a pull zone |
| `pullZone.edgeRuleSetEnabled` | `bunnycdn.api.pullZone.edgeRuleSetEnabled` | `write` | Enable or disable an edge rule without deleting it |
| `pullZone.edgeRuleUpsert` | `bunnycdn.api.pullZone.edgeRuleUpsert` | `write` | Add or update an edge rule on a pull zone |
| `pullZone.get` | `bunnycdn.api.pullZone.get` | `read` | Get details of a specific pull zone by ID |
| `pullZone.list` | `bunnycdn.api.pullZone.list` | `read` | List pull zones with pagination and search |
| `pullZone.optimizerStatistics` | `bunnycdn.api.pullZone.optimizerStatistics` | `read` | Retrieve optimizer statistics for a pull zone |
| `pullZone.originShieldQueueStatistics` | `bunnycdn.api.pullZone.originShieldQueueStatistics` | `read` | Retrieve origin shield queue statistics for a pull zone |
| `pullZone.purgeCache` | `bunnycdn.api.pullZone.purgeCache` | `write` | Purge cached content for a pull zone, optionally by cache tag |
| `pullZone.remove` | `bunnycdn.api.pullZone.remove` | `destructive` | Delete a specific pull zone by ID |
| `pullZone.removeAllowedReferrer` | `bunnycdn.api.pullZone.removeAllowedReferrer` | `write` | Remove a hostname from the allowed referer list |
| `pullZone.removeBlockedIp` | `bunnycdn.api.pullZone.removeBlockedIp` | `write` | Remove an IP address from the blocked list |
| `pullZone.removeBlockedReferrer` | `bunnycdn.api.pullZone.removeBlockedReferrer` | `write` | Remove a blocked referer from a pull zone |
| `pullZone.resetSecurityKey` | `bunnycdn.api.pullZone.resetSecurityKey` | `write` | Reset the URL token security key for a pull zone |
| `pullZone.safeHopStatistics` | `bunnycdn.api.pullZone.safeHopStatistics` | `read` | Retrieve SafeHop statistics for a pull zone |
| `pullZone.setForceSSL` | `bunnycdn.api.pullZone.setForceSSL` | `write` | Enable or disable Force SSL on a pull zone hostname |
| `pullZone.update` | `bunnycdn.api.pullZone.update` | `write` | Update settings for a specific pull zone |
| `purge.url` | `bunnycdn.api.purge.url` | `write` | Purge a single URL from cache across pull zones |
| `search.global` | `bunnycdn.api.search.global` | `read` | Global search across pull zones, storage zones, DNS zones and more |
| `shield.accessListConfigUpdate` | `bunnycdn.api.shield.accessListConfigUpdate` | `write` | Update an access list configuration action or enabled state |
| `shield.accessListCreate` | `bunnycdn.api.shield.accessListCreate` | `write` | Create a custom access list in a shield zone |
| `shield.accessListEnums` | `bunnycdn.api.shield.accessListEnums` | `read` | List available access list configuration values |
| `shield.accessListGet` | `bunnycdn.api.shield.accessListGet` | `read` | Get a custom access list by ID |
| `shield.accessListsList` | `bunnycdn.api.shield.accessListsList` | `read` | List access lists for a shield zone |
| `shield.accessListUpdate` | `bunnycdn.api.shield.accessListUpdate` | `write` | Update a custom access list in a shield zone |
| `shield.botDetectionGet` | `bunnycdn.api.shield.botDetectionGet` | `read` | Get the bot detection configuration for a shield zone |
| `shield.botDetectionUpdate` | `bunnycdn.api.shield.botDetectionUpdate` | `write` | Update the bot detection configuration for a shield zone |
| `shield.ddosEnums` | `bunnycdn.api.shield.ddosEnums` | `read` | List available Shield DDoS configuration values |
| `shield.eventLogs` | `bunnycdn.api.shield.eventLogs` | `read` | Get shield event logs for a zone and date with continuation token |
| `shield.metricsBotDetection` | `bunnycdn.api.shield.metricsBotDetection` | `read` | Get bot detection metrics for a shield zone |
| `shield.metricsOverview` | `bunnycdn.api.shield.metricsOverview` | `read` | Get the security metrics overview for a shield zone |
| `shield.metricsOverviewDetailed` | `bunnycdn.api.shield.metricsOverviewDetailed` | `read` | Get detailed security metrics for a shield zone over a time range |
| `shield.metricsRateLimit` | `bunnycdn.api.shield.metricsRateLimit` | `read` | Get metrics for a specific shield rate limit |
| `shield.metricsRateLimits` | `bunnycdn.api.shield.metricsRateLimits` | `read` | Get aggregated rate limit metrics for a shield zone |
| `shield.metricsUploadScanning` | `bunnycdn.api.shield.metricsUploadScanning` | `read` | Get upload scanning metrics for a shield zone |
| `shield.metricsWafRule` | `bunnycdn.api.shield.metricsWafRule` | `read` | Get metrics for a specific WAF rule |
| `shield.promoState` | `bunnycdn.api.shield.promoState` | `read` | Get the shield promotional state for the account |
| `shield.rateLimitCreate` | `bunnycdn.api.shield.rateLimitCreate` | `write` | Create a shield rate limit rule |
| `shield.rateLimitDelete` | `bunnycdn.api.shield.rateLimitDelete` | `destructive` | Delete a shield rate limit rule |
| `shield.rateLimitGet` | `bunnycdn.api.shield.rateLimitGet` | `read` | Get a shield rate limit rule by ID |
| `shield.rateLimitsList` | `bunnycdn.api.shield.rateLimitsList` | `read` | List rate limit rules for a shield zone |
| `shield.rateLimitUpdate` | `bunnycdn.api.shield.rateLimitUpdate` | `write` | Update a shield rate limit rule |
| `shield.uploadScanningGet` | `bunnycdn.api.shield.uploadScanningGet` | `read` | Get the upload scanning configuration for a shield zone |
| `shield.uploadScanningUpdate` | `bunnycdn.api.shield.uploadScanningUpdate` | `write` | Update the upload scanning configuration for a shield zone |
| `shield.wafCustomRuleGet` | `bunnycdn.api.shield.wafCustomRuleGet` | `read` | Get a custom WAF rule by ID |
| `shield.wafCustomRulesList` | `bunnycdn.api.shield.wafCustomRulesList` | `read` | List custom WAF rules for a shield zone |
| `shield.wafEngineConfig` | `bunnycdn.api.shield.wafEngineConfig` | `read` | Get the Shield WAF engine configuration |
| `shield.wafEnums` | `bunnycdn.api.shield.wafEnums` | `read` | List available Shield WAF configuration values |
| `shield.wafProfiles` | `bunnycdn.api.shield.wafProfiles` | `read` | List available WAF security profiles |
| `shield.wafRulesByZone` | `bunnycdn.api.shield.wafRulesByZone` | `read` | List WAF rules for a shield zone |
| `shield.wafRulesPlanSegmentation` | `bunnycdn.api.shield.wafRulesPlanSegmentation` | `read` | List WAF rules segmented by subscription plan |
| `shield.wafRulesReviewTriggered` | `bunnycdn.api.shield.wafRulesReviewTriggered` | `read` | List triggered WAF rules awaiting review |
| `shield.wafRulesReviewTriggeredPost` | `bunnycdn.api.shield.wafRulesReviewTriggeredPost` | `write` | Apply an action to a triggered WAF rule |
| `shield.zoneGet` | `bunnycdn.api.shield.zoneGet` | `read` | Get a shield zone configuration by ID |
| `shield.zoneGetByPullZone` | `bunnycdn.api.shield.zoneGetByPullZone` | `read` | Get the shield zone configuration for a pull zone |
| `shield.zonesList` | `bunnycdn.api.shield.zonesList` | `read` | List all shield zones |
| `shield.zonesPullZoneMapping` | `bunnycdn.api.shield.zonesPullZoneMapping` | `read` | Get the mapping between shield zones and pull zones |
| `shield.zoneUpdate` | `bunnycdn.api.shield.zoneUpdate` | `write` | Update a shield zone configuration |
| `statistics.countries` | `bunnycdn.api.statistics.countries` | `read` | List countries supported by BunnyCDN |
| `statistics.get` | `bunnycdn.api.statistics.get` | `read` | Retrieve CDN bandwidth and request statistics |
| `statistics.regions` | `bunnycdn.api.statistics.regions` | `read` | List BunnyCDN regions with pricing info |
| `storageZone.checkAvailability` | `bunnycdn.api.storageZone.checkAvailability` | `read` | Check whether a storage zone name is available |
| `storageZone.create` | `bunnycdn.api.storageZone.create` | `write` | Create a new storage zone |
| `storageZone.get` | `bunnycdn.api.storageZone.get` | `read` | Get details of a specific storage zone |
| `storageZone.list` | `bunnycdn.api.storageZone.list` | `read` | List all storage zones |
| `storageZone.remove` | `bunnycdn.api.storageZone.remove` | `destructive` | Delete a storage zone and all of its data |
| `storageZone.update` | `bunnycdn.api.storageZone.update` | `write` | Update settings for a specific storage zone |
| `stream.oembed` | `bunnycdn.api.stream.oembed` | `read` | Retrieve oEmbed metadata for a video embed |
| `user.auditLog` | `bunnycdn.api.user.auditLog` | `read` | Retrieve user audit log entries for a date |
| `videoLibrary.languages` | `bunnycdn.api.videoLibrary.languages` | `read` | List languages supported by video libraries |
| `videoLibrary.list` | `bunnycdn.api.videoLibrary.list` | `read` | List all video libraries |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/bunnycdn

## License

Apache-2.0
