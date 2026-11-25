import { LUSHA_API_BASE, LushaAPIError, makeLushaRequest } from './client';
import {
	accountUsageResponse,
	contactSearchResponse,
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
			metered: true,
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

	it('parses the documented error shape and folds errors[] into the message', async () => {
		mockFetch(jsonResponse(validationErrorBody, { status: 400 }));

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'POST',
				path: '/v3/contacts/search',
				body: { contacts: [] },
				metered: true,
			}),
		);

		expect(error).toBeInstanceOf(LushaAPIError);
		const lushaError = error as LushaAPIError;
		expect(lushaError.status).toBe(400);
		expect(lushaError.message).toContain('Validation failed');
		expect(lushaError.message).toContain('entityType must be one of');
		// The key travels in a header; the error must never quote it.
		expect(JSON.stringify(error)).not.toContain('key-123');
	});

	it('parses the live 401 shape, which has error and no errors[]', async () => {
		mockFetch(jsonResponse(unauthorizedErrorBody, { status: 401 }));

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'GET',
				path: '/v3/account/usage',
			}),
		);

		expect(error).toBeInstanceOf(LushaAPIError);
		expect((error as LushaAPIError).status).toBe(401);
		expect((error as LushaAPIError).isAuthError).toBe(true);
		expect((error as LushaAPIError).message).toContain('Missing API key');
	});

	it('keeps a gateway Retry-After on the error', async () => {
		mockFetch(
			jsonResponse(
				{ statusCode: 429, message: 'Too Many Requests' },
				{
					status: 429,
					headers: { 'Retry-After': '7' },
				},
			),
		);

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'GET',
				path: '/v3/account/usage',
			}),
		);

		expect(error).toBeInstanceOf(LushaAPIError);
		expect((error as LushaAPIError).retryAfter).toBe(7000);
	});

	it('marks a 5xx on a metered call not safe to replay', async () => {
		mockFetch(jsonResponse({ statusCode: 500 }, { status: 500 }));

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'POST',
				path: '/v3/contacts/enrich',
				body: { ids: ['4389064654'] },
				metered: true,
			}),
		);

		expect((error as LushaAPIError).safeToReplay).toBe(false);
	});

	it('marks a 5xx on a free call safe to replay', async () => {
		mockFetch(jsonResponse({ statusCode: 500 }, { status: 500 }));

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'GET',
				path: '/v3/account/usage',
			}),
		);

		expect((error as LushaAPIError).safeToReplay).toBe(true);
	});

	it('marks transport failures safe to replay and keeps the cause', async () => {
		currentFetchRejects(new TypeError('fetch failed'));

		const error = await captureError(
			makeLushaRequest('key-123', {
				method: 'POST',
				path: '/v3/contacts/enrich',
				body: { ids: ['4389064654'] },
				metered: true,
			}),
		);

		const lushaError = error as LushaAPIError;
		expect(lushaError.safeToReplay).toBe(true);
		expect(lushaError.status).toBeUndefined();
		expect(lushaError.cause).toBeInstanceOf(TypeError);
	});

	it('flags the documented out-of-credits message from any status', () => {
		const byStatus = new LushaAPIError(
			'Lusha 402: Insufficient credits for this operation',
			{
				status: 402,
			},
		);
		const byMessage = new LushaAPIError(
			'Lusha 429: Insufficient credits for this operation',
			{ status: 429 },
		);
		expect(byStatus.outOfCredits).toBe(true);
		expect(byMessage.outOfCredits).toBe(true);
		expect(
			new LushaAPIError('Lusha 429: Too many requests', { status: 429 })
				.outOfCredits,
		).toBe(false);
	});

	// The key-hygiene check on the error surface: message and inspect output
	// never carry the key or the raw body.
	it('keeps the key and the raw body off the error surface', async () => {
		mockFetch(
			jsonResponse(
				{
					statusCode: 400,
					message: 'Validation failed',
					errors: ['contacts must be an array'],
				},
				{ status: 400 },
			),
		);

		const error = await captureError(
			makeLushaRequest('secret-key-value', {
				method: 'POST',
				path: '/v3/contacts/search',
				body: { contacts: 'not-an-array' },
				metered: true,
			}),
		);

		expect(JSON.stringify(error)).not.toContain('secret-key-value');
		expect(JSON.stringify(error)).not.toContain('must be an array');
	});
});

/** Replaces the queued-response helper for tests that need a rejection. */
// unknown: a rejection can be any value; the test asserts on the resulting
// LushaAPIError's narrowed fields instead.
function currentFetchRejects(reason: unknown): void {
	currentFetch().mockRejectedValueOnce(reason);
}
