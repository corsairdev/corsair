import * as clientModule from './client';
import {
	Account,
	Bulk,
	Crawl,
	CustomApi,
	Enhance,
	Extract,
	KgBulkEnhance,
	Search,
} from './endpoints';
import {
	DiffbotEndpointInputSchemas,
	DiffbotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { diffbot } from './index';

describe('Diffbot Input and Output Schemas', () => {
	// Account
	describe('account.getAccount', () => {
		it('accepts empty input', () => {
			const parsed = DiffbotEndpointInputSchemas.getAccount.parse({});
			expect(parsed).toEqual({});
		});

		it('parses valid output', () => {
			const parsed = DiffbotEndpointOutputSchemas.getAccount.parse({
				token: 'test_token',
				name: 'Test User',
				plan: 'kgfree',
				planCalls: 10000,
				status: 'active',
			});
			expect(parsed.name).toBe('Test User');
			expect(parsed.planCalls).toBe(10000);
		});
	});

	// Extract
	describe('extract.getArticle', () => {
		it('accepts valid url and optional fields', () => {
			const input = DiffbotEndpointInputSchemas.getArticle.parse({
				url: 'https://example.com/article',
				fields: 'links,meta',
			});
			expect(input.url).toBe('https://example.com/article');
		});

		it('parses article response', () => {
			const output = DiffbotEndpointOutputSchemas.getArticle.parse({
				objects: [
					{
						type: 'article',
						title: 'Test Article',
						text: 'Body text',
					},
				],
			});
			expect(output.objects[0]?.title).toBe('Test Article');
		});
	});

	describe('extract.getProduct', () => {
		it('accepts valid product url', () => {
			const input = DiffbotEndpointInputSchemas.getProduct.parse({
				url: 'https://example.com/product',
			});
			expect(input.url).toBe('https://example.com/product');
		});

		it('parses product response', () => {
			const output = DiffbotEndpointOutputSchemas.getProduct.parse({
				objects: [
					{
						type: 'product',
						title: 'Test Product',
						offerPrice: '$99.00',
					},
				],
			});
			expect(output.objects[0]?.offerPrice).toBe('$99.00');
		});
	});

	describe('extract.getAnalyze', () => {
		it('accepts url with fallback', () => {
			const input = DiffbotEndpointInputSchemas.getAnalyze.parse({
				url: 'https://example.com/page',
				fallback: 'article',
			});
			expect(input.fallback).toBe('article');
		});

		it('parses analyze response', () => {
			const output = DiffbotEndpointOutputSchemas.getAnalyze.parse({
				type: 'article',
				title: 'Detected Article',
			});
			expect(output.type).toBe('article');
		});
	});

	describe('extract.getImage', () => {
		it('accepts url', () => {
			const input = DiffbotEndpointInputSchemas.getImage.parse({
				url: 'https://example.com/image.png',
			});
			expect(input.url).toBe('https://example.com/image.png');
		});

		it('parses image response', () => {
			const output = DiffbotEndpointOutputSchemas.getImage.parse({
				objects: [{ type: 'image', url: 'https://example.com/image.png' }],
			});
			expect(output.objects[0]?.url).toBe('https://example.com/image.png');
		});
	});

	describe('extract.getVideo', () => {
		it('accepts video url', () => {
			const input = DiffbotEndpointInputSchemas.getVideo.parse({
				url: 'https://example.com/video',
			});
			expect(input.url).toBe('https://example.com/video');
		});

		it('parses video response', () => {
			const output = DiffbotEndpointOutputSchemas.getVideo.parse({
				objects: [{ type: 'video', duration: 120 }],
			});
			expect(output.objects[0]?.duration).toBe(120);
		});
	});

	describe('extract.getDiscussion', () => {
		it('accepts discussion url', () => {
			const input = DiffbotEndpointInputSchemas.getDiscussion.parse({
				url: 'https://example.com/forum',
			});
			expect(input.url).toBe('https://example.com/forum');
		});

		it('parses discussion response', () => {
			const output = DiffbotEndpointOutputSchemas.getDiscussion.parse({
				objects: [{ type: 'discussion', numPosts: 5 }],
			});
			expect(output.objects[0]?.numPosts).toBe(5);
		});
	});

	describe('extract.getEvent', () => {
		it('accepts event url', () => {
			const input = DiffbotEndpointInputSchemas.getEvent.parse({
				url: 'https://example.com/event',
			});
			expect(input.url).toBe('https://example.com/event');
		});

		it('parses event response', () => {
			const output = DiffbotEndpointOutputSchemas.getEvent.parse({
				objects: [{ type: 'event', startDate: '2026-09-01' }],
			});
			expect(output.objects[0]?.startDate).toBe('2026-09-01');
		});
	});

	describe('extract.extractList', () => {
		it('accepts list url', () => {
			const input = DiffbotEndpointInputSchemas.extractList.parse({
				url: 'https://example.com/list',
			});
			expect(input.url).toBe('https://example.com/list');
		});

		it('parses list response', () => {
			const output = DiffbotEndpointOutputSchemas.extractList.parse({
				objects: [{ type: 'list', numItems: 10 }],
			});
			expect(output.objects[0]?.numItems).toBe(10);
		});
	});

	describe('extract.extractJob', () => {
		it('accepts job url', () => {
			const input = DiffbotEndpointInputSchemas.extractJob.parse({
				url: 'https://example.com/job',
			});
			expect(input.url).toBe('https://example.com/job');
		});

		it('parses job response', () => {
			const output = DiffbotEndpointOutputSchemas.extractJob.parse({
				objects: [{ type: 'job', title: 'Software Engineer' }],
			});
			expect(output.objects[0]?.title).toBe('Software Engineer');
		});
	});

	// Search
	describe('search.search & search.searchCrawlData', () => {
		it('accepts dql search query', () => {
			const input = DiffbotEndpointInputSchemas.search.parse({
				query: 'name:"Diffbot"',
				entityType: 'Organization',
			});
			expect(input.query).toBe('name:"Diffbot"');
		});

		it('parses dql search response', () => {
			const output = DiffbotEndpointOutputSchemas.search.parse({
				hits: 1,
				data: [{ name: 'Diffbot' }],
			});
			expect(output.hits).toBe(1);
		});

		it('accepts crawl data search query', () => {
			const input = DiffbotEndpointInputSchemas.searchCrawlData.parse({
				col: 'myCollection',
				query: 'tech',
				num: 10,
			});
			expect(input.col).toBe('myCollection');
		});
	});

	// Enhance
	describe('enhance endpoints', () => {
		it('accepts enhanceEntity input', () => {
			const input = DiffbotEndpointInputSchemas.enhanceEntity.parse({
				name: 'Diffbot',
				type: 'Organization',
			});
			expect(input.name).toBe('Diffbot');
		});

		it('accepts combineEntityProfiles input', () => {
			const input = DiffbotEndpointInputSchemas.combineEntityProfiles.parse({
				name: 'John Doe',
				employer: 'Acme',
			});
			expect(input.name).toBe('John Doe');
		});

		it('accepts resolveLostId input', () => {
			const input = DiffbotEndpointInputSchemas.resolveLostId.parse({
				id: 'legacy-id-123',
			});
			expect(input.id).toBe('legacy-id-123');
		});

		it('accepts getKgCoverageReportById input', () => {
			const input = DiffbotEndpointInputSchemas.getKgCoverageReportById.parse({
				reportId: 'rep_123',
			});
			expect(input.reportId).toBe('rep_123');
		});
	});

	// KG Bulk Enhance
	describe('kgBulkEnhance endpoints', () => {
		it('accepts createKgBulkEnhance input', () => {
			const input = DiffbotEndpointInputSchemas.createKgBulkEnhance.parse({
				entities: [{ name: 'Company A' }, { name: 'Company B' }],
				name: 'testJob',
			});
			expect(input.entities.length).toBe(2);
		});

		it('accepts getBulkJobStatus input', () => {
			const input = DiffbotEndpointInputSchemas.getBulkJobStatus.parse({
				bulkjobId: 'bulk_123',
			});
			expect(input.bulkjobId).toBe('bulk_123');
		});

		it('accepts getBulkSingleResult input', () => {
			const input = DiffbotEndpointInputSchemas.getBulkSingleResult.parse({
				bulkjobId: 'bulk_123',
				jobIndex: 0,
			});
			expect(input.jobIndex).toBe(0);
		});
	});

	// Bulk Extract
	describe('bulk extract endpoints', () => {
		it('accepts createBulk input', () => {
			const input = DiffbotEndpointInputSchemas.createBulk.parse({
				name: 'myBulk',
				apiUrl: 'https://api.diffbot.com/v3/article',
				urls: ['https://example.com/1', 'https://example.com/2'],
			});
			expect(input.urls.length).toBe(2);
		});

		it('accepts startBulk input', () => {
			const input = DiffbotEndpointInputSchemas.startBulk.parse({
				name: 'myBulk',
				apiUrl: 'https://api.diffbot.com/v3/article',
				urls: 'https://example.com/1 https://example.com/2',
			});
			expect(input.name).toBe('myBulk');
		});
	});

	// Crawl
	describe('crawl endpoints', () => {
		it('accepts startCrawl input', () => {
			const input = DiffbotEndpointInputSchemas.startCrawl.parse({
				name: 'crawl1',
				seeds: 'https://example.com',
				apiUrl: 'https://api.diffbot.com/v3/article',
			});
			expect(input.name).toBe('crawl1');
		});

		it('accepts manageCrawl input', () => {
			const input = DiffbotEndpointInputSchemas.manageCrawl.parse({
				name: 'crawl1',
				pause: 1,
			});
			expect(input.pause).toBe(1);
		});
	});

	// Custom API
	describe('customApi endpoints', () => {
		it('accepts createCustomApi input', () => {
			const input = DiffbotEndpointInputSchemas.createCustomApi.parse({
				api: 'custom1',
				url: 'https://example.com',
			});
			expect(input.api).toBe('custom1');
		});

		it('accepts deleteCustomApi input', () => {
			const input = DiffbotEndpointInputSchemas.deleteCustomApi.parse({
				api: 'custom1',
			});
			expect(input.api).toBe('custom1');
		});
	});
});

describe('Diffbot Endpoint Handlers', () => {
	let makeRequestSpy: jest.SpyInstance;
	const mockCtx = {
		key: 'test_token',
		authType: 'api_key' as const,
		options: { key: 'test_token' },
		database: {},
		$getAccountId: () => 'acc_test',
	} as unknown as Parameters<typeof Account.getAccount>[0];

	beforeEach(() => {
		makeRequestSpy = jest
			.spyOn(clientModule, 'makeDiffbotRequest')
			.mockResolvedValue({ status: 200 } as never);
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('invokes account.getAccount correctly', async () => {
		await Account.getAccount(mockCtx, {});
		expect(makeRequestSpy).toHaveBeenCalledWith('account', 'test_token', {
			method: 'GET',
		});
	});

	it('invokes extract.getArticle correctly', async () => {
		await Extract.getArticle(mockCtx, { url: 'https://example.com/article' });
		expect(makeRequestSpy).toHaveBeenCalledWith('article', 'test_token', {
			method: 'GET',
			query: expect.objectContaining({ url: 'https://example.com/article' }),
		});
	});

	it('invokes search.search with DQL routing to KG base', async () => {
		await Search.search(mockCtx, {
			query: 'name:"Diffbot"',
			entityType: 'Organization',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('dql', 'test_token', {
			method: 'GET',
			useKgBase: true,
			query: expect.objectContaining({
				query: 'type:Organization name:"Diffbot"',
			}),
		});
	});

	it('invokes enhance.enhanceEntity correctly', async () => {
		await Enhance.enhanceEntity(mockCtx, { name: 'Diffbot' });
		expect(makeRequestSpy).toHaveBeenCalledWith('enhance', 'test_token', {
			method: 'GET',
			useKgBase: true,
			query: expect.objectContaining({ name: 'Diffbot' }),
		});
	});

	it('invokes kgBulkEnhance.createKgBulkEnhance correctly', async () => {
		await KgBulkEnhance.createKgBulkEnhance(mockCtx, {
			entities: [{ name: 'Diffbot' }],
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('enhance/bulk', 'test_token', {
			method: 'POST',
			useKgBase: true,
			body: [{ name: 'Diffbot' }],
			query: expect.anything(),
		});
	});

	it('invokes bulk.createBulk correctly', async () => {
		await Bulk.createBulk(mockCtx, {
			name: 'job1',
			apiUrl: 'https://api.diffbot.com/v3/article',
			urls: ['https://example.com/1'],
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('bulk', 'test_token', {
			method: 'POST',
			body: 'https://example.com/1',
			query: expect.objectContaining({ name: 'job1' }),
		});
	});

	it('invokes crawl.startCrawl correctly', async () => {
		await Crawl.startCrawl(mockCtx, {
			name: 'crawl1',
			seeds: 'https://example.com',
			apiUrl: 'https://api.diffbot.com/v3/article',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('crawl', 'test_token', {
			method: 'POST',
			query: expect.objectContaining({ name: 'crawl1' }),
		});
	});

	it('invokes customApi.listCustomApis correctly', async () => {
		await CustomApi.listCustomApis(mockCtx, {});
		expect(makeRequestSpy).toHaveBeenCalledWith('custom', 'test_token', {
			method: 'GET',
		});
	});
});

describe('Diffbot Error Handlers', () => {
	it('handles rate limit 429 errors and specifies retries', async () => {
		const error = Object.assign(new Error('Rate limit exceeded'), {
			status: 429,
			retryAfter: 1500,
		});
		expect(errorHandlers.RATE_LIMIT_ERROR.match(error)).toBe(true);
		const res = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(res.maxRetries).toBe(5);
		expect(res.headersRetryAfterMs).toBe(1500);
	});

	it('handles 401 unauthorized errors with 0 retries', async () => {
		const error = Object.assign(new Error('Invalid token'), { status: 401 });
		expect(errorHandlers.AUTH_ERROR.match(error)).toBe(true);
		const res = await errorHandlers.AUTH_ERROR.handler(error);
		expect(res.maxRetries).toBe(0);
	});

	it('handles 500 server errors', async () => {
		const error = Object.assign(new Error('Internal server error'), {
			status: 500,
		});
		expect(errorHandlers.SERVER_ERROR.match(error)).toBe(true);
		const res = await errorHandlers.SERVER_ERROR.handler(error);
		expect(res.maxRetries).toBe(2);
	});
});

describe('Diffbot Plugin Instance', () => {
	it('initializes diffbot plugin with default options', () => {
		const instance = diffbot({ key: 'diffbot_test_key' });
		expect(instance.id).toBe('diffbot');
		expect(instance.schema).toBeDefined();
		expect(instance.endpoints).toBeDefined();
		expect(Object.keys(instance.endpoints ?? {}).length).toBe(8);
	});
});
