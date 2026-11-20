import { AuthMissingError } from 'corsair/core';
import { storerocket, storerocketEndpointSchemas } from './index';

// The key builder only reads authType and keys.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(apiKey),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof storerocket>,
	ctx: ReturnType<typeof keyContext>,
	// unknown: the fake context is not a full KeyBuilderContext.
	source: 'endpoint' | 'webhook' = 'endpoint',
) {
	return plugin.keyBuilder?.(ctx as never, source);
}

const operations = [
	'locations.create',
	'locations.delete',
	'locations.get',
	'locations.list',
	'locations.replace',
	'locations.update',
	'projects.list',
	'specialHours.create',
	'specialHours.delete',
	'specialHours.get',
	'specialHours.list',
	'specialHours.update',
	'users.get',
];

const riskLevels: Record<string, string> = {
	...Object.fromEntries(operations.map((op) => [op, 'read'])),
	'locations.create': 'write',
	'locations.update': 'write',
	'locations.replace': 'write',
	'locations.delete': 'destructive',
	'specialHours.create': 'write',
	'specialHours.update': 'write',
	'specialHours.delete': 'destructive',
};

describe('storerocket plugin definition', () => {
	const plugin = storerocket();

	it('registers as storerocket with api_key auth', () => {
		expect(plugin.id).toBe('storerocket');
		expect(plugin.options?.authType).toBe('api_key');
	});

	it('exposes exactly the 13 documented operations across 4 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('declares every operation in endpointSchemas', () => {
		expect(Object.keys(storerocketEndpointSchemas).sort()).toEqual(operations);
	});

	it('declares risk levels matching the real side effects', () => {
		const meta = plugin.endpointMeta ?? {};
		const declared = Object.fromEntries(
			operations.map((op) => [
				op,
				(meta as Record<string, { riskLevel: string }>)[op]?.riskLevel,
			]),
		);
		expect(declared).toEqual(riskLevels);
	});

	it('marks the deletes destructive and irreversible', () => {
		const meta = plugin.endpointMeta as Record<
			string,
			{ riskLevel: string; irreversible?: boolean } | undefined
		>;
		expect(meta['locations.delete']?.irreversible).toBe(true);
		expect(meta['specialHours.delete']?.irreversible).toBe(true);
	});

	it('registers no webhooks, because StoreRocket documents none', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: {} })).toBe(
			false,
		);
	});
});

describe('storerocket keyBuilder', () => {
	const plugin = storerocket();

	it('prefers the inline key', async () => {
		const inline = storerocket({ key: 'inline-token' });
		await expect(buildKey(inline, keyContext('stored-token'))).resolves.toBe(
			'inline-token',
		);
	});

	it('falls back to the stored key', async () => {
		await expect(buildKey(plugin, keyContext('stored-token'))).resolves.toBe(
			'stored-token',
		);
	});

	it('throws AuthMissingError when neither exists', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toThrow(
			AuthMissingError,
		);
	});
});
