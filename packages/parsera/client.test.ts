import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import { describeParseraError, makeParseraRequest } from './client';
import { agentTaskCompleted, invalidKey } from './test-fixtures';

const API_KEY = 'prs-test-key';

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

describe('makeParseraRequest', () => {
	it('authenticates in the X-API-KEY header', async () => {
		respond({ ok: true }, 200);

		await makeParseraRequest(API_KEY, {
			method: 'POST',
			path: '/v1/extractor/extract',
			body: { url: 'https://example.com' },
		});

		const sent = lastCall();
		expect(sent.url).toBe('https://api.parsera.org/v1/extractor/extract');
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.init.method).toBe('POST');
		expect(String(sent.init.body)).toBe(
			JSON.stringify({ url: 'https://example.com' }),
		);
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(invalidKey, 401);

		const error = await failure(
			makeParseraRequest(API_KEY, {
				method: 'POST',
				path: '/v1/extractor/extract',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('Invalid API key');
		expect(error.name).toBe('ApiError');
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(invalidKey, 401);

		const error = await failure(
			makeParseraRequest(API_KEY, {
				method: 'POST',
				path: '/v1/extractor/extract',
				body: { url: 'https://secret.example.com/private' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('secret.example.com');
		expect(error.message).not.toContain('secret.example.com');
	});

	it('falls back to the status text for a non-JSON error body', async () => {
		respond('Not Found', 404);

		const error = await failure(
			makeParseraRequest(API_KEY, {
				method: 'GET',
				path: '/v1/agent/extract/nope',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.message).toContain('Not Found');
	});

	it('drops the request body a 422 echoes in detail[].input (seen live)', async () => {
		respond(
			{
				detail: [
					{
						type: 'missing',
						loc: ['body', 'attributes'],
						msg: 'Field required',
						input: { content: 'secret page content', prompt: 'p' },
					},
				],
			},
			422,
		);
		const error = await failure(
			makeParseraRequest(API_KEY, {
				method: 'POST',
				path: '/v1/extractor/parse',
				body: { content: 'secret page content', prompt: 'p' },
			}),
		);
		expect(inspect(error, { depth: 6 })).not.toContain('secret page content');
		expect(error.status).toBe(422);
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makeParseraRequest(API_KEY, { method: 'GET', path: '/v1/extractor/abc' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ detail: 'Slow down' }, 429, { 'Retry-After': '0' });
		respond(agentTaskCompleted, 200);

		const result = await makeParseraRequest(API_KEY, {
			method: 'GET',
			path: '/v1/agent/extract/agent-extract-abc123',
		});
		expect(result).toEqual(agentTaskCompleted);
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describeParseraError', () => {
	it('reads the documented { detail } envelope', () => {
		expect(
			describeParseraError({ detail: 'Invalid API key' }, 'fallback'),
		).toBe('Invalid API key');
	});

	it('falls back on anything else', () => {
		expect(describeParseraError(null, 'fallback')).toBe('fallback');
		expect(describeParseraError({}, 'fallback')).toBe('fallback');
	});
});
