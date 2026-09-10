import { WorkableAPIError } from './client';

function readHeaders(init: RequestInit | undefined): Record<string, string> {
	const raw = init?.headers;
	if (!raw) return {};
	if (raw instanceof Headers) return Object.fromEntries(raw.entries());
	if (Array.isArray(raw)) return Object.fromEntries(raw);
	return Object.fromEntries(Object.entries(raw as Record<string, string>));
}

describe('Workable client', () => {
	const originalFetch = globalThis.fetch;
	let calls: Array<{ url: string; init?: RequestInit }>;

	beforeEach(() => {
		calls = [];
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			return new Response(JSON.stringify({ departments: [] }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	describe('credential validation', () => {
		it('rejects a missing access token before issuing a request', async () => {
			const { makeWorkableRequest } = await import('./client');
			await expect(
				makeWorkableRequest('/departments', '', 'example'),
			).rejects.toBeInstanceOf(WorkableAPIError);
			expect(calls).toHaveLength(0);
		});

		it('rejects a missing subdomain before issuing a request', async () => {
			const { makeWorkableRequest } = await import('./client');
			await expect(
				makeWorkableRequest('/departments', 'token-123', ''),
			).rejects.toBeInstanceOf(WorkableAPIError);
			expect(calls).toHaveLength(0);
		});

		it.each([
			['evil.com/', 'a slash'],
			['host.other.com', 'a dot'],
			['a b', 'a space'],
		])(
			'rejects a subdomain containing %s (%s) since it is interpolated into the hostname',
			async (subdomain) => {
				const { makeWorkableRequest } = await import('./client');
				await expect(
					makeWorkableRequest('/departments', 'token-123', subdomain),
				).rejects.toBeInstanceOf(WorkableAPIError);
				expect(calls).toHaveLength(0);
			},
		);

		it('accepts a subdomain of letters, digits and hyphens', async () => {
			const { makeWorkableRequest } = await import('./client');
			await makeWorkableRequest('/departments', 'token-123', 'my-account-1');
			expect(calls).toHaveLength(1);
		});
	});

	describe('request shape', () => {
		it('sends a Bearer token, not a query string', async () => {
			const { makeWorkableRequest } = await import('./client');
			await makeWorkableRequest('/departments', 'token-123', 'example');

			expect(calls).toHaveLength(1);
			const headers = readHeaders(calls[0]?.init);
			const headerNames = Object.keys(headers).map((h) => h.toLowerCase());
			expect(headerNames).toContain('authorization');
			expect(headers.Authorization ?? headers.authorization).toBe(
				'Bearer token-123',
			);
			expect(calls[0]?.url).not.toContain('token-123');
		});

		it('builds the subdomain-specific base URL', async () => {
			const { makeWorkableRequest } = await import('./client');
			await makeWorkableRequest('/departments', 'token-123', 'example');
			expect(calls[0]?.url).toBe(
				'https://example.workable.com/spi/v3/departments',
			);
		});
	});

	describe('public job-board request', () => {
		it('sends no Authorization header and hits www.workable.com', async () => {
			const { makeWorkablePublicRequest } = await import('./client');
			await makeWorkablePublicRequest('example');
			expect(calls).toHaveLength(1);
			expect(calls[0]?.url).toBe(
				'https://www.workable.com/api/accounts/example',
			);
			const headers = readHeaders(calls[0]?.init);
			expect(Object.keys(headers).map((h) => h.toLowerCase())).not.toContain(
				'authorization',
			);
		});

		it('rejects a missing subdomain before issuing a request', async () => {
			const { makeWorkablePublicRequest } = await import('./client');
			await expect(makeWorkablePublicRequest('')).rejects.toBeInstanceOf(
				WorkableAPIError,
			);
			expect(calls).toHaveLength(0);
		});
	});
});
