# @corsair-dev/finage

Finage plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/finage
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `market.convertCrypto` | `finage.api.market.convertCrypto` | `read` | Convert an amount between two cryptocurrencies |
| `market.convertCurrency` | `finage.api.market.convertCurrency` | `read` | Convert an amount between two fiat currencies |
| `market.getBalanceSheetStatements` | `finage.api.market.getBalanceSheetStatements` | `read` | Retrieve a company balance sheet |
| `market.getBondsRate` | `finage.api.market.getBondsRate` | `read` | Retrieve the latest US bond rate for a symbol |
| `market.getCanadaMarketAggregates` | `finage.api.market.getCanadaMarketAggregates` | `read` | Retrieve Canadian stock aggregates |
| `market.getCanadaMarketLastPrice` | `finage.api.market.getCanadaMarketLastPrice` | `read` | Retrieve the latest Canadian stock price |
| `market.getCashFlowStatements` | `finage.api.market.getCashFlowStatements` | `read` | Retrieve a company cash flow statement |
| `market.getCfdEtfLastPrice` | `finage.api.market.getCfdEtfLastPrice` | `read` | Retrieve the latest ETF price |
| `market.getCfdEtfMarketAggregates` | `finage.api.market.getCfdEtfMarketAggregates` | `read` | Retrieve historical ETF aggregates |
| `market.getCfdEtfPreviousClose` | `finage.api.market.getCfdEtfPreviousClose` | `read` | Retrieve the previous ETF close |
| `market.getCfdIndexLastPrice` | `finage.api.market.getCfdIndexLastPrice` | `read` | Retrieve the latest index price |
| `market.getCfdIndexMarketAggregates` | `finage.api.market.getCfdIndexMarketAggregates` | `read` | Retrieve historical index aggregates |
| `market.getCfdIndexPreviousClose` | `finage.api.market.getCfdIndexPreviousClose` | `read` | Retrieve the previous index close |
| `market.getCountryDetail` | `finage.api.market.getCountryDetail` | `read` | Retrieve country details used in market data |
| `market.getCryptoAggregates` | `finage.api.market.getCryptoAggregates` | `read` | Retrieve historical cryptocurrency aggregates |
| `market.getCryptoDetail` | `finage.api.market.getCryptoDetail` | `read` | Retrieve fundamental details for a cryptocurrency |
| `market.getCryptoDetailed` | `finage.api.market.getCryptoDetailed` | `read` | Retrieve detailed data for the latest cryptocurrency market state |
| `market.getCryptoLastQuote` | `finage.api.market.getCryptoLastQuote` | `read` | Retrieve the latest cryptocurrency quote |
| `market.getCryptoLastTrade` | `finage.api.market.getCryptoLastTrade` | `read` | Retrieve the latest cryptocurrency trade |
| `market.getCryptoNews` | `finage.api.market.getCryptoNews` | `read` | Retrieve news for a cryptocurrency |
| `market.getCryptoPreviousClose` | `finage.api.market.getCryptoPreviousClose` | `read` | Retrieve the previous cryptocurrency close |
| `market.getCryptoSnapshot` | `finage.api.market.getCryptoSnapshot` | `read` | Retrieve a snapshot of cryptocurrency market data |
| `market.getCurrencyDetail` | `finage.api.market.getCurrencyDetail` | `read` | Retrieve fundamental details for a currency |
| `market.getDelistedCompanies` | `finage.api.market.getDelistedCompanies` | `read` | List delisted companies |
| `market.getDividendsCalendar` | `finage.api.market.getDividendsCalendar` | `read` | Retrieve the dividend calendar |
| `market.getEarningsCalendar` | `finage.api.market.getEarningsCalendar` | `read` | Retrieve the earnings calendar |
| `market.getEconomicCalendar` | `finage.api.market.getEconomicCalendar` | `read` | Retrieve the economic calendar |
| `market.getFinancialRatios` | `finage.api.market.getFinancialRatios` | `read` | Retrieve a company financial ratios |
| `market.getForexLastQuote` | `finage.api.market.getForexLastQuote` | `read` | Retrieve the latest forex quote |
| `market.getForexLastTrade` | `finage.api.market.getForexLastTrade` | `read` | Retrieve the latest forex trade |
| `market.getForexMarketAggregates` | `finage.api.market.getForexMarketAggregates` | `read` | Retrieve historical forex aggregates |
| `market.getForexNews` | `finage.api.market.getForexNews` | `read` | Retrieve news for a forex pair |
| `market.getForexPreviousClose` | `finage.api.market.getForexPreviousClose` | `read` | Retrieve the previous forex close |
| `market.getForexSignal` | `finage.api.market.getForexSignal` | `read` | Retrieve a forex technical signal |
| `market.getForexSnapshot` | `finage.api.market.getForexSnapshot` | `read` | Retrieve a snapshot of forex market data |
| `market.getHistoricalDividendsCalendar` | `finage.api.market.getHistoricalDividendsCalendar` | `read` | Retrieve a company dividend history |
| `market.getHistoricalStockSplitCalendar` | `finage.api.market.getHistoricalStockSplitCalendar` | `read` | Retrieve a company stock split history |
| `market.getIncomeStatements` | `finage.api.market.getIncomeStatements` | `read` | Retrieve company income statements and international filings |
| `market.getIndianMarketAggregates` | `finage.api.market.getIndianMarketAggregates` | `read` | Retrieve Indian stock aggregates |
| `market.getIndianMarketLastPrice` | `finage.api.market.getIndianMarketLastPrice` | `read` | Retrieve the latest Indian stock price |
| `market.getInstitutionalHolders` | `finage.api.market.getInstitutionalHolders` | `read` | List institutional holders for a company |
| `market.getIpoCalendar` | `finage.api.market.getIpoCalendar` | `read` | Retrieve the IPO calendar |
| `market.getMostActiveStocks` | `finage.api.market.getMostActiveStocks` | `read` | List the most active US stocks |
| `market.getMutualFundHolders` | `finage.api.market.getMutualFundHolders` | `read` | List mutual fund holders for a company |
| `market.getRussianMarketAggregates` | `finage.api.market.getRussianMarketAggregates` | `read` | Retrieve Russian stock aggregates |
| `market.getRussianMarketLastPrice` | `finage.api.market.getRussianMarketLastPrice` | `read` | Retrieve the latest Russian stock price |
| `market.getSecRssFeed` | `finage.api.market.getSecRssFeed` | `read` | Retrieve the SEC funds RSS feed |
| `market.getSectorPerformance` | `finage.api.market.getSectorPerformance` | `read` | Retrieve US stock sector performance |
| `market.getSharesFloat` | `finage.api.market.getSharesFloat` | `read` | Retrieve public float and outstanding shares |
| `market.getStockCompanyDetails` | `finage.api.market.getStockCompanyDetails` | `read` | Retrieve company fundamentals for a stock |
| `market.getStockLastQuote` | `finage.api.market.getStockLastQuote` | `read` | Retrieve the latest stock quote |
| `market.getStockLastTrade` | `finage.api.market.getStockLastTrade` | `read` | Retrieve the latest stock trade |
| `market.getStockMarketAggregates` | `finage.api.market.getStockMarketAggregates` | `read` | Retrieve stock market aggregates |
| `market.getStockMarketNews` | `finage.api.market.getStockMarketNews` | `read` | Retrieve market news for a stock |
| `market.getStockMarketStatus` | `finage.api.market.getStockMarketStatus` | `read` | Retrieve current market status and schedules |
| `market.getStockPreviousClose` | `finage.api.market.getStockPreviousClose` | `read` | Retrieve the previous stock close |
| `market.getStockSnapshot` | `finage.api.market.getStockSnapshot` | `read` | Retrieve a snapshot of stock market data |
| `market.getStockSplitCalendar` | `finage.api.market.getStockSplitCalendar` | `read` | Retrieve the stock split calendar |
| `market.getTechnicalIndicators` | `finage.api.market.getTechnicalIndicators` | `read` | Calculate a technical indicator for a market symbol |
| `market.getTopGainers` | `finage.api.market.getTopGainers` | `read` | List the top gaining US stocks |
| `market.getTopLosers` | `finage.api.market.getTopLosers` | `read` | List the top losing US stocks |
| `market.getUkMarketAggregates` | `finage.api.market.getUkMarketAggregates` | `read` | Retrieve UK stock aggregates |
| `market.getUkMarketLastPrice` | `finage.api.market.getUkMarketLastPrice` | `read` | Retrieve the latest UK stock price |
| `market.getUsStocksSignal` | `finage.api.market.getUsStocksSignal` | `read` | Retrieve a US stock technical signal |
| `market.listCryptocurrencies` | `finage.api.market.listCryptocurrencies` | `read` | List supported cryptocurrencies |
| `market.listSymbols` | `finage.api.market.listSymbols` | `read` | List symbols for a supported market |
| `market.searchCountry` | `finage.api.market.searchCountry` | `read` | Search countries by name or code |
| `market.searchCryptocurrency` | `finage.api.market.searchCryptocurrency` | `read` | Search cryptocurrencies by name or code |
| `market.searchCurrency` | `finage.api.market.searchCurrency` | `read` | Search currencies by name or code |
| `market.searchMarket` | `finage.api.market.searchMarket` | `read` | Search symbols within a market |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/finage

## License

Apache-2.0
