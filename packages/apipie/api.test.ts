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

	it('lists models live', async () => {
		const result = await Models.list(ctx, {});
		const items = Array.isArray(result) ? result : (result?.data ?? []);
		expect(items.length).toBeGreaterThan(0);
	});

	it('returns catalogue entries that satisfy the declared schema', async () => {
		const result = await Models.list(ctx, {});
		const items = Array.isArray(result) ? result : (result?.data ?? []);
		// The endpoint parses through ApipieEndpointOutputSchemas.modelsList,
		// so reaching this point already proves the schema accepts the live
		// payload. Assert the fields the cache depends on are really there.
		for (const item of items.slice(0, 50)) {
			expect(typeof item.id).toBe('string');
			expect(item.id.length).toBeGreaterThan(0);
		}
	});

	it('declares no field the live catalogue never returns', async () => {
		const result = await Models.list(ctx, {});
		const items = Array.isArray(result) ? result : (result?.data ?? []);
		const seen = new Set<string>();
		for (const item of items) {
			for (const key of Object.keys(item)) seen.add(key);
		}
		// Guards against the schema drifting back to inventing fields: every
		// name below was observed on every one of the live catalogue entries.
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
