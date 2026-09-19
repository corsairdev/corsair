import { z } from 'zod';

const ClockifyId = z.string().trim().min(1);
const ClockifyTimestamp = z.iso.datetime({ offset: true });

const WorkspaceSchema = z.object({
	id: z.string(),
	name: z.string(),
});

export type Workspace = z.infer<typeof WorkspaceSchema>;

const ProjectSchema = z.object({
	id: z.string(),
	name: z.string(),
	workspaceId: z.string(),
});

export type Project = z.infer<typeof ProjectSchema>;

const TaskSchema = z.object({
	id: z.string(),
	name: z.string(),
	projectId: z.string(),
});

export type Task = z.infer<typeof TaskSchema>;

const TimeIntervalSchema = z.object({
	start: z.string(),
	end: z.string().nullable().optional(),
	duration: z.string().nullable().optional(),
});

const TimeEntrySchema = z.object({
	id: z.string(),
	description: z.string(),
	workspaceId: z.string(),
	projectId: z.string().nullable().optional(),
	taskId: z.string().nullable().optional(),
	timeInterval: TimeIntervalSchema.nullable(),
});

export type TimeEntry = z.infer<typeof TimeEntrySchema>;

const WorkspacesListInputSchema = z.object({});
export type WorkspacesListInput = z.infer<typeof WorkspacesListInputSchema>;

const WorkspacesListOutputSchema = z.array(WorkspaceSchema);
export type WorkspacesListOutput = z.infer<typeof WorkspacesListOutputSchema>;

const ProjectsListInputSchema = z.object({
	workspaceId: ClockifyId,
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(5000).optional(),
});
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsListOutputSchema = z.array(ProjectSchema);
export type ProjectsListOutput = z.infer<typeof ProjectsListOutputSchema>;

const TasksListInputSchema = z.object({
	workspaceId: ClockifyId,
	projectId: ClockifyId,
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(5000).optional(),
});
export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TasksListOutputSchema = z.array(TaskSchema);
export type TasksListOutput = z.infer<typeof TasksListOutputSchema>;

const TimeEntriesCreateInputSchema = z.object({
	workspaceId: ClockifyId,
	description: z.string().max(3000),
	start: ClockifyTimestamp,
	end: ClockifyTimestamp.optional(),
	projectId: ClockifyId.optional(),
	taskId: ClockifyId.optional(),
});
export type TimeEntriesCreateInput = z.infer<
	typeof TimeEntriesCreateInputSchema
>;

const TimeEntriesCreateOutputSchema = TimeEntrySchema;
export type TimeEntriesCreateOutput = z.infer<
	typeof TimeEntriesCreateOutputSchema
>;

const TimeEntriesListInputSchema = z.object({
	workspaceId: ClockifyId,
	userId: ClockifyId,
	description: z.string().optional(),
	project: ClockifyId.optional(),
	page: z.number().int().min(1).optional(),
	pageSize: z.number().int().min(1).max(5000).optional(),
});
export type TimeEntriesListInput = z.infer<typeof TimeEntriesListInputSchema>;

const TimeEntriesListOutputSchema = z.array(TimeEntrySchema);
export type TimeEntriesListOutput = z.infer<typeof TimeEntriesListOutputSchema>;

export type ClockifyEndpointInputs = {
	workspacesList: WorkspacesListInput;
	projectsList: ProjectsListInput;
	tasksList: TasksListInput;
	timeEntriesCreate: TimeEntriesCreateInput;
	timeEntriesList: TimeEntriesListInput;
};

export type ClockifyEndpointOutputs = {
	workspacesList: WorkspacesListOutput;
	projectsList: ProjectsListOutput;
	tasksList: TasksListOutput;
	timeEntriesCreate: TimeEntriesCreateOutput;
	timeEntriesList: TimeEntriesListOutput;
};

export const ClockifyEndpointInputSchemas = {
	workspacesList: WorkspacesListInputSchema,
	projectsList: ProjectsListInputSchema,
	tasksList: TasksListInputSchema,
	timeEntriesCreate: TimeEntriesCreateInputSchema,
	timeEntriesList: TimeEntriesListInputSchema,
} as const;

export const ClockifyEndpointOutputSchemas = {
	workspacesList: WorkspacesListOutputSchema,
	projectsList: ProjectsListOutputSchema,
	tasksList: TasksListOutputSchema,
	timeEntriesCreate: TimeEntriesCreateOutputSchema,
	timeEntriesList: TimeEntriesListOutputSchema,
} as const;
