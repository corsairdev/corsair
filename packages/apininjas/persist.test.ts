/**
 * The cache layer, store by store.
 *
 * Two things decide whether a mirror is useful here: the key a row is stored
 * under, and whether a withheld value is stored at all. Most of these endpoints
 * return no identifier, so keys are composed from natural keys - and a wrong
 * key means either a duplicate row or a row that can never be found again.
 *
 * Every write is also best-effort by design: a lookup must not fail because the
 * local mirror could not be written.
 */
import {
	cacheAircraft,
	cacheAirlines,
	cacheAirports,
	cacheAnimals,
	cacheCars,
	cacheCities,
	cacheCountries,
	cacheElectricVehicles,
	cacheEmoji,
	cacheMotorcycles,
	cachePlanets,
	cacheSp500,
	cacheStars,
	cacheStockExchanges,
	cacheUniversities,
} from './endpoints/persist';

type Store = { upsertByEntityId: jest.Mock };

function makeStore(): Store {
	return { upsertByEntityId: jest.fn(async () => undefined) };
}

/** The id and row a cache helper wrote, for the single row it was given. */
function written(store: Store): [string, Record<string, unknown>] {
	expect(store.upsertByEntityId).toHaveBeenCalledTimes(1);
	return store.upsertByEntityId.mock.calls[0] as [
		string,
		Record<string, unknown>,
	];
}

const AT = new Date('2026-08-15T00:00:00.000Z');
const MASKED = 'This field is for premium subscribers only.';

beforeEach(() => {
	jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('airports', () => {
	it('keys on ident and stores the useful columns', async () => {
		const store = makeStore();

		await cacheAirports(
			store,
			[
				{
					ident: 'EGLL',
					icao: 'EGLL',
					iata: 'LHR',
					name: 'London Heathrow Airport',
					city: 'London',
					country: 'GB',
					region: 'England',
					latitude: 51.470748,
					longitude: -0.459909,
					timezone: 'Europe/London',
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('egll');
		expect(row).toEqual({
			id: 'egll',
			ident: 'EGLL',
			iata: 'LHR',
			icao: 'EGLL',
			name: 'London Heathrow Airport',
			city: 'London',
			country: 'GB',
			region: 'England',
			latitude: 51.470748,
			longitude: -0.459909,
			timezone: 'Europe/London',
			captured_at: AT,
		});
	});

	it('falls back through icao, iata and name for its key', async () => {
		const store = makeStore();

		await cacheAirports(
			store,
			[{ icao: 'KJFK' }, { iata: 'CDG' }, { name: 'Some Airstrip' }],
			AT,
		);

		expect(store.upsertByEntityId.mock.calls.map((call) => call[0])).toEqual([
			'kjfk',
			'cdg',
			'some airstrip',
		]);
	});

	it('skips a row with nothing to key on', async () => {
		const store = makeStore();

		await cacheAirports(store, [{ city: 'Nowhere' }], AT);

		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('coerces coordinates that arrive as strings', async () => {
		const store = makeStore();

		await cacheAirports(
			store,
			[
				{
					icao: 'EGLL',
					latitude: '51.47' as never,
					longitude: '-0.45' as never,
				},
			],
			AT,
		);

		const [, row] = written(store);
		expect(row.latitude).toBe(51.47);
		expect(row.longitude).toBe(-0.45);
	});

	it('drops masked fields nested inside runways', async () => {
		const store = makeStore();

		await cacheAirports(
			store,
			[
				{
					icao: 'EGLL',
					runways: [
						{ length: 12799, surface: MASKED },
						{
							length: MASKED as never,
							surface: 'ASP',
							lights: { has_lights: MASKED },
						},
					],
				},
			],
			AT,
		);

		expect(written(store)[1].runways).toEqual([
			{ length: 12799 },
			{ surface: 'ASP' },
		]);
	});

	it('does nothing at all when the store is not configured', async () => {
		// A plugin instance without a database still has to serve lookups.
		await expect(
			cacheAirports(undefined, [{ icao: 'EGLL' }], AT),
		).resolves.toBeUndefined();
	});

	it('does nothing for an empty result', async () => {
		const store = makeStore();

		await cacheAirports(store, [], AT);

		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('swallows a store failure and warns rather than failing the call', async () => {
		const store = makeStore();
		store.upsertByEntityId.mockRejectedValueOnce(new Error('database is gone'));

		await expect(
			cacheAirports(store, [{ icao: 'EGLL' }], AT),
		).resolves.toBeUndefined();
		expect(console.warn).toHaveBeenCalled();
	});
});

describe('airlines', () => {
	it('keys on IATA and stores the official fleet object', async () => {
		const store = makeStore();

		await cacheAirlines(
			store,
			[
				{
					name: 'Singapore Airlines',
					iata: 'SQ',
					icao: 'SIA',
					country: 'Singapore',
					base: 'Singapore Changi Airport',
					fleet: { A359: 59, B77W: 27, total: 155 },
					logo_url: 'https://example.com/logo.png',
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('sq');
		expect(row.fleet).toEqual({ A359: 59, B77W: 27, total: 155 });
		expect(row.base).toBe('Singapore Changi Airport');
	});

	it('leaves the fleet unset when the fleet object is absent', async () => {
		const store = makeStore();

		await cacheAirlines(store, [{ iata: 'SQ' }], AT);

		expect(written(store)[1].fleet).toBeUndefined();
	});

	it('ignores a fleet that is not an object', async () => {
		const store = makeStore();

		await cacheAirlines(store, [{ iata: 'SQ', fleet: 'unknown' as never }], AT);

		expect(written(store)[1].fleet).toBeUndefined();
	});

	it('falls back to icao then name', async () => {
		const store = makeStore();

		await cacheAirlines(store, [{ icao: 'BAW' }, { name: 'Tiny Air' }], AT);

		expect(store.upsertByEntityId.mock.calls.map((call) => call[0])).toEqual([
			'baw',
			'tiny air',
		]);
	});
});

describe('aircraft', () => {
	it('keys on manufacturer and model together', async () => {
		const store = makeStore();

		await cacheAircraft(
			store,
			[
				{
					manufacturer: 'Boeing',
					model: '737 Max 7',
					engine_type: 'Jet',
					max_speed_knots: '547',
					range_nautical_miles: '3850',
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('boeing|737 max 7');
		// The provider sends these as strings; the entity accepts both.
		expect(row.max_speed_knots).toBe('547');
	});

	it('drops a masked specification instead of storing the sentence', async () => {
		const store = makeStore();

		await cacheAircraft(
			store,
			[{ manufacturer: 'Boeing', model: '737', max_speed_knots: MASKED }],
			AT,
		);

		expect(written(store)[1].max_speed_knots).toBeUndefined();
	});

	it('skips a row with neither manufacturer nor model', async () => {
		const store = makeStore();

		await cacheAircraft(store, [{ engine_type: 'Jet' }], AT);

		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});
});

describe('vehicles', () => {
	it('prefixes each source so three endpoints can share one store', async () => {
		const store = makeStore();

		await cacheCars(
			store,
			[{ make: 'toyota', model: 'corolla', year: 1993 }],
			AT,
		);
		await cacheMotorcycles(
			store,
			[{ make: 'toyota', model: 'corolla', year: '1993' }],
			AT,
		);
		await cacheElectricVehicles(
			store,
			[{ make: 'toyota', model: 'corolla', year_start: '1993' }],
			AT,
		);

		const ids = store.upsertByEntityId.mock.calls.map((call) => call[0]);
		// Without the prefix these three rows would collide on one key.
		expect(ids).toEqual([
			'car|toyota|corolla|1993',
			'motorcycle|toyota|corolla|1993',
			'electric|toyota|corolla|1993',
		]);
		expect(new Set(ids).size).toBe(3);
	});

	it('records the kind and the vehicle class for a car', async () => {
		const store = makeStore();

		await cacheCars(
			store,
			[
				{
					make: 'toyota',
					model: 'corolla',
					year: 1993,
					fuel_type: 'gas',
					class: 'compact car',
				},
			],
			AT,
		);

		const [, row] = written(store);
		expect(row.kind).toBe('car');
		expect(row.class).toBe('compact car');
		expect(row.fuel_type).toBe('gas');
	});

	it('takes the motorcycle type as its class', async () => {
		const store = makeStore();

		await cacheMotorcycles(
			store,
			[
				{
					make: 'Kawasaki',
					model: 'Brute Force 300',
					year: '2022',
					type: 'ATV',
				},
			],
			AT,
		);

		const [, row] = written(store);
		expect(row.kind).toBe('motorcycle');
		expect(row.type).toBe('ATV');
	});

	it('marks an electric vehicle as electric without being told', async () => {
		const store = makeStore();

		await cacheElectricVehicles(
			store,
			[{ make: 'Tesla', model: 'Model S 85D', year_start: '2015' }],
			AT,
		);

		const [, row] = written(store);
		expect(row.kind).toBe('electric');
		expect(row.year_start).toBe('2015');
	});

	it('drops the masked fields the electric endpoint is full of', async () => {
		const store = makeStore();

		await cacheElectricVehicles(
			store,
			[{ make: 'Tesla', model: 'Model S', year_start: MASKED }],
			AT,
		);

		expect(written(store)[1].year_start).toBeUndefined();
	});
});

describe('countries and cities', () => {
	it('keys a country on its ISO code and lifts the currency code out', async () => {
		const store = makeStore();

		await cacheCountries(
			store,
			[
				{
					iso2: 'DE',
					name: 'Germany',
					capital: 'Berlin',
					region: 'Western Europe',
					currency: { code: 'EUR', name: 'Euro' },
					population: 83000,
					surface_area: 357376,
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('de');
		expect(row.currency).toEqual({ code: 'EUR', name: 'Euro' });
		expect(row.capital).toBe('Berlin');
	});

	it('falls back to the country name when no ISO code is sent', async () => {
		const store = makeStore();

		await cacheCountries(store, [{ name: 'Germany' }], AT);

		expect(written(store)[0]).toBe('germany');
	});

	it('leaves the currency code unset when the object is missing', async () => {
		const store = makeStore();

		await cacheCountries(store, [{ iso2: 'DE' }], AT);

		expect(written(store)[1].currency).toBeUndefined();
	});

	it('keys a city on name and country, because it has no id', async () => {
		const store = makeStore();

		await cacheCities(
			store,
			[
				{
					name: 'London',
					country: 'GB',
					latitude: 51.5072,
					longitude: -0.1275,
					population: 10979000,
					is_capital: true,
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('london|gb');
		expect(row.is_capital).toBe(true);
	});

	it('keeps two same-named cities in different countries apart', async () => {
		const store = makeStore();

		await cacheCities(
			store,
			[
				{ name: 'London', country: 'GB' },
				{ name: 'London', country: 'CA' },
			],
			AT,
		);

		expect(store.upsertByEntityId.mock.calls.map((call) => call[0])).toEqual([
			'london|gb',
			'london|ca',
		]);
	});

	it('skips a city row with neither name nor country', async () => {
		const store = makeStore();

		await cacheCities(store, [{ population: 1 }], AT);

		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});
});

describe('universities, exchanges and index membership', () => {
	it('keys a university on name and country', async () => {
		const store = makeStore();

		await cacheUniversities(
			store,
			[
				{
					name: 'Harvard University',
					country: 'USA',
					city: 'Cambridge',
					state: 'MA',
					website: 'http://www.harvard.edu/',
					institution_type: 'Private (Not For Profit)',
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('harvard university|usa');
		expect(row.institution_type).toBe('Private (Not For Profit)');
	});

	it('skips a university row with nothing to key on', async () => {
		const store = makeStore();

		await cacheUniversities(store, [{ city: 'Cambridge' }], AT);

		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('keys a stock exchange on its MIC', async () => {
		const store = makeStore();

		await cacheStockExchanges(
			store,
			[
				{
					mic: 'XNAS',
					name: 'NASDAQ Global Market',
					city: 'New York City',
					country: 'United States',
					currency: 'USD',
					timezone: 'America/New_York',
				},
			],
			AT,
		);

		expect(written(store)[0]).toBe('xnas');
	});

	it('falls back to the exchange name without a MIC', async () => {
		const store = makeStore();

		await cacheStockExchanges(store, [{ name: 'Some Exchange' }], AT);

		expect(written(store)[0]).toBe('some exchange');
	});

	it('keys an index constituent on its ticker', async () => {
		const store = makeStore();

		await cacheSp500(
			store,
			[
				{
					ticker: 'MSFT',
					company_name: 'Microsoft',
					sector: 'Information Technology',
					sub_industry: 'Systems Software',
					headquarters: 'Redmond, Washington',
					date_added: '1994-06-01',
					cik: '0000789019',
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('msft');
		expect(row.date_added).toBe('1994-06-01');
	});

	it('skips a constituent with no ticker', async () => {
		const store = makeStore();

		await cacheSp500(store, [{ company_name: 'Microsoft' }], AT);

		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});
});

describe('emoji, animals and astronomy', () => {
	it('keys an emoji on its code point', async () => {
		const store = makeStore();

		await cacheEmoji(
			store,
			[
				{
					code: 'U+1F63C',
					character: ':cat:',
					name: 'cat with wry smile',
					group: 'smileys_emotion',
					subgroup: 'cat_face',
					image: 'https://example.com/emoji.png',
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('u+1f63c');
		expect(row.subgroup).toBe('cat_face');
	});

	it('falls back to the emoji name when no code is sent', async () => {
		const store = makeStore();

		await cacheEmoji(store, [{ name: 'grinning face' }], AT);

		expect(written(store)[0]).toBe('grinning face');
	});

	it('lifts taxonomy and characteristics onto the animal row', async () => {
		const store = makeStore();

		await cacheAnimals(
			store,
			[
				{
					name: 'Cheetah',
					taxonomy: {
						family: 'Felidae',
						scientific_name: 'Acinonyx jubatus',
					},
					characteristics: { habitat: 'Open grassland', diet: 'Carnivore' },
					locations: ['Africa', 'Asia'],
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('cheetah');
		expect(row.taxonomy).toEqual({
			family: 'Felidae',
			scientific_name: 'Acinonyx jubatus',
		});
		expect(row.characteristics).toEqual({
			habitat: 'Open grassland',
			diet: 'Carnivore',
		});
		expect(row.locations).toEqual(['Africa', 'Asia']);
	});

	it('drops masked values nested inside taxonomy', async () => {
		const store = makeStore();

		await cacheAnimals(
			store,
			[
				{
					name: 'Cheetah',
					taxonomy: {
						family: 'Felidae',
						scientific_name: MASKED,
						rank: { order: 'Carnivora', note: MASKED },
					},
				},
			],
			AT,
		);

		expect(written(store)[1].taxonomy).toEqual({
			family: 'Felidae',
			rank: { order: 'Carnivora' },
		});
	});

	it('handles an animal with neither nested object', async () => {
		const store = makeStore();

		await cacheAnimals(store, [{ name: 'Cheetah' }], AT);

		const [, row] = written(store);
		expect(row.taxonomy).toBeUndefined();
		expect(row.characteristics).toBeUndefined();
		expect(row.locations).toBeUndefined();
	});

	it('keeps only string entries in the locations list', async () => {
		const store = makeStore();

		await cacheAnimals(
			store,
			[{ name: 'Cheetah', locations: ['Africa', 42 as never, null as never] }],
			AT,
		);

		expect(written(store)[1].locations).toEqual(['Africa']);
	});

	it('stores a planet with its orbital figures', async () => {
		const store = makeStore();

		await cachePlanets(
			store,
			[
				{
					name: 'Mars',
					mass: 0.000338,
					radius: 0.0488,
					period: 687,
					temperature: 210,
					distance_light_year: 0.000037,
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('mars');
		expect(row.period).toBe(687);
	});

	it('stores a star with its catalogue values as sent', async () => {
		const store = makeStore();

		await cacheStars(
			store,
			[
				{
					name: 'Vega',
					constellation: 'Lyra',
					spectral_class: 'A0Vvar',
					apparent_magnitude: '0.03',
					distance_light_year: '25',
				},
			],
			AT,
		);

		const [id, row] = written(store);
		expect(id).toBe('vega');
		// Strings here are the provider's own format, not a masked value.
		expect(row.apparent_magnitude).toBe('0.03');
	});

	it.each([
		['planets', cachePlanets],
		['stars', cacheStars],
		['animals', cacheAnimals],
	])('skips an unnamed %s row', async (_label, cache) => {
		const store = makeStore();

		await cache(store, [{}], AT);

		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});
});

describe('rows that cannot be keyed', () => {
	// Every store composes its key from whatever the row happens to carry. When
	// none of the candidates are present the row is dropped rather than written
	// under a blank key, where it would collide with every other blank row.
	it.each([
		['airline', cacheAirlines, { country: 'Singapore' }],
		['country', cacheCountries, { capital: 'Berlin' }],
		['stock exchange', cacheStockExchanges, { city: 'New York City' }],
		['emoji', cacheEmoji, { group: 'smileys_emotion' }],
		['aircraft', cacheAircraft, { engine_type: 'Jet' }],
		['city', cacheCities, { population: 1 }],
		['university', cacheUniversities, { city: 'Cambridge' }],
		// The vehicle helpers key on three parts, so a row that carried none of
		// them used to be stored under 'car|||' - and the next such row overwrote
		// it. A key of more than two parts is also why the guard checks the parts
		// rather than comparing the joined string to '|'.
		['car', cacheCars, { fuel_type: 'gas' }],
		['motorcycle', cacheMotorcycles, { type: 'ATV' }],
		[
			'electric vehicle',
			cacheElectricVehicles,
			{ battery_type: 'Lithium-ion' },
		],
	])('drops an unkeyable %s', async (_label, cache, row) => {
		const store = makeStore();

		await cache(store, [row as never], AT);

		expect(store.upsertByEntityId).not.toHaveBeenCalled();
	});

	it('still stores a vehicle identified by only one of its three parts', async () => {
		// The guard rejects a row with nothing to key on, not a partial one.
		const store = makeStore();

		await cacheCars(store, [{ model: 'corolla' }], AT);

		expect(store.upsertByEntityId).toHaveBeenCalledTimes(1);
		expect(store.upsertByEntityId.mock.calls[0]?.[0]).toBe('car||corolla|');
	});
});

describe('every store', () => {
	const helpers = [
		['airports', cacheAirports, { icao: 'EGLL' }],
		['airlines', cacheAirlines, { iata: 'SQ' }],
		['aircraft', cacheAircraft, { manufacturer: 'Boeing', model: '737' }],
		['cars', cacheCars, { make: 'toyota', model: 'corolla' }],
		['motorcycles', cacheMotorcycles, { make: 'Kawasaki', model: 'KLR' }],
		['electric vehicles', cacheElectricVehicles, { make: 'Tesla', model: 'S' }],
		['countries', cacheCountries, { iso2: 'DE' }],
		['cities', cacheCities, { name: 'London', country: 'GB' }],
		['universities', cacheUniversities, { name: 'Harvard', country: 'USA' }],
		['stock exchanges', cacheStockExchanges, { mic: 'XNAS' }],
		['sp500', cacheSp500, { ticker: 'MSFT' }],
		['emoji', cacheEmoji, { code: 'U+1F600' }],
		['animals', cacheAnimals, { name: 'Cheetah' }],
		['planets', cachePlanets, { name: 'Mars' }],
		['stars', cacheStars, { name: 'Vega' }],
	] as const;

	it.each(helpers)('%s stamps the capture time', async (_label, cache, row) => {
		const store = makeStore();

		await cache(store, [row as never], AT);

		// Nothing in this API deletes, so age is the only basis for deciding a
		// mirrored row is stale.
		expect(written(store)[1].captured_at).toBe(AT);
	});

	it.each(helpers)(
		'%s tolerates a missing store',
		async (_label, cache, row) => {
			await expect(
				cache(undefined, [row as never], AT),
			).resolves.toBeUndefined();
		},
	);

	it.each(helpers)(
		'%s keeps working after one row fails to write',
		async (_label, cache, row) => {
			const store = makeStore();
			store.upsertByEntityId.mockRejectedValue(new Error('write failed'));

			await expect(cache(store, [row as never], AT)).resolves.toBeUndefined();
		},
	);
});
