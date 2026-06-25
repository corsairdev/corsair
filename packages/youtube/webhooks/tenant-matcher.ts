import type { RawWebhookRequest, WebhookTenantMatch } from 'corsair/core';
import { asRecord, decodePubSubData, firstString } from 'corsair/core';

const CHANNEL_ID_PATTERN = /channel_id=([A-Za-z0-9_-]+)/;

function extractChannelIdFromAtomXml(body: string): string | undefined {
	const channelIdMatch = body.match(/<yt:channelId>([^<]+)<\/yt:channelId>/);
	if (channelIdMatch?.[1]) return channelIdMatch[1];

	const topicMatch = body.match(CHANNEL_ID_PATTERN);
	if (topicMatch?.[1]) return topicMatch[1];

	const uriMatch = body.match(
		/<uri>https?:\/\/www\.youtube\.com\/channel\/([^<]+)<\/uri>/,
	);
	if (uriMatch?.[1]) return uriMatch[1];

	return undefined;
}

function extractYoutubeChannelId(body: unknown): string | undefined {
	if (typeof body === 'string') {
		const trimmed = body.trim();
		if (!trimmed) return undefined;
		return extractChannelIdFromAtomXml(trimmed);
	}

	const bodyRecord = asRecord(body);
	if (!bodyRecord) return undefined;

	const decoded = decodePubSubData(bodyRecord);
	if (typeof decoded === 'string') {
		return extractChannelIdFromAtomXml(decoded);
	}

	return firstString([
		bodyRecord.channel_id,
		bodyRecord.channelId,
		asRecord(bodyRecord.entry)?.channel_id,
	]);
}

// YouTube PubSubHubbub: Atom XML notifications include yt:channelId on each entry.
// See https://developers.google.com/youtube/v3/guides/push_notifications
export function matchYoutubeTenantWebhook(
	request: RawWebhookRequest,
): WebhookTenantMatch | null {
	const body = request.body;
	if (body === null || body === undefined) return null;

	const channelId = extractYoutubeChannelId(body);
	if (!channelId) return null;

	return { linkType: 'channel_id', externalId: channelId };
}
