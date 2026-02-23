import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginAuthConfig,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
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
import { errorHandlers } from './error-handlers';
import { DiscordSchema } from './schema';
import { InteractionWebhooks } from './webhooks';
import type {
	DiscordApplicationCommandInteraction,
	DiscordMessageComponentInteraction,
	DiscordModalSubmitInteraction,
	DiscordWebhookOutputs,
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

const discordWebhooksNested = {
	interactions: {
		ping: InteractionWebhooks.ping,
		applicationCommand: InteractionWebhooks.applicationCommand,
		messageComponent: InteractionWebhooks.messageComponent,
		modalSubmit: InteractionWebhooks.modalSubmit,
	},
} as const;

// ── Auth ───────────────────────────────────────────────────────────────────────

const defaultAuthType: AuthTypes = 'api_key' as const;

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
	DiscordEndpointOutputs,
	DiscordUser,
	Embed,
	Guild,
	GuildMember,
	Message,
	MessageReference,
	PartialGuild,
	Role,
	SuccessResponse,
	// Endpoint input types (needed so callers can name them in their own code)
	ChannelsListInput,
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
