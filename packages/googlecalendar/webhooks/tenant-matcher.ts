import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import {
	asRecord,
	decodePubSubData,
	firstString,
	getHeader,
	readBodyRecord,
} from 'corsair/core';

// Google Calendar push notifications echo the watch channel id in X-Goog-Channel-Id.
// See https://developers.google.com/workspace/calendar/api/guides/push
export function matchGoogleCalendarTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const channelId = firstString([
		getHeader(request.headers, 'x-goog-channel-id'),
	]);
	if (channelId) {
		return { linkType: 'channel_id', externalId: channelId };
	}

	// Fallback for Pub/Sub-wrapped calendar notifications that include channelId in data.
	const body = readBodyRecord(request);
	if (!body) return null;

	const decoded = asRecord(decodePubSubData(body));
	const pubsubChannelId = firstString([decoded?.channelId]);
	if (!pubsubChannelId) return null;

	return { linkType: 'channel_id', externalId: pubsubChannelId };
}
