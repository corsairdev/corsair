import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
} from '../../core';
import type { AuthTypes, PickAuth } from '../../core/constants';
import { getValidAccessToken } from './client';
import type { GmailEndpointOutputs } from './endpoints';
import {
	DraftsEndpoints,
	LabelsEndpoints,
	MessagesEndpoints,
	ThreadsEndpoints,
} from './endpoints';
import { GmailSchema } from './schema';
import type {
	GmailWebhookOutputs,
	GmailWebhookPayload,
	MessageDeletedEvent,
	MessageLabelChangedEvent,
	MessageReceivedEvent,
} from './webhooks';
import { MessageWebhooks } from './webhooks';

export type GmailContext = CorsairPluginContext<
	typeof GmailSchema,
	GmailPluginOptions
>;

type GmailEndpoint<
	K extends keyof GmailEndpointOutputs,
	Input,
> = CorsairEndpoint<GmailContext, Input, GmailEndpointOutputs[K]>;

export type GmailEndpoints = {
	messagesList: GmailEndpoint<
		'messagesList',
		{
			userId?: string;
			q?: string;
			maxResults?: number;
			pageToken?: string;
			labelIds?: string[];
			includeSpamTrash?: boolean;
		}
	>;
	messagesGet: GmailEndpoint<
		'messagesGet',
		{
			userId?: string;
			id: string;
			format?: 'minimal' | 'full' | 'raw' | 'metadata';
			metadataHeaders?: string[];
		}
	>;
	messagesSend: GmailEndpoint<
		'messagesSend',
		{
			userId?: string;
			raw: string;
			threadId?: string;
		}
	>;
	messagesDelete: GmailEndpoint<
		'messagesDelete',
		{
			userId?: string;
			id: string;
		}
	>;
	messagesModify: GmailEndpoint<
		'messagesModify',
		{
			userId?: string;
			id: string;
			addLabelIds?: string[];
			removeLabelIds?: string[];
		}
	>;
	messagesBatchModify: GmailEndpoint<
		'messagesBatchModify',
		{
			userId?: string;
			ids?: string[];
			addLabelIds?: string[];
			removeLabelIds?: string[];
		}
	>;
	messagesTrash: GmailEndpoint<
		'messagesTrash',
		{
			userId?: string;
			id: string;
		}
	>;
	messagesUntrash: GmailEndpoint<
		'messagesUntrash',
		{
			userId?: string;
			id: string;
		}
	>;
	labelsList: GmailEndpoint<
		'labelsList',
		{
			userId?: string;
		}
	>;
	labelsGet: GmailEndpoint<
		'labelsGet',
		{
			userId?: string;
			id: string;
		}
	>;
	labelsCreate: GmailEndpoint<
		'labelsCreate',
		{
			userId?: string;
			label: {
				name?: string;
				messageListVisibility?: 'show' | 'hide';
				labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
				color?: {
					textColor?: string;
					backgroundColor?: string;
				};
			};
		}
	>;
	labelsUpdate: GmailEndpoint<
		'labelsUpdate',
		{
			userId?: string;
			id: string;
			label: {
				name?: string;
				messageListVisibility?: 'show' | 'hide';
				labelListVisibility?: 'labelShow' | 'labelShowIfUnread' | 'labelHide';
				color?: {
					textColor?: string;
					backgroundColor?: string;
				};
			};
		}
	>;
	labelsDelete: GmailEndpoint<
		'labelsDelete',
		{
			userId?: string;
			id: string;
		}
	>;
	draftsList: GmailEndpoint<
		'draftsList',
		{
			userId?: string;
			maxResults?: number;
			pageToken?: string;
			q?: string;
		}
	>;
	draftsGet: GmailEndpoint<
		'draftsGet',
		{
			userId?: string;
			id: string;
			format?: 'minimal' | 'full' | 'raw' | 'metadata';
		}
	>;
	draftsCreate: GmailEndpoint<
		'draftsCreate',
		{
			userId?: string;
			draft: {
				message?: {
					raw?: string;
					threadId?: string;
				};
			};
		}
	>;
	draftsUpdate: GmailEndpoint<
		'draftsUpdate',
		{
			userId?: string;
			id: string;
			draft: {
				message?: {
					raw?: string;
					threadId?: string;
				};
			};
		}
	>;
	draftsDelete: GmailEndpoint<
		'draftsDelete',
		{
			userId?: string;
			id: string;
		}
	>;
	draftsSend: GmailEndpoint<
		'draftsSend',
		{
			userId?: string;
			id?: string;
			message?: {
				raw?: string;
				threadId?: string;
			};
		}
	>;
	threadsList: GmailEndpoint<
		'threadsList',
		{
			userId?: string;
			q?: string;
			maxResults?: number;
			pageToken?: string;
			labelIds?: string[];
			includeSpamTrash?: boolean;
		}
	>;
	threadsGet: GmailEndpoint<
		'threadsGet',
		{
			userId?: string;
			id: string;
			format?: 'minimal' | 'full' | 'metadata';
			metadataHeaders?: string[];
		}
	>;
	threadsModify: GmailEndpoint<
		'threadsModify',
		{
			userId?: string;
			id: string;
			addLabelIds?: string[];
			removeLabelIds?: string[];
		}
	>;
	threadsDelete: GmailEndpoint<
		'threadsDelete',
		{
			userId?: string;
			id: string;
		}
	>;
	threadsTrash: GmailEndpoint<
		'threadsTrash',
		{
			userId?: string;
			id: string;
		}
	>;
	threadsUntrash: GmailEndpoint<
		'threadsUntrash',
		{
			userId?: string;
			id: string;
		}
	>;
	usersGetProfile: GmailEndpoint<
		'usersGetProfile',
		{
			userId?: string;
		}
	>;
};

export type GmailBoundEndpoints = BindEndpoints<GmailEndpoints>;

type GmailWebhook<K extends keyof GmailWebhookOutputs, TEvent> = CorsairWebhook<
	GmailContext,
	GmailWebhookPayload,
	GmailWebhookOutputs[K]
>;

export type GmailWebhooks = {
	messageReceived: GmailWebhook<'messageReceived', MessageReceivedEvent>;
	messageDeleted: GmailWebhook<'messageDeleted', MessageDeletedEvent>;
	messageLabelChanged: GmailWebhook<
		'messageLabelChanged',
		MessageLabelChangedEvent
	>;
};

export type GmailBoundWebhooks = BindWebhooks<GmailWebhooks>;

const gmailEndpointsNested = {
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

const gmailWebhooksNested = {
	messageReceived: MessageWebhooks.messageReceived,
	messageDeleted: MessageWebhooks.messageDeleted,
	messageLabelChanged: MessageWebhooks.messageLabelChanged,
} as unknown as {
	messageReceived: GmailWebhooks['messageReceived'];
	messageDeleted: GmailWebhooks['messageDeleted'];
	messageLabelChanged: GmailWebhooks['messageLabelChanged'];
};

export type GmailPluginOptions = {
	authType?: PickAuth<'oauth_2'>;
	key?: string;
	hooks?: InternalGmailPlugin['hooks'];
	webhookHooks?: InternalGmailPlugin['webhookHooks'];
};

export type GmailKeyBuilderContext = KeyBuilderContext<GmailPluginOptions>;

const defaultAuthType: AuthTypes = 'oauth_2';

export type BaseGmailPlugin<T extends GmailPluginOptions> = CorsairPlugin<
	'gmail',
	typeof GmailSchema,
	typeof gmailEndpointsNested,
	typeof gmailWebhooksNested,
	T,
	typeof defaultAuthType
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
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gmailEndpointsNested,
		webhooks: gmailWebhooksNested,
		keyBuilder: async (ctx: GmailKeyBuilderContext) => {
			if (options.key) {
				return options.key;
			}

			if (ctx.authType === 'oauth_2') {
				const accessToken = await ctx.keys.getAccessToken();
				const refreshToken = await ctx.keys.getRefreshToken();

				if (!accessToken || !refreshToken) {
					// prob need to throw an error here
					return '';
				}

				const res = await ctx.keys.getIntegrationCredentials();

				if (!res.clientId || !res.clientSecret) {
					// prob need to throw an error here
					return '';
				}

				const key = await getValidAccessToken({
					accessToken,
					refreshToken,
					clientId: res.clientId,
					clientSecret: res.clientSecret,
				});

				return key;
			}

			return '';
		},
		pluginWebhookMatcher: (
			request: import('../../core/webhooks').RawWebhookRequest,
		) => {
			const body = request.body as Record<string, unknown>;
			return (body?.message as Record<string, unknown>)?.data !== undefined;
		},
	} satisfies InternalGmailPlugin;
}
