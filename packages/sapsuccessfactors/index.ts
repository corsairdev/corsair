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
	normalizeSapsuccessfactorsHost,
	SAP_SUCCESSFACTORS_DEFAULT_HOST,
	sapSuccessfactorsOAuthUrls,
} from './client';
import {
	SapsuccessfactorsEndpointInputSchemas,
	SapsuccessfactorsEndpointOutputSchemas,
	sapRoutes,
	sapsuccessfactorsEndpointsNested,
} from './endpoints';
import type {
	SapsuccessfactorsEndpointInputs,
	SapsuccessfactorsEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SapsuccessfactorsSchema } from './schema';

export const sapsuccessfactorsAuthConfig = {
	api_key: {
		account: ['host', 'company_id'] as const,
	},
	oauth_2: {
		account: ['host', 'company_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type SapsuccessfactorsPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	/** Bearer token or `Basic …` (tests / BYO). */
	key?: string;
	/** API hostname, e.g. api10.successfactors.com */
	host?: string;
	/** Alias for host (older option name). */
	apiBaseUrl?: string;
	/** SuccessFactors company ID (OAuth token request). */
	companyId?: string;
	hooks?: InternalSapsuccessfactorsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<
		typeof sapsuccessfactorsEndpointsNested
	>;
};

export type SapsuccessfactorsContext = CorsairPluginContext<
	typeof SapsuccessfactorsSchema,
	SapsuccessfactorsPluginOptions,
	undefined,
	typeof sapsuccessfactorsAuthConfig
>;
export type SapsuccessfactorsKeyBuilderContext = KeyBuilderContext<
	SapsuccessfactorsPluginOptions,
	typeof sapsuccessfactorsAuthConfig
>;
export type SapsuccessfactorsBoundEndpoints = BindEndpoints<
	typeof sapsuccessfactorsEndpointsNested
>;

type SapsuccessfactorsEndpoint<
	K extends keyof SapsuccessfactorsEndpointOutputs,
> = CorsairEndpoint<
	SapsuccessfactorsContext,
	SapsuccessfactorsEndpointInputs[K],
	SapsuccessfactorsEndpointOutputs[K]
>;

export type SapsuccessfactorsEndpoints = {
	[K in keyof SapsuccessfactorsEndpointOutputs]: SapsuccessfactorsEndpoint<K>;
};

const sapsuccessfactorsEndpointSchemas = Object.fromEntries(
	sapRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			input: SapsuccessfactorsEndpointInputSchemas[route.name],
			output: SapsuccessfactorsEndpointOutputSchemas[route.name],
		},
	]),
) as unknown as RequiredPluginEndpointSchemas<
	typeof sapsuccessfactorsEndpointsNested
>;

const sapsuccessfactorsEndpointMeta = Object.fromEntries(
	sapRoutes.map((route) => [
		`${route.group}.${route.name}`,
		{
			riskLevel: route.riskLevel,
			description: route.description,
			...('irreversible' in route && route.irreversible
				? { irreversible: true as const }
				: {}),
		},
	]),
) as unknown as RequiredPluginEndpointMeta<
	typeof sapsuccessfactorsEndpointsNested
> satisfies RequiredPluginEndpointMeta<typeof sapsuccessfactorsEndpointsNested>;

const defaultAuthType: AuthTypes = 'oauth_2';

export type BaseSapsuccessfactorsPlugin<
	T extends SapsuccessfactorsPluginOptions,
> = CorsairPlugin<
	'sapsuccessfactors',
	typeof SapsuccessfactorsSchema,
	typeof sapsuccessfactorsEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType,
	typeof sapsuccessfactorsAuthConfig
>;

export type InternalSapsuccessfactorsPlugin =
	BaseSapsuccessfactorsPlugin<SapsuccessfactorsPluginOptions>;
export type ExternalSapsuccessfactorsPlugin<
	T extends SapsuccessfactorsPluginOptions,
> = BaseSapsuccessfactorsPlugin<T>;

export function sapsuccessfactors<
	const T extends SapsuccessfactorsPluginOptions,
>(
	incomingOptions: SapsuccessfactorsPluginOptions &
		T = {} as SapsuccessfactorsPluginOptions & T,
): ExternalSapsuccessfactorsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const rawHost = options.host?.trim() || options.apiBaseUrl?.trim();
	const host = rawHost
		? normalizeSapsuccessfactorsHost(rawHost)
		: SAP_SUCCESSFACTORS_DEFAULT_HOST;
	options.host = host;
	const oauthUrls = sapSuccessfactorsOAuthUrls(host);

	return {
		id: 'sapsuccessfactors',
		authConfig: sapsuccessfactorsAuthConfig,
		oauthConfig: {
			providerName: 'SAP SuccessFactors',
			authUrl: oauthUrls.authUrl,
			tokenUrl: oauthUrls.tokenUrl,
			scopes: [],
			tokenAuthMethod: 'body' as const,
			requiresRegisteredRedirect: true,
		},
		schema: SapsuccessfactorsSchema,
		options,
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: sapsuccessfactorsEndpointsNested,
		webhooks: {} as const,
		endpointMeta: sapsuccessfactorsEndpointMeta,
		endpointSchemas: sapsuccessfactorsEndpointSchemas,
		webhookSchemas: {} as const,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: SapsuccessfactorsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				if (!res) throw new AuthMissingError('sapsuccessfactors', 'oauth_2');
				return res;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) throw new AuthMissingError('sapsuccessfactors', 'api_key');
				return res;
			}
			throw new AuthMissingError('sapsuccessfactors', options.authType);
		},
	} satisfies InternalSapsuccessfactorsPlugin;
}

export { sapRoutes } from './endpoints/routes';
export type {
	SapsuccessfactorsEndpointInputs,
	SapsuccessfactorsEndpointOutputs,
} from './endpoints/types';
