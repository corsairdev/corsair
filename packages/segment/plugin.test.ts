import type { EndpointJob } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { SegmentKeyBuilderContext } from './index';
import { segment, segmentEndpointSchemas } from './index';

// The key builder only reads authType and keys; a full AccountKeyManager
// carries encryption methods no test needs.
function keyContext(apiKey: string | null) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: { get_api_key: jest.fn().mockResolvedValue(apiKey) },
	};
}

function buildKey(
	plugin: ReturnType<typeof segment>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(
		ctx as unknown as SegmentKeyBuilderContext,
		'endpoint',
	);
}

const operations = [
	'catalog.getDestination',
	'catalog.getSource',
	'catalog.listDestinations',
	'catalog.listSources',
	'destinations.create',
	'destinations.delete',
	'destinations.get',
	'destinations.list',
	'destinations.update',
	'functions.create',
	'functions.delete',
	'functions.deploy',
	'functions.get',
	'functions.getVersion',
	'functions.list',
	'functions.listVersions',
	'functions.restoreVersion',
	'functions.update',
	'regulations.create',
	'regulations.get',
	'regulations.list',
	'sources.create',
	'sources.createWriteKey',
	'sources.delete',
	'sources.get',
	'sources.list',
	'sources.listConnectedDestinations',
	'sources.listConnectedWarehouses',
	'sources.removeWriteKey',
	'sources.update',
	'sources.updateSchemaSettings',
	'trackingPlans.addSource',
	'trackingPlans.create',
	'trackingPlans.delete',
	'trackingPlans.get',
	'trackingPlans.list',
	'trackingPlans.listRules',
	'trackingPlans.listSources',
	'trackingPlans.removeSource',
	'trackingPlans.replaceRules',
	'trackingPlans.update',
	'warehouses.addSourceConnection',
	'warehouses.create',
	'warehouses.delete',
	'warehouses.get',
	'warehouses.getConnectionState',
	'warehouses.list',
	'warehouses.listConnectedSources',
	'warehouses.removeSourceConnection',
	'warehouses.update',
	'warehouses.validate',
	'workspaces.get',
];

const riskMap: Record<string, string> = {
	'workspaces.get': 'read',
	'sources.list': 'read',
	'sources.get': 'read',
	'sources.create': 'write',
	'sources.update': 'write',
	'sources.delete': 'destructive',
	'sources.listConnectedDestinations': 'read',
	'sources.listConnectedWarehouses': 'read',
	'sources.updateSchemaSettings': 'write',
	'sources.createWriteKey': 'write',
	'sources.removeWriteKey': 'destructive',
	'destinations.list': 'read',
	'destinations.get': 'read',
	'destinations.create': 'write',
	'destinations.update': 'write',
	'destinations.delete': 'destructive',
	'warehouses.list': 'read',
	'warehouses.get': 'read',
	'warehouses.getConnectionState': 'read',
	'warehouses.listConnectedSources': 'read',
	'warehouses.validate': 'read',
	'warehouses.create': 'write',
	'warehouses.update': 'write',
	'warehouses.addSourceConnection': 'write',
	'warehouses.delete': 'destructive',
	'warehouses.removeSourceConnection': 'destructive',
	'trackingPlans.list': 'read',
	'trackingPlans.get': 'read',
	'trackingPlans.listRules': 'read',
	'trackingPlans.listSources': 'read',
	'trackingPlans.create': 'write',
	'trackingPlans.update': 'write',
	'trackingPlans.replaceRules': 'write',
	'trackingPlans.addSource': 'write',
	'trackingPlans.delete': 'destructive',
	'trackingPlans.removeSource': 'destructive',
	'functions.list': 'read',
	'functions.get': 'read',
	'functions.listVersions': 'read',
	'functions.getVersion': 'read',
	'functions.create': 'write',
	'functions.update': 'write',
	'functions.deploy': 'write',
	'functions.restoreVersion': 'write',
	'functions.delete': 'destructive',
	'catalog.listDestinations': 'read',
	'catalog.getDestination': 'read',
	'catalog.listSources': 'read',
	'catalog.getSource': 'read',
	'regulations.list': 'read',
	'regulations.create': 'destructive',
	'regulations.get': 'read',
};

describe('segment plugin definition', () => {
	const plugin = segment();

	it('registers as segment with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('segment');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 52 catalog operations across 8 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
	});

	it('gives every endpoint a description and the pinned risk level', () => {
		const meta = plugin.endpointMeta ?? {};
		expect(Object.keys(meta).sort()).toEqual(operations);
		for (const entry of Object.values(meta)) {
			expect(entry.description?.length).toBeGreaterThan(10);
		}
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual(riskMap);
	});

	it('marks deletes and the regulation create irreversible', () => {
		const meta = plugin.endpointMeta ?? {};
		const irreversible = Object.entries(meta)
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name);
		expect(irreversible.sort()).toEqual(
			[
				'sources.delete',
				'sources.removeWriteKey',
				'destinations.delete',
				'warehouses.delete',
				'warehouses.removeSourceConnection',
				'trackingPlans.delete',
				'trackingPlans.removeSource',
				'functions.delete',
				'regulations.create',
			].sort(),
		);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(segmentEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(segmentEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = segment({
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
	});

	it('declares the regulation run as a pollable job with no cancel', () => {
		const meta = plugin.endpointMeta ?? {};
		const job: EndpointJob | undefined = (
			meta as Record<string, { job?: EndpointJob } | undefined>
		)['regulations.create']?.job;
		expect(job).toMatchObject({
			idPath: 'data.regulateId',
			status: {
				op: 'regulations.get',
				idArg: 'regulateId',
				statusPath: 'data.regulation.overallStatus',
				done: ['FINISHED', 'PARTIAL_SUCCESS'],
				failed: ['FAILED', 'INVALID', 'NOT_SUPPORTED'],
			},
		});
		expect(job?.cancel).toBeUndefined();
	});
});

describe('segment key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-token');

		await expect(buildKey(segment({ key: 'option-token' }), ctx)).resolves.toBe(
			'option-token',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored token', async () => {
		await expect(buildKey(segment(), keyContext('stored-token'))).resolves.toBe(
			'stored-token',
		);
	});

	it('throws AuthMissingError when no token is stored', async () => {
		await expect(buildKey(segment(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook key requests', async () => {
		await expect(
			segment().keyBuilder?.(
				keyContext('stored-token') as unknown as SegmentKeyBuilderContext,
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
