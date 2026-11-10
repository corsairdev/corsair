import { z } from 'zod';

// Mixmax tasks (developer.mixmax.com/reference, Tasks section). Field names,
// types, and limits mirror the official TaskSequence, Task and
// TaskListResponse schemas.

// Sequence context when the task was created by a sequence.
export const TaskSequenceSchema = z.object({
	// Identifier of the sequence that created the task.
	id: z.string().optional(),
	// Display name of the sequence.
	name: z.string().optional(),
	// Identifier of the sequence stage that created the task.
	stage: z.string().optional(),
});

export type TaskSequence = z.infer<typeof TaskSequenceSchema>;

// One Mixmax task. Matches the official Task schema: `_id`, `type` and
// `status` are required and the object declares additionalProperties true,
// so it stays passthrough — the available fields vary by task type.
export const TaskSchema = z
	.object({
		// Mixmax task identifier.
		_id: z.string(),
		// `email`, `call`, `linkedin` or `todo` today; a plain string on
		// output so a task type Mixmax adds later does not fail the whole list.
		type: z.string(),
		subject: z.string().optional(),
		description: z.string().optional(),
		status: z.string(),
		isCompleted: z.boolean().optional(),
		// ISO 8601 date-time string.
		due: z.string().optional(),
		priority: z.string().optional(),
		// The assignee as either a Mixmax user id or a decorated user object.
		assignee: z
			.union([
				z.string(),
				z
					.object({
						id: z.string().optional(),
						name: z.string().optional(),
						email: z.string().optional(),
					})
					.passthrough(),
			])
			.optional(),
		phoneTo: z.string().nullable().optional(),
		// Present when the task was created by a sequence.
		sequence: TaskSequenceSchema.optional(),
	})
	.passthrough();

export type Task = z.infer<typeof TaskSchema>;

export const TasksListInputSchema = z.object({
	// Saved-search context. Use `all` when supplying a custom task query.
	search: z.string().optional(),
	// Task filter and sort expression, for example
	// `type:email assignee:Myself status:open sortBy:due sortDir:asc`.
	query: z.string().optional(),
	// Maximum number of tasks to return in one page, 1 to 500.
	limit: z.coerce.number().int().min(1).max(500).optional(),
	// Opaque cursor from a previous response to fetch the next page.
	next: z.string().optional(),
	// Opaque cursor from a previous response to fetch the previous page.
	previous: z.string().optional(),
	// IANA timezone used when evaluating task due dates.
	tz: z.string().optional(),
});

export type TasksListInput = z.infer<typeof TasksListInputSchema>;

// GET /v1/tasks answer, matching the official TaskListResponse: `total`,
// both cursors and both flags are required, with the cursors `null` when
// there is no adjacent page.
export const TasksListOutputSchema = z.object({
	results: z.array(TaskSchema),
	// Total number of tasks matching the requested filters.
	total: z.number().int(),
	next: z.string().nullable(),
	previous: z.string().nullable(),
	hasNext: z.boolean(),
	hasPrevious: z.boolean(),
});

export type TasksListOutput = z.infer<typeof TasksListOutputSchema>;
