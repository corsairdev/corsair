import { AuthMissingError } from 'corsair/core';
import { docRaptorEndpointSchemas, docraptor } from './index';

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
	plugin: ReturnType<typeof docraptor>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'documents.create',
	'documents.createAsync',
	'documents.createHosted',
	'documents.createHostedAsync',
	'documents.download',
	'documents.expire',
	'documents.list',
	'documents.status',
	'ips.list',
];

describe('docraptor plugin definition', () => {
	const plugin = docraptor();

	it('registers as docraptor with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('docraptor');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the nine catalog operations', () => {
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
			'documents.create': 'destructive',
			'documents.createAsync': 'destructive',
			'documents.createHosted': 'destructive',
			'documents.createHostedAsync': 'destructive',
			'documents.status': 'read',
			'documents.download': 'read',
			'documents.list': 'read',
			'documents.expire': 'destructive',
			'ips.list': 'read',
		});
	});

	it('marks expire irreversible', () => {
		expect(plugin.endpointMeta?.['documents.expire']?.irreversible).toBe(true);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(docRaptorEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(docRaptorEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});
});

describe('docraptor job declarations', () => {
	const plugin = docraptor();

	it('declares a status-polling job on both async creates', () => {
		const asyncCreates = [
			'documents.createAsync',
			'documents.createHostedAsync',
		] as const;
		for (const name of asyncCreates) {
			expect(plugin.endpointMeta?.[name]?.job).toEqual({
				idPath: 'status_id',
				status: {
					op: 'documents.status',
					idArg: 'statusId',
					statusPath: 'status',
					done: ['completed'],
					failed: ['failed'],
				},
			});
		}
	});

	it('declares no job on the sync or read operations', () => {
		const noJobOperations = [
			'documents.createHosted',
			'documents.status',
			'documents.list',
			'documents.expire',
			'ips.list',
		] as const;
		for (const name of noJobOperations) {
			expect(plugin.endpointMeta?.[name]?.job).toBeUndefined();
		}
	});
});

describe('docraptor key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(docraptor({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(docraptor(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(docraptor(), keyContext(null)),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('refuses webhook keys', async () => {
		await expect(
			docraptor().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
