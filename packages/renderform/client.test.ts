import {
	describeRenderformError,
	makeRenderformRequest,
	RENDERFORM_API_BASE,
	RenderformAPIError,
	segment,
} from './client';
import { INCORRECT_KEY, RENDERED, VALIDATION_ERROR } from './test-fixtures';

const KEY = 'renderform-secret-key';

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
async function failure(promise: Promise<unknown>): Promise<RenderformAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RenderformAPIError);
	if (!(error instanceof RenderformAPIError)) throw error;
	return error;
}

describe('Renderform client', () => {
	it('points at the documented host', () => {
		expect(RENDERFORM_API_BASE).toBe('https://api.renderform.io');
	});

	it('sends the key in x-api-key, the header the spec names', async () => {
		respond(RENDERED, 200);

		await makeRenderformRequest(KEY, {
			method: 'POST',
			path: '/api/v2/render',
			body: { template: 't1' },
			replayable: false,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.renderform.io/api/v2/render');
		const headers = new Headers(init.headers);
		expect(headers.get('x-api-key')).toBe(KEY);
		// Not a bearer token.
		expect(headers.get('authorization')).toBeNull();
	});

	it('serialises a body as JSON', async () => {
		respond(RENDERED, 200);

		await makeRenderformRequest(KEY, {
			method: 'POST',
			path: '/api/v2/render',
			body: { template: 't1', data: { 'my-text.text': 'John' } },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			template: 't1',
			data: { 'my-text.text': 'John' },
		});
	});

	it('treats a bad key as an auth error even though it is a 400', async () => {
		respond(INCORRECT_KEY, 400);

		const error = await failure(
			makeRenderformRequest(KEY, {
				method: 'GET',
				path: '/api/v2/my-templates',
				replayable: true,
			}),
		);

		// Renderform answers a wrong key with 400, not 401.
		expect(error.status).toBe(400);
		expect(error.message).toBe('Renderform 400: Incorrect API Key');
		expect(error.isAuthError).toBe(true);
	});

	it('does not treat a genuine 400 as an auth error', async () => {
		respond(VALIDATION_ERROR, 400);

		const error = await failure(
			makeRenderformRequest(KEY, {
				method: 'POST',
				path: '/api/v2/render',
				body: {},
				replayable: false,
			}),
		);

		expect(error.isAuthError).toBe(false);
		expect(error.isValidationError).toBe(true);
		// The individual reasons are kept.
		expect(error.errors).toEqual([
			'template must not be blank',
			'data must be an object',
		]);
	});

	it('reads a 404 as not found', async () => {
		respond({ msg: 'Resource not found', status: 404 }, 404);

		const error = await failure(
			makeRenderformRequest(KEY, {
				method: 'GET',
				path: '/api/v2/my-templates/x',
				replayable: true,
			}),
		);

		expect(error.isNotFound).toBe(true);
	});

	it('records whether the failed call may be replayed', async () => {
		respond({ msg: 'boom', status: 500 }, 500);

		const error = await failure(
			makeRenderformRequest(KEY, {
				method: 'POST',
				path: '/api/v2/render',
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
			makeRenderformRequest(KEY, {
				method: 'GET',
				path: '/api/v2/my-templates',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the x-api-key', async () => {
		respond(INCORRECT_KEY, 400);

		const error = await failure(
			makeRenderformRequest(KEY, {
				method: 'GET',
				path: '/api/v2/my-templates',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('segment', () => {
	it('encodes a value', () => {
		expect(segment('a/b c')).toBe('a%2Fb%20c');
	});
});

describe('describeRenderformError', () => {
	it('prefixes the status', () => {
		expect(describeRenderformError(400, INCORRECT_KEY, 'x')).toBe(
			'Renderform 400: Incorrect API Key',
		);
	});

	it('appends the individual errors in parentheses', () => {
		expect(describeRenderformError(400, VALIDATION_ERROR, 'x')).toBe(
			'Renderform 400: Validation failed (template must not be blank; data must be an object)',
		);
	});

	it('falls back to the body status when there is no HTTP status', () => {
		expect(
			describeRenderformError(undefined, { msg: 'Down', status: 503 }, 'x'),
		).toBe('Renderform 503: Down');
	});

	it('falls back to the supplied message', () => {
		expect(describeRenderformError(500, null, 'Server error')).toBe(
			'Renderform 500: Server error',
		);
	});

	it('returns the bare message with neither', () => {
		expect(describeRenderformError(undefined, {}, 'Network error')).toBe(
			'Network error',
		);
	});
});
