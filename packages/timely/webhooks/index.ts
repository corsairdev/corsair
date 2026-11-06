import { logEventFromContext } from 'corsair/core';
import type { TimelyWebhook } from '..';
import type { TimelyWebhookAction, TimelyWebhookResource } from './types';
import {
	createTimelyMatch,
	TimelyWebhookPayloadSchema,
	timelyEventName,
	verifyTimelyWebhookSignature,
} from './types';

function createTimelyWebhook(
	resource: TimelyWebhookResource,
	action: TimelyWebhookAction,
): TimelyWebhook {
	const eventName = timelyEventName(resource, action);
	return {
		match: createTimelyMatch(eventName),
		handler: async (ctx, request) => {
			const verification = verifyTimelyWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Signature verification failed',
				};
			}

			const parsed = TimelyWebhookPayloadSchema.safeParse(request.payload);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: `Unexpected Timely webhook body: ${parsed.error.message}`,
				};
			}

			await logEventFromContext(
				ctx,
				`timely.webhook.${resource}.${action}`,
				{ event: parsed.data.event, ...parsed.data.payload },
				'completed',
			);

			return { success: true, data: parsed.data };
		},
	};
}

export const TimelyWebhookHandlers = {
	timeEntries: {
		created: createTimelyWebhook('timeEntries', 'created'),
		updated: createTimelyWebhook('timeEntries', 'updated'),
		deleted: createTimelyWebhook('timeEntries', 'deleted'),
	},
	projects: {
		created: createTimelyWebhook('projects', 'created'),
		updated: createTimelyWebhook('projects', 'updated'),
		deleted: createTimelyWebhook('projects', 'deleted'),
	},
	tags: {
		created: createTimelyWebhook('tags', 'created'),
		updated: createTimelyWebhook('tags', 'updated'),
		deleted: createTimelyWebhook('tags', 'deleted'),
	},
	tasks: {
		created: createTimelyWebhook('tasks', 'created'),
		updated: createTimelyWebhook('tasks', 'updated'),
		deleted: createTimelyWebhook('tasks', 'deleted'),
	},
};

export * from './types';
