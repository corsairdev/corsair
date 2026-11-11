import { z } from 'zod';

// Field reference: https://help.desktime.com/hc/en-us/articles/25494558790685
//
// The live API, not the docs, settles three things:
//   - Field names are mixed case: `groupId` and `onlineTime` are camelCase while
//     `work_starts` and `notes` are snake_case. Output keeps the names exactly
//     as sent, the same way other plugins pass provider fields through.
//   - `arrived`, `left`, `work_starts` and `work_ends` are timestamps once set
//     and the boolean `false` before, so they are a union rather than the
//     string the examples show.
//   - An invalid `date` or `period` is ignored and silently falls back to today.
//     The API never reports the mistake, so both are validated here.

/**
 * A day in YYYY-MM-DD form that also exists on the calendar. DeskTime ignores
 * an invalid date and answers with today's data instead, so a malformed value
 * would be a silent wrong result rather than an error.
 */
const DateSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
	.refine((value) => {
		const [year, month, day] = value.split('-').map(Number) as [
			number,
			number,
			number,
		];
		const date = new Date(Date.UTC(year, month - 1, day));
		return (
			date.getUTCFullYear() === year &&
			date.getUTCMonth() === month - 1 &&
			date.getUTCDate() === day
		);
	}, 'Use a real calendar date')
	.describe('A day in YYYY-MM-DD form.');

const PERIODS = ['day', 'week', 'month'] as const;

const PeriodSchema = z
	.enum(PERIODS)
	.describe(
		'The window to return, starting at `date` or today. `day` returns one bucket, `week` seven, `month` the calendar month.',
	);

/** A timestamp, or the boolean false when the event has not happened. */
const TimestampSchema = z
	.union([z.string(), z.literal(false)])
	.nullish()
	.describe('A timestamp, or `false` when it has not happened yet.');

/** `notes` is empty in practice, and its row shape is undocumented. */
// A record already accepts unknown keys, so it needs no `.loose()`.
// unknown: no filled row was ever captured and the reference shows none, so a
// row's values are not narrowed. A numeric id in a note must not fail the read.
const NoteSchema = z.record(z.string(), z.unknown());

const ActiveProjectRowSchema = z
	.object({
		project: z.string().nullish(),
		task: z.string().nullish(),
	})
	.loose();

/**
 * `activeProject` was only ever captured as the empty array, on an account
 * with nothing running, and the reference's example stops before it. A PHP
 * backend sends an empty map as `[]` and a filled one as an object, so a
 * running project may arrive as one bare object rather than a list. Both
 * parse: `employees.list` returns every employee in one response, and one
 * person's running timer must not fail the whole call.
 */
const ActiveProjectSchema = z.union([
	z.array(ActiveProjectRowSchema),
	ActiveProjectRowSchema,
]);

export const EmployeeSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		groupId: z.number().nullish(),
		group: z.string().nullish(),
		profileUrl: z.string().nullish(),
		isOnline: z.boolean().nullish(),
		arrived: TimestampSchema,
		left: TimestampSchema,
		late: z.boolean().nullish(),
		onlineTime: z.number().nullish(),
		offlineTime: z.number().nullish(),
		desktimeTime: z.number().nullish(),
		atWorkTime: z.number().nullish(),
		afterWorkTime: z.number().nullish(),
		beforeWorkTime: z.number().nullish(),
		productiveTime: z.number().nullish(),
		productivity: z.number().nullish(),
		efficiency: z.number().nullish(),
		work_starts: TimestampSchema,
		work_ends: TimestampSchema,
		notes: z.array(NoteSchema).nullish(),
		timezone: z.string().nullish(),
		activeProject: ActiveProjectSchema.nullish(),
	})
	.loose();

export type DeskTimeEmployee = z.infer<typeof EmployeeSchema>;

// ── ping ──────────────────────────────────────────────────────────────────

const PingInputSchema = z.object({});

export type PingInput = z.input<typeof PingInputSchema>;

const PingResponseSchema = z
	.object({
		pong: z.string(),
		// The envelope key is literally `__request_time`.
		__request_time: z.string().nullish(),
	})
	.loose();

export type PingResponse = z.infer<typeof PingResponseSchema>;

// ── company ───────────────────────────────────────────────────────────────

const CompanyInputSchema = z.object({});

export type CompanyInput = z.input<typeof CompanyInputSchema>;

const CompanyResponseSchema = z
	.object({
		name: z.string().nullish(),
		work_starts: z.string().nullish(),
		work_ends: z.string().nullish(),
		// The live API sends this as a string of seconds.
		work_duration: z.union([z.string(), z.number()]).nullish(),
		working_days: z.number().nullish(),
		work_start_tracking: z.string().nullish(),
		work_stop_tracking: z.string().nullish(),
		timezone_identifier: z.string().nullish(),
		__request_time: z.string().nullish(),
	})
	.loose();

export type CompanyResponse = z.infer<typeof CompanyResponseSchema>;

// ── employees ─────────────────────────────────────────────────────────────

const EmployeesInputSchema = z.object({
	date: DateSchema.optional(),
	period: PeriodSchema.optional(),
});

export type EmployeesInput = z.input<typeof EmployeesInputSchema>;

/**
 * The response nests by date, then by employee id, so a week or month request
 * returns several buckets. Both levels are keyed objects, not arrays.
 *
 * `buckets` is a flattened view, newest date first, built before parsing so the
 * schema below can describe it. A `.transform()` would hide the field from the
 * docs generator, which reads the input side of a transform.
 *
 * `value` is loosely typed because a test may hand it a deliberately malformed
 * body; the output schema is what rejects that, which is the point of the test.
 */
export function withBuckets(value: unknown): {
	buckets: { date: string; employees: unknown[] }[];
} & Record<string, unknown> {
	const employees = (
		value as { employees?: Record<string, Record<string, unknown>> }
	).employees;
	return {
		...(value as Record<string, unknown>),
		buckets: Object.entries(employees ?? {})
			.sort(([a], [b]) => b.localeCompare(a))
			.map(([date, byId]) => ({
				date,
				employees: Object.values(byId),
			})),
	};
}

const EmployeesResponseSchema = z
	.object({
		employees: z.record(z.string(), z.record(z.string(), EmployeeSchema)),
		buckets: z
			.array(
				z.object({
					date: z.string(),
					employees: z.array(EmployeeSchema),
				}),
			)
			.describe(
				'The same employees flattened out of the two-level map, newest date first, with the date kept on each entry so a multi-day response stays unambiguous.',
			),
		__request_time: z.string().nullish(),
	})
	.loose();

export type EmployeesResponse = z.infer<typeof EmployeesResponseSchema>;

// ── employee/basic, employee/apps, employee/projects ──────────────────────

const EmployeeInputSchema = z.object({
	id: z
		.number()
		.int()
		.positive()
		.optional()
		.describe(
			'The employee to read. Omit it to read the key owner, which is the account the API key belongs to.',
		),
	date: DateSchema.optional(),
});

export type EmployeeInput = z.input<typeof EmployeeInputSchema>;

/** `employee/basic` answers a bare employee object with no envelope. */
const EmployeeBasicResponseSchema = EmployeeSchema;

export type EmployeeBasicResponse = z.infer<typeof EmployeeBasicResponseSchema>;

export type EmployeeBasicInput = z.input<typeof EmployeeInputSchema>;

const TrackedAppSchema = z
	.object({
		app: z.string().nullish(),
		title: z.string().nullish(),
		time: z.number().nullish(),
	})
	.loose();

/**
 * `apps_by_productivity` relabels the provider's `-1`, `0` and `1` keys. It is
 * built before parsing so the schema can describe it; a `.transform()` would
 * hide the field from the docs generator, which reads a transform's input side.
 *
 * `value` is loosely typed because a test may hand it a deliberately malformed
 * body, which the output schema then rejects.
 */
export function withAppsByProductivity(
	value: unknown,
): Record<string, unknown> {
	const apps = (value as { apps?: Record<string, unknown[]> | null }).apps;
	return {
		...(value as Record<string, unknown>),
		apps_by_productivity: apps
			? {
					unrated: apps['-1'],
					neutral: apps['0'],
					productive: apps['1'],
				}
			: undefined,
	};
}

const EmployeeAppsResponseSchema = EmployeeSchema.extend({
	apps: z
		.record(z.string(), z.array(TrackedAppSchema))
		.nullish()
		.describe(
			'Tracked apps keyed by productivity class, where `-1` is unrated, `0` neutral and `1` productive.',
		),
	apps_by_productivity: z
		.object({
			unrated: z.array(TrackedAppSchema).optional(),
			neutral: z.array(TrackedAppSchema).optional(),
			productive: z.array(TrackedAppSchema).optional(),
		})
		.optional()
		.describe(
			'The same apps relabelled from the numeric productivity keys to `unrated`, `neutral` and `productive`.',
		),
}).loose();

export type EmployeeAppsResponse = z.infer<typeof EmployeeAppsResponseSchema>;

const TrackedProjectSchema = z
	.object({
		project: z.string().nullish(),
		task: z.string().nullish(),
		time: z.number().nullish(),
	})
	.loose();

const EmployeeProjectsResponseSchema = EmployeeSchema.extend({
	projects: z.array(TrackedProjectSchema).nullish(),
}).loose();

export type EmployeeProjectsResponse = z.infer<
	typeof EmployeeProjectsResponseSchema
>;

// ── projects ──────────────────────────────────────────────────────────────

const ProjectsInputSchema = z.object({});

export type ProjectsInput = z.input<typeof ProjectsInputSchema>;

// Unix seconds. The reference shows a string; a number is accepted too, the
// same way `work_duration` is.
const UnixSecondsSchema = z.union([z.string(), z.number()]).nullish();

const ProjectTaskSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		created_at: UnixSecondsSchema,
		created_at_iso: z.string().nullish(),
	})
	.loose();

// https://help.desktime.com/hc/en-us/articles/25495195415453
const ProjectSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		created_at: UnixSecondsSchema,
		created_at_iso: z.string().nullish(),
		tasks: z
			.array(ProjectTaskSchema)
			.nullish()
			.describe('The tasks that belong to the project.'),
	})
	.loose();

const ProjectsResponseSchema = z
	.object({
		projects: z.array(ProjectSchema),
		__request_time: z.string().nullish(),
	})
	.loose();

export type ProjectsResponse = z.infer<typeof ProjectsResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type DeskTimeEndpointInputs = {
	ping: PingInput;
	company: CompanyInput;
	employees: EmployeesInput;
	employeeBasic: EmployeeBasicInput;
	employeeApps: EmployeeInput;
	employeeProjects: EmployeeInput;
	projects: ProjectsInput;
};

export type DeskTimeEndpointOutputs = {
	ping: PingResponse;
	company: CompanyResponse;
	employees: EmployeesResponse;
	employeeBasic: EmployeeBasicResponse;
	employeeApps: EmployeeAppsResponse;
	employeeProjects: EmployeeProjectsResponse;
	projects: ProjectsResponse;
};

export const DeskTimeEndpointInputSchemas = {
	ping: PingInputSchema,
	company: CompanyInputSchema,
	employees: EmployeesInputSchema,
	employeeBasic: EmployeeInputSchema,
	employeeApps: EmployeeInputSchema,
	employeeProjects: EmployeeInputSchema,
	projects: ProjectsInputSchema,
} as const;

export const DeskTimeEndpointOutputSchemas = {
	ping: PingResponseSchema,
	company: CompanyResponseSchema,
	employees: EmployeesResponseSchema,
	employeeBasic: EmployeeBasicResponseSchema,
	employeeApps: EmployeeAppsResponseSchema,
	employeeProjects: EmployeeProjectsResponseSchema,
	projects: ProjectsResponseSchema,
} as const;
