export type WebhookEventHandler<TEvent = any> = (event: TEvent) => void | Promise<void>;
export interface BaseHandleWebhookResult {
    success: boolean;
    error?: string;
}
export declare abstract class BaseWebhookHandler<TEventName extends string = string, TEvent = any> {
    protected handlers: Map<TEventName, WebhookEventHandler<TEvent>[]>;
    on(eventName: TEventName, handler: WebhookEventHandler<TEvent>): this;
    off(eventName: TEventName, handler: WebhookEventHandler<TEvent>): this;
    getRegisteredEvents(): TEventName[];
    hasHandlers(eventName: TEventName): boolean;
    clearHandlers(eventName?: TEventName): this;
    protected executeHandlers(eventName: TEventName, event: TEvent): Promise<void>;
}
//# sourceMappingURL=webhook-handler.d.ts.map