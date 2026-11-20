import { inspect } from 'node:util';
import {
	describePexelsError,
	makePexelsRequest,
	PexelsAPIError,
} from './client';
import { unauthorized } from './test-fixtures';

const API_KEY = 'px-test-key';

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
async function failure(promise: Promise<unknown>): Promise<PexelsAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(PexelsAPIError);
	if (!(error instanceof PexelsAPIError)) throw error;
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

describe('makePexelsRequest', () => {
	it('authenticates with the raw key in the Authorization header, no scheme word', async () => {
		respond({ photos: [] }, 200);

		await makePexelsRequest(API_KEY, {
			method: 'GET',
			path: '/v1/search',
			query: { query: 'nature' },
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.pexels.com/v1/search?query=nature');
		expect(sent.headers.get('authorization')).toBe(API_KEY);
		expect(sent.headers.get('authorization')).not.toContain('Bearer');
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePexelsRequest(API_KEY, { method: 'GET', path: '/v1/curated' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Invalid API key');
		expect(error.name).toBe('PexelsAPIError');
	});

	it('keeps no search query on the rebuilt error', async () => {
		respond(unauthorized, 401);

		const error = await failure(
			makePexelsRequest(API_KEY, {
				method: 'GET',
				path: '/v1/search',
				query: { query: 'private search probe' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('private search probe');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePexelsRequest(API_KEY, { method: 'GET', path: '/v1/curated' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ message: 'Slow down' }, 429);
		respond({ photos: [] }, 200);

		const result = await makePexelsRequest(API_KEY, {
			method: 'GET',
			path: '/v1/curated',
		});
		expect(result).toEqual({ photos: [] });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describePexelsError', () => {
	it('reads the documented { status, code, message } envelope', () => {
		expect(describePexelsError(unauthorized, 'fallback')).toBe(
			'Invalid API key',
		);
	});

	it('falls back on anything else', () => {
		expect(describePexelsError(null, 'fallback')).toBe('fallback');
	});
});
