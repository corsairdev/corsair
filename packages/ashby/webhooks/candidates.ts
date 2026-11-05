import { logEventFromContext } from 'corsair/core';
import type { AshbyWebhooks } from '../index';
import { createAshbyMatch, verifyAshbyWebhookSignature } from './types';

export const stageChange: AshbyWebhooks['candidate.stageChange'] = {
	match: createAshbyMatch('candidateStageChange'),

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
		if (event.action !== 'candidateStageChange') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';
		if (ctx.db.candidates && event.data.candidateId) {
			try {
				const entity = await ctx.db.candidates.findById(event.data.candidateId);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to find candidate in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.candidateStageChange',
			{
				candidateId: event.data.candidateId,
				applicationId: event.data.applicationId,
				currentInterviewStageId: event.data.currentInterviewStageId,
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

export const hire: AshbyWebhooks['candidate.hire'] = {
	match: createAshbyMatch('candidateHire'),

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
		if (event.action !== 'candidateHire') {
			return {
				success: true,
				data: undefined,
			};
		}

		let corsairEntityId = '';
		if (ctx.db.candidates && event.data.candidateId) {
			try {
				const entity = await ctx.db.candidates.findById(event.data.candidateId);
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to find candidate in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'ashby.webhook.candidateHire',
			{
				candidateId: event.data.candidateId,
				applicationId: event.data.applicationId,
				offerId: event.data.offerId,
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
