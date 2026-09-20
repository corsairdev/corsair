import { AuthMissingError } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { extractRetryAfterMs, makeSupadataRequest } from './client';
import { errorHandlers } from './error-handlers';
import { SupadataEndpointOutputSchemas, supadata } from './index';

/**
 * The live suite exercises all eleven operations against the real Supadata
 * API. It is skipped unless a key is supplied:
 *
 *     SUPADATA_API_KEY=sd_… pnpm --filter @corsair-dev/supadata test
 *
 * One run costs roughly a dozen API credits.
 */
const apiKey = process.env.SUPADATA_API_KEY;
const describeLive = apiKey ? describe : describe.skip;

/** Stable public fixtures used by the live tests. */
const VIDEO_ID = 'dQw4w9WgXcQ';
const CHANNEL_ID = 'UCuAXFkgsw1L7xaCfnd5JJOw';
const PLAYLIST_ID = 'PLlaN88a7y2_plecYoJxvRFTLHVbIVAOoc';

describe('Supadata plugin wiring', () => {
	it('exposes all eleven documented operations', () => {
		const plugin = supadata();
		const paths = Object.entries(plugin.endpoints!).flatMap(([group, ops]) =>
			Object.keys(ops).map((op) => `${group}.${op}`),
		);
		expect(paths.sort()).toEqual([
			'account.me',
			'transcript.get',
			'transcript.getJob',
			'web.map',
			'web.scrape',
			'youtube.channel',
			'youtube.channelVideos',
			'youtube.playlist',
			'youtube.playlistVideos',
			'youtube.search',
			'youtube.video',
		]);
	});

	it('declares an input schema, output schema and metadata for every operation', () => {
		const plugin = supadata();
		const paths = Object.entries(plugin.endpoints!).flatMap(([group, ops]) =>
			Object.keys(ops).map((op) => `${group}.${op}`),
		);
		for (const path of paths) {
			expect(plugin.endpointSchemas).toHaveProperty([path, 'input']);
			expect(plugin.endpointSchemas).toHaveProperty([path, 'output']);
			expect(plugin.endpointMeta).toHaveProperty([path, 'description']);
		}
	});

	it('marks every operation read-only — Supadata has no write surface', () => {
		const plugin = supadata();
		for (const meta of Object.values(plugin.endpointMeta!)) {
			expect(meta.riskLevel).toBe('read');
		}
	});
});

describe('Supadata keyBuilder and auth', () => {
	const keyCtx = (key: string) =>
		({
			authType: 'api_key',
			keys: { get_api_key: async () => key },
		}) as never;

	it('returns the explicit key from options', async () => {
		const plugin = supadata({ key: 'explicit-test-key' });
		await expect(
			plugin.keyBuilder!(keyCtx('vault-key'), 'endpoint'),
		).resolves.toBe('explicit-test-key');
	});

	it('falls back to the keys manager when no explicit key is set', async () => {
		const plugin = supadata();
		await expect(
			plugin.keyBuilder!(keyCtx('vault-key'), 'endpoint'),
		).resolves.toBe('vault-key');
	});

	it('throws AuthMissingError when no key can be resolved', async () => {
		const plugin = supadata();
		await expect(plugin.keyBuilder!(keyCtx(''), 'endpoint')).rejects.toThrow(
			AuthMissingError,
		);
	});
});

describe('extractRetryAfterMs', () => {
	const makeResponse = (retryAfter?: string) =>
		({
			headers: new Headers(retryAfter ? { 'Retry-After': retryAfter } : {}),
		}) as Response;

	it('reads a delay given in seconds', () => {
		expect(extractRetryAfterMs(makeResponse('5'))).toBe(5000);
	});

	it('caps a long delay at 60s', () => {
		expect(extractRetryAfterMs(makeResponse('86400'))).toBe(60000);
	});

	it('reads a delay given as an HTTP date', () => {
		const result = extractRetryAfterMs(
			makeResponse(new Date(Date.now() + 10000).toUTCString()),
		);
		expect(result).toBeGreaterThan(0);
		expect(result).toBeLessThanOrEqual(60000);
	});

	it('caps a far-future HTTP date at 60s', () => {
		expect(
			extractRetryAfterMs(
				makeResponse(new Date(Date.now() + 500000).toUTCString()),
			),
		).toBe(60000);
	});

	it('returns undefined for an unparseable or missing header', () => {
		expect(extractRetryAfterMs(makeResponse('not-a-delay'))).toBeUndefined();
		expect(extractRetryAfterMs(makeResponse())).toBeUndefined();
	});
});

describe('error handlers', () => {
	const apiError = (status: number, code?: string) =>
		new ApiError(
			{ method: 'GET', url: 'https://api.supadata.ai/v1/me' },
			{
				url: 'https://api.supadata.ai/v1/me',
				ok: false,
				status,
				statusText: 'error',
				body: code ? { error: code, message: 'm', details: 'd' } : undefined,
			},
			'failed',
			{ retryAfter: 2000 },
		);

	it('retries rate limits and honours Retry-After', async () => {
		const error = apiError(429, 'limit-exceeded');
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const strategy = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(strategy.maxRetries).toBe(5);
		expect(strategy.headersRetryAfterMs).toBe(2000);
	});

	it('never retries auth, permission, not-found or bad-request failures', async () => {
		const cases = [
			[errorHandlers.AUTH_ERROR, apiError(401, 'unauthorized')],
			[errorHandlers.PERMISSION_ERROR, apiError(403, 'upgrade-required')],
			[errorHandlers.NOT_FOUND_ERROR, apiError(404, 'not-found')],
			[errorHandlers.BAD_REQUEST_ERROR, apiError(400, 'invalid-request')],
		] as const;
		for (const [handler, error] of cases) {
			expect(handler.match(error)).toBe(true);
			await expect(handler.handler()).resolves.toEqual({ maxRetries: 0 });
		}
	});

	it('treats transcript-unavailable as not found', () => {
		expect(
			errorHandlers.NOT_FOUND_ERROR.match(
				apiError(404, 'transcript-unavailable'),
			),
		).toBe(true);
	});

	it('retries server errors', async () => {
		const error = apiError(503, 'internal-error');
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		expect((await errorHandlers.SERVER_ERROR.handler()).maxRetries).toBe(3);
	});

	it('does not classify a rate limit as an auth failure', () => {
		expect(
			errorHandlers.AUTH_ERROR.match(apiError(429, 'limit-exceeded')),
		).toBe(false);
	});

	it('routes request timeouts to the timeout handler', () => {
		const timeout = new Error('The operation was aborted due to timeout');
		timeout.name = 'TimeoutError';
		expect(errorHandlers.TIMEOUT_ERROR.match(timeout)).toBe(true);
		expect(errorHandlers.RATE_LIMIT_ERROR.match(timeout)).toBe(false);
	});

	it('falls through to DEFAULT for anything unrecognised', () => {
		expect(errorHandlers.DEFAULT.match()).toBe(true);
	});
});

describeLive('Supadata live API', () => {
	const ctx = () =>
		({
			key: apiKey,
			$getAccountId: async () => 'test-account-id',
		}) as never;

	const plugin = supadata();

	it('1. account.me returns plan and credit usage', async () => {
		const result = await plugin.endpoints!.account.me(ctx(), {});
		SupadataEndpointOutputSchemas.accountMe.parse(result);
		expect(result.organizationId).toBeTruthy();
		expect(result.maxCredits).toBeGreaterThan(0);
		expect(result.usedCredits).toBeLessThanOrEqual(result.maxCredits);
	});

	it('2. transcript.get returns a transcript or a job handle', async () => {
		const result = await plugin.endpoints!.transcript.get(ctx(), {
			url: `https://www.youtube.com/watch?v=${VIDEO_ID}`,
			text: true,
		});
		SupadataEndpointOutputSchemas.transcriptGet.parse(result);

		if ('jobId' in result) {
			const { jobId } = result as { jobId: string };
			const job = await plugin.endpoints!.transcript.getJob(ctx(), { jobId });
			SupadataEndpointOutputSchemas.transcriptGetJob.parse(job);
			expect(['queued', 'active', 'completed', 'failed']).toContain(job.status);
		} else {
			expect(typeof result.content).toBe('string');
			expect(result.lang).toBeTruthy();
			expect(result.availableLangs.length).toBeGreaterThan(0);
		}
	});

	it('3. transcript.get returns timed chunks when text is false', async () => {
		const result = await plugin.endpoints!.transcript.get(ctx(), {
			url: `https://www.youtube.com/watch?v=${VIDEO_ID}`,
			text: false,
		});
		if ('jobId' in result) return;
		expect(Array.isArray(result.content)).toBe(true);
		const [first] = result.content as { offset: number; text: string }[];
		expect(typeof first?.text).toBe('string');
		expect(typeof first?.offset).toBe('number');
	});

	it('4. transcript.getJob reports an unknown job as a 404', async () => {
		await expect(
			plugin.endpoints!.transcript.getJob(ctx(), {
				jobId: '00000000-0000-0000-0000-000000000000',
			}),
		).rejects.toMatchObject({ status: 404 });
	});

	it('5. youtube.video returns video metadata', async () => {
		const result = await plugin.endpoints!.youtube.video(ctx(), {
			id: VIDEO_ID,
		});
		SupadataEndpointOutputSchemas.youtubeVideo.parse(result);
		expect(result.id).toBe(VIDEO_ID);
		expect(result.channel.id).toBe(CHANNEL_ID);
		expect(result.duration).toBeGreaterThan(0);
	});

	it('6. youtube.channel returns channel metadata', async () => {
		const result = await plugin.endpoints!.youtube.channel(ctx(), {
			id: CHANNEL_ID,
		});
		SupadataEndpointOutputSchemas.youtubeChannel.parse(result);
		expect(result.id).toBe(CHANNEL_ID);
		expect(result.name).toBeTruthy();
	});

	it('7. youtube.channelVideos returns ids and honours limit', async () => {
		const result = await plugin.endpoints!.youtube.channelVideos(ctx(), {
			id: CHANNEL_ID,
			limit: 3,
		});
		SupadataEndpointOutputSchemas.youtubeChannelVideos.parse(result);
		const total =
			result.videoIds.length + result.shortIds.length + result.liveIds.length;
		expect(total).toBeGreaterThan(0);
		expect(total).toBeLessThanOrEqual(3);
	});

	it('8. youtube.playlist returns playlist metadata', async () => {
		const result = await plugin.endpoints!.youtube.playlist(ctx(), {
			id: PLAYLIST_ID,
		});
		SupadataEndpointOutputSchemas.youtubePlaylist.parse(result);
		expect(result.id).toBe(PLAYLIST_ID);
		expect(result.videoCount).toBeGreaterThan(0);
	});

	it('9. youtube.playlistVideos returns ids and honours limit', async () => {
		const result = await plugin.endpoints!.youtube.playlistVideos(ctx(), {
			id: PLAYLIST_ID,
			limit: 3,
		});
		SupadataEndpointOutputSchemas.youtubePlaylistVideos.parse(result);
		const total =
			result.videoIds.length + result.shortIds.length + result.liveIds.length;
		expect(total).toBeGreaterThan(0);
		expect(total).toBeLessThanOrEqual(3);
	});

	it('10. youtube.search returns matching results', async () => {
		const result = await plugin.endpoints!.youtube.search(ctx(), {
			query: 'rick astley',
			type: 'video',
			limit: 2,
		});
		SupadataEndpointOutputSchemas.youtubeSearch.parse(result);
		expect(result.results.length).toBeGreaterThan(0);
		expect(result.results.length).toBeLessThanOrEqual(2);
		for (const hit of result.results) {
			// `type` is a hint, not a guarantee: Supadata mixes channel hits into a
			// type=video search, so the schema must accept every documented kind.
			expect(['video', 'channel', 'playlist']).toContain(hit.type);
			expect(hit.id).toBeTruthy();
			expect(hit.title).toBeTruthy();
		}
	});

	it('11. web.scrape returns Markdown content and a character count', async () => {
		const result = await plugin.endpoints!.web.scrape(ctx(), {
			url: 'https://example.com',
		});
		SupadataEndpointOutputSchemas.webScrape.parse(result);
		expect(result.content.length).toBeGreaterThan(0);
		expect(result.countCharacters).toBeGreaterThan(0);
		expect(Array.isArray(result.urls)).toBe(true);
	});

	it('12. web.map returns discovered URLs', async () => {
		const result = await plugin.endpoints!.web.map(ctx(), {
			url: 'https://supadata.ai',
		});
		SupadataEndpointOutputSchemas.webMap.parse(result);
		expect(result.urls.length).toBeGreaterThan(0);
		for (const url of result.urls) expect(url).toMatch(/^https?:\/\//);
	});

	it('13. rejects an invalid API key without leaking it', async () => {
		const secret = 'sd_invalid_key_for_testing';
		const error = await makeSupadataRequest('me', secret).catch(
			(caught: unknown) => caught,
		);
		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(401);
		expect(JSON.stringify(error)).not.toContain(secret);
	});
});
