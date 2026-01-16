import type { ApiRequestOptions } from '../../async-core/ApiRequestOptions';
import type { OpenAPIConfig } from '../../async-core/OpenAPI';
import { request } from '../../async-core/request';
import { BaseWebhookHandler } from '../../async-core/webhook-handler';
import { verifyHmacSignature } from '../../async-core/webhook-utils';
import type {
	LinearEventMap,
	LinearEventName,
	LinearWebhookEvent,
} from './webhooks/types';

export class LinearAPIError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = 'LinearAPIError';
	}
}

const LINEAR_API_BASE = 'https://api.linear.app/graphql';

export async function makeLinearRequest<T>(
	query: string,
	token: string,
	variables?: Record<string, unknown>,
): Promise<T> {
	const config: OpenAPIConfig = {
		BASE: LINEAR_API_BASE,
		VERSION: '1.0.0',
		WITH_CREDENTIALS: false,
		CREDENTIALS: 'omit',
		TOKEN: token,
		HEADERS: {
			'Content-Type': 'application/json',
		},
	};

	const requestOptions: ApiRequestOptions = {
		method: 'POST',
		url: '',
		body: {
			query,
			variables: variables || {},
		},
		mediaType: 'application/json',
	};

	try {
		const response = await request<{
			data?: T;
			errors?: Array<{ message: string }>;
		}>(config, requestOptions);

		if (response.errors && response.errors.length > 0) {
			const errorMessage = response.errors.map((e) => e.message).join(', ');
			throw new LinearAPIError(errorMessage);
		}

		if (!response.data) {
			throw new LinearAPIError('No data returned from Linear API');
		}

		return response.data as T;
	} catch (error) {
		if (error instanceof LinearAPIError) {
			throw error;
		}
		throw new LinearAPIError(
			error instanceof Error ? error.message : 'Unknown error',
		);
	}
}

export type LinearEventHandler<T extends LinearEventName> = (
	event: LinearEventMap[T],
) => void | Promise<void>;

export interface LinearWebhookHeaders {
	'linear-signature'?: string;
	'linear-delivery'?: string;
	[key: string]: string | undefined;
}

export interface LinearWebhookHandlerOptions {
	webhookSecret?: string;
}

export interface HandleWebhookResult {
	success: boolean;
	eventType?: string;
	action?: string;
	error?: string;
}

export class LinearWebhookHandler extends BaseWebhookHandler<
	LinearEventName,
	LinearEventMap[LinearEventName]
> {
	private webhookSecret?: string;

	constructor(options: LinearWebhookHandlerOptions = {}) {
		super();
		this.webhookSecret = options.webhookSecret;
	}

	on<T extends LinearEventName>(
		eventName: T,
		handler: LinearEventHandler<T>,
	): this {
		return super.on(eventName, handler as any) as this;
	}

	off<T extends LinearEventName>(
		eventName: T,
		handler: LinearEventHandler<T>,
	): this {
		return super.off(eventName, handler as any) as this;
	}

	verifySignature(payload: string, signature: string): boolean {
		if (!this.webhookSecret) {
			return true;
		}

		return verifyHmacSignature(payload, this.webhookSecret, signature);
	}

	async handleWebhook(
		headers: LinearWebhookHeaders,
		payload: string | LinearWebhookEvent,
	): Promise<HandleWebhookResult> {
		const payloadString =
			typeof payload === 'string' ? payload : JSON.stringify(payload);

		const parsedPayload: LinearWebhookEvent =
			typeof payload === 'string' ? JSON.parse(payload) : payload;

		if (this.webhookSecret) {
			const signature = headers['linear-signature'];

			if (!signature) {
				return {
					success: false,
					error: 'Missing linear-signature header',
				};
			}

			const isValid = this.verifySignature(payloadString, signature);
			if (!isValid) {
				return {
					success: false,
					error: 'Invalid signature',
				};
			}
		}

		const eventType = parsedPayload.type;
		const action = parsedPayload.action;

		const generalEventName = eventType as LinearEventName;
		const specificEventName =
			`${eventType}${action.charAt(0).toUpperCase() + action.slice(1)}` as LinearEventName;

		const generalHandlers = this.handlers.get(generalEventName) || [];
		const specificHandlers = this.handlers.get(specificEventName) || [];

		const allHandlers = [...generalHandlers, ...specificHandlers];

		try {
			for (const handler of allHandlers) {
				await handler(parsedPayload as any);
			}

			return {
				success: true,
				eventType,
				action,
			};
		} catch (error) {
			return {
				success: false,
				eventType,
				action,
				error:
					error instanceof Error ? error.message : 'Handler execution failed',
			};
		}
	}
}

export function createWebhookHandler(
	options?: LinearWebhookHandlerOptions,
): LinearWebhookHandler {
	return new LinearWebhookHandler(options);
}
