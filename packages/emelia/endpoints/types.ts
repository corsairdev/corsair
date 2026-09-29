import { z } from 'zod';

// Account
export const AccountMeInputSchema = z.object({}).optional();

export const AccountMeOutputSchema = z.object({
	me: z
		.object({
			uid: z.string().optional(),
			name: z.string().optional(),
			email: z.string().optional(),
			showMailbox: z.boolean().optional(),
			picture: z.string().optional(),
			due_invoice: z.boolean().optional(),
			joinedDate: z.string().optional(),
		})
		.nullable()
		.optional(),
});

// Campaigns
export const CampaignsListInputSchema = z
	.object({
		options: z.record(z.string(), z.unknown()).optional(),
	})
	.optional();

export const CampaignSchema = z.object({
	_id: z.string(),
	name: z.string().optional(),
	status: z.string().optional(),
	createdAt: z.string().optional(),
	provider: z.string().optional(),
	useManyProviders: z.boolean().optional(),
	plannedStart: z.string().optional(),
});

export const CampaignsListOutputSchema = z.object({
	all_campaigns: z.array(CampaignSchema).nullable().optional(),
});

export const CampaignsAddContactInputSchema = z.object({
	id: z.string().min(1, 'Campaign ID is required'),
	contact: z.record(z.string(), z.unknown()),
});

export const CampaignsAddContactOutputSchema = z.object({
	addContactToCampaignHook: z.unknown().optional(),
});

export const CampaignsRemoveContactInputSchema = z.object({
	id: z.string().min(1, 'Campaign ID is required'),
	email: z.string().email('Valid email is required'),
});

export const CampaignsRemoveContactOutputSchema = z.object({
	removeOneContactFromCampaign: z.unknown().optional(),
});

// Contacts Lists
export const ContactsListListsInputSchema = z.object({}).optional();

export const ContactListSchema = z.object({
	_id: z.string(),
	name: z.string().optional(),
	contactCount: z.number().optional(),
	fields: z.array(z.string()).optional(),
	usedInCampaign: z.boolean().optional(),
});

export const ContactsListListsOutputSchema = z.object({
	contact_lists: z.array(ContactListSchema).nullable().optional(),
});

export const ContactsAddToListInputSchema = z.object({
	id: z.string().min(1, 'Contact list ID is required'),
	contact: z.record(z.string(), z.unknown()),
});

export const ContactsAddToListOutputSchema = z.object({
	addContactsToListHook: z.unknown().optional(),
});

// ---------------------------------------------------------------------------
// REST API schemas (docs.emelia.io, base https://api.emelia.io).
// Method + path are verified per endpoint page. Where the docs render
// request/response detail client-side, the body is marked NOT FOUND and the
// schema below keeps only the documented-minimal fields (extra provider keys
// are stripped by zod, never rejected), so a live proof run can tighten them.
// ---------------------------------------------------------------------------

// Shared primitives
export const PaginationInputSchema = z
	.object({
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.optional();

// Flat contact object per Lists docs: field names as keys, scalar values;
// unknown keys auto-create custom vars provider-side, so the schema stays open.
export const FlatContactSchema = z.record(
	z.string(),
	z.union([z.string(), z.number(), z.boolean()]),
);

// List envelopes keep only documented-minimal fields (extra provider keys
// are stripped, never rejected) but must not parse as empty objects: an
// undocumented shape like `{ items: [...] }` would otherwise silently
// become `{}`. Require at least one documented field instead.
function nonEmptyEnvelope<T extends z.ZodRawShape>(shape: T) {
	return z
		.object(shape)
		.refine(
			(value) => Object.values(value).some((field) => field !== undefined),
			{ message: 'Response envelope has no documented fields' },
		);
}

const RestCampaignSummarySchema = z.object({
	id: z.string().optional(),
	campaignId: z.string().optional(),
	name: z.string().optional(),
	status: z.string().optional(),
});

// REST: advanced campaigns (multichannel email + LinkedIn)
// POST /advanced/campaigns — body detail NOT FOUND in static docs;
// docs prose requires at least the campaign name.
export const RestCreateCampaignInputSchema = z.object({
	name: z.string().min(1, 'Campaign name is required'),
});

export const RestCreateCampaignOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
	campaignId: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
});

// GET /advanced/campaigns — envelope shape NOT FOUND; docs show the page
// returns either a plain array or a paginated envelope, hence the union.
export const RestListCampaignsInputSchema = PaginationInputSchema;

export const RestListCampaignsOutputSchema = z.union([
	z.array(RestCampaignSummarySchema),
	nonEmptyEnvelope({
		campaigns: z.array(RestCampaignSummarySchema).optional(),
		data: z.array(RestCampaignSummarySchema).optional(),
		total: z.number().optional(),
		page: z.number().optional(),
		limit: z.number().optional(),
	}),
]);

const CampaignActivitySchema = z.object({
	id: z.string().optional(),
	type: z.string().optional(),
	event: z.string().optional(),
	date: z.string().optional(),
	step: z.number().optional(),
});

// GET /advanced/campaigns/:campaignId/activities
export const RestGetCampaignActivitiesInputSchema = z.object({
	campaignId: z.string().min(1, 'Campaign ID is required'),
	page: z.number().int().min(1).optional(),
	limit: z.number().int().min(1).max(100).optional(),
});

export const RestGetCampaignActivitiesOutputSchema = z.union([
	z.array(CampaignActivitySchema),
	nonEmptyEnvelope({
		activities: z.array(CampaignActivitySchema).optional(),
		data: z.array(CampaignActivitySchema).optional(),
		total: z.number().optional(),
	}),
]);

// Legacy email campaigns (/emails/campaign/*) — still served; request detail
// NOT FOUND in static docs. Bodies mirror the GraphQL mutation arguments
// (campaign identifier + contact/email), flagged for live-proof tightening.
export const EmailAddContactInputSchema = z.object({
	campaignId: z.string().min(1, 'Campaign ID is required'),
	contact: FlatContactSchema,
});

export const EmailAddContactOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
});

const EmailCampaignContactSchema = z.object({
	id: z.string().optional(),
	email: z.string().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	status: z.string().optional(),
});

export const EmailListContactsInputSchema = z
	.object({
		campaignId: z.string().optional(),
		page: z.number().int().min(1).optional(),
		limit: z.number().int().min(1).max(100).optional(),
	})
	.optional();

export const EmailListContactsOutputSchema = z.union([
	z.array(EmailCampaignContactSchema),
	nonEmptyEnvelope({
		contacts: z.array(EmailCampaignContactSchema).optional(),
		data: z.array(EmailCampaignContactSchema).optional(),
		total: z.number().optional(),
	}),
]);

export const EmailDeleteContactInputSchema = z.object({
	campaignId: z.string().min(1, 'Campaign ID is required'),
	email: z.string().email('Valid email is required'),
});

export const EmailDeleteContactOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
});

// Legacy blacklist (/emails/blacklists/contact)
export const BlacklistAddInputSchema = z.object({
	email: z.string().email('Valid email is required'),
});

export const BlacklistAddOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
});

export const BlacklistRemoveInputSchema = z.object({
	email: z.string().email('Valid email is required'),
});

export const BlacklistRemoveOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
});

// Legacy LinkedIn campaigns (/linkedin/*) — request detail NOT FOUND;
// delete-contact identifies the contact by its LinkedIn URL per docs prose.
export const LinkedinCreateCampaignInputSchema = z.object({
	name: z.string().min(1, 'Campaign name is required'),
});

export const LinkedinCreateCampaignOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
	campaignId: z.string().optional(),
	id: z.string().optional(),
	name: z.string().optional(),
});

export const LinkedinListCampaignsInputSchema = PaginationInputSchema;

export const LinkedinListCampaignsOutputSchema = z.union([
	z.array(RestCampaignSummarySchema),
	nonEmptyEnvelope({
		campaigns: z.array(RestCampaignSummarySchema).optional(),
		data: z.array(RestCampaignSummarySchema).optional(),
		total: z.number().optional(),
	}),
]);

export const LinkedinDeleteContactInputSchema = z.object({
	campaignId: z.string().optional(),
	contactUrl: z.string().min(1, 'Contact URL is required'),
});

export const LinkedinDeleteContactOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
});

export const LinkedinGetActivitiesInputSchema = z.object({
	campaignId: z.string().min(1, 'Campaign ID is required'),
});

export const LinkedinGetActivitiesOutputSchema = z.union([
	z.array(CampaignActivitySchema),
	nonEmptyEnvelope({
		activities: z.array(CampaignActivitySchema).optional(),
		data: z.array(CampaignActivitySchema).optional(),
		total: z.number().optional(),
	}),
]);

// Tools (finder/verifier jobs) — full request/response shapes verified from
// the docs OpenAPI blobs. `*` marks provider-required fields.
export const FindEmailSingleInputSchema = z.object({
	fullname: z.string().min(1, 'Full name is required'),
	companyName: z.string().min(1, 'Company name is required'),
	companyWebsite: z.string().optional(),
	country: z.string().optional(),
});

export const FindEmailSingleOutputSchema = z.object({
	success: z.boolean(),
	jobId: z.string(),
});

export const GetFindEmailResultInputSchema = z.object({
	jobId: z.string().min(1, 'Job ID is required'),
});

const FindEmailResultDataSchema = z.object({
	fullname: z.string().optional(),
	companyName: z.string().optional(),
	companyWebsite: z.string().optional(),
	email: z.string(),
	qualification: z.enum(['valid', 'invalid']).optional(),
	status: z.enum(['running', 'done', 'error']).default('running'),
	date: z.string().optional(),
});

export const GetFindEmailResultOutputSchema = z.object({
	success: z.boolean(),
	data: FindEmailResultDataSchema,
});

export const FindPhoneSingleInputSchema = z.object({
	linkedinUrl: z.string().min(1, 'LinkedIn URL is required'),
});

export const FindPhoneSingleOutputSchema = z.object({
	success: z.boolean(),
	jobId: z.string(),
});

export const GetFindPhoneResultInputSchema = z.object({
	jobId: z.string().min(1, 'Job ID is required'),
});

const FindPhoneResultDataSchema = z.object({
	linkedinUrl: z.string(),
	phoneNumber: z.string().optional(),
	country: z.string().optional(),
	qualification: z.enum(['found', 'not_found']).optional(),
	status: z.enum(['running', 'done', 'error']).default('running'),
	date: z.string().optional(),
});

export const GetFindPhoneResultOutputSchema = z.object({
	success: z.boolean(),
	data: FindPhoneResultDataSchema,
});

export const VerifyEmailSingleInputSchema = z.object({
	email: z.string().email('Valid email is required'),
});

export const VerifyEmailSingleOutputSchema = z.object({
	success: z.boolean(),
	jobId: z.string(),
});

export const GetVerifyEmailResultInputSchema = z.object({
	jobId: z.string().min(1, 'Job ID is required'),
});

const VerifyEmailResultDataSchema = z.object({
	email: z.string(),
	qualification: z.enum(['valid', 'invalid']).optional(),
	status: z.enum(['running', 'done', 'error']).default('running'),
	date: z.string().optional(),
});

export const GetVerifyEmailResultOutputSchema = z.object({
	success: z.boolean(),
	data: VerifyEmailResultDataSchema,
});

// Email providers — GET /email-providers; item shape NOT FOUND, minimal.
const EmailProviderSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
});

export const ListProvidersInputSchema = z.object({}).optional();

export const ListProvidersOutputSchema = z.union([
	z.array(EmailProviderSchema),
	nonEmptyEnvelope({
		providers: z.array(EmailProviderSchema).optional(),
		data: z.array(EmailProviderSchema).optional(),
	}),
]);

// Webhooks (/webhook) — item/body detail NOT FOUND. Create body keeps the
// documented-minimal fields: campaign to watch, callback URL, event names.
const WebhookSchema = z.object({
	id: z.string().optional(),
	url: z.string().optional(),
	webhookUrl: z.string().optional(),
	campaignId: z.string().optional(),
	events: z.array(z.string()).optional(),
});

export const ListWebhooksInputSchema = z.object({}).optional();

export const ListWebhooksOutputSchema = z.union([
	z.array(WebhookSchema),
	nonEmptyEnvelope({
		webhooks: z.array(WebhookSchema).optional(),
		data: z.array(WebhookSchema).optional(),
	}),
]);

export const CreateWebhookInputSchema = z.object({
	campaignId: z.string().min(1, 'Campaign ID is required'),
	// Emelia requires webhook destinations to use HTTPS.
	url: z
		.string()
		.url('Valid webhook URL is required')
		.refine(
			(value) => {
				try {
					return new URL(value).protocol === 'https:';
				} catch {
					// Invalid URLs are already rejected by .url() above.
					return false;
				}
			},
			{
				message: 'Webhook URL must use HTTPS',
			},
		),
	events: z.array(z.string().min(1)).min(1, 'At least one event is required'),
});

export const CreateWebhookOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
	id: z.string().optional(),
	url: z.string().optional(),
});

export const DeleteWebhookInputSchema = z.object({
	// Emelia requires webhook destinations to use HTTPS.
	url: z
		.string()
		.url('Valid webhook URL is required')
		.refine(
			(value) => {
				try {
					return new URL(value).protocol === 'https:';
				} catch {
					// Invalid URLs are already rejected by .url() above.
					return false;
				}
			},
			{
				message: 'Webhook URL must use HTTPS',
			},
		),
});

export const DeleteWebhookOutputSchema = z.object({
	success: z.boolean().optional(),
	message: z.string().optional(),
});

// Aggregate Schemas
export const EmeliaEndpointInputSchemas = {
	accountMe: AccountMeInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsAddContact: CampaignsAddContactInputSchema,
	campaignsRemoveContact: CampaignsRemoveContactInputSchema,
	contactsListLists: ContactsListListsInputSchema,
	contactsAddToList: ContactsAddToListInputSchema,
	restCreateCampaign: RestCreateCampaignInputSchema,
	restListCampaigns: RestListCampaignsInputSchema,
	restGetCampaignActivities: RestGetCampaignActivitiesInputSchema,
	emailAddContact: EmailAddContactInputSchema,
	emailListContacts: EmailListContactsInputSchema,
	emailDeleteContact: EmailDeleteContactInputSchema,
	blacklistAdd: BlacklistAddInputSchema,
	blacklistRemove: BlacklistRemoveInputSchema,
	linkedinCreateCampaign: LinkedinCreateCampaignInputSchema,
	linkedinListCampaigns: LinkedinListCampaignsInputSchema,
	linkedinDeleteContact: LinkedinDeleteContactInputSchema,
	linkedinGetActivities: LinkedinGetActivitiesInputSchema,
	findEmailSingle: FindEmailSingleInputSchema,
	getFindEmailResult: GetFindEmailResultInputSchema,
	findPhoneSingle: FindPhoneSingleInputSchema,
	getFindPhoneResult: GetFindPhoneResultInputSchema,
	verifyEmailSingle: VerifyEmailSingleInputSchema,
	getVerifyEmailResult: GetVerifyEmailResultInputSchema,
	listProviders: ListProvidersInputSchema,
	listWebhooks: ListWebhooksInputSchema,
	createWebhook: CreateWebhookInputSchema,
	deleteWebhook: DeleteWebhookInputSchema,
} as const;

export const EmeliaEndpointOutputSchemas = {
	accountMe: AccountMeOutputSchema,
	campaignsList: CampaignsListOutputSchema,
	campaignsAddContact: CampaignsAddContactOutputSchema,
	campaignsRemoveContact: CampaignsRemoveContactOutputSchema,
	contactsListLists: ContactsListListsOutputSchema,
	contactsAddToList: ContactsAddToListOutputSchema,
	restCreateCampaign: RestCreateCampaignOutputSchema,
	restListCampaigns: RestListCampaignsOutputSchema,
	restGetCampaignActivities: RestGetCampaignActivitiesOutputSchema,
	emailAddContact: EmailAddContactOutputSchema,
	emailListContacts: EmailListContactsOutputSchema,
	emailDeleteContact: EmailDeleteContactOutputSchema,
	blacklistAdd: BlacklistAddOutputSchema,
	blacklistRemove: BlacklistRemoveOutputSchema,
	linkedinCreateCampaign: LinkedinCreateCampaignOutputSchema,
	linkedinListCampaigns: LinkedinListCampaignsOutputSchema,
	linkedinDeleteContact: LinkedinDeleteContactOutputSchema,
	linkedinGetActivities: LinkedinGetActivitiesOutputSchema,
	findEmailSingle: FindEmailSingleOutputSchema,
	getFindEmailResult: GetFindEmailResultOutputSchema,
	findPhoneSingle: FindPhoneSingleOutputSchema,
	getFindPhoneResult: GetFindPhoneResultOutputSchema,
	verifyEmailSingle: VerifyEmailSingleOutputSchema,
	getVerifyEmailResult: GetVerifyEmailResultOutputSchema,
	listProviders: ListProvidersOutputSchema,
	listWebhooks: ListWebhooksOutputSchema,
	createWebhook: CreateWebhookOutputSchema,
	deleteWebhook: DeleteWebhookOutputSchema,
} as const;

export type EmeliaEndpointInputs = {
	accountMe: z.infer<typeof AccountMeInputSchema>;
	campaignsList: z.infer<typeof CampaignsListInputSchema>;
	campaignsAddContact: z.infer<typeof CampaignsAddContactInputSchema>;
	campaignsRemoveContact: z.infer<typeof CampaignsRemoveContactInputSchema>;
	contactsListLists: z.infer<typeof ContactsListListsInputSchema>;
	contactsAddToList: z.infer<typeof ContactsAddToListInputSchema>;
	restCreateCampaign: z.infer<typeof RestCreateCampaignInputSchema>;
	restListCampaigns: z.infer<typeof RestListCampaignsInputSchema>;
	restGetCampaignActivities: z.infer<
		typeof RestGetCampaignActivitiesInputSchema
	>;
	emailAddContact: z.infer<typeof EmailAddContactInputSchema>;
	emailListContacts: z.infer<typeof EmailListContactsInputSchema>;
	emailDeleteContact: z.infer<typeof EmailDeleteContactInputSchema>;
	blacklistAdd: z.infer<typeof BlacklistAddInputSchema>;
	blacklistRemove: z.infer<typeof BlacklistRemoveInputSchema>;
	linkedinCreateCampaign: z.infer<typeof LinkedinCreateCampaignInputSchema>;
	linkedinListCampaigns: z.infer<typeof LinkedinListCampaignsInputSchema>;
	linkedinDeleteContact: z.infer<typeof LinkedinDeleteContactInputSchema>;
	linkedinGetActivities: z.infer<typeof LinkedinGetActivitiesInputSchema>;
	findEmailSingle: z.infer<typeof FindEmailSingleInputSchema>;
	getFindEmailResult: z.infer<typeof GetFindEmailResultInputSchema>;
	findPhoneSingle: z.infer<typeof FindPhoneSingleInputSchema>;
	getFindPhoneResult: z.infer<typeof GetFindPhoneResultInputSchema>;
	verifyEmailSingle: z.infer<typeof VerifyEmailSingleInputSchema>;
	getVerifyEmailResult: z.infer<typeof GetVerifyEmailResultInputSchema>;
	listProviders: z.infer<typeof ListProvidersInputSchema>;
	listWebhooks: z.infer<typeof ListWebhooksInputSchema>;
	createWebhook: z.infer<typeof CreateWebhookInputSchema>;
	deleteWebhook: z.infer<typeof DeleteWebhookInputSchema>;
};

export type EmeliaEndpointOutputs = {
	accountMe: z.infer<typeof AccountMeOutputSchema>;
	campaignsList: z.infer<typeof CampaignsListOutputSchema>;
	campaignsAddContact: z.infer<typeof CampaignsAddContactOutputSchema>;
	campaignsRemoveContact: z.infer<typeof CampaignsRemoveContactOutputSchema>;
	contactsListLists: z.infer<typeof ContactsListListsOutputSchema>;
	contactsAddToList: z.infer<typeof ContactsAddToListOutputSchema>;
	restCreateCampaign: z.infer<typeof RestCreateCampaignOutputSchema>;
	restListCampaigns: z.infer<typeof RestListCampaignsOutputSchema>;
	restGetCampaignActivities: z.infer<
		typeof RestGetCampaignActivitiesOutputSchema
	>;
	emailAddContact: z.infer<typeof EmailAddContactOutputSchema>;
	emailListContacts: z.infer<typeof EmailListContactsOutputSchema>;
	emailDeleteContact: z.infer<typeof EmailDeleteContactOutputSchema>;
	blacklistAdd: z.infer<typeof BlacklistAddOutputSchema>;
	blacklistRemove: z.infer<typeof BlacklistRemoveOutputSchema>;
	linkedinCreateCampaign: z.infer<typeof LinkedinCreateCampaignOutputSchema>;
	linkedinListCampaigns: z.infer<typeof LinkedinListCampaignsOutputSchema>;
	linkedinDeleteContact: z.infer<typeof LinkedinDeleteContactOutputSchema>;
	linkedinGetActivities: z.infer<typeof LinkedinGetActivitiesOutputSchema>;
	findEmailSingle: z.infer<typeof FindEmailSingleOutputSchema>;
	getFindEmailResult: z.infer<typeof GetFindEmailResultOutputSchema>;
	findPhoneSingle: z.infer<typeof FindPhoneSingleOutputSchema>;
	getFindPhoneResult: z.infer<typeof GetFindPhoneResultOutputSchema>;
	verifyEmailSingle: z.infer<typeof VerifyEmailSingleOutputSchema>;
	getVerifyEmailResult: z.infer<typeof GetVerifyEmailResultOutputSchema>;
	listProviders: z.infer<typeof ListProvidersOutputSchema>;
	listWebhooks: z.infer<typeof ListWebhooksOutputSchema>;
	createWebhook: z.infer<typeof CreateWebhookOutputSchema>;
	deleteWebhook: z.infer<typeof DeleteWebhookOutputSchema>;
};
