import {
	describeRemarketyError,
	isRemarketyFailure,
	makeRemarketyRequest,
	REMARKETY_API_BASE,
	RemarketyAPIError,
	segment,
} from './client';
import {
	BAD_TOKEN,
	NOT_FOUND,
	STORE,
	TEMPLATE_VALIDATION_ERROR,
} from './test-fixtures';

const TOKEN = 'remarkety-secret-token';

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
async function failure(promise: Promise<unknown>): Promise<RemarketyAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RemarketyAPIError);
	if (!(error instanceof RemarketyAPIError)) throw error;
	return error;
}

describe('Remarkety client', () => {
	it('points at the app host under /api/v1', () => {
		expect(REMARKETY_API_BASE).toBe('https://app.remarkety.com/api/v1');
	});

	it('sends the token in X-Token and always accepts JSON', async () => {
		respond(STORE, 200);

		await makeRemarketyRequest(TOKEN, {
			method: 'GET',
			path: '/stores/1',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://app.remarkety.com/api/v1/stores/1');
		const headers = new Headers(init.headers);
		expect(headers.get('x-token')).toBe(TOKEN);
		// Without Accept: application/json a refusal comes back as an HTML login page.
		expect(headers.get('accept')).toBe('application/json');
		// The query transport is never used, since it puts the key in a URL.
		expect(url).not.toContain('token=');
	});

	it('serialises a body as JSON', async () => {
		respond(STORE, 200);

		await makeRemarketyRequest(TOKEN, {
			method: 'POST',
			path: '/stores',
			body: { name: 'My Store' },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({ name: 'My Store' });
	});

	it('reads the live 401 envelope and keeps the guid', async () => {
		respond(BAD_TOKEN, 401);

		const error = await failure(
			makeRemarketyRequest(TOKEN, {
				method: 'GET',
				path: '/stores/1/status',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.message).toContain('Missing or invalid API Key');
		expect(error.resultStatus).toBe('ERROR');
		// The guid is what support asks for.
		expect(error.guid).toBe('6af39fd3ea435');
		expect(error.isAuthError).toBe(true);
	});

	it('throws a failure that arrived with a 200', async () => {
		respond(BAD_TOKEN, 200);

		const error = await failure(
			makeRemarketyRequest(TOKEN, {
				method: 'GET',
				path: '/stores/1',
				replayable: true,
			}),
		);

		// status: ERROR is the marker, so a 200 cannot hide a refusal.
		expect(error.resultStatus).toBe('ERROR');
		expect(error.isAuthError).toBe(false);
	});

	it('reads a 404 as not found', async () => {
		respond(NOT_FOUND, 404);

		const error = await failure(
			makeRemarketyRequest(TOKEN, {
				method: 'GET',
				path: '/stores/99',
				replayable: true,
			}),
		);

		expect(error.isNotFound).toBe(true);
	});

	it('records whether the failed call may be replayed', async () => {
		respond({ message: 'boom', status: 'ERROR' }, 500);

		const error = await failure(
			makeRemarketyRequest(TOKEN, {
				method: 'POST',
				path: '/stores/1/contacts',
				body: {},
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
			makeRemarketyRequest(TOKEN, {
				method: 'GET',
				path: '/stores/1',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the X-Token', async () => {
		respond(BAD_TOKEN, 401);

		const error = await failure(
			makeRemarketyRequest(TOKEN, {
				method: 'GET',
				path: '/stores/1',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('isRemarketyFailure', () => {
	it('recognises the envelope', () => {
		expect(isRemarketyFailure(BAD_TOKEN)).toBe(true);
	});

	it('does not mistake a store for a failure', () => {
		expect(isRemarketyFailure(STORE)).toBe(false);
	});

	it('returns false for a non-object body', () => {
		expect(isRemarketyFailure(null)).toBe(false);
		expect(isRemarketyFailure([1, 2])).toBe(false);
	});
});

describe('segment', () => {
	it('encodes a value', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});

	it('stringifies a number', () => {
		expect(segment(7)).toBe('7');
	});
});

describe('describeRemarketyError', () => {
	it('prefixes the status', () => {
		expect(describeRemarketyError(401, BAD_TOKEN, 'x')).toContain(
			'Remarkety 401: Missing or invalid API Key',
		);
	});

	it('appends the guid', () => {
		expect(describeRemarketyError(401, BAD_TOKEN, 'x')).toContain(
			'[guid 6af39fd3ea435]',
		);
	});

	it('collects the nested errors from a 400, using the fallback text', () => {
		// This body names the problems in `errors` and carries no `message`, so the
		// fallback supplies the text.
		expect(
			describeRemarketyError(
				400,
				TEMPLATE_VALIDATION_ERROR,
				'Validation failed',
			),
		).toBe(
			'Remarkety 400: Validation failed (html must not be empty; type must be html or editor-v1)',
		);
	});

	it('falls back to the supplied message', () => {
		expect(describeRemarketyError(500, null, 'Server error')).toBe(
			'Remarkety 500: Server error',
		);
	});

	it('returns the bare message with no status', () => {
		expect(describeRemarketyError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
