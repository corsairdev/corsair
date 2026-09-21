import { makeBooqableRequest } from './client';
import { BooqableEndpointOutputSchemas } from './endpoints/types';
import { booqable, booqableEndpointSchemas } from './index';

// Test-only helpers: `unknown` is intentional here — these walk the opaque
// nested endpoint tree, narrowing each level with typeof checks instead of
// `any`, so no narrower shared type exists for the walk.
function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

describe('Booqable plugin shape', () => {
	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = booqable();
		// Test-only view: `unknown` leaves are intentional — helpers above
		// narrow each node via typeof checks instead of using `any`.
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(49);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(49);
		expect(Object.keys(booqableEndpointSchemas)).toHaveLength(49);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(booqableEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
	});

	it('uses api_key auth with tenant_external_id account field', () => {
		const plugin = booqable();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

const liveApiKey = process.env.BOOQABLE_API_KEY;
const liveCompanySlug = process.env.BOOQABLE_COMPANY_SLUG;

// The live check runs only when credentials are provided via environment
// variables, otherwise it is skipped so CI stays hermetic. Keys must never
// be hardcoded (R6) — pass them as env vars when running locally.
const describeLive = liveApiKey && liveCompanySlug ? describe : describe.skip;

describeLive('Booqable live API', () => {
	it('lists users against the real API and validates the response contract', async () => {
		// Narrowed after the env guard above; returns early when skipped.
		if (!liveApiKey || !liveCompanySlug) return;

		const payload = await makeBooqableRequest(
			'/users',
			liveApiKey,
			liveCompanySlug,
			{ method: 'GET', query: { 'page[size]': 1 } },
		);
		const parsed = BooqableEndpointOutputSchemas.listUsers.parse(payload);

		expect(Array.isArray(parsed.data)).toBe(true);
		expect(parsed.data.length).toBeLessThanOrEqual(1);
	}, 60000);
});
