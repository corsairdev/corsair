# @corsair-dev/defillama

DefiLlama integration for Corsair: DeFi TVL, token prices, stablecoins, yields, volumes, fees, unlocks, bridges and more; 73 routes free without a key, the rest with a Pro key (136 operations).

## Install

```bash
pnpm add @corsair-dev/defillama
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `account.usage` | `defillama.api.account.usage` | `read` | Get amount of credits left in the api key, these reset on the 1st of each month (needs a DefiLlama Pro key) |
| `bridges.dayStats` | `defillama.api.bridges.dayStats` | `read` | Get a 24hr token and address volume breakdown for a bridge (needs a DefiLlama Pro key) |
| `bridges.get` | `defillama.api.bridges.get` | `read` | Get summary of bridge volume and volume breakdown by chain (needs a DefiLlama Pro key) |
| `bridges.list` | `defillama.api.bridges.list` | `read` | List all bridges along with summaries of recent bridge volumes (needs a DefiLlama Pro key) |
| `bridges.transactions` | `defillama.api.bridges.transactions` | `read` | Get all transactions for a bridge within a date range (needs a DefiLlama Pro key) |
| `bridges.volume` | `defillama.api.bridges.volume` | `read` | Get historical volumes for a bridge, chain, or bridge on a particular chain (needs a DefiLlama Pro key) |
| `coins.batchHistorical` | `defillama.api.coins.batchHistorical` | `read` | Get historical prices for multiple tokens at multiple different timestamps |
| `coins.block` | `defillama.api.coins.block` | `read` | Get the closest block to a timestamp |
| `coins.chart` | `defillama.api.coins.chart` | `read` | Get token prices at regular time intervals |
| `coins.current` | `defillama.api.coins.current` | `read` | Get current prices of tokens by contract address |
| `coins.first` | `defillama.api.coins.first` | `read` | Get earliest timestamp price record for coins |
| `coins.historical` | `defillama.api.coins.historical` | `read` | Get historical prices of tokens by contract address |
| `coins.percentageChange` | `defillama.api.coins.percentageChange` | `read` | Get percentage change in price over time |
| `dat.institution` | `defillama.api.dat.institution` | `read` | Get individual institution Digital Asset Treasury details (needs a DefiLlama Pro key) |
| `dat.institutions` | `defillama.api.dat.institutions` | `read` | Get list of all institutions with Digital Asset Treasury data (needs a DefiLlama Pro key) |
| `dimensions.categories` | `defillama.api.dimensions.categories` | `read` | Get categories available for a dimension |
| `dimensions.categoryChainChart` | `defillama.api.dimensions.categoryChainChart` | `read` | Get category chain historical timeseries chart data |
| `dimensions.categoryChainChartByProtocol` | `defillama.api.dimensions.categoryChainChartByProtocol` | `read` | Get category chain timeseries chart data breakdown by protocol |
| `dimensions.categoryChainMetrics` | `defillama.api.dimensions.categoryChainMetrics` | `read` | Get category chain dimension data overview |
| `dimensions.categoryChart` | `defillama.api.dimensions.categoryChart` | `read` | Get category historical timeseries chart data |
| `dimensions.categoryChartByChain` | `defillama.api.dimensions.categoryChartByChain` | `read` | Get category timeseries chart data breakdown by chain |
| `dimensions.categoryChartByProtocol` | `defillama.api.dimensions.categoryChartByProtocol` | `read` | Get category timeseries chart data breakdown by protocol |
| `dimensions.categoryMetrics` | `defillama.api.dimensions.categoryMetrics` | `read` | Get category dimension data overview |
| `dimensions.chainChart` | `defillama.api.dimensions.chainChart` | `read` | Get chain historical timeseries chart data |
| `dimensions.chainChartByProtocol` | `defillama.api.dimensions.chainChartByProtocol` | `read` | Get chain timeseries chart data breakdown by protocol |
| `dimensions.chainMetrics` | `defillama.api.dimensions.chainMetrics` | `read` | Get chain dimension data overview |
| `dimensions.chart` | `defillama.api.dimensions.chart` | `read` | Get historical timeseries chart data |
| `dimensions.chartByChain` | `defillama.api.dimensions.chartByChain` | `read` | Get historical timeseries chart data breakdown by chain |
| `dimensions.chartByProtocol` | `defillama.api.dimensions.chartByProtocol` | `read` | Get historical timeseries chart data breakdown by protocol |
| `dimensions.metrics` | `defillama.api.dimensions.metrics` | `read` | Get dimension data overview |
| `dimensions.protocolChart` | `defillama.api.dimensions.protocolChart` | `read` | Get protocol historical timeseries chart data |
| `dimensions.protocolChartByChain` | `defillama.api.dimensions.protocolChartByChain` | `read` | Get protocol timeseries chart data breakdown by chain |
| `dimensions.protocolChartByLabel` | `defillama.api.dimensions.protocolChartByLabel` | `read` | Get protocol timeseries chart data breakdown by label |
| `dimensions.protocolChartByVersion` | `defillama.api.dimensions.protocolChartByVersion` | `read` | Get protocol timeseries chart data breakdown by version |
| `dimensions.protocolMetrics` | `defillama.api.dimensions.protocolMetrics` | `read` | Get protocol dimension data overview |
| `equities.companies` | `defillama.api.equities.companies` | `read` | Get list of all tracked public companies (needs a DefiLlama Pro key) |
| `equities.dimensions` | `defillama.api.equities.dimensions` | `read` | Get financial dimensions for a company (needs a DefiLlama Pro key) |
| `equities.earningsCalendar` | `defillama.api.equities.earningsCalendar` | `read` | Get earnings calendar (needs a DefiLlama Pro key) |
| `equities.filings` | `defillama.api.equities.filings` | `read` | Get filings for a company (needs a DefiLlama Pro key) |
| `equities.industries` | `defillama.api.equities.industries` | `read` | Get industries (needs a DefiLlama Pro key) |
| `equities.ohlcv` | `defillama.api.equities.ohlcv` | `read` | Get OHLCV candle data for a company (needs a DefiLlama Pro key) |
| `equities.onchain` | `defillama.api.equities.onchain` | `read` | Get on-chain tradeable markets for a company (needs a DefiLlama Pro key) |
| `equities.priceHistory` | `defillama.api.equities.priceHistory` | `read` | Get historical price data for a company (needs a DefiLlama Pro key) |
| `equities.sector` | `defillama.api.equities.sector` | `read` | Get details for one sector (needs a DefiLlama Pro key) |
| `equities.sectors` | `defillama.api.equities.sectors` | `read` | Get all sectors (needs a DefiLlama Pro key) |
| `equities.sectorsOverview` | `defillama.api.equities.sectorsOverview` | `read` | Get market-wide sector overview (needs a DefiLlama Pro key) |
| `equities.statements` | `defillama.api.equities.statements` | `read` | Get financial statements for a company (needs a DefiLlama Pro key) |
| `equities.summary` | `defillama.api.equities.summary` | `read` | Get live market summary for a company (needs a DefiLlama Pro key) |
| `etfs.flows` | `defillama.api.etfs.flows` | `read` | Historical Flows at the Asset Level (needs a DefiLlama Pro key) |
| `etfs.snapshot` | `defillama.api.etfs.snapshot` | `read` | Get ETFs and their metrics (aum, flows, fees...) (needs a DefiLlama Pro key) |
| `fees.byChain` | `defillama.api.fees.byChain` | `read` | List all protocols along with summaries of their fees and revenue and dataType history data by chain |
| `fees.overview` | `defillama.api.fees.overview` | `read` | List all protocols along with summaries of their fees and revenue and dataType history data |
| `fees.summary` | `defillama.api.fees.summary` | `read` | Get summary of protocol fees and revenue with historical data |
| `financialStatements.get` | `defillama.api.financialStatements.get` | `read` | Get protocol income statement report (needs a DefiLlama Pro key) |
| `forks.chartByProtocol` | `defillama.api.forks.chartByProtocol` | `read` | Get timeseries chart data breakdown by protocol |
| `forks.metrics` | `defillama.api.forks.metrics` | `read` | Get fork data overview |
| `forks.protocolChart` | `defillama.api.forks.protocolChart` | `read` | Get timeseries chart data by protocol |
| `narratives.performance` | `defillama.api.narratives.performance` | `read` | Get chart of narratives based on category performance (with individual coins weighted by mcap) (needs a DefiLlama Pro key) |
| `oracles.chainChart` | `defillama.api.oracles.chainChart` | `read` | Get timeseries chart data by chain |
| `oracles.chainChartByProtocol` | `defillama.api.oracles.chainChartByProtocol` | `read` | Get protocol breakdown timeseries chart data by chain |
| `oracles.chart` | `defillama.api.oracles.chart` | `read` | Get timeseries chart data for all oracles |
| `oracles.chartByChain` | `defillama.api.oracles.chartByChain` | `read` | Get timeseries chart data breakdown by chain |
| `oracles.chartByProtocol` | `defillama.api.oracles.chartByProtocol` | `read` | Get timeseries chart data breakdown by protocol |
| `oracles.metrics` | `defillama.api.oracles.metrics` | `read` | Get oracle data overview |
| `oracles.protocolChart` | `defillama.api.oracles.protocolChart` | `read` | Get timeseries chart data by protocol/oracle |
| `oracles.protocolChartByChain` | `defillama.api.oracles.protocolChartByChain` | `read` | Get chain breakdown timeseries chart data by protocol/oracle |
| `overview.categories` | `defillama.api.overview.categories` | `read` | Overview of all categories accross all protocols (needs a DefiLlama Pro key) |
| `overview.entities` | `defillama.api.overview.entities` | `read` | List all entities (needs a DefiLlama Pro key) |
| `overview.forks` | `defillama.api.overview.forks` | `read` | Overview of all forks accross all protocols (needs a DefiLlama Pro key) |
| `overview.hacks` | `defillama.api.overview.hacks` | `read` | Overview of all hacks on our Hacks dashboard |
| `overview.oracles` | `defillama.api.overview.oracles` | `read` | Overview of all oracles accross all protocols (needs a DefiLlama Pro key) |
| `overview.raises` | `defillama.api.overview.raises` | `read` | Overview of all raises on our Raises dashboard (needs a DefiLlama Pro key) |
| `overview.treasuries` | `defillama.api.overview.treasuries` | `read` | List all protocols on our Treasuries dashboard (needs a DefiLlama Pro key) |
| `perps.derivatives` | `defillama.api.perps.derivatives` | `read` | Lists all derivatives along summaries of their volumes filtering by chain (needs a DefiLlama Pro key) |
| `perps.derivativesSummary` | `defillama.api.perps.derivativesSummary` | `read` | Volume Details about a specific perp protocol (needs a DefiLlama Pro key) |
| `perps.openInterest` | `defillama.api.perps.openInterest` | `read` | List all open interest dex exchanges along with summaries of their open interest |
| `preIpo.companies` | `defillama.api.preIpo.companies` | `read` | Get list of all tracked pre-IPO companies (needs a DefiLlama Pro key) |
| `preIpo.integrations` | `defillama.api.preIpo.integrations` | `read` | Get tradeable markets for a pre-IPO company (needs a DefiLlama Pro key) |
| `preIpo.raises` | `defillama.api.preIpo.raises` | `read` | Get funding rounds for a pre-IPO company (needs a DefiLlama Pro key) |
| `preIpo.summary` | `defillama.api.preIpo.summary` | `read` | Get profile and latest valuation for a pre-IPO company (needs a DefiLlama Pro key) |
| `preIpo.valuations` | `defillama.api.preIpo.valuations` | `read` | Get valuation history for a pre-IPO company (needs a DefiLlama Pro key) |
| `rwa.chain` | `defillama.api.rwa.chain` | `read` | List current RWA assets on a chain (needs a DefiLlama Pro key) |
| `rwa.chainChart` | `defillama.api.rwa.chainChart` | `read` | Get historical RWA chart data for a chain (needs a DefiLlama Pro key) |
| `rwa.chartByChain` | `defillama.api.rwa.chartByChain` | `read` | Get historical RWA metric breakdown by chain (needs a DefiLlama Pro key) |
| `rwa.current` | `defillama.api.rwa.current` | `read` | List all current RWA assets (needs a DefiLlama Pro key) |
| `rwa.list` | `defillama.api.rwa.list` | `read` | List RWA ids and filter values (needs a DefiLlama Pro key) |
| `rwa.stats` | `defillama.api.rwa.stats` | `read` | Get aggregate RWA stats by chain, category, platform, and asset group |
| `stablecoins.chains` | `defillama.api.stablecoins.chains` | `read` | Get current mcap sum of all stablecoins on each chain |
| `stablecoins.chartAll` | `defillama.api.stablecoins.chartAll` | `read` | Get historical mcap sum of all stablecoins |
| `stablecoins.chartByChain` | `defillama.api.stablecoins.chartByChain` | `read` | Get historical mcap sum of all stablecoins in a chain |
| `stablecoins.dominance` | `defillama.api.stablecoins.dominance` | `read` | Get stablecoin dominance per chain along with the info about the larges coin in a chain |
| `stablecoins.get` | `defillama.api.stablecoins.get` | `read` | Get historical mcap and historical chain distribution of a stablecoin |
| `stablecoins.list` | `defillama.api.stablecoins.list` | `read` | List all stablecoins along with their circulating amounts |
| `stablecoins.prices` | `defillama.api.stablecoins.prices` | `read` | Get historical prices of all stablecoins |
| `tokenLiquidity.history` | `defillama.api.tokenLiquidity.history` | `read` | Provides the name of contracts on a determined chain (needs a DefiLlama Pro key) |
| `treasury.chart` | `defillama.api.treasury.chart` | `read` | Get historical treasury chart for a protocol |
| `treasury.chartByChain` | `defillama.api.treasury.chartByChain` | `read` | Get historical treasury chart for a protocol broken down by chain |
| `treasury.chartByToken` | `defillama.api.treasury.chartByToken` | `read` | Get historical treasury chart for a protocol broken down by token |
| `treasury.metrics` | `defillama.api.treasury.metrics` | `read` | Get aggregate treasury metrics for a protocol |
| `tvl.chainAssets` | `defillama.api.tvl.chainAssets` | `read` | Get assets of all chains (needs a DefiLlama Pro key) |
| `tvl.chains` | `defillama.api.tvl.chains` | `read` | Get current TVL of all chains |
| `tvl.chart` | `defillama.api.tvl.chart` | `read` | Get historical TVL chart for a protocol |
| `tvl.chartByChain` | `defillama.api.tvl.chartByChain` | `read` | Get historical TVL chart for a protocol broken down by chain |
| `tvl.chartByToken` | `defillama.api.tvl.chartByToken` | `read` | Get historical TVL chart for a protocol broken down by token |
| `tvl.current` | `defillama.api.tvl.current` | `read` | Simplified endpoint to get current TVL of a protocol |
| `tvl.historicalChainTvl` | `defillama.api.tvl.historicalChainTvl` | `read` | Get historical TVL (excludes liquid staking and double counted tvl) of DeFi on all chains |
| `tvl.historicalChainTvlByChain` | `defillama.api.tvl.historicalChainTvlByChain` | `read` | Get historical TVL (excludes liquid staking and double counted tvl) of a chain |
| `tvl.inflows` | `defillama.api.tvl.inflows` | `read` | Lists the amount of inflows and outflows for a protocol at a given date (needs a DefiLlama Pro key) |
| `tvl.metrics` | `defillama.api.tvl.metrics` | `read` | Get aggregate TVL metrics for a protocol |
| `tvl.protocol` | `defillama.api.tvl.protocol` | `read` | Get historical TVL of a protocol and breakdowns by token and chain |
| `tvl.protocols` | `defillama.api.tvl.protocols` | `read` | List all protocols on defillama along with their tvl |
| `tvl.tokenProtocols` | `defillama.api.tvl.tokenProtocols` | `read` | Lists the amount of a certain token within all protocols. Data for the Token Usage page (needs a DefiLlama Pro key) |
| `unlocks.get` | `defillama.api.unlocks.get` | `read` | Unlocks data for a given token/protocol. You can find a list of available slugs to query by querying /emissions and then extracting the key `gecko_id` (needs a DefiLlama Pro key) |
| `unlocks.list` | `defillama.api.unlocks.list` | `read` | List of all tokens along with basic info for each (needs a DefiLlama Pro key) |
| `volumes.dexs` | `defillama.api.volumes.dexs` | `read` | List all dexs along with summaries of their volumes and dataType history data |
| `volumes.dexsByChain` | `defillama.api.volumes.dexsByChain` | `read` | List all dexs along with summaries of their volumes and dataType history data filtering by chain |
| `volumes.dexSummary` | `defillama.api.volumes.dexSummary` | `read` | Get summary of dex volume with historical data |
| `volumes.options` | `defillama.api.volumes.options` | `read` | List all options dexs along with summaries of their volumes and dataType history data |
| `volumes.optionsByChain` | `defillama.api.volumes.optionsByChain` | `read` | List all options dexs along with summaries of their volumes and dataType history data filtering by chain |
| `volumes.optionsSummary` | `defillama.api.volumes.optionsSummary` | `read` | Get summary of options dex volume with historical data |
| `yields.borrow.marketHistory` | `defillama.api.yields.borrow.marketHistory` | `read` | Retrieve daily borrow-side history for a borrow market (needs a DefiLlama Pro key) |
| `yields.borrow.markets` | `defillama.api.yields.borrow.markets` | `read` | Retrieve the latest data for all borrow markets (needs a DefiLlama Pro key) |
| `yields.borrow.routes` | `defillama.api.yields.borrow.routes` | `read` | Retrieve the latest data for all borrow routes (needs a DefiLlama Pro key) |
| `yields.borrowPools` | `defillama.api.yields.borrowPools` | `read` | Borrow costs APY of assets from lending markets in the legacy v1 response format (needs a DefiLlama Pro key) |
| `yields.earn.history` | `defillama.api.yields.earn.history` | `read` | Retrieve daily history for an earn pool (needs a DefiLlama Pro key) |
| `yields.earn.list` | `defillama.api.yields.earn.list` | `read` | Retrieve the latest data for all earn pools (needs a DefiLlama Pro key) |
| `yields.earn.query` | `defillama.api.yields.earn.query` | `read` | Retrieve a filtered, paginated page of earn pools (needs a DefiLlama Pro key) |
| `yields.earn.verified` | `defillama.api.yields.earn.verified` | `read` | Retrieve the latest verified data for all measured earn pools (needs a DefiLlama Pro key) |
| `yields.earn.verifiedGet` | `defillama.api.yields.earn.verifiedGet` | `read` | Retrieve the latest verified data for one earn pool (needs a DefiLlama Pro key) |
| `yields.earn.verifiedHistory` | `defillama.api.yields.earn.verifiedHistory` | `read` | Retrieve daily verified history for an earn pool (needs a DefiLlama Pro key) |
| `yields.lendBorrowChart` | `defillama.api.yields.lendBorrowChart` | `read` | Historical borrow cost APY from a pool on a lending market in the legacy v1 response format (needs a DefiLlama Pro key) |
| `yields.loops` | `defillama.api.yields.loops` | `read` | Retrieve the latest data for all loop strategies (needs a DefiLlama Pro key) |
| `yields.lstRates` | `defillama.api.yields.lstRates` | `read` | Exchange rates and ETH peg of liquid staking tokens (needs a DefiLlama Pro key) |
| `yields.perpFundingRates` | `defillama.api.yields.perpFundingRates` | `read` | Funding rates and open interest of perpetual futures (needs a DefiLlama Pro key) |
| `yields.poolChart` | `defillama.api.yields.poolChart` | `read` | Get historical APY and TVL of a pool in the legacy v1 response format |
| `yields.pools` | `defillama.api.yields.pools` | `read` | Retrieve the latest data for all pools in the legacy v1 response format |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/defillama

## License

Apache-2.0
