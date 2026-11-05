import {
	makeLeverBinaryRequest,
	makeLeverRequest,
	resolveLeverAuthorizationHeader,
} from './client';
import { errorHandlers } from './error-handlers';

const TEST_KEY = 'test-key-not-a-credential';
const realFetch = global.fetch;
let lastInit: RequestInit | undefined;

function mockFetch(): void {
	const stub: typeof global.fetch = async (_input, init) => {
		lastInit = init;
		return new Response('{}', {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	};
	global.fetch = stub;
}

beforeEach(() => {
	lastInit = undefined;
	mockFetch();
});
afterEach(() => {
	global.fetch = realFetch;
});

describe('Lever client auth selection', () => {
	it('resolves Basic auth for API keys with an empty password', () => {
		const header = resolveLeverAuthorizationHeader(TEST_KEY, 'api_key');
		const decoded = Buffer.from(
			header.replace('Basic ', ''),
			'base64',
		).toString('utf8');
		expect(header.startsWith('Basic ')).toBe(true);
		expect(decoded).toBe(`${TEST_KEY}:`);
	});

	it('resolves Bearer auth for OAuth tokens', () => {
		expect(resolveLeverAuthorizationHeader('token-1', 'oauth_2')).toBe(
			'Bearer token-1',
		);
	});

	it('sends the Basic header for the default API-key auth type', async () => {
		await makeLeverRequest({ key: TEST_KEY, options: {} }, '/users', {
			method: 'GET',
		});
		const headers = new Headers(lastInit?.headers);
		expect(headers.get('Authorization')).toBe(
			`Basic ${Buffer.from(`${TEST_KEY}:`).toString('base64')}`,
		);
	});

	it('sends the Bearer header when the OAuth auth type is configured', async () => {
		await makeLeverRequest(
			{ key: 'token-1', options: { authType: 'oauth_2' } },
			'/users',
			{ method: 'GET' },
		);
		const headers = new Headers(lastInit?.headers);
		expect(headers.get('Authorization')).toBe('Bearer token-1');
	});
});

describe('Lever binary downloads', () => {
	it('preserves Retry-After when a download is rate limited', async () => {
		global.fetch = async () =>
			new Response('', {
				status: 429,
				headers: { 'Retry-After': '2' },
			});

		await expect(
			makeLeverBinaryRequest(
				{ key: TEST_KEY, options: {} },
				'/files/1/download',
			),
		).rejects.toMatchObject({
			status: 429,
			retryAfter: 2000,
		});
	});

	it('surfaces an unknown Retry-After without inventing a delay', async () => {
		global.fetch = async () =>
			new Response('', {
				status: 429,
				headers: { 'Retry-After': 'not-a-delay' },
			});

		await expect(
			makeLeverBinaryRequest(
				{ key: TEST_KEY, options: {} },
				'/files/1/download',
			),
		).rejects.toMatchObject({ status: 429, retryAfter: undefined });
	});

	it('converts an HTTP-date Retry-After into a delay', async () => {
		const retryAt = new Date(Date.now() + 30_000).toUTCString();
		global.fetch = async () =>
			new Response('', { status: 429, headers: { 'Retry-After': retryAt } });
		let error: { status?: number; retryAfter?: number } = {};
		await makeLeverBinaryRequest(
			{ key: TEST_KEY, options: {} },
			'/files/1/download',
		).catch((caught: { status?: number; retryAfter?: number }) => {
			error = caught;
		});

		expect(error.status).toBe(429);
		// HTTP dates have one-second precision.
		expect(error.retryAfter).toBeGreaterThan(28_000);
		expect(error.retryAfter).toBeLessThanOrEqual(30_000);
	});

	it('hands the Retry-After delay to the retry strategy', async () => {
		global.fetch = async () =>
			new Response('', { status: 429, headers: { 'Retry-After': '7' } });
		let error = new Error('download did not fail');
		await makeLeverBinaryRequest(
			{ key: TEST_KEY, options: {} },
			'/files/1/download',
		).catch((caught: Error) => {
			error = caught;
		});

		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		await expect(
			errorHandlers.RATE_LIMIT_ERROR.handler(error),
		).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 7000 });
	});

	it('keeps non-UTF-8 bytes intact and sends the offer status filter', async () => {
		const bytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0xff, 0xfe, 0x00]);
		let requestedUrl = '';
		global.fetch = async (input) => {
			requestedUrl = String(input);
			return new Response(bytes, {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			});
		};

		const result = await makeLeverBinaryRequest(
			{ key: TEST_KEY, options: {} },
			'/opportunities/opp-1/offers/offer-1/download',
			{ query: { status: 'signed' } },
		);

		expect(requestedUrl).toBe(
			'https://api.lever.co/v1/opportunities/opp-1/offers/offer-1/download?status=signed',
		);
		expect(Buffer.from(result.data, 'base64')).toEqual(Buffer.from(bytes));
		expect(result.contentType).toBe('application/pdf');
	});
});

describe('Lever write requests', () => {
	it('puts perform_as in the query string of a POST', async () => {
		let requestedUrl = '';
		let requestBody = '';
		global.fetch = async (input, init) => {
			requestedUrl = String(input);
			requestBody = String(init?.body);
			return new Response('{"data":{}}', {
				status: 201,
				headers: { 'Content-Type': 'application/json' },
			});
		};

		await makeLeverRequest({ key: TEST_KEY, options: {} }, '/opportunities', {
			method: 'POST',
			body: { name: 'Jane Doe' },
			query: { perform_as: 'user-1', parse: undefined },
		});

		expect(requestedUrl).toBe(
			'https://api.lever.co/v1/opportunities?perform_as=user-1',
		);
		expect(JSON.parse(requestBody)).toEqual({ name: 'Jane Doe' });
	});
});
