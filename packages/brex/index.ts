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
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { BREX_OAUTH_AUTHORIZE_URL, BREX_OAUTH_TOKEN_URL } from './client';
import { brexEndpointsNested } from './endpoints';
import type { BrexRouteKey } from './endpoints/routes';
import { BREX_ROUTES } from './endpoints/routes';
import {
	BrexEndpointInputSchemas,
	BrexEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { resolveBrexOAuthTenantLink } from './oauth-tenant-link';
import { BrexSchema } from './schema';

const brexWebhooksNested = {} as const;

export type BrexPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	hooks?: InternalBrexPlugin['hooks'];
	webhookHooks?: InternalBrexPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof brexEndpointsNested>;
};

export const brexAuthConfig = {
	api_key: {
		account: ['company_id'] as const,
	},
	oauth_2: {
		account: ['company_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BrexContext = CorsairPluginContext<
	typeof BrexSchema,
	BrexPluginOptions
>;

export type BrexKeyBuilderContext = KeyBuilderContext<BrexPluginOptions>;

export type BrexBoundEndpoints = BindEndpoints<typeof brexEndpointsNested>;

export const brexEndpointSchemas = Object.fromEntries(
	(Object.keys(BREX_ROUTES) as BrexRouteKey[]).map((key) => {
		const route = BREX_ROUTES[key];
		return [
			`${route.group}.${route.op}`,
			{
				input: BrexEndpointInputSchemas[key],
				output: BrexEndpointOutputSchemas[key],
			},
		];
	}),
) as unknown as RequiredPluginEndpointSchemas<typeof brexEndpointsNested>;

const brexEndpointMeta = Object.fromEntries(
	(Object.keys(BREX_ROUTES) as BrexRouteKey[]).map((key) => {
		const route = BREX_ROUTES[key];
		return [
			`${route.group}.${route.op}`,
			{ riskLevel: route.risk, description: route.description },
		];
	}),
) as unknown as RequiredPluginEndpointMeta<
	typeof brexEndpointsNested
> satisfies RequiredPluginEndpointMeta<typeof brexEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseBrexPlugin<T extends BrexPluginOptions> = CorsairPlugin<
	'brex',
	typeof BrexSchema,
	typeof brexEndpointsNested,
	typeof brexWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalBrexPlugin = BaseBrexPlugin<BrexPluginOptions>;
export type ExternalBrexPlugin<T extends BrexPluginOptions> = BaseBrexPlugin<T>;

export function brex<const T extends BrexPluginOptions>(
	incomingOptions: BrexPluginOptions & T = {} as BrexPluginOptions & T,
): ExternalBrexPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'brex',
		authConfig: brexAuthConfig,
		schema: BrexSchema,
		options,
		oauthConfig: {
			providerName: 'Brex',
			authUrl: BREX_OAUTH_AUTHORIZE_URL,
			tokenUrl: BREX_OAUTH_TOKEN_URL,
			scopes: [
				'openid',
				'offline_access',
				'users',
				'users.readonly',
				'cards',
				'cards.readonly',
				'expenses',
				'expenses.card.readonly',
				'budgets',
				'vendors',
				'transfers',
				'accounts.cash.readonly',
				'transactions.card.readonly',
			],
			tokenAuthMethod: 'body',
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: brexEndpointsNested,
		webhooks: brexWebhooksNested,
		endpointMeta: brexEndpointMeta,
		endpointSchemas: brexEndpointSchemas,
		pluginWebhookMatcher: () => false,
		oauthWebhookTenantLinkResolver: resolveBrexOAuthTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) throw new AuthMissingError('brex', 'api_key');
				return key;
			}
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				return getOAuthAccessToken(ctx, {
					plugin: 'brex',
					tokenUrl: BREX_OAUTH_TOKEN_URL,
					tokenAuthMethod: 'body',
				});
			}
			throw new AuthMissingError('brex', ctx.authType ?? 'api_key');
		},
	} satisfies InternalBrexPlugin;
}

export {
	BREX_API_BASE,
	BREX_OAUTH_AUTHORIZE_URL,
	BREX_OAUTH_TOKEN_URL,
	BrexAPIError,
	BrexRateLimitError,
	makeBrexRequest,
} from './client';
export { BREX_ROUTE_KEYS, BREX_ROUTES } from './endpoints/routes';
export type {
	BrexEndpointInputs,
	BrexEndpointOutputs,
} from './endpoints/types';
