# @corsair-dev/openseo

OpenSEO plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/openseo
```

## How it is built

OpenSEO's API is its hosted MCP server (`https://app.openseo.so/mcp`). Each of
the 85 operations is one MCP tool, called as a JSON-RPC `tools/call` with an
`oseo_` API key (OpenSEO > Settings > API keys) as a bearer token. The server
is stateless for API keys, so there is no session handshake.

- `openseo-manifest.json` is the server's `tools/list` (fetched 2026-11-19):
  each tool's Corsair name, MCP name, and its input and output JSON Schemas.
- `endpoints/operation-types.ts` and `endpoints/catalog.ts` are generated from
  the same list: input and output types, the endpoint tree, risk levels and
  descriptions.
- Zod schemas are built from the manifest on first use, one operation at a
  time (`endpoints/json-schema.ts`), so loading the plugin stays cheap.

Inputs follow the tool input schemas (required fields, enums, limits). Results
are the tool's `structuredContent`; every field may be missing or `null`, and
unknown fields pass through. A tool error (`isError`) throws `OpenseoAPIError`
with OpenSEO's text, such as `NOT_FOUND` or `INSUFFICIENT_CREDITS`.

Research lookups spend OpenSEO credits and stay `read` risk. Deletes, public
report sharing, IndexNow submissions and anything that starts or schedules a
paid check (`rankTracking.run`, `aiVisibility.runCheck`,
`aiVisibility.setSchedule`, `aiVisibility.completeResearchSetup`) are
`destructive`.

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.whoami` | `openseo.api.account.whoami` | `read` | Get the connected OpenSEO account, token scopes and remaining credits |
| `aiVisibility.completeResearchSetup` | `openseo.api.aiVisibility.completeResearchSetup` | `destructive` | Set up Prompt Research keywords for a project (can turn on weekly paid AI checks) |
| `aiVisibility.estimateCost` | `openseo.api.aiVisibility.estimateCost` | `read` | Estimate the cost of AI visibility checks without running them |
| `aiVisibility.explorePrompt` | `openseo.api.aiVisibility.explorePrompt` | `read` | Ask a prompt in ChatGPT, Claude, Gemini or Perplexity and see answers, citations and brand mentions |
| `aiVisibility.export` | `openseo.api.aiVisibility.export` | `read` | Export stored AI visibility observations as a CSV or JSON download link |
| `aiVisibility.generatePrompts` | `openseo.api.aiVisibility.generatePrompts` | `read` | Generate topic and prompt suggestions for AI visibility tracking |
| `aiVisibility.getAnswer` | `openseo.api.aiVisibility.getAnswer` | `read` | Get one stored AI answer with its prompt, mentions and citations |
| `aiVisibility.getResults` | `openseo.api.aiVisibility.getResults` | `read` | Get how often the brand and competitors appear in AI answers for a run |
| `aiVisibility.getRun` | `openseo.api.aiVisibility.getRun` | `read` | Get the progress of an AI visibility check |
| `aiVisibility.getSources` | `openseo.api.aiVisibility.getSources` | `read` | List the pages or domains AI answers cited in a run |
| `aiVisibility.getTracker` | `openseo.api.aiVisibility.getTracker` | `read` | Get a project's AI visibility tracking setup: topics, prompts, engines and schedule |
| `aiVisibility.getTrend` | `openseo.api.aiVisibility.getTrend` | `read` | Compare recent AI visibility with the previous period |
| `aiVisibility.researchPrompts` | `openseo.api.aiVisibility.researchPrompts` | `read` | Find questions people ask AI about a keyword, with ChatGPT's answers and sources |
| `aiVisibility.runCheck` | `openseo.api.aiVisibility.runCheck` | `destructive` | Start a one-off paid AI visibility check now |
| `aiVisibility.saveTracker` | `openseo.api.aiVisibility.saveTracker` | `write` | Create or update AI visibility tracking prompts, topics, engines and market |
| `aiVisibility.setSchedule` | `openseo.api.aiVisibility.setSchedule` | `destructive` | Turn scheduled AI visibility checks on, change the cadence or pause them |
| `aiVisibility.updateResearchKeywords` | `openseo.api.aiVisibility.updateResearchKeywords` | `write` | Add or remove a project's saved Prompt Research keywords |
| `backlinks.list` | `openseo.api.backlinks.list` | `read` | List a domain's or page's individual backlinks with anchors and authority, paginated |
| `backlinks.overview` | `openseo.api.backlinks.overview` | `read` | Summarize a domain's or page's backlinks, referring domains and authority |
| `domains.keywords` | `openseo.api.domains.keywords` | `read` | List the organic keywords a domain ranks for, with position and metrics |
| `domains.overview` | `openseo.api.domains.overview` | `read` | Estimate a domain's monthly organic traffic and ranking keyword count |
| `domains.rankedKeywords` | `openseo.api.domains.rankedKeywords` | `read` | List the keywords a domain or page ranks for in one country, with ranking URL and traffic |
| `googleAnalytics.audienceBreakdown` | `openseo.api.googleAnalytics.audienceBreakdown` | `read` | Break down visitors by device, country or new versus returning |
| `googleAnalytics.ecommercePerformance` | `openseo.api.googleAnalytics.ecommercePerformance` | `read` | Get GA4 ecommerce item views, add-to-carts, purchases and revenue |
| `googleAnalytics.keyEvents` | `openseo.api.googleAnalytics.keyEvents` | `read` | Get GA4 key events (conversions) by event or organic landing page |
| `googleAnalytics.listProperties` | `openseo.api.googleAnalytics.listProperties` | `read` | List the GA4 properties of the connected Google accounts |
| `googleAnalytics.measurementHealth` | `openseo.api.googleAnalytics.measurementHealth` | `read` | Check how Google Analytics is set up on the connected property |
| `googleAnalytics.organicLandingPages` | `openseo.api.googleAnalytics.organicLandingPages` | `read` | Get the landing pages that receive organic search traffic |
| `googleAnalytics.organicOverview` | `openseo.api.googleAnalytics.organicOverview` | `read` | Get top-line organic search sessions, users and key events with a trend |
| `googleAnalytics.pagePerformance` | `openseo.api.googleAnalytics.pagePerformance` | `read` | Get page views, users, engagement and key events per page |
| `googleAnalytics.setProperty` | `openseo.api.googleAnalytics.setProperty` | `write` | Set which GA4 property a project reads |
| `googleAnalytics.siteSearch` | `openseo.api.googleAnalytics.siteSearch` | `read` | Get the terms visitors search for on the site |
| `googleAnalytics.trafficAcquisition` | `openseo.api.googleAnalytics.trafficAcquisition` | `read` | Compare traffic by channel group, source/medium or campaign |
| `indexNow.submitUrls` | `openseo.api.indexNow.submitUrls` | `destructive` | Notify IndexNow search engines (Bing, Yandex and others) that pages changed |
| `keywords.listSaved` | `openseo.api.keywords.listSaved` | `read` | List a project's saved keywords with cached volume, difficulty, CPC and tags |
| `keywords.metrics` | `openseo.api.keywords.metrics` | `read` | Get search volume, difficulty, intent, CPC and trends for a list of keywords |
| `keywords.removeSaved` | `openseo.api.keywords.removeSaved` | `destructive` | Delete saved keywords from a project by ID |
| `keywords.research` | `openseo.api.keywords.research` | `read` | Find keyword ideas for 1-5 seed keywords with volume, difficulty, CPC and intent |
| `keywords.save` | `openseo.api.keywords.save` | `write` | Save keywords to a project, optionally with metrics and tags |
| `keywords.suggestions` | `openseo.api.keywords.suggestions` | `read` | Suggest up to 10 seed keywords to research next from Search Console and saved keywords |
| `local.businessProfile` | `openseo.api.local.businessProfile` | `read` | Get a Google Business Profile by name, CID or place ID |
| `local.businessQuestions` | `openseo.api.local.businessQuestions` | `read` | Get the questions and answers on a Google Business Profile |
| `local.businessReviews` | `openseo.api.local.businessReviews` | `read` | Get a business's Google reviews with ratings and owner replies |
| `local.businessUpdates` | `openseo.api.local.businessUpdates` | `read` | Get the posts published on a Google Business Profile |
| `local.listCategories` | `openseo.api.local.listCategories` | `read` | List Google Business categories ranked by how many businesses use them |
| `local.rankGrid` | `openseo.api.local.rankGrid` | `read` | Map a business's Google Maps rank across a grid of points around a center |
| `local.searchBusinesses` | `openseo.api.local.searchBusinesses` | `read` | Search local business listings near a coordinate |
| `local.serpResults` | `openseo.api.local.serpResults` | `read` | Get Google Maps or Local Finder results for a keyword from a coordinate |
| `projects.create` | `openseo.api.projects.create` | `write` | Create a project with a name and optional domain and market |
| `projects.getContext` | `openseo.api.projects.getContext` | `read` | Get a project's shared memory: overview, goal, positioning, competitors and key pages |
| `projects.list` | `openseo.api.projects.list` | `read` | List projects with their ID, name, domain and default market |
| `projects.researchWebsite` | `openseo.api.projects.researchWebsite` | `read` | Research a project's website to draft its brand, overview, competitors and prompt topics |
| `projects.saveWebsiteSetup` | `openseo.api.projects.saveWebsiteSetup` | `write` | Save a drafted website setup (brand, overview, competitors, topics) to a project |
| `projects.updateContext` | `openseo.api.projects.updateContext` | `write` | Add, edit or delete entries in a project's shared memory |
| `rankTracking.addKeywords` | `openseo.api.rankTracking.addKeywords` | `write` | Add keywords to a rank tracker |
| `rankTracking.create` | `openseo.api.rankTracking.create` | `write` | Create a rank tracker for a project |
| `rankTracking.estimateCost` | `openseo.api.rankTracking.estimateCost` | `read` | Estimate what a rank check costs without running it |
| `rankTracking.get` | `openseo.api.rankTracking.get` | `read` | List a project's rank trackers or get one with its latest Google positions |
| `rankTracking.history` | `openseo.api.rankTracking.history` | `read` | Get the position history of a rank tracker's keywords |
| `rankTracking.pinKeywords` | `openseo.api.rankTracking.pinKeywords` | `write` | Pin or unpin tracked keywords |
| `rankTracking.removeKeywords` | `openseo.api.rankTracking.removeKeywords` | `destructive` | Stop tracking keywords in a rank tracker |
| `rankTracking.run` | `openseo.api.rankTracking.run` | `destructive` | Start a paid rank check now for every keyword in a tracker |
| `reports.delete` | `openseo.api.reports.delete` | `destructive` | Delete a saved report and its shared link |
| `reports.deleteTemplate` | `openseo.api.reports.deleteTemplate` | `destructive` | Delete a report template |
| `reports.get` | `openseo.api.reports.get` | `read` | Get a saved report with its summary and share link |
| `reports.list` | `openseo.api.reports.list` | `read` | List a project's saved reports |
| `reports.listTemplates` | `openseo.api.reports.listTemplates` | `read` | List a project's report templates |
| `reports.save` | `openseo.api.reports.save` | `write` | Save an HTML report to a project |
| `reports.saveTemplate` | `openseo.api.reports.saveTemplate` | `write` | Save a reusable report template to a project |
| `reports.setSharing` | `openseo.api.reports.setSharing` | `destructive` | Turn public sharing of a saved report on or off |
| `searchConsole.inspectUrls` | `openseo.api.searchConsole.inspectUrls` | `read` | Check whether Google has indexed up to 10 pages, and why not |
| `searchConsole.listSites` | `openseo.api.searchConsole.listSites` | `read` | List the Search Console properties of the connected Google accounts |
| `searchConsole.opportunities` | `openseo.api.searchConsole.opportunities` | `read` | Find pages ranking 4-20 in Search Console that are most worth improving |
| `searchConsole.performance` | `openseo.api.searchConsole.performance` | `read` | Get Search Console clicks, impressions, CTR and position by query, page or other dimension |
| `searchConsole.setSite` | `openseo.api.searchConsole.setSite` | `write` | Set which Search Console property a project reads |
| `serp.competitors` | `openseo.api.serp.competitors` | `read` | Find the domains that compete in Google results for a set of keywords |
| `serp.results` | `openseo.api.serp.results` | `read` | Get live Google organic results for 1-10 keywords |
| `serp.searchLocations` | `openseo.api.serp.searchLocations` | `read` | Find the exact location name of a city or region for local searches |
| `siteAudits.delete` | `openseo.api.siteAudits.delete` | `destructive` | Delete a site audit with its pages, issues and Lighthouse results |
| `siteAudits.issues` | `openseo.api.siteAudits.issues` | `read` | Get the prioritized issues from a completed site audit |
| `siteAudits.lighthouse` | `openseo.api.siteAudits.lighthouse` | `read` | Get the Lighthouse results from a site audit |
| `siteAudits.list` | `openseo.api.siteAudits.list` | `read` | List a project's site audits with status and page counts |
| `siteAudits.pages` | `openseo.api.siteAudits.pages` | `read` | List the pages a site audit crawled with per-page SEO data |
| `siteAudits.run` | `openseo.api.siteAudits.run` | `write` | Start a background site audit (crawl, SEO checks, optional Lighthouse) |
| `siteAudits.status` | `openseo.api.siteAudits.status` | `read` | Get the progress of a site audit |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/openseo

## License

Apache-2.0
