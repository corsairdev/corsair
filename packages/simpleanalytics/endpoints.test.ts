import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	failureFromBody,
	isAuthFailure,
	isBadgeLock,
	SimpleanalyticsAPIError,
	statsPath,
} from './client';
import { Export, Stats, Websites } from './endpoints';
import type { UnknownJson } from './json';
import {
	adminFailure,
	exportDatapoints,
	stats,
	statsFailure,
	statsWithFields,
	websiteAdded,
	websites,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'sa_api_key_test';
const USER_ID = 'sa_user_id_0f5c4c2a-1c1f-4a2e-9f0a-6c1f2d3e4b5a';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return type is the widest one.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>; // unknown: per endpoint

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: UnknownJson) {
	return endpoint(
		{
			key: API_KEY,
			options: {},
			keys: { get_user_id: jest.fn().mockResolvedValue(USER_ID) },
		} as never,
		input as never,
	);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: UnknownJson, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
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
		// unknown: the body is whatever the endpoint serialized.
		body: init.body
			? (JSON.parse(String(init.body)) as UnknownJson)
			: undefined,
	};
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://simpleanalytics.com');
	expect(sent.headers.get('api-key')).toBe(API_KEY);
	expect(sent.headers.get('authorization')).toBeNull();
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('statsPath', () => {
	it('builds the hostname.json form', () => {
		expect(statsPath('example.com')).toBe('/example.com.json');
	});

	it('puts a path before .json', () => {
		expect(statsPath('example.com', '/contact')).toBe(
			'/example.com/contact.json',
		);
	});

	it('strips a leading slash so the path does not double up', () => {
		expect(statsPath('example.com', '//contact')).toBe(
			'/example.com/contact.json',
		);
	});

	it('encodes a hash-mode path so it stays in the request path', () => {
		expect(statsPath('example.com', '/#/pricing')).toBe(
			'/example.com/%23/pricing.json',
		);
	});
});

describe('stats.get', () => {
	it('GETs the hostname.json route with version 6 and info off', async () => {
		respond(stats);

		const result = await invoke(Stats.get, {
			hostname: 'simpleanalytics.com',
			fields: ['pageviews', 'visitors'],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/simpleanalytics.com.json',
		});
		// info=false keeps the `__`-prefixed documentation out of the response.
		expect(lastRequest().query).toMatchObject({ version: '6', info: 'false' });
		expect(result).toMatchObject({ pageviews: 8940, visitors: 6707 });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simpleanalytics.stats.get',
			expect.objectContaining({
				hostname: 'simpleanalytics.com',
				pageviews: 8940,
				visitors: 6707,
			}),
			'completed',
		);
	});

	it('joins the fields with commas and sends the filters', async () => {
		respond(statsWithFields);

		const result = await invoke(Stats.get, {
			hostname: 'simpleanalytics.com',
			fields: ['pageviews', 'pages', 'seconds_on_page'],
			pages: '/,/contact',
			country: 'NL',
			limit: 10,
			interval: 'day',
		});

		const sent = lastRequest();
		expect(sent.query.fields).toBe('pageviews,pages,seconds_on_page');
		expect(sent.query.pages).toBe('/,/contact');
		expect(sent.query.country).toBe('NL');
		expect(sent.query.limit).toBe('10');
		expect(sent.query.interval).toBe('day');
		expect(result).toMatchObject({ seconds_on_page: 26 });
		// The schema types pages; the cast is only because invoke() erases it.
		const pages = (result as { pages: UnknownJson[] }).pages;
		expect(pages).toHaveLength(2);
	});

	it('puts the path in the URL, not the query', async () => {
		respond(stats);

		await invoke(Stats.get, {
			hostname: 'example.com',
			path: '/contact',
			fields: ['pageviews'],
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/example.com/contact.json');
		expect(sent.query.page).toBeUndefined();
	});

	it('sends a hash-mode path encoded, with the query intact', async () => {
		respond(stats);

		await invoke(Stats.get, {
			hostname: 'example.com',
			path: '/#/pricing',
			fields: ['pageviews'],
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/example.com/%23/pricing.json');
		expect(sent.query).toMatchObject({ version: '6', fields: 'pageviews' });
	});

	it('sends the homepage path as page=/ rather than dropping it', async () => {
		respond(stats);

		await invoke(Stats.get, {
			hostname: 'example.com',
			path: '/',
			fields: ['pageviews'],
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/example.com.json');
		expect(sent.query.page).toBe('/');
	});

	it('spreads metadata filters as metadata.<key> parameters', async () => {
		respond(stats);

		await invoke(Stats.get, {
			hostname: 'example.com',
			fields: ['pageviews'],
			metadata: { app_id: 'nl-123', plan: 'pro' },
		});

		expect(lastRequest().query).toMatchObject({
			'metadata.app_id': 'nl-123',
			'metadata.plan': 'pro',
		});
	});

	it('joins event names and allows the wildcard', async () => {
		respond(statsWithFields);

		await invoke(Stats.get, {
			hostname: 'example.com',
			fields: ['pageviews'],
			events: ['*'],
		});

		expect(lastRequest().query.events).toBe('*');
	});

	it('rejects an empty fields list', async () => {
		await expect(
			invoke(Stats.get, { hostname: 'example.com', fields: [] }),
		).rejects.toThrow(/fields/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a field name the API does not know', async () => {
		// Zod reports the enum's members, not the rejected value, so the
		// assertion is on the schema rejecting at all.
		await expect(
			invoke(Stats.get, { hostname: 'example.com', fields: ['bounces'] }),
		).rejects.toThrow(/invalid_value|Invalid option/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a limit above the documented maximum of 1000', async () => {
		await expect(
			invoke(Stats.get, {
				hostname: 'example.com',
				fields: ['pageviews'],
				limit: 1001,
			}),
		).rejects.toThrow(/limit/);
	});
});

describe('export.datapoints', () => {
	it('GETs the export route with format=json', async () => {
		respond(exportDatapoints);

		const result = await invoke(Export.datapoints, {
			hostname: 'example.com',
			fields: ['added_iso', 'path', 'country_code'],
			type: 'pageviews',
		});

		const sent = lastRequest();
		expect(sent.path).toBe('/api/export/datapoints');
		expect(sent.query).toMatchObject({
			version: '6',
			format: 'json',
			hostname: 'example.com',
			type: 'pageviews',
		});
		expect(result).toMatchObject({ datapoints: exportDatapoints.datapoints });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'simpleanalytics.export.datapoints',
			expect.objectContaining({ datapoints: 2 }),
			'completed',
		);
	});

	it('appends metadata fields with the metadata. prefix the API needs', async () => {
		respond(exportDatapoints);

		await invoke(Export.datapoints, {
			hostname: 'example.com',
			fields: ['added_iso'],
			metadata_fields: ['project_text', 'metadata.dark_mode_bool'],
		});

		expect(lastRequest().query.fields).toBe(
			'added_iso,metadata.project_text,metadata.dark_mode_bool',
		);
	});

	it('rejects an export field the API does not know', async () => {
		// The API field is session_id; sessionId is the camelCase export column.
		await expect(
			invoke(Export.datapoints, {
				hostname: 'example.com',
				fields: ['sessionId'],
			}),
		).rejects.toThrow(/invalid_value|Invalid option/);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects type=all without fields, which the API refuses', async () => {
		await expect(
			invoke(Export.datapoints, {
				hostname: 'example.com',
				fields: [],
				type: 'all',
			}),
		).rejects.toThrow(/fields/);
	});
});

describe('websites.list', () => {
	it('sends both the API key and the user id header', async () => {
		respond(websites);

		const result = await invoke(Websites.list, {});

		const sent = lastRequest();
		expect(sent.path).toBe('/api/websites');
		expect(sent.headers.get('api-key')).toBe(API_KEY);
		expect(sent.headers.get('user-id')).toBe(USER_ID);
		expect(result).toMatchObject({ websites: websites.websites });
	});

	it('reads the user id stored on the account', async () => {
		respond(websites);

		await Websites.list(
			{
				key: API_KEY,
				options: {},
				keys: { get_user_id: jest.fn().mockResolvedValue('stored-user-id') },
			} as never,
			{} as never,
		);

		expect(lastRequest().headers.get('user-id')).toBe('stored-user-id');
	});

	it('throws before sending when there is no user id', async () => {
		const { AuthMissingError } = jest.requireActual('corsair/core');

		await expect(
			Websites.list(
				{
					key: API_KEY,
					options: {},
					keys: { get_user_id: jest.fn().mockResolvedValue(null) },
				} as never,
				{} as never,
			),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('websites.add', () => {
	it('POSTs the website with the user id header', async () => {
		respond(websiteAdded);

		const result = await invoke(Websites.add, {
			hostname: 'example.com',
			isPublic: false,
			timezone: 'Europe/Amsterdam',
			label: 'customer note',
		});

		const sent = lastRequest();
		expect(sent.method).toBe('POST');
		expect(sent.path).toBe('/api/websites/add');
		expect(sent.headers.get('user-id')).toBe(USER_ID);
		expect(sent.body).toEqual({
			hostname: 'example.com',
			isPublic: false,
			timezone: 'Europe/Amsterdam',
			label: 'customer note',
		});
		expect(result).toMatchObject({ hostname: 'example.com', validDNS: true });
	});
});

describe('body-reported failures', () => {
	it('turns a 200 carrying ok:false into an error', async () => {
		respond(statsFailure);

		const error = await invoke(Stats.get, {
			hostname: 'example.com',
			fields: ['pageviews'],
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(SimpleanalyticsAPIError);
		expect((error as Error).message).toContain('No valid authorization');
	});

	it('lets core ApiError through on a 400, with the provider message', async () => {
		respond(adminFailure, 400);

		const error = await invoke(Websites.list, {}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(400);
		expect((error as ApiError).request.method).toBe('GET');
		expect((error as Error).message).toContain(adminFailure.error);
		expect(isAuthFailure(error as Error)).toBe(true);
	});

	it('reads BADGE_REQUIRED from a 423 ApiError', async () => {
		respond({ ok: false, code: 'BADGE_REQUIRED' }, 423);

		const error = await invoke(Stats.get, {
			hostname: 'example.com',
			fields: ['pageviews'],
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect(isBadgeLock(error as Error)).toBe(true);
	});

	it('keeps the 429 Retry-After on the ApiError', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response(JSON.stringify({ ok: false, error: 'Too many' }), {
				status: 429,
				headers: { 'Content-Type': 'application/json', 'Retry-After': '7' },
			}),
		);

		const error = await invoke(Stats.get, {
			hostname: 'example.com',
			fields: ['pageviews'],
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(error).toBeInstanceOf(ApiError);
		expect((error as ApiError).status).toBe(429);
		expect((error as ApiError).retryAfter).toBe(7000);
	});

	it('keeps the API key out of util.inspect', async () => {
		respond(statsFailure);
		const util = await import('node:util');

		const error = await invoke(Stats.get, {
			hostname: 'example.com',
			fields: ['pageviews'],
		}).catch(
			// unknown: a rejection reason has no static type; narrowed below.
			(caught: UnknownJson) => caught,
		);

		expect(util.inspect(error)).not.toContain(API_KEY);
		expect((error as Error).message).not.toContain(API_KEY);
	});
});

describe('failureFromBody', () => {
	it('reports a failure for ok:false', () => {
		expect(failureFromBody({ ok: false, error: 'nope' }, 200)).toBe(
			'Simple Analytics 200: nope',
		);
	});

	it('reports a failure for success:false', () => {
		expect(failureFromBody({ success: false, error: 'nope' }, undefined)).toBe(
			'nope',
		);
	});

	it('returns null for a successful body', () => {
		expect(failureFromBody({ ok: true, pageviews: 1 }, 200)).toBeNull();
	});

	it('returns null for a body that is not an object', () => {
		expect(failureFromBody('<html>', 500)).toBeNull();
	});
});
