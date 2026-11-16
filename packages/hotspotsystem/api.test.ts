import type { HotspotSystemContext } from './index';
import { hotspotsystem } from './index';

/**
 * Live smoke test, against the real API.
 *
 * Skipped unless a key is present, and it prints why when it skips, so a
 * skipped run cannot be mistaken for a pass. Reads only, and few calls: the
 * documented limit is under 100 requests a minute.
 *
 * Generate a key in the Control Center under Tools & Settings > API Keys.
 */
const KEY = process.env.HOTSPOTSYSTEM_API_KEY;

describe('hotspotsystem live smoke', () => {
	if (!KEY) {
		console.warn(
			'Skipping HotspotSystem live smoke: set HOTSPOTSYSTEM_API_KEY to run it.',
		);
	}
	const describeIfKey = KEY ? describe : describe.skip;

	// unknown: a stand-in for a context whose type brings the whole key manager.
	const ctx = {
		key: KEY,
		$getAccountId: async () => 'live',
	} as unknown as HotspotSystemContext;

	const plugin = hotspotsystem({ key: KEY });
	const endpoints = plugin.endpoints as NonNullable<typeof plugin.endpoints>;
	const schemas = plugin.endpointSchemas as Record<
		string,
		{ output: { parse: (value: unknown) => unknown } }
	>;

	/**
	 * Parses a live answer through the operation's own output schema, which is
	 * the contract a caller receives. Asserting on a hand-written type would let
	 * a wrong field pass both this suite and the fixtures.
	 */
	function parseWith<T>(operation: string, value: T): T {
		const schema = schemas[operation]?.output;
		if (!schema) throw new Error(`No output schema for ${operation}`);
		schema.parse(value);
		return value;
	}

	describeIfKey('ping.check', () => {
		it('answers pong', async () => {
			const result = await endpoints.ping.check(ctx, {});
			parseWith('ping.check', result);
			expect(result.ping).toBe('pong');
		});
	});

	describeIfKey('me.get', () => {
		it('reports the resource owner', async () => {
			const result = await endpoints.me.get(ctx, {});
			parseWith('me.get', result);
			expect(result.userId ?? result.operator).toBeTruthy();
		});
	});

	describeIfKey('locations.list', () => {
		it('returns a paged list with the documented envelope', async () => {
			const result = await endpoints.locations.list(ctx, {
				fields: ['id', 'name'],
				limit: 5,
			});
			parseWith('locations.list', result);

			expect(Array.isArray(result.items)).toBe(true);
			// `metadata.total_count` is the full result length, so it is at least
			// the page.
			if (result.metadata?.total_count !== undefined) {
				expect(result.metadata.total_count).toBeGreaterThanOrEqual(
					result.items.length,
				);
			}
			for (const location of result.items) {
				expect(location.id ?? location.name).toBeTruthy();
			}
		});

		it('reads the picker options, which carry no paging', async () => {
			const result = await endpoints.locations.options(ctx, {});
			parseWith('locations.options', result);
			expect(Array.isArray(result.items)).toBe(true);
		});

		it('reads one location\'s vouchers when a location exists', async () => {
			const list = await endpoints.locations.list(ctx, { limit: 1 });
			const first = list.items[0];
			if (!first?.id) return;

			const vouchers = await endpoints.locations.vouchers(ctx, {
				location_id: first.id,
				limit: 5,
			});
			parseWith('locations.vouchers', vouchers);
			expect(Array.isArray(vouchers.items)).toBe(true);
		});
	});

	describeIfKey('account-wide reads', () => {
		it('lists vouchers', async () => {
			const result = await endpoints.vouchers.list(ctx, { limit: 5 });
			parseWith('vouchers.list', result);
			expect(Array.isArray(result.items)).toBe(true);
		});

		it('lists paid transactions', async () => {
			const result = await endpoints.transactions.paid(ctx, { limit: 5 });
			parseWith('transactions.paid', result);
			expect(Array.isArray(result.items)).toBe(true);
		});
	});
});
