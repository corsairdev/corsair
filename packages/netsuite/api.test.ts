import { generateKeyPairSync, verify } from 'node:crypto';
import {
	makeNetSuiteRequest,
	netSuiteAccountBase,
	netSuiteOAuthTokenUrl,
	normalizeAccountHost,
} from './client';
import { NetSuite } from './endpoints';
import type { NetSuiteSpecKey, RouteSpec } from './endpoints/specs';
import { netSuiteSpecs } from './endpoints/specs';
import {
	NetSuiteEndpointInputSchemas,
	NetSuiteEndpointOutputSchemas,
} from './endpoints/types';
import { netsuite } from './index';

const ACCOUNT = 'TSTDRV123';
const TOKEN = 'test-token';

const { publicKey, privateKey } = generateKeyPairSync('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: { type: 'spki', format: 'pem' },
	privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

function jsonResponse(body: unknown, status = 200) {
	return {
		ok: status < 400,
		status,
		statusText: status === 200 ? 'OK' : 'Error',
		headers: new Headers({ 'content-type': 'application/json' }),
		text: async () => JSON.stringify(body),
		json: async () => body,
		arrayBuffer: async () => Buffer.from(JSON.stringify(body)),
	};
}

function header(init: RequestInit, name: string): string | null {
	return new Headers(
		init.headers as ConstructorParameters<typeof Headers>[0],
	).get(name);
}

function mockCtx() {
	return {
		key: TOKEN,
		options: {
			accountId: ACCOUNT,
			clientId: 'client-id',
			clientSecret: 'client-secret',
			certificateId: 'cert-id',
			privateKeyPem: privateKey,
		},
		keys: {
			get_access_token: async () => TOKEN,
			get_account_id: async () => ACCOUNT,
			get_refresh_token: async () => 'refresh-token',
		},
		$getAccountId: async () => 'account-row',
		database: undefined,
	};
}

const overrides: Record<string, unknown> = {
	record_type: 'customer',
	recordType: 'customer',
	item_record_type: 'inventoryItem',
	itemRecordType: 'inventoryItem',
	item_type: 'inventoryItem',
	id: 1,
	jobId: '1',
	job_id: '1',
	taskId: '1',
	task_id: '1',
	dataset_id: '1',
	line_id: '1',
	record_id: '1',
	source_record_type: 'salesOrder',
	target_record_type: 'invoice',
	external_id: 'ext-1',
	sublist_name: 'item',
	subrecord_name: 'address',
	select_field: 'entity',
	select: 'id',
	account: ACCOUNT,
	c: '1',
	q: 'SELECT id FROM customer',
	code: 'auth-code',
	redirect_uri: 'https://example.com/callback',
	code_verifier: 'verifier',
	client_id: 'client-id',
	client_secret: 'client-secret',
	certificate_id: 'cert-id',
	private_key_pem: privateKey,
	state: 'state',
	scope: 'rest_webservices',
	client_assertion: 'assertion',
	client_assertion_type:
		'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
	refresh_token: 'refresh-token',
	token: 'refresh-token',
	id_token_hint: 'id-token',
};

function sampleFor(field: unknown): unknown {
	const schema = field as {
		safeParse: (value: unknown) => { success: boolean };
	};
	const candidates = [
		'test',
		'customer',
		'inventoryItem',
		'rest_webservices',
		'application/json',
		'authorization_code',
		'client_credentials',
		'refresh_token',
		'code',
		1,
		true,
		{},
		[],
	];
	for (const candidate of candidates) {
		if (schema.safeParse(candidate).success) return candidate;
	}
	return 'test';
}

function inputFor(key: NetSuiteSpecKey): Record<string, unknown> {
	const schema = NetSuiteEndpointInputSchemas[key] as unknown as {
		shape: Record<string, unknown>;
	};
	const input: Record<string, unknown> = {
		...(key === 'createJwtClientAssertion'
			? {
					scope: 'rest_webservices',
					client_id: 'client-id',
					certificate_id: 'cert-id',
					private_key_pem: privateKey,
					alg: 'RS256',
				}
			: {}),
	};
	for (const [field, definition] of Object.entries(schema.shape)) {
		if (field in input) continue;
		const zod = definition as {
			safeParse: (value: unknown) => { success: boolean };
		};
		if (zod.safeParse(undefined).success) {
			if (field in overrides) input[field] = overrides[field];
			continue;
		}
		input[field] = field in overrides ? overrides[field] : sampleFor(zod);
	}
	return input;
}

const specs = netSuiteSpecs as Record<
	NetSuiteSpecKey,
	(typeof netSuiteSpecs)[NetSuiteSpecKey]
>;
const keys = Object.keys(specs) as NetSuiteSpecKey[];

describe('NetSuite plugin', () => {
	it('wires OAuth2, 85 endpoints, schemas and metadata', () => {
		const plugin = netsuite();
		expect(plugin.id).toBe('netsuite');
		expect(plugin.options?.authType).toBe('oauth_2');
		expect(plugin.oauthConfig?.scopes).toEqual(['rest_webservices']);
		expect(plugin.webhooks).toEqual({});
		expect(keys).toHaveLength(85);
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(85);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(85);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(85);
		expect(plugin.endpointMeta?.oauth2RevokeRefreshToken?.riskLevel).toBe(
			'write',
		);
		expect(plugin.endpointMeta?.deleteCustomer?.riskLevel).toBe('destructive');
	});

	it('keeps every route placeholder and query backed by its input schema', () => {
		const camel = (key: string) =>
			key.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase());
		const snake = (key: string) =>
			key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
		const hasField = (fields: Record<string, unknown>, key: string) =>
			key in fields || camel(key) in fields || snake(key) in fields;
		const missing: string[] = [];
		for (const key of keys) {
			const spec: RouteSpec = specs[key];
			const fields = (
				NetSuiteEndpointInputSchemas[key] as unknown as {
					shape: Record<string, unknown>;
				}
			).shape;
			const placeholders = [...spec.path.matchAll(/\{([^}]+)\}/g)].map(
				(match) => match[1]!,
			);
			expect(new Set(placeholders)).toEqual(new Set(spec.pathParams ?? []));
			for (const field of [
				...(spec.pathParams ?? []),
				...(spec.query ?? []),
				...(spec.bodyFromInput ?? []),
			]) {
				if (!hasField(fields, field)) missing.push(`${key}.${field}`);
			}
		}
		expect(missing).toEqual([]);
	});

	it('maps account hosts and OAuth URLs', () => {
		expect(normalizeAccountHost('TSTDRV_123')).toBe('tstdrv-123');
		expect(netSuiteAccountBase('TSTDRV_123')).toBe(
			'https://tstdrv-123.suitetalk.api.netsuite.com',
		);
		expect(netSuiteOAuthTokenUrl('TSTDRV_123')).toBe(
			'https://tstdrv-123.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/token',
		);
	});

	it('requires an account id before making requests', async () => {
		await expect(
			makeNetSuiteRequest('/record/v1/customer', TOKEN, {}),
		).rejects.toThrow('accountId is required');
	});
});

describe.each(keys)('%s', (key) => {
	it('has a handler, input schema, output schema and metadata', () => {
		expect(typeof NetSuite[key]).toBe('function');
		expect(NetSuiteEndpointInputSchemas[key]).toBeDefined();
		expect(NetSuiteEndpointOutputSchemas[key]).toBeDefined();
		expect(specs[key].riskLevel).toMatch(/read|write|destructive/);
		expect(specs[key].metaDescription.length).toBeGreaterThan(10);
	});
});

describe('endpoint dispatch', () => {
	const originalFetch = globalThis.fetch;

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	it.each(keys)('dispatches %s', async (key) => {
		const calls: string[] = [];
		let referenceCalls = 0;
		globalThis.fetch = jest.fn(async (url: string | URL | Request) => {
			calls.push(String(url));
			if (key === 'getReferenceSelectField') {
				referenceCalls += 1;
				return referenceCalls === 1
					? jsonResponse({
							entity: {
								links: [{ href: '/services/rest/record/v1/customer/2' }],
							},
						})
					: jsonResponse({ id: 2, entityId: 'CUST-2' });
			}
			return jsonResponse({ items: [], id: '1' });
		}) as unknown as typeof fetch;

		const result = await NetSuite[key](
			mockCtx() as never,
			inputFor(key) as never,
		);
		expect(result).toBeDefined();
		if (
			key === 'oauth2AuthorizeAccountDomain' ||
			key === 'oauth2AuthorizeSystemDomain' ||
			key === 'createJwtClientAssertion'
		) {
			expect(calls).toHaveLength(0);
		} else {
			expect(calls.length).toBeGreaterThan(0);
		}
	});

	it('validates endpoint input schemas before calling the API', async () => {
		const fetchMock = jest.fn();
		globalThis.fetch = fetchMock as unknown as typeof fetch;
		await expect(
			NetSuite.getCustomer(mockCtx() as never, {} as never),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('sends the expected record URL, query and bearer token', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(jsonResponse({ id: '1' })) as unknown as typeof fetch;
		await NetSuite.getCustomer(mockCtx() as never, {
			id: '1',
			fields: 'entityId,email',
		});
		const [url, init] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(url).toContain(
			'https://tstdrv123.suitetalk.api.netsuite.com/services/rest/record/v1/customer/1',
		);
		expect(url).toContain('fields=entityId%2Cemail');
		expect(header(init, 'Authorization')).toBe('Bearer test-token');
	});

	it('sends SuiteQL q in the JSON body with transient preference', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ items: [] }),
			) as unknown as typeof fetch;
		await NetSuite.runSuiteqlQuery(mockCtx() as never, {
			q: 'SELECT id FROM customer',
			limit: 10,
		});
		const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(init.method).toBe('POST');
		expect(init.body).toBe(JSON.stringify({ q: 'SELECT id FROM customer' }));
		expect(header(init, 'Prefer')).toBe('transient');
	});

	it('uses basic auth for refresh-token exchange', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ access_token: 'new' }),
			) as unknown as typeof fetch;
		await NetSuite.oauth2TokenRefresh(mockCtx() as never, {
			client_id: 'id',
			client_secret: 'secret',
			refresh_token: 'refresh',
		});
		const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(header(init, 'Authorization')).toBe(
			`Basic ${Buffer.from('id:secret').toString('base64')}`,
		);
	});

	it('builds account and system authorization URLs', async () => {
		const account = (await NetSuite.oauth2AuthorizeAccountDomain(
			mockCtx() as never,
			{
				client_id: 'id',
				redirect_uri: 'https://example.com/cb',
				scope: 'rest_webservices',
				state: 's',
			} as never,
		)) as { authorization_url: string };
		expect(account.authorization_url).toContain(
			'https://tstdrv123.app.netsuite.com/app/login/oauth2/authorize.nl',
		);
		expect(account.authorization_url).toContain('response_type=code');

		const system = (await NetSuite.oauth2AuthorizeSystemDomain(
			mockCtx() as never,
			{
				client_id: 'id',
				redirect_uri: 'https://example.com/cb',
				scope: 'rest_webservices',
				state: 's',
				nonce: 'n',
			} as never,
		)) as { authorization_url: string };
		expect(system.authorization_url).toContain(
			'https://system.netsuite.com/app/login/oauth2/authorize.nl',
		);
	});

	it('creates a verifiable RS256 JWT assertion', async () => {
		const result = (await NetSuite.createJwtClientAssertion(
			mockCtx() as never,
			{
				alg: 'RS256',
				scope: 'rest_webservices',
			},
		)) as { client_assertion: string; token_url: string };
		const [header, payload, signature] = result.client_assertion.split('.');
		const decoded = JSON.parse(
			Buffer.from(header!, 'base64url').toString('utf8'),
		) as { alg: string; kid: string };
		expect(decoded).toEqual({ alg: 'RS256', typ: 'JWT', kid: 'cert-id' });
		const claims = JSON.parse(
			Buffer.from(payload!, 'base64url').toString('utf8'),
		) as { iss: string; scope: string; aud: string };
		expect(claims.iss).toBe('client-id');
		expect(claims.scope).toBe('rest_webservices');
		expect(claims.aud).toBe(result.token_url);
		expect(
			verify(
				'RSA-SHA256',
				Buffer.from(`${header}.${payload}`),
				publicKey,
				Buffer.from(signature!, 'base64url'),
			),
		).toBe(true);
	});

	it('rejects account IDs with URL delimiters and ignores account_id in record input', async () => {
		expect(() => normalizeAccountHost('attacker.example/')).toThrow(
			'[netsuite] invalid accountId: expected letters, digits, underscores, or hyphens',
		);
		expect(() => normalizeAccountHost('evil.com')).toThrow();
		expect(() => normalizeAccountHost('foo?bar')).toThrow();

		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(jsonResponse({ id: '1' })) as unknown as typeof fetch;
		await NetSuite.getCustomer(
			mockCtx() as never,
			{
				id: '1',
				account_id: 'attacker.example/',
			} as never,
		);
		const [url, init] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(url).toContain(
			'https://tstdrv123.suitetalk.api.netsuite.com/services/rest/record/v1/customer/1',
		);
		expect(url).not.toContain('attacker.example');
		expect(header(init, 'Authorization')).toBe('Bearer test-token');
	});

	it('syncs records to local entity cache and handles delete cleanup', async () => {
		const upsertMock = jest.fn();
		const deleteMock = jest.fn();
		const ctx = {
			...mockCtx(),
			db: {
				customers: {
					upsertByEntityId: upsertMock,
					deleteByEntityId: deleteMock,
				},
			},
		};

		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ items: [{ id: '1', entityId: 'ACME' }] }),
			) as unknown as typeof fetch;
		await NetSuite.listRecords(ctx as never, {
			recordType: 'customer',
		});
		expect(upsertMock).toHaveBeenCalledWith('1', { id: '1', entityId: 'ACME' });

		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ ok: true }, 204),
			) as unknown as typeof fetch;
		await NetSuite.deleteCustomer(ctx as never, {
			id: '1',
		});
		expect(deleteMock).toHaveBeenCalledWith('1');
	});

	it('allows token-free setup helpers to run without acquiring an access token', async () => {
		const plugin = netsuite();
		const key = await plugin.keyBuilder?.(
			{
				authType: 'oauth_2',
				meteredOperationId: 'netsuite.oauth2TokenClientCredentials',
			} as never,
			'endpoint',
		);
		expect(key).toBe('');

		const authKey = await plugin.keyBuilder?.(
			{
				authType: 'oauth_2',
				meteredOperationId: 'netsuite.oauth2AuthorizeAccountDomain',
			} as never,
			'endpoint',
		);
		expect(authKey).toBe('');
	});

	it('parses application/schema+json text responses as JSON objects', async () => {
		const schemaPayload = { title: 'Customer Schema', type: 'object' };
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers({ 'content-type': 'application/schema+json' }),
			text: async () => JSON.stringify(schemaPayload),
			json: async () => {
				throw new Error('not standard json content-type');
			},
			arrayBuffer: async () => Buffer.from(JSON.stringify(schemaPayload)),
		}) as unknown as typeof fetch;

		const result = await NetSuite.getRecordMetadata(mockCtx() as never, {
			record_type: 'customer',
		});
		expect(result).toEqual(schemaPayload);
	});

	it('preserves Location header on record creation and syncs cache', async () => {
		const upsertMock = jest.fn();
		const ctx = {
			...mockCtx(),
			db: {
				customers: {
					upsertByEntityId: upsertMock,
				},
			},
		};
		const locationUrl =
			'https://tstdrv123.suitetalk.api.netsuite.com/services/rest/record/v1/customer/789';
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 204,
			statusText: 'No Content',
			headers: new Headers({ Location: locationUrl }),
			text: async () => '',
			json: async () => ({}),
			arrayBuffer: async () => Buffer.from(''),
		}) as unknown as typeof fetch;

		const result = await NetSuite.createCustomer(ctx as never, {
			body: { companyName: 'New Corp' },
		});
		expect(result).toEqual({ location: locationUrl });
		expect(upsertMock).toHaveBeenCalledWith(
			'789',
			expect.objectContaining({
				id: '789',
				location: locationUrl,
				companyName: 'New Corp',
			}),
		);
	});

	it('resolves refresh credentials from context defaults and rejects when missing', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ access_token: 'refreshed' }),
			) as unknown as typeof fetch;
		const result = await NetSuite.oauth2TokenRefresh(mockCtx() as never, {});
		expect(result).toEqual({ access_token: 'refreshed' });

		const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(header(init, 'Authorization')).toBe(
			`Basic ${Buffer.from('client-id:client-secret').toString('base64')}`,
		);

		const emptyCtx = {
			...mockCtx(),
			options: { accountId: ACCOUNT },
			keys: {},
		};
		await expect(
			NetSuite.oauth2TokenRefresh(emptyCtx as never, {}),
		).rejects.toThrow(
			'[auth-missing:netsuite]: oauth2TokenRefresh requires client_id',
		);
	});

	it('forwards Prefer and idempotency headers on DELETE requests', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(jsonResponse({})) as unknown as typeof fetch;
		await NetSuite.deleteCustomer(
			mockCtx() as never,
			{
				id: '1',
				prefer: 'respond-async',
				idempotency_key: 'idem-123',
			} as never,
		);
		const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(init.method).toBe('DELETE');
		expect(header(init, 'Prefer')).toBe('respond-async');
		expect(header(init, 'X-NetSuite-Idempotency-Key')).toBe('idem-123');
	});

	it('rejects unsupported JWT algorithms', async () => {
		await expect(
			NetSuite.createJwtClientAssertion(mockCtx() as never, {
				alg: 'PS512' as never,
				scope: 'rest_webservices',
			}),
		).rejects.toThrow();
	});
});
