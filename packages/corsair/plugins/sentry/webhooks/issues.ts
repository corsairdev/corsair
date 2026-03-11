import { logEventFromContext } from '../../utils/events';
import type { SentryWebhooks } from '..';
import { createSentryMatch, verifySentryWebhookSignature } from './types';

export const issueCreated: SentryWebhooks['issueCreated'] = {
	match: createSentryMatch('issue', 'created'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const issue = event.data.issue;

		let corsairEntityId = '';

		if (ctx.db.issues && issue.id) {
			try {
				const entity = await ctx.db.issues.upsertByEntityId(issue.id, {
					id: issue.id,
					shortId: issue.shortId,
					title: issue.title,
					culprit: issue.culprit,
					level: issue.level,
					status: issue.status,
					platform: issue.platform,
					type: issue.type,
					permalink: issue.permalink,
					firstSeen: issue.firstSeen ? new Date(issue.firstSeen) : null,
					lastSeen: issue.lastSeen ? new Date(issue.lastSeen) : null,
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save issue to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.issueCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const issueResolved: SentryWebhooks['issueResolved'] = {
	match: createSentryMatch('issue', 'resolved'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const issue = event.data.issue;

		let corsairEntityId = '';

		if (ctx.db.issues && issue.id) {
			try {
				const entity = await ctx.db.issues.upsertByEntityId(issue.id, {
					id: issue.id,
					shortId: issue.shortId,
					title: issue.title,
					culprit: issue.culprit,
					level: issue.level,
					status: issue.status,
					platform: issue.platform,
					type: issue.type,
					permalink: issue.permalink,
					firstSeen: issue.firstSeen ? new Date(issue.firstSeen) : null,
					lastSeen: issue.lastSeen ? new Date(issue.lastSeen) : null,
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update issue in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.issueResolved',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const issueAssigned: SentryWebhooks['issueAssigned'] = {
	match: createSentryMatch('issue', 'assigned'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifySentryWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		const issue = event.data.issue;

		let corsairEntityId = '';

		if (ctx.db.issues && issue.id) {
			try {
				const entity = await ctx.db.issues.upsertByEntityId(issue.id, {
					id: issue.id,
					shortId: issue.shortId,
					title: issue.title,
					culprit: issue.culprit,
					level: issue.level,
					status: issue.status,
					platform: issue.platform,
					type: issue.type,
					permalink: issue.permalink,
					firstSeen: issue.firstSeen ? new Date(issue.firstSeen) : null,
					lastSeen: issue.lastSeen ? new Date(issue.lastSeen) : null,
				});

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update issue in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'sentry.webhook.issueAssigned',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
