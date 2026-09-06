import * as client from './client';
import { getReplies } from './endpoints/comments';
import { getConversation } from './endpoints/conversations';
import { children as mediaChildren } from './endpoints/media';
import { markSeen, sendImage } from './endpoints/messages';
import {
	deleteProfile,
	getProfile,
	updateProfile,
} from './endpoints/messenger-profile';
import { GetFacebookPages } from './endpoints/meta-data-endpoints';
import {
	contentPublishingLimit,
	liveMedia,
	replyMentions,
	stories,
	tags,
} from './endpoints/profile';

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
		db: {},
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
					greeting: undefined,
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
