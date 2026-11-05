import { AuthMissingError } from 'corsair/core';
import { elasticsearch, elasticsearchEndpointSchemas } from './index';

// The key builder only reads authType, options and keys.
function keyContext(fields: { apiKey?: string | null }) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(fields.apiKey ?? null) },
	};
}

function buildKey(
	plugin: ReturnType<typeof elasticsearch>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

// Every nested endpoint dot-path the plugin exposes.
const operations = [
	'cluster.getHealth',
	'indices.list',
	'indices.get',
	'search.run',
	'documents.get',
	'documents.exists',
	'documents.index',
	'documents.create',
	'documents.update',
	'documents.delete',
	'documents.updateByQuery',
	'documents.deleteByQuery',
	'documents.mget',
	'documents.getSource',
	'documents.existsSource',
	'documents.explain',
	'documents.termvectors',
	'documents.mtermvectors',
	'documents.bulk',
	'indices.create',
	'indices.exists',
	'indices.delete',
	'indices.open',
	'indices.close',
	'indices.addBlock',
	'indices.removeBlock',
	'indices.getMapping',
	'indices.putMapping',
	'indices.getFieldMapping',
	'indices.getSettings',
	'indices.putSettings',
	'indices.getAlias',
	'indices.existsAlias',
	'indices.putAlias',
	'indices.deleteAlias',
	'indices.rollover',
	'indices.clone',
	'indices.split',
	'indices.shrink',
	'indices.downsample',
	'indices.analyze',
];

// Risk pinned per op: reads never mutate, writes change data or cluster
// state, destructives remove data.
const riskLevels: Record<string, 'read' | 'write' | 'destructive'> = {
	'cluster.getHealth': 'read',
	'indices.list': 'read',
	'indices.get': 'read',
	'search.run': 'read',
	'documents.get': 'read',
	'documents.exists': 'read',
	'documents.index': 'write',
	'documents.create': 'write',
	'documents.update': 'write',
	'documents.delete': 'destructive',
	'documents.updateByQuery': 'write',
	'documents.deleteByQuery': 'destructive',
	'documents.mget': 'read',
	'documents.getSource': 'read',
	'documents.existsSource': 'read',
	'documents.explain': 'read',
	'documents.termvectors': 'read',
	'documents.mtermvectors': 'read',
	'documents.bulk': 'write',
	'indices.create': 'write',
	'indices.exists': 'read',
	'indices.delete': 'destructive',
	'indices.open': 'write',
	'indices.close': 'write',
	'indices.addBlock': 'write',
	'indices.removeBlock': 'write',
	'indices.getMapping': 'read',
	'indices.putMapping': 'write',
	'indices.getFieldMapping': 'read',
	'indices.getSettings': 'read',
	'indices.putSettings': 'write',
	'indices.getAlias': 'read',
	'indices.existsAlias': 'read',
	'indices.putAlias': 'write',
	'indices.deleteAlias': 'destructive',
	'indices.rollover': 'write',
	'indices.clone': 'write',
	'indices.split': 'write',
	'indices.shrink': 'write',
	'indices.downsample': 'write',
	'indices.analyze': 'read',
};

describe('elasticsearch plugin definition', () => {
	const plugin = elasticsearch();

	it('registers as elasticsearch with api_key auth by default and no webhooks', () => {
		expect(plugin.id).toBe('elasticsearch');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('collects the cluster URL as an account field beside the base api_key secret', () => {
		// Base fields (api_key, webhook_signature) come from the auth type;
		// the plugin adds only the per-account cluster URL.
		expect(plugin.authConfig?.api_key.account).toEqual(['baseUrl']);
	});

	it('exposes the full nested endpoint tree', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([...operations].sort());
	});

	it('pins the risk level and a description for every endpoint', () => {
		const meta = plugin.endpointMeta ?? {};
		const expected = Object.fromEntries(
			operations.map((operation) => [
				operation,
				{ riskLevel: riskLevels[operation], description: expect.any(String) },
			]),
		);
		expect(meta).toEqual(expected);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(elasticsearchEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const schemas of Object.values(elasticsearchEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = elasticsearch({
			errorHandlers: {
				QUOTA_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('QUOTA_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
		expect(names).toContain('SERVER_ERROR');
	});
});

describe('elasticsearch key builder', () => {
	it('normalizes an explicit key option into an ApiKey header value', async () => {
		const ctx = keyContext({ apiKey: 'stored-key' });

		await expect(
			buildKey(elasticsearch({ key: 'encoded-value' }), ctx),
		).resolves.toBe('ApiKey encoded-value');
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('base64s a stored id:api_key pair', async () => {
		const ctx = keyContext({ apiKey: 'some-id:some-secret' });

		const header = await buildKey(elasticsearch(), ctx);
		expect(header).toBe(
			`ApiKey ${Buffer.from('some-id:some-secret', 'utf8').toString('base64')}`,
		);
	});

	it('passes a stored full Authorization header value through', async () => {
		const ctx = keyContext({ apiKey: 'Basic dXNlcjpwYXNz' });

		await expect(buildKey(elasticsearch(), ctx)).resolves.toBe(
			'Basic dXNlcjpwYXNz',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		const ctx = keyContext({ apiKey: null });

		await expect(buildKey(elasticsearch(), ctx)).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		const ctx = keyContext({ apiKey: 'stored-key' });

		await expect(
			elasticsearch().keyBuilder?.(ctx as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
