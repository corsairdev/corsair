import type { WebhookRequest } from 'corsair/core';

// APIpie does not support webhooks
export type ApipieWebhookOutputs = Record<string, never>;

export function verifyApipieWebhookSignature(
	_request: WebhookRequest<unknown>,
	_secret: string,
): { valid: boolean; error?: string } {
	return { valid: false, error: 'APIpie does not support webhooks' };
}
