import {
	encodeStatusCakeForm,
	makeStatusCakeRequest,
	STATUSCAKE_API_BASE,
	StatusCakeAPIError,
	segment,
} from './client';
import { uptimeList, validationError } from './test-fixtures';

const API_TOKEN = 'sc-secret-test-token';

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
async function failure(promise: Promise<unknown>): Promise<StatusCakeAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(StatusCakeAPIError);
	if (!(error instanceof StatusCakeAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeStatusCakeRequest', () => {
	it('authenticates with a Bearer token and Accept header', async () => {
		respond(uptimeList, 200);

		const result = await makeStatusCakeRequest(API_TOKEN, {
			method: 'GET',
			path: '/uptime',
			query: { page: 1, limit: 100 },
		});

		expect(result).toEqual(uptimeList);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe(`${STATUSCAKE_API_BASE}/uptime?page=1&limit=100`);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_TOKEN}`);
		expect(headers.get('accept')).toBe('application/json');
		expect(headers.get('content-type')).toBeNull();
	});

	it('sends urlencoded bodies, the only format the API accepts', async () => {
		respond(undefined, 204);

		await makeStatusCakeRequest(API_TOKEN, {
			method: 'PUT',
			path: '/uptime/123456',
			form: { paused: true, name: 'Checkout & payments' },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const headers = new Headers(init.headers);
		expect(headers.get('content-type')).toBe(
			'application/x-www-form-urlencoded',
		);
		// URLSearchParams encodes spaces as +, the standard form encoding.
		expect(String(init.body)).toBe('paused=true&name=Checkout+%26+payments');
	});

	it('repeats array fields as field[] keys and clears on an empty array', async () => {
		respond(undefined, 204);

		await makeStatusCakeRequest(API_TOKEN, {
			method: 'POST',
			path: '/uptime',
			form: { tags: ['testing', 'sales'], contact_groups: [] },
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(String(init.body)).toBe(
			'tags%5B%5D=testing&tags%5B%5D=sales&contact_groups%5B%5D=',
		);
	});

	it('returns the raw envelope for lists and undefined for a 204', async () => {
		respond(uptimeList, 200);
		await expect(
			makeStatusCakeRequest(API_TOKEN, { method: 'GET', path: '/uptime' }),
		).resolves.toEqual(uptimeList);

		respond(undefined, 204);
		await expect(
			makeStatusCakeRequest(API_TOKEN, { method: 'DELETE', path: '/uptime/1' }),
		).resolves.toBeUndefined();
	});

	it('describes an error from the documented message field', async () => {
		respond(validationError, 400);

		const error = await failure(
			makeStatusCakeRequest(API_TOKEN, {
				method: 'POST',
				path: '/uptime',
				form: { check_rate: '5' },
			}),
		);
		expect(error.status).toBe(400);
		expect(error.message).toBe(
			'StatusCake 400: The request could not be processed',
		);
		expect(error.body).toEqual(validationError);
		expect(error.method).toBe('POST');
	});

	it('keeps a bare 403 gateway denial as an auth error with no body', async () => {
		// Probed live: a wrong token is denied before the API app runs and the
		// response carries no body at all.
		respond('', 403);

		const error = await failure(
			makeStatusCakeRequest(API_TOKEN, {
				method: 'GET',
				path: '/uptime',
			}),
		);
		expect(error.status).toBe(403);
		expect(error.body).toBe('');
		expect(error.isAuthDenied).toBe(true);
	});

	it('does not call a 403 with a JSON body an auth denial', async () => {
		respond({ message: 'forbidden resource' }, 403);

		const error = await failure(
			makeStatusCakeRequest(API_TOKEN, {
				method: 'GET',
				path: '/uptime',
			}),
		);
		expect(error.isAuthDenied).toBe(false);
	});

	it('reads x-ratelimit-reset into retryAfter', async () => {
		respond(validationError, 429, { 'x-ratelimit-reset': '7' });

		const error = await failure(
			makeStatusCakeRequest(API_TOKEN, {
				method: 'GET',
				path: '/uptime',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(7000);
	});

	it('keeps a transport failure replayable with its method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeStatusCakeRequest(API_TOKEN, {
				method: 'GET',
				path: '/uptime',
			}),
		);
		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('GET');
		expect(error.status).toBeUndefined();
	});
});

describe('encodeStatusCakeForm', () => {
	it('returns undefined for no fields', () => {
		expect(encodeStatusCakeForm(undefined)).toBeUndefined();
	});

	it('drops undefined fields and encodes booleans as text', () => {
		expect(
			encodeStatusCakeForm({ paused: false, name: undefined, port: 443 }),
		).toBe('paused=false&port=443');
	});

	it('encodes an empty array as the documented clearing marker', () => {
		expect(encodeStatusCakeForm({ tags: [] })).toBe('tags%5B%5D=');
	});
});

describe('segment', () => {
	it('encodes path segments', () => {
		expect(segment('123456')).toBe('123456');
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});
