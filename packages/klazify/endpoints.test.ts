import { logEventFromContext } from 'corsair/core';
import { KlazifyAPIError } from './client';
import {
	Categories,
	Categorize,
	Company,
	Discovery,
	Domain,
	Logo,
	SimilarDomains,
	Tech,
	Traffic,
} from './endpoints';
import {
	categorize,
	categorizeSparse,
	categoryListV1,
	categoryListV2,
	company,
	discovery,
	discoveryLowerBound,
	domainRegistration,
	iabCategories,
	logo,
	logoMissing,
	planRequired,
	realtime,
	similarDomains,
	tech,
	traffic,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'klazify-test-token';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. The shared return is the raw body, so it is
// unknown: the schema under test decides each endpoint's real shape.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint({ key: API_KEY } as never, input as never);
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
	return {
		url,
		init,
		headers: new Headers(init.headers),
		// unknown: the body is whatever the endpoint serialised.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

function expectAuthenticated() {
	expect(lastRequest().headers.get('authorization')).toBe(`Bearer ${API_KEY}`);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('categorize.all', () => {
	it('POSTs the url and returns every block', async () => {
		respond(categorize);

		const result = await invoke(Categorize.all, { url: 'https://cbsnews.com' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.klazify.com/api/categorize',
			body: { url: 'https://cbsnews.com' },
		});
		expect(result).toEqual(categorize);
	});

	it('accepts an email as the target instead of a url', async () => {
		respond(categorize);

		await invoke(Categorize.all, { email: 'user@cbsnews.com' });

		expect(lastRequest().body).toEqual({ email: 'user@cbsnews.com' });
	});

	// The flag is only sent when asked for, so an omitted value stays the
	// service default rather than turning into false.
	it('sends refresh only when set', async () => {
		respond(categorize);
		await invoke(Categorize.all, { url: 'https://cbsnews.com' });
		expect(lastRequest().body).toEqual({ url: 'https://cbsnews.com' });

		respond(categorize);
		await invoke(Categorize.all, { url: 'https://cbsnews.com', refresh: true });
		expect(lastRequest().body).toEqual({
			url: 'https://cbsnews.com',
			refresh: true,
		});
	});

	// Klazify requires a target, so this fails before a request is spent.
	it('rejects a body with neither url nor email', async () => {
		await expect(invoke(Categorize.all, {})).rejects.toThrow(
			/`url` or `email`/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// A logo and company block can both be absent, which the docs allow.
	it('accepts an answer with no logo and no company block', async () => {
		respond(categorizeSparse);

		const result = (await invoke(Categorize.all, {
			url: 'https://example.com',
		})) as typeof categorizeSparse;

		expect(result.domain.logo_url).toBeNull();
	});

	it('rejects an answer missing the domain block', async () => {
		respond({ success: true });

		await expect(
			invoke(Categorize.all, { url: 'https://cbsnews.com' }),
		).rejects.toThrow();
	});
});

describe('categorize.realtime', () => {
	it('POSTs to the real-time route', async () => {
		respond(realtime);

		const result = await invoke(Categorize.realtime, {
			url: 'https://cbsnews.com',
			refresh: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.klazify.com/api/real_time_categorization',
			body: { url: 'https://cbsnews.com', refresh: true },
		});
		expect(result).toEqual(realtime);
	});
});

describe('categories.iab', () => {
	it('POSTs to the IAB route and keeps the dynamic IAB keys', async () => {
		respond(iabCategories);

		const result = (await invoke(Categories.iab, {
			url: 'https://cbsnews.com',
		})) as typeof iabCategories;

		expectAuthenticated();
		expect(lastRequest().url).toBe(
			'https://www.klazify.com/api/domain_iab_categories',
		);
		// The IAB labels are dynamic sibling keys, so they pass through.
		expect(result.domain.categories[0]?.IAB12).toBe('News');
		expect(result.domain.categories[0]?.['IAB-599']).toBe(
			'Technology & Computing',
		);
	});
});

describe('company.get', () => {
	it('POSTs to the company route', async () => {
		respond(company);

		const result = await invoke(Company.get, { url: 'https://cbsnews.com' });

		expectAuthenticated();
		expect(lastRequest().url).toBe(
			'https://www.klazify.com/api/domain_company',
		);
		expect(result).toEqual(company);
	});

	// The docs mark revenue, funding and state as possibly null.
	it('accepts null company fields', async () => {
		respond({
			success: true,
			objects: {
				company: { name: 'Sparse Co', city: null, revenue: null, raised: null },
			},
		});

		const result = (await invoke(Company.get, {
			url: 'https://example.com',
		})) as { objects: { company: { city: string | null } } };

		expect(result.objects.company.city).toBeNull();
	});
});

describe('tech.get', () => {
	it('POSTs to the tech route and returns the identifiers', async () => {
		respond(tech);

		const result = (await invoke(Tech.get, {
			url: 'https://cbsnews.com',
		})) as typeof tech;

		expectAuthenticated();
		expect(lastRequest().url).toBe('https://www.klazify.com/api/domain_tech');
		expect(result.objects.company.tech).toContain('wordpress');
	});

	it('accepts an empty tech list', async () => {
		respond({
			success: true,
			domain: { domain_url: 'https://example.com' },
			objects: { company: { tech: [] } },
		});

		const result = (await invoke(Tech.get, {
			url: 'https://example.com',
		})) as { objects: { company: { tech: string[] } } };

		expect(result.objects.company.tech).toEqual([]);
	});
});

describe('logo.get', () => {
	it('POSTs to the logo route', async () => {
		respond(logo);

		const result = (await invoke(Logo.get, {
			url: 'https://cbsnews.com',
		})) as typeof logo;

		expectAuthenticated();
		expect(lastRequest().url).toBe('https://www.klazify.com/api/domain_logo');
		expect(result.domain.logo_url).toContain('klazify');
	});

	// A missing logo is an empty string or null, not a failure.
	it('accepts an empty logo_url', async () => {
		respond(logoMissing);

		const result = (await invoke(Logo.get, {
			url: 'https://example.com',
		})) as typeof logo;

		expect(result.domain.logo_url).toBe('');
	});
});

describe('domain.get', () => {
	it('POSTs to the expiration route', async () => {
		respond(domainRegistration);

		const result = await invoke(Domain.get, { url: 'https://apple.com' });

		expectAuthenticated();
		expect(lastRequest().url).toBe(
			'https://www.klazify.com/api/domain_expiration',
		);
		expect(result).toEqual(domainRegistration);
	});
});

describe('similarDomains.get', () => {
	it('POSTs to the similar-domain route', async () => {
		respond(similarDomains);

		const result = (await invoke(SimilarDomains.get, {
			url: 'https://cbsnews.com',
		})) as typeof similarDomains;

		expectAuthenticated();
		expect(lastRequest().url).toBe(
			'https://www.klazify.com/api/similar_domain',
		);
		expect(result.domain.similar_domains).toHaveLength(2);
	});
});

describe('traffic.get', () => {
	it('POSTs to the traffic route and keeps the decimal strings', async () => {
		respond(traffic);

		const result = (await invoke(Traffic.get, {
			url: 'https://cbsnews.com',
		})) as typeof traffic;

		expectAuthenticated();
		expect(lastRequest().url).toBe(
			'https://www.klazify.com/api/domain_traffic_intelligence',
		);
		// Klazify sends these as strings, not numbers.
		expect(result.traffic_intelligence.engagement?.bounce_rate).toBe('0.607');
		expect(result.traffic_intelligence.global_rank).toBe(765);
	});

	it('accepts an answer with no traffic block', async () => {
		respond({ success: true });

		const result = (await invoke(Traffic.get, {
			url: 'https://example.com',
		})) as { success: boolean };

		expect(result.success).toBe(true);
	});
});

describe('categories.listV1 / listV2', () => {
	it('GETs the v1 taxonomy', async () => {
		respond(categoryListV1);

		const result = await invoke(Categories.listV1, {});

		expectAuthenticated();
		const sent = lastRequest();
		expect(sent.url).toBe('https://www.klazify.com/api/list-category/v1');
		expect(sent.init.body).toBeUndefined();
		expect(result).toEqual(categoryListV1);
	});

	it('GETs the v2 taxonomy', async () => {
		respond(categoryListV2);

		const result = (await invoke(
			Categories.listV2,
			{},
		)) as typeof categoryListV2;

		expect(lastRequest().url).toBe(
			'https://www.klazify.com/api/list-category/v2',
		);
		expect(result.count).toBe(1091);
	});

	it('rejects a list whose count is absent', async () => {
		respond({ success: true, version: 'v1', categories: [] });

		await expect(invoke(Categories.listV1, {})).rejects.toThrow();
	});
});

describe('discovery.search', () => {
	it('POSTs the filters and returns the paging counts', async () => {
		respond(discovery);

		const result = (await invoke(Discovery.search, {
			top_n: 100000,
			filters: { category: 'Shopping', country: 'US', tech: 'shopify' },
			page: 1,
		})) as typeof discovery;

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			url: 'https://www.klazify.com/api/discovery',
			body: {
				top_n: 100000,
				filters: { category: 'Shopping', country: 'US', tech: 'shopify' },
				page: 1,
			},
		});
		expect(result.total_pages).toBe(43);
	});

	it('sends an empty body when nothing is given', async () => {
		respond(discovery);

		await invoke(Discovery.search, {});

		expect(lastRequest().body).toEqual({});
	});

	// Only the stored employee buckets are accepted; a legacy spelling would be
	// mapped server-side but cannot be relied on.
	it('rejects an employee range outside the documented buckets', async () => {
		await expect(
			invoke(Discovery.search, { filters: { employees: '51-200' } }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a page beyond the documented maximum', async () => {
		await expect(invoke(Discovery.search, { page: 1001 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	// A tld-filtered search can report a lower bound rather than an exact count.
	it('keeps the lower-bound marker when present', async () => {
		respond(discoveryLowerBound);

		const result = (await invoke(Discovery.search, {
			filters: { tld: 'com.br' },
		})) as typeof discoveryLowerBound;

		expect(result.total_is_lower_bound).toBe(true);
	});
});

describe('plan restriction', () => {
	// Every endpoint answers this while the account is on the free plan, so the
	// error has to reach the caller with its meaning intact.
	it('surfaces the plan-required rejection from any endpoint', async () => {
		respond(planRequired, 401);

		await expect(
			invoke(Categorize.all, { url: 'https://cbsnews.com' }),
		).rejects.toThrow(KlazifyAPIError);
	});
});

describe('logging', () => {
	it('records which kind of target was classified', async () => {
		respond(categorize);

		await invoke(Categorize.all, { email: 'user@cbsnews.com' });

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'klazify.categorize.all',
			expect.objectContaining({ target: 'email', categories: 2 }),
			'completed',
		);
	});

	// An email is a person's address, so it must not reach the event log.
	it('does not log the email target', async () => {
		respond(categorize);

		await invoke(Categorize.all, { email: 'someone@private-client.com' });

		expect(JSON.stringify(mockLog.mock.calls.at(-1))).not.toContain(
			'someone@private-client.com',
		);
	});
});
