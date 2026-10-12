import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import {
	Calls,
	Managers,
	Root,
	Sms,
	Users,
	VoiceMessages,
	Widgets,
} from '../endpoints';
import {
	CallPageEndpointInputSchemas,
	CallPageEndpointOutputSchemas,
} from '../endpoints/types';
import type { CallPageContext } from '../index';

jest.mock('../client', () => ({
	makeCallPageRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const mockRequest = jest.mocked(makeCallPageRequest);
const mockLog = jest.mocked(logEventFromContext);

// input is never so every endpoint (each with its own input type) is assignable;
// the table below supplies the matching input per case. Promise<unknown>: each
// endpoint returns a different output type and the tests only compare values.
type AnyEndpoint = (ctx: CallPageContext, input: never) => Promise<unknown>;

function createContext(): CallPageContext {
	// Safe: endpoints under test read only key and options, and the full context
	// carries DB handles that cannot be built without a real corsair instance.
	return {
		key: 'test-key',
		options: { authType: 'api_key' },
	} as CallPageContext;
}

const user = {
	id: 1,
	name: 'Manager',
	tel: '+48123123123',
	email: 'm@callpage.io',
};
const widget = { id: 2, url: 'https://example.com', enabled: true };
const call = { id: 99, status: 'completed' };
const manager = {
	id: 23,
	enabled: true,
	user,
	departments: [{ id: 1, name: 'Sales' }],
	business_times: [
		{
			day_of_week: 1,
			enabled: true,
			timezone: 'Europe/Warsaw',
			start_time: '09:00:00',
			end_time: '17:00:00',
		},
	],
};
const sms = {
	enabled: 1,
	message_id: 'visitor.dial-completed',
	text: 'Thank you for contacting us',
	updated_at: null,
};
const voice = {
	enabled: true,
	message_id: 'manager.call',
	updated_at: null,
	recording: { full_url: 'https://core.callpage.io/manager.call.mp3' },
};

describe('CallPage endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const cases: Array<{
		name: string;
		fn: AnyEndpoint;
		// unknown: the table holds heterogeneous inputs, one shape per endpoint.
		input: Record<string, unknown>;
		path: string;
		method?: 'GET' | 'POST';
		transport?: 'query' | 'body' | 'none';
		// unknown: mocked transport responses differ per endpoint.
		response: unknown;
		schemaKey: keyof typeof CallPageEndpointOutputSchemas;
	}> = [
		{
			name: 'calls.get',
			fn: Calls.get,
			input: { callId: 99 },
			path: '/api/v3/external/calls/99',
			transport: 'none',
			response: call,
			schemaKey: 'callsGet',
		},
		{
			name: 'calls.history',
			fn: Calls.history,
			input: { limit: 10 },
			path: '/api/v3/external/calls/history',
			response: [call],
			schemaKey: 'callsHistory',
		},
		{
			name: 'users.list',
			fn: Users.list,
			input: { limit: 2 },
			path: '/api/v1/external/users/all',
			response: [user],
			schemaKey: 'usersList',
		},
		{
			name: 'users.get',
			fn: Users.get,
			input: { id: 1 },
			path: '/api/v1/external/users/get',
			response: user,
			schemaKey: 'usersGet',
		},
		{
			name: 'users.create',
			fn: Users.create,
			input: { name: 'New', tel: '+48123123123' },
			path: '/api/v1/external/users/create',
			method: 'POST',
			response: user,
			schemaKey: 'usersCreate',
		},
		{
			name: 'users.update',
			fn: Users.update,
			input: { id: 1, name: 'Updated', tel: '+48123123123' },
			path: '/api/v1/external/users/update',
			method: 'POST',
			response: user,
			schemaKey: 'usersUpdate',
		},
		{
			name: 'users.delete',
			fn: Users.remove,
			input: { id: 1 },
			path: '/api/v1/external/users/delete',
			method: 'POST',
			transport: 'query',
			response: null,
			schemaKey: 'usersDelete',
		},
		{
			name: 'widgets.get',
			fn: Widgets.get,
			input: { id: 2 },
			path: '/api/v1/external/widgets/get',
			response: widget,
			schemaKey: 'widgetsGet',
		},
		{
			name: 'widgets.create',
			fn: Widgets.create,
			input: { url: 'https://example.com' },
			path: '/api/v1/external/widgets/create',
			method: 'POST',
			response: widget,
			schemaKey: 'widgetsCreate',
		},
		{
			name: 'widgets.update',
			fn: Widgets.update,
			input: { id: 2, url: 'https://example.com' },
			path: '/api/v1/external/widgets/update',
			method: 'POST',
			response: widget,
			schemaKey: 'widgetsUpdate',
		},
		{
			name: 'widgets.delete',
			fn: Widgets.remove,
			input: { id: 2 },
			path: '/api/v1/external/widgets/delete',
			method: 'POST',
			transport: 'query',
			response: null,
			schemaKey: 'widgetsDelete',
		},
		{
			name: 'widgets.call',
			fn: Widgets.call,
			input: { id: 2, tel: '+48123123123' },
			path: '/api/v1/external/widgets/call',
			method: 'POST',
			transport: 'query',
			response: { status: 'queued' },
			schemaKey: 'widgetsCall',
		},
		{
			name: 'widgets.callOrSchedule',
			fn: Widgets.callOrSchedule,
			input: { id: 2, tel: '+48123123123' },
			path: '/api/v1/external/widgets/call-or-schedule',
			method: 'POST',
			response: { status: 'scheduled' },
			schemaKey: 'widgetsCallOrSchedule',
		},
		{
			name: 'widgets.list',
			fn: Widgets.list,
			input: { offset: 0, limit: 50 },
			path: '/api/v1/external/widgets/all',
			response: [widget],
			schemaKey: 'widgetsList',
		},
		{
			name: 'widgets.addUsers',
			fn: Widgets.addUsers,
			input: { id: 2, user_id: [1, 4] },
			path: '/api/v1/external/widgets/add-users',
			method: 'POST',
			response: [
				{ user_id: 1, manager_id: 3 },
				{ user_id: 4, manager_id: 4 },
			],
			schemaKey: 'widgetsAddUsers',
		},
		{
			name: 'managers.list',
			fn: Managers.list,
			input: { widget_id: 2, limit: 10 },
			path: '/api/v1/external/managers/all',
			response: [manager],
			schemaKey: 'managersList',
		},
		{
			name: 'managers.get',
			fn: Managers.get,
			input: { user_id: 1, widget_id: 2 },
			path: '/api/v1/external/managers/get',
			response: manager,
			schemaKey: 'managersGet',
		},
		{
			name: 'managers.create',
			fn: Managers.create,
			input: { user_id: 1, widget_id: 2, enabled: true, business_times: [] },
			path: '/api/v1/external/managers/create',
			method: 'POST',
			response: { id: 21 },
			schemaKey: 'managersCreate',
		},
		{
			name: 'managers.update',
			fn: Managers.update,
			input: { user_id: 1, widget_id: 2, enabled: false },
			path: '/api/v1/external/managers/update',
			method: 'POST',
			response: { id: 21 },
			schemaKey: 'managersUpdate',
		},
		{
			name: 'managers.delete',
			fn: Managers.remove,
			input: { user_id: 1, widget_id: 2 },
			path: '/api/v1/external/managers/delete',
			method: 'POST',
			transport: 'query',
			response: null,
			schemaKey: 'managersDelete',
		},
		{
			name: 'sms.list',
			fn: Sms.list,
			input: { widget_id: 2 },
			path: '/api/v1/external/sms/all',
			response: [sms],
			schemaKey: 'smsList',
		},
		{
			name: 'sms.create',
			fn: Sms.create,
			input: { widget_id: 2, message_id: 'visitor.dial-completed', text: 'Hi' },
			path: '/api/v1/external/sms/create',
			method: 'POST',
			response: { id: 49 },
			schemaKey: 'smsCreate',
		},
		{
			name: 'sms.update',
			fn: Sms.update,
			input: {
				widget_id: 2,
				message_id: 'visitor.dial-completed',
				text: 'Hello',
				enabled: false,
			},
			path: '/api/v1/external/sms/update',
			method: 'POST',
			response: { id: 49 },
			schemaKey: 'smsUpdate',
		},
		{
			name: 'sms.reset',
			fn: Sms.reset,
			input: { widget_id: 2 },
			path: '/api/v1/external/sms/reset',
			method: 'POST',
			transport: 'query',
			response: null,
			schemaKey: 'smsReset',
		},
		{
			name: 'voiceMessages.list',
			fn: VoiceMessages.list,
			input: { widget_id: 2 },
			path: '/api/v1/external/voice/all',
			response: [voice],
			schemaKey: 'voiceMessagesList',
		},
		{
			name: 'voiceMessages.create',
			fn: VoiceMessages.create,
			input: {
				widget_id: 2,
				message_id: 'manager.call',
				enabled: true,
				file: 'https://example.com/greeting.mp3',
			},
			path: '/api/v1/external/voice/create',
			method: 'POST',
			transport: 'query',
			response: { id: 37 },
			schemaKey: 'voiceMessagesCreate',
		},
		{
			name: 'voiceMessages.update',
			fn: VoiceMessages.update,
			input: { widget_id: 2, message_id: 'manager.call', enabled: false },
			path: '/api/v1/external/voice/update',
			method: 'POST',
			response: { id: 37 },
			schemaKey: 'voiceMessagesUpdate',
		},
		{
			name: 'voiceMessages.reset',
			fn: VoiceMessages.reset,
			input: { widget_id: 2, message_id: 'manager.call' },
			path: '/api/v1/external/voice/reset',
			method: 'POST',
			transport: 'query',
			response: null,
			schemaKey: 'voiceMessagesReset',
		},
	];

	it.each(cases)(
		'$name calls the expected path and validates output',
		async ({
			fn,
			input,
			path,
			method = 'GET',
			transport = method === 'POST' ? 'body' : 'query',
			response,
			schemaKey,
		}) => {
			mockRequest.mockResolvedValueOnce(response);
			const ctx = createContext();

			// Safe: each case pairs an endpoint with its own input, which the
			// table type cannot correlate per row without losing the shared loop.
			const result = await fn(ctx, input as never);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const [calledPath, calledKey, requestOptions] =
				mockRequest.mock.calls[0] ?? [];
			expect(calledPath).toBe(path);
			expect(calledKey).toBe('test-key');
			expect(requestOptions).toMatchObject({
				schema: CallPageEndpointOutputSchemas[schemaKey],
				...(method === 'POST' ? { method: 'POST' } : {}),
				...(transport === 'none' ? {} : { [transport]: input }),
			});
			if (transport !== 'body') {
				expect(requestOptions).not.toHaveProperty('body');
			}
			expect(result).toEqual(response);
			expect(mockLog).toHaveBeenCalledTimes(1);
		},
	);

	it('root.get returns the envelope greeting without unwrapping', async () => {
		mockRequest.mockResolvedValueOnce({ message: 'Hello from CallPage' });

		const result = await Root.get(createContext(), {});

		expect(mockRequest).toHaveBeenCalledWith('/api/v1/external/', 'test-key', {
			unwrap: false,
			schema: CallPageEndpointOutputSchemas.rootGet,
		});
		expect(result).toEqual({ message: 'Hello from CallPage' });
	});

	it('managers.statusStatistics counts enabled and disabled managers across pages', async () => {
		const page = (count: number, enabledCount: number) =>
			Array.from({ length: count }, (_, i) => ({
				...manager,
				id: i + 1,
				enabled: i < enabledCount,
			}));
		mockRequest
			.mockResolvedValueOnce(page(100, 60))
			.mockResolvedValueOnce(page(5, 2));

		const result = await Managers.statusStatistics(createContext(), {
			widget_id: 2,
		});

		expect(result).toEqual({ total: 105, enabled: 62, disabled: 43 });
		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(mockRequest.mock.calls[0]?.[2]).toMatchObject({
			query: { widget_id: 2, offset: 0, limit: 100 },
		});
		expect(mockRequest.mock.calls[1]?.[2]).toMatchObject({
			query: { widget_id: 2, offset: 100, limit: 100 },
		});
	});
});

describe('CallPage input schemas', () => {
	it('rejects SMS text over 240 characters', () => {
		const result = CallPageEndpointInputSchemas.smsCreate.safeParse({
			widget_id: 2,
			message_id: 'visitor.dial-completed',
			text: 'x'.repeat(241),
		});
		expect(result.success).toBe(false);
	});

	it('requires enabled on manager create', () => {
		expect(
			CallPageEndpointInputSchemas.managersCreate.safeParse({
				user_id: 1,
				widget_id: 2,
			}).success,
		).toBe(false);
	});

	it('accepts a single user id or a list when adding users to a widget', () => {
		const schema = CallPageEndpointInputSchemas.widgetsAddUsers;
		expect(schema.safeParse({ id: 2, user_id: 1 }).success).toBe(true);
		expect(schema.safeParse({ id: 2, user_id: [1, 4] }).success).toBe(true);
		expect(schema.safeParse({ id: 2, user_id: [] }).success).toBe(false);
	});
});

describe('CallPage output schemas', () => {
	it('parses call records and keeps provider fields it does not model', () => {
		expect(
			CallPageEndpointOutputSchemas.callsGet.parse({
				id: '99',
				status: 'completed',
				tel: '+48123123123',
				widget_id: 2,
				created_at: 1700000000,
				duration: 42,
			}),
		).toEqual({
			id: 99,
			status: 'completed',
			tel: '+48123123123',
			widget_id: 2,
			created_at: 1700000000,
			duration: 42,
		});
	});

	it('rejects a call record without an id', () => {
		expect(
			CallPageEndpointOutputSchemas.callsHistory.safeParse([
				{ status: 'completed' },
			]).success,
		).toBe(false);
	});

	it('rejects a non-string status from widgets.call', () => {
		expect(
			CallPageEndpointOutputSchemas.widgetsCall.safeParse({ status: 1 })
				.success,
		).toBe(false);
	});
});
