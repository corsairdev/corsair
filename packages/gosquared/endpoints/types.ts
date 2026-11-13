import { z } from 'zod';

// --- Shared & Entity Schemas ---

// `passthrough` because GoSquared site entities contain additional dynamic properties.
export const SiteSchema = z
	.object({
		site_token: z.string(),
		name: z.string().nullable().optional(),
		domain_name: z.string().optional(),
		timezone: z.string().optional(),
		created: z.string().optional(),
		user_id: z.union([z.number(), z.string()]).optional(),
		plan_name: z.string().optional(),
	})
	.passthrough();

export type Site = z.infer<typeof SiteSchema>;

// `unknown` because dictionary response contains dynamic metrics by key.
export const DynamicRecordSchema = z.record(z.string(), z.unknown());

// `unknown` because list items contain dynamic metric properties.
export const DynamicListSchema = z.array(z.record(z.string(), z.unknown()));

export const SuccessResponseSchema = z
	.object({
		success: z.boolean().optional(),
	})
	.passthrough();

// --- Account Schemas ---

export const GetSitesInputSchema = z
	.object({
		presenter: z.enum(['grouped', 'flat']).optional(),
	})
	.strict();

export const GetSitesOutputSchema = z.union([
	z.array(SiteSchema),
	z.record(z.string(), z.array(SiteSchema)),
]);

export const CreateSiteInputSchema = z
	.object({
		domain_name: z.string().min(1),
		name: z.string().optional(),
	})
	.strict();

export const CreateSiteOutputSchema = SiteSchema;

export const GetSiteInputSchema = z
	.object({
		site_token: z.string().min(1),
	})
	.strict();

export const GetSiteOutputSchema = SiteSchema;

export const GetSharedUsersInputSchema = z
	.object({
		site_token: z.string().optional(),
	})
	.strict();

export const GetSharedUsersOutputSchema = z.array(
	z
		.object({
			email: z.string().optional(),
			role: z.string().optional(),
			status: z.string().optional(),
			id: z.union([z.string(), z.number()]).optional(),
		})
		.passthrough(),
);

export const GetBlockedInputSchema = z
	.object({
		site_token: z.string().optional(),
		presenter: z.enum(['plain', 'tags', 'indexedTags']).optional(),
	})
	.strict();

export const GetBlockedOutputSchema = z.union([
	z.array(z.string()),
	z.array(z.object({ id: z.string(), tag: z.string().optional() })),
	z.record(z.string(), z.string()),
]);

// --- Now Schemas ---

export const NowOverviewInputSchema = z
	.object({
		site_token: z.string().optional(),
		minimal: z.boolean().optional(),
	})
	.strict();

export const NowOverviewOutputSchema = z
	.object({
		visitors: z.number().optional(),
		pages: z.number().optional(),
		pageviews: z.number().optional(),
		visitors_direct: z.number().optional(),
		visitors_search: z.number().optional(),
		visitors_referral: z.number().optional(),
		visitors_campaign: z.number().optional(),
	})
	.passthrough();

export const NowConcurrentsInputSchema = z
	.object({
		site_token: z.string().optional(),
	})
	.strict();

export const NowConcurrentsOutputSchema = z
	.object({
		concurrents: z.number().optional(),
		online: z.number().optional(),
	})
	.passthrough();

export const NowStandardQueryInputSchema = z
	.object({
		site_token: z.string().optional(),
		limit: z.union([z.number(), z.string()]).optional(),
	})
	.strict();

export const NowSimpleInputSchema = z
	.object({
		site_token: z.string().optional(),
	})
	.strict();

export const NowDynamicOutputSchema = z.union([
	DynamicRecordSchema,
	DynamicListSchema,
]);

// --- Trends Schemas ---

export const TrendsQueryInputSchema = z
	.object({
		site_token: z.string().optional(),
		from: z.string().min(1),
		to: z.string().min(1),
		interval: z.enum(['hour', 'day', 'month']).optional(),
		limit: z.union([z.number(), z.string()]).optional(),
		format: z.literal('json').optional(),
		dateFormat: z.string().optional(),
	})
	.strict();

export type TrendsQueryInput = z.infer<typeof TrendsQueryInputSchema>;

export const TrendsOutputSchema = z.union([
	DynamicRecordSchema,
	DynamicListSchema,
]);

export type TrendsOutput = z.infer<typeof TrendsOutputSchema>;

// --- People Schemas ---

export const GetPeopleInputSchema = z
	.object({
		site_token: z.string().optional(),
		limit: z.union([z.number(), z.string()]).optional(),
		sort: z.string().optional(),
		order: z.enum(['asc', 'desc']).optional(),
		filters: z.string().optional(),
	})
	.strict();

export const GetPeopleOutputSchema = z.union([
	DynamicListSchema,
	DynamicRecordSchema,
]);

export const GetPersonInputSchema = z
	.object({
		person_id: z.string().min(1),
		site_token: z.string().optional(),
	})
	.strict();

export const GetPersonOutputSchema = DynamicRecordSchema;

export const GetPersonFeedInputSchema = z
	.object({
		person_id: z.string().min(1),
		site_token: z.string().optional(),
		limit: z.union([z.number(), z.string()]).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict();

export const GetPersonFeedOutputSchema = z.union([
	DynamicListSchema,
	DynamicRecordSchema,
]);

export const GetPersonDevicesInputSchema = z
	.object({
		person_id: z.string().min(1),
		site_token: z.string().optional(),
		limit: z.union([z.number(), z.string()]).optional(),
	})
	.strict();

export const GetPersonDevicesOutputSchema = z.union([
	DynamicListSchema,
	DynamicRecordSchema,
]);

export const GetSmartGroupsInputSchema = z
	.object({
		site_token: z.string().optional(),
	})
	.strict();

export const GetSmartGroupsOutputSchema = z.union([
	DynamicListSchema,
	DynamicRecordSchema,
]);

export const GetDevicesInputSchema = z
	.object({
		site_token: z.string().optional(),
		limit: z.union([z.number(), z.string()]).optional(),
	})
	.strict();

export const GetDevicesOutputSchema = z.union([
	DynamicListSchema,
	DynamicRecordSchema,
]);

export const GetDeviceInputSchema = z
	.object({
		device_id: z.string().min(1),
		site_token: z.string().optional(),
	})
	.strict();

export const GetDeviceOutputSchema = DynamicRecordSchema;

export const GetEventTypesInputSchema = z
	.object({
		site_token: z.string().optional(),
	})
	.strict();

export const GetEventTypesOutputSchema = z.union([
	z.array(z.string()),
	DynamicRecordSchema,
]);

export const GetPropertyTypesInputSchema = z
	.object({
		site_token: z.string().optional(),
	})
	.strict();

export const GetPropertyTypesOutputSchema = z.union([
	z.array(z.string()),
	DynamicRecordSchema,
]);

// --- Tracking Schemas ---

export const TrackEventInputSchema = z
	.object({
		site_token: z.string().optional(),
		event: z.object({
			name: z.string().min(1),
			// `unknown` because event custom payload data can hold arbitrary attributes.
			data: z.record(z.string(), z.unknown()).optional(),
		}),
		person_id: z.string().optional(),
		visitor_id: z.string().optional(),
		timestamp: z.string().optional(),
	})
	.strict();

export const TrackEventOutputSchema = SuccessResponseSchema;

export const IdentifyInputSchema = z
	.object({
		site_token: z.string().optional(),
		person_id: z.string().optional(),
		visitor_id: z.string().optional(),
		properties: z
			.object({
				email: z.string().optional(),
				name: z.string().optional(),
				first_name: z.string().optional(),
				last_name: z.string().optional(),
				phone: z.string().optional(),
				created_at: z.string().optional(),
				// `unknown` because company metadata has dynamic user-defined fields.
				company: z.record(z.string(), z.unknown()).optional(),
				// `unknown` because custom user properties have dynamic user-defined fields.
				custom: z.record(z.string(), z.unknown()).optional(),
			})
			.passthrough(),
	})
	.strict();

export const IdentifyOutputSchema = SuccessResponseSchema;

export const TrackTransactionInputSchema = z
	.object({
		site_token: z.string().optional(),
		transaction: z.object({
			id: z.string().min(1),
			revenue: z.number().optional(),
			quantity: z.number().optional(),
			items: z
				.array(
					z.object({
						name: z.string(),
						price: z.number().optional(),
						quantity: z.number().optional(),
						revenue: z.number().optional(),
						categories: z.array(z.string()).optional(),
					}),
				)
				.optional(),
		}),
		person_id: z.string().optional(),
		visitor_id: z.string().optional(),
		timestamp: z.string().optional(),
	})
	.strict();

export const TrackTransactionOutputSchema = SuccessResponseSchema;

export const TrackPageviewInputSchema = z
	.object({
		site_token: z.string().optional(),
		page: z.object({
			url: z.string().min(1),
			title: z.string().optional(),
		}),
		person_id: z.string().optional(),
		visitor_id: z.string().optional(),
		timestamp: z.string().optional(),
	})
	.strict();

export const TrackPageviewOutputSchema = SuccessResponseSchema;

// --- Chat Schemas ---

export const GetChatsInputSchema = z
	.object({
		site_token: z.string().optional(),
		limit: z.union([z.number(), z.string()]).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict();

export const GetChatsOutputSchema = z.union([
	DynamicListSchema,
	DynamicRecordSchema,
]);

export const GetChatInputSchema = z
	.object({
		chat_id: z.string().min(1),
		site_token: z.string().optional(),
	})
	.strict();

export const GetChatOutputSchema = DynamicRecordSchema;

export const GetChatFeedInputSchema = z
	.object({
		chat_id: z.string().min(1),
		site_token: z.string().optional(),
		limit: z.union([z.number(), z.string()]).optional(),
		from: z.string().optional(),
		to: z.string().optional(),
	})
	.strict();

export const GetChatFeedOutputSchema = z.union([
	DynamicListSchema,
	DynamicRecordSchema,
]);

export const ArchiveChatInputSchema = z
	.object({
		chat_id: z.string().min(1),
		site_token: z.string().optional(),
	})
	.strict();

export const ArchiveChatOutputSchema = SuccessResponseSchema;

export const UnarchiveChatInputSchema = z
	.object({
		chat_id: z.string().min(1),
		site_token: z.string().optional(),
	})
	.strict();

export const UnarchiveChatOutputSchema = SuccessResponseSchema;

export const SendChatMessageInputSchema = z
	.object({
		chat_id: z.string().min(1),
		site_token: z.string().optional(),
		content: z.string().min(1),
		from: z.enum(['agent', 'client']).optional(),
		auth: z.string().optional(),
	})
	.strict();

export const SendChatMessageOutputSchema = z
	.object({
		success: z.boolean().optional(),
		message_id: z.string().optional(),
	})
	.passthrough();

// --- Auth Schemas ---

export const GetTokenInfoInputSchema = z.object({}).strict();

export const GetTokenInfoOutputSchema = z
	.object({
		scopes: z.array(z.string()).optional(),
		user_id: z.union([z.string(), z.number()]).optional(),
		site_token: z.string().optional(),
		email: z.string().optional(),
	})
	.passthrough();

// --- Schema Map Registry ---

export const GosquaredEndpointInputSchemas = {
	// Account
	'account.getSites': GetSitesInputSchema,
	'account.createSite': CreateSiteInputSchema,
	'account.getSite': GetSiteInputSchema,
	'account.getSharedUsers': GetSharedUsersInputSchema,
	'account.getBlocked': GetBlockedInputSchema,

	// Now
	'now.getOverview': NowOverviewInputSchema,
	'now.getConcurrents': NowConcurrentsInputSchema,
	'now.getPages': NowStandardQueryInputSchema,
	'now.getSources': NowStandardQueryInputSchema,
	'now.getTimeSeries': NowSimpleInputSchema,
	'now.getBrowsers': NowSimpleInputSchema,
	'now.getCountries': NowSimpleInputSchema,
	'now.getPlatforms': NowSimpleInputSchema,
	'now.getVisitors': NowStandardQueryInputSchema,
	'now.getGeo': NowSimpleInputSchema,
	'now.getCampaigns': NowSimpleInputSchema,

	// Trends
	'trends.getAggregate': TrendsQueryInputSchema,
	'trends.getBrowser': TrendsQueryInputSchema,
	'trends.getCountry': TrendsQueryInputSchema,
	'trends.getEvent': TrendsQueryInputSchema,
	'trends.getLanguage': TrendsQueryInputSchema,
	'trends.getOrganisation': TrendsQueryInputSchema,
	'trends.getOs': TrendsQueryInputSchema,
	'trends.getPage': TrendsQueryInputSchema,
	'trends.getPath1': TrendsQueryInputSchema,
	'trends.getScreenDimensions': TrendsQueryInputSchema,
	'trends.getSources': TrendsQueryInputSchema,

	// People
	'people.getPeople': GetPeopleInputSchema,
	'people.getPerson': GetPersonInputSchema,
	'people.getPersonFeed': GetPersonFeedInputSchema,
	'people.getPersonDevices': GetPersonDevicesInputSchema,
	'people.getSmartGroups': GetSmartGroupsInputSchema,
	'people.getDevices': GetDevicesInputSchema,
	'people.getDevice': GetDeviceInputSchema,
	'people.getEventTypes': GetEventTypesInputSchema,
	'people.getPropertyTypes': GetPropertyTypesInputSchema,

	// Tracking
	'tracking.trackEvent': TrackEventInputSchema,
	'tracking.identify': IdentifyInputSchema,
	'tracking.trackTransaction': TrackTransactionInputSchema,
	'tracking.trackPageview': TrackPageviewInputSchema,

	// Chat
	'chat.getChats': GetChatsInputSchema,
	'chat.getChat': GetChatInputSchema,
	'chat.getChatFeed': GetChatFeedInputSchema,
	'chat.archiveChat': ArchiveChatInputSchema,
	'chat.unarchiveChat': UnarchiveChatInputSchema,
	'chat.sendMessage': SendChatMessageInputSchema,

	// Auth
	'auth.getTokenInfo': GetTokenInfoInputSchema,
} as const;

export const GosquaredEndpointOutputSchemas = {
	// Account
	'account.getSites': GetSitesOutputSchema,
	'account.createSite': CreateSiteOutputSchema,
	'account.getSite': GetSiteOutputSchema,
	'account.getSharedUsers': GetSharedUsersOutputSchema,
	'account.getBlocked': GetBlockedOutputSchema,

	// Now
	'now.getOverview': NowOverviewOutputSchema,
	'now.getConcurrents': NowConcurrentsOutputSchema,
	'now.getPages': NowDynamicOutputSchema,
	'now.getSources': NowDynamicOutputSchema,
	'now.getTimeSeries': NowDynamicOutputSchema,
	'now.getBrowsers': NowDynamicOutputSchema,
	'now.getCountries': NowDynamicOutputSchema,
	'now.getPlatforms': NowDynamicOutputSchema,
	'now.getVisitors': NowDynamicOutputSchema,
	'now.getGeo': NowDynamicOutputSchema,
	'now.getCampaigns': NowDynamicOutputSchema,

	// Trends
	'trends.getAggregate': TrendsOutputSchema,
	'trends.getBrowser': TrendsOutputSchema,
	'trends.getCountry': TrendsOutputSchema,
	'trends.getEvent': TrendsOutputSchema,
	'trends.getLanguage': TrendsOutputSchema,
	'trends.getOrganisation': TrendsOutputSchema,
	'trends.getOs': TrendsOutputSchema,
	'trends.getPage': TrendsOutputSchema,
	'trends.getPath1': TrendsOutputSchema,
	'trends.getScreenDimensions': TrendsOutputSchema,
	'trends.getSources': TrendsOutputSchema,

	// People
	'people.getPeople': GetPeopleOutputSchema,
	'people.getPerson': GetPersonOutputSchema,
	'people.getPersonFeed': GetPersonFeedOutputSchema,
	'people.getPersonDevices': GetPersonDevicesOutputSchema,
	'people.getSmartGroups': GetSmartGroupsOutputSchema,
	'people.getDevices': GetDevicesOutputSchema,
	'people.getDevice': GetDeviceOutputSchema,
	'people.getEventTypes': GetEventTypesOutputSchema,
	'people.getPropertyTypes': GetPropertyTypesOutputSchema,

	// Tracking
	'tracking.trackEvent': TrackEventOutputSchema,
	'tracking.identify': IdentifyOutputSchema,
	'tracking.trackTransaction': TrackTransactionOutputSchema,
	'tracking.trackPageview': TrackPageviewOutputSchema,

	// Chat
	'chat.getChats': GetChatsOutputSchema,
	'chat.getChat': GetChatOutputSchema,
	'chat.getChatFeed': GetChatFeedOutputSchema,
	'chat.archiveChat': ArchiveChatOutputSchema,
	'chat.unarchiveChat': UnarchiveChatOutputSchema,
	'chat.sendMessage': SendChatMessageOutputSchema,

	// Auth
	'auth.getTokenInfo': GetTokenInfoOutputSchema,
} as const;

export type GosquaredEndpointInputs = {
	[K in keyof typeof GosquaredEndpointInputSchemas]: z.infer<
		(typeof GosquaredEndpointInputSchemas)[K]
	>;
};

export type GosquaredEndpointOutputs = {
	[K in keyof typeof GosquaredEndpointOutputSchemas]: z.infer<
		(typeof GosquaredEndpointOutputSchemas)[K]
	>;
};
