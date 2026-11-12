import {
	describeRosetteError,
	makeRosetteRequest,
	ROSETTE_API_BASE,
	RosetteAPIError,
} from './client';
import { BAD_REQUEST, FORBIDDEN, LANGUAGE } from './test-fixtures';

const KEY = 'rosette-secret-key';

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
async function failure(promise: Promise<unknown>): Promise<RosetteAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RosetteAPIError);
	if (!(error instanceof RosetteAPIError)) throw error;
	return error;
}

describe('Rosette client', () => {
	it('points at the current Babel Street host', () => {
		// The old api.rosette.com host still answers, but the docs and bindings moved.
		expect(ROSETTE_API_BASE).toBe('https://analytics.babelstreet.com/rest/v1');
	});

	it('sends the key in X-BabelStreetAPI-Key', async () => {
		respond(LANGUAGE, 200);

		await makeRosetteRequest(KEY, {
			method: 'POST',
			path: '/language',
			body: { content: 'hello' },
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://analytics.babelstreet.com/rest/v1/language');
		const headers = new Headers(init.headers);
		expect(headers.get('x-babelstreetapi-key')).toBe(KEY);
		expect(headers.get('accept')).toBe('application/json');
		// The legacy header is accepted by the server but not sent.
		expect(headers.get('x-rosetteapi-key')).toBeNull();
	});

	it('serialises a body as JSON', async () => {
		respond(LANGUAGE, 200);

		await makeRosetteRequest(KEY, {
			method: 'POST',
			path: '/language',
			body: { content: 'hello', language: 'eng' },
			replayable: true,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			content: 'hello',
			language: 'eng',
		});
	});

	it('reads the live 403 forbidden body', async () => {
		respond(FORBIDDEN, 403);

		const error = await failure(
			makeRosetteRequest(KEY, {
				method: 'POST',
				path: '/entities',
				body: { content: 'x' },
				replayable: true,
			}),
		);

		// One body covers a bad key, an unauthorized endpoint and a spent quota.
		expect(error.status).toBe(403);
		expect(error.code).toBe('forbidden');
		expect(error.message).toContain('invalid API key');
		expect(error.isAuthError).toBe(true);
		expect(error.endpoint).toBe('/entities');
	});

	it('reads a badRequest as a validation error, not an auth error', async () => {
		respond(BAD_REQUEST, 400);

		const error = await failure(
			makeRosetteRequest(KEY, {
				method: 'POST',
				path: '/language',
				body: {},
				replayable: true,
			}),
		);

		expect(error.code).toBe('badRequestFormat');
		expect(error.isValidationError).toBe(true);
		expect(error.isAuthError).toBe(false);
	});

	it('records whether the failed call may be replayed', async () => {
		respond({ code: 'internalError', message: 'boom' }, 503);

		const error = await failure(
			makeRosetteRequest(KEY, {
				method: 'POST',
				path: '/language',
				body: {},
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
			makeRosetteRequest(KEY, {
				method: 'GET',
				path: '/ping',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the API key', async () => {
		respond(FORBIDDEN, 403);

		const error = await failure(
			makeRosetteRequest(KEY, {
				method: 'POST',
				path: '/language',
				body: {},
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('describeRosetteError', () => {
	it('puts the code beside the status', () => {
		expect(describeRosetteError(403, FORBIDDEN, 'x')).toContain(
			'Rosette 403 forbidden:',
		);
	});

	it('falls back to the supplied message', () => {
		expect(describeRosetteError(500, null, 'Server error')).toBe(
			'Rosette 500: Server error',
		);
	});

	it('returns the bare message with no status or code', () => {
		expect(describeRosetteError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});

	it('includes a code with no status', () => {
		expect(
			describeRosetteError(undefined, { code: 'x', message: 'Down' }, 'y'),
		).toBe('Rosette x: Down');
	});
});
