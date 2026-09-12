# @corsair-dev/benzinga

Benzinga plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/benzinga
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `calendar.listDividends` | `benzinga.api.calendar.listDividends` | `read` | List dividends calendar data (GET /api/v2.2/calendar/dividends, page/pagesize pagination) |
| `calendar.listEarnings` | `benzinga.api.calendar.listEarnings` | `read` | List earnings calendar data (GET /api/v2.1/calendar/earnings, page/pagesize pagination) |
| `calendar.listEconomics` | `benzinga.api.calendar.listEconomics` | `read` | List economic calendar data (GET /api/v2.1/calendar/economics, page/pagesize pagination) |
| `calendar.listGuidance` | `benzinga.api.calendar.listGuidance` | `read` | List company guidance data (GET /api/v2.1/calendar/guidance, page/pagesize pagination) |
| `calendar.listIpos` | `benzinga.api.calendar.listIpos` | `read` | List IPO calendar data (GET /api/v2.1/calendar/ipos, page/pagesize pagination) |
| `calendar.listRatings` | `benzinga.api.calendar.listRatings` | `read` | List analyst ratings data (GET /api/v2.1/calendar/ratings, page/pagesize pagination) |
| `calendar.listSplits` | `benzinga.api.calendar.listSplits` | `read` | List stock split data (GET /api/v2.1/calendar/splits, page/pagesize pagination) |
| `news.get` | `benzinga.api.news.get` | `read` | Get Benzinga news articles (GET /api/v2/news, page/pageSize pagination) |
| `news.listChannels` | `benzinga.api.news.listChannels` | `read` | List available Benzinga news channels (GET /api/v2.1/news/channels) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/benzinga

## License

Apache-2.0
