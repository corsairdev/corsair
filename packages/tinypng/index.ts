import type {
	AuthTypes,
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
import { Image } from './endpoints';
import type {
	TinypngEndpointInputs,
	TinypngEndpointOutputs,
} from './endpoints/types';
import {
	TinypngEndpointInputSchemas,
	TinypngEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TinypngSchema } from './schema';

/* --------------------------------
 * Plugin options
 * -------------------------------- */

export type TinypngPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalTinypngPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof tinypngEndpointsNested>;
};

/* --------------------------------
 * Context
 * -------------------------------- */

export type TinypngContext = CorsairPluginContext<
	typeof TinypngSchema,
	TinypngPluginOptions
>;

export type TinypngKeyBuilderContext = KeyBuilderContext<TinypngPluginOptions>;

export type TinypngBoundEndpoints = BindEndpoints<
	typeof tinypngEndpointsNested
>;

/* --------------------------------
 * Endpoint types
 * -------------------------------- */

type TinypngEndpoint<K extends keyof TinypngEndpointOutputs> = CorsairEndpoint<
	TinypngContext,
	TinypngEndpointInputs[K],
	TinypngEndpointOutputs[K]
>;

export type TinypngEndpoints = {
	compress: TinypngEndpoint<'compress'>;
};

/* --------------------------------
 * Endpoints
 * -------------------------------- */

const tinypngEndpointsNested = {
	image: {
		compress: Image.compress,
	},
} as const;

/* --------------------------------
 * Webhooks
 *
 * TinyPNG does not currently use
 * webhooks for this plugin.
 * -------------------------------- */

const tinypngWebhooksNested = {} as const;

/* --------------------------------
 * Endpoint schemas
 * -------------------------------- */

export const tinypngEndpointSchemas = {
	'image.compress': {
		input: TinypngEndpointInputSchemas.compress,
		output: TinypngEndpointOutputSchemas.compress,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tinypngEndpointsNested
>;

/* --------------------------------
 * Endpoint metadata
 * -------------------------------- */

const tinypngEndpointMeta = {
	'image.compress': {
		riskLevel: 'write',
		description: 'Compress an image from a public URL using TinyPNG',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof tinypngEndpointsNested>;

/* --------------------------------
 * Authentication
 * -------------------------------- */

const defaultAuthType: AuthTypes = 'api_key' as const;

export const tinypngAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

/* --------------------------------
 * Plugin types
 * -------------------------------- */

export type BaseTinypngPlugin<T extends TinypngPluginOptions> = CorsairPlugin<
	'tinypng',
	typeof TinypngSchema,
	typeof tinypngEndpointsNested,
	typeof tinypngWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTinypngPlugin = BaseTinypngPlugin<TinypngPluginOptions>;

export type ExternalTinypngPlugin<T extends TinypngPluginOptions> =
	BaseTinypngPlugin<T>;

/* --------------------------------
 * Plugin
 * -------------------------------- */

export function tinypng<const T extends TinypngPluginOptions>(
	incomingOptions: TinypngPluginOptions & T = {} as TinypngPluginOptions & T,
): ExternalTinypngPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'tinypng',

		authConfig: tinypngAuthConfig,

		schema: TinypngSchema,

		options,

		hooks: options.hooks,

		endpoints: tinypngEndpointsNested,

		webhooks: tinypngWebhooksNested,

		endpointMeta: tinypngEndpointMeta,

		endpointSchemas: tinypngEndpointSchemas,

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		keyBuilder: async (ctx: TinypngKeyBuilderContext, source) => {
			/*
			 * Use the explicitly supplied API key first.
			 */
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			/*
			 * Otherwise retrieve the API key
			 * from the Corsair key system.
			 */
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();

				return key ?? '';
			}

			return '';
		},
	} satisfies InternalTinypngPlugin;
}

/* --------------------------------
 * Public types
 * -------------------------------- */

export type {
	CompressInput,
	CompressResponse,
	TinypngEndpointInputs,
	TinypngEndpointOutputs,
} from './endpoints/types';
