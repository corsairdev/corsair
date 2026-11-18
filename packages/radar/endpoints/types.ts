import { z } from 'zod';

/** Radar caps a list at 1000 records and defaults to 100. */
export const RADAR_DEFAULT_LIMIT = 100;
export const RADAR_MAX_LIMIT = 1000;

const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(RADAR_MAX_LIMIT)
	.optional()
	.describe(
		`Records per page, 1 to ${RADAR_MAX_LIMIT}. Radar defaults to ${RADAR_DEFAULT_LIMIT}.`,
	);

/**
 * Radar's list cursor is a **date**, not a token: pass the last record's
 * `updatedAt` (or `createdAt`) as `updatedBefore` and the next page continues
 * from there. There is no opaque cursor anywhere in the API.
 */
const BeforeSchema = z
	.string()
	.optional()
	.describe(
		'A date or ISO string: return records updated before it. Pass the last row’s timestamp to page.',
	);
const AfterSchema = z
	.string()
	.optional()
	.describe('A date or ISO string: return records updated after it.');

const pagingFields = {
	has_more: z
		.boolean()
		.describe(
			'True when Radar supplies meta.hasMore. Users and geofences page with updated_before; trips use created_before and sort_by: createdAt.',
		),
	meta: z
		.object({
			code: z.number().nullish(),
			hasMore: z.boolean().nullish(),
		})
		.loose()
		.nullish(),
};

/** The `meta` object every Radar response carries. */
export const EnvelopeMetaSchema = z
	.object({
		code: z.number().nullish(),
		hasMore: z.boolean().nullish(),
		message: z.string().nullish(),
		param: z.string().nullish(),
	})
	.loose();

// ── shared output pieces ──────────────────────────────────────────────────

/**
 * Radar's metadata map: up to 32 keys whose values are strings, booleans or
 * numbers, which is exactly what the docs pin.
 */
export const MetadataSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean()]),
);

/** One point on a trip's location trace. */
export const TripLocationSchema = z
	.object({
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		accuracy: z.number().nullish(),
		speed: z.number().nullish(),
		altitude: z.number().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

/** A geofence event as `track` reports one, reduced to what it names. */
export const TrackEventSchema = z
	.object({
		_id: z.string().nullish(),
		type: z.string().nullish(),
		createdAt: z.string().nullish(),
		live: z.boolean().nullish(),
		geofenceId: z.string().nullish(),
		userId: z.string().nullish(),
	})
	.loose();

/** A GeoJSON point, as Radar returns a resolved coordinate. */
export const GeometrySchema = z
	.object({
		type: z.string().nullish(),
		coordinates: z.array(z.number()).nullish(),
	})
	.loose();

/** A resolved address, which every geocode and search answer contains. */
export const AddressSchema = z
	.object({
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		geometry: GeometrySchema.nullish(),
		addressLabel: z.string().nullish(),
		formattedAddress: z.string().nullish(),
		country: z.string().nullish(),
		countryCode: z.string().nullish(),
		countryFlag: z.string().nullish(),
		state: z.string().nullish(),
		stateCode: z.string().nullish(),
		postalCode: z.string().nullish(),
		city: z.string().nullish(),
		county: z.string().nullish(),
		number: z.string().nullish(),
		street: z.string().nullish(),
		layer: z.string().nullish(),
		distance: z.number().nullish(),
		confidence: z
			.string()
			.nullish()
			.describe('`exact`, `interpolated` or `fallback`.'),
	})
	.loose();

export type RadarAddress = z.infer<typeof AddressSchema>;

// ── geocode ───────────────────────────────────────────────────────────────

const GeocodeLayersSchema = z
	.array(
		z.enum([
			'place',
			'address',
			'postalCode',
			'locality',
			'county',
			'state',
			'country',
			'coarse',
			'fine',
		]),
	)
	.optional()
	.describe(
		'Layer filters, sent comma-separated. `coarse` covers every admin layer and `fine` the address and place layers.',
	);

const GeocodeForwardInputSchema = z.object({
	query: z.string().min(1).describe('The address to geocode.'),
	layers: GeocodeLayersSchema,
	country: z
		.array(z.string())
		.optional()
		.describe('Two-letter country codes to restrict the search to.'),
	lang: z
		.enum([
			'ar',
			'de',
			'en',
			'es',
			'fr',
			'it',
			'ja',
			'ko',
			'nl',
			'pt',
			'ru',
			'zh',
		])
		.optional(),
});

export type GeocodeForwardInput = z.input<typeof GeocodeForwardInputSchema>;

const GeocodeForwardResponseSchema = z.object({
	addresses: z.array(AddressSchema),
});

export type GeocodeForwardResponse = z.infer<
	typeof GeocodeForwardResponseSchema
>;

const GeocodeReverseInputSchema = z.object({
	coordinates: z
		.string()
		.min(1)
		.describe('`latitude,longitude`, such as `40.70390,-73.98670`.'),
	layers: GeocodeLayersSchema,
});

export type GeocodeReverseInput = z.input<typeof GeocodeReverseInputSchema>;

const GeocodeReverseResponseSchema = z.object({
	addresses: z.array(AddressSchema),
});

export type GeocodeReverseResponse = z.infer<
	typeof GeocodeReverseResponseSchema
>;

// ── search ────────────────────────────────────────────────────────────────

const SearchPlacesInputSchema = z
	.strictObject({
		near: z
			.string()
			.min(1)
			.describe('`latitude,longitude` for the search centre.'),
		chains: z.array(z.string().min(1)).min(1).optional(),
		categories: z.array(z.string().min(1)).min(1).optional(),
		radius: z.number().min(1).max(10000).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.refine(
		(value) => value.chains !== undefined || value.categories !== undefined,
		{
			message: 'A place search needs `chains` or `categories`.',
		},
	);

export type SearchPlacesInput = z.input<typeof SearchPlacesInputSchema>;

const PlaceSchema = z
	.object({
		_id: z.string().nullish(),
		name: z.string().nullish(),
		location: GeometrySchema.nullish(),
		categories: z.array(z.string()).nullish(),
		chain: z
			.object({
				name: z.string().nullish(),
				slug: z.string().nullish(),
				externalId: z.string().nullish(),
				metadata: MetadataSchema.nullish(),
			})
			.loose()
			.nullish(),
		address: AddressSchema.nullish(),
	})
	.loose();

export type RadarPlace = z.infer<typeof PlaceSchema>;

const SearchPlacesResponseSchema = z.object({
	places: z.array(PlaceSchema),
	meta: EnvelopeMetaSchema.nullish(),
});

export type SearchPlacesResponse = z.infer<typeof SearchPlacesResponseSchema>;

const SearchGeofencesInputSchema = z.strictObject({
	near: z
		.string()
		.min(1)
		.describe('`latitude,longitude` for the search centre.'),
	radius: z.number().positive().optional().describe('Search radius in meters.'),
	tags: z.array(z.string()).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

export type SearchGeofencesInput = z.input<typeof SearchGeofencesInputSchema>;

const GeofenceSchema = z
	.object({
		_id: z.string().nullish(),
		live: z.boolean().nullish(),
		tag: z.string().nullish(),
		externalId: z.string().nullish(),
		description: z.string().nullish(),
		type: z.string().nullish(),
		geometryType: z.string().nullish(),
		geometryRadius: z.number().nullish(),
		geometryCenter: GeometrySchema.nullish(),
		geometryCoordinates: z.array(z.array(z.number())).nullish(),
		metadata: MetadataSchema.nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type RadarGeofence = z.infer<typeof GeofenceSchema>;

const SearchGeofencesResponseSchema = z.object({
	geofences: z.array(GeofenceSchema),
	meta: EnvelopeMetaSchema.nullish(),
});

export type SearchGeofencesResponse = z.infer<
	typeof SearchGeofencesResponseSchema
>;

// ── users ─────────────────────────────────────────────────────────────────

const UsersListInputSchema = z.object({
	limit: LimitSchema,
	updated_before: BeforeSchema,
	updated_after: AfterSchema,
});

export type UsersListInput = z.input<typeof UsersListInputSchema>;

const UserSchema = z
	.object({
		_id: z.string().nullish(),
		live: z.boolean().nullish(),
		userId: z.string().nullish(),
		deviceId: z.string().nullish(),
		description: z.string().nullish(),
		deviceType: z.string().nullish(),
		platform: z.string().nullish(),
		foreground: z.boolean().nullish(),
		stopped: z.boolean().nullish(),
		location: z
			.object({
				latitude: z.number().nullish(),
				longitude: z.number().nullish(),
				accuracy: z.number().nullish(),
				speed: z.number().nullish(),
				altitude: z.number().nullish(),
				updatedAt: z.string().nullish(),
			})
			.loose()
			.nullish(),
		geofences: z.array(GeofenceSchema).nullish(),
		metadata: MetadataSchema.nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
	})
	.loose();

export type RadarUser = z.infer<typeof UserSchema>;

const UsersListResponseSchema = z.object({
	users: z.array(UserSchema),
	...pagingFields,
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UsersGetInputSchema = z.object({
	user_id: z
		.string()
		.min(1)
		.describe('A Radar `_id`, `userId` or `deviceId`; all three resolve.'),
});

export type UsersGetInput = z.input<typeof UsersGetInputSchema>;

const UsersGetResponseSchema = z.object({ user: UserSchema });
export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

// ── geofences ─────────────────────────────────────────────────────────────

const GeofencesListInputSchema = z.object({
	limit: LimitSchema,
	updated_before: BeforeSchema,
	updated_after: AfterSchema,
	tag: z.string().optional(),
	external_id: z.string().optional(),
});

export type GeofencesListInput = z.input<typeof GeofencesListInputSchema>;

const GeofencesListResponseSchema = z.object({
	geofences: z.array(GeofenceSchema),
	...pagingFields,
});

export type GeofencesListResponse = z.infer<typeof GeofencesListResponseSchema>;

const GeofencesGetInputSchema = z.object({
	geofence_id: z.string().min(1).describe('The Radar `_id` of the geofence.'),
});

export type GeofencesGetInput = z.input<typeof GeofencesGetInputSchema>;

const GeofencesGetResponseSchema = z.object({ geofence: GeofenceSchema });
export type GeofencesGetResponse = z.infer<typeof GeofencesGetResponseSchema>;

/**
 * A circle takes a centre and a radius; a polygon takes a closed ring. Radar
 * requires `coordinates` unless an `address` is given, and the two are
 * mutually exclusive per type, so the schema enforces the pairing rather than
 * letting the API answer 400.
 */
const GeofencesUpsertInputSchema = z
	.object({
		/** When omitted, the tag and external id come from the path. */
		geofence_id: z
			.string()
			.optional()
			.describe(
				'Radar `_id`, for an update by id rather than by tag and external id.',
			),
		tag: z.string().min(1).describe('The geofence group.'),
		external_id: z.string().min(1).describe('A stable id within the tag.'),
		description: z.string().min(1),
		// The docs validator needs a string type beside its bare enum labels.
		type: z.enum(['circle', 'polygon', 'isochrone']).and(z.string()),
		mode: z
			.enum(['foot', 'bike', 'car'])
			.optional()
			.describe('Required travel mode for an isochrone.'),
		radius: z
			.number()
			.positive()
			.optional()
			.describe(
				'Required for circle in meters, or isochrone in travel minutes.',
			),
		center: z
			.array(z.number())
			.length(2)
			.optional()
			.describe('[longitude, latitude] for a circle or isochrone.'),
		ring: z
			.array(z.array(z.number()).length(2))
			.min(4)
			.optional()
			.describe(
				'A closed ring of [longitude, latitude] pairs for a polygon, first point repeated last.',
			),
		address: z.string().optional(),
		metadata: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional(),
	})
	.superRefine((value, ctx) => {
		if (value.type === 'isochrone' && !value.mode) {
			ctx.addIssue({
				code: 'custom',
				message: 'An isochrone needs a travel `mode`.',
				path: ['mode'],
			});
		}
		if (value.type === 'polygon' && !value.ring) {
			ctx.addIssue({
				code: 'custom',
				message: 'A polygon needs a `ring` of at least four points.',
				path: ['ring'],
			});
		}
		if (value.type !== 'polygon' && !value.center && !value.address) {
			ctx.addIssue({
				code: 'custom',
				message: 'A circle or isochrone needs a `center` or an `address`.',
				path: ['center'],
			});
		}
		if (value.type !== 'polygon' && !value.radius) {
			ctx.addIssue({
				code: 'custom',
				message: 'A circle or isochrone needs a `radius`.',
				path: ['radius'],
			});
		}
	});

export type GeofencesUpsertInput = z.input<typeof GeofencesUpsertInputSchema>;

const GeofencesUpsertResponseSchema = z.object({ geofence: GeofenceSchema });
export type GeofencesUpsertResponse = z.infer<
	typeof GeofencesUpsertResponseSchema
>;

const GeofencesDeleteInputSchema = z.object({
	geofence_id: z.string().min(1),
});

export type GeofencesDeleteInput = z.input<typeof GeofencesDeleteInputSchema>;

const GeofencesDeleteResponseSchema = z.object({
	success: z.boolean(),
	geofence_id: z.string(),
});

export type GeofencesDeleteResponse = z.infer<
	typeof GeofencesDeleteResponseSchema
>;

// ── trips ─────────────────────────────────────────────────────────────────

const TripsListInputSchema = z.strictObject({
	limit: LimitSchema,
	status: z
		.array(
			z.enum([
				'pending',
				'started',
				'approaching',
				'arrived',
				'completed',
				'canceled',
				'expired',
			]),
		)
		.optional()
		.describe('Sent comma-separated.'),
	user_id: z.string().optional().describe('The Radar `_id` of the user.'),
	external_id: z.array(z.string()).optional(),
	destination_geofence_tag: z.string().optional(),
	destination_geofence_external_id: z.string().optional(),
	include_locations: z.boolean().optional(),
	created_after: z.string().optional(),
	created_before: z.string().optional(),
	sort_by: z.enum(['createdAt', 'updatedAt']).optional(),
	delayed: z.boolean().optional(),
});

export type TripsListInput = z.input<typeof TripsListInputSchema>;

const TripSchema = z
	.object({
		_id: z.string().nullish(),
		live: z.boolean().nullish(),
		externalId: z.string().nullish(),
		status: z.string().nullish(),
		mode: z.string().nullish(),
		userId: z.string().nullish(),
		deviceId: z.string().nullish(),
		destinationGeofenceTag: z.string().nullish(),
		destinationGeofenceExternalId: z.string().nullish(),
		destinationLocation: GeometrySchema.nullish(),
		eta: z
			.object({
				duration: z.number().nullish(),
				distance: z.number().nullish(),
			})
			.loose()
			.nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		locations: z
			.array(TripLocationSchema)
			.nullish()
			.describe('Present only when `include_locations` was set.'),
	})
	.loose();

export type RadarTrip = z.infer<typeof TripSchema>;

const TripsListResponseSchema = z.object({
	trips: z.array(TripSchema),
	...pagingFields,
});

export type TripsListResponse = z.infer<typeof TripsListResponseSchema>;

const TripsGetInputSchema = z.object({
	trip_id: z.string().min(1).describe('The Radar `_id` of the trip.'),
});

export type TripsGetInput = z.input<typeof TripsGetInputSchema>;

const TripsGetResponseSchema = z.object({ trip: TripSchema });
export type TripsGetResponse = z.infer<typeof TripsGetResponseSchema>;

const TripsCreateInputSchema = z.object({
	external_id: z
		.string()
		.min(1)
		.describe('A stable id for the trip, such as an order id.'),
	mode: z.enum(['foot', 'bike', 'car']).optional(),
	user_id: z
		.string()
		.optional()
		.describe("The user's external id, as tracked by the SDK."),
	destination_geofence_tag: z.string().optional(),
	destination_geofence_external_id: z.string().optional(),
	approaching_threshold: z.number().int().optional(),
	scheduled_arrival_at: z.string().optional(),
});

export type TripsCreateInput = z.input<typeof TripsCreateInputSchema>;

const TripsCreateResponseSchema = z.object({ trip: TripSchema });
export type TripsCreateResponse = z.infer<typeof TripsCreateResponseSchema>;

const TripsUpdateInputSchema = z.object({
	trip_id: z.string().min(1),
	status: z.enum([
		'pending',
		'started',
		'approaching',
		'arrived',
		'completed',
		'canceled',
	]),
	mode: z.enum(['foot', 'bike', 'car']).optional(),
	destination_geofence_tag: z.string().optional(),
	destination_geofence_external_id: z.string().optional(),
	approaching_threshold: z.number().int().optional(),
	scheduled_arrival_at: z.string().optional(),
});

export type TripsUpdateInput = z.input<typeof TripsUpdateInputSchema>;

const TripsUpdateResponseSchema = z.object({ trip: TripSchema });
export type TripsUpdateResponse = z.infer<typeof TripsUpdateResponseSchema>;

// ── track ─────────────────────────────────────────────────────────────────

/**
 * The write that creates or updates a user. `track` is how a location update
 * enters Radar from a server, so it is the only route that needs a device id and
 * coordinates together.
 */
const TrackInputSchema = z.object({
	device_id: z
		.string()
		.min(1)
		.describe('The device identifier; Radar keys a logged-out user by it.'),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	accuracy: z
		.number()
		.positive()
		.describe(
			'The accuracy in meters. Radar uses it to decide geofence confidence.',
		),
	user_id: z
		.string()
		.optional()
		.describe(
			'A stable user id. With `device_id` it identifies a logged-in user; a new one is created when none matches.',
		),
	foreground: z.boolean().optional(),
	stopped: z.boolean().optional(),
	description: z.string().optional(),
	device_type: z.enum(['iOS', 'Android', 'Web']).optional(),
	device_os: z.string().optional(),
	device_make: z.string().optional(),
	device_model: z.string().optional(),
	altitude: z.number().optional(),
	vertical_accuracy: z.number().optional(),
	updated_at: z.string().optional(),
	replayed: z.boolean().optional(),
	metadata: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional()
		.describe('Up to 32 keys of your own user attributes.'),
});

export type TrackInput = z.input<typeof TrackInputSchema>;

const TrackResponseSchema = z.object({
	track: z.object({
		user: UserSchema.nullish(),
		events: z.array(TrackEventSchema).nullish(),
	}),
});

export type TrackResponse = z.infer<typeof TrackResponseSchema>;

// ── events.conversion ─────────────────────────────────────────────────────

/**
 * Logs a conversion beside a user's location activity. The name is restricted to
 * letters, digits and underscores, which the schema pins.
 */
const EventsConversionInputSchema = z
	.object({
		name: z
			.string()
			.min(1)
			.regex(
				/^[A-Za-z0-9_]+$/,
				'A conversion name may only contain letters, digits and underscores.',
			)
			.describe('A generic name, such as `in_app_purchase`.'),
		user_id: z.string().optional(),
		device_id: z.string().optional(),
		install_id: z.string().optional(),
		revenue: z.number().optional(),
		created_at: z.string().optional(),
		metadata: z
			.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
			.optional(),
	})
	.superRefine((value, ctx) => {
		// Radar needs at least one identifier to attribute the conversion.
		if (
			value.user_id === undefined &&
			value.device_id === undefined &&
			value.install_id === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				message: 'Provide `user_id`, `device_id` or `install_id`.',
				path: ['user_id'],
			});
		}
	});

export type EventsConversionInput = z.input<typeof EventsConversionInputSchema>;

const EventsConversionResponseSchema = z.object({
	event: z.object({
		_id: z.string().nullish(),
		name: z.string().nullish(),
		userId: z.string().nullish(),
		createdAt: z.string().nullish(),
	}),
});

export type EventsConversionResponse = z.infer<
	typeof EventsConversionResponseSchema
>;

// ── Registry ──────────────────────────────────────────────────────────────

export type RadarEndpointInputs = {
	geocodeForward: GeocodeForwardInput;
	geocodeReverse: GeocodeReverseInput;
	searchPlaces: SearchPlacesInput;
	searchGeofences: SearchGeofencesInput;
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	geofencesList: GeofencesListInput;
	geofencesGet: GeofencesGetInput;
	geofencesUpsert: GeofencesUpsertInput;
	geofencesDelete: GeofencesDeleteInput;
	tripsList: TripsListInput;
	tripsGet: TripsGetInput;
	tripsCreate: TripsCreateInput;
	tripsUpdate: TripsUpdateInput;
	track: TrackInput;
	eventsConversion: EventsConversionInput;
};

export type RadarEndpointOutputs = {
	geocodeForward: GeocodeForwardResponse;
	geocodeReverse: GeocodeReverseResponse;
	searchPlaces: SearchPlacesResponse;
	searchGeofences: SearchGeofencesResponse;
	usersList: UsersListResponse;
	usersGet: UsersGetResponse;
	geofencesList: GeofencesListResponse;
	geofencesGet: GeofencesGetResponse;
	geofencesUpsert: GeofencesUpsertResponse;
	geofencesDelete: GeofencesDeleteResponse;
	tripsList: TripsListResponse;
	tripsGet: TripsGetResponse;
	tripsCreate: TripsCreateResponse;
	tripsUpdate: TripsUpdateResponse;
	track: TrackResponse;
	eventsConversion: EventsConversionResponse;
};

export const RadarEndpointInputSchemas = {
	geocodeForward: GeocodeForwardInputSchema,
	geocodeReverse: GeocodeReverseInputSchema,
	searchPlaces: SearchPlacesInputSchema,
	searchGeofences: SearchGeofencesInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	geofencesList: GeofencesListInputSchema,
	geofencesGet: GeofencesGetInputSchema,
	geofencesUpsert: GeofencesUpsertInputSchema,
	geofencesDelete: GeofencesDeleteInputSchema,
	tripsList: TripsListInputSchema,
	tripsGet: TripsGetInputSchema,
	tripsCreate: TripsCreateInputSchema,
	tripsUpdate: TripsUpdateInputSchema,
	track: TrackInputSchema,
	eventsConversion: EventsConversionInputSchema,
} as const;

export const RadarEndpointOutputSchemas = {
	geocodeForward: GeocodeForwardResponseSchema,
	geocodeReverse: GeocodeReverseResponseSchema,
	searchPlaces: SearchPlacesResponseSchema,
	searchGeofences: SearchGeofencesResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UsersGetResponseSchema,
	geofencesList: GeofencesListResponseSchema,
	geofencesGet: GeofencesGetResponseSchema,
	geofencesUpsert: GeofencesUpsertResponseSchema,
	geofencesDelete: GeofencesDeleteResponseSchema,
	tripsList: TripsListResponseSchema,
	tripsGet: TripsGetResponseSchema,
	tripsCreate: TripsCreateResponseSchema,
	tripsUpdate: TripsUpdateResponseSchema,
	track: TrackResponseSchema,
	eventsConversion: EventsConversionResponseSchema,
} as const;
