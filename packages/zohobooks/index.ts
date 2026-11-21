import type {
	AuthTypes,
	BindWebhooks,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	EndpointTree,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { getOAuthAccessToken } from 'corsair/core';
import { zohoBooksOAuthAuthUrl, zohoBooksOAuthTokenUrl } from './client';
import type { ZohoBooksEndpointKeyTree } from './endpoints/generated';
import {
	zohoBooksEndpointMeta,
	zohoBooksEndpointSchemas,
	zohoBooksEndpointsNested,
} from './endpoints/generated';
import { errorHandlers } from './error-handlers';
import { zohoBooksOAuthScopes } from './openapi';
import { ZohoBooksSchema } from './schema';
import type { ZohoBooksRegion } from './schema/openapi-types';
import type { BindZohoBooksOperationEndpoints } from './schema/operation-types';

const zohoBooksWebhooks = {} as const;
const zohoBooksWebhookSchemas = {} satisfies RequiredPluginWebhookSchemas<
	typeof zohoBooksWebhooks
>;
const zohoBooksEndpointMetaValidated =
	zohoBooksEndpointMeta satisfies RequiredPluginEndpointMeta<ZohoBooksEndpointKeyTree>;
const zohoBooksEndpointSchemasValidated =
	zohoBooksEndpointSchemas satisfies RequiredPluginEndpointSchemas<ZohoBooksEndpointKeyTree>;

export const zohoBooksAuthConfig = {
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type ZohoBooksPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	/** Zoho Books data center. Defaults to US. China is excluded until Zoho documents its Books OAuth Accounts host. */
	region?: ZohoBooksRegion;
	hooks?: InternalZohoBooksPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<ZohoBooksEndpointKeyTree>;
};

export type ZohoBooksContext = CorsairPluginContext<
	typeof ZohoBooksSchema,
	ZohoBooksPluginOptions,
	undefined,
	typeof zohoBooksAuthConfig
>;

export type ZohoBooksKeyBuilderContext = KeyBuilderContext<
	ZohoBooksPluginOptions,
	typeof zohoBooksAuthConfig
>;

export type ZohoBooksBoundEndpoints = BindZohoBooksOperationEndpoints<
	typeof zohoBooksEndpointsNested
>;

export type ZohoBooksBoundWebhooks = BindWebhooks<typeof zohoBooksWebhooks>;

export type BaseZohoBooksPlugin<T extends ZohoBooksPluginOptions> =
	CorsairPlugin<
		'zohobooks',
		typeof ZohoBooksSchema,
		EndpointTree,
		typeof zohoBooksWebhooks,
		T,
		typeof defaultAuthType
	> & { endpoints?: typeof zohoBooksEndpointsNested };

export type InternalZohoBooksPlugin =
	BaseZohoBooksPlugin<ZohoBooksPluginOptions>;

export type ExternalZohoBooksPlugin<T extends ZohoBooksPluginOptions> =
	BaseZohoBooksPlugin<T>;

const defaultAuthType: AuthTypes = 'oauth_2' as const;

export function zohobooks<const T extends ZohoBooksPluginOptions>(
	incomingOptions: ZohoBooksPluginOptions & T = {} as ZohoBooksPluginOptions &
		T,
) {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const plugin: Omit<
		ExternalZohoBooksPlugin<T>,
		'endpoints' | 'endpointMeta' | 'endpointSchemas'
	> = {
		id: 'zohobooks',
		authConfig: zohoBooksAuthConfig,
		oauthConfig: {
			providerName: 'Zoho Books',
			authUrl: zohoBooksOAuthAuthUrl(options.region),
			tokenUrl: zohoBooksOAuthTokenUrl(options.region),
			// Zoho Books documents comma-separated scope names and offline refresh tokens.
			scopes: [zohoBooksOAuthScopes.join(',')],
			authParams: { access_type: 'offline', prompt: 'consent' },
			tokenAuthMethod: 'body',
		},
		schema: ZohoBooksSchema,
		options,
		hooks: options.hooks,
		webhooks: zohoBooksWebhooks,
		webhookSchemas: zohoBooksWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: {
			...callers,
			...builtIns,
			...callers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: ZohoBooksKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			return getOAuthAccessToken(ctx, {
				plugin: 'zohobooks',
				tokenUrl: zohoBooksOAuthTokenUrl(ctx.options.region),
				tokenAuthMethod: 'body',
			});
		},
	};
	return Object.assign(plugin, {
		endpoints: zohoBooksEndpointsNested,
		endpointMeta: zohoBooksEndpointMetaValidated,
		endpointSchemas: zohoBooksEndpointSchemasValidated,
	});
}

export type {
	JsonScalar,
	JsonValue,
	ZohoBooksBinaryFile,
	ZohoBooksBinaryOutput,
	ZohoBooksOperationDefinition,
	ZohoBooksOperationInput,
	ZohoBooksOperationOutput,
	ZohoBooksRegion,
} from './schema/openapi-types';
export type {
	BindZohoBooksOperationEndpoints,
	ZohoBooksOperationId,
	ZohoBooksOperationInputFor,
	ZohoBooksOperationOutputFor,
} from './schema/operation-types';

export type ZohoBooksEndpoints = ZohoBooksBoundEndpoints;
export type ZohoBooksWebhooks = ZohoBooksBoundWebhooks;

export const zohoBooksApiReference =
	'https://www.zoho.com/books/api/v3/introduction/';

export type { RequiredPluginEndpointMeta, RequiredPluginEndpointSchemas };
