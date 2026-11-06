import {
	accountBaseUrl,
	describeSnowflakeError,
	makeSnowflakeRequest,
	resolveSnowflakeAccount,
	resolveSnowflakeTokenType,
	SNOWFLAKE_USER_AGENT,
	SnowflakeAPIError,
} from './client';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are JSON or text until the test builds a Response.
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

// unknown: the rejection stays untyped until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<SnowflakeAPIError> {
	const error = await promise.catch((caught: unknown) => caught);
	expect(error).toBeInstanceOf(SnowflakeAPIError);
	if (!(error instanceof SnowflakeAPIError)) {
		throw new Error('expected SnowflakeAPIError');
	}
	return error;
}

// unknown: fetch mock arguments are untyped until this guard runs.
function isRequestInit(value: unknown): value is RequestInit {
	return typeof value === 'object' && value !== null;
}

function requestOf(call: unknown[]) {
	const url = call[0];
	const init = call[1];
	if (typeof url !== 'string' || !isRequestInit(init)) {
		throw new Error('unexpected fetch arguments');
	}
	return { url, init, headers: new Headers(init.headers) };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

const base = {
	baseUrl: 'https://acme-prod.snowflakecomputing.com',
	apiKey: 'pat-test',
};

describe('direct credentials without a key store', () => {
	// createCorsair only attaches `keys` with a database and KEK, so a client
	// built from options alone must not reach for stored fields.
	it('leaves the token type unset when none is given', async () => {
		await expect(resolveSnowflakeTokenType({ options: {} })).resolves.toBe(
			undefined,
		);
	});

	it('uses the token type from options', async () => {
		await expect(
			resolveSnowflakeTokenType({
				options: { tokenType: 'PROGRAMMATIC_ACCESS_TOKEN' },
			}),
		).resolves.toBe('PROGRAMMATIC_ACCESS_TOKEN');
	});

	it('uses the account from options', async () => {
		await expect(
			resolveSnowflakeAccount({ options: { account: 'myorg-myacct' } }),
		).resolves.toBe('myorg-myacct');
	});

	it('asks for an account when neither options nor a key store has one', async () => {
		await expect(resolveSnowflakeAccount({ options: {} })).rejects.toThrow(
			'auth-missing:snowflake:account',
		);
	});
});

describe('accountBaseUrl', () => {
	it('builds the account host and accepts documented host forms', () => {
		expect(accountBaseUrl('acme-prod')).toBe(
			'https://acme-prod.snowflakecomputing.com',
		);
		expect(accountBaseUrl('ACME-PROD')).toBe(
			'https://acme-prod.snowflakecomputing.com',
		);
		expect(accountBaseUrl('acme-marketing_test_account')).toBe(
			'https://acme-marketing_test_account.snowflakecomputing.com',
		);
		expect(accountBaseUrl('xy12345.us-east-2.aws')).toBe(
			'https://xy12345.us-east-2.aws.snowflakecomputing.com',
		);
		expect(accountBaseUrl('https://acme-prod.snowflakecomputing.com/')).toBe(
			'https://acme-prod.snowflakecomputing.com',
		);
		expect(
			accountBaseUrl('https://acme-prod.privatelink.snowflakecomputing.com'),
		).toBe('https://acme-prod.privatelink.snowflakecomputing.com');
		expect(accountBaseUrl(`acme-prod${'/'.repeat(10_000)}`)).toBe(
			'https://acme-prod.snowflakecomputing.com',
		);
	});

	it('rejects hosts that are not that account', () => {
		expect(() => accountBaseUrl('')).toThrow(/empty/);
		expect(() => accountBaseUrl('https://evil.com')).toThrow(
			/snowflakecomputing/,
		);
		expect(() =>
			accountBaseUrl('https://acme.snowflakecomputing.com.evil.com'),
		).toThrow(/snowflakecomputing/);
		expect(() =>
			accountBaseUrl('http://acme-prod.snowflakecomputing.com'),
		).toThrow(/https/);
		expect(() =>
			accountBaseUrl('https://user:pass@acme-prod.snowflakecomputing.com'),
		).toThrow(/credentials/);
		expect(() =>
			accountBaseUrl('https://acme-prod.snowflakecomputing.com/api'),
		).toThrow(/path/);
		expect(accountBaseUrl('notsnowflakecomputing.com')).toBe(
			'https://notsnowflakecomputing.com.snowflakecomputing.com',
		);
	});
});

describe('makeSnowflakeRequest', () => {
	it('sends the bearer token, required headers, and no token-type header by default', async () => {
		respond({ statementHandle: 'h' }, 200);

		await makeSnowflakeRequest({
			...base,
			method: 'POST',
			path: '/api/v2/statements',
			query: { async: true },
			body: { statement: 'SELECT 1' },
		});

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const { url, init, headers } = requestOf(fetchMock.mock.calls[0] ?? []);
		expect(url).toBe(
			'https://acme-prod.snowflakecomputing.com/api/v2/statements?async=true',
		);
		expect(init.method).toBe('POST');
		expect(headers.get('authorization')).toBe('Bearer pat-test');
		expect(headers.get('accept')).toBe('application/json');
		expect(headers.get('content-type')).toBe('application/json');
		expect(headers.get('user-agent')).toBe(SNOWFLAKE_USER_AGENT);
		expect(headers.get('x-snowflake-authorization-token-type')).toBeNull();
		expect(JSON.parse(String(init.body))).toEqual({ statement: 'SELECT 1' });
	});

	it('sends the token type only when one is set, and omits a body on GET', async () => {
		respond({ statementHandle: 'h' }, 200);

		await makeSnowflakeRequest({
			...base,
			tokenType: 'PROGRAMMATIC_ACCESS_TOKEN',
			method: 'GET',
			path: '/api/v2/statements/019c06a4-0000-df4f-0000-00100006589e',
			query: { partition: 0 },
		});

		const { url, init, headers } = requestOf(fetchMock.mock.calls[0] ?? []);
		expect(url).toContain('partition=0');
		expect(init.method).toBe('GET');
		expect(init.body).toBeUndefined();
		expect(headers.get('x-snowflake-authorization-token-type')).toBe(
			'PROGRAMMATIC_ACCESS_TOKEN',
		);
		expect(headers.get('content-type')).toBe('application/json');
	});

	it('returns a 200 body whose code is 391908 instead of throwing', async () => {
		const body = { code: '391908', statementHandle: 'h', message: 'too large' };
		respond(body, 200);
		await expect(
			makeSnowflakeRequest({
				...base,
				method: 'GET',
				path: '/api/v2/statements/h',
			}),
		).resolves.toEqual(body);
	});

	it('returns a 202 in-progress body', async () => {
		const body = { code: '333334', statementHandle: 'h' };
		respond(body, 202);
		await expect(
			makeSnowflakeRequest({
				...base,
				method: 'POST',
				path: '/api/v2/statements',
			}),
		).resolves.toEqual(body);
	});

	it.each([
		[
			400,
			{
				code: '390142',
				message: 'Incoming request does not contain a valid payload.',
			},
		],
		[401, { code: '390303', message: 'Invalid OAuth access token.' }],
		[403, { code: '390301', message: 'Forbidden' }],
		[404, { code: '390400', message: 'Not found' }],
		[
			408,
			{
				code: '000604',
				message: 'SQL execution canceled',
				statementHandle: 'h',
			},
		],
		[415, { message: 'Unsupported media type' }],
		[
			422,
			{
				code: '000709',
				message: 'Statement h not found',
				sqlState: '02000',
				statementHandle: 'h',
			},
		],
		[500, { code: '390500', message: 'Internal error' }],
		[502, { message: 'Bad gateway' }],
		[503, { message: 'Unavailable' }],
		[504, { message: 'Gateway timeout' }],
		// const assertion: each row keeps its own body fields for the `'code' in body` check.
	] as const)('maps HTTP %i and its object body', async (status, body) => {
		respond(body, status);
		const error = await failure(
			makeSnowflakeRequest({
				...base,
				method: 'GET',
				path: '/api/v2/statements/h',
			}),
		);
		expect(error.status).toBe(status);
		expect(error.body).toEqual(body);
		if ('code' in body) expect(error.code).toBe(body.code);
		if ('sqlState' in body) expect(error.sqlState).toBe(body.sqlState);
		if ('statementHandle' in body) {
			expect(error.statementHandle).toBe(body.statementHandle);
		}
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('makes exactly one fetch on a 429 and keeps Retry-After', async () => {
		respond({ code: '390505', message: 'Too many requests.' }, 429, {
			'Retry-After': '3',
		});
		const error = await failure(
			makeSnowflakeRequest({
				...base,
				method: 'POST',
				path: '/api/v2/statements',
			}),
		);
		expect(error.status).toBe(429);
		expect(error.code).toBe('390505');
		expect(error.retryAfter).toBe(3000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('leaves Retry-After unset on a 500 and parses an HTTP-date on a 429', async () => {
		respond({ message: 'Internal error' }, 500, {
			'Retry-After': 'Wed, 21 Oct 2015 07:28:00 GMT',
		});
		const serverError = await failure(
			makeSnowflakeRequest({
				...base,
				method: 'GET',
				path: '/api/v2/statements/h',
			}),
		);
		expect(serverError.status).toBe(500);
		expect(serverError.retryAfter).toBeUndefined();
		expect(fetchMock).toHaveBeenCalledTimes(1);

		const future = new Date(Date.now() + 5_000).toUTCString();
		respond({ code: '390505', message: 'Too many requests.' }, 429, {
			'Retry-After': future,
		});
		const limited = await failure(
			makeSnowflakeRequest({
				...base,
				method: 'GET',
				path: '/api/v2/statements/h',
			}),
		);
		expect(limited.status).toBe(429);
		expect(limited.retryAfter).toBeGreaterThan(4_000);
		expect(limited.retryAfter).toBeLessThan(6_000);
	});

	it('maps an empty 405', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(null, { status: 405, statusText: 'Method Not Allowed' }),
		);
		const error = await failure(
			makeSnowflakeRequest({
				...base,
				method: 'GET',
				path: '/api/v2/statements/h',
			}),
		);
		expect(error.status).toBe(405);
		expect(error.code).toBeUndefined();
		expect(error.message).toContain('Method Not Allowed');
	});

	it('keeps a text error body', async () => {
		respond('Bad gateway', 502);
		const error = await failure(
			makeSnowflakeRequest({
				...base,
				method: 'GET',
				path: '/api/v2/statements/h',
			}),
		);
		expect(error.status).toBe(502);
		expect(error.body).toBe('Bad gateway');
		expect(error.code).toBeUndefined();
	});

	it('wraps network failures and redacts a JWT in the message', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		const error = await failure(
			makeSnowflakeRequest({
				...base,
				method: 'GET',
				path: '/api/v2/statements/h',
			}),
		);
		expect(error.status).toBeUndefined();
		expect(error.message).toContain('fetch failed');
		expect(error.cause).toBeInstanceOf(TypeError);

		expect(
			describeSnowflakeError(
				401,
				{
					message:
						'Invalid OAuth access token eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1In0.signature',
				},
				'Unauthorized',
			),
		).toBe('Snowflake 401: Invalid OAuth access token [redacted-jwt]');
	});
});
