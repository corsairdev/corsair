import { inspect } from 'node:util';
import {
	describePayhereError,
	makePayhereRequest,
	PayhereAPIError,
} from './client';
import { unauthorized, user } from './test-fixtures';

const API_KEY = 'ph-test-key';

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
async function failure(promise: Promise<unknown>): Promise<PayhereAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(PayhereAPIError);
	if (!(error instanceof PayhereAPIError)) throw error;
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

describe('makePayhereRequest', () => {
	it('authenticates with the Bearer scheme', async () => {
		respond({ data: user }, 200);

		await makePayhereRequest(API_KEY, { method: 'GET', path: '/api/v1/user' });

		const sent = lastCall();
		expect(sent.url).toBe('https://api.payhere.co/api/v1/user');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
	});

	it('sends query params on GET and a JSON body on POST', async () => {
		respond({ data: [] }, 200);
		await makePayhereRequest(API_KEY, {
			method: 'GET',
			path: '/api/v1/payments',
			query: { page: 2, per_page: 50 },
		});
		let sent = lastCall();
		expect(sent.url).toContain('page=2');
		expect(sent.url).toContain('per_page=50');

		respond(undefined, 204);
		await makePayhereRequest(API_KEY, {
			method: 'POST',
			path: '/api/v1/refunds',
			body: { payment_id: 1, amount: 1.5, reason: 'duplicate' },
		});
		sent = lastCall();
		expect(String(sent.init.body)).toBe(
			JSON.stringify({ payment_id: 1, amount: 1.5, reason: 'duplicate' }),
		);
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePayhereRequest(API_KEY, { method: 'GET', path: '/api/v1/user' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Unauthorized');
		expect(error.name).toBe('PayhereAPIError');
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePayhereRequest(API_KEY, {
				method: 'POST',
				path: '/api/v1/refunds',
				body: { payment_id: 1, amount: 1.5, reason: 'duplicate' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('payment_id');
		expect(error.message).not.toContain('payment_id');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePayhereRequest(API_KEY, { method: 'GET', path: '/api/v1/user' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ error: 'Slow down' }, 429, { 'Retry-After': '0' });
		respond({ data: [user] }, 200);

		const result = await makePayhereRequest(API_KEY, {
			method: 'GET',
			path: '/api/v1/user',
		});
		expect(result).toEqual({ data: [user] });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describePayhereError', () => {
	it('reads the documented { error } envelope', () => {
		expect(describePayhereError({ error: 'Unauthorized' }, 'fallback')).toBe(
			'Unauthorized',
		);
	});

	it('falls back on anything else', () => {
		expect(describePayhereError(null, 'fallback')).toBe('fallback');
	});
});
