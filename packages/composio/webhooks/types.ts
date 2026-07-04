import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

const TriggerFiredEventDataSchema = z.object({
	triggerId: z.string(),
	appName: z.string(),
	payload: z.record(z.unknown()),
});

export const TriggerFiredEventSchema = z.object({
	type: z.literal('trigger.fired'),
	created_at: z.string(),
	data: TriggerFiredEventDataSchema,
});
export type TriggerFiredEvent = z.infer<typeof TriggerFiredEventSchema>;

const ConnectionStatusEventDataSchema = z.object({
	connectionId: z.string(),
	appName: z.string(),
	status: z.union([z.literal('connected'), z.literal('disconnected'), z.literal('error')]),
	error: z.string().optional(),
});

export const ConnectionStatusEventSchema = z.object({
	type: z.literal('connection.status'),
	created_at: z.string(),
	data: ConnectionStatusEventDataSchema,
});
export type ConnectionStatusEvent = z.infer<typeof ConnectionStatusEventSchema>;

const ActionCompletedEventDataSchema = z.object({
	executionId: z.string(),
	actionId: z.string(),
	status: z.union([z.literal('success'), z.literal('failed')]),
	output: z.record(z.unknown()).optional(),
	error: z.string().optional(),
});

export const ActionCompletedEventSchema = z.object({
	type: z.literal('action.completed'),
	created_at: z.string(),
	data: ActionCompletedEventDataSchema,
});
export type ActionCompletedEvent = z.infer<typeof ActionCompletedEventSchema>;

export type ComposioWebhookPayload = TriggerFiredEvent | ConnectionStatusEvent | ActionCompletedEvent;

export type ComposioWebhookOutputs = {
	triggerFired: TriggerFiredEvent;
	connectionStatus: ConnectionStatusEvent;
	actionCompleted: ActionCompletedEvent;
};

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return null;
		}
	}
	return (body ?? {}) as Record<string, unknown>;
}

export function createComposioMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		if (!parsedBody) return false;
		return typeof parsedBody.type === 'string' && parsedBody.type === eventType;
	};
}

export function verifyComposioWebhookSignature(
	request: WebhookRequest<ComposioWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	const signature = Array.isArray(request.headers['x-composio-signature'])
		? request.headers['x-composio-signature'][0]
		: request.headers['x-composio-signature'];

	if (!signature || !request.rawBody) {
		return { valid: false, error: 'Signature verification failed' };
	}

	const isValid = verifyHmacSignature(request.rawBody, secret, signature);
	if (!isValid) {
		return { valid: false, error: 'Signature verification failed' };
	}

	return { valid: true };
}
