import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RawWebhookRequest,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { getValidAccessToken } from './client';
import type { GmailEndpointInputs, GmailEndpointOutputs } from './endpoints';
import {
	DraftsEndpoints,
	LabelsEndpoints,
	MessagesEndpoints,
	ThreadsEndpoints,
} from './endpoints';
import {
	GmailEndpointInputSchemas,
	GmailEndpointOutputSchemas,
} from './endpoints/types';
import type { GmailCredentials } from './schema';
import { GmailSchema } from './schema';
import type {
	GmailWebhookOutputs,
	GmailWebhookPayload,
	MessageDeletedEvent,
	MessageLabelChangedEvent,
	MessageReceivedEvent,
} from './webhooks';
import { MessageWebhooks } from './webhooks';
import type { PubSubNotification } from './webhooks/types';
import {
	decodePubSubMessage,
	GmailWebhookEventSchema,
	PubSubNotificationSchema,
} from './webhooks/types';

/**
 * Auth config extending the base OAuth2 fields with Gmail-specific fields.
 * - integration: topic_id (Google Cloud Pub/Sub topic for push notifications)
 */
export const gmailAuthConfig = {
	oauth_2: {
		integration: ['topic_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type GmailContext = CorsairPluginContext<
	typeof GmailSchema,
	GmailPluginOptions,
	undefined,
	typeof gmailAuthConfig
>;

type GmailEndpoint<K extends keyof GmailEndpointOutputs> = CorsairEndpoint<
	GmailContext,
	GmailEndpointInputs[K],
	GmailEndpointOutputs[K]
>;

export type GmailEndpoints = {
	messagesList: GmailEndpoint<'messagesList'>;
	messagesGet: GmailEndpoint<'messagesGet'>;
	messagesSend: GmailEndpoint<'messagesSend'>;
	messagesDelete: GmailEndpoint<'messagesDelete'>;
	messagesModify: GmailEndpoint<'messagesModify'>;
	messagesBatchModify: GmailEndpoint<'messagesBatchModify'>;
	messagesTrash: GmailEndpoint<'messagesTrash'>;
	messagesUntrash: GmailEndpoint<'messagesUntrash'>;
	labelsList: GmailEndpoint<'labelsList'>;
	labelsGet: GmailEndpoint<'labelsGet'>;
	labelsCreate: GmailEndpoint<'labelsCreate'>;
	labelsUpdate: GmailEndpoint<'labelsUpdate'>;
	labelsDelete: GmailEndpoint<'labelsDelete'>;
	draftsList: GmailEndpoint<'draftsList'>;
	draftsGet: GmailEndpoint<'draftsGet'>;
	draftsCreate: GmailEndpoint<'draftsCreate'>;
	draftsUpdate: GmailEndpoint<'draftsUpdate'>;
	draftsDelete: GmailEndpoint<'draftsDelete'>;
	draftsSend: GmailEndpoint<'draftsSend'>;
	threadsList: GmailEndpoint<'threadsList'>;
	threadsGet: GmailEndpoint<'threadsGet'>;
	threadsModify: GmailEndpoint<'threadsModify'>;
	threadsDelete: GmailEndpoint<'threadsDelete'>;
	threadsTrash: GmailEndpoint<'threadsTrash'>;
	threadsUntrash: GmailEndpoint<'threadsUntrash'>;
	usersGetProfile: GmailEndpoint<'usersGetProfile'>;
};

export type GmailBoundEndpoints = BindEndpoints<typeof gmailEndpointsNested>;

type GmailWebhook<K extends keyof GmailWebhookOutputs, TEvent> = CorsairWebhook<
	GmailContext,
	GmailWebhookPayload<TEvent>,
	GmailWebhookOutputs[K]
>;

export type GmailWebhooks = {
	messageChanged: GmailWebhook<
		'messageChanged',
		MessageReceivedEvent | MessageDeletedEvent | MessageLabelChangedEvent
	>;
};

export type GmailBoundWebhooks = BindWebhooks<typeof gmailWebhooksNested>;

export const gmailEndpointsNested = {
	messages: {
		list: MessagesEndpoints.list,
		get: MessagesEndpoints.get,
		send: MessagesEndpoints.send,
		delete: MessagesEndpoints.delete,
		modify: MessagesEndpoints.modify,
		batchModify: MessagesEndpoints.batchModify,
		trash: MessagesEndpoints.trash,
		untrash: MessagesEndpoints.untrash,
	},
	labels: {
		list: LabelsEndpoints.list,
		get: LabelsEndpoints.get,
		create: LabelsEndpoints.create,
		update: LabelsEndpoints.update,
		delete: LabelsEndpoints.delete,
	},
	drafts: {
		list: DraftsEndpoints.list,
		get: DraftsEndpoints.get,
		create: DraftsEndpoints.create,
		update: DraftsEndpoints.update,
		delete: DraftsEndpoints.delete,
		send: DraftsEndpoints.send,
	},
	threads: {
		list: ThreadsEndpoints.list,
		get: ThreadsEndpoints.get,
		modify: ThreadsEndpoints.modify,
		delete: ThreadsEndpoints.delete,
		trash: ThreadsEndpoints.trash,
		untrash: ThreadsEndpoints.untrash,
	},
} as const;

export const gmailEndpointSchemas = {
	'messages.list': {
		input: GmailEndpointInputSchemas.messagesList,
		output: GmailEndpointOutputSchemas.messagesList,
	},
	'messages.get': {
		input: GmailEndpointInputSchemas.messagesGet,
		output: GmailEndpointOutputSchemas.messagesGet,
	},
	'messages.send': {
		input: GmailEndpointInputSchemas.messagesSend,
		output: GmailEndpointOutputSchemas.messagesSend,
	},
	'messages.delete': {
		input: GmailEndpointInputSchemas.messagesDelete,
		output: GmailEndpointOutputSchemas.messagesDelete,
	},
	'messages.modify': {
		input: GmailEndpointInputSchemas.messagesModify,
		output: GmailEndpointOutputSchemas.messagesModify,
	},
	'messages.batchModify': {
		input: GmailEndpointInputSchemas.messagesBatchModify,
		output: GmailEndpointOutputSchemas.messagesBatchModify,
	},
	'messages.trash': {
		input: GmailEndpointInputSchemas.messagesTrash,
		output: GmailEndpointOutputSchemas.messagesTrash,
	},
	'messages.untrash': {
		input: GmailEndpointInputSchemas.messagesUntrash,
		output: GmailEndpointOutputSchemas.messagesUntrash,
	},
	'labels.list': {
		input: GmailEndpointInputSchemas.labelsList,
		output: GmailEndpointOutputSchemas.labelsList,
	},
	'labels.get': {
		input: GmailEndpointInputSchemas.labelsGet,
		output: GmailEndpointOutputSchemas.labelsGet,
	},
	'labels.create': {
		input: GmailEndpointInputSchemas.labelsCreate,
		output: GmailEndpointOutputSchemas.labelsCreate,
	},
	'labels.update': {
		input: GmailEndpointInputSchemas.labelsUpdate,
		output: GmailEndpointOutputSchemas.labelsUpdate,
	},
	'labels.delete': {
		input: GmailEndpointInputSchemas.labelsDelete,
		output: GmailEndpointOutputSchemas.labelsDelete,
	},
	'drafts.list': {
		input: GmailEndpointInputSchemas.draftsList,
		output: GmailEndpointOutputSchemas.draftsList,
	},
	'drafts.get': {
		input: GmailEndpointInputSchemas.draftsGet,
		output: GmailEndpointOutputSchemas.draftsGet,
	},
	'drafts.create': {
		input: GmailEndpointInputSchemas.draftsCreate,
		output: GmailEndpointOutputSchemas.draftsCreate,
	},
	'drafts.update': {
		input: GmailEndpointInputSchemas.draftsUpdate,
		output: GmailEndpointOutputSchemas.draftsUpdate,
	},
	'drafts.delete': {
		input: GmailEndpointInputSchemas.draftsDelete,
		output: GmailEndpointOutputSchemas.draftsDelete,
	},
	'drafts.send': {
		input: GmailEndpointInputSchemas.draftsSend,
		output: GmailEndpointOutputSchemas.draftsSend,
	},
	'threads.list': {
		input: GmailEndpointInputSchemas.threadsList,
		output: GmailEndpointOutputSchemas.threadsList,
	},
	'threads.get': {
		input: GmailEndpointInputSchemas.threadsGet,
		output: GmailEndpointOutputSchemas.threadsGet,
	},
	'threads.modify': {
		input: GmailEndpointInputSchemas.threadsModify,
		output: GmailEndpointOutputSchemas.threadsModify,
	},
	'threads.delete': {
		input: GmailEndpointInputSchemas.threadsDelete,
		output: GmailEndpointOutputSchemas.threadsDelete,
	},
	'threads.trash': {
		input: GmailEndpointInputSchemas.threadsTrash,
		output: GmailEndpointOutputSchemas.threadsTrash,
	},
	'threads.untrash': {
		input: GmailEndpointInputSchemas.threadsUntrash,
		output: GmailEndpointOutputSchemas.threadsUntrash,
	},
} as const;

export const gmailWebhooksNested = {
	messageChanged: MessageWebhooks.messageChanged,
} as const;

export type GmailPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	credentials?: GmailCredentials;
	hooks?: InternalGmailPlugin['hooks'];
	webhookHooks?: InternalGmailPlugin['webhookHooks'];
	/**
	 * Permission configuration for the Gmail plugin.
	 * Controls what the AI agent is allowed to do.
	 * Overrides use dot-notation paths from the Gmail endpoint tree — invalid paths are type errors.
	 */
	permissions?: PluginPermissionsConfig<typeof gmailEndpointsNested>;
};

export type GmailKeyBuilderContext = KeyBuilderContext<
	GmailPluginOptions,
	typeof gmailAuthConfig
>;

const gmailWebhookSchemas = {
	messageChanged: {
		description:
			'A Gmail message was received, deleted, or had its labels changed',
		payload: PubSubNotificationSchema,
		response: GmailWebhookEventSchema,
	},
} as const;

const defaultAuthType = 'oauth_2' as const;

/**
 * Risk-level metadata for each Gmail endpoint.
 * Used by the MCP server permission system to decide allow / deny / require_approval.
 */
const gmailEndpointMeta = {
	'messages.list': {
		riskLevel: 'read',
		description: 'List messages in a mailbox',
	},
	'messages.get': { riskLevel: 'read', description: 'Get a specific message' },
	'messages.send': {
		riskLevel: 'write',
		description: 'Send an email to one or more recipients',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a message [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'messages.modify': {
		riskLevel: 'write',
		description: 'Add or remove labels from a message',
	},
	'messages.batchModify': {
		riskLevel: 'write',
		description: 'Add or remove labels from multiple messages in bulk',
	},
	'messages.trash': {
		riskLevel: 'write',
		description: 'Move a message to the trash',
	},
	'messages.untrash': {
		riskLevel: 'write',
		description: 'Restore a message from the trash',
	},
	'labels.list': {
		riskLevel: 'read',
		description: 'List all labels in the mailbox',
	},
	'labels.get': { riskLevel: 'read', description: 'Get a specific label' },
	'labels.create': { riskLevel: 'write', description: 'Create a new label' },
	'labels.update': {
		riskLevel: 'write',
		description: 'Update an existing label',
	},
	'labels.delete': {
		riskLevel: 'destructive',
		description: 'Delete a label [DESTRUCTIVE]',
	},
	'drafts.list': {
		riskLevel: 'read',
		description: 'List drafts in the mailbox',
	},
	'drafts.get': { riskLevel: 'read', description: 'Get a specific draft' },
	'drafts.create': { riskLevel: 'write', description: 'Create a new draft' },
	'drafts.update': {
		riskLevel: 'write',
		description: 'Update an existing draft',
	},
	'drafts.delete': {
		riskLevel: 'destructive',
		description: 'Delete a draft [DESTRUCTIVE]',
	},
	'drafts.send': {
		riskLevel: 'write',
		description: 'Send a draft as an email',
	},
	'threads.list': {
		riskLevel: 'read',
		description: 'List threads in the mailbox',
	},
	'threads.get': { riskLevel: 'read', description: 'Get a specific thread' },
	'threads.modify': {
		riskLevel: 'write',
		description: 'Add or remove labels from a thread',
	},
	'threads.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a thread [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'threads.trash': {
		riskLevel: 'write',
		description: 'Move a thread to the trash',
	},
	'threads.untrash': {
		riskLevel: 'write',
		description: 'Restore a thread from the trash',
	},
} satisfies RequiredPluginEndpointMeta<typeof gmailEndpointsNested>;

export type BaseGmailPlugin<T extends GmailPluginOptions> = CorsairPlugin<
	'gmail',
	typeof GmailSchema,
	typeof gmailEndpointsNested,
	typeof gmailWebhooksNested,
	T,
	typeof defaultAuthType,
	typeof gmailAuthConfig
>;

/**
 * We have to type the internal plugin separately from the external plugin
 * Because the internal plugin has to provide options for all possible auth methods
 * The external plugin has to provide options for the auth method the user has selected
 */
export type InternalGmailPlugin = BaseGmailPlugin<GmailPluginOptions>;

export type ExternalGmailPlugin<T extends GmailPluginOptions> =
	BaseGmailPlugin<T>;

export function gmail<const T extends GmailPluginOptions>(
	incomingOptions: GmailPluginOptions & T = {} as GmailPluginOptions & T,
): ExternalGmailPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'gmail',
		schema: GmailSchema,
		options: options,
		authConfig: gmailAuthConfig,
		oauthConfig: {
			providerName: 'Google',
			authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
			tokenUrl: 'https://oauth2.googleapis.com/token',
			scopes: [
				'https://www.googleapis.com/auth/gmail.modify',
				'https://www.googleapis.com/auth/gmail.labels',
				'https://www.googleapis.com/auth/gmail.send',
				'https://www.googleapis.com/auth/gmail.compose',
			],
			authParams: { access_type: 'offline', prompt: 'consent' },
		},
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gmailEndpointsNested,
		webhooks: gmailWebhooksNested,
		endpointMeta: gmailEndpointMeta,
		endpointSchemas: gmailEndpointSchemas,
		webhookSchemas: gmailWebhookSchemas,
		keyBuilder: async (ctx: GmailKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const [accessToken, expiresAt, refreshToken] = await Promise.all([
					ctx.keys.get_access_token(),
					ctx.keys.get_expires_at(),
					ctx.keys.get_refresh_token(),
				]);

				if (!refreshToken) {
					throw new Error(
						'[corsair:gmail] No refresh token found. Run `corsair auth --plugin=gmail` to re-authenticate.',
					);
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					throw new Error(
						'[corsair:gmail] Missing client_id or client_secret. Run `corsair setup --gmail` to configure credentials.',
					);
				}

				let result: Awaited<ReturnType<typeof getValidAccessToken>>;
				try {
					result = await getValidAccessToken({
						accessToken,
						expiresAt,
						refreshToken,
						clientId: res.client_id,
						clientSecret: res.client_secret,
					});
				} catch (error) {
					throw new Error(
						`[corsair:gmail] Failed to obtain valid access token: ${error instanceof Error ? error.message : String(error)}`,
					);
				}

				if (result.refreshed) {
					try {
						await ctx.keys.set_access_token(result.accessToken);
						await ctx.keys.set_expires_at(String(result.expiresAt));
					} catch (error) {
						throw new Error(
							`[corsair:gmail] Token was refreshed but failed to persist new credentials: ${error instanceof Error ? error.message : String(error)}`,
						);
					}
				}

				// Expose a force-refresh function on the context so endpoints can
				// retry on 401 without waiting for `expires_at` to lapse.
				(ctx as Record<string, unknown>)._refreshAuth = async () => {
					const freshResult = await getValidAccessToken({
						accessToken: null,
						expiresAt: null,
						refreshToken,
						clientId: res.client_id!,
						clientSecret: res.client_secret!,
						forceRefresh: true,
					});
					await ctx.keys.set_access_token(freshResult.accessToken);
					await ctx.keys.set_expires_at(String(freshResult.expiresAt));
					return freshResult.accessToken;
				};

				return result.accessToken;
			}

			return '';
		},
		pluginWebhookMatcher: (request: RawWebhookRequest) => {
			const headers = request.headers;
			const isFromGoogle =
				headers.from === 'noreply@google.com' ||
				(typeof headers['user-agent'] === 'string' &&
					headers['user-agent'].includes('APIs-Google'));

			if (!isFromGoogle) return false;

			const body = request.body as PubSubNotification;
			if (!body?.message?.data) return false;

			try {
				const decoded = decodePubSubMessage(body.message.data);
				return !!decoded.emailAddress && !!decoded.historyId;
			} catch {
				return false;
			}
		},
	} satisfies InternalGmailPlugin;
}

// ─────────────────────────────────────────────────────────────────────────────
// Webhook Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GmailEventName,
	GmailPushNotification,
	GmailWebhookEvent,
	GmailWebhookOutputs,
	GmailWebhookPayload,
	MessageDeletedEvent,
	MessageLabelChangedEvent,
	MessageReceivedEvent,
	PubSubMessage,
	PubSubNotification,
} from './webhooks/types';
export {
	createGmailWebhookMatcher,
	decodePubSubMessage,
} from './webhooks/types';

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type {
	GmailEndpointInputs,
	GmailEndpointOutputs,
} from './endpoints/types';

// ─────────────────────────────────────────────────────────────────────────────
// Schema Type Exports
// ─────────────────────────────────────────────────────────────────────────────

export type { GmailCredentials } from './schema';
export { GmailSchema } from './schema';

export type * from './types';
