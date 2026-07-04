import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';

export interface ComposioWebhookPayload {
	type: string;
	created_at: string;
	data: Record<string, unknown>;
}

export interface TriggerFiredEvent extends ComposioWebhookPayload {
	type: 'trigger.fired';
	data: {
		triggerId: string;
		appName: string;
		payload: Record<string, unknown>;
	};
}

export interface ConnectionStatusEvent extends ComposioWebhookPayload {
	type: 'connection.status';
	data: {
		connectionId: string;
		appName: string;
		status: 'connected' | 'disconnected' | 'error';
		error?: string;
	};
}

export interface ActionCompletedEvent extends ComposioWebhookPayload {
	type: 'action.completed';
	data: {
		executionId: string;
		actionId: string;
		status: 'success' | 'failed';
		output?: Record<string, unknown>;
		error?: string;
	};
}

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

	if (!signature) {
		return { valid: false, error: 'Missing x-composio-signature header' };
	}

	if (!request.rawBody) {
		return { valid: false, error: 'Missing raw body for signature verification' };
	}

	const isValid = verifyHmacSignature(request.rawBody, secret, signature);
	if (!isValid) {
		return { valid: false, error: 'Invalid signature' };
	}

	return { valid: true };
}
