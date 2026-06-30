import type { CorsairWebhookMatcher, RawWebhookRequest } from 'corsair/core';

export type GoogleMeetWebhookOutputs = {};

export function createGoogleMeetWebhookMatcher(): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		return false;
	};
}
