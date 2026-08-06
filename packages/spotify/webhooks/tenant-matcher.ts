import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';

// Spotify does not offer a public webhook API; payloads have no tenant identifier.
// See https://github.com/spotify/web-api/issues/538
export function matchSpotifyTenantWebhook(
	_request: RawWebhookRequest,
): WebhookTenantMatch | null {
	return null;
}
