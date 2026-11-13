import { AuthMissingError } from 'corsair/core';
import { respondio, respondioEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof respondio>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'contacts.addTags',
	'contacts.channels',
	'contacts.create',
	'contacts.delete',
	'contacts.deleteTags',
	'contacts.get',
	'contacts.lifecycle',
	'contacts.list',
	'contacts.merge',
	'contacts.update',
	'contacts.upsert',
	'conversations.assign',
	'conversations.status',
	'messages.comment',
	'messages.get',
	'messages.list',
	'messages.send',
	'space.getUser',
	'space.listChannels',
	'space.listClosingNotes',
	'space.listCustomFields',
	'space.listTemplates',
	'space.listUsers',
];

describe('respondio plugin definition', () => {
	const plugin = respondio();

	it('registers as respondio with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('respondio');
		expect(plugin.options?.authType).toBe('api_key');
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

	it('marks contact deletion and merging as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		// A merge removes the second contact, so it destroys a record too.
		expect(destructive.sort()).toEqual(['contacts.delete', 'contacts.merge']);
	});

	it('marks contact deletion and merging as irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.irreversible === true,
		);

		// Neither the deleted history nor the merged-away contact comes back.
		expect(irreversible.sort()).toEqual(['contacts.delete', 'contacts.merge']);
	});

	it('marks messages.send as a write, since it reaches the customer', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['messages.send' as keyof typeof meta]?.riskLevel).toBe('write');
	});

	it('marks the space lookups as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		const spaceOps = operations.filter((operation) =>
			operation.startsWith('space.'),
		);

		for (const operation of spaceOps) {
			expect(meta[operation as keyof typeof meta]?.riskLevel).toBe('read');
		}
	});

	it('exports the endpoint schema map for the host', () => {
		expect(respondioEndpointSchemas['contacts.get'].input).toBeDefined();
		expect(Object.keys(respondioEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since messages arrive continuously', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('respondio key builder', () => {
	const plugin = respondio();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(respondio({ key: 'from-options' }), keyContext(null)),
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
