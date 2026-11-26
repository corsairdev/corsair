import { AuthMissingError } from 'corsair/core';
import {
	moreTreesAuthConfig,
	moreTreesEndpointSchemas,
	moretrees,
} from './index';

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
	plugin: ReturnType<typeof moretrees>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'forest.get',
	'projects.calculateCo2',
	'projects.list',
	'trees.plant',
];

// Only planting spends credits; the CO2 calculation stores nothing.
const riskLevels: Record<string, string> = {
	'account.get': 'read',
	'forest.get': 'read',
	'projects.calculateCo2': 'read',
	'projects.list': 'read',
	'trees.plant': 'destructive',
};

describe('moretrees plugin definition', () => {
	const plugin = moretrees();

	it('registers as moretrees with api_key auth, the account_code field and no webhooks', () => {
		expect(plugin.id).toBe('moretrees');
		expect(plugin.options?.authType).toBe('api_key');
		expect(moreTreesAuthConfig.api_key?.account).toEqual(['account_code']);
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes the five operations across four groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(4);
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

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(moreTreesEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(moreTreesEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = moretrees({
			errorHandlers: {
				OVERLOADED_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('OVERLOADED_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('moretrees key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(moretrees({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(moretrees(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(moretrees(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			moretrees().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
