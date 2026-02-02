import { corsair } from '@/server/corsair';
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
		const tenant = corsair.withTenant(tenantId);

		console.log(
			`Processing Linear event for tenant ${tenantId}:`,
			linearEvent.type,
		);

		const sdkTestChannels = await tenant.slack.db.channels.search({
			query: 'sdk-test',
		});

		let sdkTestChannel = sdkTestChannels?.find(
			(channel) => channel?.data?.name === 'sdk-test',
		);

		if (!sdkTestChannel?.id) {
			await tenant.slack.api.channels.list({
				exclude_archived: true,
			});

			const dbChannels = await tenant.slack.db.channels.search({
				query: 'sdk-test',
			});

			sdkTestChannel = dbChannels?.find(
				(channel) => channel?.data?.name === 'sdk-test',
			);
		}

		if (!sdkTestChannel?.id) {
			throw new Error(`Couldn't find #sdk-test channel`);
		}

		const slackChannel = sdkTestChannel?.entity_id;

		const eventType = linearEvent.type;
		const action = linearEvent.action;
		const eventUrl = (linearEvent as any).url;

		let message: string | null = null;

		if (eventType === 'Issue' && (action === 'create' || action === 'update')) {
			const issue = linearEvent.data as any;
			message =
				action === 'create'
					? `*New Linear Issue Created*\n*Title:* ${issue.title || 'N/A'}\n*ID:* ${issue.identifier || 'N/A'}\n*URL:* ${eventUrl || 'N/A'}`
					: `*Linear Issue Updated*\n*Title:* ${issue.title || 'N/A'}\n*ID:* ${issue.identifier || 'N/A'}\n*URL:* ${eventUrl || 'N/A'}`;
		}

		if (
			eventType === 'Comment' &&
			(action === 'create' || action === 'update')
		) {
			const comment = linearEvent.data as any;
			const issueId = comment.issueId || comment.issue?.id || 'N/A';
			const commentBody = comment.body || 'N/A';
			const truncatedBody =
				typeof commentBody === 'string' ? commentBody.substring(0, 200) : 'N/A';

			message =
				action === 'create'
					? `*New Comment on Linear Issue*\n*Issue ID:* ${issueId}\n*Comment:* ${truncatedBody}`
					: `*Comment Updated on Linear Issue*\n*Issue ID:* ${issueId}\n*Comment:* ${truncatedBody}`;
		}

		if (message && slackChannel) {
			await step.run('send-slack-notification', async () => {
				await tenant.slack.api.messages.post({
					channel: slackChannel,
					text: message!,
				});
			});
		}

		return await step.run('process-linear-event', async () => {
			return {
				success: true,
				eventType: linearEvent.type,
				action: linearEvent.action,
				processedAt: new Date().toISOString(),
			};
		});
	},
);

export const issueReportedHandler = inngest.createFunction(
	{ id: 'issue-reported-handler', retries: 3 },
	{ event: 'issue/reported' },
	async ({ event, step }) => {
		const { tenantId, title, description } = event.data;
		const tenant = corsair.withTenant(tenantId);

		return await step.run('create-linear-issue', async () => {
			const teamId = process.env.LINEAR_TEAM_ID;

			if (!teamId) {
				console.warn('LINEAR_TEAM_ID not set, skipping Linear issue creation');
				return { success: false, reason: 'team_not_configured' };
			}

			const issue = await tenant.linear.api.issues.create({
				title,
				description: description || undefined,
				teamId,
			});

			return {
				success: true,
				issueId: issue.id,
				identifier: issue.identifier,
				processedAt: new Date().toISOString(),
			};
		});
	},
);

export const functions = [
	slackEventHandler,
	linearEventHandler,
	issueReportedHandler,
];
