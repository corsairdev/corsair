import { AuthMissingError } from 'corsair/core';
import { truvera, truveraEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof truvera>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fake context is not a full KeyBuilderContext, and the key
	// builder only reads authType and keys.get_api_key.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'credentials.delete',
	'credentials.get',
	'credentials.issue',
	'credentials.list',
	'credentials.revoke',
	'credentials.unrevoke',
	'dids.create',
	'dids.delete',
	'dids.get',
	'dids.getMetadata',
	'dids.list',
	'jobs.get',
	'profiles.create',
	'profiles.delete',
	'profiles.get',
	'profiles.list',
	'profiles.update',
	'registries.create',
	'registries.delete',
	'registries.get',
	'registries.list',
	'registries.revocationStatus',
	'registries.revoke',
	'schemas.create',
	'schemas.delete',
	'schemas.get',
	'schemas.list',
	'verify.verify',
];

describe('truvera plugin definition', () => {
	const plugin = truvera();

	it('registers as truvera with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('truvera');
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
		const reads = Object.entries(meta)
			.filter(([, entry]) => entry.riskLevel === 'read')
			.map(([name]) => name)
			.sort();
		expect(reads).toEqual([
			'credentials.get',
			'credentials.list',
			'dids.get',
			'dids.getMetadata',
			'dids.list',
			'jobs.get',
			'profiles.get',
			'profiles.list',
			'registries.get',
			'registries.list',
			'registries.revocationStatus',
			'schemas.get',
			'schemas.list',
			'verify.verify',
		]);
	});

	it('marks every delete destructive and irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of [
			'credentials.delete',
			'dids.delete',
			'profiles.delete',
			'registries.delete',
			'schemas.delete',
		] as const) {
			expect(meta[name]?.riskLevel).toBe('destructive');
			expect(meta[name]?.irreversible).toBe(true);
		}
	});

	it('marks issuance and revocation destructive (R8)', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const name of [
			'credentials.issue',
			'credentials.revoke',
			'credentials.unrevoke',
			'registries.revoke',
			'dids.create',
			'schemas.create',
			'registries.create',
		] as const) {
			// On-chain creates use the paid transaction allowance. Issuing signs a permanent credential (and can email the holder);
			// revoking makes every verifier reject it.
			expect(meta[name]?.riskLevel).toBe('destructive');
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(truveraEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(truveraEndpointSchemas)) {
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

describe('truvera key builder', () => {
	it('prefers the inline key', async () => {
		const plugin = truvera({ key: 'inline-key' });
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'inline-key',
		);
	});

	it('falls back to the stored key', async () => {
		const plugin = truvera();
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when neither key exists', async () => {
		const plugin = truvera();
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
