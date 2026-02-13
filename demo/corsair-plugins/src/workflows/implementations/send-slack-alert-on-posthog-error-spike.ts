import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function sendSlackAlertOnPosthogErrorSpike(params: {
	tenantId: string;
	event: any;
}) {
	const { tenantId, event: posthogEvent } = params;
	const tenant = corsair.withTenant(tenantId);

	const eventData = posthogEvent.data;

	const eventName = eventData.event?.toLowerCase() || '';
	const isErrorEvent = eventName.includes('error') || 
		   eventName.includes('exception') || 
		   eventName.includes('crash');

	if (!isErrorEvent) {
		return { skipped: true, reason: 'Not an error event' };
	}

	const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
	const errors = await tenant.posthog.db.events.search({
		data: {
			event_type: { $like: '%error%' },
			created_at: { $gte: oneHourAgo.toISOString() },
		},
	});
	const recentErrors = errors.length;

	const threshold = recentErrors > 10;

	if (!threshold) {
		return { skipped: true, reason: 'Error count below threshold' };
	}

	const slackChannel = await getSlackChannel(tenantId, 'alerts');

	const alertMessage = `🚨 *Error Spike Detected*\n*Event:* ${eventData.event}\n*Recent Errors (1h):* ${recentErrors}\n*Threshold:* 10 errors\n*Time:* ${new Date().toISOString()}\n*User:* ${eventData.distinct_id || 'Unknown'}`;

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: alertMessage,
	});

	return {
		success: true,
		errorCount: recentErrors,
		processedAt: new Date().toISOString(),
	};
}
