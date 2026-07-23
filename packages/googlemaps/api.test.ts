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

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('initializes googlemaps plugin with api_key auth', () => {
		const plugin = googlemaps({ authType: 'api_key' });
		expect(plugin.id).toBe('googlemaps');
		expect(plugin.authConfig!.api_key).toBeDefined();
	});

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
		expect(mockedMakeRequest).toHaveBeenCalledWith(
			'/v1/places/ChIJN1t_tDeuEmsRUsoyG83frY4',
			dummyCtx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

	it('places.getPlacePhoto generates place photo URL', async () => {
		const plugin = googlemaps();
		const res = await plugin.endpoints!.places.getPlacePhoto(dummyCtx, {
			photo_reference: 'ref_12345',
			maxwidth: 400,
		});

		expect(res.photoUrl).toContain('ref_12345');
	});

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
		expect(mockedMakeRequest).toHaveBeenCalledWith(
			'/maps/api/geocode/json',
			dummyCtx,
			expect.objectContaining({ method: 'GET' }),
		);
	});

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

	it('aerial.renderAerialVideo starts rendering aerial view video', async () => {
		const plugin = googlemaps();
		mockedMakeRequest.mockResolvedValueOnce({
			id: 'video_id_999',
			state: 'PROCESSING',
		});

		const res = await plugin.endpoints!.aerial.renderAerialVideo(dummyCtx, {
			address: '1600 Amphitheatre Pkwy, Mountain View, CA',
		});

		expect(res.id).toBe('video_id_999');
	});

	it('preserves status code on GoogleMapsAPIError', () => {
		const error = new clientModule.GoogleMapsAPIError(
			'Resource exhausted',
			429,
			'RESOURCE_EXHAUSTED',
			10,
		);
		expect(error.status).toBe(429);
		expect(error.retryAfter).toBe(10);
	});
});
