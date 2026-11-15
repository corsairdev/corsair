// Response bodies copied from the examples in
// https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
// and its official Scala SDK fixtures, with the event, venue and attraction IDs
// kept as Ticketmaster sends them. They were not captured from the live API.

export const event = {
	name: 'WGC Cadillac Championship - Sunday Ticket',
	type: 'event',
	id: 'vvG1VZKS5pr1qy',
	test: false,
	url: 'https://www.ticketmaster.com/event/0E0050681F51BA4C',
	locale: 'en-us',
	images: [
		{
			ratio: '16_9',
			url: 'https://s1.ticketm.net/dam/a/196/6095e742-64d1-4b15-aeac-c9733c52d196_66341_RETINA_LANDSCAPE_16_9.jpg',
			width: 1136,
			height: 639,
			fallback: false,
		},
	],
	sales: {
		public: {
			startDateTime: '2015-10-02T11:00:00Z',
			startTBD: false,
			endDateTime: '2016-03-06T23:00:00Z',
		},
		presales: [
			{
				name: 'American Express Presale',
				startDateTime: '2015-09-20T14:00:00Z',
				endDateTime: '2015-10-02T10:00:00Z',
			},
		],
	},
	dates: {
		start: {
			localDate: '2016-03-06',
			dateTBD: false,
			dateTBA: false,
			timeTBA: true,
			noSpecificTime: false,
		},
		timezone: 'America/New_York',
		status: { code: 'offsale' },
	},
	classifications: [
		{
			primary: true,
			segment: { id: 'KZFzniwnSyZfZ7v7nE', name: 'Sports' },
			genre: { id: 'KnvZfZ7vAdt', name: 'Golf' },
			subGenre: { id: 'KZazBEonSMnZfZ7vFI7', name: 'PGA Tour' },
		},
	],
	promoter: { id: '682' },
	_links: {
		self: { href: '/discovery/v2/events/vvG1VZKS5pr1qy?locale=en-us' },
		attractions: [
			{ href: '/discovery/v2/attractions/K8vZ917uc57?locale=en-us' },
		],
		venues: [{ href: '/discovery/v2/venues/KovZpZAaEldA?locale=en-us' }],
	},
	_embedded: {
		venues: [
			{
				name: 'Trump National Doral',
				type: 'venue',
				id: 'KovZpZAaEldA',
				test: false,
				locale: 'en-us',
				postalCode: '33178',
				timezone: 'America/New_York',
				city: { name: 'Miami' },
				state: { name: 'Florida', stateCode: 'FL' },
				country: { name: 'United States Of America', countryCode: 'US' },
				address: { line1: '4400 NW 87th Avenue' },
				location: { longitude: '-80.33854298', latitude: '25.81260379' },
				markets: [{ id: '15' }],
				_links: {
					self: { href: '/discovery/v2/venues/KovZpZAaEldA?locale=en-us' },
				},
			},
		],
		attractions: [
			{
				name: 'Cadillac Championship',
				type: 'attraction',
				id: 'K8vZ917uc57',
				test: false,
				locale: 'en-us',
				classifications: [
					{
						primary: true,
						segment: { id: 'KZFzniwnSyZfZ7v7nE', name: 'Sports' },
						genre: { id: 'KnvZfZ7vAdt', name: 'Golf' },
						subGenre: { id: 'KZazBEonSMnZfZ7vFI7', name: 'PGA Tour' },
					},
				],
				_links: {
					self: { href: '/discovery/v2/attractions/K8vZ917uc57?locale=en-us' },
				},
			},
		],
	},
};

/** The event-search envelope: `_embedded.events` plus the `page` block. */
export const eventsSearchResponse = {
	_links: {
		self: {
			href: '/discovery/v2/events.json?size=1{&page,sort}',
			templated: true,
		},
		next: {
			href: '/discovery/v2/events.json?page=1&size=1{&sort}',
			templated: true,
		},
	},
	_embedded: { events: [event] },
	page: { size: 1, totalElements: 87958, totalPages: 87958, number: 0 },
};

/** A second event, so a two-item page cannot be confused with a one-item one. */
export const secondEvent = {
	...event,
	id: 'Z698xZC2Z17kP',
	name: 'New York Knicks vs. Boston Celtics',
};

export const eventDetail = {
	...event,
	info: 'Gates open one hour before tip-off.',
	pleaseNote: 'No re-entry.',
	priceRanges: [{ type: 'standard', currency: 'USD', min: 45, max: 320 }],
	seatmap: {
		staticUrl: 'https://maps.ticketmaster.com/maps/geometry/3/event/1.jpg',
	},
	_embedded: {
		venues: event._embedded.venues,
		attractions: event._embedded.attractions,
	},
};

export const eventImagesResponse = {
	type: 'event',
	id: 'k7vGFKzleBdwS',
	images: [
		{
			ratio: '16_9',
			url: 'https://s1.ticketm.net/dam/a/c4c/e751ab33-b9cd-4d24-ad4a-5ef79faa7c4c_72681_EVENT_DETAIL_PAGE_16_9.jpg',
			width: 205,
			height: 115,
			fallback: false,
		},
		{
			ratio: '3_2',
			url: 'https://s1.ticketm.net/dam/a/c4c/e751ab33-b9cd-4d24-ad4a-5ef79faa7c4c_72681_TABLET_LANDSCAPE_3_2.jpg',
			width: 1024,
			height: 683,
			fallback: false,
		},
	],
};

export const attraction = {
	name: 'Coachella Valley Music and Arts Festival',
	type: 'attraction',
	id: 'K8vZ9171q60',
	test: false,
	locale: 'en-us',
	images: [
		{
			ratio: '16_9',
			url: 'https://s1.ticketm.net/dbimages/73990a.jpg',
			width: 205,
			height: 115,
			fallback: false,
		},
	],
	classifications: [
		{
			primary: true,
			segment: { id: 'KZFzniwnSyZfZ7v7nJ', name: 'Music' },
			genre: { id: 'KnvZfZ7vAeA', name: 'Rock' },
			subGenre: { id: 'KZazBEonSMnZfZ7v6dt', name: 'Alternative Rock' },
		},
	],
	upcomingEvents: { ticketmaster: 4, _total: 4 },
	_links: {
		self: { href: '/discovery/v2/attractions/K8vZ9171q60?locale=en-us' },
	},
};

export const attractionsSearchResponse = {
	_links: {
		self: {
			href: '/discovery/v2/attractions.json{?page,size,sort}',
			templated: true,
		},
	},
	_embedded: { attractions: [attraction] },
	page: { size: 20, totalElements: 1, totalPages: 1, number: 0 },
};

export const venue = {
	name: 'Madison Square Garden',
	type: 'venue',
	id: 'KovZpZA7AAEA',
	test: false,
	url: 'https://www.ticketmaster.com/venue/483329',
	locale: 'en-us',
	postalCode: '10001',
	timezone: 'America/New_York',
	currency: 'USD',
	city: { name: 'New York' },
	state: { name: 'New York', stateCode: 'NY' },
	country: { name: 'United States Of America', countryCode: 'US' },
	address: { line1: '7th Ave & 32nd Street' },
	location: { longitude: '-73.99160060', latitude: '40.74970620' },
	markets: [{ id: '35' }, { id: '51' }],
	dmas: [{ id: 200 }],
	upcomingEvents: { ticketmaster: 63, _total: 63 },
	_links: {
		self: { href: '/discovery/v2/venues/KovZpZA7AAEA?locale=en-us' },
	},
};

export const venuesSearchResponse = {
	_links: {
		self: {
			href: '/discovery/v2/venues.json{?page,size,sort}',
			templated: true,
		},
	},
	_embedded: { venues: [venue] },
	page: { size: 20, totalElements: 1, totalPages: 1, number: 0 },
};

/** A page of classifications, which nest one level below each segment. */
export const classificationsSearchResponse = {
	_links: {
		self: {
			href: '/discovery/v2/classifications.json?view=null&size=2{&page,sort}',
			templated: true,
		},
		next: {
			href: '/discovery/v2/classifications.json?view=null&page=1&size=2{&sort}',
			templated: true,
		},
	},
	_embedded: {
		classifications: [
			{
				_links: {
					self: {
						href: '/discovery/v2/classifications/KZFzniwnSyZfZ7v7na?locale=en-us',
					},
				},
				segment: {
					id: 'KZFzniwnSyZfZ7v7na',
					name: 'Arts & Theatre',
					_links: {
						self: {
							href: '/discovery/v2/classifications/segments/KZFzniwnSyZfZ7v7na?locale=en-us',
						},
					},
					_embedded: {
						genres: [
							{
								id: 'KnvZfZ7v7lv',
								name: 'Magic & Illusion',
								_links: {
									self: {
										href: '/discovery/v2/classifications/genres/KnvZfZ7v7lv?locale=en-us',
									},
								},
								_embedded: {
									subgenres: [
										{
											id: 'KZazBEonSMnZfZ7v7l7',
											name: 'Magic',
											_links: {
												self: {
													href: '/discovery/v2/classifications/subgenres/KZazBEonSMnZfZ7v7l7?locale=en-us',
												},
											},
										},
									],
								},
							},
						],
					},
				},
			},
		],
	},
	page: { size: 2, totalElements: 6, totalPages: 3, number: 0 },
};

export const classification = {
	segment: { id: 'KZFzniwnSyZfZ7v7nE', name: 'Sports' },
	primary: true,
	_links: {
		self: {
			href: '/discovery/v2/classifications/KZFzniwnSyZfZ7v7nE?locale=en-us',
		},
	},
};

/**
 * Suggest has an `_embedded` envelope like the searches, which the docs do not
 * show: they describe the response only as "schema (string)". The live API
 * answers `{ _links, _embedded: { venues, attractions, events, products } }`,
 * so a capture from that response is the fixture.
 */
export const suggestResponse = {
	_links: {
		self: { href: '/discovery/v2/suggest.json?size=3&keyword=coachella' },
	},
	_embedded: {
		venues: [venue],
		attractions: [attraction],
		events: [event],
		products: [{ id: 'p1', name: 'Parking', type: 'product' }],
	},
};

/**
 * A 404 from a search that matched nothing. Ticketmaster sends the documented
 * `errors` array with `DIS1004` and the criteria that were tried, rather than a
 * 200 with an empty `_embedded`.
 */
export const searchNotFound = {
	errors: [
		{
			code: 'DIS1004',
			detail:
				'Resource not found with provided criteria (keyword=zzzznotarealevent)',
			status: '404',
			_links: { about: { href: '/discovery/v2/errors.html#DIS1004' } },
		},
	],
};

/** The 404 for a real ID that does not exist. */
export const idNotFound = {
	errors: [
		{
			code: 'DIS1004',
			detail:
				'Resource not found with provided criteria (locale=en-us, id=abcde)',
			status: '404',
			_links: { about: { href: '/discovery/v2/errors.html#DIS1004' } },
		},
	],
};

/** The gateway `fault` shape, which is what a bad key gets. */
export const invalidApiKey = {
	fault: {
		faultstring: 'Invalid ApiKey',
		detail: { errorcode: 'oauth.v2.InvalidApiKey' },
	},
};

/** ...and the one it sends when the query parameter is missing entirely. */
export const missingApiKey = {
	fault: {
		faultstring: 'Failed to resolve API Key variable request.queryparam.apikey',
		detail: { errorcode: 'steps.oauth.v2.FailedToResolveAPIKey' },
	},
};

export const quotaExceeded = {
	fault: {
		faultstring:
			'Rate limit quota violation. Quota limit exceeded. Identifier : 00000000000000000000000000000000',
		detail: { errorcode: 'policies.ratelimit.QuotaViolation' },
	},
};

/** The 400 Ticketmaster sends for a parameter it rejects. */
export const invalidParameter = {
	errors: [
		{
			code: 'DIS1001',
			detail: 'Invalid value for parameter [size]=500',
			status: '400',
			_links: { about: { href: '/discovery/v2/errors.html#DIS1001' } },
		},
	],
};
