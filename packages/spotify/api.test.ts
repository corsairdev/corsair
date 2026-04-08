import 'dotenv/config';
import { makeSpotifyRequest } from './client';
import type {
	AlbumsGetNewReleasesResponse,
	AlbumsGetResponse,
	AlbumsGetTracksResponse,
	AlbumsSearchResponse,
	ArtistsGetAlbumsResponse,
	ArtistsGetRelatedArtistsResponse,
	ArtistsGetResponse,
	ArtistsGetTopTracksResponse,
	ArtistsSearchResponse,
	LibraryGetLikedTracksResponse,
	MyDataGetFollowedArtistsResponse,
	PlayerGetCurrentlyPlayingResponse,
	PlayerGetRecentlyPlayedResponse,
	PlaylistsCreateResponse,
	PlaylistsGetResponse,
	PlaylistsGetTracksResponse,
	PlaylistsGetUserPlaylistsResponse,
	PlaylistsSearchResponse,
	TracksGetAudioFeaturesResponse,
	TracksGetResponse,
	TracksSearchResponse,
} from './endpoints/types';
import { SpotifyEndpointOutputSchemas } from './endpoints/types';

const TEST_ACCESS_TOKEN = process.env.SPOTIFY_ACCESS_TOKEN!;

describe('Spotify API Type Tests', () => {
	describe('albums', () => {
		let testAlbumId: string;

		beforeAll(async () => {
			const searchResponse = await makeSpotifyRequest<AlbumsSearchResponse>(
				'search',
				TEST_ACCESS_TOKEN,
				{ query: { q: 'album:nevermind', type: 'album', limit: 1 } },
			);
			const albumId = searchResponse.albums?.items?.[0]?.id;
			if (!albumId) {
				throw new Error('No albums found from search');
			}
			testAlbumId = albumId;
		});

		it('albumsGet returns correct type', async () => {
			const response = await makeSpotifyRequest<AlbumsGetResponse>(
				`albums/${testAlbumId}`,
				TEST_ACCESS_TOKEN,
			);
			const result = response;

			SpotifyEndpointOutputSchemas.albumsGet.parse(result);
		});

		it('albumsGetNewReleases returns correct type', async () => {
			const response = await makeSpotifyRequest<AlbumsGetNewReleasesResponse>(
				'browse/new-releases',
				TEST_ACCESS_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.albumsGetNewReleases.parse(result);
		});

		it('albumsGetTracks returns correct type', async () => {
			const response = await makeSpotifyRequest<AlbumsGetTracksResponse>(
				`albums/${testAlbumId}/tracks`,
				TEST_ACCESS_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.albumsGetTracks.parse(result);
		});

		it('albumsSearch returns correct type', async () => {
			const response = await makeSpotifyRequest<AlbumsSearchResponse>(
				'search',
				TEST_ACCESS_TOKEN,
				{ query: { q: 'album:nevermind', type: 'album', limit: 10 } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.albumsSearch.parse(result);
		});
	});

	describe('artists', () => {
		let testArtistId: string;

		beforeAll(async () => {
			const searchResponse = await makeSpotifyRequest<ArtistsSearchResponse>(
				'search',
				TEST_ACCESS_TOKEN,
				{ query: { q: 'artist:nirvana', type: 'artist', limit: 1 } },
			);
			const artistId = searchResponse.artists?.items?.[0]?.id;
			if (!artistId) {
				throw new Error('No artists found from search');
			}
			testArtistId = artistId;
		});

		it('artistsGet returns correct type', async () => {
			const response = await makeSpotifyRequest<ArtistsGetResponse>(
				`artists/${testArtistId}`,
				TEST_ACCESS_TOKEN,
			);
			const result = response;

			SpotifyEndpointOutputSchemas.artistsGet.parse(result);
		});

		it('artistsGetAlbums returns correct type', async () => {
			const response = await makeSpotifyRequest<ArtistsGetAlbumsResponse>(
				`artists/${testArtistId}/albums`,
				TEST_ACCESS_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.artistsGetAlbums.parse(result);
		});

		it('artistsGetRelatedArtists returns correct type', async () => {
			const response =
				await makeSpotifyRequest<ArtistsGetRelatedArtistsResponse>(
					`artists/${testArtistId}/related-artists`,
					TEST_ACCESS_TOKEN,
				);
			const result = response;

			SpotifyEndpointOutputSchemas.artistsGetRelatedArtists.parse(result);
		});

		it('artistsGetTopTracks returns correct type', async () => {
			const response = await makeSpotifyRequest<ArtistsGetTopTracksResponse>(
				`artists/${testArtistId}/top-tracks`,
				TEST_ACCESS_TOKEN,
				{ query: { market: 'US' } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.artistsGetTopTracks.parse(result);
		});

		it('artistsSearch returns correct type', async () => {
			const response = await makeSpotifyRequest<ArtistsSearchResponse>(
				'search',
				TEST_ACCESS_TOKEN,
				{ query: { q: 'artist:nirvana', type: 'artist', limit: 10 } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.artistsSearch.parse(result);
		});
	});

	describe('tracks', () => {
		let testTrackId: string;

		beforeAll(async () => {
			const searchResponse = await makeSpotifyRequest<TracksSearchResponse>(
				'search',
				TEST_ACCESS_TOKEN,
				{
					query: {
						q: 'track:smells like teen spirit',
						type: 'track',
						limit: 1,
					},
				},
			);
			const trackId = searchResponse.tracks?.items?.[0]?.id;
			if (!trackId) {
				throw new Error('No tracks found from search');
			}
			testTrackId = trackId;
		});

		it('tracksGet returns correct type', async () => {
			const response = await makeSpotifyRequest<TracksGetResponse>(
				`tracks/${testTrackId}`,
				TEST_ACCESS_TOKEN,
			);
			const result = response;

			SpotifyEndpointOutputSchemas.tracksGet.parse(result);
		});

		it('tracksGetAudioFeatures returns correct type', async () => {
			const response = await makeSpotifyRequest<TracksGetAudioFeaturesResponse>(
				`audio-features/${testTrackId}`,
				TEST_ACCESS_TOKEN,
			);
			const result = response;

			SpotifyEndpointOutputSchemas.tracksGetAudioFeatures.parse(result);
		});

		it('tracksSearch returns correct type', async () => {
			const response = await makeSpotifyRequest<TracksSearchResponse>(
				'search',
				TEST_ACCESS_TOKEN,
				{
					query: {
						q: 'track:smells like teen spirit',
						type: 'track',
						limit: 10,
					},
				},
			);
			const result = response;

			SpotifyEndpointOutputSchemas.tracksSearch.parse(result);
		});
	});

	describe('playlists', () => {
		let testPlaylistId: string | undefined;
		let testUserId: string | undefined;

		beforeAll(async () => {
			const userPlaylistsResponse =
				await makeSpotifyRequest<PlaylistsGetUserPlaylistsResponse>(
					'me/playlists',
					TEST_ACCESS_TOKEN,
					{ query: { limit: 1 } },
				);
			const playlistId = userPlaylistsResponse.items?.[0]?.id;
			if (playlistId && userPlaylistsResponse.items) {
				testPlaylistId = playlistId;
				const playlist = userPlaylistsResponse.items[0];
				if (playlist?.owner?.id) {
					testUserId = playlist.owner.id;
				}
			} else {
				const searchResponse =
					await makeSpotifyRequest<PlaylistsSearchResponse>(
						'search',
						TEST_ACCESS_TOKEN,
						{ query: { q: 'playlist:workout', type: 'playlist', limit: 1 } },
					);
				const searchPlaylistId = searchResponse.playlists?.items?.[0]?.id;
				if (searchPlaylistId && searchResponse.playlists?.items) {
					testPlaylistId = searchPlaylistId;
					const playlist = searchResponse.playlists.items[0];
					if (playlist?.owner?.id) {
						testUserId = playlist.owner.id;
					}
				}
			}
		});

		it('playlistsGet returns correct type', async () => {
			if (!testPlaylistId) {
				return;
			}

			const response = await makeSpotifyRequest<PlaylistsGetResponse>(
				`playlists/${testPlaylistId}`,
				TEST_ACCESS_TOKEN,
			);
			const result = response;

			SpotifyEndpointOutputSchemas.playlistsGet.parse(result);
		});

		it('playlistsGetUserPlaylists returns correct type', async () => {
			if (!testUserId) {
				const response =
					await makeSpotifyRequest<PlaylistsGetUserPlaylistsResponse>(
						'me/playlists',
						TEST_ACCESS_TOKEN,
						{ query: { limit: 10 } },
					);
				const result = response;

				SpotifyEndpointOutputSchemas.playlistsGetUserPlaylists.parse(result);
			} else {
				const response =
					await makeSpotifyRequest<PlaylistsGetUserPlaylistsResponse>(
						`users/${testUserId}/playlists`,
						TEST_ACCESS_TOKEN,
						{ query: { limit: 10 } },
					);
				const result = response;

				SpotifyEndpointOutputSchemas.playlistsGetUserPlaylists.parse(result);
			}
		});

		it('playlistsGetTracks returns correct type', async () => {
			if (!testPlaylistId) {
				return;
			}

			const response = await makeSpotifyRequest<PlaylistsGetTracksResponse>(
				`playlists/${testPlaylistId}/tracks`,
				TEST_ACCESS_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.playlistsGetTracks.parse(result);
		});

		it('playlistsSearch returns correct type', async () => {
			const response = await makeSpotifyRequest<PlaylistsSearchResponse>(
				'search',
				TEST_ACCESS_TOKEN,
				{ query: { q: 'playlist:workout', type: 'playlist', limit: 10 } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.playlistsSearch.parse(result);
		});

		it('playlistsCreate returns correct type', async () => {
			if (!testUserId) {
				return;
			}

			const playlistName = `Test Playlist ${Date.now()}`;
			const response = await makeSpotifyRequest<PlaylistsCreateResponse>(
				`users/${testUserId}/playlists`,
				TEST_ACCESS_TOKEN,
				{
					method: 'POST',
					body: {
						name: playlistName,
						public: false,
					},
				},
			);
			const result = response;

			SpotifyEndpointOutputSchemas.playlistsCreate.parse(result);
		});
	});

	describe('library', () => {
		it('libraryGetLikedTracks returns correct type', async () => {
			const response = await makeSpotifyRequest<LibraryGetLikedTracksResponse>(
				'me/tracks',
				TEST_ACCESS_TOKEN,
				{ query: { limit: 10 } },
			);
			const result = response;

			SpotifyEndpointOutputSchemas.libraryGetLikedTracks.parse(result);
		});
	});

	describe('myData', () => {
		it('myDataGetFollowedArtists returns correct type', async () => {
			const response =
				await makeSpotifyRequest<MyDataGetFollowedArtistsResponse>(
					'me/following',
					TEST_ACCESS_TOKEN,
					{ query: { type: 'artist', limit: 10 } },
				);
			const result = response;

			SpotifyEndpointOutputSchemas.myDataGetFollowedArtists.parse(result);
		});
	});

	describe('player', () => {
		it('playerGetCurrentlyPlaying returns correct type', async () => {
			const response =
				await makeSpotifyRequest<PlayerGetCurrentlyPlayingResponse>(
					'me/player/currently-playing',
					TEST_ACCESS_TOKEN,
				);
			const result = response;

			SpotifyEndpointOutputSchemas.playerGetCurrentlyPlaying.parse(result);
		});

		it('playerGetRecentlyPlayed returns correct type', async () => {
			const response =
				await makeSpotifyRequest<PlayerGetRecentlyPlayedResponse>(
					'me/player/recently-played',
					TEST_ACCESS_TOKEN,
					{ query: { limit: 10 } },
				);
			const result = response;

			SpotifyEndpointOutputSchemas.playerGetRecentlyPlayed.parse(result);
		});
	});
});
