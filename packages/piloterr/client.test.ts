import { ApiError } from 'corsair/http';
import { describePiloterrError, makePiloterrRequest } from './client';
import { invalidApiKey } from './test-fixtures';

const KEY = 'pt-test-key';

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

describe('makePiloterrRequest', () => {
	it('authenticates with the x-api-key header', async () => {
		respond({ remaining: 1 }, 200);

		await makePiloterrRequest(KEY, {
			method: 'GET',
			path: '/v2/usage',
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.piloterr.com/v2/usage');
		expect(sent.headers.get('x-api-key')).toBe(KEY);
	});

	it('sends query parameters on the URL', async () => {
		respond('{}', 200);

		await makePiloterrRequest(KEY, {
			method: 'GET',
			path: '/v2/google/search',
			query: { query: 'best electric cars', gl: 'us', page: 2 },
		});

		expect(lastCall().url).toBe(
			'https://api.piloterr.com/v2/google/search?query=best%20electric%20cars&gl=us&page=2',
		);
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(invalidApiKey, 401);

		const error = await failure(
			makePiloterrRequest(KEY, { method: 'GET', path: '/v2/usage' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe('Piloterr 401: Invalid API Key');
		expect(error.request.method).toBe('GET');
		expect(error.url).toBe('/v2/usage');
	});

	it('drops the request query from the rebuilt error', async () => {
		respond(invalidApiKey, 401);

		const error = await failure(
			makePiloterrRequest(KEY, {
				method: 'GET',
				path: '/v2/google/search',
				query: { query: 'internal search terms' },
			}),
		);
		const printed = JSON.stringify(error.request);
		expect(printed).not.toContain('internal search terms');
	});

	it('requests binary answers when responseType is binary', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([1, 2, 3]), {
				status: 200,
				headers: { 'Content-Type': 'image/png' },
			}),
		);

		const raw = await makePiloterrRequest(KEY, {
			method: 'GET',
			path: '/v2/website/screenshot',
			query: { url: 'https://example.com' },
			responseType: 'binary',
		});
		const file = raw as { bytes?: Uint8Array; contentType?: string | null };
		expect(file.bytes?.byteLength).toBe(3);
		expect(file.contentType).toBe('image/png');
	});
});

describe('describePiloterrError', () => {
	it('extracts the documented error field', () => {
		expect(describePiloterrError(invalidApiKey, 'fallback')).toBe(
			'Invalid API Key',
		);
	});

	it('falls back on unknown bodies', () => {
		expect(describePiloterrError(null, 'fallback')).toBe('fallback');
		expect(describePiloterrError('plain text', 'fallback')).toBe('fallback');
	});
});
