// Shapes taken from Geokeo's documentation (https://geokeo.com/documentation.php)
// and live probes. Every answer is HTTP 200; a bad key answers
// `{"status":"ACCESS_DENIED"}` and no key at all answers
// `{"status":"INVALID_REQUEST"}`.

/** A forward result, exactly as the docs show it, coordinates as strings. */
export const empireState = {
	results: [
		{
			class: 'tourism',
			type: 'attraction',
			address_components: {
				name: 'Empire State Building',
				island: 'Manhattan Island',
				neighbourhood: 'Midtown South',
				street: '5th Avenue',
				subdistrict: 'Manhattan',
				district: 'New York County',
				city: 'New York City',
				state: 'New York',
				postcode: '10018',
				country: 'United States Of America',
			},
			formatted_address:
				'Empire State Building,Manhattan Island,Midtown South,5th Avenue,New York County,New York City,10018,United States Of America',
			geometry: {
				location: {
					lat: '40.74843124430164',
					lng: '-73.9856567114413',
				},
				viewport: {
					northeast: { lat: '40.747922600363026', lng: '-73.9864855' },
					southwest: { lat: '40.74894220036315', lng: '-73.98482589999999' },
				},
			},
			osmurl:
				'https://www.openstreetmap.org/search?query=40.74843124430164%2C-73.9856567114413#map=17/40.74843124430164/-73.9856567114413',
		},
	],
	credits: 'https://geokeo.com/credits.php',
	status: 'ok',
};

/** A reverse result, which adds the distance as one string with its unit. */
export const reverseResult = {
	results: [
		{
			class: 'office',
			type: 'yes',
			address_components: {
				name: 'Empire State Building',
				island: 'Manhattan Island',
				street: '5th Avenue',
				neighbourhood: 'Midtown South',
				subdistrict: 'Manhattan',
				district: 'New York County',
				city: 'New York City',
				state: 'New York',
				postcode: '10018',
				country: 'United States Of America',
			},
			formatted_address:
				'Empire State Building,Manhattan Island,5th Avenue,Midtown South,New York County,New York City,10018,United States Of America',
			geometry: {
				location: {
					lat: '40.74843124430164',
					lng: '-73.9856567114413',
				},
			},
			osmurl:
				'https://www.openstreetmap.org/search?query=40.74843124430164%2C-73.9856567114413#map=17/40.74843124430164/-73.9856567114413',
			distance: '0.0010302984507433km',
		},
	],
	credits: 'https://geokeo.com/credits.php',
	status: 'ok',
};

/** A valid query that matched nothing. Not charged, and not an error. */
export const zeroResults = {
	results: [],
	credits: 'https://geokeo.com/credits.php',
	status: 'ZERO_RESULTS',
};

/** What a bad key answered, with HTTP 200. */
export const accessDenied = {
	status: 'ACCESS_DENIED',
};

/** What a missing key or parameter answered, also with HTTP 200. */
export const invalidRequest = {
	status: 'INVALID_REQUEST',
};

/** The daily allowance is used up. */
export const overQueryLimit = {
	status: 'OVER_QUERY_LIMIT',
};

/** A result whose coordinate cannot be read as a number. */
export const brokenCoordinate = {
	results: [
		{
			address_components: { city: 'Nowhere' },
			formatted_address: 'Nowhere',
			geometry: { location: { lat: 'not-a-number', lng: '-73.9' } },
		},
	],
	status: 'ok',
};

/** A reverse result whose distance has no unit suffix. */
export const distanceWithoutUnit = {
	results: [
		{
			address_components: { city: 'Berlin' },
			formatted_address: 'Berlin',
			geometry: { location: { lat: '52.5', lng: '13.4' } },
			distance: '1.5',
		},
	],
	status: 'ok',
};
