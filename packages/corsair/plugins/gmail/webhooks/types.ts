import type { History, Message } from '../types';

export type PubSubMessage = {
	data?: string;
	attributes?: Record<string, string>;
	messageId?: string;
	publishTime?: string;
};

export type PubSubNotification = {
	message?: PubSubMessage;
	subscription?: string;
};

export type GmailPushNotification = {
	emailAddress?: string;
	historyId?: string;
};

export type HistoryEvent = {
	type: 'history';
	emailAddress: string;
	historyId: string;
	history?: History[];
};

export type MessageReceivedEvent = {
	type: 'messageReceived';
	emailAddress: string;
	historyId: string;
	message: Message;
};

export type MessageDeletedEvent = {
	type: 'messageDeleted';
	emailAddress: string;
	historyId: string;
	message: Message;
};

export type MessageLabelChangedEvent = {
	type: 'messageLabelChanged';
	emailAddress: string;
	historyId: string;
	message: Message;
	labelsAdded?: string[];
	labelsRemoved?: string[];
};

export type GmailWebhookEvent =
	| HistoryEvent
	| MessageReceivedEvent
	| MessageDeletedEvent
	| MessageLabelChangedEvent;

export type GmailEventName =
	| 'history'
	| 'messageReceived'
	| 'messageDeleted'
	| 'messageLabelChanged';

export interface GmailEventMap {
	history: HistoryEvent;
	messageReceived: MessageReceivedEvent;
	messageDeleted: MessageDeletedEvent;
	messageLabelChanged: MessageLabelChangedEvent;
}

export type GmailWebhookPayload = PubSubNotification;

export type GmailWebhookOutputs = {
	messageReceived: MessageReceivedEvent;
	messageDeleted: MessageDeletedEvent;
	messageLabelChanged: MessageLabelChangedEvent;
	history: HistoryEvent;
};
