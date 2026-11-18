import { z } from 'zod';

// Inputs use NiftyImages' own query parameter names, which are camelCase
// (`startDate`, `endDate`). Outputs are `.loose()` and their documented fields
// nullish, so a field NiftyImages adds cannot fail a call that has already
// happened.
//
// Every date, in and out, is ISO 8601 as the docs specify: `2016-03-12T12:00Z`.

/** An ISO 8601 instant, which is the only date form the API accepts. */
const InstantSchema = z
	.string()
	.min(1)
	.describe('An ISO 8601 instant, e.g. 2016-03-12T08:00Z.');

const WidgetKeySchema = z
	.string()
	.min(1)
	.describe('The widget key, a GUID from widgets.list.');

/**
 * The time window every stats call takes. Both bounds are optional at the API,
 * and the docs do not say what a missing bound means, so they are passed
 * through as given.
 */
const WindowSchema = {
	startDate: InstantSchema.optional().describe('The first instant to include.'),
	endDate: InstantSchema.optional().describe('The last instant to include.'),
};

// ── widgets.list ──────────────────────────────────────────────────────────

const WidgetsListInputSchema = z.object({
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetsListInput = z.input<typeof WidgetsListInputSchema>;

const WidgetSchema = z
	.object({ Name: z.string().nullish(), WidgetKey: z.string().nullish() })
	.loose();

export type NiftyimagesWidget = z.infer<typeof WidgetSchema>;

const WidgetsListResponseSchema = z.object({
	widgets: z.array(WidgetSchema),
});

export type WidgetsListResponse = z.infer<typeof WidgetsListResponseSchema>;

// ── widgets.stats ─────────────────────────────────────────────────────────

const WidgetsStatsInputSchema = z.object({
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetsStatsInput = z.input<typeof WidgetsStatsInputSchema>;

/**
 * A stats row is a per-widget tally. The counts are all optional because an
 * unused widget reports zeroes and, on some plans, omits a metric entirely.
 */
const WidgetStatsSchema = z
	.object({
		WidgetKey: z.string().nullish(),
		Name: z.string().nullish(),
		Active: z.boolean().nullish(),
		Users: z.number().nullish(),
		Images: z.number().nullish(),
		Impressions: z.number().nullish(),
	})
	.loose();

export type NiftyimagesWidgetStats = z.infer<typeof WidgetStatsSchema>;

const WidgetsStatsResponseSchema = z.object({
	stats: z.array(WidgetStatsSchema),
});

export type WidgetsStatsResponse = z.infer<typeof WidgetsStatsResponseSchema>;

// ── widgets.users ─────────────────────────────────────────────────────────

const WidgetUsersInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetUsersInput = z.input<typeof WidgetUsersInputSchema>;

const WidgetUserSchema = z
	.object({
		User: z.string().nullish(),
		Images: z.number().nullish(),
		Impressions: z.number().nullish(),
		Suspended: z.boolean().nullish(),
	})
	.loose();

export type NiftyimagesWidgetUser = z.infer<typeof WidgetUserSchema>;

const WidgetUsersResponseSchema = z.object({
	users: z.array(WidgetUserSchema),
});

export type WidgetUsersResponse = z.infer<typeof WidgetUsersResponseSchema>;

// ── widgets.userStats ─────────────────────────────────────────────────────

const WidgetUserStatsInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	user: z
		.string()
		.min(1)
		.describe('The user id or email the widget recorded for the recipient.'),
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetUserStatsInput = z.input<typeof WidgetUserStatsInputSchema>;

const UserStatsSchema = z
	.object({
		User: z.string().nullish(),
		Images: z.number().nullish(),
		Impressions: z.number().nullish(),
		Suspended: z.boolean().nullish(),
	})
	.loose();

export type NiftyimagesUserStats = z.infer<typeof UserStatsSchema>;

const WidgetUserStatsResponseSchema = z.object({
	stats: UserStatsSchema,
});

export type WidgetUserStatsResponse = z.infer<
	typeof WidgetUserStatsResponseSchema
>;

// ── widgets.images ────────────────────────────────────────────────────────

const WidgetImagesInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetImagesInput = z.input<typeof WidgetImagesInputSchema>;

const WidgetImageSchema = z
	.object({
		ImageID: z.union([z.number(), z.string()]).nullish(),
		ImageType: z.string().nullish(),
		Name: z.string().nullish(),
		User: z.string().nullish(),
		Impressions: z.number().nullish(),
		Suspended: z.boolean().nullish(),
		Uri: z.string().nullish(),
	})
	.loose();

export type NiftyimagesWidgetImage = z.infer<typeof WidgetImageSchema>;

const WidgetImagesResponseSchema = z.object({
	images: z.array(WidgetImageSchema),
});

export type WidgetImagesResponse = z.infer<typeof WidgetImagesResponseSchema>;

// ── widgets.userImages ────────────────────────────────────────────────────

const WidgetUserImagesInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	user: z.string().min(1).describe('The user id or email to read images for.'),
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetUserImagesInput = z.input<typeof WidgetUserImagesInputSchema>;

export type WidgetUserImagesResponse = WidgetImagesResponse;

// ── shared shapes for the account-wide calls ──────────────────────────────

/** A NiftyImages image URL, e.g. https://img1.niftyimages.com/p/lop/m7w. */
const ImageUrlSchema = z
	.string()
	.min(1)
	.describe(
		'The image URL from NiftyImages, e.g. https://img1.niftyimages.com/p/lop/m7w.',
	);

/** Any 2xx with no body: NiftyImages documents an empty 200 for these. */
const DoneSchema = z.object({ success: z.literal(true) });

export type NiftyimagesDone = z.infer<typeof DoneSchema>;

// The docs show Opens as a string in lists and a number on a single image.
const CountSchema = z.union([z.number(), z.string()]).nullish();

const ImageSchema = z
	.object({
		Name: z.string().nullish(),
		Url: z.string().nullish(),
		Opens: CountSchema,
		Clicks: CountSchema,
		ImageType: z.string().nullish(),
		CreateDate: z.string().nullish(),
		LastUpdated: z.string().nullish(),
		Active: z.boolean().nullish(),
	})
	.loose();

export type NiftyimagesImage = z.infer<typeof ImageSchema>;

const ImagesResponseSchema = z.object({ images: z.array(ImageSchema) });

export type ImagesResponse = z.infer<typeof ImagesResponseSchema>;

const ByUrlInputSchema = z.object({ url: ImageUrlSchema });

export type ByUrlInput = z.input<typeof ByUrlInputSchema>;

// ── store.* ───────────────────────────────────────────────────────────────

const StoreFieldsInputSchema = z.object({});

export type StoreFieldsInput = z.input<typeof StoreFieldsInputSchema>;

const StoreFieldSchema = z
	.object({
		name: z.string().nullish(),
		type: z.string().nullish(),
		unique: z.boolean().nullish(),
		date_input_format: z.string().nullish(),
	})
	.loose();

const StoreFieldsResponseSchema = z.object({
	fields: z.array(StoreFieldSchema),
});

export type StoreFieldsResponse = z.infer<typeof StoreFieldsResponseSchema>;

// unknown: a Data Store record's keys are the store's own field names, and
// NiftyImages ignores keys that are not fields.
const StoreRecordSchema = z.record(z.string(), z.unknown());

const StoreRecordInputSchema = z.object({
	record: StoreRecordSchema.refine((r) => Object.keys(r).length > 0, {
		message: 'A record needs at least one field.',
	}).describe(
		'The record, keyed by Data Store field name (see store.fields). A record whose unique fields match an existing one updates it.',
	),
});

export type StoreRecordInput = z.input<typeof StoreRecordInputSchema>;

const StoreAddRecordResponseSchema = z.object({ record: StoreRecordSchema });

export type StoreAddRecordResponse = z.infer<
	typeof StoreAddRecordResponseSchema
>;

const StoreDeleteByIdInputSchema = z.object({
	id: z
		.union([z.string().min(1), z.number()])
		.describe('The record id: the value of its unique field.'),
});

export type StoreDeleteByIdInput = z.input<typeof StoreDeleteByIdInputSchema>;

// ── timers.updateTargetDate ───────────────────────────────────────────────

const TimerUpdateInputSchema = z.object({
	TimerImageUrl: ImageUrlSchema.describe('The countdown timer image URL.'),
	TargetDate: z
		.string()
		.min(1)
		.describe('The new date to count down to, ISO 8601 unless Format is set.'),
	Format: z
		.string()
		.min(1)
		.optional()
		.describe('The date format of TargetDate when it is not ISO 8601.'),
	IsUtc: z
		.boolean()
		.optional()
		.describe("True to convert TargetDate into the timer's own time zone."),
	AddHours: z.number().int().optional(),
	AddDays: z.number().int().optional(),
	AddMonths: z.number().int().optional(),
});

export type TimerUpdateInput = z.input<typeof TimerUpdateInputSchema>;

const TimerUpdateResponseSchema = z
	.object({
		TimerImageUrl: z.string().nullish(),
		TimerTimezone: z.string().nullish(),
		UpdatedTargetUtc: z.string().nullish(),
		UpdatedTargetTimezone: z.string().nullish(),
	})
	.loose();

export type TimerUpdateResponse = z.infer<typeof TimerUpdateResponseSchema>;

// ── maps.* ────────────────────────────────────────────────────────────────

const MapsListInputSchema = z.object({});

export type MapsListInput = z.input<typeof MapsListInputSchema>;

const MapDetailsSchema = z
	.object({
		Url: z.string().nullish(),
		Name: z.string().nullish(),
		LocationsGood: z.number().nullish(),
		LocationsBad: z.number().nullish(),
		LocationsNotProcessed: z.number().nullish(),
		Opens: CountSchema,
		Clicks: CountSchema,
		CreateDate: z.string().nullish(),
		LastUpdated: z.string().nullish(),
	})
	.loose();

export type MapDetailsResponse = z.infer<typeof MapDetailsSchema>;

const PropertySchema = z.object({
	Name: z.string().min(1),
	Value: z.string(),
});

const LocationSchema = z
	.object({
		NiftyID: z.string().nullish(),
		LocationID: z.union([z.string(), z.number()]).nullish(),
		Address: z.string().nullish(),
		Latitude: z.number().nullish(),
		Longitude: z.number().nullish(),
		Properties: z
			.array(
				z
					.object({ Name: z.string().nullish(), Value: z.string().nullish() })
					.loose(),
			)
			.nullish(),
	})
	.loose();

const MapSearchInputSchema = z
	.object({
		url: ImageUrlSchema.describe('The map image URL to search.'),
		address: z.string().min(1).optional(),
		locationID: z.string().min(1).optional(),
		lat: z.number().optional(),
		lng: z.number().optional(),
		niftyID: z.string().min(1).optional(),
	})
	.refine(
		(v) =>
			Boolean(v.address || v.locationID || v.niftyID) ||
			(v.lat !== undefined && v.lng !== undefined),
		{ message: 'Pass address, locationID, niftyID, or lat with lng.' },
	);

export type MapSearchInput = z.input<typeof MapSearchInputSchema>;

const MapSearchResponseSchema = z.object({
	locations: z.array(LocationSchema),
});

export type MapSearchResponse = z.infer<typeof MapSearchResponseSchema>;

const LocationBodySchema = {
	Address: z.string().min(1).optional(),
	Latitude: z.number().optional(),
	Longitude: z.number().optional(),
	LocationID: z.string().min(1).optional(),
	Properties: z.array(PropertySchema).optional(),
};

const MapAddLocationInputSchema = z
	.object({
		url: ImageUrlSchema.describe('The map image URL.'),
		...LocationBodySchema,
	})
	.refine(
		(v) =>
			Boolean(v.Address) ||
			(v.Latitude !== undefined && v.Longitude !== undefined),
		{
			message:
				'Pass Address (address maps) or Latitude with Longitude (lat/lng maps).',
		},
	);

export type MapAddLocationInput = z.input<typeof MapAddLocationInputSchema>;

const MapUpdateLocationInputSchema = z
	.object({
		url: ImageUrlSchema.describe('The map image URL.'),
		NiftyID: z.string().min(1).optional(),
		...LocationBodySchema,
	})
	.refine((v) => Boolean(v.NiftyID || v.LocationID), {
		message: 'Pass NiftyID or LocationID to say which location to update.',
	});

export type MapUpdateLocationInput = z.input<
	typeof MapUpdateLocationInputSchema
>;

const MapMessageResponseSchema = z
	.object({ msg: z.string().nullish() })
	.loose();

export type MapMessageResponse = z.infer<typeof MapMessageResponseSchema>;

const MapDeleteLocationInputSchema = z
	.object({
		url: ImageUrlSchema.describe('The map image URL.'),
		locationID: z.string().min(1).optional(),
		niftyID: z.string().min(1).optional(),
	})
	.refine((v) => Boolean(v.locationID || v.niftyID), {
		message: 'Pass locationID or niftyID.',
	});

export type MapDeleteLocationInput = z.input<
	typeof MapDeleteLocationInputSchema
>;

// ── beePlugin.* and widgets.suspendUser ───────────────────────────────────

const PluginKeySchema = z
	.string()
	.min(1)
	.describe('The Bee Plugin key from the NiftyImages app.');

const BeeUsersInputSchema = z.object({
	pluginKey: PluginKeySchema,
	...WindowSchema,
});

export type BeeUsersInput = z.input<typeof BeeUsersInputSchema>;

const BeeUserSchema = z
	.object({
		UserName: z.string().nullish(),
		Images: z.number().nullish(),
		Opens: CountSchema,
		Status: z.string().nullish(),
	})
	.loose();

const BeeUsersResponseSchema = z.object({ users: z.array(BeeUserSchema) });

export type BeeUsersResponse = z.infer<typeof BeeUsersResponseSchema>;

const BeeUserImagesInputSchema = z.object({
	pluginKey: PluginKeySchema,
	user: z.string().min(1).describe('The Bee Plugin user name.'),
	...WindowSchema,
});

export type BeeUserImagesInput = z.input<typeof BeeUserImagesInputSchema>;

const BeeImageSchema = z
	.object({
		ImageID: z.union([z.number(), z.string()]).nullish(),
		ImageType: z.string().nullish(),
		Name: z.string().nullish(),
		UserName: z.string().nullish(),
		Opens: CountSchema,
		Uri: z.string().nullish(),
		Status: z.string().nullish(),
	})
	.loose();

const BeeUserImagesResponseSchema = z.object({
	images: z.array(BeeImageSchema),
});

export type BeeUserImagesResponse = z.infer<typeof BeeUserImagesResponseSchema>;

const SuspendFlagSchema = z
	.boolean()
	.describe('true suspends the user, false lifts the suspension.');

const BeeSuspendInputSchema = z.object({
	pluginKey: PluginKeySchema,
	user: z.string().min(1).describe('The Bee Plugin user name.'),
	suspend: SuspendFlagSchema,
});

export type BeeSuspendInput = z.input<typeof BeeSuspendInputSchema>;

const WidgetSuspendInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	user: z.string().min(1).describe('The widget user, from widgets.users.'),
	suspend: SuspendFlagSchema,
});

export type WidgetSuspendInput = z.input<typeof WidgetSuspendInputSchema>;

// ── images.* ──────────────────────────────────────────────────────────────

const ImagesListInputSchema = z.object({
	pageSize: z.number().int().min(1).optional().describe('Defaults to 10.'),
	pageNumber: z.number().int().min(1).optional().describe('Defaults to 1.'),
});

export type ImagesListInput = z.input<typeof ImagesListInputSchema>;

const ImagesStatsInputSchema = z.object({ ...WindowSchema });

export type ImagesStatsInput = z.input<typeof ImagesStatsInputSchema>;

// ── psd.* ─────────────────────────────────────────────────────────────────

const PsdVariableSchema = z
	.object({ Name: z.string().nullish(), DefaultValue: z.string().nullish() })
	.loose();

const PsdLayerSchema = z
	.object({
		LayerName: z.string().nullish(),
		LayerType: z.string().nullish(),
		Hide: z.boolean().nullish(),
	})
	.loose();

const PsdResponseSchema = z
	.object({
		Url: z.string().nullish(),
		Name: z.string().nullish(),
		Variables: z.array(PsdVariableSchema).nullish(),
		Layers: z.array(PsdLayerSchema).nullish(),
		LastUpdated: z.string().nullish(),
		Active: z.boolean().nullish(),
	})
	.loose();

export type PsdResponse = z.infer<typeof PsdResponseSchema>;

const PsdLayerUpdateSchema = z
	.object({
		LayerName: z.string().min(1).describe('The layer to change, by name.'),
		Hide: z.boolean().optional(),
		TextValue: z.string().optional(),
		TextColor: z.string().optional(),
		ShapeColor: z.string().optional(),
		ImageUrl: z.string().optional(),
	})
	// Other layer types take other properties; NiftyImages validates them.
	.loose();

const PsdUpdateInputSchema = z
	.object({
		url: ImageUrlSchema.describe('The Photoshop image URL.'),
		Name: z.string().min(1).optional(),
		Variables: z
			.array(z.object({ Name: z.string().min(1), DefaultValue: z.string() }))
			.optional(),
		Layers: z.array(PsdLayerUpdateSchema).optional(),
	})
	.refine((v) => Boolean(v.Name || v.Variables || v.Layers), {
		message: 'Pass Name, Variables or Layers.',
	});

export type PsdUpdateInput = z.input<typeof PsdUpdateInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type NiftyimagesEndpointInputs = {
	widgetsList: WidgetsListInput;
	widgetsStats: WidgetsStatsInput;
	widgetsUsers: WidgetUsersInput;
	widgetUserStats: WidgetUserStatsInput;
	widgetImages: WidgetImagesInput;
	widgetUserImages: WidgetUserImagesInput;
	storeFields: StoreFieldsInput;
	storeAddRecord: StoreRecordInput;
	storeDeleteById: StoreDeleteByIdInput;
	storeDeleteRecord: StoreRecordInput;
	timerUpdate: TimerUpdateInput;
	mapsList: MapsListInput;
	mapsGet: ByUrlInput;
	mapsSearch: MapSearchInput;
	mapsAddLocation: MapAddLocationInput;
	mapsUpdateLocation: MapUpdateLocationInput;
	mapsDeleteLocation: MapDeleteLocationInput;
	beeUsers: BeeUsersInput;
	beeUserImages: BeeUserImagesInput;
	beeSuspendUser: BeeSuspendInput;
	widgetSuspendUser: WidgetSuspendInput;
	imagesList: ImagesListInput;
	imagesStats: ImagesStatsInput;
	imagesGet: ByUrlInput;
	imagesDelete: ByUrlInput;
	psdGet: ByUrlInput;
	psdUpdate: PsdUpdateInput;
};

export type NiftyimagesEndpointOutputs = {
	widgetsList: WidgetsListResponse;
	widgetsStats: WidgetsStatsResponse;
	widgetsUsers: WidgetUsersResponse;
	widgetUserStats: WidgetUserStatsResponse;
	widgetImages: WidgetImagesResponse;
	widgetUserImages: WidgetUserImagesResponse;
	storeFields: StoreFieldsResponse;
	storeAddRecord: StoreAddRecordResponse;
	storeDeleteById: NiftyimagesDone;
	storeDeleteRecord: NiftyimagesDone;
	timerUpdate: TimerUpdateResponse;
	mapsList: ImagesResponse;
	mapsGet: MapDetailsResponse;
	mapsSearch: MapSearchResponse;
	mapsAddLocation: MapMessageResponse;
	mapsUpdateLocation: MapMessageResponse;
	mapsDeleteLocation: NiftyimagesDone;
	beeUsers: BeeUsersResponse;
	beeUserImages: BeeUserImagesResponse;
	beeSuspendUser: NiftyimagesDone;
	widgetSuspendUser: NiftyimagesDone;
	imagesList: ImagesResponse;
	imagesStats: ImagesResponse;
	imagesGet: NiftyimagesImage;
	imagesDelete: NiftyimagesDone;
	psdGet: PsdResponse;
	psdUpdate: PsdResponse;
};

export const NiftyimagesEndpointInputSchemas = {
	widgetsList: WidgetsListInputSchema,
	widgetsStats: WidgetsStatsInputSchema,
	widgetsUsers: WidgetUsersInputSchema,
	widgetUserStats: WidgetUserStatsInputSchema,
	widgetImages: WidgetImagesInputSchema,
	widgetUserImages: WidgetUserImagesInputSchema,
	storeFields: StoreFieldsInputSchema,
	storeAddRecord: StoreRecordInputSchema,
	storeDeleteById: StoreDeleteByIdInputSchema,
	storeDeleteRecord: StoreRecordInputSchema,
	timerUpdate: TimerUpdateInputSchema,
	mapsList: MapsListInputSchema,
	mapsGet: ByUrlInputSchema,
	mapsSearch: MapSearchInputSchema,
	mapsAddLocation: MapAddLocationInputSchema,
	mapsUpdateLocation: MapUpdateLocationInputSchema,
	mapsDeleteLocation: MapDeleteLocationInputSchema,
	beeUsers: BeeUsersInputSchema,
	beeUserImages: BeeUserImagesInputSchema,
	beeSuspendUser: BeeSuspendInputSchema,
	widgetSuspendUser: WidgetSuspendInputSchema,
	imagesList: ImagesListInputSchema,
	imagesStats: ImagesStatsInputSchema,
	imagesGet: ByUrlInputSchema,
	imagesDelete: ByUrlInputSchema,
	psdGet: ByUrlInputSchema,
	psdUpdate: PsdUpdateInputSchema,
} as const;

export const NiftyimagesEndpointOutputSchemas = {
	widgetsList: WidgetsListResponseSchema,
	widgetsStats: WidgetsStatsResponseSchema,
	widgetsUsers: WidgetUsersResponseSchema,
	widgetUserStats: WidgetUserStatsResponseSchema,
	widgetImages: WidgetImagesResponseSchema,
	widgetUserImages: WidgetImagesResponseSchema,
	storeFields: StoreFieldsResponseSchema,
	storeAddRecord: StoreAddRecordResponseSchema,
	storeDeleteById: DoneSchema,
	storeDeleteRecord: DoneSchema,
	timerUpdate: TimerUpdateResponseSchema,
	mapsList: ImagesResponseSchema,
	mapsGet: MapDetailsSchema,
	mapsSearch: MapSearchResponseSchema,
	mapsAddLocation: MapMessageResponseSchema,
	mapsUpdateLocation: MapMessageResponseSchema,
	mapsDeleteLocation: DoneSchema,
	beeUsers: BeeUsersResponseSchema,
	beeUserImages: BeeUserImagesResponseSchema,
	beeSuspendUser: DoneSchema,
	widgetSuspendUser: DoneSchema,
	imagesList: ImagesResponseSchema,
	imagesStats: ImagesResponseSchema,
	imagesGet: ImageSchema,
	imagesDelete: DoneSchema,
	psdGet: PsdResponseSchema,
	psdUpdate: PsdResponseSchema,
} as const;
