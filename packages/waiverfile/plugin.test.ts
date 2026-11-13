import { AuthMissingError } from 'corsair/core';
import { WAIVERFILE_WEBHOOK_TRIGGERS } from './endpoints/types';
import { waiverFileEndpointSchemas, waiverfile } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof waiverfile>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations: (keyof typeof waiverFileEndpointSchemas)[] = [
	'eventCategories.create',
	'eventCategories.delete',
	'eventCategories.list',
	'eventCategories.update',
	'events.byCategory',
	'events.byDateRange',
	'events.create',
	'events.delete',
	'events.inviteManagers',
	'events.removeManagers',
	'events.upcoming',
	'events.update',
	'events.waivers',
	'forms.active',
	'forms.all',
	'ping.check',
	'site.get',
	'subscribers.list',
	'subscribers.optedOut',
	'waivers.byReference',
	'waivers.data',
	'waivers.dataCount',
	'waivers.get',
	'waivers.getLite',
	'waivers.list',
	'waivers.listLite',
	'waivers.pageCount',
	'waivers.pdf',
	'waivers.search',
	'webhooks.subscribe',
	'webhooks.unsubscribe',
];

describe('waiverfile plugin definition', () => {
	const plugin = waiverfile();

	it('registers as waiverfile with api_key auth and no webhook handlers', () => {
		expect(plugin.id).toBe('waiverfile');
		expect(plugin.options?.authType).toBe('api_key');
		// Subscriptions are managed through the API; receiving the POSTs is the
		// host's job, since WaiverFile signs nothing to verify against.
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the thirty-two catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('declares a schema and an output schema for every operation', () => {
		const schemas = plugin.endpointSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual(operations);
		for (const operation of operations) {
			const schema = schemas[operation];
			expect(schema?.input).toBeDefined();
			expect(schema?.output).toBeDefined();
		}
	});

	it('declares metadata with a risk level and description for every operation', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const operation of operations) {
			const entry = meta[operation];
			expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			expect((entry?.description ?? '').length).toBeGreaterThan(10);
		}
	});

	it('marks the two deletes as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) => meta[operation]?.riskLevel === 'destructive',
		);

		expect(destructive.sort()).toEqual([
			'eventCategories.delete',
			'events.delete',
		]);
	});

	it('marks a PDF read as a read, despite the byte volume', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['waivers.pdf']?.riskLevel).toBe('read');
	});

	it('marks subscribing as a write, since it changes where data is sent', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['webhooks.subscribe']?.riskLevel).toBe('write');
		expect(meta['webhooks.unsubscribe']?.riskLevel).toBe('write');
	});

	it('lists twelve webhook triggers, each with a subscribe route', () => {
		expect(WAIVERFILE_WEBHOOK_TRIGGERS).toHaveLength(12);
		expect(new Set(WAIVERFILE_WEBHOOK_TRIGGERS).size).toBe(12);
		expect(WAIVERFILE_WEBHOOK_TRIGGERS).toContain('newwaiver');
		expect(WAIVERFILE_WEBHOOK_TRIGGERS).toContain('newevent');
	});

	it('exports the endpoint schema map for the host', () => {
		expect(waiverFileEndpointSchemas['waivers.get'].input).toBeDefined();
		expect(Object.keys(waiverFileEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since a waiver is an immutable record', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('waiverfile key builder', () => {
	const plugin = waiverfile();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(waiverfile({ key: 'from-options' }), keyContext(null)),
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
