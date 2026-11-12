import { ApiError } from 'corsair/http';
import {
	describeKeyType,
	describeUserflowError,
	isUserflowFailure,
	makeUserflowRequest,
	segment,
	USERFLOW_API_BASE,
	USERFLOW_API_VERSION,
	USERFLOW_EU_API_BASE,
	UserflowAPIError,
} from './client';
import {
	invalidEnvKey,
	invalidPersonalKey,
	rateLimited,
} from './test-fixtures';
import {
	API_KEY,
	installFetchMock,
	lastRequest,
	respond,
} from './test-support';

describe('makeUserflowRequest', () => {
	const fetchMock = installFetchMock();

	it('sends the key and the pinned version against the US host', async () => {
		respond(fetchMock, { object: 'list', data: [] });

		await makeUserflowRequest(API_KEY, { method: 'GET', path: '/users' });

		const sent = lastRequest(fetchMock);
		expect(sent.origin).toBe('https://api.userflow.com');
		expect(sent.path).toBe('/users');
		expect(sent.headers['authorization']).toBe(`Bearer ${API_KEY}`);
		expect(sent.headers['userflow-version']).toBe('2020-01-03');
		expect(sent.headers['accept']).toBe('application/json');
	});

	it('uses the EU host when asked, since the key carries no region', async () => {
		respond(fetchMock, {});

		await makeUserflowRequest(
			API_KEY,
			{ method: 'GET', path: '/users' },
			USERFLOW_EU_API_BASE,
		);

		expect(lastRequest(fetchMock).origin).toBe('https://api.eu.userflow.com');
	});

	it('serializes a request body as JSON', async () => {
		respond(fetchMock, {});

		await makeUserflowRequest(API_KEY, {
			method: 'POST',
			path: '/users',
			body: { id: 'u1', attributes: { name: 'Evelyn' } },
		});

		const sent = lastRequest(fetchMock);
		expect(sent.method).toBe('POST');
		expect(sent.headers['content-type']).toContain('application/json');
		expect(sent.body).toEqual({ id: 'u1', attributes: { name: 'Evelyn' } });
	});

	it('repeats an array query key, which is how order_by[] is sent', async () => {
		respond(fetchMock, { object: 'list', data: [] });

		await makeUserflowRequest(API_KEY, {
			method: 'GET',
			path: '/users',
			query: { order_by: ['created_at', 'attributes.name'] },
		});

		const pairs = lastRequest(fetchMock).queryPairs.filter(
			([key]) => key === 'order_by',
		);
		expect(pairs).toEqual([
			['order_by', 'created_at'],
			['order_by', 'attributes.name'],
		]);
	});

	it('keeps a path segment encoded, since ids are caller-supplied', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});

	it('throws a UserflowAPIError carrying the code, doc url and request id', async () => {
		respond(fetchMock, invalidEnvKey, 401);

		// unknown: a rejection can be any value until it is cast below.
		const error = (await makeUserflowRequest(API_KEY, {
			method: 'GET',
			path: '/users',
		}).catch((thrown: unknown) => thrown)) as UserflowAPIError;

		expect(error).toBeInstanceOf(UserflowAPIError);
		expect(error.status).toBe(401);
		expect(error.code).toBe('invalid_api_key');
		expect(error.docUrl).toBe(
			'https://userflow.com/docs/api#users-api-authentication',
		);
		expect(error.requestId).toBe('GOblteh_bhb6oJMOA4PD');
		expect(error.message).toBe(
			'Userflow 401 invalid_api_key: Invalid API key provided: BADKEY',
		);
	});

	it('redacts the key when Userflow echoes it back in a 401', async () => {
		// The live API answers "Invalid API key provided: <the key sent>".
		respond(
			fetchMock,
			{
				error: {
					code: 'invalid_api_key',
					message: `Invalid API key provided: ${API_KEY}`,
					request_id: 'GOczx44z6cvnpTsYBp0E',
				},
			},
			401,
		);

		// unknown: a rejection can be any value until it is cast below.
		const error = (await makeUserflowRequest(API_KEY, {
			method: 'GET',
			path: '/users',
		}).catch((thrown: unknown) => thrown)) as UserflowAPIError;

		expect(error.code).toBe('invalid_api_key');
		expect(error.requestId).toBe('GOczx44z6cvnpTsYBp0E');
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error.body)).not.toContain(API_KEY);
		expect(
			String((error.cause as Error | undefined)?.message ?? ''),
		).not.toContain(API_KEY);
		expect(
			JSON.stringify(
				(error.cause as { body?: unknown } | undefined)?.body ?? null,
			),
		).not.toContain(API_KEY);
		expect(error.message).toContain('[redacted]');
	});

	it('wraps a transport failure', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		// unknown: a rejection can be any value until it is cast below.
		const error = (await makeUserflowRequest(API_KEY, {
			method: 'POST',
			path: '/events',
		}).catch((thrown: unknown) => thrown)) as UserflowAPIError;

		expect(error.message).toBe('fetch failed');
		expect(error.method).toBe('POST');
	});

	it('does not retry a 429 itself, leaving that to the handler', async () => {
		respond(fetchMock, rateLimited, 429);

		await expect(
			makeUserflowRequest(API_KEY, { method: 'GET', path: '/users' }),
		).rejects.toBeInstanceOf(UserflowAPIError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});

describe('UserflowAPIError', () => {
	it('treats a 401 as an auth error', () => {
		const error = new UserflowAPIError('failed', { status: 401 });
		expect(error.isAuthError).toBe(true);
	});

	it('treats an environment key code as an auth error', () => {
		const error = new UserflowAPIError('failed', { body: invalidEnvKey });
		expect(error.isAuthError).toBe(true);
		expect(error.isWrongKeyType).toBe(false);
	});

	it('treats a personal key code as an auth error and as the wrong key type', () => {
		const error = new UserflowAPIError('failed', { body: invalidPersonalKey });
		expect(error.isAuthError).toBe(true);
		expect(error.isWrongKeyType).toBe(true);
		expect(error.code).toBe('invalid_pak');
	});

	it('is neither for an unrelated failure', () => {
		const error = new UserflowAPIError('failed', { status: 500 });
		expect(error.isAuthError).toBe(false);
		expect(error.isWrongKeyType).toBe(false);
	});

	it('reads the fields from a wrapped ApiError', () => {
		const cause = new ApiError(
			{ method: 'GET', url: '/accounts' },
			{
				url: 'https://api.userflow.com/accounts',
				ok: false,
				status: 401,
				statusText: 'Unauthorized',
				body: invalidPersonalKey,
			},
			'Unauthorized',
		);
		const error = new UserflowAPIError('wrapped', { cause });
		expect(error.status).toBe(401);
		expect(error.code).toBe('invalid_pak');
		expect(error.requestId).toBe('GObltkzMcod');
	});
});

describe('describeUserflowError', () => {
	it('labels the status and code', () => {
		expect(describeUserflowError(401, invalidEnvKey, 'fallback')).toBe(
			'Userflow 401 invalid_api_key: Invalid API key provided: BADKEY',
		);
	});

	it('falls back when the body is not an error shape', () => {
		expect(
			describeUserflowError(502, '<html>bad gateway</html>', 'Bad gateway'),
		).toBe('Userflow 502: Bad gateway');
	});

	it('drops the label when there is neither status nor code', () => {
		expect(describeUserflowError(undefined, null, 'Network error')).toBe(
			'Network error',
		);
	});
});

describe('describeKeyType', () => {
	it('reads the docs prefix for a personal key', () => {
		expect(describeKeyType('pak_3rmse5xbarsgkauzose8n6asdb')).toBe('personal');
	});

	it('reads the docs prefix for an environment key', () => {
		expect(describeKeyType('ak_2snys2ycbvetjeivbzs7m7btfm')).toBe(
			'environment',
		);
	});

	it('refuses to guess at anything else', () => {
		expect(describeKeyType('something-else')).toBe('unknown');
	});
});

describe('the exported constants', () => {
	it('pins the only documented version', () => {
		expect(USERFLOW_API_VERSION).toBe('2020-01-03');
	});

	it('exposes the US base the docs use', () => {
		expect(USERFLOW_API_BASE).toBe('https://api.userflow.com');
	});

	it('exposes the EU base for EU environments', () => {
		expect(USERFLOW_EU_API_BASE).toBe('https://api.eu.userflow.com');
	});
});

describe('isUserflowFailure', () => {
	it('narrows a thrown error', () => {
		expect(isUserflowFailure(new UserflowAPIError('failed'))).toBe(true);
	});

	it('rejects anything else', () => {
		expect(isUserflowFailure(new Error('other'))).toBe(false);
		expect(isUserflowFailure(null)).toBe(false);
	});
});
