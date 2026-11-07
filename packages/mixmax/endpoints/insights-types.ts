import { z } from 'zod';
import { mixmaxBooleanFlag } from './flags';

// Saved Insights reports and the report data table
// (developer.mixmax.com/reference, Reports section). Field names, types, and
// limits mirror the official InsightsReport, InsightsReportCreate,
// InsightsReportWrite schemas and the /v1/reports/data/table definition.

// A saved report. Matches the official InsightsReport schema: `_id` and
// `userId` are required, the rest is optional (older reports, including the
// sample reports every new user gets, have no `type`) and the document stays
// passthrough because the provider may add report detail it does not pin
// down.
export const InsightsReportSchema = z
	.object({
		_id: z.string(),
		// The report's owner. Reports shared with you have someone else's.
		userId: z.string(),
		title: z.string().optional(),
		// One of `messages`, `meetings`, `sequences`, `tasks` or `calls`.
		type: z.string().optional(),
		// The report's search query, for example `sent:last30days from:me`.
		query: z.string().optional(),
		// The report's columns.
		fields: z.array(z.string()).optional(),
		// ISO 8601 date-time strings.
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
	})
	.passthrough();

export type InsightsReport = z.infer<typeof InsightsReportSchema>;

export const InsightsReportsListInputSchema = z.object({
	// How many reports per page. The maximum, and the default, is 50.
	limit: z.coerce.number().int().max(50).optional(),
	// Comma-separated: `myself` for your own, `shared` for shared with you,
	// `adminAccess` for your workspace's if you are an admin.
	accessThrough: z.string().optional(),
	// The `next` cursor from the previous page.
	next: z.string().optional(),
	// The `previous` cursor from the next page.
	previous: z.string().optional(),
});

export type InsightsReportsListInput = z.infer<
	typeof InsightsReportsListInputSchema
>;

export const InsightsReportsListOutputSchema = z.object({
	results: z.array(InsightsReportSchema),
	next: z.string().optional(),
	hasNext: z.boolean().optional(),
	previous: z.string().optional(),
	hasPrevious: z.boolean().optional(),
});

export type InsightsReportsListOutput = z.infer<
	typeof InsightsReportsListOutputSchema
>;

// POST /v1/insightsreports body, matching the official InsightsReportCreate
// schema exactly: `title`, `type` and `query` are required and the object
// rejects unknown fields (the provider answers 500 for them), so it is
// strict rather than passthrough.
export const InsightsReportCreateSchema = z
	.object({
		title: z.string().min(1),
		type: z.enum(['messages', 'meetings', 'sequences', 'tasks', 'calls']),
		// The report's search query, for example `sent:last30days from:me`,
		// in search-query-parser syntax.
		query: z.string().min(1),
		// The report's columns.
		fields: z.array(z.string()).optional(),
	})
	.strict();

export type InsightsReportCreate = z.infer<typeof InsightsReportCreateSchema>;

export const InsightsReportsCreateInputSchema = InsightsReportCreateSchema;

export type InsightsReportsCreateInput = z.infer<
	typeof InsightsReportsCreateInputSchema
>;

// POST /v1/insightsreports answers 200 with the saved report.
export const InsightsReportsCreateOutputSchema = InsightsReportSchema;

export type InsightsReportsCreateOutput = z.infer<
	typeof InsightsReportsCreateOutputSchema
>;

// PATCH /v1/insightsreports/{id} body, matching the official
// InsightsReportWrite schema: only the fields you send change and unknown
// fields are ignored, so every field stays optional and the object
// passthrough.
export const InsightsReportWriteSchema = z
	.object({
		title: z.string().optional(),
		type: z.string().optional(),
		query: z.string().optional(),
		fields: z.array(z.string()).optional(),
	})
	.passthrough();

export type InsightsReportWrite = z.infer<typeof InsightsReportWriteSchema>;

export const InsightsReportsUpdateInputSchema =
	InsightsReportWriteSchema.extend({
		id: z.string().min(1),
	});

export type InsightsReportsUpdateInput = z.infer<
	typeof InsightsReportsUpdateInputSchema
>;

// PATCH /v1/insightsreports/{id} answers 200 with the whole updated report.
export const InsightsReportsUpdateOutputSchema = InsightsReportSchema;

export type InsightsReportsUpdateOutput = z.infer<
	typeof InsightsReportsUpdateOutputSchema
>;

export const InsightsReportsDeleteInputSchema = z.object({
	id: z.string().min(1),
});

export type InsightsReportsDeleteInput = z.infer<
	typeof InsightsReportsDeleteInputSchema
>;

// DELETE /v1/insightsreports/{id} answers 204 with no body.
export const InsightsReportsDeleteOutputSchema = z.undefined();

export type InsightsReportsDeleteOutput = z.infer<
	typeof InsightsReportsDeleteOutputSchema
>;

// POST /v1/reports/data/table body. `type` is required: the official schema
// marks it required and its documented default is the placeholder `(none)`,
// so a body without it fails with 400. The remaining fields stay optional —
// the provider applies its own defaults (limit 1000, offset 0, sortDesc
// true, timezone UTC).
export const ReportsRunDataTableInputSchema = z.object({
	// Report type, eg `meetings`, `messages`, `sequences`.
	type: z.string().min(1),
	// How to group the results; the valid values depend on `type`
	// (`messages`: delegator, customerDomain, message, recipient,
	// emailsByDomain, sender, senderGroup, time, template; `meetings`:
	// groupmember, teammate, group).
	groupBy: z.string().optional(),
	// Query to run, eg `sent:last30days from:everyone`.
	query: z.string().optional(),
	// Comma-delimited list of fields to fetch, eg `delivered,opened`.
	fields: z.string().optional(),
	// Maximum number of rows to return; limited to 10,000, defaults to 1000.
	limit: z.coerce.number().int().max(10000).optional(),
	// Offset for paging. Defaults to 0.
	offset: z.coerce.number().int().min(0).optional(),
	// The field to sort by.
	sortBy: z.string().optional(),
	// Defaults to true.
	sortDesc: mixmaxBooleanFlag.optional(),
	// Timezone used to understand times, eg `America/New_York`. Defaults to
	// UTC.
	timezone: z.string().optional(),
});

export type ReportsRunDataTableInput = z.infer<
	typeof ReportsRunDataTableInputSchema
>;

// POST /v1/reports/data/table answer. Only `buckets` is required: which
// fields a row, `totals` or `aggs` carries depends on `type`, `groupBy` and
// `fields`, so those stay open objects and the bucket items stay extensible.
export const ReportsRunDataTableOutputSchema = z.object({
	// One row per group, for example per message, sender, recipient, meeting
	// or user; the row fields vary with the query.
	buckets: z.array(z.object({}).passthrough()),
	// Totals across all rows; not returned for `type` `sequences`.
	totals: z.object({}).passthrough().optional(),
	// Raw aggregations; only returned for `type` `sequences`.
	aggs: z.object({}).passthrough().optional(),
	// Paging and date range details; empty or left out when the report could
	// not run.
	extra: z
		.object({
			// Number of rows across all pages.
			total: z.number().int().optional(),
			// Whether another page exists after this `offset` and `limit`.
			hasNext: z.boolean().optional(),
			// The time bucket used for the date range, for example `day`.
			// Messages and meetings only.
			interval: z.string().optional(),
			// With `trendBy`, the count for the period before the queried
			// one, `null` otherwise. Messages and meetings only.
			trend: z.number().int().nullable().optional(),
			// The date range the query matched, as Unix timestamps in
			// milliseconds; empty when the query has no date. Messages and
			// meetings only.
			dateRange: z
				.object({
					lower: z.number().int().optional(),
					upper: z.number().int().optional(),
					// Start of the previous period of the same length.
					trend: z.number().int().optional(),
				})
				.optional(),
		})
		.optional(),
});

export type ReportsRunDataTableOutput = z.infer<
	typeof ReportsRunDataTableOutputSchema
>;
