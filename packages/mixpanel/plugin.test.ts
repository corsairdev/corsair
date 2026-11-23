import { AuthMissingError } from 'corsair/core';
import { mixpanel, mixpanelAuthConfig, mixpanelEndpointSchemas } from './index';

// The key builder only reads the username and secret accessors plus authType.
function keyContext(stored: {
	username?: string | null;
	secret?: string | null;
}) {
	return {
		authType: 'api_key' as const,
		options: {},
		tenantId: 'default',
		keys: {
			get_service_account_username: jest
				.fn()
				.mockResolvedValue(stored.username),
			get_service_account_secret: jest.fn().mockResolvedValue(stored.secret),
			get_project_id: jest.fn().mockResolvedValue('3141592'),
		},
	};
}

function buildKey(
	plugin: ReturnType<typeof mixpanel>,
	ctx: ReturnType<typeof keyContext>,
) {
	// The fake context is not a full KeyBuilderContext.
	return plugin.keyBuilder?.(ctx as never, 'endpoint');
}

const operations = [
	'cohorts.list',
	'events.import',
	'export.events',
	'funnels.list',
	'insights.query',
	'profiles.query',
	'retention.query',
];

describe('mixpanel plugin definition', () => {
	const plugin = mixpanel();

	it('registers as mixpanel with api_key auth, a region default and no webhooks', () => {
		expect(plugin.id).toBe('mixpanel');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.options?.region).toBe('us');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('declares the extra account credential fields', () => {
		expect(mixpanelAuthConfig.api_key?.account).toEqual([
			'service_account_username',
			'service_account_secret',
			'project_id',
		]);
	});

	it('exposes exactly the seven catalog operations across seven groups', () => {
		const nested = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual(operations);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(7);
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
			'events.import': 'write',
			'profiles.query': 'read',
			'cohorts.list': 'read',
			'insights.query': 'read',
			'funnels.list': 'read',
			'retention.query': 'read',
			'export.events': 'read',
		});
	});

	it('has input and output schemas for every endpoint', () => {
		expect(Object.keys(mixpanelEndpointSchemas).sort()).toEqual(operations);
		for (const schemas of Object.values(mixpanelEndpointSchemas)) {
			expect(typeof schemas.input.safeParse).toBe('function');
			expect(typeof schemas.output.safeParse).toBe('function');
		}
	});

	it('keeps DEFAULT last when caller handlers are merged', () => {
		const custom = mixpanel({
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

describe('mixpanel key builder', () => {
	it('prefers the inline service account pair', async () => {
		const ctx = keyContext({
			username: 'stored-user',
			secret: 'stored-secret',
		});

		await expect(
			buildKey(
				mixpanel({
					serviceAccountUsername: 'inline-user',
					serviceAccountSecret: 'inline-secret',
				}),
				ctx,
			),
		).resolves.toBe('inline-user:inline-secret');
		expect(ctx.keys.get_service_account_username).not.toHaveBeenCalled();
	});

	it('joins the stored username and secret', async () => {
		await expect(
			buildKey(
				mixpanel(),
				keyContext({ username: 'stored-user', secret: 'stored-secret' }),
			),
		).resolves.toBe('stored-user:stored-secret');
	});

	it('throws AuthMissingError when the secret is missing', async () => {
		await expect(
			buildKey(mixpanel(), keyContext({ username: 'stored-user' })),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws AuthMissingError when nothing is stored', async () => {
		await expect(buildKey(mixpanel(), keyContext({}))).rejects.toBeInstanceOf(
			AuthMissingError,
		);
	});

	it('refuses webhook keys: there are no inbound webhooks', async () => {
		await expect(
			mixpanel().keyBuilder?.(
				keyContext({ username: 'u', secret: 's' }) as never,
				'webhook',
			),
		).rejects.toBeInstanceOf(AuthMissingError);
	});
});
