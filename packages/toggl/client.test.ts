import { ApiError } from 'corsair/http';
import { makeTogglRequest } from './client';
import { errorHandlers } from './error-handlers';

// Deliberately not credential-shaped: a real Toggl token is 32 hex characters,
// so this cannot be mistaken for one or used against the API.
const TOKEN = 'fake-toggl-token-for-tests-only';

type ErrorContext = Parameters<typeof errorHandlers.DEFAULT.match>[1];

// The handlers only read `operation`; a narrow cast keeps the fixture readable
// without restating the whole plugin context.
const context = { operation: 'me.get' } as ErrorContext;

/**
 * Builds an ApiError carrying a given status and body, for asserting which
 * handler a response routes to.
 */
function apiError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'me' },
		{ url: 'me', ok: false, status, statusText: message, body: message },
		message,
	);
}

describe('makeTogglRequest', () => {
	const originalFetch = global.fetch;

	afterEach(() => {
		global.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	function mockFetch(body: unknown, status = 200) {
		const spy = jest.fn(async () => ({
			ok: status >= 200 && status < 300,
			status,
			statusText: 'OK',
			url: 'https://api.track.toggl.com/api/v9/me',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			json: async () => body,
			text: async () => JSON.stringify(body),
		}));
		global.fetch = spy as unknown as typeof global.fetch;
		return spy;
	}

	// The shared request layer normalises headers into a Headers instance.
	function authHeaderOf(init: RequestInit): string {
		const headers = init.headers;
		if (headers instanceof Headers) {
			return headers.get('Authorization') ?? '';
		}
		if (Array.isArray(headers)) {
			return Object.fromEntries(headers).Authorization ?? '';
		}
		return (headers as Record<string, string> | undefined)?.Authorization ?? '';
	}

	it('authenticates with HTTP Basic using api_token as the password', async () => {
		const spy = mockFetch({ id: 1 });
		await makeTogglRequest('me', TOKEN);

		const [, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
		const expected = `Basic ${Buffer.from(`${TOKEN}:api_token`).toString('base64')}`;
		expect(authHeaderOf(init)).toBe(expected);
	});

	it('does not send the raw token as a bearer credential', async () => {
		const spy = mockFetch({ id: 1 });
		await makeTogglRequest('me', TOKEN);

		const auth = authHeaderOf(init0(spy));
		expect(auth).toMatch(/^Basic /);
		expect(auth).not.toContain('Bearer');
		// The token must be base64-encoded, never sent in the clear.
		expect(auth).not.toContain(TOKEN);
	});

	function init0(spy: ReturnType<typeof mockFetch>): RequestInit {
		const [, init] = spy.mock.calls[0] as unknown as [string, RequestInit];
		return init;
	}

	it('targets the Track API v9 base url', async () => {
		const spy = mockFetch({ id: 1 });
		await makeTogglRequest('workspaces/3000001/clients', TOKEN);

		const [url] = spy.mock.calls[0] as unknown as [string];
		expect(url).toBe(
			'https://api.track.toggl.com/api/v9/workspaces/3000001/clients',
		);
	});

	it('returns the parsed response body', async () => {
		mockFetch({ id: 4000001, name: 'Acme Corp' });
		const result = await makeTogglRequest<{ id: number; name: string }>(
			'workspaces/3000001/clients/4000001',
			TOKEN,
		);
		expect(result).toEqual({ id: 4000001, name: 'Acme Corp' });
	});
});

describe('error handlers', () => {
	it('matches a 429 as a rate limit error and retries', async () => {
		const error = apiError(429, 'Too Many Requests');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error, context)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error, context);
		expect(result.maxRetries).toBe(5);
	});

	it('treats a 402 as the sliding-window quota, not a payment failure', async () => {
		// Toggl uses 402 for its per-organization request quota, which clears
		// with time, so it is retryable in the same way as a 429.
		const error = apiError(402, 'Payment Required');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error, context)).toBe(true);

		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error, context);
		expect(result.maxRetries).toBe(5);
	});

	it('treats a plain 403 as a permission error', async () => {
		const error = apiError(403, 'Forbidden');
		expect(errorHandlers.PERMISSION_ERROR.match(error, context)).toBe(true);

		const result = await errorHandlers.PERMISSION_ERROR.handler(error, context);
		expect(result.maxRetries).toBe(0);
	});

	it('classifies a 403 with an invalid-token body as an auth error, not a permission error', () => {
		// Toggl answers a bad or revoked token with 403 rather than 401, so the
		// body is the only thing separating the two cases. They must not both
		// match, or a dead credential gets reported as a missing permission.
		const error = apiError(403, 'Incorrect username and/or password');

		expect(errorHandlers.AUTH_ERROR.match(error, context)).toBe(true);
		expect(errorHandlers.PERMISSION_ERROR.match(error, context)).toBe(false);
	});

	it('matches an incorrect-credentials body as an auth error', () => {
		const error = new Error('Incorrect username and/or password');
		expect(errorHandlers.AUTH_ERROR.match(error, context)).toBe(true);
	});

	it('does not retry authentication failures', async () => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		const error = apiError(401, 'Unauthorized');
		const result = await errorHandlers.AUTH_ERROR.handler(error, context);
		expect(result.maxRetries).toBe(0);
	});

	it('retries transient network failures', async () => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		const error = new Error('fetch failed');
		expect(errorHandlers.NETWORK_ERROR.match(error, context)).toBe(true);

		const result = await errorHandlers.NETWORK_ERROR.handler(error, context);
		expect(result.maxRetries).toBe(3);
	});

	it('matches a 404 as not found without retrying', async () => {
		jest.spyOn(console, 'warn').mockImplementation(() => {});
		const error = apiError(404, 'Not Found');
		expect(errorHandlers.NOT_FOUND_ERROR.match(error, context)).toBe(true);

		const result = await errorHandlers.NOT_FOUND_ERROR.handler(error, context);
		expect(result.maxRetries).toBe(0);
	});

	it('matches a 400 as a validation error', () => {
		const error = apiError(400, 'Bad Request');
		expect(errorHandlers.VALIDATION_ERROR.match(error, context)).toBe(true);
	});

	it('falls back to the default handler for unknown failures', async () => {
		jest.spyOn(console, 'error').mockImplementation(() => {});
		const error = new Error('something unexpected');
		expect(errorHandlers.DEFAULT.match(error, context)).toBe(true);

		const result = await errorHandlers.DEFAULT.handler(error, context);
		expect(result.maxRetries).toBe(0);
	});
});
