import {
	constants as cryptoConstants,
	generateKeyPairSync,
	verify,
} from 'node:crypto';
import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
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
	UpdateSalesOrderInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { netsuite } from './index';
import {
	NetSuiteCustomerPaymentEntity,
	NetSuiteEmployeeEntity,
	NetSuiteInvoiceEntity,
	NetSuiteItemEntity,
	NetSuiteItemFulfillmentEntity,
} from './schema';

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
	state: 'state-with-at-least-22-chars',
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
					alg: 'PS256',
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
	it('wires OAuth2, 84 endpoints, schemas and metadata', () => {
		const plugin = netsuite({ accountId: ACCOUNT });
		expect(plugin.id).toBe('netsuite');
		expect((plugin.options as { authType?: string }).authType).toBe('oauth_2');
		expect(plugin.oauthConfig?.scopes).toEqual(['rest_webservices']);
		expect(plugin.webhooks).toEqual({});
		expect(keys).toHaveLength(84);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(84);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(84);
		expect(plugin.endpointMeta?.['oauth.oauth2Logout']?.riskLevel).toBe(
			'write',
		);
		expect(plugin.endpointMeta?.['customers.deleteCustomer']?.riskLevel).toBe(
			'destructive',
		);
	});

	it('groups every operation under exactly one resource', () => {
		const plugin = netsuite({ accountId: ACCOUNT });
		const paths: string[] = [];
		for (const [group, ops] of Object.entries(plugin.endpoints ?? {})) {
			for (const [op, fn] of Object.entries(ops as Record<string, unknown>)) {
				expect(typeof fn).toBe('function');
				paths.push(`${group}.${op}`);
			}
		}
		expect(paths).toHaveLength(84);
		expect(new Set(paths.map((path) => path.split('.')[1]))).toEqual(
			new Set(keys),
		);
		expect(new Set(Object.keys(plugin.endpointMeta ?? {}))).toEqual(
			new Set(paths),
		);
		expect(new Set(Object.keys(plugin.endpointSchemas ?? {}))).toEqual(
			new Set(paths),
		);
		expect(paths).toContain('salesOrders.createSalesOrder');
		expect(paths).toContain('records.transformRecord');
		expect(paths).toContain('query.runSuiteqlQuery');
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

	it('requires accountId only when an OAuth token URL is used', () => {
		const plugin = netsuite();
		expect(() => plugin.oauthConfig?.tokenUrl).toThrow(
			'accountId is required to build NetSuite OAuth token URLs',
		);
		expect(netsuite({ accountId: ACCOUNT }).oauthConfig?.tokenUrl).toContain(
			'tstdrv123.suitetalk.api.netsuite.com',
		);
		expect(() => netsuite({ key: TOKEN })).not.toThrow();
	});

	it('blocks OAuth endpoint calls until accountId is configured', async () => {
		const plugin = netsuite();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'oauth_2',
					meteredOperationId: 'netsuite.customers.getCustomer',
					keys: {},
				} as never,
				'endpoint',
			),
		).rejects.toThrow('accountId is required for OAuth');
	});

	it('accepts reference-object status values and rejects invalid references', () => {
		expect(
			NetSuiteInvoiceEntity.parse({
				id: '1',
				status: { id: 'open', refName: 'Open' },
			}).status,
		).toEqual({ id: 'open', refName: 'Open' });
		expect(
			NetSuiteItemFulfillmentEntity.parse({ status: 'Picked' }).status,
		).toBe('Picked');
		expect(
			NetSuiteCustomerPaymentEntity.parse({ tranDate: '2026-01-01' }).tranDate,
		).toBe('2026-01-01');
		expect(() =>
			NetSuiteEmployeeEntity.parse({ supervisor: { id: false } }),
		).toThrow();
		expect(
			NetSuiteItemEntity.parse({
				id: '7',
				itemType: { id: 'InvtPart', refName: 'Inventory Item' },
			}).itemType,
		).toEqual({ id: 'InvtPart', refName: 'Inventory Item' });
		expect(NetSuiteItemEntity.parse({ itemType: 'InvtPart' }).itemType).toBe(
			'InvtPart',
		);
	});

	it('uses the stored access token when no refresh credentials exist', async () => {
		const plugin = netsuite({ accountId: ACCOUNT });
		const key = await plugin.keyBuilder?.(
			{
				authType: 'oauth_2',
				options: { accountId: ACCOUNT },
				meteredOperationId: 'netsuite.customers.getCustomer',
				keys: {
					get_integration_credentials: async () => ({
						client_id: 'client-id',
						client_secret: null,
					}),
					get_access_token: async () => TOKEN,
				},
			} as never,
			'endpoint',
		);
		expect(key).toBe(TOKEN);
	});

	it('raises AuthMissingError when there is no token to use or refresh', async () => {
		const plugin = netsuite({ accountId: ACCOUNT });
		const keyless = {
			authType: 'oauth_2',
			options: { accountId: ACCOUNT },
			tenantId: 'default',
			meteredOperationId: 'netsuite.customers.getCustomer',
			keys: {
				get_integration_credentials: async () => ({
					client_id: 'client-id',
					client_secret: 'client-secret',
				}),
				get_access_token: async () => null,
				get_expires_at: async () => null,
				get_refresh_token: async () => null,
			},
		};
		await expect(
			plugin.keyBuilder?.(keyless as never, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
		await expect(
			plugin.keyBuilder?.(keyless as never, 'webhook' as never),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('treats replace as a sublist-name string', () => {
		expect(
			UpdateSalesOrderInputSchema.parse({
				id: '1',
				data: {},
				replace: 'item',
			}).replace,
		).toBe('item');
		expect(() =>
			UpdateSalesOrderInputSchema.parse({
				id: '1',
				data: {},
				replace: true,
			}),
		).toThrow();
	});

	it('accepts select fields on a new sales order as IDs or reference objects', () => {
		const schema = NetSuiteEndpointInputSchemas.createSalesOrder;
		const base = { entity: { id: '123' }, item: { items: [] } };
		for (const select of [
			{ customForm: '-40', orderStatus: 'B' },
			{ customForm: -40 },
			{ customForm: { id: '-40' }, orderStatus: { id: 'B' } },
		]) {
			expect(() => schema.parse({ ...base, ...select })).not.toThrow();
		}
		expect(() => schema.parse({ ...base, orderStatus: 2 })).toThrow();
	});

	it('only matches 429 text for non-ApiError failures', () => {
		const apiError = new ApiError(
			{ method: 'POST', url: '/query/v1/suiteql' },
			{
				url: '/query/v1/suiteql',
				ok: false,
				status: 400,
				statusText: 'Bad Request',
				body: 'validation failed with code 429',
			},
			'Bad Request',
		);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(apiError)).toBe(false);
		expect(
			errorHandlers.RATE_LIMIT_ERROR.match(new Error('429 Too Many Requests')),
		).toBe(true);
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

	it('uses the validated account input for token-free datacenter discovery', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ items: [] }),
			) as unknown as typeof fetch;
		const ctx = { ...mockCtx(), options: {} };
		await NetSuite.getDatacenterUrls(ctx as never, { account: ACCOUNT });
		const [url, init] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(url).toContain('https://rest.netsuite.com/rest/datacenterurls');
		expect(url).toContain(`account=${ACCOUNT}`);
		expect(header(init, 'Authorization')).toBeNull();
	});

	it('forwards expandSubResources when resolving a reference field', async () => {
		let calls = 0;
		globalThis.fetch = jest.fn(async () => {
			calls += 1;
			return calls === 1
				? jsonResponse({
						entity: {
							links: [{ href: '/services/rest/record/v1/customer/2' }],
						},
					})
				: jsonResponse({ id: 2, entityId: 'CUST-2' });
		}) as unknown as typeof fetch;

		await NetSuite.getReferenceSelectField(mockCtx() as never, {
			record_type: 'customer',
			id: '1',
			select_field: 'entity',
			expandSubResources: true,
		});
		const secondUrl = String(jest.mocked(globalThis.fetch).mock.calls[1]?.[0]);
		expect(secondUrl).toContain('expandSubResources=true');
	});

	it('defaults the client assertion type for client-credentials tokens', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ access_token: 'token' }),
			) as unknown as typeof fetch;
		await NetSuite.oauth2TokenClientCredentials(mockCtx() as never, {
			client_assertion: 'assertion',
		});
		const [, init] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(String(init.body)).toContain(
			'client_assertion_type=urn%3Aietf%3Aparams%3Aoauth%3Aclient-assertion-type%3Ajwt-bearer',
		);
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

	it('refreshes public clients with client_id in the form and no secret', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ access_token: 'new' }),
			) as unknown as typeof fetch;
		const publicCtx = {
			...mockCtx(),
			options: { accountId: ACCOUNT, clientId: 'public-client' },
		};
		await NetSuite.oauth2TokenRefresh(publicCtx as never, {
			refresh_token: 'refresh',
		});
		await NetSuite.oauth2TokenRefresh(mockCtx() as never, {
			refresh_token: 'refresh',
		});
		const calls = jest.mocked(globalThis.fetch).mock.calls as [
			string,
			RequestInit,
		][];
		const [, publicInit] = calls[0] as [string, RequestInit];
		expect(header(publicInit, 'Authorization')).toBeNull();
		const publicForm = new URLSearchParams(String(publicInit.body));
		expect(publicForm.get('client_id')).toBe('public-client');
		expect(publicForm.get('refresh_token')).toBe('refresh');
		expect(publicForm.get('grant_type')).toBe('refresh_token');

		const [, confidentialInit] = calls[1] as [string, RequestInit];
		expect(header(confidentialInit, 'Authorization')).toBe(
			`Basic ${Buffer.from('client-id:client-secret').toString('base64')}`,
		);
		const confidentialForm = new URLSearchParams(String(confidentialInit.body));
		expect(confidentialForm.get('client_id')).toBeNull();
	});

	it('needs write permission to sign a client assertion', () => {
		const meta = netsuite({ accountId: ACCOUNT }).endpointMeta;
		expect(meta?.['oauth.createJwtClientAssertion']?.riskLevel).toBe('write');
	});

	it('authenticates revoke and code exchange as confidential or public clients', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(jsonResponse({})) as unknown as typeof fetch;
		await NetSuite.oauth2RevokeRefreshToken(mockCtx() as never, {
			token: 'refresh-to-revoke',
		});
		const [revokeUrl, confidential] = jest.mocked(globalThis.fetch).mock
			.calls[0] as [string, RequestInit];
		expect(revokeUrl).toBe(
			'https://tstdrv123.suitetalk.api.netsuite.com/services/rest/auth/oauth2/v1/revoke',
		);
		expect(header(confidential, 'Authorization')).toBe(
			`Basic ${Buffer.from('client-id:client-secret').toString('base64')}`,
		);
		expect(String(confidential.body)).toBe('token=refresh-to-revoke');

		const publicCtx = {
			...mockCtx(),
			options: { accountId: ACCOUNT, clientId: 'public-client' },
		};
		await NetSuite.oauth2TokenAuthorizationCode(publicCtx as never, {
			code: 'auth-code',
			redirect_uri: 'https://example.com/cb',
			code_verifier: 'verifier',
		});
		const [, publicInit] = jest.mocked(globalThis.fetch).mock.calls[1] as [
			string,
			RequestInit,
		];
		expect(header(publicInit, 'Authorization')).toBeNull();
		const form = new URLSearchParams(String(publicInit.body));
		expect(form.get('client_id')).toBe('public-client');
		expect(form.get('grant_type')).toBe('authorization_code');
		expect(form.get('code_verifier')).toBe('verifier');
	});

	it('marks transforms and token revocation as destructive', () => {
		const meta = netsuite({ accountId: ACCOUNT }).endpointMeta;
		expect(meta?.['records.transformRecord']?.riskLevel).toBe('destructive');
		expect(meta?.['oauth.oauth2RevokeRefreshToken']?.riskLevel).toBe(
			'destructive',
		);
	});

	it('builds account and system authorization URLs', async () => {
		const account = (await NetSuite.oauth2AuthorizeAccountDomain(
			mockCtx() as never,
			{
				client_id: 'id',
				redirect_uri: 'https://example.com/cb',
				scope: 'rest_webservices',
				state: 'state-with-at-least-22-chars',
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
				state: 'state-with-at-least-22-chars',
				nonce: 'n',
			} as never,
		)) as { authorization_url: string };
		expect(system.authorization_url).toContain(
			'https://system.netsuite.com/app/login/oauth2/authorize.nl',
		);
	});

	it('requires a 22-character state and needs no account for the system domain', async () => {
		const input = {
			client_id: 'id',
			redirect_uri: 'https://example.com/cb',
			scope: 'rest_webservices',
		};
		await expect(
			NetSuite.oauth2AuthorizeAccountDomain(mockCtx() as never, input as never),
		).rejects.toThrow();
		await expect(
			NetSuite.oauth2AuthorizeAccountDomain(mockCtx() as never, {
				...input,
				state: 'too-short',
			}),
		).rejects.toThrow();

		const noAccount = { ...mockCtx(), options: {}, keys: {} };
		const system = await NetSuite.oauth2AuthorizeSystemDomain(
			noAccount as never,
			{ ...input, state: 'state-with-at-least-22-chars' },
		);
		const url = new URL(system.authorization_url as string);
		expect(url.origin).toBe('https://system.netsuite.com');
		expect(url.searchParams.get('state')).toBe('state-with-at-least-22-chars');
		expect(url.searchParams.get('response_type')).toBe('code');
	});

	it('accepts the string expires_in NetSuite returns from the token endpoint', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue(
			jsonResponse({
				access_token: 'access',
				refresh_token: 'refresh',
				expires_in: '3600',
				token_type: 'bearer',
			}),
		) as unknown as typeof fetch;
		const result = await NetSuite.oauth2TokenAuthorizationCode(
			mockCtx() as never,
			{
				code: 'code',
				redirect_uri: 'https://example.com/cb',
				code_verifier: 'verifier',
			},
		);
		expect(result.expires_in).toBe('3600');
	});

	it('creates a verifiable PS256 JWT assertion', async () => {
		const result = (await NetSuite.createJwtClientAssertion(
			mockCtx() as never,
			{
				scope: 'rest_webservices',
			},
		)) as { client_assertion: string; token_url: string };
		const [header, payload, signature] = result.client_assertion.split('.');
		const decoded = JSON.parse(
			Buffer.from(header!, 'base64url').toString('utf8'),
		) as { alg: string; kid: string };
		expect(decoded).toEqual({ alg: 'PS256', typ: 'JWT', kid: 'cert-id' });
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
				{
					key: publicKey,
					padding: cryptoConstants.RSA_PKCS1_PSS_PADDING,
					saltLength: cryptoConstants.RSA_PSS_SALTLEN_DIGEST,
				},
				Buffer.from(signature!, 'base64url'),
			),
		).toBe(true);
	});

	it('signs PS512 with SHA-512 and ES384 with a P-384 key', async () => {
		const ps512 = (await NetSuite.createJwtClientAssertion(mockCtx() as never, {
			alg: 'PS512',
			scope: 'rest_webservices',
		})) as { client_assertion: string };
		const [psHeader, psPayload, psSignature] =
			ps512.client_assertion.split('.');
		expect(
			verify(
				'SHA512',
				Buffer.from(`${psHeader}.${psPayload}`),
				{
					key: publicKey,
					padding: cryptoConstants.RSA_PKCS1_PSS_PADDING,
					saltLength: cryptoConstants.RSA_PSS_SALTLEN_DIGEST,
				},
				Buffer.from(psSignature!, 'base64url'),
			),
		).toBe(true);

		const ec = generateKeyPairSync('ec', {
			namedCurve: 'P-384',
			publicKeyEncoding: { type: 'spki', format: 'pem' },
			privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
		});
		const es384 = (await NetSuite.createJwtClientAssertion(mockCtx() as never, {
			alg: 'ES384',
			scope: 'rest_webservices',
			private_key_pem: ec.privateKey,
		})) as { client_assertion: string };
		const [esHeader, esPayload, esSignature] =
			es384.client_assertion.split('.');
		expect(
			verify(
				'SHA384',
				Buffer.from(`${esHeader}.${esPayload}`),
				{ key: ec.publicKey, dsaEncoding: 'ieee-p1363' },
				Buffer.from(esSignature!, 'base64url'),
			),
		).toBe(true);
	});

	it('refuses assertion lifetimes NetSuite rejects', async () => {
		await expect(
			NetSuite.createJwtClientAssertion(mockCtx() as never, {
				scope: 'rest_webservices',
				iat: 1_800_000_000,
				exp: 1_800_000_000 + 3600,
			}),
		).rejects.toThrow('less than 60 minutes');
		await expect(
			NetSuite.createJwtClientAssertion(mockCtx() as never, {
				scope: 'rest_webservices',
				iat: 1_800_000_000,
				exp: 1_800_000_000,
			}),
		).rejects.toThrow('less than 60 minutes');
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
		const plugin = netsuite({ accountId: ACCOUNT });
		const key = await plugin.keyBuilder?.(
			{
				authType: 'oauth_2',
				meteredOperationId: 'netsuite.oauth.oauth2TokenClientCredentials',
			} as never,
			'endpoint',
		);
		expect(key).toBe('');

		const authKey = await plugin.keyBuilder?.(
			{
				authType: 'oauth_2',
				meteredOperationId: 'netsuite.oauth.oauth2AuthorizeAccountDomain',
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
		expect(upsertMock).toHaveBeenCalledWith('789', {
			id: '789',
			companyName: 'New Corp',
		});
	});

	it('keeps a record location reference when a write returns a Location header', async () => {
		const upsertMock = jest.fn();
		const warehouse = { id: '3', refName: 'Main Warehouse' };
		const ctx = {
			...mockCtx(),
			db: {
				purchaseOrders: {
					findByEntityId: jest.fn().mockResolvedValue({
						data: { id: '55', memo: 'old', location: warehouse },
					}),
					upsertByEntityId: upsertMock,
				},
			},
		};
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 204,
			statusText: 'No Content',
			headers: new Headers({
				Location:
					'https://tstdrv123.suitetalk.api.netsuite.com/services/rest/record/v1/purchaseOrder/55',
			}),
			text: async () => '',
			json: async () => ({}),
			arrayBuffer: async () => Buffer.from(''),
		}) as unknown as typeof fetch;

		await NetSuite.updatePurchaseOrder(ctx as never, {
			id: '55',
			data: { memo: 'new' },
		});
		expect(upsertMock).toHaveBeenCalledWith('55', {
			id: '55',
			memo: 'new',
			location: warehouse,
		});
	});

	it('replaces the saved row on a full read so fields cleared in NetSuite go away', async () => {
		const upsertMock = jest.fn();
		const findMock = jest.fn().mockResolvedValue({
			data: { id: '789', companyName: 'Acme Corp', phone: '555-0100' },
		});
		const ctx = {
			...mockCtx(),
			db: {
				customers: {
					findByEntityId: findMock,
					upsertByEntityId: upsertMock,
				},
			},
		};
		// NetSuite leaves empty fields out of a record response: phone was cleared.
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ id: '789', companyName: 'Acme Corp' }),
			) as unknown as typeof fetch;

		await NetSuite.getCustomer(ctx as never, { id: '789' });
		expect(findMock).not.toHaveBeenCalled();
		expect(upsertMock).toHaveBeenCalledWith('789', {
			id: '789',
			companyName: 'Acme Corp',
		});
	});

	it('keeps both partial reads when two run at once for the same record', async () => {
		const rows = new Map<string, Record<string, unknown>>([
			['789', { id: '789', companyName: 'Acme Corp' }],
		]);
		const tick = () => new Promise((resolve) => setTimeout(resolve, 5));
		const ctx = {
			...mockCtx(),
			db: {
				customers: {
					findByEntityId: async (id: string) => {
						const data = rows.get(id);
						await tick();
						return data ? { data: { ...data } } : null;
					},
					upsertByEntityId: async (
						id: string,
						data: Record<string, unknown>,
					) => {
						await tick();
						rows.set(id, data);
					},
				},
			},
		};
		globalThis.fetch = jest.fn(async (url: string | URL | Request) =>
			String(url).includes('fields=email')
				? jsonResponse({ id: '789', email: 'ap@acme.test' })
				: jsonResponse({ id: '789', phone: '555-0100' }),
		) as unknown as typeof fetch;

		await Promise.all([
			NetSuite.getCustomer(ctx as never, { id: '789', fields: 'email' }),
			NetSuite.getCustomer(ctx as never, { id: '789', fields: 'phone' }),
		]);
		expect(rows.get('789')).toEqual({
			id: '789',
			companyName: 'Acme Corp',
			email: 'ap@acme.test',
			phone: '555-0100',
		});
	});

	it('merges list items, which carry only id and links, into saved rows', async () => {
		const upsertMock = jest.fn();
		const ctx = {
			...mockCtx(),
			db: {
				customers: {
					findByEntityId: jest.fn().mockResolvedValue({
						data: { id: '789', companyName: 'Acme Corp' },
					}),
					upsertByEntityId: upsertMock,
				},
			},
		};
		const links = [
			{
				rel: 'self',
				href: 'https://tstdrv123.suitetalk.api.netsuite.com/services/rest/record/v1/customer/789',
			},
		];
		globalThis.fetch = jest.fn().mockResolvedValue(
			jsonResponse({
				items: [{ id: '789', links }],
				count: 1,
				hasMore: false,
				offset: 0,
				totalResults: 1,
			}),
		) as unknown as typeof fetch;

		await NetSuite.listRecords(ctx as never, { recordType: 'customer' });
		expect(upsertMock).toHaveBeenCalledWith('789', {
			id: '789',
			companyName: 'Acme Corp',
			links,
		});
	});

	it('fills client credentials from options but never uses the stored refresh token', async () => {
		globalThis.fetch = jest
			.fn()
			.mockResolvedValue(
				jsonResponse({ access_token: 'refreshed' }),
			) as unknown as typeof fetch;
		const storedRefresh = jest.fn().mockResolvedValue('stored-refresh');
		const ctxWithStore = {
			...mockCtx(),
			keys: { ...mockCtx().keys, get_refresh_token: storedRefresh },
		};
		await expect(
			NetSuite.oauth2TokenRefresh(ctxWithStore as never, {} as never),
		).rejects.toThrow();
		expect(storedRefresh).not.toHaveBeenCalled();
		expect(globalThis.fetch).not.toHaveBeenCalled();

		const result = await NetSuite.oauth2TokenRefresh(mockCtx() as never, {
			refresh_token: 'caller-refresh',
		});
		expect(result).toEqual({ access_token: 'refreshed' });
		const [, firstInit] = jest.mocked(globalThis.fetch).mock.calls[0] as [
			string,
			RequestInit,
		];
		expect(String(firstInit.body)).toContain('refresh_token=caller-refresh');

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
			NetSuite.oauth2TokenRefresh(emptyCtx as never, {
				refresh_token: 'caller-refresh',
			}),
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

	it('merges partial reads with existing cache record to preserve saved fields', async () => {
		const upsertMock = jest.fn();
		const findMock = jest.fn().mockResolvedValue({
			data: {
				id: '789',
				companyName: 'Acme Corp',
				email: 'old@example.com',
				phone: '555-0100',
			},
		});
		const ctx = {
			...mockCtx(),
			db: {
				customers: {
					findByEntityId: findMock,
					upsertByEntityId: upsertMock,
				},
			},
		};
		globalThis.fetch = jest.fn().mockResolvedValue(
			jsonResponse({
				id: '789',
				email: 'new@example.com',
			}),
		) as unknown as typeof fetch;

		await NetSuite.getCustomer(ctx as never, {
			id: '789',
			fields: 'email',
		});
		expect(findMock).toHaveBeenCalledWith('789');
		expect(upsertMock).toHaveBeenCalledWith('789', {
			id: '789',
			companyName: 'Acme Corp',
			email: 'new@example.com',
			phone: '555-0100',
		});
	});

	it('clears null fields from the cached record instead of storing null', async () => {
		const upsertMock = jest.fn();
		const findMock = jest.fn().mockResolvedValue({
			data: {
				id: '9',
				email: 'person@example.com',
				supervisor: { id: '1', refName: 'Boss' },
			},
		});
		const ctx = {
			...mockCtx(),
			db: {
				employees: {
					findByEntityId: findMock,
					upsertByEntityId: upsertMock,
				},
			},
		};
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 204,
			headers: new Headers({
				location:
					'https://tstdrv123.suitetalk.api.netsuite.com/services/rest/record/v1/employee/9',
			}),
			json: async () => ({}),
		}) as unknown as typeof fetch;

		await NetSuite.updateEmployee(ctx as never, {
			id: '9',
			data: { supervisor: null },
		});
		expect(upsertMock).toHaveBeenCalledWith('9', {
			id: '9',
			email: 'person@example.com',
		});
	});

	it('skips cache updates and fake record creation for queued asynchronous jobs', async () => {
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
		const jobUrl =
			'https://tstdrv123.suitetalk.api.netsuite.com/services/rest/async/v1/job/job-999';
		globalThis.fetch = jest.fn().mockResolvedValue({
			ok: true,
			status: 202,
			statusText: 'Accepted',
			headers: new Headers({ Location: jobUrl }),
			text: async () => '',
			json: async () => ({}),
			arrayBuffer: async () => Buffer.from(''),
		}) as unknown as typeof fetch;

		const createResult = await NetSuite.createCustomer(ctx as never, {
			Prefer: 'respond-async',
			body: { companyName: 'Async Corp' },
		});
		expect(createResult).toEqual({ location: jobUrl });
		expect(upsertMock).not.toHaveBeenCalled();

		const deleteResult = await NetSuite.deleteCustomer(ctx as never, {
			id: '789',
			prefer: 'respond-async',
		});
		expect(deleteResult).toEqual({ location: jobUrl });
		expect(deleteMock).not.toHaveBeenCalled();
	});

	it('accepts location reference objects in order responses', async () => {
		globalThis.fetch = jest.fn().mockResolvedValue(
			jsonResponse({
				id: '100',
				tranId: 'PO-100',
				location: { id: '5', refName: 'Warehouse HQ' },
			}),
		) as unknown as typeof fetch;

		const result = await NetSuite.getPurchaseOrder(mockCtx() as never, {
			id: '100',
		});
		expect(result).toEqual({
			id: '100',
			tranId: 'PO-100',
			location: { id: '5', refName: 'Warehouse HQ' },
		});
	});

	it('rejects JWT algorithms NetSuite does not accept', async () => {
		for (const alg of ['RS256', 'HS256', 'none']) {
			await expect(
				NetSuite.createJwtClientAssertion(mockCtx() as never, {
					alg: alg as never,
					scope: 'rest_webservices',
				}),
			).rejects.toThrow();
		}
	});
});
