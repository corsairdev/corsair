import { logEventFromContext } from 'corsair/core';
import {
	AnchorText,
	Competitors,
	Jobs,
	LinkingDomains,
	Links,
	Locales,
	Metrics,
	Quota,
	TopPages,
} from './endpoints';
import type { CompetitorsResult } from './endpoints/types';
import type { MozContext } from './index';
import {
	anchorTextResponse,
	completeCompetitorCall,
	linkIntersectResponse,
	linkingDomainsResponse,
	linksListResponse,
	locales,
	metricsMultipleResponse,
	pendingAsyncCall,
	quota,
	siteMetrics,
	topPagesResponse,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const TOKEN = 'moz-token-123';

const ctx = { key: TOKEN };

// never parameters: negative cases pass values no schema accepts, so the
// shared signature stays unknown on both sides.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint(ctx as never, input as never);
}

// Positive cases keep the endpoint's real input and output types, so the
// assertions below typecheck against the schema outputs.
function invokeOk<
	Endpoint extends (ctx: MozContext, input: never) => Promise<unknown>,
>(endpoint: Endpoint, input: Parameters<Endpoint>[1]): ReturnType<Endpoint> {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint(ctx as never, input) as ReturnType<Endpoint>;
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	// unknown: the request body is whatever the client serialized.
	const sent = JSON.parse(String(init.body)) as {
		method?: string;
		params?: { data?: unknown };
	};
	return { url: new URL(url), init, sent };
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('quota.lookup', () => {
	it('calls quota.lookup and returns the quota object', async () => {
		respond({ id: 'id', jsonrpc: '2.0', result: { quota } });

		const result = await invokeOk(Quota.lookup, {
			path: 'api.limits.data.rows',
		});

		expect(lastRequest().sent.method).toBe('quota.lookup');
		expect(lastRequest().sent.params).toEqual({
			data: { path: 'api.limits.data.rows' },
		});
		expect(result.quota.allotted).toBe(750);
		expect(result.quota.overage).toBe(false);
	});
});

describe('locales.list', () => {
	it('lists the locales of an engine', async () => {
		respond({ id: 'id', jsonrpc: '2.0', result: locales });

		const result = await invokeOk(Locales.list, { engine: 'google' });

		expect(lastRequest().sent.method).toBe('metadata.locale.list');
		expect(result.locales).toContain('en-US');
	});

	it('rejects an engine outside the enum', async () => {
		await expect(
			invoke(Locales.list, { engine: 'duckduckgo' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('metrics.fetch', () => {
	it('fetches site metrics for one query', async () => {
		respond({
			id: 'id',
			jsonrpc: '2.0',
			result: {
				site_query: {
					query: 'moz.com',
					scope: 'domain',
					original_site_query: { query: 'moz.com', scope: 'domain' },
				},
				site_metrics: siteMetrics,
			},
		});

		const result = await invokeOk(Metrics.fetchMetrics, {
			site_query: { query: 'moz.com', scope: 'domain' },
		});

		expect(lastRequest().sent.method).toBe('data.site.metrics.fetch');
		expect(result.site_metrics.domain_authority).toBe(91);
		expect(result.site_metrics.spam_score).toBe(2);
	});

	it('rejects an unknown scope before sending', async () => {
		await expect(
			invoke(Metrics.fetchMetrics, {
				site_query: { query: 'moz.com', scope: 'internet' },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('metrics.fetchMultiple', () => {
	it('splits successes and failures per target', async () => {
		respond({ id: 'id', jsonrpc: '2.0', result: metricsMultipleResponse });

		const result = await invokeOk(Metrics.fetchMultiple, {
			site_queries: [
				{ query: 'moz.com', scope: 'domain' },
				{ query: 'moz.com/blog', scope: 'url' },
			],
		});

		expect(lastRequest().sent.method).toBe('data.site.metrics.fetch.multiple');
		expect(result.results_by_site).toHaveLength(1);
		expect(result.errors_by_site).toHaveLength(1);
		expect(result.errors_by_site[0]?.error.jsonrpcCode).toBe(-32655);
	});

	it('rejects an empty site_queries array', async () => {
		await expect(
			invoke(Metrics.fetchMultiple, { site_queries: [] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('links.list', () => {
	it('lists links and passes options through', async () => {
		respond({ id: 'id', jsonrpc: '2.0', result: linksListResponse });

		const result = await invokeOk(Links.list, {
			site_query: { query: 'moz.com/blog', scope: 'url' },
			options: {
				sort: 'source_link_propensity',
				filters: ['external', 'nofollow'],
			},
			offset: { limit: 1 },
		});

		const sent = lastRequest().sent;
		expect(sent.method).toBe('data.site.link.list');
		expect(sent.params).toEqual({
			data: {
				site_query: { query: 'moz.com/blog', scope: 'url' },
				options: {
					sort: 'source_link_propensity',
					filters: ['external', 'nofollow'],
				},
				offset: { limit: 1 },
			},
		});
		expect(result.links).toHaveLength(1);
		// The live example shows "" for a link that never disappeared.
		expect(result.links[0]?.date_disappeared).toBe('');
		expect(result.offset.token).toBe('AWrG9eXz5oaz');
	});

	it('rejects a limit above the documented maximum of 50', async () => {
		await expect(
			invoke(Links.list, {
				site_query: { query: 'moz.com', scope: 'domain' },
				offset: { limit: 51 },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects subdomains_limited_to_one without sort', async () => {
		await expect(
			invoke(Links.list, {
				site_query: { query: 'moz.com', scope: 'domain' },
				options: { subdomains_limited_to_one: ['blogspot.com'] },
			}),
		).rejects.toThrow('sort is required');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('links.intersect', () => {
	it('fetches link intersects for two targets', async () => {
		respond({ id: 'id', jsonrpc: '2.0', result: linkIntersectResponse });

		const result = await invokeOk(Links.intersect, {
			is_linking_to: [{ query: 'moz.com', scope: 'domain' }],
			not_linking_to: [{ query: 'ahrefs.com', scope: 'domain' }],
		});

		expect(lastRequest().sent.method).toBe('data.site.link.intersect.fetch');
		expect(result.link_intersects).toHaveLength(1);
		expect(result.link_intersects[0]?.domain_authority).toBe(86);
	});

	it('rejects more than six targets combined', async () => {
		const target = { query: 'example.com', scope: 'domain' as const };
		await expect(
			invoke(Links.intersect, {
				is_linking_to: [target, target, target, target],
				not_linking_to: [target, target, target],
			}),
		).rejects.toThrow('Up to 6 total targets');
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects minimum_matching_targets beyond is_linking_to length', async () => {
		await expect(
			invoke(Links.intersect, {
				is_linking_to: [{ query: 'moz.com', scope: 'domain' }],
				options: { minimum_matching_targets: 2 },
			}),
		).rejects.toThrow('minimum_matching_targets');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('linkingDomains.list', () => {
	it('lists linking domains', async () => {
		respond({ id: 'id', jsonrpc: '2.0', result: linkingDomainsResponse });

		const result = await invokeOk(LinkingDomains.list, {
			site_query: { query: 'moz.com', scope: 'domain' },
			options: { sort: 'source_domain_authority' },
		});

		expect(lastRequest().sent.method).toBe('data.site.linking-domain.list');
		expect(result.linking_domains).toHaveLength(1);
		expect(result.linking_domains[0]?.targeted_pages).toBe(12);
	});

	it('rejects multiple filters without external', async () => {
		await expect(
			invoke(LinkingDomains.list, {
				site_query: { query: 'moz.com', scope: 'domain' },
				options: { filters: ['follow', 'nofollow'] },
			}),
		).rejects.toThrow('external must be included');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('anchorText.list', () => {
	it('lists anchor texts', async () => {
		respond({ id: 'id', jsonrpc: '2.0', result: anchorTextResponse });

		const result = await invokeOk(AnchorText.list, {
			site_query: { query: 'moz.com', scope: 'domain' },
			offset: { limit: 5 },
		});

		expect(lastRequest().sent.method).toBe('data.site.anchor-text.list');
		expect(result.anchor_texts[0]?.text).toBe('seo guide');
	});
});

describe('topPages.list', () => {
	it('lists top pages for a domain', async () => {
		respond({ id: 'id', jsonrpc: '2.0', result: topPagesResponse });

		const result = await invokeOk(TopPages.list, {
			site_query: { query: 'moz.com', scope: 'domain' },
			options: { filter: 'status_200', sort: 'page_authority' },
		});

		expect(lastRequest().sent.method).toBe('data.site.top-page.list');
		expect(result.top_pages).toHaveLength(1);
		expect(result.top_pages[0]?.page_authority).toBe(45);
	});

	it('rejects a url scope, which top pages does not support', async () => {
		await expect(
			invoke(TopPages.list, {
				site_query: { query: 'moz.com/blog', scope: 'url' },
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('competitors.fetch', () => {
	it('starts the job and returns the async_call receipt', async () => {
		respond({
			id: 'id',
			jsonrpc: '2.0',
			result: { async_call: pendingAsyncCall },
		});

		const result = await invokeOk(Competitors.fetchCompetitors, {
			target_query: { query: 'moz.com', scope: 'domain', locale: 'en-US' },
		});

		expect(lastRequest().sent.method).toBe('data.site.competitor.fetch');
		expect(result.async_call.id).toBe(pendingAsyncCall.id);
		expect(result.async_call.status).toBe('pending');
	});
});

describe('jobs.lookup', () => {
	it('returns a completed call with competitors', async () => {
		respond({
			id: 'id',
			jsonrpc: '2.0',
			result: { async_call: completeCompetitorCall },
		});

		const result = await invokeOk(Jobs.lookup, {
			id: completeCompetitorCall.id,
		});

		expect(lastRequest().sent.method).toBe('async.call.lookup');
		expect(result.async_call.status).toBe('complete');
		// async_call.result is an open record; the competitor shape is what
		// the documented example shows.
		const competitors =
			(result.async_call.result as CompetitorsResult | null)?.competitors ?? [];
		expect(competitors[0]?.rivalry).toBe(60);
		expect(result.async_call.error).toBeNull();
	});

	it('returns a completed call that carries the failure in error', async () => {
		respond({
			id: 'id',
			jsonrpc: '2.0',
			result: {
				async_call: {
					...completeCompetitorCall,
					id: '18e5de71-af54-490d-8eb1-0596a4f68121',
					result: null,
					error: {
						code: -32653,
						status: 400,
						data: {},
						message: "We've thrown an error!",
					},
				},
			},
		});

		const result = await invokeOk(Jobs.lookup, {
			id: '18e5de71-af54-490d-8eb1-0596a4f68121',
		});

		expect(result.async_call.result).toBeNull();
		expect(result.async_call.error?.code).toBe(-32653);
		expect(mockLog).toHaveBeenCalled();
	});
});
