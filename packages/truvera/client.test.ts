import { inspect } from 'node:util';
import { ApiError } from 'corsair/http';
import {
	describeTruveraError,
	makeTruveraRequest,
	TRUVERA_API_BASE,
	TRUVERA_SANDBOX_API_BASE,
	truveraErrorDetails,
} from './client';
import { unauthorized, validationFailed } from './test-fixtures';

const KEY = 'tv-live-key-1234567890';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON; each test passes its own.
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

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		url: String(url),
		path: parsed.pathname,
		params: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the parsed request body, when there is one.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeTruveraRequest', () => {
	it('sends the key as a Bearer token', async () => {
		respond({});

		await makeTruveraRequest(KEY, { method: 'GET', path: 'dids' });

		const sent = lastRequest();
		expect(sent.url).toBe(`${TRUVERA_API_BASE}/dids`);
		expect(sent.headers.get('authorization')).toBe(`Bearer ${KEY}`);
	});

	it('serializes paging and filters', async () => {
		respond([]);

		await makeTruveraRequest(KEY, {
			method: 'GET',
			path: 'credentials',
			query: {
				offset: 0,
				limit: 64,
				subjectId: 'did:example:1',
				empty: undefined,
			},
		});

		expect(lastRequest().params).toEqual({
			offset: '0',
			limit: '64',
			subjectId: 'did:example:1',
		});
	});

	it('sends a JSON body on a write', async () => {
		respond({});

		await makeTruveraRequest(KEY, {
			method: 'POST',
			path: 'dids',
			body: { type: 'cheqd' },
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.headers.get('content-type')).toBe('application/json');
		expect(sent.body).toEqual({ type: 'cheqd' });
	});

	it('sends a PATCH for a profile update', async () => {
		respond({});

		await makeTruveraRequest(KEY, {
			method: 'PATCH',
			path: 'profiles/did:example:1',
			body: { did: 'did:example:1', name: 'Acme' },
		});

		expect(lastRequest().method).toBe('PATCH');
	});

	it('reads the live 401 envelope with its field errors', async () => {
		respond(unauthorized, 401);

		const error = await makeTruveraRequest(KEY, {
			method: 'GET',
			path: 'credentials',
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect(truveraErrorDetails(error)?.type).toBe('ServerError');
		// Truvera quotes the token it could not decode; that part is masked.
		expect(JSON.stringify((error as ApiError).body)).not.toContain(
			'eyJhbGciOiJIUzUxMiJ9',
		);
	});

	it('keeps the per-field errors a rejected credential returns', async () => {
		respond(validationFailed, 400);

		const error = await makeTruveraRequest(KEY, {
			method: 'POST',
			path: 'credentials',
			body: {},
		}).catch((caught: unknown) => caught);

		const details = truveraErrorDetails(error);
		expect(details?.errors).toHaveLength(2);
		expect(details?.errors[0]?.path).toBe('credential.issuer');
		expect(describeTruveraError(400, (error as ApiError).body, '')).toContain(
			'credential.issuer',
		);
	});

	it('retries a 429 in core and keeps Retry-After on the final error', async () => {
		// Core makes 1 attempt plus 3 retries.
		for (let i = 0; i < 4; i += 1) respond({}, 429, { 'Retry-After': '1' });

		const error = await makeTruveraRequest(KEY, {
			method: 'GET',
			path: 'dids',
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).retryAfter).toBe(1000);
		expect((error as ApiError).status).toBe(429);
	}, 20_000);

	it('records the method so a credential issue is not replayed', async () => {
		respond({}, 500);

		const error = await makeTruveraRequest(KEY, {
			method: 'POST',
			path: 'credentials',
			body: {},
		}).catch((caught: unknown) => caught);

		expect((error as ApiError).request.method).toBe('POST');
	});

	it('masks the key when Truvera echoes it, and drops the request body', async () => {
		respond(
			{
				message: `Cannot decode JWT: ${KEY}`,
				errors: [{ path: '/credentials', message: `bad key ${KEY}` }],
				status: 401,
				type: 'ServerError',
			},
			401,
		);

		const error = await makeTruveraRequest(KEY, {
			method: 'POST',
			path: 'credentials',
			body: { password: 'issuance-secret' },
		}).catch((caught: unknown) => caught);

		expect(error).toBeInstanceOf(ApiError);
		for (const text of [inspect(error), JSON.stringify(error)]) {
			expect(text).not.toContain(KEY);
			expect(text).not.toContain('issuance-secret');
		}
	});

	it('uses the sandbox host when asked', async () => {
		respond([]);

		await makeTruveraRequest(
			KEY,
			{ method: 'GET', path: 'dids' },
			{ sandbox: true },
		);

		expect(lastRequest().url.startsWith(TRUVERA_SANDBOX_API_BASE)).toBe(true);
	});

	it('never puts the key in the message or its inspection', async () => {
		respond(unauthorized, 401);

		const error = await makeTruveraRequest(KEY, {
			method: 'GET',
			path: 'credentials',
		}).catch((caught: unknown) => caught);

		for (const text of [
			(error as Error).message,
			inspect(error),
			JSON.stringify(error),
		]) {
			expect(text).not.toContain(KEY);
		}
	});
});

describe('describeTruveraError', () => {
	it('includes the status, the message and the field paths', () => {
		expect(describeTruveraError(400, validationFailed, 'x')).toBe(
			'Truvera 400: Invalid credential parameters (credential.issuer: must be a DID you control; credential.type: must not be empty)',
		);
	});

	it('reads a body with no field errors', () => {
		expect(describeTruveraError(500, { message: 'boom' }, 'x')).toBe(
			'Truvera 500: boom',
		);
	});

	it('falls back for a non-JSON body', () => {
		expect(describeTruveraError(502, '<html>', 'Bad Gateway')).toBe(
			'Truvera 502: Bad Gateway',
		);
		expect(describeTruveraError(undefined, null, 'offline')).toBe('offline');
	});

	it('ignores a non-array errors field', () => {
		expect(
			describeTruveraError(400, { message: 'x', errors: { a: 1 } }, 'y'),
		).toBe('Truvera 400: x');
	});
});
