jest.mock('corsair/core', () => {
	const actual = jest.requireActual('corsair/core');
	return { ...actual, logEventFromContext: jest.fn().mockResolvedValue('evt') };
});

import type { FluxguardContext } from './index';
import { fluxguard } from './index';
import {
	accountResponse,
	addPageResponse,
	categoryCreateResponse,
	categoryListResponse,
	changeEvent,
	ignoredPageResponse,
	pageResponse,
	pageWithCategoryResponse,
	sampleResponse,
	webhookCreateResponse,
	webhookListResponse,
} from './test-fixtures';

function makeCtx(): FluxguardContext {
	const subset: Pick<FluxguardContext, 'key' | 'options'> = {
		key: 'fg-secret',
		options: {},
	};
	// Safe: the endpoints read only key, options and db from the context.
	return { ...subset, db: {}, endpoints: {} } as FluxguardContext;
}

function jsonResponse(body: unknown, init: ResponseInit = {}): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
		...init,
	});
}

function noContent(): Response {
	return new Response(null, { status: 204 });
}

describe('Fluxguard response parsing', () => {
	const endpoints = fluxguard({ key: 'fg-secret' }).endpoints!;
	let fetchMock: jest.SpyInstance<Promise<Response>, Parameters<typeof fetch>>;

	beforeEach(() => {
		fetchMock = jest.spyOn(globalThis, 'fetch');
	});
	afterEach(() => {
		fetchMock.mockRestore();
	});

	it('parses the account answer, with epoch-millisecond timestamps', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(accountResponse));

		const result = await endpoints.account.get(makeCtx(), {});

		expect(result.id).toBe(accountResponse.id);
		expect(result.status).toBe('active');
		expect(result.plan).toBe(0);
		expect(result.credits).toBe(200);
		expect(result.created).toBe(1602357421519);
		expect(result.flags?.warning).toEqual({
			name: 'warning',
			color: '#f7bc08',
			isDefault: true,
		});
	});

	it('parses the add-page answer', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(addPageResponse));

		const result = await endpoints.monitoring.addPage(makeCtx(), {
			url: 'https://example.org/',
		});

		expect(result).toEqual(addPageResponse);
	});

	it('parses a page whose categories are empty arrays', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(pageResponse));

		const result = await endpoints.monitoring.getPage(makeCtx(), {
			siteId: 's1',
			sessionId: 'se1',
			pageId: 'p1',
		});

		expect(result.id).toBe(pageResponse.id);
		expect(result.created).toBe(pageResponse.created);
		expect(result.siteCategories).toEqual([]);
		expect(result.pageCategories).toEqual([]);
		expect(result.session?.comparisonType).toBe('text');
	});

	it('parses category names as plain strings', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(pageWithCategoryResponse));

		const result = await endpoints.monitoring.getPage(makeCtx(), {
			siteId: 's1',
			sessionId: 'se1',
			pageId: 'p1',
		});

		expect(result.siteCategories).toEqual(
			pageWithCategoryResponse.siteCategories,
		);
		expect(result.pageCategories).toEqual([]);
	});

	it('parses a deleted page, which Fluxguard keeps with status ignore', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(ignoredPageResponse));

		const result = await endpoints.monitoring.getPage(makeCtx(), {
			siteId: 's1',
			sessionId: 'se1',
			pageId: 'p1',
		});

		expect(result.status).toBe('ignore');
	});

	it('turns the 204 for an unknown page into a clear error', async () => {
		fetchMock.mockResolvedValueOnce(noContent());

		await expect(
			endpoints.monitoring.getPage(makeCtx(), {
				siteId: 's1',
				sessionId: 'se1',
				pageId: 'p1',
			}),
		).rejects.toThrow(/has no page p1/);
	});

	it('fills in category arrays the API omitted', async () => {
		const { siteCategories: _s, pageCategories: _p, ...rest } = pageResponse;
		fetchMock.mockResolvedValueOnce(jsonResponse(rest));

		const result = await endpoints.monitoring.getPage(makeCtx(), {
			siteId: 's1',
			sessionId: 'se1',
			pageId: 'p1',
		});

		expect(result.siteCategories).toEqual([]);
		expect(result.pageCategories).toEqual([]);
	});

	it('parses the bare webhook array', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(webhookListResponse));

		const result = await endpoints.webhooks.list(makeCtx(), {});

		// The synthetic secret lives in one place; this asserts the endpoint
		// preserved the fixture rather than re-typing it here.
		expect(result.webhooks).toEqual(webhookListResponse);
	});

	it('returns an empty list for an account with no webhooks', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse([]));

		const result = await endpoints.webhooks.list(makeCtx(), {});

		expect(result.webhooks).toEqual([]);
	});

	it('echoes the webhook url beside the created id', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(webhookCreateResponse));

		const result = await endpoints.webhooks.create(makeCtx(), {
			url: 'https://example.org/hooks',
		});

		expect(result).toEqual({
			id: webhookCreateResponse.id,
			url: 'https://example.org/hooks',
		});
	});

	it('fails when the webhook create answer has no id', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));

		await expect(
			endpoints.webhooks.create(makeCtx(), {
				url: 'https://example.org/hooks',
			}),
		).rejects.toThrow(/no webhook id/);
	});

	it('parses the keyed category map and the created category', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(categoryListResponse));

		// Fluxguard stores the id as the map key, so the endpoint adds it back
		// as a field; compare against the fixture with its key folded in.
		const [categoryId, category] = Object.entries(categoryListResponse)[0]!;
		const list = await endpoints.categories.list(makeCtx(), {});
		expect(list.categories).toEqual([{ id: categoryId, ...category }]);

		fetchMock.mockResolvedValueOnce(jsonResponse(categoryCreateResponse));
		const created = await endpoints.categories.create(makeCtx(), {
			name: categoryCreateResponse.name,
		});
		expect(created.id).toBe(categoryCreateResponse.id);
		expect(created.name).toBe(categoryCreateResponse.name);
	});

	it('returns no categories for the empty object an empty account answers', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse({}));

		const result = await endpoints.categories.list(makeCtx(), {});

		expect(result.categories).toEqual([]);
	});

	it('parses the sample array', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse(sampleResponse));

		const result = await endpoints.webhooks.sample(makeCtx(), {});

		expect(result.samples).toHaveLength(1);
		const sample = result.samples[0]!;
		expect(sample.orgId).toBe(changeEvent.orgId);
		expect(sample.comparisonType).toBe('text');
		expect(sample.files).toEqual(sampleResponse[0]!.files);
	});

	it('rejects a body whose known field has the wrong type', async () => {
		fetchMock.mockResolvedValueOnce(
			jsonResponse({ ...pageResponse, versions: 'forty-one' }),
		);

		await expect(
			endpoints.monitoring.getPage(makeCtx(), {
				siteId: 's1',
				sessionId: 'se1',
				pageId: 'p1',
			}),
		).rejects.toThrow(/versions/);
	});

	it('rejects a page body that is an array', async () => {
		fetchMock.mockResolvedValueOnce(jsonResponse([pageResponse]));

		await expect(
			endpoints.monitoring.getPage(makeCtx(), {
				siteId: 's1',
				sessionId: 'se1',
				pageId: 'p1',
			}),
		).rejects.toThrow();
	});

	it('rejects a webhook list that is a bare string', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('not a list', {
				status: 200,
				headers: { 'Content-Type': 'text/plain' },
			}),
		);

		await expect(endpoints.webhooks.list(makeCtx(), {})).rejects.toThrow(
			/unexpected webhook list/,
		);
	});
});
