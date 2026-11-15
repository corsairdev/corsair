# @corsair-dev/gosquared

GoSquared plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/gosquared
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.createSite` | `gosquared.api.account.createSite` | `write` | Create and provision a new site for tracking in GoSquared |
| `account.getBlocked` | `gosquared.api.account.getBlocked` | `read` | Retrieve blocked IP addresses and bot settings for a site |
| `account.getSharedUsers` | `gosquared.api.account.getSharedUsers` | `read` | Retrieve team members with access to a GoSquared project |
| `account.getSite` | `gosquared.api.account.getSite` | `read` | Retrieve configuration and details for a specific site |
| `account.getSites` | `gosquared.api.account.getSites` | `read` | Retrieve all sites accessible by the GoSquared account |
| `auth.getTokenInfo` | `gosquared.api.auth.getTokenInfo` | `read` | Validate API key and retrieve associated scopes and token info |
| `chat.archiveChat` | `gosquared.api.chat.archiveChat` | `write` | Archive an active chat conversation |
| `chat.getChat` | `gosquared.api.chat.getChat` | `read` | Retrieve a specific live chat conversation by ID |
| `chat.getChatFeed` | `gosquared.api.chat.getChatFeed` | `read` | Retrieve message history and event feed for a chat |
| `chat.getChats` | `gosquared.api.chat.getChats` | `read` | Retrieve active conversation threads in GoSquared Live Chat |
| `chat.sendMessage` | `gosquared.api.chat.sendMessage` | `destructive` | Send a message in a chat conversation |
| `chat.unarchiveChat` | `gosquared.api.chat.unarchiveChat` | `write` | Unarchive a previously archived chat conversation |
| `now.getBrowsers` | `gosquared.api.now.getBrowsers` | `read` | Retrieve browsers currently in use by active visitors |
| `now.getCampaigns` | `gosquared.api.now.getCampaigns` | `read` | Retrieve active marketing campaigns driving current traffic |
| `now.getConcurrents` | `gosquared.api.now.getConcurrents` | `read` | Retrieve current count of concurrent visitors online |
| `now.getCountries` | `gosquared.api.now.getCountries` | `read` | Retrieve countries of origin for active online visitors |
| `now.getGeo` | `gosquared.api.now.getGeo` | `read` | Retrieve real-time visitor geographic coordinate clusters |
| `now.getOverview` | `gosquared.api.now.getOverview` | `read` | Retrieve real-time summary of concurrent visitors and traffic |
| `now.getPages` | `gosquared.api.now.getPages` | `read` | Retrieve top active pages viewed right now |
| `now.getPlatforms` | `gosquared.api.now.getPlatforms` | `read` | Retrieve operating platforms used by active online visitors |
| `now.getSources` | `gosquared.api.now.getSources` | `read` | Retrieve current traffic sources referring active visitors |
| `now.getTimeSeries` | `gosquared.api.now.getTimeSeries` | `read` | Retrieve recent time series of concurrent visitor activity |
| `now.getVisitors` | `gosquared.api.now.getVisitors` | `read` | Retrieve detailed list of active concurrent visitors |
| `people.getDevice` | `gosquared.api.people.getDevice` | `read` | Retrieve technical specifications for a single device |
| `people.getDevices` | `gosquared.api.people.getDevices` | `read` | Retrieve paginated list of all tracked user devices |
| `people.getEventTypes` | `gosquared.api.people.getEventTypes` | `read` | Retrieve custom event type definitions in People CRM |
| `people.getPeople` | `gosquared.api.people.getPeople` | `read` | Search and query customer profiles in People CRM |
| `people.getPerson` | `gosquared.api.people.getPerson` | `read` | Retrieve a specific person profile by ID or email |
| `people.getPersonDevices` | `gosquared.api.people.getPersonDevices` | `read` | Retrieve devices associated with a person in People CRM |
| `people.getPersonFeed` | `gosquared.api.people.getPersonFeed` | `read` | Retrieve chronological interaction feed for a person |
| `people.getPropertyTypes` | `gosquared.api.people.getPropertyTypes` | `read` | Retrieve user property type definitions in People CRM |
| `people.getSmartGroups` | `gosquared.api.people.getSmartGroups` | `read` | Retrieve saved smart groups and segment criteria |
| `tracking.identify` | `gosquared.api.tracking.identify` | `write` | Identify or update user profile traits in People CRM |
| `tracking.trackEvent` | `gosquared.api.tracking.trackEvent` | `write` | Track a custom user event with optional event data |
| `tracking.trackPageview` | `gosquared.api.tracking.trackPageview` | `write` | Track a pageview with URL and page title |
| `tracking.trackTransaction` | `gosquared.api.tracking.trackTransaction` | `write` | Track an e-commerce purchase transaction with line items |
| `trends.getAggregate` | `gosquared.api.trends.getAggregate` | `read` | Retrieve aggregate historical trends and total metrics |
| `trends.getBrowser` | `gosquared.api.trends.getBrowser` | `read` | Retrieve historical traffic breakdown by browser |
| `trends.getCountry` | `gosquared.api.trends.getCountry` | `read` | Retrieve historical traffic breakdown by country |
| `trends.getEvent` | `gosquared.api.trends.getEvent` | `read` | Retrieve historical custom event tracking metrics |
| `trends.getLanguage` | `gosquared.api.trends.getLanguage` | `read` | Retrieve historical traffic breakdown by visitor language |
| `trends.getOrganisation` | `gosquared.api.trends.getOrganisation` | `read` | Retrieve historical traffic by visiting organization/ISP |
| `trends.getOs` | `gosquared.api.trends.getOs` | `read` | Retrieve historical traffic breakdown by operating system |
| `trends.getPage` | `gosquared.api.trends.getPage` | `read` | Retrieve historical pageview and URL performance metrics |
| `trends.getPath1` | `gosquared.api.trends.getPath1` | `read` | Retrieve historical top-level URL path segment metrics |
| `trends.getScreenDimensions` | `gosquared.api.trends.getScreenDimensions` | `read` | Retrieve historical screen resolution metrics |
| `trends.getSources` | `gosquared.api.trends.getSources` | `read` | Retrieve historical traffic sources and referral channels |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/gosquared

## License

Apache-2.0
