import { ApiError } from 'corsair/http';
import {
	encodeStannpForm,
	makeStannpRequest,
	STANNP_HOSTS,
	StannpAPIError,
	segment,
} from './client';
import { badKey, balance } from './test-fixtures';

const API_KEY = 'sp-secret-test-key';

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
async function failure(promise: Promise<unknown>): Promise<StannpAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(StannpAPIError);
	if (!(error instanceof StannpAPIError)) throw error;
	return error;
}

function sentAuth() {
	const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
	const headers = new Headers(init.headers);
	return {
		authorization: headers.get('authorization'),
		contentType: headers.get('content-type'),
		idempotency: headers.get('x-idempotency-key'),
		init,
	};
}

beforeEach(() => {
	// Queued responses come first; any request beyond them fails instead of
	// reaching the real API.
	fetchMock = jest
		.spyOn(globalThis, 'fetch')
		.mockRejectedValue(new Error('unexpected request in a unit test'));
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeStannpRequest', () => {
	it('authenticates with HTTP Basic, the key as the username', async () => {
		respond({ success: true, data: balance }, 200);

		const result = await makeStannpRequest(API_KEY, {
			method: 'GET',
			base: STANNP_HOSTS.us,
			path: '/v1/accounts/balance',
		});

		expect(result).toEqual(balance);
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api-us1.stannp.com/v1/accounts/balance');
		expect(init.method).toBe('GET');
		const expected = Buffer.from(`${API_KEY}:`).toString('base64');
		expect(sentAuth().authorization).toBe(`Basic ${expected}`);
	});

	it('sends the form body as urlencoded with the right content type', async () => {
		respond({ success: true, data: 1 }, 200);

		await makeStannpRequest(API_KEY, {
			method: 'POST',
			base: STANNP_HOSTS.us,
			path: '/v1/recipients/delete',
			form: { id: 12345, test: true, name: undefined },
		});

		const { contentType, init } = sentAuth();
		expect(contentType).toBe('application/x-www-form-urlencoded');
		// Booleans are the literal strings the docs' curl examples use, and
		// undefined fields are dropped rather than sent empty.
		expect(String(init.body)).toBe('id=12345&test=true');
	});

	it('indexes array fields PHP-style so no value is lost', async () => {
		respond({ success: true, data: 'https://merged.pdf' }, 200);

		await makeStannpRequest(API_KEY, {
			method: 'POST',
			base: STANNP_HOSTS.us,
			path: '/v1/pdf/merge',
			form: { files: ['https://a.pdf', 'https://b.pdf'] },
		});

		const { init } = sentAuth();
		expect(String(init.body)).toBe(
			'files%5B0%5D=https%3A%2F%2Fa.pdf&files%5B1%5D=https%3A%2F%2Fb.pdf',
		);
	});

	it('sends the X-Idempotency-Key header when one is set', async () => {
		respond({ success: true, data: {} }, 200);

		await makeStannpRequest(API_KEY, {
			method: 'POST',
			base: STANNP_HOSTS.us,
			path: '/v1/letters/create',
			form: { test: true },
			idempotencyKey: 'e367c03e-3082',
		});

		expect(sentAuth().idempotency).toBe('e367c03e-3082');
	});

	it('unwraps the data envelope', async () => {
		respond({ success: true, data: [1, 2] }, 200);
		await expect(
			makeStannpRequest(API_KEY, {
				method: 'GET',
				base: STANNP_HOSTS.us,
				path: '/v1/groups/list',
			}),
		).resolves.toEqual([1, 2]);
	});

	it('passes through a body with no envelope', async () => {
		respond('plain', 200, {});
		await expect(
			makeStannpRequest(API_KEY, {
				method: 'GET',
				base: STANNP_HOSTS.us,
				path: '/v1/whatever',
			}),
		).resolves.toBe('plain');
	});

	it('throws on a 200 body that says error', async () => {
		respond(badKey, 200);

		const error = await failure(
			makeStannpRequest(API_KEY, {
				method: 'GET',
				base: STANNP_HOSTS.us,
				path: '/v1/accounts/balance',
			}),
		);
		// The provider's own error text, without a status that never was.
		expect(error.message).toBe(badKey.error);
		expect(error.body).toEqual(badKey);
	});

	it('describes a 401 with the documented error field', async () => {
		respond(badKey, 401);

		const error = await failure(
			makeStannpRequest(API_KEY, {
				method: 'POST',
				base: STANNP_HOSTS.us,
				path: '/v1/recipients/new',
				form: { firstname: 'John' },
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe(`Stannp 401: ${badKey.error}`);
		expect(error.method).toBe('POST');
		// Core's ApiError, so the 429 handler and core read status/retryAfter,
		// rebuilt without the form body that carries recipient data.
		expect(error).toBeInstanceOf(ApiError);
		expect(error.request.body).toBeUndefined();
		expect(JSON.stringify(error)).not.toContain('John');
		expect(error.cause).toBeUndefined();
	});

	it('keeps only non-personal fields of a 409 replay, in the body and the message', async () => {
		respond(
			{
				success: true,
				data: {
					id: 41,
					status: 'received',
					cost: '0.81',
					firstname: 'Jane',
					lastname: 'Doe',
					address1: '1 Secret Lane',
				},
			},
			409,
		);

		const error = await failure(
			makeStannpRequest(API_KEY, {
				method: 'POST',
				base: STANNP_HOSTS.us,
				path: '/v1/letters/create',
				form: { test: false },
			}),
		);
		expect(error.status).toBe(409);
		expect(error.body).toEqual({
			success: true,
			data: { id: 41, status: 'received', cost: '0.81' },
		});
		expect(error.message).not.toContain('Secret Lane');
		expect(JSON.stringify(error)).not.toContain('Jane');
	});

	it('keeps the replayed success body on a 409 idempotent conflict', async () => {
		respond({ success: true, data: { id: '41' } }, 409);

		const error = await failure(
			makeStannpRequest(API_KEY, {
				method: 'POST',
				base: STANNP_HOSTS.us,
				path: '/v1/letters/create',
				form: { test: true },
			}),
		);
		expect(error.status).toBe(409);
		expect(error.body).toEqual({ success: true, data: { id: '41' } });
	});

	it('reads X-RateLimit-Reset into retryAfter', async () => {
		respond({ success: false, error: 'Too many requests' }, 429, {
			'X-RateLimit-Reset': '46',
		});

		const error = await failure(
			makeStannpRequest(API_KEY, {
				method: 'GET',
				base: STANNP_HOSTS.us,
				path: '/v1/recipients/list',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(46_000);
	});

	it('targets the eu host for the eu region', async () => {
		respond({ success: true, data: balance }, 200);

		await makeStannpRequest(API_KEY, {
			method: 'GET',
			base: STANNP_HOSTS.eu,
			path: '/v1/accounts/balance',
		});
		expect(fetchMock.mock.calls[0]?.[0]).toBe(
			'https://api-eu1.stannp.com/v1/accounts/balance',
		);
	});

	it('lets a transport failure through unchanged', async () => {
		const transport = new TypeError('fetch failed');
		fetchMock.mockRejectedValueOnce(transport);

		await expect(
			makeStannpRequest(API_KEY, {
				method: 'GET',
				base: STANNP_HOSTS.us,
				path: '/v1/accounts/balance',
			}),
		).rejects.toBe(transport);
	});
});

describe('encodeStannpForm', () => {
	it('returns undefined for no fields', () => {
		expect(encodeStannpForm(undefined)).toBeUndefined();
		expect(encodeStannpForm({})).toBe('');
	});

	it('encodes booleans and numbers as strings', () => {
		expect(encodeStannpForm({ test: false, padding: 0, keep: true })).toBe(
			'test=false&padding=0&keep=true',
		);
	});
});

describe('segment', () => {
	it('encodes path segments', () => {
		expect(segment('2024-01-01')).toBe('2024-01-01');
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});
