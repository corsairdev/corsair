import { AuthMissingError } from 'corsair/core';
import { gatherup, gatherupEndpointSchemas } from './index';

// The key builder only reads authType and keys: the stored client ID
// (`api_key`) and the stored bearer token (`api_secret`).
function keyContext(apiKey: string | null, apiSecret: string | null = 'token') {
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

function buildKey(
	plugin: ReturnType<typeof gatherup>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'businesses.create',
	'businesses.deactivate',
	'businesses.delete',
	'businesses.get',
	'businesses.list',
	'businesses.reactivate',
	'businesses.search',
	'businesses.types',
	'businesses.update',
	'customers.create',
	'customers.delete',
	'customers.get',
	'customers.list',
	'customers.requestFeedback',
	'customers.update',
	'feedbacks.list',
];

describe('gatherup plugin definition', () => {
	const plugin = gatherup();

	it('registers as gatherup with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('gatherup');
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
			'businesses.list': 'read',
			'businesses.get': 'read',
			'businesses.search': 'read',
			'businesses.types': 'read',
			'businesses.create': 'write',
			'businesses.update': 'write',
			'businesses.deactivate': 'write',
			'businesses.reactivate': 'write',
			'businesses.delete': 'destructive',
			'customers.list': 'read',
			'customers.get': 'read',
			'customers.create': 'destructive',
			'customers.update': 'write',
			'customers.delete': 'destructive',
			'customers.requestFeedback': 'destructive',
			'feedbacks.list': 'read',
		});
	});

	it('marks only the two deletes irreversible', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual(['businesses.delete', 'customers.delete']);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(gatherupEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(gatherupEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = gatherup({
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

describe('gatherup key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(gatherup({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored client ID', async () => {
		await expect(buildKey(gatherup(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('accepts the clientId and apiKey options with nothing stored', async () => {
		const ctx = keyContext(null, null);

		await expect(
			buildKey(gatherup({ clientId: 'option-client', apiKey: 'tok' }), ctx),
		).resolves.toBe('option-client');
	});

	it('throws AuthMissingError when the client ID is stored without a token', async () => {
		await expect(
			buildKey(gatherup(), keyContext('stored-key', null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when no client ID is stored', async () => {
		await expect(buildKey(gatherup(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			gatherup().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
