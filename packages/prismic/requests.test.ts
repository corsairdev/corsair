import { AuthMissingError, logEventFromContext } from 'corsair/core';
import * as client from './client';
import { Content, Migration } from './endpoints';
import { buildContext, captureError } from './test-helpers';

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

describe('credentials', () => {
	it("sends the account's key (ctx.key) as the migration write token", async () => {
		mockedRequest.mockResolvedValue({ id: 'doc_1' });

		await Migration.create(buildContext({ apiKey: 'stored-write-token' }), {
			title: 'Hi',
			type: 'page',
			lang: 'en-us',
			data: {},
		});

		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			repository: 'my-cafe',
			writeToken: 'stored-write-token',
		});
	});

	it('reads the repository and access token stored on the account when no option is set', async () => {
		mockedRequest.mockResolvedValue({ refs: [] });

		await Content.info(
			buildContext({
				repository: null,
				storedRepository: 'tenant-repo',
				storedAccessToken: 'tenant-access-token',
			}),
			{},
		);

		expect(mockedRequest.mock.calls[0]?.[0]).toMatchObject({
			repository: 'tenant-repo',
			accessToken: 'tenant-access-token',
		});
	});

	it('raises AuthMissingError naming the repository when none is set anywhere', async () => {
		const error = await captureError(
			Content.info(buildContext({ repository: null }), {}),
		);

		expect(error).toBeInstanceOf(AuthMissingError);
		expect(String(error)).toContain('repository');
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('refuses a stored repository that is not a host label, before any request', async () => {
		await expect(
			Content.info(
				buildContext({ repository: null, storedRepository: 'evil.com/x#' }),
				{},
			),
		).rejects.toThrow(/lowercase letters, digits and hyphens/);
		expect(mockedRequest).not.toHaveBeenCalled();
	});
});

describe('documents endpoints', () => {
	it('documents.search sends every documented query field, tags as a predicate', async () => {
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

		// A given ref is used as is, so only the search is sent.
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(sentRequest()).toEqual({
			method: 'GET',
			api: 'content',
			url: '/documents/search',
			query: {
				ref: 'X47BMBAAACAAVh4N',
				// Prismic has no `tags` parameter; the filter is a predicate in `q`.
				q: '[[at(document.type, "page")][at(document.tags,["Red","Blue"])]]',
				page: 1,
				pageSize: 2,
				orderings: '[my.page.date desc]',
				lang: 'en-us',
				after: 'cursor-1',
			},
		});
	});

	it('documents.search reads the master ref first when no ref is given', async () => {
		mockedRequest
			.mockResolvedValueOnce({
				refs: [
					{ id: 'release', ref: 'release-ref', isMasterRef: false },
					{ id: 'master', ref: 'master-ref', isMasterRef: true },
				],
			})
			.mockResolvedValueOnce({ results: [] });

		await Content.search(ctx, { tags: ['Red'] });

		expect(sentRequest(0)).toEqual({ method: 'GET', api: 'content', url: '' });
		expect(sentRequest(1)).toMatchObject({
			url: '/documents/search',
			query: { ref: 'master-ref', q: '[[at(document.tags,["Red"])]]' },
		});
	});

	it('documents.search follows nextPage as the whole request', async () => {
		mockedRequest.mockResolvedValue({ results: [] });

		await Content.search(ctx, {
			nextPage:
				'https://my-cafe.cdn.prismic.io/api/v2/documents/search?ref=X47BMBAAACAAVh4N&page=2&pageSize=2',
		});

		// No ref lookup: the next page already carries its ref.
		expect(mockedRequest).toHaveBeenCalledTimes(1);
		expect(sentRequest()).toEqual({
			method: 'GET',
			api: 'content',
			url: '/documents/search',
			query: { ref: 'X47BMBAAACAAVh4N', page: '2', pageSize: '2' },
		});
	});

	it('documents.get searches on document.id at the master ref, in any locale', async () => {
		mockedRequest
			.mockResolvedValueOnce({
				refs: [{ id: 'master', ref: 'master-ref', isMasterRef: true }],
			})
			.mockResolvedValueOnce({
				results: [
					{
						id: 'ZMI65RQAADkECUFM',
						type: 'page',
						lang: 'en-us',
						data: { title: 'Hello' },
					},
				],
			});

		const result = await Content.get(ctx, { id: 'ZMI65RQAADkECUFM' });

		// The Content API has no /documents/:id route.
		expect(sentRequest(1)).toEqual({
			method: 'GET',
			api: 'content',
			url: '/documents/search',
			query: {
				ref: 'master-ref',
				q: '[[at(document.id,"ZMI65RQAADkECUFM")]]',
				lang: '*',
				pageSize: 1,
			},
		});
		expect(result.type).toBe('page');
	});

	it('documents.get reports an id with no published document', async () => {
		mockedRequest.mockResolvedValue({ results: [] });

		await expect(
			Content.get(ctx, { id: 'ZMI65RQAADkECUFM', ref: 'some-ref' }),
		).rejects.toThrow(/No published document with id ZMI65RQAADkECUFM/);
	});

	it('documents.get refuses an id that could break out of the predicate', async () => {
		await expect(
			Content.get(ctx, { id: 'x")][at(document.type,"secret' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
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
			data: { summary: 'Updated text' },
		});

		expect(sentRequest()).toEqual({
			method: 'PUT',
			api: 'migration',
			url: '/documents/ZMI65RQAADkECUFM/',
			body: {
				uid: undefined,
				data: { summary: 'Updated text' },
				title: 'Updated title',
				tags: undefined,
			},
		});
	});
});
