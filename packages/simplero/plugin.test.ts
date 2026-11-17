import { AuthMissingError } from 'corsair/core';
import type { SimpleroKeyBuilderContext } from './index';
import { simplero, simpleroEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof simplero>,
	ctx: ReturnType<typeof keyContext>,
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	// A test fixture cannot be a full AccountKeyManager, which also needs
	// get_dek and issue_new_dek; only get_api_key is read here.
	return plugin.keyBuilder?.(
		ctx as unknown as SimpleroKeyBuilderContext, // unknown: partial fixture
		source,
	);
}

const operations = [
	'customers.addTag',
	'customers.adjustLeadScore',
	'customers.create',
	'customers.get',
	'customers.list',
	'customers.removeTag',
	'customers.update',
	'lists.create',
	'lists.get',
	'lists.list',
	'lists.update',
	'products.create',
	'products.get',
	'products.list',
	'products.update',
	'purchases.get',
	'purchases.list',
	'purchases.update',
	'subscriptions.get',
	'subscriptions.list',
	'subscriptions.resubscribe',
	'subscriptions.unsubscribe',
	'subscriptions.update',
	'tags.create',
	'tags.get',
	'tags.list',
	'tags.update',
];

describe('simplero plugin definition', () => {
	const plugin = simplero();

	it('registers as simplero with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('simplero');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twenty-seven catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
			expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
		}
	});

	it('marks no operation destructive, because nothing cannot be undone', () => {
		// Unsubscribe is reversible through resubscribe, and tag changes through
		// remove_tag, so none of these is destructive.
		const meta = plugin.endpointMeta ?? {};
		const destructive = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'destructive')
			.map(([name]) => name);
		expect(destructive).toEqual([]);
		expect(
			meta['subscriptions.unsubscribe' as keyof typeof meta]?.riskLevel,
		).toBe('write');
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(simpleroEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(simpleroEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last and puts caller handlers first', () => {
		const custom = simplero({
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
		expect(names).toContain('PERMISSION_ERROR');
	});
});

describe('simplero key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(simplero({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(simplero(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(simplero(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			buildKey(simplero(), keyContext('stored-key'), 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
