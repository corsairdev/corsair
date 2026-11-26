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
import { resolveGiteaInstance, tryGetStoredKey } from './client';
import {
	giteaEndpointMeta as generatedEndpointMeta,
	giteaEndpointSchemas,
	giteaEndpointsNested,
} from './endpoints/catalog';
import type {
	GiteaEndpointInputs,
	GiteaEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GiteaSchema } from './schema';
import {
	giteaWebhookSchemas as generatedWebhookSchemas,
	giteaWebhooksNested,
	isGiteaDelivery,
} from './webhooks';

export type GiteaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * A Gitea (or Forgejo) access token from <instance>/user/settings/applications.
	 * Its scopes (read:/write: repository, issue, organization, user, admin,
	 * package, notification, misc, activitypub) decide which operations work.
	 */
	key?: string;
	/**
	 * The Gitea site the token belongs to (`https://gitea.com`,
	 * `https://codeberg.org`, `https://git.example.com`), with or without
	 * `/api/v1`. Overrides the account's stored `instance_url`.
	 */
	instanceUrl?: string;
	/** The secret set on the Gitea webhook (`config.secret`); checks incoming deliveries. */
	webhookSecret?: string;
	hooks?: InternalGiteaPlugin['hooks'];
	webhookHooks?: InternalGiteaPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof giteaEndpointsNested>;
};

// Gitea is self-hosted: the token belongs to one instance, so the site URL is
// account config beside the key, and calls without it have nowhere to go.
export const giteaAuthConfig = {
	api_key: {
		account: ['instance_url'] as const,
	},
} as const satisfies PluginAuthConfig;

export type GiteaContext = CorsairPluginContext<
	typeof GiteaSchema,
	GiteaPluginOptions,
	undefined,
	typeof giteaAuthConfig
>;

export type GiteaKeyBuilderContext = KeyBuilderContext<
	GiteaPluginOptions,
	typeof giteaAuthConfig
>;

export type GiteaBoundEndpoints = BindEndpoints<typeof giteaEndpointsNested>;

export type GiteaBoundWebhooks = BindWebhooks<typeof giteaWebhooksNested>;

export type GiteaEndpoints = {
	[Id in keyof GiteaEndpointOutputs]: CorsairEndpoint<
		GiteaContext,
		GiteaEndpointInputs[Id],
		GiteaEndpointOutputs[Id]
	>;
};

export { giteaEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const giteaEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof giteaEndpointsNested
	>;

const giteaWebhookSchemas =
	generatedWebhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof giteaWebhooksNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseGiteaPlugin<T extends GiteaPluginOptions> = CorsairPlugin<
	'gitea',
	typeof GiteaSchema,
	typeof giteaEndpointsNested,
	typeof giteaWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof giteaAuthConfig
>;

export type InternalGiteaPlugin = BaseGiteaPlugin<GiteaPluginOptions>;

export type ExternalGiteaPlugin<T extends GiteaPluginOptions> =
	BaseGiteaPlugin<T>;

export function gitea<const T extends GiteaPluginOptions>(
	// Safe: every GiteaPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: GiteaPluginOptions & T = {} as GiteaPluginOptions & T,
): ExternalGiteaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gitea',
		authConfig: giteaAuthConfig,
		schema: GiteaSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: giteaEndpointsNested,
		webhooks: giteaWebhooksNested,
		endpointMeta: giteaEndpointMeta,
		endpointSchemas: giteaEndpointSchemas,
		webhookSchemas: giteaWebhookSchemas,
		pluginWebhookMatcher: isGiteaDelivery,
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
		keyBuilder: async (ctx: GiteaKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				return (
					(await tryGetStoredKey(() => ctx.keys?.get_webhook_signature())) ?? ''
				);
			}
			if (source !== 'endpoint') return '';

			const key =
				options.key ?? (await tryGetStoredKey(() => ctx.keys?.get_api_key()));
			// No key configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('gitea', 'api_key');
			// A key without its instance has nowhere to go: this throws
			// AuthMissingError too when neither the option nor the account's
			// instance_url is set.
			await resolveGiteaInstance({ options, keys: ctx.keys });
			return key;
		},
	} satisfies InternalGiteaPlugin;
}

export type { GiteaRequest } from './client';
export { normalizeInstanceUrl } from './client';
export {
	createGiteaOperation,
	GITEA_OPERATION_IDS,
	getGiteaInputSchema,
	getGiteaOutputSchema,
} from './endpoints';
export type { GiteaWebhookPayloads } from './endpoints/operation-types';
export type {
	GiteaEndpointInputs,
	GiteaEndpointOutputs,
	GiteaJsonValue,
	GiteaOperationId,
} from './endpoints/types';
export {
	GiteaEndpointInputSchemas,
	GiteaEndpointOutputSchemas,
} from './endpoints/types';
export type { GiteaWebhookId } from './webhooks';
export {
	giteaEventTypeOf,
	isGiteaDelivery,
	verifyGiteaWebhook,
} from './webhooks';
