import type { QdrantContext } from './index';
import { qdrant } from './index';
import { mockFetch } from './test-harness';

afterEach(() => jest.restoreAllMocks());

type RawEndpoint = (
	ctx: QdrantContext,
	input: Record<string, unknown>,
) => Promise<unknown>;
const endpoints = qdrant().endpoints as unknown as Record<
	string,
	Record<string, RawEndpoint>
>;

const BASE = 'https://qdrant.test:6333';

function call(
	operation: string,
	input: Record<string, unknown>,
	ctxOverrides = {},
) {
	const [group = '', name = ''] = operation.split('.');
	const events: Record<string, unknown>[] = [];
	const ctx = {
		key: 'test-key',
		options: { baseUrl: BASE },
		$getAccountId: async () => 'account',
		database: {
			db: {
				insertInto: () => ({
					values: (values: Record<string, unknown>) => {
						events.push(values);
						return { execute: async () => undefined };
					},
				}),
			},
		},
		...ctxOverrides,
	} as unknown as QdrantContext;
	const output = endpoints[group]
		?.[name]?.(ctx, input)
		.catch((e: unknown) => e);
	return { output, events };
}

const done = { operation_id: 1, status: 'completed' };
const C = { collectionName: 'docs' };
const D = '/collections/docs';
const info = {
	status: 'green',
	optimizer_status: 'ok',
	segments_count: 1,
	config: {},
	payload_schema: {},
};
const vector = { dense: [0.1], bm25: { indices: [3], values: [1] } };

// [operation, method, path, input beyond collectionName, result, query].
// Without a query, GETs send none and writes send wait=true.
type Case = [
	string,
	string,
	string,
	Record<string, unknown>,
	unknown,
	Record<string, string>?,
];
// biome-ignore format: one endpoint per row
const cases: Case[] = [
	['collections.list', 'GET', '/collections', {}, { collections: [] }],
	['collections.get', 'GET', D, {}, info],
	['collections.exists', 'GET', `${D}/exists`, {}, { exists: true }],
	['collections.create', 'PUT', D, { vectors: { size: 4, distance: 'Dot', datatype: 'turbo4' }, timeout: 30 }, true, { timeout: '30' }],
	['collections.update', 'PATCH', D, { quantization_config: 'Disabled' }, true, {}],
	['collections.delete', 'DELETE', D, {}, false, {}],
	['aliases.list', 'GET', '/aliases', {}, { aliases: [] }],
	['aliases.listForCollection', 'GET', `${D}/aliases`, {}, { aliases: [] }],
	['aliases.update', 'POST', '/collections/aliases', { actions: [{ delete_alias: { alias_name: 'a' } }] }, true, {}],
	['payloadIndexes.create', 'PUT', `${D}/index`, { field_name: 'city', field_schema: 'keyword' }, done],
	['payloadIndexes.delete', 'DELETE', `${D}/index/meta.city`, { fieldName: 'meta.city' }, done],
	['points.upsert', 'PUT', `${D}/points`, { points: [{ id: 1, vector }], update_mode: 'insert_only', timeout: 9 }, done, { wait: 'true', timeout: '9' }],
	['points.get', 'POST', `${D}/points`, { ids: [1], consistency: 'majority' }, [{ id: 1 }], { consistency: 'majority' }],
	['points.delete', 'POST', `${D}/points/delete`, { filter: { must: [] }, wait: false }, done, { wait: 'false' }],
	['points.scroll', 'POST', `${D}/points/scroll`, { limit: 2, offset: 3 }, { points: [], next_page_offset: null }, {}],
	['points.count', 'POST', `${D}/points/count`, { exact: true }, { count: 3 }, {}],
	['points.setPayload', 'POST', `${D}/points/payload`, { payload: { a: 1 }, key: 'meta', points: [1] }, done],
	['points.overwritePayload', 'PUT', `${D}/points/payload`, { payload: { a: 1 }, points: [1] }, done],
	['points.deletePayload', 'POST', `${D}/points/payload/delete`, { keys: ['a'], points: [1] }, done],
	['points.clearPayload', 'POST', `${D}/points/payload/clear`, { points: [1] }, done],
	['points.updateVectors', 'PUT', `${D}/points/vectors`, { points: [{ id: 1, vector }] }, done],
	['points.deleteVectors', 'POST', `${D}/points/vectors/delete`, { vector: ['bm25'], points: [1] }, done],
	['query.points', 'POST', `${D}/points/query`, { prefetch: [{ query: [0.1], using: 'dense' }], query: { fusion: 'rrf' }, lookup_from: { collection: 'o', shard_key: 'eu' } }, { points: [{ id: 1, version: 1, score: 0.9 }] }, {}],
	['query.batch', 'POST', `${D}/points/query/batch`, { searches: [{ query: 1 }] }, [{ points: [] }], {}],
	['query.groups', 'POST', `${D}/points/query/groups`, { query: [0.1], group_by: 'doc' }, { groups: [] }, {}],
	['query.facet', 'POST', `${D}/facet`, { key: 'city' }, { hits: [] }, {}],
	['snapshots.list', 'GET', `${D}/snapshots`, {}, []],
	['snapshots.create', 'POST', `${D}/snapshots`, {}, { name: 's.snapshot', size: 1 }],
	['snapshots.delete', 'DELETE', `${D}/snapshots/s.snapshot`, { snapshotName: 's.snapshot' }, true],
];

describe('Qdrant endpoints', () => {
	it('has a case for every endpoint', () => {
		expect(cases.map(([name]) => name).sort()).toEqual(
			Object.keys(qdrant().endpointMeta ?? {}).sort(),
		);
	});

	it.each(
		cases.map(
			([op, method, path, extra, result, query]) =>
				[
					op,
					method,
					path,
					extra,
					result,
					query ?? (method === 'GET' ? {} : { wait: 'true' }),
				] as const,
		),
	)('%s sends %s', async (operation, method, path, extra, result, query) => {
		const requests = mockFetch({ body: { result } });
		await expect(call(operation, { ...C, ...extra }).output).resolves.toEqual(
			result,
		);
		expect(requests).toHaveLength(1);
		const [request] = requests;
		const { fieldName: _f, snapshotName: _s, ...rest } = extra;
		const body = Object.fromEntries(
			Object.entries(rest).filter(([k]) => !(k in query)),
		);
		expect(request?.method).toBe(method);
		expect(`${request?.url.origin}${request?.url.pathname}`).toBe(
			`${BASE}${path}`,
		);
		expect(Object.fromEntries(request?.url.searchParams ?? [])).toEqual(query);
		expect(request?.headers['api-key']).toBe('test-key');
		expect(request?.body).toEqual(
			method === 'GET' || method === 'DELETE' ? undefined : body,
		);
	});

	it.each([
		[
			'points.delete',
			{ points: [1], filter: {} },
			'Provide exactly one of `points` or `filter`',
		],
		[
			'points.overwritePayload',
			{ payload: {}, key: 'meta', points: [1] },
			'use points.setPayload with `key`',
		],
		['points.upsert', { points: [{ id: -1, vector: [1] }] }, 'Too small'],
		[
			'points.upsert',
			{ points: [{ id: 1, vector: [1] }], update_mode: 'merge' },
			'Invalid option',
		],
		['snapshots.delete', { snapshotName: '..' }, 'Must not be `.` or `..`'],
	])('%s rejects %j before sending', async (operation, input, message) => {
		const requests = mockFetch();
		expect(String(await call(operation, { ...C, ...input }).output)).toContain(
			message,
		);
		expect(requests).toHaveLength(0);
	});

	it('URL-encodes path parameters', async () => {
		const requests = mockFetch({ body: { result: done } });
		await call('payloadIndexes.delete', {
			collectionName: 'a b/c',
			fieldName: 'x/y',
		}).output;
		expect(requests[0]?.url.pathname).toBe(
			'/collections/a%20b%2Fc/index/x%2Fy',
		);
	});

	it('reads the cluster URL from the account, and fails without one', async () => {
		const requests = mockFetch({ body: { result: { collections: [] } } });
		await call(
			'collections.list',
			{},
			{ options: {}, keys: { get_base_url: async () => `${BASE}/` } },
		).output;
		expect(requests[0]?.url.href).toBe(`${BASE}/collections`);

		const missing = call(
			'collections.list',
			{},
			{ options: {}, keys: { get_base_url: async () => null } },
		);
		expect(String(await missing.output)).toContain(
			'A Qdrant base URL is required',
		);
		expect(requests).toHaveLength(1);
	});

	it('logs completed and failed calls with only the collection name', async () => {
		mockFetch(
			{ body: { result: done } },
			{ status: 404, body: { status: { error: 'Not found' } } },
		);
		const ok = call('points.upsert', {
			...C,
			points: [{ id: 1, vector: [0.1], payload: { secret: 'x' } }],
		});
		await ok.output;
		const failed = call('collections.get', C);
		await failed.output;
		expect(
			[...ok.events, ...failed.events].map((e) => [
				e.event_type,
				e.status,
				e.payload,
			]),
		).toEqual([
			['qdrant.points.upsert', 'completed', C],
			['qdrant.collections.get', 'failed', C],
		]);
	});

	it('returns the result even when logging fails', async () => {
		jest.spyOn(console, 'warn').mockImplementation(() => undefined);
		mockFetch({ body: { result: true } });
		const broken = {
			db: {
				insertInto: () => {
					throw new Error('db down');
				},
			},
		};
		await expect(
			call('collections.delete', C, { database: broken }).output,
		).resolves.toBe(true);
	});
});
