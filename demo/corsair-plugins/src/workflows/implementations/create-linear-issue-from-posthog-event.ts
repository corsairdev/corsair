import { corsair } from '@/server/corsair';

export async function createLinearIssueFromPosthogEvent(params: {
	tenantId: string;
	event: any;
}) {
	const { tenantId, event: posthogEvent } = params;
	const tenant = corsair.withTenant(tenantId);

	const eventData = posthogEvent.data;

	const eventName = eventData.event?.toLowerCase() || '';
	const isCriticalEvent = eventName.includes('error') || 
		   eventName.includes('crash') || 
		   eventName.includes('critical');

	if (!isCriticalEvent) {
		return { skipped: true, reason: 'Not a critical event' };
	}

	const teamId = process.env.LINEAR_TEAM_ID || '';

	const issueTitle = `[PostHog] ${eventData.event} - ${eventData.distinct_id || 'Unknown User'}`;

	const issueDescription = `Critical event detected in PostHog\n\n*Event:* ${eventData.event}\n*User:* ${eventData.distinct_id || 'Unknown'}\n*Timestamp:* ${eventData.timestamp || new Date().toISOString()}\n*Properties:* ${JSON.stringify(eventData.properties || {}, null, 2)}`;

	const issue = await tenant.linear.api.issues.create({
		title: issueTitle,
		description: issueDescription,
		teamId,
		priority: 1,
	});

	return {
		success: true,
		issueId: issue.id,
		identifier: issue.identifier,
		eventName: eventData.event,
		processedAt: new Date().toISOString(),
	};
}
