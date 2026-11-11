import { AuthMissingError } from 'corsair/core';
import { userflow, userflowEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof userflow>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'accounts.get',
	'accounts.list',
	'attributes.list',
	'content.get',
	'content.getVersion',
	'content.list',
	'content.listVersions',
	'contentSessions.delete',
	'contentSessions.end',
	'contentSessions.get',
	'contentSessions.list',
	'eventDefinitions.list',
	'events.track',
	'groups.delete',
	'groups.get',
	'groups.list',
	'groups.upsert',
	'invites.create',
	'invites.delete',
	'invites.get',
	'invites.list',
	'members.get',
	'members.list',
	'members.remove',
	'members.update',
	'memberships.remove',
	'users.delete',
	'users.get',
	'users.list',
	'users.upsert',
	'webhookSubscriptions.create',
	'webhookSubscriptions.delete',
	'webhookSubscriptions.get',
	'webhookSubscriptions.list',
	'webhookSubscriptions.update',
];

describe('userflow plugin definition', () => {
	const plugin = userflow();

	it('registers as userflow with api_key auth and no webhook handlers', () => {
		expect(plugin.id).toBe('userflow');
		expect(plugin.options?.authType).toBe('api_key');
		// Webhook subscriptions are managed through the API; receiving the
		// notifications is left to the host, since each subscription has its own
		// secret rather than one workspace-wide signing key.
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the thirty-five catalog operations', () => {
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

	it('marks the unrecoverable deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual([
			'contentSessions.delete',
			'groups.delete',
			'invites.delete',
			'members.remove',
			'users.delete',
			'webhookSubscriptions.delete',
		]);
	});

	it('marks removing a membership as a write, since both sides survive', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['memberships.remove' as keyof typeof meta]?.riskLevel).toBe(
			'write',
		);
	});

	it('marks the two upserts as writes', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['users.upsert' as keyof typeof meta]?.riskLevel).toBe('write');
		expect(meta['groups.upsert' as keyof typeof meta]?.riskLevel).toBe('write');
	});

	it('marks every lookup as a read', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		expect(reads.sort()).toEqual([
			'accounts.get',
			'accounts.list',
			'attributes.list',
			'content.get',
			'content.getVersion',
			'content.list',
			'content.listVersions',
			'contentSessions.get',
			'contentSessions.list',
			'eventDefinitions.list',
			'groups.get',
			'groups.list',
			'invites.get',
			'invites.list',
			'members.get',
			'members.list',
			'users.get',
			'users.list',
			'webhookSubscriptions.get',
			'webhookSubscriptions.list',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(userflowEndpointSchemas['users.upsert'].input).toBeDefined();
		expect(Object.keys(userflowEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since users and sessions change constantly', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('userflow key builder', () => {
	const plugin = userflow();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(userflow({ key: 'from-options' }), keyContext(null)),
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
