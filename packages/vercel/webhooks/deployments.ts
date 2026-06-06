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
					uid: event.payload.deployment.id,
					name: event.payload.deployment.name,
					url: event.payload.deployment.url,
					created: event.createdAt || Date.now(),
					readyState: 'BUILDING',
					target: event.payload.deployment.target,
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
					uid: event.payload.deployment.id,
					name: event.payload.deployment.name,
					url: event.payload.deployment.url,
					created: event.createdAt || Date.now(),
					readyState: 'READY',
					target: event.payload.deployment.target,
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
					uid: event.payload.deployment.id,
					name: event.payload.deployment.name,
					url: event.payload.deployment.url,
					created: event.createdAt || Date.now(),
					readyState: 'ERROR',
					target: event.payload.deployment.target,
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
