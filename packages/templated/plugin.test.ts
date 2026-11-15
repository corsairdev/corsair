import { AuthMissingError } from 'corsair/core';
import { templated, templatedEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof templated>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'folders.create',
	'folders.delete',
	'folders.list',
	'folders.update',
	'fonts.list',
	'galleryFonts.list',
	'renders.create',
	'renders.delete',
	'renders.duplicate',
	'renders.get',
	'renders.list',
	'renders.merge',
	'templates.addTags',
	'templates.create',
	'templates.delete',
	'templates.get',
	'templates.layers',
	'templates.list',
	'templates.removeTags',
	'uploads.create',
	'uploads.delete',
	'uploads.list',
];

const riskLevels = {
	'account.get': 'read',
	'folders.create': 'write',
	'folders.delete': 'destructive',
	'folders.list': 'read',
	'folders.update': 'write',
	'fonts.list': 'read',
	'galleryFonts.list': 'read',
	'renders.create': 'write',
	'renders.delete': 'destructive',
	'renders.duplicate': 'write',
	'renders.get': 'read',
	'renders.list': 'read',
	'renders.merge': 'write',
	'templates.addTags': 'write',
	'templates.create': 'write',
	'templates.delete': 'destructive',
	'templates.get': 'read',
	'templates.layers': 'read',
	'templates.list': 'read',
	'templates.removeTags': 'write',
	'uploads.create': 'write',
	'uploads.delete': 'destructive',
	'uploads.list': 'read',
} as const;

describe('templated plugin definition', () => {
	const plugin = templated();

	it('registers as templated with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('templated');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 23 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(23);
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
			'folders.delete',
			'renders.delete',
			'templates.delete',
			'uploads.delete',
		]);
		for (const name of deletes) {
			expect(meta[name as keyof typeof meta]?.irreversible).toBe(true);
		}
	});

	it('treats a render and a duplicate as writes, because both spend a credit', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(meta['renders.create']?.riskLevel).toBe('write');
		expect(meta['renders.duplicate']?.riskLevel).toBe('write');
		expect(meta['renders.merge']?.riskLevel).toBe('write');
	});

	it('registers a schema for every operation, in both directions', () => {
		expect(Object.keys(templatedEndpointSchemas).sort()).toEqual(operations);
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

describe('templated keyBuilder', () => {
	const plugin = templated();

	it('prefers the inline key over the stored one', async () => {
		const inline = templated({ key: 'inline-key' });
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
