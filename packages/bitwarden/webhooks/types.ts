import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';

// Bitwarden webhooks not currently implemented
export type BitwardenWebhookOutputs = Record<string, never>;

function parseBody(body: unknown): Record<string, unknown> {
	if (typeof body === 'string') {
		return JSON.parse(body) as Record<string, unknown>;
	}
	return (body ?? {}) as Record<string, unknown>;
}

export function createBitwardenMatch(
	_eventType: string,
): CorsairWebhookMatcher {
	return (_request: RawWebhookRequest) => {
		return false;
	};
}
