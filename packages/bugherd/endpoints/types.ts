import { z } from 'zod';

// ── Shared Sub-Schemas ────────────────────────────────────────────────────────

const UserSchema = z.object({
	id: z.number(),
	email: z.string(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	name: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

const ProjectSchema = z.object({
	id: z.number(),
	name: z.string(),
	is_active: z.boolean(),
	is_public: z.boolean(),
	created_at: z.string(),
	updated_at: z.string(),
	deleted_at: z.string().nullable(),
	description: z.string().nullable(),
	technical_contact_email: z.string().nullable(),
	guest_default_role: z.string().nullable(),
	settings: z.record(z.string(), z.unknown()).optional(),
});

const TaskSchema = z.object({
	id: z.number(),
	description: z.string(),
	status: z.string(),
	priority: z.string().nullable(),
	tag_list: z.array(z.string()),
	created_at: z.string(),
	updated_at: z.string(),
	closed_at: z.string().nullable(),
	project_id: z.number(),
	reporter_id: z.number().nullable(),
	assignee_id: z.number().nullable(),
	external_id: z.string().nullable(),
	attachments_count: z.number(),
	comments_count: z.number(),
	due_date: z.string().nullable(),
	duedate: z.string().nullable(),
	column_id: z.number().nullable(),
});

const ColumnSchema = z.object({
	id: z.number(),
	name: z.string(),
	project_id: z.number(),
	position: z.number(),
	created_at: z.string(),
	updated_at: z.string(),
});

const AttachmentSchema = z.object({
	id: z.number(),
	file_name: z.string(),
	file_size: z.number(),
	content_type: z.string(),
	url: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	task_id: z.number(),
	user_id: z.number(),
});

const CommentSchema = z.object({
	id: z.number(),
	body: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
	task_id: z.number(),
	user_id: z.number(),
});

const WebhookSchema = z.object({
	id: z.number(),
	url: z.string(),
	project_id: z.number(),
	events: z.array(z.string()),
	created_at: z.string(),
	updated_at: z.string(),
});

const OrganizationSchema = z.object({
	id: z.number(),
	name: z.string(),
	created_at: z.string(),
	updated_at: z.string(),
});

const PaginationSchema = z.object({
	page: z.number().optional(),
	per_page: z.number().optional(),
});

// ── Input Schemas ─────────────────────────────────────────────────────────────

// Add Guest to Project
export const AddGuestToProjectInputSchema = z.object({
	project_id: z.number(),
	email: z.string().email(),
	role: z.enum(['guest', 'client', 'member']).optional(),
});

export type AddGuestToProjectInput = z.infer<
	typeof AddGuestToProjectInputSchema
>;

// Add Member to Project
export const AddMemberToProjectInputSchema = z.object({
	project_id: z.number(),
	user_id: z.number(),
	role: z.enum(['member', 'manager']).optional(),
});

export type AddMemberToProjectInput = z.infer<
	typeof AddMemberToProjectInputSchema
>;

// Create Attachment
export const CreateAttachmentInputSchema = z.object({
	task_id: z.number(),
	file: z.instanceof(File).optional(), // For multipart upload
	file_name: z.string().optional(),
	file_size: z.number().optional(),
	content_type: z.string().optional(),
	url: z.string().url().optional(),
});

export type CreateAttachmentInput = z.infer<typeof CreateAttachmentInputSchema>;

// Create Column
export const CreateColumnInputSchema = z.object({
	project_id: z.number(),
	name: z.string(),
	position: z.number().optional(),
});

export type CreateColumnInput = z.infer<typeof CreateColumnInputSchema>;

// Create Comment
export const CreateCommentInputSchema = z.object({
	task_id: z.number(),
	body: z.string(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentInputSchema>;

// Create Project
export const CreateProjectInputSchema = z.object({
	name: z.string(),
	is_active: z.boolean().optional(),
	is_public: z.boolean().optional(),
	description: z.string().nullable().optional(),
	technical_contact_email: z.string().nullable().optional(),
	guest_default_role: z.string().nullable().optional(),
});

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

// Create Task
export const CreateTaskInputSchema = z.object({
	project_id: z.number(),
	description: z.string(),
	priority: z.enum(['critical', 'high', 'normal', 'low']).optional(),
	status: z.string().optional(),
	tag_list: z.array(z.string()).optional(),
	assignee_id: z.number().nullable().optional(),
	reporter_id: z.number().nullable().optional(),
	external_id: z.string().nullable().optional(),
	due_date: z.string().nullable().optional(),
	column_id: z.number().nullable().optional(),
});

export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

// Create Webhook
export const CreateWebhookInputSchema = z.object({
	project_id: z.number(),
	url: z.string().url(),
	events: z.array(z.string()),
});

export type CreateWebhookInput = z.infer<typeof CreateWebhookInputSchema>;

// Delete Project
export const DeleteProjectInputSchema = z.object({
	project_id: z.number(),
});

export type DeleteProjectInput = z.infer<typeof DeleteProjectInputSchema>;

// List Active Projects
export const ListActiveProjectsInputSchema = z.object({
	...PaginationSchema.shape,
});

export type ListActiveProjectsInput = z.infer<
	typeof ListActiveProjectsInputSchema
>;

// List Attachments
export const ListAttachmentsInputSchema = z.object({
	task_id: z.number(),
	...PaginationSchema.shape,
});

export type ListAttachmentsInput = z.infer<typeof ListAttachmentsInputSchema>;

// List Columns
export const ListColumnsInputSchema = z.object({
	project_id: z.number(),
});

export type ListColumnsInput = z.infer<typeof ListColumnsInputSchema>;

// List Projects
export const ListProjectsInputSchema = z.object({
	...PaginationSchema.shape,
});

export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;

// List Users
export const ListUsersInputSchema = z.object({
	...PaginationSchema.shape,
});

export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;

// List Webhooks
export const ListWebhooksInputSchema = z.object({
	project_id: z.number(),
	...PaginationSchema.shape,
});

export type ListWebhooksInput = z.infer<typeof ListWebhooksInputSchema>;

// Show Attachment
export const ShowAttachmentInputSchema = z.object({
	attachment_id: z.number(),
});

export type ShowAttachmentInput = z.infer<typeof ShowAttachmentInputSchema>;

// Show Column
export const ShowColumnInputSchema = z.object({
	column_id: z.number(),
});

export type ShowColumnInput = z.infer<typeof ShowColumnInputSchema>;

// Show Organization
export const ShowOrganizationInputSchema = z.object({});

export type ShowOrganizationInput = z.infer<typeof ShowOrganizationInputSchema>;

// Show Project Details
export const ShowProjectDetailsInputSchema = z.object({
	project_id: z.number(),
});

export type ShowProjectDetailsInput = z.infer<
	typeof ShowProjectDetailsInputSchema
>;

// Show User Projects
export const ShowUserProjectsInputSchema = z.object({
	user_id: z.number(),
	...PaginationSchema.shape,
});

export type ShowUserProjectsInput = z.infer<typeof ShowUserProjectsInputSchema>;

// Show User Tasks
export const ShowUserTasksInputSchema = z.object({
	user_id: z.number(),
	...PaginationSchema.shape,
});

export type ShowUserTasksInput = z.infer<typeof ShowUserTasksInputSchema>;

// Update Column
export const UpdateColumnInputSchema = z.object({
	column_id: z.number(),
	name: z.string().optional(),
	position: z.number().optional(),
});

export type UpdateColumnInput = z.infer<typeof UpdateColumnInputSchema>;

// Update Project
export const UpdateProjectInputSchema = z.object({
	project_id: z.number(),
	name: z.string().optional(),
	is_active: z.boolean().optional(),
	is_public: z.boolean().optional(),
	description: z.string().nullable().optional(),
	technical_contact_email: z.string().nullable().optional(),
	guest_default_role: z.string().nullable().optional(),
});

export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;

// Update Task
export const UpdateTaskInputSchema = z.object({
	task_id: z.number(),
	description: z.string().optional(),
	priority: z.enum(['critical', 'high', 'normal', 'low']).optional(),
	status: z.string().optional(),
	tag_list: z.array(z.string()).optional(),
	assignee_id: z.number().nullable().optional(),
	reporter_id: z.number().nullable().optional(),
	external_id: z.string().nullable().optional(),
	due_date: z.string().nullable().optional(),
	column_id: z.number().nullable().optional(),
});

export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;

// Upload Attachment
export const UploadAttachmentInputSchema = z.object({
	task_id: z.number(),
	file: z.instanceof(File),
});

export type UploadAttachmentInput = z.infer<typeof UploadAttachmentInputSchema>;

// ── Output Schemas ────────────────────────────────────────────────────────────

export const AddGuestToProjectOutputSchema = z.object({
	user: UserSchema,
});

export type AddGuestToProjectOutput = z.infer<
	typeof AddGuestToProjectOutputSchema
>;

export const AddMemberToProjectOutputSchema = z.object({
	user: UserSchema,
});

export type AddMemberToProjectOutput = z.infer<
	typeof AddMemberToProjectOutputSchema
>;

export const CreateAttachmentOutputSchema = z.object({
	attachment: AttachmentSchema,
});

export type CreateAttachmentOutput = z.infer<
	typeof CreateAttachmentOutputSchema
>;

export const CreateColumnOutputSchema = z.object({
	column: ColumnSchema,
});

export type CreateColumnOutput = z.infer<typeof CreateColumnOutputSchema>;

export const CreateCommentOutputSchema = z.object({
	comment: CommentSchema,
});

export type CreateCommentOutput = z.infer<typeof CreateCommentOutputSchema>;

export const CreateProjectOutputSchema = z.object({
	project: ProjectSchema,
});

export type CreateProjectOutput = z.infer<typeof CreateProjectOutputSchema>;

export const CreateTaskOutputSchema = z.object({
	task: TaskSchema,
});

export type CreateTaskOutput = z.infer<typeof CreateTaskOutputSchema>;

export const CreateWebhookOutputSchema = z.object({
	webhook: WebhookSchema,
});

export type CreateWebhookOutput = z.infer<typeof CreateWebhookOutputSchema>;

export const DeleteProjectOutputSchema = z.object({});

export type DeleteProjectOutput = z.infer<typeof DeleteProjectOutputSchema>;

export const ListActiveProjectsOutputSchema = z.object({
	projects: z.array(ProjectSchema),
	meta: z
		.object({
			current_page: z.number(),
			total_pages: z.number(),
			total_count: z.number(),
		})
		.optional(),
});

export type ListActiveProjectsOutput = z.infer<
	typeof ListActiveProjectsOutputSchema
>;

export const ListAttachmentsOutputSchema = z.object({
	attachments: z.array(AttachmentSchema),
	meta: z
		.object({
			current_page: z.number(),
			total_pages: z.number(),
			total_count: z.number(),
		})
		.optional(),
});

export type ListAttachmentsOutput = z.infer<typeof ListAttachmentsOutputSchema>;

export const ListColumnsOutputSchema = z.object({
	columns: z.array(ColumnSchema),
});

export type ListColumnsOutput = z.infer<typeof ListColumnsOutputSchema>;

export const ListProjectsOutputSchema = z.object({
	projects: z.array(ProjectSchema),
	meta: z
		.object({
			current_page: z.number(),
			total_pages: z.number(),
			total_count: z.number(),
		})
		.optional(),
});

export type ListProjectsOutput = z.infer<typeof ListProjectsOutputSchema>;

export const ListUsersOutputSchema = z.object({
	users: z.array(UserSchema),
	meta: z
		.object({
			current_page: z.number(),
			total_pages: z.number(),
			total_count: z.number(),
		})
		.optional(),
});

export type ListUsersOutput = z.infer<typeof ListUsersOutputSchema>;

export const ListWebhooksOutputSchema = z.object({
	webhooks: z.array(WebhookSchema),
	meta: z
		.object({
			current_page: z.number(),
			total_pages: z.number(),
			total_count: z.number(),
		})
		.optional(),
});

export type ListWebhooksOutput = z.infer<typeof ListWebhooksOutputSchema>;

export const ShowAttachmentOutputSchema = z.object({
	attachment: AttachmentSchema,
});

export type ShowAttachmentOutput = z.infer<typeof ShowAttachmentOutputSchema>;

export const ShowColumnOutputSchema = z.object({
	column: ColumnSchema,
});

export type ShowColumnOutput = z.infer<typeof ShowColumnOutputSchema>;

export const ShowOrganizationOutputSchema = z.object({
	organization: OrganizationSchema,
});

export type ShowOrganizationOutput = z.infer<
	typeof ShowOrganizationOutputSchema
>;

export const ShowProjectDetailsOutputSchema = z.object({
	project: ProjectSchema,
});

export type ShowProjectDetailsOutput = z.infer<
	typeof ShowProjectDetailsOutputSchema
>;

export const ShowUserProjectsOutputSchema = z.object({
	projects: z.array(ProjectSchema),
	meta: z
		.object({
			current_page: z.number(),
			total_pages: z.number(),
			total_count: z.number(),
		})
		.optional(),
});

export type ShowUserProjectsOutput = z.infer<
	typeof ShowUserProjectsOutputSchema
>;

export const ShowUserTasksOutputSchema = z.object({
	tasks: z.array(TaskSchema),
	meta: z
		.object({
			current_page: z.number(),
			total_pages: z.number(),
			total_count: z.number(),
		})
		.optional(),
});

export type ShowUserTasksOutput = z.infer<typeof ShowUserTasksOutputSchema>;

export const UpdateColumnOutputSchema = z.object({
	column: ColumnSchema,
});

export type UpdateColumnOutput = z.infer<typeof UpdateColumnOutputSchema>;

export const UpdateProjectOutputSchema = z.object({
	project: ProjectSchema,
});

export type UpdateProjectOutput = z.infer<typeof UpdateProjectOutputSchema>;

export const UpdateTaskOutputSchema = z.object({
	task: TaskSchema,
});

export type UpdateTaskOutput = z.infer<typeof UpdateTaskOutputSchema>;

export const UploadAttachmentOutputSchema = z.object({
	attachment: AttachmentSchema,
});

export type UploadAttachmentOutput = z.infer<
	typeof UploadAttachmentOutputSchema
>;

// ── Aggregated Types ──────────────────────────────────────────────────────────

export type BugherdEndpointInputs = {
	addGuestToProject: AddGuestToProjectInput;
	addMemberToProject: AddMemberToProjectInput;
	createAttachment: CreateAttachmentInput;
	createColumn: CreateColumnInput;
	createComment: CreateCommentInput;
	createProject: CreateProjectInput;
	createTask: CreateTaskInput;
	createWebhook: CreateWebhookInput;
	deleteProject: DeleteProjectInput;
	listActiveProjects: ListActiveProjectsInput;
	listAttachments: ListAttachmentsInput;
	listColumns: ListColumnsInput;
	listProjects: ListProjectsInput;
	listUsers: ListUsersInput;
	listWebhooks: ListWebhooksInput;
	showAttachment: ShowAttachmentInput;
	showColumn: ShowColumnInput;
	showOrganization: ShowOrganizationInput;
	showProjectDetails: ShowProjectDetailsInput;
	showUserProjects: ShowUserProjectsInput;
	showUserTasks: ShowUserTasksInput;
	updateColumn: UpdateColumnInput;
	updateProject: UpdateProjectInput;
	updateTask: UpdateTaskInput;
	uploadAttachment: UploadAttachmentInput;
};

export type BugherdEndpointOutputs = {
	addGuestToProject: AddGuestToProjectOutput;
	addMemberToProject: AddMemberToProjectOutput;
	createAttachment: CreateAttachmentOutput;
	createColumn: CreateColumnOutput;
	createComment: CreateCommentOutput;
	createProject: CreateProjectOutput;
	createTask: CreateTaskOutput;
	createWebhook: CreateWebhookOutput;
	deleteProject: DeleteProjectOutput;
	listActiveProjects: ListActiveProjectsOutput;
	listAttachments: ListAttachmentsOutput;
	listColumns: ListColumnsOutput;
	listProjects: ListProjectsOutput;
	listUsers: ListUsersOutput;
	listWebhooks: ListWebhooksOutput;
	showAttachment: ShowAttachmentOutput;
	showColumn: ShowColumnOutput;
	showOrganization: ShowOrganizationOutput;
	showProjectDetails: ShowProjectDetailsOutput;
	showUserProjects: ShowUserProjectsOutput;
	showUserTasks: ShowUserTasksOutput;
	updateColumn: UpdateColumnOutput;
	updateProject: UpdateProjectOutput;
	updateTask: UpdateTaskOutput;
	uploadAttachment: UploadAttachmentOutput;
};

export const BugherdEndpointInputSchemas = {
	addGuestToProject: AddGuestToProjectInputSchema,
	addMemberToProject: AddMemberToProjectInputSchema,
	createAttachment: CreateAttachmentInputSchema,
	createColumn: CreateColumnInputSchema,
	createComment: CreateCommentInputSchema,
	createProject: CreateProjectInputSchema,
	createTask: CreateTaskInputSchema,
	createWebhook: CreateWebhookInputSchema,
	deleteProject: DeleteProjectInputSchema,
	listActiveProjects: ListActiveProjectsInputSchema,
	listAttachments: ListAttachmentsInputSchema,
	listColumns: ListColumnsInputSchema,
	listProjects: ListProjectsInputSchema,
	listUsers: ListUsersInputSchema,
	listWebhooks: ListWebhooksInputSchema,
	showAttachment: ShowAttachmentInputSchema,
	showColumn: ShowColumnInputSchema,
	showOrganization: ShowOrganizationInputSchema,
	showProjectDetails: ShowProjectDetailsInputSchema,
	showUserProjects: ShowUserProjectsInputSchema,
	showUserTasks: ShowUserTasksInputSchema,
	updateColumn: UpdateColumnInputSchema,
	updateProject: UpdateProjectInputSchema,
	updateTask: UpdateTaskInputSchema,
	uploadAttachment: UploadAttachmentInputSchema,
} as const;

export const BugherdEndpointOutputSchemas = {
	addGuestToProject: AddGuestToProjectOutputSchema,
	addMemberToProject: AddMemberToProjectOutputSchema,
	createAttachment: CreateAttachmentOutputSchema,
	createColumn: CreateColumnOutputSchema,
	createComment: CreateCommentOutputSchema,
	createProject: CreateProjectOutputSchema,
	createTask: CreateTaskOutputSchema,
	createWebhook: CreateWebhookOutputSchema,
	deleteProject: DeleteProjectOutputSchema,
	listActiveProjects: ListActiveProjectsOutputSchema,
	listAttachments: ListAttachmentsOutputSchema,
	listColumns: ListColumnsOutputSchema,
	listProjects: ListProjectsOutputSchema,
	listUsers: ListUsersOutputSchema,
	listWebhooks: ListWebhooksOutputSchema,
	showAttachment: ShowAttachmentOutputSchema,
	showColumn: ShowColumnOutputSchema,
	showOrganization: ShowOrganizationOutputSchema,
	showProjectDetails: ShowProjectDetailsOutputSchema,
	showUserProjects: ShowUserProjectsOutputSchema,
	showUserTasks: ShowUserTasksOutputSchema,
	updateColumn: UpdateColumnOutputSchema,
	updateProject: UpdateProjectOutputSchema,
	updateTask: UpdateTaskOutputSchema,
	uploadAttachment: UploadAttachmentOutputSchema,
} as const;
