import { ApiError, request } from 'corsair/http';
import { CallPageAPIError } from '../client';
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
	CallHistoryWireSchema,
	CallPageEndpointInputSchemas,
	CallRecordWireSchema,
} from '../endpoints/types';
import { errorHandlers } from '../error-handlers';
import type { CallPageContext } from '../index';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('corsair/http', () => ({
	...jest.requireActual('corsair/http'),
	request: jest.fn(),
}));

const mockRequest = jest.mocked(request);

function entityStore() {
	return {
		upsertByEntityId: jest.fn().mockResolvedValue(undefined),
		deleteByEntityId: jest.fn().mockResolvedValue(undefined),
		findByEntityId: jest.fn().mockResolvedValue(null),
		search: jest.fn().mockResolvedValue([]),
	};
}

function createDb() {
	return {
		users: entityStore(),
		widgets: entityStore(),
		managers: entityStore(),
		calls: entityStore(),
		smsMessages: entityStore(),
		voiceMessages: entityStore(),
	};
}

function createContext(db = createDb()) {
	// Safe: endpoints read only key, options and the entity stores, and a real
	// context needs a live corsair instance.
	// A narrower type is not practical because CorsairPluginContext carries the
	// full bound endpoint tree and tenant helpers that these tests never touch.
	const base = {
		key: 'test-key',
		options: { authType: 'api_key' },
	} as CallPageContext;
	// The mock stores replace the typed entity stores, which expose many more
	// methods than the endpoints call.
	const ctx: CallPageContext = Object.assign(base, { db });
	return { ctx, db };
}

const envelope = <T>(data: T) => ({
	hasError: false,
	errorCode: 0,
	message: '',
	data,
});

// Fixtures follow the sample responses in https://callpage.github.io/documentation-rest/
const user = {
	id: 2,
	name: 'Manager1',
	email: 'manager1@callpage.io',
	tel: '+48570934649',
	tel_formatted: '570 934 649',
	tel_extension: null,
	last_online: null,
	parent_id: 1,
	activated_at: '2016-09-08 13:32:54',
	role: { slug: 'manager' },
	avatar: null,
	caller_id: { id: 1, activated_at: null, updated_at: '2016-09-08 13:32:54' },
};
const businessTimes = [
	{
		day_of_week: 1,
		enabled: true,
		timezone: 'Europe/Warsaw',
		start_time: '09:00:00',
		end_time: '17:00:00',
	},
];
const manager = {
	id: 23,
	enabled: true,
	user: {
		id: 2,
		name: 'Manager1',
		tel: '+48570934649',
		email: 'm@x.io',
		avatar: null,
	},
	departments: [],
	business_times: businessTimes,
};
const widget = {
	id: 2,
	description: 'Callpage.io DIALOG',
	url: 'http://callpage.io',
	enabled: true,
	locale_code: 'en',
	installation_status: 0,
	installed_at: null,
	company_sms_name: null,
	call_requests_count: 0,
	managers: [manager],
};
const callObject = {
	id: 10507595,
	to: '+48123456789',
	human_status: 'completed',
	created_at: '2023-12-19 10:46:56',
	scheduled_at: null,
	leadable_type: 'Widget',
	utm: { utm_medium: null, utm_source: null },
	call: { id: 8826249, type: 1, billing_time: 0 },
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

type RequestCase = {
	name: string;
	// Safe: the table only awaits the call; each result is compared via `result`.
	// A narrower type is not practical because every endpoint resolves to a different output type.
	run: (ctx: CallPageContext) => Promise<unknown>;
	method: 'GET' | 'POST';
	url: string;
	query?: Record<string, string | number | boolean | number[] | string[]>;
	body?: Record<string, string | number | boolean | object>;
	// Safe: the value is only handed to the mocked transport.
	// A narrower type is not practical because each case mocks a differently shaped API response.
	data: unknown;
	// Safe: the value is only compared with toEqual.
	// A narrower type is not practical because each case expects a differently shaped parsed result.
	result: unknown;
};

const cases: RequestCase[] = [
	{
		name: 'calls.get',
		run: (ctx) => Calls.get(ctx, { callId: 99 }),
		method: 'GET',
		url: '/api/v3/external/calls/99',
		data: { data: callObject },
		result: callObject,
	},
	{
		name: 'calls.history',
		run: (ctx) =>
			Calls.history(ctx, {
				widget_ids: [2],
				statuses: ['completed', 'in-progress'],
				limit: 15,
				offset: 0,
			}),
		method: 'GET',
		url: '/api/v3/external/calls/history',
		query: {
			'widget_ids[]': [2],
			'statuses[]': ['completed', 'in-progress'],
			limit: 15,
			offset: 0,
		},
		data: [{ data: callObject }],
		result: [callObject],
	},
	{
		name: 'users.list',
		run: (ctx) => Users.list(ctx, { offset: 1, limit: 2 }),
		method: 'GET',
		url: '/api/v1/external/users/all',
		query: { offset: 1, limit: 2 },
		data: [user],
		result: [user],
	},
	{
		name: 'users.get',
		run: (ctx) => Users.get(ctx, { id: 2 }),
		method: 'GET',
		url: '/api/v1/external/users/get',
		query: { id: 2 },
		data: user,
		result: user,
	},
	{
		name: 'users.create',
		run: (ctx) =>
			Users.create(ctx, { name: 'Test', tel: '+48888888888', role: 'manager' }),
		method: 'POST',
		url: '/api/v1/external/users/create',
		body: { name: 'Test', tel: '+48888888888', role: 'manager' },
		data: { id: 1380 },
		result: { id: 1380 },
	},
	{
		name: 'users.update',
		run: (ctx) =>
			Users.update(ctx, { id: 1380, name: 'Test', tel: '+48888888888' }),
		method: 'POST',
		url: '/api/v1/external/users/update',
		body: { id: 1380, name: 'Test', tel: '+48888888888' },
		data: { id: 1380 },
		result: { id: 1380 },
	},
	{
		name: 'users.delete',
		run: (ctx) => Users.remove(ctx, { id: 1380 }),
		method: 'POST',
		url: '/api/v1/external/users/delete',
		body: { id: 1380 },
		data: null,
		result: null,
	},
	{
		name: 'widgets.list',
		run: (ctx) => Widgets.list(ctx, { offset: 1, limit: 2 }),
		method: 'GET',
		url: '/api/v1/external/widgets/all',
		query: { offset: 1, limit: 2 },
		data: [widget],
		result: [widget],
	},
	{
		name: 'widgets.get',
		run: (ctx) => Widgets.get(ctx, { id: 2 }),
		method: 'GET',
		url: '/api/v1/external/widgets/get',
		query: { id: 2 },
		data: widget,
		result: widget,
	},
	{
		name: 'widgets.create',
		run: (ctx) =>
			Widgets.create(ctx, {
				url: 'http://test.com',
				description: 'Test',
				locale_code: 'pl',
			}),
		method: 'POST',
		url: '/api/v1/external/widgets/create',
		body: { url: 'http://test.com', description: 'Test', locale_code: 'pl' },
		data: { id: 3409 },
		result: { id: 3409 },
	},
	{
		name: 'widgets.update',
		run: (ctx) => Widgets.update(ctx, { id: 3409, url: 'http://test.com' }),
		method: 'POST',
		url: '/api/v1/external/widgets/update',
		body: { id: 3409, url: 'http://test.com' },
		data: { id: 3409 },
		result: { id: 3409 },
	},
	{
		name: 'widgets.delete',
		run: (ctx) => Widgets.remove(ctx, { id: 3409 }),
		method: 'POST',
		url: '/api/v1/external/widgets/delete',
		body: { id: 3409 },
		data: null,
		result: null,
	},
	{
		name: 'widgets.call',
		run: (ctx) =>
			Widgets.call(ctx, { id: 1, tel: '+48888888888', department_id: 1 }),
		method: 'POST',
		url: '/api/v1/external/widgets/call',
		body: { id: 1, tel: '+48888888888', department_id: 1 },
		data: { id: 6 },
		result: { id: 6 },
	},
	{
		name: 'widgets.callOrSchedule',
		run: (ctx) =>
			Widgets.callOrSchedule(ctx, {
				id: 1,
				tel: '+48888888888',
				department_id: 1,
			}),
		method: 'POST',
		url: '/api/v1/external/widgets/call-or-schedule',
		body: { id: 1, tel: '+48888888888', department_id: 1 },
		data: { id: 7 },
		result: { id: 7 },
	},
	{
		name: 'widgets.addUsers',
		run: (ctx) => Widgets.addUsers(ctx, { id: 2, user_id: [1, 4] }),
		method: 'POST',
		url: '/api/v1/external/widgets/add-users',
		body: { id: 2, user_id: [1, 4] },
		data: [
			{ user_id: 1, manager_id: 3 },
			{ user_id: 4, manager_id: 4 },
		],
		result: [
			{ user_id: 1, manager_id: 3 },
			{ user_id: 4, manager_id: 4 },
		],
	},
	{
		name: 'managers.list',
		run: (ctx) => Managers.list(ctx, { widget_id: 2, limit: 10 }),
		method: 'GET',
		url: '/api/v1/external/managers/all',
		query: { widget_id: 2, limit: 10 },
		data: [manager],
		result: [manager],
	},
	{
		name: 'managers.get',
		run: (ctx) => Managers.get(ctx, { widget_id: 1, user_id: 2 }),
		method: 'GET',
		url: '/api/v1/external/managers/get',
		query: { widget_id: 1, user_id: 2 },
		data: manager,
		result: manager,
	},
	{
		name: 'managers.create',
		run: (ctx) =>
			Managers.create(ctx, {
				widget_id: 1,
				user_id: 2,
				enabled: true,
				business_times: businessTimes.map(({ timezone: _tz, ...time }) => time),
			}),
		method: 'POST',
		url: '/api/v1/external/managers/create',
		body: {
			widget_id: 1,
			user_id: 2,
			enabled: true,
			business_times: [
				{
					day_of_week: 1,
					enabled: true,
					start_time: '09:00:00',
					end_time: '17:00:00',
				},
			],
		},
		data: { id: 21 },
		result: { id: 21 },
	},
	{
		name: 'managers.update',
		run: (ctx) =>
			Managers.update(ctx, { widget_id: 1, user_id: 2, enabled: false }),
		method: 'POST',
		url: '/api/v1/external/managers/update',
		body: { widget_id: 1, user_id: 2, enabled: false },
		data: { id: 21 },
		result: { id: 21 },
	},
	{
		name: 'managers.delete',
		run: (ctx) => Managers.remove(ctx, { widget_id: 1, user_id: 2 }),
		method: 'POST',
		url: '/api/v1/external/managers/delete',
		body: { widget_id: 1, user_id: 2 },
		data: null,
		result: null,
	},
	{
		name: 'sms.list',
		run: (ctx) => Sms.list(ctx, { widget_id: 1 }),
		method: 'GET',
		url: '/api/v1/external/sms/all',
		query: { widget_id: 1 },
		data: [sms],
		result: [sms],
	},
	{
		name: 'sms.create',
		run: (ctx) =>
			Sms.create(ctx, {
				widget_id: 1,
				message_id: 'visitor.dial-completed',
				text: 'Hi',
			}),
		method: 'POST',
		url: '/api/v1/external/sms/create',
		body: { widget_id: 1, message_id: 'visitor.dial-completed', text: 'Hi' },
		data: { id: 49 },
		result: { id: 49 },
	},
	{
		name: 'sms.update',
		run: (ctx) =>
			Sms.update(ctx, {
				widget_id: 1,
				message_id: 'visitor.dial-completed',
				text: 'Hello',
				enabled: false,
			}),
		method: 'POST',
		url: '/api/v1/external/sms/update',
		body: {
			widget_id: 1,
			message_id: 'visitor.dial-completed',
			text: 'Hello',
			enabled: false,
		},
		data: { id: 49 },
		result: { id: 49 },
	},
	{
		name: 'sms.reset',
		run: (ctx) => Sms.reset(ctx, { widget_id: 1 }),
		method: 'POST',
		url: '/api/v1/external/sms/reset',
		body: { widget_id: 1 },
		data: null,
		result: null,
	},
	{
		name: 'voiceMessages.list',
		run: (ctx) => VoiceMessages.list(ctx, { widget_id: 1 }),
		method: 'GET',
		url: '/api/v1/external/voice/all',
		query: { widget_id: 1 },
		data: [voice],
		result: [voice],
	},
	{
		name: 'voiceMessages.create',
		run: (ctx) =>
			VoiceMessages.create(ctx, {
				widget_id: 3,
				message_id: 'manager.call',
				enabled: true,
				file: 'https://example.com/manager.call.mp3',
			}),
		method: 'POST',
		url: '/api/v1/external/voice/create',
		body: {
			widget_id: 3,
			message_id: 'manager.call',
			enabled: true,
			file: 'https://example.com/manager.call.mp3',
		},
		data: { id: 37 },
		result: { id: 37 },
	},
	{
		name: 'voiceMessages.update',
		run: (ctx) =>
			VoiceMessages.update(ctx, {
				widget_id: 3,
				message_id: 'manager.call',
				enabled: false,
			}),
		method: 'POST',
		url: '/api/v1/external/voice/update',
		body: { widget_id: 3, message_id: 'manager.call', enabled: false },
		data: { id: 37 },
		result: { id: 37 },
	},
	{
		name: 'voiceMessages.reset',
		run: (ctx) =>
			VoiceMessages.reset(ctx, { widget_id: 3, message_id: 'manager.call' }),
		method: 'POST',
		url: '/api/v1/external/voice/reset',
		body: { widget_id: 3, message_id: 'manager.call' },
		data: null,
		result: null,
	},
];

function lastRequest() {
	const [config, options, extra] = mockRequest.mock.calls[0] ?? [];
	return { config, options, extra };
}

describe('CallPage endpoint requests', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it.each(cases)(
		'$name sends the documented request and parses the result',
		async ({ run, method, url, query, body, data, result }) => {
			mockRequest.mockResolvedValueOnce(envelope(data));
			const { ctx } = createContext();

			await expect(run(ctx)).resolves.toEqual(result);

			expect(mockRequest).toHaveBeenCalledTimes(1);
			const { config, options } = lastRequest();
			expect(config).toMatchObject({
				BASE: 'https://core.callpage.io',
				HEADERS: { Authorization: 'test-key' },
			});
			expect(options).toEqual({
				method,
				url,
				query,
				body,
				mediaType: 'application/json',
			});
		},
	);

	it('retries GET on rate limits and never retries writes', async () => {
		mockRequest
			.mockResolvedValueOnce(envelope([]))
			.mockResolvedValueOnce(envelope({ id: 1 }));
		const { ctx } = createContext();

		await Users.list(ctx, {});
		await Users.create(ctx, { name: 'a', tel: '1' });

		expect(mockRequest.mock.calls[0]?.[2]).toMatchObject({
			rateLimitConfig: {
				maxRetries: 3,
				headerNames: { retryAfter: 'Retry-After' },
			},
		});
		expect(mockRequest.mock.calls[1]?.[2]).toMatchObject({
			rateLimitConfig: { maxRetries: 0 },
		});
	});

	it('root.get returns the greeting from the envelope message', async () => {
		mockRequest.mockResolvedValueOnce({
			hasError: false,
			errorCode: 0,
			message: 'Hello there! I am the CallPage API.',
			data: [],
		});
		const { ctx } = createContext();

		await expect(Root.get(ctx, {})).resolves.toMatchObject({
			message: 'Hello there! I am the CallPage API.',
		});
		expect(lastRequest().options).toEqual({
			method: 'GET',
			url: '/api/v1/external/',
			mediaType: 'application/json',
		});
	});

	it('managers.statusStatistics counts enabled and disabled managers across pages', async () => {
		const page = (count: number, enabledCount: number) =>
			Array.from({ length: count }, (_, i) => ({
				...manager,
				id: i + 1,
				enabled: i < enabledCount,
			}));
		mockRequest
			.mockResolvedValueOnce(envelope(page(100, 60)))
			.mockResolvedValueOnce(envelope(page(5, 2)));
		const { ctx } = createContext();

		await expect(
			Managers.statusStatistics(ctx, { widget_id: 2 }),
		).resolves.toEqual({ total: 105, enabled: 62, disabled: 43 });

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			url: '/api/v1/external/managers/all',
			query: { widget_id: 2, offset: 0, limit: 100 },
		});
		expect(mockRequest.mock.calls[1]?.[1]).toMatchObject({
			query: { widget_id: 2, offset: 100, limit: 100 },
		});
	});
});

// Safe: the helper only awaits the call to observe its rejection.
// A narrower type is not practical because every endpoint resolves to a different output type.
async function failure(call: Promise<unknown>): Promise<CallPageAPIError> {
	try {
		await call;
	} catch (error) {
		if (error instanceof CallPageAPIError) return error;
		throw error;
	}
	throw new Error('expected the call to reject');
}

describe('CallPage errors', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	function apiError(
		status: number,
		retryAfter?: number,
		method: 'GET' | 'POST' = 'GET',
	) {
		return new ApiError(
			{ method, url: '/api/v1/external/users/all' },
			{
				url: 'https://core.callpage.io/api/v1/external/users/all',
				ok: false,
				status,
				statusText: 'error',
				body: {
					hasError: true,
					errorCode: 'access-denied',
					message: 'Access denied',
					data: null,
				},
			},
			'Access denied',
			{ retryAfter },
		);
	}

	it('maps 401 to an auth error the handler recognises', async () => {
		mockRequest.mockRejectedValueOnce(apiError(401));
		const { ctx } = createContext();

		const error = await failure(Users.list(ctx, {}));

		expect(error).toBeInstanceOf(CallPageAPIError);
		expect(error).toMatchObject({ status: 401 });
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(false);
	});

	it('maps 429 with Retry-After to a rate-limit error that carries the delay', async () => {
		mockRequest.mockRejectedValueOnce(apiError(429, 7000));
		const { ctx } = createContext();

		const error = await failure(Users.list(ctx, {}));

		expect(error).toMatchObject({ status: 429, retryAfter: 7000 });
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 7000 });
	});

	it('never retries a rate-limited write at the handler level', async () => {
		mockRequest.mockRejectedValueOnce(apiError(429, 7000, 'POST'));
		const { ctx } = createContext();

		const error = await failure(Users.create(ctx, { name: 'a', tel: '1' }));

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 0, headersRetryAfterMs: 7000 });
	});

	it('throws the provider message when the envelope reports an error', async () => {
		mockRequest.mockResolvedValueOnce({
			hasError: true,
			errorCode: 'validation',
			message: 'Invalid widget',
			data: null,
		});
		const { ctx } = createContext();

		await expect(Widgets.get(ctx, { id: 1 })).rejects.toMatchObject({
			message: 'Invalid widget',
			code: 'validation',
		});
	});
});

describe('CallPage entity persistence', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('users.list upserts every user by id', async () => {
		mockRequest.mockResolvedValueOnce(envelope([user]));
		const { ctx, db } = createContext();

		await Users.list(ctx, {});

		expect(db.users.upsertByEntityId).toHaveBeenCalledWith('2', user);
	});

	it('users.create stores the submitted fields under the returned id', async () => {
		mockRequest.mockResolvedValueOnce(envelope({ id: 1380 }));
		const { ctx, db } = createContext();

		await Users.create(ctx, {
			name: 'Test',
			tel: '+48888888888',
			role: 'admin',
		});

		expect(db.users.upsertByEntityId).toHaveBeenCalledWith('1380', {
			id: 1380,
			name: 'Test',
			tel: '+48888888888',
			role: { slug: 'admin' },
		});
	});

	it('users.update merges over the stored user instead of erasing its fields', async () => {
		mockRequest.mockResolvedValueOnce(envelope({ id: 2 }));
		const { ctx, db } = createContext();
		db.users.findByEntityId.mockResolvedValueOnce({ data: user });

		await Users.update(ctx, { id: 2, name: 'Renamed', tel: '+48888888888' });

		expect(db.users.upsertByEntityId).toHaveBeenCalledWith('2', {
			...user,
			name: 'Renamed',
			tel: '+48888888888',
		});
	});

	it('users.delete removes the stored user', async () => {
		mockRequest.mockResolvedValueOnce(envelope(null));
		const { ctx, db } = createContext();

		await Users.remove(ctx, { id: 2 });

		expect(db.users.deleteByEntityId).toHaveBeenCalledWith('2');
	});

	it('widgets.list upserts widgets and their managers with the widget id', async () => {
		mockRequest.mockResolvedValueOnce(envelope([widget]));
		const { ctx, db } = createContext();

		await Widgets.list(ctx, {});

		expect(db.widgets.upsertByEntityId).toHaveBeenCalledWith('2', widget);
		expect(db.managers.upsertByEntityId).toHaveBeenCalledWith('23', {
			...manager,
			widget_id: 2,
			user_id: 2,
		});
	});

	it('widgets.create upserts the submitted widget and widgets.delete removes it', async () => {
		mockRequest.mockResolvedValueOnce(envelope({ id: 3409 }));
		mockRequest.mockResolvedValueOnce(envelope(null));
		const { ctx, db } = createContext();

		await Widgets.create(ctx, { url: 'http://test.com', description: 'Test' });
		await Widgets.remove(ctx, { id: 3409 });

		expect(db.widgets.upsertByEntityId).toHaveBeenCalledWith(
			'3409',
			expect.objectContaining({
				id: 3409,
				url: 'http://test.com',
				description: 'Test',
			}),
		);
		expect(db.widgets.deleteByEntityId).toHaveBeenCalledWith('3409');
	});

	it('managers.get upserts the manager with the requested widget id', async () => {
		mockRequest.mockResolvedValueOnce(envelope(manager));
		const { ctx, db } = createContext();

		await Managers.get(ctx, { widget_id: 1, user_id: 2 });

		expect(db.managers.upsertByEntityId).toHaveBeenCalledWith('23', {
			...manager,
			widget_id: 1,
			user_id: 2,
		});
	});

	it('calls.history upserts each unwrapped call by id', async () => {
		mockRequest.mockResolvedValueOnce(envelope([{ data: callObject }]));
		const { ctx, db } = createContext();

		await Calls.history(ctx, {});

		expect(db.calls.upsertByEntityId).toHaveBeenCalledWith(
			'10507595',
			callObject,
		);
	});

	it('sms and voice messages are keyed by widget id and message id', async () => {
		mockRequest.mockResolvedValueOnce(envelope([sms]));
		mockRequest.mockResolvedValueOnce(envelope([voice]));
		mockRequest.mockResolvedValueOnce(envelope({ id: 49 }));
		const { ctx, db } = createContext();

		await Sms.list(ctx, { widget_id: 1 });
		await VoiceMessages.list(ctx, { widget_id: 1 });
		await Sms.create(ctx, {
			widget_id: 1,
			message_id: 'visitor.call-scheduled',
			text: 'Hi',
		});

		expect(db.smsMessages.upsertByEntityId).toHaveBeenNthCalledWith(
			1,
			'1:visitor.dial-completed',
			{ ...sms, widget_id: 1 },
		);
		expect(db.voiceMessages.upsertByEntityId).toHaveBeenCalledWith(
			'1:manager.call',
			{ ...voice, widget_id: 1 },
		);
		expect(db.smsMessages.upsertByEntityId).toHaveBeenNthCalledWith(
			2,
			'1:visitor.call-scheduled',
			expect.objectContaining({ text: 'Hi', widget_id: 1 }),
		);
	});

	it('managers.update merges into the stored manager of that widget and user', async () => {
		mockRequest.mockResolvedValueOnce(envelope({ id: 23 }));
		const { ctx, db } = createContext();
		db.managers.search.mockResolvedValueOnce([
			{ entity_id: '23', data: { ...manager, widget_id: 1, user_id: 2 } },
		]);

		await Managers.update(ctx, { widget_id: 1, user_id: 2, enabled: false });

		expect(db.managers.search).toHaveBeenCalledWith({
			data: { widget_id: 1, user_id: 2 },
			limit: 1,
		});
		expect(db.managers.upsertByEntityId).toHaveBeenCalledWith('23', {
			...manager,
			widget_id: 1,
			user_id: 2,
			enabled: false,
		});
	});

	it('managers.delete removes the stored manager of that widget and user', async () => {
		mockRequest.mockResolvedValueOnce(envelope(null));
		const { ctx, db } = createContext();
		db.managers.search.mockResolvedValueOnce([
			{ entity_id: '23', data: { ...manager, widget_id: 1, user_id: 2 } },
		]);

		await Managers.remove(ctx, { widget_id: 1, user_id: 2 });

		expect(db.managers.deleteByEntityId).toHaveBeenCalledWith('23');
	});

	it('sms.reset and voiceMessages.reset drop the stored custom messages', async () => {
		mockRequest.mockResolvedValueOnce(envelope(null));
		mockRequest.mockResolvedValueOnce(envelope(null));
		const { ctx, db } = createContext();
		db.smsMessages.search.mockResolvedValueOnce([
			{ entity_id: '1:visitor.dial-completed', data: sms },
			{ entity_id: '1:visitor.call-scheduled', data: sms },
		]);

		await Sms.reset(ctx, { widget_id: 1 });
		await VoiceMessages.reset(ctx, {
			widget_id: 1,
			message_id: 'manager.call',
		});

		expect(db.smsMessages.deleteByEntityId).toHaveBeenCalledTimes(2);
		expect(db.smsMessages.deleteByEntityId).toHaveBeenCalledWith(
			'1:visitor.call-scheduled',
		);
		expect(db.voiceMessages.deleteByEntityId).toHaveBeenCalledWith(
			'1:manager.call',
		);
	});

	it('voiceMessages.update clears the stored recording when the file is replaced', async () => {
		mockRequest.mockResolvedValueOnce(envelope({ id: 37 }));
		mockRequest.mockResolvedValueOnce(envelope({ id: 37 }));
		const { ctx, db } = createContext();
		db.voiceMessages.findByEntityId.mockResolvedValue({
			data: { ...voice, widget_id: 3 },
		});

		await VoiceMessages.update(ctx, {
			widget_id: 3,
			message_id: 'manager.call',
			enabled: true,
			file: 'https://example.com/new.mp3',
		});
		await VoiceMessages.update(ctx, {
			widget_id: 3,
			message_id: 'manager.call',
			enabled: false,
		});

		expect(db.voiceMessages.upsertByEntityId).toHaveBeenNthCalledWith(
			1,
			'3:manager.call',
			{ ...voice, widget_id: 3, recording: null },
		);
		expect(db.voiceMessages.upsertByEntityId).toHaveBeenNthCalledWith(
			2,
			'3:manager.call',
			{ ...voice, widget_id: 3, enabled: false },
		);
	});

	it('a failing database write does not fail the API call', async () => {
		const warn = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => undefined);
		mockRequest.mockResolvedValueOnce(envelope([user]));
		const { ctx, db } = createContext();
		db.users.upsertByEntityId.mockRejectedValueOnce(new Error('db down'));

		await expect(Users.list(ctx, {})).resolves.toEqual([user]);
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();
	});
});

describe('CallPage input validation', () => {
	beforeEach(() => {
		mockRequest.mockReset();
	});

	it('rejects invalid input before any request is sent', async () => {
		const { ctx } = createContext();

		await expect(
			Sms.create(ctx, {
				widget_id: 1,
				message_id: 'visitor.dial-completed',
				text: 'x'.repeat(241),
			}),
		).rejects.toThrow();
		await expect(
			Widgets.call(ctx, { id: 1, tel: '+48', department_id: 1, manager_id: 2 }),
		).rejects.toThrow();

		expect(mockRequest).not.toHaveBeenCalled();
	});
});

describe('CallPage schemas', () => {
	it('rejects SMS text over 240 characters', () => {
		expect(
			CallPageEndpointInputSchemas.smsCreate.safeParse({
				widget_id: 2,
				message_id: 'visitor.dial-completed',
				text: 'x'.repeat(241),
			}).success,
		).toBe(false);
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

	it('parses a call in either the wrapped or flat form', () => {
		expect(CallRecordWireSchema.parse({ data: callObject })).toEqual(
			callObject,
		);
		expect(CallRecordWireSchema.parse(callObject)).toEqual(callObject);
	});

	it('rejects a call without an id', () => {
		expect(
			CallHistoryWireSchema.safeParse([{ data: { human_status: 'completed' } }])
				.success,
		).toBe(false);
	});
});
