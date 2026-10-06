import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import * as client from '../client';
import { spotify } from '../index';

jest.mock('../client', () => ({
	...jest.requireActual<typeof import('../client')>('../client'),
	makeAuthenticatedSpotifyRequest: jest.fn(),
}));

const mockedRequest = jest.mocked(client.makeAuthenticatedSpotifyRequest);

// A real client, set up the way integration.test.ts does, with only the HTTP call
// mocked: no Spotify token is needed to check the query each search sends.
async function createSpotifyClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'spotify', 'default');
	const corsair = createCorsair({
		plugins: [spotify({ authType: 'oauth_2', key: 'test-access-token' })],
		database: testDb.db,
		kek: 'test-kek',
	});
	await corsair.spotify.keys.issue_new_dek();
	await corsair.spotify.keys.set_access_token('test-access-token');
	return { corsair, testDb };
}

const expectSearchQuery = (query: Record<string, string | number>) =>
	expect(mockedRequest).toHaveBeenCalledWith('search', expect.anything(), {
		method: 'GET',
		query,
	});

let setup: Awaited<ReturnType<typeof createSpotifyClient>>;

beforeEach(async () => {
	jest.clearAllMocks();
	mockedRequest.mockResolvedValue({});
	setup = await createSpotifyClient();
});

afterEach(() => {
	setup.testDb.cleanup();
});

// Spotify's search endpoint requires `type` and answers 400 without it, so each
// search sends its own type when the caller does not pass one.
describe('default search type', () => {
	it("tracks.search defaults type to 'track'", async () => {
		await setup.corsair.spotify.api.tracks.search({ q: 'nirvana', limit: 5 });
		expectSearchQuery({ q: 'nirvana', limit: 5, type: 'track' });
	});

	it("playlists.search defaults type to 'playlist'", async () => {
		await setup.corsair.spotify.api.playlists.search({
			q: 'nirvana',
			limit: 5,
		});
		expectSearchQuery({ q: 'nirvana', limit: 5, type: 'playlist' });
	});

	it("artists.search defaults type to 'artist'", async () => {
		await setup.corsair.spotify.api.artists.search({ q: 'nirvana', limit: 5 });
		expectSearchQuery({ q: 'nirvana', limit: 5, type: 'artist' });
	});
});

describe('explicit search type', () => {
	it('tracks.search keeps an explicit type', async () => {
		await setup.corsair.spotify.api.tracks.search({
			q: 'nirvana',
			type: 'track',
		});
		expectSearchQuery({ q: 'nirvana', type: 'track' });
	});

	it('playlists.search keeps an explicit type', async () => {
		await setup.corsair.spotify.api.playlists.search({
			q: 'nirvana',
			type: 'playlist',
		});
		expectSearchQuery({ q: 'nirvana', type: 'playlist' });
	});

	it('artists.search keeps an explicit type', async () => {
		await setup.corsair.spotify.api.artists.search({
			q: 'nirvana',
			type: 'artist',
		});
		expectSearchQuery({ q: 'nirvana', type: 'artist' });
	});
});
