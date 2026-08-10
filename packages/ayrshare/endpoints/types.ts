import { z } from 'zod';

const ScheduleTimeSchema = z.string().describe('UTC ISO-8601 time, such as 13:05Z');
const ScheduleSchema = z.object({
	title: z.string().describe('Case-sensitive schedule title used by publish autoSchedule.title'),
	schedule: z.array(ScheduleTimeSchema),
	daysOfWeek: z.array(z.number().int().min(0).max(6)).optional(),
	lastScheduleDate: z.string().optional(),
});

const SetAutoScheduleInputSchema = z.object({
	schedule: z.array(ScheduleTimeSchema).optional().describe('UTC times; required unless setStartDate is provided'),
	title: z.string().optional().default('default').describe('Case-sensitive schedule name and join key for publish autoSchedule.title'),
	setStartDate: z.string().optional().describe('ISO-8601 UTC date-time to begin the schedule'),
	daysOfWeek: z.array(z.number().int().min(0).max(6)).optional().describe('Weekdays as 0-6, Sunday through Saturday'),
	excludeDates: z.array(z.string()).optional().describe('UTC dates excluded from future auto-scheduling'),
});
const SetAutoScheduleResponseSchema = z.object({
	status: z.string(),
	message: z.string().optional(),
	title: z.string(),
});

const DeletePostInputSchema = z.object({
	id: z.string().describe('Ayrshare top-level Post ID'),
	markManualDeleted: z.boolean().optional().describe('For published Instagram/TikTok posts, mark deleted in Ayrshare without deleting on the platform'),
});
const PlatformDeleteResultSchema = z.object({
	action: z.string(),
	status: z.string(),
	id: z.string().optional(),
});
const DeletePostResponseSchema = z.object({
	twitter: PlatformDeleteResultSchema.optional(),
	facebook: PlatformDeleteResultSchema.optional(),
	instagram: PlatformDeleteResultSchema.optional(),
	tiktok: PlatformDeleteResultSchema.optional(),
	linkedin: PlatformDeleteResultSchema.optional(),
	youtube: PlatformDeleteResultSchema.optional(),
	pinterest: PlatformDeleteResultSchema.optional(),
	bluesky: PlatformDeleteResultSchema.optional(),
	gmb: PlatformDeleteResultSchema.optional(),
	reddit: PlatformDeleteResultSchema.optional(),
	snapchat: PlatformDeleteResultSchema.optional(),
	telegram: PlatformDeleteResultSchema.optional(),
	threads: PlatformDeleteResultSchema.optional(),
	status: z.string(),
});

const GetPostHistoryInputSchema = z.object({
	lastRecords: z.number().int().positive().optional().describe('Maximum number of recent records'),
	startDate: z.string().optional().describe('ISO-8601 start date'),
	endDate: z.string().optional().describe('ISO-8601 end date'),
	status: z.string().optional().describe('Filter such as success, pending, deleted, or error'),
});
const PostIdSchema = z.object({
	platform: z.string(),
	id: z.string(),
	status: z.string(),
	postUrl: z.string().optional(),
});
const HistoryEntrySchema = z.object({
	id: z.string(),
	post: z.string().optional(),
	platforms: z.array(z.string()).optional(),
	postIds: z.array(PostIdSchema).optional(),
	status: z.string(),
	created: z.string().optional(),
	scheduleDate: z.union([z.string(), z.object({ utc: z.string().optional() })]).optional(),
	errors: z.array(z.string()).optional(),
	mediaUrls: z.array(z.string()).optional(),
	profileTitle: z.string().optional(),
	likes: z.number().optional(),
	shares: z.number().optional(),
	comments: z.number().optional(),
	views: z.number().optional(),
});
const GetPostHistoryResponseSchema = z.object({
	history: z.array(HistoryEntrySchema),
	count: z.number().optional(),
	lastUpdated: z.string().optional(),
	nextUpdate: z.string().optional(),
});

const ListAutoSchedulesResponseSchema = z.object({
	status: z.string(),
	schedules: z.record(ScheduleSchema.omit({ title: true })),
});

export type SetAutoScheduleInput = z.infer<typeof SetAutoScheduleInputSchema>;
export type SetAutoScheduleResponse = z.infer<typeof SetAutoScheduleResponseSchema>;
export type DeletePostInput = z.infer<typeof DeletePostInputSchema>;
export type DeletePostResponse = z.infer<typeof DeletePostResponseSchema>;
export type GetPostHistoryInput = z.infer<typeof GetPostHistoryInputSchema>;
export type GetPostHistoryResponse = z.infer<typeof GetPostHistoryResponseSchema>;
export type ListAutoSchedulesResponse = z.infer<typeof ListAutoSchedulesResponseSchema>;
export type AyrshareHistoryEntry = z.infer<typeof HistoryEntrySchema>;

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
