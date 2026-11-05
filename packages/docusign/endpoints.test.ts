import { z } from 'zod';
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
import {
	joinUrl,
	lastFetchCall,
	mockFetchJson,
	mockFetchText,
} from './test-fetch';

type SampleValue = string | number | boolean | string[];

function sampleValue(type: string): SampleValue {
	if (type === 'integer' || type === 'number') return 7;
	if (type === 'boolean') return true;
	if (type === 'array') return ['a', 'b'];
	return 'test-value';
}

function expectedQueryString(value: SampleValue): string {
	if (Array.isArray(value)) return value.map(String).join(',');
	return String(value);
}

const RESPONSE_BODY = { id: 'resp-1' };

const endpointsByName = new Map(Object.entries(docusignEndpointsNested));
const schemasByName = new Map(
	Object.entries(endpoints.docusignEndpointSchemas),
);

const IMAGE_ENDPOINTS = new Set([
	'updateUserProfileImage',
	'setUserSignatureImage',
	'setInitialsImageForAccountlessSigner',
	'setSignatureImageForNoAccountSigner',
]);

const specialBodies: Record<string, object> = {
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

function authHeader(init: RequestInit): string | null {
	const headers = new Headers(init.headers ?? {});
	return headers.get('Authorization');
}

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

	let fetchMock: jest.Mock;

	beforeEach(() => {
		fetchMock = mockFetchJson(RESPONSE_BODY);
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
			const params: Record<string, SampleValue | object> = {};
			for (const p of pathParams)
				params[p] = p === 'bulkAction' ? 'void' : 'test-id';
			for (const q of queryParams) params[q.name] = sampleValue(q.type);
			if (IMAGE_ENDPOINTS.has(name)) {
				params.imageBase64 = 'aGVsbG8=';
				params.contentType = 'image/png';
			} else if (hasBody) {
				params.body = specialBodies[name] ?? { hello: 'world' };
			}
			const returnsText =
				schemasByName.get(name)?.output instanceof z.ZodString;
			if (returnsText) {
				fetchMock.mockResolvedValueOnce(
					new Response('file-content', {
						status: 200,
						headers: { 'Content-Type': 'text/plain' },
					}),
				);
			}
			const fn = endpointsByName.get(name);
			if (typeof fn !== 'function')
				throw new Error(`missing endpoint: ${name}`);
			const result = await Reflect.apply(fn, undefined, [{ client }, params]);
			expect(result).toEqual(returnsText ? 'file-content' : RESPONSE_BODY);
			expect(fetchMock).toHaveBeenCalledTimes(1);
			const { url, init } = lastFetchCall();
			expect(url.startsWith(expectedBase(path))).toBe(true);
			expect(authHeader(init)).toBe('Bearer mock_token');
			expect(init.method ?? 'GET').toBe(method);
			let expected = path;
			if (expected === '/v2.1' || expected.startsWith('/v2.1/')) {
				expected = expected.slice('/v2.1'.length);
			}
			for (const p of pathParams)
				expected = expected
					.split(`{${p}}`)
					.join(p === 'bulkAction' ? 'void' : 'test-id');
			const expectedUrl = joinUrl(expectedBase(path), expected);
			const urlParts = url.split('?');
			const receivedPath = urlParts[0] ?? '';
			const receivedQuery = new URLSearchParams(urlParts[1] ?? '');
			const norm = (s: string) => s.replace(/\/+$/, '');
			expect(norm(receivedPath)).toBe(norm(expectedUrl.split('?')[0] ?? ''));
			for (const q of queryParams) {
				expect(receivedQuery.get(q.name)).toBe(
					expectedQueryString(sampleValue(q.type)),
				);
			}
			if (IMAGE_ENDPOINTS.has(name)) {
				expect(init.body).toBeInstanceOf(Blob);
			} else if (hasBody) {
				expect(init.body).toBe(
					JSON.stringify(specialBodies[name] ?? { hello: 'world' }),
				);
			} else {
				expect(init.body).toBeUndefined();
			}
		},
	);

	it('routes service_information to the api root', async () => {
		const client = makeClient();
		await client.request('/service_information');
		expect(lastFetchCall().url).toBe(
			'https://demo.docusign.net/restapi/service_information',
		);
	});

	it('routes versioned paths to the version root', async () => {
		const client = makeClient();
		await client.request('/v2.1/diagnostics/settings');
		expect(lastFetchCall().url).toBe(
			'https://demo.docusign.net/restapi/v2.1/diagnostics/settings',
		);
	});

	it('listOAuthUserInfo calls the OAuth userinfo endpoint', async () => {
		const client = makeClient();
		mockFetchJson({ sub: 'user-1' });
		const res = await endpoints.listOAuthUserInfo({ client }, {});
		expect(lastFetchCall().url).toBe(
			'https://account-d.docusign.com/oauth/userinfo',
		);
		expect(res).toEqual({ sub: 'user-1' });
	});

	it('fetchRecipientNamesForEmail filters recipients by email', async () => {
		const client = makeClient();
		mockFetchJson({
			signers: [
				{ email: 'jane@example.com', name: 'Jane Doe' },
				{ email: 'john@example.com', name: 'John Smith' },
			],
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
		mockFetchJson({
			signers: [],
			agents: [{ email: 'agent@example.com', name: 'Agent Alice' }],
			editors: [{ email: 'agent@example.com', userName: 'Editor Ed' }],
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
		mockFetchText('binary-file-bytes');
		const res = await endpoints.getWorkspaceFile(
			{ client },
			{ workspaceId: 'w1', folderId: 'f1', fileId: 'file1' },
		);
		expect(res).toBe('binary-file-bytes');
	});

	it('base64-encodes binary responses', async () => {
		const client = makeClient();
		fetchMock.mockResolvedValueOnce(
			new Response(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), {
				status: 200,
				headers: { 'Content-Type': 'image/png' },
			}),
		);
		const res = await endpoints.retrieveUserProfileImage(
			{ client },
			{ userId: 'u1' },
		);
		expect(res).toBe('iVBORw==');
	});

	it('resolves the client from the Corsair runtime context shape', async () => {
		mockFetchJson({ envelopeId: 'env_9', status: 'sent' });
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
		expect(lastFetchCall().url).toContain(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345/envelopes/env_9',
		);
		expect(authHeader(lastFetchCall().init)).toBe('Bearer mock_token');
	});

	it('rejects a runtime context without credentials', () => {
		expect(() => resolveClient({ db: {}, tenantId: 'default' })).toThrow(
			'Invalid execution context',
		);
	});

	it('prefers the tenant key bundle over factory options', async () => {
		mockFetchJson({ envelopeId: 'env_9', status: 'sent' });
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
		expect(lastFetchCall().url).toContain(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345/envelopes/env_9',
		);
		expect(authHeader(lastFetchCall().init)).toBe('Bearer tenant_token');
	});

	it('combines a raw key token with options routing', async () => {
		mockFetchJson({ envelopeId: 'env_9', status: 'sent' });
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
		expect(lastFetchCall().url).toContain(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345/envelopes/env_9',
		);
		expect(authHeader(lastFetchCall().init)).toBe('Bearer raw_tenant_token');
	});
});

describe('DocuSign tenant credential lifecycle', () => {
	const buildKey = (ctx: object, source: string): Promise<string> =>
		Reflect.apply(docusignPlugin.keyBuilder, undefined, [ctx, source]);

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

	it('keyBuilder never lets factory options override the tenant', async () => {
		const key = await buildKey(
			{
				options: {
					accessToken: 'factory_token',
					accountId: '99999',
				},
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

	it('keyBuilder uses factory options when no key manager exists', async () => {
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

	it('keyBuilder throws instead of falling back to factory options', async () => {
		await expect(
			buildKey(
				{
					options: {
						accessToken: 'factory_token',
						accountId: '99999',
					},
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
	it('exposes 340 endpoints', () => {
		expect(Object.keys(docusignEndpointsNested)).toHaveLength(340);
	});

	it('every endpoint has meta with a valid risk level', () => {
		const names = Object.keys(docusignEndpointsNested);
		expect(Object.keys(docusignEndpointMeta)).toHaveLength(names.length);
		for (const [, meta] of Object.entries(docusignEndpointMeta)) {
			expect(meta.description.length).toBeGreaterThan(0);
			expect(['read', 'write', 'destructive']).toContain(meta.riskLevel);
		}
	});

	it('every endpoint has input and output schemas', () => {
		for (const name of Object.keys(docusignEndpointsNested)) {
			expect(schemasByName.get(name)?.input).toBeInstanceOf(z.ZodType);
			expect(schemasByName.get(name)?.output).toBeInstanceOf(z.ZodType);
		}
	});
});

describe('DocuSign edit locks and risk levels', () => {
	const client = new DocusignClient({
		accessToken: 'mock_token',
		accountId: '12345',
	});

	beforeEach(() => {
		mockFetchJson({});
	});

	it('sends the lock token header when releasing a template lock', async () => {
		await endpoints.deleteTemplateLock(
			{ client },
			{ templateId: 't1', lockToken: 'tok-1' },
		);
		const { url, init } = lastFetchCall();
		expect(url).toBe(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345/templates/t1/lock',
		);
		expect(init.method).toBe('DELETE');
		expect(new Headers(init.headers).get('X-DocuSign-Edit')).toBe(
			'{"LockToken":"tok-1"}',
		);
	});

	it('sends the lock token header when extending an envelope lock', async () => {
		await endpoints.updateLockForEnvelope(
			{ client },
			{
				envelopeId: 'e1',
				lockToken: 'tok-2',
				body: { lockDurationInSeconds: '300' },
			},
		);
		const { init } = lastFetchCall();
		expect(init.method).toBe('PUT');
		expect(new Headers(init.headers).get('X-DocuSign-Edit')).toBe(
			'{"LockToken":"tok-2"}',
		);
		expect(init.body).toBe('{"lockDurationInSeconds":"300"}');
	});

	it('omits the lock header when no token is given', async () => {
		await endpoints.deleteEnvelopeLock({ client }, { envelopeId: 'e1' });
		expect(
			new Headers(lastFetchCall().init.headers).get('X-DocuSign-Edit'),
		).toBe(null);
	});

	it('uploads the profile image as raw bytes with its content type', async () => {
		await endpoints.updateUserProfileImage(
			{ client },
			{ userId: 'u1', imageBase64: 'aGVsbG8=', contentType: 'image/jpeg' },
		);
		const { url, init } = lastFetchCall();
		expect(url).toBe(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345/users/u1/profile/image',
		);
		expect(init.method).toBe('PUT');
		expect(new Headers(init.headers).get('Content-Type')).toBe('image/jpeg');
		expect(await new Response(init.body).text()).toBe('hello');
	});

	it('marks voiding a bulk send batch as destructive', () => {
		expect(docusignEndpointMeta.applyActionToBulkSendEnvelopes.riskLevel).toBe(
			'destructive',
		);
	});

	it('registers the default factory with a tenant auth type', () => {
		expect(docusign().options).toEqual({ authType: 'oauth_2' });
		expect(docusign({ accessToken: 't', accountId: 'a' }).options).toEqual({
			authType: 'oauth_2',
			accessToken: 't',
			accountId: 'a',
		});
	});
});
