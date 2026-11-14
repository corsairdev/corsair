import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { NeverBounceAPIError } from './client';
import { errorHandlers } from './error-handlers';
import type { NeverBounceContext } from './index';
import { neverbounce } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

// The endpoint only reads key; event logging is mocked. A full context requires
// framework-managed fields that this request-seam test does not exercise.
const ctx = { key: 'test-key' } as NeverBounceContext;
const fixture = {
	status: 'success',
	result: 'valid',
	flags: ['has_dns', 'has_dns_mx'],
	suggested_correction: '',
	address_info: {
		original_email: 'user+tag@example.com',
		alias: 'tag',
		host: 'example.com',
	},
	credits_info: {
		paid_credits_used: 1,
		free_credits_used: 0,
		paid_credits_remaining: 42,
		free_credits_remaining: 0,
	},
	execution_time: 499,
};

describe('NeverBounce single.check', () => {
	const originalFetch = global.fetch;
	it('classifies credit-consuming verification as destructive', () => {
		expect(neverbounce().endpointMeta?.['single.check']?.riskLevel).toBe(
			'destructive',
		);
	});
	afterEach(() => {
		global.fetch = originalFetch;
		jest.restoreAllMocks();
	});

	it('sends the documented GET query and parses the provider response', async () => {
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify(fixture), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		global.fetch = fetchMock;
		const plugin = neverbounce({ key: 'test-key' });
		const result = await plugin.endpoints!.single.check(ctx, {
			email: 'user+tag@example.com',
			address_info: 1,
			credits_info: 1,
			timeout: 10,
		});
		expect(result).toEqual(fixture);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, options] = fetchMock.mock.calls[0];
		const parsed = new URL(url);
		expect(parsed.origin + parsed.pathname).toBe(
			'https://api.neverbounce.com/v4.2/single/check',
		);
		expect(parsed.searchParams.get('key')).toBe('test-key');
		expect(parsed.searchParams.get('email')).toBe('user+tag@example.com');
		expect(url).toContain('%2B');
		expect(parsed.searchParams.get('address_info')).toBe('1');
		expect(parsed.searchParams.get('credits_info')).toBe('1');
		expect(parsed.searchParams.get('timeout')).toBe('10');
		expect(options.method).toBe('GET');
		expect(options.body).toBeUndefined();
		expect(new Headers(options.headers).has('authorization')).toBe(false);
	});

	it('validates input and refuses missing credentials before sending a request', async () => {
		global.fetch = jest.fn();
		const endpoint = neverbounce().endpoints!.single.check;
		await expect(endpoint(ctx, { email: '' })).rejects.toThrow();
		// As with ctx, only key is read and logging is mocked; the remaining
		// framework-managed context fields are unnecessary for this fixture.
		const missingKeyCtx = { key: '' } as NeverBounceContext;
		await expect(
			endpoint(missingKeyCtx, {
				email: 'user@example.com',
			}),
		).rejects.toThrow(AuthMissingError);
		expect(global.fetch).not.toHaveBeenCalled();
	});

	it('preserves 429 and Retry-After without retrying or exposing the API key', async () => {
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify({ message: 'rate limited' }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '3' },
			}),
		);
		global.fetch = fetchMock;
		const plugin = neverbounce();
		// JavaScript may throw any value, so narrow the caught value before
		// inspecting ApiError properties instead of assuming its type.
		let caught: unknown;
		try {
			await plugin.endpoints!.single.check(ctx, { email: 'user@example.com' });
		} catch (error) {
			caught = error;
		}
		expect(caught).toBeInstanceOf(ApiError);
		if (!(caught instanceof ApiError)) throw new Error('Expected ApiError');
		expect(caught.retryAfter).toBe(3000);
		expect(JSON.stringify(caught)).not.toContain('test-key');
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(caught)).toBe(true);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler(caught)).toMatchObject({
			maxRetries: 0,
			headersRetryAfterMs: 3000,
		});
	});

	it('rejects malformed provider data', async () => {
		global.fetch = jest.fn().mockResolvedValue(
			new Response(JSON.stringify({ status: 'success', flags: 'wrong' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		await expect(
			neverbounce().endpoints!.single.check(ctx, { email: 'user@example.com' }),
		).rejects.toThrow();
	});

	it('treats provider error statuses in HTTP 200 as errors', async () => {
		global.fetch = jest.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					status: 'auth_failure',
					message: 'Invalid key test-key for user@example.com',
				}),
				{ status: 200, headers: { 'content-type': 'application/json' } },
			),
		);
		await expect(
			neverbounce().endpoints!.single.check(ctx, { email: 'user@example.com' }),
		).rejects.toMatchObject({
			name: 'NeverBounceAPIError',
			status: 'auth_failure',
			message: 'NeverBounce returned an error',
		});
		expect(
			errorHandlers.AUTH_ERROR.match(
				new NeverBounceAPIError('auth_failure', 'Invalid key'),
			),
		).toBe(true);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(
				new NeverBounceAPIError('throttle_triggered', 'Slow down'),
			),
		).toBe(true);
	});

	it('accepts the minimal documented response and optional query defaults', async () => {
		const response = {
			status: 'success',
			result: 'unknown',
			flags: [],
			suggested_correction: '',
			execution_time: 100,
		};
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify(response), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		global.fetch = fetchMock;
		await expect(
			neverbounce().endpoints!.single.check(ctx, { email: 'not-an-email' }),
		).resolves.toEqual(response);
		const url = new URL(fetchMock.mock.calls[0][0]);
		expect(url.searchParams.has('address_info')).toBe(false);
		expect(url.searchParams.has('credits_info')).toBe(false);
		expect(url.searchParams.has('timeout')).toBe(false);
	});
});
