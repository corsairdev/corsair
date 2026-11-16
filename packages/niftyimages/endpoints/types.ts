import { z } from 'zod';

// Inputs use NiftyImages' own query parameter names, which are camelCase
// (`startDate`, `endDate`). Outputs are `.loose()` and their documented fields
// nullish, so a field NiftyImages adds cannot fail a call that has already
// happened.
//
// Every date, in and out, is ISO 8601 as the docs specify: `2016-03-12T12:00Z`.

/** An ISO 8601 instant, which is the only date form the API accepts. */
const InstantSchema = z
	.string()
	.min(1)
	.describe('An ISO 8601 instant, e.g. 2016-03-12T08:00Z.');

const WidgetKeySchema = z
	.string()
	.min(1)
	.describe('The widget key, a GUID from widgets.list.');

/**
 * The time window every stats call takes. Both bounds are optional at the API,
 * and the docs do not say what a missing bound means, so they are passed
 * through as given.
 */
const WindowSchema = {
	startDate: InstantSchema.optional().describe('The first instant to include.'),
	endDate: InstantSchema.optional().describe('The last instant to include.'),
};

// ── widgets.list ──────────────────────────────────────────────────────────

const WidgetsListInputSchema = z.object({
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetsListInput = z.input<typeof WidgetsListInputSchema>;

const WidgetSchema = z
	.object({ Name: z.string().nullish(), WidgetKey: z.string().nullish() })
	.loose();

export type NiftyimagesWidget = z.infer<typeof WidgetSchema>;

const WidgetsListResponseSchema = z.object({
	widgets: z.array(WidgetSchema),
});

export type WidgetsListResponse = z.infer<typeof WidgetsListResponseSchema>;

// ── widgets.stats ─────────────────────────────────────────────────────────

const WidgetsStatsInputSchema = z.object({
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetsStatsInput = z.input<typeof WidgetsStatsInputSchema>;

/**
 * A stats row is a per-widget tally. The counts are all optional because an
 * unused widget reports zeroes and, on some plans, omits a metric entirely.
 */
const WidgetStatsSchema = z
	.object({
		WidgetKey: z.string().nullish(),
		Name: z.string().nullish(),
		Views: z.number().nullish(),
		UniqueViews: z.number().nullish(),
		Clicks: z.number().nullish(),
		UniqueClicks: z.number().nullish(),
		CreateDate: z.string().nullish(),
	})
	.loose();

export type NiftyimagesWidgetStats = z.infer<typeof WidgetStatsSchema>;

const WidgetsStatsResponseSchema = z.object({
	stats: z.array(WidgetStatsSchema),
});

export type WidgetsStatsResponse = z.infer<typeof WidgetsStatsResponseSchema>;

// ── widgets.users ─────────────────────────────────────────────────────────

const WidgetUsersInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetUsersInput = z.input<typeof WidgetUsersInputSchema>;

const WidgetUserSchema = z
	.object({
		User: z.string().nullish(),
		Views: z.number().nullish(),
		Clicks: z.number().nullish(),
		LastSeen: z.string().nullish(),
	})
	.loose();

export type NiftyimagesWidgetUser = z.infer<typeof WidgetUserSchema>;

const WidgetUsersResponseSchema = z.object({
	users: z.array(WidgetUserSchema),
});

export type WidgetUsersResponse = z.infer<typeof WidgetUsersResponseSchema>;

// ── widgets.userStats ─────────────────────────────────────────────────────

const WidgetUserStatsInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	user: z
		.string()
		.min(1)
		.describe('The user id or email the widget recorded for the recipient.'),
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetUserStatsInput = z.input<typeof WidgetUserStatsInputSchema>;

const UserStatsSchema = z
	.object({
		User: z.string().nullish(),
		Views: z.number().nullish(),
		Clicks: z.number().nullish(),
		FirstSeen: z.string().nullish(),
		LastSeen: z.string().nullish(),
	})
	.loose();

export type NiftyimagesUserStats = z.infer<typeof UserStatsSchema>;

const WidgetUserStatsResponseSchema = z.object({
	stats: UserStatsSchema,
});

export type WidgetUserStatsResponse = z.infer<
	typeof WidgetUserStatsResponseSchema
>;

// ── widgets.images ────────────────────────────────────────────────────────

const WidgetImagesInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetImagesInput = z.input<typeof WidgetImagesInputSchema>;

const WidgetImageSchema = z
	.object({
		ImageKey: z.string().nullish(),
		ImageUrl: z.string().nullish(),
		User: z.string().nullish(),
		CreateDate: z.string().nullish(),
		Views: z.number().nullish(),
		Clicks: z.number().nullish(),
	})
	.loose();

export type NiftyimagesWidgetImage = z.infer<typeof WidgetImageSchema>;

const WidgetImagesResponseSchema = z.object({
	images: z.array(WidgetImageSchema),
});

export type WidgetImagesResponse = z.infer<typeof WidgetImagesResponseSchema>;

// ── widgets.userImages ────────────────────────────────────────────────────

const WidgetUserImagesInputSchema = z.object({
	widgetKey: WidgetKeySchema,
	user: z.string().min(1).describe('The user id or email to read images for.'),
	startDate: WindowSchema.startDate,
	endDate: WindowSchema.endDate,
});

export type WidgetUserImagesInput = z.input<typeof WidgetUserImagesInputSchema>;

export type WidgetUserImagesResponse = WidgetImagesResponse;

// ── Registry ──────────────────────────────────────────────────────────────

export type NiftyimagesEndpointInputs = {
	widgetsList: WidgetsListInput;
	widgetsStats: WidgetsStatsInput;
	widgetsUsers: WidgetUsersInput;
	widgetUserStats: WidgetUserStatsInput;
	widgetImages: WidgetImagesInput;
	widgetUserImages: WidgetUserImagesInput;
};

export type NiftyimagesEndpointOutputs = {
	widgetsList: WidgetsListResponse;
	widgetsStats: WidgetsStatsResponse;
	widgetsUsers: WidgetUsersResponse;
	widgetUserStats: WidgetUserStatsResponse;
	widgetImages: WidgetImagesResponse;
	widgetUserImages: WidgetUserImagesResponse;
};

export const NiftyimagesEndpointInputSchemas = {
	widgetsList: WidgetsListInputSchema,
	widgetsStats: WidgetsStatsInputSchema,
	widgetsUsers: WidgetUsersInputSchema,
	widgetUserStats: WidgetUserStatsInputSchema,
	widgetImages: WidgetImagesInputSchema,
	widgetUserImages: WidgetUserImagesInputSchema,
} as const;

export const NiftyimagesEndpointOutputSchemas = {
	widgetsList: WidgetsListResponseSchema,
	widgetsStats: WidgetsStatsResponseSchema,
	widgetsUsers: WidgetUsersResponseSchema,
	widgetUserStats: WidgetUserStatsResponseSchema,
	widgetImages: WidgetImagesResponseSchema,
	widgetUserImages: WidgetImagesResponseSchema,
} as const;
