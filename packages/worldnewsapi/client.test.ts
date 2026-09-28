import { z } from 'zod';
import {
	makeWorldNewsApiRequest,
	parseRssFeedXml,
	validatePublicUrl,
	WorldNewsApiError,
} from './client';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

type MockResponse = {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
};

let captured: Captured | undefined;

function mockFetch(response: MockResponse) {
	captured = undefined;
	global.fetch = (async (url: unknown, init?: RequestInit) => {
		const headers: Record<string, string> = {};
		const raw = init?.headers;
		if (raw instanceof Headers) {
			raw.forEach((value, key) => {
				headers[key.toLowerCase()] = value;
			});
		} else {
			for (const [key, value] of Object.entries(
				(raw ?? {}) as Record<string, string>,
			)) {
				headers[key.toLowerCase()] = value;
			}
		}
		captured = { url: String(url), method: init?.method ?? 'GET', headers };

		const status = response.status ?? 200;
		const payload = response.body ?? {};
		const isText = typeof payload === 'string';

		return {
			ok: response.ok ?? status < 400,
			status,
			statusText: status === 200 ? 'OK' : 'Error',
			url: String(url),
			headers: new Headers({
				'Content-Type': isText ? 'application/xml' : 'application/json',
				'X-API-Quota-Request': '1',
				'X-API-Quota-Used': '15',
				'X-API-Quota-Left': '85',
				...response.headers,
			}),
			json: async () => (isText ? JSON.parse(payload) : payload),
			text: async () => (isText ? payload : JSON.stringify(payload)),
		};
	}) as unknown as typeof global.fetch;
}

describe('World News API Client', () => {
	describe('Authentication & Headers', () => {
		it('sends API key in x-api-key header and does not expose it in URL query', async () => {
			mockFetch({ body: { available: 1, news: [] } });

			await makeWorldNewsApiRequest(
				'/top-news',
				'secret-api-key',
				{
					query: { 'source-country': 'us', language: 'en' },
				},
				z.object({ available: z.number().optional() }).passthrough(),
			);

			expect(captured?.headers['x-api-key']).toBe('secret-api-key');
			expect(captured?.url).not.toContain('api-key=');
			expect(captured?.url).not.toContain('secret-api-key');
		});

		it('throws an error if API key is missing or empty', async () => {
			await expect(
				makeWorldNewsApiRequest('/top-news', '', {}, z.unknown()),
			).rejects.toThrow('World News API key is required');
			await expect(
				makeWorldNewsApiRequest('/top-news', '   ', {}, z.unknown()),
			).rejects.toThrow('World News API key is required');
		});

		it('sets appropriate Accept header for RSS requests vs JSON requests', async () => {
			mockFetch({ body: '<rss><channel></channel></rss>' });

			await makeWorldNewsApiRequest('feed.rss', 'secret-key', {}, z.string());
			expect(captured?.headers.accept).toContain('application/xml');

			mockFetch({ body: { available: 1 } });
			await makeWorldNewsApiRequest(
				'search-news',
				'secret-key',
				{},
				z.object({ available: z.number() }),
			);
			expect(captured?.headers.accept).toContain('application/json');
		});
	});

	describe('URL & SSRF Validation', () => {
		it('accepts valid public HTTP and HTTPS URLs', () => {
			expect(() =>
				validatePublicUrl('https://www.bbc.com/news/123'),
			).not.toThrow();
			expect(() =>
				validatePublicUrl('http://edition.cnn.com/world'),
			).not.toThrow();
		});

		it('rejects invalid or non-string URLs', () => {
			expect(() => validatePublicUrl('')).toThrow(WorldNewsApiError);
			expect(() => validatePublicUrl('not-a-url')).toThrow(WorldNewsApiError);
		});

		it('rejects non-HTTP/HTTPS protocols', () => {
			expect(() => validatePublicUrl('file:///etc/passwd')).toThrow(
				'Only http and https URLs are permitted',
			);
			expect(() => validatePublicUrl('ftp://example.com/file')).toThrow(
				'Only http and https URLs are permitted',
			);
			expect(() => validatePublicUrl('javascript:alert(1)')).toThrow(
				'Only http and https URLs are permitted',
			);
		});

		it('blocks loopback and private network hosts for SSRF prevention', () => {
			expect(() => validatePublicUrl('http://localhost:8080/admin')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://127.0.0.1/secret')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://0.0.0.0/')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://10.0.0.1/status')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://192.168.1.1/router')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://172.16.0.5/internal')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() =>
				validatePublicUrl('http://169.254.169.254/metadata'),
			).toThrow('Access to private or local network hosts');
			expect(() => validatePublicUrl('http://service.internal/')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://[::1]/')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://[fd00::1]/')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://[fe80::1]/')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://[::ffff:10.0.0.1]/')).toThrow(
				'Access to private or local network hosts',
			);
			expect(() => validatePublicUrl('http://127.0.0.2/secret')).toThrow(
				'Access to private or local network hosts',
			);
		});
	});

	describe('Safe RSS 2.0 XML Parser', () => {
		const sampleRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Global News Network</title>
    <link>https://www.example.com/news</link>
    <description>Daily breaking world news</description>
    <pubDate>Mon, 28 Aug 2026 12:00:00 GMT</pubDate>
    <lastBuildDate>Mon, 28 Aug 2026 12:30:00 GMT</lastBuildDate>
    <language>en</language>
    <item>
      <title><![CDATA[Major Scientific Discovery Announced & Verified]]></title>
      <link>https://www.example.com/news/101</link>
      <guid isPermaLink="true">https://www.example.com/news/101</guid>
      <pubDate>Mon, 28 Aug 2026 10:00:00 GMT</pubDate>
      <description>Scientists have verified a breakthrough discovery.</description>
      <dc:creator>Dr. Jane Doe</dc:creator>
      <category>Science</category>
      <enclosure url="https://www.example.com/img/discovery.jpg" type="image/jpeg" />
    </item>
    <item>
      <title>Tech Innovation in AI</title>
      <link>https://www.example.com/news/102</link>
      <guid>guid-102</guid>
      <pubDate>Mon, 28 Aug 2026 11:15:00 GMT</pubDate>
      <description>New intelligent agents launched today.</description>
      <author>John Smith</author>
      <category>Technology</category>
    </item>
  </channel>
</rss>`;

		it('parses channel and item elements safely', () => {
			const parsed = parseRssFeedXml(sampleRss);

			expect(parsed.title).toBe('Global News Network');
			expect(parsed.link).toBe('https://www.example.com/news');
			expect(parsed.description).toBe('Daily breaking world news');
			expect(parsed.pubDate).toBe('Mon, 28 Aug 2026 12:00:00 GMT');
			expect(parsed.lastBuildDate).toBe('Mon, 28 Aug 2026 12:30:00 GMT');
			expect(parsed.language).toBe('en');
			expect(parsed.items).toHaveLength(2);

			const item1 = parsed.items[0];
			expect(item1?.title).toBe(
				'Major Scientific Discovery Announced & Verified',
			);
			expect(item1?.link).toBe('https://www.example.com/news/101');
			expect(item1?.guid).toBe('https://www.example.com/news/101');
			expect(item1?.author).toBe('Dr. Jane Doe');
			expect(item1?.category).toBe('Science');
			expect(item1?.enclosureUrl).toBe(
				'https://www.example.com/img/discovery.jpg',
			);

			const item2 = parsed.items[1];
			expect(item2?.title).toBe('Tech Innovation in AI');
			expect(item2?.link).toBe('https://www.example.com/news/102');
			expect(item2?.author).toBe('John Smith');
		});

		it('throws an error on empty or invalid XML input', () => {
			expect(() => parseRssFeedXml('')).toThrow(WorldNewsApiError);
			expect(() =>
				parseRssFeedXml('<html><body>not rss</body></html>'),
			).toThrow(WorldNewsApiError);
		});
	});

	describe('Runtime Response Schema Validation', () => {
		it('validates provider response against schema when schema is provided', async () => {
			const validPayload = {
				latitude: 35.6762,
				longitude: 139.6503,
				city: 'Tokyo',
			};
			mockFetch({ body: validPayload });

			const { z } = await import('zod');
			const GeoSchema = z.object({
				latitude: z.number(),
				longitude: z.number(),
				city: z.string().optional(),
			});

			const result = await makeWorldNewsApiRequest(
				'/geo-coordinates',
				'secret-key',
				{},
				GeoSchema,
			);
			expect(result.latitude).toBe(35.6762);
			expect(result.city).toBe('Tokyo');
		});

		it('throws WorldNewsApiError when provider response does not match schema', async () => {
			const malformedPayload = {
				latitude: 'not-a-number',
				longitude: 139.6503,
			};
			mockFetch({ body: malformedPayload });

			const GeoSchema = z.object({
				latitude: z.number(),
				longitude: z.number(),
			});

			await expect(
				makeWorldNewsApiRequest(
					'/geo-coordinates',
					'secret-key',
					{},
					GeoSchema,
				),
			).rejects.toThrow(WorldNewsApiError);
		});
	});
});
