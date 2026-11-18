import {
	describeRemoteRetrievalError,
	isRemoteRetrievalFailure,
	makeRemoteRetrievalRequest,
	REMOTERETRIEVAL_API_BASE,
	RemoteRetrievalAPIError,
} from './client';
import {
	FAILED_IN_BODY,
	INVALID_KEY,
	ORDER_CREATED,
	VALIDATED,
} from './test-fixtures';

const KEY = 'remoteretrieval-secret-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch').mockImplementation(() => {
		throw new Error('unmocked fetch in a unit test');
	});
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
async function failure(
	promise: Promise<unknown>,
): Promise<RemoteRetrievalAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RemoteRetrievalAPIError);
	if (!(error instanceof RemoteRetrievalAPIError)) throw error;
	return error;
}

describe('Remote Retrieval client', () => {
	it('points at the site host under /api/v1', () => {
		expect(REMOTERETRIEVAL_API_BASE).toBe(
			'https://www.remoteretrieval.com/api/v1',
		);
	});

	it('sends the key as a Bearer token', async () => {
		respond(VALIDATED, 200);

		await makeRemoteRetrievalRequest(KEY, {
			method: 'GET',
			path: '/validate/user',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://www.remoteretrieval.com/api/v1/validate/user');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${KEY}`);
		expect(headers.get('accept')).toBe('application/json');
	});

	it('serialises a body as JSON', async () => {
		respond(ORDER_CREATED, 200);

		await makeRemoteRetrievalRequest(KEY, {
			method: 'POST',
			path: '/create-order',
			body: { orders: [{ type_of_equipment: 'Laptop' }] },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			orders: [{ type_of_equipment: 'Laptop' }],
		});
	});

	it('reads the dual code from a 401', async () => {
		respond(INVALID_KEY, 401);

		const error = await failure(
			makeRemoteRetrievalRequest(KEY, {
				method: 'GET',
				path: '/validate/user',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.code).toBe(401);
		// The API sends both a code and a custom_code; both are kept.
		expect(error.customCode).toBe(401);
		expect(error.message).toBe('Remote Retrieval 401: Invalid Key!');
		expect(error.isAuthError).toBe(true);
	});

	it('throws a failure that arrived with a 200', async () => {
		respond(FAILED_IN_BODY, 200);

		const error = await failure(
			makeRemoteRetrievalRequest(KEY, {
				method: 'POST',
				path: '/create-order',
				body: { orders: [] },
				replayable: false,
			}),
		);

		// status: "Fail" is the marker, so a 200 does not hide the refusal.
		expect(error.code).toBe(422);
		expect(error.isValidationError).toBe(true);
	});

	it('records whether the failed call may be replayed', async () => {
		respond({ ...INVALID_KEY, code: 500, custom_code: 500 }, 500);

		const error = await failure(
			makeRemoteRetrievalRequest(KEY, {
				method: 'POST',
				path: '/create-order',
				body: { orders: [] },
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
			makeRemoteRetrievalRequest(KEY, {
				method: 'GET',
				path: '/validate/user',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the bearer token', async () => {
		respond(INVALID_KEY, 401);

		const error = await failure(
			makeRemoteRetrievalRequest(KEY, {
				method: 'GET',
				path: '/validate/user',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('isRemoteRetrievalFailure', () => {
	it('recognises a failure envelope', () => {
		expect(isRemoteRetrievalFailure(INVALID_KEY)).toBe(true);
		expect(isRemoteRetrievalFailure(FAILED_IN_BODY)).toBe(true);
	});

	it('does not treat a success envelope as a failure', () => {
		expect(isRemoteRetrievalFailure(VALIDATED)).toBe(false);
		expect(isRemoteRetrievalFailure(ORDER_CREATED)).toBe(false);
	});

	it('does not treat a bare array of orders as a failure', () => {
		// The four list routes answer a bare array.
		expect(isRemoteRetrievalFailure([{ order_id: 1 }])).toBe(false);
	});

	it('returns false for a non-object body', () => {
		expect(isRemoteRetrievalFailure(null)).toBe(false);
		expect(isRemoteRetrievalFailure('text')).toBe(false);
	});
});

describe('describeRemoteRetrievalError', () => {
	it('prefixes the status', () => {
		expect(describeRemoteRetrievalError(401, INVALID_KEY, 'x')).toBe(
			'Remote Retrieval 401: Invalid Key!',
		);
	});

	it('falls back to the body code when there is no status', () => {
		expect(describeRemoteRetrievalError(undefined, FAILED_IN_BODY, 'x')).toBe(
			'Remote Retrieval 422: Order could not be created.',
		);
	});

	it('falls back to the supplied message', () => {
		expect(describeRemoteRetrievalError(500, null, 'Server error')).toBe(
			'Remote Retrieval 500: Server error',
		);
	});

	it('returns the bare message with neither', () => {
		expect(describeRemoteRetrievalError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
