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
import { AuthMissingError } from 'corsair/core';
import {
	normalizeSiteUrl,
	resolveWordpressSite,
	tryGetStoredKey,
} from './client';
import {
	wordpressEndpointMeta as generatedEndpointMeta,
	wordpressEndpointSchemas,
	wordpressEndpointsNested,
} from './endpoints/catalog';
import type {
	WordpressEndpointInputs,
	WordpressEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { WordpressSchema } from './schema';

export type WordpressPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/**
	 * An application password (Users → Profile → Application Passwords, or
	 * users.applicationPasswords.create). The user's role decides which
	 * operations work: an Administrator can do everything, an Editor or Author
	 * less.
	 */
	key?: string;
	/**
	 * The WordPress address (`https://example.com`, `https://example.com/blog`),
	 * with or without `/wp-json`. Overrides the account's stored `site_url`.
	 */
	siteUrl?: string;
	/** The login name the application password belongs to. Overrides the account's stored `username`. */
	username?: string;
	hooks?: InternalWordpressPlugin['hooks'];
	webhookHooks?: InternalWordpressPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof wordpressEndpointsNested>;
};

// WordPress is self-hosted: an application password belongs to one user on one
// site, so the site address and the login are account config beside the key.
export const wordpressAuthConfig = {
	api_key: {
		account: ['site_url', 'username'] as const,
	},
} as const satisfies PluginAuthConfig;

export type WordpressContext = CorsairPluginContext<
	typeof WordpressSchema,
	WordpressPluginOptions,
	undefined,
	typeof wordpressAuthConfig
>;

export type WordpressKeyBuilderContext = KeyBuilderContext<
	WordpressPluginOptions,
	typeof wordpressAuthConfig
>;

export type WordpressBoundEndpoints = BindEndpoints<
	typeof wordpressEndpointsNested
>;

export type WordpressEndpoints = {
	[Id in keyof WordpressEndpointOutputs]: CorsairEndpoint<
		WordpressContext,
		WordpressEndpointInputs[Id],
		WordpressEndpointOutputs[Id]
	>;
};

export { wordpressEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const wordpressEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof wordpressEndpointsNested
	>;

const wordpressWebhooksNested = {} as const;

const defaultAuthType = 'api_key' as const;

export type BaseWordpressPlugin<T extends WordpressPluginOptions> =
	CorsairPlugin<
		'wordpress',
		typeof WordpressSchema,
		typeof wordpressEndpointsNested,
		typeof wordpressWebhooksNested,
		T,
		typeof defaultAuthType,
		typeof wordpressAuthConfig
	>;

export type InternalWordpressPlugin =
	BaseWordpressPlugin<WordpressPluginOptions>;

export type ExternalWordpressPlugin<T extends WordpressPluginOptions> =
	BaseWordpressPlugin<T>;

export function wordpress<const T extends WordpressPluginOptions>(
	// Safe: every WordpressPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: WordpressPluginOptions & T = {} as WordpressPluginOptions &
		T,
): ExternalWordpressPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'wordpress',
		authConfig: wordpressAuthConfig,
		schema: WordpressSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: wordpressEndpointsNested,
		webhooks: wordpressWebhooksNested,
		endpointMeta: wordpressEndpointMeta,
		endpointSchemas: wordpressEndpointSchemas,
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
		keyBuilder: async (ctx: WordpressKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';

			if (options.key) {
				await resolveWordpressSite({ options, keys: ctx.keys });
				return options.key;
			}
			const key = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			// No key configured: AuthMissingError makes core ask the tenant to connect.
			if (!key) throw new AuthMissingError('wordpress', 'api_key');
			if (options.siteUrl) {
				// The stored password belongs to the stored site. A siteUrl option
				// pointing elsewhere would hand it to another host, so that pairing
				// needs its own key.
				const stored = await tryGetStoredKey(
					() => ctx.keys?.get_site_url?.() ?? Promise.resolve(null),
				);
				if (
					!stored?.trim() ||
					normalizeSiteUrl(stored) !== normalizeSiteUrl(options.siteUrl)
				) {
					throw new AuthMissingError(
						'wordpress',
						'api_key',
						'[wordpress] the stored application password belongs to another site than the siteUrl option: pass key with siteUrl, or connect an account for that site',
					);
				}
			}
			// A password without its site or login has nowhere to go: this throws
			// AuthMissingError too when neither the option nor the account sets them.
			await resolveWordpressSite({ options, keys: ctx.keys });
			return key;
		},
	} satisfies InternalWordpressPlugin;
}

export type { WordpressRequest } from './client';
export { normalizeSiteUrl } from './client';
export {
	createWordpressOperation,
	getWordpressInputSchema,
	getWordpressOutputSchema,
	WORDPRESS_OPERATION_IDS,
} from './endpoints';
export type {
	WordpressEndpointInputs,
	WordpressEndpointOutputs,
	WordpressJsonValue,
	WordpressOperationId,
} from './endpoints/types';
export {
	WordpressEndpointInputSchemas,
	WordpressEndpointOutputSchemas,
} from './endpoints/types';
