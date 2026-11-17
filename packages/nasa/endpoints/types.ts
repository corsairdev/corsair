import { z } from 'zod';

// Inputs use NASA's own parameter names. Outputs are `.loose()` and their
// documented fields nullish, so a field NASA adds or omits cannot fail a call
// that has already happened.

/** `YYYY-MM-DD`, the format every NASA date parameter takes. */
const DateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD')
	.describe('A date in YYYY-MM-DD format.');

// ── shared shapes ─────────────────────────────────────────────────────────

const InstrumentSchema = z
	.object({ displayName: z.string().nullish() })
	.loose();

const LinkedEventSchema = z
	.object({ activityID: z.string().nullish() })
	.loose();

const SentNotificationSchema = z
	.object({
		messageID: z.string().nullish(),
		messageIssueTime: z.string().nullish(),
		messageURL: z.string().nullish(),
	})
	.loose();

/** The envelope every DONKI activity shares. */
const DonkiActivityFields = {
	link: z.string().nullish(),
	linkedEvents: z.array(LinkedEventSchema).nullish(),
	sentNotifications: z.array(SentNotificationSchema).nullish(),
	submissionTime: z.string().nullish(),
	versionId: z.number().nullish(),
	instruments: z.array(InstrumentSchema).nullish(),
};

/** The DONKI queries that take only a date range and default to 30 days. */
const DateRangeInputSchema = z.object({
	startDate: DateSchema.optional().describe(
		'First day to include. Defaults at the provider to 30 days before today.',
	),
	endDate: DateSchema.optional().describe(
		'Last day to include, inclusive. Defaults at the provider to today.',
	),
});

export type DateRangeInput = z.infer<typeof DateRangeInputSchema>;

/**
 * The CME listing answers 400 when either bound is missing (checked live
 * 11-17), although NASA's docs give both a default, so both are required.
 */
const CmeListInputSchema = z.object({
	startDate: DateSchema.describe('First day to include.'),
	endDate: DateSchema.describe('Last day to include, inclusive.'),
});

export type CmeListInput = z.infer<typeof CmeListInputSchema>;

/** ENLIL runs default to the last seven days, not the 30 the others use. */
const EnlilSimulationInputSchema = z.object({
	startDate: DateSchema.optional().describe(
		'First day to include. Defaults at the provider to seven days before today (UTC).',
	),
	endDate: DateSchema.optional().describe(
		'Last day to include, inclusive. Defaults at the provider to today.',
	),
});

export type EnlilSimulationInput = z.infer<typeof EnlilSimulationInputSchema>;

// ── apod.list ─────────────────────────────────────────────────────────────

export const NASA_APOD_MAX_PER_PAGE = 25;

const ApodListInputSchema = z
	.object({
		page: z.number().int().min(1).optional().describe('1-based page number.'),
		per_page: z
			.number()
			.int()
			.min(1)
			.max(NASA_APOD_MAX_PER_PAGE)
			.optional()
			.describe(
				`Entries per page, 1 to ${NASA_APOD_MAX_PER_PAGE}. NASA serves at most ${NASA_APOD_MAX_PER_PAGE}, so the plugin rejects a larger value instead of returning fewer than asked.`,
			),
		date_from: z
			.string()
			.regex(/^\d{6}$/, 'Expected the legacy YYMMDD date code')
			.optional()
			.describe(
				"Oldest day as the six-digit YYMMDD code, e.g. '240115' or '050101'. A string, so the leading zero of a 2000-2009 date survives. Only honoured when date_to is also sent.",
			),
		date_to: z
			.string()
			.regex(/^\d{6}$/, 'Expected the legacy YYMMDD date code')
			.optional()
			.describe(
				"Newest day as the six-digit YYMMDD code, e.g. '240117'. Only honoured when date_from is also sent.",
			),
	})
	.superRefine((value, ctx) => {
		// WordPress answers 200 with every post when only one bound is sent, so
		// a one-sided range silently returns today's entries instead of failing.
		if ((value.date_from === undefined) !== (value.date_to === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: [value.date_from === undefined ? 'date_from' : 'date_to'],
				message: 'date_from and date_to must be sent together.',
			});
		}
	});

export type ApodListInput = z.input<typeof ApodListInputSchema>;

export const ApodEntrySchema = z
	.object({
		date: z.string().nullish(),
		post_id: z.number().nullish(),
		title: z.string().nullish(),
		permalink: z.string().nullish(),
		media_type: z.string().nullish(),
		explanation: z.string().nullish(),
		credit: z.string().nullish(),
		copyright: z.string().nullish(),
		alt: z.string().nullish(),
		url: z.string().nullish(),
		hdurl: z.string().nullish(),
		basic_html: z.string().nullish(),
		basic_html_url: z.string().nullish(),
	})
	.loose();

export type NasaApodEntry = z.infer<typeof ApodEntrySchema>;

const ApodListResponseSchema = z.object({
	entries: z.array(ApodEntrySchema),
});

export type ApodListResponse = z.infer<typeof ApodListResponseSchema>;

// ── apod.get ──────────────────────────────────────────────────────────────

const ApodGetInputSchema = z.object({
	date: z
		.string()
		.regex(/^\d{6}$/, 'Expected the legacy YYMMDD date code')
		.describe(
			"NASA's six-digit date code for the picture, e.g. 240115 for 2024-01-15. This is the only addressable form: the feed has no lookup by YYYY-MM-DD.",
		),
});

export type ApodGetInput = z.input<typeof ApodGetInputSchema>;

export type ApodGetResponse = NasaApodEntry;

// ── neo.feed ──────────────────────────────────────────────────────────────

const NeoFeedInputSchema = z.object({
	start_date: DateSchema.optional().describe(
		'First day of close approaches. NASA accepts at most seven days between the two bounds.',
	),
	end_date: DateSchema.optional().describe(
		'Last day of close approaches, inclusive.',
	),
	detailed: z
		.boolean()
		.optional()
		.describe('Return the fuller asteroid record. Defaults at NASA to false.'),
});

export type NeoFeedInput = z.input<typeof NeoFeedInputSchema>;

/** Distances and speeds arrive as decimal strings, never numbers. */
const NeoCloseApproachSchema = z
	.object({
		close_approach_date: z.string().nullish(),
		close_approach_date_full: z.string().nullish(),
		epoch_date_close_approach: z.number().nullish(),
		orbiting_body: z.string().nullish(),
		miss_distance: z
			.object({
				astronomical: z.string().nullish(),
				lunar: z.string().nullish(),
				kilometers: z.string().nullish(),
				miles: z.string().nullish(),
			})
			.loose()
			.nullish(),
		relative_velocity: z
			.object({
				kilometers_per_second: z.string().nullish(),
				kilometers_per_hour: z.string().nullish(),
				miles_per_hour: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const EstimatedDiameterSchema = z
	.object({
		meters: z
			.object({
				estimated_diameter_min: z.number().nullish(),
				estimated_diameter_max: z.number().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

const OrbitClassSchema = z
	.object({
		orbit_class_type: z.string().nullish(),
		orbit_class_description: z.string().nullish(),
		orbit_class_range: z.string().nullish(),
	})
	.loose();

/** Every numeric orbit field arrives as a decimal string. */
const OrbitalDataSchema = z
	.object({
		aphelion_distance: z.string().nullish(),
		perihelion_distance: z.string().nullish(),
		semi_major_axis: z.string().nullish(),
		eccentricity: z.string().nullish(),
		inclination: z.string().nullish(),
		mean_motion: z.string().nullish(),
		orbital_period: z.string().nullish(),
		orbit_determination_date: z.string().nullish(),
		first_observation_date: z.string().nullish(),
		last_observation_date: z.string().nullish(),
		data_arc_in_days: z.number().nullish(),
		observations_used: z.number().nullish(),
		orbit_uncertainty: z.string().nullish(),
		orbit_id: z.string().nullish(),
		orbit_class: OrbitClassSchema.nullish(),
	})
	.loose();

export const NearEarthObjectSchema = z
	.object({
		id: z.string().nullish(),
		neo_reference_id: z.string().nullish(),
		name: z.string().nullish(),
		name_limited: z.string().nullish(),
		designation: z.string().nullish(),
		nasa_jpl_url: z.string().nullish(),
		absolute_magnitude_h: z.number().nullish(),
		is_potentially_hazardous_asteroid: z.boolean().nullish(),
		is_sentry_object: z.boolean().nullish(),
		estimated_diameter: EstimatedDiameterSchema.nullish(),
		close_approach_data: z.array(NeoCloseApproachSchema).nullish(),
		orbital_data: OrbitalDataSchema.nullish(),
	})
	.loose();

export type NasaNearEarthObject = z.infer<typeof NearEarthObjectSchema>;

const NeoFeedLinksSchema = z
	.object({
		next: z.string().nullish(),
		previous: z.string().nullish(),
		self: z.string().nullish(),
	})
	.loose();

/**
 * The feed groups objects by close-approach date. NASA omits the whole key when
 * nothing is found for any day in range, so `{}` arrives in place of a date.
 */
const NeoFeedResponseSchema = z.object({
	element_count: z.number(),
	near_earth_objects: z.record(z.string(), z.array(NearEarthObjectSchema)),
	links: NeoFeedLinksSchema.nullish(),
});

export type NeoFeedResponse = z.infer<typeof NeoFeedResponseSchema>;

// ── neo.lookup ────────────────────────────────────────────────────────────

const NeoLookupInputSchema = z.object({
	asteroid_id: z
		.union([z.string().min(1), z.number().int().positive()])
		.describe("The asteroid's JPL SPK-ID, e.g. 3542519."),
});

export type NeoLookupInput = z.input<typeof NeoLookupInputSchema>;

export type NeoLookupResponse = NasaNearEarthObject;

// ── neo.browse ────────────────────────────────────────────────────────────

const NeoBrowseInputSchema = z.object({
	page: z.number().int().min(0).optional().describe('0-based page number.'),
	size: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe(
			'Objects per page. NASA defaults to 20 and returns 20 when this is omitted.',
		),
});

export type NeoBrowseInput = z.input<typeof NeoBrowseInputSchema>;

const NeoBrowsePageSchema = z
	.object({
		size: z.number().nullish(),
		number: z.number().nullish(),
		total_elements: z.number().nullish(),
		total_pages: z.number().nullish(),
	})
	.loose();

const NeoBrowseResponseSchema = z.object({
	near_earth_objects: z.array(NearEarthObjectSchema),
	page: NeoBrowsePageSchema,
	links: NeoFeedLinksSchema.nullish(),
});

export type NeoBrowseResponse = z.infer<typeof NeoBrowseResponseSchema>;

// ── donki.{cme, cmeAnalysis, geomagneticStorm, ...} ───────────────────────

export const DONKI_CME_ANALYSIS_CATALOGS = [
	'ALL',
	'SWRC_CATALOG',
	'JANG_ET_AL_CATALOG',
] as const;

const CmeAnalysisInputSchema = z.object({
	startDate: DateSchema.optional(),
	endDate: DateSchema.optional(),
	mostAccurateOnly: z
		.boolean()
		.optional()
		.describe(
			'Keep only the analysis NASA marks most accurate. Defaults at the provider to true.',
		),
	completeEntryOnly: z
		.boolean()
		.optional()
		.describe('Keep only complete analyses. Defaults at the provider to true.'),
	speed: z
		.number()
		.min(0)
		.optional()
		.describe('Lowest speed in km/s to include. Defaults to 0.'),
	halfAngle: z
		.number()
		.min(0)
		.optional()
		.describe('Smallest half angle in degrees to include. Defaults to 0.'),
	catalog: z
		.enum(DONKI_CME_ANALYSIS_CATALOGS)
		.optional()
		.describe('Which analysis catalog to read. Defaults to ALL.'),
	keyword: z
		.string()
		.optional()
		.describe('Free-text filter, such as swpc_annex.'),
});

export type CmeAnalysisInput = z.input<typeof CmeAnalysisInputSchema>;

/** One IPS record as it appears nested inside an ENLIL model run. */
const LinkedShockSchema = z
	.object({
		catalog: z.string().nullish(),
		activityID: z.string().nullish(),
		location: z.string().nullish(),
		eventTime: z.string().nullish(),
		instruments: z.array(InstrumentSchema).nullish(),
		linkedEvents: z.array(LinkedEventSchema).nullish(),
		sentNotifications: z.array(SentNotificationSchema).nullish(),
		link: z.string().nullish(),
		submissionTime: z.string().nullish(),
		versionId: z.number().nullish(),
	})
	.loose();

/**
 * One ENLIL model run as it appears inside a CME's analyses. Its arrival window
 * for a spacecraft is in `impactList`, and its Kp forecasts are the `kp_*`
 * fields.
 */
const CmeEnlilRunSchema = z
	.object({
		modelCompletionTime: z.string().nullish(),
		au: z.number().nullish(),
		estimatedShockArrivalTime: z.string().nullish(),
		isEarthGB: z.boolean().nullish(),
		isEarthMinorImpact: z.boolean().nullish(),
		rmin_re: z.number().nullish(),
		kp_18: z.number().nullish(),
		kp_90: z.number().nullish(),
		kp_135: z.number().nullish(),
		kp_180: z.number().nullish(),
		estimatedDuration: z.number().nullish(),
		link: z.string().nullish(),
		impactList: z
			.array(
				z
					.object({
						location: z.string().nullish(),
						arrivalTime: z.string().nullish(),
						isGlancingBlow: z.boolean().nullish(),
						isMinorImpact: z.boolean().nullish(),
					})
					.loose(),
			)
			.nullish(),
		cmeIDs: z.array(z.string()).nullish(),
	})
	.loose();

const CmeAnalysisSchema = z
	.object({
		catalog: z.string().nullish(),
		isMostAccurate: z.boolean().nullish(),
		time21_5: z.string().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		halfAngle: z.number().nullish(),
		speed: z.number().nullish(),
		// 'S', 'C', 'O', 'R' or 'ER' on a CME; absent in the standalone listing.
		type: z.string().nullish(),
		associatedCMEID: z.string().nullish(),
		associatedCMEstartTime: z.string().nullish(),
		associatedCMELink: z.string().nullish(),
		featureCode: z.string().nullish(),
		dataLevel: z.string().nullish(),
		measurementTechnique: z.string().nullish(),
		imageType: z.string().nullish(),
		tilt: z.number().nullish(),
		minorHalfWidth: z.number().nullish(),
		speedMeasuredAtHeight: z.number().nullish(),
		note: z.string().nullish(),
		levelOfData: z.number().nullish(),
		enlilList: z.array(CmeEnlilRunSchema).nullish(),
	})
	.loose();

export type DonkiCmeAnalysis = z.infer<typeof CmeAnalysisSchema>;

const CmeSchema = z
	.object({
		activityID: z.string().nullish(),
		catalog: z.string().nullish(),
		startTime: z.string().nullish(),
		sourceLocation: z.string().nullish(),
		activeRegionNum: z.number().nullish(),
		note: z.string().nullish(),
		cmeAnalyses: z.array(CmeAnalysisSchema).nullish(),
		...DonkiActivityFields,
	})
	.loose();

export type DonkiCme = z.infer<typeof CmeSchema>;

const CmeListResponseSchema = z.object({ events: z.array(CmeSchema) });
const CmeAnalysisListResponseSchema = z.object({
	analyses: z.array(CmeAnalysisSchema),
});

export type CmeListResponse = z.infer<typeof CmeListResponseSchema>;
export type CmeAnalysisListResponse = z.infer<
	typeof CmeAnalysisListResponseSchema
>;

const KpIndexSchema = z
	.object({
		kpIndex: z.number().nullish(),
		observedTime: z.string().nullish(),
		source: z.string().nullish(),
	})
	.loose();

const GeomagneticStormSchema = z
	.object({
		gstID: z.string().nullish(),
		startTime: z.string().nullish(),
		allKpIndex: z.array(KpIndexSchema).nullish(),
		...DonkiActivityFields,
	})
	.loose();

export type DonkiGeomagneticStorm = z.infer<typeof GeomagneticStormSchema>;

const GeomagneticStormListResponseSchema = z.object({
	storms: z.array(GeomagneticStormSchema),
});

export type GeomagneticStormListResponse = z.infer<
	typeof GeomagneticStormListResponseSchema
>;

const InterplanetaryShockSchema = z
	.object({
		activityID: z.string().nullish(),
		catalog: z.string().nullish(),
		location: z.string().nullish(),
		eventTime: z.string().nullish(),
		...DonkiActivityFields,
	})
	.loose();

export type DonkiInterplanetaryShock = z.infer<
	typeof InterplanetaryShockSchema
>;

const InterplanetaryShockListResponseSchema = z.object({
	shocks: z.array(InterplanetaryShockSchema),
});

export type InterplanetaryShockListResponse = z.infer<
	typeof InterplanetaryShockListResponseSchema
>;

export const DONKI_SHOCK_LOCATIONS = [
	'Earth',
	'MESSENGER',
	'STEREO A',
	'STEREO B',
] as const;
export const DONKI_SHOCK_CATALOGS = [
	'ALL',
	'SWRC_CATALOG',
	'WINSLOW_MESSENGER_ICME_CATALOG',
] as const;

const InterplanetaryShockInputSchema = DateRangeInputSchema.extend({
	location: z
		.enum(DONKI_SHOCK_LOCATIONS)
		.optional()
		.describe('Which spacecraft observed the shock. Defaults to ALL.'),
	catalog: z
		.enum(DONKI_SHOCK_CATALOGS)
		.optional()
		.describe('Which catalog to read. Defaults to ALL.'),
});

export type InterplanetaryShockInput = z.input<
	typeof InterplanetaryShockInputSchema
>;

/** Solar flares, solar energetic particles, magnetopause crossings, HSS and RBE. */
const EventTimeActivitySchema = z
	.object({
		eventTime: z.string().nullish(),
		...DonkiActivityFields,
	})
	.loose();

const EventTimeActivityListResponseSchema = z.object({
	events: z.array(EventTimeActivitySchema.loose()),
});

export type EventTimeActivityListResponse = z.infer<
	typeof EventTimeActivityListResponseSchema
>;

const RadiationBeltSchema = z
	.object({ rbeID: z.string().nullish(), ...EventTimeActivitySchema.shape })
	.loose();

const RadiationBeltListResponseSchema = z.object({
	enhancements: z.array(RadiationBeltSchema),
});

export type RadiationBeltListResponse = z.infer<
	typeof RadiationBeltListResponseSchema
>;

const MagnetopauseSchema = z
	.object({ mpcID: z.string().nullish(), ...EventTimeActivitySchema.shape })
	.loose();

const MagnetopauseListResponseSchema = z.object({
	crossings: z.array(MagnetopauseSchema),
});

export type MagnetopauseListResponse = z.infer<
	typeof MagnetopauseListResponseSchema
>;

const HighSpeedStreamSchema = z
	.object({ hssID: z.string().nullish(), ...EventTimeActivitySchema.shape })
	.loose();

const HighSpeedStreamListResponseSchema = z.object({
	streams: z.array(HighSpeedStreamSchema),
});

export type HighSpeedStreamListResponse = z.infer<
	typeof HighSpeedStreamListResponseSchema
>;

const SolarFlareSchema = z
	.object({
		flrID: z.string().nullish(),
		beginTime: z.string().nullish(),
		peakTime: z.string().nullish(),
		endTime: z.string().nullish(),
		classType: z.string().nullish(),
		sourceLocation: z.string().nullish(),
		activeRegionNum: z.number().nullish(),
		...DonkiActivityFields,
	})
	.loose();

export type DonkiSolarFlare = z.infer<typeof SolarFlareSchema>;

const SolarFlareListResponseSchema = z.object({
	flares: z.array(SolarFlareSchema),
});

export type SolarFlareListResponse = z.infer<
	typeof SolarFlareListResponseSchema
>;

const SolarEnergeticParticleSchema = z
	.object({
		sepID: z.string().nullish(),
		eventTime: z.string().nullish(),
		...DonkiActivityFields,
	})
	.loose();

const SolarEnergeticParticleListResponseSchema = z.object({
	particles: z.array(SolarEnergeticParticleSchema),
});

export type SolarEnergeticParticleListResponse = z.infer<
	typeof SolarEnergeticParticleListResponseSchema
>;

const CmeInputSchema = z
	.object({
		cmeStartTime: z.string().nullish(),
		latitude: z.number().nullish(),
		longitude: z.number().nullish(),
		speed: z.number().nullish(),
		halfAngle: z.number().nullish(),
		time21_5: z.string().nullish(),
		featureCode: z.string().nullish(),
		isMostAccurate: z.boolean().nullish(),
		levelOfData: z.number().nullish(),
		CMEID: z.string().nullish(),
		ipsList: z.array(LinkedShockSchema).nullish(),
	})
	.loose();

const ImpactSchema = z
	.object({
		location: z.string().nullish(),
		arrivalTime: z.string().nullish(),
		isGlancingBlow: z.boolean().nullish(),
		isMinorImpact: z.boolean().nullish(),
	})
	.loose();

const EnlilSimulationSchema = z
	.object({
		simulationID: z.string().nullish(),
		modelCompletionTime: z.string().nullish(),
		au: z.number().nullish(),
		cmeInputs: z.array(CmeInputSchema).nullish(),
		estimatedShockArrivalTime: z.string().nullish(),
		isEarthGB: z.boolean().nullish(),
		isEarthMinorImpact: z.boolean().nullish(),
		rmin_re: z.number().nullish(),
		kp_18: z.number().nullish(),
		kp_90: z.number().nullish(),
		kp_135: z.number().nullish(),
		kp_180: z.number().nullish(),
		estimatedDuration: z.number().nullish(),
		impactList: z.array(ImpactSchema).nullish(),
		link: z.string().nullish(),
	})
	.loose();

export type DonkiEnlilSimulation = z.infer<typeof EnlilSimulationSchema>;

const EnlilSimulationListResponseSchema = z.object({
	simulations: z.array(EnlilSimulationSchema),
});

export type EnlilSimulationListResponse = z.infer<
	typeof EnlilSimulationListResponseSchema
>;

export const DONKI_NOTIFICATION_TYPES = [
	'all',
	'FLR',
	'SEP',
	'CME',
	'IPS',
	'MPC',
	'GST',
	'RBE',
	'report',
] as const;

const NotificationInputSchema = z.object({
	startDate: DateSchema.optional().describe(
		'First day to include. Defaults at the provider to seven days before today.',
	),
	endDate: DateSchema.optional().describe(
		'Last day to include, inclusive. Defaults at the provider to today.',
	),
	type: z
		.enum(DONKI_NOTIFICATION_TYPES)
		.optional()
		.describe(
			'Which notifications to return. Defaults to all. NASA caps the window at 30 days and quietly shifts it when a wider range is sent.',
		),
});

export type NotificationInput = z.input<typeof NotificationInputSchema>;

const NotificationSchema = z
	.object({
		messageType: z.string().nullish(),
		messageID: z.string().nullish(),
		messageURL: z.string().nullish(),
		messageIssueTime: z.string().nullish(),
		messageBody: z.string().nullish(),
	})
	.loose();

export type DonkiNotification = z.infer<typeof NotificationSchema>;

const NotificationListResponseSchema = z.object({
	notifications: z.array(NotificationSchema),
});

export type NotificationListResponse = z.infer<
	typeof NotificationListResponseSchema
>;

// ── epic.images / epic.available ──────────────────────────────────────────

export const EPIC_COLLECTIONS = ['natural', 'enhanced'] as const;

const EpicImagesInputSchema = z.object({
	collection: z
		.enum(EPIC_COLLECTIONS)
		.optional()
		.describe('Colour treatment. Defaults to natural.'),
	date: DateSchema.optional().describe(
		'A day with imagery. Omit for the most recent day NASA holds.',
	),
});

export type EpicImagesInput = z.input<typeof EpicImagesInputSchema>;

const CoordinatesSchema = z
	.object({ lat: z.number().nullish(), lon: z.number().nullish() })
	.loose();

const VectorSchema = z
	.object({
		x: z.number().nullish(),
		y: z.number().nullish(),
		z: z.number().nullish(),
	})
	.loose();

const QuaternionsSchema = z
	.object({
		q0: z.number().nullish(),
		q1: z.number().nullish(),
		q2: z.number().nullish(),
		q3: z.number().nullish(),
	})
	.loose();

export const EpicImageSchema = z
	.object({
		identifier: z.string().nullish(),
		caption: z.string().nullish(),
		image: z.string().nullish(),
		version: z.string().nullish(),
		// "2019-05-30 01:09:10" in UTC, not ISO 8601.
		date: z.string().nullish(),
		centroid_coordinates: CoordinatesSchema.nullish(),
		dscovr_j2000_position: VectorSchema.nullish(),
		lunar_j2000_position: VectorSchema.nullish(),
		sun_j2000_position: VectorSchema.nullish(),
		attitude_quaternions: QuaternionsSchema.nullish(),
	})
	.loose();

export type NasaEpicImage = z.infer<typeof EpicImageSchema>;

const EpicImageListResponseSchema = z.object({
	images: z.array(EpicImageSchema),
});

export type EpicImageListResponse = z.infer<typeof EpicImageListResponseSchema>;

const EpicAvailableInputSchema = z.object({
	collection: z
		.enum(EPIC_COLLECTIONS)
		.optional()
		.describe('Colour treatment. Defaults to natural.'),
});

export type EpicAvailableInput = z.input<typeof EpicAvailableInputSchema>;

const EpicAvailableResponseSchema = z.object({
	dates: z.array(z.string()),
});

export type EpicAvailableResponse = z.infer<typeof EpicAvailableResponseSchema>;

// ── eonet.events / eonet.event / eonet.categories ─────────────────────────

export const EONET_STATUSES = ['open', 'closed', 'all'] as const;

const EonetEventsInputSchema = z.object({
	source: z
		.array(z.string().min(1))
		.optional()
		.describe('Only events from these source IDs, e.g. InciWeb or EO.'),
	category: z
		.array(z.string().min(1))
		.optional()
		.describe('Only events in these category IDs, e.g. wildfires.'),
	status: z
		.enum(EONET_STATUSES)
		.optional()
		.describe(
			'Only open, only closed, or both. EONET returns only open events when this is omitted.',
		),
	limit: z.number().int().min(1).optional().describe('Most events to return.'),
	days: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Only events from this many prior days, today included.'),
	start: DateSchema.optional().describe('First day of the event window.'),
	end: DateSchema.optional().describe('Last day of the event window.'),
	magID: z
		.string()
		.min(1)
		.optional()
		.describe('Magnitude ID to filter on, e.g. mag_kts.'),
	magMin: z.number().optional().describe('Smallest magnitude to include.'),
	magMax: z.number().optional().describe('Largest magnitude to include.'),
	bbox: z
		.string()
		.regex(
			/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/,
			'Expected minLon,maxLat,maxLon,minLat',
		)
		.optional()
		.describe('Bounding box as minLon,maxLat,maxLon,minLat.'),
});

export type EonetEventsInput = z.input<typeof EonetEventsInputSchema>;

const EonetCategorySchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		link: z.string().nullish(),
	})
	.loose();

const EonetSourceSchema = z
	.object({ id: z.string().nullish(), url: z.string().nullish() })
	.loose();

const EonetGeometrySchema = z
	.object({
		magnitudeValue: z.number().nullish(),
		magnitudeUnit: z.string().nullish(),
		magnitudeDescription: z.string().nullish(),
		date: z.string().nullish(),
		type: z.string().nullish(),
		// A Point carries [lon, lat]; a Polygon carries an array of rings, so the
		// nesting depth follows `type`. The union keeps both readable.
		coordinates: z
			.union([
				z.array(z.number()),
				z.array(z.array(z.array(z.number()))),
				z.array(z.array(z.number())),
			])
			.nullish(),
	})
	.loose();

export const EonetEventSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		link: z.string().nullish(),
		closed: z.string().nullish(),
		categories: z.array(EonetCategorySchema).nullish(),
		sources: z.array(EonetSourceSchema).nullish(),
		geometry: z.array(EonetGeometrySchema).nullish(),
	})
	.loose();

export type NasaEonetEvent = z.infer<typeof EonetEventSchema>;

const EonetEventsResponseSchema = z.object({
	events: z.array(EonetEventSchema),
	title: z.string().nullish(),
	description: z.string().nullish(),
	link: z.string().nullish(),
});

export type EonetEventsResponse = z.infer<typeof EonetEventsResponseSchema>;

const EonetEventInputSchema = z.object({
	eventId: z
		.string()
		.min(1)
		.describe("The event's EONET ID, e.g. EONET_26331."),
});

export type EonetEventInput = z.input<typeof EonetEventInputSchema>;

export type EonetEventResponse = NasaEonetEvent;

const EonetCategoriesInputSchema = z.object({});

export type EonetCategoriesInput = z.input<typeof EonetCategoriesInputSchema>;

const EonetCategoriesResponseSchema = z.object({
	categories: z.array(EonetCategorySchema),
	title: z.string().nullish(),
	description: z.string().nullish(),
	link: z.string().nullish(),
});

export type EonetCategoriesResponse = z.infer<
	typeof EonetCategoriesResponseSchema
>;

// ── images.search / images.asset / images.metadata ────────────────────────

export const NASA_IMAGE_MEDIA_TYPES = ['image', 'video', 'audio'] as const;

const ImageSearchInputSchema = z
	.object({
		q: z.string().min(1).optional().describe('Free-text search terms.'),
		center: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
		description_508: z.string().min(1).optional(),
		keywords: z
			.array(z.string().min(1))
			.optional()
			.describe('Keywords to match. Sent comma-separated.'),
		location: z.string().min(1).optional(),
		media_type: z
			.enum(NASA_IMAGE_MEDIA_TYPES)
			.optional()
			.describe('Restrict to one media type.'),
		nasa_id: z.string().min(1).optional(),
		page: z.number().int().min(1).optional().describe('1-based page number.'),
		page_size: z
			.number()
			.int()
			.min(1)
			.optional()
			.describe('Results per page. NASA defaults to 100.'),
		photographer: z.string().min(1).optional(),
		secondary_creator: z.string().min(1).optional(),
		title: z.string().min(1).optional(),
		year_start: z
			.string()
			.regex(/^\d{4}$/, 'Expected YYYY')
			.optional(),
		year_end: z
			.string()
			.regex(/^\d{4}$/, 'Expected YYYY')
			.optional(),
	})
	.superRefine((value, ctx) => {
		// NASA answers 400 "Expected 'q' text search parameter or other
		// keywords." for an empty search, so it fails here instead.
		const hasFilter = Object.values(value).some((entry) => entry !== undefined);
		if (!hasFilter) {
			ctx.addIssue({
				code: 'custom',
				message: 'At least one search parameter is required.',
			});
		}
	});

export type ImageSearchInput = z.input<typeof ImageSearchInputSchema>;

const ImageLinkSchema = z
	.object({
		href: z.string().nullish(),
		rel: z.string().nullish(),
		render: z.string().nullish(),
		width: z.number().nullish(),
		height: z.number().nullish(),
		size: z.number().nullish(),
	})
	.loose();

const ImageDataSchema = z
	.object({
		center: z.string().nullish(),
		date_created: z.string().nullish(),
		description: z.string().nullish(),
		description_508: z.string().nullish(),
		keywords: z.array(z.string()).nullish(),
		media_type: z.string().nullish(),
		nasa_id: z.string().nullish(),
		title: z.string().nullish(),
		photographer: z.string().nullish(),
		secondary_creator: z.string().nullish(),
		location: z.string().nullish(),
		album: z.array(z.string()).nullish(),
	})
	.loose();

const ImageItemSchema = z
	.object({
		href: z.string().nullish(),
		data: z.array(ImageDataSchema).nullish(),
		links: z.array(ImageLinkSchema).nullish(),
	})
	.loose();

export type NasaImageItem = z.infer<typeof ImageItemSchema>;

const ImageCollectionMetaSchema = z
	.object({ total_hits: z.number().nullish() })
	.loose();

/**
 * The search page reports paging two ways at once: a `rel: next` link when
 * another page exists, and `total_hits` for the whole query. Both are kept so a
 * caller can page on either.
 */
const ImageSearchResponseSchema = z.object({
	items: z.array(ImageItemSchema),
	total_hits: z.number().nullish(),
	next_page: z
		.number()
		.nullish()
		.describe('The page after this one, when NASA supplied a next link.'),
	href: z.string().nullish(),
});

export type ImageSearchResponse = z.infer<typeof ImageSearchResponseSchema>;

const ImageAssetInputSchema = z.object({
	nasa_id: z.string().min(1).describe('The asset NASA ID, e.g. as11-40-5874.'),
});

export type ImageAssetInput = z.input<typeof ImageAssetInputSchema>;

const ImageAssetResponseSchema = z.object({
	manifest: z.array(z.string()),
	metadata_url: z
		.string()
		.nullish()
		.describe('The metadata.json entry in the manifest, when NASA lists one.'),
});

export type ImageAssetResponse = z.infer<typeof ImageAssetResponseSchema>;

export type ImageMetadataInput = ImageAssetInput;

const ImageMetadataResponseSchema = z.object({
	location: z.string(),
});

export type ImageMetadataResponse = z.infer<typeof ImageMetadataResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type NasaEndpointInputs = {
	apodList: ApodListInput;
	apodGet: ApodGetInput;
	neoFeed: NeoFeedInput;
	neoLookup: NeoLookupInput;
	neoBrowse: NeoBrowseInput;
	cmeList: CmeListInput;
	cmeAnalysisList: CmeAnalysisInput;
	geomagneticStormList: DateRangeInput;
	solarFlareList: DateRangeInput;
	solarEnergeticParticleList: DateRangeInput;
	magnetopauseCrossingList: DateRangeInput;
	radiationBeltList: DateRangeInput;
	highSpeedStreamList: DateRangeInput;
	interplanetaryShockList: InterplanetaryShockInput;
	enlilSimulationList: EnlilSimulationInput;
	notificationList: NotificationInput;
	epicImages: EpicImagesInput;
	epicAvailableDates: EpicAvailableInput;
	eonetEvents: EonetEventsInput;
	eonetEvent: EonetEventInput;
	eonetCategories: EonetCategoriesInput;
	imageSearch: ImageSearchInput;
	imageAsset: ImageAssetInput;
	imageMetadata: ImageMetadataInput;
};

export type NasaEndpointOutputs = {
	apodList: ApodListResponse;
	apodGet: ApodGetResponse;
	neoFeed: NeoFeedResponse;
	neoLookup: NeoLookupResponse;
	neoBrowse: NeoBrowseResponse;
	cmeList: CmeListResponse;
	cmeAnalysisList: CmeAnalysisListResponse;
	geomagneticStormList: GeomagneticStormListResponse;
	solarFlareList: SolarFlareListResponse;
	solarEnergeticParticleList: SolarEnergeticParticleListResponse;
	magnetopauseCrossingList: MagnetopauseListResponse;
	radiationBeltList: RadiationBeltListResponse;
	highSpeedStreamList: HighSpeedStreamListResponse;
	interplanetaryShockList: InterplanetaryShockListResponse;
	enlilSimulationList: EnlilSimulationListResponse;
	notificationList: NotificationListResponse;
	epicImages: EpicImageListResponse;
	epicAvailableDates: EpicAvailableResponse;
	eonetEvents: EonetEventsResponse;
	eonetEvent: EonetEventResponse;
	eonetCategories: EonetCategoriesResponse;
	imageSearch: ImageSearchResponse;
	imageAsset: ImageAssetResponse;
	imageMetadata: ImageMetadataResponse;
};

export const NasaEndpointInputSchemas = {
	apodList: ApodListInputSchema,
	apodGet: ApodGetInputSchema,
	neoFeed: NeoFeedInputSchema,
	neoLookup: NeoLookupInputSchema,
	neoBrowse: NeoBrowseInputSchema,
	cmeList: CmeListInputSchema,
	cmeAnalysisList: CmeAnalysisInputSchema,
	geomagneticStormList: DateRangeInputSchema,
	solarFlareList: DateRangeInputSchema,
	solarEnergeticParticleList: DateRangeInputSchema,
	magnetopauseCrossingList: DateRangeInputSchema,
	radiationBeltList: DateRangeInputSchema,
	highSpeedStreamList: DateRangeInputSchema,
	interplanetaryShockList: InterplanetaryShockInputSchema,
	enlilSimulationList: EnlilSimulationInputSchema,
	notificationList: NotificationInputSchema,
	epicImages: EpicImagesInputSchema,
	epicAvailableDates: EpicAvailableInputSchema,
	eonetEvents: EonetEventsInputSchema,
	eonetEvent: EonetEventInputSchema,
	eonetCategories: EonetCategoriesInputSchema,
	imageSearch: ImageSearchInputSchema,
	imageAsset: ImageAssetInputSchema,
	imageMetadata: ImageAssetInputSchema,
} as const;

export const NasaEndpointOutputSchemas = {
	apodList: ApodListResponseSchema,
	apodGet: ApodEntrySchema,
	neoFeed: NeoFeedResponseSchema,
	neoLookup: NearEarthObjectSchema,
	neoBrowse: NeoBrowseResponseSchema,
	cmeList: CmeListResponseSchema,
	cmeAnalysisList: CmeAnalysisListResponseSchema,
	geomagneticStormList: GeomagneticStormListResponseSchema,
	solarFlareList: SolarFlareListResponseSchema,
	solarEnergeticParticleList: SolarEnergeticParticleListResponseSchema,
	magnetopauseCrossingList: MagnetopauseListResponseSchema,
	radiationBeltList: RadiationBeltListResponseSchema,
	highSpeedStreamList: HighSpeedStreamListResponseSchema,
	interplanetaryShockList: InterplanetaryShockListResponseSchema,
	enlilSimulationList: EnlilSimulationListResponseSchema,
	notificationList: NotificationListResponseSchema,
	epicImages: EpicImageListResponseSchema,
	epicAvailableDates: EpicAvailableResponseSchema,
	eonetEvents: EonetEventsResponseSchema,
	eonetEvent: EonetEventSchema,
	eonetCategories: EonetCategoriesResponseSchema,
	imageSearch: ImageSearchResponseSchema,
	imageAsset: ImageAssetResponseSchema,
	imageMetadata: ImageMetadataResponseSchema,
} as const;
