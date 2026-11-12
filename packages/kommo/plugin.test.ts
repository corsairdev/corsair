import { AuthMissingError } from 'corsair/core';
import { kommo, kommoEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof kommo>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'companies.list',
	'contacts.create',
	'contacts.get',
	'contacts.list',
	'contacts.update',
	'leads.create',
	'leads.get',
	'leads.list',
	'leads.update',
	'pipelines.list',
	'tasks.create',
	'tasks.list',
	'users.list',
];

describe('kommo plugin definition', () => {
	const plugin = kommo();

	it('registers as kommo with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('kommo');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares subdomain as an account credential field', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['subdomain'] },
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
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'account.get': 'read',
			'leads.list': 'read',
			'leads.get': 'read',
			'leads.create': 'write',
			'leads.update': 'write',
			'contacts.list': 'read',
			'contacts.get': 'read',
			'contacts.create': 'write',
			'contacts.update': 'write',
			'companies.list': 'read',
			'tasks.list': 'read',
			'tasks.create': 'write',
			'pipelines.list': 'read',
			'users.list': 'read',
		});
	});

	it('marks nothing irreversible', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name);

		expect(irreversible).toEqual([]);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(kommoEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(kommoEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = kommo({
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

describe('kommo key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(kommo({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(kommo(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(kommo(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			kommo().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
