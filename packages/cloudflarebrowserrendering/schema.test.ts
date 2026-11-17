import {
	CloudflareBrowserRenderingEndpointInputSchemas,
	CloudflareBrowserRenderingEndpointOutputSchemas,
} from './endpoints/types';
import { CloudflareBrowserRenderingSchema } from './schema';
import { cloudflareBrowserRenderingEntities } from './schema/database';

const validInputs = [
	[
		CloudflareBrowserRenderingEndpointInputSchemas.contentFetch,
		{ accountId: 'account-123', body: { url: 'https://example.com' } },
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.markdownConvert,
		{ accountId: 'account-123', body: { html: '<main>Hi</main>' } },
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.snapshotCapture,
		{
			accountId: 'account-123',
			body: {
				url: 'https://example.com',
				formats: ['content', 'screenshot'],
				screenshotOptions: { fullPage: true },
			},
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.accessibilityTreeCapture,
		{
			accountId: 'account-123',
			body: { url: 'https://example.com', root: 'main' },
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.scrapeExtract,
		{
			accountId: 'account-123',
			body: { url: 'https://example.com', elements: [{ selector: 'h1' }] },
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.jsonExtract,
		{
			accountId: 'account-123',
			body: { url: 'https://example.com', prompt: 'Extract the page title' },
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.linksList,
		{ accountId: 'account-123', body: { url: 'https://example.com' } },
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.screenshotCapture,
		{
			accountId: 'account-123',
			browser: 'kitesurf',
			cacheTTL: 86_400,
			body: {
				url: 'https://example.com',
				screenshotOptions: {
					fullPage: true,
					omitBackground: true,
					clip: { height: 720, width: 1280, x: 0, y: 0, scale: 1 },
				},
				scrollPage: true,
			},
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.pdfRender,
		{
			accountId: 'account-123',
			browser: 'kitesurf',
			cacheTTL: 0,
			body: {
				html: '<main>Invoice</main>',
				pdfOptions: {
					format: 'a4',
					printBackground: true,
					height: '11in',
					margin: { top: 10, bottom: '1in' },
					scale: 1,
					width: 8.5,
				},
			},
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.crawlStart,
		{
			accountId: 'account-123',
			body: {
				url: 'https://example.com',
				limit: 3,
				contentUse: 'reference',
				crawlPurposes: ['search'],
			},
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.crawlGet,
		{
			accountId: 'account-123',
			jobId: 'job-123',
			cursor: '10',
			limit: 10,
			status: 'completed',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.crawlCancel,
		{ accountId: 'account-123', jobId: 'job-123' },
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.sessionsList,
		{ accountId: 'account-123', limit: 200, offset: 0 },
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.sessionsGet,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.browserCreate,
		{
			accountId: 'account-123',
			keepAlive: 10_000,
			liveViewUrlExpiresInMs: 3_600_000,
			guardrails: {
				allowedDomains: ['*.example.com'],
				allowedDomainSets: ['common-cdns'],
			},
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.browserClose,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.browserVersion,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.browserProtocol,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.liveViewCreate,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
			expiresInMs: 60_000,
			guardrails: { mode: 'readonly' },
			mode: 'devtools',
			targetId: 'target-1',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.targetsCreate,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
			liveViewUrlExpiresInMs: 60_000,
			url: 'https://example.com',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.targetsList,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
			liveViewUrlExpiresInMs: 3_600_000,
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.targetsGet,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
			targetId: 'target-1',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.targetsActivate,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
			targetId: 'target-1',
		},
	],
	[
		CloudflareBrowserRenderingEndpointInputSchemas.targetsClose,
		{
			accountId: 'account-123',
			sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
			targetId: 'target-1',
		},
	],
] as const;

const validOutputs = [
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.contentFetch,
		'<html></html>',
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.markdownConvert,
		'# Example',
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.snapshotCapture,
		{ content: '<html></html>', screenshot: 'base64-image' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.accessibilityTreeCapture,
		{ accessibilityTree: { role: 'RootWebArea' } },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.scrapeExtract,
		[
			{
				selector: 'h1',
				results: [
					{
						attributes: [],
						height: 22,
						html: 'Example',
						left: 0,
						text: 'Example',
						top: 0,
						width: 100,
					},
				],
			},
		],
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.jsonExtract,
		{ title: 'Example' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.linksList,
		['https://example.com/about'],
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.screenshotCapture,
		{ contentType: 'image/png', byteLength: 5, data: 'aGVsbG8=' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.pdfRender,
		{ contentType: 'application/pdf', byteLength: 3, data: 'JVBERg==' },
	],
	[CloudflareBrowserRenderingEndpointOutputSchemas.crawlStart, 'job-123'],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.crawlGet,
		{
			id: 'job-123',
			status: 'completed',
			browserSecondsUsed: 1,
			total: 1,
			finished: 1,
			records: [{ url: 'https://example.com', status: 'completed' }],
		},
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.crawlCancel,
		{ job_id: 'job-123', message: 'Cancellation requested' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.sessionsList,
		[
			{
				sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e',
				webSocketDebuggerUrl: 'wss://example.com/cdp',
			},
		],
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.sessionsGet,
		{ sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.browserCreate,
		{ sessionId: '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.browserClose,
		{ status: 'closed' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.browserVersion,
		{
			Browser: 'Chrome/1',
			'Protocol-Version': '1.3',
			'User-Agent': 'Browser Run',
			'V8-Version': '1',
			'WebKit-Version': '1',
			webSocketDebuggerUrl: 'wss://example.com/cdp',
		},
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.browserProtocol,
		{
			domains: [
				{
					domain: 'Page',
					commands: [{ name: 'enable', parameters: [{ name: 'frameId' }] }],
				},
			],
			version: { major: '1', minor: '3' },
		},
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.liveViewCreate,
		{
			id: 'target-1',
			devtoolsFrontendUrl: 'https://example.com/view',
			options: { mode: 'devtools', guardrails: { mode: 'readonly' } },
			webSocketDebuggerUrl: 'wss://example.com/cdp',
		},
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.targetsCreate,
		{ id: 'target-1', type: 'page', url: 'https://example.com' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.targetsList,
		[{ id: 'target-1', type: 'page', url: 'https://example.com' }],
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.targetsGet,
		{ id: 'target-1', type: 'page', url: 'https://example.com' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.targetsActivate,
		{ message: 'Target activated' },
	],
	[
		CloudflareBrowserRenderingEndpointOutputSchemas.targetsClose,
		{ message: 'Target is closing' },
	],
] as const;

describe('Cloudflare Browser Run schema', () => {
	it('accepts the documented links and crawl options', () => {
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.linksList.safeParse({
				accountId: 'account-123',
				body: {
					url: 'https://example.com',
					visibleLinksOnly: true,
					excludeExternalLinks: true,
				},
			}).success,
		).toBe(true);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.crawlStart.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com', render: true, browser: 'kitesurf' },
			}).success,
		).toBe(true);
	});

	it('rejects screenshot encoding because the plugin already returns base64', () => {
		// Live 11-13: encoding "base64" returns a text/plain data URL, which the
		// binary client would base64-encode a second time.
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.screenshotCapture.safeParse(
				{
					accountId: 'account-123',
					body: {
						url: 'https://example.com',
						screenshotOptions: { encoding: 'base64' },
					},
				},
			).success,
		).toBe(false);
	});

	it('accepts a large base64 screenshot and still rejects malformed base64', () => {
		// A full-page screenshot or PDF can be several MB; a quantified-group
		// regex overflowed the V8 stack on base64 of 4 MiB.
		const O = CloudflareBrowserRenderingEndpointOutputSchemas;
		const big = Buffer.alloc(6 * 1024 * 1024, 7).toString('base64');
		expect(
			O.screenshotCapture.safeParse({
				contentType: 'image/png',
				byteLength: 6 * 1024 * 1024,
				data: big,
			}).success,
		).toBe(true);
		for (const data of ['aGVsbG8', 'aGV=sbG8', 'aGVsbG8*', 'a===']) {
			expect(
				O.pdfRender.safeParse({
					contentType: 'application/pdf',
					byteLength: 5,
					data,
				}).success,
			).toBe(false);
		}
	});

	it('keeps DevTools outputs working when Cloudflare adds fields or values', () => {
		const O = CloudflareBrowserRenderingEndpointOutputSchemas;
		expect(
			O.sessionsGet.safeParse({
				sessionId: '61f3298e-e5cd-46de-b56a-c07ee50d6edc',
				startTime: 1,
				region: 'new-field',
			}).success,
		).toBe(true);
		expect(O.browserClose.safeParse({ status: 'terminated' }).success).toBe(
			true,
		);
		expect(
			O.targetsGet.safeParse({
				id: 't1',
				type: 'page',
				url: 'https://example.com/',
				parentId: 'new-field',
			}).success,
		).toBe(true);
		expect(
			O.liveViewCreate.safeParse({
				id: 'lv1',
				devtoolsFrontendUrl: 'https://live.example/view',
				webSocketDebuggerUrl: 'wss://live.example/ws',
				options: { mode: 'kiosk' },
			}).success,
		).toBe(true);
	});

	it('parses a live crawl result cancelled by the user', () => {
		const live = {
			id: 'job-123',
			status: 'cancelled_by_user',
			browserSecondsUsed: 0,
			total: 40,
			finished: 40,
			skipped: 0,
			robots: [
				{
					origin: 'https://developers.cloudflare.com',
					state: 'available',
					status: 200,
				},
			],
			records: [
				{
					url: 'https://developers.cloudflare.com/browser-run/',
					status: 'cancelled',
				},
			],
			cursor: 3,
		};
		expect(
			CloudflareBrowserRenderingEndpointOutputSchemas.crawlGet.parse(live)
				.status,
		).toBe('cancelled_by_user');
	});

	it('declares a semver version and an empty entities map', () => {
		expect(CloudflareBrowserRenderingSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(CloudflareBrowserRenderingSchema.entities).toBe(
			cloudflareBrowserRenderingEntities,
		);
		expect(CloudflareBrowserRenderingSchema.entities).toEqual({});
	});

	it('validates every operation input and rejects invalid input', () => {
		for (const [schema, input] of validInputs) {
			expect(schema.safeParse(input).success).toBe(true);
			expect(schema.safeParse({}).success).toBe(false);
		}
	});

	it('validates every operation output and rejects invalid output', () => {
		for (const [schema, output] of validOutputs) {
			expect(schema.safeParse(output).success).toBe(true);
			expect(schema.safeParse(null).success).toBe(false);
		}
	});

	it('enforces action-specific input requirements', () => {
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.contentFetch.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com', html: '<main />' },
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.snapshotCapture.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com', formats: ['content'] },
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.scrapeExtract.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com', elements: [{}] },
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.snapshotCapture.safeParse({
				accountId: 'account-123',
				body: {
					url: 'https://example.com',
					formats: ['content', 'screenshot'],
					screenshotOptions: { encoding: 'base64' },
				},
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.jsonExtract.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com' },
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.crawlStart.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com', formats: ['json'] },
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.crawlStart.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com', contentUse: 'immediate' },
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.crawlStart.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com', userAgent: 'unsupported-on-crawl' },
			}).success,
		).toBe(false);
	});

	it('accepts Workers AI models without an authorization token', () => {
		const workersAiModel = {
			model: 'workers-ai/@cf/meta/llama-3.3-70b-instruct-fp8-fast',
		};
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.jsonExtract.safeParse({
				accountId: 'account-123',
				body: {
					url: 'https://example.com',
					prompt: 'Extract the title',
					custom_ai: [workersAiModel],
				},
			}).success,
		).toBe(true);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.crawlStart.safeParse({
				accountId: 'account-123',
				body: {
					url: 'https://example.com',
					formats: ['json'],
					jsonOptions: {
						prompt: 'Extract the title',
						custom_ai: [workersAiModel],
					},
				},
			}).success,
		).toBe(true);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.jsonExtract.safeParse({
				accountId: 'account-123',
				body: {
					url: 'https://example.com',
					prompt: 'Extract the title',
					custom_ai: [{ model: 'vendor/model' }],
				},
			}).success,
		).toBe(false);
	});

	it('enforces DevTools bounds, guardrail caps, and binary output encoding', () => {
		const sessionId = '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e';
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.screenshotCapture.safeParse(
				{
					accountId: 'account-123',
					body: { url: 'https://example.com', html: '<main />' },
				},
			).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.sessionsList.safeParse({
				accountId: 'account-123',
				limit: 201,
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.browserCreate.safeParse({
				accountId: 'account-123',
				keepAlive: 9_999,
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.browserCreate.safeParse({
				accountId: 'account-123',
				guardrails: {
					allowedDomains: Array.from({ length: 51 }, () => 'host'),
				},
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.screenshotCapture.safeParse(
				{
					accountId: 'account-123',
					browser: 'unsupported',
					cacheTTL: 86_401,
					body: { url: 'https://example.com' },
				},
			).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.screenshotCapture.safeParse(
				{
					accountId: 'account-123',
					body: {
						url: 'https://example.com',
						screenshotOptions: { clip: { x: 0, y: 0 } },
					},
				},
			).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.pdfRender.safeParse({
				accountId: 'account-123',
				body: { url: 'https://example.com', pdfOptions: { scale: 2.1 } },
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointInputSchemas.liveViewCreate.safeParse({
				accountId: 'account-123',
				sessionId,
				expiresInMs: 59_999,
			}).success,
		).toBe(false);
		expect(
			CloudflareBrowserRenderingEndpointOutputSchemas.screenshotCapture.safeParse(
				{ contentType: 'image/png', byteLength: 1, data: 'not-base64' },
			).success,
		).toBe(false);
	});
});
