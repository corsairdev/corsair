import { z } from 'zod';

export const TeamcampErrorSchema = z
	.object({ error: z.string().nullish() })
	.loose();

export type TeamcampError = z.infer<typeof TeamcampErrorSchema>;

const ResourceId = z.string().min(1);

const DateOnly = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'must be a yyyy-MM-dd date')
	.refine((value) => {
		const [year, month, day] = value.split('-').map(Number);
		const date = new Date(Date.UTC(year ?? 0, (month ?? 1) - 1, day ?? 1));
		return (
			date.getUTCFullYear() === year &&
			date.getUTCMonth() === (month ?? 1) - 1 &&
			date.getUTCDate() === day
		);
	}, 'must be a real calendar date')
	.describe('A date in yyyy-MM-dd form, such as 2026-11-30.');

export const TeamcampUserSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		timezone: z.string().nullish(),
		dateFormat: z.string().nullish(),
		profile_photo: z.string().nullish(),
		isOwner: z.boolean().nullish(),
		isAdmin: z.boolean().nullish(),
		lastSeen: z.string().nullish(),
	})
	.loose();

export type TeamcampUser = z.infer<typeof TeamcampUserSchema>;

const ListUsersInputSchema = z.object({});

export type ListUsersInput = z.infer<typeof ListUsersInputSchema>;

const ListUsersResponseSchema = z.object({
	users: z.array(TeamcampUserSchema),
});

export type ListUsersResponse = z.infer<typeof ListUsersResponseSchema>;

const TeamcampClientSchema = z
	.object({
		clientId: z.string().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export const TeamcampCustomerSchema = z
	.object({
		customerId: z.string(),
		address: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		email: z.string().nullish(),
		companyName: z.string().nullish(),
		phone: z.string().nullish(),
		clients: z.array(TeamcampClientSchema).nullish(),
	})
	.loose();

export type TeamcampCustomer = z.infer<typeof TeamcampCustomerSchema>;

const ListCustomersInputSchema = z.object({});

export type ListCustomersInput = z.infer<typeof ListCustomersInputSchema>;

const ListCustomersResponseSchema = z.object({
	customers: z.array(TeamcampCustomerSchema),
});

export type ListCustomersResponse = z.infer<typeof ListCustomersResponseSchema>;

export const TeamcampWorkspaceSchema = z
	.object({
		workspaceId: z.string(),
		workspaceName: z.string().nullish(),
		createdBy: z.string().nullish(),
	})
	.loose();

export type TeamcampWorkspace = z.infer<typeof TeamcampWorkspaceSchema>;

const VerifyKeyInputSchema = z.object({});

export type VerifyKeyInput = z.infer<typeof VerifyKeyInputSchema>;

const VerifyKeyResponseSchema = TeamcampWorkspaceSchema;

export type VerifyKeyResponse = z.infer<typeof VerifyKeyResponseSchema>;

export const TeamcampProjectSummarySchema = z
	.object({
		projectId: z.string(),
		projectName: z.string().nullish(),
	})
	.loose();

export type TeamcampProjectSummary = z.infer<
	typeof TeamcampProjectSummarySchema
>;

const ProjectStatusSchema = z
	.object({
		Name: z.string().nullish(),
		Type: z.number().nullish(),
		_id: z.string().nullish(),
		Index: z.number().nullish(),
		Default: z.boolean().nullish(),
	})
	.loose();

export const TeamcampProjectSchema = TeamcampProjectSummarySchema.extend({
	workspaceId: z.string().nullish(),
	ownerId: z.string().nullish(),
	description: z.string().nullish(),
	customerId: z.string().nullish(),
	startDate: z.string().nullish(),
	dueDate: z.string().nullish(),
	favoriteUsers: z.array(z.string()).nullish(),
	projectUsers: z.array(z.string()).nullish(),
	statusEnable: z.boolean().nullish(),
	estimate: z.boolean().nullish(),
	priority: z.boolean().nullish(),
	archived: z.boolean().nullish(),
	status: z.array(ProjectStatusSchema).nullish(),
}).loose();

export type TeamcampProject = z.infer<typeof TeamcampProjectSchema>;

const ListProjectsInputSchema = z.object({});

export type ListProjectsInput = z.infer<typeof ListProjectsInputSchema>;

const ListProjectsResponseSchema = z.object({
	projects: z.array(TeamcampProjectSummarySchema),
});

export type ListProjectsResponse = z.infer<typeof ListProjectsResponseSchema>;

const GetProjectInputSchema = z.object({
	projectId: ResourceId.describe(
		'The project id, as the project list reports it.',
	),
});

export type GetProjectInput = z.infer<typeof GetProjectInputSchema>;

const GetProjectResponseSchema = TeamcampProjectSchema;

export type GetProjectResponse = z.infer<typeof GetProjectResponseSchema>;

const CreateProjectInputSchema = z.object({
	projectName: z.string().min(1).describe('The project name.'),
	customerId: z
		.string()
		.min(1)
		.optional()
		.describe('The customer to bill the project to.'),
	startDate: DateOnly.optional().describe('The project start date.'),
	dueDate: DateOnly.optional().describe('The project due date.'),
	templateId: z
		.string()
		.min(1)
		.optional()
		.describe('A project template to copy the statuses and groups from.'),
});

export type CreateProjectInput = z.infer<typeof CreateProjectInputSchema>;

const CreateProjectResponseSchema = TeamcampProjectSchema;

export type CreateProjectResponse = z.infer<typeof CreateProjectResponseSchema>;

const UpdateProjectInputSchema = z
	.object({
		projectId: ResourceId.describe('The project to update.'),
		projectName: z.string().min(1).optional().describe('The new project name.'),
		description: z.string().optional().describe('The new description.'),
		startDate: DateOnly.optional().describe('The new start date.'),
		dueDate: DateOnly.optional().describe('The new due date.'),
		customerId: z
			.string()
			.min(1)
			.optional()
			.describe('The customer to bill the project to.'),
	})
	.superRefine((value, ctx) => {
		const fields = [
			value.projectName,
			value.description,
			value.startDate,
			value.dueDate,
			value.customerId,
		];
		if (fields.every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				message:
					'give projectName, description, startDate, dueDate or customerId, or the update changes nothing',
			});
		}
	});

export type UpdateProjectInput = z.infer<typeof UpdateProjectInputSchema>;

const UpdateProjectResponseSchema = TeamcampProjectSchema;

export type UpdateProjectResponse = z.infer<typeof UpdateProjectResponseSchema>;

const DeleteProjectInputSchema = z.object({
	projectId: ResourceId.describe('The project to delete.'),
});

export type DeleteProjectInput = z.infer<typeof DeleteProjectInputSchema>;

const DeleteProjectResponseSchema = z.object({
	archived: z.boolean(),
	projectId: z.string(),
	message: z.string(),
});

export type DeleteProjectResponse = z.infer<typeof DeleteProjectResponseSchema>;

const TeamcampGroupSchema = z
	.object({
		groupId: z.string(),
		groupName: z.string().nullish(),
		projectId: z.string().nullish(),
	})
	.loose();

export type TeamcampGroup = z.infer<typeof TeamcampGroupSchema>;

const ListGroupsInputSchema = z.object({
	projectId: ResourceId.describe('The project to list the task groups of.'),
});

export type ListGroupsInput = z.infer<typeof ListGroupsInputSchema>;

const ListGroupsResponseSchema = z.object({
	groups: z.array(TeamcampGroupSchema),
});

export type ListGroupsResponse = z.infer<typeof ListGroupsResponseSchema>;

export const TeamcampTaskSummarySchema = z
	.object({
		taskId: z.string(),
		taskName: z.string().nullish(),
		status: z.boolean().nullish(),
		statusId: z.string().nullish(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		id: z.string().nullish(),
	})
	.loose();

export type TeamcampTaskSummary = z.infer<typeof TeamcampTaskSummarySchema>;

const TaskCommentSchema = z
	.object({
		_id: z.string().nullish(),
		commentId: z.string().nullish(),
		content: z.string().nullish(),
		CreatedBy: z.string().nullish(),
		UpdatedBy: z.string().nullish(),
		CreatedTime: z.string().nullish(),
		UpdatedTime: z.string().nullish(),
		Type: z.number().nullish(),
	})
	.loose();

export type TeamcampTaskComment = z.infer<typeof TaskCommentSchema>;

export const TeamcampTaskSchema = z
	.object({
		taskId: z.string(),
		taskName: z.string().nullish(),
		projectId: z.string().nullish(),
		status: z.boolean().nullish(),
		statusId: z.string().nullish(),
		groupId: z.string().nullish(),
		group: z.string().nullish(),
		// unknown: a task read answers `taskUsers` as objects, `[{ taskUserId }]`,
		// while a task create takes plain id strings; the field is read here as
		// the objects the API sends.
		taskUsers: z
			.array(z.object({ taskUserId: z.string().nullish() }).loose())
			.nullish(),
		subscribers: z.array(z.string()).nullish(),
		description: z.string().nullish(),
		dueDate: z.string().nullish(),
		estimateTime: z.number().nullish(),
		milestoneId: z.number().nullish(),
		labels: z.array(z.string()).nullish(),
		files: z.array(z.record(z.string(), z.json())).nullish(),
		comments: z.array(TaskCommentSchema).nullish(),
		createdBy: z.string().nullish(),
		createdTime: z.string().nullish(),
		updatedBy: z.string().nullish(),
		updatedTime: z.string().nullish(),
		links: z.array(z.json()).nullish(),
	})
	.loose();

export type TeamcampTask = z.infer<typeof TeamcampTaskSchema>;

const ListTasksInputSchema = z.object({
	projectId: ResourceId.describe(
		'The project to list tasks from. Required by the API.',
	),
	complete: z
		.boolean()
		.optional()
		.describe(
			'True returns only completed tasks, false only open ones. Omit it for both.',
		),
});

export type ListTasksInput = z.input<typeof ListTasksInputSchema>;

const ListTasksResponseSchema = z.object({
	tasks: z.array(TeamcampTaskSummarySchema),
});

export type ListTasksResponse = z.infer<typeof ListTasksResponseSchema>;

const GetTaskInputSchema = z.object({
	taskId: ResourceId.describe('The task id.'),
});

export type GetTaskInput = z.infer<typeof GetTaskInputSchema>;

const GetTaskResponseSchema = TeamcampTaskSchema;

export type GetTaskResponse = z.infer<typeof GetTaskResponseSchema>;

export const TEAMCAMP_TASK_PRIORITIES = [
	'none',
	'urgent',
	'high',
	'medium',
	'low',
] as const;

export const TEAMCAMP_PRIORITY_VALUES: Record<
	(typeof TEAMCAMP_TASK_PRIORITIES)[number],
	number
> = {
	none: 0,
	urgent: 1,
	high: 2,
	medium: 3,
	low: 4,
};

const CreateTaskInputSchema = z.object({
	projectId: ResourceId.describe('The project the task belongs to.'),
	taskName: z.string().min(1).describe('The task name.'),
	description: z.string().optional().describe('The task description.'),
	priority: z
		.enum(TEAMCAMP_TASK_PRIORITIES)
		.optional()
		.describe(
			'The task priority. Omit it for no priority. The project must have task priorities turned on in Teamcamp, or Teamcamp answers 400 "Not enable priority in your project."',
		),
	dueDate: DateOnly.optional().describe('The task due date.'),
	groupId: z
		.string()
		.min(1)
		.optional()
		.describe('The task group to place it in.'),
	taskUsers: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('User ids to assign as the task assignees.'),
	statusId: z
		.string()
		.min(1)
		.optional()
		.describe(
			'The workflow status id, as a project read lists it under `status`. Teamcamp does not check it, so a wrong id is saved as given.',
		),
	milestoneId: z
		.number()
		.int()
		.optional()
		.describe('The milestone id, when the project has milestones.'),
	estimateTime: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'The estimated hours for the task. The project must have estimates turned on in Teamcamp, or Teamcamp answers 400.',
		),
	files: z
		.array(
			z.object({
				fileType: z.string().min(1),
				href: z.string().min(1),
				name: z.string().min(1),
				size: z.string().min(1),
			}),
		)
		.min(1)
		.optional()
		.describe(
			'Files to attach, each with its type, url, name and a human-readable size such as "12 KB".',
		),
});

export type CreateTaskInput = z.input<typeof CreateTaskInputSchema>;

const CreateTaskResponseSchema = TeamcampTaskSchema;

export type CreateTaskResponse = z.infer<typeof CreateTaskResponseSchema>;

export type TeamcampEndpointInputs = {
	accountVerify: VerifyKeyInput;
	usersList: ListUsersInput;
	customersList: ListCustomersInput;
	projectsList: ListProjectsInput;
	projectsGet: GetProjectInput;
	projectsCreate: CreateProjectInput;
	projectsUpdate: UpdateProjectInput;
	projectsDelete: DeleteProjectInput;
	groupsList: ListGroupsInput;
	tasksList: ListTasksInput;
	tasksGet: GetTaskInput;
	tasksCreate: CreateTaskInput;
};

export type TeamcampEndpointOutputs = {
	accountVerify: VerifyKeyResponse;
	usersList: ListUsersResponse;
	customersList: ListCustomersResponse;
	projectsList: ListProjectsResponse;
	projectsGet: GetProjectResponse;
	projectsCreate: CreateProjectResponse;
	projectsUpdate: UpdateProjectResponse;
	projectsDelete: DeleteProjectResponse;
	groupsList: ListGroupsResponse;
	tasksList: ListTasksResponse;
	tasksGet: GetTaskResponse;
	tasksCreate: CreateTaskResponse;
};

export const TeamcampEndpointInputSchemas = {
	accountVerify: VerifyKeyInputSchema,
	usersList: ListUsersInputSchema,
	customersList: ListCustomersInputSchema,
	projectsList: ListProjectsInputSchema,
	projectsGet: GetProjectInputSchema,
	projectsCreate: CreateProjectInputSchema,
	projectsUpdate: UpdateProjectInputSchema,
	projectsDelete: DeleteProjectInputSchema,
	groupsList: ListGroupsInputSchema,
	tasksList: ListTasksInputSchema,
	tasksGet: GetTaskInputSchema,
	tasksCreate: CreateTaskInputSchema,
} as const;

export const TeamcampEndpointOutputSchemas = {
	accountVerify: VerifyKeyResponseSchema,
	usersList: ListUsersResponseSchema,
	customersList: ListCustomersResponseSchema,
	projectsList: ListProjectsResponseSchema,
	projectsGet: GetProjectResponseSchema,
	projectsCreate: CreateProjectResponseSchema,
	projectsUpdate: UpdateProjectResponseSchema,
	projectsDelete: DeleteProjectResponseSchema,
	groupsList: ListGroupsResponseSchema,
	tasksList: ListTasksResponseSchema,
	tasksGet: GetTaskResponseSchema,
	tasksCreate: CreateTaskResponseSchema,
} as const;
