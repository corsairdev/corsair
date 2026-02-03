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

		const result = await step.run('process-slack-event', async () => {
			try {
				// Process Slack event - add your business logic here
				// For example: store in database, send notifications, trigger workflows, etc.

				console.log('Slack event details:', {
					type: slackEvent.type,
					subtype: slackEvent.subtype,
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

		return result;
	},
);

export const linearIssueCreatedHandler = inngest.createFunction(
	{ id: 'linear-issue-created-handler', retries: 3 },
	{ event: 'linear/issue-created' },
	async ({ event, step }) => {
		const { tenantId, event: issueEvent } = event.data;
		const tenant = corsair.withTenant(tenantId);

		console.log(
			`Processing Linear issue created for tenant ${tenantId}:`,
			issueEvent.data.identifier,
		);

		const slackChannel = await step.run('get-slack-channel', async () => {
			return await getSlackChannel(tenantId, 'sdk-test');
		});

		const issue = issueEvent.data;
		const message = `*New Linear Issue Created*\n*Title:* ${issue.title || 'N/A'}\n*ID:* ${issue.identifier || 'N/A'}\n*URL:* ${issueEvent.url || 'N/A'}`;

		await step.run('send-slack-notification', async () => {
			await tenant.slack.api.messages.post({
				channel: slackChannel,
				text: message,
			});
		});

		const result = await step.run('process-linear-issue-created', async () => {
			return {
				success: true,
				eventType: issueEvent.type,
				action: issueEvent.action,
				issueId: issue.id,
				identifier: issue.identifier,
				processedAt: new Date().toISOString(),
			};
		});

		return result;
	},
);

export const linearIssueUpdatedHandler = inngest.createFunction(
	{ id: 'linear-issue-updated-handler', retries: 3 },
	{ event: 'linear/issue-updated' },
	async ({ event, step }) => {
		const { tenantId, event: issueEvent } = event.data;
		const tenant = corsair.withTenant(tenantId);

		console.log(
			`Processing Linear issue updated for tenant ${tenantId}:`,
			issueEvent.data.identifier,
		);

		const slackChannel = await step.run('get-slack-channel', async () => {
			return await getSlackChannel(tenantId, 'sdk-test');
		});

		const issue = issueEvent.data;
		const message = `*Linear Issue Updated*\n*Title:* ${issue.title || 'N/A'}\n*ID:* ${issue.identifier || 'N/A'}\n*URL:* ${issueEvent.url || 'N/A'}`;

		await step.run('send-slack-notification', async () => {
			await tenant.slack.api.messages.post({
				channel: slackChannel,
				text: message,
			});
		});

		const result = await step.run('process-linear-issue-updated', async () => {
			return {
				success: true,
				eventType: issueEvent.type,
				action: issueEvent.action,
				issueId: issue.id,
				identifier: issue.identifier,
				processedAt: new Date().toISOString(),
			};
		});

		return result;
	},
);

export const linearCommentCreatedHandler = inngest.createFunction(
	{ id: 'linear-comment-created-handler', retries: 3 },
	{ event: 'linear/comment-created' },
	async ({ event, step }) => {
		const { tenantId, event: commentEvent } = event.data;
		const tenant = corsair.withTenant(tenantId);

		console.log(
			`Processing Linear comment created for tenant ${tenantId}:`,
			commentEvent.data.id,
		);

		const slackChannel = await step.run('get-slack-channel', async () => {
			return await getSlackChannel(tenantId, 'sdk-test');
		});

		const comment = commentEvent.data;
		const issueId = comment.issueId || comment.issue?.id || 'N/A';
		const commentBody = comment.body || 'N/A';
		const truncatedBody =
			typeof commentBody === 'string' ? commentBody.substring(0, 200) : 'N/A';

		const message = `*New Comment on Linear Issue*\n*Issue ID:* ${issueId}\n*Comment:* ${truncatedBody}`;

		await step.run('send-slack-notification', async () => {
			await tenant.slack.api.messages.post({
				channel: slackChannel,
				text: message,
			});
		});

		const result = await step.run(
			'process-linear-comment-created',
			async () => {
				return {
					success: true,
					eventType: commentEvent.type,
					action: commentEvent.action,
					commentId: comment.id,
					issueId,
					processedAt: new Date().toISOString(),
				};
			},
		);

		return result;
	},
);

export const linearCommentUpdatedHandler = inngest.createFunction(
	{ id: 'linear-comment-updated-handler', retries: 3 },
	{ event: 'linear/comment-updated' },
	async ({ event, step }) => {
		const { tenantId, event: commentEvent } = event.data;
		const tenant = corsair.withTenant(tenantId);

		console.log(
			`Processing Linear comment updated for tenant ${tenantId}:`,
			commentEvent.data.id,
		);

		const slackChannel = await step.run('get-slack-channel', async () => {
			return await getSlackChannel(tenantId, 'sdk-test');
		});

		const comment = commentEvent.data;
		const issueId = comment.issueId || comment.issue?.id || 'N/A';
		const commentBody = comment.body || 'N/A';
		const truncatedBody =
			typeof commentBody === 'string' ? commentBody.substring(0, 200) : 'N/A';

		const message = `*Comment Updated on Linear Issue*\n*Issue ID:* ${issueId}\n*Comment:* ${truncatedBody}`;

		await step.run('send-slack-notification', async () => {
			await tenant.slack.api.messages.post({
				channel: slackChannel,
				text: message,
			});
		});

		const result = await step.run(
			'process-linear-comment-updated',
			async () => {
				return {
					success: true,
					eventType: commentEvent.type,
					action: commentEvent.action,
					commentId: comment.id,
					issueId,
					processedAt: new Date().toISOString(),
				};
			},
		);

		return result;
	},
);

export const resendEmailHandler = inngest.createFunction(
	{ id: 'resend-email-handler', retries: 3 },
	{ event: 'resend/email' },
	async ({ event, step }) => {
		const { tenantId, event: emailEvent } = event.data;

		console.log(
			`Processing Resend email event for tenant ${tenantId}:`,
			emailEvent.type,
		);

		const result = await step.run('process-resend-email', async () => {
			try {
				// Process Resend email event - add your business logic here
				// For example: store in database, send notifications, trigger workflows, etc.

				console.log('Resend email event details:', {
					type: emailEvent.type,
					emailId: emailEvent.data.email_id,
					from: emailEvent.data.from,
					to: emailEvent.data.to,
					subject: emailEvent.data.subject,
					tenant: tenantId,
					timestamp: new Date().toISOString(),
				});

				return {
					success: true,
					eventType: emailEvent.type,
					emailId: emailEvent.data.email_id,
					processedAt: new Date().toISOString(),
				};
			} catch (error) {
				console.error('Error processing Resend email event:', error);
				throw error;
			}
		});

		return result;
	},
);

export const issueReportedHandler = inngest.createFunction(
	{ id: 'issue-reported-handler', retries: 3 },
	{ event: 'issue/reported' },
	async ({ event, step }) => {
		const { tenantId, title, description } = event.data;
		const tenant = corsair.withTenant(tenantId);

		const result = await step.run('create-linear-issue', async () => {
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

		return result;
	},
);

export const functions = [
	slackEventHandler,
	linearIssueCreatedHandler,
	linearIssueUpdatedHandler,
	linearCommentCreatedHandler,
	linearCommentUpdatedHandler,
	resendEmailHandler,
	issueReportedHandler,
];
