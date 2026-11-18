import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	Curated,
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
		// `unknown` because catch clause parameter is untyped.
		await expect(Search.search(ctx, {} as never)).rejects.toThrow();
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
		await expect(Search.typeahead(ctx, {} as never)).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
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
		await expect(Podcasts.get(ctx, {} as never)).rejects.toThrow();
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
			'/podcasts/pod123/episodes',
			'test-api-key',
			{
				method: 'GET',
				query: { sort: 'recent_first' },
			},
		);
	});

	it('podcasts.getEpisodes rejects invalid input before network I/O', async () => {
		await expect(Podcasts.getEpisodes(ctx, {} as never)).rejects.toThrow();
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
					id: 'pl1',
					name: 'My Playlist',
				},
			],
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Playlists.list(ctx, {
			page: 1,
			sort: 'recent_added_first',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith('/playlists', 'test-api-key', {
			method: 'GET',
			query: { page: 1, sort: 'recent_added_first' },
		});
	});

	it('playlists.get sends ID and returns playlist details and items', async () => {
		const mockResponse = {
			id: 'pl1',
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
			id: 'pl1',
			type: 'episode_list',
		});

		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/playlists/pl1',
			'test-api-key',
			{
				method: 'GET',
				query: { type: 'episode_list' },
			},
		);
	});
});
