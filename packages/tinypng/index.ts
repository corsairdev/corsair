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
import { AuthMissingError } from 'corsair/core';
import { Account, Images } from './endpoints';
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
	[K in keyof TinypngEndpointOutputs]: TinypngEndpoint<K>;
};

/* --------------------------------
 * Endpoints
 * -------------------------------- */

const tinypngEndpointsNested = {
	images: {
		shrink: Images.shrink,
		output: Images.output,
		transform: Images.transform,
		compressAndStoreInAzure: Images.compressAndStoreInAzure,
	},
	account: {
		getCompressionCount: Account.getCompressionCount,
	},
} as const;

const tinypngWebhooksNested = {} as const;

/* --------------------------------
 * Endpoint schemas
 * -------------------------------- */

export const tinypngEndpointSchemas = {
	'images.shrink': {
		input: TinypngEndpointInputSchemas.shrink,
		output: TinypngEndpointOutputSchemas.shrink,
	},
	'images.output': {
		input: TinypngEndpointInputSchemas.output,
		output: TinypngEndpointOutputSchemas.output,
	},
	'images.transform': {
		input: TinypngEndpointInputSchemas.transform,
		output: TinypngEndpointOutputSchemas.transform,
	},
	'images.compressAndStoreInAzure': {
		input: TinypngEndpointInputSchemas.compressAndStoreInAzure,
		output: TinypngEndpointOutputSchemas.compressAndStoreInAzure,
	},
	'account.getCompressionCount': {
		input: TinypngEndpointInputSchemas.getCompressionCount,
		output: TinypngEndpointOutputSchemas.getCompressionCount,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof tinypngEndpointsNested
>;

/* --------------------------------
 * Endpoint metadata
 * -------------------------------- */

const tinypngEndpointMeta = {
	'images.shrink': {
		riskLevel: 'write',
		description:
			'Compress an image from a URL or base64 bytes and return its Tinify image ID (uses one compression)',
	},
	'images.output': {
		riskLevel: 'read',
		description: 'Download a compressed image by its Tinify image ID as base64',
	},
	'images.transform': {
		riskLevel: 'write',
		description:
			'Resize, convert, fill the background of, or preserve metadata on a compressed image, optionally storing it on S3 or GCS',
	},
	'images.compressAndStoreInAzure': {
		riskLevel: 'write',
		description:
			'Compress an image and upload the result to Azure Blob Storage through a SAS URL',
	},
	'account.getCompressionCount': {
		riskLevel: 'read',
		description: 'Get the number of compressions made this calendar month',
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

// Safe: the default only applies when no options are passed, where T infers as {} and {} satisfies it;
// TypeScript cannot prove that for a generic default, and an overload would duplicate the signature.
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
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('tinypng', 'api_key');
				}
				return key;
			}

			return '';
		},
	} satisfies InternalTinypngPlugin;
}

/* --------------------------------
 * Public types
 * -------------------------------- */

export type {
	CompressAndStoreInAzureInput,
	CompressAndStoreInAzureResponse,
	GetCompressionCountInput,
	GetCompressionCountResponse,
	OutputInput,
	OutputResponse,
	ShrinkInput,
	ShrinkResponse,
	TinypngEndpointInputs,
	TinypngEndpointOutputs,
	TransformInput,
	TransformResponse,
} from './endpoints/types';
