import { logEventFromContext } from 'corsair/core';
import type { AshbyWebhooks } from '../index';
import { createAshbyMatch, verifyAshbyWebhookSignature } from './types';

export const scheduleCreate: AshbyWebhooks['interview.scheduleCreate'] = {
	match: createAshbyMatch('interviewScheduleCreate'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyAshbyWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.action !== 'interviewScheduleCreate') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.interviewScheduleCreate',
			{
				interviewScheduleId: event.data.interviewScheduleId,
				applicationId: event.data.applicationId,
			},
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const scheduleUpdate: AshbyWebhooks['interview.scheduleUpdate'] = {
	match: createAshbyMatch('interviewScheduleUpdate'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyAshbyWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.action !== 'interviewScheduleUpdate') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.interviewScheduleUpdate',
			{
				interviewScheduleId: event.data.interviewScheduleId,
				applicationId: event.data.applicationId,
				status: event.data.status,
			},
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const planTransition: AshbyWebhooks['interview.planTransition'] = {
	match: createAshbyMatch('interviewPlanTransition'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyAshbyWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;
		if (event.action !== 'interviewPlanTransition') {
			return {
				success: true,
				data: undefined,
			};
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.interviewPlanTransition',
			{
				applicationId: event.data.applicationId,
				interviewPlanId: event.data.interviewPlanId,
			},
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
