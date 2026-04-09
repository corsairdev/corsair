import { z } from 'zod';

// ── Shared sub-schemas ────────────────────────────────────────────────────────

const TrelloLabelSchema = z
	.object({
		id: z.string(),
		idBoard: z.string().optional(),
		name: z.string().optional(),
		color: z.string().nullable().optional(),
	})
	.passthrough();

const TrelloBadgesSchema = z
	.object({
		votes: z.number().optional(),
		viewingMemberVoted: z.boolean().optional(),
		subscribed: z.boolean().optional(),
		fogbugz: z.string().optional(),
		checkItems: z.number().optional(),
		checkItemsChecked: z.number().optional(),
		comments: z.number().optional(),
		attachments: z.number().optional(),
		description: z.boolean().optional(),
		due: z.string().nullable().optional(),
		dueComplete: z.boolean().optional(),
	})
	.passthrough();

const TrelloBoardPrefsSchema = z
	.object({
		permissionLevel: z.string().optional(),
		hideVotes: z.boolean().optional(),
		voting: z.string().optional(),
		comments: z.string().optional(),
		invitations: z.string().optional(),
		selfJoin: z.boolean().optional(),
		cardCovers: z.boolean().optional(),
		isTemplate: z.boolean().optional(),
		cardAging: z.string().optional(),
		calendarFeedEnabled: z.boolean().optional(),
		background: z.string().nullable().optional(),
		backgroundImage: z.string().nullable().optional(),
		backgroundTile: z.boolean().optional(),
		backgroundBrightness: z.string().optional(),
		canBePublic: z.boolean().optional(),
		canBeOrg: z.boolean().optional(),
		canBePrivate: z.boolean().optional(),
		canInvite: z.union([z.string(), z.boolean()]).optional(),
	})
	.passthrough();

const TrelloBoardSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		desc: z.string().optional(),
		// Opaque nested object; Trello's API docs leave this structure undocumented and no callers need it
		descData: z.unknown().nullable().optional(),
		closed: z.boolean().optional(),
		idOrganization: z.string().nullable().optional(),
		idEnterprise: z.string().nullable().optional(),
		pinned: z.boolean().optional(),
		url: z.string().optional(),
		shortUrl: z.string().optional(),
		prefs: TrelloBoardPrefsSchema.optional(),
		labelNames: z.record(z.string()).optional(),
		starred: z.boolean().optional(),
		// Membership entries have dynamic role/deactivated fields not needed by any endpoint
		memberships: z.array(z.unknown()).optional(),
	})
	.passthrough();

const TrelloListSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		closed: z.boolean().optional(),
		idBoard: z.string().optional(),
		pos: z.number().optional(),
		subscribed: z.boolean().optional(),
		// Trello documents this as a nullable integer but returns mixed types (number | object) in practice
		softLimit: z.unknown().nullable().optional(),
	})
	.passthrough();

const TrelloCardSchema = z
	.object({
		id: z.string(),
		badges: TrelloBadgesSchema.optional(),
		// Per-item check state shape varies across Trello API versions and is not consumed by callers
		checkItemStates: z.array(z.unknown()).nullable().optional(),
		closed: z.boolean().optional(),
		dateLastActivity: z.string().optional(),
		desc: z.string().optional(),
		// Opaque emoji/formatting metadata on the card description; structure undocumented by Trello
		descData: z.unknown().nullable().optional(),
		due: z.string().nullable().optional(),
		dueComplete: z.boolean().optional(),
		dueReminder: z.number().nullable().optional(),
		email: z.string().nullable().optional(),
		idBoard: z.string().optional(),
		idChecklists: z.array(z.string()).optional(),
		idLabels: z.array(z.string()).optional(),
		idList: z.string().optional(),
		idMembers: z.array(z.string()).optional(),
		idMembersVoted: z.array(z.string()).optional(),
		idShort: z.number().optional(),
		idAttachmentCover: z.string().nullable().optional(),
		labels: z.array(TrelloLabelSchema).optional(),
		manualCoverAttachment: z.boolean().optional(),
		name: z.string().optional(),
		pos: z.number().optional(),
		shortLink: z.string().optional(),
		shortUrl: z.string().optional(),
		start: z.string().nullable().optional(),
		subscribed: z.boolean().optional(),
		url: z.string().optional(),
		// Cover object has many optional, version-specific attachment/color fields not needed by callers
		cover: z.unknown().nullable().optional(),
	})
	.passthrough();

const TrelloMemberSchema = z
	.object({
		id: z.string(),
		activityBlocked: z.boolean().optional(),
		avatarHash: z.string().nullable().optional(),
		avatarUrl: z.string().nullable().optional(),
		bio: z.string().optional(),
		confirmed: z.boolean().optional(),
		email: z.string().nullable().optional(),
		fullName: z.string().optional(),
		idEnterprise: z.string().nullable().optional(),
		idMemberReferrer: z.string().nullable().optional(),
		idOrganizations: z.array(z.string()).optional(),
		initials: z.string().optional(),
		memberType: z.string().optional(),
		// Intentionally opaque private member data; Trello intentionally omits the schema from docs
		nonPublic: z.unknown().optional(),
		nonPublicAvailable: z.boolean().optional(),
		products: z.array(z.number()).optional(),
		url: z.string().optional(),
		username: z.string().optional(),
	})
	.passthrough();

const TrelloCheckItemSchema = z
	.object({
		id: z.string(),
		idChecklist: z.string().optional(),
		name: z.string().optional(),
		// Opaque emoji/formatting metadata attached to the checklist item name; structure undocumented
		nameData: z.unknown().nullable().optional(),
		pos: z.number().optional(),
		state: z.enum(['incomplete', 'complete']).optional(),
		due: z.string().nullable().optional(),
		// Trello returns a number (minutes before due) or null, but older API versions may return an object
		dueReminder: z.unknown().nullable().optional(),
		idMember: z.string().nullable().optional(),
	})
	.passthrough();

const TrelloChecklistSchema = z
	.object({
		id: z.string(),
		idBoard: z.string().optional(),
		idCard: z.string().optional(),
		name: z.string().optional(),
		pos: z.number().optional(),
		checkItems: z.array(TrelloCheckItemSchema).optional(),
	})
	.passthrough();

// ── Input Schemas ─────────────────────────────────────────────────────────────

const BoardsGetInputSchema = z.object({
	boardId: z.string(),
	fields: z.string().optional(),
});

const BoardsListInputSchema = z.object({
	memberId: z.string().optional(),
	filter: z
		.enum([
			'all',
			'closed',
			'members',
			'open',
			'organization',
			'public',
			'starred',
		])
		.optional(),
	fields: z.string().optional(),
});

const BoardsCreateInputSchema = z.object({
	name: z.string(),
	desc: z.string().optional(),
	idOrganization: z.string().optional(),
	idBoardSource: z.string().optional(),
	keepFromSource: z.string().optional(),
	powerUps: z.string().optional(),
	prefs_permissionLevel: z.enum(['org', 'private', 'public']).optional(),
	prefs_voting: z.string().optional(),
	prefs_comments: z.string().optional(),
	prefs_invitations: z.string().optional(),
	prefs_selfJoin: z.boolean().optional(),
	prefs_cardCovers: z.boolean().optional(),
	prefs_background: z.string().optional(),
	prefs_cardAging: z.enum(['pirate', 'regular']).optional(),
	defaultLabels: z.boolean().optional(),
	defaultLists: z.boolean().optional(),
});

const BoardsUpdateInputSchema = z.object({
	boardId: z.string(),
	name: z.string().optional(),
	desc: z.string().optional(),
	closed: z.boolean().optional(),
	subscribed: z.boolean().optional(),
	idOrganization: z.string().optional(),
	prefs_permissionLevel: z.enum(['org', 'private', 'public']).optional(),
	prefs_selfJoin: z.boolean().optional(),
	prefs_cardCovers: z.boolean().optional(),
	prefs_cardAging: z.enum(['pirate', 'regular']).optional(),
});

const BoardsDeleteInputSchema = z.object({
	boardId: z.string(),
});

const ListsGetInputSchema = z.object({
	listId: z.string(),
	fields: z.string().optional(),
});

const ListsListInputSchema = z.object({
	boardId: z.string(),
	filter: z.enum(['all', 'closed', 'none', 'open']).optional(),
});

const ListsCreateInputSchema = z.object({
	name: z.string(),
	idBoard: z.string(),
	idListSource: z.string().optional(),
	pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional(),
});

const ListsUpdateInputSchema = z.object({
	listId: z.string(),
	name: z.string().optional(),
	closed: z.boolean().optional(),
	idBoard: z.string().optional(),
	pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional(),
	subscribed: z.boolean().optional(),
});

const ListsArchiveInputSchema = z.object({
	listId: z.string(),
});

const CardsGetInputSchema = z.object({
	cardId: z.string(),
	fields: z.string().optional(),
});

const CardsListInputSchema = z.object({
	listId: z.string(),
	filter: z.enum(['all', 'closed', 'none', 'open', 'visible']).optional(),
	fields: z.string().optional(),
	limit: z.number().optional(),
	before: z.string().optional(),
	since: z.string().optional(),
});

const CardsCreateInputSchema = z.object({
	name: z.string(),
	idList: z.string(),
	desc: z.string().optional(),
	pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional(),
	due: z.string().nullable().optional(),
	start: z.string().nullable().optional(),
	dueComplete: z.boolean().optional(),
	idMembers: z.array(z.string()).optional(),
	idLabels: z.array(z.string()).optional(),
	idCardSource: z.string().optional(),
	keepFromSource: z.string().optional(),
});

const CardsUpdateInputSchema = z.object({
	cardId: z.string(),
	name: z.string().optional(),
	desc: z.string().optional(),
	closed: z.boolean().optional(),
	idMembers: z.array(z.string()).optional(),
	idAttachmentCover: z.string().nullable().optional(),
	idList: z.string().optional(),
	idLabels: z.array(z.string()).optional(),
	idBoard: z.string().optional(),
	pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional(),
	due: z.string().nullable().optional(),
	start: z.string().nullable().optional(),
	dueComplete: z.boolean().optional(),
	subscribed: z.boolean().optional(),
});

const CardsDeleteInputSchema = z.object({
	cardId: z.string(),
});

const CardsMoveInputSchema = z.object({
	cardId: z.string(),
	idList: z.string(),
	idBoard: z.string().optional(),
	pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional(),
});

const MembersGetInputSchema = z.object({
	memberId: z.string(),
	fields: z.string().optional(),
});

const MembersListInputSchema = z.object({
	boardId: z.string(),
	filter: z.enum(['admins', 'all', 'none', 'normal', 'owners']).optional(),
});

const LabelsListInputSchema = z.object({
	boardId: z.string(),
	fields: z.string().optional(),
	limit: z.number().optional(),
});

const LabelsCreateInputSchema = z.object({
	name: z.string(),
	color: z.string().nullable(),
	idBoard: z.string(),
});

const LabelsUpdateInputSchema = z.object({
	labelId: z.string(),
	name: z.string().optional(),
	color: z.string().nullable().optional(),
});

const LabelsDeleteInputSchema = z.object({
	labelId: z.string(),
});

const ChecklistsGetInputSchema = z.object({
	checklistId: z.string(),
	fields: z.string().optional(),
	checkItems: z.string().optional(),
	checkItem_fields: z.string().optional(),
});

const ChecklistsCreateInputSchema = z.object({
	idCard: z.string(),
	name: z.string(),
	pos: z.union([z.number(), z.enum(['top', 'bottom'])]).optional(),
	idChecklistSource: z.string().optional(),
});

const ChecklistsDeleteInputSchema = z.object({
	checklistId: z.string(),
});

// ── Output Schemas ────────────────────────────────────────────────────────────

const BoardsGetResponseSchema = TrelloBoardSchema;
const BoardsListResponseSchema = z.array(TrelloBoardSchema);
const BoardsCreateResponseSchema = TrelloBoardSchema;
const BoardsUpdateResponseSchema = TrelloBoardSchema;
const BoardsDeleteResponseSchema = z.object({
	_value: z.string().nullable().optional(),
});

const ListsGetResponseSchema = TrelloListSchema;
const ListsListResponseSchema = z.array(TrelloListSchema);
const ListsCreateResponseSchema = TrelloListSchema;
const ListsUpdateResponseSchema = TrelloListSchema;
const ListsArchiveResponseSchema = TrelloListSchema;

const CardsGetResponseSchema = TrelloCardSchema;
const CardsListResponseSchema = z.array(TrelloCardSchema);
const CardsCreateResponseSchema = TrelloCardSchema;
const CardsUpdateResponseSchema = TrelloCardSchema;
const CardsDeleteResponseSchema = z.object({
	_value: z.string().nullable().optional(),
});
const CardsMoveResponseSchema = TrelloCardSchema;

const MembersGetResponseSchema = TrelloMemberSchema;
const MembersListResponseSchema = z.array(
	TrelloMemberSchema.extend({
		memberType: z.string().optional(),
	}).passthrough(),
);

const LabelsListResponseSchema = z.array(TrelloLabelSchema);
const LabelsCreateResponseSchema = TrelloLabelSchema;
const LabelsUpdateResponseSchema = TrelloLabelSchema;
const LabelsDeleteResponseSchema = z.object({
	_value: z.string().nullable().optional(),
});

const ChecklistsGetResponseSchema = TrelloChecklistSchema;
const ChecklistsCreateResponseSchema = TrelloChecklistSchema;
const ChecklistsDeleteResponseSchema = z.object({
	_value: z.string().nullable().optional(),
});

// ── Endpoint I/O Maps ─────────────────────────────────────────────────────────

export const TrelloEndpointInputSchemas = {
	boardsGet: BoardsGetInputSchema,
	boardsList: BoardsListInputSchema,
	boardsCreate: BoardsCreateInputSchema,
	boardsUpdate: BoardsUpdateInputSchema,
	boardsDelete: BoardsDeleteInputSchema,
	listsGet: ListsGetInputSchema,
	listsList: ListsListInputSchema,
	listsCreate: ListsCreateInputSchema,
	listsUpdate: ListsUpdateInputSchema,
	listsArchive: ListsArchiveInputSchema,
	cardsGet: CardsGetInputSchema,
	cardsList: CardsListInputSchema,
	cardsCreate: CardsCreateInputSchema,
	cardsUpdate: CardsUpdateInputSchema,
	cardsDelete: CardsDeleteInputSchema,
	cardsMove: CardsMoveInputSchema,
	membersGet: MembersGetInputSchema,
	membersList: MembersListInputSchema,
	labelsList: LabelsListInputSchema,
	labelsCreate: LabelsCreateInputSchema,
	labelsUpdate: LabelsUpdateInputSchema,
	labelsDelete: LabelsDeleteInputSchema,
	checklistsGet: ChecklistsGetInputSchema,
	checklistsCreate: ChecklistsCreateInputSchema,
	checklistsDelete: ChecklistsDeleteInputSchema,
} as const;

export const TrelloEndpointOutputSchemas = {
	boardsGet: BoardsGetResponseSchema,
	boardsList: BoardsListResponseSchema,
	boardsCreate: BoardsCreateResponseSchema,
	boardsUpdate: BoardsUpdateResponseSchema,
	boardsDelete: BoardsDeleteResponseSchema,
	listsGet: ListsGetResponseSchema,
	listsList: ListsListResponseSchema,
	listsCreate: ListsCreateResponseSchema,
	listsUpdate: ListsUpdateResponseSchema,
	listsArchive: ListsArchiveResponseSchema,
	cardsGet: CardsGetResponseSchema,
	cardsList: CardsListResponseSchema,
	cardsCreate: CardsCreateResponseSchema,
	cardsUpdate: CardsUpdateResponseSchema,
	cardsDelete: CardsDeleteResponseSchema,
	cardsMove: CardsMoveResponseSchema,
	membersGet: MembersGetResponseSchema,
	membersList: MembersListResponseSchema,
	labelsList: LabelsListResponseSchema,
	labelsCreate: LabelsCreateResponseSchema,
	labelsUpdate: LabelsUpdateResponseSchema,
	labelsDelete: LabelsDeleteResponseSchema,
	checklistsGet: ChecklistsGetResponseSchema,
	checklistsCreate: ChecklistsCreateResponseSchema,
	checklistsDelete: ChecklistsDeleteResponseSchema,
} as const;

export type TrelloEndpointInputs = {
	[K in keyof typeof TrelloEndpointInputSchemas]: z.infer<
		(typeof TrelloEndpointInputSchemas)[K]
	>;
};

export type TrelloEndpointOutputs = {
	[K in keyof typeof TrelloEndpointOutputSchemas]: z.infer<
		(typeof TrelloEndpointOutputSchemas)[K]
	>;
};

export type BoardsGetInput = TrelloEndpointInputs['boardsGet'];
export type BoardsListInput = TrelloEndpointInputs['boardsList'];
export type BoardsCreateInput = TrelloEndpointInputs['boardsCreate'];
export type BoardsUpdateInput = TrelloEndpointInputs['boardsUpdate'];
export type BoardsDeleteInput = TrelloEndpointInputs['boardsDelete'];
export type ListsGetInput = TrelloEndpointInputs['listsGet'];
export type ListsListInput = TrelloEndpointInputs['listsList'];
export type ListsCreateInput = TrelloEndpointInputs['listsCreate'];
export type ListsUpdateInput = TrelloEndpointInputs['listsUpdate'];
export type ListsArchiveInput = TrelloEndpointInputs['listsArchive'];
export type CardsGetInput = TrelloEndpointInputs['cardsGet'];
export type CardsListInput = TrelloEndpointInputs['cardsList'];
export type CardsCreateInput = TrelloEndpointInputs['cardsCreate'];
export type CardsUpdateInput = TrelloEndpointInputs['cardsUpdate'];
export type CardsDeleteInput = TrelloEndpointInputs['cardsDelete'];
export type CardsMoveInput = TrelloEndpointInputs['cardsMove'];
export type MembersGetInput = TrelloEndpointInputs['membersGet'];
export type MembersListInput = TrelloEndpointInputs['membersList'];
export type LabelsListInput = TrelloEndpointInputs['labelsList'];
export type LabelsCreateInput = TrelloEndpointInputs['labelsCreate'];
export type LabelsUpdateInput = TrelloEndpointInputs['labelsUpdate'];
export type LabelsDeleteInput = TrelloEndpointInputs['labelsDelete'];
export type ChecklistsGetInput = TrelloEndpointInputs['checklistsGet'];
export type ChecklistsCreateInput = TrelloEndpointInputs['checklistsCreate'];
export type ChecklistsDeleteInput = TrelloEndpointInputs['checklistsDelete'];

export type BoardsGetResponse = TrelloEndpointOutputs['boardsGet'];
export type BoardsListResponse = TrelloEndpointOutputs['boardsList'];
export type BoardsCreateResponse = TrelloEndpointOutputs['boardsCreate'];
export type BoardsUpdateResponse = TrelloEndpointOutputs['boardsUpdate'];
export type BoardsDeleteResponse = TrelloEndpointOutputs['boardsDelete'];
export type ListsGetResponse = TrelloEndpointOutputs['listsGet'];
export type ListsListResponse = TrelloEndpointOutputs['listsList'];
export type ListsCreateResponse = TrelloEndpointOutputs['listsCreate'];
export type ListsUpdateResponse = TrelloEndpointOutputs['listsUpdate'];
export type ListsArchiveResponse = TrelloEndpointOutputs['listsArchive'];
export type CardsGetResponse = TrelloEndpointOutputs['cardsGet'];
export type CardsListResponse = TrelloEndpointOutputs['cardsList'];
export type CardsCreateResponse = TrelloEndpointOutputs['cardsCreate'];
export type CardsUpdateResponse = TrelloEndpointOutputs['cardsUpdate'];
export type CardsDeleteResponse = TrelloEndpointOutputs['cardsDelete'];
export type CardsMoveResponse = TrelloEndpointOutputs['cardsMove'];
export type MembersGetResponse = TrelloEndpointOutputs['membersGet'];
export type MembersListResponse = TrelloEndpointOutputs['membersList'];
export type LabelsListResponse = TrelloEndpointOutputs['labelsList'];
export type LabelsCreateResponse = TrelloEndpointOutputs['labelsCreate'];
export type LabelsUpdateResponse = TrelloEndpointOutputs['labelsUpdate'];
export type LabelsDeleteResponse = TrelloEndpointOutputs['labelsDelete'];
export type ChecklistsGetResponse = TrelloEndpointOutputs['checklistsGet'];
export type ChecklistsCreateResponse =
	TrelloEndpointOutputs['checklistsCreate'];
export type ChecklistsDeleteResponse =
	TrelloEndpointOutputs['checklistsDelete'];
