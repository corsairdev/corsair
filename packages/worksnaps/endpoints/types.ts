import { z } from 'zod';

// Inputs use Worksnaps' own parameter names. Outputs are `.loose()` and their
// documented fields nullish.
// Reference: https://api.worksnaps.com/api_docs/ (the Swagger file is at
// /api_docs/worksnaps.json).
//
// The API is XML over HTTP, so the plugin parses every response and coerces
// the values Rails-style: `type="integer"` and `type="float"` arrive as strings
// from the parser and are turned into numbers here.

/** A number the XML parser left as a string. */
const NumericString = z
	.union([z.number(), z.string()])
	.transform((value) =>
		typeof value === 'number' ? value : Number.parseFloat(value),
	)
	.refine((value) => Number.isFinite(value), 'Expected a number');

/** A boolean Rails writes as `true`/`false`, or as 1/0 in a flag column. */
const FlagString = z
	.union([z.boolean(), z.string(), z.number()])
	.transform((value) => {
		if (typeof value === 'boolean') return value;
		if (typeof value === 'number') return value !== 0;
		return value === 'true' || value === '1';
	});

const ProjectSchema = z
	.object({
		id: NumericString.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		// open string: `active` or `archived` today.
		status: z.string().nullish(),
	})
	.loose();

export type WorksnapsProject = z.infer<typeof ProjectSchema>;

const TaskSchema = z
	.object({
		id: NumericString.nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		project_id: NumericString.nullish(),
	})
	.loose();

export type WorksnapsTask = z.infer<typeof TaskSchema>;

/**
 * A time entry is a logged stretch of work. `duration_in_minutes` is what the
 * reports total; `from_timestamp` is when it started.
 */
const TimeEntrySchema = z
	.object({
		id: NumericString.nullish(),
		task_id: NumericString.nullish(),
		user_id: NumericString.nullish(),
		project_id: NumericString.nullish(),
		user_comment: z.string().nullish(),
		// Unix seconds, as a string.
		from_timestamp: z.string().nullish(),
		logged_timestamp: z.string().nullish(),
		duration_in_minutes: NumericString.nullish(),
		// open string: `online` or `offline` today.
		type: z.string().nullish(),
		task_name: z.string().nullish(),
	})
	.loose();

export type WorksnapsTimeEntry = z.infer<typeof TimeEntrySchema>;

const UserSchema = z
	.object({
		id: NumericString.nullish(),
		login: z.string().nullish(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		email: z.string().nullish(),
		timezone_id: NumericString.nullish(),
	})
	.loose();

export type WorksnapsUser = z.infer<typeof UserSchema>;

const TaskAssignmentSchema = z
	.object({
		id: NumericString.nullish(),
		user_id: NumericString.nullish(),
		task_id: NumericString.nullish(),
	})
	.loose();

export type WorksnapsTaskAssignment = z.infer<typeof TaskAssignmentSchema>;

/**
 * A user's membership of a project, with the permissions that apply there —
 * `role`, the hourly rate, and the windows that govern time logging.
 */
const UserAssignmentSchema = z
	.object({
		id: NumericString.nullish(),
		user_id: NumericString.nullish(),
		project_id: NumericString.nullish(),
		role: z.string().nullish(),
		hourly_rate: NumericString.nullish(),
		flag_allow_logging_time: FlagString.nullish(),
		window_for_deleting_time: NumericString.nullish(),
		window_for_adding_offline_time: NumericString.nullish(),
	})
	.loose();

export type WorksnapsUserAssignment = z.infer<typeof UserAssignmentSchema>;

/** The account behind the token. The document roots at `<user>`. */
const MeResponseSchema = z
	.object({
		user: z
			.object({
				id: NumericString.nullish(),
				login: z.string().nullish(),
				first_name: z.string().nullish(),
				last_name: z.string().nullish(),
				email: z.string().nullish(),
				timezone_id: NumericString.nullish(),
			})
			.loose(),
	})
	.loose();

export type MeResponse = z.infer<typeof MeResponseSchema>;

/**
 * Rails writes a collection as an element whose children share a name, so
 * `<projects><project>…</project></projects>` becomes `{ projects: [...] }`
 * once the root name is kept. An empty collection arrives as an empty
 * element, so that is accepted too.
 */
function collection<T extends z.ZodType>(item: T) {
	// The live API writes an empty collection as a bare `<projects/>`, with no
	// type attribute, which the parser reads as an empty string.
	return z
		.union([z.array(item), z.object({}).loose(), z.literal('')])
		.transform((value) => {
			if (value === '') return [];
			if (Array.isArray(value)) return value;
			// unknown: an empty or single-child object, read for its array.
			const first = Object.values(value).find((entry) => Array.isArray(entry));
			return Array.isArray(first) ? first : [];
		});
}

// ── projects ──────────────────────────────────────────────────────────────

const ProjectsListInputSchema = z.object({
	include_user_assignment: z
		.boolean()
		.optional()
		.describe(
			'Also return each project user assignments, which are its members.',
		),
});

export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;

const ProjectsListResponseSchema = z.object({
	// Rails names the wrapper after the resource, and the parser keeps it.
	projects: collection(ProjectSchema),
});

export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

const ProjectsGetInputSchema = z.object({ project_id: z.number().int() });

export type ProjectsGetInput = z.infer<typeof ProjectsGetInputSchema>;

const ProjectResponseSchema = z.object({
	project: ProjectSchema,
});

export type ProjectResponse = z.infer<typeof ProjectResponseSchema>;

const ProjectsCreateInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
});

export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;

const ProjectsUpdateInputSchema = z
	.object({
		project_id: z.number().int(),
		name: z.string().min(1).optional(),
		description: z.string().optional(),
	})
	.refine(
		(input) => input.name !== undefined || input.description !== undefined,
		'Give a name or a description to change.',
	);

export type ProjectsUpdateInput = z.infer<typeof ProjectsUpdateInputSchema>;

const ProjectsDeleteInputSchema = z.object({ project_id: z.number().int() });

export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;

/** A delete answers 200 with an empty body, so the plugin states what it did. */
const DeleteResponseSchema = z.object({
	id: z.number(),
	deleted: z.literal(true),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

// ── tasks ─────────────────────────────────────────────────────────────────

const TasksListInputSchema = z.object({ project_id: z.number().int() });

export type TasksListInput = z.infer<typeof TasksListInputSchema>;

const TasksListResponseSchema = z.object({
	tasks: collection(TaskSchema),
});

export type TasksListResponse = z.infer<typeof TasksListResponseSchema>;

const TasksGetInputSchema = z.object({
	project_id: z.number().int(),
	task_id: z.number().int(),
});

export type TasksGetInput = z.infer<typeof TasksGetInputSchema>;

const TaskResponseSchema = z.object({ task: TaskSchema });

export type TaskResponse = z.infer<typeof TaskResponseSchema>;

const TasksCreateInputSchema = z.object({
	project_id: z.number().int(),
	name: z.string().min(1),
	description: z.string().optional(),
});

export type TasksCreateInput = z.infer<typeof TasksCreateInputSchema>;

const TasksUpdateInputSchema = z
	.object({
		project_id: z.number().int(),
		task_id: z.number().int(),
		name: z.string().min(1).optional(),
		description: z.string().optional(),
	})
	.refine(
		(input) => input.name !== undefined || input.description !== undefined,
		'Give a name or a description to change.',
	);

export type TasksUpdateInput = z.infer<typeof TasksUpdateInputSchema>;

const TasksDeleteInputSchema = z.object({
	project_id: z.number().int(),
	task_id: z.number().int(),
});

export type TasksDeleteInput = z.infer<typeof TasksDeleteInputSchema>;

// ── time entries ──────────────────────────────────────────────────────────

/** Unix seconds; the API only accepts values on a 10-minute boundary. */
const UnixTimestamp = z.number().int().positive().multipleOf(600);

/** Ids the API takes as one semicolon-separated query value. */
const IdList = z.array(z.number().int()).min(1);

const TimeRange = {
	from_timestamp: UnixTimestamp.describe(
		'Start of the range in Unix seconds, on a 10-minute boundary (a multiple of 600).',
	),
	to_timestamp: UnixTimestamp.describe(
		'End of the range in Unix seconds, on a 10-minute boundary.',
	),
};

const TimeEntriesListInputSchema = z.object({
	project_id: z.number().int(),
	user_ids: IdList.describe(
		'The users whose time to list; the API requires at least one.',
	),
	...TimeRange,
});

export type TimeEntriesListInput = z.infer<typeof TimeEntriesListInputSchema>;

const TimeEntriesListResponseSchema = z.object({
	time_entries: collection(TimeEntrySchema),
});

export type TimeEntriesListResponse = z.infer<
	typeof TimeEntriesListResponseSchema
>;

const TimeEntriesByUserInputSchema = z.object({
	project_id: z.number().int(),
	user_id: z.number().int(),
	...TimeRange,
});

export type TimeEntriesByUserInput = z.infer<
	typeof TimeEntriesByUserInputSchema
>;

const TimeEntriesGetInputSchema = z.object({
	project_id: z.number().int(),
	time_entry_id: z.number().int(),
	full_resolution_url: z
		.boolean()
		.optional()
		.describe(
			'Return the full-resolution screenshot URLs rather than the thumbnails.',
		),
});

export type TimeEntriesGetInput = z.infer<typeof TimeEntriesGetInputSchema>;

const TimeEntryResponseSchema = z.object({
	time_entry: TimeEntrySchema,
});

/** A create or update answers with every 10-minute entry it touched. */
const TimeEntriesWriteResponseSchema = z.object({
	time_entries: collection(TimeEntrySchema),
});

export type TimeEntriesWriteResponse = z.infer<
	typeof TimeEntriesWriteResponseSchema
>;

export type TimeEntryResponse = z.infer<typeof TimeEntryResponseSchema>;

/**
 * Logs time. Worksnaps records it against a task, and `duration_in_minutes` is
 * what every report totals — so it is required rather than derived.
 */
const TimeEntriesCreateInputSchema = z.object({
	project_id: z.number().int(),
	task_id: z.number().int(),
	from_timestamp: UnixTimestamp.describe(
		'When the work started, in Unix seconds on a 10-minute boundary.',
	),
	duration_in_minutes: z
		.number()
		.int()
		.positive()
		.describe('Worksnaps splits the time into 10-minute entries.'),
	user_comment: z.string().optional(),
});

export type TimeEntriesCreateInput = z.infer<
	typeof TimeEntriesCreateInputSchema
>;

/**
 * The API only changes the task and the comment of an entry; a start or a
 * duration in the body is answered with a 400, so they are not accepted here.
 */
const TimeEntriesUpdateInputSchema = z
	.object({
		project_id: z.number().int(),
		time_entry_id: z.number().int(),
		task_id: z.number().int().optional(),
		user_comment: z.string().optional(),
	})
	.strict()
	.refine(
		(input) => input.task_id !== undefined || input.user_comment !== undefined,
		'Give a task_id or a user_comment to change.',
	);

export type TimeEntriesUpdateInput = z.infer<
	typeof TimeEntriesUpdateInputSchema
>;

const TimeEntriesDeleteInputSchema = z.object({
	project_id: z.number().int(),
	time_entry_id: z.number().int(),
});

export type TimeEntriesDeleteInput = z.infer<
	typeof TimeEntriesDeleteInputSchema
>;

// ── assignments ───────────────────────────────────────────────────────────

const TaskAssignmentsListInputSchema = z.object({
	project_id: z.number().int(),
});

export type TaskAssignmentsListInput = z.infer<
	typeof TaskAssignmentsListInputSchema
>;

const TaskAssignmentsListResponseSchema = z.object({
	task_assignments: collection(TaskAssignmentSchema),
});

export type TaskAssignmentsListResponse = z.infer<
	typeof TaskAssignmentsListResponseSchema
>;

const TaskAssignmentsCreateInputSchema = z.object({
	project_id: z.number().int(),
	task_id: z.number().int(),
	user_id: z.number().int(),
});

export type TaskAssignmentsCreateInput = z.infer<
	typeof TaskAssignmentsCreateInputSchema
>;

const TaskAssignmentResponseSchema = z.object({
	task_assignment: TaskAssignmentSchema,
});

export type TaskAssignmentResponse = z.infer<
	typeof TaskAssignmentResponseSchema
>;

const TaskAssignmentsDeleteInputSchema = z.object({
	project_id: z.number().int(),
	task_assignment_id: z.number().int(),
});

export type TaskAssignmentsDeleteInput = z.infer<
	typeof TaskAssignmentsDeleteInputSchema
>;

const UserAssignmentsListInputSchema = z.object({
	project_id: z.number().int(),
});

export type UserAssignmentsListInput = z.infer<
	typeof UserAssignmentsListInputSchema
>;

const UserAssignmentsListResponseSchema = z.object({
	user_assignments: collection(UserAssignmentSchema),
});

export type UserAssignmentsListResponse = z.infer<
	typeof UserAssignmentsListResponseSchema
>;

const UserAssignmentsGetInputSchema = z.object({
	project_id: z.number().int(),
	user_assignment_id: z.number().int(),
});

export type UserAssignmentsGetInput = z.infer<
	typeof UserAssignmentsGetInputSchema
>;

const UserAssignmentResponseSchema = z.object({
	user_assignment: UserAssignmentSchema,
});

export type UserAssignmentResponse = z.infer<
	typeof UserAssignmentResponseSchema
>;

/** Adds a member to a project, with the permissions that apply there. */
const UserAssignmentsCreateInputSchema = z.object({
	project_id: z.number().int(),
	user_id: z.number().int(),
	role: z
		.string()
		.optional()
		.describe('The member role in this project, such as member or manager.'),
	hourly_rate: z.number().optional(),
	flag_allow_logging_time: z.boolean().optional(),
	window_for_deleting_time: z.number().int().optional(),
	window_for_adding_offline_time: z.number().int().optional(),
});

export type UserAssignmentsCreateInput = z.infer<
	typeof UserAssignmentsCreateInputSchema
>;

const UserAssignmentsUpdateInputSchema = UserAssignmentsCreateInputSchema.omit({
	project_id: true,
	user_id: true,
}).extend({
	project_id: z.number().int(),
	user_assignment_id: z.number().int(),
});

export type UserAssignmentsUpdateInput = z.infer<
	typeof UserAssignmentsUpdateInputSchema
>;

// ── users and reports ─────────────────────────────────────────────────────

const UsersListInputSchema = z.object({});

export type UsersListInput = z.infer<typeof UsersListInputSchema>;

const UsersListResponseSchema = z.object({
	users: collection(UserSchema),
});

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

const UsersGetInputSchema = z.object({ user_id: z.number().int() });

export type UsersGetInput = z.infer<typeof UsersGetInputSchema>;

const UserResponseSchema = z.object({ user: UserSchema });

export type UserResponse = z.infer<typeof UserResponseSchema>;

/**
 * Creates a user. The docs call this a **privileged operation**: it needs the
 * partner token rather than an ordinary user's, so a 403 here is expected for a
 * normal key.
 */
const UsersCreateInputSchema = z.object({
	login: z.string().min(1),
	email: z.string().min(1),
	first_name: z.string().min(1),
	last_name: z.string().min(1),
	password: z.string().min(1),
	timezone_id: z.number().int().optional(),
});

export type UsersCreateInput = z.infer<typeof UsersCreateInputSchema>;

const UsersUpdateInputSchema = z.object({
	user_id: z.number().int(),
	email: z.string().min(1).optional(),
	first_name: z.string().min(1).optional(),
	last_name: z.string().min(1).optional(),
	timezone_id: z.number().int().optional(),
});

export type UsersUpdateInput = z.infer<typeof UsersUpdateInputSchema>;

const MeInputSchema = z.object({});

export type MeInput = z.infer<typeof MeInputSchema>;

/** The project report: time per user and task over at most 30 days. */
const ProjectReportInputSchema = z.object({
	project_id: z.number().int(),
	name: z
		.enum(['time_summary', 'time_entries'])
		.optional()
		.describe(
			'time_summary (the default) totals time per user and task; time_entries lists each entry.',
		),
	user_ids: IdList.describe('The users to report on.'),
	...TimeRange,
});

export type ProjectReportInput = z.infer<typeof ProjectReportInputSchema>;

/** One row of a time summary. */
const TimeSummaryLineSchema = z
	.object({
		project_id: NumericString.nullish(),
		user_id: NumericString.nullish(),
		task_id: NumericString.nullish(),
		task_name: z.string().nullish(),
		user_comment: z.string().nullish(),
		// open string: `online` or `offline` today.
		time_entry_type: z.string().nullish(),
		duration_in_minutes: NumericString.nullish(),
	})
	.loose();

/**
 * The root is named after the report: `<time_summary>` or `<time_entries>`.
 */
const ProjectReportResponseSchema = z
	.object({
		time_summary: collection(TimeSummaryLineSchema).optional(),
		time_entries: collection(TimeEntrySchema).optional(),
	})
	.refine(
		(report) =>
			report.time_summary !== undefined || report.time_entries !== undefined,
		'Expected a <time_summary> or <time_entries> report.',
	);

export type ProjectReportResponse = z.infer<typeof ProjectReportResponseSchema>;

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD.');

/** The manager report: time in the projects you manage, at most 30 days. */
const SummaryReportInputSchema = z.object({
	from_date: IsoDate.describe('First day, YYYY-MM-DD.'),
	to_date: IsoDate.describe(
		'Last day, YYYY-MM-DD; at most 30 days after from_date.',
	),
	timezone_offset: z
		.number()
		.optional()
		.describe(
			'Hours from UTC for the day boundaries, e.g. -8 or 5.5; defaults to the user timezone.',
		),
	project_ids: IdList.optional().describe(
		'Defaults to every project you manage.',
	),
	user_ids: IdList.optional().describe(
		'Defaults to every user in those projects.',
	),
});

export type SummaryReportInput = z.infer<typeof SummaryReportInputSchema>;

/** One row of the manager report: a user, project, task, day and type. */
const ManagerReportLineSchema = z
	.object({
		user_id: NumericString.nullish(),
		user_name: z.string().nullish(),
		project_id: NumericString.nullish(),
		project_name: z.string().nullish(),
		date: z.string().nullish(),
		task_id: NumericString.nullish(),
		task_name: z.string().nullish(),
		// open string: `online` or `offline` today.
		type: z.string().nullish(),
		duration_in_minutes: NumericString.nullish(),
	})
	.loose();

const SummaryReportResponseSchema = z.object({
	manager_report: collection(ManagerReportLineSchema),
});

export type SummaryReportResponse = z.infer<typeof SummaryReportResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type WorksnapsEndpointInputs = {
	projectsList: ProjectsListInput;
	projectsGet: ProjectsGetInput;
	projectsCreate: ProjectsCreateInput;
	projectsUpdate: ProjectsUpdateInput;
	projectsDelete: ProjectsDeleteInput;
	tasksList: TasksListInput;
	tasksGet: TasksGetInput;
	tasksCreate: TasksCreateInput;
	tasksUpdate: TasksUpdateInput;
	tasksDelete: TasksDeleteInput;
	timeEntriesList: TimeEntriesListInput;
	timeEntriesByUser: TimeEntriesByUserInput;
	timeEntriesGet: TimeEntriesGetInput;
	timeEntriesCreate: TimeEntriesCreateInput;
	timeEntriesUpdate: TimeEntriesUpdateInput;
	timeEntriesDelete: TimeEntriesDeleteInput;
	taskAssignmentsList: TaskAssignmentsListInput;
	taskAssignmentsCreate: TaskAssignmentsCreateInput;
	taskAssignmentsDelete: TaskAssignmentsDeleteInput;
	userAssignmentsList: UserAssignmentsListInput;
	userAssignmentsGet: UserAssignmentsGetInput;
	userAssignmentsCreate: UserAssignmentsCreateInput;
	userAssignmentsUpdate: UserAssignmentsUpdateInput;
	usersList: UsersListInput;
	usersGet: UsersGetInput;
	usersCreate: UsersCreateInput;
	usersUpdate: UsersUpdateInput;
	meGet: MeInput;
	projectReport: ProjectReportInput;
	summaryReport: SummaryReportInput;
};

export type WorksnapsEndpointOutputs = {
	projectsList: ProjectsListResponse;
	projectsGet: ProjectResponse;
	projectsCreate: ProjectResponse;
	projectsUpdate: ProjectResponse;
	projectsDelete: DeleteResponse;
	tasksList: TasksListResponse;
	tasksGet: TaskResponse;
	tasksCreate: TaskResponse;
	tasksUpdate: TaskResponse;
	tasksDelete: DeleteResponse;
	timeEntriesList: TimeEntriesListResponse;
	timeEntriesByUser: TimeEntriesListResponse;
	timeEntriesGet: TimeEntryResponse;
	timeEntriesCreate: TimeEntriesWriteResponse;
	timeEntriesUpdate: TimeEntriesWriteResponse;
	timeEntriesDelete: DeleteResponse;
	taskAssignmentsList: TaskAssignmentsListResponse;
	taskAssignmentsCreate: TaskAssignmentResponse;
	taskAssignmentsDelete: DeleteResponse;
	userAssignmentsList: UserAssignmentsListResponse;
	userAssignmentsGet: UserAssignmentResponse;
	userAssignmentsCreate: UserAssignmentResponse;
	userAssignmentsUpdate: UserAssignmentResponse;
	usersList: UsersListResponse;
	usersGet: UserResponse;
	usersCreate: UserResponse;
	usersUpdate: UserResponse;
	meGet: MeResponse;
	projectReport: ProjectReportResponse;
	summaryReport: SummaryReportResponse;
};

export const WorksnapsEndpointInputSchemas = {
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsUpdate: ProjectsUpdateInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	tasksList: TasksListInputSchema,
	tasksGet: TasksGetInputSchema,
	tasksCreate: TasksCreateInputSchema,
	tasksUpdate: TasksUpdateInputSchema,
	tasksDelete: TasksDeleteInputSchema,
	timeEntriesList: TimeEntriesListInputSchema,
	timeEntriesByUser: TimeEntriesByUserInputSchema,
	timeEntriesGet: TimeEntriesGetInputSchema,
	timeEntriesCreate: TimeEntriesCreateInputSchema,
	timeEntriesUpdate: TimeEntriesUpdateInputSchema,
	timeEntriesDelete: TimeEntriesDeleteInputSchema,
	taskAssignmentsList: TaskAssignmentsListInputSchema,
	taskAssignmentsCreate: TaskAssignmentsCreateInputSchema,
	taskAssignmentsDelete: TaskAssignmentsDeleteInputSchema,
	userAssignmentsList: UserAssignmentsListInputSchema,
	userAssignmentsGet: UserAssignmentsGetInputSchema,
	userAssignmentsCreate: UserAssignmentsCreateInputSchema,
	userAssignmentsUpdate: UserAssignmentsUpdateInputSchema,
	usersList: UsersListInputSchema,
	usersGet: UsersGetInputSchema,
	usersCreate: UsersCreateInputSchema,
	usersUpdate: UsersUpdateInputSchema,
	meGet: MeInputSchema,
	projectReport: ProjectReportInputSchema,
	summaryReport: SummaryReportInputSchema,
} as const;

export const WorksnapsEndpointOutputSchemas = {
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectResponseSchema,
	projectsCreate: ProjectResponseSchema,
	projectsUpdate: ProjectResponseSchema,
	projectsDelete: DeleteResponseSchema,
	tasksList: TasksListResponseSchema,
	tasksGet: TaskResponseSchema,
	tasksCreate: TaskResponseSchema,
	tasksUpdate: TaskResponseSchema,
	tasksDelete: DeleteResponseSchema,
	timeEntriesList: TimeEntriesListResponseSchema,
	timeEntriesByUser: TimeEntriesListResponseSchema,
	timeEntriesGet: TimeEntryResponseSchema,
	timeEntriesCreate: TimeEntriesWriteResponseSchema,
	timeEntriesUpdate: TimeEntriesWriteResponseSchema,
	timeEntriesDelete: DeleteResponseSchema,
	taskAssignmentsList: TaskAssignmentsListResponseSchema,
	taskAssignmentsCreate: TaskAssignmentResponseSchema,
	taskAssignmentsDelete: DeleteResponseSchema,
	userAssignmentsList: UserAssignmentsListResponseSchema,
	userAssignmentsGet: UserAssignmentResponseSchema,
	userAssignmentsCreate: UserAssignmentResponseSchema,
	userAssignmentsUpdate: UserAssignmentResponseSchema,
	usersList: UsersListResponseSchema,
	usersGet: UserResponseSchema,
	usersCreate: UserResponseSchema,
	usersUpdate: UserResponseSchema,
	meGet: MeResponseSchema,
	projectReport: ProjectReportResponseSchema,
	summaryReport: SummaryReportResponseSchema,
} as const;
