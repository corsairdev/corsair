import { AuthMissingError, logEventFromContext } from 'corsair/core';
import {
	BrightDataAPIError,
	BrightDataRateLimitError,
	makeBrightDataRequest,
} from './client';
import { crawlApi } from './endpoints/crawl-api';
import { filterDataset } from './endpoints/filter-dataset';
import { getAvailableCities } from './endpoints/get-available-cities';
import { getAvailableCountries } from './endpoints/get-available-countries';
import { getSnapshotResults } from './endpoints/get-snapshot-results';
import { getSnapshotStatus } from './endpoints/get-snapshot-status';
import { listDatasets } from './endpoints/list-datasets';
import { listWebUnlockerZones } from './endpoints/list-web-unlocker-zones';
import { serpSearch } from './endpoints/serp-search';
import {
	BrightDataEndpointInputSchemas,
	BrightDataEndpointOutputSchemas,
} from './endpoints/types';
import { webUnlocker } from './endpoints/web-unlocker';
import { errorHandlers } from './error-handlers';
import { brightdata } from './index';
import {
	BrightDataCities,
	BrightDataCountries,
	BrightDataDataset,
	BrightDataSnapshotProgress,
	BrightDataSnapshotRef,
	BrightDataZone,
} from './schema';

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

const mockFetch = jest.fn();

beforeAll(() => {
	globalThis.fetch = mockFetch as typeof fetch;
});

beforeEach(() => {
	mockFetch.mockReset();
	jest.mocked(logEventFromContext).mockReset();
});

function jsonResponse(body: unknown, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		status: 200,
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(init?.headers as Record<string, string>),
		},
	});
}

function lastRequest(): {
	url: string;
	auth: string | null;
	method: string;
	body: unknown;
} {
	expect(mockFetch).toHaveBeenCalled();
	const [input, init] = mockFetch.mock.calls[0] as [
		string,
		RequestInit | undefined,
	];
	const headers = new Headers(init?.headers);
	return {
		url: input,
		auth: headers.get('Authorization'),
		method: init?.method ?? 'GET',
		body: init?.body ? JSON.parse(String(init.body)) : undefined,
	};
}

const TEST_KEY = 'test-key';
const ctx = {
	key: TEST_KEY,
	$getAccountId: async () => 'test-account',
} as never;

const datasetFixture = {
	id: 'gd_l1vijqt9jfj7olije',
	name: 'Crunchbase companies information',
	size: 2300000,
};

const progressFixture = {
	snapshot_id: 's_m4x7enmven8djfqak',
	dataset_id: 'ds_123456789',
	status: 'running',
};

const snapshotRefFixture = { snapshot_id: 's_m4x7enmven8djfqak' };

const zoneFixture = { name: 'web_unlocker1', type: 'unblocker' };

const countriesFixture = {
	zone_types: {
		DC_shared: { country_codes: ['us', 'gb'] },
	},
};

const citiesFixture = ['us-chicago', 'us-ashburn'];

describe('Bright Data plugin', () => {
	it('instantiates with api_key auth and ten endpoints', () => {
		const plugin = brightdata();
		expect(plugin.id).toBe('brightdata');
		expect(plugin.authConfig?.api_key?.account).toEqual(['one']);
		expect(Object.keys(plugin.endpointSchemas ?? {})).toHaveLength(10);
		expect(plugin.webhooks).toEqual({});
		expect(plugin.pluginWebhookMatcher?.({ headers: {} } as never)).toBe(false);
	});

	it('returns an explicit key from keyBuilder', async () => {
		const plugin = brightdata({ key: TEST_KEY });
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					keys: { get_api_key: async () => undefined },
				} as never,
				'endpoint',
			),
		).resolves.toBe(TEST_KEY);
	});

	it('listDatasets requires a key', async () => {
		await expect(listDatasets({ key: '' } as never, {})).rejects.toThrow(
			AuthMissingError,
		);
		expect(mockFetch).not.toHaveBeenCalled();
	});

	it('listDatasets hits GET /datasets/list', async () => {
		mockFetch.mockResolvedValue(jsonResponse([datasetFixture]));
		const input = BrightDataEndpointInputSchemas.listDatasets.parse({});
		const result = await listDatasets(ctx, input);
		expect(result[0]?.id).toBe(datasetFixture.id);
		BrightDataEndpointOutputSchemas.listDatasets.parse(result);
		const req = lastRequest();
		expect(req.url).toBe('https://api.brightdata.com/datasets/list');
		expect(req.method).toBe('GET');
		expect(req.auth).toBe(`Bearer ${TEST_KEY}`);
	});

	it('getSnapshotStatus hits GET /datasets/v3/progress/{id}', async () => {
		mockFetch.mockResolvedValue(jsonResponse(progressFixture));
		const input = BrightDataEndpointInputSchemas.getSnapshotStatus.parse({
			snapshot_id: 's_m4x7enmven8djfqak',
		});
		const result = await getSnapshotStatus(ctx, input);
		expect(result.status).toBe('running');
		BrightDataEndpointOutputSchemas.getSnapshotStatus.parse(result);
		expect(lastRequest().url).toBe(
			'https://api.brightdata.com/datasets/v3/progress/s_m4x7enmven8djfqak',
		);
	});

	it('getSnapshotResults pages official query params', async () => {
		mockFetch.mockResolvedValue(jsonResponse([{ url: 'https://example.com' }]));
		const input = BrightDataEndpointInputSchemas.getSnapshotResults.parse({
			snapshot_id: 's_m4x7enmven8djfqak',
			format: 'json',
			batch_size: 1000,
			part: 1,
		});
		const result = await getSnapshotResults(ctx, input);
		BrightDataEndpointOutputSchemas.getSnapshotResults.parse(result);
		expect(lastRequest().url).toBe(
			'https://api.brightdata.com/datasets/v3/snapshot/s_m4x7enmven8djfqak?format=json&batch_size=1000&part=1',
		);
	});

	it('filterDataset posts official JSON body', async () => {
		mockFetch.mockResolvedValue(jsonResponse(snapshotRefFixture));
		const input = BrightDataEndpointInputSchemas.filterDataset.parse({
			dataset_id: 'gd_l1viktl72bvl7bjuj0',
			records_limit: 100,
			filter: { name: 'name', operator: '=', value: 'John' },
		});
		const result = await filterDataset(ctx, input);
		expect(result.snapshot_id).toBe(snapshotRefFixture.snapshot_id);
		const req = lastRequest();
		expect(req.url).toBe('https://api.brightdata.com/datasets/filter');
		expect(req.method).toBe('POST');
		expect(req.body).toEqual({
			dataset_id: 'gd_l1viktl72bvl7bjuj0',
			filter: { name: 'name', operator: '=', value: 'John' },
			records_limit: 100,
		});
	});

	it('getAvailableCities hits GET /zone/static/cities', async () => {
		mockFetch.mockResolvedValue(jsonResponse(citiesFixture));
		const input = BrightDataEndpointInputSchemas.getAvailableCities.parse({
			country: 'us',
			pool_ip_type: 'dc',
		});
		const result = await getAvailableCities(ctx, input);
		expect(result).toEqual(citiesFixture);
		expect(lastRequest().url).toBe(
			'https://api.brightdata.com/zone/static/cities?country=us&pool_ip_type=dc',
		);
	});

	it('getAvailableCountries hits GET /countrieslist', async () => {
		mockFetch.mockResolvedValue(jsonResponse(countriesFixture));
		const result = await getAvailableCountries(ctx, {});
		expect(result.zone_types?.DC_shared?.country_codes).toContain('us');
		expect(lastRequest().url).toBe('https://api.brightdata.com/countrieslist');
	});

	it('listWebUnlockerZones hits GET /zone/get_active_zones', async () => {
		mockFetch.mockResolvedValue(jsonResponse([zoneFixture]));
		const result = await listWebUnlockerZones(ctx, {});
		expect(result[0]?.name).toBe('web_unlocker1');
		expect(lastRequest().url).toBe(
			'https://api.brightdata.com/zone/get_active_zones',
		);
	});

	it('serpSearch posts /request with a search URL', async () => {
		mockFetch.mockResolvedValue(
			jsonResponse({ general: { query: 'pizza' }, organic: [] }),
		);
		const input = BrightDataEndpointInputSchemas.serpSearch.parse({
			zone: 'serp_api1',
			q_keywords: 'pizza',
			search_engine: 'google',
			format: 'json',
		});
		const result = await serpSearch(ctx, input);
		BrightDataEndpointOutputSchemas.serpSearch.parse(result);
		const req = lastRequest();
		expect(req.url).toBe('https://api.brightdata.com/request');
		expect(req.method).toBe('POST');
		expect(req.body).toMatchObject({
			zone: 'serp_api1',
			url: 'https://www.google.com/search?q=pizza',
			format: 'json',
			method: 'GET',
		});
	});

	it('crawlApi posts items to /datasets/v3/trigger', async () => {
		mockFetch.mockResolvedValue(jsonResponse(snapshotRefFixture));
		const input = BrightDataEndpointInputSchemas.crawlApi.parse({
			dataset_id: 'gd_l1vikfnt1wgvvqz95w',
			items: [{ url: 'https://www.airbnb.com/rooms/50122531' }],
			include_errors: true,
		});
		const result = await crawlApi(ctx, input);
		expect(result.snapshot_id).toBe(snapshotRefFixture.snapshot_id);
		const req = lastRequest();
		expect(req.url).toBe(
			'https://api.brightdata.com/datasets/v3/trigger?dataset_id=gd_l1vikfnt1wgvvqz95w&include_errors=true',
		);
		expect(req.body).toEqual([
			{ url: 'https://www.airbnb.com/rooms/50122531' },
		]);
	});

	it('webUnlocker posts official /request body', async () => {
		mockFetch.mockResolvedValue(
			new Response('Welcome to Bright Data', { status: 200 }),
		);
		const input = BrightDataEndpointInputSchemas.webUnlocker.parse({
			zone: 'web_unlocker1',
			url: 'https://geo.brdtest.com/welcome.txt',
			format: 'raw',
		});
		const result = await webUnlocker(ctx, input);
		expect(result).toBe('Welcome to Bright Data');
		expect(lastRequest().body).toMatchObject({
			zone: 'web_unlocker1',
			url: 'https://geo.brdtest.com/welcome.txt',
			format: 'raw',
		});
	});
});

describe('Bright Data client errors', () => {
	it('wraps 429 as BrightDataRateLimitError with retry metadata', async () => {
		mockFetch.mockImplementation(() =>
			jsonResponse(
				{ error: 'Too Many Requests' },
				{ status: 429, headers: { 'Retry-After': '42' } },
			),
		);
		try {
			await makeBrightDataRequest('/countrieslist', TEST_KEY);
		} catch (error) {
			expect(error).toBeInstanceOf(BrightDataRateLimitError);
			expect((error as BrightDataRateLimitError).retryAfterMs).toBe(42000);
			expect(errorHandlers.RATE_LIMIT_ERROR.match(error as Error)).toBe(true);
			const policy = await errorHandlers.RATE_LIMIT_ERROR.handler(
				error as Error,
			);
			expect(policy.headersRetryAfterMs).toBe(42000);
		}
	});

	it('wraps 401 as BrightDataAPIError matched by AUTH_ERROR', async () => {
		mockFetch.mockImplementation(() =>
			jsonResponse({ error: 'Unauthorized' }, { status: 401 }),
		);
		try {
			await makeBrightDataRequest('/countrieslist', TEST_KEY);
		} catch (error) {
			expect(error).toBeInstanceOf(BrightDataAPIError);
			expect((error as BrightDataAPIError).status).toBe(401);
			expect(errorHandlers.AUTH_ERROR.match(error as Error)).toBe(true);
		}
	});
});

describe('official docs fixtures', () => {
	it('parses documented dataset, snapshot, zone, country, and city payloads', () => {
		expect(BrightDataDataset.parse(datasetFixture).id).toBe(datasetFixture.id);
		expect(BrightDataSnapshotProgress.parse(progressFixture).status).toBe(
			'running',
		);
		expect(BrightDataSnapshotRef.parse(snapshotRefFixture).snapshot_id).toBe(
			snapshotRefFixture.snapshot_id,
		);
		expect(BrightDataZone.parse(zoneFixture).name).toBe('web_unlocker1');
		expect(
			BrightDataCountries.parse(countriesFixture).zone_types?.DC_shared
				?.country_codes,
		).toEqual(['us', 'gb']);
		expect(BrightDataCities.parse(citiesFixture)).toHaveLength(2);
		expect(() =>
			BrightDataSnapshotProgress.parse({
				...progressFixture,
				status: 'queued',
			}),
		).toThrow();
	});
});
