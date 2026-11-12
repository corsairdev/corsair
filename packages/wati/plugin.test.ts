import { AuthMissingError } from 'corsair/core';
import { wati, watiEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof wati>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.credits',
	'broadcasts.get',
	'broadcasts.list',
	'broadcasts.recipients',
	'channels.list',
	'contacts.count',
	'contacts.create',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'conversations.list',
	'conversations.messages',
	'messages.sendFile',
	'messages.sendTemplate',
	'messages.sendText',
	'segments.evaluate',
	'segments.get',
	'segments.list',
	'templates.get',
	'templates.list',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
];

describe('wati plugin definition', () => {
	const plugin = wati();

	it('registers as wati with api_key auth and no webhook handlers', () => {
		expect(plugin.id).toBe('wati');
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

	it('marks only the two deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual(['contacts.delete', 'webhooks.delete']);
	});

	it('marks the three sends as writes, since each reaches a recipient', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const operation of [
			'messages.sendText',
			'messages.sendTemplate',
			'messages.sendFile',
		]) {
			expect(meta[operation as keyof typeof meta]?.riskLevel).toBe('write');
		}
	});

	it('marks evaluating a segment as a read, since it saves nothing', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['segments.evaluate' as keyof typeof meta]?.riskLevel).toBe(
			'read',
		);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(watiEndpointSchemas['contacts.list'].input).toBeDefined();
		expect(Object.keys(watiEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a conversation moves with every message', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('wati key builder', () => {
	const plugin = wati();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(wati({ key: 'from-options' }), keyContext(null)),
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
