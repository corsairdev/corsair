import { request } from 'corsair/http';
import { DocusignClient } from './client';
import type { EndpointContractCase } from './endpoint-contract-cases';
import { endpointContractCases } from './endpoint-contract-cases';
import * as endpoints from './endpoints';
import { resolveClient } from './endpoints/context';
import {
	docusign,
	docusignEndpointMeta,
	docusignEndpointsNested,
	docusignPlugin,
} from './index';

jest.mock('corsair/http', () => {
	const actual = jest.requireActual('corsair/http');
	return { ...actual, request: jest.fn() };
});

const mockRequest = request as jest.MockedFunction<typeof request>;

function sampleValue(type: string): unknown {
	if (type === 'integer' || type === 'number') return 7;
	if (type === 'boolean') return true;
	if (type === 'array') return ['a', 'b'];
	return 'test-value';
}

function expectedQueryString(value: unknown): string {
	if (Array.isArray(value)) return value.map(String).join(',');
	return String(value);
}

const IMAGE_ENDPOINTS = new Set([
	'setInitialsImageForAccountlessSigner',
	'setSignatureImageForNoAccountSigner',
]);

const specialBodies: Record<string, unknown> = {
	deleteDraftEnvelopeAttachments: {
		attachments: [{ attachmentId: 'test-id' }],
	},
	deleteMembersFromSigningGroup: { users: [{ email: 'a@b.c' }] },
	deleteOneOrMoreSigningGroups: { groups: [{}] },
	deleteUserGroup: { groups: [{}] },
	deleteUsersFromGroup: { users: [{ email: 'a@b.c' }] },
	closeUsersInAccount: { users: [{ email: 'a@b.c' }] },
	updateRecipientDocumentVisibility: {
		documentVisibility: [{ documentId: 'test-id' }],
	},
	createCustomFieldsInTemplateDocument: {
		documentFields: [{ name: 'n', value: 'v' }],
	},
};

function expectedBase(path: string): string {
	if (path === '/service_information') {
		return 'https://demo.docusign.net/restapi';
	}
	if (path === '/v2.1' || path.startsWith('/v2.1/')) {
		return 'https://demo.docusign.net/restapi/v2.1';
	}
	return 'https://demo.docusign.net/restapi/v2.1/accounts/12345';
}

describe('DocuSign generated endpoints', () => {
	const makeClient = () =>
		new DocusignClient({
			accessToken: 'mock_token',
			accountId: '12345',
			baseUri: 'https://demo.docusign.net/restapi/v2.1',
		});

	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({});
	});

	it.each(endpointContractCases)(
		'$name calls $method $path',
		async ({
			name,
			method,
			path,
			pathParams,
			queryParams,
			hasBody,
		}: EndpointContractCase) => {
			const client = makeClient();
			const params: Record<string, unknown> = {};
			for (const p of pathParams)
				params[p] = p === 'bulkAction' ? 'void' : 'test-id';
			for (const q of queryParams) params[q.name] = sampleValue(q.type);
			if (IMAGE_ENDPOINTS.has(name)) {
				params.imageBase64 = 'aGVsbG8=';
				params.contentType = 'image/png';
			} else if (hasBody) {
				params.body = specialBodies[name] ?? { hello: 'world' };
			}
			if (name === 'getRequestLoggingLogFile') {
				mockRequest.mockResolvedValueOnce('request log content');
			}
			const fn = (
				endpoints as unknown as Record<
					string,
					(ctx: unknown, params: unknown) => Promise<unknown>
				>
			)[name];
			if (typeof fn !== 'function')
				throw new Error(`missing endpoint: ${name}`);
			await fn({ client }, params);
			expect(mockRequest).toHaveBeenCalledTimes(1);
			const call = mockRequest.mock.calls[0];
			if (!call) throw new Error('expected corsair/http request to be called');
			const [config, options] = call;
			expect(config.BASE).toBe(expectedBase(path));
			expect(config.HEADERS).toEqual(
				expect.objectContaining({ Authorization: 'Bearer mock_token' }),
			);
			expect(options.method).toBe(method);
			let expected = path;
			if (expected === '/v2.1' || expected.startsWith('/v2.1/')) {
				expected = expected.slice('/v2.1'.length);
			}
			for (const p of pathParams)
				expected = expected
					.split(`{${p}}`)
					.join(p === 'bulkAction' ? 'void' : 'test-id');
			const urlParts = options.url.split('?');
			const receivedPath = urlParts[0] ?? '';
			const receivedQuery = new URLSearchParams(urlParts[1] ?? '');
			const norm = (s: string) => s.replace(/\/+$/, '');
			expect(norm(receivedPath)).toBe(norm(expected));
			for (const q of queryParams) {
				expect(receivedQuery.get(q.name)).toBe(
					expectedQueryString(sampleValue(q.type)),
				);
			}
			if (IMAGE_ENDPOINTS.has(name)) {
				expect(options.body).toBeInstanceOf(Blob);
				expect(options.mediaType).toBe('image/png');
			} else if (hasBody) {
				expect(options.body).toEqual(specialBodies[name] ?? { hello: 'world' });
			} else {
				expect(options.body).toBeUndefined();
			}
		},
	);

	it('routes service_information to the api root', async () => {
		const client = makeClient();
		await client.request('/service_information');
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected corsair/http request to be called');
		expect(call[0].BASE).toBe('https://demo.docusign.net/restapi');
	});

	it('routes versioned paths to the version root', async () => {
		const client = makeClient();
		await client.request('/v2.1/diagnostics/settings');
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected corsair/http request to be called');
		expect(call[0].BASE).toBe('https://demo.docusign.net/restapi/v2.1');
	});

	it('listOAuthUserInfo calls the OAuth userinfo endpoint', async () => {
		const client = makeClient();
		mockRequest.mockResolvedValue({ sub: 'user-1' });
		const res = await endpoints.listOAuthUserInfo({ client }, {});
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected corsair/http request to be called');
		expect(call[0].BASE).toBe('https://account-d.docusign.com');
		expect(call[1]).toEqual(
			expect.objectContaining({ method: 'GET', url: '/oauth/userinfo' }),
		);
		expect(res).toEqual({ sub: 'user-1' });
	});

	it('fetchRecipientNamesForEmail filters recipients by email', async () => {
		const client = makeClient();
		mockRequest.mockResolvedValue({
			recipients: {
				signers: [
					{ email: 'jane@example.com', name: 'Jane Doe' },
					{ email: 'john@example.com', name: 'John Smith' },
				],
			},
		});
		const res = await endpoints.fetchRecipientNamesForEmail(
			{ client },
			{ envelopeId: 'env_1', email: 'JANE@example.com' },
		);
		expect(res.names).toEqual(['Jane Doe']);
		expect(res.count).toBe(1);
	});

	it('fetchRecipientNamesForEmail finds non-signer recipient types', async () => {
		const client = makeClient();
		mockRequest.mockResolvedValue({
			recipients: {
				signers: [],
				agents: [{ email: 'agent@example.com', name: 'Agent Alice' }],
				editors: [{ email: 'agent@example.com', userName: 'Editor Ed' }],
			},
		});
		const res = await endpoints.fetchRecipientNamesForEmail(
			{ client },
			{ envelopeId: 'env_1', email: 'agent@example.com' },
		);
		expect(res.names).toEqual(['Agent Alice', 'Editor Ed']);
		expect(res.count).toBe(2);
	});

	it('getWorkspaceFile preserves binary response data', async () => {
		const client = makeClient();
		mockRequest.mockResolvedValue('binary-file-bytes');
		const res = await endpoints.getWorkspaceFile(
			{ client },
			{ workspaceId: 'w1', folderId: 'f1', fileId: 'file1' },
		);
		expect(res).toBe('binary-file-bytes');
	});

	it('resolves the client from the Corsair runtime context shape', async () => {
		mockRequest.mockResolvedValue({ envelopeId: 'env_9', status: 'sent' });
		const runtimeCtx = {
			db: {},
			tenantId: 'default',
			options: {
				accessToken: 'mock_token',
				accountId: '12345',
				baseUri: 'https://demo.docusign.net/restapi/v2.1',
			},
			key: undefined,
		};
		const res = await endpoints.getEnvelope(runtimeCtx, {
			envelopeId: 'env_9',
		});
		expect(res).toEqual(
			expect.objectContaining({ envelopeId: 'env_9', status: 'sent' }),
		);
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected corsair/http request to be called');
		expect(call[0].BASE).toBe(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345',
		);
		expect(call[0].HEADERS).toEqual(
			expect.objectContaining({ Authorization: 'Bearer mock_token' }),
		);
	});

	it('rejects a runtime context without credentials', () => {
		expect(() => resolveClient({ db: {}, tenantId: 'default' })).toThrow(
			'Invalid execution context',
		);
	});

	it('prefers the tenant key bundle over factory options', async () => {
		mockRequest.mockResolvedValue({ envelopeId: 'env_9', status: 'sent' });
		const tenantCtx = {
			db: {},
			tenantId: 'acme',
			options: {
				accessToken: 'factory_token',
				accountId: '99999',
				baseUri: 'https://demo.docusign.net/restapi/v2.1',
			},
			key: JSON.stringify({
				accessToken: 'tenant_token',
				accountId: '12345',
				baseUri: 'https://demo.docusign.net/restapi/v2.1',
			}),
		};
		await endpoints.getEnvelope(tenantCtx, { envelopeId: 'env_9' });
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected corsair/http request to be called');
		expect(call[0].BASE).toBe(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345',
		);
		expect(call[0].HEADERS).toEqual(
			expect.objectContaining({ Authorization: 'Bearer tenant_token' }),
		);
	});

	it('combines a raw key token with options routing', async () => {
		mockRequest.mockResolvedValue({ envelopeId: 'env_9', status: 'sent' });
		const tenantCtx = {
			db: {},
			tenantId: 'acme',
			options: {
				accountId: '12345',
				baseUri: 'https://demo.docusign.net/restapi/v2.1',
			},
			key: 'raw_tenant_token',
		};
		await endpoints.getEnvelope(tenantCtx, { envelopeId: 'env_9' });
		const call = mockRequest.mock.calls[0];
		if (!call) throw new Error('expected corsair/http request to be called');
		expect(call[0].BASE).toBe(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345',
		);
		expect(call[0].HEADERS).toEqual(
			expect.objectContaining({ Authorization: 'Bearer raw_tenant_token' }),
		);
	});
});

describe('DocuSign tenant credential lifecycle', () => {
	const buildKey = docusignPlugin.keyBuilder as (
		ctx: unknown,
		source: string,
	) => Promise<string>;

	function keychain(overrides: Record<string, string | null> = {}) {
		const values: Record<string, string | null> = {
			accessToken: 'tenant_token',
			accountId: '12345',
			baseUri: 'https://demo.docusign.net/restapi/v2.1',
			...overrides,
		};
		return {
			get_access_token: async () => values.accessToken ?? null,
			get_account_id: async () => values.accountId ?? null,
			get_base_uri: async () => values.baseUri ?? null,
		};
	}

	it('keyBuilder resolves the tenant keychain bundle', async () => {
		const key = await buildKey(
			{
				options: {},
				authType: 'oauth_2',
				keys: keychain(),
				tenantId: 'acme',
			},
			'endpoint',
		);
		expect(JSON.parse(key)).toEqual({
			accessToken: 'tenant_token',
			accountId: '12345',
			baseUri: 'https://demo.docusign.net/restapi/v2.1',
		});
	});

	it('keyBuilder prefers factory options for direct config', async () => {
		const key = await buildKey(
			{
				options: {
					accessToken: 'factory_token',
					accountId: '99999',
				},
				authType: 'oauth_2',
				tenantId: 'default',
			},
			'endpoint',
		);
		expect(JSON.parse(key)).toEqual({
			accessToken: 'factory_token',
			accountId: '99999',
		});
	});

	it('keyBuilder throws when the tenant has no credentials', async () => {
		await expect(
			buildKey(
				{
					options: {},
					authType: 'oauth_2',
					keys: keychain({ accessToken: null, accountId: null }),
					tenantId: 'acme',
				},
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('factory defaults authType so the runtime provisions tenant keys', () => {
		const plugin = docusign({
			accessToken: 'factory_token',
			accountId: '12345',
		});
		expect(plugin.options).toEqual(
			expect.objectContaining({ authType: 'oauth_2' }),
		);
	});
});

describe('DocuSign plugin meta', () => {
	it('exposes 339 endpoints', () => {
		expect(Object.keys(docusignEndpointsNested)).toHaveLength(339);
	});

	it('every endpoint has meta with a valid risk level', () => {
		const names = Object.keys(docusignEndpointsNested);
		expect(Object.keys(docusignEndpointMeta)).toHaveLength(names.length);
		for (const name of names) {
			const meta = (
				docusignEndpointMeta as Record<
					string,
					{ description?: unknown; riskLevel?: unknown }
				>
			)[name];
			expect(typeof meta?.description).toBe('string');
			expect(['read', 'write', 'destructive']).toContain(meta?.riskLevel);
		}
	});

	it('every endpoint has input and output schemas', () => {
		const schemas = endpoints.docusignEndpointSchemas as Record<
			string,
			{ input?: unknown; output?: unknown }
		>;
		for (const name of Object.keys(docusignEndpointsNested)) {
			expect(schemas[name]?.input).toBeDefined();
			expect(schemas[name]?.output).toBeDefined();
		}
	});
});
