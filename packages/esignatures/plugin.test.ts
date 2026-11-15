import { AuthMissingError } from 'corsair/core';
import { eSignaturesEndpointSchemas, esignatures } from './index';

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
	plugin: ReturnType<typeof esignatures>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'contracts.addSigner',
	'contracts.create',
	'contracts.deleteSigner',
	'contracts.get',
	'contracts.resendToSigner',
	'contracts.sendDraft',
	'contracts.updateSigner',
	'contracts.withdraw',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.list',
];

describe('esignatures plugin definition', () => {
	const plugin = esignatures();

	it('registers as esignatures with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('esignatures');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the twelve catalog operations', () => {
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
			'contracts.create': 'write',
			'contracts.get': 'read',
			'contracts.withdraw': 'destructive',
			'contracts.sendDraft': 'write',
			'contracts.addSigner': 'write',
			'contracts.updateSigner': 'write',
			'contracts.resendToSigner': 'write',
			'contracts.deleteSigner': 'destructive',
			'templates.list': 'read',
			'templates.get': 'read',
			'templates.create': 'write',
			'templates.delete': 'destructive',
		});
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(eSignaturesEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(eSignaturesEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = esignatures({
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

describe('esignatures key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(
			buildKey(esignatures({ key: 'option-key' }), ctx),
		).resolves.toBe('option-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(
			buildKey(esignatures(), keyContext('stored-key')),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(esignatures(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			esignatures().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
