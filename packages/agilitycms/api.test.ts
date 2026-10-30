import { logEventFromContext } from 'corsair/core';
import { ApiError, request } from 'corsair/http';
import { makeAgilityCmsRequest } from './client';
import {
	ContentItemSchema,
	ContentModelSchema,
	PageModuleSchema,
	PageSchema,
	SitemapNodeSchema,
	SyncItemSchema,
	SyncPageSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import type { AgilityCmsContext } from './index';
import { agilitycms, agilitycmsEndpointSchemas } from './index';

jest.mock('corsair/core', () => {
	class AuthMissingError extends Error {
		constructor(plugin: string, authType: string) {
			super(`Missing ${authType} for ${plugin}`);
			this.name = 'AuthMissingError';
		}
	}
	return {
		AuthMissingError,
		logEventFromContext: jest.fn(),
	};
});

jest.mock('corsair/http', () => {
	const original = jest.requireActual('corsair/http');
	return {
		...original,
		request: jest.fn(),
	};
});

const mockRequest = request as jest.Mock;
const mockLog = jest.mocked(logEventFromContext);

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

const mockCtx = {
	key: 'test-api-key',
	$getAccountId: () => 'test-account-id',
	options: {},
	logEvent: jest.fn(),
	db: {},
	keyBuilder: async () => 'test-api-key',
} as unknown as AgilityCmsContext;

const contentItemFixture = {
	contentID: 101,
	properties: {
		state: 2,
		modified: '2023-01-01T00:00:00.000Z',
		versionID: 1,
		referenceName: 'posts',
		definitionName: 'Post',
		itemOrder: 1,
	},
	fields: {
		title: 'Hello World',
	},
};

const pageFixture = {
	pageID: 2,
	name: 'home',
	path: '/',
	title: 'Home Page',
	templateName: 'MainTemplate',
	zones: {
		MainZone: [
			{
				module: 'Hero',
				item: { contentID: 101 },
			},
		],
	},
};

const contentModelFixture = {
	id: 50,
	referenceName: 'posts',
	displayName: 'Blog Post',
	description: 'Model for blog articles',
	fields: [{ name: 'title', type: 'Text' }],
};

const pageModuleFixture = {
	id: 60,
	displayName: 'Hero Banner',
	description: 'Top banner module',
	fields: [{ name: 'heading', type: 'Text' }],
};

const sitemapNodeFixture = {
	pageID: 2,
	title: 'Home',
	menuText: 'Home',
	path: '/',
	visible: { menu: true, sitemap: true },
};

const syncItemFixture = {
	contentID: 101,
	properties: { state: 2 },
	fields: { title: 'Updated' },
};

const syncPageFixture = {
	pageID: 2,
	name: 'home',
	title: 'Home',
	templateName: 'Main',
};

function classify(error: Error): string {
	const name = (
		Object.keys(errorHandlers) as Array<keyof typeof errorHandlers>
	).find((key) => errorHandlers[key].match(error));
	return name ?? 'none';
}

function httpError(status: number, message: string): ApiError {
	return new ApiError(
		{ method: 'GET', url: 'https://api.aglty.io/guid/fetch/en-us/models' },
		{
			url: 'https://api.aglty.io/guid/fetch/en-us/models',
			ok: false,
			status,
			statusText: 'Error',
			body: { message },
		},
		message,
	);
}

describe('Agility CMS Zod Schemas', () => {
	it('validates ContentItemSchema and rejects invalid', () => {
		const parsed = ContentItemSchema.safeParse(contentItemFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.contentID).toBe(101);
			expect(parsed.data.fields.title).toBe('Hello World');
		}
		expect(ContentItemSchema.safeParse({ contentID: 'invalid' }).success).toBe(
			false,
		);
	});

	it('validates PageSchema and rejects invalid', () => {
		const parsed = PageSchema.safeParse(pageFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.pageID).toBe(2);
			expect(parsed.data.name).toBe('home');
		}
		expect(PageSchema.safeParse({ pageID: 'invalid' }).success).toBe(false);
	});

	it('validates ContentModelSchema and rejects invalid', () => {
		const parsed = ContentModelSchema.safeParse(contentModelFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe(50);
			expect(parsed.data.displayName).toBe('Blog Post');
		}
		expect(ContentModelSchema.safeParse({ id: 'invalid' }).success).toBe(false);
	});

	it('validates PageModuleSchema and rejects invalid', () => {
		const parsed = PageModuleSchema.safeParse(pageModuleFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.id).toBe(60);
			expect(parsed.data.displayName).toBe('Hero Banner');
		}
		expect(PageModuleSchema.safeParse({ id: 'invalid' }).success).toBe(false);
	});

	it('validates SitemapNodeSchema and rejects invalid', () => {
		const parsed = SitemapNodeSchema.safeParse(sitemapNodeFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.pageID).toBe(2);
			expect(parsed.data.path).toBe('/');
		}
		expect(SitemapNodeSchema.safeParse({ pageID: 'invalid' }).success).toBe(
			false,
		);
	});

	it('validates SyncItemSchema and rejects invalid', () => {
		const parsed = SyncItemSchema.safeParse(syncItemFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.contentID).toBe(101);
		}
		expect(SyncItemSchema.safeParse({ contentID: 'invalid' }).success).toBe(
			false,
		);
	});

	it('validates SyncPageSchema and rejects invalid', () => {
		const parsed = SyncPageSchema.safeParse(syncPageFixture);
		expect(parsed.success).toBe(true);
		if (parsed.success) {
			expect(parsed.data.pageID).toBe(2);
		}
		expect(SyncPageSchema.safeParse({ pageID: 'invalid' }).success).toBe(false);
	});
});

describe('Agility CMS plugin structure', () => {
	it('exposes all 9 operations with schemas and no webhooks', () => {
		const plugin = agilitycms();
		const endpoints = plugin.endpoints as Record<string, unknown>;
		const paths = endpointPaths(endpoints).sort();

		expect(countLeaves(endpoints)).toBe(9);
		expect(Object.keys(plugin.endpointMeta ?? {}).sort()).toEqual(paths);
		expect(Object.keys(agilitycmsEndpointSchemas).sort()).toEqual(paths);
		expect(plugin.webhooks).toEqual({});
		expect(typeof plugin.pluginWebhookMatcher).toBe('function');
	});

	it('supports api key auth configuration', () => {
		const plugin = agilitycms();
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.authConfig).toEqual({
			api_key: { account: ['tenant_external_id'] },
		});
	});
});

describe('Agility CMS request client', () => {
	beforeEach(() => {
		mockRequest.mockReset();
		mockRequest.mockResolvedValue(contentItemFixture);
	});

	it('sends APIKey header and constructs correct URL path', async () => {
		await makeAgilityCmsRequest(
			'test-guid',
			'test-api-key',
			'fetch',
			'en-us/item/101',
		);

		expect(mockRequest).toHaveBeenCalledWith(
			expect.objectContaining({
				BASE: 'https://api.aglty.io/test-guid/fetch',
				HEADERS: expect.objectContaining({
					APIKey: 'test-api-key',
					Accept: 'application/json',
				}),
			}),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/item/101',
			}),
		);
	});

	it('passes through ApiError directly for rate limit and auth handlers', async () => {
		mockRequest.mockRejectedValue(httpError(429, 'Rate limited'));

		await expect(
			makeAgilityCmsRequest(
				'test-guid',
				'test-api-key',
				'fetch',
				'en-us/item/101',
			),
		).rejects.toBeInstanceOf(ApiError);
	});
});

describe('Agility CMS endpoint handlers', () => {
	const plugin = agilitycms({ key: 'test-api-key' });
	const endpoints = plugin.endpoints as any;

	beforeEach(() => {
		mockRequest.mockReset();
		mockLog.mockReset();
	});

	it('executes content.getPage', async () => {
		mockRequest.mockResolvedValueOnce(pageFixture);
		const result = await endpoints.content.getPage(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			pageId: 2,
			apiType: 'fetch',
		});
		expect(result).toEqual(pageFixture);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/page/2',
			}),
		);
	});

	it('executes content.getItem', async () => {
		mockRequest.mockResolvedValueOnce(contentItemFixture);
		const result = await endpoints.content.getItem(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			contentId: 101,
			apiType: 'fetch',
		});
		expect(result).toEqual(contentItemFixture);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/item/101',
			}),
		);
	});

	it('executes content.getList with pagination query', async () => {
		const listResponse = { totalCount: 1, items: [contentItemFixture] };
		mockRequest.mockResolvedValueOnce(listResponse);
		const result = await endpoints.content.getList(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			referenceName: 'posts',
			take: 20,
			skip: 0,
			sort: 'properties.modified',
			direction: 'desc',
			apiType: 'fetch',
		});
		expect(result).toEqual(listResponse);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/list/posts',
				query: {
					take: 20,
					skip: 0,
					sort: 'properties.modified',
					direction: 'desc',
				},
			}),
		);
	});

	it('executes content.getContentModels', async () => {
		mockRequest.mockResolvedValueOnce([contentModelFixture]);
		const result = await endpoints.content.getContentModels(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			apiType: 'fetch',
		});
		expect(result).toEqual([contentModelFixture]);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/models',
			}),
		);
	});

	it('executes content.getPageModules', async () => {
		mockRequest.mockResolvedValueOnce([pageModuleFixture]);
		const result = await endpoints.content.getPageModules(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			apiType: 'fetch',
		});
		expect(result).toEqual([pageModuleFixture]);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/models',
			}),
		);
	});

	it('executes content.getSitemapFlat', async () => {
		const sitemapResponse = { '/': sitemapNodeFixture };
		mockRequest.mockResolvedValueOnce(sitemapResponse);
		const result = await endpoints.content.getSitemapFlat(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			channelName: 'website',
			apiType: 'fetch',
		});
		expect(result).toEqual(sitemapResponse);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/sitemap/flat/website',
			}),
		);
	});

	it('executes content.getLogs', async () => {
		const logsResponse = { syncToken: '12345', items: [syncItemFixture] };
		mockRequest.mockResolvedValueOnce(logsResponse);
		const result = await endpoints.content.getLogs(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			syncToken: '0',
			pageSize: 100,
			apiType: 'fetch',
		});
		expect(result).toEqual(logsResponse);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/sync/items',
				query: { syncToken: '0', pageSize: 100 },
			}),
		);
	});

	it('executes content.syncPages', async () => {
		const syncResponse = { syncToken: '54321', items: [syncPageFixture] };
		mockRequest.mockResolvedValueOnce(syncResponse);
		const result = await endpoints.content.syncPages(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			syncToken: '0',
			pageSize: 50,
			apiType: 'fetch',
		});
		expect(result).toEqual(syncResponse);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/sync/pages',
				query: { syncToken: '0', pageSize: 50 },
			}),
		);
	});

	it('executes content.getApiTypes', async () => {
		const typesResponse = { ContentStates: ['Staged', 'Published'] };
		mockRequest.mockResolvedValueOnce(typesResponse);
		const result = await endpoints.content.getApiTypes(mockCtx, {
			instanceGuid: 'guid-123',
			locale: 'en-us',
			apiType: 'fetch',
		});
		expect(result).toEqual(typesResponse);
		expect(mockRequest).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				method: 'GET',
				url: 'en-us/types',
			}),
		);
	});
});

describe('Agility CMS error handler classification', () => {
	it('classifies auth, rate-limit, and default errors', () => {
		expect(classify(httpError(401, 'Unauthorized'))).toBe('AUTH_ERROR');
		expect(classify(httpError(429, 'Rate limit exceeded'))).toBe(
			'RATE_LIMIT_ERROR',
		);
		expect(classify(httpError(500, 'Server Error'))).toBe('DEFAULT');
	});

	it('does not retry auth errors and retries rate limit errors', async () => {
		expect((await errorHandlers.AUTH_ERROR.handler()).maxRetries).toBe(0);
		expect(
			(
				await errorHandlers.RATE_LIMIT_ERROR.handler(
					httpError(429, 'Too many requests'),
				)
			).maxRetries,
		).toBeGreaterThan(0);
	});
});
