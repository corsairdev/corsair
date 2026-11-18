import {
	CuratedGetInputSchema,
	CuratedGetResponseSchema,
	CuratedListInputSchema,
	CuratedListResponseSchema,
	EpisodesGetInputSchema,
	EpisodesGetRecommendationsInputSchema,
	EpisodesGetRecommendationsResponseSchema,
	EpisodesGetResponseSchema,
	GenresListInputSchema,
	GenresListResponseSchema,
	PlaylistsGetInputSchema,
	PlaylistsGetResponseSchema,
	PlaylistsListInputSchema,
	PlaylistsListResponseSchema,
	PodcastsGetBestInputSchema,
	PodcastsGetBestResponseSchema,
	PodcastsGetEpisodesInputSchema,
	PodcastsGetEpisodesResponseSchema,
	PodcastsGetInputSchema,
	PodcastsGetRecommendationsInputSchema,
	PodcastsGetRecommendationsResponseSchema,
	PodcastsGetResponseSchema,
	SearchInputSchema,
	SearchResponseSchema,
	TypeaheadInputSchema,
	TypeaheadResponseSchema,
} from './endpoints/types';
import { listennotesEndpointSchemas } from './index';
import { ListennotesSchema } from './schema';
import { listennotesEntities } from './schema/database';

describe('Listen Notes schema', () => {
	it('declares a semver version', () => {
		expect(ListennotesSchema.version).toBeDefined();
		expect(ListennotesSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(ListennotesSchema.entities).toBe(listennotesEntities);
		expect(ListennotesSchema.entities).toEqual({});
	});
});

describe('Listen Notes endpoint schemas', () => {
	it('validates search schemas', () => {
		expect(SearchInputSchema.safeParse({ q: 'news' }).success).toBe(true);
		expect(SearchInputSchema.safeParse({}).success).toBe(false);
		expect(
			SearchInputSchema.safeParse({ q: 'news', sort_by_date: 2 }).success,
		).toBe(false);
		expect(
			SearchInputSchema.safeParse({ q: 'news', type: 'invalid' }).success,
		).toBe(false);

		const validSearchOutput = {
			count: 1,
			total: 10,
			results: [{ id: '1', title: 'Ep' }],
		};
		expect(SearchResponseSchema.safeParse(validSearchOutput).success).toBe(
			true,
		);
		expect(SearchResponseSchema.safeParse({ count: 1 }).success).toBe(false);
	});

	it('validates typeahead schemas', () => {
		expect(TypeaheadInputSchema.safeParse({ q: 'tech' }).success).toBe(true);
		expect(TypeaheadInputSchema.safeParse({}).success).toBe(false);

		const validTypeaheadOutput = {
			terms: ['tech', 'technology'],
		};
		expect(
			TypeaheadResponseSchema.safeParse(validTypeaheadOutput).success,
		).toBe(true);
		expect(TypeaheadResponseSchema.safeParse({}).success).toBe(false);
	});

	it('validates podcasts schemas', () => {
		expect(PodcastsGetInputSchema.safeParse({ id: 'pod1' }).success).toBe(true);
		expect(PodcastsGetInputSchema.safeParse({}).success).toBe(false);
		expect(
			PodcastsGetInputSchema.safeParse({ id: 'pod1', sort: 'invalid' }).success,
		).toBe(false);

		const validPodcast = {
			id: 'pod1',
			title: 'Podcast 1',
			episodes: [],
		};
		expect(PodcastsGetResponseSchema.safeParse(validPodcast).success).toBe(
			true,
		);
		expect(PodcastsGetResponseSchema.safeParse({ id: 'pod1' }).success).toBe(
			false,
		);

		expect(
			PodcastsGetEpisodesInputSchema.safeParse({ id: 'pod1' }).success,
		).toBe(true);
		expect(
			PodcastsGetEpisodesResponseSchema.safeParse({
				id: 'pod1',
				episodes: [{ id: 'ep1', title: 'Ep 1' }],
			}).success,
		).toBe(true);

		expect(
			PodcastsGetRecommendationsInputSchema.safeParse({ id: 'pod1' }).success,
		).toBe(true);
		expect(
			PodcastsGetRecommendationsResponseSchema.safeParse({
				recommendations: [{ id: 'rec1', title: 'Rec' }],
			}).success,
		).toBe(true);

		expect(PodcastsGetBestInputSchema.safeParse({ page: 1 }).success).toBe(
			true,
		);
		expect(
			PodcastsGetBestResponseSchema.safeParse({
				id: 1,
				name: 'Best',
				total: 10,
				has_next: false,
				has_previous: false,
				page_number: 1,
				listennotes_url: 'https://listennotes.com',
				podcasts: [],
			}).success,
		).toBe(true);
	});

	it('validates episodes schemas', () => {
		expect(EpisodesGetInputSchema.safeParse({ id: 'ep1' }).success).toBe(true);
		expect(EpisodesGetInputSchema.safeParse({}).success).toBe(false);

		const validEpisode = {
			id: 'ep1',
			title: 'Ep 1',
		};
		expect(EpisodesGetResponseSchema.safeParse(validEpisode).success).toBe(
			true,
		);

		expect(
			EpisodesGetRecommendationsInputSchema.safeParse({ id: 'ep1' }).success,
		).toBe(true);
		expect(
			EpisodesGetRecommendationsResponseSchema.safeParse({
				recommendations: [{ id: 'eprec1', title: 'Rec Ep' }],
			}).success,
		).toBe(true);
	});

	it('validates genres schemas', () => {
		expect(GenresListInputSchema.safeParse({}).success).toBe(true);
		expect(GenresListInputSchema.safeParse({ top_level_only: 1 }).success).toBe(
			true,
		);
		expect(GenresListInputSchema.safeParse({ top_level_only: 5 }).success).toBe(
			false,
		);

		expect(
			GenresListResponseSchema.safeParse({
				genres: [{ id: 1, name: 'Comedy', parent_id: null }],
			}).success,
		).toBe(true);
	});

	it('validates curated schemas', () => {
		expect(CuratedListInputSchema.safeParse({ page: 1 }).success).toBe(true);
		expect(
			CuratedListResponseSchema.safeParse({
				page_number: 1,
				total: 5,
				has_next: false,
				has_previous: false,
				curated_lists: [],
			}).success,
		).toBe(true);

		expect(CuratedGetInputSchema.safeParse({ id: 'clist1' }).success).toBe(
			true,
		);
		expect(
			CuratedGetResponseSchema.safeParse({
				id: 'clist1',
				title: 'Curated List',
				description: 'Desc',
				source_url: 'https://example.com',
				source_domain: 'example.com',
				pub_date_ms: 1234567,
				listennotes_url: 'https://listennotes.com',
				total: 1,
				podcasts: [],
			}).success,
		).toBe(true);
	});

	it('validates playlists schemas', () => {
		expect(
			PlaylistsListInputSchema.safeParse({ sort: 'recent_added_first' })
				.success,
		).toBe(true);
		expect(
			PlaylistsListResponseSchema.safeParse({
				page_number: 1,
				total: 0,
				has_next: false,
				has_previous: false,
				playlists: [],
			}).success,
		).toBe(true);

		expect(PlaylistsGetInputSchema.safeParse({ id: 'pl1' }).success).toBe(true);
		expect(
			PlaylistsGetResponseSchema.safeParse({
				id: 'pl1',
				name: 'Playlist',
				items: [],
			}).success,
		).toBe(true);
	});

	it('matches registered endpointSchemas map keys', () => {
		const expectedKeys = [
			'search.search',
			'search.typeahead',
			'podcasts.get',
			'podcasts.getEpisodes',
			'podcasts.getRecommendations',
			'podcasts.getBest',
			'episodes.get',
			'episodes.getRecommendations',
			'genres.list',
			'curated.list',
			'curated.get',
			'playlists.list',
			'playlists.get',
		];
		expect(Object.keys(listennotesEndpointSchemas).sort()).toEqual(
			expectedKeys.sort(),
		);
	});
});
