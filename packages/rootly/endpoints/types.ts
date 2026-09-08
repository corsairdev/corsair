import { z } from 'zod';

/**
 * JSON:API Resource Object.
 * Attributes and relationships are provider-defined JSON:API object mappings.
 */
const JsonApiResourceSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		/** Key-value record of provider-defined resource attributes */
		attributes: z.record(z.string(), z.unknown()).optional(),
		/** Key-value record of provider-defined related resource linkages */
		relationships: z.record(z.string(), z.unknown()).optional(),
	})
	.loose();

/**
 * JSON:API Single Resource Document.
 */
const JsonApiSingleResponseSchema = z
	.object({
		data: JsonApiResourceSchema,
		included: z.array(JsonApiResourceSchema).optional(),
	})
	.loose();

/**
 * JSON:API Top-Level Links Object containing pagination or resource URLs.
 */
const JsonApiLinksSchema = z
	.record(z.string(), z.string().nullable())
	.optional();

/**
 * JSON:API Top-Level Meta Object containing provider-defined response metadata.
 */
const JsonApiMetaSchema = z.record(z.string(), z.unknown()).optional();

/**
 * JSON:API Resource Collection Document.
 */
const JsonApiListResponseSchema = z
	.object({
		data: z.array(JsonApiResourceSchema),
		/** Pagination and navigational links */
		links: JsonApiLinksSchema,
		/** Pagination and response metadata */
		meta: JsonApiMetaSchema,
		included: z.array(JsonApiResourceSchema).optional(),
	})
	.loose();

/**
 * JSON:API Delete Response Document.
 */
const DeleteResponseSchema = z
	.object({
		data: JsonApiResourceSchema.optional(),
	})
	.loose();

/* -------------------------------------------------------------------------- */
/* Incident action items                                                      */
/* -------------------------------------------------------------------------- */

const ActionItemsListInputSchema = z.object({
	incident_id: z.string().min(1),
	include: z.string().optional(),
	page_number: z.number().int().positive().optional(),
	page_size: z.number().int().positive().optional(),
});

const ActionItemGetInputSchema = z.object({
	id: z.string().min(1),
});

const ActionItemDeleteInputSchema = z.object({
	id: z.string().min(1),
});

/* -------------------------------------------------------------------------- */
/* Incidents                                                                  */
/* -------------------------------------------------------------------------- */

const IncidentGetInputSchema = z.object({
	id: z.string().min(1),
});

const IncidentUpdateInputSchema = z.object({
	id: z.string().min(1),
	title: z.string().optional(),
	kind: z.string().optional(),
	parent_incident_id: z.string().nullable().optional(),
	duplicate_incident_id: z.string().nullable().optional(),
	summary: z.string().optional(),
	private: z.boolean().optional(),
	severity_id: z.string().optional(),
	public_title: z.string().optional(),
	alert_ids: z.array(z.string()).optional(),
	environment_ids: z.array(z.string()).optional(),
	incident_type_ids: z.array(z.string()).optional(),
	service_ids: z.array(z.string()).optional(),
	functionality_ids: z.array(z.string()).optional(),
	muted_service_ids: z.array(z.string()).optional(),
	cause_ids: z.array(z.string()).optional(),
	/** Key-value string labels assigned to the incident */
	labels: z.record(z.string(), z.string()).optional(),
	slack_channel_id: z.string().nullable().optional(),
	slack_channel_name: z.string().nullable().optional(),
	slack_channel_url: z.string().nullable().optional(),
	slack_channel_archived: z.boolean().optional(),
	google_drive_parent_id: z.string().nullable().optional(),
	google_drive_url: z.string().nullable().optional(),
	jira_issue_key: z.string().nullable().optional(),
	jira_issue_id: z.string().nullable().optional(),
	jira_issue_url: z.string().nullable().optional(),
	scheduled_for: z.string().nullable().optional(),
	scheduled_until: z.string().nullable().optional(),
	in_triage_at: z.string().nullable().optional(),
	started_at: z.string().nullable().optional(),
	detected_at: z.string().nullable().optional(),
	acknowledged_at: z.string().nullable().optional(),
	mitigated_at: z.string().nullable().optional(),
	resolved_at: z.string().nullable().optional(),
	closed_at: z.string().nullable().optional(),
	cancelled_at: z.string().nullable().optional(),
	mitigation_message: z.string().nullable().optional(),
	resolution_message: z.string().nullable().optional(),
	cancellation_message: z.string().nullable().optional(),
});

const IncidentDeleteInputSchema = z.object({
	id: z.string().min(1),
});

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ActionItemsListInput = z.infer<typeof ActionItemsListInputSchema>;
export type ActionItemGetInput = z.infer<typeof ActionItemGetInputSchema>;
export type ActionItemDeleteInput = z.infer<typeof ActionItemDeleteInputSchema>;

export type IncidentGetInput = z.infer<typeof IncidentGetInputSchema>;
export type IncidentUpdateInput = z.infer<typeof IncidentUpdateInputSchema>;
export type IncidentDeleteInput = z.infer<typeof IncidentDeleteInputSchema>;

export type ActionItemsListResponse = z.infer<typeof JsonApiListResponseSchema>;
export type ActionItemGetResponse = z.infer<typeof JsonApiSingleResponseSchema>;
export type ActionItemDeleteResponse = z.infer<typeof DeleteResponseSchema>;

export type IncidentGetResponse = z.infer<typeof JsonApiSingleResponseSchema>;
export type IncidentUpdateResponse = z.infer<
	typeof JsonApiSingleResponseSchema
>;
export type IncidentDeleteResponse = z.infer<typeof DeleteResponseSchema>;

export type RootlyEndpointInputs = {
	actionItemsList: ActionItemsListInput;
	actionItemGet: ActionItemGetInput;
	actionItemDelete: ActionItemDeleteInput;
	incidentGet: IncidentGetInput;
	incidentUpdate: IncidentUpdateInput;
	incidentDelete: IncidentDeleteInput;
};

export type RootlyEndpointOutputs = {
	actionItemsList: ActionItemsListResponse;
	actionItemGet: ActionItemGetResponse;
	actionItemDelete: ActionItemDeleteResponse;
	incidentGet: IncidentGetResponse;
	incidentUpdate: IncidentUpdateResponse;
	incidentDelete: IncidentDeleteResponse;
};

export const RootlyEndpointInputSchemas = {
	actionItemsList: ActionItemsListInputSchema,
	actionItemGet: ActionItemGetInputSchema,
	actionItemDelete: ActionItemDeleteInputSchema,
	incidentGet: IncidentGetInputSchema,
	incidentUpdate: IncidentUpdateInputSchema,
	incidentDelete: IncidentDeleteInputSchema,
} as const;

export const RootlyEndpointOutputSchemas = {
	actionItemsList: JsonApiListResponseSchema,
	actionItemGet: JsonApiSingleResponseSchema,
	actionItemDelete: DeleteResponseSchema,
	incidentGet: JsonApiSingleResponseSchema,
	incidentUpdate: JsonApiSingleResponseSchema,
	incidentDelete: DeleteResponseSchema,
} as const;
