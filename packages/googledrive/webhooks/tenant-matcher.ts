import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, getHeader } from 'corsair/core';

// Google Drive push notifications echo the watch channel id in X-Goog-Channel-Id.
// See https://developers.google.com/workspace/drive/api/guides/push
export function matchGoogleDriveTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const channelId = firstString([
		getHeader(request.headers, 'x-goog-channel-id'),
	]);
	if (!channelId) return null;

	return { linkType: 'channel_id', externalId: channelId };
}
