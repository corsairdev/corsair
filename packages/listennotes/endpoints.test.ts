import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Curated,
	Directory,
	Episodes,
	Genres,
	Playlists,
	Podcasts,
	Search,
} from './endpoints';
import type { ListennotesContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeListennotesRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeListennotesRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function withUndocumentedField<T extends object>(input: T) {
	return { ...input, undocumented: true };
}

function buildCtx(): ListennotesContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('strict request validation', () => {
	it('rejects undocumented input fields before HTTP for every operation', async () => {
		// unknown because the heterogeneous operation outputs are only awaited for rejection.
		const calls: Array<() => Promise<unknown>> = [
			() => Search.search(ctx, withUndocumentedField({ q: 'term' })),
			() => Search.typeahead(ctx, withUndocumentedField({ q: 'term' })),
			() =>
				Search.searchEpisodeTitles(ctx, withUndocumentedField({ q: 'title' })),
			() => Search.relatedSearches(ctx, withUndocumentedField({ q: 'topic' })),
			() => Search.spellcheck(ctx, withUndocumentedField({ q: 'speling' })),
			() => Podcasts.get(ctx, withUndocumentedField({ id: 'podcast' })),
			() => Podcasts.getEpisodes(ctx, withUndocumentedField({ id: 'podcast' })),
			() =>
				Podcasts.getRecommendations(
					ctx,
					withUndocumentedField({ id: 'podcast' }),
				),
			() => Podcasts.getBest(ctx, withUndocumentedField({ page: 1 })),
			() => Podcasts.getBatch(ctx, withUndocumentedField({ ids: 'podcast' })),
			() =>
				Podcasts.deletePodcast(ctx, withUndocumentedField({ id: 'podcast' })),
			() =>
				Podcasts.submit(
					ctx,
					withUndocumentedField({ rss: 'https://feeds.example.com/show.xml' }),
				),
			() => Podcasts.refreshRss(ctx, withUndocumentedField({ id: 'podcast' })),
			() => Podcasts.getAudience(ctx, withUndocumentedField({ id: 'podcast' })),
			() =>
				Podcasts.getByDomain(
					ctx,
					withUndocumentedField({ domain_name: 'publisher.example' }),
				),
			() => Episodes.get(ctx, withUndocumentedField({ id: 'episode' })),
			() =>
				Episodes.getRecommendations(
					ctx,
					withUndocumentedField({ id: 'episode' }),
				),
			() => Episodes.getBatch(ctx, withUndocumentedField({ ids: 'episode' })),
			() => Genres.list(ctx, withUndocumentedField({ top_level_only: 1 })),
			() => Curated.list(ctx, withUndocumentedField({ page: 1 })),
			() => Curated.get(ctx, withUndocumentedField({ id: 'list' })),
			() => Playlists.list(ctx, withUndocumentedField({ page: 1 })),
			() => Playlists.get(ctx, withUndocumentedField({ id: 'm1pe7z60bsw' })),
			() => Playlists.create(ctx, withUndocumentedField({ name: 'Favorites' })),
			() =>
				Playlists.update(
					ctx,
					withUndocumentedField({ id: 'm1pe7z60bsw', name: 'Updated' }),
				),
			() => Playlists.remove(ctx, withUndocumentedField({ id: 'm1pe7z60bsw' })),
			() =>
				Playlists.addItem(
					ctx,
					withUndocumentedField({
						id: 'm1pe7z60bsw',
						episode_id: '0123456789abcdef0123456789abcdef',
					}),
				),
			() =>
				Playlists.updateItem(
					ctx,
					withUndocumentedField({
						id: 'm1pe7z60bsw',
						item_id: 1,
						notes: 'note',
					}),
				),
			() =>
				Playlists.deleteItem(
					ctx,
					withUndocumentedField({ id: 'm1pe7z60bsw', item_id: 1 }),
				),
		];

		for (const call of calls) await expect(call()).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('search endpoints', () => {
	it('search.search sends query and returns parsed output', async () => {
		const mockResponse = {
			count: 1,
			next_offset: 10,
			total: 100,
			took: 0.05,
			results: [{ id: 'ep1', title: 'Episode 1' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Search.search(ctx, {
			q: 'technology',
			sort_by_date: 0,
			type: 'episode',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/search', 'test-api-key', {
			method: 'GET',
			query: { q: 'technology', sort_by_date: 0, type: 'episode' },
		});
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'listennotes.search.search',
			{ count: 1 },
			'completed',
		);
	});

	it('search.search rejects invalid input before network I/O', async () => {
		await expect(
			Search.search(ctx, withUndocumentedField({ q: 'news' })),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('search.typeahead sends parameters and returns autocomplete items', async () => {
		const mockResponse = {
			terms: ['tech', 'technology'],
			genres: [{ id: 127, name: 'Technology', parent_id: null }],
			podcasts: [
				{
					id: 'p1',
					title_original: 'Tech Podcast',
					title_highlighted: '<mark>Tech</mark> Podcast',
					publisher_original: 'Pub',
					publisher_highlighted: 'Pub',
					image: 'https://example.com/p.jpg',
					thumbnail: 'https://example.com/p_thumb.jpg',
					explicit_content: false,
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Search.typeahead(ctx, {
			q: 'tech',
			show_podcasts: 1,
			show_genres: 1,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/typeahead', 'test-api-key', {
			method: 'GET',
			query: { q: 'tech', show_podcasts: 1, show_genres: 1 },
		});
	});

	it('search.typeahead rejects invalid input before network I/O', async () => {
		await expect(
			Search.typeahead(ctx, withUndocumentedField({ q: 'news' })),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('search.searchEpisodeTitles queries the documented episode-title route', async () => {
		const mockResponse = {
			count: 1,
			total: 1,
			next_offset: 1,
			results: [{ id: 'episode1', title_original: 'A title' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Search.searchEpisodeTitles(ctx, {
				q: 'A title',
				podcast_id: 'podcast1',
				podcast_id_type: 'listennotes_id',
			}),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/search_episode_titles',
			'test-api-key',
			{
				method: 'GET',
				query: {
					q: 'A title',
					podcast_id: 'podcast1',
					podcast_id_type: 'listennotes_id',
				},
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'listennotes.search.searchEpisodeTitles',
			{ count: 1 },
			'completed',
		);
	});

	it('search.trendingSearches fetches terms without query parameters', async () => {
		const mockResponse = { terms: ['podcasts', 'technology'] };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Search.trendingSearches(ctx, {})).resolves.toEqual(
			mockResponse,
		);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/trending_searches',
			'test-api-key',
			{ method: 'GET', query: {} },
		);
	});

	it('search.relatedSearches sends the term and parses related terms', async () => {
		const mockResponse = { terms: ['climate', 'climate change'] };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Search.relatedSearches(ctx, { q: 'climate' }),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/related_searches',
			'test-api-key',
			{ method: 'GET', query: { q: 'climate' } },
		);
	});

	it('search.spellcheck sends the term and parses corrections', async () => {
		const mockResponse = {
			tokens: [{ offset: 0, token: 'tecnology', suggestion: 'technology' }],
			corrected_text_html: '<b><i>technology</i></b>',
		};
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Search.spellcheck(ctx, { q: 'tecnology' })).resolves.toEqual(
			mockResponse,
		);
		expect(mockedRequest).toHaveBeenCalledWith('/spellcheck', 'test-api-key', {
			method: 'GET',
			query: { q: 'tecnology' },
		});
	});
});

describe('podcasts endpoints', () => {
	it('podcasts.get sends ID and returns podcast details', async () => {
		const mockResponse = {
			id: 'pod123',
			title: 'The Daily',
			publisher: 'The New York Times',
			total_episodes: 500,
			episodes: [
				{
					id: 'ep1',
					title: 'Today Story',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Podcasts.get(ctx, {
			id: 'pod123',
			sort: 'recent_first',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/podcasts/pod123',
			'test-api-key',
			{
				method: 'GET',
				query: { sort: 'recent_first' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'listennotes.podcasts.get',
			{ id: 'pod123' },
			'completed',
		);
	});

	it('podcasts.get rejects invalid input before network I/O', async () => {
		await expect(
			Podcasts.get(ctx, withUndocumentedField({ id: 'pod123' })),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('podcasts.getEpisodes sends ID and returns episodes list', async () => {
		const mockResponse = {
			id: 'pod123',
			total_episodes: 500,
			episodes: [
				{
					id: 'ep1',
					title: 'Today Story',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Podcasts.getEpisodes(ctx, {
			id: 'pod123',
			sort: 'recent_first',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/podcasts/pod123',
			'test-api-key',
			{
				method: 'GET',
				query: { sort: 'recent_first' },
			},
		);
	});

	it('podcasts.getEpisodes rejects invalid input before network I/O', async () => {
		await expect(
			Podcasts.getEpisodes(ctx, withUndocumentedField({ id: 'pod123' })),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('podcasts.getRecommendations sends ID and returns recommended shows', async () => {
		const mockResponse = {
			recommendations: [
				{
					id: 'rec1',
					title: 'Recommended Show',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Podcasts.getRecommendations(ctx, {
			id: 'pod123',
			safe_mode: 1,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/podcasts/pod123/recommendations',
			'test-api-key',
			{
				method: 'GET',
				query: { safe_mode: 1 },
			},
		);
	});

	it('podcasts.getBest sends genre and page and returns best shows', async () => {
		const mockResponse = {
			id: 127,
			name: 'Technology',
			total: 50,
			has_next: true,
			has_previous: false,
			page_number: 1,
			listennotes_url: 'https://listennotes.com/best/127',
			podcasts: [
				{
					id: 'best1',
					title: 'Best Tech',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Podcasts.getBest(ctx, {
			genre_id: '127',
			page: 1,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/best_podcasts',
			'test-api-key',
			{
				method: 'GET',
				query: { genre_id: '127', page: 1 },
			},
		);
	});

	it('podcasts.getBatch sends form-encoded selectors', async () => {
		const mockResponse = {
			podcasts: [
				{ id: 'pod1', title: 'Podcast 1' },
				{ id: 'pod2', title: 'Podcast 2' },
			],
			latest_episodes: [],
			next_episode_pub_date: 1_700_000_000_000,
		};
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Podcasts.getBatch(ctx, {
				ids: 'pod1,pod2',
				show_latest_episodes: 1,
				next_episode_pub_date: 1_700_000_000_000,
			}),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/podcasts', 'test-api-key', {
			method: 'POST',
			body: 'ids=pod1%2Cpod2&show_latest_episodes=1&next_episode_pub_date=1700000000000',
			mediaType: 'application/x-www-form-urlencoded',
		});
	});

	it('podcasts.delete sends the optional reason and parses the deletion status', async () => {
		const mockResponse = { status: 'in review' };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Podcasts.deletePodcast(ctx, { id: 'pod1', reason: 'duplicate feed' }),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/podcasts/pod1',
			'test-api-key',
			{
				method: 'DELETE',
				query: { reason: 'duplicate feed' },
			},
		);
	});

	it('podcasts.submit sends form data and does not log the submitted email', async () => {
		const mockResponse = { status: 'in review', podcast: {} };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Podcasts.submit(ctx, {
				rss: 'https://feeds.example.com/podcast.xml',
				email: 'owner@example.com',
			}),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/podcasts/submit',
			'test-api-key',
			{
				method: 'POST',
				body: 'rss=https%3A%2F%2Ffeeds.example.com%2Fpodcast.xml&email=owner%40example.com',
				mediaType: 'application/x-www-form-urlencoded',
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'listennotes.podcasts.submit',
			{ status: 'in review' },
			'completed',
		);
	});

	it('podcasts.refreshRss requests an RSS refresh', async () => {
		const mockResponse = {
			status: 'refreshing',
			last_refreshed_at_ms: 1_700_000_000_000,
		};
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Podcasts.refreshRss(ctx, { id: 'pod1' })).resolves.toEqual(
			mockResponse,
		);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/podcasts/pod1/rss',
			'test-api-key',
			{ method: 'POST' },
		);
	});

	it('podcasts.getAudience fetches documented region breakdowns', async () => {
		const mockResponse = {
			by_regions: [{ region: 'us', ratio: '20.22%' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Podcasts.getAudience(ctx, { id: 'pod1' })).resolves.toEqual(
			mockResponse,
		);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/podcasts/pod1/audience',
			'test-api-key',
			{ method: 'GET' },
		);
	});

	it('podcasts.getByDomain sends a page and parses podcast results', async () => {
		const mockResponse = {
			page_number: 2,
			has_next: false,
			podcasts: [{ id: 'pod1', title: 'Podcast 1' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Podcasts.getByDomain(ctx, { domain_name: 'publisher.example', page: 2 }),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/podcasts/domains/publisher.example',
			'test-api-key',
			{ method: 'GET', query: { page: 2 } },
		);
	});
});

describe('episodes endpoints', () => {
	it('episodes.get sends ID and returns episode details', async () => {
		const mockResponse = {
			id: 'ep123',
			title: 'Episode 123',
			audio: 'https://example.com/audio.mp3',
			audio_length_sec: 1800,
			podcast: { id: 'pod1', title: 'Pod 1' },
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Episodes.get(ctx, {
			id: 'ep123',
			show_transcript: 1,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/episodes/ep123',
			'test-api-key',
			{
				method: 'GET',
				query: { show_transcript: 1 },
			},
		);
	});

	it('episodes.getRecommendations sends ID and returns recommended episodes', async () => {
		const mockResponse = {
			recommendations: [
				{
					id: 'eprec1',
					title: 'Recommended Episode',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Episodes.getRecommendations(ctx, {
			id: 'ep123',
			safe_mode: 0,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/episodes/ep123/recommendations',
			'test-api-key',
			{
				method: 'GET',
				query: { safe_mode: 0 },
			},
		);
	});

	it('episodes.getBatch posts comma-separated episode IDs as form data', async () => {
		const mockResponse = {
			episodes: [{ id: 'ep1', title: 'Episode 1' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Episodes.getBatch(ctx, { ids: 'ep1,ep2' })).resolves.toEqual(
			mockResponse,
		);
		expect(mockedRequest).toHaveBeenCalledWith('/episodes', 'test-api-key', {
			method: 'POST',
			body: 'ids=ep1%2Cep2',
			mediaType: 'application/x-www-form-urlencoded',
		});
	});

	it('episodes.justListen fetches a random episode', async () => {
		const mockResponse = { id: 'ep1', title: 'Episode 1' };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Episodes.justListen(ctx, {})).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/just_listen', 'test-api-key', {
			method: 'GET',
			query: {},
		});
	});
});

describe('genres endpoints', () => {
	it('genres.list sends query and returns genres list', async () => {
		const mockResponse = {
			genres: [{ id: 67, name: 'Comedy', parent_id: null }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Genres.list(ctx, {
			top_level_only: 1,
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/genres', 'test-api-key', {
			method: 'GET',
			query: { top_level_only: 1 },
		});
	});
});

describe('directory endpoints', () => {
	it('regions.list parses a map of region codes to names', async () => {
		const mockResponse = {
			regions: { us: 'United States', gb: 'United Kingdom' },
		};
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Directory.regions(ctx, {})).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/regions', 'test-api-key', {
			method: 'GET',
			query: {},
		});
	});

	it('languages.list parses the supported language names', async () => {
		const mockResponse = { languages: ['English', 'French'] };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Directory.languages(ctx, {})).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/languages', 'test-api-key', {
			method: 'GET',
			query: {},
		});
	});
});

describe('curated endpoints', () => {
	it('curated.list sends page and returns curated podcast lists', async () => {
		const mockResponse = {
			page_number: 1,
			total: 10,
			has_next: true,
			has_previous: false,
			curated_lists: [
				{
					id: 'clist1',
					title: 'Curated 1',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Curated.list(ctx, { page: 1 });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/curated_podcasts',
			'test-api-key',
			{
				method: 'GET',
				query: { page: 1 },
			},
		);
	});

	it('curated.get sends ID and returns curated list details', async () => {
		const mockResponse = {
			id: 'clist1',
			title: 'Curated 1',
			description: 'Description',
			source_url: 'https://example.com',
			source_domain: 'example.com',
			pub_date_ms: 1600000000000,
			listennotes_url: 'https://listennotes.com/curated/clist1',
			total: 5,
			podcasts: [{ id: 'pod1', title: 'Pod 1' }],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Curated.get(ctx, { id: 'clist1' });

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/curated_podcasts/clist1',
			'test-api-key',
			{
				method: 'GET',
			},
		);
	});
});

describe('playlists endpoints', () => {
	it('playlists.list sends query and returns playlists summaries', async () => {
		const mockResponse = {
			page_number: 1,
			total: 5,
			has_next: false,
			has_previous: false,
			playlists: [
				{
					id: 'm1pe7z60bsw',
					name: 'My Playlist',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Playlists.list(ctx, {
			page: 1,
			sort: 'name_a_to_z',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/playlists', 'test-api-key', {
			method: 'GET',
			query: { page: 1, sort: 'name_a_to_z' },
		});
	});

	it('playlists.get sends ID and returns playlist details and items', async () => {
		const mockResponse = {
			id: 'm1pe7z60bsw',
			name: 'My Playlist',
			items: [
				{
					id: 1,
					type: 'episode',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Playlists.get(ctx, {
			id: 'm1pe7z60bsw',
			type: 'episode_list',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/playlists/m1pe7z60bsw',
			'test-api-key',
			{
				method: 'GET',
				query: { type: 'episode_list' },
			},
		);
	});

	it('playlists.create posts new playlist metadata', async () => {
		const mockResponse = { id: 'playlist123', name: 'Favorites' };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Playlists.create(ctx, { name: 'Favorites', visibility: 'private' }),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/playlists', 'test-api-key', {
			method: 'POST',
			body: { name: 'Favorites', visibility: 'private' },
		});
	});

	it('playlists.update sends only the supplied metadata fields', async () => {
		const mockResponse = { id: 'playlist123', name: 'Updated favorites' };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Playlists.update(ctx, { id: 'playlist123', name: 'Updated favorites' }),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/playlists/playlist123',
			'test-api-key',
			{ method: 'PUT', body: { name: 'Updated favorites' } },
		);
	});

	it('playlists.delete removes the playlist and returns its deletion status', async () => {
		const mockResponse = { id: 'playlist123', deleted: true as const };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(Playlists.remove(ctx, { id: 'playlist123' })).resolves.toEqual(
			mockResponse,
		);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/playlists/playlist123',
			'test-api-key',
			{ method: 'DELETE' },
		);
	});

	it('playlists.addItem adds an episode and optional notes', async () => {
		const mockResponse = { id: 8, type: 'episode', notes: 'Listen later' };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Playlists.addItem(ctx, {
				id: 'playlist123',
				episode_id: '0123456789abcdef0123456789abcdef',
				notes: 'Listen later',
			}),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/playlists/playlist123/items',
			'test-api-key',
			{
				method: 'POST',
				body: {
					episode_id: '0123456789abcdef0123456789abcdef',
					notes: 'Listen later',
				},
			},
		);
	});

	it('playlists.updateItem replaces the item notes', async () => {
		const mockResponse = { id: 8, type: 'episode', notes: 'Updated note' };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Playlists.updateItem(ctx, {
				id: 'playlist123',
				item_id: 8,
				notes: 'Updated note',
			}),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/playlists/playlist123/items/8',
			'test-api-key',
			{ method: 'PUT', body: { notes: 'Updated note' } },
		);
	});

	it('playlists.deleteItem removes the playlist item', async () => {
		const mockResponse = { id: 8, deleted: true };
		mockedRequest.mockResolvedValue(mockResponse);
		await expect(
			Playlists.deleteItem(ctx, { id: 'playlist123', item_id: 8 }),
		).resolves.toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/playlists/playlist123/items/8',
			'test-api-key',
			{ method: 'DELETE' },
		);
	});
});
