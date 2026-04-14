import 'dotenv/config';
import { makeYoutubeRequest } from './client';
import type {
	CaptionsListResponse,
	ChannelsGetStatisticsResponse,
	I18nListLanguagesResponse,
	I18nListRegionsResponse,
	PlaylistItemsListResponse,
	PlaylistsListResponse,
	SearchYouTubeResponse,
	SubscriptionsListResponse,
	VideoActionsListAbuseReasonsResponse,
	VideoCategoriesListResponse,
	VideosGetResponse,
	VideosListMostPopularResponse,
} from './endpoints/types';
import { YoutubeEndpointOutputSchemas } from './endpoints/types';

const ACCESS_TOKEN = process.env.YOUTUBE_ACCESS_TOKEN ?? '';
const TEST_VIDEO_ID = process.env.YOUTUBE_VIDEO_ID;
const TEST_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
const TEST_PLAYLIST_ID = process.env.YOUTUBE_PLAYLIST_ID;

const hasToken = ACCESS_TOKEN.length > 0;

describe('YouTube API Type Tests', () => {
	describe('playlists', () => {
		it('playlistsList returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<PlaylistsListResponse>(
				'/playlists',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: {
						mine: 'true',
						part: 'snippet,status,contentDetails',
						maxResults: 5,
					},
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.playlistsList.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
		});

		it('playlistsList schema handles empty result', () => {
			const empty: PlaylistsListResponse = {
				kind: 'youtube#playlistListResponse',
				etag: 'test',
				items: [],
				pageInfo: { totalResults: 0, resultsPerPage: 5 },
			};
			const parsed = YoutubeEndpointOutputSchemas.playlistsList.parse(empty);
			expect(parsed.items).toHaveLength(0);
		});

		it('playlistsList schema spreads all snippet and status fields', () => {
			const snippet = {
				title: 'Test Playlist',
				description: 'A test playlist',
				channelId: 'UC123',
				publishedAt: '2024-01-01T00:00:00Z',
				defaultLanguage: 'en',
				localized: { title: 'Test Playlist', description: 'A test playlist' },
			};
			const status = { privacyStatus: 'public' };
			const contentDetails = { itemCount: 10 };
			const mock: PlaylistsListResponse = {
				kind: 'youtube#playlistListResponse',
				etag: 'abc',
				items: [
					{
						id: 'PL123',
						kind: 'youtube#playlist',
						etag: 'xyz',
						snippet,
						status,
						contentDetails,
					},
				],
				pageInfo: { totalResults: 1, resultsPerPage: 5 },
			};
			const parsed = YoutubeEndpointOutputSchemas.playlistsList.parse(mock);
			expect(parsed.items![0]?.snippet?.title).toBe('Test Playlist');
			expect(parsed.items![0]?.status?.privacyStatus).toBe('public');
			expect(parsed.items![0]?.contentDetails?.itemCount).toBe(10);
		});
	});

	describe('playlistItems', () => {
		it('playlistItemsList returns correct type', async () => {
			if (!hasToken || !TEST_PLAYLIST_ID) return;
			const result = await makeYoutubeRequest<PlaylistItemsListResponse>(
				'/playlistItems',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: {
						playlistId: TEST_PLAYLIST_ID,
						part: 'snippet,contentDetails',
						maxResults: 5,
					},
				},
			);
			const parsed =
				YoutubeEndpointOutputSchemas.playlistItemsList.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
		});
	});

	describe('videos', () => {
		let resolvedVideoId: string;

		beforeAll(async () => {
			if (TEST_VIDEO_ID) {
				resolvedVideoId = TEST_VIDEO_ID;
				return;
			}
			if (!hasToken) return;
			// Discover a video from most popular
			const result = await makeYoutubeRequest<VideosListMostPopularResponse>(
				'/videos',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: { chart: 'mostPopular', part: 'snippet', maxResults: 1 },
				},
			);
			if (result.items && result.items.length > 0 && result.items[0]?.id) {
				resolvedVideoId = result.items[0].id;
			}
		});

		it('videosGet returns correct type', async () => {
			if (!hasToken || !resolvedVideoId) return;
			const result = await makeYoutubeRequest<VideosGetResponse>(
				'/videos',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: {
						id: resolvedVideoId,
						part: 'snippet,status,statistics,contentDetails',
					},
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.videosGet.parse(result);
			expect(parsed).toBeDefined();
			expect(parsed.items).toBeDefined();
			expect(parsed.items!.length).toBeGreaterThan(0);
			expect(parsed.items![0]?.id).toBe(resolvedVideoId);
		});

		it('videosGetBatch returns correct type', async () => {
			if (!hasToken || !resolvedVideoId) return;
			const result = await makeYoutubeRequest<{
				items: Array<{ id?: string }>;
			}>('/videos', ACCESS_TOKEN, {
				method: 'GET',
				query: { id: resolvedVideoId, part: 'snippet,statistics' },
			});
			const parsed = YoutubeEndpointOutputSchemas.videosGetBatch.parse({
				...result,
				found_count: result.items?.length ?? 0,
				requested_count: 1,
				not_found_count: 0,
			});
			expect(parsed).toBeDefined();
		});

		it('videosListMostPopular returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<VideosListMostPopularResponse>(
				'/videos',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: {
						chart: 'mostPopular',
						part: 'snippet,statistics',
						maxResults: 5,
					},
				},
			);
			const parsed =
				YoutubeEndpointOutputSchemas.videosListMostPopular.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
		});

		it('videosGet schema validates spread snippet and statistics fields', () => {
			const snippet = {
				title: 'Test Video',
				description: 'A test video',
				channelId: 'UC123',
				publishedAt: '2024-01-01T00:00:00Z',
				tags: ['typescript', 'tutorial'],
				categoryId: '28',
				defaultLanguage: 'en',
			};
			const statistics = {
				viewCount: '1000',
				likeCount: '50',
				commentCount: '10',
			};
			const status = { privacyStatus: 'public', uploadStatus: 'processed' };
			const contentDetails = {
				duration: 'PT10M30S',
				dimension: '2d',
				definition: 'hd',
			};
			const mockResponse: VideosGetResponse = {
				kind: 'youtube#videoListResponse',
				etag: 'abc123',
				items: [
					{
						id: 'dQw4w9WgXcQ',
						kind: 'youtube#video',
						etag: 'xyz',
						snippet,
						statistics,
						status,
						contentDetails,
					},
				],
				pageInfo: { totalResults: 1, resultsPerPage: 5 },
			};
			const parsed = YoutubeEndpointOutputSchemas.videosGet.parse(mockResponse);
			expect(parsed.items![0]?.id).toBe('dQw4w9WgXcQ');
			expect(parsed.items![0]?.snippet?.title).toBe('Test Video');
			expect(parsed.items![0]?.statistics?.viewCount).toBe('1000');
			expect(parsed.items![0]?.contentDetails?.duration).toBe('PT10M30S');
			expect(parsed.items![0]?.status?.privacyStatus).toBe('public');
		});
	});

	describe('channels', () => {
		let resolvedChannelId: string | undefined;

		beforeAll(async () => {
			if (TEST_CHANNEL_ID) {
				resolvedChannelId = TEST_CHANNEL_ID;
				return;
			}
			if (!hasToken) return;
			// Get the authenticated user's channel
			const result = await makeYoutubeRequest<ChannelsGetStatisticsResponse>(
				'/channels',
				ACCESS_TOKEN,
				{ method: 'GET', query: { mine: 'true', part: 'snippet,statistics' } },
			);
			if (result.items && result.items.length > 0 && result.items[0]?.id) {
				resolvedChannelId = result.items[0].id;
			}
		});

		it('channelsGetStatistics returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<ChannelsGetStatisticsResponse>(
				'/channels',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: { mine: 'true', part: 'snippet,statistics,contentDetails' },
				},
			);
			const parsed =
				YoutubeEndpointOutputSchemas.channelsGetStatistics.parse(result);
			expect(parsed).toBeDefined();
		});

		it('channelsGetIdByHandle returns correct type', async () => {
			if (!hasToken) return;
			// Use a well-known channel handle for testing
			const result = await makeYoutubeRequest<ChannelsGetStatisticsResponse>(
				'/channels',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: { forHandle: '@YouTube', part: 'snippet,statistics' },
				},
			);
			const parsed =
				YoutubeEndpointOutputSchemas.channelsGetIdByHandle.parse(result);
			expect(parsed).toBeDefined();
			if (parsed.items && parsed.items.length > 0) {
				expect(parsed.items[0]?.id).toBeDefined();
			}
		});

		it('channelsGetActivities returns correct type', async () => {
			if (!hasToken || !resolvedChannelId) return;
			const result = await makeYoutubeRequest<{ items: unknown[] }>(
				'/activities',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: {
						channelId: resolvedChannelId,
						part: 'snippet',
						maxResults: 5,
					},
				},
			);
			const parsed =
				YoutubeEndpointOutputSchemas.channelsGetActivities.parse(result);
			expect(parsed).toBeDefined();
		});

		it('channelsGetStatistics schema spreads snippet and statistics fields', () => {
			const snippet = {
				title: 'Test Channel',
				description: 'A test channel',
				customUrl: '@testchannel',
				publishedAt: '2020-01-01T00:00:00Z',
				country: 'US',
			};
			const statistics = {
				viewCount: '1000000',
				subscriberCount: '5000',
				videoCount: '100',
				hiddenSubscriberCount: false,
			};
			const mock: ChannelsGetStatisticsResponse = {
				kind: 'youtube#channelListResponse',
				etag: 'abc',
				items: [
					{
						id: 'UC123',
						kind: 'youtube#channel',
						etag: 'xyz',
						snippet,
						statistics,
					},
				],
				pageInfo: { totalResults: 1, resultsPerPage: 5 },
			};
			const parsed =
				YoutubeEndpointOutputSchemas.channelsGetStatistics.parse(mock);
			expect(parsed.items![0]?.snippet?.title).toBe('Test Channel');
			expect(parsed.items![0]?.statistics?.subscriberCount).toBe('5000');
		});
	});

	describe('search', () => {
		it('searchYouTube returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<SearchYouTubeResponse>(
				'/search',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: {
						q: 'typescript tutorial',
						part: 'snippet',
						type: 'video',
						maxResults: 5,
					},
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.searchYouTube.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
		});

		it('searchYouTube schema validates result structure with all snippet fields', () => {
			const snippet = {
				title: 'Test Result',
				channelId: 'UC123',
				channelTitle: 'Test Channel',
				publishedAt: '2024-01-01T00:00:00Z',
				description: 'A test search result',
				liveBroadcastContent: 'none',
			};
			const mockResponse: SearchYouTubeResponse = {
				kind: 'youtube#searchListResponse',
				etag: 'abc',
				regionCode: 'US',
				pageInfo: { totalResults: 1000000, resultsPerPage: 5 },
				items: [
					{
						kind: 'youtube#searchResult',
						etag: 'xyz',
						id: { kind: 'youtube#video', videoId: 'abc123' },
						snippet,
					},
				],
			};
			const parsed =
				YoutubeEndpointOutputSchemas.searchYouTube.parse(mockResponse);
			expect(parsed.items![0]?.id?.videoId).toBe('abc123');
			expect(parsed.items![0]?.snippet?.channelTitle).toBe('Test Channel');
		});

		it('searchYouTube video results have videoId for DB persistence', () => {
			const mock: SearchYouTubeResponse = {
				kind: 'youtube#searchListResponse',
				etag: 'abc',
				pageInfo: { totalResults: 2, resultsPerPage: 5 },
				items: [
					{
						kind: 'youtube#searchResult',
						etag: 'e1',
						id: { kind: 'youtube#video', videoId: 'vid1' },
						snippet: { title: 'Video 1', channelId: 'UC1' },
					},
					{
						kind: 'youtube#searchResult',
						etag: 'e2',
						id: { kind: 'youtube#channel', channelId: 'ch1' },
						snippet: { title: 'Channel 1' },
					},
				],
			};
			const parsed = YoutubeEndpointOutputSchemas.searchYouTube.parse(mock);
			const videoItems = (parsed.items ?? []).filter(
				(i: { id?: { videoId?: string } }) => i.id?.videoId,
			);
			const channelItems = (parsed.items ?? []).filter(
				(i: { id?: { channelId?: string; videoId?: string } }) =>
					i.id?.channelId && !i.id?.videoId,
			);
			expect(videoItems).toHaveLength(1);
			expect(channelItems).toHaveLength(1);
			expect(videoItems[0]?.id?.videoId).toBe('vid1');
		});
	});

	describe('subscriptions', () => {
		it('subscriptionsList returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<SubscriptionsListResponse>(
				'/subscriptions',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: {
						mine: 'true',
						part: 'snippet,contentDetails',
						maxResults: 5,
					},
				},
			);
			const parsed =
				YoutubeEndpointOutputSchemas.subscriptionsList.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
		});

		it('subscriptionsList schema captures channelId from resourceId', () => {
			const snippet = {
				publishedAt: '2024-01-01T00:00:00Z',
				title: 'Test Channel',
				description: 'A subscribed channel',
				channelId: 'UC_subscriber',
				resourceId: { kind: 'youtube#channel', channelId: 'UC_subscribed' },
			};
			const mock: SubscriptionsListResponse = {
				kind: 'youtube#subscriptionListResponse',
				etag: 'abc',
				items: [
					{ id: 'sub123', kind: 'youtube#subscription', etag: 'xyz', snippet },
				],
				pageInfo: { totalResults: 1, resultsPerPage: 5 },
			};
			const parsed = YoutubeEndpointOutputSchemas.subscriptionsList.parse(mock);
			// snippet.channelId is the subscriber's channel; resourceId.channelId is the subscribed channel
			expect(parsed.items![0]?.snippet?.resourceId?.channelId).toBe(
				'UC_subscribed',
			);
		});
	});

	describe('videoActions', () => {
		it('videoActionsListAbuseReasons returns correct type', async () => {
			if (!hasToken) return;
			const result =
				await makeYoutubeRequest<VideoActionsListAbuseReasonsResponse>(
					'/videoAbuseReportReasons',
					ACCESS_TOKEN,
					{
						method: 'GET',
						query: { part: 'snippet' },
					},
				);
			const parsed =
				YoutubeEndpointOutputSchemas.videoActionsListAbuseReasons.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
		});

		it('videoActionsGetRating returns correct type', async () => {
			if (!hasToken || !TEST_VIDEO_ID) return;
			const result = await makeYoutubeRequest<{
				items: Array<{ videoId?: string; rating?: string }>;
			}>('/videos/getRating', ACCESS_TOKEN, {
				method: 'GET',
				query: { id: TEST_VIDEO_ID },
			});
			const parsed =
				YoutubeEndpointOutputSchemas.videoActionsGetRating.parse(result);
			expect(parsed).toBeDefined();
		});
	});

	describe('captions', () => {
		it('captionsList returns correct type', async () => {
			if (!hasToken || !TEST_VIDEO_ID) return;
			const result = await makeYoutubeRequest<CaptionsListResponse>(
				'/captions',
				ACCESS_TOKEN,
				{ method: 'GET', query: { videoId: TEST_VIDEO_ID, part: 'snippet' } },
			);
			const parsed = YoutubeEndpointOutputSchemas.captionsList.parse(result);
			expect(parsed).toBeDefined();
		});

		it('captionsList schema spreads all snippet fields', () => {
			const snippet = {
				videoId: 'vid123',
				lastUpdated: '2024-01-01T00:00:00Z',
				trackKind: 'standard',
				language: 'en',
				name: 'English',
				audioTrackType: 'unknown',
				isCC: false,
				isLarge: false,
				isEasyReader: false,
				isDraft: false,
				isAutoSynced: false,
				status: 'serving',
			};
			const mock: CaptionsListResponse = {
				kind: 'youtube#captionListResponse',
				etag: 'abc',
				items: [
					{ id: 'cap123', kind: 'youtube#caption', etag: 'xyz', snippet },
				],
			};
			const parsed = YoutubeEndpointOutputSchemas.captionsList.parse(mock);
			expect(parsed.items![0]?.id).toBe('cap123');
			expect(parsed.items![0]?.snippet?.language).toBe('en');
			expect(parsed.items![0]?.snippet?.isDraft).toBe(false);
		});
	});

	describe('i18n', () => {
		it('i18nListLanguages returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<I18nListLanguagesResponse>(
				'/i18nLanguages',
				ACCESS_TOKEN,
				{ method: 'GET', query: { part: 'snippet' } },
			);
			const parsed =
				YoutubeEndpointOutputSchemas.i18nListLanguages.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
			if (parsed.items && parsed.items.length > 0) {
				expect(parsed.items[0]?.id).toBeDefined();
			}
		});

		it('i18nListRegions returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<I18nListRegionsResponse>(
				'/i18nRegions',
				ACCESS_TOKEN,
				{ method: 'GET', query: { part: 'snippet' } },
			);
			const parsed = YoutubeEndpointOutputSchemas.i18nListRegions.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
		});

		it('videoCategoriesList returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<VideoCategoriesListResponse>(
				'/videoCategories',
				ACCESS_TOKEN,
				{ method: 'GET', query: { part: 'snippet', regionCode: 'US' } },
			);
			const parsed =
				YoutubeEndpointOutputSchemas.videoCategoriesList.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(
				true,
			);
		});
	});

	describe('passthrough', () => {
		it('preserves extra fields on video responses', () => {
			const videoWithExtra = {
				kind: 'youtube#videoListResponse',
				etag: 'abc',
				items: [{ id: 'test123', extra_field: 'preserved' }],
				pageInfo: { totalResults: 1, resultsPerPage: 5 },
				unknown_top_level_field: true,
			};
			const parsed =
				YoutubeEndpointOutputSchemas.videosGet.parse(videoWithExtra);
			// passthrough() ensures unknown fields survive schema parsing
			expect((parsed as Record<string, unknown>).unknown_top_level_field).toBe(
				true,
			);
		});

		it('preserves extra fields on search responses', () => {
			const searchWithExtra = {
				kind: 'youtube#searchListResponse',
				etag: 'abc',
				items: [],
				pageInfo: { totalResults: 0, resultsPerPage: 5 },
				custom_field: 'preserved',
			};
			const parsed =
				YoutubeEndpointOutputSchemas.searchYouTube.parse(searchWithExtra);
			// passthrough() ensures unknown fields survive schema parsing
			expect((parsed as Record<string, unknown>).custom_field).toBe(
				'preserved',
			);
		});

		it('preserves extra snippet fields spread into DB upsert payload', () => {
			// Simulate the spread pattern: extra fields from snippet survive passthrough
			const mockVideo = {
				kind: 'youtube#videoListResponse',
				etag: 'abc',
				items: [
					{
						id: 'vid123',
						snippet: {
							title: 'Test',
							channelId: 'UC123',
							defaultLanguage: 'en',
							liveBroadcastContent: 'none',
						},
						statistics: { viewCount: '100', likeCount: '5' },
						status: { privacyStatus: 'public', uploadStatus: 'processed' },
						contentDetails: { duration: 'PT5M', definition: 'hd' },
					},
				],
				pageInfo: { totalResults: 1, resultsPerPage: 5 },
			};
			const parsed = YoutubeEndpointOutputSchemas.videosGet.parse(mockVideo);
			const item = parsed.items![0]!;
			// Verify all nested objects are accessible for spread
			expect(item.snippet?.defaultLanguage).toBe('en');
			expect(item.statistics?.viewCount).toBe('100');
			expect(item.status?.uploadStatus).toBe('processed');
			expect(item.contentDetails?.definition).toBe('hd');
		});
	});

	describe('delete response schemas', () => {
		it('playlistsDelete schema is valid', () => {
			const response = {
				deleted: true,
				playlist_id: 'PLtest123',
				http_status: 204,
			};
			const parsed =
				YoutubeEndpointOutputSchemas.playlistsDelete.parse(response);
			expect(parsed.deleted).toBe(true);
			expect(parsed.playlist_id).toBe('PLtest123');
			expect(parsed.http_status).toBe(204);
		});

		it('videosDelete schema is valid', () => {
			const response = {
				deleted: true,
				video_id: 'dQw4w9WgXcQ',
				http_status: 204,
			};
			const parsed = YoutubeEndpointOutputSchemas.videosDelete.parse(response);
			expect(parsed.deleted).toBe(true);
			expect(parsed.video_id).toBe('dQw4w9WgXcQ');
		});

		it('commentsDelete schema is valid', () => {
			const response = {
				deleted: true,
				comment_id: 'comment123',
				http_status: 204,
			};
			const parsed =
				YoutubeEndpointOutputSchemas.commentsDelete.parse(response);
			expect(parsed.deleted).toBe(true);
			expect(parsed.comment_id).toBe('comment123');
		});

		it('subscriptionsUnsubscribe schema is valid', () => {
			const response = {
				unsubscribed: true,
				subscription_id: 'sub123',
				http_status: 204,
			};
			const parsed =
				YoutubeEndpointOutputSchemas.subscriptionsUnsubscribe.parse(response);
			expect(parsed.unsubscribed).toBe(true);
		});
	});
});
