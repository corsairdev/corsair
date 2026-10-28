import type {
	AuthTypes,
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
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Accounts,
	Chats,
	Messages,
	Posts,
	RelationRequests,
	Users,
	WebhookEndpoints,
} from './endpoints';
import { unipileEndpointMeta as endpointMeta } from './endpoints/meta';
import type {
	UnipileEndpointInputs,
	UnipileEndpointOutputs,
} from './endpoints/types';
import {
	UnipileEndpointInputSchemas,
	UnipileEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { UnipileSchema } from './schema';
import {
	AccountWebhooks,
	MessageWebhooks,
	matchUnipilePluginWebhook,
	matchUnipileTenantWebhook,
	RelationWebhooks,
} from './webhooks';
import type { UnipileWebhookOutputs } from './webhooks/types';
import {
	AccountAddEventSchema,
	AccountLockedEventSchema,
	AccountReconnectEventSchema,
	AccountRemoveEventSchema,
	AccountStatusDegradedEventSchema,
	AccountStatusDisconnectedEventSchema,
	AccountStatusErroredEventSchema,
	AccountStatusPartialEventSchema,
	AccountStatusRunningEventSchema,
	AccountUnlockedEventSchema,
	MessageNewEventSchema,
	MessageReceiptReadEventSchema,
	RelationNewEventSchema,
} from './webhooks/types';

export type UnipilePluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Unipile API key (sent as X-API-KEY). Overrides the stored key. */
	key?: string;
	/** Signing secret of the Unipile webhook endpoint that points at Corsair. */
	webhookSecret?: string;
	hooks?: InternalUnipilePlugin['hooks'];
	webhookHooks?: InternalUnipilePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof unipileEndpointsNested>;
};

export type UnipileContext = CorsairPluginContext<
	typeof UnipileSchema,
	UnipilePluginOptions
>;

export type UnipileKeyBuilderContext = KeyBuilderContext<UnipilePluginOptions>;

export type UnipileBoundEndpoints = BindEndpoints<
	typeof unipileEndpointsNested
>;

type UnipileEndpoint<K extends keyof UnipileEndpointOutputs> = CorsairEndpoint<
	UnipileContext,
	UnipileEndpointInputs[K],
	UnipileEndpointOutputs[K]
>;

export type UnipileEndpoints = {
	[K in keyof UnipileEndpointOutputs]: UnipileEndpoint<K>;
};

export type UnipileWebhook<K extends keyof UnipileWebhookOutputs> =
	CorsairWebhook<
		UnipileContext,
		UnipileWebhookOutputs[K],
		UnipileWebhookOutputs[K]
	>;

export type UnipileWebhooks = {
	[K in keyof UnipileWebhookOutputs]: UnipileWebhook<K>;
};

export type UnipileBoundWebhooks = BindWebhooks<UnipileWebhooks>;

const unipileEndpointsNested = {
	accounts: {
		list: Accounts.list,
		get: Accounts.get,
		remove: Accounts.remove,
		createAuthLink: Accounts.createAuthLink,
	},
	users: {
		getProfile: Users.getProfile,
		visitProfile: Users.visitProfile,
		listRelations: Users.listRelations,
		getChat: Users.getChat,
		listReactions: Users.listReactions,
		listComments: Users.listComments,
	},
	relationRequests: {
		list: RelationRequests.list,
		create: RelationRequests.create,
		cancel: RelationRequests.cancel,
		accept: RelationRequests.accept,
	},
	chats: {
		list: Chats.list,
		get: Chats.get,
		start: Chats.start,
	},
	messages: {
		list: Messages.list,
		send: Messages.send,
	},
	posts: {
		list: Posts.list,
		listReactions: Posts.listReactions,
		listComments: Posts.listComments,
	},
	webhookEndpoints: {
		list: WebhookEndpoints.list,
		get: WebhookEndpoints.get,
		create: WebhookEndpoints.create,
		update: WebhookEndpoints.update,
		delete: WebhookEndpoints.remove,
	},
} as const;

const unipileWebhooksNested = {
	relations: RelationWebhooks,
	messages: MessageWebhooks,
	accounts: AccountWebhooks,
} as const;

export const unipileEndpointSchemas = {
	'accounts.list': {
		input: UnipileEndpointInputSchemas.accountsList,
		output: UnipileEndpointOutputSchemas.accountsList,
	},
	'accounts.get': {
		input: UnipileEndpointInputSchemas.accountsGet,
		output: UnipileEndpointOutputSchemas.accountsGet,
	},
	'accounts.remove': {
		input: UnipileEndpointInputSchemas.accountsRemove,
		output: UnipileEndpointOutputSchemas.accountsRemove,
	},
	'accounts.createAuthLink': {
		input: UnipileEndpointInputSchemas.accountsCreateAuthLink,
		output: UnipileEndpointOutputSchemas.accountsCreateAuthLink,
	},
	'users.getProfile': {
		input: UnipileEndpointInputSchemas.usersGetProfile,
		output: UnipileEndpointOutputSchemas.usersGetProfile,
	},
	'users.visitProfile': {
		input: UnipileEndpointInputSchemas.usersVisitProfile,
		output: UnipileEndpointOutputSchemas.usersVisitProfile,
	},
	'users.listRelations': {
		input: UnipileEndpointInputSchemas.usersListRelations,
		output: UnipileEndpointOutputSchemas.usersListRelations,
	},
	'users.getChat': {
		input: UnipileEndpointInputSchemas.usersGetChat,
		output: UnipileEndpointOutputSchemas.usersGetChat,
	},
	'users.listReactions': {
		input: UnipileEndpointInputSchemas.usersListReactions,
		output: UnipileEndpointOutputSchemas.usersListReactions,
	},
	'users.listComments': {
		input: UnipileEndpointInputSchemas.usersListComments,
		output: UnipileEndpointOutputSchemas.usersListComments,
	},
	'relationRequests.list': {
		input: UnipileEndpointInputSchemas.relationRequestsList,
		output: UnipileEndpointOutputSchemas.relationRequestsList,
	},
	'relationRequests.create': {
		input: UnipileEndpointInputSchemas.relationRequestsCreate,
		output: UnipileEndpointOutputSchemas.relationRequestsCreate,
	},
	'relationRequests.cancel': {
		input: UnipileEndpointInputSchemas.relationRequestsCancel,
		output: UnipileEndpointOutputSchemas.relationRequestsCancel,
	},
	'relationRequests.accept': {
		input: UnipileEndpointInputSchemas.relationRequestsAccept,
		output: UnipileEndpointOutputSchemas.relationRequestsAccept,
	},
	'chats.list': {
		input: UnipileEndpointInputSchemas.chatsList,
		output: UnipileEndpointOutputSchemas.chatsList,
	},
	'chats.get': {
		input: UnipileEndpointInputSchemas.chatsGet,
		output: UnipileEndpointOutputSchemas.chatsGet,
	},
	'chats.start': {
		input: UnipileEndpointInputSchemas.chatsStart,
		output: UnipileEndpointOutputSchemas.chatsStart,
	},
	'messages.list': {
		input: UnipileEndpointInputSchemas.messagesList,
		output: UnipileEndpointOutputSchemas.messagesList,
	},
	'messages.send': {
		input: UnipileEndpointInputSchemas.messagesSend,
		output: UnipileEndpointOutputSchemas.messagesSend,
	},
	'posts.list': {
		input: UnipileEndpointInputSchemas.postsList,
		output: UnipileEndpointOutputSchemas.postsList,
	},
	'posts.listReactions': {
		input: UnipileEndpointInputSchemas.postsListReactions,
		output: UnipileEndpointOutputSchemas.postsListReactions,
	},
	'posts.listComments': {
		input: UnipileEndpointInputSchemas.postsListComments,
		output: UnipileEndpointOutputSchemas.postsListComments,
	},
	'webhookEndpoints.list': {
		input: UnipileEndpointInputSchemas.webhookEndpointsList,
		output: UnipileEndpointOutputSchemas.webhookEndpointsList,
	},
	'webhookEndpoints.get': {
		input: UnipileEndpointInputSchemas.webhookEndpointsGet,
		output: UnipileEndpointOutputSchemas.webhookEndpointsGet,
	},
	'webhookEndpoints.create': {
		input: UnipileEndpointInputSchemas.webhookEndpointsCreate,
		output: UnipileEndpointOutputSchemas.webhookEndpointsCreate,
	},
	'webhookEndpoints.update': {
		input: UnipileEndpointInputSchemas.webhookEndpointsUpdate,
		output: UnipileEndpointOutputSchemas.webhookEndpointsUpdate,
	},
	'webhookEndpoints.delete': {
		input: UnipileEndpointInputSchemas.webhookEndpointsDelete,
		output: UnipileEndpointOutputSchemas.webhookEndpointsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof unipileEndpointsNested
>;

const unipileWebhookSchemas = {
	'relations.new': {
		description:
			'A new 1st-degree relation, usually an accepted invitation (LinkedIn can report it up to 6 hours late)',
		payload: RelationNewEventSchema,
		response: RelationNewEventSchema,
	},
	'messages.new': {
		description:
			'A message was received or sent in a chat (check payload.is_sender)',
		payload: MessageNewEventSchema,
		response: MessageNewEventSchema,
	},
	'messages.receiptRead': {
		description: 'Someone read a message the account sent',
		payload: MessageReceiptReadEventSchema,
		response: MessageReceiptReadEventSchema,
	},
	'accounts.statusRunning': {
		description: 'An account (or one of its products) is working again',
		payload: AccountStatusRunningEventSchema,
		response: AccountStatusRunningEventSchema,
	},
	'accounts.statusPartial': {
		description:
			'A multi-product account has one product running and another needing sign-in',
		payload: AccountStatusPartialEventSchema,
		response: AccountStatusPartialEventSchema,
	},
	'accounts.statusDegraded': {
		description:
			'A multi-product account has one product running and another interrupted',
		payload: AccountStatusDegradedEventSchema,
		response: AccountStatusDegradedEventSchema,
	},
	'accounts.statusErrored': {
		description:
			'An account is interrupted by a Unipile, proxy or provider problem',
		payload: AccountStatusErroredEventSchema,
		response: AccountStatusErroredEventSchema,
	},
	'accounts.statusDisconnected': {
		description:
			'An account needs signing in again; send a reconnect link from accounts.createAuthLink',
		payload: AccountStatusDisconnectedEventSchema,
		response: AccountStatusDisconnectedEventSchema,
	},
	'accounts.add': {
		description:
			'A new account was connected and is ready; payload.state is the createAuthLink state',
		payload: AccountAddEventSchema,
		response: AccountAddEventSchema,
	},
	'accounts.reconnect': {
		description: 'An existing account was signed in again or reconfigured',
		payload: AccountReconnectEventSchema,
		response: AccountReconnectEventSchema,
	},
	'accounts.remove': {
		description: 'An account was removed from Unipile',
		payload: AccountRemoveEventSchema,
		response: AccountRemoveEventSchema,
	},
	'accounts.locked': {
		description: 'API access to an account was locked',
		payload: AccountLockedEventSchema,
		response: AccountLockedEventSchema,
	},
	'accounts.unlocked': {
		description: 'API access to an account was restored',
		payload: AccountUnlockedEventSchema,
		response: AccountUnlockedEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof unipileWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const unipileEndpointMeta = endpointMeta satisfies RequiredPluginEndpointMeta<
	typeof unipileEndpointsNested
>;

// Unipile events carry the application ID (app_…) that owns the API key.
export const unipileAuthConfig = {
	api_key: {
		account: ['application_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseUnipilePlugin<T extends UnipilePluginOptions> = CorsairPlugin<
	'unipile',
	typeof UnipileSchema,
	typeof unipileEndpointsNested,
	typeof unipileWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalUnipilePlugin = BaseUnipilePlugin<UnipilePluginOptions>;

export type ExternalUnipilePlugin<T extends UnipilePluginOptions> =
	BaseUnipilePlugin<T>;

export function unipile<const T extends UnipilePluginOptions>(
	incomingOptions: UnipilePluginOptions & T = {} as UnipilePluginOptions & T,
): ExternalUnipilePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'unipile',
		authConfig: unipileAuthConfig,
		schema: UnipileSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: unipileEndpointsNested,
		webhooks: unipileWebhooksNested,
		endpointMeta: unipileEndpointMeta,
		endpointSchemas: unipileEndpointSchemas,
		webhookSchemas: unipileWebhookSchemas,
		pluginWebhookMatcher: matchUnipilePluginWebhook,
		pluginTenantWebhookMatcher: matchUnipileTenantWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: UnipileKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				// An empty secret makes signature verification fail closed.
				return (await ctx.keys.get_webhook_signature()) ?? '';
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key) return key;
			}

			throw new AuthMissingError('unipile', ctx.authType ?? 'api_key');
		},
	} satisfies InternalUnipilePlugin;
}

export { UnipileAPIError } from './client';
export type {
	AccountsCreateAuthLinkInput,
	ChatsStartInput,
	MessagesSendInput,
	RelationRequestsCreateInput,
	UnipileAccount,
	UnipileChat,
	UnipileCreatedWebhookEndpoint,
	UnipileEndpointInputs,
	UnipileEndpointOutputs,
	UnipileMessage,
	UnipileOperation,
	UnipilePost,
	UnipileRelationRequest,
	UnipileUser,
	UnipileUserProfile,
	UnipileUserRelation,
	UnipileWebhookEndpoint,
	UnipileWebhookEventType,
} from './endpoints/types';
export {
	isLinkedInLimitError,
	MAX_RETRY_AFTER_MS,
	RETRY_SAFE_OPERATIONS,
} from './error-handlers';
export type {
	AccountAddEvent,
	AccountLockedEvent,
	AccountReconnectEvent,
	AccountRemoveEvent,
	AccountStatusDegradedEvent,
	AccountStatusDisconnectedEvent,
	AccountStatusErroredEvent,
	AccountStatusPartialEvent,
	AccountStatusRunningEvent,
	AccountUnlockedEvent,
	MessageNewEvent,
	MessageReceiptReadEvent,
	RelationNewEvent,
	UnipileWebhookOutputs,
} from './webhooks/types';
export {
	signUnipilePayload,
	verifyUnipileWebhookSignature,
} from './webhooks/types';
