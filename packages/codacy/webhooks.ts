import type {
	CorsairWebhookHandler,
	CorsairWebhookMatcher,
} from 'corsair/core';
import { z } from 'zod';

/**
 * Codacy webhook event payload - varies by event type
 */
export const CodacyWebhookPayloadSchema = z.record(z.string(), z.unknown());
export type CodacyWebhookPayload = z.infer<typeof CodacyWebhookPayloadSchema>;

export const CodacyWebhookEventSchema = z.object({
	event: z.string(),
	timestamp: z.string().datetime(),
	payload: z.record(z.string(), z.unknown()),
});
export type CodacyWebhookEvent = z.infer<typeof CodacyWebhookEventSchema>;

export type CodacyWebhooks = {
	default: CodacyWebhookEvent;
};

export type CodacyWebhookOutputs = {
	default: CodacyWebhookEvent;
};

/**
 * Match incoming Codacy webhook requests.
 * Codacy webhooks include an X-Codacy-Event header identifying the event type.
 */
export const webhookMatcher: CorsairWebhookMatcher = (req) => {
	const event = req.headers['x-codacy-event'] ?? req.headers['X-Codacy-Event'];
	return !!event;
};

export const webhookHandler: CorsairWebhookHandler = async (_ctx, req) => {
	const event =
		(req.headers['x-codacy-event'] as string) ??
		(req.headers['X-Codacy-Event'] as string) ??
		'unknown';

	return {
		success: true,
		data: {
			event,
			payload: req.payload,
			timestamp: new Date().toISOString(),
		},
	};
};

export const codacyWebhooksNested = {
	default: {
		match: (req: {
			headers: Record<string, string | string[] | undefined>;
		}) => {
			const event =
				req.headers['x-codacy-event'] ?? req.headers['X-Codacy-Event'];
			return !!event;
		},
		handler: async (
			_ctx: unknown,
			req: {
				payload: Record<string, unknown>;
				headers: Record<string, string | string[] | undefined>;
			},
		) => {
			const event =
				(req.headers['x-codacy-event'] as string) ??
				(req.headers['X-Codacy-Event'] as string) ??
				'unknown';

			return {
				success: true,
				data: {
					event,
					payload: req.payload,
					timestamp: new Date().toISOString(),
				},
			};
		},
	},
} as const;

export const webhookSchemas = {
	default: {
		event: z.string(),
		timestamp: z.string().datetime(),
		payload: z.record(z.string(), z.unknown()),
	},
} as const;
