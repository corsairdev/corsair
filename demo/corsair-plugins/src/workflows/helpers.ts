import { corsair } from '@/server/corsair';

export async function getSlackChannel(tenantId: string, channelName: string) {
	const tenant = corsair.withTenant(tenantId);
	const channels = await tenant.slack.db.channels.search({
		data: { name: channelName },
	});
	let channel = channels?.[0];
	if (!channel?.id) {
		await tenant.slack.api.channels.list({ exclude_archived: true });
		const dbChannels = await tenant.slack.db.channels.search({
			data: { name: channelName },
		});
		channel = dbChannels?.[0];
	}
	if (!channel?.id) {
		throw new Error(`Couldn't find #${channelName} channel`);
	}
	return channel.entity_id;
}
