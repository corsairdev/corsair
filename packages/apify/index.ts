import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	ApifyEndpoints,
	apifyOperations,
	buildApifyEndpointMeta,
	buildApifyEndpointSchemas,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { ApifySchema } from './schema';

const apifyEndpointsNested = ApifyEndpoints;
const apifyWebhooksNested = {} as const;

export type ApifyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalApifyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof apifyEndpointsNested>;
};

export type ApifyContext = CorsairPluginContext<
	typeof ApifySchema,
	ApifyPluginOptions
>;

export type ApifyKeyBuilderContext = KeyBuilderContext<ApifyPluginOptions>;

export type ApifyBoundEndpoints = BindEndpoints<typeof apifyEndpointsNested>;

export type ApifyBoundWebhooks = BindWebhooks<typeof apifyWebhooksNested>;

export const apifyEndpointSchemas = buildApifyEndpointSchemas(
	apifyOperations,
) satisfies RequiredPluginEndpointSchemas<typeof apifyEndpointsNested>;

const apifyWebhookSchemas = {} as const satisfies RequiredPluginWebhookSchemas<
	typeof apifyWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const apifyAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

const apifyEndpointMeta = buildApifyEndpointMeta(
	apifyOperations,
) satisfies RequiredPluginEndpointMeta<typeof apifyEndpointsNested>;

export type BaseApifyPlugin<T extends ApifyPluginOptions> = CorsairPlugin<
	'apify',
	typeof ApifySchema,
	typeof apifyEndpointsNested,
	typeof apifyWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof apifyAuthConfig
>;

export type InternalApifyPlugin = BaseApifyPlugin<ApifyPluginOptions>;

export type ExternalApifyPlugin<T extends ApifyPluginOptions> =
	BaseApifyPlugin<T>;

export function apify<const T extends ApifyPluginOptions>(
	incomingOptions: ApifyPluginOptions & T = {} as ApifyPluginOptions & T,
): ExternalApifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'apify',
		authConfig: apifyAuthConfig,
		schema: ApifySchema,
		options,
		hooks: options.hooks,
		endpoints: apifyEndpointsNested,
		webhooks: apifyWebhooksNested,
		endpointMeta: apifyEndpointMeta,
		endpointSchemas: apifyEndpointSchemas,
		webhookSchemas: apifyWebhookSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: (() => {
			// DEFAULT matches everything (`() => true`), so it must always be
			// evaluated last — otherwise caller-supplied handlers become dead code.
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: ApifyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('apify', 'api_key');
		},
	} satisfies InternalApifyPlugin;
}

export type {
	ApifyEndpointInputs,
	ApifyEndpointOutputs,
	ApifyOperationInput,
	ApifyOperationOutput,
} from './endpoints';
