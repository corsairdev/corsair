import * as clientModule from './client';
import { googlemaps } from './index';

jest.mock('./client', () => {
	const original = jest.requireActual('./client');
	return {
		...original,
		makeGoogleMapsRequest: jest.fn(),
	};
});

describe('Google Maps Plugin API Tests', () => {
	const mockedMakeRequest =
		clientModule.makeGoogleMapsRequest as jest.MockedFunction<
			typeof clientModule.makeGoogleMapsRequest
		>;

	const dummyCtx = {
		key: 'test_key',
		authType: 'api_key' as const,
		$getAccountId: jest.fn().mockResolvedValue('acc_123'),
	} as any;

	const dummyOAuthCtx = {
		key: 'oauth_access_token',
		authType: 'oauth_2' as const,
		$getAccountId: jest.fn().mockResolvedValue('acc_123'),
	} as any;

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('initializes googlemaps plugin with api_key auth', () => {
		const plugin = googlemaps({ authType: 'api_key' });
		expect(plugin.id).toBe('googlemaps');
		expect(plugin.authConfig!.api_key).toBeDefined();
	});

	// Places Endpoints (5)
	it('places.autocomplete returns place suggestions', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			suggestions: [{ placePrediction: { text: { text: 'Seattle, WA' } } }],
		});

		const res = await plugin.endpoints!.places.autocomplete(dummyCtx, {
			input: 'Seattle',
		});

		expect(res.suggestions).toBeDefined();
		expect(mockedMakeRequest).toHaveBeenCalledWith(
			'/v1/places:autocomplete',
			dummyCtx,
			expect.objectContaining({ method: 'POST' }),
		);
	});

	it('places.getPlaceDetails retrieves details by place_id', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			id: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4',
			name: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4',
			formattedAddress: 'Sydney NSW, Australia',
		});

		const res = await plugin.endpoints!.places.getPlaceDetails(dummyCtx, {
			place_id: 'ChIJN1t_tDeuEmsRUsoyG83frY4',
		});

		expect(res.formattedAddress).toBe('Sydney NSW, Australia');
	});

	it('places.getPlacePhoto resolves photo without exposing credentials', async () => {
		const fetchMock = jest
			.spyOn(global, 'fetch')
			.mockResolvedValueOnce({
				ok: true,
				headers: new Headers({ 'content-type': 'application/json' }),
				json: async () => ({
					photoUri: 'https://lh3.googleusercontent.com/legacy-photo.jpg',
				}),
			} as Response)
			.mockResolvedValueOnce({
				ok: true,
				headers: new Headers({ 'content-type': 'image/jpeg' }),
				arrayBuffer: async () => Uint8Array.from([4, 5, 6]).buffer,
			} as Response)
			.mockResolvedValueOnce({
				ok: true,
				headers: new Headers({ 'content-type': 'image/jpeg' }),
				arrayBuffer: async () => Uint8Array.from([1, 2, 3]).buffer,
			} as Response)
			.mockResolvedValueOnce({
				ok: true,
				headers: new Headers({ 'content-type': 'image/jpeg' }),
				arrayBuffer: async () => Uint8Array.from([7, 8, 9]).buffer,
			} as Response);

		const plugin = googlemaps();

		const res = await plugin.endpoints!.places.getPlacePhoto(dummyCtx, {
			photo_reference: 'ref_12345',
			maxwidth: 400,
		});
		expect(res.photoUrl).toBe(
			'https://lh3.googleusercontent.com/legacy-photo.jpg',
		);
		expect(res.photoUrl).not.toContain('key=');
		expect(fetchMock.mock.calls[0]?.[1]?.headers).toEqual(
			expect.objectContaining({ 'X-Goog-Api-Key': 'test_key' }),
		);
		expect(fetchMock.mock.calls[0]?.[1]?.redirect).toBe('manual');

		// Legacy photo: when Google returns image bytes instead of JSON, use data URL
		const resLegacyImage = await plugin.endpoints!.places.getPlacePhoto(
			dummyCtx,
			{
				photo_reference: 'ref_legacy_image',
				maxwidth: 400,
			},
		);
		expect(resLegacyImage.photoUrl).toMatch(/^data:image\/jpeg;base64,/);

		const resNew = await plugin.endpoints!.places.getPlacePhoto(dummyCtx, {
			photo_reference: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4/photos/Aap_uEA7',
			maxwidth: 400,
		});
		expect(resNew.photoUrl).toMatch(/^data:image\/jpeg;base64,/);
		expect(resNew.photoUrl).not.toContain('key=');

		await expect(
			plugin.endpoints!.places.getPlacePhoto(dummyOAuthCtx, {
				photo_reference: 'ref_12345',
				maxwidth: 400,
			}),
		).rejects.toThrow(/Legacy photo references require API key/);

		const resOAuthNew = await plugin.endpoints!.places.getPlacePhoto(
			dummyOAuthCtx,
			{
				photo_reference: 'places/ChIJN1t_tDeuEmsRUsoyG83frY4/photos/Aap_uEA7',
				maxwidth: 400,
			},
		);
		expect(resOAuthNew.photoUrl).toMatch(/^data:image\/jpeg;base64,/);
		expect(resOAuthNew.photoUrl).not.toContain('key=');

		fetchMock.mockRestore();
	});

	it('places.nearbySearch searches places nearby', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			places: [{ name: 'places/p1', displayName: { text: 'Park' } }],
		});

		const res = await plugin.endpoints!.places.nearbySearch(dummyCtx, {
			locationRestriction: {
				circle: { center: { latitude: 37.4, longitude: -122.0 }, radius: 500 },
			},
		});

		expect(res.places).toBeDefined();
	});

	it('places.textSearch searches places by query string', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			places: [{ name: 'places/p2', formattedAddress: 'London, UK' }],
		});

		const res = await plugin.endpoints!.places.textSearch(dummyCtx, {
			textQuery: 'restaurants in London',
		});

		expect(res.places).toBeDefined();
	});

	// Routes Endpoints (4)
	it('routes.computeRouteMatrix calculates matrix', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			originIndex: 0,
			destinationIndex: 0,
			distanceMeters: 5000,
			duration: '600s',
		});

		const res = await plugin.endpoints!.routes.computeRouteMatrix(dummyCtx, {
			origins: [{ waypoint: { address: 'San Francisco, CA' } }],
			destinations: [{ waypoint: { address: 'Oakland, CA' } }],
		});

		expect(res.distanceMeters).toBe(5000);
	});

	it('routes.distanceMatrix calculates distance matrix (api_key and oauth)', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			status: 'OK',
			origin_addresses: ['SF'],
			destination_addresses: ['Oakland'],
		});

		const res = await plugin.endpoints!.routes.distanceMatrix(dummyCtx, {
			origins: 'SF',
			destinations: 'Oakland',
		});

		expect(res.status).toBe('OK');

		// OAuth test: mock computeRouteMatrix returning array of elements
		mockedMakeRequest.mockResolvedValueOnce([
			{
				originIndex: 0,
				destinationIndex: 0,
				condition: 'ROUTE_EXISTS',
				distanceMeters: 5000,
				duration: '600s',
			},
		]);
		const resOAuth = await plugin.endpoints!.routes.distanceMatrix(
			dummyOAuthCtx,
			{
				origins: 'SF',
				destinations: 'Oakland',
			},
		);
		expect(resOAuth.status).toBe('OK');
		expect((resOAuth.rows![0] as any).elements[0].status).toBe('OK');
		expect(resOAuth.rows).toBeDefined();
		expect(Array.isArray(resOAuth.rows)).toBe(true);
		expect((resOAuth.rows![0] as any).elements).toBeDefined();
		expect(Array.isArray((resOAuth.rows![0] as any).elements)).toBe(true);

		// OAuth multi-origin: elements grouped by originIndex into separate rows
		mockedMakeRequest.mockResolvedValueOnce([
			{
				originIndex: 1,
				destinationIndex: 1,
				condition: 'ROUTE_EXISTS',
				distanceMeters: 4000,
				duration: '480s',
			},
			{
				originIndex: 0,
				destinationIndex: 1,
				condition: 'ROUTE_EXISTS',
				distanceMeters: 2000,
				duration: '240s',
			},
			{
				originIndex: 1,
				destinationIndex: 0,
				condition: 'ROUTE_EXISTS',
				distanceMeters: 3000,
				duration: '360s',
			},
			{
				originIndex: 0,
				destinationIndex: 0,
				condition: 'ROUTE_EXISTS',
				distanceMeters: 1000,
				duration: '120s',
			},
		]);
		const resMultiOrigin = await plugin.endpoints!.routes.distanceMatrix(
			dummyOAuthCtx,
			{
				origins: ['SF', 'San Jose, CA'],
				destinations: ['Oakland', 'Berkeley'],
			},
		);
		expect(resMultiOrigin.rows).toHaveLength(2);
		expect((resMultiOrigin.rows![0] as any).elements[0].distance.value).toBe(
			1000,
		);
		expect((resMultiOrigin.rows![0] as any).elements[1].distance.value).toBe(
			2000,
		);
		expect((resMultiOrigin.rows![1] as any).elements[0].distance.value).toBe(
			3000,
		);
		expect((resMultiOrigin.rows![1] as any).elements[1].distance.value).toBe(
			4000,
		);

		mockedMakeRequest.mockResolvedValueOnce([
			{
				originIndex: 0,
				destinationIndex: 0,
				condition: 'ROUTE_EXISTS',
				distanceMeters: 1609,
				duration: '600s',
				status: { code: 0, message: 'OK' },
			},
		]);
		const resOptions = await plugin.endpoints!.routes.distanceMatrix(
			dummyOAuthCtx,
			{
				origins: 'SF',
				destinations: 'Oakland',
				units: 'imperial',
				departure_time: '1700000000',
			},
		);
		expect(resOptions.rows).toBeDefined();
		expect((resOptions.rows![0] as any).elements[0].status).toBe('OK');
		expect((resOptions.rows![0] as any).elements[0].distance.text).toBe(
			'1.0 mi',
		);
		expect(mockedMakeRequest).toHaveBeenLastCalledWith(
			'/distanceMatrix/v1:computeRouteMatrix',
			dummyOAuthCtx,
			expect.objectContaining({
				body: expect.objectContaining({
					departureTime: '2023-11-14T22:13:20.000Z',
				}),
			}),
		);
		const lastBody = mockedMakeRequest.mock.calls.at(-1)?.[2]?.body as Record<
			string,
			unknown
		>;
		expect(lastBody.units).toBeUndefined();
	});

	it('routes.getDirection calculates directions (api_key and oauth)', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			status: 'OK',
			routes: [{ summary: 'US-101 N' }],
		});

		const res = await plugin.endpoints!.routes.getDirection(dummyCtx, {
			origin: 'San Jose, CA',
			destination: 'San Francisco, CA',
		});

		expect(res.status).toBe('OK');

		// OAuth test
		mockedMakeRequest.mockResolvedValueOnce({
			routes: [{ legs: [] }],
		});
		const resOAuth = await plugin.endpoints!.routes.getDirection(
			dummyOAuthCtx,
			{
				origin: 'San Jose, CA',
				destination: 'San Francisco, CA',
			},
		);
		expect(resOAuth.status).toBe('OK');

		// OAuth with waypoints and avoid: forwarded to Routes API computeRoutes
		mockedMakeRequest.mockResolvedValueOnce({
			routes: [{ legs: [] }],
		});
		await plugin.endpoints!.routes.getDirection(dummyOAuthCtx, {
			origin: 'San Jose, CA',
			destination: 'San Francisco, CA',
			mode: 'driving',
			waypoints: ['Palo Alto, CA', 'Redwood City, CA'],
			avoid: 'tolls|highways',
		});
		expect(mockedMakeRequest).toHaveBeenLastCalledWith(
			'/directions/v2:computeRoutes',
			dummyOAuthCtx,
			expect.objectContaining({
				method: 'POST',
				baseUrl: 'https://routes.googleapis.com',
				body: expect.objectContaining({
					origin: { address: 'San Jose, CA' },
					destination: { address: 'San Francisco, CA' },
					travelMode: 'DRIVE',
					intermediates: [
						{ address: 'Palo Alto, CA' },
						{ address: 'Redwood City, CA' },
					],
					routeModifiers: {
						avoidTolls: true,
						avoidHighways: true,
					},
				}),
			}),
		);
	});

	it('routes.getRoute computes routes via Routes API', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			routes: [{ distanceMeters: 12000, duration: '900s' }],
		});

		const res = await plugin.endpoints!.routes.getRoute(dummyCtx, {
			origin: { location: { latLng: { latitude: 37.7, longitude: -122.4 } } },
			destination: {
				location: { latLng: { latitude: 37.8, longitude: -122.2 } },
			},
		});

		expect(res.routes).toBeDefined();
	});

	// Geocoding Endpoints (6)
	it('geocoding.geocodeAddress geocodes street address', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			status: 'OK',
			results: [
				{ formatted_address: '1600 Amphitheatre Pkwy, Mountain View, CA' },
			],
		});

		const res = await plugin.endpoints!.geocoding.geocodeAddress(dummyCtx, {
			address: '1600 Amphitheatre Pkwy, Mountain View, CA',
		});

		expect(res.status).toBe('OK');
	});

	it('geocoding.geocodeAddressWithQuery geocodes address with query', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			places: [{ formattedAddress: '1600 Amphitheatre Pkwy' }],
		});

		const res = await plugin.endpoints!.geocoding.geocodeAddressWithQuery(
			dummyCtx,
			{
				address: '1600 Amphitheatre Pkwy',
			},
		);

		expect(res.places).toBeDefined();
	});

	it('geocoding.geocodeDestinations looks up destination info', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			results: [{ place_id: 'dest_123' }],
		});

		const res = await plugin.endpoints!.geocoding.geocodeDestinations(
			dummyCtx,
			{
				address: 'Eiffel Tower, Paris',
			},
		);

		expect(res.results).toBeDefined();
	});

	it('geocoding.geocodePlace retrieves address by place_id', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			status: 'OK',
			results: [{ formatted_address: 'Paris, France' }],
		});

		const res = await plugin.endpoints!.geocoding.geocodePlace(dummyCtx, {
			place_id: 'ChIJD7fiBh9u5kcRYJSMaMOCCwQ',
		});

		expect(res.status).toBe('OK');
	});

	it('geocoding.geocodingApi handles forward & reverse geocoding', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			status: 'OK',
			results: [{ formatted_address: 'Tokyo, Japan' }],
		});

		const res = await plugin.endpoints!.geocoding.geocodingApi(dummyCtx, {
			address: 'Tokyo, Japan',
		});

		expect(res.status).toBe('OK');
	});

	it('geocoding.reverseGeocodeLocation reverse geocodes latlng', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			status: 'OK',
			results: [{ formatted_address: 'Googleplex, Mountain View, CA' }],
		});

		const res = await plugin.endpoints!.geocoding.reverseGeocodeLocation(
			dummyCtx,
			{
				latlng: '37.422,-122.084',
			},
		);

		expect(res.status).toBe('OK');
	});

	// Tiles Endpoints (4)
	it('tiles.createTilesSession initializes 2D tiles session', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			session: 'session_token_123',
			expiry: '1700000000',
		});

		const res = await plugin.endpoints!.tiles.createTilesSession(dummyCtx, {
			mapType: 'roadmap',
		});

		expect(res.session).toBe('session_token_123');
	});

	it('tiles.get2dTile generates tile image URL', async () => {
		const plugin = googlemaps();
		const res = await plugin.endpoints!.tiles.get2dTile(dummyCtx, {
			session: 'token_123',
			z: 10,
			x: 5,
			y: 8,
		});

		expect(res.tileUrl).toContain('2dtiles/10/5/8');
		expect(res.tileUrl).toContain('key=test_key');
	});

	it('tiles.get3dTilesRoot fetches 3D tiles root tileset', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			geometricError: 500,
			asset: { version: '1.0' },
		});

		const res = await plugin.endpoints!.tiles.get3dTilesRoot(dummyCtx, {});

		expect(res.geometricError).toBe(500);
	});

	it('tiles.embedMap generates embed URL with center, zoom, and maptype options', async () => {
		const plugin = googlemaps();
		const res = await plugin.endpoints!.tiles.embedMap(dummyCtx, {
			mode: 'place',
			q: 'Space Needle',
			center: '47.6205,-122.3493',
			zoom: 18,
			maptype: 'satellite',
		});

		expect(res.embedUrl).toContain('center=47.6205%2C-122.3493');
		expect(res.embedUrl).toContain('zoom=18');
		expect(res.embedUrl).toContain('maptype=satellite');
	});

	// Geolocation Endpoint (1)
	it('geolocation.geolocate determines device location', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			location: { lat: 37.422, lng: -122.084 },
			accuracy: 15,
		});

		const res = await plugin.endpoints!.geolocation.geolocate(dummyCtx, {
			carrier: 'T-Mobile',
		});

		expect(res.location.lat).toBe(37.422);
	});

	// Aerial Endpoints (2)
	it('aerial.lookupAerialVideo looks up aerial view video', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			state: 'ACTIVE',
			metadata: { videoId: 'video_123' },
		});

		const res = await plugin.endpoints!.aerial.lookupAerialVideo(dummyCtx, {
			videoId: 'video_123',
		});

		expect(mockedMakeRequest).toHaveBeenCalledWith(
			'/v1/videos:lookupVideoMetadata',
			dummyCtx,
			expect.objectContaining({ method: 'GET' }),
		);
		expect(res.state).toBe('ACTIVE');
	});

	it('aerial.renderAerialVideo starts rendering and supports polling lookup', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			state: 'PROCESSING',
			metadata: { videoId: 'video_id_999' },
		});

		const res = await plugin.endpoints!.aerial.renderAerialVideo(dummyCtx, {
			address: '1600 Amphitheatre Pkwy, Mountain View, CA',
		});

		expect(mockedMakeRequest).toHaveBeenCalledWith(
			'/v1/videos:renderVideo',
			dummyCtx,
			expect.objectContaining({ method: 'POST' }),
		);
		expect(res.metadata?.videoId).toBe('video_id_999');
		expect(res.state).toBe('PROCESSING');

		mockedMakeRequest.mockResolvedValueOnce({
			state: 'ACTIVE',
			metadata: { videoId: 'video_id_999' },
		});
		const lookup = await plugin.endpoints!.aerial.lookupAerialVideo(dummyCtx, {
			videoId: res.metadata!.videoId,
		});
		expect(lookup.state).toBe('ACTIVE');
		expect(mockedMakeRequest).toHaveBeenLastCalledWith(
			'/v1/videos:lookupVideoMetadata',
			dummyCtx,
			expect.objectContaining({
				query: expect.objectContaining({ videoId: 'video_id_999' }),
			}),
		);
	});

	it('preserves status code and retryAfter on GoogleMapsAPIError', () => {
		const error = new clientModule.GoogleMapsAPIError(
			'Resource exhausted',
			429,
			'RESOURCE_EXHAUSTED',
			5000,
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(5000);
	});

	it('rate limit handler does not double-convert retryAfter', async () => {
		const { errorHandlers } = await import('./error-handlers');
		const error = new clientModule.GoogleMapsAPIError(
			'Rate limited',
			429,
			'RESOURCE_EXHAUSTED',
			5000,
		);
		const result = await errorHandlers.RATE_LIMIT_ERROR.handler(error);
		expect(result.headersRetryAfterMs).toBe(5000);
	});
});
