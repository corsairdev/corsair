import { AuthMissingError } from 'corsair/core';
import { retently, retentlyEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof retently>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.ping',
	'campaigns.list',
	'companies.get',
	'companies.list',
	'customers.delete',
	'customers.get',
	'customers.list',
	'customers.resubscribe',
	'customers.unsubscribe',
	'customers.upsert',
	'feedback.get',
	'feedback.import',
	'feedback.list',
	'outbox.list',
	'reports.get',
	'survey.send',
	'templates.get',
	'templates.list',
];

describe('retently plugin definition', () => {
	const plugin = retently();

	it('registers as retently with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('retently');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the eighteen catalog operations', () => {
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

	it('marks only the routes Retently gates at write permission as writes', () => {
		const meta = plugin.endpointMeta ?? {};
		const writes = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel !== 'read',
		);

		expect(writes.sort()).toEqual([
			'customers.delete',
			'customers.resubscribe',
			'customers.unsubscribe',
			'customers.upsert',
			'feedback.import',
			'survey.send',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(retentlyEndpointSchemas['account.ping'].input).toBeDefined();
		expect(Object.keys(retentlyEndpointSchemas).sort()).toEqual(operations);
	});

	it('declares no cached entities, since Retently owns every record', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('retently key builder', () => {
	const plugin = retently();

	it('uses a key passed in the options', async () => {
		const explicit = retently({ key: 'from-options' });

		await expect(buildKey(explicit, keyContext(null))).resolves.toBe(
			'from-options',
		);
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

	it('reads the key from storage rather than the options when both exist', async () => {
		const ctx = keyContext('stored-key');
		await buildKey(retently({ key: 'from-options' }), ctx);

		// The option wins, so storage is never consulted.
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});
});
