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
import { tryGetStoredKey } from './client';
import {
	omnisendEndpointMeta as generatedEndpointMeta,
	omnisendEndpointSchemas,
	omnisendEndpointsNested,
} from './endpoints/catalog';
import type {
	OmnisendEndpointInputs,
	OmnisendEndpointOutputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { OmnisendSchema } from './schema';

export type OmnisendPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** An Omnisend API key (Store settings > API keys), with the scopes the operations you call need. */
	key?: string;
	/**
	 * A proxy in front of Omnisend's API. Leave it out for https://api.omnisend.com/api.
	 */
	baseUrl?: string;
	hooks?: InternalOmnisendPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof omnisendEndpointsNested>;
};

/** One API key per connected account, sent in the `Authorization` header. */
export const omnisendAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type OmnisendContext = CorsairPluginContext<
	typeof OmnisendSchema,
	OmnisendPluginOptions,
	undefined,
	typeof omnisendAuthConfig
>;

export type OmnisendKeyBuilderContext = KeyBuilderContext<
	OmnisendPluginOptions,
	typeof omnisendAuthConfig
>;

export type OmnisendBoundEndpoints = BindEndpoints<
	typeof omnisendEndpointsNested
>;

export type OmnisendEndpoints = {
	[Id in keyof OmnisendEndpointOutputs]: CorsairEndpoint<
		OmnisendContext,
		OmnisendEndpointInputs[Id],
		OmnisendEndpointOutputs[Id]
	>;
};

export { omnisendEndpointSchemas };

// One entry per operation, generated with the catalog (endpoints/catalog.ts).
const omnisendEndpointMeta =
	generatedEndpointMeta satisfies RequiredPluginEndpointMeta<
		typeof omnisendEndpointsNested
	>;

const defaultAuthType = 'api_key' as const;

export type BaseOmnisendPlugin<T extends OmnisendPluginOptions> = CorsairPlugin<
	'omnisend',
	typeof OmnisendSchema,
	typeof omnisendEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof omnisendAuthConfig
>;

export type InternalOmnisendPlugin = BaseOmnisendPlugin<OmnisendPluginOptions>;

export type ExternalOmnisendPlugin<T extends OmnisendPluginOptions> =
	BaseOmnisendPlugin<T>;

export function omnisend<const T extends OmnisendPluginOptions>(
	// Safe: every OmnisendPluginOptions field is optional, so an empty object satisfies it.
	incomingOptions: OmnisendPluginOptions & T = {} as OmnisendPluginOptions & T,
): ExternalOmnisendPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'omnisend',
		schema: OmnisendSchema,
		options: options,
		hooks: options.hooks,
		endpoints: omnisendEndpointsNested,
		webhooks: {},
		authConfig: omnisendAuthConfig,
		endpointMeta: omnisendEndpointMeta,
		endpointSchemas: omnisendEndpointSchemas,
		pluginWebhookMatcher: () => false,
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
		keyBuilder: async (ctx: OmnisendKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;

			// No key configured: AuthMissingError makes core ask the tenant to connect.
			const storedKey = await tryGetStoredKey(() => ctx.keys?.get_api_key());
			if (!storedKey) throw new AuthMissingError('omnisend', 'api_key');
			return storedKey;
		},
	} satisfies InternalOmnisendPlugin;
}

export {
	createOmnisendOperation,
	getOmnisendInputSchema,
	getOmnisendOutputSchema,
	OMNISEND_OPERATION_IDS,
} from './endpoints';
export type {
	OmnisendEndpointInputs,
	OmnisendEndpointOutputs,
	OmnisendJsonValue,
	OmnisendOperationId,
} from './endpoints/types';
export {
	OmnisendEndpointInputSchemas,
	OmnisendEndpointOutputSchemas,
} from './endpoints/types';
