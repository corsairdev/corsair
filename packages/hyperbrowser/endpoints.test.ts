import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Crawl, Extract, Profiles, Scrape, Sessions, Web } from './endpoints';
import type { HyperbrowserContext } from './index';
import {
	hyperbrowser,
	hyperbrowserEndpointMeta,
	hyperbrowserEndpointSchemas,
} from './index';

jest.mock('corsair/core', () => {
	// `unknown` because requireActual returns an untyped module record before type-casting.
	const actual = jest.requireActual('corsair/core') as Record<string, unknown>;
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	// `unknown` because requireActual returns an untyped module record before type-casting.
	const actual = jest.requireActual('./client') as Record<string, unknown>;
	return { ...actual, makeHyperbrowserRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makeHyperbrowserRequest);
const mockedLogEvent = jest.mocked(logEventFromContext);

function buildCtx(): HyperbrowserContext {
	return {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'hb_test_api_key_123',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('hb_test_api_key_123'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
}

const ctx = buildCtx();

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Hyperbrowser endpoint registry and schemas consistency', () => {
	it('keeps schemas and metadata keys in sync', () => {
		const schemaKeys = Object.keys(hyperbrowserEndpointSchemas).sort();
		const metaKeys = Object.keys(hyperbrowserEndpointMeta).sort();
		expect(schemaKeys).toEqual(metaKeys);
		expect(schemaKeys.length).toBe(31);
	});

	it('instantiates the hyperbrowser plugin', () => {
		const instance = hyperbrowser({ key: 'test-key' });
		expect(instance.id).toBe('hyperbrowser');
		expect(instance.authConfig).toBeDefined();
		expect(instance.endpoints).toBeDefined();
	});
});

describe('Profiles endpoints', () => {
	it('profiles.create sends POST /api/profile and logs completion', async () => {
		const mockResponse = { id: 'prof_123', name: 'Work Profile' };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Profiles.create(ctx, { name: 'Work Profile' });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/profile',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { name: 'Work Profile' },
			},
		);
		expect(mockedLogEvent).toHaveBeenCalledWith(
			ctx,
			'hyperbrowser.profiles.create',
			{ profileId: 'prof_123' },
			'completed',
		);
	});

	it('profiles.fork sends POST /api/profile/:id/fork', async () => {
		const mockResponse = { id: 'prof_456', name: 'Forked Profile' };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Profiles.fork(ctx, {
			id: 'prof_123',
			name: 'Forked Profile',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/profile/prof_123/fork',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { name: 'Forked Profile' },
			},
		);
	});

	it('profiles.get sends GET /api/profile/:id', async () => {
		const mockResponse = {
			id: 'prof_123',
			name: 'Profile',
			teamId: 'team_abc',
			createdAt: '2026-01-01T00:00:00Z',
			updatedAt: '2026-01-02T00:00:00Z',
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Profiles.get(ctx, { id: 'prof_123' });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/profile/prof_123',
			'hb_test_api_key_123',
			{
				method: 'GET',
			},
		);
	});

	it('profiles.delete sends DELETE /api/profile/:id', async () => {
		const mockResponse = { success: true };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Profiles.delete(ctx, { id: 'prof_123' });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/profile/prof_123',
			'hb_test_api_key_123',
			{
				method: 'DELETE',
			},
		);
	});

	it('profiles.list sends GET /api/profiles with query params', async () => {
		const mockResponse = {
			profiles: [{ id: 'prof_123', name: 'Profile' }],
			totalCount: 1,
			page: 1,
			perPage: 10,
		};
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Profiles.list(ctx, {
			page: 1,
			limit: 10,
			name: 'Work',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/profiles',
			'hb_test_api_key_123',
			{
				method: 'GET',
				query: { page: 1, limit: 10, name: 'Work' },
			},
		);
	});

	it('profiles.list rejects invalid input before network call', async () => {
		// `unknown` because rejection values have no static type; assertions narrow it.
		const err = await Profiles.list(ctx, { page: -1 }).catch((e: unknown) => e);
		expect(err).toBeDefined();
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('Sessions endpoints', () => {
	it('sessions.create sends POST /api/session', async () => {
		const mockResponse = { id: 'sess_123', status: 'active' as const };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sessions.create(ctx, { useStealth: true });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/session',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { useStealth: true },
			},
		);
	});

	it('sessions.get sends GET /api/session/:id', async () => {
		const mockResponse = { id: 'sess_123', status: 'closed' as const };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sessions.get(ctx, { id: 'sess_123' });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/session/sess_123',
			'hb_test_api_key_123',
			{
				method: 'GET',
			},
		);
	});

	it('sessions.stop sends PUT /api/session/:id/stop', async () => {
		const mockResponse = { success: true };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sessions.stop(ctx, { id: 'sess_123' });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/session/sess_123/stop',
			'hb_test_api_key_123',
			{
				method: 'PUT',
			},
		);
	});

	it('sessions.update sends PUT /api/session/:id/update', async () => {
		const mockResponse = { success: true, solveCaptchas: true };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sessions.update(ctx, {
			id: 'sess_123',
			type: 'solveCaptchas',
			params: { solveCaptchas: true },
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/session/sess_123/update',
			'hb_test_api_key_123',
			{
				method: 'PUT',
				body: { type: 'solveCaptchas', params: { solveCaptchas: true } },
			},
		);
	});

	it('sessions.evaluateCaptcha sends POST /api/session/:id/captcha/evaluate', async () => {
		const mockResponse = { success: true, solved: true };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sessions.evaluateCaptcha(ctx, {
			id: 'sess_123',
			captcha: 'turnstile',
		});
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/session/sess_123/captcha/evaluate',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { captcha: 'turnstile' },
			},
		);
	});

	it('sessions.list sends GET /api/sessions', async () => {
		const mockResponse = { sessions: [{ id: 'sess_123' }], totalCount: 1 };
		mockedRequest.mockResolvedValue(mockResponse);

		const result = await Sessions.list(ctx, { page: 1, status: 'active' });
		expect(result).toEqual(mockResponse);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/sessions',
			'hb_test_api_key_123',
			{
				method: 'GET',
				query: { page: 1, status: 'active' },
			},
		);
	});

	it('sessions url endpoints send GET to recording, video, and downloads URLs', async () => {
		mockedRequest.mockResolvedValueOnce({
			status: 'completed',
			recordingUrl: 'https://rec',
		});
		const rec = await Sessions.getRecordingUrl(ctx, { id: 'sess_123' });
		expect(rec.recordingUrl).toBe('https://rec');

		mockedRequest.mockResolvedValueOnce({
			status: 'completed',
			recordingUrl: 'https://video',
		});
		const vid = await Sessions.getVideoRecordingUrl(ctx, { id: 'sess_123' });
		expect(vid.recordingUrl).toBe('https://video');

		mockedRequest.mockResolvedValueOnce({
			status: 'completed',
			downloadsUrl: 'https://zip',
		});
		const dl = await Sessions.getDownloadsUrl(ctx, { id: 'sess_123' });
		expect(dl.downloadsUrl).toBe('https://zip');
	});
});

describe('Scrape endpoints', () => {
	it('scrape.create sends POST /api/scrape', async () => {
		mockedRequest.mockResolvedValue({ jobId: 'job_123' });

		const result = await Scrape.create(ctx, { url: 'https://example.com' });
		expect(result.jobId).toBe('job_123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/scrape',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { url: 'https://example.com' },
			},
		);
	});

	it('scrape.get and scrape.getStatus call /api/scrape/:id endpoints', async () => {
		mockedRequest.mockResolvedValueOnce({
			jobId: 'job_123',
			status: 'completed',
		});
		const getRes = await Scrape.get(ctx, { id: 'job_123' });
		expect(getRes.status).toBe('completed');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/scrape/job_123',
			'hb_test_api_key_123',
			{
				method: 'GET',
			},
		);

		mockedRequest.mockResolvedValueOnce({ status: 'running' });
		const statRes = await Scrape.getStatus(ctx, { id: 'job_123' });
		expect(statRes.status).toBe('running');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/scrape/job_123/status',
			'hb_test_api_key_123',
			{
				method: 'GET',
			},
		);
	});

	it('scrape.createBatch, getBatch, and getBatchStatus call batch scrape endpoints', async () => {
		mockedRequest.mockResolvedValueOnce({ jobId: 'batch_123' });
		const createRes = await Scrape.createBatch(ctx, {
			urls: ['https://example.com'],
		});
		expect(createRes.jobId).toBe('batch_123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/scrape/batch',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { urls: ['https://example.com'] },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			jobId: 'batch_123',
			status: 'completed',
		});
		const getRes = await Scrape.getBatch(ctx, {
			id: 'batch_123',
			page: 2,
			batchSize: 20,
		});
		expect(getRes.jobId).toBe('batch_123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/scrape/batch/batch_123',
			'hb_test_api_key_123',
			{
				method: 'GET',
				query: { page: 2, batchSize: 20 },
			},
		);

		mockedRequest.mockResolvedValueOnce({ status: 'completed' });
		const statRes = await Scrape.getBatchStatus(ctx, { id: 'batch_123' });
		expect(statRes.status).toBe('completed');
	});
});

describe('Crawl endpoints', () => {
	it('crawl.create, get, and getStatus call crawl endpoints', async () => {
		mockedRequest.mockResolvedValueOnce({ jobId: 'crawl_123' });
		const createRes = await Crawl.create(ctx, { url: 'https://example.com' });
		expect(createRes.jobId).toBe('crawl_123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/crawl',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { url: 'https://example.com' },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			jobId: 'crawl_123',
			status: 'completed',
		});
		const getRes = await Crawl.get(ctx, {
			id: 'crawl_123',
			page: 1,
			batchSize: 10,
		});
		expect(getRes.status).toBe('completed');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/crawl/crawl_123',
			'hb_test_api_key_123',
			{
				method: 'GET',
				query: { page: 1, batchSize: 10 },
			},
		);

		mockedRequest.mockResolvedValueOnce({ status: 'running' });
		const statRes = await Crawl.getStatus(ctx, { id: 'crawl_123' });
		expect(statRes.status).toBe('running');
	});

	it('crawl.createWeb, getWeb, and getWebStatus call web crawl endpoints', async () => {
		mockedRequest.mockResolvedValueOnce({ jobId: 'webcrawl_123' });
		const createRes = await Crawl.createWeb(ctx, {
			url: 'https://example.com',
			stealth: 'auto',
		});
		expect(createRes.jobId).toBe('webcrawl_123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/web/crawl',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { url: 'https://example.com', stealth: 'auto' },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			jobId: 'webcrawl_123',
			status: 'completed',
		});
		const getRes = await Crawl.getWeb(ctx, { id: 'webcrawl_123' });
		expect(getRes.status).toBe('completed');

		mockedRequest.mockResolvedValueOnce({ status: 'completed' });
		const statRes = await Crawl.getWebStatus(ctx, { id: 'webcrawl_123' });
		expect(statRes.status).toBe('completed');
	});
});

describe('Extract endpoints', () => {
	it('extract.create, get, and getStatus call extract endpoints', async () => {
		mockedRequest.mockResolvedValueOnce({ jobId: 'extract_123' });
		const createRes = await Extract.create(ctx, {
			urls: ['https://example.com'],
			prompt: 'Extract names',
		});
		expect(createRes.jobId).toBe('extract_123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/extract',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { urls: ['https://example.com'], prompt: 'Extract names' },
			},
		);

		mockedRequest.mockResolvedValueOnce({
			jobId: 'extract_123',
			status: 'completed',
		});
		const getRes = await Extract.get(ctx, { id: 'extract_123' });
		expect(getRes.status).toBe('completed');

		mockedRequest.mockResolvedValueOnce({ status: 'completed' });
		const statRes = await Extract.getStatus(ctx, { id: 'extract_123' });
		expect(statRes.status).toBe('completed');
	});
});

describe('Web endpoints', () => {
	it('web.fetch sends POST /api/web/fetch', async () => {
		mockedRequest.mockResolvedValue({
			jobId: 'fetch_123',
			status: 'completed',
		});

		const result = await Web.fetch(ctx, {
			url: 'https://example.com',
			stealth: 'auto',
		});
		expect(result.jobId).toBe('fetch_123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/web/fetch',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { url: 'https://example.com', stealth: 'auto' },
			},
		);
	});

	it('web.search sends POST /api/web/search', async () => {
		mockedRequest.mockResolvedValue({
			jobId: 'search_123',
			status: 'completed',
			data: {
				query: 'test query',
				results: [
					{ title: 'Example', url: 'https://example.com', description: 'Desc' },
				],
			},
		});

		const result = await Web.search(ctx, { query: 'test query' });
		expect(result.jobId).toBe('search_123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/api/web/search',
			'hb_test_api_key_123',
			{
				method: 'POST',
				body: { query: 'test query' },
			},
		);
	});
});
