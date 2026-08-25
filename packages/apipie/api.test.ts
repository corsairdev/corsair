import { Models } from './endpoints';
import type { ApipieContext } from './index';

/**
 * Live suite. Excluded from CI by path (`api.test.ts`); run it against the
 * real API with:
 *
 *   APIPIE_API_KEY=sk-pie… pnpm --filter @corsair-dev/apipie test
 *
 * Read-only: it only lists the model catalogue, so it neither bills the
 * account nor changes any remote state. The billable operations
 * (`chat.createCompletion`, `embeddings.create`, `images.generate`) are
 * deliberately not exercised here.
 */
const TEST_API_KEY = process.env.APIPIE_API_KEY;
const describeIfApiKey = TEST_API_KEY ? describe : describe.skip;

/** Minimal plugin context for live endpoint calls. */
function testCtx(key: string): ApipieContext {
	return { key } as ApipieContext;
}

describeIfApiKey('Apipie live API (requires APIPIE_API_KEY)', () => {
	const ctx = testCtx(TEST_API_KEY ?? '');

	/** Fetched once and shared: the catalogue is large and does not change mid-run. */
	let items: Awaited<ReturnType<typeof Models.list>> extends infer R
		? R extends { data?: infer D }
			? NonNullable<D>
			: never
		: never;

	beforeAll(async () => {
		const result = await Models.list(ctx, {});
		items = (
			Array.isArray(result) ? result : (result?.data ?? [])
		) as typeof items;
	});

	it('lists models live', () => {
		expect(items.length).toBeGreaterThan(0);
	});

	it('returns catalogue entries that satisfy the declared schema', () => {
		// Reaching here already proves the schema accepted the live payload, since
		// the endpoint parses through ApipieEndpointOutputSchemas.modelsList.
		expect(items.length).toBeGreaterThan(0);
		for (const item of items.slice(0, 50)) {
			expect(typeof item.id).toBe('string');
			expect(item.id.length).toBeGreaterThan(0);
		}
	});

	it('declares no field the live catalogue never returns', () => {
		// Assert non-empty first so an empty catalogue reports that directly
		// rather than surfacing as a pile of missing-field failures.
		expect(items.length).toBeGreaterThan(0);
		const seen = new Set<string>();
		for (const item of items) {
			for (const key of Object.keys(item)) seen.add(key);
		}
		// Every name below was observed on all 1217 live catalogue entries.
		for (const field of [
			'id',
			'model',
			'provider',
			'type',
			'route',
			'latency',
			'query_count',
			'max_tokens',
		]) {
			expect(seen.has(field)).toBe(true);
		}
	});

	it('lists detailed models live', async () => {
		const result = await Models.listDetailed(ctx, {});
		expect(result?.data?.length ?? 0).toBeGreaterThan(0);
	});
});
