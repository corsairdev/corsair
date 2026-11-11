import {
	InboxkitAPIError,
	InboxkitError,
	isRefusal,
	makeInboxkitRequest,
	readErrorText,
	retryAfterMs,
	segment,
} from './client';
import { API_KEY, jsonResponse } from './test-fixtures';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	jest.restoreAllMocks();
});

const get = { method: 'GET', path: '/v1/api/account' } as const;

// unknown: a test double; the real types add nothing to this check.
const failure = async (promise: Promise<unknown>) =>
	promise.then(
		() => {
			throw new Error('expected a failure');
		},
		(error: Error) => error,
	);

describe('readErrorText reads all three error shapes seen live', () => {
	it.each([
		[
			{ code: 400, message: 'Workspace ID is required' },
			'Workspace ID is required',
		],
		[{ error: true, message: 'Mailbox not found' }, 'Mailbox not found'],
		[{ error: 'Scheduled test not found' }, 'Scheduled test not found'],
		[{ errors: ['one', { field: 'two' }] }, 'one; {"field":"two"}'],
		['plain text', 'plain text'],
		[null, ''],
		[{}, ''],
	])('%j', (body, expected) => {
		expect(readErrorText(body)).toBe(expected);
	});
});

describe('isRefusal', () => {
	it.each([
		[{ error: true }, true],
		[{ error: 'nope' }, true],
		[{ success: false }, true],
		[{ error: false }, false],
		[{ error: '' }, false],
		[{ success: true }, false],
		[{ domains: [] }, false],
		[undefined, false],
		['text', false],
	])('%j → %s', (body, expected) => {
		expect(isRefusal(body)).toBe(expected);
	});
});

describe('retryAfterMs', () => {
	const headers = (values: Record<string, string>) => new Headers(values);

	it('reads Retry-After in seconds', () => {
		expect(retryAfterMs(headers({ 'retry-after': '3' }))).toBe(3000);
	});

	it('reads Retry-After as a date', () => {
		const wait = retryAfterMs(
			headers({ 'retry-after': new Date(Date.now() + 5000).toUTCString() }),
		);
		expect(wait).toBeGreaterThan(0);
		expect(wait).toBeLessThanOrEqual(5000);
	});

	it('reads RateLimit-Reset, which InboxKit sends as seconds to wait', () => {
		expect(retryAfterMs(headers({ 'ratelimit-reset': '48' }))).toBe(48_000);
	});

	it('reads an older X-RateLimit-Reset sent as a Unix time', () => {
		const unix = String(Math.floor(Date.now() / 1000) + 10);
		const wait = retryAfterMs(headers({ 'x-ratelimit-reset': unix }));
		expect(wait).toBeGreaterThan(5000);
		expect(wait).toBeLessThanOrEqual(10_000);
	});

	it('is undefined with nothing to read', () => {
		expect(retryAfterMs(headers({}))).toBeUndefined();
		expect(
			retryAfterMs(headers({ 'ratelimit-reset': 'soon' })),
		).toBeUndefined();
	});
});

describe('segment', () => {
	it('encodes', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
	});

	it.each(['', '.', '..', '...'])('refuses %j', (value) => {
		expect(() => segment(value)).toThrow(InboxkitError);
	});
});

describe('makeInboxkitRequest', () => {
	it('sends the key as a Bearer token, trimmed, to InboxKit only', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({ ok: 1 }));
		await makeInboxkitRequest(`  ${API_KEY}\n`, get);
		const [url, init] = fetchMock.mock.calls[0];
		expect(String(url)).toBe('https://api.inboxkit.com/v1/api/account');
		expect(init.headers.Authorization).toBe(`Bearer ${API_KEY}`);
		expect(init.redirect).toBe('error');
	});

	it('refuses a path that would leave InboxKit, sending nothing', async () => {
		const error = await failure(
			makeInboxkitRequest(API_KEY, {
				method: 'GET',
				path: 'https://evil.example/steal',
			}),
		);
		expect(error).toMatchObject({ code: 'invalid_input' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('refuses a protocol-relative path, sending nothing', async () => {
		const error = await failure(
			makeInboxkitRequest(API_KEY, { method: 'GET', path: '//evil.example/x' }),
		);
		expect(error).toMatchObject({ code: 'invalid_input' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each(['', '   '])('refuses key %j, sending nothing', async (key) => {
		const error = await failure(makeInboxkitRequest(key, get));
		expect(error).toMatchObject({ code: 'invalid_key' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('repeats array query values and skips empty ones', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));
		await makeInboxkitRequest(API_KEY, {
			...get,
			query: { uids: ['a', 'b'], page: 2, gone: undefined, none: null },
		});
		const url = new URL(String(fetchMock.mock.calls[0][0]));
		expect(url.searchParams.getAll('uids')).toEqual(['a', 'b']);
		expect(url.searchParams.get('page')).toBe('2');
		expect(url.searchParams.has('gone')).toBe(false);
		expect(url.searchParams.has('none')).toBe(false);
	});

	it('sends JSON only when there is a body', async () => {
		fetchMock.mockResolvedValue(jsonResponse({}));
		await makeInboxkitRequest(API_KEY, {
			method: 'POST',
			path: '/v1/api/x',
			body: { a: 1 },
		});
		expect(fetchMock.mock.calls[0][1].headers['Content-Type']).toBe(
			'application/json',
		);
		fetchMock.mockResolvedValue(jsonResponse({}));
		await makeInboxkitRequest(API_KEY, { method: 'POST', path: '/v1/api/x' });
		expect(fetchMock.mock.calls[1][1].headers['Content-Type']).toBeUndefined();
	});

	it('turns an error answer into InboxkitAPIError with a hint', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ code: 401, message: 'No auth token' }, 401),
		);
		const error = await failure(makeInboxkitRequest(API_KEY, get));
		expect(error).toBeInstanceOf(InboxkitAPIError);
		expect(error.message).toBe(
			'InboxKit 401: No auth token (the API key is missing, wrong or was rotated)',
		);
	});

	it('treats a refusal inside a 200 as an error', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ error: true, message: 'Not enough credits' }),
		);
		const error = await failure(makeInboxkitRequest(API_KEY, get));
		expect(error).toMatchObject({ status: 200 });
		expect(error.message).toContain('Not enough credits');
	});

	it('says to wait on a 429', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ message: 'Slow down' }, 429, { 'ratelimit-reset': '12' }),
		);
		const error = (await failure(
			makeInboxkitRequest(API_KEY, get),
		)) as InboxkitAPIError;
		expect(error.retryAfter).toBe(12_000);
		expect(error.message).toContain('Retry after 12 s.');
	});

	it('ignores RateLimit-Reset on other errors: InboxKit sends it on every answer', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ error: true, message: 'Not found' }, 404, {
				'ratelimit-reset': '31',
			}),
		);
		const error = (await failure(
			makeInboxkitRequest(API_KEY, get),
		)) as InboxkitAPIError;
		expect(error.retryAfter).toBeUndefined();
		expect(error.message).not.toContain('Retry after');
	});

	it('keeps a non-JSON answer as text', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('<html>Bad gateway</html>', { status: 502 }),
		);
		const error = await failure(makeInboxkitRequest(API_KEY, get));
		expect(error.message).toContain('Bad gateway');
	});

	it('reports a timeout without naming the key', async () => {
		fetchMock.mockRejectedValueOnce(
			Object.assign(new Error('aborted'), { name: 'TimeoutError' }),
		);
		const error = await failure(makeInboxkitRequest(API_KEY, get));
		expect(error).toMatchObject({ code: 'timeout' });
		expect(error.message).not.toContain(API_KEY);
	});

	it('reports a network failure without naming the key', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError(`fetch failed ${API_KEY}`));
		const error = await failure(makeInboxkitRequest(API_KEY, get));
		expect(error).toMatchObject({ code: 'network' });
		expect(error.message).not.toContain(API_KEY);
	});
});
