import { AuthMissingError } from 'corsair/core';
import { kontentai, kontentaiEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof kontentai>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'items.get',
	'items.list',
	'languages.list',
	'taxonomies.list',
	'types.get',
	'types.list',
];

describe('kontentai plugin definition', () => {
	const plugin = kontentai();

	it('registers as kontentai with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('kontentai');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and a read risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			// The Delivery API serves published content and cannot write.
			expect(entry.riskLevel).toBe('read');
			expect(entry.description?.length).toBeGreaterThan(20);
		}
	});

	it('marks nothing irreversible', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name);

		expect(irreversible).toEqual([]);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(kontentaiEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(kontentaiEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = kontentai({
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

describe('kontentai key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(kontentai({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored environment ID', async () => {
		await expect(buildKey(kontentai(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no environment ID is stored', async () => {
		await expect(
			buildKey(kontentai(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			kontentai().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
