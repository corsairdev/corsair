import util from 'node:util';
import { MozAPIError, makeMozRequest } from './client';
import {
	authErrorEnvelope,
	quota,
	quotaErrorEnvelope,
	serverErrorEnvelope,
} from './test-fixtures';

const ctx = { key: 'moz-token-123' };

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(
	body: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a promise can reject with any value; each caller narrows to what
// it asserts on.
async function captureError(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((caught: unknown) => caught);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeMozRequest', () => {
	it('POSTs to /jsonrpc with the x-moz-token header and a JSON-RPC envelope', async () => {
		respond({ id: 'id-1', jsonrpc: '2.0', result: { quota } });

		const result = await makeMozRequest(ctx, {
			method: 'quota.lookup',
			data: { path: 'api.limits.data.rows' },
			replayable: true,
		});

		expect(result).toEqual({ quota });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.moz.com/jsonrpc');
		expect(init.method).toBe('POST');
		const headers = new Headers(init.headers);
		expect(headers.get('x-moz-token')).toBe('moz-token-123');
		expect(headers.get('content-type')).toBe('application/json');
		// unknown: the request body is whatever the client serialized.
		// unknown: the request body is whatever the client serialized.
		const sent = JSON.parse(String(init.body)) as Record<string, unknown>;
		expect(sent.jsonrpc).toBe('2.0');
		expect(sent.method).toBe('quota.lookup');
		expect(sent.params).toEqual({ data: { path: 'api.limits.data.rows' } });
		// The id must be at least 24 characters of letters, numbers and
		// hyphens; a V4 UUID satisfies the documented rule.
		const id = sent.id as string;
		expect(id).toMatch(/^[0-9a-f-]{36}$/);
	});

	it('unwraps the result member', async () => {
		respond({
			id: 'id-2',
			jsonrpc: '2.0',
			result: { engine: 'google', locales: ['en-US'] },
		});

		const result = await makeMozRequest(ctx, {
			method: 'metadata.locale.list',
			data: { engine: 'google' },
		});

		expect(result).toEqual({ engine: 'google', locales: ['en-US'] });
	});

	it('maps a JSON-RPC error envelope to MozAPIError with code and status', async () => {
		respond(authErrorEnvelope, 401);

		const error = (await captureError(
			makeMozRequest(ctx, {
				method: 'quota.lookup',
				data: { path: 'api.limits.data.rows' },
			}),
		)) as MozAPIError;

		expect(error).toBeInstanceOf(MozAPIError);
		expect(error.code).toBe(-32651);
		// The auth envelope spells it httpStatus; the client normalises it.
		expect(error.status).toBe(401);
		expect(error.message).toContain('Missing or invalid authentication');
		expect(error.replayable).toBeUndefined();
	});

	it('reads status, issue and key from a validation error', async () => {
		respond(
			{
				id: 'id-3',
				jsonrpc: '2.0',
				error: {
					code: -32652,
					status: 400,
					data: {
						explanation: 'query is a required field and was not included.',
						issue: 'param-is-missing',
						key: 'query',
					},
					message: 'Please include a query',
				},
			},
			400,
		);

		const error = (await captureError(
			makeMozRequest(ctx, { method: 'data.site.metrics.fetch' }),
		)) as MozAPIError;

		expect(error.code).toBe(-32652);
		expect(error.status).toBe(400);
		expect(error.issue).toBe('param-is-missing');
		expect(error.key).toBe('query');
	});

	it('treats a 2xx body that carries an error member as a failure', async () => {
		respond(quotaErrorEnvelope, 200);

		const error = (await captureError(
			makeMozRequest(ctx, {
				method: 'quota.lookup',
				data: { path: 'api.limits.data.rows' },
			}),
		)) as MozAPIError;

		expect(error).toBeInstanceOf(MozAPIError);
		expect(error.code).toBe(-32670);
		expect(error.status).toBe(403);
		expect(error.issue).toBe('insufficient-quota');
	});

	it('fails loudly when a 2xx body has neither result nor error', async () => {
		respond({ id: 'id-4', jsonrpc: '2.0' });

		const error = (await captureError(
			makeMozRequest(ctx, {
				method: 'quota.lookup',
				data: { path: 'api.limits.data.rows' },
			}),
		)) as MozAPIError;

		expect(error).toBeInstanceOf(MozAPIError);
		expect(error.message).toContain('no result');
	});

	it('carries Retry-After and replayable on a rate limit error', async () => {
		respond(
			{
				id: 'id-5',
				jsonrpc: '2.0',
				error: {
					code: -32658,
					status: 429,
					data: { issue: 'rate_limited', value: 60 },
					message:
						'You have exceeded the request rate limit. Please slow down and try again.',
				},
			},
			429,
			{ 'Retry-After': '60' },
		);

		const error = (await captureError(
			makeMozRequest(ctx, {
				method: 'data.site.link.list',
				data: { site_query: { query: 'moz.com', scope: 'domain' } },
				replayable: true,
			}),
		)) as MozAPIError;

		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(60000);
		expect(error.replayable).toBe(true);
	});

	it('never prints the token in the message, JSON or inspect output', async () => {
		respond(serverErrorEnvelope, 500);

		const error = (await captureError(
			makeMozRequest(
				{ key: 'moz-secret-token-xyz' },
				{
					method: 'quota.lookup',
					data: { path: 'api.limits.data.rows' },
				},
			),
		)) as MozAPIError;

		const printed = `${error.message} ${JSON.stringify(error)} ${util.inspect(error)}`;
		expect(printed).not.toContain('moz-secret-token-xyz');
	});

	it('wraps a transport failure with the replay flag and keeps the cause', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await captureError(
			makeMozRequest(ctx, {
				method: 'quota.lookup',
				data: { path: 'api.limits.data.rows' },
				replayable: true,
			}),
		)) as MozAPIError;

		expect(error).toBeInstanceOf(MozAPIError);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.code).toBeUndefined();
		expect(error.replayable).toBe(true);
		expect(error.cause).toBeInstanceOf(TypeError);
	});
});
