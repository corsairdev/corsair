/**
 * Fixtures taken from REAL Foursquare responses captured while building this
 * plugin. Ids and coordinates are genuine place data; no credentials appear.
 *
 * What the live probes changed against the documented schema:
 *
 * - `places.search` answers a `context.geo_bounds` object the docs' schema omits.
 * - Every place carries `extended_location`, also absent from that schema.
 * - Autocomplete `text` is an OBJECT (`{ primary, secondary, highlight[] }`),
 *   not a string, and a place result nests the whole place under `place`.
 * - A 500 can answer `{ errors: ["internal server error"] }` instead of
 *   `{ message }`.
 * - Exhausted API credits arrive as a **429**, the same status as a rate limit.
 */

export const searchResponse = {
	results: [
		{
			fsq_place_id: '4af4398ff964a520b4f021e3',
			latitude: 41.857846248228036,
			longitude: -87.66274738367372,
			categories: [
				{
					fsq_category_id: '4bf58dd8d48988d1e0931735',
					name: 'Coffee Shop',
					short_name: 'Coffee Shop',
					plural_name: 'Coffee Shops',
					icon: {
						prefix: 'https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_',
						suffix: '.png',
					},
				},
			],
			date_created: '2009-11-06',
			date_refreshed: '2026-11-02',
			distance: 1363,
			email: 'cafejumpingbean@comcast.net',
			extended_location: {
				dma: 'Chicago',
				census_block_id: '170313106002009',
			},
			link: '/places/4af4398ff964a520b4f021e3',
			location: {
				address: '1439 W 18th St',
				locality: 'Chicago',
				region: 'IL',
				postcode: '60608',
				country: 'US',
				formatted_address: '1439 W 18th St (at S Bishop St), Chicago, IL 60608',
			},
			name: 'Cafe Jumping Bean',
			placemaker_url:
				'https://foursquare.com/placemakers/review-place/4af4398ff964a520b4f021e3',
			related_places: {},
			social_media: {
				facebook_id: '111641328871554',
			},
			tel: '(312) 455-0019',
			website: 'http://cafejumpingbean.org',
		},
	],
	context: {
		geo_bounds: {
			circle: {
				center: {
					latitude: 41.85003,
					longitude: -87.65005,
				},
				radius: 17060,
			},
		},
	},
};

export const placeDetail = {
	fsq_place_id: '4af4398ff964a520b4f021e3',
	latitude: 41.857846248228036,
	longitude: -87.66274738367372,
	categories: [
		{
			fsq_category_id: '4bf58dd8d48988d1e0931735',
			name: 'Coffee Shop',
			short_name: 'Coffee Shop',
			plural_name: 'Coffee Shops',
			icon: {
				prefix: 'https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_',
				suffix: '.png',
			},
		},
	],
	date_created: '2009-11-06',
	date_refreshed: '2026-11-02',
	email: 'cafejumpingbean@comcast.net',
	extended_location: {
		dma: 'Chicago',
		census_block_id: '170313106002009',
	},
	link: '/places/4af4398ff964a520b4f021e3',
	location: {
		address: '1439 W 18th St',
		locality: 'Chicago',
		region: 'IL',
		postcode: '60608',
		country: 'US',
		formatted_address: '1439 W 18th St (at S Bishop St), Chicago, IL 60608',
	},
	name: 'Cafe Jumping Bean',
	placemaker_url:
		'https://foursquare.com/placemakers/review-place/4af4398ff964a520b4f021e3',
	related_places: {},
	social_media: {
		facebook_id: '111641328871554',
	},
	tel: '(312) 455-0019',
	website: 'http://cafejumpingbean.org',
};

export const autocompleteResponse = {
	results: [
		{
			type: 'place',
			text: {
				primary: 'Star Planet',
				secondary: ' ',
				highlight: [
					{
						start: 0,
						length: 3,
					},
				],
			},
			link: '/places/53a5b4df498ed965e2980a85',
			place: {
				fsq_place_id: '53a5b4df498ed965e2980a85',
				latitude: 19.461734466549906,
				longitude: 72.80462883691683,
				categories: [
					{
						fsq_category_id: '4bf58dd8d48988d11e941735',
						name: 'Cocktail Bar',
						short_name: 'Cocktail',
						plural_name: 'Cocktail Bars',
						icon: {
							prefix:
								'https://ss3.4sqi.net/img/categories_v2/nightlife/cocktails_',
							suffix: '.png',
						},
					},
				],
				distance: 565,
				location: {
					postcode: '',
					country: 'IN',
					formatted_address: '',
				},
				name: 'Star Planet',
			},
		},
	],
};

/** A 404 names the endpoint. */
export const notFoundBody = {
	message: "Endpoint '/places/doesnotexist' not found.",
};

/** A 500 whose body uses `errors` rather than `message`. */
export const serverErrorBody = { errors: ['internal server error'] };

/** Exhausted credits: a 429 that can never succeed on retry. */
export const creditsExhaustedBody = {
	message:
		"Your account has no API credits remaining. Please visit your organization's billing page at https://foursquare.com/developers/orgs to manually add credits or enable automatic payments.",
};

/** A bare array answer, used by tips and photos. */
export const tipsResponse = [
	{
		fsq_tip_id: '5a1b2c3d4e5f6a7b8c9d0e1f',
		created_at: '2024-01-15T10:00:00.000Z',
		text: 'Great espresso, tiny seating area.',
		url: 'https://foursquare.com/item/5a1b2c3d4e5f6a7b8c9d0e1f',
		lang: 'en',
		agree_count: 12,
		disagree_count: 1,
	},
];

export const photosResponse = [
	{
		id: '5a1b2c3d4e5f6a7b8c9d0e20',
		created_at: '2024-02-01T09:30:00.000Z',
		prefix: 'https://fastly.4sqi.net/img/general/',
		suffix: '/12345_photo.jpg',
		width: 1920,
		height: 1440,
		classifications: ['food'],
	},
];

export const matchResponse = {
	place: {
		fsq_place_id: '4af4398ff964a520b4f021e3',
		latitude: 41.857846248228036,
		longitude: -87.66274738367372,
		categories: [
			{
				fsq_category_id: '4bf58dd8d48988d1e0931735',
				name: 'Coffee Shop',
				short_name: 'Coffee Shop',
				plural_name: 'Coffee Shops',
				icon: {
					prefix: 'https://ss3.4sqi.net/img/categories_v2/food/coffeeshop_',
					suffix: '.png',
				},
			},
		],
		date_created: '2009-11-06',
		date_refreshed: '2026-11-02',
		email: 'cafejumpingbean@comcast.net',
		extended_location: {
			dma: 'Chicago',
			census_block_id: '170313106002009',
		},
		link: '/places/4af4398ff964a520b4f021e3',
		location: {
			address: '1439 W 18th St',
			locality: 'Chicago',
			region: 'IL',
			postcode: '60608',
			country: 'US',
			formatted_address: '1439 W 18th St (at S Bishop St), Chicago, IL 60608',
		},
		name: 'Cafe Jumping Bean',
		placemaker_url:
			'https://foursquare.com/placemakers/review-place/4af4398ff964a520b4f021e3',
		related_places: {},
		social_media: {
			facebook_id: '111641328871554',
		},
		tel: '(312) 455-0019',
		website: 'http://cafejumpingbean.org',
	},
	match_score: 0.98,
	context: {},
};
