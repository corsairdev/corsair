import { AuthMissingError } from 'corsair/core';
import {
	servicenow,
	servicenowAuthConfig,
	servicenowEndpointSchemas,
} from './index';

const OPERATIONS = [
	'records.create',
	'records.delete',
	'records.get',
	'records.list',
	'records.update',
	'tables.list',
] as const;

/**
 * Nested `group -> function` maps, as the plugin registers them.
 * unknown: only the keys are walked, so the handler leaf type is never used.
 */
type NestedMap = Record<string, Record<string, unknown>>;

function flatten(tree: NestedMap): string[] {
	const paths: string[] = [];
	for (const [group, members] of Object.entries(tree)) {
		for (const name of Object.keys(members)) paths.push(`${group}.${name}`);
	}
	return paths.sort();
}

/**
 * unknown: `endpoints` and `endpointMeta` are optionals on `CorsairPlugin`, so
 * the assertions widen them one cast at a time.
 */
function asNested(value: unknown): NestedMap {
	return value as NestedMap;
}

describe('servicenow plugin definition', () => {
	const plugin = servicenow();
	// unknown: same widening as `asNested`, for the meta map.
	const meta = plugin.endpointMeta as unknown as Record<
		string,
		{ riskLevel: string; description: string; irreversible?: boolean }
	>;

	it('registers as servicenow with api_key auth', () => {
		expect(plugin.id).toBe('servicenow');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(servicenowAuthConfig)).toEqual(['api_key']);
	});

	it('declares the instance host as an account field', () => {
		// ServiceNow has no shared API host, so the resolver reads it per account.
		expect([...servicenowAuthConfig.api_key.account]).toContain('host');
	});

	it('declares no inbound webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});

	it('registers exactly the six operations', () => {
		expect(flatten(asNested(plugin.endpoints))).toEqual([...OPERATIONS]);
	});

	it('gives each operation the risk level its side effect calls for', () => {
		expect(Object.keys(meta).sort()).toEqual([...OPERATIONS]);
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'records.create': 'write',
			'records.delete': 'destructive',
			'records.get': 'read',
			'records.list': 'read',
			'records.update': 'write',
			'tables.list': 'read',
		});
	});

	it('marks the delete irreversible, because ServiceNow keeps no undo', () => {
		expect(meta['records.delete']?.irreversible).toBe(true);
		// A create and an update are undone by another call, so they are not.
		expect(meta['records.create']?.irreversible).toBeUndefined();
		expect(meta['records.update']?.irreversible).toBeUndefined();
	});

	it('describes every operation', () => {
		for (const entry of Object.values(meta)) {
			expect(entry.description.length).toBeGreaterThan(10);
		}
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(servicenowEndpointSchemas).sort()).toEqual([
			...OPERATIONS,
		]);
		for (const schemas of Object.values(servicenowEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('rejects an invalid sysparm_display_value before sending', () => {
		const list = servicenowEndpointSchemas['records.list'];
		expect(
			list.input.safeParse({ table: 'incident', sysparm_display_value: 'all' })
				.success,
		).toBe(true);
		// Only "true", "false" and "all" are accepted by the API.
		expect(
			list.input.safeParse({ table: 'incident', sysparm_display_value: 'both' })
				.success,
		).toBe(false);
	});

	it('rejects a non-positive page size and a negative offset', () => {
		const list = servicenowEndpointSchemas['records.list'];
		expect(
			list.input.safeParse({ table: 'incident', sysparm_limit: 0 }).success,
		).toBe(false);
		expect(
			list.input.safeParse({ table: 'incident', sysparm_offset: -1 }).success,
		).toBe(false);
		expect(
			list.input.safeParse({ table: 'incident', sysparm_offset: 0 }).success,
		).toBe(true);
	});

	it('requires a well-formed sys_id on get, update and delete', () => {
		const valid = '9d385017c611228701d22104cc95c371';
		const withFields = {
			table: 'incident',
			sys_id: valid,
			fields: { state: '2' },
		};

		for (const op of ['records.get', 'records.delete'] as const) {
			const schema = servicenowEndpointSchemas[op];
			expect(
				schema.input.safeParse({ table: 'incident', sys_id: valid }).success,
			).toBe(true);
			expect(
				schema.input.safeParse({ table: 'incident', sys_id: 'short' }).success,
			).toBe(false);
		}

		// `records.update` takes the same sys_id plus a fields map, so it needs
		// the same boundary checked with that map present.
		const update = servicenowEndpointSchemas['records.update'];
		expect(update.input.safeParse(withFields).success).toBe(true);
		expect(
			update.input.safeParse({ ...withFields, sys_id: 'short' }).success,
		).toBe(false);
	});

	it('requires a fields map on create and update', () => {
		expect(
			servicenowEndpointSchemas['records.create'].input.safeParse({
				table: 'incident',
			}).success,
		).toBe(false);
		expect(
			servicenowEndpointSchemas['records.update'].input.safeParse({
				table: 'incident',
				sys_id: '9d385017c611228701d22104cc95c371',
			}).success,
		).toBe(false);
	});

	it('keeps DEFAULT last when a caller adds a handler', () => {
		const custom = servicenow({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});

		expect(names.at(-1)).toBe('DEFAULT');
		expect(names.indexOf('QUOTA_ERROR')).toBeLessThan(names.indexOf('DEFAULT'));
	});
});

describe('servicenow key builder', () => {
	function ctx(stored: string | null, storedHost: string | null = 'acme') {
		return {
			authType: 'api_key' as const,
			options: {},
			tenantId: 'default',
			keys: {
				get_api_key: jest.fn().mockResolvedValue(stored),
				get_host: jest.fn().mockResolvedValue(storedHost),
			},
		};
	}

	const PAIR = JSON.stringify({ username: 'admin', password: 'pw' });

	it('prefers an explicit key without reading the store', async () => {
		const fixture = ctx(PAIR);

		const key = await servicenow({ key: 'explicit' }).keyBuilder?.(
			fixture as never,
			'endpoint',
		);

		expect(key).toBe('explicit');
		expect(fixture.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored credential pair', async () => {
		await expect(
			servicenow().keyBuilder?.(ctx(PAIR) as never, 'endpoint'),
		).resolves.toBe(PAIR);
	});

	it('throws AuthMissingError when no pair is stored', async () => {
		await expect(
			servicenow().keyBuilder?.(ctx(null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	// A stored pair with no instance cannot reach anything, so it has to read
	// as "not connected" for Corsair to offer a connect link.
	it('throws AuthMissingError when a pair is stored but no instance is', async () => {
		await expect(
			servicenow().keyBuilder?.(ctx(PAIR, null) as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('accepts a stored pair when the instance comes from the host option', async () => {
		await expect(
			servicenow({ host: 'acme' }).keyBuilder?.(
				ctx(PAIR, null) as never,
				'endpoint',
			),
		).resolves.toBe(PAIR);
	});

	it('refuses a webhook source, because there are no webhooks', async () => {
		await expect(
			servicenow().keyBuilder?.(ctx(PAIR) as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
