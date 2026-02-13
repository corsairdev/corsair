import { corsair } from '@/server/corsair';

export async function exportSlackAnalyticsToPosthog(params: {
	tenantId: string;
	channelName?: string;
	daysAgo?: number;
}) {
	const { tenantId, channelName, daysAgo = 7 } = params;
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	const timeRange = date.toISOString();

	let channels;
	if (channelName) {
		const found = await tenant.slack.db.channels.search({
			data: { name: channelName },
		});
		channels = found.length > 0 ? [found[0]] : [];
	} else {
		await tenant.slack.api.channels.list({ exclude_archived: true });
		const allChannels = await tenant.slack.db.channels.search({
			data: {},
		});
		channels = allChannels.filter((c: any) => !c.is_archived);
	}

	let totalEvents = 0;
	for (const channel of channels) {
		try {
			const messages = await tenant.slack.api.messages.list({
				channel: channel.entity_id,
				oldest: Math.floor(new Date(timeRange).getTime() / 1000).toString(),
			});
			const messageList = messages.messages || [];
			for (const message of messageList.slice(0, 100)) {
				await tenant.posthog.api.events.eventCreate({
					event: 'slack.message.sent',
					distinct_id: message.user || 'unknown',
					properties: {
						channel: channel.name,
						channel_id: channel.entity_id,
						message_length: message.text?.length || 0,
						has_thread: !!message.thread_ts,
						timestamp: message.ts,
					},
				});
				totalEvents++;
			}
		} catch (error) {
			console.error(`Error processing channel ${channel.name}:`, error);
		}
	}

	return {
		success: true,
		channelsProcessed: channels.length,
		eventsCreated: totalEvents,
		timeRange,
		processedAt: new Date().toISOString(),
	};
}
