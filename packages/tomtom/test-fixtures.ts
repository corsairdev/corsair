/**
 * Shapes from the live API and the reference examples. The error envelope is
 * the one an unauthenticated probe returned.
 */

export const searchResult = {
	type: 'POI',
	id: 'NL:POI:1234',
	score: 3.5,
	dist: 120.4,
	name: 'Pizza Napoli',
	address: {
		streetName: 'Damrak',
		municipality: 'Amsterdam',
		countrySubdivision: 'Noord-Holland',
		postalCode: '1012',
		countryCode: 'NL',
		country: 'Netherlands',
		freeformAddress: 'Damrak 1, 1012 Amsterdam, Netherlands',
	},
	position: { lat: 52.378, lon: 4.9 },
	viewport: {
		topLeftPoint: { lat: 52.379, lon: 4.899 },
		btmRightPoint: { lat: 52.377, lon: 4.901 },
	},
	poi: {
		name: 'Pizza Napoli',
		categories: ['restaurant'],
		classifications: [],
		phone: '+31201234567',
		url: 'https://example.com',
	},
	entryPoints: [],
};

export const searchEnvelope = {
	summary: {
		query: 'pizza',
		queryType: 'NON_NEAR',
		queryTime: 42,
		numResults: 1,
		offset: 0,
		totalResults: 1,
		fuzzyLevel: 2,
	},
	results: [searchResult],
};

/** A search that matched nothing: an empty array, not an error. */
export const emptySearch = {
	summary: { query: 'zzzzzz', numResults: 0, totalResults: 0 },
	results: [],
};

export const geocodeEnvelope = {
	summary: { query: 'Amsterdam', queryType: 'NON_NEAR', numResults: 1 },
	results: [
		{
			type: 'Geography',
			id: 'NL/GEO/1',
			address: { freeformAddress: 'Amsterdam, Netherlands' },
			position: { lat: 52.37, lon: 4.89 },
		},
	],
};

export const reverseGeocodeEnvelope = {
	summary: { numResults: 1 },
	addresses: [
		{
			address: {
				streetName: 'Damrak',
				municipality: 'Amsterdam',
				countryCode: 'NL',
				freeformAddress: 'Damrak 1, 1012 Amsterdam, Netherlands',
			},
			position: '52.378,4.9',
		},
	],
};

export const routeEnvelope = {
	formatVersion: '0.0.12',
	routes: [
		{
			summary: {
				lengthInMeters: 1200,
				travelTimeInSeconds: 420,
				trafficDelayInSeconds: 60,
				departureTime: '2026-05-02T10:00:00Z',
				arrivalTime: '2026-05-02T10:07:00Z',
				hasTollRoad: false,
				hasHighway: true,
				hasFerry: false,
			},
			legs: [{ summary: {} }],
			guidance: { instructions: [] },
		},
	],
};

export const incidentDetails = {
	incidents: [
		{
			type: 'Feature',
			id: 'incident-1',
			geometry: { type: 'Point', coordinates: [4.9, 52.37] },
			properties: {
				id: 'incident-1',
				iconCategory: 1,
				magnitudeOfDelay: 2,
				events: [{ description: 'Accident', code: 1 }],
				startTime: '2026-05-02T09:00:00Z',
				endTime: null,
				from: 'Damrak',
				to: 'Rokin',
				length: 400,
				delay: 120,
				roadNumbers: ['A10'],
				aci: { probabilityOfOccurrence: 'certain' },
			},
		},
	],
};

export const trafficFlow = {
	flowSegmentData: {
		frc: 'FRC0',
		currentSpeed: 45,
		freeFlowSpeed: 80,
		currentTravelTime: 90,
		freeFlowTravelTime: 60,
		confidence: 0.9,
		roadClosure: false,
		coordinates: { coordinate: [] },
	},
};

/** The one error envelope every TomTom route uses. */
export const unauthorized = {
	detailedError: {
		code: 'Unauthorized',
		message: 'You are missing valid authentication credentials',
	},
};

export const badRequest = {
	detailedError: {
		code: 'BadRequest',
		message: 'The provided coordinates are invalid',
	},
};

/** A few routes answer `{ error: { description } }` instead. */
export const legacyError = {
	error: {
		code: 'Forbidden',
		description: 'The API key is not authorized for this service',
	},
};
