import { ApiError, request } from 'corsair/http';
import { SendbirdAPIError } from './client';
import { errorHandlers } from './error-handlers';
import type { SendbirdContext } from './index';
import {
	sendbird,
	sendbirdEndpointMeta,
	sendbirdEndpointSchemas,
} from './index';

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));
const mockRequest = request as jest.Mock;
const ctx = {
	key: 'secret',
	options: { key: 'secret', applicationId: 'app-123' },
} as SendbirdContext;
const groups = (() => {
	const endpoints = sendbird().endpoints;
	if (!endpoints) throw new Error('Sendbird endpoints are not registered');
	return endpoints;
})();
const user = { user_id: 'user 1', nickname: 'A', role: null };
const channel = { channel_url: 'room 1', last_message: null, members: [user] };
const message = { message_id: 42, type: 'MESG', message: 'Hello', user };
const path = { channel_type: 'group_channels' as const, channel_url: 'room 1' };
// A closure retains each endpoint's input/output types even in a heterogeneous table.
function fixture<K extends keyof typeof sendbirdEndpointSchemas, Input, Output>(
	id: K,
	endpoint: (ctx: SendbirdContext, input: Input) => Promise<Output>,
	spec: {
		input: NoInfer<Input>;
		response: NoInfer<Output>;
		method: 'GET' | 'POST' | 'PUT' | 'DELETE';
		url: string;
		query?: object;
		body?: object;
	},
) {
	return { ...spec, id, endpoint, run: () => endpoint(ctx, spec.input) };
}
// Compile-time regression: fixtures must not accept a different endpoint's input or output.
if (false) {
	fixture('users.get', groups.users.get, {
		// @ts-expect-error users.get requires user_id, not channel_url.
		input: { channel_url: 'room' },
		response: user,
		method: 'GET',
		url: '/users/u',
	});
	fixture('users.get', groups.users.get, {
		input: { user_id: 'u' },
		// @ts-expect-error users.get returns a user, not a channel.
		response: channel,
		method: 'GET',
		url: '/users/u',
	});
}
const fixtures = [
	fixture('users.list', groups.users.list, {
		input: { token: 'page-2', limit: 10 },
		method: 'GET',
		url: '/users',
		query: { token: 'page-2', limit: 10 },
		response: { users: [user], next: '' },
	}),
	fixture('users.get', groups.users.get, {
		input: { user_id: 'user 1', include_unread_count: true },
		method: 'GET',
		url: '/users/user%201',
		query: { include_unread_count: true },
		response: user,
	}),
	fixture('users.create', groups.users.create, {
		input: { user_id: 'user 1', nickname: 'A', profile_url: '' },
		method: 'POST',
		url: '/users',
		body: { user_id: 'user 1', nickname: 'A', profile_url: '' },
		response: user,
	}),
	fixture('users.update', groups.users.update, {
		input: { user_id: 'user 1', body: { nickname: 'B' } },
		method: 'PUT',
		url: '/users/user%201',
		body: { nickname: 'B' },
		response: user,
	}),
	fixture('users.delete', groups.users.delete, {
		input: { user_id: 'user 1' },
		method: 'DELETE',
		url: '/users/user%201',
		response: undefined,
	}),
	fixture('channels.list', groups.channels.list, {
		input: { token: 'page-2', show_member: true },
		method: 'GET',
		url: '/group_channels',
		query: { token: 'page-2', show_member: true },
		response: { channels: [channel], next: '' },
	}),
	fixture('channels.get', groups.channels.get, {
		input: { channel_url: 'room 1', show_member: true },
		method: 'GET',
		url: '/group_channels/room%201',
		query: { show_member: true },
		response: channel,
	}),
	fixture('channels.create', groups.channels.create, {
		input: { user_ids: ['user 1'], name: 'A' },
		method: 'POST',
		url: '/group_channels',
		body: { user_ids: ['user 1'], name: 'A' },
		response: channel,
	}),
	fixture('channels.update', groups.channels.update, {
		input: { channel_url: 'room 1', body: { name: 'B' } },
		method: 'PUT',
		url: '/group_channels/room%201',
		body: { name: 'B' },
		response: channel,
	}),
	fixture('channels.delete', groups.channels.delete, {
		input: { channel_url: 'room 1' },
		method: 'DELETE',
		url: '/group_channels/room%201',
		response: undefined,
	}),
	fixture('messages.list', groups.messages.list, {
		input: { ...path, message_id: 42, prev_limit: 10, next_limit: 2 },
		method: 'GET',
		url: '/group_channels/room%201/messages',
		query: { message_id: 42, prev_limit: 10, next_limit: 2 },
		response: { messages: [message] },
	}),
	fixture('messages.get', groups.messages.get, {
		input: { ...path, message_id: 42, include_reactions: true },
		method: 'GET',
		url: '/group_channels/room%201/messages/42',
		query: { include_reactions: true },
		response: message,
	}),
	fixture('messages.send', groups.messages.send, {
		input: {
			...path,
			body: { message_type: 'MESG', user_id: 'user 1', message: 'Hello' },
		},
		method: 'POST',
		url: '/group_channels/room%201/messages',
		body: { message_type: 'MESG', user_id: 'user 1', message: 'Hello' },
		response: message,
	}),
	fixture('messages.update', groups.messages.update, {
		input: {
			...path,
			message_id: 42,
			body: { message_type: 'MESG', message: 'Changed' },
		},
		method: 'PUT',
		url: '/group_channels/room%201/messages/42',
		body: { message_type: 'MESG', message: 'Changed' },
		response: message,
	}),
	fixture('messages.delete', groups.messages.delete, {
		input: { ...path, message_id: 42, delete_files: true },
		method: 'DELETE',
		url: '/group_channels/room%201/messages/42',
		query: { delete_files: true },
		response: undefined,
	}),
];

beforeEach(() => mockRequest.mockReset());
describe('Sendbird public request seam', () => {
	it('registers all 15 operations with schemas and metadata', () => {
		const registered = Object.entries(groups)
			.flatMap(([group, endpoints]) =>
				Object.entries(endpoints).map(([name, endpoint]) => {
					const id = `${group}.${name}`;
					expect(fixtures.find((item) => item.id === id)?.endpoint).toBe(
						endpoint,
					);
					return id;
				}),
			)
			.sort();
		expect(fixtures).toHaveLength(15);
		expect(registered).toEqual(fixtures.map(({ id }) => id).sort());
		expect(Object.keys(sendbirdEndpointSchemas).sort()).toEqual(registered);
		expect(sendbirdEndpointMeta['messages.delete'].riskLevel).toBe(
			'destructive',
		);
	});
	it.each(fixtures)(
		'$id validates its input and output boundary',
		(fixture) => {
			const schema = sendbirdEndpointSchemas[fixture.id];
			expect(schema?.input.safeParse(fixture.input).success).toBe(true);
			expect(schema?.output.safeParse(fixture.response).success).toBe(true);
			expect(schema?.input.safeParse(null).success).toBe(false);
			expect(schema?.output.safeParse(null).success).toBe(false);
		},
	);
	it.each(fixtures)(
		'$id forwards the contract request and parses its response',
		async (fixture) => {
			mockRequest.mockResolvedValue(fixture.response);
			expect(await fixture.run()).toEqual(fixture.response);
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [config, options, transport] = mockRequest.mock.calls[0];
			expect(config.BASE).toBe('https://api-app-123.sendbird.com/v3');
			expect(config.HEADERS).toEqual({ 'Api-Token': 'secret' });
			expect(options).toMatchObject({
				method: fixture.method,
				url: fixture.url,
				body: 'body' in fixture ? fixture.body : undefined,
				query: 'query' in fixture ? fixture.query : undefined,
			});
			expect(transport.rateLimitConfig.maxRetries).toBe(0);
		},
	);
	it.each(['', '.', '..', 'a/b', 'a\\b', 'a"b', "a'b"])(
		'rejects unsafe route component %s',
		async (user_id) => {
			await expect(groups.users?.get?.(ctx, { user_id })).rejects.toThrow();
			expect(mockRequest).not.toHaveBeenCalled();
		},
	);
	it('requires a reference for listing messages and rejects unsupported message variants', async () => {
		await expect(groups.messages?.list?.(ctx, path)).rejects.toThrow();
		await expect(
			groups.messages.send(ctx, {
				...path,
				// Deliberately invalid to exercise runtime validation for untyped callers.
				// @ts-expect-error FILE messages are not supported by this endpoint.
				body: { message_type: 'FILE', user_id: 'u', message: 'x' },
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('accepts channel operators only during creation', async () => {
		mockRequest.mockResolvedValue(channel);
		await groups.channels?.create?.(ctx, {
			user_ids: ['user 1'],
			operator_ids: ['user 1'],
		});
		expect(mockRequest.mock.calls[0][1].body).toEqual({
			user_ids: ['user 1'],
			operator_ids: ['user 1'],
		});
		mockRequest.mockClear();
		await expect(
			groups.channels?.update?.(ctx, {
				channel_url: 'room',
				// Deliberately invalid to verify that updates reject creation-only fields.
				// @ts-expect-error operator_ids is only accepted on creation.
				body: { operator_ids: ['user 1'] },
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('passes a timestamp reference and supports open-channel message reads', async () => {
		mockRequest.mockResolvedValue({ messages: [message] });
		await groups.messages?.list?.(ctx, {
			channel_type: 'open_channels',
			channel_url: 'room',
			message_ts: 1234,
			prev_limit: 0,
			next_limit: 5,
		});
		expect(mockRequest.mock.calls[0][1]).toMatchObject({
			url: '/open_channels/room/messages',
			query: { message_ts: 1234, prev_limit: 0, next_limit: 5 },
		});
	});
	it('fails output validation instead of returning a malformed resource', async () => {
		mockRequest.mockResolvedValue({ nickname: 'missing user ID' });
		await expect(groups.users?.get?.(ctx, { user_id: 'u' })).rejects.toThrow();
	});
	it('rejects a missing token before contacting Sendbird', async () => {
		const missing = {
			...ctx,
			key: ' ',
		} as SendbirdContext;
		await expect(groups.users?.list?.(missing, {})).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('treats an empty success body as undefined', async () => {
		mockRequest.mockResolvedValue('');
		await expect(
			groups.users?.delete?.(ctx, { user_id: 'u' }),
		).resolves.toBeUndefined();
	});
	it('rejects invalid application hosts before transport', async () => {
		const bad = {
			...ctx,
			options: { key: 'secret', applicationId: 'app.example.com' },
		} as SendbirdContext;
		await expect(groups.users?.list?.(bad, {})).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});
	it('preserves Sendbird error bodies and rate-limit retry timing without replay', async () => {
		mockRequest.mockRejectedValue(
			new ApiError(
				{ method: 'GET', url: '/users' },
				{
					url: '/users',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { message: 'rate limit', code: 429000, error: true },
				},
				'limited',
				{ retryAfter: 5000 },
			),
		);
		await expect(groups.users?.list?.(ctx, {})).rejects.toMatchObject({
			name: 'SendbirdAPIError',
			status: 429,
			body: { code: 429000 },
			retryAfter: 5000,
		});
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new SendbirdAPIError('limited', 429),
			),
		).toBe(true);
	});
});
