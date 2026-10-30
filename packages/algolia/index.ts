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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	algoliaEndpointSchemas,
	algoliaEndpointsNested,
	algoliaEndpointMeta as generatedAlgoliaEndpointMeta,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { AlgoliaSchema } from './schema';

export const algoliaAuthConfig = {
	api_key: {
		account: ['applicationId'] as const,
	},
} as const satisfies PluginAuthConfig;

export const algoliaEndpointMeta =
	generatedAlgoliaEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof algoliaEndpointsNested
	>;

export type AlgoliaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Algolia Application ID (stored as account credential when using managed auth). */
	applicationId?: string;
	/** Algolia API key (Admin, Write, or Search depending on operation). */
	key?: string;
	/** Default API region for multi-host endpoints (us or de). */
	region?: string;
	hooks?: InternalAlgoliaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof algoliaEndpointsNested>;
};

export type AlgoliaContext = CorsairPluginContext<
	typeof AlgoliaSchema,
	AlgoliaPluginOptions,
	undefined,
	typeof algoliaAuthConfig
>;

export type AlgoliaKeyBuilderContext = KeyBuilderContext<
	AlgoliaPluginOptions,
	typeof algoliaAuthConfig
>;

export type AlgoliaBoundEndpoints = BindEndpoints<
	typeof algoliaEndpointsNested
>;

export type AlgoliaEndpoints = typeof algoliaEndpointsNested;

const defaultAuthType: AuthTypes = 'api_key' as const;

export type BaseAlgoliaPlugin<T extends AlgoliaPluginOptions> = CorsairPlugin<
	'algolia',
	typeof AlgoliaSchema,
	typeof algoliaEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof algoliaAuthConfig
>;

export type InternalAlgoliaPlugin = BaseAlgoliaPlugin<AlgoliaPluginOptions>;

export type ExternalAlgoliaPlugin<T extends AlgoliaPluginOptions> =
	BaseAlgoliaPlugin<T>;

export function algolia<const T extends AlgoliaPluginOptions>(
	// Cast is safe: if the caller omits options entirely, an empty object is
	// immediately merged with defaults below, satisfying the T constraint.
	incomingOptions: AlgoliaPluginOptions & T = {} as AlgoliaPluginOptions & T,
): ExternalAlgoliaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
		region: incomingOptions.region ?? 'us',
	};

	const ensureApplicationId = async (ctx: AlgoliaKeyBuilderContext) => {
		if (options.applicationId) return;
		const applicationId = await ctx.keys.get_applicationId();
		if (!applicationId) {
			console.error(
				'[ALGOLIA] Application ID missing — connect Algolia or pass applicationId in plugin options.',
			);
			throw new AuthMissingError('algolia', 'api_key');
		}
	};

	return {
		id: 'algolia',
		schema: AlgoliaSchema,
		options,
		authConfig: algoliaAuthConfig,
		hooks: options.hooks,
		endpoints: algoliaEndpointsNested,
		webhooks: {},
		endpointMeta: algoliaEndpointMeta,
		endpointSchemas: algoliaEndpointSchemas,
		pluginWebhookMatcher: undefined,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AlgoliaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				await ensureApplicationId(ctx);
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const apiKey = await ctx.keys.get_api_key();
				if (!apiKey) {
					console.error(
						'[ALGOLIA] API key missing — connect Algolia or pass key in plugin options.',
					);
					throw new AuthMissingError('algolia', 'api_key');
				}

				await ensureApplicationId(ctx);

				return apiKey;
			}

			console.error(
				'[ALGOLIA] Authentication required for Algolia API requests.',
			);
			throw new AuthMissingError('algolia', 'api_key');
		},
	} satisfies InternalAlgoliaPlugin;
}

export type {
	AlgoliaEndpointInputs,
	AlgoliaEndpointOutputs,
} from './endpoints/types';

export { algoliaEndpointsNested, algoliaEndpointSchemas };
