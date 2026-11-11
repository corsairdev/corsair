import { AuthMissingError } from 'corsair/core';
import { userlist, userlistEndpointSchemas } from './index';
import { userCreated } from './test-fixtures';
import { UserlistWebhooks } from './webhooks';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof userlist>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'companies.delete',
	'companies.upsert',
	'events.create',
	'messages.send',
	'relationships.delete',
	'relationships.upsert',
	'users.delete',
	'users.upsert',
];

describe('userlist plugin definition', () => {
	const plugin = userlist();

	it('registers as userlist with api_key auth and fourteen webhooks', () => {
		expect(plugin.id).toBe('userlist');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(plugin.webhooks ?? {})).toHaveLength(14);
	});

	it('exposes exactly the eight catalog operations', () => {
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

	it('has no reads at all, since the Push API only writes', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		expect(reads).toEqual([]);
	});

	it('marks only the two deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual(['companies.delete', 'users.delete']);
	});

	it('marks unlinking a relationship as a write, since both sides survive', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['relationships.delete' as keyof typeof meta]?.riskLevel).toBe(
			'write',
		);
	});

	it('matches a webhook body that names a handled topic', () => {
		const matched = plugin.pluginWebhookMatcher?.({
			headers: {},
			body: userCreated,
		} as never);
		expect(matched).toBe(true);
	});

	it('does not match a webhook body naming an unknown topic', () => {
		const matched = plugin.pluginWebhookMatcher?.({
			headers: {},
			body: { name: 'something_else' },
		} as never);
		expect(matched).toBe(false);
	});

	it('does not match a body that is not JSON', () => {
		const matched = plugin.pluginWebhookMatcher?.({
			headers: {},
			body: 'not json',
		} as never);
		expect(matched).toBe(false);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(userlistEndpointSchemas['users.upsert'].input).toBeDefined();
		expect(Object.keys(userlistEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since it never reads', () => {
		expect(plugin.schema?.entities).toEqual({});
	});

	it('registers each webhook handler under its topic', () => {
		expect(UserlistWebhooks.userCreated.match).toBeDefined();
		expect(UserlistWebhooks.messageReported.match).toBeDefined();
	});
});

describe('userlist key builder', () => {
	const plugin = userlist();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(userlist({ key: 'from-options' }), keyContext(null)),
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
