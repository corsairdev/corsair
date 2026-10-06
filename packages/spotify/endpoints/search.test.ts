import * as client from '../client';
import type { SpotifyContext } from '../index';
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

// The handlers only hand `ctx` to the mocked request and logger, so an empty `db` is enough.
const ctx = { db: {} } as unknown as SpotifyContext;

const expectSearchQuery = (query: Record<string, string | number>) =>
	expect(mockedRequest).toHaveBeenCalledWith('search', ctx, {
		method: 'GET',
		query,
	});

beforeEach(() => {
	jest.clearAllMocks();
	mockedRequest.mockResolvedValue({});
});

// Spotify's search endpoint requires `type` and answers 400 without it, so each
// search sends its own type when the caller does not pass one.
describe('default search type', () => {
	it("tracks.search defaults type to 'track'", async () => {
		await tracksSearch(ctx, { q: 'nirvana', limit: 5 });
		expectSearchQuery({ q: 'nirvana', limit: 5, type: 'track' });
	});

	it("playlists.search defaults type to 'playlist'", async () => {
		await playlistsSearch(ctx, { q: 'nirvana', limit: 5 });
		expectSearchQuery({ q: 'nirvana', limit: 5, type: 'playlist' });
	});

	it("artists.search defaults type to 'artist'", async () => {
		await artistsSearch(ctx, { q: 'nirvana', limit: 5 });
		expectSearchQuery({ q: 'nirvana', limit: 5, type: 'artist' });
	});
});

describe('explicit search type', () => {
	it('tracks.search keeps an explicit type', async () => {
		await tracksSearch(ctx, { q: 'nirvana', type: 'track' });
		expectSearchQuery({ q: 'nirvana', type: 'track' });
	});

	it('playlists.search keeps an explicit type', async () => {
		await playlistsSearch(ctx, { q: 'nirvana', type: 'playlist' });
		expectSearchQuery({ q: 'nirvana', type: 'playlist' });
	});

	it('artists.search keeps an explicit type', async () => {
		await artistsSearch(ctx, { q: 'nirvana', type: 'artist' });
		expectSearchQuery({ q: 'nirvana', type: 'artist' });
	});
});
