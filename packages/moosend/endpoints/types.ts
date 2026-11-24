import { z } from 'zod';

// ── Shared input pieces ───────────────────────────────────────────────────

const id = (what: string) => z.string().min(1).describe(`The ${what} ID`);
const MailingListId = id('mailing list');
const SubscriberId = id('subscriber');
const CampaignId = id('campaign');
const SegmentId = z
	.number()
	.int()
	.positive()
	.describe('The segment ID (Moosend segment IDs are integers)');
const Email = z.string().email();
const Page = z.number().int().min(1).describe('Page number, starting at 1');
const PageSize = z.number().int().min(1).max(1000).describe('Results per page');
const SortMethod = z.enum(['ASC', 'DESC']).describe('Sort direction');

/**
 * Custom field values by field name, e.g. `{ Country: 'NL', Age: 25 }`.
 * Sent as Moosend's `CustomFields: ['Country=NL', 'Age=25']`. On an existing
 * subscriber, fields left out are cleared.
 */
const CustomFieldValues = z
	.record(z.string().min(1), z.union([z.string(), z.number(), z.boolean()]))
	.describe(
		'Custom field values by field name; fields left out are cleared on an existing subscriber',
	);
const Tag = z.string().min(3).max(80).describe('A tag, 3 to 80 characters');
const Tags = z.array(Tag).max(50);
const PreferenceValues = z
	.array(z.string())
	.describe("The list's preference options the subscriber picked");

const SubscriberFields = {
	email: Email.describe('Email address of the subscriber'),
	name: z.string().optional().describe('Subscriber name'),
	customFields: CustomFieldValues.optional(),
	tags: Tags.optional().describe('Tags to set on the subscriber'),
	preferences: PreferenceValues.optional(),
};

const ListSettings = {
	name: z.string().min(1).describe('Name of the mailing list'),
	confirmationPage: z
		.string()
		.url()
		.optional()
		.describe('URL shown at the end of the subscription process'),
	redirectAfterUnsubscribePage: z
		.string()
		.url()
		.optional()
		.describe('URL subscribers land on after they unsubscribe'),
	preferences: z
		.object({
			selectType: z.enum(['SingleSelect', 'MultiSelect']),
			options: z.array(z.string().min(1)).max(10),
			isRequired: z.boolean().optional(),
		})
		.optional()
		.describe('Preference options subscribers can pick (up to 10)'),
	preferencePageId: z
		.string()
		.optional()
		.describe('ID of the preference page to use'),
};

const CustomFieldSettings = {
	name: z.string().min(1).describe('Name of the custom field'),
	type: z
		.enum(['Text', 'Number', 'DateTime', 'SingleSelectDropdown', 'CheckBox'])
		.optional()
		.describe('Data type of the field (Text when omitted)'),
	options: z
		.array(
			z
				.string()
				.min(1)
				.regex(/^[^,]*$/, 'An option cannot contain a comma'),
		)
		.optional()
		.describe('Choices for a SingleSelectDropdown field'),
	isRequired: z
		.boolean()
		.optional()
		.describe('Whether a value is required when adding a subscriber'),
	isHidden: z
		.boolean()
		.optional()
		.describe("Whether the field is hidden on the subscriber's profile page"),
};

const Criterion = z.object({
	field: z
		.string()
		.min(1)
		.describe(
			'What to filter on: DateAdded, DateUpdated, RecipientName, RecipientEmail, SubscribeMethod, CustomField, MailingListIncluded, CampaignsOpened, LinksClicked, CampaignName, LinkURL, CampaignSent, Platform, OperatingSystems, EmailClient, WebBrowser, MobileBrowser, AddedAnythingToCart, ViewedProduct, PurchasedProduct, ViewedProductCategory, PurchasedProductCategory, ViewedProductBrand, PurchasedProductBrand, Preference, or a custom field name',
		),
	comparer: z
		.string()
		.min(1)
		.describe(
			'Operator: Is, IsNot, Contains, DoesNotContain, StartsWith, DoesNotStartWith, EndsWith, DoesNotEndWith, IsGreaterThan, IsGreaterThanOrEqualTo, IsLessThan, IsLessThanOrEqualTo, IsBefore, IsAfter, IsEmpty, IsNotEmpty, IsTrue, IsFalse',
		),
	value: z.string().optional().describe('The value to compare against'),
	lastXMinutes: z
		.number()
		.int()
		.positive()
		.optional()
		.describe('Only count activity in the last X minutes'),
	dateFrom: z.string().optional().describe('Start of a date span'),
	dateTo: z.string().optional().describe('End of a date span'),
	dateFunction: z
		.string()
		.optional()
		.describe('For date fields: Year, Month, Day, DayOfWeek, ...'),
});

const SegmentSettings = {
	name: z.string().min(1).describe('Name of the segment'),
	matchType: z
		.enum(['All', 'Any'])
		.optional()
		.describe('Match all criteria (default) or any of them'),
	fetchType: z
		.enum(['All', 'Top', 'TopPercent'])
		.optional()
		.describe('Keep every match, the top N, or the top N percent'),
	fetchValue: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('N for Top, or the percentage for TopPercent'),
};

const CampaignContent = {
	name: z.string().min(1).describe('Campaign name'),
	subject: z.string().min(1).describe('Subject line'),
	senderEmail: Email.describe('Email of one of the account senders'),
	replyToEmail: Email.optional().describe(
		'Reply-to address; must be one of the account senders (sender when omitted)',
	),
	confirmationToEmail: Email.optional().describe(
		'Where Moosend sends its "campaign sent" confirmation (sender when omitted)',
	),
	htmlContent: z.string().optional().describe('Full HTML body'),
	webLocation: z
		.string()
		.url()
		.optional()
		.describe('URL Moosend fetches the HTML body from'),
	mailingLists: z
		.array(
			z.object({
				mailingListId: MailingListId,
				segmentId: SegmentId.optional().describe(
					'Send to this segment of the list only',
				),
			}),
		)
		.optional()
		.describe('Lists (and optional segments) the campaign goes to'),
	trackInGoogleAnalytics: z.boolean().optional(),
	isAB: z
		.boolean()
		.optional()
		.describe('Create an A/B split campaign (false when omitted)'),
	abCampaignType: z.enum(['Subjectline', 'Content', 'Sender']).optional(),
	subjectB: z.string().optional(),
	htmlContentB: z.string().optional(),
	webLocationB: z.string().url().optional(),
	senderEmailB: Email.optional(),
	hoursToTest: z.number().int().min(1).max(24).optional(),
	listPercentage: z.number().int().min(5).max(40).optional(),
	abWinnerSelectionType: z.enum(['OpenRate', 'TotalUniqueClicks']).optional(),
};

const StatsType = z
	.enum([
		'Sent',
		'Opened',
		'LinkClicked',
		'Forward',
		'Unsubscribed',
		'Bounced',
		'Complained',
		'Activity',
	])
	.describe('Which activity to list');

const Recipient = z.object({
	email: Email,
	name: z.string().optional(),
});

// ── Inputs ────────────────────────────────────────────────────────────────

export const MoosendEndpointInputSchemas = {
	listsList: z.object({
		withStatistics: z
			.boolean()
			.optional()
			.describe('Include subscriber counts (true when omitted)'),
		sortBy: z.string().optional().describe('List property to sort by'),
		sortMethod: SortMethod.optional(),
	}),
	listsListPaged: z.object({
		page: Page,
		pageSize: PageSize,
		sortBy: z.string().optional(),
		sortMethod: SortMethod.optional(),
	}),
	listsGet: z.object({
		mailingListId: MailingListId,
		withStatistics: z.boolean().optional(),
	}),
	listsCreate: z.object(ListSettings),
	listsUpdate: z.object({ mailingListId: MailingListId, ...ListSettings }),
	listsDelete: z.object({ mailingListId: MailingListId }),

	customFieldsCreate: z.object({
		mailingListId: MailingListId,
		...CustomFieldSettings,
	}),
	customFieldsUpdate: z.object({
		mailingListId: MailingListId,
		customFieldId: id('custom field'),
		...CustomFieldSettings,
	}),
	customFieldsDelete: z.object({
		mailingListId: MailingListId,
		customFieldId: id('custom field'),
	}),

	subscribersList: z.object({
		mailingListId: MailingListId,
		status: z
			.enum(['Subscribed', 'Unsubscribed', 'Bounced', 'Removed'])
			.optional()
			.describe('Which subscribers to list (Subscribed when omitted)'),
		page: Page.optional(),
		pageSize: PageSize.optional(),
	}),
	subscribersGetByEmail: z.object({
		mailingListId: MailingListId,
		email: Email,
	}),
	subscribersGetById: z.object({
		mailingListId: MailingListId,
		subscriberId: SubscriberId,
	}),
	subscribersGetByIdAnyList: z.object({ subscriberId: SubscriberId }),
	subscribersSubscribe: z.object({
		mailingListId: MailingListId,
		...SubscriberFields,
		hasExternalDoubleOptIn: z
			.boolean()
			.optional()
			.describe(
				'True when consent was collected elsewhere, so a double opt-in list does not email a confirmation',
			),
	}),
	subscribersSubscribeMany: z.object({
		mailingListId: MailingListId,
		subscribers: z.array(z.object(SubscriberFields)).min(1).max(1000),
		hasExternalDoubleOptIn: z.boolean().optional(),
	}),
	subscribersUpdate: z.object({
		mailingListId: MailingListId,
		subscriberId: SubscriberId,
		...SubscriberFields,
		hasExternalDoubleOptIn: z.boolean().optional(),
	}),
	subscribersUnsubscribe: z.object({
		mailingListId: MailingListId,
		email: Email,
	}),
	subscribersUnsubscribeFromCampaign: z.object({
		mailingListId: MailingListId,
		campaignId: CampaignId,
		email: Email,
	}),
	subscribersUnsubscribeFromAccount: z.object({ email: Email }),
	subscribersRemove: z.object({ mailingListId: MailingListId, email: Email }),
	subscribersRemoveMany: z.object({
		mailingListId: MailingListId,
		emails: z.array(Email).min(1).max(1000),
	}),
	subscribersDelete: z.object({ mailingListId: MailingListId, email: Email }),
	subscribersDeleteMany: z.object({
		mailingListId: MailingListId,
		emails: z.array(Email).min(1).max(1000),
	}),
	subscribersDeleteFromAccount: z.object({
		email: Email,
		includeAllSubAccounts: z
			.boolean()
			.optional()
			.describe('Also delete the address from every sub-account'),
	}),
	subscribersAddTags: z.object({
		mailingListId: MailingListId,
		members: z
			.array(z.object({ subscriberId: SubscriberId, tags: Tags.min(1) }))
			.min(1)
			.max(1000),
	}),
	subscribersRemoveTags: z.object({
		mailingListId: MailingListId,
		members: z
			.array(z.object({ subscriberId: SubscriberId, tags: Tags.min(1) }))
			.min(1)
			.max(1000),
	}),

	segmentsList: z.object({ mailingListId: MailingListId }),
	segmentsGet: z.object({ mailingListId: MailingListId, segmentId: SegmentId }),
	segmentsMembers: z.object({
		mailingListId: MailingListId,
		segmentId: SegmentId,
		page: Page.optional(),
		pageSize: PageSize.optional(),
	}),
	segmentsCreate: z.object({
		mailingListId: MailingListId,
		...SegmentSettings,
		criteria: z
			.array(Criterion)
			.optional()
			.describe('Filters; an empty segment matches every subscriber'),
	}),
	segmentsUpdate: z.object({
		mailingListId: MailingListId,
		segmentId: SegmentId,
		...SegmentSettings,
		criteria: z
			.array(Criterion)
			.optional()
			.describe('When given, replaces every existing criterion'),
	}),
	segmentsAddCriteria: z.object({
		mailingListId: MailingListId,
		segmentId: SegmentId,
		...Criterion.shape,
	}),
	segmentsUpdateCriteria: z.object({
		mailingListId: MailingListId,
		segmentId: SegmentId,
		criterionNumber: z
			.number()
			.int()
			.min(1)
			.describe(
				"The criterion's position in the segment, starting at 1 (not its ID)",
			),
		...Criterion.shape,
	}),
	segmentsDelete: z.object({
		mailingListId: MailingListId,
		segmentId: SegmentId,
	}),

	campaignsList: z.object({
		page: Page.optional(),
		pageSize: PageSize.optional().describe('Results per page (needs page)'),
		sortBy: z
			.string()
			.optional()
			.describe('Sort by this campaign property (needs pageSize)'),
		sortMethod: SortMethod.optional(),
	}),
	campaignsGet: z.object({ campaignId: CampaignId }),
	campaignsCreate: z.object(CampaignContent),
	campaignsUpdate: z.object({ campaignId: CampaignId, ...CampaignContent }),
	campaignsClone: z.object({ campaignId: CampaignId }),
	campaignsDelete: z.object({ campaignId: CampaignId }),
	campaignsSend: z.object({ campaignId: CampaignId }),
	campaignsSendTest: z.object({
		campaignId: CampaignId,
		testEmails: z
			.array(Email)
			.min(1)
			.max(5)
			.describe('Who gets the test email'),
	}),
	campaignsSchedule: z.object({
		campaignId: CampaignId,
		dateTime: z
			.string()
			.min(1)
			.describe('When to send, as Moosend expects it: "dd-MM-yyyy HH:mm"'),
		timezone: z
			.string()
			.optional()
			.describe('Windows time zone name, e.g. "US Eastern Standard Time"'),
	}),
	campaignsUnschedule: z.object({ campaignId: CampaignId }),
	campaignsSummary: z.object({ campaignId: CampaignId }),
	campaignsAbSummary: z.object({ campaignId: CampaignId }),
	campaignsStats: z.object({
		campaignId: CampaignId,
		type: StatsType.optional().describe(
			'Which activity to list (Sent when omitted)',
		),
		page: Page.optional(),
		pageSize: PageSize.optional(),
		from: z.string().optional().describe('Only activity on or after this date'),
		to: z.string().optional().describe('Only activity on or before this date'),
	}),
	campaignsActivityByLocation: z.object({ campaignId: CampaignId }),
	campaignsLinkActivity: z.object({ campaignId: CampaignId }),

	sendersList: z.object({}),
	sendersGet: z.object({ email: Email }),

	transactionalSend: z.object({
		templateId: z
			.string()
			.optional()
			.describe('Transactional campaign to send and record statistics on'),
		templateName: z
			.string()
			.optional()
			.describe(
				'Transactional campaign name; a new one is created when unknown',
			),
		from: Recipient.optional().describe('A verified sender'),
		replyTo: Recipient.optional(),
		subject: z.string().optional(),
		cc: z.array(Email).optional(),
		bcc: z.array(Email).optional(),
		content: z
			.array(
				z.object({
					type: z.string().min(1).describe('Content type, e.g. text/html'),
					value: z.string().optional(),
					webLocation: z.string().url().optional(),
				}),
			)
			.max(1)
			.optional()
			.describe('Message body; overrides the template content'),
		personalizations: z
			.array(
				z.object({
					to: z.array(Recipient).min(1),
					cc: z.array(Email).optional(),
					bcc: z.array(Email).optional(),
					// unknown: Mustache substitutions are any JSON the template reads.
					substitutions: z.record(z.string(), z.unknown()).optional(),
					customArguments: z.record(z.string(), z.string()).optional(),
				}),
			)
			.min(1)
			.describe('One entry per recipient group, with its substitutions'),
		mailSettings: z
			.object({
				bypassUnsubscribeManagement: z.boolean().optional(),
				includeUnsubscribeLink: z.boolean().optional(),
				scheduledForDatetime: z.string().optional(),
				scheduledForTimezone: z.string().optional(),
			})
			.optional(),
		attachments: z
			.array(
				z.object({
					content: z.string().min(1).describe('Base64 file bytes'),
					type: z.string().min(1).describe('MIME type'),
					fileName: z.string().min(1),
					disposition: z.enum(['inline', 'attachment']),
					contentId: z.string().optional(),
				}),
			)
			.optional(),
	}),
} as const;

// ── Outputs (lenient: Moosend's own PascalCase fields) ────────────────────

const str = z.string().nullish();
const num = z.number().nullish();
const bool = z.boolean().nullish();
// Moosend enums arrive as numbers on most routes; accept a name too.
const enumValue = z.union([z.number(), z.string()]).nullish();
// ASP.NET JSON dates such as "/Date(1795515243966+0000)/".
const date = z.string().nullish();

const PagingSchema = z
	.object({
		PageSize: num,
		CurrentPage: num,
		TotalResults: num,
		TotalPageCount: num,
		SortExpression: str,
		SortIsAscending: bool,
	})
	.passthrough();

const CustomFieldDefinitionSchema = z
	.object({
		ID: str,
		Name: str,
		Context: str,
		IsRequired: bool,
		IsHidden: bool,
		Type: enumValue,
	})
	.passthrough();

const ListPreferencesSchema = z
	.object({
		FallbackValue: str,
		IsRequired: bool,
		Options: z.array(z.string()).nullish(),
		SelectType: enumValue,
	})
	.passthrough();

export const MailingListSchema = z
	.object({
		ID: z.string(),
		Name: str,
		ActiveMemberCount: num,
		BouncedMemberCount: num,
		RemovedMemberCount: num,
		UnsubscribedMemberCount: num,
		Status: enumValue,
		CustomFieldsDefinition: z.array(CustomFieldDefinitionSchema).nullish(),
		CreatedBy: str,
		CreatedOn: date,
		UpdatedBy: str,
		UpdatedOn: date,
		Preferences: ListPreferencesSchema.nullish(),
	})
	.passthrough();

export const SubscriberSchema = z
	.object({
		ID: z.string(),
		Name: str,
		Mobile: str,
		Email: str,
		CreatedOn: date,
		UpdatedOn: date,
		UnsubscribedOn: date,
		UnsubscribedFromID: str,
		SubscribeType: enumValue.describe(
			'1 subscribed, 2 unsubscribed, 3 bounced, 4 removed',
		),
		SubscribeMethod: enumValue,
		CustomFields: z
			.array(
				z
					// unknown: a custom field value is text, a number, a date string,
					// a boolean or null depending on the field's type.
					.object({ CustomFieldID: str, Name: str, Value: z.unknown() })
					.passthrough(),
			)
			.nullish(),
		RemovedOn: date,
		Tags: z.array(z.string()).nullish(),
		// unknown: Moosend sends null, [] or the picked options.
		Preferences: z.unknown(),
	})
	.passthrough();

const CriterionSchema = z
	.object({
		ID: num,
		SegmentID: num,
		Field: enumValue,
		CustomFieldID: str,
		Comparer: enumValue,
		Value: str,
		DateFrom: date,
		DateTo: date,
		OtherMailingListID: str,
		CampaignID: str,
		ProductCode: str,
		DateFunction: enumValue,
		LastXMinutes: num,
		WebsiteId: str,
	})
	.passthrough();

export const SegmentSchema = z
	.object({
		ID: z.number(),
		Name: str,
		MatchType: enumValue,
		Criteria: z.array(CriterionSchema).nullish(),
		CreatedBy: str,
		CreatedOn: date,
		UpdatedBy: str,
		UpdatedOn: date,
		FetchType: enumValue,
		FetchValue: num,
		Description: str,
		SortBy: str,
		SegmentType: enumValue,
	})
	.passthrough();

export const SenderSchema = z
	.object({
		ID: str,
		Name: str,
		Email: str,
		CreatedOn: date,
		IsEnabled: bool,
		SpfVerified: bool,
		DkimVerified: bool,
		DkimPublic: str,
		DmarcVerified: bool,
		IsVerified: bool,
	})
	.passthrough();

const CampaignListItemSchema = z
	.object({
		ID: z.string(),
		Name: str,
		Subject: str,
		SiteName: str,
		ConfirmationTo: str,
		CreatedOn: date,
		Status: enumValue,
		DeliveredOn: date,
		ScheduledFor: date,
		ScheduledForTimezone: str,
		MailingLists: z
			.array(
				z
					.object({
						MailingList: MailingListSchema.nullish(),
						Segment: SegmentSchema.nullish(),
					})
					.passthrough(),
			)
			.nullish(),
		TotalSent: num,
		TotalOpens: num,
		UniqueOpens: num,
		TotalBounces: num,
		TotalForwards: num,
		UniqueForwards: num,
		TotalLinkClicks: num,
		UniqueLinkClicks: num,
		RecipientsCount: num,
		IsTransactional: bool,
		TotalComplaints: num,
		TotalUnsubscribes: num,
		CampaignType: str,
	})
	.passthrough();

export const CampaignSchema = z
	.object({
		ID: z.string(),
		Name: str,
		Subject: str,
		WebLocation: str,
		HTMLContent: str,
		PlainContent: str,
		Sender: SenderSchema.nullish(),
		DeliveredOn: date,
		ReplyToEmail: SenderSchema.nullish(),
		CreatedOn: date,
		UpdatedOn: date,
		ScheduledFor: date,
		Timezone: str,
		FormatType: enumValue,
		// unknown: only filled for A/B campaigns; documented loosely.
		ABCampaignData: z.unknown(),
		MailingLists: z
			.array(z.object({ MailingListID: str, SegmentID: num }).passthrough())
			.nullish(),
		ConfirmationTo: str,
		Status: enumValue,
		IsTransactional: bool,
	})
	.passthrough();

const CampaignSummarySchema = z
	.object({
		CampaignID: str,
		ABVersion: str,
		CampaignName: str,
		CampaignSubject: str,
		MailingLists: z
			.array(z.object({ MailingListID: str, SegmentID: num }).passthrough())
			.nullish(),
		CampaignDeliveredOn: date,
		To: date,
		From: date,
		TotalOpens: num,
		UniqueOpens: num,
		TotalBounces: num,
		TotalComplaints: num,
		TotalForwards: num,
		UniqueForwards: num,
		TotalUnsubscribes: num,
		TotalLinkClicks: num,
		UniqueLinkClicks: num,
		Sent: num,
	})
	.passthrough();

const AnalyticsItemSchema = z
	.object({
		Context: str,
		ContextName: str,
		ContextDescription: str,
		TotalCount: num,
		UniqueCount: num,
		Email: str,
		IpAddress: str,
		MailingListId: str,
		MemberID: str,
		Name: str,
		Status: enumValue,
		Timestamp: date,
	})
	.passthrough();

const AnalyticsSchema = z
	.object({
		Paging: PagingSchema.nullish(),
		Analytics: z.array(AnalyticsItemSchema),
	})
	.passthrough();

const SuccessSchema = z.object({
	success: z.literal(true).describe('Moosend answered Code 0 for the request'),
});

const BulkResultSchema = z
	.object({ EmailsProcessed: num, EmailsIgnored: num })
	.passthrough();

export const MoosendEndpointOutputSchemas = {
	listsList: z
		.object({
			Paging: PagingSchema.nullish(),
			MailingLists: z.array(MailingListSchema),
		})
		.passthrough(),
	listsListPaged: z
		.object({
			Paging: PagingSchema.nullish(),
			MailingLists: z.array(MailingListSchema),
		})
		.passthrough(),
	listsGet: MailingListSchema,
	listsCreate: z.object({ mailingListId: z.string() }),
	listsUpdate: z.object({ mailingListId: z.string() }),
	listsDelete: SuccessSchema,

	customFieldsCreate: z.object({ customFieldId: z.string() }),
	customFieldsUpdate: SuccessSchema,
	customFieldsDelete: SuccessSchema,

	subscribersList: z
		.object({
			Paging: PagingSchema.nullish(),
			Subscribers: z.array(SubscriberSchema),
		})
		.passthrough(),
	subscribersGetByEmail: SubscriberSchema,
	subscribersGetById: SubscriberSchema,
	subscribersGetByIdAnyList: SubscriberSchema,
	subscribersSubscribe: SubscriberSchema,
	subscribersSubscribeMany: z.object({
		subscribers: z.array(SubscriberSchema),
		notice: z
			.string()
			.nullable()
			.describe(
				'Moosend skips invalid addresses and says how many here; null when all were added',
			),
	}),
	subscribersUpdate: SubscriberSchema,
	subscribersUnsubscribe: SuccessSchema,
	subscribersUnsubscribeFromCampaign: SuccessSchema,
	subscribersUnsubscribeFromAccount: SuccessSchema,
	subscribersRemove: SuccessSchema,
	subscribersRemoveMany: BulkResultSchema,
	subscribersDelete: SuccessSchema,
	subscribersDeleteMany: BulkResultSchema,
	subscribersDeleteFromAccount: SuccessSchema,
	subscribersAddTags: SuccessSchema,
	subscribersRemoveTags: SuccessSchema,

	segmentsList: z
		.object({
			Paging: PagingSchema.nullish(),
			Segments: z.array(SegmentSchema),
		})
		.passthrough(),
	segmentsGet: SegmentSchema,
	segmentsMembers: z
		.object({
			Paging: PagingSchema.nullish(),
			Subscribers: z.array(SubscriberSchema),
		})
		.passthrough(),
	segmentsCreate: z.object({ segmentId: z.number() }),
	segmentsUpdate: SuccessSchema,
	segmentsAddCriteria: z.object({
		criterionNumber: z
			.number()
			.describe(
				"The new criterion's position in the segment; segments.updateCriteria takes it",
			),
	}),
	segmentsUpdateCriteria: SuccessSchema,
	segmentsDelete: SuccessSchema,

	campaignsList: z
		.object({
			Paging: PagingSchema.nullish(),
			Campaigns: z.array(CampaignListItemSchema),
		})
		.passthrough(),
	campaignsGet: CampaignSchema,
	campaignsCreate: z.object({ campaignId: z.string() }),
	campaignsUpdate: SuccessSchema,
	campaignsClone: CampaignSchema,
	campaignsDelete: SuccessSchema,
	campaignsSend: SuccessSchema,
	campaignsSendTest: SuccessSchema,
	campaignsSchedule: SuccessSchema,
	campaignsUnschedule: SuccessSchema,
	campaignsSummary: CampaignSummarySchema,
	// unknown: A/B summaries hold the A and B versions' stats and campaign
	// models, documented only loosely.
	campaignsAbSummary: z.record(z.string(), z.unknown()),
	campaignsStats: AnalyticsSchema,
	campaignsActivityByLocation: AnalyticsSchema,
	campaignsLinkActivity: AnalyticsSchema,

	sendersList: z.object({ senders: z.array(SenderSchema) }),
	sendersGet: SenderSchema,

	transactionalSend: z.object({
		// unknown: Moosend documents no response body for this call.
		result: z.unknown(),
	}),
} as const;

type Schemas = typeof MoosendEndpointInputSchemas;
type OutSchemas = typeof MoosendEndpointOutputSchemas;

export type MoosendEndpointInputs = {
	[K in keyof Schemas]: z.input<Schemas[K]>;
};
export type MoosendEndpointOutputs = {
	[K in keyof OutSchemas]: z.output<OutSchemas[K]>;
};

export type MailingList = z.output<typeof MailingListSchema>;
export type Subscriber = z.output<typeof SubscriberSchema>;
export type Segment = z.output<typeof SegmentSchema>;
export type Campaign = z.output<typeof CampaignSchema>;
export type Sender = z.output<typeof SenderSchema>;
