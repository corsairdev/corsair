import { z } from 'zod';

// Shared entity schemas
export const GenreSchema = z.object({
	id: z.number(),
	name: z.string(),
	parent_id: z.number().nullable().optional(),
});
export type Genre = z.infer<typeof GenreSchema>;

export const EpisodeMinimumSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	pub_date_ms: z.number().optional(),
	audio: z.string().optional(),
	audio_length_sec: z.number().optional(),
	listennotes_url: z.string().optional(),
	image: z.string().optional(),
	thumbnail: z.string().optional(),
	maybe_audio_invalid: z.boolean().optional(),
	listennotes_edit_url: z.string().optional(),
	explicit_content: z.boolean().optional(),
	link: z.string().nullable().optional(),
});
export type EpisodeMinimum = z.infer<typeof EpisodeMinimumSchema>;

export const PodcastSimpleSchema = z.object({
	id: z.string(),
	title: z.string(),
	publisher: z.string().optional(),
	image: z.string().optional(),
	thumbnail: z.string().optional(),
	listennotes_url: z.string().optional(),
	total_episodes: z.number().optional(),
	explicit_content: z.boolean().optional(),
	description: z.string().optional(),
	itunes_id: z.number().nullable().optional(),
	rss: z.string().optional(),
	latest_pub_date_ms: z.number().optional(),
	earliest_pub_date_ms: z.number().optional(),
	language: z.string().optional(),
	country: z.string().optional(),
	website: z.string().nullable().optional(),
	is_claimed: z.boolean().optional(),
	email: z.string().nullable().optional(),
	type: z.string().optional(),
	genre_ids: z.array(z.number()).optional(),
	listen_score: z.number().nullable().optional(),
	listen_score_global_rank: z.string().nullable().optional(),
});
export type PodcastSimple = z.infer<typeof PodcastSimpleSchema>;

export const EpisodeSimpleSchema = EpisodeMinimumSchema.extend({
	podcast: PodcastSimpleSchema.optional(),
});
export type EpisodeSimple = z.infer<typeof EpisodeSimpleSchema>;

export const PodcastFullSchema = PodcastSimpleSchema.extend({
	episodes: z.array(EpisodeMinimumSchema),
	next_episode_pub_date: z.number().nullable().optional(),
});
export type PodcastFull = z.infer<typeof PodcastFullSchema>;

export const EpisodeFullSchema = EpisodeSimpleSchema.extend({
	transcript: z.string().nullable().optional(),
});
export type EpisodeFull = z.infer<typeof EpisodeFullSchema>;

export const CuratedListSimpleSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	source_url: z.string().optional(),
	source_domain: z.string().optional(),
	pub_date_ms: z.number().optional(),
	listennotes_url: z.string().optional(),
	total: z.number().optional(),
	podcasts: z.array(PodcastSimpleSchema).optional(),
});
export type CuratedListSimple = z.infer<typeof CuratedListSimpleSchema>;

export const CuratedListFullSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	source_url: z.string().optional(),
	source_domain: z.string().optional(),
	pub_date_ms: z.number().optional(),
	listennotes_url: z.string().optional(),
	total: z.number().optional(),
	podcasts: z.array(PodcastSimpleSchema),
});
export type CuratedListFull = z.infer<typeof CuratedListFullSchema>;

export const PlaylistSummarySchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	image: z.string().nullable().optional(),
	thumbnail: z.string().nullable().optional(),
	listennotes_url: z.string().optional(),
	visibility: z.string().optional(),
	episode_count: z.number().optional(),
	podcast_count: z.number().optional(),
	total_audio_length_sec: z.number().optional(),
	type: z.string().optional(),
});
export type PlaylistSummary = z.infer<typeof PlaylistSummarySchema>;

export const PlaylistItemSchema = z.object({
	id: z.number(),
	type: z.string(),
	notes: z.string().optional(),
	added_at_ms: z.number().optional(),
	// unknown because playlist item data contains heterogeneous objects (episode, podcast, custom audio).
	data: z.record(z.string(), z.unknown()).optional(),
});
export type PlaylistItem = z.infer<typeof PlaylistItemSchema>;

export const PodcastTypeaheadResultSchema = z.object({
	id: z.string(),
	title_original: z.string().optional(),
	title_highlighted: z.string().optional(),
	publisher_original: z.string().optional(),
	publisher_highlighted: z.string().optional(),
	image: z.string().optional(),
	thumbnail: z.string().optional(),
	explicit_content: z.boolean().optional(),
});
export type PodcastTypeaheadResult = z.infer<
	typeof PodcastTypeaheadResultSchema
>;

// Endpoint input & output schemas

export const SearchInputSchema = z
	.object({
		q: z.string().describe('Search term'),
		sort_by_date: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('0 for relevance, 1 for date'),
		type: z
			.enum(['episode', 'podcast', 'curated'])
			.optional()
			.describe('Type of search results'),
		offset: z.number().int().min(0).optional().describe('Pagination offset'),
		len_min: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Minimum audio length in minutes'),
		len_max: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Maximum audio length in minutes'),
		episode_count_min: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Minimum number of episodes'),
		episode_count_max: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Maximum number of episodes'),
		update_freq_min: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Minimum update frequency in hours'),
		update_freq_max: z
			.number()
			.int()
			.min(0)
			.optional()
			.describe('Maximum update frequency in hours'),
		genre_ids: z.string().optional().describe('Comma-delimited genre IDs'),
		published_before: z
			.number()
			.int()
			.optional()
			.describe('Published before epoch ms'),
		published_after: z
			.number()
			.int()
			.optional()
			.describe('Published after epoch ms'),
		only_in: z
			.string()
			.optional()
			.describe('Search only in title, description, author, or audio'),
		language: z.string().optional().describe('Filter by language'),
		region: z.string().optional().describe('Filter by region'),
		ocid: z
			.string()
			.optional()
			.describe('Comma-delimited podcast IDs to restrict search to'),
		ncid: z
			.string()
			.optional()
			.describe('Comma-delimited podcast IDs to exclude from search'),
		safe_mode: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to restrict explicit content, 0 otherwise'),
		unique_podcasts: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to return unique podcasts'),
		page_size: z
			.number()
			.int()
			.min(1)
			.max(10)
			.optional()
			.describe('Number of results per page'),
	})
	.strict();
export type SearchInput = z.infer<typeof SearchInputSchema>;

export const SearchResponseSchema = z.object({
	count: z.number(),
	next_offset: z.number().optional(),
	total: z.number(),
	took: z.number().optional(),
	// unknown because search results can be episodes, podcasts, or curated lists depending on the type query param.
	results: z.array(z.record(z.string(), z.unknown())),
});
export type SearchResponse = z.infer<typeof SearchResponseSchema>;

export const TypeaheadInputSchema = z
	.object({
		q: z.string().describe('Search query for autocomplete'),
		show_podcasts: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to include podcasts in suggestions'),
		show_genres: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to include genres in suggestions'),
		safe_mode: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to restrict explicit content'),
		show_related_searches: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to include related searches'),
	})
	.strict();
export type TypeaheadInput = z.infer<typeof TypeaheadInputSchema>;

export const TypeaheadResponseSchema = z.object({
	terms: z.array(z.string()),
	genres: z.array(GenreSchema).optional(),
	podcasts: z.array(PodcastTypeaheadResultSchema).optional(),
});
export type TypeaheadResponse = z.infer<typeof TypeaheadResponseSchema>;

export const PodcastsGetInputSchema = z
	.object({
		id: z.string().describe('Podcast ID'),
		next_episode_pub_date: z
			.number()
			.int()
			.optional()
			.describe('Pagination pub date in ms'),
		sort: z
			.enum(['recent_first', 'oldest_first'])
			.optional()
			.describe('Sort episodes'),
	})
	.strict();
export type PodcastsGetInput = z.infer<typeof PodcastsGetInputSchema>;

export const PodcastsGetResponseSchema = PodcastFullSchema;
export type PodcastsGetResponse = z.infer<typeof PodcastsGetResponseSchema>;

export const PodcastsGetEpisodesInputSchema = z
	.object({
		id: z.string().describe('Podcast ID'),
		next_episode_pub_date: z
			.number()
			.int()
			.optional()
			.describe('Pagination pub date in ms'),
		sort: z
			.enum(['recent_first', 'oldest_first'])
			.optional()
			.describe('Sort episodes'),
	})
	.strict();
export type PodcastsGetEpisodesInput = z.infer<
	typeof PodcastsGetEpisodesInputSchema
>;

export const PodcastsGetEpisodesResponseSchema = z.object({
	id: z.string().optional(),
	total_episodes: z.number().optional(),
	next_episode_pub_date: z.number().nullable().optional(),
	episodes: z.array(EpisodeMinimumSchema),
});
export type PodcastsGetEpisodesResponse = z.infer<
	typeof PodcastsGetEpisodesResponseSchema
>;

export const PodcastsGetRecommendationsInputSchema = z
	.object({
		id: z.string().describe('Podcast ID'),
		safe_mode: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to restrict explicit content'),
	})
	.strict();
export type PodcastsGetRecommendationsInput = z.infer<
	typeof PodcastsGetRecommendationsInputSchema
>;

export const PodcastsGetRecommendationsResponseSchema = z.object({
	recommendations: z.array(PodcastSimpleSchema),
});
export type PodcastsGetRecommendationsResponse = z.infer<
	typeof PodcastsGetRecommendationsResponseSchema
>;

export const PodcastsGetBestInputSchema = z
	.object({
		genre_id: z.string().optional().describe('Genre ID'),
		page: z.number().int().min(1).optional().describe('Page number'),
		region: z.string().optional().describe('Region code'),
		publisher_region: z.string().optional().describe('Publisher region code'),
		language: z.string().optional().describe('Language'),
		sort: z
			.enum(['recent_added_first', 'listen_score'])
			.optional()
			.describe('Sort option'),
		safe_mode: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to restrict explicit content'),
	})
	.strict();
export type PodcastsGetBestInput = z.infer<typeof PodcastsGetBestInputSchema>;

export const PodcastsGetBestResponseSchema = z.object({
	id: z.number(),
	name: z.string(),
	parent_id: z.number().nullable().optional(),
	total: z.number(),
	has_next: z.boolean(),
	has_previous: z.boolean(),
	page_number: z.number(),
	previous_page_number: z.number().nullable().optional(),
	next_page_number: z.number().nullable().optional(),
	listennotes_url: z.string(),
	podcasts: z.array(PodcastSimpleSchema),
});
export type PodcastsGetBestResponse = z.infer<
	typeof PodcastsGetBestResponseSchema
>;

export const EpisodesGetInputSchema = z
	.object({
		id: z.string().describe('Episode ID'),
		show_transcript: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to fetch transcript if available'),
	})
	.strict();
export type EpisodesGetInput = z.infer<typeof EpisodesGetInputSchema>;

export const EpisodesGetResponseSchema = EpisodeFullSchema;
export type EpisodesGetResponse = z.infer<typeof EpisodesGetResponseSchema>;

export const EpisodesGetRecommendationsInputSchema = z
	.object({
		id: z.string().describe('Episode ID'),
		safe_mode: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to restrict explicit content'),
	})
	.strict();
export type EpisodesGetRecommendationsInput = z.infer<
	typeof EpisodesGetRecommendationsInputSchema
>;

export const EpisodesGetRecommendationsResponseSchema = z.object({
	recommendations: z.array(EpisodeSimpleSchema),
});
export type EpisodesGetRecommendationsResponse = z.infer<
	typeof EpisodesGetRecommendationsResponseSchema
>;

export const GenresListInputSchema = z
	.object({
		top_level_only: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 for top level genres only'),
	})
	.strict();
export type GenresListInput = z.infer<typeof GenresListInputSchema>;

export const GenresListResponseSchema = z.object({
	genres: z.array(GenreSchema),
});
export type GenresListResponse = z.infer<typeof GenresListResponseSchema>;

export const CuratedListInputSchema = z
	.object({
		page: z.number().int().min(1).optional().describe('Page number'),
	})
	.strict();
export type CuratedListInput = z.infer<typeof CuratedListInputSchema>;

export const CuratedListResponseSchema = z.object({
	page_number: z.number(),
	previous_page_number: z.number().nullable().optional(),
	next_page_number: z.number().nullable().optional(),
	total: z.number(),
	has_next: z.boolean(),
	has_previous: z.boolean(),
	curated_lists: z.array(CuratedListSimpleSchema),
});
export type CuratedListResponse = z.infer<typeof CuratedListResponseSchema>;

export const CuratedGetInputSchema = z
	.object({
		id: z.string().describe('Curated list ID'),
	})
	.strict();
export type CuratedGetInput = z.infer<typeof CuratedGetInputSchema>;

export const CuratedGetResponseSchema = CuratedListFullSchema;
export type CuratedGetResponse = z.infer<typeof CuratedGetResponseSchema>;

export const PlaylistsListInputSchema = z
	.object({
		sort: z
			.enum([
				'recent_added_first',
				'oldest_added_first',
				'recent_published_first',
				'oldest_published_first',
			])
			.optional()
			.describe('Sort order'),
		page: z.number().int().min(1).optional().describe('Page number'),
	})
	.strict();
export type PlaylistsListInput = z.infer<typeof PlaylistsListInputSchema>;

export const PlaylistsListResponseSchema = z.object({
	page_number: z.number(),
	previous_page_number: z.number().nullable().optional(),
	next_page_number: z.number().nullable().optional(),
	total: z.number(),
	has_next: z.boolean(),
	has_previous: z.boolean(),
	playlists: z.array(PlaylistSummarySchema),
});
export type PlaylistsListResponse = z.infer<typeof PlaylistsListResponseSchema>;

export const PlaylistsGetInputSchema = z
	.object({
		id: z.string().describe('Playlist ID'),
		type: z
			.enum(['episode_list', 'podcast_list'])
			.optional()
			.describe('Playlist type'),
		last_timestamp_ms: z
			.number()
			.int()
			.optional()
			.describe('Pagination timestamp in ms'),
		sort: z
			.enum([
				'recent_added_first',
				'oldest_added_first',
				'recent_published_first',
				'oldest_published_first',
			])
			.optional()
			.describe('Sort order'),
	})
	.strict();
export type PlaylistsGetInput = z.infer<typeof PlaylistsGetInputSchema>;

export const PlaylistsGetResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	image: z.string().nullable().optional(),
	thumbnail: z.string().nullable().optional(),
	listennotes_url: z.string().optional(),
	visibility: z.string().optional(),
	last_timestamp_ms: z.number().optional(),
	total: z.number().optional(),
	total_audio_length_sec: z.number().optional(),
	type: z.string().optional(),
	items: z.array(PlaylistItemSchema),
});
export type PlaylistsGetResponse = z.infer<typeof PlaylistsGetResponseSchema>;

// Endpoint input & output type maps
export type ListennotesEndpointInputs = {
	'search.search': SearchInput;
	'search.typeahead': TypeaheadInput;
	'podcasts.get': PodcastsGetInput;
	'podcasts.getEpisodes': PodcastsGetEpisodesInput;
	'podcasts.getRecommendations': PodcastsGetRecommendationsInput;
	'podcasts.getBest': PodcastsGetBestInput;
	'episodes.get': EpisodesGetInput;
	'episodes.getRecommendations': EpisodesGetRecommendationsInput;
	'genres.list': GenresListInput;
	'curated.list': CuratedListInput;
	'curated.get': CuratedGetInput;
	'playlists.list': PlaylistsListInput;
	'playlists.get': PlaylistsGetInput;
};

export type ListennotesEndpointOutputs = {
	'search.search': SearchResponse;
	'search.typeahead': TypeaheadResponse;
	'podcasts.get': PodcastsGetResponse;
	'podcasts.getEpisodes': PodcastsGetEpisodesResponse;
	'podcasts.getRecommendations': PodcastsGetRecommendationsResponse;
	'podcasts.getBest': PodcastsGetBestResponse;
	'episodes.get': EpisodesGetResponse;
	'episodes.getRecommendations': EpisodesGetRecommendationsResponse;
	'genres.list': GenresListResponse;
	'curated.list': CuratedListResponse;
	'curated.get': CuratedGetResponse;
	'playlists.list': PlaylistsListResponse;
	'playlists.get': PlaylistsGetResponse;
};

export const ListennotesEndpointInputSchemas = {
	'search.search': SearchInputSchema,
	'search.typeahead': TypeaheadInputSchema,
	'podcasts.get': PodcastsGetInputSchema,
	'podcasts.getEpisodes': PodcastsGetEpisodesInputSchema,
	'podcasts.getRecommendations': PodcastsGetRecommendationsInputSchema,
	'podcasts.getBest': PodcastsGetBestInputSchema,
	'episodes.get': EpisodesGetInputSchema,
	'episodes.getRecommendations': EpisodesGetRecommendationsInputSchema,
	'genres.list': GenresListInputSchema,
	'curated.list': CuratedListInputSchema,
	'curated.get': CuratedGetInputSchema,
	'playlists.list': PlaylistsListInputSchema,
	'playlists.get': PlaylistsGetInputSchema,
} as const;

export const ListennotesEndpointOutputSchemas = {
	'search.search': SearchResponseSchema,
	'search.typeahead': TypeaheadResponseSchema,
	'podcasts.get': PodcastsGetResponseSchema,
	'podcasts.getEpisodes': PodcastsGetEpisodesResponseSchema,
	'podcasts.getRecommendations': PodcastsGetRecommendationsResponseSchema,
	'podcasts.getBest': PodcastsGetBestResponseSchema,
	'episodes.get': EpisodesGetResponseSchema,
	'episodes.getRecommendations': EpisodesGetRecommendationsResponseSchema,
	'genres.list': GenresListResponseSchema,
	'curated.list': CuratedListResponseSchema,
	'curated.get': CuratedGetResponseSchema,
	'playlists.list': PlaylistsListResponseSchema,
	'playlists.get': PlaylistsGetResponseSchema,
} as const;
