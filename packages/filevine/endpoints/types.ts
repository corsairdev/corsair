import { z } from 'zod';

// ─────────────────────────────────────────────────────────────────────────────
// Shared
// ─────────────────────────────────────────────────────────────────────────────

const ProjectSchema = z
	.object({
		projectId: z.number(),
		projectName: z.string().optional(),
		number: z.string().optional(),
		projectTypeId: z.number().optional(),
		clientId: z.number().optional(),
		phaseName: z.string().optional(),
		isArchived: z.boolean().optional(),
		createdDate: z.string().optional(),
		modifiedDate: z.string().optional(),
	})
	.loose();

const ProjectListSchema = z
	.object({
		items: z.array(ProjectSchema).optional(),
		hasMore: z.boolean().optional(),
		totalCount: z.number().optional(),
	})
	.loose();

const ContactSchema = z
	.object({
		contactId: z.number(),
		firstName: z.string().optional(),
		lastName: z.string().optional(),
		fullName: z.string().optional(),
		organization: z.string().optional(),
		emails: z.array(z.string()).optional(),
		phones: z.array(z.string()).optional(),
		createdDate: z.string().optional(),
		modifiedDate: z.string().optional(),
	})
	.loose();

const ContactListSchema = z
	.object({
		items: z.array(ContactSchema).optional(),
		hasMore: z.boolean().optional(),
	})
	.loose();

const DocumentSchema = z
	.object({
		documentId: z.number(),
		projectId: z.number().optional(),
		folderId: z.number().optional(),
		filename: z.string().optional(),
		size: z.number().optional(),
		contentType: z.string().optional(),
		tags: z.array(z.string()).optional(),
		sharedToPortal: z.boolean().optional(),
		version: z.number().optional(),
		uploadedBy: z.number().optional(),
		createdDate: z.string().optional(),
		modifiedDate: z.string().optional(),
	})
	.loose();

const DocumentListSchema = z
	.object({
		items: z.array(DocumentSchema).optional(),
		hasMore: z.boolean().optional(),
	})
	.loose();

const NoteSchema = z
	.object({
		noteId: z.number(),
		projectId: z.number().optional(),
		body: z.string().optional(),
		kind: z
			.enum(['note', 'task', 'portalMessage', 'phoneCall', 'text'])
			.optional(),
		pinned: z.boolean().optional(),
		authorId: z.number().optional(),
		mentions: z.array(z.number()).optional(),
		attachedDocuments: z.array(z.number()).optional(),
		createdDate: z.string().optional(),
		modifiedDate: z.string().optional(),
	})
	.loose();

const NoteListSchema = z
	.object({
		items: z.array(NoteSchema).optional(),
		hasMore: z.boolean().optional(),
	})
	.loose();

const DeadlineSchema = z
	.object({
		deadlineId: z.number(),
		projectId: z.number().optional(),
		name: z.string().optional(),
		dueDate: z.string().optional(),
		status: z.enum(['open', 'completed', 'missed']).optional(),
		assigneeId: z.number().optional(),
		reminders: z
			.array(
				z
					.object({
						triggerOffsetMinutes: z.number().optional(),
						notifyUserIds: z.array(z.number()).optional(),
					})
					.loose(),
			)
			.optional(),
	})
	.loose();

const DeadlineListSchema = z
	.object({
		items: z.array(DeadlineSchema).optional(),
		hasMore: z.boolean().optional(),
	})
	.loose();

const TaskSchema = z
	.object({
		taskId: z.number(),
		projectId: z.number().optional(),
		title: z.string().optional(),
		body: z.string().optional(),
		status: z.enum(['open', 'inProgress', 'completed', 'cancelled']).optional(),
		priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
		dueDate: z.string().optional(),
		assigneeId: z.number().optional(),
		completedDate: z.string().optional(),
	})
	.loose();

const TaskListSchema = z
	.object({
		items: z.array(TaskSchema).optional(),
		hasMore: z.boolean().optional(),
	})
	.loose();

const SubscriptionSchema = z
	.object({
		subscriptionId: z.string(),
		name: z.string().optional(),
		description: z.string().optional(),
		endpoint: z.string().optional(),
		signingKey: z.string().optional(),
		events: z.array(z.string()).optional(),
		createdDate: z.string().optional(),
	})
	.loose();

const SubscriptionListSchema = z
	.object({
		items: z.array(SubscriptionSchema).optional(),
	})
	.loose();

const TokenResponseSchema = z
	.object({
		access_token: z.string(),
		token_type: z.string().optional(),
		expires_in: z.number().optional(),
		scope: z.string().optional(),
	})
	.loose();

// ─────────────────────────────────────────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────────────────────────────────────────

export const ListProjectsInputSchema = z.object({
	offset: z.number().optional().describe('Pagination offset, default 0'),
	limit: z
		.number()
		.min(1)
		.max(1000)
		.optional()
		.describe('Page size, max 1000, default 50'),
	projectTypeId: z.number().optional(),
	phaseName: z.string().optional(),
	modifiedSince: z.string().optional().describe('ISO 8601 date-time filter'),
});
export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;

export const GetProjectInputSchema = z.object({
	projectId: z.number().describe('Filevine project ID'),
});
export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;

export const CreateProjectInputSchema = z.object({
	projectTypeId: z.number().describe('Project type ID'),
	projectName: z.string().describe('Display name for the new project'),
	clientId: z.number().describe('Primary client contact ID'),
	phaseName: z.string().optional(),
});
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

export const UpdateProjectInputSchema = z.object({
	projectId: z.number(),
	projectName: z.string().optional(),
	phaseName: z.string().optional(),
	isArchived: z.boolean().optional(),
});
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;

export const ListContactsInputSchema = z.object({
	offset: z.number().optional(),
	limit: z.number().min(1).max(1000).optional(),
	q: z.string().optional().describe('Search query'),
});
export type ListContactsInput = z.infer<typeof ListContactsInputSchema>;

export const GetContactInputSchema = z.object({
	contactId: z.number(),
});
export type GetContactInput = z.infer<typeof GetContactInputSchema>;

export const CreateContactInputSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	organization: z.string().optional(),
	emails: z.array(z.string().email()).optional(),
	phones: z.array(z.string()).optional(),
});
export type CreateContactInput = z.infer<typeof CreateContactInputSchema>;

export const AttachProjectContactInputSchema = z.object({
	projectId: z.number(),
	contactId: z.number(),
	role: z.string().optional().describe('e.g. Client, Opposing Party, Witness'),
});
export type AttachProjectContactInput = z.infer<
	typeof AttachProjectContactInputSchema
>;

export const ListProjectDocumentsInputSchema = z.object({
	projectId: z.number(),
	folderId: z.number().optional(),
	tag: z.string().optional(),
	offset: z.number().optional().describe('Pagination offset'),
	limit: z.number().min(1).max(1000).optional().describe('Page size, max 1000'),
});
export type ListProjectDocumentsInput = z.infer<
	typeof ListProjectDocumentsInputSchema
>;

export const GetDocumentInputSchema = z.object({
	documentId: z.number(),
});
export type GetDocumentInput = z.infer<typeof GetDocumentInputSchema>;

export const UploadProjectDocumentInputSchema = z.object({
	projectId: z.number(),
	filename: z
		.string()
		.optional()
		.describe('Filename override, else derived from file'),
	folderId: z.number().optional(),
	tags: z.array(z.string()).optional(),
	sharedToPortal: z.boolean().optional(),
	// file is intentionally unknown — accepts Blob, string (base64), or binary; validated at runtime via formData object handling, not via Zod schema
	file: z.unknown().optional().describe('File content (multipart binary)'),
});
export type UploadProjectDocumentInput = z.infer<
	typeof UploadProjectDocumentInputSchema
>;

export const ListProjectNotesInputSchema = z.object({
	projectId: z.number(),
	offset: z.number().optional(),
	limit: z.number().optional(),
	since: z
		.string()
		.optional()
		.describe('ISO 8601, filter notes modified after this'),
});
export type ListProjectNotesInput = z.infer<typeof ListProjectNotesInputSchema>;

export const CreateNoteInputSchema = z.object({
	projectId: z.number(),
	body: z.string().describe('Note body, supports @mentions and markdown'),
	kind: z
		.enum(['note', 'task', 'portalMessage', 'phoneCall', 'text'])
		.optional()
		.default('note'),
	pinned: z.boolean().optional(),
	attachedDocuments: z.array(z.number()).optional(),
});
export type CreateNoteInput = z.infer<typeof CreateNoteInputSchema>;

export const UpdateNoteInputSchema = z.object({
	noteId: z.number(),
	body: z.string().optional(),
	pinned: z.boolean().optional(),
});
export type UpdateNoteInput = z.infer<typeof UpdateNoteInputSchema>;

export const ListProjectDeadlinesInputSchema = z.object({
	projectId: z.number(),
	status: z.enum(['open', 'completed', 'missed']).optional(),
	from: z.string().optional().describe('Filter from date (YYYY-MM-DD)'),
	to: z.string().optional().describe('Filter to date (YYYY-MM-DD)'),
	offset: z.number().optional().describe('Pagination offset'),
	limit: z.number().min(1).max(1000).optional().describe('Page size, max 1000'),
});
export type ListProjectDeadlinesInput = z.infer<
	typeof ListProjectDeadlinesInputSchema
>;

export const CreateDeadlineInputSchema = z.object({
	projectId: z.number(),
	name: z.string(),
	dueDate: z.string().describe('ISO 8601 date-time'),
	assigneeId: z.number().optional(),
	reminders: z
		.array(
			z.object({
				triggerOffsetMinutes: z.number(),
				notifyUserIds: z.array(z.number()).optional(),
			}),
		)
		.optional(),
});
export type CreateDeadlineInput = z.infer<typeof CreateDeadlineInputSchema>;

export const ListProjectTasksInputSchema = z.object({
	projectId: z.number(),
	assigneeId: z.number().optional(),
	status: z.enum(['open', 'inProgress', 'completed', 'cancelled']).optional(),
	offset: z.number().optional().describe('Pagination offset'),
	limit: z.number().min(1).max(1000).optional().describe('Page size, max 1000'),
});
export type ListProjectTasksInput = z.infer<typeof ListProjectTasksInputSchema>;

export const CreateTaskInputSchema = z.object({
	projectId: z.number(),
	title: z.string(),
	body: z.string().optional(),
	assigneeId: z.number(),
	dueDate: z.string().optional(),
	priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
});
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const UpdateTaskInputSchema = z.object({
	taskId: z.number(),
	status: z.enum(['open', 'inProgress', 'completed', 'cancelled']).optional(),
	priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
	dueDate: z.string().optional(),
	assigneeId: z.number().optional(),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;

export const ListWebhookSubscriptionsInputSchema = z.object({});
export type ListWebhookSubscriptionsInput = z.infer<
	typeof ListWebhookSubscriptionsInputSchema
>;

export const CreateWebhookSubscriptionInputSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	endpoint: z.string().url(),
	events: z
		.array(z.string())
		.min(1)
		.describe('Dotted events e.g. project.created'),
});
export type CreateWebhookSubscriptionInput = z.infer<
	typeof CreateWebhookSubscriptionInputSchema
>;

export const DeleteWebhookSubscriptionInputSchema = z.object({
	subscriptionId: z.string(),
});
export type DeleteWebhookSubscriptionInput = z.infer<
	typeof DeleteWebhookSubscriptionInputSchema
>;

export const GetAccessTokenInputSchema = z.object({
	grant_type: z
		.literal('personal_access_token')
		.default('personal_access_token'),
	token: z.string().describe('Filevine Personal Access Token (PAT)'),
	scope: z
		.string()
		.optional()
		.default(
			'fv.api.gateway.access tenant filevine.v2.api.* openid email fv.auth.tenant.read',
		),
	client_id: z.string().optional(),
	client_secret: z.string().optional(),
});
export type GetAccessTokenInput = z.infer<typeof GetAccessTokenInputSchema>;

export const GetUserOrgsWithTokenInputSchema = z.object({});
export type GetUserOrgsWithTokenInput = z.infer<
	typeof GetUserOrgsWithTokenInputSchema
>;

const UserOrgSchema = z
	.object({
		OrgId: z.number().optional(),
		Name: z.string().optional(),
	})
	.loose();

const UserOrgsResponseSchema = z
	.object({
		UserId: z
			.object({ Native: z.number().optional(), Partner: z.string().optional() })
			.loose()
			.optional(),
		FirstName: z.string().optional(),
		LastName: z.string().optional(),
		Email: z.string().optional(),
		Orgs: z.array(UserOrgSchema).optional(),
		userId: z.number().optional(),
		orgs: z
			.array(
				z
					.object({ orgId: z.number().optional(), name: z.string().optional() })
					.loose(),
			)
			.optional(),
	})
	.loose();

export const GetUserOrgsWithTokenResponseSchema = UserOrgsResponseSchema;
export type GetUserOrgsWithTokenResponse = z.infer<
	typeof GetUserOrgsWithTokenResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Outputs
// ─────────────────────────────────────────────────────────────────────────────

export const ListProjectsResponseSchema = ProjectListSchema;
export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;
export const GetProjectResponseSchema = ProjectSchema;
export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;
export const CreateProjectResponseSchema = ProjectSchema;
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;
export const UpdateProjectResponseSchema = ProjectSchema;
export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;

export const ListContactsResponseSchema = ContactListSchema;
export type ListContactsResponse = z.infer<typeof ListContactsResponseSchema>;
export const GetContactResponseSchema = ContactSchema;
export type GetContactResponse = z.infer<typeof GetContactResponseSchema>;
export const CreateContactResponseSchema = ContactSchema;
export type CreateContactResponse = z.infer<typeof CreateContactResponseSchema>;
export const AttachProjectContactResponseSchema = z.object({}).loose();
export type AttachProjectContactResponse = z.infer<
	typeof AttachProjectContactResponseSchema
>;

export const ListProjectDocumentsResponseSchema = DocumentListSchema;
export type ListProjectDocumentsResponse = z.infer<
	typeof ListProjectDocumentsResponseSchema
>;
export const GetDocumentResponseSchema = DocumentSchema;
export type GetDocumentResponse = z.infer<typeof GetDocumentResponseSchema>;
export const UploadProjectDocumentResponseSchema = DocumentSchema;
export type UploadProjectDocumentResponse = z.infer<
	typeof UploadProjectDocumentResponseSchema
>;

export const ListProjectNotesResponseSchema = NoteListSchema;
export type ListProjectNotesResponse = z.infer<
	typeof ListProjectNotesResponseSchema
>;
export const CreateNoteResponseSchema = NoteSchema;
export type CreateNoteResponse = z.infer<typeof CreateNoteResponseSchema>;
export const UpdateNoteResponseSchema = NoteSchema;
export type UpdateNoteResponse = z.infer<typeof UpdateNoteResponseSchema>;

export const ListProjectDeadlinesResponseSchema = DeadlineListSchema;
export type ListProjectDeadlinesResponse = z.infer<
	typeof ListProjectDeadlinesResponseSchema
>;
export const CreateDeadlineResponseSchema = DeadlineSchema;
export type CreateDeadlineResponse = z.infer<
	typeof CreateDeadlineResponseSchema
>;

export const ListProjectTasksResponseSchema = TaskListSchema;
export type ListProjectTasksResponse = z.infer<
	typeof ListProjectTasksResponseSchema
>;
export const CreateTaskResponseSchema = TaskSchema;
export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;
export const UpdateTaskResponseSchema = TaskSchema;
export type UpdateTaskResponse = z.infer<typeof UpdateTaskResponseSchema>;

export const ListWebhookSubscriptionsResponseSchema = SubscriptionListSchema;
export type ListWebhookSubscriptionsResponse = z.infer<
	typeof ListWebhookSubscriptionsResponseSchema
>;
export const CreateWebhookSubscriptionResponseSchema = SubscriptionSchema;
export type CreateWebhookSubscriptionResponse = z.infer<
	typeof CreateWebhookSubscriptionResponseSchema
>;
export const DeleteWebhookSubscriptionResponseSchema = z.object({}).loose();
export type DeleteWebhookSubscriptionResponse = z.infer<
	typeof DeleteWebhookSubscriptionResponseSchema
>;

export const GetAccessTokenResponseSchema = TokenResponseSchema;
export type GetAccessTokenResponse = z.infer<
	typeof GetAccessTokenResponseSchema
>;

// ─────────────────────────────────────────────────────────────────────────────
// Union mappings for plugin wiring
// ─────────────────────────────────────────────────────────────────────────────

export type FilevineEndpointInputs = {
	listProjects: ListProjectsInput;
	getProject: GetProjectInput;
	createProject: CreateProjectInput;
	updateProject: UpdateProjectInput;
	listContacts: ListContactsInput;
	getContact: GetContactInput;
	createContact: CreateContactInput;
	attachProjectContact: AttachProjectContactInput;
	listProjectDocuments: ListProjectDocumentsInput;
	getDocument: GetDocumentInput;
	uploadProjectDocument: UploadProjectDocumentInput;
	listProjectNotes: ListProjectNotesInput;
	createNote: CreateNoteInput;
	updateNote: UpdateNoteInput;
	listProjectDeadlines: ListProjectDeadlinesInput;
	createDeadline: CreateDeadlineInput;
	listProjectTasks: ListProjectTasksInput;
	createTask: CreateTaskInput;
	updateTask: UpdateTaskInput;
	listWebhookSubscriptions: ListWebhookSubscriptionsInput;
	createWebhookSubscription: CreateWebhookSubscriptionInput;
	deleteWebhookSubscription: DeleteWebhookSubscriptionInput;
	getAccessToken: GetAccessTokenInput;
	getUserOrgsWithToken: GetUserOrgsWithTokenInput;
};

export type FilevineEndpointOutputs = {
	listProjects: ListProjectsResponse;
	getProject: GetProjectResponse;
	createProject: CreateProjectResponse;
	updateProject: UpdateProjectResponse;
	listContacts: ListContactsResponse;
	getContact: GetContactResponse;
	createContact: CreateContactResponse;
	attachProjectContact: AttachProjectContactResponse;
	listProjectDocuments: ListProjectDocumentsResponse;
	getDocument: GetDocumentResponse;
	uploadProjectDocument: UploadProjectDocumentResponse;
	listProjectNotes: ListProjectNotesResponse;
	createNote: CreateNoteResponse;
	updateNote: UpdateNoteResponse;
	listProjectDeadlines: ListProjectDeadlinesResponse;
	createDeadline: CreateDeadlineResponse;
	listProjectTasks: ListProjectTasksResponse;
	createTask: CreateTaskResponse;
	updateTask: UpdateTaskResponse;
	listWebhookSubscriptions: ListWebhookSubscriptionsResponse;
	createWebhookSubscription: CreateWebhookSubscriptionResponse;
	deleteWebhookSubscription: DeleteWebhookSubscriptionResponse;
	getAccessToken: GetAccessTokenResponse;
	getUserOrgsWithToken: GetUserOrgsWithTokenResponse;
};

export const FilevineEndpointInputSchemas = {
	listProjects: ListProjectsInputSchema,
	getProject: GetProjectInputSchema,
	createProject: CreateProjectInputSchema,
	updateProject: UpdateProjectInputSchema,
	listContacts: ListContactsInputSchema,
	getContact: GetContactInputSchema,
	createContact: CreateContactInputSchema,
	attachProjectContact: AttachProjectContactInputSchema,
	listProjectDocuments: ListProjectDocumentsInputSchema,
	getDocument: GetDocumentInputSchema,
	uploadProjectDocument: UploadProjectDocumentInputSchema,
	listProjectNotes: ListProjectNotesInputSchema,
	createNote: CreateNoteInputSchema,
	updateNote: UpdateNoteInputSchema,
	listProjectDeadlines: ListProjectDeadlinesInputSchema,
	createDeadline: CreateDeadlineInputSchema,
	listProjectTasks: ListProjectTasksInputSchema,
	createTask: CreateTaskInputSchema,
	updateTask: UpdateTaskInputSchema,
	listWebhookSubscriptions: ListWebhookSubscriptionsInputSchema,
	createWebhookSubscription: CreateWebhookSubscriptionInputSchema,
	deleteWebhookSubscription: DeleteWebhookSubscriptionInputSchema,
	getAccessToken: GetAccessTokenInputSchema,
	getUserOrgsWithToken: GetUserOrgsWithTokenInputSchema,
} as const;

export const FilevineEndpointOutputSchemas = {
	listProjects: ListProjectsResponseSchema,
	getProject: GetProjectResponseSchema,
	createProject: CreateProjectResponseSchema,
	updateProject: UpdateProjectResponseSchema,
	listContacts: ListContactsResponseSchema,
	getContact: GetContactResponseSchema,
	createContact: CreateContactResponseSchema,
	attachProjectContact: AttachProjectContactResponseSchema,
	listProjectDocuments: ListProjectDocumentsResponseSchema,
	getDocument: GetDocumentResponseSchema,
	uploadProjectDocument: UploadProjectDocumentResponseSchema,
	listProjectNotes: ListProjectNotesResponseSchema,
	createNote: CreateNoteResponseSchema,
	updateNote: UpdateNoteResponseSchema,
	listProjectDeadlines: ListProjectDeadlinesResponseSchema,
	createDeadline: CreateDeadlineResponseSchema,
	listProjectTasks: ListProjectTasksResponseSchema,
	createTask: CreateTaskResponseSchema,
	updateTask: UpdateTaskResponseSchema,
	listWebhookSubscriptions: ListWebhookSubscriptionsResponseSchema,
	createWebhookSubscription: CreateWebhookSubscriptionResponseSchema,
	deleteWebhookSubscription: DeleteWebhookSubscriptionResponseSchema,
	getAccessToken: GetAccessTokenResponseSchema,
	getUserOrgsWithToken: GetUserOrgsWithTokenResponseSchema,
} as const;
