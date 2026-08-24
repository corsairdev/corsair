import { z } from 'zod';

/**
 * Shared entity shapes returned by the Toggl Track API v9.
 *
 * Toggl returns `null` for a large number of fields rather than omitting them,
 * and adds fields over time, so optional/nullable is the norm here rather than
 * the exception.
 *
 * @see https://engineering.toggl.com/docs/
 */

/**
 * Toggl's `/me` response includes `api_token`, the caller's reusable,
 * non-expiring account credential. It is deliberately absent from this schema
 * and stripped by the profile endpoints, so it is never handed back to an
 * endpoint consumer.
 */
export const TogglUserSchema = z.object({
	id: z.number(),
	email: z.string(),
	fullname: z.string().nullable().optional(),
	timezone: z.string().nullable().optional(),
	toggl_accounts_id: z.string().nullable().optional(),
	user_account_id: z.number().nullable().optional(),
	default_workspace_id: z.number().nullable().optional(),
	beginning_of_week: z.number().nullable().optional(),
	image_url: z.string().nullable().optional(),
	country_id: z.number().nullable().optional(),
	has_password: z.boolean().nullable().optional(),
	openid_email: z.string().nullable().optional(),
	openid_enabled: z.boolean().nullable().optional(),
	oauth_providers: z.array(z.string()).nullable().optional(),
	created_at: z.string().nullable().optional(),
	updated_at: z.string().nullable().optional(),
	at: z.string().nullable().optional(),
});
export type TogglUser = z.infer<typeof TogglUserSchema>;

/**
 * Field names here are taken from a live `/me/preferences` response. Toggl
 * mixes casing conventions in this payload (`BeginningOfWeek` alongside
 * snake_case), and the set varies by plan, so the schema is loose.
 */
export const TogglUserPreferencesSchema = z
	.object({
		BeginningOfWeek: z.number().nullable().optional(),
		timeofday_format: z.string().nullable().optional(),
		date_format: z.string().nullable().optional(),
		duration_format: z.string().nullable().optional(),
		record_timeline: z.boolean().nullable().optional(),
		send_product_emails: z.boolean().nullable().optional(),
		send_timer_notifications: z.boolean().nullable().optional(),
		send_weekly_report: z.boolean().nullable().optional(),
		pg_time_zone_name: z.string().nullable().optional(),
		alpha_features: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
	})
	.loose();
export type TogglUserPreferences = z.infer<typeof TogglUserPreferencesSchema>;

export const TogglWorkspaceSchema = z
	.object({
		id: z.number(),
		organization_id: z.number().nullable().optional(),
		name: z.string(),
		premium: z.boolean().nullable().optional(),
		business_ws: z.boolean().nullable().optional(),
		admin: z.boolean().nullable().optional(),
		role: z.string().nullable().optional(),
		default_currency: z.string().nullable().optional(),
		default_hourly_rate: z.number().nullable().optional(),
		only_admins_may_create_projects: z.boolean().nullable().optional(),
		only_admins_may_create_tags: z.boolean().nullable().optional(),
		only_admins_see_billable_rates: z.boolean().nullable().optional(),
		rounding: z.number().nullable().optional(),
		rounding_minutes: z.number().nullable().optional(),
		suspended_at: z.string().nullable().optional(),
		server_deleted_at: z.string().nullable().optional(),
		logo_url: z.string().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglWorkspace = z.infer<typeof TogglWorkspaceSchema>;

export const TogglWorkspaceUserSchema = z
	.object({
		id: z.number(),
		user_id: z.number().nullable().optional(),
		workspace_id: z.number().nullable().optional(),
		admin: z.boolean().nullable().optional(),
		active: z.boolean().nullable().optional(),
		email: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		role: z.string().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglWorkspaceUser = z.infer<typeof TogglWorkspaceUserSchema>;

export const TogglOrganizationSchema = z
	.object({
		id: z.number(),
		name: z.string(),
		pricing_plan_id: z.number().nullable().optional(),
		created_at: z.string().nullable().optional(),
		is_multi_workspace_enabled: z.boolean().nullable().optional(),
		max_workspaces: z.number().nullable().optional(),
		admin: z.boolean().nullable().optional(),
		owner: z.boolean().nullable().optional(),
		trial_info: z.unknown().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglOrganization = z.infer<typeof TogglOrganizationSchema>;

export const TogglClientSchema = z
	.object({
		id: z.number(),
		wid: z.number().nullable().optional(),
		name: z.string(),
		notes: z.string().nullable().optional(),
		archived: z.boolean().nullable().optional(),
		creator_id: z.number().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglClient = z.infer<typeof TogglClientSchema>;

export const TogglProjectSchema = z
	.object({
		id: z.number(),
		workspace_id: z.number().nullable().optional(),
		client_id: z.number().nullable().optional(),
		name: z.string(),
		is_private: z.boolean().nullable().optional(),
		active: z.boolean().nullable().optional(),
		billable: z.boolean().nullable().optional(),
		color: z.string().nullable().optional(),
		currency: z.string().nullable().optional(),
		rate: z.number().nullable().optional(),
		estimated_hours: z.number().nullable().optional(),
		actual_hours: z.number().nullable().optional(),
		start_date: z.string().nullable().optional(),
		end_date: z.string().nullable().optional(),
		template: z.boolean().nullable().optional(),
		recurring: z.boolean().nullable().optional(),
		server_deleted_at: z.string().nullable().optional(),
		created_at: z.string().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglProject = z.infer<typeof TogglProjectSchema>;

export const TogglTaskSchema = z
	.object({
		id: z.number(),
		workspace_id: z.number().nullable().optional(),
		project_id: z.number().nullable().optional(),
		user_id: z.number().nullable().optional(),
		name: z.string(),
		active: z.boolean().nullable().optional(),
		estimated_seconds: z.number().nullable().optional(),
		tracked_seconds: z.number().nullable().optional(),
		server_deleted_at: z.string().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglTask = z.infer<typeof TogglTaskSchema>;

export const TogglTagSchema = z
	.object({
		id: z.number(),
		workspace_id: z.number().nullable().optional(),
		name: z.string(),
		creator_id: z.number().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglTag = z.infer<typeof TogglTagSchema>;

export const TogglTimeEntrySchema = z
	.object({
		id: z.number(),
		workspace_id: z.number().nullable().optional(),
		project_id: z.number().nullable().optional(),
		task_id: z.number().nullable().optional(),
		user_id: z.number().nullable().optional(),
		description: z.string().nullable().optional(),
		start: z.string(),
		stop: z.string().nullable().optional(),
		duration: z.number(),
		billable: z.boolean().nullable().optional(),
		duronly: z.boolean().nullable().optional(),
		tags: z.array(z.string()).nullable().optional(),
		tag_ids: z.array(z.number()).nullable().optional(),
		server_deleted_at: z.string().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglTimeEntry = z.infer<typeof TogglTimeEntrySchema>;

export const TogglLocationSchema = z
	.object({
		city: z.string().nullable().optional(),
		city_lat_long: z.string().nullable().optional(),
		state: z.string().nullable().optional(),
		country_code: z.string().nullable().optional(),
		country_name: z.string().nullable().optional(),
	})
	.loose();
export type TogglLocation = z.infer<typeof TogglLocationSchema>;

export const TogglQuotaSchema = z
	.object({
		/** Null on the unscoped record Toggl returns alongside per-org quotas. */
		organization_id: z.number().nullable(),
		remaining: z.number(),
		total: z.number(),
		resets_in_secs: z.number().nullable().optional(),
	})
	.loose();
export type TogglQuota = z.infer<typeof TogglQuotaSchema>;

export const TogglCountrySchema = z
	.object({
		id: z.number(),
		name: z.string(),
		country_code: z.string().nullable().optional(),
		vat_applicable: z.boolean().nullable().optional(),
		vat_percentage: z.number().nullable().optional(),
		vat_regex: z.string().nullable().optional(),
	})
	.loose();
export type TogglCountry = z.infer<typeof TogglCountrySchema>;

export const TogglCountrySubdivisionSchema = z
	.object({
		country_subdivision_id: z.number().nullable().optional(),
		country_id: z.number().nullable().optional(),
		name: z.string(),
		/** ISO 3166-2 code, e.g. `US-AL`. */
		iso_code: z.string().nullable().optional(),
	})
	.loose();
export type TogglCountrySubdivision = z.infer<
	typeof TogglCountrySubdivisionSchema
>;

export const TogglCurrencySchema = z
	.object({
		currency_id: z.number().nullable().optional(),
		iso_code: z.string(),
		symbol: z.string().nullable().optional(),
	})
	.loose();
export type TogglCurrency = z.infer<typeof TogglCurrencySchema>;

export const TogglTimezoneOffsetSchema = z
	.object({
		name: z.string(),
		utc: z.string(),
	})
	.loose();
export type TogglTimezoneOffset = z.infer<typeof TogglTimezoneOffsetSchema>;

/** JWKS keyset used to verify Toggl-issued JWTs. */
export const TogglKeysetSchema = z
	.object({
		keys: z.array(z.record(z.string(), z.unknown())),
	})
	.loose();
export type TogglKeyset = z.infer<typeof TogglKeysetSchema>;

export const TogglGroupSchema = z
	.object({
		group_id: z.number().nullable().optional(),
		id: z.number().nullable().optional(),
		organization_id: z.number().nullable().optional(),
		name: z.string(),
		users: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
		workspaces: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglGroup = z.infer<typeof TogglGroupSchema>;

export const TogglOrganizationUserSchema = z
	.object({
		id: z.number(),
		user_id: z.number().nullable().optional(),
		organization_id: z.number().nullable().optional(),
		email: z.string().nullable().optional(),
		name: z.string().nullable().optional(),
		admin: z.boolean().nullable().optional(),
		owner: z.boolean().nullable().optional(),
		joined: z.boolean().nullable().optional(),
		inactive: z.boolean().nullable().optional(),
		workspaces: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
		groups: z.array(z.record(z.string(), z.unknown())).nullable().optional(),
	})
	.loose();
export type TogglOrganizationUser = z.infer<typeof TogglOrganizationUserSchema>;

/** Toggl returns plan/billing data with a shape that varies by tier. */
export const TogglPlanInfoSchema = z.record(z.string(), z.unknown());
export type TogglPlanInfo = z.infer<typeof TogglPlanInfoSchema>;

export const TogglProjectUserSchema = z
	.object({
		id: z.number(),
		project_id: z.number().nullable().optional(),
		user_id: z.number().nullable().optional(),
		workspace_id: z.number().nullable().optional(),
		manager: z.boolean().nullable().optional(),
		rate: z.number().nullable().optional(),
		labour_cost: z.number().nullable().optional(),
		at: z.string().nullable().optional(),
	})
	.loose();
export type TogglProjectUser = z.infer<typeof TogglProjectUserSchema>;

export const TogglWorkspacePreferencesSchema = z
	.object({
		initial_pricing_plan: z.number().nullable().optional(),
		hide_start_end_times: z.boolean().nullable().optional(),
	})
	.loose();
export type TogglWorkspacePreferences = z.infer<
	typeof TogglWorkspacePreferencesSchema
>;

export const TogglWorkspaceLogoSchema = z
	.object({
		logo: z.string().nullable().optional(),
	})
	.loose();
export type TogglWorkspaceLogo = z.infer<typeof TogglWorkspaceLogoSchema>;

export const TogglWebhooksStatusSchema = z
	.object({
		status: z.string(),
	})
	.loose();
export type TogglWebhooksStatus = z.infer<typeof TogglWebhooksStatusSchema>;

/** Map of entity name to the event names that can be subscribed to. */
export const TogglEventFiltersSchema = z.record(
	z.string(),
	z.array(z.string()),
);
export type TogglEventFilters = z.infer<typeof TogglEventFiltersSchema>;

export const TogglSubscriptionSchema = z
	.object({
		subscription_id: z.number().nullable().optional(),
		workspace_id: z.number().nullable().optional(),
		user_id: z.number().nullable().optional(),
		url_callback: z.string().nullable().optional(),
		enabled: z.boolean().nullable().optional(),
		description: z.string().nullable().optional(),
		event_filters: z
			.array(z.record(z.string(), z.unknown()))
			.nullable()
			.optional(),
		created_at: z.string().nullable().optional(),
	})
	.loose();
export type TogglSubscription = z.infer<typeof TogglSubscriptionSchema>;

/** Toggl's transactional mail endpoints answer with a bare acknowledgement. */
export const TogglAcknowledgementSchema = z
	.object({
		ok: z.literal(true),
	})
	.loose();
export type TogglAcknowledgement = z.infer<typeof TogglAcknowledgementSchema>;

/**
 * `POST …/clients/{client_id}/archive` does not answer with a client record on
 * every account — it can also return an `{ items: [...] }` envelope carrying
 * the ids it touched. Both shapes are accepted so the declared contract cannot
 * drift from the live response; callers needing the full record should re-read
 * the client.
 */
export const TogglClientArchiveResultSchema = z.union([
	TogglClientSchema,
	z.object({ items: z.array(z.number()).nullable().optional() }).loose(),
]);
export type TogglClientArchiveResult = z.infer<
	typeof TogglClientArchiveResultSchema
>;

/**
 * Every Toggl resource identifier is an integer, so inputs reject fractional
 * values rather than forwarding them and letting the API answer with a 400.
 */
const TogglIdSchema = z.number().int();

/**
 * Time-entry writes carry RFC3339 timestamps. The offset form is accepted
 * alongside plain UTC so a caller holding a local-offset timestamp does not
 * have to normalise it first.
 */
const TogglTimestampSchema = z.iso.datetime({ offset: true });

/** Range filters accept either a calendar date or a full RFC3339 timestamp. */
const TogglDateOrTimestampSchema = z.union([
	z.iso.date(),
	TogglTimestampSchema,
]);

/* -------------------------------------------------------------------------- */
/* me                                                                          */
/* -------------------------------------------------------------------------- */

const MeGetInputSchema = z.object({
	with_related_data: z.boolean().optional(),
});
export type MeGetInput = z.infer<typeof MeGetInputSchema>;

const MeUpdateInputSchema = z.object({
	fullname: z.string().optional(),
	email: z.string().optional(),
	timezone: z.string().optional(),
	beginning_of_week: z.number().int().min(0).max(6).optional(),
	default_workspace_id: TogglIdSchema.optional(),
});
export type MeUpdateInput = z.infer<typeof MeUpdateInputSchema>;

const MeGetPreferencesInputSchema = z.object({});
export type MeGetPreferencesInput = z.infer<typeof MeGetPreferencesInputSchema>;

const MeUpdatePreferencesInputSchema = z.object({
	timeofday_format: z.string().optional(),
	date_format: z.string().optional(),
	duration_format: z.string().optional(),
});
export type MeUpdatePreferencesInput = z.infer<
	typeof MeUpdatePreferencesInputSchema
>;

/* -------------------------------------------------------------------------- */
/* workspaces                                                                  */
/* -------------------------------------------------------------------------- */

const WorkspacesListInputSchema = z.object({
	/** Only return workspaces changed since this UNIX timestamp. */
	since: z.number().optional(),
});
export type WorkspacesListInput = z.infer<typeof WorkspacesListInputSchema>;

const WorkspacesGetInputSchema = z.object({
	workspace_id: TogglIdSchema,
});
export type WorkspacesGetInput = z.infer<typeof WorkspacesGetInputSchema>;

const WorkspacesUpdateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	name: z.string().optional(),
	default_currency: z.string().optional(),
	default_hourly_rate: z.number().optional(),
	only_admins_may_create_projects: z.boolean().optional(),
	only_admins_may_create_tags: z.boolean().optional(),
});
export type WorkspacesUpdateInput = z.infer<typeof WorkspacesUpdateInputSchema>;

const WorkspacesGetUsersInputSchema = z.object({
	workspace_id: TogglIdSchema,
});
export type WorkspacesGetUsersInput = z.infer<
	typeof WorkspacesGetUsersInputSchema
>;

/* -------------------------------------------------------------------------- */
/* organizations                                                               */
/* -------------------------------------------------------------------------- */

const OrganizationsGetInputSchema = z.object({
	organization_id: TogglIdSchema,
});
export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;

const OrganizationsUpdateInputSchema = z.object({
	organization_id: TogglIdSchema,
	name: z.string(),
});
export type OrganizationsUpdateInput = z.infer<
	typeof OrganizationsUpdateInputSchema
>;

const OrganizationsGetWorkspacesInputSchema = z.object({
	organization_id: TogglIdSchema,
});
export type OrganizationsGetWorkspacesInput = z.infer<
	typeof OrganizationsGetWorkspacesInputSchema
>;

/* -------------------------------------------------------------------------- */
/* clients                                                                     */
/* -------------------------------------------------------------------------- */

const ClientsListInputSchema = z.object({
	workspace_id: TogglIdSchema,
	/** Filter by archived state. Omit to return both. */
	status: z.enum(['active', 'archived', 'both']).optional(),
	/** Case-insensitive substring match on the client name. */
	name: z.string().optional(),
});
export type ClientsListInput = z.infer<typeof ClientsListInputSchema>;

const ClientsGetInputSchema = z.object({
	workspace_id: TogglIdSchema,
	client_id: TogglIdSchema,
});
export type ClientsGetInput = z.infer<typeof ClientsGetInputSchema>;

const ClientsCreateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	name: z.string().min(1),
	notes: z.string().optional(),
});
export type ClientsCreateInput = z.infer<typeof ClientsCreateInputSchema>;

const ClientsUpdateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	client_id: TogglIdSchema,
	/** Toggl rejects an update that omits the name, even when only notes change. */
	name: z.string().min(1),
	notes: z.string().optional(),
});

const ClientsArchiveInputSchema = z.object({
	workspace_id: TogglIdSchema,
	client_id: TogglIdSchema,
});
export type ClientsArchiveInput = z.infer<typeof ClientsArchiveInputSchema>;
export type ClientsUpdateInput = z.infer<typeof ClientsUpdateInputSchema>;

const ClientsDeleteInputSchema = z.object({
	workspace_id: TogglIdSchema,
	client_id: TogglIdSchema,
});
export type ClientsDeleteInput = z.infer<typeof ClientsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* projects                                                                    */
/* -------------------------------------------------------------------------- */

const ProjectsListInputSchema = z.object({
	workspace_id: TogglIdSchema,
	active: z.boolean().optional(),
	/** Substring match on project name. */
	name: z.string().optional(),
	/** 1-based page number; Toggl pages projects rather than using cursors. */
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(200).optional(),
});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsGetInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_id: TogglIdSchema,
});
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsCreateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	name: z.string().min(1),
	client_id: TogglIdSchema.optional(),
	active: z.boolean().optional(),
	is_private: z.boolean().optional(),
	billable: z.boolean().optional(),
	color: z.string().optional(),
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	estimated_hours: z.number().optional(),
});
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

const ProjectsUpdateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_id: TogglIdSchema,
	name: z.string().min(1).optional(),
	client_id: TogglIdSchema.nullable().optional(),
	active: z.boolean().optional(),
	is_private: z.boolean().optional(),
	billable: z.boolean().optional(),
	color: z.string().optional(),
});
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

const ProjectsDeleteInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_id: TogglIdSchema,
});
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* tasks                                                                       */
/* -------------------------------------------------------------------------- */

const TasksListInputSchema = z.object({
	workspace_id: TogglIdSchema,
	/** Omit to list every task in the workspace. */
	project_id: TogglIdSchema.optional(),
	active: z.boolean().optional(),
	/** Honoured only on the workspace-wide route; Toggl's project-scoped task
	 * route documents `active` alone and is sent without page params. */
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(200).optional(),
});
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TasksGetInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_id: TogglIdSchema,
	task_id: TogglIdSchema,
});
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

const TasksCreateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_id: TogglIdSchema,
	name: z.string().min(1),
	active: z.boolean().optional(),
	estimated_seconds: z.number().optional(),
	user_id: TogglIdSchema.optional(),
});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

const TasksUpdateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_id: TogglIdSchema,
	task_id: TogglIdSchema,
	name: z.string().min(1).optional(),
	active: z.boolean().optional(),
	estimated_seconds: z.number().optional(),
});
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

const TasksDeleteInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_id: TogglIdSchema,
	task_id: TogglIdSchema,
});
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* tags                                                                        */
/* -------------------------------------------------------------------------- */

const TagsListInputSchema = z.object({
	workspace_id: TogglIdSchema,
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(200).optional(),
	/** Case-insensitive substring match on the tag name. */
	search: z.string().optional(),
});
export type TagsListInput = z.infer<typeof TagsListInputSchema>;

const TagsCreateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	name: z.string().min(1),
});
export type TagsCreateInput = z.infer<typeof TagsCreateInputSchema>;

const TagsUpdateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	tag_id: TogglIdSchema,
	name: z.string().min(1),
});
export type TagsUpdateInput = z.infer<typeof TagsUpdateInputSchema>;

const TagsDeleteInputSchema = z.object({
	workspace_id: TogglIdSchema,
	tag_id: TogglIdSchema,
});
export type TagsDeleteInput = z.infer<typeof TagsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* time entries                                                                */
/* -------------------------------------------------------------------------- */

const TimeEntriesListInputSchema = z
	.object({
		/** RFC3339 or YYYY-MM-DD. Must be supplied together with `end_date`. */
		start_date: TogglDateOrTimestampSchema.optional(),
		end_date: TogglDateOrTimestampSchema.optional(),
		/** UNIX timestamp; returns entries modified since then. */
		since: z.number().int().optional(),
		before: TogglDateOrTimestampSchema.optional(),
		meta: z.boolean().optional(),
	})
	.refine(
		(value) =>
			(value.start_date === undefined) === (value.end_date === undefined),
		{
			message: 'start_date and end_date must be supplied together',
			path: ['end_date'],
		},
	);
export type TimeEntriesListInput = z.infer<typeof TimeEntriesListInputSchema>;

const TimeEntriesGetCurrentInputSchema = z.object({});
export type TimeEntriesGetCurrentInput = z.infer<
	typeof TimeEntriesGetCurrentInputSchema
>;

const TimeEntriesGetInputSchema = z.object({
	time_entry_id: TogglIdSchema,
});
export type TimeEntriesGetInput = z.infer<typeof TimeEntriesGetInputSchema>;

const TimeEntriesCreateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	/** RFC3339. Toggl rejects entries without an explicit start. */
	start: TogglTimestampSchema,
	/**
	 * Whole seconds. A negative value marks the entry as still running, in which
	 * case Toggl expects -1 by convention.
	 */
	duration: z.number().int(),
	description: z.string().optional(),
	project_id: TogglIdSchema.optional(),
	task_id: TogglIdSchema.optional(),
	billable: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	tag_ids: z.array(TogglIdSchema).optional(),
	stop: TogglTimestampSchema.optional(),
	/** Required by Toggl to identify the writing client. */
	created_with: z.string().optional(),
});
export type TimeEntriesCreateInput = z.infer<
	typeof TimeEntriesCreateInputSchema
>;

const TimeEntriesUpdateInputSchema = z.object({
	workspace_id: TogglIdSchema,
	time_entry_id: TogglIdSchema,
	description: z.string().optional(),
	start: TogglTimestampSchema.optional(),
	stop: TogglTimestampSchema.optional(),
	duration: z.number().int().optional(),
	project_id: TogglIdSchema.nullable().optional(),
	task_id: TogglIdSchema.nullable().optional(),
	billable: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	tag_ids: z.array(TogglIdSchema).optional(),
});
export type TimeEntriesUpdateInput = z.infer<
	typeof TimeEntriesUpdateInputSchema
>;

const TimeEntriesStopInputSchema = z.object({
	workspace_id: TogglIdSchema,
	time_entry_id: TogglIdSchema,
});
export type TimeEntriesStopInput = z.infer<typeof TimeEntriesStopInputSchema>;

const TimeEntriesDeleteInputSchema = z.object({
	workspace_id: TogglIdSchema,
	time_entry_id: TogglIdSchema,
});
export type TimeEntriesDeleteInput = z.infer<
	typeof TimeEntriesDeleteInputSchema
>;

/* -------------------------------------------------------------------------- */
/* me — collections and account actions                                        */
/* -------------------------------------------------------------------------- */

const EmptyInputSchema = z.object({});
export type EmptyInput = z.infer<typeof EmptyInputSchema>;

/** `since` filters most /me collections to records changed after a UNIX time. */
const SinceInputSchema = z.object({
	since: z.number().optional(),
});
export type SinceInput = z.infer<typeof SinceInputSchema>;

const MeDisableProductEmailsInputSchema = z.object({
	/** Code taken from the unsubscribe link in a Toggl product email. */
	disable_code: z.string().min(1),
});
export type MeDisableProductEmailsInput = z.infer<
	typeof MeDisableProductEmailsInputSchema
>;

const MeDisableWeeklyReportInputSchema = z.object({
	/** Code taken from the footer of a weekly report email. */
	code: z.string().min(1),
});
export type MeDisableWeeklyReportInput = z.infer<
	typeof MeDisableWeeklyReportInputSchema
>;

/* -------------------------------------------------------------------------- */
/* reference data                                                              */
/* -------------------------------------------------------------------------- */

const ReferenceGetCountrySubdivisionsInputSchema = z.object({
	/** Numeric id from `reference.getCountries` — ISO codes are rejected by Toggl. */
	country_id: TogglIdSchema,
});
export type ReferenceGetCountrySubdivisionsInput = z.infer<
	typeof ReferenceGetCountrySubdivisionsInputSchema
>;

/* -------------------------------------------------------------------------- */
/* organizations — groups, users, invitations, plans                           */
/* -------------------------------------------------------------------------- */

const OrganizationsCreateInputSchema = z.object({
	name: z.string().min(1),
	/** Name for the organization's first workspace. */
	workspace_name: z.string().min(1).optional(),
});
export type OrganizationsCreateInput = z.infer<
	typeof OrganizationsCreateInputSchema
>;

const OrganizationsGetGroupsInputSchema = z.object({
	organization_id: TogglIdSchema,
});
export type OrganizationsGetGroupsInput = z.infer<
	typeof OrganizationsGetGroupsInputSchema
>;

const OrganizationsCreateGroupInputSchema = z.object({
	organization_id: TogglIdSchema,
	name: z.string().min(1),
});
export type OrganizationsCreateGroupInput = z.infer<
	typeof OrganizationsCreateGroupInputSchema
>;

const OrganizationsDeleteGroupInputSchema = z.object({
	organization_id: TogglIdSchema,
	group_id: TogglIdSchema,
});
export type OrganizationsDeleteGroupInput = z.infer<
	typeof OrganizationsDeleteGroupInputSchema
>;

const OrganizationsGetUsersInputSchema = z.object({
	organization_id: TogglIdSchema,
	/** Case-insensitive match against name or email. */
	filter: z.string().optional(),
	active: z.boolean().optional(),
	only_admins: z.boolean().optional(),
	groups: z.boolean().optional(),
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(200).optional(),
});
export type OrganizationsGetUsersInput = z.infer<
	typeof OrganizationsGetUsersInputSchema
>;

const OrganizationsCreateInvitationInputSchema = z.object({
	organization_id: TogglIdSchema,
	emails: z.array(z.string()).min(1),
	/** Workspaces the invitee should be added to. */
	workspaces: z
		.array(
			z.object({
				workspace_id: TogglIdSchema,
				admin: z.boolean().optional(),
			}),
		)
		.optional(),
	prevent_email_notification: z.boolean().optional(),
});
export type OrganizationsCreateInvitationInput = z.infer<
	typeof OrganizationsCreateInvitationInputSchema
>;

const OrganizationsGetPlansInputSchema = z.object({
	organization_id: TogglIdSchema,
});
export type OrganizationsGetPlansInput = z.infer<
	typeof OrganizationsGetPlansInputSchema
>;

/* -------------------------------------------------------------------------- */
/* workspaces — logo, preferences, tasks                                       */
/* -------------------------------------------------------------------------- */

const WorkspacesGetLogoInputSchema = z.object({
	workspace_id: TogglIdSchema,
});
export type WorkspacesGetLogoInput = z.infer<
	typeof WorkspacesGetLogoInputSchema
>;

const WorkspacesGetPreferencesInputSchema = z.object({
	workspace_id: TogglIdSchema,
});
export type WorkspacesGetPreferencesInput = z.infer<
	typeof WorkspacesGetPreferencesInputSchema
>;

const TasksListWorkspaceInputSchema = z.object({
	workspace_id: TogglIdSchema,
	active: z.boolean().optional(),
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(200).optional(),
});
export type TasksListWorkspaceInput = z.infer<
	typeof TasksListWorkspaceInputSchema
>;

/* -------------------------------------------------------------------------- */
/* projects — members and groups                                               */
/* -------------------------------------------------------------------------- */

const ProjectsAddUserInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_id: TogglIdSchema,
	user_id: TogglIdSchema,
	manager: z.boolean().optional(),
	rate: z.number().optional(),
	labour_cost: z.number().optional(),
});
export type ProjectsAddUserInput = z.infer<typeof ProjectsAddUserInputSchema>;

const ProjectsDeleteGroupInputSchema = z.object({
	workspace_id: TogglIdSchema,
	project_group_id: TogglIdSchema,
});
export type ProjectsDeleteGroupInput = z.infer<
	typeof ProjectsDeleteGroupInputSchema
>;

/* -------------------------------------------------------------------------- */
/* time entries — bulk edit                                                    */
/* -------------------------------------------------------------------------- */

const TimeEntriesBulkEditInputSchema = z.object({
	workspace_id: TogglIdSchema,
	/** Toggl caps a bulk edit at 100 entries per request. */
	time_entry_ids: z.array(TogglIdSchema).min(1).max(100),
	/** JSON Patch operations applied to every listed entry. */
	operations: z
		.array(
			z
				.object({
					op: z.enum(['add', 'remove', 'replace']),
					path: z.string().min(1),
					value: z.unknown().optional(),
				})
				// RFC 6902 requires `value` on add and replace; remove takes none.
				// Expressed as a refinement rather than a discriminated union
				// because zod cannot mark an `unknown` field as required.
				.refine(
					(operation) => operation.op === 'remove' || 'value' in operation,
					{
						message: 'value is required for add and replace operations',
						path: ['value'],
					},
				),
		)
		.min(1),
});
export type TimeEntriesBulkEditInput = z.infer<
	typeof TimeEntriesBulkEditInputSchema
>;

const BulkEditResultSchema = z.object({
	success: z.array(z.number()).nullable().optional(),
	failure: z
		.array(
			z.object({
				id: z.number().nullable().optional(),
				message: z.string().nullable().optional(),
			}),
		)
		.nullable()
		.optional(),
});
export type BulkEditResult = z.infer<typeof BulkEditResultSchema>;

/* -------------------------------------------------------------------------- */
/* webhook subscriptions                                                       */
/* -------------------------------------------------------------------------- */

const WebhooksListSubscriptionsInputSchema = z.object({
	workspace_id: TogglIdSchema,
});
export type WebhooksListSubscriptionsInput = z.infer<
	typeof WebhooksListSubscriptionsInputSchema
>;

const WebhooksDeleteSubscriptionInputSchema = z.object({
	workspace_id: TogglIdSchema,
	subscription_id: TogglIdSchema,
});
export type WebhooksDeleteSubscriptionInput = z.infer<
	typeof WebhooksDeleteSubscriptionInputSchema
>;

/* -------------------------------------------------------------------------- */
/* transactional mail                                                          */
/* -------------------------------------------------------------------------- */

const SmailSendDemoInputSchema = z.object({
	email: z.string().min(1),
	name: z.string().optional(),
	company: z.string().optional(),
	message: z.string().optional(),
});
export type SmailSendDemoInput = z.infer<typeof SmailSendDemoInputSchema>;

const SmailSendContactInputSchema = z.object({
	email: z.string().min(1),
	name: z.string().min(1),
	message: z.string().min(1),
});
export type SmailSendContactInput = z.infer<typeof SmailSendContactInputSchema>;

const SmailSendMeetInputSchema = z.object({
	email: z.string().min(1),
	name: z.string().optional(),
	location: z.string().min(1),
});
export type SmailSendMeetInput = z.infer<typeof SmailSendMeetInputSchema>;

/* -------------------------------------------------------------------------- */
/* outputs                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Toggl answers DELETE with an empty body and a 200. The endpoints normalise
 * that into an explicit result so callers get something typed back.
 */
const DeletedResultSchema = z.object({
	deleted: z.literal(true),
	id: z.number(),
});
export type DeletedResult = z.infer<typeof DeletedResultSchema>;

export type TogglEndpointInputs = {
	meGet: MeGetInput;
	meUpdate: MeUpdateInput;
	meGetPreferences: MeGetPreferencesInput;
	meUpdatePreferences: MeUpdatePreferencesInput;
	workspacesList: WorkspacesListInput;
	workspacesGet: WorkspacesGetInput;
	workspacesUpdate: WorkspacesUpdateInput;
	workspacesGetUsers: WorkspacesGetUsersInput;
	organizationsGet: OrganizationsGetInput;
	organizationsUpdate: OrganizationsUpdateInput;
	organizationsGetWorkspaces: OrganizationsGetWorkspacesInput;
	clientsList: ClientsListInput;
	clientsGet: ClientsGetInput;
	clientsCreate: ClientsCreateInput;
	clientsUpdate: ClientsUpdateInput;
	clientsArchive: ClientsArchiveInput;
	clientsDelete: ClientsDeleteInput;
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	tagsList: TagsListInput;
	tagsCreate: TagsCreateInput;
	tagsUpdate: TagsUpdateInput;
	tagsDelete: TagsDeleteInput;
	timeEntriesList: TimeEntriesListInput;
	timeEntriesGetCurrent: TimeEntriesGetCurrentInput;
	timeEntriesGet: TimeEntriesGetInput;
	timeEntriesCreate: TimeEntriesCreateInput;
	timeEntriesUpdate: TimeEntriesUpdateInput;
	timeEntriesStop: TimeEntriesStopInput;
	timeEntriesDelete: TimeEntriesDeleteInput;
	meGetLogged: EmptyInput;
	meGetLocation: EmptyInput;
	meGetQuota: EmptyInput;
	meGetClients: SinceInput;
	meGetProjects: SinceInput;
	meGetTags: SinceInput;
	meGetTasks: SinceInput;
	meDisableProductEmails: MeDisableProductEmailsInput;
	meDisableWeeklyReport: MeDisableWeeklyReportInput;
	referenceGetCountries: EmptyInput;
	referenceGetCountrySubdivisions: ReferenceGetCountrySubdivisionsInput;
	referenceGetCurrencies: EmptyInput;
	referenceGetTimezones: EmptyInput;
	referenceGetTimezoneOffsets: EmptyInput;
	referenceGetKeys: EmptyInput;
	organizationsCreate: OrganizationsCreateInput;
	organizationsGetGroups: OrganizationsGetGroupsInput;
	organizationsCreateGroup: OrganizationsCreateGroupInput;
	organizationsDeleteGroup: OrganizationsDeleteGroupInput;
	organizationsGetUsers: OrganizationsGetUsersInput;
	organizationsCreateInvitation: OrganizationsCreateInvitationInput;
	organizationsGetPlans: OrganizationsGetPlansInput;
	organizationsGetSubscriptionPlans: OrganizationsGetPlansInput;
	workspacesGetLogo: WorkspacesGetLogoInput;
	workspacesGetPreferences: WorkspacesGetPreferencesInput;
	projectsAddUser: ProjectsAddUserInput;
	projectsDeleteGroup: ProjectsDeleteGroupInput;
	timeEntriesBulkEdit: TimeEntriesBulkEditInput;
	webhooksGetStatus: EmptyInput;
	webhooksGetEventFilters: EmptyInput;
	webhooksListSubscriptions: WebhooksListSubscriptionsInput;
	webhooksDeleteSubscription: WebhooksDeleteSubscriptionInput;
	smailSendDemo: SmailSendDemoInput;
	smailSendContact: SmailSendContactInput;
	smailSendMeet: SmailSendMeetInput;
};

export type TogglEndpointOutputs = {
	meGet: TogglUser;
	meUpdate: TogglUser;
	meGetPreferences: TogglUserPreferences;
	meUpdatePreferences: TogglUserPreferences;
	workspacesList: TogglWorkspace[];
	workspacesGet: TogglWorkspace;
	workspacesUpdate: TogglWorkspace;
	workspacesGetUsers: TogglWorkspaceUser[];
	organizationsGet: TogglOrganization;
	organizationsUpdate: TogglOrganization;
	organizationsGetWorkspaces: TogglWorkspace[];
	clientsList: TogglClient[];
	clientsGet: TogglClient;
	clientsCreate: TogglClient;
	clientsUpdate: TogglClient;
	clientsArchive: TogglClientArchiveResult;
	clientsDelete: DeletedResult;
	projectsList: TogglProject[];
	projectsGet: TogglProject;
	projectsCreate: TogglProject;
	projectsUpdate: TogglProject;
	projectsDelete: DeletedResult;
	tasksList: TogglTask[];
	tasksGet: TogglTask;
	tasksCreate: TogglTask;
	tasksUpdate: TogglTask;
	tasksDelete: DeletedResult;
	tagsList: TogglTag[];
	tagsCreate: TogglTag;
	tagsUpdate: TogglTag;
	tagsDelete: DeletedResult;
	timeEntriesList: TogglTimeEntry[];
	timeEntriesGetCurrent: TogglTimeEntry | null;
	timeEntriesGet: TogglTimeEntry;
	timeEntriesCreate: TogglTimeEntry;
	timeEntriesUpdate: TogglTimeEntry;
	timeEntriesStop: TogglTimeEntry;
	timeEntriesDelete: DeletedResult;
	meGetLogged: TogglAcknowledgement;
	meGetLocation: TogglLocation;
	meGetQuota: TogglQuota[];
	meGetClients: TogglClient[];
	meGetProjects: TogglProject[];
	meGetTags: TogglTag[];
	meGetTasks: TogglTask[];
	meDisableProductEmails: TogglAcknowledgement;
	meDisableWeeklyReport: TogglAcknowledgement;
	referenceGetCountries: TogglCountry[];
	referenceGetCountrySubdivisions: TogglCountrySubdivision[];
	referenceGetCurrencies: TogglCurrency[];
	referenceGetTimezones: string[];
	referenceGetTimezoneOffsets: TogglTimezoneOffset[];
	referenceGetKeys: TogglKeyset;
	organizationsCreate: TogglOrganization;
	organizationsGetGroups: TogglGroup[];
	organizationsCreateGroup: TogglGroup;
	organizationsDeleteGroup: DeletedResult;
	organizationsGetUsers: TogglOrganizationUser[];
	organizationsCreateInvitation: TogglPlanInfo;
	organizationsGetPlans: TogglPlanInfo;
	organizationsGetSubscriptionPlans: TogglPlanInfo;
	workspacesGetLogo: TogglWorkspaceLogo;
	workspacesGetPreferences: TogglWorkspacePreferences;
	projectsAddUser: TogglProjectUser;
	projectsDeleteGroup: DeletedResult;
	timeEntriesBulkEdit: BulkEditResult;
	webhooksGetStatus: TogglWebhooksStatus;
	webhooksGetEventFilters: TogglEventFilters;
	webhooksListSubscriptions: TogglSubscription[];
	webhooksDeleteSubscription: DeletedResult;
	smailSendDemo: TogglAcknowledgement;
	smailSendContact: TogglAcknowledgement;
	smailSendMeet: TogglAcknowledgement;
};

export const TogglEndpointInputSchemas = {
	meGet: MeGetInputSchema,
	meUpdate: MeUpdateInputSchema,
	meGetPreferences: MeGetPreferencesInputSchema,
	meUpdatePreferences: MeUpdatePreferencesInputSchema,
	workspacesList: WorkspacesListInputSchema,
	workspacesGet: WorkspacesGetInputSchema,
	workspacesUpdate: WorkspacesUpdateInputSchema,
	workspacesGetUsers: WorkspacesGetUsersInputSchema,
	organizationsGet: OrganizationsGetInputSchema,
	organizationsUpdate: OrganizationsUpdateInputSchema,
	organizationsGetWorkspaces: OrganizationsGetWorkspacesInputSchema,
	clientsList: ClientsListInputSchema,
	clientsGet: ClientsGetInputSchema,
	clientsCreate: ClientsCreateInputSchema,
	clientsUpdate: ClientsUpdateInputSchema,
	clientsArchive: ClientsArchiveInputSchema,
	clientsDelete: ClientsDeleteInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	tagsList: TagsListInputSchema,
	tagsCreate: TagsCreateInputSchema,
	tagsUpdate: TagsUpdateInputSchema,
	tagsDelete: TagsDeleteInputSchema,
	timeEntriesList: TimeEntriesListInputSchema,
	timeEntriesGetCurrent: TimeEntriesGetCurrentInputSchema,
	timeEntriesGet: TimeEntriesGetInputSchema,
	timeEntriesCreate: TimeEntriesCreateInputSchema,
	timeEntriesUpdate: TimeEntriesUpdateInputSchema,
	timeEntriesStop: TimeEntriesStopInputSchema,
	timeEntriesDelete: TimeEntriesDeleteInputSchema,
	meGetLogged: EmptyInputSchema,
	meGetLocation: EmptyInputSchema,
	meGetQuota: EmptyInputSchema,
	meGetClients: SinceInputSchema,
	meGetProjects: SinceInputSchema,
	meGetTags: SinceInputSchema,
	meGetTasks: SinceInputSchema,
	meDisableProductEmails: MeDisableProductEmailsInputSchema,
	meDisableWeeklyReport: MeDisableWeeklyReportInputSchema,
	referenceGetCountries: EmptyInputSchema,
	referenceGetCountrySubdivisions: ReferenceGetCountrySubdivisionsInputSchema,
	referenceGetCurrencies: EmptyInputSchema,
	referenceGetTimezones: EmptyInputSchema,
	referenceGetTimezoneOffsets: EmptyInputSchema,
	referenceGetKeys: EmptyInputSchema,
	organizationsCreate: OrganizationsCreateInputSchema,
	organizationsGetGroups: OrganizationsGetGroupsInputSchema,
	organizationsCreateGroup: OrganizationsCreateGroupInputSchema,
	organizationsDeleteGroup: OrganizationsDeleteGroupInputSchema,
	organizationsGetUsers: OrganizationsGetUsersInputSchema,
	organizationsCreateInvitation: OrganizationsCreateInvitationInputSchema,
	organizationsGetPlans: OrganizationsGetPlansInputSchema,
	organizationsGetSubscriptionPlans: OrganizationsGetPlansInputSchema,
	workspacesGetLogo: WorkspacesGetLogoInputSchema,
	workspacesGetPreferences: WorkspacesGetPreferencesInputSchema,
	projectsAddUser: ProjectsAddUserInputSchema,
	projectsDeleteGroup: ProjectsDeleteGroupInputSchema,
	timeEntriesBulkEdit: TimeEntriesBulkEditInputSchema,
	webhooksGetStatus: EmptyInputSchema,
	webhooksGetEventFilters: EmptyInputSchema,
	webhooksListSubscriptions: WebhooksListSubscriptionsInputSchema,
	webhooksDeleteSubscription: WebhooksDeleteSubscriptionInputSchema,
	smailSendDemo: SmailSendDemoInputSchema,
	smailSendContact: SmailSendContactInputSchema,
	smailSendMeet: SmailSendMeetInputSchema,
} as const;

export const TogglEndpointOutputSchemas = {
	meGet: TogglUserSchema,
	meUpdate: TogglUserSchema,
	meGetPreferences: TogglUserPreferencesSchema,
	meUpdatePreferences: TogglUserPreferencesSchema,
	workspacesList: z.array(TogglWorkspaceSchema),
	workspacesGet: TogglWorkspaceSchema,
	workspacesUpdate: TogglWorkspaceSchema,
	workspacesGetUsers: z.array(TogglWorkspaceUserSchema),
	organizationsGet: TogglOrganizationSchema,
	organizationsUpdate: TogglOrganizationSchema,
	organizationsGetWorkspaces: z.array(TogglWorkspaceSchema),
	clientsList: z.array(TogglClientSchema),
	clientsGet: TogglClientSchema,
	clientsCreate: TogglClientSchema,
	clientsUpdate: TogglClientSchema,
	clientsArchive: TogglClientArchiveResultSchema,
	clientsDelete: DeletedResultSchema,
	projectsList: z.array(TogglProjectSchema),
	projectsGet: TogglProjectSchema,
	projectsCreate: TogglProjectSchema,
	projectsUpdate: TogglProjectSchema,
	projectsDelete: DeletedResultSchema,
	tasksList: z.array(TogglTaskSchema),
	tasksGet: TogglTaskSchema,
	tasksCreate: TogglTaskSchema,
	tasksUpdate: TogglTaskSchema,
	tasksDelete: DeletedResultSchema,
	tagsList: z.array(TogglTagSchema),
	tagsCreate: TogglTagSchema,
	tagsUpdate: TogglTagSchema,
	tagsDelete: DeletedResultSchema,
	timeEntriesList: z.array(TogglTimeEntrySchema),
	timeEntriesGetCurrent: TogglTimeEntrySchema.nullable(),
	timeEntriesGet: TogglTimeEntrySchema,
	timeEntriesCreate: TogglTimeEntrySchema,
	timeEntriesUpdate: TogglTimeEntrySchema,
	timeEntriesStop: TogglTimeEntrySchema,
	timeEntriesDelete: DeletedResultSchema,
	meGetLogged: TogglAcknowledgementSchema,
	meGetLocation: TogglLocationSchema,
	meGetQuota: z.array(TogglQuotaSchema),
	meGetClients: z.array(TogglClientSchema),
	meGetProjects: z.array(TogglProjectSchema),
	meGetTags: z.array(TogglTagSchema),
	meGetTasks: z.array(TogglTaskSchema),
	meDisableProductEmails: TogglAcknowledgementSchema,
	meDisableWeeklyReport: TogglAcknowledgementSchema,
	referenceGetCountries: z.array(TogglCountrySchema),
	referenceGetCountrySubdivisions: z.array(TogglCountrySubdivisionSchema),
	referenceGetCurrencies: z.array(TogglCurrencySchema),
	referenceGetTimezones: z.array(z.string()),
	referenceGetTimezoneOffsets: z.array(TogglTimezoneOffsetSchema),
	referenceGetKeys: TogglKeysetSchema,
	organizationsCreate: TogglOrganizationSchema,
	organizationsGetGroups: z.array(TogglGroupSchema),
	organizationsCreateGroup: TogglGroupSchema,
	organizationsDeleteGroup: DeletedResultSchema,
	organizationsGetUsers: z.array(TogglOrganizationUserSchema),
	organizationsCreateInvitation: TogglPlanInfoSchema,
	organizationsGetPlans: TogglPlanInfoSchema,
	organizationsGetSubscriptionPlans: TogglPlanInfoSchema,
	workspacesGetLogo: TogglWorkspaceLogoSchema,
	workspacesGetPreferences: TogglWorkspacePreferencesSchema,
	projectsAddUser: TogglProjectUserSchema,
	projectsDeleteGroup: DeletedResultSchema,
	timeEntriesBulkEdit: BulkEditResultSchema,
	webhooksGetStatus: TogglWebhooksStatusSchema,
	webhooksGetEventFilters: TogglEventFiltersSchema,
	webhooksListSubscriptions: z.array(TogglSubscriptionSchema),
	webhooksDeleteSubscription: DeletedResultSchema,
	smailSendDemo: TogglAcknowledgementSchema,
	smailSendContact: TogglAcknowledgementSchema,
	smailSendMeet: TogglAcknowledgementSchema,
} as const;
