import {
	BrowserlessAPIError,
	requestBrowserlessFile,
	requestBrowserlessFunction,
	requestBrowserlessJson,
	requestBrowserlessText,
} from './client';
import {
	BrowserlessFile,
	BrowserlessScrapeResult,
	BrowserlessUnblockResult,
} from './schema';

const LIVE_KEY = process.env.BROWSERLESS_API_KEY;
const describeIfKey = LIVE_KEY ? describe : describe.skip;

describe('Browserless live REST', () => {
	it('rejects an invalid token on POST /scrape', async () => {
		const err = await requestBrowserlessJson('/scrape', 'invalid-live-check', {
			body: {
				url: 'https://example.com/',
				elements: [{ selector: 'h1' }],
			},
		}).catch((error: unknown) => error);
		expect(err).toBeInstanceOf(BrowserlessAPIError);
		expect((err as BrowserlessAPIError).status).toBe(401);
	});
});

describeIfKey('Browserless live REST (authenticated)', () => {
	it('returns rendered HTML from POST /content', async () => {
		const raw = await requestBrowserlessText('/content', LIVE_KEY as string, {
			body: { url: 'https://example.com/' },
		});
		expect(raw.html.toLowerCase()).toContain('<html');
	});

	it('returns scrape data[] from POST /scrape', async () => {
		const raw = await requestBrowserlessJson('/scrape', LIVE_KEY as string, {
			body: {
				url: 'https://example.com/',
				elements: [{ selector: 'h1' }],
			},
		});
		const parsed = BrowserlessScrapeResult.parse(raw);
		expect(parsed.data[0]?.selector).toBe('h1');
		expect((parsed.data[0]?.results[0]?.text ?? '').length).toBeGreaterThan(0);
	});

	it('returns a PNG from POST /screenshot', async () => {
		const file = BrowserlessFile.parse(
			await requestBrowserlessFile('/screenshot', LIVE_KEY as string, {
				body: {
					url: 'https://example.com/',
					options: { type: 'png', fullPage: true },
				},
			}),
		);
		expect(file.contentType).toContain('image/png');
		expect(Buffer.from(file.base64, 'base64').subarray(0, 8)).toEqual(
			Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
		);
	});

	it('returns a PDF from POST /pdf', async () => {
		const file = BrowserlessFile.parse(
			await requestBrowserlessFile('/pdf', LIVE_KEY as string, {
				body: {
					url: 'https://example.com/',
					options: { format: 'A4' },
				},
			}),
		);
		expect(file.contentType).toContain('application/pdf');
		expect(Buffer.from(file.base64, 'base64').subarray(0, 4).toString()).toBe(
			'%PDF',
		);
	});

	it('runs POST /function and returns JSON', async () => {
		const raw = await requestBrowserlessFunction(LIVE_KEY as string, {
			code: 'export default async ({ page }) => { await page.goto("https://example.com/"); return { data: { title: await page.title() }, type: "application/json" }; };',
		});
		expect(raw.kind).toBe('json');
		if (raw.kind === 'json') {
			const payload = raw.data as { data?: { title?: string } };
			expect((payload.data?.title ?? '').length).toBeGreaterThan(0);
		}
	});

	it('returns HTML from POST /unblock', async () => {
		const parsed = BrowserlessUnblockResult.parse(
			await requestBrowserlessJson('/unblock', LIVE_KEY as string, {
				body: {
					url: 'https://example.com/',
					content: true,
					cookies: false,
					screenshot: false,
					browserWSEndpoint: false,
				},
			}),
		);
		expect((parsed.content ?? '').toLowerCase()).toContain('<html');
	});

	it('returns a downloaded file from POST /download', async () => {
		const file = BrowserlessFile.parse(
			await requestBrowserlessFile('/download', LIVE_KEY as string, {
				code: 'export default async ({ page }) => { await page.goto("https://example.com/"); await page.evaluate(() => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["hello"], { type: "text/plain" })); a.download = "hello.txt"; document.body.appendChild(a); a.click(); }); await new Promise((r) => setTimeout(r, 2000)); };',
			}),
		);
		expect(Buffer.from(file.base64, 'base64').toString()).toContain('hello');
	});
});
