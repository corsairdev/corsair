import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { makeAuthenticatedSpotifyRequest } from './client';
import { spotify } from './index';

jest.mock('./client', () => ({
	...jest.requireActual('./client'),
	makeAuthenticatedSpotifyRequest: jest.fn(async () => ({ items: [] })),
}));

const request = jest.mocked(makeAuthenticatedSpotifyRequest);

const testDb = createTestDatabase();
const corsair = createCorsair({
	plugins: [spotify({ authType: 'oauth_2', key: 'token' })],
	database: testDb.db,
	kek: 'test-kek',
});

describe('getUserPlaylists', () => {
	beforeAll(() => createIntegrationAndAccount(testDb.db, 'spotify', 'default'));
	afterAll(() => testDb.cleanup());
	beforeEach(() => request.mockClear());

	it.each([
		[{}, 'me/playlists'],
		[{ user_id: 'me' }, 'me/playlists'],
		[{ user_id: 'spotify' }, 'users/spotify/playlists'],
	])('routes %j to %s', async (input, endpoint) => {
		await corsair.spotify.api.playlists.getUserPlaylists(input);

		expect(request).toHaveBeenCalledWith(endpoint, expect.anything(), {
			method: 'GET',
			query: {},
		});
	});

	it('forwards pagination without leaking user_id into the query', async () => {
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

	it('sends items and snapshot_id to DELETE /playlists/{id}/items', async () => {
		await corsair.spotify.api.playlists.removeItem({
			playlist_id: 'p1',
			tracks: [{ uri: 'spotify:track:1' }],
			snapshot_id: 'snap',
		});

		expect(request).toHaveBeenCalledWith(
			'playlists/p1/items',
			expect.anything(),
			{
				method: 'DELETE',
				body: { items: [{ uri: 'spotify:track:1' }], snapshot_id: 'snap' },
			},
		);
	});

	it('leaves snapshot_id out of the DELETE body when not given', async () => {
		await corsair.spotify.api.playlists.removeItem({
			playlist_id: 'p1',
			tracks: [{ uri: 'spotify:track:1' }, { uri: 'spotify:episode:2' }],
		});

		expect(request).toHaveBeenCalledWith(
			'playlists/p1/items',
			expect.anything(),
			{
				method: 'DELETE',
				body: {
					items: [{ uri: 'spotify:track:1' }, { uri: 'spotify:episode:2' }],
				},
			},
		);
	});
});
