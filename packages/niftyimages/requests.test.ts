import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NiftyimagesPluginOptions } from './index';
import { niftyimages, niftyimagesEndpointsNested } from './index';
import {
	beeUserImages,
	htmlNotFound,
	images,
	invalidKey,
	mapDetails,
	mapLocations,
	psdImage,
	singleImage,
	storeFields,
	timerUpdated,
	userStats,
	widgetImages,
	widgetStats,
	widgets,
	widgetUsers,
} from './test-fixtures';

const API_KEY = '67c27802-f234-4196-b44c-460245d4978e';
const WIDGET_KEY = '153607b3-da74-48ed-a579-d2d2430a7578';

function makeContext() {
	return {
		key: API_KEY,
		authType: 'api_key' as const,
		options: {} as NiftyimagesPluginOptions,
		tenantId: 'default',
		log: async () => undefined,
		db: {},
		keys: {},
		_http: {},
	};
}

// unknown: each operation has its own input and output, and every call site
// passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>;

const endpoints = niftyimagesEndpointsNested;

// No test may reach the network: a fetch that capture() did not mock throws,
// so a validation test can only pass on the schema's own rejection.
const realFetch = globalThis.fetch;
beforeEach(() => {
	globalThis.fetch = (async () => {
		throw new Error('unmocked fetch');
	}) as typeof fetch;
});
afterAll(() => {
	globalThis.fetch = realFetch;
});

/**
 * Runs one endpoint and returns the response and the request that made it.
 * unknown: `input`, `body` and `result` differ per endpoint; each test passes a
 * literal its endpoint's zod schema checks and reads the parsed result back
 * through asRecord, so one shared stricter type would not fit every call.
 */
async function capture(
	endpoint: Endpoint,
	input: unknown,
	body: unknown,
	{ status = 200, contentType = 'application/json' } = {},
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{ status, headers: { 'Content-Type': contentType } },
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext() as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

describe('request shape', () => {
	it('sends the key in the ApiKey header, not the query', async () => {
		const { url, init } = await capture(endpoints.widgets.list, {}, widgets);

		expect(url).toBe('https://api.niftyimages.com/v1/Widgets');
		const headers = new Headers(init.headers);
		expect(headers.get('apikey')).toBe(API_KEY);
		expect(headers.get('authorization')).toBeNull();
	});
});

describe('widgets.list', () => {
	it('lifts the bare array into a widgets list', async () => {
		const { result } = await capture(endpoints.widgets.list, {}, widgets);

		const list = asRecord(result)?.widgets;
		expect(Array.isArray(list) ? list.length : 0).toBe(3);
		expect(asRecord(Array.isArray(list) ? list[0] : null)?.WidgetKey).toBe(
			WIDGET_KEY,
		);
	});

	it('passes the ISO window', async () => {
		const { url } = await capture(
			endpoints.widgets.list,
			{ startDate: '2016-02-10T08:00Z', endDate: '2016-03-10T08:00Z' },
			widgets,
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('startDate')).toBe('2016-02-10T08:00Z');
		expect(parsed.searchParams.get('endDate')).toBe('2016-03-10T08:00Z');
	});

	it('fails loudly when the provider answers something else', async () => {
		await expect(
			capture(endpoints.widgets.list, {}, { message: 'nope' }),
		).rejects.toThrow(/widget array/);
	});
});

describe('widgets.stats', () => {
	it('reads every widget at once from AllStats', async () => {
		const { result, url } = await capture(
			endpoints.widgets.stats,
			{},
			widgetStats,
		);

		expect(url).toBe('https://api.niftyimages.com/v1/Widgets/AllStats');
		const rows = asRecord(result)?.stats;
		const first = asRecord(Array.isArray(rows) ? rows[0] : null);
		expect(first?.Impressions).toBe(54);
		expect(first?.Users).toBe(3);
	});

	it('keeps a zeroed widget rather than dropping it', async () => {
		const { result } = await capture(endpoints.widgets.stats, {}, widgetStats);

		const rows = asRecord(result)?.stats;
		const second = asRecord(Array.isArray(rows) ? rows[1] : null);
		// A widget with no traffic reports zeroes, not a missing row.
		expect(second?.Impressions).toBe(0);
	});
});

describe('widgets.users', () => {
	it('addresses the widget and reads the recipients', async () => {
		const { result, url } = await capture(
			endpoints.widgets.users,
			{ widgetKey: WIDGET_KEY },
			widgetUsers,
		);

		expect(url).toBe(
			`https://api.niftyimages.com/v1/Widgets/${WIDGET_KEY}/Users`,
		);
		const list = asRecord(result)?.users;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.User).toBe('jordan@acme-logistics.com');
	});

	it('percent-encodes an email used as a user id', async () => {
		const { url } = await capture(
			endpoints.widgets.userStats,
			{ widgetKey: WIDGET_KEY, user: 'jordan+tag@acme-logistics.com' },
			userStats,
		);

		// The @ and + must be encoded, or the path splits at the @.
		expect(url).toContain('jordan%2Btag%40acme-logistics.com');
		expect(url).not.toContain('jordan+tag@');
	});
});

describe('widgets.userStats', () => {
	it('reads one recipient’s aggregated stats', async () => {
		const { result, url } = await capture(
			endpoints.widgets.userStats,
			{ widgetKey: WIDGET_KEY, user: 'jordan@acme-logistics.com' },
			userStats,
		);

		expect(url).toBe(
			`https://api.niftyimages.com/v1/Widgets/${WIDGET_KEY}/Users/jordan%40acme-logistics.com`,
		);
		// The payload may arrive bare or under `stats`, so read whichever came.
		const stats = asRecord(asRecord(result)?.stats ?? asRecord(result));
		expect(stats?.Impressions).toBe(118);
		expect(stats?.Suspended).toBe(false);
	});

	it('rejects a missing user before sending', async () => {
		await expect(
			// Cast past the type: the point is that the schema refuses a missing
			// user at runtime for a caller passing untyped input.
			endpoints.widgets.userStats(
				makeContext() as never,
				{
					widgetKey: WIDGET_KEY,
				} as never,
			),
		).rejects.toMatchObject({ name: 'ZodError' });
	});
});

describe('widgets.images', () => {
	it('lists the generated images for a widget', async () => {
		const { result, url } = await capture(
			endpoints.widgets.images,
			{ widgetKey: WIDGET_KEY },
			widgetImages,
		);

		expect(url).toBe(
			`https://api.niftyimages.com/v1/Widgets/${WIDGET_KEY}/Images`,
		);
		const list = asRecord(result)?.images;
		const first = asRecord(Array.isArray(list) ? list[0] : null);
		expect(first?.Uri).toContain('img1.niftyimages.com');
	});

	it('addresses one recipient’s images', async () => {
		const { result, url } = await capture(
			endpoints.widgets.userImages,
			{ widgetKey: WIDGET_KEY, user: 'jordan@acme-logistics.com' },
			widgetImages,
		);

		expect(url).toBe(
			`https://api.niftyimages.com/v1/Widgets/${WIDGET_KEY}/Images/jordan%40acme-logistics.com`,
		);
		expect(asRecord(result)?.images).toHaveLength(1);
	});
});

const MAP_URL = 'https://img1.niftyimages.com/p/lop/m7w';

/** The parsed JSON body of a request. */
// unknown: the request body is whatever the endpoint sent.
function bodyOf(init: RequestInit): unknown {
	return JSON.parse(String(init.body));
}

describe('store', () => {
	it('lists the Data Store fields from a bare array', async () => {
		const { result, url } = await capture(
			endpoints.store.fields,
			{},
			storeFields,
		);
		expect(url).toBe('https://api.niftyimages.com/v1/Store');
		const fields = asRecord(result)?.fields;
		expect(Array.isArray(fields) ? fields.length : 0).toBe(2);
	});

	it('posts a record as the whole JSON body', async () => {
		const record = { EmployeeID: 3, First: 'John' };
		const { result, url, init } = await capture(
			endpoints.store.addRecord,
			{ record },
			{ EmployeeID: 3.0, First: 'John' },
			{ status: 201 },
		);
		expect(url).toBe('https://api.niftyimages.com/v1/Store/AddRecord');
		expect(init.method).toBe('POST');
		expect(bodyOf(init)).toEqual(record);
		expect(asRecord(asRecord(result)?.record)?.First).toBe('John');
	});

	it('rejects an empty record', async () => {
		await expect(
			endpoints.store.addRecord(makeContext() as never, { record: {} }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('deletes by id in the query and reports success on an empty 200', async () => {
		const { result, url, init } = await capture(
			endpoints.store.deleteById,
			{ id: 3 },
			'',
		);
		expect(url).toBe('https://api.niftyimages.com/v1/Store/DeleteID?id=3');
		expect(init.method).toBe('DELETE');
		expect(result).toEqual({ success: true });
	});

	it('deletes by record with the record as the body', async () => {
		const { init, url } = await capture(
			endpoints.store.deleteRecord,
			{ record: { EmployeeID: 3 } },
			'',
		);
		expect(url).toBe('https://api.niftyimages.com/v1/Store/DeleteRecord');
		expect(bodyOf(init)).toEqual({ EmployeeID: 3 });
	});
});

describe('timers.updateTargetDate', () => {
	it('puts the documented PascalCase body', async () => {
		const input = {
			TimerImageUrl: 'https://img1.niftyimages.com/z/qwcd/ywcd',
			TargetDate: '2022-05-17T00:00:00Z',
			AddDays: 1,
		};
		const { result, url, init } = await capture(
			endpoints.timers.updateTargetDate,
			input,
			timerUpdated,
		);
		expect(url).toBe('https://api.niftyimages.com/v1/Timer/Update');
		expect(init.method).toBe('PUT');
		expect(bodyOf(init)).toEqual(input);
		expect(asRecord(result)?.UpdatedTargetUtc).toBe('2022-05-17T07:00:00Z');
	});
});

describe('maps', () => {
	it('lists maps and reads one by url', async () => {
		const list = await capture(endpoints.maps.list, {}, images);
		expect(list.url).toBe('https://api.niftyimages.com/v1/Maps');

		const { result, url } = await capture(
			endpoints.maps.get,
			{ url: MAP_URL },
			mapDetails,
		);
		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/v1/Maps/Details');
		expect(parsed.searchParams.get('url')).toBe(MAP_URL);
		expect(asRecord(result)?.LocationsGood).toBe(10);
	});

	it('searches locations with the documented query names', async () => {
		const { result, url } = await capture(
			endpoints.maps.searchLocations,
			{ url: MAP_URL, lat: 37.78, lng: -122.4 },
			mapLocations,
		);
		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/v1/Maps/GetLocations');
		expect(parsed.searchParams.get('lat')).toBe('37.78');
		expect(parsed.searchParams.get('lng')).toBe('-122.4');
		const list = asRecord(result)?.locations;
		expect(Array.isArray(list) ? list.length : 0).toBe(1);
	});

	it('refuses a search with nothing to search by', async () => {
		await expect(
			endpoints.maps.searchLocations(makeContext() as never, { url: MAP_URL }),
		).rejects.toMatchObject({ name: 'ZodError' });
	});

	it('adds a location with the url in the query and the rest as the body', async () => {
		const { result, url, init } = await capture(
			endpoints.maps.addLocation,
			{
				url: MAP_URL,
				Address: '5411 3rd St, San Francisco, CA 94124',
				LocationID: '22',
			},
			{ msg: 'Location was added and is being processed' },
			{ status: 201 },
		);
		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/v1/Maps/AddLocation');
		expect(parsed.searchParams.get('url')).toBe(MAP_URL);
		expect(bodyOf(init)).toEqual({
			Address: '5411 3rd St, San Francisco, CA 94124',
			LocationID: '22',
		});
		expect(asRecord(result)?.msg).toContain('processed');
	});

	it('updates by LocationID and deletes by niftyID', async () => {
		const updated = await capture(
			endpoints.maps.updateLocation,
			{ url: MAP_URL, LocationID: '22', Address: 'New' },
			{ msg: 'Location(s) were updated and are being processed' },
		);
		expect(updated.init.method).toBe('PUT');
		expect(new URL(updated.url).pathname).toBe('/v1/Maps/UpdateLocation');

		const deleted = await capture(
			endpoints.maps.deleteLocation,
			{ url: MAP_URL, niftyID: '37.7280739 | -122.3927233' },
			'',
		);
		const parsed = new URL(deleted.url);
		expect(deleted.init.method).toBe('DELETE');
		expect(parsed.searchParams.get('niftyID')).toBe(
			'37.7280739 | -122.3927233',
		);
		expect(deleted.result).toEqual({ success: true });
	});
});

describe('Bee Plugin and suspends', () => {
	it('lists Bee Plugin users and one user’s images', async () => {
		const users = await capture(
			endpoints.beePlugin.users,
			{ pluginKey: 'pk-1', startDate: '2020-03-01' },
			[{ UserName: 'Test User', Images: 3, Opens: 122, Status: 'Suspended' }],
		);
		expect(new URL(users.url).pathname).toBe('/v1/BeePlugin/pk-1/Users');

		const imgs = await capture(
			endpoints.beePlugin.userImages,
			{ pluginKey: 'pk-1', user: 'Test User' },
			beeUserImages,
		);
		expect(imgs.url).toBe(
			'https://api.niftyimages.com/v1/BeePlugin/pk-1/Users/Test%20User',
		);
	});

	it('sends a bare boolean to suspend a widget user', async () => {
		const { result, url, init } = await capture(
			endpoints.widgets.suspendUser,
			{
				widgetKey: WIDGET_KEY,
				user: 'jordan@acme-logistics.com',
				suspend: true,
			},
			'',
		);
		expect(url).toBe(
			`https://api.niftyimages.com/v1/Widgets/${WIDGET_KEY}/Users/jordan%40acme-logistics.com`,
		);
		expect(init.method).toBe('PUT');
		expect(init.body).toBe('true');
		expect(result).toEqual({ success: true });
	});

	it('sends false to lift a Bee Plugin suspension', async () => {
		const { init } = await capture(
			endpoints.beePlugin.suspendUser,
			{ pluginKey: 'pk-1', user: 'Test User', suspend: false },
			'',
		);
		expect(init.body).toBe('false');
	});
});

describe('images and Photoshop images', () => {
	it('pages images and reads string open counts', async () => {
		const { result, url } = await capture(
			endpoints.images.list,
			{ pageSize: 5, pageNumber: 2 },
			images,
		);
		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/v1/Images');
		expect(parsed.searchParams.get('pageSize')).toBe('5');
		expect(parsed.searchParams.get('pageNumber')).toBe('2');
		const list = asRecord(result)?.images;
		expect(asRecord(Array.isArray(list) ? list[0] : null)?.Opens).toBe('55470');
	});

	it('reads image stats over a window', async () => {
		const { url } = await capture(
			endpoints.images.stats,
			{ startDate: '2016-03-01', endDate: '2016-04-01' },
			images,
		);
		expect(new URL(url).pathname).toBe('/v1/Images/AllStats');
	});

	it('reads and deletes one image by url', async () => {
		const got = await capture(
			endpoints.images.get,
			{ url: MAP_URL },
			singleImage,
		);
		expect(new URL(got.url).pathname).toBe('/v1/Image');
		expect(asRecord(got.result)?.Opens).toBe(55470);

		const deleted = await capture(
			endpoints.images.delete,
			{ url: MAP_URL },
			'',
		);
		expect(deleted.init.method).toBe('DELETE');
		expect(new URL(deleted.url).searchParams.get('url')).toBe(MAP_URL);
	});

	it('reads a Photoshop image and updates a layer by name', async () => {
		const got = await capture(endpoints.psd.get, { url: MAP_URL }, psdImage);
		expect(new URL(got.url).pathname).toBe('/v1/Psd');

		const layers = [
			{ LayerName: 'StockPrice', TextValue: '25,149.30', TextColor: '#FF0000' },
		];
		const { init, result } = await capture(
			endpoints.psd.update,
			{ url: MAP_URL, Layers: layers },
			psdImage,
		);
		expect(init.method).toBe('PUT');
		expect(bodyOf(init)).toEqual({ Layers: layers });
		const back = asRecord(result)?.Layers;
		expect(Array.isArray(back) ? back.length : 0).toBe(2);
	});
});

describe('niftyimages error reporting', () => {
	it('reads the JSON message on a 401', async () => {
		const error = await capture(endpoints.widgets.list, {}, invalidKey, {
			status: 401,
		}).catch((caught: unknown) => caught); // unknown: a rejection reason has no static type

		expect(String(error)).toContain('Your API Key does not appear to be valid');
		expect(String(error)).toContain('401');
	});

	it('calls an HTML 404 a path problem rather than a key problem', async () => {
		const error = await capture(endpoints.widgets.list, {}, htmlNotFound, {
			status: 404,
			contentType: 'text/html',
		}).catch((caught: unknown) => caught); // unknown: a rejection reason has no static type

		expect(String(error)).toContain('HTML page');
		expect(String(error)).toContain('path does not exist');
	});

	it('does not leak the API key into the error message', async () => {
		const error = await capture(endpoints.widgets.list, {}, invalidKey, {
			status: 401,
		}).catch((caught: unknown) => caught); // unknown: a rejection reason has no static type

		expect(String(error)).not.toContain(API_KEY);
	});
});

describe('niftyimages plugin definition', () => {
	it('registers as niftyimages with api_key auth and no webhooks', () => {
		const plugin = niftyimages();
		expect(plugin.id).toBe('niftyimages');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
		expect(
			plugin.pluginWebhookMatcher?.({ headers: {}, body: {} } as never),
		).toBe(false);
	});

	it('exposes exactly the 27 catalog operations', () => {
		const nested = Object.entries(niftyimagesEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'beePlugin.suspendUser',
			'beePlugin.userImages',
			'beePlugin.users',
			'images.delete',
			'images.get',
			'images.list',
			'images.stats',
			'maps.addLocation',
			'maps.deleteLocation',
			'maps.get',
			'maps.list',
			'maps.searchLocations',
			'maps.updateLocation',
			'psd.get',
			'psd.update',
			'store.addRecord',
			'store.deleteById',
			'store.deleteRecord',
			'store.fields',
			'timers.updateTargetDate',
			'widgets.images',
			'widgets.list',
			'widgets.stats',
			'widgets.suspendUser',
			'widgets.userImages',
			'widgets.userStats',
			'widgets.users',
		]);
	});

	it('marks deletes destructive, changes write and the rest read', () => {
		const meta = niftyimages().endpointMeta ?? {};
		const destructive = [
			'store.deleteById',
			'store.deleteRecord',
			'maps.deleteLocation',
			'images.delete',
		];
		const write = [
			'store.addRecord',
			'timers.updateTargetDate',
			'maps.addLocation',
			'maps.updateLocation',
			'beePlugin.suspendUser',
			'widgets.suspendUser',
			'psd.update',
		];
		for (const [name, entry] of Object.entries(meta)) {
			const expected = destructive.includes(name)
				? 'destructive'
				: write.includes(name)
					? 'write'
					: 'read';
			expect({ name, risk: entry?.riskLevel }).toEqual({
				name,
				risk: expected,
			});
		}
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = niftyimages();
		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve('stored') },
				} as never,
				'endpoint',
			),
		).resolves.toBe('stored');

		await expect(
			plugin.keyBuilder?.(
				{
					authType: 'api_key',
					options: {},
					keys: { get_api_key: () => Promise.resolve(undefined) },
				} as never,
				'endpoint',
			),
		).rejects.toThrow();
	});

	it('is creatable through createCorsair', () => {
		const corsair = createCorsair({ plugins: [niftyimages({ key: 'k' })] });
		expect(corsair.niftyimages).toBeDefined();
	});
});
