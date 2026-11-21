import { z } from 'zod';

// Shared entity schemas
export const GenreSchema = z.object({
	id: z.number().int(),
	name: z.string(),
	parent_id: z.number().int().nullable().optional(),
});
export type Genre = z.infer<typeof GenreSchema>;

export const EpisodeMinimumSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	pub_date_ms: z.number().int().optional(),
	audio: z.string().optional(),
	audio_length_sec: z.number().int().optional(),
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
	id: z.string().optional(),
	title: z.string().optional(),
	publisher: z.string().optional(),
	image: z.string().optional(),
	thumbnail: z.string().optional(),
	listennotes_url: z.string().optional(),
	is_claimed: z.boolean().optional(),
	type: z.enum(['episodic', 'serial']).optional(),
	total_episodes: z.number().int().optional(),
	audio_length_sec: z.number().int().optional(),
	update_frequency_hours: z.number().int().optional(),
	earliest_pub_date_ms: z.number().int().optional(),
	rss: z.string().optional(),
	latest_episode_id: z.string().optional(),
	latest_pub_date_ms: z.number().int().optional(),
	explicit_content: z.boolean().optional(),
	description: z.string().optional(),
	itunes_id: z.number().int().nullable().optional(),
	language: z.string().optional(),
	country: z.string().optional(),
	website: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	genre_ids: z.array(z.number().int()).optional(),
	listen_score: z.number().int().nullable().optional(),
	listen_score_global_rank: z.string().nullable().optional(),
	looking_for: z
		.object({
			cohosts: z.boolean().optional(),
			cross_promotion: z.boolean().optional(),
			sponsors: z.boolean().optional(),
			guests: z.boolean().optional(),
		})
		.optional(),
	extra: z
		.object({
			youtube_url: z.string().optional(),
			facebook_handle: z.string().optional(),
			instagram_handle: z.string().optional(),
			twitter_handle: z.string().optional(),
			wechat_handle: z.string().optional(),
			patreon_handle: z.string().optional(),
			amazon_music_url: z.string().optional(),
			linkedin_url: z.string().optional(),
			spotify_url: z.string().optional(),
			url1: z.string().optional(),
			url2: z.string().optional(),
			url3: z.string().optional(),
		})
		.optional(),
	has_guest_interviews: z.boolean().optional(),
	has_sponsors: z.boolean().optional(),
});
export type PodcastSimple = z.infer<typeof PodcastSimpleSchema>;

export const EpisodeSimpleSchema = EpisodeMinimumSchema.extend({
	podcast: PodcastSimpleSchema.optional(),
});
export type EpisodeSimple = z.infer<typeof EpisodeSimpleSchema>;

export const PodcastFullSchema = PodcastSimpleSchema.extend({
	episodes: z.array(EpisodeMinimumSchema),
	next_episode_pub_date: z.number().int().nullable().optional(),
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
	pub_date_ms: z.number().int().optional(),
	listennotes_url: z.string().optional(),
	total: z.number().int().optional(),
	podcasts: z.array(PodcastSimpleSchema).optional(),
});
export type CuratedListSimple = z.infer<typeof CuratedListSimpleSchema>;

export const CuratedListFullSchema = z.object({
	id: z.string(),
	title: z.string(),
	description: z.string().optional(),
	source_url: z.string().optional(),
	source_domain: z.string().optional(),
	pub_date_ms: z.number().int().optional(),
	listennotes_url: z.string().optional(),
	total: z.number().int().optional(),
	podcasts: z.array(PodcastSimpleSchema),
});
export type CuratedListFull = z.infer<typeof CuratedListFullSchema>;

export const PlaylistSummarySchema = z.object({
	id: z.string().length(11),
	name: z.string(),
	description: z.string().optional(),
	image: z.string().nullable().optional(),
	thumbnail: z.string().nullable().optional(),
	listennotes_url: z.string().optional(),
	visibility: z.enum(['public', 'unlisted', 'private']).optional(),
	episode_count: z.number().int().optional(),
	podcast_count: z.number().int().optional(),
	total_audio_length_sec: z.number().int().optional(),
	last_timestamp_ms: z.number().int().optional(),
	type: z.enum(['episode_list', 'podcast_list']).optional(),
});
export type PlaylistSummary = z.infer<typeof PlaylistSummarySchema>;

export const PlaylistItemSchema = z.object({
	id: z.number().int(),
	type: z.enum(['episode', 'custom_audio', 'podcast']),
	notes: z.string().optional(),
	added_at_ms: z.number().int().optional(),
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
		genre_ids: z
			.string()
			.regex(/^\d+(,\d+)*$/)
			.optional()
			.describe('Comma-delimited genre IDs'),
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
			.regex(
				/^(title|description|author|audio)(,(title|description|author|audio))*$/,
			)
			.optional()
			.describe('Search only in title, description, author, or audio'),
		language: z.string().optional().describe('Filter by language'),
		region: z.string().optional().describe('Filter by region'),
		ocid: z
			.string()
			.refine(
				(value) =>
					value.split(',').length <= 5 && value.split(',').every(Boolean),
				{ message: 'A maximum of 5 podcast IDs is allowed' },
			)
			.optional()
			.describe('Comma-delimited podcast IDs to restrict search to'),
		ncid: z
			.string()
			.refine(
				(value) =>
					value.split(',').length <= 5 && value.split(',').every(Boolean),
				{ message: 'A maximum of 5 podcast IDs is allowed' },
			)
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
		interviews_only: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to include only podcasts with guest interviews'),
		sponsored_only: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to include only podcasts with sponsors'),
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
	count: z.number().int(),
	next_offset: z.number().int().optional(),
	total: z.number().int(),
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

export const SearchEpisodeTitlesInputSchema = z
	.object({
		q: z.string().describe('Episode title to search for'),
		podcast_id: z.string().optional().describe('Optional podcast identifier'),
		podcast_id_type: z
			.enum(['listennotes_id', 'itunes_id', 'spotify_id', 'rss'])
			.optional()
			.describe('Identifier format used by podcast_id'),
	})
	.strict();
export type SearchEpisodeTitlesInput = z.infer<
	typeof SearchEpisodeTitlesInputSchema
>;

export const SearchEpisodeTitlesResponseSchema = z.object({
	next_offset: z
		.number()
		.int()
		.optional()
		.describe(
			'Returned by the provider, but this operation does not document an offset request parameter.',
		),
	took: z.number().optional(),
	total: z.number().int().optional(),
	count: z.number().int().optional(),
	// unknown because the documented title search result contains a polymorphic episode entity.
	results: z.array(z.record(z.string(), z.unknown())).optional(),
});
export type SearchEpisodeTitlesResponse = z.infer<
	typeof SearchEpisodeTitlesResponseSchema
>;

export const SearchTrendingInputSchema = z.object({}).strict();
export type SearchTrendingInput = z.infer<typeof SearchTrendingInputSchema>;

export const SearchTermsResponseSchema = z.object({
	terms: z.array(z.string()),
});
export type SearchTermsResponse = z.infer<typeof SearchTermsResponseSchema>;

export const SearchTermInputSchema = z
	.object({ q: z.string().describe('Search term') })
	.strict();
export type SearchTermInput = z.infer<typeof SearchTermInputSchema>;

export const SpellcheckResponseSchema = z.object({
	tokens: z.array(
		z.object({
			offset: z.number().int().optional(),
			token: z.string().optional(),
			suggestion: z.string().optional(),
		}),
	),
	corrected_text_html: z.string(),
});
export type SpellcheckResponse = z.infer<typeof SpellcheckResponseSchema>;

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
	total_episodes: z.number().int().optional(),
	next_episode_pub_date: z.number().int().nullable().optional(),
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
			.enum([
				'recent_added_first',
				'oldest_added_first',
				'recent_published_first',
				'oldest_published_first',
				'listen_score',
			])
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
	id: z.number().int(),
	name: z.string(),
	parent_id: z.number().int().nullable().optional(),
	total: z.number().int(),
	has_next: z.boolean(),
	has_previous: z.boolean(),
	page_number: z.number().int(),
	previous_page_number: z.number().int().nullable().optional(),
	next_page_number: z.number().int().nullable().optional(),
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
	page_number: z.number().int(),
	previous_page_number: z.number().int().nullable().optional(),
	next_page_number: z.number().int().nullable().optional(),
	total: z.number().int(),
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
			.enum(['name_a_to_z', 'name_z_to_a'])
			.optional()
			.describe('Sort order'),
		page: z.number().int().min(1).optional().describe('Page number'),
	})
	.strict();
export type PlaylistsListInput = z.infer<typeof PlaylistsListInputSchema>;

export const PlaylistsListResponseSchema = z.object({
	page_number: z.number().int(),
	previous_page_number: z.number().int().nullable().optional(),
	next_page_number: z.number().int().nullable().optional(),
	total: z.number().int(),
	has_next: z.boolean(),
	has_previous: z.boolean(),
	playlists: z.array(PlaylistSummarySchema),
});
export type PlaylistsListResponse = z.infer<typeof PlaylistsListResponseSchema>;

export const PlaylistsGetInputSchema = z
	.object({
		id: z.string().length(11).describe('11-character playlist ID'),
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
	id: z.string().length(11),
	name: z.string(),
	description: z.string().optional(),
	image: z.string().nullable().optional(),
	thumbnail: z.string().nullable().optional(),
	listennotes_url: z.string().optional(),
	visibility: z.enum(['public', 'unlisted', 'private']).optional(),
	last_timestamp_ms: z.number().int().optional(),
	total: z.number().int().optional(),
	total_audio_length_sec: z.number().int().optional(),
	type: z.enum(['episode_list', 'podcast_list']).optional(),
	items: z.array(PlaylistItemSchema),
});
export type PlaylistsGetResponse = z.infer<typeof PlaylistsGetResponseSchema>;

export const PodcastsBatchInputSchema = z
	.object({
		ids: z.string().optional().describe('Comma-separated Listen Notes IDs'),
		rsses: z.string().optional().describe('Comma-separated RSS feed URLs'),
		itunes_ids: z
			.string()
			.optional()
			.describe('Comma-separated Apple Podcasts IDs'),
		spotify_ids: z.string().optional().describe('Comma-separated Spotify IDs'),
		show_latest_episodes: z
			.number()
			.int()
			.min(0)
			.max(1)
			.optional()
			.describe('1 to include the latest episodes'),
		next_episode_pub_date: z
			.number()
			.int()
			.optional()
			.describe('Pagination timestamp in epoch milliseconds'),
	})
	.strict()
	.refine(
		(input) =>
			[input.ids, input.rsses, input.itunes_ids, input.spotify_ids].some(
				(value) => value !== undefined && value.length > 0,
			),
		{ message: 'At least one podcast identifier list is required' },
	)
	.refine(
		(input) =>
			[input.ids, input.rsses, input.itunes_ids, input.spotify_ids]
				.filter((value) => value !== undefined)
				.reduce((total, value) => total + value.split(',').length, 0) <= 10,
		{ message: 'A batch can contain at most 10 podcasts' },
	);
export type PodcastsBatchInput = z.infer<typeof PodcastsBatchInputSchema>;

export const PodcastsBatchResponseSchema = z.object({
	podcasts: z.array(PodcastSimpleSchema),
	latest_episodes: z.array(EpisodeSimpleSchema).optional(),
	next_episode_pub_date: z.number().int().nullable().optional(),
});
export type PodcastsBatchResponse = z.infer<typeof PodcastsBatchResponseSchema>;

export const EpisodesBatchInputSchema = z
	.object({
		ids: z
			.string()
			.min(1)
			.refine((value) => value.split(',').length <= 10, {
				message: 'A batch can contain at most 10 episodes',
			})
			.describe('Comma-separated episode IDs'),
	})
	.strict();
export type EpisodesBatchInput = z.infer<typeof EpisodesBatchInputSchema>;

export const EpisodesBatchResponseSchema = z.object({
	episodes: z.array(EpisodeSimpleSchema),
});
export type EpisodesBatchResponse = z.infer<typeof EpisodesBatchResponseSchema>;

export const PodcastsDeleteInputSchema = z
	.object({
		id: z.string().min(1).describe('Podcast ID'),
		reason: z.string().optional().describe('Reason for requesting deletion'),
	})
	.strict();
export type PodcastsDeleteInput = z.infer<typeof PodcastsDeleteInputSchema>;

export const PodcastsDeleteResponseSchema = z.object({
	status: z.enum(['deleted', 'in review']),
});
export type PodcastsDeleteResponse = z.infer<
	typeof PodcastsDeleteResponseSchema
>;

export const PodcastsSubmitInputSchema = z
	.object({
		rss: z.string().url().describe('RSS feed URL to submit'),
		email: z
			.string()
			.email()
			.optional()
			.describe('Optional notification email'),
	})
	.strict();
export type PodcastsSubmitInput = z.infer<typeof PodcastsSubmitInputSchema>;

export const PodcastMinimumSchema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	publisher: z.string().optional(),
	image: z.string().optional(),
	thumbnail: z.string().optional(),
	listennotes_url: z.string().optional(),
	listen_score: z.number().int().nullable().optional(),
	listen_score_global_rank: z.string().nullable().optional(),
});
export type PodcastMinimum = z.infer<typeof PodcastMinimumSchema>;

export const PodcastsSubmitResponseSchema = z.object({
	status: z.enum(['found', 'in review', 'rejected']),
	podcast: PodcastMinimumSchema,
});
export type PodcastsSubmitResponse = z.infer<
	typeof PodcastsSubmitResponseSchema
>;

export const PodcastsRefreshRssInputSchema = z
	.object({ id: z.string().min(1).describe('Podcast ID') })
	.strict();
export type PodcastsRefreshRssInput = z.infer<
	typeof PodcastsRefreshRssInputSchema
>;

export const PodcastsRefreshRssResponseSchema = z.object({
	status: z.enum(['refreshing', 'refreshed']),
	last_refreshed_at_ms: z.number().int().optional(),
});
export type PodcastsRefreshRssResponse = z.infer<
	typeof PodcastsRefreshRssResponseSchema
>;

export const PodcastsAudienceInputSchema = z
	.object({ id: z.string().min(1).describe('Podcast ID') })
	.strict();
export type PodcastsAudienceInput = z.infer<typeof PodcastsAudienceInputSchema>;

export const PodcastsAudienceResponseSchema = z.object({
	by_regions: z
		.array(
			z.object({
				region: z.string().optional(),
				ratio: z.string().optional(),
			}),
		)
		.optional(),
});
export type PodcastsAudienceResponse = z.infer<
	typeof PodcastsAudienceResponseSchema
>;

export const PodcastsByDomainInputSchema = z
	.object({
		domain_name: z.string().min(1).describe("Publisher's domain name"),
		page: z.number().int().min(1).optional().describe('Page number'),
	})
	.strict();
export type PodcastsByDomainInput = z.infer<typeof PodcastsByDomainInputSchema>;

export const PodcastsByDomainResponseSchema = z.object({
	page_number: z.number().int().optional(),
	has_next: z.boolean().optional(),
	next_page_number: z.number().int().nullable().optional(),
	has_previous: z.boolean().optional(),
	previous_page_number: z.number().int().nullable().optional(),
	podcasts: z.array(PodcastSimpleSchema),
});
export type PodcastsByDomainResponse = z.infer<
	typeof PodcastsByDomainResponseSchema
>;

export const RegionsListInputSchema = z.object({}).strict();
export type RegionsListInput = z.infer<typeof RegionsListInputSchema>;

export const RegionsListResponseSchema = z.object({
	regions: z.record(z.string(), z.string()),
});
export type RegionsListResponse = z.infer<typeof RegionsListResponseSchema>;

export const LanguagesListInputSchema = z.object({}).strict();
export type LanguagesListInput = z.infer<typeof LanguagesListInputSchema>;

export const LanguagesListResponseSchema = z.object({
	languages: z.array(z.string()),
});
export type LanguagesListResponse = z.infer<typeof LanguagesListResponseSchema>;

export const EpisodesJustListenInputSchema = z.object({}).strict();
export type EpisodesJustListenInput = z.infer<
	typeof EpisodesJustListenInputSchema
>;

export const EpisodesJustListenResponseSchema = EpisodeSimpleSchema;
export type EpisodesJustListenResponse = z.infer<
	typeof EpisodesJustListenResponseSchema
>;

export const PlaylistsCreateInputSchema = z
	.object({
		name: z
			.string()
			.trim()
			.min(1)
			.max(4096)
			.refine((value) => value.toLowerCase() !== 'rss', {
				message: 'The name rss is reserved',
			})
			.describe('Playlist name'),
		description: z.string().max(4096).optional(),
		visibility: z.enum(['public', 'unlisted', 'private']).optional(),
		type: z.enum(['episode_list', 'podcast_list']).optional(),
	})
	.strict();
export type PlaylistsCreateInput = z.infer<typeof PlaylistsCreateInputSchema>;

export const PlaylistsUpdateInputSchema = z
	.object({
		id: z.string().length(11).describe('11-character playlist ID'),
		name: z
			.string()
			.trim()
			.min(1)
			.max(4096)
			.refine((value) => value.toLowerCase() !== 'rss', {
				message: 'The name rss is reserved',
			})
			.optional(),
		description: z.string().max(4096).optional(),
		visibility: z.enum(['public', 'unlisted', 'private']).optional(),
		type: z.enum(['episode_list', 'podcast_list']).optional(),
	})
	.strict()
	.refine(
		({ id, ...fields }) =>
			id.length > 0 &&
			Object.values(fields).some((value) => value !== undefined),
		{ message: 'At least one playlist field must be updated' },
	);
export type PlaylistsUpdateInput = z.infer<typeof PlaylistsUpdateInputSchema>;

export const PlaylistsDeleteInputSchema = z
	.object({ id: z.string().length(11).describe('11-character playlist ID') })
	.strict();
export type PlaylistsDeleteInput = z.infer<typeof PlaylistsDeleteInputSchema>;

export const PlaylistsDeleteResponseSchema = z.object({
	id: z.string().length(11),
	deleted: z.literal(true),
});
export type PlaylistsDeleteResponse = z.infer<
	typeof PlaylistsDeleteResponseSchema
>;

export const PlaylistsAddItemInputSchema = z
	.object({
		id: z.string().length(11).describe('11-character playlist ID'),
		episode_id: z
			.string()
			.regex(/^[0-9a-fA-F]{32}$/)
			.optional()
			.describe('Episode ID (mutually exclusive with podcast_id)'),
		podcast_id: z
			.string()
			.regex(/^[0-9a-fA-F]{32}$/)
			.optional()
			.describe('Podcast ID (mutually exclusive with episode_id)'),
		notes: z.string().max(1024).optional(),
	})
	.strict()
	.refine(
		({ episode_id, podcast_id }) =>
			(episode_id !== undefined) !== (podcast_id !== undefined),
		{ message: 'Provide exactly one of episode_id or podcast_id' },
	);
export type PlaylistsAddItemInput = z.infer<typeof PlaylistsAddItemInputSchema>;

export const PlaylistsUpdateItemInputSchema = z
	.object({
		id: z.string().length(11).describe('11-character playlist ID'),
		item_id: z.number().int().positive().describe('Playlist item ID'),
		notes: z
			.string()
			.max(1024)
			.describe('New notes, or an empty string to clear'),
	})
	.strict();
export type PlaylistsUpdateItemInput = z.infer<
	typeof PlaylistsUpdateItemInputSchema
>;

export const PlaylistsDeleteItemInputSchema = z
	.object({
		id: z.string().length(11).describe('11-character playlist ID'),
		item_id: z.number().int().positive().describe('Playlist item ID'),
	})
	.strict();
export type PlaylistsDeleteItemInput = z.infer<
	typeof PlaylistsDeleteItemInputSchema
>;

export const PlaylistsDeleteItemResponseSchema = z.object({
	id: z.number().int(),
	deleted: z.boolean(),
});
export type PlaylistsDeleteItemResponse = z.infer<
	typeof PlaylistsDeleteItemResponseSchema
>;

// Endpoint input & output type maps
export type ListennotesEndpointInputs = {
	'search.search': SearchInput;
	'search.typeahead': TypeaheadInput;
	'search.searchEpisodeTitles': SearchEpisodeTitlesInput;
	'search.trendingSearches': SearchTrendingInput;
	'search.relatedSearches': SearchTermInput;
	'search.spellcheck': SearchTermInput;
	'podcasts.get': PodcastsGetInput;
	'podcasts.getEpisodes': PodcastsGetEpisodesInput;
	'podcasts.getRecommendations': PodcastsGetRecommendationsInput;
	'podcasts.getBest': PodcastsGetBestInput;
	'podcasts.getBatch': PodcastsBatchInput;
	'podcasts.delete': PodcastsDeleteInput;
	'podcasts.submit': PodcastsSubmitInput;
	'podcasts.refreshRss': PodcastsRefreshRssInput;
	'podcasts.getAudience': PodcastsAudienceInput;
	'podcasts.getByDomain': PodcastsByDomainInput;
	'episodes.get': EpisodesGetInput;
	'episodes.getRecommendations': EpisodesGetRecommendationsInput;
	'episodes.getBatch': EpisodesBatchInput;
	'episodes.justListen': EpisodesJustListenInput;
	'genres.list': GenresListInput;
	'regions.list': RegionsListInput;
	'languages.list': LanguagesListInput;
	'curated.list': CuratedListInput;
	'curated.get': CuratedGetInput;
	'playlists.list': PlaylistsListInput;
	'playlists.get': PlaylistsGetInput;
	'playlists.create': PlaylistsCreateInput;
	'playlists.update': PlaylistsUpdateInput;
	'playlists.delete': PlaylistsDeleteInput;
	'playlists.addItem': PlaylistsAddItemInput;
	'playlists.updateItem': PlaylistsUpdateItemInput;
	'playlists.deleteItem': PlaylistsDeleteItemInput;
};

export type ListennotesEndpointOutputs = {
	'search.search': SearchResponse;
	'search.typeahead': TypeaheadResponse;
	'search.searchEpisodeTitles': SearchEpisodeTitlesResponse;
	'search.trendingSearches': SearchTermsResponse;
	'search.relatedSearches': SearchTermsResponse;
	'search.spellcheck': SpellcheckResponse;
	'podcasts.get': PodcastsGetResponse;
	'podcasts.getEpisodes': PodcastsGetEpisodesResponse;
	'podcasts.getRecommendations': PodcastsGetRecommendationsResponse;
	'podcasts.getBest': PodcastsGetBestResponse;
	'podcasts.getBatch': PodcastsBatchResponse;
	'podcasts.delete': PodcastsDeleteResponse;
	'podcasts.submit': PodcastsSubmitResponse;
	'podcasts.refreshRss': PodcastsRefreshRssResponse;
	'podcasts.getAudience': PodcastsAudienceResponse;
	'podcasts.getByDomain': PodcastsByDomainResponse;
	'episodes.get': EpisodesGetResponse;
	'episodes.getRecommendations': EpisodesGetRecommendationsResponse;
	'episodes.getBatch': EpisodesBatchResponse;
	'episodes.justListen': EpisodesJustListenResponse;
	'genres.list': GenresListResponse;
	'regions.list': RegionsListResponse;
	'languages.list': LanguagesListResponse;
	'curated.list': CuratedListResponse;
	'curated.get': CuratedGetResponse;
	'playlists.list': PlaylistsListResponse;
	'playlists.get': PlaylistsGetResponse;
	'playlists.create': PlaylistSummary;
	'playlists.update': PlaylistSummary;
	'playlists.delete': PlaylistsDeleteResponse;
	'playlists.addItem': PlaylistItem;
	'playlists.updateItem': PlaylistItem;
	'playlists.deleteItem': PlaylistsDeleteItemResponse;
};

export const ListennotesEndpointInputSchemas = {
	'search.search': SearchInputSchema,
	'search.typeahead': TypeaheadInputSchema,
	'search.searchEpisodeTitles': SearchEpisodeTitlesInputSchema,
	'search.trendingSearches': SearchTrendingInputSchema,
	'search.relatedSearches': SearchTermInputSchema,
	'search.spellcheck': SearchTermInputSchema,
	'podcasts.get': PodcastsGetInputSchema,
	'podcasts.getEpisodes': PodcastsGetEpisodesInputSchema,
	'podcasts.getRecommendations': PodcastsGetRecommendationsInputSchema,
	'podcasts.getBest': PodcastsGetBestInputSchema,
	'podcasts.getBatch': PodcastsBatchInputSchema,
	'podcasts.delete': PodcastsDeleteInputSchema,
	'podcasts.submit': PodcastsSubmitInputSchema,
	'podcasts.refreshRss': PodcastsRefreshRssInputSchema,
	'podcasts.getAudience': PodcastsAudienceInputSchema,
	'podcasts.getByDomain': PodcastsByDomainInputSchema,
	'episodes.get': EpisodesGetInputSchema,
	'episodes.getRecommendations': EpisodesGetRecommendationsInputSchema,
	'episodes.getBatch': EpisodesBatchInputSchema,
	'episodes.justListen': EpisodesJustListenInputSchema,
	'genres.list': GenresListInputSchema,
	'regions.list': RegionsListInputSchema,
	'languages.list': LanguagesListInputSchema,
	'curated.list': CuratedListInputSchema,
	'curated.get': CuratedGetInputSchema,
	'playlists.list': PlaylistsListInputSchema,
	'playlists.get': PlaylistsGetInputSchema,
	'playlists.create': PlaylistsCreateInputSchema,
	'playlists.update': PlaylistsUpdateInputSchema,
	'playlists.delete': PlaylistsDeleteInputSchema,
	'playlists.addItem': PlaylistsAddItemInputSchema,
	'playlists.updateItem': PlaylistsUpdateItemInputSchema,
	'playlists.deleteItem': PlaylistsDeleteItemInputSchema,
} as const;

export const ListennotesEndpointOutputSchemas = {
	'search.search': SearchResponseSchema,
	'search.typeahead': TypeaheadResponseSchema,
	'search.searchEpisodeTitles': SearchEpisodeTitlesResponseSchema,
	'search.trendingSearches': SearchTermsResponseSchema,
	'search.relatedSearches': SearchTermsResponseSchema,
	'search.spellcheck': SpellcheckResponseSchema,
	'podcasts.get': PodcastsGetResponseSchema,
	'podcasts.getEpisodes': PodcastsGetEpisodesResponseSchema,
	'podcasts.getRecommendations': PodcastsGetRecommendationsResponseSchema,
	'podcasts.getBest': PodcastsGetBestResponseSchema,
	'podcasts.getBatch': PodcastsBatchResponseSchema,
	'podcasts.delete': PodcastsDeleteResponseSchema,
	'podcasts.submit': PodcastsSubmitResponseSchema,
	'podcasts.refreshRss': PodcastsRefreshRssResponseSchema,
	'podcasts.getAudience': PodcastsAudienceResponseSchema,
	'podcasts.getByDomain': PodcastsByDomainResponseSchema,
	'episodes.get': EpisodesGetResponseSchema,
	'episodes.getRecommendations': EpisodesGetRecommendationsResponseSchema,
	'episodes.getBatch': EpisodesBatchResponseSchema,
	'episodes.justListen': EpisodesJustListenResponseSchema,
	'genres.list': GenresListResponseSchema,
	'regions.list': RegionsListResponseSchema,
	'languages.list': LanguagesListResponseSchema,
	'curated.list': CuratedListResponseSchema,
	'curated.get': CuratedGetResponseSchema,
	'playlists.list': PlaylistsListResponseSchema,
	'playlists.get': PlaylistsGetResponseSchema,
	'playlists.create': PlaylistSummarySchema,
	'playlists.update': PlaylistSummarySchema,
	'playlists.delete': PlaylistsDeleteResponseSchema,
	'playlists.addItem': PlaylistItemSchema,
	'playlists.updateItem': PlaylistItemSchema,
	'playlists.deleteItem': PlaylistsDeleteItemResponseSchema,
} as const;
