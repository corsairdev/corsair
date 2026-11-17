/**
 * Bodies below are trimmed from real responses captured while writing this
 * package, not from the docs' examples. NASA is inconsistent about types:
 * NEO distances are decimal strings, EPIC dates are not ISO 8601, and EONET
 * labels JSON as `application/rss+xml`.
 */

/** `GET /neo/rest/v1/feed` for 2026-11-01 to 2026-11-02, trimmed to one object. */
export const neoFeedPage = {
	element_count: 11,
	links: {
		next: 'http://api.nasa.gov/neo/rest/v1/feed?start_date=2026-11-02&end_date=2026-11-03&detailed=false&api_key=DEMO_KEY',
		previous:
			'http://api.nasa.gov/neo/rest/v1/feed?start_date=2026-10-31&end_date=2026-11-01&detailed=false&api_key=DEMO_KEY',
		self: 'http://api.nasa.gov/neo/rest/v1/feed?start_date=2026-11-01&end_date=2026-11-02&detailed=false&api_key=DEMO_KEY',
	},
	near_earth_objects: {
		'2026-11-01': [
			{
				absolute_magnitude_h: 18.57,
				close_approach_data: [
					{
						close_approach_date: '2026-11-01',
						close_approach_date_full: '2026-Nov-01 00:20',
						epoch_date_close_approach: 1793492400000,
						miss_distance: {
							astronomical: '0.3065928938',
							kilometers: '45865643.869616206',
							lunar: '119.2646356882',
							miles: '28499589.5570514028',
						},
						orbiting_body: 'Earth',
						relative_velocity: {
							kilometers_per_hour: '57938.9128152772',
							kilometers_per_second: '16.0941424487',
							miles_per_hour: '36000.9872434704',
						},
					},
				],
				estimated_diameter: {
					meters: {
						estimated_diameter_max: 1148.2593191046,
						estimated_diameter_min: 513.5171786631,
					},
				},
				id: '2307493',
				is_potentially_hazardous_asteroid: false,
				is_sentry_object: false,
				links: {
					self: 'http://api.nasa.gov/neo/rest/v1/neo/2307493?api_key=DEMO_KEY',
				},
				name: '307493 (2002 XP90)',
				nasa_jpl_url:
					'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2307493',
				neo_reference_id: '2307493',
			},
		],
	},
};

/** `GET /neo/rest/v1/neo/browse`, with the page block the endpoint needs. */
export const neoBrowsePage = {
	links: {
		next: 'http://api.nasa.gov/neo/rest/v1/neo/browse?page=1&size=1&api_key=DEMO_KEY',
		self: 'http://api.nasa.gov/neo/rest/v1/neo/browse?page=0&size=1&api_key=DEMO_KEY',
	},
	near_earth_objects: [
		{
			absolute_magnitude_h: 10.4,
			close_approach_data: [],
			estimated_diameter: {
				meters: {
					estimated_diameter_max: 49435.619261962,
					estimated_diameter_min: 22108.281035909,
				},
			},
			id: '2000433',
			is_potentially_hazardous_asteroid: false,
			is_sentry_object: false,
			links: {
				self: 'http://api.nasa.gov/neo/rest/v1/neo/2000433?api_key=DEMO_KEY',
			},
			name: '433 Eros (A898 PA)',
			name_limited: 'Eros',
			nasa_jpl_url:
				'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2000433',
			neo_reference_id: '2000433',
			orbital_data: {
				aphelion_distance: '1.783254105573937',
				eccentricity: '.2228779627700761',
				orbit_class: {
					orbit_class_type: 'AMO',
					orbit_class_description:
						'Near-Earth asteroid orbits similar to that of 1221 Amor',
					orbit_class_range: '1.017 AU < q (perihelion) < 1.3 AU',
				},
			},
		},
	],
	page: { size: 1, number: 0, total_elements: 63077, total_pages: 63077 },
};

/** `GET /DONKI/CME` for 2026-11-01 to 2026-11-05, trimmed to one event. */
export const donkiCme = [
	{
		activityID: '2026-11-01T00:00:00-CME-001',
		catalog: 'M2M_CATALOG',
		startTime: '2026-11-01T00:00Z',
		instruments: [
			{ displayName: 'SOHO: LASCO/C2' },
			{ displayName: 'GOES: CCOR-1' },
		],
		sourceLocation: 'S15E65',
		activeRegionNum: null,
		note: 'Diffuse CME first seen to the SE by SOHO LASCO C2.',
		cmeAnalyses: [
			{
				isMostAccurate: true,
				levelOfData: 0,
				time21_5: '2026-11-01T03:40Z',
				latitude: -11,
				longitude: -42,
				halfAngle: 14,
				speed: 894,
				type: 'C',
				featureCode: 'LE',
				imageType: 'running difference',
				measurementTechnique: 'SWPC_CAT',
				note: 'Measurement based on approximate source location.',
				minorHalfWidth: null,
				speedMeasuredAtHeight: 10.4,
				tilt: null,
				submissionTime: '2026-11-01T15:37Z',
				link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CMEAnalysis/49354/-1',
				enlilList: [],
			},
		],
		linkedEvents: null,
		sentNotifications: [
			{
				messageID: '20261101-AL-002',
				messageIssueTime: '2026-11-01T16:06Z',
				messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/49356/1',
			},
		],
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/49353/-1',
		submissionTime: '2026-11-02T20:48Z',
		versionId: 2,
	},
];

/** `GET /DONKI/GST`, whose Kp readings live under `allKpIndex`. */
export const donkiStorm = [
	{
		gstID: '2026-10-31T18:00:00-GST-001',
		startTime: '2026-10-31T18:00Z',
		allKpIndex: [
			{ kpIndex: 6, observedTime: '2026-10-31T21:00Z', source: 'NOAA' },
		],
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/GST/49348/-1',
		linkedEvents: [{ activityID: '2026-10-31T03:13:00-HSS-001' }],
		sentNotifications: [
			{
				messageID: '20261031-AL-001',
				messageIssueTime: '2026-10-31T21:04Z',
				messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/49349/1',
			},
		],
		submissionTime: '2026-10-31T21:04Z',
		versionId: 1,
	},
];

/** `GET /DONKI/HSS`, whose identity field is `hssID` rather than `activityID`. */
export const donkiHighSpeedStream = [
	{
		hssID: '2026-10-03T23:40:00-HSS-001',
		eventTime: '2026-10-03T23:40Z',
		instruments: [{ displayName: 'SOLAR-1: SWiPS' }],
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/HSS/48951/-1',
		linkedEvents: [{ activityID: '2026-10-03T23:41:00-IPS-001' }],
		sentNotifications: null,
		submissionTime: '2026-10-06T19:06Z',
		versionId: 4,
	},
];

/** `GET /DONKI/IPS`, whose identity field is `activityID` and time `eventTime`. */
export const donkiShock = [
	{
		catalog: 'M2M_CATALOG',
		activityID: '2026-10-20T11:23:00-IPS-001',
		location: 'Earth',
		eventTime: '2026-10-20T11:23Z',
		instruments: [{ displayName: 'SOLAR-1: MAG' }],
		linkedEvents: [{ activityID: '2026-10-16T12:38:00-CME-001' }],
		sentNotifications: null,
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/IPS/49181/-1',
		submissionTime: '2026-10-22T18:04Z',
		versionId: 2,
	},
];

/** `GET /DONKI/notifications`, which wraps a long markdown body. */
export const donkiNotification = [
	{
		messageType: 'RBE',
		messageID: '20261101-AL-001',
		messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/49352/1',
		messageIssueTime: '2026-11-01T13:28Z',
		messageBody: '## Space Weather Notification - Radiation Belt Enhancement',
	},
];

/** `GET /EPIC/api/natural/date/2019-05-30`, trimmed to one image. */
export const epicImage = [
	{
		identifier: '20190530011359',
		caption:
			"This image was taken by NASA's EPIC camera onboard the NOAA DSCOVR spacecraft",
		image: 'epic_1b_20190530011359',
		version: '03',
		centroid_coordinates: { lat: 24.56543, lon: 170.683594 },
		dscovr_j2000_position: {
			x: 339005.145834,
			y: 1368757.776568,
			z: 645861.927788,
		},
		lunar_j2000_position: { x: 381104.35964, y: 104675.95663, z: -35701.90868 },
		sun_j2000_position: {
			x: 56531896.481815,
			y: 129098775.627199,
			z: 55963516.666649,
		},
		attitude_quaternions: {
			q0: 0.495585,
			q1: -0.356553,
			q2: -0.694341,
			q3: 0.380992,
		},
		// Not ISO 8601: a space separates the date and time.
		date: '2019-05-30 01:09:10',
	},
];

/** `GET /api/v3/events`, sent with a JSON body labelled `application/rss+xml`. */
export const eonetEvents = {
	title: 'EONET Events',
	description: 'Natural events from EONET.',
	link: 'https://eonet.gsfc.nasa.gov/api/v3/events',
	events: [
		{
			id: 'EONET_26331',
			title: 'Wildfire Red Hill, Perry, Mississippi',
			description: null,
			link: 'https://eonet.gsfc.nasa.gov/api/v3/events/EONET_26331',
			closed: null,
			categories: [{ id: 'wildfires', title: 'Wildfires' }],
			sources: [
				{
					id: 'IRWIN',
					url: 'https://irwin.doi.gov/observer/incidents/2026-MSMNF-000713',
				},
			],
			geometry: [
				{
					magnitudeValue: 519,
					magnitudeUnit: 'acres',
					date: '2026-11-12T00:22:00Z',
					type: 'Point',
					coordinates: [-89.063853, 31.130069],
				},
			],
		},
	],
};

/** `GET /api/v3/events/EONET_26331`, a single event with no envelope. */
export const eonetEvent = eonetEvents.events[0];

/** `GET /search?q=moon&page_size=2`, trimmed to one item. */
export const imageSearch = {
	collection: {
		version: '1.1',
		href: 'http://images-api.nasa.gov/search?q=moon&page_size=2',
		items: [
			{
				href: 'https://images-assets.nasa.gov/image/PIA12235/collection.json',
				data: [
					{
						center: 'JPL',
						date_created: '2009-09-24T18:00:22Z',
						description: 'Nearside of the Moon',
						keywords: ['Moon', 'Chandrayaan-1'],
						media_type: 'image',
						nasa_id: 'PIA12235',
						title: 'Nearside of the Moon',
					},
				],
				links: [
					{
						href: 'https://images-assets.nasa.gov/image/PIA12235/PIA12235~medium.jpg',
						rel: 'alternate',
						render: 'image',
						width: 1280,
						height: 896,
						size: 114000,
					},
				],
			},
		],
		metadata: { total_hits: 22691 },
		links: [
			{
				rel: 'next',
				prompt: 'Next',
				href: 'http://images-api.nasa.gov/search?q=moon&page=2&page_size=2',
			},
		],
	},
};

/** `GET /asset/as11-40-5874`, a bare list of file URLs. */
export const imageAsset = {
	collection: {
		version: '1.1',
		href: 'http://images-api.nasa.gov/asset/as11-40-5874',
		items: [
			{
				href: 'http://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~orig.jpg',
			},
			{
				href: 'http://images-assets.nasa.gov/image/as11-40-5874/as11-40-5874~large.jpg',
			},
			{
				href: 'http://images-assets.nasa.gov/image/as11-40-5874/metadata.json',
			},
		],
	},
};

/** `GET /apod-basic?per_page=2`, trimmed to one entry. */
export const apodList = [
	{
		date: '2026-11-16',
		post_id: 1511616,
		title: 'NGC 7129: Star Formation with Jets from Webb',
		permalink:
			'https://science.nasa.gov/image-article/apod-2026-november-16-ngc-7129-star-formation-with-jets-from-webb/',
		media_type: 'image',
		explanation: '<strong>Explanation:</strong> How do stars form?',
		credit: '<a href="https://www.nasa.gov/">NASA</a>',
		copyright: '<a href="https://www.nasa.gov/">NASA</a>',
		alt: 'A young star cluster filled with many stars.',
		url: 'https://science.nasa.gov/image-article/apod-2026-november-16-ngc-7129-star-formation-with-jets-from-webb/',
		hdurl:
			'https://assets.science.nasa.gov/dynamicimage/assets/science/missions/webb/science/2026/10/weic2620a.jpg',
		basic_html: '<!doctype html><html></html>',
		basic_html_url:
			'https://science.nasa.gov/wp-json/wp/v2/apod-basic/261115/html',
	},
];

/** `GET /apod-basic/261115`, the single-day route: one object, not an array. */
export const apodSingle = {
	date: '2026-11-15',
	post_id: 1511419,
	title: 'Leonid Meteors Through Orion',
	permalink:
		'https://science.nasa.gov/image-article/apod-2026-november-15-leonid-meteors-through-orion/',
	media_type: 'image',
	explanation:
		'<strong>Explanation:</strong> Where will the next meteor appear?',
	hdurl:
		'https://assets.science.nasa.gov/dynamicimage/assets/science/cds/apod/apod/2026/november/Leonids2022_Hongyang_2880.jpg',
	basic_html_url:
		'https://science.nasa.gov/wp-json/wp/v2/apod-basic/261115/html',
};

/** `{ error: { code, message } }`, api.nasa.gov's only error shape. */
export const apiKeyInvalid = {
	error: {
		code: 'API_KEY_INVALID',
		message:
			'An invalid api_key was supplied. Get one at https://api.nasa.gov:443',
	},
};

export const overRateLimit = {
	error: {
		code: 'OVER_RATE_LIMIT',
		message:
			'You have exceeded your rate limit. Try again later or contact us for assistance: https://api.nasa.gov:443',
	},
};

/** WordPress's shape, used by the APOD feed for a bad date code. */
export const wordpressInvalidParam = {
	code: 'rest_invalid_param',
	message: 'Invalid parameter(s): date',
	data: { status: 400, params: { date: 'Invalid parameter.' }, details: [] },
};

/** images-api.nasa.gov answers `{ reason }` with no code. */
export const imageNoAsset = {
	reason: 'No AssetDB records for nasaid=notarealid',
};

/** The `{ user, message }` body EONET sends with an HTML error page. */
export const eonetHtmlError = '<!DOCTYPE html><title>Server Error</title>';

/**
 * Live DONKI records captured 2026-11-17 with a free key, one per route,
 * trimmed to the first record and the first nested entry.
 */
/** `GET /DONKI/CMEAnalysis` for 2026-10-20 to 2026-10-31. */
export const donkiCmeAnalysis = [
	{
		catalog: 'M2M_CATALOG',
		isMostAccurate: true,
		time21_5: '2026-10-20T10:15Z',
		latitude: 25.0,
		longitude: 172.0,
		halfAngle: 28.0,
		speed: 368.0,
		type: 'S',
		associatedCMEID: '2026-10-20T01:26:00-CME-001',
		associatedCMEstartTime: '2026-10-20T01:26Z',
		associatedCMELink: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CME/49173/-1',
		featureCode: 'LE',
		dataLevel: '0',
		measurementTechnique: 'SWPC_CAT',
		imageType: 'running difference',
		tilt: null,
		minorHalfWidth: null,
		speedMeasuredAtHeight: null,
		note: 'Measurement based on best fit among SOHO LASCO C2/C3, GOES CCOR-1, and STEREO A ',
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/CMEAnalysis/49174/-1',
		submissionTime: '2026-10-20T12:10Z',
		versionId: 1,
	},
];

/** `GET /DONKI/SEP` for 2024-05-01 to 2024-05-31. */
export const donkiSep = [
	{
		sepID: '2024-05-09T13:59:00-SEP-001',
		eventTime: '2024-05-09T13:59Z',
		instruments: [
			{
				displayName: 'MODEL: REleASE:ACE/EPAM 15.8-39.8 MeV',
			},
		],
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/SEP/30609/-1',
		linkedEvents: [
			{
				activityID: '2024-05-09T08:45:00-FLR-001',
			},
		],
		sentNotifications: [
			{
				messageID: '20240509-AL-004',
				messageIssueTime: '2024-05-09T14:00Z',
				messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/30611/1',
			},
		],
		submissionTime: '2024-05-09T13:54Z',
		versionId: 1,
	},
];

/** `GET /DONKI/MPC` for 2024-05-01 to 2024-05-31. */
export const donkiMpc = [
	{
		mpcID: '2024-05-02T15:49:00-MPC-001',
		eventTime: '2024-05-02T15:49Z',
		instruments: [
			{
				displayName: 'MODEL: SWMF',
			},
		],
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/MPC/30388/-1',
		linkedEvents: [
			{
				activityID: '2024-05-02T07:46:00-IPS-001',
			},
			{
				activityID: '2024-05-02T15:00:00-GST-001',
			},
		],
		sentNotifications: [
			{
				messageID: '20240502-AL-002',
				messageIssueTime: '2024-05-02T14:54Z',
				messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/30389/1',
			},
			{
				messageID: '20240502-AL-003',
				messageIssueTime: '2024-05-02T15:01Z',
				messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/30390/1',
			},
		],
		submissionTime: '2024-05-02T14:54Z',
		versionId: 1,
	},
];

/** `GET /DONKI/RBE` for 2026-10-01 to 2026-10-31. */
export const donkiRbe = [
	{
		rbeID: '2026-10-05T16:20:00-RBE-001',
		eventTime: '2026-10-05T16:20Z',
		instruments: [
			{
				displayName: 'GOES-P: SEISS >2MeV',
			},
		],
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/RBE/48977/-1',
		linkedEvents: [
			{
				activityID: '2026-10-03T23:40:00-HSS-001',
			},
		],
		sentNotifications: [
			{
				messageID: '20261005-AL-002',
				messageIssueTime: '2026-10-05T16:30Z',
				messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/48978/1',
			},
			{
				messageID: '20261005-AL-003',
				messageIssueTime: '2026-10-05T16:43Z',
				messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/48979/1',
			},
			{
				messageID: '20261007-AL-001',
				messageIssueTime: '2026-10-07T16:48Z',
				messageURL: 'https://ccmc.gsfc.nasa.gov/DONKI/view/Alert/49009/1',
			},
		],
		submissionTime: '2026-10-05T16:30Z',
		versionId: 1,
	},
];

/** `GET /DONKI/WSAEnlilSimulations` for 2026-10, a run with a Mars impact. */
export const donkiEnlil = [
	{
		simulationID: 'WSA-ENLIL/48927/1',
		modelCompletionTime: '2026-10-02T15:25Z',
		au: 2.0,
		cmeInputs: [
			{
				cmeStartTime: '2026-10-02T00:53Z',
				latitude: 33.0,
				longitude: 53.0,
				speed: 255.0,
				halfAngle: 28.0,
				time21_5: '2026-10-02T12:52Z',
				featureCode: 'LE',
				isMostAccurate: true,
				levelOfData: 0,
				ipsList: [],
				CMEID: '2026-10-02T00:53:00-CME-001',
			},
		],
		estimatedShockArrivalTime: null,
		isEarthGB: false,
		isEarthMinorImpact: false,
		rmin_re: null,
		kp_18: null,
		kp_90: null,
		kp_135: null,
		kp_180: null,
		estimatedDuration: null,
		impactList: [
			{
				location: 'Mars',
				arrivalTime: '2026-10-08T04:00Z',
				isGlancingBlow: true,
				isMinorImpact: false,
			},
		],
		link: 'https://ccmc.gsfc.nasa.gov/DONKI/view/WSA-ENLIL/48927/-1',
	},
];

/** `GET /DONKI/FLR`, from NASA's documented example (the route 404ed live). */
export const donkiFlare = [
	{
		flrID: '2016-01-01T23:00:00-FLR-001',
		instruments: [{ displayName: 'GOES15: SEM/XRS 1.0-8.0' }],
		beginTime: '2016-01-01T23:00Z',
		peakTime: '2016-01-02T00:10Z',
		endTime: null,
		classType: 'M2.3',
		sourceLocation: 'S21W73',
		activeRegionNum: 12473,
		linkedEvents: [{ activityID: '2016-01-01T23:12:00-CME-001' }],
		link: 'https://kauai.ccmc.gsfc.nasa.gov/DONKI/view/FLR/9999/-1',
	},
];
