# @corsair-dev/twelvedata

Twelve Data plugin for Corsair: read quotes, prices and OHLC time series, exchange rates, technical indicators, and the stock, forex and crypto reference lists.

## Install

```bash
pnpm add @corsair-dev/twelvedata
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `indicators.adx` | `twelvedata.api.indicators.adx` | `read` | Read the ADX technical indicator for a symbol over an interval |
| `indicators.apo` | `twelvedata.api.indicators.apo` | `read` | Read the APO technical indicator for a symbol over an interval |
| `indicators.atr` | `twelvedata.api.indicators.atr` | `read` | Read the ATR technical indicator for a symbol over an interval |
| `indicators.bbands` | `twelvedata.api.indicators.bbands` | `read` | Read the BBANDS technical indicator for a symbol over an interval |
| `indicators.beta` | `twelvedata.api.indicators.beta` | `read` | Read the BETA technical indicator for a symbol over an interval |
| `indicators.cci` | `twelvedata.api.indicators.cci` | `read` | Read the CCI technical indicator for a symbol over an interval |
| `indicators.correl` | `twelvedata.api.indicators.correl` | `read` | Read the CORREL technical indicator for a symbol over an interval |
| `indicators.ema` | `twelvedata.api.indicators.ema` | `read` | Read the EMA technical indicator for a symbol over an interval |
| `indicators.macd` | `twelvedata.api.indicators.macd` | `read` | Read the MACD technical indicator for a symbol over an interval |
| `indicators.max` | `twelvedata.api.indicators.max` | `read` | Read the MAX technical indicator for a symbol over an interval |
| `indicators.mfi` | `twelvedata.api.indicators.mfi` | `read` | Read the MFI technical indicator for a symbol over an interval |
| `indicators.min` | `twelvedata.api.indicators.min` | `read` | Read the MIN technical indicator for a symbol over an interval |
| `indicators.ppo` | `twelvedata.api.indicators.ppo` | `read` | Read the PPO technical indicator for a symbol over an interval |
| `indicators.roc` | `twelvedata.api.indicators.roc` | `read` | Read the ROC technical indicator for a symbol over an interval |
| `indicators.rsi` | `twelvedata.api.indicators.rsi` | `read` | Read the RSI technical indicator for a symbol over an interval |
| `indicators.sma` | `twelvedata.api.indicators.sma` | `read` | Read the SMA technical indicator for a symbol over an interval |
| `indicators.stddev` | `twelvedata.api.indicators.stddev` | `read` | Read the STDDEV technical indicator for a symbol over an interval |
| `indicators.stoch` | `twelvedata.api.indicators.stoch` | `read` | Read the STOCH technical indicator for a symbol over an interval |
| `indicators.stochrsi` | `twelvedata.api.indicators.stochrsi` | `read` | Read the STOCHRSI technical indicator for a symbol over an interval |
| `indicators.supertrend` | `twelvedata.api.indicators.supertrend` | `read` | Read the SUPERTREND technical indicator for a symbol over an interval |
| `indicators.tsf` | `twelvedata.api.indicators.tsf` | `read` | Read the TSF technical indicator for a symbol over an interval |
| `indicators.ultosc` | `twelvedata.api.indicators.ultosc` | `read` | Read the ULTOSC technical indicator for a symbol over an interval |
| `indicators.vwma` | `twelvedata.api.indicators.vwma` | `read` | Read the VWMA technical indicator for a symbol over an interval |
| `indicators.willr` | `twelvedata.api.indicators.willr` | `read` | Read the WILLR technical indicator for a symbol over an interval |
| `indicators.wma` | `twelvedata.api.indicators.wma` | `read` | Read the WMA technical indicator for a symbol over an interval |
| `market.apiUsage` | `twelvedata.api.market.apiUsage` | `read` | Read how many API calls the key has made, and the plan limit |
| `market.exchangeRate` | `twelvedata.api.market.exchangeRate` | `read` | Read the current exchange rate of one currency pair |
| `market.price` | `twelvedata.api.market.price` | `read` | Read the latest price for a symbol, the smallest of the market-data answers |
| `market.quote` | `twelvedata.api.market.quote` | `read` | Read the latest quote for a symbol: open, high, low, close, change and 52-week range |
| `market.timeSeries` | `twelvedata.api.market.timeSeries` | `read` | Read OHLC candles for a symbol over an interval, with a date window and ordering |
| `reference.cryptocurrencies` | `twelvedata.api.reference.cryptocurrencies` | `read` | List the cryptocurrency pairs available |
| `reference.exchanges` | `twelvedata.api.reference.exchanges` | `read` | List the exchanges Twelve Data covers, with their timezone |
| `reference.forexPairs` | `twelvedata.api.reference.forexPairs` | `read` | List the currency pairs available, by base or quote currency |
| `reference.stocks` | `twelvedata.api.reference.stocks` | `read` | List the stocks Twelve Data covers, filtered by symbol, exchange or country |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/twelvedata

## License

Apache-2.0
