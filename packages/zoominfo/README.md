# @corsair-dev/zoominfo

ZoomInfo plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/zoominfo
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `zoominfo.enrichCompany` | `zoominfo.api.zoominfo.enrichCompany` | `read` | Enrich up to 25 companies from partial identifiers |
| `zoominfo.enrichContact` | `zoominfo.api.zoominfo.enrichContact` | `read` | Enrich up to 25 contacts from partial identifiers |
| `zoominfo.enrichIntent` | `zoominfo.api.zoominfo.enrichIntent` | `read` | Fetch intent signals for one company |
| `zoominfo.enrichLocation` | `zoominfo.api.zoominfo.enrichLocation` | `read` | Fetch every known office location for one company |
| `zoominfo.enrichNews` | `zoominfo.api.zoominfo.enrichNews` | `read` | Fetch news articles for one company |
| `zoominfo.enrichScoop` | `zoominfo.api.zoominfo.enrichScoop` | `read` | Fetch Scoops for one company |
| `zoominfo.enrichTechnology` | `zoominfo.api.zoominfo.enrichTechnology` | `read` | Fetch the technologies detected in one company's stack |
| `zoominfo.getCompanySearchInputFields` | `zoominfo.api.zoominfo.getCompanySearchInputFields` | `read` | List the company search filters this account may use |
| `zoominfo.getContactSearchInputFields` | `zoominfo.api.zoominfo.getContactSearchInputFields` | `read` | List the contact search filters this account may use |
| `zoominfo.getIntentSearchInputFields` | `zoominfo.api.zoominfo.getIntentSearchInputFields` | `read` | List the intent search filters this account may use |
| `zoominfo.getNewsSearchInputFields` | `zoominfo.api.zoominfo.getNewsSearchInputFields` | `read` | List the news search filters this account may use |
| `zoominfo.getScoopSearchInputFields` | `zoominfo.api.zoominfo.getScoopSearchInputFields` | `read` | List the scoop search filters this account may use |
| `zoominfo.searchCompanies` | `zoominfo.api.zoominfo.searchCompanies` | `read` | Search companies by firmographics, location and technology |
| `zoominfo.searchContacts` | `zoominfo.api.zoominfo.searchContacts` | `read` | Search contacts by name, title, seniority and company |
| `zoominfo.searchIntent` | `zoominfo.api.zoominfo.searchIntent` | `read` | Search companies showing buying intent on given topics |
| `zoominfo.searchNews` | `zoominfo.api.zoominfo.searchNews` | `read` | Search news articles by category and publish date |
| `zoominfo.searchScoops` | `zoominfo.api.zoominfo.searchScoops` | `read` | Search Scoops, ZoomInfo research notes about companies |

## Auth

Auth: OAuth 2.0. Corsair prompts your tenant for credentials on first use.

## Webhooks

Handles 2 webhook events. See the reference for payloads and `webhookHooks`.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/zoominfo

## License

Apache-2.0
