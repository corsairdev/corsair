// Generated from Polymarket's OpenAPI specs (docs.polymarket.com API reference,
// fetched 2026-11-27); polymarket-manifest.json is the same contract as JSON.
// Inputs are the parameters and body fields in one object. Outputs
// make every field optional and nullable and keep unknown fields, matching how
// the zod output schemas parse. Regenerate rather than edit.

export type PolymarketJsonValue =
	| null
	| boolean
	| number
	| string
	| PolymarketJsonValue[]
	| { [key: string]: PolymarketJsonValue | undefined };

export const POLYMARKET_OPERATION_IDS = [
	'bridge.deposit',
	'bridge.quote',
	'bridge.status',
	'bridge.supportedAssets',
	'bridge.withdraw',
	'clob.apiKeys.create',
	'clob.apiKeys.delete',
	'clob.apiKeys.derive',
	'clob.apiKeys.list',
	'clob.balanceAllowance.get',
	'clob.balanceAllowance.refresh',
	'clob.balanceAllowance.update',
	'clob.books.get',
	'clob.books.list',
	'clob.books.listByBody',
	'clob.builderApiKeys.create',
	'clob.builderApiKeys.list',
	'clob.builderApiKeys.revoke',
	'clob.closedOnlyMode',
	'clob.feeRate.get',
	'clob.feeRate.getByToken',
	'clob.heartbeats.send',
	'clob.heartbeats.sendV1',
	'clob.lastTradePrices.get',
	'clob.lastTradePrices.list',
	'clob.lastTradePrices.listByBody',
	'clob.markets.get',
	'clob.markets.getByToken',
	'clob.markets.listSampling',
	'clob.markets.listSamplingSimplified',
	'clob.markets.listSimplified',
	'clob.markets.liveActivity',
	'clob.markets.liveActivityByCondition',
	'clob.midpoints.get',
	'clob.midpoints.list',
	'clob.midpoints.listByBody',
	'clob.negRisk.get',
	'clob.negRisk.getByToken',
	'clob.notifications.list',
	'clob.notifications.markRead',
	'clob.orderScoring.get',
	'clob.orderScoring.list',
	'clob.orderScoring.listByBody',
	'clob.orders.cancel',
	'clob.orders.cancelAll',
	'clob.orders.cancelMany',
	'clob.orders.cancelMarket',
	'clob.orders.cancelWallet',
	'clob.orders.create',
	'clob.orders.createMany',
	'clob.orders.get',
	'clob.orders.list',
	'clob.orders.listWalletOpen',
	'clob.prices.get',
	'clob.prices.list',
	'clob.prices.listByBody',
	'clob.pricesHistory.batch',
	'clob.pricesHistory.get',
	'clob.rateLimitTier',
	'clob.rebates.current',
	'clob.rewards.current',
	'clob.rewards.market',
	'clob.rewards.markets',
	'clob.rewards.userEarnings',
	'clob.rewards.userMarkets',
	'clob.rewards.userPercentages',
	'clob.rewards.userTotalEarnings',
	'clob.spreads.get',
	'clob.spreads.list',
	'clob.tickSize.get',
	'clob.tickSize.getByToken',
	'clob.time',
	'clob.trades.list',
	'clob.trades.listBuilder',
	'combos.confirmations.submit',
	'combos.markets.list',
	'combos.quotes.cancel',
	'combos.quotes.submit',
	'data.activity.combos',
	'data.activity.list',
	'data.approvals',
	'data.biggestWinners',
	'data.builders.leaderboard',
	'data.builders.volume',
	'data.holders',
	'data.leaderboard',
	'data.liveVolume',
	'data.openInterest',
	'data.positions.combos',
	'data.positions.list',
	'data.positions.snapshot',
	'data.pricesHistory',
	'data.resolutions',
	'data.status',
	'data.tokens',
	'data.trades',
	'data.users.pnl',
	'data.users.stats',
	'data.users.volume',
	'data.value',
	'gamma.comments.get',
	'gamma.comments.list',
	'gamma.comments.listByUser',
	'gamma.comments.listKeyset',
	'gamma.cryptoMarketConfigs.list',
	'gamma.events.commentCount',
	'gamma.events.count',
	'gamma.events.creators.get',
	'gamma.events.creators.list',
	'gamma.events.externalPartners.get',
	'gamma.events.externalPartners.list',
	'gamma.events.get',
	'gamma.events.getByPartner',
	'gamma.events.getBySlug',
	'gamma.events.insights',
	'gamma.events.list',
	'gamma.events.listKeyset',
	'gamma.events.listPaginated',
	'gamma.events.premadeCombos',
	'gamma.events.reference',
	'gamma.events.similar',
	'gamma.events.sportResults',
	'gamma.events.tags',
	'gamma.events.tweetCount',
	'gamma.facets.get',
	'gamma.facets.list',
	'gamma.feeTypes.events',
	'gamma.feeTypes.list',
	'gamma.games.get',
	'gamma.makerTiers.get',
	'gamma.makerTiers.ladder',
	'gamma.marketClarifications.list',
	'gamma.marketEstimateHistory.list',
	'gamma.markets.description',
	'gamma.markets.get',
	'gamma.markets.getBySlug',
	'gamma.markets.information',
	'gamma.markets.list',
	'gamma.markets.listAbridged',
	'gamma.markets.listAbridgedKeyset',
	'gamma.markets.listKeyset',
	'gamma.markets.related',
	'gamma.markets.tags',
	'gamma.moderators.list',
	'gamma.partners.get',
	'gamma.partners.list',
	'gamma.profiles.get',
	'gamma.profiles.getByAddress',
	'gamma.profiles.list',
	'gamma.readyz',
	'gamma.referralLeaderboard',
	'gamma.search',
	'gamma.searchV2',
	'gamma.series.commentCount',
	'gamma.series.get',
	'gamma.series.list',
	'gamma.series.listKeyset',
	'gamma.series.summary',
	'gamma.series.summaryBySlug',
	'gamma.sports.externalPartners.get',
	'gamma.sports.externalPartners.list',
	'gamma.sports.get',
	'gamma.sports.getByPartner',
	'gamma.sports.list',
	'gamma.sports.marketTypes',
	'gamma.sports.premadeCombos',
	'gamma.sports.summary',
	'gamma.status',
	'gamma.tags.get',
	'gamma.tags.getBySlug',
	'gamma.tags.list',
	'gamma.tags.related',
	'gamma.tags.relatedBySlug',
	'gamma.tags.relations',
	'gamma.tags.relationsBySlug',
	'gamma.takerTiers.get',
	'gamma.takerTiers.ladder',
	'gamma.teams.externalPartners.get',
	'gamma.teams.externalPartners.list',
	'gamma.teams.get',
	'gamma.teams.getByPartner',
	'gamma.teams.list',
	'gamma.terms.current',
	'gamma.tournaments.get',
	'gamma.tournaments.list',
	'gamma.walletType',
	'perps.account.applyReferral',
	'perps.account.approveBuilder',
	'perps.account.autoCancel',
	'perps.account.backstops',
	'perps.account.balances',
	'perps.account.builderApprovals',
	'perps.account.builderEarnings',
	'perps.account.builderEarningsSummary',
	'perps.account.config',
	'perps.account.createInvite',
	'perps.account.credentials',
	'perps.account.deposits',
	'perps.account.equity',
	'perps.account.fills',
	'perps.account.funding',
	'perps.account.internalTransfer',
	'perps.account.internalTransfers',
	'perps.account.limits',
	'perps.account.markNotificationsRead',
	'perps.account.notifications',
	'perps.account.openOrders',
	'perps.account.orders',
	'perps.account.pnl',
	'perps.account.portfolio',
	'perps.account.referral',
	'perps.account.rewards',
	'perps.account.stats',
	'perps.account.updateBuilder',
	'perps.account.withdraw',
	'perps.account.withdrawals',
	'perps.assets',
	'perps.bbo',
	'perps.blp.enroll',
	'perps.blp.enrollment',
	'perps.blp.liquidations',
	'perps.book',
	'perps.builder',
	'perps.competitions.account',
	'perps.competitions.get',
	'perps.competitions.leaderboard',
	'perps.competitions.list',
	'perps.competitions.widget',
	'perps.exchange',
	'perps.exchangeStatistics',
	'perps.fees',
	'perps.fundingHistory',
	'perps.index',
	'perps.instruments',
	'perps.inviteCode',
	'perps.klines',
	'perps.leaderboard',
	'perps.leverage.update',
	'perps.leverage.updateMany',
	'perps.limitTiers',
	'perps.margin.update',
	'perps.markHistory',
	'perps.orders.cancel',
	'perps.orders.cancelAll',
	'perps.orders.cancelByClientId',
	'perps.orders.create',
	'perps.orders.modify',
	'perps.orders.modifyByClientId',
	'perps.orders.setAutoCancel',
	'perps.ping',
	'perps.proxy.create',
	'perps.proxy.delete',
	'perps.public.fills',
	'perps.public.portfolio',
	'perps.public.positionFills',
	'perps.public.positionSnapshots',
	'perps.registered',
	'perps.statistics',
	'perps.tickers',
	'perps.time',
	'perps.trades',
	'relayer.apiKeys.list',
	'relayer.deployed',
	'relayer.nonce',
	'relayer.relayPayload',
	'relayer.transactions.get',
	'relayer.transactions.list',
	'relayer.transactions.submit',
	'rfq.health',
	'rfq.priceBand',
	'rfq.ready',
	'rfq.time',
	'rfq.trades.get',
	'rfq.trades.prepare',
	'rfq.trades.submit',
	'rfq.trades.validate',
] as const;

export type PolymarketOperationId = (typeof POLYMARKET_OPERATION_IDS)[number];

/** Ethereum address (0x-prefixed, 40 hex chars) */
export type PolymarketBridgeAddressInput = string;

export type PolymarketClobBookRequestInput = {
	/** Token ID (asset ID) */
	token_id: string;
	/** Order side (optional, not used for midpoint calculation) */
	side?: 'BUY' | 'SELL';
};

/** Set exactly one field. The server deduplicates order_ids. */
export type PolymarketClobCancelWalletOrdersPayloadInput =
	| {
			order_ids: Array<string>;
	  }
	| {
			/** Cancel every order resting on the wallet */
			all: boolean;
	  };

/** Order payload submitted to the CLOB API. In CLOB V2, `expiration` remains in the POST /order wire body for GTD/order-expiry handling, but it is not part of the EIP-712 signed order struct. */
export type PolymarketClobOrderInput = {
	/** Ethereum address of the maker (In the default case, this is your proxy address) */
	maker: string;
	/** Ethereum address of the signer */
	signer: string;
	/** Token ID (asset ID) for the order */
	tokenId: string;
	/** Amount the maker is providing in fixed-math with 6 decimals */
	makerAmount: string;
	/** Amount the taker is providing in fixed-math with 6 decimals */
	takerAmount: string;
	/** Order side */
	side: 'BUY' | 'SELL';
	/** Unix timestamp when the order expires. Present in the API wire body; not part of the CLOB V2 EIP-712 signed order struct. */
	expiration: string;
	/** Unix timestamp in milliseconds when the order was created (used for order uniqueness) */
	timestamp: string;
	/** Reserved for future use */
	metadata?: string;
	/** Builder code (bytes32) for integrator attribution. `0x` + 64 hex chars or empty. */
	builder: string;
	/** Cryptographic signature of the order */
	signature: string;
	/** Random salt for order uniqueness */
	salt: number;
	/** Type of signature (0 = EOA, 1 = POLY_PROXY, 2 = POLY_GNOSIS_SAFE, 3 = POLY_1271) */
	signatureType: 0 | 1 | 2 | 3;
};

export type PolymarketClobSendOrderInput = {
	order: PolymarketClobOrderInput;
	/** UUID of the API key owner */
	owner: string;
	/** Time in force */
	orderType?: 'GTC' | 'FOK' | 'GTD' | 'FAK';
	/** Whether to defer execution */
	deferExec?: boolean;
	/** Whether the order must rest on the book and not match immediately. Only supported for GTC and GTD orders. */
	postOnly?: boolean;
};

/** Signed Exchange v3 order. Combinatorial RFQ trades settle through Exchange v3. */
export type PolymarketCombosExchangeV3OrderInput = {
	/** Order salt (uint256 as a decimal string) */
	salt: string;
	/** Wallet that funds the order */
	maker: string;
	/** Address that signs the order */
	signer: string;
	/** YES or NO combo position ID (uint256 as a decimal string) */
	tokenId: string;
	/** Amount the maker pays, in six-decimal base units (uint256 as a string) */
	makerAmount: string;
	/** Amount the maker receives, in six-decimal base units (uint256 as a string) */
	takerAmount: string;
	/** Order side — `0` BUY, `1` SELL */
	side: 0 | 1;
	signatureType: PolymarketCombosSignatureTypeInput;
	/** Order timestamp in Unix seconds (as a string) */
	timestamp: string;
	/** 32-byte hex field; defaults to the zero value */
	metadata?: string;
	/** 32-byte hex field; defaults to the zero value */
	builder?: string;
	/** EIP-712 signature over the order */
	signature: string;
};

/** CLOB signature type: - `0` EOA - `1` POLY_PROXY - `2` GNOSIS_SAFE - `3` POLY_1271 */
export type PolymarketCombosSignatureTypeInput = 0 | 1 | 2 | 3;

/** Saved builder terms. Address is the registered Perps account, and fee_rate is an additional fraction of executed notional. Terms survive approval revocation for existing orders. */
export type PolymarketPerpsBuilderInput = {
	address: PolymarketPerpsAddressInput;
	fee_rate: PolymarketPerpsBuilderFeeRateInput;
};

export type PolymarketPerpsCreateInviteRequestInput = Record<
	string,
	PolymarketJsonValue
>;

export type PolymarketPerpsCreateOrderInput = {
	iid: PolymarketPerpsIidInput;
	buy: PolymarketPerpsBuyInput;
	p?: PolymarketPerpsPInput;
	qty: PolymarketPerpsQtyInput;
	tif?: PolymarketPerpsTifInput;
	po?: PolymarketPerpsPoInput;
	ro?: PolymarketPerpsRoInput;
	c?: PolymarketPerpsCoidInput;
	/** Optional trigger attached to this order. */
	tr?: {
		market?: PolymarketPerpsMarketInput;
		trp?: PolymarketPerpsTrpInput;
		tpsl?: PolymarketPerpsTpslInput;
	};
	builder?: PolymarketPerpsBuilderInput;
};

export type PolymarketPerpsModifyOrderInput = {
	oid: PolymarketPerpsOidInput;
	p: PolymarketPerpsPInput;
	qty: PolymarketPerpsQtyInput;
};

export type PolymarketPerpsModifyOrderByCoidInput = {
	coid: PolymarketPerpsCoidInput;
	p: PolymarketPerpsPInput;
	qty: PolymarketPerpsQtyInput;
};

export type PolymarketPerpsNotificationsReadRequestInput =
	| {
			/** Notification ids to mark read. */
			ids: Array<PolymarketPerpsNotifIdInput>;
	  }
	| {
			/** Pagination cursor. Marks every notification at or before this point as read. */
			before: string;
	  };

export type PolymarketPerpsOpApproveBuilderInput = {
	type: 'approveBuilder';
	args: {
		builder: PolymarketPerpsAddressInput;
		max_fee_rate: PolymarketPerpsBuilderFeeRateInput;
		approval_version: PolymarketPerpsBuilderApprovalVersionInput;
	};
};

export type PolymarketPerpsOpAutoCancelInput = {
	type: 'autoCancel';
	args: {
		time: PolymarketPerpsTime2Input;
	};
};

export type PolymarketPerpsOpCancelAllInput = {
	type: 'cancelAll';
	/** Optional cancel scope. When `iid` is provided, only open orders for that instrument are canceled. When omitted, all open orders for the signing account are canceled. */
	args: {
		iid?: PolymarketPerpsIidInput;
	};
};

export type PolymarketPerpsOpCancelOrdersInput = {
	type: 'cancelOrders';
	/** Array of order IDs to cancel. Cancelling an order that has attached take-profit / stop-loss children (see `CreateOrder.tr`) cascades to those children — they are cancelled with reason `ParentCancelled`. */
	args: Array<PolymarketPerpsOidInput>;
};

export type PolymarketPerpsOpCancelOrdersByCoidInput = {
	type: 'cancelOrdersCOID';
	/** Array of client order IDs to cancel. Cancelling an order that has attached take-profit / stop-loss children (see `CreateOrder.tr`) cascades to those children — they are cancelled with reason `ParentCancelled`. */
	args: Array<PolymarketPerpsCoidInput>;
};

export type PolymarketPerpsOpCreateOrdersInput = {
	type: 'createOrders';
	args: Array<PolymarketPerpsCreateOrderInput>;
	grp?: PolymarketPerpsGrpInput;
};

export type PolymarketPerpsOpCreateProxyInput = {
	type: 'createProxy';
	args: {
		owner: PolymarketPerpsOwnerInput;
		proxy: PolymarketPerpsProxyInput;
		expiry: PolymarketPerpsExpiryInput;
	};
};

export type PolymarketPerpsOpDeleteProxyInput = {
	type: 'deleteProxy';
	args: {
		proxy: PolymarketPerpsProxyInput;
	};
};

export type PolymarketPerpsOpInternalTransferInput = {
	type: 'internalTransfer';
	args: {
		account: PolymarketPerpsAccountInput;
		token: PolymarketPerpsTokenInput;
		amount: PolymarketPerpsAmountInput;
		to: PolymarketPerpsToInput;
	};
};

export type PolymarketPerpsOpModifyOrdersInput = {
	type: 'modifyOrders';
	args: Array<PolymarketPerpsModifyOrderInput>;
};

export type PolymarketPerpsOpModifyOrdersByCoidInput = {
	type: 'modifyOrdersCOID';
	args: Array<PolymarketPerpsModifyOrderByCoidInput>;
};

export type PolymarketPerpsOpUpdateLeverageInput = {
	type: 'updateLeverage';
	args: {
		iid: PolymarketPerpsIidInput;
		lev: PolymarketPerpsLevInput;
		cross: PolymarketPerpsCrossInput;
	};
};

export type PolymarketPerpsOpUpdateLeveragesInput = {
	type: 'updateLeverages';
	args: Array<PolymarketPerpsOpUpdateLeveragesArgsItemInput>;
};

export type PolymarketPerpsOpUpdateLeveragesArgsItemInput = {
	iid: PolymarketPerpsIidInput;
	lev: PolymarketPerpsLevInput;
	cross: PolymarketPerpsCrossInput;
};

export type PolymarketPerpsOpUpdateMarginInput = {
	type: 'updateMargin';
	args: {
		iid: PolymarketPerpsIidInput;
		amt: PolymarketPerpsMarginAmountInput;
	};
};

export type PolymarketPerpsOpWithdrawInput = {
	type: 'withdraw';
	args: {
		account: PolymarketPerpsAccountInput;
		token: PolymarketPerpsTokenInput;
		amount: PolymarketPerpsOpAmountInput;
		to: PolymarketPerpsToInput;
	};
};

export type PolymarketPerpsPositionSnapshotFillInput = {
	instrument_id: number;
	/** Decimal UInt64 trade ID from the public fills API. */
	trade_id: string;
	/** Public fill timestamp in Unix milliseconds. */
	timestamp: number;
};

/** Account address in hex format */
export type PolymarketPerpsAccountInput = string;

/** Pass the last row id from the previous page as a decimal string. The server resolves its exact timestamp within the authenticated account. An opaque URL-safe unpadded base64 JSON cursor with ts (native nanoseconds) and id is also accepted. Keep the timestamp window unchanged when paging. */
export type PolymarketPerpsAccountBackstopsCursorInput = string;

/** Address */
export type PolymarketPerpsAddressInput = string;

/** Token amount in decimal units (e.g. "100" for 100 USDC). */
export type PolymarketPerpsAmountInput = string;

/** Asset name */
export type PolymarketPerpsAsset2Input = string;

/** True subscribes the account to the instrument, false unsubscribes it. */
export type PolymarketPerpsBlpActiveInput = boolean;

/** Pagination cursor. Pass the liquidation ID of the last record from the previous page to fetch the next page. Paging follows the `sort` direction (strictly older records when `sort=desc`, strictly newer when `sort=asc`). */
export type PolymarketPerpsBlpCursorInput = number;

/** Time sort direction. `desc` (default) returns the most recent liquidations first; `asc` returns the oldest first. */
export type PolymarketPerpsBlpSortInput = 'desc' | 'asc';

/** Exactly the previous version plus one, starting at 1. Revocation retains the version and prevents signed approval replay. */
export type PolymarketPerpsBuilderApprovalVersionInput = number;

/** Additional builder fee as a decimal fraction of executed notional, from 0 through 0.001 (10 basis points). Zero approval revokes future admission. Never a percentage string. */
export type PolymarketPerpsBuilderFeeRateInput = string;

/** Is buy */
export type PolymarketPerpsBuyInput = boolean;

/** Instrument category */
export type PolymarketPerpsCategoryInput =
	| 'equity'
	| 'commodity'
	| 'index'
	| 'crypto';

/** Referral or invite code */
export type PolymarketPerpsCodeInput = string;

/** Client order ID */
export type PolymarketPerpsCoidInput = string;

/** Trading competition ID */
export type PolymarketPerpsCompetitionIdInput = number;

/** List the traders still short of the entry gate after the ranked board. Ignored for a lottery or raffle board. */
export type PolymarketPerpsCompetitionIncludeUnqualifiedInput = boolean;

/** Whether to use cross margin mode */
export type PolymarketPerpsCrossInput = boolean;

/** Pagination cursor. Pass the opaque `cursor` returned by the previous page to fetch the next page. Paging follows the `sort` direction (strictly older fills when `sort=desc`, strictly newer when `sort=asc`). The trade ID of the last fill from the previous page is also accepted for backwards… */
export type PolymarketPerpsCursorInput = string;

/** UTC reward period end date in YYYY-MM-DD format */
export type PolymarketPerpsDateInput = string;

/** Deposit status */
export type PolymarketPerpsDepositStatusInput =
	| 'pending'
	| 'confirmed'
	| 'removed';

/** Number of book levels to return */
export type PolymarketPerpsDepthInput = 10 | 100 | 500 | 1000;

/** Transfer direction relative to the authenticated account */
export type PolymarketPerpsDirectionInput = 'in' | 'out';

/** Inclusive UTC end date in YYYY-MM-DD format */
export type PolymarketPerpsEndDateInput = string;

/** End timestamp in milliseconds */
export type PolymarketPerpsEndTimestampInput = number;

/** Command-processing deadline in Unix milliseconds, not an order auto-cancel time; the server caps it at now + 5 s, clamps larger values to that cap, and uses that 5 s default when omitted. Values at or before the server's clock are rejected with HTTP 400 (command expired). */
export type PolymarketPerpsExpInput = number;

/** Expiry timestamp in milliseconds */
export type PolymarketPerpsExpiryInput = number;

/** Opaque keyset pagination cursor for the next page of fills. Present while `more` is true; pass it as `cursor` on the next request, keeping the other parameters the same across pages. */
export type PolymarketPerpsFillsCursorInput = string;

/** TPSL grouping */
export type PolymarketPerpsGrpInput = 'order' | 'position';

/** On-chain transaction hash, "0x" if not yet mined */
export type PolymarketPerpsHashInput = string;

/** Instrument ID */
export type PolymarketPerpsIidInput = number;

/** Instrument ID */
export type PolymarketPerpsInstrumentIdInput = number;

/** Instrument type */
export type PolymarketPerpsInstrumentTypeInput = 'perpetual';

/** Kline interval */
export type PolymarketPerpsIntervalInput =
	| '1s'
	| '1m'
	| '5m'
	| '15m'
	| '30m'
	| '1h'
	| '4h'
	| '6h'
	| '12h'
	| '1d'
	| '1w';

/** Human-readable label for a proxy key or internal transfer */
export type PolymarketPerpsLabelInput = string;

/** Leverage */
export type PolymarketPerpsLevInput = number;

/** Maximum number of entries to return */
export type PolymarketPerpsLimitInput = number;

/** Signed isolated-margin adjustment in the instrument quote asset. Positive values add allocation; negative values remove it. */
export type PolymarketPerpsMarginAmountInput = string;

/** Whether the trigger executes as a market order */
export type PolymarketPerpsMarketInput = boolean;

/** Opaque pagination cursor. Pass the next_cursor value from the previous page to fetch the next, older page. Null when there are no more pages. */
export type PolymarketPerpsNotifCursorInput = string | null;

/** Stable notification id. The same notification always has the same id on the WebSocket feed and in the notifications history, so you can safely deduplicate across the two. */
export type PolymarketPerpsNotifIdInput = string;

/** Number of entries to skip */
export type PolymarketPerpsOffsetInput = number;

/** Order ID */
export type PolymarketPerpsOidInput = number;

/** Raw token amount in base units, matching the uint256 amount in the EIP-712 signature (e.g. "100000000" for 100 USDC with 6 decimals). */
export type PolymarketPerpsOpAmountInput = string;

/** Order ID */
export type PolymarketPerpsOrderIdInput = number;

/** Owner address in hex format */
export type PolymarketPerpsOwnerInput = string;

/** Price */
export type PolymarketPerpsPInput = string;

/** PnL interval */
export type PolymarketPerpsPnlIntervalInput = '1h' | '4h' | '1d' | '1w';

/** Post only */
export type PolymarketPerpsPoInput = boolean;

/** Proxy address in hex format */
export type PolymarketPerpsProxyInput = string;

/** Quantity in no. of contracts */
export type PolymarketPerpsQtyInput = string;

/** Reduce only */
export type PolymarketPerpsRoInput = boolean;

/** Salt */
export type PolymarketPerpsSaltInput = number;

/** Sequence number */
export type PolymarketPerpsSequenceInput = number;

/** Signature in hex format */
export type PolymarketPerpsSigInput = string;

/** Backfill anchor for gap recovery. Pass the sequence number (sq) of the last notifications data frame you processed before the gap, never the sq of a resync frame. The bound is inclusive, so the response repeats the boundary event in full; deduplicate by notification id. */
export type PolymarketPerpsSinceSeqInput = number;

/** Time sort direction. `desc` (default) returns newest fills first; `asc` returns oldest first. */
export type PolymarketPerpsSortInput = 'desc' | 'asc';

/** Leaderboard ranking metric */
export type PolymarketPerpsSortByInput =
	| 'pnl'
	| 'notional'
	| 'account_value'
	| 'roi';

/** Inclusive UTC start date in YYYY-MM-DD format */
export type PolymarketPerpsStartDateInput = string;

/** Start timestamp in milliseconds */
export type PolymarketPerpsStartTimestampInput = number;

/** Time in force */
export type PolymarketPerpsTifInput = 'gtc' | 'ioc' | 'fok';

/** Timestamp in milliseconds */
export type PolymarketPerpsTime2Input = number;

/** Timestamp in milliseconds */
export type PolymarketPerpsTimestampInput = number;

/** Destination address in hex format */
export type PolymarketPerpsToInput = string;

/** Token contract address in hex format */
export type PolymarketPerpsTokenInput = string;

/** Trigger type */
export type PolymarketPerpsTpslInput = 'tp' | 'sl';

/** Trigger price */
export type PolymarketPerpsTrpInput = string;

/** Request timestamp. Unix milliseconds for most operations; Unix seconds for withdrawals (must match the on-chain EIP-712 struct verified against block.timestamp). */
export type PolymarketPerpsTsInput = number;

/** Leaderboard window, anchored to calendar UTC boundaries. `day` starts at 00:00 UTC today, `week` at Monday 00:00 UTC, `month` at the first of the month 00:00 UTC, `all` at exchange launch. */
export type PolymarketPerpsWindowInput = 'day' | 'week' | 'month' | 'all';

/** Withdrawal status */
export type PolymarketPerpsWithdrawalStatusInput =
	| 'pending'
	| 'confirmed'
	| 'removed'
	| 'failed';

/** Ethereum address (0x-prefixed, 40 hex chars) */
export type PolymarketRelayerAddressInput = string;

export type PolymarketRelayerSignatureParamsInput = {
	/** Gas price */
	gasPrice?: string;
	/** Operation type */
	operation?: string;
	/** Safe transaction gas */
	safeTxnGas?: string;
	/** Base gas */
	baseGas?: string;
	/** Gas token address */
	gasToken?: PolymarketRelayerAddressInput;
	/** Refund receiver address */
	refundReceiver?: PolymarketRelayerAddressInput;
};

export type PolymarketRfqAddressInput = string;

/** A base-10 integer in 6-decimal units. */
export type PolymarketRfqAmountInput = string;

/** The combo operator. Omitted means `and`. */
export type PolymarketRfqCombinationInput = 'and';

export type PolymarketRfqComboLegInput = {
	/** A gamma market id. */
	marketId: string;
	outcome: 'yes' | 'no';
};

/** `gamma` for a Polymarket market id, `bespoke` for a bespoke market, `combo` for a market defined by its `legs`. */
export type PolymarketRfqMarketSourceInput = 'gamma' | 'bespoke' | 'combo';

export type PolymarketRfqPreparePartyInput = {
	maker: PolymarketRfqAddressInput;
	/** Defaults to `maker`. */
	signer?: PolymarketJsonValue;
	/** The order signature type. `3` (deposit wallet) is the type partner trades use. */
	signatureType: number;
	role?: PolymarketRfqRoleInput;
};

/** Which fee rate a side pays. Set it on both sides or on neither; omitted, the `yes` side of a split or merge and the `buyer` of a trade are the taker. */
export type PolymarketRfqRoleInput = 'maker' | 'taker';

/** An `Order` exactly as prepared, with its signature. */
export type PolymarketRfqSignedOrderInput = {
	salt: PolymarketRfqUint256Input;
	maker: PolymarketRfqAddressInput;
	signer: PolymarketRfqAddressInput;
	tokenId: PolymarketRfqUint256Input;
	makerAmount: PolymarketRfqAmountInput;
	takerAmount: PolymarketRfqAmountInput;
	side: 0 | 1;
	signatureType: number;
	timestamp: string;
	metadata: string;
	builder: string;
	/** 0x hex. */
	signature: string;
	role?: PolymarketRfqRoleInput;
};

/** A base-10 uint256. */
export type PolymarketRfqUint256Input = string;

export type PolymarketBridgeDepositResponse = {
	/** Bridge addresses for different blockchain networks */
	address?: {
		/** EVM-compatible bridge address (Ethereum, Polygon, Arbitrum, Base, etc.) */
		evm?: string | null;
		/** Solana Virtual Machine bridge address */
		svm?: string | null;
		/** Bitcoin bridge address */
		btc?: string | null;
		/** Tron bridge address */
		tron?: string | null;
		[key: string]: unknown;
	} | null;
	/** Additional information about the bridge addresses */
	note?: string | null;
	[key: string]: unknown;
};

/** Breakdown of the estimated fees */
export type PolymarketBridgeFeeBreakdown = {
	/** Label of the app fee */
	appFeeLabel?: string | null;
	/** App fees as a percentage of the total amount sent */
	appFeePercent?: number | null;
	/** App fees in USD */
	appFeeUsd?: number | null;
	/** Fill cost percentage of the total amount sent */
	fillCostPercent?: number | null;
	/** Fill cost in USD */
	fillCostUsd?: number | null;
	/** Gas fee in USD */
	gasUsd?: number | null;
	/** Maximum potential slippage as a percentage */
	maxSlippage?: number | null;
	/** Amount after factoring slippage */
	minReceived?: number | null;
	/** Swap impact as a percentage of the total amount sent */
	swapImpact?: number | null;
	/** Swap impact of the transaction in USD */
	swapImpactUsd?: number | null;
	/** Total impact as a percentage of the total amount sent */
	totalImpact?: number | null;
	/** Impact cost of the transaction */
	totalImpactUsd?: number | null;
	[key: string]: unknown;
};

export type PolymarketBridgeQuoteResponse = {
	/** Estimated time to complete the checkout in milliseconds */
	estCheckoutTimeMs?: number | null;
	estFeeBreakdown?: PolymarketBridgeFeeBreakdown | null;
	/** Estimated token amount received in USD */
	estInputUsd?: number | null;
	/** Estimated token amount sent in USD */
	estOutputUsd?: number | null;
	/** Estimated token amount received */
	estToTokenBaseUnit?: string | null;
	/** Unique quote id of the request */
	quoteId?: string | null;
	[key: string]: unknown;
};

export type PolymarketBridgeSupportedAsset = {
	/** Chain ID */
	chainId?: string | null;
	/** Human-readable chain name */
	chainName?: string | null;
	token?: PolymarketBridgeToken | null;
	/** Minimum amount in USD for deposits and withdrawals */
	minCheckoutUsd?: number | null;
	[key: string]: unknown;
};

export type PolymarketBridgeSupportedAssetsResponse = {
	/** List of supported assets with minimum amounts for deposits and withdrawals */
	supportedAssets?: Array<PolymarketBridgeSupportedAsset> | null;
	[key: string]: unknown;
};

export type PolymarketBridgeToken = {
	/** Full token name */
	name?: string | null;
	/** Token symbol */
	symbol?: string | null;
	/** Token contract address */
	address?: string | null;
	/** Token decimals */
	decimals?: number | null;
	[key: string]: unknown;
};

export type PolymarketBridgeTransaction = {
	/** Source chain ID */
	fromChainId?: string | null;
	/** Source token contract address */
	fromTokenAddress?: string | null;
	/** Amount in base units (without decimals) */
	fromAmountBaseUnit?: string | null;
	/** Destination chain ID */
	toChainId?: string | null;
	/** Destination token contract address */
	toTokenAddress?: string | null;
	/** Current status of the transaction. If a transaction fails, remains stuck, or funds are held due to a compliance check, direct users to our Bridge API provider's support (https://intercom.help/funxyz/en/articles/10732578-contact-us). */
	status?: string | null;
	/** Transaction hash (only available when status is COMPLETED) */
	txHash?: string | null;
	/** Unix timestamp in milliseconds when transaction was created (missing when status is DEPOSIT_DETECTED) */
	createdTimeMs?: number | null;
	[key: string]: unknown;
};

export type PolymarketBridgeTransactionStatusResponse = {
	/** One page of transactions for the given address, newest first. This is a page, not the full history for the address. */
	transactions?: Array<PolymarketBridgeTransaction> | null;
	/** Opaque continuation token for the next page, or null when the pagination walk is complete. Pass it back verbatim as `cursor` on the next request; never parse, modify, construct, or reuse it with a different address. Stop on null rather than on an empty page or a page shorter than `limit`. */
	nextCursor?: string | null;
	[key: string]: unknown;
};

export type PolymarketClobApiKeyResponse = {
	/** UUID of the API key */
	apiKey?: string | null;
	/** Base64-encoded secret key for HMAC authentication */
	secret?: string | null;
	/** Hex-encoded passphrase for secret decryption */
	passphrase?: string | null;
	[key: string]: unknown;
};

export type PolymarketClobApiKeysResponse = {
	/** Array of API key UUIDs */
	apiKeys?: Array<string> | null;
	[key: string]: unknown;
};

/** Earnings for a specific asset */
export type PolymarketClobAssetEarning = {
	/** Address of the reward asset */
	asset_address?: string | null;
	/** Amount of earnings */
	earnings?: number | null;
	/** Exchange rate of the asset */
	asset_rate?: number | null;
	[key: string]: unknown;
};

export type PolymarketClobBalanceAllowanceResponse = {
	/** Balance amount in fixed-math with 6 decimals */
	balance?: string | null;
	/** Map of spender addresses to allowance amounts */
	allowances?: Record<string, string> | null;
	[key: string]: unknown;
};

export type PolymarketClobBatchPricesHistoryResponse = {
	/** Map of market asset id to array of price data points. */
	history?: Record<string, Array<PolymarketClobMarketPrice>> | null;
	[key: string]: unknown;
};

/** Response containing a newly created builder API key */
export type PolymarketClobBuilderApiKeyResponse = {
	/** Unique UUID identifier for the builder API key */
	key?: string | null;
	/** Base64-encoded secret key for HMAC authentication */
	secret?: string | null;
	/** Hex-encoded passphrase for secret decryption */
	passphrase?: string | null;
	[key: string]: unknown;
};

/** Builder trade information */
export type PolymarketClobBuilderTrade = {
	/** Trade ID */
	id?: string | null;
	/** Trade type */
	tradeType?: string | null;
	/** Taker order hash */
	takerOrderHash?: string | null;
	/** Builder code attributed to the trade */
	builder?: string | null;
	/** Market (condition ID) */
	market?: string | null;
	/** Asset ID (token ID) */
	assetId?: string | null;
	/** Trade side */
	side?: string | null;
	/** Trade size */
	size?: string | null;
	/** Trade size in USDC */
	sizeUsdc?: string | null;
	/** Trade price */
	price?: string | null;
	/** Trade status */
	status?: string | null;
	/** Market outcome */
	outcome?: string | null;
	/** Outcome index */
	outcomeIndex?: number | null;
	/** Owner UUID */
	owner?: string | null;
	/** Maker address */
	maker?: string | null;
	/** Transaction hash */
	transactionHash?: string | null;
	/** Match time (Unix timestamp) */
	matchTime?: string | null;
	/** Bucket index */
	bucketIndex?: number | null;
	/** Fee amount */
	fee?: string | null;
	/** Fee amount in USDC */
	feeUsdc?: string | null;
	/** Error message (if any) */
	err_msg?: string | null;
	/** Creation timestamp */
	createdAt?: string | null;
	/** Last update timestamp */
	updatedAt?: string | null;
	[key: string]: unknown;
};

/** Paginated builder trades response */
export type PolymarketClobBuilderTradesResponse = {
	/** Maximum number of items per page */
	limit?: number | null;
	/** Cursor for next page (base64 encoded offset). "LTE=" indicates no more pages */
	next_cursor?: string | null;
	/** Number of items in current response */
	count?: number | null;
	/** Array of builder trades */
	data?: Array<PolymarketClobBuilderTrade> | null;
	[key: string]: unknown;
};

export type PolymarketClobCancelOrdersResponse = {
	/** Array of order IDs that were successfully canceled */
	canceled?: Array<string> | null;
	/** Map of order IDs that could not be canceled with error messages */
	not_canceled?: Record<string, string> | null;
	[key: string]: unknown;
};

/** CLOB-level parameters for a market — tokens, tick size, base fees, rewards, RFQ status, and fee details. */
export type PolymarketClobClobMarketDetails = {
	/** Game start time (used for sports markets), ISO 8601 timestamp or null */
	gst?: string | null;
	r?: PolymarketClobClobRewards | null;
	/** Tokens for this market */
	t?: Array<PolymarketClobClobToken> | null;
	/** Minimum order size */
	mos?: number | null;
	/** Minimum tick size (price increment) */
	mts?: number | null;
	/** Maker base fee in basis points */
	mbf?: number | null;
	/** Taker base fee in basis points */
	tbf?: number | null;
	/** Whether RFQ (Request for Quote) is enabled for this market */
	rfqe?: boolean | null;
	/** Whether taker order delay is enabled for this market. When true, marketable orders are held for the 250 ms taker-delay window before synchronous processing. This field is omitted when false. */
	itode?: boolean | null;
	/** Whether Blockaid check is enabled */
	ibce?: boolean | null;
	fd?: PolymarketClobFeeDetails | null;
	/** Minimum order age in seconds */
	oas?: number | null;
	[key: string]: unknown;
};

/** Rewards configuration for a market. */
export type PolymarketClobClobRewards = Record<string, PolymarketJsonValue>;

/** A token in a CLOB market with its ID and outcome label. */
export type PolymarketClobClobToken = {
	/** The token ID */
	t?: string | null;
	/** Outcome label for the token (e.g. "Yes", "No") */
	o?: string | null;
	[key: string]: unknown;
};

/** Response containing the closed-only trading mode status */
export type PolymarketClobClosedOnlyResponse = {
	/** Whether the user is in closed-only trading mode */
	closed_only?: boolean | null;
	[key: string]: unknown;
};

/** Current active reward configuration for a market */
export type PolymarketClobCurrentReward = {
	/** Condition ID of the market */
	condition_id?: string | null;
	/** Maximum spread for rewards eligibility */
	rewards_max_spread?: number | null;
	/** Minimum order size for rewards eligibility */
	rewards_min_size?: number | null;
	rewards_config?: Array<PolymarketClobCurrentRewardConfig> | null;
	/** Sponsored daily rate (omitted when zero) */
	sponsored_daily_rate?: number | null;
	/** Number of sponsors (omitted when zero) */
	sponsors_count?: number | null;
	/** Computed native daily rate excluding sponsors (omitted when zero) */
	native_daily_rate?: number | null;
	/** Computed total daily rate including sponsors (omitted when zero) */
	total_daily_rate?: number | null;
	[key: string]: unknown;
};

/** Reward configuration entry for a current rewards market */
export type PolymarketClobCurrentRewardConfig = {
	/** Rewards config ID (always 0 on /rewards/markets/current) */
	id?: number | null;
	/** Address of the reward asset */
	asset_address?: string | null;
	/** Start date of the rewards period */
	start_date?: string | null;
	/** End date of the rewards period */
	end_date?: string | null;
	/** Daily reward rate */
	rate_per_day?: number | null;
	/** Total rewards amount */
	total_rewards?: number | null;
	[key: string]: unknown;
};

/** Fee curve parameters for a market. */
export type PolymarketClobFeeDetails = {
	/** Fee rate */
	r?: number | null;
	/** Fee curve exponent */
	e?: number | null;
	/** Whether fees apply to takers only */
	to?: boolean | null;
	[key: string]: unknown;
};

export type PolymarketClobFeeRate = {
	/** Base fee in basis points */
	base_fee?: number | null;
	[key: string]: unknown;
};

/** Response for heartbeat request */
export type PolymarketClobHeartbeatResponse = {
	/** Status of the heartbeat acknowledgment */
	status?: string | null;
	[key: string]: unknown;
};

/** Response for heartbeat v1 request */
export type PolymarketClobHeartbeatV1Response = {
	/** The new heartbeat ID to use in the next request */
	heartbeat_id?: string | null;
	[key: string]: unknown;
};

/** Minimal market information for live activity widgets (e.g., iOS Live Activities, Android widgets) */
export type PolymarketClobLiveActivityMarket = {
	/** Unique identifier for the market condition */
	condition_id?: string | null;
	/** Internal market ID */
	id?: number | null;
	/** The market question being asked */
	question?: string | null;
	/** URL-friendly slug for the market */
	market_slug?: string | null;
	/** URL-friendly slug for the parent event */
	event_slug?: string | null;
	/** URL-friendly slug for the series (if applicable) */
	series_slug?: string | null;
	/** URL to the market icon image */
	icon?: string | null;
	/** URL to the market image */
	image?: string | null;
	/** List of tag slugs associated with this market */
	tags?: Array<string> | null;
	[key: string]: unknown;
};

export type PolymarketClobMarket = {
	enable_order_book?: boolean | null;
	active?: boolean | null;
	closed?: boolean | null;
	archived?: boolean | null;
	accepting_orders?: boolean | null;
	accepting_order_timestamp?: string | null;
	minimum_order_size?: number | null;
	minimum_tick_size?: number | null;
	condition_id?: string | null;
	question_id?: string | null;
	question?: string | null;
	description?: string | null;
	market_slug?: string | null;
	end_date_iso?: string | null;
	game_start_time?: string | null;
	seconds_delay?: number | null;
	fpmm?: string | null;
	maker_base_fee?: number | null;
	taker_base_fee?: number | null;
	notifications_enabled?: boolean | null;
	neg_risk?: boolean | null;
	neg_risk_market_id?: string | null;
	neg_risk_request_id?: string | null;
	icon?: string | null;
	image?: string | null;
	rewards?: PolymarketClobRewards | null;
	is_50_50_outcome?: boolean | null;
	tokens?: Array<PolymarketClobToken> | null;
	tags?: Array<string> | null;
	[key: string]: unknown;
};

/** Response for GET /markets-by-token/{token_id} — condition ID and both token IDs in the market. */
export type PolymarketClobMarketByTokenResponse = {
	/** The condition ID of the market containing the given token */
	condition_id?: string | null;
	/** The primary (Yes) token ID */
	primary_token_id?: string | null;
	/** The secondary (No) token ID */
	secondary_token_id?: string | null;
	[key: string]: unknown;
};

export type PolymarketClobMarketPrice = {
	t?: number | null;
	p?: number | null;
	[key: string]: unknown;
};

/** Market with raw reward configurations */
export type PolymarketClobMarketReward = {
	/** Condition ID of the market */
	condition_id?: string | null;
	/** Market question */
	question?: string | null;
	/** URL slug for the market */
	market_slug?: string | null;
	/** URL slug for the event */
	event_slug?: string | null;
	/** URL to market image */
	image?: string | null;
	/** Maximum spread for rewards eligibility */
	rewards_max_spread?: number | null;
	/** Minimum order size for rewards eligibility */
	rewards_min_size?: number | null;
	/** Competitiveness score of the market */
	market_competitiveness?: number | null;
	tokens?: Array<PolymarketClobRewardsToken> | null;
	rewards_config?: Array<PolymarketClobRewardsConfig> | null;
	[key: string]: unknown;
};

/** Market with rewards configuration and trading metrics */
export type PolymarketClobMultiMarketInfo = {
	/** Condition ID of the market */
	condition_id?: string | null;
	/** Event ID */
	event_id?: string | null;
	/** URL slug for the event */
	event_slug?: string | null;
	/** Market creation timestamp */
	created_at?: string | null;
	/** Title within an event group */
	group_item_title?: string | null;
	/** URL to market image */
	image?: string | null;
	/** Competitiveness score of the market */
	market_competitiveness?: number | null;
	/** Market ID */
	market_id?: string | null;
	/** URL slug for the market */
	market_slug?: string | null;
	/** Price change over the last 24 hours */
	one_day_price_change?: number | null;
	/** Market question */
	question?: string | null;
	/** Maximum spread for rewards eligibility */
	rewards_max_spread?: number | null;
	/** Minimum order size for rewards eligibility */
	rewards_min_size?: number | null;
	/** Current spread */
	spread?: number | null;
	/** Market end date */
	end_date?: string | null;
	tokens?: Array<PolymarketClobRewardsToken> | null;
	/** 24-hour trading volume */
	volume_24hr?: number | null;
	rewards_config?: Array<PolymarketClobRewardsConfig> | null;
	[key: string]: unknown;
};

export type PolymarketClobNegRisk = {
	/** Whether negative risk is enabled for this market */
	neg_risk?: boolean | null;
	[key: string]: unknown;
};

/** A notification event for the user */
export type PolymarketClobNotification = {
	/** Unique identifier for the notification */
	id?: number | null;
	/** API key of the notification owner (empty for broadcast notifications) */
	owner?: string | null;
	/** Type of notification: - 1: Order cancellation - 2: Order fill - 3: Market registered - 4: Market resolved - 5: Reward payout - 6: Child comment created - 11: Taker tier upgraded */
	type?: number | null;
	/** Notification-specific data. For type 11 (taker tier upgraded), previous_tier, tier, and rebate_bps are integers, and snapshot_date is the UTC snapshot day as a YYYY-MM-DD string. */
	payload?: Record<string, PolymarketJsonValue> | null;
	/** Unix timestamp when the notification was created */
	timestamp?: number | null;
	[key: string]: unknown;
};

export type PolymarketClobOpenOrder = {
	/** Order ID (order hash) */
	id?: string | null;
	/** Order status. CANCELED_MARKET_RESOLVED cancels the unfilled remainder when the market resolves; it does not undo settled fills. */
	status?: string | null;
	/** UUID of the order owner */
	owner?: string | null;
	/** Ethereum address of the maker */
	maker_address?: string | null;
	/** Market (condition ID) */
	market?: string | null;
	/** Asset ID (token ID) */
	asset_id?: string | null;
	/** Order side */
	side?: string | null;
	/** Original order size in shares, as a decimal string. Already normalized; do not divide by 1e6. */
	original_size?: string | null;
	/** Matched size in shares, as a decimal string. Retained after cancellation; this is not the current position balance. */
	size_matched?: string | null;
	/** Order price */
	price?: string | null;
	/** Market outcome (YES/NO) */
	outcome?: string | null;
	/** Unix timestamp when the order expires */
	expiration?: string | null;
	/** Order type */
	order_type?: string | null;
	/** Deprecated and may be omitted. Use size_matched for cumulative filled quantity, or GET /data/trades and match taker_order_id or maker_orders[].order_id to the order ID for individual fills. Absence or an empty array does not mean the order has no fills. */
	associate_trades?: Array<string> | null;
	/** Unix timestamp when the order was created */
	created_at?: number | null;
	[key: string]: unknown;
};

export type PolymarketClobOrderBookSummary = {
	/** Market condition ID */
	market?: string | null;
	/** Token ID (asset ID) */
	asset_id?: string | null;
	/** Timestamp of the order book snapshot */
	timestamp?: string | null;
	/** Hash of the order book summary */
	hash?: string | null;
	/** List of bid orders (sorted by price descending) */
	bids?: Array<PolymarketClobOrderSummary> | null;
	/** List of ask orders (sorted by price ascending) */
	asks?: Array<PolymarketClobOrderSummary> | null;
	/** Minimum order size */
	min_order_size?: string | null;
	/** Minimum price increment (tick size) */
	tick_size?: string | null;
	/** Whether negative risk is enabled for this market */
	neg_risk?: boolean | null;
	/** Last trade price */
	last_trade_price?: string | null;
	[key: string]: unknown;
};

/** Response indicating whether an order is currently scoring for rewards */
export type PolymarketClobOrderScoringResponse = {
	/** Whether the order is currently scoring for maker rewards */
	scoring?: boolean | null;
	[key: string]: unknown;
};

export type PolymarketClobOrderSummary = {
	/** Order price */
	price?: string | null;
	/** Order size */
	size?: string | null;
	[key: string]: unknown;
};

export type PolymarketClobOrdersResponse = {
	/** Maximum number of results per page */
	limit?: number | null;
	/** Cursor for pagination (base64 encoded offset). Empty if no more results. */
	next_cursor?: string | null;
	/** Number of orders in this response */
	count?: number | null;
	/** Array of open orders */
	data?: Array<PolymarketClobOpenOrder> | null;
	[key: string]: unknown;
};

/** Map of order IDs to their scoring status. Each key is an order ID (order hash) and the value is a boolean indicating whether that order is currently scoring for maker rewards. */
export type PolymarketClobOrdersScoringResponse = Record<string, boolean>;

/** Paginated list of current reward configurations */
export type PolymarketClobPaginatedCurrentReward = {
	/** Maximum number of items per page */
	limit?: number | null;
	/** Number of items in the current response */
	count?: number | null;
	/** Cursor for the next page. "LTE=" indicates the last page. */
	next_cursor?: string | null;
	data?: Array<PolymarketClobCurrentReward> | null;
	[key: string]: unknown;
};

/** Paginated list of market reward configurations */
export type PolymarketClobPaginatedMarketReward = {
	/** Maximum number of items per page */
	limit?: number | null;
	/** Number of items in the current response */
	count?: number | null;
	/** Cursor for the next page. "LTE=" indicates the last page. */
	next_cursor?: string | null;
	data?: Array<PolymarketClobMarketReward> | null;
	[key: string]: unknown;
};

export type PolymarketClobPaginatedMarkets = {
	limit?: number | null;
	next_cursor?: string | null;
	count?: number | null;
	data?: Array<PolymarketClobMarket> | null;
	[key: string]: unknown;
};

/** Paginated list of markets with rewards and trading metrics */
export type PolymarketClobPaginatedMultiMarketInfo = {
	/** Maximum number of items per page */
	limit?: number | null;
	/** Number of items in the current response */
	count?: number | null;
	/** Cursor for the next page. "LTE=" indicates the last page. */
	next_cursor?: string | null;
	data?: Array<PolymarketClobMultiMarketInfo> | null;
	[key: string]: unknown;
};

export type PolymarketClobPaginatedSimplifiedMarkets = {
	limit?: number | null;
	next_cursor?: string | null;
	count?: number | null;
	data?: Array<PolymarketClobSimplifiedMarket> | null;
	[key: string]: unknown;
};

/** Paginated list of user earnings */
export type PolymarketClobPaginatedUserEarnings = {
	/** Maximum number of items per page */
	limit?: number | null;
	/** Number of items in the current response */
	count?: number | null;
	/** Cursor for the next page. "LTE=" indicates the last page. */
	next_cursor?: string | null;
	data?: Array<PolymarketClobUserEarning> | null;
	[key: string]: unknown;
};

/** Paginated list of user rewards markets */
export type PolymarketClobPaginatedUserRewardsMarkets = {
	/** Maximum number of items per page */
	limit?: number | null;
	/** Number of items in the current response */
	count?: number | null;
	/** Total number of items across all pages */
	total_count?: number | null;
	/** Cursor for the next page. "LTE=" indicates the last page. */
	next_cursor?: string | null;
	data?: Array<PolymarketClobUserRewardsMarket> | null;
	[key: string]: unknown;
};

export type PolymarketClobPricesHistoryResponse = {
	history?: Array<PolymarketClobMarketPrice> | null;
	[key: string]: unknown;
};

/** Rate, burst and negative-balance settings for the tier */
export type PolymarketClobRateLimitTierDetails = {
	/** Tier name */
	name?: string | null;
	/** 30-day volume required for the tier */
	volume_threshold?: number | null;
	/** Cancel bucket refill rate, in tokens per second */
	cancel_rate_per_sec?: number | null;
	/** Order bucket refill rate, in tokens per second */
	order_rate_per_sec?: number | null;
	/** Order bucket burst capacity, in tokens */
	order_burst?: number | null;
	/** Cancel bucket burst capacity, in tokens */
	cancel_burst?: number | null;
	/** Whether the cancel bucket can carry a negative balance */
	allow_negative?: boolean | null;
	[key: string]: unknown;
};

/** Trading rate limit tier currently applied to the signer */
export type PolymarketClobRateLimitTierResponse = {
	/** Tier currently applied to your signer */
	tier?: string | null;
	/** Trailing-window volume, in USDC, of the maker wallet that set your tier. Omitted below the lowest paid tier */
	usdc_volume?: string | null;
	/** 30-day volume needed for the next tier. Omitted at the top tier and for manually assigned tiers */
	next_tier_threshold?: number | null;
	/** Length of the volume window, in days */
	period?: number | null;
	tier_details?: PolymarketClobRateLimitTierDetails | null;
	[key: string]: unknown;
};

/** Rebated fees for a maker on a specific market and date */
export type PolymarketClobRebatedFees = {
	/** Date of the rebate (YYYY-MM-DD) */
	date?: string | null;
	/** Condition ID of the market */
	condition_id?: string | null;
	/** Asset address (e.g. USDC contract) */
	asset_address?: string | null;
	/** Maker's Ethereum address */
	maker_address?: string | null;
	/** Rebated fee amount in USDC */
	rebated_fees_usdc?: string | null;
	[key: string]: unknown;
};

export type PolymarketClobRewards = {
	rates?: Array<{
		asset_address?: string | null;
		rewards_daily_rate?: number | null;
		[key: string]: unknown;
	}> | null;
	min_size?: number | null;
	max_spread?: number | null;
	[key: string]: unknown;
};

/** Rewards configuration for a market */
export type PolymarketClobRewardsConfig = {
	/** Rewards config ID */
	id?: number | null;
	/** Address of the reward asset */
	asset_address?: string | null;
	/** Start date of the rewards period */
	start_date?: string | null;
	/** End date of the rewards period */
	end_date?: string | null;
	/** Daily reward rate */
	rate_per_day?: number | null;
	/** Total rewards amount */
	total_rewards?: number | null;
	/** Remaining reward amount */
	remaining_reward_amount?: number | null;
	/** Total number of days in the rewards period */
	total_days?: number | null;
	[key: string]: unknown;
};

/** Token information for rewards markets */
export type PolymarketClobRewardsToken = {
	/** Token ID */
	token_id?: string | null;
	/** Outcome name (e.g., "YES", "NO") */
	outcome?: string | null;
	/** Current price of the token */
	price?: number | null;
	[key: string]: unknown;
};

export type PolymarketClobSendOrderResponse = {
	/** Whether the order was successfully processed */
	success?: boolean | null;
	/** Unique identifier for the order (order hash) */
	orderID?: string | null;
	/** Status of the order after processing */
	status?: string | null;
	/** Amount the maker is providing in fixed-math with 6 decimals */
	makingAmount?: string | null;
	/** Amount the taker is providing in fixed-math with 6 decimals */
	takingAmount?: string | null;
	/** Array of transaction hashes (present when status is 'matched') */
	transactionsHashes?: Array<string> | null;
	/** Array of trade IDs (present when status is 'matched') */
	tradeIDs?: Array<string> | null;
	/** Error message (empty on success) */
	errorMsg?: string | null;
	[key: string]: unknown;
};

export type PolymarketClobSimplifiedMarket = {
	condition_id?: string | null;
	rewards?: PolymarketClobRewards | null;
	tokens?: Array<PolymarketClobToken> | null;
	active?: boolean | null;
	closed?: boolean | null;
	archived?: boolean | null;
	accepting_orders?: boolean | null;
	[key: string]: unknown;
};

export type PolymarketClobTickSize = {
	/** Minimum tick size (price increment) */
	minimum_tick_size?: number | null;
	[key: string]: unknown;
};

export type PolymarketClobToken = {
	token_id?: string | null;
	outcome?: string | null;
	price?: number | null;
	winner?: boolean | null;
	[key: string]: unknown;
};

/** Total user earnings for a given day grouped by asset */
export type PolymarketClobTotalUserEarning = {
	/** Date of the earnings */
	date?: string | null;
	/** Address of the reward asset */
	asset_address?: string | null;
	/** Address of the maker */
	maker_address?: string | null;
	/** Total amount of earnings in the asset */
	earnings?: number | null;
	/** Native rewards included in the total, when the breakdown is returned */
	native_earnings?: number | null;
	/** Sponsored rewards included in the total, when the breakdown is returned */
	sponsored_earnings?: number | null;
	/** Exchange rate of the asset */
	asset_rate?: number | null;
	[key: string]: unknown;
};

/** Trade information */
export type PolymarketClobTrade = {
	/** Trade ID */
	id?: string | null;
	/** Taker order ID (hash) */
	taker_order_id?: string | null;
	/** Market (condition ID) */
	market?: string | null;
	/** Asset ID (token ID) */
	asset_id?: string | null;
	/** Trade side */
	side?: string | null;
	/** Trade size */
	size?: string | null;
	/** Fee rate in basis points */
	fee_rate_bps?: string | null;
	/** Trade price */
	price?: string | null;
	/** Trade status */
	status?: string | null;
	/** Match time (Unix timestamp) */
	match_time?: string | null;
	/** Match time in nanoseconds */
	match_time_nano?: string | null;
	/** Last update time (Unix timestamp) */
	last_update?: string | null;
	/** Market outcome */
	outcome?: string | null;
	/** Bucket index */
	bucket_index?: number | null;
	/** Owner UUID */
	owner?: string | null;
	/** Maker address */
	maker_address?: string | null;
	/** Transaction hash */
	transaction_hash?: string | null;
	/** Error message (if any) */
	err_msg?: string | null;
	/** Array of maker orders associated with this trade */
	maker_orders?: Array<{
		/** Order ID (hash) */
		order_id?: string | null;
		/** Owner UUID */
		owner?: string | null;
		/** Maker address */
		maker_address?: string | null;
		/** Matched amount */
		matched_amount?: string | null;
		/** Price */
		price?: string | null;
		/** Fee rate in basis points */
		fee_rate_bps?: string | null;
		/** Asset ID */
		asset_id?: string | null;
		/** Outcome */
		outcome?: string | null;
		side?: string | null;
		[key: string]: unknown;
	}> | null;
	/** Trader side (TAKER or MAKER) */
	trader_side?: string | null;
	[key: string]: unknown;
};

/** Paginated trades response */
export type PolymarketClobTradesResponse = {
	/** Maximum number of items per page */
	limit?: number | null;
	/** Cursor for next page (base64 encoded offset). "LTE=" indicates no more pages */
	next_cursor?: string | null;
	/** Number of items in current response */
	count?: number | null;
	/** Array of trades */
	data?: Array<PolymarketClobTrade> | null;
	[key: string]: unknown;
};

/** User earnings for a specific market on a given day */
export type PolymarketClobUserEarning = {
	/** Date of the earnings */
	date?: string | null;
	/** Condition ID of the market */
	condition_id?: string | null;
	/** Address of the reward asset */
	asset_address?: string | null;
	/** Address of the maker */
	maker_address?: string | null;
	/** Amount of earnings in the asset */
	earnings?: number | null;
	/** Exchange rate of the asset */
	asset_rate?: number | null;
	[key: string]: unknown;
};

/** Market with user rewards earnings and configuration */
export type PolymarketClobUserRewardsMarket = {
	/** Condition ID of the market */
	condition_id?: string | null;
	/** Market ID */
	market_id?: string | null;
	/** Event ID */
	event_id?: string | null;
	/** Market question */
	question?: string | null;
	/** URL slug for the market */
	market_slug?: string | null;
	/** URL slug for the event */
	event_slug?: string | null;
	/** URL to market image */
	image?: string | null;
	/** Maximum spread for rewards eligibility */
	rewards_max_spread?: number | null;
	/** Minimum order size for rewards eligibility */
	rewards_min_size?: number | null;
	/** 24-hour trading volume */
	volume_24hr?: number | null;
	/** Current spread */
	spread?: number | null;
	/** Competitiveness score of the market */
	market_competitiveness?: number | null;
	tokens?: Array<PolymarketClobRewardsToken> | null;
	rewards_config?: Array<PolymarketClobCurrentRewardConfig> | null;
	/** Maker address */
	maker_address?: string | null;
	/** Percentage of total rewards the user is earning */
	earning_percentage?: number | null;
	earnings?: Array<PolymarketClobAssetEarning> | null;
	[key: string]: unknown;
};

export type PolymarketClobWalletOpenOrder = {
	/** Order ID (order hash) */
	id?: string | null;
	/** Order status */
	status?: string | null;
	/** API key, only filled in for orders placed with the caller's own key */
	owner?: string | null;
	/** EOA whose key placed the order, either the wallet owner or a session signer */
	signer_address?: string | null;
	/** Ethereum address of the maker */
	maker_address?: string | null;
	/** Market (condition ID) */
	market?: string | null;
	/** Asset ID (token ID) */
	asset_id?: string | null;
	/** Order side */
	side?: string | null;
	/** Original order size */
	original_size?: string | null;
	/** Size that has been matched */
	size_matched?: string | null;
	/** Order price */
	price?: string | null;
	/** Market outcome (YES/NO) */
	outcome?: string | null;
	/** Unix timestamp when the order expires */
	expiration?: string | null;
	/** Order type */
	order_type?: string | null;
	/** Unix timestamp when the order was created */
	created_at?: number | null;
	[key: string]: unknown;
};

export type PolymarketClobWalletOpenOrdersResponse = {
	data?: Array<PolymarketClobWalletOpenOrder> | null;
	/** Pass as cursor on the next request. Keep paging until empty, even if data is empty. */
	next_cursor?: string | null;
	[key: string]: unknown;
};

export type PolymarketCombosComboMarket = {
	id?: string | null;
	condition_id?: string | null;
	/** Combo position IDs; `[0]` is YES, `[1]` is NO. */
	position_ids?: Array<string> | null;
	slug?: string | null;
	title?: string | null;
	outcomes?: Array<string> | null;
	outcome_prices?: Array<string> | null;
	image?: string | null;
	volume?: number | null;
	tags?: Array<string> | null;
	[key: string]: unknown;
};

export type PolymarketCombosComboMarketsResponse = {
	markets?: Array<PolymarketCombosComboMarket> | null;
	/** Cursor for the next page, or `null` on the final page. */
	next_cursor?: string | null;
	[key: string]: unknown;
};

/** Requester trade direction */
export type PolymarketCombosDirection = string;

/** Signed Exchange v3 order. Combinatorial RFQ trades settle through Exchange v3. */
export type PolymarketCombosExchangeV3Order = {
	/** Order salt (uint256 as a decimal string) */
	salt?: string | null;
	/** Wallet that funds the order */
	maker?: string | null;
	/** Address that signs the order */
	signer?: string | null;
	/** YES or NO combo position ID (uint256 as a decimal string) */
	tokenId?: string | null;
	/** Amount the maker pays, in six-decimal base units (uint256 as a string) */
	makerAmount?: string | null;
	/** Amount the maker receives, in six-decimal base units (uint256 as a string) */
	takerAmount?: string | null;
	/** Order side — `0` BUY, `1` SELL */
	side?: number | null;
	signatureType?: PolymarketCombosSignatureType | null;
	/** Order timestamp in Unix seconds (as a string) */
	timestamp?: string | null;
	/** 32-byte hex field; defaults to the zero value */
	metadata?: string | null;
	/** 32-byte hex field; defaults to the zero value */
	builder?: string | null;
	/** EIP-712 signature over the order */
	signature?: string | null;
	[key: string]: unknown;
};

/** Handoff produced when a confirmed RFQ is ready for onchain execution. */
export type PolymarketCombosExecutionHandoff = {
	execution_id?: string | null;
	request?: PolymarketCombosRFQRequest | null;
	quote_id?: string | null;
	bundle?: PolymarketCombosFillBundle | null;
	requester_acceptance?: PolymarketCombosRequesterAcceptance | null;
	maker_quotes?: Array<PolymarketCombosQuote> | null;
	reservations?: Array<PolymarketCombosWalletReservation> | null;
	/** Unix milliseconds. */
	ready_at?: number | null;
	[key: string]: unknown;
};

export type PolymarketCombosFillAllocation = {
	maker_quote_id?: string | null;
	signer_address?: string | null;
	maker_address?: string | null;
	/** Accepted fill size for this maker quote, in six-decimal fixed-point units. */
	size_e6?: string | null;
	/** Fill price in six-decimal fixed-point units. */
	price_e6?: string | null;
	/** Receipt time in Unix milliseconds. */
	received_at?: number | null;
	[key: string]: unknown;
};

/** The selected executable bundle of maker allocations. */
export type PolymarketCombosFillBundle = {
	/** Requested share size in six-decimal fixed-point units. */
	requested_shares_e6?: string | null;
	/** Requested notional in six-decimal fixed-point units (BUY RFQs only). */
	requested_notional_e6?: string | null;
	/** Blended bundle price in six-decimal fixed-point units. */
	blended_price_e6?: string | null;
	allocations?: Array<PolymarketCombosFillAllocation> | null;
	[key: string]: unknown;
};

/** Result of a maker confirmation. Includes a snapshot, an execution handoff, or both, depending on whether the confirmation completed the bundle. */
export type PolymarketCombosMakerConfirmationResult = {
	snapshot?: PolymarketCombosRFQSnapshot | null;
	execution?: PolymarketCombosExecutionHandoff | null;
	[key: string]: unknown;
};

export type PolymarketCombosMakerConfirmationSnapshot = {
	quote_id?: string | null;
	signer_address?: string | null;
	maker_address?: string | null;
	decision?: string | null;
	reason?: string | null;
	/** Response time in Unix milliseconds. */
	responded_at?: number | null;
	[key: string]: unknown;
};

/** A signed maker quote. */
export type PolymarketCombosQuote = {
	/** Maker-generated quote ID (required for REST submissions). */
	quote_id?: string | null;
	/** RFQ ID from the `RFQ_REQUEST`. */
	rfq_id?: string | null;
	/** Derived from the authenticated session; ignored if provided. */
	auth_address?: string | null;
	signer_address?: string | null;
	maker_address?: string | null;
	signature_type?: PolymarketCombosSignatureType | null;
	/** Quote price in six-decimal fixed-point units (must be positive). */
	price_e6?: string | null;
	/** Fillable share count in six-decimal fixed-point units (must be positive). Note this differs from the request's size field, which may be notional or shares. */
	size_e6?: string | null;
	/** Optional quote expiry in Unix milliseconds. */
	valid_until?: number | null;
	signed_order?: PolymarketCombosExchangeV3Order | null;
	/** Server-assigned receipt time in Unix milliseconds. */
	received_at?: number | null;
	[key: string]: unknown;
};

/** The RFQ request as stored by the engine. */
export type PolymarketCombosRFQRequest = {
	rfq_id?: string | null;
	auth_address?: string | null;
	signer_address?: string | null;
	maker_address?: string | null;
	signature_type?: PolymarketCombosSignatureType | null;
	requestor_public_id?: string | null;
	leg_position_ids?: Array<string> | null;
	condition_id?: string | null;
	yes_position_id?: string | null;
	no_position_id?: string | null;
	direction?: PolymarketCombosDirection | null;
	side?: PolymarketCombosSide | null;
	requested_size?: PolymarketCombosRequestedSize | null;
	/** Creation time in Unix milliseconds. */
	created_at?: number | null;
	[key: string]: unknown;
};

/** Point-in-time view of an RFQ and its competition/confirmation windows. */
export type PolymarketCombosRFQSnapshot = {
	request?: PolymarketCombosRFQRequest | null;
	status?: PolymarketCombosRFQStatus | null;
	/** Unix milliseconds. */
	competition_started_at?: number | null;
	/** Unix milliseconds. */
	competition_ends_at?: number | null;
	/** Unix milliseconds. */
	confirmation_started_at?: number | null;
	/** Unix milliseconds. */
	confirmation_ends_at?: number | null;
	quote_id?: string | null;
	bundle?: PolymarketCombosFillBundle | null;
	maker_confirmations?: Array<PolymarketCombosMakerConfirmationSnapshot> | null;
	[key: string]: unknown;
};

/** Lifecycle status of the RFQ */
export type PolymarketCombosRFQStatus = string;

/** Requested RFQ size and unit */
export type PolymarketCombosRequestedSize = {
	/** `notional` for requester BUY RFQs and `shares` for requester SELL RFQs. */
	unit?: string | null;
	/** Six-decimal fixed-point value encoded as a string. */
	value_e6?: string | null;
	[key: string]: unknown;
};

export type PolymarketCombosRequesterAcceptance = {
	rfq_id?: string | null;
	quote_id?: string | null;
	auth_address?: string | null;
	signer_address?: string | null;
	maker_address?: string | null;
	signature_type?: PolymarketCombosSignatureType | null;
	signed_order?: PolymarketCombosExchangeV3Order | null;
	/** Unix milliseconds. */
	accepted_at?: number | null;
	[key: string]: unknown;
};

/** Combinatorial position side. Currently only `YES` is supported. */
export type PolymarketCombosSide = string;

/** CLOB signature type: - `0` EOA - `1` POLY_PROXY - `2` GNOSIS_SAFE - `3` POLY_1271 */
export type PolymarketCombosSignatureType = number;

export type PolymarketCombosWalletAssetDelta = {
	asset?: string | null;
	asset_id?: string | null;
	amount?: string | null;
	[key: string]: unknown;
};

export type PolymarketCombosWalletReservation = {
	action_id?: string | null;
	user?: string | null;
	wallet_nonce?: number | null;
	deltas?: Array<PolymarketCombosWalletAssetDelta> | null;
	[key: string]: unknown;
};

/** One activity-feed event (`/v2/activity`); a trade, split, merge, redeem, … */
export type PolymarketDataActivity = {
	/** Profile bio text. */
	bio?: string | null;
	/** On-chain condition id of the market (`0x` hex). */
	condition_id?: string | null;
	/** Parent event slug. */
	event_slug?: string | null;
	/** Market icon URL. */
	icon?: string | null;
	/** Flag only, on V2/V3 combo trade rows. Combo detail lives on the combos endpoints; omitted from non-combo rows. */
	is_combo?: boolean | null;
	/** Profile display name of the wallet. */
	name?: string | null;
	/** Label of the outcome (e.g. `Yes`). */
	outcome?: string | null;
	/** Index of the outcome within the market; `999` means the outcome could not be labeled. */
	outcome_index?: number | null;
	/** Price per share in USDC (trades; `0` where no price applies). */
	price?: number | null;
	/** Profile image URL. */
	profile_image?: string | null;
	/** Resized profile image URL, when one exists. */
	profile_image_optimized?: string | null;
	/** Proxy wallet the row belongs to; the address every wallet-keyed endpoint accepts as `user`. */
	proxy_wallet?: string | null;
	/** Generated fallback handle for profiles without a display name. */
	pseudonym?: string | null;
	/** `BUY` or `SELL` on trade rows, from this wallet's perspective; empty where a side does not apply. */
	side?: string | null;
	/** Share quantity of the action; bare sizes are shares, never USD. */
	size?: number | null;
	/** Market slug; the URL segment on polymarket.com. */
	slug?: string | null;
	/** Block timestamp of the action, epoch seconds. */
	timestamp?: number | null;
	/** Market question title (Gamma enrichment; empty when unenriched). */
	title?: string | null;
	/** CLOB asset id of the outcome token the action touched. */
	token_id?: string | null;
	/** Hash of the settling transaction. */
	transaction_hash?: string | null;
	/** TRADE, SPLIT, MERGE, REDEEM, REWARD, CONVERSION, … */
	type?: string | null;
	/** Cash value of the action in USDC. */
	usdc_size?: number | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/activity`. */
export type PolymarketDataActivityPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataActivity> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** One trusted approval contract in the public response. */
export type PolymarketDataApprovalContract = {
	/** Current ERC20 allowance: `max` for an unlimited grant, else the raw integer amount as a string; absent on ERC1155 operator approvals (all-or-nothing). */
	amount?: string | null;
	/** Whether the wallet currently grants this approval. */
	approved?: boolean | null;
	/** The product flow the approval enables (e.g. `trading`). */
	feature?: string | null;
	/** Catalog identifier of this approval pair (token + spender). */
	id?: string | null;
	/** The contract approved to spend or operate the token. */
	spender?: string | null;
	/** Token standard of the pair: `ERC20` or `ERC1155`. */
	standard?: string | null;
	/** The token contract the approval is granted on. */
	token?: string | null;
	[key: string]: unknown;
};

/** One `/v2/biggest-winners` row: a single winning POSITION, not a user total. `kind` is `market` or `combo`. Combo rows carry a `' / '`-joined title of their legs and have no Gamma event; `event_id` is `0` and `event_slug` is empty; so branch on `kind` before building an event link. */
export type PolymarketDataBiggestWinner = {
	/** On-chain condition id of the market (combo rows: the combo condition). */
	condition_id?: string | null;
	/** Gamma event id of the parent event; `0` on combo rows. */
	event_id?: number | null;
	/** Parent event slug; empty on combo rows. */
	event_slug?: string | null;
	/** Parent event title; on combo rows, the `' / '`-joined leg questions. */
	event_title?: string | null;
	/** Value at resolution, in USDC. */
	final_value?: number | null;
	/** Cost basis of the winning position, in USDC. */
	initial_value?: number | null;
	/** `market` or `combo`; combo rows carry no Gamma event (`event_id` 0, empty `event_slug`), so branch on this before building event links. */
	kind?: string | null;
	/** `final_value - initial_value`, in USDC. */
	pnl?: number | null;
	/** Token id of the winning position. */
	position_id?: string | null;
	/** Profile image URL. */
	profile_image?: string | null;
	/** Unix seconds; when the position resolved. */
	resolved_at?: number | null;
	/** The winning wallet. */
	user_id?: string | null;
	/** Profile display name of the wallet. */
	user_name?: string | null;
	/** Unique 1-based ordinal within the window/category; `row_number()`, so equal PnL does not share a rank (unlike the leaderboard's `rank`). */
	win_rank?: number | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/biggest-winners`. */
export type PolymarketDataBiggestWinnersPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataBiggestWinner> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** One `/v2/builders/leaderboard` row: a builder's standing for the window. `volume` is in SHARES, not USDC; the same unit as `/v2/leaderboard`'s `volume`. `active_users` counts distinct makers in the window. `builder_name` is a display name that falls back to `builder_code` when the builder has no… */
export type PolymarketDataBuilderStanding = {
	/** Distinct active users attributed to the builder in the window. */
	active_users?: number | null;
	/** Stable identifier of the builder. */
	builder_code?: string | null;
	/** Builder display name; cosmetic; key on `builder_code`. */
	builder_name?: string | null;
	/** Builder profile image URL. */
	profile_image?: string | null;
	/** Board rank in the requested window; ties share a rank and the next skips. */
	rank?: number | null;
	/** Whether the builder is verified. */
	verified?: boolean | null;
	/** Volume attributed to the builder in the window, in shares. */
	volume?: number | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/builders/leaderboard`; an offset-cursor board, like `LeaderboardPage`. Its companion `/v2/builders/volume` is a series rather than a board and is NOT paged. */
export type PolymarketDataBuildersLeaderboardPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataBuilderStanding> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** One combo lifecycle/redemption event (`/v2/activity/combos`). Ordered and paginated by on-chain position; `(block_number, log_index)`. `timestamp` is the event's wall-clock, not the ordering key. */
export type PolymarketDataComboActivity = {
	/** Cash amount of the action in USDC; `null` where no cash leg applies. */
	amount_usdc?: number | null;
	/** Block number of the action. */
	block_number?: number | null;
	/** On-chain combo condition id (structural, `0x03`-prefixed). */
	combo_condition_id?: string | null;
	/** Token id of the combo position the action touched. */
	combo_position_id?: string | null;
	/** `tx_hash-log_index`. */
	id?: string | null;
	/** The combo's legs, in leg order, with market and event enrichment. */
	legs?: Array<PolymarketDataComboLeg> | null;
	/** Redemption payout in USDC on REDEEM rows; `null` otherwise. */
	payout_usdc?: number | null;
	/** Proxy wallet the action belongs to. */
	proxy_wallet?: string | null;
	/** Event time (epoch seconds). */
	timestamp?: number | null;
	/** Hash of the settling transaction. */
	transaction_hash?: string | null;
	/** Canonical action verb; SPLIT / MERGE / CONVERT / COMPRESS / WRAP / UNWRAP / REDEEM. The only action field on the wire; `timestamp` is the served event clock. */
	type?: string | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/activity/combos`. */
export type PolymarketDataComboActivityPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataComboActivity> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** One leg of a combo, with its market and event enrichment. */
export type PolymarketDataComboLeg = {
	/** On-chain condition id of the leg's market. */
	leg_condition_id?: string | null;
	/** Live price of the leg outcome (Gamma marks). */
	leg_current_price?: number | null;
	/** Position of the leg within the combo, 0-based. */
	leg_index?: number | null;
	/** Index of the outcome the combo takes on this leg; `999` means the outcome could not be labeled. */
	leg_outcome_index?: number | null;
	/** Label of the outcome the combo takes on this leg. */
	leg_outcome_label?: string | null;
	/** Outcome token id of the leg. */
	leg_position_id?: string | null;
	/** Gamma `closed_time`, RFC3339; `null` while open. */
	leg_resolved_at?: string | null;
	/** OPEN / RESOLVED_WIN / RESOLVED_LOSS (live resolution state). */
	leg_status?: string | null;
	/** The leg's market, with its (single) event nested. */
	market?: PolymarketDataComboLegMarket | null;
	[key: string]: unknown;
};

/** A leg market's event. */
export type PolymarketDataComboLegEvent = {
	/** Gamma event id. */
	event_id?: string | null;
	/** Event image URL. */
	event_image?: string | null;
	/** Event slug; the URL segment on polymarket.com. */
	event_slug?: string | null;
	/** Event title. */
	event_title?: string | null;
	[key: string]: unknown;
};

/** A leg's market, with its (single) event nested. */
export type PolymarketDataComboLegMarket = {
	/** Gamma market category (e.g. `sports`). */
	category?: string | null;
	/** Market end date, RFC3339; empty when Gamma has none. */
	end_date?: string | null;
	/** The market's parent event. */
	event?: PolymarketDataComboLegEvent | null;
	/** Raw short per-leg label, without the fallback `title` applies; `""` when Gamma has none. */
	group_item_title?: string | null;
	/** Market icon URL. */
	icon_url?: string | null;
	/** Market image URL. */
	image_url?: string | null;
	/** The sports line the market is quoted on; `null` when it has none. */
	line?: number | null;
	/** Gamma's own market id; NOT the on-chain condition id (that is the leg's `leg_condition_id`). */
	market_id?: string | null;
	/** Label of the leg's outcome on this market. */
	outcome?: string | null;
	/** The market's outcome labels, in outcome-index order; `[]` when Gamma has none. Together with `sports_market_type` and `line`, this lets an executed combo card render both sides of a leg without a Gamma lookup. */
	outcomes?: Array<string> | null;
	/** The market's full question. Serves `""` when Gamma has none. The five display-metadata fields below default when absent so cached payloads written before they existed still deserialize; the query always serves them. */
	question?: string | null;
	/** Market slug; the URL segment on polymarket.com. */
	slug?: string | null;
	/** Granular sports market type (for example `totals` or `anytime_touchdowns`); `""` for non-sports markets. */
	sports_market_type?: string | null;
	/** Gamma market subcategory. */
	subcategory?: string | null;
	/** Reserved; always `[]` today. */
	tags?: Array<string> | null;
	/** Short per-leg label (`group_item_title`), falling back to the question. */
	title?: string | null;
	[key: string]: unknown;
};

/** One combo position (`/v2/positions/combos`); a user's holding in a single combo outcome, with leg rollups and enrichment. Paginated on `(first_entry_at_micros, combo_condition_id, outcome_index)`; follow the response's `next_cursor` rather than rebuilding that triple. */
export type PolymarketDataComboPosition = {
	/** On-chain combo condition id (structural, `0x03`-prefixed). */
	combo_condition_id?: string | null;
	/** Token id of the combo position. */
	combo_position_id?: string | null;
	/** Current holding in shares. */
	current_size?: number | null;
	/** Weighted-average entry price per share, in USDC. */
	entry_avg_price_usdc?: number | null;
	/** Entry cost basis in USDC (rounded weighted-average form). */
	entry_cost_usdc?: number | null;
	/** Attributed BUY-fee portion of `gross_entry_cost_usdc`, 6-decimal grain. SELL fees are exit costs and are excluded. */
	entry_fees_usdc?: number | null;
	/** First acquisition time, RFC3339. */
	first_entry_at?: string | null;
	/** Epoch-micros of `first_entry_at`; `null`/absent on the NULL tail. */
	first_entry_at_micros?: number | null;
	/** Exact fee-inclusive entry basis at 6-decimal grain; formatting to 6 dp recovers the stored value. Do NOT reconstruct it as `entry_cost_usdc + entry_fees_usdc`; `entry_cost_usdc` is rounded WAC; the fee-exclusive basis is `gross_entry_cost_usdc − entry_fees_usdc`. */
	gross_entry_cost_usdc?: number | null;
	/** The combo's legs, in leg order, with market and event enrichment. */
	legs?: Array<PolymarketDataComboLeg> | null;
	/** Legs still awaiting resolution. */
	legs_pending?: number | null;
	/** Legs whose markets have resolved. */
	legs_resolved?: number | null;
	/** Number of legs in the combo. */
	legs_total?: number | null;
	/** Index of the combo outcome held; `999` means unlabelable. */
	outcome_index?: number | null;
	/** Label of the combo outcome held. */
	outcome_label?: string | null;
	/** The holder's wallet. `proxy_wallet` on every /v2 response; `user` is the REQUEST param vocabulary, never a response field (2026-08-19). */
	proxy_wallet?: string | null;
	/** Gross redemption payout received so far in USDC; turnover, not profit; net result = payout minus `gross_entry_cost_usdc`. */
	realized_payout_usdc?: number | null;
	/** Whether the combo can be redeemed now. */
	redeemable?: boolean | null;
	/** When the combo fully resolved, RFC3339; `null` while any leg is open. */
	resolved_at?: string | null;
	/** Lifecycle state of the position (OPEN, REDEEMABLE, RESOLVED_WIN, RESOLVED_LOSS, RESOLVED_PARTIAL). */
	status?: string | null;
	/** Last event touching the position, RFC3339. */
	updated_at?: string | null;
	/** Epoch-micros of `updated_at`. */
	updated_at_micros?: number | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/positions/combos`. */
export type PolymarketDataComboPositionsPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataComboPosition> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** One `/v2/live-volume` row: `taker_volume` is the market's cumulative one-side (taker) volume, truncated to 6 decimal places; qualified because the boards' `volume` is both-sides, and two measures must not share a name. */
export type PolymarketDataConditionVolume = {
	/** On-chain condition id of the market (`0x` hex). */
	condition_id?: string | null;
	/** Cumulative one-side (taker) volume in shares, truncated to 6 decimals. */
	taker_volume?: number | null;
	[key: string]: unknown;
};

/** One ingestion stream's distance from the furthest-along stream. */
export type PolymarketDataCursorLag = {
	/** How many blocks this stream trails the furthest-along stream; `0` for the leader. */
	behind_max?: number | null;
	/** Last block the stream has ingested through. */
	block?: number | null;
	/** The stream this cursor belongs to, as `_`. */
	source?: string | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeApprovals = {
	/** Non-paginated approval snapshot for one Polygon proxy wallet. */
	data?: {
		/** The checked wallet. */
		address?: string | null;
		/** EVM chain id the state was read on (137 = Polygon). */
		chain_id?: number | null;
		/** When the on-chain state was read, RFC3339 UTC (20-second server cache). */
		checked_at?: string | null;
		/** One row per catalog pair the wallet may need. */
		contracts?: Array<PolymarketDataApprovalContract> | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeLiveVolume = {
	/** `/v2/live-volume`: one entry per market in the requested event(s), ordered by `taker_volume` descending, plus `taker_volume_total`; their sum. Events that resolve to no markets serve `{ taker_volume_total: 0.0, conditions: [] }`. */
	data?: {
		/** One row per market under the requested event(s), `taker_volume` descending; empty when the events resolve to no markets. */
		conditions?: Array<PolymarketDataConditionVolume> | null;
		/** Sum of the rows' `taker_volume`, in shares. */
		taker_volume_total?: number | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeOptionLeaderboardUserEntry = {
	data?: {
		/** Window PnL in USDC, same semantics as the board rows (finite windows marked, `all` realized-only). */
		pnl?: number | null;
		/** Profile image URL. */
		profile_image?: string | null;
		/** `None` when unranked on the PnL board. */
		rank_pnl?: number | null;
		/** `None` when unranked on the volume board. */
		rank_volume?: number | null;
		/** The looked-up wallet. */
		user_id?: string | null;
		/** Profile display name of the wallet. */
		user_name?: string | null;
		/** Profile verification badge. */
		verified?: boolean | null;
		/** Both-sides traded volume in shares; never USD. */
		volume?: number | null;
		/** Linked X handle, when one exists. */
		x_username?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeOptionUserStats = {
	data?: {
		all_time_pnl?: PolymarketDataUserPnlPoint | null;
		/** Largest single resolved win, in USDC. */
		biggest_win?: number | null;
		/** Epoch seconds, or `null` when the join date is unknown. */
		join_date?: number | null;
		/** The proxy wallet these lifetime statistics describe. */
		proxy_wallet?: string | null;
		/** Distinct markets the wallet traded; an exact count. */
		trades?: number | null;
		/** Profile view count. */
		views?: number | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopePortfolioValue = {
	/** `/v2/value`: the user's portfolio value; single-market holdings marked to market plus unresolved combo positions at cost basis, rounded to 4 decimals. Always exactly one row; a user with no positions returns `{ proxy_wallet, value: 0 }`. */
	data?: {
		/** The wallet the value was computed for. */
		proxy_wallet?: string | null;
		/** Portfolio value in USDC, rounded to 4 decimals: holdings marked to market plus non-terminal combos at cost basis. */
		value?: number | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeServiceStatus = {
	/** `/v2/status` payload. Served from a snapshot refreshed in the background, never computed on the request. `computed_at`/`age_seconds` make that explicit rather than implicit: if the refresher wedges or its datastore goes away, the answer keeps being served with a growing age instead of turning… */
	data?: {
		/** How old the snapshot is, in seconds. Normally under the refresh interval; a value that keeps climbing means the refresher is not completing, and the freshness figures below are that stale ON TOP of whatever lag they report. */
		age_seconds?: number | null;
		/** When this snapshot was taken, RFC 3339 in UTC. */
		computed_at?: string | null;
		ingestion?: PolymarketDataIngestionFreshness | null;
		serving?: PolymarketDataServingFreshness | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeUserPnlSeries = {
	/** Complete v2 user-PnL response data. */
	data?: {
		/** Grid step the points were synthesized on (`1d`, `18h`, `12h`, `3h`, `1h`). */
		fidelity?: string | null;
		/** The window served (`max`, `all`, `1m`, `1w`, `1d`, `12h`, `6h`). */
		interval?: string | null;
		/** Dense cumulative points on the requested grid, oldest first. */
		points?: Array<PolymarketDataUserPnlPoint> | null;
		/** The wallet the series was computed for. */
		proxy_wallet?: string | null;
		/** Historical MVP observations are daily even when carried onto a finer grid. */
		source_fidelity?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeUserVolume = {
	/** `/v2/user-volume`: one wallet's trading volume over a whole-day window, in both units side by side. `volume` is both-sides SHARES; `volume_usdc` is the same measure in USD; the bare name is the natural unit and `_usdc` is the denomination, the same pairing as `current_size` / `entry_cost_usdc`… */
	data?: {
		/** Number of fills in the window. */
		trade_count?: number | null;
		/** Both-sides traded volume over the window, in shares. */
		volume?: number | null;
		/** Both-sides cash volume over the window, in USD. */
		volume_usdc?: number | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeVecBuilderVolumePoint = {
	data?: Array<{
		/** Distinct active users attributed in that bucket. */
		active_users?: number | null;
		/** Stable identifier of the builder. */
		builder_code?: string | null;
		/** Builder display name; cosmetic; key on `builder_code`. */
		builder_name?: string | null;
		/** Bucket start date, `YYYY-MM-DD` (UTC); `interval` sets the width. */
		date?: string | null;
		/** Builder profile image URL. */
		profile_image?: string | null;
		/** Builder's rank within that bucket. */
		rank?: number | null;
		/** Whether the builder is verified. */
		verified?: boolean | null;
		/** Volume attributed in that bucket, in shares. */
		volume?: number | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeVecOpenInterest = {
	data?: Array<{
		/** Condition id the row answers for; `GLOBAL` on the parameterless global figure. */
		condition_id?: string | null;
		/** Priced gross open interest in USDC; `0.0` when nothing is held. */
		value?: number | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeVecResolution = {
	data?: Array<{
		/** Condition id the row answers for; absent on question-keyed rows. */
		condition_id?: string | null;
		/** Estimated settlement time in RFC3339 UTC, not a guaranteed resolution deadline. Omitted when timing is unavailable; clients must not derive a deadline from `last_update_timestamp` or assume that an unresolved vote settles in its first round. */
		expected_settlement_time?: string | null;
		/** True while a managed proposal sits past its normal expiry in extended review; always false outside that window. */
		extended_review?: boolean | null;
		/** Latest lifecycle change: an epoch-seconds string on question-keyed rows, RFC3339 UTC on condition-keyed rows. */
		last_update_timestamp?: string | null;
		/** Log index of the latest lifecycle event, as a numeric string; empty where `transaction_hash` is empty. */
		log_index?: string | null;
		/** BINARY, INCREMENTAL_NEGRISK or ATOMIC_NEGRISK; condition-keyed rows only. */
		market_type?: string | null;
		/** Whether the question rules were updated after posing. */
		new_version_q?: boolean | null;
		/** Per-outcome payout in micro-USDC per share, `[outcome0, outcome1]`; present on resolved condition-keyed rows. */
		payouts?: Array<number> | null;
		/** Final settlement price, same conventions as `proposed_price`. */
		price?: string | null;
		/** Price of the first proposal as a numeric string; `69` means unset. Present on question-keyed rows only. */
		proposed_price?: string | null;
		/** UMA question id serving the row; absent on condition-keyed rows. */
		question_id?: string | null;
		/** Reporter family that resolved it: UMA_OO, CHAINLINK or EOA. */
		reporter?: string | null;
		/** Price of the second proposal, same conventions as `proposed_price`. */
		reproposed_price?: string | null;
		/** `reported` (an oracle reported it) or `derived` (a neg-risk sibling resolution no client can reconstruct). */
		resolution_source?: string | null;
		/** When the condition resolved, RFC3339 UTC. */
		resolved_at?: string | null;
		/** Block the condition resolved at. */
		resolved_block?: number | null;
		/** How `expected_settlement_time` was derived: `managed_proposal_expiration` or `proposal_expiration` (end of a live proposal's challenge window), `liveness` (end of a proposal window on the v2 oracle) or `dvm_round_estimate` (earliest end of the voting round a disputed market can settle in);… */
		settlement_time_basis?: string | null;
		/** Lifecycle state: initialized, posed, proposed, challenged, reproposed, disputed or resolved; condition-keyed rows can also serve active and arbitration. */
		status?: string | null;
		/** Transaction of the latest lifecycle event; empty on condition-keyed rows without one. */
		transaction_hash?: string | null;
		/** Whether arbitration was triggered on the request. */
		was_arbitrated?: boolean | null;
		/** Whether the resolution was disputed at any point. */
		was_disputed?: boolean | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

/** `{ "data": T }`; the envelope for endpoints that don't paginate. There is no `pagination` key: an aggregate or bounded list has no next page. Paginated feeds return a `*Page` shape (`{ data, pagination }`) instead. */
export type PolymarketDataEnvelopeVecTokenRef = {
	data?: Array<{
		/** Position of the token in the market's CLOB token list; null until the settlement writer has placed the token, and always null outside `v1_ctf`. */
		clob_index?: number | null;
		/** Whether the market is closed; null when the market is not mirrored. */
		closed?: boolean | null;
		/** The market's condition id in its 66-character form, the value the other routes carry on their rows. */
		condition_id?: string | null;
		/** Lowest event id the market belongs to; null when none is mirrored. */
		event_id?: number | null;
		/** Slug of that event; null when none is mirrored. */
		event_slug?: string | null;
		/** Payout rate of the token once resolved (0 lost, 1 won, fractions for split payouts); null while unresolved. */
		final_price?: number | null;
		/** Market slug; null when the market is not mirrored. */
		market_slug?: string | null;
		/** The contract family that issued the token: `v1_ctf` is the ConditionalTokens market (module 0), every other value is a polymarket-v2 module. */
		module?: PolymarketDataTokenModule | null;
		/** Whether the market belongs to a neg-risk structure; null when the market is not mirrored. */
		neg_risk?: boolean | null;
		/** The neg-risk structure's market id; null outside neg-risk markets. */
		neg_risk_market_id?: string | null;
		/** The other token of a two-outcome condition; null otherwise. */
		opposite_token_id?: string | null;
		/** Outcome label from the market's outcome list; null when no label slot applies or the market is not mirrored. */
		outcome?: string | null;
		/** On-chain outcome slot of the token within its condition. */
		outcome_index?: number | null;
		/** Index of the market inside its neg-risk structure: for `v1_ctf` the last byte of the question id, for `neg_risk` the last byte of the polymarket-v2 condition id; null outside neg-risk markets. */
		question_index?: number | null;
		/** True once the token has an on-chain payout. */
		resolved?: boolean | null;
		/** The on-chain polymarket-v2 condition id of the token in its 66-character form (the id a combo leg carries as `leg_condition_id`, plus the `00` byte); null for `v1_ctf`, whose only id is `condition_id`. On a native polymarket-v2 market it equals `condition_id`; on a market carried over to… */
		structural_condition_id?: string | null;
		/** Market question; null when the market is not mirrored. */
		title?: string | null;
		/** Decimal ERC-1155 token id, as a string. */
		token_id?: string | null;
		[key: string]: unknown;
	}> | null;
	[key: string]: unknown;
};

/** One `/v2/holders` row: a market holder enriched with their public profile, netted across the market's outcome tokens by default or at per-side gross grain with the position economics when `include_pnl=true`. `profile_image_optimized` is always empty. */
export type PolymarketDataHolder = {
	/** Holding in shares. By default the NET figure (a fully hedged wallet nets to `0.0` and only appears at `min_balance=0`); with `include_pnl=true` the per-side GROSS figure, so each side of a hedged wallet appears under its own token with that side's full size. */
	amount?: number | null;
	/** Historical entry price per share. Served only with `include_pnl=true`. */
	avg_price?: number | null;
	/** Profile bio text. */
	bio?: string | null;
	/** Current price of the held outcome token, bounded to `[0, 1]`. Served only with `include_pnl=true`. */
	current_price?: number | null;
	/** Mark value of the holding: `amount` times `current_price`. Served only with `include_pnl=true`. */
	current_value?: number | null;
	/** Whether the profile chose to show its name publicly. */
	display_username_public?: boolean | null;
	/** Cost basis of the held size in USDC, excluding entry fees. Served only with `include_pnl=true`. */
	entry_cost_usdc?: number | null;
	/** Profile display name of the wallet. */
	name?: string | null;
	/** Index of the held outcome within the market; `999` means unlabelable. */
	outcome_index?: number | null;
	/** Profile image URL. */
	profile_image?: string | null;
	/** Resized profile image URL, when one exists. */
	profile_image_optimized?: string | null;
	/** The holding wallet. */
	proxy_wallet?: string | null;
	/** Generated fallback handle for profiles without a display name. */
	pseudonym?: string | null;
	/** Profit already locked in by sells and redemptions. Served only with `include_pnl=true`. */
	realized_pnl?: number | null;
	/** Outcome token held. */
	token_id?: string | null;
	/** Total profit and loss; always `realized_pnl + unrealized_pnl`. Served only with `include_pnl=true`. */
	total_pnl?: number | null;
	/** Mark-to-market profit on the held size: `current_value` minus `entry_cost_usdc`. Served only with `include_pnl=true`. */
	unrealized_pnl?: number | null;
	/** Profile verification badge. */
	verified?: boolean | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/holders`; an offset-cursor feed (per outcome token): the offset lives behind the opaque token, never on the wire. */
export type PolymarketDataHoldersPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataMetaHolder> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** Ingestion health: one cursor per `(contract, event)` stream. Every figure here is over the LIVE streams only. Streams that are dormant by design sit arbitrarily far behind forever; they are dropped outright rather than reported and flagged, because there is nothing a consumer could do with them… */
export type PolymarketDataIngestionFreshness = {
	/** The chain id this service is configured for. Echoed so the pairing above is readable in one response. */
	chain_id?: number | null;
	/** How many live streams were found. `0` means no ingestion cursors are visible to this API at all. */
	cursors?: number | null;
	/** The furthest-behind live streams, `most_lagged` first. */
	lagging?: Array<PolymarketDataCursorLag> | null;
	/** The tail: the furthest-along cursor. Every `behind_max` is measured against it, and so is each serving mechanism's `blocks_behind`. */
	max_synced_block?: number | null;
	/** The furthest-behind LIVE stream's block. Deliberately asymmetric with `max_synced_block` above, which is over ALL cursors: the tail must not move with the dormant cut, or excluding a stream would redefine the distance every other stream is measured against. */
	min_synced_block?: number | null;
	most_lagged?: PolymarketDataCursorLag | null;
	/** The chain the ingestion cursors were written for, as the datastore itself names it; NOT as this service is configured. Compared against `chain_id`, it catches a datastore pointed at the wrong chain, which otherwise presents as data that is merely wrong. `null` when no stream declares one. */
	network?: string | null;
	[key: string]: unknown;
};

/** One `/v2/leaderboard` row: a user's standing on the ranked board. `pnl` is realized USDC over the window, base and combo positions unified. `volume` is both-sides SHARES, not USDC. `rank` is a competition rank; tied users share one, and the next rank skips. */
export type PolymarketDataLeaderboardEntry = {
	/** Window PnL in USDC. Finite windows (day/week/month) are the MARKED equity change net of flows; realized plus mark moves; `all` is the realized-only lifetime ledger. The two deliberately differ. */
	pnl?: number | null;
	/** Profile image URL. */
	profile_image?: string | null;
	/** Rank on the requested board; ties share a rank and the next skips. */
	rank?: number | null;
	/** The ranked wallet. */
	user_id?: string | null;
	/** Profile display name of the wallet. */
	user_name?: string | null;
	/** Profile verification badge. */
	verified?: boolean | null;
	/** Both-sides traded volume in shares; never USD. */
	volume?: number | null;
	/** Linked X handle, when one exists. */
	x_username?: string | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/leaderboard`; an offset-cursor board. `rank` ties and skips, so the offset behind the token is the only sound way to page; never derive a page from a rank. */
export type PolymarketDataLeaderboardPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataLeaderboardEntry> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** Either arm's body. `?user=` answers with one standing; everything else with a page of the board; genuinely different shapes, so the spec says `oneOf` rather than pretending one covers both. */
export type PolymarketDataLeaderboardResponse =
	| PolymarketDataLeaderboardPage
	| PolymarketDataEnvelopeOptionLeaderboardUserEntry;

/** One outcome token's holder group in `/v2/holders`: the `token_id` and its holders, top-N by net balance. A multi-market request interleaves tokens across the page, so merge groups by `token_id`, not by array position. */
export type PolymarketDataMetaHolder = {
	/** Top holders of that token, amount descending (net by default, per-side gross with `include_pnl=true`). */
	holders?: Array<PolymarketDataHolder> | null;
	/** The outcome token this group ranks. */
	token_id?: string | null;
	[key: string]: unknown;
};

export type PolymarketDataPagination = {
	/** Exact: `true` iff another page exists; probe-based, never inferred from page fullness. */
	has_more?: boolean | null;
	/** Page size this page was served with. */
	limit?: number | null;
	/** Opaque, signed cursor for the next page; `null` on the last page. */
	next_cursor?: string | null;
	/** Running item offset for display continuity across keyset pages (the cursor drives the actual seek; this is cosmetic; there is no total). */
	offset?: number | null;
	[key: string]: unknown;
};

/** One position (`/v2/positions`); a holding in a single outcome token, priced and enriched. The shape is **uniform across all three arms** (user OPEN/REDEEMABLE, user CLOSED, market-anchored): clients never branch on which spine answered. On the CLOSED arm… */
export type PolymarketDataPosition = {
	/** Whether the market is archived; tells a caller using `includeArchived` which rows the flag surfaced. */
	archived?: boolean | null;
	/** Weighted-average entry price per share, in USDC. */
	avg_price?: number | null;
	/** The on-chain condition id. */
	condition_id?: string | null;
	/** Live mark per share, in USDC. */
	current_price?: number | null;
	/** The CURRENT holding, in shares (~0 residual on the CLOSED arm). */
	current_size?: number | null;
	/** `current_size × current_price`, in USDC. */
	current_value?: number | null;
	/** Market end date, `YYYY-MM-DD`; `1970-01-01` when Gamma has none. */
	end_date?: string | null;
	/** The fee-EXCLUSIVE entry basis. */
	entry_cost_usdc?: number | null;
	/** Attributed BUY-fee total for the position. Disclosure only: `entry_cost_usdc` is already fee-exclusive, so never re-deduct this from a PnL column. */
	entry_fees_usdc?: number | null;
	/** Gamma event id of the parent event. */
	event_id?: string | null;
	/** Parent event slug. */
	event_slug?: string | null;
	/** Parent event title; `""` when Gamma has none. */
	event_title?: string | null;
	/** First acquisition of the position (buy, split, mint, transfer in), epoch seconds; 0 when no acquisition is recorded. */
	first_entry_at?: number | null;
	/** Gamma's short label for this market inside a multi-market event (e.g. `Rene Haas` under `Next CEO of NVIDIA?`); `""` for single-market events. */
	group_item_title?: string | null;
	/** Market icon URL. */
	icon?: string | null;
	/** The row's last economics event, epoch seconds; 0 without native state. */
	last_event_at?: number | null;
	/** Whether the wallet also holds the opposite outcome, so the pair can merge back into collateral. */
	mergeable?: boolean | null;
	/** Profile display name of the wallet. */
	name?: string | null;
	/** Whether the market belongs to a neg-risk group. */
	negative_risk?: boolean | null;
	/** Label of the market's other outcome; what a merge pairs with. */
	opposite_outcome?: string | null;
	/** Token id of the market's other outcome. */
	opposite_token_id?: string | null;
	/** Label of the held outcome (e.g. `Yes`). */
	outcome?: string | null;
	/** Index of the held outcome within the market; `999` means the outcome could not be labeled. */
	outcome_index?: number | null;
	/** `(current_value - entry_cost_usdc) / entry_cost_usdc`, as a percent. Fee-exclusive basis, and the numerator is `unrealized_pnl`; not `total_pnl / total_cost_usdc`. */
	percent_pnl?: number | null;
	/** `(current_value - total_size × avg_price) / (total_size × avg_price)`, as a percent. A compatibility shape: despite the name, it is not `realized_pnl` over a basis. */
	percent_realized_pnl?: number | null;
	/** Profile image URL. */
	profile_image?: string | null;
	/** Proxy wallet holding the position. */
	proxy_wallet?: string | null;
	/** Realized PnL in USDC, cumulative for the position. */
	realized_pnl?: number | null;
	/** Whether the position can be redeemed now: its market resolved and the tokens are still held (losing sides included; redeemable ≠ won). */
	redeemable?: boolean | null;
	/** Market slug; the URL segment on polymarket.com. */
	slug?: string | null;
	/** The row's actual state; can be narrower than the requested `status`, since an `OPEN` request also returns `REDEEMABLE` rows. */
	status?: string | null;
	/** Market question title (Gamma enrichment; empty when unenriched). */
	title?: string | null;
	/** The outcome token id. */
	token_id?: string | null;
	/** Gross (fee-INCLUSIVE) basis. Always exactly `entry_cost_usdc + entry_fees_usdc`; the contract sums the two served columns, so the identity holds on every row of every arm. */
	total_cost_usdc?: number | null;
	/** Always equals `realized_pnl + unrealized_pnl`. */
	total_pnl?: number | null;
	/** LIFETIME bought shares (the WAC denominator), never the current balance; that is `current_size`. */
	total_size?: number | null;
	/** Unrealized (mark-to-market) PnL: `current_value - entry_cost_usdc`. */
	unrealized_pnl?: number | null;
	/** Profile verification badge. */
	verified?: boolean | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/positions`. */
export type PolymarketDataPositionsPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataPosition> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** `{ data, summary, pagination }`: `summary` is present on the first page only. */
export type PolymarketDataPositionsSnapshotPage = {
	/** The page's positions, in the walk's stable order (not `asset` order). */
	data?: Array<PolymarketDataSnapshotPosition> | null;
	/** Page size, display offset, `has_more` and the `next_cursor` to follow. */
	pagination?: PolymarketDataPagination | null;
	summary?: PolymarketDataSnapshotSummary | null;
	[key: string]: unknown;
};

/** One served point. */
export type PolymarketDataPricePoint = {
	/** Price in the range 0…1. Always a JSON number. */
	price?: number | null;
	/** Width of the window this price was observed in: `0` for an exact tick, the bucket width for an aggregate. So the price was observed within `[timestamp, timestamp + resolution_seconds)`, and a caller can tell whether that is precise enough. Per-point rather than per-response because points in one… */
	resolution_seconds?: number | null;
	/** The OBSERVATION's own time, epoch seconds, never the time that was asked for. A raw tick reports the tick; an aggregate reports its bucket start. */
	timestamp?: number | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/prices-history`. The terminal point (the latest observation inside the window) is part of the series and lands on the final page, so a client that wants the freshest value on a multi-page series follows the cursor to the end. */
export type PolymarketDataPricesHistoryPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataPricePoint> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** What API consumers actually experience: the projections behind the feeds. One headline number and the name of whichever mechanism produced it, so a single stalled projection cannot hide behind two healthy ones; the same shape as `ingestion.most_lagged`, for the same reason. */
export type PolymarketDataServingFreshness = {
	/** The worst age across `mechanisms`. `null` only when no mechanism reported at all. */
	lag_seconds?: number | null;
	/** Every mechanism that produced a candidate freshness row, in a fixed order; `worst` names the culprit. */
	mechanisms?: Array<PolymarketDataServingMechanism> | null;
	/** Which mechanism `lag_seconds` came from. */
	worst?: string | null;
	[key: string]: unknown;
};

/** One serving mechanism's freshness. */
export type PolymarketDataServingMechanism = {
	/** Seconds since it last advanced, by its own clock. */
	age_seconds?: number | null;
	/** How far behind the ingestion tail it has projected. Absent for a mechanism that records a time but no block. */
	blocks_behind?: number | null;
	/** What this mechanism produces: `activity_feed`, `custody_balances`, `pnl`. */
	name?: string | null;
	[key: string]: unknown;
};

/** One position held at the end of the day, valued at the cut. */
export type PolymarketDataSnapshotPosition = {
	/** The ERC-1155 token id, decimal. */
	asset?: string | null;
	/** `cost_basis / size`, entry fees included (`/v2/positions` reports its `avg_price` without fees). */
	avg_price?: number | null;
	/** The market's condition id (66 characters), or the combo condition id of a combo position; null when the token is unknown. */
	condition_id?: string | null;
	/** The remaining cost basis of the shares in USDC, entry fees included (the `total_cost_usdc` of the same position on `/v2/positions`). */
	cost_basis?: number | null;
	/** The slug of the market's Gamma event; null for combos. */
	event_slug?: string | null;
	/** The contract family: 0 ConditionalTokens, 1 and 2 polymarket-v2 binary and neg-risk, 3 combo, 4 directional. */
	module?: number | null;
	/** The outcome label; `Yes` or `No` for a combo. */
	outcome?: string | null;
	/** The price at the cut: the payout for `settlement`, the mark (0 to 1) for `mark`, and `avg_price` for `basis`, which can exceed 1. */
	price?: number | null;
	/** Where `price` came from: `settlement` (the market resolved before the cut: its payout), `mark` (the last market price recorded at a midnight on or before the day), or `basis` (no price: the average price, so `value` equals `cost_basis`). */
	price_source?: string | null;
	/** Shares held at the end of the day. */
	size?: number | null;
	/** The current Gamma market slug; null for combos. */
	slug?: string | null;
	/** The current Gamma market question; null for combos. */
	title?: string | null;
	/** `size * price`. */
	value?: number | null;
	[key: string]: unknown;
};

/** The totals of every position of the day; on the first page only. */
export type PolymarketDataSnapshotSummary = {
	/** The highest block of the day's recorded moves. */
	closed_block?: number | null;
	/** The remaining cost basis of every position, in USDC. */
	cost_basis?: number | null;
	/** The cut, `date + 1 day` at 00:00:00Z (RFC 3339). */
	cut?: string | null;
	/** The requested day, `YYYY-MM-DD`. */
	date?: string | null;
	/** Positions held at the end of the day (every page together). */
	positions?: number | null;
	/** The value of every position at the cut, in USDC. */
	value?: number | null;
	/** `value` split by `price_source`. */
	value_by_source?: PolymarketDataSnapshotValueBySource | null;
	[key: string]: unknown;
};

/** `value` split by `price_source`. */
export type PolymarketDataSnapshotValueBySource = {
	/** Value of the positions with no price (their cost basis). */
	basis?: number | null;
	/** Value of the positions priced at a recorded midnight market price. */
	mark?: number | null;
	/** Value of the positions whose market resolved before the cut. */
	settlement?: number | null;
	[key: string]: unknown;
};

/** The contract family that issued a token. `v1_ctf` is the ConditionalTokens market (module 0); every other value is a polymarket-v2 module. */
export type PolymarketDataTokenModule = string;

/** A trade (`/v2/trades`). */
export type PolymarketDataTrade = {
	/** Profile bio text. */
	bio?: string | null;
	/** On-chain condition id of the market (`0x` hex). */
	condition_id?: string | null;
	/** Parent event slug. */
	event_slug?: string | null;
	/** Market icon URL. */
	icon?: string | null;
	/** Profile display name of the wallet. */
	name?: string | null;
	/** Label of the traded outcome (e.g. `Yes`). */
	outcome?: string | null;
	/** Index of the traded outcome within the market; `999` means the outcome could not be labeled. */
	outcome_index?: number | null;
	/** Execution price per share, in USDC. */
	price?: number | null;
	/** Profile image URL. */
	profile_image?: string | null;
	/** Resized profile image URL, when one exists. */
	profile_image_optimized?: string | null;
	/** Proxy wallet the row belongs to; the address every wallet-keyed endpoint accepts as `user`. */
	proxy_wallet?: string | null;
	/** Generated fallback handle for profiles without a display name. */
	pseudonym?: string | null;
	/** `BUY` or `SELL`, from this wallet's perspective. */
	side?: string | null;
	/** Filled quantity in shares; bare sizes are shares, never USD. */
	size?: number | null;
	/** Market slug; the URL segment on polymarket.com. */
	slug?: string | null;
	/** Block timestamp of the fill, epoch seconds. */
	timestamp?: number | null;
	/** Market question title (Gamma enrichment; empty when unenriched). */
	title?: string | null;
	/** CLOB asset id of the traded outcome token. */
	token_id?: string | null;
	/** Hash of the settling transaction. */
	transaction_hash?: string | null;
	[key: string]: unknown;
};

/** `{ data, pagination }` envelope for `/v2/trades`. */
export type PolymarketDataTradesPage = {
	/** The page's rows. */
	data?: Array<PolymarketDataTrade> | null;
	/** Paging envelope: follow `next_cursor` until `null`. */
	pagination?: PolymarketDataPagination | null;
	[key: string]: unknown;
};

/** One dense cumulative v2 chart point in USDC. Nullable values mean the historical source or mark was unavailable. Clients must not coerce them to zero. */
export type PolymarketDataUserPnlPoint = {
	/** `deposits - withdrawals`. */
	cashflow_net?: number | null;
	/** Collateral moved into the wallet. */
	deposits?: number | null;
	/** `position_pnl + wallet_income`; the all-in economic result. */
	economic_pnl?: number | null;
	/** Negative cumulative fee charges, for direct chart composition. */
	fees?: number | null;
	/** Refunds minus charges; a disclosure, not another PnL adjustment. */
	fees_paid?: number | null;
	/** Fee atom: total fees refunded. */
	fees_refunded?: number | null;
	/** Maker-side fee rebates credited. */
	maker_rebate?: number | null;
	/** `realized_pnl + unrealized_pnl`; the position-only result. */
	position_pnl?: number | null;
	/** Realized PnL from combo positions. */
	realized_combo_pnl?: number | null;
	/** Realized PnL from AMM liquidity-provision activity. */
	realized_lp_pnl?: number | null;
	/** Realized PnL from market positions. */
	realized_market_pnl?: number | null;
	/** `realized_market_pnl + realized_lp_pnl + realized_combo_pnl`. */
	realized_pnl?: number | null;
	/** Referral income credited. */
	referral_income?: number | null;
	/** Reward-program income credited. */
	reward_income?: number | null;
	/** `realized_pnl + wallet_income`; settled economics, no marks. */
	settled_pnl?: number | null;
	/** Chain block the point was observed at. */
	source_block?: number | null;
	/** `reward_income + yield_income + referral_income`. */
	sponsored_income?: number | null;
	/** Taker-side fee rebates credited. */
	taker_rebate?: number | null;
	/** Point timestamp, in epoch seconds. Every amount below is CUMULATIVE through this instant, in USDC; `null` means the source is uncovered, never zero. */
	timestamp?: number | null;
	/** Cumulative maker-attributed canonical exchange fill count. */
	trade_count?: number | null;
	/** `position_pnl - realized_lp_pnl + fees_charged - fees_refunded`; the compatibility chart series (`p` on the bare user-pnl route). */
	trade_pnl?: number | null;
	/** Mark-to-market of open inventory. */
	unrealized_pnl?: number | null;
	/** Cumulative maker-attributed canonical exchange fill shares. */
	volume?: number | null;
	/** Cumulative maker-attributed canonical exchange fill cash in USDC. */
	volume_usdc?: number | null;
	/** All income credited to the wallet: rebates (maker + taker) plus reward, yield and referral income. */
	wallet_income?: number | null;
	/** Collateral moved out of the wallet. */
	withdrawals?: number | null;
	/** Yield income credited. */
	yield_income?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaBestLine = {
	id?: string | null;
	line?: number | null;
	lineType?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaClobRewards = {
	assetAddress?: string | null;
	conditionId?: string | null;
	endDate?: string | null;
	id?: string | null;
	rewardsAmount?: number | null;
	rewardsDailyRate?: number | null;
	startDate?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaComment = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	body?: string | null;
	createdAt?: string | null;
	id?: string | null;
	media?: Array<PolymarketGammaCommentMedia> | null;
	parentCommentID?: string | null;
	parentEntityID?: number | null;
	parentEntityType?: string | null;
	profile?: PolymarketGammaCommentProfile | null;
	reactionCount?: number | null;
	reactions?: Array<PolymarketGammaReaction> | null;
	replyAddress?: string | null;
	reportCount?: number | null;
	tradeAsset?: string | null;
	updatedAt?: string | null;
	userAddress?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaCommentMedia = {
	altText?: string | null;
	commentID?: number | null;
	createdAt?: string | null;
	id?: string | null;
	mediaType?: string | null;
	provider?: string | null;
	providerMediaId?: string | null;
	url?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaCommentPosition = {
	positionSize?: string | null;
	tokenId?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaCommentProfile = {
	baseAddress?: string | null;
	bio?: string | null;
	displayUsernamePublic?: boolean | null;
	isCreator?: boolean | null;
	isMod?: boolean | null;
	name?: string | null;
	positions?: Array<PolymarketGammaCommentPosition> | null;
	profileImage?: string | null;
	proxyWallet?: string | null;
	pseudonym?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaCommentsKeysetListResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Root comments and their first-level replies for the current page. */
	comments?: Array<PolymarketGammaComment> | null;
	/** Opaque cursor to pass as after_cursor when requesting the next page. Absent on the last page. */
	next_cursor?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaCount = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	count?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaCryptoMarketConfig = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	asset?: string | null;
	duration?: string | null;
	id?: string | null;
	twapEnabled?: boolean | null;
	twapLookbackSeconds?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaEvent = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	active?: boolean | null;
	archived?: boolean | null;
	automaticallyActive?: boolean | null;
	automaticallyResolved?: boolean | null;
	bestLines?: Array<PolymarketGammaBestLine> | null;
	cantEstimate?: boolean | null;
	carouselMap?: string | null;
	category?: string | null;
	closed?: boolean | null;
	closedTime?: string | null;
	color?: string | null;
	commentCount?: number | null;
	commentsEnabled?: boolean | null;
	competitive?: number | null;
	countryName?: string | null;
	createdAt?: string | null;
	createdBy?: string | null;
	creationDate?: string | null;
	cumulativeMarkets?: boolean | null;
	cyom?: boolean | null;
	deploying?: boolean | null;
	deployingTimestamp?: string | null;
	description?: string | null;
	disqusThread?: string | null;
	elapsed?: string | null;
	electionType?: string | null;
	enableNegRisk?: boolean | null;
	enableOrderBook?: boolean | null;
	endDate?: string | null;
	ended?: boolean | null;
	estimateValue?: boolean | null;
	estimatedValue?: string | null;
	eventCreators?: Array<PolymarketGammaEventCreator> | null;
	eventDate?: string | null;
	eventMetadata?: Record<string, PolymarketJsonValue> | null;
	eventWeek?: number | null;
	externalPartners?: Array<PolymarketGammaEventExternalPartnerMapping> | null;
	/** Facets the event carries, with their ancestors. Present only when the request sets include_facets=true. Read-only. */
	facets?: Array<PolymarketGammaFacet> | null;
	featured?: boolean | null;
	featuredImage?: string | null;
	featuredOrder?: number | null;
	finishedTimestamp?: string | null;
	gameId?: number | null;
	gmpChartMode?: string | null;
	icon?: string | null;
	id?: string | null;
	image?: string | null;
	isTemplate?: boolean | null;
	lastHighlight?: string | null;
	lastHighlightAt?: string | null;
	lastHighlightType?: string | null;
	liquidity?: number | null;
	liquidityAmm?: number | null;
	liquidityClob?: number | null;
	live?: boolean | null;
	markets?: Array<PolymarketGammaMarket> | null;
	/** On-chain capacity: neg-risk arity, or directional real-bucket capacity B (2..32767), excluding thresholds and Void. Null for binary events. Directional capacity is fixed at creation; condition IDs depend on it. */
	maxMarketCount?: number | null;
	/** On-chain module of a directional event; null for every other event. Server-owned, immutable from creation; read-only. */
	moduleType?: string | null;
	negRisk?: boolean | null;
	negRiskAugmented?: boolean | null;
	negRiskFeeBips?: number | null;
	negRiskMarketID?: string | null;
	new?: boolean | null;
	openInterest?: number | null;
	parentEventId?: number | null;
	pendingDeployment?: boolean | null;
	period?: string | null;
	published_at?: string | null;
	rescheduledFromGameId?: number | null;
	/** Directional event resolution mode: incremental (buckets may be appended after deployment) or atomic (all buckets exist at creation). Null for non-directional events. Server-owned, immutable from creation; read-only. */
	resolutionMode?: string | null;
	resolutionSource?: string | null;
	restricted?: boolean | null;
	scheduledDeploymentTimestamp?: string | null;
	score?: string | null;
	series?: Array<PolymarketGammaSeries> | null;
	seriesSlug?: string | null;
	showAllOutcomes?: boolean | null;
	showMarketImages?: boolean | null;
	slug?: string | null;
	sortBy?: string | null;
	sport?: PolymarketGammaSportsMetadata | null;
	spreadsMainLine?: number | null;
	startDate?: string | null;
	startTime?: string | null;
	subEvents?: Array<string | null> | null;
	subcategory?: string | null;
	subtitle?: string | null;
	tag_labels?: Array<string> | null;
	tag_slugs?: Array<string> | null;
	tags?: Array<PolymarketGammaTag> | null;
	teams?: Array<PolymarketGammaTeam> | null;
	templateVariables?: string | null;
	ticker?: string | null;
	title?: string | null;
	totalsMainLine?: number | null;
	turnProviderId?: string | null;
	tweetCount?: number | null;
	updatedAt?: string | null;
	updatedBy?: string | null;
	usId?: string | null;
	/** Protocol version of the event: v1 (legacy) or v2 (all child markets on polymarket-v2 modules). Clients must match exact values and treat unknown values as unsupported. */
	version?: string | null;
	volume?: number | null;
	volume1mo?: number | null;
	volume1wk?: number | null;
	volume1yr?: number | null;
	volume24hr?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventContext = {
	description?: string | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventCreator = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	createdAt?: string | null;
	creatorHandle?: string | null;
	creatorImage?: string | null;
	creatorName?: string | null;
	creatorUrl?: string | null;
	id?: string | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventExternalPartnerMapping = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	createdAt?: string | null;
	eventId?: number | null;
	externalId?: string | null;
	id?: number | null;
	partner?: PolymarketGammaPartner | null;
	partnerId?: number | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventInsightsBody = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	context?: PolymarketGammaEventContext | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventReference = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	archived?: boolean | null;
	id?: string | null;
	parent?: PolymarketGammaEventReferenceParent | null;
	/** String identifier matching parent.id; unlike the legacy event payload's numeric parentEventId. */
	parentEventId?: string | null;
	slug?: string | null;
	tags?: Array<PolymarketGammaEventReferenceTag> | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventReferenceMetadata = {
	league?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventReferenceParent = {
	archived?: boolean | null;
	eventDate?: string | null;
	eventMetadata?: PolymarketGammaEventReferenceMetadata | null;
	eventWeek?: number | null;
	id?: string | null;
	/** Parent seriesSlug, falling back to the first linked series slug in relation order. */
	seriesSlug?: string | null;
	slug?: string | null;
	tags?: Array<PolymarketGammaEventReferenceTag> | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventReferenceTag = {
	id?: string | null;
	slug?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventTweetCount = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	tweetCount?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventsCount = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	count?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventsKeysetListResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Status projection only: one signed continuation cursor per event, in event order. Clients can resume after a partially consumed batch. */
	event_cursors?: Array<string> | null;
	events?: Array<PolymarketGammaEvent> | null;
	next_cursor?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaEventsPagination = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	data?: Array<PolymarketGammaEvent> | null;
	pagination?: PolymarketGammaPagination | null;
	[key: string]: unknown;
};

export type PolymarketGammaFacet = {
	/** Short form of the label, such as LoL or CS2. Need not be unique. Absent when the facet has none. */
	abbreviation?: string | null;
	appliesTo?: Array<string> | null;
	label?: string | null;
	/** Parent slugs. */
	parents?: Array<string> | null;
	slug?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaFacetNode = {
	/** Short form of the label, such as LoL or CS2. Need not be unique. Absent when the facet has none. */
	abbreviation?: string | null;
	appliesTo?: Array<string> | null;
	depth?: number | null;
	label?: string | null;
	nextCursor?: string | null;
	/** Parent slugs. */
	parents?: Array<string> | null;
	slug?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaFacetTree = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	descendants?: Array<PolymarketGammaFacetNode> | null;
	facet?: PolymarketGammaFacet | null;
	nextCursor?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaFeeSchedule = {
	exponent?: number | null;
	rate?: number | null;
	rebateRate?: number | null;
	takerOnly?: boolean | null;
	[key: string]: unknown;
};

export type PolymarketGammaFeeType = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	active?: boolean | null;
	activeEventsCount?: number | null;
	description?: string | null;
	exponent?: number | null;
	feeType?: string | null;
	rate?: number | null;
	rebateRate?: number | null;
	takerOnly?: boolean | null;
	[key: string]: unknown;
};

export type PolymarketGammaGame = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Best available line values grouped by market type. */
	bestLines?: Array<PolymarketGammaGameBestLine> | null;
	/** Home/away ordering used when presenting the game teams. */
	ordering?: string | null;
	/** Sport slug associated with the game. */
	sport?: string | null;
	/** Team names or abbreviations participating in the game. */
	teams?: Array<string> | null;
	/** Market types available for the game. */
	type?: Array<string> | null;
	[key: string]: unknown;
};

export type PolymarketGammaGameBestLine = {
	/** Line value for the market type. */
	line?: number | null;
	/** Market type for this line. */
	type?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaLeagueSummary = {
	/** Number of active events in the league. */
	activeEventCount?: number | null;
	/** Number of active games in the league: the parent events among those activeEventCount counts, so a game counts once however many child events it has. A game whose parent event has closed does not count, even while its child events are still open. */
	activeGameCount?: number | null;
	/** Number of active events under the league's primary tag, without child events. Unlike activeGameCount it is not limited to the league's series, so it includes futures and props. Events dated more than seven days ago do not count; undated events do. Leagues that share a primary tag report the same… */
	activeTagEventCount?: number | null;
	/** Number of unfinished games with an enabled Combo market in the league. A parent game and its children count once. */
	comboEventsCount?: number | null;
	/** Current league week, when applicable. */
	currentWeek?: number | null;
	/** Earliest open event date for the league. */
	earliestOpenDate?: string | null;
	/** Dates that have league events available. */
	eventDates?: Array<string> | null;
	/** Weeks that have events available. */
	eventWeeks?: Array<number> | null;
	/** Whether the league currently has live events. */
	hasLive?: boolean | null;
	/** Image URL for the league. */
	image?: string | null;
	/** Display name for the league. */
	name?: string | null;
	/** Total league event volume. */
	volume?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaMakerTierBatchEntry = {
	/** The address as normalized: trimmed and lowercased */
	address?: string | null;
	/** This address's own share of wv_30d */
	own_wv_30d?: number | null;
	/** Share of the taker fee each maker fill generates, in basis points */
	rebate_bps?: number | null;
	/** UTC day (YYYY-MM-DD) whose fills this tier pays; absent when the address has no snapshot row */
	snapshot_date?: string | null;
	/** 0 when the address has no snapshot row */
	tier?: number | null;
	/** Trailing 30-day weighted volume pooled across the maker link group */
	wv_30d?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaMakerTierLadder = {
	/** First UTC day (YYYY-MM-DD) this ladder pays */
	effective_from?: string | null;
	/** Rungs by ascending tier, starting at tier 0 */
	tiers?: Array<PolymarketGammaMakerTierRung> | null;
	[key: string]: unknown;
};

export type PolymarketGammaMakerTierLadderResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** The ladder in effect today (UTC) first, then each scheduled ladder by effective_from */
	ladders?: Array<PolymarketGammaMakerTierLadder> | null;
	[key: string]: unknown;
};

export type PolymarketGammaMakerTierRung = {
	min_wv_30d?: number | null;
	rebate_bps?: number | null;
	tier?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaMakerTiersBatchResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** One entry per distinct requested address, in first-seen request order */
	tiers?: Array<PolymarketGammaMakerTierBatchEntry> | null;
	[key: string]: unknown;
};

export type PolymarketGammaMarket = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	acceptingOrders?: boolean | null;
	acceptingOrdersTimestamp?: string | null;
	acceptingOrdersUntil?: string | null;
	active?: boolean | null;
	ammType?: string | null;
	approved?: boolean | null;
	archived?: boolean | null;
	automaticallyActive?: boolean | null;
	automaticallyResolved?: boolean | null;
	bestAsk?: number | null;
	bestBid?: number | null;
	category?: string | null;
	categoryMailchimpTag?: string | null;
	chartColor?: string | null;
	clearBookOnStart?: boolean | null;
	clobRewards?: Array<PolymarketGammaClobRewards> | null;
	clobTokenIds?: string | null;
	closed?: boolean | null;
	closedTime?: string | null;
	/** Combo eligibility state: pending/enabled/disabled. May be set at creation — enabled requires a conditionId and two positionIds. After creation it can only be changed through the combo-status endpoint. */
	comboStatus?: string | null;
	commentsEnabled?: boolean | null;
	competitive?: number | null;
	conditionId?: string | null;
	createdAt?: string | null;
	createdBy?: number | null;
	creator?: string | null;
	cryptoMarketConfig?: PolymarketGammaCryptoMarketConfig | null;
	cryptoMarketConfigId?: string | null;
	curationOrder?: number | null;
	customLiveness?: number | null;
	cyom?: boolean | null;
	denominationToken?: string | null;
	deploying?: boolean | null;
	deployingTimestamp?: string | null;
	description?: string | null;
	disqusThread?: string | null;
	enableOrderBook?: boolean | null;
	endDate?: string | null;
	endDateIso?: string | null;
	eventStartTime?: string | null;
	events?: Array<PolymarketGammaEvent> | null;
	/** Facets assigned to the market, with their ancestors; a market does not carry its event's facets. Present only when the request sets include_facets=true. Read-only. */
	facets?: Array<PolymarketGammaFacet> | null;
	/** Which mechanism resolves the market once UMA reports P3 (Scalar Resolutions): none (no workflow is started; the market stays unresolved on-chain until an operator changes the mode), equal_split (50/50) or lfmp (a settlement price — the last fair market price — is supplied by the resolution… */
	fallbackResolutionType?: string | null;
	featured?: boolean | null;
	fee?: string | null;
	feeExponent?: number | null;
	feeRate?: number | null;
	feeSchedule?: PolymarketGammaFeeSchedule | null;
	feeType?: string | null;
	feesEnabled?: boolean | null;
	formatType?: string | null;
	fpmmLive?: boolean | null;
	funded?: boolean | null;
	fundedTimestamp?: string | null;
	gameId?: string | null;
	gameStartTime?: string | null;
	groupItemRange?: string | null;
	groupItemThreshold?: string | null;
	groupItemTitle?: string | null;
	hasReviewedDates?: boolean | null;
	holdingRewardsEnabled?: boolean | null;
	icon?: string | null;
	id?: string | null;
	image?: string | null;
	/** Directional instrument slot within the parent event: bucket [0,maxMarketCount), threshold [1,maxMarketCount), void at maxMarketCount. Zero is a valid bucket index; absent means not directional. Unique per (event, instrumentKind). Server-owned, immutable from creation; read-only. */
	instrumentIndex?: number | null;
	/** Directional instrument kind. Only present on directional event markets. Server-owned, immutable from creation; read-only. */
	instrumentKind?: string | null;
	lastTradePrice?: number | null;
	line?: number | null;
	liquidity?: string | null;
	liquidityAmm?: number | null;
	liquidityClob?: number | null;
	liquidityNum?: number | null;
	lowerBound?: string | null;
	lowerBoundDate?: string | null;
	mailchimpTag?: string | null;
	makerBaseFee?: number | null;
	makerRebatesFeeShareBps?: number | null;
	manualActivation?: boolean | null;
	marketGroup?: number | null;
	marketMakerAddress?: string | null;
	marketMetadata?: Record<string, PolymarketJsonValue> | null;
	marketType?: string | null;
	markets?: Array<PolymarketGammaMarket> | null;
	negRisk?: boolean | null;
	negRiskMarketID?: string | null;
	negRiskOther?: boolean | null;
	negRiskRequestID?: string | null;
	new?: boolean | null;
	notificationsEnabled?: boolean | null;
	/** Parent v2 on-chain event ID: bytes32 hex with the bottom 3 bytes zero, equal to the v2 conditionId with its conditionIndex cleared. Shared by every market of a neg-risk event. Only present on v2 markets. Read-only: derived from the v2 conditionId; writes are rejected unless echoing the stored value. */
	onchainEventId?: string | null;
	oneDayPriceChange?: number | null;
	oneHourPriceChange?: number | null;
	oneMonthPriceChange?: number | null;
	oneWeekPriceChange?: number | null;
	oneYearPriceChange?: number | null;
	orderMinSize?: number | null;
	orderPriceMinTickSize?: number | null;
	outcomePrices?: string | null;
	outcomes?: string | null;
	pastSlugs?: string | null;
	pendingDeployment?: boolean | null;
	positionIds?: Array<string> | null;
	question?: string | null;
	questionID?: string | null;
	ready?: boolean | null;
	readyForCron?: boolean | null;
	readyTimestamp?: string | null;
	/** V2 oracle request ID (bytes32 hex): the key the OracleAggregator resolves the market under. Equals the conditionId for binary and incremental neg-risk markets, and the onchainEventId for atomic neg-risk markets. Only present on v2 markets. Auto-derived for binary markets; for neg-risk markets it… */
	requestId?: string | null;
	/** How the market resolves: oracle (resolved through an oracle request) or derived (payouts are supplied by the resolution service, no independent oracle request). Computed by Gamma at creation and fixed afterwards; read-only. Independent of resolutionSource, which stays free-text provider metadata. */
	resolutionMechanism?: string | null;
	resolutionSource?: string | null;
	/** High-level resolution state of the market: inactive (drafted, not yet deployed on chain), active (deployed, not resolved yet) or resolved. Only written for v2 markets; v1 markets keep using umaResolutionStatus. */
	resolutionStatus?: string | null;
	resolvedBy?: string | null;
	restricted?: boolean | null;
	rewardsMaxSpread?: number | null;
	rewardsMinSize?: number | null;
	rfqEnabled?: boolean | null;
	scheduledDeploymentTimestamp?: string | null;
	score?: number | null;
	secondsDelay?: number | null;
	sentDiscord?: boolean | null;
	seriesColor?: string | null;
	shortOutcomes?: string | null;
	showGmpOutcome?: boolean | null;
	showGmpSeries?: boolean | null;
	slug?: string | null;
	sponsorImage?: string | null;
	sponsorName?: string | null;
	sportsMarketType?: string | null;
	spread?: number | null;
	startDate?: string | null;
	startDateIso?: string | null;
	subcategory?: string | null;
	submitted_by?: string | null;
	tags?: Array<PolymarketGammaTag> | null;
	takerBaseFee?: number | null;
	teamAID?: string | null;
	teamBID?: string | null;
	/** Whether the market can trade. Computed by Gamma at creation and fixed afterwards; read-only. Always present, false is explicit. Non-tradable markets are excluded from public discovery lists and search but stay readable by id, condition id, token id and position id. */
	tradingEligible?: boolean | null;
	twitterCardImage?: string | null;
	twitterCardLastRefreshed?: string | null;
	twitterCardLastValidated?: string | null;
	twitterCardLocation?: string | null;
	umaBond?: string | null;
	umaEndDate?: string | null;
	umaEndDateIso?: string | null;
	umaResolutionStatus?: string | null;
	umaResolutionStatuses?: string | null;
	umaReward?: string | null;
	updatedAt?: string | null;
	updatedBy?: number | null;
	upperBound?: string | null;
	upperBoundDate?: string | null;
	/** Protocol version the market trades on: v1 (legacy CTF/CLOB) or v2 (polymarket-v2 modules). Clients must match exact values and treat unknown values as unsupported. */
	version?: string | null;
	volume?: string | null;
	volume1mo?: number | null;
	volume1moAmm?: number | null;
	volume1moClob?: number | null;
	volume1wk?: number | null;
	volume1wkAmm?: number | null;
	volume1wkClob?: number | null;
	volume1yr?: number | null;
	volume1yrAmm?: number | null;
	volume1yrClob?: number | null;
	volume24hr?: number | null;
	volume24hrAmm?: number | null;
	volume24hrClob?: number | null;
	volumeAmm?: number | null;
	volumeClob?: number | null;
	volumeNum?: number | null;
	wideFormat?: boolean | null;
	xAxisValue?: string | null;
	yAxisValue?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaMarketClarification = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Adapter address used for the clarification transaction. */
	adapterAddress?: string | null;
	/** Whether the order book should be cleared when the clarification is processed. */
	clearBook?: boolean | null;
	/** Clarification text shown to consumers. */
	content?: string | null;
	/** Time when the clarification was created. */
	createdAt?: string | null;
	/** Event ID associated with the clarified market. */
	eventId?: number | null;
	/** Unique market clarification ID. */
	id?: number | null;
	/** Market ID associated with the clarification. */
	marketId?: number | null;
	/** Negative-risk request ID associated with the clarification, when present. Null for poly-v2 markets. */
	negRiskRequestId?: string | null;
	/** Whether Discord notification is enabled for the clarification. */
	notifyDiscord?: boolean | null;
	/** Condition/question ID associated with the clarified market. Null for poly-v2 markets, which have no UMA question ID. */
	questionId?: string | null;
	/** Time when the clarification was queued. */
	queuedAt?: string | null;
	/** Time when the clarification is scheduled to be processed. */
	scheduledFor?: string | null;
	/** Whether the clarification should be shown in frontend clients. */
	showInFrontend?: boolean | null;
	/** Current clarification state. */
	state?: string | null;
	/** Blockchain transaction hash for the processed clarification. */
	txHash?: string | null;
	/** Timestamp of the clarification transaction. */
	txTimestamp?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaMarketsKeysetListResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	markets?: Array<PolymarketGammaMarket> | null;
	next_cursor?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPagination = {
	hasMore?: boolean | null;
	totalResults?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaPartner = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	createdAt?: string | null;
	id?: number | null;
	name?: string | null;
	slug?: string | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPremadeComboLegDisplay = {
	eventTitle?: string | null;
	iconUrl?: string | null;
	line?: number | null;
	marketLabel?: string | null;
	marketTitle?: string | null;
	pickLabel?: string | null;
	teamAbbreviation?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPremadeComboLegPrices = {
	no?: number | null;
	selected?: number | null;
	yes?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaPremadeComboLegResponse = {
	conditionId?: string | null;
	display?: PolymarketGammaPremadeComboLegDisplay | null;
	eventId?: string | null;
	eventSlug?: string | null;
	marketId?: string | null;
	marketSlug?: string | null;
	ordinal?: number | null;
	positionIds?: Array<string> | null;
	prices?: PolymarketGammaPremadeComboLegPrices | null;
	selectedPositionId?: string | null;
	side?: string | null;
	sportsMarketType?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPremadeComboResponse = {
	comboType?: string | null;
	eventId?: string | null;
	eventSlug?: string | null;
	eventTitle?: string | null;
	id?: number | null;
	leagueSlug?: string | null;
	legs?: Array<PolymarketGammaPremadeComboLegResponse> | null;
	slug?: string | null;
	sortOrder?: number | null;
	stats?: PolymarketGammaPremadeComboStats | null;
	subtitle?: string | null;
	title?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPremadeComboScope = {
	slug?: string | null;
	type?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPremadeComboShelf = {
	combos?: Array<PolymarketGammaPremadeComboResponse> | null;
	id?: string | null;
	placement?: string | null;
	title?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPremadeComboStats = {
	indicativeMultiplier?: number | null;
	traderCount?: number | null;
	wagered?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaPremadeCombosResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	scope?: PolymarketGammaPremadeComboScope | null;
	shelves?: Array<PolymarketGammaPremadeComboShelf> | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPublicProfile = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	bio?: string | null;
	createdAt?: string | null;
	name?: string | null;
	profileImage?: string | null;
	proxyWallet?: string | null;
	pseudonym?: string | null;
	takerTier?: number | null;
	takerTierName?: string | null;
	weightedVolume?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaPublicProfileBatchEntry = {
	address?: string | null;
	bio?: string | null;
	createdAt?: string | null;
	discordUsername?: string | null;
	displayUsernamePublic?: boolean | null;
	name?: string | null;
	profileImage?: string | null;
	proxyWallet?: string | null;
	pseudonym?: string | null;
	verifiedBadge?: boolean | null;
	xUsername?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPublicProfileResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	bio?: string | null;
	createdAt?: string | null;
	discordUsername?: string | null;
	displayUsernamePublic?: boolean | null;
	name?: string | null;
	profileImage?: string | null;
	proxyWallet?: string | null;
	pseudonym?: string | null;
	takerTier?: number | null;
	takerTierName?: string | null;
	users?: Array<PolymarketGammaPublicProfileUser> | null;
	verifiedBadge?: boolean | null;
	weightedVolume?: number | null;
	xUsername?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaPublicProfileUser = {
	communityMod?: boolean | null;
	creator?: boolean | null;
	id?: string | null;
	mod?: boolean | null;
	[key: string]: unknown;
};

export type PolymarketGammaPublicProfilesBatchResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	profiles?: Array<PolymarketGammaPublicProfileBatchEntry> | null;
	[key: string]: unknown;
};

export type PolymarketGammaPublicTermsVersion = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	content?: string | null;
	contentHash?: string | null;
	documentUrl?: string | null;
	publishedAt?: string | null;
	version?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaReaction = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	commentID?: number | null;
	createdAt?: string | null;
	icon?: string | null;
	id?: string | null;
	profile?: PolymarketGammaCommentProfile | null;
	reactionType?: string | null;
	userAddress?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaReadyzStatus = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Redis cache connectivity (informational, never gates readiness): ok|degraded|disabled */
	cache?: string | null;
	/** Read-write database connectivity: ok|error */
	db?: string | null;
	/** Markets read-replica pool reachability (informational, never gates readiness): ok|error */
	replica?: string | null;
	/** Database schema version against the migrations this image ships (behind and dirty gate readiness together with db; dirty_ahead, error and skipped do not): ok|behind|dirty|dirty_ahead|error|skipped */
	schema?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaReferralLeaderboardEntry = {
	earningsPct?: number | null;
	name?: string | null;
	profileImage?: string | null;
	proxyWallet?: string | null;
	pseudonym?: string | null;
	rank?: number | null;
	totalEarnings?: number | null;
	totalSignups?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaReferralLeaderboardResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	grandTotalEarnings?: number | null;
	leaderboard?: Array<PolymarketGammaReferralLeaderboardEntry> | null;
	total?: number | null;
	userEntry?: PolymarketGammaReferralLeaderboardEntry | null;
	[key: string]: unknown;
};

export type PolymarketGammaRelatedMarket = {
	conditionId?: string | null;
	eventSlug?: string | null;
	/** Facets assigned to the market, with their ancestors; a market does not carry its event's facets. Present only when the request sets include_facets=true. Read-only. */
	facets?: Array<PolymarketGammaFacet> | null;
	id?: string | null;
	image?: string | null;
	outcomePrices?: string | null;
	outcomes?: string | null;
	question?: string | null;
	slug?: string | null;
	startDate?: string | null;
	volume?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaRelatedTag = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	id?: string | null;
	rank?: number | null;
	relatedTagID?: number | null;
	tagID?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaSeries = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	active?: boolean | null;
	archived?: boolean | null;
	cgAssetName?: string | null;
	closed?: boolean | null;
	commentCount?: number | null;
	commentsEnabled?: boolean | null;
	competitive?: string | null;
	createdAt?: string | null;
	createdBy?: string | null;
	description?: string | null;
	events?: Array<PolymarketGammaEvent> | null;
	featured?: boolean | null;
	icon?: string | null;
	id?: string | null;
	image?: string | null;
	isTemplate?: boolean | null;
	layout?: string | null;
	liquidity?: number | null;
	new?: boolean | null;
	publishedAt?: string | null;
	pythTokenID?: string | null;
	recurrence?: string | null;
	restricted?: boolean | null;
	score?: number | null;
	seriesType?: string | null;
	slug?: string | null;
	startDate?: string | null;
	subtitle?: string | null;
	templateVariables?: boolean | null;
	ticker?: string | null;
	title?: string | null;
	updatedAt?: string | null;
	updatedBy?: string | null;
	volume?: number | null;
	volume24hr?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaSeriesKeysetListResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Opaque cursor to pass as after_cursor when requesting the next page. Absent on the last page. */
	next_cursor?: string | null;
	/** Series returned for the current page. */
	series?: Array<PolymarketGammaSeries> | null;
	[key: string]: unknown;
};

export type PolymarketGammaSeriesSummary = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	earliest_open_date?: string | null;
	earliest_open_week?: number | null;
	eventDates?: Array<string> | null;
	eventWeeks?: Array<number> | null;
	id?: string | null;
	slug?: string | null;
	title?: string | null;
	volume?: number | null;
	volume24hr?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaSportExternalPartnerMapping = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	createdAt?: string | null;
	externalId?: string | null;
	id?: number | null;
	partner?: PolymarketGammaPartner | null;
	partnerId?: number | null;
	sportId?: number | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaSportsMarketTypesResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Supported sports market type names. */
	marketTypes?: Array<string> | null;
	[key: string]: unknown;
};

export type PolymarketGammaSportsMetadata = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Time when the sports metadata was created. */
	createdAt?: string | null;
	/** External partner mappings for this sport. */
	externalPartners?: Array<PolymarketGammaSportExternalPartnerMapping> | null;
	/** Unique sports metadata ID. */
	id?: number | null;
	/** Image URL for the sport. */
	image?: string | null;
	/** Display name for the sport or league. */
	name?: string | null;
	/** Ordering configuration used for sport display. */
	ordering?: string | null;
	/** ID of the league's own tag, as opposed to the shared base tags in the tags CSV. */
	primaryTagId?: number | null;
	/** Default resolution source or display text for the sport. */
	resolution?: string | null;
	/** Comma-separated series identifiers associated with the sport. */
	series?: string | null;
	/** Sport slug this metadata applies to. */
	sport?: string | null;
	/** Comma-separated tag identifiers associated with the sport. */
	tags?: string | null;
	/** Time when the sports metadata was last updated. */
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaSportsSummaryResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Summary data keyed by league or sport slug. */
	leagues?: Record<string, PolymarketGammaLeagueSummary> | null;
	[key: string]: unknown;
};

export type PolymarketGammaTag = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	activeEventsCount?: number | null;
	createdAt?: string | null;
	createdBy?: number | null;
	forceHide?: boolean | null;
	forceShow?: boolean | null;
	id?: string | null;
	isCarousel?: boolean | null;
	label?: string | null;
	publishedAt?: string | null;
	slug?: string | null;
	updatedAt?: string | null;
	updatedBy?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaTakerTierBatchEntry = {
	address?: string | null;
	tier?: number | null;
	tier_name?: string | null;
	wv_30d?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaTakerTierLadderResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	/** Active tiers by ascending tier */
	tiers?: Array<PolymarketGammaTakerTierRung> | null;
	[key: string]: unknown;
};

export type PolymarketGammaTakerTierRung = {
	min_wv_30d?: number | null;
	name?: string | null;
	rebate_bps?: number | null;
	tier?: number | null;
	[key: string]: unknown;
};

export type PolymarketGammaTakerTiersBatchResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	tiers?: Array<PolymarketGammaTakerTierBatchEntry> | null;
	[key: string]: unknown;
};

export type PolymarketGammaTeam = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	abbreviation?: string | null;
	alias?: string | null;
	color?: string | null;
	createdAt?: string | null;
	externalPartners?: Array<PolymarketGammaTeamExternalPartnerMapping> | null;
	id?: number | null;
	league?: string | null;
	logo?: string | null;
	name?: string | null;
	ordering?: string | null;
	providerId?: number | null;
	record?: string | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaTeamExternalPartnerMapping = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	createdAt?: string | null;
	externalId?: string | null;
	id?: number | null;
	partner?: PolymarketGammaPartner | null;
	partnerId?: number | null;
	/** Process that wrote the mapping, for example data-load, job-exact-name, slack-confirm or mission-control. Null on rows written before this field existed or when the caller did not set it. */
	source?: string | null;
	teamId?: number | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaTournament = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	createdAt?: string | null;
	divisions?: Array<PolymarketGammaTournamentDivision> | null;
	fallbackIcon?: string | null;
	id?: number | null;
	league?: string | null;
	name?: string | null;
	numEntrants?: number | null;
	phases?: Array<PolymarketGammaTournamentPhase> | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaTournamentDivision = {
	createdAt?: string | null;
	id?: number | null;
	sortOrder?: number | null;
	title?: string | null;
	tournamentId?: number | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaTournamentGame = {
	createdAt?: string | null;
	divisionId?: number | null;
	event?: PolymarketGammaEvent | null;
	eventSlug?: string | null;
	gameIndex?: number | null;
	id?: number | null;
	location?: string | null;
	seedA?: number | null;
	seedB?: number | null;
	startTime?: string | null;
	teamA?: PolymarketGammaTeam | null;
	teamAId?: number | null;
	teamB?: PolymarketGammaTeam | null;
	teamBId?: number | null;
	tournamentPhaseId?: number | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaTournamentPhase = {
	createdAt?: string | null;
	displayName?: string | null;
	id?: number | null;
	phaseType?: string | null;
	placementRank?: number | null;
	roundSize?: number | null;
	sections?: Array<PolymarketGammaTournamentSection> | null;
	sortOrder?: number | null;
	tournamentId?: number | null;
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaTournamentSection = {
	games?: Array<PolymarketGammaTournamentGame> | null;
	title?: string | null;
	[key: string]: unknown;
};

export type PolymarketGammaWalletTypeResponse = {
	/** A URL to the JSON Schema for this object. */
	$schema?: string | null;
	type?: number | null;
	typeName?: string | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountBackstop = {
	id?: PolymarketPerpsLid | null;
	cross?: PolymarketPerpsCross | null;
	/** Absorbed instrument ID, or null for a cross-margin absorption. */
	instrument_id?: number | null;
	asset?: PolymarketPerpsFua | null;
	transferred?: PolymarketPerpsBackstopTransferred | null;
	cash_before?: PolymarketPerpsBackstopCashBefore | null;
	cash_after?: PolymarketPerpsBackstopCashAfter | null;
	timestamp?: PolymarketPerpsTs | null;
	sequence?: PolymarketPerpsHistorySequence | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountBackstops = {
	data?: Array<PolymarketPerpsAccountBackstop> | null;
	more?: PolymarketPerpsMore | null;
	/** Present when backstop history is unavailable because its schema is pending. */
	coverage?: {
		notes?: Array<string> | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

/** Account configuration. */
export type PolymarketPerpsAccountConfig = {
	instrument_id?: PolymarketPerpsIid | null;
	leverage?: PolymarketPerpsLev | null;
	cross?: PolymarketPerpsCross | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountFundingData = {
	id?: PolymarketPerpsFid | null;
	instrument_id?: PolymarketPerpsIid | null;
	size?: PolymarketPerpsSz | null;
	funding_rate?: PolymarketPerpsFr | null;
	funding_asset?: PolymarketPerpsFua | null;
	funding?: PolymarketPerpsFund | null;
	timestamp?: PolymarketPerpsTs | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountFundingHistory = {
	data?: Array<PolymarketPerpsAccountFundingData> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountLimits = {
	actions_per_minute?: PolymarketPerpsActionsPerMinute | null;
	actions_per_minute_limit?: PolymarketPerpsActionsPerMinuteLimit | null;
	actions_burst?: PolymarketPerpsActionsBurst | null;
	actions_burst_limit?: PolymarketPerpsActionsBurstLimit | null;
	open_orders?: PolymarketPerpsOpenOrders | null;
	open_orders_limit?: PolymarketPerpsOpenOrdersLimit | null;
	reset?: PolymarketPerpsRateReset | null;
	messages_per_minute?: PolymarketPerpsMessagesPerMinute | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountReferral = {
	code?: PolymarketPerpsCode | null;
	/** Parent referral code, omitted when the account has no parent referral. */
	parent?: PolymarketPerpsCode | null;
	children_count?: PolymarketPerpsChildrenCount | null;
	active_children_count?: PolymarketPerpsActiveChildrenCount | null;
	children_volume?: PolymarketPerpsChildrenVolume | null;
	children_fees?: PolymarketPerpsChildrenFees | null;
	referrals_left?: PolymarketPerpsReferralsLeft | null;
	fee_share_rate?: PolymarketPerpsFeeShareRate | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountReward = {
	date?: PolymarketPerpsDate | null;
	maker_share_7d?: PolymarketPerpsMakerShare7d | null;
	reward_distributed?: PolymarketPerpsRewardDistributed | null;
	breakdown?: Array<PolymarketPerpsAccountRewardInstrument> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountRewardInstrument = {
	instrument_id?: PolymarketPerpsInstrumentId | null;
	reward_pool?: PolymarketPerpsRewardPool | null;
	reward_amount?: PolymarketPerpsRewardAmount | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountRewards = {
	data?: Array<PolymarketPerpsAccountReward> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountStats = {
	volume_7d?: PolymarketPerpsVolume7d | null;
	taker_volume_7d?: PolymarketPerpsTakerVolume7d | null;
	maker_volume_7d?: PolymarketPerpsMakerVolume7d | null;
	account_maker_share_7d?: PolymarketPerpsAccountMakerShare7d | null;
	entity_maker_share_7d?: PolymarketPerpsEntityMakerShare7d | null;
	entity_id?: PolymarketPerpsEntityId | null;
	entity_name?: PolymarketPerpsEntityName | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountTradeData = {
	trade_id?: PolymarketPerpsTid | null;
	order_id?: PolymarketPerpsOid | null;
	instrument_id?: PolymarketPerpsIid | null;
	side?: PolymarketPerpsSide | null;
	price?: PolymarketPerpsP | null;
	quantity?: PolymarketPerpsQty | null;
	taker?: PolymarketPerpsTaker | null;
	fee?: PolymarketPerpsFee | null;
	fee_asset?: PolymarketPerpsFea | null;
	previous_size?: PolymarketPerpsPsz | null;
	previous_entry_price?: PolymarketPerpsPep | null;
	/** Realized trading PnL before exchange and builder fees. Subtract total_fee once to calculate this fill's net trading result. */
	pnl?: PolymarketPerpsPnl | null;
	liquidation?: PolymarketPerpsLiq | null;
	adl?: PolymarketPerpsAdl | null;
	timestamp?: PolymarketPerpsTs | null;
	hash?: PolymarketPerpsHash | null;
	builder_fee?: PolymarketPerpsBuilderFee | null;
	total_fee?: PolymarketPerpsTotalFee | null;
	/** Saved terms, only on authenticated account fill surfaces. Public account history omits identity and rate, even when builder_fee is nonzero. */
	builder?: PolymarketPerpsBuilder | null;
	settlement?: PolymarketPerpsSettlementFill | null;
	liquidation_details?: PolymarketPerpsLiquidationDetails | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAccountTrades = {
	/** Account's trade history */
	data?: Array<PolymarketPerpsAccountTradeData> | null;
	more?: PolymarketPerpsMore | null;
	cursor?: PolymarketPerpsFillsCursor | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAsset = {
	asset?: PolymarketPerpsAsset2 | null;
	address?: PolymarketPerpsAddress | null;
	decimals?: PolymarketPerpsDecimals | null;
	collateral_ratio?: PolymarketPerpsCollateralRatio | null;
	withdrawal_fee?: PolymarketPerpsWithdrawalFee | null;
	[key: string]: unknown;
};

/** The auto-cancel schedule now in effect. The deadline field echoes the armed time in Unix milliseconds, or 0 if you cleared the schedule. */
export type PolymarketPerpsAutoCancelResponse = {
	status?: string | null;
	deadline?: PolymarketPerpsAutoCancelDeadline | null;
	[key: string]: unknown;
};

export type PolymarketPerpsAutoCancelStatus = {
	deadline?: PolymarketPerpsAutoCancelDeadline | null;
	triggered?: PolymarketPerpsAutoCancelTriggered | null;
	daily_limit?: PolymarketPerpsAutoCancelDailyLimit | null;
	next_reset?: PolymarketPerpsAutoCancelNextReset | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBBO = {
	instrument_id?: PolymarketPerpsIid | null;
	bid_price?: PolymarketPerpsBestBidPrice | null;
	bid_quantity?: PolymarketPerpsBestBidQuantity | null;
	ask_price?: PolymarketPerpsBestAskPrice | null;
	ask_quantity?: PolymarketPerpsBestAskQuantity | null;
	timestamp?: PolymarketPerpsTs | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBalance = {
	asset?: PolymarketPerpsAsset2 | null;
	balance?: PolymarketPerpsBalance2 | null;
	value?: PolymarketPerpsValue | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBlpEnrollment = {
	blp?: PolymarketPerpsBlp | null;
	/** Instruments the account is subscribed to, in ascending instrument-id order. Empty when the account is enrolled but not yet subscribed to any instrument. */
	instruments?: Array<PolymarketPerpsBlpInstrument> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBlpInstrument = {
	instrument_id?: PolymarketPerpsInstrumentId | null;
	symbol?: PolymarketPerpsSymbol | null;
	[key: string]: unknown;
};

/** One absorption of an account's positions and margin, matching a single `backstop` WebSocket frame. */
export type PolymarketPerpsBlpLiquidation = {
	liquidation_id?: PolymarketPerpsLid | null;
	timestamp?: PolymarketPerpsTs | null;
	cross?: PolymarketPerpsCross | null;
	margin?: PolymarketPerpsMgn | null;
	/** Trades booked for the positions absorbed in this liquidation, in the order they were booked. */
	trades?: Array<PolymarketPerpsBlpLiquidationTrade> | null;
	[key: string]: unknown;
};

/** One trade booked for a position absorbed in the liquidation. */
export type PolymarketPerpsBlpLiquidationTrade = {
	trade_id?: PolymarketPerpsTid | null;
	instrument_id?: PolymarketPerpsIid | null;
	side?: PolymarketPerpsSide | null;
	quantity?: PolymarketPerpsQty | null;
	price?: PolymarketPerpsP | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBlpLiquidations = {
	/** Backstop liquidations the account received */
	data?: Array<PolymarketPerpsBlpLiquidation> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBook = {
	instrument_id?: PolymarketPerpsInstrumentId | null;
	/** Bid levels */
	bids?: Array<PolymarketPerpsLevel> | null;
	/** Ask levels */
	asks?: Array<PolymarketPerpsLevel> | null;
	timestamp?: PolymarketPerpsTimestamp | null;
	sequence?: PolymarketPerpsSequence | null;
	[key: string]: unknown;
};

/** Saved builder terms. Address is the registered Perps account, and fee_rate is an additional fraction of executed notional. Terms survive approval revocation for existing orders. */
export type PolymarketPerpsBuilder = {
	address?: PolymarketPerpsAddress | null;
	fee_rate?: PolymarketPerpsBuilderFeeRate | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBuilderApproval = {
	trader?: PolymarketPerpsAddress | null;
	builder?: PolymarketPerpsAddress | null;
	max_fee_rate?: PolymarketPerpsBuilderFeeRate | null;
	approval_version?: PolymarketPerpsBuilderApprovalVersion | null;
	timestamp?: PolymarketPerpsTimestamp | null;
	sequence?: number | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBuilderApprovals = {
	data?: Array<PolymarketPerpsBuilderApproval> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBuilderEarning = {
	/** Stable side-specific receipt identity, unique for this builder. Use this to deduplicate, not sequence or trade_id alone. */
	earning_id?: string | null;
	trade_id?: PolymarketPerpsTid | null;
	order_id?: PolymarketPerpsOid | null;
	instrument_id?: PolymarketPerpsIid | null;
	side?: string | null;
	timestamp?: PolymarketPerpsTimestamp | null;
	sequence?: number | null;
	notional?: string | null;
	fee_asset?: PolymarketPerpsFea | null;
	builder_fee?: PolymarketPerpsBuilderFee | null;
	fee_rate?: PolymarketPerpsBuilderFeeRate | null;
	/** Main address of the attributed trading account, not its signing proxy or the counterparty. */
	trader?: PolymarketJsonValue | null;
	buy?: PolymarketPerpsBuy | null;
	price?: PolymarketPerpsPrice | null;
	quantity?: PolymarketPerpsQuantity | null;
	/** Included only when the attributed order supplied a client_order_id. */
	client_order_id?: PolymarketJsonValue | null;
	fee?: PolymarketPerpsFee | null;
	total_fee?: PolymarketPerpsTotalFee | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBuilderEarnings = {
	data?: Array<PolymarketPerpsBuilderEarning> | null;
	more?: boolean | null;
	/** Opaque continuation preserving account, time window and fully indexed cutoff. Reuse unchanged. */
	cursor?: string | null;
	start_timestamp?: PolymarketPerpsTimestamp | null;
	end_timestamp?: PolymarketPerpsTimestamp | null;
	/** Complete indexed event prefix shared with the summary. Never the largest row seen. */
	as_of_sequence?: number | null;
	[key: string]: unknown;
};

export type PolymarketPerpsBuilderEarningsAsset = {
	fee_asset?: PolymarketPerpsFea | null;
	fill_count?: number | null;
	/** Eligible executed notional including zero-fee fills. */
	notional?: string | null;
	builder_fee?: PolymarketPerpsBuilderFee | null;
	[key: string]: unknown;
};

/** Settled earnings in the requested window, not available funds or a claim balance. Normal account balances describe spendable collateral. */
export type PolymarketPerpsBuilderEarningsSummary = {
	data?: Array<PolymarketPerpsBuilderEarningsAsset> | null;
	start_timestamp?: PolymarketPerpsTimestamp | null;
	end_timestamp?: PolymarketPerpsTimestamp | null;
	as_of_sequence?: number | null;
	/** Distinct trading accounts with at least one attributed fill in this window and indexed cutoff, including zero-fee fills and counting once across markets, assets and maker/taker roles. */
	trader_count?: number | null;
	/** Current positive, unrevoked approvals to this builder. This count is independent of the historical window and cutoff. Disabling a builder or platform admission does not erase grants. */
	active_approval_count?: number | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCancelAccepted = {
	status?: string | null;
	oid?: PolymarketPerpsOid | null;
	/** Echoed only when the request carried a client_order_id. */
	coid?: PolymarketPerpsCoid | null;
	ts?: PolymarketPerpsCancelTs | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCancelRejected = {
	status?: string | null;
	oid?: PolymarketPerpsOid | null;
	coid?: PolymarketPerpsCoid | null;
	error?: PolymarketPerpsError | null;
	ts?: PolymarketPerpsCancelTs | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCancelResponse =
	| PolymarketPerpsCancelAccepted
	| PolymarketPerpsCancelRejected;

export type PolymarketPerpsCompetitionAccount = {
	competition_id?: PolymarketPerpsCompetitionId | null;
	status?: PolymarketPerpsCompetitionStatus | null;
	updated_at?: PolymarketPerpsUpdateTimestamp | null;
	account?: PolymarketPerpsAccount | null;
	rank?: PolymarketPerpsRank | null;
	/** Reached the minimum volume and is ranked */
	qualified?: boolean | null;
	score?: PolymarketPerpsCompetitionScore | null;
	pnl?: string | null;
	realized_pnl?: string | null;
	unrealized_pnl?: string | null;
	/** Fees paid net of rebates */
	fees?: string | null;
	/** Funding received net of funding paid */
	funding?: string | null;
	volume?: string | null;
	boosted_volume?: string | null;
	first_fill_at?: PolymarketPerpsCompetitionFirstFillAt | null;
	min_volume?: string | null;
	/** Unboosted volume still needed to rank; "0" once qualified */
	volume_to_qualify?: string | null;
	/** Fraction of the minimum reached, from "0" to "1" */
	qualification_progress?: string | null;
	prize?: string | null;
	/** Places between this rank and the last paid place; 0 inside the prize zone; absent when unranked */
	spots_from_prize_zone?: number | null;
	/** Score still needed to reach the prize zone; "0" inside it; absent when unranked */
	score_to_prize_zone?: string | null;
	row_state?: PolymarketPerpsCompetitionRowState | null;
	payout_tx_hash?: string | null;
	paid_at?: number | null;
	/** Positions open at the start, by market, including ones since released. */
	locked_positions?: Array<PolymarketPerpsCompetitionLockedPosition> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCompetitionDetail = {
	competition_id?: PolymarketPerpsCompetitionId | null;
	number?: number | null;
	name?: string | null;
	sector_label?: string | null;
	boost_description?: string | null;
	status?: PolymarketPerpsCompetitionStatus | null;
	start_time?: number | null;
	end_time?: number | null;
	/** Every perpetual counts, including markets listed during the competition. When false only `markets` count. */
	all_markets?: boolean | null;
	/** When `all_markets` is true, only the boosted markets; otherwise every counted market with its boost. */
	markets?: Array<PolymarketPerpsCompetitionMarket> | null;
	/** Unboosted notional volume needed to rank, as a numeric string */
	min_volume?: string | null;
	/** Whether unrealized PnL on open qualifying positions counts */
	count_unrealized?: boolean | null;
	prize_pool?: string | null;
	prize_asset_id?: number | null;
	prize_tiers?: Array<PolymarketPerpsCompetitionPrizeTier> | null;
	/** Size of the prize zone (ranks 1 to paid_places) */
	paid_places?: number | null;
	internal?: boolean | null;
	start_trading_instrument_id?: PolymarketPerpsInstrumentId | null;
	updated_at?: PolymarketPerpsUpdateTimestamp | null;
	/** Accounts on the leaderboard (qualified) */
	ranked?: number | null;
	/** Accounts with at least one counted fill */
	participants?: number | null;
	prize_cutoff_score?: PolymarketPerpsCompetitionScore | null;
	/** The leaderboard shows frozen end-of-competition results */
	final_results?: boolean | null;
	scoring_version?: number | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCompetitionEntry = {
	rank?: PolymarketPerpsRank | null;
	account?: PolymarketPerpsAccount | null;
	score?: PolymarketPerpsCompetitionScore | null;
	/** Competition PnL after fees, funding and liquidation losses */
	pnl?: string | null;
	realized_pnl?: string | null;
	unrealized_pnl?: string | null;
	/** Unboosted notional volume */
	volume?: string | null;
	boosted_volume?: string | null;
	first_fill_at?: PolymarketPerpsCompetitionFirstFillAt | null;
	/** Whether the account meets the entry gate. Present only with `include_unqualified=true`. */
	qualified?: boolean | null;
	/** Projected prize while live, prize won once ended; absent outside the prize zone */
	prize?: string | null;
	row_state?: PolymarketPerpsCompetitionRowState | null;
	/** Payment transaction hash once paid */
	payout_tx_hash?: string | null;
	/** Payment time in Unix milliseconds once paid */
	paid_at?: number | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCompetitionLeaderboard = {
	competition_id?: PolymarketPerpsCompetitionId | null;
	status?: PolymarketPerpsCompetitionStatus | null;
	updated_at?: PolymarketPerpsUpdateTimestamp | null;
	total?: PolymarketPerpsTotal | null;
	offset?: PolymarketPerpsOffset | null;
	final_results?: boolean | null;
	entries?: Array<PolymarketPerpsCompetitionEntry> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCompetitionList = {
	timestamp?: PolymarketPerpsUpdateTimestamp | null;
	live_competition_id?: PolymarketPerpsCompetitionId | null;
	landing_competition_id?: PolymarketPerpsCompetitionId | null;
	/** Newest first. */
	competitions?: Array<PolymarketPerpsCompetitionSummary> | null;
	[key: string]: unknown;
};

/** A position open when the competition started. Its market does not count until it is fully closed. */
export type PolymarketPerpsCompetitionLockedPosition = {
	instrument_id?: PolymarketPerpsInstrumentId | null;
	/** Signed position size at the start (positive long, negative short) */
	size_at_start?: string | null;
	/** When it was fully closed and the market started counting, in Unix milliseconds; absent while still locked */
	released_at?: number | null;
	[key: string]: unknown;
};

/** A market in the competition. `boost` multiplies its volume toward boosted volume (never PnL). */
export type PolymarketPerpsCompetitionMarket = {
	instrument_id?: PolymarketPerpsInstrumentId | null;
	/** Volume multiplier as a numeric string; "1" when not boosted */
	boost?: string | null;
	[key: string]: unknown;
};

/** One band of the prize table. Every rank from `from_rank` to `to_rank` inclusive is paid `amount`. */
export type PolymarketPerpsCompetitionPrizeTier = {
	from_rank?: number | null;
	to_rank?: number | null;
	/** Prize per trader in the prize asset, as a numeric string */
	amount?: string | null;
	[key: string]: unknown;
};

/** One competition in the carousel. */
export type PolymarketPerpsCompetitionSummary = {
	competition_id?: PolymarketPerpsCompetitionId | null;
	/** Sequential number shown as "Competition */
	number?: number | null;
	name?: string | null;
	/** Theme or sector label, e.g. "Semis"; empty when none */
	sector_label?: string | null;
	status?: PolymarketPerpsCompetitionStatus | null;
	/** Start, inclusive, in Unix milliseconds */
	start_time?: number | null;
	/** End, exclusive, in Unix milliseconds */
	end_time?: number | null;
	/** Total prize pool as a numeric string */
	prize_pool?: string | null;
	/** Asset prizes are paid in */
	prize_asset_id?: number | null;
	/** Visible only to its allowlist (internal test competitions) */
	internal?: boolean | null;
	[key: string]: unknown;
};

/** The live competition at a glance for the trading page. Without a live competition only `timestamp` is present. */
export type PolymarketPerpsCompetitionWidget = {
	timestamp?: PolymarketPerpsUpdateTimestamp | null;
	competition_id?: PolymarketPerpsCompetitionId | null;
	number?: number | null;
	end_time?: number | null;
	rank?: PolymarketPerpsRank | null;
	qualified?: boolean | null;
	volume?: string | null;
	min_volume?: string | null;
	qualification_progress?: string | null;
	spots_from_prize_zone?: number | null;
	updated_at?: PolymarketPerpsUpdateTimestamp | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCreateInviteResponse = {
	status?: string | null;
	code?: PolymarketPerpsCode | null;
	/** Remaining lifetime referrals for this invite code. */
	referrals_available?: number | null;
	/** Milliseconds until referrals become available again. Null for lifetime caps because no windowed cooldown applies. */
	cooldown_ms?: number | null;
	[key: string]: unknown;
};

export type PolymarketPerpsCredentials = {
	address?: PolymarketPerpsAddress | null;
	keys?: Array<PolymarketPerpsKey> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsDeposit = {
	hash?: PolymarketPerpsHash | null;
	asset?: PolymarketPerpsAsset2 | null;
	amount?: PolymarketPerpsAmount | null;
	from?: PolymarketPerpsFrom | null;
	to?: PolymarketPerpsTo | null;
	status?: PolymarketPerpsDepositStatus | null;
	confirmations?: PolymarketPerpsConfirmations | null;
	required_confirmations?: PolymarketPerpsRequiredConfirmations | null;
	created_timestamp?: PolymarketPerpsCreatedTimestamp | null;
	confirmed_timestamp?: PolymarketPerpsConfirmedTimestamp | null;
	[key: string]: unknown;
};

export type PolymarketPerpsDeposits = {
	data?: Array<PolymarketPerpsDeposit> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsEquityHistory = {
	/** - `1767225600000` - Timestamp - `"10000.00"` - Equity */
	data?: Array<Array<PolymarketJsonValue>> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsExchange = {
	name?: PolymarketPerpsName | null;
	version?: PolymarketPerpsVersion | null;
	chain_id?: PolymarketPerpsChainId | null;
	contract?: PolymarketPerpsContract | null;
	cancel_only?: PolymarketPerpsCancelOnly | null;
	engine_version?: PolymarketPerpsEngineVersion | null;
	[key: string]: unknown;
};

export type PolymarketPerpsExchangeStatistics = {
	start_timestamp?: PolymarketPerpsStartTimestamp | null;
	end_timestamp?: PolymarketPerpsEndTimestamp | null;
	volume?: PolymarketPerpsExchangeVolume | null;
	open_interest?: PolymarketPerpsExchangeOpenInterest | null;
	open_interest_timestamp?: PolymarketPerpsOpenInterestTimestamp | null;
	fees?: PolymarketPerpsExchangeFees | null;
	[key: string]: unknown;
};

export type PolymarketPerpsFeeScheduleEntry = {
	instrument_type?: PolymarketPerpsInstrumentType | null;
	category?: PolymarketPerpsCategory | null;
	taker_fee_rate?: PolymarketPerpsTakerFeeRate | null;
	maker_fee_rate?: PolymarketPerpsMakerFeeRate | null;
	tiers?: Array<PolymarketPerpsFeeTier> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsFeeTier = {
	min_volume_30d?: PolymarketPerpsMinVolume30d | null;
	taker_fee_rate?: PolymarketPerpsTakerFeeRate | null;
	maker_fee_rate?: PolymarketPerpsMakerFeeRate | null;
	[key: string]: unknown;
};

export type PolymarketPerpsFeesInfo = {
	fee_schedule?: Array<PolymarketPerpsFeeScheduleEntry> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsFundingHistory = {
	data?: Array<PolymarketPerpsFundingRate> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsFundingRate = {
	funding_rate?: PolymarketPerpsFr | null;
	timestamp?: PolymarketPerpsTs | null;
	[key: string]: unknown;
};

export type PolymarketPerpsGenericAccepted = {
	status?: string | null;
	[key: string]: unknown;
};

export type PolymarketPerpsGenericRejected = {
	status?: string | null;
	error?: PolymarketPerpsError | null;
	[key: string]: unknown;
};

export type PolymarketPerpsGenericResponse =
	| PolymarketPerpsGenericAccepted
	| PolymarketPerpsGenericRejected;

export type PolymarketPerpsIndex = {
	asset?: PolymarketPerpsAsset2 | null;
	index_price?: PolymarketPerpsIndexPrice | null;
	constituents?: Array<PolymarketPerpsIndexConstituent> | null;
	ts?: PolymarketPerpsTs | null;
	[key: string]: unknown;
};

export type PolymarketPerpsIndexConstituent = {
	source?: PolymarketPerpsSource | null;
	symbol?: PolymarketPerpsSymbol | null;
	weight?: PolymarketPerpsWeight | null;
	price?: PolymarketPerpsPrice | null;
	[key: string]: unknown;
};

export type PolymarketPerpsInstrument = {
	instrument_id?: PolymarketPerpsInstrumentId | null;
	instrument_type?: PolymarketPerpsInstrumentType | null;
	category?: PolymarketPerpsCategory | null;
	isolated_only?: PolymarketPerpsIsolatedOnly | null;
	symbol?: PolymarketPerpsSymbol | null;
	display_symbol?: PolymarketPerpsDisplaySymbol | null;
	base_asset?: PolymarketPerpsBaseAsset | null;
	quote_asset?: PolymarketPerpsQuoteAsset | null;
	funding_interval?: PolymarketPerpsFundingInterval | null;
	quantity_decimals?: PolymarketPerpsQuantityDecimals | null;
	price_decimals?: PolymarketPerpsPriceDecimals | null;
	price_bounds?: PolymarketPerpsPriceBounds | null;
	liquidation_fee?: PolymarketPerpsLiquidationFee | null;
	max_order_count?: PolymarketPerpsMaxOrderCount | null;
	min_notional?: PolymarketPerpsMinNotional | null;
	max_market_notional?: PolymarketPerpsMaxMarketNotional | null;
	max_limit_notional?: PolymarketPerpsMaxLimitNotional | null;
	max_leverage?: PolymarketPerpsMaxLeverage | null;
	risk_tiers?: Array<PolymarketPerpsRiskTier> | null;
	ui_live_time?: PolymarketPerpsUiLiveTime | null;
	close_only?: PolymarketPerpsCloseOnly | null;
	settlement?: PolymarketPerpsInstrumentSettlement | null;
	[key: string]: unknown;
};

/** Permanent settlement record. Its sequence and timestamp are the cutoff after which all unapplied funding is waived. Previously applied funding is preserved. An instrument with this record is delisted and cannot resume trading. */
export type PolymarketPerpsInstrumentSettlement = {
	sequence?: PolymarketPerpsSettlementSequence | null;
	timestamp?: PolymarketPerpsSettlementTimestamp | null;
	price?: PolymarketPerpsSettlementPrice | null;
	insurance_debit?: PolymarketPerpsSettlementInsuranceDebit | null;
	[key: string]: unknown;
};

export type PolymarketPerpsInternalTransfer = {
	transfer_id?: PolymarketPerpsTransferId | null;
	asset?: PolymarketPerpsAsset2 | null;
	amount?: PolymarketPerpsAmount | null;
	direction?: PolymarketPerpsDirection | null;
	counterparty?: PolymarketPerpsCounterparty | null;
	label?: PolymarketPerpsLabel | null;
	created_timestamp?: PolymarketPerpsCreatedTimestamp | null;
	[key: string]: unknown;
};

export type PolymarketPerpsInternalTransferAccepted = {
	status?: string | null;
	transfer_id?: PolymarketPerpsTransferId | null;
	[key: string]: unknown;
};

export type PolymarketPerpsInternalTransfers = {
	data?: Array<PolymarketPerpsInternalTransfer> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsInviteCheckResponse = {
	/** Whether the invite code can be used. */
	valid?: boolean | null;
	/** Present when the invite code is invalid or unusable. */
	error?: string | null;
	[key: string]: unknown;
};

export type PolymarketPerpsKey = {
	proxy?: PolymarketPerpsProxy | null;
	label?: PolymarketPerpsLabel | null;
	expiry?: PolymarketPerpsExpiry | null;
	[key: string]: unknown;
};

export type PolymarketPerpsKlinesResponse = {
	data?: Array<PolymarketPerpsKline> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsLeaderboard = {
	window?: PolymarketPerpsWindow | null;
	sort_by?: PolymarketPerpsSortBy | null;
	timestamp?: PolymarketPerpsUpdateTimestamp | null;
	total?: PolymarketPerpsTotal | null;
	entries?: Array<PolymarketPerpsLeaderboardEntry> | null;
	account?: PolymarketPerpsLeaderboardAccount | null;
	[key: string]: unknown;
};

/** Leaderboard row for the requested address. `rank` is absent when the account has no activity in the window, or when sorting by account value and that account has no computed equity in the published census. A collateral-only display fallback does not establish an equity rank. */
export type PolymarketPerpsLeaderboardAccount = {
	rank?: PolymarketPerpsRank | null;
	account?: PolymarketPerpsAccount | null;
	pnl?: PolymarketPerpsPnl | null;
	notional?: PolymarketPerpsNotional | null;
	account_value?: PolymarketPerpsAccountValue | null;
	roi?: PolymarketPerpsRoi | null;
	[key: string]: unknown;
};

export type PolymarketPerpsLeaderboardEntry = {
	rank?: PolymarketPerpsRank | null;
	account?: PolymarketPerpsAccount | null;
	pnl?: PolymarketPerpsPnl | null;
	notional?: PolymarketPerpsNotional | null;
	account_value?: PolymarketPerpsAccountValue | null;
	roi?: PolymarketPerpsRoi | null;
	[key: string]: unknown;
};

export type PolymarketPerpsLeverageBatchResponse =
	| PolymarketPerpsLeverageResponse
	| PolymarketPerpsLeverageRejected;

export type PolymarketPerpsLeverageRejected = {
	status?: string | null;
	instrument_id?: PolymarketPerpsIid | null;
	error?: PolymarketPerpsError | null;
	[key: string]: unknown;
};

/** The instrument's effective leverage configuration after the update. */
export type PolymarketPerpsLeverageResponse = {
	status?: string | null;
	instrument_id?: PolymarketPerpsIid | null;
	leverage?: PolymarketPerpsLev | null;
	cross?: PolymarketPerpsCross | null;
	[key: string]: unknown;
};

export type PolymarketPerpsLimitTier = {
	min_volume_14d?: PolymarketPerpsMinVolume | null;
	rate_per_minute_limit?: PolymarketPerpsRatePerMinuteLimit | null;
	rate_burst_limit?: PolymarketPerpsRateBurstLimit | null;
	actions_per_minute_limit?: PolymarketPerpsActionsPerMinuteLimit | null;
	actions_burst_limit?: PolymarketPerpsActionsBurstLimit | null;
	open_orders_limit?: PolymarketPerpsOpenOrdersLimit | null;
	messages_per_minute?: PolymarketPerpsMessagesPerMinute | null;
	[key: string]: unknown;
};

export type PolymarketPerpsLiquidationDetails = {
	/** Checksummed address of the liquidated account. Present on authenticated fill surfaces and, on public account-scoped routes, only on the liquidated account's own rows; absent on fund-side public rows and the anonymous trade tape. */
	liquidated_user?: string | null;
	/** Mark price captured when the liquidation command was issued. The fill price itself stays the accounting price. */
	mark?: string | null;
	/** How the position was liquidated. Only backstop is emitted today; market is reserved for order-book liquidations, which currently carry no liquidation_details. */
	method?: string | null;
	[key: string]: unknown;
};

export type PolymarketPerpsMarginSummary = {
	total_account_value?: PolymarketPerpsTotalAccountValue | null;
	available_order_margin?: PolymarketPerpsAvailableOrderMargin | null;
	total_initial_margin?: PolymarketPerpsTotalInitialMargin | null;
	total_maintenance_margin?: PolymarketPerpsTotalMaintenanceMargin | null;
	total_position_value?: PolymarketPerpsTotalPositionValue | null;
	[key: string]: unknown;
};

export type PolymarketPerpsMarkHistoryResponse = {
	data?: Array<PolymarketPerpsMarkPoint> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsModifyAccepted = {
	status?: string | null;
	order?: PolymarketPerpsOrder | null;
	[key: string]: unknown;
};

export type PolymarketPerpsModifyRejected = {
	status?: string | null;
	oid?: PolymarketPerpsOid | null;
	coid?: PolymarketPerpsCoid | null;
	error?: PolymarketPerpsError | null;
	[key: string]: unknown;
};

export type PolymarketPerpsModifyResponse =
	| PolymarketPerpsModifyAccepted
	| PolymarketPerpsModifyRejected;

export type PolymarketPerpsNotificationItem = {
	/** The notification payload. Fields vary by notification type; see the [Notifications channel](/api-reference/wss/perps-notifications) for the per-type shapes. */
	notification?: Record<string, PolymarketJsonValue> | null;
	read_at?: PolymarketPerpsReadAt | null;
	ts?: PolymarketPerpsTs | null;
	[key: string]: unknown;
};

export type PolymarketPerpsNotificationsResponse = {
	items?: Array<PolymarketPerpsNotificationItem> | null;
	unread?: PolymarketPerpsUnread | null;
	durable_source_seq?: PolymarketPerpsDurableSourceSeq | null;
	/** Whether older notifications exist beyond this page. */
	has_more?: boolean | null;
	next_cursor?: PolymarketPerpsNotifCursor | null;
	[key: string]: unknown;
};

export type PolymarketPerpsOrder = {
	oid?: PolymarketPerpsOid | null;
	iid?: PolymarketPerpsIid | null;
	buy?: PolymarketPerpsBuy | null;
	p?: PolymarketPerpsP | null;
	qty?: PolymarketPerpsQty | null;
	tif?: PolymarketPerpsTif | null;
	po?: PolymarketPerpsPo | null;
	ro?: PolymarketPerpsRo | null;
	rest?: PolymarketPerpsRest | null;
	fill?: PolymarketPerpsFill | null;
	cts?: PolymarketPerpsCts | null;
	uts?: PolymarketPerpsUts | null;
	status?: PolymarketPerpsSt | null;
	coid?: PolymarketPerpsCoid | null;
	builder?: PolymarketPerpsBuilder | null;
	[key: string]: unknown;
};

export type PolymarketPerpsOrderAccepted = {
	status?: string | null;
	oid?: PolymarketPerpsOid | null;
	/** Echoed only when the request carried a client_order_id. */
	coid?: PolymarketPerpsCoid | null;
	builder?: PolymarketPerpsBuilder | null;
	[key: string]: unknown;
};

export type PolymarketPerpsOrderData = {
	order_id?: PolymarketPerpsOid | null;
	instrument_id?: PolymarketPerpsIid | null;
	buy?: PolymarketPerpsBuy | null;
	price?: PolymarketPerpsP | null;
	quantity?: PolymarketPerpsQty | null;
	tif?: PolymarketPerpsTif | null;
	post_only?: PolymarketPerpsPo | null;
	ro?: PolymarketPerpsRo | null;
	resting_quantity?: PolymarketPerpsRest | null;
	filled_quantity?: PolymarketPerpsFill | null;
	status?: PolymarketPerpsSt | null;
	created_timestamp?: PolymarketPerpsCts | null;
	updated_timestamp?: PolymarketPerpsUts | null;
	client_order_id?: PolymarketPerpsCoid | null;
	/** Conditional-order fields. Present only when the order is a TP/SL conditional order — `null`/omitted for regular orders. */
	tpsl?: PolymarketPerpsTpSlOrderFields | null;
	builder?: PolymarketPerpsBuilder | null;
	[key: string]: unknown;
};

export type PolymarketPerpsOrderRejected = {
	status?: string | null;
	error?: PolymarketPerpsError | null;
	oid?: PolymarketPerpsOid | null;
	coid?: PolymarketPerpsCoid | null;
	[key: string]: unknown;
};

export type PolymarketPerpsOrderResponse =
	| PolymarketPerpsOrderAccepted
	| PolymarketPerpsOrderRejected;

export type PolymarketPerpsPnlHistory = {
	/** - `1767225600000` - Timestamp - `"100.50"` - Net PnL after exchange and builder fees, including funding. Do not subtract fill fees again. */
	data?: Array<Array<PolymarketJsonValue>> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPortfolio = {
	positions?: Array<PolymarketPerpsPortfolioPosition> | null;
	margin?: PolymarketPerpsMarginSummary | null;
	withdrawable?: PolymarketPerpsWithdrawable | null;
	in_liquidation?: PolymarketPerpsInLiquidation | null;
	fee_tier?: PolymarketPerpsFeeTier2 | null;
	timestamp?: PolymarketPerpsUpdateTimestamp | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPortfolioPosition = {
	instrument_id?: PolymarketPerpsInstrumentId | null;
	symbol?: PolymarketPerpsSymbol | null;
	size?: PolymarketPerpsSize | null;
	entry_price?: PolymarketPerpsEntryPrice | null;
	leverage?: PolymarketPerpsLeverage | null;
	cross?: PolymarketPerpsCross | null;
	initial_margin?: PolymarketPerpsInitialMargin | null;
	maintenance_margin?: PolymarketPerpsMaintenanceMarginAmount | null;
	position_value?: PolymarketPerpsPositionValue | null;
	liquidation_price?: PolymarketPerpsLiquidationPrice | null;
	unrealized_pnl?: PolymarketPerpsUnrealizedPnl | null;
	return_on_equity?: PolymarketPerpsReturnOnEquity | null;
	cumulative_funding?: PolymarketPerpsCumulativeFunding | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPositionCardSnapshot = {
	/** Opaque stable cycle identity; a flip creates a new identity. */
	position_cycle_id?: string | null;
	side?: string | null;
	/** Cycle opening timestamp in Unix milliseconds. */
	started_at?: number | null;
	/** Captured state time for active positions; selected fill time for history. Unix milliseconds. */
	as_of_at?: number | null;
	is_closed?: boolean | null;
	/** Absolute remaining quantity; side provides its direction. */
	size_after?: string | null;
	/** Remaining position's weighted entry; last entry before closing when flat. Formatted to instrument price precision. */
	entry_price?: string | null;
	/** Captured mark for active positions; selected fill price for historical snapshots. */
	as_of_price?: string | null;
	/** Gross unrealized PnL on remaining size while open; gross realized cycle PnL when closed. Excludes fees, funding and previous cycles. */
	pnl?: string | null;
	/** PnL times leverage divided by entry notional, times 100. Open cycles use unrealized PnL and entry notional on remaining size, excluding realized partial closes. Closed cycles use total opening/add notional, including re-additions after partial closes. Only returned to the authenticated owner;… */
	pnl_percent?: string | null;
	/** Only returned to the authenticated account owner; otherwise null. Current leverage for active positions; captured selected-fill leverage for history, never today's setting. Uncaptured values are null, including fills from older, mixed-version or rollback writers. Replaying a fill without… */
	leverage?: number | null;
	chart?: PolymarketPerpsPositionSnapshotChart | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPositionSnapshotCandle = {
	/** Normalized horizontal chart coordinate from 0 to 1. */
	position?: number | null;
	open?: number | null;
	high?: number | null;
	low?: number | null;
	close?: number | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPositionSnapshotChart = {
	candles?: Array<PolymarketPerpsPositionSnapshotCandle> | null;
	markers?: Array<PolymarketPerpsPositionSnapshotMarker> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPositionSnapshotMarker = {
	position?: number | null;
	kind?: string | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPositionSnapshotResult = {
	instrument_id?: PolymarketPerpsIid | null;
	trade_id?: string | null;
	status?: PolymarketPerpsPositionSnapshotStatus | null;
	snapshot?: PolymarketPerpsPositionCardSnapshot | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPositionSnapshotStatus = string;

export type PolymarketPerpsPositionSnapshots = {
	/** Event time of the serving gateway's captured state and completed-history prefix, in Unix milliseconds. Missing trades are not_found at this horizon; horizons can differ by gateway. */
	history_as_of_at?: number | null;
	active?: Array<PolymarketPerpsPositionSnapshotResult> | null;
	history?: Array<PolymarketPerpsPositionSnapshotResult> | null;
	[key: string]: unknown;
};

export type PolymarketPerpsProxyResponse = {
	status?: string | null;
	secret?: PolymarketPerpsSecret | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPublicPortfolio = {
	positions?: Array<PolymarketPerpsPublicPortfolioPosition> | null;
	equity?: PolymarketPerpsEquity | null;
	timestamp?: PolymarketPerpsUpdateTimestamp | null;
	[key: string]: unknown;
};

export type PolymarketPerpsPublicPortfolioPosition = {
	instrument_id?: PolymarketPerpsInstrumentId | null;
	symbol?: PolymarketPerpsSymbol | null;
	size?: PolymarketPerpsSize | null;
	entry_price?: PolymarketPerpsEntryPrice | null;
	unrealized_pnl?: PolymarketPerpsUnrealizedPnl | null;
	return_on_equity?: PolymarketPerpsReturnOnEquity | null;
	[key: string]: unknown;
};

export type PolymarketPerpsRegisteredResponse = {
	/** Whether the address has a Perps account. */
	registered?: boolean | null;
	[key: string]: unknown;
};

export type PolymarketPerpsRiskTier = {
	lower_bound?: PolymarketPerpsLowerBound | null;
	max_leverage?: PolymarketPerpsMaxLeverage | null;
	[key: string]: unknown;
};

export type PolymarketPerpsStatistic = {
	instrument_id?: PolymarketPerpsIid | null;
	symbol?: PolymarketPerpsSymbol | null;
	volume?: PolymarketPerpsVolume | null;
	open_price?: PolymarketPerpsOpenPrice | null;
	klines?: PolymarketPerpsKlines | null;
	[key: string]: unknown;
};

export type PolymarketPerpsTicker = PolymarketJsonValue;

export type PolymarketPerpsTime = {
	time?: PolymarketPerpsTime2 | null;
	[key: string]: unknown;
};

/** TP/SL-specific fields surfaced alongside the regular order shape. */
export type PolymarketPerpsTpSlOrderFields = {
	kind?: PolymarketPerpsKind | null;
	scope?: PolymarketPerpsTrScope | null;
	trp?: PolymarketPerpsTrp | null;
	parent_oid?: PolymarketPerpsParentOid | null;
	/** Quantity armed at attach time (OCO) or `"0"` for position-based (sized at trigger time). */
	armed_qty?: PolymarketPerpsQty | null;
	slip_bps?: PolymarketPerpsSlipBps | null;
	[key: string]: unknown;
};

export type PolymarketPerpsTradeData = {
	trade_id?: PolymarketPerpsTid | null;
	instrument_id?: PolymarketPerpsIid | null;
	side?: PolymarketPerpsSide | null;
	price?: PolymarketPerpsP | null;
	quantity?: PolymarketPerpsQty | null;
	timestamp?: PolymarketPerpsTs | null;
	hash?: PolymarketPerpsHash | null;
	settlement?: PolymarketPerpsSettlementFill | null;
	[key: string]: unknown;
};

export type PolymarketPerpsTrades = {
	/** Public trades for the instrument */
	data?: Array<PolymarketPerpsTradeData> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

export type PolymarketPerpsWithdrawAccepted = {
	status?: string | null;
	withdraw_id?: PolymarketPerpsWithdrawId | null;
	[key: string]: unknown;
};

export type PolymarketPerpsWithdrawal = {
	withdraw_id?: PolymarketPerpsWithdrawId | null;
	asset?: PolymarketPerpsAsset2 | null;
	amount?: PolymarketPerpsAmount | null;
	to?: PolymarketPerpsTo | null;
	fee?: PolymarketPerpsWithdrawalFee | null;
	status?: PolymarketPerpsWithdrawalStatus | null;
	hash?: PolymarketPerpsHash | null;
	confirmations?: PolymarketPerpsConfirmations | null;
	required_confirmations?: PolymarketPerpsRequiredConfirmations | null;
	created_timestamp?: PolymarketPerpsCreatedTimestamp | null;
	confirmed_timestamp?: PolymarketPerpsConfirmedTimestamp | null;
	[key: string]: unknown;
};

export type PolymarketPerpsWithdrawals = {
	data?: Array<PolymarketPerpsWithdrawal> | null;
	more?: PolymarketPerpsMore | null;
	[key: string]: unknown;
};

/** Account address in hex format */
export type PolymarketPerpsAccount = string;

/** Rolling 7-day account maker volume divided by total exchange volume */
export type PolymarketPerpsAccountMakerShare7d = string;

/** Current account equity in USD as an unformatted numeric string */
export type PolymarketPerpsAccountValue = string;

/** Additional account action allowance remaining */
export type PolymarketPerpsActionsBurst = number;

/** Additional account action allowance limit */
export type PolymarketPerpsActionsBurstLimit = number;

/** Order action tokens used by the account in the current minute */
export type PolymarketPerpsActionsPerMinute = number;

/** Maximum order action tokens per account per minute */
export type PolymarketPerpsActionsPerMinuteLimit = number;

/** Number of directly referred child accounts that have traded at least once since their referral was applied */
export type PolymarketPerpsActiveChildrenCount = number;

/** Address */
export type PolymarketPerpsAddress = string;

/** Whether the fill came from auto-deleveraging */
export type PolymarketPerpsAdl = boolean;

/** Token amount in decimal units (e.g. "100" for 100 USDC). */
export type PolymarketPerpsAmount = string;

/** Asset name */
export type PolymarketPerpsAsset2 = string;

/** Maximum number of auto-cancel triggers allowed per UTC day. */
export type PolymarketPerpsAutoCancelDailyLimit = number;

/** Deadline of the armed auto-cancel schedule, in Unix milliseconds. Zero means no schedule is armed. When the deadline passes, the exchange cancels every open order on the account and the schedule clears. */
export type PolymarketPerpsAutoCancelDeadline = number;

/** Unix-ms timestamp of the next UTC midnight when the daily trigger count resets to zero. */
export type PolymarketPerpsAutoCancelNextReset = number;

/** Number of times auto-cancel has fired for this account during the current UTC day. Resets to zero at 00:00 UTC. */
export type PolymarketPerpsAutoCancelTriggered = number;

/** Collateral available in USD for additional order initial margin after existing exposure, open orders, orders and isolated-margin additions awaiting risk processing, and pending withdrawals or transfers */
export type PolymarketPerpsAvailableOrderMargin = string;

/** Raw quote cash bucket immediately after the absorption. The difference from cash_before is the authoritative wallet delta. */
export type PolymarketPerpsBackstopCashAfter = string;

/** Raw quote cash bucket immediately before the absorption. */
export type PolymarketPerpsBackstopCashBefore = string;

/** Signed raw quote margin allocated by the absorption, without rounding. */
export type PolymarketPerpsBackstopTransferred = string;

/** Total balance */
export type PolymarketPerpsBalance2 = string;

/** Base asset name */
export type PolymarketPerpsBaseAsset = string;

/** Best ask price */
export type PolymarketPerpsBestAskPrice = string;

/** Best ask quantity */
export type PolymarketPerpsBestAskQuantity = string;

/** Best bid price */
export type PolymarketPerpsBestBidPrice = string;

/** Best bid quantity */
export type PolymarketPerpsBestBidQuantity = string;

/** True when the account is enrolled in the Backstop Liquidity Provider program. */
export type PolymarketPerpsBlp = boolean;

/** Exactly the previous version plus one, starting at 1. Revocation retains the version and prevents signed approval replay. */
export type PolymarketPerpsBuilderApprovalVersion = number;

/** Actual additional builder fee in the same asset as fee, floored independently for each execution to that asset's token decimals (six for pUSD), with discarded dust and no carry. The fee is non-negative and is zero for older or untagged fills and excluded forced liquidation legs. */
export type PolymarketPerpsBuilderFee = string;

/** Additional builder fee as a decimal fraction of executed notional, from 0 through 0.001 (10 basis points). Zero approval revokes future admission. Never a percentage string. */
export type PolymarketPerpsBuilderFeeRate = string;

/** Is buy */
export type PolymarketPerpsBuy = boolean;

/** True while the exchange is in cancel-only (maintenance) mode — only order cancellation is accepted. */
export type PolymarketPerpsCancelOnly = boolean;

/** The time when the exchange decided this cancellation outcome, in Unix milliseconds. Sequenced outcomes use the exchange event time. Rejections created before sequencing use the gateway’s decision time. This is not the client request timestamp. */
export type PolymarketPerpsCancelTs = number;

/** Instrument category */
export type PolymarketPerpsCategory = string;

/** Chain ID of the network the exchange is deployed on. */
export type PolymarketPerpsChainId = number;

/** Number of directly referred child accounts */
export type PolymarketPerpsChildrenCount = number;

/** Exchange fees paid by directly referred child accounts since their referral was applied. This excludes additional builder fees. */
export type PolymarketPerpsChildrenFees = string;

/** Total notional volume traded by directly referred child accounts since their referral was applied */
export type PolymarketPerpsChildrenVolume = string;

/** Whether user orders must be reduce-only. Pricing, funding, and risk management continue until settlement. */
export type PolymarketPerpsCloseOnly = boolean;

/** Referral or invite code */
export type PolymarketPerpsCode = string;

/** Client order ID */
export type PolymarketPerpsCoid = string;

/** Collateral ratio */
export type PolymarketPerpsCollateralRatio = string;

/** Time of the account's first counted fill in this competition, in Unix milliseconds; absent when unavailable or the account has no counted fills. Ranked ties use the configured tie-breaks, normally boosted volume then first fill order. Fill order can distinguish fills within the same millisecond. */
export type PolymarketPerpsCompetitionFirstFillAt = number;

/** Trading competition ID */
export type PolymarketPerpsCompetitionId = number;

/** How a leaderboard row is shown. `live` while running (prize is projected), `provisional` while in review, `disqualified` for a rule violation, `final` once results are finalized, `paid` once the prize is paid. */
export type PolymarketPerpsCompetitionRowState = string;

/** Competition score, PnL × √(boosted volume), as a numeric string rounded to 6 decimal places. Can be negative. */
export type PolymarketPerpsCompetitionScore = string;

/** Competition lifecycle status. `upcoming` before start, `live` while running, `in_review` from the end until every prize is paid (ranks can still change after disqualifications), `ended` once results are final and every prize is paid. */
export type PolymarketPerpsCompetitionStatus = string;

/** Number of block confirmations */
export type PolymarketPerpsConfirmations = number;

/** Confirmation timestamp in milliseconds */
export type PolymarketPerpsConfirmedTimestamp = number;

/** Verifying contract address or the EIP-712 domain. */
export type PolymarketPerpsContract = string;

/** Counterparty account address in hex format */
export type PolymarketPerpsCounterparty = string;

/** Creation timestamp in milliseconds */
export type PolymarketPerpsCreatedTimestamp = number;

/** Whether to use cross margin mode */
export type PolymarketPerpsCross = boolean;

/** Create timestamp in milliseconds */
export type PolymarketPerpsCts = number;

/** Cumulative funding paid/received in USD */
export type PolymarketPerpsCumulativeFunding = string;

/** UTC reward period end date in YYYY-MM-DD format */
export type PolymarketPerpsDate = string;

/** Asset decimals */
export type PolymarketPerpsDecimals = number;

/** Deposit status */
export type PolymarketPerpsDepositStatus = string;

/** Transfer direction relative to the authenticated account */
export type PolymarketPerpsDirection = string;

/** Optional presentation override for the full instrument symbol, such as USA500-USD. Use display_symbol when present and fall back to symbol otherwise. This is a label, not an identifier; use instrument_id for trading and storage. Canonical symbol, base_asset, and price-feed identifiers are… */
export type PolymarketPerpsDisplaySymbol = string;

/** Highest notification sequence the store has persisted for your account. If it is still below the sequence you are catching up to, the store is lagging; retry the backfill until it catches up. */
export type PolymarketPerpsDurableSourceSeq = number;

/** End timestamp in milliseconds */
export type PolymarketPerpsEndTimestamp = number;

/** Engine release version of the build serving this response. */
export type PolymarketPerpsEngineVersion = string;

/** Liquidity rewards entity ID */
export type PolymarketPerpsEntityId = number;

/** Rolling 7-day entity maker volume divided by total exchange volume */
export type PolymarketPerpsEntityMakerShare7d = string;

/** Liquidity rewards entity name */
export type PolymarketPerpsEntityName = string;

/** Average entry price */
export type PolymarketPerpsEntryPrice = string;

/** Equity in USD */
export type PolymarketPerpsEquity = string;

/** Error identifier. For domain rejections and transport errors (`401`/`404`/`429`/`500`) this is a stable, machine-readable snake_case identifier that is part of the API contract and safe to branch on, e.g. `insufficient_margin`, `insufficient_balance`, `order_not_found`, `reduce_only_invalid`,… */
export type PolymarketPerpsError = string;

/** Gross positive maker and taker trading fees in USD for the requested window, as an unformatted numeric string. Rebates, incentives, referral payments, and additional builder fees are excluded. */
export type PolymarketPerpsExchangeFees = string;

/** One-sided open interest in USD notional at the latest complete sample before the requested window end, as an unformatted numeric string. Null when no complete sample is available. */
export type PolymarketPerpsExchangeOpenInterest = string | null;

/** Matched trading volume in USD notional for the requested window, as an unformatted numeric string */
export type PolymarketPerpsExchangeVolume = string;

/** Expiry timestamp in milliseconds */
export type PolymarketPerpsExpiry = number;

/** Fee asset name */
export type PolymarketPerpsFea = string;

/** Signed exchange fee for this trade side, excluding builder_fee. Negative values are rebates */
export type PolymarketPerpsFee = string;

/** Referral fee share rate. Defaults to 0.2. */
export type PolymarketPerpsFeeShareRate = string;

/** Zero-based index into `tiers` of the single perpetual fee schedule returned by `/v1/info/fees`, which applies to every perpetual regardless of category. Builder fees are additional and are not part of this tier. Defaults to 0 without a current tier assignment and is capped at the highest… */
export type PolymarketPerpsFeeTier2 = number;

/** Funding payment ID. Probabilistically unique (same guarantees as trade IDs) and stable across REST and WebSocket for the same funding record. */
export type PolymarketPerpsFid = number;

/** Filled quantity */
export type PolymarketPerpsFill = string;

/** Opaque keyset pagination cursor for the next page of fills. Present while `more` is true; pass it as `cursor` on the next request, keeping the other parameters the same across pages. */
export type PolymarketPerpsFillsCursor = string;

/** Funding rate */
export type PolymarketPerpsFr = string;

/** Sender address in hex format */
export type PolymarketPerpsFrom = string;

/** Funding asset name */
export type PolymarketPerpsFua = string;

/** Funding paid in USD */
export type PolymarketPerpsFund = string;

/** Funding interval */
export type PolymarketPerpsFundingInterval = string;

/** On-chain transaction hash, "0x" if not yet mined */
export type PolymarketPerpsHash = string;

/** Engine sequence of the history event. */
export type PolymarketPerpsHistorySequence = number;

/** Instrument ID */
export type PolymarketPerpsIid = number;

/** Whether the account is currently under liquidation */
export type PolymarketPerpsInLiquidation = boolean;

/** Index price */
export type PolymarketPerpsIndexPrice = string;

/** Current collateral backing the position. For cross positions, this is the required initial margin based on position size, mark price, the applicable risk tier, and configured leverage. For isolated positions, this is the position's current equity: signed allocated margin plus unrealized PnL… */
export type PolymarketPerpsInitialMargin = string;

/** Instrument ID */
export type PolymarketPerpsInstrumentId = number;

/** Instrument type */
export type PolymarketPerpsInstrumentType = string;

/** Whether the instrument supports only isolated account margin. When false, both cross and isolated account margin modes are supported. */
export type PolymarketPerpsIsolatedOnly = boolean;

/** Conditional order type (TakeProfit / StopLoss) */
export type PolymarketPerpsKind = string;

/** - `1767225600000` - Open time - `"100.00"` - Open price - `"105.00"` - High price - `"99.00"` - Low price - `"102.00"` - Close price - `"500.00"` - Volume (base unit) - `42` - Number of trades */
export type PolymarketPerpsKline = Array<PolymarketJsonValue>;

/** Last 24-hour kline data */
export type PolymarketPerpsKlines = Array<PolymarketPerpsKline>;

/** Human-readable label for a proxy key or internal transfer */
export type PolymarketPerpsLabel = string;

/** Leverage */
export type PolymarketPerpsLev = number;

/** - `"100.00"` - Price - `"10.00"` - Quantity */
export type PolymarketPerpsLevel = Array<string>;

/** Leverage */
export type PolymarketPerpsLeverage = number;

/** Liquidation ID. Identifies one absorption of an account's positions by the insurance fund. Probabilistically unique (same guarantees as trade IDs). */
export type PolymarketPerpsLid = number;

/** Whether this fill was part of a liquidation of the account's position — true on forced closes and on any fill executed while the account was under liquidation on the instrument, maker or taker. False on the counterparty leg of an auto-deleveraging or backstop match — its fill is part of someone… */
export type PolymarketPerpsLiq = boolean;

/** Liquidation fee rate */
export type PolymarketPerpsLiquidationFee = string;

/** Liquidation price */
export type PolymarketPerpsLiquidationPrice = string;

/** Position size lower bound */
export type PolymarketPerpsLowerBound = string;

/** Maintenance margin amount */
export type PolymarketPerpsMaintenanceMarginAmount = string;

/** Exchange maker fee rate as a decimal fraction, excluding any per-order builder fee */
export type PolymarketPerpsMakerFeeRate = string;

/** Rolling 7-day account maker volume divided by total exchange volume */
export type PolymarketPerpsMakerShare7d = string;

/** Rolling 7-day perpetual maker volume in USD */
export type PolymarketPerpsMakerVolume7d = string;

/** - `1767225600000` - Bucket open time (ms) - `"160.00"` - Last mark price in bucket */
export type PolymarketPerpsMarkPoint = Array<PolymarketJsonValue>;

/** Maximum leverage */
export type PolymarketPerpsMaxLeverage = number;

/** Maximum limit order notional value in USD */
export type PolymarketPerpsMaxLimitNotional = string;

/** Maximum market order notional value in USD */
export type PolymarketPerpsMaxMarketNotional = string;

/** Maximum open order count */
export type PolymarketPerpsMaxOrderCount = number;

/** Display-only per-minute action/message allowance, equal to actions_per_minute_limit. Not separately configured or enforced. */
export type PolymarketPerpsMessagesPerMinute = number;

/** Net margin transferred to the insurance fund in USD, covering the quote asset only. Negative when the fund returned more isolated margin than the account's balance covered, i.e. it absorbed bad debt. */
export type PolymarketPerpsMgn = string;

/** Minimum notional value in USD */
export type PolymarketPerpsMinNotional = string;

/** Minimum volume threshold for this tier */
export type PolymarketPerpsMinVolume = string;

/** Minimum rolling 30-day notional volume in USD required for this tier */
export type PolymarketPerpsMinVolume30d = string;

/** More data available */
export type PolymarketPerpsMore = boolean;

/** Exchange name used in the EIP-712 domain. */
export type PolymarketPerpsName = string;

/** Opaque pagination cursor. Pass the next_cursor value from the previous page to fetch the next, older page. Null when there are no more pages. */
export type PolymarketPerpsNotifCursor = string | null;

/** Trading volume in USD notional as an unformatted numeric string */
export type PolymarketPerpsNotional = string;

/** Number of entries to skip */
export type PolymarketPerpsOffset = number;

/** Order ID */
export type PolymarketPerpsOid = number;

/** Timestamp of the open-interest sample in Unix milliseconds. Null when no complete sample is available. */
export type PolymarketPerpsOpenInterestTimestamp = number | null;

/** Current number of open orders */
export type PolymarketPerpsOpenOrders = number;

/** Maximum number of open orders per account */
export type PolymarketPerpsOpenOrdersLimit = number;

/** Opening price of the earliest populated candle in the rolling 24-hour window, whose start is rounded down to the minute. Returns "0" when the window has no candles. */
export type PolymarketPerpsOpenPrice = string;

/** Price */
export type PolymarketPerpsP = string;

/** Parent entry order id. Optional — omit it (do not send `0`) when the parent is created in the same request (inline `CreateOrder.tpsl` or `CreateTpSlArgs.parent`); the gateway auto-wires the child to it. Set it only to attach an order-scoped leg to an existing resting order. Inline… */
export type PolymarketPerpsParentOid = number;

/** Position entry price before the fill */
export type PolymarketPerpsPep = string;

/** PnL in USD */
export type PolymarketPerpsPnl = string;

/** Post only */
export type PolymarketPerpsPo = boolean;

/** Notional position value in USD */
export type PolymarketPerpsPositionValue = string;

/** Price */
export type PolymarketPerpsPrice = string;

/** Price bounds percentage */
export type PolymarketPerpsPriceBounds = string;

/** Number of decimal places for price. Non-integer prices have a maximum of 5 significant figures; integer prices are allowed regardless of significant figures. */
export type PolymarketPerpsPriceDecimals = number;

/** Proxy address in hex format */
export type PolymarketPerpsProxy = string;

/** Position size before the fill */
export type PolymarketPerpsPsz = string;

/** Quantity in no. of contracts */
export type PolymarketPerpsQty = string;

/** Quantity in number of contracts */
export type PolymarketPerpsQuantity = string;

/** Number of decimal places for quantity. */
export type PolymarketPerpsQuantityDecimals = number;

/** Quote asset name */
export type PolymarketPerpsQuoteAsset = string;

/** Leaderboard rank under the requested ranking metric, starting at 1 */
export type PolymarketPerpsRank = number;

/** Legacy limit-tier request-rate field. It is not used for gateway enforcement. */
export type PolymarketPerpsRateBurstLimit = number;

/** Maximum IP request weight per minute. In limit tiers, this is a legacy field and is not used for gateway enforcement. */
export type PolymarketPerpsRatePerMinuteLimit = number;

/** Timestamp in milliseconds when the current interval resets */
export type PolymarketPerpsRateReset = number;

/** When the recipient marked this notification read, Unix milliseconds; null if unread. */
export type PolymarketPerpsReadAt = number | null;

/** Number of additional referrals remaining for this account's invite code */
export type PolymarketPerpsReferralsLeft = number;

/** Required number of block confirmations */
export type PolymarketPerpsRequiredConfirmations = number;

/** Resting quantity */
export type PolymarketPerpsRest = string;

/** Unrealized PnL divided by the position's current required initial margin, as a decimal. */
export type PolymarketPerpsReturnOnEquity = string;

/** Reward amount attributed to this reward row */
export type PolymarketPerpsRewardAmount = string;

/** Whether rewards for this period have been marked as distributed */
export type PolymarketPerpsRewardDistributed = boolean;

/** Configured reward pool for the instrument */
export type PolymarketPerpsRewardPool = string;

/** Reduce only */
export type PolymarketPerpsRo = boolean;

/** Return on investment over the window as a fraction, not a percentage ("0.4527" is 45.27%): `pnl / max(100, starting_equity + max_net_deposits)`. `pnl` is this row's `pnl`. `starting_equity` is the account equity sampled last before the window start (0 for `all`, and 0 for accounts with no… */
export type PolymarketPerpsRoi = string;

/** API secret */
export type PolymarketPerpsSecret = string;

/** Sequence number */
export type PolymarketPerpsSequence = number;

/** Whether this fill closes a position during permanent instrument settlement. Settlement fills use the final settlement price and have no fees or liquidation penalties; they are not normal market trades or ADL. */
export type PolymarketPerpsSettlementFill = boolean;

/** Total quote asset amount debited from the insurance fund to cover eligible settlement deficits. */
export type PolymarketPerpsSettlementInsuranceDebit = string;

/** Final settlement price from the trailing 30-minute time-weighted index average. Every remaining position closes at this price with no settlement fee. */
export type PolymarketPerpsSettlementPrice = string;

/** Engine sequence of the accepted instrument settlement event. */
export type PolymarketPerpsSettlementSequence = number;

/** Settlement cutoff as integer Unix milliseconds. The trailing 30-minute index average ends at this time. */
export type PolymarketPerpsSettlementTimestamp = number;

/** Side */
export type PolymarketPerpsSide = string;

/** Signed position size in no. of contracts (positive = long, negative = short) */
export type PolymarketPerpsSize = string;

/** Per-order market-trigger slippage cap in basis points. 0 = use the per-instrument default. Clamped to the instrument cap. */
export type PolymarketPerpsSlipBps = number;

/** Leaderboard ranking metric */
export type PolymarketPerpsSortBy = string;

/** Source name */
export type PolymarketPerpsSource = string;

/** Order status, such as `open` for a resting order. See [Handle Terminal Order Outcomes](/perps/trading#handle-terminal-order-outcomes) for the statuses that end an order. */
export type PolymarketPerpsSt = string;

/** Start timestamp in milliseconds */
export type PolymarketPerpsStartTimestamp = number;

/** Instrument symbol */
export type PolymarketPerpsSymbol = string;

/** Signed position size in no. of contracts (positive = long, negative = short) */
export type PolymarketPerpsSz = string;

/** Whether this side was the taker */
export type PolymarketPerpsTaker = boolean;

/** Exchange taker fee rate as a decimal fraction, excluding any per-order builder fee */
export type PolymarketPerpsTakerFeeRate = string;

/** Rolling 7-day perpetual taker volume in USD */
export type PolymarketPerpsTakerVolume7d = string;

/** Trade ID */
export type PolymarketPerpsTid = number;

/** Time in force */
export type PolymarketPerpsTif = string;

/** Timestamp in milliseconds */
export type PolymarketPerpsTime2 = number;

/** Timestamp in milliseconds */
export type PolymarketPerpsTimestamp = number;

/** Destination address in hex format */
export type PolymarketPerpsTo = string;

/** Total number of ranked accounts */
export type PolymarketPerpsTotal = number;

/** Total account value in USD (equity + unrealized PnL) */
export type PolymarketPerpsTotalAccountValue = string;

/** Exact signed sum of exchange fee and builder_fee in the same asset. May be negative when exchange rebates exceed the builder charge. */
export type PolymarketPerpsTotalFee = string;

/** Total initial margin in use across all positions */
export type PolymarketPerpsTotalInitialMargin = string;

/** Total maintenance margin across all positions */
export type PolymarketPerpsTotalMaintenanceMargin = string;

/** Total notional position value in USD */
export type PolymarketPerpsTotalPositionValue = string;

/** How the conditional order sizes itself. - `order` - child of a parent entry (bracket / OCO ladder). Quantity is required. - `position` - attached to an open position. v1 always closes the full position (`qty` must be `"0"`). */
export type PolymarketPerpsTrScope = string;

/** Internal transfer ID */
export type PolymarketPerpsTransferId = number;

/** Trigger price */
export type PolymarketPerpsTrp = string;

/** Request timestamp. Unix milliseconds for most operations; Unix seconds for withdrawals (must match the on-chain EIP-712 struct verified against block.timestamp). */
export type PolymarketPerpsTs = number;

/** Unix timestamp in milliseconds when first-party interfaces may display the instrument. A null value means hidden. This advisory field does not affect trading availability. */
export type PolymarketPerpsUiLiveTime = number | null;

/** Count of the authenticated owner's unread notifications within the retention window. */
export type PolymarketPerpsUnread = number;

/** Unrealized PnL in USD */
export type PolymarketPerpsUnrealizedPnl = string;

/** Update timestamp in milliseconds */
export type PolymarketPerpsUpdateTimestamp = number;

/** Update timestamp in milliseconds */
export type PolymarketPerpsUts = number;

/** USD value */
export type PolymarketPerpsValue = string;

/** Exchange version used in the EIP-712 domain. */
export type PolymarketPerpsVersion = string;

/** 24-hour trading volume in quote-asset notional (sum of price times quantity), as a numeric string */
export type PolymarketPerpsVolume = string;

/** Rolling 7-day perpetual trading volume in USD */
export type PolymarketPerpsVolume7d = string;

/** Index constituent weight */
export type PolymarketPerpsWeight = string;

/** Leaderboard window, anchored to calendar UTC boundaries. `day` starts at 00:00 UTC today, `week` at Monday 00:00 UTC, `month` at the first of the month 00:00 UTC, `all` at exchange launch. */
export type PolymarketPerpsWindow = string;

/** Withdraw ID */
export type PolymarketPerpsWithdrawId = number;

/** Withdrawable balance in USD */
export type PolymarketPerpsWithdrawable = string;

/** Withdrawal transaction fee in decimalized asset units */
export type PolymarketPerpsWithdrawalFee = string;

/** Withdrawal status */
export type PolymarketPerpsWithdrawalStatus = string;

/** Ethereum address (0x-prefixed, 40 hex chars) */
export type PolymarketRelayerAddress = string;

export type PolymarketRelayerDeployedResponse = {
	/** Whether the wallet is deployed */
	deployed?: boolean | null;
	[key: string]: unknown;
};

export type PolymarketRelayerNonceResponse = {
	/** Current nonce value */
	nonce?: string | null;
	[key: string]: unknown;
};

export type PolymarketRelayerRelayPayloadResponse = {
	/** Relayer address */
	address?: PolymarketRelayerAddress | null;
	/** Current nonce value */
	nonce?: string | null;
	[key: string]: unknown;
};

export type PolymarketRelayerRelayerApiKey = {
	/** The relayer API key */
	apiKey?: string | null;
	/** The address that owns the key */
	address?: PolymarketRelayerAddress | null;
	/** Timestamp when the key was created */
	createdAt?: string | null;
	/** Timestamp when the key was last updated */
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketRelayerRelayerTransaction = {
	/** Unique identifier for the transaction */
	transactionID?: string | null;
	/** Onchain transaction hash (available once confirmed) */
	transactionHash?: string | null;
	/** Signer address */
	from?: PolymarketRelayerAddress | null;
	/** Target contract address */
	to?: PolymarketRelayerAddress | null;
	/** User's Polymarket proxy wallet address */
	proxyAddress?: PolymarketRelayerAddress | null;
	/** Encoded transaction data (0x-prefixed hex string) */
	data?: string | null;
	/** Transaction nonce */
	nonce?: string | null;
	/** Transaction value */
	value?: string | null;
	/** Transaction signature (0x-prefixed hex string) */
	signature?: string | null;
	/** Current state of the transaction */
	state?: string | null;
	/** Transaction type */
	type?: string | null;
	/** Owner address */
	owner?: PolymarketRelayerAddress | null;
	/** Transaction metadata */
	metadata?: string | null;
	/** Timestamp when the transaction was created */
	createdAt?: string | null;
	/** Timestamp when the transaction was last updated */
	updatedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketRelayerSubmitResponse = {
	/** Unique identifier for the submitted transaction */
	transactionID?: string | null;
	/** Current state of the transaction */
	state?: string | null;
	[key: string]: unknown;
};

export type PolymarketRfqAddress = string;

/** A base-10 integer in 6-decimal units. */
export type PolymarketRfqAmount = string;

export type PolymarketRfqCheck = {
	/** `missing` is a check that could not run. It is not a pass. */
	status?: string | null;
	reason?: PolymarketRfqRejectionReason | null;
	detail?: string | null;
	[key: string]: unknown;
};

/** A combo's on-chain identity. Present on combo trades only. */
export type PolymarketRfqCombo = {
	conditionId?: string | null;
	tokenIdYes?: PolymarketRfqUint256 | null;
	tokenIdNo?: PolymarketRfqUint256 | null;
	legs?: Array<PolymarketRfqComboLeg> | null;
	[key: string]: unknown;
};

export type PolymarketRfqComboLeg = {
	/** A gamma market id. */
	marketId?: string | null;
	outcome?: string | null;
	[key: string]: unknown;
};

export type PolymarketRfqGuardrailCheck = {
	/** `taker_notional`: the taker's own collateral leg is below the minimum trade size. `price_deviation`: a leg's price is too far from its token's CLOB midpoint. `transaction_notional`: the trade is above the maximum trade size. `counterparty_notional`: a wallet, or the partner, would pass its… */
	id?: string | null;
	status?: string | null;
	reason?: PolymarketRfqRejectionReason | null;
	detail?: string | null;
	/** The side the verdict is about, when it is about one. */
	party?: string | null;
	[key: string]: unknown;
};

/** A CTF Exchange v2 order, in the field order and encoding it is signed in. */
export type PolymarketRfqOrder = {
	salt?: PolymarketRfqUint256 | null;
	maker?: PolymarketRfqAddress | null;
	signer?: PolymarketRfqAddress | null;
	tokenId?: PolymarketRfqUint256 | null;
	makerAmount?: PolymarketRfqAmount | null;
	takerAmount?: PolymarketRfqAmount | null;
	/** `0` buy, `1` sell. */
	side?: number | null;
	signatureType?: number | null;
	/** Unix seconds the order was built at. */
	timestamp?: string | null;
	/** bytes32 hex. */
	metadata?: string | null;
	/** bytes32 hex. The partner's builder code, set by the service. */
	builder?: string | null;
	[key: string]: unknown;
};

export type PolymarketRfqOutcomeBand = {
	tokenId?: PolymarketRfqUint256 | null;
	mark?: string | null;
	lower?: string | null;
	upper?: string | null;
	/** `unavailable` when no midpoint could be read; `mark`, `lower` and `upper` are then omitted. */
	source?: string | null;
	[key: string]: unknown;
};

export type PolymarketRfqPrepareResult = {
	/** Keyed like the request's `parties`. */
	orders?: Record<string, PolymarketRfqPreparedOrder> | null;
	/** The fee each side will be charged, keyed like `orders`. */
	fees?: Record<string, PolymarketRfqAmount> | null;
	/** After this, a submission of these orders is refused as stale. */
	expiresAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketRfqPreparedOrder = {
	order?: PolymarketRfqOrder | null;
	/** The nested ERC-7739 payload to pass to `eth_signTypedData_v4`. */
	typedData?: Record<string, PolymarketJsonValue> | null;
	role?: PolymarketRfqRole | null;
	/** The hash the raw ECDSA signature verifies against. */
	digest?: string | null;
	/** Appended to the raw signature to form the submitted one (`rawSignature || signatureSuffix`). */
	signatureSuffix?: string | null;
	[key: string]: unknown;
};

export type PolymarketRfqPriceBand = {
	marketId?: string | null;
	/** The fraction of each mark the band spans. */
	tolerance?: string | null;
	outcomes?: {
		yes?: PolymarketRfqOutcomeBand | null;
		no?: PolymarketRfqOutcomeBand | null;
		[key: string]: unknown;
	} | null;
	readAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketRfqPriceCheck = {
	status?: string | null;
	reason?: PolymarketRfqRejectionReason | null;
	detail?: string | null;
	/** The band the price was judged against, for the token the request priced. */
	band?: {
		mark?: string | null;
		lower?: string | null;
		upper?: string | null;
		[key: string]: unknown;
	} | null;
	[key: string]: unknown;
};

export type PolymarketRfqProbe = {
	data?: string | null;
	[key: string]: unknown;
};

/** The machine-readable reason a check failed or a request was rejected. New values may be added. See the guardrail and validation guides for each one. */
export type PolymarketRfqRejectionReason = string;

/** Which fee rate a side pays. Set it on both sides or on neither; omitted, the `yes` side of a split or merge and the `buyer` of a trade are the taker. */
export type PolymarketRfqRole = string;

export type PolymarketRfqServerTime = {
	serverTime?: string | null;
	/** The same instant in Unix seconds, ready to use as `RFQ-Timestamp`. */
	timestamp?: number | null;
	[key: string]: unknown;
};

export type PolymarketRfqSubmitResult = {
	tradeId?: string | null;
	status?: PolymarketRfqTradeState | null;
	/** The fee each side is charged, keyed like the trade's parties. */
	fees?: Record<string, PolymarketRfqAmount> | null;
	/** Set once the trade has executed, so only on a replay. */
	transactionHash?: string | null;
	createdAt?: string | null;
	combo?: PolymarketRfqCombo | null;
	[key: string]: unknown;
};

/** `PENDING` until the trade lands on-chain (`FILLED`) or is refused or fails (`REJECTED`). */
export type PolymarketRfqTradeState = string;

export type PolymarketRfqTradeStatus = {
	tradeId?: string | null;
	combo?: PolymarketRfqCombo | null;
	idempotencyKey?: string | null;
	status?: PolymarketRfqTradeState | null;
	transactionHash?: string | null;
	/** Why a `REJECTED` trade failed. `execution_failed` is a failure after submission to the exchange. */
	failureReason?: (PolymarketRfqRejectionReason | string) | null;
	createdAt?: string | null;
	filledAt?: string | null;
	[key: string]: unknown;
};

/** A base-10 uint256. */
export type PolymarketRfqUint256 = string;

export type PolymarketRfqValidationResult = {
	/** Whether a submission of these terms would be accepted now. */
	valid?: boolean | null;
	checks?: {
		market?: PolymarketRfqCheck | null;
		price?: PolymarketRfqPriceCheck | null;
		/** Keyed like the request's `parties`. */
		parties?: Record<string, PolymarketRfqCheck> | null;
		/** One entry per guardrail, in the order they run. The first failure is the one a submission returns. */
		guardrails?: Array<PolymarketRfqGuardrailCheck> | null;
		[key: string]: unknown;
	} | null;
	checkedAt?: string | null;
	[key: string]: unknown;
};

export type PolymarketOperationInputs = {
	'bridge.deposit': {
		/** Optional builder code (bytes32 hex) attributing this request to your integration so transfer issues can be traced to your app. Omitting it still succeeds but returns a `missing_builder_code` warning; a malformed code returns 400. Get your code at https://polymarket.com/settings?tab=builder */
		x_builder_code?: string;
		/** Your Polymarket wallet address where deposited funds will be credited as pUSD */
		address: PolymarketBridgeAddressInput;
	};
	'bridge.quote': {
		/** Amount of tokens to send */
		fromAmountBaseUnit: string;
		/** Source Chain ID */
		fromChainId: string;
		/** Source token address */
		fromTokenAddress: string;
		/** Address of the recipient */
		recipientAddress: string;
		/** Destination Chain ID */
		toChainId: string;
		/** Destination token address */
		toTokenAddress: string;
	};
	'bridge.status': {
		/** The bridge address to query for transaction status, taken from the `/deposit` or `/withdraw` response. EVM, Solana, Tron, and Bitcoin address formats are supported. EVM addresses are normalized before the request is forwarded upstream. */
		address: string;
		/** Maximum number of transactions per page. A page may contain fewer transactions than requested and still have a following page. */
		limit?: number;
		/** Opaque continuation token returned as `nextCursor` by the previous response. Omit it to request the first page. URL-encode it, since cursors can contain characters such as `+`, `/`, and `=`. Invalid, tampered, or cross-address tokens return 400; restart the walk without a cursor when that happens. */
		cursor?: string;
		/** Compatibility parameter forwarded upstream for existing integrations. Pagination applies whether or not it is sent, so new integrations should omit it and use `cursor` and `limit` alone. When sent, the only supported value is `true`. */
		paginate?: 'true';
	};
	'bridge.supportedAssets': Record<string, never>;
	'bridge.withdraw': {
		/** Optional builder code (bytes32 hex) attributing this request to your integration so transfer issues can be traced to your app. Omitting it still succeeds but returns a `missing_builder_code` warning; a malformed code returns 400. Get your code at https://polymarket.com/settings?tab=builder */
		x_builder_code?: string;
		/** Source Polymarket wallet address on Polygon */
		address: PolymarketBridgeAddressInput;
		/** Destination chain ID (e.g., "1" for Ethereum, "8453" for Base, "1151111081099710" for Solana) */
		toChainId: string;
		/** Destination token contract address */
		toTokenAddress: string;
		/** Destination wallet address where funds will be sent */
		recipientAddr: string;
	};
	'clob.apiKeys.create': {
		/** The wallet (EOA) address that signed the ClobAuth message. */
		poly_address: string;
		/** The wallet's EIP-712 signature of the ClobAuth message. */
		poly_signature: string;
		/** The Unix timestamp (seconds) signed in the message. */
		poly_timestamp: string;
		/** The nonce signed in the message (0 unless you chose another). */
		poly_nonce: string;
	};
	'clob.apiKeys.delete': Record<string, never>;
	'clob.apiKeys.derive': {
		/** The wallet (EOA) address that signed the ClobAuth message. */
		poly_address: string;
		/** The wallet's EIP-712 signature of the ClobAuth message. */
		poly_signature: string;
		/** The Unix timestamp (seconds) signed in the message. */
		poly_timestamp: string;
		/** The nonce signed in the message (0 unless you chose another). */
		poly_nonce: string;
	};
	'clob.apiKeys.list': {
		/** The wallet (EOA) address that signed the ClobAuth message. */
		poly_address: string;
		/** The wallet's EIP-712 signature of the ClobAuth message. */
		poly_signature: string;
		/** The Unix timestamp (seconds) signed in the message. */
		poly_timestamp: string;
		/** The nonce signed in the message (0 unless you chose another). */
		poly_nonce: string;
	};
	'clob.balanceAllowance.get': {
		/** Type of asset */
		asset_type: 'COLLATERAL' | 'CONDITIONAL';
		/** Token ID (asset ID). Defaults to "-1" for ERC20 collateral. */
		token_id?: string;
		/** Signature type for address derivation (0=EOA, 1=POLY_PROXY, 2=POLY_GNOSIS_SAFE, 3=POLY_1271) */
		signature_type?: 0 | 1 | 2 | 3;
	};
	'clob.balanceAllowance.refresh': {
		/** Type of asset */
		asset_type: 'COLLATERAL' | 'CONDITIONAL';
		/** Token ID (asset ID). Defaults to "-1" for ERC20 collateral. */
		token_id?: string;
		/** Signature type for address derivation (0=EOA, 1=POLY_PROXY, 2=POLY_GNOSIS_SAFE, 3=POLY_1271) */
		signature_type?: 0 | 1 | 2 | 3;
	};
	'clob.balanceAllowance.update': {
		/** Type of asset */
		asset_type: 'COLLATERAL' | 'CONDITIONAL';
		/** Token ID (asset ID). Defaults to "-1" for ERC20 collateral. */
		token_id?: string;
		/** Signature type for address derivation (0=EOA, 1=POLY_PROXY, 2=POLY_GNOSIS_SAFE, 3=POLY_1271) */
		signature_type?: 0 | 1 | 2 | 3;
	};
	'clob.books.get': {
		/** Token ID (asset ID) */
		token_id: string;
	};
	'clob.books.list': {
		/** Comma-separated list of token IDs */
		token_ids: string;
	};
	'clob.books.listByBody': {
		/** The request body. */
		body: Array<PolymarketClobBookRequestInput>;
	};
	'clob.builderApiKeys.create': Record<string, never>;
	'clob.builderApiKeys.list': Record<string, never>;
	'clob.builderApiKeys.revoke': Record<string, never>;
	'clob.closedOnlyMode': Record<string, never>;
	'clob.feeRate.get': {
		/** Token ID (asset ID) */
		token_id?: string;
	};
	'clob.feeRate.getByToken': {
		/** Token ID (asset ID) */
		token_id: string;
	};
	'clob.heartbeats.send': Record<string, never>;
	'clob.heartbeats.sendV1': {
		/** The heartbeat ID from the previous response. For the first request, this should be empty. Subsequent requests must use the heartbeat_id returned from the previous response. */
		heartbeat_id: string;
	};
	'clob.lastTradePrices.get': {
		/** Token ID (asset ID) */
		token_id: string;
	};
	'clob.lastTradePrices.list': {
		/** Comma-separated list of token IDs (max 500) */
		token_ids: string;
	};
	'clob.lastTradePrices.listByBody': {
		/** The request body. */
		body: Array<PolymarketClobBookRequestInput>;
	};
	'clob.markets.get': {
		/** The condition ID of the market */
		condition_id: string;
	};
	'clob.markets.getByToken': {
		/** The token ID to look up the parent market for */
		token_id: string;
	};
	'clob.markets.listSampling': {
		next_cursor?: string;
	};
	'clob.markets.listSamplingSimplified': {
		next_cursor?: string;
	};
	'clob.markets.listSimplified': {
		next_cursor?: string;
	};
	'clob.markets.liveActivity': {
		/** Array of condition IDs to fetch */
		body: Array<string>;
	};
	'clob.markets.liveActivityByCondition': {
		/** The condition ID of the market */
		condition_id: string;
	};
	'clob.midpoints.get': {
		/** Token ID (asset ID) */
		token_id: string;
	};
	'clob.midpoints.list': {
		/** Comma-separated list of token IDs */
		token_ids: string;
	};
	'clob.midpoints.listByBody': {
		/** The request body. */
		body: Array<PolymarketClobBookRequestInput>;
	};
	'clob.negRisk.get': {
		/** Token ID (asset ID) */
		token_id?: string;
	};
	'clob.negRisk.getByToken': {
		/** Token ID (asset ID) */
		token_id: string;
	};
	'clob.notifications.list': {
		/** Signature type for address derivation: - 0: EOA - 1: POLY_PROXY - 2: POLY_GNOSIS_SAFE - 3: POLY_1271 (Deposit Wallet) */
		signature_type: 0 | 1 | 2 | 3;
	};
	'clob.notifications.markRead': {
		/** Comma-separated list of notification IDs to mark as read */
		ids: string;
	};
	'clob.orderScoring.get': {
		/** The order ID (order hash) to check scoring status for */
		order_id: string;
	};
	'clob.orderScoring.list': {
		/** Array of order IDs (order hashes) to check scoring status for */
		order_ids: Array<string>;
	};
	'clob.orderScoring.listByBody': {
		/** Array of order IDs (order hashes) to check scoring status for */
		body: Array<string>;
	};
	'clob.orders.cancel': {
		/** Order ID (order hash) to cancel */
		orderID: string;
	};
	'clob.orders.cancelAll': Record<string, never>;
	'clob.orders.cancelMany': {
		/** The request body. */
		body: Array<string>;
	};
	'clob.orders.cancelMarket': {
		/** Market (condition ID) */
		market: string;
		/** Asset ID (token ID) */
		asset_id: string;
	};
	'clob.orders.cancelWallet': {
		/** Set exactly one field. The server deduplicates order_ids. */
		body: PolymarketClobCancelWalletOrdersPayloadInput;
	};
	'clob.orders.create': {
		order: PolymarketClobOrderInput;
		/** UUID of the API key owner */
		owner: string;
		/** Time in force */
		orderType?: 'GTC' | 'FOK' | 'GTD' | 'FAK';
		/** Whether to defer execution */
		deferExec?: boolean;
		/** Whether the order must rest on the book and not match immediately. Only supported for GTC and GTD orders. */
		postOnly?: boolean;
	};
	'clob.orders.createMany': {
		/** The request body. */
		body: Array<PolymarketClobSendOrderInput>;
	};
	'clob.orders.get': {
		/** Order ID (order hash) */
		orderID: string;
	};
	'clob.orders.list': {
		/** Order ID (hash) to filter by specific order */
		id?: string;
		/** Market condition ID to filter orders. Required when asset_id is supplied. */
		market?: string;
		/** Outcome identifier (CTF token ID or Polymarket V2 position ID) to filter orders. Also supply market. */
		asset_id?: string;
		/** Cursor for pagination (base64 encoded offset) */
		next_cursor?: string;
	};
	'clob.orders.listWalletOpen': {
		/** Exact-match filter on the condition ID */
		market?: string;
		/** Exact-match filter on the token ID */
		asset_id?: string;
		/** Filter to orders placed by these signer addresses (maximum 50). Accepts comma-separated or repeated values. Addresses outside the wallet match nothing. */
		session_keys?: Array<string>;
		/** The next_cursor returned by the previous page */
		cursor?: string;
	};
	'clob.prices.get': {
		/** Token ID (asset ID) */
		token_id: string;
		/** Order side */
		side: 'BUY' | 'SELL';
	};
	'clob.prices.list': {
		/** Comma-separated list of token IDs */
		token_ids: string;
		/** Comma-separated list of sides (BUY or SELL) corresponding to token IDs */
		sides: string;
	};
	'clob.prices.listByBody': {
		/** The request body. */
		body: Array<PolymarketClobBookRequestInput>;
	};
	'clob.pricesHistory.batch': {
		/** List of market asset ids to query. Maximum 20. */
		markets: Array<string>;
		/** Filter by items after this unix timestamp (seconds). */
		start_ts?: number;
		/** Filter by items before this unix timestamp (seconds). */
		end_ts?: number;
		/** Time interval for data aggregation. */
		interval?: 'max' | 'all' | '1m' | '1w' | '1d' | '6h' | '1h';
		/** Accuracy of the data expressed in minutes. Default is 1 minute. */
		fidelity?: number;
	};
	'clob.pricesHistory.get': {
		/** The market (asset id) to query. */
		market: string;
		/** Filter by items after this unix timestamp. */
		startTs?: number;
		/** Filter by items before this unix timestamp. */
		endTs?: number;
		/** Time interval for data aggregation. */
		interval?: 'max' | 'all' | '1m' | '1w' | '1d' | '6h' | '1h';
		/** Accuracy of the data expressed in minutes. Default is 1 minute. */
		fidelity?: number;
	};
	'clob.rateLimitTier': Record<string, never>;
	'clob.rebates.current': {
		/** Date in YYYY-MM-DD format */
		date: string;
		/** Ethereum address of the maker */
		maker_address: string;
	};
	'clob.rewards.current': {
		/** If true, returns sponsored reward configurations instead of standard ones */
		sponsored?: boolean;
		/** Pagination cursor from previous response */
		next_cursor?: string;
	};
	'clob.rewards.market': {
		/** The condition ID of the market */
		condition_id: string;
		/** If true, folds sponsored daily rates into each config's rate_per_day */
		sponsored?: boolean;
		/** Pagination cursor from previous response */
		next_cursor?: string;
	};
	'clob.rewards.markets': {
		/** Text search on market question/description */
		q?: string;
		/** Filter by tag slug. Can be repeated for OR logic (e.g., ?tag_slug=sports&tag_slug=politics) */
		tag_slug?: string;
		/** Filter by event ID. Can be repeated for multiple events (e.g., ?event_id=100&event_id=200) */
		event_id?: string;
		/** Search event titles using case-insensitive pattern matching */
		event_title?: string;
		/** Field to sort results by */
		order_by?:
			| 'market_id'
			| 'created_at'
			| 'volume_24hr'
			| 'spread'
			| 'competitiveness'
			| 'max_spread'
			| 'min_size'
			| 'question'
			| 'one_day_price_change'
			| 'rate_per_day'
			| 'price'
			| 'end_date'
			| 'start_date'
			| 'reward_end_date';
		/** Sort direction */
		position?: 'ASC' | 'DESC';
		/** Minimum 24-hour volume filter */
		min_volume_24hr?: number;
		/** Maximum 24-hour volume filter */
		max_volume_24hr?: number;
		/** Minimum spread filter */
		min_spread?: number;
		/** Maximum spread filter */
		max_spread?: number;
		/** Minimum first token price filter */
		min_price?: number;
		/** Maximum first token price filter */
		max_price?: number;
		/** Pagination cursor from previous response */
		next_cursor?: string;
		/** Number of items per page (max 500, values above are capped) */
		page_size?: number;
	};
	'clob.rewards.userEarnings': {
		/** Date in YYYY-MM-DD format */
		date: string;
		/** Signature type for address derivation (required for API KEY auth): - 0: EOA - 1: POLY_PROXY - 2: POLY_GNOSIS_SAFE - 3: POLY_1271 (Deposit Wallet) */
		signature_type?: 0 | 1 | 2 | 3;
		/** Maker address to query earnings for */
		maker_address?: string;
		/** If true, returns sponsored-only earnings */
		sponsored?: boolean;
		/** Pagination cursor from previous response */
		next_cursor?: string;
	};
	'clob.rewards.userMarkets': {
		/** Date in YYYY-MM-DD format. Defaults to current date if not provided. */
		date?: string;
		/** Signature type for address derivation (required for API KEY auth): - 0: EOA - 1: POLY_PROXY - 2: POLY_GNOSIS_SAFE - 3: POLY_1271 (Deposit Wallet) */
		signature_type?: 0 | 1 | 2 | 3;
		/** Maker address to query data for */
		maker_address?: string;
		/** If true, returns sponsored reward earnings */
		sponsored?: boolean;
		/** Pagination cursor from previous response */
		next_cursor?: string;
		/** Number of items per page (max 500, values above are capped) */
		page_size?: number;
		/** Search query to filter markets by question/description */
		q?: string;
		/** Filter by tag slug (can be repeated for OR logic) */
		tag_slug?: string;
		/** If true, only show markets favorited by the user (requires auth) */
		favorite_markets?: boolean;
		/** Filter for markets with no competition */
		no_competition?: boolean;
		/** Filter for only mergeable markets */
		only_mergeable?: boolean;
		/** Filter for markets where user has open orders */
		only_open_orders?: boolean;
		/** Filter for markets where user has open positions */
		only_open_positions?: boolean;
		/** Field to sort by */
		order_by?:
			| 'max_spread'
			| 'min_size'
			| 'end_date'
			| 'earning_percentage'
			| 'rate_per_day'
			| 'earnings'
			| 'spread'
			| 'competitiveness'
			| 'question'
			| 'price'
			| 'market'
			| 'volume_24hr';
		/** Sort direction */
		position?: 'ASC' | 'DESC';
	};
	'clob.rewards.userPercentages': {
		/** Signature type for address derivation (required for API KEY auth): - 0: EOA - 1: POLY_PROXY - 2: POLY_GNOSIS_SAFE - 3: POLY_1271 (Deposit Wallet) */
		signature_type?: 0 | 1 | 2 | 3;
		/** Maker address to query percentages for */
		maker_address?: string;
	};
	'clob.rewards.userTotalEarnings': {
		/** Date in YYYY-MM-DD format */
		date: string;
		/** Signature type for address derivation (required for API KEY auth): - 0: EOA - 1: POLY_PROXY - 2: POLY_GNOSIS_SAFE - 3: POLY_1271 (Deposit Wallet) */
		signature_type?: 0 | 1 | 2 | 3;
		/** Maker address to query earnings for */
		maker_address?: string;
		/** If true, aggregates both native and sponsored earnings */
		sponsored?: boolean;
	};
	'clob.spreads.get': {
		/** Token ID (asset ID) */
		token_id: string;
	};
	'clob.spreads.list': {
		/** The request body. */
		body: Array<PolymarketClobBookRequestInput>;
	};
	'clob.tickSize.get': {
		/** Token ID (asset ID) */
		token_id?: string;
	};
	'clob.tickSize.getByToken': {
		/** Token ID (asset ID) */
		token_id: string;
	};
	'clob.time': Record<string, never>;
	'clob.trades.list': {
		/** Trade ID to filter by specific trade */
		id?: string;
		/** Maker address to filter trades */
		maker_address: string;
		/** Market (condition ID) to filter trades */
		market?: string;
		/** Asset ID (token ID) to filter trades */
		asset_id?: string;
		/** Filter trades before this Unix timestamp */
		before?: string;
		/** Filter trades after this Unix timestamp */
		after?: string;
		/** Cursor for pagination (base64 encoded offset) */
		next_cursor?: string;
	};
	'clob.trades.listBuilder': {
		/** Builder code to fetch attributed trades for */
		builder_code: string;
		/** Trade ID to filter by specific trade */
		id?: string;
		/** Market (condition ID) to filter trades */
		market?: string;
		/** Asset ID (token ID) to filter trades */
		asset_id?: string;
		/** Filter trades before this Unix timestamp */
		before?: string;
		/** Filter trades after this Unix timestamp */
		after?: string;
		/** Cursor for pagination (base64 encoded offset) */
		next_cursor?: string;
	};
	'combos.confirmations.submit': {
		rfq_id: string;
		quote_id: string;
		signer_address: string;
		maker_address: string;
		signature_type: PolymarketCombosSignatureTypeInput;
		/** Confirmation decision. */
		decision: 'CONFIRM' | 'DECLINE';
	};
	'combos.markets.list': {
		/** Number of markets to return. Defaults to `50`; maximum `100`. */
		limit?: number;
		/** Opaque cursor returned as `next_cursor` by the previous response. */
		cursor?: string;
		/** Comma-separated condition IDs to omit, such as markets already shown. */
		exclude?: string;
	};
	'combos.quotes.cancel': {
		rfq_id: string;
		quote_id: string;
		/** Must match the authenticated `signer_address`. */
		signer_address: string;
		/** Must match the authenticated `maker_address`. */
		maker_address: string;
		signature_type: PolymarketCombosSignatureTypeInput;
	};
	'combos.quotes.submit': {
		/** Maker-generated quote ID (required for REST submissions). */
		quote_id: string;
		/** RFQ ID from the `RFQ_REQUEST`. */
		rfq_id: string;
		signer_address: string;
		maker_address: string;
		signature_type: PolymarketCombosSignatureTypeInput;
		/** Quote price in six-decimal fixed-point units (must be positive). */
		price_e6: string;
		/** Fillable share count in six-decimal fixed-point units (must be positive). Note this differs from the request's size field, which may be notional or shares. */
		size_e6: string;
		/** Optional quote expiry in Unix milliseconds. */
		valid_until?: number;
		signed_order: PolymarketCombosExchangeV3OrderInput;
	};
	'data.activity.combos': {
		/** Required; the feed is user-anchored. */
		user?: string | null;
		/** First-page size. Ignored when `cursor` is supplied. */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. */
		cursor?: string | null;
		/** Combo condition id(s), comma-separated (at most 20 distinct values). `condition_id` / `conditionId` are accepted aliases. */
		condition?: string | null;
	};
	'data.activity.list': {
		/** Required; the feed is user-anchored. */
		user?: string | null;
		/** Page size; default 100, max 1000, past-cap rejected. */
		limit?: number | null;
		/** Opaque cursor from a prior response's `next_cursor`; binds the sort direction it was minted under. */
		cursor?: string | null;
		/** Activity type(s), comma-separated. Accepted values: `TRADE`, `SPLIT`, `MERGE`, `REDEEM` (automatic redemptions included), `CONVERSION`, `MIGRATION`, `REWARD`, `YIELD`, `MAKER_REBATE`, `TAKER_REBATE`, `REFERRAL_REWARD`, `DEPOSIT`, `WITHDRAWAL`, `DIRECTIONAL_SPLIT`, `DIRECTIONAL_MERGE`,… */
		type?: string | null;
		/** Condition id(s), comma-separated (at most 20 distinct values). `condition_id` / `conditionId` are accepted aliases. */
		condition?: string | null;
		/** Gamma event id(s), comma-separated (at most 20 distinct values); resolves to the events' markets. Mutually exclusive with `condition`. */
		event_id?: string | null;
		/** BUY or SELL. */
		side?: string | null;
		/** Window start on `block_timestamp`, epoch seconds (inclusive). Omitted or `0` floors to three years back; pass `start=1` for full history. */
		start?: number | null;
		/** Window end, epoch seconds (inclusive); omitted or `0` means now plus one day. */
		end?: number | null;
		/** Only `TIMESTAMP` is supported (v2 pages by keyset). */
		sort_by?: string | null;
		/** `ASC` or `DESC` (default). The keyset seeks in the chosen direction; the minted cursor binds it, so pass it consistently when paging. */
		sort_direction?: string | null;
		/** Defaults to `true`, which drops `DEPOSIT` and `WITHDRAWAL` rows from the page, including when `type` names them. Pass `false` to include them. */
		exclude_deposits_withdrawals?: boolean | null;
	};
	'data.approvals': {
		/** The proxy wallet whose approval state to return. Required EVM address. */
		user?: string | null;
	};
	'data.biggestWinners': {
		/** Window on `resolved_at`: `day` | `week` | `month` | `all`. Defaults to `day`. */
		time_period?: string | null;
		/** `overall` (default), a Gamma market category (e.g. `sports`), or a synthetic category: `combos` (combinatorial wins get their own full top-500 per window) or `esports` (promoted subcategory). */
		category?: string | null;
		/** First-page size. Ignored when `cursor` is supplied. */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. */
		cursor?: string | null;
	};
	'data.builders.leaderboard': {
		/** Window: `day` | `week` | `month` | `all`. Defaults to `day`. */
		time_period?: string | null;
		/** First-page size. Ignored when `cursor` is supplied. */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. */
		cursor?: string | null;
	};
	'data.builders.volume': {
		/** Bucket width: `day` | `week` | `month` | `all`. Defaults to `day`. `timePeriod` and `time_period` are accepted aliases. */
		interval?: string | null;
		/** How many of the most recent buckets to return. Defaults to 30, capped at 90; a lower ceiling than the rest of the surface, because only ~308 daily buckets exist and the family maximum would return the whole series. Bounds BUCKETS, not rows: a row limit would cut a bucket in half and leave a… */
		limit?: number | null;
	};
	'data.holders': {
		/** Comma-separated `condition_id`s (at most 20 distinct values; exactly one with `include_pnl=true`). Required. `condition` is the unified key across v2 (same as the feeds and `/v2/oi`); `condition_id` / `conditionId` are accepted aliases. */
		condition?: string | null;
		/** Rows per outcome token; defaults to 100, maximum 1000 (100 with `include_pnl=true`). */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`; carries the per-token `(limit, offset)` window and overrides `limit`. Paging past the first page is cursor-only. */
		cursor?: string | null;
		/** Minimum net balance in shares (default 0), applied post-netting. With `include_pnl=true` it applies to the served per-side gross amount instead. */
		min_balance?: number | null;
		/** Opt into per-holder position economics (default `false`; `includePnl` is an accepted alias). Adds `avg_price`, `entry_cost_usdc`, `current_price`, `current_value`, `realized_pnl`, `unrealized_pnl` and `total_pnl` to every holder row, and switches the served amounts to per-side gross balances: a… */
		include_pnl?: boolean | null;
	};
	'data.leaderboard': {
		/** Window: `day` | `week` | `month` | `all`. Defaults to `day`. */
		time_period?: string | null;
		/** `overall` (default), a Gamma market category (e.g. `sports`), or a synthetic category: `combos` (combinatorial positions; PNL boards only; the volume board has no combos rows) or `esports` (promoted subcategory). */
		category?: string | null;
		/** Which board: `PNL` (default) or `VOLUME`. */
		sort_by?: string | null;
		/** Look up one wallet's standing instead of reading the board. Returns a single object carrying both ranks, not a page. */
		user?: string | null;
		/** First-page size. Ignored when `cursor` is supplied. */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. */
		cursor?: string | null;
	};
	'data.liveVolume': {
		/** Event id(s), comma-separated (at most 20 distinct values). Required. `event_id` is the unified key across v2 (same as the feeds); `id` and `eventId` are accepted aliases. */
		event_id?: string | null;
	};
	'data.openInterest': {
		/** Condition id(s), comma-separated (at most 20 distinct values). `condition` is the unified key across v2 (same as the feeds); `condition_id` / `conditionId` are accepted aliases. Omit for global open interest. */
		condition?: string | null;
	};
	'data.positions.combos': {
		/** The wallet to anchor on. Required; combo positions are user-anchored. */
		user?: string | null;
		/** First-page size. Ignored when `cursor` is supplied (the cursor's size wins). */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. */
		cursor?: string | null;
		/** Combo condition id(s), comma-separated (at most 20 distinct values). `condition_id` / `conditionId` are accepted aliases. */
		condition?: string | null;
		/** One of `OPEN`, `REDEEMABLE`, `PARTIAL`, `RESOLVED_WIN`, `RESOLVED_LOSS`, `RESOLVED_PARTIAL`; default (absent) is the held-visibility listing. Aligned with `/v2/positions`: `OPEN` is the superset; it includes still-held redeemable positions; and `REDEEMABLE` narrows to exactly the rows whose… */
		status?: string | null;
		/** `FIRST_ENTRY` (default, except under `status=REDEEMABLE`, which defaults to `ENTRY_COST` so the largest claims lead) | `ENTRY_COST` | `CURRENT_VALUE` (alias of `ENTRY_COST`) | `UPDATED`. `FIRST_ENTRY DESC` and `UPDATED ASC` page by keyset; every other combination pages by an offset-shaped… */
		sort_by?: string | null;
		/** `ASC` or `DESC` (default `DESC`). */
		sort_direction?: string | null;
		/** Incremental-sync watermark: INCLUSIVE lower bound on `updated_at`, epoch seconds. Without a `status` filter, either watermark serves the sync view; every live row (mirror-complete), not only the held listing; a `status` filter keeps its own row visibility. The window's upper end is always capped… */
		updated_after?: number | null;
		/** Incremental-sync watermark: INCLUSIVE upper bound on `updated_at`, epoch seconds; must not precede `updated_after`. See `updated_after` for the sync-view and ceiling semantics. */
		updated_before?: number | null;
	};
	'data.positions.list': {
		/** The wallet to anchor on. At least one of `user`/`condition` is required. */
		user?: string | null;
		/** Condition id(s), comma-separated (at most 20 distinct values). With `user`, narrows that user's positions (all ids honoured). Without `user`, anchors on the market's holders; exactly one id is accepted there, and a multi-id list is rejected rather than silently truncated. */
		condition?: string | null;
		/** First-page size. Ignored when `cursor` is supplied (the cursor's size wins). */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. It carries the page position, page size, and the status/sort/direction it was minted under. */
		cursor?: string | null;
		/** One of `OPEN`, `REDEEMABLE`, `REDEEMABLE_LOST`, `MERGEABLE`, or `CLOSED`; defaults to `OPEN`. `REDEEMABLE_LOST` requires `user`, supports every sort but `AVG_PRICE`, and defaults to `CURRENT_VALUE`; it preserves row status `REDEEMABLE`. `MERGEABLE` is `OPEN` narrowed to live complementary pairs… */
		status?: string | null;
		/** Event id(s), comma-separated (at most 20 distinct values). User-anchored only. */
		event_id?: string | null;
		/** Case-insensitive market-title substring filter, honoured on every anchor and status. SQL LIKE wildcards (`%`, `_`) keep their usual meaning; empty or whitespace-only is treated as absent; at most 200 characters. NOT carried by the cursor: re-send it on every page of a walk (like `condition` and… */
		title?: string | null;
		/** `CASH` or `TOKENS`; defaults to `TOKENS` (the /v2/trades-homogenized filter pair, replacing the former `size_threshold`). */
		filter_type?: string | null;
		/** The filter floor. `TOKENS`: minimum CURRENT holding in shares (defaults to the 0.1 dust floor; applies to `OPEN`/`REDEEMABLE`; a user's `CLOSED` set is not narrowed by it, and on a market anchor it moves the OPEN/CLOSED boundary). `CASH`: minimum mark-to-market `current_value` in USDC, on top of… */
		filter_amount?: number | null;
		/** Also include positions on archived markets; defaults to `false`. `OPEN`/`REDEEMABLE`/`REDEEMABLE_LOST`/`MERGEABLE` only; combining it with `status=CLOSED` is rejected. Inactive markets remain excluded either way. */
		include_archived?: boolean | null;
		/** One of `CURRENT_VALUE`, `PRICE`, `AVG_PRICE`, `TOKENS`, `UNREALIZED_PNL`, `REALIZED_PNL`, `TOTAL_PNL`, or `TIMESTAMP` (the row's `last_event_at`). `PRICE` ranks by the response's effective `current_price` on every supported anchor and status. `AVG_PRICE` ranks by the response's `avg_price` (the… */
		sort_by?: string | null;
		/** Inclusive lower bound on `last_event_at`, epoch seconds; omit or `0` for unbounded (the `/v2/activity` + `/v2/trades` vocabulary). */
		start?: number | null;
		/** Inclusive upper bound on `last_event_at`, epoch seconds; omit or `0` for unbounded. A position with no native economics carries no `last_event_at` and is therefore **excluded by any bound**, in either direction; a window asks which positions moved inside it, and a row with no clock has no… */
		end?: number | null;
		/** `ASC` or `DESC`; defaults to `DESC`. */
		sort_direction?: string | null;
	};
	'data.positions.snapshot': {
		/** Proxy wallet, `0x` followed by 40 hex digits. The `user_address` spelling is accepted as an alias. */
		user: string | null;
		/** The UTC day, `YYYY-MM-DD`: the positions held at its end, the cut being the next day at 00:00:00Z. It must be a closed, servable day; a day outside the servable range is a `400` that names the range. */
		date: string | null;
		/** Page size, 0 to 1000 (default 100). Ignored when `cursor` is supplied (the cursor's size wins). */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. */
		cursor?: string | null;
	};
	'data.pricesHistory': {
		/** Outcome token id (the CLOB asset id the chart is keyed by). Required. `tokenId` is an accepted alias. */
		token_id?: string | null;
		/** Window start, epoch seconds, INCLUSIVE. Alone it means "up to the present", and is capped at 15 days back from now. Pass `end` too when paging: a window that tracks the present keeps growing at the tip, and the 15-day cap is re-checked on every page, so a walk that starts near the cap can… */
		start?: number | null;
		/** Window end, epoch seconds, EXCLUSIVE. Requires `start`; on its own it would ask for every point ever recorded up to `end`. */
		end?: number | null;
		/** Relative window INSTEAD of `start`/`end`: `max`, `all`, `1m`, `1w`, `1d`, `6h`, `1h`, matched case-sensitively. An empty `interval=` is a malformed value, not an absent one. `max`/`all` serve the market's WHOLE life (back to 2022 for the oldest markets) at 12-hour buckets by default; at… */
		interval?: string | null;
		/** Bucket width in SECONDS (60…86400). `bucketSeconds` is an accepted alias. OMIT it and the server sizes the width to the window: the finest tier grain (60, 300, 1800, 10800, 43200) that keeps the series under ~2,500 points, except that an explicit window wider than 12 hours never defaults to the… */
		bucket_seconds?: number | null;
		/** Point-in-time read, epoch seconds, INCLUSIVE: the latest observation at or before this instant. Cannot be combined with a window. `asOf` is an accepted alias. */
		as_of?: number | null;
		/** First-page size; defaults to the cap (10,000). Ignored when `cursor` is supplied (the cursor's size wins). */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. */
		cursor?: string | null;
	};
	'data.resolutions': {
		/** One UMA question identifier (`0x` plus 64 hexadecimal characters). */
		question_id?: string | null;
		/** Comma-separated condition identifiers (at most 20 distinct values): the Gamma condition id, or the structural condition id that `/v2/activity` and `/v2/trades` serve before a market is listed. */
		condition?: string | null;
		/** Comma-separated positive Gamma event IDs (at most 20 distinct values). */
		event_id?: string | null;
	};
	'data.status': Record<string, never>;
	'data.tokens': {
		/** Token id(s), comma-separated (at most 50 distinct values): decimal ERC-1155 ids as they appear on receipts and on the `token_id` and `asset` fields of the other routes. Elements are trimmed, leading zeros stripped and duplicates collapsed to their first position. `token_ids` is an accepted… */
		token_id?: string | null;
		/** Condition selector(s), comma-separated (at most 10 distinct values), each `0x` followed by 62 or 64 hex digits: a ConditionalTokens condition id (for a market carried over to polymarket-v2, its whole family), a neg-risk market id (every market of the structure), a polymarket-v2 condition id… */
		condition?: string | null;
	};
	'data.trades': {
		/** Address to filter by; omit for the market/event/global feed. */
		user?: string | null;
		/** First-page size. Ignored when `cursor` is supplied (the cursor's size wins). */
		limit?: number | null;
		/** Opaque pagination cursor from a prior response's `next_cursor`. */
		cursor?: string | null;
		/** Defaults to `true`: each fill is served once, on its taker side. `false` includes the maker rows too. */
		taker_only?: boolean | null;
		/** CASH or TOKENS; defaults to TOKENS. */
		filter_type?: string | null;
		/** Minimum trade size; defaults to 0.01, and 0 means the same. */
		filter_amount?: number | null;
		/** Window start on `block_timestamp`, epoch seconds (inclusive); honored on the `user` shape only. Omitted or `0` floors to three years back; `start=1` asks for full history. The `condition`/`event_id` shapes serve a fixed three-year window and the bare feed the rolling current-plus-previous month,… */
		start?: number | null;
		/** Window end, epoch seconds (inclusive); honored on the `user` shape only; omitted or `0` means now plus one day. */
		end?: number | null;
		/** Condition id(s), comma-separated (at most 20 distinct values). `condition_id` / `conditionId` are accepted aliases. */
		condition?: string | null;
		/** Event id(s), comma-separated (at most 20 distinct values). */
		event_id?: string | null;
		/** BUY or SELL. */
		side?: string | null;
	};
	'data.users.pnl': {
		/** Proxy wallet. The `user_address` spelling is accepted as an alias. */
		user?: string | null;
		/** Window: `max`, `all`, `1m`, `1w`, `1d`, `12h`, or `6h`. Defaults to `1d`. */
		interval?: string | null;
		/** Output grid: `1d`, `18h`, `12h`, `3h`, or `1h`. Defaults to `1h`. */
		fidelity?: string | null;
	};
	'data.users.stats': {
		/** The wallet whose profile stats to return. Required; `0x` followed by 40 hexadecimal characters. */
		user?: string | null;
	};
	'data.users.volume': {
		/** The wallet whose volume to return. Required. */
		user?: string | null;
		/** Window start, epoch seconds, inclusive. Omitted or `0` disables the bound (the feeds' convention). Volume is tracked in whole UTC days, so the bound is floored to its UTC day. */
		start?: number | null;
		/** Window end, epoch seconds, inclusive, floored to its UTC day. Omitted or `0` disables the bound. */
		end?: number | null;
	};
	'data.value': {
		/** The wallet whose portfolio value to return. Required. */
		user?: string | null;
		/** Comma-separated `condition_id`s (at most 20 distinct values); omit for the full portfolio. */
		condition?: string | null;
	};
	'gamma.comments.get': {
		/** Comment ID */
		id: number;
		/** Include commenter positions */
		get_positions?: boolean;
	};
	'gamma.comments.list': {
		/** Parent entity ID */
		parent_entity_id: number;
		/** Parent entity type */
		parent_entity_type: 'Event' | 'Series' | 'PerpsAsset';
		/** Include commenter positions */
		get_positions?: boolean;
		/** Only include comments from holders */
		holders_only?: boolean;
		/** Max results returned; values above 100 are clamped to 100 */
		limit?: number;
		/** Number of results to skip; values above 200 are rejected */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: string;
	};
	'gamma.comments.listByUser': {
		/** User address */
		user_address: string;
		/** Max results returned; values above 100 are clamped to 100 */
		limit?: number;
		/** Number of results to skip; values above 200 are rejected */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: string;
	};
	'gamma.comments.listKeyset': {
		/** Parent entity ID */
		parent_entity_id: number;
		/** Parent entity type */
		parent_entity_type: 'Event' | 'Series' | 'PerpsAsset';
		/** Max results returned; values above 100 are clamped to 100 */
		limit?: number;
		/** Not allowed for keyset pagination; rejected by the application layer */
		offset?: number;
		/** Field to sort by. Only immutable columns are seekable; defaults to id. */
		order?: 'id' | 'createdAt';
		/** Sort ascending when true (default true) */
		ascending?: string;
		/** Opaque keyset cursor from a previous response */
		after_cursor?: string;
	};
	'gamma.cryptoMarketConfigs.list': Record<string, never>;
	'gamma.events.commentCount': {
		/** Entity ID */
		id: string;
	};
	'gamma.events.count': {
		/** Event IDs to return */
		id?: Array<number> | null;
		/** Event slugs to return */
		slug?: Array<string> | null;
		/** Filter by closed flag (true/false/any). Omitted returns open and closed events; 'any' does the same and is accepted for parity with the markets lists */
		closed?: string;
		/** Filter by live flag (true/false) */
		live?: string;
		/** Minimum liquidity */
		liquidity_min?: string;
		/** Maximum liquidity */
		liquidity_max?: string;
		/** Minimum volume */
		volume_min?: string;
		/** Maximum volume */
		volume_max?: string;
		/** Minimum start date (RFC3339 or YYYY-MM-DD) */
		start_date_min?: string;
		/** Maximum start date (RFC3339 or YYYY-MM-DD) */
		start_date_max?: string;
		/** Minimum end date (RFC3339 or YYYY-MM-DD) */
		end_date_min?: string;
		/** Maximum end date (RFC3339 or YYYY-MM-DD) */
		end_date_max?: string;
		/** Tag IDs to filter by */
		tag_id?: Array<number> | null;
		/** Include events from related tags (true/false) */
		related_tags?: string;
		/** Tag match mode */
		tag_match?: string;
		/** Filter by tag slug */
		tag_slug?: string;
		/** Filter by featured flag (true/false) */
		featured?: string;
		/** Filter by CYOM flag (true/false) */
		cyom?: string;
		/** Series IDs to filter by */
		series_id?: Array<number> | null;
		/** Filter by series slug */
		series_slug?: Array<string> | null;
		/** Game IDs to filter by */
		game_id?: Array<number> | null;
		/** US event IDs to filter by */
		us_id?: Array<string> | null;
		/** Filter by event date (RFC3339 or YYYY-MM-DD) */
		event_date?: string;
		/** Filter by event week */
		event_week?: string;
		/** Minimum start time (RFC3339) */
		start_time_min?: string;
		/** Maximum start time (RFC3339) */
		start_time_max?: string;
		/** Tag IDs to exclude */
		exclude_tag_id?: Array<number> | null;
		/** Order by featured when true (true/false) */
		featured_order?: string;
		/** Recurrence filter */
		recurrence?: 'daily' | 'weekly' | 'monthly' | 'annual' | 'hourly';
		/** Filter by creator */
		created_by?: Array<string> | null;
		/** Parent event IDs to filter by */
		parent_event_id?: Array<number> | null;
		/** Include the children of the matched parent_event_id or slug (true/false) */
		include_children?: string;
		/** Return only events without a parent event when true; false has no effect */
		top_level?: string;
		/** Case-insensitive title search */
		title_search?: string;
		/** Include best lines (true/false) */
		include_best_lines?: string;
		/** Include each event's markets array (true/false, default true). false skips loading markets, so the response carries the event rows without a markets key */
		include_markets?: string;
		/** Include the facets each event carries, and each market when markets are included (true/false). Facets are the assigned ones plus their ancestors; a market carries only its own, not its event's. */
		include_facets?: string;
		/** Locale code */
		locale?: string;
		/** Filter by external partner slug */
		partner_slug?: string;
		/** Filter by event metadata key */
		event_metadata_key?: string;
		/** Filter by event metadata value */
		event_metadata_value?: string;
		/** Return only events flagged for context regeneration when true; false has no effect */
		context_requires_regen?: string;
		/** Return only events with no generated context when true; false has no effect */
		context_missing?: string;
		/** Filter by combo status (pending/enabled/disabled). Returns events with at least one market in that status, counting markets owned by their child events, and narrows each event's markets array to that status. */
		combo_status?: string;
		/** Protocol versions to return (v1 or v2). Repeat the parameter for several. Omitted means the server default (v1 while polymarket-v2 is in its builder integration period) */
		version?: Array<'v1' | 'v2'> | null;
		/** AIP-160 filter over facet slugs, e.g. politics AND (nba OR wnba) -united-states. AND, OR, NOT or -, a space for AND, and one level of parentheses; NOT binds tightest, then AND, then OR; at most 10 facets. A facet also matches its descendants. Only events that have facets match. */
		facets?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
	};
	'gamma.events.creators.get': {
		/** Event creator ID */
		id: number;
	};
	'gamma.events.creators.list': {
		/** Filter by creator name */
		creator_name?: string;
		/** Filter by creator handle */
		creator_handle?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Sort field */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
	};
	'gamma.events.externalPartners.get': {
		/** Event ID */
		id: number;
		/** External partner slug */
		partnerSlug: string;
	};
	'gamma.events.externalPartners.list': {
		/** Event ID */
		id: number;
	};
	'gamma.events.get': {
		/** Event ID */
		id: number;
		/** Include best lines (true/false) */
		include_best_lines?: string;
		/** Include the facets each event carries, and each market when markets are included (true/false). Facets are the assigned ones plus their ancestors; a market carries only its own, not its event's. */
		include_facets?: string;
		/** Locale code */
		locale?: string;
	};
	'gamma.events.getByPartner': {
		/** External partner slug. */
		partner?: string;
		/** Sport identifier used by the external partner. */
		external_id?: string;
	};
	'gamma.events.getBySlug': {
		/** Event slug */
		slug: string;
		/** Include best lines (true/false) */
		include_best_lines?: string;
		/** Include the facets each event carries, and each market when markets are included (true/false). Facets are the assigned ones plus their ancestors; a market carries only its own, not its event's. */
		include_facets?: string;
		/** Locale code */
		locale?: string;
	};
	'gamma.events.insights': {
		/** Event ID */
		id: number;
	};
	'gamma.events.list': {
		/** Event IDs to return */
		id?: Array<number> | null;
		/** Event slugs to return */
		slug?: Array<string> | null;
		/** Filter by closed flag (true/false/any). Omitted returns open and closed events; 'any' does the same and is accepted for parity with the markets lists */
		closed?: string;
		/** Filter by live flag (true/false) */
		live?: string;
		/** Minimum liquidity */
		liquidity_min?: string;
		/** Maximum liquidity */
		liquidity_max?: string;
		/** Minimum volume */
		volume_min?: string;
		/** Maximum volume */
		volume_max?: string;
		/** Minimum start date (RFC3339 or YYYY-MM-DD) */
		start_date_min?: string;
		/** Maximum start date (RFC3339 or YYYY-MM-DD) */
		start_date_max?: string;
		/** Minimum end date (RFC3339 or YYYY-MM-DD) */
		end_date_min?: string;
		/** Maximum end date (RFC3339 or YYYY-MM-DD) */
		end_date_max?: string;
		/** Tag IDs to filter by */
		tag_id?: Array<number> | null;
		/** Include events from related tags (true/false) */
		related_tags?: string;
		/** Tag match mode */
		tag_match?: string;
		/** Filter by tag slug */
		tag_slug?: string;
		/** Filter by featured flag (true/false) */
		featured?: string;
		/** Filter by CYOM flag (true/false) */
		cyom?: string;
		/** Series IDs to filter by */
		series_id?: Array<number> | null;
		/** Filter by series slug */
		series_slug?: Array<string> | null;
		/** Game IDs to filter by */
		game_id?: Array<number> | null;
		/** US event IDs to filter by */
		us_id?: Array<string> | null;
		/** Filter by event date (RFC3339 or YYYY-MM-DD) */
		event_date?: string;
		/** Filter by event week */
		event_week?: string;
		/** Minimum start time (RFC3339) */
		start_time_min?: string;
		/** Maximum start time (RFC3339) */
		start_time_max?: string;
		/** Tag IDs to exclude */
		exclude_tag_id?: Array<number> | null;
		/** Order by featured when true (true/false) */
		featured_order?: string;
		/** Recurrence filter */
		recurrence?: 'daily' | 'weekly' | 'monthly' | 'annual' | 'hourly';
		/** Filter by creator */
		created_by?: Array<string> | null;
		/** Parent event IDs to filter by */
		parent_event_id?: Array<number> | null;
		/** Include the children of the matched parent_event_id or slug (true/false) */
		include_children?: string;
		/** Return only events without a parent event when true; false has no effect */
		top_level?: string;
		/** Case-insensitive title search */
		title_search?: string;
		/** Include best lines (true/false) */
		include_best_lines?: string;
		/** Include each event's markets array (true/false, default true). false skips loading markets, so the response carries the event rows without a markets key */
		include_markets?: string;
		/** Include the facets each event carries, and each market when markets are included (true/false). Facets are the assigned ones plus their ancestors; a market carries only its own, not its event's. */
		include_facets?: string;
		/** Locale code */
		locale?: string;
		/** Filter by external partner slug */
		partner_slug?: string;
		/** Filter by event metadata key */
		event_metadata_key?: string;
		/** Filter by event metadata value */
		event_metadata_value?: string;
		/** Return only events flagged for context regeneration when true; false has no effect */
		context_requires_regen?: string;
		/** Return only events with no generated context when true; false has no effect */
		context_missing?: string;
		/** Filter by combo status (pending/enabled/disabled). Returns events with at least one market in that status, counting markets owned by their child events, and narrows each event's markets array to that status. */
		combo_status?: string;
		/** Protocol versions to return (v1 or v2). Repeat the parameter for several. Omitted means the server default (v1 while polymarket-v2 is in its builder integration period) */
		version?: Array<'v1' | 'v2'> | null;
		/** AIP-160 filter over facet slugs, e.g. politics AND (nba OR wnba) -united-states. AND, OR, NOT or -, a space for AND, and one level of parentheses; NOT binds tightest, then AND, then OR; at most 10 facets. A facet also matches its descendants. Only events that have facets match. */
		facets?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
		/** Market fields to load. full preserves the default response. card keeps all visible markets with card identity, quotes, lifecycle and selection fields, plus rewards and fee enrichment and market translations, and drops descriptions and resolution, deployment and admin metadata. Event fields,… */
		market_projection?: 'full' | 'card';
	};
	'gamma.events.listKeyset': {
		/** Event IDs to return */
		id?: Array<number> | null;
		/** Event slugs to return */
		slug?: Array<string> | null;
		/** Filter by closed flag (true/false/any). Omitted returns open and closed events; 'any' does the same and is accepted for parity with the markets lists */
		closed?: string;
		/** Filter by live flag (true/false) */
		live?: string;
		/** Minimum liquidity */
		liquidity_min?: string;
		/** Maximum liquidity */
		liquidity_max?: string;
		/** Minimum volume */
		volume_min?: string;
		/** Maximum volume */
		volume_max?: string;
		/** Minimum start date (RFC3339 or YYYY-MM-DD) */
		start_date_min?: string;
		/** Maximum start date (RFC3339 or YYYY-MM-DD) */
		start_date_max?: string;
		/** Minimum end date (RFC3339 or YYYY-MM-DD) */
		end_date_min?: string;
		/** Maximum end date (RFC3339 or YYYY-MM-DD) */
		end_date_max?: string;
		/** Tag IDs to filter by */
		tag_id?: Array<number> | null;
		/** Include events from related tags (true/false) */
		related_tags?: string;
		/** Tag match mode */
		tag_match?: string;
		/** Filter by tag slug */
		tag_slug?: string;
		/** Filter by featured flag (true/false) */
		featured?: string;
		/** Filter by CYOM flag (true/false) */
		cyom?: string;
		/** Series IDs to filter by */
		series_id?: Array<number> | null;
		/** Filter by series slug */
		series_slug?: Array<string> | null;
		/** Game IDs to filter by */
		game_id?: Array<number> | null;
		/** US event IDs to filter by */
		us_id?: Array<string> | null;
		/** Filter by event date (RFC3339 or YYYY-MM-DD) */
		event_date?: string;
		/** Filter by event week */
		event_week?: string;
		/** Minimum start time (RFC3339) */
		start_time_min?: string;
		/** Maximum start time (RFC3339) */
		start_time_max?: string;
		/** Tag IDs to exclude */
		exclude_tag_id?: Array<number> | null;
		/** Order by featured when true (true/false) */
		featured_order?: string;
		/** Recurrence filter */
		recurrence?: 'daily' | 'weekly' | 'monthly' | 'annual' | 'hourly';
		/** Filter by creator */
		created_by?: Array<string> | null;
		/** Parent event IDs to filter by */
		parent_event_id?: Array<number> | null;
		/** Include the children of the matched parent_event_id or slug (true/false) */
		include_children?: string;
		/** Return only events without a parent event when true; false has no effect */
		top_level?: string;
		/** Case-insensitive title search */
		title_search?: string;
		/** Include best lines (true/false) */
		include_best_lines?: string;
		/** Include each event's markets array (true/false, default true). false skips loading markets, so the response carries the event rows without a markets key */
		include_markets?: string;
		/** Include the facets each event carries, and each market when markets are included (true/false). Facets are the assigned ones plus their ancestors; a market carries only its own, not its event's. */
		include_facets?: string;
		/** Locale code */
		locale?: string;
		/** Filter by external partner slug */
		partner_slug?: string;
		/** Filter by event metadata key */
		event_metadata_key?: string;
		/** Filter by event metadata value */
		event_metadata_value?: string;
		/** Return only events flagged for context regeneration when true; false has no effect */
		context_requires_regen?: string;
		/** Return only events with no generated context when true; false has no effect */
		context_missing?: string;
		/** Filter by combo status (pending/enabled/disabled). Returns events with at least one market in that status, counting markets owned by their child events, and narrows each event's markets array to that status. */
		combo_status?: string;
		/** Protocol versions to return (v1 or v2). Repeat the parameter for several. Omitted means the server default (v1 while polymarket-v2 is in its builder integration period) */
		version?: Array<'v1' | 'v2'> | null;
		/** AIP-160 filter over facet slugs, e.g. politics AND (nba OR wnba) -united-states. AND, OR, NOT or -, a space for AND, and one level of parentheses; NOT binds tightest, then AND, then OR; at most 10 facets. A facet also matches its descendants. Only events that have facets match. */
		facets?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
		/** Market fields to load. full preserves the default response. status keeps every visible market in the same order, with only id, conditionId, marketMakerAddress, feeType, sportsMarketType, closed, gameStartTime, tradingEligible and resolutionMechanism; skips market enrichment and translation.… */
		market_projection?: 'full' | 'status' | 'card';
	};
	'gamma.events.listPaginated': {
		/** Event IDs to return */
		id?: Array<number> | null;
		/** Event slugs to return */
		slug?: Array<string> | null;
		/** Filter by closed flag (true/false/any). Omitted returns open and closed events; 'any' does the same and is accepted for parity with the markets lists */
		closed?: string;
		/** Filter by live flag (true/false) */
		live?: string;
		/** Minimum liquidity */
		liquidity_min?: string;
		/** Maximum liquidity */
		liquidity_max?: string;
		/** Minimum volume */
		volume_min?: string;
		/** Maximum volume */
		volume_max?: string;
		/** Minimum start date (RFC3339 or YYYY-MM-DD) */
		start_date_min?: string;
		/** Maximum start date (RFC3339 or YYYY-MM-DD) */
		start_date_max?: string;
		/** Minimum end date (RFC3339 or YYYY-MM-DD) */
		end_date_min?: string;
		/** Maximum end date (RFC3339 or YYYY-MM-DD) */
		end_date_max?: string;
		/** Tag IDs to filter by */
		tag_id?: Array<number> | null;
		/** Include events from related tags (true/false) */
		related_tags?: string;
		/** Tag match mode */
		tag_match?: string;
		/** Filter by tag slug */
		tag_slug?: string;
		/** Filter by featured flag (true/false) */
		featured?: string;
		/** Filter by CYOM flag (true/false) */
		cyom?: string;
		/** Series IDs to filter by */
		series_id?: Array<number> | null;
		/** Filter by series slug */
		series_slug?: Array<string> | null;
		/** Game IDs to filter by */
		game_id?: Array<number> | null;
		/** US event IDs to filter by */
		us_id?: Array<string> | null;
		/** Filter by event date (RFC3339 or YYYY-MM-DD) */
		event_date?: string;
		/** Filter by event week */
		event_week?: string;
		/** Minimum start time (RFC3339) */
		start_time_min?: string;
		/** Maximum start time (RFC3339) */
		start_time_max?: string;
		/** Tag IDs to exclude */
		exclude_tag_id?: Array<number> | null;
		/** Order by featured when true (true/false) */
		featured_order?: string;
		/** Recurrence filter */
		recurrence?: 'daily' | 'weekly' | 'monthly' | 'annual' | 'hourly';
		/** Filter by creator */
		created_by?: Array<string> | null;
		/** Parent event IDs to filter by */
		parent_event_id?: Array<number> | null;
		/** Include the children of the matched parent_event_id or slug (true/false) */
		include_children?: string;
		/** Return only events without a parent event when true; false has no effect */
		top_level?: string;
		/** Case-insensitive title search */
		title_search?: string;
		/** Include best lines (true/false) */
		include_best_lines?: string;
		/** Include each event's markets array (true/false, default true). false skips loading markets, so the response carries the event rows without a markets key */
		include_markets?: string;
		/** Include the facets each event carries, and each market when markets are included (true/false). Facets are the assigned ones plus their ancestors; a market carries only its own, not its event's. */
		include_facets?: string;
		/** Locale code */
		locale?: string;
		/** Filter by external partner slug */
		partner_slug?: string;
		/** Filter by event metadata key */
		event_metadata_key?: string;
		/** Filter by event metadata value */
		event_metadata_value?: string;
		/** Return only events flagged for context regeneration when true; false has no effect */
		context_requires_regen?: string;
		/** Return only events with no generated context when true; false has no effect */
		context_missing?: string;
		/** Filter by combo status (pending/enabled/disabled). Returns events with at least one market in that status, counting markets owned by their child events, and narrows each event's markets array to that status. */
		combo_status?: string;
		/** Protocol versions to return (v1 or v2). Repeat the parameter for several. Omitted means the server default (v1 while polymarket-v2 is in its builder integration period) */
		version?: Array<'v1' | 'v2'> | null;
		/** AIP-160 filter over facet slugs, e.g. politics AND (nba OR wnba) -united-states. AND, OR, NOT or -, a space for AND, and one level of parentheses; NOT binds tightest, then AND, then OR; at most 10 facets. A facet also matches its descendants. Only events that have facets match. */
		facets?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
	};
	'gamma.events.premadeCombos': {
		/** Event slug */
		slug: string;
		/** Page placement. Defaults to event_under_chart. */
		placement?: string;
	};
	'gamma.events.reference': {
		/** Event slug */
		slug: string;
		/** Include the parent event's routing metadata when it has a public detail page. */
		include_parent?: boolean;
	};
	'gamma.events.similar': {
		/** Event ID. Fastest path: skips the Typesense reference lookup. */
		id?: number;
		/** Free-text event title to find a reference event in Typesense. */
		event_title?: string;
		/** Event slug. Validated as a slug when provided, looked up in PG. */
		event_slug?: string;
		/** Free-text market title to find a reference event in Typesense. */
		market_title?: string;
		/** Market slug. Validated as a slug when provided; the parent event is used as the reference. */
		market_slug?: string;
		/** Max results returned. Capped at 50. */
		limit?: number;
		/** Optional. When 'true' returns only resolved events; when 'false' returns only open events. When omitted, both are returned. Always combined with the unconditional active=true filter. */
		closed?: 'true' | 'false';
		/** Load each event's markets (true/false). Off by default: the response is the slim event list. */
		include_markets?: string;
		/** With include_markets=true, keep only the N most likely markets per event: open markets first, then by first outcome price descending. 0 (default) keeps every market. */
		markets_limit?: number;
		/** Optional wait budget for vector-search candidates in milliseconds (100 to 5000). Expiry uses the popular-events fallback without cancelling the underlying search, which has a server-owned deadline of at most 5 seconds. When omitted, the configured search deadline applies. */
		search_timeout_ms?: number;
	};
	'gamma.events.sportResults': {
		/** Event IDs */
		id?: Array<number> | null;
		/** Event slugs */
		slug?: Array<string> | null;
		/** Filter by closed flag (true/false) */
		closed?: string;
		/** Series IDs */
		series_id?: Array<number> | null;
		/** Game IDs */
		game_id?: Array<number> | null;
		/** Filter by event date (RFC3339 or YYYY-MM-DD) */
		event_date?: string;
		/** Filter by event week */
		event_week?: string;
		/** Minimum start time (RFC3339) */
		start_time_min?: string;
		/** Maximum start time (RFC3339) */
		start_time_max?: string;
		/** Protocol versions to return (v1 or v2). Omitted means the server default */
		version?: Array<'v1' | 'v2'> | null;
		/** AIP-160 filter over facet slugs, e.g. politics AND (nba OR wnba) -united-states. AND, OR, NOT or -, a space for AND, and one level of parentheses; NOT binds tightest, then AND, then OR; at most 10 facets. A facet also matches its descendants. Only events that have facets match. */
		facets?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
	};
	'gamma.events.tags': {
		/** Event ID — numeric, validated by the application layer */
		id: string;
	};
	'gamma.events.tweetCount': {
		/** Event ID */
		id: number;
	};
	'gamma.facets.get': {
		/** Facet slug */
		slug: string;
		/** Levels below the root to return. */
		depth?: number;
		/** Children shown per facet before its children are paged. */
		max_children?: number;
		/** A nextCursor from an earlier response on the same endpoint. Depth and max_children then come from the cursor. */
		after_cursor?: string;
	};
	'gamma.facets.list': {
		/** Levels below the root to return. */
		depth?: number;
		/** Children shown per facet before its children are paged. */
		max_children?: number;
		/** A nextCursor from an earlier response on the same endpoint. Depth and max_children then come from the cursor. */
		after_cursor?: string;
	};
	'gamma.feeTypes.events': {
		/** Resource id */
		id?: string;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true */
		ascending?: boolean;
		/** Max results returned */
		limit?: string;
		/** Number of results to skip */
		offset?: string;
		/** Filter by address */
		address?: string;
		/** Filter by tags */
		tags?: string;
		/** Filter by date */
		date?: string;
		/** Include soft-deleted rows (true/false) */
		include_deleted?: string;
		/** Fee type */
		feeType: string;
	};
	'gamma.feeTypes.list': {
		/** Only active fee types when true */
		active?: string;
		/** Search string */
		search?: string;
	};
	'gamma.games.get': {
		/** Sport slug */
		sport?: string;
		/** Game ticker */
		ticker?: string;
	};
	'gamma.makerTiers.get': {
		/** Maker addresses (proxy wallet or EOA) to look up, case-insensitive. Matched as given against the address that made the fills. */
		addresses: Array<string> | null;
	};
	'gamma.makerTiers.ladder': Record<string, never>;
	'gamma.marketClarifications.list': {
		/** Clarification IDs to return */
		id?: Array<number> | null;
		/** Market IDs to return clarifications for */
		market_id?: Array<number> | null;
		/** Event IDs to return clarifications for */
		event_id?: Array<number> | null;
		/** Clarification states to validate before public visibility filtering */
		state?: Array<string> | null;
		/** Question IDs to return clarifications for */
		question_id?: Array<string> | null;
		/** Transaction hash associated with the clarification */
		tx_hash?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
	};
	'gamma.marketEstimateHistory.list': {
		/** Event id */
		event_id?: string;
		/** Bucket size in minutes */
		fidelity?: string;
		/** 1h, 6h, 1d, 1w, 1m, max or all */
		interval?: string;
		/** Range start as a unix timestamp */
		startTs?: string;
		/** Range end as a unix timestamp */
		endTs?: string;
	};
	'gamma.markets.description': {
		/** Market ID */
		id: number;
	};
	'gamma.markets.get': {
		/** Market ID */
		id: number;
		/** Include tag data (true/false) */
		include_tag?: string;
		/** Include the facets assigned to each market (true/false). Facets are the assigned ones plus their ancestors. */
		include_facets?: string;
		/** Locale used to localize returned content */
		locale?: string;
	};
	'gamma.markets.getBySlug': {
		/** Market slug */
		slug: string;
		/** Include tag data (true/false) */
		include_tag?: string;
		/** Include the facets assigned to each market (true/false). Facets are the assigned ones plus their ancestors. */
		include_facets?: string;
		/** Locale used to localize returned content */
		locale?: string;
	};
	'gamma.markets.information': {
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Include the facets assigned to each market (true/false). Facets are the assigned ones plus their ancestors. */
		include_facets?: string;
		clobTokenIds?: Array<string> | null;
		closed?: boolean | null;
		comboStatus?: string | null;
		conditionIds?: Array<string> | null;
		cyom?: boolean | null;
		endDateMax?: string | null;
		endDateMin?: string | null;
		/** AIP-160 expression over facet slugs, as the facets query parameter on GET /markets */
		facets?: string | null;
		gameId?: string | null;
		id?: Array<number> | null;
		includeTags?: boolean | null;
		liquidityNumMax?: number | null;
		liquidityNumMin?: number | null;
		marketMakerAddress?: Array<string> | null;
		onchainEventIds?: Array<string> | null;
		positionIds?: Array<string> | null;
		questionIds?: Array<string> | null;
		relatedTags?: boolean | null;
		requestIds?: Array<string> | null;
		rewardsMinSize?: number;
		rfqEnabled?: boolean | null;
		slug?: Array<string> | null;
		sportsMarketTypes?: Array<string> | null;
		startDateMax?: string | null;
		startDateMin?: string | null;
		tagId?: Array<number> | null;
		umaResolutionStatus?: string | null;
		version?: Array<string> | null;
		volumeNumMax?: number | null;
		volumeNumMin?: number | null;
	};
	'gamma.markets.list': {
		/** Market IDs to return */
		id?: Array<number> | null;
		/** Market slugs to return */
		slug?: Array<string> | null;
		/** Filter by archived flag (true/false) */
		archived?: string;
		/** Filter by active flag (true/false) */
		active?: string;
		/** Filter by decimalized flag (true/false) */
		decimalized?: string;
		/** Filter by closed flag (true/false/any). Defaults to false on the public lists when omitted. 'any' returns open and closed markets together and requires at least one of id, slug, clob_token_ids, position_ids, condition_ids, request_ids, onchain_event_ids, or question_ids */
		closed?: string;
		/** CLOB token IDs to return */
		clob_token_ids?: Array<string> | null;
		/** Position IDs to return */
		position_ids?: Array<string> | null;
		/** Condition IDs to return */
		condition_ids?: Array<string> | null;
		/** V2 oracle request IDs to return (conditionId for binary/incremental neg-risk, onchainEventId for atomic neg-risk) */
		request_ids?: Array<string> | null;
		/** V2 on-chain event IDs to return (all markets of each on-chain event) */
		onchain_event_ids?: Array<string> | null;
		/** Market maker addresses to return */
		market_maker_address?: Array<string> | null;
		/** Minimum liquidity */
		liquidity_num_min?: string;
		/** Maximum liquidity */
		liquidity_num_max?: string;
		/** Minimum volume */
		volume_num_min?: string;
		/** Maximum volume */
		volume_num_max?: string;
		/** Minimum start date (RFC3339 or YYYY-MM-DD) */
		start_date_min?: string;
		/** Maximum start date (RFC3339 or YYYY-MM-DD) */
		start_date_max?: string;
		/** Minimum end date (RFC3339 or YYYY-MM-DD) */
		end_date_min?: string;
		/** Maximum end date (RFC3339 or YYYY-MM-DD) */
		end_date_max?: string;
		/** Tag IDs to filter by */
		tag_id?: Array<number> | null;
		/** Include markets from related tags (true/false) */
		related_tags?: string;
		/** Tag match mode */
		tag_match?: string;
		/** Filter by CYOM flag (true/false) */
		cyom?: string;
		/** Filter by RFQ-enabled flag (true/false) */
		rfq_enabled?: string;
		/** Filter by combo status (pending/enabled/disabled) */
		combo_status?: string;
		/** Filter by UMA resolution status */
		uma_resolution_status?: string;
		/** Filter by resolution status (inactive/active/resolved). v2 markets only — v1 markets carry no resolution_status and use uma_resolution_status instead */
		resolution_status?: 'inactive' | 'active' | 'resolved';
		/** Protocol versions to return (v1 or v2). Repeat the parameter for several. Omitted means the server default on public lists (v1 while polymarket-v2 is in its builder integration period) */
		version?: Array<'v1' | 'v2'> | null;
		/** Filter by game ID */
		game_id?: string;
		/** Filter by sports market types */
		sports_market_types?: Array<string> | null;
		/** Filter by minimum rewards size */
		rewards_min_size?: string;
		/** Question IDs to return */
		question_ids?: Array<string> | null;
		/** Include tag data (true/false) */
		include_tag?: string;
		/** Include the facets assigned to each market (true/false). Facets are the assigned ones plus their ancestors. */
		include_facets?: string;
		/** Locale used to localize returned content */
		locale?: string;
		/** Filter by market metadata key */
		market_metadata_key?: string;
		/** Filter by market metadata value */
		market_metadata_value?: string;
		/** AIP-160 filter over facet slugs, e.g. politics AND (nba OR wnba) -united-states. AND, OR, NOT or -, a space for AND, and one level of parentheses; NOT binds tightest, then AND, then OR; at most 10 facets. A facet also matches its descendants; a market matches only its own facets, not its… */
		facets?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
	};
	'gamma.markets.listAbridged': {
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Include the facets assigned to each market (true/false). Facets are the assigned ones plus their ancestors. */
		include_facets?: string;
		clobTokenIds?: Array<string> | null;
		closed?: boolean | null;
		comboStatus?: string | null;
		conditionIds?: Array<string> | null;
		cyom?: boolean | null;
		endDateMax?: string | null;
		endDateMin?: string | null;
		/** AIP-160 expression over facet slugs, as the facets query parameter on GET /markets */
		facets?: string | null;
		gameId?: string | null;
		id?: Array<number> | null;
		includeTags?: boolean | null;
		liquidityNumMax?: number | null;
		liquidityNumMin?: number | null;
		marketMakerAddress?: Array<string> | null;
		onchainEventIds?: Array<string> | null;
		positionIds?: Array<string> | null;
		questionIds?: Array<string> | null;
		relatedTags?: boolean | null;
		requestIds?: Array<string> | null;
		rewardsMinSize?: number;
		rfqEnabled?: boolean | null;
		slug?: Array<string> | null;
		sportsMarketTypes?: Array<string> | null;
		startDateMax?: string | null;
		startDateMin?: string | null;
		tagId?: Array<number> | null;
		umaResolutionStatus?: string | null;
		version?: Array<string> | null;
		volumeNumMax?: number | null;
		volumeNumMin?: number | null;
	};
	'gamma.markets.listAbridgedKeyset': {
		/** Max results returned */
		limit?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
		/** Include the facets assigned to each market (true/false). Facets are the assigned ones plus their ancestors. */
		include_facets?: string;
		clobTokenIds?: Array<string> | null;
		closed?: boolean | null;
		comboStatus?: string | null;
		conditionIds?: Array<string> | null;
		cyom?: boolean | null;
		endDateMax?: string | null;
		endDateMin?: string | null;
		/** AIP-160 expression over facet slugs, as the facets query parameter on GET /markets */
		facets?: string | null;
		gameId?: string | null;
		id?: Array<number> | null;
		includeTags?: boolean | null;
		liquidityNumMax?: number | null;
		liquidityNumMin?: number | null;
		marketMakerAddress?: Array<string> | null;
		onchainEventIds?: Array<string> | null;
		positionIds?: Array<string> | null;
		questionIds?: Array<string> | null;
		relatedTags?: boolean | null;
		requestIds?: Array<string> | null;
		rewardsMinSize?: number;
		rfqEnabled?: boolean | null;
		slug?: Array<string> | null;
		sportsMarketTypes?: Array<string> | null;
		startDateMax?: string | null;
		startDateMin?: string | null;
		tagId?: Array<number> | null;
		umaResolutionStatus?: string | null;
		version?: Array<string> | null;
		volumeNumMax?: number | null;
		volumeNumMin?: number | null;
	};
	'gamma.markets.listKeyset': {
		/** Market IDs to return */
		id?: Array<number> | null;
		/** Market slugs to return */
		slug?: Array<string> | null;
		/** Filter by archived flag (true/false) */
		archived?: string;
		/** Filter by active flag (true/false) */
		active?: string;
		/** Filter by decimalized flag (true/false) */
		decimalized?: string;
		/** Filter by closed flag (true/false/any). Defaults to false on the public lists when omitted. 'any' returns open and closed markets together and requires at least one of id, slug, clob_token_ids, position_ids, condition_ids, request_ids, onchain_event_ids, or question_ids */
		closed?: string;
		/** CLOB token IDs to return */
		clob_token_ids?: Array<string> | null;
		/** Position IDs to return */
		position_ids?: Array<string> | null;
		/** Condition IDs to return */
		condition_ids?: Array<string> | null;
		/** V2 oracle request IDs to return (conditionId for binary/incremental neg-risk, onchainEventId for atomic neg-risk) */
		request_ids?: Array<string> | null;
		/** V2 on-chain event IDs to return (all markets of each on-chain event) */
		onchain_event_ids?: Array<string> | null;
		/** Market maker addresses to return */
		market_maker_address?: Array<string> | null;
		/** Minimum liquidity */
		liquidity_num_min?: string;
		/** Maximum liquidity */
		liquidity_num_max?: string;
		/** Minimum volume */
		volume_num_min?: string;
		/** Maximum volume */
		volume_num_max?: string;
		/** Minimum start date (RFC3339 or YYYY-MM-DD) */
		start_date_min?: string;
		/** Maximum start date (RFC3339 or YYYY-MM-DD) */
		start_date_max?: string;
		/** Minimum end date (RFC3339 or YYYY-MM-DD) */
		end_date_min?: string;
		/** Maximum end date (RFC3339 or YYYY-MM-DD) */
		end_date_max?: string;
		/** Tag IDs to filter by */
		tag_id?: Array<number> | null;
		/** Include markets from related tags (true/false) */
		related_tags?: string;
		/** Tag match mode */
		tag_match?: string;
		/** Filter by CYOM flag (true/false) */
		cyom?: string;
		/** Filter by RFQ-enabled flag (true/false) */
		rfq_enabled?: string;
		/** Filter by combo status (pending/enabled/disabled) */
		combo_status?: string;
		/** Filter by UMA resolution status */
		uma_resolution_status?: string;
		/** Filter by resolution status (inactive/active/resolved). v2 markets only — v1 markets carry no resolution_status and use uma_resolution_status instead */
		resolution_status?: 'inactive' | 'active' | 'resolved';
		/** Protocol versions to return (v1 or v2). Repeat the parameter for several. Omitted means the server default on public lists (v1 while polymarket-v2 is in its builder integration period) */
		version?: Array<'v1' | 'v2'> | null;
		/** Filter by game ID */
		game_id?: string;
		/** Filter by sports market types */
		sports_market_types?: Array<string> | null;
		/** Filter by minimum rewards size */
		rewards_min_size?: string;
		/** Question IDs to return */
		question_ids?: Array<string> | null;
		/** Include tag data (true/false) */
		include_tag?: string;
		/** Include the facets assigned to each market (true/false). Facets are the assigned ones plus their ancestors. */
		include_facets?: string;
		/** Locale used to localize returned content */
		locale?: string;
		/** Filter by market metadata key */
		market_metadata_key?: string;
		/** Filter by market metadata value */
		market_metadata_value?: string;
		/** AIP-160 filter over facet slugs, e.g. politics AND (nba OR wnba) -united-states. AND, OR, NOT or -, a space for AND, and one level of parentheses; NOT binds tightest, then AND, then OR; at most 10 facets. A facet also matches its descendants; a market matches only its own facets, not its… */
		facets?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
	};
	'gamma.markets.related': {
		/** Market ID */
		id: number;
		/** Filter by closed flag (true/false) */
		closed?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
		/** Include the facets assigned to each market (true/false). Facets are the assigned ones plus their ancestors. */
		include_facets?: string;
	};
	'gamma.markets.tags': {
		/** Market ID — numeric, validated by the application layer */
		id: string;
	};
	'gamma.moderators.list': {
		/** Resource id */
		id?: string;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true */
		ascending?: boolean;
		/** Max results returned */
		limit?: string;
		/** Number of results to skip */
		offset?: string;
		/** Filter by address */
		address?: string;
		/** Filter by tags */
		tags?: string;
		/** Filter by date */
		date?: string;
		/** Include soft-deleted rows (true/false) */
		include_deleted?: string;
	};
	'gamma.partners.get': {
		/** Partner id */
		id: number;
	};
	'gamma.partners.list': {
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true */
		ascending?: boolean;
	};
	'gamma.profiles.get': {
		/** Wallet address the profile belongs to */
		address?: string;
	};
	'gamma.profiles.getByAddress': {
		/** Wallet address the profile belongs to */
		user_address: string;
	};
	'gamma.profiles.list': {
		/** Wallet addresses to resolve, case-insensitive */
		address?: Array<string> | null;
	};
	'gamma.readyz': Record<string, never>;
	'gamma.referralLeaderboard': {
		/** Leaderboard window: week, month, year, or all. Defaults to month. */
		period?: string;
		/** Sort field: earnings or signups. Defaults to earnings. */
		sortBy?: string;
		/** Max rows, 1-100. Out-of-range values fall back to 20. */
		limit?: number;
		/** Rows to skip. Negative values fall back to 0. */
		offset?: number;
		/** Optional address whose own rank is included in the response */
		address?: string;
	};
	'gamma.search': {
		/** Search query. Only the first 128 characters are searched. */
		q?: string;
		/** Use the cached search backend (true/false) */
		cache?: string;
		/** Filter events by status */
		events_status?: string;
		/** Filter by event tag */
		events_tag?: Array<string> | null;
		/** Keep closed markets in the result */
		keep_closed_markets?: string;
		/** Max results per result type */
		limit_per_type?: string;
		/** Page number */
		page?: string;
		/** Field to sort by */
		sort?: string;
		/** Sort ascending when true (true/false) */
		ascending?: string;
		/** Recurrence filter */
		recurrence?: string;
		/** Tag IDs to exclude */
		exclude_tag_id?: Array<number> | null;
		/** Preset filters. Each preset runs one Typesense search, so at most 10 are accepted. */
		presets?: Array<string> | null;
		/** Minimum event volume */
		volume_min?: string;
		/** Include tag results (true/false) */
		search_tags?: string;
		/** Include profile results (true/false) */
		search_profiles?: string;
		/** Return the optimized response shape (true/false) */
		optimized?: string;
	};
	'gamma.searchV2': {
		/** Search query. Only the first 128 characters are searched. */
		q?: string;
		/** Use the cached search backend (true/false) */
		cache?: string;
		/** Filter events by status */
		events_status?: string;
		/** Filter by event tag */
		events_tag?: Array<string> | null;
		/** Keep closed markets in the result */
		keep_closed_markets?: string;
		/** Max results per result type */
		limit_per_type?: string;
		/** Page number */
		page?: string;
		/** Field to sort by */
		sort?: string;
		/** Sort ascending when true (true/false) */
		ascending?: string;
		/** Recurrence filter */
		recurrence?: string;
		/** Tag IDs to exclude */
		exclude_tag_id?: Array<number> | null;
		/** Preset filters. Each preset runs one Typesense search, so at most 10 are accepted. */
		presets?: Array<string> | null;
		/** Minimum event volume */
		volume_min?: string;
		/** Include tag results (true/false) */
		search_tags?: string;
		/** Include profile results (true/false) */
		search_profiles?: string;
		/** Return the optimized response shape (true/false) */
		optimized?: string;
	};
	'gamma.series.commentCount': {
		/** Entity ID */
		id: string;
	};
	'gamma.series.get': {
		/** Series ID */
		id: string;
		/** Locale used to localize returned content */
		locale?: string;
	};
	'gamma.series.list': {
		/** Series slugs to return */
		slug?: Array<string> | null;
		/** Filter by closed flag (true/false). Defaults to false when omitted. */
		closed?: string;
		/** Filter by recurrence: daily, weekly, monthly, annual, or hourly */
		recurrence?: 'daily' | 'weekly' | 'monthly' | 'annual' | 'hourly';
		/** Locale used to localize returned content */
		locale?: string;
		/** Exclude embedded events when true (true/false) */
		exclude_events?: string;
		/** Max results returned */
		limit?: string;
		/** Number of results to skip */
		offset?: string;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true. Defaults to true when order is supplied. */
		ascending?: string;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
	};
	'gamma.series.listKeyset': {
		/** Series slugs to return */
		slug?: Array<string> | null;
		/** Filter by closed flag (true/false). Defaults to false when omitted. */
		closed?: string;
		/** Filter by recurrence: daily, weekly, monthly, annual, or hourly */
		recurrence?: 'daily' | 'weekly' | 'monthly' | 'annual' | 'hourly';
		/** Locale used to localize returned content */
		locale?: string;
		/** Exclude embedded events when true (true/false) */
		exclude_events?: string;
		/** Max results returned */
		limit?: string;
		/** Number of results to skip */
		offset?: string;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true. Defaults to true when order is supplied. */
		ascending?: string;
		/** Opaque keyset pagination cursor from a previous response */
		after_cursor?: string;
	};
	'gamma.series.summary': {
		/** Series ID */
		id: string;
	};
	'gamma.series.summaryBySlug': {
		/** Series slug */
		slug: string;
	};
	'gamma.sports.externalPartners.get': {
		/** Sport metadata ID */
		id: number;
		/** External partner slug */
		partnerRef: string;
	};
	'gamma.sports.externalPartners.list': {
		/** Sport metadata ID */
		id: number;
	};
	'gamma.sports.get': {
		/** Sport metadata ID */
		id: number;
	};
	'gamma.sports.getByPartner': {
		/** External partner slug */
		partner?: string;
		/** Partner-specific external sport ID */
		external_id?: string;
	};
	'gamma.sports.list': Record<string, never>;
	'gamma.sports.marketTypes': Record<string, never>;
	'gamma.sports.premadeCombos': {
		/** League or sport slug */
		slug: string;
		/** Page placement. Defaults to league_top. */
		placement?: string;
	};
	'gamma.sports.summary': Record<string, never>;
	'gamma.status': Record<string, never>;
	'gamma.tags.get': {
		/** Tag ID */
		id: string;
		/** Locale code for translatable fields */
		locale?: string;
	};
	'gamma.tags.getBySlug': {
		/** Tag slug */
		slug: string;
		/** Locale code for translatable fields */
		locale?: string;
	};
	'gamma.tags.list': {
		/** Filter by isCarousel — pass "true" or "false". Omit for no filter. */
		is_carousel?: string;
		/** Locale code for translatable fields (e.g. en, fr, de) */
		locale?: string;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: string;
	};
	'gamma.tags.related': {
		/** Tag ID */
		id: string;
		/** When "true", omits related tags with no active events. Omit for no filter. */
		omit_empty?: string;
		/** Filter related tags by event status (active|closed|all) */
		status?: string;
		/** Locale code for translatable fields */
		locale?: string;
	};
	'gamma.tags.relatedBySlug': {
		/** Tag slug */
		slug: string;
		/** When "true", omits related tags with no active events. Omit for no filter. */
		omit_empty?: string;
		/** Filter related tags by event status (active|closed|all) */
		status?: string;
		/** Locale code for translatable fields */
		locale?: string;
	};
	'gamma.tags.relations': {
		/** Tag ID */
		id: string;
		/** When "true", omits related tags with no active events. Omit for no filter. */
		omit_empty?: string;
		/** Filter related tags by event status (active|closed|all) */
		status?: string;
	};
	'gamma.tags.relationsBySlug': {
		/** Tag slug */
		slug: string;
	};
	'gamma.takerTiers.get': {
		/** Proxy-wallet (or EOA) addresses to resolve, case-insensitive */
		addresses: Array<string> | null;
	};
	'gamma.takerTiers.ladder': Record<string, never>;
	'gamma.teams.externalPartners.get': {
		/** Team ID */
		id: number;
		/** External partner slug */
		partnerRef: string;
	};
	'gamma.teams.externalPartners.list': {
		/** Team ID */
		id: number;
	};
	'gamma.teams.get': {
		/** Team ID */
		id: number;
	};
	'gamma.teams.getByPartner': {
		/** External partner slug */
		partner?: string;
		/** Partner-specific team ID */
		external_id?: string;
	};
	'gamma.teams.list': {
		league?: Array<string> | null;
		name?: Array<string> | null;
		abbreviation?: Array<string> | null;
		provider_id?: Array<number> | null;
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
	};
	'gamma.terms.current': Record<string, never>;
	'gamma.tournaments.get': {
		/** Tournament ID */
		id: number;
	};
	'gamma.tournaments.list': {
		/** Max results returned */
		limit?: number;
		/** Number of results to skip */
		offset?: number;
		/** Comma-separated field names to sort by */
		order?: string;
		/** Sort ascending when true (default true) */
		ascending?: boolean;
	};
	'gamma.walletType': {
		/** Wallet address */
		address: string;
		/** Signer address */
		signer: string;
	};
	'perps.account.applyReferral': {
		code: PolymarketPerpsCodeInput;
	};
	'perps.account.approveBuilder': {
		op: PolymarketPerpsOpApproveBuilderInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
	};
	'perps.account.autoCancel': Record<string, never>;
	'perps.account.backstops': {
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
		cursor?: PolymarketPerpsAccountBackstopsCursorInput;
	};
	'perps.account.balances': Record<string, never>;
	'perps.account.builderApprovals': {
		builder?: PolymarketPerpsAddressInput;
	};
	'perps.account.builderEarnings': {
		start_timestamp?: PolymarketPerpsTimestampInput;
		end_timestamp?: PolymarketPerpsTimestampInput;
		as_of_sequence?: PolymarketPerpsSequenceInput;
		cursor?: PolymarketPerpsCursorInput;
	};
	'perps.account.builderEarningsSummary': {
		start_timestamp?: PolymarketPerpsTimestampInput;
		end_timestamp?: PolymarketPerpsTimestampInput;
		as_of_sequence?: PolymarketPerpsSequenceInput;
	};
	'perps.account.config': {
		instrument_id?: PolymarketPerpsInstrumentIdInput;
	};
	'perps.account.createInvite': {
		/** Empty invite creation request. */
		body: PolymarketPerpsCreateInviteRequestInput;
	};
	'perps.account.credentials': Record<string, never>;
	'perps.account.deposits': {
		deposit_status?: PolymarketPerpsDepositStatusInput;
		hash?: PolymarketPerpsHashInput;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.account.equity': {
		interval: PolymarketPerpsIntervalInput;
		start_timestamp: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.account.fills': {
		/** Instrument ID — when set, only fills on this instrument are returned */
		instrument_id?: number;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
		cursor?: PolymarketPerpsCursorInput;
		sort?: PolymarketPerpsSortInput;
	};
	'perps.account.funding': {
		/** Instrument ID */
		instrument_id?: number;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.account.internalTransfer': {
		op: PolymarketPerpsOpInternalTransferInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
		label?: PolymarketPerpsLabelInput;
	};
	'perps.account.internalTransfers': {
		direction?: PolymarketPerpsDirectionInput;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.account.limits': Record<string, never>;
	'perps.account.markNotificationsRead': {
		/** The notifications to mark read. */
		body: PolymarketPerpsNotificationsReadRequestInput;
	};
	'perps.account.notifications': {
		cursor?: PolymarketPerpsNotifCursorInput;
		since_seq?: PolymarketPerpsSinceSeqInput;
		limit?: PolymarketPerpsLimitInput;
	};
	'perps.account.openOrders': {
		instrument_id?: PolymarketPerpsIidInput;
	};
	'perps.account.orders': {
		order_id?: PolymarketPerpsOrderIdInput;
		client_order_id?: PolymarketPerpsCoidInput;
		instrument_id?: PolymarketPerpsIidInput;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.account.pnl': {
		interval: PolymarketPerpsPnlIntervalInput;
		start_timestamp: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.account.portfolio': Record<string, never>;
	'perps.account.referral': Record<string, never>;
	'perps.account.rewards': {
		date?: PolymarketPerpsDateInput;
		start_date?: PolymarketPerpsStartDateInput;
		end_date?: PolymarketPerpsEndDateInput;
		limit?: PolymarketPerpsLimitInput;
	};
	'perps.account.stats': Record<string, never>;
	'perps.account.updateBuilder': {
		op: {
			type: 'updateBuilder';
			args: {
				/** Builder display name. Trimmed before saving; must contain 1 to 100 Unicode characters and no control characters. */
				name: string;
			};
		};
		/** Signature in hex format */
		sig: string;
		/** Salt */
		salt: number;
		/** Request timestamp. Unix milliseconds for most operations; Unix seconds for withdrawals (must match the on-chain EIP-712 struct verified against block.timestamp). */
		ts: number;
	};
	'perps.account.withdraw': {
		op: PolymarketPerpsOpWithdrawInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
	};
	'perps.account.withdrawals': {
		withdrawal_status?: PolymarketPerpsWithdrawalStatusInput;
		hash?: PolymarketPerpsHashInput;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.assets': Record<string, never>;
	'perps.bbo': {
		instrument_id?: PolymarketPerpsInstrumentIdInput;
	};
	'perps.blp.enroll': {
		instrument_id: PolymarketPerpsInstrumentIdInput;
		active: PolymarketPerpsBlpActiveInput;
	};
	'perps.blp.enrollment': Record<string, never>;
	'perps.blp.liquidations': {
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
		cursor?: PolymarketPerpsBlpCursorInput;
		sort?: PolymarketPerpsBlpSortInput;
	};
	'perps.book': {
		/** Instrument ID */
		instrument_id: number;
		depth?: PolymarketPerpsDepthInput;
	};
	'perps.builder': {
		/** Address */
		address: string;
	};
	'perps.competitions.account': {
		competition_id: PolymarketPerpsCompetitionIdInput;
		address: PolymarketPerpsAddressInput;
	};
	'perps.competitions.get': {
		competition_id: PolymarketPerpsCompetitionIdInput;
	};
	'perps.competitions.leaderboard': {
		competition_id: PolymarketPerpsCompetitionIdInput;
		limit?: PolymarketPerpsLimitInput;
		offset?: PolymarketPerpsOffsetInput;
		include_unqualified?: PolymarketPerpsCompetitionIncludeUnqualifiedInput;
	};
	'perps.competitions.list': {
		address?: PolymarketPerpsAddressInput;
	};
	'perps.competitions.widget': {
		address?: PolymarketPerpsAddressInput;
	};
	'perps.exchange': Record<string, never>;
	'perps.exchangeStatistics': {
		start_timestamp: PolymarketPerpsStartTimestampInput;
		end_timestamp: PolymarketPerpsEndTimestampInput;
	};
	'perps.fees': Record<string, never>;
	'perps.fundingHistory': {
		/** Instrument ID */
		instrument_id: number;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.index': {
		asset: PolymarketPerpsAsset2Input;
	};
	'perps.instruments': {
		/** Instrument ID */
		instrument_id?: number;
		instrument_type?: PolymarketPerpsInstrumentTypeInput;
		category?: PolymarketPerpsCategoryInput;
	};
	'perps.inviteCode': {
		code: PolymarketPerpsCodeInput;
		address?: PolymarketPerpsAddressInput;
	};
	'perps.klines': {
		/** Instrument ID */
		instrument_id: number;
		interval: PolymarketPerpsIntervalInput;
		start_timestamp: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.leaderboard': {
		window?: PolymarketPerpsWindowInput;
		sort_by?: PolymarketPerpsSortByInput;
		limit?: PolymarketPerpsLimitInput;
		offset?: PolymarketPerpsOffsetInput;
		address?: PolymarketPerpsAddressInput;
	};
	'perps.leverage.update': {
		op: PolymarketPerpsOpUpdateLeverageInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
	};
	'perps.leverage.updateMany': {
		op: PolymarketPerpsOpUpdateLeveragesInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
	};
	'perps.limitTiers': Record<string, never>;
	'perps.margin.update': {
		op: PolymarketPerpsOpUpdateMarginInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
	};
	'perps.markHistory': {
		/** Instrument ID */
		instrument_id: number;
		interval: PolymarketPerpsIntervalInput;
		start_timestamp: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'perps.orders.cancel': {
		op: PolymarketPerpsOpCancelOrdersInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
		exp?: PolymarketPerpsExpInput;
	};
	'perps.orders.cancelAll': {
		op: PolymarketPerpsOpCancelAllInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
		exp?: PolymarketPerpsExpInput;
	};
	'perps.orders.cancelByClientId': {
		op: PolymarketPerpsOpCancelOrdersByCoidInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
		exp?: PolymarketPerpsExpInput;
	};
	'perps.orders.create': {
		op: PolymarketPerpsOpCreateOrdersInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
		exp?: PolymarketPerpsExpInput;
	};
	'perps.orders.modify': {
		op: PolymarketPerpsOpModifyOrdersInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
		exp?: PolymarketPerpsExpInput;
	};
	'perps.orders.modifyByClientId': {
		op: PolymarketPerpsOpModifyOrdersByCoidInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
		exp?: PolymarketPerpsExpInput;
	};
	'perps.orders.setAutoCancel': {
		op: PolymarketPerpsOpAutoCancelInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
	};
	'perps.ping': Record<string, never>;
	'perps.proxy.create': {
		op: PolymarketPerpsOpCreateProxyInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
		label?: PolymarketPerpsLabelInput;
		code?: PolymarketPerpsCodeInput;
	};
	'perps.proxy.delete': {
		op: PolymarketPerpsOpDeleteProxyInput;
		sig: PolymarketPerpsSigInput;
		salt: PolymarketPerpsSaltInput;
		ts: PolymarketPerpsTsInput;
	};
	'perps.public.fills': {
		address: PolymarketPerpsAddressInput;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		instrument_id?: number;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
		cursor?: PolymarketPerpsCursorInput;
		sort?: PolymarketPerpsSortInput;
	};
	'perps.public.portfolio': {
		address: PolymarketPerpsAddressInput;
	};
	'perps.public.positionFills': {
		address: PolymarketPerpsAddressInput;
		/** Instrument ID */
		instrument_id: number;
		cursor?: PolymarketPerpsFillsCursorInput;
		sort?: PolymarketPerpsSortInput;
	};
	'perps.public.positionSnapshots': {
		address: PolymarketPerpsAddressInput;
		active_instrument_ids?: Array<number>;
		/** Selected public AccountTrade fill keys, in response order. Deduplicated by (instrument_id, trade_id). */
		history_fills?: Array<PolymarketPerpsPositionSnapshotFillInput>;
	};
	'perps.registered': {
		address: PolymarketPerpsAddressInput;
	};
	'perps.statistics': {
		instrument_id?: PolymarketPerpsInstrumentIdInput;
	};
	'perps.tickers': {
		instrument_id?: PolymarketPerpsInstrumentIdInput;
	};
	'perps.time': Record<string, never>;
	'perps.trades': {
		/** Instrument ID */
		instrument_id: number;
		start_timestamp?: PolymarketPerpsStartTimestampInput;
		end_timestamp?: PolymarketPerpsEndTimestampInput;
	};
	'relayer.apiKeys.list': Record<string, never>;
	'relayer.deployed': {
		/** Address of the wallet to check */
		address: PolymarketRelayerAddressInput;
		/** Wallet type to check. Defaults to `SAFE` when omitted. */
		type?: 'SAFE' | 'WALLET';
	};
	'relayer.nonce': {
		/** User's signer address */
		address: PolymarketRelayerAddressInput;
		/** Type of nonce to retrieve */
		type: 'PROXY' | 'SAFE';
	};
	'relayer.relayPayload': {
		/** User's signer address */
		address: PolymarketRelayerAddressInput;
		/** Type of nonce to retrieve */
		type: 'PROXY' | 'SAFE';
	};
	'relayer.transactions.get': {
		/** Transaction ID */
		id: string;
	};
	'relayer.transactions.list': Record<string, never>;
	'relayer.transactions.submit': {
		/** Signer address */
		from: PolymarketRelayerAddressInput;
		/** Target contract address */
		to: PolymarketRelayerAddressInput;
		/** User's Polymarket proxy wallet address */
		proxyWallet: PolymarketRelayerAddressInput;
		/** Encoded transaction data (0x-prefixed hex string) */
		data: string;
		/** Transaction nonce */
		nonce: string;
		/** Transaction signature (0x-prefixed hex string) */
		signature: string;
		signatureParams: PolymarketRelayerSignatureParamsInput;
		/** Transaction type */
		type: 'SAFE' | 'PROXY';
	};
	'rfq.health': Record<string, never>;
	'rfq.priceBand': {
		/** A gamma market id. */
		marketId: string;
	};
	'rfq.ready': Record<string, never>;
	'rfq.time': Record<string, never>;
	'rfq.trades.get': {
		tradeId: string;
	};
	'rfq.trades.prepare': {
		/** Required unless `marketSource` is `combo`. */
		marketId?: string;
		marketSource?: PolymarketRfqMarketSourceInput;
		/** The combo's legs, for `marketSource` `combo` only. */
		legs?: Array<PolymarketRfqComboLegInput>;
		combination?: PolymarketRfqCombinationInput;
		/** `split`: both sides buy, one YES and one NO. `merge`: both sides sell, one YES and one NO. `trade`: one side buys an outcome token from the other. */
		operation: 'split' | 'merge' | 'trade';
		/** The outcome token that changes hands, for `trade` only. */
		token?: 'yes' | 'no';
		/** The agreed price in (0, 1). The YES price for a split or merge, the traded token's price for a trade. */
		price: string;
		shares: PolymarketRfqAmountInput;
		/** Keyed `yes` and `no` for a split or merge, `buyer` and `seller` for a trade. */
		parties: Record<string, PolymarketRfqPreparePartyInput>;
		/** Tightens the price band to this fraction of the mark, e.g. `0.05` for ±5%. Wider than the default is refused. */
		priceTolerance?: string;
	};
	'rfq.trades.submit': {
		/** Required unless `marketSource` is `combo`. */
		marketId?: string;
		marketSource?: PolymarketRfqMarketSourceInput;
		legs?: Array<PolymarketRfqComboLegInput>;
		combination?: PolymarketRfqCombinationInput;
		/** Both signed orders, in any order. */
		orders: Array<PolymarketRfqSignedOrderInput>;
		/** The partner's own reference for the trade. */
		idempotencyKey: string;
		/** As on `PrepareRequest`. */
		priceTolerance?: string;
		/** Not an input. Omit it; anything but `0` is rejected with `fee_not_accepted`. */
		takerFeeAmount?: '0';
		/** Not an input. Omit it; anything but `0` is rejected with `fee_not_accepted`. */
		makerFeeAmount?: '0';
	};
	'rfq.trades.validate': {
		/** Required unless `marketSource` is `combo`. */
		marketId?: string;
		marketSource?: PolymarketRfqMarketSourceInput;
		/** The combo's legs, for `marketSource` `combo` only. */
		legs?: Array<PolymarketRfqComboLegInput>;
		combination?: PolymarketRfqCombinationInput;
		/** `split`: both sides buy, one YES and one NO. `merge`: both sides sell, one YES and one NO. `trade`: one side buys an outcome token from the other. */
		operation: 'split' | 'merge' | 'trade';
		/** The outcome token that changes hands, for `trade` only. */
		token?: 'yes' | 'no';
		/** The agreed price in (0, 1). The YES price for a split or merge, the traded token's price for a trade. */
		price: string;
		shares: PolymarketRfqAmountInput;
		/** Keyed `yes` and `no` for a split or merge, `buyer` and `seller` for a trade. */
		parties: Record<string, PolymarketRfqPreparePartyInput>;
		/** Tightens the price band to this fraction of the mark, e.g. `0.05` for ±5%. Wider than the default is refused. */
		priceTolerance?: string;
	};
};

export type PolymarketOperationOutputs = {
	'bridge.deposit': PolymarketBridgeDepositResponse;
	'bridge.quote': PolymarketBridgeQuoteResponse;
	'bridge.status': PolymarketBridgeTransactionStatusResponse;
	'bridge.supportedAssets': PolymarketBridgeSupportedAssetsResponse;
	'bridge.withdraw': PolymarketBridgeDepositResponse;
	'clob.apiKeys.create': PolymarketClobApiKeyResponse;
	'clob.apiKeys.delete': string;
	'clob.apiKeys.derive': PolymarketClobApiKeyResponse;
	'clob.apiKeys.list': PolymarketClobApiKeysResponse;
	'clob.balanceAllowance.get': PolymarketClobBalanceAllowanceResponse;
	'clob.balanceAllowance.refresh': PolymarketClobBalanceAllowanceResponse;
	'clob.balanceAllowance.update': Record<string, PolymarketJsonValue>;
	'clob.books.get': PolymarketClobOrderBookSummary;
	'clob.books.list': Array<PolymarketClobOrderBookSummary>;
	'clob.books.listByBody': Array<PolymarketClobOrderBookSummary>;
	'clob.builderApiKeys.create': PolymarketClobBuilderApiKeyResponse;
	'clob.builderApiKeys.list': Array<string>;
	'clob.builderApiKeys.revoke': string;
	'clob.closedOnlyMode': PolymarketClobClosedOnlyResponse;
	'clob.feeRate.get': PolymarketClobFeeRate;
	'clob.feeRate.getByToken': PolymarketClobFeeRate;
	'clob.heartbeats.send': PolymarketClobHeartbeatResponse;
	'clob.heartbeats.sendV1': PolymarketClobHeartbeatV1Response;
	'clob.lastTradePrices.get': {
		/** Last trade price */
		price?: string | null;
		/** Last trade side (BUY or SELL) */
		side?: string | null;
		[key: string]: unknown;
	};
	'clob.lastTradePrices.list': Array<{
		/** Token ID (asset ID) */
		token_id?: string | null;
		/** Last trade price */
		price?: string | null;
		/** Last trade side (BUY or SELL) */
		side?: string | null;
		[key: string]: unknown;
	}>;
	'clob.lastTradePrices.listByBody': Array<{
		/** Token ID (asset ID) */
		token_id?: string | null;
		/** Last trade price */
		price?: string | null;
		/** Last trade side (BUY or SELL) */
		side?: string | null;
		[key: string]: unknown;
	}>;
	'clob.markets.get': PolymarketClobClobMarketDetails;
	'clob.markets.getByToken': PolymarketClobMarketByTokenResponse;
	'clob.markets.listSampling': PolymarketClobPaginatedMarkets;
	'clob.markets.listSamplingSimplified': PolymarketClobPaginatedSimplifiedMarkets;
	'clob.markets.listSimplified': PolymarketClobPaginatedSimplifiedMarkets;
	'clob.markets.liveActivity': Array<PolymarketClobLiveActivityMarket>;
	'clob.markets.liveActivityByCondition': PolymarketClobLiveActivityMarket;
	'clob.midpoints.get': {
		/** Midpoint price as a string */
		mid_price?: string | null;
		[key: string]: unknown;
	};
	'clob.midpoints.list': Record<string, string>;
	'clob.midpoints.listByBody': Record<string, string>;
	'clob.negRisk.get': PolymarketClobNegRisk;
	'clob.negRisk.getByToken': PolymarketClobNegRisk;
	'clob.notifications.list': Array<PolymarketClobNotification>;
	'clob.notifications.markRead': string;
	'clob.orderScoring.get': PolymarketClobOrderScoringResponse;
	'clob.orderScoring.list': PolymarketClobOrdersScoringResponse;
	'clob.orderScoring.listByBody': PolymarketClobOrdersScoringResponse;
	'clob.orders.cancel': PolymarketClobCancelOrdersResponse;
	'clob.orders.cancelAll': PolymarketClobCancelOrdersResponse;
	'clob.orders.cancelMany': PolymarketClobCancelOrdersResponse;
	'clob.orders.cancelMarket': PolymarketClobCancelOrdersResponse;
	'clob.orders.cancelWallet': PolymarketClobCancelOrdersResponse;
	'clob.orders.create': PolymarketClobSendOrderResponse;
	'clob.orders.createMany': Array<PolymarketClobSendOrderResponse>;
	'clob.orders.get': PolymarketClobOpenOrder;
	'clob.orders.list': PolymarketClobOrdersResponse;
	'clob.orders.listWalletOpen': PolymarketClobWalletOpenOrdersResponse;
	'clob.prices.get': {
		/** Market price as a decimal (the CLOB sends a string). */
		price?: (number | string) | null;
		[key: string]: unknown;
	};
	'clob.prices.list': Record<string, Record<string, number | string>>;
	'clob.prices.listByBody': Record<string, Record<string, number | string>>;
	'clob.pricesHistory.batch': PolymarketClobBatchPricesHistoryResponse;
	'clob.pricesHistory.get': PolymarketClobPricesHistoryResponse;
	'clob.rateLimitTier': PolymarketClobRateLimitTierResponse;
	'clob.rebates.current': Array<PolymarketClobRebatedFees> | null;
	'clob.rewards.current': PolymarketClobPaginatedCurrentReward;
	'clob.rewards.market': PolymarketClobPaginatedMarketReward;
	'clob.rewards.markets': PolymarketClobPaginatedMultiMarketInfo;
	'clob.rewards.userEarnings': PolymarketClobPaginatedUserEarnings;
	'clob.rewards.userMarkets': PolymarketClobPaginatedUserRewardsMarkets;
	'clob.rewards.userPercentages': Record<string, number>;
	'clob.rewards.userTotalEarnings': Array<PolymarketClobTotalUserEarning>;
	'clob.spreads.get': {
		/** Spread as a string */
		spread?: string | null;
		[key: string]: unknown;
	};
	'clob.spreads.list': Record<string, string>;
	'clob.tickSize.get': PolymarketClobTickSize;
	'clob.tickSize.getByToken': PolymarketClobTickSize;
	'clob.time': number | string;
	'clob.trades.list': PolymarketClobTradesResponse;
	'clob.trades.listBuilder': PolymarketClobBuilderTradesResponse;
	'combos.confirmations.submit': PolymarketCombosMakerConfirmationResult;
	'combos.markets.list': PolymarketCombosComboMarketsResponse;
	'combos.quotes.cancel': PolymarketCombosRFQSnapshot;
	'combos.quotes.submit': PolymarketCombosRFQSnapshot;
	'data.activity.combos': PolymarketDataComboActivityPage;
	'data.activity.list': PolymarketDataActivityPage;
	'data.approvals': PolymarketDataEnvelopeApprovals;
	'data.biggestWinners': PolymarketDataBiggestWinnersPage;
	'data.builders.leaderboard': PolymarketDataBuildersLeaderboardPage;
	'data.builders.volume': PolymarketDataEnvelopeVecBuilderVolumePoint;
	'data.holders': PolymarketDataHoldersPage;
	'data.leaderboard': PolymarketDataLeaderboardResponse;
	'data.liveVolume': PolymarketDataEnvelopeLiveVolume;
	'data.openInterest': PolymarketDataEnvelopeVecOpenInterest;
	'data.positions.combos': PolymarketDataComboPositionsPage;
	'data.positions.list': PolymarketDataPositionsPage;
	'data.positions.snapshot': PolymarketDataPositionsSnapshotPage;
	'data.pricesHistory': PolymarketDataPricesHistoryPage;
	'data.resolutions': PolymarketDataEnvelopeVecResolution;
	'data.status': PolymarketDataEnvelopeServiceStatus;
	'data.tokens': PolymarketDataEnvelopeVecTokenRef;
	'data.trades': PolymarketDataTradesPage;
	'data.users.pnl': PolymarketDataEnvelopeUserPnlSeries;
	'data.users.stats': PolymarketDataEnvelopeOptionUserStats;
	'data.users.volume': PolymarketDataEnvelopeUserVolume;
	'data.value': PolymarketDataEnvelopePortfolioValue;
	'gamma.comments.get': Array<PolymarketGammaComment> | null;
	'gamma.comments.list': Array<PolymarketGammaComment> | null;
	'gamma.comments.listByUser': Array<PolymarketGammaComment> | null;
	'gamma.comments.listKeyset': PolymarketGammaCommentsKeysetListResponse;
	'gamma.cryptoMarketConfigs.list': Array<PolymarketGammaCryptoMarketConfig> | null;
	'gamma.events.commentCount': PolymarketGammaCount;
	'gamma.events.count': PolymarketGammaEventsCount;
	'gamma.events.creators.get': PolymarketGammaEventCreator;
	'gamma.events.creators.list': Array<PolymarketGammaEventCreator> | null;
	'gamma.events.externalPartners.get': PolymarketGammaEventExternalPartnerMapping;
	'gamma.events.externalPartners.list': Array<PolymarketGammaEventExternalPartnerMapping> | null;
	'gamma.events.get': PolymarketGammaEvent;
	'gamma.events.getByPartner': PolymarketGammaEvent;
	'gamma.events.getBySlug': PolymarketGammaEvent;
	'gamma.events.insights': PolymarketGammaEventInsightsBody;
	'gamma.events.list': Array<PolymarketGammaEvent> | null;
	'gamma.events.listKeyset': PolymarketGammaEventsKeysetListResponse;
	'gamma.events.listPaginated': PolymarketGammaEventsPagination;
	'gamma.events.premadeCombos': PolymarketGammaPremadeCombosResponse;
	'gamma.events.reference': PolymarketGammaEventReference;
	'gamma.events.similar': Array<PolymarketGammaEvent> | null;
	'gamma.events.sportResults': Array<PolymarketGammaEvent> | null;
	'gamma.events.tags': Array<PolymarketGammaTag> | null;
	'gamma.events.tweetCount': PolymarketGammaEventTweetCount;
	'gamma.facets.get': PolymarketGammaFacetTree;
	'gamma.facets.list': PolymarketGammaFacetTree;
	'gamma.feeTypes.events': Array<PolymarketGammaEvent> | null;
	'gamma.feeTypes.list': Array<PolymarketGammaFeeType> | null;
	'gamma.games.get': PolymarketGammaGame;
	'gamma.makerTiers.get': PolymarketGammaMakerTiersBatchResponse;
	'gamma.makerTiers.ladder': PolymarketGammaMakerTierLadderResponse;
	'gamma.marketClarifications.list': Array<PolymarketGammaMarketClarification> | null;
	'gamma.marketEstimateHistory.list': Record<string, PolymarketJsonValue>;
	'gamma.markets.description': PolymarketGammaMarket;
	'gamma.markets.get': PolymarketGammaMarket;
	'gamma.markets.getBySlug': PolymarketGammaMarket;
	'gamma.markets.information': Array<PolymarketGammaMarket> | null;
	'gamma.markets.list': Array<PolymarketGammaMarket> | null;
	'gamma.markets.listAbridged': Array<PolymarketGammaMarket> | null;
	'gamma.markets.listAbridgedKeyset': PolymarketGammaMarketsKeysetListResponse;
	'gamma.markets.listKeyset': PolymarketGammaMarketsKeysetListResponse;
	'gamma.markets.related': Array<PolymarketGammaRelatedMarket> | null;
	'gamma.markets.tags': Array<PolymarketGammaTag> | null;
	'gamma.moderators.list': Array<string> | null;
	'gamma.partners.get': PolymarketGammaPartner;
	'gamma.partners.list': Array<PolymarketGammaPartner> | null;
	'gamma.profiles.get': PolymarketGammaPublicProfileResponse;
	'gamma.profiles.getByAddress': PolymarketGammaPublicProfile;
	'gamma.profiles.list': PolymarketGammaPublicProfilesBatchResponse;
	'gamma.readyz': PolymarketGammaReadyzStatus;
	'gamma.referralLeaderboard': PolymarketGammaReferralLeaderboardResponse;
	'gamma.search': PolymarketJsonValue;
	'gamma.searchV2': PolymarketJsonValue;
	'gamma.series.commentCount': PolymarketGammaCount;
	'gamma.series.get': PolymarketGammaSeries;
	'gamma.series.list': Array<PolymarketGammaSeries> | null;
	'gamma.series.listKeyset': PolymarketGammaSeriesKeysetListResponse;
	'gamma.series.summary': PolymarketGammaSeriesSummary;
	'gamma.series.summaryBySlug': PolymarketGammaSeriesSummary;
	'gamma.sports.externalPartners.get': PolymarketGammaSportExternalPartnerMapping;
	'gamma.sports.externalPartners.list': Array<PolymarketGammaSportExternalPartnerMapping> | null;
	'gamma.sports.get': PolymarketGammaSportsMetadata;
	'gamma.sports.getByPartner': PolymarketGammaSportsMetadata;
	'gamma.sports.list': Array<PolymarketGammaSportsMetadata> | null;
	'gamma.sports.marketTypes': PolymarketGammaSportsMarketTypesResponse;
	'gamma.sports.premadeCombos': PolymarketGammaPremadeCombosResponse;
	'gamma.sports.summary': PolymarketGammaSportsSummaryResponse;
	'gamma.status': {
		/** The plain-text answer. */
		text: string;
	};
	'gamma.tags.get': PolymarketGammaTag;
	'gamma.tags.getBySlug': PolymarketGammaTag;
	'gamma.tags.list': Array<PolymarketGammaTag> | null;
	'gamma.tags.related': Array<PolymarketGammaTag> | null;
	'gamma.tags.relatedBySlug': Array<PolymarketGammaTag> | null;
	'gamma.tags.relations': Array<PolymarketGammaRelatedTag> | null;
	'gamma.tags.relationsBySlug': Array<PolymarketGammaRelatedTag> | null;
	'gamma.takerTiers.get': PolymarketGammaTakerTiersBatchResponse;
	'gamma.takerTiers.ladder': PolymarketGammaTakerTierLadderResponse;
	'gamma.teams.externalPartners.get': PolymarketGammaTeamExternalPartnerMapping;
	'gamma.teams.externalPartners.list': Array<PolymarketGammaTeamExternalPartnerMapping> | null;
	'gamma.teams.get': PolymarketGammaTeam;
	'gamma.teams.getByPartner': PolymarketGammaTeam;
	'gamma.teams.list': Array<PolymarketGammaTeam> | null;
	'gamma.terms.current': PolymarketGammaPublicTermsVersion;
	'gamma.tournaments.get': PolymarketGammaTournament;
	'gamma.tournaments.list': Array<PolymarketGammaTournament> | null;
	'gamma.walletType': PolymarketGammaWalletTypeResponse;
	'perps.account.applyReferral': PolymarketPerpsGenericAccepted;
	'perps.account.approveBuilder': PolymarketPerpsBuilderApproval;
	'perps.account.autoCancel': PolymarketPerpsAutoCancelStatus;
	'perps.account.backstops': PolymarketPerpsAccountBackstops;
	'perps.account.balances': Array<PolymarketPerpsBalance>;
	'perps.account.builderApprovals': PolymarketPerpsBuilderApprovals;
	'perps.account.builderEarnings': PolymarketPerpsBuilderEarnings;
	'perps.account.builderEarningsSummary': PolymarketPerpsBuilderEarningsSummary;
	'perps.account.config': Array<PolymarketPerpsAccountConfig>;
	'perps.account.createInvite': PolymarketPerpsCreateInviteResponse;
	'perps.account.credentials': PolymarketPerpsCredentials;
	'perps.account.deposits': PolymarketPerpsDeposits;
	'perps.account.equity': PolymarketPerpsEquityHistory;
	'perps.account.fills': PolymarketPerpsAccountTrades;
	'perps.account.funding': PolymarketPerpsAccountFundingHistory;
	'perps.account.internalTransfer': PolymarketPerpsInternalTransferAccepted;
	'perps.account.internalTransfers': PolymarketPerpsInternalTransfers;
	'perps.account.limits': PolymarketPerpsAccountLimits;
	'perps.account.markNotificationsRead': PolymarketPerpsGenericAccepted;
	'perps.account.notifications': PolymarketPerpsNotificationsResponse;
	'perps.account.openOrders': Array<PolymarketPerpsOrderData>;
	'perps.account.orders': Array<PolymarketPerpsOrderData>;
	'perps.account.pnl': PolymarketPerpsPnlHistory;
	'perps.account.portfolio': PolymarketPerpsPortfolio;
	'perps.account.referral': PolymarketPerpsAccountReferral;
	'perps.account.rewards': PolymarketPerpsAccountRewards;
	'perps.account.stats': PolymarketPerpsAccountStats;
	'perps.account.updateBuilder': PolymarketJsonValue;
	'perps.account.withdraw': PolymarketPerpsWithdrawAccepted;
	'perps.account.withdrawals': PolymarketPerpsWithdrawals;
	'perps.assets': Array<PolymarketPerpsAsset>;
	'perps.bbo': Array<PolymarketPerpsBBO>;
	'perps.blp.enroll': PolymarketPerpsGenericAccepted;
	'perps.blp.enrollment': PolymarketPerpsBlpEnrollment;
	'perps.blp.liquidations': PolymarketPerpsBlpLiquidations;
	'perps.book': PolymarketPerpsBook;
	'perps.builder': PolymarketJsonValue;
	'perps.competitions.account': PolymarketPerpsCompetitionAccount;
	'perps.competitions.get': PolymarketPerpsCompetitionDetail;
	'perps.competitions.leaderboard': PolymarketPerpsCompetitionLeaderboard;
	'perps.competitions.list': PolymarketPerpsCompetitionList;
	'perps.competitions.widget': PolymarketPerpsCompetitionWidget;
	'perps.exchange': PolymarketPerpsExchange;
	'perps.exchangeStatistics': PolymarketPerpsExchangeStatistics;
	'perps.fees': PolymarketPerpsFeesInfo;
	'perps.fundingHistory': PolymarketPerpsFundingHistory;
	'perps.index': PolymarketPerpsIndex;
	'perps.instruments': Array<PolymarketPerpsInstrument>;
	'perps.inviteCode': PolymarketPerpsInviteCheckResponse;
	'perps.klines': PolymarketPerpsKlinesResponse;
	'perps.leaderboard': PolymarketPerpsLeaderboard;
	'perps.leverage.update': PolymarketPerpsLeverageResponse;
	'perps.leverage.updateMany': Array<PolymarketPerpsLeverageBatchResponse>;
	'perps.limitTiers': Array<PolymarketPerpsLimitTier>;
	'perps.margin.update': PolymarketPerpsGenericResponse;
	'perps.markHistory': PolymarketPerpsMarkHistoryResponse;
	'perps.orders.cancel': Array<PolymarketPerpsCancelResponse>;
	'perps.orders.cancelAll': PolymarketPerpsGenericAccepted;
	'perps.orders.cancelByClientId': Array<PolymarketPerpsCancelResponse>;
	'perps.orders.create': Array<PolymarketPerpsOrderResponse>;
	'perps.orders.modify': Array<PolymarketPerpsModifyResponse>;
	'perps.orders.modifyByClientId': Array<PolymarketPerpsModifyResponse>;
	'perps.orders.setAutoCancel': PolymarketPerpsAutoCancelResponse;
	'perps.ping': {
		status?: string | null;
		[key: string]: unknown;
	};
	'perps.proxy.create': PolymarketPerpsProxyResponse;
	'perps.proxy.delete': PolymarketPerpsGenericAccepted;
	'perps.public.fills': PolymarketPerpsAccountTrades;
	'perps.public.portfolio': PolymarketPerpsPublicPortfolio;
	'perps.public.positionFills': PolymarketPerpsAccountTrades;
	'perps.public.positionSnapshots': PolymarketPerpsPositionSnapshots;
	'perps.registered': PolymarketPerpsRegisteredResponse;
	'perps.statistics': Array<PolymarketPerpsStatistic>;
	'perps.tickers': Array<PolymarketPerpsTicker>;
	'perps.time': PolymarketPerpsTime;
	'perps.trades': PolymarketPerpsTrades;
	'relayer.apiKeys.list': Array<PolymarketRelayerRelayerApiKey>;
	'relayer.deployed': PolymarketRelayerDeployedResponse;
	'relayer.nonce': PolymarketRelayerNonceResponse;
	'relayer.relayPayload': PolymarketRelayerRelayPayloadResponse;
	'relayer.transactions.get': Array<PolymarketRelayerRelayerTransaction>;
	'relayer.transactions.list': Array<PolymarketRelayerRelayerTransaction>;
	'relayer.transactions.submit': PolymarketRelayerSubmitResponse;
	'rfq.health': PolymarketRfqProbe;
	'rfq.priceBand': PolymarketRfqPriceBand;
	'rfq.ready': PolymarketRfqProbe;
	'rfq.time': PolymarketRfqServerTime;
	'rfq.trades.get': PolymarketRfqTradeStatus;
	'rfq.trades.prepare': PolymarketRfqPrepareResult;
	'rfq.trades.submit': PolymarketRfqSubmitResult;
	'rfq.trades.validate': PolymarketRfqValidationResult;
};
