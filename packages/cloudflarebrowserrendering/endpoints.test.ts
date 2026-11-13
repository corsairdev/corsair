import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import {
	accessibilityTreeCapture,
	browserClose,
	browserCreate,
	browserProtocol,
	browserVersion,
	contentFetch,
	crawlCancel,
	crawlGet,
	crawlStart,
	jsonExtract,
	linksList,
	liveViewCreate,
	markdownConvert,
	pdfRender,
	scrapeExtract,
	screenshotCapture,
	sessionsGet,
	sessionsList,
	snapshotCapture,
	targetsActivate,
	targetsClose,
	targetsCreate,
	targetsGet,
	targetsList,
} from './endpoints';
import type { CloudflareBrowserRenderingContext } from './index';
import {
	cloudflareBrowserRenderingEndpointSchemas,
	cloudflarebrowserrendering,
} from './index';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return {
		...actual,
		makeCloudflareBrowserRenderingBinaryRequest: jest.fn(),
		makeCloudflareBrowserRenderingRequest: jest.fn(),
	};
});

const mockedRequest = jest.mocked(client.makeCloudflareBrowserRenderingRequest);
const mockedBinaryRequest = jest.mocked(
	client.makeCloudflareBrowserRenderingBinaryRequest,
);
const mockedLogEvent = jest.mocked(logEventFromContext);

type Context = Parameters<typeof contentFetch>[0];

function buildContext(): Context {
	const context: CloudflareBrowserRenderingContext = {
		endpoints: {},
		$getAccountId: () => Promise.resolve('test-account'),
		key: 'test-token',
		options: {},
		keys: {
			get_dek: () => Promise.resolve('test-dek'),
			issue_new_dek: () => Promise.resolve('test-dek'),
			get_api_key: () => Promise.resolve('test-token'),
			set_api_key: () => Promise.resolve(),
			get_webhook_signature: () => Promise.resolve(null),
			set_webhook_signature: () => Promise.resolve(),
		},
		db: {},
	};
	return context;
}

const ctx = buildContext();

function expectRedactedLog(
	eventName: string,
	privateValues: string[],
	context: Context = ctx,
) {
	expect(mockedLogEvent).toHaveBeenCalledWith(
		context,
		eventName,
		expect.any(Object),
		'completed',
	);
	const payload = mockedLogEvent.mock.calls[0]?.[2];
	const serializedPayload = JSON.stringify(payload);
	for (const privateValue of privateValues) {
		expect(serializedPayload).not.toContain(privateValue);
	}
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedBinaryRequest.mockReset();
	mockedLogEvent.mockReset();
});

describe('Browser Run Quick Actions', () => {
	it('content.fetch sends the exact account path and redacts the URL', async () => {
		const privateUrl = 'https://user:pass@example.com/page?token=render-secret';
		mockedRequest.mockResolvedValue('<html><title>Page</title></html>');

		const result = await contentFetch(ctx, {
			accountId: 'acct-123',
			body: { url: privateUrl },
		});

		expect(result).toBe('<html><title>Page</title></html>');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/content',
			'test-token',
			{ method: 'POST', body: { url: privateUrl } },
		);
		expectRedactedLog('cloudflarebrowserrendering.content.fetch', [
			privateUrl,
			'render-secret',
			'test-token',
		]);
	});

	it('markdown.convert parses output and sends HTML input', async () => {
		mockedRequest.mockResolvedValue('# Rendered page');
		const result = await markdownConvert(ctx, {
			accountId: 'acct-123',
			body: { html: '<main>Rendered page</main>' },
		});

		expect(result).toBe('# Rendered page');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/markdown',
			'test-token',
			{ method: 'POST', body: { html: '<main>Rendered page</main>' } },
		);
		expectRedactedLog('cloudflarebrowserrendering.markdown.convert', [
			'<main>Rendered page</main>',
		]);
	});

	it('snapshot.capture accepts base64 screenshot data in its JSON result', async () => {
		const response = { content: '<html></html>', screenshot: 'base64-image' };
		mockedRequest.mockResolvedValue(response);
		const result = await snapshotCapture(ctx, {
			accountId: 'acct-123',
			body: {
				url: 'https://example.com',
				formats: ['content', 'screenshot'],
				screenshotOptions: { fullPage: true },
			},
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/snapshot',
			'test-token',
			{
				method: 'POST',
				body: {
					url: 'https://example.com',
					formats: ['content', 'screenshot'],
					screenshotOptions: { fullPage: true },
				},
			},
		);
		expectRedactedLog('cloudflarebrowserrendering.snapshot.capture', [
			'https://example.com',
			'base64-image',
		]);
	});

	it('uses a configured request timeout for Quick Actions', async () => {
		mockedRequest.mockResolvedValue('<html></html>');
		const timeoutContext = {
			...ctx,
			options: { requestTimeoutMs: 30_000 },
		};

		await contentFetch(timeoutContext, {
			accountId: 'acct-123',
			body: { url: 'https://example.com' },
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/content',
			'test-token',
			{
				method: 'POST',
				body: { url: 'https://example.com' },
				timeoutMs: 30_000,
			},
		);
	});

	it('accessibilityTree.capture parses the tree result', async () => {
		const response = { accessibilityTree: { role: 'RootWebArea' } };
		mockedRequest.mockResolvedValue(response);
		const result = await accessibilityTreeCapture(ctx, {
			accountId: 'acct-123',
			body: { url: 'https://example.com', interestingOnly: true },
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/accessibilityTree',
			'test-token',
			{
				method: 'POST',
				body: { url: 'https://example.com', interestingOnly: true },
			},
		);
		expectRedactedLog('cloudflarebrowserrendering.accessibilityTree.capture', [
			'https://example.com',
		]);
	});

	it('scrape.extract sends selector elements and parses results', async () => {
		const response = [
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
		];
		mockedRequest.mockResolvedValue(response);
		const result = await scrapeExtract(ctx, {
			accountId: 'acct-123',
			body: { url: 'https://example.com', elements: [{ selector: 'h1' }] },
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/scrape',
			'test-token',
			{
				method: 'POST',
				body: { url: 'https://example.com', elements: [{ selector: 'h1' }] },
			},
		);
		expectRedactedLog('cloudflarebrowserrendering.scrape.extract', [
			'https://example.com',
			'h1',
		]);
	});

	it('json.extract sends a prompt and never logs caller-provided credentials', async () => {
		const response = { title: 'Example' };
		mockedRequest.mockResolvedValue(response);
		const result = await jsonExtract(ctx, {
			accountId: 'acct-123',
			body: {
				url: 'https://example.com',
				prompt: 'Extract the title',
				custom_ai: [
					{ model: 'vendor/model', authorization: 'private-model-token' },
				],
			},
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/json',
			'test-token',
			{
				method: 'POST',
				body: {
					url: 'https://example.com',
					prompt: 'Extract the title',
					custom_ai: [
						{ model: 'vendor/model', authorization: 'private-model-token' },
					],
				},
			},
		);
		expectRedactedLog('cloudflarebrowserrendering.json.extract', [
			'https://example.com',
			'private-model-token',
			'test-token',
		]);
	});

	it('links.list returns the parsed URL list', async () => {
		const response = ['https://example.com/about'];
		mockedRequest.mockResolvedValue(response);
		const result = await linksList(ctx, {
			accountId: 'acct-123',
			body: { url: 'https://example.com' },
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/links',
			'test-token',
			{ method: 'POST', body: { url: 'https://example.com' } },
		);
		expectRedactedLog('cloudflarebrowserrendering.links.list', [
			'https://example.com',
		]);
	});

	it('links.list forwards visibleLinksOnly and excludeExternalLinks', async () => {
		mockedRequest.mockResolvedValue(['https://example.com/about']);
		await linksList(ctx, {
			accountId: 'acct-123',
			body: {
				url: 'https://example.com',
				visibleLinksOnly: true,
				excludeExternalLinks: true,
			},
		});

		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/links',
			'test-token',
			{
				method: 'POST',
				body: {
					url: 'https://example.com',
					visibleLinksOnly: true,
					excludeExternalLinks: true,
				},
			},
		);
	});

	it('rejects invalid page inputs before making a request', async () => {
		await expect(
			contentFetch(ctx, {
				accountId: 'acct-123',
				body: { url: 'https://example.com', html: '<main />' },
			}),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('Browser Run crawl operations', () => {
	it('crawl.start sends the documented POST path and parses the job ID', async () => {
		mockedRequest.mockResolvedValue('job-123');
		const result = await crawlStart(ctx, {
			accountId: 'acct-123',
			body: { url: 'https://example.com', limit: 3 },
		});

		expect(result).toBe('job-123');
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/crawl',
			'test-token',
			{ method: 'POST', body: { url: 'https://example.com', limit: 3 } },
		);
		expectRedactedLog('cloudflarebrowserrendering.crawl.start', [
			'https://example.com',
			'job-123',
		]);
	});

	it('crawl.get sends job ID path and filter pagination query', async () => {
		const response = {
			id: 'job-123',
			status: 'completed',
			browserSecondsUsed: 2,
			total: 1,
			finished: 1,
			records: [{ url: 'https://example.com', status: 'completed' }],
		};
		mockedRequest.mockResolvedValue(response);
		const result = await crawlGet(ctx, {
			accountId: 'acct-123',
			jobId: 'job-123',
			cursor: '10',
			limit: 10,
			status: 'completed',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/crawl/job-123',
			'test-token',
			{
				method: 'GET',
				query: { cursor: '10', limit: 10, status: 'completed' },
			},
		);
		expectRedactedLog('cloudflarebrowserrendering.crawl.get', [
			'job-123',
			'https://example.com',
		]);
	});

	it('crawl.cancel sends DELETE and returns the cancellation result', async () => {
		const response = { job_id: 'job-123', message: 'Cancellation requested' };
		mockedRequest.mockResolvedValue(response);
		const result = await crawlCancel(ctx, {
			accountId: 'acct-123',
			jobId: 'job-123',
		});

		expect(result).toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/crawl/job-123',
			'test-token',
			{ method: 'DELETE' },
		);
		expectRedactedLog('cloudflarebrowserrendering.crawl.cancel', [
			'job-123',
			'test-token',
		]);
	});

	it('rejects invalid crawl input before making a request', async () => {
		await expect(
			crawlStart(ctx, { accountId: 'acct-123', body: { url: '' } }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
		expect(mockedLogEvent).not.toHaveBeenCalled();
	});
});

describe('Browser Run binary Quick Actions', () => {
	it('screenshot.capture returns validated base64 data without logging content', async () => {
		const privateUrl = 'https://example.com/private?token=render-secret';
		const response = {
			contentType: 'image/png',
			byteLength: 5,
			data: 'aGVsbG8=',
		};
		mockedBinaryRequest.mockResolvedValue(response);

		const result = await screenshotCapture(ctx, {
			accountId: 'acct-123',
			browser: 'kitesurf',
			cacheTTL: 30,
			body: { url: privateUrl, screenshotOptions: { fullPage: true } },
		});

		expect(result).toEqual(response);
		expect(mockedBinaryRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/screenshot',
			'test-token',
			{ url: privateUrl, screenshotOptions: { fullPage: true } },
			{ query: { browser: 'kitesurf', cacheTTL: 30 } },
		);
		expectRedactedLog('cloudflarebrowserrendering.screenshot.capture', [
			privateUrl,
			'render-secret',
			'test-token',
			'aGVsbG8=',
		]);
	});

	it('pdf.render returns validated base64 data without logging page content', async () => {
		const privateHtml = '<html>customer invoice</html>';
		const response = {
			contentType: 'application/pdf',
			byteLength: 3,
			data: 'JVBERg==',
		};
		mockedBinaryRequest.mockResolvedValue(response);

		const timeoutContext = {
			...ctx,
			options: { requestTimeoutMs: 30_000 },
		};
		const result = await pdfRender(timeoutContext, {
			accountId: 'acct-123',
			browser: 'kitesurf',
			cacheTTL: 0,
			body: { html: privateHtml, pdfOptions: { format: 'a4' } },
		});

		expect(result).toEqual(response);
		expect(mockedBinaryRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-run/pdf',
			'test-token',
			{ html: privateHtml, pdfOptions: { format: 'a4' } },
			{
				query: { browser: 'kitesurf', cacheTTL: 0 },
				timeoutMs: 30_000,
			},
		);
		expectRedactedLog(
			'cloudflarebrowserrendering.pdf.render',
			[privateHtml, 'test-token', 'JVBERg=='],
			timeoutContext,
		);
	});
});

describe('Browser Rendering DevTools operations', () => {
	const sessionId = '182bd5e5-6e1a-4fe4-a799-aa6d9a6ab26e';
	const target = {
		id: 'target-123',
		type: 'page',
		url: 'https://example.com',
	};

	it('sessions.list applies documented pagination', async () => {
		const response = [{ sessionId, startTime: 123 }];
		mockedRequest.mockResolvedValue(response);

		await expect(
			sessionsList(ctx, { accountId: 'acct-123', limit: 20, offset: 5 }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-rendering/devtools/session',
			'test-token',
			{ method: 'GET', query: { limit: 20, offset: 5 } },
		);
		expectRedactedLog('cloudflarebrowserrendering.sessions.list', [
			sessionId,
			'test-token',
		]);
	});

	it('sessions.get returns one session record', async () => {
		const response = { sessionId, connectionId: 'connection-1' };
		mockedRequest.mockResolvedValue(response);

		await expect(
			sessionsGet(ctx, { accountId: 'acct-123', sessionId }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/session/${sessionId}`,
			'test-token',
			{},
		);
		expectRedactedLog('cloudflarebrowserrendering.sessions.get', [
			sessionId,
			'test-token',
		]);
	});

	it('browser.create sends query parameters and optional session guardrails', async () => {
		const response = {
			sessionId,
			webSocketDebuggerUrl: 'wss://example.com/cdp',
		};
		mockedRequest.mockResolvedValue(response);

		await expect(
			browserCreate(ctx, {
				accountId: 'acct-123',
				keepAlive: 60_000,
				lab: true,
				liveViewUrlExpiresInMs: 120_000,
				recording: true,
				targets: true,
				guardrails: { allowedDomains: ['example.com'] },
			}),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			'/accounts/acct-123/browser-rendering/devtools/browser',
			'test-token',
			{
				method: 'POST',
				query: {
					keep_alive: 60_000,
					lab: true,
					liveViewUrlExpiresInMs: 120_000,
					recording: true,
					targets: true,
				},
				body: { guardrails: { allowedDomains: ['example.com'] } },
			},
		);
		expectRedactedLog('cloudflarebrowserrendering.browser.create', [
			sessionId,
			'wss://example.com/cdp',
		]);
	});

	it('browser.close closes a session', async () => {
		const response = { status: 'closing' };
		mockedRequest.mockResolvedValue(response);

		await expect(
			browserClose(ctx, { accountId: 'acct-123', sessionId }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}`,
			'test-token',
			{ method: 'DELETE' },
		);
		expectRedactedLog('cloudflarebrowserrendering.browser.close', [
			sessionId,
			'test-token',
		]);
	});

	it('browser.version reads browser metadata', async () => {
		const response = {
			Browser: 'Chrome/1',
			'Protocol-Version': '1.3',
			'User-Agent': 'Browser Run',
			'V8-Version': '1',
			'WebKit-Version': '1',
			webSocketDebuggerUrl: 'wss://example.com/cdp',
		};
		mockedRequest.mockResolvedValue(response);

		await expect(
			browserVersion(ctx, { accountId: 'acct-123', sessionId }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}/json/version`,
			'test-token',
			{},
		);
		expectRedactedLog('cloudflarebrowserrendering.browser.version', [
			'wss://example.com/cdp',
		]);
	});

	it('browser.protocol validates the dynamic CDP schema', async () => {
		const response = {
			domains: [
				{
					domain: 'Page',
					commands: [
						{
							name: 'enable',
							parameters: [{ name: 'enableFileChooserOpenedEvent' }],
						},
					],
					dependencies: ['Runtime'],
					events: [{ name: 'loadEventFired' }],
					experimental: false,
					types: [{ id: 'FrameId', type: 'string' }],
				},
			],
			version: { major: '1', minor: '3' },
		};
		mockedRequest.mockResolvedValue(response);

		await expect(
			browserProtocol(ctx, { accountId: 'acct-123', sessionId }),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}/json/protocol`,
			'test-token',
			{},
		);
		expectRedactedLog('cloudflarebrowserrendering.browser.protocol', [
			JSON.stringify(response),
		]);
	});

	it('liveView.create sends its expiry, mode, guardrails, and target', async () => {
		const response = {
			id: 'target-123',
			devtoolsFrontendUrl: 'https://example.com/view',
			options: { mode: 'tab', guardrails: { mode: 'readonly' } },
			webSocketDebuggerUrl: 'wss://example.com/cdp',
		};
		mockedRequest.mockResolvedValue(response);

		await expect(
			liveViewCreate(ctx, {
				accountId: 'acct-123',
				sessionId,
				expiresInMs: 300_000,
				guardrails: { mode: 'readonly' },
				mode: 'tab',
				targetId: 'target-123',
			}),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}/live_view`,
			'test-token',
			{
				method: 'POST',
				body: {
					expiresInMs: 300_000,
					guardrails: { mode: 'readonly' },
					mode: 'tab',
					targetId: 'target-123',
				},
			},
		);
		expectRedactedLog('cloudflarebrowserrendering.liveView.create', [
			'wss://example.com/cdp',
		]);
	});

	it('targets.create opens a tab and forwards its query options', async () => {
		mockedRequest.mockResolvedValue(target);

		await expect(
			targetsCreate(ctx, {
				accountId: 'acct-123',
				sessionId,
				liveViewUrlExpiresInMs: 600_000,
				url: 'https://example.com',
			}),
		).resolves.toEqual(target);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}/json/new`,
			'test-token',
			{
				method: 'PUT',
				query: {
					liveViewUrlExpiresInMs: 600_000,
					url: 'https://example.com',
				},
			},
		);
		expectRedactedLog('cloudflarebrowserrendering.targets.create', [
			'https://example.com',
		]);
	});

	it('targets.list returns target metadata and expiry options', async () => {
		const response = [target];
		mockedRequest.mockResolvedValue(response);

		await expect(
			targetsList(ctx, {
				accountId: 'acct-123',
				sessionId,
				liveViewUrlExpiresInMs: 60_000,
			}),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}/json/list`,
			'test-token',
			{ method: 'GET', query: { liveViewUrlExpiresInMs: 60_000 } },
		);
		expectRedactedLog('cloudflarebrowserrendering.targets.list', [
			'target-123',
		]);
	});

	it('targets.get addresses one target by ID', async () => {
		mockedRequest.mockResolvedValue(target);

		await expect(
			targetsGet(ctx, {
				accountId: 'acct-123',
				sessionId,
				targetId: 'target-123',
			}),
		).resolves.toEqual(target);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}/json/list/target-123`,
			'test-token',
			{},
		);
		expectRedactedLog('cloudflarebrowserrendering.targets.get', ['target-123']);
	});

	it('targets.activate brings a target to the front', async () => {
		const response = { message: 'Target activated' };
		mockedRequest.mockResolvedValue(response);

		await expect(
			targetsActivate(ctx, {
				accountId: 'acct-123',
				sessionId,
				targetId: 'target-123',
			}),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}/json/activate/target-123`,
			'test-token',
			{},
		);
		expectRedactedLog('cloudflarebrowserrendering.targets.activate', [
			'target-123',
		]);
	});

	it('targets.close returns the documented message via the GET route', async () => {
		const response = { message: 'Target is closing' };
		mockedRequest.mockResolvedValue(response);

		await expect(
			targetsClose(ctx, {
				accountId: 'acct-123',
				sessionId,
				targetId: 'target-123',
			}),
		).resolves.toEqual(response);
		expect(mockedRequest).toHaveBeenCalledWith(
			`/accounts/acct-123/browser-rendering/devtools/browser/${sessionId}/json/close/target-123`,
			'test-token',
			{},
		);
		expectRedactedLog('cloudflarebrowserrendering.targets.close', [
			'target-123',
		]);
	});
});

describe('cloudflarebrowserrendering plugin shape', () => {
	it('exposes all supported operations with API-key auth and no webhooks', () => {
		const plugin = cloudflarebrowserrendering({ authType: 'api_key' });

		expect(plugin.endpoints?.content.fetch).toBeDefined();
		expect(plugin.endpoints?.markdown.convert).toBeDefined();
		expect(plugin.endpoints?.snapshot.capture).toBeDefined();
		expect(plugin.endpoints?.accessibilityTree.capture).toBeDefined();
		expect(plugin.endpoints?.scrape.extract).toBeDefined();
		expect(plugin.endpoints?.json.extract).toBeDefined();
		expect(plugin.endpoints?.links.list).toBeDefined();
		expect(plugin.endpoints?.screenshot.capture).toBeDefined();
		expect(plugin.endpoints?.pdf.render).toBeDefined();
		expect(plugin.endpoints?.crawl.start).toBeDefined();
		expect(plugin.endpoints?.crawl.get).toBeDefined();
		expect(plugin.endpoints?.crawl.cancel).toBeDefined();
		expect(plugin.endpoints?.sessions.list).toBeDefined();
		expect(plugin.endpoints?.sessions.get).toBeDefined();
		expect(plugin.endpoints?.browser.create).toBeDefined();
		expect(plugin.endpoints?.browser.close).toBeDefined();
		expect(plugin.endpoints?.browser.version).toBeDefined();
		expect(plugin.endpoints?.browser.protocol).toBeDefined();
		expect(plugin.endpoints?.browser.liveView.create).toBeDefined();
		expect(plugin.endpoints?.targets.create).toBeDefined();
		expect(plugin.endpoints?.targets.list).toBeDefined();
		expect(plugin.endpoints?.targets.get).toBeDefined();
		expect(plugin.endpoints?.targets.activate).toBeDefined();
		expect(plugin.endpoints?.targets.close).toBeDefined();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {} });
		expect(plugin.webhooks).toEqual({});
	});

	it('throws a typed missing-auth error from keyBuilder for first-call linking', async () => {
		const plugin = cloudflarebrowserrendering({ authType: 'api_key' });
		const keyBuilder = plugin.keyBuilder;
		if (!keyBuilder)
			throw new Error('Expected the plugin to expose keyBuilder');
		type KeyBuilderContext = Parameters<NonNullable<typeof keyBuilder>>[0];
		const keyBuilderContext: KeyBuilderContext = {
			authType: 'api_key',
			options: { authType: 'api_key' },
			tenantId: 'default',
			keys: {
				...ctx.keys,
				get_api_key: () => Promise.resolve(null),
			},
		};

		await expect(
			keyBuilder(keyBuilderContext, 'endpoint'),
		).rejects.toBeInstanceOf(AuthMissingError);
	});

	it('registers input and output zod schemas for every endpoint', () => {
		for (const schema of Object.values(
			cloudflareBrowserRenderingEndpointSchemas,
		)) {
			expect(schema.input).toBeDefined();
			expect(schema.output).toBeDefined();
		}
		expect(Object.keys(cloudflareBrowserRenderingEndpointSchemas)).toHaveLength(
			24,
		);
	});
});
