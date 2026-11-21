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
import { Collections, Photos, Videos } from './endpoints';
import type {
	PexelsEndpointInputs,
	PexelsEndpointOutputs,
} from './endpoints/types';
import {
	PexelsEndpointInputSchemas,
	PexelsEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PexelsSchema } from './schema';

export type PexelsPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPexelsPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pexelsEndpointsNested>;
};

export type PexelsContext = CorsairPluginContext<
	typeof PexelsSchema,
	PexelsPluginOptions,
	undefined,
	typeof pexelsAuthConfig
>;

export type PexelsKeyBuilderContext = KeyBuilderContext<
	PexelsPluginOptions,
	typeof pexelsAuthConfig
>;

export type PexelsBoundEndpoints = BindEndpoints<typeof pexelsEndpointsNested>;

type PexelsEndpoint<K extends keyof PexelsEndpointOutputs> = CorsairEndpoint<
	PexelsContext,
	PexelsEndpointInputs[K],
	PexelsEndpointOutputs[K]
>;

export type PexelsEndpoints = {
	[K in keyof PexelsEndpointOutputs]: PexelsEndpoint<K>;
};

const pexelsEndpointsNested = {
	photos: {
		search: Photos.search,
		get: Photos.get,
		curated: Photos.curated,
	},
	videos: {
		search: Videos.search,
		get: Videos.get,
		popular: Videos.popular,
	},
	collections: {
		list: Collections.list,
		listFeatured: Collections.listFeatured,
		listMedia: Collections.listMedia,
	},
} as const;

export const pexelsEndpointSchemas = {
	'photos.search': {
		input: PexelsEndpointInputSchemas.photosSearch,
		output: PexelsEndpointOutputSchemas.photosSearch,
	},
	'photos.get': {
		input: PexelsEndpointInputSchemas.photosGet,
		output: PexelsEndpointOutputSchemas.photosGet,
	},
	'photos.curated': {
		input: PexelsEndpointInputSchemas.photosCurated,
		output: PexelsEndpointOutputSchemas.photosCurated,
	},
	'videos.search': {
		input: PexelsEndpointInputSchemas.videosSearch,
		output: PexelsEndpointOutputSchemas.videosSearch,
	},
	'videos.get': {
		input: PexelsEndpointInputSchemas.videosGet,
		output: PexelsEndpointOutputSchemas.videosGet,
	},
	'videos.popular': {
		input: PexelsEndpointInputSchemas.videosPopular,
		output: PexelsEndpointOutputSchemas.videosPopular,
	},
	'collections.list': {
		input: PexelsEndpointInputSchemas.collectionsList,
		output: PexelsEndpointOutputSchemas.collectionsList,
	},
	'collections.listFeatured': {
		input: PexelsEndpointInputSchemas.collectionsListFeatured,
		output: PexelsEndpointOutputSchemas.collectionsListFeatured,
	},
	'collections.listMedia': {
		input: PexelsEndpointInputSchemas.collectionsListMedia,
		output: PexelsEndpointOutputSchemas.collectionsListMedia,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pexelsEndpointsNested
>;

const pexelsEndpointMeta = {
	'photos.search': {
		riskLevel: 'read',
		description: 'Search photos by query, orientation, size and color',
	},
	'photos.get': {
		riskLevel: 'read',
		description: 'Read one photo by id with its rendition URLs',
	},
	'photos.curated': {
		riskLevel: 'read',
		description: 'List the curated photo feed',
	},
	'videos.search': {
		riskLevel: 'read',
		description: 'Search videos by query and orientation',
	},
	'videos.get': {
		riskLevel: 'read',
		description: 'Read one video by id with its downloadable renditions',
	},
	'videos.popular': {
		riskLevel: 'read',
		description: 'List the popular videos, filtered by size and duration',
	},
	'collections.list': {
		riskLevel: 'read',
		description: 'List the collections of the API key',
	},
	'collections.listFeatured': {
		riskLevel: 'read',
		description: 'List the featured collections',
	},
	'collections.listMedia': {
		riskLevel: 'read',
		description: 'List the photos and videos of a collection, filtered by type',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pexelsEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const pexelsAuthConfig = {
	api_key: {
		// Pexels issues one API key per account; no account-level field is
		// needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePexelsPlugin<T extends PexelsPluginOptions> = CorsairPlugin<
	'pexels',
	typeof PexelsSchema,
	typeof pexelsEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof pexelsAuthConfig
>;

export type InternalPexelsPlugin = BasePexelsPlugin<PexelsPluginOptions>;

export type ExternalPexelsPlugin<T extends PexelsPluginOptions> =
	BasePexelsPlugin<T>;

export function pexels<const T extends PexelsPluginOptions>(
	incomingOptions: PexelsPluginOptions & T = {} as PexelsPluginOptions & T,
): ExternalPexelsPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pexels',
		authConfig: pexelsAuthConfig,
		schema: PexelsSchema,
		options: options,
		hooks: options.hooks,
		endpoints: pexelsEndpointsNested,
		webhooks: {},
		endpointMeta: pexelsEndpointMeta,
		endpointSchemas: pexelsEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PexelsKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('pexels', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPexelsPlugin;
}

export type {
	Collection,
	CollectionMedia,
	PexelsEndpointInputs,
	PexelsEndpointOutputs,
	Photo,
	Video,
} from './endpoints/types';
