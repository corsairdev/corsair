import { AuthMissingError } from 'corsair/core';
import { tave, taveEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof tave>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'brands.list',
	'jobTypes.list',
	'jobs.create',
	'jobs.delete',
	'jobs.get',
	'jobs.list',
	'jobs.payments',
	'jobs.update',
	'leadSources.list',
	'leadStatuses.list',
	'notes.create',
	'notes.delete',
	'notes.list',
	'payments.create',
	'payments.delete',
	'payments.get',
	'payments.list',
	'payments.update',
	'products.create',
	'products.delete',
	'products.get',
	'products.list',
	'products.update',
	'studio.get',
	'taskLists.list',
	'tasks.create',
	'tasks.delete',
	'tasks.list',
	'tasks.update',
];

const riskLevels = {
	'brands.list': 'read',
	'jobTypes.list': 'read',
	'jobs.create': 'write',
	'jobs.delete': 'destructive',
	'jobs.get': 'read',
	'jobs.list': 'read',
	'jobs.payments': 'read',
	'jobs.update': 'write',
	'leadSources.list': 'read',
	'leadStatuses.list': 'read',
	'notes.create': 'write',
	'notes.delete': 'destructive',
	'notes.list': 'read',
	'payments.create': 'write',
	'payments.delete': 'destructive',
	'payments.get': 'read',
	'payments.list': 'read',
	'payments.update': 'write',
	'products.create': 'write',
	'products.delete': 'destructive',
	'products.get': 'read',
	'products.list': 'read',
	'products.update': 'write',
	'studio.get': 'read',
	'taskLists.list': 'read',
	'tasks.create': 'write',
	'tasks.delete': 'destructive',
	'tasks.list': 'read',
	'tasks.update': 'write',
} as const;

describe('tave plugin definition', () => {
	const plugin = tave();

	it('registers as tave with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('tave');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 29 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(29);
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

	it('marks every delete destructive and irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const deletes = operations.filter((name) => name.endsWith('.delete'));
		expect(deletes).toEqual([
			'jobs.delete',
			'notes.delete',
			'payments.delete',
			'products.delete',
			'tasks.delete',
		]);
		for (const name of deletes) {
			expect(meta[name as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('registers a schema for every operation, in both directions', () => {
		expect(Object.keys(taveEndpointSchemas).sort()).toEqual(operations);
	});

	it('declares entities: {} because the plugin stores nothing', () => {
		expect(plugin.schema).toBeDefined();
		expect(Array.isArray(plugin.schema?.entities)).toBe(false);
		expect(plugin.schema?.entities).toEqual({});
	});

	it('builds error handlers with DEFAULT last', () => {
		expect(Object.keys(plugin.errorHandlers ?? {}).at(-1)).toBe('DEFAULT');
	});
});

describe('tave keyBuilder', () => {
	const plugin = tave();

	it('prefers the inline key over the stored one', async () => {
		const inline = tave({ key: 'inline-key' });
		const ctx = keyContext('stored-key');

		await expect(buildKey(inline, ctx)).resolves.toBe('inline-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
