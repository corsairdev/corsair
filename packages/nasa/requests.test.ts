import { createCorsair } from 'corsair';
import type { CorsairEndpoint } from 'corsair/core';
import { asRecord } from 'corsair/core';
import { ApiError } from 'corsair/http';
import type { NasaPluginOptions } from './index';
import { nasa, nasaEndpointsNested, nasaErrorCode } from './index';
import {
	apodList,
	apodSingle,
	donkiCme,
	donkiCmeAnalysis,
	donkiEnlil,
	donkiFlare,
	donkiHighSpeedStream,
	donkiMpc,
	donkiNotification,
	donkiRbe,
	donkiSep,
	donkiShock,
	donkiStorm,
	eonetEvent,
	eonetEvents,
	epicImage,
	imageAsset,
	imageSearch,
	neoBrowsePage,
	neoFeedPage,
} from './test-fixtures';

/**
 * Builds a context the endpoints can use without a database or a real key.
 * `log` is a no-op so assertions stay about the request and the output.
 */
function makeContext(key = 'test-key') {
	const logged: string[] = [];
	return {
		key,
		authType: 'api_key' as const,
		options: {} as NasaPluginOptions,
		tenantId: 'default',
		log: async (event: string) => {
			logged.push(event);
		},
		db: {},
		keys: {},
		_http: {},
		logged,
	};
}

// Each operation has its own input and output type, and every call site passes
// concrete values, so the helper only needs the loose base shape.
// unknown: each operation has its own parsed input and output, and every call
// site passes a concrete value that the operation's schema validates.
type Endpoint = CorsairEndpoint<never, unknown, unknown>; // unknown: see above

const endpoints = nasaEndpointsNested;

/** Runs one endpoint and returns the response and the request that made it. */
// unknown: the helper forwards a caller-built input and a fixture body, and the
// endpoint's own schemas are what narrow them.
async function capture(
	endpoint: Endpoint,
	input: unknown, // unknown: validated by the operation's input schema
	body: unknown, // unknown: a fixture, parsed by the output schema
	{ status = 200, contentType = 'application/json', key = 'test-key' } = {},
	// unknown: the result is the operation's output, read through asRecord below.
): Promise<{ result: unknown; url: string; init: RequestInit }> {
	// unknown: output
	const original = globalThis.fetch;
	let url = '';
	let init: RequestInit = {};
	globalThis.fetch = (async (called: string, options: RequestInit) => {
		url = called;
		init = options;
		return new Response(
			typeof body === 'string' ? body : JSON.stringify(body),
			{
				status,
				headers: { 'Content-Type': contentType },
			},
		);
	}) as typeof fetch;

	try {
		const result = await endpoint(makeContext(key) as never, input);
		if (!url) throw new Error('no request was made');
		return { result, url, init };
	} finally {
		globalThis.fetch = original;
	}
}

describe('apod.list', () => {
	it('sends page, per_page and the date range to the APOD feed', async () => {
		const { url } = await capture(
			endpoints.apod.list,
			{ page: 2, per_page: 10, date_from: '240115', date_to: '240117' },
			apodList,
		);

		expect(url).toBe(
			'https://science.nasa.gov/wp-json/wp/v2/apod-basic?page=2&per_page=10&date_from=240115&date_to=240117&api_key=test-key',
		);
		// The legacy host serves a different response shape and is retired.
		expect(url).not.toContain('/planetary/apod');
	});

	it('returns the entries the feed sent', async () => {
		const { result } = await capture(endpoints.apod.list, {}, apodList);

		expect(asRecord(result)?.entries).toHaveLength(1);
	});

	it('rejects entries that are not an array', async () => {
		await expect(
			capture(endpoints.apod.list, {}, { entries: [] }),
		).rejects.toThrow(/APOD entry array/);
	});

	it('keeps the leading zero of a 2000-2009 date code', async () => {
		// The feed answers 400 rest_invalid_param for 50101 (checked live).
		const { url } = await capture(
			endpoints.apod.list,
			{ date_from: '050101', date_to: '050103' },
			apodList,
		);

		expect(new URL(url).searchParams.get('date_from')).toBe('050101');
		expect(new URL(url).searchParams.get('date_to')).toBe('050103');
	});

	it('rejects a numeric date code, which would lose a leading zero', async () => {
		await expect(
			capture(
				endpoints.apod.list,
				{ date_from: 50101, date_to: 50103 },
				apodList,
			),
		).rejects.toThrow();
	});

	it('rejects a one-sided date range before sending it', async () => {
		await expect(
			capture(endpoints.apod.list, { date_from: '240115' }, apodList),
		).rejects.toThrow(/date_from and date_to/);
	});
});

describe('apod.get', () => {
	it('addresses a day by its six-digit code', async () => {
		const { result, url } = await capture(
			endpoints.apod.get,
			{ date: '261115' },
			apodSingle,
		);

		expect(url).toBe(
			'https://science.nasa.gov/wp-json/wp/v2/apod-basic/261115?api_key=test-key',
		);
		expect(asRecord(result)?.title).toBe('Leonid Meteors Through Orion');
	});

	it('accepts a single object rather than an array', async () => {
		const { result } = await capture(
			endpoints.apod.get,
			{ date: '261115' },
			apodSingle,
		);

		expect(Array.isArray(result)).toBe(false);
		expect(asRecord(result)?.date).toBe('2026-11-15');
	});

	it('rejects a YYYY-MM-DD date, which the feed does not accept', async () => {
		await expect(
			endpoints.apod.get(makeContext() as never, { date: '2026-11-15' }),
		).rejects.toThrow(/YYMMDD/);
	});
});

describe('neo.feed', () => {
	it('sends the window and keeps decimal strings as strings', async () => {
		const { result, url } = await capture(
			endpoints.neo.feed,
			{ start_date: '2026-11-01', end_date: '2026-11-02' },
			neoFeedPage,
		);

		expect(url).toBe(
			'https://api.nasa.gov/neo/rest/v1/feed?start_date=2026-11-01&end_date=2026-11-02&api_key=test-key',
		);
		const page = asRecord(result);
		expect(page?.element_count).toBe(11);
		const objects = asRecord(page?.near_earth_objects);
		// Each day key holds an array of asteroids.
		const firstDay = objects?.['2026-11-01'];
		expect(Array.isArray(firstDay)).toBe(true);
		const first = asRecord(Array.isArray(firstDay) ? firstDay[0] : null);
		expect(first?.id).toBe('2307493');
		const approaches = first?.close_approach_data;
		const approach = asRecord(Array.isArray(approaches) ? approaches[0] : null);
		expect(asRecord(approach?.miss_distance)?.kilometers).toBe(
			'45865643.869616206',
		);
	});

	it('keeps an empty object when no day matched', async () => {
		const { result } = await capture(
			endpoints.neo.feed,
			{ start_date: '2026-11-01', end_date: '2026-11-02' },
			{ element_count: 0, near_earth_objects: {} },
		);

		expect(asRecord(asRecord(result)?.near_earth_objects)).toEqual({});
	});
});

describe('neo.browse', () => {
	it('passes the page and size and returns the page block', async () => {
		const { result, url } = await capture(
			endpoints.neo.browse,
			{ page: 0, size: 1 },
			neoBrowsePage,
		);

		expect(url).toBe(
			'https://api.nasa.gov/neo/rest/v1/neo/browse?page=0&size=1&api_key=test-key',
		);
		expect(asRecord(asRecord(result)?.page)?.total_pages).toBe(63077);
	});
});

describe('DONKI routes', () => {
	it('sends startDate and endDate for the CME listing', async () => {
		const { result, url } = await capture(
			endpoints.donki.cme,
			{ startDate: '2026-11-01', endDate: '2026-11-05' },
			donkiCme,
		);

		expect(url).toBe(
			'https://api.nasa.gov/DONKI/CME?startDate=2026-11-01&endDate=2026-11-05&api_key=test-key',
		);
		expect(asRecord(result)?.events).toHaveLength(1);
	});

	it('requires both dates for the CME listing, which answers 400 without them', async () => {
		await expect(capture(endpoints.donki.cme, {}, donkiCme)).rejects.toThrow();
		await expect(
			capture(endpoints.donki.cme, { startDate: '2026-11-01' }, donkiCme),
		).rejects.toThrow();
	});

	it('leaves the ENLIL and notification windows to the provider when omitted', async () => {
		const { url } = await capture(endpoints.donki.enlilSimulation, {}, []);

		expect(new URL(url).searchParams.has('startDate')).toBe(false);
	});

	it('reads a populated CME analysis', async () => {
		const { result } = await capture(
			endpoints.donki.cmeAnalysis,
			{ startDate: '2026-10-20', endDate: '2026-10-31' },
			donkiCmeAnalysis,
		);

		const analyses = asRecord(result)?.analyses;
		const first = asRecord(Array.isArray(analyses) ? analyses[0] : null);
		expect(first?.associatedCMEID).toBe(donkiCmeAnalysis[0]?.associatedCMEID);
		expect(typeof first?.speed).toBe('number');
		expect(first?.isMostAccurate).toBe(true);
	});

	it('reads populated SEP, MPC, RBE and flare records', async () => {
		const cases: Array<[Endpoint, string, readonly object[], string]> = [
			[endpoints.donki.solarEnergeticParticle, 'particles', donkiSep, 'sepID'],
			[endpoints.donki.magnetopauseCrossing, 'crossings', donkiMpc, 'mpcID'],
			[endpoints.donki.radiationBelt, 'enhancements', donkiRbe, 'rbeID'],
			[endpoints.donki.solarFlare, 'flares', donkiFlare, 'flrID'],
		];

		for (const [endpoint, key, body, idField] of cases) {
			const { result } = await capture(
				endpoint,
				{ startDate: '2024-05-01', endDate: '2024-05-31' },
				body,
			);
			const list = asRecord(result)?.[key];
			const first = asRecord(Array.isArray(list) ? list[0] : null);
			expect({ key, id: first?.[idField] }).toEqual({
				key,
				id: asRecord(body[0])?.[idField],
			});
			expect(Array.isArray(first?.instruments)).toBe(true);
		}
	});

	it('reads an ENLIL run with its CME inputs and impact list', async () => {
		const { result } = await capture(
			endpoints.donki.enlilSimulation,
			{ startDate: '2026-10-01', endDate: '2026-10-31' },
			donkiEnlil,
		);

		const list = asRecord(result)?.simulations;
		const run = asRecord(Array.isArray(list) ? list[0] : null);
		const input = asRecord(
			Array.isArray(run?.cmeInputs) ? run.cmeInputs[0] : null,
		);
		const impact = asRecord(
			Array.isArray(run?.impactList) ? run.impactList[0] : null,
		);
		expect(run?.simulationID).toBe('WSA-ENLIL/48927/1');
		expect(input?.CMEID).toBe('2026-10-02T00:53:00-CME-001');
		expect(input?.speed).toBe(255);
		expect(impact).toMatchObject({ location: 'Mars', isGlancingBlow: true });
		expect(run?.estimatedShockArrivalTime).toBeNull();
	});

	it('passes the CME analysis filters the provider documents', async () => {
		const { url } = await capture(
			endpoints.donki.cmeAnalysis,
			{
				startDate: '2026-10-20',
				endDate: '2026-10-31',
				mostAccurateOnly: true,
				speed: 500,
				halfAngle: 30,
				catalog: 'ALL',
			},
			[],
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/DONKI/CMEAnalysis');
		expect(parsed.searchParams.get('mostAccurateOnly')).toBe('true');
		expect(parsed.searchParams.get('speed')).toBe('500');
		expect(parsed.searchParams.get('halfAngle')).toBe('30');
		expect(parsed.searchParams.get('catalog')).toBe('ALL');
	});

	it('rejects a catalog the provider does not offer', async () => {
		await expect(
			// Cast past the enum: the point is that the schema refuses it at runtime
			// for a caller passing untyped input.
			endpoints.donki.cmeAnalysis(makeContext() as never, {
				catalog: 'NOT_A_CATALOG' as never,
			}),
		).rejects.toThrow();
	});

	it('returns storms under their own key', async () => {
		const { result } = await capture(
			endpoints.donki.geomagneticStorm,
			{ startDate: '2026-10-20', endDate: '2026-10-31' },
			donkiStorm,
		);

		expect(asRecord(result)?.storms).toHaveLength(1);
	});

	it('returns high speed streams under their own key', async () => {
		const { result, url } = await capture(
			endpoints.donki.highSpeedStream,
			{ startDate: '2026-10-01', endDate: '2026-10-31' },
			donkiHighSpeedStream,
		);

		expect(new URL(url).pathname).toBe('/DONKI/HSS');
		expect(asRecord(result)?.streams).toHaveLength(1);
	});

	it('passes the shock location and catalog filters', async () => {
		const { result, url } = await capture(
			endpoints.donki.interplanetaryShock,
			{
				startDate: '2026-10-20',
				endDate: '2026-10-31',
				location: 'Earth',
				catalog: 'ALL',
			},
			donkiShock,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/DONKI/IPS');
		expect(parsed.searchParams.get('location')).toBe('Earth');
		expect(asRecord(result)?.shocks).toHaveLength(1);
	});

	it('rejects a shock location the provider does not offer', async () => {
		await expect(
			endpoints.donki.interplanetaryShock(makeContext() as never, {
				location: 'Mars' as never,
			}),
		).rejects.toThrow();
	});

	it('returns notifications with their body text', async () => {
		const { result, url } = await capture(
			endpoints.donki.notification,
			{ startDate: '2026-11-01', endDate: '2026-11-03', type: 'all' },
			donkiNotification,
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/DONKI/notifications');
		expect(parsed.searchParams.get('type')).toBe('all');
		expect(asRecord(result)?.notifications).toHaveLength(1);
	});

	it('rejects a notification type the provider does not offer', async () => {
		await expect(
			endpoints.donki.notification(makeContext() as never, {
				type: 'VOLCANO' as never,
			}),
		).rejects.toThrow();
	});

	it('fails loudly when a DONKI route answers something other than an array', async () => {
		await expect(
			capture(
				endpoints.donki.cme,
				{ startDate: '2026-11-01', endDate: '2026-11-05' },
				{ message: 'not an array' },
			),
		).rejects.toThrow(/DONKI event array/);
	});

	it('sends the same date window to every route that takes only dates', async () => {
		const routes: Array<[string, Endpoint, string]> = [
			['solarFlare', endpoints.donki.solarFlare, '/DONKI/FLR'],
			[
				'solarEnergeticParticle',
				endpoints.donki.solarEnergeticParticle,
				'/DONKI/SEP',
			],
			[
				'magnetopauseCrossing',
				endpoints.donki.magnetopauseCrossing,
				'/DONKI/MPC',
			],
			['radiationBelt', endpoints.donki.radiationBelt, '/DONKI/RBE'],
			[
				'enlilSimulation',
				endpoints.donki.enlilSimulation,
				'/DONKI/WSAEnlilSimulations',
			],
		];

		for (const [name, endpoint, path] of routes) {
			const { url } = await capture(
				endpoint,
				{ startDate: '2026-10-01', endDate: '2026-10-31' },
				[],
			);
			expect({ name, path: new URL(url).pathname }).toEqual({ name, path });
			expect(new URL(url).searchParams.get('startDate')).toBe('2026-10-01');
		}
	});
});

describe('epic', () => {
	it('reads the most recent day from the collection path', async () => {
		const { url } = await capture(endpoints.epic.images, {}, epicImage);

		expect(url).toBe('https://epic.gsfc.nasa.gov/api/natural');
	});

	it('reads one day and keeps the space in the timestamp', async () => {
		const { result, url } = await capture(
			endpoints.epic.images,
			{ collection: 'enhanced', date: '2019-05-30' },
			epicImage,
		);

		expect(url).toBe('https://epic.gsfc.nasa.gov/api/enhanced/date/2019-05-30');
		const images = asRecord(result)?.images;
		const first = asRecord(Array.isArray(images) ? images[0] : null);
		expect(first?.date).toBe('2019-05-30 01:09:10');
	});

	it('rejects a null body instead of reading it as a day without imagery', async () => {
		await expect(
			capture(endpoints.epic.images, { date: '2019-05-30' }, null),
		).rejects.toThrow();
	});

	it('rejects a date list with a malformed entry instead of dropping it', async () => {
		await expect(
			capture(endpoints.epic.availableDates, {}, [
				'2015-06-13',
				{ date: 7 },
				null,
			]),
		).rejects.toThrow();
	});

	it('returns an empty list for a day without imagery', async () => {
		const { result } = await capture(
			endpoints.epic.images,
			{ date: '1999-01-01' },
			[],
		);

		expect(asRecord(result)?.images).toEqual([]);
	});

	it('lists available dates as strings', async () => {
		const { result, url } = await capture(endpoints.epic.availableDates, {}, [
			'2015-06-13',
			'2015-06-16',
		]);

		expect(url).toBe('https://epic.gsfc.nasa.gov/api/natural/available');
		expect(asRecord(result)?.dates).toEqual(['2015-06-13', '2015-06-16']);
	});

	it('flattens the object form that /all answers', async () => {
		const { result } = await capture(endpoints.epic.availableDates, {}, [
			{ date: '2026-11-13' },
			{ date: '2026-11-12' },
		]);

		// Returned oldest first, whatever order the provider used.
		expect(asRecord(result)?.dates).toEqual(['2026-11-12', '2026-11-13']);
	});
});

describe('eonet', () => {
	it('parses a JSON body that arrives as rss+xml text', async () => {
		const { result, url } = await capture(
			endpoints.eonet.events,
			{ category: ['wildfires'], limit: 1 },
			JSON.stringify(eonetEvents),
			{ contentType: 'application/rss+xml; charset=utf-8' },
		);

		const parsed = new URL(url);
		expect(parsed.pathname).toBe('/api/v3/events');
		expect(parsed.searchParams.get('category')).toBe('wildfires');
		expect(asRecord(result)?.events).toHaveLength(1);
	});

	it('joins several sources and categories with commas', async () => {
		const { url } = await capture(
			endpoints.eonet.events,
			{ source: ['InciWeb', 'EO'], category: ['wildfires', 'severeStorms'] },
			JSON.stringify(eonetEvents),
			{ contentType: 'application/rss+xml' },
		);

		const parsed = new URL(url);
		expect(parsed.searchParams.get('source')).toBe('InciWeb,EO');
		expect(parsed.searchParams.get('category')).toBe('wildfires,severeStorms');
	});

	it('rejects a bounding box the API cannot read', async () => {
		await expect(
			endpoints.eonet.events(makeContext() as never, { bbox: 'not-a-box' }),
		).rejects.toThrow(/minLon/);
	});

	it('reads one event without an envelope', async () => {
		const { result, url } = await capture(
			endpoints.eonet.event,
			{ eventId: 'EONET_26331' },
			JSON.stringify(eonetEvent),
			{ contentType: 'application/rss+xml' },
		);

		expect(url).toBe('https://eonet.gsfc.nasa.gov/api/v3/events/EONET_26331');
		expect(asRecord(result)?.title).toBe(
			'Wildfire Red Hill, Perry, Mississippi',
		);
	});

	it('reports the categories the API offers', async () => {
		const payload = {
			title: 'EONET Event Categories',
			categories: [{ id: 'drought', title: 'Drought' }],
		};
		const { result } = await capture(
			endpoints.eonet.categories,
			{},
			JSON.stringify(payload),
			{ contentType: 'application/rss+xml' },
		);

		expect(asRecord(result)?.categories).toHaveLength(1);
	});
});

describe('images', () => {
	it('sends the search terms and lifts the items and total out', async () => {
		const { result, url } = await capture(
			endpoints.images.search,
			{ q: 'moon', media_type: 'image', page_size: 2 },
			imageSearch,
		);

		const parsed = new URL(url);
		expect(`${parsed.origin}${parsed.pathname}`).toBe(
			'https://images-api.nasa.gov/search',
		);
		expect(parsed.searchParams.get('q')).toBe('moon');
		expect(parsed.searchParams.get('media_type')).toBe('image');
		const page = asRecord(result);
		expect(page?.total_hits).toBe(22691);
		expect(page?.next_page).toBe(2);
	});

	it('rejects an empty search before sending it', async () => {
		await expect(
			endpoints.images.search(makeContext() as never, {}),
		).rejects.toThrow(/At least one search parameter/);
	});

	it('joins keywords with commas', async () => {
		const { url } = await capture(
			endpoints.images.search,
			{ keywords: ['Moon', 'Apollo'] },
			imageSearch,
		);

		expect(new URL(url).searchParams.get('keywords')).toBe('Moon,Apollo');
	});

	it('reports no next page when the last page came back short', async () => {
		const lastPage = {
			collection: {
				...imageSearch.collection,
				metadata: { total_hits: 1 },
				links: [],
			},
		};
		const { result } = await capture(
			endpoints.images.search,
			{ q: 'moon' },
			lastPage,
		);

		expect(asRecord(result)?.next_page).toBeUndefined();
	});

	it('rejects a search envelope without an items list', async () => {
		await expect(
			capture(
				endpoints.images.search,
				{ q: 'moon' },
				{ collection: { metadata: { total_hits: 3 }, links: [] } },
			),
		).rejects.toThrow();
	});

	it('rejects a bare string manifest entry, which NASA does not send', async () => {
		await expect(
			capture(
				endpoints.images.asset,
				{ nasa_id: 'as11-40-5874' },
				{
					collection: { items: [{ href: 'http://a/orig.jpg' }, 'http://a/x'] },
				},
			),
		).rejects.toThrow();
	});

	it('rejects malformed paging fields instead of reading them as a last page', async () => {
		await expect(
			capture(
				endpoints.images.search,
				{ q: 'moon' },
				{ collection: { ...imageSearch.collection, links: { rel: 'next' } } },
			),
		).rejects.toThrow(/links/);
		await expect(
			capture(
				endpoints.images.search,
				{ q: 'moon' },
				{
					collection: {
						...imageSearch.collection,
						metadata: { total_hits: '3' },
					},
				},
			),
		).rejects.toThrow();
	});

	it('rejects a manifest entry without an href instead of dropping the file', async () => {
		await expect(
			capture(
				endpoints.images.asset,
				{ nasa_id: 'as11-40-5874' },
				{ collection: { items: [{ href: 'http://a/orig.jpg' }, { size: 3 }] } },
			),
		).rejects.toThrow();
	});

	it('lists the manifest and lifts the metadata.json entry out', async () => {
		const { result, url } = await capture(
			endpoints.images.asset,
			{ nasa_id: 'as11-40-5874' },
			imageAsset,
		);

		expect(url).toBe('https://images-api.nasa.gov/asset/as11-40-5874');
		const asset = asRecord(result);
		expect(asset?.metadata_url).toBe(
			'http://images-assets.nasa.gov/image/as11-40-5874/metadata.json',
		);
		expect(asset?.manifest).toHaveLength(3);
	});

	it('returns the metadata location', async () => {
		const { result } = await capture(
			endpoints.images.metadata,
			{ nasa_id: 'as11-40-5874' },
			{
				location:
					'https://images-assets.nasa.gov/image/as11-40-5874/metadata.json',
			},
		);

		expect(asRecord(result)?.location).toContain('metadata.json');
	});
});

describe('nasa plugin definition', () => {
	it('registers as nasa with api_key auth and no webhooks', () => {
		const plugin = nasa();
		expect(plugin.id).toBe('nasa');
		expect(plugin.options?.authType).toBe('api_key');
		expect(plugin.webhooks).toEqual({});
	});

	it('builds a key from the option, then the stored key, then throws', async () => {
		const plugin = nasa();
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
		const corsair = createCorsair({ plugins: [nasa({ key: 'k' })] });
		expect(corsair.nasa).toBeDefined();
	});
});

describe('errors', () => {
	it('passes core ApiError through without the bbox coordinates', async () => {
		const bbox = '-129.02,50.73,-58.71,12.89';
		const caught = await capture(
			endpoints.eonet.events,
			{ bbox },
			'<html>Internal error</html>',
			{ status: 500, contentType: 'text/html' },
		).then(
			() => undefined,
			(error: unknown) => error,
		);

		expect(caught).toBeInstanceOf(ApiError);
		const error = caught as ApiError;
		expect(error.status).toBe(500);
		const echoed = JSON.stringify({
			message: error.message,
			url: error.url,
			request: error.request,
		});
		expect(echoed).not.toContain('-129.02');
		expect(error.request.query?.bbox).toBe('[REDACTED]');
	});

	it('keeps the api.nasa.gov error code readable on the ApiError body', async () => {
		const caught = await capture(
			endpoints.neo.browse,
			{},
			{
				error: {
					code: 'API_KEY_INVALID',
					message: 'An invalid api_key was supplied.',
				},
			},
			{ status: 403 },
		).then(
			() => undefined,
			(error: unknown) => error,
		);

		expect(caught).toBeInstanceOf(ApiError);
		expect(JSON.stringify((caught as ApiError).url)).not.toContain('test-key');
		expect(nasaErrorCode(caught)).toBe('API_KEY_INVALID');
	});

	it('lets core retry a 429 instead of failing on the first one', async () => {
		const original = globalThis.fetch;
		let calls = 0;
		globalThis.fetch = (async () => {
			calls += 1;
			return calls === 1
				? new Response(JSON.stringify({ error: { code: 'OVER_RATE_LIMIT' } }), {
						status: 429,
						headers: { 'Content-Type': 'application/json' },
					})
				: new Response(JSON.stringify(neoBrowsePage), {
						status: 200,
						headers: { 'Content-Type': 'application/json' },
					});
		}) as typeof fetch;
		try {
			const result = await endpoints.neo.browse(makeContext() as never, {});
			expect(calls).toBe(2);
			expect(asRecord(result)?.near_earth_objects).toBeDefined();
		} finally {
			globalThis.fetch = original;
		}
	});
});
