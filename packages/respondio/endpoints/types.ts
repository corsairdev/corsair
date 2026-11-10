import { z } from 'zod';

// Inputs use respond.io's own parameter names. Outputs are `.loose()` and the
// documented optionals nullish, so a field respond.io adds or omits cannot fail a
// call that has already happened. Shapes come from the Stoplight project behind
// https://developers.respond.io/docs/api.
//
// One rule runs through every route: a contact is addressed by an *identifier*
// that carries its kind, `id:123`, `email:a@b.com` or `phone:+60123456789`. The
// plugin accepts an already-prefixed value and otherwise builds it from a kind.

/** ISO 639-1, such as `en`. */
const LanguageSchema = z
	.string()
	.describe('An ISO 639-1 language code, such as en or ms.');

/** ISO 3166-1 alpha-2, such as `US`. */
const CountryCodeSchema = z
	.string()
	.describe('An ISO 3166-1 alpha-2 country code, such as MY or US.');

/**
 * One custom field. The `value` is a string on the wire even for a number, date,
 * time or checkbox, and the docs spell out the format each type needs:
 *
 * - text `"string"`, number `123`, email `"a@b.com"`, URL `"https://…"`
 * - list `"one of the options"`, date `"yyyy-mm-dd"`, time `"HH:MM"` (24h)
 * - checkbox `"true"` or `"false"`
 */
const CustomFieldSchema = z.object({
	name: z
		.string()
		.min(1)
		.describe('The custom field name, as defined in the workspace.'),
	value: z
		.union([z.string(), z.number()])
		.nullish()
		.describe(
			'The value, formatted for the field\'s type. A date is yyyy-mm-dd, a time HH:MM in 24-hour form, and a checkbox "true" or "false".',
		),
});

export type RespondioCustomField = z.infer<typeof CustomFieldSchema>;

/**
 * The fields a contact is created or updated with. `firstName` is required by
 * respond.io on create, which is why it is required here.
 */
const ContactFieldsSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().nullish(),
	phone: z.string().nullish().describe('In E.164 form, such as +60123456789.'),
	email: z.string().nullish(),
	language: LanguageSchema.nullish(),
	profilePic: z.string().nullish(),
	countryCode: CountryCodeSchema.nullish(),
	custom_fields: z.array(CustomFieldSchema).nullish(),
});

const UserSchema = z
	.object({
		id: z.number().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		email: z.string().nullish(),
	})
	.loose();

export type RespondioUser = z.infer<typeof UserSchema>;

/**
 * A contact as every contact route returns it.
 *
 * `status` is the conversation state, not a lookup status: `open`, `closed` or
 * `blocked`. `isBlocked` is a separate flag.
 */
export const ContactSchema = ContactFieldsSchema.extend({
	id: z.number().nullish().describe('The contact ID.'),
	status: z
		.string()
		.nullish()
		.describe('The conversation status: open, closed or blocked.'),
	tags: z.array(z.string()).nullish().describe('Up to 10 tags.'),
	assignee: UserSchema.nullish(),
	lifecycle: z
		.string()
		.nullish()
		.describe('The lifecycle stage name, such as Hot Lead.'),
	created_at: z.number().nullish().describe('Unix timestamp in seconds.'),
	isBlocked: z.boolean().nullish(),
}).loose();

export type RespondioContact = z.infer<typeof ContactSchema>;

// ── contacts ──────────────────────────────────────────────────────────────

const ContactGetInputSchema = z.object({
	identifier: z
		.string()
		.min(1)
		.describe(
			'id:123, email:a@b.com or phone:+60123456789. A bare value is treated as an ID.',
		),
});

export type ContactGetInput = z.infer<typeof ContactGetInputSchema>;

const ContactGetResponseSchema = ContactSchema;

export type ContactGetResponse = z.infer<typeof ContactGetResponseSchema>;

const ContactCreateInputSchema = ContactFieldsSchema.extend({
	identifier: z
		.string()
		.min(1)
		.describe('The contact to create, such as id:123 or phone:+60123456789.'),
});

export type ContactCreateInput = z.infer<typeof ContactCreateInputSchema>;

/**
 * The create, update, delete and tag routes answer a `code` and a `message` rather
 * than the contact, which is worth knowing: a caller who wants the record back
 * must read it separately.
 */
const AckSchema = z
	.object({
		code: z.string().nullish().describe('A string, unlike the error code.'),
		message: z.string().nullish(),
	})
	.loose();

export type RespondioAck = z.infer<typeof AckSchema>;

const ContactCreateResponseSchema = AckSchema;

export type ContactCreateResponse = z.infer<typeof ContactCreateResponseSchema>;

const ContactUpdateInputSchema = z.object({
	identifier: z.string().min(1),
	firstName: z.string().min(1).optional(),
	lastName: z.string().nullish(),
	phone: z.string().nullish(),
	email: z.string().nullish(),
	language: LanguageSchema.nullish(),
	profilePic: z.string().nullish(),
	countryCode: CountryCodeSchema.nullish(),
	custom_fields: z.array(CustomFieldSchema).nullish(),
});

export type ContactUpdateInput = z.infer<typeof ContactUpdateInputSchema>;

const ContactUpdateResponseSchema = AckSchema;

export type ContactUpdateResponse = z.infer<typeof ContactUpdateResponseSchema>;

const ContactDeleteInputSchema = z.object({
	identifier: z.string().min(1),
});

export type ContactDeleteInput = z.infer<typeof ContactDeleteInputSchema>;

const ContactDeleteResponseSchema = AckSchema;

export type ContactDeleteResponse = z.infer<typeof ContactDeleteResponseSchema>;

/**
 * Create or update in one call. respond.io matches on the identifier, so this is
 * the safe upsert when you do not know whether the contact exists.
 */
const ContactUpsertInputSchema = ContactFieldsSchema.extend({
	identifier: z.string().min(1),
});

export type ContactUpsertInput = z.infer<typeof ContactUpsertInputSchema>;

const ContactUpsertResponseSchema = AckSchema;

export type ContactUpsertResponse = z.infer<typeof ContactUpsertResponseSchema>;

const ContactMergeInputSchema = z.object({
	identifier: z
		.string()
		.min(1)
		.describe('The contact that survives the merge.'),
	mergeWith: z
		.string()
		.min(1)
		.describe('The contact merged into the first one and then removed.'),
});

export type ContactMergeInput = z.infer<typeof ContactMergeInputSchema>;

const ContactMergeResponseSchema = AckSchema;

export type ContactMergeResponse = z.infer<typeof ContactMergeResponseSchema>;

/** One condition in a contact filter. */
const FilterConditionSchema = z.object({
	category: z
		.enum(['contactField', 'contactTag', 'lifecycle'])
		.describe('What the condition compares.'),
	field: z.string().min(1).describe('The field, tag or lifecycle name.'),
	operator: z.enum([
		'isEqualTo',
		'isNotEqualTo',
		'isTimestampAfter',
		'isTimestampBefore',
		'isTimestampBetween',
		'exists',
		'doesNotExist',
		'isGreaterThan',
		'isLessThan',
		'isBetween',
		'hasAnyOf',
		'hasAllOf',
		'hasNoneOf',
	]),
	value: z
		.union([
			z.string(),
			z.array(z.string()),
			z.object({ from: z.string(), to: z.string() }),
		])
		.optional()
		.describe(
			'A string, a list of strings for the has* operators, or {from,to} for a between operator. Omitted for exists and doesNotExist.',
		),
});

const ContactListInputSchema = z
	.object({
		filter: z
			.object({
				$and: z.array(FilterConditionSchema).optional(),
				$or: z.array(FilterConditionSchema).optional(),
			})
			.refine(
				(value) => (value.$and === undefined) !== (value.$or === undefined),
				'Give either $and or $or, not both and not neither.',
			)
			.optional()
			.describe('Every condition in $and must hold; any one in $or must.'),
		search: z
			.string()
			.optional()
			.describe('A free-text search across the contacts.'),
		timezone: z
			.string()
			.optional()
			.describe(
				'An IANA timezone used to interpret any timestamp condition, such as Asia/Kuala_Lumpur.',
			),
		limit: z.number().int().min(1).max(100).optional().describe('Page size.'),
		cursorId: z
			.string()
			.optional()
			.describe('The cursor for the next page, from the previous answer.'),
	})
	.refine((value) => value.filter !== undefined || value.search !== undefined, {
		message:
			'Give a filter or a search; respond.io rejects a list request with neither.',
	});

export type ContactListInput = z.infer<typeof ContactListInputSchema>;

/**
 * A JSON value. Used for a listed message or comment, whose body shape follows its
 * `type` and which is described as JSON rather than `unknown`, since `unknown`
 * would reach the docs as `any`.
 */
export type RespondioJsonValue =
	| string
	| number
	| boolean
	| null
	| RespondioJsonValue[]
	| { [key: string]: RespondioJsonValue };

const JsonValueSchema: z.ZodType<RespondioJsonValue> = z.lazy(() =>
	z.union([
		z.string(),
		z.number(),
		z.boolean(),
		z.null(),
		z.array(JsonValueSchema),
		z.record(z.string(), JsonValueSchema),
	]),
);

const JsonObjectSchema = z.record(z.string(), JsonValueSchema);

const PaginationSchema = z
	.object({
		next: z
			.string()
			.nullish()
			.describe('The cursor for the next page, or null.'),
		previous: z.string().nullish(),
	})
	.loose();

const ContactListResponseSchema = z
	.object({
		items: z.array(ContactSchema).nullish(),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type ContactListResponse = z.infer<typeof ContactListResponseSchema>;

const ContactTagsInputSchema = z.object({
	identifier: z.string().min(1),
	tags: z
		.array(z.string().min(1))
		.min(1)
		.describe('The tags to add or remove.'),
});

export type ContactTagsInput = z.infer<typeof ContactTagsInputSchema>;

const ContactTagsResponseSchema = AckSchema;

export type ContactTagsResponse = z.infer<typeof ContactTagsResponseSchema>;

const ContactChannelsInputSchema = z.object({
	identifier: z.string().min(1),
});

export type ContactChannelsInput = z.infer<typeof ContactChannelsInputSchema>;

const ContactChannelSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		source: z.string().nullish(),
		status: z.string().nullish(),
	})
	.loose();

const ContactChannelsResponseSchema = z
	.object({
		items: z.array(ContactChannelSchema).nullish(),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type ContactChannelsResponse = z.infer<
	typeof ContactChannelsResponseSchema
>;

const ContactLifecycleInputSchema = z.object({
	identifier: z.string().min(1),
	lifecycle: z
		.string()
		.min(1)
		.describe('The lifecycle stage to move the contact to.'),
});

export type ContactLifecycleInput = z.infer<typeof ContactLifecycleInputSchema>;

const ContactLifecycleResponseSchema = AckSchema;

export type ContactLifecycleResponse = z.infer<
	typeof ContactLifecycleResponseSchema
>;

// ── conversations ─────────────────────────────────────────────────────────

const ConversationAssignInputSchema = z.object({
	identifier: z.string().min(1),
	assignee: z
		.string()
		.nullish()
		.describe(
			'A user ID or email. Leave it out or send null to unassign the contact.',
		),
});

export type ConversationAssignInput = z.infer<
	typeof ConversationAssignInputSchema
>;

const ContactIdResponseSchema = z
	.object({
		contactId: z.number().nullish(),
	})
	.loose();

export type RespondioContactIdResponse = z.infer<
	typeof ContactIdResponseSchema
>;

const ConversationAssignResponseSchema = ContactIdResponseSchema;

export type ConversationAssignResponse = z.infer<
	typeof ConversationAssignResponseSchema
>;

const ConversationStatusInputSchema = z.object({
	identifier: z.string().min(1),
	status: z.enum(['open', 'close']).describe('The conversation status to set.'),
	category: z
		.string()
		.optional()
		.describe(
			'The closing note name. Only meaningful when closing. Up to 128 characters.',
		),
	summary: z
		.string()
		.optional()
		.describe('A closing summary. Only used when a category is given.'),
});

export type ConversationStatusInput = z.infer<
	typeof ConversationStatusInputSchema
>;

const ConversationStatusResponseSchema = ContactIdResponseSchema;

export type ConversationStatusResponse = z.infer<
	typeof ConversationStatusResponseSchema
>;

// ── messaging ─────────────────────────────────────────────────────────────

/** A plain text message. */
const TextMessageSchema = z.object({
	type: z.literal('text'),
	text: z.string().min(1),
	messageTag: z
		.string()
		.optional()
		.describe(
			'Required when the channel is Facebook or Instagram and the message is outside the 24-hour window: ACCOUNT_UPDATE, POST_PURCHASE_UPDATE or CONFIRMED_EVENT_UPDATE.',
		),
});

/**
 * The documented message kinds. Only `text` is modelled in full; the others are
 * kept loose because each has its own shape and respond.io validates it against
 * the channel's capabilities. `text` is the one that works on every channel.
 */
const MessageSchema = z
	.object({
		type: z
			.enum([
				'text',
				'attachment',
				'customPayload',
				'quickReply',
				'whatsAppTemplate',
				'email',
				'facebookTemplate',
			])
			.describe(
				'text works on every channel; the others need a matching channel, and a customPayload also needs channelId.',
			),
		text: z.string().nullish().describe('The body, for type text.'),
		messageTag: z.string().nullish(),
	})
	.loose();

const MessageSendInputSchema = z.object({
	identifier: z.string().min(1),
	channelId: z
		.number()
		.int()
		.nullish()
		.describe(
			'The channel to send on. Omit it to use the last channel the contact interacted on; a customPayload message requires it.',
		),
	message: MessageSchema,
});

export type MessageSendInput = z.infer<typeof MessageSendInputSchema>;

const MessageSendResponseSchema = z
	.object({
		messageId: z
			.number()
			.describe('The new message id, for tracking it later.'),
	})
	.loose();

export type MessageSendResponse = z.infer<typeof MessageSendResponseSchema>;

const MessageGetInputSchema = z.object({
	identifier: z.string().min(1),
	messageId: z.number().int().describe('The message id.'),
});

export type MessageGetInput = z.infer<typeof MessageGetInputSchema>;

const MessageStatusSchema = z
	.object({
		status: z.string().nullish().describe('Such as delivered, read or failed.'),
		timestamp: z.number().nullish(),
	})
	.loose();

/** One message as read back. */
const MessageResultSchema = z
	.object({
		messageId: z.number().nullish(),
		channelMessageId: z
			.union([z.string(), z.number()])
			.nullish()
			.describe("The channel's own id: a string on some, a number on others."),
		contactId: z.number().nullish(),
		channelId: z.number().nullish(),
		traffic: z.string().nullish().describe('incoming or outgoing.'),
		message: z
			.object({ type: z.string().nullish() })
			.loose()
			.nullish()
			.describe('The message body, whose shape follows its type.'),
		status: z.array(MessageStatusSchema).nullish(),
		sender: z
			.object({ type: z.string().nullish() })
			.loose()
			.nullish()
			.describe(
				'Who sent it: a user, AI Agent, broadcast, workflow, API or echo.',
			),
	})
	.loose();

export type RespondioMessage = z.infer<typeof MessageResultSchema>;

const MessageGetResponseSchema = MessageResultSchema;

export type MessageGetResponse = z.infer<typeof MessageGetResponseSchema>;

const MessageListInputSchema = z.object({
	identifier: z.string().min(1),
	cursorId: z
		.string()
		.optional()
		.describe(
			'Where the next batch starts, from the previous pagination.next.',
		),
	includeComments: z
		.boolean()
		.optional()
		.describe(
			"True mixes the contact's comments into the list, each item then carrying a type of message or comment. A page can be empty while pagination.next is still set, so keep paging until next is null.",
		),
	limit: z
		.number()
		.int()
		.min(1)
		.max(50)
		.optional()
		.describe('Page size, at most 50.'),
});

export type MessageListInput = z.infer<typeof MessageListInputSchema>;

const MessageListResponseSchema = z
	.object({
		items: z
			.array(JsonObjectSchema)
			.nullish()
			.describe(
				'A message or, with includeComments, a comment. Each carries `type` only when includeComments was true.',
			),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type MessageListResponse = z.infer<typeof MessageListResponseSchema>;

// ── space ─────────────────────────────────────────────────────────────────

const SpaceListUsersInputSchema = z.object({
	limit: z.number().int().min(1).optional(),
	cursorId: z.string().optional(),
});

export type SpaceListUsersInput = z.infer<typeof SpaceListUsersInputSchema>;

const SpaceUsersResponseSchema = z
	.object({
		items: z.array(UserSchema).nullish(),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type SpaceUsersResponse = z.infer<typeof SpaceUsersResponseSchema>;

const SpaceGetUserInputSchema = z.object({
	id: z.number().int().describe('The user ID.'),
});

export type SpaceGetUserInput = z.infer<typeof SpaceGetUserInputSchema>;

const SpaceGetUserResponseSchema = UserSchema;

export type SpaceGetUserResponse = z.infer<typeof SpaceGetUserResponseSchema>;

const SpaceChannelsInputSchema = z.object({
	limit: z.number().int().min(1).optional(),
	cursorId: z.string().optional(),
});

export type SpaceChannelsInput = z.infer<typeof SpaceChannelsInputSchema>;

const SpaceChannelDetailSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		source: z.string().nullish().describe('Such as whatsapp or facebook.'),
		status: z.string().nullish(),
		created_at: z.number().nullish(),
	})
	.loose();

const SpaceChannelsResponseSchema = z
	.object({
		items: z.array(SpaceChannelDetailSchema).nullish(),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type SpaceChannelsResponse = z.infer<typeof SpaceChannelsResponseSchema>;

const SpaceTemplatesInputSchema = z.object({
	channelId: z.number().int().describe('The channel whose templates to list.'),
});

export type SpaceTemplatesInput = z.infer<typeof SpaceTemplatesInputSchema>;

export type SpaceClosingNotesInput = z.infer<
	typeof SpaceClosingNotesInputSchema
>;

export type SpaceCustomFieldsInput = z.infer<
	typeof SpaceCustomFieldsInputSchema
>;

const MessageTemplateSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		language: z.string().nullish(),
		status: z.string().nullish(),
		category: z.string().nullish(),
	})
	.loose();

const SpaceTemplatesResponseSchema = z
	.object({
		items: z.array(MessageTemplateSchema).nullish(),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type SpaceTemplatesResponse = z.infer<
	typeof SpaceTemplatesResponseSchema
>;

const SpaceClosingNotesInputSchema = z.object({});

const ClosingNoteSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		category: z.string().nullish(),
	})
	.loose();

const SpaceClosingNotesResponseSchema = z
	.object({
		items: z.array(ClosingNoteSchema).nullish(),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type SpaceClosingNotesResponse = z.infer<
	typeof SpaceClosingNotesResponseSchema
>;

const SpaceCustomFieldsInputSchema = z.object({});

const CustomFieldDefinitionSchema = z
	.object({
		id: z.number().nullish(),
		name: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe('text, number, email, url, list, date, time or checkbox.'),
		options: z.array(z.string()).nullish().describe('For a list field.'),
	})
	.loose();

const SpaceCustomFieldsResponseSchema = z
	.object({
		items: z.array(CustomFieldDefinitionSchema).nullish(),
		pagination: PaginationSchema.nullish(),
	})
	.loose();

export type SpaceCustomFieldsResponse = z.infer<
	typeof SpaceCustomFieldsResponseSchema
>;

// ── comment ───────────────────────────────────────────────────────────────

const CommentCreateInputSchema = z.object({
	identifier: z.string().min(1),
	text: z
		.string()
		.min(1)
		.describe('Up to 1000 characters. Mention a user with {{@user.ID}}.'),
});

export type CommentCreateInput = z.infer<typeof CommentCreateInputSchema>;

const CommentCreateResponseSchema = z
	.object({
		contactId: z.number().nullish(),
		text: z.string().nullish(),
		created_at: z.number().nullish().describe('Unix timestamp in seconds.'),
	})
	.loose();

export type CommentCreateResponse = z.infer<typeof CommentCreateResponseSchema>;

// ── the maps ──────────────────────────────────────────────────────────────

export type RespondioEndpointInputs = {
	contactGet: ContactGetInput;
	contactCreate: ContactCreateInput;
	contactUpdate: ContactUpdateInput;
	contactDelete: ContactDeleteInput;
	contactUpsert: ContactUpsertInput;
	contactMerge: ContactMergeInput;
	contactList: ContactListInput;
	contactAddTags: ContactTagsInput;
	contactDeleteTags: ContactTagsInput;
	contactChannels: ContactChannelsInput;
	contactLifecycle: ContactLifecycleInput;
	conversationAssign: ConversationAssignInput;
	conversationStatus: ConversationStatusInput;
	messageSend: MessageSendInput;
	messageGet: MessageGetInput;
	messageList: MessageListInput;
	spaceListUsers: SpaceListUsersInput;
	spaceGetUser: SpaceGetUserInput;
	spaceChannels: SpaceChannelsInput;
	spaceTemplates: SpaceTemplatesInput;
	spaceClosingNotes: SpaceClosingNotesInput;
	spaceCustomFields: SpaceCustomFieldsInput;
	commentCreate: CommentCreateInput;
};

export type RespondioEndpointOutputs = {
	contactGet: ContactGetResponse;
	contactCreate: ContactCreateResponse;
	contactUpdate: ContactUpdateResponse;
	contactDelete: ContactDeleteResponse;
	contactUpsert: ContactUpsertResponse;
	contactMerge: ContactMergeResponse;
	contactList: ContactListResponse;
	contactAddTags: ContactTagsResponse;
	contactDeleteTags: ContactTagsResponse;
	contactChannels: ContactChannelsResponse;
	contactLifecycle: ContactLifecycleResponse;
	conversationAssign: ConversationAssignResponse;
	conversationStatus: ConversationStatusResponse;
	messageSend: MessageSendResponse;
	messageGet: MessageGetResponse;
	messageList: MessageListResponse;
	spaceListUsers: SpaceUsersResponse;
	spaceGetUser: SpaceGetUserResponse;
	spaceChannels: SpaceChannelsResponse;
	spaceTemplates: SpaceTemplatesResponse;
	spaceClosingNotes: SpaceClosingNotesResponse;
	spaceCustomFields: SpaceCustomFieldsResponse;
	commentCreate: CommentCreateResponse;
};

export const RespondioEndpointInputSchemas = {
	contactGet: ContactGetInputSchema,
	contactCreate: ContactCreateInputSchema,
	contactUpdate: ContactUpdateInputSchema,
	contactDelete: ContactDeleteInputSchema,
	contactUpsert: ContactUpsertInputSchema,
	contactMerge: ContactMergeInputSchema,
	contactList: ContactListInputSchema,
	contactAddTags: ContactTagsInputSchema,
	contactDeleteTags: ContactTagsInputSchema,
	contactChannels: ContactChannelsInputSchema,
	contactLifecycle: ContactLifecycleInputSchema,
	conversationAssign: ConversationAssignInputSchema,
	conversationStatus: ConversationStatusInputSchema,
	messageSend: MessageSendInputSchema,
	messageGet: MessageGetInputSchema,
	messageList: MessageListInputSchema,
	spaceListUsers: SpaceListUsersInputSchema,
	spaceGetUser: SpaceGetUserInputSchema,
	spaceChannels: SpaceChannelsInputSchema,
	spaceTemplates: SpaceTemplatesInputSchema,
	spaceClosingNotes: SpaceClosingNotesInputSchema,
	spaceCustomFields: SpaceCustomFieldsInputSchema,
	commentCreate: CommentCreateInputSchema,
} as const;

export const RespondioEndpointOutputSchemas = {
	contactGet: ContactGetResponseSchema,
	contactCreate: ContactCreateResponseSchema,
	contactUpdate: ContactUpdateResponseSchema,
	contactDelete: ContactDeleteResponseSchema,
	contactUpsert: ContactUpsertResponseSchema,
	contactMerge: ContactMergeResponseSchema,
	contactList: ContactListResponseSchema,
	contactAddTags: ContactTagsResponseSchema,
	contactDeleteTags: ContactTagsResponseSchema,
	contactChannels: ContactChannelsResponseSchema,
	contactLifecycle: ContactLifecycleResponseSchema,
	conversationAssign: ConversationAssignResponseSchema,
	conversationStatus: ConversationStatusResponseSchema,
	messageSend: MessageSendResponseSchema,
	messageGet: MessageGetResponseSchema,
	messageList: MessageListResponseSchema,
	spaceListUsers: SpaceUsersResponseSchema,
	spaceGetUser: SpaceGetUserResponseSchema,
	spaceChannels: SpaceChannelsResponseSchema,
	spaceTemplates: SpaceTemplatesResponseSchema,
	spaceClosingNotes: SpaceClosingNotesResponseSchema,
	spaceCustomFields: SpaceCustomFieldsResponseSchema,
	commentCreate: CommentCreateResponseSchema,
} as const;
