import { corsair } from '@/server/corsair';

export async function syncPosthogEventsToLinear(params: {
	tenantId: string;
	daysAgo?: number;
}) {
	const { tenantId, daysAgo = 7 } = params;
	const tenant = corsair.withTenant(tenantId);

	const date = new Date();
	date.setDate(date.getDate() - daysAgo);
	const timeRange = date.toISOString();

	const criticalEvents = await tenant.posthog.db.events.search({
		data: {
			created_at: { $gte: timeRange },
			event_type: { $like: '%error%' },
		},
	});

	const teamId = process.env.LINEAR_TEAM_ID || '';

	const createdIssues = [];
	for (const event of criticalEvents.slice(0, 50)) {
		try {
			const issue = await tenant.linear.api.issues.create({
				title: `[PostHog] ${event.event_type || 'Event'} - ${event.distinct_id || 'Unknown'}`,
				description: `PostHog event synced to Linear\n\n*Event Type:* ${event.event_type}\n*User:* ${event.distinct_id}\n*Timestamp:* ${event.created_at}\n*Properties:* ${JSON.stringify(event.properties || {}, null, 2)}`,
				teamId,
				priority: 2,
			});
			createdIssues.push(issue);
		} catch (error) {
			console.error(`Error creating issue for event ${event.id}:`, error);
		}
	}

	return {
		success: true,
		eventsProcessed: criticalEvents.length,
		issuesCreated: createdIssues.length,
		timeRange,
		processedAt: new Date().toISOString(),
	};
}
