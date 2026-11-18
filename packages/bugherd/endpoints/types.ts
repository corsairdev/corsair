import { FileInputSchema } from 'corsair/http';
import { z } from 'zod';

// Built from BugHerd's OpenAPI reference (docs.bugherd.com/api/openapi.yaml)
// and checked against the live API. Responses are loose objects with optional
// fields: list and detail routes return different subsets of the same record
// (a project in projects.json has no is_active; in projects/{id}.json it does).

const str = z.string().nullable().optional();
const num = z.number().nullable().optional();
const bool = z.boolean().nullable().optional();

// ── Shared response records ───────────────────────────────────────────────────

const UserSchema = z.looseObject({
	id: z.number(),
	email: str,
	display_name: str,
	avatar_url: str,
});

// A user embedded in a task (assignee, requester). Requesters can be
// outside the organization, so even the id is optional.
const PersonSchema = z.looseObject({
	id: num,
	email: str,
	display_name: str,
});

const ColumnSchema = z.looseObject({
	id: z.number(),
	name: str,
	project_id: num,
	position: num,
	// BugHerd documents that this can be wrong, even negative.
	tasks_count: num,
	created_at: str,
	updated_at: str,
});

// The project's widget `api_key` is removed before a project is returned.
const ProjectSchema = z.looseObject({
	id: z.number(),
	name: str,
	created_at: str,
	tasks: bool,
	devurl: str,
	is_active: bool,
	is_public: bool,
	has_custom_columns: bool,
	guests_see_guests: bool,
	owner_name: str,
	sites: z.array(z.string()).nullable().optional(),
	allow_guests_change_task_status: bool,
	assign_guests: bool,
	allow_project_summary_email: bool,
	allow_task_done_email: bool,
	allow_project_owner_notifications: bool,
	change_guest_default_column: bool,
	members: z.array(UserSchema).nullable().optional(),
	guests: z.array(UserSchema).nullable().optional(),
	columns: z.array(ColumnSchema).nullable().optional(),
});

const AttachmentSchema = z.looseObject({
	id: z.number(),
	file_name: str,
	url: str,
	created_at: str,
});

const TaskSchema = z.looseObject({
	id: z.number(),
	local_task_id: num,
	project_id: num,
	created_at: str,
	updated_at: str,
	closed_at: str,
	deleted_at: str,
	title: str,
	description: str,
	// backlog, todo, doing, done, closed, or a custom column's name.
	status: str,
	status_id: num,
	priority: str,
	priority_id: num,
	site: str,
	url: str,
	tag_names: z.array(z.string()).nullable().optional(),
	external_id: str,
	requester_email: str,
	attachments: z.array(AttachmentSchema).nullable().optional(),
	screenshot_url: str,
	secret_link: str,
	admin_link: str,
	// User objects; BugHerd sends null when unset.
	assigned_to: PersonSchema.nullable().optional(),
	requester: PersonSchema.nullable().optional(),
	project_name: str,
	due_at: str,
	assignee_ids: z.array(z.number()).nullable().optional(),
	assigned_to_id: num,
	requester_id: num,
	column_id: num,
	// Browser, OS and page details captured by the widget; shape varies.
	metadata: z.record(z.string(), z.unknown()).nullable().optional(),
});

const CommentSchema = z.looseObject({
	id: z.number(),
	text: str,
	created_at: str,
	user_id: num,
	is_private: bool,
});

const WebhookSchema = z.looseObject({
	id: z.number(),
	target_url: str,
	// project_create, task_create, task_update, comment, task_destroy.
	event: str,
	project_id: num,
	project_name: str,
	success_count: num,
	error_count: num,
	last_error_code: num,
	last_error_at: str,
	first_error_at: str,
	first_success_at: str,
	last_success_at: str,
});

const OrganizationSchema = z.looseObject({
	id: z.number(),
	name: str,
});

const MetaSchema = z.looseObject({ count: num }).optional();

const SuccessSchema = z.looseObject({ success: bool });

// ── Shared input pieces ───────────────────────────────────────────────────────

const Id = z.number().int().positive();
const page = z
	.number()
	.int()
	.positive()
	.optional()
	.describe('Page number, from 1. Pages hold up to 100 records.');
const since = (what: string) =>
	z
		.string()
		.optional()
		.describe(`Only records ${what} after this ISO 8601 timestamp.`);
const Priority = z
	.enum(['not set', 'critical', 'important', 'normal', 'minor'])
	.describe('Task priority.');
const ProjectId = Id.describe('BugHerd project id.');
const TaskId = Id.describe(
	'Global task id (the `id` field, not the #number shown in the UI).',
);

// ── Organization and users ────────────────────────────────────────────────────

export const ShowOrganizationInputSchema = z.object({});
export const ShowOrganizationOutputSchema = z.looseObject({
	organization: OrganizationSchema,
});

export const ListUsersInputSchema = z.object({
	updated_since: since('updated'),
	page,
});
export const ListMembersInputSchema = z.object({ page });
export const ListGuestsInputSchema = z.object({ page });
export const UserListOutputSchema = z.looseObject({
	users: z.array(UserSchema),
	meta: MetaSchema,
});

export const ShowUserProjectsInputSchema = z.object({
	user_id: Id.describe('BugHerd user id.'),
	is_active: z
		.boolean()
		.optional()
		.describe('Only active or inactive projects.'),
	created_since: since('created'),
	page,
});

export const ShowUserTasksInputSchema = z.object({
	user_id: Id.describe('BugHerd user id.'),
	updated_since: since('updated'),
	created_since: since('created'),
	priority: Priority.optional(),
	tag: z.string().optional().describe('Only tasks with this tag.'),
	assigned_to_id: Id.optional().describe('Only tasks assigned to this user.'),
	page,
});

// ── Projects ──────────────────────────────────────────────────────────────────

export const ListProjectsInputSchema = z.object({ page });
export const ListActiveProjectsInputSchema = z.object({ page });
export const ProjectListOutputSchema = z.looseObject({
	projects: z.array(ProjectSchema),
	meta: MetaSchema,
});

export const ShowProjectDetailsInputSchema = z.object({
	project_id: ProjectId,
});
export const ProjectOutputSchema = z.looseObject({ project: ProjectSchema });

export const CreateProjectInputSchema = z.object({
	name: z.string().min(1).describe('Project name.'),
	devurl: z
		.string()
		.min(1)
		.describe('The website the project gives feedback on.'),
	is_active: z.boolean().optional(),
	is_public: z
		.boolean()
		.optional()
		.describe('Let anyone leave feedback without a login.'),
	guests_see_guests: z
		.boolean()
		.optional()
		.describe("Let guests see other guests' feedback."),
});

export const UpdateProjectInputSchema = z.object({
	project_id: ProjectId,
	name: z.string().min(1).optional(),
	devurl: z.string().min(1).optional(),
	is_active: z.boolean().optional(),
	is_public: z.boolean().optional(),
	has_custom_columns: z.boolean().optional(),
	guests_see_guests: z.boolean().optional(),
});

export const DeleteProjectInputSchema = z.object({ project_id: ProjectId });
export const DeleteOutputSchema = SuccessSchema;

export const AddMemberToProjectInputSchema = z.object({
	project_id: ProjectId,
	user_id: z
		.union([Id, z.array(Id).min(1)])
		.describe('Id of an organization member, or a list of ids.'),
});

export const AddGuestToProjectInputSchema = z
	.object({
		project_id: ProjectId,
		user_id: Id.optional().describe('Id of an existing user.'),
		email: z
			.string()
			.email()
			.optional()
			.describe(
				'Invite a new guest by email. BugHerd emails them an invitation.',
			),
	})
	.refine((v) => (v.user_id === undefined) !== (v.email === undefined), {
		message: 'Give user_id or email, not both.',
	});

// ── Tasks ─────────────────────────────────────────────────────────────────────

export const ListTasksInputSchema = z.object({
	project_id: ProjectId,
	updated_since: since('updated'),
	created_since: since('created'),
	status: z
		.string()
		.optional()
		.describe(
			'Column name: backlog, todo, doing, done, closed or a custom column.',
		),
	priority: Priority.optional(),
	tag: z.string().optional().describe('Only tasks with this tag.'),
	assigned_to_id: Id.optional().describe('Only tasks assigned to this user.'),
	external_id: z.string().optional(),
	page,
});
export const ListProjectTasksViewInputSchema = z.object({
	project_id: ProjectId,
	page,
});
export const TaskListOutputSchema = z.looseObject({
	tasks: z.array(TaskSchema),
	meta: MetaSchema,
});

export const ShowTaskInputSchema = z.object({
	task_id: TaskId,
	project_id: ProjectId.optional().describe(
		'Project id. Without it the task is looked up by its global id alone.',
	),
});
export const ShowTaskByLocalIdInputSchema = z.object({
	project_id: ProjectId,
	local_task_id: Id.describe('The #number shown in the BugHerd UI.'),
});
export const TaskOutputSchema = z.looseObject({ task: TaskSchema });

export const CreateTaskInputSchema = z.object({
	project_id: ProjectId,
	description: z.string().min(1).describe('What the task is about.'),
	priority: Priority.optional(),
	status: z
		.string()
		.optional()
		.describe(
			'Column name. Leave it out to put the task in the Feedback panel.',
		),
	requester_id: Id.optional(),
	requester_email: z.string().email().optional(),
	assigned_to_id: Id.optional(),
	assigned_to_email: z
		.string()
		.email()
		.optional()
		.describe('Must be a member of the project.'),
	tag_names: z.array(z.string()).optional(),
	external_id: z
		.string()
		.optional()
		.describe('Your own reference for the task.'),
});

export const UpdateTaskInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
	description: z.string().min(1).optional(),
	priority: Priority.optional(),
	status: z
		.string()
		.optional()
		.describe(
			'Column name, or `feedback` to move it back to the Feedback panel.',
		),
	assigned_to_id: Id.nullable()
		.optional()
		.describe('Assignee id, or null to unassign everyone.'),
	assigned_to_email: z.string().email().optional(),
	unassign_user: Id.optional().describe('Remove this one assignee.'),
	tag_names: z.array(z.string()).optional(),
	external_id: z.string().optional(),
	site: z.string().optional(),
	url: z.string().optional(),
	updater_email: z
		.string()
		.email()
		.optional()
		.describe('Who to credit the change to in the task history.'),
});

export const DeleteTaskInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
});

export const MoveTasksInputSchema = z.object({
	project_id: ProjectId.describe('The project the tasks are in now.'),
	destination_project_id: ProjectId.describe('The project to move them to.'),
	task_ids: z
		.array(Id)
		.min(1)
		.describe("The tasks' #numbers (local_task_id), not their global ids."),
});
export const MoveTasksOutputSchema = z.looseObject({});

// ── Comments ──────────────────────────────────────────────────────────────────

export const ListCommentsInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
});
export const CommentListOutputSchema = z.looseObject({
	comments: z.array(CommentSchema),
	meta: MetaSchema,
});

export const CreateCommentInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
	text: z.string().min(1).describe('Comment text.'),
	user_id: Id.optional().describe('Who the comment is from.'),
	email: z
		.string()
		.email()
		.optional()
		.describe('Who the comment is from, by email, instead of user_id.'),
	is_private: z
		.boolean()
		.optional()
		.describe('Visible to team members only, not guests.'),
});
export const CommentOutputSchema = z.looseObject({ comment: CommentSchema });

// ── Attachments ───────────────────────────────────────────────────────────────

export const ListAttachmentsInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
});
export const AttachmentListOutputSchema = z.looseObject({
	attachments: z.array(AttachmentSchema),
	meta: MetaSchema,
});

export const ShowAttachmentInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
	attachment_id: Id,
});
export const AttachmentOutputSchema = z.looseObject({
	attachment: AttachmentSchema,
});

export const CreateAttachmentInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
	file_name: z.string().min(1).describe('Name to show for the file.'),
	url: z
		.string()
		.url()
		.describe('Public URL of the file. BugHerd downloads and keeps a copy.'),
});

export const UploadAttachmentInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
	file: FileInputSchema,
});

export const DeleteAttachmentInputSchema = z.object({
	project_id: ProjectId,
	task_id: TaskId,
	attachment_id: Id,
});

// ── Columns ───────────────────────────────────────────────────────────────────

export const ListColumnsInputSchema = z.object({ project_id: ProjectId });
export const ColumnListOutputSchema = z.looseObject({
	columns: z.array(ColumnSchema),
});

export const ShowColumnInputSchema = z.object({
	project_id: ProjectId,
	column_id: Id,
});
export const ColumnOutputSchema = z.looseObject({ column: ColumnSchema });

export const CreateColumnInputSchema = z.object({
	project_id: ProjectId,
	name: z
		.string()
		.min(1)
		.describe('Column name. It is added at the end of the board.'),
});

export const UpdateColumnInputSchema = z.object({
	project_id: ProjectId,
	column_id: Id,
	name: z.string().min(1),
});

export const DeleteColumnInputSchema = z.object({
	project_id: ProjectId,
	column_id: Id,
});

// ── Webhooks ──────────────────────────────────────────────────────────────────

export const ListWebhooksInputSchema = z.object({});
export const WebhookListOutputSchema = z.looseObject({
	webhooks: z.array(WebhookSchema),
});

export const CreateWebhookInputSchema = z.object({
	target_url: z.string().url().describe('Where BugHerd POSTs the event.'),
	event: z.enum([
		'project_create',
		'task_create',
		'task_update',
		'comment',
		'task_destroy',
	]),
	project_id: ProjectId.optional().describe('Leave out for every project.'),
});
export const WebhookOutputSchema = z.looseObject({ webhook: WebhookSchema });

export const DeleteWebhookInputSchema = z.object({ webhook_id: Id });

// ── Maps ──────────────────────────────────────────────────────────────────────

export const BugherdEndpointInputSchemas = {
	showOrganization: ShowOrganizationInputSchema,
	listUsers: ListUsersInputSchema,
	listMembers: ListMembersInputSchema,
	listGuests: ListGuestsInputSchema,
	showUserProjects: ShowUserProjectsInputSchema,
	showUserTasks: ShowUserTasksInputSchema,
	listProjects: ListProjectsInputSchema,
	listActiveProjects: ListActiveProjectsInputSchema,
	showProjectDetails: ShowProjectDetailsInputSchema,
	createProject: CreateProjectInputSchema,
	updateProject: UpdateProjectInputSchema,
	deleteProject: DeleteProjectInputSchema,
	addMemberToProject: AddMemberToProjectInputSchema,
	addGuestToProject: AddGuestToProjectInputSchema,
	listTasks: ListTasksInputSchema,
	listFeedbackTasks: ListProjectTasksViewInputSchema,
	listArchivedTasks: ListProjectTasksViewInputSchema,
	listTaskboardTasks: ListProjectTasksViewInputSchema,
	showTask: ShowTaskInputSchema,
	showTaskByLocalId: ShowTaskByLocalIdInputSchema,
	createTask: CreateTaskInputSchema,
	updateTask: UpdateTaskInputSchema,
	deleteTask: DeleteTaskInputSchema,
	moveTasks: MoveTasksInputSchema,
	listComments: ListCommentsInputSchema,
	createComment: CreateCommentInputSchema,
	listAttachments: ListAttachmentsInputSchema,
	showAttachment: ShowAttachmentInputSchema,
	createAttachment: CreateAttachmentInputSchema,
	uploadAttachment: UploadAttachmentInputSchema,
	deleteAttachment: DeleteAttachmentInputSchema,
	listColumns: ListColumnsInputSchema,
	showColumn: ShowColumnInputSchema,
	createColumn: CreateColumnInputSchema,
	updateColumn: UpdateColumnInputSchema,
	deleteColumn: DeleteColumnInputSchema,
	listWebhooks: ListWebhooksInputSchema,
	createWebhook: CreateWebhookInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
} as const;

export const BugherdEndpointOutputSchemas = {
	showOrganization: ShowOrganizationOutputSchema,
	listUsers: UserListOutputSchema,
	listMembers: UserListOutputSchema,
	listGuests: UserListOutputSchema,
	showUserProjects: ProjectListOutputSchema,
	showUserTasks: TaskListOutputSchema,
	listProjects: ProjectListOutputSchema,
	listActiveProjects: ProjectListOutputSchema,
	showProjectDetails: ProjectOutputSchema,
	createProject: ProjectOutputSchema,
	updateProject: ProjectOutputSchema,
	deleteProject: DeleteOutputSchema,
	addMemberToProject: ProjectOutputSchema,
	addGuestToProject: ProjectOutputSchema,
	listTasks: TaskListOutputSchema,
	listFeedbackTasks: TaskListOutputSchema,
	listArchivedTasks: TaskListOutputSchema,
	listTaskboardTasks: TaskListOutputSchema,
	showTask: TaskOutputSchema,
	showTaskByLocalId: TaskOutputSchema,
	createTask: TaskOutputSchema,
	updateTask: TaskOutputSchema,
	deleteTask: DeleteOutputSchema,
	moveTasks: MoveTasksOutputSchema,
	listComments: CommentListOutputSchema,
	createComment: CommentOutputSchema,
	listAttachments: AttachmentListOutputSchema,
	showAttachment: AttachmentOutputSchema,
	createAttachment: AttachmentOutputSchema,
	uploadAttachment: AttachmentOutputSchema,
	deleteAttachment: DeleteOutputSchema,
	listColumns: ColumnListOutputSchema,
	showColumn: ColumnOutputSchema,
	createColumn: ColumnOutputSchema,
	updateColumn: ColumnOutputSchema,
	deleteColumn: DeleteOutputSchema,
	listWebhooks: WebhookListOutputSchema,
	createWebhook: WebhookOutputSchema,
	deleteWebhook: DeleteOutputSchema,
} as const;

type InputSchemas = typeof BugherdEndpointInputSchemas;
type OutputSchemas = typeof BugherdEndpointOutputSchemas;

export type BugherdEndpointInputs = {
	[K in keyof InputSchemas]: z.input<InputSchemas[K]>;
};
export type BugherdEndpointOutputs = {
	[K in keyof OutputSchemas]: z.infer<OutputSchemas[K]>;
};

export type BugherdProjectRecord = z.infer<typeof ProjectSchema>;
export type BugherdTaskRecord = z.infer<typeof TaskSchema>;
export type BugherdColumnRecord = z.infer<typeof ColumnSchema>;
export type BugherdCommentRecord = z.infer<typeof CommentSchema>;
export type BugherdAttachmentRecord = z.infer<typeof AttachmentSchema>;
export type BugherdWebhookRecord = z.infer<typeof WebhookSchema>;
export type BugherdUserRecord = z.infer<typeof UserSchema>;
