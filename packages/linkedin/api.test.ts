import { request } from 'corsair/http';
import { LinkedInAPIError } from './client';
import { LinkedInEndpointInputSchemas } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { LinkedInContext } from './index';
import { linkedin } from './index';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

const API_BASE = 'https://api.linkedin.com';
const PERSON_URN = 'urn:li:person:abc123';
const ORG_URN = 'urn:li:organization:2414183';
const POST_URN = 'urn:li:share:6844785523593134080';

// Endpoint handlers only read key, db, options, and $getAccountId at runtime;
// the full CorsairPluginContext carries runtime-bound members a hand-built
// literal cannot satisfy, so widen through unknown once here.
const mockCtx = {
	key: 'test-token',
	$getAccountId: async () => 'test-account-id',
	options: {},
	db: {},
} as unknown as LinkedInContext;

// Tests call raw handlers directly with (ctx, input); narrow the endpoint
// tree to loose call signatures once instead of casting at each call site.
type Handler = (
	ctx: LinkedInContext,
	input: Record<string, unknown>,
) => Promise<unknown>;
type EndpointTree = Record<string, Record<string, Handler | undefined>>;

function lastCall() {
	const call = mockRequest.mock.calls[mockRequest.mock.calls.length - 1];
	return { config: call?.[0], options: call?.[1] };
}

describe('LinkedIn endpoint behavior (mocked HTTP)', () => {
	const plugin = linkedin({ key: 'test-token' });
	const endpoints = plugin.endpoints as unknown as EndpointTree;

	function call(group: string, name: string, input: Record<string, unknown>) {
		const handler = endpoints[group]?.[name];
		if (!handler) throw new Error(`[test] missing endpoint ${group}.${name}`);
		return handler(mockCtx, input);
	}

	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('covers all 22 endpoints', () => {
		const leaves = Object.values(endpoints).flatMap((group) =>
			Object.values(group ?? {}),
		);
		expect(leaves).toHaveLength(22);
	});

	describe('profile', () => {
		it('getMyInfo GETs /v2/userinfo with the required LinkedIn headers', async () => {
			mockRequest.mockResolvedValue({ sub: 'abc123', name: 'Test User' });
			await call('profile', 'getMyInfo', {});

			const { config, options } = lastCall();
			expect(config.BASE).toBe(API_BASE);
			expect(config.HEADERS).toMatchObject({
				Authorization: 'Bearer test-token',
				'X-Restli-Protocol-Version': '2.0.0',
			});
			expect(config.HEADERS['LinkedIn-Version']).toMatch(/^\d{6}$/);
			expect(options).toMatchObject({ method: 'GET', url: '/v2/userinfo' });
		});

		it('getPerson URL-encodes the person id in the path', async () => {
			mockRequest.mockResolvedValue({ id: 'abc 123' });
			await call('profile', 'getPerson', { person_id: 'abc 123' });

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/people/abc%20123',
			});
		});
	});

	describe('posts', () => {
		it('create POSTs /rest/posts with commentary and defaults', async () => {
			await call('posts', 'create', {
				author: PERSON_URN,
				commentary: 'Hello LinkedIn',
			});

			expect(lastCall().options).toMatchObject({
				method: 'POST',
				url: '/rest/posts',
				body: {
					author: PERSON_URN,
					commentary: 'Hello LinkedIn',
					visibility: 'PUBLIC',
					lifecycleState: 'PUBLISHED',
				},
			});
		});

		it('create nests article content under content', async () => {
			await call('posts', 'create', {
				author: PERSON_URN,
				commentary: 'Read this',
				article_url: 'https://example.com/post',
				article_title: 'Example',
			});

			expect(lastCall().options.body.content).toEqual({
				article: { source: 'https://example.com/post', title: 'Example' },
			});
		});

		it('create nests image media under content', async () => {
			await call('posts', 'create', {
				author: PERSON_URN,
				commentary: 'See this',
				image_urn: 'urn:li:image:img1',
			});

			expect(lastCall().options.body.content).toEqual({
				media: { id: 'urn:li:image:img1' },
			});
		});

		it('CreatePost input schema rejects article_url and image_urn together', () => {
			const result = LinkedInEndpointInputSchemas.CreatePost.safeParse({
				author: PERSON_URN,
				commentary: 'invalid',
				article_url: 'https://example.com/post',
				image_urn: 'urn:li:image:img1',
			});
			expect(result.success).toBe(false);
		});

		it('createArticleShare wraps the article in a UGC ShareContent envelope', async () => {
			await call('posts', 'createArticleShare', {
				authorUrn: PERSON_URN,
				article_url: 'https://example.com/article',
				article_title: 'Title',
				text: 'Check it out',
			});

			const { options } = lastCall();
			expect(options).toMatchObject({ method: 'POST', url: '/v2/ugcPosts' });
			expect(options.body).toMatchObject({
				author: PERSON_URN,
				specificContent: {
					'com.linkedin.ugc.ShareContent': {
						shareCommentary: { text: 'Check it out' },
						shareMediaCategory: 'ARTICLE',
						media: [
							{
								originalUrl: 'https://example.com/article',
								title: { text: 'Title' },
							},
						],
					},
				},
				visibility: {
					'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
				},
			});
		});

		it('getContent GETs the encoded post URN on /rest/posts', async () => {
			await call('posts', 'getContent', { post_urn: POST_URN });

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: `/rest/posts/${encodeURIComponent(POST_URN)}`,
			});
		});

		it('routes the three delete variants to their distinct API surfaces', async () => {
			await call('posts', 'delete', { post_id: POST_URN });
			await call('posts', 'deleteShare', { share_id: '6844785' });
			await call('posts', 'deleteUgc', {
				ugc_post_urn: 'urn:li:ugcPost:123',
			});

			expect(mockRequest.mock.calls.map((c) => c[1])).toEqual([
				expect.objectContaining({
					method: 'DELETE',
					url: `/rest/posts/${encodeURIComponent(POST_URN)}`,
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: '/v2/shares/6844785',
				}),
				expect.objectContaining({
					method: 'DELETE',
					url: `/v2/ugcPosts/${encodeURIComponent('urn:li:ugcPost:123')}`,
				}),
			]);
		});
	});

	describe('comments and reactions', () => {
		it('comments.create posts actor, object, and wrapped message text', async () => {
			await call('comments', 'create', {
				commented_on_urn: POST_URN,
				actor: PERSON_URN,
				message: 'Nice post',
			});

			expect(lastCall().options).toMatchObject({
				method: 'POST',
				url: `/v2/socialActions/${encodeURIComponent(POST_URN)}/comments`,
				body: {
					actor: PERSON_URN,
					object: POST_URN,
					message: { text: 'Nice post' },
				},
			});
		});

		it('reactions.list GETs socialActions reactions with paging', async () => {
			await call('reactions', 'list', {
				entity_urn: POST_URN,
				start: 0,
				count: 10,
			});

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: `/v2/socialActions/${encodeURIComponent(POST_URN)}/reactions`,
				query: { start: 0, count: 10 },
			});
		});
	});

	describe('images and videos', () => {
		it('images.get GETs the encoded image URN', async () => {
			await call('images', 'get', { image_urn: 'urn:li:image:img1' });

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: `/v2/images/${encodeURIComponent('urn:li:image:img1')}`,
			});
		});

		it('images.list batches URNs with q=urns and pages results', async () => {
			await call('images', 'list', {
				urns: ['urn:li:image:a', 'urn:li:image:b'],
				start: 5,
				count: 20,
			});

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/images',
				query: {
					q: 'urns',
					// arrays pass through so the HTTP layer emits repeated urns= keys
					urns: ['urn:li:image:a', 'urn:li:image:b'],
					start: 5,
					count: 20,
				},
			});
		});

		it('images.list queries by owner with q=owner', async () => {
			await call('images', 'list', { owner: PERSON_URN });

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/images',
				query: { q: 'owner', owner: PERSON_URN },
			});
		});

		it('images.list rejects calls with no owner or urns before hitting LinkedIn', async () => {
			await expect(call('images', 'list', {})).rejects.toThrow(
				/requires owner or a non-empty urns list/,
			);
			expect(mockRequest).not.toHaveBeenCalled();
			expect(LinkedInEndpointInputSchemas.GetImages.safeParse({}).success).toBe(
				false,
			);
		});

		it('images.initializeUpload wraps the owner in initializeUploadRequest on /rest/images', async () => {
			await call('images', 'initializeUpload', { owner: PERSON_URN });

			expect(lastCall().options).toMatchObject({
				method: 'POST',
				url: '/rest/images?action=initializeUpload',
				body: { initializeUploadRequest: { owner: PERSON_URN } },
			});
		});

		it('images.registerUpload posts the registerUploadRequest to the Assets API', async () => {
			await call('images', 'registerUpload', { owner: PERSON_URN });

			expect(lastCall().options).toMatchObject({
				method: 'POST',
				// the legacy Assets API is on /v2, not the versioned /rest surface
				url: '/v2/assets?action=registerUpload',
				body: {
					registerUploadRequest: {
						recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
						owner: PERSON_URN,
						serviceRelationships: [
							{
								relationshipType: 'OWNER',
								identifier: 'urn:li:userGeneratedContent',
							},
						],
					},
				},
			});
		});

		it('videos.list resolves a single video URN through q=urns', async () => {
			await call('videos', 'list', { video_urn: 'urn:li:video:v1' });

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/videos',
				query: { q: 'urns', urns: 'urn:li:video:v1' },
			});
		});

		it('videos.list batches URNs as a repeated query array', async () => {
			await call('videos', 'list', {
				urns: ['urn:li:video:a', 'urn:li:video:b'],
			});

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/videos',
				query: {
					q: 'urns',
					urns: ['urn:li:video:a', 'urn:li:video:b'],
				},
			});
		});

		it('videos.list queries by owner with q=owner', async () => {
			await call('videos', 'list', { owner: PERSON_URN });

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/videos',
				query: { q: 'owner', owner: PERSON_URN },
			});
		});

		it('videos.list rejects calls with no finder before hitting LinkedIn', async () => {
			await expect(call('videos', 'list', {})).rejects.toThrow(
				/requires video_urn, owner, or a non-empty urns list/,
			);
			expect(mockRequest).not.toHaveBeenCalled();
			expect(LinkedInEndpointInputSchemas.GetVideos.safeParse({}).success).toBe(
				false,
			);
		});
	});

	describe('organizations', () => {
		it('getCompanyInfo queries organizationAcls with the given role assignee', async () => {
			await call('organizations', 'getCompanyInfo', {
				role_assignee: PERSON_URN,
				role: ['ADMINISTRATOR', 'DIRECT_SPONSORED_CONTENT_POSTER'],
			});

			expect(mockRequest).toHaveBeenCalledTimes(1);
			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/organizationAcls',
				query: {
					q: 'roleAssignee',
					roleAssignee: PERSON_URN,
					state: 'APPROVED',
					// arrays pass through so the HTTP layer emits repeated role= keys
					role: ['ADMINISTRATOR', 'DIRECT_SPONSORED_CONTENT_POSTER'],
				},
			});
		});

		it('getCompanyInfo forwards start/count pagination params', async () => {
			await call('organizations', 'getCompanyInfo', {
				role_assignee: PERSON_URN,
				start: 10,
				count: 5,
			});

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/organizationAcls',
				query: expect.objectContaining({ start: 10, count: 5 }),
			});
		});

		it('getCompanyInfo resolves the member URN via /v2/userinfo when no assignee is given', async () => {
			mockRequest.mockResolvedValueOnce({ sub: 'abc123' });
			mockRequest.mockResolvedValueOnce({ elements: [] });
			await call('organizations', 'getCompanyInfo', {});

			expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
				method: 'GET',
				url: '/v2/userinfo',
			});
			expect(mockRequest.mock.calls[1]?.[1]).toMatchObject({
				url: '/v2/organizationAcls',
				query: expect.objectContaining({
					roleAssignee: 'urn:li:person:abc123',
				}),
			});
		});

		it('getNetworkSize extracts follower counts from follower statistics', async () => {
			mockRequest.mockResolvedValue({
				elements: [{ totalFollowerCount: 42, organizationFollowerCount: 40 }],
			});
			const result = (await call('organizations', 'getNetworkSize', {
				organization_urn: ORG_URN,
			})) as { totalFollowerCount?: number };

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/organizationalEntityFollowerStatistics',
				query: { q: 'organizationHandle', organization: ORG_URN },
			});
			expect(result.totalFollowerCount).toBe(42);
		});

		it('getPageStats and getShareStats serialize timeIntervals in Restli format', async () => {
			const time_integrated = { start: 1704067200000, end: 1706745600000 };
			const expectedInterval =
				'(timeDuration:(start:1704067200000,end:1706745600000))';

			await call('organizations', 'getPageStats', {
				organization_urn: ORG_URN,
				time_integrated,
			});
			await call('organizations', 'getShareStats', {
				organization_urn: ORG_URN,
				time_integrated,
			});

			expect(mockRequest.mock.calls.map((c) => c[1])).toEqual([
				expect.objectContaining({
					url: '/v2/organizationPageStatistics',
					query: expect.objectContaining({
						q: 'organization',
						organization: ORG_URN,
						timeIntervals: expectedInterval,
					}),
				}),
				expect.objectContaining({
					url: '/v2/organizationalEntityShareStatistics',
					query: expect.objectContaining({
						timeIntervals: expectedInterval,
					}),
				}),
			]);
		});

		it('getPageStats forwards start/count pagination params', async () => {
			await call('organizations', 'getPageStats', {
				organization_urn: ORG_URN,
				start: 10,
				count: 25,
			});

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/organizationPageStatistics',
				query: expect.objectContaining({
					organization: ORG_URN,
					start: 10,
					count: 25,
				}),
			});
		});
	});

	describe('ads', () => {
		it('getTargetingFacets GETs /v2/adTargetingFacets', async () => {
			await call('ads', 'getTargetingFacets', {});

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/adTargetingFacets',
			});
		});

		it('getAudienceCounts POSTs the target criteria', async () => {
			const target = {
				includedTargetingFacets: { locations: ['urn:li:geo:1'] },
			};
			await call('ads', 'getAudienceCounts', { target });

			expect(lastCall().options).toMatchObject({
				method: 'POST',
				url: '/v2/audienceCounts',
				body: { target },
			});
		});

		it('searchTargetingEntities uses q=TYPEAHEAD with the query text and type', async () => {
			await call('ads', 'searchTargetingEntities', {
				query: 'software',
				type: 'INDUSTRY',
			});

			expect(lastCall().options).toMatchObject({
				method: 'GET',
				url: '/v2/adTargetingEntities',
				query: {
					q: 'TYPEAHEAD',
					'typeahead.query.text': 'software',
					'typeahead.type': 'INDUSTRY',
				},
			});
		});
	});

	describe('auth resilience', () => {
		it('retries once with a fresh token when the API rejects with 401', async () => {
			const { ApiError } = jest.requireActual('corsair/http');
			const unauthorized = new ApiError(
				{ method: 'GET', url: '/v2/userinfo' },
				{
					url: '/v2/userinfo',
					ok: false,
					status: 401,
					statusText: 'Unauthorized',
					body: {},
				},
				'Unauthorized',
			);
			mockRequest.mockRejectedValueOnce(unauthorized);
			mockRequest.mockResolvedValueOnce({ sub: 'abc123' });

			const refreshCtx = {
				...(mockCtx as unknown as Record<string, unknown>),
				_refreshAuth: jest.fn().mockResolvedValue('fresh-token'),
			} as unknown as LinkedInContext;

			const handler = endpoints.profile?.getMyInfo;
			if (!handler) throw new Error('[test] missing profile.getMyInfo');
			await handler(refreshCtx, {});

			expect(mockRequest).toHaveBeenCalledTimes(2);
			expect(mockRequest.mock.calls[1]?.[0].HEADERS.Authorization).toBe(
				'Bearer fresh-token',
			);
		});
	});

	describe('request guard', () => {
		it('rejects endpoints longer than the URL bound before any request', async () => {
			await expect(
				call('images', 'get', {
					image_urn: `urn:li:image:${'a'.repeat(4096)}`,
				}),
			).rejects.toThrow(/exceeds 2048 characters/);
			expect(mockRequest).not.toHaveBeenCalled();
		});
	});

	describe('error handlers', () => {
		it('matches wrapped LinkedInAPIError rate limits and forwards Retry-After', async () => {
			// the client wraps every ApiError as LinkedInAPIError before the
			// framework consults these matchers, so the wrapped type must match
			const rateLimited = new LinkedInAPIError(
				'Too Many Requests',
				429,
				undefined,
				3000,
			);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(rateLimited)).toBe(true);
			await expect(
				errorHandlers.RATE_LIMIT_ERROR.handler(rateLimited),
			).resolves.toEqual({ maxRetries: 5, headersRetryAfterMs: 3000 });

			// LinkedIn's canonical 429 body carries no status digits in the text
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('Too Many Requests')),
			).toBe(true);
		});

		it('matches wrapped LinkedInAPIError 401s without retrying', async () => {
			const unauthorized = new LinkedInAPIError('Unauthorized', 401);
			expect(errorHandlers.AUTH_ERROR.match(unauthorized)).toBe(true);
			await expect(errorHandlers.AUTH_ERROR.handler()).resolves.toEqual({
				maxRetries: 0,
			});
		});

		it('does not classify ordinary errors as rate limits', () => {
			expect(
				errorHandlers.RATE_LIMIT_ERROR.match(new Error('Bad Request')),
			).toBe(false);
		});
	});
});
