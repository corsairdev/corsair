import { buildOAuthAuthorizeUrl } from 'corsair/oauth';
import {
	zohoDeskAuthConfig,
	zohoDeskEndpointSchemas,
	zohoDeskOAuthScopes,
	zohodesk,
} from './index';
import { resolveZohoDeskOAuthTenantLink } from './oauth-tenant-link';
import {
	errorBody,
	ORG_ID,
	organization,
	tokenResponse,
} from './test-fixtures';

const operations = [
	'tickets.list',
	'tickets.get',
	'tickets.getResolution',
	'tickets.getLatestThread',
	'tickets.getThread',
	'tickets.listConversations',
	'contacts.list',
	'contacts.get',
	'contacts.getByIds',
	'contacts.listAccounts',
	'agents.get',
	'agents.getCount',
	'departments.list',
	'departments.get',
	'departments.getCount',
	'departments.listTeams',
	'departments.getLogo',
	'departments.uploadLogo',
	'organizations.list',
	'roles.list',
	'roles.listByIds',
	'tasks.updateMany',
];

// The key builder only reads authType, keys and tenantId.
function keyContext() {
	return {
		authType: 'oauth_2',
		options: {},
		tenantId: 'default',
		keys: {
			get_integration_credentials: jest.fn().mockResolvedValue({
				client_id: 'client-id',
				client_secret: 'client-secret',
			}),
			get_access_token: jest.fn().mockResolvedValue('1000.valid'),
			get_expires_at: jest
				.fn()
				.mockResolvedValue(String(Math.floor(Date.now() / 1000) + 3000)),
		},
	};
}

describe('zohodesk plugin definition', () => {
	const plugin = zohodesk();

	it('is the registered zohodesk plugin, on OAuth by default', () => {
		expect(plugin.id).toBe('zohodesk');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.options?.region).toBe('us');
	});

	it('exposes exactly the 22 catalog operations', () => {
		const tree = Object.entries(plugin.endpoints ?? {}).flatMap(
			([group, endpoints]) =>
				Object.keys(endpoints).map((name) => `${group}.${name}`),
		);
		expect(tree.sort()).toEqual([...operations].sort());
		expect(operations).toHaveLength(22);
	});

	it('gives every operation input and output schemas and a description', () => {
		expect(Object.keys(zohoDeskEndpointSchemas).sort()).toEqual(
			[...operations].sort(),
		);
		for (const operation of operations) {
			const schema =
				zohoDeskEndpointSchemas[
					operation as keyof typeof zohoDeskEndpointSchemas
				];
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
			const meta = plugin.endpointMeta?.[
				operation as keyof typeof plugin.endpointMeta
			] as { description?: string } | undefined;
			expect(meta?.description).toBeTruthy();
		}
	});

	it('marks only the two writes as writes', () => {
		const meta = Object.entries(plugin.endpointMeta ?? {}) as [
			string,
			{ riskLevel: string },
		][];
		const writes = meta
			.filter(([, { riskLevel }]) => riskLevel !== 'read')
			.map(([operation, { riskLevel }]) => [operation, riskLevel]);
		expect(writes).toEqual([
			['departments.uploadLogo', 'write'],
			['tasks.updateMany', 'write'],
		]);
	});

	it('has no webhooks, since the catalog lists no triggers', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
		expect(plugin.pluginWebhookMatcher).toBeUndefined();
		expect(plugin.pluginTenantWebhookMatcher).toBeUndefined();
	});

	it('stores the org ID on the account', () => {
		expect(zohoDeskAuthConfig.oauth_2.account).toEqual(['tenant_external_id']);
	});

	it('keeps the rate limit handler, and lets options add to the handlers', () => {
		const custom = { match: () => true, handler: async () => ({}) };
		const { errorHandlers } = zohodesk({
			errorHandlers: { NETWORK_ERROR: custom },
		});
		expect(errorHandlers?.RATE_LIMIT_ERROR).toBeDefined();
		expect(errorHandlers?.NETWORK_ERROR).toBe(custom);
	});

	it('runs an added handler before the catch-all DEFAULT', () => {
		const custom = {
			match: (error: Error) => error.message === 'socket hang up',
			handler: async () => ({ maxRetries: 1 }),
		};
		const handlers = zohodesk({
			errorHandlers: { NETWORK_ERROR: custom },
		}).errorHandlers;
		const context = {
			pluginId: 'zohodesk',
			operation: 'tickets.list',
			input: {},
			originalError: new Error('socket hang up'),
		};

		// Mirrors corsair core: the first handler whose match() passes.
		const first = Object.keys(handlers ?? {}).find((name) =>
			handlers?.[name]?.match(context.originalError, context),
		);

		expect(first).toBe('NETWORK_ERROR');
		expect(Object.keys(handlers ?? {}).at(-1)).toBe('DEFAULT');
	});

	it('lets options replace DEFAULT, and keeps it last', () => {
		const custom = { match: () => true, handler: async () => ({}) };
		const handlers = zohodesk({
			errorHandlers: { DEFAULT: custom, NETWORK_ERROR: custom },
		}).errorHandlers;

		expect(handlers?.DEFAULT).toBe(custom);
		expect(Object.keys(handlers ?? {}).at(-1)).toBe('DEFAULT');
	});
});

describe('zohodesk OAuth config', () => {
	it('asks for offline access so that Zoho issues a refresh token', () => {
		expect(zohodesk().oauthConfig).toMatchObject({
			providerName: 'Zoho',
			authUrl: 'https://accounts.zoho.com/oauth/v2/auth',
			tokenUrl: 'https://accounts.zoho.com/oauth/v2/token',
			tokenAuthMethod: 'body',
			authParams: { access_type: 'offline', prompt: 'consent' },
		});
	});

	it('uses the accounts host of the configured data center', () => {
		expect(zohodesk({ region: 'ca' }).oauthConfig).toMatchObject({
			authUrl: 'https://accounts.zohocloud.ca/oauth/v2/auth',
			tokenUrl: 'https://accounts.zohocloud.ca/oauth/v2/token',
		});
	});

	it('uses the accounts host named by apiDomain', () => {
		const plugin = zohodesk({ apiDomain: 'https://api.zoho.eu' });
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://accounts.zoho.eu/oauth/v2/token',
		);
	});

	it('sends scopes comma-separated in the real authorize URL', () => {
		const { oauthConfig } = zohodesk();
		if (!oauthConfig) throw new Error('oauthConfig is required');

		const url = new URL(
			buildOAuthAuthorizeUrl({
				oauthConfig,
				clientId: 'client-id',
				redirectUri: 'https://app.example/callback',
				state: 'state',
			}),
		);

		expect(url.searchParams.get('scope')).toBe(zohoDeskOAuthScopes.join(','));
		expect(url.searchParams.get('access_type')).toBe('offline');
	});

	it('requests a scope for each resource the operations touch', () => {
		expect(zohoDeskOAuthScopes).toEqual(
			expect.arrayContaining([
				'Desk.tickets.READ',
				'Desk.contacts.READ',
				'Desk.accounts.READ',
				'Desk.agents.READ',
				'Desk.basic.READ',
				'Desk.departments.READ',
				'Desk.departments.UPDATE',
				'Desk.teams.READ',
				'Desk.organization.READ',
				'Desk.permissions.READ',
				'Desk.activities.tasks.UPDATE',
			]),
		);
	});
});

describe('zohodesk factory validation', () => {
	it('rejects a host that is not a Zoho data center', () => {
		expect(() => zohodesk({ apiDomain: 'https://attacker.example' })).toThrow(
			'[zohodesk] apiDomain',
		);
	});

	it.each(['abc', '123\r\nX-Injected: 1'])(
		'rejects the orgId %j, which goes into a header',
		(orgId) => {
			expect(() => zohodesk({ orgId })).toThrow('numeric Zoho Desk org ID');
		},
	);

	it('accepts a numeric orgId', () => {
		expect(zohodesk({ orgId: ORG_ID }).options?.orgId).toBe(ORG_ID);
	});
});

describe('zohodesk key builder', () => {
	// The fake context is not a full KeyBuilderContext.
	const build = (plugin: ReturnType<typeof zohodesk>, ctx: unknown) =>
		plugin.keyBuilder?.(ctx as never, 'endpoint');

	it('prefers a static key', async () => {
		await expect(
			build(zohodesk({ key: 'static-token' }), keyContext()),
		).resolves.toBe('static-token');
	});

	it('returns a stored token that is still valid', async () => {
		await expect(build(zohodesk(), keyContext())).resolves.toBe('1000.valid');
	});

	it('fails with an auth error for any other auth type', async () => {
		await expect(
			build(zohodesk(), { ...keyContext(), authType: 'api_key' }),
		).rejects.toThrow('zohodesk');
	});
});

describe('resolveZohoDeskOAuthTenantLink', () => {
	let fetchMock: jest.SpyInstance;

	// unknown: response bodies are arbitrary JSON.
	function respond(body: unknown, status = 200) {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify(body), {
				status,
				headers: { 'Content-Type': 'application/json' },
			}),
		);
	}

	function sent() {
		const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
		return { url, headers: new Headers(init.headers) };
	}

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('stores the only org the user belongs to', async () => {
		respond({ data: [organization] });

		await expect(
			resolveZohoDeskOAuthTenantLink(tokenResponse('1000.new')),
		).resolves.toEqual({ linkType: 'tenant_external_id', externalId: ORG_ID });
		expect(sent().url).toBe('https://desk.zoho.com/api/v1/organizations');
		expect(sent().headers.get('authorization')).toBe(
			'Zoho-oauthtoken 1000.new',
		);
		expect(sent().headers.has('orgId')).toBe(false);
	});

	it('reads the data center from api_domain, not the literal host', async () => {
		respond({ data: [organization] });

		await resolveZohoDeskOAuthTenantLink({
			...tokenResponse('1000.new'),
			api_domain: 'https://www.zohoapis.in',
		});

		expect(sent().url).toBe('https://desk.zoho.in/api/v1/organizations');
	});

	it('reads the data center from the callback location', async () => {
		respond({ data: [organization] });

		await resolveZohoDeskOAuthTenantLink({
			access_token: '1000.new',
			location: 'sa',
		});

		expect(sent().url).toBe('https://desk.zoho.sa/api/v1/organizations');
	});

	it('falls back to the configured data center', async () => {
		respond({ data: [organization] });

		await resolveZohoDeskOAuthTenantLink({ access_token: '1000.new' }, 'jp');

		expect(sent().url).toBe('https://desk.zoho.jp/api/v1/organizations');
	});

	it('is wired into the plugin with the configured data center', async () => {
		respond({ data: [organization] });

		await zohodesk({ region: 'eu' }).oauthWebhookTenantLinkResolver?.({
			access_token: '1000.new',
		});

		expect(sent().url).toBe('https://desk.zoho.eu/api/v1/organizations');
	});

	it('never sends the token to a host from the token response', async () => {
		respond({ data: [organization] });

		await resolveZohoDeskOAuthTenantLink({
			access_token: '1000.new',
			api_domain: 'https://attacker.example',
		});

		expect(sent().url).toBe('https://desk.zoho.com/api/v1/organizations');
	});

	it('does not guess between several orgs', async () => {
		respond({
			data: [
				{ id: '1', isDefault: true },
				{ id: '2', isDefault: false },
			],
		});

		await expect(
			resolveZohoDeskOAuthTenantLink({ access_token: '1000.new' }),
		).resolves.toBeNull();
	});

	it('uses an ID already in the token data, without a call', async () => {
		await expect(
			resolveZohoDeskOAuthTenantLink({ tenant_external_id: ORG_ID }),
		).resolves.toEqual({ linkType: 'tenant_external_id', externalId: ORG_ID });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('returns null without a token', async () => {
		await expect(resolveZohoDeskOAuthTenantLink({})).resolves.toBeNull();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('does not fail the connection when the lookup fails', async () => {
		respond(errorBody('SCOPE_MISMATCH'), 403);

		await expect(
			resolveZohoDeskOAuthTenantLink({ access_token: '1000.new' }),
		).resolves.toBeNull();
	});
});
