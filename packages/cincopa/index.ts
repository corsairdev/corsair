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
import { Assets, Gallery, General } from './endpoints';
import type {
	CincopaEndpointInputs,
	CincopaEndpointOutputs,
} from './endpoints/types';
import {
	CincopaEndpointInputSchemas,
	CincopaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { CincopaSchema } from './schema';

export type CincopaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalCincopaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof cincopaEndpointsNested>;
};

export type CincopaContext = CorsairPluginContext<
	typeof CincopaSchema,
	CincopaPluginOptions
>;

export type CincopaKeyBuilderContext = KeyBuilderContext<CincopaPluginOptions>;

export type CincopaBoundEndpoints = BindEndpoints<
	typeof cincopaEndpointsNested
>;

type CincopaEndpoint<K extends keyof CincopaEndpointOutputs> = CorsairEndpoint<
	CincopaContext,
	CincopaEndpointInputs[K],
	CincopaEndpointOutputs[K]
>;

export type CincopaEndpoints = {
	galleryList: CincopaEndpoint<'galleryList'>;
	ping: CincopaEndpoint<'ping'>;
	uploadFromUrl: CincopaEndpoint<'uploadFromUrl'>;
	getUploadFromUrlStatus: CincopaEndpoint<'getUploadFromUrlStatus'>;
	abortUploadFromUrl: CincopaEndpoint<'abortUploadFromUrl'>;
	getUploadIframe: CincopaEndpoint<'getUploadIframe'>;
};

const cincopaEndpointsNested = {
	gallery: {
		list: Gallery.list,
	},
	general: {
		ping: General.ping,
		getUploadIframe: General.getUploadIframe,
	},
	asset: {
		uploadFromUrl: Assets.uploadFromUrl,
		getUploadFromUrlStatus: Assets.getUploadFromUrlStatus,
		abortUploadFromUrl: Assets.abortUploadFromUrl,
	},
} as const;

export const cincopaEndpointSchemas = {
	'gallery.list': {
		input: CincopaEndpointInputSchemas.galleryList,
		output: CincopaEndpointOutputSchemas.galleryList,
	},
	'general.ping': {
		input: CincopaEndpointInputSchemas.ping,
		output: CincopaEndpointOutputSchemas.ping,
	},
	'general.getUploadIframe': {
		input: CincopaEndpointInputSchemas.getUploadIframe,
		output: CincopaEndpointOutputSchemas.getUploadIframe,
	},
	'asset.uploadFromUrl': {
		input: CincopaEndpointInputSchemas.uploadFromUrl,
		output: CincopaEndpointOutputSchemas.uploadFromUrl,
	},
	'asset.getUploadFromUrlStatus': {
		input: CincopaEndpointInputSchemas.getUploadFromUrlStatus,
		output: CincopaEndpointOutputSchemas.getUploadFromUrlStatus,
	},
	'asset.abortUploadFromUrl': {
		input: CincopaEndpointInputSchemas.abortUploadFromUrl,
		output: CincopaEndpointOutputSchemas.abortUploadFromUrl,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof cincopaEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const cincopaEndpointMeta = {
	'gallery.list': {
		riskLevel: 'read',
		description: 'List galleries',
	},
	'general.ping': {
		riskLevel: 'read',
		description: 'Validate the Cincopa API connection',
	},
	'general.getUploadIframe': {
		riskLevel: 'read',
		description: 'Get an embeddable upload iframe URL for a gallery',
	},
	'asset.uploadFromUrl': {
		riskLevel: 'write',
		description: 'Start uploading an asset from a remote URL',
	},
	'asset.getUploadFromUrlStatus': {
		riskLevel: 'read',
		description: 'Check the status of an asset upload from URL',
	},
	'asset.abortUploadFromUrl': {
		riskLevel: 'write',
		description: 'Abort an in-progress asset upload from URL',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof cincopaEndpointsNested>;

export const cincopaAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseCincopaPlugin<T extends CincopaPluginOptions> = CorsairPlugin<
	'cincopa',
	typeof CincopaSchema,
	typeof cincopaEndpointsNested,
	never,
	T,
	typeof defaultAuthType
>;

export type InternalCincopaPlugin = BaseCincopaPlugin<CincopaPluginOptions>;

export type ExternalCincopaPlugin<T extends CincopaPluginOptions> =
	BaseCincopaPlugin<T>;

export function cincopa<const T extends CincopaPluginOptions>(
	incomingOptions: CincopaPluginOptions & T = {} as CincopaPluginOptions & T,
): ExternalCincopaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'cincopa',
		authConfig: cincopaAuthConfig,
		schema: CincopaSchema,
		options: options,
		hooks: options.hooks,
		endpoints: cincopaEndpointsNested,
		endpointMeta: cincopaEndpointMeta,
		endpointSchemas: cincopaEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: CincopaKeyBuilderContext, source) => {
			if (source !== 'endpoint') {
				throw new AuthMissingError('cincopa', 'api_key');
			}

			const configuredKey = options.key?.trim();
			if (configuredKey) {
				return configuredKey;
			}

			const res = await ctx.keys?.get_api_key();
			const storedKey = res?.trim();
			if (!storedKey) {
				throw new AuthMissingError('cincopa', 'api_key');
			}

			return storedKey;
		},
	} satisfies InternalCincopaPlugin;
}

export type {
	CincopaEndpointInputs,
	CincopaEndpointOutputs,
	GalleryListInput,
	GalleryListResponse,
} from './endpoints/types';
