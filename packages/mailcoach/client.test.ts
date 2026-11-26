import { ApiError } from 'corsair/http';
import { makeMailcoachRequest, normalizeMailcoachApiUrl } from './client';

const API_URL = 'https://team.mailcoach.app/api';
const API_KEY = 'test-mailcoach-token';

describe('Mailcoach client', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('accepts a team API URL and normalizes its trailing slash', () => {
		expect(normalizeMailcoachApiUrl('https://team.mailcoach.app/api/')).toBe(
			API_URL,
		);
		expect(normalizeMailcoachApiUrl('https://sub.team.mailcoach.app/api')).toBe(
			'https://sub.team.mailcoach.app/api',
		);
	});

	it.each([
		'http://team.mailcoach.app/api',
		'https://mailcoach.app/api',
		'https://attacker.example/api',
		'https://team.mailcoach.app.evil.example/api',
		'https://user:password@team.mailcoach.app/api',
		'https://team.mailcoach.app/api/v2',
		'https://team.mailcoach.app/api?token=secret',
		'https://team.mailcoach.app:8443/api',
	])('rejects an unsafe or undocumented team API URL: %s', (apiUrl) => {
		expect(() => normalizeMailcoachApiUrl(apiUrl)).toThrow(
			/Mailcoach apiUrl must use https/,
		);
	});

	it('sends Bearer authentication to the configured team URL', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({ data: { id: 7, email: 'owner@example.invalid' } }),
				{
					status: 200,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);

		const response = await makeMailcoachRequest<{ data: { id: number } }>(
			'/user',
			API_KEY,
			{ apiUrl: API_URL },
		);

		expect(response.data.id).toBe(7);
		const [requestUrl, requestInit] = fetchSpy.mock.calls[0] ?? [];
		expect(String(requestUrl)).toBe(`${API_URL}/user`);
		const headers = new Headers(requestInit?.headers);
		expect(headers.get('Authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('Accept')).toBe('application/json');
		expect(requestInit?.credentials).toBeUndefined();
	});

	it('fails for an explicitly empty API key before network I/O', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch');

		await expect(
			makeMailcoachRequest('/user', '', { apiUrl: API_URL }),
		).rejects.toThrow(/auth-missing:mailcoach:api_key/);
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('requires a configured team API URL and rejects cross-host pagination links', async () => {
		const fetchSpy = jest.spyOn(globalThis, 'fetch');

		await expect(makeMailcoachRequest('/user', API_KEY)).rejects.toThrow(
			/apiUrl is required/,
		);
		await expect(
			makeMailcoachRequest('/email-lists', API_KEY, {
				apiUrl: API_URL,
				nextPageUrl: 'https://attacker.example/api/email-lists?page=2',
			}),
		).rejects.toThrow(/pagination link must remain on the configured team API/);
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it('omits submitted request data from propagated provider errors', async () => {
		const subscriberEmail = 'private-person@example.invalid';
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({ message: `Invalid address ${subscriberEmail}` }),
				{
					status: 422,
					statusText: subscriberEmail,
					headers: { 'Content-Type': 'application/json' },
				},
			),
		);

		// `unknown` because a rejected promise may carry any runtime value; the
		// instanceof check below narrows the transport's sanitized ApiError.
		const caught = await makeMailcoachRequest('/subscribers', API_KEY, {
			apiUrl: API_URL,
			method: 'POST',
			body: { email: subscriberEmail },
			query: { filter: { email: subscriberEmail } },
		}).catch((error: unknown) => error);

		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError))
			throw new Error('Expected sanitized ApiError');
		expect(caught.status).toBe(422);
		expect(caught.statusText).toBe('Mailcoach API response');
		expect(caught.message).not.toContain(subscriberEmail);
		expect(caught.url).not.toContain(subscriberEmail);
		expect(JSON.stringify(caught.body)).not.toContain(subscriberEmail);
		expect(caught.request.url).not.toContain(subscriberEmail);
		expect(caught.request.query).toBeUndefined();
		expect(caught.request.body).toBeUndefined();
	});

	it('preserves plain-text send errors as sanitized status errors', async () => {
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response('Delivery to recipient@example.invalid failed', {
				status: 422,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);

		// `unknown` because rejection values are untyped until checked below.
		const caught = await makeMailcoachRequest(
			'/transactional-mails/send',
			API_KEY,
			{
				apiUrl: API_URL,
				method: 'POST',
				body: { to: 'recipient@example.invalid' },
			},
		).catch((error: unknown) => error);

		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError))
			throw new Error('Expected sanitized ApiError');
		expect(caught.status).toBe(422);
		expect(caught.message).not.toContain('recipient@example.invalid');
		expect(caught.body).toContain('omitted');
	});

	it("keeps Mailcoach's validation message and field errors, masking emails", async () => {
		// Live 11-22: subscribing an example.com address answers this 422.
		jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(
				JSON.stringify({
					message: 'The email field must be a valid email address.',
					errors: {
						email: [
							'The email field must be a valid email address.',
							'nobody@example.com is not allowed.',
						],
					},
				}),
				{ status: 422, headers: { 'Content-Type': 'application/json' } },
			),
		);

		// `unknown` because rejection values are untyped until checked below.
		const caught = await makeMailcoachRequest(
			'/email-lists/x/subscribers',
			API_KEY,
			{
				apiUrl: API_URL,
				method: 'POST',
				body: { email: 'nobody@example.com' },
			},
		).catch((error: unknown) => error);

		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError))
			throw new Error('Expected sanitized ApiError');
		expect(caught.message).toBe(
			'Mailcoach API request failed with HTTP 422: The email field must be a valid email address.',
		);
		expect(caught.body).toEqual({
			message: 'The email field must be a valid email address.',
			errors: {
				email: [
					'The email field must be a valid email address.',
					'[email] is not allowed.',
				],
			},
		});
		expect(caught.request.body).toBeUndefined();
	});

	it('uses the real Corsair transport to extract Retry-After milliseconds', async () => {
		const actualHttp =
			jest.requireActual<typeof import('corsair/http')>('corsair/http');
		const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue(
			new Response(JSON.stringify({ message: 'slow down' }), {
				status: 429,
				statusText: 'Too Many Requests',
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '4',
				},
			}),
		);
		const config = {
			BASE: API_URL,
			VERSION: '1.0.0',
			WITH_CREDENTIALS: false,
			CREDENTIALS: 'omit' as const,
			TOKEN: API_KEY,
		};

		// `unknown` because the transport rejects with its rate-limit ApiError;
		// the following check narrows that value.
		const caught = await actualHttp
			.request(
				config,
				{ method: 'GET', url: '/user' },
				{
					rateLimitConfig: {
						enabled: true,
						maxRetries: 0,
						initialRetryDelay: 0,
						backoffMultiplier: 1,
						headerNames: { retryAfter: 'retry-after' },
					},
				},
			)
			.catch((error: unknown) => error);

		expect(fetchSpy).toHaveBeenCalledTimes(1);
		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError)) throw new Error('Expected ApiError');
		expect(caught.status).toBe(429);
		expect(caught.retryAfter).toBe(4_000);
	});
});
