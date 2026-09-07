import 'dotenv/config';
import { AuthMissingError } from 'corsair/core';
import { extractRetryAfterMs } from './client';
import { SupadataEndpointOutputSchemas, supadata } from './index';

const apiKey = process.env.SUPADATA_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

describe('Supadata Plugin KeyBuilder & Auth Tests', () => {
	it('returns explicit key from options in keyBuilder', async () => {
		const plugin = supadata({ key: 'explicit-test-key' });
		const key = await (plugin.keyBuilder as any)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'vault-key' },
			},
			'endpoint',
		);
		expect(key).toBe('explicit-test-key');
	});

	it('resolves key from keys manager in keyBuilder when options.key is not provided', async () => {
		const plugin = supadata();
		const key = await (plugin.keyBuilder as any)(
			{
				authType: 'api_key',
				keys: { get_api_key: async () => 'vault-key' },
			},
			'endpoint',
		);
		expect(key).toBe('vault-key');
	});

	it('throws AuthMissingError when key is missing in keyBuilder', async () => {
		const plugin = supadata();
		await expect(
			(plugin.keyBuilder as any)(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => '' },
				},
				'endpoint',
			),
		).rejects.toThrow(AuthMissingError);
	});
});

describe('extractRetryAfterMs', () => {
	const makeResponse = (retryAfter?: string) =>
		({
			headers: new Headers(retryAfter ? { 'Retry-After': retryAfter } : {}),
		}) as Response;

	it('handles numeric Retry-After (e.g. "5")', () => {
		const res = makeResponse('5');
		expect(extractRetryAfterMs(res)).toBe(5000);
	});

	it('caps large numeric Retry-After (e.g. "86400") at 60000 ms', () => {
		const res = makeResponse('86400');
		expect(extractRetryAfterMs(res)).toBe(60000);
	});

	it('handles valid HTTP-date Retry-After', () => {
		const futureDate = new Date(Date.now() + 10000).toUTCString();
		const res = makeResponse(futureDate);
		const result = extractRetryAfterMs(res);
		expect(result).toBeDefined();
		expect(result!).toBeGreaterThan(0);
		expect(result!).toBeLessThanOrEqual(60000);
	});

	it('caps large HTTP-date Retry-After to 60000 ms', () => {
		const farFutureDate = new Date(Date.now() + 500000).toUTCString();
		const res = makeResponse(farFutureDate);
		expect(extractRetryAfterMs(res)).toBe(60000);
	});

	it('returns undefined for invalid Retry-After', () => {
		const res = makeResponse('invalid-date-or-number');
		expect(extractRetryAfterMs(res)).toBeUndefined();
	});

	it('returns undefined when Retry-After header is missing', () => {
		const res = makeResponse();
		expect(extractRetryAfterMs(res)).toBeUndefined();
	});
});

describeLive('Supadata Live API Integration Tests', () => {
	const getCtx = () =>
		({
			key: apiKey!,
			$getAccountId: async () => 'test-account-id',
		}) as any;

	it('1. transcript.get (and transcript.getJob if 202 async returned)', async () => {
		const plugin = supadata();
		const result = await plugin.endpoints!.transcript.get(getCtx(), {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		});

		const parsed = SupadataEndpointOutputSchemas.transcriptGet.parse(result);
		expect(parsed).toBeDefined();

		if ('jobId' in result) {
			const jobResult = await plugin.endpoints!.transcript.getJob(getCtx(), {
				jobId: result.jobId,
			});
			const parsedJob =
				SupadataEndpointOutputSchemas.transcriptGetJob.parse(jobResult);
			expect(parsedJob.jobId).toBe(result.jobId);
		}
	});

	it('2. metadata.get', async () => {
		const plugin = supadata();
		const result = await plugin.endpoints!.metadata.get(getCtx(), {
			url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
		});

		const parsed = SupadataEndpointOutputSchemas.metadataGet.parse(result);
		expect(parsed).toBeDefined();
	});

	it('3. web.scrape', async () => {
		const plugin = supadata();
		const result = await plugin.endpoints!.web.scrape(getCtx(), {
			url: 'https://example.com',
		});

		const parsed = SupadataEndpointOutputSchemas.webScrape.parse(result);
		expect(parsed).toBeDefined();
	});

	it('4. web.map', async () => {
		const plugin = supadata();
		const result = await plugin.endpoints!.web.map(getCtx(), {
			url: 'https://supadata.ai',
		});

		const parsed = SupadataEndpointOutputSchemas.webMap.parse(result);
		expect(parsed).toBeDefined();
		const mapLinks = parsed.urls ?? parsed.links;
		expect(Array.isArray(mapLinks)).toBe(true);
	});

	it('5. youtube.search', async () => {
		const plugin = supadata();
		const result = await plugin.endpoints!.youtube.search(getCtx(), {
			query: 'Rick Astley',
			type: 'video',
		});

		const parsed = SupadataEndpointOutputSchemas.youtubeSearch.parse(result);
		expect(parsed).toBeDefined();
		expect(Array.isArray(parsed.results)).toBe(true);
	});
});
