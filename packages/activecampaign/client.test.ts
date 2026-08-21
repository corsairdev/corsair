import { ActiveCampaignAPIError } from './client';

/**
 * `request` may hand fetch either a plain object or a `Headers` instance, so
 * header assertions normalise both. Reading only one shape would let an
 * assertion pass against an empty object.
 */
function readHeaders(init: RequestInit | undefined): Record<string, string> {
	const raw = init?.headers;
	if (!raw) return {};
	if (raw instanceof Headers) return Object.fromEntries(raw.entries());
	if (Array.isArray(raw)) return Object.fromEntries(raw);
	return Object.fromEntries(
		Object.entries(raw as Record<string, string>).map(([k, v]) => [k, v]),
	);
}

describe('ActiveCampaign client', () => {
	const originalFetch = globalThis.fetch;
	let calls: Array<{ url: string; init?: RequestInit }>;

	beforeEach(() => {
		calls = [];
		globalThis.fetch = (async (url: string, init?: RequestInit) => {
			calls.push({ url: String(url), init });
			return new Response(JSON.stringify({ tags: [], meta: { total: '0' } }), {
				status: 200,
				headers: { 'Content-Type': 'application/json' },
			});
		}) as typeof fetch;
	});

	afterEach(() => {
		globalThis.fetch = originalFetch;
	});

	describe('credential validation', () => {
		it('rejects a missing API token before issuing a request', async () => {
			const { makeActiveCampaignRequest } = await import('./client');
			await expect(
				makeActiveCampaignRequest('tags', '', 'example'),
			).rejects.toBeInstanceOf(ActiveCampaignAPIError);
			expect(calls).toHaveLength(0);
		});

		it('rejects a missing account before issuing a request', async () => {
			const { makeActiveCampaignRequest } = await import('./client');
			await expect(
				makeActiveCampaignRequest('tags', 'token-123', ''),
			).rejects.toBeInstanceOf(ActiveCampaignAPIError);
			expect(calls).toHaveLength(0);
		});

		/**
		 * The account slug is interpolated into the hostname, so a value
		 * carrying a slash or a dot could redirect the request to another host.
		 */
		it.each([
			['evil.com/', 'a slash'],
			['host.other.com', 'a dot'],
			['a b', 'a space'],
			['acct@x', 'an at sign'],
		])('rejects an account containing %s (%s)', async (account) => {
			const { makeActiveCampaignRequest } = await import('./client');
			await expect(
				makeActiveCampaignRequest('tags', 'token-123', account),
			).rejects.toBeInstanceOf(ActiveCampaignAPIError);
			expect(calls).toHaveLength(0);
		});

		it('accepts an account of letters, digits and hyphens', async () => {
			const { makeActiveCampaignRequest } = await import('./client');
			await makeActiveCampaignRequest('tags', 'token-123', 'my-account-1');
			expect(calls).toHaveLength(1);
		});
	});

	describe('request shape', () => {
		it('sends the token in an Api-Token header, not a query string', async () => {
			const { makeActiveCampaignRequest } = await import('./client');
			await makeActiveCampaignRequest('tags', 'token-123', 'example');

			expect(calls).toHaveLength(1);
			const headers = readHeaders(calls[0]?.init);
			const headerNames = Object.keys(headers).map((h) => h.toLowerCase());
			expect(headerNames).toContain('api-token');
			expect(headers['Api-Token'] ?? headers['api-token']).toBe('token-123');
			// A key in the query string would leak into logs and referrers.
			expect(calls[0]?.url).not.toContain('token-123');
		});

		it('builds the account-specific base URL', async () => {
			const { makeActiveCampaignRequest } = await import('./client');
			await makeActiveCampaignRequest('tags', 'token-123', 'example');
			expect(calls[0]?.url).toContain('https://example.api-us1.com/api/3');
			expect(calls[0]?.url).toContain('/tags');
		});

		it('routes GraphQL to /ecom/graphql on the same host', async () => {
			const { makeActiveCampaignGraphQLRequest } = await import('./client');
			await makeActiveCampaignGraphQLRequest(
				'{ products { id } }',
				'token-123',
				'example',
			);
			expect(calls[0]?.url).toContain('https://example.api-us1.com/api/3');
			expect(calls[0]?.url).toContain('ecom/graphql');
			const headers = readHeaders(calls[0]?.init);
			expect(headers['Api-Token'] ?? headers['api-token']).toBe('token-123');
		});

		it('uses the same auth header for REST and GraphQL', async () => {
			const { makeActiveCampaignRequest, makeActiveCampaignGraphQLRequest } =
				await import('./client');
			await makeActiveCampaignRequest('tags', 'token-123', 'example');
			await makeActiveCampaignGraphQLRequest('{ x }', 'token-123', 'example');
			const first = readHeaders(calls[0]?.init);
			const second = readHeaders(calls[1]?.init);
			expect(first['Api-Token'] ?? first['api-token']).toBe(
				second['Api-Token'] ?? second['api-token'],
			);
		});
	});
});
