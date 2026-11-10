import { z } from 'zod';

const recordsSchema = z
	.object({
		totalRecords: z.number().optional(),
		currentPageSize: z.number().optional(),
		currentPageNumber: z.number().optional(),
		cursor: z.string().optional(),
	})
	.passthrough();

// unknown: each stats row is returned as Gong sends it; the fields differ by report.
const rowSchema = z.record(z.string(), z.unknown());
const dateFilterSchema = z
	.object({
		fromDate: z.string(),
		toDate: z.string(),
		createdFromDateTime: z.string().optional(),
		createdToDateTime: z.string().optional(),
		userIds: z.array(z.string()).optional(),
	})
	.passthrough();

const answeredScorecardsFilterSchema = z
	.object({
		callFromDate: z.string().optional(),
		callToDate: z.string().optional(),
		reviewFromDate: z.string().optional(),
		reviewToDate: z.string().optional(),
		reviewMethod: z.enum(['AUTOMATIC', 'MANUAL', 'BOTH']).optional(),
		reviewedUserIds: z.array(z.string()).optional(),
		scorecardIds: z.array(z.string()).optional(),
	})
	.passthrough();

const requestWithDateFilter = z
	.object({ cursor: z.string().optional(), filter: dateFilterSchema })
	.passthrough();

export const GongStatsInputSchemas = {
	listInteractionStats: requestWithDateFilter,
	listAnsweredScorecards: z
		.object({
			cursor: z.string().optional(),
			filter: answeredScorecardsFilterSchema,
		})
		.passthrough(),
	listMultipleUsersDayByDayActivity: requestWithDateFilter,
	listMultipleUsersAggregateActivity: requestWithDateFilter,
	listMultipleUsersAggregateByPeriod: z
		.object({
			cursor: z.string().optional(),
			filter: dateFilterSchema,
			aggregationPeriod: z.enum(['DAY', 'WEEK', 'MONTH', 'QUARTER', 'YEAR']),
		})
		.passthrough(),
} as const;

export const GongStatsOutputSchemas = {
	listInteractionStats: z
		.object({
			requestId: z.string(),
			records: recordsSchema,
			peopleInteractionStats: z.array(rowSchema),
			fromDateTime: z.string(),
			toDateTime: z.string(),
			timeZone: z.string(),
		})
		.passthrough(),
	listAnsweredScorecards: z
		.object({
			requestId: z.string(),
			records: recordsSchema,
			answeredScorecards: z.array(rowSchema),
		})
		.passthrough(),
	listMultipleUsersDayByDayActivity: z
		.object({
			requestId: z.string(),
			records: recordsSchema,
			usersDetailedActivities: z.array(rowSchema),
		})
		.passthrough(),
	listMultipleUsersAggregateActivity: z
		.object({
			requestId: z.string(),
			records: recordsSchema,
			usersAggregateActivityStats: z.array(rowSchema),
			fromDateTime: z.string(),
			toDateTime: z.string(),
			timeZone: z.string(),
		})
		.passthrough(),
	listMultipleUsersAggregateByPeriod: z
		.object({
			requestId: z.string(),
			records: recordsSchema,
			usersAggregateActivity: z.array(rowSchema),
		})
		.passthrough(),
} as const;

export type GongStatsInputs = {
	[K in keyof typeof GongStatsInputSchemas]: z.infer<
		(typeof GongStatsInputSchemas)[K]
	>;
};
export type GongStatsOutputs = {
	[K in keyof typeof GongStatsOutputSchemas]: z.infer<
		(typeof GongStatsOutputSchemas)[K]
	>;
};
