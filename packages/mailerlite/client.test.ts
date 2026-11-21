import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	MAILERLITE_API_BASE,
	MAILERLITE_API_VERSION,
	makeMailerLiteRequest,
} from './client';
import { errorHandlers } from './error-handlers';

const fetchMock = jest.spyOn(globalThis, 'fetch');

afterEach(() => {
	fetchMock.mockReset();
});

afterAll(() => {
	fetchMock.mockRestore();
});

describe('MailerLite HTTP client', () => {
	it('uses Bearer authentication, JSON headers, the current API host and date version', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{"data":[]}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);

		await makeMailerLiteRequest(
			{ method: 'GET', url: '/groups', query: { limit: 1 } },
			'private-api-key',
		);

		const [url, init] = fetchMock.mock.calls[0] ?? [];
		const headers = new Headers(init?.headers);
		expect(String(url)).toBe(`${MAILERLITE_API_BASE}/groups?limit=1`);
		expect(headers.get('Authorization')).toBe('Bearer private-api-key');
		expect(headers.get('Accept')).toBe('application/json');
		expect(headers.get('Content-Type')).toBe('application/json');
		expect(headers.get('X-Version')).toBe(MAILERLITE_API_VERSION);
	});

	it('omits Authorization for a keyless low-level call', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{"data":[]}', {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);

		await makeMailerLiteRequest({ method: 'GET', url: '/groups' });
		const headers = new Headers(fetchMock.mock.calls[0]?.[1]?.headers);
		expect(headers.has('Authorization')).toBe(false);
	});

	it('fails fast for an explicitly empty key', async () => {
		await expect(
			makeMailerLiteRequest({ method: 'GET', url: '/groups' }, ''),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('retains the 429 Retry-After value but never replays a write', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(
				'{"message":"Too Many Attempts.","email":"person@mailerlite.test"}',
				{
					status: 429,
					statusText: 'Too Many Requests',
					headers: { 'content-type': 'application/json', 'retry-after': '4' },
				},
			),
		);

		// `unknown` because a rejected promise may carry any value; the ApiError
		// check below narrows it before asserting provider status metadata.
		const rejected: unknown = await makeMailerLiteRequest(
			{
				method: 'POST',
				url: '/subscribers',
				body: { email: 'person@mailerlite.test' },
			},
			'private-api-key',
		).catch((error: unknown) => error);

		if (!(rejected instanceof ApiError))
			throw new Error('Expected sanitized ApiError');
		expect(rejected.status).toBe(429);
		expect(rejected.retryAfter).toBe(4000);
		expect(rejected.request.url).toBe('/api/[redacted]');
		expect(rejected.request.body).toBeUndefined();
		expect(rejected.message).not.toContain('person@mailerlite.test');
		expect(JSON.stringify(rejected.body)).not.toContain(
			'person@mailerlite.test',
		);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(rejected)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(rejected),
		).resolves.toEqual({ maxRetries: 0 });
	});
});
