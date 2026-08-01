import type { WebhookRequest } from 'corsair/core';

// AIMLAPI does not support webhooks
export type AimlApiWebhookOutputs = Record<string, never>;

export function verifyAimlApiWebhookSignature(
	_request: WebhookRequest<unknown>,
	_secret: string,
): { valid: boolean; error?: string } {
	return { valid: false, error: 'AI/ML API does not support webhooks' };
}
