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
import {
	getNews,
	listDividends,
	listEarnings,
	listEconomics,
	listGuidance,
	listIpos,
	listNewsChannels,
	listRatings,
	listSplits,
} from './endpoints';
import type {
	BenzingaEndpointInputs,
	BenzingaEndpointOutputs,
} from './endpoints/types';
import {
	BenzingaEndpointInputSchemas,
	BenzingaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BenzingaSchema } from './schema';

export type BenzingaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBenzingaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof benzingaEndpointsNested>;
};

export type BenzingaContext = CorsairPluginContext<
	typeof BenzingaSchema,
	BenzingaPluginOptions
>;

export type BenzingaKeyBuilderContext =
	KeyBuilderContext<BenzingaPluginOptions>;

export type BenzingaBoundEndpoints = BindEndpoints<
	typeof benzingaEndpointsNested
>;

type BenzingaEndpoint<K extends keyof BenzingaEndpointOutputs> =
	CorsairEndpoint<
		BenzingaContext,
		BenzingaEndpointInputs[K],
		BenzingaEndpointOutputs[K]
	>;

export type BenzingaEndpoints = {
	getNews: BenzingaEndpoint<'getNews'>;
	listNewsChannels: BenzingaEndpoint<'listNewsChannels'>;
	listEarnings: BenzingaEndpoint<'listEarnings'>;
	listDividends: BenzingaEndpoint<'listDividends'>;
	listRatings: BenzingaEndpoint<'listRatings'>;
	listGuidance: BenzingaEndpoint<'listGuidance'>;
	listIpos: BenzingaEndpoint<'listIpos'>;
	listSplits: BenzingaEndpoint<'listSplits'>;
	listEconomics: BenzingaEndpoint<'listEconomics'>;
};

const benzingaEndpointsNested = {
	news: {
		get: getNews,
		listChannels: listNewsChannels,
	},
	calendar: {
		listEarnings,
		listDividends,
		listRatings,
		listGuidance,
		listIpos,
		listSplits,
		listEconomics,
	},
} as const;

export const benzingaEndpointSchemas = {
	'news.get': {
		input: BenzingaEndpointInputSchemas.getNews,
		output: BenzingaEndpointOutputSchemas.getNews,
	},
	'news.listChannels': {
		input: BenzingaEndpointInputSchemas.listNewsChannels,
		output: BenzingaEndpointOutputSchemas.listNewsChannels,
	},
	'calendar.listEarnings': {
		input: BenzingaEndpointInputSchemas.listEarnings,
		output: BenzingaEndpointOutputSchemas.listEarnings,
	},
	'calendar.listDividends': {
		input: BenzingaEndpointInputSchemas.listDividends,
		output: BenzingaEndpointOutputSchemas.listDividends,
	},
	'calendar.listRatings': {
		input: BenzingaEndpointInputSchemas.listRatings,
		output: BenzingaEndpointOutputSchemas.listRatings,
	},
	'calendar.listGuidance': {
		input: BenzingaEndpointInputSchemas.listGuidance,
		output: BenzingaEndpointOutputSchemas.listGuidance,
	},
	'calendar.listIpos': {
		input: BenzingaEndpointInputSchemas.listIpos,
		output: BenzingaEndpointOutputSchemas.listIpos,
	},
	'calendar.listSplits': {
		input: BenzingaEndpointInputSchemas.listSplits,
		output: BenzingaEndpointOutputSchemas.listSplits,
	},
	'calendar.listEconomics': {
		input: BenzingaEndpointInputSchemas.listEconomics,
		output: BenzingaEndpointOutputSchemas.listEconomics,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof benzingaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const benzingaEndpointMeta = {
	'news.get': {
		riskLevel: 'read',
		description:
			'Get Benzinga news articles (GET /api/v2/news, page/pageSize pagination)',
	},
	'news.listChannels': {
		riskLevel: 'read',
		description:
			'List available Benzinga news channels (GET /api/v2.1/news/channels)',
	},
	'calendar.listEarnings': {
		riskLevel: 'read',
		description:
			'List earnings calendar data (GET /api/v2.1/calendar/earnings, page/pagesize pagination)',
	},
	'calendar.listDividends': {
		riskLevel: 'read',
		description:
			'List dividends calendar data (GET /api/v2.2/calendar/dividends, page/pagesize pagination)',
	},
	'calendar.listRatings': {
		riskLevel: 'read',
		description:
			'List analyst ratings data (GET /api/v2.1/calendar/ratings, page/pagesize pagination)',
	},
	'calendar.listGuidance': {
		riskLevel: 'read',
		description:
			'List company guidance data (GET /api/v2.1/calendar/guidance, page/pagesize pagination)',
	},
	'calendar.listIpos': {
		riskLevel: 'read',
		description:
			'List IPO calendar data (GET /api/v2.1/calendar/ipos, page/pagesize pagination)',
	},
	'calendar.listSplits': {
		riskLevel: 'read',
		description:
			'List stock split data (GET /api/v2.1/calendar/splits, page/pagesize pagination)',
	},
	'calendar.listEconomics': {
		riskLevel: 'read',
		description:
			'List economic calendar data (GET /api/v2.1/calendar/economics, page/pagesize pagination)',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof benzingaEndpointsNested>;

export const benzingaAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseBenzingaPlugin<T extends BenzingaPluginOptions> = CorsairPlugin<
	'benzinga',
	typeof BenzingaSchema,
	typeof benzingaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalBenzingaPlugin = BaseBenzingaPlugin<BenzingaPluginOptions>;

export type ExternalBenzingaPlugin<T extends BenzingaPluginOptions> =
	BaseBenzingaPlugin<T>;

export function benzinga<const T extends BenzingaPluginOptions>(
	incomingOptions: BenzingaPluginOptions & T = {} as BenzingaPluginOptions & T,
): ExternalBenzingaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'benzinga',
		authConfig: benzingaAuthConfig,
		schema: BenzingaSchema,
		options,
		hooks: options.hooks,
		endpoints: benzingaEndpointsNested,
		webhooks: {},
		endpointMeta: benzingaEndpointMeta,
		endpointSchemas: benzingaEndpointSchemas,
		pluginWebhookMatcher: undefined,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: BenzingaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					console.error(
						'[BENZINGA] API key missing — connect Benzinga or pass key in plugin options.',
					);
					throw new AuthMissingError('benzinga', 'api_key');
				}
				return res;
			}

			console.error(
				'[BENZINGA] Authentication required for Benzinga API requests.',
			);
			throw new AuthMissingError('benzinga', 'api_key');
		},
	} satisfies InternalBenzingaPlugin;
}

export type {
	BenzingaEndpointInputs,
	BenzingaEndpointOutputs,
	GetNewsInput,
	GetNewsResponse,
	Ipo,
	ListDividendsInput,
	ListDividendsResponse,
	ListEarningsInput,
	ListEarningsResponse,
	ListEconomicsInput,
	ListEconomicsResponse,
	ListGuidanceInput,
	ListGuidanceResponse,
	ListIposInput,
	ListIposResponse,
	ListNewsChannelsInput,
	ListNewsChannelsResponse,
	ListRatingsInput,
	ListRatingsResponse,
	ListSplitsInput,
	ListSplitsResponse,
} from './endpoints/types';
