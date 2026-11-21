import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import { describeParadymError, makeParadymRequest } from './client';
import { issuanceSession, unauthorized } from './test-fixtures';

const API_KEY = 'pd-test-key';

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

describe('makeParadymRequest', () => {
	it('authenticates in the x-access-token header', async () => {
		respond({ data: [] }, 200);

		await makeParadymRequest(API_KEY, {
			method: 'GET',
			path: '/v1/wallets',
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.paradym.id/v1/wallets');
		expect(sent.headers.get('x-access-token')).toBe(API_KEY);
		expect(sent.init.method).toBe('GET');
	});

	it('does not send the key as a query parameter', async () => {
		respond({ data: [] }, 200);

		await makeParadymRequest(API_KEY, {
			method: 'GET',
			path: '/v1/wallets',
			query: { 'page[size]': 10 },
		});

		const sent = lastCall();
		expect(sent.url).toContain('page%5Bsize%5D=10');
		expect(sent.url).not.toContain(API_KEY);
	});

	it('sends a JSON body on POST and no query on DELETE', async () => {
		respond(undefined, 204);

		await makeParadymRequest(API_KEY, {
			method: 'POST',
			path: '/v1/wallets',
			body: { name: 'New wallet' },
		});
		let sent = lastCall();
		expect(sent.init.method).toBe('POST');
		expect(String(sent.init.body)).toBe(JSON.stringify({ name: 'New wallet' }));

		respond(undefined, 204);
		await makeParadymRequest(API_KEY, {
			method: 'DELETE',
			path: '/v1/wallets/w1/keys/k1',
			query: { stray: 1 },
		});
		sent = lastCall();
		expect(sent.init.method).toBe('DELETE');
		expect(sent.url).not.toContain('stray');
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeParadymRequest(API_KEY, { method: 'GET', path: '/v1/wallets' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('No API key provided');
		expect(error.name).toBe('ApiError');
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makeParadymRequest(API_KEY, {
				method: 'POST',
				path: '/v1/wallets',
				body: { name: 'secret-wallet' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('secret-wallet');
		expect(error.message).not.toContain('secret-wallet');
	});

	it('masks values a validation error echoes, in message and details', async () => {
		respond(
			{
				message: 'Invalid holder jane@example.com',
				details: [
					{ key: 'phone', message: 'Bad number +15555550100', value: 'x' },
				],
				code: 1001,
				echoed: { name: 'Jane Doe' },
			},
			400,
		);
		const error = await failure(
			makeParadymRequest(API_KEY, { method: 'POST', path: '/v1/wallets' }),
		);
		const printed = inspect(error, { depth: 5 });
		expect(printed).not.toContain('jane@example.com');
		expect(printed).not.toContain('5555550100');
		expect(printed).not.toContain('Jane Doe');
		expect(error.name).toBe('ApiError');
		expect(error.body).toEqual({
			message: 'Invalid holder [email]',
			code: 1001,
			details: [{ key: 'phone', message: 'Bad number [number]' }],
		});
	});

	it('falls back to the numeric error code when no message exists', async () => {
		respond({ code: 2002, details: [] }, 400);

		const error = await failure(
			makeParadymRequest(API_KEY, { method: 'GET', path: '/v1/wallets' }),
		);
		expect(error.message).toContain('error code 2002');
	});

	it('falls back to the status text for a non-JSON error body', async () => {
		respond('Not Found', 404);

		const error = await failure(
			makeParadymRequest(API_KEY, { method: 'GET', path: '/v1/wallets/nope' }),
		);
		expect(error.status).toBe(404);
		expect(error.message).toContain('Not Found');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makeParadymRequest(API_KEY, { method: 'GET', path: '/v1/wallets' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ message: 'Slow down', code: 2010 }, 429, { 'Retry-After': '0' });
		respond({ data: [issuanceSession] }, 200);

		const result = await makeParadymRequest(API_KEY, {
			method: 'GET',
			path: '/v1/wallets',
		});
		expect(result).toEqual({ data: [issuanceSession] });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describeParadymError', () => {
	it('reads the documented { message, details, code } envelope', () => {
		expect(
			describeParadymError(
				{ message: 'No API key provided', details: [], code: 2005 },
				'fallback',
			),
		).toBe('No API key provided');
	});

	it('uses the code when the message is absent', () => {
		expect(describeParadymError({ code: 2005 }, 'fallback')).toBe(
			'error code 2005',
		);
	});

	it('falls back on anything else', () => {
		expect(describeParadymError(null, 'fallback')).toBe('fallback');
	});
});
