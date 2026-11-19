import {
	describeStormboardError,
	makeStormboardRequest,
	STORMBOARD_API_BASE,
	StormboardAPIError,
} from './client';
import { noAuth, validationFailed } from './test-fixtures';

const API_KEY = 'sb-secret-test-key';

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
async function failure(promise: Promise<unknown>): Promise<StormboardAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(StormboardAPIError);
	if (!(error instanceof StormboardAPIError)) throw error;
	return error;
}

beforeEach(() => {
	// Any call a test did not queue a response for throws, so no test can
	// reach the real API.
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeStormboardRequest', () => {
	it('authenticates with the X-API-Key header at the v1 base', async () => {
		respond({ storms: [] }, 200);

		const result = await makeStormboardRequest(API_KEY, {
			method: 'GET',
			path: '/storms/list',
		});

		expect(result).toEqual({ storms: [] });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${STORMBOARD_API_BASE}/storms/list`);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('x-api-key')).toBe(API_KEY);
		expect(headers.get('accept')).toBe('application/json');
	});

	it('sends a JSON body with the content type on POST', async () => {
		respond({ message: 'Storm created', id: 1 }, 200);

		await makeStormboardRequest(API_KEY, {
			method: 'POST',
			path: '/storms',
			body: { plan: 'Team', title: 'New Storm' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('POST');
		expect(new Headers(init.headers).get('content-type')).toBe(
			'application/json',
		);
		expect(String(init.body)).toBe('{"plan":"Team","title":"New Storm"}');
	});

	it('carries query parameters on DELETE', async () => {
		respond({ message: 'Idea Connector deleted' }, 200);

		await makeStormboardRequest(API_KEY, {
			method: 'DELETE',
			path: '/ideas/connector',
			query: { from_idea_id: 1000, to_idea_id: 1001 },
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(init.method).toBe('DELETE');
		expect(url).toContain('from_idea_id=1000');
		expect(url).toContain('to_idea_id=1001');
	});

	it('surfaces the 403 auth envelope as a typed error', async () => {
		respond(noAuth, 403);

		const error = await failure(
			makeStormboardRequest(API_KEY, { method: 'GET', path: '/users/test' }),
		);
		expect(error.message).toBe(
			'Stormboard 403: No authentication method set, it is required for this endpoint',
		);
		expect(error.status).toBe(403);
		expect(error.method).toBe('GET');
	});

	it('surfaces the 400 validation envelope as a typed error', async () => {
		respond(validationFailed, 400);

		const error = await failure(
			makeStormboardRequest(API_KEY, {
				method: 'POST',
				path: '/users',
				body: { lastname: 'Dean' },
			}),
		);
		expect(error.message).toBe('Stormboard 400: First name cannot be blank');
		expect(error.body).toEqual(validationFailed);
		expect(error.method).toBe('POST');
	});

	it('keeps a non-JSON body readable', async () => {
		respond('<html>Page Not Found</html>', 404);

		const error = await failure(
			makeStormboardRequest(API_KEY, { method: 'GET', path: '/templates' }),
		);
		expect(error.status).toBe(404);
		expect(error.message).toBe('Stormboard 404: Not Found');
	});

	it('copies retryAfter from Retry-After onto the error', async () => {
		respond({ error: 'rate limited' }, 429, { 'Retry-After': '5' });

		const error = await failure(
			makeStormboardRequest(API_KEY, { method: 'GET', path: '/storms/list' }),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(5000);
	});
});

describe('describeStormboardError', () => {
	it('prefers the auth error field, then the message', () => {
		expect(describeStormboardError(noAuth, 'fallback')).toBe(
			'No authentication method set, it is required for this endpoint',
		);
		expect(describeStormboardError(validationFailed, 'fallback')).toBe(
			'First name cannot be blank',
		);
		expect(describeStormboardError(null, 'fallback')).toBe('fallback');
	});
});
