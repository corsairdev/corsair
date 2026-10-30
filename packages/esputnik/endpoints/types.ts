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
};

export type EsputnikEndpointOutputs = {
	getAccountInfo: z.infer<typeof AccountInfoSchema>;
	getBalance: z.infer<typeof BalanceSchema>;
	addContact: { id: number };
	getContact: z.infer<typeof ContactSchema>;
	updateContact: string;
	deleteContactByExternalCustomerId: unknown;
	searchContacts: z.infer<typeof ContactSchema>[];
	subscribeContact: z.infer<typeof ContactSubscriptionResultSchema>;
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
} as const;
