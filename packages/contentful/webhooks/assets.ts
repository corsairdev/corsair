import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ContentfulContext, ContentfulWebhooks } from '..';
import type { ContentfulWebhookPayload } from './types';
import {
	createContentfulMatch,
	verifyContentfulWebhookSignature,
} from './types';

/** Handles Contentful Asset publish webhooks. */
export const publish: ContentfulWebhooks['assetPublish'] = {
	match: createContentfulMatch('ContentManagement.Asset.publish'),
	handler: async (
		ctx: ContentfulContext,
		request: WebhookRequest<ContentfulWebhookPayload>,
	) => {
		const verification = verifyContentfulWebhookSignature(
			request,
			ctx.key || '',
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		await logEventFromContext(
			ctx,
			'contentful.assetPublish',
			request.payload,
			'completed',
		);

		return { success: true, data: request.payload };
	},
};

/** Handles Contentful Asset unpublish webhooks. */
export const unpublish: ContentfulWebhooks['assetUnpublish'] = {
	match: createContentfulMatch('ContentManagement.Asset.unpublish'),
	handler: async (
		ctx: ContentfulContext,
		request: WebhookRequest<ContentfulWebhookPayload>,
	) => {
		const verification = verifyContentfulWebhookSignature(
			request,
			ctx.key || '',
		);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		await logEventFromContext(
			ctx,
			'contentful.assetUnpublish',
			request.payload,
			'completed',
		);

		return { success: true, data: request.payload };
	},
};
