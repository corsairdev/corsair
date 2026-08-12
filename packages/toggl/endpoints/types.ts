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

export const TogglUserPreferencesSchema = z.object({
	timeofday_format: z.string().nullable().optional(),
	date_format: z.string().nullable().optional(),
	duration_format: z.string().nullable().optional(),
	CollapseTimeEntries: z.boolean().nullable().optional(),
});
export type TogglUserPreferences = z.infer<typeof TogglUserPreferencesSchema>;

export const TogglWorkspaceSchema = z.object({
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
});
export type TogglWorkspace = z.infer<typeof TogglWorkspaceSchema>;

export const TogglWorkspaceUserSchema = z.object({
	id: z.number(),
	user_id: z.number().nullable().optional(),
	workspace_id: z.number().nullable().optional(),
	admin: z.boolean().nullable().optional(),
	active: z.boolean().nullable().optional(),
	email: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	role: z.string().nullable().optional(),
	at: z.string().nullable().optional(),
});
export type TogglWorkspaceUser = z.infer<typeof TogglWorkspaceUserSchema>;

export const TogglOrganizationSchema = z.object({
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
});
export type TogglOrganization = z.infer<typeof TogglOrganizationSchema>;

export const TogglClientSchema = z.object({
	id: z.number(),
	wid: z.number().nullable().optional(),
	name: z.string(),
	archived: z.boolean().nullable().optional(),
	creator_id: z.number().nullable().optional(),
	at: z.string().nullable().optional(),
});
export type TogglClient = z.infer<typeof TogglClientSchema>;

export const TogglProjectSchema = z.object({
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
});
export type TogglProject = z.infer<typeof TogglProjectSchema>;

export const TogglTaskSchema = z.object({
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
});
export type TogglTask = z.infer<typeof TogglTaskSchema>;

export const TogglTagSchema = z.object({
	id: z.number(),
	workspace_id: z.number().nullable().optional(),
	name: z.string(),
	creator_id: z.number().nullable().optional(),
	at: z.string().nullable().optional(),
});
export type TogglTag = z.infer<typeof TogglTagSchema>;

export const TogglTimeEntrySchema = z.object({
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
});
export type TogglTimeEntry = z.infer<typeof TogglTimeEntrySchema>;

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
	default_workspace_id: z.number().optional(),
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
	workspace_id: z.number(),
});
export type WorkspacesGetInput = z.infer<typeof WorkspacesGetInputSchema>;

const WorkspacesUpdateInputSchema = z.object({
	workspace_id: z.number(),
	name: z.string().optional(),
	default_currency: z.string().optional(),
	default_hourly_rate: z.number().optional(),
	only_admins_may_create_projects: z.boolean().optional(),
	only_admins_may_create_tags: z.boolean().optional(),
});
export type WorkspacesUpdateInput = z.infer<typeof WorkspacesUpdateInputSchema>;

const WorkspacesGetUsersInputSchema = z.object({
	workspace_id: z.number(),
});
export type WorkspacesGetUsersInput = z.infer<
	typeof WorkspacesGetUsersInputSchema
>;

/* -------------------------------------------------------------------------- */
/* organizations                                                               */
/* -------------------------------------------------------------------------- */

const OrganizationsGetInputSchema = z.object({
	organization_id: z.number(),
});
export type OrganizationsGetInput = z.infer<typeof OrganizationsGetInputSchema>;

const OrganizationsUpdateInputSchema = z.object({
	organization_id: z.number(),
	name: z.string(),
});
export type OrganizationsUpdateInput = z.infer<
	typeof OrganizationsUpdateInputSchema
>;

const OrganizationsGetWorkspacesInputSchema = z.object({
	organization_id: z.number(),
});
export type OrganizationsGetWorkspacesInput = z.infer<
	typeof OrganizationsGetWorkspacesInputSchema
>;

/* -------------------------------------------------------------------------- */
/* clients                                                                     */
/* -------------------------------------------------------------------------- */

const ClientsListInputSchema = z.object({
	workspace_id: z.number(),
	/** Filter by archived state. Omit to return both. */
	status: z.enum(['active', 'archived', 'both']).optional(),
	/** Case-insensitive substring match on the client name. */
	name: z.string().optional(),
});
export type ClientsListInput = z.infer<typeof ClientsListInputSchema>;

const ClientsGetInputSchema = z.object({
	workspace_id: z.number(),
	client_id: z.number(),
});
export type ClientsGetInput = z.infer<typeof ClientsGetInputSchema>;

const ClientsCreateInputSchema = z.object({
	workspace_id: z.number(),
	name: z.string().min(1),
});
export type ClientsCreateInput = z.infer<typeof ClientsCreateInputSchema>;

const ClientsUpdateInputSchema = z.object({
	workspace_id: z.number(),
	client_id: z.number(),
	name: z.string().min(1).optional(),
	archived: z.boolean().optional(),
});
export type ClientsUpdateInput = z.infer<typeof ClientsUpdateInputSchema>;

const ClientsDeleteInputSchema = z.object({
	workspace_id: z.number(),
	client_id: z.number(),
});
export type ClientsDeleteInput = z.infer<typeof ClientsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* projects                                                                    */
/* -------------------------------------------------------------------------- */

const ProjectsListInputSchema = z.object({
	workspace_id: z.number(),
	active: z.boolean().optional(),
	/** Substring match on project name. */
	name: z.string().optional(),
	/** 1-based page number; Toggl pages projects rather than using cursors. */
	page: z.number().int().positive().optional(),
	per_page: z.number().int().positive().max(200).optional(),
});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsGetInputSchema = z.object({
	workspace_id: z.number(),
	project_id: z.number(),
});
export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectsCreateInputSchema = z.object({
	workspace_id: z.number(),
	name: z.string().min(1),
	client_id: z.number().optional(),
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
	workspace_id: z.number(),
	project_id: z.number(),
	name: z.string().min(1).optional(),
	client_id: z.number().nullable().optional(),
	active: z.boolean().optional(),
	is_private: z.boolean().optional(),
	billable: z.boolean().optional(),
	color: z.string().optional(),
});
export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

const ProjectsDeleteInputSchema = z.object({
	workspace_id: z.number(),
	project_id: z.number(),
});
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* tasks                                                                       */
/* -------------------------------------------------------------------------- */

const TasksListInputSchema = z.object({
	workspace_id: z.number(),
	project_id: z.number(),
});
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TasksGetInputSchema = z.object({
	workspace_id: z.number(),
	project_id: z.number(),
	task_id: z.number(),
});
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

const TasksCreateInputSchema = z.object({
	workspace_id: z.number(),
	project_id: z.number(),
	name: z.string().min(1),
	active: z.boolean().optional(),
	estimated_seconds: z.number().optional(),
	user_id: z.number().optional(),
});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

const TasksUpdateInputSchema = z.object({
	workspace_id: z.number(),
	project_id: z.number(),
	task_id: z.number(),
	name: z.string().min(1).optional(),
	active: z.boolean().optional(),
	estimated_seconds: z.number().optional(),
});
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

const TasksDeleteInputSchema = z.object({
	workspace_id: z.number(),
	project_id: z.number(),
	task_id: z.number(),
});
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* tags                                                                        */
/* -------------------------------------------------------------------------- */

const TagsListInputSchema = z.object({
	workspace_id: z.number(),
});
export type TagsListInput = z.infer<typeof TagsListInputSchema>;

const TagsCreateInputSchema = z.object({
	workspace_id: z.number(),
	name: z.string().min(1),
});
export type TagsCreateInput = z.infer<typeof TagsCreateInputSchema>;

const TagsUpdateInputSchema = z.object({
	workspace_id: z.number(),
	tag_id: z.number(),
	name: z.string().min(1),
});
export type TagsUpdateInput = z.infer<typeof TagsUpdateInputSchema>;

const TagsDeleteInputSchema = z.object({
	workspace_id: z.number(),
	tag_id: z.number(),
});
export type TagsDeleteInput = z.infer<typeof TagsDeleteInputSchema>;

/* -------------------------------------------------------------------------- */
/* time entries                                                                */
/* -------------------------------------------------------------------------- */

const TimeEntriesListInputSchema = z.object({
	/** RFC3339 or YYYY-MM-DD. Must be paired with `end_date`. */
	start_date: z.string().optional(),
	end_date: z.string().optional(),
	/** UNIX timestamp; returns entries modified since then. */
	since: z.number().optional(),
	before: z.string().optional(),
	meta: z.boolean().optional(),
});
export type TimeEntriesListInput = z.infer<typeof TimeEntriesListInputSchema>;

const TimeEntriesGetCurrentInputSchema = z.object({});
export type TimeEntriesGetCurrentInput = z.infer<
	typeof TimeEntriesGetCurrentInputSchema
>;

const TimeEntriesGetInputSchema = z.object({
	time_entry_id: z.number(),
});
export type TimeEntriesGetInput = z.infer<typeof TimeEntriesGetInputSchema>;

const TimeEntriesCreateInputSchema = z.object({
	workspace_id: z.number(),
	/** RFC3339. Toggl rejects entries without an explicit start. */
	start: z.string(),
	/**
	 * Seconds. A negative value marks the entry as still running, in which case
	 * Toggl expects -1 by convention.
	 */
	duration: z.number(),
	description: z.string().optional(),
	project_id: z.number().optional(),
	task_id: z.number().optional(),
	billable: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	tag_ids: z.array(z.number()).optional(),
	stop: z.string().optional(),
	/** Required by Toggl to identify the writing client. */
	created_with: z.string().optional(),
});
export type TimeEntriesCreateInput = z.infer<
	typeof TimeEntriesCreateInputSchema
>;

const TimeEntriesUpdateInputSchema = z.object({
	workspace_id: z.number(),
	time_entry_id: z.number(),
	description: z.string().optional(),
	start: z.string().optional(),
	stop: z.string().optional(),
	duration: z.number().optional(),
	project_id: z.number().nullable().optional(),
	task_id: z.number().nullable().optional(),
	billable: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	tag_ids: z.array(z.number()).optional(),
});
export type TimeEntriesUpdateInput = z.infer<
	typeof TimeEntriesUpdateInputSchema
>;

const TimeEntriesStopInputSchema = z.object({
	workspace_id: z.number(),
	time_entry_id: z.number(),
});
export type TimeEntriesStopInput = z.infer<typeof TimeEntriesStopInputSchema>;

const TimeEntriesDeleteInputSchema = z.object({
	workspace_id: z.number(),
	time_entry_id: z.number(),
});
export type TimeEntriesDeleteInput = z.infer<
	typeof TimeEntriesDeleteInputSchema
>;

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
} as const;
