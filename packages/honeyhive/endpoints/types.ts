import { z } from 'zod';

// ==========================================
// Shared Helpers & Primitives
// ==========================================

// `unknown` because arbitrary metadata/config/inputs/outputs can contain any valid JSON values.
export const JsonRecordSchema = z.record(z.string(), z.unknown());

// `unknown` because untyped provider values can be of any JSON primitive or compound type.
export const JsonUnknownSchema = z.unknown();

// `unknown` because array items are arbitrary untyped provider records.
export const JsonRecordArraySchema = z.array(JsonRecordSchema);

// ==========================================
// 1. Sessions Schemas
// ==========================================

export const SessionCreateInputSchema = z.strictObject({
	session_id: z.string().optional(),
	session_name: z.string().optional(),
	event_name: z.string().optional(),
	source: z.string().optional(),
	start_time: z.number().optional(),
	end_time: z.number().optional(),
	duration: z.number().optional(),
	config: JsonRecordSchema.optional(),
	inputs: JsonRecordSchema.optional(),
	outputs: JsonRecordSchema.optional(),
	metadata: JsonRecordSchema.optional(),
	user_properties: JsonRecordSchema.optional(),
	children_ids: z.array(z.string()).optional(),
});

// passthrough() because HoneyHive session events are extensible provider records.
export const SessionCreateResponseSchema = z
	.object({
		event_id: z.string().optional(),
		session_id: z.string().optional(),
		parent_id: z.string().nullable().optional(),
		children_ids: z.array(z.string()).optional(),
		event_type: z.string().optional(),
		event_name: z.string().optional(),
		config: JsonRecordSchema.optional(),
		inputs: JsonRecordSchema.optional(),
		outputs: JsonRecordSchema.optional(),
		error: JsonUnknownSchema.optional(),
		source: z.string().optional(),
		duration: z.number().optional(),
		user_properties: JsonRecordSchema.optional(),
		metrics: JsonRecordSchema.optional(),
		feedback: JsonRecordSchema.optional(),
		metadata: JsonRecordSchema.optional(),
		org_id: z.string().optional(),
		workspace_id: z.string().optional(),
		project_id: z.string().optional(),
		start_time: z.number().optional(),
		end_time: z.number().optional(),
	})
	.passthrough();

export const SessionEventBatchItemSchema = z.strictObject({
	event_type: z.enum(['chain', 'model', 'tool', 'session']),
	inputs: JsonRecordSchema,
	event_name: z.string().optional(),
	config: JsonRecordSchema.optional(),
	outputs: JsonRecordSchema.optional(),
	error: JsonUnknownSchema.optional(),
	duration: z.number().optional(),
	metadata: JsonRecordSchema.optional(),
	feedback: JsonRecordSchema.optional(),
	metrics: JsonRecordSchema.optional(),
	user_properties: JsonRecordSchema.optional(),
	start_time: z.number().optional(),
	end_time: z.number().optional(),
	children_ids: z.array(z.string()).optional(),
	parent_id: z.string().optional(),
	source: z.string().optional(),
});

export const SessionCreateEventBatchInputSchema = z.strictObject({
	session_id: z.string(),
	events: z.array(SessionEventBatchItemSchema),
});

export const SessionCreateEventBatchResponseSchema = z
	.object({
		success: z.boolean(),
	})
	.passthrough();

// ==========================================
// 2. Events Schemas
// ==========================================

export const EventCreateInputSchema = z.strictObject({
	project_id: z.string().optional(),
	source: z.string().optional(),
	event_name: z.string().optional(),
	event_type: z.string().optional(),
	event_id: z.string().optional(),
	session_id: z.string().optional(),
	parent_id: z.string().optional(),
	children_ids: z.array(z.string()).optional(),
	config: JsonRecordSchema.optional(),
	inputs: JsonRecordSchema.optional(),
	outputs: JsonRecordSchema.optional(),
	error: JsonUnknownSchema.optional(),
	start_time: z.number().optional(),
	end_time: z.number().optional(),
	duration: z.number().optional(),
	metadata: JsonRecordSchema.optional(),
	feedback: JsonRecordSchema.optional(),
	metrics: JsonRecordSchema.optional(),
	user_properties: JsonRecordSchema.optional(),
});

export const EventCreateResponseSchema = z
	.object({
		success: z.boolean(),
		event_id: z.string().optional(),
	})
	.passthrough();

export const EventCreateBatchInputSchema = z.strictObject({
	events: z.array(EventCreateInputSchema),
	single_session: z.boolean().optional(),
	session_properties: JsonRecordSchema.optional(),
});

export const EventCreateBatchResponseSchema = z
	.object({
		success: z.boolean(),
		event_ids: z.array(z.string()).optional(),
		session_id: z.string().optional(),
	})
	.passthrough();

export const EventGetInputSchema = z.strictObject({
	project_id: z.string(),
	event_id: z.string(),
});

export const EventGetLegacyInputSchema = z.strictObject({
	event_id: z.string(),
});

export const EventGetResponseSchema = z
	.object({
		event: JsonRecordSchema.optional(),
	})
	.passthrough();

export const EventUpdateInputSchema = z.strictObject({
	event_id: z.string(),
	event_name: z.string().optional(),
	metadata: JsonRecordSchema.optional(),
	feedback: JsonRecordSchema.optional(),
	metrics: JsonRecordSchema.optional(),
	outputs: JsonRecordSchema.optional(),
	config: JsonRecordSchema.optional(),
	user_properties: JsonRecordSchema.optional(),
	duration: z.number().optional(),
	end_time: z.number().optional(),
	children_ids: z.array(z.string()).optional(),
});

export const EventUpdateResponseSchema = z
	.object({
		success: z.boolean().optional(),
		event_id: z.string().optional(),
	})
	.passthrough();

export const EventFilterSchema = z.strictObject({
	field: z.string(),
	operator: z.string(),
	value: JsonUnknownSchema,
});

export const EventSearchInputSchema = z.strictObject({
	project_id: z.string(),
	filters: z.array(EventFilterSchema).optional(),
	dateRange: JsonRecordSchema.optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	ignore_order: z.boolean().optional(),
	evaluation_id: z.string().optional(),
});

export const EventSearchLegacyInputSchema = z.strictObject({
	filters: z.array(EventFilterSchema).optional(),
	dateRange: JsonRecordSchema.optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
	ignore_order: z.boolean().optional(),
	evaluation_id: z.string().optional(),
});

export const EventSearchResponseSchema = z
	.object({
		events: JsonRecordArraySchema.optional(),
		count: z.number().optional(),
	})
	.passthrough();

// ==========================================
// 3. Datasets Schemas
// ==========================================

export const DatasetsListInputSchema = z.strictObject({
	project_id: z.string(),
	dataset_id: z.string().optional(),
	name: z.string().optional(),
});

export const DatasetsListLegacyInputSchema = z.strictObject({
	dataset_id: z.string().optional(),
	name: z.string().optional(),
});

export const DatasetsListResponseSchema = z
	.object({
		datasets: JsonRecordArraySchema.optional(),
	})
	.passthrough();

export const DatasetsCreateInputSchema = z.strictObject({
	project_id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	datapoints: JsonRecordArraySchema.optional(),
});

export const DatasetsCreateLegacyInputSchema = z.strictObject({
	name: z.string(),
	description: z.string().optional(),
	datapoints: JsonRecordArraySchema.optional(),
});

export const DatasetsCreateResponseSchema = z
	.object({
		inserted: z.boolean().optional(),
		result: JsonRecordSchema.optional(),
	})
	.passthrough();

export const DatasetsUpdateInputSchema = z.strictObject({
	project_id: z.string(),
	dataset_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	datapoints: JsonRecordArraySchema.optional(),
});

export const DatasetsUpdateLegacyInputSchema = z.strictObject({
	dataset_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	datapoints: JsonRecordArraySchema.optional(),
});

export const DatasetsUpdateResponseSchema = z
	.object({
		result: JsonRecordSchema.optional(),
	})
	.passthrough();

export const DatasetsDeleteInputSchema = z.strictObject({
	project_id: z.string(),
	dataset_id: z.string(),
});

export const DatasetsDeleteLegacyInputSchema = z.strictObject({
	dataset_id: z.string(),
});

export const DatasetsDeleteResponseSchema = z
	.object({
		result: JsonUnknownSchema.optional(),
		success: z.boolean().optional(),
	})
	.passthrough();

export const DatasetsAddDatapointsInputSchema = z.strictObject({
	project_id: z.string(),
	dataset_id: z.string(),
	data: JsonRecordArraySchema,
	mapping: z.record(z.string(), z.string()).optional(),
});

export const DatasetsAddDatapointsResponseSchema = z
	.object({
		inserted: z.boolean().optional(),
		datapoint_ids: z.array(z.string()).optional(),
	})
	.passthrough();

export const DatasetsRemoveDatapointInputSchema = z.strictObject({
	project_id: z.string(),
	dataset_id: z.string(),
	datapoint_id: z.string(),
});

export const DatasetsRemoveDatapointResponseSchema = z
	.object({
		dereferenced: z.boolean().optional(),
		message: z.string().optional(),
	})
	.passthrough();

// ==========================================
// 4. Experiments Schemas
// ==========================================

export const ExperimentsListRunsInputSchema = z.strictObject({
	project_id: z.string(),
	dataset_id: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	run_ids: z.string().optional(),
	name: z.string().optional(),
	status: z.string().optional(),
	dateRange: z.string().optional(),
	sort_by: z.string().optional(),
	sort_order: z.enum(['asc', 'desc']).optional(),
});

export const ExperimentsListRunsLegacyInputSchema = z.strictObject({
	dataset_id: z.string().optional(),
	page: z.number().optional(),
	limit: z.number().optional(),
	run_ids: z.string().optional(),
	name: z.string().optional(),
	status: z.string().optional(),
	dateRange: z.string().optional(),
	sort_by: z.string().optional(),
	sort_order: z.enum(['asc', 'desc']).optional(),
});

export const ExperimentsListRunsResponseSchema = z
	.object({
		evaluations: JsonRecordArraySchema.optional(),
		pagination: JsonRecordSchema.optional(),
		metrics: JsonRecordArraySchema.optional(),
	})
	.passthrough();

export const ExperimentsCreateRunInputSchema = z.strictObject({
	project_id: z.string(),
	name: z.string(),
	run_id: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	metadata: JsonRecordSchema.optional(),
	results: JsonRecordArraySchema.optional(),
	dataset_id: z.string().optional(),
	event_ids: z.array(z.string()).optional(),
	configuration: JsonRecordSchema.optional(),
	evaluators: JsonRecordArraySchema.optional(),
	session_ids: z.array(z.string()).optional(),
	datapoint_ids: z.array(z.string()).optional(),
	passing_ranges: JsonRecordSchema.optional(),
});

export const ExperimentsCreateRunLegacyInputSchema = z.strictObject({
	name: z.string(),
	run_id: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	metadata: JsonRecordSchema.optional(),
	results: JsonRecordArraySchema.optional(),
	dataset_id: z.string().optional(),
	event_ids: z.array(z.string()).optional(),
	configuration: JsonRecordSchema.optional(),
	evaluators: JsonRecordArraySchema.optional(),
	session_ids: z.array(z.string()).optional(),
	datapoint_ids: z.array(z.string()).optional(),
	passing_ranges: JsonRecordSchema.optional(),
});

export const ExperimentsCreateRunResponseSchema = z
	.object({
		evaluation: JsonRecordSchema.optional(),
		run_id: z.string().optional(),
	})
	.passthrough();

export const ExperimentsGetRunInputSchema = z.strictObject({
	project_id: z.string(),
	run_id: z.string(),
});

export const ExperimentsGetRunLegacyInputSchema = z.strictObject({
	run_id: z.string(),
});

export const ExperimentsGetRunResponseSchema = z
	.object({
		evaluation: JsonRecordSchema.optional(),
	})
	.passthrough();

export const ExperimentsUpdateRunInputSchema = z.strictObject({
	project_id: z.string(),
	run_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	metadata: JsonRecordSchema.optional(),
	results: JsonRecordArraySchema.optional(),
	event_ids: z.array(z.string()).optional(),
	configuration: JsonRecordSchema.optional(),
	evaluators: JsonRecordArraySchema.optional(),
	session_ids: z.array(z.string()).optional(),
	datapoint_ids: z.array(z.string()).optional(),
	passing_ranges: JsonRecordSchema.optional(),
});

export const ExperimentsUpdateRunResponseSchema = z
	.object({
		evaluation: JsonRecordSchema.optional(),
		warning: z.string().optional(),
	})
	.passthrough();

export const ExperimentsDeleteRunInputSchema = z.strictObject({
	project_id: z.string(),
	run_id: z.string(),
});

export const ExperimentsDeleteRunResponseSchema = z
	.object({
		id: z.string().optional(),
		deleted: z.boolean().optional(),
	})
	.passthrough();

export const ExperimentsGetSummaryInputSchema = z.strictObject({
	project_id: z.string(),
	run_id: z.string(),
	aggregate_function: z.string().optional(),
	filters: z.string().optional(),
});

export const ExperimentsGetSummaryResponseSchema = z
	.object({
		status: z.string().optional(),
		success: z.boolean().optional(),
		error: JsonUnknownSchema.optional(),
		passed: z.number().optional(),
		failed: z.number().optional(),
		metrics: JsonRecordSchema.optional(),
		datapoints: JsonRecordArraySchema.optional(),
		event_details: JsonRecordSchema.optional(),
		run_object: JsonRecordSchema.optional(),
	})
	.passthrough();

export const ExperimentsGetMetricsInputSchema = z.strictObject({
	project_id: z.string(),
	run_id: z.string(),
	dateRange: z.string().optional(),
	filters: z.string().optional(),
});

export const ExperimentsGetMetricsResponseSchema = z
	.object({
		events: JsonRecordArraySchema.optional(),
		totalEvents: z.number().optional(),
	})
	.passthrough();

export const ExperimentsGetRunSchemaInputSchema = z.strictObject({
	project_id: z.string(),
	run_id: z.string(),
	dateRange: z.string().optional(),
});

export const ExperimentsGetRunSchemaResponseSchema = z
	.object({
		fields: JsonUnknownSchema.optional(),
		datasets: JsonUnknownSchema.optional(),
		mappings: JsonUnknownSchema.optional(),
	})
	.passthrough();

export const ExperimentsGetRunsSchemaInputSchema = z.strictObject({
	project_id: z.string(),
	dateRange: z.string().optional(),
});

export const ExperimentsGetRunsSchemaResponseSchema = z
	.object({
		fields: JsonUnknownSchema.optional(),
		datasets: JsonUnknownSchema.optional(),
		mappings: JsonUnknownSchema.optional(),
	})
	.passthrough();

export const ExperimentsCompareInputSchema = z.strictObject({
	project_id: z.string(),
	new_run_id: z.string(),
	old_run_id: z.string(),
	aggregate_function: z.string().optional(),
	filters: z.string().optional(),
});

export const ExperimentsCompareResponseSchema = z
	.object({
		metrics: JsonRecordSchema.optional(),
		commonDatapoints: JsonRecordArraySchema.optional(),
		event_details: JsonRecordSchema.optional(),
		old_run: JsonRecordSchema.optional(),
		new_run: JsonRecordSchema.optional(),
	})
	.passthrough();

export const ExperimentsCompareEventsInputSchema = z.strictObject({
	project_id: z.string(),
	new_run_id: z.string(),
	old_run_id: z.string(),
	event_name: z.string().optional(),
	event_type: z.string().optional(),
	filter: z.string().optional(),
	limit: z.number().optional(),
	page: z.number().optional(),
});

export const ExperimentsCompareEventsResponseSchema = z
	.object({
		events: JsonRecordArraySchema.optional(),
		totalEvents: z.number().optional(),
	})
	.passthrough();

// ==========================================
// 5. Metrics Schemas
// ==========================================

export const MetricsListInputSchema = z.strictObject({
	type: z.string().optional(),
	id: z.string().optional(),
});

export const MetricsListResponseSchema = z
	.object({
		metrics: JsonRecordArraySchema.optional(),
	})
	.passthrough();

export const MetricsCreateInputSchema = z.strictObject({
	name: z.string(),
	type: z.string(),
	criteria: z.string().optional(),
	description: z.string().optional(),
	return_type: z.string().optional(),
	enabled_in_prod: z.boolean().optional(),
	sampling_percentage: z.number().optional(),
	model_provider: z.string().optional(),
	model_name: z.string().optional(),
	scale: z.array(JsonUnknownSchema).optional(),
	threshold: z.number().optional(),
	categories: z.array(z.string()).optional(),
	needs_ground_truth: z.boolean().optional(),
	child_metrics: z.array(z.string()).optional(),
	filters: JsonRecordArraySchema.optional(),
});

export const MetricsCreateResponseSchema = z
	.object({
		inserted: z.boolean().optional(),
		metric_id: z.string().optional(),
	})
	.passthrough();

export const MetricsUpdateInputSchema = z.strictObject({
	metric_id: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	criteria: z.string().optional(),
	description: z.string().optional(),
	return_type: z.string().optional(),
	enabled_in_prod: z.boolean().optional(),
	sampling_percentage: z.number().optional(),
	model_provider: z.string().optional(),
	model_name: z.string().optional(),
	scale: z.array(JsonUnknownSchema).optional(),
	threshold: z.number().optional(),
	categories: z.array(z.string()).optional(),
	needs_ground_truth: z.boolean().optional(),
	child_metrics: z.array(z.string()).optional(),
	filters: JsonRecordArraySchema.optional(),
});

export const MetricsUpdateResponseSchema = z
	.object({
		updated: z.boolean().optional(),
	})
	.passthrough();

export const MetricsDeleteInputSchema = z.strictObject({
	metric_id: z.string(),
});

export const MetricsDeleteResponseSchema = z
	.object({
		deleted: z.boolean().optional(),
	})
	.passthrough();

export const MetricsRunInputSchema = z.strictObject({
	metric: JsonRecordSchema,
	event: JsonRecordSchema,
});

export const MetricsRunResponseSchema = z
	.object({
		success: z.boolean().optional(),
		loading: z.boolean().optional(),
		result: JsonUnknownSchema.optional(),
		explanation: z.string().optional(),
	})
	.passthrough();

export const MetricsListVersionsInputSchema = z.strictObject({
	metric_id: z.string(),
});

export const MetricsListVersionsResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: JsonRecordArraySchema.optional(),
	})
	.passthrough();

export const MetricsCreateVersionInputSchema = z.strictObject({
	metric_id: z.string(),
	message: z.string(),
	content: JsonRecordSchema.optional(),
	deploy_immediately: z.boolean().optional(),
});

export const MetricsCreateVersionResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: JsonRecordSchema.optional(),
	})
	.passthrough();

export const MetricsDeployVersionInputSchema = z.strictObject({
	metric_id: z.string(),
	version_name: z.string(),
});

export const MetricsDeployVersionResponseSchema = z
	.object({
		success: z.boolean().optional(),
		data: JsonRecordSchema.optional(),
	})
	.passthrough();

// ==========================================
// 6. Configurations Schemas
// ==========================================

export const ConfigurationsListInputSchema = z.strictObject({
	name: z.string().optional(),
	env: z.string().optional(),
	tags: z.string().optional(),
});

export const ConfigurationsListResponseSchema = z
	.object({
		configurations: JsonRecordArraySchema.optional(),
	})
	.passthrough();

export const ConfigurationsCreateInputSchema = z.strictObject({
	name: z.string(),
	type: z.string().optional(),
	provider: z.string().optional(),
	parameters: JsonRecordSchema.optional(),
	env: z.string().optional(),
	tags: z.array(z.string()).optional(),
	user_properties: JsonRecordSchema.optional(),
});

export const ConfigurationsCreateResponseSchema = z
	.object({
		acknowledged: z.boolean().optional(),
		insertedId: z.string().optional(),
	})
	.passthrough();

export const ConfigurationsUpdateInputSchema = z.strictObject({
	configId: z.string(),
	name: z.string().optional(),
	type: z.string().optional(),
	provider: z.string().optional(),
	parameters: JsonRecordSchema.optional(),
	env: z.string().optional(),
	tags: z.array(z.string()).optional(),
	user_properties: JsonRecordSchema.optional(),
});

export const ConfigurationsUpdateResponseSchema = z
	.object({
		acknowledged: z.boolean().optional(),
		modifiedCount: z.number().optional(),
		upsertedId: JsonUnknownSchema.optional(),
		upsertedCount: z.number().optional(),
		matchedCount: z.number().optional(),
	})
	.passthrough();

export const ConfigurationsDeleteInputSchema = z.strictObject({
	configId: z.string(),
});

export const ConfigurationsDeleteResponseSchema = z
	.object({
		acknowledged: z.boolean().optional(),
		deletedCount: z.number().optional(),
	})
	.passthrough();

// ==========================================
// 7. Projects Schemas
// ==========================================

export const ProjectsCreateInputSchema = z.strictObject({
	workspace_id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	project_creator: z.string().optional(),
});

export const ProjectsCreateResponseSchema = z
	.object({
		success: z.boolean(),
		data: JsonRecordSchema.optional(),
	})
	.passthrough();

export const ProjectsGetInputSchema = z.strictObject({
	project_id: z.string(),
});

export const ProjectsGetResponseSchema = z
	.object({
		success: z.boolean(),
		data: JsonRecordSchema.optional(),
	})
	.passthrough();

export const ProjectsUpdateInputSchema = z.strictObject({
	project_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
});

export const ProjectsUpdateResponseSchema = z
	.object({
		success: z.boolean(),
		data: JsonRecordSchema.optional(),
	})
	.passthrough();

export const ProjectsDeleteInputSchema = z.strictObject({
	project_id: z.string(),
});

export const ProjectsDeleteResponseSchema = z
	.object({
		success: z.boolean(),
		data: JsonRecordSchema.optional(),
	})
	.passthrough();

// ==========================================
// Exported TypeScript Types
// ==========================================

export type SessionsCreateInput = z.infer<typeof SessionCreateInputSchema>;
export type SessionsCreateResponse = z.infer<
	typeof SessionCreateResponseSchema
>;
export type SessionsCreateEventBatchInput = z.infer<
	typeof SessionCreateEventBatchInputSchema
>;
export type SessionsCreateEventBatchResponse = z.infer<
	typeof SessionCreateEventBatchResponseSchema
>;

export type EventsCreateInput = z.infer<typeof EventCreateInputSchema>;
export type EventsCreateResponse = z.infer<typeof EventCreateResponseSchema>;
export type EventsCreateBatchInput = z.infer<
	typeof EventCreateBatchInputSchema
>;
export type EventsCreateBatchResponse = z.infer<
	typeof EventCreateBatchResponseSchema
>;
export type EventsGetInput = z.infer<typeof EventGetInputSchema>;
export type EventsGetLegacyInput = z.infer<typeof EventGetLegacyInputSchema>;
export type EventsGetResponse = z.infer<typeof EventGetResponseSchema>;
export type EventsUpdateInput = z.infer<typeof EventUpdateInputSchema>;
export type EventsUpdateResponse = z.infer<typeof EventUpdateResponseSchema>;
export type EventsSearchInput = z.infer<typeof EventSearchInputSchema>;
export type EventsSearchLegacyInput = z.infer<
	typeof EventSearchLegacyInputSchema
>;
export type EventsSearchResponse = z.infer<typeof EventSearchResponseSchema>;

export type DatasetsListInput = z.infer<typeof DatasetsListInputSchema>;
export type DatasetsListLegacyInput = z.infer<
	typeof DatasetsListLegacyInputSchema
>;
export type DatasetsListResponse = z.infer<typeof DatasetsListResponseSchema>;
export type DatasetsCreateInput = z.infer<typeof DatasetsCreateInputSchema>;
export type DatasetsCreateLegacyInput = z.infer<
	typeof DatasetsCreateLegacyInputSchema
>;
export type DatasetsCreateResponse = z.infer<
	typeof DatasetsCreateResponseSchema
>;
export type DatasetsUpdateInput = z.infer<typeof DatasetsUpdateInputSchema>;
export type DatasetsUpdateLegacyInput = z.infer<
	typeof DatasetsUpdateLegacyInputSchema
>;
export type DatasetsUpdateResponse = z.infer<
	typeof DatasetsUpdateResponseSchema
>;
export type DatasetsDeleteInput = z.infer<typeof DatasetsDeleteInputSchema>;
export type DatasetsDeleteLegacyInput = z.infer<
	typeof DatasetsDeleteLegacyInputSchema
>;
export type DatasetsDeleteResponse = z.infer<
	typeof DatasetsDeleteResponseSchema
>;
export type DatasetsAddDatapointsInput = z.infer<
	typeof DatasetsAddDatapointsInputSchema
>;
export type DatasetsAddDatapointsResponse = z.infer<
	typeof DatasetsAddDatapointsResponseSchema
>;
export type DatasetsRemoveDatapointInput = z.infer<
	typeof DatasetsRemoveDatapointInputSchema
>;
export type DatasetsRemoveDatapointResponse = z.infer<
	typeof DatasetsRemoveDatapointResponseSchema
>;

export type ExperimentsListRunsInput = z.infer<
	typeof ExperimentsListRunsInputSchema
>;
export type ExperimentsListRunsLegacyInput = z.infer<
	typeof ExperimentsListRunsLegacyInputSchema
>;
export type ExperimentsListRunsResponse = z.infer<
	typeof ExperimentsListRunsResponseSchema
>;
export type ExperimentsCreateRunInput = z.infer<
	typeof ExperimentsCreateRunInputSchema
>;
export type ExperimentsCreateRunLegacyInput = z.infer<
	typeof ExperimentsCreateRunLegacyInputSchema
>;
export type ExperimentsCreateRunResponse = z.infer<
	typeof ExperimentsCreateRunResponseSchema
>;
export type ExperimentsGetRunInput = z.infer<
	typeof ExperimentsGetRunInputSchema
>;
export type ExperimentsGetRunLegacyInput = z.infer<
	typeof ExperimentsGetRunLegacyInputSchema
>;
export type ExperimentsGetRunResponse = z.infer<
	typeof ExperimentsGetRunResponseSchema
>;
export type ExperimentsUpdateRunInput = z.infer<
	typeof ExperimentsUpdateRunInputSchema
>;
export type ExperimentsUpdateRunResponse = z.infer<
	typeof ExperimentsUpdateRunResponseSchema
>;
export type ExperimentsDeleteRunInput = z.infer<
	typeof ExperimentsDeleteRunInputSchema
>;
export type ExperimentsDeleteRunResponse = z.infer<
	typeof ExperimentsDeleteRunResponseSchema
>;
export type ExperimentsGetSummaryInput = z.infer<
	typeof ExperimentsGetSummaryInputSchema
>;
export type ExperimentsGetSummaryResponse = z.infer<
	typeof ExperimentsGetSummaryResponseSchema
>;
export type ExperimentsGetMetricsInput = z.infer<
	typeof ExperimentsGetMetricsInputSchema
>;
export type ExperimentsGetMetricsResponse = z.infer<
	typeof ExperimentsGetMetricsResponseSchema
>;
export type ExperimentsGetRunSchemaInput = z.infer<
	typeof ExperimentsGetRunSchemaInputSchema
>;
export type ExperimentsGetRunSchemaResponse = z.infer<
	typeof ExperimentsGetRunSchemaResponseSchema
>;
export type ExperimentsGetRunsSchemaInput = z.infer<
	typeof ExperimentsGetRunsSchemaInputSchema
>;
export type ExperimentsGetRunsSchemaResponse = z.infer<
	typeof ExperimentsGetRunsSchemaResponseSchema
>;
export type ExperimentsCompareInput = z.infer<
	typeof ExperimentsCompareInputSchema
>;
export type ExperimentsCompareResponse = z.infer<
	typeof ExperimentsCompareResponseSchema
>;
export type ExperimentsCompareEventsInput = z.infer<
	typeof ExperimentsCompareEventsInputSchema
>;
export type ExperimentsCompareEventsResponse = z.infer<
	typeof ExperimentsCompareEventsResponseSchema
>;

export type MetricsListInput = z.infer<typeof MetricsListInputSchema>;
export type MetricsListResponse = z.infer<typeof MetricsListResponseSchema>;
export type MetricsCreateInput = z.infer<typeof MetricsCreateInputSchema>;
export type MetricsCreateResponse = z.infer<typeof MetricsCreateResponseSchema>;
export type MetricsUpdateInput = z.infer<typeof MetricsUpdateInputSchema>;
export type MetricsUpdateResponse = z.infer<typeof MetricsUpdateResponseSchema>;
export type MetricsDeleteInput = z.infer<typeof MetricsDeleteInputSchema>;
export type MetricsDeleteResponse = z.infer<typeof MetricsDeleteResponseSchema>;
export type MetricsRunInput = z.infer<typeof MetricsRunInputSchema>;
export type MetricsRunResponse = z.infer<typeof MetricsRunResponseSchema>;
export type MetricsListVersionsInput = z.infer<
	typeof MetricsListVersionsInputSchema
>;
export type MetricsListVersionsResponse = z.infer<
	typeof MetricsListVersionsResponseSchema
>;
export type MetricsCreateVersionInput = z.infer<
	typeof MetricsCreateVersionInputSchema
>;
export type MetricsCreateVersionResponse = z.infer<
	typeof MetricsCreateVersionResponseSchema
>;
export type MetricsDeployVersionInput = z.infer<
	typeof MetricsDeployVersionInputSchema
>;
export type MetricsDeployVersionResponse = z.infer<
	typeof MetricsDeployVersionResponseSchema
>;

export type ConfigurationsListInput = z.infer<
	typeof ConfigurationsListInputSchema
>;
export type ConfigurationsListResponse = z.infer<
	typeof ConfigurationsListResponseSchema
>;
export type ConfigurationsCreateInput = z.infer<
	typeof ConfigurationsCreateInputSchema
>;
export type ConfigurationsCreateResponse = z.infer<
	typeof ConfigurationsCreateResponseSchema
>;
export type ConfigurationsUpdateInput = z.infer<
	typeof ConfigurationsUpdateInputSchema
>;
export type ConfigurationsUpdateResponse = z.infer<
	typeof ConfigurationsUpdateResponseSchema
>;
export type ConfigurationsDeleteInput = z.infer<
	typeof ConfigurationsDeleteInputSchema
>;
export type ConfigurationsDeleteResponse = z.infer<
	typeof ConfigurationsDeleteResponseSchema
>;

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;
export type ProjectsGetResponse = z.infer<typeof ProjectsGetResponseSchema>;
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;
export type ProjectsUpdateResponse = z.infer<
	typeof ProjectsUpdateResponseSchema
>;
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

export type HoneyHiveEndpointInputs = {
	sessionsCreate: SessionsCreateInput;
	sessionsCreateEventBatch: SessionsCreateEventBatchInput;

	eventsCreate: EventsCreateInput;
	eventsCreateBatch: EventsCreateBatchInput;
	eventsGet: EventsGetInput;
	eventsGetLegacy: EventsGetLegacyInput;
	eventsUpdate: EventsUpdateInput;
	eventsSearch: EventsSearchInput;
	eventsSearchLegacy: EventsSearchLegacyInput;

	datasetsList: DatasetsListInput;
	datasetsCreate: DatasetsCreateInput;
	datasetsUpdate: DatasetsUpdateInput;
	datasetsDelete: DatasetsDeleteInput;
	datasetsAddDatapoints: DatasetsAddDatapointsInput;
	datasetsRemoveDatapoint: DatasetsRemoveDatapointInput;
	datasetsListLegacy: DatasetsListLegacyInput;
	datasetsCreateLegacy: DatasetsCreateLegacyInput;
	datasetsUpdateLegacy: DatasetsUpdateLegacyInput;
	datasetsDeleteLegacy: DatasetsDeleteLegacyInput;

	experimentsListRuns: ExperimentsListRunsInput;
	experimentsCreateRun: ExperimentsCreateRunInput;
	experimentsGetRun: ExperimentsGetRunInput;
	experimentsUpdateRun: ExperimentsUpdateRunInput;
	experimentsDeleteRun: ExperimentsDeleteRunInput;
	experimentsGetSummary: ExperimentsGetSummaryInput;
	experimentsGetMetrics: ExperimentsGetMetricsInput;
	experimentsGetRunSchema: ExperimentsGetRunSchemaInput;
	experimentsGetRunsSchema: ExperimentsGetRunsSchemaInput;
	experimentsCompare: ExperimentsCompareInput;
	experimentsCompareEvents: ExperimentsCompareEventsInput;
	experimentsListRunsLegacy: ExperimentsListRunsLegacyInput;
	experimentsCreateRunLegacy: ExperimentsCreateRunLegacyInput;
	experimentsGetRunLegacy: ExperimentsGetRunLegacyInput;

	metricsList: MetricsListInput;
	metricsCreate: MetricsCreateInput;
	metricsUpdate: MetricsUpdateInput;
	metricsDelete: MetricsDeleteInput;
	metricsRun: MetricsRunInput;
	metricsListVersions: MetricsListVersionsInput;
	metricsCreateVersion: MetricsCreateVersionInput;
	metricsDeployVersion: MetricsDeployVersionInput;

	configurationsList: ConfigurationsListInput;
	configurationsCreate: ConfigurationsCreateInput;
	configurationsUpdate: ConfigurationsUpdateInput;
	configurationsDelete: ConfigurationsDeleteInput;

	projectsCreate: ProjectsCreateInput;
	projectsGet: ProjectsGetInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
};

export type HoneyHiveEndpointOutputs = {
	sessionsCreate: SessionsCreateResponse;
	sessionsCreateEventBatch: SessionsCreateEventBatchResponse;

	eventsCreate: EventsCreateResponse;
	eventsCreateBatch: EventsCreateBatchResponse;
	eventsGet: EventsGetResponse;
	eventsGetLegacy: EventsGetResponse;
	eventsUpdate: EventsUpdateResponse;
	eventsSearch: EventsSearchResponse;
	eventsSearchLegacy: EventsSearchResponse;

	datasetsList: DatasetsListResponse;
	datasetsCreate: DatasetsCreateResponse;
	datasetsUpdate: DatasetsUpdateResponse;
	datasetsDelete: DatasetsDeleteResponse;
	datasetsAddDatapoints: DatasetsAddDatapointsResponse;
	datasetsRemoveDatapoint: DatasetsRemoveDatapointResponse;
	datasetsListLegacy: DatasetsListResponse;
	datasetsCreateLegacy: DatasetsCreateResponse;
	datasetsUpdateLegacy: DatasetsUpdateResponse;
	datasetsDeleteLegacy: DatasetsDeleteResponse;

	experimentsListRuns: ExperimentsListRunsResponse;
	experimentsCreateRun: ExperimentsCreateRunResponse;
	experimentsGetRun: ExperimentsGetRunResponse;
	experimentsUpdateRun: ExperimentsUpdateRunResponse;
	experimentsDeleteRun: ExperimentsDeleteRunResponse;
	experimentsGetSummary: ExperimentsGetSummaryResponse;
	experimentsGetMetrics: ExperimentsGetMetricsResponse;
	experimentsGetRunSchema: ExperimentsGetRunSchemaResponse;
	experimentsGetRunsSchema: ExperimentsGetRunsSchemaResponse;
	experimentsCompare: ExperimentsCompareResponse;
	experimentsCompareEvents: ExperimentsCompareEventsResponse;
	experimentsListRunsLegacy: ExperimentsListRunsResponse;
	experimentsCreateRunLegacy: ExperimentsCreateRunResponse;
	experimentsGetRunLegacy: ExperimentsGetRunResponse;

	metricsList: MetricsListResponse;
	metricsCreate: MetricsCreateResponse;
	metricsUpdate: MetricsUpdateResponse;
	metricsDelete: MetricsDeleteResponse;
	metricsRun: MetricsRunResponse;
	metricsListVersions: MetricsListVersionsResponse;
	metricsCreateVersion: MetricsCreateVersionResponse;
	metricsDeployVersion: MetricsDeployVersionResponse;

	configurationsList: ConfigurationsListResponse;
	configurationsCreate: ConfigurationsCreateResponse;
	configurationsUpdate: ConfigurationsUpdateResponse;
	configurationsDelete: ConfigurationsDeleteResponse;

	projectsCreate: ProjectsCreateResponse;
	projectsGet: ProjectsGetResponse;
	projectsUpdate: ProjectsUpdateResponse;
	projectsDelete: ProjectsDeleteResponse;
};

export const HoneyHiveEndpointInputSchemas = {
	sessionsCreate: SessionCreateInputSchema,
	sessionsCreateEventBatch: SessionCreateEventBatchInputSchema,

	eventsCreate: EventCreateInputSchema,
	eventsCreateBatch: EventCreateBatchInputSchema,
	eventsGet: EventGetInputSchema,
	eventsGetLegacy: EventGetLegacyInputSchema,
	eventsUpdate: EventUpdateInputSchema,
	eventsSearch: EventSearchInputSchema,
	eventsSearchLegacy: EventSearchLegacyInputSchema,

	datasetsList: DatasetsListInputSchema,
	datasetsCreate: DatasetsCreateInputSchema,
	datasetsUpdate: DatasetsUpdateInputSchema,
	datasetsDelete: DatasetsDeleteInputSchema,
	datasetsAddDatapoints: DatasetsAddDatapointsInputSchema,
	datasetsRemoveDatapoint: DatasetsRemoveDatapointInputSchema,
	datasetsListLegacy: DatasetsListLegacyInputSchema,
	datasetsCreateLegacy: DatasetsCreateLegacyInputSchema,
	datasetsUpdateLegacy: DatasetsUpdateLegacyInputSchema,
	datasetsDeleteLegacy: DatasetsDeleteLegacyInputSchema,

	experimentsListRuns: ExperimentsListRunsInputSchema,
	experimentsCreateRun: ExperimentsCreateRunInputSchema,
	experimentsGetRun: ExperimentsGetRunInputSchema,
	experimentsUpdateRun: ExperimentsUpdateRunInputSchema,
	experimentsDeleteRun: ExperimentsDeleteRunInputSchema,
	experimentsGetSummary: ExperimentsGetSummaryInputSchema,
	experimentsGetMetrics: ExperimentsGetMetricsInputSchema,
	experimentsGetRunSchema: ExperimentsGetRunSchemaInputSchema,
	experimentsGetRunsSchema: ExperimentsGetRunsSchemaInputSchema,
	experimentsCompare: ExperimentsCompareInputSchema,
	experimentsCompareEvents: ExperimentsCompareEventsInputSchema,
	experimentsListRunsLegacy: ExperimentsListRunsLegacyInputSchema,
	experimentsCreateRunLegacy: ExperimentsCreateRunLegacyInputSchema,
	experimentsGetRunLegacy: ExperimentsGetRunLegacyInputSchema,

	metricsList: MetricsListInputSchema,
	metricsCreate: MetricsCreateInputSchema,
	metricsUpdate: MetricsUpdateInputSchema,
	metricsDelete: MetricsDeleteInputSchema,
	metricsRun: MetricsRunInputSchema,
	metricsListVersions: MetricsListVersionsInputSchema,
	metricsCreateVersion: MetricsCreateVersionInputSchema,
	metricsDeployVersion: MetricsDeployVersionInputSchema,

	configurationsList: ConfigurationsListInputSchema,
	configurationsCreate: ConfigurationsCreateInputSchema,
	configurationsUpdate: ConfigurationsUpdateInputSchema,
	configurationsDelete: ConfigurationsDeleteInputSchema,

	projectsCreate: ProjectsCreateInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
} as const;

export const HoneyHiveEndpointOutputSchemas = {
	sessionsCreate: SessionCreateResponseSchema,
	sessionsCreateEventBatch: SessionCreateEventBatchResponseSchema,

	eventsCreate: EventCreateResponseSchema,
	eventsCreateBatch: EventCreateBatchResponseSchema,
	eventsGet: EventGetResponseSchema,
	eventsGetLegacy: EventGetResponseSchema,
	eventsUpdate: EventUpdateResponseSchema,
	eventsSearch: EventSearchResponseSchema,
	eventsSearchLegacy: EventSearchResponseSchema,

	datasetsList: DatasetsListResponseSchema,
	datasetsCreate: DatasetsCreateResponseSchema,
	datasetsUpdate: DatasetsUpdateResponseSchema,
	datasetsDelete: DatasetsDeleteResponseSchema,
	datasetsAddDatapoints: DatasetsAddDatapointsResponseSchema,
	datasetsRemoveDatapoint: DatasetsRemoveDatapointResponseSchema,
	datasetsListLegacy: DatasetsListResponseSchema,
	datasetsCreateLegacy: DatasetsCreateResponseSchema,
	datasetsUpdateLegacy: DatasetsUpdateResponseSchema,
	datasetsDeleteLegacy: DatasetsDeleteResponseSchema,

	experimentsListRuns: ExperimentsListRunsResponseSchema,
	experimentsCreateRun: ExperimentsCreateRunResponseSchema,
	experimentsGetRun: ExperimentsGetRunResponseSchema,
	experimentsUpdateRun: ExperimentsUpdateRunResponseSchema,
	experimentsDeleteRun: ExperimentsDeleteRunResponseSchema,
	experimentsGetSummary: ExperimentsGetSummaryResponseSchema,
	experimentsGetMetrics: ExperimentsGetMetricsResponseSchema,
	experimentsGetRunSchema: ExperimentsGetRunSchemaResponseSchema,
	experimentsGetRunsSchema: ExperimentsGetRunsSchemaResponseSchema,
	experimentsCompare: ExperimentsCompareResponseSchema,
	experimentsCompareEvents: ExperimentsCompareEventsResponseSchema,
	experimentsListRunsLegacy: ExperimentsListRunsResponseSchema,
	experimentsCreateRunLegacy: ExperimentsCreateRunResponseSchema,
	experimentsGetRunLegacy: ExperimentsGetRunResponseSchema,

	metricsList: MetricsListResponseSchema,
	metricsCreate: MetricsCreateResponseSchema,
	metricsUpdate: MetricsUpdateResponseSchema,
	metricsDelete: MetricsDeleteResponseSchema,
	metricsRun: MetricsRunResponseSchema,
	metricsListVersions: MetricsListVersionsResponseSchema,
	metricsCreateVersion: MetricsCreateVersionResponseSchema,
	metricsDeployVersion: MetricsDeployVersionResponseSchema,

	configurationsList: ConfigurationsListResponseSchema,
	configurationsCreate: ConfigurationsCreateResponseSchema,
	configurationsUpdate: ConfigurationsUpdateResponseSchema,
	configurationsDelete: ConfigurationsDeleteResponseSchema,

	projectsCreate: ProjectsCreateResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
} as const;
