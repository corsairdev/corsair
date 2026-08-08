import type { WebhookRequest } from 'corsair/core';

export type OllamaWebhookOutputs = {};

export function verifyOllamaWebhookSignature(
	_request: WebhookRequest<unknown>,
	_secret: string,
): { valid: boolean; error?: string } {
	return { valid: false, error: 'Ollama does not support webhooks' };
}
