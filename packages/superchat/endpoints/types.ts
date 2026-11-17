import { z } from 'zod';

/**
 * Superchat's own names are used throughout. Outputs are `.loose()` and their
 * optional fields `.nullish()` so a field Superchat adds or omits cannot fail a
 * read that already succeeded.
 *
 * A single record answers the record itself, and a list answers
 * `{ url, results, pagination }`, where the pagination carries cursors. Both are
 * modelled here, not wrapped.
 *
 * Contract: https://developers.superchat.com/reference/welcome
 */

// ── Shared pieces ─────────────────────────────────────────────────────────

const Timestamp = z.string().describe('ISO 8601.');

// The last value is Superchat's own spelling for "not given".
const ContactGenderSchema = z.enum([
	'male',
	'female',
	'diverse',
	'unknown', // unknown: a provider enum value, not an open type
]);

/**
 * Superchat pages with cursors: `after` takes the last id of the previous page,
 * and `limit` is 1 to 100, defaulting to 50. Only one of `after` and `before`
 * may be set at a time, which the schema enforces.
 */
const paging = {
	after: z
		.string()
		.optional()
		.describe('Cursor: the id to read records after.'),
	before: z
		.string()
		.optional()
		.describe('Cursor: the id to read records before.'),
	limit: z
		.number()
		.int()
		.min(1)
		.max(100)
		.optional()
		.describe('Objects per page, 1 to 100. Defaults to 50.'),
};

const PaginationSchema = z
	.object({
		next_cursor: z.string().nullish(),
		previous_cursor: z.string().nullish(),
		next_url: z.string().nullish(),
		previous_url: z.string().nullish(),
	})
	.loose();

export type SuperchatPagination = z.infer<typeof PaginationSchema>;

/** The envelope every list route answers. */
function pageOf<T extends z.ZodType>(item: T) {
	return z
		.object({
			url: z.string().nullish(),
			results: z.array(item),
			pagination: PaginationSchema,
		})
		.loose();
}

function requireOneCursor<T extends { after?: string; before?: string }>(
	value: T,
	ctx: z.RefinementCtx,
): void {
	// Superchat rejects a request that sets both cursors, so this fails before
	// spending one of the workspace's 2500 five-minute calls.
	if (value.after !== undefined && value.before !== undefined) {
		ctx.addIssue({
			code: 'custom',
			path: ['before'],
			message: 'Send after or before, not both.',
		});
	}
}

// ── Record schemas ────────────────────────────────────────────────────────

const ContactHandleSchema = z
	.object({
		id: z.string().nullish(),
		type: z.enum(['mail', 'phone']).nullish(),
		value: z.string().nullish(),
	})
	.loose();

/** A contact's custom attribute value, discriminated by `type`. */
const ContactAttributeSchema = z
	.object({
		identifier: z.string().nullish(),
		type: z.string().nullish(),
		value: z.unknown().nullish(), // unknown: text, number or a list per type
		attribute_id: z.string().nullish(),
	})
	.loose();

const ContactSchema = z
	.object({
		id: z.string(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		gender: ContactGenderSchema.nullish(),
		handles: z.array(ContactHandleSchema).nullish(),
		custom_attributes: z.array(ContactAttributeSchema).nullish(),
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
	})
	.loose();

export type SuperchatContact = z.infer<typeof ContactSchema>;

const ContactListSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type SuperchatContactList = z.infer<typeof ContactListSchema>;

/** A list delete, and removing a contact from a list, answer only the list id. */
const DeletedContactListSchema = z.object({ id: z.string() }).loose();

export type DeletedContactList = z.infer<typeof DeletedContactListSchema>;

const ConversationSchema = z
	.object({
		id: z.string(),
		status: z.string().nullish(),
		channel: z
			.object({
				id: z.string().nullish(),
				type: z.string().nullish(),
			})
			.loose()
			.nullish(),
		inbox: z
			.object({ id: z.string().nullish(), name: z.string().nullish() })
			.loose()
			.nullish(),
		labels: z.array(z.unknown()).nullish(), // unknown: label shape
		assigned_users: z.array(z.unknown()).nullish(), // unknown: user shape
		contacts: z.array(z.unknown()).nullish(), // unknown: contact shape
		snoozed_until: Timestamp.nullish(),
		time_window: z
			.object({ start: z.string().nullish(), end: z.string().nullish() })
			.loose()
			.nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type SuperchatConversation = z.infer<typeof ConversationSchema>;

const MessageSchema = z
	.object({
		id: z.string(),
		status: z.string().nullish(),
		conversation_id: z.string().nullish(),
		in_reply_to: z.string().nullish(),
		content: z
			.object({ type: z.string().nullish(), body: z.string().nullish() })
			.loose()
			.nullish(),
		// Outbound messages list their receivers; inbound ones name the
		// receiving channel as one object.
		to: z
			.union([
				z.array(z.unknown()), // unknown: receiver shape varies by channel
				z.object({ channel_id: z.string().nullish() }).loose(),
			])
			.nullish(),
		from: z.unknown().nullish(), // unknown: sender shape
		created_at: Timestamp.nullish(),
		updated_at: Timestamp.nullish(),
		direction: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type SuperchatMessage = z.infer<typeof MessageSchema>;

const ChannelSchema = z
	.object({
		id: z.string().nullish(),
		type: z.string().nullish(),
		name: z.string().nullish(),
		inbox_id: z.string().nullish(),
	})
	.loose();

export type SuperchatChannel = z.infer<typeof ChannelSchema>;

const InboxSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

export type SuperchatInbox = z.infer<typeof InboxSchema>;

// ── contacts ──────────────────────────────────────────────────────────────

const ContactsListInputSchema = z
	.object({ ...paging })
	.superRefine(requireOneCursor);

export type ContactsListInput = z.infer<typeof ContactsListInputSchema>;

const ContactsListResponseSchema = pageOf(ContactSchema);

export type ContactsListResponse = z.infer<typeof ContactsListResponseSchema>;

/**
 * A contact needs at least one handle, and first name, last name and gender are
 * all in the spec's required list even though they accept null. The handles are
 * what identify a contact on a channel, so at least one is enforced here.
 */
const contactHandleBody = z.object({
	id: z
		.string()
		.nullable()
		.describe(
			'Required: an existing handle id, or null to create a new handle.',
		),
	type: z.enum(['mail', 'phone']).describe('How the handle is used.'),
	value: z.string().min(1).describe('The email address or phone number.'),
});

// The create route lists first_name, last_name and gender as required, each
// accepting null, so the keys must be present.
const contactBody = {
	first_name: z
		.string()
		.nullable()
		.describe('Required; the value may be null.'),
	last_name: z.string().nullable().describe('Required; the value may be null.'),
	gender: ContactGenderSchema.nullable().describe(
		'Required; the value may be null.',
	),
	custom_attributes: z.array(ContactAttributeSchema).nullish(),
};

const ContactsCreateInputSchema = z.object({
	...contactBody,
	handles: z.array(contactHandleBody).min(1),
});

export type ContactsCreateInput = z.infer<typeof ContactsCreateInputSchema>;

const ContactTargetSchema = z.object({
	contactId: z
		.string()
		.min(1)
		.describe('The Superchat contact id, as `ct_...`.'),
});

export type ContactTargetInput = z.infer<typeof ContactTargetSchema>;

const ContactsGetResponseSchema = ContactSchema;

export type ContactsGetResponse = z.infer<typeof ContactsGetResponseSchema>;

/**
 * The update body requires first_name, last_name and gender even though the
 * route is a PATCH, so all three are required here and a caller changing one
 * sends the other two back unchanged.
 */
const ContactsUpdateInputSchema = z.object({
	contactId: z.string().min(1),
	// The route lists all three as required, so the key has to be present even
	// when its value is null. `.nullable()` keeps that distinct from optional.
	first_name: z
		.string()
		.nullable()
		.describe('Required by the route; the value may be null.'),
	last_name: z.string().nullable().describe('Required by the route.'),
	gender: ContactGenderSchema.nullable().describe('Required by the route.'),
	handles: z.array(contactHandleBody).nullish(),
	custom_attributes: z.array(ContactAttributeSchema).nullish(),
});

export type ContactsUpdateInput = z.infer<typeof ContactsUpdateInputSchema>;

const ContactsUpdateResponseSchema = ContactSchema;

export type ContactsUpdateResponse = z.infer<
	typeof ContactsUpdateResponseSchema
>;

/** A search takes one or more expressions, all of which have to match. */
const ContactSearchExpressionSchema = z
	.object({
		field: z
			.enum([
				'mail',
				'phone',
				'instagram',
				'whats_app_username',
				'custom_attribute',
			])
			.describe('Which handle or attribute to search.'),
		operator: z.literal('=').describe("Superchat's only operator."),
		value: z.string().describe('The value to match exactly.'),
		identifier: z
			.string()
			.optional()
			.describe(
				'Required when field is custom_attribute: the attribute identifier or a built-in attribute name.',
			),
	})
	.superRefine((value, ctx) => {
		// The spec requires the identifier for a custom_attribute search, and a
		// request without it cannot be resolved.
		if (value.field === 'custom_attribute' && !value.identifier) {
			ctx.addIssue({
				code: 'custom',
				path: ['identifier'],
				message: 'identifier is required when field is custom_attribute.',
			});
		}
	});

const ContactsSearchInputSchema = z
	.object({
		...paging,
		query: z
			.object({ value: z.array(ContactSearchExpressionSchema).min(1) })
			.describe('The expressions to match, sent as the route expects them.'),
	})
	.superRefine(requireOneCursor);

export type ContactsSearchInput = z.infer<typeof ContactsSearchInputSchema>;

const ContactsSearchResponseSchema = pageOf(ContactSchema);

export type ContactsSearchResponse = z.infer<
	typeof ContactsSearchResponseSchema
>;

// ── contactLists ──────────────────────────────────────────────────────────

const ContactListsListInputSchema = z
	.object({ ...paging })
	.superRefine(requireOneCursor);

export type ContactListsListInput = z.infer<typeof ContactListsListInputSchema>;

const ContactListsListResponseSchema = pageOf(ContactListSchema);

export type ContactListsListResponse = z.infer<
	typeof ContactListsListResponseSchema
>;

const ContactListsCreateInputSchema = z.object({
	name: z.string().min(1),
	description: z.string().nullish(),
});

export type ContactListsCreateInput = z.infer<
	typeof ContactListsCreateInputSchema
>;

const ContactListTargetSchema = z.object({
	contactListId: z
		.string()
		.min(1)
		.describe('The contact list id, as `cl_...`.'),
});

export type ContactListTargetInput = z.infer<typeof ContactListTargetSchema>;

/** Adding a contact to a list takes a body of `{ id }`, not a path segment. */
const ContactListMembershipInputSchema = z.object({
	contactId: z.string().min(1),
	contactListId: z.string().min(1),
});

export type ContactListMembershipInput = z.infer<
	typeof ContactListMembershipInputSchema
>;

const ContactListMembershipRemoveInputSchema = ContactListMembershipInputSchema;

export type ContactListMembershipRemoveInput = z.infer<
	typeof ContactListMembershipRemoveInputSchema
>;

const ContactListsForContactInputSchema = z
	.object({ contactId: z.string().min(1), ...paging })
	.superRefine(requireOneCursor);

export type ContactListsForContactInput = z.infer<
	typeof ContactListsForContactInputSchema
>;

const ContactListsForContactResponseSchema = pageOf(ContactListSchema);

export type ContactListsForContactResponse = z.infer<
	typeof ContactListsForContactResponseSchema
>;

// ── conversations ─────────────────────────────────────────────────────────

const ConversationsListInputSchema = z
	.object({ ...paging })
	.superRefine(requireOneCursor);

export type ConversationsListInput = z.infer<
	typeof ConversationsListInputSchema
>;

const ConversationsListResponseSchema = pageOf(ConversationSchema);

export type ConversationsListResponse = z.infer<
	typeof ConversationsListResponseSchema
>;

const ConversationTargetSchema = z.object({
	id: z.string().min(1).describe('The conversation id, as `cv_...`.'),
});

export type ConversationTargetInput = z.infer<typeof ConversationTargetSchema>;

/** Messages page like every list, 20 per page by default. */
const ConversationMessagesInputSchema = z
	.object({ ...ConversationTargetSchema.shape, ...paging })
	.superRefine(requireOneCursor);

export type ConversationMessagesInput = z.infer<
	typeof ConversationMessagesInputSchema
>;

const ConversationsGetResponseSchema = ConversationSchema;

export type ConversationsGetResponse = z.infer<
	typeof ConversationsGetResponseSchema
>;

/**
 * Snoozing needs both a status of `snoozed` and a non-null `snoozed_until`;
 * anything else leaves the field alone. This is enforced here because the API
 * rejects the mismatch after the call.
 */
const ConversationsUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		status: z
			.enum(['open', 'done', 'spam', 'archived', 'snoozed'])
			.nullish()
			.describe('The values the PATCH route accepts.'),
		inbox_id: z.string().nullish(),
		snoozed_until: Timestamp.nullish(),
		assigned_users: z.array(z.string()).nullish(),
		labels: z.array(z.string()).nullish(),
	})
	.superRefine((value, ctx) => {
		if (value.status === 'snoozed' && !value.snoozed_until) {
			ctx.addIssue({
				code: 'custom',
				path: ['snoozed_until'],
				message:
					'Snoozing needs a snoozed_until timestamp; omit status or set a time.',
			});
		}
	});

export type ConversationsUpdateInput = z.infer<
	typeof ConversationsUpdateInputSchema
>;

const ConversationsUpdateResponseSchema = ConversationSchema;

export type ConversationsUpdateResponse = z.infer<
	typeof ConversationsUpdateResponseSchema
>;

const ConversationMessagesResponseSchema = pageOf(MessageSchema);

export type ConversationMessagesResponse = z.infer<
	typeof ConversationMessagesResponseSchema
>;

// ── messages ──────────────────────────────────────────────────────────────

/**
 * The send body names its channel (`from`) and its recipients (`to`, exactly
 * one), and the content is discriminated by `type`. Text is the one shape this
 * plugin types; the media, email and template shapes are provider-specific and
 * are not guessed at.
 */
const MessagesSendInputSchema = z.object({
	to: z
		.array(z.object({ identifier: z.string().min(1) }))
		.length(1)
		.describe(
			'The recipient: one entry, whose identifier is the handle on the target channel.',
		),
	from: z.object({
		channel_id: z
			.string()
			.min(1)
			.describe('The channel messages are sent from.'),
		name: z
			.string()
			.nullish()
			.describe('The display name shown as the sender.'),
	}),
	content: z
		.object({
			type: z.literal('text'),
			body: z.string().min(1).describe('The message text.'),
		})
		.describe(
			'A text message. The media, email and template content shapes are not typed by this plugin.',
		),
});

export type MessagesSendInput = z.infer<typeof MessagesSendInputSchema>;

const MessagesSendResponseSchema = MessageSchema;

export type MessagesSendResponse = z.infer<typeof MessagesSendResponseSchema>;

const MessageTargetSchema = z.object({
	id: z.string().min(1).describe('The message id, as `mc_...` or `me_...`.'),
});

export type MessageTargetInput = z.infer<typeof MessageTargetSchema>;

const MessagesGetResponseSchema = MessageSchema;

export type MessagesGetResponse = z.infer<typeof MessagesGetResponseSchema>;

// ── channels and inboxes ──────────────────────────────────────────────────

const ChannelsListInputSchema = z
	.object({
		...paging,
		inbox_id: z.string().optional().describe('Only channels in this inbox.'),
	})
	.superRefine(requireOneCursor);

export type ChannelsListInput = z.infer<typeof ChannelsListInputSchema>;

const ChannelsListResponseSchema = pageOf(ChannelSchema);

export type ChannelsListResponse = z.infer<typeof ChannelsListResponseSchema>;

const ChannelTargetSchema = z.object({
	channelId: z.string().min(1).describe('The channel id, as `mc_...`.'),
});

export type ChannelTargetInput = z.infer<typeof ChannelTargetSchema>;

const ChannelsGetResponseSchema = ChannelSchema;

export type ChannelsGetResponse = z.infer<typeof ChannelsGetResponseSchema>;

const InboxesListInputSchema = z
	.object({ ...paging })
	.superRefine(requireOneCursor);

export type InboxesListInput = z.infer<typeof InboxesListInputSchema>;

const InboxesListResponseSchema = pageOf(InboxSchema);

export type InboxesListResponse = z.infer<typeof InboxesListResponseSchema>;

const InboxTargetSchema = z.object({
	inboxId: z.string().min(1),
});

export type InboxTargetInput = z.infer<typeof InboxTargetSchema>;

const InboxesGetResponseSchema = InboxSchema;

export type InboxesGetResponse = z.infer<typeof InboxesGetResponseSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type SuperchatEndpointInputs = {
	contactsList: ContactsListInput;
	contactsGet: ContactTargetInput;
	contactsCreate: ContactsCreateInput;
	contactsUpdate: ContactsUpdateInput;
	contactsSearch: ContactsSearchInput;
	contactsDelete: ContactTargetInput;
	contactListsList: ContactListsListInput;
	contactListsCreate: ContactListsCreateInput;
	contactListsDelete: ContactListTargetInput;
	contactListsForContact: ContactListsForContactInput;
	contactListsAddContact: ContactListMembershipInput;
	contactListsRemoveContact: ContactListMembershipRemoveInput;
	conversationsList: ConversationsListInput;
	conversationsGet: ConversationTargetInput;
	conversationsUpdate: ConversationsUpdateInput;
	conversationsMessages: ConversationMessagesInput;
	messagesSend: MessagesSendInput;
	messagesGet: MessageTargetInput;
	channelsList: ChannelsListInput;
	channelsGet: ChannelTargetInput;
	inboxesList: InboxesListInput;
	inboxesGet: InboxTargetInput;
};

export type SuperchatEndpointOutputs = {
	contactsList: ContactsListResponse;
	contactsGet: ContactsGetResponse;
	contactsCreate: ContactsGetResponse;
	contactsUpdate: ContactsUpdateResponse;
	contactsSearch: ContactsSearchResponse;
	contactListsList: ContactListsListResponse;
	contactListsCreate: SuperchatContactList;
	contactListsDelete: DeletedContactList;
	contactListsForContact: ContactListsForContactResponse;
	contactListsAddContact: SuperchatContactList;
	contactListsRemoveContact: DeletedContactList;
	conversationsList: ConversationsListResponse;
	conversationsGet: ConversationsGetResponse;
	conversationsUpdate: ConversationsUpdateResponse;
	conversationsMessages: ConversationMessagesResponse;
	messagesSend: MessagesSendResponse;
	messagesGet: MessagesGetResponse;
	channelsList: ChannelsListResponse;
	channelsGet: ChannelsGetResponse;
	inboxesList: InboxesListResponse;
	inboxesGet: InboxesGetResponse;
	/** A delete answers nothing, so the result records which id was removed. */
	contactsDelete: { id: string; deleted: true };
};

export const SuperchatEndpointInputSchemas = {
	contactsList: ContactsListInputSchema,
	contactsGet: ContactTargetSchema,
	contactsCreate: ContactsCreateInputSchema,
	contactsUpdate: ContactsUpdateInputSchema,
	contactsSearch: ContactsSearchInputSchema,
	contactsDelete: ContactTargetSchema,
	contactListsList: ContactListsListInputSchema,
	contactListsCreate: ContactListsCreateInputSchema,
	contactListsDelete: ContactListTargetSchema,
	contactListsForContact: ContactListsForContactInputSchema,
	contactListsAddContact: ContactListMembershipInputSchema,
	contactListsRemoveContact: ContactListMembershipRemoveInputSchema,
	conversationsList: ConversationsListInputSchema,
	conversationsGet: ConversationTargetSchema,
	conversationsUpdate: ConversationsUpdateInputSchema,
	conversationsMessages: ConversationMessagesInputSchema,
	messagesSend: MessagesSendInputSchema,
	messagesGet: MessageTargetSchema,
	channelsList: ChannelsListInputSchema,
	channelsGet: ChannelTargetSchema,
	inboxesList: InboxesListInputSchema,
	inboxesGet: InboxTargetSchema,
} as const;

const DeletedContactSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export const SuperchatEndpointOutputSchemas = {
	contactsList: ContactsListResponseSchema,
	contactsGet: ContactsGetResponseSchema,
	contactsCreate: ContactsGetResponseSchema,
	contactsUpdate: ContactsUpdateResponseSchema,
	contactsSearch: ContactsSearchResponseSchema,
	contactListsList: ContactListsListResponseSchema,
	contactListsCreate: ContactListSchema,
	contactListsDelete: DeletedContactListSchema,
	contactListsForContact: ContactListsForContactResponseSchema,
	contactListsAddContact: ContactListSchema,
	contactListsRemoveContact: DeletedContactListSchema,
	conversationsList: ConversationsListResponseSchema,
	conversationsGet: ConversationsGetResponseSchema,
	conversationsUpdate: ConversationsUpdateResponseSchema,
	conversationsMessages: ConversationMessagesResponseSchema,
	messagesSend: MessagesSendResponseSchema,
	messagesGet: MessagesGetResponseSchema,
	channelsList: ChannelsListResponseSchema,
	channelsGet: ChannelsGetResponseSchema,
	inboxesList: InboxesListResponseSchema,
	inboxesGet: InboxesGetResponseSchema,
	contactsDelete: DeletedContactSchema,
} as const;
