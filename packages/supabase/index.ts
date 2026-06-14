import type {
	AuthTypes,
	BindEndpoints,
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
	supabaseEndpointMeta,
	supabaseEndpointSchemas,
	supabaseEndpointsNested,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { SupabaseSchema } from './schema';

export type SupabasePluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	projectApiKey?: string;
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

export type SupabaseEndpoints = typeof supabaseEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const supabaseAuthConfig = {
	api_key: {},
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type BaseSupabasePlugin<T extends SupabasePluginOptions> = CorsairPlugin<
	'supabase',
	typeof SupabaseSchema,
	typeof supabaseEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof supabaseAuthConfig
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
		authConfig: supabaseAuthConfig,
		oauthConfig: {
			providerName: 'Supabase',
			authUrl: 'https://api.supabase.com/v1/oauth/authorize',
			tokenUrl: 'https://api.supabase.com/v1/oauth/token',
			scopes: ['all'],
			requiresRegisteredRedirect: true,
		},
		hooks: options.hooks,
		endpoints: supabaseEndpointsNested,
		webhooks: {},
		endpointMeta: supabaseEndpointMeta satisfies RequiredPluginEndpointMeta<
			typeof supabaseEndpointsNested
		>,
		endpointSchemas:
			supabaseEndpointSchemas satisfies RequiredPluginEndpointSchemas<
				typeof supabaseEndpointsNested
			>,
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

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) {
					throw new AuthMissingError('supabase', 'oauth_2');
				}
				return res;
			}

			throw new AuthMissingError('supabase', ctx.authType);
		},
	} satisfies InternalSupabasePlugin;
}

export type {
	SupabaseEndpointInput,
	SupabaseEndpointInputs,
	SupabaseEndpointOutput,
	SupabaseEndpointOutputs,
} from './endpoints/types';

export {
	supabaseEndpointMeta,
	supabaseEndpointsNested,
	supabaseEndpointSchemas,
};
