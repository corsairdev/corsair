import { ApiError, request } from 'corsair/http';
import { makeWebflowRequest, WebflowAPIError } from './client';
import * as collectionItemsEndpoints from './endpoints/collection-items';
import { webflowOperations } from './endpoints/operations';
import * as sitesEndpoints from './endpoints/sites';
import type { WebflowContext } from './index';
import { webflow, webflowEndpointSchemas } from './index';
import { WebflowPage } from './schema/database';

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;

function countLeaves(tree: Record<string, unknown>): number {
	return Object.values(tree).reduce<number>((count, value) => {
		if (typeof value === 'function') return count + 1;
		if (value && typeof value === 'object') {
			return count + countLeaves(value as Record<string, unknown>);
		}
		return count;
	}, 0);
}

function endpointPaths(tree: Record<string, unknown>, prefix = ''): string[] {
	return Object.entries(tree).flatMap(([key, value]) => {
		const path = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') return [path];
		if (value && typeof value === 'object') {
			return endpointPaths(value as Record<string, unknown>, path);
		}
		return [];
	});
}

// endpoint tests drive handlers with a minimal structural stand-in: the
// factory only reads key, db, options, and $getAccountId, but the full
// CorsairPluginContext type carries runtime-bound members that a hand-built
// literal cannot satisfy, so widen through unknown once here instead of at
// every call site
function testContext(overrides: Record<string, unknown> = {}): WebflowContext {
	return {
		key: 'test-token',
		$getAccountId: () => 'test-account-id',
		options: {},
		logEvent: jest.fn(),
		db: {},
		...overrides,
	} as unknown as WebflowContext;
}

// plugin.endpoints is typed against the runtime endpoint binder; tests call
// the raw handlers directly with (ctx, input) tuples, so narrow the nested
// map to just the call signatures under test
function endpointsAs<T>(plugin: { endpoints?: unknown }): T {
	return plugin.endpoints as T;
}

const mockCtx = testContext();

describe('Webflow plugin shape', () => {
	it('keeps endpoint domain files explicit', () => {
		expect(typeof sitesEndpoints.listSites).toBe('function');
		expect(typeof sitesEndpoints.publishSite).toBe('function');
		expect(typeof collectionItemsEndpoints.createCollectionItem).toBe(
			'function',
		);
		expect(typeof collectionItemsEndpoints.publishCollectionItems).toBe(
			'function',
		);
	});

	it('exposes every listed operation with schemas and no webhooks', () => {
		const plugin = webflow();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(52);
		expect(Object.keys(plugin.endpointMeta ?? {})).toHaveLength(52);
		expect(Object.keys(webflowEndpointSchemas)).toHaveLength(52);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(webflowEndpointSchemas).sort()).toEqual(paths);
		expect(Object.keys(plugin.schema?.entities ?? {})).toEqual([
			'sites',
			'collections',
			'collectionItems',
			'assets',
			'assetFolders',
			'pages',
			'orders',
			'webhooks',
		]);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {}, body: '' })).toBe(
			false,
		);
		expect(plugin.endpointMeta?.['ecommerce.refundOrder']).toEqual(
			expect.objectContaining({
				riskLevel: 'destructive',
				irreversible: true,
			}),
		);
	});

	it('supports api key and oauth auth with api key default', () => {
		const plugin = webflow();

		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({ api_key: {}, oauth_2: {} });
		expect(plugin.oauthConfig?.authUrl).toBe(
			'https://webflow.com/oauth/authorize',
		);
		expect(plugin.oauthConfig?.tokenUrl).toBe(
			'https://api.webflow.com/oauth/access_token',
		);
	});
});

describe('Webflow request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('sends bearer auth and JSON bodies to the Webflow API', async () => {
		await makeWebflowRequest('/sites', 'test-token', {
			method: 'POST',
			body: { displayName: 'demo' },
		});

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.webflow.com/v2',
				TOKEN: 'test-token',
				HEADERS: expect.objectContaining({
					'Content-Type': 'application/json',
					Accept: 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'POST',
				url: '/sites',
				body: { displayName: 'demo' },
				mediaType: 'application/json',
			}),
		);
		// auth flows only through TOKEN; corsair/http derives the bearer
		// header from it, so no explicit Authorization header is set
		expect(
			mockRequest.mock.calls[0]?.[0].HEADERS?.Authorization,
		).toBeUndefined();
	});

	it('maps ApiError to WebflowAPIError with the body error code', async () => {
		const requestOptions = { method: 'GET' as const, url: '/sites' };
		mockRequest.mockRejectedValueOnce(
			new ApiError(
				requestOptions,
				{
					url: 'https://api.webflow.com/v2/sites',
					ok: false,
					status: 429,
					statusText: 'Too Many Requests',
					body: { code: 'too_many_requests', message: 'slow down' },
				},
				'Too Many Requests',
				{ retryAfter: 1000 },
			),
		);

		const error = await makeWebflowRequest('/sites', 'test-token').catch(
			(caught: unknown) => caught,
		);

		expect(error).toBeInstanceOf(WebflowAPIError);
		const webflowError = error as WebflowAPIError;
		expect(webflowError.status).toBe(429);
		expect(webflowError.code).toBe('too_many_requests');
		expect(webflowError.retryAfter).toBe(1000);
	});

	it('drops bodies for GET requests and keeps query params', async () => {
		await makeWebflowRequest('/sites', 'test-token', {
			method: 'GET',
			body: { ignored: true },
			query: { limit: 10 },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/sites',
			query: { limit: 10 },
		});
		expect(mockRequest.mock.calls[0]?.[1].body).toBeUndefined();
	});

	it('rejects a caller-controlled baseUrl that is not the Webflow API host', async () => {
		await expect(
			makeWebflowRequest('/sites', 'test-token', {
				baseUrl: 'https://evil.example/steal',
			}),
		).rejects.toThrow(/baseUrl/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('rejects a Webflow host baseUrl that does not target /v2', async () => {
		await expect(
			makeWebflowRequest('/sites', 'test-token', {
				baseUrl: 'https://api.webflow.com/v1',
			}),
		).rejects.toThrow(/baseUrl/);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('pins an allowlisted baseUrl to the canonical v2 origin', async () => {
		await makeWebflowRequest('/sites', 'test-token', {
			baseUrl: 'https://api.webflow.com',
		});
		expect(mockRequest.mock.calls[0]?.[0]).toEqual(
			expect.objectContaining({ BASE: 'https://api.webflow.com/v2' }),
		);
	});
});

describe('Webflow endpoints', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue({ ok: true });
	});

	it('maps representative operations to official API routes', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			sites: {
				listSites: (ctx: WebflowContext, input: {}) => Promise<unknown>;
				publishSite: (
					ctx: WebflowContext,
					input: { site_id: string; body: unknown },
				) => Promise<unknown>;
			};
			collectionItems: {
				createCollectionItem: (
					ctx: WebflowContext,
					input: { collection_id: string; body: unknown },
				) => Promise<unknown>;
				getLiveCollectionItem: (
					ctx: WebflowContext,
					input: { collection_id: string; item_id: string },
				) => Promise<unknown>;
			};
			components: {
				getComponentProperties: (
					ctx: WebflowContext,
					input: { site_id: string; component_id: string },
				) => Promise<unknown>;
			};
			ecommerce: {
				updateItemInventory: (
					ctx: WebflowContext,
					input: { collection_id: string; item_id: string; body: unknown },
				) => Promise<unknown>;
			};
			token: {
				getTokenAuthorizedBy: (
					ctx: WebflowContext,
					input: {},
				) => Promise<unknown>;
			};
		}>(plugin);

		await endpoints.sites.listSites(mockCtx, {});
		await endpoints.sites.publishSite(mockCtx, {
			site_id: '580e63e98c9a982ac9b8b741',
			body: { publishToWebflowSubdomain: true },
		});
		await endpoints.collectionItems.createCollectionItem(mockCtx, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			body: { fieldData: { name: 'Post', slug: 'post' } },
		});
		await endpoints.collectionItems.getLiveCollectionItem(mockCtx, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			item_id: '580e64008c9a982ac9b8b754',
		});
		await endpoints.components.getComponentProperties(mockCtx, {
			site_id: '580e63e98c9a982ac9b8b741',
			component_id: '8505ba55-ef72-629e-f85c-33e4b703d48b',
		});
		await endpoints.ecommerce.updateItemInventory(mockCtx, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			item_id: '580e64008c9a982ac9b8b754',
			body: { inventoryType: 'infinite' },
		});
		await endpoints.token.getTokenAuthorizedBy(mockCtx, {});

		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual(
			expect.arrayContaining([
				expect.objectContaining({ method: 'GET', url: '/sites' }),
				expect.objectContaining({
					method: 'POST',
					url: '/sites/580e63e98c9a982ac9b8b741/publish',
					body: { publishToWebflowSubdomain: true },
				}),
				expect.objectContaining({
					method: 'POST',
					url: '/collections/580e63fc8c9a982ac9b8b745/items',
					body: { fieldData: { name: 'Post', slug: 'post' } },
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/collections/580e63fc8c9a982ac9b8b745/items/580e64008c9a982ac9b8b754/live',
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/sites/580e63e98c9a982ac9b8b741/components/8505ba55-ef72-629e-f85c-33e4b703d48b/properties',
				}),
				expect.objectContaining({
					method: 'PATCH',
					url: '/collections/580e63fc8c9a982ac9b8b745/items/580e64008c9a982ac9b8b754/inventory',
					body: { inventoryType: 'infinite' },
				}),
				expect.objectContaining({
					method: 'GET',
					url: '/token/authorized_by',
				}),
			]),
		);
	});

	it('routes collectionFields, pages, comments, and forms operations', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionFields: {
				createCollectionField: (
					ctx: WebflowContext,
					input: { collection_id: string; body: unknown },
				) => Promise<unknown>;
				updateCollectionField: (
					ctx: WebflowContext,
					input: { collection_id: string; field_id: string; body: unknown },
				) => Promise<unknown>;
				deleteCollectionField: (
					ctx: WebflowContext,
					input: { collection_id: string; field_id: string },
				) => Promise<unknown>;
			};
			pages: {
				listPages: (
					ctx: WebflowContext,
					input: { site_id: string },
				) => Promise<unknown>;
				getPage: (
					ctx: WebflowContext,
					input: { page_id: string },
				) => Promise<unknown>;
				getPageDom: (
					ctx: WebflowContext,
					input: { page_id: string },
				) => Promise<unknown>;
				updatePageMetadata: (
					ctx: WebflowContext,
					input: { page_id: string; body: unknown },
				) => Promise<unknown>;
			};
			comments: {
				listCommentThreads: (
					ctx: WebflowContext,
					input: { site_id: string },
				) => Promise<unknown>;
			};
			forms: {
				listFormSubmissions: (
					ctx: WebflowContext,
					input: { site_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);

		const collectionId = '580e63fc8c9a982ac9b8b745';
		const fieldId = '75821f618da60c18383330ed';
		const siteId = '580e63e98c9a982ac9b8b741';
		const pageId = '6596da6045e56dee495bcbba';

		await endpoints.collectionFields.createCollectionField(mockCtx, {
			collection_id: collectionId,
			body: { type: 'PlainText', displayName: 'Subtitle' },
		});
		await endpoints.collectionFields.updateCollectionField(mockCtx, {
			collection_id: collectionId,
			field_id: fieldId,
			body: { displayName: 'Renamed' },
		});
		await endpoints.collectionFields.deleteCollectionField(mockCtx, {
			collection_id: collectionId,
			field_id: fieldId,
		});
		await endpoints.pages.listPages(mockCtx, { site_id: siteId });
		await endpoints.pages.getPage(mockCtx, { page_id: pageId });
		await endpoints.pages.getPageDom(mockCtx, { page_id: pageId });
		await endpoints.pages.updatePageMetadata(mockCtx, {
			page_id: pageId,
			body: { title: 'New Title' },
		});
		await endpoints.comments.listCommentThreads(mockCtx, {
			site_id: siteId,
		});
		await endpoints.forms.listFormSubmissions(mockCtx, {
			site_id: siteId,
		});

		expect(mockRequest).toHaveBeenCalledTimes(9);
		expect(mockRequest.mock.calls.map((call) => call[1])).toEqual([
			expect.objectContaining({
				method: 'POST',
				url: `/collections/${collectionId}/fields`,
				body: { type: 'PlainText', displayName: 'Subtitle' },
			}),
			expect.objectContaining({
				method: 'PATCH',
				url: `/collections/${collectionId}/fields/${fieldId}`,
				body: { displayName: 'Renamed' },
			}),
			expect.objectContaining({
				method: 'DELETE',
				url: `/collections/${collectionId}/fields/${fieldId}`,
			}),
			expect.objectContaining({
				method: 'GET',
				url: `/sites/${siteId}/pages`,
			}),
			expect.objectContaining({ method: 'GET', url: `/pages/${pageId}` }),
			expect.objectContaining({
				method: 'GET',
				url: `/pages/${pageId}/dom`,
			}),
			expect.objectContaining({
				method: 'PUT',
				url: `/pages/${pageId}`,
				body: { title: 'New Title' },
			}),
			expect.objectContaining({
				method: 'GET',
				url: `/sites/${siteId}/comments`,
			}),
			expect.objectContaining({
				method: 'GET',
				url: `/sites/${siteId}/form_submissions`,
			}),
		]);
	});

	it('routes every operation to its declared path and method', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints =
			endpointsAs<
				Record<
					string,
					| Record<
							string,
							| ((
									ctx: WebflowContext,
									input: Record<string, unknown>,
							  ) => Promise<unknown>)
							| undefined
					  >
					| undefined
				>
			>(plugin);

		// the const-asserted operations array narrows away optional fields per
		// member; widen once so the loop can treat every operation uniformly
		const allOperations = webflowOperations as readonly {
			group: string;
			name: string;
			method: string;
			path: string;
			pathParams?: readonly string[];
		}[];
		expect(allOperations).toHaveLength(52);

		for (const operation of allOperations) {
			const handler = endpoints[operation.group]?.[operation.name];
			if (!handler) {
				throw new Error(
					`[test] missing endpoint ${operation.group}.${operation.name}`,
				);
			}

			// synthesize one value per declared path param; the factory must
			// substitute all of them and leave no unresolved placeholder
			const input: Record<string, unknown> = {};
			let expectedUrl: string = operation.path;
			for (const param of operation.pathParams ?? []) {
				const value = `test-${param.replace(/_/g, '-')}`;
				input[param] = value;
				expectedUrl = expectedUrl.replace(`{${param}}`, value);
			}

			mockRequest.mockClear();
			mockRequest.mockResolvedValue({ ok: true });
			await handler(mockCtx, input);

			const call = mockRequest.mock.calls[0]?.[1];
			expect(call).toMatchObject({
				method: operation.method,
				url: expectedUrl,
			});
			// an unresolved placeholder means pathParams and the path template
			// disagree — exactly the typo class this test exists to catch
			expect(call.url).not.toContain('{');
		}
	});

	it('folds extra GET inputs into the query string', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				listCollectionItems: (
					ctx: WebflowContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
		}>(plugin);

		await endpoints.collectionItems.listCollectionItems(mockCtx, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			limit: 25,
			sortBy: 'lastPublished',
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'GET',
			url: '/collections/580e63fc8c9a982ac9b8b745/items',
			query: { limit: 25, sortBy: 'lastPublished' },
		});
	});

	it('rejects calls with missing required path parameters', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			sites: {
				getSite: (
					ctx: WebflowContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
		}>(plugin);

		await expect(endpoints.sites.getSite(mockCtx, {})).rejects.toThrow(
			'missing required path parameter',
		);
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('caches wrapped list and flat item responses when database clients exist', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			sites: {
				listSites: (ctx: WebflowContext, input: {}) => Promise<unknown>;
			};
			collections: {
				getCollection: (
					ctx: WebflowContext,
					input: { collection_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				sites: { upsertByEntityId: jest.fn() },
				collections: { upsertByEntityId: jest.fn() },
			},
		});

		mockRequest
			.mockResolvedValueOnce({
				sites: [{ id: '580e63e98c9a982ac9b8b741', displayName: 'Demo' }],
			})
			.mockResolvedValueOnce({
				id: '580e63fc8c9a982ac9b8b745',
				displayName: 'Blog Posts',
			});

		await endpoints.sites.listSites(ctxWithDb, {});
		await endpoints.collections.getCollection(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
		});

		expect(ctxWithDb.db.sites.upsertByEntityId).toHaveBeenCalledWith(
			'580e63e98c9a982ac9b8b741',
			expect.objectContaining({ displayName: 'Demo' }),
		);
		expect(ctxWithDb.db.collections.upsertByEntityId).toHaveBeenCalledWith(
			'580e63fc8c9a982ac9b8b745',
			expect.objectContaining({ displayName: 'Blog Posts' }),
		);
	});

	it('caches orders under their orderId', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			ecommerce: {
				getOrder: (
					ctx: WebflowContext,
					input: { site_id: string; order_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				orders: { upsertByEntityId: jest.fn() },
			},
		});

		mockRequest.mockResolvedValueOnce({
			orderId: 'dfa-3f1',
			status: 'unfulfilled',
		});

		await endpoints.ecommerce.getOrder(ctxWithDb, {
			site_id: '580e63e98c9a982ac9b8b741',
			order_id: 'dfa-3f1',
		});

		expect(ctxWithDb.db.orders.upsertByEntityId).toHaveBeenCalledWith(
			'dfa-3f1',
			expect.objectContaining({ status: 'unfulfilled' }),
		);
	});

	it('never caches the pre-signed upload fields returned by uploadAsset', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			assets: {
				uploadAsset: (
					ctx: WebflowContext,
					input: { site_id: string; body: unknown },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				assets: { upsertByEntityId: jest.fn() },
			},
		});

		mockRequest.mockResolvedValueOnce({
			id: '63e5889e7fe4eafa7384cea4',
			originalFileName: 'logo.png',
			uploadUrl: 'https://s3.amazonaws.com/webflow-bucket',
			uploadDetails: {
				'x-amz-signature': 'secret-signature',
				policy: 'signed-policy',
			},
		});

		const response = await endpoints.assets.uploadAsset(ctxWithDb, {
			site_id: '580e63e98c9a982ac9b8b741',
			body: { fileName: 'logo.png', fileHash: 'abc123' },
		});

		// callers still get the upload fields to complete the s3 upload
		expect(response).toMatchObject({
			uploadUrl: 'https://s3.amazonaws.com/webflow-bucket',
		});
		// but the cached copy must not contain them
		expect(ctxWithDb.db.assets.upsertByEntityId).toHaveBeenCalledWith(
			'63e5889e7fe4eafa7384cea4',
			expect.objectContaining({ originalFileName: 'logo.png' }),
		);
		expect(ctxWithDb.db.assets.upsertByEntityId).toHaveBeenCalledWith(
			'63e5889e7fe4eafa7384cea4',
			expect.not.objectContaining({ uploadDetails: expect.anything() }),
		);
		expect(ctxWithDb.db.assets.upsertByEntityId).toHaveBeenCalledWith(
			'63e5889e7fe4eafa7384cea4',
			expect.not.objectContaining({ uploadUrl: expect.anything() }),
		);
	});

	it('sends bulk delete ids in the DELETE body and evicts them from cache', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				deleteCollectionItems: (
					ctx: WebflowContext,
					input: { collection_id: string; body: unknown },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				collectionItems: { deleteByEntityId: jest.fn() },
			},
		});

		await endpoints.collectionItems.deleteCollectionItems(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			body: {
				items: [
					{ id: '580e64008c9a982ac9b8b754' },
					{ id: '580e64008c9a982ac9b8b755' },
				],
			},
		});

		// webflow bulk deletes require the target ids in a DELETE body
		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'DELETE',
			url: '/collections/580e63fc8c9a982ac9b8b745/items',
			body: {
				items: [
					{ id: '580e64008c9a982ac9b8b754' },
					{ id: '580e64008c9a982ac9b8b755' },
				],
			},
		});
		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
		);
		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b755',
		);
	});

	it('evicts bulk-deleted items when callers use the extra-fields shorthand', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				deleteCollectionItems: (
					ctx: WebflowContext,
					input: Record<string, unknown>,
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				collectionItems: { deleteByEntityId: jest.fn() },
			},
		});

		// no explicit body: the factory folds the extra items field into the
		// request body, so eviction must read the same ids from the shorthand
		await endpoints.collectionItems.deleteCollectionItems(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			items: [
				{ id: '580e64008c9a982ac9b8b754' },
				{ id: '580e64008c9a982ac9b8b755' },
			],
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'DELETE',
			url: '/collections/580e63fc8c9a982ac9b8b745/items',
			body: {
				items: [
					{ id: '580e64008c9a982ac9b8b754' },
					{ id: '580e64008c9a982ac9b8b755' },
				],
			},
		});
		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
		);
		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b755',
		);
	});

	it('evicts published items so the cache never serves stale draft state', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				publishCollectionItems: (
					ctx: WebflowContext,
					input: { collection_id: string; body: unknown },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				collectionItems: { deleteByEntityId: jest.fn() },
			},
		});

		// simple publish sends bare string ids
		await endpoints.collectionItems.publishCollectionItems(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			body: { itemIds: ['580e64008c9a982ac9b8b754'] },
		});
		// locale-aware publish sends { id, cmsLocaleIds } records
		await endpoints.collectionItems.publishCollectionItems(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			body: { items: [{ id: '580e64008c9a982ac9b8b755' }] },
		});

		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
		);
		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b755',
		);
	});

	it('evicts unpublished items instead of serving stale published state', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				unpublishLiveCollectionItem: (
					ctx: WebflowContext,
					input: { collection_id: string; item_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				collectionItems: { deleteByEntityId: jest.fn() },
			},
		});

		await endpoints.collectionItems.unpublishLiveCollectionItem(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			item_id: '580e64008c9a982ac9b8b754',
		});

		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
		);
	});

	it('keeps the cache in sync for the deprecated bulk update endpoint', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				updateCollectionItemLegacy: (
					ctx: WebflowContext,
					input: { collection_id: string; body: unknown },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				collectionItems: { upsertByEntityId: jest.fn() },
			},
		});

		mockRequest.mockResolvedValueOnce({
			items: [{ id: '580e64008c9a982ac9b8b754', isDraft: true }],
		});

		await endpoints.collectionItems.updateCollectionItemLegacy(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			body: { items: [{ id: '580e64008c9a982ac9b8b754' }] },
		});

		expect(mockRequest.mock.calls[0]?.[1]).toMatchObject({
			method: 'PATCH',
			url: '/collections/580e63fc8c9a982ac9b8b745/items',
		});
		expect(ctxWithDb.db.collectionItems.upsertByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
			expect.objectContaining({ isDraft: true }),
		);
	});

	it('never caches card or payment processor references from orders', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			ecommerce: {
				getOrder: (
					ctx: WebflowContext,
					input: { site_id: string; order_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				orders: { upsertByEntityId: jest.fn() },
			},
		});

		mockRequest.mockResolvedValueOnce({
			orderId: 'dfa-3f1',
			status: 'fulfilled',
			stripeCard: { last4: '4242', brand: 'Visa' },
			stripeDetails: { customerId: 'cus_123', chargeId: 'ch_123' },
			paypalDetails: null,
		});

		const response = await endpoints.ecommerce.getOrder(ctxWithDb, {
			site_id: '580e63e98c9a982ac9b8b741',
			order_id: 'dfa-3f1',
		});

		// callers still receive the full api response
		expect(response).toMatchObject({
			stripeCard: { last4: '4242' },
		});
		// but the cached copy must not contain payment references
		expect(ctxWithDb.db.orders.upsertByEntityId).toHaveBeenCalledWith(
			'dfa-3f1',
			expect.objectContaining({ status: 'fulfilled' }),
		);
		expect(ctxWithDb.db.orders.upsertByEntityId).toHaveBeenCalledWith(
			'dfa-3f1',
			expect.not.objectContaining({ stripeCard: expect.anything() }),
		);
		expect(ctxWithDb.db.orders.upsertByEntityId).toHaveBeenCalledWith(
			'dfa-3f1',
			expect.not.objectContaining({ stripeDetails: expect.anything() }),
		);
	});

	it('stamps cached collection items with their parent collection id', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				createCollectionItem: (
					ctx: WebflowContext,
					input: { collection_id: string; body: unknown },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				collectionItems: { upsertByEntityId: jest.fn() },
			},
		});

		mockRequest.mockResolvedValueOnce({
			id: '580e64008c9a982ac9b8b754',
			isDraft: true,
		});

		await endpoints.collectionItems.createCollectionItem(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			body: { fieldData: { name: 'Post', slug: 'post' } },
		});

		// webflow item responses do not echo the parent collection id, so the
		// cache stamps it from the request to enable cascade eviction
		expect(ctxWithDb.db.collectionItems.upsertByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
			expect.objectContaining({
				collectionId: '580e63fc8c9a982ac9b8b745',
			}),
		);
	});

	it('cascade-evicts cached items when their collection is deleted', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collections: {
				deleteCollection: (
					ctx: WebflowContext,
					input: { collection_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const search = jest
			.fn()
			.mockResolvedValue([
				{ entity_id: '580e64008c9a982ac9b8b754' },
				{ entity_id: '580e64008c9a982ac9b8b755' },
			]);
		const ctxWithDb = testContext({
			db: {
				collections: { deleteByEntityId: jest.fn() },
				collectionItems: {
					search,
					deleteByEntityId: jest.fn(),
				},
			},
		});

		await endpoints.collections.deleteCollection(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
		});

		expect(ctxWithDb.db.collections.deleteByEntityId).toHaveBeenCalledWith(
			'580e63fc8c9a982ac9b8b745',
		);
		// webflow deletes all items server-side with the collection, so the
		// cache must not keep orphaned item rows around
		expect(search).toHaveBeenCalledWith({
			data: { collectionId: '580e63fc8c9a982ac9b8b745' },
			limit: 100,
		});
		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
		);
		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b755',
		);
	});

	it('stops cascade eviction when deletes do not shrink the page', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collections: {
				deleteCollection: (
					ctx: WebflowContext,
					input: { collection_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const stuckPage = Array.from({ length: 100 }, (_, index) => ({
			entity_id: `stuck-${index}`,
		}));
		const search = jest.fn().mockResolvedValue(stuckPage);
		const deleteByEntityId = jest.fn();
		const ctxWithDb = testContext({
			db: {
				collections: { deleteByEntityId: jest.fn() },
				collectionItems: {
					search,
					deleteByEntityId,
				},
			},
		});

		await endpoints.collections.deleteCollection(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
		});

		expect(search).toHaveBeenCalledTimes(2);
		expect(deleteByEntityId).toHaveBeenCalledTimes(100);
	});

	it('deletes cached entities for destructive operations', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			assets: {
				deleteAsset: (
					ctx: WebflowContext,
					input: { asset_id: string },
				) => Promise<unknown>;
			};
			webhooks: {
				deleteWebhook: (
					ctx: WebflowContext,
					input: { webhook_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				assets: { deleteByEntityId: jest.fn() },
				webhooks: { deleteByEntityId: jest.fn() },
			},
		});

		await endpoints.assets.deleteAsset(ctxWithDb, {
			asset_id: '63e5889e7fe4eafa7384cea4',
		});
		await endpoints.webhooks.deleteWebhook(ctxWithDb, {
			webhook_id: '582266e0cd48de0f0e3c6d8b',
		});

		expect(ctxWithDb.db.assets.deleteByEntityId).toHaveBeenCalledWith(
			'63e5889e7fe4eafa7384cea4',
		);
		expect(ctxWithDb.db.webhooks.deleteByEntityId).toHaveBeenCalledWith(
			'582266e0cd48de0f0e3c6d8b',
		);
	});

	it('returns api results even when cache writes fail', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			sites: {
				listSites: (ctx: WebflowContext, input: {}) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				sites: {
					upsertByEntityId: jest.fn().mockRejectedValue(new Error('db down')),
				},
			},
		});

		mockRequest.mockResolvedValueOnce({
			sites: [{ id: '580e63e98c9a982ac9b8b741', displayName: 'Demo' }],
		});

		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		// the webflow api call succeeded; a local cache failure must not make
		// the endpoint throw, or callers could retry a completed operation
		const result = await endpoints.sites.listSites(ctxWithDb, {});
		expect(warn).toHaveBeenCalled();
		warn.mockRestore();

		expect(result).toMatchObject({
			sites: [{ id: '580e63e98c9a982ac9b8b741' }],
		});
		expect(ctxWithDb.db.sites.upsertByEntityId).toHaveBeenCalled();
	});

	it('returns api results even when event logging fails', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			sites: {
				listSites: (ctx: WebflowContext, input: {}) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithBrokenLogging = testContext({
			$getAccountId: jest.fn().mockRejectedValue(new Error('store down')),
		});

		mockRequest.mockResolvedValueOnce({
			sites: [{ id: '580e63e98c9a982ac9b8b741', displayName: 'Demo' }],
		});

		const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
		const result = await endpoints.sites.listSites(ctxWithBrokenLogging, {});
		warn.mockRestore();

		expect(result).toMatchObject({
			sites: [{ id: '580e63e98c9a982ac9b8b741' }],
		});
	});

	it('does not let live item reads overwrite the staged cache', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				getCollectionItem: (
					ctx: WebflowContext,
					input: { collection_id: string; item_id: string },
				) => Promise<unknown>;
				getLiveCollectionItem: (
					ctx: WebflowContext,
					input: { collection_id: string; item_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const upsertByEntityId = jest.fn();
		const ctxWithDb = testContext({
			db: {
				collectionItems: { upsertByEntityId },
			},
		});

		mockRequest.mockResolvedValueOnce({
			id: '580e64008c9a982ac9b8b754',
			isDraft: true,
			fieldData: { name: 'Draft' },
		});
		await endpoints.collectionItems.getCollectionItem(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			item_id: '580e64008c9a982ac9b8b754',
		});
		expect(upsertByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
			expect.objectContaining({ isDraft: true, fieldData: { name: 'Draft' } }),
		);

		upsertByEntityId.mockClear();
		mockRequest.mockResolvedValueOnce({
			id: '580e64008c9a982ac9b8b754',
			isDraft: false,
			fieldData: { name: 'Live' },
		});
		await endpoints.collectionItems.getLiveCollectionItem(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			item_id: '580e64008c9a982ac9b8b754',
		});

		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('evicts the staged cache after a live item update', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				updateLiveCollectionItem: (
					ctx: WebflowContext,
					input: { collection_id: string; item_id: string; body: unknown },
				) => Promise<unknown>;
			};
		}>(plugin);
		const deleteByEntityId = jest.fn();
		const upsertByEntityId = jest.fn();
		const ctxWithDb = testContext({
			db: {
				collectionItems: { deleteByEntityId, upsertByEntityId },
			},
		});

		mockRequest.mockResolvedValueOnce({
			id: '580e64008c9a982ac9b8b754',
			isDraft: false,
			fieldData: { name: 'Live' },
		});
		await endpoints.collectionItems.updateLiveCollectionItem(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			item_id: '580e64008c9a982ac9b8b754',
			body: { fieldData: { name: 'Live' } },
		});

		expect(deleteByEntityId).toHaveBeenCalledWith('580e64008c9a982ac9b8b754');
		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('evicts the site and its cached items after publishSite', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			sites: {
				publishSite: (
					ctx: WebflowContext,
					input: { site_id: string; body: unknown },
				) => Promise<unknown>;
			};
		}>(plugin);
		const listItems = jest
			.fn()
			.mockResolvedValueOnce([{ entity_id: '580e64008c9a982ac9b8b754' }])
			.mockResolvedValueOnce([]);
		const ctxWithDb = testContext({
			db: {
				sites: { deleteByEntityId: jest.fn() },
				collections: { deleteByEntityId: jest.fn() },
				collectionItems: {
					list: listItems,
					deleteByEntityId: jest.fn(),
				},
			},
		});

		await endpoints.sites.publishSite(ctxWithDb, {
			site_id: '580e63e98c9a982ac9b8b741',
			body: { publishToWebflowSubdomain: true },
		});

		expect(ctxWithDb.db.sites.deleteByEntityId).toHaveBeenCalledWith(
			'580e63e98c9a982ac9b8b741',
		);
		expect(ctxWithDb.db.collectionItems.deleteByEntityId).toHaveBeenCalledWith(
			'580e64008c9a982ac9b8b754',
		);
		expect(ctxWithDb.db.collections.deleteByEntityId).not.toHaveBeenCalled();
	});

	it('does not cache live item creates into the staged collectionItems row', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionItems: {
				createLiveCollectionItem: (
					ctx: WebflowContext,
					input: { collection_id: string; body: unknown },
				) => Promise<unknown>;
			};
		}>(plugin);
		const upsertByEntityId = jest.fn();
		const ctxWithDb = testContext({
			db: {
				collectionItems: { upsertByEntityId },
			},
		});

		mockRequest.mockResolvedValueOnce({
			id: '580e64008c9a982ac9b8b754',
			isDraft: false,
			fieldData: { name: 'Live' },
		});
		await endpoints.collectionItems.createLiveCollectionItem(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			body: { fieldData: { name: 'Live' } },
		});

		expect(upsertByEntityId).not.toHaveBeenCalled();
	});

	it('keeps collection fields when a later list upserts the same row', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collections: {
				listCollections: (
					ctx: WebflowContext,
					input: { site_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const upsertByEntityId = jest.fn();
		const ctxWithDb = testContext({
			db: {
				collections: {
					findByEntityId: jest.fn().mockResolvedValue({
						entity_id: '580e63fc8c9a982ac9b8b745',
						data: {
							id: '580e63fc8c9a982ac9b8b745',
							displayName: 'Blog',
							fields: [{ slug: 'title' }],
						},
					}),
					upsertByEntityId,
				},
			},
		});

		mockRequest.mockResolvedValueOnce({
			collections: [
				{
					id: '580e63fc8c9a982ac9b8b745',
					displayName: 'Blog Posts',
					slug: 'posts',
				},
			],
		});
		await endpoints.collections.listCollections(ctxWithDb, {
			site_id: '580e63e98c9a982ac9b8b741',
		});

		expect(upsertByEntityId).toHaveBeenCalledWith(
			'580e63fc8c9a982ac9b8b745',
			expect.objectContaining({
				displayName: 'Blog Posts',
				slug: 'posts',
				siteId: '580e63e98c9a982ac9b8b741',
				fields: [{ slug: 'title' }],
			}),
		);
	});

	it('evicts the cached collection after a field mutation', async () => {
		const plugin = webflow({ key: 'test-token' });
		const endpoints = endpointsAs<{
			collectionFields: {
				deleteCollectionField: (
					ctx: WebflowContext,
					input: { collection_id: string; field_id: string },
				) => Promise<unknown>;
			};
		}>(plugin);
		const ctxWithDb = testContext({
			db: {
				collections: { deleteByEntityId: jest.fn() },
			},
		});

		await endpoints.collectionFields.deleteCollectionField(ctxWithDb, {
			collection_id: '580e63fc8c9a982ac9b8b745',
			field_id: '6fc57a92be3e0461c1b3d9d6',
		});

		expect(ctxWithDb.db.collections.deleteByEntityId).toHaveBeenCalledWith(
			'580e63fc8c9a982ac9b8b745',
		);
	});

	it('accepts a null page slug from the Webflow pages API', () => {
		expect(
			WebflowPage.parse({
				id: '6596da6045e56dee495bcbba',
				title: 'Home',
				slug: null,
			}).slug,
		).toBeNull();
	});
});
