import { logEventFromContext } from 'corsair/core';
import { cacheBanner } from '../cache-banner';
import type { AbyssaleWebhooks } from '../index';
import {
	createAbyssaleMatch,
	NewBannerBatchEventSchema,
	NewBannerEventSchema,
	verifyAbyssaleWebhookSignature,
} from './types';

export const created: AbyssaleWebhooks['newBanner'] = {
	match: createAbyssaleMatch('NEW_BANNER'),

	handler: async (ctx, request) => {
		const verification = verifyAbyssaleWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const parsed = NewBannerEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid NEW_BANNER payload',
			};
		}

		const event = parsed.data;
		const corsairEntityId = await cacheBanner(ctx, {
			id: event.id,
			version: event.version,
			sharing_id: event.sharing_id,
			file: event.file,
			format: event.format,
			template: event.template,
		});

		await logEventFromContext(
			ctx,
			'abyssale.webhook.newBanner',
			{
				banner_id: event.id,
				template_id: event.template?.id,
				format_id: event.format?.id,
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

export const batchCompleted: AbyssaleWebhooks['newBannerBatch'] = {
	match: createAbyssaleMatch('NEW_BANNER_BATCH'),

	handler: async (ctx, request) => {
		const verification = verifyAbyssaleWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const parsed = NewBannerBatchEventSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid NEW_BANNER_BATCH payload',
			};
		}

		const event = parsed.data;
		let firstEntityId = '';
		for (const banner of event.banners) {
			const entityId = await cacheBanner(ctx, banner);
			if (!firstEntityId) firstEntityId = entityId;
		}

		await logEventFromContext(
			ctx,
			'abyssale.webhook.newBannerBatch',
			{
				generation_request_id: event.generation_request_id,
				banner_count: event.banners.length,
				error_count: event.errors.length,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId: firstEntityId,
			data: event,
		};
	},
};
