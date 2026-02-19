import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PluginAuthConfig,
	RawWebhookRequest,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import { getValidAccessToken } from './client';
import type { GmailEndpointInputs, GmailEndpointOutputs } from './endpoints';
import {
	DraftsEndpoints,
	LabelsEndpoints,
	MessagesEndpoints,
	ThreadsEndpoints,
} from './endpoints';
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
import { decodePubSubMessage } from './webhooks/types';

/**
 * Auth config extending the base OAuth2 fields with Gmail-specific fields.
 * - integration: topic_id (Google Cloud Pub/Sub topic for push notifications)
 */
export const gmailAuthConfig = {
	oauth_2: {
		integration: ['topic_id'] as const,
		account: ['something_else'] as const,
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

export const gmailWebhooksNested = {
	messageChanged: MessageWebhooks.messageChanged,
} as const;

export type GmailPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	credentials?: GmailCredentials;
	hooks?: InternalGmailPlugin['hooks'];
	webhookHooks?: InternalGmailPlugin['webhookHooks'];
};

export type GmailKeyBuilderContext = KeyBuilderContext<
	GmailPluginOptions,
	typeof gmailAuthConfig
>;

const defaultAuthType: AuthTypes = 'oauth_2';

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
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gmailEndpointsNested,
		webhooks: gmailWebhooksNested,
		keyBuilder: async (ctx: GmailKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.get_access_token();
				const refreshToken = await ctx.keys.get_refresh_token();

				if (!accessToken || !refreshToken) {
					// prob need to throw an error here
					throw new Error('No access token or refresh token');
				}

				const res = await ctx.keys.get_integration_credentials();

				if (!res.client_id || !res.client_secret) {
					// prob need to throw an error here
					throw new Error('No client id or client secret');
				}

				const key = await getValidAccessToken({
					accessToken,
					refreshToken,
					clientId: res.client_id,
					clientSecret: res.client_secret,
				});

				return key;
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
