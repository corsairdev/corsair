import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	makeSalesforceRequest,
	SALESFORCE_API_VERSION,
	SalesforceInstanceUrlMissingError,
	SalesforceRequestOriginError,
} from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
	body?: string;
};

let captured: Captured | undefined;

function mockFetch(response: {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
	text?: string;
	bytes?: Uint8Array;
}) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((v, k) => {
				headers[k] = v;
				headers[k.toLowerCase()] = v;
			});
		} else if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
			for (const [k, v] of Object.entries(raw as Record<string, string>)) {
				headers[k] = v;
				headers[k.toLowerCase()] = v;
			}
		}
		captured = {
			url: String(url),
			method: String(init?.method ?? 'GET'),
			headers,
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		const headerMap = new Headers(
			response.headers ?? { 'content-type': 'application/json' },
		);
		return {
			ok: response.ok ?? true,
			status: response.status ?? 200,
			statusText: 'OK',
			headers: headerMap,
			json: async () => response.body ?? {},
			text: async () => response.text ?? JSON.stringify(response.body ?? {}),
			arrayBuffer: async () =>
				response.bytes
					? response.bytes.slice().buffer
					: new Uint8Array().buffer,
			clone() {
				return this;
			},
		} as Response;
	}) as typeof fetch;
}

describe('makeSalesforceRequest', () => {
	const instanceUrl = 'https://example.my.salesforce.com';

	it('throws AuthMissingError when the token is empty', async () => {
		await expect(
			makeSalesforceRequest('sobjects/Account', '', { instanceUrl }),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('throws when instance URL is missing', async () => {
		await expect(
			makeSalesforceRequest('sobjects/Account', 'token'),
		).rejects.toBeInstanceOf(SalesforceInstanceUrlMissingError);
	});

	it('calls the org host, not login.salesforce.com', async () => {
		mockFetch({ body: { Id: '001xx' } });
		await makeSalesforceRequest('sobjects/Account/001xx', 'session', {
			instanceUrl,
		});
		expect(captured?.url).toContain(instanceUrl);
		expect(captured?.url).not.toContain('login.salesforce.com');
		expect(captured?.url).toContain(
			`/services/data/v${SALESFORCE_API_VERSION}/`,
		);
		expect(
			captured?.headers.authorization ?? captured?.headers.Authorization,
		).toBe('Bearer session');
	});

	it('does not wrap ApiError so 429 retryAfter survives', async () => {
		mockFetch({
			ok: false,
			status: 429,
			body: [{ errorCode: 'REQUEST_LIMIT_EXCEEDED', message: 'slow down' }],
			headers: { 'content-type': 'application/json', 'retry-after': '2' },
		});
		await expect(
			makeSalesforceRequest('query', 'token', { instanceUrl }),
		).rejects.toBeInstanceOf(ApiError);
	});

	it('sends PUT CSV as text/csv to the org host', async () => {
		mockFetch({ ok: true, status: 201, text: '', body: undefined });
		await makeSalesforceRequest('jobs/ingest/job1/batches', 'token', {
			instanceUrl,
			method: 'PUT',
			body: 'Name\nAcme',
			mediaType: 'text/csv',
		});
		expect(captured?.method).toBe('PUT');
		expect(
			captured?.headers['content-type'] ?? captured?.headers['Content-Type'],
		).toContain('text/csv');
		expect(captured?.body).toBe('Name\nAcme');
	});

	it('discovers instance URL from userinfo urls.rest', async () => {
		const { discoverSalesforceInstanceUrl } = await import('./client');
		mockFetch({
			body: {
				urls: {
					rest: 'https://na1.salesforce.com/services/data/v60.0/',
				},
			},
		});
		await expect(discoverSalesforceInstanceUrl('token')).resolves.toBe(
			'https://na1.salesforce.com',
		);
	});

	it('rejects HTTP instance URLs and off-origin absolute endpoints', async () => {
		mockFetch({ body: { Id: '001xx' } });
		await expect(
			makeSalesforceRequest('sobjects/Account', 'token', {
				instanceUrl: 'http://example.my.salesforce.com',
			}),
		).rejects.toBeInstanceOf(SalesforceRequestOriginError);

		captured = undefined;
		await expect(
			makeSalesforceRequest('https://evil.example/steal', 'token', {
				instanceUrl,
			}),
		).rejects.toBeInstanceOf(SalesforceRequestOriginError);
		expect(captured).toBeUndefined();
	});

	it('keeps same-origin absolute endpoints on the org host', async () => {
		mockFetch({ body: { records: [] } });
		await makeSalesforceRequest(
			`${instanceUrl}/services/data/v${SALESFORCE_API_VERSION}/query/01gxx`,
			'token',
			{ instanceUrl },
		);
		expect(new URL(captured?.url ?? '').origin).toBe(instanceUrl);
		expect(captured?.url).toContain('/query/01gxx');
	});

	it('returns VersionData as raw bytes', async () => {
		const bytes = Uint8Array.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
		mockFetch({
			bytes,
			headers: { 'content-type': 'application/octet-stream' },
		});
		const buf = await makeSalesforceRequest(
			'sobjects/ContentVersion/068xx/VersionData',
			'token',
			{ instanceUrl, responseType: 'binary' },
		);
		expect(Buffer.from(buf as Buffer)).toEqual(Buffer.from(bytes));
		expect(captured?.headers.accept ?? captured?.headers.Accept).toContain(
			'octet-stream',
		);
	});

	it('retries binary VersionData on 429', async () => {
		const bytes = Uint8Array.from([0xff, 0xd8]);
		let calls = 0;
		global.fetch = (async (url: unknown, init?: RequestInit) => {
			calls += 1;
			captured = {
				url: String(url),
				method: String(init?.method ?? 'GET'),
				headers: {},
			};
			if (calls === 1) {
				return {
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					headers: new Headers({ 'retry-after': '0' }),
					json: async () => [{ errorCode: 'REQUEST_LIMIT_EXCEEDED' }],
					text: async () => '',
					arrayBuffer: async () => new Uint8Array().buffer,
					clone() {
						return this;
					},
				} as Response;
			}
			return {
				ok: true,
				status: 200,
				statusText: 'OK',
				headers: new Headers({ 'content-type': 'application/octet-stream' }),
				json: async () => ({}),
				text: async () => '',
				arrayBuffer: async () => bytes.slice().buffer,
				clone() {
					return this;
				},
			} as Response;
		}) as typeof fetch;

		const buf = await makeSalesforceRequest(
			'sobjects/ContentVersion/068xx/VersionData',
			'token',
			{ instanceUrl, responseType: 'binary' },
		);
		expect(calls).toBe(2);
		expect(Buffer.from(buf as Buffer)).toEqual(Buffer.from(bytes));
	});
});
