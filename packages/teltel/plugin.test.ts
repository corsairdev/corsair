import { AuthMissingError } from 'corsair/core';
import { teltel, teltelEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof teltel>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.balance',
	'calls.create',
	'calls.list',
	'campaigns.action',
	'campaigns.create',
	'campaigns.delete',
	'campaigns.get',
	'campaigns.list',
	'campaigns.update',
	'contactGroups.contacts',
	'contactGroups.create',
	'contactGroups.delete',
	'contactGroups.get',
	'contactGroups.list',
	'contactGroups.update',
	'contacts.create',
	'contacts.createBulk',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'contacts.update',
	'inbox.get',
	'inbox.list',
	'numberCountries.get',
	'numberCountries.list',
	'numbers.get',
	'numbers.list',
	'numbers.update',
	'priceGroups.list',
	'sms.send',
	'sms.sendBulk',
	'smsReports.get',
	'smsReports.list',
	'users.list',
];

describe('teltel plugin definition', () => {
	const plugin = teltel();

	it('registers as teltel with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('teltel');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 34 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(34);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks deletes, sends and dials destructive, and deletes irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([name]) => name)
			.sort();

		// R8: sends and calls bill the account and reach people; starting a
		// campaign sends to every contact in its groups.
		expect(destructive).toEqual([
			'calls.create',
			'campaigns.action',
			'campaigns.delete',
			'contactGroups.delete',
			'contacts.delete',
			'sms.send',
			'sms.sendBulk',
		]);
		for (const name of [
			'campaigns.delete',
			'contactGroups.delete',
			'contacts.delete',
		] as const) {
			expect(meta[name]?.irreversible).toBe(true);
		}
	});

	it('registers a schema for every operation, in both directions', () => {
		expect(Object.keys(teltelEndpointSchemas).sort()).toEqual(operations);
	});

	it('declares entities: {} because the plugin stores nothing', () => {
		expect(plugin.schema).toBeDefined();
		expect(Array.isArray(plugin.schema?.entities)).toBe(false);
		expect(plugin.schema?.entities).toEqual({});
	});

	it('builds error handlers with DEFAULT last', () => {
		expect(Object.keys(plugin.errorHandlers ?? {}).at(-1)).toBe('DEFAULT');
	});
});

describe('teltel keyBuilder', () => {
	const plugin = teltel();

	it('prefers the inline key over the stored one', async () => {
		const inline = teltel({ key: 'inline-key' });
		const ctx = keyContext('stored-key');

		await expect(buildKey(inline, ctx)).resolves.toBe('inline-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
