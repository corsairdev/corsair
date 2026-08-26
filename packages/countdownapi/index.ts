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

import { Autocomplete, Product, Search } from './endpoints';
import type {
	CountdownApiEndpointInputs,
	CountdownApiEndpointOutputs,
} from './endpoints/types';
import {
	CountdownApiEndpointInputSchemas,
	CountdownApiEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CountdownApiSchema } from './schema';

const countdownApiEndpointsNested = {
	search: {
		get: Search.get,
	},
	product: {
		get: Product.get,
	},
	autocomplete: {
		get: Autocomplete.get,
	},
} as const;

const countdownApiWebhooksNested = {} as const;

export type CountdownApiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCountdownApiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof countdownApiEndpointsNested>;
};

export type CountdownApiContext = CorsairPluginContext<
	typeof CountdownApiSchema,
	CountdownApiPluginOptions
>;

export type CountdownApiKeyBuilderContext =
	KeyBuilderContext<CountdownApiPluginOptions>;

type CountdownApiEndpoint<K extends keyof CountdownApiEndpointOutputs> =
	CorsairEndpoint<
		CountdownApiContext,
		CountdownApiEndpointInputs[K],
		CountdownApiEndpointOutputs[K]
	>;

export type CountdownApiEndpoints = {
	search: CountdownApiEndpoint<'search'>;
	product: CountdownApiEndpoint<'product'>;
	autocomplete: CountdownApiEndpoint<'autocomplete'>;
};

export type CountdownApiBoundEndpoints = BindEndpoints<
	typeof countdownApiEndpointsNested
>;

export const countdownApiEndpointSchemas = {
	'search.get': {
		input: CountdownApiEndpointInputSchemas.search,
		output: CountdownApiEndpointOutputSchemas.search,
	},
	'product.get': {
		input: CountdownApiEndpointInputSchemas.product,
		output: CountdownApiEndpointOutputSchemas.product,
	},
	'autocomplete.get': {
		input: CountdownApiEndpointInputSchemas.autocomplete,
		output: CountdownApiEndpointOutputSchemas.autocomplete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof countdownApiEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key';

const countdownApiEndpointMeta = {
	'search.get': {
		riskLevel: 'read',
		description: 'Search eBay products using Countdown API',
	},
	'product.get': {
		riskLevel: 'read',
		description: 'Get eBay product data using Countdown API',
	},
	'autocomplete.get': {
		riskLevel: 'read',
		description: 'Get eBay search autocomplete suggestions',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof countdownApiEndpointsNested
>;

export const countdownApiAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCountdownApiPlugin<T extends CountdownApiPluginOptions> =
	CorsairPlugin<
		'countdownapi',
		typeof CountdownApiSchema,
		typeof countdownApiEndpointsNested,
		typeof countdownApiWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalCountdownApiPlugin =
	BaseCountdownApiPlugin<CountdownApiPluginOptions>;

export type ExternalCountdownApiPlugin<T extends CountdownApiPluginOptions> =
	BaseCountdownApiPlugin<T>;

export function countdownapi<const T extends CountdownApiPluginOptions>(
	incomingOptions: CountdownApiPluginOptions &
		T = {} as CountdownApiPluginOptions & T,
): ExternalCountdownApiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'countdownapi',
		authConfig: countdownApiAuthConfig,
		schema: CountdownApiSchema,
		options,
		hooks: options.hooks,
		endpoints: countdownApiEndpointsNested,
		webhooks: countdownApiWebhooksNested,
		endpointMeta: countdownApiEndpointMeta,
		endpointSchemas: countdownApiEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CountdownApiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}

			return '';
		},
	} satisfies InternalCountdownApiPlugin;
}

export type {
	AutocompleteInput,
	AutocompleteResponse,
	CountdownApiEndpointInputs,
	CountdownApiEndpointOutputs,
	ProductInput,
	ProductResponse,
	SearchInput,
	SearchResponse,
} from './endpoints/types';
