import { z } from 'zod';

const RouteId = z.union([z.string(), z.number()]).refine((value) => {
	const text = String(value);
	return (
		text.length > 0 && !['.', '..'].includes(text) && !/[\\/'"]/u.test(text)
	);
}, 'Route identifiers must be safe path segments');

// Motion list responses wrap this cursor envelope in a top-level `meta` field:
// { meta: { nextCursor, pageSize }, ...items }. nextCursor is a string when
// another page is available and null otherwise, so callers forward
// result.meta.nextCursor to the next request until it is null.
const CursorMetaSchema = z
	.object({
		nextCursor: z.string().nullable().optional(),
		pageSize: z.number().optional(),
	})
	.loose();

const UserReferenceSchema = z
	.object({
		id: z.string().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
	})
	.loose();

// Motion documents these custom field type values across the custom-field endpoints.
const CustomFieldTypeSchema = z.enum([
	'text',
	'url',
	'date',
	'person',
	'multiPerson',
	'phone',
	'select',
	'multiSelect',
	'number',
	'email',
	'checkbox',
	'relatedTo',
]);

// Motion documents this per-type value wrapper with an explicitly clearable value
// (for example "Text value or null"), so null is modeled separately from absence.
const CustomFieldValueSchema = z
	.object({
		type: z.string(),
		// multiPerson values are arrays of provider-defined shape; Motion does not
		// document their element schema. person and relatedTo values are documented
		// objects (for example { id, name, email } for person), so the union accepts
		// loose objects too.
		value: z
			.union([
				z.string(),
				z.number(),
				z.boolean(),
				z.array(z.unknown()),
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.loose(),
			])
			.nullable()
			.optional(),
	})
	.loose();

const ProjectStatusSchema = z
	.object({
		name: z.string().optional(),
		isDefaultStatus: z.boolean().optional(),
		isResolvedStatus: z.boolean().optional(),
	})
	.loose();

const ProjectResourceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string(),
		workspaceId: z.string(),
		status: ProjectStatusSchema,
		createdTime: z.string().optional(),
		updatedTime: z.string().optional(),
		dueDate: z.string().optional(),
		// Custom field values are keyed by the custom field's name, so the record
		// keys are provider-defined while each value has the documented wrapper shape.
		customFieldValues: z.record(z.string(), CustomFieldValueSchema).optional(),
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

const TaskResourceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string(),
		duration: z.union([z.string(), z.number()]).optional(),
		dueDate: z.string().optional(),
		deadlineType: z.string(),
		parentRecurringTaskId: z.string(),
		completed: z.boolean(),
		completedTime: z.string().optional(),
		updatedTime: z.string().optional(),
		startOn: z.string().optional(),
		creator: UserReferenceSchema,
		project: ProjectResourceSchema.optional(),
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

const TaskPageSchema = z
	.object({ meta: CursorMetaSchema })
	.extend({ tasks: z.array(TaskResourceSchema) })
	.loose();

const CommentResourceSchema = z
	.object({
		id: z.string(),
		taskId: z.string(),
		content: z.string(),
		createdAt: z.string(),
		creator: UserReferenceSchema,
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

const CommentPageSchema = z
	.object({ meta: CursorMetaSchema })
	.extend({ comments: z.array(CommentResourceSchema) })
	.loose();

const ProjectPageSchema = z
	.object({ meta: CursorMetaSchema })
	.extend({ projects: z.array(ProjectResourceSchema).optional() })
	.loose();

const WorkspaceResourceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		teamId: z.string(),
		type: z.string(),
		labels: z.array(z.object({ name: z.string().optional() }).loose()),
		statuses: z.array(ProjectStatusSchema),
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

const WorkspacePageSchema = z
	.object({ meta: CursorMetaSchema })
	.extend({ workspaces: z.array(WorkspaceResourceSchema) })
	.loose();

const RecurringTaskResourceSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string(),
		workspace: WorkspaceResourceSchema,
		creator: UserReferenceSchema,
		assignee: UserReferenceSchema,
		project: z
			.object({ id: z.string(), name: z.string().optional() })
			.loose()
			.optional(),
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

const RecurringTaskPageSchema = z
	.object({ meta: CursorMetaSchema })
	.extend({ tasks: z.array(RecurringTaskResourceSchema) })
	.loose();

const UserResourceSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		email: z.string(),
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

const UserPageSchema = z
	.object({ meta: CursorMetaSchema })
	.extend({ users: z.array(UserResourceSchema) })
	.loose();

const ScheduleSchema = z
	.object({
		name: z.string(),
		isDefaultTimezone: z.boolean(),
		timezone: z.string(),
		schedule: z.record(
			z.string(),
			z.array(
				z
					.object({ start: z.string().optional(), end: z.string().optional() })
					.loose(),
			),
		),
	})
	.partial()
	.loose();

// Motion returns { id, field } when listing custom fields but { id, type } when
// creating one, so each response keeps its own documented shape.
const CustomFieldResourceSchema = z
	.object({
		id: z.string(),
		field: CustomFieldTypeSchema,
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

const CustomFieldCreateSchema = z
	.object({
		id: z.string(),
		type: CustomFieldTypeSchema,
	})
	.partial()
	.extend({ id: z.string() })
	.loose();

// Motion documents frequency as a string value in its frequency cookbook, with
// families like daily_every_day, weekly_any_day, and monthly_first_MO.
const FrequencySchema = z
	.string()
	.min(1)
	.describe(
		'Frequency in which the task should be scheduled (for example daily_every_day, weekly_any_day, monthly_first_MO).',
	);

const TaskFields = {
	dueDate: z
		.string()
		.optional()
		.describe(
			'ISO 8601 due date on the task. Required by Motion for scheduled tasks.',
		),
	duration: z
		.union([
			z.literal('NONE'),
			z.literal('REMINDER'),
			z.number().int().positive(),
		])
		.optional()
		.describe(
			'"NONE", "REMINDER", or an integer greater than 0 representing minutes.',
		),
	status: z
		.string()
		.optional()
		.describe('Defaults to the workspace default status.'),
	// Motion documents autoScheduled as an object or null, where null turns auto
	// scheduling off. startDate, deadlineType, and schedule are documented as
	// children of autoScheduled, not top-level task fields.
	autoScheduled: z
		.object({
			startDate: z
				.string()
				.optional()
				.describe('ISO 8601 date trimmed to the start of the day passed.'),
			deadlineType: z
				.enum(['HARD', 'SOFT', 'NONE'])
				.optional()
				.describe('Defaults to SOFT.'),
			schedule: z
				.string()
				.optional()
				.describe(
					'Schedule the task must adhere to. Must be "Work Hours" when scheduling the task for another user.',
				),
		})
		.loose()
		.nullable()
		.optional()
		.describe(
			'Set values to turn auto scheduling on, or null to turn auto scheduling off.',
		),
	projectId: z
		.string()
		.optional()
		.describe('The project ID the task should be associated with.'),
	description: z
		.string()
		.optional()
		.describe('Github Flavored Markdown for the input.'),
	priority: z
		.enum(['ASAP', 'HIGH', 'MEDIUM', 'LOW'])
		.optional()
		.describe('ASAP, HIGH, MEDIUM, and LOW are valid values.'),
	labels: z
		.array(z.string())
		.optional()
		.describe('The names of the labels to be added to the task.'),
	assigneeId: z
		.string()
		.optional()
		.describe('The user id the task should be assigned to.'),
} as const;

const TaskResourceOutputSchema = TaskResourceSchema;

export const MotionEndpointInputSchemas = {
	listTasks: z
		.object({
			assigneeId: z
				.string()
				.optional()
				.describe('Limit tasks returned to a specific assignee.'),
			cursor: z
				.string()
				.optional()
				.describe(
					'Use if a previous request returned a cursor. Will page through results.',
				),
			includeAllStatuses: z
				.boolean()
				.optional()
				.describe(
					'Limit tasks returned by statuses that exist on tasks. Cannot be combined with status.',
				),
			label: z
				.string()
				.optional()
				.describe('Limit tasks returned by label on the task.'),
			name: z
				.string()
				.optional()
				.describe(
					'Limit tasks returned to those that contain this string. Case in-sensitive.',
				),
			projectId: z
				.string()
				.optional()
				.describe('Limit tasks returned to a given project.'),
			status: z
				.array(z.string())
				.optional()
				.describe(
					'Limit tasks returned by statuses that exist on tasks. Cannot be combined with includeAllStatuses.',
				),
			workspaceId: z
				.string()
				.optional()
				.describe(
					'The id of the workspace you want tasks from. If not provided, tasks from all workspaces are returned.',
				),
		})
		.strict()
		.refine(
			(value) =>
				!(value.status !== undefined && value.includeAllStatuses !== undefined),
			{
				message:
					'Provide status or includeAllStatuses, not both; Motion rejects requests specifying both.',
			},
		),
	createTask: z
		.object({
			name: z.string().describe('Title of the task.'),
			workspaceId: z
				.string()
				.describe('The workspace ID the task should be associated with.'),
			...TaskFields,
		})
		.strict(),
	getTask: z.object({ id: RouteId }).strict(),
	updateTask: z
		.object({
			id: RouteId,
			name: z.string().describe('Title of the task.'),
			workspaceId: z
				.string()
				.describe('The workspace ID the task should be associated with.'),
			...TaskFields,
		})
		.strict(),
	deleteTask: z.object({ id: RouteId }).strict(),
	moveTask: z
		.object({
			id: RouteId,
			workspaceId: z
				.string()
				.describe('The id of the workspace to which you want the task moved.'),
			assigneeId: z
				.string()
				.optional()
				.describe('The user id the task should be assigned to.'),
		})
		.strict(),
	unassignTask: z.object({ id: RouteId }).strict(),
	listProjects: z
		.object({
			cursor: z
				.string()
				.optional()
				.describe(
					'Use if a previous request returned a cursor. Will page through results.',
				),
			workspaceId: z
				.string()
				.optional()
				.describe('The workspace for which all projects should be returned.'),
		})
		.strict(),
	createProject: z
		.object({
			name: z.string().describe('The name of the project.'),
			workspaceId: z
				.string()
				.describe('The workspace to which the project belongs.'),
			dueDate: z
				.string()
				.optional()
				.describe('ISO 8601 due date on the project.'),
			description: z
				.string()
				.optional()
				.describe('The description of the project. HTML input accepted.'),
			labels: z
				.array(z.string())
				.optional()
				.describe('The list of labels by name the project should have.'),
			priority: z
				.enum(['ASAP', 'HIGH', 'MEDIUM', 'LOW'])
				.optional()
				.describe(
					'Defaults to MEDIUM. Options are ASAP, HIGH, MEDIUM, and LOW.',
				),
			projectDefinitionId: z
				.string()
				.optional()
				.describe(
					'Optional ID of the project definition (template) to use. If provided, stages must also be included.',
				),
			stages: z
				.array(
					z
						.object({
							stageDefinitionId: z
								.string()
								.describe('ID of the stage definition.'),
							dueDate: z
								.string()
								.describe('Due date for this stage (ISO 8601).'),
							variableInstances: z
								.array(
									z.object({
										variableName: z
											.string()
											.describe(
												'Name of the variable definition being assigned.',
											),
										value: z
											.string()
											.describe(
												'The value for the variable, such as a user ID.',
											),
									}),
								)
								.optional()
								.describe(
									'Optional array to assign values to variables specific to this stage.',
								),
						})
						.strict(),
				)
				.optional()
				.describe(
					'Optional array of stage objects, required if projectDefinitionId is provided.',
				),
		})
		.strict(),
	getProject: z.object({ id: RouteId }).strict(),
	listWorkspaces: z
		.object({
			cursor: z
				.string()
				.optional()
				.describe(
					'Use if a previous request returned a cursor. Will page through results.',
				),
			ids: z
				.array(z.string())
				.optional()
				.describe(
					'Expand details of specific workspaces, instead of getting all of them.',
				),
		})
		.strict(),
	listUsers: z
		.object({
			cursor: z
				.string()
				.optional()
				.describe(
					'Use if a previous request returned a cursor. Will page through results.',
				),
			teamId: z
				.string()
				.optional()
				.describe('The ID of the team for which all members will be returned.'),
			workspaceId: z
				.string()
				.optional()
				.describe(
					'The ID of the workspace for which all members will be returned.',
				),
		})
		.strict(),
	getCurrentUser: z.object({}).strict(),
	listComments: z
		.object({
			taskId: z
				.string()
				.describe('The task for which all comments should be returned.'),
			cursor: z
				.string()
				.optional()
				.describe(
					'Use if a previous request returned a cursor. Will page through results.',
				),
		})
		.strict(),
	createComment: z
		.object({
			taskId: z.string().describe('The task on which to place a comment.'),
			content: z
				.string()
				.optional()
				.describe('Github Flavored Markdown representing the comment.'),
		})
		.strict(),
	listRecurringTasks: z
		.object({
			workspaceId: z
				.string()
				.describe(
					'The workspace for which all recurring tasks should be returned.',
				),
			cursor: z
				.string()
				.optional()
				.describe(
					'Use if a previous request returned a cursor. Will page through results.',
				),
		})
		.strict(),
	createRecurringTask: z
		.object({
			name: z.string().describe('The name of the recurring task.'),
			workspaceId: z
				.string()
				.describe('The workspace in which to create the recurring task.'),
			frequency: FrequencySchema.describe(
				'Frequency in which the task should be scheduled.',
			),
			assigneeId: z
				.string()
				.describe('To whom the recurring task should be assigned.'),
			deadlineType: z
				.enum(['HARD', 'SOFT'])
				.optional()
				.describe('"HARD" or "SOFT" are the two values allowed.'),
			duration: z
				.union([z.literal('REMINDER'), z.number().int().positive()])
				.optional()
				.describe(
					'An integer greater than 0 or "REMINDER" for a reminder task.',
				),
			startingOn: z
				.string()
				.optional()
				.describe(
					'ISO 8601 date trimmed to the start of the day passed, like 2024-03-12 or 2024-03-12T06:00:00.000Z.',
				),
			idealTime: z
				.string()
				.optional()
				.describe('If possible, schedule at the ideal time if free (HH:mm).'),
			schedule: z
				.string()
				.optional()
				.describe(
					'Schedule the task must adhere to (defaults to "Work Hours").',
				),
			description: z
				.string()
				.optional()
				.describe('The description of the task.'),
			priority: z
				.enum(['HIGH', 'MEDIUM'])
				.optional()
				.describe('"HIGH" or "MEDIUM" (which is the default).'),
		})
		.strict(),
	deleteRecurringTask: z.object({ id: RouteId }).strict(),
	listCustomFields: z
		.object({
			workspaceId: RouteId.describe(
				'The workspace for which custom fields should be returned.',
			),
		})
		.strict(),
	createCustomField: z
		.object({
			workspaceId: RouteId.describe(
				'The workspace in which the custom field is created.',
			),
			type: CustomFieldTypeSchema.describe(
				'The type of custom field to create.',
			),
			name: z.string().describe('The name of the custom field.'),
			// Motion documents this configuration object for advanced custom fields
			// without a fixed schema, so it stays provider-defined.
			metadata: z
				.object({})
				.loose()
				.optional()
				.describe(
					'Configuration object used for advanced custom fields, like single-select, multi-select, checkboxes, and numbers.',
				),
		})
		.strict(),
	deleteCustomField: z
		.object({
			workspaceId: RouteId.describe(
				'The workspace for which a custom field should be deleted.',
			),
			id: RouteId.describe('The id of the custom field to be deleted.'),
		})
		.strict(),
	addProjectCustomFieldValue: z
		.object({
			projectId: RouteId.describe(
				'The project on which the custom field value is set.',
			),
			customFieldInstanceId: z
				.string()
				.describe('The custom field that is being set on the project.'),
			value: z
				.object({
					type: CustomFieldTypeSchema.describe('The type of custom field.'),
					value: z
						.union([z.string(), z.number()])
						.describe('The actual value being set.'),
				})
				.strict()
				.describe(
					'The value of the custom field on the project that is being set.',
				),
		})
		.strict(),
	addTaskCustomFieldValue: z
		.object({
			taskId: RouteId.describe(
				'The task on which the custom field value is set.',
			),
			customFieldInstanceId: z
				.string()
				.describe(
					'The custom field on the workspace that is being set on the task.',
				),
			value: z
				.object({
					type: CustomFieldTypeSchema.describe('The type of custom field.'),
					value: z
						.union([z.string(), z.number()])
						.describe('The actual value being set.'),
				})
				.strict()
				.describe(
					'The value of the custom field on the workspace that is being set.',
				),
		})
		.strict(),
	deleteProjectCustomFieldValue: z
		.object({
			projectId: RouteId.describe(
				'The project from which a custom field value will be deleted.',
			),
			valueId: RouteId.describe(
				'The ID of the custom field value that will be deleted.',
			),
		})
		.strict(),
	deleteTaskCustomFieldValue: z
		.object({
			taskId: RouteId.describe(
				'The task from which a custom field value will be deleted.',
			),
			valueId: RouteId.describe(
				'The ID of the custom field value that will be deleted.',
			),
		})
		.strict(),
	listSchedules: z.object({}).strict(),
	listStatuses: z
		.object({
			workspaceId: z
				.string()
				.optional()
				.describe('Get statuses for a particular workspace.'),
		})
		.strict(),
} as const;

export const MotionEndpointOutputSchemas = {
	listTasks: TaskPageSchema,
	createTask: TaskResourceOutputSchema,
	getTask: TaskResourceOutputSchema,
	updateTask: TaskResourceOutputSchema,
	deleteTask: z.void(),
	moveTask: TaskResourceOutputSchema,
	unassignTask: z.void(),
	listProjects: ProjectPageSchema,
	createProject: ProjectResourceSchema,
	getProject: ProjectResourceSchema,
	listWorkspaces: WorkspacePageSchema,
	listUsers: UserPageSchema,
	getCurrentUser: UserResourceSchema,
	listComments: CommentPageSchema,
	createComment: CommentResourceSchema,
	listRecurringTasks: RecurringTaskPageSchema,
	createRecurringTask: RecurringTaskResourceSchema,
	deleteRecurringTask: z.void(),
	listCustomFields: z.array(CustomFieldResourceSchema),
	createCustomField: CustomFieldCreateSchema,
	deleteCustomField: z.void(),
	addProjectCustomFieldValue: CustomFieldValueSchema,
	addTaskCustomFieldValue: CustomFieldValueSchema,
	deleteProjectCustomFieldValue: z.void(),
	deleteTaskCustomFieldValue: z.void(),
	listSchedules: z.array(ScheduleSchema),
	// Motion wraps each status item in a { status: ... } object.
	listStatuses: z.array(z.object({ status: ProjectStatusSchema }).loose()),
} as const;

export type MotionEndpointInputs = {
	[K in keyof typeof MotionEndpointInputSchemas]: z.infer<
		(typeof MotionEndpointInputSchemas)[K]
	>;
};
export type MotionEndpointOutputs = {
	[K in keyof typeof MotionEndpointOutputSchemas]: z.infer<
		(typeof MotionEndpointOutputSchemas)[K]
	>;
};
