import type {
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
import { Aggregates, MarketOperations, Snapshots, Tickers } from './endpoints';
import type {
	PolygonioEndpointInputs,
	PolygonioEndpointOutputs,
} from './endpoints/types';
import {
	PolygonioEndpointInputSchemas,
	PolygonioEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PolygonioSchema } from './schema';

export const polygonioAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type PolygonioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** The key from the dashboard. Overrides the stored `api_key`. */
	key?: string;
	hooks?: InternalPolygonioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof polygonioEndpointsNested>;
};

export type PolygonioContext = CorsairPluginContext<
	typeof PolygonioSchema,
	PolygonioPluginOptions,
	undefined,
	typeof polygonioAuthConfig
>;

export type PolygonioKeyBuilderContext = KeyBuilderContext<
	PolygonioPluginOptions,
	typeof polygonioAuthConfig
>;

export type PolygonioBoundEndpoints = BindEndpoints<
	typeof polygonioEndpointsNested
>;

type PolygonioEndpoint<K extends keyof PolygonioEndpointOutputs> =
	CorsairEndpoint<
		PolygonioContext,
		PolygonioEndpointInputs[K],
		PolygonioEndpointOutputs[K]
	>;

export type PolygonioEndpoints = {
	bars: PolygonioEndpoint<'bars'>;
	previousDay: PolygonioEndpoint<'previousDay'>;
	dailySummary: PolygonioEndpoint<'dailySummary'>;
	marketSummary: PolygonioEndpoint<'marketSummary'>;
	snapshot: PolygonioEndpoint<'snapshot'>;
	movers: PolygonioEndpoint<'movers'>;
	tickersList: PolygonioEndpoint<'tickersList'>;
	tickerOverview: PolygonioEndpoint<'tickerOverview'>;
	tickerTypes: PolygonioEndpoint<'tickerTypes'>;
	marketStatus: PolygonioEndpoint<'marketStatus'>;
	marketHolidays: PolygonioEndpoint<'marketHolidays'>;
	exchanges: PolygonioEndpoint<'exchanges'>;
};

const polygonioEndpointsNested = {
	aggregates: {
		bars: Aggregates.bars,
		previousDay: Aggregates.previousDay,
		dailySummary: Aggregates.dailySummary,
		marketSummary: Aggregates.marketSummary,
	},
	snapshots: {
		snapshot: Snapshots.snapshot,
		movers: Snapshots.movers,
	},
	tickers: {
		list: Tickers.list,
		overview: Tickers.overview,
		types: Tickers.types,
	},
	market: {
		status: MarketOperations.status,
		holidays: MarketOperations.holidays,
		exchanges: MarketOperations.exchanges,
	},
} as const;

export const polygonioEndpointSchemas = {
	'aggregates.bars': {
		input: PolygonioEndpointInputSchemas.bars,
		output: PolygonioEndpointOutputSchemas.bars,
	},
	'aggregates.previousDay': {
		input: PolygonioEndpointInputSchemas.previousDay,
		output: PolygonioEndpointOutputSchemas.previousDay,
	},
	'aggregates.dailySummary': {
		input: PolygonioEndpointInputSchemas.dailySummary,
		output: PolygonioEndpointOutputSchemas.dailySummary,
	},
	'aggregates.marketSummary': {
		input: PolygonioEndpointInputSchemas.marketSummary,
		output: PolygonioEndpointOutputSchemas.marketSummary,
	},
	'snapshots.snapshot': {
		input: PolygonioEndpointInputSchemas.snapshot,
		output: PolygonioEndpointOutputSchemas.snapshot,
	},
	'snapshots.movers': {
		input: PolygonioEndpointInputSchemas.movers,
		output: PolygonioEndpointOutputSchemas.movers,
	},
	'tickers.list': {
		input: PolygonioEndpointInputSchemas.tickersList,
		output: PolygonioEndpointOutputSchemas.tickersList,
	},
	'tickers.overview': {
		input: PolygonioEndpointInputSchemas.tickerOverview,
		output: PolygonioEndpointOutputSchemas.tickerOverview,
	},
	'tickers.types': {
		input: PolygonioEndpointInputSchemas.tickerTypes,
		output: PolygonioEndpointOutputSchemas.tickerTypes,
	},
	'market.status': {
		input: PolygonioEndpointInputSchemas.marketStatus,
		output: PolygonioEndpointOutputSchemas.marketStatus,
	},
	'market.holidays': {
		input: PolygonioEndpointInputSchemas.marketHolidays,
		output: PolygonioEndpointOutputSchemas.marketHolidays,
	},
	'market.exchanges': {
		input: PolygonioEndpointInputSchemas.exchanges,
		output: PolygonioEndpointOutputSchemas.exchanges,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof polygonioEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const polygonioEndpointMeta = {
	'aggregates.bars': {
		riskLevel: 'read',
		description:
			'Read historical OHLC and volume bars for a ticker over a custom range and window size, with `next_url` paging',
	},
	'aggregates.previousDay': {
		riskLevel: 'read',
		description:
			"Read the previous trading day's open, high, low, close and volume",
	},
	'aggregates.dailySummary': {
		riskLevel: 'read',
		description:
			"Read one ticker's open and close for a date, with any pre-market and after-hours prices",
	},
	'aggregates.marketSummary': {
		riskLevel: 'read',
		description:
			"Read every US stock's OHLC and volume for one trading date, in a single page",
	},
	'snapshots.snapshot': {
		riskLevel: 'read',
		description:
			"Read a ticker's latest snapshot: last day and minute bars, previous day, and the change so far today",
	},
	'snapshots.movers': {
		riskLevel: 'read',
		description: 'Read the top 20 gainers or losers in the US stock market',
	},
	'tickers.list': {
		riskLevel: 'read',
		description:
			'List ticker symbols filtered by type, market, exchange, CUSIP, CIK or name, with `next_url` paging',
	},
	'tickers.overview': {
		riskLevel: 'read',
		description:
			'Read one ticker with its company details, optionally as it was on a given date',
	},
	'tickers.types': {
		riskLevel: 'read',
		description: 'List the ticker type codes, which `tickers.list` filters on',
	},
	'market.status': {
		riskLevel: 'read',
		description:
			'Read the current trading status of the US exchanges, currency markets and index groups',
	},
	'market.holidays': {
		riskLevel: 'read',
		description:
			'Read upcoming market holidays with their closed or early-close hours',
	},
	'market.exchanges': {
		riskLevel: 'read',
		description:
			'List the known exchanges with their MICs, names and asset classes',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof polygonioEndpointsNested
>;

export type BasePolygonioPlugin<T extends PolygonioPluginOptions> =
	CorsairPlugin<
		'polygonio',
		typeof PolygonioSchema,
		typeof polygonioEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof polygonioAuthConfig
	>;

export type InternalPolygonioPlugin =
	BasePolygonioPlugin<PolygonioPluginOptions>;

export type ExternalPolygonioPlugin<T extends PolygonioPluginOptions> =
	BasePolygonioPlugin<T>;

export function polygonio<const T extends PolygonioPluginOptions>(
	incomingOptions: PolygonioPluginOptions & T = {} as PolygonioPluginOptions &
		T,
): ExternalPolygonioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'polygonio',
		authConfig: polygonioAuthConfig,
		schema: PolygonioSchema,
		options,
		hooks: options.hooks,
		endpoints: polygonioEndpointsNested,
		webhooks: {},
		endpointMeta: polygonioEndpointMeta,
		endpointSchemas: polygonioEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PolygonioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('polygonio', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPolygonioPlugin;
}

export { PolygonioAPIError } from './client';
export type {
	BarsInput,
	BarsOutput,
	DailySummaryInput,
	DailySummaryOutput,
	ExchangesInput,
	ExchangesOutput,
	MarketHolidaysInput,
	MarketHolidaysOutput,
	MarketStatusInput,
	MarketStatusOutput,
	MarketSummaryInput,
	MoversInput,
	MoversOutput,
	PolygonioAggregateBar,
	PolygonioEndpointInputs,
	PolygonioEndpointOutputs,
	PolygonioExchange,
	PolygonioMarketHoliday,
	PolygonioSnapshotTicker,
	PolygonioTicker,
	PolygonioTickerDetails,
	PolygonioTickerType,
	PreviousDayInput,
	SnapshotInput,
	SnapshotOutput,
	TickerOverviewInput,
	TickerOverviewOutput,
	TickersListInput,
	TickersListOutput,
	TickerTypesInput,
	TickerTypesOutput,
} from './endpoints/types';
