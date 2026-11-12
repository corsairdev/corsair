import { z } from 'zod';

// Inputs use Unisender's own argument names. Outputs are `.loose()` and the
// documented optionals nullish, so a field Unisender adds or omits cannot fail a
// call that has already happened. Shapes come from the per-method pages under
// https://www.unisender.com/ru/support/api/ and the live API.
//
// Every method answers `{"result": ...}`, so the models unwrap that key. The
// `format=json` argument and the `api_key` are added by the client, not the caller.

/** Unisender's `result` wrapper, whose payload differs per method. */
const resultOf = <T extends z.ZodType>(payload: T) =>
	z.object({ result: payload }).loose();

/** The statuses a contact's email can be in. */
export const UNISENDER_EMAIL_STATUSES = [
	'new',
	'invited',
	'active',
	'unsubscribed',
	'blocked',
	'hard_bounced',
	'soft_bounced',
] as const;

const ListIdSchema = z
	.number()
	.int()
	.describe('A contact list id from lists.list.');

// ── lists ─────────────────────────────────────────────────────────────────

const ListsListInputSchema = z.object({});

const ListSchema = z
	.object({
		id: z.number().nullish(),
		title: z.string().nullish(),
	})
	.loose();

export type UnisenderList = z.infer<typeof ListSchema>;

const ListsListResponseSchema = resultOf(z.array(ListSchema));

export type ListsListResponse = z.infer<typeof ListsListResponseSchema>;

const ListsCreateInputSchema = z.object({
	title: z
		.string()
		.min(1)
		.describe(
			'The list name, unique within the account. A duplicate name is an error.',
		),
	before_subscribe_url: z
		.string()
		.optional()
		.describe('Where to send a contact before they confirm a subscription.'),
	after_subscribe_url: z
		.string()
		.optional()
		.describe('Where to send a contact after they confirm a subscription.'),
});

export type ListsCreateInput = z.infer<typeof ListsCreateInputSchema>;

/** A create answers only the new list's id. */
const ListsCreateResponseSchema = resultOf(
	z.object({ id: z.number().nullish() }).loose(),
);

export type ListsCreateResponse = z.infer<typeof ListsCreateResponseSchema>;

const ListsDeleteInputSchema = z.object({
	list_id: ListIdSchema,
});

export type ListsDeleteInput = z.infer<typeof ListsDeleteInputSchema>;

/**
 * A delete answers an empty acknowledgement. The live API sends `{"result":{}}`
 * (captured 11-12, also what the deleteField page shows); an empty string is also
 * accepted because older pages describe it. The `""` inside an error envelope never
 * reaches this schema: the client throws on the `code` first.
 */
const EmptyAckSchema = z.union([z.object({}).loose(), z.literal('')]);

const ListsDeleteResponseSchema = resultOf(EmptyAckSchema);

export type ListsDeleteResponse = z.infer<typeof ListsDeleteResponseSchema>;

// ── contacts ──────────────────────────────────────────────────────────────

const ContactsGetInputSchema = z.object({
	email: z.string().min(1),
	list_id: ListIdSchema.optional().describe(
		'Read the contact as they appear in this list, when the fields differ per list.',
	),
	include_lists: z
		.boolean()
		.optional()
		.describe('Also return the lists the contact belongs to.'),
	include_fields: z
		.boolean()
		.optional()
		.describe('Also return the custom field values.'),
	include_details: z
		.boolean()
		.optional()
		.describe('Also return the extended contact details.'),
});

export type ContactsGetInput = z.infer<typeof ContactsGetInputSchema>;

/**
 * One contact.
 *
 * `email` is an object rather than a string, holding the address, its `added_at`
 * and its `status` — one of new, invited, active, unsubscribed and the bounce
 * states. `status` is what decides whether the address can be mailed at all.
 */
const ContactEmailSchema = z
	.object({
		email: z.string().nullish(),
		added_at: z.string().nullish().describe('YYYY-MM-DD hh:mm:ss in UTC.'),
		status: z
			.string()
			.nullish()
			.describe(
				'new, invited, active, unsubscribed, blocked or a bounce state.',
			),
	})
	.loose();

const ContactsGetResponseSchema = resultOf(
	z
		.object({
			email: ContactEmailSchema.nullish(),
			// With include_lists the ids arrive as strings, so both forms are accepted.
			lists: z
				.array(
					z
						.object({
							id: z
								.union([z.number(), z.string()])
								.nullish()
								.describe('Numeric in some responses, a string in others.'),
							name: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
			// With include_fields the values come back keyed by field name, not an array.
			fields: z
				.union([
					z.record(z.string(), z.unknown()),
					z.array(z.record(z.string(), z.unknown())),
				])
				.nullish(),
			details: z.record(z.string(), z.unknown()).nullish(),
		})
		.loose(),
);

export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

const ContactsSubscribeInputSchema = z.object({
	list_ids: z
		.array(ListIdSchema)
		.min(1)
		.describe('The lists to add the contact to.'),
	email: z.string().min(1),
	fields: z
		.record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
		.optional()
		.describe('Custom field name to value, sent as fields[<name>]=value.'),
	// Unisender documents 0, 3 and 4 only; 1 is not a valid value.
	double_optin: z
		.union([z.literal(0), z.literal(3), z.literal(4)])
		.optional()
		.describe(
			'0 sends a confirmation invitation and leaves the contact unconfirmed until it is accepted, 3 adds the contact as new with no email, 4 adds it silently when it already exists in your lists and sends an invitation otherwise.',
		),
	overwrite: z
		.union([z.literal(0), z.literal(1), z.literal(2)])
		.optional()
		.describe(
			'0 adds new fields and tags and keeps existing ones, 1 REPLACES every field and tag and removes the contact from all lists not named in list_ids, 2 replaces only the fields you send and keeps the rest.',
		),
	tags: z
		.array(z.string())
		.max(10)
		.optional()
		.describe('Up to 10 tags to add.'),
});

export type ContactsSubscribeInput = z.infer<
	typeof ContactsSubscribeInputSchema
>;

/**
 * A subscribe answers `{"result": {"person_id": <int>}}` and nothing else. The
 * contact's confirmation status is not in this response; read it with contacts.get.
 */
const ContactsSubscribeResponseSchema = resultOf(
	z
		.object({
			person_id: z.union([z.number(), z.string()]).nullish(),
		})
		.loose(),
);

export type ContactsSubscribeResponse = z.infer<
	typeof ContactsSubscribeResponseSchema
>;

const ContactsUnsubscribeInputSchema = z.object({
	email: z.string().min(1),
	contact_type: z
		.literal('email')
		.optional()
		.describe('email is the documented value; it is sent explicitly.'),
	list_ids: z
		.array(ListIdSchema)
		.min(1)
		.optional()
		.describe(
			'The lists to unsubscribe from. Omit it to unsubscribe from every list the contact is in.',
		),
});

export type ContactsUnsubscribeInput = z.infer<
	typeof ContactsUnsubscribeInputSchema
>;

/** Unsubscribe and exclude answer the contact as they stand afterwards. */
const ContactsUnsubscribeResponseSchema = resultOf(
	z.record(z.string(), z.unknown()),
);

export type ContactsUnsubscribeResponse = z.infer<
	typeof ContactsUnsubscribeResponseSchema
>;

/** An exclude removes the contact from lists without marking them unsubscribed. */
const ContactsExcludeInputSchema = ContactsUnsubscribeInputSchema;

export type ContactsExcludeInput = z.infer<typeof ContactsExcludeInputSchema>;

const ContactsExcludeResponseSchema = resultOf(
	z.record(z.string(), z.unknown()),
);

export type ContactsExcludeResponse = z.infer<
	typeof ContactsExcludeResponseSchema
>;

const ContactsImportInputSchema = z.object({
	field_names: z
		.array(z.string().min(1))
		.min(1)
		.describe(
			'The column names, which must include email. `email_list_ids` is a comma-separated list of list codes to subscribe each row to, `tags` is a comma-separated tag list, and `delete` set to 1 removes the contact.',
		),
	data: z
		.array(z.array(z.union([z.string(), z.number(), z.boolean()])))
		.min(1)
		.max(500)
		.describe(
			'Rows, each with a value per field_names entry and in the same order. At most 500 contacts per call.',
		),
	overwrite_tags: z.union([z.literal(0), z.literal(1)]).optional(),
	overwrite_lists: z.union([z.literal(0), z.literal(1)]).optional(),
});

export type ContactsImportInput = z.infer<typeof ContactsImportInputSchema>;

/**
 * The import answers one summary for the whole call, counting what happened to each
 * row. `invalid` covers the role addresses and spam traps Unisender refuses on
 * purpose, and `log` names the reason for each row it did not take.
 */
const ContactsImportResponseSchema = resultOf(
	z
		.object({
			total: z.number().nullish(),
			inserted: z.number().nullish(),
			updated: z.number().nullish(),
			deleted: z.number().nullish(),
			new_emails: z.number().nullish(),
			invalid: z.number().nullish(),
			role_based: z.number().nullish(),
			log: z
				.array(
					z
						.object({
							index: z.union([z.number(), z.string()]).nullish(),
							code: z.string().nullish(),
							message: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);

export type ContactsImportResponse = z.infer<
	typeof ContactsImportResponseSchema
>;

const ContactsCountInputSchema = z.object({
	list_id: ListIdSchema,
	tag_id: z.number().int().optional().describe('Only contacts with this tag.'),
	type: z
		.enum(['address', 'phone'])
		.optional()
		.describe('Only contacts of this kind.'),
	search: z
		.string()
		.optional()
		.describe('A substring of an address or phone; needs `type`.'),
});

export type ContactsCountInput = z.infer<typeof ContactsCountInputSchema>;

const ContactsCountResponseSchema = resultOf(
	z
		.object({
			listId: z.number().nullish(),
			// The documented success body sends "count":"500" as a string.
			count: z.union([z.number(), z.string()]).nullish(),
			searchParams: z.record(z.string(), z.unknown()).nullish(),
		})
		.loose(),
);

export type ContactsCountResponse = z.infer<typeof ContactsCountResponseSchema>;

const ContactsExportInputSchema = z.object({
	list_id: ListIdSchema.optional().describe(
		'Only this list. Omit for every list.',
	),
	notify_url: z
		.string()
		.optional()
		.describe('Where Unisender posts the export when the file is ready.'),
	field_names: z
		.array(z.string())
		.min(1)
		.optional()
		.describe('Only these fields. Omit for every field.'),
});

export type ContactsExportInput = z.infer<typeof ContactsExportInputSchema>;

/** An export is asynchronous and answers only an acknowledgement. */
const ContactsExportResponseSchema = resultOf(
	z.record(z.string(), z.unknown()),
);

export type ContactsExportResponse = z.infer<
	typeof ContactsExportResponseSchema
>;

// ── fields and tags ───────────────────────────────────────────────────────

const FieldsListInputSchema = z.object({});

const FieldSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		type: z.string().nullish().describe('string, text, number or date.'),
		is_visible: z.number().nullish().describe('1 when shown in the admin.'),
		view_pos: z.number().nullish().describe('Display order.'),
	})
	.loose();

export type UnisenderField = z.infer<typeof FieldSchema>;

const FieldsListResponseSchema = resultOf(z.array(FieldSchema));

export type FieldsListResponse = z.infer<typeof FieldsListResponseSchema>;

const FieldsCreateInputSchema = z.object({
	name: z
		.string()
		.min(1)
		.describe('The field name, as used in fields[...] arguments.'),
	type: z
		.enum(['string', 'text', 'number', 'date'])
		.describe('string for a short value, text for a long one.'),
	is_visible: z
		.union([z.literal(0), z.literal(1)])
		.optional()
		.describe('1 to show the field in the admin.'),
	view_pos: z.number().int().optional().describe('Display order.'),
});

export type FieldsCreateInput = z.infer<typeof FieldsCreateInputSchema>;

const FieldsCreateResponseSchema = resultOf(
	z.object({ id: z.number().nullish() }).loose(),
);

export type FieldsCreateResponse = z.infer<typeof FieldsCreateResponseSchema>;

const FieldsDeleteInputSchema = z.object({
	id: z.number().int().describe('The field id from fields.list.'),
});

export type FieldsDeleteInput = z.infer<typeof FieldsDeleteInputSchema>;

// Same empty acknowledgement as lists.delete: `{"result":{}}` on success.
const FieldsDeleteResponseSchema = resultOf(EmptyAckSchema);

export type FieldsDeleteResponse = z.infer<typeof FieldsDeleteResponseSchema>;

const TagsListInputSchema = z.object({});

const TagSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
	})
	.loose();

export type UnisenderTag = z.infer<typeof TagSchema>;

const TagsListResponseSchema = resultOf(z.array(TagSchema));

export type TagsListResponse = z.infer<typeof TagsListResponseSchema>;

// ── messages ──────────────────────────────────────────────────────────────

const MessagesSendEmailInputSchema = z.object({
	email: z
		.string()
		.min(1)
		.describe('The recipient, optionally as `Name <address>`.'),
	sender_name: z.string().min(1).describe('The From display name.'),
	sender_email: z
		.string()
		.min(1)
		.describe('The From address, which must be verified.'),
	subject: z.string().min(1),
	body: z.string().min(1).describe('The HTML body, up to 1 MB.'),
	list_id: ListIdSchema.describe(
		'The list the message is associated with, for unsubscribe handling.',
	),
	track_read: z.union([z.literal(0), z.literal(1)]).optional(),
	track_links: z.union([z.literal(0), z.literal(1)]).optional(),
	cc: z.string().optional().describe('A carbon-copy address.'),
	metadata: z
		.record(z.string(), z.union([z.string(), z.number()]))
		.optional()
		.describe('Your own keys, echoed back by checkEmail.'),
});

export type MessagesSendEmailInput = z.infer<
	typeof MessagesSendEmailInputSchema
>;

/**
 * `sendEmail` answers two different shapes. Without `error_checking` and without a
 * `cc`, the documented answer is `{"result": {"email_id": N}}`. With `error_checking`
 * it is an array of per-recipient results, which may carry per-address errors.
 * Both are accepted; the `email_id` is what `messages.status` takes.
 */
const MessagesSendEmailResultSchema = z
	.object({
		email_id: z
			.union([z.number(), z.string()])
			.nullish()
			.describe('Pass this to messages.status.'),
		email: z.string().nullish(),
		message_id: z.number().nullish(),
		message: z.string().nullish(),
		index: z.number().nullish(),
		errors: z
			.array(
				z
					.object({
						code: z.string().nullish(),
						message: z.string().nullish(),
					})
					.loose(),
			)
			.nullish(),
	})
	.loose();

const MessagesSendEmailResponseSchema = resultOf(
	z.union([
		MessagesSendEmailResultSchema,
		z.array(MessagesSendEmailResultSchema),
	]),
);

export type MessagesSendEmailResponse = z.infer<
	typeof MessagesSendEmailResponseSchema
>;

const MessagesStatusInputSchema = z.object({
	email_id: z
		.array(z.number().int())
		.min(1)
		.max(500)
		.describe('Up to 500 email_id values from messages.sendEmail.'),
});

export type MessagesStatusInput = z.infer<typeof MessagesStatusInputSchema>;

/**
 * Delivery statuses. A status beginning `err_` means delivery failed and one
 * beginning `ok_` means it succeeded or is still in progress; `not_sent` is the
 * documented exception.
 */
const MessagesStatusResponseSchema = resultOf(
	z
		.object({
			statuses: z
				.array(
					z
						.object({
							// The documented statuses carry string ids.
							id: z.union([z.number(), z.string()]).nullish(),
							status: z.string().nullish(),
						})
						.loose(),
				)
				.nullish(),
		})
		.loose(),
);

export type MessagesStatusResponse = z.infer<
	typeof MessagesStatusResponseSchema
>;

const MessagesCreateEmailInputSchema = z.object({
	sender_name: z.string().min(1),
	sender_email: z.string().min(1),
	subject: z.string().min(1),
	body: z.string().min(1).describe('The HTML body, up to 8 MB.'),
	list_id: ListIdSchema,
	tag: z.string().optional().describe('A tag to attach to the message.'),
	lang: z.string().optional().describe('The message language, such as en.'),
});

export type MessagesCreateEmailInput = z.infer<
	typeof MessagesCreateEmailInputSchema
>;

const MessagesCreateEmailResponseSchema = resultOf(
	z.object({ message_id: z.number().nullish() }).loose(),
);

export type MessagesCreateEmailResponse = z.infer<
	typeof MessagesCreateEmailResponseSchema
>;

const CampaignsCreateInputSchema = z.object({
	message_id: z
		.number()
		.int()
		.describe('The message from messages.createEmail.'),
	start_time: z
		.string()
		.optional()
		.describe(
			'YYYY-MM-DD hh:mm:ss in the given timezone. Omit it to start immediately.',
		),
	timezone: z.string().optional().describe('The timezone start_time is in.'),
	track_read: z.union([z.literal(0), z.literal(1)]).optional(),
	track_links: z.union([z.literal(0), z.literal(1)]).optional(),
	contacts: z
		.string()
		.optional()
		.describe(
			"A comma-separated address list, as an alternative to the message's list.",
		),
	track_ga: z.union([z.literal(0), z.literal(1)]).optional(),
});

export type CampaignsCreateInput = z.infer<typeof CampaignsCreateInputSchema>;

const CampaignsCreateResponseSchema = resultOf(
	z
		.object({
			campaign_id: z.number().nullish(),
			status: z.string().nullish(),
		})
		.loose(),
);

export type CampaignsCreateResponse = z.infer<
	typeof CampaignsCreateResponseSchema
>;

const CampaignsListInputSchema = z.object({
	from: z
		.string()
		.min(1)
		.describe('YYYY-MM-DD hh:mm:ss in UTC; the earliest start to include.'),
	to: z
		.string()
		.optional()
		.describe('YYYY-MM-DD hh:mm:ss in UTC; the latest start to include.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(10_000)
		.optional()
		.describe('At most 10,000 a call.'),
	offset: z
		.number()
		.int()
		.min(0)
		.optional()
		.describe('Zero-based position of the first record.'),
});

export type CampaignsListInput = z.infer<typeof CampaignsListInputSchema>;

const CampaignSchema = z
	.object({
		id: z.number().nullish(),
		start_time: z.string().nullish(),
		status: z.string().nullish(),
		subject: z.string().nullish(),
		sender_name: z.string().nullish(),
		sender_email: z.string().nullish(),
		message_id: z.number().nullish(),
		lists: z.array(z.union([z.number(), z.string()])).nullish(),
	})
	.loose();

export type UnisenderCampaign = z.infer<typeof CampaignSchema>;

const CampaignsListResponseSchema = resultOf(z.array(CampaignSchema));

export type CampaignsListResponse = z.infer<typeof CampaignsListResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type UnisenderEndpointInputs = {
	listsList: z.infer<typeof ListsListInputSchema>;
	listsCreate: ListsCreateInput;
	listsDelete: ListsDeleteInput;
	contactsGet: ContactsGetInput;
	contactsSubscribe: ContactsSubscribeInput;
	contactsUnsubscribe: ContactsUnsubscribeInput;
	contactsExclude: ContactsExcludeInput;
	contactsImport: ContactsImportInput;
	contactsCount: ContactsCountInput;
	contactsExport: ContactsExportInput;
	fieldsList: z.infer<typeof FieldsListInputSchema>;
	fieldsCreate: FieldsCreateInput;
	fieldsDelete: FieldsDeleteInput;
	tagsList: z.infer<typeof TagsListInputSchema>;
	messagesSendEmail: MessagesSendEmailInput;
	messagesStatus: MessagesStatusInput;
	messagesCreateEmail: MessagesCreateEmailInput;
	campaignsCreate: CampaignsCreateInput;
	campaignsList: CampaignsListInput;
};

export type UnisenderEndpointOutputs = {
	listsList: ListsListResponse;
	listsCreate: ListsCreateResponse;
	listsDelete: ListsDeleteResponse;
	contactsGet: ContactsGetResponse;
	contactsSubscribe: ContactsSubscribeResponse;
	contactsUnsubscribe: ContactsUnsubscribeResponse;
	contactsExclude: ContactsExcludeResponse;
	contactsImport: ContactsImportResponse;
	contactsCount: ContactsCountResponse;
	contactsExport: ContactsExportResponse;
	fieldsList: FieldsListResponse;
	fieldsCreate: FieldsCreateResponse;
	fieldsDelete: FieldsDeleteResponse;
	tagsList: TagsListResponse;
	messagesSendEmail: MessagesSendEmailResponse;
	messagesStatus: MessagesStatusResponse;
	messagesCreateEmail: MessagesCreateEmailResponse;
	campaignsCreate: CampaignsCreateResponse;
	campaignsList: CampaignsListResponse;
};

export const UnisenderEndpointInputSchemas = {
	listsList: ListsListInputSchema,
	listsCreate: ListsCreateInputSchema,
	listsDelete: ListsDeleteInputSchema,
	contactsGet: ContactsGetInputSchema,
	contactsSubscribe: ContactsSubscribeInputSchema,
	contactsUnsubscribe: ContactsUnsubscribeInputSchema,
	contactsExclude: ContactsExcludeInputSchema,
	contactsImport: ContactsImportInputSchema,
	contactsCount: ContactsCountInputSchema,
	contactsExport: ContactsExportInputSchema,
	fieldsList: FieldsListInputSchema,
	fieldsCreate: FieldsCreateInputSchema,
	fieldsDelete: FieldsDeleteInputSchema,
	tagsList: TagsListInputSchema,
	messagesSendEmail: MessagesSendEmailInputSchema,
	messagesStatus: MessagesStatusInputSchema,
	messagesCreateEmail: MessagesCreateEmailInputSchema,
	campaignsCreate: CampaignsCreateInputSchema,
	campaignsList: CampaignsListInputSchema,
} as const;

export const UnisenderEndpointOutputSchemas = {
	listsList: ListsListResponseSchema,
	listsCreate: ListsCreateResponseSchema,
	listsDelete: ListsDeleteResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsSubscribe: ContactsSubscribeResponseSchema,
	contactsUnsubscribe: ContactsUnsubscribeResponseSchema,
	contactsExclude: ContactsExcludeResponseSchema,
	contactsImport: ContactsImportResponseSchema,
	contactsCount: ContactsCountResponseSchema,
	contactsExport: ContactsExportResponseSchema,
	fieldsList: FieldsListResponseSchema,
	fieldsCreate: FieldsCreateResponseSchema,
	fieldsDelete: FieldsDeleteResponseSchema,
	tagsList: TagsListResponseSchema,
	messagesSendEmail: MessagesSendEmailResponseSchema,
	messagesStatus: MessagesStatusResponseSchema,
	messagesCreateEmail: MessagesCreateEmailResponseSchema,
	campaignsCreate: CampaignsCreateResponseSchema,
	campaignsList: CampaignsListResponseSchema,
} as const;
