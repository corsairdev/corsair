import dotenv from 'dotenv';
import { makeYoutubeRequest } from './client';
import { YoutubeEndpointOutputSchemas } from './endpoints/types';
import type {
	PlaylistsListResponse,
	VideosGetResponse,
	ChannelsGetStatisticsResponse,
	SearchYouTubeResponse,
	SubscriptionsListResponse,
	I18nListLanguagesResponse,
	I18nListRegionsResponse,
	VideoCategoriesListResponse,
	VideoActionsListAbuseReasonsResponse,
	VideosListMostPopularResponse,
	CaptionsListResponse,
	PlaylistItemsListResponse,
} from './endpoints/types';

dotenv.config();

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
					query: { mine: 'true', part: 'snippet,status,contentDetails', maxResults: 5 },
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.playlistsList.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
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
			const parsed = YoutubeEndpointOutputSchemas.playlistItemsList.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
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
					query: { id: resolvedVideoId, part: 'snippet,status,statistics,contentDetails' },
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.videosGet.parse(result);
			console.log(result, 'test')
			expect(parsed).toBeDefined();
			expect(parsed.items).toBeDefined();
			expect(parsed.items!.length).toBeGreaterThan(0);
			expect(parsed.items![0]?.id).toBe(resolvedVideoId);
		});

		it('videosGetBatch returns correct type', async () => {
			if (!hasToken || !resolvedVideoId) return;
			const result = await makeYoutubeRequest<{ items: Array<{ id?: string }> }>(
				'/videos',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: { id: resolvedVideoId, part: 'snippet,statistics' },
				},
			);
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
					query: { chart: 'mostPopular', part: 'snippet,statistics', maxResults: 5 },
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.videosListMostPopular.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
		});

		it('videosGet schema validates item structure', () => {
			const mockResponse: VideosGetResponse = {
				kind: 'youtube#videoListResponse',
				etag: 'abc123',
				items: [{
					id: 'dQw4w9WgXcQ',
					kind: 'youtube#video',
					etag: 'xyz',
					snippet: {
						title: 'Test Video',
						description: 'A test video',
						channelId: 'UC123',
						publishedAt: '2024-01-01T00:00:00Z',
					},
				}],
				pageInfo: { totalResults: 1, resultsPerPage: 5 },
			};
			const parsed = YoutubeEndpointOutputSchemas.videosGet.parse(mockResponse);
			expect(parsed.items![0]?.id).toBe('dQw4w9WgXcQ');
			expect(parsed.items![0]?.snippet?.title).toBe('Test Video');
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
			const parsed = YoutubeEndpointOutputSchemas.channelsGetStatistics.parse(result);
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
			const parsed = YoutubeEndpointOutputSchemas.channelsGetIdByHandle.parse(result);
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
					query: { channelId: resolvedChannelId, part: 'snippet', maxResults: 5 },
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.channelsGetActivities.parse(result);
			expect(parsed).toBeDefined();
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
					query: { q: 'typescript tutorial', part: 'snippet', type: 'video', maxResults: 5 },
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.searchYouTube.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
		});

		it('searchYouTube schema validates result structure', () => {
			const mockResponse: SearchYouTubeResponse = {
				kind: 'youtube#searchListResponse',
				etag: 'abc',
				regionCode: 'US',
				pageInfo: { totalResults: 1000000, resultsPerPage: 5 },
				items: [{
					kind: 'youtube#searchResult',
					etag: 'xyz',
					id: { kind: 'youtube#video', videoId: 'abc123' },
					snippet: {
						title: 'Test Result',
						channelId: 'UC123',
						channelTitle: 'Test Channel',
						publishedAt: '2024-01-01T00:00:00Z',
					},
				}],
			};
			const parsed = YoutubeEndpointOutputSchemas.searchYouTube.parse(mockResponse);
			expect(parsed.items![0]?.id?.videoId).toBe('abc123');
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
					query: { mine: 'true', part: 'snippet,contentDetails', maxResults: 5 },
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.subscriptionsList.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
		});
	});

	describe('videoActions', () => {
		it('videoActionsListAbuseReasons returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<VideoActionsListAbuseReasonsResponse>(
				'/videoAbuseReportReasons',
				ACCESS_TOKEN,
				{
					method: 'GET',
					query: { part: 'snippet' },
				},
			);
			const parsed = YoutubeEndpointOutputSchemas.videoActionsListAbuseReasons.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
		});

		it('videoActionsGetRating returns correct type', async () => {
			if (!hasToken || !TEST_VIDEO_ID) return;
			const result = await makeYoutubeRequest<{ items: Array<{ videoId?: string; rating?: string }> }>(
				'/videos/getRating',
				ACCESS_TOKEN,
				{ method: 'GET', query: { id: TEST_VIDEO_ID } },
			);
			const parsed = YoutubeEndpointOutputSchemas.videoActionsGetRating.parse(result);
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
	});

	describe('i18n', () => {
		it('i18nListLanguages returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<I18nListLanguagesResponse>(
				'/i18nLanguages',
				ACCESS_TOKEN,
				{ method: 'GET', query: { part: 'snippet' } },
			);
			const parsed = YoutubeEndpointOutputSchemas.i18nListLanguages.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
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
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
		});

		it('videoCategoriesList returns correct type', async () => {
			if (!hasToken) return;
			const result = await makeYoutubeRequest<VideoCategoriesListResponse>(
				'/videoCategories',
				ACCESS_TOKEN,
				{ method: 'GET', query: { part: 'snippet', regionCode: 'US' } },
			);
			const parsed = YoutubeEndpointOutputSchemas.videoCategoriesList.parse(result);
			expect(parsed).toBeDefined();
			expect(Array.isArray(parsed.items) || parsed.items === undefined).toBe(true);
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
			const parsed = YoutubeEndpointOutputSchemas.videosGet.parse(videoWithExtra);
			// passthrough() ensures unknown fields survive schema parsing
			expect((parsed as Record<string, unknown>).unknown_top_level_field).toBe(true);
		});

		it('preserves extra fields on search responses', () => {
			const searchWithExtra = {
				kind: 'youtube#searchListResponse',
				etag: 'abc',
				items: [],
				pageInfo: { totalResults: 0, resultsPerPage: 5 },
				custom_field: 'preserved',
			};
			const parsed = YoutubeEndpointOutputSchemas.searchYouTube.parse(searchWithExtra);
			// passthrough() ensures unknown fields survive schema parsing
			expect((parsed as Record<string, unknown>).custom_field).toBe('preserved');
		});
	});

	describe('delete response schemas', () => {
		it('playlistsDelete schema is valid', () => {
			const response = {
				deleted: true,
				playlist_id: 'PLtest123',
				http_status: 204,
			};
			const parsed = YoutubeEndpointOutputSchemas.playlistsDelete.parse(response);
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
			const parsed = YoutubeEndpointOutputSchemas.commentsDelete.parse(response);
			expect(parsed.deleted).toBe(true);
			expect(parsed.comment_id).toBe('comment123');
		});

		it('subscriptionsUnsubscribe schema is valid', () => {
			const response = {
				unsubscribed: true,
				subscription_id: 'sub123',
				http_status: 204,
			};
			const parsed = YoutubeEndpointOutputSchemas.subscriptionsUnsubscribe.parse(response);
			expect(parsed.unsubscribed).toBe(true);
		});
	});
});
