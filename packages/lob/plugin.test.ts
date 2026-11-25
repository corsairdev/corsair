import { AuthMissingError } from 'corsair/core';
import { lob, lobEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof lob>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.getBalance',
	'addresses.create',
	'addresses.delete',
	'addresses.get',
	'addresses.list',
	'autocomplete.usAutocomplete',
	'intlVerifications.verify',
	'letters.get',
	'letters.send',
	'postcards.get',
	'postcards.send',
	'usVerifications.bulk',
	'usVerifications.verify',
	'zip.usZipLookup',
];

describe('lob plugin definition', () => {
	const plugin = lob();

	it('registers as lob with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('lob');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the fourteen catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
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
		).toEqual({
			'usVerifications.verify': 'read',
			'usVerifications.bulk': 'read',
			'intlVerifications.verify': 'read',
			'autocomplete.usAutocomplete': 'read',
			'zip.usZipLookup': 'read',
			'addresses.create': 'write',
			'addresses.get': 'read',
			'addresses.list': 'read',
			'addresses.delete': 'destructive',
			'postcards.send': 'destructive',
			'postcards.get': 'read',
			'letters.send': 'destructive',
			'letters.get': 'read',
			'account.getBalance': 'read',
		});
	});

	it('marks the physical sends and the delete irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of ['addresses.delete', 'postcards.send', 'letters.send']) {
			expect(meta[name as keyof typeof meta]).toMatchObject({
				irreversible: true,
			});
		}
		for (const [name, entry] of Object.entries(meta)) {
			if (entry.riskLevel !== 'destructive') {
				expect(entry.irreversible).toBeUndefined();
			}
			expect(name).toBeTruthy();
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(lobEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(lobEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = lob({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('lob key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(lob({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(lob(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(lob(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys, because Lob webhooks are not handled here', async () => {
		await expect(
			lob().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
