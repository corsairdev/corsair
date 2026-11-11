import { z } from 'zod';
import {
	FubFlagSchema,
	FubMetadataSchema,
	IdSchema,
	ListQuerySchema,
} from './types';

// The inbox family: inbox apps (conversations, participants, messages, notes,
// installs), team inboxes, reactions and threaded replies. Inputs use Follow
// Up Boss's own parameter names; outputs are `.loose()` and their documented
// fields nullish, so a field FUB adds or omits cannot fail a call that has
// already happened. Field reference: https://docs.followupboss.com/reference
//
// Contract quirks kept verbatim (see also the handlers):
// - Every /inboxApps path parameter is declared as a string, including
//   `inboxAppId`, `extConversationId` and `participantId`; the external ids
//   are provider-defined strings that arrive percent-encoded on the path.
// - DELETE /reactions/{refType}/{refId} carries a request body (the emoji
//   `body` field, mirroring the POST shape) even though the published schema
//   for that body is empty, and `refId` is typed as an integer on POST but a
//   string on DELETE, so both spellings are accepted.
// - `publishedInboxAppId` is an integer in the install request body but the
//   installations path declares it as a string.
// - The conversations addressed through /inboxApps are referenced by the
//   provider's `externalConversationId`, not a FUB numeric id, so the
//   InboxConversationSchema keys on `externalConversationId`.

// ── entities ───────────────────────────────────────────────────────────────

export const REACTION_REF_TYPES = ['Note', 'Call', 'ThreadedReply'] as const;

// POST types `refId` as an integer and DELETE as a string, so both are
// accepted and the path segment is encoded either way.
export const ReactionRefIdSchema = z.union([IdSchema, z.string().min(1)]);

export type FollowUpBossReactionRefId = z.infer<typeof ReactionRefIdSchema>;

export const ReactionSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		createdBy: z.string().nullish(),
		createdById: IdSchema.nullish(),
		refType: z.string().nullish(),
		refId: IdSchema.nullish(),
		// The single-character emoji reaction, e.g. "👍".
		body: z.string().nullish(),
	})
	.loose();

export type FollowUpBossReaction = z.infer<typeof ReactionSchema>;

export const ThreadedReplySchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		createdById: IdSchema.nullish(),
		refType: z.string().nullish(),
		refId: IdSchema.nullish(),
		body: z.string().nullish(),
		reactions: z.union([ReactionSchema, z.array(ReactionSchema)]).nullish(),
	})
	.loose();

export type FollowUpBossThreadedReply = z.infer<typeof ThreadedReplySchema>;

const TeamInboxUserSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
	})
	.loose();

export const TeamInboxSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		users: z.array(TeamInboxUserSchema).nullish(),
	})
	.loose();

export type FollowUpBossTeamInbox = z.infer<typeof TeamInboxSchema>;

const TeamInboxEnvelopeSchema = z
	.object({
		teamInboxes: z.array(TeamInboxSchema),
		_metadata: FubMetadataSchema.nullish(),
	})
	.loose();

export const InboxParticipantSchema = z
	.object({
		id: IdSchema.nullish(),
		status: z.string().nullish(),
		userId: IdSchema.nullish(),
		personId: IdSchema.nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		isAutomation: FubFlagSchema.nullish(),
	})
	.loose();

export type FollowUpBossInboxParticipant = z.infer<
	typeof InboxParticipantSchema
>;

const InboxConversationPersonSchema = z
	.object({
		id: IdSchema.nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
	})
	.loose();

export const InboxConversationSchema = z
	.object({
		externalConversationId: z.string().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		// The conversation resource types these two as strings holding names,
		// unlike the numeric ids on the message and note resources.
		createdById: z.string().nullish(),
		updatedById: z.string().nullish(),
		ownerUserId: z.number().nullish(),
		ownerSharedInboxId: z.number().nullish(),
		assignedUserId: z.number().nullish(),
		assignedSharedInboxId: z.number().nullish(),
		subject: z.string().nullish(),
		archived: FubFlagSchema.nullish(),
		person: InboxConversationPersonSchema.nullish(),
		conversationDeepLinkUrl: z.string().nullish(),
	})
	.loose();

export type FollowUpBossInboxConversation = z.infer<
	typeof InboxConversationSchema
>;

const InboxMessageSenderSchema = z
	.object({
		userId: IdSchema.nullish(),
		personId: IdSchema.nullish(),
		relationshipId: IdSchema.nullish(),
		participantId: IdSchema.nullish(),
		name: z.string().nullish(),
		email: z.string().nullish(),
		phone: z.string().nullish(),
		avatar: z.string().nullish(),
	})
	.loose();

const InboxMessageAttachmentSchema = z
	.object({
		filename: z.string().nullish(),
		url: z.string().nullish(),
	})
	.loose();

export const InboxMessageSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		sentAt: z.string().nullish(),
		deliveryStatus: z.string().nullish(),
		deliveryStatusErrorMessage: z.string().nullish(),
		createdById: IdSchema.nullish(),
		updatedById: IdSchema.nullish(),
		isIncoming: FubFlagSchema.nullish(),
		isSystem: FubFlagSchema.nullish(),
		systemType: z.string().nullish(),
		message: z.string().nullish(),
		userId: z.number().nullish(),
		personId: IdSchema.nullish(),
		sender: InboxMessageSenderSchema.nullish(),
		attachments: z.array(InboxMessageAttachmentSchema).nullish(),
		conversationDeepLinkUrl: z.string().nullish(),
	})
	.loose();

export type FollowUpBossInboxMessage = z.infer<typeof InboxMessageSchema>;

export const InboxNoteSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		createdById: IdSchema.nullish(),
		updatedById: IdSchema.nullish(),
		createdBy: z.string().nullish(),
		updatedBy: z.string().nullish(),
		conversationId: IdSchema.nullish(),
		body: z.string().nullish(),
		isHtml: FubFlagSchema.nullish(),
		type: z.string().nullish(),
		conversationDeepLinkUrl: z.string().nullish(),
	})
	.loose();

export type FollowUpBossInboxNote = z.infer<typeof InboxNoteSchema>;

export const InstalledInboxAppSchema = z
	.object({
		id: IdSchema.nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		createdById: IdSchema.nullish(),
		updatedById: IdSchema.nullish(),
		status: z.number().nullish(),
		name: z.string().nullish(),
		publishedInboxAppId: IdSchema.nullish(),
		userId: z.number().nullish(),
		canReply: FubFlagSchema.nullish(),
	})
	.loose();

export type FollowUpBossInstalledInboxApp = z.infer<
	typeof InstalledInboxAppSchema
>;

// The installations list reports each installed copy of a published app.
const InboxAppInstallationSchema = z
	.object({
		inboxAppId: IdSchema.nullish(),
		userId: z.number().nullish(),
		created: z.string().nullish(),
	})
	.loose();

const InboxAppInstallationsResponseSchema = z
	.object({
		inboxApps: z.array(InboxAppInstallationSchema),
	})
	.loose();

export type FollowUpBossInboxAppInstallationsResponse = z.infer<
	typeof InboxAppInstallationsResponseSchema
>;

// ── request body shapes shared by the inboxApps operations ─────────────────

// unknown: a participant is identified by one FUB id, or by free-form contact
// fields when the participant does not exist in FUB yet; the id fields are
// mutually exclusive per the docs, which only a caller can decide.
export const InboxParticipantBodySchema = z
	.object({
		personId: z.number().int().optional(),
		userId: z.number().int().optional(),
		relationshipId: z.number().int().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
		isAutomation: z.boolean().optional(),
	})
	.loose();

export type InboxParticipantBody = z.infer<typeof InboxParticipantBodySchema>;

// unknown: same one-id-or-free-form rule as the participant above.
export const InboxSenderBodySchema = z
	.object({
		userId: z.number().int().optional(),
		personId: z.number().int().optional(),
		relationshipId: z.number().int().optional(),
		participantId: z.number().int().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
	})
	.loose();

export type InboxSenderBody = z.infer<typeof InboxSenderBodySchema>;

// unknown: the conversation person is a FUB Person ID when it exists, or the
// lead fields FUB should match or create on the first message.
export const InboxPersonBodySchema = z
	.object({
		id: z.number().int().optional(),
		name: z.string().optional(),
		email: z.string().optional(),
		phone: z.string().optional(),
	})
	.loose();

export type InboxPersonBody = z.infer<typeof InboxPersonBodySchema>;

// unknown: the conversation owner is a FUB User or a FUB Team Inbox,
// mutually exclusive; `inboxId` is a string while `assignedInboxId` on the
// conversation update is an integer, so each keeps its documented spelling.
export const InboxOwnerBodySchema = z
	.object({
		userId: z.number().int().optional(),
		inboxId: z.string().optional(),
	})
	.loose();

export type InboxOwnerBody = z.infer<typeof InboxOwnerBodySchema>;

// ── inboxApps ──────────────────────────────────────────────────────────────

const InboxAppsDeactivateInputSchema = z.object({
	inboxAppId: z.string().min(1).describe('The Inbox App ID to deactivate.'),
});

export type InboxAppsDeactivateInput = z.infer<
	typeof InboxAppsDeactivateInputSchema
>;

// Deactivation answers 204 with no body.
const InboxAppsDeactivateResponseSchema = z
	.object({
		success: z.literal(true),
		inboxAppId: z.string(),
	})
	.loose();

export type InboxAppsDeactivateResponse = z.infer<
	typeof InboxAppsDeactivateResponseSchema
>;

const InboxAppsDeleteParticipantInputSchema = z.object({
	inboxAppId: z
		.string()
		.min(1)
		.describe('The Inbox App ID sending the message.'),
	extConversationId: z
		.string()
		.min(1)
		.describe(
			'The unique identifier that references the conversation being updated.',
		),
	participantId: z.string().min(1).describe("The participant's ID."),
});

export type InboxAppsDeleteParticipantInput = z.infer<
	typeof InboxAppsDeleteParticipantInputSchema
>;

// Removal answers 204 with no body.
const InboxAppsDeleteParticipantResponseSchema = z
	.object({
		success: z.literal(true),
		participantId: z.string(),
	})
	.loose();

export type InboxAppsDeleteParticipantResponse = z.infer<
	typeof InboxAppsDeleteParticipantResponseSchema
>;

const InboxAppsGetParticipantsInputSchema = z.object({
	inboxAppId: z
		.string()
		.min(1)
		.describe('The Inbox App ID sending the message.'),
	extConversationId: z
		.string()
		.min(1)
		.describe(
			'The unique identifier that references the conversation being updated.',
		),
});

export type InboxAppsGetParticipantsInput = z.infer<
	typeof InboxAppsGetParticipantsInputSchema
>;

// The participants list is a bare array, not an envelope.
const InboxAppsGetParticipantsResponseSchema = z.array(InboxParticipantSchema);

export type InboxAppsGetParticipantsResponse = z.infer<
	typeof InboxAppsGetParticipantsResponseSchema
>;

const InboxAppsCreateParticipantInputSchema =
	InboxAppsGetParticipantsInputSchema.extend({
		body: InboxParticipantBodySchema,
	});

export type InboxAppsCreateParticipantInput = z.infer<
	typeof InboxAppsCreateParticipantInputSchema
>;

// Adding a participant answers 201 with the participant.
const InboxAppsCreateParticipantResponseSchema = InboxParticipantSchema;

export type InboxAppsCreateParticipantResponse = z.infer<
	typeof InboxAppsCreateParticipantResponseSchema
>;

const InboxAppsAddMessageInputSchema = z.object({
	inboxAppId: z
		.string()
		.min(1)
		.describe('The Inbox App ID adding the message.'),
	externalConversationId: z
		.string()
		.describe('A unique identifier that references this conversation.'),
	externalMessageId: z
		.string()
		.describe('A unique identifier that references this message.'),
	replyToExternalMessageId: z
		.string()
		.optional()
		.describe('External message ID of the message this message replies to.'),
	sentAt: z
		.string()
		.optional()
		.describe(
			'Delivery timestamp in ISO 8601 UTC; defaults to the current time.',
		),
	subject: z
		.string()
		.optional()
		.describe('Sets or updates the subject of the conversation.'),
	message: z.string().describe('A plaintext message body.'),
	isIncoming: z
		.boolean()
		.describe('Whether the message was incoming to your system.'),
	sender: InboxSenderBodySchema.describe(
		'Who sent the message: a FUB User, a FUB Person or an unrelated entity.',
	),
	isAutomation: z
		.boolean()
		.optional()
		.describe('Whether the sender is an automated system.'),
	person: InboxPersonBodySchema.optional().describe(
		'The person associated with the conversation; required on the first message.',
	),
	owner: InboxOwnerBodySchema.optional().describe(
		'The owner of the conversation; required on the first message.',
	),
	deliveryStatus: z
		.enum(['Sent', 'Delivered', 'Read', 'Not Delivered'])
		.optional(),
	deliveryStatusErrorMessage: z
		.string()
		.optional()
		.describe('User-facing error message for Not Delivered statuses.'),
	attachments: z
		.array(InboxMessageAttachmentSchema)
		.optional()
		.describe('File attachments with a URL FUB can download for 20 minutes.'),
	richObjects: z
		.array(z.string())
		.optional()
		.describe('List of Rich Object URLs.'),
});

export type InboxAppsAddMessageInput = z.infer<
	typeof InboxAppsAddMessageInputSchema
>;

// Adding a message answers 201 with the message.
const InboxAppsAddMessageResponseSchema = InboxMessageSchema;

export type InboxAppsAddMessageResponse = z.infer<
	typeof InboxAppsAddMessageResponseSchema
>;

const InboxAppsAddNoteInputSchema = z.object({
	inboxAppId: z.string().min(1).describe('The Inbox App ID adding the note.'),
	externalConversationId: z
		.string()
		.describe('The unique identifier that references the conversation.'),
	body: z.string().describe('The plaintext body of the note.'),
	user: z
		.object({
			id: z
				.string()
				.optional()
				.describe(
					'The User ID adding the note; mutually exclusive with name/email.',
				),
			name: z.string().optional(),
			email: z.string().optional(),
		})
		.loose()
		.describe('The user adding the note.'),
});

export type InboxAppsAddNoteInput = z.infer<typeof InboxAppsAddNoteInputSchema>;

// Adding a note answers 201 with the note.
const InboxAppsAddNoteResponseSchema = InboxNoteSchema;

export type InboxAppsAddNoteResponse = z.infer<
	typeof InboxAppsAddNoteResponseSchema
>;

const InboxAppsAddSystemConfirmationMessageInputSchema = z.object({
	inboxAppId: z
		.string()
		.min(1)
		.describe('The Inbox App ID adding the message.'),
	externalConversationId: z
		.string()
		.describe('A unique identifier that references this conversation.'),
	externalMessageId: z
		.string()
		.describe('A unique identifier that references this message.'),
	message: z.string().describe('A plaintext message body.'),
	type: z
		.enum(['success', 'info', 'error'])
		.optional()
		.describe('The system confirmation message type.'),
	person: InboxPersonBodySchema.optional().describe(
		'The person associated with the conversation; required on the first message.',
	),
	owner: InboxOwnerBodySchema.optional().describe(
		'The owner of the conversation; required on the first message.',
	),
});

export type InboxAppsAddSystemConfirmationMessageInput = z.infer<
	typeof InboxAppsAddSystemConfirmationMessageInputSchema
>;

// Adding a system confirmation message answers 201 with the message.
const InboxAppsAddSystemConfirmationMessageResponseSchema = InboxMessageSchema;

export type InboxAppsAddSystemConfirmationMessageResponse = z.infer<
	typeof InboxAppsAddSystemConfirmationMessageResponseSchema
>;

const InboxAppsInstallInputSchema = z.object({
	publishedInboxAppId: z
		.number()
		.int()
		.describe('Your Published Inbox App ID.'),
	userId: z
		.number()
		.int()
		.describe(
			'The User ID to scope the install to, or 0 for account-wide scope.',
		),
	subscriptionUrl: z
		.string()
		.describe('The webhook URL you will receive Inbox App replies at.'),
});

export type InboxAppsInstallInput = z.infer<typeof InboxAppsInstallInputSchema>;

// Installing answers 201 with the installed app.
const InboxAppsInstallResponseSchema = InstalledInboxAppSchema;

export type InboxAppsInstallResponse = z.infer<
	typeof InboxAppsInstallResponseSchema
>;

const InboxAppsUpdateConversationInputSchema = z.object({
	inboxAppId: z
		.string()
		.min(1)
		.describe('The Inbox App ID sending the message.'),
	extConversationId: z
		.string()
		.min(1)
		.describe(
			'The unique identifier that references the conversation being updated.',
		),
	subject: z.string().optional().describe('Sets or updates the subject.'),
	archived: z.boolean().optional().describe('Archives or unarchives.'),
	permanentlyArchived: z
		.boolean()
		.optional()
		.describe('Disables replies and notes; cannot be undone.'),
	person: InboxPersonBodySchema.optional().describe(
		'Updates the person; only changeable before a Person ID is set.',
	),
	assignedUserId: z
		.number()
		.int()
		.optional()
		.describe('The User ID to reassign to; 0 reverts to the owner.'),
	assignedInboxId: z
		.number()
		.int()
		.optional()
		.describe('The Team Inbox ID to reassign to; 0 reverts to the owner.'),
});

export type InboxAppsUpdateConversationInput = z.infer<
	typeof InboxAppsUpdateConversationInputSchema
>;

const InboxAppsUpdateConversationResponseSchema = InboxConversationSchema;

export type InboxAppsUpdateConversationResponse = z.infer<
	typeof InboxAppsUpdateConversationResponseSchema
>;

const InboxAppsUpdateMessageInputSchema = z.object({
	inboxAppId: z
		.string()
		.min(1)
		.describe('The Inbox App ID updating the message.'),
	id: z
		.number()
		.int()
		.optional()
		.describe('FUB ID of the Inbox App message to update.'),
	externalMessageId: z
		.string()
		.optional()
		.describe(
			'Identifies the message when sent alone; updates its value alongside `id`.',
		),
	deliveryStatus: z
		.enum(['Sent', 'Delivered', 'Read', 'Not Delivered'])
		.optional(),
	deliveryStatusErrorMessage: z
		.string()
		.optional()
		.describe('User-facing error message for Not Delivered statuses.'),
});

export type InboxAppsUpdateMessageInput = z.infer<
	typeof InboxAppsUpdateMessageInputSchema
>;

const InboxAppsUpdateMessageResponseSchema = InboxMessageSchema;

export type InboxAppsUpdateMessageResponse = z.infer<
	typeof InboxAppsUpdateMessageResponseSchema
>;

// The path declares `publishedInboxAppId` as a string even though the install
// body types it as an integer; the documented string form is used here.
const InboxAppsInstalledAppInputSchema = z.object({
	publishedInboxAppId: z
		.string()
		.min(1)
		.describe('Your Published Inbox App ID, to display installations of.'),
});

export type InboxAppsInstalledAppInput = z.infer<
	typeof InboxAppsInstalledAppInputSchema
>;

const InboxAppsInstalledAppResponseSchema = InboxAppInstallationsResponseSchema;

export type InboxAppsInstalledAppResponse = z.infer<
	typeof InboxAppsInstalledAppResponseSchema
>;

// ── teamInboxes ────────────────────────────────────────────────────────────

const TeamInboxesListInputSchema = ListQuerySchema;

export type TeamInboxesListInput = z.infer<typeof TeamInboxesListInputSchema>;

const TeamInboxesListResponseSchema = TeamInboxEnvelopeSchema;

export type TeamInboxesListResponse = z.infer<
	typeof TeamInboxesListResponseSchema
>;

// ── reactions ──────────────────────────────────────────────────────────────

const ReactionsCreateInputSchema = z.object({
	refType: z
		.enum(REACTION_REF_TYPES)
		.describe('The type of entity being reacted to.'),
	refId: ReactionRefIdSchema.describe('The ID of the entity being reacted to.'),
	body: z.string().optional().describe('The single-character emoji reaction.'),
});

export type ReactionsCreateInput = z.infer<typeof ReactionsCreateInputSchema>;

// Reacting answers 201 with the reactions list of the entity, documented as
// an array.
const ReactionsCreateResponseSchema = z.array(ReactionSchema);

export type ReactionsCreateResponse = z.infer<
	typeof ReactionsCreateResponseSchema
>;

const ReactionsDeleteInputSchema = z.object({
	refType: z
		.enum(REACTION_REF_TYPES)
		.describe('The type of entity the reaction is removed from.'),
	refId: ReactionRefIdSchema.describe('The ID of the entity.'),
	emoji: z
		.string()
		.optional()
		.describe('Single character emoji reaction to delete, as a query filter.'),
	body: z
		.string()
		.optional()
		.describe(
			'The single-character emoji reaction, carried as the DELETE request body.',
		),
});

export type ReactionsDeleteInput = z.infer<typeof ReactionsDeleteInputSchema>;

// Deleting answers 204 with no body.
const ReactionsDeleteResponseSchema = z
	.object({
		success: z.literal(true),
		refType: z.string(),
		refId: z.union([z.number(), z.string()]),
	})
	.loose();

export type ReactionsDeleteResponse = z.infer<
	typeof ReactionsDeleteResponseSchema
>;

const ReactionsGetInputSchema = z.object({
	id: IdSchema.describe('The reaction ID.'),
});

export type ReactionsGetInput = z.infer<typeof ReactionsGetInputSchema>;

const ReactionsGetResponseSchema = ReactionSchema;

export type ReactionsGetResponse = z.infer<typeof ReactionsGetResponseSchema>;

// ── threaded replies ───────────────────────────────────────────────────────

const ThreadedRepliesGetInputSchema = z.object({
	id: IdSchema.describe('The ID of the threaded reply to return.'),
});

export type ThreadedRepliesGetInput = z.infer<
	typeof ThreadedRepliesGetInputSchema
>;

const ThreadedRepliesGetResponseSchema = ThreadedReplySchema;

export type ThreadedRepliesGetResponse = z.infer<
	typeof ThreadedRepliesGetResponseSchema
>;

// ── type maps ──────────────────────────────────────────────────────────────

export const InboxInputSchemas = {
	inboxAppsDeactivate: InboxAppsDeactivateInputSchema,
	inboxAppsDeleteParticipant: InboxAppsDeleteParticipantInputSchema,
	inboxAppsGetParticipants: InboxAppsGetParticipantsInputSchema,
	inboxAppsCreateParticipant: InboxAppsCreateParticipantInputSchema,
	inboxAppsAddMessage: InboxAppsAddMessageInputSchema,
	inboxAppsAddNote: InboxAppsAddNoteInputSchema,
	inboxAppsAddSystemConfirmationMessage:
		InboxAppsAddSystemConfirmationMessageInputSchema,
	inboxAppsInstall: InboxAppsInstallInputSchema,
	inboxAppsUpdateConversation: InboxAppsUpdateConversationInputSchema,
	inboxAppsUpdateMessage: InboxAppsUpdateMessageInputSchema,
	inboxAppsInstalledApp: InboxAppsInstalledAppInputSchema,
	teamInboxesList: TeamInboxesListInputSchema,
	reactionsCreate: ReactionsCreateInputSchema,
	reactionsDelete: ReactionsDeleteInputSchema,
	reactionsGet: ReactionsGetInputSchema,
	threadedRepliesGet: ThreadedRepliesGetInputSchema,
} as const;

export const InboxOutputSchemas = {
	inboxAppsDeactivate: InboxAppsDeactivateResponseSchema,
	inboxAppsDeleteParticipant: InboxAppsDeleteParticipantResponseSchema,
	inboxAppsGetParticipants: InboxAppsGetParticipantsResponseSchema,
	inboxAppsCreateParticipant: InboxAppsCreateParticipantResponseSchema,
	inboxAppsAddMessage: InboxAppsAddMessageResponseSchema,
	inboxAppsAddNote: InboxAppsAddNoteResponseSchema,
	inboxAppsAddSystemConfirmationMessage:
		InboxAppsAddSystemConfirmationMessageResponseSchema,
	inboxAppsInstall: InboxAppsInstallResponseSchema,
	inboxAppsUpdateConversation: InboxAppsUpdateConversationResponseSchema,
	inboxAppsUpdateMessage: InboxAppsUpdateMessageResponseSchema,
	inboxAppsInstalledApp: InboxAppsInstalledAppResponseSchema,
	teamInboxesList: TeamInboxesListResponseSchema,
	reactionsCreate: ReactionsCreateResponseSchema,
	reactionsDelete: ReactionsDeleteResponseSchema,
	reactionsGet: ReactionsGetResponseSchema,
	threadedRepliesGet: ThreadedRepliesGetResponseSchema,
} as const;
