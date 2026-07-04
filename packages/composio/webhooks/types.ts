import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';

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

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		return JSON.parse(body) as Record<string, unknown>;
	}
	return (body ?? {}) as Record<string, unknown>;
}

export function createComposioMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return typeof parsedBody.type === 'string' && parsedBody.type === eventType;
	};
}

export function verifyComposioWebhookSignature(
	request: WebhookRequest<ComposioWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	const signature = request.headers['x-composio-signature'];
	if (!signature) {
		return { valid: false, error: 'Missing x-composio-signature header' };
	}

	return { valid: true };
}
