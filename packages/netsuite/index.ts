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
import { getOAuthAccessToken } from 'corsair/core';
import { netSuiteOAuthTokenUrl, normalizeAccountHost } from './client';
import { NetSuite } from './endpoints';
import type { RouteSpec } from './endpoints/specs';
import { netSuiteSpecs } from './endpoints/specs';
import type {
	NetSuiteEndpointInputs,
	NetSuiteEndpointOutputs,
} from './endpoints/types';
import {
	NetSuiteEndpointInputSchemas,
	NetSuiteEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NetSuiteSchema } from './schema';

export type NetSuitePluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	accountId?: string;
	account?: string;
	clientId?: string;
	clientSecret?: string;
	certificateId?: string;
	privateKeyPem?: string;
	hooks?: InternalNetSuitePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof netSuiteEndpoints>;
};

export type NetSuiteContext = CorsairPluginContext<
	typeof NetSuiteSchema,
	NetSuitePluginOptions
>;

export type NetSuiteKeyBuilderContext =
	KeyBuilderContext<NetSuitePluginOptions>;

export type NetSuiteBoundEndpoints = BindEndpoints<typeof netSuiteEndpoints>;

type NetSuiteEndpoint<K extends keyof NetSuiteEndpointOutputs> =
	CorsairEndpoint<
		NetSuiteContext,
		NetSuiteEndpointInputs[K],
		NetSuiteEndpointOutputs[K]
	>;

export type NetSuiteEndpoints = {
	[K in keyof NetSuiteEndpointOutputs]: NetSuiteEndpoint<K>;
};

// Cast NetSuite to NetSuiteEndpoints to bind typed endpoint signatures to the constructed endpoint object map.
const netSuiteEndpoints = NetSuite as NetSuiteEndpoints;

export const netSuiteEndpointSchemas = Object.fromEntries(
	Object.keys(NetSuiteEndpointInputSchemas).map((key) => [
		key,
		{
			input:
				NetSuiteEndpointInputSchemas[
					key as keyof typeof NetSuiteEndpointInputSchemas
				],
			output:
				NetSuiteEndpointOutputSchemas[
					key as keyof typeof NetSuiteEndpointOutputSchemas
				],
		},
	]),
	// Necessity: Cast mapped schema entries through unknown to RequiredPluginEndpointSchemas.
	// Why stricter typing is not feasible: Object.fromEntries returns Record<string, unknown> and TypeScript cannot statically verify the dynamically reconstructed per-endpoint schema object map.
) as unknown as RequiredPluginEndpointSchemas<typeof netSuiteEndpoints>;

const defaultAuthType = 'oauth_2' as const;

// These operations either bootstrap OAuth or call a public NetSuite endpoint.
// They must not fail the keyBuilder just because no access token exists yet.
const tokenFreeOperations = new Set(
	Object.entries(netSuiteSpecs as Record<string, RouteSpec>)
		.filter(
			([, spec]) =>
				spec.auth === 'none' ||
				spec.custom === 'authorize-account' ||
				spec.custom === 'authorize-system' ||
				spec.custom === 'jwt-client-assertion',
		)
		.map(([key]) => key),
);

const netSuiteEndpointMeta = Object.fromEntries(
	Object.entries(netSuiteSpecs).map(([key, spec]) => [
		key,
		{
			riskLevel: spec.riskLevel,
			...(spec.riskLevel === 'destructive' ? { irreversible: true } : {}),
			description: spec.metaDescription,
		},
	]),
	// Object.fromEntries returns generic key-value pairs; cast to RequiredPluginEndpointMeta
	// because TypeScript cannot statically correlate the dynamic spec keys with netSuiteEndpoints.
) as RequiredPluginEndpointMeta<
	typeof netSuiteEndpoints
> satisfies RequiredPluginEndpointMeta<typeof netSuiteEndpoints>;

export const netSuiteAuthConfig = {
	oauth_2: {
		account: ['tenant_external_id', 'account_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseNetSuitePlugin<T extends NetSuitePluginOptions> = CorsairPlugin<
	'netsuite',
	typeof NetSuiteSchema,
	typeof netSuiteEndpoints,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNetSuitePlugin = BaseNetSuitePlugin<NetSuitePluginOptions>;

export type ExternalNetSuitePlugin<T extends NetSuitePluginOptions> =
	BaseNetSuitePlugin<T>;

export function netsuite<const T extends NetSuitePluginOptions>(
	incomingOptions: NetSuitePluginOptions & T = {} as NetSuitePluginOptions & T,
): ExternalNetSuitePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const accountId = options.accountId ?? options.account;
	const authBase = accountId
		? `https://${normalizeAccountHost(accountId)}.app.netsuite.com`
		: 'https://system.netsuite.com';
	return {
		id: 'netsuite',
		authConfig: netSuiteAuthConfig,
		schema: NetSuiteSchema,
		options: options,
		oauthConfig: {
			providerName: 'NetSuite',
			authUrl: `${authBase}/app/login/oauth2/authorize.nl`,
			tokenUrl: accountId
				? netSuiteOAuthTokenUrl(accountId)
				: 'https://system.netsuite.com/app/login/oauth2/token.nl',
			scopes: ['rest_webservices'],
			tokenAuthMethod: 'basic',
			requiresRegisteredRedirect: true,
		},
		hooks: options.hooks,
		webhookHooks: undefined,
		endpoints: netSuiteEndpoints,
		webhooks: {},
		endpointMeta: netSuiteEndpointMeta,
		endpointSchemas: netSuiteEndpointSchemas,
		webhookSchemas: undefined,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: NetSuiteKeyBuilderContext, source) => {
			const operation = ctx.meteredOperationId?.split('.').pop();
			if (
				source === 'endpoint' &&
				operation &&
				tokenFreeOperations.has(operation)
			) {
				return '';
			}
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				// Necessity: Cast ctx.keys through unknown to access the provider-specific get_account_id accessor.
				// Why stricter typing is not feasible: PluginKeyManager is generic across Corsair plugins and does not define provider-specific account key helpers.
				const resolvedAccount =
					options.accountId ??
					options.account ??
					(await (
						ctx.keys as unknown as {
							get_account_id?: () => Promise<string | null | undefined>;
						}
					).get_account_id?.());
				if (resolvedAccount) {
					return await getOAuthAccessToken(ctx, {
						plugin: 'netsuite',
						tokenUrl: netSuiteOAuthTokenUrl(resolvedAccount),
						tokenAuthMethod: 'basic',
					});
				}
				const token = await ctx.keys.get_access_token();
				if (token) return token;
			}
			throw new Error(
				`[auth-missing:netsuite:${ctx.authType}]: NetSuite access token or accountId is missing`,
			);
		},
	} satisfies InternalNetSuitePlugin;
}

export type { NetSuiteEndpointHandler } from './endpoints/run';
export type {
	NetSuiteEndpointInputs,
	NetSuiteEndpointOutputs,
} from './endpoints/types';
export { NetSuiteSchema } from './schema';
