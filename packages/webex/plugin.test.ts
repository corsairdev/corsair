import { AuthMissingError } from 'corsair/core';
import { webex, webexEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof webex>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'memberships.create',
	'memberships.delete',
	'memberships.list',
	'messages.create',
	'messages.delete',
	'messages.get',
	'messages.list',
	'messages.update',
	'people.get',
	'people.list',
	'people.me',
	'rooms.create',
	'rooms.delete',
	'rooms.get',
	'rooms.list',
	'rooms.update',
	'teamMemberships.create',
	'teamMemberships.delete',
	'teamMemberships.list',
	'teams.create',
	'teams.delete',
	'teams.get',
	'teams.list',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.get',
	'webhooks.list',
	'webhooks.update',
];

describe('webex plugin definition', () => {
	const plugin = webex();

	it('registers as webex with api_key auth and no webhook handlers', () => {
		expect(plugin.id).toBe('webex');
		expect(plugin.options?.authType).toBe('api_key');
		// Subscribing is managed through the API; receiving the deliveries and
		// checking the X-Spark-Signature header is the host's job.
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twenty-eight catalog operations', () => {
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
			'memberships.delete',
			'messages.delete',
			'rooms.delete',
			'teamMemberships.delete',
			'teams.delete',
			'webhooks.delete',
		]);
	});

	it('marks posting a message as a write, since it reaches people', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['messages.create' as keyof typeof meta]?.riskLevel).toBe(
			'write',
		);
	});

	it('marks the account lookup as a read', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['people.me' as keyof typeof meta]?.riskLevel).toBe('read');
	});

	it('exports the endpoint schema map for the host', () => {
		expect(webexEndpointSchemas['rooms.list'].input).toBeDefined();
		expect(Object.keys(webexEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a space changes with every message', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('webex key builder', () => {
	const plugin = webex();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(webex({ key: 'from-options' }), keyContext(null)),
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
