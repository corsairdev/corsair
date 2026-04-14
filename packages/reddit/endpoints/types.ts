import { z } from 'zod';

// ── Shared Sub-schemas ────────────────────────────────────────────────────────

const TimeFilterSchema = z
	.enum(['hour', 'day', 'week', 'month', 'year', 'all'])
	.optional();

const nullToEmpty = z.union([z.string(), z.null()]).transform((v) => v ?? '');

const nullToDeleted = z
	.union([z.string(), z.null()])
	.transform((v) => v ?? '[deleted]');

const nullableStringOpt = z
	.union([z.string(), z.null()])
	.optional()
	.transform((v) => (v === undefined ? null : v));

/** Reddit `t3` link post payload — coerces occasional nulls from the JSON API. */
export const PostDataSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		title: z.string(),
		selftext: nullToEmpty,
		selftext_html: nullableStringOpt,
		url: z.string(),
		author: nullToDeleted,
		author_fullname: z.string().optional(),
		subreddit: z.string(),
		subreddit_name_prefixed: z.string(),
		subreddit_id: z.string().optional(),
		score: z.number(),
		ups: z.number(),
		downs: z.number(),
		upvote_ratio: z.number(),
		num_comments: z.number(),
		over_18: z.boolean(),
		spoiler: z.boolean(),
		stickied: z.boolean(),
		archived: z.boolean().optional(),
		locked: z.boolean().optional(),
		hide_score: z.boolean().optional(),
		created_utc: z.number(),
		permalink: z.string(),
		thumbnail: z.string(),
		total_awards_received: z.number().optional(),
	})
	.passthrough();

/** Reddit `t1` comment payload. */
export const CommentDataSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		body: z.string(),
		body_html: z.string(),
		author: nullToDeleted,
		author_fullname: z.string().optional(),
		score: z.number(),
		ups: z.number(),
		downs: z.number(),
		depth: z.number().optional(),
		parent_id: z.string(),
		link_id: z.string(),
		created_utc: z.number(),
		controversiality: z.number(),
		gilded: z.number().optional(),
		edited: z.union([z.boolean(), z.number()]),
		score_hidden: z.boolean().optional(),
		collapsed: z.boolean().optional(),
		archived: z.boolean().optional(),
		locked: z.boolean().optional(),
		stickied: z.boolean().optional(),
		permalink: z.string(),
		subreddit: z.string(),
		subreddit_name_prefixed: z.string(),
		over_18: z.boolean().optional(),
	})
	.passthrough();

/** Reddit `t5` subreddit about payload. */
export const SubredditDataSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		display_name: z.string(),
		display_name_prefixed: z.string(),
		title: z.string(),
		description: nullToEmpty,
		description_html: nullableStringOpt,
		public_description: nullToEmpty,
		subscribers: z.number(),
		active_user_count: z.number().nullable().optional(),
		accounts_active: z.number().nullable().optional(),
		over18: z.boolean(),
		quarantine: z.boolean(),
		restrict_posting: z.boolean().optional(),
		restrict_commenting: z.boolean().optional(),
		icon_img: nullToEmpty,
		banner_img: nullToEmpty,
		community_icon: nullToEmpty,
		primary_color: nullToEmpty,
		created_utc: z.number(),
		created: z.number(),
		lang: z.string(),
		allow_discovery: z.boolean().optional(),
		submit_text_label: nullToEmpty.optional(),
		wiki_enabled: z.boolean().optional(),
		subreddit_type: z.string().optional(),
	})
	.passthrough();

/** Reddit `t2` user about payload. */
export const UserDataSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		link_karma: z.number(),
		comment_karma: z.number(),
		total_karma: z.number(),
		is_employee: z.boolean().optional(),
		is_mod: z.boolean().optional(),
		is_gold: z.boolean().optional(),
		created_utc: z.number(),
		has_verified_email: z.boolean(),
		verified: z.boolean().optional(),
		icon_img: nullToEmpty,
		is_suspended: z.boolean().optional(),
		pref_show_snoovatar: z.boolean().optional(),
		accept_followers: z.boolean().optional(),
	})
	.passthrough();

export const ListingChildSchema = z.object({
	kind: z.string(),
	data: z.any(),
});

export const ListingResponseSchema = z.object({
	kind: z.literal('Listing'),
	data: z.object({
		modhash: z.string().nullable().optional(),
		dist: z.number().nullable().optional(),
		after: z.string().nullable(),
		before: z.string().nullable(),
		children: z.array(ListingChildSchema),
	}),
});

// ── Shared Listing Params ─────────────────────────────────────────────────────

const ListingParamsSchema = z.object({
	limit: z.number().min(1).max(100).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	count: z.number().optional(),
});

const TimeFilterListingParamsSchema = ListingParamsSchema.extend({
	t: TimeFilterSchema,
});

// ── Shared Listing Response ───────────────────────────────────────────────────

const PostListingResponseSchema = z
	.object({
		posts: z.array(PostDataSchema),
		after: z.string().nullable(),
		before: z.string().nullable(),
		dist: z.number(),
	})
	.passthrough();

// ── 1. SUBREDDIT ENDPOINTS ───────────────────────────────────────────────────

const GetHotPostsInputSchema = z
	.object({ subreddit: z.string() })
	.merge(ListingParamsSchema);
const GetHotPostsResponseSchema = PostListingResponseSchema;

const GetNewPostsInputSchema = z
	.object({ subreddit: z.string() })
	.merge(ListingParamsSchema);
const GetNewPostsResponseSchema = PostListingResponseSchema;

const GetTopPostsInputSchema = z
	.object({ subreddit: z.string() })
	.merge(TimeFilterListingParamsSchema);
const GetTopPostsResponseSchema = PostListingResponseSchema;

const GetRisingPostsInputSchema = z
	.object({ subreddit: z.string() })
	.merge(ListingParamsSchema);
const GetRisingPostsResponseSchema = PostListingResponseSchema;

const GetControversialPostsInputSchema = z
	.object({ subreddit: z.string() })
	.merge(TimeFilterListingParamsSchema);
const GetControversialPostsResponseSchema = PostListingResponseSchema;

const GetSubredditAboutInputSchema = z.object({
	subreddit: z.string(),
});
const GetSubredditAboutResponseSchema = SubredditDataSchema;

// ── 2. POST & COMMENT ENDPOINTS ─────────────────────────────────────────────

const GetPostCommentsInputSchema = z.object({
	post_id: z.string(),
	limit: z.number().min(1).max(100).optional(),
	depth: z.number().optional(),
	context: z.number().optional(),
	sort: z
		.enum(['confidence', 'top', 'new', 'controversial', 'old', 'random', 'qa'])
		.optional(),
});
const GetPostCommentsResponseSchema = z
	.object({
		post: PostDataSchema,
		comments: z.array(CommentDataSchema),
		after: z.string().nullable(),
		before: z.string().nullable(),
	})
	.passthrough();

const GetByIdInputSchema = z.object({
	names: z.string(),
});
const GetByIdResponseSchema = PostListingResponseSchema;

// ── 3. USER ENDPOINTS ───────────────────────────────────────────────────────

const GetUserAboutInputSchema = z.object({
	username: z.string(),
});
const GetUserAboutResponseSchema = UserDataSchema;

const GetUserSubmittedInputSchema = z
	.object({
		username: z.string(),
		sort: z.enum(['new', 'hot', 'top']).optional(),
	})
	.merge(TimeFilterListingParamsSchema);
const GetUserSubmittedResponseSchema = PostListingResponseSchema;

const GetUserCommentsInputSchema = z
	.object({
		username: z.string(),
		sort: z.enum(['new', 'hot', 'top']).optional(),
	})
	.merge(TimeFilterListingParamsSchema);
const GetUserCommentsResponseSchema = z
	.object({
		comments: z.array(CommentDataSchema),
		after: z.string().nullable(),
		before: z.string().nullable(),
		dist: z.number(),
	})
	.passthrough();

const GetUserOverviewInputSchema = z
	.object({
		username: z.string(),
		sort: z.enum(['new', 'hot', 'top']).optional(),
	})
	.merge(TimeFilterListingParamsSchema);
const GetUserOverviewResponseSchema = z
	.object({
		items: z.array(z.union([PostDataSchema, CommentDataSchema])),
		after: z.string().nullable(),
		before: z.string().nullable(),
		dist: z.number(),
	})
	.passthrough();

// ── 4. SEARCH ENDPOINTS ─────────────────────────────────────────────────────

const SearchGlobalInputSchema = z.object({
	q: z.string(),
	sort: z.enum(['relevance', 'hot', 'top', 'new', 'comments']).optional(),
	t: TimeFilterSchema,
	limit: z.number().min(1).max(100).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	count: z.number().optional(),
	restrict_sr: z.boolean().optional(),
	sr_name: z.string().optional(),
	type: z.enum(['link', 'sr', 'user']).optional(),
});
const SearchGlobalResponseSchema = PostListingResponseSchema;

const SearchSubredditInputSchema = z.object({
	subreddit: z.string(),
	q: z.string(),
	sort: z.enum(['relevance', 'hot', 'top', 'new', 'comments']).optional(),
	t: TimeFilterSchema,
	limit: z.number().min(1).max(100).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	count: z.number().optional(),
});
const SearchSubredditResponseSchema = PostListingResponseSchema;

const SearchSubredditsInputSchema = z.object({
	q: z.string(),
	limit: z.number().min(1).max(100).optional(),
	after: z.string().optional(),
	before: z.string().optional(),
	count: z.number().optional(),
});
const SearchSubredditsResponseSchema = z
	.object({
		subreddits: z.array(SubredditDataSchema),
		after: z.string().nullable(),
		before: z.string().nullable(),
		dist: z.number(),
	})
	.passthrough();

// ── 5. GLOBAL FEEDS ──────────────────────────────────────────────────────────

const GetAllFeedInputSchema = ListingParamsSchema;
const GetAllFeedResponseSchema = PostListingResponseSchema;

const GetPopularFeedInputSchema = ListingParamsSchema;
const GetPopularFeedResponseSchema = PostListingResponseSchema;

// ── 6. LISTING ENDPOINTS ─────────────────────────────────────────────────────

const GetSubredditsPopularInputSchema = ListingParamsSchema;
const GetSubredditsPopularResponseSchema = z
	.object({
		subreddits: z.array(SubredditDataSchema),
		after: z.string().nullable(),
		before: z.string().nullable(),
		dist: z.number(),
	})
	.passthrough();

const GetSubredditsNewInputSchema = ListingParamsSchema;
const GetSubredditsNewResponseSchema = z
	.object({
		subreddits: z.array(SubredditDataSchema),
		after: z.string().nullable(),
		before: z.string().nullable(),
		dist: z.number(),
	})
	.passthrough();

// ── Endpoint I/O Maps ────────────────────────────────────────────────────────

export const RedditEndpointInputSchemas = {
	// Subreddits
	subredditsGetHot: GetHotPostsInputSchema,
	subredditsGetNew: GetNewPostsInputSchema,
	subredditsGetTop: GetTopPostsInputSchema,
	subredditsGetRising: GetRisingPostsInputSchema,
	subredditsGetControversial: GetControversialPostsInputSchema,
	subredditsGetAbout: GetSubredditAboutInputSchema,
	// Posts & Comments
	postsGetComments: GetPostCommentsInputSchema,
	postsGetById: GetByIdInputSchema,
	// Users
	usersGetAbout: GetUserAboutInputSchema,
	usersGetSubmitted: GetUserSubmittedInputSchema,
	usersGetComments: GetUserCommentsInputSchema,
	usersGetOverview: GetUserOverviewInputSchema,
	// Search
	searchGlobal: SearchGlobalInputSchema,
	searchSubreddit: SearchSubredditInputSchema,
	searchSubreddits: SearchSubredditsInputSchema,
	// Feeds
	feedsGetAll: GetAllFeedInputSchema,
	feedsGetPopular: GetPopularFeedInputSchema,
	// Listings
	listingsSubredditsPopular: GetSubredditsPopularInputSchema,
	listingsSubredditsNew: GetSubredditsNewInputSchema,
} as const;

export const RedditEndpointOutputSchemas = {
	// Subreddits
	subredditsGetHot: GetHotPostsResponseSchema,
	subredditsGetNew: GetNewPostsResponseSchema,
	subredditsGetTop: GetTopPostsResponseSchema,
	subredditsGetRising: GetRisingPostsResponseSchema,
	subredditsGetControversial: GetControversialPostsResponseSchema,
	subredditsGetAbout: GetSubredditAboutResponseSchema,
	// Posts & Comments
	postsGetComments: GetPostCommentsResponseSchema,
	postsGetById: GetByIdResponseSchema,
	// Users
	usersGetAbout: GetUserAboutResponseSchema,
	usersGetSubmitted: GetUserSubmittedResponseSchema,
	usersGetComments: GetUserCommentsResponseSchema,
	usersGetOverview: GetUserOverviewResponseSchema,
	// Search
	searchGlobal: SearchGlobalResponseSchema,
	searchSubreddit: SearchSubredditResponseSchema,
	searchSubreddits: SearchSubredditsResponseSchema,
	// Feeds
	feedsGetAll: GetAllFeedResponseSchema,
	feedsGetPopular: GetPopularFeedResponseSchema,
	// Listings
	listingsSubredditsPopular: GetSubredditsPopularResponseSchema,
	listingsSubredditsNew: GetSubredditsNewResponseSchema,
} as const;

// ── Inferred Types ───────────────────────────────────────────────────────────

export type RedditEndpointInputs = {
	[K in keyof typeof RedditEndpointInputSchemas]: z.infer<
		(typeof RedditEndpointInputSchemas)[K]
	>;
};

export type RedditEndpointOutputs = {
	[K in keyof typeof RedditEndpointOutputSchemas]: z.infer<
		(typeof RedditEndpointOutputSchemas)[K]
	>;
};

export type PostData = z.infer<typeof PostDataSchema>;
export type CommentData = z.infer<typeof CommentDataSchema>;
export type SubredditAboutData = z.infer<typeof SubredditDataSchema>;
export type UserAboutData = z.infer<typeof UserDataSchema>;
export type GetHotPostsResponse = z.infer<typeof GetHotPostsResponseSchema>;
export type GetPostCommentsResponse = z.infer<
	typeof GetPostCommentsResponseSchema
>;

export type RedditListingRaw = z.infer<typeof ListingResponseSchema>;
export type RedditEntityEnvelopeRaw = {
	kind: string;
	data: Record<string, any>;
};
