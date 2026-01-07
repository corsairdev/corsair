import * as crypto from 'crypto';
import type {
	AppMentionEvent,
	ChannelCreatedEvent,
	FileCreatedEvent,
	FilePublicEvent,
	FileSharedEvent,
	MessageEvent,
	ReactionAddedEvent,
	ReactionRemovedEvent,
	TeamJoinEvent,
	UserChangeEvent,
} from './slack-types';

export type SlackEventName =
	| 'message'
	| 'app_mention'
	| 'file_shared'
	| 'file_created'
	| 'file_public'
	| 'channel_created'
	| 'reaction_added'
	| 'reaction_removed'
	| 'team_join'
	| 'user_change';

export interface SlackEventMap {
	message: MessageEvent;
	app_mention: AppMentionEvent;
	file_shared: FileSharedEvent;
	file_created: FileCreatedEvent;
	file_public: FilePublicEvent;
	channel_created: ChannelCreatedEvent;
	reaction_added: ReactionAddedEvent;
	reaction_removed: ReactionRemovedEvent;
	team_join: TeamJoinEvent;
	user_change: UserChangeEvent;
}

export type SlackEventHandler<T extends SlackEventName> = (
	event: SlackEventMap[T],
) => void | Promise<void>;

export interface SlackWebhookHeaders {
	'x-slack-signature'?: string;
	'x-slack-request-timestamp'?: string;
	'content-type'?: string;
	[key: string]: string | undefined;
}

export interface SlackWebhookHandlerOptions {
	signingSecret?: string;
}

export interface SlackWebhookPayload {
	token?: string;
	team_id?: string;
	api_app_id?: string;
	event?: {
		type: string;
		[key: string]: any;
	};
	type: string;
	event_id?: string;
	event_time?: number;
	challenge?: string;
}

export interface HandleWebhookResult {
	success: boolean;
	eventType?: SlackEventName;
	error?: string;
	challenge?: string;
}

export class SlackWebhookHandler {
	private signingSecret?: string;
	private handlers: Map<SlackEventName, SlackEventHandler<SlackEventName>[]> =
		new Map();

	constructor(options: SlackWebhookHandlerOptions = {}) {
		this.signingSecret = options.signingSecret;
	}

	on<T extends SlackEventName>(
		eventName: T,
		handler: SlackEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		existingHandlers.push(handler as SlackEventHandler<SlackEventName>);
		this.handlers.set(eventName, existingHandlers);
		return this;
	}

	off<T extends SlackEventName>(
		eventName: T,
		handler: SlackEventHandler<T>,
	): this {
		const existingHandlers = this.handlers.get(eventName) || [];
		const index = existingHandlers.indexOf(
			handler as SlackEventHandler<SlackEventName>,
		);
		if (index !== -1) {
			existingHandlers.splice(index, 1);
			this.handlers.set(eventName, existingHandlers);
		}
		return this;
	}

	verifySignature(
		payload: string,
		timestamp: string,
		signature: string,
	): boolean {
		if (!this.signingSecret) {
			return true;
		}

		if (!signature || !timestamp) {
			return false;
		}

		const currentTime = Math.floor(Date.now() / 1000);
		const requestTime = parseInt(timestamp, 10);

		if (Math.abs(currentTime - requestTime) > 60 * 5) {
			return false;
		}

		const sigBasestring = `v0:${timestamp}:${payload}`;
		const expectedSignature =
			'v0=' +
			crypto
				.createHmac('sha256', this.signingSecret)
				.update(sigBasestring)
				.digest('hex');

		try {
			return crypto.timingSafeEqual(
				Buffer.from(signature),
				Buffer.from(expectedSignature),
			);
		} catch {
			return false;
		}
	}

	async handleWebhook(
		headers: SlackWebhookHeaders,
		payload: string | SlackWebhookPayload,
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		const parsedPayload: SlackWebhookPayload =
			typeof payload === 'string' ? JSON.parse(payload) : payload;

		if (parsedPayload.type === 'url_verification') {
			return {
				success: true,
				challenge: parsedPayload.challenge,
			};
		}

		if (this.signingSecret) {
			const signature = headers['x-slack-signature'];
			const timestamp = headers['x-slack-request-timestamp'];

			if (!signature || !timestamp) {
				return {
					success: false,
					error: 'Missing signature or timestamp header',
				};
			}

			const isValid = this.verifySignature(payloadString, timestamp, signature);
			if (!isValid) {
				return {
					success: false,
					error: 'Invalid signature',
				};
			}
		}

		if (parsedPayload.type !== 'event_callback' || !parsedPayload.event) {
			return {
				success: false,
				error: 'Invalid event payload',
			};
		}

		const event = parsedPayload.event;
		const eventType = event.type as SlackEventName;

		const handlers = this.handlers.get(eventType) || [];

		try {
			for (const handler of handlers) {
				await handler(event as any);
			}

			return {
				success: true,
				eventType: eventType,
			};
		} catch (error) {
			return {
				success: false,
				eventType: eventType,
				error:
					error instanceof Error ? error.message : 'Handler execution failed',
			};
		}
	}

	getRegisteredEvents(): SlackEventName[] {
		return Array.from(this.handlers.keys());
	}

	hasHandlers(eventName: SlackEventName): boolean {
		const handlers = this.handlers.get(eventName);
		return !!handlers && handlers.length > 0;
	}

	clearHandlers(eventName?: SlackEventName): this {
		if (eventName) {
			this.handlers.delete(eventName);
		} else {
			this.handlers.clear();
		}
		return this;
	}
}

export function createWebhookHandler(
	options?: SlackWebhookHandlerOptions,
): SlackWebhookHandler {
	return new SlackWebhookHandler(options);
}
