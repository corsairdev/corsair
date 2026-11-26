import { AuthMissingError } from 'corsair/core';
import { linkly, linklyEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof linkly>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'auth.test',
	'clicks.export',
	'clicks.getCounters',
	'clicks.getTimeSeries',
	'conversions.create',
	'conversions.list',
	'domains.create',
	'domains.delete',
	'domains.list',
	'domains.updateFavicon',
	'links.bulkUpsert',
	'links.create',
	'links.delete',
	'links.deleteMany',
	'links.export',
	'links.get',
	'links.getDetails',
	'links.list',
	'links.restore',
	'links.update',
	'webhooks.list',
	'webhooks.listForLink',
	'webhooks.subscribe',
	'webhooks.subscribeToLink',
	'webhooks.unsubscribe',
	'webhooks.unsubscribeFromLink',
	'workspaces.listWorkspaces',
	'workspaces.update',
];

// Metered analytics reads stay read (R8). Deletes to the trash stay
// destructive: the short URL stops redirecting at once.
const riskLevels: Record<string, string> = {
	'auth.test': 'read',
	'workspaces.listWorkspaces': 'read',
	'workspaces.update': 'destructive',
	'links.list': 'read',
	'links.get': 'read',
	'links.getDetails': 'read',
	'links.create': 'write',
	'links.update': 'write',
	'links.bulkUpsert': 'write',
	'links.delete': 'destructive',
	'links.deleteMany': 'destructive',
	'links.restore': 'write',
	'links.export': 'read',
	'clicks.getTimeSeries': 'read',
	'clicks.getCounters': 'read',
	'clicks.export': 'read',
	'domains.list': 'read',
	'domains.create': 'write',
	'domains.delete': 'destructive',
	'domains.updateFavicon': 'write',
	'webhooks.list': 'read',
	'webhooks.subscribe': 'write',
	'webhooks.unsubscribe': 'write',
	'webhooks.listForLink': 'read',
	'webhooks.subscribeToLink': 'write',
	'webhooks.unsubscribeFromLink': 'write',
	'conversions.list': 'read',
	'conversions.create': 'write',
};

describe('linkly plugin definition', () => {
	const plugin = linkly();

	it('registers as linkly with api_key auth and no inbound webhooks', () => {
		expect(plugin.id).toBe('linkly');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes every operation in the Linkly API (28)', () => {
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
		).toEqual(riskLevels);
	});

	it('marks only the domain delete irreversible; trashed links can be restored', () => {
		const meta = plugin.endpointMeta ?? {};
		for (const [name, entry] of Object.entries(meta)) {
			expect((entry as { irreversible?: boolean }).irreversible ?? false).toBe(
				name === 'domains.delete',
			);
		}
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(linklyEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(linklyEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = linkly({
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

describe('linkly key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(linkly({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(linkly(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(linkly(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys: Linkly deliveries go to the subscribed URL', async () => {
		await expect(
			linkly().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
