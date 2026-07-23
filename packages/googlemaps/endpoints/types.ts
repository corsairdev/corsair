import { z } from 'zod';

export const AutocompleteInputSchema = z.object({
	input: z.string().describe('Text query to get predictions for.'),
	locationBias: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Location bias area.'),
	includedPrimaryTypes: z
		.array(z.string())
		.optional()
		.describe('Primary place types.'),
	languageCode: z.string().optional().describe('Language code.'),
	regionCode: z.string().optional().describe('Region code.'),
});

export const AutocompleteResponseSchema = z
	.object({
		suggestions: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const ComputeRouteMatrixInputSchema = z.object({
	origins: z
		.array(z.record(z.string(), z.unknown()))
		.describe('List of origin waypoints.'),
	destinations: z
		.array(z.record(z.string(), z.unknown()))
		.describe('List of destination waypoints.'),
	travelMode: z
		.string()
		.optional()
		.describe('DRIVE, BICYCLE, WALK, TWO_WHEELER, TRANSIT.'),
	routingPreference: z
		.string()
		.optional()
		.describe('TRAFFIC_UNAWARE, TRAFFIC_AWARE, TRAFFIC_AWARE_OPTIMAL.'),
	departureTime: z.string().optional().describe('Departure timestamp.'),
});

export const ComputeRouteMatrixResponseSchema = z
	.object({
		originIndex: z.number().optional(),
		destinationIndex: z.number().optional(),
		status: z.record(z.string(), z.unknown()).optional(),
		condition: z.string().optional(),
		distanceMeters: z.number().optional(),
		duration: z.string().optional(),
	})
	.passthrough();

export const CreateTilesSessionInputSchema = z.object({
	mapType: z.string().describe('roadmap, satellite, terrain, or streetview.'),
	language: z.string().optional().describe('BCP-47 language tag.'),
	region: z.string().optional().describe('ccTLD two-character region code.'),
	imageFormat: z.string().optional().describe('png, jpeg, webp.'),
	scale: z.string().optional().describe('scale factor.'),
});

export const CreateTilesSessionResponseSchema = z
	.object({
		session: z.string().describe('Session token for subsequent tile requests.'),
		expiry: z.string().optional().describe('Expiration timestamp.'),
		tileWidth: z.number().optional(),
		tileHeight: z.number().optional(),
		imageFormat: z.string().optional(),
	})
	.passthrough();

export const DistanceMatrixInputSchema = z.object({
	origins: z
		.union([z.string(), z.array(z.string())])
		.describe('Origins addresses or coordinates.'),
	destinations: z
		.union([z.string(), z.array(z.string())])
		.describe('Destinations addresses or coordinates.'),
	mode: z.string().optional().describe('driving, walking, bicycling, transit.'),
	units: z.string().optional().describe('metric, imperial.'),
	departure_time: z.string().optional().describe('Departure time.'),
});

export const DistanceMatrixResponseSchema = z
	.object({
		origin_addresses: z.array(z.string()).optional(),
		destination_addresses: z.array(z.string()).optional(),
		rows: z.array(z.record(z.string(), z.unknown())).optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const EmbedMapInputSchema = z.object({
	mode: z
		.enum(['place', 'view', 'directions', 'streetview', 'search'])
		.describe('Map embed mode.'),
	q: z.string().optional().describe('Location or search query.'),
	origin: z.string().optional().describe('Origin for directions mode.'),
	destination: z
		.string()
		.optional()
		.describe('Destination for directions mode.'),
	center: z.string().optional().describe('Center lat,lng.'),
	zoom: z.number().optional().describe('Zoom level.'),
	maptype: z.string().optional().describe('roadmap or satellite.'),
});

export const EmbedMapResponseSchema = z
	.object({
		embedUrl: z.string().describe('Embeddable map URL.'),
		iframeHtml: z.string().describe('HTML iframe code snippet for embedding.'),
	})
	.passthrough();

export const GeocodeAddressInputSchema = z.object({
	address: z.string().describe('Street address to geocode.'),
	bounds: z.string().optional().describe('Bounding box bias.'),
	language: z.string().optional().describe('Language code.'),
	region: z.string().optional().describe('Region code.'),
	key: z.string().optional().describe('API key override.'),
});

export const GeocodeAddressResponseSchema = z
	.object({
		results: z.array(z.record(z.string(), z.unknown())).optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const GeocodeAddressWithQueryInputSchema = z.object({
	address: z.string().describe('Address to geocode or validate.'),
	regionCode: z.string().optional().describe('Two-character region code.'),
	locality: z.string().optional().describe('Locality/City.'),
});

export const GeocodeAddressWithQueryResponseSchema = z
	.object({
		formattedAddress: z.string().optional(),
		location: z.record(z.string(), z.unknown()).optional(),
		results: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const GeocodeDestinationsInputSchema = z.object({
	address: z.string().optional().describe('Street address query.'),
	placeId: z.string().optional().describe('Place ID query.'),
	latlng: z.string().optional().describe('Latitude,longitude query.'),
});

export const GeocodeDestinationsResponseSchema = z
	.object({
		destination: z.record(z.string(), z.unknown()).optional(),
		places: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const GeocodePlaceInputSchema = z.object({
	place_id: z.string().describe('Google Place ID.'),
	language: z.string().optional().describe('Language code.'),
});

export const GeocodePlaceResponseSchema = z
	.object({
		results: z.array(z.record(z.string(), z.unknown())).optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const GeocodingApiInputSchema = z.object({
	address: z.string().optional().describe('Street address to geocode.'),
	latlng: z.string().optional().describe('Coordinates for reverse geocoding.'),
	place_id: z.string().optional().describe('Place ID.'),
	language: z.string().optional().describe('Language.'),
});

export const GeocodingApiResponseSchema = z
	.object({
		results: z.array(z.record(z.string(), z.unknown())).optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const GeolocateInputSchema = z.object({
	homeMobileCountryCode: z
		.number()
		.optional()
		.describe('MCC for home network.'),
	homeMobileNetworkCode: z
		.number()
		.optional()
		.describe('MNC for home network.'),
	radioType: z.string().optional().describe('lte, gsm, cdma, wcdma.'),
	carrier: z.string().optional().describe('Carrier name.'),
	cellTowers: z
		.array(z.record(z.string(), z.unknown()))
		.optional()
		.describe('Cell tower objects.'),
	wifiAccessPoints: z
		.array(z.record(z.string(), z.unknown()))
		.optional()
		.describe('WiFi access point objects.'),
});

export const GeolocateResponseSchema = z
	.object({
		location: z.object({
			lat: z.number(),
			lng: z.number(),
		}),
		accuracy: z.number(),
	})
	.passthrough();

export const Get2dTileInputSchema = z.object({
	session: z.string().describe('Valid session token from CreateTilesSession.'),
	z: z.number().describe('Zoom level.'),
	x: z.number().describe('X coordinate.'),
	y: z.number().describe('Y coordinate.'),
});

export const Get2dTileResponseSchema = z
	.object({
		tileUrl: z.string().describe('URL to fetch 2D tile image.'),
		content: z.string().optional().describe('Base64 tile data if requested.'),
	})
	.passthrough();

export const Get3dTilesRootInputSchema = z.object({
	key: z.string().optional().describe('Optional API key override.'),
});

export const Get3dTilesRootResponseSchema = z
	.object({
		asset: z.record(z.string(), z.unknown()).optional(),
		geometricError: z.number().optional(),
		root: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const GetDirectionInputSchema = z.object({
	origin: z.string().describe('Origin location address or lat,lng.'),
	destination: z.string().describe('Destination location address or lat,lng.'),
	mode: z.string().optional().describe('driving, walking, bicycling, transit.'),
	waypoints: z
		.union([z.string(), z.array(z.string())])
		.optional()
		.describe('Intermediate waypoints.'),
	avoid: z.string().optional().describe('tolls, highways, ferries.'),
});

export const GetDirectionResponseSchema = z
	.object({
		routes: z.array(z.record(z.string(), z.unknown())).optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const GetPlaceDetailsInputSchema = z.object({
	place_id: z
		.string()
		.describe('Place ID (or resource name places/{place_id}).'),
	fields: z.string().optional().describe('Field mask for response fields.'),
	languageCode: z.string().optional().describe('Language code.'),
});

export const GetPlaceDetailsResponseSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		formattedAddress: z.string().optional(),
		location: z.record(z.string(), z.unknown()).optional(),
		rating: z.number().optional(),
		types: z.array(z.string()).optional(),
	})
	.passthrough();

export const GetPlacePhotoInputSchema = z.object({
	photo_reference: z.string().describe('Photo reference identifier.'),
	maxwidth: z.number().optional().describe('Max width in pixels.'),
	maxheight: z.number().optional().describe('Max height in pixels.'),
});

export const GetPlacePhotoResponseSchema = z
	.object({
		photoUrl: z.string().describe('Public photo URL or image resource link.'),
	})
	.passthrough();

export const GetRouteInputSchema = z.object({
	origin: z.record(z.string(), z.unknown()).describe('Origin waypoint object.'),
	destination: z
		.record(z.string(), z.unknown())
		.describe('Destination waypoint object.'),
	travelMode: z
		.string()
		.optional()
		.describe('DRIVE, BICYCLE, WALK, TWO_WHEELER, TRANSIT.'),
	routingPreference: z
		.string()
		.optional()
		.describe('TRAFFIC_UNAWARE, TRAFFIC_AWARE.'),
});

export const GetRouteResponseSchema = z
	.object({
		routes: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const LookupAerialVideoInputSchema = z.object({
	address: z.string().optional().describe('US postal address.'),
	videoId: z.string().optional().describe('Video ID.'),
});

export const LookupAerialVideoResponseSchema = z
	.object({
		id: z.string().optional(),
		state: z.string().optional().describe('PROCESSING, ACTIVE, FAILED.'),
		uris: z.record(z.string(), z.unknown()).optional(),
	})
	.passthrough();

export const NearbySearchInputSchema = z.object({
	includedTypes: z
		.array(z.string())
		.optional()
		.describe('Included place types.'),
	excludedTypes: z
		.array(z.string())
		.optional()
		.describe('Excluded place types.'),
	maxResultCount: z.number().optional().describe('Max results (1-20).'),
	locationRestriction: z
		.record(z.string(), z.unknown())
		.describe('Center circle restriction.'),
});

export const NearbySearchResponseSchema = z
	.object({
		places: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const RenderAerialVideoInputSchema = z.object({
	address: z
		.string()
		.describe('US postal address to render aerial view video for.'),
});

export const RenderAerialVideoResponseSchema = z
	.object({
		id: z.string().describe('Video ID to monitor with lookupAerialVideo.'),
		state: z.string().optional(),
	})
	.passthrough();

export const ReverseGeocodeLocationInputSchema = z.object({
	latlng: z
		.string()
		.describe('Latitude and longitude string (e.g. "37.422,-122.084").'),
	language: z.string().optional().describe('Language code.'),
	result_type: z.string().optional().describe('Filter by result types.'),
});

export const ReverseGeocodeLocationResponseSchema = z
	.object({
		results: z.array(z.record(z.string(), z.unknown())).optional(),
		status: z.string().optional(),
	})
	.passthrough();

export const TextSearchInputSchema = z.object({
	textQuery: z.string().describe('Text search query string.'),
	includedType: z.string().optional().describe('Primary place type filter.'),
	locationBias: z
		.record(z.string(), z.unknown())
		.optional()
		.describe('Location bias circle or rectangle.'),
	minRating: z.number().optional().describe('Minimum place rating filter.'),
	openNow: z.boolean().optional().describe('Filter currently open places.'),
	maxResultCount: z.number().optional().describe('Max result count.'),
});

export const TextSearchResponseSchema = z
	.object({
		places: z.array(z.record(z.string(), z.unknown())).optional(),
	})
	.passthrough();

export const GoogleMapsEndpointInputSchemas = {
	autocomplete: AutocompleteInputSchema,
	computeRouteMatrix: ComputeRouteMatrixInputSchema,
	createTilesSession: CreateTilesSessionInputSchema,
	distanceMatrix: DistanceMatrixInputSchema,
	embedMap: EmbedMapInputSchema,
	geocodeAddress: GeocodeAddressInputSchema,
	geocodeAddressWithQuery: GeocodeAddressWithQueryInputSchema,
	geocodeDestinations: GeocodeDestinationsInputSchema,
	geocodePlace: GeocodePlaceInputSchema,
	geocodingApi: GeocodingApiInputSchema,
	geolocate: GeolocateInputSchema,
	get2dTile: Get2dTileInputSchema,
	get3dTilesRoot: Get3dTilesRootInputSchema,
	getDirection: GetDirectionInputSchema,
	getPlaceDetails: GetPlaceDetailsInputSchema,
	getPlacePhoto: GetPlacePhotoInputSchema,
	getRoute: GetRouteInputSchema,
	lookupAerialVideo: LookupAerialVideoInputSchema,
	nearbySearch: NearbySearchInputSchema,
	renderAerialVideo: RenderAerialVideoInputSchema,
	reverseGeocodeLocation: ReverseGeocodeLocationInputSchema,
	textSearch: TextSearchInputSchema,
} as const;

export const GoogleMapsEndpointOutputSchemas = {
	autocomplete: AutocompleteResponseSchema,
	computeRouteMatrix: ComputeRouteMatrixResponseSchema,
	createTilesSession: CreateTilesSessionResponseSchema,
	distanceMatrix: DistanceMatrixResponseSchema,
	embedMap: EmbedMapResponseSchema,
	geocodeAddress: GeocodeAddressResponseSchema,
	geocodeAddressWithQuery: GeocodeAddressWithQueryResponseSchema,
	geocodeDestinations: GeocodeDestinationsResponseSchema,
	geocodePlace: GeocodePlaceResponseSchema,
	geocodingApi: GeocodingApiResponseSchema,
	geolocate: GeolocateResponseSchema,
	get2dTile: Get2dTileResponseSchema,
	get3dTilesRoot: Get3dTilesRootResponseSchema,
	getDirection: GetDirectionResponseSchema,
	getPlaceDetails: GetPlaceDetailsResponseSchema,
	getPlacePhoto: GetPlacePhotoResponseSchema,
	getRoute: GetRouteResponseSchema,
	lookupAerialVideo: LookupAerialVideoResponseSchema,
	nearbySearch: NearbySearchResponseSchema,
	renderAerialVideo: RenderAerialVideoResponseSchema,
	reverseGeocodeLocation: ReverseGeocodeLocationResponseSchema,
	textSearch: TextSearchResponseSchema,
} as const;

export type AutocompleteInput = z.infer<typeof AutocompleteInputSchema>;
export type AutocompleteResponse = z.infer<typeof AutocompleteResponseSchema>;

export type ComputeRouteMatrixInput = z.infer<
	typeof ComputeRouteMatrixInputSchema
>;
export type ComputeRouteMatrixResponse = z.infer<
	typeof ComputeRouteMatrixResponseSchema
>;

export type CreateTilesSessionInput = z.infer<
	typeof CreateTilesSessionInputSchema
>;
export type CreateTilesSessionResponse = z.infer<
	typeof CreateTilesSessionResponseSchema
>;

export type DistanceMatrixInput = z.infer<typeof DistanceMatrixInputSchema>;
export type DistanceMatrixResponse = z.infer<
	typeof DistanceMatrixResponseSchema
>;

export type EmbedMapInput = z.infer<typeof EmbedMapInputSchema>;
export type EmbedMapResponse = z.infer<typeof EmbedMapResponseSchema>;

export type GeocodeAddressInput = z.infer<typeof GeocodeAddressInputSchema>;
export type GeocodeAddressResponse = z.infer<
	typeof GeocodeAddressResponseSchema
>;

export type GeocodeAddressWithQueryInput = z.infer<
	typeof GeocodeAddressWithQueryInputSchema
>;
export type GeocodeAddressWithQueryResponse = z.infer<
	typeof GeocodeAddressWithQueryResponseSchema
>;

export type GeocodeDestinationsInput = z.infer<
	typeof GeocodeDestinationsInputSchema
>;
export type GeocodeDestinationsResponse = z.infer<
	typeof GeocodeDestinationsResponseSchema
>;

export type GeocodePlaceInput = z.infer<typeof GeocodePlaceInputSchema>;
export type GeocodePlaceResponse = z.infer<typeof GeocodePlaceResponseSchema>;

export type GeocodingApiInput = z.infer<typeof GeocodingApiInputSchema>;
export type GeocodingApiResponse = z.infer<typeof GeocodingApiResponseSchema>;

export type GeolocateInput = z.infer<typeof GeolocateInputSchema>;
export type GeolocateResponse = z.infer<typeof GeolocateResponseSchema>;

export type Get2dTileInput = z.infer<typeof Get2dTileInputSchema>;
export type Get2dTileResponse = z.infer<typeof Get2dTileResponseSchema>;

export type Get3dTilesRootInput = z.infer<typeof Get3dTilesRootInputSchema>;
export type Get3dTilesRootResponse = z.infer<
	typeof Get3dTilesRootResponseSchema
>;

export type GetDirectionInput = z.infer<typeof GetDirectionInputSchema>;
export type GetDirectionResponse = z.infer<typeof GetDirectionResponseSchema>;

export type GetPlaceDetailsInput = z.infer<typeof GetPlaceDetailsInputSchema>;
export type GetPlaceDetailsResponse = z.infer<
	typeof GetPlaceDetailsResponseSchema
>;

export type GetPlacePhotoInput = z.infer<typeof GetPlacePhotoInputSchema>;
export type GetPlacePhotoResponse = z.infer<typeof GetPlacePhotoResponseSchema>;

export type GetRouteInput = z.infer<typeof GetRouteInputSchema>;
export type GetRouteResponse = z.infer<typeof GetRouteResponseSchema>;

export type LookupAerialVideoInput = z.infer<
	typeof LookupAerialVideoInputSchema
>;
export type LookupAerialVideoResponse = z.infer<
	typeof LookupAerialVideoResponseSchema
>;

export type NearbySearchInput = z.infer<typeof NearbySearchInputSchema>;
export type NearbySearchResponse = z.infer<typeof NearbySearchResponseSchema>;

export type RenderAerialVideoInput = z.infer<
	typeof RenderAerialVideoInputSchema
>;
export type RenderAerialVideoResponse = z.infer<
	typeof RenderAerialVideoResponseSchema
>;

export type ReverseGeocodeLocationInput = z.infer<
	typeof ReverseGeocodeLocationInputSchema
>;
export type ReverseGeocodeLocationResponse = z.infer<
	typeof ReverseGeocodeLocationResponseSchema
>;

export type TextSearchInput = z.infer<typeof TextSearchInputSchema>;
export type TextSearchResponse = z.infer<typeof TextSearchResponseSchema>;

export type GoogleMapsEndpointInputs = {
	autocomplete: AutocompleteInput;
	computeRouteMatrix: ComputeRouteMatrixInput;
	createTilesSession: CreateTilesSessionInput;
	distanceMatrix: DistanceMatrixInput;
	embedMap: EmbedMapInput;
	geocodeAddress: GeocodeAddressInput;
	geocodeAddressWithQuery: GeocodeAddressWithQueryInput;
	geocodeDestinations: GeocodeDestinationsInput;
	geocodePlace: GeocodePlaceInput;
	geocodingApi: GeocodingApiInput;
	geolocate: GeolocateInput;
	get2dTile: Get2dTileInput;
	get3dTilesRoot: Get3dTilesRootInput;
	getDirection: GetDirectionInput;
	getPlaceDetails: GetPlaceDetailsInput;
	getPlacePhoto: GetPlacePhotoInput;
	getRoute: GetRouteInput;
	lookupAerialVideo: LookupAerialVideoInput;
	nearbySearch: NearbySearchInput;
	renderAerialVideo: RenderAerialVideoInput;
	reverseGeocodeLocation: ReverseGeocodeLocationInput;
	textSearch: TextSearchInput;
};

export type GoogleMapsEndpointOutputs = {
	autocomplete: AutocompleteResponse;
	computeRouteMatrix: ComputeRouteMatrixResponse;
	createTilesSession: CreateTilesSessionResponse;
	distanceMatrix: DistanceMatrixResponse;
	embedMap: EmbedMapResponse;
	geocodeAddress: GeocodeAddressResponse;
	geocodeAddressWithQuery: GeocodeAddressWithQueryResponse;
	geocodeDestinations: GeocodeDestinationsResponse;
	geocodePlace: GeocodePlaceResponse;
	geocodingApi: GeocodingApiResponse;
	geolocate: GeolocateResponse;
	get2dTile: Get2dTileResponse;
	get3dTilesRoot: Get3dTilesRootResponse;
	getDirection: GetDirectionResponse;
	getPlaceDetails: GetPlaceDetailsResponse;
	getPlacePhoto: GetPlacePhotoResponse;
	getRoute: GetRouteResponse;
	lookupAerialVideo: LookupAerialVideoResponse;
	nearbySearch: NearbySearchResponse;
	renderAerialVideo: RenderAerialVideoResponse;
	reverseGeocodeLocation: ReverseGeocodeLocationResponse;
	textSearch: TextSearchResponse;
};
