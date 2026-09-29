import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';

export type GoogleAnalyticsWebhookOutputs = {};

export function createGoogleAnalyticsWebhookMatcher(): CorsairWebhookMatcher {
	return (_request: RawWebhookRequest) => {
		return false;
	};
}
