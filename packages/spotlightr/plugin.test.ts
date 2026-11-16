import { AuthMissingError } from 'corsair/core';
import { spotlightr, spotlightrEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof spotlightr>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'access.get',
	'access.update',
	'access.updateCode',
	'assets.upload',
	'domains.add',
	'domains.list',
	'projects.create',
	'projects.list',
	'search.search',
	'students.create',
	'videos.create',
	'videos.delete',
	'videos.list',
	'videos.listTop',
	'videos.metrics',
	'videos.updateSettings',
	'videos.updateSource',
	'videos.views',
];

describe('spotlightr plugin definition', () => {
	const plugin = spotlightr();

	it('registers as spotlightr with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('spotlightr');
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
			'access.get': 'read',
			'access.update': 'write',
			'access.updateCode': 'write',
			'assets.upload': 'write',
			'domains.add': 'write',
			'domains.list': 'read',
			'projects.create': 'write',
			'projects.list': 'read',
			'search.search': 'read',
			'students.create': 'write',
			'videos.create': 'write',
			'videos.delete': 'destructive',
			'videos.list': 'read',
			'videos.listTop': 'read',
			'videos.metrics': 'read',
			'videos.updateSettings': 'write',
			'videos.updateSource': 'destructive',
			'videos.views': 'read',
		});
	});

	it('marks the video delete as irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name);
		expect(irreversible).toEqual(['videos.delete']);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(spotlightrEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(spotlightrEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('names no route twice', () => {
		const nested = Object.values(plugin.endpoints ?? {}).flatMap((group) =>
			Object.values(group),
		);
		expect(new Set(nested).size).toBe(nested.length);
	});
});

describe('spotlightr key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = spotlightr({ key: 'inline-key' });
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = spotlightr();
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = spotlightr();
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
