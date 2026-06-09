import type { CorsairWebhook } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { VercelContext } from '../index';
import type { VercelWebhookOutputs } from './types';
import {
	createVercelMatch,
	DeploymentCreatedEventSchema,
	DeploymentErrorEventSchema,
	DeploymentSucceededEventSchema,
	verifyVercelWebhookSignature,
} from './types';

export const deploymentHandlers = {
	deploymentCreated: {
		match: createVercelMatch('deployment.created'),
		handler: async (ctx: VercelContext, request: any) => {
			const webhookSecret = ctx.key;
			if (!verifyVercelWebhookSignature(request, webhookSecret)) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid Vercel signature',
				};
			}
			const event = DeploymentCreatedEventSchema.parse(
				request.body || request.payload || request,
			);

			if (ctx.db.deployments) {
				await ctx.db.deployments.upsertByEntityId(event.payload.deployment.id, {
					...event.payload.deployment,
					uid: event.payload.deployment.id,
					created: event.createdAt || Date.now(),
					readyState: 'BUILDING',
				});
			}

			await logEventFromContext(
				ctx,
				'vercel.webhooks.deploymentCreated',
				{ ...event },
				'completed',
			);

			return { success: true, data: event };
		},
	} as CorsairWebhook<VercelContext, VercelWebhookOutputs['deploymentCreated']>,

	deploymentSucceeded: {
		match: createVercelMatch('deployment.succeeded'),
		handler: async (ctx: VercelContext, request: any) => {
			const webhookSecret = ctx.key;
			if (!verifyVercelWebhookSignature(request, webhookSecret)) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid Vercel signature',
				};
			}
			const event = DeploymentSucceededEventSchema.parse(
				request.body || request.payload || request,
			);

			if (ctx.db.deployments) {
				await ctx.db.deployments.upsertByEntityId(event.payload.deployment.id, {
					...event.payload.deployment,
					uid: event.payload.deployment.id,
					created: event.createdAt || Date.now(),
					readyState: 'READY',
				});
			}

			await logEventFromContext(
				ctx,
				'vercel.webhooks.deploymentSucceeded',
				{ ...event },
				'completed',
			);

			return { success: true, data: event };
		},
	} as CorsairWebhook<
		VercelContext,
		VercelWebhookOutputs['deploymentSucceeded']
	>,

	deploymentError: {
		match: createVercelMatch('deployment.error'),
		handler: async (ctx: VercelContext, request: any) => {
			const webhookSecret = ctx.key;
			if (!verifyVercelWebhookSignature(request, webhookSecret)) {
				return {
					success: false,
					statusCode: 401,
					error: 'Invalid Vercel signature',
				};
			}
			const event = DeploymentErrorEventSchema.parse(
				request.body || request.payload || request,
			);

			if (ctx.db.deployments) {
				await ctx.db.deployments.upsertByEntityId(event.payload.deployment.id, {
					...event.payload.deployment,
					uid: event.payload.deployment.id,
					created: event.createdAt || Date.now(),
					readyState: 'ERROR',
				});
			}

			await logEventFromContext(
				ctx,
				'vercel.webhooks.deploymentError',
				{ ...event },
				'completed',
			);

			return { success: true, data: event };
		},
	} as CorsairWebhook<VercelContext, VercelWebhookOutputs['deploymentError']>,
};
