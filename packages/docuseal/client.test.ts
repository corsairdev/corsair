import util from 'node:util';
import {
	DocuSealAPIError,
	describeDocuSealError,
	makeDocuSealRequest,
	segment,
} from './client';
import { notAuthenticated, template } from './test-fixtures';

const API_KEY = 'docuseal-secret-test-key';

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
async function failure(promise: Promise<unknown>): Promise<DocuSealAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(DocuSealAPIError);
	if (!(error instanceof DocuSealAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeDocuSealRequest', () => {
	it('authenticates with X-Auth-Token and no Authorization header', async () => {
		respond(template, 200);

		const result = await makeDocuSealRequest(API_KEY, {
			method: 'GET',
			path: '/templates/12',
		});

		expect(result).toEqual(template);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.docuseal.com/templates/12');
		const headers = new Headers(init.headers);
		expect(init.method).toBe('GET');
		expect(headers.get('x-auth-token')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
		expect(headers.get('accept')).toBe('application/json');
	});

	it('POSTs a JSON body with a JSON content type', async () => {
		respond([], 200);

		await makeDocuSealRequest(API_KEY, {
			method: 'POST',
			path: '/submissions',
			body: { template_id: 12, submitters: [] },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			template_id: 12,
			submitters: [],
		});
	});

	it('sends no body or content type on a bodyless DELETE', async () => {
		respond({ id: 12, archived_at: null }, 200);

		await makeDocuSealRequest(API_KEY, {
			method: 'DELETE',
			path: '/templates/12',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.body).toBeUndefined();
		expect(new Headers(init.headers).get('content-type')).toBeNull();
	});

	it('drops undefined query values instead of sending empty ones', async () => {
		respond(
			{ data: [], pagination: { count: 0, next: null, prev: null } },
			200,
		);

		await makeDocuSealRequest(API_KEY, {
			method: 'GET',
			path: '/templates',
			query: { limit: 5, q: undefined, archived: undefined },
		});

		const [url] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.docuseal.com/templates?limit=5');
	});

	it('reads the error message out of the {"error"} envelope', async () => {
		respond(notAuthenticated, 401);

		const error = await failure(
			makeDocuSealRequest(API_KEY, { method: 'GET', path: '/templates' }),
		);
		expect(error.status).toBe(401);
		expect(error.method).toBe('GET');
		expect(error.message).toBe('DocuSeal 401: Not authenticated');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(notAuthenticated, 429, { 'Retry-After': '2' });

		const error = await failure(
			makeDocuSealRequest(API_KEY, { method: 'GET', path: '/templates' }),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('falls back to the status when the error body is not JSON', async () => {
		respond('<html>gateway down</html>', 502);

		const error = await failure(
			makeDocuSealRequest(API_KEY, { method: 'GET', path: '/templates' }),
		);
		expect(error.message).toContain('DocuSeal 502');
	});

	it('keeps the transport cause on a network failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeDocuSealRequest(API_KEY, { method: 'GET', path: '/templates' }),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.method).toBe('GET');
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('keeps the API key out of an API error', async () => {
		respond(notAuthenticated, 401);

		const error = await failure(
			makeDocuSealRequest(API_KEY, { method: 'GET', path: '/templates' }),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(util.inspect(error)).not.toContain(API_KEY);
	});
});

describe('describeDocuSealError', () => {
	it('uses the envelope message', () => {
		expect(describeDocuSealError(400, { error: 'No such template' }, 'x')).toBe(
			'DocuSeal 400: No such template',
		);
	});

	it('falls back when the body has no error text', () => {
		expect(describeDocuSealError(503, '<html>down</html>', 'Unavailable')).toBe(
			'DocuSeal 503: Unavailable',
		);
		expect(describeDocuSealError(undefined, undefined, 'timeout')).toBe(
			'timeout',
		);
	});
});

describe('segment', () => {
	it('encodes a value for one path segment', () => {
		expect(segment('a/b?c')).toBe('a%2Fb%3Fc');
		expect(segment(12)).toBe('12');
	});
});
