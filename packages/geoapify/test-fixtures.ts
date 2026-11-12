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
			bbox: [13.228, 52.437, 13.548, 52.597],
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
export const route = {
	results: [
		{
			mode: 'drive',
			waypoints: [
				{ location: [13.4, 52.5], original_index: 0 },
				{ location: [13.5, 52.6], original_index: 1 },
			],
			units: 'metric',
			distance: 1420.5,
			distance_units: 'm',
			time: 312,
			traffic: 'free_flow',
			toll: false,
			ferry: false,
			legs: [
				{
					distance: 1420.5,
					time: 312,
					steps: [
						{
							distance: 120,
							time: 30,
							instruction: 'Head north',
							name: 'Unter den Linden',
							type: 'turn',
						},
					],
				},
			],
		},
	],
	properties: { mode: 'drive', units: 'metric', waypoints: [] },
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

/** A matrix where one pair has no route, which is a normal answer. */
export const matrix = {
	mode: 'drive',
	units: 'metric',
	distance_units: 'm',
	sources: [{ location: [13.4, 52.5] }],
	targets: [{ location: [13.5, 52.6] }, { location: [-71.18, 44.46] }],
	sources_to_targets: [[{ distance: 1420.5, time: 312 }, { error: 'NoRoute' }]],
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

export const timezone = {
	at: '2026-11-12T09:16:00Z',
	lat: 52.5,
	lon: 13.4,
	tzdb_version: '2026a',
	timezones: [
		{
			name: 'Europe/Berlin',
			offset_STD_seconds: 3600,
			abbreviation_STD: 'CET',
			offset_DST_seconds: 7200,
			abbreviation_DST: 'CEST',
			offset_at_request_seconds: 3600,
			abbreviation_at_request: 'CET',
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

export const elevation = {
	results: [
		{
			location: { lon: 13.4, lat: 52.5 },
			elevation: 34,
			units: 'm',
		},
		{
			location: { lon: 13.5, lat: 52.6 },
			elevation: 61,
			units: 'm',
			distance: 1420.5,
		},
	],
};
