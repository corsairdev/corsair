import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { getValidAccessToken } from './client';
import {
	Albums,
	Artists,
	Library,
	MyData,
	Player,
	Playlists,
	Tracks,
} from './endpoints';
import type {
	SpotifyEndpointInputs,
	SpotifyEndpointOutputs,
} from './endpoints/types';
import {
	SpotifyEndpointInputSchemas,
	SpotifyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { SpotifySchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import type { ExampleEvent, SpotifyWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

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
	/**
	 * Permission configuration for the Spotify plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Spotify endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof spotifyEndpointsNested>;
};

export type SpotifyContext = CorsairPluginContext<
	typeof SpotifySchema,
	SpotifyPluginOptions
>;

export type SpotifyKeyBuilderContext = KeyBuilderContext<SpotifyPluginOptions>;

export type SpotifyBoundEndpoints = BindEndpoints<
	typeof spotifyEndpointsNested
>;

type SpotifyEndpoint<K extends keyof SpotifyEndpointOutputs> = CorsairEndpoint<
	SpotifyContext,
	SpotifyEndpointInputs[K],
	SpotifyEndpointOutputs[K]
>;

export type SpotifyEndpoints = {
	albumsGet: SpotifyEndpoint<'albumsGet'>;
	albumsGetNewReleases: SpotifyEndpoint<'albumsGetNewReleases'>;
	albumsGetTracks: SpotifyEndpoint<'albumsGetTracks'>;
	albumsSearch: SpotifyEndpoint<'albumsSearch'>;
	artistsGet: SpotifyEndpoint<'artistsGet'>;
	artistsGetAlbums: SpotifyEndpoint<'artistsGetAlbums'>;
	artistsGetRelatedArtists: SpotifyEndpoint<'artistsGetRelatedArtists'>;
	artistsGetTopTracks: SpotifyEndpoint<'artistsGetTopTracks'>;
	artistsSearch: SpotifyEndpoint<'artistsSearch'>;
	libraryGetLikedTracks: SpotifyEndpoint<'libraryGetLikedTracks'>;
	myDataGetFollowedArtists: SpotifyEndpoint<'myDataGetFollowedArtists'>;
	playerAddToQueue: SpotifyEndpoint<'playerAddToQueue'>;
	playerGetCurrentlyPlaying: SpotifyEndpoint<'playerGetCurrentlyPlaying'>;
	playerSkipToNext: SpotifyEndpoint<'playerSkipToNext'>;
	playerPause: SpotifyEndpoint<'playerPause'>;
	playerSkipToPrevious: SpotifyEndpoint<'playerSkipToPrevious'>;
	playerGetRecentlyPlayed: SpotifyEndpoint<'playerGetRecentlyPlayed'>;
	playerResume: SpotifyEndpoint<'playerResume'>;
	playerSetVolume: SpotifyEndpoint<'playerSetVolume'>;
	playerStartPlayback: SpotifyEndpoint<'playerStartPlayback'>;
	playlistsAddItem: SpotifyEndpoint<'playlistsAddItem'>;
	playlistsCreate: SpotifyEndpoint<'playlistsCreate'>;
	playlistsGet: SpotifyEndpoint<'playlistsGet'>;
	playlistsGetUserPlaylists: SpotifyEndpoint<'playlistsGetUserPlaylists'>;
	playlistsGetTracks: SpotifyEndpoint<'playlistsGetTracks'>;
	playlistsRemoveItem: SpotifyEndpoint<'playlistsRemoveItem'>;
	playlistsSearch: SpotifyEndpoint<'playlistsSearch'>;
	tracksGet: SpotifyEndpoint<'tracksGet'>;
	tracksGetAudioFeatures: SpotifyEndpoint<'tracksGetAudioFeatures'>;
	tracksSearch: SpotifyEndpoint<'tracksSearch'>;
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

export const spotifyEndpointSchemas = {
	'albums.get': {
		input: SpotifyEndpointInputSchemas.albumsGet,
		output: SpotifyEndpointOutputSchemas.albumsGet,
	},
	'albums.getNewReleases': {
		input: SpotifyEndpointInputSchemas.albumsGetNewReleases,
		output: SpotifyEndpointOutputSchemas.albumsGetNewReleases,
	},
	'albums.getTracks': {
		input: SpotifyEndpointInputSchemas.albumsGetTracks,
		output: SpotifyEndpointOutputSchemas.albumsGetTracks,
	},
	'albums.search': {
		input: SpotifyEndpointInputSchemas.albumsSearch,
		output: SpotifyEndpointOutputSchemas.albumsSearch,
	},
	'artists.get': {
		input: SpotifyEndpointInputSchemas.artistsGet,
		output: SpotifyEndpointOutputSchemas.artistsGet,
	},
	'artists.getAlbums': {
		input: SpotifyEndpointInputSchemas.artistsGetAlbums,
		output: SpotifyEndpointOutputSchemas.artistsGetAlbums,
	},
	'artists.getRelatedArtists': {
		input: SpotifyEndpointInputSchemas.artistsGetRelatedArtists,
		output: SpotifyEndpointOutputSchemas.artistsGetRelatedArtists,
	},
	'artists.getTopTracks': {
		input: SpotifyEndpointInputSchemas.artistsGetTopTracks,
		output: SpotifyEndpointOutputSchemas.artistsGetTopTracks,
	},
	'artists.search': {
		input: SpotifyEndpointInputSchemas.artistsSearch,
		output: SpotifyEndpointOutputSchemas.artistsSearch,
	},
	'library.getLikedTracks': {
		input: SpotifyEndpointInputSchemas.libraryGetLikedTracks,
		output: SpotifyEndpointOutputSchemas.libraryGetLikedTracks,
	},
	'myData.getFollowedArtists': {
		input: SpotifyEndpointInputSchemas.myDataGetFollowedArtists,
		output: SpotifyEndpointOutputSchemas.myDataGetFollowedArtists,
	},
	'player.addToQueue': {
		input: SpotifyEndpointInputSchemas.playerAddToQueue,
		output: SpotifyEndpointOutputSchemas.playerAddToQueue,
	},
	'player.getCurrentlyPlaying': {
		input: SpotifyEndpointInputSchemas.playerGetCurrentlyPlaying,
		output: SpotifyEndpointOutputSchemas.playerGetCurrentlyPlaying,
	},
	'player.getRecentlyPlayed': {
		input: SpotifyEndpointInputSchemas.playerGetRecentlyPlayed,
		output: SpotifyEndpointOutputSchemas.playerGetRecentlyPlayed,
	},
	'player.pause': {
		input: SpotifyEndpointInputSchemas.playerPause,
		output: SpotifyEndpointOutputSchemas.playerPause,
	},
	'player.resume': {
		input: SpotifyEndpointInputSchemas.playerResume,
		output: SpotifyEndpointOutputSchemas.playerResume,
	},
	'player.setVolume': {
		input: SpotifyEndpointInputSchemas.playerSetVolume,
		output: SpotifyEndpointOutputSchemas.playerSetVolume,
	},
	'player.skipToNext': {
		input: SpotifyEndpointInputSchemas.playerSkipToNext,
		output: SpotifyEndpointOutputSchemas.playerSkipToNext,
	},
	'player.skipToPrevious': {
		input: SpotifyEndpointInputSchemas.playerSkipToPrevious,
		output: SpotifyEndpointOutputSchemas.playerSkipToPrevious,
	},
	'player.startPlayback': {
		input: SpotifyEndpointInputSchemas.playerStartPlayback,
		output: SpotifyEndpointOutputSchemas.playerStartPlayback,
	},
	'playlists.addItem': {
		input: SpotifyEndpointInputSchemas.playlistsAddItem,
		output: SpotifyEndpointOutputSchemas.playlistsAddItem,
	},
	'playlists.create': {
		input: SpotifyEndpointInputSchemas.playlistsCreate,
		output: SpotifyEndpointOutputSchemas.playlistsCreate,
	},
	'playlists.get': {
		input: SpotifyEndpointInputSchemas.playlistsGet,
		output: SpotifyEndpointOutputSchemas.playlistsGet,
	},
	'playlists.getTracks': {
		input: SpotifyEndpointInputSchemas.playlistsGetTracks,
		output: SpotifyEndpointOutputSchemas.playlistsGetTracks,
	},
	'playlists.getUserPlaylists': {
		input: SpotifyEndpointInputSchemas.playlistsGetUserPlaylists,
		output: SpotifyEndpointOutputSchemas.playlistsGetUserPlaylists,
	},
	'playlists.removeItem': {
		input: SpotifyEndpointInputSchemas.playlistsRemoveItem,
		output: SpotifyEndpointOutputSchemas.playlistsRemoveItem,
	},
	'playlists.search': {
		input: SpotifyEndpointInputSchemas.playlistsSearch,
		output: SpotifyEndpointOutputSchemas.playlistsSearch,
	},
	'tracks.get': {
		input: SpotifyEndpointInputSchemas.tracksGet,
		output: SpotifyEndpointOutputSchemas.tracksGet,
	},
	'tracks.getAudioFeatures': {
		input: SpotifyEndpointInputSchemas.tracksGetAudioFeatures,
		output: SpotifyEndpointOutputSchemas.tracksGetAudioFeatures,
	},
	'tracks.search': {
		input: SpotifyEndpointInputSchemas.tracksSearch,
		output: SpotifyEndpointOutputSchemas.tracksSearch,
	},
} as const;

const spotifyWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

const spotifyWebhookSchemas = {
	'example.example': {
		description: 'An example Spotify webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'oauth_2';

/**
 * Risk-level metadata for each Spotify endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const spotifyEndpointMeta = {
	'albums.get': { riskLevel: 'read', description: 'Get info about an album' },
	'albums.getNewReleases': {
		riskLevel: 'read',
		description: 'Get new album releases',
	},
	'albums.getTracks': {
		riskLevel: 'read',
		description: 'Get tracks from an album',
	},
	'albums.search': { riskLevel: 'read', description: 'Search for albums' },
	'artists.get': { riskLevel: 'read', description: 'Get info about an artist' },
	'artists.getAlbums': {
		riskLevel: 'read',
		description: 'Get albums by an artist',
	},
	'artists.getRelatedArtists': {
		riskLevel: 'read',
		description: 'Get artists related to an artist',
	},
	'artists.getTopTracks': {
		riskLevel: 'read',
		description: 'Get top tracks for an artist',
	},
	'artists.search': { riskLevel: 'read', description: 'Search for artists' },
	'library.getLikedTracks': {
		riskLevel: 'read',
		description: "Get the current user's liked tracks",
	},
	'myData.getFollowedArtists': {
		riskLevel: 'read',
		description: 'Get artists followed by the current user',
	},
	'player.addToQueue': {
		riskLevel: 'write',
		description: 'Add a track to the playback queue',
	},
	'player.getCurrentlyPlaying': {
		riskLevel: 'read',
		description: 'Get the currently playing track',
	},
	'player.getRecentlyPlayed': {
		riskLevel: 'read',
		description: 'Get recently played tracks',
	},
	'player.pause': { riskLevel: 'write', description: 'Pause playback' },
	'player.resume': { riskLevel: 'write', description: 'Resume playback' },
	'player.setVolume': {
		riskLevel: 'write',
		description: 'Set the playback volume',
	},
	'player.skipToNext': {
		riskLevel: 'write',
		description: 'Skip to the next track',
	},
	'player.skipToPrevious': {
		riskLevel: 'write',
		description: 'Skip to the previous track',
	},
	'player.startPlayback': {
		riskLevel: 'write',
		description: 'Start playback of specified content',
	},
	'playlists.addItem': {
		riskLevel: 'write',
		description: 'Add a track to a playlist',
	},
	'playlists.create': {
		riskLevel: 'write',
		description: 'Create a new playlist',
	},
	'playlists.get': {
		riskLevel: 'read',
		description: 'Get info about a playlist',
	},
	'playlists.getTracks': {
		riskLevel: 'read',
		description: 'Get tracks in a playlist',
	},
	'playlists.getUserPlaylists': {
		riskLevel: 'read',
		description: "Get the current user's playlists",
	},
	'playlists.removeItem': {
		riskLevel: 'write',
		description: 'Remove a track from a playlist',
	},
	'playlists.search': {
		riskLevel: 'read',
		description: 'Search for playlists',
	},
	'tracks.get': { riskLevel: 'read', description: 'Get info about a track' },
	'tracks.getAudioFeatures': {
		riskLevel: 'read',
		description: 'Get audio features for a track',
	},
	'tracks.search': { riskLevel: 'read', description: 'Search for tracks' },
} satisfies RequiredPluginEndpointMeta<typeof spotifyEndpointsNested>;

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
		oauthConfig: {
			providerName: 'Spotify',
			authUrl: 'https://accounts.spotify.com/authorize',
			tokenUrl: 'https://accounts.spotify.com/api/token',
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
			],
			tokenAuthMethod: 'basic',
			requiresRegisteredRedirect: true,
			authParams: { show_dialog: 'true' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: spotifyEndpointsNested,
		webhooks: spotifyWebhooksNested,
		endpointMeta: spotifyEndpointMeta,
		endpointSchemas: spotifyEndpointSchemas,
		webhookSchemas: spotifyWebhookSchemas,
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
				const accessToken = await ctx.keys.get_access_token();
				const refreshToken = await ctx.keys.get_refresh_token();

				if (!refreshToken) {
					throw new Error(
						'[corsair:spotify] No refresh token. Cannot get access token.',
					);
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error('[corsair:spotify] No client id or client secret');
				}

				try {
					const key = await getValidAccessToken({
						accessToken,
						refreshToken,
						clientId: res.client_id,
						clientSecret: res.client_secret,
					});

					if (!key) {
						throw new Error(
							'[corsair:spotify] Access token cannot be created.',
						);
					}

					(ctx as Record<string, unknown>)._refreshAuth = async () => {
						const freshToken = await getValidAccessToken({
							accessToken: null,
							refreshToken,
							clientId: res.client_id!,
							clientSecret: res.client_secret!,
						});
						if (freshToken) {
							await ctx.keys.set_access_token(freshToken);
						}
						return freshToken || '';
					};

					return key;
				} catch (error) {
					throw new Error(
						`[corsair:spotify] Failed to get access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}
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
	Album,
	AlbumsGetNewReleasesResponse,
	AlbumsGetResponse,
	AlbumsGetTracksResponse,
	AlbumsSearchResponse,
	Artist,
	ArtistsGetAlbumsResponse,
	ArtistsGetRelatedArtistsResponse,
	ArtistsGetResponse,
	ArtistsGetTopTracksResponse,
	ArtistsSearchResponse,
	AudioFeatures,
	CurrentlyPlaying,
	LibraryGetLikedTracksResponse,
	MyDataGetFollowedArtistsResponse,
	PlayerAddToQueueResponse,
	PlayerGetCurrentlyPlayingResponse,
	PlayerGetRecentlyPlayedResponse,
	PlayerPauseResponse,
	PlayerResumeResponse,
	PlayerSetVolumeResponse,
	PlayerSkipToNextResponse,
	PlayerSkipToPreviousResponse,
	PlayerStartPlaybackResponse,
	Playlist,
	PlaylistsAddItemResponse,
	PlaylistsCreateResponse,
	PlaylistsGetResponse,
	PlaylistsGetTracksResponse,
	PlaylistsGetUserPlaylistsResponse,
	PlaylistsRemoveItemResponse,
	PlaylistsSearchResponse,
	PlaylistTrack,
	SpotifyEndpointInputs,
	SpotifyEndpointOutputs,
	Track,
	TracksGetAudioFeaturesResponse,
	TracksGetResponse,
	TracksSearchResponse,
} from './endpoints/types';
