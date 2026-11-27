import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { tryGetStoredKey } from './client';
import {
	netlifyEndpointMeta as generatedEndpointMeta,
	netlifyEndpointSchemas,
	netlifyEndpointsNested,
} from './endpoints/catalog';
import type {
	NetlifyEndpointInputs,
	NetlifyEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { NetlifySchema } from './schema';
import {
	netlifyWebhookSchemas as generatedWebhookSchemas,
	isNetlifyDelivery,
	netlifyWebhooksNested,
} from './webhooks';

export type NetlifyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A Netlify personal access token (User settings > Applications > Personal
	 * access tokens) or an OAuth access token. It acts as the user: every team
	 * and site that user can reach.
	 */
	key?: string;
	/**
	 * The JWS secret set on an outgoing webhook (`data.signature_secret` on
	 * hooks.create); checks incoming deliveries.
	 */
	webhookSecret?: string;
	hooks?: InternalNetlifyPlugin['hooks'];
	webhookHooks?: InternalNetlifyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof netlifyEndpointsNested>;
};

// A token reaches every team the user belongs to: team and site ids are
// per-call inputs, not account config.
export const netlifyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type NetlifyContext = CorsairPluginContext<
	typeof NetlifySchema,
	NetlifyPluginOptions,
	undefined,
	typeof netlifyAuthConfig
>;

export type NetlifyKeyBuilderContext = KeyBuilderContext<
	NetlifyPluginOptions,
	typeof netlifyAuthConfig
>;

export type NetlifyBoundEndpoints = BindEndpoints<
	typeof netlifyEndpointsNested
>;

export type NetlifyBoundWebhooks = BindWebhooks<typeof netlifyWebhooksNested>;

export type NetlifyEndpoints = {
	[Id in keyof NetlifyEndpointOutputs]: CorsairEndpoint<
		NetlifyContext,
		NetlifyEndpointInputs[Id],
		NetlifyEndpointOutputs[Id]
	>;
};

export { netlifyEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const netlifyEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof netlifyEndpointsNested
	>;

const netlifyWebhookSchemas =
	generatedWebhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof netlifyWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseNetlifyPlugin<T extends NetlifyPluginOptions> = CorsairPlugin<
	'netlify',
	typeof NetlifySchema,
	typeof netlifyEndpointsNested,
	typeof netlifyWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof netlifyAuthConfig
>;

export type InternalNetlifyPlugin = BaseNetlifyPlugin<NetlifyPluginOptions>;

export type ExternalNetlifyPlugin<T extends NetlifyPluginOptions> =
	BaseNetlifyPlugin<T>;

export function netlify<const T extends NetlifyPluginOptions>(
	// Safe: every NetlifyPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: NetlifyPluginOptions & T = {} as NetlifyPluginOptions & T,
): ExternalNetlifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'netlify',
		authConfig: netlifyAuthConfig,
		schema: NetlifySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: netlifyEndpointsNested,
		webhooks: netlifyWebhooksNested,
		endpointMeta: netlifyEndpointMeta,
		endpointSchemas: netlifyEndpointSchemas,
		webhookSchemas: netlifyWebhookSchemas,
		pluginWebhookMatcher: isNetlifyDelivery,
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
		keyBuilder: async (ctx: NetlifyKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				return (
					(await tryGetStoredKey(() => ctx.keys?.get_webhook_signature())) ?? ''
				);
			}
			if (source !== 'endpoint') return '';

			if (options.key) return options.key;
			const key = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			// No key configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('netlify', 'api_key');
			return key;
		},
	} satisfies InternalNetlifyPlugin;
}

export type { NetlifyRequest } from './client';
export {
	createNetlifyOperation,
	getNetlifyInputSchema,
	getNetlifyOutputSchema,
	NETLIFY_OPERATION_IDS,
} from './endpoints';
export type { NetlifyWebhookPayloads } from './endpoints/operation-types';
export type {
	NetlifyEndpointInputs,
	NetlifyEndpointOutputs,
	NetlifyJsonValue,
	NetlifyOperationId,
} from './endpoints/types';
export {
	NetlifyEndpointInputSchemas,
	NetlifyEndpointOutputSchemas,
} from './endpoints/types';
export type { NetlifyWebhookId } from './webhooks';
export {
	isNetlifyDelivery,
	netlifyEventTypeOf,
	verifyNetlifyWebhook,
} from './webhooks';
