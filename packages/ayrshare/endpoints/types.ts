import { z } from 'zod';
import {
	AyrshareAutoSchedule,
	AyrsharePost,
	AyrshareScheduleTime,
} from '../schema/database';

const ScheduleTimeInput = AyrshareScheduleTime.describe(
	'UTC ISO-8601 time, such as 13:05Z',
);

/**
 * POST /api/auto-schedule/set
 * Official: https://www.ayrshare.com/docs/apis/auto-schedule/set-schedule
 *
 * `schedule` is required unless `setStartDate` is provided. An empty schedule
 * array does not count.
 */
const SetAutoScheduleInputSchema = z
	.object({
		schedule: z
			.array(ScheduleTimeInput)
			.optional()
			.describe('UTC times; required unless setStartDate is provided'),
		title: z
			.string()
			.min(1)
			.optional()
			.describe(
				'Case-sensitive schedule name and join key for publish autoSchedule.title',
			),
		setStartDate: z
			.string()
			.optional()
			.describe('ISO-8601 UTC date-time to begin the schedule'),
		daysOfWeek: z
			.array(z.number().int().min(0).max(6))
			.optional()
			.describe('Weekdays as 0-6, Sunday through Saturday'),
		excludeDates: z
			.array(z.string())
			.optional()
			.describe('UTC dates excluded from future auto-scheduling'),
	})
	.refine(
		(value) =>
			(value.schedule !== undefined && value.schedule.length > 0) ||
			value.setStartDate !== undefined,
		{ message: 'Provide a non-empty schedule or setStartDate' },
	);

/**
 * Live SET 2026-08-13 also returned `schedule`, `daysOfWeek`, `excludeDates`
 * (docs example only lists status, message, title).
 */
const SetAutoScheduleResponseSchema = z
	.object({
		status: z.string(),
		message: z.string().optional(),
		title: z.string(),
		schedule: z.array(AyrshareScheduleTime).optional(),
		daysOfWeek: z.array(z.number().int()).optional(),
		excludeDates: z.array(z.string()).optional(),
	})
	.loose();

/**
 * DELETE /api/post
 * Official: https://www.ayrshare.com/docs/apis/post/delete-post
 *
 * `bulk` and `deleteAllScheduled` exist on the API; this plugin only exposes
 * delete-by-id (and markManualDeleted) matching the four-operation catalog.
 */
const DeletePostInputSchema = z.object({
	id: z.string().min(1).describe('Ayrshare top-level Post ID'),
	markManualDeleted: z
		.boolean()
		.optional()
		.describe(
			'Mark deleted in Ayrshare without deleting on the network. Instagram and TikTok published posts cannot be deleted via API.',
		),
});

/**
 * Success is either per-network results plus `status`, or
 * `{ status, id }` when `markManualDeleted` was used.
 * Live unknown id 2026-08-13 returned HTTP 404, not this schema.
 */
const DeletePostResponseSchema = z
	.object({
		status: z.string(),
		id: z.string().optional(),
	})
	.loose();

const HistoryStatusSchema = z.enum([
	'success',
	'error',
	'processing',
	'pending',
	'paused',
	'deleted',
	'awaiting approval',
]);

const HistoryTypeSchema = z.enum(['immediate', 'scheduled']);

/**
 * GET /api/history
 * Official: https://www.ayrshare.com/docs/apis/history/get-history
 */
const GetPostHistoryInputSchema = z.object({
	limit: z
		.number()
		.int()
		.min(1)
		.max(1000)
		.optional()
		.describe('Number of recent posts. Default 25, max 1000.'),
	lastDays: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe(
			'Last n days by publish date. Default 30. 0 returns the full history (up to limit). Ignored when startDate and endDate are set.',
		),
	startDate: z.string().optional().describe('ISO-8601 start date (inclusive)'),
	endDate: z.string().optional().describe('ISO-8601 end date (inclusive)'),
	status: HistoryStatusSchema.optional().describe(
		'Filter by post status. Deleted posts are only returned with status=deleted.',
	),
	platforms: z
		.array(z.string())
		.optional()
		.describe('Filter by network; OR logic. Example: facebook, instagram.'),
	type: HistoryTypeSchema.optional().describe(
		'immediate posts vs scheduled posts',
	),
});

const GetPostHistoryResponseSchema = z
	.object({
		history: z.array(AyrsharePost),
		count: z.number().optional(),
		refId: z.string().optional(),
		lastUpdated: z.string().optional(),
		nextUpdate: z.string().optional(),
	})
	.loose();

const ListAutoSchedulesResponseSchema = z
	.object({
		status: z.string(),
		schedules: z.record(z.string(), AyrshareAutoSchedule.omit({ title: true })),
	})
	.loose();

export type SetAutoScheduleInput = z.infer<typeof SetAutoScheduleInputSchema>;
export type SetAutoScheduleResponse = z.infer<
	typeof SetAutoScheduleResponseSchema
>;
export type DeletePostInput = z.infer<typeof DeletePostInputSchema>;
export type DeletePostResponse = z.infer<typeof DeletePostResponseSchema>;
export type GetPostHistoryInput = z.infer<typeof GetPostHistoryInputSchema>;
export type GetPostHistoryResponse = z.infer<
	typeof GetPostHistoryResponseSchema
>;
export type ListAutoSchedulesResponse = z.infer<
	typeof ListAutoSchedulesResponseSchema
>;

export type AyrshareEndpointInputs = {
	setAutoSchedule: SetAutoScheduleInput;
	deletePost: DeletePostInput;
	getPostHistory: GetPostHistoryInput;
	listAutoSchedules: Record<string, never>;
};

export type AyrshareEndpointOutputs = {
	setAutoSchedule: SetAutoScheduleResponse;
	deletePost: DeletePostResponse;
	getPostHistory: GetPostHistoryResponse;
	listAutoSchedules: ListAutoSchedulesResponse;
};

export const AyrshareEndpointInputSchemas = {
	setAutoSchedule: SetAutoScheduleInputSchema,
	deletePost: DeletePostInputSchema,
	getPostHistory: GetPostHistoryInputSchema,
	listAutoSchedules: z.object({}),
} as const;

export const AyrshareEndpointOutputSchemas = {
	setAutoSchedule: SetAutoScheduleResponseSchema,
	deletePost: DeletePostResponseSchema,
	getPostHistory: GetPostHistoryResponseSchema,
	listAutoSchedules: ListAutoSchedulesResponseSchema,
} as const;
