import { logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Content, Migration } from './endpoints';
import { buildContext } from './test-helpers';

jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn() };
});

jest.mock('./client', () => {
	const actual = jest.requireActual('./client');
	return { ...actual, makePrismicRequest: jest.fn() };
});

const mockedRequest = jest.mocked(client.makePrismicRequest);
const mockedLog = jest.mocked(logEventFromContext);

const ctx = buildContext();

/** The request the endpoint handed the client. */
function sentRequest(index = -1) {
	const call = mockedRequest.mock.calls.at(index);
	if (!call) throw new Error('no request was sent');
	return call[1];
}

beforeEach(() => {
	mockedRequest.mockReset();
	mockedLog.mockReset();
});

describe('repository endpoints', () => {
	it('repository.info reads the repository metadata', async () => {
		mockedRequest.mockResolvedValue({
			refs: [{ id: 'master', ref: 'X47BMBAAACAAVh4N', isMasterRef: true }],
			types: { page: 'Page' },
			languages: [{ id: 'en-us', name: 'English - United States' }],
			tags: [],
			license: 'All Rights Reserved',
		});

		const result = await Content.info(ctx, {});

		expect(sentRequest()).toEqual({
			method: 'GET',
			api: 'content',
			url: '',
		});
		expect(result.refs).toHaveLength(1);
		expect(result.types).toEqual({ page: 'Page' });
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'prismic.repository.info',
			{ refs: 1, types: 1 },
			'completed',
		);
	});

	it('repository.info uses the per-call repository override', async () => {
		mockedRequest.mockResolvedValue({ refs: [] });

		await Content.info(ctx, { repository: 'another-repo' });

		expect(mockedRequest.mock.calls[0]?.[0].repository).toBe('another-repo');
	});
});

describe('documents endpoints', () => {
	it('documents.search sends every documented query field', async () => {
		mockedRequest.mockResolvedValue({
			page: 1,
			pageSize: 2,
			total_results_size: 533,
			total_pages: 267,
			next_page:
				'https://my-cafe.cdn.prismic.io/api/v2/documents/search?ref=abc&page=2',
			results: [],
		});

		await Content.search(ctx, {
			page: 1,
			pageSize: 2,
			orderings: '[my.page.date desc]',
			q: '[[at(document.type, "page")]]',
			lang: 'en-us',
			tags: ['Red', 'Blue'],
			after: 'cursor-1',
			ref: 'X47BMBAAACAAVh4N',
		});

		expect(sentRequest()).toEqual({
			method: 'GET',
			api: 'content',
			url: '/documents/search',
			query: {
				page: 1,
				pageSize: 2,
				orderings: '[my.page.date desc]',
				q: '[[at(document.type, "page")]]',
				lang: 'en-us',
				tags: ['Red', 'Blue'],
				after: 'cursor-1',
				ref: 'X47BMBAAACAAVh4N',
			},
		});
	});

	it('documents.search follows nextPage as the whole request', async () => {
		mockedRequest.mockResolvedValue({ results: [] });

		await Content.search(ctx, {
			nextPage:
				'https://my-cafe.cdn.prismic.io/api/v2/documents/search?ref=X47BMBAAACAAVh4N&page=2&pageSize=2',
		});

		const request = sentRequest();
		expect(request?.api).toBe('content');
		// Only the path and query survive, so the call stays on the repository host.
		expect(request?.url).toBe(
			'/api/v2/documents/search?ref=X47BMBAAACAAVh4N&page=2&pageSize=2',
		);
		expect(request?.query).toBeUndefined();
	});

	it('documents.get reads one document by path', async () => {
		mockedRequest.mockResolvedValue({
			id: 'ZMI65RQAADkECUFM',
			type: 'page',
			lang: 'en-us',
			data: { title: 'Hello' },
		});

		const result = await Content.get(ctx, { id: 'ZMI65RQAADkECUFM' });

		expect(sentRequest()).toEqual({
			method: 'GET',
			api: 'content',
			url: '/documents/ZMI65RQAADkECUFM',
			query: { ref: undefined, lang: undefined },
		});
		expect(result.type).toBe('page');
	});
});

describe('migration endpoints', () => {
	it('migration.create posts the documented body to the migration API', async () => {
		mockedRequest.mockResolvedValue({
			id: 'doc_new',
			uid: 'example-page',
			type: 'page',
			lang: 'en-us',
		});

		const result = await Migration.create(ctx, {
			title: 'Example page',
			type: 'page',
			uid: 'example-page',
			lang: 'en-us',
			tags: ['Red'],
			data: { title: 'Hello' },
		});

		expect(sentRequest()).toEqual({
			method: 'POST',
			api: 'migration',
			url: '/documents',
			body: {
				title: 'Example page',
				type: 'page',
				uid: 'example-page',
				lang: 'en-us',
				data: { title: 'Hello' },
				tags: ['Red'],
				alternate_language_id: undefined,
			},
		});
		expect(result.id).toBe('doc_new');
		expect(mockedLog).toHaveBeenCalledWith(
			ctx,
			'prismic.migration.create',
			{ documentId: 'doc_new', type: 'page', lang: 'en-us' },
			'completed',
		);
	});

	it('migration.update puts to the trailing-slash path Prismic documents', async () => {
		mockedRequest.mockResolvedValue({ id: 'doc_1' });

		await Migration.update(ctx, {
			id: 'ZMI65RQAADkECUFM',
			title: 'Updated title',
		});

		expect(sentRequest()).toEqual({
			method: 'PUT',
			api: 'migration',
			url: '/documents/ZMI65RQAADkECUFM/',
			body: {
				uid: undefined,
				data: undefined,
				title: 'Updated title',
				tags: undefined,
			},
		});
	});
});
