import * as client from './client';
import { post as carouselPost } from './endpoints/carousel';
import {
	get as getComment,
	getReplies,
	list as listComments,
	remove as removeComment,
	reply as replyComment,
	send as sendComment,
	update as updateComment,
} from './endpoints/comments';
import {
	getConversation,
	get as getConversationMessages,
	list as listConversations,
} from './endpoints/conversations';
import { post as imagePost, story as imageStory } from './endpoints/image';
import {
	get as getMedia,
	list as listMedia,
	children as mediaChildren,
	insights as mediaInsights,
	status as mediaStatus,
} from './endpoints/media';
import {
	get as getMessage,
	markSeen,
	sendImage,
	send as sendMessage,
} from './endpoints/messages';
import {
	deleteProfile,
	getProfile,
	updateProfile,
} from './endpoints/messenger-profile';
import { GetFacebookPages } from './endpoints/meta-data-endpoints';
import {
	insights as accountInsights,
	contentPublishingLimit,
	get as getProfileUser,
	liveMedia,
	replyMentions,
	stories,
	tags,
} from './endpoints/profile';
import { publish } from './endpoints/publish-content';
import { post as reelPost } from './endpoints/reel';
import {
	container as videoContainer,
	story as videoStory,
} from './endpoints/video';

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeAuthenticatedInstagramRequest: jest.fn(),
	};
});

jest.mock('./endpoints/meta-data-endpoints', () => ({
	GetFacebookPages: jest.fn(),
}));

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return {
		...actual,
		logEventFromContext: jest.fn().mockResolvedValue(undefined),
	};
});

describe('Instagram endpoints not on main', () => {
	const mockContext = {
		key: 'test-user-token',
		db: {
			users: { upsertByEntityId: jest.fn() },
			media: { upsertByEntityId: jest.fn() },
			comments: {
				upsertByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			conversations: { upsertByEntityId: jest.fn() },
			messages: { upsertByEntityId: jest.fn() },
		},
		endpoints: {
			media: { get: jest.fn().mockResolvedValue({ id: 'published-id' }) },
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(GetFacebookPages as jest.Mock).mockResolvedValue({
			access_token: 'test-page-token',
		});
		(client.makeAuthenticatedInstagramRequest as jest.Mock).mockImplementation(
			async (_endpoint, ctx, _options, getToken) => {
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

	it('contentPublishingLimit hits /content_publishing_limit', async () => {
		await contentPublishingLimit(mockContext as never, { ig_id: 'ig123' });
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/content_publishing_limit',
			mockContext,
			{
				method: 'GET',
				query: { fields: 'config,quota_usage' },
			},
		);
	});

	it('liveMedia forwards pagination cursors', async () => {
		await liveMedia(mockContext as never, {
			ig_id: 'ig123',
			fields: 'id,media_type',
			after: 'cursor_a',
			before: 'cursor_b',
		});
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

	it('stories hits /stories', async () => {
		await stories(mockContext as never, {
			ig_id: 'ig123',
			fields: 'id,media_url',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/stories',
			mockContext,
			{
				method: 'GET',
				query: {
					fields: 'id,media_url',
					after: undefined,
					before: undefined,
				},
			},
		);
	});

	it('tags hits /tags', async () => {
		await tags(mockContext as never, { ig_id: 'ig123', fields: 'id,username' });
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/tags',
			mockContext,
			{
				method: 'GET',
				query: {
					fields: 'id,username',
					after: undefined,
					before: undefined,
				},
			},
		);
	});

	it('replyMentions posts to /{mention_id}/comments', async () => {
		await replyMentions(mockContext as never, {
			mention_id: 'mention123',
			message: 'Thanks!',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/mention123/comments',
			mockContext,
			{
				method: 'POST',
				body: { message: 'Thanks!' },
			},
		);
	});

	it('media children hits /{media_id}/children', async () => {
		await mediaChildren(mockContext as never, {
			media_id: 'media123',
			fields: 'id,media_type',
			after: 'cursor_a',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/media123/children',
			mockContext,
			{
				method: 'GET',
				query: {
					fields: 'id,media_type',
					after: 'cursor_a',
					before: undefined,
				},
			},
		);
	});

	it('getReplies hits /{comment_id}/replies', async () => {
		await getReplies(mockContext as never, {
			comment_id: 'comment123',
			fields: 'id,text',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/comment123/replies',
			mockContext,
			{
				method: 'GET',
				query: {
					fields: 'id,text',
					after: undefined,
					before: undefined,
				},
			},
		);
	});

	it('getConversation resolves a page token', async () => {
		const result = await getConversation(mockContext as never, {
			page_id: 'page123',
			conversation_id: 'conv123',
			fields: 'id,updated_time',
		});
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
		expect(result).toEqual(
			expect.objectContaining({ token: 'test-page-token' }),
		);
	});

	it('markSeen posts sender_action', async () => {
		await markSeen(mockContext as never, {
			page_id: 'page123',
			recipient_id: 'recipient123',
		});
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
	});

	it('sendImage posts an image attachment', async () => {
		await sendImage(mockContext as never, {
			page_id: 'page123',
			recipient_id: 'recipient123',
			image_url: 'https://example.com/image.jpg',
		});
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
	});

	it('getProfile requests messenger_profile with platform=instagram', async () => {
		await getProfile(mockContext as never, {
			page_id: 'page123',
			fields: ['persistent_menu', 'ice_breakers'],
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/me/messenger_profile',
			mockContext,
			{
				method: 'GET',
				query: {
					platform: 'instagram',
					fields: 'persistent_menu,ice_breakers',
				},
			},
			expect.any(Function),
		);
	});

	it('updateProfile posts ice_breakers and persistent_menu', async () => {
		await updateProfile(mockContext as never, {
			page_id: 'page123',
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
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/me/messenger_profile',
			mockContext,
			{
				method: 'POST',
				query: { platform: 'instagram' },
				body: {
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
				},
			},
			expect.any(Function),
		);
	});

	it('deleteProfile sends DELETE with fields body', async () => {
		await deleteProfile(mockContext as never, {
			page_id: 'page123',
			fields: ['persistent_menu'],
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/me/messenger_profile',
			mockContext,
			{
				method: 'DELETE',
				query: { platform: 'instagram' },
				body: { fields: ['persistent_menu'] },
			},
			expect.any(Function),
		);
	});
});

describe('Instagram endpoints already on main', () => {
	const mockContext = {
		key: 'test-user-token',
		db: {
			users: { upsertByEntityId: jest.fn() },
			media: { upsertByEntityId: jest.fn() },
			comments: {
				upsertByEntityId: jest.fn(),
				deleteByEntityId: jest.fn(),
			},
			conversations: { upsertByEntityId: jest.fn() },
			messages: { upsertByEntityId: jest.fn() },
		},
		endpoints: {
			media: { get: jest.fn().mockResolvedValue({ id: 'published-id' }) },
		},
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(GetFacebookPages as jest.Mock).mockResolvedValue({
			access_token: 'test-page-token',
		});
		(client.makeAuthenticatedInstagramRequest as jest.Mock).mockImplementation(
			async (_endpoint, ctx, _options, getToken) => {
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

	it('profile.get hits /{ig_id}', async () => {
		await getProfileUser(mockContext as never, {
			ig_id: 'ig123',
			q: 'id,username',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123',
			mockContext,
			{ method: 'GET', query: { fields: 'id,username' } },
		);
	});

	it('profile.insights hits /insights', async () => {
		await accountInsights(mockContext as never, {
			ig_id: 'ig123',
			metric: 'reach',
			period: 'day',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/insights',
			mockContext,
			{
				method: 'GET',
				query: {
					metric: 'reach',
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

	it('media.list hits {ig_id}/media', async () => {
		await listMedia(mockContext as never, { ig_id: 'ig123', q: 'id' });
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'ig123/media',
			mockContext,
			{
				method: 'GET',
				query: { fields: 'id', after: undefined, before: undefined },
			},
		);
	});

	it('media.get hits /{media_id}', async () => {
		await getMedia(mockContext as never, { media_id: 'media123', q: 'id' });
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/media123',
			mockContext,
			{ method: 'GET', query: { fields: 'id' } },
		);
	});

	it('media.status requests status_code', async () => {
		await mediaStatus(mockContext as never, { container_id: 'c123' });
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/c123',
			mockContext,
			{ method: 'GET', query: { fields: 'status_code' } },
		);
	});

	it('media.insights uses default metrics for type', async () => {
		await mediaInsights(mockContext as never, {
			media_id: 'media123',
			type: 'IMAGE',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/media123/insights',
			mockContext,
			{ method: 'GET', query: { metric: expect.any(String) } },
		);
	});

	it('image.post creates an image container', async () => {
		await imagePost(mockContext as never, {
			ig_id: 'ig123',
			image_url: 'https://example.com/a.jpg',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/media',
			mockContext,
			{
				method: 'POST',
				body: expect.objectContaining({
					image_url: 'https://example.com/a.jpg',
				}),
			},
		);
	});

	it('image.story sets media_type STORIES', async () => {
		await imageStory(mockContext as never, {
			ig_id: 'ig123',
			image_url: 'https://example.com/a.jpg',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/media',
			mockContext,
			{
				method: 'POST',
				body: {
					image_url: 'https://example.com/a.jpg',
					media_type: 'STORIES',
					user_tags: undefined,
				},
			},
		);
	});

	it('reel.post creates a reel container', async () => {
		await reelPost(mockContext as never, {
			ig_id: 'ig123',
			video_url: 'https://example.com/a.mp4',
			media_type: 'REELS',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/media',
			mockContext,
			{
				method: 'POST',
				body: expect.objectContaining({
					media_type: 'REELS',
					video_url: 'https://example.com/a.mp4',
				}),
			},
		);
	});

	it('video.story sets media_type STORIES', async () => {
		await videoStory(mockContext as never, {
			ig_id: 'ig123',
			video_url: 'https://example.com/a.mp4',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/media',
			mockContext,
			{
				method: 'POST',
				body: {
					video_url: 'https://example.com/a.mp4',
					media_type: 'STORIES',
					user_tags: undefined,
				},
			},
		);
	});

	it('video.container creates a carousel video item', async () => {
		await videoContainer(mockContext as never, {
			ig_id: 'ig123',
			video_url: 'https://example.com/a.mp4',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/media',
			mockContext,
			{
				method: 'POST',
				body: expect.objectContaining({
					media_type: 'VIDEO',
					video_url: 'https://example.com/a.mp4',
					is_carousel_item: true,
				}),
			},
		);
	});

	it('carousel.post stringifies children', async () => {
		await carouselPost(mockContext as never, {
			ig_id: 'ig123',
			media_type: 'CAROUSEL',
			children: ['c1', 'c2'],
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/media',
			mockContext,
			{
				method: 'POST',
				body: expect.objectContaining({
					media_type: 'CAROUSEL',
					children: JSON.stringify(['c1', 'c2']),
				}),
			},
		);
	});

	it('publish hits /media_publish', async () => {
		await publish(mockContext as never, {
			ig_id: 'ig123',
			creation_id: 'c123',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/ig123/media_publish',
			mockContext,
			{ method: 'POST', body: { creation_id: 'c123' } },
		);
	});

	it('conversations.list uses platform=instagram', async () => {
		await listConversations(mockContext as never, { page_id: 'page123' });
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'page123/conversations',
			mockContext,
			{
				method: 'GET',
				query: {
					platform: 'instagram',
					fields: undefined,
					after: undefined,
					before: undefined,
				},
			},
			expect.any(Function),
		);
	});

	it('conversations.get hits /messages', async () => {
		await getConversationMessages(mockContext as never, {
			page_id: 'page123',
			conversation_id: 'conv123',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/conv123/messages',
			mockContext,
			{
				method: 'GET',
				query: { fields: undefined, after: undefined, before: undefined },
			},
			expect.any(Function),
		);
	});

	it('messages.get hits /{message_id}', async () => {
		await getMessage(mockContext as never, {
			page_id: 'page123',
			message_id: 'msg123',
			q: 'id,message',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/msg123',
			mockContext,
			{ method: 'GET', query: { fields: 'id,message' } },
			expect.any(Function),
		);
	});

	it('messages.send posts recipient and message', async () => {
		await sendMessage(mockContext as never, {
			page_id: 'page123',
			recipient: 'igsid123',
			message: { text: 'hi' },
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/me/messages',
			mockContext,
			{
				method: 'POST',
				body: {
					recipient: { id: 'igsid123' },
					message: { text: 'hi' },
				},
			},
			expect.any(Function),
		);
	});

	it('comments.list hits /comments', async () => {
		await listComments(mockContext as never, { media_id: 'media123' });
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/media123/comments',
			mockContext,
			{
				method: 'GET',
				query: { fields: undefined, after: undefined, before: undefined },
			},
		);
	});

	it('comments.reply posts to /replies', async () => {
		await replyComment(mockContext as never, {
			comment_id: 'c123',
			message: 'thanks',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/c123/replies',
			mockContext,
			{ method: 'POST', body: { message: 'thanks' } },
		);
	});

	it('comments.send posts to /comments', async () => {
		await sendComment(mockContext as never, {
			media_id: 'media123',
			message: 'nice',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/media123/comments',
			mockContext,
			{ method: 'POST', body: { message: 'nice' } },
		);
	});

	it('comments.get hits /{comment_id}', async () => {
		await getComment(mockContext as never, {
			comment_id: 'c123',
			q: 'id,text',
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/c123',
			mockContext,
			{ method: 'GET', query: { fields: 'id,text' } },
		);
	});

	it('comments.update hides a comment', async () => {
		await updateComment(mockContext as never, {
			comment_id: 'c123',
			hide: true,
		});
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/c123',
			mockContext,
			{ method: 'POST', body: { hide: true } },
		);
	});

	it('comments.remove DELETEs the comment', async () => {
		await removeComment(mockContext as never, { comment_id: 'c123' });
		expect(client.makeAuthenticatedInstagramRequest).toHaveBeenCalledWith(
			'/c123',
			mockContext,
			{ method: 'DELETE' },
		);
	});
});
