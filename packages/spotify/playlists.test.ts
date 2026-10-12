import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { makeAuthenticatedSpotifyRequest } from './client';
import { spotify } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeAuthenticatedSpotifyRequest: jest.fn(async () => ({ items: [] })),
}));

const request = jest.mocked(makeAuthenticatedSpotifyRequest);

async function createSpotifyClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'spotify', 'default');
	return createCorsair({
		plugins: [spotify({ authType: 'oauth_2', key: 'token' })],
		database: testDb.db,
		kek: 'test-kek',
	});
}

describe('getUserPlaylists', () => {
	beforeEach(() => request.mockClear());

	it.each([
		[{}, 'me/playlists'],
		[{ user_id: 'me' }, 'me/playlists'],
		[{ user_id: 'spotify' }, 'users/spotify/playlists'],
	])('routes %j to %s', async (input, endpoint) => {
		const corsair = await createSpotifyClient();

		await corsair.spotify.api.playlists.getUserPlaylists(input);

		expect(request).toHaveBeenCalledWith(endpoint, expect.anything(), {
			method: 'GET',
			query: {},
		});
	});

	it('forwards pagination without leaking user_id into the query', async () => {
		const corsair = await createSpotifyClient();

		await corsair.spotify.api.playlists.getUserPlaylists({
			user_id: 'spotify',
			limit: 5,
			offset: 10,
		});

		expect(request).toHaveBeenCalledWith(
			'users/spotify/playlists',
			expect.anything(),
			{ method: 'GET', query: { limit: 5, offset: 10 } },
		);
	});
});
