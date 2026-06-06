import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { VercelContext } from '../index';
import type { VercelWebhookOutputs } from './types';
import {
	createVercelMatch,
	ProjectCreatedEventSchema,
	verifyVercelWebhookSignature,
} from './types';

export const projectHandlers = {
	projectCreated: {
		match: createVercelMatch('project.created'),
		handler: async (ctx: VercelContext, request: any) => {
			const webhookSecret = ctx.key;
			if (!verifyVercelWebhookSignature(request, webhookSecret)) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid Vercel signature',
				};
			}
			const event = ProjectCreatedEventSchema.parse(
				request.body || request.payload || request,
			);

			if (ctx.db.projects) {
				await ctx.db.projects.upsertByEntityId(event.payload.project.id, {
					id: event.payload.project.id,
					name: event.payload.project.name,
					createdAt: event.createdAt || Date.now(),
					updatedAt: event.createdAt || Date.now(),
				});
			}

			await logEventFromContext(
				ctx,
				'vercel.webhooks.projectCreated',
				{ ...event },
				'completed',
			);

			return { success: true, data: event };
		},
	} as CorsairWebhook<VercelContext, VercelWebhookOutputs['projectCreated']>,
};
