import { createCorsair } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { ChatworkAPIError, makeChatworkRequest } from './client';
import {
	ChatworkEndpointInputSchemas,
	ChatworkEndpointOutputSchemas,
} from './endpoints/types';
import { chatwork, chatworkEndpointSchemas } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

// Safe: jest.mock above replaces request with a jest.fn.
// A narrower type is not practical because the real request type has no mock API.
const mockRequest = request as jest.Mock;

async function createClient(options: Parameters<typeof chatwork>[0] = {}) {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'chatwork', 'default');
	const corsair = createCorsair({
		plugins: [chatwork({ key: 'test-token', ...options })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

type Client = Awaited<ReturnType<typeof createClient>>['corsair'];
type ChatworkApi = Client['chatwork']['api'];

let client: Client;
let api: ChatworkApi;
let cleanup: () => void;

beforeEach(async () => {
	jest.resetAllMocks();
	const created = await createClient();
	client = created.corsair;
	api = client.chatwork.api;
	cleanup = created.testDb.cleanup;
});

afterEach(() => cleanup());

describe('Chatwork Plugin Structure', () => {
	it('exposes the plugin definition with all required properties', () => {
		const plugin = chatwork();
		expect(plugin.id).toBe('chatwork');
		expect(plugin.schema).toBeDefined();
		expect(plugin.endpoints).toBeDefined();
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.oauthConfig).toBeDefined();
		expect(plugin.oauthConfig?.providerName).toBe('Chatwork');
		expect(plugin.oauthConfig?.authUrl).toContain('oauth2/login.php');
		expect(plugin.oauthConfig?.tokenUrl).toContain('token');
	});

	it('registers all 30 endpoints with matching schemas and metadata', () => {
		const plugin = chatwork();
		const expectedEndpoints = [
			'account.get',
			'account.getStatus',
			'account.listTasks',
			'contacts.list',
			'contacts.listIncomingRequests',
			'rooms.list',
			'rooms.get',
			'rooms.create',
			'rooms.update',
			'rooms.delete',
			'links.get',
			'links.create',
			'links.update',
			'links.delete',
			'messages.list',
			'messages.get',
			'messages.send',
			'messages.update',
			'messages.delete',
			'messages.markRead',
			'messages.markUnread',
			'members.list',
			'members.update',
			'tasks.list',
			'tasks.get',
			'tasks.create',
			'tasks.updateStatus',
			'files.list',
			'files.get',
			'files.upload',
		].sort();

		const schemaKeys = Object.keys(chatworkEndpointSchemas).sort();
		const metaKeys = Object.keys(plugin.endpointMeta ?? {}).sort();

		expect(schemaKeys).toEqual(expectedEndpoints);
		expect(metaKeys).toEqual(expectedEndpoints);
	});
});

describe('Chatwork Endpoints', () => {
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

			const result = await api.account.get({});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, reqOptions] = mockRequest.mock.calls[0];
			expect(config.HEADERS['X-ChatWorkToken']).toBe('test-token');
			expect(config.TOKEN).toBeUndefined();
			expect(reqOptions.url).toBe('me');
			expect(reqOptions.method).toBe('GET');

			expect(result).toEqual(mockAccount);
			const parsed = ChatworkEndpointOutputSchemas.accountGet.parse(result);
			expect(parsed.account_id).toBe(12345);
		});

		it('sends the OAuth token as a bearer token when authType is oauth_2', async () => {
			cleanup();
			const created = await createClient({ authType: 'oauth_2' });
			cleanup = created.testDb.cleanup;
			mockRequest.mockResolvedValueOnce({
				account_id: 1,
				room_id: 2,
				name: 'OAuth User',
			});

			await created.corsair.chatwork.api.account.get({});

			const [config] = mockRequest.mock.calls[0];
			expect(config.TOKEN).toBe('test-token');
			expect(config.HEADERS['X-ChatWorkToken']).toBeUndefined();
		});

		it('supports api_key authentication via X-ChatWorkToken', async () => {
			mockRequest.mockResolvedValueOnce({
				account_id: 54321,
				room_id: 88888,
				name: 'API Key User',
			});

			const result = await api.account.get({});

			const [config] = mockRequest.mock.calls[0];
			expect(config.HEADERS['X-ChatWorkToken']).toBe('test-token');
			expect(config.TOKEN).toBeUndefined();
			expect(result.account_id).toBe(54321);
		});
	});

	it('validates endpoint input at runtime', async () => {
		await expect(
			api.rooms.get({
				room_id: 0,
			}),
		).rejects.toThrow();
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

			const result = await api.rooms.list({});

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

			const input = { room_id: 1001 };
			ChatworkEndpointInputSchemas.roomsGet.parse(input);

			const result = await api.rooms.get(input);

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

			const input = { room_id: 1001, force: 1 as const };
			ChatworkEndpointInputSchemas.messagesList.parse(input);

			const result = await api.messages.list(input);

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.url).toBe('rooms/1001/messages');
			expect(reqOptions.query).toEqual({ force: '1' });
			expect(result).toHaveLength(1);
			ChatworkEndpointOutputSchemas.messagesList.parse(result);
		});

		it('returns an empty array on HTTP 204 No Content', async () => {
			mockRequest.mockRejectedValueOnce(
				new ApiError(
					{ method: 'GET', url: 'rooms/1001/messages' },
					{
						status: 204,
						statusText: 'No Content',
						ok: true,
						body: undefined,
						url: 'https://api.chatwork.com/v2/rooms/1001/messages',
					},
					'No Content',
				),
			);

			const result = await api.messages.list({ room_id: 1001 });

			expect(result).toEqual([]);
			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.errors).toEqual({ 204: 'No Content' });
		});

		it('rejects an unparseable body instead of returning an empty array', async () => {
			mockRequest.mockResolvedValueOnce(undefined);

			await expect(api.messages.list({ room_id: 1001 })).rejects.toThrow();
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

			const input = { room_id: 1001, message_id: 'msg-42' };
			ChatworkEndpointInputSchemas.messagesGet.parse(input);

			const result = await api.messages.get(input);

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.url).toBe('rooms/1001/messages/msg-42');
			expect(result.message_id).toBe('msg-42');
			ChatworkEndpointOutputSchemas.messagesGet.parse(result);
		});
	});

	describe('messages.send', () => {
		it('sends a message using application/x-www-form-urlencoded', async () => {
			mockRequest.mockResolvedValueOnce({ message_id: 'new-msg-99' });

			const input = {
				room_id: 1001,
				body: 'New urgent message',
				self_unread: 1 as const,
			};
			ChatworkEndpointInputSchemas.messagesSend.parse(input);

			const result = await api.messages.send(input);

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

			await api.messages.send({
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

			const input = { room_id: 1001 };
			ChatworkEndpointInputSchemas.membersList.parse(input);

			const result = await api.members.list(input);

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.url).toBe('rooms/1001/members');
			expect(result).toHaveLength(2);
			ChatworkEndpointOutputSchemas.membersList.parse(result);
		});
	});

	const taskItem = {
		task_id: 5,
		account: { account_id: 2, name: 'Assignee' },
		assigned_by_account: { account_id: 1, name: 'Assigner' },
		message_id: 'msg-5',
		body: 'Write report',
		limit_time: 1700000000,
		status: 'open',
		limit_type: 'date',
	};
	const fileItem = {
		file_id: 9,
		account: { account_id: 1, name: 'Uploader' },
		message_id: 'msg-9',
		filename: 'report.pdf',
		filesize: 2048,
		upload_time: 1700000000,
	};
	const link = {
		public: true,
		url: 'https://www.chatwork.com/g/team-room',
		need_acceptance: false,
		description: 'Join us',
	};

	type EndpointCase = {
		name: string;
		// Response fixtures are arbitrary JSON per endpoint; test only.
		// Safe: the table only compares results with toEqual.
		// A narrower type is not practical because each case returns a different endpoint shape.
		call: (api: ChatworkApi) => Promise<unknown>;
		// Safe: the table only compares results with toEqual.
		// A narrower type is not practical because each case returns a different endpoint shape.
		response: unknown;
		method: string;
		url: string;
		query?: Record<string, string>;
		form?: Record<string, string>;
		// Expected value is arbitrary JSON compared via toEqual; test only.
		// Safe: the table only compares results with toEqual.
		// A narrower type is not practical because each case returns a different endpoint shape.
		expected?: unknown;
	};

	const cases: EndpointCase[] = [
		{
			name: 'account.getStatus',
			call: (api) => api.account.getStatus({}),
			response: {
				unread_room_num: 2,
				mention_room_num: 1,
				mytask_room_num: 3,
				unread_num: 12,
				mention_num: 1,
				mytask_num: 4,
			},
			method: 'GET',
			url: 'my/status',
		},
		{
			name: 'account.listTasks',
			call: (api) =>
				api.account.listTasks({ assigned_by_account_id: 1, status: 'done' }),
			response: [
				{
					...taskItem,
					account: undefined,
					room: { room_id: 1001, name: 'Team', icon_path: 'icon.png' },
				},
			],
			method: 'GET',
			url: 'my/tasks',
			query: { assigned_by_account_id: '1', status: 'done' },
		},
		{
			name: 'contacts.list',
			call: (api) => api.contacts.list({}),
			response: [{ account_id: 7, room_id: 2002, name: 'Contact' }],
			method: 'GET',
			url: 'contacts',
		},
		{
			name: 'contacts.listIncomingRequests',
			call: (api) => api.contacts.listIncomingRequests({}),
			response: [
				{ request_id: 3, account_id: 8, message: 'Hi', name: 'Requester' },
			],
			method: 'GET',
			url: 'incoming_requests',
		},
		{
			name: 'rooms.create',
			call: (api) =>
				api.rooms.create({
					name: 'Project X',
					members_admin_ids: [1, 2],
					members_member_ids: [3],
					icon_preset: 'meeting',
					link: true,
					link_need_acceptance: false,
				}),
			response: { room_id: 3003 },
			method: 'POST',
			url: 'rooms',
			form: {
				name: 'Project X',
				members_admin_ids: '1,2',
				members_member_ids: '3',
				icon_preset: 'meeting',
				link: '1',
				link_need_acceptance: '0',
			},
		},
		{
			name: 'rooms.update',
			call: (api) =>
				api.rooms.update({
					room_id: 1001,
					name: 'Renamed',
					description: 'New',
				}),
			response: { room_id: 1001 },
			method: 'PUT',
			url: 'rooms/1001',
			form: { name: 'Renamed', description: 'New' },
		},
		{
			name: 'rooms.delete',
			call: (api) => api.rooms.delete({ room_id: 1001, action_type: 'leave' }),
			response: undefined,
			method: 'DELETE',
			url: 'rooms/1001',
			form: { action_type: 'leave' },
			expected: { success: true },
		},
		{
			name: 'links.get',
			call: (api) => api.links.get({ room_id: 1001 }),
			response: link,
			method: 'GET',
			url: 'rooms/1001/link',
		},
		{
			name: 'links.create',
			call: (api) =>
				api.links.create({
					room_id: 1001,
					code: 'team-room',
					need_acceptance: false,
					description: 'Join us',
				}),
			response: link,
			method: 'POST',
			url: 'rooms/1001/link',
			form: { code: 'team-room', need_acceptance: '0', description: 'Join us' },
		},
		{
			name: 'links.update',
			call: (api) => api.links.update({ room_id: 1001, need_acceptance: true }),
			response: { ...link, need_acceptance: true },
			method: 'PUT',
			url: 'rooms/1001/link',
			form: { need_acceptance: '1' },
		},
		{
			name: 'links.delete',
			call: (api) => api.links.delete({ room_id: 1001 }),
			response: { public: false },
			method: 'DELETE',
			url: 'rooms/1001/link',
		},
		{
			name: 'messages.update',
			call: (api) =>
				api.messages.update({
					room_id: 1001,
					message_id: 'msg-1',
					body: 'Edited',
				}),
			response: { message_id: 'msg-1' },
			method: 'PUT',
			url: 'rooms/1001/messages/msg-1',
			form: { body: 'Edited' },
		},
		{
			name: 'messages.delete',
			call: (api) =>
				api.messages.delete({ room_id: 1001, message_id: 'msg-1' }),
			response: { message_id: 'msg-1' },
			method: 'DELETE',
			url: 'rooms/1001/messages/msg-1',
		},
		{
			name: 'messages.markRead',
			call: (api) =>
				api.messages.markRead({ room_id: 1001, message_id: 'msg-1' }),
			response: { unread_num: 0, mention_num: 0 },
			method: 'PUT',
			url: 'rooms/1001/messages/read',
			form: { message_id: 'msg-1' },
		},
		{
			name: 'messages.markUnread',
			call: (api) =>
				api.messages.markUnread({ room_id: 1001, message_id: 'msg-1' }),
			response: { unread_num: 3, mention_num: 1 },
			method: 'PUT',
			url: 'rooms/1001/messages/unread',
			form: { message_id: 'msg-1' },
		},
		{
			name: 'members.update',
			call: (api) =>
				api.members.update({
					room_id: 1001,
					members_admin_ids: [1],
					members_readonly_ids: [4, 5],
				}),
			response: { admin: [1], member: [], readonly: [4, 5] },
			method: 'PUT',
			url: 'rooms/1001/members',
			form: { members_admin_ids: '1', members_readonly_ids: '4,5' },
		},
		{
			name: 'tasks.list',
			call: (api) =>
				api.tasks.list({ room_id: 1001, account_id: 2, status: 'open' }),
			response: [taskItem],
			method: 'GET',
			url: 'rooms/1001/tasks',
			query: { account_id: '2', status: 'open' },
		},
		{
			name: 'tasks.get',
			call: (api) => api.tasks.get({ room_id: 1001, task_id: 5 }),
			response: taskItem,
			method: 'GET',
			url: 'rooms/1001/tasks/5',
		},
		{
			name: 'tasks.create',
			call: (api) =>
				api.tasks.create({
					room_id: 1001,
					body: 'Write report',
					to_ids: [2, 3],
					limit: 1700000000,
					limit_type: 'date',
				}),
			response: { task_ids: [5, 6] },
			method: 'POST',
			url: 'rooms/1001/tasks',
			form: {
				body: 'Write report',
				to_ids: '2,3',
				limit: '1700000000',
				limit_type: 'date',
			},
		},
		{
			name: 'tasks.updateStatus',
			call: (api) =>
				api.tasks.updateStatus({ room_id: 1001, task_id: 5, status: 'done' }),
			response: { task_id: 5 },
			method: 'PUT',
			url: 'rooms/1001/tasks/5/status',
			form: { body: 'done' },
		},
		{
			name: 'files.list',
			call: (api) => api.files.list({ room_id: 1001, account_id: 1 }),
			response: [fileItem],
			method: 'GET',
			url: 'rooms/1001/files',
			query: { account_id: '1' },
		},
		{
			name: 'files.get',
			call: (api) =>
				api.files.get({
					room_id: 1001,
					file_id: 9,
					create_download_url: true,
				}),
			response: { ...fileItem, download_url: 'https://dl.example.com/9' },
			method: 'GET',
			url: 'rooms/1001/files/9',
			query: { create_download_url: '1' },
		},
	];

	it.each(cases)(
		'$name sends $method $url and returns the parsed response',
		async ({ call, response, method, url, query, form, expected }) => {
			mockRequest.mockResolvedValueOnce(response);

			const result = await call(api);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.method).toBe(method);
			expect(reqOptions.url).toBe(url);
			if (query) expect(reqOptions.query).toEqual(query);
			if (form) {
				expect(reqOptions.mediaType).toBe('application/x-www-form-urlencoded');
				expect(
					Object.fromEntries(new URLSearchParams(reqOptions.body)),
				).toEqual(form);
			} else {
				expect(reqOptions.body).toBeUndefined();
			}
			expect(result).toEqual(expected ?? response);
		},
	);

	describe('files.upload', () => {
		it('posts the decoded file as multipart form data', async () => {
			mockRequest.mockResolvedValueOnce({ file_id: 77 });

			const result = await api.files.upload({
				room_id: 1001,
				file_base64: Buffer.from('hello').toString('base64'),
				file_name: 'hello.txt',
				content_type: 'text/plain',
				message: 'See attached',
			});

			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.method).toBe('POST');
			expect(reqOptions.url).toBe('rooms/1001/files');
			expect(reqOptions.mediaType).toBeUndefined();
			expect(reqOptions.body).toBeInstanceOf(FormData);
			// Safe: asserted to be FormData on the previous line.
			// A narrower type is not practical because the mock call record is untyped.
			const body = reqOptions.body as FormData;
			expect(body.get('message')).toBe('See attached');
			// Safe: the upload endpoint appends a File under the "file" key.
			// A narrower type is not practical because FormData.get returns a union with string.
			const file = body.get('file') as File;
			expect(file.name).toBe('hello.txt');
			expect(file.type).toBe('text/plain');
			expect(await file.text()).toBe('hello');
			expect(result).toEqual({ file_id: 77 });
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
				// Safe: instanceof ChatworkAPIError is asserted on the previous line.
				// A narrower type is not practical because the catch variable is typed unknown.
				const cwError = err as ChatworkAPIError;
				expect(cwError.status).toBe(429);
				expect(cwError.retryAfter).toBe(60);
				expect(cwError.errors).toEqual(['Rate limit exceeded']);
			}
		});
	});
});

describe('Chatwork persistence', () => {
	const sender = { account_id: 5, name: 'Bob' };

	it('account.get stores the profile including login_mail', async () => {
		mockRequest.mockResolvedValueOnce({
			account_id: 12,
			room_id: 3,
			name: 'Taro',
			login_mail: 'login@example.com',
		});
		await api.account.get({});

		const row = await client.chatwork.db.accounts.findByEntityId('12');
		expect(row?.data.name).toBe('Taro');
		expect(row?.data.login_mail).toBe('login@example.com');
	});

	it('contacts.list stores each contact as an account', async () => {
		mockRequest.mockResolvedValueOnce([
			{ account_id: 7, room_id: 2002, name: 'Contact' },
		]);
		await api.contacts.list({});

		const row = await client.chatwork.db.accounts.findByEntityId('7');
		expect(row?.data.room_id).toBe(2002);
	});

	it('contacts.listIncomingRequests stores each request', async () => {
		mockRequest.mockResolvedValueOnce([
			{ request_id: 3, account_id: 8, message: 'Hi', name: 'Requester' },
		]);
		await api.contacts.listIncomingRequests({});

		const row = await client.chatwork.db.incomingRequests.findByEntityId('3');
		expect(row?.data.account_id).toBe(8);
		expect(row?.data.message).toBe('Hi');
	});

	it('rooms.get stores the room and rooms.delete removes it', async () => {
		mockRequest.mockResolvedValueOnce({
			room_id: 1001,
			name: 'General',
			type: 'group',
			role: 'admin',
			sticky: false,
			unread_num: 0,
			mention_num: 0,
			mytask_num: 0,
			message_num: 4,
			file_num: 0,
			task_num: 0,
			icon_path: 'https://example.com/g.png',
			last_update_time: 1298905200,
		});
		await api.rooms.get({ room_id: 1001 });
		expect(
			(await client.chatwork.db.rooms.findByEntityId('1001'))?.data.name,
		).toBe('General');

		mockRequest.mockResolvedValueOnce(undefined);
		await api.rooms.delete({ room_id: 1001, action_type: 'leave' });
		expect(await client.chatwork.db.rooms.findByEntityId('1001')).toBeNull();
	});

	it('messages.get stores the message with its room', async () => {
		mockRequest.mockResolvedValueOnce({
			message_id: '5',
			account: sender,
			body: 'Hello',
			send_time: 1384242850,
			update_time: 0,
		});
		await api.messages.get({ room_id: 1001, message_id: '5' });

		const row = await client.chatwork.db.messages.findByEntityId('5');
		expect(row?.data.body).toBe('Hello');
		expect(row?.data.room_id).toBe(1001);
	});

	it('members.list stores members keyed by room and account', async () => {
		mockRequest.mockResolvedValueOnce([
			{ account_id: 5, role: 'admin', name: 'Bob' },
		]);
		await api.members.list({ room_id: 1001 });

		const row = await client.chatwork.db.members.findByEntityId('1001:5');
		expect(row?.data.role).toBe('admin');
	});

	it('tasks.get stores the task', async () => {
		mockRequest.mockResolvedValueOnce({
			task_id: 3,
			account: sender,
			assigned_by_account: sender,
			message_id: '13',
			body: 'buy milk',
			limit_time: 1384354799,
			status: 'open',
			limit_type: 'date',
		});
		await api.tasks.get({ room_id: 1001, task_id: 3 });

		const row = await client.chatwork.db.tasks.findByEntityId('3');
		expect(row?.data.body).toBe('buy milk');
		expect(row?.data.room_id).toBe(1001);
	});

	it('account.listTasks keeps the assignee stored by tasks.get', async () => {
		mockRequest.mockResolvedValueOnce({
			task_id: 3,
			account: sender,
			assigned_by_account: sender,
			message_id: '13',
			body: 'buy milk',
			limit_time: 1384354799,
			status: 'open',
			limit_type: 'date',
		});
		await api.tasks.get({ room_id: 1001, task_id: 3 });

		mockRequest.mockResolvedValueOnce([
			{
				task_id: 3,
				room: { room_id: 1001, name: 'General', icon_path: 'x' },
				assigned_by_account: sender,
				message_id: '13',
				body: 'buy milk',
				limit_time: 1384354799,
				status: 'done',
				limit_type: 'date',
			},
		]);
		await api.account.listTasks({});

		const row = await client.chatwork.db.tasks.findByEntityId('3');
		expect(row?.data.status).toBe('done');
		expect(row?.data.account?.account_id).toBe(5);
	});

	it('files.list stores each file', async () => {
		mockRequest.mockResolvedValueOnce([
			{
				file_id: 9,
				account: sender,
				message_id: '22',
				filename: 'README.md',
				filesize: 2232,
				upload_time: 1384414750,
			},
		]);
		await api.files.list({ room_id: 1001 });

		const row = await client.chatwork.db.files.findByEntityId('9');
		expect(row?.data.filename).toBe('README.md');
		expect(row?.data.room_id).toBe(1001);
	});
});

describe('Chatwork endpoint errors', () => {
	function httpError(status: number, retryAfter?: number) {
		return new ApiError(
			{ method: 'GET', url: 'me' },
			{
				status,
				statusText: 'error',
				ok: false,
				body: { errors: [`status ${status}`] },
				url: 'https://api.chatwork.com/v2/me',
			},
			'HTTP Error',
			retryAfter === undefined ? undefined : { retryAfter },
		);
	}

	it('surfaces a 401 from an endpoint as ChatworkAPIError', async () => {
		mockRequest.mockRejectedValueOnce(httpError(401));
		await expect(api.account.get({})).rejects.toMatchObject({
			name: 'ChatworkAPIError',
			status: 401,
			message: 'status 401',
		});
	});

	it('raises auth-missing when no API key is configured', async () => {
		cleanup();
		const testDb = createTestDatabase();
		await createIntegrationAndAccount(testDb.db, 'chatwork', 'default');
		cleanup = testDb.cleanup;
		const corsair = createCorsair({
			plugins: [chatwork()],
			database: testDb.db,
			kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
		});
		await corsair.chatwork.keys.issue_new_dek();

		await expect(corsair.chatwork.api.account.get({})).rejects.toThrow(
			/auth-missing/,
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('surfaces a 429 with Retry-After from an endpoint', async () => {
		mockRequest.mockRejectedValueOnce(httpError(429, 30));
		await expect(api.rooms.list({})).rejects.toMatchObject({
			status: 429,
			retryAfter: 30,
		});
	});
});
