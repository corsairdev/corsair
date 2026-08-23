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

describe('Diffbot Endpoint Handlers — All 35 Operations Request Mapping', () => {
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

	// 1. Account (1 operation)
	it('1. invokes account.getAccount correctly', async () => {
		await Account.getAccount(mockCtx, {});
		expect(makeRequestSpy).toHaveBeenCalledWith('account', 'test_token', {
			method: 'GET',
		});
	});

	// 2. Extract (9 operations)
	it('2. invokes extract.getArticle correctly', async () => {
		await Extract.getArticle(mockCtx, {
			url: 'https://example.com/article',
			fields: 'meta,links',
			timeout: 15000,
			paging: 'false',
			maxTags: 5,
			naturalLanguage: 'en',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('article', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/article',
				fields: 'meta,links',
				timeout: 15000,
				paging: 'false',
				maxTags: 5,
				naturalLanguage: 'en',
			},
		});
	});

	it('3. invokes extract.getProduct correctly', async () => {
		await Extract.getProduct(mockCtx, {
			url: 'https://example.com/product',
			fields: 'brand,offers',
			timeout: 20000,
			discussion: 'false',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('product', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/product',
				fields: 'brand,offers',
				timeout: 20000,
				discussion: 'false',
			},
		});
	});

	it('4. invokes extract.getAnalyze correctly', async () => {
		await Extract.getAnalyze(mockCtx, {
			url: 'https://example.com/unknown',
			fallback: 'article',
			discussion: 'false',
			timeout: 10000,
			fields: 'title',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('analyze', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/unknown',
				fallback: 'article',
				discussion: 'false',
				timeout: 10000,
				fields: 'title',
			},
		});
	});

	it('5. invokes extract.getImage correctly', async () => {
		await Extract.getImage(mockCtx, {
			url: 'https://example.com/image.jpg',
			fields: 'xpath',
			timeout: 12000,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('image', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/image.jpg',
				fields: 'xpath',
				timeout: 12000,
			},
		});
	});

	it('6. invokes extract.getVideo correctly', async () => {
		await Extract.getVideo(mockCtx, {
			url: 'https://example.com/video.mp4',
			fields: 'duration',
			timeout: 12000,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('video', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/video.mp4',
				fields: 'duration',
				timeout: 12000,
			},
		});
	});

	it('7. invokes extract.getDiscussion correctly', async () => {
		await Extract.getDiscussion(mockCtx, {
			url: 'https://example.com/forum',
			fields: 'posts',
			timeout: 18000,
			maxTags: 10,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('discussion', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/forum',
				fields: 'posts',
				timeout: 18000,
				maxTags: 10,
			},
		});
	});

	it('8. invokes extract.getEvent correctly', async () => {
		await Extract.getEvent(mockCtx, {
			url: 'https://example.com/event',
			fields: 'venue',
			timeout: 15000,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('event', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/event',
				fields: 'venue',
				timeout: 15000,
			},
		});
	});

	it('9. invokes extract.extractList correctly', async () => {
		await Extract.extractList(mockCtx, {
			url: 'https://example.com/directory',
			fields: 'items',
			timeout: 25000,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('list', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/directory',
				fields: 'items',
				timeout: 25000,
			},
		});
	});

	it('10. invokes extract.extractJob correctly', async () => {
		await Extract.extractJob(mockCtx, {
			url: 'https://example.com/careers/job1',
			fields: 'compensation',
			timeout: 20000,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('job', 'test_token', {
			method: 'GET',
			query: {
				url: 'https://example.com/careers/job1',
				fields: 'compensation',
				timeout: 20000,
			},
		});
	});

	// 3. Search (2 operations)
	it('11. invokes search.search with DQL routing to KG base', async () => {
		await Search.search(mockCtx, {
			query: 'name:"Diffbot"',
			entityType: 'Organization',
			queryType: 'query',
			size: 20,
			from: 0,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('dql', 'test_token', {
			method: 'GET',
			useKgBase: true,
			query: {
				query: 'type:Organization name:"Diffbot"',
				type: 'query',
				size: 20,
				from: 0,
				col: undefined,
			},
		});
	});

	it('12. invokes search.searchCrawlData correctly', async () => {
		await Search.searchCrawlData(mockCtx, {
			col: 'myCrawlCollection',
			query: 'tech',
			num: 15,
			start: 5,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('search', 'test_token', {
			method: 'GET',
			query: {
				col: 'myCrawlCollection',
				query: 'tech',
				num: 15,
				start: 5,
			},
		});
	});

	// 4. Enhance (4 operations)
	it('13. invokes enhance.enhanceEntity correctly', async () => {
		await Enhance.enhanceEntity(mockCtx, {
			name: 'Diffbot Technologies',
			type: 'Organization',
			url: 'https://diffbot.com',
			size: 1,
			refresh: true,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('enhance', 'test_token', {
			method: 'GET',
			useKgBase: true,
			query: {
				name: 'Diffbot Technologies',
				type: 'Organization',
				url: 'https://diffbot.com',
				size: 1,
				refresh: true,
				email: undefined,
				employer: undefined,
				phone: undefined,
				location: undefined,
			},
		});
	});

	it('14. invokes enhance.combineEntityProfiles correctly', async () => {
		await Enhance.combineEntityProfiles(mockCtx, {
			name: 'Mike Tung',
			type: 'Person',
			employer: 'Diffbot',
			email: 'mike@diffbot.com',
			url: 'https://linkedin.com/in/miketung',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'enhance/combine',
			'test_token',
			{
				method: 'GET',
				useKgBase: true,
				query: {
					name: 'Mike Tung',
					type: 'Person',
					employer: 'Diffbot',
					email: 'mike@diffbot.com',
					url: 'https://linkedin.com/in/miketung',
				},
			},
		);
	});

	it('15. invokes enhance.resolveLostId correctly', async () => {
		await Enhance.resolveLostId(mockCtx, { id: 'OLD_KG_ID_999' });
		expect(makeRequestSpy).toHaveBeenCalledWith('dql', 'test_token', {
			method: 'GET',
			useKgBase: true,
			query: {
				query: 'id:"OLD_KG_ID_999"',
				size: 1,
			},
		});
	});

	it('16. invokes enhance.getKgCoverageReportById correctly', async () => {
		await Enhance.getKgCoverageReportById(mockCtx, { reportId: 'rep_abc123' });
		expect(makeRequestSpy).toHaveBeenCalledWith('report', 'test_token', {
			method: 'GET',
			useKgBase: true,
			query: { reportId: 'rep_abc123' },
		});

		await Enhance.getKgCoverageReportById(mockCtx, {
			reportId: 'rep_abc123',
			bulkjobId: 'bulk_456',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'enhance/bulk/report/bulk_456/rep_abc123',
			'test_token',
			{
				method: 'GET',
				useKgBase: true,
				query: {},
			},
		);
	});

	// 5. KG Bulk Enhance (8 operations)
	it('17. invokes kgBulkEnhance.createKgBulkEnhance correctly', async () => {
		await KgBulkEnhance.createKgBulkEnhance(mockCtx, {
			entities: [{ name: 'Diffbot' }, { name: 'Anthropic' }],
			name: 'enrichJob1',
			notifyEmail: 'dev@example.com',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('enhance/bulk', 'test_token', {
			method: 'POST',
			useKgBase: true,
			body: [{ name: 'Diffbot' }, { name: 'Anthropic' }],
			query: {
				name: 'enrichJob1',
				notifyEmail: 'dev@example.com',
			},
		});
	});

	it('18. invokes kgBulkEnhance.getBulkJobStatus correctly', async () => {
		await KgBulkEnhance.getBulkJobStatus(mockCtx, { bulkjobId: 'bj_100' });
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'enhance/bulk/bj_100/status',
			'test_token',
			{
				method: 'GET',
				useKgBase: true,
			},
		);
	});

	it('19. invokes kgBulkEnhance.listBulkJobsStatusForToken correctly', async () => {
		await KgBulkEnhance.listBulkJobsStatusForToken(mockCtx, {});
		expect(makeRequestSpy).toHaveBeenCalledWith('enhance/bulk', 'test_token', {
			method: 'GET',
			useKgBase: true,
		});
	});

	it('20. invokes kgBulkEnhance.getBulkResults correctly', async () => {
		await KgBulkEnhance.getBulkResults(mockCtx, {
			bulkjobId: 'bj_100',
			format: 'json',
			head: 50,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'enhance/bulk/bj_100',
			'test_token',
			{
				method: 'GET',
				useKgBase: true,
				query: {
					format: 'json',
					head: 50,
				},
			},
		);
	});

	it('21. invokes kgBulkEnhance.downloadBulkResults correctly', async () => {
		await KgBulkEnhance.downloadBulkResults(mockCtx, {
			bulkjobId: 'bj_100',
			format: 'jsonl',
			filter: 'importance>0.5',
			fields: 'name,location',
			head: 100,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'enhance/bulk/bj_100',
			'test_token',
			{
				method: 'POST',
				useKgBase: true,
				query: {
					format: 'jsonl',
					filter: 'importance>0.5',
					fields: 'name,location',
					head: 100,
				},
			},
		);
	});

	it('22. invokes kgBulkEnhance.getBulkSingleResult correctly', async () => {
		await KgBulkEnhance.getBulkSingleResult(mockCtx, {
			bulkjobId: 'bj_100',
			jobIndex: 3,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'enhance/bulk/bj_100/3',
			'test_token',
			{
				method: 'GET',
				useKgBase: true,
			},
		);
	});

	it('23. invokes kgBulkEnhance.stopKgBulkJobById correctly', async () => {
		await KgBulkEnhance.stopKgBulkJobById(mockCtx, { bulkjobId: 'bj_100' });
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'enhance/bulk/bj_100/stop',
			'test_token',
			{
				method: 'GET',
				useKgBase: true,
			},
		);
	});

	it('24. invokes kgBulkEnhance.deleteKgEnhanceBulkjob correctly', async () => {
		await KgBulkEnhance.deleteKgEnhanceBulkjob(mockCtx, {
			bulkjobId: 'bj_100',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'enhance/bulk/bj_100/delete',
			'test_token',
			{
				method: 'GET',
				useKgBase: true,
			},
		);
	});

	// 6. Bulk Extract (5 operations)
	it('25. invokes bulk.createBulk correctly', async () => {
		await Bulk.createBulk(mockCtx, {
			name: 'jobExtract',
			apiUrl: 'https://api.diffbot.com/v3/article',
			urls: ['https://example.com/1', 'https://example.com/2'],
			notifyEmail: 'notify@example.com',
			maxRounds: 3,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('bulk', 'test_token', {
			method: 'POST',
			body: 'https://example.com/1\nhttps://example.com/2',
			query: {
				name: 'jobExtract',
				apiUrl: 'https://api.diffbot.com/v3/article',
				notifyEmail: 'notify@example.com',
				maxRounds: 3,
			},
		});
	});

	it('26. invokes bulk.startBulk correctly', async () => {
		await Bulk.startBulk(mockCtx, {
			name: 'jobExtract',
			apiUrl: 'https://api.diffbot.com/v3/article',
			urls: 'https://example.com/1 https://example.com/2',
			notifyEmail: 'notify@example.com',
			maxRounds: 2,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('bulk', 'test_token', {
			method: 'GET',
			query: {
				name: 'jobExtract',
				apiUrl: 'https://api.diffbot.com/v3/article',
				urls: 'https://example.com/1 https://example.com/2',
				notifyEmail: 'notify@example.com',
				maxRounds: 2,
			},
		});
	});

	it('27. invokes bulk.stopBulkJob correctly', async () => {
		await Bulk.stopBulkJob(mockCtx, { name: 'jobExtract' });
		expect(makeRequestSpy).toHaveBeenCalledWith('bulk', 'test_token', {
			method: 'GET',
			query: {
				name: 'jobExtract',
				pause: 1,
			},
		});
	});

	it('28. invokes bulk.getBulkData correctly', async () => {
		await Bulk.getBulkData(mockCtx, { name: 'jobExtract', format: 'csv' });
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'bulk/download/test_token-jobExtract.csv',
			'test_token',
			{
				method: 'GET',
			},
		);
	});

	it('29. invokes bulk.listBulkJobs correctly', async () => {
		await Bulk.listBulkJobs(mockCtx, {});
		expect(makeRequestSpy).toHaveBeenCalledWith('bulk', 'test_token', {
			method: 'GET',
		});
	});

	// 7. Crawl (3 operations)
	it('30. invokes crawl.startCrawl correctly', async () => {
		await Crawl.startCrawl(mockCtx, {
			name: 'crawlJob1',
			seeds: 'https://example.com',
			apiUrl: 'https://api.diffbot.com/v3/article',
			maxHops: 2,
			maxRounds: 1,
			maxTags: 5,
			crawlSubdomains: 1,
			notifyEmail: 'crawl@example.com',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('crawl', 'test_token', {
			method: 'POST',
			query: {
				name: 'crawlJob1',
				seeds: 'https://example.com',
				apiUrl: 'https://api.diffbot.com/v3/article',
				maxHops: 2,
				maxRounds: 1,
				maxTags: 5,
				crawlSubdomains: 1,
				notifyEmail: 'crawl@example.com',
			},
		});
	});

	it('31. invokes crawl.manageCrawl correctly', async () => {
		await Crawl.manageCrawl(mockCtx, {
			name: 'crawlJob1',
			pause: 1,
			restart: 0,
			delete: 0,
			roundProxy: 1,
			maxRounds: 5,
			maxHops: 3,
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('crawl', 'test_token', {
			method: 'GET',
			query: {
				name: 'crawlJob1',
				pause: 1,
				restart: 0,
				delete: 0,
				roundProxy: 1,
				maxRounds: 5,
				maxHops: 3,
			},
		});
	});

	it('32. invokes crawl.getCrawlData correctly', async () => {
		await Crawl.getCrawlData(mockCtx, { name: 'crawlJob1', format: 'json' });
		expect(makeRequestSpy).toHaveBeenCalledWith(
			'crawl/download/test_token-crawlJob1.json',
			'test_token',
			{
				method: 'GET',
			},
		);
	});

	// 8. Custom API (3 operations)
	it('33. invokes customApi.createCustomApi correctly', async () => {
		await CustomApi.createCustomApi(mockCtx, {
			api: 'myCustomApi',
			url: 'https://example.com/custom',
			pattern: 'https://example.com/*',
			rules: { selector: '.article-body' },
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('custom', 'test_token', {
			method: 'POST',
			body: { selector: '.article-body' },
			query: {
				api: 'myCustomApi',
				url: 'https://example.com/custom',
				pattern: 'https://example.com/*',
			},
		});
	});

	it('34. invokes customApi.listCustomApis correctly', async () => {
		await CustomApi.listCustomApis(mockCtx, {});
		expect(makeRequestSpy).toHaveBeenCalledWith('custom', 'test_token', {
			method: 'GET',
		});
	});

	it('35. invokes customApi.deleteCustomApi correctly', async () => {
		await CustomApi.deleteCustomApi(mockCtx, {
			api: 'myCustomApi',
			url: 'https://example.com/custom',
		});
		expect(makeRequestSpy).toHaveBeenCalledWith('custom', 'test_token', {
			method: 'DELETE',
			query: {
				api: 'myCustomApi',
				url: 'https://example.com/custom',
			},
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
