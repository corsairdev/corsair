import { z } from 'zod';

const TaskSchema = z
	.object({
		id: z.string(),
		project_id: z.string().nullable().optional(),
		section_id: z.string().nullable().optional(),
		content: z.string(),
		description: z.string().optional(),
		is_completed: z.boolean().optional(),
		labels: z.array(z.string()).optional(),
		parent_id: z.string().nullable().optional(),
		order: z.number().optional(),
		priority: z.number().optional(),
		// due is loosely typed because the Todoist due object structure is not strictly defined
		due: z.record(z.unknown()).nullable().optional(),
		url: z.string().optional(),
		comment_count: z.number().optional(),
		created_at: z.string().optional(),
		creator_id: z.string().optional(),
		assignee_id: z.string().optional(),
		assigner_id: z.string().optional(),
	})
	.passthrough();

const ProjectSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		color: z.string().optional(),
		parent_id: z.string().optional(),
		order: z.number().optional(),
		favorite: z.boolean().optional(),
		comment_count: z.number().optional(),
		is_shared: z.boolean().optional(),
		is_archived: z.boolean().optional(),
		is_favorite: z.boolean().optional(),
		view_style: z.string().optional(),
	})
	.passthrough();

const SectionSchema = z
	.object({
		id: z.string(),
		project_id: z.string(),
		name: z.string(),
		order: z.number().optional(),
	})
	.passthrough();

const CommentSchema = z
	.object({
		id: z.string(),
		task_id: z.string().optional(),
		project_id: z.string().optional(),
		content: z.string(),
		posted_at: z.string().optional(),
	})
	.passthrough();

const LabelSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		color: z.string().optional(),
		order: z.number().optional(),
		favorite: z.boolean().optional(),
	})
	.passthrough();

const ReminderSchema = z
	.object({
		id: z.string(),
		task_id: z.string().optional(),
		notify_uid: z.string().optional(),
		// due is loosely typed because the Todoist due object structure is not strictly defined
		due: z.record(z.unknown()).optional(),
	})
	.passthrough();

const TasksCloseInputSchema = z.object({
	id: z.string(),
});

const TasksCreateInputSchema = z.object({
	content: z.string(),
	description: z.string().optional(),
	project_id: z.string().optional(),
	section_id: z.string().optional(),
	parent_id: z.string().optional(),
	order: z.number().optional(),
	labels: z.array(z.string()).optional(),
	priority: z.number().optional(),
	due_datetime: z.string().optional(),
	due_date: z.string().optional(),
	due_string: z.string().optional(),
	assignee_id: z.string().optional(),
});

const TasksDeleteInputSchema = z.object({
	id: z.string(),
});

const TasksGetInputSchema = z.object({
	id: z.string(),
});

const TasksGetManyInputSchema = z.object({
	project_id: z.string().optional(),
	section_id: z.string().optional(),
	label: z.string().optional(),
	filter: z.string().optional(),
	ids: z.array(z.string()).optional(),
});

const TasksMoveInputSchema = z.object({
	id: z.string(),
	project_id: z.string().optional(),
	section_id: z.string().optional(),
	parent_id: z.string().optional(),
	order: z.number().optional(),
});

const TasksQuickAddInputSchema = z.object({
	text: z.string(),
	reminder: z.string().optional(),
	note: z.string().optional(),
	lang: z.string().optional(),
});

const TasksReopenInputSchema = z.object({
	id: z.string(),
});

const TasksUpdateInputSchema = z.object({
	id: z.string(),
	content: z.string().optional(),
	description: z.string().optional(),
	project_id: z.string().optional(),
	section_id: z.string().optional(),
	parent_id: z.string().optional(),
	order: z.number().optional(),
	labels: z.array(z.string()).optional(),
	priority: z.number().optional(),
	due_datetime: z.string().optional(),
	due_date: z.string().optional(),
	due_string: z.string().optional(),
	assignee_id: z.string().optional(),
});

const ProjectsArchiveInputSchema = z.object({
	id: z.string(),
});

const ProjectsCreateInputSchema = z.object({
	name: z.string(),
	color: z.string().optional(),
	favorite: z.boolean().optional(),
	parent_id: z.string().optional(),
	order: z.number().optional(),
});

const ProjectsDeleteInputSchema = z.object({
	id: z.string(),
});

const ProjectsGetInputSchema = z.object({
	id: z.string(),
});

const ProjectsGetCollaboratorsInputSchema = z.object({
	id: z.string(),
});

const ProjectsGetManyInputSchema = z.object({});

const ProjectsUnarchiveInputSchema = z.object({
	id: z.string(),
});

const ProjectsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	color: z.string().optional(),
	favorite: z.boolean().optional(),
	order: z.number().optional(),
	parent_id: z.string().optional(),
});

const SectionsCreateInputSchema = z.object({
	name: z.string(),
	project_id: z.string(),
	order: z.number().optional(),
});

const SectionsDeleteInputSchema = z.object({
	id: z.string(),
});

const SectionsGetInputSchema = z.object({
	id: z.string(),
});

const SectionsGetManyInputSchema = z.object({
	project_id: z.string().optional(),
});

const SectionsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	order: z.number().optional(),
	project_id: z.string().optional(),
});

const CommentsCreateInputSchema = z.object({
	content: z.string(),
	task_id: z.string().optional(),
	project_id: z.string().optional(),
});

const CommentsDeleteInputSchema = z.object({
	id: z.string(),
});

const CommentsGetInputSchema = z.object({
	id: z.string(),
});

const CommentsGetManyInputSchema = z.object({
	task_id: z.string().optional(),
	project_id: z.string().optional(),
});

const CommentsUpdateInputSchema = z.object({
	id: z.string(),
	content: z.string(),
});

const LabelsCreateInputSchema = z.object({
	name: z.string(),
	color: z.string().optional(),
	order: z.number().optional(),
	favorite: z.boolean().optional(),
});

const LabelsDeleteInputSchema = z.object({
	id: z.string(),
});

const LabelsGetInputSchema = z.object({
	id: z.string(),
});

const LabelsGetManyInputSchema = z.object({});

const LabelsUpdateInputSchema = z.object({
	id: z.string(),
	name: z.string().optional(),
	color: z.string().optional(),
	order: z.number().optional(),
	favorite: z.boolean().optional(),
});

const RemindersCreateInputSchema = z.object({
	task_id: z.string(),
	due_datetime: z.string().optional(),
	due_date: z.string().optional(),
	due_string: z.string().optional(),
	relative_duration: z.number().optional(),
	notification_type: z.string().optional(),
	notify_uid: z.string().optional(),
	description: z.string().optional(),
});

const RemindersDeleteInputSchema = z.object({
	id: z.string(),
});

const RemindersGetManyInputSchema = z.object({});

const RemindersUpdateInputSchema = z.object({
	id: z.string(),
	task_id: z.string().optional(),
	due_datetime: z.string().optional(),
	due_date: z.string().optional(),
	due_string: z.string().optional(),
	relative_duration: z.number().optional(),
	notification_type: z.string().optional(),
	notify_uid: z.string().optional(),
	description: z.string().optional(),
});

export const TodoistEndpointInputSchemas = {
	tasksClose: TasksCloseInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksGetMany: TasksGetManyInputSchema,
	tasksMove: TasksMoveInputSchema,
	tasksQuickAdd: TasksQuickAddInputSchema,
	tasksReopen: TasksReopenInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	projectsArchive: ProjectsArchiveInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsGetCollaborators: ProjectsGetCollaboratorsInputSchema,
	projectsGetMany: ProjectsGetManyInputSchema,
	projectsUnarchive: ProjectsUnarchiveInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	sectionsCreate: SectionsCreateInputSchema,
	sectionsDelete: SectionsDeleteInputSchema,
	sectionsGet: SectionsGetInputSchema,
	sectionsGetMany: SectionsGetManyInputSchema,
	sectionsUpdate: SectionsUpdateInputSchema,
	commentsCreate: CommentsCreateInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	commentsGet: CommentsGetInputSchema,
	commentsGetMany: CommentsGetManyInputSchema,
	commentsUpdate: CommentsUpdateInputSchema,
	labelsCreate: LabelsCreateInputSchema,
	labelsDelete: LabelsDeleteInputSchema,
	labelsGet: LabelsGetInputSchema,
	labelsGetMany: LabelsGetManyInputSchema,
	labelsUpdate: LabelsUpdateInputSchema,
	remindersCreate: RemindersCreateInputSchema,
	remindersDelete: RemindersDeleteInputSchema,
	remindersGetMany: RemindersGetManyInputSchema,
	remindersUpdate: RemindersUpdateInputSchema,
} as const;

const TasksCloseResponseSchema = z
	.union([z.undefined(), z.object({}).passthrough()])
	.optional();
const TasksCreateResponseSchema = TaskSchema;
const TasksDeleteResponseSchema = z
	.union([z.undefined(), z.object({}).passthrough()])
	.optional();
const TasksGetResponseSchema = TaskSchema;
const TasksGetManyResponseSchema = z.union([
	z.array(TaskSchema),
	z
		.object({
			tasks: z.array(TaskSchema).optional(),
		})
		.passthrough(),
]);
const TasksMoveResponseSchema = TaskSchema;
const TasksQuickAddResponseSchema = TaskSchema;
const TasksReopenResponseSchema = z
	.union([z.undefined(), z.object({}).passthrough()])
	.optional();
const TasksUpdateResponseSchema = TaskSchema;

const ProjectsArchiveResponseSchema = z.object({}).passthrough();
const ProjectsCreateResponseSchema = ProjectSchema;
const ProjectsDeleteResponseSchema = z.object({}).passthrough();
const ProjectsGetResponseSchema = ProjectSchema;
const ProjectsGetCollaboratorsResponseSchema = z
	.array(
		z
			.object({
				id: z.string(),
				name: z.string().optional(),
				email: z.string().optional(),
			})
			.passthrough(),
	)
	.optional()
	.default([]);
const ProjectsGetManyResponseSchema = z.union([
	z.array(ProjectSchema),
	z
		.object({
			projects: z.array(ProjectSchema).optional(),
		})
		.passthrough(),
]);
const ProjectsUnarchiveResponseSchema = z.object({}).passthrough();
const ProjectsUpdateResponseSchema = ProjectSchema;

const SectionsCreateResponseSchema = SectionSchema;
const SectionsDeleteResponseSchema = z.object({}).passthrough();
const SectionsGetResponseSchema = SectionSchema;
const SectionsGetManyResponseSchema = z.array(SectionSchema);
const SectionsUpdateResponseSchema = SectionSchema;

const CommentsCreateResponseSchema = CommentSchema;
const CommentsDeleteResponseSchema = z.object({}).passthrough();
const CommentsGetResponseSchema = CommentSchema;
const CommentsGetManyResponseSchema = z.array(CommentSchema);
const CommentsUpdateResponseSchema = CommentSchema;

const LabelsCreateResponseSchema = LabelSchema;
const LabelsDeleteResponseSchema = z.object({}).passthrough();
const LabelsGetResponseSchema = LabelSchema;
const LabelsGetManyResponseSchema = z.array(LabelSchema);
const LabelsUpdateResponseSchema = LabelSchema;

const RemindersCreateResponseSchema = ReminderSchema;
const RemindersDeleteResponseSchema = z.object({}).passthrough();
const RemindersGetManyResponseSchema = z.array(ReminderSchema);
const RemindersUpdateResponseSchema = ReminderSchema;

export const TodoistEndpointOutputSchemas = {
	tasksClose: TasksCloseResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksDelete: TasksDeleteResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksGetMany: TasksGetManyResponseSchema,
	tasksMove: TasksMoveResponseSchema,
	tasksQuickAdd: TasksQuickAddResponseSchema,
	tasksReopen: TasksReopenResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	projectsArchive: ProjectsArchiveResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	projectsGet: ProjectsGetResponseSchema,
	projectsGetCollaborators: ProjectsGetCollaboratorsResponseSchema,
	projectsGetMany: ProjectsGetManyResponseSchema,
	projectsUnarchive: ProjectsUnarchiveResponseSchema,
	projectsUpdate: ProjectsUpdateResponseSchema,
	sectionsCreate: SectionsCreateResponseSchema,
	sectionsDelete: SectionsDeleteResponseSchema,
	sectionsGet: SectionsGetResponseSchema,
	sectionsGetMany: SectionsGetManyResponseSchema,
	sectionsUpdate: SectionsUpdateResponseSchema,
	commentsCreate: CommentsCreateResponseSchema,
	commentsDelete: CommentsDeleteResponseSchema,
	commentsGet: CommentsGetResponseSchema,
	commentsGetMany: CommentsGetManyResponseSchema,
	commentsUpdate: CommentsUpdateResponseSchema,
	labelsCreate: LabelsCreateResponseSchema,
	labelsDelete: LabelsDeleteResponseSchema,
	labelsGet: LabelsGetResponseSchema,
	labelsGetMany: LabelsGetManyResponseSchema,
	labelsUpdate: LabelsUpdateResponseSchema,
	remindersCreate: RemindersCreateResponseSchema,
	remindersDelete: RemindersDeleteResponseSchema,
	remindersGetMany: RemindersGetManyResponseSchema,
	remindersUpdate: RemindersUpdateResponseSchema,
} as const;

export type TodoistEndpointInputs = {
	[K in keyof typeof TodoistEndpointInputSchemas]: z.infer<
		(typeof TodoistEndpointInputSchemas)[K]
	>;
};

export type TodoistEndpointOutputs = {
	[K in keyof typeof TodoistEndpointOutputSchemas]: z.infer<
		(typeof TodoistEndpointOutputSchemas)[K]
	>;
};

export const todoistEndpointSchemas = {
	'tasks.close': {
		input: TodoistEndpointInputSchemas.tasksClose,
		output: TodoistEndpointOutputSchemas.tasksClose,
	},
	'tasks.create': {
		input: TodoistEndpointInputSchemas.tasksCreate,
		output: TodoistEndpointOutputSchemas.tasksCreate,
	},
	'tasks.delete': {
		input: TodoistEndpointInputSchemas.tasksDelete,
		output: TodoistEndpointOutputSchemas.tasksDelete,
	},
	'tasks.get': {
		input: TodoistEndpointInputSchemas.tasksGet,
		output: TodoistEndpointOutputSchemas.tasksGet,
	},
	'tasks.getMany': {
		input: TodoistEndpointInputSchemas.tasksGetMany,
		output: TodoistEndpointOutputSchemas.tasksGetMany,
	},
	'tasks.move': {
		input: TodoistEndpointInputSchemas.tasksMove,
		output: TodoistEndpointOutputSchemas.tasksMove,
	},
	'tasks.quickAdd': {
		input: TodoistEndpointInputSchemas.tasksQuickAdd,
		output: TodoistEndpointOutputSchemas.tasksQuickAdd,
	},
	'tasks.reopen': {
		input: TodoistEndpointInputSchemas.tasksReopen,
		output: TodoistEndpointOutputSchemas.tasksReopen,
	},
	'tasks.update': {
		input: TodoistEndpointInputSchemas.tasksUpdate,
		output: TodoistEndpointOutputSchemas.tasksUpdate,
	},
	'projects.archive': {
		input: TodoistEndpointInputSchemas.projectsArchive,
		output: TodoistEndpointOutputSchemas.projectsArchive,
	},
	'projects.create': {
		input: TodoistEndpointInputSchemas.projectsCreate,
		output: TodoistEndpointOutputSchemas.projectsCreate,
	},
	'projects.delete': {
		input: TodoistEndpointInputSchemas.projectsDelete,
		output: TodoistEndpointOutputSchemas.projectsDelete,
	},
	'projects.get': {
		input: TodoistEndpointInputSchemas.projectsGet,
		output: TodoistEndpointOutputSchemas.projectsGet,
	},
	'projects.getCollaborators': {
		input: TodoistEndpointInputSchemas.projectsGetCollaborators,
		output: TodoistEndpointOutputSchemas.projectsGetCollaborators,
	},
	'projects.getMany': {
		input: TodoistEndpointInputSchemas.projectsGetMany,
		output: TodoistEndpointOutputSchemas.projectsGetMany,
	},
	'projects.unarchive': {
		input: TodoistEndpointInputSchemas.projectsUnarchive,
		output: TodoistEndpointOutputSchemas.projectsUnarchive,
	},
	'projects.update': {
		input: TodoistEndpointInputSchemas.projectsUpdate,
		output: TodoistEndpointOutputSchemas.projectsUpdate,
	},
	'sections.create': {
		input: TodoistEndpointInputSchemas.sectionsCreate,
		output: TodoistEndpointOutputSchemas.sectionsCreate,
	},
	'sections.delete': {
		input: TodoistEndpointInputSchemas.sectionsDelete,
		output: TodoistEndpointOutputSchemas.sectionsDelete,
	},
	'sections.get': {
		input: TodoistEndpointInputSchemas.sectionsGet,
		output: TodoistEndpointOutputSchemas.sectionsGet,
	},
	'sections.getMany': {
		input: TodoistEndpointInputSchemas.sectionsGetMany,
		output: TodoistEndpointOutputSchemas.sectionsGetMany,
	},
	'sections.update': {
		input: TodoistEndpointInputSchemas.sectionsUpdate,
		output: TodoistEndpointOutputSchemas.sectionsUpdate,
	},
	'comments.create': {
		input: TodoistEndpointInputSchemas.commentsCreate,
		output: TodoistEndpointOutputSchemas.commentsCreate,
	},
	'comments.delete': {
		input: TodoistEndpointInputSchemas.commentsDelete,
		output: TodoistEndpointOutputSchemas.commentsDelete,
	},
	'comments.get': {
		input: TodoistEndpointInputSchemas.commentsGet,
		output: TodoistEndpointOutputSchemas.commentsGet,
	},
	'comments.getMany': {
		input: TodoistEndpointInputSchemas.commentsGetMany,
		output: TodoistEndpointOutputSchemas.commentsGetMany,
	},
	'comments.update': {
		input: TodoistEndpointInputSchemas.commentsUpdate,
		output: TodoistEndpointOutputSchemas.commentsUpdate,
	},
	'labels.create': {
		input: TodoistEndpointInputSchemas.labelsCreate,
		output: TodoistEndpointOutputSchemas.labelsCreate,
	},
	'labels.delete': {
		input: TodoistEndpointInputSchemas.labelsDelete,
		output: TodoistEndpointOutputSchemas.labelsDelete,
	},
	'labels.get': {
		input: TodoistEndpointInputSchemas.labelsGet,
		output: TodoistEndpointOutputSchemas.labelsGet,
	},
	'labels.getMany': {
		input: TodoistEndpointInputSchemas.labelsGetMany,
		output: TodoistEndpointOutputSchemas.labelsGetMany,
	},
	'labels.update': {
		input: TodoistEndpointInputSchemas.labelsUpdate,
		output: TodoistEndpointOutputSchemas.labelsUpdate,
	},
	'reminders.create': {
		input: TodoistEndpointInputSchemas.remindersCreate,
		output: TodoistEndpointOutputSchemas.remindersCreate,
	},
	'reminders.delete': {
		input: TodoistEndpointInputSchemas.remindersDelete,
		output: TodoistEndpointOutputSchemas.remindersDelete,
	},
	'reminders.getMany': {
		input: TodoistEndpointInputSchemas.remindersGetMany,
		output: TodoistEndpointOutputSchemas.remindersGetMany,
	},
	'reminders.update': {
		input: TodoistEndpointInputSchemas.remindersUpdate,
		output: TodoistEndpointOutputSchemas.remindersUpdate,
	},
} as const;
