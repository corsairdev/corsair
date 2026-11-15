import { AuthMissingError } from 'corsair/core';
import { textcortex, textcortexEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof textcortex>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'balance.get',
	'capabilities.get',
	'chat.completions',
	'images.create',
	'models.list',
	'responses.create',
	'web.search',
];

describe('textcortex plugin definition', () => {
	const plugin = textcortex();

	it('registers as textcortex with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('textcortex');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 7 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(7);
	});

	it('gives every endpoint a description and a risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
	});

	it('marks every paid generation a write, and the reads as reads', () => {
		const meta = plugin.endpointMeta ?? {};
		// Each of these spends credits, so a read-only caller must not reach it.
		expect(meta['chat.completions']?.riskLevel).toBe('write');
		expect(meta['responses.create']?.riskLevel).toBe('write');
		expect(meta['images.create']?.riskLevel).toBe('write');
		expect(meta['web.search']?.riskLevel).toBe('write');

		expect(meta['models.list']?.riskLevel).toBe('read');
		expect(meta['balance.get']?.riskLevel).toBe('read');
		expect(meta['capabilities.get']?.riskLevel).toBe('read');
	});

	it('registers a schema for every operation, in both directions', () => {
		expect(Object.keys(textcortexEndpointSchemas).sort()).toEqual(operations);
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

describe('textcortex keyBuilder', () => {
	const plugin = textcortex();

	it('prefers the inline key over the stored one', async () => {
		const inline = textcortex({ key: 'inline-key' });
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
