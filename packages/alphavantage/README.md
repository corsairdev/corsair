# @corsair-dev/alphavantage

Alpha Vantage plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/alphavantage
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `commodities.all` | `alphavantage.api.commodities.all` | `read` | Get the global commodities price index |
| `commodities.aluminum` | `alphavantage.api.commodities.aluminum` | `read` | Get global aluminum prices |
| `commodities.brent` | `alphavantage.api.commodities.brent` | `read` | Get Brent crude oil prices |
| `commodities.coffee` | `alphavantage.api.commodities.coffee` | `read` | Get global coffee prices |
| `commodities.copper` | `alphavantage.api.commodities.copper` | `read` | Get global copper prices |
| `commodities.corn` | `alphavantage.api.commodities.corn` | `read` | Get global corn prices |
| `commodities.cotton` | `alphavantage.api.commodities.cotton` | `read` | Get global cotton prices |
| `commodities.sugar` | `alphavantage.api.commodities.sugar` | `read` | Get global sugar prices |
| `commodities.wheat` | `alphavantage.api.commodities.wheat` | `read` | Get global wheat prices |
| `crypto.daily` | `alphavantage.api.crypto.daily` | `read` | Get daily bars for a digital currency |
| `crypto.intraday` | `alphavantage.api.crypto.intraday` | `read` | Get intraday bars for a digital currency [PREMIUM PLAN] |
| `crypto.monthly` | `alphavantage.api.crypto.monthly` | `read` | Get monthly bars for a digital currency |
| `crypto.weekly` | `alphavantage.api.crypto.weekly` | `read` | Get weekly bars for a digital currency |
| `economic.cpi` | `alphavantage.api.economic.cpi` | `read` | Get the US consumer price index |
| `economic.durables` | `alphavantage.api.economic.durables` | `read` | Get US durable goods orders |
| `economic.federalFundsRate` | `alphavantage.api.economic.federalFundsRate` | `read` | Get the US federal funds rate |
| `economic.inflation` | `alphavantage.api.economic.inflation` | `read` | Get annual US inflation |
| `economic.nonfarmPayroll` | `alphavantage.api.economic.nonfarmPayroll` | `read` | Get US nonfarm payroll totals |
| `economic.realGdp` | `alphavantage.api.economic.realGdp` | `read` | Get US real gross domestic product |
| `economic.realGdpPerCapita` | `alphavantage.api.economic.realGdpPerCapita` | `read` | Get US real GDP per capita |
| `economic.retailSales` | `alphavantage.api.economic.retailSales` | `read` | Get US advance retail sales |
| `economic.treasuryYield` | `alphavantage.api.economic.treasuryYield` | `read` | Get US treasury yield for a constant maturity |
| `economic.unemployment` | `alphavantage.api.economic.unemployment` | `read` | Get the US unemployment rate |
| `forex.daily` | `alphavantage.api.forex.daily` | `read` | Get daily bars for a currency pair |
| `forex.exchangeRate` | `alphavantage.api.forex.exchangeRate` | `read` | Get the current rate for a currency pair |
| `forex.intraday` | `alphavantage.api.forex.intraday` | `read` | Get intraday bars for a currency pair [PREMIUM PLAN] |
| `forex.monthly` | `alphavantage.api.forex.monthly` | `read` | Get monthly bars for a currency pair |
| `forex.weekly` | `alphavantage.api.forex.weekly` | `read` | Get weekly bars for a currency pair |
| `fundamentals.balanceSheet` | `alphavantage.api.fundamentals.balanceSheet` | `read` | Get annual and quarterly balance sheets |
| `fundamentals.cashFlow` | `alphavantage.api.fundamentals.cashFlow` | `read` | Get annual and quarterly cash flow statements |
| `fundamentals.companyOverview` | `alphavantage.api.fundamentals.companyOverview` | `read` | Get a company profile with sector and valuation figures |
| `fundamentals.dividends` | `alphavantage.api.fundamentals.dividends` | `read` | Get historical and declared dividends |
| `fundamentals.earnings` | `alphavantage.api.fundamentals.earnings` | `read` | Get reported and estimated earnings per share |
| `fundamentals.earningsCalendar` | `alphavantage.api.fundamentals.earningsCalendar` | `read` | List upcoming earnings dates (CSV upstream) |
| `fundamentals.earningsCallTranscript` | `alphavantage.api.fundamentals.earningsCallTranscript` | `read` | Get an earnings call transcript with per-speaker sentiment |
| `fundamentals.incomeStatement` | `alphavantage.api.fundamentals.incomeStatement` | `read` | Get annual and quarterly income statements |
| `fundamentals.ipoCalendar` | `alphavantage.api.fundamentals.ipoCalendar` | `read` | List IPOs expected in the next three months (CSV upstream) |
| `fundamentals.splits` | `alphavantage.api.fundamentals.splits` | `read` | Get historical stock splits |
| `intelligence.historicalOptions` | `alphavantage.api.intelligence.historicalOptions` | `read` | Get a full options chain for one date [PREMIUM PLAN] |
| `intelligence.newsSentiment` | `alphavantage.api.intelligence.newsSentiment` | `read` | Get market news with article and ticker sentiment scores |
| `intelligence.slidingWindowAnalytics` | `alphavantage.api.intelligence.slidingWindowAnalytics` | `read` | Get rolling-window statistics across a set of tickers |
| `market.listingStatus` | `alphavantage.api.market.listingStatus` | `read` | List every covered security, active or delisted (CSV upstream) |
| `market.sector` | `alphavantage.api.market.sector` | `read` | Get sector performance [DEPRECATED UPSTREAM: returns an empty body] |
| `market.status` | `alphavantage.api.market.status` | `read` | Get the open or closed state of global exchanges |
| `market.symbolSearch` | `alphavantage.api.market.symbolSearch` | `read` | Search securities by name or ticker fragment |
| `market.topGainersLosers` | `alphavantage.api.market.topGainersLosers` | `read` | Get the top gainers, losers and most actively traded US tickers |
| `technical.indicator` | `alphavantage.api.technical.indicator` | `read` | Calculate any technical indicator (SMA, EMA, RSI, MACD, ...) |
| `timeSeries.daily` | `alphavantage.api.timeSeries.daily` | `read` | Get daily OHLCV bars |
| `timeSeries.globalQuote` | `alphavantage.api.timeSeries.globalQuote` | `read` | Get the latest price and volume for one ticker |
| `timeSeries.intraday` | `alphavantage.api.timeSeries.intraday` | `read` | Get intraday OHLCV bars at 1-60 minute resolution [PREMIUM PLAN] |
| `timeSeries.intradayExtended` | `alphavantage.api.timeSeries.intradayExtended` | `read` | Get historical intraday bars beyond the default window [PREMIUM PLAN] |
| `timeSeries.monthly` | `alphavantage.api.timeSeries.monthly` | `read` | Get monthly OHLCV bars |
| `timeSeries.monthlyAdjusted` | `alphavantage.api.timeSeries.monthlyAdjusted` | `read` | Get monthly bars adjusted for splits and dividends |
| `timeSeries.realtimeBulkQuotes` | `alphavantage.api.timeSeries.realtimeBulkQuotes` | `read` | Get quotes for up to 100 tickers at once [PREMIUM PLAN] |
| `timeSeries.weekly` | `alphavantage.api.timeSeries.weekly` | `read` | Get weekly OHLCV bars |
| `timeSeries.weeklyAdjusted` | `alphavantage.api.timeSeries.weeklyAdjusted` | `read` | Get weekly bars adjusted for splits and dividends |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/alphavantage

## License

Apache-2.0
