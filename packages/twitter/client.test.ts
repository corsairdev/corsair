import { ApiError } from 'corsair/http';
import {
	encodeXPathValue,
	makeXRequest,
	X_API_BASE,
	X_RATE_LIMIT_CONFIG,
	xErrorMessage,
	xQuery,
} from './client';
import { mockFetch } from './test-helpers';

const realFetch = global.fetch;
afterEach(() => {
	global.fetch = realFetch;
});

describe('X client', () => {
	it('targets api.x.com, not the old api.twitter.com', () => {
		expect(X_API_BASE).toBe('https://api.x.com');
	});

	it('sends the token as a Bearer header', async () => {
		const { sent } = mockFetch({ body: { data: { id: '1' } } });
		await makeXRequest({ key: 'tok', method: 'GET', path: '/2/users/me' });
		expect(sent[0]!.url).toBe('https://api.x.com/2/users/me');
		expect(sent[0]!.headers.authorization).toBe('Bearer tok');
	});

	it('joins list query values with commas and drops empty ones', () => {
		expect(
			xQuery({
				ids: ['1', '2'],
				'user.fields': [],
				max_results: 10,
				flag: true,
				none: undefined,
			}),
		).toEqual({ ids: '1,2', max_results: 10, flag: true });
		expect(xQuery({})).toBeUndefined();
	});

	it('encodes path values and refuses dot segments', () => {
		expect(encodeXPathValue('a/b')).toBe('a%2Fb');
		expect(() => encodeXPathValue('..')).toThrow('Invalid X path value');
		expect(() => encodeXPathValue('')).toThrow('Invalid X path value');
	});

	it("builds the message from X's problem bodies", () => {
		expect(
			xErrorMessage(401, 'Unauthorized', {
				title: 'Unauthorized',
				detail: 'Unauthorized',
				status: 401,
			}),
		).toBe('X 401: Unauthorized');
		expect(
			xErrorMessage(400, 'Bad Request', {
				errors: [
					{
						parameters: { max_results: ['500'] },
						message:
							'The `max_results` query parameter value [500] is not between 10 and 100',
					},
				],
				title: 'Invalid Request',
			}),
		).toBe(
			'X 400: The `max_results` query parameter value [500] is not between 10 and 100',
		);
		expect(
			xErrorMessage(403, 'Forbidden', {
				title: 'Client Forbidden',
				detail:
					'This request must be made using an approved developer account.',
				reason: 'client-not-enrolled',
			}),
		).toBe(
			'X 403: This request must be made using an approved developer account. (client-not-enrolled)',
		);
		expect(xErrorMessage(500, 'Internal Server Error', '')).toBe(
			'X 500: Internal Server Error',
		);
	});

	it('strips the body, token and query values from a failed call, keeping status and reset', async () => {
		const reset = Math.floor(Date.now() / 1000) + 30;
		mockFetch({
			status: 429,
			body: {
				title: 'Too Many Requests',
				detail: 'Too Many Requests',
				status: 429,
			},
			headers: {
				'x-rate-limit-reset': String(reset),
				'x-rate-limit-remaining': '0',
			},
		});
		const error = await makeXRequest({
			key: 'secret-token',
			method: 'POST',
			path: '/2/dm_conversations/with/{participant_id}/messages',
			pathParameters: { participant_id: '42' },
			query: { q: 'private search' },
			body: { text: 'a private message' },
		}).catch((e: unknown) => e);
		expect(error).toBeInstanceOf(ApiError);
		const apiError = error as ApiError;
		expect(apiError.status).toBe(429);
		expect(apiError.message).toBe('X 429: Too Many Requests');
		expect(apiError.rateLimitRemaining).toBe(0);
		expect(apiError.retryAfter).toBeGreaterThan(0);
		expect(apiError.retryAfter).toBeLessThanOrEqual(30_000);
		const dumped = JSON.stringify({
			request: apiError.request,
			url: apiError.url,
			body: apiError.body,
		});
		expect(dumped).not.toContain('a private message');
		expect(dumped).not.toContain('secret-token');
		expect(dumped).not.toContain('private search');
		expect(apiError.url).toBe(
			'https://api.x.com/2/dm_conversations/with/{participant_id}/messages?[REDACTED]',
		);
	});

	it("doesn't sleep through X's rate-limit windows itself", () => {
		expect(X_RATE_LIMIT_CONFIG.maxRetries).toBe(0);
		expect(X_RATE_LIMIT_CONFIG.headerNames.resetTime).toBe(
			'x-rate-limit-reset',
		);
	});
});
