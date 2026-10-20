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
	getConsensusRatings,
	getEarningsStream,
	getNews,
	getNewsStream,
	listConferenceCalls,
	listDividends,
	listEarnings,
	listEconomics,
	listGuidance,
	listIpos,
	listNewsChannels,
	listRatings,
	listRemovedCalendarEvents,
	listRemovedNews,
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
	listConferenceCalls: BenzingaEndpoint<'listConferenceCalls'>;
	getConsensusRatings: BenzingaEndpoint<'getConsensusRatings'>;
	listRemovedCalendarEvents: BenzingaEndpoint<'listRemovedCalendarEvents'>;
	listRemovedNews: BenzingaEndpoint<'listRemovedNews'>;
	getEarningsStream: BenzingaEndpoint<'getEarningsStream'>;
	getNewsStream: BenzingaEndpoint<'getNewsStream'>;
};

const benzingaEndpointsNested = {
	news: {
		get: getNews,
		listChannels: listNewsChannels,
		listRemoved: listRemovedNews,
		getStream: getNewsStream,
	},
	calendar: {
		listEarnings,
		listDividends,
		listRatings,
		listGuidance,
		listIpos,
		listSplits,
		listEconomics,
		listConferenceCalls,
		getConsensusRatings,
		listRemoved: listRemovedCalendarEvents,
		getEarningsStream,
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
	'news.listRemoved': {
		input: BenzingaEndpointInputSchemas.listRemovedNews,
		output: BenzingaEndpointOutputSchemas.listRemovedNews,
	},
	'news.getStream': {
		input: BenzingaEndpointInputSchemas.getNewsStream,
		output: BenzingaEndpointOutputSchemas.getNewsStream,
	},
	'calendar.listConferenceCalls': {
		input: BenzingaEndpointInputSchemas.listConferenceCalls,
		output: BenzingaEndpointOutputSchemas.listConferenceCalls,
	},
	'calendar.getConsensusRatings': {
		input: BenzingaEndpointInputSchemas.getConsensusRatings,
		output: BenzingaEndpointOutputSchemas.getConsensusRatings,
	},
	'calendar.listRemoved': {
		input: BenzingaEndpointInputSchemas.listRemovedCalendarEvents,
		output: BenzingaEndpointOutputSchemas.listRemovedCalendarEvents,
	},
	'calendar.getEarningsStream': {
		input: BenzingaEndpointInputSchemas.getEarningsStream,
		output: BenzingaEndpointOutputSchemas.getEarningsStream,
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
	'news.listRemoved': {
		riskLevel: 'read',
		description:
			'List IDs and update times of removed news articles (GET /api/v2/news-removed, page/pageSize pagination)',
	},
	'news.getStream': {
		riskLevel: 'read',
		description:
			'Get the WebSocket URL for the real-time news stream (wss://api.benzinga.com/api/v1/news/stream); append token=<api key> to connect',
	},
	'calendar.listConferenceCalls': {
		riskLevel: 'read',
		description:
			'List conference call data (GET /api/v2.1/calendar/conference-calls, page/pagesize pagination)',
	},
	'calendar.getConsensusRatings': {
		riskLevel: 'read',
		description:
			'Get aggregated analyst consensus rating and price targets for one ticker (GET /api/v1/consensus-ratings)',
	},
	'calendar.listRemoved': {
		riskLevel: 'read',
		description:
			'List removed calendar events by type and update time (GET /api/v2.1/calendar-removed/, page/pageSize pagination)',
	},
	'calendar.getEarningsStream': {
		riskLevel: 'read',
		description:
			'Get the WebSocket URL for the real-time earnings calendar stream (wss://api.benzinga.com/api/v2.1/calendar/earnings/stream); append token=<api key> to connect',
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
	// Safe: every BenzingaPluginOptions field is optional, so `{}` is a valid value and defaults are filled in below.
	// A narrower type is not practical because a default parameter cannot be typed as the caller-supplied generic `T` without an assertion.
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
	GetConsensusRatingsInput,
	GetConsensusRatingsResponse,
	GetEarningsStreamInput,
	GetNewsInput,
	GetNewsResponse,
	GetNewsStreamInput,
	Ipo,
	ListConferenceCallsInput,
	ListConferenceCallsResponse,
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
	ListRemovedCalendarEventsInput,
	ListRemovedCalendarEventsResponse,
	ListRemovedNewsInput,
	ListRemovedNewsResponse,
	ListSplitsInput,
	ListSplitsResponse,
	StreamConnection,
} from './endpoints/types';
