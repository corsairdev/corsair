// Generated with endpoints/operation-types.ts from Polymarket's OpenAPI specs:
// one entry per operation in polymarket-manifest.json. Risk levels follow
// .github/PLUGIN_PR_RULES.md (R8).
import type {
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { polymarketSchemaEntry } from './openapi-schema';
import { createPolymarketOperation as op } from './operations';

export const polymarketEndpointsNested = {
	bridge: {
		deposit: op('bridge.deposit'),
		quote: op('bridge.quote'),
		status: op('bridge.status'),
		supportedAssets: op('bridge.supportedAssets'),
		withdraw: op('bridge.withdraw'),
	},
	clob: {
		apiKeys: {
			create: op('clob.apiKeys.create'),
			delete: op('clob.apiKeys.delete'),
			derive: op('clob.apiKeys.derive'),
			list: op('clob.apiKeys.list'),
		},
		balanceAllowance: {
			get: op('clob.balanceAllowance.get'),
			refresh: op('clob.balanceAllowance.refresh'),
			update: op('clob.balanceAllowance.update'),
		},
		books: {
			get: op('clob.books.get'),
			list: op('clob.books.list'),
			listByBody: op('clob.books.listByBody'),
		},
		builderApiKeys: {
			create: op('clob.builderApiKeys.create'),
			list: op('clob.builderApiKeys.list'),
			revoke: op('clob.builderApiKeys.revoke'),
		},
		closedOnlyMode: op('clob.closedOnlyMode'),
		feeRate: {
			get: op('clob.feeRate.get'),
			getByToken: op('clob.feeRate.getByToken'),
		},
		heartbeats: {
			send: op('clob.heartbeats.send'),
			sendV1: op('clob.heartbeats.sendV1'),
		},
		lastTradePrices: {
			get: op('clob.lastTradePrices.get'),
			list: op('clob.lastTradePrices.list'),
			listByBody: op('clob.lastTradePrices.listByBody'),
		},
		markets: {
			get: op('clob.markets.get'),
			getByToken: op('clob.markets.getByToken'),
			listSampling: op('clob.markets.listSampling'),
			listSamplingSimplified: op('clob.markets.listSamplingSimplified'),
			listSimplified: op('clob.markets.listSimplified'),
			liveActivity: op('clob.markets.liveActivity'),
			liveActivityByCondition: op('clob.markets.liveActivityByCondition'),
		},
		midpoints: {
			get: op('clob.midpoints.get'),
			list: op('clob.midpoints.list'),
			listByBody: op('clob.midpoints.listByBody'),
		},
		negRisk: {
			get: op('clob.negRisk.get'),
			getByToken: op('clob.negRisk.getByToken'),
		},
		notifications: {
			list: op('clob.notifications.list'),
			markRead: op('clob.notifications.markRead'),
		},
		orderScoring: {
			get: op('clob.orderScoring.get'),
			list: op('clob.orderScoring.list'),
			listByBody: op('clob.orderScoring.listByBody'),
		},
		orders: {
			cancel: op('clob.orders.cancel'),
			cancelAll: op('clob.orders.cancelAll'),
			cancelMany: op('clob.orders.cancelMany'),
			cancelMarket: op('clob.orders.cancelMarket'),
			cancelWallet: op('clob.orders.cancelWallet'),
			create: op('clob.orders.create'),
			createMany: op('clob.orders.createMany'),
			get: op('clob.orders.get'),
			list: op('clob.orders.list'),
			listWalletOpen: op('clob.orders.listWalletOpen'),
		},
		prices: {
			get: op('clob.prices.get'),
			list: op('clob.prices.list'),
			listByBody: op('clob.prices.listByBody'),
		},
		pricesHistory: {
			batch: op('clob.pricesHistory.batch'),
			get: op('clob.pricesHistory.get'),
		},
		rateLimitTier: op('clob.rateLimitTier'),
		rebates: {
			current: op('clob.rebates.current'),
		},
		rewards: {
			current: op('clob.rewards.current'),
			market: op('clob.rewards.market'),
			markets: op('clob.rewards.markets'),
			userEarnings: op('clob.rewards.userEarnings'),
			userMarkets: op('clob.rewards.userMarkets'),
			userPercentages: op('clob.rewards.userPercentages'),
			userTotalEarnings: op('clob.rewards.userTotalEarnings'),
		},
		spreads: {
			get: op('clob.spreads.get'),
			list: op('clob.spreads.list'),
		},
		tickSize: {
			get: op('clob.tickSize.get'),
			getByToken: op('clob.tickSize.getByToken'),
		},
		time: op('clob.time'),
		trades: {
			list: op('clob.trades.list'),
			listBuilder: op('clob.trades.listBuilder'),
		},
	},
	combos: {
		confirmations: {
			submit: op('combos.confirmations.submit'),
		},
		markets: {
			list: op('combos.markets.list'),
		},
		quotes: {
			cancel: op('combos.quotes.cancel'),
			submit: op('combos.quotes.submit'),
		},
	},
	data: {
		activity: {
			combos: op('data.activity.combos'),
			list: op('data.activity.list'),
		},
		approvals: op('data.approvals'),
		biggestWinners: op('data.biggestWinners'),
		builders: {
			leaderboard: op('data.builders.leaderboard'),
			volume: op('data.builders.volume'),
		},
		holders: op('data.holders'),
		leaderboard: op('data.leaderboard'),
		liveVolume: op('data.liveVolume'),
		openInterest: op('data.openInterest'),
		positions: {
			combos: op('data.positions.combos'),
			list: op('data.positions.list'),
			snapshot: op('data.positions.snapshot'),
		},
		pricesHistory: op('data.pricesHistory'),
		resolutions: op('data.resolutions'),
		status: op('data.status'),
		tokens: op('data.tokens'),
		trades: op('data.trades'),
		users: {
			pnl: op('data.users.pnl'),
			stats: op('data.users.stats'),
			volume: op('data.users.volume'),
		},
		value: op('data.value'),
	},
	gamma: {
		comments: {
			get: op('gamma.comments.get'),
			list: op('gamma.comments.list'),
			listByUser: op('gamma.comments.listByUser'),
			listKeyset: op('gamma.comments.listKeyset'),
		},
		cryptoMarketConfigs: {
			list: op('gamma.cryptoMarketConfigs.list'),
		},
		events: {
			commentCount: op('gamma.events.commentCount'),
			count: op('gamma.events.count'),
			creators: {
				get: op('gamma.events.creators.get'),
				list: op('gamma.events.creators.list'),
			},
			externalPartners: {
				get: op('gamma.events.externalPartners.get'),
				list: op('gamma.events.externalPartners.list'),
			},
			get: op('gamma.events.get'),
			getByPartner: op('gamma.events.getByPartner'),
			getBySlug: op('gamma.events.getBySlug'),
			insights: op('gamma.events.insights'),
			list: op('gamma.events.list'),
			listKeyset: op('gamma.events.listKeyset'),
			listPaginated: op('gamma.events.listPaginated'),
			premadeCombos: op('gamma.events.premadeCombos'),
			reference: op('gamma.events.reference'),
			similar: op('gamma.events.similar'),
			sportResults: op('gamma.events.sportResults'),
			tags: op('gamma.events.tags'),
			tweetCount: op('gamma.events.tweetCount'),
		},
		facets: {
			get: op('gamma.facets.get'),
			list: op('gamma.facets.list'),
		},
		feeTypes: {
			events: op('gamma.feeTypes.events'),
			list: op('gamma.feeTypes.list'),
		},
		games: {
			get: op('gamma.games.get'),
		},
		makerTiers: {
			get: op('gamma.makerTiers.get'),
			ladder: op('gamma.makerTiers.ladder'),
		},
		marketClarifications: {
			list: op('gamma.marketClarifications.list'),
		},
		marketEstimateHistory: {
			list: op('gamma.marketEstimateHistory.list'),
		},
		markets: {
			description: op('gamma.markets.description'),
			get: op('gamma.markets.get'),
			getBySlug: op('gamma.markets.getBySlug'),
			information: op('gamma.markets.information'),
			list: op('gamma.markets.list'),
			listAbridged: op('gamma.markets.listAbridged'),
			listAbridgedKeyset: op('gamma.markets.listAbridgedKeyset'),
			listKeyset: op('gamma.markets.listKeyset'),
			related: op('gamma.markets.related'),
			tags: op('gamma.markets.tags'),
		},
		moderators: {
			list: op('gamma.moderators.list'),
		},
		partners: {
			get: op('gamma.partners.get'),
			list: op('gamma.partners.list'),
		},
		profiles: {
			get: op('gamma.profiles.get'),
			getByAddress: op('gamma.profiles.getByAddress'),
			list: op('gamma.profiles.list'),
		},
		readyz: op('gamma.readyz'),
		referralLeaderboard: op('gamma.referralLeaderboard'),
		search: op('gamma.search'),
		searchV2: op('gamma.searchV2'),
		series: {
			commentCount: op('gamma.series.commentCount'),
			get: op('gamma.series.get'),
			list: op('gamma.series.list'),
			listKeyset: op('gamma.series.listKeyset'),
			summary: op('gamma.series.summary'),
			summaryBySlug: op('gamma.series.summaryBySlug'),
		},
		sports: {
			externalPartners: {
				get: op('gamma.sports.externalPartners.get'),
				list: op('gamma.sports.externalPartners.list'),
			},
			get: op('gamma.sports.get'),
			getByPartner: op('gamma.sports.getByPartner'),
			list: op('gamma.sports.list'),
			marketTypes: op('gamma.sports.marketTypes'),
			premadeCombos: op('gamma.sports.premadeCombos'),
			summary: op('gamma.sports.summary'),
		},
		status: op('gamma.status'),
		tags: {
			get: op('gamma.tags.get'),
			getBySlug: op('gamma.tags.getBySlug'),
			list: op('gamma.tags.list'),
			related: op('gamma.tags.related'),
			relatedBySlug: op('gamma.tags.relatedBySlug'),
			relations: op('gamma.tags.relations'),
			relationsBySlug: op('gamma.tags.relationsBySlug'),
		},
		takerTiers: {
			get: op('gamma.takerTiers.get'),
			ladder: op('gamma.takerTiers.ladder'),
		},
		teams: {
			externalPartners: {
				get: op('gamma.teams.externalPartners.get'),
				list: op('gamma.teams.externalPartners.list'),
			},
			get: op('gamma.teams.get'),
			getByPartner: op('gamma.teams.getByPartner'),
			list: op('gamma.teams.list'),
		},
		terms: {
			current: op('gamma.terms.current'),
		},
		tournaments: {
			get: op('gamma.tournaments.get'),
			list: op('gamma.tournaments.list'),
		},
		walletType: op('gamma.walletType'),
	},
	perps: {
		account: {
			applyReferral: op('perps.account.applyReferral'),
			approveBuilder: op('perps.account.approveBuilder'),
			autoCancel: op('perps.account.autoCancel'),
			backstops: op('perps.account.backstops'),
			balances: op('perps.account.balances'),
			builderApprovals: op('perps.account.builderApprovals'),
			builderEarnings: op('perps.account.builderEarnings'),
			builderEarningsSummary: op('perps.account.builderEarningsSummary'),
			config: op('perps.account.config'),
			createInvite: op('perps.account.createInvite'),
			credentials: op('perps.account.credentials'),
			deposits: op('perps.account.deposits'),
			equity: op('perps.account.equity'),
			fills: op('perps.account.fills'),
			funding: op('perps.account.funding'),
			internalTransfer: op('perps.account.internalTransfer'),
			internalTransfers: op('perps.account.internalTransfers'),
			limits: op('perps.account.limits'),
			markNotificationsRead: op('perps.account.markNotificationsRead'),
			notifications: op('perps.account.notifications'),
			openOrders: op('perps.account.openOrders'),
			orders: op('perps.account.orders'),
			pnl: op('perps.account.pnl'),
			portfolio: op('perps.account.portfolio'),
			referral: op('perps.account.referral'),
			rewards: op('perps.account.rewards'),
			stats: op('perps.account.stats'),
			updateBuilder: op('perps.account.updateBuilder'),
			withdraw: op('perps.account.withdraw'),
			withdrawals: op('perps.account.withdrawals'),
		},
		assets: op('perps.assets'),
		bbo: op('perps.bbo'),
		blp: {
			enroll: op('perps.blp.enroll'),
			enrollment: op('perps.blp.enrollment'),
			liquidations: op('perps.blp.liquidations'),
		},
		book: op('perps.book'),
		builder: op('perps.builder'),
		competitions: {
			account: op('perps.competitions.account'),
			get: op('perps.competitions.get'),
			leaderboard: op('perps.competitions.leaderboard'),
			list: op('perps.competitions.list'),
			widget: op('perps.competitions.widget'),
		},
		exchange: op('perps.exchange'),
		exchangeStatistics: op('perps.exchangeStatistics'),
		fees: op('perps.fees'),
		fundingHistory: op('perps.fundingHistory'),
		index: op('perps.index'),
		instruments: op('perps.instruments'),
		inviteCode: op('perps.inviteCode'),
		klines: op('perps.klines'),
		leaderboard: op('perps.leaderboard'),
		leverage: {
			update: op('perps.leverage.update'),
			updateMany: op('perps.leverage.updateMany'),
		},
		limitTiers: op('perps.limitTiers'),
		margin: {
			update: op('perps.margin.update'),
		},
		markHistory: op('perps.markHistory'),
		orders: {
			cancel: op('perps.orders.cancel'),
			cancelAll: op('perps.orders.cancelAll'),
			cancelByClientId: op('perps.orders.cancelByClientId'),
			create: op('perps.orders.create'),
			modify: op('perps.orders.modify'),
			modifyByClientId: op('perps.orders.modifyByClientId'),
			setAutoCancel: op('perps.orders.setAutoCancel'),
		},
		ping: op('perps.ping'),
		proxy: {
			create: op('perps.proxy.create'),
			delete: op('perps.proxy.delete'),
		},
		public: {
			fills: op('perps.public.fills'),
			portfolio: op('perps.public.portfolio'),
			positionFills: op('perps.public.positionFills'),
			positionSnapshots: op('perps.public.positionSnapshots'),
		},
		registered: op('perps.registered'),
		statistics: op('perps.statistics'),
		tickers: op('perps.tickers'),
		time: op('perps.time'),
		trades: op('perps.trades'),
	},
	relayer: {
		apiKeys: {
			list: op('relayer.apiKeys.list'),
		},
		deployed: op('relayer.deployed'),
		nonce: op('relayer.nonce'),
		relayPayload: op('relayer.relayPayload'),
		transactions: {
			get: op('relayer.transactions.get'),
			list: op('relayer.transactions.list'),
			submit: op('relayer.transactions.submit'),
		},
	},
	rfq: {
		health: op('rfq.health'),
		priceBand: op('rfq.priceBand'),
		ready: op('rfq.ready'),
		time: op('rfq.time'),
		trades: {
			get: op('rfq.trades.get'),
			prepare: op('rfq.trades.prepare'),
			submit: op('rfq.trades.submit'),
			validate: op('rfq.trades.validate'),
		},
	},
} as const;

export const polymarketEndpointSchemas = {
	'bridge.deposit': polymarketSchemaEntry('bridge.deposit'),
	'bridge.quote': polymarketSchemaEntry('bridge.quote'),
	'bridge.status': polymarketSchemaEntry('bridge.status'),
	'bridge.supportedAssets': polymarketSchemaEntry('bridge.supportedAssets'),
	'bridge.withdraw': polymarketSchemaEntry('bridge.withdraw'),
	'clob.apiKeys.create': polymarketSchemaEntry('clob.apiKeys.create'),
	'clob.apiKeys.delete': polymarketSchemaEntry('clob.apiKeys.delete'),
	'clob.apiKeys.derive': polymarketSchemaEntry('clob.apiKeys.derive'),
	'clob.apiKeys.list': polymarketSchemaEntry('clob.apiKeys.list'),
	'clob.balanceAllowance.get': polymarketSchemaEntry(
		'clob.balanceAllowance.get',
	),
	'clob.balanceAllowance.refresh': polymarketSchemaEntry(
		'clob.balanceAllowance.refresh',
	),
	'clob.balanceAllowance.update': polymarketSchemaEntry(
		'clob.balanceAllowance.update',
	),
	'clob.books.get': polymarketSchemaEntry('clob.books.get'),
	'clob.books.list': polymarketSchemaEntry('clob.books.list'),
	'clob.books.listByBody': polymarketSchemaEntry('clob.books.listByBody'),
	'clob.builderApiKeys.create': polymarketSchemaEntry(
		'clob.builderApiKeys.create',
	),
	'clob.builderApiKeys.list': polymarketSchemaEntry('clob.builderApiKeys.list'),
	'clob.builderApiKeys.revoke': polymarketSchemaEntry(
		'clob.builderApiKeys.revoke',
	),
	'clob.closedOnlyMode': polymarketSchemaEntry('clob.closedOnlyMode'),
	'clob.feeRate.get': polymarketSchemaEntry('clob.feeRate.get'),
	'clob.feeRate.getByToken': polymarketSchemaEntry('clob.feeRate.getByToken'),
	'clob.heartbeats.send': polymarketSchemaEntry('clob.heartbeats.send'),
	'clob.heartbeats.sendV1': polymarketSchemaEntry('clob.heartbeats.sendV1'),
	'clob.lastTradePrices.get': polymarketSchemaEntry('clob.lastTradePrices.get'),
	'clob.lastTradePrices.list': polymarketSchemaEntry(
		'clob.lastTradePrices.list',
	),
	'clob.lastTradePrices.listByBody': polymarketSchemaEntry(
		'clob.lastTradePrices.listByBody',
	),
	'clob.markets.get': polymarketSchemaEntry('clob.markets.get'),
	'clob.markets.getByToken': polymarketSchemaEntry('clob.markets.getByToken'),
	'clob.markets.listSampling': polymarketSchemaEntry(
		'clob.markets.listSampling',
	),
	'clob.markets.listSamplingSimplified': polymarketSchemaEntry(
		'clob.markets.listSamplingSimplified',
	),
	'clob.markets.listSimplified': polymarketSchemaEntry(
		'clob.markets.listSimplified',
	),
	'clob.markets.liveActivity': polymarketSchemaEntry(
		'clob.markets.liveActivity',
	),
	'clob.markets.liveActivityByCondition': polymarketSchemaEntry(
		'clob.markets.liveActivityByCondition',
	),
	'clob.midpoints.get': polymarketSchemaEntry('clob.midpoints.get'),
	'clob.midpoints.list': polymarketSchemaEntry('clob.midpoints.list'),
	'clob.midpoints.listByBody': polymarketSchemaEntry(
		'clob.midpoints.listByBody',
	),
	'clob.negRisk.get': polymarketSchemaEntry('clob.negRisk.get'),
	'clob.negRisk.getByToken': polymarketSchemaEntry('clob.negRisk.getByToken'),
	'clob.notifications.list': polymarketSchemaEntry('clob.notifications.list'),
	'clob.notifications.markRead': polymarketSchemaEntry(
		'clob.notifications.markRead',
	),
	'clob.orderScoring.get': polymarketSchemaEntry('clob.orderScoring.get'),
	'clob.orderScoring.list': polymarketSchemaEntry('clob.orderScoring.list'),
	'clob.orderScoring.listByBody': polymarketSchemaEntry(
		'clob.orderScoring.listByBody',
	),
	'clob.orders.cancel': polymarketSchemaEntry('clob.orders.cancel'),
	'clob.orders.cancelAll': polymarketSchemaEntry('clob.orders.cancelAll'),
	'clob.orders.cancelMany': polymarketSchemaEntry('clob.orders.cancelMany'),
	'clob.orders.cancelMarket': polymarketSchemaEntry('clob.orders.cancelMarket'),
	'clob.orders.cancelWallet': polymarketSchemaEntry('clob.orders.cancelWallet'),
	'clob.orders.create': polymarketSchemaEntry('clob.orders.create'),
	'clob.orders.createMany': polymarketSchemaEntry('clob.orders.createMany'),
	'clob.orders.get': polymarketSchemaEntry('clob.orders.get'),
	'clob.orders.list': polymarketSchemaEntry('clob.orders.list'),
	'clob.orders.listWalletOpen': polymarketSchemaEntry(
		'clob.orders.listWalletOpen',
	),
	'clob.prices.get': polymarketSchemaEntry('clob.prices.get'),
	'clob.prices.list': polymarketSchemaEntry('clob.prices.list'),
	'clob.prices.listByBody': polymarketSchemaEntry('clob.prices.listByBody'),
	'clob.pricesHistory.batch': polymarketSchemaEntry('clob.pricesHistory.batch'),
	'clob.pricesHistory.get': polymarketSchemaEntry('clob.pricesHistory.get'),
	'clob.rateLimitTier': polymarketSchemaEntry('clob.rateLimitTier'),
	'clob.rebates.current': polymarketSchemaEntry('clob.rebates.current'),
	'clob.rewards.current': polymarketSchemaEntry('clob.rewards.current'),
	'clob.rewards.market': polymarketSchemaEntry('clob.rewards.market'),
	'clob.rewards.markets': polymarketSchemaEntry('clob.rewards.markets'),
	'clob.rewards.userEarnings': polymarketSchemaEntry(
		'clob.rewards.userEarnings',
	),
	'clob.rewards.userMarkets': polymarketSchemaEntry('clob.rewards.userMarkets'),
	'clob.rewards.userPercentages': polymarketSchemaEntry(
		'clob.rewards.userPercentages',
	),
	'clob.rewards.userTotalEarnings': polymarketSchemaEntry(
		'clob.rewards.userTotalEarnings',
	),
	'clob.spreads.get': polymarketSchemaEntry('clob.spreads.get'),
	'clob.spreads.list': polymarketSchemaEntry('clob.spreads.list'),
	'clob.tickSize.get': polymarketSchemaEntry('clob.tickSize.get'),
	'clob.tickSize.getByToken': polymarketSchemaEntry('clob.tickSize.getByToken'),
	'clob.time': polymarketSchemaEntry('clob.time'),
	'clob.trades.list': polymarketSchemaEntry('clob.trades.list'),
	'clob.trades.listBuilder': polymarketSchemaEntry('clob.trades.listBuilder'),
	'combos.confirmations.submit': polymarketSchemaEntry(
		'combos.confirmations.submit',
	),
	'combos.markets.list': polymarketSchemaEntry('combos.markets.list'),
	'combos.quotes.cancel': polymarketSchemaEntry('combos.quotes.cancel'),
	'combos.quotes.submit': polymarketSchemaEntry('combos.quotes.submit'),
	'data.activity.combos': polymarketSchemaEntry('data.activity.combos'),
	'data.activity.list': polymarketSchemaEntry('data.activity.list'),
	'data.approvals': polymarketSchemaEntry('data.approvals'),
	'data.biggestWinners': polymarketSchemaEntry('data.biggestWinners'),
	'data.builders.leaderboard': polymarketSchemaEntry(
		'data.builders.leaderboard',
	),
	'data.builders.volume': polymarketSchemaEntry('data.builders.volume'),
	'data.holders': polymarketSchemaEntry('data.holders'),
	'data.leaderboard': polymarketSchemaEntry('data.leaderboard'),
	'data.liveVolume': polymarketSchemaEntry('data.liveVolume'),
	'data.openInterest': polymarketSchemaEntry('data.openInterest'),
	'data.positions.combos': polymarketSchemaEntry('data.positions.combos'),
	'data.positions.list': polymarketSchemaEntry('data.positions.list'),
	'data.positions.snapshot': polymarketSchemaEntry('data.positions.snapshot'),
	'data.pricesHistory': polymarketSchemaEntry('data.pricesHistory'),
	'data.resolutions': polymarketSchemaEntry('data.resolutions'),
	'data.status': polymarketSchemaEntry('data.status'),
	'data.tokens': polymarketSchemaEntry('data.tokens'),
	'data.trades': polymarketSchemaEntry('data.trades'),
	'data.users.pnl': polymarketSchemaEntry('data.users.pnl'),
	'data.users.stats': polymarketSchemaEntry('data.users.stats'),
	'data.users.volume': polymarketSchemaEntry('data.users.volume'),
	'data.value': polymarketSchemaEntry('data.value'),
	'gamma.comments.get': polymarketSchemaEntry('gamma.comments.get'),
	'gamma.comments.list': polymarketSchemaEntry('gamma.comments.list'),
	'gamma.comments.listByUser': polymarketSchemaEntry(
		'gamma.comments.listByUser',
	),
	'gamma.comments.listKeyset': polymarketSchemaEntry(
		'gamma.comments.listKeyset',
	),
	'gamma.cryptoMarketConfigs.list': polymarketSchemaEntry(
		'gamma.cryptoMarketConfigs.list',
	),
	'gamma.events.commentCount': polymarketSchemaEntry(
		'gamma.events.commentCount',
	),
	'gamma.events.count': polymarketSchemaEntry('gamma.events.count'),
	'gamma.events.creators.get': polymarketSchemaEntry(
		'gamma.events.creators.get',
	),
	'gamma.events.creators.list': polymarketSchemaEntry(
		'gamma.events.creators.list',
	),
	'gamma.events.externalPartners.get': polymarketSchemaEntry(
		'gamma.events.externalPartners.get',
	),
	'gamma.events.externalPartners.list': polymarketSchemaEntry(
		'gamma.events.externalPartners.list',
	),
	'gamma.events.get': polymarketSchemaEntry('gamma.events.get'),
	'gamma.events.getByPartner': polymarketSchemaEntry(
		'gamma.events.getByPartner',
	),
	'gamma.events.getBySlug': polymarketSchemaEntry('gamma.events.getBySlug'),
	'gamma.events.insights': polymarketSchemaEntry('gamma.events.insights'),
	'gamma.events.list': polymarketSchemaEntry('gamma.events.list'),
	'gamma.events.listKeyset': polymarketSchemaEntry('gamma.events.listKeyset'),
	'gamma.events.listPaginated': polymarketSchemaEntry(
		'gamma.events.listPaginated',
	),
	'gamma.events.premadeCombos': polymarketSchemaEntry(
		'gamma.events.premadeCombos',
	),
	'gamma.events.reference': polymarketSchemaEntry('gamma.events.reference'),
	'gamma.events.similar': polymarketSchemaEntry('gamma.events.similar'),
	'gamma.events.sportResults': polymarketSchemaEntry(
		'gamma.events.sportResults',
	),
	'gamma.events.tags': polymarketSchemaEntry('gamma.events.tags'),
	'gamma.events.tweetCount': polymarketSchemaEntry('gamma.events.tweetCount'),
	'gamma.facets.get': polymarketSchemaEntry('gamma.facets.get'),
	'gamma.facets.list': polymarketSchemaEntry('gamma.facets.list'),
	'gamma.feeTypes.events': polymarketSchemaEntry('gamma.feeTypes.events'),
	'gamma.feeTypes.list': polymarketSchemaEntry('gamma.feeTypes.list'),
	'gamma.games.get': polymarketSchemaEntry('gamma.games.get'),
	'gamma.makerTiers.get': polymarketSchemaEntry('gamma.makerTiers.get'),
	'gamma.makerTiers.ladder': polymarketSchemaEntry('gamma.makerTiers.ladder'),
	'gamma.marketClarifications.list': polymarketSchemaEntry(
		'gamma.marketClarifications.list',
	),
	'gamma.marketEstimateHistory.list': polymarketSchemaEntry(
		'gamma.marketEstimateHistory.list',
	),
	'gamma.markets.description': polymarketSchemaEntry(
		'gamma.markets.description',
	),
	'gamma.markets.get': polymarketSchemaEntry('gamma.markets.get'),
	'gamma.markets.getBySlug': polymarketSchemaEntry('gamma.markets.getBySlug'),
	'gamma.markets.information': polymarketSchemaEntry(
		'gamma.markets.information',
	),
	'gamma.markets.list': polymarketSchemaEntry('gamma.markets.list'),
	'gamma.markets.listAbridged': polymarketSchemaEntry(
		'gamma.markets.listAbridged',
	),
	'gamma.markets.listAbridgedKeyset': polymarketSchemaEntry(
		'gamma.markets.listAbridgedKeyset',
	),
	'gamma.markets.listKeyset': polymarketSchemaEntry('gamma.markets.listKeyset'),
	'gamma.markets.related': polymarketSchemaEntry('gamma.markets.related'),
	'gamma.markets.tags': polymarketSchemaEntry('gamma.markets.tags'),
	'gamma.moderators.list': polymarketSchemaEntry('gamma.moderators.list'),
	'gamma.partners.get': polymarketSchemaEntry('gamma.partners.get'),
	'gamma.partners.list': polymarketSchemaEntry('gamma.partners.list'),
	'gamma.profiles.get': polymarketSchemaEntry('gamma.profiles.get'),
	'gamma.profiles.getByAddress': polymarketSchemaEntry(
		'gamma.profiles.getByAddress',
	),
	'gamma.profiles.list': polymarketSchemaEntry('gamma.profiles.list'),
	'gamma.readyz': polymarketSchemaEntry('gamma.readyz'),
	'gamma.referralLeaderboard': polymarketSchemaEntry(
		'gamma.referralLeaderboard',
	),
	'gamma.search': polymarketSchemaEntry('gamma.search'),
	'gamma.searchV2': polymarketSchemaEntry('gamma.searchV2'),
	'gamma.series.commentCount': polymarketSchemaEntry(
		'gamma.series.commentCount',
	),
	'gamma.series.get': polymarketSchemaEntry('gamma.series.get'),
	'gamma.series.list': polymarketSchemaEntry('gamma.series.list'),
	'gamma.series.listKeyset': polymarketSchemaEntry('gamma.series.listKeyset'),
	'gamma.series.summary': polymarketSchemaEntry('gamma.series.summary'),
	'gamma.series.summaryBySlug': polymarketSchemaEntry(
		'gamma.series.summaryBySlug',
	),
	'gamma.sports.externalPartners.get': polymarketSchemaEntry(
		'gamma.sports.externalPartners.get',
	),
	'gamma.sports.externalPartners.list': polymarketSchemaEntry(
		'gamma.sports.externalPartners.list',
	),
	'gamma.sports.get': polymarketSchemaEntry('gamma.sports.get'),
	'gamma.sports.getByPartner': polymarketSchemaEntry(
		'gamma.sports.getByPartner',
	),
	'gamma.sports.list': polymarketSchemaEntry('gamma.sports.list'),
	'gamma.sports.marketTypes': polymarketSchemaEntry('gamma.sports.marketTypes'),
	'gamma.sports.premadeCombos': polymarketSchemaEntry(
		'gamma.sports.premadeCombos',
	),
	'gamma.sports.summary': polymarketSchemaEntry('gamma.sports.summary'),
	'gamma.status': polymarketSchemaEntry('gamma.status'),
	'gamma.tags.get': polymarketSchemaEntry('gamma.tags.get'),
	'gamma.tags.getBySlug': polymarketSchemaEntry('gamma.tags.getBySlug'),
	'gamma.tags.list': polymarketSchemaEntry('gamma.tags.list'),
	'gamma.tags.related': polymarketSchemaEntry('gamma.tags.related'),
	'gamma.tags.relatedBySlug': polymarketSchemaEntry('gamma.tags.relatedBySlug'),
	'gamma.tags.relations': polymarketSchemaEntry('gamma.tags.relations'),
	'gamma.tags.relationsBySlug': polymarketSchemaEntry(
		'gamma.tags.relationsBySlug',
	),
	'gamma.takerTiers.get': polymarketSchemaEntry('gamma.takerTiers.get'),
	'gamma.takerTiers.ladder': polymarketSchemaEntry('gamma.takerTiers.ladder'),
	'gamma.teams.externalPartners.get': polymarketSchemaEntry(
		'gamma.teams.externalPartners.get',
	),
	'gamma.teams.externalPartners.list': polymarketSchemaEntry(
		'gamma.teams.externalPartners.list',
	),
	'gamma.teams.get': polymarketSchemaEntry('gamma.teams.get'),
	'gamma.teams.getByPartner': polymarketSchemaEntry('gamma.teams.getByPartner'),
	'gamma.teams.list': polymarketSchemaEntry('gamma.teams.list'),
	'gamma.terms.current': polymarketSchemaEntry('gamma.terms.current'),
	'gamma.tournaments.get': polymarketSchemaEntry('gamma.tournaments.get'),
	'gamma.tournaments.list': polymarketSchemaEntry('gamma.tournaments.list'),
	'gamma.walletType': polymarketSchemaEntry('gamma.walletType'),
	'perps.account.applyReferral': polymarketSchemaEntry(
		'perps.account.applyReferral',
	),
	'perps.account.approveBuilder': polymarketSchemaEntry(
		'perps.account.approveBuilder',
	),
	'perps.account.autoCancel': polymarketSchemaEntry('perps.account.autoCancel'),
	'perps.account.backstops': polymarketSchemaEntry('perps.account.backstops'),
	'perps.account.balances': polymarketSchemaEntry('perps.account.balances'),
	'perps.account.builderApprovals': polymarketSchemaEntry(
		'perps.account.builderApprovals',
	),
	'perps.account.builderEarnings': polymarketSchemaEntry(
		'perps.account.builderEarnings',
	),
	'perps.account.builderEarningsSummary': polymarketSchemaEntry(
		'perps.account.builderEarningsSummary',
	),
	'perps.account.config': polymarketSchemaEntry('perps.account.config'),
	'perps.account.createInvite': polymarketSchemaEntry(
		'perps.account.createInvite',
	),
	'perps.account.credentials': polymarketSchemaEntry(
		'perps.account.credentials',
	),
	'perps.account.deposits': polymarketSchemaEntry('perps.account.deposits'),
	'perps.account.equity': polymarketSchemaEntry('perps.account.equity'),
	'perps.account.fills': polymarketSchemaEntry('perps.account.fills'),
	'perps.account.funding': polymarketSchemaEntry('perps.account.funding'),
	'perps.account.internalTransfer': polymarketSchemaEntry(
		'perps.account.internalTransfer',
	),
	'perps.account.internalTransfers': polymarketSchemaEntry(
		'perps.account.internalTransfers',
	),
	'perps.account.limits': polymarketSchemaEntry('perps.account.limits'),
	'perps.account.markNotificationsRead': polymarketSchemaEntry(
		'perps.account.markNotificationsRead',
	),
	'perps.account.notifications': polymarketSchemaEntry(
		'perps.account.notifications',
	),
	'perps.account.openOrders': polymarketSchemaEntry('perps.account.openOrders'),
	'perps.account.orders': polymarketSchemaEntry('perps.account.orders'),
	'perps.account.pnl': polymarketSchemaEntry('perps.account.pnl'),
	'perps.account.portfolio': polymarketSchemaEntry('perps.account.portfolio'),
	'perps.account.referral': polymarketSchemaEntry('perps.account.referral'),
	'perps.account.rewards': polymarketSchemaEntry('perps.account.rewards'),
	'perps.account.stats': polymarketSchemaEntry('perps.account.stats'),
	'perps.account.updateBuilder': polymarketSchemaEntry(
		'perps.account.updateBuilder',
	),
	'perps.account.withdraw': polymarketSchemaEntry('perps.account.withdraw'),
	'perps.account.withdrawals': polymarketSchemaEntry(
		'perps.account.withdrawals',
	),
	'perps.assets': polymarketSchemaEntry('perps.assets'),
	'perps.bbo': polymarketSchemaEntry('perps.bbo'),
	'perps.blp.enroll': polymarketSchemaEntry('perps.blp.enroll'),
	'perps.blp.enrollment': polymarketSchemaEntry('perps.blp.enrollment'),
	'perps.blp.liquidations': polymarketSchemaEntry('perps.blp.liquidations'),
	'perps.book': polymarketSchemaEntry('perps.book'),
	'perps.builder': polymarketSchemaEntry('perps.builder'),
	'perps.competitions.account': polymarketSchemaEntry(
		'perps.competitions.account',
	),
	'perps.competitions.get': polymarketSchemaEntry('perps.competitions.get'),
	'perps.competitions.leaderboard': polymarketSchemaEntry(
		'perps.competitions.leaderboard',
	),
	'perps.competitions.list': polymarketSchemaEntry('perps.competitions.list'),
	'perps.competitions.widget': polymarketSchemaEntry(
		'perps.competitions.widget',
	),
	'perps.exchange': polymarketSchemaEntry('perps.exchange'),
	'perps.exchangeStatistics': polymarketSchemaEntry('perps.exchangeStatistics'),
	'perps.fees': polymarketSchemaEntry('perps.fees'),
	'perps.fundingHistory': polymarketSchemaEntry('perps.fundingHistory'),
	'perps.index': polymarketSchemaEntry('perps.index'),
	'perps.instruments': polymarketSchemaEntry('perps.instruments'),
	'perps.inviteCode': polymarketSchemaEntry('perps.inviteCode'),
	'perps.klines': polymarketSchemaEntry('perps.klines'),
	'perps.leaderboard': polymarketSchemaEntry('perps.leaderboard'),
	'perps.leverage.update': polymarketSchemaEntry('perps.leverage.update'),
	'perps.leverage.updateMany': polymarketSchemaEntry(
		'perps.leverage.updateMany',
	),
	'perps.limitTiers': polymarketSchemaEntry('perps.limitTiers'),
	'perps.margin.update': polymarketSchemaEntry('perps.margin.update'),
	'perps.markHistory': polymarketSchemaEntry('perps.markHistory'),
	'perps.orders.cancel': polymarketSchemaEntry('perps.orders.cancel'),
	'perps.orders.cancelAll': polymarketSchemaEntry('perps.orders.cancelAll'),
	'perps.orders.cancelByClientId': polymarketSchemaEntry(
		'perps.orders.cancelByClientId',
	),
	'perps.orders.create': polymarketSchemaEntry('perps.orders.create'),
	'perps.orders.modify': polymarketSchemaEntry('perps.orders.modify'),
	'perps.orders.modifyByClientId': polymarketSchemaEntry(
		'perps.orders.modifyByClientId',
	),
	'perps.orders.setAutoCancel': polymarketSchemaEntry(
		'perps.orders.setAutoCancel',
	),
	'perps.ping': polymarketSchemaEntry('perps.ping'),
	'perps.proxy.create': polymarketSchemaEntry('perps.proxy.create'),
	'perps.proxy.delete': polymarketSchemaEntry('perps.proxy.delete'),
	'perps.public.fills': polymarketSchemaEntry('perps.public.fills'),
	'perps.public.portfolio': polymarketSchemaEntry('perps.public.portfolio'),
	'perps.public.positionFills': polymarketSchemaEntry(
		'perps.public.positionFills',
	),
	'perps.public.positionSnapshots': polymarketSchemaEntry(
		'perps.public.positionSnapshots',
	),
	'perps.registered': polymarketSchemaEntry('perps.registered'),
	'perps.statistics': polymarketSchemaEntry('perps.statistics'),
	'perps.tickers': polymarketSchemaEntry('perps.tickers'),
	'perps.time': polymarketSchemaEntry('perps.time'),
	'perps.trades': polymarketSchemaEntry('perps.trades'),
	'relayer.apiKeys.list': polymarketSchemaEntry('relayer.apiKeys.list'),
	'relayer.deployed': polymarketSchemaEntry('relayer.deployed'),
	'relayer.nonce': polymarketSchemaEntry('relayer.nonce'),
	'relayer.relayPayload': polymarketSchemaEntry('relayer.relayPayload'),
	'relayer.transactions.get': polymarketSchemaEntry('relayer.transactions.get'),
	'relayer.transactions.list': polymarketSchemaEntry(
		'relayer.transactions.list',
	),
	'relayer.transactions.submit': polymarketSchemaEntry(
		'relayer.transactions.submit',
	),
	'rfq.health': polymarketSchemaEntry('rfq.health'),
	'rfq.priceBand': polymarketSchemaEntry('rfq.priceBand'),
	'rfq.ready': polymarketSchemaEntry('rfq.ready'),
	'rfq.time': polymarketSchemaEntry('rfq.time'),
	'rfq.trades.get': polymarketSchemaEntry('rfq.trades.get'),
	'rfq.trades.prepare': polymarketSchemaEntry('rfq.trades.prepare'),
	'rfq.trades.submit': polymarketSchemaEntry('rfq.trades.submit'),
	'rfq.trades.validate': polymarketSchemaEntry('rfq.trades.validate'),
} satisfies RequiredPluginEndpointSchemas<typeof polymarketEndpointsNested>;

export const polymarketEndpointMeta = {
	'bridge.deposit': {
		riskLevel: 'write',
		description: 'Create bridge addresses',
	},
	'bridge.quote': {
		riskLevel: 'read',
		description: 'Get a quote',
	},
	'bridge.status': {
		riskLevel: 'read',
		description: 'Get transaction status',
	},
	'bridge.supportedAssets': {
		riskLevel: 'read',
		description: 'Get supported assets',
	},
	'bridge.withdraw': {
		riskLevel: 'destructive',
		description: 'Create withdrawal addresses',
	},
	'clob.apiKeys.create': {
		riskLevel: 'destructive',
		description: 'Create API key',
	},
	'clob.apiKeys.delete': {
		riskLevel: 'destructive',
		description: 'Delete API key',
	},
	'clob.apiKeys.derive': {
		riskLevel: 'read',
		description: 'Derive API key',
	},
	'clob.apiKeys.list': {
		riskLevel: 'read',
		description: 'Get API keys',
	},
	'clob.balanceAllowance.get': {
		riskLevel: 'read',
		description: 'Get balance and allowance',
	},
	'clob.balanceAllowance.refresh': {
		riskLevel: 'read',
		description: 'Update balance and allowance',
	},
	'clob.balanceAllowance.update': {
		riskLevel: 'write',
		description: 'Update balance and allowance',
	},
	'clob.books.get': {
		riskLevel: 'read',
		description: 'Get order book',
	},
	'clob.books.list': {
		riskLevel: 'read',
		description: 'Get order books (query parameters)',
	},
	'clob.books.listByBody': {
		riskLevel: 'read',
		description: 'Get order books (request body)',
	},
	'clob.builderApiKeys.create': {
		riskLevel: 'destructive',
		description: 'Create builder API key',
	},
	'clob.builderApiKeys.list': {
		riskLevel: 'read',
		description: 'Get builder API keys',
	},
	'clob.builderApiKeys.revoke': {
		riskLevel: 'destructive',
		description: 'Revoke builder API key',
	},
	'clob.closedOnlyMode': {
		riskLevel: 'read',
		description: 'Get closed-only mode status',
	},
	'clob.feeRate.get': {
		riskLevel: 'read',
		description: 'Get fee rate',
	},
	'clob.feeRate.getByToken': {
		riskLevel: 'read',
		description: 'Get fee rate by path parameter',
	},
	'clob.heartbeats.send': {
		riskLevel: 'write',
		description: 'Send heartbeat',
	},
	'clob.heartbeats.sendV1': {
		riskLevel: 'write',
		description: 'Send heartbeat (v1)',
	},
	'clob.lastTradePrices.get': {
		riskLevel: 'read',
		description: 'Get last trade price',
	},
	'clob.lastTradePrices.list': {
		riskLevel: 'read',
		description: 'Get last trade prices (query parameters)',
	},
	'clob.lastTradePrices.listByBody': {
		riskLevel: 'read',
		description: 'Get last trade prices (request body)',
	},
	'clob.markets.get': {
		riskLevel: 'read',
		description: 'Get CLOB market info',
	},
	'clob.markets.getByToken': {
		riskLevel: 'read',
		description: 'Get market by token',
	},
	'clob.markets.listSampling': {
		riskLevel: 'read',
		description: 'Get sampling markets',
	},
	'clob.markets.listSamplingSimplified': {
		riskLevel: 'read',
		description: 'Get sampling simplified markets',
	},
	'clob.markets.listSimplified': {
		riskLevel: 'read',
		description: 'Get simplified markets',
	},
	'clob.markets.liveActivity': {
		riskLevel: 'read',
		description: 'Get live activity markets by condition IDs',
	},
	'clob.markets.liveActivityByCondition': {
		riskLevel: 'read',
		description: 'Get live activity market by condition ID',
	},
	'clob.midpoints.get': {
		riskLevel: 'read',
		description: 'Get midpoint price',
	},
	'clob.midpoints.list': {
		riskLevel: 'read',
		description: 'Get midpoint prices (query parameters)',
	},
	'clob.midpoints.listByBody': {
		riskLevel: 'read',
		description: 'Get midpoint prices (request body)',
	},
	'clob.negRisk.get': {
		riskLevel: 'read',
		description: 'Get negative risk flag',
	},
	'clob.negRisk.getByToken': {
		riskLevel: 'read',
		description: 'Get negative risk flag by path parameter',
	},
	'clob.notifications.list': {
		riskLevel: 'read',
		description: 'Get notifications',
	},
	'clob.notifications.markRead': {
		riskLevel: 'destructive',
		description: 'Mark notifications as read',
	},
	'clob.orderScoring.get': {
		riskLevel: 'read',
		description: 'Get order scoring status',
	},
	'clob.orderScoring.list': {
		riskLevel: 'read',
		description: 'Get scoring status for multiple orders',
	},
	'clob.orderScoring.listByBody': {
		riskLevel: 'read',
		description: 'Get scoring status for multiple orders (POST)',
	},
	'clob.orders.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel single order',
	},
	'clob.orders.cancelAll': {
		riskLevel: 'destructive',
		description: 'Cancel all orders',
	},
	'clob.orders.cancelMany': {
		riskLevel: 'destructive',
		description: 'Cancel multiple orders',
	},
	'clob.orders.cancelMarket': {
		riskLevel: 'destructive',
		description: 'Cancel orders for a market',
	},
	'clob.orders.cancelWallet': {
		riskLevel: 'destructive',
		description: 'Cancel wallet orders',
	},
	'clob.orders.create': {
		riskLevel: 'destructive',
		description: 'Post a new order',
	},
	'clob.orders.createMany': {
		riskLevel: 'destructive',
		description: 'Post multiple orders',
	},
	'clob.orders.get': {
		riskLevel: 'read',
		description: 'Get single order by ID',
	},
	'clob.orders.list': {
		riskLevel: 'read',
		description: 'Get user orders',
	},
	'clob.orders.listWalletOpen': {
		riskLevel: 'read',
		description: 'Get wallet open orders',
	},
	'clob.prices.get': {
		riskLevel: 'read',
		description: 'Get market price',
	},
	'clob.prices.list': {
		riskLevel: 'read',
		description: 'Get market prices (query parameters)',
	},
	'clob.prices.listByBody': {
		riskLevel: 'read',
		description: 'Get market prices (request body)',
	},
	'clob.pricesHistory.batch': {
		riskLevel: 'read',
		description: 'Get batch prices history',
	},
	'clob.pricesHistory.get': {
		riskLevel: 'read',
		description: 'Get prices history',
	},
	'clob.rateLimitTier': {
		riskLevel: 'read',
		description: 'Get rate limit tier',
	},
	'clob.rebates.current': {
		riskLevel: 'read',
		description: 'Get current rebated fees for a maker',
	},
	'clob.rewards.current': {
		riskLevel: 'read',
		description: 'Get current active rewards configurations',
	},
	'clob.rewards.market': {
		riskLevel: 'read',
		description: 'Get raw rewards for a specific market',
	},
	'clob.rewards.markets': {
		riskLevel: 'read',
		description: 'Get multiple markets with rewards',
	},
	'clob.rewards.userEarnings': {
		riskLevel: 'read',
		description: 'Get earnings for user by date',
	},
	'clob.rewards.userMarkets': {
		riskLevel: 'read',
		description: 'Get user earnings and markets configuration',
	},
	'clob.rewards.userPercentages': {
		riskLevel: 'read',
		description: 'Get reward percentages for user',
	},
	'clob.rewards.userTotalEarnings': {
		riskLevel: 'read',
		description: 'Get total earnings for user by date',
	},
	'clob.spreads.get': {
		riskLevel: 'read',
		description: 'Get spread',
	},
	'clob.spreads.list': {
		riskLevel: 'read',
		description: 'Get spreads',
	},
	'clob.tickSize.get': {
		riskLevel: 'read',
		description: 'Get tick size',
	},
	'clob.tickSize.getByToken': {
		riskLevel: 'read',
		description: 'Get tick size by path parameter',
	},
	'clob.time': {
		riskLevel: 'read',
		description: 'Get server time',
	},
	'clob.trades.list': {
		riskLevel: 'read',
		description: 'Get trades',
	},
	'clob.trades.listBuilder': {
		riskLevel: 'read',
		description: 'Get builder trades',
	},
	'combos.confirmations.submit': {
		riskLevel: 'destructive',
		description: 'Confirm or decline last look',
	},
	'combos.markets.list': {
		riskLevel: 'read',
		description: 'Get combo markets',
	},
	'combos.quotes.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel a quote',
	},
	'combos.quotes.submit': {
		riskLevel: 'destructive',
		description: 'Submit a quote',
	},
	'data.activity.combos': {
		riskLevel: 'read',
		description: 'List combo activity',
	},
	'data.activity.list': {
		riskLevel: 'read',
		description: 'List account activity',
	},
	'data.approvals': {
		riskLevel: 'read',
		description: 'Get wallet approvals',
	},
	'data.biggestWinners': {
		riskLevel: 'read',
		description: 'List the biggest wins',
	},
	'data.builders.leaderboard': {
		riskLevel: 'read',
		description: 'Get the builders leaderboard',
	},
	'data.builders.volume': {
		riskLevel: 'read',
		description: 'Get builder volume over time',
	},
	'data.holders': {
		riskLevel: 'read',
		description: "List a market's top holders",
	},
	'data.leaderboard': {
		riskLevel: 'read',
		description: 'Get the trader leaderboard',
	},
	'data.liveVolume': {
		riskLevel: 'read',
		description: 'Get live volume for an event',
	},
	'data.openInterest': {
		riskLevel: 'read',
		description: 'Get open interest',
	},
	'data.positions.combos': {
		riskLevel: 'read',
		description: 'List combo positions',
	},
	'data.positions.list': {
		riskLevel: 'read',
		description: 'List positions for a user or market',
	},
	'data.positions.snapshot': {
		riskLevel: 'read',
		description: "Snapshot a wallet's positions at the end of a day",
	},
	'data.pricesHistory': {
		riskLevel: 'read',
		description: "Get a token's price history",
	},
	'data.resolutions': {
		riskLevel: 'read',
		description: 'Get resolution state',
	},
	'data.status': {
		riskLevel: 'read',
		description: 'Get data freshness',
	},
	'data.tokens': {
		riskLevel: 'read',
		description: 'Look up tokens',
	},
	'data.trades': {
		riskLevel: 'read',
		description: 'List trades',
	},
	'data.users.pnl': {
		riskLevel: 'read',
		description: "Get a user's PnL series",
	},
	'data.users.stats': {
		riskLevel: 'read',
		description: "Get a user's profile stats",
	},
	'data.users.volume': {
		riskLevel: 'read',
		description: "Get a user's trading volume",
	},
	'data.value': {
		riskLevel: 'read',
		description: 'Get portfolio value',
	},
	'gamma.comments.get': {
		riskLevel: 'read',
		description: 'Get comment by ID',
	},
	'gamma.comments.list': {
		riskLevel: 'read',
		description: 'List comments',
	},
	'gamma.comments.listByUser': {
		riskLevel: 'read',
		description: 'List comments by user',
	},
	'gamma.comments.listKeyset': {
		riskLevel: 'read',
		description: 'List comments (keyset pagination)',
	},
	'gamma.cryptoMarketConfigs.list': {
		riskLevel: 'read',
		description: 'Get crypto market configs',
	},
	'gamma.events.commentCount': {
		riskLevel: 'read',
		description: 'Get event comment count',
	},
	'gamma.events.count': {
		riskLevel: 'read',
		description: 'Count events',
	},
	'gamma.events.creators.get': {
		riskLevel: 'read',
		description: 'Get event creator by ID',
	},
	'gamma.events.creators.list': {
		riskLevel: 'read',
		description: 'List event creators',
	},
	'gamma.events.externalPartners.get': {
		riskLevel: 'read',
		description: 'Get event external partner by slug',
	},
	'gamma.events.externalPartners.list': {
		riskLevel: 'read',
		description: 'Get event external partners',
	},
	'gamma.events.get': {
		riskLevel: 'read',
		description: 'Get event by ID',
	},
	'gamma.events.getByPartner': {
		riskLevel: 'read',
		description: 'Get event by external partner',
	},
	'gamma.events.getBySlug': {
		riskLevel: 'read',
		description: 'Get event by slug',
	},
	'gamma.events.insights': {
		riskLevel: 'read',
		description: 'Get event insights',
	},
	'gamma.events.list': {
		riskLevel: 'read',
		description: 'Get events',
	},
	'gamma.events.listKeyset': {
		riskLevel: 'read',
		description: 'Get events (keyset)',
	},
	'gamma.events.listPaginated': {
		riskLevel: 'read',
		description: 'Get events (paginated)',
	},
	'gamma.events.premadeCombos': {
		riskLevel: 'read',
		description: 'Get event premade combos',
	},
	'gamma.events.reference': {
		riskLevel: 'read',
		description: 'Get event reference by slug',
	},
	'gamma.events.similar': {
		riskLevel: 'read',
		description: 'Get similar events',
	},
	'gamma.events.sportResults': {
		riskLevel: 'read',
		description: 'Get sport event results',
	},
	'gamma.events.tags': {
		riskLevel: 'read',
		description: 'Get tags for an event',
	},
	'gamma.events.tweetCount': {
		riskLevel: 'read',
		description: 'Get event tweet count',
	},
	'gamma.facets.get': {
		riskLevel: 'read',
		description: 'Facet tree rooted at a facet',
	},
	'gamma.facets.list': {
		riskLevel: 'read',
		description: 'Facet tree from the top-level facets',
	},
	'gamma.feeTypes.events': {
		riskLevel: 'read',
		description: 'Get events by fee type',
	},
	'gamma.feeTypes.list': {
		riskLevel: 'read',
		description: 'Get fee types',
	},
	'gamma.games.get': {
		riskLevel: 'read',
		description: 'Get game',
	},
	'gamma.makerTiers.get': {
		riskLevel: 'read',
		description: 'Get maker tiers for addresses',
	},
	'gamma.makerTiers.ladder': {
		riskLevel: 'read',
		description: 'Get the maker tier ladder',
	},
	'gamma.marketClarifications.list': {
		riskLevel: 'read',
		description: 'Get market clarifications',
	},
	'gamma.marketEstimateHistory.list': {
		riskLevel: 'read',
		description: 'Get market estimate history',
	},
	'gamma.markets.description': {
		riskLevel: 'read',
		description: 'Get market description',
	},
	'gamma.markets.get': {
		riskLevel: 'read',
		description: 'Get market by ID',
	},
	'gamma.markets.getBySlug': {
		riskLevel: 'read',
		description: 'Get market by slug',
	},
	'gamma.markets.information': {
		riskLevel: 'read',
		description: 'Get markets information',
	},
	'gamma.markets.list': {
		riskLevel: 'read',
		description: 'Get markets',
	},
	'gamma.markets.listAbridged': {
		riskLevel: 'read',
		description: 'Get abridged markets',
	},
	'gamma.markets.listAbridgedKeyset': {
		riskLevel: 'read',
		description: 'Get abridged markets with keyset pagination',
	},
	'gamma.markets.listKeyset': {
		riskLevel: 'read',
		description: 'Get markets (keyset)',
	},
	'gamma.markets.related': {
		riskLevel: 'read',
		description: 'Get related markets',
	},
	'gamma.markets.tags': {
		riskLevel: 'read',
		description: 'Get tags for a market',
	},
	'gamma.moderators.list': {
		riskLevel: 'read',
		description: 'Get moderators',
	},
	'gamma.partners.get': {
		riskLevel: 'read',
		description: 'Get partner by ID',
	},
	'gamma.partners.list': {
		riskLevel: 'read',
		description: 'Get partners',
	},
	'gamma.profiles.get': {
		riskLevel: 'read',
		description: 'Get public profile',
	},
	'gamma.profiles.getByAddress': {
		riskLevel: 'read',
		description: 'Get public profile by user address',
	},
	'gamma.profiles.list': {
		riskLevel: 'read',
		description: 'Get public profiles for addresses',
	},
	'gamma.readyz': {
		riskLevel: 'read',
		description: 'Readiness check',
	},
	'gamma.referralLeaderboard': {
		riskLevel: 'read',
		description: 'Get referral leaderboard',
	},
	'gamma.search': {
		riskLevel: 'read',
		description: 'Public search',
	},
	'gamma.searchV2': {
		riskLevel: 'read',
		description: 'Public search (v2)',
	},
	'gamma.series.commentCount': {
		riskLevel: 'read',
		description: 'Get series comment count',
	},
	'gamma.series.get': {
		riskLevel: 'read',
		description: 'Get series by ID',
	},
	'gamma.series.list': {
		riskLevel: 'read',
		description: 'Get series',
	},
	'gamma.series.listKeyset': {
		riskLevel: 'read',
		description: 'Get series (keyset)',
	},
	'gamma.series.summary': {
		riskLevel: 'read',
		description: 'Get series summary by ID',
	},
	'gamma.series.summaryBySlug': {
		riskLevel: 'read',
		description: 'Get series summary by slug',
	},
	'gamma.sports.externalPartners.get': {
		riskLevel: 'read',
		description: 'Get sport external partner by slug',
	},
	'gamma.sports.externalPartners.list': {
		riskLevel: 'read',
		description: 'Get sport external partners',
	},
	'gamma.sports.get': {
		riskLevel: 'read',
		description: 'Get sport metadata by ID',
	},
	'gamma.sports.getByPartner': {
		riskLevel: 'read',
		description: 'Get sport by external partner',
	},
	'gamma.sports.list': {
		riskLevel: 'read',
		description: 'Get sports',
	},
	'gamma.sports.marketTypes': {
		riskLevel: 'read',
		description: 'Get sports market types',
	},
	'gamma.sports.premadeCombos': {
		riskLevel: 'read',
		description: 'Get league premade combos',
	},
	'gamma.sports.summary': {
		riskLevel: 'read',
		description: 'Get sports summary',
	},
	'gamma.status': {
		riskLevel: 'read',
		description: 'Get status',
	},
	'gamma.tags.get': {
		riskLevel: 'read',
		description: 'Get tag by ID',
	},
	'gamma.tags.getBySlug': {
		riskLevel: 'read',
		description: 'Get tag by slug',
	},
	'gamma.tags.list': {
		riskLevel: 'read',
		description: 'List tags',
	},
	'gamma.tags.related': {
		riskLevel: 'read',
		description: 'Get tags related to a tag',
	},
	'gamma.tags.relatedBySlug': {
		riskLevel: 'read',
		description: 'Get tags related to a tag by slug',
	},
	'gamma.tags.relations': {
		riskLevel: 'read',
		description: 'Get related tags (raw relation rows)',
	},
	'gamma.tags.relationsBySlug': {
		riskLevel: 'read',
		description: 'Get related tags by slug (raw relation rows)',
	},
	'gamma.takerTiers.get': {
		riskLevel: 'read',
		description: 'Get taker tiers for addresses',
	},
	'gamma.takerTiers.ladder': {
		riskLevel: 'read',
		description: 'Get the taker tier ladder',
	},
	'gamma.teams.externalPartners.get': {
		riskLevel: 'read',
		description: 'Get team external partner by slug',
	},
	'gamma.teams.externalPartners.list': {
		riskLevel: 'read',
		description: 'Get team external partners',
	},
	'gamma.teams.get': {
		riskLevel: 'read',
		description: 'Get team by ID',
	},
	'gamma.teams.getByPartner': {
		riskLevel: 'read',
		description: 'Get team by external partner',
	},
	'gamma.teams.list': {
		riskLevel: 'read',
		description: 'Get teams',
	},
	'gamma.terms.current': {
		riskLevel: 'read',
		description: 'Get the current ToS',
	},
	'gamma.tournaments.get': {
		riskLevel: 'read',
		description: 'Get tournament by ID',
	},
	'gamma.tournaments.list': {
		riskLevel: 'read',
		description: 'Get tournaments',
	},
	'gamma.walletType': {
		riskLevel: 'read',
		description: 'Get wallet type',
	},
	'perps.account.applyReferral': {
		riskLevel: 'write',
		description: 'Apply Referral Code',
	},
	'perps.account.approveBuilder': {
		riskLevel: 'destructive',
		description:
			'Approve or revoke builder fees with an account owner signature',
	},
	'perps.account.autoCancel': {
		riskLevel: 'read',
		description: 'Get Auto-Cancel Status',
	},
	'perps.account.backstops': {
		riskLevel: 'read',
		description: 'Get Account Backstop Transfers',
	},
	'perps.account.balances': {
		riskLevel: 'read',
		description: 'Get Balances',
	},
	'perps.account.builderApprovals': {
		riskLevel: 'read',
		description: 'Read builder approvals, including retained revoked versions',
	},
	'perps.account.builderEarnings': {
		riskLevel: 'read',
		description: 'Get authenticated builder receipts',
	},
	'perps.account.builderEarningsSummary': {
		riskLevel: 'read',
		description: 'Get authenticated builder settled earnings summary',
	},
	'perps.account.config': {
		riskLevel: 'read',
		description: 'Get Instrument Config',
	},
	'perps.account.createInvite': {
		riskLevel: 'write',
		description: 'Create Account Invite',
	},
	'perps.account.credentials': {
		riskLevel: 'read',
		description: 'Get Credentials',
	},
	'perps.account.deposits': {
		riskLevel: 'read',
		description: 'Get Deposits',
	},
	'perps.account.equity': {
		riskLevel: 'read',
		description: 'Get Equity',
	},
	'perps.account.fills': {
		riskLevel: 'read',
		description: 'Get Fills',
	},
	'perps.account.funding': {
		riskLevel: 'read',
		description: 'Get Funding Charges',
	},
	'perps.account.internalTransfer': {
		riskLevel: 'destructive',
		description: 'Internal Transfer',
	},
	'perps.account.internalTransfers': {
		riskLevel: 'read',
		description: 'Get Internal Transfers',
	},
	'perps.account.limits': {
		riskLevel: 'read',
		description: 'Get Account Limits',
	},
	'perps.account.markNotificationsRead': {
		riskLevel: 'write',
		description: 'Mark Notifications Read',
	},
	'perps.account.notifications': {
		riskLevel: 'read',
		description: 'Get Notifications',
	},
	'perps.account.openOrders': {
		riskLevel: 'read',
		description: 'Get Open Orders',
	},
	'perps.account.orders': {
		riskLevel: 'read',
		description: 'Get Orders',
	},
	'perps.account.pnl': {
		riskLevel: 'read',
		description: 'Get PnL',
	},
	'perps.account.portfolio': {
		riskLevel: 'read',
		description: 'Get Portfolio',
	},
	'perps.account.referral': {
		riskLevel: 'read',
		description: 'Get Account Referral',
	},
	'perps.account.rewards': {
		riskLevel: 'read',
		description: 'Get Account Rewards',
	},
	'perps.account.stats': {
		riskLevel: 'read',
		description: 'Get Account Stats',
	},
	'perps.account.updateBuilder': {
		riskLevel: 'write',
		description: 'Update your builder display name',
	},
	'perps.account.withdraw': {
		riskLevel: 'destructive',
		description: 'Withdraw',
	},
	'perps.account.withdrawals': {
		riskLevel: 'read',
		description: 'Get Withdrawals',
	},
	'perps.assets': {
		riskLevel: 'read',
		description: 'Get Collateral Assets',
	},
	'perps.bbo': {
		riskLevel: 'read',
		description: 'Get BBO',
	},
	'perps.blp.enroll': {
		riskLevel: 'destructive',
		description: 'Set BLP Instrument Subscription',
	},
	'perps.blp.enrollment': {
		riskLevel: 'read',
		description: 'Get BLP Enrollment',
	},
	'perps.blp.liquidations': {
		riskLevel: 'read',
		description: 'List BLP Liquidations',
	},
	'perps.book': {
		riskLevel: 'read',
		description: 'Get Book',
	},
	'perps.builder': {
		riskLevel: 'read',
		description: 'Get builder profile and eligibility',
	},
	'perps.competitions.account': {
		riskLevel: 'read',
		description: 'Get Trading Competition Account',
	},
	'perps.competitions.get': {
		riskLevel: 'read',
		description: 'Get Trading Competition',
	},
	'perps.competitions.leaderboard': {
		riskLevel: 'read',
		description: 'Get Trading Competition Leaderboard',
	},
	'perps.competitions.list': {
		riskLevel: 'read',
		description: 'Get Trading Competitions',
	},
	'perps.competitions.widget': {
		riskLevel: 'read',
		description: 'Get Trading Competition Widget',
	},
	'perps.exchange': {
		riskLevel: 'read',
		description: 'Get Exchange Info',
	},
	'perps.exchangeStatistics': {
		riskLevel: 'read',
		description: 'Get Exchange Statistics',
	},
	'perps.fees': {
		riskLevel: 'read',
		description: 'Get Fees',
	},
	'perps.fundingHistory': {
		riskLevel: 'read',
		description: 'Get Historical Funding',
	},
	'perps.index': {
		riskLevel: 'read',
		description: 'Get Index',
	},
	'perps.instruments': {
		riskLevel: 'read',
		description: 'Get Instruments',
	},
	'perps.inviteCode': {
		riskLevel: 'read',
		description: 'Check Invite Code',
	},
	'perps.klines': {
		riskLevel: 'read',
		description: 'Get Klines',
	},
	'perps.leaderboard': {
		riskLevel: 'read',
		description: 'Get Leaderboard',
	},
	'perps.leverage.update': {
		riskLevel: 'destructive',
		description: 'Update Leverage',
	},
	'perps.leverage.updateMany': {
		riskLevel: 'destructive',
		description: 'Update Leverage for Multiple Instruments',
	},
	'perps.limitTiers': {
		riskLevel: 'read',
		description: 'Get Limit Tiers',
	},
	'perps.margin.update': {
		riskLevel: 'destructive',
		description: 'Update Isolated Margin',
	},
	'perps.markHistory': {
		riskLevel: 'read',
		description: 'Get Mark Price History',
	},
	'perps.orders.cancel': {
		riskLevel: 'destructive',
		description: 'Cancel Orders',
	},
	'perps.orders.cancelAll': {
		riskLevel: 'destructive',
		description: 'Cancel All Orders',
	},
	'perps.orders.cancelByClientId': {
		riskLevel: 'destructive',
		description: 'Cancel Orders COID',
	},
	'perps.orders.create': {
		riskLevel: 'destructive',
		description: 'Create Orders',
	},
	'perps.orders.modify': {
		riskLevel: 'destructive',
		description: 'Modify Orders',
	},
	'perps.orders.modifyByClientId': {
		riskLevel: 'destructive',
		description: 'Modify Orders COID',
	},
	'perps.orders.setAutoCancel': {
		riskLevel: 'write',
		description: 'Set Auto-Cancel',
	},
	'perps.ping': {
		riskLevel: 'read',
		description: 'Test Connection',
	},
	'perps.proxy.create': {
		riskLevel: 'destructive',
		description: 'Create Proxy',
	},
	'perps.proxy.delete': {
		riskLevel: 'destructive',
		description: 'Delete Proxy',
	},
	'perps.public.fills': {
		riskLevel: 'read',
		description: 'Get Public Fills',
	},
	'perps.public.portfolio': {
		riskLevel: 'read',
		description: 'Get Public Portfolio',
	},
	'perps.public.positionFills': {
		riskLevel: 'read',
		description: 'Get Current Position Fills',
	},
	'perps.public.positionSnapshots': {
		riskLevel: 'read',
		description: 'Get Position Share Card Snapshots',
	},
	'perps.registered': {
		riskLevel: 'read',
		description: 'Get Registration',
	},
	'perps.statistics': {
		riskLevel: 'read',
		description: 'Get Statistics',
	},
	'perps.tickers': {
		riskLevel: 'read',
		description: 'Get Tickers',
	},
	'perps.time': {
		riskLevel: 'read',
		description: 'Get Server Time',
	},
	'perps.trades': {
		riskLevel: 'read',
		description: 'Get Recent Trades',
	},
	'relayer.apiKeys.list': {
		riskLevel: 'read',
		description: 'Get all relayer API keys',
	},
	'relayer.deployed': {
		riskLevel: 'read',
		description: 'Check if a wallet is deployed',
	},
	'relayer.nonce': {
		riskLevel: 'read',
		description: 'Get current nonce for a user',
	},
	'relayer.relayPayload': {
		riskLevel: 'read',
		description: 'Get relayer address and nonce',
	},
	'relayer.transactions.get': {
		riskLevel: 'read',
		description: 'Get a transaction by ID',
	},
	'relayer.transactions.list': {
		riskLevel: 'read',
		description: 'Get recent transactions for a user',
	},
	'relayer.transactions.submit': {
		riskLevel: 'destructive',
		description: 'Submit a transaction',
	},
	'rfq.health': {
		riskLevel: 'read',
		description: 'Liveness probe',
	},
	'rfq.priceBand': {
		riskLevel: 'read',
		description: "Get a market's price band",
	},
	'rfq.ready': {
		riskLevel: 'read',
		description: 'Readiness probe',
	},
	'rfq.time': {
		riskLevel: 'read',
		description: 'Get the server clock',
	},
	'rfq.trades.get': {
		riskLevel: 'read',
		description: "Get a trade's status",
	},
	'rfq.trades.prepare': {
		riskLevel: 'write',
		description: 'Build both orders to sign',
	},
	'rfq.trades.submit': {
		riskLevel: 'destructive',
		description: 'Submit a signed RFQ trade',
	},
	'rfq.trades.validate': {
		riskLevel: 'read',
		description: 'Pre-flight proposed terms',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof polymarketEndpointsNested
>;
