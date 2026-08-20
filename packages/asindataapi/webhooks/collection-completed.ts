import { logEventFromContext } from 'corsair/core';
import type { AsinDataApiWebhooks } from '..';
import {
	createAsinDataApiMatch,
	verifyAsinDataApiWebhookSignature,
} from './types';

/**
 * Handles Collection completion webhooks.
 *
 * Fires when a scheduled or manually started Collection finishes and
 * a new Result Set is available. The payload contains the Collection
 * details and download links for the Result Set.
 *
 * Docs: https://docs.trajectdata.com/asindataapi/collections-api/collections/webhook
 */
export const collectionCompleted: AsinDataApiWebhooks['collectionCompleted'] = {
	match: createAsinDataApiMatch('collection_resultset_completed'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyAsinDataApiWebhookSignature(
			request,
			webhookSecret,
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.request_info?.type !== 'collection_resultset_completed') {
			return { success: true, data: undefined };
		}

		await logEventFromContext(
			ctx,
			'asindataapi.webhook.collectionCompleted',
			{
				collectionId: event.collection?.id,
				resultSetId: event.result_set?.id,
			},
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
