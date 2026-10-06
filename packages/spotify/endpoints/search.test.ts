import * as client from '../client';
import { search as artistsSearch } from './artists';
import { search as playlistsSearch } from './playlists';
import { search as tracksSearch } from './tracks';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');

	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

jest.mock('../client', () => ({
	makeAuthenticatedSpotifyRequest: jest.fn(),
}));

const mockedRequest =
	client.makeAuthenticatedSpotifyRequest as jest.MockedFunction<
		typeof client.makeAuthenticatedSpotifyRequest
	>;

const ctx = { db: {} } as any;

// Spotify's search endpoint requires `type` and answers 400 without it, so each
// search sends its own type when the caller does not pass one.
describe.each([
	['tracks.search', tracksSearch, 'track'],
	['playlists.search', playlistsSearch, 'playlist'],
	['artists.search', artistsSearch, 'artist'],
] as const)('%s', (_name, search, type) => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockedRequest.mockResolvedValue({} as never);
	});

	it(`defaults type to '${type}'`, async () => {
		await search(ctx, { q: 'nirvana', limit: 5 });

		expect(mockedRequest).toHaveBeenCalledWith('search', ctx, {
			method: 'GET',
			query: { q: 'nirvana', limit: 5, type },
		});
	});

	it('keeps an explicit type', async () => {
		await search(ctx, { q: 'nirvana', type } as never);

		expect(mockedRequest).toHaveBeenCalledWith('search', ctx, {
			method: 'GET',
			query: { q: 'nirvana', type },
		});
	});
});
