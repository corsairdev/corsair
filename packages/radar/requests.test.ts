import * as Endpoints from './endpoints/endpoints';
import {
	ADDRESS,
	CONVERSION,
	GEOCODE_PAGE,
	GEOFENCE,
	GEOFENCE_ID,
	GEOFENCE_PAGE,
	GEOFENCE_PAGE_MORE,
	PLACE_PAGE,
	TRIP,
	TRIP_ID,
	TRIP_PAGE,
	USER,
	USER_PAGE,
	USER_RADAR_ID,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('geocode', () => {
	it('forward geocodes an address with layer and country filters', async () => {
		respond(fetchMock, GEOCODE_PAGE);

		const result = (await invoke(Endpoints.geocodeForward, {
			query: '20 Jay Street, Brooklyn',
			layers: ['address', 'place'],
			country: ['US', 'CA'],
		})) as Awaited<ReturnType<typeof Endpoints.geocodeForward>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/geocode/forward');
		expect(request.query).toEqual({
			query: '20 Jay Street, Brooklyn',
			layers: 'address,place',
			country: 'US,CA',
		});
		expect(result.addresses[0]?.confidence).toBe('exact');
		expect(result.addresses[0]?.formattedAddress).toBe(
			ADDRESS.formattedAddress,
		);
	});

	it('rejects an empty query before sending anything', async () => {
		await expect(
			invoke(Endpoints.geocodeForward, { query: '' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('reverse geocodes a coordinate pair', async () => {
		respond(fetchMock, GEOCODE_PAGE);

		await invoke(Endpoints.geocodeReverse, {
			coordinates: '40.70390,-73.98670',
		});

		expect(lastRequest(fetchMock).path).toBe('/v1/geocode/reverse');
		expect(lastRequest(fetchMock).query).toEqual({
			coordinates: '40.70390,-73.98670',
		});
	});
});

describe('search', () => {
	it('searches places near a point', async () => {
		respond(fetchMock, PLACE_PAGE);

		const result = (await invoke(Endpoints.searchPlaces, {
			near: '40.70390,-73.98670',
			radius: 1500,
			categories: ['coffee-shop'],
			limit: 10,
		})) as Awaited<ReturnType<typeof Endpoints.searchPlaces>>;

		expect(lastRequest(fetchMock).path).toBe('/v1/search/places');
		expect(lastRequest(fetchMock).query).toEqual({
			near: '40.70390,-73.98670',
			radius: '1500',
			categories: 'coffee-shop',
			limit: '10',
		});
		expect(result.places[0]?.name).toBe('Blue Bottle Coffee');
	});

	it('accepts the documented place chain metadata', async () => {
		respond(fetchMock, {
			places: [
				{
					name: 'Store',
					chain: {
						name: 'Store',
						slug: 'store',
						metadata: { customFlag: true },
					},
				},
			],
		});
		const result = await invoke(Endpoints.searchPlaces, {
			near: '40.7,-73.9',
			chains: ['store'],
		});
		expect(result).toMatchObject({
			places: [{ chain: { metadata: { customFlag: true } } }],
		});
	});

	it('rejects place searches without a chain or category', async () => {
		await expect(
			invoke(Endpoints.searchPlaces, { near: '40.7,-73.9' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it.each(['query', 'groups', 'country', 'lang'])(
		'rejects the unsupported place filter %s',
		async (field) => {
			await expect(
				invoke(Endpoints.searchPlaces, {
					near: '40.7,-73.9',
					categories: ['coffee-shop'],
					[field]: 'ignored',
				}),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('rejects the unsupported geofence externalIds filter', async () => {
		await expect(
			invoke(Endpoints.searchGeofences, {
				near: '40.7,-73.9',
				externalIds: ['ignored'],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('searches geofences near a point', async () => {
		respond(fetchMock, GEOFENCE_PAGE);

		await invoke(Endpoints.searchGeofences, {
			near: '40.70390,-73.98670',
			radius: 500,
			tags: ['store'],
		});

		expect(lastRequest(fetchMock).query).toEqual({
			near: '40.70390,-73.98670',
			radius: '500',
			tags: 'store',
		});
	});
});

describe('users', () => {
	it('lists users and reports hasMore', async () => {
		respond(fetchMock, USER_PAGE);

		const result = (await invoke(Endpoints.usersList, {
			limit: 10,
			updated_before: '2026-11-01T00:00:00.000Z',
		})) as Awaited<ReturnType<typeof Endpoints.usersList>>;

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/users');
		expect(request.query).toEqual({
			limit: '10',
			updatedBefore: '2026-11-01T00:00:00.000Z',
		});
		expect(result.users[0]?.userId).toBe('user-1');
		expect(result.has_more).toBe(true);
	});

	it('reads one user by each of the three ids', async () => {
		respond(fetchMock, { meta: { code: 200 }, user: USER });

		const result = (await invoke(Endpoints.usersGet, {
			user_id: 'C305F2DB-56DC-404F-B6C1-BC52F0B680D8',
		})) as Awaited<ReturnType<typeof Endpoints.usersGet>>;

		expect(lastRequest(fetchMock).path).toBe(
			'/v1/users/C305F2DB-56DC-404F-B6C1-BC52F0B680D8',
		);
		expect(result.user._id).toBe(USER_RADAR_ID);
		expect(result.user.location?.latitude).toBe(40.7039);
	});
});

describe('geofences', () => {
	it('lists geofences and stops paging when Radar says so', async () => {
		respond(fetchMock, GEOFENCE_PAGE);

		const result = (await invoke(Endpoints.geofencesList, {
			tag: 'store',
		})) as Awaited<ReturnType<typeof Endpoints.geofencesList>>;

		expect(lastRequest(fetchMock).path).toBe('/v1/geofences');
		expect(lastRequest(fetchMock).query).toEqual({ tag: 'store' });
		expect(result.geofences[0]?.externalId).toBe('store-42');
		expect(result.has_more).toBe(false);
	});

	it('reports has_more while Radar has more rows', async () => {
		respond(fetchMock, GEOFENCE_PAGE_MORE);

		const result = (await invoke(Endpoints.geofencesList, {})) as Awaited<
			ReturnType<typeof Endpoints.geofencesList>
		>;

		expect(result.has_more).toBe(true);
	});

	it('reads one geofence by id', async () => {
		respond(fetchMock, { meta: { code: 200 }, geofence: GEOFENCE });

		const result = (await invoke(Endpoints.geofencesGet, {
			geofence_id: GEOFENCE_ID,
		})) as Awaited<ReturnType<typeof Endpoints.geofencesGet>>;

		expect(result.geofence.geometryRadius).toBe(100);
		expect(result.geofence.metadata).toEqual({ offers: true });
	});

	it('upserts a circle by tag and external id', async () => {
		respond(fetchMock, { meta: { code: 200 }, geofence: GEOFENCE });

		const result = (await invoke(Endpoints.geofencesUpsert, {
			tag: 'store',
			external_id: 'store-42',
			description: 'Brooklyn store',
			type: 'circle',
			center: [-73.9867, 40.7039],
			radius: 100,
			metadata: { offers: true },
		})) as Awaited<ReturnType<typeof Endpoints.geofencesUpsert>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PUT');
		expect(request.path).toBe('/v1/geofences/store/store-42');
		expect(request.json()).toEqual({
			description: 'Brooklyn store',
			type: 'circle',
			coordinates: [-73.9867, 40.7039],
			radius: 100,
			metadata: { offers: true },
		});
		expect(result.geofence._id).toBe(GEOFENCE_ID);
	});

	it('upserts by Radar id when one is given', async () => {
		respond(fetchMock, { meta: { code: 200 }, geofence: GEOFENCE });

		await invoke(Endpoints.geofencesUpsert, {
			geofence_id: GEOFENCE_ID,
			tag: 'store',
			external_id: 'store-42',
			description: 'Brooklyn store',
			type: 'circle',
			address: '20 Jay Street, Brooklyn',
			radius: 100,
		});

		expect(lastRequest(fetchMock).path).toBe(`/v1/geofences/${GEOFENCE_ID}`);
	});

	it('sends a polygon ring rather than a centre', async () => {
		respond(fetchMock, { meta: { code: 200 }, geofence: GEOFENCE });

		await invoke(Endpoints.geofencesUpsert, {
			tag: 'zone',
			external_id: 'zone-1',
			description: 'A block',
			type: 'polygon',
			ring: [
				[-73.99, 40.7],
				[-73.98, 40.7],
				[-73.98, 40.71],
				[-73.99, 40.7],
			],
		});

		expect(lastRequest(fetchMock).json()).toMatchObject({
			type: 'polygon',
			coordinates: [
				[-73.99, 40.7],
				[-73.98, 40.7],
				[-73.98, 40.71],
				[-73.99, 40.7],
			],
		});
	});

	it('sends the required travel mode for an isochrone', async () => {
		respond(fetchMock, { geofence: GEOFENCE });
		await invoke(Endpoints.geofencesUpsert, {
			tag: 'zone',
			external_id: 'drive',
			description: 'Drive time',
			type: 'isochrone',
			center: [-73.9, 40.7],
			radius: 10,
			mode: 'car',
		});
		expect(lastRequest(fetchMock).json()).toMatchObject({
			mode: 'car',
			radius: 10,
		});
	});

	it('rejects an isochrone without its required travel mode', async () => {
		await expect(
			invoke(Endpoints.geofencesUpsert, {
				tag: 'zone',
				external_id: 'drive',
				description: 'Drive time',
				type: 'isochrone',
				center: [-73.9, 40.7],
				radius: 10,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a polygon with no ring', async () => {
		await expect(
			invoke(Endpoints.geofencesUpsert, {
				tag: 'zone',
				external_id: 'zone-1',
				description: 'A block',
				type: 'polygon',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a circle with no radius', async () => {
		await expect(
			invoke(Endpoints.geofencesUpsert, {
				tag: 'store',
				external_id: 'store-42',
				description: 'Store',
				type: 'circle',
				center: [-73.9867, 40.7039],
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('deletes a geofence and reports the id', async () => {
		respond(fetchMock, { meta: { code: 200 } });

		const result = (await invoke(Endpoints.geofencesDelete, {
			geofence_id: GEOFENCE_ID,
		})) as Awaited<ReturnType<typeof Endpoints.geofencesDelete>>;

		expect(lastRequest(fetchMock).method).toBe('DELETE');
		expect(result).toEqual({ success: true, geofence_id: GEOFENCE_ID });
	});
});

describe('trips', () => {
	it('lists trips with a comma-separated status list', async () => {
		respond(fetchMock, TRIP_PAGE);

		const result = (await invoke(Endpoints.tripsList, {
			status: ['started', 'approaching'],
			user_id: 'user-1',
		})) as Awaited<ReturnType<typeof Endpoints.tripsList>>;

		expect(lastRequest(fetchMock).query).toEqual({
			status: 'started,approaching',
			userId: 'user-1',
		});
		expect(result.trips[0]?.externalId).toBe('order-42');
	});

	it('pages trips by creation time', async () => {
		respond(fetchMock, TRIP_PAGE);
		await invoke(Endpoints.tripsList, {
			sort_by: 'createdAt',
			created_before: '2026-11-01T00:00:00.000Z',
		});
		expect(lastRequest(fetchMock).query).toEqual({
			sortBy: 'createdAt',
			createdBefore: '2026-11-01T00:00:00.000Z',
		});
	});

	it.each(['updated_before', 'updated_after'])(
		'rejects the undocumented trip cursor %s',
		async (field) => {
			await expect(
				invoke(Endpoints.tripsList, { [field]: '2026-11-01T00:00:00.000Z' }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('reads one trip with its ETA', async () => {
		respond(fetchMock, { meta: { code: 200 }, trip: TRIP });

		const result = (await invoke(Endpoints.tripsGet, {
			trip_id: TRIP_ID,
		})) as Awaited<ReturnType<typeof Endpoints.tripsGet>>;

		expect(result.trip.eta?.duration).toBe(600);
	});

	it('creates a trip for an order', async () => {
		respond(fetchMock, { meta: { code: 200 }, trip: TRIP });

		await invoke(Endpoints.tripsCreate, {
			external_id: 'order-42',
			user_id: 'user-1',
			destination_geofence_tag: 'store',
			destination_geofence_external_id: 'store-42',
			mode: 'car',
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			externalId: 'order-42',
			userId: 'user-1',
			destinationGeofenceTag: 'store',
			destinationGeofenceExternalId: 'store-42',
			mode: 'car',
		});
	});

	it('rejects a trip with no external id', async () => {
		await expect(invoke(Endpoints.tripsCreate, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates a trip status', async () => {
		respond(fetchMock, { meta: { code: 200 }, trip: TRIP });

		await invoke(Endpoints.tripsUpdate, {
			trip_id: TRIP_ID,
			status: 'arrived',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe(`/v1/trips/${TRIP_ID}/update`);
		expect(request.json()).toEqual({ status: 'arrived' });
	});

	it.each([undefined, 'expired'])(
		'rejects an invalid update status %s',
		async (status) => {
			await expect(
				invoke(Endpoints.tripsUpdate, { trip_id: TRIP_ID, status }),
			).rejects.toThrow();
			expect(fetchMock).not.toHaveBeenCalled();
		},
	);

	it('rejects a status Radar does not define', async () => {
		await expect(
			invoke(Endpoints.tripsUpdate, { trip_id: TRIP_ID, status: 'driving' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('track', () => {
	it('posts a location update with its device and accuracy', async () => {
		respond(fetchMock, {
			meta: { code: 200 },
			user: USER,
			events: [{ type: 'user.entered_geofence' }],
		});

		const result = (await invoke(Endpoints.track, {
			device_id: 'C305F2DB-56DC-404F-B6C1-BC52F0B680D8',
			latitude: 40.7039,
			longitude: -73.9867,
			accuracy: 10,
			user_id: 'user-1',
			device_type: 'iOS',
		})) as Awaited<ReturnType<typeof Endpoints.track>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/v1/track');
		expect(request.json()).toEqual({
			deviceId: 'C305F2DB-56DC-404F-B6C1-BC52F0B680D8',
			latitude: 40.7039,
			longitude: -73.9867,
			accuracy: 10,
			userId: 'user-1',
			deviceType: 'iOS',
		});
		expect(result.track.user?._id).toBe(USER_RADAR_ID);
		expect(result.track.events).toHaveLength(1);
	});

	it('rejects a latitude outside the valid range', async () => {
		await expect(
			invoke(Endpoints.track, {
				device_id: 'd',
				latitude: 91,
				longitude: 0,
				accuracy: 10,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an accuracy of zero, which Radar refuses', async () => {
		await expect(
			invoke(Endpoints.track, {
				device_id: 'd',
				latitude: 40,
				longitude: -73,
				accuracy: 0,
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('events.conversion', () => {
	it('logs a conversion with revenue', async () => {
		respond(fetchMock, { meta: { code: 200 }, event: CONVERSION });

		await invoke(Endpoints.eventsConversion, {
			name: 'in_app_purchase',
			user_id: 'user-1',
			revenue: 499,
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe('/v1/events');
		expect(request.json()).toEqual({
			name: 'in_app_purchase',
			userId: 'user-1',
			revenue: 499,
		});
	});

	it('rejects a name with a space, which Radar refuses', async () => {
		await expect(
			invoke(Endpoints.eventsConversion, {
				name: 'in app purchase',
				user_id: 'user-1',
			}),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a conversion with no identifier', async () => {
		await expect(
			invoke(Endpoints.eventsConversion, { name: 'signup' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('envelope handling', () => {
	it.each([
		[Endpoints.usersGet, { user_id: 'u' }],
		[Endpoints.geofencesGet, { geofence_id: 'g' }],
		[Endpoints.tripsGet, { trip_id: 't' }],
		[Endpoints.eventsConversion, { name: 'signup', user_id: 'u' }],
	])('rejects a response missing the named record', async (endpoint, input) => {
		respond(fetchMock, { meta: { code: 200 } });
		await expect(invoke(endpoint, input)).rejects.toThrow();
	});

	it('fails rather than inventing an empty list when the key is missing', async () => {
		respond(fetchMock, { meta: { code: 200 } });

		await expect(invoke(Endpoints.usersList, {})).rejects.toThrow();
	});
});
