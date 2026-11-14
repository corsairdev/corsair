import { AuthMissingError } from 'corsair/core';
import { keen, keenEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof keen>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'collections.get',
	'collections.list',
	'datasets.delete',
	'datasets.get',
	'datasets.list',
	'datasets.result',
	'events.record',
	'events.recordMany',
	'properties.get',
	'queries.multiAnalysis',
	'queries.run',
	'savedQueries.create',
	'savedQueries.delete',
	'savedQueries.get',
	'savedQueries.list',
	'savedQueries.result',
];

describe('keen plugin definition', () => {
	const plugin = keen();

	it('registers as keen with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('keen');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares project_id as an account credential field', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['project_id'] },
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
			'events.record': 'write',
			'events.recordMany': 'write',
			'collections.list': 'read',
			'collections.get': 'read',
			'properties.get': 'read',
			'queries.run': 'read',
			'queries.multiAnalysis': 'read',
			'savedQueries.list': 'read',
			'savedQueries.get': 'read',
			'savedQueries.create': 'write',
			'savedQueries.result': 'read',
			'savedQueries.delete': 'destructive',
			'datasets.list': 'read',
			'datasets.get': 'read',
			'datasets.result': 'read',
			'datasets.delete': 'destructive',
		});
	});

	it('marks only the two deletes irreversible', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual(['datasets.delete', 'savedQueries.delete']);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(keenEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(keenEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = keen({
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

describe('keen key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(keen({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(keen(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(keen(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			keen().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
