import { z } from 'zod';

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
const GenericObjectSchema = z.record(z.string(), z.unknown());
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
	getAccountInfo: z.infer<typeof AccountInfoSchema>;
	getBalance: z.infer<typeof BalanceSchema>;
	addContact: { id: number };
	getContact: z.infer<typeof ContactSchema>;
	updateContact: string;
	// eSputnik documents an empty response for this mutation, so the provider
	// response is intentionally opaque and accepted without a local envelope.
	deleteContactByExternalCustomerId: unknown;
	searchContacts: z.infer<typeof ContactSchema>[];
	subscribeContact: z.infer<typeof ContactSubscriptionResultSchema>;
	// Bulk/import response envelopes vary by provider validation outcome and are
	// not stable enough in the public OpenAPI contract for a narrower type.
	contactsBulkUpdate: z.infer<typeof GenericObjectSchema>;
	fileContactsBulkUpdate: z.infer<typeof GenericObjectSchema>;
	getImportSessionStatus: z.infer<typeof GenericObjectSchema>;
	getContactEmails: z.infer<typeof GenericObjectSchema>;
	addToUnsubscribed: unknown;
	deleteFromUnsubscribed: unknown;
	getGroupContacts: unknown[];
	detachContactsFromGroup: string;
	attachContactsToGroup: string;
	searchGroups: unknown[];
	searchWorkflows: unknown[];
	getContactIdByToken: { id: number };
	getContactSubscriptionCategories: unknown[];
	changeContactSubscriptionCategories: string;
	deleteContactById: string;
	contactRecoms: unknown[];
	getAdditionalFields: z.infer<typeof GenericObjectSchema>;
	getOrganisationBalanceHistory: z.infer<typeof GenericObjectSchema>;
	ordersBulkInsert: z.infer<typeof GenericObjectSchema>;
	registerEvent: unknown;
	sendHistoryEvents: z.infer<typeof GenericObjectSchema>;
	removeHistoryEvents: unknown;
	searchEmails: unknown[];
	getEmailMessageViewLink: z.infer<typeof GenericObjectSchema>;
	sendPreparedMessage: unknown;
	addEmail: { id: number };
	getEmail: z.infer<typeof GenericObjectSchema>;
	updateMessage: string;
	deleteEmail: string;
	updateTranslatedMessage: string;
	deleteTranslatedEmail: string;
	sendEmail: z.infer<typeof GenericObjectSchema>;
	searchMobilePushMessages: unknown[];
	addMobilePushMessage: { id: number };
	getMobilePushMessage: z.infer<typeof GenericObjectSchema>;
	updateBaseMobilePushMessage: string;
	deleteMobilePushMessage: string;
	updateTranslatedMobilePushMessage: string;
	deleteTranslatedMobilePushMessage: string;
	searchViberMessages: unknown[];
	addViberMessage: { id: number };
	getViberMessage: z.infer<typeof GenericObjectSchema>;
	updateBaseViberMessage: string;
	deleteViberMessage: string;
	searchAppInboxMessages: unknown[];
	addAppInboxMessage: { id: number };
	getAppInboxMessage: z.infer<typeof GenericObjectSchema>;
	updateBaseAppInboxMessage: string;
	deleteAppInboxMessage: string;
	searchTelegramBotMessages: unknown[];
	addTelegramBotMessage: { id: number };
	getTelegramBotMessage: z.infer<typeof GenericObjectSchema>;
	updateBaseTelegramBotMessage: string;
	deleteTelegramBotMessage: string;
	searchSmsMessages: unknown[];
	getSms: z.infer<typeof GenericObjectSchema>;
	updateBaseSmsMessage: string;
	deleteSmsMessage: string;
	getBroadcasts: unknown[];
	createBroadcast: { id: number };
	getBroadcast: z.infer<typeof GenericObjectSchema>;
	getSmsInterfaces: unknown[];
	getEmailInterfaces: unknown[];
	updateTranslatedViberMessage: string;
	deleteTranslatedViberMessage: string;
	updateTranslatedAppInboxMessage: string;
	deleteTranslatedAppInboxMessage: string;
	updateTranslatedTelegramMessage: string;
	deleteTranslatedTelegramMessage: string;
	addSmsMessage: { id: number };
	sendSms: z.infer<typeof GenericObjectSchema>;
	cancelBroadcast: string;
	contactActivity: unknown[];
	contactMessages: unknown[];
	getTokenActivated: { active: boolean };
	changeTokenActivated: { active: boolean };
	getDomains: unknown[];
	createDomain: Record<string, unknown>;
	getScript: string;
	getWebPushDomains: Record<string, unknown>;
	addWebPushDomain: Record<string, unknown>;
	deleteWebPushDomain: string;
	getWebPushScript: Record<string, unknown>;
	getProductFeedsConfiguration: Record<string, unknown>;
	configureProductFeeds: unknown;
	addAppTokens: unknown;
	muteAppToken: unknown;
	unmuteAppToken: unknown;
	getSubscriptionCategories: unknown[];
	getPromocodes: unknown;
	getPromocodesCount: unknown;
	insertPromocodes: unknown;
	getPreprocessorFileStatus: Record<string, unknown>;
	updatePreprocessorFile: unknown;
	uploadPreprocessorFile: unknown;
	generateApiToken: Record<string, unknown>;
	getInteractionStatus: unknown;
	sendViber: z.infer<typeof GenericObjectSchema>;
	sendAppInbox: unknown;
	sendTelegramBot: unknown;
	updateTranslatedSmsMessage: string;
	deleteTranslatedSmsMessage: string;
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
	updateContact: z.string(),
	deleteContactByExternalCustomerId: z.unknown(),
	searchContacts: z.array(ContactSchema),
	subscribeContact: ContactSubscriptionResultSchema,
	contactsBulkUpdate: z.record(z.string(), z.unknown()),
	fileContactsBulkUpdate: z.record(z.string(), z.unknown()),
	getImportSessionStatus: z.record(z.string(), z.unknown()),
	getContactEmails: z.record(z.string(), z.unknown()),
	addToUnsubscribed: z.unknown(),
	deleteFromUnsubscribed: z.unknown(),
	getGroupContacts: z.array(z.unknown()),
	detachContactsFromGroup: z.string(),
	attachContactsToGroup: z.string(),
	searchGroups: z.array(z.unknown()),
	searchWorkflows: z.array(z.unknown()),
	getContactIdByToken: z.object({ id: z.number().int() }),
	getContactSubscriptionCategories: z.array(z.unknown()),
	changeContactSubscriptionCategories: z.string(),
	deleteContactById: z.string(),
	contactRecoms: z.array(z.unknown()),
	getAdditionalFields: z.record(z.string(), z.unknown()),
	getOrganisationBalanceHistory: z.record(z.string(), z.unknown()),
	ordersBulkInsert: z.record(z.string(), z.unknown()),
	registerEvent: z.unknown(),
	sendHistoryEvents: z.record(z.string(), z.unknown()),
	removeHistoryEvents: z.unknown(),
	searchEmails: z.array(z.unknown()),
	getEmailMessageViewLink: z.record(z.string(), z.unknown()),
	sendPreparedMessage: z.unknown(),
	addEmail: z.object({ id: z.number().int() }),
	getEmail: z.record(z.string(), z.unknown()),
	updateMessage: z.string(),
	deleteEmail: z.string(),
	updateTranslatedMessage: z.string(),
	deleteTranslatedEmail: z.string(),
	sendEmail: z.record(z.string(), z.unknown()),
	searchMobilePushMessages: z.array(z.unknown()),
	addMobilePushMessage: z.object({ id: z.number().int() }),
	getMobilePushMessage: z.record(z.string(), z.unknown()),
	updateBaseMobilePushMessage: z.string(),
	deleteMobilePushMessage: z.string(),
	updateTranslatedMobilePushMessage: z.string(),
	deleteTranslatedMobilePushMessage: z.string(),
	searchViberMessages: z.array(z.unknown()),
	addViberMessage: z.object({ id: z.number().int() }),
	getViberMessage: z.record(z.string(), z.unknown()),
	updateBaseViberMessage: z.string(),
	deleteViberMessage: z.string(),
	searchAppInboxMessages: z.array(z.unknown()),
	addAppInboxMessage: z.object({ id: z.number().int() }),
	getAppInboxMessage: z.record(z.string(), z.unknown()),
	updateBaseAppInboxMessage: z.string(),
	deleteAppInboxMessage: z.string(),
	searchTelegramBotMessages: z.array(z.unknown()),
	addTelegramBotMessage: z.object({ id: z.number().int() }),
	getTelegramBotMessage: z.record(z.string(), z.unknown()),
	updateBaseTelegramBotMessage: z.string(),
	deleteTelegramBotMessage: z.string(),
	searchSmsMessages: z.array(z.unknown()),
	getSms: z.record(z.string(), z.unknown()),
	updateBaseSmsMessage: z.string(),
	deleteSmsMessage: z.string(),
	getBroadcasts: z.array(z.unknown()),
	createBroadcast: z.object({ id: z.number().int() }),
	getBroadcast: z.record(z.string(), z.unknown()),
	getSmsInterfaces: z.array(z.unknown()),
	getEmailInterfaces: z.array(z.unknown()),
	updateTranslatedViberMessage: z.string(),
	deleteTranslatedViberMessage: z.string(),
	updateTranslatedAppInboxMessage: z.string(),
	deleteTranslatedAppInboxMessage: z.string(),
	updateTranslatedTelegramMessage: z.string(),
	deleteTranslatedTelegramMessage: z.string(),
	addSmsMessage: z.object({ id: z.number().int() }),
	sendSms: z.record(z.string(), z.unknown()),
	cancelBroadcast: z.string(),
	contactActivity: z.array(z.unknown()),
	contactMessages: z.array(z.unknown()),
	getTokenActivated: z.object({ active: z.boolean() }),
	changeTokenActivated: z.object({ active: z.boolean() }),
	getDomains: z.array(z.unknown()),
	createDomain: z.record(z.string(), z.unknown()),
	getScript: z.string(),
	getWebPushDomains: z.record(z.string(), z.unknown()),
	addWebPushDomain: z.record(z.string(), z.unknown()),
	deleteWebPushDomain: z.string(),
	getWebPushScript: z.record(z.string(), z.unknown()),
	getProductFeedsConfiguration: z.record(z.string(), z.unknown()),
	configureProductFeeds: z.unknown(),
	addAppTokens: z.unknown(),
	muteAppToken: z.unknown(),
	unmuteAppToken: z.unknown(),
	getSubscriptionCategories: z.array(z.unknown()),
	getPromocodes: z.unknown(),
	getPromocodesCount: z.unknown(),
	insertPromocodes: z.unknown(),
	getPreprocessorFileStatus: z.record(z.string(), z.unknown()),
	updatePreprocessorFile: z.unknown(),
	uploadPreprocessorFile: z.unknown(),
	generateApiToken: z.record(z.string(), z.unknown()),
	getInteractionStatus: z.unknown(),
	sendViber: z.record(z.string(), z.unknown()),
	sendAppInbox: z.unknown(),
	sendTelegramBot: z.unknown(),
	updateTranslatedSmsMessage: z.string(),
	deleteTranslatedSmsMessage: z.string(),
} as const;
