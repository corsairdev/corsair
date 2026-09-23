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
import { Categories, Languages, Latest, Regions, Search } from './endpoints';
import type {
	CurrentsApiEndpointInputs,
	CurrentsApiEndpointOutputs,
} from './endpoints/types';
import {
	CurrentsApiEndpointInputSchemas,
	CurrentsApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CurrentsApiSchema } from './schema';

const currentsApiEndpointsNested = {
	search: {
		get: Search.get,
	},
	latest: {
		get: Latest.get,
	},
	languages: {
		get: Languages.get,
	},
	regions: {
		get: Regions.get,
	},
	categories: {
		get: Categories.get,
	},
} as const;

const currentsApiWebhooksNested = {} as const;

export type CurrentsApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCurrentsApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof currentsApiEndpointsNested>;
};

export type CurrentsApiContext = CorsairPluginContext<
	typeof CurrentsApiSchema,
	CurrentsApiPluginOptions
>;

export type CurrentsApiKeyBuilderContext =
	KeyBuilderContext<CurrentsApiPluginOptions>;

type CurrentsApiEndpoint<K extends keyof CurrentsApiEndpointOutputs> =
	CorsairEndpoint<
		CurrentsApiContext,
		CurrentsApiEndpointInputs[K],
		CurrentsApiEndpointOutputs[K]
	>;

export type CurrentsApiEndpoints = {
	search: CurrentsApiEndpoint<'search'>;
	latest: CurrentsApiEndpoint<'latest'>;
	languages: CurrentsApiEndpoint<'languages'>;
	regions: CurrentsApiEndpoint<'regions'>;
	categories: CurrentsApiEndpoint<'categories'>;
};

export type CurrentsApiBoundEndpoints = BindEndpoints<
	typeof currentsApiEndpointsNested
>;

export const currentsApiEndpointSchemas = {
	'search.get': {
		input: CurrentsApiEndpointInputSchemas.search,
		output: CurrentsApiEndpointOutputSchemas.search,
	},
	'latest.get': {
		input: CurrentsApiEndpointInputSchemas.latest,
		output: CurrentsApiEndpointOutputSchemas.latest,
	},
	'languages.get': {
		input: CurrentsApiEndpointInputSchemas.languages,
		output: CurrentsApiEndpointOutputSchemas.languages,
	},
	'regions.get': {
		input: CurrentsApiEndpointInputSchemas.regions,
		output: CurrentsApiEndpointOutputSchemas.regions,
	},
	'categories.get': {
		input: CurrentsApiEndpointInputSchemas.categories,
		output: CurrentsApiEndpointOutputSchemas.categories,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof currentsApiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const currentsApiEndpointMeta = {
	'search.get': {
		riskLevel: 'read',
		description: 'Search news articles by keywords with filters',
	},
	'latest.get': {
		riskLevel: 'read',
		description: 'Get latest news headlines',
	},
	'languages.get': {
		riskLevel: 'read',
		description: 'List valid language codes',
	},
	'regions.get': {
		riskLevel: 'read',
		description: 'List valid country region codes',
	},
	'categories.get': {
		riskLevel: 'read',
		description: 'List valid category codes',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof currentsApiEndpointsNested
>;

export const currentsApiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCurrentsApiPlugin<T extends CurrentsApiPluginOptions> =
	CorsairPlugin<
		'currentsapi',
		typeof CurrentsApiSchema,
		typeof currentsApiEndpointsNested,
		typeof currentsApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCurrentsApiPlugin =
	BaseCurrentsApiPlugin<CurrentsApiPluginOptions>;

export type ExternalCurrentsApiPlugin<T extends CurrentsApiPluginOptions> =
	BaseCurrentsApiPlugin<T>;

export function currentsapi<const T extends CurrentsApiPluginOptions>(
	incomingOptions: CurrentsApiPluginOptions &
		T = {} as CurrentsApiPluginOptions & T,
): ExternalCurrentsApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'currentsapi',
		authConfig: currentsApiAuthConfig,
		schema: CurrentsApiSchema,
		options,
		hooks: options.hooks,
		endpoints: currentsApiEndpointsNested,
		webhooks: currentsApiWebhooksNested,
		endpointMeta: currentsApiEndpointMeta,
		endpointSchemas: currentsApiEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CurrentsApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				if (!key) {
					throw new AuthMissingError('currentsapi', 'api_key');
				}

				return key;
			}

			throw new AuthMissingError('currentsapi', 'api_key');
		},
	} satisfies InternalCurrentsApiPlugin;
}

export type {
	CategoriesResponse,
	CurrentsApiEndpointInputs,
	CurrentsApiEndpointOutputs,
	LanguagesResponse,
	LatestInput,
	LatestResponse,
	NewsItem,
	RegionsResponse,
	SearchInput,
	SearchResponse,
} from './endpoints/types';
