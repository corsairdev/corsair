import { AuthMissingError } from 'corsair/core';
import { worksnaps, worksnapsEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof worksnaps>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'projects.create',
	'projects.delete',
	'projects.get',
	'projects.list',
	'projects.update',
	'reports.project',
	'reports.summary',
	'taskAssignments.create',
	'taskAssignments.delete',
	'taskAssignments.list',
	'tasks.create',
	'tasks.delete',
	'tasks.get',
	'tasks.list',
	'tasks.update',
	'timeEntries.byUser',
	'timeEntries.create',
	'timeEntries.delete',
	'timeEntries.get',
	'timeEntries.list',
	'timeEntries.update',
	'userAssignments.create',
	'userAssignments.get',
	'userAssignments.list',
	'userAssignments.update',
	'users.create',
	'users.get',
	'users.list',
	'users.me',
	'users.update',
];

describe('worksnaps plugin definition', () => {
	const plugin = worksnaps();

	it('registers as worksnaps with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('worksnaps');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the thirty catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('declares a schema and an output schema for every operation', () => {
		const schemas = plugin.endpointSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual(operations);
		for (const operation of operations) {
			const schema = schemas[operation as keyof typeof schemas];
			expect(schema?.input).toBeDefined();
			expect(schema?.output).toBeDefined();
		}
	});

	it('declares metadata with a risk level and description for every operation', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const operation of operations) {
			const entry = meta[operation as keyof typeof meta];
			expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			expect((entry?.description ?? '').length).toBeGreaterThan(10);
		}
	});

	it('marks the deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual([
			'projects.delete',
			'taskAssignments.delete',
			'tasks.delete',
			'timeEntries.delete',
		]);
	});

	it('marks logging time as a write, since it changes what a report totals', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['timeEntries.create' as keyof typeof meta]?.riskLevel).toBe(
			'write',
		);
	});

	it('notes that creating a user needs the partner token', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['users.create' as keyof typeof meta]?.description).toContain(
			'partner',
		);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(worksnapsEndpointSchemas['projects.list'].input).toBeDefined();
		expect(Object.keys(worksnapsEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since logged time changes with every entry', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('worksnaps key builder', () => {
	const plugin = worksnaps();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(worksnaps({ key: 'from-options' }), keyContext(null)),
		).resolves.toBe('from-options');
	});

	it('falls back to the stored api_key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no key is available', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
