import {
	describeRudderStackTransformationError,
	makeRudderStackTransformationRequest,
	RUDDERSTACK_TRANSFORMATION_BASE,
	RUDDERSTACK_TRANSFORMATION_HOSTS,
	RudderStackTransformationAPIError,
} from './client';
import { INVALID_TOKEN, RATE_LIMITED } from './test-fixtures';

const API_KEY = 'rudderstack-secret-test-key';

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
async function failure(
	promise: Promise<unknown>,
): Promise<RudderStackTransformationAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(RudderStackTransformationAPIError);
	if (!(error instanceof RudderStackTransformationAPIError)) throw error;
	return error;
}

describe('RudderStack client', () => {
	it('publishes both regional hosts and defaults to the US one', () => {
		expect(RUDDERSTACK_TRANSFORMATION_HOSTS.us).toBe(
			'https://api.rudderstack.com',
		);
		expect(RUDDERSTACK_TRANSFORMATION_HOSTS.eu).toBe(
			'https://api.eu.rudderstack.com',
		);
		expect(RUDDERSTACK_TRANSFORMATION_BASE).toBe(
			RUDDERSTACK_TRANSFORMATION_HOSTS.us,
		);
	});

	it('sends the token as a Bearer token', async () => {
		respond({ transformations: [] }, 200);

		await makeRudderStackTransformationRequest(API_KEY, 'us', {
			method: 'GET',
			path: '/transformations',
			replayable: true,
		});

		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.rudderstack.com/transformations');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('accept')).toBe('application/json');
	});

	it('stays on the US host by default, which every doc example uses', async () => {
		respond({}, 200);

		await makeRudderStackTransformationRequest(API_KEY, 'us', {
			method: 'GET',
			path: '/libraries',
			replayable: true,
		});

		expect(fetchMock.mock.calls[0][0]).toContain('api.rudderstack.com');
		expect(fetchMock.mock.calls[0][0]).not.toContain('eu.');
	});

	it('moves to the EU host when the workspace lives there', async () => {
		respond({}, 200);

		await makeRudderStackTransformationRequest(API_KEY, 'eu', {
			method: 'GET',
			path: '/libraries',
			replayable: true,
		});

		expect(fetchMock.mock.calls[0][0]).toBe(
			'https://api.eu.rudderstack.com/libraries',
		);
	});

	it('serialises a body as JSON with a JSON media type', async () => {
		respond({}, 200);

		await makeRudderStackTransformationRequest(API_KEY, 'us', {
			method: 'POST',
			path: '/transformations',
			body: { name: 'Get metadata', language: 'javascript' },
			replayable: false,
		});

		const init = fetchMock.mock.calls[0][1] as RequestInit;
		expect(new Headers(init.headers).get('content-type')).toContain(
			'application/json',
		);
		expect(JSON.parse(String(init.body))).toEqual({
			name: 'Get metadata',
			language: 'javascript',
		});
	});

	it('sends publish as a query flag, not a body field', async () => {
		respond({}, 200);

		await makeRudderStackTransformationRequest(API_KEY, 'us', {
			method: 'POST',
			path: '/transformations',
			query: { publish: true },
			body: { name: 'x', language: 'javascript' },
			replayable: false,
		});

		const url = fetchMock.mock.calls[0][0] as string;
		expect(new URL(url).searchParams.get('publish')).toBe('true');
	});

	it('reads the lone message from an error body', async () => {
		respond(INVALID_TOKEN, 401);

		const error = await failure(
			makeRudderStackTransformationRequest(API_KEY, 'us', {
				method: 'GET',
				path: '/transformations',
				replayable: true,
			}),
		);

		expect(error.status).toBe(401);
		expect(error.message).toBe('RudderStack 401: Invalid Access Token');
		expect(error.isAuthError).toBe(true);
	});

	it('records whether the failed call may be replayed', async () => {
		respond(RATE_LIMITED, 429, { 'Retry-After': '4' });

		const error = await failure(
			makeRudderStackTransformationRequest(API_KEY, 'us', {
				method: 'POST',
				path: '/transformations',
				replayable: false,
			}),
		);

		expect(error.replayable).toBe(false);
		expect(error.method).toBe('POST');
		// corsair/http reports Retry-After in milliseconds.
		expect(error.retryAfter).toBe(4000);
	});

	it('wraps a transport failure and keeps its cause', async () => {
		const cause = new Error('socket hang up');
		fetchMock.mockRejectedValueOnce(cause);

		const error = await failure(
			makeRudderStackTransformationRequest(API_KEY, 'us', {
				method: 'GET',
				path: '/transformations',
				replayable: true,
			}),
		);

		expect(error.status).toBeUndefined();
		expect(error.cause).toBe(cause);
	});

	it('drops the cause of an HTTP error, which would retain the bearer token', async () => {
		respond(INVALID_TOKEN, 401);

		const error = await failure(
			makeRudderStackTransformationRequest(API_KEY, 'us', {
				method: 'GET',
				path: '/transformations',
				replayable: true,
			}),
		);

		expect(error.cause).toBeUndefined();
	});
});

describe('describeRudderStackTransformationError', () => {
	it('prefixes the message with the status', () => {
		expect(
			describeRudderStackTransformationError(
				400,
				{ message: 'Transformation is not published' },
				'x',
			),
		).toBe('RudderStack 400: Transformation is not published');
	});

	it('accepts an error key as well as message', () => {
		expect(
			describeRudderStackTransformationError(400, { error: 'Bad' }, 'x'),
		).toBe('RudderStack 400: Bad');
	});

	it('falls back to the supplied message when the body has none', () => {
		expect(
			describeRudderStackTransformationError(500, null, 'Server error'),
		).toBe('RudderStack 500: Server error');
	});

	it('returns the bare message with no status', () => {
		expect(
			describeRudderStackTransformationError(undefined, {}, 'Network'),
		).toBe('Network');
	});
});
