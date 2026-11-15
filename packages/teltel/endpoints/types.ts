import { z } from 'zod';

// Inputs use TelTEL's own parameter names. Every response wraps its payload in
// `data`, and the create, update and delete routes put their result in `data`
// or `meta`. TelTEL also expects a request body wrapped in `data`, which each
// endpoint builds. Outputs are `.loose()` and their optional fields nullish.
// Field reference: https://apidoc.teltel.io

/**
 * TelTEL pages by offset, not by cursor. `limit` runs from 1 to 5000 and
 * defaults to 500, which is large enough that a caller who omits it sees the
 * whole list in one page.
 */
export const LimitSchema = z
	.number()
	.int()
	.min(1)
	.max(5000)
	.optional()
	.describe('Results to return, 1 to 5000. TelTEL defaults it to 500.');
export const OffsetSchema = z
	.number()
	.int()
	.min(0)
	.optional()
	.describe('Results to skip. TelTEL defaults it to 0.');
export const FieldsSchema = z
	.string()
	.optional()
	.describe('Comma-separated field names to return, leaving the rest out.');

const PagingShape = {
	limit: LimitSchema,
	offset: OffsetSchema,
	fields: FieldsSchema,
} as const;

/**
 * TelTEL's delete and update answers report the outcome under `meta`, so
 * `meta` is required: a body without it is not a success this plugin can
 * confirm, and parsing one would tell the caller a delete happened on no
 * evidence.
 */
export const MetaResultSchema = z.object({
	meta: z
		.object({
			deleted: z.boolean().nullish(),
			updated: z.boolean().nullish(),
		})
		.loose(),
});

export type MetaResult = z.infer<typeof MetaResultSchema>;

// ── account ───────────────────────────────────────────────────────────────

export const BalanceInputSchema = z.object({});

export type BalanceInput = z.infer<typeof BalanceInputSchema>;

export const BalanceEntrySchema = z
	.object({
		// These arrive as floats; a negative credit means money is owed.
		credit: z.number().nullish(),
		credit_limit: z.number().nullish(),
		balance: z.number().nullish(),
	})
	.loose();

export const BalanceResponseSchema = z
	.object({ data: z.array(BalanceEntrySchema) })
	.loose();

export type BalanceResponse = z.infer<typeof BalanceResponseSchema>;

// ── SMS outbox ────────────────────────────────────────────────────────────

export const SmsSendInputSchema = z.object({
	from: z
		.string()
		.min(3)
		.max(14)
		.describe(
			'The sender: a numeric number or a 3 to 11 character alphanumeric sender ID. Only verified numbers work unless dynamic sender IDs are enabled.',
		),
	to: z
		.string()
		.min(1)
		.describe('The destination number in international format.'),
	message: z.string().min(1).describe('The message body.'),
	callback: z
		.union([z.boolean(), z.string()])
		.optional()
		.describe(
			'A delivery receipt URL, or a boolean to use the account default.',
		),
});

export type SmsSendInput = z.infer<typeof SmsSendInputSchema>;

export const SmsSendResponseSchema = z
	.object({ data: z.object({ id: z.string() }).loose() })
	.loose();

export type SmsSendResponse = z.infer<typeof SmsSendResponseSchema>;

export const SmsSendBulkInputSchema = z.object({
	messages: z
		.array(SmsSendInputSchema)
		.min(1)
		.describe('The messages to send, one entry per recipient.'),
});

export type SmsSendBulkInput = z.infer<typeof SmsSendBulkInputSchema>;

export const BulkSendResultSchema = z
	.object({
		id: z.string().nullish(),
		index: z.number().nullish(),
	})
	.loose();

/**
 * A bulk send answers 200 with the IDs it created, or 207 with a mix of
 * successes and per-message errors. Both shapes are modelled so a partial
 * result parses instead of failing the call.
 */
export const SmsSendBulkResponseSchema = z
	.object({
		data: z
			.union([
				z.array(BulkSendResultSchema),
				z
					.object({
						success: z.array(BulkSendResultSchema).nullish(),
						errors: z
							.array(
								z
									.object({
										index: z.number().nullish(),
										title: z.string().nullish(),
										detail: z.string().nullish(),
									})
									.loose(),
							)
							.nullish(),
					})
					.loose(),
			])
			.nullish(),
		// The 207 payload puts the same split under data, but TelTEL has also
		// sent it at the top level, so both are read.
		success: z.array(BulkSendResultSchema).nullish(),
		errors: z.array(z.record(z.string(), z.string())).nullish(),
	})
	.loose();

export type SmsSendBulkResponse = z.infer<typeof SmsSendBulkResponseSchema>;

export const SmsReportsListInputSchema = z.object({
	...PagingShape,
	sort: z
		.string()
		.optional()
		.describe('A field to sort by; prefix it with "-" for descending.'),
	state: z.string().optional().describe('Only messages in this state.'),
	from: z.string().optional().describe('Only messages from this number.'),
	to: z.string().optional().describe('Only messages to this number.'),
	'created_at[from]': z
		.string()
		.optional()
		.describe('Only messages created on or after this timestamp.'),
	'created_at[to]': z
		.string()
		.optional()
		.describe('Only messages created on or before this timestamp.'),
});

export type SmsReportsListInput = z.infer<typeof SmsReportsListInputSchema>;

export const SmsReportSchema = z
	.object({
		id: z.number(),
		from: z.string().nullish(),
		to: z.string().nullish(),
		country: z.record(z.string(), z.string()).nullish(),
		operator: z.record(z.string(), z.string()).nullish(),
		created_at: z.string().nullish(),
		delivered: z.string().nullish(),
		multipart: z.boolean().nullish(),
		parts: z.number().nullish(),
		price: z.number().nullish(),
		sum: z.number().nullish(),
		state: z.string().nullish(),
		detailed_state: z.string().nullish(),
		message: z.string().nullish(),
		campaign_id: z.number().nullish(),
		error_msg: z.number().nullish(),
	})
	.loose();

export type TelTELSmsReport = z.infer<typeof SmsReportSchema>;

export const SmsReportsListResponseSchema = z
	.object({ data: z.array(SmsReportSchema) })
	.loose();

export type SmsReportsListResponse = z.infer<
	typeof SmsReportsListResponseSchema
>;

export const SmsReportGetInputSchema = z.object({
	reportId: z.number().int().positive().describe('The message report ID.'),
});

export type SmsReportGetInput = z.infer<typeof SmsReportGetInputSchema>;

export const SmsReportGetResponseSchema = z
	.object({ data: SmsReportSchema })
	.loose();

export type SmsReportGetResponse = z.infer<typeof SmsReportGetResponseSchema>;

// ── SMS inbox ─────────────────────────────────────────────────────────────

export const InboxListInputSchema = z.object({
	...PagingShape,
	sort: z.string().optional(),
	from: z.string().optional(),
	to: z.string().optional(),
});

export type InboxListInput = z.infer<typeof InboxListInputSchema>;

export const InboxMessageSchema = z
	.object({
		id: z.number(),
		from: z.string().nullish(),
		to: z.string().nullish(),
		state: z.string().nullish(),
		received_at: z.string().nullish(),
		message: z.string().nullish(),
		error_msg: z.number().nullish(),
		sms_handler_email: z.string().nullish(),
		sms_handler_url: z.string().nullish(),
	})
	.loose();

export const InboxListResponseSchema = z
	.object({ data: z.array(InboxMessageSchema) })
	.loose();

export type InboxListResponse = z.infer<typeof InboxListResponseSchema>;

export const InboxGetInputSchema = z.object({
	inboxMessageId: z
		.number()
		.int()
		.positive()
		.describe('The inbound message ID.'),
});

export type InboxGetInput = z.infer<typeof InboxGetInputSchema>;

export const InboxGetResponseSchema = z
	.object({ data: InboxMessageSchema })
	.loose();

export type InboxGetResponse = z.infer<typeof InboxGetResponseSchema>;

// ── SMS campaigns ─────────────────────────────────────────────────────────

export const CampaignCreateInputSchema = z.object({
	title: z.string().min(1).describe('The campaign title.'),
	from: z.string().min(1).describe('The sender for the campaign.'),
	contact_groups: z
		.array(z.number().int().positive())
		.min(1)
		.describe('The contact group IDs to send to.'),
	message: z.string().min(1).describe('The message body.'),
	rate: z
		.number()
		.int()
		.min(1)
		.optional()
		.describe('Messages per minute. TelTEL picks its own rate when omitted.'),
	unicode: z.boolean().optional(),
	type: z.string().optional(),
});

export type CampaignCreateInput = z.infer<typeof CampaignCreateInputSchema>;

export const CampaignCreateResponseSchema = z
	.object({
		data: z.object({ id: z.number(), title: z.string().nullish() }).loose(),
	})
	.loose();

export type CampaignCreateResponse = z.infer<
	typeof CampaignCreateResponseSchema
>;

export const CampaignsListInputSchema = z.object({
	...PagingShape,
	sort: z.string().optional(),
	state: z.string().optional(),
});

export type CampaignsListInput = z.infer<typeof CampaignsListInputSchema>;

export const CampaignSchema = z
	.object({
		id: z.number(),
		title: z.string().nullish(),
		from: z.string().nullish(),
		contact_groups: z.array(z.number()).nullish(),
		message: z.string().nullish(),
		rate: z.number().nullish(),
		unicode: z.boolean().nullish(),
		state: z.string().nullish(),
		type: z.string().nullish(),
		created_at: z.string().nullish(),
	})
	.loose();

export type TelTELCampaign = z.infer<typeof CampaignSchema>;

export const CampaignsListResponseSchema = z
	.object({ data: z.array(CampaignSchema) })
	.loose();

export type CampaignsListResponse = z.infer<typeof CampaignsListResponseSchema>;

export const CampaignGetInputSchema = z.object({
	campaignId: z.number().int().positive().describe('The SMS campaign ID.'),
});

export type CampaignGetInput = z.infer<typeof CampaignGetInputSchema>;

export const CampaignGetResponseSchema = z
	.object({ data: CampaignSchema })
	.loose();

export type CampaignGetResponse = z.infer<typeof CampaignGetResponseSchema>;

export const CampaignUpdateInputSchema = z.object({
	campaignId: z.number().int().positive().describe('The campaign to change.'),
	title: z.string().min(1).optional(),
	from: z.string().min(1).optional(),
	contact_groups: z.array(z.number().int().positive()).optional(),
	message: z.string().min(1).optional(),
	rate: z.number().int().min(1).optional(),
});

export type CampaignUpdateInput = z.infer<typeof CampaignUpdateInputSchema>;

export const CampaignActionInputSchema = z.object({
	campaignId: z.number().int().positive().describe('The campaign to act on.'),
	action: z
		.enum(['start', 'pause', 'stop'])
		.describe('What to do: start sending, pause, or stop for good.'),
});

export type CampaignActionInput = z.infer<typeof CampaignActionInputSchema>;

export const CampaignActionResponseSchema = z
	.object({
		data: z
			.object({
				status: z.number().nullish(),
				message: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type CampaignActionResponse = z.infer<
	typeof CampaignActionResponseSchema
>;

// ── contacts ──────────────────────────────────────────────────────────────

export const ContactsListInputSchema = z.object({
	...PagingShape,
	sort: z.string().optional(),
	group_id: z.number().int().positive().optional(),
	phone: z.string().optional(),
});

export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

export const ContactSchema = z
	.object({
		id: z.number(),
		group_id: z.number().nullish(),
		phone: z.string().nullish(),
		param_1: z.string().nullish(),
		param_2: z.string().nullish(),
		param_3: z.string().nullish(),
		param_4: z.string().nullish(),
		param_5: z.string().nullish(),
	})
	.loose();

export type TelTELContact = z.infer<typeof ContactSchema>;

export const ContactsListResponseSchema = z
	.object({ data: z.array(ContactSchema) })
	.loose();

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

export const ContactCreateInputSchema = z.object({
	phone: z.string().min(1).describe('The contact phone number.'),
	group_id: z
		.number()
		.int()
		.positive()
		.describe('The contact group ID, from `contactGroups.list`.'),
	param_1: z.string().optional().describe('A custom field.'),
	param_2: z.string().optional(),
	param_3: z.string().optional(),
	param_4: z.string().optional(),
	param_5: z.string().optional(),
});

export type ContactCreateInput = z.infer<typeof ContactCreateInputSchema>;

export const ContactCreateResponseSchema = z
	.object({
		data: z.object({ id: z.number(), phone: z.string().nullish() }).loose(),
	})
	.loose();

export type ContactCreateResponse = z.infer<typeof ContactCreateResponseSchema>;

export const ContactsCreateBulkInputSchema = z.object({
	contacts: z
		.array(ContactCreateInputSchema)
		.min(1)
		.describe('The contacts to create in one call.'),
});

export type ContactsCreateBulkInput = z.infer<
	typeof ContactsCreateBulkInputSchema
>;

export const ContactsCreateBulkResponseSchema = z
	.object({
		data: z
			.union([
				z.array(z.object({ id: z.number() }).loose()),
				z
					.object({
						success: z.array(z.object({ id: z.number() }).loose()).nullish(),
						errors: z
							.array(
								z
									.object({
										index: z.number().nullish(),
										title: z.string().nullish(),
										detail: z.string().nullish(),
									})
									.loose(),
							)
							.nullish(),
					})
					.loose(),
			])
			.nullish(),
	})
	.loose();

export type ContactsCreateBulkResponse = z.infer<
	typeof ContactsCreateBulkResponseSchema
>;

export const ContactGetInputSchema = z.object({
	contactId: z.number().int().positive().describe('The contact ID.'),
});

export type ContactGetInput = z.infer<typeof ContactGetInputSchema>;

export const ContactGetResponseSchema = z
	.object({ data: ContactSchema })
	.loose();

export type ContactGetResponse = z.infer<typeof ContactGetResponseSchema>;

export const ContactUpdateInputSchema = z
	.object({
		contactId: z.number().int().positive().describe('The contact to change.'),
		phone: z.string().min(1).optional(),
		group_id: z.number().int().positive().optional(),
		param_1: z.string().optional(),
		param_2: z.string().optional(),
		param_3: z.string().optional(),
		param_4: z.string().optional(),
		param_5: z.string().optional(),
	})
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'contactId'),
		'Provide at least one field to change.',
	);

export type ContactUpdateInput = z.infer<typeof ContactUpdateInputSchema>;

export const ContactRemoveInputSchema = z.object({
	contactId: z.number().int().positive().describe('The contact to delete.'),
});

export type ContactRemoveInput = z.infer<typeof ContactRemoveInputSchema>;

// ── contact groups ────────────────────────────────────────────────────────

export const ContactGroupsListInputSchema = z.object({ ...PagingShape });

export type ContactGroupsListInput = z.infer<
	typeof ContactGroupsListInputSchema
>;

export const ContactGroupSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		total_contacts: z.number().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type TelTELContactGroup = z.infer<typeof ContactGroupSchema>;

export const ContactGroupsListResponseSchema = z
	.object({ data: z.array(ContactGroupSchema) })
	.loose();

export type ContactGroupsListResponse = z.infer<
	typeof ContactGroupsListResponseSchema
>;

export const ContactGroupCreateInputSchema = z.object({
	name: z.string().min(1).describe('The group name.'),
});

export type ContactGroupCreateInput = z.infer<
	typeof ContactGroupCreateInputSchema
>;

export const ContactGroupResponseSchema = z
	.object({ data: ContactGroupSchema })
	.loose();

export type ContactGroupResponse = z.infer<typeof ContactGroupResponseSchema>;

export const ContactGroupGetInputSchema = z.object({
	groupId: z.number().int().positive().describe('The contact group ID.'),
});

export type ContactGroupGetInput = z.infer<typeof ContactGroupGetInputSchema>;

export const ContactGroupUpdateInputSchema = z.object({
	groupId: z.number().int().positive().describe('The group to rename.'),
	name: z.string().min(1).describe('The new group name.'),
});

export type ContactGroupUpdateInput = z.infer<
	typeof ContactGroupUpdateInputSchema
>;

export const ContactGroupRemoveInputSchema = z.object({
	groupId: z.number().int().positive().describe('The group to delete.'),
});

export type ContactGroupRemoveInput = z.infer<
	typeof ContactGroupRemoveInputSchema
>;

export const ContactGroupContactsInputSchema = z.object({
	...PagingShape,
	groupId: z.number().int().positive().describe('The contact group ID.'),
});

export type ContactGroupContactsInput = z.infer<
	typeof ContactGroupContactsInputSchema
>;

export const ContactGroupContactsResponseSchema = z
	.object({ data: z.array(ContactSchema) })
	.loose();

export type ContactGroupContactsResponse = z.infer<
	typeof ContactGroupContactsResponseSchema
>;

// ── calls ─────────────────────────────────────────────────────────────────

export const CallsListInputSchema = z.object({
	...PagingShape,
	sort: z
		.string()
		.optional()
		.describe('Fields to sort by; prefix one with "-" for descending.'),
	direction: z.enum(['inbound', 'outbound']).optional(),
	'starttime[from]': z.string().optional(),
	'starttime[to]': z.string().optional(),
});

export type CallsListInput = z.infer<typeof CallsListInputSchema>;

export const CallSchema = z
	.object({
		call_id: z.string(),
		starttime: z.string().nullish(),
		stoptime: z.string().nullish(),
		direction: z.string().nullish(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		duration_sec: z.number().nullish(),
		waiting_sec: z.number().nullish(),
		handle_sec: z.number().nullish(),
		rate: z.number().nullish(),
		cost: z.number().nullish(),
		caller: z.record(z.string(), z.string()).nullish(),
		callee: z.record(z.string(), z.string()).nullish(),
		extra_prefix: z.string().nullish(),
		hangup_by: z.string().nullish(),
		hangup_value: z.string().nullish(),
		call_flow: z.string().nullish(),
		audio_url: z.string().nullish(),
	})
	.loose();

export type TelTELCall = z.infer<typeof CallSchema>;

export const CallsListResponseSchema = z
	.object({ data: z.array(CallSchema) })
	.loose();

export type CallsListResponse = z.infer<typeof CallsListResponseSchema>;

export const CallCreateInputSchema = z.object({
	caller_number: z
		.string()
		.min(1)
		.describe('The phone number or SIP device that places the call.'),
	caller_displayname: z.string().optional(),
	destination_number: z.string().min(1).describe('The number to dial.'),
	destination_displayname: z
		.string()
		.min(1)
		.describe('The display name shown to the destination.'),
});

export type CallCreateInput = z.infer<typeof CallCreateInputSchema>;

export const CallCreateResponseSchema = z
	.object({
		data: z
			.object({
				status: z.number().nullish(),
				message: z.string().nullish(),
			})
			.loose()
			.nullish(),
	})
	.loose();

export type CallCreateResponse = z.infer<typeof CallCreateResponseSchema>;

// ── DID numbers ───────────────────────────────────────────────────────────

export const NumbersListInputSchema = z.object({
	...PagingShape,
	sort: z.string().optional(),
});

export type NumbersListInput = z.infer<typeof NumbersListInputSchema>;

export const PhoneNumberSchema = z
	.object({
		id: z.number(),
		activated: z.number().nullish(),
		iduser: z.number().nullish(),
		country_id: z.number().nullish(),
		country_name: z.string().nullish(),
		did: z.string().nullish(),
		overphone: z.string().nullish(),
		description: z.string().nullish(),
		monthly_price: z.number().nullish(),
		reservation_date: z.string().nullish(),
		release_date: z.string().nullish(),
		next_payment_date: z.string().nullish(),
		month_payed: z.number().nullish(),
		auto_renew: z.number().nullish(),
		sms_support: z.number().nullish(),
		sms_handler_url: z.string().nullish(),
		sms_handler_email: z.string().nullish(),
		spam_score: z.number().nullish(),
		spam_checked_at: z.string().nullish(),
		spam_score_details: z.string().nullish(),
		groups: z.array(z.number()).nullish(),
		users: z.array(z.number()).nullish(),
	})
	.loose();

export type TelTELPhoneNumber = z.infer<typeof PhoneNumberSchema>;

export const NumbersListResponseSchema = z
	.object({ data: z.array(PhoneNumberSchema) })
	.loose();

export type NumbersListResponse = z.infer<typeof NumbersListResponseSchema>;

export const NumbersGetInputSchema = z.object({
	numberId: z.number().int().positive().describe('The DID number resource ID.'),
});

export type NumbersGetInput = z.infer<typeof NumbersGetInputSchema>;

export const NumbersGetResponseSchema = z
	.object({ data: PhoneNumberSchema })
	.loose();

export type NumbersGetResponse = z.infer<typeof NumbersGetResponseSchema>;

export const NumbersUpdateInputSchema = z
	.object({
		numberId: z.number().int().positive().describe('The number to change.'),
		auto_renew: z.boolean().optional(),
		description: z.string().nullable().optional(),
		sms_handler_url: z.string().nullable().optional(),
		sms_handler_email: z.string().nullable().optional(),
	})
	.refine(
		(value) => Object.keys(value).some((key) => key !== 'numberId'),
		'Provide at least one field to change.',
	);

export type NumbersUpdateInput = z.infer<typeof NumbersUpdateInputSchema>;

export const NumberCountriesListInputSchema = z.object({ ...PagingShape });

export type NumberCountriesListInput = z.infer<
	typeof NumberCountriesListInputSchema
>;

export const NumberCountrySchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		prefix: z.string().nullish(),
		sms_support: z.number().nullish(),
		needs_verification: z.number().nullish(),
	})
	.loose();

export type TelTELNumberCountry = z.infer<typeof NumberCountrySchema>;

export const NumberCountriesListResponseSchema = z
	.object({ data: z.array(NumberCountrySchema) })
	.loose();

export type NumberCountriesListResponse = z.infer<
	typeof NumberCountriesListResponseSchema
>;

export const NumberCountryGetInputSchema = z.object({
	countryId: z.number().int().positive().describe('The country resource ID.'),
});

export type NumberCountryGetInput = z.infer<typeof NumberCountryGetInputSchema>;

export const NumberCountryGetResponseSchema = z
	.object({ data: NumberCountrySchema })
	.loose();

export type NumberCountryGetResponse = z.infer<
	typeof NumberCountryGetResponseSchema
>;

export const PriceGroupsListInputSchema = z.object({
	countryId: z
		.number()
		.int()
		.positive()
		.describe('The country resource ID the price groups belong to.'),
	...PagingShape,
});

export type PriceGroupsListInput = z.infer<typeof PriceGroupsListInputSchema>;

export const PriceGroupSchema = z
	.object({
		price_group_id: z.number(),
		country_id: z.number().nullish(),
		name: z.string().nullish(),
		prefix: z.string().nullish(),
	})
	.loose();

export const PriceGroupsListResponseSchema = z
	.object({ data: z.array(PriceGroupSchema) })
	.loose();

export type PriceGroupsListResponse = z.infer<
	typeof PriceGroupsListResponseSchema
>;

// ── users ─────────────────────────────────────────────────────────────────

export const UsersListInputSchema = z.object({ ...PagingShape });

export type UsersListInput = z.infer<typeof UsersListInputSchema>;

export const UserSchema = z
	.object({
		id: z.number(),
		name: z.string().nullish(),
		realname: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

export type TelTELUser = z.infer<typeof UserSchema>;

export const UsersListResponseSchema = z
	.object({ data: z.array(UserSchema) })
	.loose();

export type UsersListResponse = z.infer<typeof UsersListResponseSchema>;

// ── registry ──────────────────────────────────────────────────────────────

export type TeltelEndpointInputs = {
	accountBalance: BalanceInput;
	smsSend: SmsSendInput;
	smsSendBulk: SmsSendBulkInput;
	smsReportsList: SmsReportsListInput;
	smsReportsGet: SmsReportGetInput;
	inboxList: InboxListInput;
	inboxGet: InboxGetInput;
	campaignsList: CampaignsListInput;
	campaignsGet: CampaignGetInput;
	campaignsCreate: CampaignCreateInput;
	campaignsUpdate: CampaignUpdateInput;
	campaignsAction: CampaignActionInput;
	campaignsRemove: CampaignGetInput;
	contactsList: ContactsListInput;
	contactsGet: ContactGetInput;
	contactsCreate: ContactCreateInput;
	contactsCreateBulk: ContactsCreateBulkInput;
	contactsUpdate: ContactUpdateInput;
	contactsRemove: ContactRemoveInput;
	contactGroupsList: ContactGroupsListInput;
	contactGroupsGet: ContactGroupGetInput;
	contactGroupsCreate: ContactGroupCreateInput;
	contactGroupsUpdate: ContactGroupUpdateInput;
	contactGroupsRemove: ContactGroupRemoveInput;
	contactGroupsContacts: ContactGroupContactsInput;
	callsList: CallsListInput;
	callsCreate: CallCreateInput;
	numbersList: NumbersListInput;
	numbersGet: NumbersGetInput;
	numbersUpdate: NumbersUpdateInput;
	numberCountriesList: NumberCountriesListInput;
	numberCountryGet: NumberCountryGetInput;
	priceGroupsList: PriceGroupsListInput;
	usersList: UsersListInput;
};

export type TeltelEndpointOutputs = {
	accountBalance: BalanceResponse;
	smsSend: SmsSendResponse;
	smsSendBulk: SmsSendBulkResponse;
	smsReportsList: SmsReportsListResponse;
	smsReportsGet: SmsReportGetResponse;
	inboxList: InboxListResponse;
	inboxGet: InboxGetResponse;
	campaignsList: CampaignsListResponse;
	campaignsGet: CampaignGetResponse;
	campaignsCreate: CampaignCreateResponse;
	campaignsUpdate: CampaignActionResponse;
	campaignsAction: CampaignActionResponse;
	campaignsRemove: MetaResult;
	contactsList: ContactsListResponse;
	contactsGet: ContactGetResponse;
	contactsCreate: ContactCreateResponse;
	contactsCreateBulk: ContactsCreateBulkResponse;
	contactsUpdate: MetaResult;
	contactsRemove: MetaResult;
	contactGroupsList: ContactGroupsListResponse;
	contactGroupsGet: ContactGroupResponse;
	contactGroupsCreate: ContactGroupResponse;
	contactGroupsUpdate: MetaResult;
	contactGroupsRemove: MetaResult;
	contactGroupsContacts: ContactGroupContactsResponse;
	callsList: CallsListResponse;
	callsCreate: CallCreateResponse;
	numbersList: NumbersListResponse;
	numbersGet: NumbersGetResponse;
	numbersUpdate: MetaResult;
	numberCountriesList: NumberCountriesListResponse;
	numberCountryGet: NumberCountryGetResponse;
	priceGroupsList: PriceGroupsListResponse;
	usersList: UsersListResponse;
};

export const TeltelEndpointInputSchemas = {
	accountBalance: BalanceInputSchema,
	smsSend: SmsSendInputSchema,
	smsSendBulk: SmsSendBulkInputSchema,
	smsReportsList: SmsReportsListInputSchema,
	smsReportsGet: SmsReportGetInputSchema,
	inboxList: InboxListInputSchema,
	inboxGet: InboxGetInputSchema,
	campaignsList: CampaignsListInputSchema,
	campaignsGet: CampaignGetInputSchema,
	campaignsCreate: CampaignCreateInputSchema,
	campaignsUpdate: CampaignUpdateInputSchema,
	campaignsAction: CampaignActionInputSchema,
	campaignsRemove: CampaignGetInputSchema,
	contactsList: ContactsListInputSchema,
	contactsGet: ContactGetInputSchema,
	contactsCreate: ContactCreateInputSchema,
	contactsCreateBulk: ContactsCreateBulkInputSchema,
	contactsUpdate: ContactUpdateInputSchema,
	contactsRemove: ContactRemoveInputSchema,
	contactGroupsList: ContactGroupsListInputSchema,
	contactGroupsGet: ContactGroupGetInputSchema,
	contactGroupsCreate: ContactGroupCreateInputSchema,
	contactGroupsUpdate: ContactGroupUpdateInputSchema,
	contactGroupsRemove: ContactGroupRemoveInputSchema,
	contactGroupsContacts: ContactGroupContactsInputSchema,
	callsList: CallsListInputSchema,
	callsCreate: CallCreateInputSchema,
	numbersList: NumbersListInputSchema,
	numbersGet: NumbersGetInputSchema,
	numbersUpdate: NumbersUpdateInputSchema,
	numberCountriesList: NumberCountriesListInputSchema,
	numberCountryGet: NumberCountryGetInputSchema,
	priceGroupsList: PriceGroupsListInputSchema,
	usersList: UsersListInputSchema,
} as const;

export const TeltelEndpointOutputSchemas = {
	accountBalance: BalanceResponseSchema,
	smsSend: SmsSendResponseSchema,
	smsSendBulk: SmsSendBulkResponseSchema,
	smsReportsList: SmsReportsListResponseSchema,
	smsReportsGet: SmsReportGetResponseSchema,
	inboxList: InboxListResponseSchema,
	inboxGet: InboxGetResponseSchema,
	campaignsList: CampaignsListResponseSchema,
	campaignsGet: CampaignGetResponseSchema,
	campaignsCreate: CampaignCreateResponseSchema,
	campaignsUpdate: CampaignActionResponseSchema,
	campaignsAction: CampaignActionResponseSchema,
	campaignsRemove: MetaResultSchema,
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactGetResponseSchema,
	contactsCreate: ContactCreateResponseSchema,
	contactsCreateBulk: ContactsCreateBulkResponseSchema,
	contactsUpdate: MetaResultSchema,
	contactsRemove: MetaResultSchema,
	contactGroupsList: ContactGroupsListResponseSchema,
	contactGroupsGet: ContactGroupResponseSchema,
	contactGroupsCreate: ContactGroupResponseSchema,
	contactGroupsUpdate: MetaResultSchema,
	contactGroupsRemove: MetaResultSchema,
	contactGroupsContacts: ContactGroupContactsResponseSchema,
	callsList: CallsListResponseSchema,
	callsCreate: CallCreateResponseSchema,
	numbersList: NumbersListResponseSchema,
	numbersGet: NumbersGetResponseSchema,
	numbersUpdate: MetaResultSchema,
	numberCountriesList: NumberCountriesListResponseSchema,
	numberCountryGet: NumberCountryGetResponseSchema,
	priceGroupsList: PriceGroupsListResponseSchema,
	usersList: UsersListResponseSchema,
} as const;
