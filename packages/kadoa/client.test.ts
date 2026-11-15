import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	KADOA_STREAM_TIMEOUT_MS,
	KadoaAPIError,
	kadoaErrorCode,
	makeKadoaRequest,
	messageResult,
} from './client';

const API_KEY = 'tk-test-key';

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	contentType = 'application/json',
) {
	fetchMock.mockResolvedValueOnce(
		new Response(
			contentType === 'application/json' ? JSON.stringify(body) : String(body),
			{
				status,
				headers: { 'Content-Type': contentType },
			},
		),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		body: init.body,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeKadoaRequest', () => {
	it('sends the key in x-api-key and no Authorization header', async () => {
		respond({ ok: true });

		await makeKadoaRequest(API_KEY, { method: 'GET', path: '/v4/workflows' });

		const sent = lastRequest();
		expect(sent.headers.get('x-api-key')).toBe(API_KEY);
		expect(sent.headers.get('authorization')).toBeNull();
	});

	it('accepts JSON and nothing else', async () => {
		respond({ ok: true });

		await makeKadoaRequest(API_KEY, { method: 'GET', path: '/v4/locations' });

		expect(lastRequest().headers.get('accept')).toBe('application/json');
	});

	it('sends a body as JSON and sets the content type', async () => {
		respond({ ok: true });

		await makeKadoaRequest(API_KEY, {
			method: 'POST',
			path: '/v4/workflows',
			body: { urls: ['https://acme.example'] },
		});

		const sent = lastRequest();
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toBe('{"urls":["https://acme.example"]}');
	});

	it('sends no body and no content type for a request with none', async () => {
		respond({ ok: true });

		await makeKadoaRequest(API_KEY, {
			method: 'PUT',
			path: '/v4/workflows/wf/pause',
		});

		const sent = lastRequest();
		expect(sent.body).toBeUndefined();
		expect(sent.headers.get('content-type')).toBeNull();
	});

	it('encodes query values, repeating an array', async () => {
		respond({ ok: true });

		await makeKadoaRequest(API_KEY, {
			method: 'GET',
			path: '/v4/workflows',
			query: {
				search: 'a b',
				tags: ['one', 'two'],
				skip: 0,
				includeDeleted: false,
			},
		});

		const [url] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(url).toContain('search=a%20b');
		expect(url).toContain('tags=one&tags=two');
		expect(url).toContain('skip=0');
		expect(url).toContain('includeDeleted=false');
	});

	it('returns the parsed JSON body', async () => {
		respond({ workflows: [{ id: 'wf_01' }] });

		await expect(
			makeKadoaRequest(API_KEY, { method: 'GET', path: '/v4/workflows' }),
		).resolves.toEqual({ workflows: [{ id: 'wf_01' }] });
	});

	it('returns a plain-text body as a string', async () => {
		respond('Workflow paused', 200, 'text/plain');

		await expect(
			makeKadoaRequest(API_KEY, {
				method: 'PUT',
				path: '/v4/workflows/wf/pause',
			}),
		).resolves.toBe('Workflow paused');
	});

	it('turns a 401 into one error with the status and message', async () => {
		respond({ error: 'Unauthorized' }, 401);

		await expect(
			makeKadoaRequest(API_KEY, { method: 'GET', path: '/v4/workflows' }),
		).rejects.toMatchObject({
			name: 'ApiError',
			status: 401,
			message: 'Kadoa 401: Unauthorized',
			request: { method: 'GET' },
		});
	});

	it('reads a reason from a 429 body as the code', async () => {
		respond(
			{ error: 'Too many concurrent jobs', reason: 'PIPELINE_CROWDED' },
			429,
		);

		const error = await makeKadoaRequest(API_KEY, {
			method: 'PUT',
			path: '/v4/workflows/wf/run',
		}).catch((caught: unknown) => caught);

		expect(error).toMatchObject({ status: 429 });
		expect(kadoaErrorCode(error)).toBe('PIPELINE_CROWDED');
	});

	it('lets core ApiError through with its status and rate-limit fields', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'Too many requests' }), {
				status: 429,
				headers: {
					'Content-Type': 'application/json',
					'Retry-After': '2',
					'X-RateLimit-Remaining': '0',
				},
			}),
		);

		const error = await makeKadoaRequest(API_KEY, {
			method: 'GET',
			path: '/v4/workflows',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({
			status: 429,
			retryAfter: 2000,
			message: 'Kadoa 429: Too many requests',
		});
	});

	it('uses a fixed message when the body has none, not the raw body', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('upstream said: row secret-value', {
				status: 504,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);

		const error = await makeKadoaRequest(API_KEY, {
			method: 'GET',
			path: '/v4/workflows',
		}).catch((caught: unknown) => caught);

		expect(error).toMatchObject({
			status: 504,
			message: 'Kadoa 504: Kadoa request failed',
		});
	});

	it('rejects a key with a line break without quoting it', async () => {
		const badKey = 'tk-secret-part\nsecond-line';

		const error = await makeKadoaRequest(badKey, {
			method: 'GET',
			path: '/v4/workflows',
		}).catch((caught: unknown) => caught);

		// Outside jest, Node's Headers TypeError quotes the whole value; jest's
		// separate realm hides that, so the message is asserted directly.
		expect(error).toBeInstanceOf(KadoaAPIError);
		expect(error).toMatchObject({
			message: expect.stringContaining('line break'),
		});
		expect(fetchMock).not.toHaveBeenCalled();
		expect(inspect(error, { depth: 10 })).not.toContain('tk-secret-part');
	});

	it('reads the error field of a body that has no message', async () => {
		respond({ error: 'Workflow is not ready to run' }, 400);

		await expect(
			makeKadoaRequest(API_KEY, {
				method: 'PUT',
				path: '/v4/workflows/wf/run',
			}),
		).rejects.toMatchObject({
			message: 'Kadoa 400: Workflow is not ready to run',
		});
	});

	it('keeps a Retry-After header as milliseconds', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ error: 'Too many requests' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '3' },
			}),
		);

		await expect(
			makeKadoaRequest(API_KEY, { method: 'GET', path: '/v4/workflows' }),
		).rejects.toMatchObject({ retryAfter: 3000 });
	});

	it('does not keep the sent body on the error through its cause', async () => {
		respond({ error: false, message: 'Duplicate key' }, 409);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKadoaRequest(API_KEY, {
			method: 'POST',
			path: '/v4/variables/',
			body: { key: 'login', value: 'hunter2', dataType: 'SECRET' },
		}).catch((caught: unknown) => caught)) as Error;

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 409 });
		expect(error.cause).toBeUndefined();
		expect(inspect(error, { depth: 10 })).not.toContain('hunter2');
	});

	it('reads the `code` Kadoa sends on a workflow data conflict', async () => {
		respond(
			{ code: 'DATA_NOT_PUBLISHED', error: 'No published run', runId: 'r1' },
			409,
		);

		const error = await makeKadoaRequest(API_KEY, {
			method: 'GET',
			path: '/v4/workflows/wf/data',
		}).catch((caught: unknown) => caught);

		expect(error).toMatchObject({ status: 409 });
		expect(kadoaErrorCode(error)).toBe('DATA_NOT_PUBLISHED');
	});

	it('waits five minutes for a request that asks for it', async () => {
		const timeout = jest.spyOn(AbortSignal, 'timeout');
		respond({ ok: true });

		await makeKadoaRequest(API_KEY, {
			method: 'GET',
			path: '/v4/workflows/wf/data',
			timeoutMs: KADOA_STREAM_TIMEOUT_MS,
		});

		expect(timeout).toHaveBeenCalledWith(300_000);
		timeout.mockRestore();
	});

	it('marks a transport failure and keeps the method', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(
			makeKadoaRequest(API_KEY, { method: 'GET', path: '/v4/workflows' }),
		).rejects.toMatchObject({
			name: 'KadoaAPIError',
			transport: true,
			method: 'GET',
			message: 'fetch failed',
		});
	});

	it('separates a timeout from a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out.', 'TimeoutError'),
		);

		await expect(
			makeKadoaRequest(API_KEY, { method: 'GET', path: '/v4/workflows' }),
		).rejects.toMatchObject({ timedOut: true, transport: true });
	});

	it('drops the key from the error message a failed request carries', async () => {
		respond({ error: 'Unauthorized' }, 401);

		// unknown: the rejection is an error whose fields the assertions read.
		const error = (await makeKadoaRequest(API_KEY, {
			method: 'GET',
			path: '/v4/workflows',
		}).catch((caught: unknown) => caught)) as Error;

		expect(require('node:util').inspect(error)).not.toContain(API_KEY);
	});
});

describe('messageResult', () => {
	// unknown: a thrown value has no static type until the assertion narrows it.
	function caughtError(run: () => unknown): unknown {
		try {
			run();
		} catch (error: unknown) {
			return error;
		}
		return undefined;
	}

	it('reads a plain-text message', () => {
		expect(messageResult('Workflow deleted', 'workflows.delete')).toEqual({
			message: 'Workflow deleted',
		});
	});

	it('reads a message from a JSON body', () => {
		expect(
			messageResult({ message: 'Workflow paused' }, 'workflows.pause'),
		).toEqual({
			message: 'Workflow paused',
		});
	});

	it.each([
		[undefined],
		[null],
		['[object Object]'],
		[{}],
		[[]],
		[{ message: '' }],
	])('throws for %j rather than report a success', (raw) => {
		// The error message names the operation, so a caller can tell which
		// call returned nothing.
		expect(String(caughtError(() => messageResult(raw, 'x.delete')))).toContain(
			'Kadoa returned no message for x.delete',
		);
	});
});
