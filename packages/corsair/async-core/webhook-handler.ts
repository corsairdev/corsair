export type WebhookEventHandler<TEvent = any> = (
	event: TEvent,
) => void | Promise<void>;

export interface BaseHandleWebhookResult {
	success: boolean;
	error?: string;
}

export abstract class BaseWebhookHandler<
	TEventName extends string = string,
	TEvent = any,
> {
	protected handlers: Map<TEventName, WebhookEventHandler<TEvent>[]> =
		new Map();

	on(eventName: TEventName, handler: WebhookEventHandler<TEvent>): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		existingHandlers.push(handler);
		this.handlers.set(eventName, existingHandlers);
		return this;
	}

	off(eventName: TEventName, handler: WebhookEventHandler<TEvent>): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		const index = existingHandlers.indexOf(handler);
		if (index !== -1) {
			existingHandlers.splice(index, 1);
			this.handlers.set(eventName, existingHandlers);
		}
		return this;
	}

	getRegisteredEvents(): TEventName[] {
		return Array.from(this.handlers.keys());
	}

	hasHandlers(eventName: TEventName): boolean {
		const handlers = this.handlers.get(eventName);
		return !!handlers && handlers.length > 0;
	}

	clearHandlers(eventName?: TEventName): this {
		if (eventName) {
			this.handlers.delete(eventName);
		} else {
			this.handlers.clear();
		}
		return this;
	}

	protected async executeHandlers(
		eventName: TEventName,
		event: TEvent,
	): Promise<void> {
		const handlers = this.handlers.get(eventName) || [];
		for (const handler of handlers) {
			await handler(event);
		}
	}
}
