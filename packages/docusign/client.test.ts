import { DocusignApiError, DocusignClient } from './client';

function makeClient(baseUri?: string) {
	return new DocusignClient({
		accessToken: 'mock_token',
		accountId: '12345',
		...(baseUri === undefined ? {} : { baseUri }),
	});
}

function jsonResponse(
	body: unknown,
	init: {
		status?: number;
		statusText?: string;
		headers?: Record<string, string>;
	} = {},
): Response {
	return new Response(body === undefined ? null : JSON.stringify(body), {
		status: init.status ?? 200,
		statusText: init.statusText ?? 'OK',
		headers: {
			'Content-Type': 'application/json',
			...(init.headers ?? {}),
		},
	});
}

function lastFetchCall() {
	const calls = (globalThis.fetch as jest.Mock).mock.calls;
	const last = calls[calls.length - 1];
	if (!last) {
		throw new Error('expected fetch to be called');
	}
	return { url: String(last[0]), init: last[1] as RequestInit };
}

function authHeader(init: RequestInit): string | null {
	return new Headers(init.headers ?? {}).get('Authorization');
}

describe('DocusignClient', () => {
	beforeEach(() => {
		globalThis.fetch = jest
			.fn()
			.mockImplementation(() => Promise.resolve(jsonResponse({ ok: true })));
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('sends requests through fetch with bearer auth', async () => {
		const client = makeClient();
		await client.request('/templates');
		const { url, init } = lastFetchCall();
		expect(url).toBe(
			'https://demo.docusign.net/restapi/v2.1/accounts/12345/templates',
		);
		expect(authHeader(init)).toBe('Bearer mock_token');
		expect(init.method ?? 'GET').toBe('GET');
	});

	it('retries safe GETs at the transport layer only', async () => {
		const fetchMock = globalThis.fetch as jest.Mock;
		fetchMock
			.mockImplementationOnce(() =>
				Promise.resolve(
					jsonResponse(
						{ errorCode: 'RATE_LIMIT_EXCEEDED' },
						{
							status: 429,
							statusText: 'Too Many Requests',
							headers: { 'retry-after': '0' },
						},
					),
				),
			)
			.mockImplementationOnce(() =>
				Promise.resolve(jsonResponse({ ok: true })),
			);
		const client = makeClient();
		await client.request('/templates');
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});

	it('does not retry non-idempotent writes at the transport layer', async () => {
		const fetchMock = globalThis.fetch as jest.Mock;
		fetchMock.mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse(
					{ errorCode: 'RATE_LIMIT_EXCEEDED' },
					{
						status: 429,
						statusText: 'Too Many Requests',
					},
				),
			),
		);
		const client = makeClient();
		await expect(
			client.request('/envelopes', {
				method: 'POST',
				body: JSON.stringify({ status: 'sent' }),
			}),
		).rejects.toBeInstanceOf(DocusignApiError);
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('normalizes a bare production host', async () => {
		const client = makeClient('na4.docusign.net');
		await client.request('/templates');
		expect(lastFetchCall().url).toBe(
			'https://na4.docusign.net/restapi/v2.1/accounts/12345/templates',
		);
	});

	it('rejects untrusted base URI hosts', () => {
		expect(() => makeClient('https://evil.example.com')).toThrow(
			'Untrusted DocuSign baseUri host',
		);
	});

	it('rejects non-HTTPS base URIs', () => {
		expect(() => makeClient('http://demo.docusign.net')).toThrow(
			'DocuSign baseUri must use HTTPS',
		);
	});

	it('sends JSON bodies with a JSON media type', async () => {
		const client = makeClient();
		await client.request('/envelopes', {
			method: 'POST',
			body: JSON.stringify({ status: 'sent' }),
		});
		const { init } = lastFetchCall();
		expect(init.method).toBe('POST');
		expect(init.body).toBe(JSON.stringify({ status: 'sent' }));
	});

	it('wraps framework errors with the DocuSign error code', async () => {
		(globalThis.fetch as jest.Mock).mockImplementationOnce(() =>
			Promise.resolve(
				jsonResponse(
					{ errorCode: 'RATE_LIMIT_EXCEEDED', message: 'Slow down' },
					{ status: 429, statusText: 'Too Many Requests' },
				),
			),
		);
		const client = makeClient();
		const failure = client.request('/envelopes', {
			method: 'POST',
			body: JSON.stringify({ status: 'sent' }),
		});
		await expect(failure).rejects.toBeInstanceOf(DocusignApiError);
		await expect(failure).rejects.toMatchObject({
			name: 'DocusignApiError',
			status: 429,
			errorCode: 'RATE_LIMIT_EXCEEDED',
		});
	});

	it('calls the demo userinfo endpoint for demo accounts', async () => {
		const client = makeClient();
		await client.userInfo();
		const { url, init } = lastFetchCall();
		expect(url).toBe('https://account-d.docusign.com/oauth/userinfo');
		expect(init.method ?? 'GET').toBe('GET');
		expect(authHeader(init)).toBe('Bearer mock_token');
	});

	it('calls the production userinfo endpoint for production accounts', async () => {
		const client = makeClient('https://eu.docusign.com/restapi/v2.1');
		await client.userInfo();
		expect(lastFetchCall().url).toBe(
			'https://account.docusign.com/oauth/userinfo',
		);
	});

	it('calls the production userinfo endpoint for .net production hosts', async () => {
		const client = makeClient('https://na4.docusign.net/restapi/v2.1');
		await client.userInfo();
		expect(lastFetchCall().url).toBe(
			'https://account.docusign.com/oauth/userinfo',
		);
	});

	it('rejects untrusted auth server hosts', async () => {
		const client = makeClient();
		await expect(client.userInfo('https://evil.example.com')).rejects.toThrow(
			'Untrusted DocuSign auth server host',
		);
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('routes version-root global endpoints without the account suffix', async () => {
		const client = makeClient();
		await client.request('/v2.1/accounts/provisioning');
		expect(lastFetchCall().url).toBe(
			'https://demo.docusign.net/restapi/v2.1/accounts/provisioning',
		);

		await client.request('/v2.1/billing_plans');
		expect(lastFetchCall().url).toBe(
			'https://demo.docusign.net/restapi/v2.1/billing_plans',
		);
	});

	it('rejects path traversal segments without calling the api', async () => {
		const client = makeClient();
		await expect(client.request('/templates/../accounts')).rejects.toThrow(
			'path traversal segments are not allowed',
		);
		await expect(client.request('/templates/%2e%2e/accounts')).rejects.toThrow(
			'path traversal segments are not allowed',
		);
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('rejects braces that would hit the OpenAPI ReDoS regex', async () => {
		const client = makeClient();
		await expect(
			client.request('/templates/{aaaaaaaaaaaaaaaa}'),
		).rejects.toThrow('brace characters are not allowed');
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});

	it('rejects oversized paths before transport', async () => {
		const client = makeClient();
		await expect(client.request(`/${'a'.repeat(600)}`)).rejects.toThrow(
			'exceeds 512 characters',
		);
		expect(globalThis.fetch).not.toHaveBeenCalled();
	});
});
