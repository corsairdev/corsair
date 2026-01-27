import { inngest } from './client';

export const slackEventHandler = inngest.createFunction(
	{ id: 'slack-event-handler', retries: 3 },
	{ event: 'slack/event' },
	async ({ event, step }) => {
		const { tenantId, event: slackEvent } = event.data;

		console.log(
			`Processing Slack event for tenant ${tenantId}:`,
			slackEvent.type,
		);

		return await step.run('process-slack-event', async () => {
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

				return {
					success: true,
					eventType: slackEvent.type,
					processedAt: new Date().toISOString(),
				};
			} catch (error) {
				console.error('Error processing Slack event:', error);
				throw error;
			}
		});
	},
);

export const linearEventHandler = inngest.createFunction(
	{ id: 'linear-event-handler', retries: 3 },
	{ event: 'linear/event' },
	async ({ event, step }) => {
		const { tenantId, event: linearEvent } = event.data;

		console.log(
			`Processing Linear event for tenant ${tenantId}:`,
			linearEvent.type,
		);

		return await step.run('process-linear-event', async () => {
			try {
				// Process Linear event - add your business logic here
				// For example: sync with database, update related records, etc.

				console.log('Linear event details:', {
					type: linearEvent.type,
					action: linearEvent.action,
					tenant: tenantId,
					timestamp: new Date().toISOString(),
				});

				// Example: Access Linear API through Corsair if needed
				// const issues = await corsair.withTenant(tenantId).linear.api.issues.list();

				return {
					success: true,
					eventType: linearEvent.type,
					processedAt: new Date().toISOString(),
				};
			} catch (error) {
				console.error('Error processing Linear event:', error);
				throw error;
			}
		});
	},
);

export const functions = [slackEventHandler, linearEventHandler];
