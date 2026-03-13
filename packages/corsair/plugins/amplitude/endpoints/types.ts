import { z } from 'zod';

const AmplitudeEventObjectSchema = z.object({
	event_type: z.string(),
	user_id: z.string().optional(),
	device_id: z.string().optional(),
	time: z.number().optional(),
	// Event properties are open-ended key-value pairs
	event_properties: z.record(z.string(), z.unknown()).optional(),
	// User properties are open-ended key-value pairs
	user_properties: z.record(z.string(), z.unknown()).optional(),
	app_version: z.string().optional(),
	platform: z.string().optional(),
	os_name: z.string().optional(),
	os_version: z.string().optional(),
	device_brand: z.string().optional(),
	device_manufacturer: z.string().optional(),
	device_model: z.string().optional(),
	carrier: z.string().optional(),
	country: z.string().optional(),
	region: z.string().optional(),
	city: z.string().optional(),
	language: z.string().optional(),
	ip: z.string().optional(),
	insert_id: z.string().optional(),
	session_id: z.number().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// events.upload
// ─────────────────────────────────────────────────────────────────────────────

const EventsUploadInputSchema = z.object({
	api_key: z.string(),
	events: z.array(AmplitudeEventObjectSchema),
	options: z
		.object({
			min_id_length: z.number().optional(),
		})
		.optional(),
});

const EventsUploadResponseSchema = z.object({
	code: z.number(),
	events_ingested: z.number().optional(),
	payload_size_bytes: z.number().optional(),
	server_upload_time: z.number().optional(),
});

export type EventsUploadInput = z.infer<typeof EventsUploadInputSchema>;
export type EventsUploadResponse = z.infer<typeof EventsUploadResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// events.uploadBatch
// ─────────────────────────────────────────────────────────────────────────────

const EventsUploadBatchInputSchema = z.object({
	api_key: z.string(),
	events: z.array(AmplitudeEventObjectSchema),
	options: z
		.object({
			min_id_length: z.number().optional(),
		})
		.optional(),
});

const EventsUploadBatchResponseSchema = z.object({
	code: z.number(),
	events_ingested: z.number().optional(),
	payload_size_bytes: z.number().optional(),
	server_upload_time: z.number().optional(),
});

export type EventsUploadBatchInput = z.infer<
	typeof EventsUploadBatchInputSchema
>;
export type EventsUploadBatchResponse = z.infer<
	typeof EventsUploadBatchResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// events.identifyUser
// ─────────────────────────────────────────────────────────────────────────────

const IdentifyObjectSchema = z.object({
	user_id: z.string().optional(),
	device_id: z.string().optional(),
	// User properties to set are open-ended key-value pairs
	user_properties: z.record(z.string(), z.unknown()),
});

const EventsIdentifyUserInputSchema = z.object({
	api_key: z.string(),
	identification: z.array(IdentifyObjectSchema),
});

const EventsIdentifyUserResponseSchema = z.object({
	code: z.number(),
	error: z.string().optional(),
});

export type EventsIdentifyUserInput = z.infer<
	typeof EventsIdentifyUserInputSchema
>;
export type EventsIdentifyUserResponse = z.infer<
	typeof EventsIdentifyUserResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// events.getList
// ─────────────────────────────────────────────────────────────────────────────

const EventsGetListInputSchema = z.object({});

const EventsGetListResponseSchema = z.object({
	data: z
		.array(
			z.object({
				event_type: z.string().optional(),
				display_name: z.string().optional(),
				// Totals can be large integers
				totals: z.number().optional(),
				totals_delta: z.number().optional(),
				hidden: z.boolean().optional(),
				deleted: z.boolean().optional(),
				non_active: z.boolean().optional(),
			}),
		)
		.optional(),
});

export type EventsGetListInput = z.infer<typeof EventsGetListInputSchema>;
export type EventsGetListResponse = z.infer<typeof EventsGetListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// users.search
// ─────────────────────────────────────────────────────────────────────────────

const UsersSearchInputSchema = z.object({
	user: z.string(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const UsersSearchResponseSchema = z.object({
	matches: z
		.array(
			z.object({
				amplitude_id: z.number(),
				user_id: z.string().optional(),
				last_seen: z.number().optional(),
				is_identified: z.boolean().optional(),
				country: z.string().optional(),
				city: z.string().optional(),
				platform: z.string().optional(),
				os: z.string().optional(),
				device: z.string().optional(),
			}),
		)
		.optional(),
	next: z.string().optional(),
});

export type UsersSearchInput = z.infer<typeof UsersSearchInputSchema>;
export type UsersSearchResponse = z.infer<typeof UsersSearchResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// users.getProfile
// ─────────────────────────────────────────────────────────────────────────────

const UsersGetProfileInputSchema = z.object({
	user_id: z.string().optional(),
	amplitude_id: z.number().optional(),
});

const UsersGetProfileResponseSchema = z.object({
	userData: z
		.object({
			user_id: z.string().optional(),
			amplitude_id: z.number().optional(),
			canonical_amplitude_id: z.number().optional(),
			merged_amplitude_ids: z.array(z.number()).optional(),
			is_identified: z.boolean().optional(),
			// User properties are open-ended key-value pairs
			user_properties: z.record(z.string(), z.unknown()).optional(),
			country: z.string().optional(),
			region: z.string().optional(),
			city: z.string().optional(),
			language: z.string().optional(),
			platform: z.string().optional(),
			os: z.string().optional(),
			device: z.string().optional(),
			last_seen: z.number().optional(),
		})
		.optional(),
});

export type UsersGetProfileInput = z.infer<typeof UsersGetProfileInputSchema>;
export type UsersGetProfileResponse = z.infer<
	typeof UsersGetProfileResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// users.getActivity
// ─────────────────────────────────────────────────────────────────────────────

const UsersGetActivityInputSchema = z.object({
	user: z.number(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const UsersGetActivityResponseSchema = z.object({
	events: z
		.array(
			z.object({
				event_type: z.string().optional(),
				event_time: z.string().optional(),
				// Event properties are open-ended key-value pairs
				event_properties: z.record(z.string(), z.unknown()).optional(),
				session_id: z.number().optional(),
				amplitude_id: z.number().optional(),
			}),
		)
		.optional(),
	userData: z
		.object({
			num_events: z.number().optional(),
			num_sessions: z.number().optional(),
			first_used: z.string().optional(),
			last_used: z.string().optional(),
			canonical_amplitude_id: z.number().optional(),
		})
		.optional(),
});

export type UsersGetActivityInput = z.infer<typeof UsersGetActivityInputSchema>;
export type UsersGetActivityResponse = z.infer<
	typeof UsersGetActivityResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// cohorts.list
// ─────────────────────────────────────────────────────────────────────────────

const CohortsListInputSchema = z.object({});

const CohortsListResponseSchema = z.object({
	cohorts: z
		.array(
			z.object({
				id: z.string(),
				name: z.string(),
				owners: z.array(z.string()).optional(),
				description: z.string().nullable().optional(),
				published: z.boolean().optional(),
				archived: z.boolean().optional(),
				app_id: z.number().optional(),
				size: z.number().nullable().optional(),
				last_computed: z.number().optional(),
				last_modified: z.number().optional(),
				is_predefined: z.boolean().optional(),
				type: z.string().optional(),
			}),
		)
		.optional(),
});

export type CohortsListInput = z.infer<typeof CohortsListInputSchema>;
export type CohortsListResponse = z.infer<typeof CohortsListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// cohorts.get
// ─────────────────────────────────────────────────────────────────────────────

const CohortsGetInputSchema = z.object({
	cohort_id: z.string(),
});

const CohortsGetResponseSchema = z.object({
	cohort: z
		.object({
			id: z.string(),
			name: z.string(),
			owners: z.array(z.string()).optional(),
			description: z.string().nullable().optional(),
			published: z.boolean().optional(),
			archived: z.boolean().optional(),
			app_id: z.number().optional(),
			size: z.number().optional(),
			last_computed: z.number().optional(),
			last_modified: z.number().optional(),
			is_predefined: z.boolean().optional(),
			type: z.string().optional(),
		})
		.optional(),
});

export type CohortsGetInput = z.infer<typeof CohortsGetInputSchema>;
export type CohortsGetResponse = z.infer<typeof CohortsGetResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// cohorts.create
// ─────────────────────────────────────────────────────────────────────────────

const CohortsCreateInputSchema = z.object({
	name: z.string(),
	app_id: z.number(),
	id_type: z.enum(['BY_AMP_ID', 'BY_USER_ID', 'BY_DEVICE_ID']),
	ids: z.array(z.string()),
	owners: z.array(z.string()).optional(),
	description: z.string().optional(),
	published: z.boolean().optional(),
});

const CohortsCreateResponseSchema = z.object({
	cohort: z
		.object({
			id: z.string(),
			name: z.string(),
			size: z.number().optional(),
			last_computed: z.number().optional(),
		})
		.optional(),
});

export type CohortsCreateInput = z.infer<typeof CohortsCreateInputSchema>;
export type CohortsCreateResponse = z.infer<typeof CohortsCreateResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// cohorts.getMembers
// ─────────────────────────────────────────────────────────────────────────────

const CohortsGetMembersInputSchema = z.object({
	request_id: z.string(),
});

const CohortsGetMembersResponseSchema = z.object({
	status: z.string().optional(),
	zip_url: z.string().optional(),
});

export type CohortsGetMembersInput = z.infer<
	typeof CohortsGetMembersInputSchema
>;
export type CohortsGetMembersResponse = z.infer<
	typeof CohortsGetMembersResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// charts.get
// ─────────────────────────────────────────────────────────────────────────────

const ChartsGetInputSchema = z.object({
	chart_id: z.string(),
});

const ChartsGetResponseSchema = z.object({
	data: z
		.object({
			series: z
				.array(
					z.object({
						type: z.string().optional(),
						// Series data points are variable-structure arrays
						values: z.array(z.unknown()).optional(),
					}),
				)
				.optional(),
			xValues: z.array(z.string()).optional(),
		})
		.optional(),
	seriesLabels: z.array(z.string()).optional(),
	title: z.string().optional(),
});

export type ChartsGetInput = z.infer<typeof ChartsGetInputSchema>;
export type ChartsGetResponse = z.infer<typeof ChartsGetResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// dashboards.list
// ─────────────────────────────────────────────────────────────────────────────

const DashboardsListInputSchema = z.object({});

const DashboardsListResponseSchema = z.object({
	dashboards: z
		.array(
			z.object({
				id: z.number(),
				name: z.string(),
				description: z.string().optional(),
				created: z.string().optional(),
				lastUpdated: z.string().optional(),
				createdBy: z.string().optional(),
				published: z.boolean().optional(),
			}),
		)
		.optional(),
});

export type DashboardsListInput = z.infer<typeof DashboardsListInputSchema>;
export type DashboardsListResponse = z.infer<
	typeof DashboardsListResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// dashboards.get
// ─────────────────────────────────────────────────────────────────────────────

const DashboardsGetInputSchema = z.object({
	dashboard_id: z.number(),
});

const DashboardsGetResponseSchema = z.object({
	dashboard: z
		.object({
			id: z.number(),
			name: z.string(),
			description: z.string().optional(),
			created: z.string().optional(),
			lastUpdated: z.string().optional(),
			createdBy: z.string().optional(),
			published: z.boolean().optional(),
			charts: z
				.array(
					z.object({
						id: z.string(),
						name: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
});

export type DashboardsGetInput = z.infer<typeof DashboardsGetInputSchema>;
export type DashboardsGetResponse = z.infer<typeof DashboardsGetResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// annotations.list
// ─────────────────────────────────────────────────────────────────────────────

const AnnotationsListInputSchema = z.object({
	app_id: z.number().optional(),
});

const AnnotationsListResponseSchema = z.object({
	data: z
		.array(
			z.object({
				id: z.number(),
				date: z.string(),
				label: z.string(),
				details: z.string().optional(),
				app_id: z.number().optional(),
				source: z.string().optional(),
			}),
		)
		.optional(),
});

export type AnnotationsListInput = z.infer<typeof AnnotationsListInputSchema>;
export type AnnotationsListResponse = z.infer<
	typeof AnnotationsListResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// annotations.create
// ─────────────────────────────────────────────────────────────────────────────

const AnnotationsCreateInputSchema = z.object({
	date: z.string(),
	label: z.string(),
	details: z.string().optional(),
	app_id: z.number().optional(),
});

const AnnotationsCreateResponseSchema = z.object({
	data: z
		.object({
			id: z.number(),
			date: z.string(),
			label: z.string(),
			details: z.string().optional(),
			app_id: z.number().optional(),
		})
		.optional(),
});

export type AnnotationsCreateInput = z.infer<
	typeof AnnotationsCreateInputSchema
>;
export type AnnotationsCreateResponse = z.infer<
	typeof AnnotationsCreateResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// exports.getData
// ─────────────────────────────────────────────────────────────────────────────

const ExportsGetDataInputSchema = z.object({
	start: z.string(),
	end: z.string(),
});

const ExportsGetDataResponseSchema = z.object({
	// Export returns a zip file URL or binary data; only metadata is typed here
	status: z.string().optional(),
	url: z.string().optional(),
});

export type ExportsGetDataInput = z.infer<typeof ExportsGetDataInputSchema>;
export type ExportsGetDataResponse = z.infer<
	typeof ExportsGetDataResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Aggregated maps
// ─────────────────────────────────────────────────────────────────────────────

export type AmplitudeEndpointInputs = {
	eventsUpload: EventsUploadInput;
	eventsUploadBatch: EventsUploadBatchInput;
	eventsIdentifyUser: EventsIdentifyUserInput;
	eventsGetList: EventsGetListInput;
	usersSearch: UsersSearchInput;
	usersGetProfile: UsersGetProfileInput;
	usersGetActivity: UsersGetActivityInput;
	cohortsList: CohortsListInput;
	cohortsGet: CohortsGetInput;
	cohortsCreate: CohortsCreateInput;
	cohortsGetMembers: CohortsGetMembersInput;
	chartsGet: ChartsGetInput;
	dashboardsList: DashboardsListInput;
	dashboardsGet: DashboardsGetInput;
	annotationsList: AnnotationsListInput;
	annotationsCreate: AnnotationsCreateInput;
	exportsGetData: ExportsGetDataInput;
};

export type AmplitudeEndpointOutputs = {
	eventsUpload: EventsUploadResponse;
	eventsUploadBatch: EventsUploadBatchResponse;
	eventsIdentifyUser: EventsIdentifyUserResponse;
	eventsGetList: EventsGetListResponse;
	usersSearch: UsersSearchResponse;
	usersGetProfile: UsersGetProfileResponse;
	usersGetActivity: UsersGetActivityResponse;
	cohortsList: CohortsListResponse;
	cohortsGet: CohortsGetResponse;
	cohortsCreate: CohortsCreateResponse;
	cohortsGetMembers: CohortsGetMembersResponse;
	chartsGet: ChartsGetResponse;
	dashboardsList: DashboardsListResponse;
	dashboardsGet: DashboardsGetResponse;
	annotationsList: AnnotationsListResponse;
	annotationsCreate: AnnotationsCreateResponse;
	exportsGetData: ExportsGetDataResponse;
};

export const AmplitudeEndpointInputSchemas = {
	eventsUpload: EventsUploadInputSchema,
	eventsUploadBatch: EventsUploadBatchInputSchema,
	eventsIdentifyUser: EventsIdentifyUserInputSchema,
	eventsGetList: EventsGetListInputSchema,
	usersSearch: UsersSearchInputSchema,
	usersGetProfile: UsersGetProfileInputSchema,
	usersGetActivity: UsersGetActivityInputSchema,
	cohortsList: CohortsListInputSchema,
	cohortsGet: CohortsGetInputSchema,
	cohortsCreate: CohortsCreateInputSchema,
	cohortsGetMembers: CohortsGetMembersInputSchema,
	chartsGet: ChartsGetInputSchema,
	dashboardsList: DashboardsListInputSchema,
	dashboardsGet: DashboardsGetInputSchema,
	annotationsList: AnnotationsListInputSchema,
	annotationsCreate: AnnotationsCreateInputSchema,
	exportsGetData: ExportsGetDataInputSchema,
} as const;

export const AmplitudeEndpointOutputSchemas = {
	eventsUpload: EventsUploadResponseSchema,
	eventsUploadBatch: EventsUploadBatchResponseSchema,
	eventsIdentifyUser: EventsIdentifyUserResponseSchema,
	eventsGetList: EventsGetListResponseSchema,
	usersSearch: UsersSearchResponseSchema,
	usersGetProfile: UsersGetProfileResponseSchema,
	usersGetActivity: UsersGetActivityResponseSchema,
	cohortsList: CohortsListResponseSchema,
	cohortsGet: CohortsGetResponseSchema,
	cohortsCreate: CohortsCreateResponseSchema,
	cohortsGetMembers: CohortsGetMembersResponseSchema,
	chartsGet: ChartsGetResponseSchema,
	dashboardsList: DashboardsListResponseSchema,
	dashboardsGet: DashboardsGetResponseSchema,
	annotationsList: AnnotationsListResponseSchema,
	annotationsCreate: AnnotationsCreateResponseSchema,
	exportsGetData: ExportsGetDataResponseSchema,
} as const;
