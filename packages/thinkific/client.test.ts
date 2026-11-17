import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	makeThinkificRequest,
	THINKIFIC_API_BASE,
	THINKIFIC_RATE_LIMIT_CONFIG,
} from './client';

describe('Thinkific API client', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('uses the verified API v1 base URL and API-key headers', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response('{"ok":true}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			}),
		);

		await makeThinkificRequest('courses', 'api-key-test', 'school-test', {
			method: 'GET',
			query: { page: 2, limit: 25 },
		});

		const requestCall = fetchMock.mock.calls[0];
		if (!requestCall) throw new Error('Expected the Thinkific request');
		const [urlValue, init] = requestCall;
		const url = new URL(String(urlValue));
		expect(`${url.origin}${url.pathname}`).toBe(
			`${THINKIFIC_API_BASE}/courses`,
		);
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.get('limit')).toBe('25');

		const headers = new Headers(init?.headers);
		expect(headers.get('X-Auth-API-Key')).toBe('api-key-test');
		expect(headers.get('X-Auth-Subdomain')).toBe('school-test');
		expect(headers.get('Authorization')).toBeNull();
		expect(init?.credentials).toBeUndefined();
	});

	it('fails before network I/O when the API key is missing', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeThinkificRequest('courses', undefined, 'school-test', {
				method: 'GET',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('fails before network I/O when the site subdomain is missing', async () => {
		const fetchMock = jest.spyOn(globalThis, 'fetch');
		await expect(
			makeThinkificRequest('courses', 'api-key-test', undefined, {
				method: 'GET',
			}),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('preserves the provider status while removing personal data from errors', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
			new Response(
				JSON.stringify({
					errors: { email: ['private@example.com'] },
				}),
				{
					status: 422,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);

		// `unknown` because a rejected promise may contain any transport or provider value.
		const failure: unknown = await makeThinkificRequest(
			'users',
			'api-key-test',
			'school-test',
			{
				method: 'POST',
				body: { email: 'private@example.com', password: 'unit-test-secret' },
			},
		).catch((caught: unknown) => caught);

		if (!(failure instanceof ApiError)) {
			throw new Error('Expected a sanitized Thinkific ApiError');
		}
		expect(failure.status).toBe(422);
		expect(failure.body).toBeUndefined();
		expect(failure.request.body).toBeUndefined();
		expect(failure.request.query).toBeUndefined();
		expect(failure.message).not.toContain('private@example.com');
		expect(failure.message).not.toContain('unit-test-secret');
		expect(THINKIFIC_RATE_LIMIT_CONFIG.headerNames.resetTime).toBe(
			'RateLimit-Reset',
		);
	});
});
