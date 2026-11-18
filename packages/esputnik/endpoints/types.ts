import { z } from 'zod';

// Field names, routes and response shapes follow the OpenAPI definitions
// published on https://docs.esputnik.com/reference (fetched 2026-11-05).

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

// eSputnik documents these responses as provider-defined JSON without stable
// envelopes, so expose a JSON-safe contract instead of leaking `unknown`.
const ProviderJsonSchema: z.ZodType<JsonValue> = z.json();
const JsonObjectSchema = z.record(z.string(), ProviderJsonSchema);
const JsonArraySchema = z.array(ProviderJsonSchema);
// `{ results: [...] }` envelopes (contact emails, the send calls). The
// handlers turn a single-object `results` into a one-element array.
const ResultsSchema = z
	.object({ results: JsonArraySchema })
	.catchall(ProviderJsonSchema);

// Mutations answer 200 with no body (contact deletes and updates) or with a
// sentence such as "Email with id='1' has been deleted" labelled
// application/json, which the shared HTTP client cannot parse and returns as
// `undefined`. Accept any JSON value or nothing so a change the provider
// already applied is never reported as a failure.
const AckOutputSchema = ProviderJsonSchema.optional();

// Provider request objects intentionally allow documented extension fields;
// eSputnik does not publish a closed schema for these payloads.
const GenericObjectSchema = z.record(z.string(), z.unknown());
// Message bodies vary by channel and are validated by the provider.
const GenericMessageBodySchema = z.record(z.string(), z.unknown());

const EmptyInputSchema = z.object({});
const IdPathSchema = z.object({ id: z.number().int().positive() });
const SessionPathSchema = z.object({ sessionId: z.string().min(1) });
const TokenPathSchema = z.object({
	app_uuid: z.string().min(1),
	token_id: z.string().min(1),
});
const LanguagePathSchema = z.object({
	id: z.number().int().positive(),
	language: z.string().min(2),
});
const PageQuerySchema = z.object({
	startindex: z.number().int().positive().optional(),
	maxrows: z.number().int().positive().max(500).optional(),
});
const MessageSearchSchema = PageQuerySchema.extend({
	search: z.string().optional(),
});

const ContactChannelSchema = z.object({
	type: z.string().min(1),
	value: z.string().min(1),
	// Mobile and web push token metadata; eSputnik owns these shapes.
	device: JsonObjectSchema.optional(),
	webPushSubscription: JsonObjectSchema.optional(),
});
const ContactBodySchema = z.object({
	id: z.number().int().positive().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	channels: z.array(ContactChannelSchema).min(1),
	address: z
		.object({
			region: z.string().optional(),
			town: z.string().optional(),
			address: z.string().optional(),
			postcode: z.string().optional(),
			countryCode: z.string().max(2).nullable().optional(),
		})
		.optional(),
	// Additional fields are sent as `{ id, value }` pairs; ids come from
	// contacts.getAdditionalFields.
	fields: z
		.array(z.object({ id: z.number().int(), value: z.string() }))
		.optional(),
	addressBookId: z.number().int().positive().optional(),
	externalCustomerId: z.string().optional(),
	languageCode: z.string().optional(),
	timeZone: z.string().optional(),
	marketId: z.string().optional(),
});
const SearchContactsSchema = PageQuerySchema.extend({
	externalCustomerId: z.string().optional(),
	email: z.string().email().optional(),
	sms: z.string().optional(),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	sortBy: z.literal('contactId').optional(),
});
const DeleteContactSchema = z.object({
	externalCustomerId: z.string().min(1),
	erase: z.boolean().optional(),
});
const SubscribeContactSchema = z.object({
	contact: ContactBodySchema,
	groups: z.array(z.string()).optional(),
	subscriptions: z.array(z.string()).optional(),
	formType: z.string().optional(),
});
const GroupMembersSchema = IdPathSchema.extend({
	contactIds: z.array(z.number().int().positive()).optional(),
	externalCustomerIds: z.array(z.string().min(1)).optional(),
}).refine(
	(value) =>
		(value.contactIds?.length ?? 0) > 0 ||
		(value.externalCustomerIds?.length ?? 0) > 0,
	'Pass contactIds or externalCustomerIds',
);
const ContactActivitySchema = z.object({
	dateFrom: z.string().min(1),
	dateTo: z.string().min(1),
	email: z.string().optional(),
	sms: z.string().optional(),
	webPushToken: z.string().optional(),
	mobPushToken: z.string().optional(),
	telegramToken: z.string().optional(),
	messageTag: z.string().optional(),
	activityStatus: z.string().optional(),
	offset: z.string().optional(),
	maxrows: z.number().int().positive().optional(),
});
const ContactMessagesSchema = z
	.object({
		dateFrom: z.string().min(1),
		dateTo: z.string().min(1),
		email: z.string().optional(),
		phone: z.string().optional(),
		contactId: z.number().int().positive().optional(),
		externalCustomerId: z.string().optional(),
		channelTypes: z.string().optional(),
		offset: z.number().int().nonnegative().optional(),
		maxrows: z.number().int().positive().max(100).optional(),
	})
	.refine(
		(value) =>
			value.email !== undefined ||
			value.phone !== undefined ||
			value.contactId !== undefined ||
			value.externalCustomerId !== undefined,
		'Pass email, phone, contactId or externalCustomerId',
	);

const EmailMessageBodySchema = z
	.object({
		name: z.string().min(1),
		from: z.string().min(1),
		subject: z.string().min(1),
		htmlText: z.string().min(1),
		template: z.boolean().optional(),
	})
	.passthrough();
const MobilePushBodySchema = z
	.object({
		name: z.string().min(1),
		title: z.string().min(1),
		text: z.string().min(1),
		languageCode: z.string().optional(),
		tags: z.array(z.string()).optional(),
		link: z.string().optional(),
		imageSource: z.string().optional(),
		customData: z.string().optional(),
		ttlSec: z.number().int().positive().optional(),
		soundEnabled: z.boolean().optional(),
		badgeCount: z.number().int().optional(),
		images: z.array(z.string()).max(10).optional(),
	})
	.passthrough();
const SendPreparedMessageSchema = IdPathSchema.extend({
	recipients: z
		.array(
			z.object({
				contactId: z.number().int().positive().optional(),
				externalCustomerId: z.string().optional(),
				locator: z.string().optional(),
				// Per-recipient personalisation data, serialized as a JSON string.
				jsonParam: z.string().optional(),
				externalRequestId: z.string().optional(),
				languageCode: z.string().optional(),
			}),
		)
		.min(1),
	email: z.boolean().optional(),
	fromName: z.string().optional(),
});
const InteractionStatusSchema = z.object({
	interactionId: z.string().min(1),
	token: z.string().optional(),
	status: z.enum(['DELIVERED', 'OPENED', 'CLICKED', 'UNDELIVERED']).optional(),
	time: z.string().optional(),
});

// Broadcast ids are strings in eSputnik's API; numeric ids are accepted too.
const BroadcastIdSchema = z.object({
	id: z.union([z.string().min(1), z.number().int().positive()]),
});
const CreateBroadcastSchema = z.object({
	title: z.string().optional(),
	messageId: z.string().min(1),
	groups: z.array(z.number().int().positive()).min(1),
	excludedGroups: z.array(z.number().int().positive()).optional(),
	startDate: z.string().optional(),
	batchSize: z.number().int().positive().optional(),
	batchIntervalUnit: z.enum(['MINUTE', 'HOUR', 'DAY', 'MONTH']).optional(),
	domain: z.string().optional(),
	appId: z.string().optional(),
});

const DateRangeSchema = z.object({
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
});
const DomainSchema = z.object({ domain: z.string().min(1) });
const WebPushDomainSchema = z.object({
	domain: z.string().min(1),
	serviceWorkerName: z.string().min(1),
	serviceWorkerPath: z.string().min(1),
	serviceWorkerScope: z.string().min(1),
});
const ProductFeedsSchema = z.object({
	feeds: z
		.array(
			z.object({
				url: z.string().min(1),
				language: z.string().optional(),
				default: z.boolean().optional(),
			}),
		)
		.min(1),
});
const AppPathSchema = z.object({ app_uuid: z.string().min(1) });
const AddAppTokensSchema = AppPathSchema.extend({
	tokens: z
		.array(
			z.object({
				token: z.string().min(1),
				contactId: z.number().int().positive().optional(),
				externalCustomerId: z.string().optional(),
				phone: z.string().optional(),
				email: z.string().optional(),
			}),
		)
		.min(1),
});
const MuteAppTokenSchema = AppPathSchema.extend({
	token: z.string().min(1),
	duration: z.number().int().positive().optional(),
});
const UnmuteAppTokenSchema = AppPathSchema.extend({
	token: z.string().min(1),
});
const PromocodesQuerySchema = z.object({
	type: z.string().optional(),
	inUse: z.boolean().optional(),
	activeDueDays: z.number().int().positive().optional(),
	discount: z.number().int().optional(),
});
const PromocodesCountQuerySchema = PromocodesQuerySchema.omit({ inUse: true });
const InsertPromocodesSchema = z.object({
	promocodes: z.array(z.string().min(1)).min(1),
	expirationDate: z.string().min(1),
	discount: z.number().int(),
	type: z.string().optional(),
	inUse: z.boolean().optional(),
});
const UploadPreprocessorFileSchema = z.object({
	link: z.string().min(1),
	preprocessorType: z.string().min(1),
	ttlHours: z.number().int().positive().optional(),
});
const UpdatePreprocessorFileSchema = z.object({
	fileId: z.string().min(1),
	link: z.string().min(1),
	ttlHours: z.number().int().positive().optional(),
});

const AccountInfoSchema = z.object({
	orgId: z.number().int().optional(),
	userEmail: z.string().optional(),
	organisationName: z.string().optional(),
});
const BalanceSchema = z
	.object({
		currentBalance: z.number().optional(),
		creditLimit: z.number().optional(),
		currency: z.string().optional(),
	})
	.passthrough();
const ContactSchema = z
	.object({ id: z.number().int().optional() })
	.passthrough();
const ContactSubscriptionResultSchema = z.object({
	id: z.number().int().optional(),
	emailStatus: z.string().optional(),
	isNew: z.boolean().optional(),
});
const IdResultSchema = z.object({ id: z.number().int() });

export const EsputnikEndpointInputSchemas = {
	getAccountInfo: EmptyInputSchema,
	getBalance: EmptyInputSchema,
	getOrganisationBalanceHistory: DateRangeSchema,
	generateApiToken: EmptyInputSchema,

	addContact: ContactBodySchema,
	getContact: IdPathSchema,
	updateContact: IdPathSchema.and(ContactBodySchema),
	deleteContactById: IdPathSchema.extend({ erase: z.boolean().optional() }),
	deleteContactByExternalCustomerId: DeleteContactSchema,
	searchContacts: SearchContactsSchema,
	subscribeContact: SubscribeContactSchema,
	contactsBulkUpdate: GenericObjectSchema,
	fileContactsBulkUpdate: GenericObjectSchema,
	getImportSessionStatus: SessionPathSchema,
	getContactEmails: z.object({ ids: z.string().min(1) }),
	addToUnsubscribed: z.object({ emails: z.array(z.string().email()).min(1) }),
	deleteFromUnsubscribed: z.object({
		emails: z.array(z.string().email()).min(1),
	}),
	getGroupContacts: IdPathSchema.merge(PageQuerySchema).extend({
		orderByTs: z.boolean().optional(),
		asc: z.boolean().optional(),
	}),
	detachContactsFromGroup: GroupMembersSchema,
	attachContactsToGroup: GroupMembersSchema,
	searchGroups: PageQuerySchema.extend({ name: z.string().optional() }),
	searchWorkflows: PageQuerySchema.extend({ name: z.string().optional() }),
	getContactIdByToken: TokenPathSchema,
	getContactSubscriptionCategories: IdPathSchema,
	changeContactSubscriptionCategories: IdPathSchema.extend({
		subscriptions: z.array(z.string()).min(1),
	}),
	contactRecoms: z
		.object({
			dataSourceId: z.number().int().positive(),
			contactId: z.number().int().optional(),
			email: z.string().email().optional(),
			phone: z.string().optional(),
			externalCustomerId: z.string().optional(),
			webId: z.string().optional(),
			products: z.string().optional(),
			category: z.string().optional(),
		})
		.refine(
			(value) =>
				value.contactId !== undefined ||
				value.email !== undefined ||
				value.phone !== undefined ||
				value.externalCustomerId !== undefined ||
				value.webId !== undefined,
			'A contact identifier is required',
		),
	getAdditionalFields: EmptyInputSchema,
	getSubscriptionCategories: EmptyInputSchema,
	contactActivity: ContactActivitySchema,
	contactMessages: ContactMessagesSchema,
	getTokenActivated: TokenPathSchema,
	changeTokenActivated: TokenPathSchema.extend({ active: z.boolean() }),

	ordersBulkInsert: GenericObjectSchema,

	registerEvent: GenericObjectSchema,
	sendHistoryEvents: GenericObjectSchema,
	removeHistoryEvents: GenericObjectSchema,

	searchEmails: MessageSearchSchema,
	getEmailMessageViewLink: IdPathSchema,
	addEmail: EmailMessageBodySchema,
	getEmail: IdPathSchema,
	updateMessage: IdPathSchema.and(EmailMessageBodySchema),
	deleteEmail: IdPathSchema,
	updateTranslatedMessage: LanguagePathSchema.and(EmailMessageBodySchema),
	deleteTranslatedEmail: LanguagePathSchema,
	sendEmail: GenericObjectSchema,

	searchMobilePushMessages: MessageSearchSchema,
	addMobilePushMessage: MobilePushBodySchema,
	getMobilePushMessage: IdPathSchema,
	updateBaseMobilePushMessage: IdPathSchema.and(MobilePushBodySchema),
	deleteMobilePushMessage: IdPathSchema,
	updateTranslatedMobilePushMessage:
		LanguagePathSchema.and(MobilePushBodySchema),
	deleteTranslatedMobilePushMessage: LanguagePathSchema,

	searchViberMessages: MessageSearchSchema,
	addViberMessage: GenericMessageBodySchema,
	getViberMessage: IdPathSchema,
	updateBaseViberMessage: IdPathSchema.and(GenericMessageBodySchema),
	deleteViberMessage: IdPathSchema,
	updateTranslatedViberMessage: LanguagePathSchema.and(
		GenericMessageBodySchema,
	),
	deleteTranslatedViberMessage: LanguagePathSchema,
	sendViber: GenericMessageBodySchema,

	searchAppInboxMessages: MessageSearchSchema,
	addAppInboxMessage: GenericMessageBodySchema,
	getAppInboxMessage: IdPathSchema,
	updateBaseAppInboxMessage: IdPathSchema.and(GenericMessageBodySchema),
	deleteAppInboxMessage: IdPathSchema,
	updateTranslatedAppInboxMessage: LanguagePathSchema.and(
		GenericMessageBodySchema,
	),
	deleteTranslatedAppInboxMessage: LanguagePathSchema,

	searchTelegramBotMessages: MessageSearchSchema,
	addTelegramBotMessage: GenericMessageBodySchema,
	getTelegramBotMessage: IdPathSchema,
	updateBaseTelegramBotMessage: IdPathSchema.and(GenericMessageBodySchema),
	deleteTelegramBotMessage: IdPathSchema,
	updateTranslatedTelegramMessage: LanguagePathSchema.and(
		GenericMessageBodySchema,
	),
	deleteTranslatedTelegramMessage: LanguagePathSchema,

	searchSmsMessages: MessageSearchSchema,
	addSmsMessage: GenericMessageBodySchema,
	getSms: IdPathSchema,
	updateBaseSmsMessage: IdPathSchema.and(GenericMessageBodySchema),
	deleteSmsMessage: IdPathSchema,
	updateTranslatedSmsMessage: LanguagePathSchema.and(GenericMessageBodySchema),
	deleteTranslatedSmsMessage: LanguagePathSchema,
	sendSms: GenericMessageBodySchema,

	getBroadcasts: PageQuerySchema,
	createBroadcast: CreateBroadcastSchema,
	getBroadcast: BroadcastIdSchema,
	cancelBroadcast: BroadcastIdSchema,

	getSmsInterfaces: EmptyInputSchema,
	getEmailInterfaces: EmptyInputSchema,

	sendPreparedMessage: SendPreparedMessageSchema,
	updateInteractionStatus: InteractionStatusSchema,

	getDomains: EmptyInputSchema,
	createDomain: DomainSchema,
	getScript: EmptyInputSchema,
	getWebPushDomains: EmptyInputSchema,
	addWebPushDomain: WebPushDomainSchema,
	deleteWebPushDomain: DomainSchema,
	getWebPushScript: z.object({ domain: z.string().optional() }),

	getProductFeedsConfiguration: EmptyInputSchema,
	configureProductFeeds: ProductFeedsSchema,

	addAppTokens: AddAppTokensSchema,
	muteAppToken: MuteAppTokenSchema,
	unmuteAppToken: UnmuteAppTokenSchema,

	getPromocodes: PromocodesQuerySchema,
	getPromocodesCount: PromocodesCountQuerySchema,
	insertPromocodes: InsertPromocodesSchema,

	getPreprocessorFileStatus: SessionPathSchema,
	updatePreprocessorFile: UpdatePreprocessorFileSchema,
	uploadPreprocessorFile: UploadPreprocessorFileSchema,
} as const;

// JsonValue outputs are intentionally broad because eSputnik publishes no
// stable response envelope for these operations; they stay JSON-safe instead
// of exposing `unknown` to callers.
export const EsputnikEndpointOutputSchemas = {
	getAccountInfo: AccountInfoSchema,
	getBalance: BalanceSchema,
	getOrganisationBalanceHistory: JsonObjectSchema,
	// The bearer token comes back as a bare string.
	generateApiToken: ProviderJsonSchema,

	addContact: IdResultSchema,
	getContact: ContactSchema,
	updateContact: AckOutputSchema,
	deleteContactById: AckOutputSchema,
	deleteContactByExternalCustomerId: AckOutputSchema,
	searchContacts: z.array(ContactSchema),
	subscribeContact: ContactSubscriptionResultSchema,
	contactsBulkUpdate: JsonObjectSchema,
	fileContactsBulkUpdate: JsonObjectSchema,
	getImportSessionStatus: JsonObjectSchema,
	getContactEmails: ResultsSchema,
	addToUnsubscribed: AckOutputSchema,
	deleteFromUnsubscribed: AckOutputSchema,
	getGroupContacts: JsonArraySchema,
	detachContactsFromGroup: AckOutputSchema,
	attachContactsToGroup: AckOutputSchema,
	searchGroups: JsonArraySchema,
	searchWorkflows: JsonArraySchema,
	getContactIdByToken: IdResultSchema,
	// Documented as one object; live it is a list ([] with no subscriptions).
	getContactSubscriptionCategories: JsonArraySchema,
	changeContactSubscriptionCategories: AckOutputSchema,
	contactRecoms: JsonArraySchema,
	getAdditionalFields: JsonObjectSchema,
	getSubscriptionCategories: JsonArraySchema,
	contactActivity: JsonArraySchema,
	contactMessages: JsonArraySchema,
	getTokenActivated: z.object({ active: z.boolean() }),
	changeTokenActivated: z.object({ active: z.boolean() }),

	ordersBulkInsert: JsonObjectSchema,

	registerEvent: AckOutputSchema,
	sendHistoryEvents: JsonObjectSchema,
	removeHistoryEvents: AckOutputSchema,

	searchEmails: JsonArraySchema,
	getEmailMessageViewLink: JsonObjectSchema,
	addEmail: IdResultSchema,
	getEmail: JsonObjectSchema,
	updateMessage: AckOutputSchema,
	deleteEmail: AckOutputSchema,
	updateTranslatedMessage: AckOutputSchema,
	deleteTranslatedEmail: AckOutputSchema,
	sendEmail: ResultsSchema,

	searchMobilePushMessages: JsonArraySchema,
	addMobilePushMessage: IdResultSchema,
	getMobilePushMessage: JsonObjectSchema,
	updateBaseMobilePushMessage: AckOutputSchema,
	deleteMobilePushMessage: AckOutputSchema,
	updateTranslatedMobilePushMessage: AckOutputSchema,
	deleteTranslatedMobilePushMessage: AckOutputSchema,

	searchViberMessages: JsonArraySchema,
	addViberMessage: IdResultSchema,
	getViberMessage: JsonObjectSchema,
	updateBaseViberMessage: AckOutputSchema,
	deleteViberMessage: AckOutputSchema,
	updateTranslatedViberMessage: AckOutputSchema,
	deleteTranslatedViberMessage: AckOutputSchema,
	sendViber: ResultsSchema,

	searchAppInboxMessages: JsonArraySchema,
	addAppInboxMessage: IdResultSchema,
	getAppInboxMessage: JsonObjectSchema,
	updateBaseAppInboxMessage: AckOutputSchema,
	deleteAppInboxMessage: AckOutputSchema,
	updateTranslatedAppInboxMessage: AckOutputSchema,
	deleteTranslatedAppInboxMessage: AckOutputSchema,

	searchTelegramBotMessages: JsonArraySchema,
	addTelegramBotMessage: IdResultSchema,
	getTelegramBotMessage: JsonObjectSchema,
	updateBaseTelegramBotMessage: AckOutputSchema,
	deleteTelegramBotMessage: AckOutputSchema,
	updateTranslatedTelegramMessage: AckOutputSchema,
	deleteTranslatedTelegramMessage: AckOutputSchema,

	searchSmsMessages: JsonArraySchema,
	addSmsMessage: IdResultSchema,
	getSms: JsonObjectSchema,
	updateBaseSmsMessage: AckOutputSchema,
	deleteSmsMessage: AckOutputSchema,
	updateTranslatedSmsMessage: AckOutputSchema,
	deleteTranslatedSmsMessage: AckOutputSchema,
	sendSms: ResultsSchema,

	getBroadcasts: JsonArraySchema,
	createBroadcast: JsonObjectSchema,
	getBroadcast: JsonObjectSchema,
	cancelBroadcast: AckOutputSchema,

	getSmsInterfaces: JsonArraySchema,
	getEmailInterfaces: JsonArraySchema,

	// `results` is an object for one recipient and an array for several.
	sendPreparedMessage: ResultsSchema,
	updateInteractionStatus: AckOutputSchema,

	// The docs say the body is empty when no domain is registered (live: []).
	getDomains: JsonArraySchema,
	createDomain: JsonObjectSchema,
	getScript: z.string(),
	getWebPushDomains: JsonObjectSchema,
	addWebPushDomain: JsonObjectSchema,
	deleteWebPushDomain: AckOutputSchema,
	getWebPushScript: JsonObjectSchema,

	getProductFeedsConfiguration: JsonObjectSchema,
	configureProductFeeds: AckOutputSchema,

	addAppTokens: AckOutputSchema,
	muteAppToken: AckOutputSchema,
	unmuteAppToken: AckOutputSchema,

	// Documented as a JSON string of codes.
	getPromocodes: ProviderJsonSchema,
	// Documented without a response schema; an account with no codes gets [].
	getPromocodesCount: AckOutputSchema,
	insertPromocodes: AckOutputSchema,

	// Documented without a response schema.
	getPreprocessorFileStatus: AckOutputSchema,
	updatePreprocessorFile: JsonObjectSchema,
	uploadPreprocessorFile: JsonObjectSchema,
} as const satisfies Record<
	keyof typeof EsputnikEndpointInputSchemas,
	z.ZodType
>;

export type EsputnikOperation = keyof typeof EsputnikEndpointInputSchemas;

export type EsputnikEndpointInputs = {
	[K in EsputnikOperation]: z.infer<(typeof EsputnikEndpointInputSchemas)[K]>;
};

export type EsputnikEndpointOutputs = {
	[K in EsputnikOperation]: z.infer<(typeof EsputnikEndpointOutputSchemas)[K]>;
};
