import { AuthMissingError } from 'corsair/core';
import { uptimeRobotEndpointSchemas, uptimerobot } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof uptimerobot>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.me',
	'incidents.addComment',
	'incidents.comments',
	'incidents.get',
	'incidents.list',
	'maintenanceWindows.create',
	'maintenanceWindows.delete',
	'maintenanceWindows.list',
	'maintenanceWindows.update',
	'monitorGroups.create',
	'monitorGroups.delete',
	'monitorGroups.list',
	'monitors.create',
	'monitors.delete',
	'monitors.get',
	'monitors.list',
	'monitors.pause',
	'monitors.reset',
	'monitors.start',
	'monitors.update',
	'stats.monitorUptime',
	'stats.responseTime',
	'stats.uptime',
	'statusPages.announcements',
	'statusPages.create',
	'statusPages.createAnnouncement',
	'statusPages.delete',
	'statusPages.get',
	'statusPages.list',
	'tags.delete',
	'tags.list',
];

describe('uptimerobot plugin definition', () => {
	const plugin = uptimerobot();

	it('registers as uptimerobot with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('uptimerobot');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the thirty-one catalog operations', () => {
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

	it('marks the unrecoverable deletes and the stats reset destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual([
			'maintenanceWindows.delete',
			'monitorGroups.delete',
			'monitors.delete',
			'monitors.reset',
			'statusPages.delete',
			'tags.delete',
		]);
	});

	it('marks pause and start as writes, since they stop and resume alerting', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const operation of ['monitors.pause', 'monitors.start']) {
			expect(meta[operation as keyof typeof meta]?.riskLevel).toBe('write');
		}
	});

	it('marks every read as a read', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		expect(reads.sort()).toEqual([
			'account.me',
			'incidents.comments',
			'incidents.get',
			'incidents.list',
			'maintenanceWindows.list',
			'monitorGroups.list',
			'monitors.get',
			'monitors.list',
			'stats.monitorUptime',
			'stats.responseTime',
			'stats.uptime',
			'statusPages.announcements',
			'statusPages.get',
			'statusPages.list',
			'tags.list',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(uptimeRobotEndpointSchemas['monitors.list'].input).toBeDefined();
		expect(Object.keys(uptimeRobotEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a status changes with every check', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('uptimerobot key builder', () => {
	const plugin = uptimerobot();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(uptimerobot({ key: 'from-options' }), keyContext(null)),
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
