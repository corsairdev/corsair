import {
	HookdeckEndpointInputSchemas,
	HookdeckEndpointOutputSchemas,
} from './endpoints/types';
import { HookdeckSchema } from './schema';

const connectionFixture = {
	id: 'web_1',
	team_id: 'tm_1',
	name: 'shopify-my-api',
	full_name: 'shopify -> shopify-my-api',
	disabled_at: null,
	paused_at: null,
	created_at: '2026-01-01T00:00:00.000Z',
	updated_at: '2026-01-01T00:00:00.000Z',
};

describe('Hookdeck schema', () => {
	it('declares a semver version', () => {
		expect(HookdeckSchema.version).toBeDefined();
		expect(HookdeckSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an entities map', () => {
		expect(typeof HookdeckSchema.entities).toBe('object');
		expect(HookdeckSchema.entities).not.toBeNull();
		expect(Array.isArray(Object.keys(HookdeckSchema.entities))).toBe(true);
		for (const entity of Object.values(HookdeckSchema.entities)) {
			expect(entity).toBeDefined();
		}
	});
});

// Per .github/PLUGIN_PR_RULES.md (R2), every implemented endpoint
// needs a corresponding test.

describe('Hookdeck connections input schemas', () => {
	it('connections.list accepts cursor pagination', () => {
		expect(
			HookdeckEndpointInputSchemas.connectionsList.parse({
				limit: 50,
				next: 'web_abc',
				order_by: 'created_at',
				dir: 'desc',
			}),
		).toEqual({
			limit: 50,
			next: 'web_abc',
			order_by: 'created_at',
			dir: 'desc',
		});
		expect(HookdeckEndpointInputSchemas.connectionsList.parse({})).toEqual({});
	});

	it('connections.list rejects limits above the provider maximum', () => {
		expect(
			HookdeckEndpointInputSchemas.connectionsList.safeParse({ limit: 251 })
				.success,
		).toBe(false);
		expect(
			HookdeckEndpointInputSchemas.connectionsList.safeParse({ dir: 'up' })
				.success,
		).toBe(false);
	});

	it('connections.create requires a name', () => {
		expect(
			HookdeckEndpointInputSchemas.connectionsCreate.parse({
				name: 'shopify-my-api',
			}),
		).toEqual({ name: 'shopify-my-api' });
		expect(
			HookdeckEndpointInputSchemas.connectionsCreate.safeParse({}).success,
		).toBe(false);
	});

	it('connections.get and connections.delete require an id', () => {
		expect(
			HookdeckEndpointInputSchemas.connectionsGet.parse({ id: 'web_1' }),
		).toEqual({ id: 'web_1' });
		expect(
			HookdeckEndpointInputSchemas.connectionsGet.safeParse({}).success,
		).toBe(false);
		expect(
			HookdeckEndpointInputSchemas.connectionsDelete.parse({ id: 'web_1' }),
		).toEqual({ id: 'web_1' });
		expect(
			HookdeckEndpointInputSchemas.connectionsDelete.safeParse({}).success,
		).toBe(false);
	});

	it('connections.update requires an id and accepts mutable fields', () => {
		expect(
			HookdeckEndpointInputSchemas.connectionsUpdate.parse({
				id: 'web_1',
				name: 'renamed',
			}),
		).toEqual({ id: 'web_1', name: 'renamed' });
		expect(
			HookdeckEndpointInputSchemas.connectionsUpdate.safeParse({}).success,
		).toBe(false);
	});
});

describe('Hookdeck connections output schemas', () => {
	it('connections.list parses the paginated envelope', () => {
		const parsed = HookdeckEndpointOutputSchemas.connectionsList.parse({
			models: [connectionFixture],
			count: 1,
			pagination: {
				order_by: 'created_at',
				dir: 'desc',
				limit: 100,
				next: 'web_2',
			},
		});
		expect(parsed.count).toBe(1);
		expect(parsed.models).toHaveLength(1);
		expect(parsed.pagination?.next).toBe('web_2');
	});

	it('single-connection outputs parse the connection object', () => {
		for (const schema of [
			HookdeckEndpointOutputSchemas.connectionsCreate,
			HookdeckEndpointOutputSchemas.connectionsGet,
			HookdeckEndpointOutputSchemas.connectionsUpdate,
		]) {
			expect(schema.parse(connectionFixture).id).toBe('web_1');
			expect(schema.safeParse({}).success).toBe(false);
		}
	});

	it('connections.delete parses the id envelope', () => {
		expect(
			HookdeckEndpointOutputSchemas.connectionsDelete.parse({ id: 'web_1' }),
		).toEqual({ id: 'web_1' });
		expect(
			HookdeckEndpointOutputSchemas.connectionsDelete.safeParse({}).success,
		).toBe(false);
	});
});
