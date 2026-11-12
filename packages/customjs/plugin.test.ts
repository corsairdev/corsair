import { AuthMissingError } from 'corsair/core';
import { customjs, customjsEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof customjs>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'auth.check',
	'javascript.run',
	'javascript.runBinary',
	'pages.create',
	'pages.delete',
	'pages.list',
	'pages.update',
	'pdf.fromHtml',
	'pdf.fromMarkdown',
	'scrape.agent',
	'scrape.page',
	'screenshot.capture',
];

describe('customjs plugin definition', () => {
	const plugin = customjs();

	it('registers as customjs with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('customjs');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	// Read from the nested endpoint literal, which is what a caller writes, not
	// from the `event` strings the endpoints log.
	it('exposes exactly the twelve catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the right risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(30);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'auth.check': 'read',
			'javascript.run': 'write',
			'javascript.runBinary': 'write',
			'pages.create': 'write',
			'pages.delete': 'destructive',
			'pages.list': 'read',
			'pages.update': 'write',
			'pdf.fromHtml': 'read',
			'pdf.fromMarkdown': 'read',
			'scrape.agent': 'write',
			'scrape.page': 'read',
			'screenshot.capture': 'read',
		});
	});

	it('marks the two actions that cannot be undone', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name)
			.sort();

		expect(irreversible).toEqual(['pages.delete', 'scrape.agent']);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(customjsEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(customjsEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});
});

describe('customjs key builder', () => {
	it('prefers the key passed in the options', async () => {
		const plugin = customjs({ key: 'inline-key' });

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = customjs();

		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = customjs();

		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
