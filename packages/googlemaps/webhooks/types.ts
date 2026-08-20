import type { WebhookRequest } from 'corsair/core';

export type GoogleMapsWebhookOutputs = {};

export function verifyGoogleMapsWebhookSignature(
	_request: WebhookRequest<unknown>,
	_secret: string,
): { valid: boolean; error?: string } {
	return { valid: false, error: 'Google Maps does not support webhooks' };
}
