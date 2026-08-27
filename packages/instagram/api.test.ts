import * as client from './client';
import { post as carouselPost } from './endpoints/carousel';
import {
	remove as deleteComment,
	get as getCommentsDetails,
	getReplies,
	list as listComments,
	postComments,
	postReplies,
	reply as replyComments,
	replyToComment,
	send as sendComments,
	update as updateComments,
} from './endpoints/comments';
import {
	getConversation,
	get as getConversationMessages,
	listAll as listAllConversations,
	list as listConversations,
	pageConversations,
} from './endpoints/conversations';
import { post as imagePost, story as imageStory } from './endpoints/image';
import {
	createMediaContainer,
	get as getMedia,
	getMediaInsights,
	list as listMedia,
	children as mediaChildren,
	comments as mediaComments,
	insights as mediaInsights,
	status as mediaStatus,
	postIgUserMedia,
} from './endpoints/media';
import {
	get as getMessage,
	listAll as listAllMessages,
	markSeen,
	sendImage,
	send as sendMessage,
	sendTextMessage,
} from './endpoints/messages';
import {
	deleteProfile,
	getProfile,
	updateProfile,
} from './endpoints/messenger-profile';
import { GetFacebookPages } from './endpoints/meta-data-endpoints';
import {
	getComments as getPostComments,
	getInsights as getPostInsights,
	getStatus as getPostStatus,
} from './endpoints/post';
import {
	contentPublishingLimit,
	insights as getAccountInsights,
	media as getIgUserMedia,
	stories as getIgUserStories,
	tags as getIgUserTags,
	get as getInstagramUser,
	liveMedia as getLiveMedia,
	info as getUserInfo,
	userInsights as getUserInsights,
	userMedia as getUserMedia,
	replyMentions,
} from './endpoints/profile';
import {
	createPost,
	publishIgUserMedia,
	publish as publishMedia,
} from './endpoints/publish-content';
import { post as reelPost } from './endpoints/reel';
import {
	container as videoContainer,
	story as videoStory,
} from './endpoints/video';

// Mock client request helper
jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeAuthenticatedInstagramRequest: jest.fn(),
	};
});

// Mock GetFacebookPages
jest.mock('./endpoints/meta-data-endpoints', () => ({
	GetFacebookPages: jest.fn(),
}));

// Mock logEventFromContext
jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

describe('Instagram API Endpoint Behaviors', () => {
	const mockContext: any = {
		key: 'test-user-token',
		db: {
			users: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			media: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
			comments: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
				deleteByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			conversations: {
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
			},
			messages: { upsertByEntityId: jest.fn().mockResolvedValue(undefined) },
		},
		endpoints: {
			media: {
				get: jest.fn().mockResolvedValue({ id: 'mock-media-id' }),
			},
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(GetFacebookPages as jest.Mock).mockResolvedValue({
			access_token: 'test-page-token',
		});
		(client.makeAuthenticatedInstagramRequest as jest.Mock).mockImplementation(
			async (endpoint, ctx, options, getToken) => {
				let token = ctx.key;
				if (getToken) {
					token = await getToken(ctx.key);
				}
				return {
					id: 'mock-response-id',
					message_id: 'mock-msg-id',
					success: true,
					result: 'success',
					token,
					data: [{ id: 'mock-item-1' }],
				};
			},
		);
	});

	// ─── Post Handlers ────────────────────────────────────────────────────────

	describe('post handlers', () => {
		it('getComments forwards fields, after, and before pagination cursors', async () => {
			const input = {
				post_id: 'post123',
				fields: 'id,text,timestamp',
				after: 'cursor_after_123',
				before: 'cursor_before_123',
			};

			await getPostComments(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/post123/comments',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,text,timestamp',
						after: 'cursor_after_123',
						before: 'cursor_before_123',
					},
				},
			);
		});

		it('getInsights queries post insights with metric list', async () => {
			const input = {
				post_id: 'post123',
				metrics: ['impressions', 'reach'],
			};

			await getPostInsights(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/post123/insights',
				mockContext,
				{
					method: 'GET',
					query: {
						metric: 'impressions,reach',
					},
				},
			);
		});

		it('getStatus queries container status code', async () => {
			const input = {
				container_id: 'container123',
			};

			await getPostStatus(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/container123',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'status_code',
					},
				},
			);
		});
	});

	// ─── Profile Handlers ─────────────────────────────────────────────────────

	describe('profile handlers', () => {
		it('get retrieves user details and updates db', async () => {
			const input = { ig_id: 'ig123', q: 'id,username' };

			await getInstagramUser(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123',
				mockContext,
				{
					method: 'GET',
					query: { fields: 'id,username' },
				},
			);
			expect(mockContext.db.users.upsertByEntityId).toHaveBeenCalled();
		});

		it('insights retrieves account insights', async () => {
			const input = {
				ig_id: 'ig123',
				metric: 'impressions,reach',
				period: 'day',
			};

			await getAccountInsights(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/insights',
				mockContext,
				{
					method: 'GET',
					query: {
						metric: 'impressions,reach',
						period: 'day',
						timeframe: undefined,
						metric_type: undefined,
						breakdown: undefined,
						since: undefined,
						until: undefined,
					},
				},
			);
		});

		it('contentPublishingLimit retrieves quota usage', async () => {
			const input = { ig_id: 'ig123' };

			await contentPublishingLimit(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/content_publishing_limit',
				mockContext,
				{
					method: 'GET',
					query: { fields: 'config,quota_usage' },
				},
			);
		});

		it('liveMedia retrieves live media with pagination', async () => {
			const input = {
				ig_id: 'ig123',
				fields: 'id,media_type',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await getLiveMedia(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/live_media',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,media_type',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
		});

		it('media retrieves user media with pagination', async () => {
			const input = {
				ig_id: 'ig123',
				fields: 'id,caption',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await getIgUserMedia(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,caption',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
		});

		it('stories retrieves user stories with pagination', async () => {
			const input = {
				ig_id: 'ig123',
				fields: 'id,media_url',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await getIgUserStories(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/stories',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,media_url',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
		});

		it('tags retrieves user tags with pagination', async () => {
			const input = {
				ig_id: 'ig123',
				fields: 'id,username',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await getIgUserTags(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/tags',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,username',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
		});

		it('info retrieves user info', async () => {
			const input = { ig_id: 'ig123', fields: 'biography,followers_count' };

			await getUserInfo(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123',
				mockContext,
				{
					method: 'GET',
					query: { fields: 'biography,followers_count' },
				},
			);
		});

		it('userInsights retrieves insights for user', async () => {
			const input = {
				ig_id: 'ig123',
				metrics: ['reach', 'impressions'],
				period: 'day',
			};

			await getUserInsights(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/insights',
				mockContext,
				{
					method: 'GET',
					query: {
						metric: 'reach,impressions',
						period: 'day',
						since: undefined,
						until: undefined,
						metric_type: undefined,
						breakdown: undefined,
						timeframe: undefined,
					},
				},
			);
		});

		it('userMedia retrieves deprecated user media with pagination', async () => {
			const input = {
				ig_id: 'ig123',
				fields: 'id,caption',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await getUserMedia(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,caption',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
		});

		it('replyMentions posts comment reply to mention', async () => {
			const input = { mention_id: 'mention123', message: 'Thanks!' };

			await replyMentions(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/mention123/comments',
				mockContext,
				{
					method: 'POST',
					body: { message: 'Thanks!' },
				},
			);
		});
	});

	// ─── Media Handlers ───────────────────────────────────────────────────────

	describe('media handlers', () => {
		it('list retrieves media with pagination', async () => {
			const input = {
				ig_id: 'ig123',
				q: 'id,caption,media_url',
				after: 'cursor_after',
				before: 'cursor_before',
			};

			await listMedia(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'ig123/media',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,caption,media_url',
						after: 'cursor_after',
						before: 'cursor_before',
					},
				},
			);
			expect(mockContext.db.media.upsertByEntityId).toHaveBeenCalled();
		});

		it('get retrieves single media details and saves to db', async () => {
			const input = { media_id: 'media123', q: 'id,caption' };

			await getMedia(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/media123',
				mockContext,
				{
					method: 'GET',
					query: { fields: 'id,caption' },
				},
			);
			expect(mockContext.db.media.upsertByEntityId).toHaveBeenCalled();
		});

		it('status retrieves container status', async () => {
			const input = { container_id: 'container123' };

			await mediaStatus(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/container123',
				mockContext,
				{
					method: 'GET',
					query: { fields: 'status_code' },
				},
			);
		});

		it('insights retrieves media insights with fallback metrics', async () => {
			const input = { media_id: 'media123', type: 'IMAGE' as const };

			await mediaInsights(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/media123/insights',
				mockContext,
				{
					method: 'GET',
					query: {
						metric: expect.stringContaining('reach'),
					},
				},
			);
		});

		it('createMediaContainer creates media container', async () => {
			const input = {
				ig_id: 'ig123',
				image_url: 'https://example.com/pic.jpg',
				caption: 'A test caption',
				user_tags: [{ username: 'user1', x: 0.5, y: 0.5 }],
			};

			await createMediaContainer(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'POST',
					body: {
						image_url: 'https://example.com/pic.jpg',
						video_url: undefined,
						media_type: undefined,
						caption: 'A test caption',
						is_carousel_item: undefined,
						user_tags: JSON.stringify(input.user_tags),
					},
				},
			);
		});

		it('children retrieves carousel children with pagination', async () => {
			const input = {
				media_id: 'media123',
				fields: 'id,media_type',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await mediaChildren(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/media123/children',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,media_type',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
		});

		it('comments retrieves media comments with pagination', async () => {
			const input = {
				media_id: 'media123',
				fields: 'id,text',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await mediaComments(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/media123/comments',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,text',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
		});

		it('getMediaInsights retrieves insights by explicit metric array', async () => {
			const input = {
				media_id: 'media123',
				metrics: ['impressions', 'reach'],
			};

			await getMediaInsights(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/media123/insights',
				mockContext,
				{
					method: 'GET',
					query: { metric: 'impressions,reach' },
				},
			);
		});

		it('postIgUserMedia creates user media container', async () => {
			const input = {
				ig_id: 'ig123',
				video_url: 'https://example.com/video.mp4',
				media_type: 'VIDEO',
				caption: 'My video',
			};

			await postIgUserMedia(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'POST',
					body: {
						image_url: undefined,
						video_url: 'https://example.com/video.mp4',
						media_type: 'VIDEO',
						caption: 'My video',
						is_carousel_item: undefined,
						user_tags: undefined,
					},
				},
			);
		});
	});

	// ─── Image / Reel / Video / Carousel Handlers ─────────────────────────────

	describe('media container creation handlers', () => {
		it('imagePost creates an image container', async () => {
			const input = {
				ig_id: 'ig123',
				image_url: 'https://example.com/image.jpg',
				caption: 'Test Image',
			};

			await imagePost(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'POST',
					body: {
						image_url: 'https://example.com/image.jpg',
						is_carousel_item: undefined,
						alt_text: undefined,
						caption: 'Test Image',
						location_id: undefined,
						user_tags: undefined,
						product_tags: undefined,
					},
				},
			);
		});

		it('imageStory creates a story container', async () => {
			const input = {
				ig_id: 'ig123',
				image_url: 'https://example.com/story.jpg',
			};

			await imageStory(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'POST',
					body: {
						image_url: 'https://example.com/story.jpg',
						media_type: 'STORIES',
						user_tags: undefined,
					},
				},
			);
		});

		it('reelPost creates a reel container', async () => {
			const input = {
				ig_id: 'ig123',
				video_url: 'https://example.com/reel.mp4',
				media_type: 'REELS',
				caption: 'Reel caption',
			};

			await reelPost(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'POST',
					body: {
						media_type: 'REELS',
						video_url: 'https://example.com/reel.mp4',
						caption: 'Reel caption',
						share_to_feed: undefined,
						collaborators: undefined,
						cover_url: undefined,
						audio_name: undefined,
						thumb_offset: undefined,
						location_id: undefined,
						user_tags: undefined,
						trial_params: undefined,
					},
				},
			);
		});

		it('videoStory creates a video story container', async () => {
			const input = {
				ig_id: 'ig123',
				video_url: 'https://example.com/vstory.mp4',
			};

			await videoStory(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'POST',
					body: {
						video_url: 'https://example.com/vstory.mp4',
						media_type: 'STORIES',
						user_tags: undefined,
					},
				},
			);
		});

		it('videoContainer creates a carousel video item', async () => {
			const input = {
				ig_id: 'ig123',
				video_url: 'https://example.com/cvideo.mp4',
				caption: 'Video in carousel',
			};

			await videoContainer(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'POST',
					body: {
						media_type: 'VIDEO',
						video_url: 'https://example.com/cvideo.mp4',
						is_carousel_item: true,
						caption: 'Video in carousel',
						alt_text: undefined,
						location_id: undefined,
						user_tags: undefined,
						product_tags: undefined,
					},
				},
			);
		});

		it('carouselPost creates a carousel container', async () => {
			const input = {
				ig_id: 'ig123',
				children: ['item1', 'item2'],
				media_type: 'CAROUSEL',
				caption: 'Carousel post',
			};

			await carouselPost(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media',
				mockContext,
				{
					method: 'POST',
					body: {
						media_type: 'CAROUSEL',
						caption: 'Carousel post',
						share_to_feed: undefined,
						collaborators: undefined,
						location_id: undefined,
						product_tags: undefined,
						children: JSON.stringify(['item1', 'item2']),
					},
				},
			);
		});
	});

	// ─── Publish Handlers ─────────────────────────────────────────────────────

	describe('publish handlers', () => {
		it('publish publishes container and retrieves media details', async () => {
			const input = {
				ig_id: 'ig123',
				creation_id: 'container123',
			};

			await publishMedia(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media_publish',
				mockContext,
				{
					method: 'POST',
					body: { creation_id: 'container123' },
				},
			);
			expect(mockContext.endpoints.media.get).toHaveBeenCalledWith({
				media_id: 'mock-response-id',
			});
		});

		it('createPost publishes post', async () => {
			const input = { ig_id: 'ig123', creation_id: 'container123' };

			await createPost(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media_publish',
				mockContext,
				{
					method: 'POST',
					body: { creation_id: 'container123' },
				},
			);
		});

		it('publishIgUserMedia publishes user media', async () => {
			const input = { ig_id: 'ig123', creation_id: 'container123' };

			await publishIgUserMedia(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/ig123/media_publish',
				mockContext,
				{
					method: 'POST',
					body: { creation_id: 'container123' },
				},
			);
		});
	});

	// ─── Comments Handlers ────────────────────────────────────────────────────

	describe('comments handlers', () => {
		it('list retrieves comments with pagination and saves to db', async () => {
			const input = {
				media_id: 'media123',
				q: 'id,text',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await listComments(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/media123/comments',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,text',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
			expect(mockContext.db.comments.upsertByEntityId).toHaveBeenCalled();
		});

		it('reply posts a reply to comment', async () => {
			const input = { comment_id: 'comment123', message: 'Hello reply' };

			await replyComments(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/comment123/replies',
				mockContext,
				{
					method: 'POST',
					body: { message: 'Hello reply' },
				},
			);
		});

		it('send posts a top-level comment', async () => {
			const input = { media_id: 'media123', message: 'Great post!' };

			await sendComments(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/media123/comments',
				mockContext,
				{
					method: 'POST',
					body: { message: 'Great post!' },
				},
			);
		});

		it('get retrieves comment details and upserts to db', async () => {
			const input = { comment_id: 'comment123', q: 'id,text,username' };

			await getCommentsDetails(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/comment123',
				mockContext,
				{
					method: 'GET',
					query: { fields: 'id,text,username' },
				},
			);
			expect(mockContext.db.comments.upsertByEntityId).toHaveBeenCalled();
		});

		it('update hides/unhides comment', async () => {
			const input = { comment_id: 'comment123', hide: true };

			await updateComments(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/comment123',
				mockContext,
				{
					method: 'POST',
					body: { hide: true },
				},
			);
		});

		it('remove deletes comment and removes from db', async () => {
			const input = { comment_id: 'comment123' };

			await deleteComment(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/comment123',
				mockContext,
				{
					method: 'DELETE',
				},
			);
			expect(mockContext.db.comments.deleteByEntityId).toHaveBeenCalledWith(
				'comment123',
			);
		});

		it('getReplies retrieves replies with pagination', async () => {
			const input = {
				comment_id: 'comment123',
				fields: 'id,text',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			await getReplies(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/comment123/replies',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,text',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
			);
		});

		it('postReplies posts a reply', async () => {
			const input = { comment_id: 'comment123', message: 'Reply text' };

			await postReplies(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/comment123/replies',
				mockContext,
				{
					method: 'POST',
					body: { message: 'Reply text' },
				},
			);
		});

		it('postComments posts comment to media', async () => {
			const input = { media_id: 'media123', message: 'Comment text' };

			await postComments(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/media123/comments',
				mockContext,
				{
					method: 'POST',
					body: { message: 'Comment text' },
				},
			);
		});

		it('replyToComment posts reply (deprecated)', async () => {
			const input = { comment_id: 'comment123', message: 'Deprecated reply' };

			await replyToComment(mockContext, input);

			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/comment123/replies',
				mockContext,
				{
					method: 'POST',
					body: { message: 'Deprecated reply' },
				},
			);
		});
	});

	// ─── Conversations Handlers ──────────────────────────────────────────────

	describe('conversations handlers', () => {
		it('list retrieves conversations with pagination and page token', async () => {
			const input = {
				page_id: 'page123',
				q: 'id,updated_time',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			const result = await listConversations(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'page123/conversations',
				mockContext,
				{
					method: 'GET',
					query: {
						platform: 'instagram',
						fields: 'id,updated_time',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
				expect.any(Function),
			);
			expect(mockContext.db.conversations.upsertByEntityId).toHaveBeenCalled();
			expect((result as any).token).toBe('test-page-token');
		});

		it('get retrieves conversation messages with pagination', async () => {
			const input = {
				page_id: 'page123',
				conversation_id: 'conv123',
				q: 'id,message',
				after: 'cursor_a',
				before: 'cursor_b',
			};

			const result = await getConversationMessages(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/conv123/messages',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,message',
						after: 'cursor_a',
						before: 'cursor_b',
					},
				},
				expect.any(Function),
			);
			expect(mockContext.db.messages.upsertByEntityId).toHaveBeenCalled();
			expect((result as any).token).toBe('test-page-token');
		});

		it('getConversation resolves page token and calls endpoint', async () => {
			const input = {
				page_id: 'page123',
				conversation_id: 'conv123',
				fields: 'id,updated_time',
			};

			const result = await getConversation(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/conv123',
				mockContext,
				{
					method: 'GET',
					query: { fields: 'id,updated_time' },
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});

		it('pageConversations resolves page token and forwards pagination', async () => {
			const input = {
				page_id: 'page123',
				platform: 'instagram',
				after: 'after_cursor',
				before: 'before_cursor',
			};

			const result = await pageConversations(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/page123/conversations',
				mockContext,
				{
					method: 'GET',
					query: {
						platform: 'instagram',
						after: 'after_cursor',
						before: 'before_cursor',
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});

		it('listAllConversations resolves page token and forwards pagination', async () => {
			const input = {
				page_id: 'page123',
				after: 'after_cursor',
				before: 'before_cursor',
			};

			const result = await listAllConversations(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/page123/conversations',
				mockContext,
				{
					method: 'GET',
					query: {
						platform: 'instagram',
						after: 'after_cursor',
						before: 'before_cursor',
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});
	});

	// ─── Messages Handlers ───────────────────────────────────────────────────

	describe('messages handlers', () => {
		it('get retrieves a single message', async () => {
			const input = {
				page_id: 'page123',
				message_id: 'msg123',
				q: 'id,message,from',
			};

			const result = await getMessage(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/msg123',
				mockContext,
				{
					method: 'GET',
					query: { fields: 'id,message,from' },
				},
				expect.any(Function),
			);
			expect(mockContext.db.messages.upsertByEntityId).toHaveBeenCalled();
			expect((result as any).token).toBe('test-page-token');
		});

		it('send sends a message with recipient and payload', async () => {
			const input = {
				page_id: 'page123',
				recipient: 'recip123',
				message: { text: 'Hello' },
			};

			const result = await sendMessage(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/me/messages',
				mockContext,
				{
					method: 'POST',
					body: {
						recipient: { id: 'recip123' },
						message: { text: 'Hello' },
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});

		it('listAllMessages resolves page token and forwards pagination', async () => {
			const input = {
				page_id: 'page123',
				conversation_id: 'conv123',
				fields: 'id,message',
				after: 'after_cursor',
				before: 'before_cursor',
			};

			const result = await listAllMessages(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/conv123/messages',
				mockContext,
				{
					method: 'GET',
					query: {
						fields: 'id,message',
						after: 'after_cursor',
						before: 'before_cursor',
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});

		it('markSeen resolves page token and sends POST request', async () => {
			const input = {
				page_id: 'page123',
				recipient_id: 'recipient123',
			};

			const result = await markSeen(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/me/messages',
				mockContext,
				{
					method: 'POST',
					body: {
						recipient: { id: 'recipient123' },
						sender_action: 'mark_seen',
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});

		it('sendImage resolves page token and sends attachment POST', async () => {
			const input = {
				page_id: 'page123',
				recipient_id: 'recipient123',
				image_url: 'https://example.com/image.jpg',
			};

			const result = await sendImage(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/me/messages',
				mockContext,
				{
					method: 'POST',
					body: {
						recipient: { id: 'recipient123' },
						message: {
							attachment: {
								type: 'image',
								payload: { url: 'https://example.com/image.jpg' },
							},
						},
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});

		it('sendTextMessage resolves page token and sends text POST', async () => {
			const input = {
				page_id: 'page123',
				recipient_id: 'recipient123',
				message: 'Hello World',
			};

			const result = await sendTextMessage(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/me/messages',
				mockContext,
				{
					method: 'POST',
					body: {
						recipient: { id: 'recipient123' },
						message: { text: 'Hello World' },
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});
	});

	// ─── Messenger Profile Handlers ──────────────────────────────────────────

	describe('messenger profile handlers', () => {
		it('getProfile resolves page token and requests /me/messenger_profile', async () => {
			const input = {
				page_id: 'page123',
				fields: ['persistent_menu', 'ice_breakers', 'greeting'],
			};

			const result = await getProfile(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/me/messenger_profile',
				mockContext,
				{
					method: 'GET',
					query: {
						platform: 'instagram',
						fields: 'persistent_menu,ice_breakers,greeting',
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});

		it('updateProfile resolves page token and sends configuration body including greeting', async () => {
			const input = {
				page_id: 'page123',
				greeting: [
					{
						locale: 'default',
						text: 'Welcome to our service!',
					},
				],
				persistent_menu: [
					{
						locale: 'default',
						composer_input_disabled: false,
						call_to_actions: [
							{ type: 'postback', title: 'Start', payload: 'start' },
						],
					},
				],
				ice_breakers: [{ question: 'Help', payload: 'help' }],
			};

			const result = await updateProfile(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/me/messenger_profile',
				mockContext,
				{
					method: 'POST',
					query: {
						platform: 'instagram',
					},
					body: {
						greeting: input.greeting,
						persistent_menu: input.persistent_menu,
						ice_breakers: input.ice_breakers,
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});

		it('deleteProfile resolves page token and sends DELETE body', async () => {
			const input = {
				page_id: 'page123',
				fields: ['persistent_menu', 'greeting'],
			};

			const result = await deleteProfile(mockContext, input);

			expect(GetFacebookPages).toHaveBeenCalledWith(
				'test-user-token',
				'access_token',
				'page123',
			);
			expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
				'/me/messenger_profile',
				mockContext,
				{
					method: 'DELETE',
					query: {
						platform: 'instagram',
					},
					body: {
						fields: ['persistent_menu', 'greeting'],
					},
				},
				expect.any(Function),
			);
			expect((result as any).token).toBe('test-page-token');
		});
	});
});
