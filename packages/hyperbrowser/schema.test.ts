import {
	CreateBatchScrapeJobInputSchema,
	CreateBatchScrapeJobOutputSchema,
	CreateCrawlJobInputSchema,
	CreateCrawlJobOutputSchema,
	CreateExtractJobInputSchema,
	CreateExtractJobOutputSchema,
	CreateProfileInputSchema,
	CreateProfileOutputSchema,
	CreateScrapeJobInputSchema,
	CreateScrapeJobOutputSchema,
	CreateSessionInputSchema,
	CreateSessionOutputSchema,
	CreateWebCrawlJobInputSchema,
	CreateWebCrawlJobOutputSchema,
	DeleteProfileInputSchema,
	DeleteProfileOutputSchema,
	EvaluateCaptchaInputSchema,
	EvaluateCaptchaOutputSchema,
	FetchPageInputSchema,
	FetchPageOutputSchema,
	ForkProfileInputSchema,
	ForkProfileOutputSchema,
	GetBatchScrapeJobInputSchema,
	GetBatchScrapeJobOutputSchema,
	GetBatchScrapeJobStatusInputSchema,
	GetBatchScrapeJobStatusOutputSchema,
	GetCrawlJobInputSchema,
	GetCrawlJobOutputSchema,
	GetCrawlJobStatusInputSchema,
	GetCrawlJobStatusOutputSchema,
	GetExtractJobInputSchema,
	GetExtractJobOutputSchema,
	GetExtractJobStatusInputSchema,
	GetExtractJobStatusOutputSchema,
	GetProfileInputSchema,
	GetProfileOutputSchema,
	GetScrapeJobInputSchema,
	GetScrapeJobOutputSchema,
	GetScrapeJobStatusInputSchema,
	GetScrapeJobStatusOutputSchema,
	GetSessionDownloadsUrlInputSchema,
	GetSessionDownloadsUrlOutputSchema,
	GetSessionInputSchema,
	GetSessionOutputSchema,
	GetSessionRecordingUrlInputSchema,
	GetSessionRecordingUrlOutputSchema,
	GetSessionVideoRecordingUrlInputSchema,
	GetSessionVideoRecordingUrlOutputSchema,
	GetWebCrawlJobInputSchema,
	GetWebCrawlJobOutputSchema,
	GetWebCrawlJobStatusInputSchema,
	GetWebCrawlJobStatusOutputSchema,
	ListProfilesInputSchema,
	ListProfilesOutputSchema,
	ListSessionsInputSchema,
	ListSessionsOutputSchema,
	SearchWebInputSchema,
	SearchWebOutputSchema,
	StopSessionInputSchema,
	StopSessionOutputSchema,
	UpdateSessionInputSchema,
	UpdateSessionOutputSchema,
} from './endpoints/types';
import { HyperbrowserSchema } from './schema';
import { hyperbrowserEntities } from './schema/database';

describe('Hyperbrowser schema', () => {
	it('declares a semver version', () => {
		expect(HyperbrowserSchema.version).toBeDefined();
		expect(HyperbrowserSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares an empty entities map', () => {
		expect(HyperbrowserSchema.entities).toBe(hyperbrowserEntities);
		expect(HyperbrowserSchema.entities).toEqual({});
	});
});

describe('Hyperbrowser endpoint schemas', () => {
	describe('Profiles schemas', () => {
		it('validates profiles.create input and output', () => {
			expect(
				CreateProfileInputSchema.safeParse({ name: 'Work Profile' }).success,
			).toBe(true);
			expect(CreateProfileInputSchema.safeParse({}).success).toBe(true);
			// `unknown` because this test asserts runtime rejection of undocumented fields.
			const inputWithExtraField: unknown = { unknownField: true };
			expect(
				CreateProfileInputSchema.safeParse(inputWithExtraField).success,
			).toBe(false);

			expect(
				CreateProfileOutputSchema.safeParse({
					id: 'prof_123',
					name: 'Work Profile',
				}).success,
			).toBe(true);
		});

		it('validates profiles.fork input and output', () => {
			expect(
				ForkProfileInputSchema.safeParse({ id: 'prof_123', name: 'Fork' })
					.success,
			).toBe(true);
			expect(ForkProfileInputSchema.safeParse({}).success).toBe(false);

			expect(
				ForkProfileOutputSchema.safeParse({
					id: 'prof_456',
					name: 'Fork',
				}).success,
			).toBe(true);
		});

		it('validates profiles.get input and output', () => {
			expect(GetProfileInputSchema.safeParse({ id: 'prof_123' }).success).toBe(
				true,
			);
			expect(GetProfileInputSchema.safeParse({}).success).toBe(false);

			expect(
				GetProfileOutputSchema.safeParse({
					id: 'prof_123',
					name: 'Profile',
					teamId: 'team_abc',
					createdAt: '2026-01-01T00:00:00Z',
					updatedAt: '2026-01-02T00:00:00Z',
				}).success,
			).toBe(true);
		});

		it('validates profiles.delete input and output', () => {
			expect(
				DeleteProfileInputSchema.safeParse({ id: 'prof_123' }).success,
			).toBe(true);
			expect(DeleteProfileInputSchema.safeParse({}).success).toBe(false);

			expect(
				DeleteProfileOutputSchema.safeParse({ success: true }).success,
			).toBe(true);
		});

		it('validates profiles.list input and output', () => {
			expect(
				ListProfilesInputSchema.safeParse({ page: 1, limit: 10, name: 'Work' })
					.success,
			).toBe(true);
			expect(ListProfilesInputSchema.safeParse({}).success).toBe(true);
			expect(ListProfilesInputSchema.safeParse({ page: -1 }).success).toBe(
				false,
			);

			expect(
				ListProfilesOutputSchema.safeParse({
					profiles: [{ id: 'prof_123', name: 'Work', teamId: 'team_abc' }],
					totalCount: 1,
					page: 1,
					perPage: 10,
				}).success,
			).toBe(true);
		});
	});

	describe('Sessions schemas', () => {
		it('validates sessions.create input and output', () => {
			const validParams = {
				useStealth: true,
				useProxy: true,
				solveCaptchas: true,
				timeoutMinutes: 30,
				locales: ['en', 'fr'],
				screen: { width: 1920, height: 1080 },
			};
			expect(CreateSessionInputSchema.safeParse(validParams).success).toBe(
				true,
			);
			expect(CreateSessionInputSchema.safeParse({}).success).toBe(true);
			expect(
				CreateSessionInputSchema.safeParse({ timeoutMinutes: 0 }).success,
			).toBe(false);
			expect(
				CreateSessionInputSchema.safeParse({ timeoutMinutes: 800 }).success,
			).toBe(false);

			const output = {
				id: 'sess_123',
				teamId: 'team_abc',
				status: 'active' as const,
				sessionUrl: 'https://app.hyperbrowser.ai/session/sess_123',
				wsEndpoint: 'wss://connect.hyperbrowser.ai/sess_123',
			};
			expect(CreateSessionOutputSchema.safeParse(output).success).toBe(true);
		});

		it('validates sessions.get input and output', () => {
			expect(GetSessionInputSchema.safeParse({ id: 'sess_123' }).success).toBe(
				true,
			);
			expect(GetSessionInputSchema.safeParse({}).success).toBe(false);

			expect(
				GetSessionOutputSchema.safeParse({
					id: 'sess_123',
					status: 'closed' as const,
				}).success,
			).toBe(true);
		});

		it('validates sessions.stop input and output', () => {
			expect(StopSessionInputSchema.safeParse({ id: 'sess_123' }).success).toBe(
				true,
			);
			expect(StopSessionInputSchema.safeParse({}).success).toBe(false);

			expect(StopSessionOutputSchema.safeParse({ success: true }).success).toBe(
				true,
			);
		});

		it('validates sessions.update input and output', () => {
			expect(
				UpdateSessionInputSchema.safeParse({
					id: 'sess_123',
					type: 'solveCaptchas',
					params: { solveCaptchas: true },
				}).success,
			).toBe(true);
			// `unknown` because this test asserts runtime rejection of invalid enum values.
			const inputWithInvalidType: unknown = {
				id: 'sess_123',
				type: 'invalid',
				params: {},
			};
			expect(
				UpdateSessionInputSchema.safeParse(inputWithInvalidType).success,
			).toBe(false);

			expect(
				UpdateSessionOutputSchema.safeParse({
					success: true,
					solveCaptchas: true,
					sessionId: 'sess_123',
				}).success,
			).toBe(true);
		});

		it('validates sessions.evaluateCaptcha input and output', () => {
			expect(
				EvaluateCaptchaInputSchema.safeParse({
					id: 'sess_123',
					captcha: 'turnstile',
					iterations: 2,
				}).success,
			).toBe(true);
			expect(
				EvaluateCaptchaInputSchema.safeParse({
					id: 'sess_123',
					iterations: 25,
				}).success,
			).toBe(false);

			expect(
				EvaluateCaptchaOutputSchema.safeParse({
					success: true,
					solved: true,
					iterationsRun: 1,
					solvedCaptchas: ['turnstile'],
				}).success,
			).toBe(true);
		});

		it('validates sessions.list input and output', () => {
			expect(
				ListSessionsInputSchema.safeParse({ page: 1, status: 'active' })
					.success,
			).toBe(true);
			expect(ListSessionsInputSchema.safeParse({}).success).toBe(true);

			expect(
				ListSessionsOutputSchema.safeParse({
					sessions: [{ id: 'sess_123', status: 'active' as const }],
					totalCount: 1,
					page: 1,
					pageSize: 10,
				}).success,
			).toBe(true);
		});

		it('validates recording, video, and downloads url schemas', () => {
			expect(
				GetSessionRecordingUrlInputSchema.safeParse({ id: 'sess_123' }).success,
			).toBe(true);
			expect(
				GetSessionRecordingUrlOutputSchema.safeParse({
					status: 'completed',
					recordingUrl: 'https://recordings.hyperbrowser.ai/sess_123.rrweb',
				}).success,
			).toBe(true);

			expect(
				GetSessionVideoRecordingUrlInputSchema.safeParse({ id: 'sess_123' })
					.success,
			).toBe(true);
			expect(
				GetSessionVideoRecordingUrlOutputSchema.safeParse({
					status: 'completed',
					recordingUrl: 'https://recordings.hyperbrowser.ai/sess_123.mp4',
				}).success,
			).toBe(true);

			expect(
				GetSessionDownloadsUrlInputSchema.safeParse({ id: 'sess_123' }).success,
			).toBe(true);
			expect(
				GetSessionDownloadsUrlOutputSchema.safeParse({
					status: 'completed',
					downloadsUrl: 'https://downloads.hyperbrowser.ai/sess_123.zip',
				}).success,
			).toBe(true);
		});
	});

	describe('Scrape schemas', () => {
		it('validates scrape.create input and output', () => {
			expect(
				CreateScrapeJobInputSchema.safeParse({
					url: 'https://example.com',
					scrapeOptions: {
						formats: ['markdown', 'html'],
						onlyMainContent: true,
					},
				}).success,
			).toBe(true);
			expect(CreateScrapeJobInputSchema.safeParse({ url: '' }).success).toBe(
				false,
			);

			expect(
				CreateScrapeJobOutputSchema.safeParse({ jobId: 'job_123' }).success,
			).toBe(true);
		});

		it('validates scrape.get and scrape.getStatus', () => {
			expect(GetScrapeJobInputSchema.safeParse({ id: 'job_123' }).success).toBe(
				true,
			);
			expect(
				GetScrapeJobOutputSchema.safeParse({
					jobId: 'job_123',
					status: 'completed',
					data: {
						markdown: '# Example',
						html: '<h1>Example</h1>',
						links: ['https://example.com/about'],
					},
				}).success,
			).toBe(true);

			expect(
				GetScrapeJobStatusInputSchema.safeParse({ id: 'job_123' }).success,
			).toBe(true);
			expect(
				GetScrapeJobStatusOutputSchema.safeParse({ status: 'running' }).success,
			).toBe(true);
		});

		it('validates scrape.createBatch, getBatch, and getBatchStatus', () => {
			expect(
				CreateBatchScrapeJobInputSchema.safeParse({
					urls: ['https://example.com', 'https://example.org'],
				}).success,
			).toBe(true);
			expect(CreateBatchScrapeJobInputSchema.safeParse({}).success).toBe(false);

			expect(
				CreateBatchScrapeJobOutputSchema.safeParse({ jobId: 'batch_123' })
					.success,
			).toBe(true);

			expect(
				GetBatchScrapeJobInputSchema.safeParse({ id: 'batch_123' }).success,
			).toBe(true);
			expect(
				GetBatchScrapeJobOutputSchema.safeParse({
					jobId: 'batch_123',
					status: 'completed',
					data: [
						{
							url: 'https://example.com',
							status: 'completed',
							markdown: '# Hello',
						},
					],
					totalScrapedPages: 1,
				}).success,
			).toBe(true);

			expect(
				GetBatchScrapeJobStatusInputSchema.safeParse({ id: 'batch_123' })
					.success,
			).toBe(true);
			expect(
				GetBatchScrapeJobStatusOutputSchema.safeParse({ status: 'completed' })
					.success,
			).toBe(true);
		});
	});

	describe('Crawl schemas', () => {
		it('validates crawl.create, get, and getStatus', () => {
			expect(
				CreateCrawlJobInputSchema.safeParse({
					url: 'https://example.com',
					maxPages: 25,
					followLinks: true,
				}).success,
			).toBe(true);
			expect(CreateCrawlJobInputSchema.safeParse({ url: '' }).success).toBe(
				false,
			);

			expect(
				CreateCrawlJobOutputSchema.safeParse({ jobId: 'crawl_123' }).success,
			).toBe(true);

			expect(
				GetCrawlJobInputSchema.safeParse({ id: 'crawl_123', page: 1 }).success,
			).toBe(true);
			expect(
				GetCrawlJobOutputSchema.safeParse({
					jobId: 'crawl_123',
					status: 'completed',
					totalCrawledPages: 5,
					data: [
						{
							url: 'https://example.com/page1',
							status: 'completed',
							markdown: '# Page 1',
						},
					],
				}).success,
			).toBe(true);

			expect(
				GetCrawlJobStatusInputSchema.safeParse({ id: 'crawl_123' }).success,
			).toBe(true);
			expect(
				GetCrawlJobStatusOutputSchema.safeParse({ status: 'running' }).success,
			).toBe(true);
		});

		it('validates crawl.createWeb, getWeb, and getWebStatus', () => {
			expect(
				CreateWebCrawlJobInputSchema.safeParse({
					url: 'https://example.com',
					stealth: 'auto',
					crawlOptions: { maxPages: 10 },
				}).success,
			).toBe(true);
			expect(
				CreateWebCrawlJobOutputSchema.safeParse({ jobId: 'webcrawl_123' })
					.success,
			).toBe(true);

			expect(
				GetWebCrawlJobInputSchema.safeParse({ id: 'webcrawl_123' }).success,
			).toBe(true);
			expect(
				GetWebCrawlJobOutputSchema.safeParse({
					jobId: 'webcrawl_123',
					status: 'completed',
					totalPages: 3,
					data: [
						{
							url: 'https://example.com',
							status: 'completed',
							markdown: '# Example',
						},
					],
				}).success,
			).toBe(true);

			expect(
				GetWebCrawlJobStatusInputSchema.safeParse({ id: 'webcrawl_123' })
					.success,
			).toBe(true);
			expect(
				GetWebCrawlJobStatusOutputSchema.safeParse({ status: 'completed' })
					.success,
			).toBe(true);
		});
	});

	describe('Extract schemas', () => {
		it('validates extract.create, get, and getStatus', () => {
			expect(
				CreateExtractJobInputSchema.safeParse({
					urls: ['https://example.com'],
					prompt: 'Extract company info',
					schema: { type: 'object' },
				}).success,
			).toBe(true);
			expect(CreateExtractJobInputSchema.safeParse({ urls: [] }).success).toBe(
				true,
			);

			expect(
				CreateExtractJobOutputSchema.safeParse({ jobId: 'extract_123' })
					.success,
			).toBe(true);

			expect(
				GetExtractJobInputSchema.safeParse({ id: 'extract_123' }).success,
			).toBe(true);
			expect(
				GetExtractJobOutputSchema.safeParse({
					jobId: 'extract_123',
					status: 'completed',
					data: { company: 'Hyperbrowser' },
				}).success,
			).toBe(true);

			expect(
				GetExtractJobStatusInputSchema.safeParse({ id: 'extract_123' }).success,
			).toBe(true);
			expect(
				GetExtractJobStatusOutputSchema.safeParse({ status: 'completed' })
					.success,
			).toBe(true);
		});
	});

	describe('Web (Fetch & Search) schemas', () => {
		it('validates web.fetch input and output', () => {
			expect(
				FetchPageInputSchema.safeParse({
					url: 'https://example.com',
					stealth: 'auto',
					outputs: { formats: ['markdown'] },
				}).success,
			).toBe(true);
			expect(FetchPageInputSchema.safeParse({ url: '' }).success).toBe(false);

			expect(
				FetchPageOutputSchema.safeParse({
					jobId: 'fetch_123',
					status: 'completed',
					data: {
						markdown: '# Rendered Page',
						html: '<h1>Rendered Page</h1>',
					},
				}).success,
			).toBe(true);
		});

		it('validates web.search input and output', () => {
			expect(
				SearchWebInputSchema.safeParse({
					query: 'hyperbrowser cloud browser',
					page: 1,
				}).success,
			).toBe(true);
			expect(SearchWebInputSchema.safeParse({ query: '' }).success).toBe(false);

			expect(
				SearchWebOutputSchema.safeParse({
					jobId: 'search_123',
					status: 'completed',
					data: {
						query: 'hyperbrowser cloud browser',
						results: [
							{
								title: 'Hyperbrowser - Cloud Browsers',
								url: 'https://hyperbrowser.ai',
								description: 'Fast cloud browsers for agents.',
							},
						],
					},
				}).success,
			).toBe(true);
		});
	});
});
