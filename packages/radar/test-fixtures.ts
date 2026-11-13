// Fixtures are built from Radar's API reference
// (https://docs.radar.com/api.md) and from the live envelope a keyless call
// returns.

export const USER_RADAR_ID = '56db1f4613012711002229f4';
export const GEOFENCE_ID = '5e4a1b2c3d4e5f6a7b8c9d0e';
export const TRIP_ID = '6f5b2c3d4e5f6a7b8c9d0e1f';
export const EVENT_ID = '7a6c3d4e5f6a7b8c9d0e1f2a';

/** The live 401 body, verbatim from a keyless call. */
export const UNAUTHORIZED = {
	meta: {
		code: 401,
		message: 'Unauthorized. Publishable API key required.',
	},
};

/** A 400 that names the offending parameter. */
export const VALIDATION_ERROR = {
	meta: {
		code: 400,
		param: 'latitude',
		message: 'latitude: Invalid latitude. Valid range: [-90, 90].',
	},
};

/** A spent usage quota, which no retry can fix. */
export const QUOTA_EXCEEDED = {
	meta: {
		code: 402,
		message: 'Payment required. Usage exceeded.',
	},
};

/** A country blocklist refusal. */
export const LEGAL_ERROR = {
	meta: {
		code: 451,
		message: 'Unavailable for legal reasons.',
	},
};

export const NOT_FOUND = {
	meta: {
		code: 404,
		message: 'Not found.',
	},
};

export const ADDRESS = {
	latitude: 40.7039,
	longitude: -73.9867,
	geometry: { type: 'Point', coordinates: [-73.9867, 40.7039] },
	addressLabel: '20 Jay Street',
	formattedAddress: '20 Jay Street, Brooklyn, New York, NY 11201 USA',
	country: 'United States',
	countryCode: 'US',
	countryFlag: '🇺🇸',
	state: 'New York',
	stateCode: 'NY',
	postalCode: '11201',
	city: 'Brooklyn',
	county: 'Kings County',
	number: '20',
	street: 'Jay Street',
	layer: 'address',
	distance: 0,
	confidence: 'exact',
};

export const GEOCODE_PAGE = { meta: { code: 200 }, addresses: [ADDRESS] };

export const PLACE = {
	_id: 'place-1',
	name: 'Blue Bottle Coffee',
	location: { type: 'Point', coordinates: [-73.9867, 40.7039] },
	categories: ['coffee-shop', 'food'],
	chain: { name: 'Blue Bottle', slug: 'blue-bottle' },
	address: ADDRESS,
};

export const PLACE_PAGE = { meta: { code: 200 }, places: [PLACE] };

export const GEOFENCE = {
	_id: GEOFENCE_ID,
	live: true,
	tag: 'store',
	externalId: 'store-42',
	description: 'Brooklyn store',
	type: 'circle',
	geometryType: 'circle',
	geometryRadius: 100,
	geometryCenter: { type: 'Point', coordinates: [-73.9867, 40.7039] },
	geometryCoordinates: [],
	metadata: { offers: true },
	createdAt: '2026-01-10T10:00:00.000Z',
	updatedAt: '2026-11-01T09:00:00.000Z',
};

export const GEOFENCE_PAGE = { meta: { code: 200 }, geofences: [GEOFENCE] };
export const GEOFENCE_PAGE_MORE = {
	meta: { code: 200, hasMore: true },
	geofences: [GEOFENCE],
};

export const USER = {
	_id: USER_RADAR_ID,
	live: true,
	userId: 'user-1',
	deviceId: 'C305F2DB-56DC-404F-B6C1-BC52F0B680D8',
	description: 'Test user',
	deviceType: 'iOS',
	platform: 'ios',
	foreground: true,
	stopped: false,
	location: {
		latitude: 40.7039,
		longitude: -73.9867,
		accuracy: 10,
		speed: 0,
		altitude: 12,
		updatedAt: '2026-11-10T21:00:00.000Z',
	},
	geofences: [],
	metadata: { plan: 'gold' },
	createdAt: '2026-01-10T10:00:00.000Z',
	updatedAt: '2026-11-10T21:00:00.000Z',
};

export const USER_PAGE = { meta: { code: 200, hasMore: true }, users: [USER] };

export const TRIP = {
	_id: TRIP_ID,
	live: true,
	externalId: 'order-42',
	status: 'started',
	mode: 'car',
	userId: 'user-1',
	deviceId: 'C305F2DB-56DC-404F-B6C1-BC52F0B680D8',
	destinationGeofenceTag: 'store',
	destinationGeofenceExternalId: 'store-42',
	destinationLocation: { type: 'Point', coordinates: [-73.9867, 40.7039] },
	eta: { duration: 600, distance: 4200 },
	createdAt: '2026-11-10T20:00:00.000Z',
	updatedAt: '2026-11-10T21:00:00.000Z',
	locations: [],
};

export const TRIP_PAGE = { meta: { code: 200 }, trips: [TRIP] };

export const CONVERSION = {
	_id: EVENT_ID,
	name: 'in_app_purchase',
	userId: 'user-1',
	createdAt: '2026-11-10T21:00:00.000Z',
};
