import { z } from 'zod';

// Inputs follow https://api.tikhub.io/openapi.json. Every data endpoint answers
// with the shared ResponseModel envelope; the spec types its `data` as
// `{} | null`, so the payload schemas below come from each operation's
// documented return fields and the platforms' own payloads. They type the
// fields agents use and pass everything else through (`.loose()`), because
// TikHub forwards large upstream objects whose extra keys change often.

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();
// Counts and IDs arrive as numbers on some platforms and strings on others.
const numOrStr = z.union([z.number(), z.string()]).nullish();
// TikTok's app API reports has_more as 0/1; other platforms use booleans.
const flag = z.union([z.boolean(), z.number()]).nullish();
// Pagination cursors are numbers on TikTok and opaque strings elsewhere.
const cursor = z.union([z.number(), z.string()]).nullish();

const Count = z.number().int().min(1);
const Offset = z.number().int().min(0);
const Region = z
	.string()
	.min(2)
	.describe('ISO 3166-1 alpha-2 region code, e.g. US, GB, JP');
const NumericId = z.string().regex(/^\d+$/, 'Expected a numeric ID string');

// Refinement for endpoints that take one of several identifiers.
function requireOneOf<K extends string>(...keys: K[]) {
	return [
		(input: Partial<Record<K, unknown>>) =>
			keys.some((key) => {
				const value = input[key];
				return typeof value === 'string' ? value.length > 0 : value != null;
			}),
		{ message: `Provide ${keys.join(' or ')}` },
	] as const;
}

// ── Envelope ─────────────────────────────────────────────────────────────────

const EnvelopeFields = {
	code: z.number(),
	request_id: str,
	message: z.string().optional(),
	message_zh: z.string().optional(),
	support: z.string().optional(),
	time: z.string().optional(),
	time_stamp: z.number().optional(),
	time_zone: z.string().optional(),
	docs: str,
	cache_message: str,
	cache_message_zh: str,
	cache_url: str,
	router: z.string().optional(),
	// unknown: TikHub echoes the query parameters it received, whatever they were.
	params: z.record(z.string(), z.unknown()).optional(),
};

function envelope<T extends z.ZodType>(data: T) {
	return z
		.object({
			...EnvelopeFields,
			data: data.nullable(),
		})
		.loose();
}

// Payloads TikHub documents no fields for.
const OpenObject = z.object({}).loose();

// ── TikTok (app API objects) ─────────────────────────────────────────────────

const UrlList = z
	.object({
		uri: str,
		url_list: z.array(z.string()).nullish(),
	})
	.loose();

export const TikTokAppUserSchema = z
	.object({
		uid: str,
		sec_uid: str,
		unique_id: str,
		nickname: str,
		signature: str,
		region: str,
		follower_count: num,
		following_count: num,
		total_favorited: numOrStr,
		aweme_count: num,
		avatar_thumb: UrlList.nullish(),
	})
	.loose();

export const TikTokVideoSchema = z
	.object({
		aweme_id: z.string(),
		desc: str,
		create_time: num,
		region: str,
		share_url: str,
		author: TikTokAppUserSchema.nullish(),
		statistics: z
			.object({
				play_count: num,
				digg_count: num,
				comment_count: num,
				share_count: num,
				collect_count: num,
				download_count: num,
			})
			.loose()
			.nullish(),
		video: z
			.object({
				duration: num,
				width: num,
				height: num,
				cover: UrlList.nullish(),
				play_addr: UrlList.nullish(),
				download_addr: UrlList.nullish(),
			})
			.loose()
			.nullish(),
		music: z
			.object({
				id_str: str,
				title: str,
				author: str,
				play_url: UrlList.nullish(),
			})
			.loose()
			.nullish(),
		text_extra: z
			.array(
				z
					.object({
						type: num,
						hashtag_id: str,
						hashtag_name: str,
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

export const TikTokCommentSchema = z
	.object({
		cid: str,
		aweme_id: str,
		text: str,
		create_time: num,
		digg_count: num,
		reply_comment_total: num,
		user: TikTokAppUserSchema.nullish(),
	})
	.loose();

const TikTokAppStatus = {
	status_code: num,
	status_msg: str,
};

// ── TikTok (web API objects) ─────────────────────────────────────────────────

export const TikTokWebUserSchema = z
	.object({
		id: str,
		uniqueId: str,
		secUid: str,
		nickname: str,
		signature: str,
		verified: bool,
		privateAccount: bool,
		createTime: num,
		avatarLarger: str,
		avatarThumb: str,
		language: str,
		bioLink: z.object({ link: str }).loose().nullish(),
	})
	.loose();

export const TikTokWebUserStatsSchema = z
	.object({
		followerCount: num,
		followingCount: num,
		heart: num,
		heartCount: num,
		videoCount: num,
		diggCount: num,
		friendCount: num,
	})
	.loose();

// ── TikTok inputs and outputs ────────────────────────────────────────────────

const TikTokSearchVideosInputSchema = z.object({
	keyword: z.string().min(1).describe('Search keyword'),
	offset: Offset.optional().describe('Result offset for paging (default 0)'),
	count: Count.optional().describe('Results per page (default 20)'),
	sort_type: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe('0 = relevance (default), 1 = most liked'),
	publish_time: z
		.union([
			z.literal(0),
			z.literal(1),
			z.literal(7),
			z.literal(30),
			z.literal(90),
			z.literal(180),
		])
		.optional()
		.describe('Published within N days: 0 (any, default), 1, 7, 30, 90, 180'),
	region: Region.optional(),
});

const TikTokSearchVideosDataSchema = z
	.object({
		...TikTokAppStatus,
		// The spec documents no payload; both keys TikTok's app search uses for
		// video results are typed.
		search_item_list: z
			.array(z.object({ aweme_info: TikTokVideoSchema.nullish() }).loose())
			.nullish(),
		aweme_list: z.array(TikTokVideoSchema).nullish(),
		cursor,
		has_more: flag,
	})
	.loose();

const TikTokGetUserProfileInputSchema = z
	.object({
		uniqueId: z
			.string()
			.optional()
			.describe('Username from the profile URL (preferred), e.g. "tiktok"'),
		secUid: z.string().optional().describe('The user secUid'),
	})
	.refine(...requireOneOf('uniqueId', 'secUid'));

const TikTokUserProfileDataSchema = z
	.object({
		statusCode: num,
		userInfo: z
			.object({
				user: TikTokWebUserSchema.nullish(),
				stats: TikTokWebUserStatsSchema.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const TikTokGetVideoInputSchema = z.object({
	aweme_id: NumericId.describe('Video ID, e.g. 7350810998023949599'),
});

const TikTokVideoDataSchema = z
	.object({
		...TikTokAppStatus,
		aweme_detail: TikTokVideoSchema.nullish(),
		aweme_details: z.array(TikTokVideoSchema).nullish(),
	})
	.loose();

const TikTokGetUserVideosInputSchema = z
	.object({
		sec_user_id: z
			.string()
			.optional()
			.describe('User sec_user_id (faster than unique_id)'),
		unique_id: z
			.string()
			.optional()
			.describe('Username, used when sec_user_id is empty'),
		max_cursor: Offset.optional().describe(
			'0 for the first page, then max_cursor from the previous response',
		),
		count: Count.optional().describe('Videos per page (default 20)'),
		sort_type: z
			.union([z.literal(0), z.literal(1)])
			.optional()
			.describe('0 = latest (default), 1 = popular'),
		region: Region.optional(),
	})
	.refine(...requireOneOf('sec_user_id', 'unique_id'));

const TikTokVideoListDataSchema = z
	.object({
		...TikTokAppStatus,
		aweme_list: z.array(TikTokVideoSchema).nullish(),
		has_more: flag,
		max_cursor: cursor,
		min_cursor: cursor,
		cursor,
	})
	.loose();

const TikTokGetVideoCommentsInputSchema = z.object({
	aweme_id: NumericId.describe('Video ID'),
	cursor: Offset.optional().describe(
		'0 for the first page, then cursor from the previous response',
	),
	count: Count.optional().describe('Comments per page (default 20)'),
});

const TikTokCommentsDataSchema = z
	.object({
		...TikTokAppStatus,
		comments: z.array(TikTokCommentSchema).nullish(),
		cursor,
		has_more: flag,
		total: num,
	})
	.loose();

const TikTokGetHashtagInputSchema = z.object({
	tag_name: z.string().min(1).describe('Hashtag name without #, e.g. "tiktok"'),
});

const TikTokHashtagDataSchema = z
	.object({
		statusCode: num,
		challengeInfo: z
			.object({
				challenge: z
					.object({
						id: str,
						title: str,
						desc: str,
						coverLarger: str,
					})
					.loose()
					.nullish(),
				stats: z
					.object({
						videoCount: num,
						viewCount: num,
					})
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const TikTokGetHashtagVideosInputSchema = z.object({
	ch_id: NumericId.describe(
		'Hashtag ID (challengeInfo.challenge.id from tiktok.getHashtag)',
	),
	cursor: Offset.optional().describe(
		'0 for the first page, then cursor from the previous response',
	),
	count: Count.optional().describe('Videos per page (default 10)'),
	region: Region.optional(),
});

// ── Instagram ────────────────────────────────────────────────────────────────

const CountEdge = z.object({ count: num }).loose();

export const InstagramUserSchema = z
	.object({
		id: str,
		pk: numOrStr,
		username: str,
		full_name: str,
		biography: str,
		external_url: str,
		is_private: bool,
		is_verified: bool,
		is_business_account: bool,
		is_professional_account: bool,
		profile_pic_url: str,
		profile_pic_url_hd: str,
		highlight_reel_count: num,
		bio_links: z.array(z.object({ url: str, title: str }).loose()).nullish(),
		edge_followed_by: CountEdge.nullish(),
		edge_follow: CountEdge.nullish(),
		edge_owner_to_timeline_media: CountEdge.nullish(),
		category_name: str,
	})
	.loose();

// fetch_user_info_by_username nests the profile one level down, as data.user.
const InstagramUserByUsernameDataSchema = z
	.object({
		data: z.object({ user: InstagramUserSchema.nullish() }).loose().nullish(),
		status: str,
	})
	.loose();

const InstagramMiniUserSchema = z
	.object({
		pk: numOrStr,
		id: str,
		username: str,
		full_name: str,
		is_verified: bool,
		profile_pic_url: str,
	})
	.loose();

export const InstagramMediaSchema = z
	.object({
		id: str,
		pk: numOrStr,
		code: str,
		media_type: num,
		product_type: str,
		taken_at: num,
		like_count: num,
		comment_count: num,
		play_count: num,
		view_count: num,
		caption: z.object({ text: str }).loose().nullish(),
		user: InstagramMiniUserSchema.nullish(),
	})
	.loose();

export const InstagramCommentSchema = z
	.object({
		pk: numOrStr,
		id: str,
		text: str,
		created_at: num,
		created_at_utc: num,
		comment_like_count: num,
		child_comment_count: num,
		is_liked_by_media_owner: bool,
		user: InstagramMiniUserSchema.nullish(),
	})
	.loose();

const InstagramUserId = NumericId.describe(
	'Instagram user ID (data.data.user.id from instagram.getUserByUsername)',
);

const InstagramGetUserByUsernameInputSchema = z.object({
	username: z.string().min(1).describe('Instagram username, e.g. "instagram"'),
});

const InstagramGetUserPostsInputSchema = z.object({
	user_id: InstagramUserId,
	count: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Posts per page (default 12, max 50)'),
	max_id: z
		.string()
		.optional()
		.describe(
			'Omit for the first page, then next_max_id from the previous response',
		),
});

const InstagramUserPostsDataSchema = z
	.object({
		items: z.array(InstagramMediaSchema).nullish(),
		more_available: bool,
		next_max_id: str,
		num_results: num,
	})
	.loose();

const InstagramGetUserReelsInputSchema = z.object({
	user_id: InstagramUserId,
	count: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Reels per page (default 12, max 50)'),
	max_id: z
		.string()
		.optional()
		.describe(
			'Omit for the first page, then paging_info.max_id from the previous response',
		),
});

const InstagramUserReelsDataSchema = z
	.object({
		items: z
			.array(z.object({ media: InstagramMediaSchema.nullish() }).loose())
			.nullish(),
		paging_info: z
			.object({
				max_id: str,
				more_available: bool,
			})
			.loose()
			.nullish(),
	})
	.loose();

// fetch_post_by_url returns Instagram's web post object, not the app media
// object the user feeds return: shortcode instead of code, owner instead of
// user, and counts under edge_* fields.
const InstagramWebPostSchema = z
	.object({
		id: str,
		shortcode: str,
		__typename: str,
		is_video: bool,
		taken_at_timestamp: num,
		display_url: str,
		video_url: str,
		video_view_count: num,
		video_play_count: num,
		accessibility_caption: str,
		comments_disabled: bool,
		edge_media_preview_like: CountEdge.nullish(),
		edge_media_to_parent_comment: CountEdge.nullish(),
		edge_media_to_caption: z
			.object({
				edges: z
					.array(z.object({ node: z.object({ text: str }).loose() }).loose())
					.nullish(),
			})
			.loose()
			.nullish(),
		owner: z
			.object({ id: str, username: str, full_name: str, is_verified: bool })
			.loose()
			.nullish(),
	})
	.loose();

const InstagramGetPostByUrlInputSchema = z.object({
	post_url: z
		.url()
		.describe(
			'Post or reel URL, e.g. https://www.instagram.com/p/DPwhVB-jo9k/',
		),
});

const InstagramGetPostCommentsInputSchema = z.object({
	code_or_url: z
		.string()
		.min(1)
		.describe(
			'Post shortcode (code from instagram.getUserPosts) or post URL, e.g. "DPwhVB-jo9k"',
		),
	sort_by: z
		.enum(['recent', 'popular'])
		.optional()
		.describe('recent (default) or popular'),
	pagination_token: z
		.string()
		.optional()
		.describe(
			'Omit for the first page, then pagination_token from the previous response',
		),
});

const InstagramPostCommentsDataSchema = z
	.object({
		data: z
			.object({
				count: num,
				total: num,
				items: z.array(InstagramCommentSchema).nullish(),
				additional_data: z
					.object({ caption: z.object({ text: str }).loose().nullish() })
					.loose()
					.nullish(),
			})
			.loose()
			.nullish(),
		pagination_token: str,
	})
	.loose();

// ── YouTube ──────────────────────────────────────────────────────────────────

const YouTubeGetVideoInputSchema = z
	.object({
		video_id: z.string().optional().describe('Video ID, e.g. dQw4w9WgXcQ'),
		video_url: z
			.url()
			.optional()
			.describe('Full video URL; ignored when video_id is set'),
	})
	.refine(...requireOneOf('video_id', 'video_url'));

// Field list from the endpoint's documented `need_format=true` return fields.
// Counts arrive as strings, and the *_text fields are localized to the
// region TikHub fetches from (e.g. "455万位订阅者").
const YouTubeVideoDataSchema = z
	.object({
		video_id: str,
		video_url: str,
		embed_url: str,
		title: str,
		description: str,
		author: str,
		channel_id: str,
		channel_handle: str,
		channel_url: str,
		subscriber_count_text: str,
		is_verified: bool,
		publish_date: str,
		upload_date: str,
		length_seconds: numOrStr,
		view_count: numOrStr,
		like_count: numOrStr,
		comment_count: numOrStr,
		keywords: z.union([z.array(z.string()), z.string()]).nullish(),
		category: str,
		is_live_content: bool,
		is_private: bool,
		is_unlisted: bool,
		is_family_safe: bool,
		playability_status: str,
		thumbnail_url: str,
		thumbnails: z
			.array(z.object({ url: str, width: num, height: num }).loose())
			.nullish(),
		captions: z
			.array(z.object({ language_code: str, kind: str }).loose())
			.nullish(),
		chapters: z
			.array(z.object({ title: str, time_description: str }).loose())
			.nullish(),
	})
	.loose();

const YouTubeSearchInputSchema = z
	.object({
		keyword: z
			.string()
			.max(200)
			.optional()
			.describe('Search keyword (required for the first page)'),
		continuation_token: z
			.string()
			.optional()
			.describe('continuation_token from the previous response'),
		upload_date: z
			.enum(['last_hour', 'today', 'this_week', 'this_month', 'this_year'])
			.optional(),
		type: z.enum(['video', 'channel', 'playlist', 'movie']).optional(),
		duration: z
			.enum(['short', 'medium', 'long'])
			.optional()
			.describe('short (<4 min), medium (4-20 min), long (>20 min)'),
		features: z
			.string()
			.optional()
			.describe(
				'Comma-separated: live, 4k, hd, subtitles, creative_commons, 360, vr180, 3d, hdr',
			),
		sort_by: z
			.enum(['relevance', 'upload_date', 'view_count', 'rating'])
			.optional(),
	})
	.refine(...requireOneOf('keyword', 'continuation_token'));

const YouTubeSearchVideoSchema = z
	.object({
		video_id: str,
		title: str,
		author: str,
		channel_id: str,
		duration: str,
		view_count: numOrStr,
		published_time: str,
	})
	.loose();

const YouTubeSearchDataSchema = z
	.object({
		videos: z.array(YouTubeSearchVideoSchema).nullish(),
		shorts: z.array(YouTubeSearchVideoSchema).nullish(),
		channels: z.array(OpenObject).nullish(),
		playlists: z.array(OpenObject).nullish(),
		continuation_token: str,
	})
	.loose();

const YouTubeGetChannelVideosInputSchema = z.object({
	channel_id: z
		.string()
		.min(1)
		.describe(
			'Channel ID, usually starting with UC, e.g. UCJHBJ7F-nAIlMGolm0Hu4vg',
		),
	continuation_token: z
		.string()
		.optional()
		.describe('continuation_token from the previous response'),
	language_code: z
		.string()
		.optional()
		.describe('Language, e.g. en-US (default zh-CN)'),
	country_code: z.string().optional().describe('Country, e.g. US (default US)'),
});

const YouTubeChannelVideosDataSchema = z
	.object({
		// Only sent on the first page.
		channel: z
			.object({
				id: str,
				name: str,
				description: str,
				handle_url: str,
				avatar: str,
				url: str,
				rss_url: str,
				keywords: str,
				is_family_safe: bool,
				is_verified: bool,
			})
			.loose()
			.nullish(),
		videos: z
			.array(
				z
					.object({
						video_id: str,
						title: str,
						thumbnail: str,
						duration: str,
						view_count: str,
						published_time: str,
						is_live: bool,
						url: str,
					})
					.loose(),
			)
			.nullish(),
		continuation_token: str,
	})
	.loose();

// ── X (Twitter) ──────────────────────────────────────────────────────────────

const TwitterScreenName = z
	.string()
	.optional()
	.describe('Handle without @, e.g. "elonmusk"');
// X IDs exceed Number.MAX_SAFE_INTEGER, so they travel as strings even though
// the spec types rest_id as an integer.
const TwitterRestId = NumericId.optional().describe(
	'Numeric user ID; wins over screen_name when both are set',
);

const TwitterGetUserProfileInputSchema = z
	.object({
		screen_name: TwitterScreenName,
		rest_id: TwitterRestId,
	})
	.refine(...requireOneOf('screen_name', 'rest_id'));

const TwitterGetUserTweetsInputSchema = z
	.object({
		screen_name: TwitterScreenName,
		rest_id: TwitterRestId,
		cursor: z.string().optional().describe('Cursor from the previous response'),
	})
	.refine(...requireOneOf('screen_name', 'rest_id'));

const TwitterSearchTweetsInputSchema = z.object({
	keyword: z.string().min(1).describe('Search query'),
	search_type: z
		.enum(['Top', 'Latest', 'Media', 'People', 'Lists'])
		.optional()
		.describe('Top (default), Latest, Media, People, or Lists'),
	cursor: z.string().optional().describe('Cursor from the previous response'),
});

const TwitterGetTweetInputSchema = z.object({
	tweet_id: NumericId.describe('Tweet ID from the status URL'),
});

// ── Reddit ───────────────────────────────────────────────────────────────────

const RedditSearchInputSchema = z.object({
	query: z
		.string()
		.min(1)
		.max(512)
		.describe('Keywords; supports AND, OR, NOT, grouping and quoted phrases'),
	search_type: z
		.enum(['post', 'community', 'comment', 'media', 'people'])
		.optional()
		.describe('post (default), community, comment, media, or people'),
	sort: z
		.enum(['RELEVANCE', 'HOT', 'TOP', 'NEW', 'COMMENTS'])
		.optional()
		.describe('For post, comment and media searches; COMMENTS is post-only'),
	time_range: z
		.enum(['all', 'year', 'month', 'week', 'day', 'hour'])
		.optional()
		.describe('For post and media searches'),
	safe_search: z.enum(['unset', 'strict']).optional(),
	allow_nsfw: z.enum(['0', '1']).optional(),
	after: z
		.string()
		.max(4096)
		.optional()
		.describe('pageInfo.endCursor from the previous response'),
	need_format: z
		.boolean()
		.optional()
		.describe(
			'Defaults to true here: compact children + pageInfo. Pass false for the raw nested payload',
		),
	language: z
		.string()
		.regex(/^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/)
		.optional()
		.describe('IETF language tag (default en-US)'),
});

const RedditSearchDataSchema = z
	.object({
		children: z.array(OpenObject).nullish(),
		pageInfo: z
			.object({
				endCursor: str,
				startCursor: str,
				hasNextPage: bool,
				hasPreviousPage: bool,
			})
			.loose()
			.nullish(),
	})
	.loose();

// ── Account ──────────────────────────────────────────────────────────────────

const AccountGetInfoInputSchema = z.object({});

// This endpoint does not use the shared envelope (UserInfoResponseModel).
const AccountGetInfoResponseSchema = z
	.object({
		code: z.number(),
		router: z.string().optional(),
		api_key_data: z
			.object({
				api_key_name: z.string(),
				api_key_scopes: z.array(z.string()),
				created_at: z.string(),
				expires_at: z.string().nullable(),
				api_key_status: z.number(),
			})
			.loose(),
		user_data: z
			.object({
				email: z.string(),
				balance: z.number().describe('Paid balance in USD'),
				free_credit: z.number().describe('Free credit in USD'),
				email_verified: z.boolean(),
				account_disabled: z.boolean(),
				is_active: z.boolean(),
			})
			.loose(),
	})
	.loose();

// ── Registry ─────────────────────────────────────────────────────────────────

export const TikHubEndpointInputSchemas = {
	tiktokSearchVideos: TikTokSearchVideosInputSchema,
	tiktokGetUserProfile: TikTokGetUserProfileInputSchema,
	tiktokGetVideo: TikTokGetVideoInputSchema,
	tiktokGetUserVideos: TikTokGetUserVideosInputSchema,
	tiktokGetVideoComments: TikTokGetVideoCommentsInputSchema,
	tiktokGetHashtag: TikTokGetHashtagInputSchema,
	tiktokGetHashtagVideos: TikTokGetHashtagVideosInputSchema,
	instagramGetUserByUsername: InstagramGetUserByUsernameInputSchema,
	instagramGetUserPosts: InstagramGetUserPostsInputSchema,
	instagramGetUserReels: InstagramGetUserReelsInputSchema,
	instagramGetPostByUrl: InstagramGetPostByUrlInputSchema,
	instagramGetPostComments: InstagramGetPostCommentsInputSchema,
	youtubeGetVideo: YouTubeGetVideoInputSchema,
	youtubeSearch: YouTubeSearchInputSchema,
	youtubeGetChannelVideos: YouTubeGetChannelVideosInputSchema,
	twitterGetUserProfile: TwitterGetUserProfileInputSchema,
	twitterGetUserTweets: TwitterGetUserTweetsInputSchema,
	twitterSearchTweets: TwitterSearchTweetsInputSchema,
	twitterGetTweet: TwitterGetTweetInputSchema,
	redditSearch: RedditSearchInputSchema,
	accountGetInfo: AccountGetInfoInputSchema,
} as const;

export const TikHubEndpointOutputSchemas = {
	tiktokSearchVideos: envelope(TikTokSearchVideosDataSchema),
	tiktokGetUserProfile: envelope(TikTokUserProfileDataSchema),
	tiktokGetVideo: envelope(TikTokVideoDataSchema),
	tiktokGetUserVideos: envelope(TikTokVideoListDataSchema),
	tiktokGetVideoComments: envelope(TikTokCommentsDataSchema),
	tiktokGetHashtag: envelope(TikTokHashtagDataSchema),
	tiktokGetHashtagVideos: envelope(TikTokVideoListDataSchema),
	instagramGetUserByUsername: envelope(InstagramUserByUsernameDataSchema),
	instagramGetUserPosts: envelope(InstagramUserPostsDataSchema),
	instagramGetUserReels: envelope(InstagramUserReelsDataSchema),
	instagramGetPostByUrl: envelope(InstagramWebPostSchema),
	instagramGetPostComments: envelope(InstagramPostCommentsDataSchema),
	youtubeGetVideo: envelope(YouTubeVideoDataSchema),
	youtubeSearch: envelope(YouTubeSearchDataSchema),
	youtubeGetChannelVideos: envelope(YouTubeChannelVideosDataSchema),
	// The X endpoints document no response fields.
	twitterGetUserProfile: envelope(OpenObject),
	twitterGetUserTweets: envelope(OpenObject),
	twitterSearchTweets: envelope(OpenObject),
	twitterGetTweet: envelope(OpenObject),
	redditSearch: envelope(RedditSearchDataSchema),
	accountGetInfo: AccountGetInfoResponseSchema,
} as const;

type Inputs = typeof TikHubEndpointInputSchemas;
type Outputs = typeof TikHubEndpointOutputSchemas;

export type TikHubEndpointInputs = {
	[K in keyof Inputs]: z.input<Inputs[K]>;
};

export type TikHubEndpointOutputs = {
	[K in keyof Outputs]: z.infer<Outputs[K]>;
};

export type TikHubOperation = keyof Inputs;

export type TikTokSearchVideosInput =
	TikHubEndpointInputs['tiktokSearchVideos'];
export type TikTokSearchVideosResponse =
	TikHubEndpointOutputs['tiktokSearchVideos'];
export type TikTokGetUserProfileInput =
	TikHubEndpointInputs['tiktokGetUserProfile'];
export type TikTokGetUserProfileResponse =
	TikHubEndpointOutputs['tiktokGetUserProfile'];
export type TikTokGetVideoInput = TikHubEndpointInputs['tiktokGetVideo'];
export type TikTokGetVideoResponse = TikHubEndpointOutputs['tiktokGetVideo'];
export type TikTokGetUserVideosInput =
	TikHubEndpointInputs['tiktokGetUserVideos'];
export type TikTokGetUserVideosResponse =
	TikHubEndpointOutputs['tiktokGetUserVideos'];
export type TikTokGetVideoCommentsInput =
	TikHubEndpointInputs['tiktokGetVideoComments'];
export type TikTokGetVideoCommentsResponse =
	TikHubEndpointOutputs['tiktokGetVideoComments'];
export type TikTokGetHashtagInput = TikHubEndpointInputs['tiktokGetHashtag'];
export type TikTokGetHashtagResponse =
	TikHubEndpointOutputs['tiktokGetHashtag'];
export type TikTokGetHashtagVideosInput =
	TikHubEndpointInputs['tiktokGetHashtagVideos'];
export type TikTokGetHashtagVideosResponse =
	TikHubEndpointOutputs['tiktokGetHashtagVideos'];
export type InstagramGetUserByUsernameInput =
	TikHubEndpointInputs['instagramGetUserByUsername'];
export type InstagramGetUserByUsernameResponse =
	TikHubEndpointOutputs['instagramGetUserByUsername'];
export type InstagramGetUserPostsInput =
	TikHubEndpointInputs['instagramGetUserPosts'];
export type InstagramGetUserPostsResponse =
	TikHubEndpointOutputs['instagramGetUserPosts'];
export type InstagramGetUserReelsInput =
	TikHubEndpointInputs['instagramGetUserReels'];
export type InstagramGetUserReelsResponse =
	TikHubEndpointOutputs['instagramGetUserReels'];
export type InstagramGetPostByUrlInput =
	TikHubEndpointInputs['instagramGetPostByUrl'];
export type InstagramGetPostByUrlResponse =
	TikHubEndpointOutputs['instagramGetPostByUrl'];
export type InstagramGetPostCommentsInput =
	TikHubEndpointInputs['instagramGetPostComments'];
export type InstagramGetPostCommentsResponse =
	TikHubEndpointOutputs['instagramGetPostComments'];
export type YouTubeGetVideoInput = TikHubEndpointInputs['youtubeGetVideo'];
export type YouTubeGetVideoResponse = TikHubEndpointOutputs['youtubeGetVideo'];
export type YouTubeSearchInput = TikHubEndpointInputs['youtubeSearch'];
export type YouTubeSearchResponse = TikHubEndpointOutputs['youtubeSearch'];
export type YouTubeGetChannelVideosInput =
	TikHubEndpointInputs['youtubeGetChannelVideos'];
export type YouTubeGetChannelVideosResponse =
	TikHubEndpointOutputs['youtubeGetChannelVideos'];
export type TwitterGetUserProfileInput =
	TikHubEndpointInputs['twitterGetUserProfile'];
export type TwitterGetUserProfileResponse =
	TikHubEndpointOutputs['twitterGetUserProfile'];
export type TwitterGetUserTweetsInput =
	TikHubEndpointInputs['twitterGetUserTweets'];
export type TwitterGetUserTweetsResponse =
	TikHubEndpointOutputs['twitterGetUserTweets'];
export type TwitterSearchTweetsInput =
	TikHubEndpointInputs['twitterSearchTweets'];
export type TwitterSearchTweetsResponse =
	TikHubEndpointOutputs['twitterSearchTweets'];
export type TwitterGetTweetInput = TikHubEndpointInputs['twitterGetTweet'];
export type TwitterGetTweetResponse = TikHubEndpointOutputs['twitterGetTweet'];
export type RedditSearchInput = TikHubEndpointInputs['redditSearch'];
export type RedditSearchResponse = TikHubEndpointOutputs['redditSearch'];
export type AccountGetInfoInput = TikHubEndpointInputs['accountGetInfo'];
export type AccountGetInfoResponse = TikHubEndpointOutputs['accountGetInfo'];

export type TikTokVideo = z.infer<typeof TikTokVideoSchema>;
export type TikTokAppUser = z.infer<typeof TikTokAppUserSchema>;
export type TikTokComment = z.infer<typeof TikTokCommentSchema>;
export type TikTokWebUser = z.infer<typeof TikTokWebUserSchema>;
export type InstagramUser = z.infer<typeof InstagramUserSchema>;
export type InstagramMedia = z.infer<typeof InstagramMediaSchema>;
export type InstagramComment = z.infer<typeof InstagramCommentSchema>;
