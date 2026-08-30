import * as client from './client';
import { Tavily } from './endpoints';
import {
	TavilyCrawlRequestSchema,
	TavilyExtractRequestSchema,
	TavilyResearchRequestSchema,
	TavilySearchRequestSchema,
	TavilySearchResponseSchema,
} from './endpoints/types';
import type { TavilyMcpContext } from './index';

jest.mock('corsair/core', () => {
	const actual =
		jest.requireActual<typeof import('corsair/core')>('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue(null) };
});

jest.mock('./client', () => ({ makeTavilyMcpRequest: jest.fn() }));

const mockedRequest = client.makeTavilyMcpRequest as jest.MockedFunction<
	typeof client.makeTavilyMcpRequest
>;

const ctx = {
	key: 'tvly-test-key',
	db: {
		searchResults: { upsertByEntityId: jest.fn() },
		extractResults: { upsertByEntityId: jest.fn() },
		crawlResults: { upsertByEntityId: jest.fn() },
		mapResults: { upsertByEntityId: jest.fn() },
		researchResults: { upsertByEntityId: jest.fn() },
	},
} as unknown as TavilyMcpContext;

beforeEach(() => jest.clearAllMocks());

// The endpoint binder does not validate endpoint inputs, so each handler must.
describe('input validation', () => {
	it('rejects a query shorter than the two characters Tavily requires', async () => {
		await expect(Tavily.search(ctx, { query: 'x' })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects max_results above the documented ceiling', async () => {
		await expect(
			Tavily.search(ctx, { query: 'mcp spec', max_results: 21 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a crawl depth above the documented ceiling', async () => {
		await expect(
			Tavily.crawl(ctx, { url: 'https://docs.tavily.com', max_depth: 6 }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects an unknown crawl category', () => {
		expect(
			TavilyCrawlRequestSchema.safeParse({
				url: 'https://docs.tavily.com',
				categories: ['Nonsense'],
			}).success,
		).toBe(false);
	});

	it('accepts every category the live API allows', () => {
		expect(
			TavilyCrawlRequestSchema.safeParse({
				url: 'https://docs.tavily.com',
				categories: ['Documentation', 'People', 'Careers'],
			}).success,
		).toBe(true);
	});

	it('rejects more than the 20 URLs extract accepts', () => {
		const urls = Array.from(
			{ length: 21 },
			(_, i) => `https://example.com/${i}`,
		);
		expect(TavilyExtractRequestSchema.safeParse({ urls }).success).toBe(false);
	});

	it('requires research files to carry inline base64 contents', () => {
		expect(
			TavilyResearchRequestSchema.safeParse({
				input: 'q',
				files: ['file-id-123'],
			}).success,
		).toBe(false);

		expect(
			TavilyResearchRequestSchema.safeParse({
				input: 'q',
				files: [{ name: 'a.md', data: 'aGk=', type: 'base64' }],
			}).success,
		).toBe(true);
	});

	it('rejects a research file whose contents are not base64', () => {
		expect(
			TavilyResearchRequestSchema.safeParse({
				input: 'q',
				files: [{ name: 'a.md', data: 'not base64!', type: 'base64' }],
			}).success,
		).toBe(false);
	});

	it('rejects a research file with an extension Tavily cannot read', () => {
		const file = (name: string) => ({
			input: 'q',
			files: [{ name, data: 'aGk=', type: 'base64' }],
		});

		expect(TavilyResearchRequestSchema.safeParse(file('a.pdf')).success).toBe(
			false,
		);
		expect(TavilyResearchRequestSchema.safeParse(file('noext')).success).toBe(
			false,
		);
		for (const name of ['a.txt', 'a.md', 'a.json']) {
			expect(TavilyResearchRequestSchema.safeParse(file(name)).success).toBe(
				true,
			);
		}
	});

	it('caps research domain lists at the documented 20 entries', () => {
		const domains = Array.from({ length: 21 }, (_, i) => `d${i}.com`);
		expect(
			TavilyResearchRequestSchema.safeParse({
				input: 'q',
				include_domains: domains,
			}).success,
		).toBe(false);
	});
});

// Request schemas carry no defaults, so nothing the caller did not set is sent.
describe('request bodies', () => {
	it('sends only the fields the caller supplied', async () => {
		mockedRequest.mockResolvedValueOnce({
			query: 'mcp spec',
			images: [],
			results: [],
			response_time: 0.2,
		});

		await Tavily.search(ctx, { query: 'mcp spec' });

		expect(mockedRequest).toHaveBeenCalledWith('search', ctx.key, {
			method: 'POST',
			body: { query: 'mcp spec' },
		});
	});

	it('does not invent an allow_external default that contradicts the API', () => {
		const parsed = TavilyCrawlRequestSchema.parse({
			url: 'https://docs.tavily.com',
		});
		expect(parsed).toEqual({ url: 'https://docs.tavily.com' });
	});
});

describe('output validation', () => {
	it('rejects a response missing a required field', async () => {
		mockedRequest.mockResolvedValueOnce({ query: 'mcp spec', images: [] });

		await expect(Tavily.search(ctx, { query: 'mcp spec' })).rejects.toThrow();
	});

	it('preserves provider fields that are not in the published reference', () => {
		const parsed = TavilySearchResponseSchema.parse({
			query: 'mcp spec',
			follow_up_questions: null,
			images: [],
			results: [
				{
					title: 'Spec',
					url: 'https://modelcontextprotocol.io/spec',
					content: 'The specification.',
					score: 0.9,
					id: '8064e5-00',
				},
			],
			response_time: 1.1,
			unexpected_new_field: 'kept',
		});

		expect(parsed.results[0]?.id).toBe('8064e5-00');
		expect(parsed).toHaveProperty('unexpected_new_field', 'kept');
	});

	it('accepts a null favicon', () => {
		expect(
			TavilySearchRequestSchema.safeParse({ query: 'mcp spec' }).success,
		).toBe(true);
		expect(
			TavilySearchResponseSchema.safeParse({
				query: 'mcp spec',
				images: [],
				results: [
					{
						title: 'Spec',
						url: 'https://modelcontextprotocol.io/spec',
						content: 'x',
						score: 0.1,
						favicon: null,
					},
				],
				response_time: 1,
			}).success,
		).toBe(true);
	});
});
