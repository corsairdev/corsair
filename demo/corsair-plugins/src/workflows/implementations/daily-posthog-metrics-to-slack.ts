import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function dailyPosthogMetricsToSlack(params?: { tenantId?: string }) {
	const tenantId = params?.tenantId || 'default';
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - 1);
	const yesterday = {
		start: new Date(date.setHours(0, 0, 0, 0)).toISOString(),
		end: new Date(date.setHours(23, 59, 59, 999)).toISOString(),
	};

	const events = await tenant.posthog.db.events.search({
		data: {
			created_at: {
				$gte: yesterday.start,
				$lte: yesterday.end,
			},
		},
	});

	const eventCount = events.length;
	const distinctIds = new Set(events.map((e: any) => e.distinct_id));
	const uniqueUsers = distinctIds.size;

	const eventCounts: Record<string, number> = {};
	events.forEach((e: any) => {
		const eventName = e.event_type || 'unknown';
		eventCounts[eventName] = (eventCounts[eventName] || 0) + 1;
	});
	const topEvents = Object.entries(eventCounts)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5)
		.map(([name, count]) => ({ name, count }));

	const topEventsList = topEvents.map(e => `  • ${e.name}: ${e.count}`).join('\n');
	const metrics = `📊 *Daily PostHog Metrics - ${new Date(yesterday.start).toLocaleDateString()}*\n\n*Total Events:* ${eventCount}\n*Unique Users:* ${uniqueUsers}\n\n*Top Events:*\n${topEventsList}`;

	const slackChannel = await getSlackChannel(tenantId, 'analytics');

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: metrics,
	});

	return {
		success: true,
		eventCount,
		uniqueUsers,
		topEvents,
		processedAt: new Date().toISOString(),
	};
}
