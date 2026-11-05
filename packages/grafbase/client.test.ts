import {
	describeGrafbaseError,
	GrafbaseAPIError,
	makeGrafbaseRequest,
} from './client';
import { envelope, graphQLErrorEnvelope, viewer } from './test-fixtures';

const API_KEY = 'gf-secret-test-key';

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or text.
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

// unknown: a rejection can be any value until the instanceof check narrows it.
async function failure(promise: Promise<unknown>): Promise<GrafbaseAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(GrafbaseAPIError);
	if (!(error instanceof GrafbaseAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('makeGrafbaseRequest', () => {
	it('POSTs the GraphQL document with Bearer auth', async () => {
		respond(envelope({ viewer }), 200);

		const result = await makeGrafbaseRequest(API_KEY, {
			query: 'query ViewerGet { viewer { id } }',
			operationKind: 'query',
		});

		expect(result).toEqual({ viewer });
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(url).toBe('https://api.grafbase.com/graphql');
		expect(init.method).toBe('POST');
		const headers = new Headers(init.headers);
		expect(headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
		expect(headers.get('accept')).toBe('application/json');
		expect(headers.get('content-type')).toBe('application/json');
		expect(JSON.parse(String(init.body))).toEqual({
			query: 'query ViewerGet { viewer { id } }',
			variables: undefined,
		});
	});

	it('sends the variables next to the query', async () => {
		respond(envelope({ viewer }), 200);

		await makeGrafbaseRequest(API_KEY, {
			query:
				'query GraphsGet($accountSlug: String!) { graphByAccountSlug(accountSlug: $accountSlug) { id } }',
			variables: { accountSlug: 'fieldkit', graphSlug: 'analytics-api' },
			operationKind: 'query',
		});

		const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		expect(JSON.parse(String(init.body))).toEqual({
			query: expect.stringContaining('graphByAccountSlug'),
			variables: { accountSlug: 'fieldkit', graphSlug: 'analytics-api' },
		});
	});

	it('returns the data object of a successful envelope', async () => {
		respond(envelope({ deployment: { id: 'd1' } }), 200);

		await expect(
			makeGrafbaseRequest(API_KEY, {
				query: 'query { deployment(id: "d1") { id } }',
				operationKind: 'query',
			}),
		).resolves.toEqual({ deployment: { id: 'd1' } });
	});

	it('throws on GraphQL errors even with HTTP 200', async () => {
		respond(graphQLErrorEnvelope('Field viewer Forbidden', ['viewer']), 200);

		const error = await failure(
			makeGrafbaseRequest(API_KEY, {
				query: 'query ViewerGet { viewer { id } }',
				operationKind: 'query',
			}),
		);
		expect(error.status).toBeUndefined();
		expect(error.errors).toEqual([
			{ message: 'Field viewer Forbidden', path: ['viewer'] },
		]);
		expect(error.message).toContain('Field viewer Forbidden');
		expect(error.isRateLimit).toBe(false);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps an HTTP 401 and reads the body message', async () => {
		respond({ message: 'Unauthorized' }, 401);

		const error = await failure(
			makeGrafbaseRequest(API_KEY, {
				query: 'query ViewerGet { viewer { id } }',
				operationKind: 'query',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.message).toBe('Grafbase 401: Unauthorized');
		expect(error.operationKind).toBe('query');
	});

	it('reads GraphQL errors from an HTTP error body', async () => {
		respond(graphQLErrorEnvelope('jwt expired'), 401);

		const error = await failure(
			makeGrafbaseRequest(API_KEY, {
				query:
					'mutation Publish($input: PublishInput!) { publish(input: $input) { __typename } }',
				operationKind: 'mutation',
			}),
		);
		expect(error.status).toBe(401);
		expect(error.errors.map((entry) => entry.message)).toEqual(['jwt expired']);
		expect(error.operationKind).toBe('mutation');
	});

	it('treats a 429 as a rate limit and reads Retry-After', async () => {
		respond(graphQLErrorEnvelope('rate limited'), 429, {
			'Retry-After': '2',
		});

		const error = await failure(
			makeGrafbaseRequest(API_KEY, {
				query: 'query ViewerGet { viewer { id } }',
				operationKind: 'query',
			}),
		);
		expect(error.isRateLimit).toBe(true);
		expect(error.retryAfter).toBe(2000);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('wraps network failures', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		const error = await failure(
			makeGrafbaseRequest(API_KEY, {
				query: 'query ViewerGet { viewer { id } }',
				operationKind: 'query',
			}),
		);
		expect(error.message).toContain('fetch failed');
		expect(error.status).toBeUndefined();
		expect(error.cause).toBeInstanceOf(TypeError);
	});

	it('wraps a fetch timeout', async () => {
		fetchMock.mockRejectedValueOnce(
			new DOMException('The operation timed out', 'TimeoutError'),
		);

		const error = await failure(
			makeGrafbaseRequest(API_KEY, {
				query:
					'mutation Publish($input: PublishInput!) { publish(input: $input) { __typename } }',
				operationKind: 'mutation',
			}),
		);
		expect(error.message).toContain('timed out');
		expect(error.status).toBeUndefined();
	});

	it('leaves the API key out of errors', async () => {
		respond({ message: 'Unauthorized' }, 401);

		const error = await failure(
			makeGrafbaseRequest(API_KEY, {
				query: 'query ViewerGet { viewer { id } }',
				operationKind: 'query',
			}),
		);
		expect(error.message).not.toContain(API_KEY);
		expect(JSON.stringify(error)).not.toContain(API_KEY);
		expect(JSON.stringify(error.cause)).not.toContain(API_KEY);
	});
});

describe('describeGrafbaseError', () => {
	it('joins several GraphQL error messages', () => {
		expect(
			describeGrafbaseError(
				undefined,
				undefined,
				[
					{ message: 'Type Product defines field name twice' },
					{ message: 'Unknown type Order' },
				],
				'fallback',
			),
		).toBe('Type Product defines field name twice; Unknown type Order');
	});

	it('prefers GraphQL messages over a body message', () => {
		expect(
			describeGrafbaseError(401, { message: 'Unauthorized' }, [], 'fallback'),
		).toBe('Grafbase 401: Unauthorized');
	});

	it('falls back when the body has no error text', () => {
		expect(
			describeGrafbaseError(503, '<html>down</html>', [], 'Unavailable'),
		).toBe('Grafbase 503: Unavailable');
		expect(describeGrafbaseError(undefined, undefined, [], 'timeout')).toBe(
			'timeout',
		);
	});
});
