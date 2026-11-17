import { AuthMissingError } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import {
	buildQuery,
	describePostgridError,
	isCredentialRejection,
	makePostgridRequest,
	POSTGRID_API_BASE,
	PostgridAPIError,
	readErrorCode,
} from './client';
import { captureError } from './test-helpers';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = jest.mocked(request);

/** An ApiError carrying one of PostGrid's error envelopes. */
function apiError(
	status: number,
	body: Record<string, unknown>, // unknown: PostGrid's error body, read by key.
) {
	return new ApiError(
		{ method: 'GET', url: '/contacts' },
		{
			url: `${POSTGRID_API_BASE}/contacts`,
			ok: false,
			status,
			statusText: 'error',
			body,
		},
		String(body.object ?? 'error'),
	);
}

beforeEach(() => {
	mockRequest.mockReset();
});

describe('PostGrid error body', () => {
	it('reads the nested error type and builds a message from it', () => {
		const body = {
			object: 'error',
			error: { type: 'invalid_api_key_error', message: 'Invalid API key abc' },
		};

		expect(readErrorCode(body)).toBe('invalid_api_key_error');
		expect(describePostgridError(401, body, 'fallback')).toBe(
			'PostGrid 401 invalid_api_key_error: Invalid API key abc',
		);
	});

	it('falls back to the top-level status on a missing route', () => {
		// The route-not-found shape is `{ status, message }`, not the usual one.
		const body = { status: 'error', message: 'Route not found.' };
		expect(readErrorCode(body)).toBe('error');
		expect(describePostgridError(404, body, 'fallback')).toBe(
			'PostGrid 404 error: Route not found.',
		);
	});

	it('treats every documented key rejection as an auth failure', () => {
		for (const type of [
			'missing_auth_error',
			'invalid_api_key_error',
			'invalid_oauth_token_error',
		]) {
			expect(
				isCredentialRejection(401, { object: 'error', error: { type } }),
			).toBe(true);
		}
	});

	it('does not call a 400 a credential problem', () => {
		expect(
			isCredentialRejection(400, {
				object: 'error',
				error: { type: 'validation_error' },
			}),
		).toBe(false);
	});
});

describe('buildQuery', () => {
	it('sends a list as the repeated key[] form PostGrid reads', () => {
		expect(buildQuery({ expand: ['template'], limit: 5 })).toEqual({
			'expand[]': ['template'],
			limit: 5,
		});
	});

	it('drops an undefined value rather than sending the word undefined', () => {
		expect(
			buildQuery({ skip: undefined, limit: 10, search: undefined }),
		).toEqual({
			limit: 10,
		});
	});
});

describe('makePostgridRequest', () => {
	it('sends the key in the x-api-key header', async () => {
		mockRequest.mockResolvedValue({ object: 'list', data: [] });

		await makePostgridRequest('test-key', { method: 'GET', path: '/contacts' });

		const [config, options] = mockRequest.mock.calls[0] ?? [];
		expect(config).toMatchObject({
			BASE: POSTGRID_API_BASE,
			HEADERS: { 'x-api-key': 'test-key', Accept: 'application/json' },
		});
		expect(options).toMatchObject({ method: 'GET', url: '/contacts' });
	});

	it('sends the Idempotency-Key header only when one is supplied', async () => {
		mockRequest.mockResolvedValue({});

		await makePostgridRequest('key', {
			method: 'POST',
			path: '/letters',
			body: { to: { id: 'contact_1' } },
			idempotencyKey: 'attempt-1',
		});
		const withKey = mockRequest.mock.calls[0]?.[0] as {
			HEADERS: Record<string, string>;
		};
		expect(withKey.HEADERS['Idempotency-Key']).toBe('attempt-1');
		expect(withKey.HEADERS['Content-Type']).toBe('application/json');

		await makePostgridRequest('key', { method: 'GET', path: '/contacts' });
		const withoutKey = mockRequest.mock.calls[1]?.[0] as {
			HEADERS: Record<string, string>;
		};
		expect(withoutKey.HEADERS['Idempotency-Key']).toBeUndefined();
		// A bodyless request must not claim a JSON body it is not sending.
		expect(withoutKey.HEADERS['Content-Type']).toBeUndefined();
	});

	it('throws AuthMissingError without a request when the key is blank', async () => {
		await expect(
			makePostgridRequest('  ', { method: 'GET', path: '/contacts' }),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('refuses a key carrying a newline, which would break the header', async () => {
		await expect(
			makePostgridRequest('key\nX-Injected: 1', {
				method: 'GET',
				path: '/contacts',
			}),
		).rejects.toThrow(/must not contain newlines/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('reports a rejected key as a credential failure without echoing the key', async () => {
		// PostGrid repeats the key it was given in this message, so the client has
		// to remove it: the message reaches error.message and error.stack, which
		// MCP hands back to the agent, and JSON.stringify omits both.
		mockRequest.mockRejectedValue(
			apiError(401, {
				object: 'error',
				error: {
					type: 'invalid_api_key_error',
					message: 'Invalid API key secret-key',
				},
			}),
		);

		const error = await captureError(
			makePostgridRequest('secret-key', { method: 'GET', path: '/contacts' }),
		);

		// Core's ApiError passes through, so its status and body stay readable.
		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(401);
		expect(error.request.method).toBe('GET');
		expect(error.message).toContain('[REDACTED]');
		expect(error.message).not.toContain('secret-key');
		expect(String(error.stack)).not.toContain('secret-key');
		expect(JSON.stringify(error)).not.toContain('secret-key');
	});

	it('keeps status and Retry-After on a rate limit', async () => {
		const rateLimited = new ApiError(
			{ method: 'GET', url: '/contacts' },
			{
				url: `${POSTGRID_API_BASE}/contacts`,
				ok: false,
				status: 429,
				statusText: 'Too Many Requests',
				body: { object: 'error', error: { type: 'rate_limit_error' } },
			},
			'Too Many Requests',
			{ retryAfter: 2000 },
		);
		mockRequest.mockRejectedValue(rateLimited);

		const error = await captureError(
			makePostgridRequest('key', { method: 'GET', path: '/contacts' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		if (!(error instanceof ApiError)) return;
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
	});

	it('flags a dropped connection as a transport failure', async () => {
		mockRequest.mockRejectedValue(new Error('fetch failed'));

		const error = await captureError(
			makePostgridRequest('key', { method: 'POST', path: '/letters' }),
		);

		expect(error).toBeInstanceOf(PostgridAPIError);
		if (!(error instanceof PostgridAPIError)) return;
		expect(error.transport).toBe(true);
		expect(error.method).toBe('POST');
	});
});
