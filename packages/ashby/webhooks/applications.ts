import { logEventFromContext } from 'corsair/core';
import type { AshbyWebhooks } from '../index';
import { createAshbyMatch, verifyAshbyWebhookSignature } from './types';

export const submit: AshbyWebhooks['application.submit'] = {
	match: createAshbyMatch('applicationSubmit'),

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
		if (event.action !== 'applicationSubmit') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';
		if (ctx.db.applications && event.data.applicationId) {
			try {
				const entity = await ctx.db.applications.findById(
					event.data.applicationId,
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to find application in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.applicationSubmit',
			{
				applicationId: event.data.applicationId,
				candidateId: event.data.candidateId,
				jobId: event.data.jobId,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const update: AshbyWebhooks['application.update'] = {
	match: createAshbyMatch('applicationUpdate'),

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
		if (event.action !== 'applicationUpdate') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';
		if (ctx.db.applications && event.data.applicationId) {
			try {
				const entity = await ctx.db.applications.findById(
					event.data.applicationId,
				);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to find application in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.applicationUpdate',
			{
				applicationId: event.data.applicationId,
				candidateId: event.data.candidateId,
				status: event.data.status,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};
