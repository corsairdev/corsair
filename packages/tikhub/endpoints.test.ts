import { logEventFromContext } from 'corsair/core';
import { TikHubAPIError } from './client';
import {
	Account,
	Instagram,
	Reddit,
	TikTok,
	Twitter,
	YouTube,
} from './endpoints';
import type {
	TikHubEndpointInputs,
	TikHubEndpointOutputs,
	TikHubOperation,
} from './endpoints/types';
import {
	envelope,
	instagramComment,
	instagramMedia,
	instagramUser,
	instagramWebPost,
	tiktokAuthor,
	tiktokComment,
	tiktokVideo,
	youtubeVideo,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'th-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url: new URL(url), init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

type Case<K extends TikHubOperation> = {
	key: K;
	operation: string;
	// never ctx: the fake context below carries only the key.
	endpoint: (
		ctx: never,
		input: TikHubEndpointInputs[K],
	) => Promise<TikHubEndpointOutputs[K]>;
	input: TikHubEndpointInputs[K];
	path: string;
	query: Record<string, string>;
	// unknown: each operation has its own payload shape.
	data: unknown;
	check: (result: TikHubEndpointOutputs[K]) => void;
};

type Row = {
	operation: string;
	path: string;
	query: Record<string, string>;
	// unknown: each operation has its own payload shape.
	data: unknown;
	call: () => Promise<TikHubEndpointOutputs[TikHubOperation]>;
	callAndCheck: () => Promise<TikHubEndpointOutputs[TikHubOperation]>;
};

// The calls are built here, where the endpoint, its input and its check all
// share one operation's types, so the table never widens a check.
function defineCase<K extends TikHubOperation>(c: Case<K>): Row {
	// The fake context only carries what the endpoints read (ctx.key).
	const call = () => c.endpoint({ key: API_KEY } as never, c.input);
	return {
		operation: c.operation,
		path: c.path,
		query: c.query,
		data: c.data,
		call,
		callAndCheck: async () => {
			const result = await call();
			c.check(result);
			return result;
		},
	};
}

const cases = [
	defineCase({
		key: 'tiktokSearchVideos',
		operation: 'tiktok.searchVideos',
		endpoint: TikTok.searchVideos,
		input: {
			keyword: 'open source ai agents',
			offset: 20,
			count: 10,
			sort_type: 1,
			publish_time: 7,
			region: 'GB',
		},
		path: '/api/v1/tiktok/app/v3/fetch_video_search_result',
		query: {
			keyword: 'open source ai agents',
			offset: '20',
			count: '10',
			sort_type: '1',
			publish_time: '7',
			region: 'GB',
		},
		data: {
			status_code: 0,
			search_item_list: [{ aweme_info: tiktokVideo }],
			cursor: 30,
			has_more: 1,
			extra: { now: 1793019366000 },
		},
		check: (result) => {
			const video = result.data?.search_item_list?.[0]?.aweme_info;
			expect(video?.aweme_id).toBe('7350810998023949599');
			expect(video?.statistics?.play_count).toBe(12890331);
			expect(video?.author?.unique_id).toBe('tiktok');
			expect(result.data?.cursor).toBe(30);
			expect(result.data?.has_more).toBe(1);
			// Untyped upstream keys pass through.
			expect(result.data?.extra).toEqual({ now: 1793019366000 });
			expect(video?.is_ads).toBe(false);
		},
	}),
	defineCase({
		key: 'tiktokGetUserProfile',
		operation: 'tiktok.getUserProfile',
		endpoint: TikTok.getUserProfile,
		input: { uniqueId: 'tiktok' },
		path: '/api/v1/tiktok/web/fetch_user_profile',
		query: { uniqueId: 'tiktok' },
		data: {
			statusCode: 0,
			userInfo: {
				user: {
					id: '107955',
					uniqueId: 'tiktok',
					nickname: 'TikTok',
					signature: 'Your next discovery is waiting on TikTok.',
					verified: true,
					secUid: 'MS4wLjABAAAAv7iSuuXDJGDvJkmH_vz1qkDZYo1apxgzaxdBSeIuPiM',
					privateAccount: false,
					createTime: 1425144149,
					bioLink: { link: 'tiktok.com/discovermore', risk: 0 },
					language: 'en',
				},
				stats: {
					followerCount: 96400000,
					followingCount: 1,
					heart: 466100000,
					heartCount: 466100000,
					videoCount: 1513,
					diggCount: 0,
					friendCount: 1,
				},
				statsV2: { followerCount: '96437075' },
			},
		},
		check: (result) => {
			expect(result.data?.userInfo?.user?.uniqueId).toBe('tiktok');
			expect(result.data?.userInfo?.user?.bioLink?.link).toBe(
				'tiktok.com/discovermore',
			);
			expect(result.data?.userInfo?.stats?.followerCount).toBe(96400000);
			expect(result.data?.userInfo?.statsV2).toEqual({
				followerCount: '96437075',
			});
		},
	}),
	defineCase({
		key: 'tiktokGetVideo',
		operation: 'tiktok.getVideo',
		endpoint: TikTok.getVideo,
		input: { aweme_id: '7350810998023949599' },
		path: '/api/v1/tiktok/app/v3/fetch_one_video',
		query: { aweme_id: '7350810998023949599' },
		data: { status_code: 0, aweme_details: [tiktokVideo] },
		check: (result) => {
			const video = result.data?.aweme_details?.[0];
			expect(video?.desc).toContain('#tiktok');
			expect(video?.video?.duration).toBe(15069);
			expect(video?.music?.title).toBe('original sound - tiktok');
			expect(video?.text_extra?.[0]?.hashtag_name).toBe('tiktok');
		},
	}),
	defineCase({
		key: 'tiktokGetUserVideos',
		operation: 'tiktok.getUserVideos',
		endpoint: TikTok.getUserVideos,
		input: {
			sec_user_id: tiktokAuthor.sec_uid,
			max_cursor: 1711497600000,
			count: 20,
			sort_type: 0,
			region: 'US',
		},
		path: '/api/v1/tiktok/app/v3/fetch_user_post_videos',
		query: {
			sec_user_id: tiktokAuthor.sec_uid,
			max_cursor: '1711497600000',
			count: '20',
			sort_type: '0',
			region: 'US',
		},
		data: {
			status_code: 0,
			aweme_list: [tiktokVideo],
			has_more: 1,
			max_cursor: 1709251200000,
			min_cursor: 1711497600000,
		},
		check: (result) => {
			expect(result.data?.aweme_list).toHaveLength(1);
			expect(result.data?.max_cursor).toBe(1709251200000);
			expect(result.data?.has_more).toBe(1);
		},
	}),
	defineCase({
		key: 'tiktokGetVideoComments',
		operation: 'tiktok.getVideoComments',
		endpoint: TikTok.getVideoComments,
		input: { aweme_id: '7326156045968067873', cursor: 20, count: 20 },
		path: '/api/v1/tiktok/app/v3/fetch_video_comments',
		query: { aweme_id: '7326156045968067873', cursor: '20', count: '20' },
		data: {
			status_code: 0,
			comments: [tiktokComment],
			cursor: 40,
			has_more: 1,
			total: 18233,
		},
		check: (result) => {
			const comment = result.data?.comments?.[0];
			expect(comment?.text).toBe('This is the best one yet');
			expect(comment?.reply_comment_total).toBe(14);
			expect(comment?.user?.unique_id).toBe('creator.fan');
			expect(result.data?.total).toBe(18233);
			expect(result.data?.cursor).toBe(40);
		},
	}),
	defineCase({
		key: 'tiktokGetHashtag',
		operation: 'tiktok.getHashtag',
		endpoint: TikTok.getHashtag,
		input: { tag_name: 'tiktok' },
		path: '/api/v1/tiktok/web/fetch_tag_detail',
		query: { tag_name: 'tiktok' },
		data: {
			statusCode: 0,
			challengeInfo: {
				challenge: {
					id: '7551',
					title: 'tiktok',
					desc: 'The home of #tiktok',
					coverLarger: '',
					isCommerce: false,
				},
				stats: { videoCount: 120000000, viewCount: 9100000000000 },
			},
		},
		check: (result) => {
			expect(result.data?.challengeInfo?.challenge?.id).toBe('7551');
			expect(result.data?.challengeInfo?.stats?.videoCount).toBe(120000000);
		},
	}),
	defineCase({
		key: 'tiktokGetHashtagVideos',
		operation: 'tiktok.getHashtagVideos',
		endpoint: TikTok.getHashtagVideos,
		input: { ch_id: '7551', cursor: 0, count: 10, region: 'US' },
		path: '/api/v1/tiktok/app/v3/fetch_hashtag_video_list',
		query: { ch_id: '7551', cursor: '0', count: '10', region: 'US' },
		data: {
			status_code: 0,
			aweme_list: [tiktokVideo],
			cursor: 10,
			has_more: 1,
		},
		check: (result) => {
			expect(result.data?.aweme_list?.[0]?.aweme_id).toBe(
				'7350810998023949599',
			);
			expect(result.data?.cursor).toBe(10);
		},
	}),
	defineCase({
		key: 'instagramGetUserByUsername',
		operation: 'instagram.getUserByUsername',
		endpoint: Instagram.getUserByUsername,
		input: { username: 'instagram' },
		path: '/api/v1/instagram/v1/fetch_user_info_by_username',
		query: { username: 'instagram' },
		data: { data: { user: instagramUser }, status: 'ok' },
		check: (result) => {
			const user = result.data?.data?.user;
			expect(user?.id).toBe('25025320');
			expect(user?.edge_followed_by?.count).toBe(697000000);
			expect(user?.bio_links?.[0]?.url).toBe('https://about.instagram.com');
			expect(user?.is_verified).toBe(true);
			expect(user?.category_name).toBe('Digital creator');
			expect(result.data?.status).toBe('ok');
		},
	}),
	defineCase({
		key: 'instagramGetUserPosts',
		operation: 'instagram.getUserPosts',
		endpoint: Instagram.getUserPosts,
		input: { user_id: '25025320', count: 12, max_id: 'QVFDbmV4dA==' },
		path: '/api/v1/instagram/v1/fetch_user_posts',
		query: { user_id: '25025320', count: '12', max_id: 'QVFDbmV4dA==' },
		data: {
			items: [instagramMedia],
			more_available: true,
			next_max_id: 'QVFEbmV4dDI=',
			num_results: 12,
			status: 'ok',
		},
		check: (result) => {
			expect(result.data?.items?.[0]?.code).toBe('DPwhVB-jo9k');
			expect(result.data?.items?.[0]?.caption?.text).toContain('New features');
			expect(result.data?.next_max_id).toBe('QVFEbmV4dDI=');
			expect(result.data?.more_available).toBe(true);
		},
	}),
	defineCase({
		key: 'instagramGetUserReels',
		operation: 'instagram.getUserReels',
		endpoint: Instagram.getUserReels,
		input: { user_id: '25025320' },
		path: '/api/v1/instagram/v1/fetch_user_reels',
		query: { user_id: '25025320' },
		data: {
			items: [{ media: instagramMedia }],
			paging_info: { max_id: 'QVFEcmVlbA==', more_available: true },
		},
		check: (result) => {
			expect(result.data?.items?.[0]?.media?.play_count).toBe(10233412);
			expect(result.data?.paging_info?.max_id).toBe('QVFEcmVlbA==');
		},
	}),
	defineCase({
		key: 'instagramGetPostByUrl',
		operation: 'instagram.getPostByUrl',
		endpoint: Instagram.getPostByUrl,
		input: { post_url: 'https://www.instagram.com/p/DPwhVB-jo9k/' },
		path: '/api/v1/instagram/v1/fetch_post_by_url',
		query: { post_url: 'https://www.instagram.com/p/DPwhVB-jo9k/' },
		data: instagramWebPost,
		check: (result) => {
			expect(result.data?.shortcode).toBe('De2bNIWSZdB');
			expect(result.data?.edge_media_preview_like?.count).toBe(355135);
			expect(result.data?.edge_media_to_parent_comment?.count).toBe(16056);
			expect(result.data?.owner?.username).toBe('instagram');
			expect(
				result.data?.edge_media_to_caption?.edges?.[0]?.node.text,
			).toContain('paper art');
		},
	}),
	defineCase({
		key: 'instagramGetPostComments',
		operation: 'instagram.getPostComments',
		endpoint: Instagram.getPostComments,
		input: {
			code_or_url: 'DPwhVB-jo9k',
			sort_by: 'popular',
			pagination_token: 'DU1eBAgTPhtefUVDVgpdE1UeVh9H',
		},
		path: '/api/v1/instagram/v2/fetch_post_comments',
		query: {
			code_or_url: 'DPwhVB-jo9k',
			sort_by: 'popular',
			pagination_token: 'DU1eBAgTPhtefUVDVgpdE1UeVh9H',
		},
		data: {
			data: {
				count: 1,
				total: 5120,
				items: [{ ...instagramComment, id: '17884446951626383' }],
				additional_data: { caption: { text: 'New features, who dis 👀' } },
			},
			pagination_token: 'DU1eBAgTPhtefUVDVgpdE1UeVh9HQFUf',
		},
		check: (result) => {
			const comment = result.data?.data?.items?.[0];
			expect(comment?.id).toBe('17884446951626383');
			expect(comment?.comment_like_count).toBe(1520);
			expect(comment?.user?.username).toBe('early.adopter');
			expect(result.data?.data?.total).toBe(5120);
			expect(result.data?.pagination_token).toBe(
				'DU1eBAgTPhtefUVDVgpdE1UeVh9HQFUf',
			);
		},
	}),
	defineCase({
		key: 'youtubeGetVideo',
		operation: 'youtube.getVideo',
		endpoint: YouTube.getVideo,
		input: { video_id: 'dQw4w9WgXcQ' },
		path: '/api/v1/youtube/web_v2/get_video_info_v2',
		query: { video_id: 'dQw4w9WgXcQ' },
		data: youtubeVideo,
		check: (result) => {
			expect(result.data?.title).toContain('Never Gonna Give You Up');
			expect(result.data?.view_count).toBe('1830731742');
			expect(result.data?.is_verified).toBe(true);
			expect(result.data?.category).toBe('Music');
			expect(result.data?.keywords).toEqual([
				'rick astley',
				'Never Gonna Give You Up',
			]);
			expect(result.data?.chapters).toBeNull();
		},
	}),
	defineCase({
		key: 'youtubeSearch',
		operation: 'youtube.search',
		endpoint: YouTube.search,
		input: {
			keyword: 'python tutorial',
			upload_date: 'this_week',
			type: 'video',
			duration: 'long',
			features: 'hd,subtitles',
			sort_by: 'view_count',
		},
		path: '/api/v1/youtube/web_v2/get_general_search_v2',
		query: {
			keyword: 'python tutorial',
			upload_date: 'this_week',
			type: 'video',
			duration: 'long',
			features: 'hd,subtitles',
			sort_by: 'view_count',
		},
		data: {
			videos: [
				{
					video_id: 'rfscVS0vtbw',
					title: 'Learn Python - Full Course for Beginners',
					author: 'freeCodeCamp.org',
					channel_id: 'UC8butISFwT-Wl7EV0hUK0BQ',
					duration: '4:26:52',
					view_count: '47,000,000 views',
					published_time: '6 years ago',
				},
			],
			shorts: [],
			channels: [],
			playlists: [],
			continuation_token: 'EqcDEg9weXRob24gdHV0b3JpYWw',
			completion_suggestions: ['python tutorial for beginners'],
		},
		check: (result) => {
			expect(result.data?.videos?.[0]?.video_id).toBe('rfscVS0vtbw');
			expect(result.data?.videos?.[0]?.view_count).toBe('47,000,000 views');
			expect(result.data?.continuation_token).toBe(
				'EqcDEg9weXRob24gdHV0b3JpYWw',
			);
			expect(result.data?.completion_suggestions).toEqual([
				'python tutorial for beginners',
			]);
		},
	}),
	defineCase({
		key: 'youtubeGetChannelVideos',
		operation: 'youtube.getChannelVideos',
		endpoint: YouTube.getChannelVideos,
		input: {
			channel_id: 'UCJHBJ7F-nAIlMGolm0Hu4vg',
			language_code: 'en-US',
			country_code: 'US',
		},
		path: '/api/v1/youtube/web_v2/get_channel_videos',
		query: {
			channel_id: 'UCJHBJ7F-nAIlMGolm0Hu4vg',
			language_code: 'en-US',
			country_code: 'US',
		},
		data: {
			channel: {
				id: 'UCJHBJ7F-nAIlMGolm0Hu4vg',
				name: 'Maizen',
				description: 'Thank you very much for watching our videos...',
				handle_url: 'http://www.youtube.com/@maizenofficial',
				avatar: 'https://yt3.googleusercontent.com/avatar=s900',
				url: 'https://www.youtube.com/channel/UCJHBJ7F-nAIlMGolm0Hu4vg',
				rss_url:
					'https://www.youtube.com/feeds/videos.xml?channel_id=UCJHBJ7F-nAIlMGolm0Hu4vg',
				keywords: 'Minecraft',
				is_family_safe: true,
				is_verified: true,
			},
			videos: [
				{
					video_id: 'zd3yCa1bJCM',
					title: 'Minecraft: DREAM! - Asleep Custom Map',
					thumbnail: 'https://i.ytimg.com/vi/zd3yCa1bJCM/hqdefault.jpg',
					duration: '16:57',
					view_count: '343,369 views',
					published_time: '18 hours ago',
					description: '',
					is_live: false,
					is_verified: true,
					url: 'https://www.youtube.com/watch?v=zd3yCa1bJCM',
				},
			],
			continuation_token: '4qmFsgKrCBIYVUNK',
		},
		check: (result) => {
			expect(result.data?.channel?.name).toBe('Maizen');
			expect(result.data?.videos?.[0]?.view_count).toBe('343,369 views');
			expect(result.data?.continuation_token).toBe('4qmFsgKrCBIYVUNK');
		},
	}),
	defineCase({
		key: 'twitterGetUserProfile',
		operation: 'twitter.getUserProfile',
		endpoint: Twitter.getUserProfile,
		input: { screen_name: 'elonmusk' },
		path: '/api/v1/twitter/web/fetch_user_profile',
		query: { screen_name: 'elonmusk' },
		data: { rest_id: '44196397', profile: 'elonmusk', name: 'Elon Musk' },
		check: (result) => {
			expect(result.data).toEqual({
				rest_id: '44196397',
				profile: 'elonmusk',
				name: 'Elon Musk',
			});
		},
	}),
	defineCase({
		key: 'twitterGetUserTweets',
		operation: 'twitter.getUserTweets',
		endpoint: Twitter.getUserTweets,
		input: { rest_id: '44196397', cursor: 'DAABCgABGc' },
		path: '/api/v1/twitter/web/fetch_user_post_tweet',
		query: { rest_id: '44196397', cursor: 'DAABCgABGc' },
		data: {
			timeline: [{ tweet_id: '1808168603721650364', text: 'hello' }],
			next_cursor: 'DAABCgABGd',
		},
		check: (result) => {
			expect(result.data?.timeline).toEqual([
				{ tweet_id: '1808168603721650364', text: 'hello' },
			]);
			expect(result.data?.next_cursor).toBe('DAABCgABGd');
		},
	}),
	defineCase({
		key: 'twitterSearchTweets',
		operation: 'twitter.searchTweets',
		endpoint: Twitter.searchTweets,
		input: { keyword: 'corsair', search_type: 'Latest' },
		path: '/api/v1/twitter/web/fetch_search_timeline',
		query: { keyword: 'corsair', search_type: 'Latest' },
		data: { timeline: [], next_cursor: 'DAADDAAB' },
		check: (result) => {
			expect(result.data?.timeline).toEqual([]);
			expect(result.data?.next_cursor).toBe('DAADDAAB');
		},
	}),
	defineCase({
		key: 'twitterGetTweet',
		operation: 'twitter.getTweet',
		endpoint: Twitter.getTweet,
		input: { tweet_id: '1808168603721650364' },
		path: '/api/v1/twitter/web/fetch_tweet_detail',
		query: { tweet_id: '1808168603721650364' },
		data: { id: '1808168603721650364', likes: 120000 },
		check: (result) => {
			expect(result.data?.likes).toBe(120000);
		},
	}),
	defineCase({
		key: 'redditSearch',
		operation: 'reddit.search',
		endpoint: Reddit.search,
		input: {
			query: 'model context protocol',
			search_type: 'post',
			sort: 'TOP',
			time_range: 'week',
			safe_search: 'strict',
			allow_nsfw: '0',
			after: 'dDJfMWFiYzEyMw==',
			language: 'en-GB',
		},
		path: '/api/v1/reddit/app/fetch_dynamic_search',
		query: {
			query: 'model context protocol',
			search_type: 'post',
			sort: 'TOP',
			time_range: 'week',
			safe_search: 'strict',
			allow_nsfw: '0',
			after: 'dDJfMWFiYzEyMw==',
			language: 'en-GB',
			need_format: 'true',
		},
		data: {
			children: [
				{
					id: 't3_1abc123',
					title: 'MCP servers I actually use',
					subreddit: { name: 'LocalLLaMA' },
					score: 812,
				},
			],
			pageInfo: {
				endCursor: 'dDJfMWFiYzEyNA==',
				startCursor: null,
				hasNextPage: true,
				hasPreviousPage: false,
			},
		},
		check: (result) => {
			expect(result.data?.children?.[0]?.title).toBe(
				'MCP servers I actually use',
			);
			expect(result.data?.pageInfo?.endCursor).toBe('dDJfMWFiYzEyNA==');
			expect(result.data?.pageInfo?.hasNextPage).toBe(true);
		},
	}),
];

describe('TikHub endpoints', () => {
	it('covers every endpoint the plugin exposes', () => {
		const exposed = [
			...Object.keys(TikTok).map((k) => `tiktok.${k}`),
			...Object.keys(Instagram).map((k) => `instagram.${k}`),
			...Object.keys(YouTube).map((k) => `youtube.${k}`),
			...Object.keys(Twitter).map((k) => `twitter.${k}`),
			...Object.keys(Reddit).map((k) => `reddit.${k}`),
		].sort();
		expect(cases.map((c) => c.operation).sort()).toEqual(exposed);
	});

	describe.each(cases)(
		'$operation',
		({ operation, path, query, data, call, callAndCheck }) => {
			it(`sends GET ${path} with the bearer key and query`, async () => {
				respond(envelope(path, query, data));

				await call();

				expect(fetchMock).toHaveBeenCalledTimes(1);
				const { url, init, headers } = lastRequest();
				expect(url.origin).toBe('https://api.tikhub.io');
				expect(url.pathname).toBe(path);
				expect(Object.fromEntries(url.searchParams)).toEqual(query);
				expect(init.method).toBe('GET');
				expect(init.body).toBeUndefined();
				expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
				expect(headers.get('accept')).toBe('application/json');
			});

			it('parses the envelope and payload', async () => {
				respond(envelope(path, query, data));

				const result = await callAndCheck();

				expect(result).toMatchObject({
					code: 200,
					router: path,
					request_id: '810a9d5a-d61e-46a5-b1c8-088a24647631',
					params: query,
				});
				expect(result.cache_url).toContain('cache.tikhub.io');
			});

			it('logs the call under its operation name', async () => {
				respond(envelope(path, query, data));

				await call();

				expect(mockLog).toHaveBeenCalledWith(
					expect.anything(),
					`tikhub.${operation}`,
					expect.objectContaining({
						requestId: '810a9d5a-d61e-46a5-b1c8-088a24647631',
					}),
					'completed',
				);
			});

			it('accepts a null data payload', async () => {
				respond(envelope(path, query, null));

				const result = await call();

				expect(result.data).toBeNull();
			});
		},
	);
});

describe('input validation', () => {
	const invalid: [string, AnyEndpoint, unknown][] = [
		['tiktok.searchVideos without keyword', TikTok.searchVideos, {}],
		[
			'tiktok.searchVideos with an unknown sort',
			TikTok.searchVideos,
			{ keyword: 'x', sort_type: 2 },
		],
		[
			'tiktok.searchVideos with an unsupported publish window',
			TikTok.searchVideos,
			{ keyword: 'x', publish_time: 14 },
		],
		[
			'tiktok.searchVideos with a negative offset',
			TikTok.searchVideos,
			{ keyword: 'x', offset: -1 },
		],
		['tiktok.getUserProfile without an identifier', TikTok.getUserProfile, {}],
		[
			'tiktok.getUserProfile with empty identifiers',
			TikTok.getUserProfile,
			{ uniqueId: '', secUid: '' },
		],
		[
			'tiktok.getVideo with a non-numeric id',
			TikTok.getVideo,
			{ aweme_id: 'abc' },
		],
		[
			'tiktok.getUserVideos without a user',
			TikTok.getUserVideos,
			{ count: 10 },
		],
		[
			'tiktok.getVideoComments with count 0',
			TikTok.getVideoComments,
			{ aweme_id: '1', count: 0 },
		],
		[
			'tiktok.getHashtag with an empty name',
			TikTok.getHashtag,
			{ tag_name: '' },
		],
		['tiktok.getHashtagVideos without ch_id', TikTok.getHashtagVideos, {}],
		[
			'instagram.getUserByUsername without username',
			Instagram.getUserByUsername,
			{},
		],
		[
			'instagram.getUserPosts with count above 50',
			Instagram.getUserPosts,
			{ user_id: '1', count: 51 },
		],
		[
			'instagram.getUserReels with a username instead of an id',
			Instagram.getUserReels,
			{ user_id: 'instagram' },
		],
		[
			'instagram.getPostByUrl with a non-URL',
			Instagram.getPostByUrl,
			{ post_url: 'DPwhVB-jo9k' },
		],
		[
			'instagram.getPostComments with an unknown sort',
			Instagram.getPostComments,
			{ code_or_url: 'DPwhVB-jo9k', sort_by: 'oldest' },
		],
		['youtube.getVideo without an id or URL', YouTube.getVideo, {}],
		[
			'youtube.search without keyword or token',
			YouTube.search,
			{ type: 'video' },
		],
		[
			'youtube.search with an unknown sort',
			YouTube.search,
			{ keyword: 'x', sort_by: 'likes' },
		],
		[
			'youtube.getChannelVideos without channel_id',
			YouTube.getChannelVideos,
			{},
		],
		[
			'twitter.getUserProfile without an identifier',
			Twitter.getUserProfile,
			{},
		],
		[
			'twitter.getUserProfile with a non-numeric rest_id',
			Twitter.getUserProfile,
			{ rest_id: '@elonmusk' },
		],
		[
			'twitter.getUserTweets without an identifier',
			Twitter.getUserTweets,
			{ cursor: 'x' },
		],
		[
			'twitter.searchTweets with an unknown type',
			Twitter.searchTweets,
			{ keyword: 'x', search_type: 'Videos' },
		],
		['twitter.getTweet without tweet_id', Twitter.getTweet, {}],
		['reddit.search without query', Reddit.search, {}],
		[
			'reddit.search with a query over 512 characters',
			Reddit.search,
			{ query: 'a'.repeat(513) },
		],
		[
			'reddit.search with a lowercase sort',
			Reddit.search,
			{ query: 'x', sort: 'top' },
		],
	];

	it.each(invalid)(
		'rejects %s before calling TikHub',
		async (_name, endpoint, input) => {
			await expect(invoke(endpoint, input)).rejects.toMatchObject({
				name: 'ZodError',
			});
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('omits optional parameters the caller did not set', async () => {
		const path = '/api/v1/tiktok/app/v3/fetch_video_search_result';
		respond(envelope(path, { keyword: 'cats' }, { search_item_list: [] }));

		await invoke(TikTok.searchVideos, { keyword: 'cats' });

		expect(Object.fromEntries(lastRequest().url.searchParams)).toEqual({
			keyword: 'cats',
		});
	});

	it('pages YouTube search by continuation token alone', async () => {
		const path = '/api/v1/youtube/web_v2/get_general_search_v2';
		respond(envelope(path, {}, { videos: [], continuation_token: null }));

		const result = await invoke(YouTube.search, {
			continuation_token: 'EqcDEg9weXRob24',
		});

		expect(Object.fromEntries(lastRequest().url.searchParams)).toEqual({
			continuation_token: 'EqcDEg9weXRob24',
		});
		expect(
			(result as { data: { continuation_token: null } }).data
				.continuation_token,
		).toBeNull();
	});

	it('lets callers ask Reddit for the raw payload', async () => {
		const path = '/api/v1/reddit/app/fetch_dynamic_search';
		respond(
			envelope(path, {}, { search: { general: { posts: { edges: [] } } } }),
		);

		await invoke(Reddit.search, { query: 'mcp', need_format: false });

		expect(lastRequest().url.searchParams.get('need_format')).toBe('false');
	});
});

describe('account.getInfo', () => {
	const body = {
		code: 200,
		router: '/api/v1/tikhub/user/get_user_info',
		api_key_data: {
			api_key_name: 'Corsair',
			api_key_scopes: ['/api/v1/tiktok/', '/api/v1/tikhub/user/'],
			created_at: '2026-10-20T06:07:12.495520',
			expires_at: null,
			api_key_status: 1,
		},
		user_data: {
			email: 'dev@example.com',
			balance: 12.5,
			free_credit: 0.75,
			email_verified: true,
			account_disabled: false,
			is_active: true,
		},
	};

	it('reads balance and key status from the non-envelope response', async () => {
		respond(body);

		const result = await invoke(Account.getInfo, {});

		const { url, headers } = lastRequest();
		expect(url.pathname).toBe('/api/v1/tikhub/user/get_user_info');
		expect(url.search).toBe('');
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(result).toMatchObject({
			user_data: { balance: 12.5, free_credit: 0.75, is_active: true },
			api_key_data: { api_key_status: 1, expires_at: null },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'tikhub.account.getInfo',
			expect.any(Object),
			'completed',
		);
	});

	it('accepts a missing input object', async () => {
		respond(body);

		await expect(invoke(Account.getInfo, undefined)).resolves.toMatchObject({
			code: 200,
		});
	});

	it('rejects a response without user_data', async () => {
		respond({ code: 200, api_key_data: body.api_key_data });

		await expect(invoke(Account.getInfo, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});
});

describe('failed calls', () => {
	it('throws when a 200 envelope reports a failure code', async () => {
		respond({
			...envelope('/api/v1/tiktok/app/v3/fetch_one_video', {}, null),
			code: 400,
			message: 'Request failed. Please try again.',
		});

		const error = await invoke(TikTok.getVideo, { aweme_id: '1' }).catch(
			(e: unknown) => e,
		);

		expect(error).toBeInstanceOf(TikHubAPIError);
		expect(error).toMatchObject({ status: 400 });
		expect((error as Error).message).toBe(
			'TikHub 400: Request failed. Please try again.',
		);
		expect(mockLog).not.toHaveBeenCalled();
	});

	it('rejects a payload whose typed fields have the wrong type', async () => {
		respond(
			envelope(
				'/api/v1/tiktok/app/v3/fetch_user_post_videos',
				{},
				{
					aweme_list: [{ ...tiktokVideo, aweme_id: 7350810998023949599 }],
				},
			),
		);

		await expect(
			invoke(TikTok.getUserVideos, { unique_id: 'tiktok' }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});
