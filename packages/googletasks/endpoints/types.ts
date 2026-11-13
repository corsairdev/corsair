import { z } from 'zod';

const Rfc3339DateTimeSchema = z.iso.datetime({ offset: true });

const TaskListSchema = z.strictObject({
	id: z.string().optional(),
	title: z.string().max(1024).optional(),
	updated: Rfc3339DateTimeSchema.optional(),
	selfLink: z.string().optional(),
	kind: z.string().optional(),
	etag: z.string().optional(),
});

const TaskSchema = z.strictObject({
	id: z.string().optional(),
	title: z.string().max(1024).optional(),
	updated: Rfc3339DateTimeSchema.optional(),
	selfLink: z.string().optional(),
	webViewLink: z.string().optional(),
	kind: z.string().optional(),
	etag: z.string().optional(),
	status: z.enum(['needsAction', 'completed']).optional(),
	due: Rfc3339DateTimeSchema.optional(),
	completed: Rfc3339DateTimeSchema.optional(),
	parent: z.string().optional(),
	position: z.string().optional(),
	notes: z.string().max(8192).optional(),
	hidden: z.boolean().optional(),
	deleted: z.boolean().optional(),
	links: z
		.array(
			z.strictObject({
				type: z.string().optional(),
				link: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.optional(),
	assignmentInfo: z
		.strictObject({
			surfaceType: z
				.enum(['CONTEXT_TYPE_UNSPECIFIED', 'GMAIL', 'DOCUMENT', 'SPACE'])
				.optional(),
			linkToTask: z.string().optional(),
			driveResourceInfo: z
				.strictObject({
					driveFileId: z.string().optional(),
					resourceKey: z.string().optional(),
				})
				.optional(),
			spaceInfo: z.strictObject({ space: z.string().optional() }).optional(),
		})
		.optional(),
});

const TaskListCreateSchema = z.strictObject({
	title: z.string().max(1024).optional(),
});
const TaskListReplaceSchema = z.strictObject({
	title: z.string().max(1024).optional(),
	etag: z.string().optional(),
});
const TaskListPatchSchema = z.strictObject({
	title: z.string().max(1024).optional(),
	etag: z.string().optional(),
});

const TaskCreateSchema = z.strictObject({
	title: z.string().max(1024).optional(),
	notes: z.string().max(8192).optional(),
	due: Rfc3339DateTimeSchema.optional(),
	completed: Rfc3339DateTimeSchema.optional(),
	status: z.enum(['needsAction', 'completed']).optional(),
	deleted: z.boolean().optional(),
	etag: z.string().optional(),
});
const TaskReplaceSchema = z.strictObject({
	title: z.string().max(1024).optional(),
	notes: z.string().max(8192).optional(),
	due: Rfc3339DateTimeSchema.optional(),
	completed: Rfc3339DateTimeSchema.optional(),
	status: z.enum(['needsAction', 'completed']).optional(),
	deleted: z.boolean().optional(),
	etag: z.string().optional(),
});
const TaskPatchSchema = z.strictObject({
	title: z.string().max(1024).optional(),
	notes: z.string().max(8192).optional(),
	due: Rfc3339DateTimeSchema.optional(),
	completed: Rfc3339DateTimeSchema.optional(),
	status: z.enum(['needsAction', 'completed']).optional(),
	deleted: z.boolean().optional(),
	etag: z.string().optional(),
});

const PageTokenSchema = z.string().min(1).optional();
const TaskListIdSchema = z.string().min(1);
const TaskIdSchema = z.string().min(1);

export const GoogleTasksEndpointInputSchemas = {
	taskListsList: z.strictObject({
		maxResults: z.number().int().min(1).max(1000).optional(),
		pageToken: PageTokenSchema,
	}),
	taskListsGet: z.strictObject({ taskListId: TaskListIdSchema }),
	taskListsInsert: z.strictObject({ taskList: TaskListCreateSchema }),
	taskListsUpdate: z.strictObject({
		taskListId: TaskListIdSchema,
		taskList: TaskListReplaceSchema,
	}),
	taskListsPatch: z.strictObject({
		taskListId: TaskListIdSchema,
		taskList: TaskListPatchSchema,
	}),
	taskListsDelete: z.strictObject({ taskListId: TaskListIdSchema }),
	tasksList: z.strictObject({
		taskListId: TaskListIdSchema,
		completedMax: Rfc3339DateTimeSchema.optional(),
		completedMin: Rfc3339DateTimeSchema.optional(),
		dueMax: Rfc3339DateTimeSchema.optional(),
		dueMin: Rfc3339DateTimeSchema.optional(),
		maxResults: z.number().int().min(1).max(100).optional(),
		pageToken: PageTokenSchema,
		showAssigned: z.boolean().optional(),
		showCompleted: z.boolean().optional(),
		showDeleted: z.boolean().optional(),
		showHidden: z.boolean().optional(),
		updatedMin: Rfc3339DateTimeSchema.optional(),
	}),
	tasksGet: z.strictObject({
		taskListId: TaskListIdSchema,
		taskId: TaskIdSchema,
	}),
	tasksInsert: z.strictObject({
		taskListId: TaskListIdSchema,
		task: TaskCreateSchema,
		parent: TaskIdSchema.optional(),
		previous: TaskIdSchema.optional(),
	}),
	tasksUpdate: z.strictObject({
		taskListId: TaskListIdSchema,
		taskId: TaskIdSchema,
		task: TaskReplaceSchema,
	}),
	tasksPatch: z.strictObject({
		taskListId: TaskListIdSchema,
		taskId: TaskIdSchema,
		task: TaskPatchSchema,
	}),
	tasksDelete: z.strictObject({
		taskListId: TaskListIdSchema,
		taskId: TaskIdSchema,
	}),
	tasksMove: z.strictObject({
		taskListId: TaskListIdSchema,
		taskId: TaskIdSchema,
		destinationTasklist: TaskListIdSchema.optional(),
		parent: TaskIdSchema.optional(),
		previous: TaskIdSchema.optional(),
	}),
	tasksClear: z.strictObject({ taskListId: TaskListIdSchema }),
} as const;

export const GoogleTasksEndpointOutputSchemas = {
	taskListsList: z.strictObject({
		kind: z.string().optional(),
		etag: z.string().optional(),
		nextPageToken: z.string().optional(),
		items: z.array(TaskListSchema).optional(),
	}),
	taskListsGet: TaskListSchema,
	taskListsInsert: TaskListSchema,
	taskListsUpdate: TaskListSchema,
	taskListsPatch: TaskListSchema,
	taskListsDelete: z.undefined(),
	tasksList: z.strictObject({
		kind: z.string().optional(),
		etag: z.string().optional(),
		nextPageToken: z.string().optional(),
		items: z.array(TaskSchema).optional(),
	}),
	tasksGet: TaskSchema,
	tasksInsert: TaskSchema,
	tasksUpdate: TaskSchema,
	tasksPatch: TaskSchema,
	tasksDelete: z.undefined(),
	tasksMove: TaskSchema,
	tasksClear: z.undefined(),
} as const;

export type GoogleTasksEndpointInputs = {
	[K in keyof typeof GoogleTasksEndpointInputSchemas]: z.infer<
		(typeof GoogleTasksEndpointInputSchemas)[K]
	>;
};

export type GoogleTasksEndpointOutputs = {
	[K in keyof typeof GoogleTasksEndpointOutputSchemas]: z.infer<
		(typeof GoogleTasksEndpointOutputSchemas)[K]
	>;
};
