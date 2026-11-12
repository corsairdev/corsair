import { AuthMissingError } from 'corsair/core';
import { wrike, wrikeEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof wrike>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'comments.create',
	'comments.delete',
	'comments.list',
	'comments.task',
	'comments.update',
	'contacts.get',
	'contacts.list',
	'folders.create',
	'folders.delete',
	'folders.get',
	'folders.list',
	'folders.tasks',
	'folders.update',
	'tasks.create',
	'tasks.delete',
	'tasks.get',
	'tasks.list',
	'tasks.update',
	'timelogs.create',
	'timelogs.delete',
	'timelogs.list',
	'timelogs.task',
];

describe('wrike plugin definition', () => {
	const plugin = wrike();

	it('registers as wrike with api_key auth and no webhook handlers', () => {
		expect(plugin.id).toBe('wrike');
		expect(plugin.options?.authType).toBe('api_key');
		// Wrike has webhook routes, but this plugin does not implement them, so
		// there is nothing for it to receive.
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twenty-three catalog operations', () => {
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
			'comments.delete',
			'folders.delete',
			'tasks.delete',
			'timelogs.delete',
		]);
	});

	it('marks task creation as a write, since it creates work', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['tasks.create' as keyof typeof meta]?.riskLevel).toBe('write');
	});

	it('notes that a task delete goes to the recycle bin', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['tasks.delete' as keyof typeof meta]?.description).toContain(
			'recycle bin',
		);
	});

	it('says a folder delete takes the folder contents with it', () => {
		const meta = plugin.endpointMeta ?? {};
		const description =
			meta['folders.delete' as keyof typeof meta]?.description ?? '';
		expect(description).toContain('every folder and task inside it');
		expect(description).not.toContain('recursive');
	});

	it('exports the endpoint schema map for the host', () => {
		expect(wrikeEndpointSchemas['tasks.list'].input).toBeDefined();
		expect(Object.keys(wrikeEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a task changes as work progresses', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('wrike key builder', () => {
	const plugin = wrike();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(wrike({ key: 'from-options' }), keyContext(null)),
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
