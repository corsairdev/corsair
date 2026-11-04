import {
	errorFromEnvelope,
	GUMROAD_API_BASE,
	GumroadAPIError,
	makeGumroadRequest,
} from './client';
import { errorBody } from './test-fixtures';

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
					typeof body === 'string' ? 'text/html' : 'application/json',
				...headers,
			},
		}),
	);
}

// unknown: callers pass any request's promise, and a rejection can be any
// value until the instanceof check below narrows it.
async function failure(promise: Promise<unknown>): Promise<GumroadAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(GumroadAPIError);
	// The expect above proves the instance; the cast only widens it to the
	// class Jest sees as unknown.
	return error as GumroadAPIError;
}

// jest types mock calls as any[]; this narrows fetch's (url, init) signature.
function lastCall(): [string, RequestInit] {
	return fetchMock.mock.calls[0] as [string, RequestInit];
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeGumroadRequest', () => {
	it('sends an authenticated GET to api.gumroad.com/v2', async () => {
		respond({ success: true, products: [] }, 200);

		const result = await makeGumroadRequest('/products', 'gr-key');

		expect(result).toEqual({ success: true, products: [] });
		const [url, init] = lastCall();
		expect(url).toBe(`${GUMROAD_API_BASE}/products`);
		expect(init.method).toBe('GET');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe('Bearer gr-key');
		expect(headers.get('content-type')).toBeNull();
		expect(init.signal).toBeInstanceOf(AbortSignal);
	});

	it('sends the query string on GETs and skips unset filters', async () => {
		respond({ success: true, sales: [] }, 200);

		await makeGumroadRequest('/sales', 'gr-key', {
			query: {
				after: '2020-09-03',
				before: undefined,
				email: 'calvin@gumroad.com',
			},
		});

		const [url] = lastCall();
		expect(url).toBe(
			`${GUMROAD_API_BASE}/sales?after=2020-09-03&email=calvin%40gumroad.com`,
		);
	});

	it('sends form bodies as urlencoded POSTs with the Bearer header', async () => {
		respond({ success: true, uses: 3, purchase: {} }, 200);

		await makeGumroadRequest('/licenses/verify', 'gr-key', {
			method: 'POST',
			form: {
				product_id: '32-nPAicqbLj8B_WswVlMw==',
				license_key: 'A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD',
				increment_uses_count: 'false',
			},
		});

		const [url, init] = lastCall();
		expect(url).toBe(`${GUMROAD_API_BASE}/licenses/verify`);
		expect(init.method).toBe('POST');
		expect(init.body).toBe(
			'product_id=32-nPAicqbLj8B_WswVlMw%3D%3D&license_key=A1B2C3D4-E5F60718-9ABCDEF0-1234ABCD&increment_uses_count=false',
		);
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe('Bearer gr-key');
		expect(headers.get('content-type')).toBe(
			'application/x-www-form-urlencoded',
		);
	});

	it('turns the documented 404 JSON body into GumroadAPIError with its message', async () => {
		respond(
			errorBody('That license does not exist for the provided product.'),
			404,
		);

		const error = await failure(
			makeGumroadRequest('/licenses/verify', 'gr-key', {
				method: 'POST',
				form: { product_id: 'x', license_key: 'y' },
			}),
		);

		expect(error.status).toBe(404);
		expect(error.message).toBe(
			'Gumroad 404: That license does not exist for the provided product.',
		);
		expect(error.body).toEqual(
			errorBody('That license does not exist for the provided product.'),
		);
	});

	it('reports a 401 even though Gumroad answers it with an empty body', async () => {
		respond('', 401);

		const error = await failure(makeGumroadRequest('/products', 'gr-key'));

		expect(error.status).toBe(401);
		expect(error.message).toBe('Gumroad 401: Unauthorized');
	});

	it('reads Retry-After into the error on a 429 and does not retry itself', async () => {
		respond(errorBody('Too many requests'), 429, { 'Retry-After': '3' });

		const error = await failure(makeGumroadRequest('/sales', 'gr-key'));

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(3000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('keeps a text error body from a proxy', async () => {
		respond('Bad gateway', 502);

		const error = await failure(makeGumroadRequest('/products', 'gr-key'));

		expect(error.status).toBe(502);
		expect(error.body).toBe('Bad gateway');
		expect(error.message).toBe('Gumroad 502: Bad Gateway');
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(makeGumroadRequest('/products', 'gr-key'));

		expect(error.status).toBeUndefined();
		expect(error.message).toBe('fetch failed');
		expect(error.cause).toBeInstanceOf(TypeError);
	});
});

describe('errorFromEnvelope', () => {
	it('ignores successful envelopes and non-objects', () => {
		expect(errorFromEnvelope({ success: true, products: [] })).toBeUndefined();
		expect(errorFromEnvelope(null)).toBeUndefined();
		expect(errorFromEnvelope('ok')).toBeUndefined();
		expect(errorFromEnvelope({ products: [] })).toBeUndefined();
	});

	it('returns an error for a success:false envelope inside a 200 body', () => {
		const error = errorFromEnvelope(
			errorBody('The product could not be found.'),
		);

		expect(error).toBeInstanceOf(GumroadAPIError);
		expect(error?.message).toBe('The product could not be found.');
		expect(error?.status).toBeUndefined();
	});
});
