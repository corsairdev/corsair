import { AuthMissingError } from 'corsair/core';
import { woodpeckerCoEndpointSchemas, woodpeckerco } from './index';

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
	plugin: ReturnType<typeof woodpeckerco>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'campaigns.deleteStep',
	'campaigns.list',
	'campaigns.pause',
	'campaigns.run',
	'campaigns.stop',
	'prospects.addToCampaign',
	'prospects.listInCampaigns',
	'webhooks.listEvents',
];

describe('woodpeckerco plugin definition', () => {
	const plugin = woodpeckerco();

	it('registers as woodpeckerco with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('woodpeckerco');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the eight catalog operations', () => {
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
			'campaigns.list': 'read',
			'campaigns.run': 'write',
			'campaigns.pause': 'write',
			'campaigns.stop': 'write',
			'campaigns.deleteStep': 'destructive',
			'prospects.addToCampaign': 'write',
			'prospects.listInCampaigns': 'read',
			'webhooks.listEvents': 'read',
		});
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(woodpeckerCoEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(woodpeckerCoEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = woodpeckerco({
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

describe('woodpeckerco key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(
			buildKey(woodpeckerco({ key: 'option-key' }), ctx),
		).resolves.toBe('option-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(
			buildKey(woodpeckerco(), keyContext('stored-key')),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(woodpeckerco(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			woodpeckerco().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
