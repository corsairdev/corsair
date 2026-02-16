import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
} from '../../../core/webhooks';
import type { History, Message } from '../types';

export type PubSubMessage = {
	data?: string;
	attributes?: Record<string, string>;
	messageId?: string;
	publishTime?: string;
};

export type PubSubNotification<TEvent = unknown> = {
	message?: PubSubMessage;
	subscription?: string;
	event?: TEvent;
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

export type GmailWebhookPayload<TEvent = unknown> = PubSubNotification<TEvent>;

export type GmailWebhookOutputs = {
	messageReceived: MessageReceivedEvent;
	messageDeleted: MessageDeletedEvent;
	messageLabelChanged: MessageLabelChangedEvent;
	history: HistoryEvent;
};

export function decodePubSubMessage(data: string): GmailPushNotification {
	const decodedData = Buffer.from(data, 'base64').toString('utf-8');
	return JSON.parse(decodedData);
}

export function createGmailWebhookMatcher(
	eventType: GmailEventName,
): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const body = request.body as PubSubNotification;
		if (!body.message?.data) {
			return false;
		}

		try {
			const pushNotification = decodePubSubMessage(body.message.data!);
			return !!pushNotification.historyId && !!pushNotification.emailAddress;
		} catch {
			return false;
		}
	};
}
