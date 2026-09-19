import { z } from 'zod';

// --- Shared Entity Schemas ---

export const TickTickProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	color: z.string().nullable().optional(),
	sortOrder: z.number().nullable().optional(),
	closed: z.boolean().nullable().optional(),
	viewMode: z.enum(['list', 'kanban', 'timeline']).nullable().optional(),
	kind: z.enum(['TASK', 'NOTE']).nullable().optional(),
	groupId: z.string().nullable().optional(),
	permission: z.string().nullable().optional(),
});
export type TickTickProject = z.infer<typeof TickTickProjectSchema>;

export const TickTickChecklistItemSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	status: z.number().describe('0 for undone, 1 for completed'),
	startDate: z.string().optional(),
	isAllDay: z.boolean().optional(),
});

export const TickTickTaskSchema = z.object({
	id: z.string(),
	projectId: z.string().nullable().optional(),
	title: z.string(),
	content: z.string().nullable().optional(),
	desc: z.string().nullable().optional(),
	priority: z
		.number()
		.describe('0 (None), 1 (Low), 3 (Medium), 5 (High)')
		.nullable()
		.optional(),
	status: z
		.union([z.literal(-1), z.literal(0), z.literal(2)])
		.describe('-1 (Abandoned), 0 (Undone), 2 (Completed)')
		.nullable()
		.optional(),
	dueDate: z.string().nullable().optional(),
	startDate: z.string().nullable().optional(),
	completedTime: z.string().nullable().optional(),
	timeZone: z.string().nullable().optional(),
	isAllDay: z.boolean().nullable().optional(),
	columnId: z.string().nullable().optional(),
	parentId: z.string().nullable().optional(),
	sortOrder: z.number().nullable().optional(),
	reminders: z.array(z.string()).nullable().optional(),
	tags: z.array(z.string()).nullable().optional(),
	repeatFlag: z.string().nullable().optional(),
	items: z.array(TickTickChecklistItemSchema).nullable().optional(),
});
export type TickTickTask = z.infer<typeof TickTickTaskSchema>;

export const TickTickColumnSchema = z.object({
	id: z.string(),
	name: z.string(),
	sortOrder: z.number().nullable().optional(),
});
export type TickTickColumn = z.infer<typeof TickTickColumnSchema>;

// --- Endpoint Input/Output Schemas ---

// 1. Complete Task
export const CompleteTaskInputSchema = z.object({
	projectId: z.string(),
	taskId: z.string(),
});
export type CompleteTaskInput = z.infer<typeof CompleteTaskInputSchema>;

export const CompleteTaskResponseSchema = z.object({
	success: z.boolean(),
});
export type CompleteTaskResponse = z.infer<typeof CompleteTaskResponseSchema>;

// 2. Create Project
export const CreateProjectInputSchema = z.object({
	name: z.string(),
	color: z.string().optional(),
	sortOrder: z.number().optional(),
	viewMode: z.enum(['list', 'kanban', 'timeline']).optional(),
	kind: z.enum(['TASK', 'NOTE']).optional(),
});
export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

export const CreateProjectResponseSchema = TickTickProjectSchema;
export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

// 3. Create Task
export const CreateTaskInputSchema = z.object({
	title: z.string(),
	// Required by the official Create Task endpoint; GET /project does not list
	// the Inbox, so callers must resolve the target project id themselves
	projectId: z.string(),
	content: z.string().optional(),
	priority: z
		.number()
		.describe('0 (None), 1 (Low), 3 (Medium), 5 (High)')
		.optional(),
	dueDate: z
		.string()
		.optional()
		.describe("ISO 8601 datetime, e.g. '2019-11-13T03:00:00+0000'"),
	startDate: z.string().optional(),
	timeZone: z.string().optional(),
	isAllDay: z.boolean().optional(),
	tags: z.array(z.string()).optional(),
	items: z.array(TickTickChecklistItemSchema).optional(),
});
export type CreateTaskInput = z.infer<typeof CreateTaskInputSchema>;

export const CreateTaskResponseSchema = TickTickTaskSchema;
export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

// 4. Delete Task
export const DeleteTaskInputSchema = z.object({
	projectId: z.string(),
	taskId: z.string(),
});
export type DeleteTaskInput = z.infer<typeof DeleteTaskInputSchema>;

export const DeleteTaskResponseSchema = z.object({
	success: z.boolean(),
});
export type DeleteTaskResponse = z.infer<typeof DeleteTaskResponseSchema>;

// 5. Delete Project
export const DeleteProjectInputSchema = z.object({
	projectId: z.string(),
});
export type DeleteProjectInput = z.infer<typeof DeleteProjectInputSchema>;

export const DeleteProjectResponseSchema = z.object({
	success: z.boolean(),
});
export type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>;

// 6. Generate OAuth2 Authorization URL
export const GenerateOAuth2UrlInputSchema = z.object({});
export type GenerateOAuth2UrlInput = z.infer<
	typeof GenerateOAuth2UrlInputSchema
>;

export const GenerateOAuth2UrlResponseSchema = z.object({
	url: z.string(),
	// Unguessable per-call value; compare it against the state query param on
	// the OAuth redirect to defend against CSRF
	state: z.string(),
});
export type GenerateOAuth2UrlResponse = z.infer<
	typeof GenerateOAuth2UrlResponseSchema
>;

// 7. Get Project by ID
export const GetProjectInputSchema = z.object({
	projectId: z.string(),
});
export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;

export const GetProjectResponseSchema = TickTickProjectSchema;
export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;

// 8. Get Task by Project + ID
export const GetTaskInputSchema = z.object({
	projectId: z.string(),
	taskId: z.string(),
});
export type GetTaskInput = z.infer<typeof GetTaskInputSchema>;

export const GetTaskResponseSchema = TickTickTaskSchema;
export type GetTaskResponse = z.infer<typeof GetTaskResponseSchema>;

// 9. Get User Projects
export const GetUserProjectsInputSchema = z.object({});
export type GetUserProjectsInput = z.infer<typeof GetUserProjectsInputSchema>;

export const GetUserProjectsResponseSchema = z.array(TickTickProjectSchema);
export type GetUserProjectsResponse = z.infer<
	typeof GetUserProjectsResponseSchema
>;

// 10. Get Project with Data
export const GetProjectWithDataInputSchema = z.object({
	projectId: z.string(),
});
export type GetProjectWithDataInput = z.infer<
	typeof GetProjectWithDataInputSchema
>;

export const GetProjectWithDataResponseSchema = z.object({
	project: TickTickProjectSchema,
	tasks: z.array(TickTickTaskSchema),
	columns: z.array(TickTickColumnSchema).optional(),
});
export type GetProjectWithDataResponse = z.infer<
	typeof GetProjectWithDataResponseSchema
>;

// 11. List All Tasks
export const ListAllTasksInputSchema = z.object({});
export type ListAllTasksInput = z.infer<typeof ListAllTasksInputSchema>;

export const ListAllTasksResponseSchema = z.array(TickTickTaskSchema);
export type ListAllTasksResponse = z.infer<typeof ListAllTasksResponseSchema>;

// 12. Update Project
export const UpdateProjectInputSchema = z.object({
	projectId: z.string(),
	name: z.string().optional(),
	color: z.string().optional(),
	sortOrder: z.number().optional(),
	viewMode: z.enum(['list', 'kanban', 'timeline']).optional(),
	kind: z.enum(['TASK', 'NOTE']).optional(),
});
export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;

export const UpdateProjectResponseSchema = TickTickProjectSchema;
export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;

// 13. Update Task
export const UpdateTaskInputSchema = z.object({
	taskId: z.string(),
	projectId: z.string(),
	title: z.string(),
	content: z.string().optional(),
	priority: z
		.number()
		.describe('0 (None), 1 (Low), 3 (Medium), 5 (High)')
		.optional(),
	status: z
		.number()
		.describe('-1 (Abandoned), 0 (Undone), 2 (Completed)')
		.optional(),
	dueDate: z.string().optional(),
	timeZone: z.string().optional(),
	isAllDay: z.boolean().optional(),
	columnId: z.string().optional(),
	items: z.array(TickTickChecklistItemSchema).optional(),
});
export type UpdateTaskInput = z.infer<typeof UpdateTaskInputSchema>;

export const UpdateTaskResponseSchema = TickTickTaskSchema;
export type UpdateTaskResponse = z.infer<typeof UpdateTaskResponseSchema>;

// --- Aggregated types maps for the Plugin entry point ---

export type TickTickEndpointInputs = {
	completeTask: CompleteTaskInput;
	createProject: CreateProjectInput;
	createTask: CreateTaskInput;
	deleteTask: DeleteTaskInput;
	deleteProject: DeleteProjectInput;
	generateAuthUrl: GenerateOAuth2UrlInput;
	getProject: GetProjectInput;
	getTask: GetTaskInput;
	getUserProjects: GetUserProjectsInput;
	getProjectWithData: GetProjectWithDataInput;
	listAllTasks: ListAllTasksInput;
	updateProject: UpdateProjectInput;
	updateTask: UpdateTaskInput;
};

export type TickTickEndpointOutputs = {
	completeTask: CompleteTaskResponse;
	createProject: CreateProjectResponse;
	createTask: CreateTaskResponse;
	deleteTask: DeleteTaskResponse;
	deleteProject: DeleteProjectResponse;
	generateAuthUrl: GenerateOAuth2UrlResponse;
	getProject: GetProjectResponse;
	getTask: GetTaskResponse;
	getUserProjects: GetUserProjectsResponse;
	getProjectWithData: GetProjectWithDataResponse;
	listAllTasks: ListAllTasksResponse;
	updateProject: UpdateProjectResponse;
	updateTask: UpdateTaskResponse;
};

export const TickTickEndpointInputSchemas = {
	completeTask: CompleteTaskInputSchema,
	createProject: CreateProjectInputSchema,
	createTask: CreateTaskInputSchema,
	deleteTask: DeleteTaskInputSchema,
	deleteProject: DeleteProjectInputSchema,
	generateAuthUrl: GenerateOAuth2UrlInputSchema,
	getProject: GetProjectInputSchema,
	getTask: GetTaskInputSchema,
	getUserProjects: GetUserProjectsInputSchema,
	getProjectWithData: GetProjectWithDataInputSchema,
	listAllTasks: ListAllTasksInputSchema,
	updateProject: UpdateProjectInputSchema,
	updateTask: UpdateTaskInputSchema,
} as const;

export const TickTickEndpointOutputSchemas = {
	completeTask: CompleteTaskResponseSchema,
	createProject: CreateProjectResponseSchema,
	createTask: CreateTaskResponseSchema,
	deleteTask: DeleteTaskResponseSchema,
	deleteProject: DeleteProjectResponseSchema,
	generateAuthUrl: GenerateOAuth2UrlResponseSchema,
	getProject: GetProjectResponseSchema,
	getTask: GetTaskResponseSchema,
	getUserProjects: GetUserProjectsResponseSchema,
	getProjectWithData: GetProjectWithDataResponseSchema,
	listAllTasks: ListAllTasksResponseSchema,
	updateProject: UpdateProjectResponseSchema,
	updateTask: UpdateTaskResponseSchema,
} as const;
