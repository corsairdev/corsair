import { inspect } from 'node:util';
import {
	describePenpotError,
	makePenpotRequest,
	PenpotAPIError,
} from './client';
import { authRequired } from './test-fixtures';

const API_KEY = 'penpot-test-token';

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
async function failure(promise: Promise<unknown>): Promise<PenpotAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(PenpotAPIError);
	if (!(error instanceof PenpotAPIError)) throw error;
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

describe('makePenpotRequest', () => {
	it('POSTs the RPC to /api/rpc/command/<name> with the Token scheme', async () => {
		respond({ id: 'x', name: 'Team' }, 200);

		await makePenpotRequest(API_KEY, {
			rpcName: 'create-team',
			body: { name: 'Team' },
		});

		const sent = lastCall();
		expect(sent.url).toBe(
			'https://design.penpot.app/api/rpc/command/create-team',
		);
		expect(sent.init.method).toBe('POST');
		expect(sent.headers.get('authorization')).toBe(`Token ${API_KEY}`);
		expect(sent.headers.get('accept')).toBe('application/json');
		expect(String(sent.init.body)).toBe(JSON.stringify({ name: 'Team' }));
	});

	it('keeps the status and envelope detail on the rebuilt error', async () => {
		respond(authRequired, 401);

		const error = await failure(
			makePenpotRequest(API_KEY, { rpcName: 'get-all-projects' }),
		);
		expect(error.status).toBe(401);
		expect(error.message).toContain('authentication required');
		expect(error.name).toBe('PenpotAPIError');
	});

	it('keeps no request body on the rebuilt error', async () => {
		respond(authRequired, 401);

		const error = await failure(
			makePenpotRequest(API_KEY, {
				rpcName: 'create-comment',
				body: { threadId: 't', content: 'secret comment text' },
			}),
		);
		const printed = inspect(error);
		expect(printed).not.toContain('secret comment text');
		expect(error.message).not.toContain('secret comment text');
	});

	it('lets transport failures through unwrapped', async () => {
		fetchMock.mockRejectedValueOnce(new Error('connection reset'));

		await expect(
			makePenpotRequest(API_KEY, { rpcName: 'get-all-projects' }),
		).rejects.toThrow('connection reset');
	});

	it('retries a 429 at the transport, honouring Retry-After', async () => {
		respond({ hint: 'Slow down' }, 429);
		respond({ id: 'x' }, 200);

		const result = await makePenpotRequest(API_KEY, {
			rpcName: 'get-all-projects',
		});
		expect(result).toEqual({ id: 'x' });
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});
});

describe('describePenpotError', () => {
	it('reads the documented { type, code, hint } envelope', () => {
		expect(describePenpotError(authRequired, 'fallback')).toBe(
			'authentication required for this endpoint',
		);
	});

	it('uses the code when the hint is absent', () => {
		expect(describePenpotError({ code: 'not-found' }, 'fallback')).toBe(
			'not-found',
		);
	});

	it('falls back on anything else', () => {
		expect(describePenpotError(null, 'fallback')).toBe('fallback');
	});
});
