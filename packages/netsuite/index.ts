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
) as unknown as RequiredPluginEndpointSchemas<typeof netSuiteEndpoints>;

const defaultAuthType = 'oauth_2' as const;

const netSuiteEndpointMeta = Object.fromEntries(
	Object.entries(netSuiteSpecs).map(([key, spec]) => [
		key,
		{
			riskLevel: spec.riskLevel,
			...(spec.riskLevel === 'destructive' ? { irreversible: true } : {}),
			description: spec.metaDescription,
		},
	]),
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
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
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
