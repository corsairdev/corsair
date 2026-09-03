import type { DocusignRequestOptions } from './client';
import { DocusignClient } from './client';
import type { EndpointContractCase } from './endpoint-contract-cases';
import { endpointContractCases } from './endpoint-contract-cases';
import * as endpoints from './endpoints';
import { docusignEndpointMeta, docusignEndpointsNested } from './index';

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

describe('DocuSign generated endpoints', () => {
	const makeClient = () => {
		const client = new DocusignClient({
			accessToken: 'mock_token',
			accountId: '12345',
			baseUri: 'https://demo.docusign.net/restapi/v2.1',
		});
		const calls: Array<{ url: string; options: DocusignRequestOptions }> = [];
		jest
			.spyOn(client, 'request')
			.mockImplementation(
				async (url: string, options: DocusignRequestOptions = {}) => {
					calls.push({ url, options });
					return {};
				},
			);
		return { client, calls };
	};

	afterEach(() => {
		jest.restoreAllMocks();
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
			const { client, calls } = makeClient();
			const params: Record<string, unknown> = {};
			for (const p of pathParams) params[p] = 'test-id';
			for (const q of queryParams) params[q.name] = sampleValue(q.type);
			if (hasBody) params.body = { hello: 'world' };
			const fn = (
				endpoints as unknown as Record<
					string,
					(ctx: unknown, params: unknown) => Promise<unknown>
				>
			)[name];
			if (typeof fn !== 'function')
				throw new Error(`missing endpoint: ${name}`);
			await fn({ client }, params);
			expect(calls.length).toBe(1);
			const call = calls[0] as { url: string; options: DocusignRequestOptions };
			expect(call.options.method).toBe(method);
			let expected = path;
			for (const p of pathParams)
				expected = expected.split(`{${p}}`).join('test-id');
			const base = 'https://demo.docusign.net/restapi/v2.1/accounts/12345';
			const parts = call.url.split('?');
			const rawUrl = parts[0] ?? '';
			const rawQuery = parts[1] ?? '';
			const receivedPath = rawUrl.startsWith(base)
				? rawUrl.slice(base.length)
				: rawUrl;
			const norm = (s: string) => s.replace(/\/+$/, '');
			expect(norm(receivedPath)).toBe(norm(expected));
			const receivedQuery = new URLSearchParams(rawQuery);
			for (const q of queryParams) {
				expect(receivedQuery.get(q.name)).toBe(
					expectedQueryString(sampleValue(q.type)),
				);
			}
			if (hasBody) {
				expect(call.options.body).toBe(JSON.stringify({ hello: 'world' }));
			} else {
				expect(call.options.body).toBeUndefined();
			}
		},
	);

	it('listOAuthUserInfo calls the OAuth userinfo endpoint', async () => {
		const client = new DocusignClient({
			accessToken: 'mock_token',
			accountId: '12345',
		});
		const spy = jest
			.spyOn(client, 'userInfo')
			.mockResolvedValue({ sub: 'user-1' });
		const res = await endpoints.listOAuthUserInfo({ client }, {});
		expect(spy).toHaveBeenCalledTimes(1);
		expect(res).toEqual({ sub: 'user-1' });
	});

	it('fetchRecipientNamesForEmail filters recipients by email', async () => {
		const client = new DocusignClient({
			accessToken: 'mock_token',
			accountId: '12345',
		});
		jest.spyOn(client, 'request').mockResolvedValue({
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
