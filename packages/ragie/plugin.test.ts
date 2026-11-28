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

// 54 operations: the 31 of the first version plus 23 from the SDK (ragie 2.0.0).
const EXPECTED_OPERATION_COUNT = 54;
const operations = Object.keys(ragieEndpointSchemas).sort();

describe('ragie plugin definition', () => {
	const plugin = ragie();

	it('registers as ragie with api_key auth and signed webhooks', () => {
		expect(plugin.id).toBe('ragie');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(plugin.webhooks ?? {}).sort()).toEqual([
			'connections',
			'documents',
			'entities',
			'partitions',
		]);
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes the same operations in endpoints, meta and schemas', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(operations).toHaveLength(EXPECTED_OPERATION_COUNT);
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
		).toMatchObject({
			'documents.list': 'read',
			'documents.create': 'destructive',
			'documents.createRaw': 'destructive',
			'documents.createFromUrl': 'destructive',
			'documents.get': 'read',
			'documents.delete': 'destructive',
			'documents.updateFile': 'destructive',
			'documents.updateRaw': 'destructive',
			'documents.updateFromUrl': 'destructive',
			'documents.patchMetadata': 'write',
			'documents.getChunks': 'read',
			'documents.getContent': 'read',
			'documents.getSummary': 'read',
			'retrievals.retrieve': 'read',
			'connections.list': 'read',
			'connections.get': 'read',
			'connections.listSourceTypes': 'read',
			'connections.create': 'destructive',
			'connections.createOAuthRedirectUrl': 'write',
			'connections.update': 'write',
			'connections.sync': 'destructive',
			'connections.delete': 'destructive',
			'connections.setEnabled': 'write',
			'connections.setLimits': 'write',
			'responses.create': 'destructive',
			'responses.get': 'read',
			'webhookEndpoints.list': 'read',
			// The create answer carries the signing secret, so it can never be read.
			'webhookEndpoints.create': 'write',
			'webhookEndpoints.get': 'read',
			'webhookEndpoints.update': 'write',
			'webhookEndpoints.delete': 'destructive',
			'partitions.delete': 'destructive',
			'instructions.create': 'destructive',
			'instructions.delete': 'destructive',
			'authenticators.createConnection': 'destructive',
			'authenticators.delete': 'destructive',
			'partitions.list': 'read',
			'documents.getSource': 'read',
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

	it('gives webhooks the webhookSecret option, else the stored signature', async () => {
		await expect(
			ragie({ webhookSecret: 'whsec' }).keyBuilder?.(
				keyContext('stored-key') as never,
				'webhook',
			),
		).resolves.toBe('whsec');
		const ctx = {
			...keyContext('stored-key'),
			keys: {
				get_api_key: jest.fn(),
				get_webhook_signature: jest.fn().mockResolvedValue('stored-secret'),
			},
		};
		await expect(ragie().keyBuilder?.(ctx as never, 'webhook')).resolves.toBe(
			'stored-secret',
		);
	});
});
