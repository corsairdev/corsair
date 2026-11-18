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
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError, getOAuthAccessToken } from 'corsair/core';
import { AlbumsEndpoints, MediaItemsEndpoints } from './endpoints';
import type {
	GooglePhotosEndpointInputs,
	GooglePhotosEndpointOutputs,
} from './endpoints/types';
import {
	GooglePhotosEndpointInputSchemas,
	GooglePhotosEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { GooglePhotosSchema } from './schema';

export type GooglePhotosPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	hooks?: InternalGooglePhotosPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof googlePhotosEndpointsNested>;
};

/**
 * Two scopes, because the April 2025 change split the API in two: appending
 * needs `appendonly`, and reading or editing what the app created needs
 * `readonly.appcreateddata` and `edit.appcreateddata`. The old broad
 * `photoslibrary`, `photoslibrary.readonly` and `photoslibrary.sharing` scopes
 * were removed and would make the connect fail.
 */
export const googlePhotosAuthConfig = {
	oauth_2: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type GooglePhotosContext = CorsairPluginContext<
	typeof GooglePhotosSchema,
	GooglePhotosPluginOptions
>;

export type GooglePhotosKeyBuilderContext =
	KeyBuilderContext<GooglePhotosPluginOptions>;

export type GooglePhotosBoundEndpoints = BindEndpoints<
	typeof googlePhotosEndpointsNested
>;

type GooglePhotosEndpoint<K extends keyof GooglePhotosEndpointOutputs> =
	CorsairEndpoint<
		GooglePhotosContext,
		GooglePhotosEndpointInputs[K],
		GooglePhotosEndpointOutputs[K]
	>;

export type GooglePhotosEndpoints = {
	albumsList: GooglePhotosEndpoint<'albumsList'>;
	albumsGet: GooglePhotosEndpoint<'albumsGet'>;
	albumsCreate: GooglePhotosEndpoint<'albumsCreate'>;
	albumsUpdate: GooglePhotosEndpoint<'albumsUpdate'>;
	albumsAddEnrichment: GooglePhotosEndpoint<'albumsAddEnrichment'>;
	albumsBatchAddMediaItems: GooglePhotosEndpoint<'albumsBatchAddMediaItems'>;
	albumsBatchRemoveMediaItems: GooglePhotosEndpoint<'albumsBatchRemoveMediaItems'>;
	mediaItemsSearch: GooglePhotosEndpoint<'mediaItemsSearch'>;
	mediaItemsList: GooglePhotosEndpoint<'mediaItemsList'>;
	mediaItemsGet: GooglePhotosEndpoint<'mediaItemsGet'>;
	mediaItemsBatchGet: GooglePhotosEndpoint<'mediaItemsBatchGet'>;
	mediaItemsUpdate: GooglePhotosEndpoint<'mediaItemsUpdate'>;
	mediaItemsCreate: GooglePhotosEndpoint<'mediaItemsCreate'>;
};

const googlePhotosEndpointsNested = {
	albums: AlbumsEndpoints,
	mediaItems: MediaItemsEndpoints,
} as const;

export const googlePhotosEndpointSchemas = {
	'albums.list': {
		input: GooglePhotosEndpointInputSchemas.albumsList,
		output: GooglePhotosEndpointOutputSchemas.albumsList,
	},
	'albums.get': {
		input: GooglePhotosEndpointInputSchemas.albumsGet,
		output: GooglePhotosEndpointOutputSchemas.albumsGet,
	},
	'albums.create': {
		input: GooglePhotosEndpointInputSchemas.albumsCreate,
		output: GooglePhotosEndpointOutputSchemas.albumsCreate,
	},
	'albums.update': {
		input: GooglePhotosEndpointInputSchemas.albumsUpdate,
		output: GooglePhotosEndpointOutputSchemas.albumsUpdate,
	},
	'albums.addEnrichment': {
		input: GooglePhotosEndpointInputSchemas.albumsAddEnrichment,
		output: GooglePhotosEndpointOutputSchemas.albumsAddEnrichment,
	},
	'albums.batchAddMediaItems': {
		input: GooglePhotosEndpointInputSchemas.albumsBatchAddMediaItems,
		output: GooglePhotosEndpointOutputSchemas.albumsBatchAddMediaItems,
	},
	'albums.batchRemoveMediaItems': {
		input: GooglePhotosEndpointInputSchemas.albumsBatchRemoveMediaItems,
		output: GooglePhotosEndpointOutputSchemas.albumsBatchRemoveMediaItems,
	},
	'mediaItems.search': {
		input: GooglePhotosEndpointInputSchemas.mediaItemsSearch,
		output: GooglePhotosEndpointOutputSchemas.mediaItemsSearch,
	},
	'mediaItems.list': {
		input: GooglePhotosEndpointInputSchemas.mediaItemsList,
		output: GooglePhotosEndpointOutputSchemas.mediaItemsList,
	},
	'mediaItems.get': {
		input: GooglePhotosEndpointInputSchemas.mediaItemsGet,
		output: GooglePhotosEndpointOutputSchemas.mediaItemsGet,
	},
	'mediaItems.batchGet': {
		input: GooglePhotosEndpointInputSchemas.mediaItemsBatchGet,
		output: GooglePhotosEndpointOutputSchemas.mediaItemsBatchGet,
	},
	'mediaItems.update': {
		input: GooglePhotosEndpointInputSchemas.mediaItemsUpdate,
		output: GooglePhotosEndpointOutputSchemas.mediaItemsUpdate,
	},
	'mediaItems.create': {
		input: GooglePhotosEndpointInputSchemas.mediaItemsCreate,
		output: GooglePhotosEndpointOutputSchemas.mediaItemsCreate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof googlePhotosEndpointsNested
>;

const defaultAuthType = 'oauth_2' as const;

const googlePhotosEndpointMeta = {
	'albums.list': {
		riskLevel: 'read',
		description:
			"List the account's albums. Without a scope Google removed in 2025, only app-created albums are readable",
	},
	'albums.get': { riskLevel: 'read', description: 'Read one album' },
	'albums.create': {
		riskLevel: 'write',
		description: 'Create an album with a title',
	},
	'albums.update': {
		riskLevel: 'write',
		description:
			'Rename an album; the title is the only field the API lets an update change',
	},
	'albums.addEnrichment': {
		riskLevel: 'write',
		description:
			'Add a text note or a location to an app-created album, at a chosen position',
	},
	'albums.batchAddMediaItems': {
		riskLevel: 'write',
		description: 'Add up to 50 media items to an app-created album',
	},
	'albums.batchRemoveMediaItems': {
		riskLevel: 'destructive',
		description:
			'Remove up to 50 media items from an album. The items stay in the library, so this is reversible by adding them back',
	},
	'mediaItems.search': {
		riskLevel: 'read',
		description:
			'Search the library with date, content, feature and media-type filters, or list one album',
	},
	'mediaItems.list': {
		riskLevel: 'read',
		description:
			'List the library in the order Google returns it, 25 by default',
	},
	'mediaItems.get': { riskLevel: 'read', description: 'Read one media item' },
	'mediaItems.batchGet': {
		riskLevel: 'read',
		description:
			'Read up to one page of media items by id, with a per-id status',
	},
	'mediaItems.update': {
		riskLevel: 'write',
		description: "Change a media item's description, the only editable field",
	},
	'mediaItems.create': {
		riskLevel: 'write',
		description:
			"Upload bytes and create up to 50 media items, optionally in an album; uploads count toward the user's Google storage past 25MB",
	},
} satisfies RequiredPluginEndpointMeta<typeof googlePhotosEndpointsNested>;

export type BaseGooglePhotosPlugin<T extends GooglePhotosPluginOptions> =
	CorsairPlugin<
		'googlephotos',
		typeof GooglePhotosSchema,
		typeof googlePhotosEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof googlePhotosAuthConfig
	>;

export type InternalGooglePhotosPlugin =
	BaseGooglePhotosPlugin<GooglePhotosPluginOptions>;

export type ExternalGooglePhotosPlugin<T extends GooglePhotosPluginOptions> =
	BaseGooglePhotosPlugin<T>;

export function googlephotos<const T extends GooglePhotosPluginOptions>(
	incomingOptions: GooglePhotosPluginOptions &
		T = {} as GooglePhotosPluginOptions & T,
): ExternalGooglePhotosPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'googlephotos',
		authConfig: googlePhotosAuthConfig,
		schema: GooglePhotosSchema,
		options,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				// Uploading and creating albums.
				'https://www.googleapis.com/auth/photoslibrary.appendonly',
				// Reading what the app created.
				'https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata',
				// Editing it: descriptions, album membership, enrichments.
				'https://www.googleapis.com/auth/photoslibrary.edit.appcreateddata',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		endpoints: googlePhotosEndpointsNested,
		webhooks: {},
		endpointMeta: googlePhotosEndpointMeta,
		endpointSchemas: googlePhotosEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		// The Library API has no key auth and does not support service accounts:
		// every call is made as a signed-in user.
		keyBuilder: async (ctx: GooglePhotosKeyBuilderContext) => {
			if (ctx.authType !== 'oauth_2') {
				throw new AuthMissingError('googlephotos', 'oauth_2');
			}
			return getOAuthAccessToken(ctx, {
				plugin: 'googlephotos',
				tokenUrl: 'https://oauth2.googleapis.com/token',
			});
		},
	} satisfies InternalGooglePhotosPlugin;
}

export type { MediaBaseUrlOptions } from './client';
export { mediaBytesUrl } from './client';
export type {
	GooglePhotosEndpointInputs,
	GooglePhotosEndpointOutputSchemas,
	GooglePhotosEndpointOutputs,
} from './endpoints/types';
export { GooglePhotosSchema } from './schema';
