import { AuthMissingError } from 'corsair/core';
import { loops, loopsEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof loops>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'apikey.verifyConnection',
	'contacts.create',
	'contacts.delete',
	'contacts.find',
	'contacts.getSuppression',
	'contacts.listProperties',
	'contacts.update',
	'events.send',
	'lists.list',
	'transactional.send',
];

describe('Loops plugin definition', () => {
	const plugin = loops();

	it('registers as loops with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('loops');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the ten catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a schema pair', () => {
		expect(Object.keys(loopsEndpointSchemas).sort()).toEqual(operations);
		for (const entry of Object.values(loopsEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('marks the reads, writes and the delete for what they are', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const risks = Object.fromEntries(
			Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
		);
		expect(risks['apikey.verifyConnection']).toBe('read');
		expect(risks['contacts.find']).toBe('read');
		expect(risks['contacts.listProperties']).toBe('read');
		expect(risks['contacts.getSuppression']).toBe('read');
		expect(risks['lists.list']).toBe('read');
		expect(risks['contacts.create']).toBe('write');
		expect(risks['contacts.update']).toBe('write');
		expect(risks['events.send']).toBe('write');
		expect(risks['transactional.send']).toBe('write');
		expect(risks['contacts.delete']).toBe('destructive');
		expect(meta['contacts.delete']?.irreversible).toBe(true);
	});

	it('prefers the inline key over the stored one', async () => {
		const withInline = loops({ key: 'inline-key' });
		await expect(
			buildKey(withInline, keyContext('stored-key')),
		).resolves.toBe('inline-key');
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(loops(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		await expect(buildKey(loops(), keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
