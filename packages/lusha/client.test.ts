import { ApiError } from 'corsair/http';
import {
	isOutOfCredits,
	isReplayable,
	LUSHA_API_BASE,
	makeLushaRequest,
} from './client';
import {
	accountUsageResponse,
	contactSearchResponse,
	outOfCreditsBody,
	rateLimitedBody,
	unauthorizedErrorBody,
	validationErrorBody,
} from './test-fixtures';
import {
	BASE,
	currentFetch,
	installFetchMock,
	jsonResponse,
	lastCall,
	mockFetch,
	restoreFetchMock,
	sentHeader,
} from './test-helpers';

// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each assertion narrows it to the fields it checks.
function captureError(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

describe('Lusha client', () => {
	it('sends the key in the api_key header, not Authorization', async () => {
		mockFetch(jsonResponse(contactSearchResponse));

		await makeLushaRequest('key-123', {
			method: 'POST',
			path: '/v3/contacts/search',
			body: { contacts: [{ id: '4389064654' }] },
		});

		expect(sentHeader('api_key')).toBe('key-123');
		expect(sentHeader('Authorization')).toBeNull();
	});

	it('builds the URL on the Lusha base and sends JSON bodies', async () => {
		mockFetch(jsonResponse(contactSearchResponse));

		await makeLushaRequest('key-123', {
			method: 'POST',
			path: '/v3/contacts/search',
			body: { contacts: [{ id: '4389064654' }] },
		});

		expect(lastCall().url).toBe(`${BASE}/v3/contacts/search`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentHeader('Content-Type')).toBe('application/json');
		expect(LUSHA_API_BASE).toBe('https://api.lusha.com');
	});

	it('omits the body on GET', async () => {
		mockFetch(jsonResponse(accountUsageResponse));

		await makeLushaRequest('key-123', {
			method: 'GET',
			path: '/v3/account/usage',
		});

		expect(lastCall().init.body).toBeUndefined();
	});

	it('sends query parameters on GET routes', async () => {
		mockFetch(jsonResponse({ data: [] }));

		await makeLushaRequest('key-123', {
			method: 'GET',
			path: '/api/subscriptions',
			query: { limit: 10, offset: 0, skipped: undefined },
		});

		expect(lastCall().url).toBe(`${BASE}/api/subscriptions?limit=10&offset=0`);
	});

	it('throws core ApiError with the documented message and errors[]', async () => {
		mockFetch(jsonResponse(validationErrorBody, { status: 400 }));

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'POST',
				path: '/v3/contacts/search',
				body: { contacts: [] },
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(400);
		expect(apiError.message).toContain('Validation failed');
		expect(apiError.message).toContain('entityType must be one of');
		// The key travels in a header; the error must never quote it.
		expect(JSON.stringify(error)).not.toContain('key-123');
	});

	it('parses the 401 shape', async () => {
		mockFetch(jsonResponse(unauthorizedErrorBody, { status: 401 }));

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'GET',
				path: '/v3/account/usage',
			}),
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect((error as ApiError).message).toContain('Missing API key');
	});

	it('drops the request body and query string from the error', async () => {
		mockFetch(jsonResponse(validationErrorBody, { status: 400 }));

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'POST',
				path: '/v3/contacts/search',
				query: { email: 'owner@example.com' },
				body: { contacts: [{ email: 'jane@example.com' }] },
			}),
		);

		const text = JSON.stringify({
			...(error as ApiError),
			message: (error as ApiError).message,
		});
		expect(text).not.toContain('jane@example.com');
		expect(text).not.toContain('owner@example.com');
		expect((error as ApiError).url).toBe(`${BASE}/v3/contacts/search`);
	});

	it('marks errors from replayable requests only', async () => {
		mockFetch(jsonResponse({ statusCode: 500 }, { status: 500 }));
		const free = await captureError(
			makeLushaRequest('key-123', {
				method: 'GET',
				path: '/v3/account/usage',
				replayable: true,
			}),
		);
		mockFetch(jsonResponse({ statusCode: 500 }, { status: 500 }));
		const metered = await captureError(
			makeLushaRequest('key-123', {
				method: 'POST',
				path: '/v3/contacts/enrich',
				body: { ids: ['4389064654'] },
			}),
		);

		expect(isReplayable(free)).toBe(true);
		expect(isReplayable(metered)).toBe(false);
	});

	it('lets transport failures through unchanged', async () => {
		const failure = new TypeError('fetch failed');
		currentFetchRejects(failure);

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'GET',
				path: '/v3/account/usage',
				replayable: true,
			}),
		);

		expect(error).toBe(failure);
		expect(isReplayable(error)).toBe(true);
	});

	it('says when a 429 comes from a used-up daily quota', async () => {
		const quota = () =>
			mockFetch(
				jsonResponse(
					{ statusCode: 429, message: 'Too many requests.' },
					{ status: 429, headers: { 'x-daily-requests-left': '0' } },
				),
			);
		quota();
		const error = await captureError(
			makeLushaRequest('key-123', { method: 'GET', path: '/v3/account/usage' }),
		);
		// One attempt: client.ts leaves 429 retries to error-handlers.ts.
		expect(currentFetch()).toHaveBeenCalledTimes(1);
		expect((error as ApiError).status).toBe(429);
		expect((error as ApiError).rateLimitRemaining).toBe(0);
		expect((error as ApiError).message).toContain(
			'daily request quota used up',
		);
	});

	it('flags the out-of-credits status and message', async () => {
		mockFetch(jsonResponse(outOfCreditsBody, { status: 402 }));
		const byStatus = await captureError(
			makeLushaRequest('key-123', { method: 'GET', path: '/v3/account/usage' }),
		);
		mockFetch(
			jsonResponse(
				{ statusCode: 403, message: 'Insufficient credits for this operation' },
				{ status: 403 },
			),
		);
		const byMessage = await captureError(
			makeLushaRequest('key-123', { method: 'GET', path: '/v3/account/usage' }),
		);
		mockFetch(jsonResponse(rateLimitedBody, { status: 400 }));
		const other = await captureError(
			makeLushaRequest('key-123', { method: 'GET', path: '/v3/account/usage' }),
		);

		expect(isOutOfCredits(byStatus)).toBe(true);
		expect(isOutOfCredits(byMessage)).toBe(true);
		expect(isOutOfCredits(other)).toBe(false);
		expect(isOutOfCredits(new Error('Insufficient credits'))).toBe(false);
	});
});

/** Replaces the queued-response helper for tests that need a rejection. */
// unknown: a rejection can be any value; the test asserts on the resulting
// error's narrowed fields instead.
function currentFetchRejects(reason: unknown): void {
	currentFetch().mockRejectedValueOnce(reason);
}
