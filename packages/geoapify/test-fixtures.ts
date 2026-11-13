// Shapes taken from Geoapify's published OpenAPI specifications
// (https://github.com/geoapify/geoapify-openapi-specs) and live probes. A bad
// key answers 401 with `{"statusCode":401,"error":"Unauthorized","message":"Invalid apiKey"}`.

/** The gateway envelope every Geoapify API shares. */
export const unauthorized = {
	statusCode: 401,
	error: 'Unauthorized',
	message: 'Invalid apiKey',
};

export const badRequest = {
	statusCode: 400,
	error: 'Bad Request',
	message: '"limit" must be less than or equal to 100',
};

export const quotaExceeded = {
	statusCode: 429,
	error: 'Too Many Requests',
	message: 'Quota exceeded',
};

export const serverError = {
	statusCode: 500,
	error: 'Internal Server Error',
	message: 'Request failed, please try again later',
};

/** One geocoded address, as `format: json` returns it. */
export const berlin = {
	results: [
		{
			country: 'Germany',
			country_code: 'de',
			state: 'Berlin',
			city: 'Berlin',
			postcode: '10115',
			formatted: '10115 Berlin, Germany',
			address_line1: 'Berlin',
			address_line2: 'Germany',
			lon: 13.38886,
			lat: 52.51704,
			place_id: '51289a4b5f3d4d0f4058f2e9c8a1b7d6',
			result_type: 'city',
			rank: { confidence: 0.9876, match_type: 'inner_part' },
			timezone: {
				name: 'Europe/Berlin',
				offset_STD: '+01:00',
				offset_STD_seconds: 3600,
				offset_DST: '+02:00',
				offset_DST_seconds: 7200,
				abbreviation_STD: 'CET',
				abbreviation_DST: 'CEST',
			},
			// The json format answers bbox as an object, not an array (live, 11-14).
			bbox: { lon1: 13.228, lat1: 52.437, lon2: 13.548, lat2: 52.597 },
		},
		{
			country: 'United States',
			country_code: 'us',
			state: 'New Hampshire',
			city: 'Berlin',
			postcode: '03570',
			formatted: '03570 Berlin, NH, United States',
			lon: -71.18508,
			lat: 44.46867,
			place_id: '51b1e5b0a1f34e0c4058abcd1234ef56',
			result_type: 'city',
			rank: { confidence: 0.5 },
		},
	],
	query: { text: 'Berlin', parsed: { city: 'berlin' } },
};

export const reverseResult = {
	results: [
		{
			country: 'Germany',
			country_code: 'de',
			state: 'Berlin',
			city: 'Berlin',
			district: 'Mitte',
			street: 'Unter den Linden',
			housenumber: '1',
			postcode: '10117',
			formatted: 'Unter den Linden 1, 10117 Berlin, Germany',
			lon: 13.3893,
			lat: 52.517,
			place_id: '51c0a2b3d4e5f60718293a4b5c6d7e8f',
			result_type: 'building',
			rank: { confidence: 1 },
		},
	],
};

/** The v2 places answer, which is always a feature collection. */
export const places = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: {
				name: 'Café am Hafen',
				city: 'Berlin',
				country: 'Germany',
				country_code: 'de',
				postcode: '10117',
				street: 'Unter den Linden',
				housenumber: '5',
				lon: 13.3899,
				lat: 52.5173,
				place_id: 'ab12cd34ef56ab78cd90ef12ab34cd56',
				category: 'catering.cafe',
				categories: ['catering.cafe', 'catering'],
				opening_hours: 'Mo-Su 08:00-20:00',
				website: 'https://cafe-am-hafen.example',
			},
			geometry: { type: 'Point', coordinates: [13.3899, 52.5173] },
			bbox: [13.3898, 52.5172, 13.39, 52.5174],
		},
	],
};

/** A route in `format: json`, with no geometry tree. */
/**
 * A live json route (Brandenburg Gate to Alexanderplatz, drive,
 * `details=instruction_details`), trimmed to two steps and four points.
 * `instruction` is an object and `geometry` is one list of points per leg.
 */
export const route = {
	results: [
		{
			mode: 'drive',
			waypoints: [
				{ location: [13.3777, 52.5163], original_index: 0 },
				{ location: [13.405, 52.52], original_index: 1 },
			],
			units: 'metric',
			details: ['instruction_details'],
			distance: 1921,
			distance_units: 'meters',
			time: 165.261,
			legs: [
				{
					distance: 1921,
					time: 165.261,
					steps: [
						{
							from_index: 0,
							to_index: 2,
							distance: 17,
							time: 3.167,
							instruction: {
								text: 'Drive south on Pariser Platz.',
								type: 'StartAtRight',
								transition_instruction:
									'Drive south. Then Turn left to stay on Pariser Platz.',
								streets: ['Pariser Platz'],
								contains_next_instruction: true,
							},
						},
						{
							from_index: 99,
							to_index: 99,
							distance: 0,
							time: 0,
							instruction: {
								text: 'You have arrived at your destination.',
								type: 'DestinationReached',
							},
						},
					],
				},
			],
			geometry: [
				[
					{ lon: 13.378236, lat: 52.51634 },
					{ lon: 13.378241, lat: 52.516317 },
					{ lon: 13.404987, lat: 52.520013 },
					{ lon: 13.405, lat: 52.52 },
				],
			],
		},
	],
	properties: {
		mode: 'drive',
		waypoints: [
			{ lat: 52.5163, lon: 13.3777 },
			{ lat: 52.52, lon: 13.405 },
		],
		units: 'metric',
	},
};

export const isoline = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: { id: 'isoline-300', type: 'time', range: 300 },
			geometry: { type: 'Polygon', coordinates: [] },
			bbox: [13.35, 52.46, 13.45, 52.54],
		},
		{
			type: 'Feature',
			properties: { id: 'isoline-600', type: 'time', range: 600 },
			geometry: { type: 'Polygon', coordinates: [] },
			bbox: [13.3, 52.4, 13.5, 52.6],
		},
	],
	bbox: [13.3, 52.4, 13.5, 52.6],
	properties: { id: 'route-1' },
};

/** What the docs say a slow isoline answers with HTTP 202: no areas, an ID. */
export const isolinePending = {
	type: 'FeatureCollection',
	features: [],
	properties: { id: '5c56584478c1aeb8c14a0b0211a71c91' },
};

/** A matrix where one pair has no route, which is a normal answer. */
/**
 * A live matrix: Brandenburg Gate to Alexanderplatz, and to New York, which has
 * no road route, so that cell is `null`.
 */
export const matrix = {
	sources: [
		{ original_location: [13.3777, 52.5163], location: [13.378236, 52.51634] },
	],
	targets: [
		{ original_location: [13.405, 52.52], location: [13.404987, 52.520013] },
		{ original_location: [-74, 40.7], location: [-73.997023, 40.698878] },
	],
	sources_to_targets: [
		[
			{ distance: 1921, time: 165, source_index: 0, target_index: 0 },
			{ distance: null, time: null, source_index: 0, target_index: 1 },
		],
	],
	units: 'metric',
	distance_units: 'meters',
	mode: 'drive',
};

export const ipInfo = {
	ip: '54.201.16.177',
	continent: { code: 'NA', name: 'North America' },
	country: { iso_code: 'US', name: 'United States' },
	state: { name: 'Oregon', code: 'OR' },
	city: { name: 'Portland' },
	postal: { code: '97205' },
	location: { latitude: 45.5231, longitude: -122.6765 },
	subdivisions: [{ name: 'Multnomah County' }],
};

/** A live answer for the Brandenburg Gate at 2026-07-01T12:00:00Z. */
export const timezone = {
	lat: 52.5163,
	lon: 13.3777,
	at: '2026-07-01T12:00:00.000Z',
	tzdb_version: '2026e',
	timezones: [
		{
			name: 'Europe/Berlin',
			type: 'daylightSaving',
			utc_offset: '+02:00',
			offset_seconds: 7200,
			abbreviation: 'CEST',
			local_time: '2026-07-01T14:00:00.000+02:00',
			next_transition: {
				at: '2026-10-25T01:00:00.000Z',
				before: {
					type: 'daylightSaving',
					utc_offset: '+02:00',
					offset_seconds: 7200,
					abbreviation: 'CEST',
				},
				after: {
					type: 'standard',
					utc_offset: '+01:00',
					offset_seconds: 3600,
					abbreviation: 'CET',
				},
				offset_change_seconds: -3600,
				kind: 'daylight-end',
			},
		},
	],
};

export const postcodes = {
	results: [
		{
			postcode: '10115',
			country_code: 'de',
			city: 'Berlin',
			state: 'Berlin',
			state_code: 'BE',
			district: 'Mitte',
			lon: 13.3889,
			lat: 52.5323,
			place_id: '51a2b3c4d5e6f708192a3b4c5d6e7f80',
			formatted: '10115 Berlin, Germany',
		},
	],
};

export const boundaries = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			properties: { name: 'Berlin', level: 'city', place_id: '51abc' },
			geometry: { type: 'MultiPolygon', coordinates: [] },
		},
		{
			type: 'Feature',
			properties: { name: 'Germany', level: 'country', place_id: '51def' },
			geometry: { type: 'MultiPolygon', coordinates: [] },
		},
	],
};

/**
 * Live samples (Brandenburg Gate, Everest), plus a third point with no value,
 * which the spec documents as `null`.
 */
export const elevation = {
	results: [
		{ location: { lon: 13.3777, lat: 52.5163 }, elevation: 38, units: 'm' },
		{ location: { lon: 86.925, lat: 27.9881 }, elevation: 8731, units: 'm' },
		{ location: { lon: 0, lat: 0 }, elevation: null, units: 'm' },
	],
};
