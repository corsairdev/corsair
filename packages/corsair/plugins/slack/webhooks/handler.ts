import { BaseWebhookHandler } from '../../../core/webhook-handler';
import { verifySlackSignature } from '../../../core/webhook-utils';
import type {
	SlackEventMap,
	SlackEventName,
} from './types';

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

export interface HandleWebhookResult {
	success: boolean;
	eventType?: SlackEventName;
	error?: string;
	challenge?: string;
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

export class SlackWebhookHandler extends BaseWebhookHandler<
	SlackEventName,
	SlackEventMap[SlackEventName]
> {
	private signingSecret?: string;

	constructor(options: SlackWebhookHandlerOptions = {}) {
		super();
		this.signingSecret = options.signingSecret;
	}

	on<T extends SlackEventName>(
		eventName: T,
		handler: SlackEventHandler<T>,
	): this {
		return super.on(eventName, handler as any) as this;
	}

	off<T extends SlackEventName>(
		eventName: T,
		handler: SlackEventHandler<T>,
	): this {
		return super.off(eventName, handler as any) as this;
	}

	verifySignature(
		payload: string,
		timestamp: string,
		signature: string,
	): boolean {
		if (!this.signingSecret) {
			return true;
		}

		return verifySlackSignature(payload, this.signingSecret, timestamp, signature);
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

		try {
			await this.executeHandlers(eventType, event as any);

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
}

export function createWebhookHandler(
	options?: SlackWebhookHandlerOptions,
): SlackWebhookHandler {
	return new SlackWebhookHandler(options);
}

