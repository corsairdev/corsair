import { z } from 'zod';

// Inputs use Wrike's own parameter names. Outputs are `.loose()` and their
// documented fields nullish.
// Reference: https://developers.wrike.com/llms.txt and the v4 reference pages.
//
// Every response is `{ kind, data: [...] }`, so the schemas share one envelope.
// Ids carry a prefix — `IEAA…` for a task, `IEA…` for a folder, `KU…` for a
// contact — and that prefix is part of the id, so they are plain strings.

/** The `{ kind, data }` envelope every v4 response uses. */
function envelope<T extends z.ZodType>(item: T) {
	return z
		.object({
			kind: z.string().nullish(),
			data: z.array(item).nullish(),
		})
		.loose();
}

const IdSchema = z.string().min(1);

/** A date range, which Wrike writes as `{ start, due }`. */
const DatesSchema = z
	.object({
		type: z
			.string()
			.nullish()
			.describe('Backlog, Milestone, Planned or Wrike.'),
		duration: z.number().nullish(),
		start: z.string().nullish(),
		due: z.string().nullish(),
	})
	.loose();

const TaskSchema = z
	.object({
		id: IdSchema.nullish(),
		title: z.string().nullish(),
		description: z.string().nullish(),
		status: z
			.string()
			.nullish()
			.describe(
				'Active, Deferred, Completed or Cancelled, or a custom status.',
			),
		importance: z.string().nullish(),
		permalink: z.string().nullish(),
		dates: DatesSchema.nullish(),
		parentIds: z.array(z.string()).nullish(),
		subTaskIds: z.array(z.string()).nullish(),
		superTaskIds: z.array(z.string()).nullish(),
		authorIds: z.array(z.string()).nullish(),
		responsibleIds: z.array(z.string()).nullish(),
		followerIds: z.array(z.string()).nullish(),
		sharedIds: z.array(z.string()).nullish(),
		hasAttachments: z.boolean().nullish(),
		recurrent: z.boolean().nullish(),
		createdDate: z.string().nullish(),
		updatedDate: z.string().nullish(),
		completedDate: z.string().nullish(),
		customFields: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type WrikeTask = z.infer<typeof TaskSchema>;

const FolderSchema = z
	.object({
		id: IdSchema.nullish(),
		title: z.string().nullish(),
		childIds: z.array(z.string()).nullish(),
		scope: z.string().nullish(),
		space: z.boolean().nullish(),
		color: z.string().nullish(),
		customItemTypeId: z.string().nullish(),
		project: z
			.object({
				status: z.string().nullish(),
				ownerIds: z.array(z.string()).nullish(),
				startDate: z.string().nullish(),
				endDate: z.string().nullish(),
				createdDate: z.string().nullish(),
				completedDate: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type WrikeFolder = z.infer<typeof FolderSchema>;

const ContactSchema = z
	.object({
		id: IdSchema.nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		primaryEmail: z.string().nullish(),
		title: z.string().nullish(),
		companyName: z.string().nullish(),
		phone: z.string().nullish(),
		location: z.string().nullish(),
		timezone: z.string().nullish(),
		locale: z.string().nullish(),
		type: z.string().nullish().describe('Person, Group or Robot.'),
		avatarUrl: z.string().nullish(),
		deleted: z.boolean().nullish(),
		me: z.boolean().nullish(),
		myTeam: z.boolean().nullish(),
		profiles: z.array(z.record(z.string(), z.unknown())).nullish(),
	})
	.loose();

export type WrikeContact = z.infer<typeof ContactSchema>;

/**
 * A logged stretch of work. `hours` is what every report totals, and
 * `trackedDate` is the day it belongs to — not the time it was entered.
 */
const TimelogSchema = z
	.object({
		id: IdSchema.nullish(),
		taskId: z.string().nullish(),
		userId: z.string().nullish(),
		hours: z.number().nullish(),
		trackedDate: z.string().nullish(),
		comment: z.string().nullish(),
		billingType: z.string().nullish().describe('Billable or NonBillable.'),
		createdDate: z.string().nullish(),
		updatedDate: z.string().nullish(),
		approvalStatus: z.string().nullish(),
		lockStatus: z.string().nullish(),
		categoryId: z.string().nullish(),
	})
	.loose();

export type WrikeTimelog = z.infer<typeof TimelogSchema>;

const CommentSchema = z
	.object({
		id: IdSchema.nullish(),
		text: z.string().nullish(),
		authorId: z.string().nullish(),
		type: z.string().nullish(),
		createdDate: z.string().nullish(),
		updatedDate: z.string().nullish(),
		taskId: z.string().nullish(),
		folderId: z.string().nullish(),
		rootCommentId: z.string().nullish(),
	})
	.loose();

export type WrikeComment = z.infer<typeof CommentSchema>;

// ── shared inputs ─────────────────────────────────────────────────────────

const PagingSchema = {
	pageSize: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Items per page, up to 1000.'),
	nextPageToken: z
		.string()
		.optional()
		.describe('The token the previous page returned, to read the next.'),
};

const FieldsSchema = z
	.string()
	.optional()
	.describe(
		'A JSON array of optional fields to include, e.g. `["attachmentCount"]`.',
	);

const SortSchema = {
	sortField: z
		.enum([
			'Status',
			'Importance',
			'Title',
			'StartDate',
			'DueDate',
			'CreatedDate',
			'UpdatedDate',
		])
		.optional(),
	sortOrder: z.enum(['Asc', 'Desc']).optional(),
};

// ── tasks ─────────────────────────────────────────────────────────────────

/** The filters a task search accepts. All of them are optional. */
const TasksListInputSchema = z.object({
	...PagingSchema,
	title: z.string().optional().describe('A substring of the title.'),
	status: z
		.array(z.enum(['Active', 'Deferred', 'Completed', 'Cancelled']))
		.min(1)
		.optional(),
	importance: z.enum(['High', 'Low', 'Normal']).optional(),
	startDate: z
		.string()
		.optional()
		.describe('A date, or a range as `{start},{end}`.'),
	dueDate: z
		.string()
		.optional()
		.describe('A date, or a range as `{start},{end}`.'),
	createdDate: z.string().optional(),
	updatedDate: z.string().optional(),
	completedDate: z.string().optional(),
	authors: z
		.array(IdSchema)
		.min(1)
		.optional()
		.describe('Contact ids: only tasks created by any of them.'),
	responsibles: z
		.array(IdSchema)
		.min(1)
		.optional()
		.describe('Contact ids: only tasks assigned to any of them.'),
	permalink: z.string().optional().describe('A task permalink, exact match.'),
	type: z.enum(['Milestone', 'Backlog', 'Planned']).optional(),
	subTasks: z.boolean().optional().describe('Include subtasks in the scope.'),
	withInvitations: z
		.boolean()
		.optional()
		.describe('Include invitations in the shared and responsible id lists.'),
	...SortSchema,
	fields: FieldsSchema,
});

export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TasksListResponseSchema = envelope(TaskSchema);

export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

const TasksGetInputSchema = z.object({
	id: IdSchema.describe('The task id, including its IEAA prefix.'),
});

export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

const TasksGetResponseSchema = envelope(TaskSchema);

export type TasksGetResponse = z.infer<typeof TasksGetResponseSchema>;

/**
 * Creates a task in a folder. Wrike has no `POST /tasks`: a task is always
 * created under a parent folder, and the account root is reached through the
 * root folder's id.
 */
const TasksCreateInputSchema = z.object({
	folderId: IdSchema.describe(
		'The parent folder id. Use the Root Folder API id for the account root.',
	),
	title: z.string().min(1),
	description: z.string().optional(),
	status: z.enum(['Active', 'Deferred', 'Completed', 'Cancelled']).optional(),
	importance: z.enum(['High', 'Low', 'Normal']).optional(),
	responsibles: z
		.array(IdSchema)
		.min(1)
		.optional()
		.describe('Contact ids to assign.'),
	followers: z.array(IdSchema).min(1).optional(),
	startDate: z.string().optional(),
	dueDate: z.string().optional(),
	dates: z
		.object({
			type: z.enum(['Backlog', 'Milestone', 'Planned', 'Wrike']).optional(),
			start: z.string().optional(),
			due: z.string().optional(),
			duration: z.number().optional(),
		})
		.loose()
		.optional()
		.describe('A richer date form than startDate and dueDate.'),
	parentIds: z
		.array(IdSchema)
		.min(1)
		.optional()
		.describe('Additional parent folders, beyond the one in the path.'),
	customFields: z.array(z.record(z.string(), z.unknown())).min(1).optional(),
	metadata: z.array(z.record(z.string(), z.unknown())).min(1).optional(),
});

export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

const TasksCreateResponseSchema = envelope(TaskSchema);

export type TasksCreateResponse = z.infer<typeof TasksCreateResponseSchema>;

const TasksUpdateInputSchema = z
	.object({
		id: IdSchema,
		title: z.string().min(1).optional(),
		description: z.string().optional(),
		status: z.enum(['Active', 'Deferred', 'Completed', 'Cancelled']).optional(),
		importance: z.enum(['High', 'Low', 'Normal']).optional(),
		addResponsibles: z.array(IdSchema).min(1).optional(),
		removeResponsibles: z.array(IdSchema).min(1).optional(),
		addFollowers: z.array(IdSchema).min(1).optional(),
		removeFollowers: z.array(IdSchema).min(1).optional(),
		startDate: z
			.string()
			.optional()
			.describe('Send an empty string to clear it.'),
		dueDate: z
			.string()
			.optional()
			.describe('Send an empty string to clear it.'),
		restore: z
			.boolean()
			.optional()
			.describe('Restore a task from the recycle bin.'),
		customFields: z.array(z.record(z.string(), z.unknown())).min(1).optional(),
	})
	.superRefine((value, ctx) => {
		const { id: _id, ...changes } = value;
		if (Object.values(changes).every((field) => field === undefined)) {
			ctx.addIssue({
				code: 'custom',
				path: ['id'],
				message: 'Send at least one field to change.',
			});
		}
	});

export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

const TasksUpdateResponseSchema = envelope(TaskSchema);

export type TasksUpdateResponse = z.infer<typeof TasksUpdateResponseSchema>;

const TasksDeleteInputSchema = z.object({ id: IdSchema });

export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

/** A delete answers an empty list, so the plugin states what it did. */
const DeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

// ── folders ───────────────────────────────────────────────────────────────

const FoldersListInputSchema = z.object({
	...PagingSchema,
	fields: FieldsSchema,
});

export type FoldersListInput = z.infer<typeof FoldersListInputSchema>;

const FoldersListResponseSchema = envelope(FolderSchema);

export type FoldersListResponse = z.infer<typeof FoldersListResponseSchema>;

const FoldersGetInputSchema = z.object({ id: IdSchema });

export type FoldersGetInput = z.infer<typeof FoldersGetInputSchema>;

const FoldersGetResponseSchema = envelope(FolderSchema);

export type FoldersGetResponse = z.infer<typeof FoldersGetResponseSchema>;

/** Creates a folder inside another, or in the account root. */
const FoldersCreateInputSchema = z.object({
	parentId: IdSchema.describe(
		'The parent folder id. Use the Root Folder API id for the account root.',
	),
	title: z.string().min(1),
	description: z.string().optional(),
	shareds: z
		.array(IdSchema)
		.min(1)
		.optional()
		.describe('Contact ids to share with.'),
	...PagingSchema,
});

export type FoldersCreateInput = z.infer<typeof FoldersCreateInputSchema>;

const FoldersCreateResponseSchema = envelope(FolderSchema);

export type FoldersCreateResponse = z.infer<typeof FoldersCreateResponseSchema>;

const FoldersTasksInputSchema = z.object({
	id: IdSchema.describe('The folder id.'),
	...PagingSchema,
	descendants: z
		.boolean()
		.optional()
		.describe('Also search every descendant folder.'),
	...SortSchema,
	fields: FieldsSchema,
});

export type FoldersTasksInput = z.infer<typeof FoldersTasksInputSchema>;

const FoldersTasksResponseSchema = envelope(TaskSchema);

export type FoldersTasksResponse = z.infer<typeof FoldersTasksResponseSchema>;

const FoldersUpdateInputSchema = z.object({
	id: IdSchema,
	title: z.string().min(1).optional(),
	description: z.string().optional(),
	addParents: z.array(IdSchema).min(1).optional(),
	removeParents: z.array(IdSchema).min(1).optional(),
	customFields: z.array(z.record(z.string(), z.unknown())).min(1).optional(),
});

export type FoldersUpdateInput = z.infer<typeof FoldersUpdateInputSchema>;

const FoldersUpdateResponseSchema = envelope(FolderSchema);

export type FoldersUpdateResponse = z.infer<typeof FoldersUpdateResponseSchema>;

const FoldersDeleteInputSchema = z.object({
	id: IdSchema,
	recursive: z
		.boolean()
		.optional()
		.describe(
			'Also delete the folder contents. Without it a non-empty folder is refused.',
		),
});

export type FoldersDeleteInput = z.infer<typeof FoldersDeleteInputSchema>;

// ── timelogs ──────────────────────────────────────────────────────────────

const TimelogsListInputSchema = z.object({
	...PagingSchema,
	taskId: z.string().optional().describe('Only this task.'),
	userId: z.string().optional().describe('Only this person.'),
	trackedDate: z
		.string()
		.optional()
		.describe('A date, or a range as `{start},{end}`.'),
	createdDate: z.string().optional(),
});

export type TimelogsListInput = z.infer<typeof TimelogsListInputSchema>;

const TimelogsListResponseSchema = envelope(TimelogSchema);

export type TimelogsListResponse = z.infer<typeof TimelogsListResponseSchema>;

const TasksTimelogsInputSchema = z.object({
	taskId: IdSchema,
	...PagingSchema,
});

export type TasksTimelogsInput = z.infer<typeof TasksTimelogsInputSchema>;

/**
 * Logs time against a task. `trackedDate` is the day the work belongs to, and
 * `hours` is what every report totals — so both are required.
 */
const TimelogsCreateInputSchema = z.object({
	taskId: IdSchema,
	hours: z.number().positive(),
	trackedDate: z
		.string()
		.min(1)
		.describe('The day the work belongs to, as yyyy-MM-dd.'),
	comment: z.string().optional(),
	categoryId: z.string().optional().describe('A timelog category id.'),
});

export type TimelogsCreateInput = z.infer<typeof TimelogsCreateInputSchema>;

const TimelogsCreateResponseSchema = envelope(TimelogSchema);

export type TimelogsCreateResponse = z.infer<
	typeof TimelogsCreateResponseSchema
>;

const TimelogsDeleteInputSchema = z.object({ id: IdSchema });

export type TimelogsDeleteInput = z.infer<typeof TimelogsDeleteInputSchema>;

// ── comments ──────────────────────────────────────────────────────────────

const TaskCommentsInputSchema = z.object({
	taskId: IdSchema,
	...PagingSchema,
});

export type TaskCommentsInput = z.infer<typeof TaskCommentsInputSchema>;

const TaskCommentsResponseSchema = envelope(CommentSchema);

export type TaskCommentsResponse = z.infer<typeof TaskCommentsResponseSchema>;

const CommentsListInputSchema = z.object({ ...PagingSchema });

export type CommentsListInput = z.infer<typeof CommentsListInputSchema>;

const TaskCommentsCreateInputSchema = z.object({
	taskId: IdSchema,
	text: z
		.string()
		.min(1)
		.describe('The comment text. Plain text; Wrike renders the links itself.'),
});

export type TaskCommentsCreateInput = z.infer<
	typeof TaskCommentsCreateInputSchema
>;

const TaskCommentsCreateResponseSchema = envelope(CommentSchema);

export type TaskCommentsCreateResponse = z.infer<
	typeof TaskCommentsCreateResponseSchema
>;

const CommentsUpdateInputSchema = z.object({
	id: IdSchema,
	text: z.string().min(1),
});

export type CommentsUpdateInput = z.infer<typeof CommentsUpdateInputSchema>;

const CommentsUpdateResponseSchema = envelope(CommentSchema);

export type CommentsUpdateResponse = z.infer<
	typeof CommentsUpdateResponseSchema
>;

const CommentsDeleteInputSchema = z.object({ id: IdSchema });

export type CommentsDeleteInput = z.infer<typeof CommentsDeleteInputSchema>;

// ── contacts and account ──────────────────────────────────────────────────

const ContactsListInputSchema = z.object({
	...PagingSchema,
	me: z.boolean().optional().describe('Only the contact behind the token.'),
	active: z
		.boolean()
		.optional()
		.describe('Only contacts who have not been deleted.'),
	fields: FieldsSchema,
});

export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = envelope(ContactSchema);

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

const ContactsGetInputSchema = z.object({
	id: z
		.string()
		.min(1)
		.describe('A contact id, or `me` for the contact behind the token.'),
});

export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

const ContactsGetResponseSchema = envelope(ContactSchema);

export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

const AccountGetInputSchema = z.object({});

export type AccountGetInput = z.infer<typeof AccountGetInputSchema>;

/**
 * The account behind the token. It also exposes the virtual ids that a create
 * needs — the root folder — which is why it is worth reading rather than just
 * checking.
 */
const AccountSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		dateFormat: z.string().nullish(),
		firstDayOfWeek: z.string().nullish(),
		workDays: z.array(z.string()).nullish(),
		rootFolderId: z
			.string()
			.nullish()
			.describe('The virtual root, which a create uses as its parent.'),
		recycleBinId: z.string().nullish(),
		timezone: z.string().nullish(),
		locale: z.string().nullish(),
		subscription: z.record(z.string(), z.unknown()).nullish(),
	})
	.loose();

export type WrikeAccount = z.infer<typeof AccountSchema>;

const AccountGetResponseSchema = envelope(AccountSchema);

export type AccountGetResponse = z.infer<typeof AccountGetResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type WrikeEndpointInputs = {
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	foldersList: FoldersListInput;
	foldersGet: FoldersGetInput;
	foldersCreate: FoldersCreateInput;
	foldersTasks: FoldersTasksInput;
	foldersUpdate: FoldersUpdateInput;
	foldersDelete: FoldersDeleteInput;
	timelogsList: TimelogsListInput;
	timelogsCreate: TimelogsCreateInput;
	timelogsDelete: TimelogsDeleteInput;
	taskTimelogs: TasksTimelogsInput;
	taskComments: TaskCommentsInput;
	taskCommentsCreate: TaskCommentsCreateInput;
	commentsList: CommentsListInput;
	commentsUpdate: CommentsUpdateInput;
	commentsDelete: CommentsDeleteInput;
	contactsList: ContactsListInput;
	contactsGet: ContactsGetInput;
	accountGet: AccountGetInput;
};

export type WrikeEndpointOutputs = {
	tasksList: TasksListResponse;
	tasksGet: TasksGetResponse;
	tasksCreate: TasksCreateResponse;
	tasksUpdate: TasksUpdateResponse;
	tasksDelete: DeleteResponse;
	foldersList: FoldersListResponse;
	foldersGet: FoldersGetResponse;
	foldersCreate: FoldersCreateResponse;
	foldersTasks: FoldersTasksResponse;
	foldersUpdate: FoldersUpdateResponse;
	foldersDelete: DeleteResponse;
	timelogsList: TimelogsListResponse;
	timelogsCreate: TimelogsCreateResponse;
	timelogsDelete: DeleteResponse;
	taskTimelogs: TimelogsListResponse;
	taskComments: TaskCommentsResponse;
	taskCommentsCreate: TaskCommentsCreateResponse;
	commentsList: TaskCommentsResponse;
	commentsUpdate: CommentsUpdateResponse;
	commentsDelete: DeleteResponse;
	contactsList: ContactsListResponse;
	contactsGet: ContactsGetResponse;
	accountGet: AccountGetResponse;
};

export const WrikeEndpointInputSchemas = {
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	foldersList: FoldersListInputSchema,
	foldersGet: FoldersGetInputSchema,
	foldersCreate: FoldersCreateInputSchema,
	foldersTasks: FoldersTasksInputSchema,
	foldersUpdate: FoldersUpdateInputSchema,
	foldersDelete: FoldersDeleteInputSchema,
	timelogsList: TimelogsListInputSchema,
	timelogsCreate: TimelogsCreateInputSchema,
	timelogsDelete: TimelogsDeleteInputSchema,
	taskTimelogs: TasksTimelogsInputSchema,
	taskComments: TaskCommentsInputSchema,
	taskCommentsCreate: TaskCommentsCreateInputSchema,
	commentsList: CommentsListInputSchema,
	commentsUpdate: CommentsUpdateInputSchema,
	commentsDelete: CommentsDeleteInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactsGetInputSchema,
	accountGet: AccountGetInputSchema,
} as const;

export const WrikeEndpointOutputSchemas = {
	tasksList: TasksListResponseSchema,
	tasksGet: TasksGetResponseSchema,
	tasksCreate: TasksCreateResponseSchema,
	tasksUpdate: TasksUpdateResponseSchema,
	tasksDelete: DeleteResponseSchema,
	foldersList: FoldersListResponseSchema,
	foldersGet: FoldersGetResponseSchema,
	foldersCreate: FoldersCreateResponseSchema,
	foldersTasks: FoldersTasksResponseSchema,
	foldersUpdate: FoldersUpdateResponseSchema,
	foldersDelete: DeleteResponseSchema,
	timelogsList: TimelogsListResponseSchema,
	timelogsCreate: TimelogsCreateResponseSchema,
	timelogsDelete: DeleteResponseSchema,
	taskTimelogs: TimelogsListResponseSchema,
	taskComments: TaskCommentsResponseSchema,
	taskCommentsCreate: TaskCommentsCreateResponseSchema,
	commentsList: TaskCommentsResponseSchema,
	commentsUpdate: CommentsUpdateResponseSchema,
	commentsDelete: DeleteResponseSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	accountGet: AccountGetResponseSchema,
} as const;
