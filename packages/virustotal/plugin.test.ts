import { AuthMissingError } from 'corsair/core';
import { virustotal, virustotalEndpointSchemas } from './index';

function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof virustotal>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'analyses.get',
	'comments.delete',
	'comments.get',
	'comments.list',
	'domains.get',
	'domains.rescan',
	'files.addComment',
	'files.comments',
	'files.get',
	'files.rescan',
	'files.vote',
	'files.votes',
	'ipAddresses.get',
	'ipAddresses.rescan',
	'urls.addComment',
	'urls.comments',
	'urls.get',
	'urls.rescan',
	'urls.scan',
];

describe('virustotal plugin definition', () => {
	const plugin = virustotal();

	it('registers as virustotal with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('virustotal');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the nineteen catalog operations', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('declares a schema and an output schema for every operation', () => {
		const schemas = plugin.endpointSchemas ?? {};
		expect(Object.keys(schemas).sort()).toEqual(operations);
		for (const operation of operations) {
			const schema = schemas[operation as keyof typeof schemas];
			expect(schema?.input).toBeDefined();
			expect(schema?.output).toBeDefined();
		}
	});

	it('declares metadata with a risk level and description for every operation', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const operation of operations) {
			const entry = meta[operation as keyof typeof meta];
			expect(['read', 'write', 'destructive']).toContain(entry?.riskLevel);
			expect((entry?.description ?? '').length).toBeGreaterThan(10);
		}
	});

	it('marks only deleting a comment as destructive', () => {
		const meta = plugin.endpointMeta ?? {};
		const destructive = operations.filter(
			(operation) =>
				meta[operation as keyof typeof meta]?.riskLevel === 'destructive',
		);

		expect(destructive).toEqual(['comments.delete']);
	});

	it('marks scans and rescans as writes, since each spends quota', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const operation of [
			'urls.scan',
			'urls.rescan',
			'domains.rescan',
			'files.rescan',
			'ipAddresses.rescan',
		]) {
			expect(meta[operation as keyof typeof meta]?.riskLevel).toBe('write');
		}
	});

	it('marks votes and comments as writes, since they are public acts', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const operation of [
			'files.vote',
			'files.addComment',
			'urls.addComment',
		]) {
			expect(meta[operation as keyof typeof meta]?.riskLevel).toBe('write');
		}
	});

	it('marks every lookup as a read', () => {
		const meta = plugin.endpointMeta ?? {};
		const reads = operations.filter(
			(operation) => meta[operation as keyof typeof meta]?.riskLevel === 'read',
		);

		expect(reads.sort()).toEqual([
			'analyses.get',
			'comments.get',
			'comments.list',
			'domains.get',
			'files.comments',
			'files.get',
			'files.votes',
			'ipAddresses.get',
			'urls.comments',
			'urls.get',
		]);
	});

	it('exports the endpoint schema map for the host', () => {
		expect(virustotalEndpointSchemas['files.get'].input).toBeDefined();
		expect(Object.keys(virustotalEndpointSchemas).sort()).toEqual(operations);
	});

	it('caches nothing, since verdicts change with every analysis', () => {
		expect(plugin.schema?.entities).toEqual({});
	});
});

describe('virustotal key builder', () => {
	const plugin = virustotal();

	it('uses a key passed in the options', async () => {
		await expect(
			buildKey(virustotal({ key: 'from-options' }), keyContext(null)),
		).resolves.toBe('from-options');
	});

	it('falls back to the stored api_key', async () => {
		await expect(buildKey(plugin, keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no key is available', async () => {
		await expect(buildKey(plugin, keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});
});
