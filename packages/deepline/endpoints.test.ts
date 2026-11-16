import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { makeDeeplineRequest } from './client';
import { endpoints } from './endpoints';
import { errorHandlers } from './error-handlers';
import type { DeeplineContext } from './index';
import { deepline, deeplineEndpointSchemas } from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
const fetchMock = jest.fn();
const originalFetch = global.fetch;
const ctx = {
	key: 'tenant-resolved-key',
	database: {},
	options: { key: 'wrong-option-key' },
} as DeeplineContext;
const run = {
	schemaVersion: 1,
	kind: 'play_run',
	run: { id: 'play/prebuilt/demo/run/1', playName: 'demo', status: 'running' },
	steps: [],
	outputs: {},
	datasets: [],
	next: {},
};
const tool = {
	toolId: 'company_lookup',
	provider: 'free',
	operationId: 'lookup',
	description: 'Company lookup',
	inputSchema: { type: 'object' },
};
const play = { name: 'demo', reference: 'prebuilt/demo', description: null };
const recent = {
	run_id: null,
	total: 0,
	offset: 0,
	limit: 10,
	next_offset: 0,
	next_cursor: null,
	has_more: false,
	incomplete: false,
	entries: [],
};
const coverage = {
	complete: false,
	expectedRows: null,
	captureStartedAt: null,
	captureCompletedAt: null,
	reason: 'legacy_or_capture_not_enabled',
};
function reply(
	value: unknown,
	status = 200,
	headers: Record<string, string> = {},
) {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json', ...headers },
	});
}
beforeEach(() => {
	jest.clearAllMocks();
	fetchMock.mockReset();
	global.fetch = fetchMock;
});
afterAll(() => {
	global.fetch = originalFetch;
});
function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url: new URL(url), init };
}
// Explicit contract fixtures from the documented HTTP envelopes. Every operation
// runs through its real input parser, HTTP transport and output parser.
const cases = [
	{
		name: 'health.get',
		call: () => endpoints.health.get(ctx, {}),
		path: '/api/v2/health',
		response: {
			status: 'ok',
			version: 'v2',
			timestamp: '2026-11-16T15:00:00Z',
		},
	},
	{
		name: 'tools.list',
		call: () => endpoints.tools.list(ctx, { compact: false, grep: 'company' }),
		path: '/api/v2/tools',
		query: { compact: 'false', grep: 'company' },
		response: { tools: [tool] },
	},
	{
		name: 'tools.search',
		call: () =>
			endpoints.tools.search(ctx, { q: 'company', offset: 2, limit: 5 }),
		path: '/api/v2/tools/search',
		query: { q: 'company', offset: '2', limit: '5' },
		response: {
			tools: [
				{
					toolId: 'lookup',
					provider: 'free',
					operation: 'lookup',
					description: 'lookup',
				},
			],
			next_offset: 7,
		},
	},
	{
		name: 'search.query',
		call: () =>
			endpoints.search.query(ctx, { types: 'tools,plays', offset: 3 }),
		path: '/api/v2/search',
		query: { types: 'tools,plays', offset: '3' },
		response: { results: [{ id: 'lookup', kind: 'tool' }], kinds: ['tool'] },
	},
	{
		name: 'tools.get',
		call: () => endpoints.tools.get(ctx, { toolId: 'provider/tool ?#' }),
		path: '/api/v2/integrations/provider%2Ftool%20%3F%23/get',
		response: tool,
	},
	{
		name: 'tools.execute',
		call: () =>
			endpoints.tools.execute(ctx, {
				toolId: 'lookup',
				idempotencyKey: 'run:001',
				payload: { domain: 'example.com' },
			}),
		path: '/api/v2/integrations/lookup/execute',
		method: 'POST',
		body: { payload: { domain: 'example.com' } },
		response: {
			status: 'success',
			toolResponse: { rawV2: { company: 'Example' } },
			billing: { pricing_status: 'pending' },
		},
	},
	{
		name: 'executions.getByKey',
		call: () => endpoints.executions.getByKey(ctx, { key: 'run:001' }),
		path: '/api/v2/executions/by-key/run%3A001',
		response: {
			toolId: 'lookup',
			executionRecovery: {
				idempotencyKey: 'run:001',
				state: 'outcome_unknown',
				replayed: true,
			},
			responseStatus: 500,
		},
	},
	{
		name: 'plays.run',
		call: () =>
			endpoints.plays.run(ctx, {
				name: 'prebuilt/demo',
				input: { domain: 'example.com' },
				maxCredits: 2,
				waitForCompletionMs: 1000,
			}),
		path: '/api/v2/plays/run',
		method: 'POST',
		body: {
			name: 'prebuilt/demo',
			input: { domain: 'example.com' },
			maxCredits: 2,
			waitForCompletionMs: 1000,
		},
		response: run,
	},
	{
		name: 'plays.list',
		call: () => endpoints.plays.list(ctx, { limit: 2, summary_only: '1' }),
		path: '/api/v2/plays',
		query: { limit: '2', summary_only: '1', inventory_paginated: '1' },
		response: { plays: [play] },
	},
	{
		name: 'plays.get',
		call: () => endpoints.plays.get(ctx, { name: 'prebuilt/demo' }),
		path: '/api/v2/plays/prebuilt%2Fdemo',
		response: { play, latestRuns: [] },
	},
	{
		name: 'plays.activity',
		call: () => endpoints.plays.activity(ctx, { days: 1, timeZone: 'UTC' }),
		path: '/api/v2/plays/activity',
		method: 'POST',
		body: { days: 1, timeZone: 'UTC' },
		response: {
			timeZone: 'UTC',
			groupBy: 'kind',
			endDate: '2026-11-16',
			buckets: [],
			coverage: {
				playRunsEarliestCompleteAt: null,
				monitorDeliveriesEarliestCompleteAt: null,
				monitorDeliveriesCompleteThroughAt: null,
				projectionPending: false,
				earliestPendingAt: null,
			},
		},
	},
	{
		name: 'runs.history',
		call: () => endpoints.runs.history(ctx, { cursor: 'next', limit: 2 }),
		path: '/api/v2/dashboard/runs-history',
		query: { cursor: 'next', limit: '2' },
		response: { runs: [], nextCursor: 'after', hasMore: true },
	},
	{
		name: 'runs.get',
		call: () =>
			endpoints.runs.get(ctx, {
				runId: 'play/prebuilt/demo/run/1',
				full: true,
				billing: false,
			}),
		path: '/api/v2/runs/play%2Fprebuilt%2Fdemo%2Frun%2F1',
		query: { full: 'true', billing: 'false' },
		response: { status: 'running', package: run },
	},
	{
		name: 'runs.children',
		call: () =>
			endpoints.runs.children(ctx, {
				runId: 'parent',
				launchKey: 'child',
				cursor: 'next',
			}),
		path: '/api/v2/runs/parent/children',
		query: { launchKey: 'child', cursor: 'next' },
		response: { children: [], nextCursor: null, hasMore: false },
	},
	{
		name: 'runs.logs',
		call: () =>
			endpoints.runs.logs(ctx, { runId: 'parent', afterSeq: 12, limit: 20 }),
		path: '/api/v2/runs/parent/logs',
		query: { afterSeq: '12', limit: '20' },
		response: {
			runId: 'parent',
			entries: [{ seq: 13, line: 'Completed' }],
			lastSeq: 13,
			hasMore: false,
		},
	},
	{
		name: 'datasets.rows',
		call: () =>
			endpoints.datasets.rows(ctx, {
				playName: 'prebuilt/demo',
				tableNamespace: 'result.rows',
				runId: 'run-1',
				offset: 20,
				limit: 10,
			}),
		path: '/api/v2/plays/prebuilt%2Fdemo/sheet',
		query: {
			tableNamespace: 'result.rows',
			runId: 'run-1',
			offset: '20',
			limit: '10',
		},
		response: {
			rows: [{ runId: 'run-1', data: { domain: 'example.com' } }],
			scope: { kind: 'run', runId: 'run-1' },
		},
	},
	{
		name: 'datasets.history',
		call: () =>
			endpoints.datasets.history(ctx, {
				playName: 'demo',
				tableNamespace: 'result.rows',
				runId: 'run-1',
				cursor: 'next',
			}),
		path: '/api/v2/plays/demo/sheet/history',
		query: { runId: 'run-1', tableNamespace: 'result.rows', cursor: 'next' },
		response: { entries: [], nextCursor: null, coverage },
	},
	{
		name: 'billing.entitlements',
		call: () => endpoints.billing.entitlements(ctx, {}),
		path: '/api/v2/billing/entitlements',
		response: {
			org_id: 'org-example',
			as_of: 1,
			plan: null,
			benefits: {},
			effective_limits: {},
		},
	},
	{
		name: 'billing.balance',
		call: () => endpoints.billing.balance(ctx, {}),
		path: '/api/v2/billing/balance',
		response: {
			org_id: 'org-example',
			balance: 10,
			spendable_balance_credits: null,
			spendable_balance_status: 'unavailable',
			exposure_status: 'partial',
		},
	},
	{
		name: 'billing.usage',
		call: () => endpoints.billing.usage(ctx, { request_id: 'request-1' }),
		path: '/api/v2/billing/usage',
		query: { request_id: 'request-1' },
		response: { org_id: 'org-example', recent },
	},
	{
		name: 'billing.ledger',
		call: () =>
			endpoints.billing.ledger(ctx, { cursor: 'next', since_at: 1, limit: 2 }),
		path: '/api/v2/billing/ledger',
		query: { cursor: 'next', since_at: '1', limit: '2' },
		response: {
			org_id: 'org-example',
			scope: { kind: 'org' },
			entries: [],
			has_more: false,
			next_cursor: null,
			next_before_at: null,
		},
	},
];
describe('Deepline HTTP contracts', () => {
	it.each(cases)(
		'$name sends the documented request and validates the result',
		async (test) => {
			fetchMock.mockResolvedValueOnce(reply(test.response));
			expect(await test.call()).toEqual(test.response);
			const { url, init } = lastRequest();
			expect(url.origin).toBe('https://code.deepline.com');
			expect(url.pathname).toBe(test.path);
			expect(init.method).toBe('method' in test ? test.method : 'GET');
			expect(new Headers(init.headers).get('Authorization')).toBe(
				'Bearer tenant-resolved-key',
			);
			if ('query' in test)
				expect(Object.fromEntries(url.searchParams)).toEqual(test.query);
			if ('body' in test)
				expect(JSON.parse(String(init.body))).toEqual(test.body);
			if (test.name === 'tools.execute')
				expect(new Headers(init.headers).get('Idempotency-Key')).toBe(
					'run:001',
				);
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`deepline.${test.name}`,
				{},
				'completed',
			);
		},
	);
	it('covers every registered operation', () => {
		expect(cases.map((t) => t.name).sort()).toEqual(
			Object.keys(deeplineEndpointSchemas).sort(),
		);
	});
	it.each(cases)('$name rejects a malformed success response', async (test) => {
		fetchMock.mockResolvedValueOnce(reply({ unrelated: true }));
		await expect(test.call()).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
	it.each(['.', '..'])(
		'rejects dot path segment %s before HTTP',
		async (id) => {
			await expect(endpoints.tools.get(ctx, { toolId: id })).rejects.toThrow();
			await expect(endpoints.plays.get(ctx, { name: id })).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);
	it('accepts the compact run, legacy full detail and watch snapshot envelopes', () => {
		for (const value of [
			run,
			{ status: 'running', package: run },
			{ runId: 'run-1', snapshot: { status: 'running' } },
		]) {
			expect(deeplineEndpointSchemas['runs.get'].output.parse(value)).toEqual(
				value,
			);
		}
	});
	it('preserves pending billing and provider output without inventing a final charge', async () => {
		const value = {
			status: 'success',
			toolResponse: { rawV2: [{ score: 1 }] },
			billing: {
				pricing_status: 'pending',
				settlement_status: 'requires_recovery',
			},
		};
		fetchMock.mockResolvedValueOnce(reply(value));
		expect(
			await endpoints.tools.execute(ctx, { toolId: 'lookup', payload: {} }),
		).toEqual(value);
	});
	it.each([
		{ rows: [], scope: { kind: 'database' } },
		{ rows: [], scope: { kind: 'run', runId: 'wrong' } },
		{ rows: [{ runId: 'wrong' }], scope: { kind: 'run', runId: 'wanted' } },
		{ rows: [] },
	])('refuses unconfirmed or foreign run exports', async (value) => {
		fetchMock.mockResolvedValueOnce(reply(value));
		await expect(
			endpoints.datasets.rows(ctx, {
				playName: 'demo',
				tableNamespace: 'result.rows',
				runId: 'wanted',
			}),
		).rejects.toThrow('did not confirm');
	});
	it('validates spend limits, idempotency keys and mutually exclusive filters before HTTP', async () => {
		const invalid = [
			() => endpoints.plays.run(ctx, { name: 'demo', maxCredits: 0 }),
			() =>
				endpoints.plays.run(ctx, { name: 'demo', waitForCompletionMs: 15001 }),
			() =>
				endpoints.tools.execute(ctx, {
					toolId: 'lookup',
					payload: {},
					idempotencyKey: 'invalid key',
				}),
			() => endpoints.billing.usage(ctx, { request_id: 'r', run_id: 'run' }),
			() => endpoints.runs.history(ctx, { type: 'plays' }),
			() => endpoints.tools.search(ctx, { limit: 51 }),
		];
		for (const call of invalid) await expect(call()).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('marks both dispatch operations destructive and all reads read', () => {
		const meta = deepline().endpointMeta;
		for (const [name, entry] of Object.entries(meta ?? {}))
			expect(entry.riskLevel).toBe(
				['plays.run', 'tools.execute'].includes(name) ? 'destructive' : 'read',
			);
	});
});
it('accepts the native execution envelope observed in the live API', async () => {
	const response = {
		job_id: 'request-1',
		status: 'completed',
		result: { data: { rows: [], row_count: 0 } },
		billing: {
			credits_charged: 0,
			cost_usd: 0,
			pricing_status: 'final',
			settlement_status: 'released',
		},
	};
	fetchMock.mockResolvedValueOnce(reply(response));
	expect(
		await endpoints.tools.execute(ctx, {
			toolId: 'free_simple_company_search',
			payload: { sql: 'SELECT company_name FROM companies LIMIT 1' },
		}),
	).toEqual(response);
	expect(
		deeplineEndpointSchemas['tools.execute'].output.safeParse({
			status: 'completed',
		}).success,
	).toBe(false);
	expect(
		deeplineEndpointSchemas['tools.execute'].output.safeParse({
			status: 'running',
			job_id: 'request-1',
		}).success,
	).toBe(true);
});
describe('HTTP errors and retries', () => {
	it.each([400, 401, 402, 403, 404, 409, 410, 422, 500, 503])(
		'returns a sanitized ApiError for HTTP %s without retrying',
		async (status) => {
			fetchMock.mockResolvedValueOnce(
				reply(
					{
						error: {
							code: 'FAIL',
							message: 'secret-key lead@example.com',
							payload: { api_key: 'secret-key' },
						},
					},
					status,
				),
			);
			let caught: unknown;
			try {
				await endpoints.tools.execute(ctx, {
					toolId: 'lookup',
					payload: { email: 'lead@example.com' },
				});
			} catch (e) {
				caught = e;
			}
			expect(caught).toBeInstanceOf(ApiError);
			expect((caught as ApiError).status).toBe(status);
			expect(
				JSON.stringify(caught) + String((caught as Error).stack),
			).not.toMatch(/secret-key|lead@example|tenant-resolved-key/);
			expect(fetchMock).toHaveBeenCalledTimes(1);
		},
	);
	it('does not retry an uncertain network failure on a write', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		await expect(endpoints.plays.run(ctx, { name: 'demo' })).rejects.toThrow(
			'fetch failed',
		);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
	it('honors Retry-After once in core without stacking plugin retries', async () => {
		fetchMock
			.mockResolvedValueOnce(
				reply({ error: 'rate limited' }, 429, { 'Retry-After': '0' }),
			)
			.mockResolvedValueOnce(reply({ tools: [] }));
		expect(await endpoints.tools.list(ctx, {})).toEqual({ tools: [] });
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(await errorHandlers.RATE_LIMIT_ERROR.handler()).toEqual({
			maxRetries: 0,
		});
	});
	it('keeps HTTP error identity and retry metadata intact', async () => {
		const error = new ApiError(
			{ method: 'GET', url: '/api/v2/tools' },
			{
				url: 'https://code.deepline.com/api/v2/tools',
				ok: false,
				status: 429,
				statusText: 'rate limit',
				body: {},
			},
			'rate limit',
			{ retryAfter: 123 },
		);
		// Non-HTTP thrown errors also pass through without being wrapped.
		const network = new Error('network unavailable');
		fetchMock.mockRejectedValueOnce(network);
		await expect(makeDeeplineRequest('/api/v2/tools', 'key')).rejects.toBe(
			network,
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		expect(error.retryAfter).toBe(123);
	});
});
