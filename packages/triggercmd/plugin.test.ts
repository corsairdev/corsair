import { AuthMissingError } from 'corsair/core';
import { triggercmd, triggercmdEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof triggercmd>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'commands.history',
	'commands.list',
	'commands.run',
	'computers.list',
	'panels.list',
	'panels.trigger',
];

describe('triggercmd plugin definition', () => {
	const plugin = triggercmd();

	it('registers as triggercmd with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('triggercmd');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the six catalog operations', () => {
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
			'commands.history': 'read',
			'commands.list': 'read',
			'commands.run': 'destructive',
			'computers.list': 'read',
			'panels.list': 'read',
			'panels.trigger': 'destructive',
		});
	});

	it('marks no read as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const entry of Object.values(meta)) {
			expect(entry.irreversible).toBeUndefined();
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(triggercmdEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(triggercmdEndpointSchemas)) {
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

describe('triggercmd key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = triggercmd({ key: 'inline-token' });
		await expect(buildKey(plugin, keyContext('stored-token'))).resolves.toBe(
			'inline-token',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = triggercmd();
		await expect(buildKey(plugin, keyContext('stored-token'))).resolves.toBe(
			'stored-token',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = triggercmd();
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
