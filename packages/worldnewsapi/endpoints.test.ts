import { extractNews } from './endpoints/extract-news';
import { extractNewsLinks } from './endpoints/extract-news-links';
import { getGeoCoordinates } from './endpoints/get-geo-coordinates';
import { newsWebsiteToRssFeed } from './endpoints/news-website-to-rss-feed';
import { searchNews } from './endpoints/search-news';
import { searchNewsSources } from './endpoints/search-news-sources';
import { topNews } from './endpoints/top-news';
import type { WorldNewsApiContext } from './index';

type Captured = {
	url: string;
	method: string;
	headers: Record<string, string>;
};

let captured: Captured | undefined;

function mockFetch(response: {
	ok?: boolean;
	status?: number;
	body?: unknown;
	headers?: Record<string, string>;
}) {
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
				...response.headers,
			}),
			json: async () => (isText ? JSON.parse(payload) : payload),
			text: async () => (isText ? payload : JSON.stringify(payload)),
		};
	}) as unknown as typeof global.fetch;
}

const mockCtx = {
	key: 'test-api-key',
	authType: 'api_key',
	$getAccountId: () => 'test-account-id',
	database: { logEvent: jest.fn().mockResolvedValue({}) },
	db: {
		articles: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		extractedArticles: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		geoCoordinates: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
		sources: { upsertByEntityId: jest.fn().mockResolvedValue({}) },
	},
} as unknown as WorldNewsApiContext;

describe('World News API Endpoints', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('WORLD_NEWS_API_TOP_NEWS', () => {
		it('retrieves top news with country and language filters', async () => {
			const mockPayload = {
				top_news: [
					{
						news: [
							{
								id: 101,
								title: 'Global Economic Summit Begins',
								text: 'Leaders gathered today to discuss global trade.',
								summary: 'Trade summit summary.',
								url: 'https://example.com/news/101',
								publish_date: '2026-08-31 09:00:00',
								authors: ['Alice Smith'],
								language: 'en',
								source_country: 'us',
								sentiment: 0.25,
							},
						],
					},
				],
				language: 'en',
				country: 'us',
			};

			mockFetch({ body: mockPayload });

			const res = await topNews(mockCtx, {
				sourceCountry: 'us',
				language: 'en',
				date: '2026-08-31',
				headlinesOnly: false,
				maxNewsPerCluster: 3,
			});

			expect(captured?.url).toContain('source-country=us');
			expect(captured?.url).toContain('language=en');
			expect(captured?.url).toContain('date=2026-08-31');
			expect(captured?.url).toContain('headlines-only=false');
			expect(captured?.url).toContain('max-news-per-cluster=3');

			expect(res.top_news).toHaveLength(1);
			expect(res.top_news?.[0]?.news?.[0]?.title).toBe(
				'Global Economic Summit Begins',
			);
			expect(mockCtx.db.articles.upsertByEntityId).toHaveBeenCalledWith(
				'101',
				expect.objectContaining({
					id: 101,
					title: 'Global Economic Summit Begins',
				}),
			);
		});
	});

	describe('WORLD_NEWS_API_EXTRACT_NEWS', () => {
		it('extracts article content and metadata from a URL', async () => {
			const mockPayload = {
				title: 'Space Exploration Breakthrough',
				text: 'New findings from outer space exploration.',
				url: 'https://www.example.com/space-news',
				image: 'https://www.example.com/img.jpg',
				publish_date: '2026-08-31 10:00:00',
				authors: ['Dr. Cosmos'],
				language: 'en',
				source_country: 'us',
				sentiment: 0.8,
				entities: [{ name: 'NASA', type: 'ORG', sentiment: 0.7 }],
			};

			mockFetch({ body: mockPayload });

			const res = await extractNews(mockCtx, {
				url: 'https://www.example.com/space-news',
				analyze: true,
			});

			expect(captured?.url).toContain(
				'url=https%3A%2F%2Fwww.example.com%2Fspace-news',
			);
			expect(captured?.url).toContain('analyze=true');
			expect(res.title).toBe('Space Exploration Breakthrough');
			expect(res.entities?.[0]?.name).toBe('NASA');
			expect(
				mockCtx.db.extractedArticles.upsertByEntityId,
			).toHaveBeenCalledWith(
				'https://www.example.com/space-news',
				expect.objectContaining({ title: 'Space Exploration Breakthrough' }),
			);
		});

		it('rejects invalid or SSRF target URLs before sending request', async () => {
			await expect(
				extractNews(mockCtx, { url: 'http://localhost/secret' }),
			).rejects.toThrow('Access to private or local network hosts');
		});
	});

	describe('WORLD_NEWS_API_EXTRACT_NEWS_LINKS', () => {
		it('extracts news article links from a webpage', async () => {
			const mockPayload = {
				status: 'success',
				news_links: [
					'https://www.example.com/news/1',
					'https://www.example.com/news/2',
				],
			};

			mockFetch({ body: mockPayload });

			const res = await extractNewsLinks(mockCtx, {
				url: 'https://www.example.com',
				prefix: 'https://www.example.com/news/',
				subDomain: false,
			});

			expect(captured?.url).toContain(
				'prefix=https%3A%2F%2Fwww.example.com%2Fnews%2F',
			);
			expect(captured?.url).toContain('sub-domain=false');
			expect(res.news_links).toHaveLength(2);
		});
	});

	describe('WORLD_NEWS_API_GET_GEO_COORDINATES', () => {
		it('retrieves geographic coordinates for a location string', async () => {
			const mockPayload = {
				latitude: 19.076,
				longitude: 72.8777,
				city: 'Mumbai',
			};

			mockFetch({ body: mockPayload });

			const res = await getGeoCoordinates(mockCtx, {
				location: 'Mumbai, India',
			});

			expect(captured?.url).toContain('location=Mumbai%2C%20India');
			expect(res.latitude).toBe(19.076);
			expect(res.longitude).toBe(72.8777);
			expect(res.city).toBe('Mumbai');
			expect(mockCtx.db.geoCoordinates.upsertByEntityId).toHaveBeenCalledWith(
				'Mumbai, India',
				expect.objectContaining({ city: 'Mumbai', latitude: 19.076 }),
			);
		});
	});

	describe('WORLD_NEWS_API_NEWS_WEBSITE_TO_RSS_FEED', () => {
		it('converts a news site to a structured RSS feed', async () => {
			const xmlRss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Daily Digest</title>
    <link>https://www.example.com</link>
    <description>Daily world digest</description>
    <item>
      <title>Headline 1</title>
      <link>https://www.example.com/h1</link>
      <guid>h1</guid>
    </item>
  </channel>
</rss>`;

			mockFetch({ body: xmlRss });

			const res = await newsWebsiteToRssFeed(mockCtx, {
				url: 'https://www.example.com',
				extractNews: false,
			});

			expect(captured?.url).toContain('feed.rss');
			expect(captured?.url).toContain('url=https%3A%2F%2Fwww.example.com');
			expect(res.title).toBe('Daily Digest');
			expect(res.items).toHaveLength(1);
			expect(res.items[0]?.title).toBe('Headline 1');
		});

		it('rejects HTML error pages instead of returning an empty feed', async () => {
			mockFetch({ body: '<html><body>quota exceeded</body></html>' });

			await expect(
				newsWebsiteToRssFeed(mockCtx, {
					url: 'https://www.example.com',
				}),
			).rejects.toThrow('RSS response is missing a channel element');
		});
	});

	describe('WORLD_NEWS_API_SEARCH_NEWS_SOURCES', () => {
		it('searches for news sources by name', async () => {
			const mockPayload = {
				available: 2,
				sources: [
					{
						name: 'BBC News',
						url: 'https://www.bbc.co.uk',
						language: 'en',
						country: 'gb',
					},
					{
						name: 'BBC World',
						url: 'https://www.bbc.com',
						language: 'en',
						country: 'gb',
					},
				],
			};

			mockFetch({ body: mockPayload });

			const res = await searchNewsSources(mockCtx, {
				name: 'bbc',
			});

			expect(captured?.url).toContain('name=bbc');
			expect(res.available).toBe(2);
			expect(res.sources).toHaveLength(2);
			expect(mockCtx.db.sources.upsertByEntityId).toHaveBeenCalledWith(
				'https://www.bbc.co.uk',
				expect.objectContaining({ name: 'BBC News' }),
			);
		});
	});

	describe('WORLD_NEWS_API_SEARCH_NEWS', () => {
		it('searches news articles with comprehensive filters', async () => {
			const mockPayload = {
				offset: 0,
				number: 5,
				available: 42,
				news: [
					{
						id: 501,
						title: 'Artificial Intelligence Innovation in 2026',
						text: 'Full article text on recent breakthroughs.',
						summary: 'Summary of AI innovation.',
						url: 'https://example.com/ai-2026',
						publish_date: '2026-08-31 08:30:00',
						authors: ['Tech Reporter'],
						category: 'technology',
						language: 'en',
						source_country: 'us',
						sentiment: 0.65,
					},
				],
			};

			mockFetch({ body: mockPayload });

			const res = await searchNews(mockCtx, {
				text: 'Artificial Intelligence',
				textMatchIndexes: 'title,content',
				sourceCountry: 'us',
				language: 'en',
				minSentiment: -0.2,
				maxSentiment: 0.9,
				earliestPublishDate: '2026-08-01',
				latestPublishDate: '2026-08-31',
				newsSources: 'example.com,bbc.com',
				authors: 'Tech Reporter',
				categories: 'technology,science',
				entities: 'ORG:OpenAI',
				locationFilter: '37.7749,-122.4194,50',
				sort: 'publish-time',
				sortDirection: 'DESC',
				offset: 0,
				number: 5,
			});

			expect(captured?.url).toContain('text=Artificial%20Intelligence');
			expect(captured?.url).toContain('text-match-indexes=title%2Ccontent');
			expect(captured?.url).toContain('source-country=us');
			expect(captured?.url).toContain('min-sentiment=-0.2');
			expect(captured?.url).toContain(
				'location-filter=37.7749%2C-122.4194%2C50',
			);
			expect(captured?.url).toContain('number=5');

			expect(res.available).toBe(42);
			expect(res.news).toHaveLength(1);
			expect(res.news?.[0]?.id).toBe(501);
			expect(mockCtx.db.articles.upsertByEntityId).toHaveBeenCalledWith(
				'501',
				expect.objectContaining({
					title: 'Artificial Intelligence Innovation in 2026',
				}),
			);
		});
	});

	describe('Runtime Response Validation (P1 Fix)', () => {
		it('rejects topNews when provider payload is malformed or missing required top_news array', async () => {
			mockFetch({ body: { invalid_key: 'malformed_data' } });

			await expect(
				topNews(mockCtx, {
					sourceCountry: 'us',
					language: 'en',
				}),
			).rejects.toThrow();
		});

		it('rejects getGeoCoordinates when provider returns incorrect field types', async () => {
			mockFetch({
				body: {
					latitude: 'invalid-string-not-number',
					longitude: 139.6503,
				},
			});

			await expect(
				getGeoCoordinates(mockCtx, {
					location: 'Tokyo',
				}),
			).rejects.toThrow();
		});

		it('rejects searchNews when articles are missing required id or title', async () => {
			mockFetch({
				body: {
					offset: 0,
					number: 10,
					available: 1,
					news: [
						{
							// Missing id and url
							title: 'Article Without Required Fields',
						},
					],
				},
			});

			await expect(
				searchNews(mockCtx, {
					text: 'test',
				}),
			).rejects.toThrow();
		});

		it('rejects searchNewsSources when available count is not a number', async () => {
			mockFetch({
				body: {
					available: 'ten',
					sources: [],
				},
			});

			await expect(
				searchNewsSources(mockCtx, {
					name: 'bbc',
				}),
			).rejects.toThrow();
		});

		it('rejects extractNewsLinks when news_links is not an array of strings', async () => {
			mockFetch({
				body: {
					news_links: 'https://example.com/not-an-array',
				},
			});

			await expect(
				extractNewsLinks(mockCtx, {
					url: 'https://example.com',
				}),
			).rejects.toThrow();
		});
	});
});
