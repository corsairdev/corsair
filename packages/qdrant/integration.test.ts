// Skipped unless QDRANT_URL and QDRANT_API_KEY are set:
//   docker run -p 6333:6333 -e QDRANT__SERVICE__API_KEY=test-key qdrant/qdrant
//   QDRANT_URL=http://localhost:6333 QDRANT_API_KEY=test-key pnpm test integration
import { qdrantEndpointsNested as q } from './endpoints';
import type { QdrantContext } from './index';

const url = process.env.QDRANT_URL;
const apiKey = process.env.QDRANT_API_KEY;
const describeLive = url && apiKey ? describe : describe.skip;

const ctx = {
	key: apiKey ?? '',
	options: { baseUrl: url },
	$getAccountId: async () => 'live-test',
} as unknown as QdrantContext;

const suffix = Math.random().toString(36).slice(2, 8);
const docs = `corsair_docs_${suffix}`;
const alias = `corsair_alias_${suffix}`;
const collectionName = docs;

describeLive('Qdrant live API', () => {
	beforeAll(() =>
		jest.spyOn(console, 'warn').mockImplementation(() => undefined),
	);
	afterAll(() =>
		q.collections.delete(ctx, { collectionName }).catch(() => undefined),
	);

	it('creates and configures a hybrid collection', async () => {
		await expect(
			q.collections.create(ctx, {
				collectionName,
				vectors: { dense: { size: 2, distance: 'Dot' } },
				sparse_vectors: { bm25: { modifier: 'idf' } },
			}),
		).resolves.toBe(true);
		await expect(
			q.collections.exists(ctx, { collectionName }),
		).resolves.toEqual({ exists: true });
		const { collections } = await q.collections.list(ctx, {});
		expect(collections.map((c) => c.name)).toContain(docs);
		await expect(
			q.collections.update(ctx, {
				collectionName,
				optimizers_config: { indexing_threshold: 20000 },
			}),
		).resolves.toBe(true);
		for (const [field_name, field_schema] of [
			['city', 'keyword'],
			['rank', 'integer'],
		] as const) {
			await expect(
				q.payloadIndexes.create(ctx, {
					collectionName,
					field_name,
					field_schema,
				}),
			).resolves.toMatchObject({ status: 'completed' });
		}
	});

	it('writes points and reads them back', async () => {
		await q.points.upsert(ctx, {
			collectionName,
			points: [1, 2, 3].map((id) => ({
				id,
				vector: { dense: [id, 1], bm25: { indices: [id], values: [1] } },
				payload: { city: id === 3 ? 'London' : 'Berlin', rank: id },
			})),
		});
		const [point] = await q.points.get(ctx, {
			collectionName,
			ids: [1],
			with_vector: true,
		});
		expect(point?.vector).toEqual({
			dense: [1, 1],
			bm25: { indices: [1], values: [1] },
		});

		const first = await q.points.scroll(ctx, { collectionName, limit: 2 });
		const rest = await q.points.scroll(ctx, {
			collectionName,
			offset: first.next_page_offset ?? undefined,
		});
		expect([...first.points, ...rest.points].map((p) => p.id)).toEqual([
			1, 2, 3,
		]);

		const ordered = await q.points.scroll(ctx, {
			collectionName,
			order_by: { key: 'rank', direction: 'desc' },
		});
		expect(ordered.points.map((p) => p.id)).toEqual([3, 2, 1]);
		await expect(
			q.points.count(ctx, {
				collectionName,
				filter: { must: [{ key: 'city', match: { value: 'Berlin' } }] },
			}),
		).resolves.toEqual({ count: 2 });
	});

	it('searches: dense, hybrid fusion, batch, groups and facets', async () => {
		const dense = await q.query.points(ctx, {
			collectionName,
			query: [3, 1],
			using: 'dense',
			limit: 1,
		});
		expect(dense.points[0]?.id).toBe(3);
		const hybrid = await q.query.points(ctx, {
			collectionName,
			prefetch: [
				{ query: { indices: [2], values: [1] }, using: 'bm25' },
				{ query: [2, 1], using: 'dense' },
			],
			query: { fusion: 'rrf' },
		});
		expect(hybrid.points[0]?.id).toBe(2);
		const batch = await q.query.batch(ctx, {
			collectionName,
			searches: [
				{ query: [1, 1], using: 'dense', limit: 1 },
				{ query: 1, using: 'dense', limit: 2 },
			],
		});
		expect(batch.map((r) => r.points.length)).toEqual([1, 2]);
		const { groups } = await q.query.groups(ctx, {
			collectionName,
			query: [1, 1],
			using: 'dense',
			group_by: 'city',
		});
		expect(groups.map((g) => g.id).sort()).toEqual(['Berlin', 'London']);
		await expect(
			q.query.facet(ctx, { collectionName, key: 'city', exact: true }),
		).resolves.toEqual({
			hits: [
				{ value: 'Berlin', count: 2 },
				{ value: 'London', count: 1 },
			],
		});
	});

	it('edits payloads and vectors', async () => {
		await q.points.setPayload(ctx, {
			collectionName,
			payload: { tag: 'x' },
			points: [1],
		});
		await q.points.deletePayload(ctx, {
			collectionName,
			keys: ['tag'],
			points: [1],
		});
		await q.points.overwritePayload(ctx, {
			collectionName,
			payload: { city: 'Paris' },
			filter: { must: [{ has_id: [2] }] },
		});
		await q.points.clearPayload(ctx, { collectionName, points: [3] });
		await q.points.updateVectors(ctx, {
			collectionName,
			points: [{ id: 3, vector: { dense: [9, 9] } }],
		});
		await q.points.deleteVectors(ctx, {
			collectionName,
			vector: ['bm25'],
			points: [3],
		});
		const points = await q.points.get(ctx, {
			collectionName,
			ids: [1, 2, 3],
			with_payload: true,
			with_vector: true,
		});
		expect(points.map(({ id, payload }) => [id, payload])).toEqual([
			[1, { city: 'Berlin', rank: 1 }],
			[2, { city: 'Paris' }],
			[3, {}],
		]);
		expect(points[2]?.vector).toEqual({ dense: [9, 9] });
	});

	it('manages aliases and snapshots', async () => {
		await q.aliases.update(ctx, {
			actions: [{ create_alias: { collection_name: docs, alias_name: alias } }],
		});
		await expect(
			q.aliases.listForCollection(ctx, { collectionName }),
		).resolves.toEqual({
			aliases: [{ alias_name: alias, collection_name: docs }],
		});
		expect((await q.aliases.list(ctx, {})).aliases).toContainEqual({
			alias_name: alias,
			collection_name: docs,
		});
		await expect(
			q.points.count(ctx, { collectionName: alias }),
		).resolves.toEqual({ count: 3 });
		await expect(
			q.aliases.update(ctx, {
				actions: [{ delete_alias: { alias_name: alias } }],
			}),
		).resolves.toBe(true);

		const snapshot = await q.snapshots.create(ctx, { collectionName });
		expect(
			(await q.snapshots.list(ctx, { collectionName })).map((s) => s.name),
		).toContain(snapshot.name);
		await expect(
			q.snapshots.delete(ctx, { collectionName, snapshotName: snapshot.name }),
		).resolves.toBe(true);
	});

	it('surfaces Qdrant’s reason, then cleans up', async () => {
		await expect(
			q.query.points(ctx, { collectionName, query: [1], using: 'dense' }),
		).rejects.toMatchObject({
			status: 400,
			message: expect.stringContaining('Vector dimension error'),
		});
		await q.points.delete(ctx, { collectionName, points: [1] });
		await q.payloadIndexes.delete(ctx, { collectionName, fieldName: 'city' });
		const info = await q.collections.get(ctx, { collectionName });
		expect(info.points_count).toBe(2);
		expect(Object.keys(info.payload_schema)).toEqual(['rank']);
		await expect(q.collections.delete(ctx, { collectionName })).resolves.toBe(
			true,
		);
		await expect(q.collections.delete(ctx, { collectionName })).resolves.toBe(
			false,
		);
	});
});
