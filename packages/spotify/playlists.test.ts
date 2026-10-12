import { makeAuthenticatedSpotifyRequest } from './client';
import { getUserPlaylists } from './endpoints/playlists';

jest.mock('./client', () => ({
	makeAuthenticatedSpotifyRequest: jest.fn(async () => ({ items: [] })),
}));

const request = jest.mocked(makeAuthenticatedSpotifyRequest);

const ctx = {
	key: 'token',
	db: {},
	$getAccountId: async () => 'account',
	// `unknown` is needed because the real endpoint context carries the full
	// plugin runtime; the handler only passes it to the mocked client and the
	// event logger, so a partial context is cast to the full type.
} as unknown as Parameters<typeof getUserPlaylists>[0];

describe('getUserPlaylists', () => {
	beforeEach(() => request.mockClear());

	it.each([
		[{}, 'me/playlists'],
		[{ user_id: 'me' }, 'me/playlists'],
		[{ user_id: 'spotify' }, 'users/spotify/playlists'],
	])('routes %j to %s', async (input, endpoint) => {
		await getUserPlaylists(ctx, input);

		expect(request).toHaveBeenCalledWith(endpoint, ctx, {
			method: 'GET',
			query: {},
		});
	});

	it('forwards pagination without leaking user_id into the query', async () => {
		await getUserPlaylists(ctx, { user_id: 'spotify', limit: 5, offset: 10 });

		expect(request).toHaveBeenCalledWith('users/spotify/playlists', ctx, {
			method: 'GET',
			query: { limit: 5, offset: 10 },
		});
	});
});
