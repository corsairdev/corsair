import { logEventFromContext } from 'corsair/core';
import { SimilarwebAPIError, segment } from './client';
import { Account, Apps, Categories, Websites } from './endpoints';
import type { UnknownJson } from './json';
import {
	appDescribe,
	appRank,
	capabilities,
	categories,
	countryRank,
	globalRank,
	industryRank,
	topSites,
	usage,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'similarweb-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint({ key: API_KEY } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON or plain text.
function respond(body: UnknownJson, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(typeof body === 'string' ? body : JSON.stringify(body), {
			status,
			headers: {
				'Content-Type':
					typeof body === 'string' ? 'text/plain' : 'application/json',
			},
		}),
	);
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		allQuery: parsed.searchParams,
		method: init.method,
		headers: new Headers(init.headers),
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.similarweb.com');
	// The key travels as a query parameter, not a header.
	expect(sent.query.api_key).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
	expect(sent.headers.get('x-api-key')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('websites.globalRank', () => {
	it('GETs the global-rank route with the key in the query', async () => {
		respond(globalRank);

		const result = await invoke(Websites.globalRank, {
			domain: 'cnn.com',
			start_date: '2023-01',
			end_date: '2023-03',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/website/cnn.com/global-rank/global-rank',
		});
		expect(lastRequest().query).toMatchObject({
			start_date: '2023-01',
			end_date: '2023-03',
		});
		expect(result).toMatchObject({ global_rank: globalRank.global_rank });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'similarweb.websites.globalRank',
			{
				domain: 'cnn.com',
				startDate: '2023-01',
				endDate: '2023-03',
				points: 3,
			},
			'completed',
		);
	});

	it('lower-cases the domain, because a capitalised one answers 401', async () => {
		respond(globalRank);

		await invoke(Websites.globalRank, { domain: 'CNN.COM' });

		expect(lastRequest().path).toBe(
			'/v1/website/cnn.com/global-rank/global-rank',
		);
	});

	it('sends no dates when the caller omits them', async () => {
		respond(globalRank);

		await invoke(Websites.globalRank, { domain: 'cnn.com' });

		expect(lastRequest().query).toEqual({ api_key: API_KEY });
	});

	it('rejects a start_date with no end_date, which the API would silently ignore', async () => {
		await expect(
			invoke(Websites.globalRank, {
				domain: 'cnn.com',
				start_date: '2023-01',
			}),
		).rejects.toThrow(/Supply both start_date and end_date/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a date that is not YYYY-MM', async () => {
		await expect(
			invoke(Websites.globalRank, {
				domain: 'cnn.com',
				start_date: 'January 2023',
				end_date: '2023-03',
			}),
		).rejects.toThrow(/A month as YYYY-MM/);
	});
});

describe('websites.countryRank', () => {
	it('sends the country code and returns the series', async () => {
		respond(countryRank);

		const result = await invoke(Websites.countryRank, {
			domain: 'cnn.com',
			country: 'US',
			start_date: '2023-01',
			end_date: '2023-03',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/website/cnn.com/country-rank/country-rank');
		expect(sent.query.country).toBe('us');
		expect(result).toMatchObject({ country_rank: countryRank.country_rank });
	});

	it('requires a country', async () => {
		await expect(
			invoke(Websites.countryRank, { domain: 'cnn.com' }),
		).rejects.toThrow(/country/);
	});
});

describe('websites.industryRank', () => {
	it('returns the category and its rank', async () => {
		respond(industryRank);

		const result = await invoke(Websites.industryRank, {
			domain: 'amazon.com',
		});

		expect(lastRequest().path).toBe(
			'/v1/website/amazon.com/category-rank/category-rank',
		);
		expect(result).toMatchObject({
			category: 'E-commerce_and_Shopping/Marketplace',
			rank: 1,
		});
	});

	it('encodes a path so a slash in the domain cannot escape the segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});
});

describe('websites.topSites', () => {
	it('GETs the similar-rank base with the limit', async () => {
		respond(topSites);

		const result = await invoke(Websites.topSites, { limit: 3 });

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/similar-rank/top-sites');
		expect(sent.query).toMatchObject({ limit: '3', api_key: API_KEY });
		expect(result).toMatchObject({ top_sites: topSites.top_sites });
	});

	it('rejects a limit above the documented maximum of 5000', async () => {
		await expect(invoke(Websites.topSites, { limit: 5001 })).rejects.toThrow(
			/limit/,
		);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('apps.rank', () => {
	it('GETs the app rank for the store and device', async () => {
		respond(appRank);

		const result = await invoke(Apps.rank, {
			store: 'Google',
			app_id: 'com.whatsapp',
			country: 'us',
			mode: 'free',
			device: 'androidphone',
			duration: 30,
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/v1/app/Google/com.whatsapp/rank/app-store-rank');
		expect(sent.query).toMatchObject({
			country: 'us',
			mode: 'free',
			device: 'androidphone',
			duration: '30',
		});
		expect(result).toMatchObject({ ranks: appRank.ranks });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'similarweb.apps.rank',
			{ store: 'Google', appId: 'com.whatsapp', country: 'us', points: 2 },
			'completed',
		);
	});

	it('rejects a store the API does not accept', async () => {
		await expect(
			invoke(Apps.rank, {
				store: 'Amazon',
				app_id: 'com.whatsapp',
				country: 'us',
			}),
		).rejects.toThrow(/store/);
	});

	it('rejects a device that does not match the store pairing the API documents', async () => {
		await expect(
			invoke(Apps.rank, {
				store: 'Google',
				app_id: 'com.whatsapp',
				country: 'us',
				device: 'iphone',
			}),
		).rejects.toThrow(/device/);
	});
});

describe('apps.describe', () => {
	it('GETs the describe route and reports the accepted values', async () => {
		respond(appDescribe);

		const result = await invoke(Apps.describe, {});

		expect(lastRequest().path).toBe('/v1/app/rank/describe');
		expect(result).toMatchObject({
			app_rank: { countries: appDescribe.app_rank.countries },
		});
	});
});

describe('categories.list', () => {
	it('wraps the bare category tree', async () => {
		respond(categories);

		const result = await invoke(Categories.list, {});

		expect(lastRequest().path).toBe('/v1/TopSites/categories');
		expect(result).toEqual({ categories });
	});

	it('rejects an answer that is not a tree', async () => {
		respond('<html>');

		await expect(invoke(Categories.list, {})).rejects.toThrow(
			'categories.list expected a category tree from Similarweb.',
		);
	});
});

describe('capabilities.get', () => {
	it('wraps the capability map', async () => {
		respond(capabilities);

		const result = await invoke(Account.get, {});

		expect(lastRequest().path).toBe('/capabilities');
		expect(result).toEqual({ capabilities });
	});
});

describe('usage.get', () => {
	it('unwraps allowance and remaining, and derives used', async () => {
		respond(usage);

		const result = await invoke(Account.usage, {});

		expect(lastRequest().path).toBe('/user-capabilities');
		expect(result).toEqual({
			allowance: 10000,
			user_remaining: 4989,
			used: 5011,
		});
	});

	it('leaves used undefined when a number is missing', async () => {
		respond({ allowance: 10000 });

		const result = await invoke(Account.usage, {});

		expect(result).toEqual({
			allowance: 10000,
			user_remaining: undefined,
			used: undefined,
		});
	});
});

describe('client error handling', () => {
	it('describes a plain-text 401 and keeps the key out of util.inspect', async () => {
		respond('invalid API key', 401);
		const util = await import('node:util');

		const error = await invoke(Websites.globalRank, {
			domain: 'cnn.com',
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(SimilarwebAPIError);
		const failure = error as SimilarwebAPIError;
		expect(failure.status).toBe(401);
		expect(failure.reason).toBe('invalid API key');
		expect(failure.isAuthError).toBe(true);
		expect(failure.message).toContain('invalid API key');
		expect(util.inspect(error)).not.toContain(API_KEY);
		expect(failure.message).not.toContain(API_KEY);
	});

	it('treats a 403 as an account problem too', async () => {
		respond('no credits left', 403);

		const error = await invoke(Websites.globalRank, {
			domain: 'cnn.com',
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect((error as SimilarwebAPIError).isAuthError).toBe(true);
	});

	it('reads a 404 as data not found rather than an auth problem', async () => {
		respond('Data not found', 404);

		const error = await invoke(Websites.globalRank, {
			domain: 'nope.com',
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		const failure = error as SimilarwebAPIError;
		expect(failure.isDataNotFound).toBe(true);
		expect(failure.isAuthError).toBe(false);
	});
});
