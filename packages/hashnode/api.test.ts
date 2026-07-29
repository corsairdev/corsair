import { logEventFromContext } from 'corsair/core';
import { request } from 'corsair/http';
import { HashnodeAPIError } from './client';
import * as Comments from './endpoints/comments';
import * as Drafts from './endpoints/drafts';
import * as Feed from './endpoints/feed';
import * as Images from './endpoints/images';
import * as Pages from './endpoints/pages';
import * as Posts from './endpoints/posts';
import * as Publications from './endpoints/publications';
import * as Series from './endpoints/series';
import * as Tags from './endpoints/tags';
import * as Users from './endpoints/users';
import type { HashnodeContext } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

jest.mock('corsair/core', () => {
	const original = jest.requireActual('corsair/core');
	return {
		...original,
		logEventFromContext: jest.fn().mockResolvedValue(null),
	};
});

const mockRequest = request as jest.MockedFunction<typeof request>;
const mockLog = logEventFromContext as jest.MockedFunction<
	typeof logEventFromContext
>;

function makeCtx(key = 'test-pat'): HashnodeContext {
	return { key } as unknown as HashnodeContext;
}

function mockData(data: unknown) {
	mockRequest.mockResolvedValue({ data });
}

describe('hashnode endpoint invocation', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
		mockLog.mockResolvedValue(null);
	});

	it('me routes to GraphQL and parses the response', async () => {
		mockData({
			me: { id: 'u1', name: 'Test', username: 'test', email: 't@example.com' },
		});
		const result = await Users.me(makeCtx(), undefined as never);
		expect(mockRequest).toHaveBeenCalledTimes(1);
		expect(result.me.id).toBe('u1');
	});

	it('publications.get parses host lookup', async () => {
		mockData({
			publication: {
				id: 'p1',
				title: 'Blog',
				url: 'https://blog.hashnode.dev',
			},
		});
		const result = await Publications.get(makeCtx(), {
			host: 'blog.hashnode.dev',
		});
		expect(result.publication?.id).toBe('p1');
	});

	it('publications.list passes pagination variables', async () => {
		mockData({
			me: {
				publications: {
					edges: [
						{
							node: {
								id: 'p1',
								title: 'Blog',
								url: 'https://blog.hashnode.dev',
							},
							cursor: 'c1',
						},
					],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		});
		await Publications.list(makeCtx(), { first: 5, after: 'cursor' });
		const body = mockRequest.mock.calls[0]?.[1]?.body as {
			variables: Record<string, unknown>;
		};
		expect(body.variables).toMatchObject({ first: 5, after: 'cursor' });
	});

	it('posts.get / getBySlug / list / search / publish / update invoke transport', async () => {
		const post = {
			id: 'post1',
			title: 'Hello',
			slug: 'hello',
			brief: 'b',
			url: 'https://blog.hashnode.dev/hello',
			publishedAt: '2024-01-01T00:00:00Z',
			readTimeInMinutes: 1,
			reactionCount: 0,
			responseCount: 0,
		};

		mockData({ post });
		expect((await Posts.get(makeCtx(), { id: 'post1' })).post?.id).toBe(
			'post1',
		);

		mockData({ publication: { post } });
		expect(
			(
				await Posts.getBySlug(makeCtx(), {
					host: 'blog.hashnode.dev',
					slug: 'hello',
				})
			).publication.post?.id,
		).toBe('post1');

		mockData({
			publication: {
				posts: {
					edges: [{ node: post, cursor: 'c1' }],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		});
		expect(
			(await Posts.list(makeCtx(), { host: 'blog.hashnode.dev', first: 10 }))
				.publication.posts.edges,
		).toHaveLength(1);

		mockData({
			searchPostsOfPublication: {
				edges: [{ node: post, cursor: 'c1' }],
				pageInfo: { hasNextPage: false, endCursor: null },
			},
		});
		await Posts.search(makeCtx(), {
			first: 10,
			filter: { query: 'hello', publicationId: 'pub1' },
		});

		mockData({ publishPost: { post } });
		await Posts.publish(makeCtx(), {
			title: 'Hello',
			contentMarkdown: '# hi',
			publicationId: 'pub1',
		} as never);

		mockData({ updatePost: { post } });
		await Posts.update(makeCtx(), {
			id: 'post1',
			title: 'Hello 2',
		} as never);

		expect(mockRequest.mock.calls.length).toBeGreaterThanOrEqual(6);
	});

	it('pages.list and series.list send first/after and require pageInfo', async () => {
		mockData({
			publication: {
				staticPages: {
					edges: [
						{
							node: { id: 'page1', title: 'About', slug: 'about' },
							cursor: 'c1',
						},
					],
					pageInfo: { hasNextPage: true, endCursor: 'c1' },
				},
			},
		});
		const pages = await Pages.listPages(makeCtx(), {
			host: 'blog.hashnode.dev',
			first: 20,
			after: 'prev',
		});
		expect(pages.publication.staticPages.pageInfo.hasNextPage).toBe(true);
		const pageVars = (
			mockRequest.mock.calls.at(-1)?.[1]?.body as {
				variables: Record<string, unknown>;
			}
		).variables;
		expect(pageVars).toMatchObject({
			host: 'blog.hashnode.dev',
			first: 20,
			after: 'prev',
		});

		mockData({
			publication: {
				seriesList: {
					edges: [
						{
							node: { id: 's1', name: 'Series', slug: 'series' },
							cursor: 'c2',
						},
					],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		});
		const series = await Series.listSeries(makeCtx(), {
			host: 'blog.hashnode.dev',
			first: 15,
		});
		expect(series.publication.seriesList.edges[0]?.node.id).toBe('s1');
	});

	it('rejects responses that fail the output schema', async () => {
		mockData({ me: { id: 123 } });
		await expect(Users.me(makeCtx(), undefined as never)).rejects.toThrow();
	});

	it('surfaces GraphQL errors from the provider envelope', async () => {
		mockRequest.mockResolvedValue({
			errors: [{ message: 'Cannot query field "x"' }],
		});
		await expect(
			Users.me(makeCtx(), undefined as never),
		).rejects.toBeInstanceOf(HashnodeAPIError);
	});

	it('covers remaining endpoint groups', async () => {
		mockData({
			user: { id: 'u1', name: 'Test', username: 'test' },
		});
		await Users.getUser(makeCtx(), { username: 'test' });

		mockData({ tag: { id: 't1', name: 'JS', slug: 'javascript' } });
		await Tags.getTag(makeCtx(), { slug: 'javascript' });

		mockData({
			publication: {
				staticPage: { id: 'page1', title: 'About', slug: 'about' },
			},
		});
		await Pages.getPage(makeCtx(), {
			host: 'blog.hashnode.dev',
			slug: 'about',
		});

		mockData({ series: { id: 's1', name: 'Series', slug: 'series' } });
		await Series.getSeries(makeCtx(), { slug: 'series' });

		mockData({
			feed: {
				edges: [],
				pageInfo: { hasNextPage: false, endCursor: null },
			},
		});
		await Feed.feed(makeCtx(), { first: 5 });

		mockData({
			post: {
				comments: {
					edges: [],
					pageInfo: { hasNextPage: false, endCursor: null },
				},
			},
		});
		await Comments.listPostComments(makeCtx(), { postId: 'post1', first: 5 });

		mockData({
			draft: {
				id: 'd1',
				updatedAt: '2024-01-01T00:00:00Z',
				author: { id: 'u1', name: 'Test', username: 'test' },
			},
		});
		await Drafts.get(makeCtx(), { id: 'd1' });

		mockData({
			createDraft: {
				draft: {
					id: 'd1',
					updatedAt: '2024-01-01T00:00:00Z',
					author: { id: 'u1', name: 'Test', username: 'test' },
				},
			},
		});
		await Drafts.create(makeCtx(), {
			title: 'Draft',
			contentMarkdown: '# hi',
			publicationId: 'pub1',
		} as never);

		mockData({
			updateDraft: {
				draft: {
					id: 'd1',
					updatedAt: '2024-01-01T00:00:00Z',
					author: { id: 'u1', name: 'Test', username: 'test' },
				},
			},
		});
		await Drafts.update(makeCtx(), { id: 'd1', title: 'Draft 2' } as never);

		mockData({
			publishDraft: {
				post: {
					id: 'post1',
					title: 'Hello',
					slug: 'hello',
					brief: 'b',
					url: 'https://blog.hashnode.dev/hello',
					publishedAt: '2024-01-01T00:00:00Z',
					readTimeInMinutes: 1,
					reactionCount: 0,
					responseCount: 0,
				},
			},
		});
		await Drafts.publish(makeCtx(), { draftId: 'd1' } as never);

		mockData({ deleteDraft: { draft: { id: 'd1' } } });
		await Drafts.deleteDraft(makeCtx(), { draftId: 'd1' });

		mockData({
			createImageUploadURL: {
				presignedPost: {
					url: 'https://upload.example.com',
					fields: { key: 'value' },
				},
			},
		});
		await Images.createImageUploadURL(makeCtx(), { contentType: 'image/png' });

		expect(mockRequest.mock.calls.length).toBeGreaterThanOrEqual(12);
	});
});
