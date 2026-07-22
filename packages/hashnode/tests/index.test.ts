import { HashnodeAPIError } from '../client';
import {
	HashnodeEndpointInputSchemas,
	HashnodeEndpointOutputSchemas,
} from '../endpoints/types';
import { errorHandlers } from '../error-handlers';
import { redactEventPayload } from '../event-payload';
import { hashnode, hashnodeAuthConfig } from '../index';

describe('Hashnode Plugin', () => {
	describe('hashnode()', () => {
		it('creates a plugin with default api_key auth', () => {
			const plugin = hashnode();
			expect(plugin.id).toBe('hashnode');
			expect(plugin.options?.authType).toBe('api_key');
		});

		it('creates a plugin with provided API key', () => {
			const plugin = hashnode({ key: 'test-pat-123' });
			expect(plugin.id).toBe('hashnode');
			expect(plugin.options?.key).toBe('test-pat-123');
		});

		it('has correct plugin metadata', () => {
			const plugin = hashnode();
			expect(plugin.endpoints).toBeDefined();
			expect(plugin.endpointMeta).toBeDefined();
			expect(plugin.endpointSchemas).toBeDefined();
			expect(plugin.schema).toBeDefined();
		});

		it('returns an error handler map', () => {
			const plugin = hashnode();
			expect(plugin.errorHandlers).toBeDefined();
		});

		it('has a functioning keyBuilder', () => {
			const plugin = hashnode();
			expect(plugin.keyBuilder).toBeDefined();
			expect(typeof plugin.keyBuilder).toBe('function');
		});
	});

	describe('endpoint structure', () => {
		it('has all required endpoint groups', () => {
			const plugin = hashnode();
			const endpoints = plugin.endpoints as Record<string, unknown>;

			expect(endpoints).toHaveProperty('me');
			expect(endpoints).toHaveProperty('publications');
			expect(endpoints).toHaveProperty('posts');
			expect(endpoints).toHaveProperty('comments');
			expect(endpoints).toHaveProperty('users');
			expect(endpoints).toHaveProperty('tags');
			expect(endpoints).toHaveProperty('series');
			expect(endpoints).toHaveProperty('pages');
			expect(endpoints).toHaveProperty('feed');
			expect(endpoints).toHaveProperty('drafts');
			expect(endpoints).toHaveProperty('images');
		});

		it('has all post sub-endpoints', () => {
			const plugin = hashnode();
			const posts = (plugin.endpoints as Record<string, unknown>)
				.posts as Record<string, unknown>;

			expect(posts).toHaveProperty('get');
			expect(posts).toHaveProperty('getBySlug');
			expect(posts).toHaveProperty('list');
			expect(posts).toHaveProperty('search');
			expect(posts).toHaveProperty('publish');
			expect(posts).toHaveProperty('update');
		});

		it('has comments list endpoint', () => {
			const plugin = hashnode();
			const comments = (plugin.endpoints as Record<string, unknown>)
				.comments as Record<string, unknown>;

			expect(comments).toHaveProperty('list');
			expect(Object.keys(comments)).toHaveLength(1);
		});

		it('has all publications sub-endpoints', () => {
			const plugin = hashnode();
			const publications = (plugin.endpoints as Record<string, unknown>)
				.publications as Record<string, unknown>;

			expect(publications).toHaveProperty('get');
			expect(publications).toHaveProperty('list');
		});

		it('has all draft sub-endpoints', () => {
			const plugin = hashnode();
			const drafts = (plugin.endpoints as Record<string, unknown>)
				.drafts as Record<string, unknown>;

			expect(drafts).toHaveProperty('get');
			expect(drafts).toHaveProperty('create');
			expect(drafts).toHaveProperty('update');
			expect(drafts).toHaveProperty('publish');
			expect(drafts).toHaveProperty('delete');
		});

		it('has feed and images endpoints', () => {
			const plugin = hashnode();
			const endpoints = plugin.endpoints as Record<string, unknown>;

			expect(endpoints.feed as Record<string, unknown>).toHaveProperty('list');
			expect(endpoints.images as Record<string, unknown>).toHaveProperty(
				'createUploadURL',
			);
		});

		it('has empty bound webhooks', () => {
			const plugin = hashnode();
			expect(plugin.webhooks).toBeDefined();
			expect(plugin.webhooks).toEqual({});
		});
	});

	describe('endpoint metadata', () => {
		it('every endpoint has riskLevel and description', () => {
			const plugin = hashnode();
			const meta = plugin.endpointMeta as Record<
				string,
				{ riskLevel: string; description?: string }
			>;

			for (const [path, entry] of Object.entries(meta)) {
				expect(entry).toHaveProperty('riskLevel');
				expect(['read', 'write', 'destructive']).toContain(entry.riskLevel);
				expect(entry).toHaveProperty('description');
				expect(typeof entry.description).toBe('string');
			}
		});

		it('drafts.delete is marked as destructive and irreversible', () => {
			const plugin = hashnode();
			const meta = plugin.endpointMeta as Record<
				string,
				{ riskLevel: string; irreversible?: boolean }
			>;
			const deleteMeta = meta['drafts.delete'] as
				| { riskLevel: string; irreversible?: boolean }
				| undefined;
			expect(deleteMeta?.riskLevel).toBe('destructive');
			expect(deleteMeta?.irreversible).toBe(true);
		});
	});

	describe('authConfig', () => {
		it('only has api_key auth type', () => {
			expect(hashnodeAuthConfig).toHaveProperty('api_key');
			expect(hashnodeAuthConfig).not.toHaveProperty('oauth_2');
		});
	});

	describe('error handlers', () => {
		it('defines all expected error handler types', () => {
			const handlerTypes = Object.keys(errorHandlers);
			expect(handlerTypes).toContain('RATE_LIMIT_ERROR');
			expect(handlerTypes).toContain('AUTH_ERROR');
			expect(handlerTypes).toContain('NOT_FOUND_ERROR');
			expect(handlerTypes).toContain('PERMISSION_ERROR');
			expect(handlerTypes).toContain('VALIDATION_ERROR');
			expect(handlerTypes).toContain('GRAPHQL_ERROR');
			expect(handlerTypes).toContain('NETWORK_ERROR');
			expect(handlerTypes).toContain('DEFAULT');
		});

		it('each handler has match and handler functions', () => {
			for (const [type, handler] of Object.entries(errorHandlers)) {
				expect(typeof handler.match).toBe('function');
				expect(typeof handler.handler).toBe('function');
			}
		});

		it('RATE_LIMIT_ERROR matches 429 status codes', () => {
			const rateLimitHandler = errorHandlers.RATE_LIMIT_ERROR;
			const mockError = new Error('Too many requests - 429');

			expect(rateLimitHandler.match(mockError, {} as any)).toBe(true);
		});

		it('AUTH_ERROR matches unauthorized errors', () => {
			const authHandler = errorHandlers.AUTH_ERROR;
			expect(authHandler.match(new Error('unauthorized'), {} as any)).toBe(
				true,
			);
			expect(authHandler.match(new Error('invalid pat'), {} as any)).toBe(true);
			expect(authHandler.match(new Error('valid error'), {} as any)).toBe(
				false,
			);
		});

		it('PERMISSION_ERROR matches pro plan errors', () => {
			const permHandler = errorHandlers.PERMISSION_ERROR;
			expect(
				permHandler.match(
					new Error('Publication does not have an active Pro plan'),
					{} as any,
				),
			).toBe(true);
		});

		it('DEFAULT handler always matches', () => {
			const defaultHandler = errorHandlers.DEFAULT;
			expect(defaultHandler.match(new Error('anything'), {} as any)).toBe(true);
		});

		it('RATE_LIMIT_ERROR handler returns maxRetries 5', async () => {
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				new Error('test'),
				{} as any,
			);
			expect(result.maxRetries).toBe(5);
		});

		it('AUTH_ERROR handler returns maxRetries 0', async () => {
			const result = await errorHandlers.AUTH_ERROR.handler(
				new Error('test'),
				{} as any,
			);
			expect(result.maxRetries).toBe(0);
		});

		it('NETWORK_ERROR handler returns maxRetries 3', async () => {
			const result = await errorHandlers.NETWORK_ERROR.handler(
				new Error('test'),
				{} as any,
			);
			expect(result.maxRetries).toBe(3);
		});
	});

	describe('HashnodeAPIError enriched fields', () => {
		it('carries status, retryAfter, body, and cause from ApiError', () => {
			const cause = new Error('underlying error');
			const err = new HashnodeAPIError(
				'rate limited',
				undefined,
				429,
				5000,
				{ detail: 'slow down' },
				{ cause },
			);
			expect(err.status).toBe(429);
			expect(err.retryAfter).toBe(5000);
			expect(err.body).toEqual({ detail: 'slow down' });
			expect(err.cause).toBe(cause);
			expect(err.name).toBe('HashnodeAPIError');
		});

		it('RATE_LIMIT_ERROR handler extracts retryAfter from HashnodeAPIError', async () => {
			const err = new HashnodeAPIError('too fast', undefined, 429, 3000);
			const result = await errorHandlers.RATE_LIMIT_ERROR.handler(
				err,
				{} as any,
			);
			expect(result.maxRetries).toBe(5);
			expect(result.headersRetryAfterMs).toBe(3000);
		});

		it('RATE_LIMIT_ERROR match recognizes HashnodeAPIError with status 429', () => {
			const err = new HashnodeAPIError('rate limit', undefined, 429);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(err, {} as any)).toBe(true);
		});

		it('AUTH_ERROR match recognizes HashnodeAPIError with status 401', () => {
			const err = new HashnodeAPIError('unauthenticated', undefined, 401);
			expect(errorHandlers.AUTH_ERROR.match(err, {} as any)).toBe(true);
		});

		it('NOT_FOUND_ERROR match recognizes HashnodeAPIError with status 404', () => {
			const err = new HashnodeAPIError('missing', undefined, 404);
			expect(errorHandlers.NOT_FOUND_ERROR.match(err, {} as any)).toBe(true);
		});

		it('PERMISSION_ERROR match recognizes HashnodeAPIError with status 403', () => {
			const err = new HashnodeAPIError('forbidden', undefined, 403);
			expect(errorHandlers.PERMISSION_ERROR.match(err, {} as any)).toBe(true);
		});
	});

	describe('redactEventPayload', () => {
		it('replaces contentMarkdown with contentMarkdownLength', () => {
			const result = redactEventPayload({
				title: 'My Post',
				publicationId: 'pub1',
				contentMarkdown: '# Hello\nThis is a long post',
			});
			expect(result).not.toHaveProperty('contentMarkdown');
			expect(result.contentMarkdownLength).toBe(27);
			expect(result.title).toBe('My Post');
			expect(result.publicationId).toBe('pub1');
		});

		it('replaces multiple sensitive fields', () => {
			const result = redactEventPayload({
				title: 'Test',
				contentMarkdown: 'short',
				htmlContent: '<p>short</p>',
			});
			expect(result.contentMarkdownLength).toBe(5);
			expect(result.htmlContentLength).toBe(12);
			expect(result.title).toBe('Test');
		});

		it('preserves safe small fields unchanged', () => {
			const result = redactEventPayload({
				id: 'abc123',
				host: 'blog.hashnode.dev',
				slug: 'hello-world',
				first: 10,
			});
			expect(result).toEqual({
				id: 'abc123',
				host: 'blog.hashnode.dev',
				slug: 'hello-world',
				first: 10,
			});
		});

		it('handles null/undefined input gracefully', () => {
			const result = redactEventPayload({} as Record<string, unknown>);
			expect(result).toEqual({});
		});
	});

	describe('input schemas', () => {
		it('PostByIdInputSchema validates correctly', () => {
			const schema = HashnodeEndpointInputSchemas.getPost;
			const valid = schema.parse({ id: 'abc123' });
			expect(valid.id).toBe('abc123');

			expect(() => schema.parse({})).toThrow();
		});

		it('PublishPostInputSchema requires title, publicationId, contentMarkdown', () => {
			const schema = HashnodeEndpointInputSchemas.publishPost;

			const valid = schema.parse({
				title: 'My Post',
				publicationId: 'pub123',
				contentMarkdown: '# Hello',
			});
			expect(valid.title).toBe('My Post');

			expect(() => schema.parse({})).toThrow();
			expect(() => schema.parse({ title: 'No pub' })).toThrow();
		});

		it('UpdatePostInputSchema requires id', () => {
			const schema = HashnodeEndpointInputSchemas.updatePost;
			expect(() => schema.parse({})).toThrow();
			expect(schema.parse({ id: '123' })).toBeDefined();
		});

		it('FeedInputSchema defaults first to 10', () => {
			const schema = HashnodeEndpointInputSchemas.feed;
			const parsed = schema.parse({});
			expect(parsed.first).toBe(10);
		});

		it('SearchPostsOfPublicationInputSchema requires filter.publicationId', () => {
			const schema = HashnodeEndpointInputSchemas.searchPostsOfPublication;
			expect(() => schema.parse({})).toThrow();
			expect(() =>
				schema.parse({
					filter: { publicationId: 'pub1' },
				}),
			).not.toThrow();
		});

		it('CreateDraftInputSchema validates correctly', () => {
			const schema = HashnodeEndpointInputSchemas.createDraft;
			expect(() => schema.parse({})).toThrow();
			expect(() => schema.parse({ publicationId: 'pub1' })).not.toThrow();
		});

		it('PublishDraftInputSchema requires draftId', () => {
			const schema = HashnodeEndpointInputSchemas.publishDraft;
			expect(() => schema.parse({})).toThrow();
			expect(schema.parse({ draftId: 'd1' })).toBeDefined();
		});

		it('DeleteDraftInputSchema requires draftId', () => {
			const schema = HashnodeEndpointInputSchemas.deleteDraft;
			expect(() => schema.parse({})).toThrow();
			expect(schema.parse({ draftId: 'd1' })).toBeDefined();
		});

		it('CreateImageUploadInputSchema validates content type', () => {
			const schema = HashnodeEndpointInputSchemas.createImageUploadURL;
			expect(() => schema.parse({})).toThrow();
			expect(() => schema.parse({ contentType: 'not-an-image' })).toThrow();
			expect(() => schema.parse({ contentType: 'image/png' })).not.toThrow();
		});

		it('PaginationInputSchema defaults first to 10', () => {
			const schema = HashnodeEndpointInputSchemas.listPublications;
			const parsed = schema.parse({});
			expect(parsed.first).toBe(10);
		});

		it('GetPublicationInputSchema requires host', () => {
			const schema = HashnodeEndpointInputSchemas.getPublication;
			expect(() => schema.parse({})).toThrow();
			expect(schema.parse({ host: 'blog.hashnode.dev' }).host).toBe(
				'blog.hashnode.dev',
			);
		});

		it('GetPostBySlugInputSchema requires host and slug', () => {
			const schema = HashnodeEndpointInputSchemas.getPostBySlug;
			expect(() => schema.parse({})).toThrow();
			expect(() => schema.parse({ host: 'test' })).toThrow();
			expect(
				schema.parse({ host: 'blog.hashnode.dev', slug: 'hello-world' }),
			).toBeDefined();
		});

		it('GetUserInputSchema requires username', () => {
			const schema = HashnodeEndpointInputSchemas.getUser;
			expect(() => schema.parse({})).toThrow();
			expect(schema.parse({ username: 'testuser' })).toBeDefined();
		});

		it('GetTagInputSchema requires slug', () => {
			const schema = HashnodeEndpointInputSchemas.getTag;
			expect(() => schema.parse({})).toThrow();
			expect(schema.parse({ slug: 'javascript' })).toBeDefined();
		});

		it('MeInputSchema accepts empty input', () => {
			const schema = HashnodeEndpointInputSchemas.me;
			expect(schema.parse(undefined)).toBeUndefined();
			expect(schema.parse({})).toEqual({});
		});
	});

	describe('output schemas', () => {
		it('MyUserSchema parses a minimal user response', () => {
			const userData = {
				me: {
					id: 'user1',
					name: 'Test User',
					username: 'testuser',
					email: 'test@example.com',
				},
			};
			const schema = HashnodeEndpointOutputSchemas.me;
			const parsed = schema.parse(userData);
			expect(parsed.me.id).toBe('user1');
			expect(parsed.me.name).toBe('Test User');
			expect(parsed.me.email).toBe('test@example.com');
		});

		it('PostSchema parses a minimal post response', () => {
			const postData = {
				post: {
					id: 'post1',
					title: 'Test Post',
					slug: 'test-post',
					brief: 'A brief',
					url: 'https://example.com/test-post',
					publishedAt: '2024-01-01T00:00:00Z',
					readTimeInMinutes: 5,
					reactionCount: 0,
					responseCount: 0,
				},
			};
			const schema = HashnodeEndpointOutputSchemas.getPost;
			const parsed = schema.parse(postData);
			expect(parsed.post?.id).toBe('post1');
			expect(parsed.post?.title).toBe('Test Post');
		});

		it('PublicationSchema parses a minimal publication response', () => {
			const pubData = {
				publication: {
					id: 'pub1',
					title: 'Test Blog',
				},
			};
			const schema = HashnodeEndpointOutputSchemas.getPublication;
			const parsed = schema.parse(pubData);
			expect(parsed.publication?.id).toBe('pub1');
		});

		it('FeedResponseSchema parses a feed result', () => {
			const feedData = {
				feed: {
					edges: [
						{
							node: {
								id: 'post1',
								title: 'Result',
								slug: 'result',
								brief: 'Brief',
								url: 'https://example.com/result',
								publishedAt: '2024-01-01T00:00:00Z',
								readTimeInMinutes: 3,
								reactionCount: 0,
								responseCount: 0,
							},
							cursor: 'cursor1',
						},
					],
					pageInfo: {
						hasNextPage: false,
						endCursor: null,
					},
				},
			};
			const schema = HashnodeEndpointOutputSchemas.feed;
			expect(() => schema.parse(feedData)).not.toThrow();
		});

		it('PostsResponseSchema parses paginated posts', () => {
			const postsData = {
				publication: {
					posts: {
						edges: [
							{
								node: {
									id: 'p1',
									title: 'Post 1',
									slug: 'post-1',
									brief: 'Brief',
									url: 'https://example.com/p1',
									publishedAt: '2024-01-01T00:00:00Z',
									readTimeInMinutes: 3,
									reactionCount: 0,
									responseCount: 0,
								},
								cursor: 'c1',
							},
						],
						pageInfo: {
							hasNextPage: true,
							endCursor: 'c1',
						},
						totalDocuments: 1,
					},
				},
			};
			const schema = HashnodeEndpointOutputSchemas.listPosts;
			const parsed = schema.parse(postsData);
			expect(parsed.publication.posts.edges).toHaveLength(1);
			expect(parsed.publication.posts.pageInfo.hasNextPage).toBe(true);
		});

		it('publishPost response parses correctly', () => {
			const data = {
				publishPost: {
					post: {
						id: 'new-post',
						title: 'New Post',
						slug: 'new-post',
						brief: 'Brief',
						url: 'https://blog.hashnode.dev/new-post',
						publishedAt: '2024-01-01T00:00:00Z',
						readTimeInMinutes: 3,
						reactionCount: 0,
						responseCount: 0,
					},
				},
			};
			const schema = HashnodeEndpointOutputSchemas.publishPost;
			expect(() => schema.parse(data)).not.toThrow();
			expect(schema.parse(data).publishPost.post.id).toBe('new-post');
		});

		it('TagSchema parses correct response', () => {
			const data = {
				tag: {
					id: 't1',
					name: 'JavaScript',
					slug: 'javascript',
				},
			};
			const schema = HashnodeEndpointOutputSchemas.getTag;
			expect(() => schema.parse(data)).not.toThrow();
			expect(schema.parse(data).tag?.name).toBe('JavaScript');
		});

		it('PagesResponseSchema parses array of pages', () => {
			const data = {
				publication: {
					staticPages: {
						edges: [{ node: { id: 'page1', title: 'About', slug: 'about' } }],
					},
				},
			};
			const schema = HashnodeEndpointOutputSchemas.listPages;
			const parsed = schema.parse(data);
			expect(parsed.publication.staticPages.edges).toHaveLength(1);
		});

		it('CreateImageUploadURLResponseSchema parses correctly', () => {
			const data = {
				createImageUploadURL: {
					presignedPost: {
						url: 'https://upload.example.com',
						fields: { key: 'value', acl: 'public-read' },
					},
				},
			};
			const schema = HashnodeEndpointOutputSchemas.createImageUploadURL;
			expect(() => schema.parse(data)).not.toThrow();
			expect(schema.parse(data).createImageUploadURL.presignedPost.url).toBe(
				'https://upload.example.com',
			);
		});

		it('DraftSchema parses a draft response', () => {
			const data = {
				createDraft: {
					draft: {
						id: 'd1',
						updatedAt: '2024-01-01T00:00:00Z',
						author: {
							id: 'u1',
							name: 'Test',
							username: 'test',
						},
					},
				},
			};
			const schema = HashnodeEndpointOutputSchemas.createDraft;
			expect(() => schema.parse(data)).not.toThrow();
			expect(schema.parse(data).createDraft.draft.id).toBe('d1');
		});
	});
});
