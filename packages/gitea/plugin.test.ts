import { AuthMissingError } from 'corsair/core';
import { GITEA_OPERATIONS, gitea, giteaEndpointSchemas } from './index';

// The key builder reads authType, options.key and the two account accessors.
function keyContext(fields: {
	apiKey?: string | null;
	instanceUrl?: string | null;
}) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_api_key: jest.fn().mockResolvedValue(fields.apiKey ?? null),
			get_instance_url: jest.fn().mockResolvedValue(fields.instanceUrl ?? null),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof gitea>,
	ctx: ReturnType<typeof keyContext>,
) {
	// unknown: the fixture only implements the two accessors the key builder
	// reads, not the full AccountKeyManager.
	return plugin.keyBuilder?.(
		// unknown: the fixture only implements the two accessors the key builder
	// reads, not the full AccountKeyManager.
	ctx as unknown as Parameters<NonNullable<typeof plugin.keyBuilder>>[0], // unknown: see note above
		'endpoint',
	);
}

const operations = [
	'branches.list',
	'comments.create',
	'comments.list',
	'commits.list',
	'issues.create',
	'issues.get',
	'issues.list',
	'issues.update',
	'releases.create',
	'releases.list',
	'repos.create',
	'repos.delete',
	'repos.get',
	'repos.list',
	'user.me',
	'webhooks.create',
	'webhooks.delete',
	'webhooks.list',
];

const riskMap = {
	'user.me': 'read',
	'repos.list': 'read',
	'repos.get': 'read',
	'repos.create': 'write',
	'repos.delete': 'destructive',
	'branches.list': 'read',
	'commits.list': 'read',
	'issues.list': 'read',
	'issues.get': 'read',
	'issues.create': 'write',
	'issues.update': 'write',
	'comments.list': 'read',
	'comments.create': 'write',
	'releases.list': 'read',
	'releases.create': 'write',
	'webhooks.list': 'read',
	'webhooks.create': 'write',
	'webhooks.delete': 'destructive',
};

describe('gitea plugin definition', () => {
	const plugin = gitea();

	it('registers as gitea with api_key auth and no inbound webhooks', () => {
		expect(plugin.id).toBe('gitea');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
		// Deliveries are not handled, only registrations are managed through
		// webhooks.*; no webhook secret is configured anywhere.
		expect(Object.keys(plugin.options ?? {})).not.toContain('webhookSecret');
	});

	it('exposes exactly the 18 catalog operations across 8 groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toEqual([
			'user',
			'repos',
			'branches',
			'commits',
			'issues',
			'comments',
			'releases',
			'webhooks',
		]);
		expect(GITEA_OPERATIONS).toHaveLength(18);
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
		).toEqual(riskMap);
		// The two deletes are the only irreversible operations.
		expect(
			Object.entries(meta)
				.filter(([, entry]) => entry.irreversible)
				.map(([name]) => name)
				.sort(),
		).toEqual(['repos.delete', 'webhooks.delete']);
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(giteaEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(giteaEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('declares the instance URL as an account-level api_key field', () => {
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['instance_url'] },
		});
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = gitea({
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

describe('gitea key builder', () => {
	it('prefers an explicit key option', async () => {
		const ctx = keyContext({
			apiKey: 'stored-key',
			instanceUrl: 'https://git.example.com',
		});

		await expect(buildKey(gitea({ key: 'option-key' }), ctx)).resolves.toBe(
			'option-key',
		);
		expect(ctx.keys.get_api_key).not.toHaveBeenCalled();
	});

	it('reads the stored key when the instance URL is set', async () => {
		await expect(
			buildKey(
				gitea(),
				keyContext({
					apiKey: 'stored-key',
					instanceUrl: 'https://git.example.com/api/v1',
				}),
			),
		).resolves.toBe('stored-key');
	});

	it('throws AuthMissingError when no API key is stored', async () => {
		await expect(
			buildKey(gitea(), keyContext({ instanceUrl: 'https://git.example.com' })),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when no instance URL is stored', async () => {
		await expect(
			buildKey(gitea(), keyContext({ apiKey: 'stored-key' })),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('rejects a stored instance URL that is not an http(s) URL', async () => {
		await expect(
			buildKey(
				gitea(),
				keyContext({ apiKey: 'stored-key', instanceUrl: 'git.example.com' }),
			),
		).rejects.toThrow('absolute http(s) URL');
	});

	it('refuses webhook keys: deliveries are not handled', async () => {
		await expect(
			gitea().keyBuilder?.(
				keyContext({ apiKey: 'stored-key' }) as never,
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
