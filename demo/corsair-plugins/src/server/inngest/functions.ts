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

		const slackChannel = process.env.SLACK_LINEAR_CHANNEL_ID;

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
				const slackMessages = (tenant as any).slack?.api?.messages;
				if (!slackMessages) {
					throw new Error('Slack messages API is not available');
				}
				await slackMessages.post({
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

			const linearIssues = (tenant as any).linear?.api?.issues;
			if (!linearIssues) {
				throw new Error('Linear issues API is not available');
			}

			const issue = await linearIssues.create({
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

export const githubStarCreatedHandler = inngest.createFunction(
	{ id: 'github-star-created-handler', retries: 3 },
	{ event: 'github/star' },
	async ({ event, step }) => {
		const { tenantId, sender, repository } = event.data;

		const tenant = corsair.withTenant(tenantId);
		const slackChannel = process.env.SLACK_GITHUB_STARS_CHANNEL_ID;

		if (!slackChannel) {
			return { success: false, reason: 'slack_channel_not_configured' };
		}

		const senderName = sender.name || sender.login || 'Unknown';
		const senderEmail = sender.email || 'unknown';
		const repoName = repository.full_name || 'unknown repo';

		const message = `⭐ *New GitHub Star*\n*Repo:* ${repoName}\n*Name:* ${senderName}\n*Email:* ${senderEmail}`;

		await step.run('send-slack-notification', async () => {
			const slackMessages = (tenant as any).slack?.api?.messages;
			if (!slackMessages) {
				throw new Error('Slack messages API is not available');
			}
			await slackMessages.post({
				channel: slackChannel,
				text: message,
			});
		});

		return { success: true, processedAt: new Date().toISOString() };
	},
);

export const resendEmailReceivedHandler = inngest.createFunction(
	{ id: 'resend-email-received-handler', retries: 3 },
	{ event: 'resend/email' },
	async ({ event, step }) => {
		const { tenantId, from, to, subject, text, html } = event.data;

		const tenant = corsair.withTenant(tenantId);
		const slackChannel = process.env.SLACK_RESEND_CHANNEL_ID;
		const teamId = process.env.LINEAR_TEAM_ID;

		const slackMessage = `📬 *Inbound Email Received*\n*From:* ${from}\n*To:* ${to}\n*Subject:* ${subject}`;

		if (slackChannel) {
			await step.run('send-slack-notification', async () => {
				const slackMessages = (tenant as any).slack?.api?.messages;
				if (!slackMessages) {
					throw new Error('Slack messages API is not available');
				}
				await slackMessages.post({
					channel: slackChannel,
					text: slackMessage,
				});
			});
		}

		if (!teamId) {
			return { success: false, reason: 'linear_team_not_configured' };
		}

		const linearTitle = `Inbound email: ${subject}`;
		const linearDescription = `From: ${from}\nTo: ${to}\n\n${text || html || ''}`;

		const issue = await step.run('create-linear-issue', async () => {
			const linearIssues = (tenant as any).linear?.api?.issues;
			if (!linearIssues) {
				throw new Error('Linear issues API is not available');
			}

			return await linearIssues.create({
				title: linearTitle,
				description: linearDescription,
				teamId,
			});
		});

		return {
			success: true,
			issueId: issue.id,
			identifier: issue.identifier,
			processedAt: new Date().toISOString(),
		};
	},
);

export const functions = [
	slackEventHandler,
	linearEventHandler,
	issueReportedHandler,
	githubStarCreatedHandler,
	resendEmailReceivedHandler,
];
