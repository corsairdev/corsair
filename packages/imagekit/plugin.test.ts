import { AuthMissingError } from 'corsair/core';
import { imageKitEndpointSchemas, imagekit } from './index';

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
	plugin: ReturnType<typeof imagekit>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'cache.getPurgeStatus',
	'cache.purge',
	'fileVersions.delete',
	'fileVersions.getDetails',
	'fileVersions.list',
	'fileVersions.restore',
	'files.addTags',
	'files.bulkDelete',
	'files.copy',
	'files.delete',
	'files.getDetails',
	'files.list',
	'files.move',
	'files.rename',
	'files.removeAITags',
	'files.removeTags',
	'files.updateDetails',
	'files.upload',
	'folders.copy',
	'folders.create',
	'folders.delete',
	'folders.getJobStatus',
	'folders.move',
	'folders.rename',
	'metadata.getByFileId',
	'metadata.getByUrl',
];

describe('imagekit plugin definition', () => {
	const plugin = imagekit();

	it('registers as imagekit with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('imagekit');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 26 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...operations].sort());
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual([...operations].sort());
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		const risk = Object.fromEntries(
			Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
		);
		expect(risk['files.list']).toBe('read');
		expect(risk['files.getDetails']).toBe('read');
		expect(risk['fileVersions.list']).toBe('read');
		expect(risk['metadata.getByFileId']).toBe('read');
		expect(risk['folders.getJobStatus']).toBe('read');
		expect(risk['cache.getPurgeStatus']).toBe('read');
		expect(risk['files.upload']).toBe('write');
		expect(risk['files.copy']).toBe('write');
		expect(risk['files.addTags']).toBe('write');
		expect(risk['folders.create']).toBe('write');
		expect(risk['cache.purge']).toBe('write');
		expect(risk['files.delete']).toBe('destructive');
		expect(risk['files.bulkDelete']).toBe('destructive');
		expect(risk['fileVersions.delete']).toBe('destructive');
		expect(risk['folders.delete']).toBe('destructive');
	});

	it('marks irreversible deletes', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const op of [
			'files.delete',
			'files.bulkDelete',
			'fileVersions.delete',
			'folders.delete',
		]) {
			expect(meta[op as keyof typeof meta]).toMatchObject({
				irreversible: true,
			});
		}
	});

	it('registers schemas for every operation', () => {
		expect(Object.keys(imageKitEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const entry of Object.values(imageKitEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
		}
	});

	it('returns the explicit key over the stored one', async () => {
		const plugin = imagekit({ key: 'explicit-key' });
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'explicit-key',
		);
	});

	it('reads the stored key when no explicit key is set', async () => {
		const plugin = imagekit();
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no key exists', async () => {
		const plugin = imagekit();
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
