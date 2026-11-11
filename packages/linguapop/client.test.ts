import { inspect } from 'node:util';
import {
	describeLinguapopError,
	isInvalidApiKeyBody,
	LINGUAPOP_API_BASE,
	LinguapopAPIError,
	makeLinguapopRequest,
} from './client';
import {
	htmlFallbackBody,
	invalidKeyBody,
	languagesFixture,
	validationProblemBody,
} from './test-fixtures';
import {
	blockFetch,
	jsonResponse,
	lastCall,
	linguapopFailure,
	problemResponse,
	textResponse,
} from './test-helpers';

const API_KEY = 'lp-secret-test-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = blockFetch();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeLinguapopRequest', () => {
	it('uses the documented base URL', () => {
		expect(LINGUAPOP_API_BASE).toBe('https://app.linguapop.eu');
	});

	it('sends a GET with no key and no body', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(languagesFixture));

		const body = await makeLinguapopRequest(API_KEY, {
			method: 'GET',
			action: 'getLanguages',
		});

		const call = lastCall(fetchMock);
		expect(call.url).toBe('https://app.linguapop.eu/api/actions/getLanguages');
		expect(call.method).toBe('GET');
		expect(call.rawBody).toBeUndefined();
		expect(call.url).not.toContain(API_KEY);
		expect(body).toEqual(languagesFixture);
	});

	it('puts apiKey in the JSON body of a POST and nowhere else', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

		await makeLinguapopRequest(API_KEY, {
			method: 'POST',
			action: 'sendInvitation',
			body: { email: 'a@example.com', languageCode: 'eng' },
		});

		const call = lastCall(fetchMock);
		expect(call.method).toBe('POST');
		expect(call.headers.get('content-type')).toBe('application/json');
		expect(call.body).toEqual({
			email: 'a@example.com',
			languageCode: 'eng',
			apiKey: API_KEY,
		});
		expect(call.url).not.toContain(API_KEY);
		expect(JSON.stringify([...call.headers.entries()])).not.toContain(API_KEY);
	});

	it('lets the account key win over a body field named apiKey', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ ok: true }));

		await makeLinguapopRequest(API_KEY, {
			method: 'POST',
			action: 'sendInvitation',
			body: { apiKey: 'attacker-key', email: 'a@example.com' },
		});

		expect(lastCall(fetchMock).body).toMatchObject({ apiKey: API_KEY });
		expect(lastCall(fetchMock).rawBody).not.toContain('attacker-key');
	});

	it('returns an HTML body as text, for the output schema to reject', async () => {
		fetchMock.mockResolvedValueOnce(
			textResponse(htmlFallbackBody, 200, 'text/html'),
		);

		await expect(
			makeLinguapopRequest(API_KEY, { method: 'GET', action: 'getResults' }),
		).resolves.toBe(htmlFallbackBody);
	});
});

describe('LinguapopAPIError from an HTTP response', () => {
	it('tags a 400 text answer about the key as an invalid key', async () => {
		fetchMock.mockResolvedValueOnce(textResponse(invalidKeyBody, 400));

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, {
				method: 'POST',
				action: 'sendInvitation',
				body: {},
			}),
		);

		expect(error.status).toBe(400);
		expect(error.method).toBe('POST');
		expect(error.invalidApiKey).toBe(true);
		expect(error.isAuthError).toBe(true);
		expect(error.transport).toBe(false);
		expect(error.message).toBe(`Linguapop 400: ${invalidKeyBody}`);
	});

	it('reads field errors from a problem+json validation failure', async () => {
		fetchMock.mockResolvedValueOnce(problemResponse(validationProblemBody));

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, {
				method: 'POST',
				action: 'sendInvitation',
				body: {},
			}),
		);

		expect(error.status).toBe(400);
		expect(error.invalidApiKey).toBe(false);
		expect(error.isAuthError).toBe(false);
		expect(error.message).toBe(
			'Linguapop 400: Email: The Email field is required.; ApiKey: The ApiKey field is required.; LanguageCode: The LanguageCode field is required.',
		);
	});

	it('treats 401 and 403 as auth errors', async () => {
		for (const status of [401, 403]) {
			fetchMock.mockResolvedValueOnce(textResponse('denied', status));
			const error = await linguapopFailure(
				makeLinguapopRequest(API_KEY, {
					method: 'POST',
					action: 'sendInvitation',
					body: {},
				}),
			);
			expect(error.isAuthError).toBe(true);
			expect(error.invalidApiKey).toBe(false);
		}
	});

	it('reads Retry-After from a 429 and flags it as a rate limit', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('slow down', {
				status: 429,
				headers: { 'Retry-After': '7', 'Content-Type': 'text/plain' },
			}),
		);

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, { method: 'GET', action: 'getLanguages' }),
		);

		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(7000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('records the method on a 5xx so replay can be decided', async () => {
		fetchMock.mockResolvedValueOnce(textResponse('boom', 503));

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, {
				method: 'POST',
				action: 'sendInvitation',
				body: {},
			}),
		);

		expect(error.status).toBe(503);
		expect(error.method).toBe('POST');
	});

	it('falls back to the status when the body is an HTML page', async () => {
		fetchMock.mockResolvedValueOnce(
			textResponse(htmlFallbackBody, 502, 'text/html'),
		);

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, { method: 'GET', action: 'getLanguages' }),
		);

		expect(error.message).toBe('Linguapop HTTP 502');
	});
});

describe('API key hygiene', () => {
	it('keeps the key out of the error even when the server echoes it', async () => {
		fetchMock.mockResolvedValueOnce(
			problemResponse({
				title: `Bad value ${API_KEY}`,
				errors: { ApiKey: [`The value '${API_KEY}' is not valid.`] },
			}),
		);

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, {
				method: 'POST',
				action: 'sendInvitation',
				body: { email: 'a@example.com' },
			}),
		);

		expect(error.message).not.toContain(API_KEY);
		expect(error.message).toContain('[redacted]');
		expect(error.cause).toBeUndefined();
		expect(Object.keys(error)).not.toContain('body');
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(inspect(error, { depth: 10 })).not.toContain(API_KEY);
		expect(String(error.stack)).not.toContain(API_KEY);
	});

	it('does not retain the ApiError, whose request holds the body', async () => {
		fetchMock.mockResolvedValueOnce(textResponse(invalidKeyBody, 400));

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, {
				method: 'POST',
				action: 'sendInvitation',
				body: { email: 'a@example.com' },
			}),
		);

		expect(error.cause).toBeUndefined();
		expect(inspect(error, { depth: 10, showHidden: true })).not.toContain(
			API_KEY,
		);
	});
});

describe('LinguapopAPIError from a transport failure', () => {
	it('flags a dropped connection and keeps its cause', async () => {
		const reset = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(reset);

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, { method: 'GET', action: 'getLanguages' }),
		);

		expect(error.transport).toBe(true);
		expect(error.timedOut).toBe(false);
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBe(reset);
		expect(inspect(error, { depth: 10 })).not.toContain(API_KEY);
	});

	it('flags a timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		const error = await linguapopFailure(
			makeLinguapopRequest(API_KEY, {
				method: 'POST',
				action: 'sendInvitation',
				body: {},
			}),
		);

		expect(error.transport).toBe(true);
		expect(error.timedOut).toBe(true);
		expect(error.method).toBe('POST');
	});
});

describe('error helpers', () => {
	it('recognises only a 400 text answer about the integration', () => {
		expect(isInvalidApiKeyBody(400, invalidKeyBody)).toBe(true);
		expect(isInvalidApiKeyBody(400, 'Something else')).toBe(false);
		expect(isInvalidApiKeyBody(500, invalidKeyBody)).toBe(false);
		expect(isInvalidApiKeyBody(400, validationProblemBody)).toBe(false);
	});

	it('truncates a long detail', () => {
		const message = describeLinguapopError(400, 'x'.repeat(1000), API_KEY);

		expect(message.length).toBeLessThan(330);
		expect(message.endsWith('...')).toBe(true);
	});

	it('falls back to the title when there are no field errors', () => {
		expect(describeLinguapopError(400, { title: 'Nope' }, API_KEY)).toBe(
			'Linguapop 400: Nope',
		);
	});

	it('builds an error by hand with safe defaults', () => {
		const error = new LinguapopAPIError('x');

		expect(error.isAuthError).toBe(false);
		expect(error.isRateLimit).toBe(false);
		expect(error.transport).toBe(false);
		expect(error.timedOut).toBe(false);
	});
});
