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
} from 'corsair/core';
import { getOAuthAccessToken } from 'corsair/core';
import type { FreshBooksAuthOptions } from './auth';
import {
	FRESHBOOKS_OAUTH_AUTH_URL,
	FRESHBOOKS_OAUTH_TOKEN_URL,
	freshbooksOAuthScopes,
} from './auth';
import { tryGetStoredKey } from './client';
import {
	freshbooksEndpointSchemas,
	freshbooksEndpointsNested,
	freshbooksEndpointMeta as generatedEndpointMeta,
} from './endpoints/catalog';
import type {
	FreshBooksEndpointInputs,
	FreshBooksEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { FreshBooksSchema } from './schema';
import {
	freshbooksWebhookSchemas,
	freshbooksWebhooksNested,
	matchFreshBooksWebhook,
} from './webhooks';

export type FreshBooksPluginOptions = FreshBooksAuthOptions & {
	authType?: PickAuth<'oauth_2'>;
	/** A FreshBooks OAuth access token, used as is (it expires after about 12 hours). Leave it out to use the connected account's token, which the plugin refreshes. */
	key?: string;
	/**
	 * The redirect URI registered on the FreshBooks app. FreshBooks' token
	 * endpoint asks for it on a refresh as well; set it when the plugin
	 * refreshes tokens itself (no Corsair Hub).
	 */
	oauthRedirectUri?: string;
	/**
	 * The webhook's verifier (the code FreshBooks posts when a callback is
	 * registered); it signs every delivery. Left out, the plugin reads the
	 * account's stored webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalFreshBooksPlugin['hooks'];
	webhookHooks?: InternalFreshBooksPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof freshbooksEndpointsNested>;
};

/** One FreshBooks OAuth connection per account; calls send `Authorization: Bearer <token>`. */
export const freshbooksAuthConfig = {
	oauth_2: {},
} as const satisfies PluginAuthConfig;

export type FreshBooksContext = CorsairPluginContext<
	typeof FreshBooksSchema,
	FreshBooksPluginOptions,
	undefined,
	typeof freshbooksAuthConfig
>;

export type FreshBooksKeyBuilderContext = KeyBuilderContext<
	FreshBooksPluginOptions,
	typeof freshbooksAuthConfig
>;

export type FreshBooksBoundEndpoints = BindEndpoints<
	typeof freshbooksEndpointsNested
>;

export type FreshBooksEndpoints = {
	[Id in keyof FreshBooksEndpointOutputs]: CorsairEndpoint<
		FreshBooksContext,
		FreshBooksEndpointInputs[Id],
		FreshBooksEndpointOutputs[Id]
	>;
};

export { freshbooksEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const freshbooksEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof freshbooksEndpointsNested
	>;

const defaultAuthType = 'oauth_2' as const;

export type BaseFreshBooksPlugin<T extends FreshBooksPluginOptions> =
	CorsairPlugin<
		'freshbooks',
		typeof FreshBooksSchema,
		typeof freshbooksEndpointsNested,
		typeof freshbooksWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof freshbooksAuthConfig
	>;

export type InternalFreshBooksPlugin =
	BaseFreshBooksPlugin<FreshBooksPluginOptions>;

export type ExternalFreshBooksPlugin<T extends FreshBooksPluginOptions> =
	BaseFreshBooksPlugin<T>;

export function freshbooks<const T extends FreshBooksPluginOptions>(
	// Safe: every FreshBooksPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: FreshBooksPluginOptions & T = {} as FreshBooksPluginOptions &
		T,
): ExternalFreshBooksPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'freshbooks',
		schema: FreshBooksSchema,
		options: options,
		hooks: options.hooks,
		endpoints: freshbooksEndpointsNested,
		webhooks: freshbooksWebhooksNested,
		webhookSchemas: freshbooksWebhookSchemas,
		webhookHooks: options.webhookHooks,
		authConfig: freshbooksAuthConfig,
		oauthConfig: {
			providerName: 'FreshBooks',
			authUrl: FRESHBOOKS_OAUTH_AUTH_URL,
			tokenUrl: FRESHBOOKS_OAUTH_TOKEN_URL,
			// FreshBooks takes one space-separated list; the app must have the same scopes ticked.
			scopes: [freshbooksOAuthScopes.join(' ')],
			tokenAuthMethod: 'body',
			// FreshBooks accepts only HTTPS redirect URIs registered on the app.
			requiresRegisteredRedirect: true,
		},
		endpointMeta: freshbooksEndpointMeta,
		endpointSchemas: freshbooksEndpointSchemas,
		pluginWebhookMatcher: matchFreshBooksWebhook,
		errorHandlers: (() => {
			// Core uses the first handler whose matcher accepts the error, and
			// DEFAULT matches everything, so DEFAULT always goes last; otherwise
			// it would shadow a handler a caller adds through options.
			const { DEFAULT: builtInDefault, ...specificDefaults } = errorHandlers;
			const { DEFAULT: callerDefault, ...callerHandlers } =
				options.errorHandlers || {};
			return {
				...specificDefaults,
				...callerHandlers,
				DEFAULT: callerDefault || builtInDefault,
			};
		})(),
		keyBuilder: async (ctx: FreshBooksKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				const secret = await tryGetStoredKey(() =>
					ctx.keys?.get_webhook_signature(),
				);
				// No secret yet is a valid state: the first delivery (callback.verify)
				// carries the verifier that becomes it. Signed events are refused
				// without one (webhooks/index.ts).
				return secret?.trim() ?? '';
			}
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			// The connected account's token. FreshBooks rotates the refresh token on
			// every refresh; core stores the new one.
			return getOAuthAccessToken(ctx, {
				plugin: 'freshbooks',
				tokenUrl: FRESHBOOKS_OAUTH_TOKEN_URL,
				tokenAuthMethod: 'body',
				bodyFormat: 'json',
				...(options.oauthRedirectUri
					? { extraParams: { redirect_uri: options.oauthRedirectUri } }
					: {}),
			});
		},
	} satisfies InternalFreshBooksPlugin;
}

export type { FreshBooksAuthOptions } from './auth';
export {
	FRESHBOOKS_API_BASE,
	FRESHBOOKS_OAUTH_AUTH_URL,
	FRESHBOOKS_OAUTH_TOKEN_URL,
	freshbooksOAuthScopes,
} from './auth';
export {
	createFreshBooksOperation,
	FRESHBOOKS_OPERATION_IDS,
	getFreshBooksInputSchema,
	getFreshBooksOutputSchema,
} from './endpoints';
export type {
	FreshBooksEndpointInputs,
	FreshBooksEndpointOutputs,
	FreshBooksJsonValue,
	FreshBooksOperationId,
} from './endpoints/types';
export {
	FreshBooksEndpointInputSchemas,
	FreshBooksEndpointOutputSchemas,
} from './endpoints/types';
export type {
	FreshBooksWebhookEvent,
	FreshBooksWebhookEventName,
} from './webhooks';
export { verifyFreshBooksSignature } from './webhooks';
