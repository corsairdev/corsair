import { z } from 'zod';

// Workspaces
export const WorkspacesGetInputSchema = z.object({});
export type WorkspacesGetInput = z.infer<typeof WorkspacesGetInputSchema>;

export const WorkspacesGetResponseSchema = z
	.object({
		teams: z
			.array(
				z
					.object({
						id: z.string(),
						name: z.string(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type WorkspacesGetResponse = z.infer<typeof WorkspacesGetResponseSchema>;

// Spaces
export const SpacesListInputSchema = z.object({
	team_id: z.string(),
});
export type SpacesListInput = z.infer<typeof SpacesListInputSchema>;

export const SpacesListResponseSchema = z
	.object({
		spaces: z
			.array(
				z
					.object({
						id: z.string(),
						name: z.string(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type SpacesListResponse = z.infer<typeof SpacesListResponseSchema>;

// Folders
export const FoldersListInputSchema = z.object({
	space_id: z.string(),
});
export type FoldersListInput = z.infer<typeof FoldersListInputSchema>;

export const FoldersListResponseSchema = z
	.object({
		folders: z
			.array(
				z
					.object({
						id: z.string(),
						name: z.string(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

// Lists
export const ListsListInputSchema = z.object({
	folder_id: z.string(),
});
export type ListsListInput = z.infer<typeof ListsListInputSchema>;

export const ListsListResponseSchema = z
	.object({
		lists: z
			.array(
				z
					.object({
						id: z.string(),
						name: z.string(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type ListsListResponse = z.infer<typeof ListsListResponseSchema>;

// Tasks
export const TasksListInputSchema = z.object({
	list_id: z.string(),
});
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

export const TasksListResponseSchema = z
	.object({
		tasks: z
			.array(
				z
					.object({
						id: z.string(),
						name: z.string(),
					})
					.passthrough(),
			)
			.optional(),
	})
	.passthrough();
export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

export const TasksGetInputSchema = z.object({
	task_id: z.string(),
});
export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

export const TasksGetResponseSchema = z
	.object({
		id: z.string(),
		name: z.string(),
	})
	.passthrough();
export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;

export const TasksCreateInputSchema = z.object({
	list_id: z.string(),
	name: z.string(),
	description: z.string().optional(),
	markdown_description: z.string().optional(),
	assignees: z.array(z.number()).optional(),
	status: z.string().optional(),
	priority: z.number().optional(),
	due_date: z.number().optional(),
	due_date_time: z.boolean().optional(),
	time_estimate: z.number().optional(),
	start_date: z.number().optional(),
	start_date_time: z.boolean().optional(),
	notify_all: z.boolean().optional(),
	parent: z.string().optional(),
	links_to: z.string().optional(),
	custom_fields: z.array(z.any()).optional(),
});
export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

export const TasksCreateResponseSchema = TasksGetResponseSchema;
export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

export const TasksUpdateInputSchema = z.object({
	task_id: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	status: z.string().optional(),
	priority: z.number().optional(),
	due_date: z.number().optional(),
	time_estimate: z.number().optional(),
	start_date: z.number().optional(),
	parent: z.string().optional(),
});
export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

export const TasksUpdateResponseSchema = TasksGetResponseSchema;
export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;

export const TasksDeleteInputSchema = z.object({
	task_id: z.string(),
});
export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

export const TasksDeleteResponseSchema = z.object({}).passthrough();
export type TasksDeleteResponse = z.infer<typeof TasksDeleteResponseSchema>;

export type ClickupEndpointInputs = {
	workspacesGet: WorkspacesGetInput;
	spacesList: SpacesListInput;
	foldersList: FoldersListInput;
	listsList: ListsListInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
};

export type ClickupEndpointOutputs = {
	workspacesGet: WorkspacesGetResponse;
	spacesList: SpacesListResponse;
	foldersList: FoldersListResponse;
	listsList: ListsListResponse;
	tasksList: TasksListResponse;
	tasksGet: TasksGetResponse;
	tasksCreate: TasksCreateResponse;
	tasksUpdate: TasksUpdateResponse;
	tasksDelete: TasksDeleteResponse;
};

export const ClickupEndpointInputSchemas = {
	workspacesGet: WorkspacesGetInputSchema,
	spacesList: SpacesListInputSchema,
	foldersList: FoldersListInputSchema,
	listsList: ListsListInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
} as const;

export const ClickupEndpointOutputSchemas = {
	workspacesGet: WorkspacesGetResponseSchema,
	spacesList: SpacesListResponseSchema,
	foldersList: FoldersListResponseSchema,
	listsList: ListsListResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksDelete: TasksDeleteResponseSchema,
} as const;
