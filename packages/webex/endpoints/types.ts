import { z } from 'zod';

// Inputs use Webex's own parameter names. Outputs are `.loose()` and their
// documented fields nullish.
// Reference: https://developer.webex.com/docs/api/v1
//
// Webex lists page with `max` (capped at 1000) and follow a `Link` header with
// a next rel rather than a cursor in the body.

const RoomSchema = z
	.object({
		id: z.string().nullish(),
		title: z.string().nullish(),
		type: z
			.string()
			.nullish()
			.describe('group for a space, direct for a one-to-one room.'),
		isLocked: z.boolean().nullish(),
		lastActivity: z.string().nullish(),
		creatorId: z.string().nullish(),
		created: z.string().nullish(),
		ownerId: z.string().nullish(),
		isPublic: z.boolean().nullish(),
		isReadOnly: z.boolean().nullish(),
		description: z.string().nullish(),
		siteUrl: z.string().nullish(),
	})
	.loose();

export type WebexRoom = z.infer<typeof RoomSchema>;

const MessageSchema = z
	.object({
		id: z.string().nullish(),
		roomId: z.string().nullish(),
		roomType: z.string().nullish(),
		text: z.string().nullish(),
		html: z.string().nullish(),
		markdown: z.string().nullish(),
		files: z.array(z.string()).nullish(),
		personId: z.string().nullish(),
		personEmail: z.string().nullish(),
		created: z.string().nullish(),
		updated: z.string().nullish(),
		mentionedPeople: z.array(z.string()).nullish(),
		mentionedGroups: z.array(z.string()).nullish(),
		parentId: z.string().nullish(),
		// unknown: an attachment action carries a free-form `inputs` map whose keys
		// belong to the card's author, so its shape is not ours to model.
		attachmentActions: z.array(z.unknown()).nullish(),
		// A transcript or a cue is rendered from the same message object.
		isVoiceClip: z.boolean().nullish(),
		contentType: z.string().nullish(),
	})
	.loose();

export type WebexMessage = z.infer<typeof MessageSchema>;

const PersonSchema = z
	.object({
		id: z.string().nullish(),
		emails: z.array(z.string()).nullish(),
		displayName: z.string().nullish(),
		nickName: z.string().nullish(),
		firstName: z.string().nullish(),
		lastName: z.string().nullish(),
		avatar: z.string().nullish(),
		orgId: z.string().nullish(),
		roles: z.array(z.string()).nullish(),
		licenses: z.array(z.string()).nullish(),
		created: z.string().nullish(),
		lastActivity: z.string().nullish(),
		status: z.string().nullish().describe('active, inactive or unknown.'),
		type: z.string().nullish().describe('person or bot.'),
	})
	.loose();

export type WebexPerson = z.infer<typeof PersonSchema>;

const TeamSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		creatorId: z.string().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type WebexTeam = z.infer<typeof TeamSchema>;

const TeamMembershipSchema = z
	.object({
		id: z.string().nullish(),
		teamId: z.string().nullish(),
		personId: z.string().nullish(),
		personEmail: z.string().nullish(),
		personDisplayName: z.string().nullish(),
		personOrgId: z.string().nullish(),
		isModerator: z.boolean().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type WebexTeamMembership = z.infer<typeof TeamMembershipSchema>;

const MembershipSchema = z
	.object({
		id: z.string().nullish(),
		roomId: z.string().nullish(),
		personId: z.string().nullish(),
		personEmail: z.string().nullish(),
		personDisplayName: z.string().nullish(),
		personOrgId: z.string().nullish(),
		isModerator: z.boolean().nullish(),
		isMonitor: z.boolean().nullish(),
		created: z.string().nullish(),
	})
	.loose();

export type WebexMembership = z.infer<typeof MembershipSchema>;

const WebhookSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		targetUrl: z.string().nullish(),
		resource: z.string().nullish(),
		event: z.string().nullish(),
		filter: z.string().nullish(),
		secret: z.string().nullish(),
		status: z.string().nullish(),
		created: z.string().nullish(),
		createdBy: z.string().nullish(),
		orgId: z.string().nullish(),
		ownedBy: z.string().nullish(),
	})
	.loose();

export type WebexWebhook = z.infer<typeof WebhookSchema>;

/** Webex answers a list as `{ items: [...] }`. */
/**
 * A page of a list. `nextLink` is the URL of the next page, taken from Webex's
 * `Link` header; when it is absent this was the last page.
 */
function items<T extends z.ZodType>(item: T) {
	return z
		.object({
			items: z.array(item).nullish(),
			nextLink: z
				.string()
				.nullish()
				.describe('The next page, or null when this is the last one.'),
		})
		.loose();
}

const MaxSchema = z
	.number()
	.int()
	.min(1)
	.max(1000)
	.optional()
	.describe('Items per page, up to 1000.');

/**
 * The next page, as the `nextLink` value the previous page returned.
 *
 * Webex pages with a `Link` header, and `corsair/http` returns the body only, so
 * the plugin reads that header into `nextLink` on the response and the caller
 * passes it straight back here to continue.
 */
const NextLinkSchema = z
	.string()
	.url()
	// The plugin sends the token to this URL, so only Webex's own host passes.
	.refine((value) => new URL(value).origin === 'https://webexapis.com', {
		message:
			'nextLink must be a https://webexapis.com URL from a previous page.',
	})
	.optional()
	.describe(
		"Pass the previous page's `nextLink` to read the next page. Omit it for the first page.",
	);

// ── rooms ─────────────────────────────────────────────────────────────────

const RoomsListInputSchema = z.object({
	max: MaxSchema,
	nextLink: NextLinkSchema,
	type: z.enum(['group', 'direct']).optional(),
	teamId: z
		.string()
		.optional()
		.describe('Only rooms shared with this team, or with no team for `none`.'),
	sortBy: z.enum(['id', 'lastactivity', 'created']).optional(),
});

export type RoomsListInput = z.infer<typeof RoomsListInputSchema>;

const RoomsListResponseSchema = items(RoomSchema);

export type RoomsListResponse = z.infer<typeof RoomsListResponseSchema>;

const RoomsGetInputSchema = z.object({ id: z.string().min(1) });

export type RoomsGetInput = z.infer<typeof RoomsGetInputSchema>;

const RoomResponseSchema = RoomSchema;

export type RoomResponse = z.infer<typeof RoomResponseSchema>;

const RoomsCreateInputSchema = z.object({
	title: z.string().min(1),
	teamId: z.string().optional(),
	description: z.string().optional(),
	isLocked: z
		.boolean()
		.optional()
		.describe('A locked room only lets moderators add people.'),
	isPublic: z.boolean().optional(),
	isReadOnly: z
		.boolean()
		.optional()
		.describe('A read-only room only lets moderators send messages.'),
});

export type RoomsCreateInput = z.infer<typeof RoomsCreateInputSchema>;

const RoomsUpdateInputSchema = z.object({
	id: z.string().min(1),
	title: z
		.string()
		.min(1)
		.describe('Webex requires the title on every update, even when unchanged.'),
	description: z.string().optional(),
	isLocked: z.boolean().optional(),
	isReadOnly: z.boolean().optional(),
});

export type RoomsUpdateInput = z.infer<typeof RoomsUpdateInputSchema>;

const RoomsDeleteInputSchema = z.object({ id: z.string().min(1) });

export type RoomsDeleteInput = z.infer<typeof RoomsDeleteInputSchema>;

/** A delete answers 204, so the plugin states what it did. */
const DeleteResponseSchema = z.object({
	id: z.string(),
	deleted: z.literal(true),
});

export type DeleteResponse = z.infer<typeof DeleteResponseSchema>;

// ── messages ──────────────────────────────────────────────────────────────

const MessagesListInputSchema = z
	.object({
		roomId: z.string().min(1).describe('The room to list messages from.'),
		parentId: z
			.string()
			.min(1)
			.optional()
			.describe('Only the replies in this thread of the room.'),
		mentionedPeople: z
			.string()
			.optional()
			.describe('Only messages mentioning this person.'),
		before: z.string().optional().describe('ISO 8601: only earlier messages.'),
		beforeMessage: z
			.string()
			.optional()
			.describe('Only messages before this id.'),
		max: MaxSchema,
		nextLink: NextLinkSchema,
	})
	.superRefine((input, ctx) => {
		// Webex caps the page at 100 when mentionedPeople is set.
		if (input.mentionedPeople !== undefined && (input.max ?? 0) > 100) {
			ctx.addIssue({
				code: 'custom',
				path: ['max'],
				message: 'max cannot exceed 100 when mentionedPeople is set.',
			});
		}
	});

export type MessagesListInput = z.infer<typeof MessagesListInputSchema>;

const MessagesListResponseSchema = items(MessageSchema);

export type MessagesListResponse = z.infer<typeof MessagesListResponseSchema>;

const MessagesGetInputSchema = z.object({ id: z.string().min(1) });

export type MessagesGetInput = z.infer<typeof MessagesGetInputSchema>;

const MessageResponseSchema = MessageSchema;

export type MessageResponse = z.infer<typeof MessageResponseSchema>;

/**
 * Sends a message. At least one of `text`, `markdown` or `files` is needed, and
 * the schema enforces that rather than letting Webex reject an empty message.
 */
const MessagesCreateInputSchema = z
	.object({
		roomId: z.string().optional().describe('The room to post to.'),
		toPersonId: z
			.string()
			.optional()
			.describe('A one-to-one message to this person id.'),
		toPersonEmail: z
			.string()
			.optional()
			.describe('A one-to-one message to this address.'),
		text: z.string().optional(),
		markdown: z.string().optional(),
		html: z.string().optional(),
		files: z
			.array(z.string())
			.min(1)
			.max(1)
			.optional()
			.describe(
				'The public URL of one file to attach; Webex takes one per message.',
			),
		parentId: z.string().optional().describe('Post as a reply in this thread.'),
	})
	.superRefine((value, ctx) => {
		// An empty string is as undirected as a missing one, and would reach Webex
		// as a request it refuses.
		const filled = (part: string | undefined): boolean =>
			part !== undefined && part.trim().length > 0;
		if (
			!filled(value.roomId) &&
			!filled(value.toPersonId) &&
			!filled(value.toPersonEmail)
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['roomId'],
				message:
					'A message needs a non-empty roomId, toPersonId or toPersonEmail.',
			});
		}
		if (
			!filled(value.text) &&
			!filled(value.markdown) &&
			!filled(value.html) &&
			value.files === undefined
		) {
			ctx.addIssue({
				code: 'custom',
				path: ['text'],
				message: 'A message needs non-empty text, markdown, html, or files.',
			});
		}
	});

export type MessagesCreateInput = z.infer<typeof MessagesCreateInputSchema>;

const MessagesUpdateInputSchema = z
	.object({
		id: z.string().min(1),
		roomId: z
			.string()
			.min(1)
			.describe('The room the message is in; Webex requires it on an edit.'),
		text: z.string().optional(),
		markdown: z.string().optional(),
	})
	.refine(
		(value) =>
			(value.text?.trim().length ?? 0) > 0 ||
			(value.markdown?.trim().length ?? 0) > 0,
		{ path: ['text'], message: 'An edit needs non-empty text or markdown.' },
	);

export type MessagesUpdateInput = z.infer<typeof MessagesUpdateInputSchema>;

const MessagesDeleteInputSchema = z.object({ id: z.string().min(1) });

export type MessagesDeleteInput = z.infer<typeof MessagesDeleteInputSchema>;

// ── people ────────────────────────────────────────────────────────────────

const PeopleListInputSchema = z.object({
	email: z.string().optional().describe('Only this address.'),
	displayName: z.string().optional(),
	id: z.string().optional(),
	orgId: z.string().optional(),
	max: MaxSchema,
	nextLink: NextLinkSchema,
});

export type PeopleListInput = z.infer<typeof PeopleListInputSchema>;

const PeopleListResponseSchema = items(PersonSchema);

export type PeopleListResponse = z.infer<typeof PeopleListResponseSchema>;

const MeInputSchema = z.object({});

export type MeInput = z.infer<typeof MeInputSchema>;

const MeResponseSchema = PersonSchema;

export type MeResponse = z.infer<typeof MeResponseSchema>;

const PeopleGetInputSchema = z.object({ id: z.string().min(1) });

export type PeopleGetInput = z.infer<typeof PeopleGetInputSchema>;

// ── teams ─────────────────────────────────────────────────────────────────

const TeamsListInputSchema = z.object({
	max: MaxSchema,
	nextLink: NextLinkSchema,
});

export type TeamsListInput = z.infer<typeof TeamsListInputSchema>;

const TeamsListResponseSchema = items(TeamSchema);

export type TeamsListResponse = z.infer<typeof TeamsListResponseSchema>;

const TeamsGetInputSchema = z.object({ id: z.string().min(1) });

export type TeamsGetInput = z.infer<typeof TeamsGetInputSchema>;

const TeamResponseSchema = TeamSchema;

export type TeamResponse = z.infer<typeof TeamResponseSchema>;

const TeamsCreateInputSchema = z.object({ name: z.string().min(1) });

export type TeamsCreateInput = z.infer<typeof TeamsCreateInputSchema>;

const TeamsDeleteInputSchema = z.object({ id: z.string().min(1) });

export type TeamsDeleteInput = z.infer<typeof TeamsDeleteInputSchema>;

const TeamMembershipsListInputSchema = z.object({
	teamId: z.string().min(1),
	max: MaxSchema,
	nextLink: NextLinkSchema,
});

export type TeamMembershipsListInput = z.infer<
	typeof TeamMembershipsListInputSchema
>;

const TeamMembershipsListResponseSchema = items(TeamMembershipSchema);

export type TeamMembershipsListResponse = z.infer<
	typeof TeamMembershipsListResponseSchema
>;

const TeamMembershipsCreateInputSchema = z.object({
	teamId: z.string().min(1),
	personId: z.string().optional(),
	personEmail: z.string().optional(),
	isModerator: z.boolean().optional(),
});

export type TeamMembershipsCreateInput = z.infer<
	typeof TeamMembershipsCreateInputSchema
>;

const TeamMembershipResponseSchema = TeamMembershipSchema;

export type TeamMembershipResponse = z.infer<
	typeof TeamMembershipResponseSchema
>;

const TeamMembershipsDeleteInputSchema = z.object({ id: z.string().min(1) });

export type TeamMembershipsDeleteInput = z.infer<
	typeof TeamMembershipsDeleteInputSchema
>;

// ── room memberships ──────────────────────────────────────────────────────

const MembershipsListInputSchema = z.object({
	roomId: z.string().optional(),
	personId: z.string().optional(),
	personEmail: z.string().optional(),
	max: MaxSchema,
	nextLink: NextLinkSchema,
});

export type MembershipsListInput = z.infer<typeof MembershipsListInputSchema>;

const MembershipsListResponseSchema = items(MembershipSchema);

export type MembershipsListResponse = z.infer<
	typeof MembershipsListResponseSchema
>;

const MembershipsCreateInputSchema = z.object({
	roomId: z.string().min(1),
	personId: z.string().optional(),
	personEmail: z.string().optional(),
	isModerator: z.boolean().optional(),
});

export type MembershipsCreateInput = z.infer<
	typeof MembershipsCreateInputSchema
>;

const MembershipResponseSchema = MembershipSchema;

export type MembershipResponse = z.infer<typeof MembershipResponseSchema>;

const MembershipsDeleteInputSchema = z.object({ id: z.string().min(1) });

export type MembershipsDeleteInput = z.infer<
	typeof MembershipsDeleteInputSchema
>;

// ── webhooks ──────────────────────────────────────────────────────────────

const WebhooksListInputSchema = z.object({
	max: MaxSchema,
	nextLink: NextLinkSchema,
});

export type WebhooksListInput = z.infer<typeof WebhooksListInputSchema>;

const WebhooksListResponseSchema = items(WebhookSchema);

export type WebhooksListResponse = z.infer<typeof WebhooksListResponseSchema>;

const WebhooksGetInputSchema = z.object({ id: z.string().min(1) });

export type WebhooksGetInput = z.infer<typeof WebhooksGetInputSchema>;

const WebhookResponseSchema = WebhookSchema;

export type WebhookResponse = z.infer<typeof WebhookResponseSchema>;

/**
 * Creates a webhook. `resource` and `event` together select what it fires on,
 * and `secret` is the HMAC key Webex signs each delivery with — so it is the
 * one value worth capturing at creation.
 */
const WebhooksCreateInputSchema = z.object({
	name: z.string().min(1),
	targetUrl: z.string().min(1),
	resource: z
		.enum([
			'attachmentActions',
			'dataSources',
			'memberships',
			'messages',
			'rooms',
			'meetings',
			'recordings',
			'convergedRecordings',
			'meetingParticipants',
			'meetingTranscripts',
			'telephony_calls',
			'telephony_conference',
			'telephony_mwi',
			'uc_counters',
			'serviceApp',
			'adminBatchJobs',
			'all',
		])
		.describe(
			'The resource whose events to send. all, with event all, is the firehose for memberships, messages and rooms.',
		),
	event: z
		.enum([
			'created',
			'updated',
			'deleted',
			'started',
			'ended',
			'joined',
			'left',
			'migrated',
			'authorized',
			'deauthorized',
			'statusChanged',
			'all',
		])
		.describe(
			'Which event on that resource, e.g. started or ended for meetings, joined or left for meetingParticipants.',
		),
	filter: z
		.string()
		.optional()
		.describe('Restrict to a room id, e.g. `roomId=abc`.'),
	secret: z
		.string()
		.optional()
		.describe('The HMAC key Webex signs deliveries with.'),
	ownedBy: z
		.enum(['org'])
		.optional()
		.describe(
			'org makes an org-wide webhook (admin token). Needed for host or owner filters such as hostEmail.',
		),
});

export type WebhooksCreateInput = z.infer<typeof WebhooksCreateInputSchema>;

const WebhooksUpdateInputSchema = z.object({
	id: z.string().min(1),
	name: z
		.string()
		.min(1)
		.describe('Webex requires the name on every update, even when unchanged.'),
	targetUrl: z
		.string()
		.min(1)
		.describe(
			'Webex requires the target URL on every update, even when unchanged.',
		),
	secret: z.string().optional(),
	status: z
		.enum(['active'])
		.optional()
		.describe(
			'active turns back on a webhook Webex disabled after failed deliveries. Webex refuses inactive; delete the webhook to stop it.',
		),
});

export type WebhooksUpdateInput = z.infer<typeof WebhooksUpdateInputSchema>;

const WebhooksDeleteInputSchema = z.object({ id: z.string().min(1) });

export type WebhooksDeleteInput = z.infer<typeof WebhooksDeleteInputSchema>;

// ── Registry ──────────────────────────────────────────────────────────────

export type WebexEndpointInputs = {
	roomsList: RoomsListInput;
	roomsGet: RoomsGetInput;
	roomsCreate: RoomsCreateInput;
	roomsUpdate: RoomsUpdateInput;
	roomsDelete: RoomsDeleteInput;
	messagesList: MessagesListInput;
	messagesGet: MessagesGetInput;
	messagesCreate: MessagesCreateInput;
	messagesUpdate: MessagesUpdateInput;
	messagesDelete: MessagesDeleteInput;
	peopleList: PeopleListInput;
	peopleMe: MeInput;
	peopleGet: PeopleGetInput;
	teamsList: TeamsListInput;
	teamsGet: TeamsGetInput;
	teamsCreate: TeamsCreateInput;
	teamsDelete: TeamsDeleteInput;
	teamMembershipsList: TeamMembershipsListInput;
	teamMembershipsCreate: TeamMembershipsCreateInput;
	teamMembershipsDelete: TeamMembershipsDeleteInput;
	membershipsList: MembershipsListInput;
	membershipsCreate: MembershipsCreateInput;
	membershipsDelete: MembershipsDeleteInput;
	webhooksList: WebhooksListInput;
	webhooksGet: WebhooksGetInput;
	webhooksCreate: WebhooksCreateInput;
	webhooksUpdate: WebhooksUpdateInput;
	webhooksDelete: WebhooksDeleteInput;
};

export type WebexEndpointOutputs = {
	roomsList: RoomsListResponse;
	roomsGet: RoomResponse;
	roomsCreate: RoomResponse;
	roomsUpdate: RoomResponse;
	roomsDelete: DeleteResponse;
	messagesList: MessagesListResponse;
	messagesGet: MessageResponse;
	messagesCreate: MessageResponse;
	messagesUpdate: MessageResponse;
	messagesDelete: DeleteResponse;
	peopleList: PeopleListResponse;
	peopleMe: MeResponse;
	peopleGet: MeResponse;
	teamsList: TeamsListResponse;
	teamsGet: TeamResponse;
	teamsCreate: TeamResponse;
	teamsDelete: DeleteResponse;
	teamMembershipsList: TeamMembershipsListResponse;
	teamMembershipsCreate: TeamMembershipResponse;
	teamMembershipsDelete: DeleteResponse;
	membershipsList: MembershipsListResponse;
	membershipsCreate: MembershipResponse;
	membershipsDelete: DeleteResponse;
	webhooksList: WebhooksListResponse;
	webhooksGet: WebhookResponse;
	webhooksCreate: WebhookResponse;
	webhooksUpdate: WebhookResponse;
	webhooksDelete: DeleteResponse;
};

export const WebexEndpointInputSchemas = {
	roomsList: RoomsListInputSchema,
	roomsGet: RoomsGetInputSchema,
	roomsCreate: RoomsCreateInputSchema,
	roomsUpdate: RoomsUpdateInputSchema,
	roomsDelete: RoomsDeleteInputSchema,
	messagesList: MessagesListInputSchema,
	messagesGet: MessagesGetInputSchema,
	messagesCreate: MessagesCreateInputSchema,
	messagesUpdate: MessagesUpdateInputSchema,
	messagesDelete: MessagesDeleteInputSchema,
	peopleList: PeopleListInputSchema,
	peopleMe: MeInputSchema,
	peopleGet: PeopleGetInputSchema,
	teamsList: TeamsListInputSchema,
	teamsGet: TeamsGetInputSchema,
	teamsCreate: TeamsCreateInputSchema,
	teamsDelete: TeamsDeleteInputSchema,
	teamMembershipsList: TeamMembershipsListInputSchema,
	teamMembershipsCreate: TeamMembershipsCreateInputSchema,
	teamMembershipsDelete: TeamMembershipsDeleteInputSchema,
	membershipsList: MembershipsListInputSchema,
	membershipsCreate: MembershipsCreateInputSchema,
	membershipsDelete: MembershipsDeleteInputSchema,
	webhooksList: WebhooksListInputSchema,
	webhooksGet: WebhooksGetInputSchema,
	webhooksCreate: WebhooksCreateInputSchema,
	webhooksUpdate: WebhooksUpdateInputSchema,
	webhooksDelete: WebhooksDeleteInputSchema,
} as const;

export const WebexEndpointOutputSchemas = {
	roomsList: RoomsListResponseSchema,
	roomsGet: RoomResponseSchema,
	roomsCreate: RoomResponseSchema,
	roomsUpdate: RoomResponseSchema,
	roomsDelete: DeleteResponseSchema,
	messagesList: MessagesListResponseSchema,
	messagesGet: MessageResponseSchema,
	messagesCreate: MessageResponseSchema,
	messagesUpdate: MessageResponseSchema,
	messagesDelete: DeleteResponseSchema,
	peopleList: PeopleListResponseSchema,
	peopleMe: MeResponseSchema,
	peopleGet: MeResponseSchema,
	teamsList: TeamsListResponseSchema,
	teamsGet: TeamResponseSchema,
	teamsCreate: TeamResponseSchema,
	teamsDelete: DeleteResponseSchema,
	teamMembershipsList: TeamMembershipsListResponseSchema,
	teamMembershipsCreate: TeamMembershipResponseSchema,
	teamMembershipsDelete: DeleteResponseSchema,
	membershipsList: MembershipsListResponseSchema,
	membershipsCreate: MembershipResponseSchema,
	membershipsDelete: DeleteResponseSchema,
	webhooksList: WebhooksListResponseSchema,
	webhooksGet: WebhookResponseSchema,
	webhooksCreate: WebhookResponseSchema,
	webhooksUpdate: WebhookResponseSchema,
	webhooksDelete: DeleteResponseSchema,
} as const;
