import { AuthMissingError } from 'corsair/core';
import { gagelist, gagelistEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null, apiSecret: string | null = null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
			get_api_secret: jest.fn().mockResolvedValue(apiSecret),
		},
	};
}

const pair = (clientId: string, clientSecret: string) =>
	JSON.stringify({ clientId, clientSecret });

function buildKey(
	plugin: ReturnType<typeof gagelist>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.status',
	'calibrations.certificate',
	'calibrations.create',
	'calibrations.delete',
	'calibrations.get',
	'calibrations.list',
	'calibrations.update',
	'customFields.list',
	'customFields.updateValues',
	'gages.create',
	'gages.delete',
	'gages.get',
	'gages.list',
	'gages.update',
	'manufacturers.create',
	'manufacturers.delete',
	'manufacturers.list',
	'manufacturers.update',
];

describe('gagelist plugin definition', () => {
	const plugin = gagelist();

	it('registers as gagelist with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('gagelist');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares api_secret as an account credential field', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['api_secret'] },
		});
	});

	it('exposes exactly the catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'gages.list': 'read',
			'gages.get': 'read',
			'gages.create': 'write',
			'gages.update': 'write',
			'gages.delete': 'destructive',
			'calibrations.list': 'read',
			'calibrations.get': 'read',
			'calibrations.create': 'write',
			'calibrations.update': 'write',
			'calibrations.delete': 'destructive',
			'calibrations.certificate': 'read',
			'manufacturers.list': 'read',
			'manufacturers.create': 'write',
			'manufacturers.update': 'write',
			'manufacturers.delete': 'destructive',
			'customFields.list': 'read',
			'customFields.updateValues': 'write',
			'account.status': 'read',
		});
	});

	it('marks every delete destructive and irreversible, and nothing else', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual([
			'calibrations.delete',
			'gages.delete',
			'manufacturers.delete',
		]);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(gagelistEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(gagelistEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = gagelist({
			errorHandlers: {
				UPSTREAM_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('UPSTREAM_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('gagelist key builder', () => {
	it('prefers an explicit key option, with the stored secret', async () => {
		const ctx = keyContext('stored-key', 'stored-secret');

		await expect(buildKey(gagelist({ key: 'option-key' }), ctx)).resolves.toBe(
			pair('option-key', 'stored-secret'),
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('accepts a client pair set as options with nothing stored', async () => {
		await expect(
			buildKey(
				gagelist({ clientId: 'option-id', clientSecret: 'option-secret' }),
				keyContext(null),
			),
		).resolves.toBe(pair('option-id', 'option-secret'));
	});

	it('pairs the key option with the clientSecret option', async () => {
		await expect(
			buildKey(
				gagelist({ key: 'option-id', clientSecret: 'option-secret' }),
				keyContext(null),
			),
		).resolves.toBe(pair('option-id', 'option-secret'));
	});

	it('reads the stored client id and secret', async () => {
		await expect(
			buildKey(gagelist(), keyContext('stored-key', 'stored-secret')),
		).resolves.toBe(pair('stored-key', 'stored-secret'));
	});

	it('throws AuthMissingError when no client id is stored', async () => {
		await expect(
			buildKey(gagelist(), keyContext(null, 'stored-secret')),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when no secret is stored', async () => {
		await expect(
			buildKey(gagelist(), keyContext('stored-key')),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			gagelist().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
