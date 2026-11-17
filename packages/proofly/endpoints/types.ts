import { z } from 'zod';

const NoInput = z.object({}).strict();

export const ListCampaignsInputSchema = NoInput;
export const GetUserInputSchema = NoInput;
export const ListActivityInputSchema = NoInput;

export const CampaignSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		name: z.string(),
		domain: z
			.object({
				domain: z.string(),
				subdomains: z.boolean(),
			})
			.optional(),
		enabled: z.boolean().optional(),
		created: z.string().optional(),
	})
	.passthrough();

export const ListCampaignsResponseSchema = z
	.object({
		ok: z.literal(true),
		status: z.number().optional(),
		data: z.array(CampaignSchema),
	})
	.passthrough();

export const UserSchema = z
	.object({
		name: z.string().optional(),
		email: z.string(),
		meta: z
			.object({
				logins: z.number().optional(),
				registered: z.string().optional(),
			})
			.optional(),
		impressions: z
			.object({
				period: z.number().optional(),
				total: z.number().optional(),
			})
			.optional(),
		pixel: z
			.object({
				key: z.string().optional(),
				debug: z.boolean().optional(),
			})
			.optional(),
	})
	.passthrough();

export const GetUserResponseSchema = z
	.object({
		ok: z.literal(true),
		status: z.number().optional(),
		data: UserSchema,
	})
	.passthrough();

export const ActivitySchema = z
	.object({
		type: z.string(),
		ip: z.string().optional(),
		date: z.string().optional(),
	})
	.passthrough();

export const ListActivityResponseSchema = z
	.object({
		ok: z.literal(true),
		status: z.number().optional(),
		data: z.array(ActivitySchema),
	})
	.passthrough();

export type ListCampaignsInput = z.infer<typeof ListCampaignsInputSchema>;
export type ListCampaignsResponse = z.infer<typeof ListCampaignsResponseSchema>;
export type GetUserInput = z.infer<typeof GetUserInputSchema>;
export type GetUserResponse = z.infer<typeof GetUserResponseSchema>;
export type ListActivityInput = z.infer<typeof ListActivityInputSchema>;
export type ListActivityResponse = z.infer<typeof ListActivityResponseSchema>;

export const ProoflyEndpointInputSchemas = {
	'campaigns.list': ListCampaignsInputSchema,
	'user.get': GetUserInputSchema,
	'activity.list': ListActivityInputSchema,
};

export const ProoflyEndpointOutputSchemas = {
	'campaigns.list': ListCampaignsResponseSchema,
	'user.get': GetUserResponseSchema,
	'activity.list': ListActivityResponseSchema,
};

// ── Campaign notifications, toggling, and notification data ──
// https://proofly.io/developers. Responses are parsed loosely: nullable
// fields, open `type` strings, and extra fields kept.

const NumericId = z
	.union([z.number().int().positive(), z.string().regex(/^\d+$/)])
	.transform((value) => String(value));

export const ListNotificationsInputSchema = z.object({
	campaign_id: NumericId.describe('Campaign id from campaigns.list'),
});

export const NotificationSchema = z
	.object({
		id: z.union([z.number(), z.string()]),
		name: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe('Notification kind, e.g. LATEST_CONVERSION'),
		settings: z.object({}).loose().nullish(),
		stats: z
			.object({
				impressions: z.number().nullish(),
				hovers: z.number().nullish(),
				clicks: z.number().nullish(),
				leads: z.number().nullish(),
			})
			.loose()
			.nullish(),
		enabled: z.boolean().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export const ListNotificationsResponseSchema = z
	.object({
		ok: z.literal(true),
		status: z.number().optional(),
		data: z.array(NotificationSchema),
	})
	.loose();

export const SetCampaignEnabledInputSchema = z.object({
	campaign_id: NumericId.describe('Campaign id from campaigns.list'),
	enabled: z
		.boolean()
		.describe('true to turn the campaign on, false to turn it off'),
});

export const SetCampaignEnabledResponseSchema = z.object({
	campaign_id: z.string(),
	enabled: z.boolean(),
	changed: z
		.boolean()
		.describe(
			'false when the campaign already had that state and nothing was sent',
		),
	message: z
		.string()
		.optional()
		.describe("Proofly's reply, when a change was sent"),
});

export const GetNotificationDataInputSchema = z.object({
	notification_id: NumericId.describe(
		'Notification id from notifications.list',
	),
});

export const NotificationDataSchema = z
	.object({
		type: z.string().nullish().describe('e.g. collector or conversion'),
		data: z.object({}).loose().nullish().describe('What the visitor entered'),
		ip: z.string().nullish(),
		url: z.string().nullish(),
		location: z
			.object({
				city: z.string().nullish(),
				country_code: z.string().nullish(),
				country: z.string().nullish(),
			})
			.loose()
			.nullish(),
		date: z.string().nullish(),
	})
	.loose();

export const GetNotificationDataResponseSchema = z
	.object({
		ok: z.literal(true),
		status: z.number().optional(),
		data: z.array(NotificationDataSchema),
	})
	.loose();

export type ListNotificationsInput = z.input<
	typeof ListNotificationsInputSchema
>;
export type ListNotificationsResponse = z.infer<
	typeof ListNotificationsResponseSchema
>;
export type SetCampaignEnabledInput = z.input<
	typeof SetCampaignEnabledInputSchema
>;
export type SetCampaignEnabledResponse = z.infer<
	typeof SetCampaignEnabledResponseSchema
>;
export type GetNotificationDataInput = z.input<
	typeof GetNotificationDataInputSchema
>;
export type GetNotificationDataResponse = z.infer<
	typeof GetNotificationDataResponseSchema
>;
