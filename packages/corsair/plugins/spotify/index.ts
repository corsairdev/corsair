import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginAuthConfig,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import type { SpotifyEndpointOutputs } from './endpoints/types';
import type {
	SpotifyWebhookOutputs,
	ExampleEvent,
} from './webhooks/types';
import { Albums, Artists, Library, MyData, Player, Playlists, Tracks } from './endpoints';
import { SpotifySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { errorHandlers } from './error-handlers';

/**
 * Plugin options type - configure authentication and behavior
 * 
 * AUTH CONFIGURATION:
 * - authType: The authentication method to use. Options:
 *   - 'api_key': For API key authentication (most common)
 *   - 'oauth_2': For OAuth 2.0 authentication
 *   - 'bot_token': For bot token authentication
 *   Update PickAuth<'api_key'> to include all auth types your plugin supports.
 *   Example: PickAuth<'api_key' | 'oauth_2'> for plugins that support both.
 * 
 * - key: Optional API key to use directly (bypasses key manager)
 * - webhookSecret: Optional webhook secret for signature verification
 */
export type SpotifyPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalSpotifyPlugin['hooks'];
	webhookHooks?: InternalSpotifyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
};

export type SpotifyContext = CorsairPluginContext<
	typeof SpotifySchema,
	SpotifyPluginOptions
>;

export type SpotifyKeyBuilderContext = KeyBuilderContext<SpotifyPluginOptions>;

export type SpotifyBoundEndpoints = BindEndpoints<typeof spotifyEndpointsNested>;

type SpotifyEndpoint<
	K extends keyof SpotifyEndpointOutputs,
	Input,
> = CorsairEndpoint<SpotifyContext, Input, SpotifyEndpointOutputs[K]>;

export type SpotifyEndpoints = {
	albumsGet: SpotifyEndpoint<'albumsGet', { id: string; market?: string }>;
	albumsGetNewReleases: SpotifyEndpoint<
		'albumsGetNewReleases',
		{ limit?: number; offset?: number; country?: string }
	>;
	albumsGetTracks: SpotifyEndpoint<
		'albumsGetTracks',
		{ id: string; limit?: number; offset?: number; market?: string }
	>;
	albumsSearch: SpotifyEndpoint<
		'albumsSearch',
		{
			q: string;
			type?: 'album';
			market?: string;
			limit?: number;
			offset?: number;
		}
	>;
	artistsGet: SpotifyEndpoint<'artistsGet', { id: string }>;
	artistsGetAlbums: SpotifyEndpoint<
		'artistsGetAlbums',
		{
			id: string;
			include_groups?: string;
			market?: string;
			limit?: number;
			offset?: number;
		}
	>;
	artistsGetRelatedArtists: SpotifyEndpoint<
		'artistsGetRelatedArtists',
		{ id: string }
	>;
	artistsGetTopTracks: SpotifyEndpoint<
		'artistsGetTopTracks',
		{ id: string; market?: string }
	>;
	artistsSearch: SpotifyEndpoint<
		'artistsSearch',
		{
			q: string;
			type?: 'artist';
			market?: string;
			limit?: number;
			offset?: number;
		}
	>;
	libraryGetLikedTracks: SpotifyEndpoint<
		'libraryGetLikedTracks',
		{ limit?: number; offset?: number; market?: string }
	>;
	myDataGetFollowedArtists: SpotifyEndpoint<
		'myDataGetFollowedArtists',
		{ type?: 'artist'; limit?: number; after?: string }
	>;
	playerAddToQueue: SpotifyEndpoint<
		'playerAddToQueue',
		{ uri: string; device_id?: string }
	>;
	playerGetCurrentlyPlaying: SpotifyEndpoint<
		'playerGetCurrentlyPlaying',
		{ market?: string; additional_types?: string }
	>;
	playerSkipToNext: SpotifyEndpoint<
		'playerSkipToNext',
		{ device_id?: string }
	>;
	playerPause: SpotifyEndpoint<'playerPause', { device_id?: string }>;
	playerSkipToPrevious: SpotifyEndpoint<
		'playerSkipToPrevious',
		{ device_id?: string }
	>;
	playerGetRecentlyPlayed: SpotifyEndpoint<
		'playerGetRecentlyPlayed',
		{ limit?: number; after?: number; before?: number }
	>;
	playerResume: SpotifyEndpoint<'playerResume', { device_id?: string }>;
	playerSetVolume: SpotifyEndpoint<
		'playerSetVolume',
		{ volume_percent: number; device_id?: string }
	>;
	playerStartPlayback: SpotifyEndpoint<
		'playerStartPlayback',
		{
			device_id?: string;
			context_uri?: string;
			uris?: string[];
			offset?: { position?: number; uri?: string };
			position_ms?: number;
		}
	>;
	playlistsAddItem: SpotifyEndpoint<
		'playlistsAddItem',
		{ playlist_id: string; uris: string[]; position?: number }
	>;
	playlistsCreate: SpotifyEndpoint<
		'playlistsCreate',
		{
			user_id: string;
			name: string;
			public?: boolean;
			collaborative?: boolean;
			description?: string;
		}
	>;
	playlistsGet: SpotifyEndpoint<
		'playlistsGet',
		{
			playlist_id: string;
			market?: string;
			fields?: string;
			additional_types?: string;
		}
	>;
	playlistsGetUserPlaylists: SpotifyEndpoint<
		'playlistsGetUserPlaylists',
		{ user_id?: string; limit?: number; offset?: number }
	>;
	playlistsGetTracks: SpotifyEndpoint<
		'playlistsGetTracks',
		{
			playlist_id: string;
			market?: string;
			fields?: string;
			limit?: number;
			offset?: number;
			additional_types?: string;
		}
	>;
	playlistsRemoveItem: SpotifyEndpoint<
		'playlistsRemoveItem',
		{
			playlist_id: string;
			tracks: Array<{ uri: string }>;
			snapshot_id?: string;
		}
	>;
	playlistsSearch: SpotifyEndpoint<
		'playlistsSearch',
		{
			q: string;
			type?: 'playlist';
			market?: string;
			limit?: number;
			offset?: number;
		}
	>;
	tracksGet: SpotifyEndpoint<'tracksGet', { id: string; market?: string }>;
	tracksGetAudioFeatures: SpotifyEndpoint<
		'tracksGetAudioFeatures',
		{ id: string }
	>;
	tracksSearch: SpotifyEndpoint<
		'tracksSearch',
		{
			q: string;
			type?: 'track';
			market?: string;
			limit?: number;
			offset?: number;
		}
	>;
};

type SpotifyWebhook<
	K extends keyof SpotifyWebhookOutputs,
	TEvent,
> = CorsairWebhook<SpotifyContext, TEvent, SpotifyWebhookOutputs[K]>;

export type SpotifyWebhooks = {
	example: SpotifyWebhook<'example', ExampleEvent>;
};

export type SpotifyBoundWebhooks = BindWebhooks<SpotifyWebhooks>;

const spotifyEndpointsNested = {
	albums: {
		get: Albums.get,
		getNewReleases: Albums.getNewReleases,
		getTracks: Albums.getTracks,
		search: Albums.search,
	},
	artists: {
		get: Artists.get,
		getAlbums: Artists.getAlbums,
		getRelatedArtists: Artists.getRelatedArtists,
		getTopTracks: Artists.getTopTracks,
		search: Artists.search,
	},
	library: {
		getLikedTracks: Library.getLikedTracks,
	},
	myData: {
		getFollowedArtists: MyData.getFollowedArtists,
	},
	player: {
		addToQueue: Player.addToQueue,
		getCurrentlyPlaying: Player.getCurrentlyPlaying,
		getRecentlyPlayed: Player.getRecentlyPlayed,
		pause: Player.pause,
		resume: Player.resume,
		setVolume: Player.setVolume,
		skipToNext: Player.skipToNext,
		skipToPrevious: Player.skipToPrevious,
		startPlayback: Player.startPlayback,
	},
	playlists: {
		addItem: Playlists.addItem,
		create: Playlists.create,
		get: Playlists.get,
		getTracks: Playlists.getTracks,
		getUserPlaylists: Playlists.getUserPlaylists,
		removeItem: Playlists.removeItem,
		search: Playlists.search,
	},
	tracks: {
		get: Tracks.get,
		getAudioFeatures: Tracks.getAudioFeatures,
		search: Tracks.search,
	},
} as const;

const spotifyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

const defaultAuthType: AuthTypes = 'oauth_2';

export const spotifyAuthConfig = {
	oauth_2: {
		account: ['one'] as const,
		scopes: [
			'user-read-private',
			'user-read-email',
			'user-read-playback-state',
			'user-modify-playback-state',
			'user-read-currently-playing',
			'user-read-recently-played',
			'user-library-read',
			'user-library-modify',
			'user-follow-read',
			'user-follow-modify',
			'playlist-read-private',
			'playlist-read-collaborative',
			'playlist-modify-public',
			'playlist-modify-private',
		] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseSpotifyPlugin<T extends SpotifyPluginOptions> = CorsairPlugin<
	'spotify',
	typeof SpotifySchema,
	typeof spotifyEndpointsNested,
	typeof spotifyWebhooksNested,
	T,
	typeof defaultAuthType
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalSpotifyPlugin = BaseSpotifyPlugin<SpotifyPluginOptions>;

export type ExternalSpotifyPlugin<T extends SpotifyPluginOptions> =
	BaseSpotifyPlugin<T>;

export function spotify<const T extends SpotifyPluginOptions>(
	incomingOptions: SpotifyPluginOptions & T = {} as SpotifyPluginOptions & T,
): ExternalSpotifyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'spotify',
		schema: SpotifySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: spotifyEndpointsNested,
		webhooks: spotifyWebhooksNested,
		/**
		 * Webhook matcher function - determines if an incoming request is a webhook for this plugin
		 * 
		 * WEBHOOK CONFIGURATION:
		 * Update this to check for headers that identify your provider's webhooks.
		 * Common patterns:
		 * - Check for signature headers (e.g., 'x-spotify-signature')
		 * - Check for user-agent strings
		 * - Check for specific path patterns
		 * 
		 * Example for multiple headers:
		 * pluginWebhookMatcher: (request) => {
		 *   const headers = request.headers;
		 *   return 'x-spotify-signature' in headers && 'x-spotify-timestamp' in headers;
		 * },
		 */
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-spotify-signature' in headers || 'spotify-webhook' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		/**
		 * Key builder function - retrieves the appropriate key/secret for API calls or webhook verification
		 * 
		 * AUTH CONFIGURATION:
		 * This function determines which key to use based on:
		 * - source: 'endpoint' (for API calls) or 'webhook' (for webhook verification)
		 * - ctx.authType: The authentication type being used
		 * 
		 * Priority order:
		 * 1. Direct options (options.key, options.webhookSecret)
		 * 2. Key manager (ctx.keys.get_api_key(), ctx.keys.get_access_token(), etc.)
		 * 
		 * For OAuth 2.0, you'll need to add:
		 * } else if (ctx.authType === 'oauth_2') {
		 *   const res = await ctx.keys.get_access_token();
		 *   if (!res) return '';
		 *   return res;
		 * }
		 * 
		 * For bot_token, you'll need to add:
		 * } else if (ctx.authType === 'bot_token') {
		 *   const res = await ctx.keys.get_bot_token();
		 *   if (!res) return '';
		 *   return res;
		 * }
		 */
		keyBuilder: async (ctx: SpotifyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();

				if (!res) {
					return '';
				}

				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();

				if (!res) {
					return '';
				}

				return res;
			}

			return '';
		},
	} satisfies InternalSpotifyPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	ExampleEvent,
	SpotifyWebhookOutputs,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	SpotifyEndpointOutputs,
	AlbumsGetResponse,
	AlbumsGetNewReleasesResponse,
	AlbumsGetTracksResponse,
	AlbumsSearchResponse,
	ArtistsGetResponse,
	ArtistsGetAlbumsResponse,
	ArtistsGetRelatedArtistsResponse,
	ArtistsGetTopTracksResponse,
	ArtistsSearchResponse,
	LibraryGetLikedTracksResponse,
	MyDataGetFollowedArtistsResponse,
	PlayerAddToQueueResponse,
	PlayerGetCurrentlyPlayingResponse,
	PlayerSkipToNextResponse,
	PlayerPauseResponse,
	PlayerSkipToPreviousResponse,
	PlayerGetRecentlyPlayedResponse,
	PlayerResumeResponse,
	PlayerSetVolumeResponse,
	PlayerStartPlaybackResponse,
	PlaylistsAddItemResponse,
	PlaylistsCreateResponse,
	PlaylistsGetResponse,
	PlaylistsGetUserPlaylistsResponse,
	PlaylistsGetTracksResponse,
	PlaylistsRemoveItemResponse,
	PlaylistsSearchResponse,
	TracksGetResponse,
	TracksGetAudioFeaturesResponse,
	TracksSearchResponse,
	Album,
	Artist,
	Track,
	Playlist,
	PlaylistTrack,
	AudioFeatures,
	CurrentlyPlaying,
} from './endpoints/types';
