import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { ContentfulContext, ContentfulWebhooks } from '..';
import type { ContentfulWebhookPayload } from './types';
import {
	createContentfulMatch,
	verifyContentfulWebhookSignature,
} from './types';

export const publish: ContentfulWebhooks['entryPublish'] = {
	match: createContentfulMatch('ContentManagement.Entry.publish'),
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
			'contentful.entryPublish',
			request.payload,
			'completed',
		);

		return { success: true, data: request.payload };
	},
};

export const unpublish: ContentfulWebhooks['entryUnpublish'] = {
	match: createContentfulMatch('ContentManagement.Entry.unpublish'),
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
			'contentful.entryUnpublish',
			request.payload,
			'completed',
		);

		return { success: true, data: request.payload };
	},
};
