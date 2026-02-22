import { z } from 'zod';

const AlbumSchema = z.object({
	id: z.string(),
	name: z.string(),
	album_type: z.string(),
	total_tracks: z.number().optional(),
	available_markets: z.array(z.string()).optional(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	href: z.string().optional(),
	images: z
		.array(
			z.object({
				url: z.string(),
				height: z.number().optional(),
				width: z.number().optional(),
			}),
		)
		.optional(),
	release_date: z.string().optional(),
	release_date_precision: z.string().optional(),
	artists: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				external_urls: z
					.object({
						spotify: z.string().optional(),
					})
					.optional(),
			}),
		)
		.optional(),
});

const ArtistSchema = z.object({
	id: z.string(),
	name: z.string(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	followers: z
		.object({
			total: z.number().optional(),
		})
		.optional(),
	genres: z.array(z.string()).optional(),
	href: z.string().optional(),
	images: z
		.array(
			z.object({
				url: z.string(),
				height: z.number().optional(),
				width: z.number().optional(),
			}),
		)
		.optional(),
	popularity: z.number().optional(),
});

const TrackSchema = z.object({
	id: z.string(),
	name: z.string(),
	artists: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
			}),
		)
		.optional(),
	album: AlbumSchema.optional(),
	duration_ms: z.number().optional(),
	explicit: z.boolean().optional(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	href: z.string().optional(),
	is_local: z.boolean().optional(),
	popularity: z.number().optional(),
	preview_url: z.string().nullable().optional(),
	track_number: z.number().optional(),
});

const PlaylistSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable().optional(),
	public: z.boolean().optional(),
	collaborative: z.boolean().optional(),
	owner: z
		.object({
			id: z.string(),
			display_name: z.string().optional(),
			external_urls: z
				.object({
					spotify: z.string().optional(),
				})
				.optional(),
		})
		.optional(),
	followers: z
		.object({
			total: z.number().optional(),
		})
		.optional(),
	images: z
		.array(
			z.object({
				url: z.string(),
				height: z.number().optional(),
				width: z.number().optional(),
			}),
		)
		.optional(),
	tracks: z
		.object({
			href: z.string().optional(),
			total: z.number().optional(),
		})
		.optional(),
	external_urls: z
		.object({
			spotify: z.string().optional(),
		})
		.optional(),
	href: z.string().optional(),
});

const PlaylistTrackSchema = z.object({
	added_at: z.string().optional(),
	added_by: z
		.object({
			id: z.string().optional(),
		})
		.optional(),
	is_local: z.boolean().optional(),
	track: TrackSchema.optional(),
});

const AudioFeaturesSchema = z.object({
	id: z.string(),
	danceability: z.number().optional(),
	energy: z.number().optional(),
	key: z.number().optional(),
	loudness: z.number().optional(),
	mode: z.number().optional(),
	speechiness: z.number().optional(),
	acousticness: z.number().optional(),
	instrumentalness: z.number().optional(),
	liveness: z.number().optional(),
	valence: z.number().optional(),
	tempo: z.number().optional(),
	duration_ms: z.number().optional(),
	time_signature: z.number().optional(),
});

const CurrentlyPlayingSchema = z.object({
	timestamp: z.number().optional(),
	context: z
		.object({
			external_urls: z
				.object({
					spotify: z.string().optional(),
				})
				.optional(),
			href: z.string().optional(),
			type: z.string().optional(),
			uri: z.string().optional(),
		})
		.optional(),
	progress_ms: z.number().optional(),
	is_playing: z.boolean().optional(),
	item: TrackSchema.optional(),
	currently_playing_type: z.string().optional(),
	actions: z
		.object({
			disallows: z
				.object({
					resuming: z.boolean().optional(),
				})
				.optional(),
		})
		.optional(),
});

const AlbumsGetInputSchema = z.object({
	id: z.string(),
	market: z.string().optional(),
});

const AlbumsGetNewReleasesInputSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
	country: z.string().optional(),
});

const AlbumsGetTracksInputSchema = z.object({
	id: z.string(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	market: z.string().optional(),
});

const AlbumsSearchInputSchema = z.object({
	q: z.string(),
	type: z.literal('album').optional(),
	market: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const ArtistsGetInputSchema = z.object({
	id: z.string(),
});

const ArtistsGetAlbumsInputSchema = z.object({
	id: z.string(),
	include_groups: z.string().optional(),
	market: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const ArtistsGetRelatedArtistsInputSchema = z.object({
	id: z.string(),
});

const ArtistsGetTopTracksInputSchema = z.object({
	id: z.string(),
	market: z.string().optional(),
});

const ArtistsSearchInputSchema = z.object({
	q: z.string(),
	type: z.literal('artist').optional(),
	market: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const LibraryGetLikedTracksInputSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
	market: z.string().optional(),
});

const MyDataGetFollowedArtistsInputSchema = z.object({
	type: z.literal('artist').optional(),
	limit: z.number().optional(),
	after: z.string().optional(),
});

const PlayerAddToQueueInputSchema = z.object({
	uri: z.string(),
	device_id: z.string().optional(),
});

const PlayerGetCurrentlyPlayingInputSchema = z.object({
	market: z.string().optional(),
	additional_types: z.string().optional(),
});

const PlayerSkipToNextInputSchema = z.object({
	device_id: z.string().optional(),
});

const PlayerPauseInputSchema = z.object({
	device_id: z.string().optional(),
});

const PlayerSkipToPreviousInputSchema = z.object({
	device_id: z.string().optional(),
});

const PlayerGetRecentlyPlayedInputSchema = z.object({
	limit: z.number().optional(),
	after: z.number().optional(),
	before: z.number().optional(),
});

const PlayerResumeInputSchema = z.object({
	device_id: z.string().optional(),
});

const PlayerSetVolumeInputSchema = z.object({
	volume_percent: z.number(),
	device_id: z.string().optional(),
});

const PlayerStartPlaybackInputSchema = z.object({
	device_id: z.string().optional(),
	context_uri: z.string().optional(),
	uris: z.array(z.string()).optional(),
	offset: z
		.object({
			position: z.number().optional(),
			uri: z.string().optional(),
		})
		.optional(),
	position_ms: z.number().optional(),
});

const PlaylistsAddItemInputSchema = z.object({
	playlist_id: z.string(),
	uris: z.array(z.string()),
	position: z.number().optional(),
});

const PlaylistsCreateInputSchema = z.object({
	user_id: z.string(),
	name: z.string(),
	public: z.boolean().optional(),
	collaborative: z.boolean().optional(),
	description: z.string().optional(),
});

const PlaylistsGetInputSchema = z.object({
	playlist_id: z.string(),
	market: z.string().optional(),
	fields: z.string().optional(),
	additional_types: z.string().optional(),
});

const PlaylistsGetUserPlaylistsInputSchema = z.object({
	user_id: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const PlaylistsGetTracksInputSchema = z.object({
	playlist_id: z.string(),
	market: z.string().optional(),
	fields: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
	additional_types: z.string().optional(),
});

const PlaylistsRemoveItemInputSchema = z.object({
	playlist_id: z.string(),
	tracks: z.array(
		z.object({
			uri: z.string(),
		}),
	),
	snapshot_id: z.string().optional(),
});

const PlaylistsSearchInputSchema = z.object({
	q: z.string(),
	type: z.literal('playlist').optional(),
	market: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const TracksGetInputSchema = z.object({
	id: z.string(),
	market: z.string().optional(),
});

const TracksGetAudioFeaturesInputSchema = z.object({
	id: z.string(),
});

const TracksSearchInputSchema = z.object({
	q: z.string(),
	type: z.literal('track').optional(),
	market: z.string().optional(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

export type AlbumsGetInput = z.infer<typeof AlbumsGetInputSchema>;
export type AlbumsGetNewReleasesInput = z.infer<
	typeof AlbumsGetNewReleasesInputSchema
>;
export type AlbumsGetTracksInput = z.infer<typeof AlbumsGetTracksInputSchema>;
export type AlbumsSearchInput = z.infer<typeof AlbumsSearchInputSchema>;
export type ArtistsGetInput = z.infer<typeof ArtistsGetInputSchema>;
export type ArtistsGetAlbumsInput = z.infer<typeof ArtistsGetAlbumsInputSchema>;
export type ArtistsGetRelatedArtistsInput = z.infer<
	typeof ArtistsGetRelatedArtistsInputSchema
>;
export type ArtistsGetTopTracksInput = z.infer<
	typeof ArtistsGetTopTracksInputSchema
>;
export type ArtistsSearchInput = z.infer<typeof ArtistsSearchInputSchema>;
export type LibraryGetLikedTracksInput = z.infer<
	typeof LibraryGetLikedTracksInputSchema
>;
export type MyDataGetFollowedArtistsInput = z.infer<
	typeof MyDataGetFollowedArtistsInputSchema
>;
export type PlayerAddToQueueInput = z.infer<typeof PlayerAddToQueueInputSchema>;
export type PlayerGetCurrentlyPlayingInput = z.infer<
	typeof PlayerGetCurrentlyPlayingInputSchema
>;
export type PlayerSkipToNextInput = z.infer<typeof PlayerSkipToNextInputSchema>;
export type PlayerPauseInput = z.infer<typeof PlayerPauseInputSchema>;
export type PlayerSkipToPreviousInput = z.infer<
	typeof PlayerSkipToPreviousInputSchema
>;
export type PlayerGetRecentlyPlayedInput = z.infer<
	typeof PlayerGetRecentlyPlayedInputSchema
>;
export type PlayerResumeInput = z.infer<typeof PlayerResumeInputSchema>;
export type PlayerSetVolumeInput = z.infer<typeof PlayerSetVolumeInputSchema>;
export type PlayerStartPlaybackInput = z.infer<
	typeof PlayerStartPlaybackInputSchema
>;
export type PlaylistsAddItemInput = z.infer<typeof PlaylistsAddItemInputSchema>;
export type PlaylistsCreateInput = z.infer<typeof PlaylistsCreateInputSchema>;
export type PlaylistsGetInput = z.infer<typeof PlaylistsGetInputSchema>;
export type PlaylistsGetUserPlaylistsInput = z.infer<
	typeof PlaylistsGetUserPlaylistsInputSchema
>;
export type PlaylistsGetTracksInput = z.infer<
	typeof PlaylistsGetTracksInputSchema
>;
export type PlaylistsRemoveItemInput = z.infer<
	typeof PlaylistsRemoveItemInputSchema
>;
export type PlaylistsSearchInput = z.infer<typeof PlaylistsSearchInputSchema>;
export type TracksGetInput = z.infer<typeof TracksGetInputSchema>;
export type TracksGetAudioFeaturesInput = z.infer<
	typeof TracksGetAudioFeaturesInputSchema
>;
export type TracksSearchInput = z.infer<typeof TracksSearchInputSchema>;

export type Album = z.infer<typeof AlbumSchema>;
export type Artist = z.infer<typeof ArtistSchema>;
export type Track = z.infer<typeof TrackSchema>;
export type Playlist = z.infer<typeof PlaylistSchema>;
export type PlaylistTrack = z.infer<typeof PlaylistTrackSchema>;
export type AudioFeatures = z.infer<typeof AudioFeaturesSchema>;
export type CurrentlyPlaying = z.infer<typeof CurrentlyPlayingSchema>;

const AlbumsGetResponseSchema = AlbumSchema;
const AlbumsGetNewReleasesResponseSchema = z.object({
	albums: z.object({
		href: z.string().optional(),
		limit: z.number().optional(),
		next: z.string().nullable().optional(),
		offset: z.number().optional(),
		previous: z.string().nullable().optional(),
		total: z.number().optional(),
		items: z.array(AlbumSchema).optional(),
	}),
});
const AlbumsGetTracksResponseSchema = z.object({
	href: z.string().optional(),
	limit: z.number().optional(),
	next: z.string().nullable().optional(),
	offset: z.number().optional(),
	previous: z.string().nullable().optional(),
	total: z.number().optional(),
	items: z.array(TrackSchema).optional(),
});
const AlbumsSearchResponseSchema = z.object({
	albums: z.object({
		href: z.string().optional(),
		limit: z.number().optional(),
		next: z.string().nullable().optional(),
		offset: z.number().optional(),
		previous: z.string().nullable().optional(),
		total: z.number().optional(),
		items: z.array(AlbumSchema).optional(),
	}),
});

const ArtistsGetResponseSchema = ArtistSchema;
const ArtistsGetAlbumsResponseSchema = z.object({
	href: z.string().optional(),
	limit: z.number().optional(),
	next: z.string().nullable().optional(),
	offset: z.number().optional(),
	previous: z.string().nullable().optional(),
	total: z.number().optional(),
	items: z.array(AlbumSchema).optional(),
});
const ArtistsGetRelatedArtistsResponseSchema = z.object({
	artists: z.array(ArtistSchema).optional(),
});
const ArtistsGetTopTracksResponseSchema = z.object({
	tracks: z.array(TrackSchema).optional(),
});
const ArtistsSearchResponseSchema = z.object({
	artists: z.object({
		href: z.string().optional(),
		limit: z.number().optional(),
		next: z.string().nullable().optional(),
		offset: z.number().optional(),
		previous: z.string().nullable().optional(),
		total: z.number().optional(),
		items: z.array(ArtistSchema).optional(),
	}),
});

const LibraryGetLikedTracksResponseSchema = z.object({
	href: z.string().optional(),
	limit: z.number().optional(),
	next: z.string().nullable().optional(),
	offset: z.number().optional(),
	previous: z.string().nullable().optional(),
	total: z.number().optional(),
	items: z
		.array(
			z.object({
				added_at: z.string().optional(),
				track: TrackSchema.optional(),
			}),
		)
		.optional(),
});

const MyDataGetFollowedArtistsResponseSchema = z.object({
	artists: z.object({
		href: z.string().optional(),
		limit: z.number().optional(),
		next: z.string().nullable().optional(),
		cursors: z
			.object({
				after: z.string().optional(),
			})
			.optional(),
		total: z.number().optional(),
		items: z.array(ArtistSchema).optional(),
	}),
});

const PlayerAddToQueueResponseSchema = z.object({});
const PlayerGetCurrentlyPlayingResponseSchema = CurrentlyPlayingSchema.nullable();
const PlayerSkipToNextResponseSchema = z.object({});
const PlayerPauseResponseSchema = z.object({});
const PlayerSkipToPreviousResponseSchema = z.object({});
const PlayerGetRecentlyPlayedResponseSchema = z.object({
	items: z
		.array(
			z.object({
				track: TrackSchema.optional(),
				played_at: z.string().optional(),
				context: z
					.object({
						type: z.string().optional(),
						href: z.string().optional(),
						external_urls: z
							.object({
								spotify: z.string().optional(),
							})
							.optional(),
						uri: z.string().optional(),
					})
					.optional(),
			}),
		)
		.optional(),
	next: z.string().nullable().optional(),
	cursors: z
		.object({
			after: z.string().optional(),
			before: z.string().optional(),
		})
		.optional(),
	limit: z.number().optional(),
});
const PlayerResumeResponseSchema = z.object({});
const PlayerSetVolumeResponseSchema = z.object({});
const PlayerStartPlaybackResponseSchema = z.object({});

const PlaylistsAddItemResponseSchema = z.object({
	snapshot_id: z.string().optional(),
});
const PlaylistsCreateResponseSchema = PlaylistSchema;
const PlaylistsGetResponseSchema = PlaylistSchema;
const PlaylistsGetUserPlaylistsResponseSchema = z.object({
	href: z.string().optional(),
	limit: z.number().optional(),
	next: z.string().nullable().optional(),
	offset: z.number().optional(),
	previous: z.string().nullable().optional(),
	total: z.number().optional(),
	items: z.array(PlaylistSchema).optional(),
});
const PlaylistsGetTracksResponseSchema = z.object({
	href: z.string().optional(),
	limit: z.number().optional(),
	next: z.string().nullable().optional(),
	offset: z.number().optional(),
	previous: z.string().nullable().optional(),
	total: z.number().optional(),
	items: z.array(PlaylistTrackSchema).optional(),
});
const PlaylistsRemoveItemResponseSchema = z.object({
	snapshot_id: z.string().optional(),
});
const PlaylistsSearchResponseSchema = z.object({
	playlists: z.object({
		href: z.string().optional(),
		limit: z.number().optional(),
		next: z.string().nullable().optional(),
		offset: z.number().optional(),
		previous: z.string().nullable().optional(),
		total: z.number().optional(),
		items: z.array(PlaylistSchema).optional(),
	}),
});

const TracksGetResponseSchema = TrackSchema;
const TracksGetAudioFeaturesResponseSchema = AudioFeaturesSchema;
const TracksSearchResponseSchema = z.object({
	tracks: z.object({
		href: z.string().optional(),
		limit: z.number().optional(),
		next: z.string().nullable().optional(),
		offset: z.number().optional(),
		previous: z.string().nullable().optional(),
		total: z.number().optional(),
		items: z.array(TrackSchema).optional(),
	}),
});

export type AlbumsGetResponse = z.infer<typeof AlbumsGetResponseSchema>;
export type AlbumsGetNewReleasesResponse = z.infer<
	typeof AlbumsGetNewReleasesResponseSchema
>;
export type AlbumsGetTracksResponse = z.infer<
	typeof AlbumsGetTracksResponseSchema
>;
export type AlbumsSearchResponse = z.infer<typeof AlbumsSearchResponseSchema>;
export type ArtistsGetResponse = z.infer<typeof ArtistsGetResponseSchema>;
export type ArtistsGetAlbumsResponse = z.infer<
	typeof ArtistsGetAlbumsResponseSchema
>;
export type ArtistsGetRelatedArtistsResponse = z.infer<
	typeof ArtistsGetRelatedArtistsResponseSchema
>;
export type ArtistsGetTopTracksResponse = z.infer<
	typeof ArtistsGetTopTracksResponseSchema
>;
export type ArtistsSearchResponse = z.infer<typeof ArtistsSearchResponseSchema>;
export type LibraryGetLikedTracksResponse = z.infer<
	typeof LibraryGetLikedTracksResponseSchema
>;
export type MyDataGetFollowedArtistsResponse = z.infer<
	typeof MyDataGetFollowedArtistsResponseSchema
>;
export type PlayerAddToQueueResponse = z.infer<
	typeof PlayerAddToQueueResponseSchema
>;
export type PlayerGetCurrentlyPlayingResponse = z.infer<
	typeof PlayerGetCurrentlyPlayingResponseSchema
>;
export type PlayerSkipToNextResponse = z.infer<
	typeof PlayerSkipToNextResponseSchema
>;
export type PlayerPauseResponse = z.infer<typeof PlayerPauseResponseSchema>;
export type PlayerSkipToPreviousResponse = z.infer<
	typeof PlayerSkipToPreviousResponseSchema
>;
export type PlayerGetRecentlyPlayedResponse = z.infer<
	typeof PlayerGetRecentlyPlayedResponseSchema
>;
export type PlayerResumeResponse = z.infer<typeof PlayerResumeResponseSchema>;
export type PlayerSetVolumeResponse = z.infer<
	typeof PlayerSetVolumeResponseSchema
>;
export type PlayerStartPlaybackResponse = z.infer<
	typeof PlayerStartPlaybackResponseSchema
>;
export type PlaylistsAddItemResponse = z.infer<
	typeof PlaylistsAddItemResponseSchema
>;
export type PlaylistsCreateResponse = z.infer<
	typeof PlaylistsCreateResponseSchema
>;
export type PlaylistsGetResponse = z.infer<typeof PlaylistsGetResponseSchema>;
export type PlaylistsGetUserPlaylistsResponse = z.infer<
	typeof PlaylistsGetUserPlaylistsResponseSchema
>;
export type PlaylistsGetTracksResponse = z.infer<
	typeof PlaylistsGetTracksResponseSchema
>;
export type PlaylistsRemoveItemResponse = z.infer<
	typeof PlaylistsRemoveItemResponseSchema
>;
export type PlaylistsSearchResponse = z.infer<
	typeof PlaylistsSearchResponseSchema
>;
export type TracksGetResponse = z.infer<typeof TracksGetResponseSchema>;
export type TracksGetAudioFeaturesResponse = z.infer<
	typeof TracksGetAudioFeaturesResponseSchema
>;
export type TracksSearchResponse = z.infer<typeof TracksSearchResponseSchema>;

export type SpotifyEndpointOutputs = {
	albumsGet: AlbumsGetResponse;
	albumsGetNewReleases: AlbumsGetNewReleasesResponse;
	albumsGetTracks: AlbumsGetTracksResponse;
	albumsSearch: AlbumsSearchResponse;
	artistsGet: ArtistsGetResponse;
	artistsGetAlbums: ArtistsGetAlbumsResponse;
	artistsGetRelatedArtists: ArtistsGetRelatedArtistsResponse;
	artistsGetTopTracks: ArtistsGetTopTracksResponse;
	artistsSearch: ArtistsSearchResponse;
	libraryGetLikedTracks: LibraryGetLikedTracksResponse;
	myDataGetFollowedArtists: MyDataGetFollowedArtistsResponse;
	playerAddToQueue: PlayerAddToQueueResponse;
	playerGetCurrentlyPlaying: PlayerGetCurrentlyPlayingResponse;
	playerSkipToNext: PlayerSkipToNextResponse;
	playerPause: PlayerPauseResponse;
	playerSkipToPrevious: PlayerSkipToPreviousResponse;
	playerGetRecentlyPlayed: PlayerGetRecentlyPlayedResponse;
	playerResume: PlayerResumeResponse;
	playerSetVolume: PlayerSetVolumeResponse;
	playerStartPlayback: PlayerStartPlaybackResponse;
	playlistsAddItem: PlaylistsAddItemResponse;
	playlistsCreate: PlaylistsCreateResponse;
	playlistsGet: PlaylistsGetResponse;
	playlistsGetUserPlaylists: PlaylistsGetUserPlaylistsResponse;
	playlistsGetTracks: PlaylistsGetTracksResponse;
	playlistsRemoveItem: PlaylistsRemoveItemResponse;
	playlistsSearch: PlaylistsSearchResponse;
	tracksGet: TracksGetResponse;
	tracksGetAudioFeatures: TracksGetAudioFeaturesResponse;
	tracksSearch: TracksSearchResponse;
};

export {
	AlbumsGetInputSchema,
	AlbumsGetNewReleasesInputSchema,
	AlbumsGetTracksInputSchema,
	AlbumsSearchInputSchema,
	ArtistsGetInputSchema,
	ArtistsGetAlbumsInputSchema,
	ArtistsGetRelatedArtistsInputSchema,
	ArtistsGetTopTracksInputSchema,
	ArtistsSearchInputSchema,
	LibraryGetLikedTracksInputSchema,
	MyDataGetFollowedArtistsInputSchema,
	PlayerAddToQueueInputSchema,
	PlayerGetCurrentlyPlayingInputSchema,
	PlayerSkipToNextInputSchema,
	PlayerPauseInputSchema,
	PlayerSkipToPreviousInputSchema,
	PlayerGetRecentlyPlayedInputSchema,
	PlayerResumeInputSchema,
	PlayerSetVolumeInputSchema,
	PlayerStartPlaybackInputSchema,
	PlaylistsAddItemInputSchema,
	PlaylistsCreateInputSchema,
	PlaylistsGetInputSchema,
	PlaylistsGetUserPlaylistsInputSchema,
	PlaylistsGetTracksInputSchema,
	PlaylistsRemoveItemInputSchema,
	PlaylistsSearchInputSchema,
	TracksGetInputSchema,
	TracksGetAudioFeaturesInputSchema,
	TracksSearchInputSchema,
};