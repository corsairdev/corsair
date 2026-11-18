import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	boardsCopy,
	boardsCreate,
	boardsGet,
	boardsList,
	boardsRemove,
	boardsUpdate,
	cardsCreate,
	cardsUpdate,
	connectorsCreate,
	connectorsGet,
	connectorsList,
	connectorsRemove,
	connectorsUpdate,
	embedsCreate,
	embedsUpdate,
	framesCreate,
	framesUpdate,
	itemsByTag,
	itemsGet,
	itemsList,
	itemsRemove,
	membersGet,
	membersList,
	membersRemove,
	membersShare,
	membersUpdate,
	shapesCreate,
	shapesUpdate,
	stickyNotesCreate,
	stickyNotesUpdate,
	tagsAttach,
	tagsCreate,
	tagsGet,
	tagsList,
	tagsOfItem,
	tagsRemove,
	tagsRemoveFromItem,
	tagsUpdate,
	textsCreate,
	textsUpdate,
} from './endpoints';
import type {
	MiroEndpointInputs,
	MiroEndpointOutputs,
} from './endpoints/types';
import {
	MiroEndpointInputSchemas,
	MiroEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { MiroSchema } from './schema';

export type MiroPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalMiroPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof miroEndpointsNested>;
};

export type MiroContext = CorsairPluginContext<
	typeof MiroSchema,
	MiroPluginOptions
>;

export type MiroKeyBuilderContext = KeyBuilderContext<MiroPluginOptions>;

export type MiroBoundEndpoints = BindEndpoints<typeof miroEndpointsNested>;

type MiroEndpoint<K extends keyof MiroEndpointOutputs> = CorsairEndpoint<
	MiroContext,
	MiroEndpointInputs[K],
	MiroEndpointOutputs[K]
>;

export type MiroEndpoints = {
	boardsList: MiroEndpoint<'boardsList'>;
	boardsCreate: MiroEndpoint<'boardsCreate'>;
	boardsGet: MiroEndpoint<'boardsGet'>;
	boardsUpdate: MiroEndpoint<'boardsUpdate'>;
	boardsRemove: MiroEndpoint<'boardsRemove'>;
	boardsCopy: MiroEndpoint<'boardsCopy'>;
	membersList: MiroEndpoint<'membersList'>;
	membersShare: MiroEndpoint<'membersShare'>;
	membersGet: MiroEndpoint<'membersGet'>;
	membersUpdate: MiroEndpoint<'membersUpdate'>;
	membersRemove: MiroEndpoint<'membersRemove'>;
	itemsList: MiroEndpoint<'itemsList'>;
	itemsGet: MiroEndpoint<'itemsGet'>;
	itemsRemove: MiroEndpoint<'itemsRemove'>;
	stickyNotesCreate: MiroEndpoint<'stickyNotesCreate'>;
	stickyNotesUpdate: MiroEndpoint<'stickyNotesUpdate'>;
	shapesCreate: MiroEndpoint<'shapesCreate'>;
	shapesUpdate: MiroEndpoint<'shapesUpdate'>;
	cardsCreate: MiroEndpoint<'cardsCreate'>;
	cardsUpdate: MiroEndpoint<'cardsUpdate'>;
	textsCreate: MiroEndpoint<'textsCreate'>;
	textsUpdate: MiroEndpoint<'textsUpdate'>;
	framesCreate: MiroEndpoint<'framesCreate'>;
	framesUpdate: MiroEndpoint<'framesUpdate'>;
	embedsCreate: MiroEndpoint<'embedsCreate'>;
	embedsUpdate: MiroEndpoint<'embedsUpdate'>;
	connectorsList: MiroEndpoint<'connectorsList'>;
	connectorsCreate: MiroEndpoint<'connectorsCreate'>;
	connectorsGet: MiroEndpoint<'connectorsGet'>;
	connectorsUpdate: MiroEndpoint<'connectorsUpdate'>;
	connectorsRemove: MiroEndpoint<'connectorsRemove'>;
	tagsList: MiroEndpoint<'tagsList'>;
	tagsCreate: MiroEndpoint<'tagsCreate'>;
	tagsGet: MiroEndpoint<'tagsGet'>;
	tagsUpdate: MiroEndpoint<'tagsUpdate'>;
	tagsRemove: MiroEndpoint<'tagsRemove'>;
	tagsAttach: MiroEndpoint<'tagsAttach'>;
	tagsRemoveFromItem: MiroEndpoint<'tagsRemoveFromItem'>;
	tagsOfItem: MiroEndpoint<'tagsOfItem'>;
	itemsByTag: MiroEndpoint<'itemsByTag'>;
};

const miroEndpointsNested = {
	boards: {
		list: boardsList,
		create: boardsCreate,
		get: boardsGet,
		update: boardsUpdate,
		remove: boardsRemove,
		copy: boardsCopy,
	},
	members: {
		list: membersList,
		share: membersShare,
		get: membersGet,
		update: membersUpdate,
		remove: membersRemove,
	},
	items: {
		list: itemsList,
		get: itemsGet,
		remove: itemsRemove,
	},
	stickyNotes: {
		create: stickyNotesCreate,
		update: stickyNotesUpdate,
	},
	shapes: {
		create: shapesCreate,
		update: shapesUpdate,
	},
	cards: {
		create: cardsCreate,
		update: cardsUpdate,
	},
	texts: {
		create: textsCreate,
		update: textsUpdate,
	},
	frames: {
		create: framesCreate,
		update: framesUpdate,
	},
	embeds: {
		create: embedsCreate,
		update: embedsUpdate,
	},
	connectors: {
		list: connectorsList,
		create: connectorsCreate,
		get: connectorsGet,
		update: connectorsUpdate,
		remove: connectorsRemove,
	},
	tags: {
		list: tagsList,
		create: tagsCreate,
		get: tagsGet,
		update: tagsUpdate,
		remove: tagsRemove,
		attach: tagsAttach,
		removeFromItem: tagsRemoveFromItem,
		ofItem: tagsOfItem,
		items: itemsByTag,
	},
} as const;

export const miroEndpointSchemas = {
	'boards.list': {
		input: MiroEndpointInputSchemas.boardsList,
		output: MiroEndpointOutputSchemas.boardsList,
	},
	'boards.create': {
		input: MiroEndpointInputSchemas.boardsCreate,
		output: MiroEndpointOutputSchemas.boardsCreate,
	},
	'boards.get': {
		input: MiroEndpointInputSchemas.boardsGet,
		output: MiroEndpointOutputSchemas.boardsGet,
	},
	'boards.update': {
		input: MiroEndpointInputSchemas.boardsUpdate,
		output: MiroEndpointOutputSchemas.boardsUpdate,
	},
	'boards.remove': {
		input: MiroEndpointInputSchemas.boardsRemove,
		output: MiroEndpointOutputSchemas.boardsRemove,
	},
	'boards.copy': {
		input: MiroEndpointInputSchemas.boardsCopy,
		output: MiroEndpointOutputSchemas.boardsCopy,
	},
	'members.list': {
		input: MiroEndpointInputSchemas.membersList,
		output: MiroEndpointOutputSchemas.membersList,
	},
	'members.share': {
		input: MiroEndpointInputSchemas.membersShare,
		output: MiroEndpointOutputSchemas.membersShare,
	},
	'members.get': {
		input: MiroEndpointInputSchemas.membersGet,
		output: MiroEndpointOutputSchemas.membersGet,
	},
	'members.update': {
		input: MiroEndpointInputSchemas.membersUpdate,
		output: MiroEndpointOutputSchemas.membersUpdate,
	},
	'members.remove': {
		input: MiroEndpointInputSchemas.membersRemove,
		output: MiroEndpointOutputSchemas.membersRemove,
	},
	'items.list': {
		input: MiroEndpointInputSchemas.itemsList,
		output: MiroEndpointOutputSchemas.itemsList,
	},
	'items.get': {
		input: MiroEndpointInputSchemas.itemsGet,
		output: MiroEndpointOutputSchemas.itemsGet,
	},
	'items.remove': {
		input: MiroEndpointInputSchemas.itemsRemove,
		output: MiroEndpointOutputSchemas.itemsRemove,
	},
	'stickyNotes.create': {
		input: MiroEndpointInputSchemas.stickyNotesCreate,
		output: MiroEndpointOutputSchemas.stickyNotesCreate,
	},
	'stickyNotes.update': {
		input: MiroEndpointInputSchemas.stickyNotesUpdate,
		output: MiroEndpointOutputSchemas.stickyNotesUpdate,
	},
	'shapes.create': {
		input: MiroEndpointInputSchemas.shapesCreate,
		output: MiroEndpointOutputSchemas.shapesCreate,
	},
	'shapes.update': {
		input: MiroEndpointInputSchemas.shapesUpdate,
		output: MiroEndpointOutputSchemas.shapesUpdate,
	},
	'cards.create': {
		input: MiroEndpointInputSchemas.cardsCreate,
		output: MiroEndpointOutputSchemas.cardsCreate,
	},
	'cards.update': {
		input: MiroEndpointInputSchemas.cardsUpdate,
		output: MiroEndpointOutputSchemas.cardsUpdate,
	},
	'texts.create': {
		input: MiroEndpointInputSchemas.textsCreate,
		output: MiroEndpointOutputSchemas.textsCreate,
	},
	'texts.update': {
		input: MiroEndpointInputSchemas.textsUpdate,
		output: MiroEndpointOutputSchemas.textsUpdate,
	},
	'frames.create': {
		input: MiroEndpointInputSchemas.framesCreate,
		output: MiroEndpointOutputSchemas.framesCreate,
	},
	'frames.update': {
		input: MiroEndpointInputSchemas.framesUpdate,
		output: MiroEndpointOutputSchemas.framesUpdate,
	},
	'embeds.create': {
		input: MiroEndpointInputSchemas.embedsCreate,
		output: MiroEndpointOutputSchemas.embedsCreate,
	},
	'embeds.update': {
		input: MiroEndpointInputSchemas.embedsUpdate,
		output: MiroEndpointOutputSchemas.embedsUpdate,
	},
	'connectors.list': {
		input: MiroEndpointInputSchemas.connectorsList,
		output: MiroEndpointOutputSchemas.connectorsList,
	},
	'connectors.create': {
		input: MiroEndpointInputSchemas.connectorsCreate,
		output: MiroEndpointOutputSchemas.connectorsCreate,
	},
	'connectors.get': {
		input: MiroEndpointInputSchemas.connectorsGet,
		output: MiroEndpointOutputSchemas.connectorsGet,
	},
	'connectors.update': {
		input: MiroEndpointInputSchemas.connectorsUpdate,
		output: MiroEndpointOutputSchemas.connectorsUpdate,
	},
	'connectors.remove': {
		input: MiroEndpointInputSchemas.connectorsRemove,
		output: MiroEndpointOutputSchemas.connectorsRemove,
	},
	'tags.list': {
		input: MiroEndpointInputSchemas.tagsList,
		output: MiroEndpointOutputSchemas.tagsList,
	},
	'tags.create': {
		input: MiroEndpointInputSchemas.tagsCreate,
		output: MiroEndpointOutputSchemas.tagsCreate,
	},
	'tags.get': {
		input: MiroEndpointInputSchemas.tagsGet,
		output: MiroEndpointOutputSchemas.tagsGet,
	},
	'tags.update': {
		input: MiroEndpointInputSchemas.tagsUpdate,
		output: MiroEndpointOutputSchemas.tagsUpdate,
	},
	'tags.remove': {
		input: MiroEndpointInputSchemas.tagsRemove,
		output: MiroEndpointOutputSchemas.tagsRemove,
	},
	'tags.attach': {
		input: MiroEndpointInputSchemas.tagsAttach,
		output: MiroEndpointOutputSchemas.tagsAttach,
	},
	'tags.removeFromItem': {
		input: MiroEndpointInputSchemas.tagsRemoveFromItem,
		output: MiroEndpointOutputSchemas.tagsRemoveFromItem,
	},
	'tags.ofItem': {
		input: MiroEndpointInputSchemas.tagsOfItem,
		output: MiroEndpointOutputSchemas.tagsOfItem,
	},
	'tags.items': {
		input: MiroEndpointInputSchemas.itemsByTag,
		output: MiroEndpointOutputSchemas.itemsByTag,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof miroEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const miroEndpointMeta = {
	'boards.list': {
		riskLevel: 'read',
		description:
			'List the boards the token can reach, filtered by team, project, owner or name, with offset paging',
	},
	'boards.create': {
		riskLevel: 'write',
		description:
			'Create a board with a name, description and sharing policy, optionally in a given team or project',
	},
	'boards.get': {
		riskLevel: 'read',
		description:
			'Read one board: its name, owner, team, project, sharing policy and the membership of the calling user',
	},
	'boards.update': {
		riskLevel: 'write',
		description:
			'Change a board name, description or sharing policy; the policy controls who can view, comment and edit',
	},
	'boards.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a board and everything on it; Miro moves it to Trash, where an owner can restore it in the Miro UI for 90 days, but there is no API call to do so',
		irreversible: true,
	},
	'boards.copy': {
		riskLevel: 'write',
		description:
			'Copy an existing board, including its content, into a new board with its own name and team',
	},
	'members.list': {
		riskLevel: 'read',
		description: 'List who has access to a board, with their role',
	},
	'members.share': {
		riskLevel: 'write',
		description:
			'Invite email addresses to a board with a role, which grants them access to its content',
	},
	'members.get': {
		riskLevel: 'read',
		description: "Read one board member's role and details",
	},
	'members.update': {
		riskLevel: 'write',
		description:
			"Change a board member's role, for example promoting a viewer to an editor",
	},
	'members.remove': {
		riskLevel: 'destructive',
		description:
			"Remove a member's access to a board; their role cannot be restored by another call",
		irreversible: true,
	},
	'items.list': {
		riskLevel: 'read',
		description:
			'Page through a board items, optionally only one type or only what sits inside a frame',
	},
	'items.get': {
		riskLevel: 'read',
		description:
			'Read one item by id, whatever its kind: sticky note, shape, card, text, frame, embed or connector',
	},
	'items.remove': {
		riskLevel: 'destructive',
		description: 'Delete any board item by id; its content cannot be restored',
		irreversible: true,
	},
	'stickyNotes.create': {
		riskLevel: 'write',
		description:
			'Add a sticky note with text, shape and colour at a position, optionally inside a frame',
	},
	'stickyNotes.update': {
		riskLevel: 'write',
		description: 'Change a sticky note text, shape, colour, position or size',
	},
	'shapes.create': {
		riskLevel: 'write',
		description:
			'Draw a shape such as a rectangle, circle or flowchart node, with text and styling, for diagrams',
	},
	'shapes.update': {
		riskLevel: 'write',
		description: 'Change a shape text, style, position or size',
	},
	'cards.create': {
		riskLevel: 'write',
		description:
			'Add a card with a title, description, due date and assignee, for task boards',
	},
	'cards.update': {
		riskLevel: 'write',
		description:
			'Change a card title, description, due date, assignee or position',
	},
	'texts.create': {
		riskLevel: 'write',
		description: 'Add a text item, for labels and annotations',
	},
	'texts.update': {
		riskLevel: 'write',
		description: 'Change a text item content, style, position or size',
	},
	'frames.create': {
		riskLevel: 'write',
		description:
			'Add a frame, which groups other items into a region such as a section or a slide',
	},
	'frames.update': {
		riskLevel: 'write',
		description:
			'Change a frame title, position, size or whether it shows its content',
	},
	'embeds.create': {
		riskLevel: 'write',
		description: 'Embed content from a URL, such as a video or a web page',
	},
	'embeds.update': {
		riskLevel: 'write',
		description: 'Change an embed URL, mode, position or size',
	},
	'connectors.list': {
		riskLevel: 'read',
		description:
			'Page through the connectors on a board, with their endpoints and style',
	},
	'connectors.create': {
		riskLevel: 'write',
		description:
			'Connect two existing items with an arrow, line style, caps and captions; both endpoints must already exist',
	},
	'connectors.get': {
		riskLevel: 'read',
		description: 'Read one connector by id',
	},
	'connectors.update': {
		riskLevel: 'write',
		description: 'Change a connector shape, stroke style or captions',
	},
	'connectors.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a connector; the two items it joined stay on the board',
		irreversible: true,
	},
	'tags.list': {
		riskLevel: 'read',
		description: 'List the tags defined on a board, with their colours',
	},
	'tags.create': {
		riskLevel: 'write',
		description:
			'Create a tag with a title and colour for categorising board items',
	},
	'tags.get': {
		riskLevel: 'read',
		description: 'Read one tag by id, with its title, colour and links',
	},
	'tags.update': {
		riskLevel: 'write',
		description: 'Change a tag title or colour',
	},
	'tags.remove': {
		riskLevel: 'destructive',
		description:
			'Delete a tag from the board; it is detached from every item that carried it',
		irreversible: true,
	},
	'tags.attach': {
		riskLevel: 'write',
		description:
			'Attach an existing tag to an item; card and sticky items accept up to eight',
	},
	'tags.removeFromItem': {
		riskLevel: 'destructive',
		description:
			'Detach a tag from one item; the tag itself stays on the board',
		irreversible: true,
	},
	'tags.ofItem': {
		riskLevel: 'read',
		description: 'List the tags attached to one item',
	},
	'tags.items': {
		riskLevel: 'read',
		description: 'List the items that carry a given tag, with offset paging',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof miroEndpointsNested>;

export type BaseMiroPlugin<T extends MiroPluginOptions> = CorsairPlugin<
	'miro',
	typeof MiroSchema,
	typeof miroEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalMiroPlugin = BaseMiroPlugin<MiroPluginOptions>;

export type ExternalMiroPlugin<T extends MiroPluginOptions> = BaseMiroPlugin<T>;

export function miro<const T extends MiroPluginOptions>(
	incomingOptions: MiroPluginOptions & T = {} as MiroPluginOptions & T,
): ExternalMiroPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'miro',
		schema: MiroSchema,
		options: options,
		hooks: options.hooks,
		endpoints: miroEndpointsNested,
		// Miro sends no signed webhook for boards; board events are only
		// available through the Miro app framework, not the REST API, so there is
		// nothing to receive here.
		webhooks: {},
		endpointMeta: miroEndpointMeta,
		endpointSchemas: miroEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: MiroKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('miro', ctx.authType ?? 'api_key');
		},
	} satisfies InternalMiroPlugin;
}

export { MiroAPIError } from './client';

export type {
	BoardsCopyInput,
	BoardsCreateInput,
	BoardsGetInput,
	BoardsListInput,
	BoardsListResponse,
	BoardsRemoveInput,
	BoardsUpdateInput,
	CardsCreateInput,
	CardsUpdateInput,
	ConnectorsCreateInput,
	ConnectorsGetInput,
	ConnectorsListInput,
	ConnectorsListResponse,
	ConnectorsRemoveInput,
	ConnectorsUpdateInput,
	EmbedsCreateInput,
	EmbedsUpdateInput,
	FramesCreateInput,
	FramesUpdateInput,
	ItemsByTagInput,
	ItemsByTagResponse,
	ItemsGetInput,
	ItemsListInput,
	ItemsListResponse,
	ItemsRemoveInput,
	MembersGetInput,
	MembersListInput,
	MembersListResponse,
	MembersRemoveInput,
	MembersShareInput,
	MembersShareResponse,
	MembersUpdateInput,
	MiroBoard,
	MiroBoardMember,
	MiroCard,
	MiroConnector,
	MiroEmbed,
	MiroEndpointInputs,
	MiroEndpointOutputs,
	MiroFrame,
	MiroShape,
	MiroStickyNote,
	MiroTag,
	MiroTextItem,
	ShapesCreateInput,
	ShapesUpdateInput,
	StickyNotesCreateInput,
	StickyNotesUpdateInput,
	TagsAttachInput,
	TagsCreateInput,
	TagsGetInput,
	TagsListInput,
	TagsListResponse,
	TagsOfItemInput,
	TagsOfItemResponse,
	TagsRemoveFromItemInput,
	TagsRemoveInput,
	TagsUpdateInput,
	TextsCreateInput,
	TextsUpdateInput,
} from './endpoints/types';
