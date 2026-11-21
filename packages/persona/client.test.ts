import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import { describePersonaError, makePersonaRequest } from './client';
import { authRequired } from './test-fixtures';

const API_KEY = 'persona-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
function respond(body: unknown, status: number) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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

describe('makePersonaRequest', () => {
	it('authenticates with the Bearer scheme and sends the version header', async () => {
		respond({ data: {} }, 200);

		await makePersonaRequest(API_KEY, { method: 'GET', path: '/inquiries' });

		const sent = lastCall();
		expect(sent.url).toBe('https://api.withpersona.com/api/v1/inquiries');
		expect(sent.headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(sent.headers.get('persona-version')).toBe('2023-01-05');
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(authRequired, 401);

		const error = await failure(
			makePersonaRequest(API_KEY, { method: 'GET', path: '/inquiries' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Must be authenticated');
		// R8: core's own ApiError, so management maps it to its real status.
		expect(error.name).toBe('ApiError');
		expect(error.constructor).toBe(ApiError);
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(authRequired, 401);

		const error = await failure(
			makePersonaRequest(API_KEY, {
				method: 'POST',
				path: '/inquiries',
				body: { data: { attributes: { note: 'private note' } } },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('private note');
		expect(error.message).not.toContain('private note');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePersonaRequest(API_KEY, { method: 'GET', path: '/inquiries' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ errors: [{ title: 'Slow down' }] }, 429);
		respond({ data: {} }, 200);

		const result = await makePersonaRequest(API_KEY, {
			method: 'GET',
			path: '/inquiries',
		});
		expect(result).toEqual({ data: {} });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('error body', () => {
	it('keeps only error titles, not the details that echo submitted values', async () => {
		respond(
			{
				errors: [
					{
						title: 'Invalid attribute',
						details: 'name-first "Jane" birthdate "1990-01-01" is invalid',
					},
				],
			},
			422,
		);
		const error = await failure(
			makePersonaRequest(API_KEY, { method: 'POST', path: '/accounts' }),
		);
		expect(error.body).toEqual({ errors: [{ title: 'Invalid attribute' }] });
		expect(JSON.stringify(error)).not.toContain('1990-01-01');
	});
});

describe('describePersonaError', () => {
	it('reads the documented { errors: [{ title }] } envelope', () => {
		expect(describePersonaError(authRequired, 'fallback')).toBe(
			'Must be authenticated to access this endpoint',
		);
	});

	it('falls back on anything else', () => {
		expect(describePersonaError(null, 'fallback')).toBe('fallback');
	});
});
