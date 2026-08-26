import * as client from './client';
import {
	getConversation,
	listAll as listAllConversations,
	pageConversations,
} from './endpoints/conversations';
import {
	listAll as listAllMessages,
	markSeen,
	sendImage,
	sendTextMessage,
} from './endpoints/messages';
import {
	deleteProfile,
	getProfile,
	updateProfile,
} from './endpoints/messenger-profile';
import { GetFacebookPages } from './endpoints/meta-data-endpoints';

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
				};
			},
		);
	});

	// ─── Conversations Handlers ──────────────────────────────────────────────

	describe('conversations handlers', () => {
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
			expect(result.token).toBe('test-page-token');
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
			expect(result.token).toBe('test-page-token');
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
			expect(result.token).toBe('test-page-token');
		});
	});

	// ─── Messages Handlers ───────────────────────────────────────────────────

	describe('messages handlers', () => {
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
			expect(result.token).toBe('test-page-token');
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
			expect(result.token).toBe('test-page-token');
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
			expect(result.token).toBe('test-page-token');
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
			expect(result.token).toBe('test-page-token');
		});
	});

	// ─── Messenger Profile Handlers ──────────────────────────────────────────

	describe('messenger profile handlers', () => {
		it('getProfile resolves page token and requests /me/messenger_profile', async () => {
			const input = {
				page_id: 'page123',
				fields: ['persistent_menu', 'ice_breakers'],
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
						fields: 'persistent_menu,ice_breakers',
					},
				},
				expect.any(Function),
			);
			expect(result.token).toBe('test-page-token');
		});

		it('updateProfile resolves page token and sends configuration body', async () => {
			const input = {
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
						persistent_menu: input.persistent_menu,
						ice_breakers: input.ice_breakers,
					},
				},
				expect.any(Function),
			);
			expect(result.token).toBe('test-page-token');
		});

		it('deleteProfile resolves page token and sends DELETE body', async () => {
			const input = {
				page_id: 'page123',
				fields: ['persistent_menu'],
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
						fields: ['persistent_menu'],
					},
				},
				expect.any(Function),
			);
			expect(result.token).toBe('test-page-token');
		});
	});
});
