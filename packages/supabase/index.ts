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
import type { AuthTypes } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type {
	SupabaseEndpointInputs,
	SupabaseEndpointOutputs,
} from './endpoints/types';
import {
	SupabaseEndpointInputSchemas,
	SupabaseEndpointOutputSchemas,
} from './endpoints/types';
import { Example } from './endpoints';
import { SupabaseSchema } from './schema';
import { errorHandlers } from './error-handlers';

export type SupabasePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSupabasePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof supabaseEndpointsNested>;
};

export type SupabaseContext = CorsairPluginContext<
	typeof SupabaseSchema,
	SupabasePluginOptions
>;

export type SupabaseKeyBuilderContext =
	KeyBuilderContext<SupabasePluginOptions>;

export type SupabaseBoundEndpoints = BindEndpoints<
	typeof supabaseEndpointsNested
>;

type SupabaseEndpoint<K extends keyof SupabaseEndpointOutputs> =
	CorsairEndpoint<
		SupabaseContext,
		SupabaseEndpointInputs[K],
		SupabaseEndpointOutputs[K]
	>;

export type SupabaseEndpoints = {
	exampleGet: SupabaseEndpoint<'exampleGet'>;
};

const supabaseEndpointsNested = {
	example: {
		get: Example.get,
	},
} as const;

export const supabaseEndpointSchemas = {
	'example.get': {
		input: SupabaseEndpointInputSchemas.exampleGet,
		output: SupabaseEndpointOutputSchemas.exampleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof supabaseEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const supabaseEndpointMeta = {
	'example.get': {
		riskLevel: 'read',
		description: 'Get an example resource by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof supabaseEndpointsNested>;

export const supabaseAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSupabasePlugin<T extends SupabasePluginOptions> = CorsairPlugin<
	'supabase',
	typeof SupabaseSchema,
	typeof supabaseEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalSupabasePlugin = BaseSupabasePlugin<SupabasePluginOptions>;

export type ExternalSupabasePlugin<T extends SupabasePluginOptions> =
	BaseSupabasePlugin<T>;

export function supabase<const T extends SupabasePluginOptions>(
	// The empty object keeps plugin setup ergonomic while preserving selected auth options.
	incomingOptions: SupabasePluginOptions & T = {} as SupabasePluginOptions & T,
): ExternalSupabasePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'supabase',
		schema: SupabaseSchema,
		options: options,
		hooks: options.hooks,
		endpoints: supabaseEndpointsNested,
		webhooks: {},
		endpointMeta: supabaseEndpointMeta,
		endpointSchemas: supabaseEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SupabaseKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('supabase', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('supabase', 'api_key');
		},
	} satisfies InternalSupabasePlugin;
}

export type {
	SupabaseEndpointInputs,
	SupabaseEndpointOutputs,
	ExampleGetInput,
	ExampleGetResponse,
} from './endpoints/types';
