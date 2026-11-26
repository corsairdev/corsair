import { AuthMissingError } from 'corsair/core';
import { loomio, loomioEndpointSchemas } from './index';

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
	plugin: ReturnType<typeof loomio>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'comments.create',
	'comments.delete',
	'comments.update',
	'discussions.create',
	'discussions.delete',
	'discussions.get',
	'discussions.list',
	'discussions.update',
	'groups.get',
	'groups.list',
	'memberships.list',
	'memberships.manage',
	'polls.create',
	'polls.delete',
	'polls.get',
	'polls.list',
	'polls.update',
	'reports.get',
	'search.query',
	'server.groups.list',
	'server.memberships.list',
	'server.memberships.revoke',
	'server.memberships.sync',
	'server.memberships.update',
	'server.users.create',
	'server.users.deactivate',
	'server.users.deactivateByIdentity',
	'server.users.delete',
	'server.users.deleteByIdentity',
	'server.users.get',
	'server.users.getByIdentity',
	'server.users.list',
	'server.users.reactivate',
	'server.users.reactivateByIdentity',
	'server.users.redact',
	'server.users.redactByIdentity',
	'server.users.update',
	'server.users.updateByIdentity',
	'threads.get',
	'threads.items',
	'threads.list',
	'threads.markdown',
	'webhooks.check',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.list',
	'webhooks.update',
].sort();

describe('loomio plugin definition', () => {
	const plugin = loomio();

	it('registers as loomio with api_key auth and no webhooks', () => {
		expect(plugin.id).toBe('loomio');
		expect(plugin.authConfig).toEqual({ api_key: { account: ['base_url'] } });
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes the full User and Server API (47 operations)', () => {
		const flatten = (node: object, prefix: string): string[] =>
			Object.entries(node).flatMap(([name, value]) =>
				typeof value === 'function'
					? [`${prefix}${name}`]
					: flatten(value as object, `${prefix}${name}.`),
			);
		const nested = flatten(plugin.endpoints ?? {}, '');
		expect(nested).toHaveLength(47);
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
			'groups.list': 'read',
			'groups.get': 'read',
			'discussions.list': 'read',
			'discussions.get': 'read',
			'discussions.create': 'destructive',
			'discussions.update': 'destructive',
			'discussions.delete': 'destructive',
			'comments.create': 'write',
			'comments.update': 'write',
			'comments.delete': 'destructive',
			'threads.list': 'read',
			'threads.get': 'read',
			'threads.items': 'read',
			'threads.markdown': 'read',
			'polls.list': 'read',
			'polls.get': 'read',
			'polls.create': 'destructive',
			'polls.update': 'destructive',
			'polls.delete': 'destructive',
			'memberships.list': 'read',
			'memberships.manage': 'destructive',
			'reports.get': 'read',
			'search.query': 'read',
			'webhooks.list': 'read',
			'webhooks.create': 'write',
			'webhooks.update': 'write',
			'webhooks.delete': 'destructive',
			'webhooks.check': 'destructive',
			'server.groups.list': 'read',
			'server.memberships.list': 'read',
			'server.memberships.sync': 'destructive',
			'server.memberships.update': 'write',
			'server.memberships.revoke': 'destructive',
			'server.users.list': 'read',
			'server.users.create': 'write',
			'server.users.get': 'read',
			'server.users.update': 'write',
			'server.users.delete': 'destructive',
			'server.users.deactivate': 'destructive',
			'server.users.reactivate': 'write',
			'server.users.redact': 'destructive',
			'server.users.getByIdentity': 'read',
			'server.users.updateByIdentity': 'write',
			'server.users.deleteByIdentity': 'destructive',
			'server.users.deactivateByIdentity': 'destructive',
			'server.users.reactivateByIdentity': 'write',
			'server.users.redactByIdentity': 'destructive',
		});
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(loomioEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(loomioEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = loomio({
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

describe('loomio baseUrl option', () => {
	it('normalizes a self-hosted origin', () => {
		expect(
			loomio({ baseUrl: 'https://loomio.example.org/' }).options?.baseUrl,
		).toBe('https://loomio.example.org');
	});

	it('refuses a non-https origin at setup', () => {
		expect(() => loomio({ baseUrl: 'http://loomio.example.org' })).toThrow(
			/base_url/,
		);
	});
});

describe('loomio key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext('stored-key');

		await expect(buildKey(loomio({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored API key', async () => {
		await expect(buildKey(loomio(), keyContext('stored-key'))).resolves.toBe(
			'stored-key',
		);
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(buildKey(loomio(), keyContext(null))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys', async () => {
		await expect(
			loomio().keyBuilder?.(keyContext('stored-key') as never, 'webhook'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
