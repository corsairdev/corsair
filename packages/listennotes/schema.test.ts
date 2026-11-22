import {
	CuratedGetInputSchema,
	CuratedGetResponseSchema,
	CuratedListInputSchema,
	CuratedListResponseSchema,
	EpisodesBatchInputSchema,
	EpisodesBatchResponseSchema,
	EpisodesGetInputSchema,
	EpisodesGetRecommendationsInputSchema,
	EpisodesGetRecommendationsResponseSchema,
	EpisodesGetResponseSchema,
	EpisodesJustListenInputSchema,
	GenresListInputSchema,
	GenresListResponseSchema,
	LanguagesListInputSchema,
	LanguagesListResponseSchema,
	ListennotesEndpointInputSchemas,
	ListennotesEndpointOutputSchemas,
	PlaylistsAddItemInputSchema,
	PlaylistsCreateInputSchema,
	PlaylistsDeleteInputSchema,
	PlaylistsDeleteItemInputSchema,
	PlaylistsDeleteItemResponseSchema,
	PlaylistsDeleteResponseSchema,
	PlaylistsGetInputSchema,
	PlaylistsGetResponseSchema,
	PlaylistsListInputSchema,
	PlaylistsListResponseSchema,
	PlaylistsUpdateInputSchema,
	PlaylistsUpdateItemInputSchema,
	PodcastsAudienceInputSchema,
	PodcastsAudienceResponseSchema,
	PodcastsBatchInputSchema,
	PodcastsBatchResponseSchema,
	PodcastsByDomainInputSchema,
	PodcastsByDomainResponseSchema,
	PodcastsDeleteInputSchema,
	PodcastsDeleteResponseSchema,
	PodcastsGetBestInputSchema,
	PodcastsGetBestResponseSchema,
	PodcastsGetEpisodesInputSchema,
	PodcastsGetEpisodesResponseSchema,
	PodcastsGetInputSchema,
	PodcastsGetRecommendationsInputSchema,
	PodcastsGetRecommendationsResponseSchema,
	PodcastsGetResponseSchema,
	PodcastsRefreshRssInputSchema,
	PodcastsRefreshRssResponseSchema,
	PodcastsSubmitInputSchema,
	PodcastsSubmitResponseSchema,
	RegionsListInputSchema,
	RegionsListResponseSchema,
	SearchEpisodeTitlesInputSchema,
	SearchEpisodeTitlesResponseSchema,
	SearchInputSchema,
	SearchResponseSchema,
	SearchTermInputSchema,
	SearchTermsResponseSchema,
	SearchTrendingInputSchema,
	SpellcheckResponseSchema,
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
		expect(
			SearchResponseSchema.safeParse({
				count: 1.5,
				total: 2,
				results: [],
			}).success,
		).toBe(false);
		expect(
			SearchInputSchema.safeParse({
				q: 'podcasts',
				interviews_only: 1,
				sponsored_only: 0,
				genre_ids: '68,82',
				only_in: 'title,description',
				ocid: 'podcast1,podcast2',
			}).success,
		).toBe(true);
		expect(
			SearchInputSchema.safeParse({ q: 'podcasts', interviews_only: 2 })
				.success,
		).toBe(false);
		expect(
			SearchInputSchema.safeParse({ q: 'podcasts', only_in: 'email' }).success,
		).toBe(false);
		expect(
			SearchInputSchema.safeParse({ q: 'podcasts', genre_ids: 'comedy' })
				.success,
		).toBe(false);
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

	it('validates additional search operations and strict parameter shapes', () => {
		expect(
			SearchEpisodeTitlesInputSchema.safeParse({
				q: 'Episode title',
				podcast_id_type: 'spotify_id',
			}).success,
		).toBe(true);
		expect(
			SearchEpisodeTitlesInputSchema.safeParse({
				q: 'Episode title',
				podcast_id_type: 'unknown',
			}).success,
		).toBe(false);
		expect(
			SearchEpisodeTitlesInputSchema.safeParse({
				q: 'Episode title',
				offset: 10,
			}).success,
		).toBe(false);
		expect(
			SearchEpisodeTitlesResponseSchema.safeParse({
				count: 1,
				results: [{ id: 'episode1' }],
			}).success,
		).toBe(true);
		expect(SearchTrendingInputSchema.safeParse({}).success).toBe(true);
		expect(
			SearchTrendingInputSchema.safeParse({ undocumented: true }).success,
		).toBe(false);
		expect(SearchTermInputSchema.safeParse({ q: 'topic' }).success).toBe(true);
		expect(
			SearchTermsResponseSchema.safeParse({ terms: ['topic'] }).success,
		).toBe(true);
		expect(
			SpellcheckResponseSchema.safeParse({
				tokens: [{ offset: 0, token: 'teh', suggestion: 'the' }],
				corrected_text_html: '<b><i>the</i></b>',
			}).success,
		).toBe(true);
	});

	it('rejects malformed outputs for newly added operation families', () => {
		expect(
			SearchEpisodeTitlesResponseSchema.safeParse({ count: 'one' }).success,
		).toBe(false);
		expect(
			SearchTermsResponseSchema.safeParse({ terms: 'topic' }).success,
		).toBe(false);
		expect(
			SpellcheckResponseSchema.safeParse({ tokens: [], corrected_text_html: 1 })
				.success,
		).toBe(false);
		expect(
			EpisodesBatchResponseSchema.safeParse({ episodes: 'episode' }).success,
		).toBe(false);
		expect(
			PodcastsBatchResponseSchema.safeParse({ podcasts: 'podcast' }).success,
		).toBe(false);
		expect(
			PodcastsDeleteResponseSchema.safeParse({ status: 'pending' }).success,
		).toBe(false);
		expect(
			PodcastsSubmitResponseSchema.safeParse({
				status: 'pending',
				podcast: {},
			}).success,
		).toBe(false);
		expect(
			PodcastsRefreshRssResponseSchema.safeParse({ status: 'queued' }).success,
		).toBe(false);
		expect(
			PodcastsAudienceResponseSchema.safeParse({ by_regions: 'us' }).success,
		).toBe(false);
		expect(
			PodcastsByDomainResponseSchema.safeParse({ podcasts: 'podcast' }).success,
		).toBe(false);
		expect(
			RegionsListResponseSchema.safeParse({ regions: { us: 1 } }).success,
		).toBe(false);
		expect(
			LanguagesListResponseSchema.safeParse({ languages: [1] }).success,
		).toBe(false);
		expect(
			PlaylistsDeleteResponseSchema.safeParse({ id: 'short', deleted: true })
				.success,
		).toBe(false);
		expect(
			PlaylistsDeleteItemResponseSchema.safeParse({ id: 'item', deleted: true })
				.success,
		).toBe(false);
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
		for (const sort of [
			'recent_added_first',
			'oldest_added_first',
			'recent_published_first',
			'oldest_published_first',
			'listen_score',
		]) {
			expect(PodcastsGetBestInputSchema.safeParse({ sort }).success).toBe(true);
		}
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
			EpisodesGetResponseSchema.safeParse({
				...validEpisode,
				pub_date_ms: 1.5,
			}).success,
		).toBe(false);

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
		).toBe(false);
		expect(
			PlaylistsListInputSchema.safeParse({ sort: 'name_a_to_z' }).success,
		).toBe(true);
		expect(
			PlaylistsListInputSchema.safeParse({ sort: 'name_z_to_a' }).success,
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

		expect(
			PlaylistsGetInputSchema.safeParse({ id: 'm1pe7z60bsw' }).success,
		).toBe(true);
		expect(PlaylistsGetInputSchema.safeParse({ id: 'pl1' }).success).toBe(
			false,
		);
		expect(
			PlaylistsGetInputSchema.safeParse({
				id: 'm1pe7z60bsw',
				sort: 'recent_added_first',
			}).success,
		).toBe(true);
		expect(
			PlaylistsGetInputSchema.safeParse({
				id: 'm1pe7z60bsw',
				sort: 'name_a_to_z',
			}).success,
		).toBe(false);
		expect(
			PlaylistsGetResponseSchema.safeParse({
				id: 'm1pe7z60bsw',
				name: 'Playlist',
				items: [],
			}).success,
		).toBe(true);
	});

	it('validates documented batch, podcast write, and insight schemas', () => {
		expect(EpisodesBatchInputSchema.safeParse({ ids: 'ep1,ep2' }).success).toBe(
			true,
		);
		expect(
			EpisodesBatchInputSchema.safeParse({
				ids: 'ep1,ep2,ep3,ep4,ep5,ep6,ep7,ep8,ep9,ep10,ep11',
			}).success,
		).toBe(false);
		expect(
			EpisodesBatchResponseSchema.safeParse({ episodes: [] }).success,
		).toBe(true);
		expect(
			PodcastsBatchInputSchema.safeParse({
				ids: 'pod1',
				show_latest_episodes: 1,
			}).success,
		).toBe(true);
		expect(PodcastsBatchInputSchema.safeParse({}).success).toBe(false);
		expect(
			PodcastsBatchInputSchema.safeParse({
				ids: Array.from({ length: 11 }, (_, index) => `pod${index}`).join(','),
			}).success,
		).toBe(false);
		expect(
			PodcastsBatchResponseSchema.safeParse({
				podcasts: [],
				next_episode_pub_date: 1_700_000_000_000,
			}).success,
		).toBe(true);
		expect(PodcastsDeleteInputSchema.safeParse({ id: 'pod1' }).success).toBe(
			true,
		);
		expect(
			PodcastsDeleteResponseSchema.safeParse({ status: 'in review' }).success,
		).toBe(true);
		expect(
			PodcastsSubmitInputSchema.safeParse({
				rss: 'https://feeds.example.com/show.xml',
				email: 'owner@example.com',
			}).success,
		).toBe(true);
		expect(
			PodcastsSubmitInputSchema.safeParse({ rss: 'not-a-url' }).success,
		).toBe(false);
		expect(
			PodcastsSubmitResponseSchema.safeParse({
				status: 'in review',
				podcast: {},
			}).success,
		).toBe(true);
		expect(
			PodcastsRefreshRssInputSchema.safeParse({ id: 'pod1' }).success,
		).toBe(true);
		expect(
			PodcastsRefreshRssResponseSchema.safeParse({ status: 'refreshing' })
				.success,
		).toBe(true);
		expect(PodcastsAudienceInputSchema.safeParse({ id: 'pod1' }).success).toBe(
			true,
		);
		expect(PodcastsAudienceResponseSchema.safeParse({}).success).toBe(true);
		expect(
			PodcastsByDomainInputSchema.safeParse({
				domain_name: 'publisher.example',
				page: 2,
			}).success,
		).toBe(true);
		expect(
			PodcastsByDomainResponseSchema.safeParse({ podcasts: [] }).success,
		).toBe(true);
	});

	it('validates directory and playlist write schemas', () => {
		expect(RegionsListInputSchema.safeParse({}).success).toBe(true);
		expect(
			RegionsListInputSchema.safeParse({ undocumented: true }).success,
		).toBe(false);
		expect(
			RegionsListResponseSchema.safeParse({ regions: { us: 'United States' } })
				.success,
		).toBe(true);
		expect(LanguagesListInputSchema.safeParse({}).success).toBe(true);
		expect(
			LanguagesListInputSchema.safeParse({ undocumented: true }).success,
		).toBe(false);
		expect(
			LanguagesListResponseSchema.safeParse({ languages: ['English'] }).success,
		).toBe(true);
		expect(EpisodesJustListenInputSchema.safeParse({}).success).toBe(true);
		expect(
			PlaylistsCreateInputSchema.safeParse({
				name: 'Favorites',
				visibility: 'private',
			}).success,
		).toBe(true);
		expect(PlaylistsCreateInputSchema.safeParse({ name: 'rss' }).success).toBe(
			false,
		);
		expect(
			PlaylistsUpdateInputSchema.safeParse({ id: 'playlist123', name: 'New' })
				.success,
		).toBe(true);
		expect(
			PlaylistsUpdateInputSchema.safeParse({ id: 'playlist123' }).success,
		).toBe(false);
		expect(
			PlaylistsDeleteInputSchema.safeParse({ id: 'playlist123' }).success,
		).toBe(true);
		expect(
			PlaylistsDeleteResponseSchema.safeParse({
				id: 'playlist123',
				deleted: true,
			}).success,
		).toBe(true);
		expect(
			PlaylistsAddItemInputSchema.safeParse({
				id: 'playlist123',
				episode_id: '0123456789abcdef0123456789abcdef',
			}).success,
		).toBe(true);
		expect(
			PlaylistsAddItemInputSchema.safeParse({
				id: 'playlist123',
				episode_id: '0123456789abcdef0123456789abcdef',
				podcast_id: 'fedcba9876543210fedcba9876543210',
			}).success,
		).toBe(false);
		expect(
			PlaylistsUpdateItemInputSchema.safeParse({
				id: 'playlist123',
				item_id: 1,
				notes: '',
			}).success,
		).toBe(true);
		expect(
			PlaylistsDeleteItemInputSchema.safeParse({
				id: 'playlist123',
				item_id: 1,
			}).success,
		).toBe(true);
		expect(
			PlaylistsDeleteItemResponseSchema.safeParse({ id: 1, deleted: true })
				.success,
		).toBe(true);
	});

	it('matches registered endpointSchemas map keys', () => {
		const expectedKeys = [
			'search.search',
			'search.typeahead',
			'search.searchEpisodeTitles',
			'search.trendingSearches',
			'search.relatedSearches',
			'search.spellcheck',
			'podcasts.get',
			'podcasts.getEpisodes',
			'podcasts.getRecommendations',
			'podcasts.getBest',
			'podcasts.getBatch',
			'podcasts.delete',
			'podcasts.submit',
			'podcasts.refreshRss',
			'podcasts.getAudience',
			'podcasts.getByDomain',
			'episodes.get',
			'episodes.getRecommendations',
			'episodes.getBatch',
			'episodes.justListen',
			'genres.list',
			'regions.list',
			'languages.list',
			'curated.list',
			'curated.get',
			'playlists.list',
			'playlists.get',
			'playlists.create',
			'playlists.update',
			'playlists.delete',
			'playlists.addItem',
			'playlists.updateItem',
			'playlists.deleteItem',
		];
		expect(Object.keys(listennotesEndpointSchemas).sort()).toEqual(
			expectedKeys.sort(),
		);
		expect(Object.keys(ListennotesEndpointInputSchemas).sort()).toEqual(
			expectedKeys.sort(),
		);
		expect(Object.keys(ListennotesEndpointOutputSchemas).sort()).toEqual(
			expectedKeys.sort(),
		);
	});
});
