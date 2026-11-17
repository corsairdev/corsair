import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { CurrencyScoopContext } from './context';
import {
	convertQuote,
	historicalQuotes,
	latestQuotes,
	listCurrencies,
	timeseriesQuotes,
} from './endpoints';
import {
	ConvertInputSchema,
	ConvertResponseSchema,
	CurrencyListResponseSchema,
	HistoricalInputSchema,
	ListInputSchema,
	QuoteListResponseSchema,
	RatesInputSchema,
	TimeseriesInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CurrencyScoopSchema } from './schema';

export type { CurrencyScoopContext };

export type CurrencyScoopPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCurrencyScoopPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof currencyEndpointsNested>;
};

export type CurrencyScoopKeyBuilderContext =
	KeyBuilderContext<CurrencyScoopPluginOptions>;

const currencyEndpointsNested = {
	currencies: { list: listCurrencies },
	quotes: {
		latest: latestQuotes,
		historical: historicalQuotes,
		convert: convertQuote,
		timeseries: timeseriesQuotes,
	},
} as const;

const currencyWebhooksNested = {} as const;

export const currencyScoopEndpointSchemas = {
	'currencies.list': {
		input: ListInputSchema,
		output: CurrencyListResponseSchema,
	},
	'quotes.latest': { input: RatesInputSchema, output: QuoteListResponseSchema },
	'quotes.historical': {
		input: HistoricalInputSchema,
		output: QuoteListResponseSchema,
	},
	'quotes.convert': {
		input: ConvertInputSchema,
		output: ConvertResponseSchema,
	},
	'quotes.timeseries': {
		input: TimeseriesInputSchema,
		output: QuoteListResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof currencyEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const currencyEndpointMeta = {
	'currencies.list': read('List supported CurrencyBeacon currency codes.'),
	'quotes.latest': read('Read the latest mid-market rates.'),
	'quotes.historical': read('Read mid-market rates for one date.'),
	'quotes.convert': read('Convert an amount between two currencies.'),
	'quotes.timeseries': read('Read daily rates between two dates.'),
} as const satisfies RequiredPluginEndpointMeta<typeof currencyEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const currencyScoopAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseCurrencyScoopPlugin<T extends CurrencyScoopPluginOptions> =
	CorsairPlugin<
		'currencyscoop',
		typeof CurrencyScoopSchema,
		typeof currencyEndpointsNested,
		typeof currencyWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCurrencyScoopPlugin =
	BaseCurrencyScoopPlugin<CurrencyScoopPluginOptions>;
export type ExternalCurrencyScoopPlugin<T extends CurrencyScoopPluginOptions> =
	BaseCurrencyScoopPlugin<T>;

export function currencyscoop<const T extends CurrencyScoopPluginOptions>(
	incomingOptions: CurrencyScoopPluginOptions &
		T = {} as CurrencyScoopPluginOptions & T,
): ExternalCurrencyScoopPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'currencyscoop',
		authConfig: currencyScoopAuthConfig,
		schema: CurrencyScoopSchema,
		options,
		hooks: options.hooks,
		endpoints: currencyEndpointsNested,
		webhooks: currencyWebhooksNested,
		endpointMeta: currencyEndpointMeta,
		endpointSchemas: currencyScoopEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: CurrencyScoopKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('currencyscoop', 'api_key');
				return key;
			}
			return '';
		},
	} satisfies InternalCurrencyScoopPlugin;
}
