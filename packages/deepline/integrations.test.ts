import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import * as auth from './endpoints/auth';
import * as integrations from './endpoints/integrations';
import * as secrets from './endpoints/secrets';
import * as tools from './endpoints/tools';
import * as workspace from './endpoints/workspace';
import type { DeeplineContext } from './index';
import { integrationsMeta, integrationsSchemas } from './registry-integrations';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));
const fetchMock = jest.fn();
const originalFetch = global.fetch;
const ctx = {
	key: 'tenant-resolved-key',
	database: {},
	options: { key: 'wrong-option-key' },
} as DeeplineContext;
const SECRET = 'sk-live-TOP-SECRET-9f3a';
const OTHER_SECRET = 'client-secret-7c1e';

function reply(value: unknown, status = 200) {
	return new Response(JSON.stringify(value), {
		status,
		headers: { 'Content-Type': 'application/json' },
	});
}
beforeEach(() => {
	jest.clearAllMocks();
	fetchMock.mockReset();
	global.fetch = fetchMock;
});
afterAll(() => {
	global.fetch = originalFetch;
});
function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return { url: new URL(url), init };
}

const assumptions = {
	modelCallCount: 1,
	planningModelCallCount: 1,
	estimatedInputTokens: 22,
	estimatedOutputTokens: 200,
	maxOutputTokens: null,
	candidateRouteCount: 1,
	pricedRouteCount: 1,
	inputBound: 'proven_request_tokens',
};
const secretMeta = {
	_id: 'sec_1',
	orgId: 'org_1',
	scope: 'org',
	name: 'HUBSPOT_TOKEN',
	note: 'Chrome extension',
	status: 'active',
	hasValue: true,
	createdAt: 1,
	updatedAt: 2,
};
const playSecretMeta = {
	...secretMeta,
	_id: 'sec_2',
	scope: 'play',
	playName: 'hubspot-sync',
};

// Fixtures follow live responses (2026-11-17) where an op was read live, and the
// SDK return types where it is a write.
const cases = [
	{
		name: 'tools.providers',
		call: () => tools.providers(ctx, { changed: true }),
		path: '/api/v2/tools/providers',
		query: { changed: 'true' },
		response: {
			success: true,
			providers: [
				{
					provider: 'clay',
					displayName: 'Clay Enterprise',
					toolCount: 13,
					categories: ['automation'],
					version: '1.0.0',
					releasedAt: '2026-08-21',
				},
			],
			total: 1,
			filters: { changed: true },
		},
	},
	{
		name: 'tools.quote',
		call: () =>
			tools.quote(ctx, {
				toolId: 'ai_inference',
				payload: { model: 'openai/gpt-4o-mini', prompt: 'Say hi' },
			}),
		path: '/api/v2/integrations/ai_inference/quote',
		method: 'POST',
		body: { model: 'openai/gpt-4o-mini', prompt: 'Say hi' },
		response: {
			quality: 'bounded_max',
			estimate: { quality: 'estimate_only', credits: 0.002, assumptions },
			authorization: {
				quality: 'bounded_max',
				maximumCredits: 0.241,
				assumptions,
			},
			settlement: 'actual_usage',
		},
	},
	{
		name: 'tools.describeModel',
		call: () => tools.describeModel(ctx, { model: 'openai/gpt-4o-mini' }),
		path: '/api/v2/models/describe',
		query: { model: 'openai/gpt-4o-mini' },
		response: {
			schemaVersion: 1,
			model: 'openai/gpt-4o-mini',
			provider: 'openai',
			modelMetadata: { id: 'openai/gpt-4o-mini', context_window: 128000 },
			providerOptions: {
				gateway: { provider: 'gateway', fields: [] },
				selectedProvider: { provider: 'openai', fields: [] },
			},
			exampleInput: {
				model: 'openai/gpt-4o-mini',
				providerOptions: { gateway: { serviceTier: 'priority' } },
			},
			caveats: ['Generated provider option schemas describe shapes.'],
			sources: ['https://ai-gateway.vercel.sh/v1/models'],
			inferencePricing: {
				settlement: 'actual_usage',
				staticUnitPrice: null,
				quoteEndpointTemplate: '/api/v2/integrations/{toolId}/quote',
			},
		},
	},
	{
		name: 'integrations.connectLink',
		call: () => integrations.connectLink(ctx, { provider: 'hubspot' }),
		path: '/api/v2/integrations/connect',
		query: { provider: 'hubspot' },
		response: {
			provider: 'hubspot',
			connect_url:
				'https://code.deepline.com/dashboard/integrations?connect=hubspot',
		},
	},
	{
		name: 'integrations.setCredentials',
		call: () =>
			integrations.setCredentials(ctx, {
				provider: 'leadmagic',
				credentials: { api_key: SECRET },
				expectedConnectionId: 'conn_1',
			}),
		path: '/api/v2/integrations/connect',
		method: 'POST',
		body: {
			provider: 'leadmagic',
			credentials: { api_key: SECRET },
			expected_connection_id: 'conn_1',
		},
		response: { ok: true, credential_saved: true },
	},
	{
		name: 'integrations.startOAuth',
		call: () =>
			integrations.startOAuth(ctx, {
				provider: 'hubspot',
				preset: 'crm',
				scopes: ['crm.objects.contacts.read'],
				optionalScopes: ['crm.objects.deals.read'],
			}),
		path: '/api/v2/integrations/connect',
		method: 'POST',
		body: {
			provider: 'hubspot',
			preset: 'crm',
			scopes: ['crm.objects.contacts.read'],
			optional_scopes: ['crm.objects.deals.read'],
		},
		response: { ok: true, redirect_url: 'https://app.hubspot.com/oauth/x' },
	},
	{
		name: 'integrations.balance',
		call: () => integrations.balance(ctx, { provider: 'leadmagic' }),
		path: '/api/v2/integrations/balance',
		query: { provider: 'leadmagic' },
		response: {
			provider: 'leadmagic',
			credentialScope: 'customer',
			unit: 'credits',
			observedAt: '2026-11-17T10:00:00Z',
			balance: { value: 120, status: 'reported', source: 'leadmagic' },
		},
	},
	{
		name: 'secrets.list',
		call: () => secrets.list(ctx, {}),
		path: '/api/v2/secrets',
		response: { secrets: [secretMeta, playSecretMeta] },
	},
	{
		name: 'secrets.inspect',
		call: () =>
			secrets.inspect(ctx, {
				name: ' hubspot_token ',
				playName: 'hubspot-sync',
			}),
		path: '/api/v2/secrets',
		query: { name: 'HUBSPOT_TOKEN', play: 'hubspot-sync' },
		response: {
			ok: true,
			name: 'HUBSPOT_TOKEN',
			playName: 'hubspot-sync',
			reason: 'active',
			secret: playSecretMeta,
		},
	},
	{
		name: 'secrets.set',
		call: () =>
			secrets.set(ctx, {
				name: 'hubspot_token',
				value: SECRET,
				playName: 'hubspot-sync',
				note: 'Chrome extension',
			}),
		path: '/api/v2/secrets',
		method: 'POST',
		body: {
			name: 'HUBSPOT_TOKEN',
			value: SECRET,
			scope: 'play',
			playName: 'hubspot-sync',
			note: 'Chrome extension',
		},
		response: { secret: playSecretMeta },
	},
	{
		name: 'secrets.updateNote',
		call: () => secrets.updateNote(ctx, { secretId: 'sec/1 ?#', note: '' }),
		path: '/api/v2/secrets/sec%2F1%20%3F%23',
		method: 'PATCH',
		body: { note: '' },
		response: { secret: secretMeta },
	},
	{
		name: 'workspace.members.list',
		call: () => workspace.members.list(ctx, { cursor: 'next' }),
		path: '/api/v2/auth/workspace/members',
		query: { cursor: 'next' },
		response: {
			members: [
				{
					id: 'm1',
					userId: 'u1',
					role: 'owner',
					grants: ['read', 'run', 'author', 'admin'],
				},
			],
			cursor: null,
		},
	},
	{
		name: 'workspace.serviceAccounts.list',
		call: () => workspace.serviceAccounts.list(ctx, {}),
		path: '/api/v2/auth/workspace/service-accounts',
		response: {
			serviceAccounts: [
				{
					id: 'sa1',
					userId: 'u2',
					memberId: null,
					name: 'prod sync',
					role: 'run',
					createdAt: 1,
					createdByUserId: 'u1',
					activeKeyCount: 1,
					lastUsedAt: null,
					keys: [
						{
							id: 'k1',
							keyPrefix: 'dl_',
							keyLast4: 'ab12',
							status: 'active',
							createdAt: 1,
							lastUsedAt: null,
						},
					],
				},
			],
		},
	},
	{
		name: 'auth.status',
		call: () => auth.status(ctx, {}),
		path: '/api/v2/auth/cli/status',
		method: 'POST',
		body: {},
		response: {
			status: 'claimed',
			rate_limit_tier: 'standard',
			api_key_id: 'key_1',
			user_id: 'u1',
			org_id: 'org_1',
			org_name: 'Team',
			org_slug: 'team',
			features: ['github-deploy'],
		},
	},
];

describe('Group C HTTP contracts', () => {
	it.each(cases)(
		'$name sends the documented request and validates the result',
		async (test) => {
			fetchMock.mockResolvedValueOnce(reply(test.response));
			expect(await test.call()).toEqual(test.response);
			const { url, init } = lastRequest();
			expect(url.origin).toBe('https://code.deepline.com');
			expect(url.pathname).toBe(test.path);
			expect(init.method).toBe('method' in test ? test.method : 'GET');
			expect(new Headers(init.headers).get('Authorization')).toBe(
				'Bearer tenant-resolved-key',
			);
			expect(Object.fromEntries(url.searchParams)).toEqual(
				'query' in test ? test.query : {},
			);
			if ('body' in test)
				expect(JSON.parse(String(init.body))).toEqual(test.body);
			else expect(init.body ?? undefined).toBeUndefined();
			// Only the event name is recorded, never the input or output.
			expect(logEventFromContext).toHaveBeenCalledWith(
				ctx,
				`deepline.${test.name}`,
				{},
				'completed',
			);
		},
	);
	it('covers every registered Group C operation', () => {
		expect(cases.map((t) => t.name).sort()).toEqual(
			Object.keys(integrationsSchemas).sort(),
		);
		expect(Object.keys(integrationsMeta).sort()).toEqual(
			Object.keys(integrationsSchemas).sort(),
		);
	});
	it.each(cases)('$name rejects a malformed success response', async (test) => {
		fetchMock.mockResolvedValueOnce(reply({ unrelated: true }));
		await expect(test.call()).rejects.toThrow();
		expect(logEventFromContext).not.toHaveBeenCalled();
	});
	it('omits changed when false and keeps the auth key out of the status body', async () => {
		fetchMock.mockResolvedValueOnce(reply({ providers: [] }));
		await tools.providers(ctx, { changed: false });
		expect(lastRequest().url.search).toBe('');
		fetchMock.mockResolvedValueOnce(reply({ status: 'claimed' }));
		await auth.status(ctx, {});
		expect(String(lastRequest().init.body)).not.toContain(ctx.key);
	});
	it('defaults secret scope to org and inspects the org secret without play', async () => {
		fetchMock.mockResolvedValueOnce(reply({ secret: secretMeta }));
		await secrets.set(ctx, { name: 'HUBSPOT_TOKEN', value: SECRET });
		expect(JSON.parse(String(lastRequest().init.body))).toEqual({
			name: 'HUBSPOT_TOKEN',
			value: SECRET,
			scope: 'org',
		});
		fetchMock.mockResolvedValueOnce(
			reply({
				ok: false,
				reason: 'missing',
				secret: null,
				name: 'HUBSPOT_TOKEN',
				playName: null,
			}),
		);
		await secrets.inspect(ctx, { name: 'HUBSPOT_TOKEN' });
		expect(Object.fromEntries(lastRequest().url.searchParams)).toEqual({
			name: 'HUBSPOT_TOKEN',
		});
	});
	it('validates inputs before any HTTP call', async () => {
		const invalid = [
			() =>
				tools.quote(ctx, {
					toolId: 'hunter_email_finder' as never,
					payload: {},
				}),
			() => tools.describeModel(ctx, { model: ' ' }),
			() => integrations.connectLink(ctx, { provider: 'hub/spot' }),
			() =>
				integrations.setCredentials(ctx, {
					provider: 'leadmagic',
					credentials: {},
				}),
			() =>
				integrations.setCredentials(ctx, {
					provider: 'leadmagic',
					credentials: { api_key: '' },
				}),
			() => integrations.startOAuth(ctx, { provider: 'hubspot', scopes: [] }),
			() =>
				integrations.startOAuth(ctx, { provider: 'hubspot', scopes: [' '] }),
			() => integrations.balance(ctx, { provider: '' }),
			() => secrets.inspect(ctx, { name: '1BAD' }),
			() => secrets.inspect(ctx, { name: 'OK_NAME', playName: 'org/play' }),
			() => secrets.set(ctx, { name: 'TOKEN', value: '' }),
			() => secrets.set(ctx, { name: 'TOKEN', value: SECRET, scope: 'play' }),
			() =>
				secrets.set(ctx, {
					name: 'TOKEN',
					value: SECRET,
					scope: 'org',
					playName: 'demo',
				}),
			() => secrets.updateNote(ctx, { secretId: '..', note: 'x' }),
			() => secrets.updateNote(ctx, { secretId: '.', note: 'x' }),
			() => workspace.serviceAccounts.list(ctx, { extra: 1 } as never),
		];
		for (const call of invalid) await expect(call()).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('marks credential writes destructive, config edits write and the rest read', () => {
		const expected: Record<string, string> = {
			'integrations.setCredentials': 'destructive',
			'secrets.set': 'destructive',
			'integrations.startOAuth': 'write',
			'secrets.updateNote': 'write',
		};
		for (const [name, entry] of Object.entries(integrationsMeta))
			expect(entry.riskLevel).toBe(expected[name] ?? 'read');
	});
});

describe('credential values never leak', () => {
	const credentialCalls = [
		{
			name: 'integrations.setCredentials',
			call: () =>
				integrations.setCredentials(ctx, {
					provider: 'leadmagic',
					credentials: { api_key: SECRET, client_secret: OTHER_SECRET },
				}),
		},
		{
			name: 'secrets.set',
			call: () => secrets.set(ctx, { name: 'LEADMAGIC_KEY', value: SECRET }),
		},
	];
	function leakText(error: unknown) {
		const e = error as Error;
		return `${String(e)} ${e.message} ${String(e.stack)} ${JSON.stringify(e)} ${JSON.stringify(
			Object.getOwnPropertyNames(e).map((k) => (e as never)[k]),
		)}`;
	}
	const statuses = [400, 401, 403, 409, 422, 500];
	it.each(
		credentialCalls.flatMap((c) =>
			statuses.map((status) => ({ ...c, status })),
		),
	)(
		'$name: HTTP $status error is sanitized and not retried',
		async ({ call, status }) => {
			fetchMock.mockResolvedValueOnce(
				reply(
					{
						error: `invalid credential ${SECRET}`,
						echo: {
							credentials: { api_key: SECRET, client_secret: OTHER_SECRET },
						},
					},
					status,
				),
			);
			let caught: unknown;
			try {
				await call();
			} catch (e) {
				caught = e;
			}
			expect(caught).toBeInstanceOf(ApiError);
			expect((caught as ApiError).status).toBe(status);
			const text = leakText(caught);
			expect(text).not.toContain(SECRET);
			expect(text).not.toContain(OTHER_SECRET);
			expect(text).not.toContain(ctx.key);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			expect(logEventFromContext).not.toHaveBeenCalled();
		},
	);
	it.each(credentialCalls)(
		'$name: a malformed response that echoes the value fails without quoting it',
		async ({ call }) => {
			fetchMock.mockResolvedValueOnce(
				reply({
					ok: SECRET,
					secret: { value: SECRET, name: SECRET },
					credentials: { api_key: SECRET, client_secret: OTHER_SECRET },
				}),
			);
			let caught: unknown;
			try {
				await call();
			} catch (e) {
				caught = e;
			}
			expect(caught).toBeDefined();
			const text = leakText(caught);
			expect(text).not.toContain(SECRET);
			expect(text).not.toContain(OTHER_SECRET);
		},
	);
	it('setCredentials strips echoed credentials from a successful response', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({
				ok: true,
				credential_saved: true,
				credentials: { api_key: SECRET },
				api_key: SECRET,
			}),
		);
		const result = await integrations.setCredentials(ctx, {
			provider: 'leadmagic',
			credentials: { api_key: SECRET },
		});
		expect(result).toEqual({ ok: true, credential_saved: true });
		expect(JSON.stringify(result)).not.toContain(SECRET);
	});
	it('secret metadata responses strip any value field', async () => {
		fetchMock.mockResolvedValueOnce(
			reply({ secret: { ...secretMeta, value: SECRET }, value: SECRET }),
		);
		const saved = await secrets.set(ctx, {
			name: 'HUBSPOT_TOKEN',
			value: SECRET,
		});
		expect(saved).toEqual({ secret: secretMeta });
		fetchMock.mockResolvedValueOnce(
			reply({ secrets: [{ ...secretMeta, value: SECRET, plaintext: SECRET }] }),
		);
		const listed = await secrets.list(ctx, {});
		expect(JSON.stringify(listed)).not.toContain(SECRET);
		fetchMock.mockResolvedValueOnce(
			reply({
				ok: true,
				name: 'HUBSPOT_TOKEN',
				playName: null,
				reason: 'active',
				secret: { ...secretMeta, value: SECRET },
				value: SECRET,
			}),
		);
		const inspected = await secrets.inspect(ctx, { name: 'HUBSPOT_TOKEN' });
		expect(JSON.stringify(inspected)).not.toContain(SECRET);
	});
	it('input validation errors name the field, not the credential value', async () => {
		let caught: unknown;
		try {
			await integrations.setCredentials(ctx, {
				provider: `bad/${SECRET}`,
				credentials: { api_key: SECRET, numeric: 5 as never },
			});
		} catch (e) {
			caught = e;
		}
		expect(caught).toBeDefined();
		expect(leakText(caught)).not.toContain(SECRET);
		caught = undefined;
		try {
			await secrets.set(ctx, {
				name: 'TOKEN',
				value: SECRET,
				scope: 'play',
			});
		} catch (e) {
			caught = e;
		}
		expect(caught).toBeDefined();
		expect(leakText(caught)).not.toContain(SECRET);
		expect(fetchMock).not.toHaveBeenCalled();
	});
	it('a network failure on a credential write is not retried', async () => {
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
		await expect(
			integrations.setCredentials(ctx, {
				provider: 'leadmagic',
				credentials: { api_key: SECRET },
			}),
		).rejects.toThrow('fetch failed');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});
});
