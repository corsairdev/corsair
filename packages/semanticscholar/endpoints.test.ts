import { logEventFromContext } from 'corsair/core';
import * as Endpoints from './endpoints';
import type { SemanticScholarContext } from './index';
import {
	semanticScholarEndpointMeta,
	semanticScholarEndpointSchemas,
} from './index';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn(async () => undefined),
}));

const mockLogEvent = jest.mocked(logEventFromContext);

function makeCtx(): SemanticScholarContext {
	return { key: 'test-key' } as SemanticScholarContext;
}

let captured:
	| {
			url: string;
			method: string;
			headers: Headers;
			body?: string;
	  }
	| undefined;

afterEach(() => {
	jest.restoreAllMocks();
	mockLogEvent.mockClear();
});

function mockFetch(payload: unknown, status = 200) {
	captured = undefined;
	jest.spyOn(global, 'fetch').mockImplementation((input, init) => {
		captured = {
			url: String(input),
			method: init?.method ?? 'GET',
			headers: new Headers(init?.headers),
			body: typeof init?.body === 'string' ? init.body : undefined,
		};
		return Promise.resolve(
			new Response(JSON.stringify(payload), {
				status,
				statusText: status < 400 ? 'OK' : 'Error',
				headers: { 'Content-Type': 'application/json' },
			}),
		);
	});
}

function parsed(): { path: string; query: URLSearchParams } {
	const url = new URL(captured?.url ?? 'http://invalid');
	return { path: url.pathname, query: url.searchParams };
}

describe('Semantic Scholar endpoints', () => {
	it('papers.get retrieves paper details by documented paper id path', async () => {
		mockFetch({ paperId: 'p1', title: 'Paper' });

		const out = await Endpoints.getPaper(makeCtx(), {
			paperId: 'DOI:10.18653/v1/N18-3011',
			fields: 'title,authors',
		});

		expect(parsed().path).toBe(
			'/graph/v1/paper/DOI%3A10.18653%2Fv1%2FN18-3011',
		);
		expect(parsed().query.get('fields')).toBe('title,authors');
		expect(captured?.headers.get('x-api-key')).toBe('test-key');
		expect(out.paperId).toBe('p1');
	});

	it('papers.batch posts ids and keeps fields in the query string', async () => {
		mockFetch([{ paperId: 'p1', title: 'Paper' }, null]);

		const out = await Endpoints.getPapersBatch(makeCtx(), {
			ids: ['p1', 'ARXIV:2106.15928'],
			fields: 'title,url',
		});

		expect(parsed().path).toBe('/graph/v1/paper/batch');
		expect(captured?.method).toBe('POST');
		expect(parsed().query.get('fields')).toBe('title,url');
		expect(captured?.body).toBe(
			JSON.stringify({ ids: ['p1', 'ARXIV:2106.15928'] }),
		);
		expect(out).toHaveLength(2);
	});

	it('papers.search and papers.relevanceSearch use relevance search filters', async () => {
		mockFetch({
			total: 1,
			offset: 0,
			data: [{ paperId: 'p1', title: 'Paper' }],
		});

		await Endpoints.searchPapers(makeCtx(), {
			query: 'generative ai',
			fields: 'title,year',
			limit: 10,
			openAccessPdf: true,
		});

		expect(parsed().path).toBe('/graph/v1/paper/search');
		expect(parsed().query.get('query')).toBe('generative ai');
		expect(parsed().query.get('openAccessPdf')).toBe('');

		mockFetch({ total: 0, offset: 0, data: [] });
		await Endpoints.paperRelevanceSearch(makeCtx(), {
			query: 'literature graph',
		});
		expect(parsed().path).toBe('/graph/v1/paper/search');
	});

	it('papers.searchBulk uses token pagination and sort', async () => {
		mockFetch({ total: 1, token: 'next-token', data: [{ paperId: 'p1' }] });

		await Endpoints.searchBulkPapers(makeCtx(), {
			query: 'covid',
			token: 'cursor',
			sort: 'citationCount:desc',
		});

		expect(parsed().path).toBe('/graph/v1/paper/search/bulk');
		expect(parsed().query.get('token')).toBe('cursor');
		expect(parsed().query.get('sort')).toBe('citationCount:desc');
	});

	it('papers.searchBulk supports filter-only searches without query', async () => {
		mockFetch({ total: 1, data: [{ paperId: 'p1', title: 'Paper' }] });

		await Endpoints.searchBulkPapers(makeCtx(), {
			fieldsOfStudy: 'Computer Science',
			year: '2020-2024',
			fields: 'title,year',
		});

		expect(parsed().path).toBe('/graph/v1/paper/search/bulk');
		expect(parsed().query.get('query')).toBeNull();
		expect(parsed().query.get('fieldsOfStudy')).toBe('Computer Science');
		expect(parsed().query.get('year')).toBe('2020-2024');
		expect(parsed().query.get('fields')).toBe('title,year');
	});

	it('papers.matchTitle validates the documented response envelope', async () => {
		mockFetch({
			data: [
				{
					paperId: 'p1',
					title: 'Construction of the Literature Graph in Semantic Scholar',
					matchScore: 0.97,
					year: 2020,
				},
			],
		});

		const out = await Endpoints.paperTitleSearch(makeCtx(), {
			query: 'Construction of the Literature Graph in Semantic Scholar',
			fields: 'title,year',
		});

		expect(parsed().path).toBe('/graph/v1/paper/search/match');
		expect(parsed().query.get('query')).toBe(
			'Construction of the Literature Graph in Semantic Scholar',
		);
		expect(parsed().query.get('fields')).toBe('title,year');
		expect(out.data[0]?.matchScore).toBe(0.97);
		expect(out.data[0]?.year).toBe(2020);
		expect(
			semanticScholarEndpointSchemas['papers.matchTitle'].output.safeParse({
				paperId: 'p1',
				title: 'Top-level paper is not the documented shape',
			}).success,
		).toBe(false);
	});

	it('papers.authors, papers.citations, and papers.references use paginated child paths', async () => {
		mockFetch({
			offset: 0,
			next: 1,
			data: [{ authorId: 'a1', name: 'Author' }],
		});
		await Endpoints.getPaperAuthors(makeCtx(), {
			paperId: 'p1',
			offset: 0,
			limit: 1,
		});
		expect(parsed().path).toBe('/graph/v1/paper/p1/authors');
		expect(parsed().query.get('limit')).toBe('1');

		mockFetch({
			offset: 0,
			data: [{ contexts: ['c'], citingPaper: { paperId: 'p2' } }],
		});
		await Endpoints.getPaperCitations(makeCtx(), { paperId: 'p1' });
		expect(parsed().path).toBe('/graph/v1/paper/p1/citations');

		mockFetch({
			offset: 0,
			data: [{ contexts: ['r'], citedPaper: { paperId: 'p0' } }],
		});
		await Endpoints.getPaperReferences(makeCtx(), { paperId: 'p1' });
		expect(parsed().path).toBe('/graph/v1/paper/p1/references');
	});

	it('authors endpoints use documented search, detail, papers, and batch paths', async () => {
		mockFetch({ total: 1, offset: 0, data: [{ authorId: 'a1', name: 'Ada' }] });
		await Endpoints.searchAuthors(makeCtx(), { query: 'ada', limit: 5 });
		expect(parsed().path).toBe('/graph/v1/author/search');

		mockFetch({ authorId: 'a1', name: 'Ada' });
		await Endpoints.getAuthor(makeCtx(), {
			authorId: 'a1',
			fields: 'name,url',
		});
		expect(parsed().path).toBe('/graph/v1/author/a1');

		mockFetch({ offset: 0, data: [{ paperId: 'p1', title: 'Paper' }] });
		await Endpoints.getAuthorPapers(makeCtx(), { authorId: 'a1', limit: 1 });
		expect(parsed().path).toBe('/graph/v1/author/a1/papers');

		mockFetch([{ authorId: 'a1', name: 'Ada' }]);
		await Endpoints.getAuthorsBatch(makeCtx(), { ids: ['a1'] });
		expect(parsed().path).toBe('/graph/v1/author/batch');
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toBe(JSON.stringify({ ids: ['a1'] }));
	});

	it('recommendations endpoints route to both list and single-paper APIs', async () => {
		mockFetch({ recommendedPapers: [{ paperId: 'p2', title: 'Next' }] });
		await Endpoints.getPaperRecommendations(makeCtx(), {
			positivePaperIds: ['p1'],
			negativePaperIds: ['p0'],
			limit: 10,
		});
		expect(parsed().path).toBe('/recommendations/v1/papers');
		expect(captured?.method).toBe('POST');
		expect(captured?.body).toBe(
			JSON.stringify({
				positivePaperIds: ['p1'],
				negativePaperIds: ['p0'],
			}),
		);

		mockFetch({ recommendedPapers: [{ paperId: 'p3', title: 'Next' }] });
		await Endpoints.getRecommendationsForPaper(makeCtx(), {
			paperId: 'p1',
			from: 'all-cs',
		});
		expect(parsed().path).toBe('/recommendations/v1/papers/forpaper/p1');
		expect(parsed().query.get('from')).toBe('all-cs');
	});

	it('datasets and snippets route to official API families', async () => {
		mockFetch(['2024-01-01']);
		await Endpoints.listDatasetReleases(makeCtx(), {});
		expect(parsed().path).toBe('/datasets/v1/release');

		mockFetch({ release_id: 'latest', datasets: [] });
		await Endpoints.getDatasetRelease(makeCtx(), { releaseId: 'latest' });
		expect(parsed().path).toBe('/datasets/v1/release/latest');

		mockFetch({ name: 'papers', files: ['https://example.com/papers.gz'] });
		await Endpoints.getDataset(makeCtx(), {
			releaseId: 'latest',
			datasetName: 'papers',
		});
		expect(parsed().path).toBe('/datasets/v1/release/latest/dataset/papers');

		mockFetch([{ fromRelease: '2024-01-01', toRelease: '2024-02-01' }]);
		await Endpoints.getDatasetDiffs(makeCtx(), {
			startReleaseId: '2024-01-01',
			endReleaseId: '2024-02-01',
			datasetName: 'papers',
		});
		expect(parsed().path).toBe(
			'/datasets/v1/diffs/2024-01-01/to/2024-02-01/papers',
		);

		mockFetch({
			data: [{ score: 1, paper: { corpusId: 1, title: 'Paper' }, snippet: {} }],
		});
		await Endpoints.searchTextSnippets(makeCtx(), {
			query: 'literature graph',
			limit: 1,
			fields: 'snippet.text',
		});
		expect(parsed().path).toBe('/graph/v1/snippet/search');
		expect(parsed().query.get('fields')).toBe('snippet.text');
	});

	it('rejects invalid input before calling Semantic Scholar', async () => {
		mockFetch({ data: [] });
		await expect(
			Endpoints.getPapersBatch(makeCtx(), { ids: Array(501).fill('p1') }),
		).rejects.toThrow();
		expect(captured).toBeUndefined();
	});

	it('rejects responses that fail the output schema', async () => {
		mockFetch({ data: 'not-an-array' });
		await expect(
			Endpoints.searchAuthors(makeCtx(), { query: 'ada' }),
		).rejects.toThrow();
	});

	it('covers every registered operation', () => {
		const expected = [
			'authors.batchGet',
			'authors.get',
			'authors.listPapers',
			'authors.search',
			'datasets.get',
			'datasets.getDiffs',
			'datasets.getRelease',
			'datasets.listReleases',
			'papers.autocomplete',
			'papers.batchGet',
			'papers.get',
			'papers.listAuthors',
			'papers.listCitations',
			'papers.listReferences',
			'papers.matchTitle',
			'papers.relevanceSearch',
			'papers.search',
			'papers.searchBulk',
			'recommendations.forPaper',
			'recommendations.fromPaperLists',
			'snippets.searchText',
		];
		expect(Object.keys(semanticScholarEndpointMeta).sort()).toEqual(expected);
		expect(Object.keys(semanticScholarEndpointSchemas).sort()).toEqual(
			expected,
		);
		expect(mockLogEvent).toBeDefined();
	});
});
