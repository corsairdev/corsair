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
	'indices.stats',
	'indices.segments',
	'indices.recovery',
	'indices.shardStores',
	'indices.refresh',
	'indices.flush',
	'indices.forceMerge',
	'indices.cacheClear',
	'indices.reloadSearchAnalyzers',
	'indices.diskUsage',
	'indices.fieldUsageStats',
	'indices.deprecations',
	'indices.explainDataLifecycle',
	'indices.ilmExplain',
	'indices.ilmRemove',
	'indices.ilmRetry',
	'indices.clearSearchableSnapshotCache',
	'indices.searchableSnapshotStats',
	'search.count',
	'search.msearch',
	'search.msearchTemplate',
	'search.template',
	'search.termsEnum',
	'search.fieldCaps',
	'search.shards',
	'search.openPointInTime',
	'search.rankEval',
	'search.vectorTile',
	'search.eql',
	'search.asyncSubmit',
	'search.asyncGet',
	'search.asyncStatus',
	'search.asyncDelete',
	'search.closePointInTime',
	'indices.resolveIndex',
	'cluster.resolveCluster',
	'search.graphExplore',
	'search.validateQuery',
	'fleet.search',
	'fleet.msearch',
	'fleet.globalCheckpoints',
	'ccr.follow',
	'ccr.followInfo',
	'ccr.followStats',
	'ccr.forgetFollower',
	'ccr.pauseFollow',
	'ccr.resumeFollow',
	'ccr.unfollow',
	'cluster.ping',
	'cluster.getInfo',
	'cluster.subsystemInfo',
	'cluster.pendingTasks',
	'cluster.getSettings',
	'cluster.putSettings',
	'cluster.reroute',
	'cluster.allocationExplain',
	'cluster.getState',
	'cluster.getStats',
	'cluster.addVotingConfigExclusions',
	'cluster.clearVotingConfigExclusions',
	'cluster.remoteInfo',
	'cluster.healthReport',
	'cluster.sslCertificates',
	'cluster.scriptContexts',
	'cluster.scriptLanguages',
	'cat.help',
	'cat.aliases',
	'cat.allocation',
	'cat.circuitBreakers',
	'cat.componentTemplates',
	'cat.count',
	'cat.fielddata',
	'cat.health',
	'cat.master',
	'cat.mlJobs',
	'cat.mlDataFrameAnalytics',
	'cat.mlDatafeeds',
	'cat.mlTrainedModels',
	'cat.nodeattrs',
	'cat.nodes',
	'cat.pendingTasks',
	'cat.plugins',
	'cat.recovery',
	'cat.repositories',
	'cat.segments',
	'cat.shards',
	'cat.snapshots',
	'cat.tasks',
	'cat.templates',
	'cat.threadPool',
	'cat.transforms',
	'nodes.info',
	'nodes.stats',
	'nodes.usage',
	'nodes.hotThreads',
	'nodes.reloadSecureSettings',
	'nodes.repositoriesMetering',
	'nodes.clearRepositoriesMetering',
	'tasks.list',
	'tasks.get',
	'tasks.cancel',
	'security.apiKeys.get',
	'security.apiKeys.create',
	'security.apiKeys.invalidate',
	'security.apiKeys.bulkUpdate',
	'security.apiKeys.clone',
	'security.apiKeys.grant',
	'security.apiKeys.clearCache',
	'security.apiKeys.update',
	'security.apiKeys.query',
	'security.crossClusterApiKeys.create',
	'security.crossClusterApiKeys.update',
	'security.authenticate',
	'security.users.get',
	'security.users.put',
	'security.users.delete',
	'security.users.disable',
	'security.users.enable',
	'security.users.changePassword',
	'security.users.query',
	'security.hasPrivileges',
	'security.getUserPrivileges',
	'security.roles.get',
	'security.roles.put',
	'security.roles.delete',
	'security.roles.bulkPut',
	'security.roles.bulkDelete',
	'security.roles.clearCache',
	'security.roles.query',
	'security.roleMappings.get',
	'security.roleMappings.put',
	'security.roleMappings.delete',
	'security.privileges.put',
	'security.privileges.getBuiltin',
	'security.privileges.get',
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
	'indices.stats': 'read',
	'indices.segments': 'read',
	'indices.recovery': 'read',
	'indices.shardStores': 'read',
	'indices.refresh': 'write',
	'indices.flush': 'write',
	'indices.forceMerge': 'write',
	'indices.cacheClear': 'write',
	'indices.reloadSearchAnalyzers': 'write',
	'indices.diskUsage': 'read',
	'indices.fieldUsageStats': 'read',
	'indices.deprecations': 'read',
	'indices.explainDataLifecycle': 'read',
	'indices.ilmExplain': 'read',
	'indices.ilmRemove': 'write',
	'indices.ilmRetry': 'write',
	'indices.clearSearchableSnapshotCache': 'write',
	'indices.searchableSnapshotStats': 'read',
	'search.count': 'read',
	'search.msearch': 'read',
	'search.msearchTemplate': 'read',
	'search.template': 'read',
	'search.termsEnum': 'read',
	'search.fieldCaps': 'read',
	'search.shards': 'read',
	'search.openPointInTime': 'write',
	'search.rankEval': 'read',
	'search.vectorTile': 'read',
	'search.eql': 'read',
	'search.asyncSubmit': 'read',
	'search.asyncGet': 'read',
	'search.asyncStatus': 'read',
	'search.asyncDelete': 'destructive',
	'search.closePointInTime': 'write',
	'indices.resolveIndex': 'read',
	'cluster.resolveCluster': 'read',
	'search.graphExplore': 'read',
	'search.validateQuery': 'read',
	'fleet.search': 'read',
	'fleet.msearch': 'read',
	'fleet.globalCheckpoints': 'read',
	'ccr.follow': 'write',
	'ccr.followInfo': 'read',
	'ccr.followStats': 'read',
	'ccr.forgetFollower': 'write',
	'ccr.pauseFollow': 'write',
	'ccr.resumeFollow': 'write',
	'ccr.unfollow': 'write',
	'cluster.ping': 'read',
	'cluster.getInfo': 'read',
	'cluster.subsystemInfo': 'read',
	'cluster.pendingTasks': 'read',
	'cluster.getSettings': 'read',
	'cluster.putSettings': 'write',
	'cluster.reroute': 'write',
	'cluster.allocationExplain': 'read',
	'cluster.getState': 'read',
	'cluster.getStats': 'read',
	'cluster.addVotingConfigExclusions': 'write',
	'cluster.clearVotingConfigExclusions': 'write',
	'cluster.remoteInfo': 'read',
	'cluster.healthReport': 'read',
	'cluster.sslCertificates': 'read',
	'cluster.scriptContexts': 'read',
	'cluster.scriptLanguages': 'read',
	'cat.help': 'read',
	'cat.aliases': 'read',
	'cat.allocation': 'read',
	'cat.circuitBreakers': 'read',
	'cat.componentTemplates': 'read',
	'cat.count': 'read',
	'cat.fielddata': 'read',
	'cat.health': 'read',
	'cat.master': 'read',
	'cat.mlJobs': 'read',
	'cat.mlDataFrameAnalytics': 'read',
	'cat.mlDatafeeds': 'read',
	'cat.mlTrainedModels': 'read',
	'cat.nodeattrs': 'read',
	'cat.nodes': 'read',
	'cat.pendingTasks': 'read',
	'cat.plugins': 'read',
	'cat.recovery': 'read',
	'cat.repositories': 'read',
	'cat.segments': 'read',
	'cat.shards': 'read',
	'cat.snapshots': 'read',
	'cat.tasks': 'read',
	'cat.templates': 'read',
	'cat.threadPool': 'read',
	'cat.transforms': 'read',
	'nodes.info': 'read',
	'nodes.stats': 'read',
	'nodes.usage': 'read',
	'nodes.hotThreads': 'read',
	'nodes.reloadSecureSettings': 'write',
	'nodes.repositoriesMetering': 'read',
	'nodes.clearRepositoriesMetering': 'write',
	'tasks.list': 'read',
	'tasks.get': 'read',
	'tasks.cancel': 'write',
	'security.apiKeys.get': 'read',
	'security.apiKeys.create': 'write',
	'security.apiKeys.invalidate': 'write',
	'security.apiKeys.bulkUpdate': 'write',
	'security.apiKeys.clone': 'write',
	'security.apiKeys.grant': 'write',
	'security.apiKeys.clearCache': 'write',
	'security.apiKeys.update': 'write',
	'security.apiKeys.query': 'read',
	'security.crossClusterApiKeys.create': 'write',
	'security.crossClusterApiKeys.update': 'write',
	'security.authenticate': 'read',
	'security.users.get': 'read',
	'security.users.put': 'write',
	'security.users.delete': 'destructive',
	'security.users.disable': 'write',
	'security.users.enable': 'write',
	'security.users.changePassword': 'write',
	'security.users.query': 'read',
	'security.hasPrivileges': 'read',
	'security.getUserPrivileges': 'read',
	'security.roles.get': 'read',
	'security.roles.put': 'write',
	'security.roles.delete': 'destructive',
	'security.roles.bulkPut': 'write',
	'security.roles.bulkDelete': 'destructive',
	'security.roles.clearCache': 'write',
	'security.roles.query': 'read',
	'security.roleMappings.get': 'read',
	'security.roleMappings.put': 'write',
	'security.roleMappings.delete': 'destructive',
	'security.privileges.put': 'write',
	'security.privileges.getBuiltin': 'read',
	'security.privileges.get': 'read',
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
		// Endpoint trees nest more than one level (security.apiKeys.get), so
		// the flattening recurses until it reaches function leaves.
		const flatten = (node: object, prefix = ''): string[] =>
			Object.entries(node).flatMap(([name, value]) =>
				typeof value === 'function'
					? [prefix + name]
					: flatten(value, `${prefix}${name}.`),
			);
		const nested = flatten(plugin.endpoints ?? {});
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
