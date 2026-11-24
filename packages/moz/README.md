# @corsair-dev/moz

SEO data with Moz - site metrics (Domain Authority, Page Authority, Spam Score, Brand Authority, histories), backlinks, linking domains, anchor texts, top pages, ranking keywords, keyword metrics, SERPs and suggestions, competitors, global top lists, and Moz Local accounts, groups, locations, listings and insights.

## Install

```bash
pnpm add @corsair-dev/moz
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `anchorText.list` | `moz.api.anchorText.list` | `read` | Use this endpoint to get data about anchor text used to link to a specified site. Costs rows per result returned. |
| `competitors.fetch` | `moz.api.competitors.fetch` | `read` | Get the top ranking competitors for a given target site, sorted by rivalry descending. Asynchronous: answers with an async_call to poll with jobs.lookup. Draws on the mozscape rows quota. |
| `global.topDomains` | `moz.api.global.topDomains` | `read` | Get the top ranking domains globally. Free (no quota). |
| `global.topPages` | `moz.api.global.topPages` | `read` | Get the top ranking pages globally. Free (no quota). |
| `index.fetch` | `moz.api.index.fetch` | `read` | Use this endpoint to track when the index is updated with new data. Free (no quota). |
| `jobs.lookup` | `moz.api.jobs.lookup` | `read` | Fetch an `async_call` by ID to retrieve the result or error. Free (no quota). |
| `keywords.difficulty` | `moz.api.keywords.difficulty` | `read` | Retrieve the most recent difficulty metric for any keyword that exists in our database. Costs 1 row per call. |
| `keywords.generateMetrics` | `moz.api.keywords.generateMetrics` | `destructive` | Trigger on-demand collection of a SERP and return the refreshed metrics once collection is complete. Asynchronous: answers with an async_call to poll with jobs.lookup. Quota cost varies by request. Runs a fresh on-demand SERP collection, billed per call. |
| `keywords.generateSerp` | `moz.api.keywords.generateSerp` | `destructive` | Trigger on-demand collection of a SERP, returning it upon completion. Asynchronous: answers with an async_call to poll with jobs.lookup. Quota cost varies by request. Runs a fresh on-demand SERP collection, billed per call. |
| `keywords.intent` | `moz.api.keywords.intent` | `read` | Retrieve the most recent search intent scores (navigational, informational, commercial, and transactional) for any keyword that exists in our database. Costs 1 row per call. |
| `keywords.metrics` | `moz.api.keywords.metrics` | `read` | Retrieve the most recent difficulty, volume, organic CTR, priority, and/or search intent metrics for any keyword that exists in our database. Costs rows per value requested. |
| `keywords.metricsMultiple` | `moz.api.keywords.metricsMultiple` | `read` | Retrieve difficulty, volume, organic CTR, priority, and search intent metrics for up to 50 keywords in a single request. Costs rows per result returned. |
| `keywords.opportunity` | `moz.api.keywords.opportunity` | `read` | Retrieve the most recent organic CTR (opportunity) metric for any keyword that exists in our database. Costs 1 row per call. |
| `keywords.priority` | `moz.api.keywords.priority` | `read` | Retrieve the most recent priority metric for any keyword that exists in our database. Costs 1 row per call. |
| `keywords.serp` | `moz.api.keywords.serp` | `read` | Retrieve the most recently collected SERP for a given query. Quota cost varies by request. |
| `keywords.suggestions` | `moz.api.keywords.suggestions` | `read` | Retrieve a list of related keyword suggestions for a given input keyword. Asynchronous: answers with an async_call to poll with jobs.lookup. Costs rows per result returned. |
| `keywords.volume` | `moz.api.keywords.volume` | `read` | Retrieve the most recent volume metric for any keyword that exists in our database. Costs 1 row per call. |
| `linkingDomains.list` | `moz.api.linkingDomains.list` | `read` | Use this endpoint to get a list of linking root domains to a target, with information about each root domain and the aggregate number of links to the target. Costs rows per result returned. |
| `linkingDomains.recentlyGained` | `moz.api.linkingDomains.recentlyGained` | `read` | This endpoint will return information about external root domains that added new links to a target during the past 60 days. Costs rows per result returned. |
| `linkingDomains.recentlyLost` | `moz.api.linkingDomains.recentlyLost` | `read` | This endpoint will return information about root domains that removed links to a target during the past 60 days. Costs rows per result returned. |
| `links.filterByAnchorText` | `moz.api.links.filterByAnchorText` | `read` | Use this endpoint to get a list of links to a target where the anchor text exactly matches a particular string. Costs rows per result returned. |
| `links.filterByDomain` | `moz.api.links.filterByDomain` | `read` | Use this endpoint to find links pointing to a target only if they originate from a particular root domain. Costs rows per result returned. |
| `links.intersect` | `moz.api.links.intersect` | `read` | This endpoint returns information about sites that point to two or more specified domains, or that point at some domains but not others. Quota cost varies by request. |
| `links.list` | `moz.api.links.list` | `read` | Use this endpoint to get a list of links to a target. Costs rows per result returned. |
| `links.status` | `moz.api.links.status` | `read` | Use this endpoint to get the status of a link from a source to a target. Costs 1 row per call. |
| `links.statusMultiple` | `moz.api.links.statusMultiple` | `read` | Use this endpoint to get the status of multiple links from a source to a target. Costs rows per result returned. |
| `local.accounts.create` | `moz.api.local.accounts.create` | `write` | Creates a new Moz Local Account. Moz Local Enterprise only. Free (no quota). |
| `local.accounts.list` | `moz.api.local.accounts.list` | `read` | List all Moz Local Accounts. Moz Local Enterprise only. Free (no quota). |
| `local.accounts.lookup` | `moz.api.local.accounts.lookup` | `read` | Lookup a specific Moz Local Account by ID. Moz Local Enterprise only. Free (no quota). |
| `local.customFields.create` | `moz.api.local.customFields.create` | `write` | Creates a location custom field definition on a Moz Local Account. Moz Local Enterprise only. Free (no quota). |
| `local.customFields.listForAccount` | `moz.api.local.customFields.listForAccount` | `read` | List all location custom fields for a given Moz Local Account ID. Moz Local Enterprise only. Free (no quota). |
| `local.customFields.lookup` | `moz.api.local.customFields.lookup` | `read` | Lookup a specific custom field by ID for a Moz Local Account. Moz Local Enterprise only. Free (no quota). |
| `local.groups.addLocation` | `moz.api.local.groups.addLocation` | `write` | Add a location to a group. Moz Local Enterprise only. Free (no quota). |
| `local.groups.create` | `moz.api.local.groups.create` | `write` | Creates a new group in a Moz Local Account to organize locations. Moz Local Enterprise only. Free (no quota). |
| `local.groups.list` | `moz.api.local.groups.list` | `read` | List all local groups. Moz Local Enterprise only. Free (no quota). |
| `local.groups.listForAccount` | `moz.api.local.groups.listForAccount` | `read` | List all groups for a given Moz Local Account ID. Moz Local Enterprise only. Free (no quota). |
| `local.groups.listLocations` | `moz.api.local.groups.listLocations` | `read` | List locations in a given group. Moz Local Enterprise only. Free (no quota). |
| `local.groups.lookup` | `moz.api.local.groups.lookup` | `read` | Lookup a specific group by ID. Moz Local Enterprise only. Free (no quota). |
| `local.groups.removeLocation` | `moz.api.local.groups.removeLocation` | `write` | Remove a location from a group. Moz Local Enterprise only. Free (no quota). |
| `local.locations.cancel` | `moz.api.local.locations.cancel` | `destructive` | Cancel a specific location by ID. Moz Local Enterprise only. Free (no quota). Stops the paid listing service for the location. |
| `local.locations.categories` | `moz.api.local.locations.categories` | `read` | Retrieve a list of Google category IDs that can be used for `primary_category` or `additional_categories` when creating or updating a location. Moz Local Enterprise only. Free (no quota). |
| `local.locations.close` | `moz.api.local.locations.close` | `destructive` | Closes a location, setting its status to closed and opening status to permanently closed. Moz Local Enterprise only. Free (no quota). Marks the business permanently closed on every directory. |
| `local.locations.create` | `moz.api.local.locations.create` | `destructive` | Creates a new location. Moz Local Enterprise only. Free (no quota). Adds a billed Moz Local location. |
| `local.locations.fieldIssues` | `moz.api.local.locations.fieldIssues` | `read` | Returns field-level discrepancy issues for a given location. Moz Local Enterprise only. Free (no quota). |
| `local.locations.fieldStatuses` | `moz.api.local.locations.fieldStatuses` | `read` | Returns field-level listing health data for a given location. Moz Local Enterprise only. Free (no quota). |
| `local.locations.gbpImpressionHistory` | `moz.api.local.locations.gbpImpressionHistory` | `read` | Returns Google Business Profile keyword-impression history over time (month by month) for a location's top-performing keywords. Moz Local Enterprise only. Free (no quota). |
| `local.locations.gbpImpressionTotals` | `moz.api.local.locations.gbpImpressionTotals` | `read` | Returns total Google Business Profile keyword impressions for a given location and date range, ordered from most to least impressions. Moz Local Enterprise only. Free (no quota). |
| `local.locations.gbpLeadHistory` | `moz.api.local.locations.gbpLeadHistory` | `read` | Returns Google Business Profile lead history over time for a given location, bucketed by day, week, or month. Moz Local Enterprise only. Free (no quota). |
| `local.locations.levels` | `moz.api.local.locations.levels` | `read` | List the available levels of service for locations. Moz Local Enterprise only. Free (no quota). |
| `local.locations.list` | `moz.api.local.locations.list` | `read` | List all locations. Free (no quota). |
| `local.locations.listByStatus` | `moz.api.local.locations.listByStatus` | `read` | List locations filtered by status. Free (no quota). |
| `local.locations.listForAccount` | `moz.api.local.locations.listForAccount` | `read` | List all active locations filtered by Moz Local Account ID. Free (no quota). |
| `local.locations.listings` | `moz.api.local.locations.listings` | `read` | Returns a list of listings for a given location. Moz Local Enterprise only. Free (no quota). |
| `local.locations.localGridHistory` | `moz.api.local.locations.localGridHistory` | `read` | Returns all Local Grid results over time for a given keyword, device, engine, and location, including every dot of each grid. Moz Local Enterprise only. Free (no quota). |
| `local.locations.localGridKeywords` | `moz.api.local.locations.localGridKeywords` | `read` | Returns the keywords available to generate a Local Grid report on for a given location. Moz Local Enterprise only. Free (no quota). |
| `local.locations.lookup` | `moz.api.local.locations.lookup` | `read` | Lookup a specific location by ID. Free (no quota). |
| `local.locations.networks` | `moz.api.local.locations.networks` | `read` | Returns a list of networks for a given location. Moz Local Enterprise only. Free (no quota). |
| `local.locations.networkStatuses` | `moz.api.local.locations.networkStatuses` | `read` | Returns a list of statuses per network for a given location. Moz Local Enterprise only. Free (no quota). |
| `local.locations.rankingHistory` | `moz.api.local.locations.rankingHistory` | `read` | Returns keyword ranking position over time for a location's tracked keywords. Moz Local Enterprise only. Free (no quota). |
| `local.locations.update` | `moz.api.local.locations.update` | `write` | Update a single location. Moz Local Enterprise only. Free (no quota). Moz Local publishes the change to the business listings on every directory. |
| `local.locations.updateLevel` | `moz.api.local.locations.updateLevel` | `destructive` | Updates the tier of service for a single location. Moz Local Enterprise only. Free (no quota). Changes the billed service level. |
| `locales.list` | `moz.api.locales.list` | `read` | Use this endpoint to list every locale a search engine supports. Free (no quota). |
| `metrics.brandAuthority` | `moz.api.metrics.brandAuthority` | `read` | This endpoint returns a Brand Authority™ score for the provided site. Costs 1 row per call. |
| `metrics.distributions` | `moz.api.metrics.distributions` | `read` | Fetch Site Metrics Distributions. Costs 1 row per call. |
| `metrics.fetch` | `moz.api.metrics.fetch` | `read` | Use this endpoint to get metrics such as Domain Authority, Page Authority, Spam Score, link counts and more for one URL. Costs 1 row per call. |
| `metrics.fetchMultiple` | `moz.api.metrics.fetchMultiple` | `read` | Use this endpoint to get metrics such as Domain Authority, Page Authority, Spam Score, link counts and more about one or more URLs. Costs rows per result returned. |
| `metrics.histories` | `moz.api.metrics.histories` | `read` | Use this endpoint to get daily or monthly metric histories for a single site. Costs rows per value requested. |
| `quota.lookup` | `moz.api.quota.lookup` | `read` | Check how much quota is used/available for the current billing period, as well as additional information about the quota such as whether or not overages are enabled. Free (no quota). |
| `rankingKeywords.count` | `moz.api.rankingKeywords.count` | `read` | Retrieve a summary of the number of keywords for which the provided query (domain, subdomain, or page) ranks in the top 50. Costs 1 row per call. |
| `rankingKeywords.list` | `moz.api.rankingKeywords.list` | `read` | Retrieve a list of keywords for which the provided site (domain, subdomain, subfolder, or page) ranks in the top 50, along with the ranking position and the difficulty and monthly search volume for each keyword. Costs rows per result returned. |
| `redirects.fetch` | `moz.api.redirects.fetch` | `read` | Use this endpoint to see the final redirect target of a page after following known redirects in the index. Costs 1 row per call. |
| `test.ping` | `moz.api.test.ping` | `read` | Use this endpoint to verify that your integration with the Moz JSON-RPC API works end to end, without spending any quota. Free (no quota). |
| `test.pingAsync` | `moz.api.test.pingAsync` | `read` | Use this endpoint to verify that your integration correctly handles the asynchronous methods in the Moz JSON-RPC API, without spending any quota. Asynchronous: answers with an async_call to poll with jobs.lookup. Free (no quota). |
| `topPages.list` | `moz.api.topPages.list` | `read` | Use this endpoint to return a list of the top pages on a target domain, sorted by descending page authority, linking root domains, or external linking pages. Costs rows per result returned. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 4 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/moz

## License

Apache-2.0
