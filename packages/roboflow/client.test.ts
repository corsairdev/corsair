import {
	describeRoboflowError,
	makeRoboflowRequest,
	ROBOFLOW_API_BASE,
	ROBOFLOW_INFERENCE_BASE,
	RoboflowAPIError,
	segment,
} from './client';
import {
	BAD_KEY,
	INFERENCE,
	INFERENCE_UNAUTHORIZED,
	NOT_FOUND,
} from './test-fixtures';

const KEY = 'roboflow-secret-key';

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
async function failure(promise: Promise<unknown>): Promise<RoboflowAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RoboflowAPIError);
	if (!(error instanceof RoboflowAPIError)) throw error;
	return error;
}

describe('Roboflow client', () => {
	it('publishes both hosts', () => {
		expect(ROBOFLOW_API_BASE).toBe('https://api.roboflow.com');
		expect(ROBOFLOW_INFERENCE_BASE).toBe('https://serverless.roboflow.com');
	});

	it('sends the key as a Bearer token to the management host by default', async () => {
		respond({ welcome: 'x' }, 200);

		await makeRoboflowRequest(KEY, {
			method: 'GET',
			path: '/',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.roboflow.com/');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${KEY}`);
		// The legacy query transport is never used, since it puts the key in a URL.
		expect(url).not.toContain('api_key');
	});

	it('routes to the inference host when asked', async () => {
		respond(INFERENCE, 200);

		await makeRoboflowRequest(KEY, {
			method: 'POST',
			path: '/chess-sample-4ckfl/3',
			query: { image: 'https://x.com/a.jpg' },
			host: 'inference',
			replayable: false,
		});

		expect(fetchMock.mock.calls[0][0]).toContain('serverless.roboflow.com');
	});

	it('serialises a body as JSON', async () => {
		respond({ id: 'x' }, 200);

		await makeRoboflowRequest(KEY, {
			method: 'POST',
			path: '/ws/projects',
			body: { name: 'Sharks' },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({ name: 'Sharks' });
	});

	it('reads a nested management error and keeps the hint', async () => {
		respond(BAD_KEY, 401);

		const error = await failure(
			makeRoboflowRequest(KEY, {
				method: 'GET',
				path: '/ws',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.type).toBe('OAuthException');
		expect(error.message).toContain('does not exist');
		// The hint names the fix, so it is kept.
		expect(error.hint).toContain('Roboflow Dashboard');
		expect(error.isAuthError).toBe(true);
	});

	it('reads a flat inference error', async () => {
		respond(INFERENCE_UNAUTHORIZED, 401);

		const error = await failure(
			makeRoboflowRequest(KEY, {
				method: 'POST',
				path: '/p/1',
				host: 'inference',
				replayable: false,
			}),
		);

		// The inference host puts status and message at the top level, not under
		// `error`.
		expect(error.status).toBe(401);
		expect(error.message).toBe('Roboflow 401: Unauthorized api_key');
		expect(error.isAuthError).toBe(true);
	});

	it('reads a 404 as not found', async () => {
		respond(NOT_FOUND, 404);

		const error = await failure(
			makeRoboflowRequest(KEY, {
				method: 'GET',
				path: '/ws/nope',
				replayable: true,
			}),
		);

		expect(error.isNotFound).toBe(true);
	});

	it('records whether the failed call may be replayed', async () => {
		respond({ error: { message: 'boom', status: 500 } }, 500);

		const error = await failure(
			makeRoboflowRequest(KEY, {
				method: 'POST',
				path: '/p/1',
				host: 'inference',
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
			makeRoboflowRequest(KEY, {
				method: 'GET',
				path: '/',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the bearer token', async () => {
		respond(BAD_KEY, 401);

		const error = await failure(
			makeRoboflowRequest(KEY, {
				method: 'GET',
				path: '/',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('segment', () => {
	it('encodes a slug', () => {
		expect(segment('my workspace')).toBe('my%20workspace');
	});

	it('stringifies a number', () => {
		expect(segment(3)).toBe('3');
	});
});

describe('describeRoboflowError', () => {
	it('appends the hint in parentheses', () => {
		expect(describeRoboflowError(401, BAD_KEY, 'x')).toContain(
			'Go to Account > Roboflow Keys',
		);
	});

	it('prefixes the status', () => {
		expect(
			describeRoboflowError(
				404,
				{ error: { message: 'Nope', status: 404 } },
				'x',
			),
		).toBe('Roboflow 404: Nope');
	});

	it('reads the flat inference shape', () => {
		expect(describeRoboflowError(401, INFERENCE_UNAUTHORIZED, 'x')).toBe(
			'Roboflow 401: Unauthorized api_key',
		);
	});

	it('falls back to the supplied message', () => {
		expect(describeRoboflowError(500, null, 'Server error')).toBe(
			'Roboflow 500: Server error',
		);
	});

	it('returns the bare message with no status', () => {
		expect(describeRoboflowError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
