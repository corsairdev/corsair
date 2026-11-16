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
	Keywords,
	ProductDatabase,
	SalesEstimates,
	ShareOfVoice,
} from './endpoints';
import type {
	JungleScoutEndpointInputs,
	JungleScoutEndpointOutputs,
} from './endpoints/types';
import {
	JungleScoutEndpointInputSchemas,
	JungleScoutEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { JungleScoutSchema } from './schema';

export type JungleScoutPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	apiType?: 'junglescout' | 'cobalt';
	hooks?: InternalJungleScoutPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof junglescoutEndpointsNested>;
};

export type JungleScoutContext = CorsairPluginContext<
	typeof JungleScoutSchema,
	JungleScoutPluginOptions
>;

export type JungleScoutKeyBuilderContext = KeyBuilderContext<
	JungleScoutPluginOptions,
	typeof jungleScoutAuthConfig
>;

export type JungleScoutBoundEndpoints = BindEndpoints<
	typeof junglescoutEndpointsNested
>;

type JungleScoutEndpoint<K extends keyof JungleScoutEndpointOutputs> =
	CorsairEndpoint<
		JungleScoutContext,
		JungleScoutEndpointInputs[K],
		JungleScoutEndpointOutputs[K]
	>;

export type JungleScoutEndpoints = {
	'keywords.byAsin': JungleScoutEndpoint<'keywords.byAsin'>;
	'keywords.byKeyword': JungleScoutEndpoint<'keywords.byKeyword'>;
	'keywords.historicalSearchVolume': JungleScoutEndpoint<'keywords.historicalSearchVolume'>;
	'productDatabase.query': JungleScoutEndpoint<'productDatabase.query'>;
	'salesEstimates.query': JungleScoutEndpoint<'salesEstimates.query'>;
	'shareOfVoice.get': JungleScoutEndpoint<'shareOfVoice.get'>;
};

const junglescoutEndpointsNested = {
	keywords: {
		byAsin: Keywords.byAsin,
		byKeyword: Keywords.byKeyword,
		historicalSearchVolume: Keywords.historicalSearchVolume,
	},
	productDatabase: {
		query: ProductDatabase.query,
	},
	salesEstimates: {
		query: SalesEstimates.query,
	},
	shareOfVoice: {
		get: ShareOfVoice.get,
	},
} as const;

export const junglescoutEndpointSchemas = {
	'keywords.byAsin': {
		input: JungleScoutEndpointInputSchemas['keywords.byAsin'],
		output: JungleScoutEndpointOutputSchemas['keywords.byAsin'],
	},
	'keywords.byKeyword': {
		input: JungleScoutEndpointInputSchemas['keywords.byKeyword'],
		output: JungleScoutEndpointOutputSchemas['keywords.byKeyword'],
	},
	'keywords.historicalSearchVolume': {
		input: JungleScoutEndpointInputSchemas['keywords.historicalSearchVolume'],
		output: JungleScoutEndpointOutputSchemas['keywords.historicalSearchVolume'],
	},
	'productDatabase.query': {
		input: JungleScoutEndpointInputSchemas['productDatabase.query'],
		output: JungleScoutEndpointOutputSchemas['productDatabase.query'],
	},
	'salesEstimates.query': {
		input: JungleScoutEndpointInputSchemas['salesEstimates.query'],
		output: JungleScoutEndpointOutputSchemas['salesEstimates.query'],
	},
	'shareOfVoice.get': {
		input: JungleScoutEndpointInputSchemas['shareOfVoice.get'],
		output: JungleScoutEndpointOutputSchemas['shareOfVoice.get'],
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof junglescoutEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const junglescoutEndpointMeta = {
	'keywords.byAsin': {
		riskLevel: 'read',
		description: 'Query keywords and rankings for up to 10 Amazon ASINs',
	},
	'keywords.byKeyword': {
		riskLevel: 'read',
		description:
			'Discover keyword search volumes and relevancy metrics for search terms',
	},
	'keywords.historicalSearchVolume': {
		riskLevel: 'read',
		description:
			'Retrieve weekly historical search volume trends for a keyword',
	},
	'productDatabase.query': {
		riskLevel: 'read',
		description:
			'Search Amazon product catalog with sales, revenue, rank, and review filters',
	},
	'salesEstimates.query': {
		riskLevel: 'read',
		description:
			'Retrieve daily historical sales estimates and pricing for an ASIN',
	},
	'shareOfVoice.get': {
		riskLevel: 'read',
		description:
			'Retrieve brand market share and visibility metrics for a search term',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof junglescoutEndpointsNested
>;

export const jungleScoutAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type BaseJungleScoutPlugin<T extends JungleScoutPluginOptions> =
	CorsairPlugin<
		'junglescout',
		typeof JungleScoutSchema,
		typeof junglescoutEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof jungleScoutAuthConfig
	>;

export type InternalJungleScoutPlugin =
	BaseJungleScoutPlugin<JungleScoutPluginOptions>;

export function junglescout<const T extends JungleScoutPluginOptions>(
	incomingOptions: JungleScoutPluginOptions &
		T = {} as JungleScoutPluginOptions & T,
): BaseJungleScoutPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const mergedErrorHandlers = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'junglescout',
		schema: JungleScoutSchema,
		endpoints: junglescoutEndpointsNested,
		webhooks: {},
		endpointMeta: junglescoutEndpointMeta,
		endpointSchemas: junglescoutEndpointSchemas,
		options,
		hooks: options.hooks,
		authConfig: jungleScoutAuthConfig,
		errorHandlers: mergedErrorHandlers,
		keyBuilder: async (ctx: JungleScoutKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key !== undefined) {
				if (!options.key.trim()) {
					throw new AuthMissingError('junglescout', 'api_key');
				}
				return options.key;
			}
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('junglescout', 'api_key');
			return apiKey;
		},
	} satisfies InternalJungleScoutPlugin;
}

export default junglescout;

export type {
	HistoricalSearchVolumeInput,
	HistoricalSearchVolumeResponse,
	JungleScoutEndpointInputs,
	JungleScoutEndpointOutputs,
	JungleScoutMarketplace,
	KeywordsByAsinInput,
	KeywordsByAsinResponse,
	KeywordsByKeywordInput,
	KeywordsByKeywordResponse,
	ProductDatabaseQueryInput,
	ProductDatabaseQueryResponse,
	SalesEstimatesQueryInput,
	SalesEstimatesQueryResponse,
	ShareOfVoiceInput,
	ShareOfVoiceResponse,
} from './endpoints/types';
