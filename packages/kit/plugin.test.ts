import { AuthMissingError } from 'corsair/core';
import { kit, kitEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof kit>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'account.get',
	'customFields.create',
	'customFields.list',
	'customFields.update',
	'forms.list',
	'forms.subscribe',
	'subscribers.create',
	'subscribers.get',
	'subscribers.list',
	'subscribers.unsubscribe',
	'subscribers.update',
	'tags.create',
	'tags.list',
	'tags.tagSubscriber',
	'tags.untagSubscriber',
	'tags.update',
];

describe('kit plugin definition', () => {
	const plugin = kit();

	it('registers as kit with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('kit');
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
		expect(
			Object.fromEntries(
				Object.entries(meta).map(([name, entry]) => [name, entry.riskLevel]),
			),
		).toEqual({
			'account.get': 'read',
			'subscribers.list': 'read',
			'subscribers.get': 'read',
			'subscribers.create': 'write',
			'subscribers.update': 'write',
			'subscribers.unsubscribe': 'destructive',
			'tags.list': 'read',
			'tags.create': 'write',
			'tags.update': 'write',
			'tags.tagSubscriber': 'write',
			'tags.untagSubscriber': 'write',
			'customFields.list': 'read',
			'customFields.create': 'write',
			'customFields.update': 'write',
			'forms.list': 'read',
			'forms.subscribe': 'destructive',
		});
	});

	it('marks only the unsubscribe irreversible', () => {
		const irreversible = Object.entries(plugin.endpointMeta ?? {})
			.filter(([, entry]) => entry.irreversible)
			.map(([name]) => name);

		expect(irreversible).toEqual(['subscribers.unsubscribe']);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(kitEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(kitEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = kit({
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

describe('kit key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(kit({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(kit(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(kit(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			kit().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
