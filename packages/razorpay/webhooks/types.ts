import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from 'corsair/core';

export interface RazorpayWebhookPayload {
	type: string;
	created_at: string;
	data: Record<string, unknown>;
}

export interface ExampleEvent extends RazorpayWebhookPayload {
	type: 'example';
	data: {
		id: string;
		[key: string]: unknown;
	};
}

export type RazorpayWebhookOutputs = {
	example: ExampleEvent;
};

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		return JSON.parse(body) as Record<string, unknown>;
	}
	return (body ?? {}) as Record<string, unknown>;
}

export function createRazorpayMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		const parsedBody = parseBody(request.body);
		return typeof parsedBody.type === 'string' && parsedBody.type === eventType;
	};
}

export function verifyRazorpayWebhookSignature(
	request: WebhookRequest<RazorpayWebhookPayload>,
	secret: string,
): { valid: boolean; error?: string } {
	// TODO: Implement webhook signature verification
	return { valid: true };
}
