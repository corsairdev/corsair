import { AuthMissingError } from 'corsair/core';
import { grafbase, grafbaseEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof grafbase>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'accessTokens.create',
	'accessTokens.delete',
	'accessTokens.list',
	'deployments.get',
	'graphs.create',
	'graphs.delete',
	'graphs.get',
	'graphs.list',
	'schemaVersions.list',
	'subgraphs.delete',
	'subgraphs.get',
	'subgraphs.publish',
	'viewer.get',
];

describe('grafbase plugin definition', () => {
	const plugin = grafbase();

	it('registers as grafbase with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('grafbase');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the thirteen catalog operations', () => {
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
			'viewer.get': 'read',
			'graphs.list': 'read',
			'graphs.get': 'read',
			'graphs.create': 'write',
			'graphs.delete': 'destructive',
			'subgraphs.get': 'read',
			'subgraphs.publish': 'write',
			'subgraphs.delete': 'destructive',
			'schemaVersions.list': 'read',
			'deployments.get': 'read',
			'accessTokens.list': 'read',
			'accessTokens.create': 'write',
			'accessTokens.delete': 'destructive',
		});
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(grafbaseEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(grafbaseEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = grafbase({
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

describe('grafbase key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(grafbase({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(grafbase(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(grafbase(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			grafbase().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
