# @corsair-dev/benzinga

Benzinga plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/benzinga
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `calendar.getConsensusRatings` | `benzinga.api.calendar.getConsensusRatings` | `read` | Get aggregated analyst consensus rating and price targets for one ticker (GET /api/v1/consensus-ratings) |
| `calendar.getEarningsStream` | `benzinga.api.calendar.getEarningsStream` | `read` | Get the WebSocket URL for the real-time earnings calendar stream (wss://api.benzinga.com/api/v2.1/calendar/earnings/stream); append token=<api key> to connect |
| `calendar.listConferenceCalls` | `benzinga.api.calendar.listConferenceCalls` | `read` | List conference call data (GET /api/v2.1/calendar/conference-calls, page/pagesize pagination) |
| `calendar.listDividends` | `benzinga.api.calendar.listDividends` | `read` | List dividends calendar data (GET /api/v2.2/calendar/dividends, page/pagesize pagination) |
| `calendar.listEarnings` | `benzinga.api.calendar.listEarnings` | `read` | List earnings calendar data (GET /api/v2.1/calendar/earnings, page/pagesize pagination) |
| `calendar.listEconomics` | `benzinga.api.calendar.listEconomics` | `read` | List economic calendar data (GET /api/v2.1/calendar/economics, page/pagesize pagination) |
| `calendar.listGuidance` | `benzinga.api.calendar.listGuidance` | `read` | List company guidance data (GET /api/v2.1/calendar/guidance, page/pagesize pagination) |
| `calendar.listIpos` | `benzinga.api.calendar.listIpos` | `read` | List IPO calendar data (GET /api/v2.1/calendar/ipos, page/pagesize pagination) |
| `calendar.listRatings` | `benzinga.api.calendar.listRatings` | `read` | List analyst ratings data (GET /api/v2.1/calendar/ratings, page/pagesize pagination) |
| `calendar.listRemoved` | `benzinga.api.calendar.listRemoved` | `read` | List removed calendar events by type and update time (GET /api/v2.1/calendar-removed/, page/pageSize pagination) |
| `calendar.listSplits` | `benzinga.api.calendar.listSplits` | `read` | List stock split data (GET /api/v2.1/calendar/splits, page/pagesize pagination) |
| `news.get` | `benzinga.api.news.get` | `read` | Get Benzinga news articles (GET /api/v2/news, page/pageSize pagination) |
| `news.getStream` | `benzinga.api.news.getStream` | `read` | Get the WebSocket URL for the real-time news stream (wss://api.benzinga.com/api/v1/news/stream); append token=<api key> to connect |
| `news.listChannels` | `benzinga.api.news.listChannels` | `read` | List available Benzinga news channels (GET /api/v2.1/news/channels) |
| `news.listRemoved` | `benzinga.api.news.listRemoved` | `read` | List IDs and update times of removed news articles (GET /api/v2/news-removed, page/pageSize pagination) |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/benzinga

## License

Apache-2.0
