import { AuthMissingError } from 'corsair/core';
import type { SuperchatKeyBuilderContext } from './index';
import { superchat, superchatEndpointSchemas } from './index';

/** The key builder only reads authType and keys. */
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof superchat>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as SuperchatKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'channels.get',
	'channels.list',
	'contactLists.addContact',
	'contactLists.create',
	'contactLists.delete',
	'contactLists.forContact',
	'contactLists.list',
	'contactLists.removeContact',
	'contacts.create',
	'contacts.delete',
	'contacts.get',
	'contacts.list',
	'contacts.search',
	'contacts.update',
	'conversations.get',
	'conversations.list',
	'conversations.messages',
	'conversations.update',
	'inboxes.get',
	'inboxes.list',
	'messages.get',
	'messages.send',
];

describe('superchat plugin definition', () => {
	const plugin = superchat();

	it('registers as superchat with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('superchat');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twenty-two catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(nested).toHaveLength(22);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks the contact delete irreversible and destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['contacts.delete' as keyof typeof meta]?.riskLevel).toBe(
			'destructive',
		);
		expect(meta['contacts.delete' as keyof typeof meta]?.irreversible).toBe(
			true,
		);
	});

	it('marks sending a message destructive, because it reaches a real person', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['messages.send' as keyof typeof meta]?.riskLevel).toBe(
			'destructive',
		);
	});

	it('marks removing a contact from a list a write, not a destructive call', () => {
		// The contact itself stays, so the effect is reversible by adding it back.
		const meta = plugin.endpointMeta ?? {};
		expect(
			meta['contactLists.removeContact' as keyof typeof meta]?.riskLevel,
		).toBe('write');
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(superchatEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(superchatEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = superchat({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names[0]).toBe('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('AUTH_ERROR');
		expect(names).toContain('NOT_FOUND_ERROR');
	});
});

describe('superchat key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(superchat({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(superchat(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(superchat(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			buildKey(superchat(), keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
