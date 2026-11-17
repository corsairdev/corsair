# @corsair-dev/similarweb

Digital rank data from Similarweb: global, country, industry and app-store ranks for any domain or app, the top-ranked sites, and the account capabilities and remaining credits.

## Install

```bash
pnpm add @corsair-dev/similarweb
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `apps.describe` | `similarweb.api.apps.describe` | `read` | Read the countries, stores, modes and devices the app rank operation accepts, which is the only way to know a valid mode |
| `apps.rank` | `similarweb.api.apps.rank` | `read` | Read an app's store rank day by day for one country and chart, from the App Store or Google Play |
| `capabilities.get` | `similarweb.api.capabilities.get` | `read` | Read what the subscription entitles this account to, keyed by capability name |
| `categories.list` | `similarweb.api.categories.list` | `read` | Read the website category tree, with each child mapping to the Parent~Child slug the rank routes accept |
| `usage.get` | `similarweb.api.usage.get` | `read` | Read the data credit allowance and how many this user has left; costs no credits |
| `websites.countryRank` | `similarweb.api.websites.countryRank` | `read` | Read a domain's rank within one country month by month, for a country code the subscription includes |
| `websites.globalRank` | `similarweb.api.websites.globalRank` | `read` | Read a domain's global rank month by month, based on estimated unique visitors and page views across desktop and mobile |
| `websites.industryRank` | `similarweb.api.websites.industryRank` | `read` | Read a domain's industry and its rank within that industry worldwide, as the current reading rather than a series |
| `websites.topSites` | `similarweb.api.websites.topSites` | `read` | Read the highest-ranked domains worldwide across desktop and mobile, up to 5000 of them |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/similarweb

## License

Apache-2.0
