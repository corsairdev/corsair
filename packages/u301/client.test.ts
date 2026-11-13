import {
	composeU301Key,
	describeU301Error,
	makeU301Request,
	parseU301Key,
	U301_API_BASE,
	U301APIError,
} from './client';
import {
	API_KEY,
	LINK_CREATED,
	QUOTA,
	UNAUTHORIZED,
	WORKSPACE_ID,
} from './test-fixtures';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

function respond(
	// unknown: response bodies are arbitrary JSON.
	body: unknown,
	status: number,
	headers: Record<string, string> = {},
) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json', ...headers },
		}),
	);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<U301APIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(U301APIError);
	if (!(error instanceof U301APIError)) throw error;
	return error;
}

const KEY = composeU301Key(API_KEY, WORKSPACE_ID);

describe('U301 client', () => {
	it('points at the versioned API host', () => {
		expect(U301_API_BASE).toBe('https://api.u301.com/v3');
	});

	it('sends the key as a Bearer token and the workspace as a query param', async () => {
		respond([LINK_CREATED], 200);

		await makeU301Request(KEY, {
			method: 'POST',
			path: '/shorten/bulk',
			body: [{ url: 'https://example.com' }],
			replayable: false,
		});

		// The spy records fetch's arguments untyped; the client calls fetch(url, init).
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const parsed = new URL(url);
		expect(parsed.origin + parsed.pathname).toBe(
			'https://api.u301.com/v3/shorten/bulk',
		);
		expect(parsed.searchParams.get('workspaceId')).toBe(WORKSPACE_ID);
		expect(new Headers(init.headers).get('authorization')).toBe(
			`Bearer ${API_KEY}`,
		);
	});

	it('sends a bare key without a workspace ID, which U301 answers for the key', async () => {
		// Live 11-12: a user key with no workspaceId gets 200 on the list, domain
		// and analytics routes, for the key's own workspace.
		respond({ links: [], metadata: { total: 0, perPage: 20, page: 1 } }, 200);

		await makeU301Request(API_KEY, {
			method: 'GET',
			path: '/shorten/list',
			replayable: true,
		});

		// The spy records fetch's arguments untyped; the first one is the URL string.
		const [url] = fetchMock.mock.calls[0] as [string];
		expect(new URL(url).searchParams.has('workspaceId')).toBe(false);
	});

	it('serialises a body as JSON', async () => {
		respond([LINK_CREATED], 200);

		await makeU301Request(KEY, {
			method: 'POST',
			path: '/shorten/bulk',
			body: [{ url: 'https://example.com', slug: 'abc' }],
			replayable: false,
		});

		// The spy records fetch's arguments untyped; the second one is the init.
		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual([
			{ url: 'https://example.com', slug: 'abc' },
		]);
	});

	it('reads the live 401 body', async () => {
		respond(UNAUTHORIZED, 401);

		const error = await failure(
			makeU301Request(KEY, {
				method: 'GET',
				path: '/shorten/list',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.message).toBe('U301 401: Unauthorized');
		expect(error.isAuthError).toBe(true);
	});

	it('treats a 429 as the link quota, not a rate limit', async () => {
		respond(QUOTA, 429);

		const error = await failure(
			makeU301Request(KEY, {
				method: 'POST',
				path: '/shorten/bulk',
				body: [],
				replayable: false,
			}),
		);

		expect(error.isQuotaError).toBe(true);
		expect(error.isRateLimited).toBe(false);
		expect(error.code).toBe('MONTHLY_LINK_LIMIT_REACHED');
		expect(error.message).toContain('Monthly link limit reached');
	});

	it('treats a RATE_LIMITED 429 as a short-term limit, not the monthly quota', async () => {
		// U301's error table documents RATE_LIMITED as "too many requests in a given
		// amount of time"; only MONTHLY_LINK_LIMIT_REACHED is the allowance.
		respond({ message: 'Too many requests', code: 'RATE_LIMITED' }, 429, {
			'Retry-After': '60',
		});

		const error = await failure(
			makeU301Request(KEY, {
				method: 'GET',
				path: '/shorten/list',
				replayable: true,
			}),
		);

		expect(error.isQuotaError).toBe(false);
		expect(error.isRateLimited).toBe(true);
		// The header is read even though corsair/http does not retry the 429 itself.
		expect(error.retryAfter).toBe(60_000);
	});

	it('records whether the failed call may be replayed', async () => {
		respond({ message: 'boom' }, 500);

		const error = await failure(
			makeU301Request(KEY, {
				method: 'POST',
				path: '/shorten/bulk',
				body: [],
				replayable: false,
			}),
		);

		expect(error.replayable).toBe(false);
		expect(error.method).toBe('POST');
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeU301Request(KEY, {
				method: 'GET',
				path: '/shorten/list',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the bearer token', async () => {
		respond(UNAUTHORIZED, 401);

		const error = await failure(
			makeU301Request(KEY, {
				method: 'GET',
				path: '/shorten/list',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('composeU301Key and parseU301Key', () => {
	it('round-trips both credentials', () => {
		expect(parseU301Key(composeU301Key('key-1', 'ws-1'))).toEqual({
			apiKey: 'key-1',
			workspaceId: 'ws-1',
		});
	});

	it('treats a bare key as having no workspace', () => {
		expect(parseU301Key('just-a-key')).toEqual({
			apiKey: 'just-a-key',
			workspaceId: null,
		});
	});

	it('treats an empty workspace as missing rather than as a value', () => {
		expect(parseU301Key('key\n').workspaceId).toBeNull();
	});

	it('trims whitespace a copied key might carry', () => {
		expect(parseU301Key('  key-1  \n  ws-1  ')).toEqual({
			apiKey: 'key-1',
			workspaceId: 'ws-1',
		});
	});

	it('splits on the first newline only, so a workspace cannot be swallowed', () => {
		expect(parseU301Key('key\nws\nextra')).toEqual({
			apiKey: 'key',
			workspaceId: 'ws\nextra',
		});
	});
});

describe('describeU301Error', () => {
	it('prefixes the status', () => {
		expect(describeU301Error(401, UNAUTHORIZED, 'x')).toBe(
			'U301 401: Unauthorized',
		);
	});

	it('adds the code beside the status', () => {
		expect(describeU301Error(429, QUOTA, 'x')).toBe(
			'U301 429 MONTHLY_LINK_LIMIT_REACHED: Monthly link limit reached (100/100). Upgrade your plan or wait until next month.',
		);
	});

	it('appends the per-field errors and the request id', () => {
		expect(
			describeU301Error(
				422,
				{
					message: 'Validation failed',
					code: 'VALIDATION_FAILED',
					errors: [{ field: 'url', message: 'must be a URL' }],
					requestId: 'req_1',
				},
				'x',
			),
		).toBe(
			'U301 422 VALIDATION_FAILED: Validation failed (url: must be a URL) [request req_1]',
		);
	});

	it('falls back when the message is empty, which a keyless call sends', () => {
		expect(describeU301Error(401, { message: '' }, 'Unauthorized')).toBe(
			'U301 401: Unauthorized',
		);
	});

	it('returns the bare message with no status or code', () => {
		expect(describeU301Error(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
