import { inspect } from 'node:util';
import {
	DESKTIME_API_BASE,
	DeskTimeAPIError,
	makeDeskTimeRequest,
} from './client';
import {
	COMPANY_BODY,
	INVALID_KEY_ERROR,
	MISSING_KEY_ERROR,
	PING_BODY,
} from './test-fixtures';
import { rejection } from './test-helpers';

const API_KEY = 'test-api-key-abcdef123456';

type Captured = { url: string; init: RequestInit };

/**
 * Replaces fetch and records the call. The mock's arguments are unknown because
 * jest hands through whatever the code under test passes, which is the same
 * pair a real fetch call receives; narrowing them here would only restate what
 * the client already builds. `body` is unknown because each fixture is a plain
 * object of arbitrary shape, validated by the output schema under test.
 */
function mockJson(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	const captured: Captured[] = [];
	global.fetch = jest.fn(async (url: unknown, init: unknown) => {
		captured.push({ url: String(url), init: init as RequestInit });
		return new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		});
	}) as typeof fetch;
	return captured;
}

function headersOf(captured: Captured): Headers {
	return new Headers(captured.init.headers);
}

describe('makeDeskTimeRequest', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('sends the key in the X-API-Key header, not the query string', async () => {
		const captured = mockJson(COMPANY_BODY);
		await makeDeskTimeRequest(API_KEY, 'company');

		const call = captured[0] as Captured;
		expect(headersOf(call).get('X-API-Key')).toBe(API_KEY);
		expect(call.url).not.toContain(API_KEY);
		expect(call.url).not.toContain('apiKey');
	});

	it('builds the action into the path and uses GET', async () => {
		const captured = mockJson(COMPANY_BODY);
		await makeDeskTimeRequest(API_KEY, 'company');

		const call = captured[0] as Captured;
		expect(call.init.method).toBe('GET');
		expect(call.url).toBe(`${DESKTIME_API_BASE}/company`);
	});

	it('sends query parameters for a filtered read', async () => {
		const captured = mockJson(PING_BODY);
		await makeDeskTimeRequest(API_KEY, 'employees', {
			date: '2026-11-08',
			period: 'week',
		});

		const call = captured[0] as Captured;
		expect(call.url).toContain('date=2026-11-08');
		expect(call.url).toContain('period=week');
	});

	it('omits undefined query parameters', async () => {
		const captured = mockJson(PING_BODY);
		await makeDeskTimeRequest(API_KEY, 'employees', {
			date: undefined,
			period: 'day',
		});

		const call = captured[0] as Captured;
		expect(call.url).toContain('period=day');
		expect(call.url).not.toContain('date');
	});

	it('sends no key header for the actions that work without one', async () => {
		const captured = mockJson(PING_BODY);
		await makeDeskTimeRequest(undefined, 'ping');

		const call = captured[0] as Captured;
		expect(headersOf(call).get('X-API-Key')).toBeNull();
	});

	it('returns the parsed body on success', async () => {
		mockJson(COMPANY_BODY);
		const result = await makeDeskTimeRequest(API_KEY, 'company');
		expect(result).toEqual(COMPANY_BODY);
	});

	it('surfaces the provider code and description on an error', async () => {
		mockJson(INVALID_KEY_ERROR, 401);
		const error = await rejection<DeskTimeAPIError>(
			makeDeskTimeRequest(API_KEY, 'company'),
		);

		expect(error).toBeInstanceOf(DeskTimeAPIError);
		const apiError = error as DeskTimeAPIError;
		expect(apiError.status).toBe(401);
		expect(apiError.code).toBe(401);
		expect(apiError.message).toContain('API Key is invalid');
	});

	it('distinguishes a missing key from an invalid one in the message', async () => {
		mockJson(MISSING_KEY_ERROR, 401);
		const missing = await rejection<DeskTimeAPIError>(
			makeDeskTimeRequest(API_KEY, 'company'),
		);

		mockJson(INVALID_KEY_ERROR, 401);
		const invalid = await rejection<DeskTimeAPIError>(
			makeDeskTimeRequest(API_KEY, 'company'),
		);

		expect(missing.message).toContain('missing');
		expect(invalid.message).toContain('invalid');
	});

	it('marks a 429 as a rate limit and keeps Retry-After', async () => {
		mockJson({ error: { code: 429, description: 'Too many requests' } }, 429, {
			'Retry-After': '3',
		});
		const error = await rejection<DeskTimeAPIError>(
			makeDeskTimeRequest(API_KEY, 'company'),
		);

		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(3_000);
	});

	it('does not treat a 403 as a rate limit', async () => {
		mockJson({ error: { code: 403, description: 'Forbidden' } }, 403);
		const error = await rejection<DeskTimeAPIError>(
			makeDeskTimeRequest(API_KEY, 'company'),
		);

		expect(error.isRateLimit).toBe(false);
	});

	it('never leaks the key into the message, a stringified error or inspect', async () => {
		mockJson(INVALID_KEY_ERROR, 401);
		const error = await rejection<DeskTimeAPIError>(
			makeDeskTimeRequest(API_KEY, 'company'),
		);

		expect(error.message).not.toContain(API_KEY);
		// The ApiError cause is dropped, so neither the stringified error nor
		// util.inspect can reach the request headers that carry the key.
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(inspect(error)).not.toContain(API_KEY);
	});

	it('makes a single attempt, leaving retries to the error handlers', async () => {
		const captured = mockJson(INVALID_KEY_ERROR, 401);
		await makeDeskTimeRequest(API_KEY, 'company').catch(() => undefined);
		expect(captured).toHaveLength(1);
	});
});

describe('DeskTimeAPIError', () => {
	it('is replay-safe by default, because every operation is a read', () => {
		expect(new DeskTimeAPIError('boom').replaySafe).toBe(true);
	});

	it('is not a rate limit without a 429', () => {
		expect(new DeskTimeAPIError('boom', { status: 500 }).isRateLimit).toBe(
			false,
		);
	});
});
