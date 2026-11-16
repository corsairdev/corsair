import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import type { NiftyimagesPluginOptions } from './index';
import { niftyimages, niftyimagesEndpointsNested } from './index';
import {
	htmlNotFound,
	invalidKey,
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

/** Runs one endpoint and returns the response and the request that made it. */
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
		expect(first?.Views).toBe(12480);
		expect(first?.UniqueClicks).toBe(640);
	});

	it('keeps a zeroed widget rather than dropping it', async () => {
		const { result } = await capture(endpoints.widgets.stats, {}, widgetStats);

		const rows = asRecord(result)?.stats;
		const second = asRecord(Array.isArray(rows) ? rows[1] : null);
		// A widget with no traffic reports zeroes, not a missing row.
		expect(second?.Views).toBe(0);
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
		expect(stats?.Views).toBe(12);
		expect(stats?.FirstSeen).toBe('2016-02-10T11:23Z');
	});

	it('rejects a missing user before sending', async () => {
		await expect(
			// Cast past the type: the point is that the schema refuses a missing
			// user at runtime for a caller passing untyped input.
			endpoints.widgets.userStats(makeContext() as never, {
				widgetKey: WIDGET_KEY,
			} as never),
		).rejects.toThrow();
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
		expect(first?.ImageUrl).toContain('cloudfront.net');
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

describe('niftyimages error reporting', () => {
	it('reads the JSON message on a 401', async () => {
		const error = await capture(endpoints.widgets.list, {}, invalidKey, {
			status: 401,
		}).catch((caught: unknown) => caught);

		expect(String(error)).toContain('Your API Key does not appear to be valid');
		expect(String(error)).toContain('401');
	});

	it('calls an HTML 404 a path problem rather than a key problem', async () => {
		const error = await capture(endpoints.widgets.list, {}, htmlNotFound, {
			status: 404,
			contentType: 'text/html',
		}).catch((caught: unknown) => caught);

		expect(String(error)).toContain('HTML page');
		expect(String(error)).toContain('path does not exist');
	});

	it('does not leak the API key into the error message', async () => {
		const error = await capture(endpoints.widgets.list, {}, invalidKey, {
			status: 401,
		}).catch((caught: unknown) => caught);

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

	it('exposes exactly the six catalog operations', () => {
		const nested = Object.entries(niftyimagesEndpointsNested).flatMap(
			([group, fns]) => Object.keys(fns).map((name) => `${group}.${name}`),
		);
		expect(nested.sort()).toEqual([
			'widgets.images',
			'widgets.list',
			'widgets.stats',
			'widgets.userImages',
			'widgets.userStats',
			'widgets.users',
		]);
	});

	it('marks every operation a read, because nothing here writes', () => {
		const meta = niftyimages().endpointMeta ?? {};
		for (const entry of Object.values(meta)) {
			expect(entry.riskLevel).toBe('read');
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
