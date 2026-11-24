import { ApiError } from 'corsair/http';
import { mozDocExamples } from './doc-examples';
import type { MozOperationName } from './endpoints';
import {
	mozEndpointMetaMap,
	mozEndpointsNested,
	mozMethods,
} from './endpoints';
import { mozInputSchema, mozOutputSchema } from './endpoints/call';

// unknown in `.catch((e: unknown) => e)`: a rejection can be any value, and
// each test narrows it with a cast or toBeInstanceOf before reading it.
const fetchMock = jest.fn();
const realFetch = global.fetch;
const TOKEN = 'moz-token-abcdef-123456';

const ctx = {
	key: TOKEN,
	$getAccountId: async () => {
		throw new Error('no account in unit tests');
	},
} as never;

// unknown: a reply body is any JSON value.
function reply(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { 'content-type': 'application/json' },
	});
}

function sentBody(index = 0) {
	const [, init] = fetchMock.mock.calls[index] as [string, RequestInit];
	return JSON.parse(String(init.body));
}

beforeAll(() => {
	global.fetch = fetchMock as never;
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterAll(() => {
	global.fetch = realFetch;
});
beforeEach(() => {
	fetchMock.mockReset();
	fetchMock.mockImplementation(() => {
		throw new Error('unexpected request');
	});
});

// unknown: walks the endpoint tree structurally.
function operation(name: string) {
	return name
		.split('.')
		.reduce<unknown>(
			(node, part) => (node as Record<string, unknown>)[part],
			mozEndpointsNested,
		) as (c: never, input: unknown) => Promise<unknown>;
}

const names = Object.keys(mozMethods) as MozOperationName[];

describe("Moz's documented examples", () => {
	it('cover every operation', () => {
		expect(Object.keys(mozDocExamples).sort()).toEqual([...names].sort());
		expect(names).toHaveLength(74);
	});

	it.each(names)(
		'%s accepts its documented payload and result',
		async (name) => {
			const example = mozDocExamples[name];
			expect(example?.method).toBe(mozMethods[name]);
			fetchMock.mockResolvedValueOnce(
				reply(200, { jsonrpc: '2.0', id: 'x', result: example?.result }),
			);
			const result = await operation(name)(ctx, example?.payload);
			expect(result).toEqual(mozOutputSchema(name).parse(example?.result));
			const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
			expect(url).toBe('https://api.moz.com/jsonrpc');
			expect(new Headers(init.headers).get('x-moz-token')).toBe(TOKEN);
			const body = sentBody();
			expect(body.jsonrpc).toBe('2.0');
			expect(body.method).toBe(mozMethods[name]);
			expect(body.id).toMatch(/^[A-Za-z0-9-]{24,}$/);
			expect(body.params.data).toEqual(
				mozInputSchema(name).parse(example?.payload),
			);
		},
	);
});

describe('inputs', () => {
	it('types the batch query items (Moz puts object fields on the array node)', async () => {
		await expect(
			mozEndpointsNested.keywords.metricsMultiple(ctx, {
				// @ts-expect-error items must be serp queries
				serp_queries: [42],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an unknown field before sending', async () => {
		await expect(
			mozEndpointsNested.metrics.fetch(ctx, {
				site_query: { query: 'moz.com', scope: 'domain' },
				// @ts-expect-error an unknown key
				sitequery: 'typo',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a scope Moz does not list', async () => {
		await expect(
			mozEndpointsNested.metrics.fetch(ctx, {
				// @ts-expect-error not an acceptable value
				site_query: { query: 'moz.com', scope: 'planet' },
			}),
		).rejects.toThrow();
	});
});

describe('errors', () => {
	it('rethrows HTTP errors as core ApiError with the JSON-RPC code and no request body', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(401, {
				jsonrpc: '2.0',
				id: 'x',
				error: {
					code: -32651,
					status: 401,
					message: 'Authentication failed',
					data: { issue: 'unauthenticated' },
				},
			}),
		);
		const error = (await mozEndpointsNested.quota
			.lookup(ctx, { path: 'api.limits.data.rows' })
			.catch((e: unknown) => e)) as ApiError;
		expect(error).toBeInstanceOf(ApiError);
		expect(error.status).toBe(401);
		expect(error.message).toBe(
			'Moz 401 -32651: Authentication failed (unauthenticated)',
		);
		expect(error.request.body).toBe('[REDACTED]');
		expect(JSON.stringify(error)).not.toContain(TOKEN);
	});

	it('treats a 200 with an error member as a failure at the envelope status', async () => {
		fetchMock.mockResolvedValueOnce(
			reply(200, {
				jsonrpc: '2.0',
				id: 'x',
				error: {
					code: -32670,
					httpStatus: 403,
					message: 'Quota exhausted',
					data: {
						issue: 'quota_exhausted',
						key: 'site_query',
						value: 'customer.example',
					},
				},
			}),
		);
		const error = (await mozEndpointsNested.metrics
			.fetch(ctx, {
				site_query: { query: 'customer.example', scope: 'domain' },
			})
			.catch((e: unknown) => e)) as ApiError;
		expect(error.status).toBe(403);
		expect(error.message).toContain('at site_query');
		expect(JSON.stringify(error.body)).not.toContain('customer.example');
	});

	it('refuses a token a header cannot carry without quoting it', async () => {
		const bad = { ...(ctx as object), key: 'abc\nsecret-part' } as never;
		const error = (await mozEndpointsNested.test
			.ping(bad, {})
			.catch((e: unknown) => e)) as Error;
		expect(error.message).toMatch(/characters a header cannot carry/);
		expect(error.message).not.toContain('secret-part');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('fails when the envelope has no result', async () => {
		fetchMock.mockResolvedValueOnce(reply(200, { jsonrpc: '2.0', id: 'x' }));
		await expect(mozEndpointsNested.test.ping(ctx, {})).rejects.toThrow(
			/no result for test.ping/,
		);
	});
});

describe('risk levels', () => {
	const meta = mozEndpointMetaMap as Record<
		string,
		{ riskLevel: string; job?: unknown }
	>;

	it('marks billed collection and Moz Local billing changes destructive', () => {
		for (const name of [
			'keywords.generateMetrics',
			'keywords.generateSerp',
			'local.locations.create',
			'local.locations.cancel',
			'local.locations.close',
			'local.locations.updateLevel',
		]) {
			expect([name, meta[name]?.riskLevel]).toEqual([name, 'destructive']);
		}
	});

	it('keeps metered data lookups read', () => {
		for (const name of names.filter(
			(n) => !n.startsWith('local.') && !n.startsWith('keywords.generate'),
		)) {
			expect([name, meta[name]?.riskLevel]).toEqual([name, 'read']);
		}
	});

	it('gives every async method a job to poll with jobs.lookup', () => {
		for (const name of [
			'competitors.fetch',
			'keywords.suggestions',
			'keywords.generateMetrics',
			'keywords.generateSerp',
			'test.pingAsync',
		]) {
			expect(meta[name]?.job).toBeDefined();
		}
	});
});
