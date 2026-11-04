import {
	makeLeverBinaryRequest,
	makeLeverRequest,
	resolveLeverAuthorizationHeader,
} from './client';

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
});
