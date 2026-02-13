import { corsair } from '@/server/corsair';

export async function syncSlackChannelsToLinear(params: {
	tenantId: string;
}) {
	const { tenantId } = params;
	const tenant = corsair.withTenant(tenantId);

	await tenant.slack.api.channels.list({ exclude_archived: true });
	const dbChannels = await tenant.slack.db.channels.search({
		data: {},
	});
	const channels = dbChannels.filter((c: any) => !c.is_archived);

	const teamId = process.env.LINEAR_TEAM_ID || '';

	const createdIssues = [];
	for (const channel of channels.slice(0, 50)) {
		try {
			const channelInfo = await tenant.slack.api.channels.get({
				channel: channel.entity_id,
			});
			const issue = await tenant.linear.api.issues.create({
				title: `[Slack] Channel: ${channel.name || channelInfo.name}`,
				description: `Slack channel synced to Linear\n\n*Channel Name:* ${channel.name || channelInfo.name}\n*Channel ID:* ${channel.entity_id}\n*Purpose:* ${channelInfo.purpose?.value || 'N/A'}\n*Member Count:* ${channelInfo.num_members || 0}\n*Created:* ${new Date((channelInfo.created || 0) * 1000).toISOString()}`,
				teamId,
				priority: 3,
			});
			createdIssues.push(issue);
		} catch (error) {
			console.error(`Error creating issue for channel ${channel.name}:`, error);
		}
	}

	return {
		success: true,
		channelsProcessed: channels.length,
		issuesCreated: createdIssues.length,
		processedAt: new Date().toISOString(),
	};
}
