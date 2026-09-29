import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import { Calls, Users, Widgets } from '../endpoints';
import { CallPageEndpointOutputSchemas } from '../endpoints/types';
import type { CallPageContext } from '../index';

jest.mock('../client', () => ({
	makeCallPageRequest: jest.fn(),
}));

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
}));

const mockRequest = jest.mocked(makeCallPageRequest);
const mockLog = jest.mocked(logEventFromContext);

type AnyEndpoint = (ctx: CallPageContext, input?: unknown) => Promise<unknown>;

function createContext(): CallPageContext {
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

describe('CallPage endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	const cases: Array<{
		name: string;
		fn: AnyEndpoint;
		input: Record<string, unknown>;
		path: string;
		method?: 'GET' | 'POST';
		withQuery?: boolean;
		response: unknown;
		schemaKey: keyof typeof CallPageEndpointOutputSchemas;
	}> = [
		{
			name: 'calls.get',
			fn: Calls.get as AnyEndpoint,
			input: { callId: 99 },
			path: '/api/v3/external/calls/99',
			withQuery: false,
			response: call,
			schemaKey: 'callsGet',
		},
		{
			name: 'calls.history',
			fn: Calls.history as AnyEndpoint,
			input: { limit: 10 },
			path: '/api/v3/external/calls/history',
			response: [call],
			schemaKey: 'callsHistory',
		},
		{
			name: 'users.list',
			fn: Users.list as AnyEndpoint,
			input: { limit: 2 },
			path: '/api/v1/external/users/all',
			response: [user],
			schemaKey: 'usersList',
		},
		{
			name: 'users.get',
			fn: Users.get as AnyEndpoint,
			input: { id: 1 },
			path: '/api/v1/external/users/get',
			response: user,
			schemaKey: 'usersGet',
		},
		{
			name: 'users.create',
			fn: Users.create as AnyEndpoint,
			input: { name: 'New', tel: '+48123123123' },
			path: '/api/v1/external/users/create',
			method: 'POST',
			response: user,
			schemaKey: 'usersCreate',
		},
		{
			name: 'users.update',
			fn: Users.update as AnyEndpoint,
			input: { id: 1, name: 'Updated', tel: '+48123123123' },
			path: '/api/v1/external/users/update',
			method: 'POST',
			response: user,
			schemaKey: 'usersUpdate',
		},
		{
			name: 'users.delete',
			fn: Users.remove as AnyEndpoint,
			input: { id: 1 },
			path: '/api/v1/external/users/delete',
			method: 'POST',
			response: null,
			schemaKey: 'usersDelete',
		},
		{
			name: 'widgets.get',
			fn: Widgets.get as AnyEndpoint,
			input: { id: 2 },
			path: '/api/v1/external/widgets/get',
			response: widget,
			schemaKey: 'widgetsGet',
		},
		{
			name: 'widgets.create',
			fn: Widgets.create as AnyEndpoint,
			input: { url: 'https://example.com' },
			path: '/api/v1/external/widgets/create',
			method: 'POST',
			response: widget,
			schemaKey: 'widgetsCreate',
		},
		{
			name: 'widgets.update',
			fn: Widgets.update as AnyEndpoint,
			input: { id: 2, url: 'https://example.com' },
			path: '/api/v1/external/widgets/update',
			method: 'POST',
			response: widget,
			schemaKey: 'widgetsUpdate',
		},
		{
			name: 'widgets.delete',
			fn: Widgets.remove as AnyEndpoint,
			input: { id: 2 },
			path: '/api/v1/external/widgets/delete',
			method: 'POST',
			response: null,
			schemaKey: 'widgetsDelete',
		},
		{
			name: 'widgets.call',
			fn: Widgets.call as AnyEndpoint,
			input: { id: 2, tel: '+48123123123' },
			path: '/api/v1/external/widgets/call',
			method: 'POST',
			response: { status: 'queued' },
			schemaKey: 'widgetsCall',
		},
		{
			name: 'widgets.callOrSchedule',
			fn: Widgets.callOrSchedule as AnyEndpoint,
			input: { id: 2, tel: '+48123123123' },
			path: '/api/v1/external/widgets/call-or-schedule',
			method: 'POST',
			response: { status: 'scheduled' },
			schemaKey: 'widgetsCallOrSchedule',
		},
	];

	it.each(cases)(
		'$name calls the expected path and validates output',
		async ({
			fn,
			input,
			path,
			method = 'GET',
			withQuery = method !== 'POST',
			response,
			schemaKey,
		}) => {
			mockRequest.mockResolvedValueOnce(response);
			const ctx = createContext();

			const result = await fn(ctx, input);

			const [, , requestOptions] = mockRequest.mock.calls[0] ?? [];
			expect(mockRequest).toHaveBeenCalledWith(
				path,
				ctx.key,
				expect.any(Object),
			);
			expect(requestOptions).toMatchObject({
				schema: CallPageEndpointOutputSchemas[schemaKey],
				...(method === 'POST'
					? { method: 'POST', body: input }
					: withQuery
						? { query: input }
						: {}),
			});
			expect(result).toEqual(response);
			expect(mockLog).toHaveBeenCalled();
		},
	);
});
