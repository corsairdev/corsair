import type { EndpointJob } from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { RagieKeyBuilderContext } from './index';
import { ragie, ragieEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof ragie>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(
		ctx as unknown as RagieKeyBuilderContext,
		'endpoint',
	);
}

const operations = [
	'connections.create',
	'connections.createOAuthRedirectUrl',
	'connections.delete',
	'connections.get',
	'connections.list',
	'connections.listSourceTypes',
	'connections.setEnabled',
	'connections.setLimits',
	'connections.sync',
	'connections.update',
	'documents.create',
	'documents.createFromUrl',
	'documents.createRaw',
	'documents.delete',
	'documents.get',
	'documents.getChunks',
	'documents.getContent',
	'documents.getSummary',
	'documents.list',
	'documents.patchMetadata',
	'documents.updateFile',
	'documents.updateFromUrl',
	'documents.updateRaw',
	'responses.create',
	'responses.get',
	'retrievals.retrieve',
	'webhookEndpoints.create',
	'webhookEndpoints.delete',
	'webhookEndpoints.get',
	'webhookEndpoints.list',
	'webhookEndpoints.update',
].sort();

describe('ragie plugin definition', () => {
	const plugin = ragie();

	it('registers as ragie with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('ragie');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 31 catalog operations across 5 groups', () => {
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
			'documents.list': 'read',
			'documents.create': 'write',
			'documents.createRaw': 'write',
			'documents.createFromUrl': 'write',
			'documents.get': 'read',
			'documents.delete': 'destructive',
			'documents.updateFile': 'write',
			'documents.updateRaw': 'write',
			'documents.updateFromUrl': 'write',
			'documents.patchMetadata': 'write',
			'documents.getChunks': 'read',
			'documents.getContent': 'read',
			'documents.getSummary': 'read',
			'retrievals.retrieve': 'read',
			'connections.list': 'read',
			'connections.get': 'read',
			'connections.listSourceTypes': 'read',
			'connections.create': 'write',
			'connections.createOAuthRedirectUrl': 'write',
			'connections.update': 'write',
			'connections.sync': 'write',
			'connections.delete': 'destructive',
			'connections.setEnabled': 'write',
			'connections.setLimits': 'write',
			'responses.create': 'write',
			'responses.get': 'read',
			'webhookEndpoints.list': 'read',
			// The create answer carries the signing secret, so it can never be read.
			'webhookEndpoints.create': 'write',
			'webhookEndpoints.get': 'read',
			'webhookEndpoints.update': 'write',
			'webhookEndpoints.delete': 'destructive',
		});
	});

	it('marks every delete irreversible', () => {
		// Unknown: the op names come from a string list, so the map is read
		// untyped here.
		const meta = plugin.endpointMeta as Record<
			string,
			{ irreversible?: boolean } | undefined
		>;
		for (const op of [
			'documents.delete',
			'connections.delete',
			'webhookEndpoints.delete',
		]) {
			expect(meta[op]?.irreversible).toBe(true);
		}
	});

	it('declares jobs on the operations that leave work running', () => {
		const meta = plugin.endpointMeta ?? {};
		const jobOps = Object.entries(meta)
			.filter(([, entry]) => Boolean(entry.job))
			.map(([op]) => op)
			.sort();
		expect(jobOps).toEqual([
			'documents.create',
			'documents.createFromUrl',
			'documents.createRaw',
			'documents.updateFile',
			'documents.updateFromUrl',
			'documents.updateRaw',
			'responses.create',
		]);
		// connections.sync runs server-side with no documented status read.
		expect(jobOps).not.toContain('connections.sync');
	});

	it('reads each job status through an operation this plugin has', () => {
		// Unknown: iterated by op name, so the map is read untyped here.
		const meta = plugin.endpointMeta as Record<
			string,
			{ job?: EndpointJob } | undefined
		>;
		const jobEntries = Object.values(meta).filter((entry) => entry?.job);
		expect(jobEntries.length).toBeGreaterThan(0);
		for (const entry of jobEntries) {
			const job = entry?.job as EndpointJob;
			expect(meta[job.status.op]).toBeDefined();
			expect(
				ragieEndpointSchemas[
					job.status.op as keyof typeof ragieEndpointSchemas
				],
			).toBeDefined();
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(ragieEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(ragieEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = ragie({
			errorHandlers: {
				UPSTREAM_ERROR: {
					match: () => false,
					handler: async () => ({ maxRetries: 0 }),
				},
			},
		});
		const names = Object.keys(custom.errorHandlers ?? {});
		expect(names.at(-1)).toBe('DEFAULT');
		expect(names).toContain('UPSTREAM_ERROR');
		expect(names).toContain('RATE_LIMIT_ERROR');
	});
});

describe('ragie key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(ragie({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(ragie(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(ragie(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			ragie().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
