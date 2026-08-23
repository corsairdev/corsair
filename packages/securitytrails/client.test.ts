import { z } from 'zod';
import {
	makeSecuritytrailsRequest,
	REDACTED_API_KEY,
	redactEchoedApiKey,
	SECURITYTRAILS_API_BASES,
	SecuritytrailsAPIError,
} from './client';
import { installFetchHarness } from './test-harness';

describe('SecurityTrails client', () => {
	let harness: ReturnType<typeof installFetchHarness>;

	beforeEach(() => {
		harness = installFetchHarness();
	});

	afterEach(() => {
		harness.restore();
	});

	it('authenticates with the APIKEY header', async () => {
		harness.queue({ body: { hostname: 'example.com' } });

		await makeSecuritytrailsRequest('domain/example.com', 'test-api-key');

		expect(harness.requestAt(0).method).toBe('GET');
		expect(harness.requestAt(0).url).toBe(
			'https://api.securitytrails.com/v1/domain/example.com',
		);
		expect(harness.requestAt(0).headers.apikey).toBe('test-api-key');
	});

	// The shared transport turns OpenAPIConfig.TOKEN into `Authorization: Bearer`.
	// SecurityTrails reads only APIKEY, so setting TOKEN would copy the key into a
	// second header for no reason.
	it('does not send the key in an Authorization header', async () => {
		harness.queue({ body: {} });

		await makeSecuritytrailsRequest('ping', 'test-api-key');

		expect(harness.requestAt(0).headers.authorization).toBeUndefined();
	});

	it('routes v2 endpoints to the v2 base URL', async () => {
		harness.queue({ body: { data: [] } });

		await makeSecuritytrailsRequest('projects', 'test-api-key', {
			version: 'v2',
		});

		expect(harness.requestAt(0).url).toBe(
			`${SECURITYTRAILS_API_BASES.v2}/projects`,
		);
	});

	it('omits undefined query parameters instead of serialising them', async () => {
		harness.queue({ body: {} });

		await makeSecuritytrailsRequest('domain/example.com/ssl', 'test-api-key', {
			query: { page: 2, status: undefined, include_subdomains: undefined },
		});

		const { url } = harness.requestAt(0);
		expect(url).toContain('page=2');
		expect(url).not.toContain('status');
		expect(url).not.toContain('undefined');
	});

	it('sends a JSON body for POST and omits it for GET', async () => {
		harness.queue({ body: {} }, { body: {} });

		await makeSecuritytrailsRequest('ips/list', 'test-api-key', {
			method: 'POST',
			body: { query: "ptr_part = 'ns1'" },
		});
		await makeSecuritytrailsRequest('ping', 'test-api-key', {
			method: 'GET',
			body: { ignored: true },
		});

		expect(harness.requestAt(0).body).toEqual({ query: "ptr_part = 'ns1'" });
		expect(harness.requestAt(1).body).toBeUndefined();
	});

	it('rejects an empty API key before making a request', async () => {
		await expect(makeSecuritytrailsRequest('ping', '')).rejects.toBeInstanceOf(
			SecuritytrailsAPIError,
		);

		expect(harness.requests).toHaveLength(0);
	});

	// These two pin the behaviour that error-handlers.ts depends on: the shared
	// transport already owns 429 retries, which is why every plugin-level
	// handler returns maxRetries: 0 instead of retrying a second time.
	const rateLimited = {
		status: 429,
		body: { message: 'API rate limit exceeded' },
		headers: { 'Retry-After': '1' },
	};

	it('lets the transport retry a 429 before it reaches the caller', async () => {
		harness.queue(rateLimited, { body: { success: true } });

		const result = await makeSecuritytrailsRequest('ping', 'test-api-key');

		expect(harness.requests).toHaveLength(2);
		expect(result).toEqual({ success: true });
	});

	it('surfaces the ApiError once the transport exhausts its retries', async () => {
		// DEFAULT_RATE_LIMIT_CONFIG allows 3 retries, so 4 attempts in total.
		harness.queue(rateLimited, rateLimited, rateLimited, rateLimited);

		await expect(
			makeSecuritytrailsRequest('ping', 'test-api-key'),
		).rejects.toMatchObject({ status: 429, retryAfter: 1000 });

		expect(harness.requests).toHaveLength(4);
	});

	it('validates the response against the supplied schema', async () => {
		harness.queue({ body: { current_monthly_usage: 'not-a-number' } });

		await expect(
			makeSecuritytrailsRequest('account/usage', 'test-api-key', {
				schema: z.object({ current_monthly_usage: z.number().optional() }),
			}),
		).rejects.toBeInstanceOf(SecuritytrailsAPIError);
	});

	it('returns parsed data when the response matches the schema', async () => {
		harness.queue({ body: { current_monthly_usage: 100 } });

		const result = await makeSecuritytrailsRequest(
			'account/usage',
			'test-api-key',
			{ schema: z.object({ current_monthly_usage: z.number() }) },
		);

		expect(result).toEqual({ current_monthly_usage: 100 });
	});

	describe('echoed API key redaction', () => {
		// The documented 200 example for GET /v1/domain/{hostname}/ssl echoes the
		// caller's apikey back inside meta.query.
		it('redacts meta.query.apikey from a live response', async () => {
			harness.queue({
				body: {
					meta: { page: 1, query: { apikey: 'super-secret', page: '1' } },
					records: [],
				},
			});

			const result = await makeSecuritytrailsRequest<{
				meta: { query: { apikey: string; page: string } };
			}>('domain/example.com/ssl', 'super-secret');

			expect(result.meta.query.apikey).toBe(REDACTED_API_KEY);
			expect(result.meta.query.page).toBe('1');
			expect(JSON.stringify(result)).not.toContain('super-secret');
		});

		it('leaves payloads without an echoed key untouched', () => {
			const payload = { meta: { query: { page: '1' } }, records: [] };
			expect(redactEchoedApiKey(payload)).toBe(payload);
		});

		it('tolerates responses with no meta at all', () => {
			expect(redactEchoedApiKey({ success: true })).toEqual({ success: true });
			expect(redactEchoedApiKey(null)).toBeNull();
			expect(redactEchoedApiKey('plain')).toBe('plain');
		});
	});
});
