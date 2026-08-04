import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { firstString, getHeader } from 'corsair/core';

// Google Drive watch channels (used for Docs, which have no native push) echo
// the channel id back in X-Goog-Channel-Id. The runtime resolves the tenant
// from the channel_id saved per plugin/account during subscribe.
export function matchGoogleDocsTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const channelId = firstString([
		getHeader(request.headers, 'x-goog-channel-id'),
	]);
	if (!channelId) return null;

	return { linkType: 'channel_id', externalId: channelId };
}
