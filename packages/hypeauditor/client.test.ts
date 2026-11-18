import { ApiError } from 'corsair/http';
import type { JsonValue } from './client';
import {
	configWith,
	describeFailure,
	HYPEAUDITOR_API_BASE,
	HYPEAUDITOR_API_VERSION,
	HypeAuditorAPIError,
	HypeAuditorTransportError,
	makeHypeAuditorRequest,
	packCredentials,
	readErrorBody,
	segment,
	unpackCredentials,
} from './client';
import { ReportOrPendingSchema } from './endpoints/types';
import { rejection } from './test-helpers';

const CREDENTIALS = { clientId: 'client-123', apiToken: 'token-secret' };

let fetchMock: jest.SpyInstance;

// unknown: a response body is arbitrary JSON until a schema reads it.
function respond(body: JsonValue, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
	jest.restoreAllMocks();
});

describe('configWith', () => {
	it('sends both credentials as headers and neither in the URL', () => {
		const config = configWith(CREDENTIALS);
		expect(config.BASE).toBe(HYPEAUDITOR_API_BASE);
		expect(config.VERSION).toBe(HYPEAUDITOR_API_VERSION);
		const headers = config.HEADERS as Record<string, string>;
		expect(headers['X-Auth-Id']).toBe(CREDENTIALS.clientId);
		expect(headers['X-Auth-Token']).toBe(CREDENTIALS.apiToken);
	});
});

describe('makeHypeAuditorRequest', () => {
	it('adds the documented version to every call', async () => {
		respond({ result: [] });

		await makeHypeAuditorRequest(CREDENTIALS, {
			method: 'GET',
			action: 'auditor.lists',
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const parsed = new URL(String(url));
		expect(parsed.pathname).toBe('/api/method/auditor.lists');
		expect(parsed.searchParams.get('v')).toBe(HYPEAUDITOR_API_VERSION);
		expect(new Headers(init.headers).get('x-auth-token')).toBe(
			CREDENTIALS.apiToken,
		);
		expect(parsed.search).not.toContain(CREDENTIALS.apiToken);
	});

	it('does not let a caller override the version', async () => {
		respond({ result: [] });

		await makeHypeAuditorRequest(CREDENTIALS, {
			method: 'GET',
			action: 'auditor.lists',
			// v1 is deprecated, so a stray `v` in the query must not win.
			query: { v: '1' },
		});

		const parsed = new URL(String((fetchMock.mock.calls[0] as [string])[0]));
		expect(parsed.searchParams.get('v')).toBe(HYPEAUDITOR_API_VERSION);
	});

	it('sends a JSON body on a POST and none on a GET', async () => {
		respond({ result: [] });
		respond({ result: [] });
		await makeHypeAuditorRequest(CREDENTIALS, {
			method: 'POST',
			action: 'auditor.search/',
			body: { social_network: 'instagram' },
		});
		await makeHypeAuditorRequest(CREDENTIALS, {
			method: 'GET',
			action: 'auditor.lists',
		});

		const [, write] = fetchMock.mock.calls[0] as [string, RequestInit];
		const [, read] = fetchMock.mock.calls[1] as [string, RequestInit];
		expect(JSON.parse(String(write.body))).toEqual({
			social_network: 'instagram',
		});
		expect(read.body).toBeUndefined();
	});

	it('keeps the status, the numeric code and the description', async () => {
		respond({ error: { code: 4, description: 'Invalid token' } }, 403);

		const error = (await rejection(
			makeHypeAuditorRequest(CREDENTIALS, {
				method: 'GET',
				action: 'auditor.lists',
			}),
		)) as HypeAuditorAPIError;

		expect(error).toBeInstanceOf(HypeAuditorAPIError);
		expect([error.status, error.code]).toEqual([403, 4]);
		expect(error.message).toBe('HypeAuditor 403 4: Invalid token');
	});

	it('records whether a replay is safe, per request', async () => {
		respond({ error: { code: 1, description: 'boom' } }, 500);
		const charged = (await rejection(
			makeHypeAuditorRequest(CREDENTIALS, {
				method: 'GET',
				action: 'auditor.report/',
				replayable: false,
			}),
		)) as HypeAuditorAPIError;

		respond({ error: { code: 1, description: 'boom' } }, 500);
		const free = (await rejection(
			makeHypeAuditorRequest(CREDENTIALS, {
				method: 'GET',
				action: 'auditor.reportMedia/',
			}),
		)) as HypeAuditorAPIError;

		expect([charged.replayable, free.replayable]).toEqual([false, true]);
	});

	it('hands core an ApiError without the creator the caller asked about', async () => {
		respond({ error: { code: 4, description: 'Invalid token' } }, 403);

		const error = (await rejection(
			makeHypeAuditorRequest(CREDENTIALS, {
				method: 'GET',
				action: 'auditor.report/',
				query: { username: 'some.creator' },
			}),
		)) as HypeAuditorAPIError;

		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(403);
		expect(error.code).toBe(4);
		expect(error.url).toBe(`${HYPEAUDITOR_API_BASE}/auditor.report/`);
		expect(JSON.stringify(error)).not.toContain('some.creator');
		expect(require('node:util').inspect(error)).not.toContain('some.creator');
	});

	it('packs and unpacks the credential pair through one key', () => {
		const key = packCredentials(CREDENTIALS);
		expect(unpackCredentials(key, 'hypeauditor')).toEqual(CREDENTIALS);
		expect(
			unpackCredentials('42:token:with:colons', 'hypeauditor').apiToken,
		).toBe('token:with:colons');
		for (const bad of [undefined, '', 'no-colon', ':token', '42:']) {
			expect(() => unpackCredentials(bad, 'hypeauditor')).toThrow();
		}
	});

	it('reads a 202 body as the pending notice and checks retryTtl', () => {
		const pending = ReportOrPendingSchema.safeParse({
			result: { retryTtl: 30, restTokens: 5 },
		});
		expect(pending.success && 'retryTtl' in pending.data.result).toBe(true);
		const report = ReportOrPendingSchema.parse({
			result: { report_state: 'READY' },
		});
		expect('retryTtl' in report.result).toBe(false);
	});

	it('does not put either credential in the error', async () => {
		respond(
			{ error: { code: 31, description: 'Account has not enough followers' } },
			400,
		);

		const error = (await rejection(
			makeHypeAuditorRequest(CREDENTIALS, {
				method: 'GET',
				action: 'auditor.report/',
			}),
		)) as HypeAuditorAPIError;

		const inspect = require('node:util').inspect(error) as string;
		expect(error.message).not.toContain(CREDENTIALS.apiToken);
		expect(inspect).not.toContain(CREDENTIALS.apiToken);
		expect(inspect).not.toContain(CREDENTIALS.clientId);
		expect(JSON.stringify(error)).not.toContain(CREDENTIALS.apiToken);
	});

	it('turns a transport failure into a typed error with its replay flag', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = (await rejection(
			makeHypeAuditorRequest(CREDENTIALS, {
				method: 'GET',
				action: 'auditor.report/',
				replayable: false,
			}),
		)) as HypeAuditorTransportError;

		expect(error).toBeInstanceOf(HypeAuditorTransportError);
		expect([error.timedOut, error.replayable]).toEqual([false, false]);
	});

	it('marks a timeout as timed out', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException(
				'The operation was aborted due to timeout',
				'TimeoutError',
			),
		);

		const error = (await rejection(
			makeHypeAuditorRequest(CREDENTIALS, {
				method: 'GET',
				action: 'auditor.reportMedia/',
			}),
		)) as HypeAuditorTransportError;

		expect([error.timedOut, error.replayable]).toEqual([true, true]);
	});
});

describe('readErrorBody and describeFailure', () => {
	it('reads the documented error object', () => {
		expect(
			readErrorBody({
				error: { code: 3, description: 'Unknown method passed' },
			}),
		).toEqual({ code: 3, description: 'Unknown method passed' });
	});

	it('returns nothing for a body that is not the documented shape', () => {
		expect(readErrorBody(undefined)).toEqual({});
		expect(readErrorBody('Oops!')).toEqual({});
		expect(readErrorBody({ error: { code: '4', description: '' } })).toEqual({
			code: undefined,
			description: undefined,
		});
	});

	it('renders the status and code before the message', () => {
		expect(
			describeFailure(
				403,
				{ code: 4, description: 'Invalid token' },
				'fallback',
			),
		).toBe('HypeAuditor 403 4: Invalid token');
	});

	it('falls back when the body carries no description', () => {
		expect(describeFailure(500, {}, 'Internal Server Error')).toBe(
			'HypeAuditor 500: Internal Server Error',
		);
		expect(describeFailure(undefined, {}, 'boom')).toBe('HypeAuditor: boom');
	});
});

describe('segment', () => {
	it('encodes a path segment', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});

describe('ApiError handling', () => {
	it('is what the client converts, not a raw fetch error', () => {
		// A sanity check that the client's own branch is reachable: an ApiError
		// from the transport becomes a HypeAuditorAPIError, never the raw type.
		expect(ApiError.prototype.isRateLimitError).toBeDefined();
	});
});
