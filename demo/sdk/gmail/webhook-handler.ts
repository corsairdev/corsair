import type {
    GmailEventName,
    GmailEventMap,
    PubSubNotification,
    GmailPushNotification,
    GmailWebhookEvent,
} from './webhooks';
import { HistoryService } from './services';

export type GmailEventHandler<T extends GmailEventName> = (
    event: GmailEventMap[T]
) => void | Promise<void>;

export interface GmailWebhookHandlerOptions {
    userId?: string;
    autoFetchHistory?: boolean;
}

export interface HandleWebhookResult {
    success: boolean;
    eventType?: GmailEventName;
    historyId?: string;
    error?: string;
}

export class GmailWebhookHandler {
    private userId: string;
    private autoFetchHistory: boolean;
    private handlers: Map<GmailEventName, GmailEventHandler<GmailEventName>[]> = new Map();
    private lastHistoryId?: string;

    constructor(options: GmailWebhookHandlerOptions = {}) {
        this.userId = options.userId || 'me';
        this.autoFetchHistory = options.autoFetchHistory ?? true;
    }

    on<T extends GmailEventName>(
        eventName: T,
        handler: GmailEventHandler<T>
    ): this {
        const existingHandlers = this.handlers.get(eventName) || [];
        existingHandlers.push(handler as GmailEventHandler<GmailEventName>);
        this.handlers.set(eventName, existingHandlers);
        return this;
    }

    off<T extends GmailEventName>(
        eventName: T,
        handler: GmailEventHandler<T>
    ): this {
        const existingHandlers = this.handlers.get(eventName) || [];
        const index = existingHandlers.indexOf(handler as GmailEventHandler<GmailEventName>);
        if (index !== -1) {
            existingHandlers.splice(index, 1);
            this.handlers.set(eventName, existingHandlers);
        }
        return this;
    }

    setLastHistoryId(historyId: string): void {
        this.lastHistoryId = historyId;
    }

    getLastHistoryId(): string | undefined {
        return this.lastHistoryId;
    }

    async handlePubSubNotification(notification: PubSubNotification): Promise<HandleWebhookResult> {
        try {
            if (!notification.message?.data) {
                return {
                    success: false,
                    error: 'No message data in notification',
                };
            }

            const decodedData = Buffer.from(notification.message.data, 'base64').toString('utf-8');
            const pushNotification: GmailPushNotification = JSON.parse(decodedData);

            if (!pushNotification.historyId || !pushNotification.emailAddress) {
                return {
                    success: false,
                    error: 'Invalid push notification format',
                };
            }

            const historyId = pushNotification.historyId;
            const emailAddress = pushNotification.emailAddress;

            if (this.autoFetchHistory && this.lastHistoryId) {
                try {
                    const historyResponse = await HistoryService.historyList(
                        this.userId,
                        this.lastHistoryId,
                        100
                    );

                    if (historyResponse.history && historyResponse.history.length > 0) {
                        await this.processHistory(emailAddress, historyId, historyResponse.history);
                    }
                } catch (error) {
                    console.error('Error fetching history:', error);
                }
            }

            const historyEvent: GmailWebhookEvent = {
                type: 'history',
                emailAddress,
                historyId,
            };

            await this.emit('history', historyEvent);

            this.lastHistoryId = historyId;

            return {
                success: true,
                eventType: 'history',
                historyId,
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }

    private async processHistory(emailAddress: string, historyId: string, history: any[]): Promise<void> {
        for (const historyItem of history) {
            if (historyItem.messagesAdded && historyItem.messagesAdded.length > 0) {
                for (const added of historyItem.messagesAdded) {
                    const event: GmailWebhookEvent = {
                        type: 'messageReceived',
                        emailAddress,
                        historyId,
                        message: added.message,
                    };
                    await this.emit('messageReceived', event);
                }
            }

            if (historyItem.messagesDeleted && historyItem.messagesDeleted.length > 0) {
                for (const deleted of historyItem.messagesDeleted) {
                    const event: GmailWebhookEvent = {
                        type: 'messageDeleted',
                        emailAddress,
                        historyId,
                        message: deleted.message,
                    };
                    await this.emit('messageDeleted', event);
                }
            }

            if (historyItem.labelsAdded && historyItem.labelsAdded.length > 0) {
                for (const labelChange of historyItem.labelsAdded) {
                    const event: GmailWebhookEvent = {
                        type: 'messageLabelChanged',
                        emailAddress,
                        historyId,
                        message: labelChange.message,
                        labelsAdded: labelChange.labelIds,
                    };
                    await this.emit('messageLabelChanged', event);
                }
            }

            if (historyItem.labelsRemoved && historyItem.labelsRemoved.length > 0) {
                for (const labelChange of historyItem.labelsRemoved) {
                    const event: GmailWebhookEvent = {
                        type: 'messageLabelChanged',
                        emailAddress,
                        historyId,
                        message: labelChange.message,
                        labelsRemoved: labelChange.labelIds,
                    };
                    await this.emit('messageLabelChanged', event);
                }
            }
        }
    }

    private async emit<T extends GmailEventName>(
        eventName: T,
        event: GmailEventMap[T]
    ): Promise<void> {
        const handlers = this.handlers.get(eventName);
        if (handlers && handlers.length > 0) {
            for (const handler of handlers) {
                try {
                    await handler(event);
                } catch (error) {
                    console.error(`Error in ${eventName} handler:`, error);
                }
            }
        }
    }

    async handleRawNotification(body: any): Promise<HandleWebhookResult> {
        return this.handlePubSubNotification(body as PubSubNotification);
    }
}

export function createWebhookHandler(options?: GmailWebhookHandlerOptions): GmailWebhookHandler {
    return new GmailWebhookHandler(options);
}

