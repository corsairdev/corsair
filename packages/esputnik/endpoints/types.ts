import { z } from 'zod';

type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

// eSputnik documents these responses as provider-defined JSON without stable
// envelopes, so expose a JSON-safe contract instead of leaking `unknown`.
const ProviderJsonSchema: z.ZodType<JsonValue> = z.json();

const EmptyInputSchema = z.object({});
const ContactIdSchema = z.object({ id: z.number().int().positive() });
const ContactBodySchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	channels: z.array(z.object({ type: z.string(), value: z.string() })).min(1),
	externalCustomerId: z.string().optional(),
	addressBookId: z.number().int().positive().optional(),
	languageCode: z.string().optional(),
	timeZone: z.string().optional(),
	marketId: z.string().optional(),
	// Contact address and custom fields are provider-defined key/value bags;
	// accept any JSON value so create/update does not drop caller extensions.
	address: z.record(z.string(), ProviderJsonSchema).optional(),
	fields: z.record(z.string(), ProviderJsonSchema).optional(),
});
const SearchContactsSchema = z.object({
	externalCustomerId: z.string().optional(),
	email: z.string().email().optional(),
	sms: z.string().optional(),
	firstname: z.string().optional(),
	lastname: z.string().optional(),
	startindex: z.number().int().positive().optional(),
	maxrows: z.number().int().positive().max(500).optional(),
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
const ContactPageQuerySchema = z.object({
	startindex: z.number().int().positive().optional(),
	maxrows: z.number().int().positive().max(500).optional(),
});
const IdPathSchema = z.object({ id: z.number().int().positive() });
const SessionPathSchema = z.object({ sessionId: z.string().min(1) });
const TokenPathSchema = z.object({
	app_uuid: z.string().min(1),
	token_id: z.string().min(1),
});
// Provider request objects intentionally allow documented extension fields;
// eSputnik does not publish a closed schema for these payloads.
const GenericObjectSchema = z.record(z.string(), z.unknown());

// Mutations answer with an empty body, a bare string or a small JSON value,
// depending on the route and the response Content-Type. The shared HTTP
// client turns an empty JSON body into `undefined` and an empty text body
// into ''. Accept all of them so a change the provider already applied is
// never reported as a failure.
const AckOutputSchema = ProviderJsonSchema.optional();
type AckOutput = JsonValue | undefined;

const EmailListSchema = z.object({
	emails: z.array(z.string().email()).min(1),
});
const DateRangeSchema = z.object({
	dateFrom: z.string().optional(),
	dateTo: z.string().optional(),
});
const EmailMessageBodySchema = z
	.object({
		name: z.string().min(1),
		from: z.string().min(1),
		subject: z.string().min(1),
		htmlText: z.string().min(1),
		template: z.boolean().optional(),
	})
	.passthrough();
const EmailLanguagePathSchema = z.object({
	id: z.number().int().positive(),
	language: z.string().min(2),
});
// Query filters are provider-defined and forwarded without transformation.
const BehaviorQuerySchema = z.record(z.string(), z.unknown());
const DomainSchema = z.object({ domain: z.string().min(1) });
const WebPushDomainSchema = z.object({
	domain: z.string().min(1),
	serviceWorkerName: z.string().min(1),
	serviceWorkerPath: z.string().min(1),
	serviceWorkerScope: z.string().min(1),
});
const MessageSearchSchema = ContactPageQuerySchema.extend({
	search: z.string().optional(),
});
// Message bodies vary by channel and are validated by the provider.
const GenericMessageBodySchema = z.record(z.string(), z.unknown());
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

export type EsputnikEndpointInputs = {
	getAccountInfo: Record<string, never>;
	getBalance: Record<string, never>;
	addContact: z.infer<typeof ContactBodySchema>;
	getContact: z.infer<typeof ContactIdSchema>;
	updateContact: z.infer<typeof ContactIdSchema> &
		z.infer<typeof ContactBodySchema>;
	deleteContactByExternalCustomerId: z.infer<typeof DeleteContactSchema>;
	searchContacts: z.infer<typeof SearchContactsSchema>;
	subscribeContact: z.infer<typeof SubscribeContactSchema>;
	contactsBulkUpdate: z.infer<typeof GenericObjectSchema>;
	fileContactsBulkUpdate: z.infer<typeof GenericObjectSchema>;
	getImportSessionStatus: z.infer<typeof SessionPathSchema>;
	getContactEmails: { ids: string };
	addToUnsubscribed: z.infer<typeof EmailListSchema>;
	deleteFromUnsubscribed: z.infer<typeof EmailListSchema>;
	getGroupContacts: z.infer<typeof IdPathSchema> &
		z.infer<typeof ContactPageQuerySchema> & {
			orderByTs?: boolean;
			asc?: boolean;
		};
	detachContactsFromGroup: z.infer<typeof IdPathSchema> &
		z.infer<typeof GenericObjectSchema>;
	attachContactsToGroup: z.infer<typeof IdPathSchema> &
		z.infer<typeof GenericObjectSchema>;
	searchGroups: z.infer<typeof ContactPageQuerySchema> & { name?: string };
	searchWorkflows: z.infer<typeof ContactPageQuerySchema> & { name?: string };
	getContactIdByToken: z.infer<typeof TokenPathSchema>;
	getContactSubscriptionCategories: z.infer<typeof IdPathSchema>;
	changeContactSubscriptionCategories: z.infer<typeof IdPathSchema> & {
		subscriptions: string[];
	};
	deleteContactById: z.infer<typeof IdPathSchema> & { erase?: boolean };
	contactRecoms: {
		dataSourceId: number;
		contactId?: number;
		email?: string;
		phone?: string;
		externalCustomerId?: string;
		webId?: string;
		products?: string;
		category?: string;
	};
	getAdditionalFields: Record<string, never>;
	getOrganisationBalanceHistory: z.infer<typeof DateRangeSchema>;
	ordersBulkInsert: z.infer<typeof GenericObjectSchema>;
	registerEvent: z.infer<typeof GenericObjectSchema>;
	sendHistoryEvents: z.infer<typeof GenericObjectSchema>;
	removeHistoryEvents: z.infer<typeof GenericObjectSchema>;
	searchEmails: z.infer<typeof ContactPageQuerySchema> & {
		name?: string;
		tag?: string;
	};
	getEmailMessageViewLink: z.infer<typeof IdPathSchema>;
	sendPreparedMessage: z.infer<typeof GenericObjectSchema>;
	addEmail: z.infer<typeof EmailMessageBodySchema>;
	getEmail: z.infer<typeof IdPathSchema>;
	updateMessage: z.infer<typeof IdPathSchema> &
		z.infer<typeof EmailMessageBodySchema>;
	deleteEmail: z.infer<typeof IdPathSchema>;
	updateTranslatedMessage: z.infer<typeof EmailLanguagePathSchema> &
		z.infer<typeof EmailMessageBodySchema>;
	deleteTranslatedEmail: z.infer<typeof EmailLanguagePathSchema>;
	sendEmail: z.infer<typeof GenericObjectSchema>;
	searchMobilePushMessages: z.infer<typeof ContactPageQuerySchema> & {
		search?: string;
	};
	addMobilePushMessage: z.infer<typeof MobilePushBodySchema>;
	getMobilePushMessage: z.infer<typeof IdPathSchema>;
	updateBaseMobilePushMessage: z.infer<typeof IdPathSchema> &
		z.infer<typeof MobilePushBodySchema>;
	deleteMobilePushMessage: z.infer<typeof IdPathSchema>;
	updateTranslatedMobilePushMessage: z.infer<typeof EmailLanguagePathSchema> &
		z.infer<typeof MobilePushBodySchema>;
	deleteTranslatedMobilePushMessage: z.infer<typeof EmailLanguagePathSchema>;
	searchViberMessages: z.infer<typeof MessageSearchSchema>;
	addViberMessage: z.infer<typeof GenericMessageBodySchema>;
	getViberMessage: z.infer<typeof IdPathSchema>;
	updateBaseViberMessage: z.infer<typeof IdPathSchema> &
		z.infer<typeof GenericMessageBodySchema>;
	deleteViberMessage: z.infer<typeof IdPathSchema>;
	searchAppInboxMessages: z.infer<typeof MessageSearchSchema>;
	addAppInboxMessage: z.infer<typeof GenericMessageBodySchema>;
	getAppInboxMessage: z.infer<typeof IdPathSchema>;
	updateBaseAppInboxMessage: z.infer<typeof IdPathSchema> &
		z.infer<typeof GenericMessageBodySchema>;
	deleteAppInboxMessage: z.infer<typeof IdPathSchema>;
	searchTelegramBotMessages: z.infer<typeof MessageSearchSchema>;
	addTelegramBotMessage: z.infer<typeof GenericMessageBodySchema>;
	getTelegramBotMessage: z.infer<typeof IdPathSchema>;
	updateBaseTelegramBotMessage: z.infer<typeof IdPathSchema> &
		z.infer<typeof GenericMessageBodySchema>;
	deleteTelegramBotMessage: z.infer<typeof IdPathSchema>;
	searchSmsMessages: z.infer<typeof MessageSearchSchema>;
	getSms: z.infer<typeof IdPathSchema>;
	updateBaseSmsMessage: z.infer<typeof IdPathSchema> &
		z.infer<typeof GenericMessageBodySchema>;
	deleteSmsMessage: z.infer<typeof IdPathSchema>;
	getBroadcasts: z.infer<typeof MessageSearchSchema>;
	createBroadcast: z.infer<typeof GenericMessageBodySchema>;
	getBroadcast: z.infer<typeof IdPathSchema>;
	getSmsInterfaces: Record<string, never>;
	getEmailInterfaces: Record<string, never>;
	updateTranslatedViberMessage: z.infer<typeof EmailLanguagePathSchema> &
		z.infer<typeof GenericObjectSchema>;
	deleteTranslatedViberMessage: z.infer<typeof EmailLanguagePathSchema>;
	updateTranslatedAppInboxMessage: z.infer<typeof EmailLanguagePathSchema> &
		z.infer<typeof GenericObjectSchema>;
	deleteTranslatedAppInboxMessage: z.infer<typeof EmailLanguagePathSchema>;
	updateTranslatedTelegramMessage: z.infer<typeof EmailLanguagePathSchema> &
		z.infer<typeof GenericObjectSchema>;
	deleteTranslatedTelegramMessage: z.infer<typeof EmailLanguagePathSchema>;
	addSmsMessage: z.infer<typeof GenericObjectSchema>;
	sendSms: z.infer<typeof GenericObjectSchema>;
	cancelBroadcast: z.infer<typeof IdPathSchema>;
	contactActivity: z.infer<typeof BehaviorQuerySchema>;
	contactMessages: z.infer<typeof BehaviorQuerySchema>;
	getTokenActivated: z.infer<typeof TokenPathSchema>;
	changeTokenActivated: z.infer<typeof TokenPathSchema> & { active: boolean };
	getDomains: Record<string, never>;
	createDomain: z.infer<typeof DomainSchema>;
	getScript: Record<string, never>;
	getWebPushDomains: Record<string, never>;
	addWebPushDomain: z.infer<typeof WebPushDomainSchema>;
	deleteWebPushDomain: { domain: string };
	getWebPushScript: { domain?: string };
	getProductFeedsConfiguration: Record<string, never>;
	configureProductFeeds: z.infer<typeof GenericObjectSchema>;
	addAppTokens: z.infer<typeof GenericObjectSchema>;
	muteAppToken: z.infer<typeof GenericObjectSchema>;
	unmuteAppToken: z.infer<typeof GenericObjectSchema>;
	getSubscriptionCategories: Record<string, never>;
	getPromocodes: z.infer<typeof GenericObjectSchema>;
	getPromocodesCount: Record<string, never>;
	insertPromocodes: z.infer<typeof GenericObjectSchema>;
	getPreprocessorFileStatus: z.infer<typeof SessionPathSchema>;
	updatePreprocessorFile: z.infer<typeof GenericObjectSchema>;
	uploadPreprocessorFile: z.infer<typeof GenericObjectSchema>;
	generateApiToken: z.infer<typeof GenericObjectSchema>;
	getInteractionStatus: z.infer<typeof GenericObjectSchema>;
	sendViber: z.infer<typeof GenericObjectSchema>;
	sendAppInbox: z.infer<typeof GenericObjectSchema>;
	sendTelegramBot: z.infer<typeof GenericObjectSchema>;
	updateTranslatedSmsMessage: z.infer<typeof EmailLanguagePathSchema> &
		z.infer<typeof GenericObjectSchema>;
	deleteTranslatedSmsMessage: z.infer<typeof EmailLanguagePathSchema>;
};

export type EsputnikEndpointOutputs = {
	// JsonValue fields below are intentionally broad because eSputnik publishes
	// no stable response envelope for these operations; they remain JSON-safe
	// instead of exposing `unknown` to callers.
	getAccountInfo: z.infer<typeof AccountInfoSchema>;
	getBalance: z.infer<typeof BalanceSchema>;
	addContact: { id: number };
	getContact: z.infer<typeof ContactSchema>;
	updateContact: AckOutput;
	// eSputnik documents an empty response for this mutation, so the provider
	// response is intentionally opaque and accepted without a local envelope.
	deleteContactByExternalCustomerId: AckOutput;
	searchContacts: z.infer<typeof ContactSchema>[];
	subscribeContact: z.infer<typeof ContactSubscriptionResultSchema>;
	// Bulk/import response envelopes vary by provider validation outcome and are
	// not stable enough in the public OpenAPI contract for a narrower type.
	contactsBulkUpdate: Record<string, JsonValue>;
	fileContactsBulkUpdate: Record<string, JsonValue>;
	getImportSessionStatus: Record<string, JsonValue>;
	getContactEmails: Record<string, JsonValue>;
	addToUnsubscribed: AckOutput;
	deleteFromUnsubscribed: AckOutput;
	getGroupContacts: JsonValue[];
	detachContactsFromGroup: AckOutput;
	attachContactsToGroup: AckOutput;
	searchGroups: JsonValue[];
	searchWorkflows: JsonValue[];
	getContactIdByToken: { id: number };
	getContactSubscriptionCategories: JsonValue[];
	changeContactSubscriptionCategories: AckOutput;
	deleteContactById: AckOutput;
	contactRecoms: JsonValue[];
	getAdditionalFields: Record<string, JsonValue>;
	getOrganisationBalanceHistory: Record<string, JsonValue>;
	ordersBulkInsert: Record<string, JsonValue>;
	registerEvent: AckOutput;
	sendHistoryEvents: Record<string, JsonValue>;
	removeHistoryEvents: AckOutput;
	searchEmails: JsonValue[];
	getEmailMessageViewLink: Record<string, JsonValue>;
	sendPreparedMessage: JsonValue;
	addEmail: { id: number };
	getEmail: Record<string, JsonValue>;
	updateMessage: AckOutput;
	deleteEmail: AckOutput;
	updateTranslatedMessage: AckOutput;
	deleteTranslatedEmail: AckOutput;
	sendEmail: Record<string, JsonValue>;
	searchMobilePushMessages: JsonValue[];
	addMobilePushMessage: { id: number };
	getMobilePushMessage: Record<string, JsonValue>;
	updateBaseMobilePushMessage: AckOutput;
	deleteMobilePushMessage: AckOutput;
	updateTranslatedMobilePushMessage: AckOutput;
	deleteTranslatedMobilePushMessage: AckOutput;
	searchViberMessages: JsonValue[];
	addViberMessage: { id: number };
	getViberMessage: Record<string, JsonValue>;
	updateBaseViberMessage: AckOutput;
	deleteViberMessage: AckOutput;
	searchAppInboxMessages: JsonValue[];
	addAppInboxMessage: { id: number };
	getAppInboxMessage: Record<string, JsonValue>;
	updateBaseAppInboxMessage: AckOutput;
	deleteAppInboxMessage: AckOutput;
	searchTelegramBotMessages: JsonValue[];
	addTelegramBotMessage: { id: number };
	getTelegramBotMessage: Record<string, JsonValue>;
	updateBaseTelegramBotMessage: AckOutput;
	deleteTelegramBotMessage: AckOutput;
	searchSmsMessages: JsonValue[];
	getSms: Record<string, JsonValue>;
	updateBaseSmsMessage: AckOutput;
	deleteSmsMessage: AckOutput;
	getBroadcasts: JsonValue[];
	createBroadcast: { id: number };
	getBroadcast: Record<string, JsonValue>;
	getSmsInterfaces: JsonValue[];
	getEmailInterfaces: JsonValue[];
	updateTranslatedViberMessage: AckOutput;
	deleteTranslatedViberMessage: AckOutput;
	updateTranslatedAppInboxMessage: AckOutput;
	deleteTranslatedAppInboxMessage: AckOutput;
	updateTranslatedTelegramMessage: AckOutput;
	deleteTranslatedTelegramMessage: AckOutput;
	addSmsMessage: { id: number };
	sendSms: Record<string, JsonValue>;
	cancelBroadcast: AckOutput;
	contactActivity: JsonValue[];
	contactMessages: JsonValue[];
	getTokenActivated: { active: boolean };
	changeTokenActivated: { active: boolean };
	getDomains: JsonValue[];
	createDomain: Record<string, JsonValue>;
	getScript: string;
	getWebPushDomains: Record<string, JsonValue>;
	addWebPushDomain: Record<string, JsonValue>;
	deleteWebPushDomain: AckOutput;
	getWebPushScript: Record<string, JsonValue>;
	getProductFeedsConfiguration: Record<string, JsonValue>;
	configureProductFeeds: AckOutput;
	addAppTokens: AckOutput;
	muteAppToken: AckOutput;
	unmuteAppToken: AckOutput;
	getSubscriptionCategories: JsonValue[];
	getPromocodes: JsonValue;
	getPromocodesCount: AckOutput;
	insertPromocodes: AckOutput;
	getPreprocessorFileStatus: AckOutput;
	updatePreprocessorFile: JsonValue;
	uploadPreprocessorFile: JsonValue;
	generateApiToken: Record<string, JsonValue>;
	getInteractionStatus: JsonValue;
	sendViber: Record<string, JsonValue>;
	sendAppInbox: JsonValue;
	sendTelegramBot: JsonValue;
	updateTranslatedSmsMessage: AckOutput;
	deleteTranslatedSmsMessage: AckOutput;
};

export const EsputnikEndpointInputSchemas = {
	getAccountInfo: EmptyInputSchema,
	getBalance: EmptyInputSchema,
	addContact: ContactBodySchema,
	getContact: ContactIdSchema,
	updateContact: ContactIdSchema.and(ContactBodySchema),
	deleteContactById: IdPathSchema.extend({ erase: z.boolean().optional() }),
	deleteContactByExternalCustomerId: DeleteContactSchema,
	searchContacts: SearchContactsSchema,
	subscribeContact: SubscribeContactSchema,
	contactsBulkUpdate: GenericObjectSchema,
	fileContactsBulkUpdate: GenericObjectSchema,
	getImportSessionStatus: SessionPathSchema,
	getContactEmails: z.object({ ids: z.string().min(1) }),
	addToUnsubscribed: EmailListSchema,
	deleteFromUnsubscribed: EmailListSchema,
	getGroupContacts: IdPathSchema.merge(ContactPageQuerySchema).extend({
		orderByTs: z.boolean().optional(),
		asc: z.boolean().optional(),
	}),
	detachContactsFromGroup: IdPathSchema.and(GenericObjectSchema),
	attachContactsToGroup: IdPathSchema.and(GenericObjectSchema),
	searchGroups: ContactPageQuerySchema.extend({ name: z.string().optional() }),
	searchWorkflows: ContactPageQuerySchema.extend({
		name: z.string().optional(),
	}),
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
	getOrganisationBalanceHistory: DateRangeSchema,
	ordersBulkInsert: GenericObjectSchema,
	registerEvent: GenericObjectSchema,
	sendHistoryEvents: GenericObjectSchema,
	removeHistoryEvents: GenericObjectSchema,
	searchEmails: ContactPageQuerySchema.extend({
		name: z.string().optional(),
		tag: z.string().optional(),
	}),
	getEmailMessageViewLink: IdPathSchema,
	sendPreparedMessage: GenericObjectSchema,
	addEmail: EmailMessageBodySchema,
	getEmail: IdPathSchema,
	updateMessage: IdPathSchema.and(EmailMessageBodySchema),
	deleteEmail: IdPathSchema,
	updateTranslatedMessage: EmailLanguagePathSchema.and(EmailMessageBodySchema),
	deleteTranslatedEmail: EmailLanguagePathSchema,
	sendEmail: GenericObjectSchema,
	searchMobilePushMessages: ContactPageQuerySchema.extend({
		search: z.string().optional(),
	}),
	addMobilePushMessage: MobilePushBodySchema,
	getMobilePushMessage: IdPathSchema,
	updateBaseMobilePushMessage: IdPathSchema.and(MobilePushBodySchema),
	deleteMobilePushMessage: IdPathSchema,
	updateTranslatedMobilePushMessage:
		EmailLanguagePathSchema.and(MobilePushBodySchema),
	deleteTranslatedMobilePushMessage: EmailLanguagePathSchema,
	searchViberMessages: MessageSearchSchema,
	addViberMessage: GenericMessageBodySchema,
	getViberMessage: IdPathSchema,
	updateBaseViberMessage: IdPathSchema.and(GenericMessageBodySchema),
	deleteViberMessage: IdPathSchema,
	searchAppInboxMessages: MessageSearchSchema,
	addAppInboxMessage: GenericMessageBodySchema,
	getAppInboxMessage: IdPathSchema,
	updateBaseAppInboxMessage: IdPathSchema.and(GenericMessageBodySchema),
	deleteAppInboxMessage: IdPathSchema,
	searchTelegramBotMessages: MessageSearchSchema,
	addTelegramBotMessage: GenericMessageBodySchema,
	getTelegramBotMessage: IdPathSchema,
	updateBaseTelegramBotMessage: IdPathSchema.and(GenericMessageBodySchema),
	deleteTelegramBotMessage: IdPathSchema,
	searchSmsMessages: MessageSearchSchema,
	getSms: IdPathSchema,
	updateBaseSmsMessage: IdPathSchema.and(GenericMessageBodySchema),
	deleteSmsMessage: IdPathSchema,
	getBroadcasts: MessageSearchSchema,
	createBroadcast: GenericMessageBodySchema,
	getBroadcast: IdPathSchema,
	getSmsInterfaces: EmptyInputSchema,
	getEmailInterfaces: EmptyInputSchema,
	updateTranslatedViberMessage: EmailLanguagePathSchema.and(
		GenericMessageBodySchema,
	),
	deleteTranslatedViberMessage: EmailLanguagePathSchema,
	updateTranslatedAppInboxMessage: EmailLanguagePathSchema.and(
		GenericMessageBodySchema,
	),
	deleteTranslatedAppInboxMessage: EmailLanguagePathSchema,
	updateTranslatedTelegramMessage: EmailLanguagePathSchema.and(
		GenericMessageBodySchema,
	),
	deleteTranslatedTelegramMessage: EmailLanguagePathSchema,
	addSmsMessage: GenericMessageBodySchema,
	sendSms: GenericMessageBodySchema,
	cancelBroadcast: IdPathSchema,
	contactActivity: BehaviorQuerySchema,
	contactMessages: BehaviorQuerySchema,
	getTokenActivated: TokenPathSchema,
	changeTokenActivated: TokenPathSchema.extend({ active: z.boolean() }),
	getDomains: EmptyInputSchema,
	createDomain: DomainSchema,
	getScript: EmptyInputSchema,
	getWebPushDomains: EmptyInputSchema,
	addWebPushDomain: WebPushDomainSchema,
	deleteWebPushDomain: z.object({ domain: z.string().min(1) }),
	getWebPushScript: z.object({ domain: z.string().optional() }),
	getProductFeedsConfiguration: EmptyInputSchema,
	configureProductFeeds: GenericObjectSchema,
	addAppTokens: GenericObjectSchema,
	muteAppToken: GenericObjectSchema,
	unmuteAppToken: GenericObjectSchema,
	getSubscriptionCategories: EmptyInputSchema,
	getPromocodes: GenericObjectSchema,
	getPromocodesCount: EmptyInputSchema,
	insertPromocodes: GenericObjectSchema,
	getPreprocessorFileStatus: SessionPathSchema,
	updatePreprocessorFile: GenericObjectSchema,
	uploadPreprocessorFile: GenericObjectSchema,
	generateApiToken: GenericObjectSchema,
	getInteractionStatus: GenericObjectSchema,
	sendViber: GenericObjectSchema,
	sendAppInbox: GenericObjectSchema,
	sendTelegramBot: GenericObjectSchema,
	updateTranslatedSmsMessage: EmailLanguagePathSchema.and(GenericObjectSchema),
	deleteTranslatedSmsMessage: EmailLanguagePathSchema,
} as const;

export const EsputnikEndpointOutputSchemas = {
	getAccountInfo: AccountInfoSchema,
	getBalance: BalanceSchema,
	addContact: z.object({ id: z.number().int() }),
	getContact: ContactSchema,
	updateContact: AckOutputSchema,
	deleteContactByExternalCustomerId: AckOutputSchema,
	searchContacts: z.array(ContactSchema),
	subscribeContact: ContactSubscriptionResultSchema,
	contactsBulkUpdate: z.record(z.string(), ProviderJsonSchema),
	fileContactsBulkUpdate: z.record(z.string(), ProviderJsonSchema),
	getImportSessionStatus: z.record(z.string(), ProviderJsonSchema),
	getContactEmails: z.record(z.string(), ProviderJsonSchema),
	addToUnsubscribed: AckOutputSchema,
	deleteFromUnsubscribed: AckOutputSchema,
	getGroupContacts: z.array(ProviderJsonSchema),
	detachContactsFromGroup: AckOutputSchema,
	attachContactsToGroup: AckOutputSchema,
	searchGroups: z.array(ProviderJsonSchema),
	searchWorkflows: z.array(ProviderJsonSchema),
	getContactIdByToken: z.object({ id: z.number().int() }),
	getContactSubscriptionCategories: z.array(ProviderJsonSchema),
	changeContactSubscriptionCategories: AckOutputSchema,
	deleteContactById: AckOutputSchema,
	contactRecoms: z.array(ProviderJsonSchema),
	getAdditionalFields: z.record(z.string(), ProviderJsonSchema),
	getOrganisationBalanceHistory: z.record(z.string(), ProviderJsonSchema),
	ordersBulkInsert: z.record(z.string(), ProviderJsonSchema),
	registerEvent: AckOutputSchema,
	sendHistoryEvents: z.record(z.string(), ProviderJsonSchema),
	removeHistoryEvents: AckOutputSchema,
	searchEmails: z.array(ProviderJsonSchema),
	getEmailMessageViewLink: z.record(z.string(), ProviderJsonSchema),
	sendPreparedMessage: ProviderJsonSchema,
	addEmail: z.object({ id: z.number().int() }),
	getEmail: z.record(z.string(), ProviderJsonSchema),
	updateMessage: AckOutputSchema,
	deleteEmail: AckOutputSchema,
	updateTranslatedMessage: AckOutputSchema,
	deleteTranslatedEmail: AckOutputSchema,
	sendEmail: z.record(z.string(), ProviderJsonSchema),
	searchMobilePushMessages: z.array(ProviderJsonSchema),
	addMobilePushMessage: z.object({ id: z.number().int() }),
	getMobilePushMessage: z.record(z.string(), ProviderJsonSchema),
	updateBaseMobilePushMessage: AckOutputSchema,
	deleteMobilePushMessage: AckOutputSchema,
	updateTranslatedMobilePushMessage: AckOutputSchema,
	deleteTranslatedMobilePushMessage: AckOutputSchema,
	searchViberMessages: z.array(ProviderJsonSchema),
	addViberMessage: z.object({ id: z.number().int() }),
	getViberMessage: z.record(z.string(), ProviderJsonSchema),
	updateBaseViberMessage: AckOutputSchema,
	deleteViberMessage: AckOutputSchema,
	searchAppInboxMessages: z.array(ProviderJsonSchema),
	addAppInboxMessage: z.object({ id: z.number().int() }),
	getAppInboxMessage: z.record(z.string(), ProviderJsonSchema),
	updateBaseAppInboxMessage: AckOutputSchema,
	deleteAppInboxMessage: AckOutputSchema,
	searchTelegramBotMessages: z.array(ProviderJsonSchema),
	addTelegramBotMessage: z.object({ id: z.number().int() }),
	getTelegramBotMessage: z.record(z.string(), ProviderJsonSchema),
	updateBaseTelegramBotMessage: AckOutputSchema,
	deleteTelegramBotMessage: AckOutputSchema,
	searchSmsMessages: z.array(ProviderJsonSchema),
	getSms: z.record(z.string(), ProviderJsonSchema),
	updateBaseSmsMessage: AckOutputSchema,
	deleteSmsMessage: AckOutputSchema,
	getBroadcasts: z.array(ProviderJsonSchema),
	createBroadcast: z.object({ id: z.number().int() }),
	getBroadcast: z.record(z.string(), ProviderJsonSchema),
	getSmsInterfaces: z.array(ProviderJsonSchema),
	getEmailInterfaces: z.array(ProviderJsonSchema),
	updateTranslatedViberMessage: AckOutputSchema,
	deleteTranslatedViberMessage: AckOutputSchema,
	updateTranslatedAppInboxMessage: AckOutputSchema,
	deleteTranslatedAppInboxMessage: AckOutputSchema,
	updateTranslatedTelegramMessage: AckOutputSchema,
	deleteTranslatedTelegramMessage: AckOutputSchema,
	addSmsMessage: z.object({ id: z.number().int() }),
	sendSms: z.record(z.string(), ProviderJsonSchema),
	cancelBroadcast: AckOutputSchema,
	contactActivity: z.array(ProviderJsonSchema),
	contactMessages: z.array(ProviderJsonSchema),
	getTokenActivated: z.object({ active: z.boolean() }),
	changeTokenActivated: z.object({ active: z.boolean() }),
	getDomains: z.array(ProviderJsonSchema),
	createDomain: z.record(z.string(), ProviderJsonSchema),
	getScript: z.string(),
	getWebPushDomains: z.record(z.string(), ProviderJsonSchema),
	addWebPushDomain: z.record(z.string(), ProviderJsonSchema),
	deleteWebPushDomain: AckOutputSchema,
	getWebPushScript: z.record(z.string(), ProviderJsonSchema),
	getProductFeedsConfiguration: z.record(z.string(), ProviderJsonSchema),
	configureProductFeeds: AckOutputSchema,
	addAppTokens: AckOutputSchema,
	muteAppToken: AckOutputSchema,
	unmuteAppToken: AckOutputSchema,
	getSubscriptionCategories: z.array(ProviderJsonSchema),
	getPromocodes: ProviderJsonSchema,
	getPromocodesCount: AckOutputSchema,
	insertPromocodes: AckOutputSchema,
	getPreprocessorFileStatus: AckOutputSchema,
	updatePreprocessorFile: ProviderJsonSchema,
	uploadPreprocessorFile: ProviderJsonSchema,
	generateApiToken: z.record(z.string(), ProviderJsonSchema),
	getInteractionStatus: ProviderJsonSchema,
	sendViber: z.record(z.string(), ProviderJsonSchema),
	sendAppInbox: ProviderJsonSchema,
	sendTelegramBot: ProviderJsonSchema,
	updateTranslatedSmsMessage: AckOutputSchema,
	deleteTranslatedSmsMessage: AckOutputSchema,
} as const;
