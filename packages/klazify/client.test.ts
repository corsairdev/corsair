import { inspect } from 'node:util';
import { KlazifyAPIError, makeKlazifyRequest } from './client';
import { planRequired, traffic, unauthorized } from './test-fixtures';

const API_KEY = 'klazify-test-token';

let fetchMock: jest.SpyInstance;

// unknown: a failure body may be Klazify's JSON envelope or HTML from an edge
// layer, and the client must read both without throwing.
function respond(
	body: unknown,
	status = 200,
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
async function failure(promise: Promise<unknown>): Promise<KlazifyAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(KlazifyAPIError);
	if (!(error instanceof KlazifyAPIError)) throw error;
	return error;
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return {
		url,
		init,
		headers: new Headers(init.headers),
		// unknown: the body is whatever the endpoint serialised.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeKlazifyRequest', () => {
	it('sends the token as a Bearer Authorization header', async () => {
		respond(traffic);

		const result = await makeKlazifyRequest(API_KEY, {
			method: 'POST',
			path: '/api/domain_traffic_intelligence',
			body: { url: 'https://cbsnews.com' },
		});

		expect(result).toEqual(traffic);
		const { url, init, headers } = lastRequest();
		expect(url).toBe('https://www.klazify.com/api/domain_traffic_intelligence');
		expect(init.method).toBe('POST');
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('content-type')).toBe('application/json');
	});

	it('sends no content type on a bodyless read', async () => {
		respond({ success: true, version: 'v1', count: 0, categories: [] });

		await makeKlazifyRequest(API_KEY, {
			method: 'GET',
			path: '/api/list-category/v1',
		});

		const { init, headers } = lastRequest();
		expect(init.body).toBeUndefined();
		expect(headers.get('content-type')).toBeNull();
	});

	it('keeps the token out of the URL', async () => {
		respond(traffic);

		await makeKlazifyRequest(API_KEY, {
			method: 'POST',
			path: '/api/domain_tech',
			body: { url: 'https://cbsnews.com' },
		});

		expect(lastRequest().url).not.toContain(API_KEY);
	});

	// The account-wide plan block and a bad key share a status, and only the
	// body separates them, so both labels are kept for the handlers to match.
	it('reads the plan-required rejection', async () => {
		respond(planRequired, 401);

		const error = await failure(
			makeKlazifyRequest(API_KEY, { method: 'POST', path: '/api/categorize' }),
		);

		expect(error.status).toBe(401);
		expect(error.errorLabel).toBe('Plan free no available');
		expect(error.isPlanRequired).toBe(true);
		expect(error.isAuthError).toBe(false);
		expect(error.message).toContain('Plan free no available');
	});

	it('reads the unauthorized rejection', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeKlazifyRequest(API_KEY, { method: 'POST', path: '/api/categorize' }),
		);

		expect(error.errorLabel).toBe('Unauthorized');
		expect(error.isPlanRequired).toBe(false);
		expect(error.isAuthError).toBe(true);
	});

	it('keeps the request method for the handlers', async () => {
		respond({ success: false, message: 'boom' }, 500);

		const error = await failure(
			makeKlazifyRequest(API_KEY, { method: 'POST', path: '/api/categorize' }),
		);

		expect(error.method).toBe('POST');
		expect(error.status).toBe(500);
	});

	// A discovery search carries the caller's own query, and ApiError holds the
	// request on `request.body`, so the cause must not be attached.
	it('keeps a search body and the token out of the error', async () => {
		const body = { q: 'acme confidential acquisition target', page: 2 };
		respond({ success: false, error: 'Bad Request', message: 'nope' }, 400);

		const error = await failure(
			makeKlazifyRequest(API_KEY, {
				method: 'POST',
				path: '/api/discovery',
				body,
			}),
		);

		expect(error.cause).toBeUndefined();
		for (const view of [
			error.message,
			inspect(error, { depth: 10, showHidden: true }),
			JSON.stringify(error),
		]) {
			expect(view).not.toContain('acme confidential');
			expect(view).not.toContain(API_KEY);
		}
	});

	it('wraps a transport failure and keeps the cause', async () => {
		fetchMock.mockRejectedValueOnce(new Error('socket hang up'));

		const error = await failure(
			makeKlazifyRequest(API_KEY, { method: 'POST', path: '/api/categorize' }),
		);

		expect(error.status).toBe(0);
		expect(error.message).toContain('socket hang up');
		expect(error.cause).toBeInstanceOf(Error);
	});

	it('reads a non-JSON failure body without throwing', async () => {
		respond('<html>bad gateway</html>', 502);

		const error = await failure(
			makeKlazifyRequest(API_KEY, { method: 'POST', path: '/api/categorize' }),
		);

		expect(error.status).toBe(502);
		expect(error.errorLabel).toBeUndefined();
	});
});
