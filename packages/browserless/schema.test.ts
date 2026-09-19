import {
	BrowserlessCookie,
	BrowserlessFile,
	BrowserlessHtml,
	BrowserlessSchema,
	BrowserlessScrapeResult,
	BrowserlessUnblockResult,
} from './schema';

describe('Browserless schema', () => {
	it('declares a semver version', () => {
		expect(BrowserlessSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
	});

	it('declares official REST entities', () => {
		expect(BrowserlessSchema.entities.cookies).toBe(BrowserlessCookie);
		expect(BrowserlessSchema.entities.files).toBe(BrowserlessFile);
		expect(BrowserlessSchema.entities.html).toBe(BrowserlessHtml);
		expect(BrowserlessSchema.entities.scrapeResults).toBe(
			BrowserlessScrapeResult,
		);
		expect(BrowserlessSchema.entities.unblockResults).toBe(
			BrowserlessUnblockResult,
		);
	});

	it('parses official /scrape response shape', () => {
		const parsed = BrowserlessScrapeResult.parse({
			data: [
				{
					selector: 'h1',
					results: [
						{
							attributes: [{ name: 'class', value: 'hero' }],
							height: 120,
							html: 'Headless browser automation',
							left: 32,
							text: 'Headless browser automation',
							top: 196,
							width: 736,
						},
					],
				},
			],
		});
		expect(parsed.data[0]?.results[0]?.text).toContain('Headless');
	});

	it('parses official cookie fields including optional sameSite and url', () => {
		expect(
			BrowserlessCookie.parse({
				name: 'session_id',
				value: 'XYZ123',
				domain: 'turo.com',
				path: '/',
				secure: true,
				httpOnly: true,
				sameSite: 'Lax',
				url: 'https://turo.com/',
			}).sameSite,
		).toBe('Lax');
	});

	it('parses official /unblock response shape', () => {
		const parsed = BrowserlessUnblockResult.parse({
			content: '<!DOCTYPE html><html></html>',
			cookies: [],
			screenshot: null,
			browserWSEndpoint: null,
		});
		expect(parsed.content).toContain('DOCTYPE');
	});
});
