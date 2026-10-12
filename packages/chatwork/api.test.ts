import { ApiError, request } from 'corsair/http';
import { ChatworkAPIError, makeChatworkRequest } from './client';
import {
	Account,
	Contacts,
	Files,
	Links,
	Members,
	Messages,
	Rooms,
	Tasks,
} from './endpoints';
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

// Overrides are merged into the stub context; any shape is fine for tests.
function testContext(overrides: Record<string, unknown> = {}): ChatworkContext {
	// Partial stub with only the fields the endpoints read; test only.
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
	beforeEach(() => {
		jest.resetAllMocks();
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
			expect(config.TOKEN).toBe('test-token');
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
			expect(config.TOKEN).toBeUndefined();
			expect(result.account_id).toBe(54321);
		});
	});

	it('validates endpoint input at runtime', async () => {
		const ctx = testContext();
		await expect(
			Rooms.get(ctx, {
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

			const ctx = testContext();
			const result = await Messages.list(ctx, { room_id: 1001 });

			expect(result).toEqual([]);
			const [, reqOptions] = mockRequest.mock.calls[0];
			expect(reqOptions.errors).toEqual({ 204: 'No Content' });
		});

		it('rejects an unparseable body instead of returning an empty array', async () => {
			mockRequest.mockResolvedValueOnce(undefined);

			const ctx = testContext();
			await expect(Messages.list(ctx, { room_id: 1001 })).rejects.toThrow();
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
		call: (ctx: ChatworkContext) => Promise<unknown>;
		response: unknown;
		method: string;
		url: string;
		query?: Record<string, string>;
		form?: Record<string, string>;
		// Expected value is arbitrary JSON compared via toEqual; test only.
		expected?: unknown;
	};

	const cases: EndpointCase[] = [
		{
			name: 'account.getStatus',
			call: (ctx) => Account.getStatus(ctx, {}),
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
			call: (ctx) =>
				Account.listTasks(ctx, { assigned_by_account_id: 1, status: 'done' }),
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
			call: (ctx) => Contacts.list(ctx, {}),
			response: [{ account_id: 7, room_id: 2002, name: 'Contact' }],
			method: 'GET',
			url: 'contacts',
		},
		{
			name: 'contacts.listIncomingRequests',
			call: (ctx) => Contacts.listIncomingRequests(ctx, {}),
			response: [
				{ request_id: 3, account_id: 8, message: 'Hi', name: 'Requester' },
			],
			method: 'GET',
			url: 'incoming_requests',
		},
		{
			name: 'rooms.create',
			call: (ctx) =>
				Rooms.create(ctx, {
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
			call: (ctx) =>
				Rooms.update(ctx, {
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
			call: (ctx) => Rooms.delete(ctx, { room_id: 1001, action_type: 'leave' }),
			response: undefined,
			method: 'DELETE',
			url: 'rooms/1001',
			form: { action_type: 'leave' },
			expected: { success: true },
		},
		{
			name: 'links.get',
			call: (ctx) => Links.get(ctx, { room_id: 1001 }),
			response: link,
			method: 'GET',
			url: 'rooms/1001/link',
		},
		{
			name: 'links.create',
			call: (ctx) =>
				Links.create(ctx, {
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
			call: (ctx) =>
				Links.update(ctx, { room_id: 1001, need_acceptance: true }),
			response: { ...link, need_acceptance: true },
			method: 'PUT',
			url: 'rooms/1001/link',
			form: { need_acceptance: '1' },
		},
		{
			name: 'links.delete',
			call: (ctx) => Links.delete(ctx, { room_id: 1001 }),
			response: { public: false },
			method: 'DELETE',
			url: 'rooms/1001/link',
		},
		{
			name: 'messages.update',
			call: (ctx) =>
				Messages.update(ctx, {
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
			call: (ctx) =>
				Messages.delete(ctx, { room_id: 1001, message_id: 'msg-1' }),
			response: { message_id: 'msg-1' },
			method: 'DELETE',
			url: 'rooms/1001/messages/msg-1',
		},
		{
			name: 'messages.markRead',
			call: (ctx) =>
				Messages.markRead(ctx, { room_id: 1001, message_id: 'msg-1' }),
			response: { unread_num: 0, mention_num: 0 },
			method: 'PUT',
			url: 'rooms/1001/messages/read',
			form: { message_id: 'msg-1' },
		},
		{
			name: 'messages.markUnread',
			call: (ctx) =>
				Messages.markUnread(ctx, { room_id: 1001, message_id: 'msg-1' }),
			response: { unread_num: 3, mention_num: 1 },
			method: 'PUT',
			url: 'rooms/1001/messages/unread',
			form: { message_id: 'msg-1' },
		},
		{
			name: 'members.update',
			call: (ctx) =>
				Members.update(ctx, {
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
			call: (ctx) =>
				Tasks.list(ctx, { room_id: 1001, account_id: 2, status: 'open' }),
			response: [taskItem],
			method: 'GET',
			url: 'rooms/1001/tasks',
			query: { account_id: '2', status: 'open' },
		},
		{
			name: 'tasks.get',
			call: (ctx) => Tasks.get(ctx, { room_id: 1001, task_id: 5 }),
			response: taskItem,
			method: 'GET',
			url: 'rooms/1001/tasks/5',
		},
		{
			name: 'tasks.create',
			call: (ctx) =>
				Tasks.create(ctx, {
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
			call: (ctx) =>
				Tasks.updateStatus(ctx, { room_id: 1001, task_id: 5, status: 'done' }),
			response: { task_id: 5 },
			method: 'PUT',
			url: 'rooms/1001/tasks/5/status',
			form: { body: 'done' },
		},
		{
			name: 'files.list',
			call: (ctx) => Files.list(ctx, { room_id: 1001, account_id: 1 }),
			response: [fileItem],
			method: 'GET',
			url: 'rooms/1001/files',
			query: { account_id: '1' },
		},
		{
			name: 'files.get',
			call: (ctx) =>
				Files.get(ctx, {
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

			const result = await call(testContext());

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

			const result = await Files.upload(testContext(), {
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
			// Body is known to be FormData for file uploads; asserted with toBeInstanceOf next line.
			const body = reqOptions.body as FormData;
			expect(body).toBeInstanceOf(FormData);
			expect(body.get('message')).toBe('See attached');
			// form field "file" is known to be a File in this test.
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
				// Already asserted instanceof ChatworkAPIError above; cast gives access to status.
				const cwError = err as ChatworkAPIError;
				expect(cwError.status).toBe(429);
				expect(cwError.retryAfter).toBe(60);
				expect(cwError.errors).toEqual(['Rate limit exceeded']);
			}
		});
	});
});
