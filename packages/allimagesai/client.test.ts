import { z } from 'zod';
import {
	AllimagesaiAPIError,
	makeAllimagesaiRequest,
	REDACTED_API_KEY,
	redactApiKeyId,
} from './client';
import { installFetchHarness } from './test-harness';

describe('All Images AI client', () => {
	let harness: ReturnType<typeof installFetchHarness>;

	beforeEach(() => {
		harness = installFetchHarness();
	});

	afterEach(() => {
		harness.restore();
	});

	it('authenticates with the api-key header on the v1 base', async () => {
		harness.queue({ body: { email: 'user@example.com' } });

		await makeAllimagesaiRequest('api-keys/check', 'test-api-key');

		expect(harness.requestAt(0).url).toBe(
			'https://api.all-images.ai/v1/api-keys/check',
		);
		expect(harness.requestAt(0).headers['api-key']).toBe('test-api-key');
	});

	// A live probe returns 401 for Authorization/X-Api-Key and 200 only for
	// `api-key`, so setting OpenAPIConfig.TOKEN would add a header the provider
	// ignores while copying the credential a second time.
	it('does not send the key in an Authorization header', async () => {
		harness.queue({ body: {} });

		await makeAllimagesaiRequest('credit', 'test-api-key');

		expect(harness.requestAt(0).headers.authorization).toBeUndefined();
	});

	it('rejects an empty API key before making a request', async () => {
		await expect(makeAllimagesaiRequest('credit', '')).rejects.toBeInstanceOf(
			AllimagesaiAPIError,
		);
		expect(harness.requests).toHaveLength(0);
	});

	it('omits undefined query parameters instead of serialising them', async () => {
		harness.queue({ body: { prints: [] } });

		await makeAllimagesaiRequest('image-generations', 'test-api-key', {
			query: { limit: 5, offset: undefined, tag: undefined },
		});

		const { url } = harness.requestAt(0);
		expect(url).toContain('limit=5');
		expect(url).not.toContain('offset');
		expect(url).not.toContain('undefined');
	});

	// DELETE /v1/image-generations carries `{ printIds: [...] }` in the body,
	// which is unusual enough that a GET-only body rule would break it.
	it('sends a JSON body on DELETE but not on GET', async () => {
		harness.queue({ empty: true }, { body: {} });

		await makeAllimagesaiRequest('image-generations', 'test-api-key', {
			method: 'DELETE',
			body: { printIds: ['a'] },
			expectEmptyBody: true,
		});
		await makeAllimagesaiRequest('credit', 'test-api-key', {
			method: 'GET',
			body: { ignored: true },
		});

		expect(harness.requestAt(0).body).toEqual({ printIds: ['a'] });
		expect(harness.requestAt(1).body).toBeUndefined();
	});

	it('returns undefined for endpoints that answer with an empty body', async () => {
		harness.queue({ empty: true });

		const result = await makeAllimagesaiRequest(
			'image-generations',
			'test-api-key',
			{ method: 'DELETE', body: { printIds: ['a'] }, expectEmptyBody: true },
		);

		expect(result).toBeUndefined();
	});

	it('validates the response against the supplied schema', async () => {
		harness.queue({ body: { credits: 'not-an-array' } });

		await expect(
			makeAllimagesaiRequest('credit', 'test-api-key', {
				schema: z.object({ credits: z.array(z.unknown()) }),
			}),
		).rejects.toBeInstanceOf(AllimagesaiAPIError);
	});

	it('returns parsed data when the response matches the schema', async () => {
		harness.queue({ body: { credits: [{ credit: 42 }] } });

		const result = await makeAllimagesaiRequest('credit', 'test-api-key', {
			schema: z.object({ credits: z.array(z.object({ credit: z.number() })) }),
		});

		expect(result).toEqual({ credits: [{ credit: 42 }] });
	});

	it('preserves the ApiError so error handlers can classify it', async () => {
		harness.queue({
			status: 400,
			body: {
				statusCode: 400,
				message: ['printIds must be an array'],
				error: 'Bad Request',
			},
		});

		await expect(
			makeAllimagesaiRequest('image-generations', 'test-api-key', {
				method: 'DELETE',
				body: {},
			}),
		).rejects.toMatchObject({ status: 400 });
	});

	describe('apiKeyId redaction', () => {
		// GET /v1/api-keys/webhook/{id} returns an apiKeyId whose value IS the
		// API key — verified byte-identical against a live account.
		it('redacts apiKeyId from a webhook response', async () => {
			harness.queue({
				body: {
					id: 'wh-1',
					apiKeyId: 'super-secret-key',
					url: 'https://example.com/hook',
				},
			});

			const result = await makeAllimagesaiRequest<{
				apiKeyId: string;
				url: string;
			}>('api-keys/webhook/wh-1', 'super-secret-key');

			expect(result.apiKeyId).toBe(REDACTED_API_KEY);
			expect(result.url).toBe('https://example.com/hook');
			expect(JSON.stringify(result)).not.toContain('super-secret-key');
		});

		it('leaves payloads without an apiKeyId untouched', () => {
			const payload = { id: 'wh-1', url: 'https://example.com/hook' };
			expect(redactApiKeyId(payload)).toBe(payload);
		});

		it('tolerates non-object payloads', () => {
			expect(redactApiKeyId(null)).toBeNull();
			expect(redactApiKeyId('plain')).toBe('plain');
			expect(redactApiKeyId([1, 2])).toEqual([1, 2]);
		});
	});
});
