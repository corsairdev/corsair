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
} from 'corsair/core';
import {
	Channels,
	Guilds,
	Members,
	Messages,
	Reactions,
	Threads,
} from './endpoints';
import type {
	ChannelsListInput,
	DiscordEndpointOutputs,
	GuildsGetInput,
	GuildsListInput,
	MembersGetInput,
	MembersListInput,
	MessagesDeleteInput,
	MessagesEditInput,
	MessagesGetInput,
	MessagesListInput,
	MessagesReplyInput,
	MessagesSendInput,
	ReactionsAddInput,
	ReactionsListInput,
	ReactionsRemoveInput,
	ThreadsCreateFromMessageInput,
	ThreadsCreateInput,
} from './endpoints/types';
import {
	DiscordEndpointInputSchemas,
	DiscordEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DiscordSchema } from './schema';
import { InteractionWebhooks } from './webhooks';
import type {
	DiscordApplicationCommandInteraction,
	DiscordMessageComponentInteraction,
	DiscordModalSubmitInteraction,
	DiscordWebhookOutputs,
} from './webhooks/types';
import {
	DiscordApplicationCommandInteractionSchema,
	DiscordMessageComponentInteractionSchema,
	DiscordModalSubmitInteractionSchema,
	DiscordPingInteractionSchema,
} from './webhooks/types';

// ── Plugin Options ─────────────────────────────────────────────────────────────

export type DiscordPluginOptions = {
	/**
	 * Authentication method. Discord bots use an API key (bot token).
	 */
	authType?: PickAuth<'api_key'>;
	/**
	 * Bot token for Discord API calls (e.g. "MTk4NjIyNDgzNDcxOTI1MjQ4.Cl2FDg...").
	 * If omitted the key manager is used to retrieve it.
	 */
	key?: string;
	/**
	 * Ed25519 public key for verifying incoming interaction webhooks.
	 * Found in the Discord Developer Portal under Application > General Information.
	 * If omitted the key manager's webhook_signature store is used.
	 */
	publicKey?: string;
	/** Lifecycle hooks for API endpoints. */
	hooks?: InternalDiscordPlugin['hooks'];
	/** Lifecycle hooks for webhook handlers. */
	webhookHooks?: InternalDiscordPlugin['webhookHooks'];
	/** Custom error handlers (merged with built-in defaults). */
	errorHandlers?: CorsairErrorHandler;
	/**
	 * Permission configuration for the Discord plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Discord endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof discordEndpointsNested>;
};

// ── Context ────────────────────────────────────────────────────────────────────

export type DiscordContext = CorsairPluginContext<
	typeof DiscordSchema,
	DiscordPluginOptions
>;

export type DiscordKeyBuilderContext = KeyBuilderContext<DiscordPluginOptions>;

// ── Endpoint Types ─────────────────────────────────────────────────────────────

export type DiscordBoundEndpoints = BindEndpoints<
	typeof discordEndpointsNested
>;

type DiscordEndpoint<
	K extends keyof DiscordEndpointOutputs,
	Input,
> = CorsairEndpoint<DiscordContext, Input, DiscordEndpointOutputs[K]>;

export type DiscordEndpoints = {
	// Messages
	messagesSend: DiscordEndpoint<'messagesSend', MessagesSendInput>;
	messagesReply: DiscordEndpoint<'messagesReply', MessagesReplyInput>;
	messagesGet: DiscordEndpoint<'messagesGet', MessagesGetInput>;
	messagesList: DiscordEndpoint<'messagesList', MessagesListInput>;
	messagesEdit: DiscordEndpoint<'messagesEdit', MessagesEditInput>;
	messagesDelete: DiscordEndpoint<'messagesDelete', MessagesDeleteInput>;
	// Threads
	threadsCreate: DiscordEndpoint<'threadsCreate', ThreadsCreateInput>;
	threadsCreateFromMessage: DiscordEndpoint<
		'threadsCreateFromMessage',
		ThreadsCreateFromMessageInput
	>;
	// Reactions
	reactionsAdd: DiscordEndpoint<'reactionsAdd', ReactionsAddInput>;
	reactionsRemove: DiscordEndpoint<'reactionsRemove', ReactionsRemoveInput>;
	reactionsList: DiscordEndpoint<'reactionsList', ReactionsListInput>;
	// Guilds
	guildsList: DiscordEndpoint<'guildsList', GuildsListInput>;
	guildsGet: DiscordEndpoint<'guildsGet', GuildsGetInput>;
	// Channels
	channelsList: DiscordEndpoint<'channelsList', ChannelsListInput>;
	// Members
	membersList: DiscordEndpoint<'membersList', MembersListInput>;
	membersGet: DiscordEndpoint<'membersGet', MembersGetInput>;
};

// ── Webhook Types ──────────────────────────────────────────────────────────────

type DiscordWebhook<
	K extends keyof DiscordWebhookOutputs,
	TEvent,
> = CorsairWebhook<DiscordContext, TEvent, DiscordWebhookOutputs[K]>;

export type DiscordWebhooks = {
	ping: DiscordWebhook<'ping', { type: 1 }>;
	applicationCommand: DiscordWebhook<
		'applicationCommand',
		DiscordApplicationCommandInteraction
	>;
	messageComponent: DiscordWebhook<
		'messageComponent',
		DiscordMessageComponentInteraction
	>;
	modalSubmit: DiscordWebhook<'modalSubmit', DiscordModalSubmitInteraction>;
};

export type DiscordBoundWebhooks = BindWebhooks<DiscordWebhooks>;

// ── Endpoint & Webhook Trees ───────────────────────────────────────────────────

const discordEndpointsNested = {
	messages: {
		send: Messages.send,
		reply: Messages.reply,
		get: Messages.get,
		list: Messages.list,
		edit: Messages.edit,
		delete: Messages.del,
	},
	threads: {
		create: Threads.create,
		createFromMessage: Threads.createFromMessage,
	},
	reactions: {
		add: Reactions.add,
		remove: Reactions.remove,
		list: Reactions.list,
	},
	guilds: {
		list: Guilds.list,
		get: Guilds.get,
	},
	channels: {
		list: Channels.list,
	},
	members: {
		list: Members.list,
		get: Members.get,
	},
} as const;

export const discordEndpointSchemas = {
	'messages.send': {
		input: DiscordEndpointInputSchemas.messagesSend,
		output: DiscordEndpointOutputSchemas.messagesSend,
	},
	'messages.reply': {
		input: DiscordEndpointInputSchemas.messagesReply,
		output: DiscordEndpointOutputSchemas.messagesReply,
	},
	'messages.get': {
		input: DiscordEndpointInputSchemas.messagesGet,
		output: DiscordEndpointOutputSchemas.messagesGet,
	},
	'messages.list': {
		input: DiscordEndpointInputSchemas.messagesList,
		output: DiscordEndpointOutputSchemas.messagesList,
	},
	'messages.edit': {
		input: DiscordEndpointInputSchemas.messagesEdit,
		output: DiscordEndpointOutputSchemas.messagesEdit,
	},
	'messages.delete': {
		input: DiscordEndpointInputSchemas.messagesDelete,
		output: DiscordEndpointOutputSchemas.messagesDelete,
	},
	'threads.create': {
		input: DiscordEndpointInputSchemas.threadsCreate,
		output: DiscordEndpointOutputSchemas.threadsCreate,
	},
	'threads.createFromMessage': {
		input: DiscordEndpointInputSchemas.threadsCreateFromMessage,
		output: DiscordEndpointOutputSchemas.threadsCreateFromMessage,
	},
	'reactions.add': {
		input: DiscordEndpointInputSchemas.reactionsAdd,
		output: DiscordEndpointOutputSchemas.reactionsAdd,
	},
	'reactions.remove': {
		input: DiscordEndpointInputSchemas.reactionsRemove,
		output: DiscordEndpointOutputSchemas.reactionsRemove,
	},
	'reactions.list': {
		input: DiscordEndpointInputSchemas.reactionsList,
		output: DiscordEndpointOutputSchemas.reactionsList,
	},
	'guilds.list': {
		input: DiscordEndpointInputSchemas.guildsList,
		output: DiscordEndpointOutputSchemas.guildsList,
	},
	'guilds.get': {
		input: DiscordEndpointInputSchemas.guildsGet,
		output: DiscordEndpointOutputSchemas.guildsGet,
	},
	'channels.list': {
		input: DiscordEndpointInputSchemas.channelsList,
		output: DiscordEndpointOutputSchemas.channelsList,
	},
	'members.list': {
		input: DiscordEndpointInputSchemas.membersList,
		output: DiscordEndpointOutputSchemas.membersList,
	},
	'members.get': {
		input: DiscordEndpointInputSchemas.membersGet,
		output: DiscordEndpointOutputSchemas.membersGet,
	},
} as const;

const discordWebhooksNested = {
	interactions: {
		ping: InteractionWebhooks.ping,
		applicationCommand: InteractionWebhooks.applicationCommand,
		messageComponent: InteractionWebhooks.messageComponent,
		modalSubmit: InteractionWebhooks.modalSubmit,
	},
} as const;

// ── Auth ───────────────────────────────────────────────────────────────────────

const discordWebhookSchemas = {
	'interactions.ping': {
		description: 'Discord sends a PING to verify the endpoint is live',
		payload: DiscordPingInteractionSchema,
		response: DiscordPingInteractionSchema,
	},
	'interactions.applicationCommand': {
		description: 'A user invoked a slash command or context-menu action',
		payload: DiscordApplicationCommandInteractionSchema,
		response: DiscordApplicationCommandInteractionSchema,
	},
	'interactions.messageComponent': {
		description: 'A user clicked a button or selected a menu option',
		payload: DiscordMessageComponentInteractionSchema,
		response: DiscordMessageComponentInteractionSchema,
	},
	'interactions.modalSubmit': {
		description: 'A user submitted a modal dialog',
		payload: DiscordModalSubmitInteractionSchema,
		response: DiscordModalSubmitInteractionSchema,
	},
} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

/**
 * Risk-level metadata for each Discord endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const discordEndpointMeta = {
	'messages.send': {
		riskLevel: 'write',
		description: 'Send a message to a channel',
	},
	'messages.reply': {
		riskLevel: 'write',
		description: 'Reply to a message in a channel',
	},
	'messages.get': { riskLevel: 'read', description: 'Get a specific message' },
	'messages.list': {
		riskLevel: 'read',
		description: 'List recent messages in a channel',
	},
	'messages.edit': {
		riskLevel: 'write',
		description: 'Edit an existing message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a message [DESTRUCTIVE]',
	},
	'threads.create': {
		riskLevel: 'write',
		description: 'Create a new thread in a channel',
	},
	'threads.createFromMessage': {
		riskLevel: 'write',
		description: 'Create a thread from an existing message',
	},
	'reactions.add': {
		riskLevel: 'write',
		description: 'Add a reaction to a message',
	},
	'reactions.remove': {
		riskLevel: 'write',
		description: 'Remove a reaction from a message',
	},
	'reactions.list': {
		riskLevel: 'read',
		description: 'List reactions on a message',
	},
	'guilds.list': {
		riskLevel: 'read',
		description: 'List guilds the bot is a member of',
	},
	'guilds.get': { riskLevel: 'read', description: 'Get info about a guild' },
	'channels.list': {
		riskLevel: 'read',
		description: 'List channels in a guild',
	},
	'members.list': { riskLevel: 'read', description: 'List members of a guild' },
	'members.get': {
		riskLevel: 'read',
		description: 'Get info about a guild member',
	},
} satisfies RequiredPluginEndpointMeta<typeof discordEndpointsNested>;

export const discordAuthConfig = {} as const satisfies PluginAuthConfig;

// ── Plugin Type Hierarchy ──────────────────────────────────────────────────────

export type BaseDiscordPlugin<T extends DiscordPluginOptions> = CorsairPlugin<
	'discord',
	typeof DiscordSchema,
	typeof discordEndpointsNested,
	typeof discordWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDiscordPlugin = BaseDiscordPlugin<DiscordPluginOptions>;

export type ExternalDiscordPlugin<T extends DiscordPluginOptions> =
	BaseDiscordPlugin<T>;

// ── Plugin Factory ─────────────────────────────────────────────────────────────

export function discord<const T extends DiscordPluginOptions>(
	incomingOptions: DiscordPluginOptions & T = {} as DiscordPluginOptions & T,
): ExternalDiscordPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	return {
		id: 'discord',
		schema: DiscordSchema,
		options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: discordEndpointsNested,
		webhooks: discordWebhooksNested,
		endpointMeta: discordEndpointMeta,
		endpointSchemas: discordEndpointSchemas,
		webhookSchemas: discordWebhookSchemas,

		/**
		 * Identifies incoming Discord interaction webhooks.
		 *
		 * Discord does not send an explicit "X-Discord-*" header, so we fingerprint
		 * the request using two signals:
		 *   1. Both Ed25519 signature headers must be present (Discord-specific names).
		 *   2. The body must look like a Discord interaction object: it must have an
		 *      `application_id` string (a Discord snowflake) and a numeric `type`
		 *      in the range 1–5 (PING → MODAL_SUBMIT).
		 */
		pluginWebhookMatcher: ({ body, headers }) => {
			if (
				!headers['x-signature-ed25519'] ||
				!headers['x-signature-timestamp']
			) {
				return false;
			}

			try {
				const parsedBody =
					typeof body === 'string'
						? (JSON.parse(body) as Record<string, unknown>)
						: (body as Record<string, unknown>);

				return (
					typeof parsedBody?.application_id === 'string' &&
					typeof parsedBody?.type === 'number' &&
					parsedBody.type >= 1 &&
					parsedBody.type <= 5
				);
			} catch {
				return false;
			}
		},

		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},

		/**
		 * Resolves the appropriate credential for the calling context:
		 *
		 * - source === 'webhook'  → Ed25519 public key for interaction signature verification
		 * - source === 'endpoint' → Bot token for Discord REST API calls (used as "Bot <token>")
		 */
		keyBuilder: async (ctx: DiscordKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.publicKey) return options.publicKey;
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint') {
				if (options.key) return options.key;
				if (ctx.authType === 'api_key') {
					const res = await ctx.keys.get_api_key();
					return res ?? '';
				}
			}

			return '';
		},
	} satisfies InternalDiscordPlugin;
}

// ── Type Exports ───────────────────────────────────────────────────────────────

export type {
	// Shared response / entity types
	Attachment,
	Channel,
	// Endpoint input types (needed so callers can name them in their own code)
	ChannelsListInput,
	DiscordEndpointInputs,
	DiscordEndpointOutputs,
	DiscordUser,
	Embed,
	Guild,
	GuildMember,
	GuildsGetInput,
	GuildsListInput,
	MembersGetInput,
	MembersListInput,
	Message,
	MessageReference,
	MessagesDeleteInput,
	MessagesEditInput,
	MessagesGetInput,
	MessagesListInput,
	MessagesReplyInput,
	MessagesSendInput,
	PartialGuild,
	ReactionsAddInput,
	ReactionsListInput,
	ReactionsRemoveInput,
	Role,
	SuccessResponse,
	ThreadsCreateFromMessageInput,
	ThreadsCreateInput,
} from './endpoints/types';
export type {
	ApplicationCommandData,
	ApplicationCommandOption,
	DiscordApplicationCommandInteraction,
	DiscordGuildMemberPartial,
	DiscordInteraction,
	DiscordInteractionTypeValue,
	DiscordMessageComponentInteraction,
	DiscordMessagePartial,
	DiscordModalSubmitInteraction,
	DiscordPingInteraction,
	DiscordWebhookOutputs,
	MessageComponentData,
	ModalSubmitData,
} from './webhooks/types';
