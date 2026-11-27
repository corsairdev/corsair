# @corsair-dev/polymarket

Polymarket integration for Corsair: prediction-market data from Gamma, the Data API and the CLOB (markets, events, books, prices, positions, trades, leaderboards), CLOB orders and API keys, Bridge, Relayer, RFQ and Perps (276 operations).

## Install

```bash
pnpm add @corsair-dev/polymarket
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `bridge.deposit` | `polymarket.api.bridge.deposit` | `write` | Create bridge addresses |
| `bridge.quote` | `polymarket.api.bridge.quote` | `read` | Get a quote |
| `bridge.status` | `polymarket.api.bridge.status` | `read` | Get transaction status |
| `bridge.supportedAssets` | `polymarket.api.bridge.supportedAssets` | `read` | Get supported assets |
| `bridge.withdraw` | `polymarket.api.bridge.withdraw` | `destructive` | Create withdrawal addresses |
| `clob.apiKeys.create` | `polymarket.api.clob.apiKeys.create` | `destructive` | Create API key |
| `clob.apiKeys.delete` | `polymarket.api.clob.apiKeys.delete` | `destructive` | Delete API key |
| `clob.apiKeys.derive` | `polymarket.api.clob.apiKeys.derive` | `read` | Derive API key |
| `clob.apiKeys.list` | `polymarket.api.clob.apiKeys.list` | `read` | Get API keys |
| `clob.balanceAllowance.get` | `polymarket.api.clob.balanceAllowance.get` | `read` | Get balance and allowance |
| `clob.balanceAllowance.refresh` | `polymarket.api.clob.balanceAllowance.refresh` | `read` | Update balance and allowance |
| `clob.balanceAllowance.update` | `polymarket.api.clob.balanceAllowance.update` | `write` | Update balance and allowance |
| `clob.books.get` | `polymarket.api.clob.books.get` | `read` | Get order book |
| `clob.books.list` | `polymarket.api.clob.books.list` | `read` | Get order books (query parameters) |
| `clob.books.listByBody` | `polymarket.api.clob.books.listByBody` | `read` | Get order books (request body) |
| `clob.builderApiKeys.create` | `polymarket.api.clob.builderApiKeys.create` | `destructive` | Create builder API key |
| `clob.builderApiKeys.list` | `polymarket.api.clob.builderApiKeys.list` | `read` | Get builder API keys |
| `clob.builderApiKeys.revoke` | `polymarket.api.clob.builderApiKeys.revoke` | `destructive` | Revoke builder API key |
| `clob.closedOnlyMode` | `polymarket.api.clob.closedOnlyMode` | `read` | Get closed-only mode status |
| `clob.feeRate.get` | `polymarket.api.clob.feeRate.get` | `read` | Get fee rate |
| `clob.feeRate.getByToken` | `polymarket.api.clob.feeRate.getByToken` | `read` | Get fee rate by path parameter |
| `clob.heartbeats.send` | `polymarket.api.clob.heartbeats.send` | `write` | Send heartbeat |
| `clob.heartbeats.sendV1` | `polymarket.api.clob.heartbeats.sendV1` | `write` | Send heartbeat (v1) |
| `clob.lastTradePrices.get` | `polymarket.api.clob.lastTradePrices.get` | `read` | Get last trade price |
| `clob.lastTradePrices.list` | `polymarket.api.clob.lastTradePrices.list` | `read` | Get last trade prices (query parameters) |
| `clob.lastTradePrices.listByBody` | `polymarket.api.clob.lastTradePrices.listByBody` | `read` | Get last trade prices (request body) |
| `clob.markets.get` | `polymarket.api.clob.markets.get` | `read` | Get CLOB market info |
| `clob.markets.getByToken` | `polymarket.api.clob.markets.getByToken` | `read` | Get market by token |
| `clob.markets.listSampling` | `polymarket.api.clob.markets.listSampling` | `read` | Get sampling markets |
| `clob.markets.listSamplingSimplified` | `polymarket.api.clob.markets.listSamplingSimplified` | `read` | Get sampling simplified markets |
| `clob.markets.listSimplified` | `polymarket.api.clob.markets.listSimplified` | `read` | Get simplified markets |
| `clob.markets.liveActivity` | `polymarket.api.clob.markets.liveActivity` | `read` | Get live activity markets by condition IDs |
| `clob.markets.liveActivityByCondition` | `polymarket.api.clob.markets.liveActivityByCondition` | `read` | Get live activity market by condition ID |
| `clob.midpoints.get` | `polymarket.api.clob.midpoints.get` | `read` | Get midpoint price |
| `clob.midpoints.list` | `polymarket.api.clob.midpoints.list` | `read` | Get midpoint prices (query parameters) |
| `clob.midpoints.listByBody` | `polymarket.api.clob.midpoints.listByBody` | `read` | Get midpoint prices (request body) |
| `clob.negRisk.get` | `polymarket.api.clob.negRisk.get` | `read` | Get negative risk flag |
| `clob.negRisk.getByToken` | `polymarket.api.clob.negRisk.getByToken` | `read` | Get negative risk flag by path parameter |
| `clob.notifications.list` | `polymarket.api.clob.notifications.list` | `read` | Get notifications |
| `clob.notifications.markRead` | `polymarket.api.clob.notifications.markRead` | `destructive` | Mark notifications as read |
| `clob.orders.cancel` | `polymarket.api.clob.orders.cancel` | `destructive` | Cancel single order |
| `clob.orders.cancelAll` | `polymarket.api.clob.orders.cancelAll` | `destructive` | Cancel all orders |
| `clob.orders.cancelMany` | `polymarket.api.clob.orders.cancelMany` | `destructive` | Cancel multiple orders |
| `clob.orders.cancelMarket` | `polymarket.api.clob.orders.cancelMarket` | `destructive` | Cancel orders for a market |
| `clob.orders.cancelWallet` | `polymarket.api.clob.orders.cancelWallet` | `destructive` | Cancel wallet orders |
| `clob.orders.create` | `polymarket.api.clob.orders.create` | `destructive` | Post a new order |
| `clob.orders.createMany` | `polymarket.api.clob.orders.createMany` | `destructive` | Post multiple orders |
| `clob.orders.get` | `polymarket.api.clob.orders.get` | `read` | Get single order by ID |
| `clob.orders.list` | `polymarket.api.clob.orders.list` | `read` | Get user orders |
| `clob.orders.listWalletOpen` | `polymarket.api.clob.orders.listWalletOpen` | `read` | Get wallet open orders |
| `clob.orderScoring.get` | `polymarket.api.clob.orderScoring.get` | `read` | Get order scoring status |
| `clob.orderScoring.list` | `polymarket.api.clob.orderScoring.list` | `read` | Get scoring status for multiple orders |
| `clob.orderScoring.listByBody` | `polymarket.api.clob.orderScoring.listByBody` | `read` | Get scoring status for multiple orders (POST) |
| `clob.prices.get` | `polymarket.api.clob.prices.get` | `read` | Get market price |
| `clob.prices.list` | `polymarket.api.clob.prices.list` | `read` | Get market prices (query parameters) |
| `clob.prices.listByBody` | `polymarket.api.clob.prices.listByBody` | `read` | Get market prices (request body) |
| `clob.pricesHistory.batch` | `polymarket.api.clob.pricesHistory.batch` | `read` | Get batch prices history |
| `clob.pricesHistory.get` | `polymarket.api.clob.pricesHistory.get` | `read` | Get prices history |
| `clob.rateLimitTier` | `polymarket.api.clob.rateLimitTier` | `read` | Get rate limit tier |
| `clob.rebates.current` | `polymarket.api.clob.rebates.current` | `read` | Get current rebated fees for a maker |
| `clob.rewards.current` | `polymarket.api.clob.rewards.current` | `read` | Get current active rewards configurations |
| `clob.rewards.market` | `polymarket.api.clob.rewards.market` | `read` | Get raw rewards for a specific market |
| `clob.rewards.markets` | `polymarket.api.clob.rewards.markets` | `read` | Get multiple markets with rewards |
| `clob.rewards.userEarnings` | `polymarket.api.clob.rewards.userEarnings` | `read` | Get earnings for user by date |
| `clob.rewards.userMarkets` | `polymarket.api.clob.rewards.userMarkets` | `read` | Get user earnings and markets configuration |
| `clob.rewards.userPercentages` | `polymarket.api.clob.rewards.userPercentages` | `read` | Get reward percentages for user |
| `clob.rewards.userTotalEarnings` | `polymarket.api.clob.rewards.userTotalEarnings` | `read` | Get total earnings for user by date |
| `clob.spreads.get` | `polymarket.api.clob.spreads.get` | `read` | Get spread |
| `clob.spreads.list` | `polymarket.api.clob.spreads.list` | `read` | Get spreads |
| `clob.tickSize.get` | `polymarket.api.clob.tickSize.get` | `read` | Get tick size |
| `clob.tickSize.getByToken` | `polymarket.api.clob.tickSize.getByToken` | `read` | Get tick size by path parameter |
| `clob.time` | `polymarket.api.clob.time` | `read` | Get server time |
| `clob.trades.list` | `polymarket.api.clob.trades.list` | `read` | Get trades |
| `clob.trades.listBuilder` | `polymarket.api.clob.trades.listBuilder` | `read` | Get builder trades |
| `combos.confirmations.submit` | `polymarket.api.combos.confirmations.submit` | `destructive` | Confirm or decline last look |
| `combos.markets.list` | `polymarket.api.combos.markets.list` | `read` | Get combo markets |
| `combos.quotes.cancel` | `polymarket.api.combos.quotes.cancel` | `destructive` | Cancel a quote |
| `combos.quotes.submit` | `polymarket.api.combos.quotes.submit` | `destructive` | Submit a quote |
| `data.activity.combos` | `polymarket.api.data.activity.combos` | `read` | List combo activity |
| `data.activity.list` | `polymarket.api.data.activity.list` | `read` | List account activity |
| `data.approvals` | `polymarket.api.data.approvals` | `read` | Get wallet approvals |
| `data.biggestWinners` | `polymarket.api.data.biggestWinners` | `read` | List the biggest wins |
| `data.builders.leaderboard` | `polymarket.api.data.builders.leaderboard` | `read` | Get the builders leaderboard |
| `data.builders.volume` | `polymarket.api.data.builders.volume` | `read` | Get builder volume over time |
| `data.holders` | `polymarket.api.data.holders` | `read` | List a market's top holders |
| `data.leaderboard` | `polymarket.api.data.leaderboard` | `read` | Get the trader leaderboard |
| `data.liveVolume` | `polymarket.api.data.liveVolume` | `read` | Get live volume for an event |
| `data.openInterest` | `polymarket.api.data.openInterest` | `read` | Get open interest |
| `data.positions.combos` | `polymarket.api.data.positions.combos` | `read` | List combo positions |
| `data.positions.list` | `polymarket.api.data.positions.list` | `read` | List positions for a user or market |
| `data.positions.snapshot` | `polymarket.api.data.positions.snapshot` | `read` | Snapshot a wallet's positions at the end of a day |
| `data.pricesHistory` | `polymarket.api.data.pricesHistory` | `read` | Get a token's price history |
| `data.resolutions` | `polymarket.api.data.resolutions` | `read` | Get resolution state |
| `data.status` | `polymarket.api.data.status` | `read` | Get data freshness |
| `data.tokens` | `polymarket.api.data.tokens` | `read` | Look up tokens |
| `data.trades` | `polymarket.api.data.trades` | `read` | List trades |
| `data.users.pnl` | `polymarket.api.data.users.pnl` | `read` | Get a user's PnL series |
| `data.users.stats` | `polymarket.api.data.users.stats` | `read` | Get a user's profile stats |
| `data.users.volume` | `polymarket.api.data.users.volume` | `read` | Get a user's trading volume |
| `data.value` | `polymarket.api.data.value` | `read` | Get portfolio value |
| `gamma.comments.get` | `polymarket.api.gamma.comments.get` | `read` | Get comment by ID |
| `gamma.comments.list` | `polymarket.api.gamma.comments.list` | `read` | List comments |
| `gamma.comments.listByUser` | `polymarket.api.gamma.comments.listByUser` | `read` | List comments by user |
| `gamma.comments.listKeyset` | `polymarket.api.gamma.comments.listKeyset` | `read` | List comments (keyset pagination) |
| `gamma.cryptoMarketConfigs.list` | `polymarket.api.gamma.cryptoMarketConfigs.list` | `read` | Get crypto market configs |
| `gamma.events.commentCount` | `polymarket.api.gamma.events.commentCount` | `read` | Get event comment count |
| `gamma.events.count` | `polymarket.api.gamma.events.count` | `read` | Count events |
| `gamma.events.creators.get` | `polymarket.api.gamma.events.creators.get` | `read` | Get event creator by ID |
| `gamma.events.creators.list` | `polymarket.api.gamma.events.creators.list` | `read` | List event creators |
| `gamma.events.externalPartners.get` | `polymarket.api.gamma.events.externalPartners.get` | `read` | Get event external partner by slug |
| `gamma.events.externalPartners.list` | `polymarket.api.gamma.events.externalPartners.list` | `read` | Get event external partners |
| `gamma.events.get` | `polymarket.api.gamma.events.get` | `read` | Get event by ID |
| `gamma.events.getByPartner` | `polymarket.api.gamma.events.getByPartner` | `read` | Get event by external partner |
| `gamma.events.getBySlug` | `polymarket.api.gamma.events.getBySlug` | `read` | Get event by slug |
| `gamma.events.insights` | `polymarket.api.gamma.events.insights` | `read` | Get event insights |
| `gamma.events.list` | `polymarket.api.gamma.events.list` | `read` | Get events |
| `gamma.events.listKeyset` | `polymarket.api.gamma.events.listKeyset` | `read` | Get events (keyset) |
| `gamma.events.listPaginated` | `polymarket.api.gamma.events.listPaginated` | `read` | Get events (paginated) |
| `gamma.events.premadeCombos` | `polymarket.api.gamma.events.premadeCombos` | `read` | Get event premade combos |
| `gamma.events.reference` | `polymarket.api.gamma.events.reference` | `read` | Get event reference by slug |
| `gamma.events.similar` | `polymarket.api.gamma.events.similar` | `read` | Get similar events |
| `gamma.events.sportResults` | `polymarket.api.gamma.events.sportResults` | `read` | Get sport event results |
| `gamma.events.tags` | `polymarket.api.gamma.events.tags` | `read` | Get tags for an event |
| `gamma.events.tweetCount` | `polymarket.api.gamma.events.tweetCount` | `read` | Get event tweet count |
| `gamma.facets.get` | `polymarket.api.gamma.facets.get` | `read` | Facet tree rooted at a facet |
| `gamma.facets.list` | `polymarket.api.gamma.facets.list` | `read` | Facet tree from the top-level facets |
| `gamma.feeTypes.events` | `polymarket.api.gamma.feeTypes.events` | `read` | Get events by fee type |
| `gamma.feeTypes.list` | `polymarket.api.gamma.feeTypes.list` | `read` | Get fee types |
| `gamma.games.get` | `polymarket.api.gamma.games.get` | `read` | Get game |
| `gamma.makerTiers.get` | `polymarket.api.gamma.makerTiers.get` | `read` | Get maker tiers for addresses |
| `gamma.makerTiers.ladder` | `polymarket.api.gamma.makerTiers.ladder` | `read` | Get the maker tier ladder |
| `gamma.marketClarifications.list` | `polymarket.api.gamma.marketClarifications.list` | `read` | Get market clarifications |
| `gamma.marketEstimateHistory.list` | `polymarket.api.gamma.marketEstimateHistory.list` | `read` | Get market estimate history |
| `gamma.markets.description` | `polymarket.api.gamma.markets.description` | `read` | Get market description |
| `gamma.markets.get` | `polymarket.api.gamma.markets.get` | `read` | Get market by ID |
| `gamma.markets.getBySlug` | `polymarket.api.gamma.markets.getBySlug` | `read` | Get market by slug |
| `gamma.markets.information` | `polymarket.api.gamma.markets.information` | `read` | Get markets information |
| `gamma.markets.list` | `polymarket.api.gamma.markets.list` | `read` | Get markets |
| `gamma.markets.listAbridged` | `polymarket.api.gamma.markets.listAbridged` | `read` | Get abridged markets |
| `gamma.markets.listAbridgedKeyset` | `polymarket.api.gamma.markets.listAbridgedKeyset` | `read` | Get abridged markets with keyset pagination |
| `gamma.markets.listKeyset` | `polymarket.api.gamma.markets.listKeyset` | `read` | Get markets (keyset) |
| `gamma.markets.related` | `polymarket.api.gamma.markets.related` | `read` | Get related markets |
| `gamma.markets.tags` | `polymarket.api.gamma.markets.tags` | `read` | Get tags for a market |
| `gamma.moderators.list` | `polymarket.api.gamma.moderators.list` | `read` | Get moderators |
| `gamma.partners.get` | `polymarket.api.gamma.partners.get` | `read` | Get partner by ID |
| `gamma.partners.list` | `polymarket.api.gamma.partners.list` | `read` | Get partners |
| `gamma.profiles.get` | `polymarket.api.gamma.profiles.get` | `read` | Get public profile |
| `gamma.profiles.getByAddress` | `polymarket.api.gamma.profiles.getByAddress` | `read` | Get public profile by user address |
| `gamma.profiles.list` | `polymarket.api.gamma.profiles.list` | `read` | Get public profiles for addresses |
| `gamma.readyz` | `polymarket.api.gamma.readyz` | `read` | Readiness check |
| `gamma.referralLeaderboard` | `polymarket.api.gamma.referralLeaderboard` | `read` | Get referral leaderboard |
| `gamma.search` | `polymarket.api.gamma.search` | `read` | Public search |
| `gamma.searchV2` | `polymarket.api.gamma.searchV2` | `read` | Public search (v2) |
| `gamma.series.commentCount` | `polymarket.api.gamma.series.commentCount` | `read` | Get series comment count |
| `gamma.series.get` | `polymarket.api.gamma.series.get` | `read` | Get series by ID |
| `gamma.series.list` | `polymarket.api.gamma.series.list` | `read` | Get series |
| `gamma.series.listKeyset` | `polymarket.api.gamma.series.listKeyset` | `read` | Get series (keyset) |
| `gamma.series.summary` | `polymarket.api.gamma.series.summary` | `read` | Get series summary by ID |
| `gamma.series.summaryBySlug` | `polymarket.api.gamma.series.summaryBySlug` | `read` | Get series summary by slug |
| `gamma.sports.externalPartners.get` | `polymarket.api.gamma.sports.externalPartners.get` | `read` | Get sport external partner by slug |
| `gamma.sports.externalPartners.list` | `polymarket.api.gamma.sports.externalPartners.list` | `read` | Get sport external partners |
| `gamma.sports.get` | `polymarket.api.gamma.sports.get` | `read` | Get sport metadata by ID |
| `gamma.sports.getByPartner` | `polymarket.api.gamma.sports.getByPartner` | `read` | Get sport by external partner |
| `gamma.sports.list` | `polymarket.api.gamma.sports.list` | `read` | Get sports |
| `gamma.sports.marketTypes` | `polymarket.api.gamma.sports.marketTypes` | `read` | Get sports market types |
| `gamma.sports.premadeCombos` | `polymarket.api.gamma.sports.premadeCombos` | `read` | Get league premade combos |
| `gamma.sports.summary` | `polymarket.api.gamma.sports.summary` | `read` | Get sports summary |
| `gamma.status` | `polymarket.api.gamma.status` | `read` | Get status |
| `gamma.tags.get` | `polymarket.api.gamma.tags.get` | `read` | Get tag by ID |
| `gamma.tags.getBySlug` | `polymarket.api.gamma.tags.getBySlug` | `read` | Get tag by slug |
| `gamma.tags.list` | `polymarket.api.gamma.tags.list` | `read` | List tags |
| `gamma.tags.related` | `polymarket.api.gamma.tags.related` | `read` | Get tags related to a tag |
| `gamma.tags.relatedBySlug` | `polymarket.api.gamma.tags.relatedBySlug` | `read` | Get tags related to a tag by slug |
| `gamma.tags.relations` | `polymarket.api.gamma.tags.relations` | `read` | Get related tags (raw relation rows) |
| `gamma.tags.relationsBySlug` | `polymarket.api.gamma.tags.relationsBySlug` | `read` | Get related tags by slug (raw relation rows) |
| `gamma.takerTiers.get` | `polymarket.api.gamma.takerTiers.get` | `read` | Get taker tiers for addresses |
| `gamma.takerTiers.ladder` | `polymarket.api.gamma.takerTiers.ladder` | `read` | Get the taker tier ladder |
| `gamma.teams.externalPartners.get` | `polymarket.api.gamma.teams.externalPartners.get` | `read` | Get team external partner by slug |
| `gamma.teams.externalPartners.list` | `polymarket.api.gamma.teams.externalPartners.list` | `read` | Get team external partners |
| `gamma.teams.get` | `polymarket.api.gamma.teams.get` | `read` | Get team by ID |
| `gamma.teams.getByPartner` | `polymarket.api.gamma.teams.getByPartner` | `read` | Get team by external partner |
| `gamma.teams.list` | `polymarket.api.gamma.teams.list` | `read` | Get teams |
| `gamma.terms.current` | `polymarket.api.gamma.terms.current` | `read` | Get the current ToS |
| `gamma.tournaments.get` | `polymarket.api.gamma.tournaments.get` | `read` | Get tournament by ID |
| `gamma.tournaments.list` | `polymarket.api.gamma.tournaments.list` | `read` | Get tournaments |
| `gamma.walletType` | `polymarket.api.gamma.walletType` | `read` | Get wallet type |
| `perps.account.applyReferral` | `polymarket.api.perps.account.applyReferral` | `write` | Apply Referral Code |
| `perps.account.approveBuilder` | `polymarket.api.perps.account.approveBuilder` | `destructive` | Approve or revoke builder fees with an account owner signature |
| `perps.account.autoCancel` | `polymarket.api.perps.account.autoCancel` | `read` | Get Auto-Cancel Status |
| `perps.account.backstops` | `polymarket.api.perps.account.backstops` | `read` | Get Account Backstop Transfers |
| `perps.account.balances` | `polymarket.api.perps.account.balances` | `read` | Get Balances |
| `perps.account.builderApprovals` | `polymarket.api.perps.account.builderApprovals` | `read` | Read builder approvals, including retained revoked versions |
| `perps.account.builderEarnings` | `polymarket.api.perps.account.builderEarnings` | `read` | Get authenticated builder receipts |
| `perps.account.builderEarningsSummary` | `polymarket.api.perps.account.builderEarningsSummary` | `read` | Get authenticated builder settled earnings summary |
| `perps.account.config` | `polymarket.api.perps.account.config` | `read` | Get Instrument Config |
| `perps.account.createInvite` | `polymarket.api.perps.account.createInvite` | `write` | Create Account Invite |
| `perps.account.credentials` | `polymarket.api.perps.account.credentials` | `read` | Get Credentials |
| `perps.account.deposits` | `polymarket.api.perps.account.deposits` | `read` | Get Deposits |
| `perps.account.equity` | `polymarket.api.perps.account.equity` | `read` | Get Equity |
| `perps.account.fills` | `polymarket.api.perps.account.fills` | `read` | Get Fills |
| `perps.account.funding` | `polymarket.api.perps.account.funding` | `read` | Get Funding Charges |
| `perps.account.internalTransfer` | `polymarket.api.perps.account.internalTransfer` | `destructive` | Internal Transfer |
| `perps.account.internalTransfers` | `polymarket.api.perps.account.internalTransfers` | `read` | Get Internal Transfers |
| `perps.account.limits` | `polymarket.api.perps.account.limits` | `read` | Get Account Limits |
| `perps.account.markNotificationsRead` | `polymarket.api.perps.account.markNotificationsRead` | `write` | Mark Notifications Read |
| `perps.account.notifications` | `polymarket.api.perps.account.notifications` | `read` | Get Notifications |
| `perps.account.openOrders` | `polymarket.api.perps.account.openOrders` | `read` | Get Open Orders |
| `perps.account.orders` | `polymarket.api.perps.account.orders` | `read` | Get Orders |
| `perps.account.pnl` | `polymarket.api.perps.account.pnl` | `read` | Get PnL |
| `perps.account.portfolio` | `polymarket.api.perps.account.portfolio` | `read` | Get Portfolio |
| `perps.account.referral` | `polymarket.api.perps.account.referral` | `read` | Get Account Referral |
| `perps.account.rewards` | `polymarket.api.perps.account.rewards` | `read` | Get Account Rewards |
| `perps.account.stats` | `polymarket.api.perps.account.stats` | `read` | Get Account Stats |
| `perps.account.updateBuilder` | `polymarket.api.perps.account.updateBuilder` | `write` | Update your builder display name |
| `perps.account.withdraw` | `polymarket.api.perps.account.withdraw` | `destructive` | Withdraw |
| `perps.account.withdrawals` | `polymarket.api.perps.account.withdrawals` | `read` | Get Withdrawals |
| `perps.assets` | `polymarket.api.perps.assets` | `read` | Get Collateral Assets |
| `perps.bbo` | `polymarket.api.perps.bbo` | `read` | Get BBO |
| `perps.blp.enroll` | `polymarket.api.perps.blp.enroll` | `destructive` | Set BLP Instrument Subscription |
| `perps.blp.enrollment` | `polymarket.api.perps.blp.enrollment` | `read` | Get BLP Enrollment |
| `perps.blp.liquidations` | `polymarket.api.perps.blp.liquidations` | `read` | List BLP Liquidations |
| `perps.book` | `polymarket.api.perps.book` | `read` | Get Book |
| `perps.builder` | `polymarket.api.perps.builder` | `read` | Get builder profile and eligibility |
| `perps.competitions.account` | `polymarket.api.perps.competitions.account` | `read` | Get Trading Competition Account |
| `perps.competitions.get` | `polymarket.api.perps.competitions.get` | `read` | Get Trading Competition |
| `perps.competitions.leaderboard` | `polymarket.api.perps.competitions.leaderboard` | `read` | Get Trading Competition Leaderboard |
| `perps.competitions.list` | `polymarket.api.perps.competitions.list` | `read` | Get Trading Competitions |
| `perps.competitions.widget` | `polymarket.api.perps.competitions.widget` | `read` | Get Trading Competition Widget |
| `perps.exchange` | `polymarket.api.perps.exchange` | `read` | Get Exchange Info |
| `perps.exchangeStatistics` | `polymarket.api.perps.exchangeStatistics` | `read` | Get Exchange Statistics |
| `perps.fees` | `polymarket.api.perps.fees` | `read` | Get Fees |
| `perps.fundingHistory` | `polymarket.api.perps.fundingHistory` | `read` | Get Historical Funding |
| `perps.index` | `polymarket.api.perps.index` | `read` | Get Index |
| `perps.instruments` | `polymarket.api.perps.instruments` | `read` | Get Instruments |
| `perps.inviteCode` | `polymarket.api.perps.inviteCode` | `read` | Check Invite Code |
| `perps.klines` | `polymarket.api.perps.klines` | `read` | Get Klines |
| `perps.leaderboard` | `polymarket.api.perps.leaderboard` | `read` | Get Leaderboard |
| `perps.leverage.update` | `polymarket.api.perps.leverage.update` | `destructive` | Update Leverage |
| `perps.leverage.updateMany` | `polymarket.api.perps.leverage.updateMany` | `destructive` | Update Leverage for Multiple Instruments |
| `perps.limitTiers` | `polymarket.api.perps.limitTiers` | `read` | Get Limit Tiers |
| `perps.margin.update` | `polymarket.api.perps.margin.update` | `destructive` | Update Isolated Margin |
| `perps.markHistory` | `polymarket.api.perps.markHistory` | `read` | Get Mark Price History |
| `perps.orders.cancel` | `polymarket.api.perps.orders.cancel` | `destructive` | Cancel Orders |
| `perps.orders.cancelAll` | `polymarket.api.perps.orders.cancelAll` | `destructive` | Cancel All Orders |
| `perps.orders.cancelByClientId` | `polymarket.api.perps.orders.cancelByClientId` | `destructive` | Cancel Orders COID |
| `perps.orders.create` | `polymarket.api.perps.orders.create` | `destructive` | Create Orders |
| `perps.orders.modify` | `polymarket.api.perps.orders.modify` | `destructive` | Modify Orders |
| `perps.orders.modifyByClientId` | `polymarket.api.perps.orders.modifyByClientId` | `destructive` | Modify Orders COID |
| `perps.orders.setAutoCancel` | `polymarket.api.perps.orders.setAutoCancel` | `write` | Set Auto-Cancel |
| `perps.ping` | `polymarket.api.perps.ping` | `read` | Test Connection |
| `perps.proxy.create` | `polymarket.api.perps.proxy.create` | `destructive` | Create Proxy |
| `perps.proxy.delete` | `polymarket.api.perps.proxy.delete` | `destructive` | Delete Proxy |
| `perps.public.fills` | `polymarket.api.perps.public.fills` | `read` | Get Public Fills |
| `perps.public.portfolio` | `polymarket.api.perps.public.portfolio` | `read` | Get Public Portfolio |
| `perps.public.positionFills` | `polymarket.api.perps.public.positionFills` | `read` | Get Current Position Fills |
| `perps.public.positionSnapshots` | `polymarket.api.perps.public.positionSnapshots` | `read` | Get Position Share Card Snapshots |
| `perps.registered` | `polymarket.api.perps.registered` | `read` | Get Registration |
| `perps.statistics` | `polymarket.api.perps.statistics` | `read` | Get Statistics |
| `perps.tickers` | `polymarket.api.perps.tickers` | `read` | Get Tickers |
| `perps.time` | `polymarket.api.perps.time` | `read` | Get Server Time |
| `perps.trades` | `polymarket.api.perps.trades` | `read` | Get Recent Trades |
| `relayer.apiKeys.list` | `polymarket.api.relayer.apiKeys.list` | `read` | Get all relayer API keys |
| `relayer.deployed` | `polymarket.api.relayer.deployed` | `read` | Check if a wallet is deployed |
| `relayer.nonce` | `polymarket.api.relayer.nonce` | `read` | Get current nonce for a user |
| `relayer.relayPayload` | `polymarket.api.relayer.relayPayload` | `read` | Get relayer address and nonce |
| `relayer.transactions.get` | `polymarket.api.relayer.transactions.get` | `read` | Get a transaction by ID |
| `relayer.transactions.list` | `polymarket.api.relayer.transactions.list` | `read` | Get recent transactions for a user |
| `relayer.transactions.submit` | `polymarket.api.relayer.transactions.submit` | `destructive` | Submit a transaction |
| `rfq.health` | `polymarket.api.rfq.health` | `read` | Liveness probe |
| `rfq.priceBand` | `polymarket.api.rfq.priceBand` | `read` | Get a market's price band |
| `rfq.ready` | `polymarket.api.rfq.ready` | `read` | Readiness probe |
| `rfq.time` | `polymarket.api.rfq.time` | `read` | Get the server clock |
| `rfq.trades.get` | `polymarket.api.rfq.trades.get` | `read` | Get a trade's status |
| `rfq.trades.prepare` | `polymarket.api.rfq.trades.prepare` | `write` | Build both orders to sign |
| `rfq.trades.submit` | `polymarket.api.rfq.trades.submit` | `destructive` | Submit a signed RFQ trade |
| `rfq.trades.validate` | `polymarket.api.rfq.trades.validate` | `read` | Pre-flight proposed terms |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/polymarket

## License

Apache-2.0
