import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import * as db from './endpoints/db';
import * as runs from './endpoints/runs';
import type { DeeplineContext } from './index';
import { runsMeta, runsSchemas } from './registry-runs';

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
// Response bodies are arbitrary JSON fixtures, including deliberately malformed
// ones, so the helper takes unknown; a stricter type would block those cases.
function reply(value: unknown, status = 200) {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
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
function requestAt(index: number) {
	const [url, init] = fetchMock.mock.calls[index] as [string, RequestInit];
	return { url: new URL(url), init };
}
const lastRequest = () => requestAt(fetchMock.mock.calls.length - 1);
const RUN = 'play/prebuilt/demo/run/1';
const RUN_PATH = 'play%2Fprebuilt%2Fdemo%2Frun%2F1';

const stopResult = {
	runId: RUN,
	state: 'stopped',
	stopped: true,
	hitlCancelledCount: 0,
};
// Live shapes observed 2026-11-17 are marked (live).
const cases = [
	{
		name: 'runs.list',
		call: () =>
			runs.list(ctx, { play: 'prebuilt/demo', status: 'failed', limit: 2 }),
		path: '/api/v2/runs',
		query: {
			play: 'prebuilt/demo',
			status: 'failed',
			limit: '2',
			compact: 'true',
		},
		// (live) play filter adds playName/definitionName.
		response: {
			playName: 'prebuilt/demo',
			definitionName: 'prebuilt/demo',
			runs: [
				{
					workflowId: RUN,
					runId: RUN,
					status: 'Failed',
					type: 'Workflow',
					executionTime: '2.5s',
					memo: { orgId: 'org', playName: 'demo', userId: null },
				},
			],
			total: 1,
			offset: 0,
			limit: 2,
			hasMore: false,
		},
	},
	{
		name: 'runs.status',
		call: () => runs.status(ctx, { runId: RUN }),
		path: `/api/v2/runs/${RUN_PATH}/status`,
		response: { available: false, runId: RUN }, // (live)
	},
	{
		name: 'runs.input',
		call: () => runs.input(ctx, { runId: RUN }),
		path: `/api/v2/runs/${RUN_PATH}/input`,
		response: {
			runId: RUN,
			input: { domain: 'example.com' },
			bytes: 24,
			sha256: null,
			replayedFromRunId: null,
		},
	},
	{
		name: 'runs.receipts',
		call: () => runs.receipts(ctx, { runId: RUN, keys: ['k1', 'k2'] }),
		path: `/api/v2/runs/${RUN_PATH}/receipts/results`,
		method: 'POST',
		body: { keys: ['k1', 'k2'] },
		response: {
			runId: RUN,
			receipts: [
				{
					receiptKey: 'k1',
					status: 'completed',
					result: { status: 'completed', toolResponse: { ok: true } },
				},
				{
					receiptKey: 'k2',
					error: { code: 'RECEIPT_EXPIRED', message: 'expired' },
				},
			],
		},
	},
	{
		name: 'runs.events',
		call: () =>
			runs.events(ctx, {
				since: '2026-11-17T07:00:00.000Z',
				until: '2026-11-17T08:00:00.000Z',
				kind: 'step.failed',
				jsonpath: '$.level == "error"',
				includePayloads: true,
				limit: 2,
				cursor: 'next',
			}),
		path: '/api/v2/runs/events',
		query: {
			since: '2026-11-17T07:00:00.000Z',
			until: '2026-11-17T08:00:00.000Z',
			kind: 'step.failed',
			jsonpath: '$.level == "error"',
			payloads: 'true',
			limit: '2',
			cursor: 'next',
		},
		response: {
			events: [
				{
					eventId: 'e1',
					occurredAt: '2026-11-17T07:30:00.000Z',
					ingestedAt: '2026-11-17T07:30:01.000Z',
					runId: RUN,
					playName: 'demo',
					kind: 'step.failed',
					level: 'error',
					message: null,
					searchDoc: {},
				},
			],
			nextCursor: null,
			since: '2026-11-17T07:00:00.000Z',
			until: '2026-11-17T08:00:00.000Z',
		},
	},
	{
		name: 'runs.billing',
		call: () => runs.billing(ctx, { runIds: [RUN, 'other run'] }),
		path: '/api/v2/runs/billing',
		query: { runId: 'other run' }, // repeated key; checked separately below
		response: {
			runs: [
				{ runId: RUN, credits: 3, settling: false },
				{ runId: 'other run', settling: false }, // (live)
			],
		},
	},
	{
		name: 'runs.stop',
		call: () => runs.stop(ctx, { runId: RUN, reason: 'stale lock' }),
		path: `/api/v2/runs/${RUN_PATH}/stop`,
		method: 'POST',
		body: { reason: 'stale lock' },
		response: stopResult,
	},
	{
		name: 'runs.stopAll',
		call: () => runs.stopAll(ctx, { reason: 'cleanup' }),
		path: '/api/v2/runs/stop-all',
		method: 'POST',
		body: { reason: 'cleanup' },
		response: {
			stopped: 1,
			failed: 0,
			skipped: 0,
			runs: [{ ...stopResult, status: 'running' }],
		},
	},
	{
		name: 'runs.rerun',
		call: () =>
			runs.rerun(ctx, {
				runId: RUN,
				idempotencyKey: 'rerun:001',
				inputOverrides: { domain: 'example.org', limit: 5 },
			}),
		path: `/api/v2/runs/${RUN_PATH}/rerun`,
		method: 'POST',
		body: { inputOverrides: { domain: 'example.org', limit: 5 } },
		headers: { 'Idempotency-Key': 'rerun:001' },
		response: {
			runId: 'play/prebuilt/demo/run/2',
			replayedFromRunId: RUN,
			revisionId: null,
			status: 'queued',
			deduplicated: false,
			next: { inspect: 'deepline runs get x', input: 'deepline runs input x' },
		},
	},
	{
		name: 'runs.resume',
		call: () => runs.resume(ctx, { runId: RUN }),
		path: `/api/v2/runs/${RUN_PATH}/resume`,
		method: 'POST',
		body: {},
		response: { runId: RUN, resumed: true, epoch: 1 },
	},
	{
		name: 'db.query',
		call: () => db.query(ctx, { sql: 'select 1 as one', maxRows: 1 }),
		path: '/api/v2/db/query',
		method: 'POST',
		body: { sql: 'select 1 as one', max_rows: 1 },
		// (live)
		response: {
			command: 'SELECT',
			row_count: 1,
			row_count_returned: 1,
			truncated: false,
			columns: [{ name: 'one', table_id: 0, data_type_id: 23 }],
			rows: [{ one: 1 }],
			scope: { kind: 'database', mutability: 'current' },
		},
	},
];

describe('Deepline run control and customer DB contracts', () => {
	it.each(cases)(
		'$name sends the documented request and validates the result',
		async (test) => {
			fetchMock.mockResolvedValueOnce(reply(test.response));
			expect(await test.call()).toEqual(test.response);
			const { url, init } = lastRequest();
			expect(url.origin).toBe('https://code.deepline.com');
			expect(url.pathname).toBe(test.path);
			expect(init.method).toBe('method' in test ? test.method : 'GET');
			const headers = new Headers(init.headers);
			expect(headers.get('Authorization')).toBe('Bearer tenant-resolved-key');
			if ('query' in test)
				expect(Object.fromEntries(url.searchParams)).toEqual(test.query);
			if ('body' in test)
				expect(JSON.parse(String(init.body))).toEqual(test.body);
			else expect(init.body).toBeUndefined();
			if ('headers' in test)
				for (const [k, v] of Object.entries(test.headers ?? {}))
					expect(headers.get(k)).toBe(v);
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`deepline.${test.name}`,
				{},
				'completed',
			);
		},
	);
	it('covers every registered operation with schemas and meta', () => {
		const names = cases.map((t) => t.name).sort();
		expect(names).toEqual(Object.keys(runsSchemas).sort());
		expect(names).toEqual(Object.keys(runsMeta).sort());
	});
	it.each(cases)('$name rejects a malformed success response', async (test) => {
		fetchMock.mockResolvedValue(reply({ unrelated: true }));
		await expect(test.call()).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
	it('marks reads read and stops, reruns, resumes and SQL destructive', () => {
		const destructive = [
			'runs.stop',
			'runs.stopAll',
			'runs.rerun',
			'runs.resume',
			'db.query',
		];
		for (const [name, entry] of Object.entries(runsMeta))
			expect(entry.riskLevel).toBe(
				destructive.includes(name) ? 'destructive' : 'read',
			);
	});
});

describe('runs.list', () => {
	it('requires play, status or runId before HTTP', async () => {
		await expect(runs.list(ctx, {})).rejects.toThrow();
		await expect(runs.list(ctx, { limit: 5 })).rejects.toThrow();
		await expect(runs.list(ctx, { status: '  ' })).rejects.toThrow();
		await expect(
			runs.list(ctx, { status: 'failed', node: 'enrich' }),
		).rejects.toThrow('node requires play');
		await expect(
			runs.list(ctx, { status: 'failed', offset: 10 }),
		).rejects.toThrow('offset requires play');
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('filters by runId and node, and accepts the live empty page', async () => {
		const empty = { runs: [], total: 0, offset: 0, limit: 3, hasMore: false };
		fetchMock.mockResolvedValueOnce(reply(empty));
		expect(await runs.list(ctx, { runId: RUN })).toEqual(empty);
		expect(Object.fromEntries(lastRequest().url.searchParams)).toEqual({
			runId: RUN,
			compact: 'true',
		});
		fetchMock.mockResolvedValueOnce(reply(empty));
		await runs.list(ctx, { play: 'demo', node: 'enrich', offset: 0 });
		expect(Object.fromEntries(lastRequest().url.searchParams)).toEqual({
			play: 'demo',
			node: 'enrich',
			offset: '0',
			compact: 'true',
		});
	});
});

describe('runs.status', () => {
	it('accepts an available lifecycle snapshot', async () => {
		const value = {
			available: true,
			runId: RUN,
			lifecycle: {
				status: 'running',
				updatedAt: 2,
				startedAt: 1,
				finishedAt: null,
			},
			activity: null,
			steps: {
				observed: 2,
				running: 1,
				completed: 1,
				failed: 0,
				skipped: 0,
				confirmed: true,
			},
			mapStepWork: { sourceSteps: 1 },
			datasets: { observed: 1 },
			wait: { kind: null, until: null, confirmed: true },
		};
		fetchMock.mockResolvedValueOnce(reply(value));
		expect(await runs.status(ctx, { runId: RUN })).toEqual(value);
	});
});

describe('path segments', () => {
	it.each(['.', '..', ''])('rejects run id %j before HTTP', async (runId) => {
		for (const call of [
			() => runs.status(ctx, { runId }),
			() => runs.input(ctx, { runId }),
			() => runs.receipts(ctx, { runId, keys: ['k'] }),
			() => runs.stop(ctx, { runId }),
			() => runs.rerun(ctx, { runId, idempotencyKey: 'k' }),
			() => runs.resume(ctx, { runId }),
		])
			await expect(call()).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('encodes reserved characters in run ids', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({ available: false, runId: 'a b?#/c' }),
		);
		await runs.status(ctx, { runId: 'a b?#/c' });
		expect(lastRequest().url.pathname).toBe(
			'/api/v2/runs/a%20b%3F%23%2Fc/status',
		);
	});
});

describe('runs.receipts', () => {
	it('sends keys in batches of 100 and keeps their order', async () => {
		const keys = Array.from({ length: 205 }, (_, i) => `key-${i}`);
		const answer = (batch: string[]) =>
			reply({
				runId: RUN,
				receipts: batch.map((receiptKey) => ({
					receiptKey,
					error: { code: 'NOT_FOUND', message: 'missing' },
				})),
			});
		fetchMock
			.mockResolvedValueOnce(answer(keys.slice(0, 100)))
			.mockResolvedValueOnce(answer(keys.slice(100, 200)))
			.mockResolvedValueOnce(answer(keys.slice(200)));
		const result = await runs.receipts(ctx, { runId: RUN, keys });
		expect(result.receipts.map((r) => r.receiptKey)).toEqual(keys);
		expect(fetchMock).toHaveBeenCalledTimes(3);
		expect(
			[0, 1, 2].map(
				(i) => JSON.parse(String(requestAt(i).init.body)).keys.length,
			),
		).toEqual([100, 100, 5]);
	});
	it('refuses a page that answers different keys or another run', async () => {
		for (const value of [
			{ runId: 'other', receipts: [{ receiptKey: 'k1' }] },
			{ runId: RUN, receipts: [{ receiptKey: 'k2' }] },
			{ runId: RUN, receipts: [] },
		]) {
			fetchMock.mockResolvedValueOnce(reply(value));
			await expect(
				runs.receipts(ctx, { runId: RUN, keys: ['k1'] }),
			).rejects.toThrow('does not match');
		}
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
	it('rejects blank, oversized or control-character keys before HTTP', async () => {
		for (const keys of [
			[],
			[' '],
			['a\nb'],
			['a\0b'],
			['x'.repeat(2049)],
			Array.from({ length: 1001 }, (_, i) => `k${i}`),
		])
			await expect(runs.receipts(ctx, { runId: RUN, keys })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('runs.events', () => {
	it('lets the server default the time window (live empty page)', async () => {
		const value = {
			events: [],
			nextCursor: null,
			since: '2026-11-17T07:37:25.606Z',
			until: '2026-11-17T08:37:25.606Z',
		};
		fetchMock.mockResolvedValueOnce(reply(value));
		expect(await runs.events(ctx, { runId: RUN })).toEqual(value);
		expect(Object.fromEntries(lastRequest().url.searchParams)).toEqual({
			runId: RUN,
		});
	});
	it('validates timestamps, limits and jsonpath size before HTTP', async () => {
		for (const input of [
			{ since: 'yesterday' },
			{ limit: 201 },
			{ includePayloads: true, limit: 11 },
			{ jsonpath: 'x'.repeat(513) },
		])
			await expect(runs.events(ctx, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('runs.billing', () => {
	it('sends one repeated runId parameter per run', async () => {
		fetchMock.mockResolvedValueOnce(reply({ runs: [] }));
		await runs.billing(ctx, { runIds: ['a', 'b/c', 'a b'] });
		expect(lastRequest().url.searchParams.getAll('runId')).toEqual([
			'a',
			'b/c',
			'a b',
		]);
	});
	it('accepts 1 to 100 run ids', async () => {
		await expect(runs.billing(ctx, { runIds: [] })).rejects.toThrow();
		await expect(
			runs.billing(ctx, {
				runIds: Array.from({ length: 101 }, (_, i) => `r${i}`),
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('runs.stop and runs.stopAll', () => {
	it('sends an empty body without a reason', async () => {
		fetchMock.mockResolvedValueOnce(reply(stopResult));
		await runs.stop(ctx, { runId: RUN });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({});
	});
	it('accepts the live dry-run preview', async () => {
		const preview = {
			dryRun: true,
			scope: 'workspace',
			includesChildren: true,
			candidateCount: 0,
			truncated: false,
			runs: [],
		};
		fetchMock.mockResolvedValueOnce(reply(preview));
		expect(await runs.stopAll(ctx, { dryRun: true })).toEqual(preview);
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({
			dryRun: true,
		});
	});
	it('reports a server that ignored dryRun and stopped runs for real', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({ stopped: 2, failed: 0, skipped: 0, runs: [] }),
		);
		await expect(runs.stopAll(ctx, { dryRun: true })).rejects.toThrow(
			'performed a real stop-all',
		);
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
	it('never sends dryRun: false', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({ stopped: 0, failed: 0, skipped: 0, runs: [] }),
		);
		await runs.stopAll(ctx, { dryRun: false });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({});
	});
});

describe('runs.rerun', () => {
	const result = {
		runId: 'r2',
		replayedFromRunId: RUN,
		revisionId: 'rev',
		status: 'queued',
		next: {},
	};
	it('requires a caller-owned Idempotency-Key and sends it unchanged', async () => {
		await expect(
			runs.rerun(ctx, { runId: RUN } as unknown as Parameters<
				typeof runs.rerun
			>[1]),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
		fetchMock.mockResolvedValueOnce(reply(result));
		await runs.rerun(ctx, { runId: RUN, idempotencyKey: 'rerun-1' });
		expect(new Headers(requestAt(0).init.headers).get('Idempotency-Key')).toBe(
			'rerun-1',
		);
		expect(JSON.parse(String(requestAt(0).init.body))).toEqual({});
	});
	it('reuses the same key when core retries a 429', async () => {
		fetchMock
			.mockResolvedValueOnce(
				new Response(JSON.stringify({ error: 'slow down' }), {
					status: 429,
					headers: { 'Content-Type': 'application/json', 'Retry-After': '0' },
				}),
			)
			.mockResolvedValueOnce(reply(result));
		await runs.rerun(ctx, { runId: RUN, idempotencyKey: 'rerun-1' });
		expect(fetchMock).toHaveBeenCalledTimes(2);
		expect(new Headers(requestAt(0).init.headers).get('Idempotency-Key')).toBe(
			new Headers(requestAt(1).init.headers).get('Idempotency-Key'),
		);
	});
	it('rejects blank or whitespace keys and non-scalar overrides', async () => {
		for (const input of [
			{ runId: RUN, idempotencyKey: '' },
			{ runId: RUN, idempotencyKey: 'has space' },
			{ runId: RUN, inputOverrides: { nested: { a: 1 } } },
		])
			await expect(
				runs.rerun(ctx, input as Parameters<typeof runs.rerun>[1]),
			).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('db.query', () => {
	const ok = {
		command: 'INSERT',
		row_count: 1,
		row_count_returned: 0,
		truncated: false,
		columns: [],
		rows: [],
	};
	it('sends the operation key and requires the server to acknowledge it', async () => {
		const acked = {
			...ok,
			operation: {
				operation_key: 'op-1',
				completed_at_ms: 1,
				source: 'executed',
			},
		};
		fetchMock.mockResolvedValueOnce(reply(acked));
		expect(
			await db.query(ctx, {
				sql: "insert into storage.notes values ('a')",
				operationKey: 'op-1',
			}),
		).toEqual(acked);
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({
			sql: "insert into storage.notes values ('a')",
			operation_key: 'op-1',
		});
		for (const value of [
			ok,
			{ ...acked, operation: { ...acked.operation, operation_key: 'op-2' } },
		]) {
			fetchMock.mockResolvedValueOnce(reply(value));
			await expect(
				db.query(ctx, { sql: 'select 1', operationKey: 'op-1' }),
			).rejects.toThrow('did not confirm');
		}
	});
	it('validates SQL, maxRows and operationKey before HTTP', async () => {
		for (const input of [
			{ sql: '   ' },
			{ sql: 'select 1', maxRows: 0 },
			{ sql: 'select 1', maxRows: 1001 },
			{ sql: 'select 1', operationKey: ' ' },
			{ sql: 'select 1', operationKey: 'x'.repeat(513) },
		])
			await expect(db.query(ctx, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('does not retry SQL after a server error and keeps the error sanitized', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({ error: 'relation lead@example.com secret-key' }, 500),
		);
		let caught: unknown;
		try {
			await db.query(ctx, { sql: "select 'lead@example.com'" });
		} catch (e) {
			caught = e;
		}
		expect(caught).toBeInstanceOf(ApiError);
		expect(
			JSON.stringify(caught) + String((caught as Error).stack),
		).not.toMatch(/secret-key|lead@example|tenant-resolved-key/);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
