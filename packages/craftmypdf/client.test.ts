import {
	CRAFTMYPDF_API_BASE,
	CraftmypdfAPIError,
	isAuthMessage,
	makeCraftmypdfRequest,
	resolveBase,
} from './client';
import { accountInfo, generatedFile, templatesPage } from './test-fixtures';

const API_KEY = 'cmp-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<CraftmypdfAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(CraftmypdfAPIError);
	if (!(error instanceof CraftmypdfAPIError)) throw error;
	return error;
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can reach
	// the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeCraftmypdfRequest', () => {
	it('sends the key in X-API-KEY and nothing in Authorization', async () => {
		respond(generatedFile, 200);

		const result = await makeCraftmypdfRequest(API_KEY, {
			method: 'POST',
			path: '/create',
			body: { template_id: 'abc', data: {} },
		});

		expect(result).toEqual(generatedFile);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${CRAFTMYPDF_API_BASE}/create`);
		const headers = new Headers(init.headers);
		expect(init.method).toBe('POST');
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('content-type')).toContain('application/json');
	});

	it('sends a GET with query parameters and no body', async () => {
		respond(accountInfo, 200);

		await makeCraftmypdfRequest(API_KEY, {
			method: 'GET',
			path: '/list-templates',
			query: { limit: 10, offset: 0, group_name: undefined },
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${CRAFTMYPDF_API_BASE}/list-templates?limit=10&offset=0`);
		expect(init.method).toBe('GET');
		expect(init.body).toBeUndefined();
	});

	it('reads the region from the client options', async () => {
		respond(accountInfo, 200);

		await makeCraftmypdfRequest(
			API_KEY,
			{ method: 'GET', path: '/get-account-info' },
			{ region: 'de' },
		);

		const [url] = fetchMock.mock.calls[0] as [string];
		expect(url).toBe('https://api-de.craftmypdf.com/v1/get-account-info');
	});

	it('turns a 400 error body into the provider message', async () => {
		respond({ status: 'error', message: 'Invalid API Key' }, 400);

		const error = await failure(
			makeCraftmypdfRequest(API_KEY, {
				method: 'GET',
				path: '/list-templates',
			}),
		);

		expect(error.status).toBe(400);
		expect(error.message).toBe('Invalid API Key');
		expect(error.envelopeStatus).toBe('error');
		expect(error.isAuthFailure).toBe(true);
		expect(error.method).toBe('GET');
	});

	it('does not treat a parameter error as an auth failure', async () => {
		respond({ status: 'error', message: 'Template not found' }, 400);

		const error = await failure(
			makeCraftmypdfRequest(API_KEY, {
				method: 'POST',
				path: '/create',
				body: {},
			}),
		);

		expect(error.status).toBe(400);
		expect(error.isAuthFailure).toBe(false);
		expect(error.method).toBe('POST');
	});

	it('keeps the key out of the message and out of inspect output', async () => {
		respond({ status: 'error', message: 'Invalid API Key' }, 400);

		const error = await failure(
			makeCraftmypdfRequest(API_KEY, {
				method: 'POST',
				path: '/create',
				body: { template_id: 'abc', data: {} },
			}),
		);

		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
		// The ApiError cause carries the request body and is dropped.
		expect(error.cause).toBeUndefined();
	});

	it('records Retry-After on a 429', async () => {
		respond({ message: 'Too Many Requests' }, 429, { 'Retry-After': '7' });

		const error = await failure(
			makeCraftmypdfRequest(API_KEY, {
				method: 'GET',
				path: '/list-templates',
			}),
		);

		expect(error.status).toBe(429);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(7000);
	});

	it('wraps a transport failure with the method it was sent with', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeCraftmypdfRequest(API_KEY, {
				method: 'POST',
				path: '/create',
				body: {},
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.method).toBe('POST');
		expect(error.message).toBe('fetch failed');
	});

	it('keeps the details line some failures add', async () => {
		respond(
			{
				status: 'error',
				message: 'Failed to load: https://example.com/d.json',
				details: 'Failed to load from remote URL',
			},
			400,
		);

		const error = await failure(
			makeCraftmypdfRequest(API_KEY, {
				method: 'POST',
				path: '/create',
				body: {},
			}),
		);

		expect(error.message).toBe(
			'Failed to load: https://example.com/d.json (Failed to load from remote URL)',
		);
	});

	it('falls back to the status when the body has no message', async () => {
		respond('<html>Gateway</html>', 502);

		const error = await failure(
			makeCraftmypdfRequest(API_KEY, {
				method: 'GET',
				path: '/list-templates',
			}),
		);

		expect(error.status).toBe(502);
		expect(error.message).toBe('CraftMyPDF HTTP 502');
	});
});

describe('resolveBase', () => {
	it('maps the documented regions to their hosts', () => {
		expect(resolveBase('sg')).toBe('https://api.craftmypdf.com/v1');
		expect(resolveBase('de')).toBe('https://api-de.craftmypdf.com/v1');
		expect(resolveBase('us')).toBe('https://api-us.craftmypdf.com/v1');
		expect(resolveBase('au')).toBe('https://api-au.craftmypdf.com/v1');
	});

	it('falls back to the default host for an unknown region', () => {
		expect(resolveBase('mars')).toBe(CRAFTMYPDF_API_BASE);
		expect(resolveBase(undefined)).toBe(CRAFTMYPDF_API_BASE);
	});
});

describe('isAuthMessage', () => {
	it('recognises the wordings both error handlers use', () => {
		expect(isAuthMessage('Invalid API Key')).toBe(true);
		expect(isAuthMessage('Invalid api key or token')).toBe(true);
		expect(isAuthMessage('Missing api key')).toBe(true);
	});

	it('does not match an unrelated 400', () => {
		expect(isAuthMessage('Template not found')).toBe(false);
		expect(isAuthMessage('url is invalid')).toBe(false);
	});

	it('parses the template page the list endpoint wraps', () => {
		expect(templatesPage.templates.length).toBeGreaterThan(0);
	});
});
