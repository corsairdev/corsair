import { corsair } from '@/server/corsair';
import { getSlackChannel } from '../helpers';

export async function notifyOnPosthogFeatureFlagChanges(params: {
	tenantId: string;
	event: any;
}) {
	const { tenantId, event: flagEvent } = params;
	const tenant = corsair.withTenant(tenantId);

	const flagData = {
		flagKey: flagEvent.data?.key || 'unknown',
		enabled: flagEvent.data?.enabled || false,
		previousState: flagEvent.data?.previous_enabled || false,
		changedBy: flagEvent.data?.changed_by || 'Unknown',
	};

	const slackChannel = await getSlackChannel(tenantId, 'engineering');

	let changeType;
	if (!flagData.previousState && flagData.enabled) {
		changeType = 'enabled';
	} else if (flagData.previousState && !flagData.enabled) {
		changeType = 'disabled';
	} else {
		changeType = 'updated';
	}

	const emoji = changeType === 'enabled' ? '🟢' : changeType === 'disabled' ? '🔴' : '🟡';
	const message = `${emoji} *PostHog Feature Flag ${changeType.toUpperCase()}*\n*Flag:* ${flagData.flagKey}\n*Previous State:* ${flagData.previousState ? 'Enabled' : 'Disabled'}\n*New State:* ${flagData.enabled ? 'Enabled' : 'Disabled'}\n*Changed By:* ${flagData.changedBy}\n*Time:* ${new Date().toISOString()}`;

	await tenant.slack.api.messages.post({
		channel: slackChannel,
		text: message,
	});

	return {
		success: true,
		flagKey: flagData.flagKey,
		changeType,
		processedAt: new Date().toISOString(),
	};
}
