import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	IndicatorsEndpoints,
	MarketEndpoints,
	ReferenceEndpoints,
} from './endpoints';
import type {
	TwelveDataEndpointInputs,
	TwelveDataEndpointOutputs,
} from './endpoints/types';
import {
	TwelveDataEndpointInputSchemas,
	TwelveDataEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { TwelveDataSchema } from './schema';

export type TwelveDataPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTwelveDataPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof twelvedataEndpointsNested>;
};

export type TwelveDataContext = CorsairPluginContext<
	typeof TwelveDataSchema,
	TwelveDataPluginOptions
>;

export type TwelveDataKeyBuilderContext =
	KeyBuilderContext<TwelveDataPluginOptions>;

export type TwelveDataBoundEndpoints = BindEndpoints<
	typeof twelvedataEndpointsNested
>;

type TwelveDataEndpoint<K extends keyof TwelveDataEndpointOutputs> =
	CorsairEndpoint<
		TwelveDataContext,
		TwelveDataEndpointInputs[K],
		TwelveDataEndpointOutputs[K]
	>;

export type TwelveDataEndpoints = {
	quote: TwelveDataEndpoint<'quote'>;
	price: TwelveDataEndpoint<'price'>;
	timeSeries: TwelveDataEndpoint<'timeSeries'>;
	exchangeRate: TwelveDataEndpoint<'exchangeRate'>;
	apiUsage: TwelveDataEndpoint<'apiUsage'>;
	stocksList: TwelveDataEndpoint<'listStocks'>;
	forexPairsList: TwelveDataEndpoint<'listForexPairs'>;
	cryptocurrenciesList: TwelveDataEndpoint<'listCryptocurrencies'>;
	exchangesList: TwelveDataEndpoint<'listExchanges'>;
	etfList: TwelveDataEndpoint<'listEtf'>;
	fundsList: TwelveDataEndpoint<'listFunds'>;
	bondsList: TwelveDataEndpoint<'listBonds'>;
	rsi: TwelveDataEndpoint<'rsi'>;
	macd: TwelveDataEndpoint<'macd'>;
	sma: TwelveDataEndpoint<'sma'>;
	ema: TwelveDataEndpoint<'ema'>;
	bbands: TwelveDataEndpoint<'bbands'>;
	stoch: TwelveDataEndpoint<'stoch'>;
	atr: TwelveDataEndpoint<'atr'>;
	adx: TwelveDataEndpoint<'adx'>;
	cci: TwelveDataEndpoint<'cci'>;
	willr: TwelveDataEndpoint<'willr'>;
	mfi: TwelveDataEndpoint<'mfi'>;
	roc: TwelveDataEndpoint<'roc'>;
	supertrend: TwelveDataEndpoint<'supertrend'>;
	apo: TwelveDataEndpoint<'apo'>;
	ppo: TwelveDataEndpoint<'ppo'>;
	stochrsi: TwelveDataEndpoint<'stochrsi'>;
	ultosc: TwelveDataEndpoint<'ultosc'>;
	wma: TwelveDataEndpoint<'wma'>;
	min: TwelveDataEndpoint<'min'>;
	max: TwelveDataEndpoint<'max'>;
	stddev: TwelveDataEndpoint<'stddev'>;
	beta: TwelveDataEndpoint<'beta'>;
	correl: TwelveDataEndpoint<'correl'>;
	tsf: TwelveDataEndpoint<'tsf'>;
};

const twelvedataEndpointsNested = {
	market: {
		quote: MarketEndpoints.quote,
		price: MarketEndpoints.price,
		timeSeries: MarketEndpoints.timeSeries,
		exchangeRate: MarketEndpoints.exchangeRate,
		apiUsage: MarketEndpoints.apiUsage,
	},
	reference: {
		stocks: ReferenceEndpoints.stocks,
		forexPairs: ReferenceEndpoints.forexPairs,
		cryptocurrencies: ReferenceEndpoints.cryptocurrencies,
		exchanges: ReferenceEndpoints.exchanges,
		etf: ReferenceEndpoints.etf,
		funds: ReferenceEndpoints.funds,
		bonds: ReferenceEndpoints.bonds,
	},
	indicators: {
		rsi: IndicatorsEndpoints.rsi,
		macd: IndicatorsEndpoints.macd,
		sma: IndicatorsEndpoints.sma,
		ema: IndicatorsEndpoints.ema,
		bbands: IndicatorsEndpoints.bbands,
		stoch: IndicatorsEndpoints.stoch,
		atr: IndicatorsEndpoints.atr,
		adx: IndicatorsEndpoints.adx,
		cci: IndicatorsEndpoints.cci,
		willr: IndicatorsEndpoints.willr,
		mfi: IndicatorsEndpoints.mfi,
		roc: IndicatorsEndpoints.roc,
		supertrend: IndicatorsEndpoints.supertrend,
		apo: IndicatorsEndpoints.apo,
		ppo: IndicatorsEndpoints.ppo,
		stochrsi: IndicatorsEndpoints.stochrsi,
		ultosc: IndicatorsEndpoints.ultosc,
		wma: IndicatorsEndpoints.wma,
		min: IndicatorsEndpoints.min,
		max: IndicatorsEndpoints.max,
		stddev: IndicatorsEndpoints.stddev,
		beta: IndicatorsEndpoints.beta,
		correl: IndicatorsEndpoints.correl,
		tsf: IndicatorsEndpoints.tsf,
	},
} as const;

export const twelvedataEndpointSchemas = {
	'market.quote': {
		input: TwelveDataEndpointInputSchemas.quote,
		output: TwelveDataEndpointOutputSchemas.quote,
	},
	'market.price': {
		input: TwelveDataEndpointInputSchemas.price,
		output: TwelveDataEndpointOutputSchemas.price,
	},
	'market.timeSeries': {
		input: TwelveDataEndpointInputSchemas.timeSeries,
		output: TwelveDataEndpointOutputSchemas.timeSeries,
	},
	'market.exchangeRate': {
		input: TwelveDataEndpointInputSchemas.exchangeRate,
		output: TwelveDataEndpointOutputSchemas.exchangeRate,
	},
	'market.apiUsage': {
		input: TwelveDataEndpointInputSchemas.apiUsage,
		output: TwelveDataEndpointOutputSchemas.apiUsage,
	},
	'reference.stocks': {
		input: TwelveDataEndpointInputSchemas.listStocks,
		output: TwelveDataEndpointOutputSchemas.listStocks,
	},
	'reference.forexPairs': {
		input: TwelveDataEndpointInputSchemas.listForexPairs,
		output: TwelveDataEndpointOutputSchemas.listForexPairs,
	},
	'reference.cryptocurrencies': {
		input: TwelveDataEndpointInputSchemas.listCryptocurrencies,
		output: TwelveDataEndpointOutputSchemas.listCryptocurrencies,
	},
	'reference.exchanges': {
		input: TwelveDataEndpointInputSchemas.listExchanges,
		output: TwelveDataEndpointOutputSchemas.listExchanges,
	},
	'reference.etf': {
		input: TwelveDataEndpointInputSchemas.listEtf,
		output: TwelveDataEndpointOutputSchemas.listEtf,
	},
	'reference.funds': {
		input: TwelveDataEndpointInputSchemas.listFunds,
		output: TwelveDataEndpointOutputSchemas.listFunds,
	},
	'reference.bonds': {
		input: TwelveDataEndpointInputSchemas.listBonds,
		output: TwelveDataEndpointOutputSchemas.listBonds,
	},
	'indicators.rsi': {
		input: TwelveDataEndpointInputSchemas.rsi,
		output: TwelveDataEndpointOutputSchemas.rsi,
	},
	'indicators.macd': {
		input: TwelveDataEndpointInputSchemas.macd,
		output: TwelveDataEndpointOutputSchemas.macd,
	},
	'indicators.sma': {
		input: TwelveDataEndpointInputSchemas.sma,
		output: TwelveDataEndpointOutputSchemas.sma,
	},
	'indicators.ema': {
		input: TwelveDataEndpointInputSchemas.ema,
		output: TwelveDataEndpointOutputSchemas.ema,
	},
	'indicators.bbands': {
		input: TwelveDataEndpointInputSchemas.bbands,
		output: TwelveDataEndpointOutputSchemas.bbands,
	},
	'indicators.stoch': {
		input: TwelveDataEndpointInputSchemas.stoch,
		output: TwelveDataEndpointOutputSchemas.stoch,
	},
	'indicators.atr': {
		input: TwelveDataEndpointInputSchemas.atr,
		output: TwelveDataEndpointOutputSchemas.atr,
	},
	'indicators.adx': {
		input: TwelveDataEndpointInputSchemas.adx,
		output: TwelveDataEndpointOutputSchemas.adx,
	},
	'indicators.cci': {
		input: TwelveDataEndpointInputSchemas.cci,
		output: TwelveDataEndpointOutputSchemas.cci,
	},
	'indicators.willr': {
		input: TwelveDataEndpointInputSchemas.willr,
		output: TwelveDataEndpointOutputSchemas.willr,
	},
	'indicators.mfi': {
		input: TwelveDataEndpointInputSchemas.mfi,
		output: TwelveDataEndpointOutputSchemas.mfi,
	},
	'indicators.roc': {
		input: TwelveDataEndpointInputSchemas.roc,
		output: TwelveDataEndpointOutputSchemas.roc,
	},
	'indicators.supertrend': {
		input: TwelveDataEndpointInputSchemas.supertrend,
		output: TwelveDataEndpointOutputSchemas.supertrend,
	},
	'indicators.apo': {
		input: TwelveDataEndpointInputSchemas.apo,
		output: TwelveDataEndpointOutputSchemas.apo,
	},
	'indicators.ppo': {
		input: TwelveDataEndpointInputSchemas.ppo,
		output: TwelveDataEndpointOutputSchemas.ppo,
	},
	'indicators.stochrsi': {
		input: TwelveDataEndpointInputSchemas.stochrsi,
		output: TwelveDataEndpointOutputSchemas.stochrsi,
	},
	'indicators.ultosc': {
		input: TwelveDataEndpointInputSchemas.ultosc,
		output: TwelveDataEndpointOutputSchemas.ultosc,
	},
	'indicators.wma': {
		input: TwelveDataEndpointInputSchemas.wma,
		output: TwelveDataEndpointOutputSchemas.wma,
	},
	'indicators.min': {
		input: TwelveDataEndpointInputSchemas.min,
		output: TwelveDataEndpointOutputSchemas.min,
	},
	'indicators.max': {
		input: TwelveDataEndpointInputSchemas.max,
		output: TwelveDataEndpointOutputSchemas.max,
	},
	'indicators.stddev': {
		input: TwelveDataEndpointInputSchemas.stddev,
		output: TwelveDataEndpointOutputSchemas.stddev,
	},
	'indicators.beta': {
		input: TwelveDataEndpointInputSchemas.beta,
		output: TwelveDataEndpointOutputSchemas.beta,
	},
	'indicators.correl': {
		input: TwelveDataEndpointInputSchemas.correl,
		output: TwelveDataEndpointOutputSchemas.correl,
	},
	'indicators.tsf': {
		input: TwelveDataEndpointInputSchemas.tsf,
		output: TwelveDataEndpointOutputSchemas.tsf,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof twelvedataEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const twelvedataEndpointMeta = {
	'market.quote': {
		riskLevel: 'read',
		description:
			'Read the latest quote for a symbol: open, high, low, close, change and 52-week range',
	},
	'market.price': {
		riskLevel: 'read',
		description:
			'Read the latest price for a symbol, the smallest of the market-data answers',
	},
	'market.timeSeries': {
		riskLevel: 'read',
		description:
			'Read OHLC candles for a symbol over an interval, with a date window and ordering',
	},
	'market.exchangeRate': {
		riskLevel: 'read',
		description: 'Read the current exchange rate of one currency pair',
	},
	'market.apiUsage': {
		riskLevel: 'read',
		description: 'Read how many API calls the key has made, and the plan limit',
	},
	'reference.stocks': {
		riskLevel: 'read',
		description:
			'List the stocks Twelve Data covers, filtered by symbol, exchange or country',
	},
	'reference.forexPairs': {
		riskLevel: 'read',
		description: 'List the currency pairs available, by base or quote currency',
	},
	'reference.cryptocurrencies': {
		riskLevel: 'read',
		description: 'List the cryptocurrency pairs available',
	},
	'reference.exchanges': {
		riskLevel: 'read',
		description: 'List the exchanges Twelve Data covers, with their timezone',
	},
	'reference.etf': {
		riskLevel: 'read',
		description:
			'List the ETFs Twelve Data covers, filtered by symbol, exchange or country',
	},
	'reference.funds': {
		riskLevel: 'read',
		description:
			'List the mutual funds Twelve Data covers, by country or symbol',
	},
	'reference.bonds': {
		riskLevel: 'read',
		description:
			'List the bonds Twelve Data covers, filtered by symbol, exchange or country',
	},
	'indicators.rsi': {
		riskLevel: 'read',
		description:
			'Read the RSI technical indicator for a symbol over an interval',
	},
	'indicators.macd': {
		riskLevel: 'read',
		description:
			'Read the MACD technical indicator for a symbol over an interval',
	},
	'indicators.sma': {
		riskLevel: 'read',
		description:
			'Read the SMA technical indicator for a symbol over an interval',
	},
	'indicators.ema': {
		riskLevel: 'read',
		description:
			'Read the EMA technical indicator for a symbol over an interval',
	},
	'indicators.bbands': {
		riskLevel: 'read',
		description:
			'Read the BBANDS technical indicator for a symbol over an interval',
	},
	'indicators.stoch': {
		riskLevel: 'read',
		description:
			'Read the STOCH technical indicator for a symbol over an interval',
	},
	'indicators.atr': {
		riskLevel: 'read',
		description:
			'Read the ATR technical indicator for a symbol over an interval',
	},
	'indicators.adx': {
		riskLevel: 'read',
		description:
			'Read the ADX technical indicator for a symbol over an interval',
	},
	'indicators.cci': {
		riskLevel: 'read',
		description:
			'Read the CCI technical indicator for a symbol over an interval',
	},
	'indicators.willr': {
		riskLevel: 'read',
		description:
			'Read the WILLR technical indicator for a symbol over an interval',
	},
	'indicators.mfi': {
		riskLevel: 'read',
		description:
			'Read the MFI technical indicator for a symbol over an interval',
	},
	'indicators.roc': {
		riskLevel: 'read',
		description:
			'Read the ROC technical indicator for a symbol over an interval',
	},
	'indicators.supertrend': {
		riskLevel: 'read',
		description:
			'Read the SUPERTREND technical indicator for a symbol over an interval',
	},
	'indicators.apo': {
		riskLevel: 'read',
		description:
			'Read the APO technical indicator for a symbol over an interval',
	},
	'indicators.ppo': {
		riskLevel: 'read',
		description:
			'Read the PPO technical indicator for a symbol over an interval',
	},
	'indicators.stochrsi': {
		riskLevel: 'read',
		description:
			'Read the STOCHRSI technical indicator for a symbol over an interval',
	},
	'indicators.ultosc': {
		riskLevel: 'read',
		description:
			'Read the ULTOSC technical indicator for a symbol over an interval',
	},
	'indicators.wma': {
		riskLevel: 'read',
		description:
			'Read the WMA technical indicator for a symbol over an interval',
	},
	'indicators.min': {
		riskLevel: 'read',
		description:
			'Read the MIN technical indicator for a symbol over an interval',
	},
	'indicators.max': {
		riskLevel: 'read',
		description:
			'Read the MAX technical indicator for a symbol over an interval',
	},
	'indicators.stddev': {
		riskLevel: 'read',
		description:
			'Read the STDDEV technical indicator for a symbol over an interval',
	},
	'indicators.beta': {
		riskLevel: 'read',
		description:
			'Read the BETA technical indicator for a symbol over an interval',
	},
	'indicators.correl': {
		riskLevel: 'read',
		description:
			'Read the CORREL technical indicator for a symbol over an interval',
	},
	'indicators.tsf': {
		riskLevel: 'read',
		description:
			'Read the TSF technical indicator for a symbol over an interval',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof twelvedataEndpointsNested
>;

export type BaseTwelveDataPlugin<T extends TwelveDataPluginOptions> =
	CorsairPlugin<
		'twelvedata',
		typeof TwelveDataSchema,
		typeof twelvedataEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalTwelveDataPlugin =
	BaseTwelveDataPlugin<TwelveDataPluginOptions>;

export type ExternalTwelveDataPlugin<T extends TwelveDataPluginOptions> =
	BaseTwelveDataPlugin<T>;

export function twelvedata<const T extends TwelveDataPluginOptions>(
	incomingOptions: TwelveDataPluginOptions & T = {} as TwelveDataPluginOptions &
		T,
): ExternalTwelveDataPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'twelvedata',
		schema: TwelveDataSchema,
		options: options,
		hooks: options.hooks,
		endpoints: twelvedataEndpointsNested,
		webhooks: {},
		endpointMeta: twelvedataEndpointMeta,
		endpointSchemas: twelvedataEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: TwelveDataKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('twelvedata', ctx.authType ?? 'api_key');
		},
	} satisfies InternalTwelveDataPlugin;
}

export { TwelveDataAPIError } from './client';

export type {
	ApiUsageOutput,
	ExchangeOutput,
	ExchangeRateOutput,
	ForexPairOutput,
	IndicatorOutput,
	PriceOutput,
	QuoteOutput,
	StockOutput,
	TimeSeriesInput,
	TimeSeriesOutput,
	TwelveDataEndpointInputs,
	TwelveDataEndpointOutputs,
} from './endpoints/types';
