// Bodies the live API sent on 2026-11-10 for the requests named beside each
// one, trimmed for size (long geometries and annotation arrays cut short).
// Error bodies are the ones Mapbox answered; the 429 body is not, because a
// 429 was never provoked, so it follows the docs' "Rate limit exceeded".

// GET /search/geocode/v6/forward?q=Paris&limit=1
export const geocodingForwardParis = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			id: 'dXJuOm1ieHBsYzpEYVJO',
			geometry: {
				type: 'Point',
				coordinates: [2.348392, 48.853495],
			},
			properties: {
				mapbox_id: 'dXJuOm1ieHBsYzpEYVJO',
				feature_type: 'place',
				full_address: 'Paris, France',
				name: 'Paris',
				name_preferred: 'Paris',
				coordinates: {
					longitude: 2.348392,
					latitude: 48.853495,
				},
				additional_feature_types: ['region', 'place'],
				place_formatted: 'France',
				bbox: [2.224229, 48.815562, 2.469851, 48.902148],
				context: {
					region: {
						mapbox_id: 'dXJuOm1ieHBsYzpEYVJO',
						name: 'Paris',
						alternate: {
							mapbox_id: 'dXJuOm1ieHBsYzpENFJO',
							name: 'Île-de-France',
							wikidata_id: 'Q13917',
							region_code: 'IDF',
							region_code_full: 'FR-IDF',
						},
						region_code: '75',
						region_code_full: 'FR-75',
						wikidata_id: 'Q90',
					},
					country: {
						mapbox_id: 'dXJuOm1ieHBsYzpJazA',
						name: 'France',
						wikidata_id: 'Q142',
						country_code: 'FR',
						country_code_alpha_3: 'FRA',
					},
					place: {
						mapbox_id: 'dXJuOm1ieHBsYzpEYVJO',
						name: 'Paris',
						alternate: {
							mapbox_id: 'dXJuOm1ieHBsYzpENFJO',
							name: 'Île-de-France',
							wikidata_id: 'Q13917',
							region_code: 'IDF',
							region_code_full: 'FR-IDF',
						},
						wikidata_id: 'Q90',
					},
				},
			},
		},
	],
	attribution: 'NOTICE: Mapbox attribution text.',
};

// GET /search/geocode/v6/reverse?longitude=2.3522&latitude=48.8566
export const geocodingReverseParis = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			id: 'dXJuOm1ieGFkcjpjZTUyYzdjNC1iM2FjLTRlNzctYWU4MS03OTYxMGUxN2E5Njg',
			geometry: {
				type: 'Point',
				coordinates: [2.352092, 48.856737],
			},
			properties: {
				mapbox_id:
					'dXJuOm1ieGFkcjpjZTUyYzdjNC1iM2FjLTRlNzctYWU4MS03OTYxMGUxN2E5Njg',
				feature_type: 'address',
				full_address: "8 Place De L'hôtel De Ville, 75004 Paris, France",
				name: "8 Place De L'hôtel De Ville",
				name_preferred: "8 Place De L'hôtel De Ville",
				coordinates: {
					longitude: 2.352092,
					latitude: 48.856737,
					accuracy: 'rooftop',
					routable_points: [
						{
							name: 'default',
							latitude: 48.856969,
							longitude: 2.35115,
						},
					],
				},
				place_formatted: '75004 Paris, France',
				context: {
					address: {
						mapbox_id:
							'dXJuOm1ieGFkcjpjZTUyYzdjNC1iM2FjLTRlNzctYWU4MS03OTYxMGUxN2E5Njg',
						address_number: '8',
						street_name: "Place De L'hôtel De Ville",
						name: "8 Place De L'hôtel De Ville",
					},
					street: {
						mapbox_id:
							'dXJuOm1ieGFkci1zdHI6Y2U1MmM3YzQtYjNhYy00ZTc3LWFlODEtNzk2MTBlMTdhOTY4',
						name: "Place De L'hôtel De Ville",
					},
					neighborhood: {
						mapbox_id: 'dXJuOm1ieHBsYzpCU2tzVFE',
						name: 'Le Marais',
						wikidata_id: 'Q749573',
						alternate: {
							mapbox_id: 'dXJuOm1ieHBsYzpCUzJzVFE',
							name: 'Saint-Merri',
							wikidata_id: 'Q3413122',
						},
					},
					postcode: {
						mapbox_id: 'postcode.3162156990079200',
						name: '75004',
					},
					locality: {
						mapbox_id: 'dXJuOm1ieHBsYzpDV3BO',
						name: '4th arrondissement',
						wikidata_id: 'Q230127',
					},
					place: {
						mapbox_id: 'dXJuOm1ieHBsYzpEYVJO',
						name: 'Paris',
						wikidata_id: 'Q90',
						short_code: 'FR-75',
					},
					region: {
						mapbox_id: 'dXJuOm1ieHBsYzpEYVJO',
						name: 'Paris',
						wikidata_id: 'Q90',
						region_code: '75',
						region_code_full: 'FR-75',
						alternate: {
							mapbox_id: 'dXJuOm1ieHBsYzpENFJO',
							name: 'Île-de-France',
							wikidata_id: 'Q13917',
							region_code: 'IDF',
							region_code_full: 'FR-IDF',
						},
					},
					country: {
						mapbox_id: 'dXJuOm1ieHBsYzpJazA',
						name: 'France',
						wikidata_id: 'Q142',
						country_code: 'FR',
						country_code_alpha_3: 'FRA',
					},
				},
			},
		},
		{
			type: 'Feature',
			id: 'dXJuOm1ieHBsYzpCU2tzVFE',
			geometry: {
				type: 'Point',
				coordinates: [2.35827, 48.85904],
			},
			properties: {
				mapbox_id: 'dXJuOm1ieHBsYzpCU2tzVFE',
				feature_type: 'neighborhood',
				full_address: 'Le Marais, Paris, France',
				name: 'Le Marais',
				name_preferred: 'Le Marais',
				coordinates: {
					longitude: 2.35827,
					latitude: 48.85904,
				},
				place_formatted: 'Paris, France',
				bbox: [2.348926, 48.847113, 2.368962, 48.868976],
				context: {
					postcode: {
						mapbox_id: 'postcode.3162156990079200',
						name: '75004',
					},
					locality: {
						mapbox_id: 'dXJuOm1ieHBsYzpDV3BO',
						name: '4th arrondissement',
						wikidata_id: 'Q230127',
					},
					region: {
						mapbox_id: 'dXJuOm1ieHBsYzpEYVJO',
						name: 'Paris',
						wikidata_id: 'Q90',
						region_code: '75',
						region_code_full: 'FR-75',
						alternate: {
							mapbox_id: 'dXJuOm1ieHBsYzpENFJO',
							name: 'Île-de-France',
							wikidata_id: 'Q13917',
							region_code: 'IDF',
							region_code_full: 'FR-IDF',
						},
					},
					place: {
						mapbox_id: 'dXJuOm1ieHBsYzpEYVJO',
						name: 'Paris',
						wikidata_id: 'Q90',
						short_code: 'FR-75',
					},
					country: {
						mapbox_id: 'dXJuOm1ieHBsYzpJazA',
						name: 'France',
						wikidata_id: 'Q142',
						country_code: 'FR',
						country_code_alpha_3: 'FRA',
					},
					neighborhood: {
						mapbox_id: 'dXJuOm1ieHBsYzpCU2tzVFE',
						name: 'Le Marais',
						wikidata_id: 'Q749573',
					},
				},
			},
		},
	],
	attribution: 'NOTICE: Mapbox attribution text.',
};

// GET /search/geocode/v6/forward?q=zzzzqqqxxxx9999nothing (a 200)
export const geocodingNoMatch = {
	type: 'FeatureCollection',
	features: [],
	attribution: 'NOTICE: Mapbox attribution text.',
};

// GET /directions/v5/mapbox/driving/2.35,48.85;2.30,48.86
export const directionsRoute = {
	code: 'Ok',
	waypoints: [
		{
			location: [2.349775, 48.850139],
			name: 'Rue de Bièvre',
			distance: 22.63,
		},
		{
			location: [2.2999, 48.860255],
			name: 'Avenue Franco-Russe',
			distance: 29.302,
		},
	],
	routes: [
		{
			geometry: 'k`diHa}iM_FyEuJdY_DbPaUnc@aDb]q[f|ApArgBbL|BNvE',
			distance: 4450.118,
			duration: 1367.828,
			weight: 1164.091,
			weight_name: 'auto',
			legs: [
				{
					steps: [],
					summary: "Quai Valéry Giscard d'Estaing, Quai d'Orsay",
					distance: 4450.118,
					duration: 1367.828,
					weight: 1164.091,
					admins: [
						{
							iso_3166_1: 'FR',
							iso_3166_1_alpha3: 'FRA',
						},
					],
					via_waypoints: [],
				},
			],
		},
	],
	uuid: 'Xwt8G5w7O6EQQMzoTHAE3VR0JXeHbCV6a6EGy8DVtuE7qcX0vKxr1g==',
};

// GET /directions/v5/mapbox/driving-traffic/...?overview=full&annotations=duration,congestion&geometries=geojson
export const directionsRouteTraffic = {
	code: 'Ok',
	waypoints: [
		{
			location: [2.349775, 48.850139],
			name: 'Rue de Bièvre',
			distance: 22.63,
			time_zone: {
				offset: '+01:00',
				identifier: 'Europe/Paris',
				abbreviation: 'CET',
			},
		},
		{
			location: [2.2999, 48.860255],
			name: 'Avenue Franco-Russe',
			distance: 29.302,
			time_zone: {
				offset: '+01:00',
				identifier: 'Europe/Paris',
				abbreviation: 'CET',
			},
		},
	],
	routes: [
		{
			geometry: {
				type: 'LineString',
				coordinates: [
					[2.349775, 48.850139],
					[2.349843, 48.850187],
					[2.350281, 48.850578],
					[2.350521, 48.850852],
				],
			},
			distance: 4759.321,
			duration: 1448.394,
			weight: 1221.612,
			weight_name: 'auto',
			duration_typical: 1225.834,
			weight_typical: 1225.767,
			legs: [
				{
					steps: [],
					summary: "Quai Valéry Giscard d'Estaing, Quai d'Orsay",
					distance: 4759.321,
					duration: 1448.394,
					weight: 1221.612,
					duration_typical: 1225.834,
					weight_typical: 1225.767,
					admins: [
						{
							iso_3166_1: 'FR',
							iso_3166_1_alpha3: 'FRA',
						},
					],
					annotation: {
						duration: [2.358, 17.438, 11.354],
						congestion: ['unknown', 'unknown', 'unknown'], // unknown: Mapbox's own label for no traffic data
					},
					via_waypoints: [],
				},
			],
		},
	],
	uuid: 'NozJ5MeHthhlRD4UdOSP5dHzWnOsn2KlXy-JIrF43vh9khyWeV0Glw==',
};

// GET /directions-matrix/v1/mapbox/driving/2.35,48.85;2.30,48.86;2.40,48.87
export const matrixDurations = {
	code: 'Ok',
	destinations: [
		{
			distance: 27.092476827,
			name: 'Boulevard Saint-Germain',
			location: [2.34987, 48.849772],
		},
		{
			distance: 29.291302984,
			name: 'Avenue Franco-Russe',
			location: [2.2999, 48.860255],
		},
		{
			distance: 6.568126671,
			name: 'Rue Pelleport',
			location: [2.399922, 48.869971],
		},
	],
	durations: [
		[0, 1143.6, 1525.8],
		[1184, 0, 2322.9],
		[1781.9, 2586.4, 0],
	],
	sources: [
		{
			distance: 27.092476827,
			name: 'Boulevard Saint-Germain',
			location: [2.34987, 48.849772],
		},
		{
			distance: 29.291302984,
			name: 'Avenue Franco-Russe',
			location: [2.2999, 48.860255],
		},
		{
			distance: 6.568126671,
			name: 'Rue Pelleport',
			location: [2.399922, 48.869971],
		},
	],
};

// ... ?annotations=duration,distance
export const matrixDurationsDistances = {
	code: 'Ok',
	distances: [
		[0, 4559.6, 5492.2],
		[4959.6, 0, 9613.3],
		[6747.6, 16586.5, 0],
	],
	destinations: [
		{
			distance: 27.092476827,
			name: 'Boulevard Saint-Germain',
			location: [2.34987, 48.849772],
		},
		{
			distance: 29.291302984,
			name: 'Avenue Franco-Russe',
			location: [2.2999, 48.860255],
		},
		{
			distance: 6.568126671,
			name: 'Rue Pelleport',
			location: [2.399922, 48.869971],
		},
	],
	durations: [
		[0, 1143.6, 1525.8],
		[1184, 0, 2322.9],
		[1781.9, 2586.4, 0],
	],
	sources: [
		{
			distance: 27.092476827,
			name: 'Boulevard Saint-Germain',
			location: [2.34987, 48.849772],
		},
		{
			distance: 29.291302984,
			name: 'Avenue Franco-Russe',
			location: [2.2999, 48.860255],
		},
		{
			distance: 6.568126671,
			name: 'Rue Pelleport',
			location: [2.399922, 48.869971],
		},
	],
};

// GET /isochrone/v1/mapbox/driving/2.35,48.85?contours_minutes=5,10&polygons=true
export const isochronePolygons = {
	features: [
		{
			properties: {
				'fill-opacity': 0.33,
				fillColor: '#bf4040',
				opacity: 0.33,
				fill: '#bf4040',
				fillOpacity: 0.33,
				color: '#bf4040',
				contour: 10,
				metric: 'time',
			},
			geometry: {
				coordinates: [
					[
						[2.35, 48.862433],
						[2.349, 48.861411],
						[2.348572, 48.859428],
						[2.34738, 48.85938],
						[2.347095, 48.860095],
						[2.346176, 48.860176],
					],
				],
				type: 'Polygon',
			},
			type: 'Feature',
		},
		{
			properties: {
				'fill-opacity': 0.33,
				fillColor: '#9fbf40',
				opacity: 0.33,
				fill: '#9fbf40',
				fillOpacity: 0.33,
				color: '#9fbf40',
				contour: 5,
				metric: 'time',
			},
			geometry: {
				coordinates: [
					[
						[2.352, 48.854032],
						[2.351222, 48.851778],
						[2.35, 48.852793],
						[2.348835, 48.852835],
						[2.348, 48.853618],
						[2.345697, 48.853697],
					],
				],
				type: 'Polygon',
			},
			type: 'Feature',
		},
	],
	type: 'FeatureCollection',
};

// GET /v4/mapbox.mapbox-streets-v8/tilequery/2.3522,48.8566.json?limit=2&radius=100
export const tilequeryBuildings = {
	type: 'FeatureCollection',
	features: [
		{
			type: 'Feature',
			id: 284089,
			geometry: {
				type: 'Point',
				coordinates: [2.3522, 48.8566],
			},
			properties: {
				type: 'civic',
				extrude: 'false',
				height: 40,
				iso_3166_2: 'FR-IDF',
				min_height: 0,
				iso_3166_1: 'FR',
				underground: 'false',
				tilequery: {
					distance: 0,
					geometry: 'polygon',
					layer: 'building',
				},
			},
		},
		{
			type: 'Feature',
			id: 331242775,
			geometry: {
				type: 'Point',
				coordinates: [2.3522, 48.8566],
			},
			properties: {
				type: 'building:part',
				building_id: 284089,
				extrude: 'true',
				height: 15.5,
				iso_3166_2: 'FR-IDF',
				min_height: 0,
				iso_3166_1: 'FR',
				underground: 'false',
				tilequery: {
					distance: 0,
					geometry: 'polygon',
					layer: 'building',
				},
			},
		},
	],
};

// GET /optimized-trips/v1/mapbox/driving/...?roundtrip=false&source=first&destination=last
export const tripsOptimized = {
	code: 'Ok',
	waypoints: [
		{
			distance: 27.09247682715505,
			name: 'Boulevard Saint-Germain',
			location: [2.34987, 48.849772],
			waypoint_index: 0,
			trips_index: 0,
		},
		{
			distance: 29.29130298446318,
			name: 'Avenue Franco-Russe',
			location: [2.2999, 48.860255],
			waypoint_index: 1,
			trips_index: 0,
		},
		{
			distance: 6.568126671857891,
			name: 'Rue Pelleport',
			location: [2.399922, 48.869971],
			waypoint_index: 2,
			trips_index: 0,
		},
	],
	trips: [
		{
			legs: [
				{
					steps: [],
					summary: '',
					weight: 1571.2,
					duration: 1143.6,
					distance: 4550.9,
				},
				{
					steps: [],
					summary: '',
					weight: 3319.8,
					duration: 2322.9,
					distance: 9595.5,
				},
			],
			weight_name: 'routability',
			weight: 4891,
			duration: 3466.5,
			distance: 14146.4,
		},
	],
};

export const errorBodies = {
	noToken: {
		message: 'Not Authorized - No Token',
		error_code: 'NO_TOKEN',
	},
	invalidToken: {
		message: 'Not Authorized - Invalid Token',
		error_code: 'INVALID_TOKEN',
	},
	invalidTokenPrefix: {
		message: 'Not Authorized - Invalid Token',
		error_detail: 'No valid token prefix found in access_token parameter',
	},
	geocodingValidation: {
		message: 'Structured query is empty',
		error_code: 'VALIDATION_ERROR',
	},
	navigationValidation: {
		message:
			'Not enough input coordinates given; minimum number of coordinates is 2.',
		code: 'InvalidInput',
	},
	tilequeryNotFound: {
		message: 'Tileset "nonexistent.tileset" does not exist',
	},
	noSegment: {
		code: 'NoSegment',
		message: 'Could not find a matching segment for input coordinates',
		routes: [],
	},
	notImplemented: {
		code: 'NotImplemented',
		message: 'This request is not supported',
		trips: [],
	},
	forbidden: {
		code: 'forbidden',
		message: 'Account does not have access to this service',
		ref: 'example-ref',
	},
	rateLimited: {
		message: 'Rate limit exceeded',
	},
};
