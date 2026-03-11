import { z } from 'zod';

// ── Shared Sub-schemas ───────────────────────────────────────────────────────

const PagerdutyReferenceSchema = z.object({
	id: z.string(),
	type: z.string(),
	summary: z.string().optional(),
	html_url: z.string().nullable().optional(),
});

const PagerdutyIncidentBodySchema = z.object({
	type: z.string().optional(),
	details: z.string().optional(),
});

const PagerdutyIncidentSchema = z.object({
	id: z.string(),
	incident_number: z.number().optional(),
	title: z.string().optional(),
	status: z.enum(['triggered', 'acknowledged', 'resolved']).optional(),
	urgency: z.enum(['high', 'low']).optional(),
	html_url: z.string().optional(),
	created_at: z.string().optional(),
	updated_at: z.string().optional(),
	resolved_at: z.string().nullable().optional(),
	service: PagerdutyReferenceSchema.optional(),
	escalation_policy: PagerdutyReferenceSchema.optional(),
	teams: z.array(PagerdutyReferenceSchema).optional(),
	assignments: z
		.array(
			z.object({
				at: z.string(),
				assignee: PagerdutyReferenceSchema,
			}),
		)
		.optional(),
	body: PagerdutyIncidentBodySchema.optional(),
});

const PagerdutyIncidentNoteSchema = z.object({
	id: z.string(),
	content: z.string().optional(),
	created_at: z.string().optional(),
	user: PagerdutyReferenceSchema.optional(),
	channel: z
		.object({
			type: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
});

const PagerdutyLogEntrySchema = z.object({
	id: z.string(),
	type: z.string().optional(),
	summary: z.string().optional(),
	created_at: z.string().optional(),
	html_url: z.string().nullable().optional(),
	incident: PagerdutyReferenceSchema.optional(),
	service: PagerdutyReferenceSchema.optional(),
	teams: z.array(PagerdutyReferenceSchema).optional(),
	agent: PagerdutyReferenceSchema.optional(),
	channel: z
		.object({
			type: z.string(),
			name: z.string().optional(),
		})
		.optional(),
});

const PagerdutyUserSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	role: z.string().optional(),
	description: z.string().nullable().optional(),
	time_zone: z.string().optional(),
	html_url: z.string().optional(),
	avatar_url: z.string().optional(),
	color: z.string().optional(),
	contact_methods: z.array(PagerdutyReferenceSchema).optional(),
	notification_rules: z.array(PagerdutyReferenceSchema).optional(),
	teams: z.array(PagerdutyReferenceSchema).optional(),
});

// ── Input Schemas ─────────────────────────────────────────────────────────────

const IncidentsCreateInputSchema = z.object({
	title: z.string(),
	service: z.object({
		id: z.string(),
		type: z.literal('service_reference'),
	}),
	urgency: z.enum(['high', 'low']).optional(),
	body: z
		.object({
			type: z.literal('incident_body'),
			details: z.string(),
		})
		.optional(),
	escalation_policy: z
		.object({
			id: z.string(),
			type: z.literal('escalation_policy_reference'),
		})
		.optional(),
	assignments: z
		.array(
			z.object({
				assignee: z.object({
					id: z.string(),
					type: z.literal('user_reference'),
				}),
			}),
		)
		.optional(),
});

const IncidentsGetInputSchema = z.object({
	id: z.string(),
});

const IncidentsListInputSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
	statuses: z.array(z.enum(['triggered', 'acknowledged', 'resolved'])).optional(),
	since: z.string().optional(),
	until: z.string().optional(),
	urgencies: z.array(z.enum(['high', 'low'])).optional(),
	service_ids: z.array(z.string()).optional(),
	team_ids: z.array(z.string()).optional(),
	sort_by: z.string().optional(),
});

const IncidentsUpdateInputSchema = z.object({
	id: z.string(),
	status: z.enum(['acknowledged', 'resolved']).optional(),
	urgency: z.enum(['high', 'low']).optional(),
	title: z.string().optional(),
	assignments: z
		.array(
			z.object({
				assignee: z.object({
					id: z.string(),
					type: z.literal('user_reference'),
				}),
			}),
		)
		.optional(),
	escalation_policy: z
		.object({
			id: z.string(),
			type: z.literal('escalation_policy_reference'),
		})
		.optional(),
});

const IncidentNotesCreateInputSchema = z.object({
	incident_id: z.string(),
	content: z.string(),
});

const IncidentNotesListInputSchema = z.object({
	incident_id: z.string(),
	limit: z.number().optional(),
	offset: z.number().optional(),
});

const LogEntriesGetInputSchema = z.object({
	id: z.string(),
	include: z.array(z.string()).optional(),
});

const LogEntriesListInputSchema = z.object({
	limit: z.number().optional(),
	offset: z.number().optional(),
	since: z.string().optional(),
	until: z.string().optional(),
	is_overview: z.boolean().optional(),
	include: z.array(z.string()).optional(),
	team_ids: z.array(z.string()).optional(),
});

const UsersGetInputSchema = z.object({
	id: z.string(),
	include: z.array(z.string()).optional(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const IncidentsCreateResponseSchema = z.object({
	incident: PagerdutyIncidentSchema,
});

const IncidentsGetResponseSchema = z.object({
	incident: PagerdutyIncidentSchema,
});

const IncidentsListResponseSchema = z.object({
	incidents: z.array(PagerdutyIncidentSchema),
	limit: z.number().optional(),
	offset: z.number().optional(),
	more: z.boolean().optional(),
	total: z.number().nullable().optional(),
});

const IncidentsUpdateResponseSchema = z.object({
	incident: PagerdutyIncidentSchema,
});

const IncidentNotesCreateResponseSchema = z.object({
	note: PagerdutyIncidentNoteSchema,
});

const IncidentNotesListResponseSchema = z.object({
	notes: z.array(PagerdutyIncidentNoteSchema),
});

const LogEntriesGetResponseSchema = z.object({
	log_entry: PagerdutyLogEntrySchema,
});

const LogEntriesListResponseSchema = z.object({
	log_entries: z.array(PagerdutyLogEntrySchema),
	limit: z.number().optional(),
	offset: z.number().optional(),
	more: z.boolean().optional(),
	total: z.number().nullable().optional(),
});

const UsersGetResponseSchema = z.object({
	user: PagerdutyUserSchema,
});

// ── Type Exports ──────────────────────────────────────────────────────────────

export type IncidentsCreateInput = z.infer<typeof IncidentsCreateInputSchema>;
export type IncidentsGetInput = z.infer<typeof IncidentsGetInputSchema>;
export type IncidentsListInput = z.infer<typeof IncidentsListInputSchema>;
export type IncidentsUpdateInput = z.infer<typeof IncidentsUpdateInputSchema>;
export type IncidentNotesCreateInput = z.infer<typeof IncidentNotesCreateInputSchema>;
export type IncidentNotesListInput = z.infer<typeof IncidentNotesListInputSchema>;
export type LogEntriesGetInput = z.infer<typeof LogEntriesGetInputSchema>;
export type LogEntriesListInput = z.infer<typeof LogEntriesListInputSchema>;
export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

export type IncidentsCreateResponse = z.infer<typeof IncidentsCreateResponseSchema>;
export type IncidentsGetResponse = z.infer<typeof IncidentsGetResponseSchema>;
export type IncidentsListResponse = z.infer<typeof IncidentsListResponseSchema>;
export type IncidentsUpdateResponse = z.infer<typeof IncidentsUpdateResponseSchema>;
export type IncidentNotesCreateResponse = z.infer<typeof IncidentNotesCreateResponseSchema>;
export type IncidentNotesListResponse = z.infer<typeof IncidentNotesListResponseSchema>;
export type LogEntriesGetResponse = z.infer<typeof LogEntriesGetResponseSchema>;
export type LogEntriesListResponse = z.infer<typeof LogEntriesListResponseSchema>;
export type UsersGetResponse = z.infer<typeof UsersGetResponseSchema>;

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export type PagerdutyEndpointInputs = {
	incidentsCreate: IncidentsCreateInput;
	incidentsGet: IncidentsGetInput;
	incidentsList: IncidentsListInput;
	incidentsUpdate: IncidentsUpdateInput;
	incidentNotesCreate: IncidentNotesCreateInput;
	incidentNotesList: IncidentNotesListInput;
	logEntriesGet: LogEntriesGetInput;
	logEntriesList: LogEntriesListInput;
	usersGet: UsersGetInput;
};

export type PagerdutyEndpointOutputs = {
	incidentsCreate: IncidentsCreateResponse;
	incidentsGet: IncidentsGetResponse;
	incidentsList: IncidentsListResponse;
	incidentsUpdate: IncidentsUpdateResponse;
	incidentNotesCreate: IncidentNotesCreateResponse;
	incidentNotesList: IncidentNotesListResponse;
	logEntriesGet: LogEntriesGetResponse;
	logEntriesList: LogEntriesListResponse;
	usersGet: UsersGetResponse;
};

export const PagerdutyEndpointInputSchemas = {
	incidentsCreate: IncidentsCreateInputSchema,
	incidentsGet: IncidentsGetInputSchema,
	incidentsList: IncidentsListInputSchema,
	incidentsUpdate: IncidentsUpdateInputSchema,
	incidentNotesCreate: IncidentNotesCreateInputSchema,
	incidentNotesList: IncidentNotesListInputSchema,
	logEntriesGet: LogEntriesGetInputSchema,
	logEntriesList: LogEntriesListInputSchema,
	usersGet: UsersGetInputSchema,
} as const;

export const PagerdutyEndpointOutputSchemas = {
	incidentsCreate: IncidentsCreateResponseSchema,
	incidentsGet: IncidentsGetResponseSchema,
	incidentsList: IncidentsListResponseSchema,
	incidentsUpdate: IncidentsUpdateResponseSchema,
	incidentNotesCreate: IncidentNotesCreateResponseSchema,
	incidentNotesList: IncidentNotesListResponseSchema,
	logEntriesGet: LogEntriesGetResponseSchema,
	logEntriesList: LogEntriesListResponseSchema,
	usersGet: UsersGetResponseSchema,
} as const;
