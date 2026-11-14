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
	it('classifies verification as a metered read', () => {
		expect(neverbounce().endpointMeta?.['single.check']?.riskLevel).toBe(
			'read',
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

	it('keeps 429 and Retry-After for core and the handler, without the API key or the address', async () => {
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify({ message: 'rate limited' }), {
				status: 429,
				headers: { 'content-type': 'application/json', 'retry-after': '3' },
			}),
		);
		global.fetch = fetchMock;
		jest.spyOn(global, 'setTimeout').mockImplementation(((fn: () => void) => {
			fn();
			return 0;
		}) as unknown as typeof setTimeout);
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
		expect(caught.status).toBe(429);
		const serialized = JSON.stringify(caught) + caught.message + caught.url;
		expect(serialized).not.toContain('test-key');
		expect(serialized).not.toContain('user@example.com');
		expect(serialized).not.toContain('user%40example.com');
		// Core's request() retried the 429 itself before giving up.
		expect(fetchMock).toHaveBeenCalledTimes(4);
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
					message: "Invalid API key 'test-key' for user@example.com",
				}),
				{ status: 200, headers: { 'content-type': 'application/json' } },
			),
		);
		await expect(
			neverbounce().endpoints!.single.check(ctx, { email: 'user@example.com' }),
		).rejects.toMatchObject({
			name: 'NeverBounceAPIError',
			status: 'auth_failure',
			message:
				"NeverBounce auth_failure: Invalid API key '[REDACTED]' for [REDACTED]",
		});
		expect(
			errorHandlers.AUTH_ERROR.match(
				new NeverBounceAPIError('auth_failure', 'Invalid key'),
			),
		).toBe(true);
		const throttled = new NeverBounceAPIError(
			'throttle_triggered',
			'Slow down',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(throttled)).toBe(false);
		expect(errorHandlers.THROTTLE_ERROR.match(throttled)).toBe(true);
		expect(await errorHandlers.THROTTLE_ERROR.handler()).toMatchObject({
			maxRetries: 2,
		});
	});

	it('passes on why NeverBounce refused a check, such as a spent balance', async () => {
		// Live response (11-15) once the free credits ran out: HTTP 200, general_failure.
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(
				JSON.stringify({
					status: 'general_failure',
					message:
						'Insufficient credit balance. This transaction requires 1 credits. The current available credit balance is 0.',
					execution_time: 12,
				}),
				{ status: 200, headers: { 'content-type': 'application/json' } },
			),
		);
		global.fetch = fetchMock;
		let caught: unknown;
		try {
			await neverbounce().endpoints!.single.check(ctx, {
				email: 'user@example.com',
			});
		} catch (error) {
			caught = error;
		}
		expect(caught).toBeInstanceOf(NeverBounceAPIError);
		expect((caught as Error).message).toBe(
			'NeverBounce general_failure: Insufficient credit balance. This transaction requires 1 credits. The current available credit balance is 0.',
		);
		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(errorHandlers.THROTTLE_ERROR.match(caught as Error)).toBe(false);
	});

	it('lets a long verification timeout outlast the default fetch deadline', async () => {
		const fetchMock = jest.fn().mockResolvedValue(
			new Response(JSON.stringify({ status: 'success', result: 'unknown' }), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		global.fetch = fetchMock;
		const timeoutSpy = jest.spyOn(AbortSignal, 'timeout');
		await neverbounce().endpoints!.single.check(ctx, {
			email: 'user@example.com',
			timeout: 30,
		});
		expect(timeoutSpy).toHaveBeenCalledWith(35_000);
	});

	it('accepts nulls where NeverBounce leaves a field empty', async () => {
		const response = {
			status: 'success',
			result: 'catchall',
			flags: ['has_dns'],
			suggested_correction: null,
			credits_info: { free_credits_used: 1, paid_credits_remaining: null },
			execution_time: 120,
		};
		global.fetch = jest.fn().mockResolvedValue(
			new Response(JSON.stringify(response), {
				status: 200,
				headers: { 'content-type': 'application/json' },
			}),
		);
		await expect(
			neverbounce().endpoints!.single.check(ctx, { email: 'user@example.com' }),
		).resolves.toEqual(response);
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
