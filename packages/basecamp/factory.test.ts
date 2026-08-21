import type { ApiRequestOptions } from 'corsair/http';
import { ApiError, request } from 'corsair/http';
import { BasecampAPIError, BasecampSchemaError } from './client';
import { basecamp } from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;
type Endpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

const plugin = basecamp({ key: 'test-access-token', accountId: '42' });
const endpointGroups = plugin.endpoints as unknown as Record<
	string,
	Record<string, Endpoint>
>;

function endpoint(group: string, key: string): Endpoint {
	const found = endpointGroups[group]?.[key];
	if (!found) throw new Error('Missing endpoint ' + group + '.' + key);
	return found;
}

function context(overrides: Record<string, unknown> = {}) {
	return {
		key: 'stale-access-token',
		options: {
			accountId: '42',
			userAgent: 'Corsair Test (test@example.com)',
		},
		keys: { get_account_id: jest.fn().mockResolvedValue('42') },
		db: {},
		database: undefined,
		$getAccountId: jest.fn().mockResolvedValue('test-corsair-account'),
		...overrides,
	};
}

function unauthorized(): ApiError {
	return new ApiError(
		{ method: 'GET', url: '/42/projects/1' } as ApiRequestOptions,
		{
			url: 'https://3.basecampapi.com/42/projects/1',
			ok: false,
			status: 401,
			statusText: 'Unauthorized',
			body: undefined,
		},
		'Unauthorized',
	);
}

function authorizationOf(callIndex: number): unknown {
	const call = mockRequest.mock.calls[callIndex];
	if (!call) throw new Error('request call ' + callIndex + ' was not made');
	return (call[0].HEADERS as Record<string, unknown> | undefined)
		?.Authorization;
}

beforeEach(() => mockRequest.mockReset());

describe('Basecamp endpoint schema validation', () => {
	it('rejects malformed input before reaching Basecamp', async () => {
		const call = endpoint('projectsAndTemplates', 'getProject')(context(), {
			projectId: 'not-a-number',
		});
		await expect(call).rejects.toBeInstanceOf(BasecampSchemaError);
		await expect(call).rejects.toMatchObject({
			direction: 'input',
			issues: [expect.objectContaining({ path: 'projectId' })],
		});
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a response that violates the advertised output type', async () => {
		mockRequest.mockResolvedValueOnce({ id: 'seven' });
		const call = endpoint('projectsAndTemplates', 'getProject')(context(), {
			projectId: 1,
		});
		await expect(call).rejects.toBeInstanceOf(BasecampSchemaError);
		await expect(call).rejects.toMatchObject({ direction: 'output' });
	});

	it('returns the parsed response and keeps fields Basecamp adds', async () => {
		mockRequest.mockResolvedValueOnce({
			id: 1,
			status: 'active',
			created_at: 'now',
			updated_at: 'now',
			name: 'Test',
			url: 'https://3.basecampapi.com/42/projects/1.json',
			app_url: 'https://3.basecamp.com/42/projects/1',
			future_field: 'kept',
		});
		await expect(
			endpoint('projectsAndTemplates', 'getProject')(context(), {
				projectId: 1,
			}),
		).resolves.toMatchObject({ id: 1, name: 'Test', future_field: 'kept' });
	});
});

describe('Basecamp 401 refresh', () => {
	it('force-refreshes and retries once when the stored token is rejected', async () => {
		mockRequest.mockRejectedValueOnce(unauthorized());
		mockRequest.mockResolvedValueOnce({
			id: 1,
			status: 'active',
			created_at: 'now',
			updated_at: 'now',
			name: 'Test',
			url: 'https://3.basecampapi.com/42/projects/1.json',
			app_url: 'https://3.basecamp.com/42/projects/1',
		});
		const refreshAuth = jest.fn().mockResolvedValue('fresh-access-token');

		await expect(
			endpoint('projectsAndTemplates', 'getProject')(
				context({ _refreshAuth: refreshAuth }),
				{ projectId: 1 },
			),
		).resolves.toMatchObject({ id: 1 });

		expect(refreshAuth).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledTimes(2);
		expect(authorizationOf(0)).toBe('Bearer stale-access-token');
		expect(authorizationOf(1)).toBe('Bearer fresh-access-token');
	});

	it('surfaces the 401 when no refresh callback is attached', async () => {
		mockRequest.mockRejectedValueOnce(unauthorized());
		await expect(
			endpoint('projectsAndTemplates', 'getProject')(context(), {
				projectId: 1,
			}),
		).rejects.toMatchObject({ name: 'BasecampAPIError', status: 401 });
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});

	it('retries only once and then reports the second rejection', async () => {
		mockRequest.mockRejectedValueOnce(unauthorized());
		mockRequest.mockRejectedValueOnce(unauthorized());
		const refreshAuth = jest.fn().mockResolvedValue('fresh-access-token');

		await expect(
			endpoint('projectsAndTemplates', 'getProject')(
				context({ _refreshAuth: refreshAuth }),
				{ projectId: 1 },
			),
		).rejects.toBeInstanceOf(BasecampAPIError);
		expect(refreshAuth).toHaveBeenCalledTimes(1);
		expect(mockRequest).toHaveBeenCalledTimes(2);
	});

	it('does not refresh for keyed chatbot calls, which send no bearer token', async () => {
		mockRequest.mockRejectedValueOnce(unauthorized());
		const refreshAuth = jest.fn().mockResolvedValue('fresh-access-token');

		await expect(
			endpoint('campfireAndChatbots', 'createChatbotLine')(
				context({ _refreshAuth: refreshAuth }),
				{ chatbotKey: 'secret', bucketId: 1, campfireId: 2, content: 'hi' },
			),
		).rejects.toBeInstanceOf(BasecampAPIError);
		expect(refreshAuth).not.toHaveBeenCalled();
		expect(mockRequest).toHaveBeenCalledTimes(1);
	});
});
