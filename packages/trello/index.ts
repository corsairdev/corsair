import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { Boards, Cards, Checklists, Labels, Lists, Members } from './endpoints';
import type {
	TrelloEndpointInputs,
	TrelloEndpointOutputs,
} from './endpoints/types';
import {
	TrelloEndpointInputSchemas,
	TrelloEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { TrelloSchema } from './schema';
import {
	CardWebhooks,
	CommentWebhooks,
	ListWebhooks,
	MemberWebhooks,
} from './webhooks';
import type {
	TrelloCardCreatedEvent,
	TrelloCardUpdatedEvent,
	TrelloCommentCreatedEvent,
	TrelloListCreatedEvent,
	TrelloListUpdatedEvent,
	TrelloMemberAddedToCardEvent,
	TrelloWebhookOutputs,
} from './webhooks/types';
import {
	TrelloCardCreatedPayloadSchema,
	TrelloCardUpdatedPayloadSchema,
	TrelloCommentCreatedPayloadSchema,
	TrelloListCreatedPayloadSchema,
	TrelloListUpdatedPayloadSchema,
	TrelloMemberAddedToCardPayloadSchema,
} from './webhooks/types';

export type TrelloPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	trelloApiKey?: string;
	webhookSecret?: string;
	webhookCallbackUrl?: string;
	hooks?: InternalTrelloPlugin['hooks'];
	webhookHooks?: InternalTrelloPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof trelloEndpointsNested>;
};

export type TrelloContext = CorsairPluginContext<
	typeof TrelloSchema,
	TrelloPluginOptions
>;

export type TrelloKeyBuilderContext = KeyBuilderContext<TrelloPluginOptions>;

export type TrelloBoundEndpoints = BindEndpoints<typeof trelloEndpointsNested>;

type TrelloEndpoint<K extends keyof TrelloEndpointOutputs> = CorsairEndpoint<
	TrelloContext,
	TrelloEndpointInputs[K],
	TrelloEndpointOutputs[K]
>;

export type TrelloEndpoints = {
	boardsGet: TrelloEndpoint<'boardsGet'>;
	boardsList: TrelloEndpoint<'boardsList'>;
	boardsCreate: TrelloEndpoint<'boardsCreate'>;
	boardsUpdate: TrelloEndpoint<'boardsUpdate'>;
	boardsDelete: TrelloEndpoint<'boardsDelete'>;
	listsGet: TrelloEndpoint<'listsGet'>;
	listsList: TrelloEndpoint<'listsList'>;
	listsCreate: TrelloEndpoint<'listsCreate'>;
	listsUpdate: TrelloEndpoint<'listsUpdate'>;
	listsArchive: TrelloEndpoint<'listsArchive'>;
	cardsGet: TrelloEndpoint<'cardsGet'>;
	cardsList: TrelloEndpoint<'cardsList'>;
	cardsCreate: TrelloEndpoint<'cardsCreate'>;
	cardsUpdate: TrelloEndpoint<'cardsUpdate'>;
	cardsDelete: TrelloEndpoint<'cardsDelete'>;
	cardsMove: TrelloEndpoint<'cardsMove'>;
	membersGet: TrelloEndpoint<'membersGet'>;
	membersList: TrelloEndpoint<'membersList'>;
	labelsList: TrelloEndpoint<'labelsList'>;
	labelsCreate: TrelloEndpoint<'labelsCreate'>;
	labelsUpdate: TrelloEndpoint<'labelsUpdate'>;
	labelsDelete: TrelloEndpoint<'labelsDelete'>;
	checklistsGet: TrelloEndpoint<'checklistsGet'>;
	checklistsCreate: TrelloEndpoint<'checklistsCreate'>;
	checklistsDelete: TrelloEndpoint<'checklistsDelete'>;
};

type TrelloWebhook<
	K extends keyof TrelloWebhookOutputs,
	TEvent,
> = CorsairWebhook<TrelloContext, TEvent, TrelloWebhookOutputs[K]>;

export type TrelloWebhooks = {
	cardCreated: TrelloWebhook<'cardCreated', TrelloCardCreatedEvent>;
	cardUpdated: TrelloWebhook<'cardUpdated', TrelloCardUpdatedEvent>;
	memberAddedToCard: TrelloWebhook<
		'memberAddedToCard',
		TrelloMemberAddedToCardEvent
	>;
	listCreated: TrelloWebhook<'listCreated', TrelloListCreatedEvent>;
	listUpdated: TrelloWebhook<'listUpdated', TrelloListUpdatedEvent>;
	commentCreated: TrelloWebhook<'commentCreated', TrelloCommentCreatedEvent>;
};

export type TrelloBoundWebhooks = BindWebhooks<TrelloWebhooks>;

const trelloEndpointsNested = {
	boards: {
		get: Boards.get,
		list: Boards.list,
		create: Boards.create,
		update: Boards.update,
		delete: Boards.del,
	},
	lists: {
		get: Lists.get,
		list: Lists.list,
		create: Lists.create,
		update: Lists.update,
		archive: Lists.archive,
	},
	cards: {
		get: Cards.get,
		list: Cards.list,
		create: Cards.create,
		update: Cards.update,
		delete: Cards.del,
		move: Cards.move,
	},
	members: {
		get: Members.get,
		list: Members.list,
	},
	labels: {
		list: Labels.list,
		create: Labels.create,
		update: Labels.update,
		delete: Labels.del,
	},
	checklists: {
		get: Checklists.get,
		create: Checklists.create,
		delete: Checklists.del,
	},
} as const;

const trelloWebhooksNested = {
	cards: {
		cardCreated: CardWebhooks.cardCreated,
		cardUpdated: CardWebhooks.cardUpdated,
	},
	members: {
		memberAddedToCard: MemberWebhooks.memberAddedToCard,
	},
	lists: {
		listCreated: ListWebhooks.listCreated,
		listUpdated: ListWebhooks.listUpdated,
	},
	comments: {
		commentCreated: CommentWebhooks.commentCreated,
	},
} as const;

export const trelloEndpointSchemas = {
	'boards.get': {
		input: TrelloEndpointInputSchemas.boardsGet,
		output: TrelloEndpointOutputSchemas.boardsGet,
	},
	'boards.list': {
		input: TrelloEndpointInputSchemas.boardsList,
		output: TrelloEndpointOutputSchemas.boardsList,
	},
	'boards.create': {
		input: TrelloEndpointInputSchemas.boardsCreate,
		output: TrelloEndpointOutputSchemas.boardsCreate,
	},
	'boards.update': {
		input: TrelloEndpointInputSchemas.boardsUpdate,
		output: TrelloEndpointOutputSchemas.boardsUpdate,
	},
	'boards.delete': {
		input: TrelloEndpointInputSchemas.boardsDelete,
		output: TrelloEndpointOutputSchemas.boardsDelete,
	},
	'lists.get': {
		input: TrelloEndpointInputSchemas.listsGet,
		output: TrelloEndpointOutputSchemas.listsGet,
	},
	'lists.list': {
		input: TrelloEndpointInputSchemas.listsList,
		output: TrelloEndpointOutputSchemas.listsList,
	},
	'lists.create': {
		input: TrelloEndpointInputSchemas.listsCreate,
		output: TrelloEndpointOutputSchemas.listsCreate,
	},
	'lists.update': {
		input: TrelloEndpointInputSchemas.listsUpdate,
		output: TrelloEndpointOutputSchemas.listsUpdate,
	},
	'lists.archive': {
		input: TrelloEndpointInputSchemas.listsArchive,
		output: TrelloEndpointOutputSchemas.listsArchive,
	},
	'cards.get': {
		input: TrelloEndpointInputSchemas.cardsGet,
		output: TrelloEndpointOutputSchemas.cardsGet,
	},
	'cards.list': {
		input: TrelloEndpointInputSchemas.cardsList,
		output: TrelloEndpointOutputSchemas.cardsList,
	},
	'cards.create': {
		input: TrelloEndpointInputSchemas.cardsCreate,
		output: TrelloEndpointOutputSchemas.cardsCreate,
	},
	'cards.update': {
		input: TrelloEndpointInputSchemas.cardsUpdate,
		output: TrelloEndpointOutputSchemas.cardsUpdate,
	},
	'cards.delete': {
		input: TrelloEndpointInputSchemas.cardsDelete,
		output: TrelloEndpointOutputSchemas.cardsDelete,
	},
	'cards.move': {
		input: TrelloEndpointInputSchemas.cardsMove,
		output: TrelloEndpointOutputSchemas.cardsMove,
	},
	'members.get': {
		input: TrelloEndpointInputSchemas.membersGet,
		output: TrelloEndpointOutputSchemas.membersGet,
	},
	'members.list': {
		input: TrelloEndpointInputSchemas.membersList,
		output: TrelloEndpointOutputSchemas.membersList,
	},
	'labels.list': {
		input: TrelloEndpointInputSchemas.labelsList,
		output: TrelloEndpointOutputSchemas.labelsList,
	},
	'labels.create': {
		input: TrelloEndpointInputSchemas.labelsCreate,
		output: TrelloEndpointOutputSchemas.labelsCreate,
	},
	'labels.update': {
		input: TrelloEndpointInputSchemas.labelsUpdate,
		output: TrelloEndpointOutputSchemas.labelsUpdate,
	},
	'labels.delete': {
		input: TrelloEndpointInputSchemas.labelsDelete,
		output: TrelloEndpointOutputSchemas.labelsDelete,
	},
	'checklists.get': {
		input: TrelloEndpointInputSchemas.checklistsGet,
		output: TrelloEndpointOutputSchemas.checklistsGet,
	},
	'checklists.create': {
		input: TrelloEndpointInputSchemas.checklistsCreate,
		output: TrelloEndpointOutputSchemas.checklistsCreate,
	},
	'checklists.delete': {
		input: TrelloEndpointInputSchemas.checklistsDelete,
		output: TrelloEndpointOutputSchemas.checklistsDelete,
	},
} as const;

const trelloWebhookSchemas = {
	'cards.cardCreated': {
		description: 'A card was created on a board',
		payload: TrelloCardCreatedPayloadSchema,
		response: TrelloCardCreatedPayloadSchema,
	},
	'cards.cardUpdated': {
		description: 'A card was updated (name, desc, due date, labels, etc.)',
		payload: TrelloCardUpdatedPayloadSchema,
		response: TrelloCardUpdatedPayloadSchema,
	},
	'members.memberAddedToCard': {
		description: 'A member was added to a card',
		payload: TrelloMemberAddedToCardPayloadSchema,
		response: TrelloMemberAddedToCardPayloadSchema,
	},
	'lists.listCreated': {
		description: 'A new list was created on a board',
		payload: TrelloListCreatedPayloadSchema,
		response: TrelloListCreatedPayloadSchema,
	},
	'lists.listUpdated': {
		description: 'A list was updated (name, closed status, etc.)',
		payload: TrelloListUpdatedPayloadSchema,
		response: TrelloListUpdatedPayloadSchema,
	},
	'comments.commentCreated': {
		description: 'A comment was added to a card',
		payload: TrelloCommentCreatedPayloadSchema,
		response: TrelloCommentCreatedPayloadSchema,
	},
} as const;

const trelloEndpointMeta = {
	'boards.get': { riskLevel: 'read', description: 'Get a board by ID' },
	'boards.list': { riskLevel: 'read', description: 'List boards for a member' },
	'boards.create': { riskLevel: 'write', description: 'Create a new board' },
	'boards.update': { riskLevel: 'write', description: 'Update a board' },
	'boards.delete': {
		riskLevel: 'destructive',
		description: 'Delete a board [DESTRUCTIVE]',
	},
	'lists.get': { riskLevel: 'read', description: 'Get a list by ID' },
	'lists.list': { riskLevel: 'read', description: 'List all lists on a board' },
	'lists.create': {
		riskLevel: 'write',
		description: 'Create a new list on a board',
	},
	'lists.update': { riskLevel: 'write', description: 'Update a list' },
	'lists.archive': {
		riskLevel: 'write',
		description: 'Archive (close) a list',
	},
	'cards.get': { riskLevel: 'read', description: 'Get a card by ID' },
	'cards.list': { riskLevel: 'read', description: 'List cards in a list' },
	'cards.create': { riskLevel: 'write', description: 'Create a new card' },
	'cards.update': { riskLevel: 'write', description: 'Update a card' },
	'cards.delete': {
		riskLevel: 'destructive',
		description: 'Delete a card [DESTRUCTIVE]',
	},
	'cards.move': {
		riskLevel: 'write',
		description: 'Move a card to a different list or board',
	},
	'members.get': {
		riskLevel: 'read',
		description: 'Get a member by ID or username',
	},
	'members.list': { riskLevel: 'read', description: 'List members of a board' },
	'labels.list': { riskLevel: 'read', description: 'List labels on a board' },
	'labels.create': {
		riskLevel: 'write',
		description: 'Create a label on a board',
	},
	'labels.update': { riskLevel: 'write', description: 'Update a label' },
	'labels.delete': {
		riskLevel: 'destructive',
		description: 'Delete a label [DESTRUCTIVE]',
	},
	'checklists.get': { riskLevel: 'read', description: 'Get a checklist by ID' },
	'checklists.create': {
		riskLevel: 'write',
		description: 'Create a checklist on a card',
	},
	'checklists.delete': {
		riskLevel: 'destructive',
		description: 'Delete a checklist [DESTRUCTIVE]',
	},
} satisfies RequiredPluginEndpointMeta<typeof trelloEndpointsNested>;

const defaultAuthType = 'api_key' as const;

export const trelloAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseTrelloPlugin<T extends TrelloPluginOptions> = CorsairPlugin<
	'trello',
	typeof TrelloSchema,
	typeof trelloEndpointsNested,
	typeof trelloWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalTrelloPlugin = BaseTrelloPlugin<TrelloPluginOptions>;

export type ExternalTrelloPlugin<T extends TrelloPluginOptions> =
	BaseTrelloPlugin<T>;

export function trello<const T extends TrelloPluginOptions>(
	// {} as TrelloPluginOptions & T: TypeScript cannot prove {} satisfies generic T without the
	// assertion; safe because every field in TrelloPluginOptions is optional
	incomingOptions: TrelloPluginOptions & T = {} as TrelloPluginOptions & T,
): ExternalTrelloPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'trello',
		schema: TrelloSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: trelloEndpointsNested,
		webhooks: trelloWebhooksNested,
		endpointMeta: trelloEndpointMeta,
		endpointSchemas: trelloEndpointSchemas,
		webhookSchemas: trelloWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			return 'x-trello-webhook' in headers;
		},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: TrelloKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					return '';
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					return '';
				}
				return res;
			}

			return '';
		},
	} satisfies InternalTrelloPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	CardCreatedData,
	CardUpdatedData,
	CommentCreatedData,
	ListCreatedData,
	ListUpdatedData,
	MemberAddedToCardData,
	TrelloCardCreatedEvent,
	TrelloCardUpdatedEvent,
	TrelloCommentCreatedEvent,
	TrelloListCreatedEvent,
	TrelloListUpdatedEvent,
	TrelloMemberAddedToCardEvent,
	TrelloMemberCreator,
	TrelloWebhookOutputs,
} from './webhooks/types';

export { createTrelloActionMatch } from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	BoardsCreateInput,
	BoardsCreateResponse,
	BoardsDeleteInput,
	BoardsDeleteResponse,
	BoardsGetInput,
	BoardsGetResponse,
	BoardsListInput,
	BoardsListResponse,
	BoardsUpdateInput,
	BoardsUpdateResponse,
	CardsCreateInput,
	CardsCreateResponse,
	CardsDeleteInput,
	CardsDeleteResponse,
	CardsGetInput,
	CardsGetResponse,
	CardsListInput,
	CardsListResponse,
	CardsMoveInput,
	CardsMoveResponse,
	CardsUpdateInput,
	CardsUpdateResponse,
	ChecklistsCreateInput,
	ChecklistsCreateResponse,
	ChecklistsDeleteInput,
	ChecklistsDeleteResponse,
	ChecklistsGetInput,
	ChecklistsGetResponse,
	LabelsCreateInput,
	LabelsCreateResponse,
	LabelsDeleteInput,
	LabelsDeleteResponse,
	LabelsListInput,
	LabelsListResponse,
	LabelsUpdateInput,
	LabelsUpdateResponse,
	ListsArchiveInput,
	ListsArchiveResponse,
	ListsCreateInput,
	ListsCreateResponse,
	ListsGetInput,
	ListsGetResponse,
	ListsListInput,
	ListsListResponse,
	ListsUpdateInput,
	ListsUpdateResponse,
	MembersGetInput,
	MembersGetResponse,
	MembersListInput,
	MembersListResponse,
	TrelloEndpointInputs,
	TrelloEndpointOutputs,
} from './endpoints/types';
