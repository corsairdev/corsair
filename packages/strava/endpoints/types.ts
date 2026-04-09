import { z } from 'zod';

const ActivitiesCreateInputSchema = z
	.object({
		name: z.string(),
		sport_type: z.string(),
		start_date_local: z.string(),
		elapsed_time: z.number(),
		type: z.string().optional(),
		commute: z.number().optional(),
		trainer: z.number().optional(),
		distance: z.number().optional(),
		description: z.string().optional(),
	})
	.passthrough();

const ActivitiesGetInputSchema = z
	.object({
		id: z.number(),
		include_all_efforts: z.boolean().optional(),
	})
	.passthrough();

const ActivitiesListInputSchema = z
	.object({
		before: z.number().optional(),
		after: z.number().optional(),
		page: z.number().optional(),
		per_page: z.number().optional(),
	})
	.passthrough();

const StreamKeySchema = z.enum([
	'time',
	'distance',
	'latlng',
	'altitude',
	'velocity_smooth',
	'heartrate',
	'cadence',
	'watts',
	'temp',
	'moving',
	'grade_smooth',
]);

const ActivitiesGetStreamsInputSchema = z
	.object({
		id: z.number(),
		keys: z.array(StreamKeySchema),
		key_by_type: z.boolean().optional(),
	})
	.passthrough();

const ActivitiesGetZonesInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const ActivitiesListCommentsInputSchema = z
	.object({
		id: z.number(),
		page: z.number().optional(),
		per_page: z.number().optional(),
	})
	.passthrough();

const ActivitiesListKudoersInputSchema = z
	.object({
		id: z.number(),
		page: z.number().optional(),
		per_page: z.number().optional(),
	})
	.passthrough();

const ActivitiesListLapsInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const AthleteGetInputSchema = z.object({}).passthrough();

const AthleteUpdateInputSchema = z
	.object({
		weight: z.number().optional(),
	})
	.passthrough();

const AthleteGetStatsInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const AthleteGetZonesInputSchema = z.object({}).passthrough();

const SegmentsExploreInputSchema = z
	.object({
		bounds: z.string(),
		activity_type: z.enum(['running', 'riding']).optional(),
		min_cat: z.number().optional(),
		max_cat: z.number().optional(),
	})
	.passthrough();

const SegmentsGetInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const SegmentsGetStreamsInputSchema = z
	.object({
		id: z.number(),
		keys: z.array(StreamKeySchema),
		key_by_type: z.boolean().optional(),
	})
	.passthrough();

const SegmentsListInputSchema = z
	.object({
		page: z.number().optional(),
		per_page: z.number().optional(),
	})
	.passthrough();

const SegmentsStarInputSchema = z
	.object({
		id: z.number(),
		starred: z.boolean(),
	})
	.passthrough();

const SegmentEffortsGetInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const SegmentEffortsGetStreamsInputSchema = z
	.object({
		id: z.number(),
		keys: z.array(StreamKeySchema),
		key_by_type: z.boolean().optional(),
	})
	.passthrough();

const RoutesGetInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const RoutesGetStreamsInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const RoutesExportGpxInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const RoutesExportTcxInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const GearGetInputSchema = z
	.object({
		id: z.string(),
	})
	.passthrough();

const ClubsGetInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

const UploadsCreateInputSchema = z
	.object({
		// Strava POST /uploads is multipart/form-data; file must be a Blob or File object
		file: z.instanceof(Blob),
		data_type: z.enum(['fit', 'fit.gz', 'tcx', 'tcx.gz', 'gpx', 'gpx.gz']),
		name: z.string().optional(),
		description: z.string().optional(),
		trainer: z.string().optional(),
		commute: z.string().optional(),
		external_id: z.string().optional(),
	})
	.passthrough();

const UploadsGetInputSchema = z
	.object({
		id: z.number(),
	})
	.passthrough();

export const StravaEndpointInputSchemas = {
	activitiesCreate: ActivitiesCreateInputSchema,
	activitiesGet: ActivitiesGetInputSchema,
	activitiesList: ActivitiesListInputSchema,
	activitiesGetStreams: ActivitiesGetStreamsInputSchema,
	activitiesGetZones: ActivitiesGetZonesInputSchema,
	activitiesListComments: ActivitiesListCommentsInputSchema,
	activitiesListKudoers: ActivitiesListKudoersInputSchema,
	activitiesListLaps: ActivitiesListLapsInputSchema,
	athleteGet: AthleteGetInputSchema,
	athleteUpdate: AthleteUpdateInputSchema,
	athleteGetStats: AthleteGetStatsInputSchema,
	athleteGetZones: AthleteGetZonesInputSchema,
	segmentsExplore: SegmentsExploreInputSchema,
	segmentsGet: SegmentsGetInputSchema,
	segmentsGetStreams: SegmentsGetStreamsInputSchema,
	segmentsList: SegmentsListInputSchema,
	segmentsStar: SegmentsStarInputSchema,
	segmentEffortsGet: SegmentEffortsGetInputSchema,
	segmentEffortsGetStreams: SegmentEffortsGetStreamsInputSchema,
	routesGet: RoutesGetInputSchema,
	routesGetStreams: RoutesGetStreamsInputSchema,
	routesExportGpx: RoutesExportGpxInputSchema,
	routesExportTcx: RoutesExportTcxInputSchema,
	gearGet: GearGetInputSchema,
	clubsGet: ClubsGetInputSchema,
	uploadsCreate: UploadsCreateInputSchema,
	uploadsGet: UploadsGetInputSchema,
} as const;

export type StravaEndpointInputs = {
	[K in keyof typeof StravaEndpointInputSchemas]: z.infer<
		(typeof StravaEndpointInputSchemas)[K]
	>;
};

const ActivityResponseSchema = z
	.object({
		id: z.number(),
		name: z.string().optional(),
		sport_type: z.string().optional(),
		start_date: z.string().optional(),
		start_date_local: z.string().optional(),
		elapsed_time: z.number().optional(),
		moving_time: z.number().optional(),
		distance: z.number().optional(),
		total_elevation_gain: z.number().optional(),
		timezone: z.string().optional(),
		description: z.string().nullable().optional(),
		calories: z.number().optional(),
		map: z
			.object({
				id: z.string().optional(),
				polyline: z.string().nullable().optional(),
				summary_polyline: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		athlete: z.object({ id: z.number() }).passthrough().optional(),
		gear_id: z.string().nullable().optional(),
		commute: z.boolean().optional(),
		trainer: z.boolean().optional(),
		manual: z.boolean().optional(),
		private: z.boolean().optional(),
		resource_state: z.number().optional(),
		kudos_count: z.number().optional(),
		comment_count: z.number().optional(),
		athlete_count: z.number().optional(),
		photo_count: z.number().optional(),
		average_speed: z.number().optional(),
		max_speed: z.number().optional(),
		average_heartrate: z.number().optional(),
		max_heartrate: z.number().optional(),
		average_watts: z.number().optional(),
		max_watts: z.number().optional(),
		kilojoules: z.number().optional(),
		device_watts: z.boolean().optional(),
		has_heartrate: z.boolean().optional(),
		elev_high: z.number().optional(),
		elev_low: z.number().optional(),
		pr_count: z.number().optional(),
		suffer_score: z.number().nullable().optional(),
		workout_type: z.number().nullable().optional(),
		start_latlng: z.array(z.number()).optional(),
		end_latlng: z.array(z.number()).optional(),
		upload_id: z.number().nullable().optional(),
		external_id: z.string().nullable().optional(),
		has_kudoed: z.boolean().optional(),
		average_cadence: z.number().optional(),
		device_name: z.string().optional(),
	})
	.passthrough();

const GearSummarySchema = z
	.object({
		id: z.string(),
		primary: z.boolean().optional(),
		name: z.string().optional(),
		nickname: z.string().optional(),
		distance: z.number().optional(),
		converted_distance: z.number().optional(),
		resource_state: z.number().optional(),
		retired: z.boolean().optional(),
	})
	.passthrough();

const AthleteResponseSchema = z
	.object({
		id: z.number(),
		username: z.string().nullable().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		sex: z.string().nullable().optional(),
		premium: z.boolean().optional(),
		summit: z.boolean().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		follower_count: z.number().optional(),
		friend_count: z.number().optional(),
		measurement_preference: z.string().optional(),
		ftp: z.number().nullable().optional(),
		weight: z.number().nullable().optional(),
		profile: z.string().optional(),
		profile_medium: z.string().optional(),
		resource_state: z.number().optional(),
		bikes: z.array(GearSummarySchema).optional(),
		shoes: z.array(GearSummarySchema).optional(),
	})
	.passthrough();

const SegmentResponseSchema = z
	.object({
		id: z.number(),
		name: z.string().optional(),
		activity_type: z.string().optional(),
		distance: z.number().optional(),
		average_grade: z.number().optional(),
		maximum_grade: z.number().optional(),
		elevation_high: z.number().optional(),
		elevation_low: z.number().optional(),
		start_latlng: z.array(z.number()).optional(),
		end_latlng: z.array(z.number()).optional(),
		climb_category: z.number().optional(),
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		private: z.boolean().optional(),
		starred: z.boolean().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		total_elevation_gain: z.number().optional(),
		map: z
			.object({
				id: z.string().optional(),
				polyline: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		effort_count: z.number().optional(),
		athlete_count: z.number().optional(),
		hazardous: z.boolean().optional(),
		star_count: z.number().optional(),
	})
	.passthrough();

const SegmentEffortResponseSchema = z
	.object({
		id: z.number(),
		activity_id: z.number().optional(),
		athlete_id: z.number().optional(),
		segment: z.object({ id: z.number().optional() }).passthrough().optional(),
		name: z.string().optional(),
		elapsed_time: z.number().optional(),
		moving_time: z.number().optional(),
		start_date: z.string().optional(),
		start_date_local: z.string().optional(),
		distance: z.number().optional(),
		start_index: z.number().optional(),
		end_index: z.number().optional(),
		kom_rank: z.number().nullable().optional(),
		pr_rank: z.number().nullable().optional(),
		// Strava returns achievements as an array of objects with varying shapes
		achievements: z.array(z.unknown()).optional(),
		device_watts: z.boolean().optional(),
		average_watts: z.number().optional(),
		average_heartrate: z.number().optional(),
		max_heartrate: z.number().optional(),
		average_cadence: z.number().optional(),
		resource_state: z.number().optional(),
	})
	.passthrough();

const RouteResponseSchema = z
	.object({
		id: z.number(),
		athlete: z.object({ id: z.number().optional() }).passthrough().optional(),
		description: z.string().nullable().optional(),
		distance: z.number().optional(),
		elevation_gain: z.number().optional(),
		map: z
			.object({
				id: z.string().optional(),
				polyline: z.string().nullable().optional(),
			})
			.passthrough()
			.optional(),
		name: z.string().optional(),
		private: z.boolean().optional(),
		starred: z.boolean().optional(),
		timestamp: z.number().optional(),
		type: z.number().optional(),
		sub_type: z.number().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
		estimated_moving_time: z.number().optional(),
		// Strava route segments vary widely in structure
		segments: z.array(z.unknown()).optional(),
	})
	.passthrough();

const ClubResponseSchema = z
	.object({
		id: z.number(),
		name: z.string().optional(),
		profile: z.string().optional(),
		profile_medium: z.string().optional(),
		description: z.string().nullable().optional(),
		club_type: z.string().optional(),
		sport_type: z.string().optional(),
		city: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		country: z.string().nullable().optional(),
		private: z.boolean().optional(),
		member_count: z.number().optional(),
		featured: z.boolean().optional(),
		verified: z.boolean().optional(),
		url: z.string().optional(),
	})
	.passthrough();

const LapResponseSchema = z
	.object({
		id: z.number(),
		activity: z.object({ id: z.number().optional() }).passthrough().optional(),
		athlete: z.object({ id: z.number().optional() }).passthrough().optional(),
		average_cadence: z.number().optional(),
		average_speed: z.number().optional(),
		average_heartrate: z.number().optional(),
		average_watts: z.number().optional(),
		device_watts: z.boolean().optional(),
		distance: z.number().optional(),
		elapsed_time: z.number().optional(),
		end_index: z.number().optional(),
		lap_index: z.number().optional(),
		max_speed: z.number().optional(),
		max_heartrate: z.number().optional(),
		moving_time: z.number().optional(),
		name: z.string().optional(),
		pace_zone: z.number().optional(),
		resource_state: z.number().optional(),
		split: z.number().optional(),
		start_date: z.string().optional(),
		start_date_local: z.string().optional(),
		start_index: z.number().optional(),
		total_elevation_gain: z.number().optional(),
	})
	.passthrough();

const StreamItemSchema = z
	.object({
		type: z.string().optional(),
		// Stream data element type varies by stream key: integers, floats, booleans, or [lat,lng] pairs
		data: z.array(z.unknown()).optional(),
		series_type: z.string().optional(),
		original_size: z.number().optional(),
		resolution: z.string().optional(),
	})
	.passthrough();

const StreamSetResponseSchema = z
	.object({
		time: StreamItemSchema.optional(),
		distance: StreamItemSchema.optional(),
		latlng: StreamItemSchema.optional(),
		altitude: StreamItemSchema.optional(),
		velocity_smooth: StreamItemSchema.optional(),
		heartrate: StreamItemSchema.optional(),
		cadence: StreamItemSchema.optional(),
		watts: StreamItemSchema.optional(),
		temp: StreamItemSchema.optional(),
		moving: StreamItemSchema.optional(),
		grade_smooth: StreamItemSchema.optional(),
	})
	.passthrough();

const UploadResponseSchema = z
	.object({
		id: z.number(),
		external_id: z.string().nullable().optional(),
		error: z.string().nullable().optional(),
		status: z.string().optional(),
		activity_id: z.number().nullable().optional(),
	})
	.passthrough();

const ActivityZoneSchema = z
	.object({
		type: z.string().optional(),
		score: z.number().optional(),
		distribution_buckets: z
			.array(
				z
					.object({
						min: z.number().optional(),
						max: z.number().optional(),
						time: z.number().optional(),
					})
					.passthrough(),
			)
			.optional(),
		resource_state: z.number().optional(),
		sensor_based: z.boolean().optional(),
		points: z.number().optional(),
		custom_zones: z.boolean().optional(),
	})
	.passthrough();

const ActivityZonesResponseSchema = z.array(ActivityZoneSchema);

const ActivityTotalsSchema = z
	.object({
		count: z.number().optional(),
		distance: z.number().optional(),
		moving_time: z.number().optional(),
		elapsed_time: z.number().optional(),
		elevation_gain: z.number().optional(),
		achievement_count: z.number().optional(),
	})
	.passthrough();

const AthleteStatsResponseSchema = z
	.object({
		biggest_ride_distance: z.number().optional(),
		biggest_climb_elevation_gain: z.number().optional(),
		recent_ride_totals: ActivityTotalsSchema.optional(),
		recent_run_totals: ActivityTotalsSchema.optional(),
		recent_swim_totals: ActivityTotalsSchema.optional(),
		ytd_ride_totals: ActivityTotalsSchema.optional(),
		ytd_run_totals: ActivityTotalsSchema.optional(),
		ytd_swim_totals: ActivityTotalsSchema.optional(),
		all_ride_totals: ActivityTotalsSchema.optional(),
		all_run_totals: ActivityTotalsSchema.optional(),
		all_swim_totals: ActivityTotalsSchema.optional(),
	})
	.passthrough();

const ZoneBucketSchema = z
	.object({
		min: z.number().optional(),
		max: z.number().optional(),
	})
	.passthrough();

const AthleteZonesResponseSchema = z
	.object({
		heart_rate: z
			.object({
				custom_zones: z.boolean().optional(),
				zones: z.array(ZoneBucketSchema).optional(),
			})
			.passthrough()
			.optional(),
		power: z
			.object({
				zones: z.array(ZoneBucketSchema).optional(),
			})
			.passthrough()
			.optional(),
	})
	.passthrough();

const ExploreSegmentSchema = z
	.object({
		id: z.number().optional(),
		name: z.string().optional(),
		climb_category: z.number().optional(),
		climb_category_desc: z.string().optional(),
		avg_grade: z.number().optional(),
		start_latlng: z.array(z.number()).optional(),
		end_latlng: z.array(z.number()).optional(),
		elev_difference: z.number().optional(),
		distance: z.number().optional(),
		points: z.string().optional(),
		starred: z.boolean().optional(),
		resource_state: z.number().optional(),
		starred_date: z.string().nullable().optional(),
	})
	.passthrough();

const ExploreSegmentsResponseSchema = z
	.object({
		segments: z.array(ExploreSegmentSchema).optional(),
	})
	.passthrough();

const ActivityCommentSchema = z
	.object({
		id: z.number().optional(),
		activity_id: z.number().optional(),
		text: z.string().optional(),
		athlete: AthleteResponseSchema.optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

const AthleteSummarySchema = z
	.object({
		id: z.number().optional(),
		username: z.string().nullable().optional(),
		firstname: z.string().optional(),
		lastname: z.string().optional(),
		profile_medium: z.string().optional(),
		profile: z.string().optional(),
		resource_state: z.number().optional(),
	})
	.passthrough();

const GearResponseSchema = z
	.object({
		id: z.string(),
		primary: z.boolean().optional(),
		name: z.string().optional(),
		distance: z.number().optional(),
		brand_name: z.string().nullable().optional(),
		model_name: z.string().nullable().optional(),
		frame_type: z.number().nullable().optional(),
		description: z.string().nullable().optional(),
		athlete_id: z.number().optional(),
		resource_state: z.number().optional(),
		retired: z.boolean().optional(),
		converted_distance: z.number().optional(),
		notification_distance: z.number().optional(),
	})
	.passthrough();

const ActivitiesListResponseSchema = z.array(ActivityResponseSchema);
const ActivitiesListCommentsResponseSchema = z.array(ActivityCommentSchema);
const ActivitiesListKudoersResponseSchema = z.array(AthleteSummarySchema);
const ActivitiesListLapsResponseSchema = z.array(LapResponseSchema);
const SegmentsListResponseSchema = z.array(SegmentResponseSchema);

export const StravaEndpointOutputSchemas = {
	activitiesCreate: ActivityResponseSchema,
	activitiesGet: ActivityResponseSchema,
	activitiesList: ActivitiesListResponseSchema,
	activitiesGetStreams: StreamSetResponseSchema,
	activitiesGetZones: ActivityZonesResponseSchema,
	activitiesListComments: ActivitiesListCommentsResponseSchema,
	activitiesListKudoers: ActivitiesListKudoersResponseSchema,
	activitiesListLaps: ActivitiesListLapsResponseSchema,
	athleteGet: AthleteResponseSchema,
	athleteUpdate: AthleteResponseSchema,
	athleteGetStats: AthleteStatsResponseSchema,
	athleteGetZones: AthleteZonesResponseSchema,
	segmentsExplore: ExploreSegmentsResponseSchema,
	segmentsGet: SegmentResponseSchema,
	segmentsGetStreams: StreamSetResponseSchema,
	segmentsList: SegmentsListResponseSchema,
	segmentsStar: SegmentResponseSchema,
	segmentEffortsGet: SegmentEffortResponseSchema,
	segmentEffortsGetStreams: StreamSetResponseSchema,
	routesGet: RouteResponseSchema,
	routesGetStreams: StreamSetResponseSchema,
	routesExportGpx: z.string(),
	routesExportTcx: z.string(),
	gearGet: GearResponseSchema,
	clubsGet: ClubResponseSchema,
	uploadsCreate: UploadResponseSchema,
	uploadsGet: UploadResponseSchema,
} as const;

export type StravaEndpointOutputs = {
	[K in keyof typeof StravaEndpointOutputSchemas]: z.infer<
		(typeof StravaEndpointOutputSchemas)[K]
	>;
};

export type ActivityResponse = z.infer<typeof ActivityResponseSchema>;
export type AthleteResponse = z.infer<typeof AthleteResponseSchema>;
export type SegmentResponse = z.infer<typeof SegmentResponseSchema>;
export type SegmentEffortResponse = z.infer<typeof SegmentEffortResponseSchema>;
export type RouteResponse = z.infer<typeof RouteResponseSchema>;
export type ClubResponse = z.infer<typeof ClubResponseSchema>;
export type LapResponse = z.infer<typeof LapResponseSchema>;
export type GearResponse = z.infer<typeof GearResponseSchema>;
export type StreamSetResponse = z.infer<typeof StreamSetResponseSchema>;
export type UploadResponse = z.infer<typeof UploadResponseSchema>;
export type ActivityZonesResponse = z.infer<typeof ActivityZonesResponseSchema>;
export type AthleteStatsResponse = z.infer<typeof AthleteStatsResponseSchema>;
export type AthleteZonesResponse = z.infer<typeof AthleteZonesResponseSchema>;
export type ExploreSegmentsResponse = z.infer<
	typeof ExploreSegmentsResponseSchema
>;
export type ActivitiesListResponse = z.infer<
	typeof ActivitiesListResponseSchema
>;
export type ActivitiesListCommentsResponse = z.infer<
	typeof ActivitiesListCommentsResponseSchema
>;
export type ActivitiesListKudoersResponse = z.infer<
	typeof ActivitiesListKudoersResponseSchema
>;
export type ActivitiesListLapsResponse = z.infer<
	typeof ActivitiesListLapsResponseSchema
>;
export type SegmentsListResponse = z.infer<typeof SegmentsListResponseSchema>;

export type ActivitiesCreateInput = z.infer<typeof ActivitiesCreateInputSchema>;
export type ActivitiesGetInput = z.infer<typeof ActivitiesGetInputSchema>;
export type ActivitiesListInput = z.infer<typeof ActivitiesListInputSchema>;
export type ActivitiesGetStreamsInput = z.infer<
	typeof ActivitiesGetStreamsInputSchema
>;
export type ActivitiesGetZonesInput = z.infer<
	typeof ActivitiesGetZonesInputSchema
>;
export type ActivitiesListCommentsInput = z.infer<
	typeof ActivitiesListCommentsInputSchema
>;
export type ActivitiesListKudoersInput = z.infer<
	typeof ActivitiesListKudoersInputSchema
>;
export type ActivitiesListLapsInput = z.infer<
	typeof ActivitiesListLapsInputSchema
>;
export type AthleteGetInput = z.infer<typeof AthleteGetInputSchema>;
export type AthleteUpdateInput = z.infer<typeof AthleteUpdateInputSchema>;
export type AthleteGetStatsInput = z.infer<typeof AthleteGetStatsInputSchema>;
export type AthleteGetZonesInput = z.infer<typeof AthleteGetZonesInputSchema>;
export type SegmentsExploreInput = z.infer<typeof SegmentsExploreInputSchema>;
export type SegmentsGetInput = z.infer<typeof SegmentsGetInputSchema>;
export type SegmentsGetStreamsInput = z.infer<
	typeof SegmentsGetStreamsInputSchema
>;
export type SegmentsListInput = z.infer<typeof SegmentsListInputSchema>;
export type SegmentsStarInput = z.infer<typeof SegmentsStarInputSchema>;
export type SegmentEffortsGetInput = z.infer<
	typeof SegmentEffortsGetInputSchema
>;
export type SegmentEffortsGetStreamsInput = z.infer<
	typeof SegmentEffortsGetStreamsInputSchema
>;
export type RoutesGetInput = z.infer<typeof RoutesGetInputSchema>;
export type RoutesGetStreamsInput = z.infer<typeof RoutesGetStreamsInputSchema>;
export type RoutesExportGpxInput = z.infer<typeof RoutesExportGpxInputSchema>;
export type RoutesExportTcxInput = z.infer<typeof RoutesExportTcxInputSchema>;
export type GearGetInput = z.infer<typeof GearGetInputSchema>;
export type ClubsGetInput = z.infer<typeof ClubsGetInputSchema>;
export type UploadsCreateInput = z.infer<typeof UploadsCreateInputSchema>;
export type UploadsGetInput = z.infer<typeof UploadsGetInputSchema>;
