import { AuthMissingError } from 'corsair/core';
import { telnyx, telnyxEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof telnyx>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'availablePhoneNumbers.list',
	'callControlApplications.create',
	'callControlApplications.delete',
	'callControlApplications.get',
	'callControlApplications.list',
	'callControlApplications.update',
	'calls.create',
	'calls.get',
	'calls.hangup',
	'calls.speak',
	'messages.delete',
	'messages.get',
	'messages.send',
	'messagingProfiles.create',
	'messagingProfiles.delete',
	'messagingProfiles.get',
	'messagingProfiles.list',
	'messagingProfiles.update',
	'phoneNumbers.delete',
	'phoneNumbers.get',
	'phoneNumbers.list',
	'phoneNumbers.update',
];

const riskLevels = {
	'availablePhoneNumbers.list': 'read',
	'callControlApplications.create': 'write',
	'callControlApplications.delete': 'destructive',
	'callControlApplications.get': 'read',
	'callControlApplications.list': 'read',
	'callControlApplications.update': 'write',
	'calls.create': 'write',
	'calls.get': 'read',
	'calls.hangup': 'write',
	'calls.speak': 'write',
	'messages.delete': 'destructive',
	'messages.get': 'read',
	'messages.send': 'write',
	'messagingProfiles.create': 'write',
	'messagingProfiles.delete': 'destructive',
	'messagingProfiles.get': 'read',
	'messagingProfiles.list': 'read',
	'messagingProfiles.update': 'write',
	'phoneNumbers.delete': 'destructive',
	'phoneNumbers.get': 'read',
	'phoneNumbers.list': 'read',
	'phoneNumbers.update': 'write',
} as const;

describe('telnyx plugin definition', () => {
	const plugin = telnyx();

	it('registers as telnyx with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('telnyx');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 22 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(22);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual(riskLevels);
	});

	it('marks every delete destructive and irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const deletes = operations.filter((name) => name.endsWith('.delete'));
		expect(deletes).toEqual([
			'callControlApplications.delete',
			'messages.delete',
			'messagingProfiles.delete',
			'phoneNumbers.delete',
		]);
		for (const name of deletes) {
			expect(meta[name as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('treats hanging up and speaking as writes, not reads', () => {
		// Both change the live call, so a read-only caller must not reach them.
		const meta = plugin.endpointMeta ?? {};
		expect(meta['calls.hangup']?.riskLevel).toBe('write');
		expect(meta['calls.speak']?.riskLevel).toBe('write');
	});

	it('registers a schema for every operation, in both directions', () => {
		expect(Object.keys(telnyxEndpointSchemas).sort()).toEqual(operations);
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

describe('telnyx keyBuilder', () => {
	const plugin = telnyx();

	it('prefers the inline key over the stored one', async () => {
		const inline = telnyx({ key: 'inline-key' });
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
