import { AuthMissingError } from 'corsair/core';
import { kadoa, kadoaEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof kadoa>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'changes.get',
	'changes.list',
	'locations.list',
	'schemas.create',
	'schemas.delete',
	'schemas.get',
	'schemas.list',
	'schemas.update',
	'triggers.list',
	'variables.create',
	'variables.delete',
	'variables.get',
	'variables.list',
	'variables.update',
	'workflows.connectors',
	'workflows.create',
	'workflows.data',
	'workflows.delete',
	'workflows.get',
	'workflows.history',
	'workflows.jobStatus',
	'workflows.list',
	'workflows.pause',
	'workflows.resume',
	'workflows.run',
	'workflows.schedule',
	'workflows.stop',
	'workflows.updateMetadata',
];

describe('kadoa plugin definition', () => {
	const plugin = kadoa();

	it('registers as kadoa with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('kadoa');
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
			'workflows.list': 'read',
			'workflows.get': 'read',
			'workflows.create': 'destructive',
			'workflows.updateMetadata': 'write',
			'workflows.delete': 'destructive',
			'workflows.run': 'destructive',
			'workflows.pause': 'write',
			'workflows.resume': 'destructive',
			'workflows.stop': 'write',
			'workflows.schedule': 'write',
			'workflows.history': 'read',
			'workflows.data': 'read',
			'workflows.jobStatus': 'read',
			'workflows.connectors': 'read',
			'schemas.list': 'read',
			'schemas.get': 'read',
			'schemas.create': 'write',
			'schemas.update': 'write',
			'schemas.delete': 'destructive',
			'changes.list': 'read',
			'changes.get': 'read',
			'variables.list': 'read',
			'variables.get': 'read',
			'variables.create': 'write',
			'variables.update': 'write',
			'variables.delete': 'destructive',
			'triggers.list': 'read',
			'locations.list': 'read',
		});
	});

	it('marks only the three deletes irreversible', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual([
			'schemas.delete',
			'variables.delete',
			'workflows.delete',
		]);
	});

	it('declares no job, because reading one back needs two arguments', () => {
		const withJob = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.job !== undefined)
			.map(([name]) => name);

		expect(withJob).toEqual([]);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(kadoaEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(kadoaEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = kadoa({
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

describe('kadoa key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(kadoa({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(kadoa(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(kadoa(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			kadoa().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
