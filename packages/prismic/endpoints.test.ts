import * as client from './client';
import { PrismicAPIError } from './client';
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
const ctx = buildContext();

beforeEach(() => {
	mockedRequest.mockReset();
});

describe('response parsing', () => {
	it('accepts a field Prismic adds and keeps it on the result', async () => {
		mockedRequest.mockResolvedValue({
			refs: [{ id: 'master', ref: 'abc', brand_new_field: 'x' }],
		});

		const result = await Content.info(ctx, {});

		expect(result.refs[0]).toMatchObject({ brand_new_field: 'x' });
	});

	it('rejects a repository answer whose refs is not an array', async () => {
		mockedRequest.mockResolvedValue({ refs: 'nope' });

		await expect(Content.info(ctx, {})).rejects.toThrow();
	});

	it('rejects a repository answer that omits refs, which every query needs', async () => {
		mockedRequest.mockResolvedValue({ types: {} });

		await expect(Content.info(ctx, {})).rejects.toThrow();
	});

	it('accepts a search page with no next_page on the last page', async () => {
		mockedRequest.mockResolvedValue({
			page: 267,
			results_per_page: 2,
			total_results_size: 533,
			total_pages: 267,
			next_page: null,
			prev_page:
				'https://my-cafe.cdn.prismic.io/api/v2/documents/search?page=266',
			results: [],
		});

		const result = await Content.search(ctx, {});

		expect(result.next_page).toBeNull();
		expect(result.results).toEqual([]);
	});

	it('rejects a page whose results is not an array', async () => {
		mockedRequest.mockResolvedValue({ results: 'nope' });

		await expect(Content.search(ctx, {})).rejects.toThrow();
	});

	it('keeps a document body of arbitrary shape, which the custom type defines', async () => {
		mockedRequest.mockResolvedValue({
			id: 'doc_1',
			type: 'page',
			data: {
				title: 'Hello',
				price: 55,
				published: true,
				nothing: null,
				rich_text: [{ type: 'paragraph', text: 'Hi', spans: [] }],
				group: [{ price: 10 }, { price: 20 }],
			},
		});

		const result = await Content.get(ctx, { id: 'doc_1' });

		expect(result.data).toMatchObject({
			title: 'Hello',
			price: 55,
			rich_text: [{ type: 'paragraph', text: 'Hi' }],
		});
	});

	it('accepts a document with no url, which a type with no route returns', async () => {
		mockedRequest.mockResolvedValue({
			id: 'doc_1',
			type: 'settings',
			url: null,
		});

		const result = await Content.get(ctx, { id: 'doc_1' });

		expect(result.url).toBeNull();
	});

	it('rejects a document whose tags is not an array of strings', async () => {
		mockedRequest.mockResolvedValue({ id: 'doc_1', tags: [{ name: 'Red' }] });

		await expect(Content.get(ctx, { id: 'doc_1' })).rejects.toThrow();
	});

	it('accepts a migration answer that echoes only the new id', async () => {
		mockedRequest.mockResolvedValue({ id: 'doc_new' });

		const result = await Migration.create(ctx, {
			title: 'Hi',
			type: 'page',
			lang: 'en-us',
			data: {},
		});

		expect(result.id).toBe('doc_new');
	});

	it('rejects a migration answer whose id is a number', async () => {
		mockedRequest.mockResolvedValue({ id: 42 });

		await expect(
			Migration.create(ctx, {
				title: 'Hi',
				type: 'page',
				lang: 'en-us',
				data: {},
			}),
		).rejects.toThrow();
	});
});

describe('input validation before the request', () => {
	it('rejects a migration create with no title', async () => {
		await expect(
			Migration.create(ctx, {
				type: 'page',
				lang: 'en-us',
				data: {},
			} as never),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a migration create with no type', async () => {
		await expect(
			Migration.create(ctx, {
				title: 'Hi',
				lang: 'en-us',
				data: {},
			} as never),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a migration update that changes nothing', async () => {
		await expect(Migration.update(ctx, { id: 'doc_1' })).rejects.toThrow(
			/Supply data, title, tags or uid/,
		);
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a migration update that changes only the tags', async () => {
		mockedRequest.mockResolvedValue({ id: 'doc_1' });

		await expect(
			Migration.update(ctx, { id: 'doc_1', tags: ['Red'] }),
		).resolves.toBeDefined();
	});

	it('rejects a repository id that cannot be a host label', async () => {
		await expect(
			Content.info(ctx, { repository: 'My Cafe' }),
		).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('accepts a repository id with digits and hyphens', async () => {
		mockedRequest.mockResolvedValue({ refs: [] });

		await expect(
			Content.info(ctx, { repository: 'my-cafe-2026' }),
		).resolves.toBeDefined();
	});

	it('rejects an empty tag in a search', async () => {
		await expect(Content.search(ctx, { tags: [''] })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('rejects a page number below 1', async () => {
		await expect(Content.search(ctx, { page: 0 })).rejects.toThrow();
		expect(mockedRequest).not.toHaveBeenCalled();
	});

	it('surfaces a field rejection as an error a handler can match', async () => {
		mockedRequest.mockRejectedValue(
			new PrismicAPIError('Prismic 400: title: The value must be a string', {
				status: 400,
				method: 'POST',
				fieldErrors: [
					{ property: 'title', error: 'The value must be a string' },
				],
			}),
		);

		const error = await captureError(
			Migration.create(ctx, {
				title: 'Hi',
				type: 'page',
				lang: 'en-us',
				data: {},
			}),
		);

		expect(error).toBeInstanceOf(PrismicAPIError);
		expect(error).toMatchObject({
			status: 400,
			fieldErrors: [{ property: 'title' }],
		});
	});
});
