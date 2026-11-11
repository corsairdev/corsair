import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { KalshiEnvironment } from './client';
import { serializeKalshiCredentials } from './client';
import {
	Events,
	Exchange,
	Markets,
	Orders,
	Portfolio,
	Series,
} from './endpoints';
import type {
	KalshiEndpointInputs,
	KalshiEndpointOutputs,
} from './endpoints/types';
import {
	KalshiEndpointInputSchemas,
	KalshiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { KalshiSchema } from './schema';

export type KalshiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Kalshi API key ID (a UUID). */
	keyId?: string;
	/** RSA or Ed25519 private key in PEM format. */
	privateKey?: string;
	/**
	 * Which Kalshi environment to call. Use `demo` to try order endpoints with
	 * play money; `production` places real orders. Defaults to `production`.
	 */
	environment?: KalshiEnvironment;
	hooks?: InternalKalshiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kalshiEndpointsNested>;
};

export type KalshiContext = CorsairPluginContext<
	typeof KalshiSchema,
	KalshiPluginOptions,
	undefined,
	typeof kalshiAuthConfig
>;

export type KalshiKeyBuilderContext = KeyBuilderContext<
	KalshiPluginOptions,
	typeof kalshiAuthConfig
>;

export type KalshiBoundEndpoints = BindEndpoints<typeof kalshiEndpointsNested>;

type KalshiEndpoint<K extends keyof KalshiEndpointOutputs> = CorsairEndpoint<
	KalshiContext,
	KalshiEndpointInputs[K],
	KalshiEndpointOutputs[K]
>;

export type KalshiEndpoints = {
	exchangeStatus: KalshiEndpoint<'exchangeStatus'>;
	exchangeSchedule: KalshiEndpoint<'exchangeSchedule'>;
	marketsList: KalshiEndpoint<'marketsList'>;
	marketsGet: KalshiEndpoint<'marketsGet'>;
	marketsOrderbook: KalshiEndpoint<'marketsOrderbook'>;
	marketsTrades: KalshiEndpoint<'marketsTrades'>;
	eventsList: KalshiEndpoint<'eventsList'>;
	eventsGet: KalshiEndpoint<'eventsGet'>;
	seriesList: KalshiEndpoint<'seriesList'>;
	seriesGet: KalshiEndpoint<'seriesGet'>;
	portfolioBalance: KalshiEndpoint<'portfolioBalance'>;
	portfolioPositions: KalshiEndpoint<'portfolioPositions'>;
	portfolioFills: KalshiEndpoint<'portfolioFills'>;
	portfolioSettlements: KalshiEndpoint<'portfolioSettlements'>;
	ordersList: KalshiEndpoint<'ordersList'>;
	ordersGet: KalshiEndpoint<'ordersGet'>;
	ordersCreate: KalshiEndpoint<'ordersCreate'>;
	ordersAmend: KalshiEndpoint<'ordersAmend'>;
	ordersCancel: KalshiEndpoint<'ordersCancel'>;
	ordersBatchCreate: KalshiEndpoint<'ordersBatchCreate'>;
};

const kalshiEndpointsNested = {
	exchange: {
		status: Exchange.status,
		schedule: Exchange.schedule,
	},
	markets: {
		list: Markets.list,
		get: Markets.get,
		orderbook: Markets.orderbook,
		trades: Markets.trades,
	},
	events: {
		list: Events.list,
		get: Events.get,
	},
	series: {
		list: Series.list,
		get: Series.get,
	},
	portfolio: {
		balance: Portfolio.balance,
		positions: Portfolio.positions,
		fills: Portfolio.fills,
		settlements: Portfolio.settlements,
	},
	orders: {
		list: Orders.list,
		get: Orders.get,
		create: Orders.create,
		amend: Orders.amend,
		cancel: Orders.cancel,
		batchCreate: Orders.batchCreate,
	},
} as const;

export const kalshiEndpointSchemas = {
	'exchange.status': {
		input: KalshiEndpointInputSchemas.exchangeStatus,
		output: KalshiEndpointOutputSchemas.exchangeStatus,
	},
	'exchange.schedule': {
		input: KalshiEndpointInputSchemas.exchangeSchedule,
		output: KalshiEndpointOutputSchemas.exchangeSchedule,
	},
	'markets.list': {
		input: KalshiEndpointInputSchemas.marketsList,
		output: KalshiEndpointOutputSchemas.marketsList,
	},
	'markets.get': {
		input: KalshiEndpointInputSchemas.marketsGet,
		output: KalshiEndpointOutputSchemas.marketsGet,
	},
	'markets.orderbook': {
		input: KalshiEndpointInputSchemas.marketsOrderbook,
		output: KalshiEndpointOutputSchemas.marketsOrderbook,
	},
	'markets.trades': {
		input: KalshiEndpointInputSchemas.marketsTrades,
		output: KalshiEndpointOutputSchemas.marketsTrades,
	},
	'events.list': {
		input: KalshiEndpointInputSchemas.eventsList,
		output: KalshiEndpointOutputSchemas.eventsList,
	},
	'events.get': {
		input: KalshiEndpointInputSchemas.eventsGet,
		output: KalshiEndpointOutputSchemas.eventsGet,
	},
	'series.list': {
		input: KalshiEndpointInputSchemas.seriesList,
		output: KalshiEndpointOutputSchemas.seriesList,
	},
	'series.get': {
		input: KalshiEndpointInputSchemas.seriesGet,
		output: KalshiEndpointOutputSchemas.seriesGet,
	},
	'portfolio.balance': {
		input: KalshiEndpointInputSchemas.portfolioBalance,
		output: KalshiEndpointOutputSchemas.portfolioBalance,
	},
	'portfolio.positions': {
		input: KalshiEndpointInputSchemas.portfolioPositions,
		output: KalshiEndpointOutputSchemas.portfolioPositions,
	},
	'portfolio.fills': {
		input: KalshiEndpointInputSchemas.portfolioFills,
		output: KalshiEndpointOutputSchemas.portfolioFills,
	},
	'portfolio.settlements': {
		input: KalshiEndpointInputSchemas.portfolioSettlements,
		output: KalshiEndpointOutputSchemas.portfolioSettlements,
	},
	'orders.list': {
		input: KalshiEndpointInputSchemas.ordersList,
		output: KalshiEndpointOutputSchemas.ordersList,
	},
	'orders.get': {
		input: KalshiEndpointInputSchemas.ordersGet,
		output: KalshiEndpointOutputSchemas.ordersGet,
	},
	'orders.create': {
		input: KalshiEndpointInputSchemas.ordersCreate,
		output: KalshiEndpointOutputSchemas.ordersCreate,
	},
	'orders.amend': {
		input: KalshiEndpointInputSchemas.ordersAmend,
		output: KalshiEndpointOutputSchemas.ordersAmend,
	},
	'orders.cancel': {
		input: KalshiEndpointInputSchemas.ordersCancel,
		output: KalshiEndpointOutputSchemas.ordersCancel,
	},
	'orders.batchCreate': {
		input: KalshiEndpointInputSchemas.ordersBatchCreate,
		output: KalshiEndpointOutputSchemas.ordersBatchCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof kalshiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const kalshiEndpointMeta = {
	'exchange.status': {
		riskLevel: 'read',
		description: 'Get whether the exchange and trading are currently active',
	},
	'exchange.schedule': {
		riskLevel: 'read',
		description: 'Get the exchange trading schedule and maintenance windows',
	},
	'markets.list': {
		riskLevel: 'read',
		description: 'List markets with filters and cursor pagination',
	},
	'markets.get': {
		riskLevel: 'read',
		description: 'Get a market by ticker, including its price ranges',
	},
	'markets.orderbook': {
		riskLevel: 'read',
		description: 'Get the order book for a market',
	},
	'markets.trades': {
		riskLevel: 'read',
		description: 'List recent trades, optionally for one market',
	},
	'events.list': {
		riskLevel: 'read',
		description: 'List events with filters and cursor pagination',
	},
	'events.get': {
		riskLevel: 'read',
		description: 'Get an event by ticker',
	},
	'series.list': {
		riskLevel: 'read',
		description: 'List event series, optionally by category or tags',
	},
	'series.get': {
		riskLevel: 'read',
		description: 'Get a series by ticker',
	},
	'portfolio.balance': {
		riskLevel: 'read',
		description: 'Get the account balance and portfolio value',
	},
	'portfolio.positions': {
		riskLevel: 'read',
		description: 'List open market and event positions',
	},
	'portfolio.fills': {
		riskLevel: 'read',
		description: 'List order fills for the account',
	},
	'portfolio.settlements': {
		riskLevel: 'read',
		description: 'List settled positions for the account',
	},
	'orders.list': {
		riskLevel: 'read',
		description: 'List orders, optionally filtered by status or market',
	},
	'orders.get': {
		riskLevel: 'read',
		description: 'Get a single order by ID',
	},
	'orders.create': {
		riskLevel: 'write',
		description:
			'Place an order. Spends real money when the environment is production',
	},
	'orders.amend': {
		riskLevel: 'write',
		description: "Change an existing order's price or size",
	},
	'orders.cancel': {
		riskLevel: 'write',
		description: "Cancel a resting order's remaining contracts",
	},
	'orders.batchCreate': {
		riskLevel: 'write',
		description:
			'Place several orders in one request. Spends real money when the environment is production',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kalshiEndpointsNested>;

export const kalshiAuthConfig = {
	api_key: {
		// `api_key` holds the key ID; the PEM private key is a second field.
		account: ['private_key'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseKalshiPlugin<T extends KalshiPluginOptions> = CorsairPlugin<
	'kalshi',
	typeof KalshiSchema,
	typeof kalshiEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof kalshiAuthConfig
>;

export type InternalKalshiPlugin = BaseKalshiPlugin<KalshiPluginOptions>;

export type ExternalKalshiPlugin<T extends KalshiPluginOptions> =
	BaseKalshiPlugin<T>;

export function kalshi<const T extends KalshiPluginOptions>(
	incomingOptions: KalshiPluginOptions & T = {} as KalshiPluginOptions & T,
): ExternalKalshiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kalshi',
		authConfig: kalshiAuthConfig,
		schema: KalshiSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: kalshiEndpointsNested,
		webhooks: {} as const,
		endpointMeta: kalshiEndpointMeta,
		endpointSchemas: kalshiEndpointSchemas,
		webhookSchemas: {} as const,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: KalshiKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('kalshi', 'api_key');
			}

			const environment = options.environment ?? 'production';

			if (options.keyId && options.privateKey) {
				return serializeKalshiCredentials({
					keyId: options.keyId,
					privateKey: options.privateKey,
					environment,
				});
			}

			if (ctx.authType === 'api_key') {
				const [keyId, privateKey] = await Promise.all([
					ctx.keys.get_api_key(),
					ctx.keys.get_private_key(),
				]);
				if (!keyId || !privateKey) {
					throw new AuthMissingError('kalshi', 'api_key');
				}
				return serializeKalshiCredentials({ keyId, privateKey, environment });
			}

			throw new AuthMissingError('kalshi', 'api_key');
		},
	} satisfies InternalKalshiPlugin;
}

export type {
	EventsGetInput,
	EventsGetResponse,
	EventsListInput,
	EventsListResponse,
	ExchangeScheduleInput,
	ExchangeScheduleResponse,
	ExchangeStatusInput,
	ExchangeStatusResponse,
	KalshiEndpointInputs,
	KalshiEndpointOutputs,
	MarketsGetInput,
	MarketsGetResponse,
	MarketsListInput,
	MarketsListResponse,
	MarketsOrderbookInput,
	MarketsOrderbookResponse,
	MarketsTradesInput,
	MarketsTradesResponse,
	OrdersAmendInput,
	OrdersAmendResponse,
	OrdersBatchCreateInput,
	OrdersBatchCreateResponse,
	OrdersCancelInput,
	OrdersCancelResponse,
	OrdersCreateInput,
	OrdersCreateResponse,
	OrdersGetInput,
	OrdersGetResponse,
	OrdersListInput,
	OrdersListResponse,
	PortfolioBalanceInput,
	PortfolioBalanceResponse,
	PortfolioFillsInput,
	PortfolioFillsResponse,
	PortfolioPositionsInput,
	PortfolioPositionsResponse,
	PortfolioSettlementsInput,
	PortfolioSettlementsResponse,
	SeriesGetInput,
	SeriesGetResponse,
	SeriesListInput,
	SeriesListResponse,
} from './endpoints/types';
