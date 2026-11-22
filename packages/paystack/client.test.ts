import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import { assertOk, describePaystackError, makePaystackRequest } from './client';
import { initializedTransaction, invalidKey } from './test-fixtures';

const API_KEY = 'sk_test_paystack';

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
async function failure(promise: Promise<unknown>): Promise<ApiError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(ApiError);
	if (!(error instanceof ApiError)) throw error;
	return error;
}

function lastCall() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url, init, headers: new Headers(init.headers) };
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

describe('makePaystackRequest', () => {
	it('authenticates with the Bearer scheme', async () => {
		respond(initializedTransaction, 200);

		await makePaystackRequest(API_KEY, {
			method: 'POST',
			path: '/transaction/initialize',
			body: { amount: '10000', email: 'john.doe@example.com' },
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.paystack.co/transaction/initialize');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('fails a 200 answer whose body says status false', async () => {
		respond(
			{
				status: false,
				message: 'Plan not found',
			},
			200,
		);

		const error = await failure(
			makePaystackRequest(API_KEY, { method: 'GET', path: '/plan/1' }),
		);
		expect(error.status).toBe(200);
		expect(error.message).toContain('Plan not found');
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(invalidKey, 401);

		const error = await failure(
			makePaystackRequest(API_KEY, { method: 'GET', path: '/transaction' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Invalid key');
		expect(error.name).toBe('ApiError');
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(invalidKey, 401);

		const error = await failure(
			makePaystackRequest(API_KEY, {
				method: 'POST',
				path: '/transaction/initialize',
				body: { amount: '10000', email: 'john.doe@example.com' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('john.doe@example.com');
		expect(error.message).not.toContain('john.doe@example.com');
	});

	it('masks an email in the path on the rebuilt error', async () => {
		respond({ status: false, message: 'Customer not found' }, 404);
		const error = await failure(
			makePaystackRequest(API_KEY, {
				method: 'GET',
				path: `/customer/${encodeURIComponent('buyer@example.com')}`,
			}),
		);
		expect(error.name).toBe('ApiError');
		expect(error.status).toBe(404);
		expect(inspect(error)).not.toContain('buyer');
		expect(error.url).toBe('/customer/[email]');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePaystackRequest(API_KEY, { method: 'GET', path: '/transaction' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ message: 'Slow down' }, 429, { 'Retry-After': '0' });
		respond(initializedTransaction, 200);

		const result = await makePaystackRequest(API_KEY, {
			method: 'POST',
			path: '/transaction/initialize',
			body: { amount: '10000', email: 'john.doe@example.com' },
		});
		expect(result).toEqual(initializedTransaction);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('assertOk', () => {
	it('passes a normal success envelope through', () => {
		expect(assertOk(initializedTransaction)).toBe(initializedTransaction);
	});

	it('throws on a status-false envelope even inside a 200', () => {
		expect(() => assertOk({ status: false, message: 'nope' })).toThrow(
			ApiError,
		);
	});
});

describe('describePaystackError', () => {
	it('reads the documented { status, message } envelope', () => {
		expect(describePaystackError(invalidKey, 'fallback')).toBe('Invalid key');
	});

	it('falls back on anything else', () => {
		expect(describePaystackError(null, 'fallback')).toBe('fallback');
	});
});
