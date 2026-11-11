import {
	describeUnisenderError,
	encodeForm,
	isUnisenderFailure,
	makeUnisenderRequest,
	UNISENDER_API_BASE,
	UnisenderAPIError,
} from './client';
import {
	ACCESS_DENIED,
	INVALID_ARG,
	INVALID_KEY,
	LISTS,
	RATE_LIMITED,
} from './test-fixtures';

const KEY = 'unisender-secret-key';

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
async function failure(promise: Promise<unknown>): Promise<UnisenderAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(UnisenderAPIError);
	if (!(error instanceof UnisenderAPIError)) throw error;
	return error;
}

describe('Unisender client', () => {
	it('points at the documented host', () => {
		expect(UNISENDER_API_BASE).toBe('https://api.unisender.com');
	});

	it('POSTs to /en/api/<method> as a form, since GET writes arguments to logs', async () => {
		respond(LISTS, 200);

		await makeUnisenderRequest(KEY, {
			apiMethod: 'getLists',
			form: {},
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		const parsed = new URL(url);
		expect(parsed.origin + parsed.pathname).toBe(
			'https://api.unisender.com/en/api/getLists',
		);
		expect(init.method).toBe('POST');
		// The key is in the body, not the URL.
		expect(parsed.search).toBe('');
		expect(String(init.body)).toContain(`api_key=${KEY}`);
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/x-www-form-urlencoded',
		);
	});

	it('asks for JSON on every call', async () => {
		respond(LISTS, 200);

		await makeUnisenderRequest(KEY, {
			apiMethod: 'getLists',
			form: {},
			replayable: true,
		});

		expect(String(fetchMock.mock.calls[0][1].body)).toContain('format=json');
	});

	it('reads a wrong key as invalid_api_key at 401', async () => {
		respond(INVALID_KEY, 401);

		const error = await failure(
			makeUnisenderRequest(KEY, {
				apiMethod: 'getLists',
				form: {},
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.code).toBe('invalid_api_key');
		expect(error.isAuthError).toBe(true);
		expect(error.apiMethod).toBe('getLists');
	});

	it('treats a missing key, which is 403 access_denied, as an auth error too', async () => {
		respond(ACCESS_DENIED, 403);

		const error = await failure(
			makeUnisenderRequest(KEY, {
				apiMethod: 'getLists',
				form: {},
				replayable: true,
			}),
		);

		// The status is the reverse of what a caller might assume: no key is 403.
		expect(error.status).toBe(403);
		expect(error.code).toBe('access_denied');
		expect(error.isAuthError).toBe(true);
	});

	it('reads the rate-limit code, which does not use the status', async () => {
		respond(RATE_LIMITED, 200);

		const error = await failure(
			makeUnisenderRequest(KEY, {
				apiMethod: 'sendEmail',
				form: {},
				replayable: false,
			}),
		);

		expect(error.isRateLimit).toBe(true);
		expect(error.code).toBe('api_call_limit_exceeded_for_api_key');
	});

	it('records whether the failed call may be replayed', async () => {
		respond(INVALID_ARG, 400);

		const error = await failure(
			makeUnisenderRequest(KEY, {
				apiMethod: 'subscribe',
				form: {},
				replayable: true,
			}),
		);

		expect(error.replayable).toBe(true);
		expect(error.method).toBe('POST');
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeUnisenderRequest(KEY, {
				apiMethod: 'getLists',
				form: {},
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the key', async () => {
		respond(INVALID_KEY, 401);

		const error = await failure(
			makeUnisenderRequest(KEY, {
				apiMethod: 'getLists',
				form: {},
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('encodeForm', () => {
	it('encodes a scalar', () => {
		expect(encodeForm({ title: 'My list' })).toBe('title=My%20list');
	});

	it('drops an undefined value, so an optional field can be passed through', () => {
		expect(encodeForm({ title: 'x', tag: undefined })).toBe('title=x');
	});

	it('drops an empty string', () => {
		expect(encodeForm({ title: 'x', tag: '' })).toBe('title=x');
	});

	it('encodes an array as repeated key[] entries', () => {
		expect(encodeForm({ field_names: ['email', 'name'] })).toBe(
			'field_names%5B%5D=email&field_names%5B%5D=name',
		);
	});

	it('leaves a bracketed key as written, so Unisender reads the brackets', () => {
		// URLSearchParams would escape these into one literal name.
		const encoded = encodeForm({ 'fields[city]': 'Berlin' });
		expect(encoded).toBe('fields[city]=Berlin');
	});

	it('keeps a numeric value numeric', () => {
		expect(encodeForm({ list_id: 12345 })).toBe('list_id=12345');
	});
});

describe('isUnisenderFailure', () => {
	it('recognises an error envelope, which has a code and no result', () => {
		expect(isUnisenderFailure(INVALID_KEY)).toBe(true);
	});

	it('does not mistake a result for a failure', () => {
		expect(isUnisenderFailure(LISTS)).toBe(false);
	});

	it('does not mistake a void result for a failure', () => {
		expect(isUnisenderFailure({ result: {} })).toBe(false);
	});

	it('returns false for a non-object body', () => {
		expect(isUnisenderFailure(null)).toBe(false);
	});
});

describe('describeUnisenderError', () => {
	it('puts the status and code before the message', () => {
		expect(describeUnisenderError(401, INVALID_KEY, 'x')).toContain(
			'Unisender 401 invalid_api_key:',
		);
	});

	it('keeps the long error text, which carries the error id', () => {
		expect(describeUnisenderError(401, INVALID_KEY, 'x')).toContain(
			'Error ID:',
		);
	});

	it('falls back to the supplied message', () => {
		expect(describeUnisenderError(500, null, 'Server error')).toBe(
			'Unisender 500: Server error',
		);
	});

	it('returns the bare message with no status or code', () => {
		expect(describeUnisenderError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
