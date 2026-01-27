import type { AuthTypes } from '../../constants';
import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
} from '../../core';
import type { GmailEndpointOutputs } from './endpoints';
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

export type GmailContext = CorsairPluginContext<
	'gmail',
	typeof GmailSchema,
	GmailCredentials
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

type GmailWebhook<
	K extends keyof GmailWebhookOutputs,
	TEvent,
> = CorsairWebhook<GmailContext, GmailWebhookPayload, GmailWebhookOutputs[K]>;

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
	authType: AuthTypes;
	credentials: GmailCredentials;
	hooks?: GmailPlugin['hooks'] | undefined;
	webhookHooks?: GmailPlugin['webhookHooks'] | undefined;
};

export type GmailPlugin = CorsairPlugin<
	'gmail',
	typeof gmailEndpointsNested,
	typeof GmailSchema,
	GmailCredentials,
	typeof gmailWebhooksNested
>;

export function gmail(options: GmailPluginOptions) {
	return {
		id: 'gmail',
		schema: GmailSchema,
		options: options.credentials,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: gmailEndpointsNested,
		webhooks: gmailWebhooksNested,
		pluginWebhookMatcher: (request: import('../../core/webhooks').RawWebhookRequest) => {
			const body = request.body as Record<string, unknown>;
			return (body?.message as Record<string, unknown>)?.data !== undefined;
		},
	} as GmailPlugin;
}
