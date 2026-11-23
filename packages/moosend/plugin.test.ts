import { AuthMissingError } from 'corsair/core';
import { moosend, moosendEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof moosend>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'lists.create',
	'lists.delete',
	'lists.get',
	'lists.list',
	'lists.listPaged',
	'lists.update',
	'subscribers.getByEmail',
	'subscribers.getById',
	'subscribers.list',
	'subscribers.remove',
	'subscribers.subscribe',
	'subscribers.subscribeMany',
	'subscribers.unsubscribe',
	'subscribers.update',
];

const riskLevels: Record<string, string> = {
	'lists.list': 'read',
	'lists.listPaged': 'read',
	'lists.get': 'read',
	'lists.create': 'write',
	'lists.update': 'write',
	'lists.delete': 'destructive',
	'subscribers.list': 'read',
	'subscribers.getByEmail': 'read',
	'subscribers.getById': 'read',
	'subscribers.subscribe': 'write',
	'subscribers.subscribeMany': 'write',
	'subscribers.update': 'write',
	'subscribers.unsubscribe': 'write',
	'subscribers.remove': 'destructive',
};

describe('moosend plugin definition', () => {
	const plugin = moosend();

	it('registers as moosend with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('moosend');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 14 catalog operations across 2 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(2);
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
		).toEqual(riskLevels);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(moosendEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(moosendEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = moosend({
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
});

describe('moosend key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(moosend({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(moosend(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(moosend(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			moosend().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
