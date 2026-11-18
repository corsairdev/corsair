import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { litescrapeEndpointsNested } from './endpoints/catalog';
import { litescrapeOperations } from './endpoints/manifest';
import type { LitescrapeContext } from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makeLitescrapeRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeLitescrapeRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

// jest-yaml-transform turns the yaml into a plain object.
const docs = require('./plugin-docs.yaml') as {
	// `unknown` because example args are free-form YAML values.
	apiExamples: Record<string, { args: Record<string, unknown> }>;
};

function buildCtx(): LitescrapeContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-api-key',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-api-key'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

// `unknown` because each operation has its own input and output type; the
// table below drives all 200 through the same assertions.
type AnyEndpoint = (
	context: LitescrapeContext,
	input: unknown,
) => Promise<unknown>;

function endpointFor(id: string): AnyEndpoint {
	const [group, action] = id.split('.') as [string, string];
	const actions = (
		litescrapeEndpointsNested as unknown as Record<
			string,
			Record<string, AnyEndpoint>
		>
	)[group];
	const endpoint = actions?.[action];
	if (!endpoint) throw new Error(`no endpoint ${id}`);
	return endpoint;
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('every manifest operation', () => {
	it.each(litescrapeOperations.map((operation) => [operation.id, operation]))(
		'%s posts its validated example to its route and parses the response',
		async (id, operation) => {
			const example = docs.apiExamples[id]?.args;
			expect(example).toBeDefined();
			const response = {
				search_metadata: { status: 'Success' },
				unlisted_group: [{ kept: true }],
			};
			mockedRequest.mockResolvedValueOnce(response);

			const result = await endpointFor(id)(ctx, { ...example, timeout: 30 });

			expect(mockedRequest).toHaveBeenCalledTimes(1);
			expect(mockedRequest).toHaveBeenCalledWith(
				operation.path,
				'test-api-key',
				{
					method: 'POST',
					body: example,
					query: { timeout: 30 },
					budgetSeconds: 30,
				},
			);
			expect(result).toEqual(response);
			expect(mockedLogEvent).toHaveBeenCalledWith(
				ctx,
				'litescrape.operation',
				{ operationId: id },
				'completed',
			);
		},
	);
});

describe('operation endpoint behaviour', () => {
	it('sends no timeout query and the default budget when none is given', async () => {
		mockedRequest.mockResolvedValueOnce({});
		await endpointFor('amazon.search')(ctx, { k: 'coffee mug' });
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/amazon/search',
			'test-api-key',
			{
				method: 'POST',
				body: { k: 'coffee mug' },
				query: {},
				budgetSeconds: undefined,
			},
		);
	});

	it('rejects invalid input before any request', async () => {
		await expect(endpointFor('bing.search')(ctx, {})).rejects.toThrow();
		await expect(
			endpointFor('bing.search')(ctx, { q: 'x', not_a_field: 1 }),
		).rejects.toThrow();
		await expect(
			endpointFor('bing.search')(ctx, { q: 'x', timeout: 120 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('throws on a response that breaks the documented types', async () => {
		mockedRequest.mockResolvedValueOnce({ organic_results: 'not a list' });
		await expect(
			endpointFor('bing.search')(ctx, { q: 'coffee' }),
		).rejects.toThrow();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});

	it('throws on a null body rather than returning a default', async () => {
		mockedRequest.mockResolvedValueOnce(null);
		await expect(
			endpointFor('google.search')(ctx, { q: 'coffee' }),
		).rejects.toThrow();
	});

	it('lets the transport error through unchanged for the error handlers', async () => {
		const failure = Object.assign(new Error('Service Unavailable'), {
			status: 503,
		});
		mockedRequest.mockRejectedValueOnce(failure);
		await expect(
			endpointFor('walmart.search')(ctx, { query: 'coffee' }),
		).rejects.toBe(failure);
	});

	it('never logs the query or the results', async () => {
		mockedRequest.mockResolvedValueOnce({ organic_results: [] });
		await endpointFor('google.search')(ctx, { q: 'private search terms' });
		const payload = JSON.stringify(mockedLogEvent.mock.calls);
		expect(payload).not.toContain('private search terms');
	});
});

describe('keys operations', () => {
	it('keys.status reads the key accounting payload with GET', async () => {
		mockedRequest.mockResolvedValueOnce({
			remaining_calls: 100000,
			concurrency_limit: 100,
			status: 'active',
		});
		const result = await litescrapeEndpointsNested.keys.status(ctx, {});
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/keys/status',
			'test-api-key',
			{ method: 'GET' },
		);
		expect(result.remaining_calls).toBe(100000);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'litescrape.keys.status',
			{},
			'completed',
		);
	});

	it('keys.usage passes the window and timezone as query fields', async () => {
		mockedRequest.mockResolvedValueOnce({
			range: '7d',
			totals: { requests: 2 },
			series: [],
		});
		const result = await litescrapeEndpointsNested.keys.usage(ctx, {
			range: '7d',
			tz: 'UTC',
		});
		expect(mockedRequest).toHaveBeenCalledWith('/api/usage', 'test-api-key', {
			method: 'GET',
			query: { range: '7d', tz: 'UTC' },
		});
		expect(result.totals?.requests).toBe(2);
	});

	it('keys.usage rejects an undocumented window', async () => {
		await expect(
			litescrapeEndpointsNested.keys.usage(ctx, {
				range: '1y' as unknown as '7d',
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});
