// @ts-nocheck

import { corsair } from '@/server/corsair';
import { inngest } from './client';

async function getSlackChannel(tenantId: string, channelName: string) {
	const tenant = corsair.withTenant(tenantId);

	const sdkTestChannels = await tenant.slack.db.channels.search({
		data: { name: channelName },
	});

	let sdkTestChannel = sdkTestChannels?.[0];

	if (!sdkTestChannel?.id) {
		await tenant.slack.api.channels.list({
			exclude_archived: true,
		});

		const dbChannels = await tenant.slack.db.channels.search({
			data: { name: channelName },
		});

		sdkTestChannel = dbChannels?.[0];
	}

	if (!sdkTestChannel?.id) {
		throw new Error(`Couldn't find #${channelName} channel`);
	}

	return sdkTestChannel.entity_id;
}

export const slackEventHandler = inngest.createFunction(
	{ id: 'slack-event-handler', retries: 3 },
	{ event: 'slack/event' },
	async ({ event, step }) => {
		const { tenantId, event: slackEvent } = event.data;

		console.log(
			`Processing Slack event for tenant ${tenantId}:`,
			slackEvent.type,
		);

		await step.run('process-slack-event', async () => {
			try {
				// Process Slack event - add your business logic here
				// For example: store in database, send notifications, trigger workflows, etc.

				console.log('Slack event details:', {
					type: slackEvent.type,
					tenant: tenantId,
					timestamp: new Date().toISOString(),
				});

				// Example: Access Slack API through Corsair if needed
				// const channels = await corsair.withTenant(tenantId).slack.api.channels.list();
			} catch (error) {
				console.error('Error processing Slack event:', error);
				throw error;
			}
		});
	},
);

export const functions = [slackEventHandler];
