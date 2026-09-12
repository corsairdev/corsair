import { ApiError, request } from 'corsair/http';
import { ChatworkAPIError, makeChatworkRequest } from './client';
import { Account, Members, Messages, Rooms } from './endpoints';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './endpoints/types';
import type { ChatworkContext } from './index';
import { chatwork, chatworkEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function testContext(overrides: Record<string, unknown> = {}): ChatworkContext {
	return {
		key: 'test-token',
		$getAccountId: () => 'test-account-id',
		options: { authType: 'oauth_2' },
		logEvent: jest.fn(),
		db: {},
		...overrides,
	} as unknown as ChatworkContext;
}

describe('Chatwork Plugin Structure', () => {
	it('exposes the plugin definition with all required properties', () => {
		const plugin = chatwork();
		expect(plugin.id).toBe('chatwork');
		expect(plugin.schema).toBeDefined();
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.webhooks).toBeDefined();
		expect(plugin.oauthConfig).toBeDefined();
		expect(plugin.oauthConfig?.providerName).toBe('Chatwork');
		expect(plugin.oauthConfig?.authUrl).toContain('oauth2/login.php');
		expect(plugin.oauthConfig?.tokenUrl).toContain('token');
	});

	it('registers all 7 endpoints with matching schemas and metadata', () => {
		const plugin = chatwork();
		const expectedEndpoints = [
			'account.get',
			'rooms.list',
			'rooms.get',
			'messages.list',
			'messages.get',
			'messages.send',
			'members.list',
		].sort();

		const schemaKeys = Object.keys(chatworkEndpointSchemas).sort();
		const metaKeys = Object.keys(plugin.endpointMeta ?? {}).sort();

		expect(schemaKeys).toEqual(expectedEndpoints);
		expect(metaKeys).toEqual(expectedEndpoints);
	});
});

describe('Chatwork Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('account.get', () => {
		it('retrieves and validates the current user profile', async () => {
			const mockAccount = {
				account_id: 12345,
				room_id: 99999,
				name: 'Taro Chatwork',
				chatwork_id: 'tarocw',
				organization_id: 101,
				organization_name: 'Chatwork Corp',
				department: 'Engineering',
				title: 'Senior Developer',
				url: 'https://example.com',
				introduction: 'Hello from Chatwork',
				mail: 'taro@example.com',
				avatar_image_url: 'https://example.com/avatar.png',
			};

			mockRequest.mockResolvedValueOnce(mockAccount);

			const ctx = testContext();
			const result = await Account.get(ctx, {});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, reqOptions] = mockRequest.mock.calls[0];
			expect(config.HEADERS.Authorization).toBe('Bearer test-token');
			expect(reqOptions.url).toBe('me');
			expect(reqOptions.method).toBe('GET');

			expect(result).toEqual(mockAccount);
			const parsed = ChatworkEndpointOutputSchemas.accountGet.parse(result);
			expect(parsed.account_id).toBe(12345);
		});

		it('supports api_key authentication via X-ChatWorkToken', async () => {
			mockRequest.mockResolvedValueOnce({
				account_id: 54321,
				room_id: 88888,
				name: 'API Key User',
			});

			const ctx = testContext({ options: { authType: 'api_key' } });
			const result = await Account.get(ctx, {});

			const [config] = mockRequest.mock.calls[0];
			expect(config.HEADERS['X-ChatWorkToken']).toBe('test-token');
			expect(config.HEADERS.Authorization).toBeUndefined();
			expect(result.account_id).toBe(54321);
		});
	});

	describe('rooms.list', () => {
		it('lists and validates all rooms', async () => {
			const mockRooms = [
				{
					room_id: 1001,
					name: 'General Chat',
					type: 'group',
					role: 'admin',
					sticky: true,
					unread_num: 3,
					mention_num: 1,
					mytask_num: 0,
					message_num: 250,
					file_num: 12,
					task_num: 4,
					icon_path: 'https://example.com/icon.png',
					last_update_time: 1600000000,
					description: 'General room for everyone',
				},
			];

			mockRequest.mockResolvedValueOnce(mockRooms);

			const ctx = testContext();
			const result = await Rooms.list(ctx, {});

			expect(result).toHaveLength(1);
			expect(result[0]!.name).toBe('General Chat');
			const parsed = ChatworkEndpointOutputSchemas.roomsList.parse(result);
			expect(parsed[0]!.room_id).toBe(1001);
		});
	});

	describe('rooms.get', () => {
		it('retrieves and validates a single room by room_id', async () => {
			const mockRoom = {
				room_id: 1001,
				name: 'Development Room',
				type: 'group',
				role: 'member',
				sticky: false,
				unread_num: 0,
				mention_num: 0,
				mytask_num: 0,
				message_num: 50,
				file_num: 2,
				task_num: 1,
				icon_path: 'https://example.com/icon2.png',
				last_update_time: 1600000100,
				description: 'Project dev room',
			};

			mockRequest.mockResolvedValueOnce(mockRoom);

			const ctx = testContext();
			const input = { room_id: 1001 };
			ChatworkEndpointInputSchemas.roomsGet.parse(input);

			const result = await Rooms.get(ctx, input);

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.url).toBe('rooms/1001');
			expect(result.name).toBe('Development Room');
			ChatworkEndpointOutputSchemas.roomsGet.parse(result);
		});
	});

	describe('messages.list', () => {
		it('lists messages for a room with force=1', async () => {
			const mockMessages = [
				{
					message_id: 'msg-1',
					account: {
						account_id: 123,
						name: 'Alice',
						avatar_image_url: 'https://example.com/alice.png',
					},
					body: 'Hello team!',
					send_time: 1600000001,
					update_time: 0,
				},
			];

			mockRequest.mockResolvedValueOnce(mockMessages);

			const ctx = testContext();
			const input = { room_id: 1001, force: 1 as const };
			ChatworkEndpointInputSchemas.messagesList.parse(input);

			const result = await Messages.list(ctx, input);

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.url).toBe('rooms/1001/messages');
			expect(reqOptions.query).toEqual({ force: 1 });
			expect(result).toHaveLength(1);
			ChatworkEndpointOutputSchemas.messagesList.parse(result);
		});

		it('handles HTTP 204 No Content gracefully by returning an empty array', async () => {
			// When Chatwork returns 204, corsair/http request returns undefined
			mockRequest.mockResolvedValueOnce(undefined);

			const ctx = testContext();
			const result = await Messages.list(ctx, { room_id: 1001 });

			expect(result).toEqual([]);
			const parsed = ChatworkEndpointOutputSchemas.messagesList.parse(result);
			expect(parsed).toEqual([]);
		});
	});

	describe('messages.get', () => {
		it('retrieves a single message by ID', async () => {
			const mockMessage = {
				message_id: 'msg-42',
				account: {
					account_id: 456,
					name: 'Bob',
				},
				body: 'Single message content',
				send_time: 1600000500,
				update_time: 1600000600,
			};

			mockRequest.mockResolvedValueOnce(mockMessage);

			const ctx = testContext();
			const input = { room_id: 1001, message_id: 'msg-42' };
			ChatworkEndpointInputSchemas.messagesGet.parse(input);

			const result = await Messages.get(ctx, input);

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.url).toBe('rooms/1001/messages/msg-42');
			expect(result.message_id).toBe('msg-42');
			ChatworkEndpointOutputSchemas.messagesGet.parse(result);
		});
	});

	describe('messages.send', () => {
		it('sends a message using application/x-www-form-urlencoded', async () => {
			mockRequest.mockResolvedValueOnce({ message_id: 'new-msg-99' });

			const ctx = testContext();
			const input = {
				room_id: 1001,
				body: 'New urgent message',
				self_unread: 1 as const,
			};
			ChatworkEndpointInputSchemas.messagesSend.parse(input);

			const result = await Messages.send(ctx, input);

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.url).toBe('rooms/1001/messages');
			expect(reqOptions.method).toBe('POST');
			expect(reqOptions.mediaType).toBe('application/x-www-form-urlencoded');
			expect(reqOptions.body).toBe('body=New+urgent+message&self_unread=1');

			expect(result.message_id).toBe('new-msg-99');
			ChatworkEndpointOutputSchemas.messagesSend.parse(result);
		});

		it('formats boolean self_unread as 1 or 0', async () => {
			mockRequest.mockResolvedValueOnce({ message_id: 'new-msg-100' });

			const ctx = testContext();
			await Messages.send(ctx, {
				room_id: 1001,
				body: 'Test boolean unread',
				self_unread: true,
			});

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.body).toBe('body=Test+boolean+unread&self_unread=1');
		});
	});

	describe('members.list', () => {
		it('retrieves and validates members list for a room', async () => {
			const mockMembers = [
				{
					account_id: 1,
					role: 'admin',
					name: 'Admin User',
					chatwork_id: 'admin_cw',
					organization_id: 10,
					organization_name: 'Corp',
					department: 'Management',
					avatar_image_url: 'https://example.com/admin.png',
				},
				{
					account_id: 2,
					role: 'member',
					name: 'Normal Member',
				},
			];

			mockRequest.mockResolvedValueOnce(mockMembers);

			const ctx = testContext();
			const input = { room_id: 1001 };
			ChatworkEndpointInputSchemas.membersList.parse(input);

			const result = await Members.list(ctx, input);

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.url).toBe('rooms/1001/members');
			expect(result).toHaveLength(2);
			ChatworkEndpointOutputSchemas.membersList.parse(result);
		});
	});

	describe('Error and Rate Limit Handling', () => {
		it('extracts error messages from Chatwork error response format', async () => {
			const apiError = new ApiError(
				{ method: 'GET', url: 'me' },
				{
					status: 401,
					statusText: 'Unauthorized',
					ok: false,
					body: { errors: ['Invalid API token', 'Token expired'] },
					url: 'https://api.chatwork.com/v2/me',
				},
				'HTTP Error',
			);

			mockRequest.mockRejectedValueOnce(apiError);

			await expect(makeChatworkRequest('me', 'bad-token')).rejects.toThrow(
				'Invalid API token, Token expired',
			);
		});

		it('preserves status and retryAfter on rate limit 429', async () => {
			const rateLimitError = new ApiError(
				{ method: 'GET', url: 'rooms' },
				{
					status: 429,
					statusText: 'Too Many Requests',
					ok: false,
					body: { errors: ['Rate limit exceeded'] },
					url: 'https://api.chatwork.com/v2/rooms',
				},
				'Too Many Requests',
				{ retryAfter: 60 },
			);

			mockRequest.mockRejectedValueOnce(rateLimitError);

			try {
				await makeChatworkRequest('rooms', 'valid-token');
				fail('Expected error to be thrown');
			} catch (err) {
				expect(err).toBeInstanceOf(ChatworkAPIError);
				const cwError = err as ChatworkAPIError;
				expect(cwError.status).toBe(429);
				expect(cwError.retryAfter).toBe(60);
				expect(cwError.errors).toEqual(['Rate limit exceeded']);
			}
		});
	});
});
