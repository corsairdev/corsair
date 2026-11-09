import { AuthMissingError } from 'corsair/core';
import { craftmypdf, craftmypdfEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof craftmypdf>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.getInfo',
	'editor.createSession',
	'editor.deactivateSession',
	'pdf.addText',
	'pdf.addWatermark',
	'pdf.create',
	'pdf.createAsync',
	'pdf.createImage',
	'pdf.createMerge',
	'pdf.createParallel',
	'pdf.getInfo',
	'pdf.merge',
	'pdf.updateFields',
	'templates.createFrom',
	'templates.delete',
	'templates.get',
	'templates.list',
	'templates.listVersions',
	'templates.queryUsage',
	'templates.retainVersions',
	'templates.transfer',
	'templates.update',
	'transactions.list',
];

describe('craftmypdf plugin definition', () => {
	const plugin = craftmypdf();

	it('registers as craftmypdf with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('craftmypdf');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 23 catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('has an input and output schema for every operation', () => {
		expect(Object.keys(craftmypdfEndpointSchemas).sort()).toEqual(operations);
		for (const [name, entry] of Object.entries(craftmypdfEndpointSchemas)) {
			expect(entry.input).toBeDefined();
			expect(entry.output).toBeDefined();
			expect(name).toMatch(/^[a-zA-Z]+\.[a-zA-Z]+$/);
		}
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(20);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'pdf.create': 'write',
			'pdf.createAsync': 'write',
			'pdf.createImage': 'write',
			'pdf.createMerge': 'write',
			'pdf.createParallel': 'write',
			'pdf.addWatermark': 'write',
			'pdf.addText': 'write',
			'pdf.updateFields': 'write',
			'pdf.merge': 'write',
			'pdf.getInfo': 'read',
			'templates.list': 'read',
			'templates.get': 'read',
			'templates.update': 'write',
			'templates.delete': 'destructive',
			'templates.createFrom': 'write',
			'templates.transfer': 'write',
			'templates.listVersions': 'read',
			'templates.retainVersions': 'write',
			'templates.queryUsage': 'read',
			'editor.createSession': 'write',
			'editor.deactivateSession': 'write',
			'account.getInfo': 'read',
			'transactions.list': 'read',
		});
	});

	it('marks only the template delete as irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name);
		expect(irreversible).toEqual(['templates.delete']);
	});

	it('treats the editor session token as a write, not a read', () => {
		// The session URL is a bearer credential for the template.
		expect(plugin.endpointMeta?.['editor.createSession']?.riskLevel).toBe(
			'write',
		);
	});

	it('keeps DEFAULT last after merging handlers', () => {
		const keys = Object.keys(plugin.errorHandlers ?? {});
		expect(keys.at(-1)).toBe('DEFAULT');
		expect(keys.length).toBe(Object.keys(plugin.errorHandlers ?? {}).length);
	});
});

describe('craftmypdf key builder', () => {
	it('prefers the inline key over the stored one', async () => {
		const plugin = craftmypdf({ key: 'inline-key' });
		const ctx = keyContext('stored-key');

		await expect(buildKey(plugin, ctx)).resolves.toBe('inline-key');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('falls back to the stored account key', async () => {
		const plugin = craftmypdf();
		const ctx = keyContext('stored-key');

		await expect(buildKey(plugin, ctx)).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = craftmypdf();
		const ctx = keyContext(null);

		await expect(buildKey(plugin, ctx)).rejects.toThrow(AuthMissingError);
	});
});
