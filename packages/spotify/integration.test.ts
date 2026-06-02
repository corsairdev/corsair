import 'dotenv/config';
import { createCorsair } from 'corsair/core';
import { createCorsairOrm } from 'corsair/orm';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { spotify } from './index';

async function createSpotifyClient() {
	const accessToken = process.env.SPOTIFY_ACCESS_TOKEN;

	if (!accessToken) {
		return null;
	}

	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'spotify', 'default');

	const corsair = createCorsair({
		plugins: [
			spotify({
				authType: 'oauth_2',
				key: accessToken,
			}),
		],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK!,
	});

	await corsair.spotify.keys.issue_new_dek();

	await corsair.spotify.keys.set_access_token(accessToken);

	return { corsair, testDb };
}

describe('Spotify plugin integration', () => {
	it('albums endpoints interact with API and DB', async () => {
		const setup = await createSpotifyClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		// Fetch album ID dynamically
		const searchResult = await corsair.spotify.api.albums.search({
			q: 'album:nevermind',
			type: 'album',
			limit: 1,
		});
		const testAlbumId = searchResult.albums?.items?.[0]?.id;
		if (!testAlbumId) {
			throw new Error('No albums found from search');
		}

		const getInput = {
			id: testAlbumId,
		};

		const album = await corsair.spotify.api.albums.get(getInput);

		expect(album).toBeDefined();
		expect(album.id).toBe(testAlbumId);

		const orm = createCorsairOrm(testDb.database);
		const getEvents = await orm.events.findMany({
			where: { event_type: 'spotify.albums.get' },
		});

		expect(getEvents.length).toBeGreaterThan(0);
		const getEvent = getEvents[getEvents.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		if (album && corsair.spotify.db.albums) {
			const albumFromDb = await corsair.spotify.db.albums.findByEntityId(
				album.id,
			);
			expect(albumFromDb).not.toBeNull();
			if (albumFromDb) {
				expect(albumFromDb.data.id).toBe(album.id);
			}
		}

		const searchInput = {
			q: 'album:nevermind',
			type: 'album' as const,
			limit: 10,
		};

		const searchResult2 = await corsair.spotify.api.albums.search(searchInput);

		expect(searchResult).toBeDefined();
		expect(searchResult.albums).toBeDefined();

		const searchEvents = await orm.events.findMany({
			where: { event_type: 'spotify.albums.search' },
		});

		expect(searchEvents.length).toBeGreaterThan(0);
		const searchEvent = searchEvents[searchEvents.length - 1]!;
		const searchEventPayload =
			typeof searchEvent.payload === 'string'
				? JSON.parse(searchEvent.payload)
				: searchEvent.payload;
		expect(searchEventPayload).toMatchObject(searchInput);

		const newReleasesInput = {
			limit: 10,
		};

		const newReleases =
			await corsair.spotify.api.albums.getNewReleases(newReleasesInput);

		expect(newReleases).toBeDefined();
		expect(newReleases.albums).toBeDefined();

		const newReleasesEvents = await orm.events.findMany({
			where: { event_type: 'spotify.albums.getNewReleases' },
		});

		expect(newReleasesEvents.length).toBeGreaterThan(0);
		const newReleasesEvent = newReleasesEvents[newReleasesEvents.length - 1]!;
		const newReleasesEventPayload =
			typeof newReleasesEvent.payload === 'string'
				? JSON.parse(newReleasesEvent.payload)
				: newReleasesEvent.payload;
		expect(newReleasesEventPayload).toMatchObject(newReleasesInput);

		testDb.cleanup();
	});

	it('artists endpoints interact with API and DB', async () => {
		const setup = await createSpotifyClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		// Fetch artist ID dynamically
		const searchResult = await corsair.spotify.api.artists.search({
			q: 'artist:nirvana',
			type: 'artist',
			limit: 1,
		});
		const testArtistId = searchResult.artists?.items?.[0]?.id;
		if (!testArtistId) {
			throw new Error('No artists found from search');
		}

		const getInput = {
			id: testArtistId,
		};

		const artist = await corsair.spotify.api.artists.get(getInput);

		expect(artist).toBeDefined();
		expect(artist.id).toBe(testArtistId);

		const orm = createCorsairOrm(testDb.database);
		const getEvents = await orm.events.findMany({
			where: { event_type: 'spotify.artists.get' },
		});

		expect(getEvents.length).toBeGreaterThan(0);
		const getEvent = getEvents[getEvents.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		if (artist && corsair.spotify.db.artists) {
			const artistFromDb = await corsair.spotify.db.artists.findByEntityId(
				artist.id,
			);
			expect(artistFromDb).not.toBeNull();
			if (artistFromDb) {
				expect(artistFromDb.data.id).toBe(artist.id);
			}
		}

		const getAlbumsInput = {
			id: testArtistId,
			limit: 10,
		};

		const albums = await corsair.spotify.api.artists.getAlbums(getAlbumsInput);

		expect(albums).toBeDefined();

		const getAlbumsEvents = await orm.events.findMany({
			where: { event_type: 'spotify.artists.getAlbums' },
		});

		expect(getAlbumsEvents.length).toBeGreaterThan(0);
		const getAlbumsEvent = getAlbumsEvents[getAlbumsEvents.length - 1]!;
		const getAlbumsEventPayload =
			typeof getAlbumsEvent.payload === 'string'
				? JSON.parse(getAlbumsEvent.payload)
				: getAlbumsEvent.payload;
		expect(getAlbumsEventPayload).toMatchObject(getAlbumsInput);

		const getTopTracksInput = {
			id: testArtistId,
			market: 'US',
		};

		const topTracks =
			await corsair.spotify.api.artists.getTopTracks(getTopTracksInput);

		expect(topTracks).toBeDefined();
		expect(topTracks.tracks).toBeDefined();

		const getTopTracksEvents = await orm.events.findMany({
			where: { event_type: 'spotify.artists.getTopTracks' },
		});

		expect(getTopTracksEvents.length).toBeGreaterThan(0);
		const getTopTracksEvent =
			getTopTracksEvents[getTopTracksEvents.length - 1]!;
		const getTopTracksEventPayload =
			typeof getTopTracksEvent.payload === 'string'
				? JSON.parse(getTopTracksEvent.payload)
				: getTopTracksEvent.payload;
		expect(getTopTracksEventPayload).toMatchObject(getTopTracksInput);

		const searchInput = {
			q: 'artist:nirvana',
			type: 'artist' as const,
			limit: 10,
		};

		const searchResult2 = await corsair.spotify.api.artists.search(searchInput);

		expect(searchResult).toBeDefined();
		expect(searchResult.artists).toBeDefined();

		const searchEvents = await orm.events.findMany({
			where: { event_type: 'spotify.artists.search' },
		});

		expect(searchEvents.length).toBeGreaterThan(0);
		const searchEvent = searchEvents[searchEvents.length - 1]!;
		const searchEventPayload =
			typeof searchEvent.payload === 'string'
				? JSON.parse(searchEvent.payload)
				: searchEvent.payload;
		expect(searchEventPayload).toMatchObject(searchInput);

		testDb.cleanup();
	});

	it('tracks endpoints interact with API and DB', async () => {
		const setup = await createSpotifyClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		// Fetch track ID dynamically
		const searchResult = await corsair.spotify.api.tracks.search({
			q: 'track:smells like teen spirit',
			type: 'track',
			limit: 1,
		});
		const testTrackId = searchResult.tracks?.items?.[0]?.id;
		if (!testTrackId) {
			throw new Error('No tracks found from search');
		}

		const getInput = {
			id: testTrackId,
		};

		const track = await corsair.spotify.api.tracks.get(getInput);

		expect(track).toBeDefined();
		expect(track.id).toBe(testTrackId);

		const orm = createCorsairOrm(testDb.database);
		const getEvents = await orm.events.findMany({
			where: { event_type: 'spotify.tracks.get' },
		});

		expect(getEvents.length).toBeGreaterThan(0);
		const getEvent = getEvents[getEvents.length - 1]!;
		const getEventPayload =
			typeof getEvent.payload === 'string'
				? JSON.parse(getEvent.payload)
				: getEvent.payload;
		expect(getEventPayload).toMatchObject(getInput);

		if (track && corsair.spotify.db.tracks) {
			const trackFromDb = await corsair.spotify.db.tracks.findByEntityId(
				track.id,
			);
			expect(trackFromDb).not.toBeNull();
			if (trackFromDb) {
				expect(trackFromDb.data.id).toBe(track.id);
			}
		}

		const getAudioFeaturesInput = {
			id: testTrackId,
		};

		const audioFeatures = await corsair.spotify.api.tracks.getAudioFeatures(
			getAudioFeaturesInput,
		);

		expect(audioFeatures).toBeDefined();
		expect(audioFeatures.id).toBe(testTrackId);

		const getAudioFeaturesEvents = await orm.events.findMany({
			where: { event_type: 'spotify.tracks.getAudioFeatures' },
		});

		expect(getAudioFeaturesEvents.length).toBeGreaterThan(0);
		const getAudioFeaturesEvent =
			getAudioFeaturesEvents[getAudioFeaturesEvents.length - 1]!;
		const getAudioFeaturesEventPayload =
			typeof getAudioFeaturesEvent.payload === 'string'
				? JSON.parse(getAudioFeaturesEvent.payload)
				: getAudioFeaturesEvent.payload;
		expect(getAudioFeaturesEventPayload).toMatchObject(getAudioFeaturesInput);

		const searchInput = {
			q: 'track:smells like teen spirit',
			type: 'track' as const,
			limit: 10,
		};

		const searchResult2 = await corsair.spotify.api.tracks.search(searchInput);

		expect(searchResult2).toBeDefined();
		expect(searchResult2.tracks).toBeDefined();

		const searchEvents = await orm.events.findMany({
			where: { event_type: 'spotify.tracks.search' },
		});

		expect(searchEvents.length).toBeGreaterThan(0);
		const searchEvent = searchEvents[searchEvents.length - 1]!;
		const searchEventPayload =
			typeof searchEvent.payload === 'string'
				? JSON.parse(searchEvent.payload)
				: searchEvent.payload;
		expect(searchEventPayload).toMatchObject(searchInput);

		testDb.cleanup();
	});

	it('playlists endpoints interact with API and DB', async () => {
		const setup = await createSpotifyClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		// Fetch user ID and playlist ID dynamically
		let testUserId: string | undefined;
		const userPlaylists = await corsair.spotify.api.playlists.getUserPlaylists({
			limit: 1,
		});

		if (userPlaylists.items && userPlaylists.items.length > 0) {
			const firstPlaylist = userPlaylists.items[0];
			if (firstPlaylist?.owner?.id) {
				testUserId = firstPlaylist.owner.id;
			}
		}

		if (!testUserId) {
			// Try to get from search if getUserPlaylists didn't work
			const searchResult = await corsair.spotify.api.playlists.search({
				q: 'playlist:workout',
				type: 'playlist',
				limit: 1,
			});
			const playlist = searchResult.playlists?.items?.[0];
			if (playlist?.owner?.id) {
				testUserId = playlist.owner.id;
			}
		}

		if (!testUserId) {
			testDb.cleanup();
			return;
		}

		const getUserPlaylistsInput = {
			user_id: testUserId,
			limit: 10,
		};

		const userPlaylists2 = await corsair.spotify.api.playlists.getUserPlaylists(
			getUserPlaylistsInput,
		);

		expect(userPlaylists2).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const getUserPlaylistsEvents = await orm.events.findMany({
			where: { event_type: 'spotify.playlists.getUserPlaylists' },
		});

		expect(getUserPlaylistsEvents.length).toBeGreaterThan(0);
		const getUserPlaylistsEvent =
			getUserPlaylistsEvents[getUserPlaylistsEvents.length - 1]!;
		const getUserPlaylistsEventPayload =
			typeof getUserPlaylistsEvent.payload === 'string'
				? JSON.parse(getUserPlaylistsEvent.payload)
				: getUserPlaylistsEvent.payload;
		expect(getUserPlaylistsEventPayload).toMatchObject(getUserPlaylistsInput);

		if (userPlaylists2.items && userPlaylists2.items.length > 0) {
			const firstPlaylist = userPlaylists2.items[0];
			if (firstPlaylist && firstPlaylist.id) {
				const getInput = {
					playlist_id: firstPlaylist.id,
				};

				const playlist = await corsair.spotify.api.playlists.get(getInput);

				expect(playlist).toBeDefined();
				expect(playlist.id).toBe(firstPlaylist.id);

				const getEvents = await orm.events.findMany({
					where: { event_type: 'spotify.playlists.get' },
				});

				expect(getEvents.length).toBeGreaterThan(0);
				const getEvent = getEvents[getEvents.length - 1]!;
				const getEventPayload =
					typeof getEvent.payload === 'string'
						? JSON.parse(getEvent.payload)
						: getEvent.payload;
				expect(getEventPayload).toMatchObject(getInput);

				if (playlist && corsair.spotify.db.playlists) {
					const playlistFromDb =
						await corsair.spotify.db.playlists.findByEntityId(playlist.id);
					expect(playlistFromDb).not.toBeNull();
					if (playlistFromDb) {
						expect(playlistFromDb.data.id).toBe(playlist.id);
					}
				}

				const getTracksInput = {
					playlist_id: firstPlaylist.id,
					limit: 10,
				};

				const tracks =
					await corsair.spotify.api.playlists.getTracks(getTracksInput);

				expect(tracks).toBeDefined();

				const getTracksEvents = await orm.events.findMany({
					where: { event_type: 'spotify.playlists.getTracks' },
				});

				expect(getTracksEvents.length).toBeGreaterThan(0);
				const getTracksEvent = getTracksEvents[getTracksEvents.length - 1]!;
				const getTracksEventPayload =
					typeof getTracksEvent.payload === 'string'
						? JSON.parse(getTracksEvent.payload)
						: getTracksEvent.payload;
				expect(getTracksEventPayload).toMatchObject(getTracksInput);
			}
		}

		const createInput = {
			user_id: testUserId,
			name: `Corsair Test Playlist ${Date.now()}`,
			public: false,
		};

		const createdPlaylist =
			await corsair.spotify.api.playlists.create(createInput);

		expect(createdPlaylist).toBeDefined();
		expect(createdPlaylist.name).toBe(createInput.name);

		const createEvents = await orm.events.findMany({
			where: { event_type: 'spotify.playlists.create' },
		});

		expect(createEvents.length).toBeGreaterThan(0);
		const createEvent = createEvents[createEvents.length - 1]!;
		const createEventPayload =
			typeof createEvent.payload === 'string'
				? JSON.parse(createEvent.payload)
				: createEvent.payload;
		expect(createEventPayload).toMatchObject(createInput);

		if (createdPlaylist && corsair.spotify.db.playlists) {
			const playlistFromDb = await corsair.spotify.db.playlists.findByEntityId(
				createdPlaylist.id,
			);
			expect(playlistFromDb).not.toBeNull();
			if (playlistFromDb) {
				expect(playlistFromDb.data.id).toBe(createdPlaylist.id);
				expect(playlistFromDb.data.name).toBe(createdPlaylist.name);
			}
		}

		const searchInput = {
			q: 'playlist:workout',
			type: 'playlist' as const,
			limit: 10,
		};

		const searchResult =
			await corsair.spotify.api.playlists.search(searchInput);

		expect(searchResult).toBeDefined();
		expect(searchResult.playlists).toBeDefined();

		const searchEvents = await orm.events.findMany({
			where: { event_type: 'spotify.playlists.search' },
		});

		expect(searchEvents.length).toBeGreaterThan(0);
		const searchEvent = searchEvents[searchEvents.length - 1]!;
		const searchEventPayload =
			typeof searchEvent.payload === 'string'
				? JSON.parse(searchEvent.payload)
				: searchEvent.payload;
		expect(searchEventPayload).toMatchObject(searchInput);

		testDb.cleanup();
	});

	it('library endpoints interact with API and DB', async () => {
		const setup = await createSpotifyClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const getLikedTracksInput = {
			limit: 10,
		};

		const likedTracks =
			await corsair.spotify.api.library.getLikedTracks(getLikedTracksInput);

		expect(likedTracks).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const getLikedTracksEvents = await orm.events.findMany({
			where: { event_type: 'spotify.library.getLikedTracks' },
		});

		expect(getLikedTracksEvents.length).toBeGreaterThan(0);
		const getLikedTracksEvent =
			getLikedTracksEvents[getLikedTracksEvents.length - 1]!;
		const getLikedTracksEventPayload =
			typeof getLikedTracksEvent.payload === 'string'
				? JSON.parse(getLikedTracksEvent.payload)
				: getLikedTracksEvent.payload;
		expect(getLikedTracksEventPayload).toMatchObject(getLikedTracksInput);

		testDb.cleanup();
	});

	it('myData endpoints interact with API and DB', async () => {
		const setup = await createSpotifyClient();
		if (!setup) {
			return;
		}

		const { corsair, testDb } = setup;

		const getFollowedArtistsInput = {
			type: 'artist' as const,
			limit: 10,
		};

		const followedArtists = await corsair.spotify.api.myData.getFollowedArtists(
			getFollowedArtistsInput,
		);

		expect(followedArtists).toBeDefined();
		expect(followedArtists.artists).toBeDefined();

		const orm = createCorsairOrm(testDb.database);
		const getFollowedArtistsEvents = await orm.events.findMany({
			where: { event_type: 'spotify.myData.getFollowedArtists' },
		});

		expect(getFollowedArtistsEvents.length).toBeGreaterThan(0);
		const getFollowedArtistsEvent =
			getFollowedArtistsEvents[getFollowedArtistsEvents.length - 1]!;
		const getFollowedArtistsEventPayload =
			typeof getFollowedArtistsEvent.payload === 'string'
				? JSON.parse(getFollowedArtistsEvent.payload)
				: getFollowedArtistsEvent.payload;
		expect(getFollowedArtistsEventPayload).toMatchObject(
			getFollowedArtistsInput,
		);

		testDb.cleanup();
	});
});
