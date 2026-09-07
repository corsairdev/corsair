import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared Sub-Schemas
// ─────────────────────────────────────────────────────────────────────────────

const UserCompactSchema = z.object({
	user_id: z.string(),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	email: z.string().optional(),
});

const TemplateCompactSchema = z.object({
	template_id: z.string(),
	name: z.string().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Inspections – List (GET /audits/search)
// ─────────────────────────────────────────────────────────────────────────────

export const InspectionsListInputSchema = z.object({
	/** Filter by template IDs */
	template: z.array(z.string()).optional(),
	/** Filter by modified after (ISO 8601) */
	modified_after: z.string().optional(),
	/** Filter by modified before (ISO 8601) */
	modified_before: z.string().optional(),
	/** Filter by completed status */
	completed: z.enum(['true', 'false', 'both']).optional(),
	/** Filter by archived status */
	archived: z.enum(['true', 'false', 'both']).optional(),
	/** Owner user ID filter */
	owner: z.string().optional(),
	/** Number of results per page */
	limit: z.number().int().min(1).max(1000).optional(),
	/** Pagination field (ISO 8601 modified_at of last item) */
	modified_after_cursor: z.string().optional(),
});

export type InspectionsListInput = z.infer<typeof InspectionsListInputSchema>;

const InspectionCompactSchema = z.object({
	audit_id: z.string(),
	template_id: z.string().optional(),
	template_name: z.string().optional(),
	audit_title: z.string().optional(),
	created_at: z.string().optional(),
	modified_at: z.string().optional(),
	completed_at: z.string().nullable().optional(),
	audit_owner: z.string().optional(),
	archived: z.boolean().optional(),
	site_id: z.string().nullable().optional(),
	date_started: z.string().nullable().optional(),
	date_completed: z.string().nullable().optional(),
	score: z.number().nullable().optional(),
	total_score: z.number().nullable().optional(),
	score_percentage: z.number().nullable().optional(),
	duration: z.number().nullable().optional(),
});

export const InspectionsListResponseSchema = z.object({
	count: z.number().optional(),
	total: z.number().optional(),
	audits: z.array(InspectionCompactSchema),
});

export type InspectionsListResponse = z.infer<
	typeof InspectionsListResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Inspections – Get by ID (GET /audits/{audit_id})
// ─────────────────────────────────────────────────────────────────────────────

export const InspectionGetInputSchema = z.object({
	/** The inspection (audit) ID to retrieve */
	audit_id: z.string(),
});

export type InspectionGetInput = z.infer<typeof InspectionGetInputSchema>;

const HeaderItemSchema = z.object({
	label: z.string().optional(),
	type: z.string().optional(),
	responses: z
		.object({
			text: z.string().optional(),
			datetime: z.string().nullable().optional(),
			location_text: z.string().optional(),
		})
		.optional(),
});

const AuditItemSchema = z.object({
	item_id: z.string().optional(),
	label: z.string().optional(),
	type: z.string().optional(),
	responses: z
		.object({
			text: z.string().optional(),
			selected: z
				.array(
					z.object({
						label: z.string().optional(),
						value: z.string().optional(),
					}),
				)
				.optional(),
		})
		.optional(),
	score: z.number().nullable().optional(),
	max_score: z.number().nullable().optional(),
	score_percentage: z.number().nullable().optional(),
	parent_id: z.string().nullable().optional(),
	combined_score: z.number().nullable().optional(),
	combined_max_score: z.number().nullable().optional(),
});

export const InspectionGetResponseSchema = z.object({
	audit_id: z.string(),
	template_id: z.string().optional(),
	audit_data: z
		.object({
			name: z.string().optional(),
			score: z.number().nullable().optional(),
			total_score: z.number().nullable().optional(),
			score_percentage: z.number().nullable().optional(),
			duration: z.number().nullable().optional(),
			authorship: z
				.object({
					device_id: z.string().optional(),
					owner: z.string().optional(),
					owner_id: z.string().optional(),
					author: z.string().optional(),
					author_id: z.string().optional(),
				})
				.optional(),
			date_started: z.string().nullable().optional(),
			date_completed: z.string().nullable().optional(),
			date_modified: z.string().nullable().optional(),
		})
		.optional(),
	header_items: z.array(HeaderItemSchema).optional(),
	items: z.array(AuditItemSchema).optional(),
	template_data: z
		.object({
			template_id: z.string().optional(),
			name: z.string().optional(),
			description: z.string().optional(),
		})
		.optional(),
});

export type InspectionGetResponse = z.infer<
	typeof InspectionGetResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Templates – List (GET /templates/search)
// ─────────────────────────────────────────────────────────────────────────────

export const TemplatesListInputSchema = z.object({
	/** Filter by modified after (ISO 8601) */
	modified_after: z.string().optional(),
	/** Filter by modified before (ISO 8601) */
	modified_before: z.string().optional(),
	/** Filter by archived status */
	archived: z.enum(['true', 'false', 'both']).optional(),
	/** Owner user ID filter */
	owner: z.string().optional(),
	/** Number of results per page */
	limit: z.number().int().min(1).max(1000).optional(),
});

export type TemplatesListInput = z.infer<typeof TemplatesListInputSchema>;

const TemplateFullSchema = z.object({
	template_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	created_at: z.string().optional(),
	modified_at: z.string().optional(),
	owner_name: z.string().optional(),
	owner_id: z.string().optional(),
	archived: z.boolean().optional(),
});

export const TemplatesListResponseSchema = z.object({
	count: z.number().optional(),
	total: z.number().optional(),
	templates: z.array(TemplateFullSchema),
});

export type TemplatesListResponse = z.infer<
	typeof TemplatesListResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Actions – List (GET /actions/search)
// ─────────────────────────────────────────────────────────────────────────────

export const ActionsListInputSchema = z.object({
	/** Filter by status */
	status: z
		.enum(['IN PROGRESS', 'DONE', 'OVERDUE', 'NONE', 'CLOSED'])
		.optional(),
	/** Filter by assignee user ID */
	assignee: z.string().optional(),
	/** Filter by created after (ISO 8601) */
	created_after: z.string().optional(),
	/** Filter by created before (ISO 8601) */
	created_before: z.string().optional(),
	/** Filter by modified after (ISO 8601) */
	modified_after: z.string().optional(),
	/** Filter by due date after (ISO 8601) */
	due_after: z.string().optional(),
	/** Filter by due date before (ISO 8601) */
	due_before: z.string().optional(),
	/** Number of results per page */
	limit: z.number().int().min(1).max(1000).optional(),
	/** Page offset */
	offset: z.number().int().min(0).optional(),
});

export type ActionsListInput = z.infer<typeof ActionsListInputSchema>;

const ActionSchema = z.object({
	action_id: z.string(),
	title: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	priority: z.string().nullable().optional(),
	assignee_id: z.string().nullable().optional(),
	assignee_name: z.string().nullable().optional(),
	creator_id: z.string().nullable().optional(),
	creator_name: z.string().nullable().optional(),
	audit_id: z.string().nullable().optional(),
	audit_title: z.string().nullable().optional(),
	template_id: z.string().nullable().optional(),
	due_at: z.string().nullable().optional(),
	created_at: z.string().optional(),
	modified_at: z.string().optional(),
	completed_at: z.string().nullable().optional(),
	site_id: z.string().nullable().optional(),
});

export const ActionsListResponseSchema = z.object({
	count: z.number().optional(),
	total: z.number().optional(),
	actions: z.array(ActionSchema),
});

export type ActionsListResponse = z.infer<typeof ActionsListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Users – List (GET /users)
// ─────────────────────────────────────────────────────────────────────────────

export const UsersListInputSchema = z.object({
	/** Number of results per page */
	limit: z.number().int().min(1).max(1000).optional(),
	/** Page offset */
	offset: z.number().int().min(0).optional(),
});

export type UsersListInput = z.infer<typeof UsersListInputSchema>;

const UserFullSchema = z.object({
	user_id: z.string(),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	email: z.string().optional(),
	status: z.string().optional(),
	organisation_id: z.string().optional(),
	last_seen_at: z.string().nullable().optional(),
});

export const UsersListResponseSchema = z.object({
	count: z.number().optional(),
	total: z.number().optional(),
	users: z.array(UserFullSchema),
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ─────────────────────────────────────────────────────────────────────────────
// Plugin endpoint input/output maps
// ─────────────────────────────────────────────────────────────────────────────

export type SafetyCultureEndpointInputs = {
	inspectionsList: InspectionsListInput;
	inspectionsGet: InspectionGetInput;
	templatesList: TemplatesListInput;
	actionsList: ActionsListInput;
	usersList: UsersListInput;
};

export type SafetyCultureEndpointOutputs = {
	inspectionsList: InspectionsListResponse;
	inspectionsGet: InspectionGetResponse;
	templatesList: TemplatesListResponse;
	actionsList: ActionsListResponse;
	usersList: UsersListResponse;
};

export const SafetyCultureEndpointInputSchemas = {
	inspectionsList: InspectionsListInputSchema,
	inspectionsGet: InspectionGetInputSchema,
	templatesList: TemplatesListInputSchema,
	actionsList: ActionsListInputSchema,
	usersList: UsersListInputSchema,
} as const;

export const SafetyCultureEndpointOutputSchemas = {
	inspectionsList: InspectionsListResponseSchema,
	inspectionsGet: InspectionGetResponseSchema,
	templatesList: TemplatesListResponseSchema,
	actionsList: ActionsListResponseSchema,
	usersList: UsersListResponseSchema,
} as const;
